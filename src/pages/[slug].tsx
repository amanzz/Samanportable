import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { UnifiedSEO } from '../components/UnifiedSEO';
import { useRouter } from 'next/router';
import Link from 'next/link';
import parse, { domToReact, Element, HTMLReactParserOptions } from 'html-react-parser';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import OptimizedContent from '../components/OptimizedContent';
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Share2, 
  ArrowLeft,
  Loader2,
  Tag
} from 'lucide-react';
import dynamic from 'next/dynamic';


import type { BlogPost, RankMathSEOData } from '../config/api';
import { generateBlogPostSchema, BlogPostSchema, generateBreadcrumbSchema, extractFAQSchema, generateUnifiedBlogGraph, getCityServiceSchema } from '../lib/schema';
import { decodeHtmlEntities } from '../lib/utils';

interface BlogPostProps {
  post: BlogPost | null;
  slug: string;
  rankMathSEO?: RankMathSEOData | null;
}

// Slug-specific metadata image override. This post's WordPress featured image
// (container-office-by-saman-13-1_11zon-1024x584.webp) returns 404, so its
// og:image / twitter:image / BlogPosting schema image use a valid absolute local
// image. Keyed to this one slug only — no other page is affected.
const METADATA_IMAGE_OVERRIDES: Record<string, string> = {
  'best-porta-cabin-supplier': 'https://www.samanportable.com/container-office-by-saman-1.webp',
};
// Distinctive marker of the broken WordPress image (matches its size variants).
const BROKEN_WP_IMAGE_MARKER = 'container-office-by-saman-13-1_11zon';

export const getServerSideProps: GetServerSideProps<BlogPostProps> = async ({ params, res }) => {
  try {
    const slug = params?.slug as string;
    
    if (!slug) {
      return {
        notFound: true,
      };
    }

    // Check if slug is numeric-only (should be handled by middleware, but as fallback)
    if (/^\d+$/.test(slug)) {
      return {
        redirect: {
          destination: '/410',
          permanent: false,
        },
      };
    }

    // Check if this is a reserved route (avoid conflicts with other pages)
    const reservedRoutes = [
      'product', 'blog', 'about-us', 'gallery', 'rental-services', 
      'privacy-policy', 'terms-and-conditions', 'delivery-policy', 
      'refund-and-return-policy', 'contact', 'cart', 'checkout'
    ];
    
    if (reservedRoutes.includes(slug)) {
      return {
        notFound: true,
      };
    }

    // Static content layer: reads the exported post file — no WordPress call.
    // Server-only module, loaded dynamically so fs never reaches the client bundle.
    const staticContent = await import('../lib/staticContent');
    const post = await staticContent.fetchBlogPost(slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    // ─── SSR Content Normalisation ──────────────────────────────────────────
    // Runs server-side so the initial HTML sent to browsers and search engine
    // crawlers is already clean — before any client-side JavaScript executes.
    //
    // Rule 1: Replace blog subdomain hrefs with the canonical frontend domain.
    //   href="https://blog.samanportable.com/[path]"
    //   → href="https://www.samanportable.com/[path]"
    //   Images (src=) are intentionally left unchanged — they must continue to
    //   resolve against the WordPress media library host.
    //
    // Rule 2: Strip ?utm_source=chatgpt.com ONLY from internal samanportable.com
    //   links. External URLs (grandviewresearch.com, willscot.com, etc.) are not
    //   touched.
    function normaliseContent(html: string): string {
      if (!html) return html;

      // Rule 1 — subdomain href rewrite (href only, not src)
      let cleaned = html.replace(
        /(<a[^>]*\s)href="https?:\/\/blog\.samanportable\.com\/([^"]*)"/gi,
        '$1href="https://www.samanportable.com/$2"'
      );

      // Rule 2 — strip utm_source=chatgpt.com from internal links only
      cleaned = cleaned.replace(
        /(href="https?:\/\/(?:www\.)?samanportable\.com\/[^"]*)\?utm_source=chatgpt\.com([^"]*")/gi,
        '$1$2'
      );

      return cleaned;
    }

    post.content.rendered  = normaliseContent(post.content.rendered);
    post.excerpt.rendered  = normaliseContent(post.excerpt.rendered);
    // ────────────────────────────────────────────────────────────────────────

    // Fetch Rank Math SEO data with fallback
    let rankMathSEO: RankMathSEOData | null = null;
    try {
      rankMathSEO = await staticContent.fetchBlogPostRankMathSEO(slug);
      
      // If RankMath data is empty or incomplete, create fallback SEO data
      if (!rankMathSEO || Object.keys(rankMathSEO).length === 0) {
        rankMathSEO = {
          title: decodeHtmlEntities(post.title.rendered) + ' - Saman Portable',
          description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
          canonical: `https://www.samanportable.com/${slug}`,
          og_title: decodeHtmlEntities(post.title.rendered),
          og_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
          og_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
          og_locale: 'en_US',
          twitter_title: decodeHtmlEntities(post.title.rendered),
          twitter_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
          twitter_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
          robots: { index: 'index', follow: 'follow' }
        };
      }
    } catch (error) {
      console.warn('Failed to fetch Rank Math SEO data:', error);
      // Create fallback SEO data
      rankMathSEO = {
        title: decodeHtmlEntities(post.title.rendered) + ' - Saman Portable',
        description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
        canonical: `https://www.samanportable.com/${slug}`,
        og_title: decodeHtmlEntities(post.title.rendered),
        og_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
        og_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
        og_locale: 'en_US',
        twitter_title: decodeHtmlEntities(post.title.rendered),
        twitter_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
        twitter_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
        robots: { index: 'index', follow: 'follow' }
      };
    }

    // Slug-specific fix: override RankMath og/twitter image ONLY when it points to
    // the broken WordPress featured image (or is missing), for this one slug.
    // RankMath has highest priority in UnifiedSEO, so this must run here.
    const metadataImageOverride = METADATA_IMAGE_OVERRIDES[slug];
    if (metadataImageOverride && rankMathSEO) {
      if (!rankMathSEO.og_image || rankMathSEO.og_image.includes(BROKEN_WP_IMAGE_MARKER)) {
        rankMathSEO.og_image = metadataImageOverride;
      }
      if (!rankMathSEO.twitter_image || rankMathSEO.twitter_image.includes(BROKEN_WP_IMAGE_MARKER)) {
        rankMathSEO.twitter_image = metadataImageOverride;
      }
    }

    return {
      props: {
        post,
        slug,
        rankMathSEO,
      },
    };
  } catch (error) {
    // A transient backend failure (network/timeout/5xx/429, surfaced as
    // BackendFetchError by fetchBlogPost) must NOT become a false 404 — that would
    // deindex a real post. Re-throw so Next returns HTTP 500 (retryable by Google)
    // instead of notFound. A GENUINE missing post is handled above (post === null →
    // notFound) and only happens when the backend responded successfully.
    // Only the error message is logged (no request URL), so no secrets are exposed.
    console.error(
      'Blog post SSR failed — returning 5xx, not 404:',
      error instanceof Error ? error.message : 'unknown error'
    );
    throw error instanceof Error ? error : new Error('Failed to render blog post');
  }
};

const BlogPostPage = ({ post, slug, rankMathSEO }: BlogPostProps) => {
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);



  if (!post) {
    return (
      <>
        <main className="section-padding bg-background">
          <div className="max-w-7xl mx-auto container-padding text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground">Blog post not found</h1>
          </div>
        </main>
      </>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get featured image
  const getFeaturedImage = () => {
    // Slug-specific override: this post's WordPress featured image
    // (a blog.samanportable.com upload) returns 404, so serve a valid local image.
    const featuredImageOverrides: Record<string, string> = {
      'best-porta-cabin-supplier': '/container-office-by-saman-1.webp',
    };
    if (featuredImageOverrides[slug]) {
      return featuredImageOverrides[slug];
    }
    if (post._embedded?.['wp:featuredmedia']?.[0]) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    // Fallback when a post has no featured image. Use a valid local raster image
    // instead of /placeholder.svg, which fails Next/Image optimization (HTTP 400).
    return '/hero-image/premium-container-site-office-rental.webp';
  };

  // Get author info
  const getAuthor = () => {
    if (post._embedded?.author?.[0]) {
      return post._embedded.author[0];
    }
    return null;
  };

  const author = getAuthor();
  const featuredImage = getFeaturedImage();

  // HTML Parser Options for semantic rendering
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name) {
        // Handle headings with proper Tailwind classes
        if (domNode.name === 'h1') {
          return (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 mt-8 mb-4">
              {domToReact(domNode.children as any, parserOptions)}
            </h2>
          );
        }
        if (domNode.name === 'h2') {
          return (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 mt-6 sm:mt-10 mb-3 sm:mb-5 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h2>
          );
        }
        if (domNode.name === 'h3') {
          return (
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mt-5 sm:mt-8 mb-2 sm:mb-4 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h3>
          );
        }
        if (domNode.name === 'h4') {
          return (
            <h4 className="text-lg font-semibold text-slate-700 mt-6 mb-3 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h4>
          );
        }
        if (domNode.name === 'h5') {
          return (
            <h5 className="text-base font-semibold text-slate-700 mt-5 mb-2 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h5>
          );
        }
        if (domNode.name === 'h6') {
          return (
            <h6 className="text-sm font-semibold text-slate-700 mt-4 mb-2 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h6>
          );
        }

        // Handle paragraphs with proper spacing
        if (domNode.name === 'p') {
          return (
            <p className="text-slate-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {domToReact(domNode.children as any, parserOptions)}
            </p>
          );
        }

        // Handle tables with responsive styling
        if (domNode.name === 'table') {
          return (
            <div className="overflow-x-auto my-8 border border-slate-200 rounded-lg shadow-sm">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden border border-slate-200 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200">
                    {domToReact(domNode.children as any, parserOptions)}
                  </table>
                </div>
              </div>
            </div>
          );
        }

        // Handle table headers
        if (domNode.name === 'thead') {
          return (
            <thead className="bg-gradient-to-r from-slate-50 to-green-50">
              {domToReact(domNode.children as any, parserOptions)}
            </thead>
          );
        }

        // Handle table header cells
        if (domNode.name === 'th') {
          return (
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b border-slate-200">
              {domToReact(domNode.children as any, parserOptions)}
            </th>
          );
        }

        // Handle table body
        if (domNode.name === 'tbody') {
          return (
            <tbody className="bg-white divide-y divide-slate-200">
              {domToReact(domNode.children as any, parserOptions)}
            </tbody>
          );
        }

        // Handle table rows
        if (domNode.name === 'tr') {
          return (
            <tr className="hover:bg-slate-50 transition-colors duration-150">
              {domToReact(domNode.children as any, parserOptions)}
            </tr>
          );
        }

        // Handle table data cells
        if (domNode.name === 'td') {
          return (
            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900 border-b border-slate-100 break-words">
              {domToReact(domNode.children as any, parserOptions)}
            </td>
          );
        }

        // Handle unordered lists
        if (domNode.name === 'ul') {
          return (
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-slate-700 pl-4 sm:pl-6 text-sm sm:text-base">
              {domToReact(domNode.children as any, parserOptions)}
            </ul>
          );
        }

        // Handle ordered lists
        if (domNode.name === 'ol') {
          return (
            <ol className="list-decimal list-inside space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-slate-700 pl-4 sm:pl-6 text-sm sm:text-base">
              {domToReact(domNode.children as any, parserOptions)}
            </ol>
          );
        }

        // Handle list items
        if (domNode.name === 'li') {
          return (
            <li className="text-slate-700 leading-relaxed">
              {domToReact(domNode.children as any, parserOptions)}
            </li>
          );
        }

        // Handle blockquotes
        if (domNode.name === 'blockquote') {
          return (
            <blockquote className="border-l-4 border-[#0A3D2A] pl-4 sm:pl-6 py-3 sm:py-4 my-4 sm:my-6 bg-[#0A3D2A]/10 rounded-r-lg">
              <p className="text-slate-700 italic text-base sm:text-lg">
                {domToReact(domNode.children as any, parserOptions)}
              </p>
            </blockquote>
          );
        }

        // Handle strong/bold text
        if (domNode.name === 'strong' || domNode.name === 'b') {
          return (
            <strong className="font-semibold text-slate-900">
              {domToReact(domNode.children as any, parserOptions)}
            </strong>
          );
        }

        // Handle emphasis/italic text
        if (domNode.name === 'em' || domNode.name === 'i') {
          return (
            <em className="italic text-slate-800">
              {domToReact(domNode.children as any, parserOptions)}
            </em>
          );
        }

                 // Handle links
         if (domNode.name === 'a') {
           const href = domNode.attribs?.href || '#';
           return (
             <a 
               href={href}
               className="text-green-600 hover:text-green-800 underline decoration-green-400 hover:decoration-green-600 transition-colors duration-200"
               target="_blank"
               rel="noopener noreferrer"
             >
               {domToReact(domNode.children as any, parserOptions)}
             </a>
           );
         }

        // Handle images
        if (domNode.name === 'img') {
          const src = domNode.attribs?.src || '';
          const alt = domNode.attribs?.alt || '';
          const className = domNode.attribs?.class || '';
          
          // Check if image has alignment classes
          const isAlignedLeft = className.includes('alignleft');
          const isAlignedRight = className.includes('alignright');
          const isAlignedCenter = className.includes('aligncenter');
          
          // Determine container classes based on alignment
          let containerClasses = "my-4 sm:my-8 text-center";
          if (isAlignedLeft) containerClasses = "my-4 sm:my-8 float-left mr-4 mb-4";
          if (isAlignedRight) containerClasses = "my-4 sm:my-8 float-right ml-4 mb-4";
          if (isAlignedCenter) containerClasses = "my-4 sm:my-8 text-center clear-both";
          
          return (
            <div className={containerClasses}>
              <Image 
                src={src} 
                alt={alt}
                width={800}
                height={600}
                className="max-w-full h-auto rounded-lg shadow-lg border border-slate-200 mx-auto responsive-img"
                loading="lazy"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              {alt && (
                <p className="text-xs sm:text-sm text-slate-500 mt-2 italic px-4">{alt}</p>
              )}
            </div>
          );
        }

        // Handle code blocks
        if (domNode.name === 'pre') {
          return (
            <pre className="bg-slate-900 text-slate-100 p-3 sm:p-4 rounded-lg overflow-x-auto my-4 sm:my-6 text-xs sm:text-sm font-mono">
              {domToReact(domNode.children as any, parserOptions)}
            </pre>
          );
        }

        // Handle inline code
        if (domNode.name === 'code') {
          return (
            <code className="bg-slate-100 text-slate-800 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm font-mono">
              {domToReact(domNode.children as any, parserOptions)}
            </code>
          );
        }

        // Handle horizontal rules
        if (domNode.name === 'hr') {
          return (
            <hr className="my-6 sm:my-8 border-t border-slate-200" />
          );
        }

        // Handle WordPress specific blocks
        if (domNode.name === 'div' && domNode.attribs?.class?.includes('wp-block')) {
          return (
            <div className="my-4 sm:my-6">
              {domToReact(domNode.children as any, parserOptions)}
            </div>
          );
        }
      }
      return undefined;
    }
  };



  const handleShare = () => {
    if (!isClient) return;
    
    if (navigator.share) {
      navigator.share({
        title: decodeHtmlEntities(post.title.rendered),
        text: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '')),
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Layout>
      {/* Unified SEO - Single source of truth for all meta tags */}
      <UnifiedSEO 
        rankMathSEO={rankMathSEO} 
        fallbackCanonical={`https://www.samanportable.com/${slug}`}
        fallbackTitle={`${decodeHtmlEntities(post?.title?.rendered || 'Blog Post')} - Saman Portable`}
        fallbackDescription={decodeHtmlEntities(post?.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Read our latest blog post at Saman Portable.')}
        fallbackOgImage={METADATA_IMAGE_OVERRIDES[slug] || post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://www.samanportable.com/og-image.svg'}
        keywords={`blog, portable office, container office, prefab solutions, ${post?._embedded?.['wp:term']?.[0]?.[0]?.name || ''}`}
        structuredData={(() => {
          if (!post) return undefined;
          
          const isOrgAuthor = !post._embedded?.author?.[0]?.name || post._embedded?.author?.[0]?.name === 'Saman Portable';
          
          return generateUnifiedBlogGraph({
            postSchema: {
              title: decodeHtmlEntities(post.title.rendered),
              description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
              image: METADATA_IMAGE_OVERRIDES[slug] || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://www.samanportable.com/default-blog-image.jpg',
              author: post._embedded?.author?.[0]?.name || 'Saman Portable',
              authorUrl: isOrgAuthor ? undefined : 'https://www.samanportable.com/about-us',
              datePublished: post.date,
              dateModified: post.modified,
              url: `https://www.samanportable.com/${slug}`,
              category: post._embedded?.['wp:term']?.[0]?.[0]?.name
            },
            breadcrumbs: [
              { name: 'Home', url: 'https://www.samanportable.com/' },
              { name: 'Blog', url: 'https://www.samanportable.com/blog' },
              { name: decodeHtmlEntities(post.title.rendered), url: `https://www.samanportable.com/${slug}` }
            ],
            faqSchema: extractFAQSchema(post.content.rendered),
            serviceSchema: getCityServiceSchema({
              slug,
              description: post.excerpt.rendered,
              image: METADATA_IMAGE_OVERRIDES[slug] || post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
              url: `https://www.samanportable.com/${slug}`,
            })
          });
        })()}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-10">
                         <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition-all duration-200 font-medium group">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="text-slate-600 hover:text-green-600 transition-all duration-200 font-medium">
              Blog
            </Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-800 font-semibold line-clamp-1 max-w-xs">{decodeHtmlEntities(post.title.rendered)}</span>
          </nav>

          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" size="sm" className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-[#0A3D2A]/30 hover:bg-[#0A3D2A]/10 text-slate-700 hover:text-[#0A3D2A] transition-all duration-300 shadow-sm hover:shadow-md rounded-xl">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Blog</span>
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <article className="mb-16">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 bg-clip-text text-transparent leading-tight tracking-tight mb-6">
                {decodeHtmlEntities(post.title.rendered)}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {author && (
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1 font-medium uppercase tracking-wide">Author</span>
                    <span className="text-lg font-semibold text-slate-800">{author.name}</span>
                  </div>
                </div>
              )}
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1 font-medium uppercase tracking-wide">Published</span>
                  <span className="text-lg font-semibold text-slate-800">{formatDate(post.date)}</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1 font-medium uppercase tracking-wide">Updated</span>
                  <span className="text-lg font-semibold text-slate-800">{formatDate(post.modified)}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {featuredImage && (
              <div className="mb-12">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                  <Image
                    src={featuredImage}
                    alt={decodeHtmlEntities(post.title.rendered)}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-white text-sm font-medium">Featured Image</div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            {post._embedded?.['wp:term']?.[0] && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Tag className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-lg font-semibold text-slate-700">Categories</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post._embedded['wp:term'][0].map((category: any) => (
                    <Link key={category.id} href={`/blog?category=${category.slug}`}>
                      <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0A3D2A]/10 to-[#0A3D2A]/20 hover:from-[#0A3D2A]/20 hover:to-[#0A3D2A]/30 text-[#0A3D2A] border border-[#0A3D2A]/20 hover:border-[#0A3D2A]/30 transition-all duration-300 rounded-full hover:scale-105 shadow-sm">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

             

            {/* Blog Content - Direct rendering without LongformContent to avoid FAQ duplication */}
            <div className="mb-10">
              <OptimizedContent 
                content={post.content.rendered}
                className="prose prose-lg max-w-none text-lg text-slate-700 leading-relaxed space-y-6"
              />
            </div>
          </article>

          {/* Article Footer */}
          <Separator className="my-12" />
          
                     <div className="bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8 rounded-3xl border border-slate-200 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Enjoyed this article?</h3>
              <p className="text-slate-600">Share it with others or explore more content</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                             {/* Share Button */}
               <Button 
                 variant="outline" 
                 onClick={handleShare}
                 className="group flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-700 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl text-lg font-medium"
               >
                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Share Article</span>
              </Button>

                             {/* Back to Blog */}
               <Link href="/blog">
                 <Button variant="default" className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl text-lg font-medium">
                   <ArrowLeft className="w-5 h-5 mr-2" />
                   View All Posts
                 </Button>
               </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default BlogPostPage;
