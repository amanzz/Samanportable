import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedCategoryImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

const OptimizedCategoryImage: React.FC<OptimizedCategoryImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  width = 400,
  height = 300
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => setHasError(true);

  // Fallback image
  const fallbackSrc = '/placeholder.svg';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-gray-400 text-xs text-center">
            <div className="w-8 h-8 mx-auto mb-1">📷</div>
            Image unavailable
          </div>
        </div>
      )}

      {/* Next.js optimized image */}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        priority={priority}
        sizes={sizes}
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedCategoryImage;

