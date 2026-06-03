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
    
    try {
      
      
      // Fetch product categories
      
      const categoriesResponse = await fetch(
        'https://blog.samanportable.com/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2'
      );
      
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        categories.forEach(category => {
          if (category.slug && category.slug !== 'uncategorized') {
            paths.push({
              loc: `/product-category/${category.slug}`,
              changefreq: 'weekly',
              priority: 0.8,
              lastmod: new Date().toISOString(),
            });
          }
        });
        
      }
      
      // Fetch products with pagination
      
      let page = 1;
      let hasMore = true;
      const perPage = 100;
      
      while (hasMore) {
        const productsUrl = `https://blog.samanportable.com/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2&_embed`;
        
        const productsResponse = await fetch(productsUrl);
        if (productsResponse.ok) {
          const products = await productsResponse.json();
          
          if (products.length === 0) {
            hasMore = false;
          } else {
            products.forEach(product => {
              if (product.slug && product.categories && product.categories.length > 0) {
                const primaryCategory = product.categories[0];
                paths.push({
                  loc: `/product/${primaryCategory.slug}/${product.slug}`,
                  changefreq: 'weekly',
                  priority: 0.8,
                  lastmod: new Date(product.date_modified || product.date_created).toISOString(),
                });
              }
            });
            
            page++;
          }
        } else {
          hasMore = false;
        }
      }
      
      // Fetch blog posts with pagination
      
      page = 1;
      hasMore = true;
      let totalPostsFetched = 0;
      
      while (hasMore) {
        const postsUrl = `https://blog.samanportable.com/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_embed`;
        
        try {
          const postsResponse = await fetch(postsUrl);
          
          
          if (postsResponse.ok) {
            const posts = await postsResponse.json();
            
            if (posts.length === 0) {
              
              hasMore = false;
            } else {
              posts.forEach(post => {
                if (post.slug) {
                  paths.push({
                    loc: `/${post.slug}`,
                    changefreq: 'monthly',
                    priority: 0.6,
                    lastmod: new Date(post.modified || post.date).toISOString(),
                  });
                }
              });
              totalPostsFetched += posts.length;
              
              page++;
              
              // Add a small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } else {
            
            hasMore = false;
          }
        } catch (error) {
          
          hasMore = false;
        }
      }
      
      
      
      
      
    } catch (error) {

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
