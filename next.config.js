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
        destination: '/product-category/container-offices/',
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

      // ─── CSV BULK REDIRECTS (572 entries from spreadsheet) ───────────────
      // Source: Untitled spreadsheet - Sheet1 (1).csv
      // Skipped: 7 MERGE rows, 2 conflicts with existing config, 0 duplicates
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
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
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
