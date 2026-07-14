/** @type {import('next').NextConfig} */
// AUTO-GENERATED CSV redirects (572 entries) – do not edit redirects-from-csv.js by hand.
const csvRedirects = require('./redirects-from-csv');
const customProductCanonicalPaths = require('./src/lib/customProductCanonicalPaths.json');

const customProductDuplicateRedirects = customProductCanonicalPaths
  .map(({ slug, categorySlug, canonicalPath }) => ({
    source: `/product/${categorySlug}/${slug}`,
    destination: `https://www.samanportable.com${canonicalPath}`,
    statusCode: 301,
  }))
  .filter(({ source, destination }) => source !== new URL(destination).pathname);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Webpack configuration with memory threshold - OPTIMIZED
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable caching completely in development
      config.cache = false;
      
      // Set memory threshold to 1GB for better performance
      config.performance = {
        ...config.performance,
        maxEntrypointSize: 1 * 1024 * 1024, // 1MB - Reduced from 2MB
        maxAssetSize: 1 * 1024 * 1024, // 1MB - Reduced from 2MB
        hints: false
      };

      // Do not minimize in development to keep HMR stable
      if (config.optimization) {
        config.optimization.minimize = false;
      }
    }

    // Enable optimizations only in production - OPTIMIZED
    // Disabled custom splitChunks override as it interferes with standard Next.js page generation.
    /*
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 15000, // Reduced from 20000
          maxSize: 200000, // Reduced from 244000
          minChunks: 1,
          maxAsyncRequests: 20, // Reduced from 30
          maxInitialRequests: 20, // Reduced from 30
          automaticNameDelimiter: '~',
          enforceSizeThreshold: 40000, // Reduced from 50000
          cacheGroups: {
            defaultVendors: {
              test: /[\\\/]node_modules[\\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            // Add specific chunk splitting for large libraries
            react: {
              test: /[\\\/]node_modules[\\\/](react|react-dom)[\\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 10,
            },
            ui: {
              test: /[\\\/]node_modules[\\\/](@radix-ui|lucide-react)[\\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 5,
            },
            // Enhanced chunk splitting for better performance
            vendor: {
              test: /[\\\/]node_modules[\\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 5,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 1,
            },
          },
        },
      };
    }
    */

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.samanportable.com',
      },
      {
        protocol: 'https',
        hostname: 'samanportable.com',
      },
      {
        protocol: 'https',
        hostname: 'www.samanportable.com',
      },
      {
        protocol: 'https',
        hostname: '*.samanportable.com',
      },
      // Add WooCommerce specific domains for product images
      {
        protocol: 'https',
        hostname: 'woocommerce.samanportable.com',
      },
      {
        protocol: 'https',
        hostname: 'shop.samanportable.com',
      },
      // Add external image domains
      {
        protocol: 'https',
        hostname: 'images.surferseo.art',
      },
      {
        protocol: 'https',
        hostname: '*.surferseo.art',
      },
      // Legitimate external blog hosts discovered during audit
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      }
    ],
    formats: ['image/webp'], // Only WebP for faster processing, removed AVIF
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Reduced sizes for faster processing
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Reduced sizes for faster processing
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days for better balance
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // SHIKHAR T12 (2026-07-14): the `loader: 'custom'` + `loaderFile: './image-loader.js'`
    // bypass is REMOVED, restoring the built-in /_next/image optimizer. The loader was an
    // emergency fix for the optimizer's server-side fetch of Hostinger-hosted blog images
    // (ECONNRESET), but registering a loaderFile disables the optimizer for EVERY source,
    // so all local /public images lost resize/srcset/WebP as collateral damage. The
    // formats/deviceSizes/imageSizes/quality settings above were dead config until now.
    //
    // The optimizer must still never server-fetch Hostinger. That is enforced at the call
    // sites, not here: every remote (absolute-URL) image is passed `unoptimized` via
    // isRemoteImageSrc() in src/lib/imageSrc.ts, so the browser fetches it directly exactly
    // as it does today. Local /public images are optimized by the server from disk.
    // STAGING ONLY: when the env-gated Google block is on (goldfish), serve images
    // unoptimized. The optimizer fetches LOCAL public/ images via an internal HTTP
    // self-request that carries no credentials, so the 401 wall breaks it (blank
    // images). Unoptimized <img> tags are fetched by the BROWSER, which sends the
    // staging credentials — images render and the wall stays fully intact.
    // Production (env unset) => false => image optimization enabled, identical to before.
    unoptimized: process.env.STAGING_GOOGLE_BLOCK === '1'

  },

  // Force HTTPS and WWW redirects
  async redirects() {
    const redirects = [
      // Custom product pages must not also resolve at their WooCommerce
      // category-nested mirror paths. Keep all cards/sitemaps on the canonical
      // custom URL and send any discovered duplicates there.
      ...customProductDuplicateRedirects,

      // Product singular-to-canonical plural redirects (owner-approved 2026-07-01).
      // Absolute destinations keep these migration URLs single-hop.
      { source: '/product/container-office', destination: 'https://www.samanportable.com/product/container-offices', statusCode: 301 },
      { source: '/product/container-house', destination: 'https://www.samanportable.com/product/container-houses', statusCode: 301 },
      { source: '/product/porta-cabin', destination: 'https://www.samanportable.com/product/porta-cabins', statusCode: 301 },
      { source: '/product/security-cabin', destination: 'https://www.samanportable.com/product/security-cabins', statusCode: 301 },
      { source: '/product/labour-colony', destination: 'https://www.samanportable.com/product/labor-colony', statusCode: 301 },
      { source: '/product/wall-sheets', destination: 'https://www.samanportable.com/product/wall-sheet', statusCode: 301 },

      // Labour Colony dead indexed URLs (owner-approved 2026-07-04).
      // Absolute destination keeps both www and apex requests single-hop to the money page.
      { source: '/product/prefab-labour-colony', destination: 'https://www.samanportable.com/product/labor-colony', statusCode: 301 },
      { source: '/prefab-labour-colony', destination: 'https://www.samanportable.com/product/labor-colony', statusCode: 301 },
      { source: '/labor-colony', destination: 'https://www.samanportable.com/product/labor-colony', statusCode: 301 },
      { source: '/know-what-is-use-of-labour-colony-its-advantages-and-features', destination: 'https://www.samanportable.com/product/labor-colony', statusCode: 301 },
      { source: '/labour-colony-is-the-ultimate-option-for-entrepreneurs', destination: 'https://www.samanportable.com/product/labor-colony', statusCode: 301 },

      { source: '/product-tag/second-hand-office-containers-for-sale', destination: 'https://www.samanportable.com/affordable-office-containers-for-sale', statusCode: 301 },

      // Root-level product alias fixes from 2026-07-02 crawl 4xx report.
      { source: '/site-office-container', destination: 'https://www.samanportable.com/product/container-offices/site-office-container', statusCode: 301 },
      { source: '/modular-container-office', destination: 'https://www.samanportable.com/product/container-offices/modular-container-office', statusCode: 301 },
      { source: '/prefabricated-container-office', destination: 'https://www.samanportable.com/product/container-offices/prefabricated-container-office', statusCode: 301 },
      { source: '/container-office-cabin', destination: 'https://www.samanportable.com/product/container-offices/container-office-cabin', statusCode: 301 },

      // Already identified nav/internal 404s.
      { source: '/porta-cabin-in-bangalore', destination: 'https://www.samanportable.com/best-porta-cabins-in-bangalore', statusCode: 301 },
      { source: '/porta-cabins-in-bangalore', destination: 'https://www.samanportable.com/best-porta-cabins-in-bangalore', statusCode: 301 },
      // Phantom cross-category path fix (owner-approved 2026-07-01): the
      // "portable-office-container" product lives in the portable-office category.
      { source: '/product/container-offices/portable-office-container', destination: 'https://www.samanportable.com/product/portable-office/portable-office-container', statusCode: 301 },

      // F3 resolution (owner-approved 2026-06-12): the plural category URL was a
      // phantom (no WordPress term behind it — soft-404 on live, fallback page on
      // the static build). 301 it to the real, canonical singular category.
      {
        source: '/product-category/portable-toilets',
        destination: 'https://www.samanportable.com/product/portable-toilet',
        permanent: true,
      },
      // Duplicate-category fix (Agent C P13): the singular container-house URL is a
      // phantom category (self-canonical duplicate of the real plural cluster hub,
      // where all /product/container-houses/* products live). 301 it to canonical plural.
      {
        source: '/product-category/container-house',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },

      // SHIKHAR T1.2 (owner-approved 2026-07-12): consolidate the 14 published
      // /product-category/* archives into their canonical /product/* hubs. Evidence:
      // /audit/T1.1/PRODUCT-CATEGORY-AUDIT.md — all 14 were live, indexable and
      // self-canonical, cannibalizing the /product hubs. Absolute destinations keep
      // apex and www requests single-hop. Exact rules first; catch-all last.
      { source: '/product-category/container-cafe', destination: 'https://www.samanportable.com/product/container-cafe', permanent: true },
      { source: '/product-category/container-houses', destination: 'https://www.samanportable.com/product/container-houses', permanent: true },
      { source: '/product-category/container-offices', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/product-category/industrial-sheds', destination: 'https://www.samanportable.com/product/industrial-sheds', permanent: true },
      { source: '/product-category/labor-colony', destination: 'https://www.samanportable.com/product/labor-colony', permanent: true },
      { source: '/product-category/peb-constructions', destination: 'https://www.samanportable.com/product/peb-constructions', permanent: true },
      { source: '/product-category/porta-cabins', destination: 'https://www.samanportable.com/product/porta-cabins', permanent: true },
      { source: '/product-category/portable-cabin', destination: 'https://www.samanportable.com/product/portable-cabin', permanent: true },
      { source: '/product-category/portable-office', destination: 'https://www.samanportable.com/product/portable-office', permanent: true },
      { source: '/product-category/portable-toilet', destination: 'https://www.samanportable.com/product/portable-toilet', permanent: true },
      { source: '/product-category/pre-engineered-buildings', destination: 'https://www.samanportable.com/product/pre-engineered-buildings', permanent: true },
      { source: '/product-category/prefab-buildings', destination: 'https://www.samanportable.com/product/prefab-buildings', permanent: true },
      { source: '/product-category/prefabricated-houses', destination: 'https://www.samanportable.com/product/prefabricated-houses', permanent: true },
      { source: '/product-category/security-cabins', destination: 'https://www.samanportable.com/product/security-cabins', permanent: true },
      // T1.2 amendment (Fable 5, 13 Jul 2026): the 7 panel/roofing category archives.
      // Without these they would fall to the catch-all and land on the generic /product
      // listing instead of their own canonical hub. Note roofing: the category slug is
      // plural but the hub is singular (/product/roofing-sheets is a 404).
      { source: '/product-category/eps-panel', destination: 'https://www.samanportable.com/product/eps-panel', permanent: true },
      { source: '/product-category/glass-wool-panel', destination: 'https://www.samanportable.com/product/glass-wool-panel', permanent: true },
      { source: '/product-category/pir-panel', destination: 'https://www.samanportable.com/product/pir-panel', permanent: true },
      { source: '/product-category/puf-panel', destination: 'https://www.samanportable.com/product/puf-panel', permanent: true },
      { source: '/product-category/rockwool-panel', destination: 'https://www.samanportable.com/product/rockwool-panel', permanent: true },
      { source: '/product-category/roofing-sheets', destination: 'https://www.samanportable.com/product/roofing-sheet', permanent: true },
      { source: '/product-category/sandwich-panel', destination: 'https://www.samanportable.com/product/sandwich-panel', permanent: true },
      // Catch-all safety net: any remaining /product-category/* archive lands on the
      // /product listing rather than 404ing. MUST stay below the 21 exact rules.
      // C18 wall-sheets is an owner-approved live archive and is excluded.
      { source: '/product-category/:slug((?!wall-sheets$).*)', destination: 'https://www.samanportable.com/product', permanent: true },

      // Cart/checkout retirement (owner-approved 2026-06-12): enquiry-only
      // business — the cart path was removed in Phase 2; these dead-end pages
      // now 301 home. Page files remain but are unreachable (redirects run
      // before the filesystem).
      {
        source: '/cart',
        destination: 'https://www.samanportable.com/',
        permanent: true,
      },
      {
        source: '/checkout',
        destination: 'https://www.samanportable.com/',
        permanent: true,
      },
      // Duplicate URL redirects for SEO - Container Cafes
      {
        source: '/container-cafes-in-central-delhi-2',
        destination: 'https://www.samanportable.com/container-cafes-in-central-delhi',
        permanent: true,
      },
      // Duplicate URL redirects for SEO - Container Offices
      {
        source: '/container-offices-in-gurgaon-2',
        destination: 'https://www.samanportable.com/container-offices-in-gurgaon',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-btm-layout-2',
        destination: 'https://www.samanportable.com/container-offices-for-sale-in-btm-layout',
        permanent: true, // SEO-safe (Next.js serves 308; OK same as 301 for Google)
      },
      {
        source: '/container-offices-for-sale-in-rt-nagar-2',
        destination: 'https://www.samanportable.com/container-offices-for-sale-in-rt-nagar',
        permanent: true,
      },
      // Duplicate URL redirects for SEO - Porta Cabins
      {
        source: '/portacabins-for-sale-in-hebbal-2',
        destination: 'https://www.samanportable.com/porta-cabins-in-hebbal',
        permanent: true,
      },
      // Additional duplicate URL redirects
      {
        source: '/innovative-office-container-designs-2',
        destination: 'https://www.samanportable.com/product/container-offices',
        permanent: true,
      },
      // Blog to product page redirect
      {
        source: '/luxury-porta-cabins-your-portable-oasis-of-comfort-and-style',
        destination: 'https://www.samanportable.com/product/porta-cabins/luxury-porta-cabin',
        permanent: true,
      },

      // NEW REDIRECTS FROM BROKEN LINKS LIST - 301 REDIRECTS
      {
        source: '/wp-content/uploads/2020/04/saman-profiles.pdf',
        destination: 'https://www.samanportable.com/about-us',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2020/03/saman-catalogue.pdf',
        destination: 'https://www.samanportable.com/product',
        permanent: true,
      },
      {
        source: '/products/shipping-container-house',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      {
        source: '/project/portable-cabins-manufacturer',
        destination: 'https://www.samanportable.com/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/project/industrial-shed-manufacturer',
        destination: 'https://www.samanportable.com/product/industrial-sheds',
        permanent: true,
      },
      {
        source: '/porta-cabins',
        destination: 'https://www.samanportable.com/product/porta-cabins',
        permanent: true,
      },
      {
        source: '/products/kitchen-container',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      {
        source: '/container-office-for-sale-in-bangalore',
        destination: 'https://www.samanportable.com/product/container-offices',
        permanent: true,
      },
      {
        source: '/products/portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/products/mobile-toilet',
        destination: 'https://www.samanportable.com/product/portable-toilet',
        permanent: true,
      },
      {
        source: '/project/container-homes',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      {
        source: '/labour-colonies-in-najafgarh',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/products/portable-toilet',
        destination: 'https://www.samanportable.com/product/portable-toilet',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-central-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-central-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/products/industrial-shed-manufacturer',
        destination: 'https://www.samanportable.com/product/industrial-sheds',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-nagarbhavi-3',
        destination: 'https://www.samanportable.com/product/container-offices',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-east-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-in-okhla-industrial',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-west-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-in-loni-ghaziabad',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-peenya',
        destination: 'https://www.samanportable.com/product/container-offices',
        permanent: true,
      },
      {
        source: '/products/mobile-home',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      {
        source: '/project/portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/labour-camps-in-noida',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-north-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-camps-in-ghaziabad',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-lucknow',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-north-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/products/office-cabins',
        destination: 'https://www.samanportable.com/product/portable-office/portable-office-cabin',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-south-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-new-delhi',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-hosur-3',
        destination: 'https://www.samanportable.com/product/container-offices',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-meerut',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },

      // 410 GONE REDIRECTS - These redirect to the 410 page
      {
        source: '/find-out-how-i-cured-my-easter-weekend-in-2-days',
        destination: 'https://www.samanportable.com/410',
        permanent: true,
      },

      // ─── BLOG DEDUPE REDIRECTS (42 entries from SAMAN_Blog_Dedupe_Action_List.csv) ───
      {
        source: '/portacabins-for-sale-in-hosur',
        destination: 'https://www.samanportable.com/portable-cabins-in-hosur',
        permanent: true,
      },
      {
        source: '/affordable-prefabricated-homes-delhi',
        destination: 'https://www.samanportable.com/top-quality-prefab-cabins-delhi',
        permanent: true,
      },
      {
        source: '/warehouse-manufacturer-in-bangalore',
        destination: 'https://www.samanportable.com/industrial-sheds-in-bangalore',
        permanent: true,
      },
      {
        source: '/low-cost-porta-cabins',
        destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025',
        permanent: true,
      },
      {
        source: '/office-cabin-rentals-in-delhi',
        destination: 'https://www.samanportable.com/portable-office-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/prefabricated-porta-cabin-in-delhi-ncr',
        destination: 'https://www.samanportable.com/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-in-delhi-ncr',
        destination: 'https://www.samanportable.com/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/trusted-porta-cabin-dealer-in-delhi-ncr',
        destination: 'https://www.samanportable.com/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-price-in-delhi',
        destination: 'https://www.samanportable.com/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-manufacturer-in-delhi',
        destination: 'https://www.samanportable.com/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-manufacturer-in-delhi-ncr',
        destination: 'https://www.samanportable.com/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-manufacturer-in-bangalore',
        destination: 'https://www.samanportable.com/portacabins-for-sale-in-bangalore',
        permanent: true,
      },
      {
        source: '/porta-cabin-size',
        destination: 'https://www.samanportable.com/porta-cabin-sizes-and-specifications-in-india',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-anekal',
        destination: 'https://www.samanportable.com/porta-cabins-in-anekal',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-banashankari',
        destination: 'https://www.samanportable.com/porta-cabins-in-banashankari',
        permanent: true,
      },
      {
        source: '/porta-cabins-in-bannerghatta-road',
        destination: 'https://www.samanportable.com/portacabins-for-sale-in-bannerghatta-road',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-bellandur',
        destination: 'https://www.samanportable.com/portable-cabins-in-bellandur',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-btm-layout',
        destination: 'https://www.samanportable.com/porta-cabins-in-btm-layout',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-domlur',
        destination: 'https://www.samanportable.com/porta-cabins-in-domlur',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-electronic-city',
        destination: 'https://www.samanportable.com/porta-cabins-in-electronic-city',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-hebbal',
        destination: 'https://www.samanportable.com/porta-cabins-in-hebbal',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-hsr-layout',
        destination: 'https://www.samanportable.com/porta-cabins-in-hsr-layout',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-jayanagar',
        destination: 'https://www.samanportable.com/porta-cabins-in-jayanagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-jigani',
        destination: 'https://www.samanportable.com/porta-cabins-in-jigani',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-jp-nagar',
        destination: 'https://www.samanportable.com/porta-cabins-in-jp-nagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-kengeri',
        destination: 'https://www.samanportable.com/porta-cabins-in-kengeri',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-koramangala',
        destination: 'https://www.samanportable.com/porta-cabins-in-koramangala',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-malleshwaram',
        destination: 'https://www.samanportable.com/porta-cabins-in-malleshwaram',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-marathahalli',
        destination: 'https://www.samanportable.com/porta-cabins-in-marathahalli',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-nagarbhavi',
        destination: 'https://www.samanportable.com/porta-cabins-in-nagarbhavi',
        permanent: true,
      },
      {
        // B58 (HELD 2026-06-21): repointed from /porta-cabins-in-peenya-f to the
        // C2 keeper so this URL stays one hop after the B58 twin block redirects
        // porta-cabins-in-peenya-f -> /portable-cabins-in-peenya. (was: /porta-
        // cabins-in-peenya-f). Revert with the rest of B58.
        source: '/portacabins-for-sale-in-peenya',
        destination: 'https://www.samanportable.com/portable-cabins-in-peenya',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-rajajinagar',
        destination: 'https://www.samanportable.com/porta-cabins-in-rajajinagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-rt-nagar',
        destination: 'https://www.samanportable.com/porta-cabins-in-rt-nagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-sarjapur-road',
        destination: 'https://www.samanportable.com/porta-cabins-in-sarjapur-road',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-ulsoor',
        destination: 'https://www.samanportable.com/porta-cabins-in-ulsoor',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-vijayanagar',
        destination: 'https://www.samanportable.com/porta-cabins-in-vijayanagar',
        permanent: true,
      },
      {
        source: '/porta-cabins-in-whitefield',
        destination: 'https://www.samanportable.com/portacabins-for-sale-in-whitefield',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-yelahanka',
        destination: 'https://www.samanportable.com/porta-cabins-in-yelahanka',
        permanent: true,
      },
      {
        source: '/portable-cabin-suppliers-in-bangalore',
        destination: 'https://www.samanportable.com/portable-cabin-price-in-bangalore',
        permanent: true,
      },
      {
        source: '/portable-cabins-for-sale-in-bangalore-option',
        destination: 'https://www.samanportable.com/portable-cabin-price-in-bangalore',
        permanent: true,
      },
      {
        source: '/portable-cabin-solutions-in-hennur',
        destination: 'https://www.samanportable.com/portable-cabins-in-hennur',
        permanent: true,
      },
      {
        source: '/trusted-porta-cabins-in-shivajinagar',
        destination: 'https://www.samanportable.com/portable-cabins-in-shivajinagar',
        permanent: true,
      },

      // C1/C2 locality consolidation (2026-06-26): one-hop 308s into keeper
      // pages. Do not add Bangalore/India catch-alls here.
      { source: '/portable-cabins-in-anekal', destination: 'https://www.samanportable.com/porta-cabins-in-anekal', permanent: true },
      { source: '/portable-cabins-in-banashankari', destination: 'https://www.samanportable.com/porta-cabins-in-banashankari', permanent: true },
      { source: '/portable-cabins-in-bannerghatta-road', destination: 'https://www.samanportable.com/portacabins-for-sale-in-bannerghatta-road', permanent: true },
      { source: '/portable-cabins-in-bommasandra', destination: 'https://www.samanportable.com/portacabins-for-sale-in-bommasandra', permanent: true },
      { source: '/portable-cabins-in-btm-layout', destination: 'https://www.samanportable.com/porta-cabins-in-btm-layout', permanent: true },
      { source: '/portable-cabins-in-domlur', destination: 'https://www.samanportable.com/porta-cabins-in-domlur', permanent: true },
      { source: '/portable-cabins-in-electronic-city', destination: 'https://www.samanportable.com/porta-cabins-in-electronic-city', permanent: true },
      { source: '/portable-cabins-in-hebbal', destination: 'https://www.samanportable.com/porta-cabins-in-hebbal', permanent: true },
      { source: '/portable-cabins-in-hsr-layout', destination: 'https://www.samanportable.com/porta-cabins-in-hsr-layout', permanent: true },
      { source: '/portable-cabins-in-jayanagar', destination: 'https://www.samanportable.com/porta-cabins-in-jayanagar', permanent: true },
      { source: '/portable-cabins-in-jigani', destination: 'https://www.samanportable.com/porta-cabins-in-jigani', permanent: true },
      { source: '/portable-cabins-in-jp-nagar', destination: 'https://www.samanportable.com/porta-cabins-in-jp-nagar', permanent: true },
      { source: '/portable-cabins-in-kengeri', destination: 'https://www.samanportable.com/porta-cabins-in-kengeri', permanent: true },
      { source: '/portable-cabins-in-koramangala', destination: 'https://www.samanportable.com/porta-cabins-in-koramangala', permanent: true },
      { source: '/portable-cabins-in-malleshwaram', destination: 'https://www.samanportable.com/porta-cabins-in-malleshwaram', permanent: true },
      { source: '/portable-cabins-in-marathahalli', destination: 'https://www.samanportable.com/porta-cabins-in-marathahalli', permanent: true },
      { source: '/portable-cabins-in-nagarbhavi', destination: 'https://www.samanportable.com/porta-cabins-in-nagarbhavi', permanent: true },
      { source: '/portable-cabins-in-noida', destination: 'https://www.samanportable.com/porta-cabin-in-noida', permanent: true },
      { source: '/portable-cabins-in-rajajinagar', destination: 'https://www.samanportable.com/porta-cabins-in-rajajinagar', permanent: true },
      { source: '/portable-cabins-in-rt-nagar', destination: 'https://www.samanportable.com/porta-cabins-in-rt-nagar', permanent: true },
      { source: '/portable-cabins-in-sarjapur-road', destination: 'https://www.samanportable.com/porta-cabins-in-sarjapur-road', permanent: true },
      { source: '/portable-cabins-in-ulsoor', destination: 'https://www.samanportable.com/porta-cabins-in-ulsoor', permanent: true },
      { source: '/portable-cabins-in-vijayanagar', destination: 'https://www.samanportable.com/porta-cabins-in-vijayanagar', permanent: true },
      { source: '/portable-cabins-in-whitefield', destination: 'https://www.samanportable.com/portacabins-for-sale-in-whitefield', permanent: true },
      { source: '/portable-cabins-in-yelahanka', destination: 'https://www.samanportable.com/porta-cabins-in-yelahanka', permanent: true },
      { source: '/porta-cabins-in-bellandur', destination: 'https://www.samanportable.com/portable-cabins-in-bellandur', permanent: true },
      { source: '/portacabins-for-sale-in-shivajinagar', destination: 'https://www.samanportable.com/portable-cabins-in-shivajinagar', permanent: true },
      { source: '/affordable-porta-cabins-in-hosur', destination: 'https://www.samanportable.com/portable-cabins-in-hosur', permanent: true },

      // ─── GSC "Not found 404" redirect-worthy small batch (1:1 equivalents) ─
      // Six high-confidence 301s for legacy 404 URLs whose canonical page is live (200).
      // Destinations are slash-less (trailingSlash:false). No CMS recategorisation here.
      {
        source: '/product/uncategorized/office-portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/office-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/uncategorized/small-portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/small-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/uncategorized/mobile-office-container',
        destination: 'https://www.samanportable.com/product/container-offices/mobile-office-container',
        permanent: true,
      },
      {
        source: '/product/uncategorized/portable-cabin-with-toilet',
        destination: 'https://www.samanportable.com/product/portable-cabin/portable-cabin-with-toilet',
        permanent: true,
      },
      {
        source: '/home',
        destination: 'https://www.samanportable.com/',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-west-delhi',
        destination: 'https://www.samanportable.com/labour-colonies-in-west-delhi',
        permanent: true,
      },

      // ─── GSC "Soft 404" Group A (nonexistent category → real listing) ─────
      // /product-category/products is not a real WooCommerce category; it renders an
      // empty "No products" page at 200 (soft 404). Redirect to the real /product listing.
      {
        source: '/product-category/products',
        destination: 'https://www.samanportable.com/product',
        permanent: true,
      },

      // ─── URL Index-Control Batch 2 (business-approved old-URL → closest live
      // commercial category). Targets verified 200; sources/destinations slash-less;
      // no CMS recategorisation. Weak/ambiguous + removed-article URLs intentionally
      // excluded (kept 404 / 410-later). ───────────────────────────────────
      {
        source: '/office-cabins',
        destination: 'https://www.samanportable.com/product/portable-office',
        permanent: true,
      },
      {
        source: '/project/container-cafe-india',
        destination: 'https://www.samanportable.com/product/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-cafe',
        destination: 'https://www.samanportable.com/product/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-homes-new',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      {
        source: '/portfolio/portable-cabin-manufacturers-in-bangalore',
        destination: 'https://www.samanportable.com/product/portable-cabin',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // WAIT REDIRECTS BATCH — added 2026-06-05
      // Source: SAMAN_MASTER_PAGE_STATE.xlsx → REDIRECTS WAIT
      // 22 new + 1 inline override (/dimensions-of-portable-cabins) + 1 skip (/porta-cabin-size in CSV)
      // Inline placement BEFORE ...csvRedirects ensures first-match-wins over stale CSV entry
      // ──────────────────────────────────────────────────
      // UPDATE — inline override of stale CSV rule (redirects-from-csv.js:177).
      // Old dest was /product-category/portable-cabin; first-match-wins (this
      // precedes ...csvRedirects) so the new dest below takes effect.
      {
        source: '/dimensions-of-portable-cabins',
        destination: 'https://www.samanportable.com/porta-cabin-sizes-and-specifications-in-india',
        permanent: true,
      },
      // C1 Porta Cabin (8)
      {
        source: '/second-hand-portacabin-offices-for-sale',
        destination: 'https://www.samanportable.com/2nd-hand-porta-cabins',
        permanent: true,
      },
      {
        source: '/best-porta-cabin-solutions-10-top-designs',
        destination: 'https://www.samanportable.com/best-porta-cabin-manufacturer-ncr',
        permanent: true,
      },
      {
        source: '/best-porta-cabin-supplier',
        destination: 'https://www.samanportable.com/best-porta-cabin-manufacturer-ncr',
        permanent: true,
      },
      {
        source: '/best-porta-cabins-india-solutions',
        destination: 'https://www.samanportable.com/best-porta-cabin-manufacturer-ncr',
        permanent: true,
      },
      {
        source: '/customized-porta-cabins',
        destination: 'https://www.samanportable.com/durable-porta-cabins',
        permanent: true,
      },
      {
        source: '/rapid-construction-porta-cabins-ncr',
        destination: 'https://www.samanportable.com/durable-porta-cabins',
        permanent: true,
      },
      {
        source: '/top-quality-ms-porta-cabin',
        destination: 'https://www.samanportable.com/durable-porta-cabins',
        permanent: true,
      },
      {
        // B58 (HELD 2026-06-21): repointed from /porta-cabins-in-frazer to the C2
        // keeper so this URL stays one hop after the B58 twin block redirects
        // porta-cabins-in-frazer -> /portable-cabins-in-frazer-town. (was: /porta-
        // cabins-in-frazer). Revert with the rest of B58.
        source: '/portacabins-for-sale-in-frazer-town',
        destination: 'https://www.samanportable.com/portable-cabins-in-frazer-town',
        permanent: true,
      },
      // C2 Portable Cabin (3)
      {
        source: '/affordable-portable-cabins-for-rent',
        destination: 'https://www.samanportable.com/cheap-portable-cabins',
        permanent: true,
      },
      {
        source: '/cheap-portable-cabins-for-sale',
        destination: 'https://www.samanportable.com/cheap-portable-cabins',
        permanent: true,
      },
      {
        source: '/best-materials-for-portable-cabins',
        destination: 'https://www.samanportable.com/top-rated-portable-cabin-supplier-delhi',
        permanent: true,
      },
      // C3 Portable Office (2)
      {
        source: '/cost-effective-office-cabin-rentals',
        destination: 'https://www.samanportable.com/discount-mobile-office-units',
        permanent: true,
      },
      {
        source: '/cost-effective-temporary-office-cabins',
        destination: 'https://www.samanportable.com/discount-mobile-office-units',
        permanent: true,
      },
      // C4 Container Office (4)
      {
        source: '/cheap-container-office',
        destination: 'https://www.samanportable.com/affordable-office-containers-for-sale',
        permanent: true,
      },
      {
        source: '/reliable-office-container-manufacturers',
        destination: 'https://www.samanportable.com/best-container-office-solutions',
        permanent: true,
      },
      {
        source: '/best-deals-on-refurbished-office-containers',
        destination: 'https://www.samanportable.com/second-hand-container-office',
        permanent: true,
      },
      {
        source: '/second-hand-office-container-for-sale',
        destination: 'https://www.samanportable.com/second-hand-container-office',
        permanent: true,
      },
      // C7 Container House (1)
      {
        source: '/second-hand-container-for-sale',
        destination: 'https://www.samanportable.com/2nd-hand-containers',
        permanent: true,
      },
      // C11 Prefab Building (2)
      {
        source: '/affordable-portable-structures',
        destination: 'https://www.samanportable.com/low-cost-modular-office-solutions',
        permanent: true,
      },
      {
        source: '/affordable-prefab-office-buildings',
        destination: 'https://www.samanportable.com/low-cost-modular-office-solutions',
        permanent: true,
      },
      // C12 Prefab House (2 — chain-flattened from old /affordable-prefabricated-homes-delhi)
      {
        source: '/affordable-prefab-homes',
        destination: 'https://www.samanportable.com/top-quality-prefab-cabins-delhi',
        permanent: true,
      },
      {
        source: '/affordable-small-prefab-cabins',
        destination: 'https://www.samanportable.com/top-quality-prefab-cabins-delhi',
        permanent: true,
      },

      // ─── C4 ZERO-IMPRESSION DOORWAY CONSOLIDATION (Agent A, P3, 2026-06-22) ─
      // 29 templated container-office city-swap blogs: 0 impressions / 0 clicks
      // (3-month GSC), doorway-page risk per Rulebook L10. Owner-approved redirect
      // to the C4 category. Slash-less destination (trailingSlash:false) to avoid a
      // chain — matches existing /product-category/container-offices siblings.
      { source: '/container-offices-for-sale-in-anekal', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-banashankari', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-bannerghatta-road', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-bellandur', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-btm-layout', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-domlur', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-electronic-city', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-frazer-town', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-hebbal', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-hennur', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-hsr-layout', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-jigani', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-kengeri', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-koramangala', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-kr-puram', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-magadi-road', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-malleshwaram', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-marathahalli', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-nagarbhavi', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-rajajinagar', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-rt-nagar', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-sarjapur-road', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-shivajinagar', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-ulsoor', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-whitefield', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-for-sale-in-yelahanka', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-in-east-delhi', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-in-ghaziabad', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },
      { source: '/container-offices-in-north-delhi', destination: 'https://www.samanportable.com/product/container-offices', permanent: true },

      // ─── CSV BULK REDIRECTS (572 entries from spreadsheet) ───────────────
      // Source: Untitled spreadsheet - Sheet1 (1).csv
      // Skipped: 7 MERGE rows, 2 conflicts with existing config, 0 duplicates
      // ──────────────────────────────────────────────────
      // DEAD-URL EQUITY RECOVERY BATCH — added 2026-06-09
      // Source: SAMAN_Dead_URL_Redirect_Map_1.xlsx → "Redirect Map (ACTION)"
      // 94 confirmed 301s (permanent:true → Next 308). All targets pre-verified live 200.
      // Placed BEFORE ...csvRedirects so first-match-wins over any stale CSV rule.
      // (/track-your-order → true 410 handled in middleware.ts goneUrls, not here.)
      // ──────────────────────────────────────────────────
      {
        source: '/product/affordable-container-homes',
        destination: 'https://www.samanportable.com/product/container-houses/affordable-container-homes',
        permanent: true,
      },
      {
        source: '/product/buy-container-buildings',
        destination: 'https://www.samanportable.com/product/prefab-buildings/buy-container-buildings',
        permanent: true,
      },
      {
        source: '/product/buy-porta-cabins',
        destination: 'https://www.samanportable.com/product/porta-cabins/buy-porta-cabins',
        permanent: true,
      },
      {
        source: '/product/buy-portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/buy-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/cargo-container-house',
        destination: 'https://www.samanportable.com/product/container-houses/cargo-container-house',
        permanent: true,
      },
      {
        source: '/product/cargo-container-office',
        destination: 'https://www.samanportable.com/product/container-offices/cargo-container-office',
        permanent: true,
      },
      {
        source: '/product/container-coffee-shop',
        destination: 'https://www.samanportable.com/product/container-cafe/container-coffee-shop',
        permanent: true,
      },
      {
        source: '/product/container-office-cabin',
        destination: 'https://www.samanportable.com/product/container-offices/container-office-cabin',
        permanent: true,
      },
      {
        source: '/product/container-office',
        destination: 'https://www.samanportable.com/product/container-offices/container-office-cabin',
        permanent: true,
      },
      {
        source: '/product/container-portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/container-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/container-portable-office',
        destination: 'https://www.samanportable.com/product/container-offices/container-portable-office',
        permanent: true,
      },
      {
        source: '/product/container-restaurant',
        destination: 'https://www.samanportable.com/product/container-cafe/container-restaurant',
        permanent: true,
      },
      {
        source: '/product/container-site-office',
        destination: 'https://www.samanportable.com/product/container-offices/site-office-container',
        permanent: true,
      },
      {
        source: '/product/food-truck-containers',
        destination: 'https://www.samanportable.com/product/container-cafe/food-truck-containers',
        permanent: true,
      },
      {
        source: '/product/garden-sheds',
        destination: 'https://www.samanportable.com/product/industrial-sheds/garden-sheds',
        permanent: true,
      },
      {
        source: '/product/inexpensive-container-homes',
        destination: 'https://www.samanportable.com/product/container-houses/inexpensive-container-homes',
        permanent: true,
      },
      {
        source: '/product/low-cost-porta-cabin',
        destination: 'https://www.samanportable.com/product/porta-cabins/low-cost-porta-cabin',
        permanent: true,
      },
      {
        source: '/product/luxury-container-houses',
        destination: 'https://www.samanportable.com/product/container-houses/luxury-container-houses',
        permanent: true,
      },
      {
        source: '/product/luxury-porta-cabin',
        destination: 'https://www.samanportable.com/product/porta-cabins/luxury-porta-cabin',
        permanent: true,
      },
      {
        source: '/product/mobile-container-cafe',
        destination: 'https://www.samanportable.com/product/container-cafe/mobile-container-cafe',
        permanent: true,
      },
      {
        source: '/product/mobile-container-office',
        destination: 'https://www.samanportable.com/product/container-offices/mobile-office-container',
        permanent: true,
      },
      {
        source: '/product/mobile-office-container',
        destination: 'https://www.samanportable.com/product/container-offices/mobile-office-container',
        permanent: true,
      },
      {
        source: '/product/modern-container-home',
        destination: 'https://www.samanportable.com/product/container-houses/modern-container-home',
        permanent: true,
      },
      {
        source: '/product/modern-office-cabin',
        destination: 'https://www.samanportable.com/product/portable-office/modern-office-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-container-cafe',
        destination: 'https://www.samanportable.com/product/container-cafe/modular-container-cafe',
        permanent: true,
      },
      {
        source: '/product/modular-container-office',
        destination: 'https://www.samanportable.com/product/container-offices/modular-container-office',
        permanent: true,
      },
      {
        source: '/product/modular-office-cabin',
        destination: 'https://www.samanportable.com/product/portable-office/modular-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/modular-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-portable-office-cabin',
        destination: 'https://www.samanportable.com/product/portable-office/modular-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-shipping-container-office',
        destination: 'https://www.samanportable.com/product/container-offices/modular-shipping-container-office',
        permanent: true,
      },
      {
        source: '/product/movable-toilet-cabin',
        destination: 'https://www.samanportable.com/product/portable-toilet/movable-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/ms-portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/ms-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/ms-portable-office-cabin',
        destination: 'https://www.samanportable.com/product/portable-office/ms-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/porta-cabin-house',
        destination: 'https://www.samanportable.com/product/prefabricated-houses/porta-cabin-house',
        permanent: true,
      },
      {
        source: '/product/porta-cabin-office',
        destination: 'https://www.samanportable.com/product/porta-cabins/porta-cabin-office',
        permanent: true,
      },
      {
        source: '/product/porta-cabin-shop',
        destination: 'https://www.samanportable.com/product/porta-cabins/porta-cabin-shop',
        permanent: true,
      },
      {
        source: '/product/portable-cabin-building',
        destination: 'https://www.samanportable.com/product/portable-cabin/portable-cabin-building',
        permanent: true,
      },
      {
        source: '/product/portable-cabin-house',
        destination: 'https://www.samanportable.com/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-cabin-with-toilet',
        destination: 'https://www.samanportable.com/product/portable-toilet/portable-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-container-offices',
        destination: 'https://www.samanportable.com/product/container-offices/portable-container-offices',
        permanent: true,
      },
      {
        source: '/product/portable-office-cabin',
        destination: 'https://www.samanportable.com/product/portable-office/portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-office-container',
        destination: 'https://www.samanportable.com/product/portable-office/portable-office-container',
        permanent: true,
      },
      {
        source: '/product/portable-security-cabin',
        destination: 'https://www.samanportable.com/product/security-cabins/portable-security-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-shop-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/portable-shop-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-toilet-cabin',
        destination: 'https://www.samanportable.com/product/portable-toilet/portable-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/prebuilt-container-homes',
        destination: 'https://www.samanportable.com/product/container-houses/prebuilt-container-homes',
        permanent: true,
      },
      {
        source: '/product/prefab-container-homes',
        destination: 'https://www.samanportable.com/product/container-houses/prefab-container-homes',
        permanent: true,
      },
      {
        source: '/product/prefab-office-buildings',
        destination: 'https://www.samanportable.com/product/prefab-buildings/prefab-office-buildings',
        permanent: true,
      },
      {
        source: '/product/prefab-steel-house',
        destination: 'https://www.samanportable.com/product/industrial-sheds/prefab-steel-house',
        permanent: true,
      },
      {
        source: '/product/prefabricated-bunkhouse',
        destination: 'https://www.samanportable.com/product/prefabricated-houses/prefabricated-bunkhouse',
        permanent: true,
      },
      {
        source: '/product/prefabricated-container-home',
        destination: 'https://www.samanportable.com/product/container-houses/prefabricated-container-home',
        permanent: true,
      },
      {
        source: '/product/prefabricated-container-house',
        destination: 'https://www.samanportable.com/product/container-houses/prefabricated-container-house',
        permanent: true,
      },
      {
        source: '/product/prefabricated-container-office',
        destination: 'https://www.samanportable.com/product/container-offices/prefabricated-container-office',
        permanent: true,
      },
      {
        source: '/product/prefabricated-office-cabins',
        destination: 'https://www.samanportable.com/product/portable-office/prefabricated-office-cabins',
        permanent: true,
      },
      {
        source: '/product/prefabricated-porta-cabin',
        destination: 'https://www.samanportable.com/product/porta-cabins/prefabricated-porta-cabin',
        permanent: true,
      },
      {
        source: '/product/prefabricated-portable-cabin',
        destination: 'https://www.samanportable.com/product/portable-cabin/prefabricated-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/prefabricated-portable-office-cabin',
        destination: 'https://www.samanportable.com/product/portable-office/prefabricated-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/prefabricated-toilet',
        destination: 'https://www.samanportable.com/product/portable-toilet/prefabricated-toilet',
        permanent: true,
      },
      {
        source: '/product/prefabricated-warehouses',
        destination: 'https://www.samanportable.com/product/industrial-sheds/prefabricated-warehouses',
        permanent: true,
      },
      {
        source: '/product/readymade-office-cabin',
        destination: 'https://www.samanportable.com/product/portable-office/readymade-office-cabin',
        permanent: true,
      },
      {
        source: '/product/readymade-security-cabin',
        destination: 'https://www.samanportable.com/product/security-cabins/readymade-security-cabin',
        permanent: true,
      },
      {
        source: '/product/readymade-toilet-cabin',
        destination: 'https://www.samanportable.com/product/portable-toilet/readymade-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/restaurant-food-containers',
        destination: 'https://www.samanportable.com/product/container-cafe/restaurant-food-containers',
        permanent: true,
      },
      {
        source: '/product/saman-prefab-office',
        destination: 'https://www.samanportable.com/product/prefabricated-houses/saman-prefab-office',
        permanent: true,
      },
      {
        source: '/product/shipping-container-cafe',
        destination: 'https://www.samanportable.com/product/container-cafe/shipping-container-cafe',
        permanent: true,
      },
      {
        source: '/product/shipping-container-homes',
        destination: 'https://www.samanportable.com/product/container-houses/shipping-container-homes',
        permanent: true,
      },
      {
        source: '/product/shipping-container-office',
        destination: 'https://www.samanportable.com/product/container-offices/shipping-container-office',
        permanent: true,
      },
      {
        source: '/product/shipping-container-restaurant',
        destination: 'https://www.samanportable.com/product/container-cafe/shipping-container-restaurant',
        permanent: true,
      },
      {
        source: '/product/shipping-container-tiny-house',
        destination: 'https://www.samanportable.com/product/container-houses/shipping-container-tiny-house',
        permanent: true,
      },
      {
        source: '/product/site-office-container',
        destination: 'https://www.samanportable.com/product/container-offices/site-office-container',
        permanent: true,
      },
      {
        source: '/product/storage-container-house',
        destination: 'https://www.samanportable.com/product/container-houses/storage-container-house',
        permanent: true,
      },
      {
        source: '/product/tiny-container-homes',
        destination: 'https://www.samanportable.com/product/container-houses/tiny-container-homes',
        permanent: true,
      },
      {
        source: '/porta-cabin-price-a-complete-guide-2024',
        destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025',
        permanent: true,
      },
      {
        source: '/project/bunkhouse-for-rent',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/project/bunkhouse-for-sale',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/project/container-cafes-in-bangalore',
        destination: 'https://www.samanportable.com/product/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-cafes',
        destination: 'https://www.samanportable.com/product/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-homes-for-sale',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      {
        source: '/project/container-hotel-for-sale',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      {
        source: '/project/peb-manufacturer',
        destination: 'https://www.samanportable.com/product/peb-constructions',
        permanent: true,
      },
      {
        source: '/project/porta-cabin-interior',
        destination: 'https://www.samanportable.com/product/porta-cabins',
        permanent: true,
      },
      {
        source: '/project/portable-bunkhouse',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/project/portable-cabin-in-bangalore',
        destination: 'https://www.samanportable.com/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/project/portable-cabin-manufacturers-in-bangalore',
        destination: 'https://www.samanportable.com/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/project/portable-security-cabin',
        destination: 'https://www.samanportable.com/product/security-cabins/portable-security-cabin',
        permanent: true,
      },
      {
        source: '/project/portable-toilet-in-bangalore',
        destination: 'https://www.samanportable.com/portable-toilets-in-bangalore',
        permanent: true,
      },
      {
        source: '/project/prefab-house',
        destination: 'https://www.samanportable.com/product/prefabricated-houses',
        permanent: true,
      },
      {
        source: '/project/prefab-labour-colony-in-bangalore',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },
      {
        source: '/project/prefabricated-office',
        destination: 'https://www.samanportable.com/product/portable-office',
        permanent: true,
      },
      {
        source: '/project/prefabricated-steel-buildings',
        destination: 'https://www.samanportable.com/product/pre-engineered-buildings',
        permanent: true,
      },
      {
        source: '/project/prefabricated-warehouse',
        destination: 'https://www.samanportable.com/product/industrial-sheds/prefabricated-warehouses',
        permanent: true,
      },
      {
        source: '/project/security-guard-cabins',
        destination: 'https://www.samanportable.com/product/security-cabins/security-guard-cabin',
        permanent: true,
      },
      {
        source: '/project/shipping-container-homes-for-sale',
        destination: 'https://www.samanportable.com/product/container-houses',
        permanent: true,
      },
      // ──────────────────────────────────────────────────
      // P2-B42 (owner Manzar approved 2026-06-16): consolidate the 2 cannibal
      // shed blog URLs into their B40 steel keeper pages. permanent:true → Next
      // serves 308 (Google treats as 301). Placed BEFORE ...csvRedirects so
      // first-match-wins. Both destinations verified live HTTP 200 and are NOT
      // themselves redirect sources (no chain, no loop). Rollback = revert this
      // block (and restore the movable-storage destination below).
      //
      // (B42-2) Movable-storage guide: this source ALREADY redirected (→
      // /product-category/industrial-sheds). Owner approved repointing it to the
      // steel storage-sheds keeper guide. Destination changed below — single hop.
      // ──────────────────────────────────────────────────
      {
        source: '/temporary-sheds-your-guide-to-small-portable-and-movable-storage-solutions',
        destination: 'https://www.samanportable.com/portable-sheds-complete-guide-2024',
        permanent: true,
      },
      // (B43, held 2026-06-21 — SEPARATE owner Manzar YES required before push):
      // the SHORT published slug serving the SAME old movable/fabric/collapsible
      // shed guide. B42 redirected only the long descriptive slug; this short
      // slug stayed live 200 as a cannibal of the steel keeper. Evidence: 6M =
      // 0 clicks / 187 impr / pos 17.52, off-brand fabric+tent+plastic body
      // (SAMAN sells steel). Single hop → keeper is a live 200 and NOT a redirect
      // source (no chain); short slug is NOT a destination anywhere (no loop);
      // no internal links point to it. permanent:true → 308 (Google treats 301).
      // Rollback = delete this block. HELD: do not push without owner YES.
      {
        source: '/temporary-sheds-guide-2024',
        destination: 'https://www.samanportable.com/portable-sheds-complete-guide-2024',
        permanent: true,
      },
      // (B42-1) Car-portable-garage: near-duplicate of the steel car-shed keeper
      // (pos ~31, slipping). New 301 → /portable-car-shed (keeper ranks pos 1.88
      // "readymade car parking shed"). Source dropped from sitemap automatically
      // (next-sitemap collects redirect sources). Destination is a 200 keeper.
      {
        source: '/car-portable-garage',
        destination: 'https://www.samanportable.com/portable-car-shed',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // P2-B50 (HELD 2026-06-21 — owner Manzar YES required before push):
      // off-brand "used / preloved / recycled" office blogs consolidated onto an
      // honest keeper. SAMAN sells NEW (CLAUDE.md brand lock), so these three
      // off-brand pages misrepresent the brand and carry ZERO unique traffic
      // (verified against GSC 6M + 16M Pages reports: none appear). Each source
      // is live HTTP 200 on www; each destination is live HTTP 200 and is NOT
      // itself a redirect source (no chain); no source is a destination anywhere
      // (no loop). Placed BEFORE ...csvRedirects so first-match-wins. permanent:
      // true -> Next serves 308 (Google treats as 301). Rollback = delete this
      // block. HELD: do not push without owner YES.
      //
      // (B50-1) Preloved office modules: off-brand used framing, 0 GSC traffic.
      // -> /second-hand-container-office (the kept honest "Used Container Office
      // Buying Guide" — already the keeper for 2 other refurbished/used office-
      // container sources at lines ~780/785).
      {
        source: '/competitive-prices-for-preloved-office-modules',
        destination: 'https://www.samanportable.com/second-hand-container-office',
        permanent: true,
      },
      // (B50-2) Top-rated recycled office structures: off-brand recycled framing,
      // 0 GSC traffic. -> same honest used keeper.
      {
        source: '/top-rated-recycled-office-structures',
        destination: 'https://www.samanportable.com/second-hand-container-office',
        permanent: true,
      },
      // (B50-3) Used portacabins for sale (SHORT slug, live 200, 0 GSC traffic):
      // a porta-cabin-cluster off-brand "used" duplicate. Its trafficked twin —
      // the long slug /used-portacabin-for-sale-porta-cabin-office-second-hand-
      // portacabin (225 clicks 16M, pos ~12) — ALREADY 301s to
      // /product-category/porta-cabins (redirects-from-csv.js:158). This short
      // slug is sent to the SAME cluster-correct keeper for consistency (porta
      // cabin -> porta-cabin category, not the C4 container-office guide).
      // Destination verified 200 and is NOT a redirect source.
      {
        source: '/used-portacabins-for-sale',
        destination: 'https://www.samanportable.com/product/porta-cabins',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // BATCH 2 — C7 TN re-point (owner approved 2026-06-10)
      // Inline override of 3 stale CSV rules (sources currently in
      // "Untitled spreadsheet - Sheet1 (1).csv" → /product-category/container-houses).
      // Placed BEFORE ...csvRedirects so first-match-wins; new dest = the live
      // TN price page (has Coimbatore + Chennai sections). NOT duplicates — overrides.
      // Target /container-house-price-in-tamil-nadu verified live 200, single hop.
      // ──────────────────────────────────────────────────
      {
        source: '/container-house-in-coimbatore',
        destination: 'https://www.samanportable.com/container-house-price-in-tamil-nadu',
        permanent: true,
      },
      {
        source: '/container-house-in-coimbatore-price',
        destination: 'https://www.samanportable.com/container-house-price-in-tamil-nadu',
        permanent: true,
      },
      {
        source: '/container-homes-chennai-guide',
        destination: 'https://www.samanportable.com/container-house-price-in-tamil-nadu',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // BATCH 4 — C6 R-C same-cluster consolidation (owner approved 2026-06-10)
      // Child product /product/labor-colony/prefab-labour-colony -> parent product
      // /product/labor-colony. Parent already contains the child's phrases x11
      // (P6-C1 pre-satisfied — no content edit). Placed BEFORE ...csvRedirects so
      // first-match-wins. Target /product/labor-colony verified live 200, single hop.
      // Rollback = remove this block.
      // ──────────────────────────────────────────────────
      {
        source: '/product/labor-colony/prefab-labour-colony',
        destination: 'https://www.samanportable.com/product/labor-colony',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // Owner-approved redirect (2026-06-15): consolidate "prefabricated-site-office"
      // onto "prefab-site-office". The owner approved the bare form
      // /prefabricated-site-office -> /prefab-site-office, BUT local verification
      // proved the bare destination /prefab-site-office returns 404 (HARD RULE 3
      // forbids redirecting to a 404). The real, live (HTTP 200) page is the nested
      // product /product/prefabricated-houses/prefab-site-office. So the SOURCE is
      // kept as approved and the DESTINATION is repointed to the verified 200 URL.
      // OPEN OWNER DECISION (see CERTIFICATION_ADDRESS_AND_FACT_CONFLICTS report):
      // the longer live product /product/prefabricated-houses/prefabricated-site-office
      // (currently 200) is NOT redirected here — confirm whether it should also be
      // merged into prefab-site-office before deploy.
      // Placed BEFORE ...csvRedirects (first-match-wins). 308 permanent.
      // Rollback = remove this block.
      // ──────────────────────────────────────────────────
      {
        source: '/prefabricated-site-office',
        destination: 'https://www.samanportable.com/product/prefabricated-houses/prefab-site-office',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // P2-B52 (2026-06-21): classroom consolidation. Of the 4 near-duplicate
      // "portable classroom" pages, /portable-classroom-for-sale-2 is the KEEPER
      // (68,920 impressions / 51 clicks over 16 months — by far the strongest;
      // body cleaned of false US-market claims in the same task). The bare slug
      // /portable-classroom-for-sale is a near-identical duplicate with ZERO
      // unique traffic (not present in GSC 6M or 16M pages) and a bloated 2.2 MB
      // body of embedded base64 images, so it is consolidated into the keeper.
      // One hop, destination is a live 200 keeper, no chain, no loop.
      // HELD: portable-classrooms (13,662 impr) and portable-classrooms-2
      // (16,733 impr) carry impressions and are NOT redirected here — owner call.
      // Placed BEFORE ...csvRedirects (first-match-wins). 308 permanent.
      // Rollback = remove this block.
      // ──────────────────────────────────────────────────
      {
        source: '/portable-classroom-for-sale',
        destination: 'https://www.samanportable.com/portable-classroom-for-sale-2',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // P2-B54 — Remaining classroom consolidation (2026-06-21).
      // Both /portable-classrooms and /portable-classrooms-2 are off-brand
      // US AI duplicates (USD prices, fabricated %, "Case Studies", "30 years"
      // experience, used-framing, banned words) that target a generic
      // education angle SAMAN cannot win in India. GSC: both collapsed to
      // ZERO clicks in the last 6 months (13,662→409 and 16,733→229 impr) and
      // share the keeper's exact topic with no unique surviving query. Live
      // SERP: the keeper /portable-classroom-for-sale-2 ranks #4 for the
      // buying query; neither page ranks. 301 consolidates residual signal
      // into the keeper (not a content throwaway). Same convention already
      // applied to modular-classroom*/portacabin-classroom* (csv:139,485).
      // Keeper is a live 200 page and is NOT a redirect source anywhere
      // (no chain, no loop, one hop). Placed BEFORE ...csvRedirects so
      // first-match-wins. 308 permanent. Rollback = remove this block.
      // ──────────────────────────────────────────────────
      {
        source: '/portable-classrooms',
        destination: 'https://www.samanportable.com/portable-classroom-for-sale-2',
        permanent: true,
      },
      {
        source: '/portable-classrooms-2',
        destination: 'https://www.samanportable.com/portable-classroom-for-sale-2',
        permanent: true,
      },

      // ──────────────────────────────────────────────────
      // P2-B55 (2026-06-21): 5 UNASSIGNED orphan blog URLs consolidated onto
      // their cluster-correct product-category keepers. All 5 are old AI/off-
      // brand Divi posts, NOT in Keyword Lock, NOT assigned to any cluster, with
      // ZERO unique GSC traffic worth protecting (verified GSC 6M + 16M Pages:
      // 3 absent entirely; small-cabin-designs = 0 clicks / 18 impr; small-
      // portable-buildings-solutions = 0 clicks / 10 impr — both 0 clicks). No
      // live page internally links to any of these 5 slugs (only blog tag-
      // taxonomy references exist). Each source verified live HTTP 200 on www;
      // each destination verified live HTTP 200 and appears ONLY as a redirect
      // DESTINATION in the manual list + redirects-from-csv.js (never a source)
      // -> single hop, no chain, no loop. No source is a destination anywhere
      // -> no loop. Placed BEFORE ...csvRedirects so first-match-wins.
      // permanent:true -> Next serves 308 (Google treats as 301). next-sitemap
      // auto-drops redirect sources. Rollback = delete this block.
      //
      // (B55-1) Prefabricated office buildings: 0/0 GSC. Off-brand generic prefab-
      // office post. -> /product-category/portable-office (the cluster where the
      // live ranking keeper for "prefabricated office" queries lives —
      // /product/portable-office/prefabricated-office-cabins, pos ~1.5-6).
      // ALTERNATE documented for owner: /product-category/prefab-buildings (cf.
      // CSV /prefab-office-spaces). Office-intent -> portable-office chosen.
      {
        source: '/prefabricated-office-buildings',
        destination: 'https://www.samanportable.com/product/portable-office',
        permanent: true,
      },
      // (B55-2) Small cabin designs: 0 clicks / 18 impr, off-brand residential
      // "cozy living" tiny-cabin content (SAMAN sells porta cabins). The cluster
      // winner /small-cabin-design-tips is out of scope (untouched). -> porta-
      // cabins category (cf. CSV /porta-cabin-design, /porta-cabin-designs-for-
      // 2024 -> same keeper; "porta cabin design" ranks pos ~1.1).
      {
        source: '/small-cabin-designs',
        destination: 'https://www.samanportable.com/product/porta-cabins',
        permanent: true,
      },
      // (B55-3) 6 reasons to buy a portable building (this winter): 0/0 GSC. Off-
      // brand foreign consumer storage-shed content. -> prefab-buildings category
      // (cf. CSV /portable-buildings, /portable-building-solutions -> same keeper).
      {
        source: '/6-reasons-benefits-2-buy-portable-building',
        destination: 'https://www.samanportable.com/product/prefab-buildings',
        permanent: true,
      },
      // (B55-4) Small portable buildings solutions: 0 clicks / 10 impr. Duplicate
      // SHORT slug of /small-portable-buildings-versatile-solutions-for-modern-
      // needs which ALREADY 301s -> /product-category/prefab-buildings (CSV:535).
      // Same title, same off-brand body. Sent to the SAME keeper for consistency.
      {
        source: '/small-portable-buildings-solutions',
        destination: 'https://www.samanportable.com/product/prefab-buildings',
        permanent: true,
      },
      // (B55-5) Rise of prefab office & structures in 2024: 0/0 GSC. Dated-slug
      // AI/3D-printing dupe of the 2023 post /revolutionizing-construction-the-
      // rise-of-prefab-office-and-structures-in-2023 which ALREADY 301s ->
      // /product-category/prefab-buildings (CSV:532). 2024 dead dupe sent to the
      // SAME keeper for consistency (resolves the B53 redirect-vs-retire question).
      {
        source: '/rise-of-prefab-office-and-structures-in-2024',
        destination: 'https://www.samanportable.com/product/prefab-buildings',
        permanent: true,
      },

      // ─── P2-B58 (HELD 2026-06-21 — owner Manzar YES required before push) ───
      // C1/C2 duplicate-twin consolidation. For 7 Bangalore localities that have
      // BOTH a "porta-cabin / portacabins-for-sale" (C1) page AND a systematic
      // "portable-cabins-in-X" (C2) page, Google + IndiaMART treat "porta cabin"
      // = "portable cabin" as one product, so the twin pages self-cannibalise.
      // Decision (B56): keep the C2 "portable-cabins-in-X" set as the one locality
      // template; 301 the C1 twin into its matching C2 keeper.
      //
      // Safety (all verified 2026-06-21 on www.samanportable.com):
      //  • Every C1 SOURCE earns 0 GSC clicks — none of the 7 sources appears in
      //    GSC 6M or 16M Pages at all (below reporting threshold). 0 traffic lost.
      //  • Every C2 TARGET returns live HTTP 200 (7/7 curl-confirmed).
      //  • No target is a redirect SOURCE anywhere -> single hop, no chain.
      //  • No clean source is a redirect DESTINATION anywhere -> no loop.
      //  • permanent:true -> Next serves 308 (Google treats as 301). next-sitemap
      //    auto-drops redirect sources. Rollback = delete this block (+ revert the
      //    two B58 chain-prevention repoints tagged "B58" above at the peenya and
      //    frazer-town predecessor rules).
      //
      // CHAIN-PREVENTION NOTE: twins #6 (peenya) and #7 (frazer) sit BEHIND an
      // existing redirect (portacabins-for-sale-in-peenya -> porta-cabins-in-
      // peenya-f ; portacabins-for-sale-in-frazer-town -> porta-cabins-in-frazer).
      // To keep every URL one hop, those two PREDECESSOR rules are repointed
      // straight to the C2 keeper in the same change (see "B58" tags above). After
      // this block, all four URLs (the 2 C1 twins + their 2 predecessors) land on
      // the keeper in a single 308.
      //
      // (B58-1) Hennur — C1 twin, 0/0 GSC. (keeper also receives
      // /portable-cabin-solutions-in-hennur, already live.)
      {
        source: '/portacabins-for-sale-in-hennur',
        destination: 'https://www.samanportable.com/portable-cabins-in-hennur',
        permanent: true,
      },
      // (B58-2) Hoskote — C1 twin, 0/0 GSC.
      {
        source: '/portacabins-for-sale-in-hoskote',
        destination: 'https://www.samanportable.com/portable-cabins-in-hoskote',
        permanent: true,
      },
      // (B58-3) Indiranagar — C1 twin, 0/0 GSC. (C1 twin also carried fake
      // reviews/client claims — redirect removes that liability for free.)
      {
        source: '/portacabins-for-sale-in-indiranagar',
        destination: 'https://www.samanportable.com/portable-cabins-in-indiranagar',
        permanent: true,
      },
      // (B58-4) KR Puram — C1 twin, 0/0 GSC. (C1 twin flagged "outranked by own
      // page" in the Master Keyword Map.)
      {
        source: '/portacabins-for-sale-in-kr-puram',
        destination: 'https://www.samanportable.com/portable-cabins-in-kr-puram',
        permanent: true,
      },
      // (B58-5) Magadi Road — C1 twin, 0/0 GSC. (C1 twin carried banned words +
      // a client claim — redirect removes it.)
      {
        source: '/portacabins-for-sale-in-magadi-road',
        destination: 'https://www.samanportable.com/portable-cabins-in-magadi-road',
        permanent: true,
      },
      // (B58-6) Peenya — C1 twin porta-cabins-in-peenya-f (live 200, 0 clicks)
      // -> keeper portable-cabins-in-peenya (live 200; GSC 0clk/9impr/pos 6, the
      // stronger of the pair). Predecessor portacabins-for-sale-in-peenya repointed
      // to the same keeper above (B58) to avoid a 2-hop chain.
      {
        source: '/porta-cabins-in-peenya-f',
        destination: 'https://www.samanportable.com/portable-cabins-in-peenya',
        permanent: true,
      },
      // (B58-7) Frazer — C1 twin porta-cabins-in-frazer (live 200, 0 clicks) ->
      // keeper portable-cabins-in-frazer-town (live 200; "Frazer Town" is the
      // correct Bangalore locality name, "frazer" is a truncation). Predecessor
      // portacabins-for-sale-in-frazer-town repointed to the same keeper above
      // (B58) to avoid a 2-hop chain.
      {
        source: '/porta-cabins-in-frazer',
        destination: 'https://www.samanportable.com/portable-cabins-in-frazer-town',
        permanent: true,
      },

      // === C1 PORTA CABIN redirect specificity upgrades (Agent B P3 2026-06-22, 28) — repoint generic hub redirects to closest live keeper; BEFORE ...csvRedirects (first-match-wins) ===
      { source: '/porta-cabin-office-with-toilet', destination: 'https://www.samanportable.com/porta-cabin-office-price', permanent: true },
      { source: '/porta-cabin-is-the-best-option', destination: 'https://www.samanportable.com/porta-cabins-in-delhi-ncr', permanent: true },
      { source: '/porta-cabin-bangalore', destination: 'https://www.samanportable.com/portacabins-for-sale-in-bangalore', permanent: true },
      { source: '/porta-cabin-price-in-india', destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025', permanent: true },
      { source: '/porta-cabin-offices-for-sale', destination: 'https://www.samanportable.com/porta-cabin-office-price', permanent: true },
      { source: '/porta-cabin-cost-per-square-foot', destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025', permanent: true },
      { source: '/luxury-office-porta-cabins-benefits', destination: 'https://www.samanportable.com/porta-cabin-office-price', permanent: true },
      { source: '/porta-cabin-costs-2024-guide', destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025', permanent: true },
      { source: '/porta-cabin-cost', destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025', permanent: true },
      { source: '/porta-cabin-toilet-price', destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025', permanent: true },
      { source: '/porta-cabins-under-1-lakh', destination: 'https://www.samanportable.com/cheap-porta-cabins-for-sale', permanent: true },
      { source: '/rent-vs-buy-porta-cabins', destination: 'https://www.samanportable.com/porta-cabins-on-rent', permanent: true },
      { source: '/the-rise-of-portacabin-offices', destination: 'https://www.samanportable.com/porta-cabin-office-price', permanent: true },
      { source: '/small-modular-porta-cabins-benefits', destination: 'https://www.samanportable.com/cheap-porta-cabins-for-sale', permanent: true },
      { source: '/office-porta-cabin-for-sale', destination: 'https://www.samanportable.com/porta-cabin-office-price', permanent: true },
      { source: '/porta-cabin-supplier-delhi-custom-solutions', destination: 'https://www.samanportable.com/best-porta-cabin-manufacturer-ncr', permanent: true },
      { source: '/porta-cabin-manufacturer', destination: 'https://www.samanportable.com/best-porta-cabin-manufacturer-ncr', permanent: true },
      { source: '/porta-cabins-under-4-lakhs', destination: 'https://www.samanportable.com/cheap-porta-cabins-for-sale', permanent: true },
      { source: '/porta-cabins-under-6-lakhs', destination: 'https://www.samanportable.com/cheap-porta-cabins-for-sale', permanent: true },
      { source: '/used-portacabin-for-sale-porta-cabin-office-second-hand-portacabin', destination: 'https://www.samanportable.com/2nd-hand-porta-cabins', permanent: true },
      { source: '/porta-cabins-under-5-lakhs', destination: 'https://www.samanportable.com/cheap-porta-cabins-for-sale', permanent: true },
      { source: '/porta-cabins-under-3-lakhs', destination: 'https://www.samanportable.com/cheap-porta-cabins-for-sale', permanent: true },
      { source: '/porta-cabin-price-list', destination: 'https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025', permanent: true },
      { source: '/portacabins-for-sale-in-mg-road', destination: 'https://www.samanportable.com/2nd-hand-porta-cabins', permanent: true },
      { source: '/porta-cabins-under-2-lakhs', destination: 'https://www.samanportable.com/cheap-porta-cabins-for-sale', permanent: true },
      { source: '/bommasandra-porta-cabins', destination: 'https://www.samanportable.com/portacabins-for-sale-in-bommasandra', permanent: true },
      { source: '/20ft-porta-cabin', destination: 'https://www.samanportable.com/porta-cabin-sizes-and-specifications-in-india', permanent: true },
      { source: '/porta-cabins-in-mg-road', destination: 'https://www.samanportable.com/portacabins-for-sale-in-bangalore', permanent: true },

      ...csvRedirects,
    ];

    // Only add HTTPS and WWW redirects in production
    if (process.env.NODE_ENV === 'production') {
      redirects.push(
        // Force HTTPS and WWW redirects
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'samanportable.com',
            },
          ],
          destination: 'https://www.samanportable.com/:path*',
          permanent: true,
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'http://samanportable.com',
            },
          ],
          destination: 'https://www.samanportable.com/:path*',
          permanent: true,
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'http://www.samanportable.com',
            },
          ],
          destination: 'https://www.samanportable.com/:path*',
          permanent: true,
        }
      );
    }

    return redirects;
  },

  // Rewrites — serve a page's response under a different URL WITHOUT redirecting.
  // /track-your-order (WooCommerce system page, intentionally removed 2026-06-09) is
  // rewritten to the /410 SSR page, which sets res.statusCode = 410. This returns a
  // TRUE HTTP 410 Gone at the original URL (no 3xx redirect). afterFiles so it only
  // fires when no real page/route matches. (middleware.ts does not run on www.)
  async rewrites() {
    return {
      // beforeFiles: intercept BEFORE dynamic [slug] routes (which would otherwise
      // match /track-your-order and return notFound/404, shadowing an afterFiles rule).
      beforeFiles: [
        { source: '/track-your-order', destination: '/410' },
        { source: '/track-your-order/', destination: '/410' },
      ],
    };
  },

  // Headers for security and performance
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          ],
        },
      ];
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // NOTE: deliberately NO catch-all Cache-Control here.
          // HTML pages must NOT be cached as "immutable" for a year — that serves stale
          // content (old prices/content) to returning visitors and crawlers. Next.js sets
          // the correct per-page Cache-Control on its own (s-maxage for ISR/getStaticProps
          // pages, private/no-cache for getServerSideProps). Long-lived immutable caching is
          // applied ONLY to static assets in the dedicated rules below.
          // Enhanced performance headers for Core Web Vitals
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Image caching headers
      {
        source: '/Gallery/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: '/:path*.(jpg|jpeg|png|gif|webp|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
    ];
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations - ENHANCED
  experimental: {
    // Build-time static-generation concurrency cap (applies to `next build` only):
    // limits prerender worker count so the getStaticProps fetch burst stays under
    // the shared LiteSpeed host's safe ~4 concurrent. Does NOT affect runtime
    // SSR/getServerSideProps or ISR on-demand revalidation concurrency.
    cpus: 3,
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Reduce bundle size warnings
    largePageDataBytes: 128 * 1024, // 128KB threshold instead of default 128KB
    // Additional performance optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Optimize bundle splitting
    bundlePagesExternals: true,
    // Enhanced performance features
    // Optimize CSS extraction
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', '@radix-ui/react-accordion'],
  },

  // Compression
  compress: true,

  // Reduce page data warning threshold
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Bundle analyzer (optional - uncomment to analyze bundle size)
  // webpackBundleAnalyzer: process.env.ANALYZE === 'true',
};

module.exports = nextConfig;
