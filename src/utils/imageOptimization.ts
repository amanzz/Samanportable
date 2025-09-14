/**
 * Utility functions for image optimization
 */

/**
 * Converts a WordPress image URL to an optimized WebP version
 * @param originalUrl - The original WordPress image URL
 * @param width - Desired width
 * @param height - Desired height
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export function optimizeWordPressImage(
  originalUrl: string,
  width: number,
  height: number,
  quality: number = 85
): string {
  // If it's already a Next.js optimized image, return as is
  if (originalUrl.includes('/_next/image')) {
    return originalUrl;
  }

  // If it's a WordPress image, add optimization parameters
  if (originalUrl.includes('blog.samanportable.com') || originalUrl.includes('samanportable.com')) {
    // Add width, height, and quality parameters for WordPress
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}w=${width}&h=${height}&q=${quality}&f=webp`;
  }

  return originalUrl;
}

/**
 * Gets the optimal image dimensions for different screen sizes
 * @param baseWidth - Base width
 * @param baseHeight - Base height
 * @returns Object with responsive dimensions
 */
export function getResponsiveImageDimensions(baseWidth: number, baseHeight: number) {
  return {
    sm: { width: Math.round(baseWidth * 0.5), height: Math.round(baseHeight * 0.5) },
    md: { width: Math.round(baseWidth * 0.75), height: Math.round(baseHeight * 0.75) },
    lg: { width: baseWidth, height: baseHeight },
    xl: { width: Math.round(baseWidth * 1.25), height: Math.round(baseHeight * 1.25) },
    '2xl': { width: Math.round(baseWidth * 1.5), height: Math.round(baseHeight * 1.5) }
  };
}

/**
 * Creates a srcset for responsive images
 * @param baseUrl - Base image URL
 * @param baseWidth - Base width
 * @param baseHeight - Base height
 * @returns Srcset string
 */
export function createImageSrcset(
  baseUrl: string,
  baseWidth: number,
  baseHeight: number
): string {
  const dimensions = getResponsiveImageDimensions(baseWidth, baseHeight);
  
  return Object.entries(dimensions)
    .map(([breakpoint, { width, height }]) => {
      const optimizedUrl = optimizeWordPressImage(baseUrl, width, height);
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Preloads critical images for better performance
 * @param imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls: string[]): void {
  if (typeof window === 'undefined') return;

  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}
