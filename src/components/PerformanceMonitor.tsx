import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'first-contentful-paint':
            console.log('FCP:', entry.startTime);
            break;
          case 'largest-contentful-paint':
            console.log('LCP:', entry.startTime);
            break;
          case 'layout-shift':
            console.log('CLS:', (entry as any).value);
            break;
          case 'first-input':
            console.log('FID:', (entry as any).processingStart - entry.startTime);
            break;
        }
      }
    });

    // Observe Core Web Vitals
    observer.observe({ entryTypes: ['first-contentful-paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });

    // Measure TTFB
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        console.log('TTFB:', navigation.responseStart - navigation.requestStart);
      }
    }

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;

