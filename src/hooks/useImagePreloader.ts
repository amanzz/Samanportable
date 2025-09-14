import { useEffect, useRef } from 'react';

interface ImagePreloaderOptions {
  priority?: boolean;
  threshold?: number;
}

export const useImagePreloader = (
  imageUrls: string[],
  options: ImagePreloaderOptions = {}
) => {
  const { priority = false, threshold = 0.1 } = options;
  const preloadedImages = useRef<Set<string>>(new Set());

  // Simple preloading for priority images only
  useEffect(() => {
    if (priority && imageUrls.length > 0) {
      // Only preload first 3 images to avoid overwhelming the browser
      const imagesToPreload = imageUrls.slice(0, 3);
      
      imagesToPreload.forEach((url) => {
        if (!preloadedImages.current.has(url)) {
          const img = new Image();
          img.src = url;
          preloadedImages.current.add(url);
        }
      });
    }
  }, [imageUrls, priority]);

  // Simple intersection observer for non-priority images
  useEffect(() => {
    if (priority) return; // Skip for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.src && !preloadedImages.current.has(img.src)) {
              preloadedImages.current.add(img.src);
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold
      }
    );

    // Observe all images in the container
    const images = document.querySelectorAll('img[data-lazy]');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [priority, threshold]);

  return {
    isPreloaded: (url: string) => preloadedImages.current.has(url),
    preloadImage: (url: string) => {
      if (!preloadedImages.current.has(url)) {
        const img = new Image();
        img.src = url;
        preloadedImages.current.add(url);
      }
    }
  };
};
