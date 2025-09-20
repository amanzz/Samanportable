import React from 'react';
import { NextSeo, NextSeoProps } from 'next-seo';
import { defaultSEO, siteConfig } from '@/config/seo';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  author?: string;
  publisher?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  };
  noindex?: boolean;
  nofollow?: boolean;
  children?: React.ReactNode;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  keywords,
  author,
  publisher,
  openGraph,
  noindex = false,
  nofollow = false,
  children,
  ...props
}) => {
  const seoProps: NextSeoProps = {
    ...defaultSEO,
    title,
    description,
    canonical: canonical || defaultSEO.canonical,
    noindex,
    nofollow,
    openGraph: {
      ...defaultSEO.openGraph,
      ...openGraph,
      title: openGraph?.title || title || defaultSEO.openGraph?.title,
      description: openGraph?.description || description || defaultSEO.openGraph?.description,
      url: openGraph?.url || canonical || defaultSEO.openGraph?.url,
    },
    ...props,
  };

  return (
    <>
      <NextSeo {...seoProps} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      {publisher && <meta name="publisher" content={publisher} />}
      {children}
    </>
  );
};

export default SEO;

