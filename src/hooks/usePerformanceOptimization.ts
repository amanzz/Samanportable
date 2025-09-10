import { useEffect, useCallback, useRef } from 'react';

export const usePerformanceOptimization = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadedImagesRef = useRef<Set<string>>(new Set());

  // Lazy load images
  const lazyLoadImage = useCallback((img: HTMLImageElement) => {
    if (img.dataset.src && !loadedImagesRef.current.has(img.dataset.src)) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      loadedImagesRef.current.add(img.dataset.src);
    }
  }, []);

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    // Skip preloading non-existent resources
    // CSS is already loaded via Next.js
    // Fonts are loaded via Google Fonts or system fonts
  }, []);

  // Optimize images
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          lazyLoadImage(img);
          observerRef.current?.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach((img) => {
      observerRef.current?.observe(img);
    });
  }, [lazyLoadImage]);

  // Debounce function for performance
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Throttle function for performance
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Initialize performance optimizations
  useEffect(() => {
    // Preload critical resources
    preloadCriticalResources();

    // Optimize images after DOM is ready
    const timer = setTimeout(() => {
      optimizeImages();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [preloadCriticalResources, optimizeImages]);

  return {
    lazyLoadImage,
    optimizeImages,
    debounce,
    throttle,
    preloadCriticalResources
  };
};
