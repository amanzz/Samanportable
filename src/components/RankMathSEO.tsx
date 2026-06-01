import React from 'react';
import Head from 'next/head';
import { RankMathSEOData } from '@/config/api';

interface RankMathSEOProps {
  seoData?: RankMathSEOData | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackCanonical?: string;
  fallbackOgImage?: string;
}

export const RankMathSEO: React.FC<RankMathSEOProps> = ({
  seoData,
  fallbackTitle,
  fallbackDescription,
  fallbackCanonical,
  fallbackOgImage = 'https://www.samanportable.com/og-image.svg',
}) => {
  // Debug logging

  
  // Use Rank Math data if available, otherwise use fallbacks
  const title = seoData?.title || fallbackTitle;
  const description = seoData?.description || fallbackDescription;
  const canonical = seoData?.canonical || fallbackCanonical;
  const ogTitle = seoData?.og_title || title;
  const ogDescription = seoData?.og_description || description;
  const ogImage = seoData?.og_image || fallbackOgImage;
  const ogLocale = seoData?.og_locale || 'en_US';
  const twitterTitle = seoData?.twitter_title || title;
  const twitterDescription = seoData?.twitter_description || description;
  const twitterImage = seoData?.twitter_image || ogImage;

  // Handle robots meta - Override WordPress noindex for main site
  // WordPress blog should have noindex, but main site pages should be indexed
  const robotsContent = 'index, follow';

  return (
    <Head>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots Meta */}
      <meta name="robots" content={robotsContent} />
      
      {/* Open Graph Meta Tags */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="800" />}
      {ogImage && <meta property="og:image:height" content="600" />}
      {ogImage && <meta property="og:image:type" content="image/webp" />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="SAMAN POS India Private Limited" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Saman_Portable" />
      <meta name="twitter:creator" content="@Saman_Portable" />
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      {twitterImage && <meta name="twitter:image:alt" content="Portable Toilet Image" />}
      
      {/* Schema.org Structured Data handled by ProductStructuredData component */}
      {/* Removed seoData.schema to prevent duplicate Product schemas */}
      
      {/* Additional Meta Tags - Format detection is handled globally in _document.tsx */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default RankMathSEO;