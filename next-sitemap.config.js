/** @type {import('next-sitemap').IConfig} */

// ── Redirect-aware sitemap filtering ─────────────────────────────────────────
// The sitemap is built from the WordPress/WooCommerce API, which still emits
// legacy slugs that the live site 301-redirects. Listing those URLs in the
// sitemap triggers Google's "Page with redirect" exclusion. To prevent that,
// every URL that is a known redirect source is dropped before it reaches the
// sitemap. Sources of truth (read at build time, never hand-maintained here):
//   1. redirects-from-csv.js      – bulk 301s (required directly as a baseline)
//   2. next.config.js redirects() – manual 301s (+ the CSV, de-duplicated)
//   3. /product/{x}/{x} pattern   – WooCommerce category-placeholder products
//      whose slug equals their category; these redirect at the route level and
//      are not in any static map, so they are matched structurally.
const csvRedirects = require('./redirects-from-csv');

/** Normalize a path for comparison: ensure a leading slash, drop trailing slash. */
function normalizeRedirectPath(p) {
  if (typeof p !== 'string') return '';
  let s = p.trim();
  if (!s) return '';
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

/** WooCommerce category-placeholder products: /product/{a}/{a} where a === a. */
function isDuplicateProductSegment(path) {
  const m = /^\/product\/([^/]+)\/([^/]+)$/.exec(path);
  return !!m && m[1] === m[2];
}

/** Collect literal redirect SOURCE paths only (never destinations or patterns). */
function collectRedirectSources(list, set) {
  if (!Array.isArray(list)) return;
  for (const entry of list) {
    if (!entry || typeof entry.source !== 'string') continue;
    // Skip conditional (host/cookie/header) and wildcard/param redirects — they
    // are not concrete URLs and must never be treated as sitemap entries.
    if (entry.has || entry.missing) continue;
    if (entry.source.includes(':') || entry.source.includes('*')) continue;
    const norm = normalizeRedirectPath(entry.source);
    if (norm) set.add(norm);
  }
}

// Build the redirect-source set exactly once (promise-memoized so concurrent
// additionalPaths/transform calls share a single build).
let redirectSourcePromise = null;
function getRedirectSources() {
  if (redirectSourcePromise) return redirectSourcePromise;
  redirectSourcePromise = (async () => {
    const set = new Set();
    // Baseline: the bulk CSV redirects (always available via sync require).
    collectRedirectSources(csvRedirects, set);
    // Additive: manual redirects from next.config.js (this also re-includes the
    // CSV, which the Set de-duplicates). Wrapped in try/catch so a future config
    // change can never crash sitemap generation — the CSV baseline still applies.
    try {
      const nextConfig = require('./next.config.js');
      if (nextConfig && typeof nextConfig.redirects === 'function') {
        collectRedirectSources(await nextConfig.redirects(), set);
      }
    } catch (err) {
      console.warn('[next-sitemap] Skipped next.config redirects:', err && err.message);
    }
    return set;
  })();
  return redirectSourcePromise;
}

/** True when a path must be kept OUT of the sitemap because the site redirects it. */
function isRedirectingPath(path, redirectSources) {
  const norm = normalizeRedirectPath(path);
  if (!norm) return false;
  return redirectSources.has(norm) || isDuplicateProductSegment(norm);
}

// ── Resilient build-time fetch ───────────────────────────────────────────────
// The sitemap is generated at build time by fetching the WordPress/WooCommerce
// API. A transient backend hiccup during a deploy used to silently truncate the
// sitemap (a `!ok` response just stopped the loop), shipping a dangerously
// reduced URL list. To avoid that, every fetch here goes through a bounded retry
// with a hard timeout and a small inter-request delay (never an aggressive burst).
// Returns the parsed JSON on success; throws on a network error, timeout, or a
// non-OK response that survives all retries — so the caller can decide whether a
// partial result is safe to ship or the build should fail.
const SITEMAP_FETCH_TIMEOUT_MS = 15000;
const SITEMAP_FETCH_RETRIES = 3;

function sitemapDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url, label) {
  let lastStatus = 0;
  for (let attempt = 1; attempt <= SITEMAP_FETCH_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SITEMAP_FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        return await res.json();
      }
      lastStatus = res.status;
      const transient = res.status === 408 || res.status === 429 || (res.status >= 500 && res.status <= 599);
      if (!transient) {
        // Non-transient 4xx (e.g. WordPress 400 "rest_post_invalid_page_number"
        // once we page past the last page, or 401/403/404). It will not recover on
        // retry, so throw immediately with the status attached and let the caller
        // decide whether this is a clean end-of-pagination or a real failure.
        const err = new Error(`[next-sitemap] ${label}: HTTP ${res.status}`);
        err.status = res.status;
        throw err;
      }
      console.warn(`[next-sitemap] ${label}: HTTP ${res.status} (attempt ${attempt}/${SITEMAP_FETCH_RETRIES})`);
    } catch (err) {
      clearTimeout(timer);
      if (err && typeof err.status === 'number') throw err; // non-transient → final, no retry
      console.warn(`[next-sitemap] ${label}: ${err && err.message ? err.message : 'fetch error'} (attempt ${attempt}/${SITEMAP_FETCH_RETRIES})`);
    }
    if (attempt < SITEMAP_FETCH_RETRIES) {
      await sitemapDelay(400 * attempt);
    }
  }
  const exhausted = new Error(`[next-sitemap] ${label}: failed after ${SITEMAP_FETCH_RETRIES} attempts${lastStatus ? ` (last HTTP ${lastStatus})` : ''}`);
  exhausted.status = lastStatus || undefined;
  throw exhausted;
}

// WooCommerce credentials for build-time sitemap fetches — read-only key, from env
// only (no hardcoded fallback). In DigitalOcean these are injected as build env vars;
// locally they come from the shell environment. A missing key yields a 401, which the
// build-fail guard surfaces loudly rather than silently shipping a truncated sitemap.
const WC_BASE = (process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json') + '/wc/v3';
const WC_KEY = process.env.WORDPRESS_CONSUMER_KEY || '';
const WC_SECRET = process.env.WORDPRESS_CONSUMER_SECRET || '';

module.exports = {
  siteUrl: 'https://www.samanportable.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://www.samanportable.com/sitemap.xml',
    ],
    sitemap: 'https://www.samanportable.com/sitemap.xml',
  },
  exclude: [
    '/api/*',
    '/_next/*',
    '/admin/*',
    '/checkout',
    '/cart',
    '/my-orders',
    '/test-optimizations',
  ],
  generateIndexSitemap: false,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  outDir: 'public',
  
  // Sitemap content comes from the exported static files (src/data/wp-export/) —
  // the same source the pages render from. No WordPress fetch at build time, so a
  // backend outage can never fail the build or truncate the sitemap. Only the 467
  // keeper set is emitted: the 634 redirected legacy posts no longer pollute it.
  additionalPaths: async (config) => {
    const fs = require('fs');
    const path = require('path');
    const EXPORT_DIR = path.join(process.cwd(), 'src', 'data', 'wp-export');

    const readDirJson = (sub) =>
      fs
        .readdirSync(path.join(EXPORT_DIR, sub))
        .filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, sub, f), 'utf-8')));

    const paths = [];
    let productCount = 0;
    let postCount = 0;

    // ── Product categories ──────────────────────────────────────────────────
    readDirJson('categories').forEach((category) => {
      if (category.slug && category.slug !== 'uncategorized') {
        paths.push({
          loc: `/product-category/${category.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date().toISOString(),
        });
      }
    });

    // ── Products ────────────────────────────────────────────────────────────
    // Published only (the one legit draft is 308-redirected and stays out).
    // Hub products (slug === primary category slug) live at the 2-segment URL;
    // emitting /product/x/x would point Google at a redirect.
    readDirJson('products').forEach((product) => {
      if (product.status && product.status !== 'publish') return;
      if (!product.slug || !product.categories || product.categories.length === 0) return;
      const primaryCategory = product.categories[0];
      const loc =
        primaryCategory.slug === product.slug
          ? `/product/${product.slug}`
          : `/product/${primaryCategory.slug}/${product.slug}`;
      paths.push({
        loc,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date(product.date_modified || product.date_created).toISOString(),
      });
      productCount++;
    });

    // ── Blog posts (the 236 keepers) ────────────────────────────────────────
    readDirJson('posts').forEach((post) => {
      if (post.slug) {
        paths.push({
          loc: `/${post.slug}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: new Date(post.modified || post.date).toISOString(),
        });
        postCount++;
      }
    });

    if (productCount === 0 || postCount === 0) {
      throw new Error(
        `[next-sitemap] Aborting build: static export incomplete (products=${productCount}, posts=${postCount}). src/data/wp-export/ is missing or empty.`
      );
    }
    console.log(`[next-sitemap] Collected ${productCount} product + ${postCount} post URLs from static export.`);

    // Drop any URL that the live site 301-redirects so the sitemap only lists
    // canonical 200 pages. additionalPaths bypass `exclude`/`transform`, so this
    // is the one place the WooCommerce/WordPress-derived URLs can be filtered.
    const redirectSources = await getRedirectSources();
    const kept = paths.filter((p) => p && p.loc && !isRedirectingPath(p.loc, redirectSources));
    const removed = paths.length - kept.length;
    if (removed > 0) {
      console.log(`[next-sitemap] Excluded ${removed} redirecting URL(s) from sitemap; kept ${kept.length}.`);
    }

    return kept;
  },
  
  transform: async (config, path) => {
    // Never emit a URL the live site redirects. Covers auto-discovered routes
    // (additionalPaths are filtered separately, before they reach here).
    const redirectSources = await getRedirectSources();
    if (isRedirectingPath(path, redirectSources)) {
      return null;
    }

    // Custom priority and changefreq for different page types
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/product-category/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/product/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/blog')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/container-rent-services/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Default for other pages
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
