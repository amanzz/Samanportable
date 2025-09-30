import { Html, Head, Main, NextScript } from 'next/document';
import { inter } from '@/lib/fonts';

export default function Document() {
  return (
    <Html lang="en" className={inter.variable}>
      <Head>
        {/* Charset is automatically added by Next.js */}
        
        {/* Critical Resource Preloading - Optimized for LCP */}
        <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/container-office-by-saman (1).jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
        
        {/* DNS Prefetching and Preconnecting - Optimized */}
        <link rel="dns-prefetch" href="https://blog.samanportable.com" />
        <link rel="preconnect" href="https://blog.samanportable.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.samanportable.com" />
        
        {/* Favicon Configuration */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-192.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-512.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* PWA */}
        <meta name="theme-color" content="#0A3D2A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SAMAN Portable" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Security and Performance Meta Tags */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta name="msapplication-TileColor" content="#0A3D2A" />
        <meta name="next-head-count" content="30" />
        {/* Robots meta tags are handled by individual SEO components */}
        
        {/* Performance Meta Tags - Enhanced */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="renderer" content="webkit" />
        
        {/* Critical CSS Inline for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS for LCP optimization - Updated to WOFF2 */
              @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('/fonts/Inter-Regular.woff2') format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 500;
                font-display: swap;
                src: url('/fonts/Inter-Medium.woff2') format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 600;
                font-display: swap;
                src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url('/fonts/Inter-Bold.woff2') format('woff2');
              }
              .hero-section-responsive {
                contain: layout style paint;
                content-visibility: auto;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
              }
              .hero-text-shadow {
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              }
              .btn-primary {
                background: linear-gradient(135deg, #0A3D2A 0%, #082F20 100%);
                transition: all 0.3s ease;
              }
              .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(10, 61, 42, 0.3);
              }
              /* Prevent CLS with skeleton loading */
              .skeleton-loader {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
              }
              @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `
          }}
        />
        
        {/* Organization Schema handled by ProductStructuredData component on product pages */}
        {/* Removed global Organization schema to prevent duplicates */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

