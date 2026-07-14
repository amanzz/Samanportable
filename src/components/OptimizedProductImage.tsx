import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { isRemoteImageSrc } from '@/lib/imageSrc';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  index?: number;
}

const OptimizedProductImage: React.FC<OptimizedProductImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  index = 0
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Show skeleton for first 3 images, placeholder for others
  const showSkeleton = index < 3;

  useEffect(() => {
    setImageLoaded(false);
    setImageError(!src || src === '/placeholder.svg');
    setIsLoading(Boolean(src && src !== '/placeholder.svg'));
  }, [src]);

  // If image failed to load, show placeholder
  if (imageError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="text-2xl mb-1">📦</div>
          <div className="text-xs">Product Image</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Skeleton loading for first 3 images */}
      {showSkeleton && isLoading && (
        <Skeleton className={`w-full h-full ${className}`} />
      )}
      
      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        // T12: product images are Hostinger-hosted; keep them off the optimizer fetch path.
        unoptimized={isRemoteImageSrc(src)}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgJIYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={70} // Reduced quality for faster loading
        loading={priority ? "eager" : "lazy"}
        style={{
          contain: 'layout style paint',
          contentVisibility: 'auto'
        }}
        onLoad={() => {
          setImageLoaded(true);
          setIsLoading(false);
        }}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
};

export default OptimizedProductImage;
