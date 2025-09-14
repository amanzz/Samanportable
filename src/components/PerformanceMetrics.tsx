import React, { useEffect, useState } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

// Extend PerformanceEntry for specific types
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const { debounce } = usePerformanceOptimization();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as FirstInputEntry;
          setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as LayoutShiftEntry;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
      }

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  const getPerformanceScore = (metric: keyof PerformanceMetrics, value: number | undefined): string => {
    if (value === undefined || value === null) return 'text-gray-500';
    
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      ttfb: { good: 800, needsImprovement: 1800 }
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.needsImprovement) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMetric = (metric: keyof PerformanceMetrics, value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    if (metric === 'cls') return value.toFixed(3);
    if (metric === 'fid') return `${Math.round(value)}ms`;
    return `${Math.round(value)}ms`;
  };

  if (!metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg z-40 max-w-xs">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Performance Metrics</h3>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">FCP:</span>
          <span className={getPerformanceScore('fcp', metrics.fcp)}>
            {formatMetric('fcp', metrics.fcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">LCP:</span>
          <span className={getPerformanceScore('lcp', metrics.lcp)}>
            {formatMetric('lcp', metrics.lcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">FID:</span>
          <span className={getPerformanceScore('fid', metrics.fid)}>
            {formatMetric('fid', metrics.fid)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">CLS:</span>
          <span className={getPerformanceScore('cls', metrics.cls)}>
            {formatMetric('cls', metrics.cls)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">TTFB:</span>
          <span className={getPerformanceScore('ttfb', metrics.ttfb)}>
            {formatMetric('ttfb', metrics.ttfb)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;

