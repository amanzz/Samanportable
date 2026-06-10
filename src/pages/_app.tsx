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
      {/* Google Tag Manager — deferred to afterInteractive so it never blocks first paint.
          Preserves GA4 + all GTM-managed lead events (form submit, WhatsApp, phone, RFQ). */}
      <Script
        id="gtm-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WCT5SSR');`,
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

