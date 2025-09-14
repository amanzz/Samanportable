import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') return;

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Measure First Contentful Paint
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Measure Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        if (lcpEntry) {
          setMetrics(prev => ({ ...prev, lcp: lcpEntry.startTime }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          // Type assertion for LayoutShiftEntry with proper interface
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
      };
    }

    // Measure Time to First Byte
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        setMetrics(prev => ({ ...prev, ttfb: navigation.responseStart - navigation.requestStart }));
      }
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getScore = (metric: keyof PerformanceMetrics, value: number | null): string => {
    if (value === null) return 'N/A';
    
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      ttfb: { good: 800, needsImprovement: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'N/A';

    if (value <= threshold.good) return '🟢 Good';
    if (value <= threshold.needsImprovement) return '🟡 Needs Improvement';
    return '🔴 Poor';
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Performance Dashboard</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={metrics.fcp ? 'font-mono' : ''}>
            {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}
          </span>
          <span>{getScore('fcp', metrics.fcp)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={metrics.lcp ? 'font-mono' : ''}>
            {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
          </span>
          <span>{getScore('lcp', metrics.lcp)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={metrics.cls ? 'font-mono' : ''}>
            {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
          </span>
          <span>{getScore('cls', metrics.cls)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={metrics.ttfb ? 'font-mono' : ''}>
            {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}
          </span>
          <span>{getScore('ttfb', metrics.ttfb)}</span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceDashboard;

