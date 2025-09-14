import { useMemo } from 'react';

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

interface ResponsiveBreakpoint {
  width: number;
  height: number;
  size: string;
}

/**
 * Custom hook for image optimization utilities
 */
export const useImageOptimization = () => {
  // Responsive breakpoints for different screen sizes
  const responsiveBreakpoints: ResponsiveBreakpoint[] = useMemo(() => [
    { width: 640, height: 480, size: 'sm' },
    { width: 768, height: 576, size: 'md' },
    { width: 1024, height: 768, size: 'lg' },
    { width: 1280, height: 960, size: 'xl' },
    { width: 1920, height: 1440, size: '2xl' }
  ], []);

  /**
   * Generate optimized image URL with WebP format
   */
  const getOptimizedImageUrl = (
    originalUrl: string,
    options: ImageOptimizationOptions = {}
  ): string => {
    const { width, height, quality = 85, format = 'webp' } = options;

    // If it's already a Next.js optimized image, return as is
    if (originalUrl.includes('/_next/image')) {
      return originalUrl;
    }

    // For WordPress images, add optimization parameters
    if (originalUrl.includes('blog.samanportable.com') || originalUrl.includes('samanportable.com')) {
      const separator = originalUrl.includes('?') ? '&' : '?';
      const params = new URLSearchParams();
      
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('q', quality.toString());
      params.append('f', format);
      
      return `${originalUrl}${separator}${params.toString()}`;
    }

    return originalUrl;
  };

  /**
   * Generate responsive srcset for images
   */
  const getResponsiveSrcset = (
    baseUrl: string,
    baseWidth: number,
    baseHeight: number,
    quality: number = 85
  ): string => {
    return responsiveBreakpoints
      .map(({ width, height }) => {
        const optimizedUrl = getOptimizedImageUrl(baseUrl, { width, height, quality });
        return `${optimizedUrl} ${width}w`;
      })
      .join(', ');
  };

  /**
   * Calculate optimal image dimensions based on container size
   */
  const getOptimalDimensions = (
    containerWidth: number,
    containerHeight: number,
    maxWidth: number = 1920
  ): { width: number; height: number } => {
    const aspectRatio = containerWidth / containerHeight;
    
    if (containerWidth > maxWidth) {
      return {
        width: maxWidth,
        height: Math.round(maxWidth / aspectRatio)
      };
    }
    
    return {
      width: containerWidth,
      height: containerHeight
    };
  };

  /**
   * Generate sizes attribute for responsive images
   */
  const getResponsiveSizes = (
    isFullWidth: boolean = false,
    columns: number = 1
  ): string => {
    if (isFullWidth) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw';
    }
    
    const columnWidth = 100 / columns;
    return `(max-width: 640px) 100vw, (max-width: 768px) ${columnWidth}vw, (max-width: 1024px) ${columnWidth}vw, ${columnWidth}vw`;
  };

  /**
   * Check if image should be optimized (exclude logos, icons, etc.)
   */
  const shouldOptimizeImage = (imageUrl: string): boolean => {
    const excludePatterns = [
      'logo',
      'Logo',
      'saman-Logo',
      'favicon',
      'icon',
      'Icon',
      '.svg'
    ];
    
    return !excludePatterns.some(pattern => imageUrl.includes(pattern));
  };

  /**
   * Get image format based on browser support
   */
  const getPreferredFormat = (): 'webp' | 'avif' | 'auto' => {
    if (typeof window === 'undefined') return 'webp';
    
    try {
      // Check for AVIF support
      const canvas = document.createElement('canvas');
      const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      
      if (avifSupported) return 'avif';
      
      // Check for WebP support
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      if (webpSupported) return 'webp';
    } catch (error) {
      // Fallback to webp if canvas operations fail
      return 'webp';
    }
    
    return 'auto';
  };

  return {
    getOptimizedImageUrl,
    getResponsiveSrcset,
    getOptimalDimensions,
    getResponsiveSizes,
    shouldOptimizeImage,
    getPreferredFormat,
    responsiveBreakpoints
  };
};
