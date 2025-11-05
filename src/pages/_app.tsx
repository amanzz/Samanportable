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
    '/about-us',
    '/contact',
    '/gallery',
    '/rental-services',
    '/privacy-policy',
    '/delivery-policy',
    '/refund-and-return-policy',
    '/terms-and-conditions',
  ]);

  const hasCustomSEO = pageProps.rankMathSEO || 
                       router.pathname.startsWith('/product/') ||
                       (router.pathname === '/[slug]' && pageProps.post) ||
                       staticSEORoutes.has(router.pathname);
  
  return (
    <div className={inter.className}>
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

