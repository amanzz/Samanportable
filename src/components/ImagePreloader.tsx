import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  maxPreload?: number;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, maxPreload = 6 }) => {
  useEffect(() => {
    try {
      // Safety check - ensure images array exists and is valid
      if (!images || !Array.isArray(images) || images.length === 0) {
        return;
      }
      
      // Preload only the first few critical images
      const imagesToPreload = images.slice(0, maxPreload);
      const preloadedImages = new Set<string>();
      
      imagesToPreload.forEach((src) => {
        if (src && src !== '/placeholder.svg' && !preloadedImages.has(src)) {
          try {
            // Validate URL before preloading
            const url = new URL(src);
            
            // Only preload if it's a valid HTTP/HTTPS URL
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              // Check if preload already exists to avoid duplicates
              const existingPreload = document.querySelector(`link[rel="preload"][href="${src}"]`);
              if (!existingPreload) {
                // Use link preload for better performance
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                link.type = 'image/webp'; // Assume WebP for products (faster)
                document.head.appendChild(link);
                preloadedImages.add(src);
              }
              
              // Preload with fetch for better caching - only for critical images
              if (imagesToPreload.indexOf(src) < 3) {
                fetch(src, { 
                  method: 'HEAD',
                  mode: 'no-cors',
                  cache: 'force-cache'
                }).catch((error) => {
                  // Silent fail for preloading
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Image preload failed for:', src, error);
                  }
                });
              }
            }
          } catch (error) {
            // Invalid URL - skip preloading
            if (process.env.NODE_ENV === 'development') {
              console.log('Invalid image URL:', src, error);
            }
          }
        }
      });
    } catch (error) {
      // Catch any unexpected errors in the entire preloading process
      if (process.env.NODE_ENV === 'development') {
        console.log('ImagePreloader error:', error);
      }
    }
  }, [images, maxPreload]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;
