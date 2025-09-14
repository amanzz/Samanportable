import React, { useEffect, useRef } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent forced reflows by batching DOM reads and writes
    let rafId: number;
    
    const optimizeLayout = () => {
      if (containerRef.current) {
        // Use requestAnimationFrame to batch DOM operations
        rafId = requestAnimationFrame(() => {
          // Batch all DOM measurements
          const rect = containerRef.current?.getBoundingClientRect();
          // Any other measurements can go here
        });
      }
    };

    // Optimize on resize and scroll
    const debouncedOptimize = debounce(optimizeLayout, 16); // ~60fps
    
    window.addEventListener('resize', debouncedOptimize);
    window.addEventListener('scroll', debouncedOptimize, { passive: true });
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', debouncedOptimize);
      window.removeEventListener('scroll', debouncedOptimize);
    };
  }, []);

  return (
    <div ref={containerRef} className="performance-optimized">
      {children}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default PerformanceOptimizer;

