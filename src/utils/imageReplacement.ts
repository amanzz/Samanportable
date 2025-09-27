/**
 * Utility for automatically replacing img tags with optimized Next.js Image components
 */

import React from 'react';
import SmartImage from '@/components/SmartImage';

interface ImageReplacementOptions {
  quality?: number;
  priority?: boolean;
  responsive?: boolean;
  aspectRatio?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Convert a regular img tag to a SmartImage component
 */
export function convertImgToSmartImage(
  imgElement: HTMLImageElement,
  options: ImageReplacementOptions = {}
): React.ReactElement {
  const {
    quality = 85,
    priority = false,
    responsive = true,
    aspectRatio,
    objectFit = 'cover'
  } = options;

  const src = imgElement.src;
  const alt = imgElement.alt || '';
  const width = imgElement.width || undefined;
  const height = imgElement.height || undefined;
  const className = imgElement.className || '';
  const style = imgElement.style.cssText ? imgElement.style : {};

  // Determine if this should be a priority image (above the fold)
  const isPriority = priority || 
    imgElement.hasAttribute('data-priority') ||
    imgElement.hasAttribute('data-lazy') === false;

  // Check if it's a logo or icon that shouldn't be optimized
  const isLogo = src.includes('logo') || 
                 src.includes('Logo') || 
                 src.includes('saman-Logo') ||
                 src.includes('favicon') ||
                 src.includes('icon');

  return React.createElement(SmartImage, {
    src,
    alt,
    width,
    height,
    className,
    style,
    priority: isPriority,
    quality: isLogo ? 100 : quality,
    responsive: !isLogo && responsive,
    aspectRatio,
    objectFit,
    placeholder: isPriority ? 'blur' : 'empty',
    loading: isPriority ? 'eager' : 'lazy'
  });
}

/**
 * Process HTML content and replace img tags with SmartImage components
 */
export function processHtmlContent(
  htmlContent: string,
  options: ImageReplacementOptions = {}
): React.ReactElement[] {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return [];
  }
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const imgElements = doc.querySelectorAll('img');
  
  const elements: React.ReactElement[] = [];
  
  imgElements.forEach((img, index) => {
    const smartImage = convertImgToSmartImage(img as HTMLImageElement, options);
    elements.push(
      React.cloneElement(smartImage, { key: `img-${index}` })
    );
  });
  
  return elements;
}

/**
 * Auto-replace img tags in the DOM with SmartImage components
 */
export function autoReplaceImages(
  container: HTMLElement,
  options: ImageReplacementOptions = {}
): void {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  const imgElements = container.querySelectorAll('img');
  
  imgElements.forEach((img, index) => {
    const smartImage = convertImgToSmartImage(img as HTMLImageElement, options);
    
    // Create a wrapper div for the SmartImage
    const wrapper = document.createElement('div');
    wrapper.className = img.className;
    wrapper.style.cssText = img.style.cssText;
    
    // Replace the img with the wrapper
    img.parentNode?.replaceChild(wrapper, img);
    
    // Render the SmartImage into the wrapper
    // Note: This would need to be integrated with React rendering
    // For now, we'll just replace with a placeholder
    wrapper.innerHTML = `<div data-smart-image-placeholder="${index}"></div>`;
  });
}

/**
 * Generate optimized image URLs for different formats
 */
/**
 * Replace blog.samanportable.com with www.samanportable.com in URLs
 */
export function replaceDomainInUrl(url: string): string {
  if (url.includes('blog.samanportable.com')) {
    return url.replace('blog.samanportable.com', 'www.samanportable.com');
  }
  return url;
}

/**
 * Replace img tags in HTML content with Next.js Image components
 */
export function replaceImgTagsWithNextImage(htmlContent: string): string {
  if (!htmlContent) return htmlContent;
  
  // Find all img tags and replace them with Next.js Image components
  return htmlContent.replace(
    /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
    (match, beforeSrc, src, afterSrc) => {
      // Extract alt text
      const altMatch = match.match(/alt="([^"]*?)"/i);
      const alt = altMatch ? altMatch[1] : '';
      
      // Extract width and height if available
      const widthMatch = match.match(/width="([^"]*?)"/i);
      const heightMatch = match.match(/height="([^"]*?)"/i);
      const width = widthMatch ? widthMatch[1] : '800';
      const height = heightMatch ? heightMatch[1] : '600';
      
      // Extract class if available
      const classMatch = match.match(/class="([^"]*?)"/i);
      const className = classMatch ? classMatch[1] : 'w-full h-auto';
      
      // Create Next.js Image component
      return `<div class="relative w-full h-auto my-4">
        <img 
          src="${src}" 
          alt="${alt}" 
          width="${width}" 
          height="${height}" 
          class="${className} object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>`;
    }
  );
}

/**
 * Replace internal links from blog.samanportable.com to www.samanportable.com
 */
export function replaceInternalLinks(content: string): string {
  if (!content) return content;
  
  // Replace internal links in href attributes
  content = content.replace(
    /href="https:\/\/blog\.samanportable\.com\/([^"]*)"/g,
    'href="https://www.samanportable.com/$1"'
  );
  
  // Replace internal links in any other URLs
  content = content.replace(
    /https:\/\/blog\.samanportable\.com\/([^\s<>"']*)/g,
    'https://www.samanportable.com/$1'
  );
  
  return content;
}

export function generateOptimizedUrls(
  originalUrl: string,
  width: number,
  height: number,
  quality: number = 85
): {
  webp: string;
  avif: string;
  original: string;
} {
  // Replace domain first
  const url = replaceDomainInUrl(originalUrl);
  
  // For WordPress images
  if (url.includes('www.samanportable.com') || url.includes('samanportable.com')) {
    const separator = url.includes('?') ? '&' : '?';
    const baseParams = `w=${width}&h=${height}&q=${quality}`;
    
    return {
      webp: `${url}${separator}${baseParams}&f=webp`,
      avif: `${url}${separator}${baseParams}&f=avif`,
      original: `${url}${separator}${baseParams}`
    };
  }
  
  // For local images, Next.js will handle optimization automatically
  return {
    webp: url,
    avif: url,
    original: url
  };
}

/**
 * Check if an image should be optimized based on its properties
 */
export function shouldOptimizeImage(img: HTMLImageElement): boolean {
  const src = img.src.toLowerCase();
  
  // Don't optimize logos, icons, or SVGs
  if (src.includes('logo') || 
      src.includes('icon') || 
      src.includes('favicon') ||
      src.endsWith('.svg')) {
    return false;
  }
  
  // Don't optimize very small images
  if (img.width < 100 || img.height < 100) {
    return false;
  }
  
  // Don't optimize if explicitly marked as non-optimizable
  if (img.hasAttribute('data-no-optimize')) {
    return false;
  }
  
  return true;
}

/**
 * Get optimal image dimensions based on container and viewport
 */
export function getOptimalImageDimensions(
  containerWidth: number,
  containerHeight: number,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): { width: number; height: number } {
  const aspectRatio = containerWidth / containerHeight;
  
  let optimalWidth = containerWidth;
  let optimalHeight = containerHeight;
  
  // Scale down if too large
  if (optimalWidth > maxWidth) {
    optimalWidth = maxWidth;
    optimalHeight = Math.round(maxWidth / aspectRatio);
  }
  
  if (optimalHeight > maxHeight) {
    optimalHeight = maxHeight;
    optimalWidth = Math.round(maxHeight * aspectRatio);
  }
  
  return {
    width: Math.round(optimalWidth),
    height: Math.round(optimalHeight)
  };
}
