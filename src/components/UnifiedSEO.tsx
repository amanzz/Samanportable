import React from 'react';
import Head from 'next/head';
import { RankMathSEOData } from '@/config/api';

interface UnifiedSEOProps {
  // Rank Math SEO data (highest priority)
  rankMathSEO?: RankMathSEOData | null;
  
  // Fallback values when Rank Math data is not available
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackCanonical?: string;
  fallbackOgImage?: string;
  fallbackOgDescription?: string;
  fallbackTwitterDescription?: string;
  
  // Additional meta tags (only if not provided by Rank Math)
  keywords?: string;
  author?: string;
  publisher?: string;
  
  // Structured data
  structuredData?: object;
  
  // Override flags
  noindex?: boolean;
  nofollow?: boolean;
}

export const UnifiedSEO: React.FC<UnifiedSEOProps> = ({
  rankMathSEO,
  fallbackTitle,
  fallbackDescription,
  fallbackCanonical,
  fallbackOgImage = 'https://www.samanportable.com/og-image.svg',
  keywords,
  author = 'SAMAN Portable Office Solutions',
  publisher = 'SAMAN Portable Office Solutions',
  structuredData,
  noindex = false,
  nofollow = false,
}) => {
  // Priority order: Rank Math SEO > Fallback values > Default values
  
  // Title - Rank Math has highest priority
  const title = rankMathSEO?.title || fallbackTitle || 'SAMAN Portable Office Solutions';
  
  // Description - Rank Math has highest priority
  const description = rankMathSEO?.description || fallbackDescription || 'Premium portable cabins, container offices, and prefab solutions in Bangalore';
  
  // Canonical URL - Rank Math has highest priority
  const canonical = rankMathSEO?.canonical || fallbackCanonical || 'https://www.samanportable.com';
  
  // OpenGraph data - Rank Math has highest priority
  const ogTitle = rankMathSEO?.og_title || title;
  // Create unique OpenGraph description to avoid duplication
  const ogDescription = rankMathSEO?.og_description || fallbackDescription || `${title} - Premium portable solutions with advanced features and customization options.`;
  const ogImage = rankMathSEO?.og_image || fallbackOgImage;
  const ogUrl = canonical;
  const ogLocale = rankMathSEO?.og_locale || 'en_US';
  
  // Twitter Card data - Rank Math has highest priority
  const twitterTitle = rankMathSEO?.twitter_title || ogTitle;
  // Create unique Twitter description to avoid duplication
  const twitterDescription = rankMathSEO?.twitter_description || fallbackDescription || `${title} - Durable and reliable portable structures for your business needs.`;
  const twitterImage = rankMathSEO?.twitter_image || ogImage;
  
  // Robots meta - respect noindex/nofollow overrides
  const robotsContent = noindex || nofollow 
    ? `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`
    : 'index, follow';

  // Clean and deduplicate keywords
  const cleanKeywords = keywords ? keywords
    .split(',')
    .map(k => k.trim())
    .filter((k, index, arr) => arr.indexOf(k) === index) // Remove duplicates
    .join(', ') : undefined;

  return (
    <Head>
      {/* Basic Meta Tags - Single instances only */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {cleanKeywords && <meta name="keywords" content={cleanKeywords} />}
      {author && <meta name="author" content={author} />}
      {publisher && <meta name="publisher" content={publisher} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots Meta */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      
      {/* Open Graph Meta Tags - Single instances only */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="600" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:site_name" content="SAMAN Portable Office Solutions" />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Twitter Card Meta Tags - Single instances only */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Saman_Portable" />
      <meta name="twitter:creator" content="@Saman_Portable" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content="Portable Toilet Image" />
      
      {/* Viewport - Format detection is handled globally in _document.tsx */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Structured Data - Only if provided */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  );
};

export default UnifiedSEO;
