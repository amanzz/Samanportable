/** @type {import('next').NextConfig} */
// AUTO-GENERATED CSV redirects (572 entries) – do not edit redirects-from-csv.js by hand.
const csvRedirects = require('./redirects-from-csv');
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
    // Optimize loading performance - ENHANCED
    loader: 'default',
    unoptimized: false // Enable Next.js image optimization

  },

  // Force HTTPS and WWW redirects
  async redirects() {
    const redirects = [
      // Duplicate URL redirects for SEO - Container Cafes
      {
        source: '/container-cafes-in-central-delhi-2',
        destination: '/container-cafes-in-central-delhi',
        permanent: true,
      },
      // Duplicate URL redirects for SEO - Container Offices
      {
        source: '/container-offices-in-gurgaon-2',
        destination: '/container-offices-in-gurgaon',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-btm-layout-2',
        destination: '/container-offices-for-sale-in-btm-layout',
        permanent: true, // SEO-safe (Next.js serves 308; OK same as 301 for Google)
      },
      {
        source: '/container-offices-for-sale-in-rt-nagar-2',
        destination: '/container-offices-for-sale-in-rt-nagar',
        permanent: true,
      },
      // Duplicate URL redirects for SEO - Porta Cabins
      {
        source: '/portacabins-for-sale-in-hebbal-2',
        destination: '/porta-cabins-in-hebbal',
        permanent: true,
      },
      // Additional duplicate URL redirects
      {
        source: '/innovative-office-container-designs-2',
        destination: '/product-category/container-offices',
        permanent: true,
      },
      // Blog to product page redirect
      {
        source: '/luxury-porta-cabins-your-portable-oasis-of-comfort-and-style',
        destination: '/product/porta-cabins/luxury-porta-cabin',
        permanent: true,
      },

      // NEW REDIRECTS FROM BROKEN LINKS LIST - 301 REDIRECTS
      {
        source: '/wp-content/uploads/2020/04/saman-profiles.pdf',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2020/03/saman-catalogue.pdf',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/products/shipping-container-house',
        destination: '/product/container-houses',
        permanent: true,
      },
      {
        source: '/project/portable-cabins-manufacturer',
        destination: '/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/project/industrial-shed-manufacturer',
        destination: '/product/industrial-sheds',
        permanent: true,
      },
      {
        source: '/porta-cabins',
        destination: '/product/porta-cabins',
        permanent: true,
      },
      {
        source: '/products/kitchen-container',
        destination: '/product/container-houses',
        permanent: true,
      },
      {
        source: '/container-office-for-sale-in-bangalore',
        destination: '/product/container-offices',
        permanent: true,
      },
      {
        source: '/products/portable-cabin',
        destination: '/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/products/mobile-toilet',
        destination: '/product/portable-toilet',
        permanent: true,
      },
      {
        source: '/project/container-homes',
        destination: '/product/container-houses',
        permanent: true,
      },
      {
        source: '/labour-colonies-in-najafgarh',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/products/portable-toilet',
        destination: '/product/portable-toilet',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-central-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-central-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/products/industrial-shed-manufacturer',
        destination: '/product/industrial-sheds',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-nagarbhavi-3',
        destination: '/product/container-offices',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-east-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-in-okhla-industrial',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-west-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-in-loni-ghaziabad',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-peenya',
        destination: '/product/container-offices',
        permanent: true,
      },
      {
        source: '/products/mobile-home',
        destination: '/product/container-houses',
        permanent: true,
      },
      {
        source: '/project/portable-cabin',
        destination: '/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/labour-camps-in-noida',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-north-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-camps-in-ghaziabad',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-lucknow',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-north-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/products/office-cabins',
        destination: '/product/portable-office/portable-office-cabin',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-south-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-new-delhi',
        destination: '/product/labor-colony',
        permanent: true,
      },
      {
        source: '/container-offices-for-sale-in-hosur-3',
        destination: '/product/container-offices',
        permanent: true,
      },
      {
        source: '/prefab-labour-colonies-in-meerut',
        destination: '/product/labor-colony',
        permanent: true,
      },

      // 410 GONE REDIRECTS - These redirect to the 410 page
      {
        source: '/find-out-how-i-cured-my-easter-weekend-in-2-days',
        destination: '/410',
        permanent: true,
      },

      // ─── BLOG DEDUPE REDIRECTS (42 entries from SAMAN_Blog_Dedupe_Action_List.csv) ───
      {
        source: '/portacabins-for-sale-in-hosur',
        destination: '/affordable-porta-cabins-in-hosur',
        permanent: true,
      },
      {
        source: '/affordable-prefabricated-homes-delhi',
        destination: '/top-quality-prefab-cabins-delhi',
        permanent: true,
      },
      {
        source: '/warehouse-manufacturer-in-bangalore',
        destination: '/industrial-sheds-in-bangalore',
        permanent: true,
      },
      {
        source: '/low-cost-porta-cabins',
        destination: '/porta-cabin-price-a-complete-guide-2025',
        permanent: true,
      },
      {
        source: '/office-cabin-rentals-in-delhi',
        destination: '/portable-office-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/prefabricated-porta-cabin-in-delhi-ncr',
        destination: '/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-in-delhi-ncr',
        destination: '/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/trusted-porta-cabin-dealer-in-delhi-ncr',
        destination: '/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-price-in-delhi',
        destination: '/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-manufacturer-in-delhi',
        destination: '/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-manufacturer-in-delhi-ncr',
        destination: '/porta-cabins-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/porta-cabin-manufacturer-in-bangalore',
        destination: '/portacabins-for-sale-in-bangalore',
        permanent: true,
      },
      {
        source: '/porta-cabin-size',
        destination: '/porta-cabin-sizes-and-specifications-in-india',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-anekal',
        destination: '/porta-cabins-in-anekal',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-banashankari',
        destination: '/porta-cabins-in-banashankari',
        permanent: true,
      },
      {
        source: '/porta-cabins-in-bannerghatta-road',
        destination: '/portacabins-for-sale-in-bannerghatta-road',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-bellandur',
        destination: '/porta-cabins-in-bellandur',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-btm-layout',
        destination: '/porta-cabins-in-btm-layout',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-domlur',
        destination: '/porta-cabins-in-domlur',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-electronic-city',
        destination: '/porta-cabins-in-electronic-city',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-hebbal',
        destination: '/porta-cabins-in-hebbal',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-hsr-layout',
        destination: '/porta-cabins-in-hsr-layout',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-jayanagar',
        destination: '/porta-cabins-in-jayanagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-jigani',
        destination: '/porta-cabins-in-jigani',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-jp-nagar',
        destination: '/porta-cabins-in-jp-nagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-kengeri',
        destination: '/porta-cabins-in-kengeri',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-koramangala',
        destination: '/porta-cabins-in-koramangala',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-malleshwaram',
        destination: '/porta-cabins-in-malleshwaram',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-marathahalli',
        destination: '/porta-cabins-in-marathahalli',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-nagarbhavi',
        destination: '/porta-cabins-in-nagarbhavi',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-peenya',
        destination: '/porta-cabins-in-peenya-f',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-rajajinagar',
        destination: '/porta-cabins-in-rajajinagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-rt-nagar',
        destination: '/porta-cabins-in-rt-nagar',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-sarjapur-road',
        destination: '/porta-cabins-in-sarjapur-road',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-ulsoor',
        destination: '/porta-cabins-in-ulsoor',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-vijayanagar',
        destination: '/porta-cabins-in-vijayanagar',
        permanent: true,
      },
      {
        source: '/porta-cabins-in-whitefield',
        destination: '/portacabins-for-sale-in-whitefield',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-yelahanka',
        destination: '/porta-cabins-in-yelahanka',
        permanent: true,
      },
      {
        source: '/portable-cabin-suppliers-in-bangalore',
        destination: '/portable-cabin-price-in-bangalore',
        permanent: true,
      },
      {
        source: '/portable-cabins-for-sale-in-bangalore-option',
        destination: '/portable-cabin-price-in-bangalore',
        permanent: true,
      },
      {
        source: '/portable-cabin-solutions-in-hennur',
        destination: '/portable-cabins-in-hennur',
        permanent: true,
      },
      {
        source: '/trusted-porta-cabins-in-shivajinagar',
        destination: '/portacabins-for-sale-in-shivajinagar',
        permanent: true,
      },

      // ─── GSC "Not found 404" redirect-worthy small batch (1:1 equivalents) ─
      // Six high-confidence 301s for legacy 404 URLs whose canonical page is live (200).
      // Destinations are slash-less (trailingSlash:false). No CMS recategorisation here.
      {
        source: '/product/uncategorized/office-portable-cabin',
        destination: '/product/portable-cabin/office-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/uncategorized/small-portable-cabin',
        destination: '/product/portable-cabin/small-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/uncategorized/mobile-office-container',
        destination: '/product/container-offices/mobile-office-container',
        permanent: true,
      },
      {
        source: '/product/uncategorized/portable-cabin-with-toilet',
        destination: '/product/portable-cabin/portable-cabin-with-toilet',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/labour-colonies-for-sale-in-west-delhi',
        destination: '/labour-colonies-in-west-delhi',
        permanent: true,
      },

      // ─── GSC "Soft 404" Group A (nonexistent category → real listing) ─────
      // /product-category/products is not a real WooCommerce category; it renders an
      // empty "No products" page at 200 (soft 404). Redirect to the real /product listing.
      {
        source: '/product-category/products',
        destination: '/product',
        permanent: true,
      },

      // ─── URL Index-Control Batch 2 (business-approved old-URL → closest live
      // commercial category). Targets verified 200; sources/destinations slash-less;
      // no CMS recategorisation. Weak/ambiguous + removed-article URLs intentionally
      // excluded (kept 404 / 410-later). ───────────────────────────────────
      {
        source: '/office-cabins',
        destination: '/product-category/portable-office',
        permanent: true,
      },
      {
        source: '/project/container-cafe-india',
        destination: '/product-category/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-cafe',
        destination: '/product-category/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-homes-new',
        destination: '/product-category/container-houses',
        permanent: true,
      },
      {
        source: '/portfolio/portable-cabin-manufacturers-in-bangalore',
        destination: '/product-category/portable-cabin',
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
        destination: '/porta-cabin-sizes-and-specifications-in-india',
        permanent: true,
      },
      // C1 Porta Cabin (8)
      {
        source: '/second-hand-portacabin-offices-for-sale',
        destination: '/2nd-hand-porta-cabins',
        permanent: true,
      },
      {
        source: '/best-porta-cabin-solutions-10-top-designs',
        destination: '/best-porta-cabin-manufacturer-ncr',
        permanent: true,
      },
      {
        source: '/best-porta-cabin-supplier',
        destination: '/best-porta-cabin-manufacturer-ncr',
        permanent: true,
      },
      {
        source: '/best-porta-cabins-india-solutions',
        destination: '/best-porta-cabin-manufacturer-ncr',
        permanent: true,
      },
      {
        source: '/customized-porta-cabins',
        destination: '/durable-porta-cabins',
        permanent: true,
      },
      {
        source: '/rapid-construction-porta-cabins-ncr',
        destination: '/durable-porta-cabins',
        permanent: true,
      },
      {
        source: '/top-quality-ms-porta-cabin',
        destination: '/durable-porta-cabins',
        permanent: true,
      },
      {
        source: '/portacabins-for-sale-in-frazer-town',
        destination: '/porta-cabins-in-frazer',
        permanent: true,
      },
      // C2 Portable Cabin (3)
      {
        source: '/affordable-portable-cabins-for-rent',
        destination: '/cheap-portable-cabins',
        permanent: true,
      },
      {
        source: '/cheap-portable-cabins-for-sale',
        destination: '/cheap-portable-cabins',
        permanent: true,
      },
      {
        source: '/best-materials-for-portable-cabins',
        destination: '/top-rated-portable-cabin-supplier-delhi',
        permanent: true,
      },
      // C3 Portable Office (2)
      {
        source: '/cost-effective-office-cabin-rentals',
        destination: '/discount-mobile-office-units',
        permanent: true,
      },
      {
        source: '/cost-effective-temporary-office-cabins',
        destination: '/discount-mobile-office-units',
        permanent: true,
      },
      // C4 Container Office (4)
      {
        source: '/cheap-container-office',
        destination: '/affordable-office-containers-for-sale',
        permanent: true,
      },
      {
        source: '/reliable-office-container-manufacturers',
        destination: '/best-container-office-solutions',
        permanent: true,
      },
      {
        source: '/best-deals-on-refurbished-office-containers',
        destination: '/second-hand-container-office',
        permanent: true,
      },
      {
        source: '/second-hand-office-container-for-sale',
        destination: '/second-hand-container-office',
        permanent: true,
      },
      // C7 Container House (1)
      {
        source: '/second-hand-container-for-sale',
        destination: '/2nd-hand-containers',
        permanent: true,
      },
      // C11 Prefab Building (2)
      {
        source: '/affordable-portable-structures',
        destination: '/low-cost-modular-office-solutions',
        permanent: true,
      },
      {
        source: '/affordable-prefab-office-buildings',
        destination: '/low-cost-modular-office-solutions',
        permanent: true,
      },
      // C12 Prefab House (2 — chain-flattened from old /affordable-prefabricated-homes-delhi)
      {
        source: '/affordable-prefab-homes',
        destination: '/top-quality-prefab-cabins-delhi',
        permanent: true,
      },
      {
        source: '/affordable-small-prefab-cabins',
        destination: '/top-quality-prefab-cabins-delhi',
        permanent: true,
      },

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
        destination: '/product/container-houses/affordable-container-homes',
        permanent: true,
      },
      {
        source: '/product/buy-container-buildings',
        destination: '/product/prefab-buildings/buy-container-buildings',
        permanent: true,
      },
      {
        source: '/product/buy-porta-cabins',
        destination: '/product/porta-cabins/buy-porta-cabins',
        permanent: true,
      },
      {
        source: '/product/buy-portable-cabin',
        destination: '/product/portable-cabin/buy-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/cargo-container-house',
        destination: '/product/container-houses/cargo-container-house',
        permanent: true,
      },
      {
        source: '/product/cargo-container-office',
        destination: '/product/container-offices/cargo-container-office',
        permanent: true,
      },
      {
        source: '/product/container-coffee-shop',
        destination: '/product/container-cafe/container-coffee-shop',
        permanent: true,
      },
      {
        source: '/product/container-office-cabin',
        destination: '/product/container-offices/container-office-cabin',
        permanent: true,
      },
      {
        source: '/product/container-office',
        destination: '/product/container-offices/container-office-cabin',
        permanent: true,
      },
      {
        source: '/product/container-portable-cabin',
        destination: '/product/portable-cabin/container-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/container-portable-office',
        destination: '/product/container-offices/container-portable-office',
        permanent: true,
      },
      {
        source: '/product/container-restaurant',
        destination: '/product/container-cafe/container-restaurant',
        permanent: true,
      },
      {
        source: '/product/container-site-office',
        destination: '/product/container-offices/site-office-container',
        permanent: true,
      },
      {
        source: '/product/food-truck-containers',
        destination: '/product/container-cafe/food-truck-containers',
        permanent: true,
      },
      {
        source: '/product/garden-sheds',
        destination: '/product/industrial-sheds/garden-sheds',
        permanent: true,
      },
      {
        source: '/product/inexpensive-container-homes',
        destination: '/product/container-houses/inexpensive-container-homes',
        permanent: true,
      },
      {
        source: '/product/low-cost-porta-cabin',
        destination: '/product/porta-cabins/low-cost-porta-cabin',
        permanent: true,
      },
      {
        source: '/product/luxury-container-houses',
        destination: '/product/container-houses/luxury-container-houses',
        permanent: true,
      },
      {
        source: '/product/luxury-porta-cabin',
        destination: '/product/porta-cabins/luxury-porta-cabin',
        permanent: true,
      },
      {
        source: '/product/mobile-container-cafe',
        destination: '/product/container-cafe/mobile-container-cafe',
        permanent: true,
      },
      {
        source: '/product/mobile-container-office',
        destination: '/product/container-offices/mobile-office-container',
        permanent: true,
      },
      {
        source: '/product/mobile-office-container',
        destination: '/product/container-offices/mobile-office-container',
        permanent: true,
      },
      {
        source: '/product/modern-container-home',
        destination: '/product/container-houses/modern-container-home',
        permanent: true,
      },
      {
        source: '/product/modern-office-cabin',
        destination: '/product/portable-office/modern-office-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-container-cafe',
        destination: '/product/container-cafe/modular-container-cafe',
        permanent: true,
      },
      {
        source: '/product/modular-container-office',
        destination: '/product/container-offices/modular-container-office',
        permanent: true,
      },
      {
        source: '/product/modular-office-cabin',
        destination: '/product/portable-office/modular-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-portable-cabin',
        destination: '/product/portable-cabin/modular-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-portable-office-cabin',
        destination: '/product/portable-office/modular-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/modular-shipping-container-office',
        destination: '/product/container-offices/modular-shipping-container-office',
        permanent: true,
      },
      {
        source: '/product/movable-toilet-cabin',
        destination: '/product/portable-toilet/movable-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/ms-portable-cabin',
        destination: '/product/portable-cabin/ms-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/ms-portable-office-cabin',
        destination: '/product/portable-office/ms-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/porta-cabin-house',
        destination: '/product/prefabricated-houses/porta-cabin-house',
        permanent: true,
      },
      {
        source: '/product/porta-cabin-office',
        destination: '/product/porta-cabins/porta-cabin-office',
        permanent: true,
      },
      {
        source: '/product/porta-cabin-shop',
        destination: '/product/porta-cabins/porta-cabin-shop',
        permanent: true,
      },
      {
        source: '/product/portable-cabin-building',
        destination: '/product/portable-cabin/portable-cabin-building',
        permanent: true,
      },
      {
        source: '/product/portable-cabin-house',
        destination: '/product/portable-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-cabin-with-toilet',
        destination: '/product/portable-toilet/portable-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-container-offices',
        destination: '/product/container-offices/portable-container-offices',
        permanent: true,
      },
      {
        source: '/product/portable-office-cabin',
        destination: '/product/portable-office/portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-office-container',
        destination: '/product/portable-office/portable-office-container',
        permanent: true,
      },
      {
        source: '/product/portable-security-cabin',
        destination: '/product/security-cabins/portable-security-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-shop-cabin',
        destination: '/product/portable-cabin/portable-shop-cabin',
        permanent: true,
      },
      {
        source: '/product/portable-toilet-cabin',
        destination: '/product/portable-toilet/portable-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/prebuilt-container-homes',
        destination: '/product/container-houses/prebuilt-container-homes',
        permanent: true,
      },
      {
        source: '/product/prefab-container-homes',
        destination: '/product/container-houses/prefab-container-homes',
        permanent: true,
      },
      {
        source: '/product/prefab-office-buildings',
        destination: '/product/prefab-buildings/prefab-office-buildings',
        permanent: true,
      },
      {
        source: '/product/prefab-steel-house',
        destination: '/product/industrial-sheds/prefab-steel-house',
        permanent: true,
      },
      {
        source: '/product/prefabricated-bunkhouse',
        destination: '/product/prefabricated-houses/prefabricated-bunkhouse',
        permanent: true,
      },
      {
        source: '/product/prefabricated-container-home',
        destination: '/product/container-houses/prefabricated-container-home',
        permanent: true,
      },
      {
        source: '/product/prefabricated-container-house',
        destination: '/product/container-houses/prefabricated-container-house',
        permanent: true,
      },
      {
        source: '/product/prefabricated-container-office',
        destination: '/product/container-offices/prefabricated-container-office',
        permanent: true,
      },
      {
        source: '/product/prefabricated-office-cabins',
        destination: '/product/portable-office/prefabricated-office-cabins',
        permanent: true,
      },
      {
        source: '/product/prefabricated-porta-cabin',
        destination: '/product/porta-cabins/prefabricated-porta-cabin',
        permanent: true,
      },
      {
        source: '/product/prefabricated-portable-cabin',
        destination: '/product/portable-cabin/prefabricated-portable-cabin',
        permanent: true,
      },
      {
        source: '/product/prefabricated-portable-office-cabin',
        destination: '/product/portable-office/prefabricated-portable-office-cabin',
        permanent: true,
      },
      {
        source: '/product/prefabricated-toilet',
        destination: '/product/portable-toilet/prefabricated-toilet',
        permanent: true,
      },
      {
        source: '/product/prefabricated-warehouses',
        destination: '/product/industrial-sheds/prefabricated-warehouses',
        permanent: true,
      },
      {
        source: '/product/readymade-office-cabin',
        destination: '/product/portable-office/readymade-office-cabin',
        permanent: true,
      },
      {
        source: '/product/readymade-security-cabin',
        destination: '/product/security-cabins/readymade-security-cabin',
        permanent: true,
      },
      {
        source: '/product/readymade-toilet-cabin',
        destination: '/product/portable-toilet/readymade-toilet-cabin',
        permanent: true,
      },
      {
        source: '/product/restaurant-food-containers',
        destination: '/product/container-cafe/restaurant-food-containers',
        permanent: true,
      },
      {
        source: '/product/saman-prefab-office',
        destination: '/product/prefabricated-houses/saman-prefab-office',
        permanent: true,
      },
      {
        source: '/product/shipping-container-cafe',
        destination: '/product/container-cafe/shipping-container-cafe',
        permanent: true,
      },
      {
        source: '/product/shipping-container-homes',
        destination: '/product/container-houses/shipping-container-homes',
        permanent: true,
      },
      {
        source: '/product/shipping-container-office',
        destination: '/product/container-offices/shipping-container-office',
        permanent: true,
      },
      {
        source: '/product/shipping-container-restaurant',
        destination: '/product/container-cafe/shipping-container-restaurant',
        permanent: true,
      },
      {
        source: '/product/shipping-container-tiny-house',
        destination: '/product/container-houses/shipping-container-tiny-house',
        permanent: true,
      },
      {
        source: '/product/site-office-container',
        destination: '/product/container-offices/site-office-container',
        permanent: true,
      },
      {
        source: '/product/storage-container-house',
        destination: '/product/container-houses/storage-container-house',
        permanent: true,
      },
      {
        source: '/product/tiny-container-homes',
        destination: '/product/container-houses/tiny-container-homes',
        permanent: true,
      },
      {
        source: '/porta-cabin-price-a-complete-guide-2024',
        destination: '/porta-cabin-price-a-complete-guide-2025',
        permanent: true,
      },
      {
        source: '/project/bunkhouse-for-rent',
        destination: '/product-category/labor-colony',
        permanent: true,
      },
      {
        source: '/project/bunkhouse-for-sale',
        destination: '/product-category/labor-colony',
        permanent: true,
      },
      {
        source: '/project/container-cafes-in-bangalore',
        destination: '/product-category/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-cafes',
        destination: '/product-category/container-cafe',
        permanent: true,
      },
      {
        source: '/project/container-homes-for-sale',
        destination: '/product-category/container-houses',
        permanent: true,
      },
      {
        source: '/project/container-hotel-for-sale',
        destination: '/product-category/container-houses',
        permanent: true,
      },
      {
        source: '/project/peb-manufacturer',
        destination: '/product-category/peb-constructions',
        permanent: true,
      },
      {
        source: '/project/porta-cabin-interior',
        destination: '/product-category/porta-cabins',
        permanent: true,
      },
      {
        source: '/project/portable-bunkhouse',
        destination: '/product-category/labor-colony',
        permanent: true,
      },
      {
        source: '/project/portable-cabin-in-bangalore',
        destination: '/product-category/portable-cabin',
        permanent: true,
      },
      {
        source: '/project/portable-cabin-manufacturers-in-bangalore',
        destination: '/product-category/portable-cabin',
        permanent: true,
      },
      {
        source: '/project/portable-security-cabin',
        destination: '/product/security-cabins/portable-security-cabin',
        permanent: true,
      },
      {
        source: '/project/portable-toilet-in-bangalore',
        destination: '/portable-toilets-in-bangalore',
        permanent: true,
      },
      {
        source: '/project/prefab-house',
        destination: '/product-category/prefabricated-houses',
        permanent: true,
      },
      {
        source: '/project/prefab-labour-colony-in-bangalore',
        destination: '/product-category/labor-colony',
        permanent: true,
      },
      {
        source: '/project/prefabricated-office',
        destination: '/product-category/portable-office',
        permanent: true,
      },
      {
        source: '/project/prefabricated-steel-buildings',
        destination: '/product-category/pre-engineered-buildings',
        permanent: true,
      },
      {
        source: '/project/prefabricated-warehouse',
        destination: '/product/industrial-sheds/prefabricated-warehouses',
        permanent: true,
      },
      {
        source: '/project/security-guard-cabins',
        destination: '/product/security-cabins/security-guard-cabin',
        permanent: true,
      },
      {
        source: '/project/shipping-container-homes-for-sale',
        destination: '/product-category/container-houses',
        permanent: true,
      },
      {
        source: '/temporary-sheds-your-guide-to-small-portable-and-movable-storage-solutions',
        destination: '/product-category/industrial-sheds',
        permanent: true,
      },

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
