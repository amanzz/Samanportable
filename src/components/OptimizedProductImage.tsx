import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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

const FALLBACK_SRC = '/placeholder.svg';

const OptimizedProductImage: React.FC<OptimizedProductImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  index = 0,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showSkeleton = index < 3;
  const imageSrc = imageError || !src ? FALLBACK_SRC : src;

  useEffect(() => {
    setImageLoaded(false);
    setImageError(!src || src === FALLBACK_SRC);
    setIsLoading(Boolean(src && src !== FALLBACK_SRC));
  }, [src]);

  return (
    <>
      {showSkeleton && isLoading && !imageError && (
        <Skeleton className={`h-full w-full ${className}`} />
      )}

      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded || imageError ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgJIYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={70}
        loading={priority ? 'eager' : 'lazy'}
        style={{
          contain: 'layout style paint',
          contentVisibility: 'auto',
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
