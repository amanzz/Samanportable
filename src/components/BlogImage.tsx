import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFeaturedImageUrl } from '@/config/api';

interface BlogImageProps {
  post: any;
  index: number;
  className?: string;
}

const BlogImage: React.FC<BlogImageProps> = ({ post, index, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fallbackImageUrl, setFallbackImageUrl] = useState<string | null>(null);

  // Check if post has featured media
  const hasFeaturedMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const imageUrl = hasFeaturedMedia ? post._embedded['wp:featuredmedia'][0].source_url : fallbackImageUrl;
  const imageAlt = hasFeaturedMedia ? post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered : post.title.rendered;

  // Fallback: Try to fetch featured image if embedded data is missing
  useEffect(() => {
    if (!hasFeaturedMedia && post.featured_media && !fallbackImageUrl) {
      getFeaturedImageUrl(post.featured_media).then(url => {
        if (url) {
          setFallbackImageUrl(url);
        }
      });
    }
  }, [post.featured_media, hasFeaturedMedia, fallbackImageUrl]);

  // If no image or image failed to load, show a nice placeholder
  if (!imageUrl || imageError) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-xs text-gray-500 font-medium">Blog Post</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={400}
        height={225}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${className}`}
        priority={index < 3} // Prioritize first 3 blog images for LCP
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgJIYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrrM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={85}
        loading={index < 3 ? "eager" : "lazy"}
        style={{
          contain: 'layout style paint',
          contentVisibility: 'auto'
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
      
      {/* Loading skeleton - shows immediately */}
      {!imageLoaded && !imageError && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse ${className}`}
        />
      )}
    </>
  );
};

export default BlogImage;
