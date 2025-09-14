/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface LazyLoadSectionProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  delay?: number;
}

export const LazyLoadSection: React.FC<LazyLoadSectionProps> = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '50px',
  className = '',
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !hasAnimated) {
      // Add delay if specified
      if (delay > 0) {
        setTimeout(() => {
          setIsVisible(true);
          setHasAnimated(true);
        }, delay);
      } else {
        setIsVisible(true);
        setHasAnimated(true);
      }
    }
  }, [delay, hasAnimated]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    const observed = ref.current;
    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [threshold, rootMargin, handleIntersection]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

// Optimized version for images
interface LazyLoadImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
}

export const LazyLoadImage: React.FC<LazyLoadImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const observedContainer = containerRef.current;
    if (observedContainer) {
      observer.observe(observedContainer);
    }

    return () => {
      if (observedContainer) {
        observer.unobserve(observedContainer);
      }
    };
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <img
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Actual Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyLoadSection;

