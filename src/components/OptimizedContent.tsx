import React, { useMemo } from 'react';
import Image from 'next/image';

interface OptimizedContentProps {
  content: string;
  className?: string;
}

interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  title?: string;
}

/**
 * Component that renders HTML content with optimized Next.js Image components
 * Replaces img tags with Next.js Image for better performance and optimization
 */
export const OptimizedContent: React.FC<OptimizedContentProps> = ({ 
  content, 
  className = "prose prose-lg max-w-none" 
}) => {
  // Extract images from content and process them
  const { processedContent, images } = useMemo(() => {
    if (!content) {
      return { processedContent: '', images: new Map<string, ImageData>() };
    }
    const imageMap = new Map<string, ImageData>();
    let imageCounter = 0;

    // Clean content by removing scripts and other potentially problematic elements
    let cleanContent = content
      .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<meta[^>]*>/gi, '');

    // Replace internal blog links
    cleanContent = cleanContent.replace(
      /href="https:\/\/blog\.samanportable\.com\/([^"]*)"/g,
      'href="https://www.samanportable.com/$1"'
    );

    // Replace img tags with placeholders and collect image data
    cleanContent = cleanContent.replace(
      /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
      (match, beforeSrc, src, afterSrc) => {
        // Skip if src is empty or invalid
        if (!src || src.trim() === '') {
          return match;
        }

        // Extract attributes
        const altMatch = match.match(/alt="([^"]*?)"/i);
        const alt = altMatch ? altMatch[1] : 'Image';
        
        const widthMatch = match.match(/width="([^"]*?)"/i);
        const heightMatch = match.match(/height="([^"]*?)"/i);
        const width = widthMatch ? parseInt(widthMatch[1]) : 1600;
        const height = heightMatch ? parseInt(heightMatch[1]) : 1000;
        
        const classMatch = match.match(/class="([^"]*?)"/i);
        const imgClassName = classMatch ? classMatch[1] : 'w-full h-auto';
        
        const titleMatch = match.match(/title="([^"]*?)"/i);
        const title = titleMatch ? titleMatch[1] : '';

        const imageId = `optimized-image-${imageCounter++}`;
        
        imageMap.set(imageId, {
          src,
          alt,
          width,
          height,
          className: imgClassName,
          title
        });

        // Return placeholder div that will be replaced with React component
        return `<div data-image-id="${imageId}" class="optimized-image-placeholder"></div>`;
      }
    );

    return { processedContent: cleanContent, images: imageMap };
  }, [content]);

  // Early return after hooks
  if (!content) {
    return (
      <div className={className}>
        <p className="text-center text-muted-foreground py-12">
          No content available.
        </p>
      </div>
    );
  }

  // Render content with Next.js Image components
  const renderContentWithImages = () => {
    const parts = processedContent.split(/(<div data-image-id="[^"]*" class="optimized-image-placeholder"><\/div>)/);
    
    return parts.map((part, index) => {
      const imageIdMatch = part.match(/data-image-id="([^"]*)"/);
      
      if (imageIdMatch) {
        const imageId = imageIdMatch[1];
        const imageData = images.get(imageId);
        
        if (imageData) {
          return (
            <div 
              key={index} 
              className="relative w-full my-4 sm:my-6 md:my-8 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-6xl mx-auto lg:max-w-5xl md:max-w-4xl sm:max-w-full px-2 sm:px-0"
            >
              <Image
                src={imageData.src}
                alt={imageData.alt}
                width={imageData.width}
                height={imageData.height}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                title={imageData.title}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 90vw, (max-width: 1280px) 85vw, 1600px"
                style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    minHeight: '200px'
                  }}
              />
            </div>
          );
        }
      }
      
      return (
        <div 
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return (
    <div className={className}>
      {renderContentWithImages()}
    </div>
  );
};

export default OptimizedContent;
