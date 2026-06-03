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
  
  // Use custom sitemap generation for comprehensive content
  additionalPaths: async (config) => {
    const paths = [];

    // Failure tracking: a transient backend blip must not silently ship a
    // dangerously reduced sitemap. We record whether each section ERRORED and how
    // many URLs it produced, then fail the build only on a clear TOTAL outage
    // (a section errored AND collected zero URLs). A partial-but-substantial run
    // is kept with a loud warning.
    let productCount = 0;
    let postCount = 0;
    let productErrored = false;
    let postErrored = false;

    const perPage = 100;

    // ── Product categories ──────────────────────────────────────────────────
    try {
      const categories = await fetchJsonWithRetry(
        'https://blog.samanportable.com/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2',
        'product categories'
      );
      (Array.isArray(categories) ? categories : []).forEach((category) => {
        if (category.slug && category.slug !== 'uncategorized') {
          paths.push({
            loc: `/product-category/${category.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      console.error(`[next-sitemap] Product categories fetch failed: ${error && error.message}`);
    }

    // ── Products (paginated) ────────────────────────────────────────────────
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const productsUrl = `https://blog.samanportable.com/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2&_embed`;
      try {
        const products = await fetchJsonWithRetry(productsUrl, `products page ${page}`);
        if (!Array.isArray(products) || products.length === 0) {
          hasMore = false;
        } else {
          products.forEach((product) => {
            if (product.slug && product.categories && product.categories.length > 0) {
              const primaryCategory = product.categories[0];
              paths.push({
                loc: `/product/${primaryCategory.slug}/${product.slug}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: new Date(product.date_modified || product.date_created).toISOString(),
              });
              productCount++;
            }
          });
          page++;
          // Small inter-request delay so a long catalog pull never bursts the backend.
          await sitemapDelay(150);
        }
      } catch (error) {
        const status = error && error.status;
        const clientErr = typeof status === 'number' && status >= 400 && status < 500 && status !== 429;
        if (clientErr && page > 1) {
          // Paged past the last page (clean end of pagination) — not a failure.
          hasMore = false;
        } else {
          // Real failure (5xx/timeout/network, or a 4xx on the very first page).
          // Record it so the guard below can decide whether the partial result ships.
          productErrored = true;
          console.error(`[next-sitemap] Products fetch aborted at page ${page}: ${error && error.message}`);
          hasMore = false;
        }
      }
    }

    // ── Blog posts (paginated) ──────────────────────────────────────────────
    // Posts use a smaller page size than products: the WordPress backend returns
    // HTTP 500 when serializing 100 fully-_embed'd posts at deeper offsets (a PHP
    // memory/execution limit, not corrupt content — every post is individually
    // valid). per_page=50 succeeds across the full range, so all ~870 posts are
    // captured instead of truncating at the first oversized page.
    const POSTS_PER_PAGE = 50;
    page = 1;
    hasMore = true;
    while (hasMore) {
      const postsUrl = `https://blog.samanportable.com/wp-json/wp/v2/posts?page=${page}&per_page=${POSTS_PER_PAGE}&_embed`;
      try {
        const posts = await fetchJsonWithRetry(postsUrl, `posts page ${page}`);
        if (!Array.isArray(posts) || posts.length === 0) {
          hasMore = false;
        } else {
          posts.forEach((post) => {
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
          page++;
          await sitemapDelay(150);
        }
      } catch (error) {
        const status = error && error.status;
        const clientErr = typeof status === 'number' && status >= 400 && status < 500 && status !== 429;
        if (clientErr && page > 1) {
          // Paged past the last page (clean end of pagination) — not a failure.
          hasMore = false;
        } else {
          // Real failure (5xx/timeout/network, or a 4xx on the very first page).
          postErrored = true;
          console.error(`[next-sitemap] Posts fetch aborted at page ${page}: ${error && error.message}`);
          hasMore = false;
        }
      }
    }

    // ── Total-outage guard ──────────────────────────────────────────────────
    // Fail the build (rather than ship an empty/near-empty sitemap) only when a
    // section both ERRORED and produced ZERO URLs — an unambiguous backend outage.
    // This is the safe outcome for the deploy that triggered this work: a failed
    // build keeps the previous, working deployment live instead of publishing a
    // sitemap that omits the entire catalog/blog.
    if (productErrored && productCount === 0) {
      throw new Error('[next-sitemap] Aborting build: product fetch failed and produced 0 product URLs (backend outage). Not shipping a truncated sitemap.');
    }
    if (postErrored && postCount === 0) {
      throw new Error('[next-sitemap] Aborting build: blog post fetch failed and produced 0 post URLs (backend outage). Not shipping a truncated sitemap.');
    }
    if (productErrored || postErrored) {
      console.warn(`[next-sitemap] WARNING: dynamic fetch was partial (products=${productCount}, posts=${postCount}). Sitemap may be incomplete — investigate backend availability.`);
    } else {
      console.log(`[next-sitemap] Collected ${productCount} product + ${postCount} post URLs.`);
    }

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
