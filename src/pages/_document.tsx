import { Html, Head, Main, NextScript } from 'next/document';
import { inter } from '@/lib/fonts';

export default function Document() {
  return (
    <Html lang="en" className={inter.variable}>
      <Head>
        {/* Google Tag Manager — GTM-WCT5SSR (frontend tracking container, updated 2026-06-09).
            GA4 (G-BHT76W46RH), lead-event tags, and page_view are all configured INSIDE this
            GTM container — there is NO direct GA4/gtag in the frontend code, so no duplicate
            tracking. SPA route page_views are handled by GA4 Enhanced Measurement (history events). */}
        {/* GTM is loaded after hydration in _app.tsx so it does not compete with LCP. */}
        
        {/* Charset is automatically added by Next.js */}
        
        {/* DNS Prefetching and Preconnecting - Optimized */}
        <link rel="dns-prefetch" href="https://blog.samanportable.com" />
        <link rel="preconnect" href="https://blog.samanportable.com" crossOrigin="anonymous" />
        
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
        {/* X-Frame-Options is sent as an HTTP response header from next.config.js (the only valid place); the duplicate <meta> here was invalid and logged a console warning. */}
        <meta name="msapplication-TileColor" content="#0A3D2A" />
        {/* Robots meta tags are handled by individual SEO components */}
        
        {/* Performance Meta Tags - Enhanced */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="renderer" content="webkit" />
        
        {/* Social Media Verification (Invisible) */}
        <link rel="me" href="https://mastodon.social/@saman_portable" />
        
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
        {/* Google Tag Manager (noscript) — GTM-WCT5SSR */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WCT5SSR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
