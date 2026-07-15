import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import PageLoader from './PageLoader';
import RouteProgressBar from './RouteProgressBar';

// T13 (Part B): the accessibility checker is a dev-only authoring aid (toggle with
// Ctrl+Shift+A). Gated to non-production so it is never bundled into or shipped to the
// prod build; in development it lazy-loads on mount and stays fully usable. The former
// PerformanceOptimizer wrapper was removed entirely — it only attached a scroll/resize
// listener whose getBoundingClientRect result was discarded (pure main-thread cost).
const AccessibilityChecker =
  process.env.NODE_ENV !== 'production'
    ? dynamic(() => import('./AccessibilityChecker'))
    : null;

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
      <RouteProgressBar />
      <PageLoader isLoading={isLoading} />
      <Header />
      {/* Mobile bottom padding - only applied on mobile devices, removed on desktop */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      {AccessibilityChecker && <AccessibilityChecker />}
    </div>
  );
}
