import React from 'react';
import Image from 'next/image';
import { replaceInternalLinks } from '../utils/imageReplacement';

interface OptimizedContentProps {
  content: string;
  className?: string;
}

/**
 * Component that renders HTML content with optimized Next.js Images
 */
export const OptimizedContent: React.FC<OptimizedContentProps> = ({ 
  content, 
  className = "prose prose-lg max-w-none" 
}) => {
  if (!content) {
    return (
      <div className={className}>
        <p className="text-center text-muted-foreground py-12">
          No content available.
        </p>
      </div>
    );
  }

  // Clean content by removing scripts
  const cleanContent = content
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Parse HTML and extract images
  const parseContent = (html: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Find all img tags
    const imgRegex = /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi;
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      const [fullMatch, beforeSrc, src, afterSrc] = match;
      const startIndex = match.index;
      
      // Add text content before the image
      if (startIndex > lastIndex) {
        const textContent = html.slice(lastIndex, startIndex);
        if (textContent.trim()) {
          // Replace internal links in text content
          const processedText = textContent.replace(
            /href="https:\/\/blog\.samanportable\.com\/([^"]*)"/g,
            'href="https://www.samanportable.com/$1"'
          );
          parts.push(
            <div 
              key={`text-${startIndex}`}
              dangerouslySetInnerHTML={{ __html: processedText }}
            />
          );
        }
      }
      
      // Extract image attributes
      const altMatch = fullMatch.match(/alt="([^"]*?)"/i);
      const widthMatch = fullMatch.match(/width="([^"]*?)"/i);
      const heightMatch = fullMatch.match(/height="([^"]*?)"/i);
      const classMatch = fullMatch.match(/class="([^"]*?)"/i);
      
      const alt = altMatch ? altMatch[1] : '';
      const width = widthMatch ? parseInt(widthMatch[1]) : 800;
      const height = heightMatch ? parseInt(heightMatch[1]) : 600;
      const imgClass = classMatch ? classMatch[1] : '';
      
      // Add optimized Next.js Image
      parts.push(
        <div key={`img-${startIndex}`} className="relative w-full h-auto my-6">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-auto object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${imgClass}`}
            loading="lazy"
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            style={{
              aspectRatio: `${width}/${height}`,
              contain: 'layout style paint'
            }}
          />
        </div>
      );
      
      lastIndex = startIndex + fullMatch.length;
    }
    
    // Add remaining text content
    if (lastIndex < html.length) {
      const remainingContent = html.slice(lastIndex);
      if (remainingContent.trim()) {
        // Replace internal links in remaining text content
        const processedText = remainingContent.replace(
          /href="https:\/\/blog\.samanportable\.com\/([^"]*)"/g,
          'href="https://www.samanportable.com/$1"'
        );
        parts.push(
          <div 
            key="text-end"
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      }
    }
    
    return parts;
  };

  const parsedContent = parseContent(cleanContent);

  return (
    <div className={className}>
      {parsedContent.length > 0 ? parsedContent : (
        <div 
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      )}
    </div>
  );
};

export default OptimizedContent;
