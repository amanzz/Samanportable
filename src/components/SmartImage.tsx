import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'empty' | 'blur';
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  // Responsive breakpoints
  responsive?: boolean;
  // Aspect ratio for responsive images
  aspectRatio?: number;
  // Object fit for responsive images
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'blur',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  fill = false,
  style = {},
  onLoad,
  onError,
  responsive = true,
  aspectRatio,
  objectFit = 'cover'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Calculate aspect ratio from width/height or use provided aspectRatio
  const calculatedAspectRatio = useMemo(() => {
    if (aspectRatio) return aspectRatio;
    if (width && height) return width / height;
    return 16 / 9; // Default aspect ratio
  }, [width, height, aspectRatio]);

  // Determine if this is a logo (should not be optimized)
  const isLogo = useMemo(() => {
    return src.includes('logo') || 
           src.includes('Logo') || 
           src.includes('saman-Logo') ||
           src.includes('favicon');
  }, [src]);

  // Enhanced sizes for better responsive behavior
  const enhancedSizes = useMemo(() => {
    if (fill) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw';
    }
    if (responsive) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    }
    return sizes;
  }, [fill, responsive, sizes]);

  // Handle image load
  const handleLoad = (event: any) => {
    setIsLoading(false);
    
    // Store natural dimensions for aspect ratio calculations
    if (event.target.naturalWidth && event.target.naturalHeight) {
      setImageDimensions({
        width: event.target.naturalWidth,
        height: event.target.naturalHeight
      });
    }
    
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Calculate container styles for aspect ratio preservation
  const containerStyle = useMemo(() => {
    if (fill) {
      return {
        position: 'relative' as const,
        width: '100%',
        height: '100%',
        ...style
      };
    }
    
    if (responsive && !width && !height) {
      return {
        position: 'relative' as const,
        width: '100%',
        paddingBottom: `${(1 / calculatedAspectRatio) * 100}%`,
        ...style
      };
    }
    
    return style;
  }, [fill, responsive, width, height, calculatedAspectRatio, style]);

  // If it's a logo, render with minimal optimization
  if (isLogo) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width || 200}
        height={height || 100}
        className={className}
        priority={priority}
        placeholder={placeholder}
        sizes={enhancedSizes}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={style}
      />
    );
  }

  // For responsive images without explicit dimensions
  if (responsive && !width && !height && !fill) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={containerStyle}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        <Image
          src={src}
          alt={alt}
          fill
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          sizes={enhancedSizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          style={{ objectFit }}
        />
        
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
            Image failed to load
          </div>
        )}
      </div>
    );
  }

  // Standard image with explicit dimensions
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width: width || '100%', height: height || 'auto' }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        sizes={enhancedSizes}
        loading={loading}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
        style={fill ? { objectFit, ...style } : style}
      />
      
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded"
          style={{ width: width || '100%', height: height || 'auto' }}
        >
          Image failed to load
        </div>
      )}
    </div>
  );
};

export default SmartImage;

