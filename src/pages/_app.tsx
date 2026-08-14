import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { DefaultSeo } from 'next-seo';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { defaultSEO } from '@/config/seo';
import Script from 'next/script';
import { inter } from '@/lib/fonts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import '@/styles/globals.css';

// Toast UIs render nothing until a toast is dispatched (always on a user action),
// so they don't need to be in the server render or the initial hydration pass.
// Loading them client-only (ssr:false) keeps their JS off the critical path; they
// mount automatically right after hydration, well before any toast can fire.
const Toaster = dynamic(() => import('@/components/ui/toaster').then((m) => m.Toaster), { ssr: false });
const Sonner = dynamic(() => import('@/components/ui/sonner').then((m) => m.Toaster), { ssr: false });

// Native guided-enquiry chatbot. Client-only (ssr:false) so its tiny launcher
// mounts after hydration and stays off the critical path. The full chat panel is
// a further code-split chunk inside this component, fetched only on first click.
const EnquiryChatbot = dynamic(() => import('@/components/chatbot/EnquiryChatbot'), { ssr: false });

const DeferredClientUtilities = () => {
  const [shouldHydrate, setShouldHydrate] = useState(false);

  useEffect(() => {
    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'touchstart',
      'keydown',
      'scroll',
    ];
    const hydrate = () => {
      setShouldHydrate(true);
      events.forEach((eventName) => window.removeEventListener(eventName, hydrate));
    };

    events.forEach((eventName) => {
      window.addEventListener(eventName, hydrate, { once: true, passive: true });
    });
    const fallbackTimer = window.setTimeout(hydrate, 12000);

    return () => {
      window.clearTimeout(fallbackTimer);
      events.forEach((eventName) => window.removeEventListener(eventName, hydrate));
    };
  }, []);

  if (!shouldHydrate) return null;

  return (
    <>
      <Toaster />
      <Sonner />
      <EnquiryChatbot />
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Don't render DefaultSeo for pages that have their own SEO components
  // This prevents duplicate meta tags
  const staticSEORoutes = new Set([
    '/',
    '/product',
    '/blog',
    // SHIKHAR T8.1: /blog/search owns its SEO via UnifiedSEO and must stay
    // noindex,follow. Without this, DefaultSeo would add its own index,follow
    // robots tags alongside it and the page would contradict itself.
    '/blog/search',
    '/about-us',
    '/contact',
    '/gallery',
    '/rental-services',
    '/privacy-policy',
    '/delivery-policy',
    '/refund-and-return-policy',
    '/terms-and-conditions',
    '/prefab-solutions',
    '/my-orders',
    '/cabin-cost-calculator',
    '/404',
    '/410',
  ]);

  const hasCustomSEO = pageProps.rankMathSEO ||
    router.pathname.startsWith('/product/') ||
    router.pathname.startsWith('/product-category/') ||
    router.pathname.startsWith('/container-rent-services/') ||
    (router.pathname === '/[slug]' && pageProps.post) ||
    staticSEORoutes.has(router.pathname);

  return (
    <div className={inter.className}>
      {/* Google Tag Manager — loaded on the FIRST user interaction (pointerdown/click/
          touchstart/keydown/scroll), firing instantly. The no-interaction fallback waits for
          the window 'load' event and then a fixed 12s delay, so GTM/GA4 execution lands AFTER
          the page's interactive window instead of competing with hydration — this removes
          their long tasks from Total Blocking Time. (A fixed delay is used rather than
          requestIdleCallback, which fired during the window because the browser went idle
          before TTI.) Same
          container GTM-WCT5SSR; GA4 inside GTM unchanged; tracking IDs unchanged. dataLayer +
          gtm.start are set immediately so any early lead event (form/phone/WhatsApp via
          analytics.ts) queues and is processed once GTM loads. Guarded to load exactly once. */}
      <Script
        id="gtm-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d){w.dataLayer=w.dataLayer||[];w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var loaded=false;var evts=['pointerdown','click','touchstart','keydown','scroll'];function load(){if(loaded)return;loaded=true;for(var k=0;k<evts.length;k++){w.removeEventListener(evts[k],load);}var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=GTM-WCT5SSR';var f=d.getElementsByTagName('script')[0];f.parentNode.insertBefore(s,f);}for(var k=0;k<evts.length;k++){w.addEventListener(evts[k],load,{once:true,passive:true});}function schedule(){setTimeout(load,12000);}if(d.readyState==='complete'){schedule();}else{w.addEventListener('load',schedule,{once:true});}})(window,document);`,
        }}
      />
      <ErrorBoundary>
        {!hasCustomSEO && <DefaultSeo {...defaultSEO} />}

        {/* Performance Monitoring Scripts - Lazy Loaded */}
        {/* Google Analytics removed - using GTM instead */}

        {/* react-query removed: QueryClientProvider had zero consumers
            (no useQuery/useMutation anywhere), so it was dead hydration weight. */}
        {/* T30: TooltipProvider (@radix-ui/react-tooltip) removed — it wrapped the whole
            app but no Tooltip/TooltipTrigger/TooltipContent is rendered anywhere in the
            codebase, so the radix-tooltip package was dead weight in the shared/_app
            chunk on every page. Removing it changes nothing rendered. */}
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
        <DeferredClientUtilities />
      </ErrorBoundary>
    </div>
  );
}

