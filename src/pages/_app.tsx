import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultSeo } from 'next-seo';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import MobileLCPOptimizer from '@/components/MobileLCPOptimizer';
import { defaultSEO } from '@/config/seo';
import Script from 'next/script';
import { inter } from '@/lib/fonts';
import { useRouter } from 'next/router';

import '@/styles/globals.css';

// Enhanced Query Client with better performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      retry: 1,
      retryDelay: 1000,
      // Enhanced performance settings
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Don't render DefaultSeo for pages that have their own SEO components
  // This prevents duplicate meta tags
  const staticSEORoutes = new Set([
    '/',
    '/product',
    '/blog',
    '/about-us',
    '/contact',
    '/gallery',
    '/rental-services',
    '/privacy-policy',
    '/delivery-policy',
    '/refund-and-return-policy',
    '/terms-and-conditions',
    '/prefab-solutions',
    '/checkout',
    '/cart',
    '/my-orders',
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
      {/* Google Tag Manager — loaded on FIRST user interaction (pointerdown/click/touchstart/
          keydown/scroll) OR a 2s fallback timeout, whichever comes first. Keeps GTM off the
          critical paint path while still loading well before realistic lead actions. Same
          container GTM-WCT5SSR; GA4 inside GTM unchanged. dataLayer + gtm.start are set
          immediately so any early lead event (form/phone/WhatsApp via analytics.ts) queues and
          is processed once GTM loads. Guarded to load exactly once. */}
      <Script
        id="gtm-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d){w.dataLayer=w.dataLayer||[];w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var loaded=false;var evts=['pointerdown','click','touchstart','keydown','scroll'];function load(){if(loaded)return;loaded=true;for(var k=0;k<evts.length;k++){w.removeEventListener(evts[k],load);}clearTimeout(t);var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=GTM-WCT5SSR';var f=d.getElementsByTagName('script')[0];f.parentNode.insertBefore(s,f);}for(var k=0;k<evts.length;k++){w.addEventListener(evts[k],load,{once:true,passive:true});}var t=setTimeout(load,2000);})(window,document);`,
        }}
      />
      <MobileLCPOptimizer />
      <ErrorBoundary>
        {!hasCustomSEO && <DefaultSeo {...defaultSEO} />}

        {/* Performance Monitoring Scripts - Lazy Loaded */}
        {/* Google Analytics removed - using GTM instead */}

        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <CartProvider>
                <Component {...pageProps} />
              </CartProvider>
            </AuthProvider>
          </TooltipProvider>
          <Toaster />
          <Sonner />
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}

