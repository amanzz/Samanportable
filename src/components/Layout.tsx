import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import CategoryMenu from './CategoryMenu';
import Footer from './Footer';
import PerformanceOptimizer from './PerformanceOptimizer';
import AccessibilityChecker from './AccessibilityChecker';
import PageLoader from './PageLoader';
import RouteProgressBar from './RouteProgressBar';
import CriticalCSS from './CriticalCSS';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle route changes manually to avoid SSR issues
  useEffect(() => {
    if (!mounted) return;

    const handleStart = () => setIsLoading(true);
    const handleComplete = () => {
      setTimeout(() => setIsLoading(false), 300);
    };
    const handleError = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router, mounted]);

  return (
    <div className="min-h-screen flex flex-col">
      <CriticalCSS />
      <RouteProgressBar />
      <PageLoader isLoading={isLoading} />
      <Header />
      <CategoryMenu />
      <PerformanceOptimizer>
        {/* Mobile bottom padding - only applied on mobile devices, removed on desktop */}
        <main className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>
      </PerformanceOptimizer>
      <Footer />
      <AccessibilityChecker />
    </div>
  );
}
