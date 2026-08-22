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
import QuoteForm from '../components/QuoteForm';
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
import { generateBlogPostSchema, BlogPostSchema, generateBreadcrumbSchema, extractFAQSchema, generateUnifiedBlogGraph, getCityServiceSchema, getCityPageGraph, getFAQSchemaOverride } from '../lib/schema';
import { decodeHtmlEntities } from '../lib/utils';
import { demoteHtmlH1ToH2 } from '../lib/seoHtml';
import { setPublicEdgeCache } from '../lib/cacheHeaders';

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
  'owning-a-porta-cabin-is-perfect': 'https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp',
  'portable-office-cabin-manufacturers-in-bangalore': 'https://www.samanportable.com/images/blr-01/portable-office-cabin-manufacturer-bangalore-hero.webp',
};
// Distinctive marker of the broken WordPress image (matches its size variants).
const BROKEN_WP_IMAGE_MARKER = 'container-office-by-saman-13-1_11zon';

const SEO_TITLE_OVERRIDES: Record<string, string> = {
  'container-houses-cost-guide-2024': 'Container Houses Cost Guide 2024 | SAMAN',
  'porta-cabin-office-price': 'Porta Office Cabin Price Guide 2025 | SAMAN',
};

const SEO_METADATA_OVERRIDES: Record<string, { title: string; description: string }> = {
  'owning-a-porta-cabin-is-perfect': {
    title: 'Why Own a Porta Cabin? Benefits, Sizes & Buyer Guide',
    description: 'Should you own a porta cabin? See the benefits, sizes, uses and buying checks before you choose a factory-built SAMAN porta cabin.',
  },
  'portable-office-cabin-manufacturers-in-bangalore': {
    title: 'Portable Office Cabin Manufacturer in Bangalore | SAMAN',
    description: 'Portable office cabins built at our own Gopasandra, Bengaluru unit. Nine sizes, insulated panels and free Bangalore city delivery in 7 to 21 working days.',
  },
};

const BANGALORE_OFFICE_CABIN_SLUG = 'portable-office-cabin-manufacturers-in-bangalore';
const BANGALORE_OFFICE_CABIN_URL = `https://www.samanportable.com/${BANGALORE_OFFICE_CABIN_SLUG}`;
const BANGALORE_OFFICE_CABIN_SEO_TITLE = 'Portable Office Cabin Manufacturer in Bangalore | SAMAN';
const BANGALORE_OFFICE_CABIN_META_DESCRIPTION = 'Portable office cabins built at our own Gopasandra, Bengaluru unit. Nine sizes, insulated panels and free Bangalore city delivery in 7 to 21 working days.';
const BANGALORE_OFFICE_CABIN_HERO_IMAGE = '/images/blr-01/portable-office-cabin-manufacturer-bangalore-hero.webp';
const BANGALORE_OFFICE_CABIN_HERO_ALT = 'Grey portable office cabin with glass door and window by a roadside';
const BANGALORE_OFFICE_CABIN_MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15556.703211516599!2d77.7291942!3d12.8509838!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6d55f6f82ca7%3A0xf28e36c870c3ef6a!2sSAMAN%20POS%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1712400000000!5m2!1sen!2sin';
const BANGALORE_OFFICE_CABIN_DIRECTIONS = 'https://www.google.com/maps/search/?api=1&query=SAMAN%20POS%20India%20Private%20Limited%20Gopasandra%20Bengaluru%20560099';
const BANGALORE_OFFICE_CABIN_FAQS = [
  {
    question: 'Where are your portable office cabins manufactured?',
    answer: 'At our own unit at Sy No 34/2, Gopasandra, Bengaluru 560099. Cabins for Bangalore projects are fabricated, fitted and finished there and dispatched from that address.',
  },
  {
    question: 'Is delivery inside Bangalore charged separately?',
    answer: 'Standard delivery within Bangalore city limits is included for our standard cabin sizes to accessible sites. Crane hire, night-movement permits and restricted-access sites are quoted separately.',
  },
  {
    question: 'How long does a portable office cabin take from order to placement?',
    answer: 'Normally 7 to 21 working days from drawing approval. The variable is the specification, not the queue. Confirm your layout early and the schedule holds.',
  },
  {
    question: 'Can I visit the Gopasandra factory before ordering?',
    answer: 'Yes, and we encourage it. Call +91 88616 22859 between 9:00 am and 8:00 pm, Monday to Saturday, to arrange a visit. Ask to see a cabin at the panelling stage.',
  },
  {
    question: 'Which size suits a four-person site office?',
    answer: 'A 20 by 10 foot cabin at 200 square feet is the usual choice for four people with desks, storage and a small meeting corner. If the same cabin must also hold a toilet, move up rather than partition down.',
  },
  {
    question: 'Do you supply used or refurbished portable office cabins?',
    answer: 'No. Every cabin we deliver is newly fabricated at our Bengaluru unit. It carries a five-year structural warranty on the frame and base, with one-year warranty on finishing. A used cabin carries neither.',
  },
  {
    question: 'Do you deliver portable office cabins outside Bangalore city limits?',
    answer: 'Yes, across Karnataka and the wider south zone from the same Gopasandra unit. Delivery inside Bangalore city limits is included for standard sizes to accessible sites; beyond the city limits freight is quoted against the distance and the vehicle the route requires.',
  },
  {
    question: 'Can two office cabins be joined into one larger office?',
    answer: 'Yes, provided the units are built to the same module. That is decided at the drawing stage, not at delivery, so tell us at enquiry if you expect to extend later. Joining two cabins built to different modules afterwards is not a site adjustment.',
  },
];

const BANGALORE_OFFICE_CABIN_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SAMAN POS India Private Limited',
    url: BANGALORE_OFFICE_CABIN_URL,
    telephone: '+91 88616 22859',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sy No 34/2, Gopasandra',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560099',
      addressCountry: 'IN',
    },
    openingHours: 'Mo-Sa 09:00-20:00',
    areaServed: 'Bengaluru',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BANGALORE_OFFICE_CABIN_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
];

const CONTENT_H1_DEMOTION_SLUGS = new Set([
  'best-porta-cabins-in-bangalore',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
]);

// City/geo landing pages that emit the lean 3-node city graph (Organization +
// BreadcrumbList + FAQPage) instead of the default multi-node blog graph.
// Allowlisted per slug so no other blog post's schema is affected.
const CITY_PAGE_SCHEMA_SLUGS = new Set([
  'porta-cabin-in-hyderabad',
  'porta-cabin-in-chennai',
  'porta-cabin-in-kochi',
  'porta-cabin-in-coimbatore',
  'porta-cabin-in-mysore',
  'porta-cabin-in-vijayawada',
  'porta-cabin-in-visakhapatnam',
  'porta-cabin-in-madurai',
  'porta-cabin-in-mangalore',
  'porta-cabin-in-lucknow',
  'porta-cabin-in-mumbai',
  'porta-cabin-in-ahmedabad',
  'porta-cabin-in-kolkata',
  'porta-cabin-in-jaipur',
  'porta-cabin-in-kanpur',
  'porta-cabin-in-chandigarh',
  'porta-cabin-in-pune',
  'porta-cabin-in-surat',
  'porta-cabin-in-nashik',
  'porta-cabin-in-vadodara',
  'porta-cabin-in-nagpur',
  'porta-cabin-in-rajkot',
  'porta-cabin-in-patna',
  'porta-cabin-in-bhubaneswar',
  'porta-cabin-in-raipur',
  'porta-cabin-in-bhopal',
  'porta-cabin-in-ranchi',
  'porta-cabin-in-guwahati',
  'porta-cabin-in-dehradun',
  'porta-cabin-in-gwalior',
  'porta-cabin-in-indore',
  'porta-cabin-in-manesar',
  'porta-cabin-in-bhiwadi',
  'porta-cabin-in-sonipat',
  'porta-cabin-in-panipat',
  'porta-cabin-in-meerut',
  'porta-cabin-in-ludhiana',
  'porta-cabin-in-bareilly',
  'porta-cabin-in-moradabad',
  'porta-cabin-in-rourkela',
  'porta-cabin-in-durgapur',
  'porta-cabin-in-jamshedpur',
  'porta-cabin-in-hosur',
  'porta-cabin-in-salem',
  'porta-cabin-in-hubli',
  'porta-cabin-in-tumkur',
  'porta-cabin-in-belgaum',
  'porta-cabin-in-tirupur',
  'porta-cabin-in-aurangabad',
  // C3 Container Office city pages (Container Offices hub breadcrumb, not Porta Cabins)
  'container-office-in-bangalore',
  'container-office-in-chennai',
  'container-office-in-hyderabad',
  'container-office-in-mumbai',
  'container-office-in-delhi',
  'container-office-in-jaipur',
  'container-office-in-pune',
  'container-office-in-lucknow',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
  'container-office-in-kochi',
  'container-office-in-mysore',
  'container-office-in-visakhapatnam',
  'container-office-in-vijayawada',
  'container-office-in-mangalore',
  'container-office-in-coimbatore',
  'container-office-in-madurai',
  'container-office-in-surat',
  'container-office-in-indore',
  'container-office-in-nagpur',
  'container-office-in-vadodara',
  'container-office-in-meerut',
  'container-office-in-kanpur',
  'container-office-in-chandigarh',
  'container-office-in-ludhiana',
  'container-office-in-ankleshwar',
  'container-office-in-dahej',
  'container-office-in-morbi',
  'container-office-in-mundra',
  'container-office-in-vellore',
  'container-office-in-tirunelveli',
  'container-office-in-erode',
  'container-office-in-kurnool',
  'container-office-in-shivamogga',
  'container-office-in-davangere',
  'container-office-in-rajahmundry',
  'container-office-in-gwalior',
  'container-office-in-bhiwadi',
  'container-office-in-bhopal',
  'container-office-in-raipur',
  'container-office-in-nashik',
  'container-office-in-panipat',
  'container-office-in-dehradun',
]);

// Container-office (C3) city pages: same lean 3-node graph as the porta-cabin
// city pages, but the breadcrumb hub is "Container Offices", not "Porta Cabins".
const CONTAINER_OFFICE_CITY_SLUGS = new Set([
  'container-office-in-bangalore',
  'container-office-in-chennai',
  'container-office-in-hyderabad',
  'container-office-in-mumbai',
  'container-office-in-delhi',
  'container-office-in-jaipur',
  'container-office-in-pune',
  'container-office-in-lucknow',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
  'container-office-in-kochi',
  'container-office-in-mysore',
  'container-office-in-visakhapatnam',
  'container-office-in-vijayawada',
  'container-office-in-mangalore',
  'container-office-in-coimbatore',
  'container-office-in-madurai',
  'container-office-in-surat',
  'container-office-in-indore',
  'container-office-in-nagpur',
  'container-office-in-vadodara',
  'container-office-in-meerut',
  'container-office-in-kanpur',
  'container-office-in-chandigarh',
  'container-office-in-ludhiana',
  'container-office-in-ankleshwar',
  'container-office-in-dahej',
  'container-office-in-morbi',
  'container-office-in-mundra',
  'container-office-in-vellore',
  'container-office-in-tirunelveli',
  'container-office-in-erode',
  'container-office-in-kurnool',
  'container-office-in-shivamogga',
  'container-office-in-davangere',
  'container-office-in-rajahmundry',
  'container-office-in-gwalior',
  'container-office-in-bhiwadi',
  'container-office-in-bhopal',
  'container-office-in-raipur',
  'container-office-in-nashik',
  'container-office-in-panipat',
  'container-office-in-dehradun',
]);

// City pages served from the North (Greater Noida) factory: their Organization
// contactPoint uses the North sales number instead of the South default.
const NORTH_CITY_PAGE_SLUGS = new Set([
  'porta-cabin-in-lucknow',
  'porta-cabin-in-mumbai',
  'porta-cabin-in-ahmedabad',
  'porta-cabin-in-kolkata',
  'porta-cabin-in-jaipur',
  'porta-cabin-in-kanpur',
  'porta-cabin-in-chandigarh',
  'porta-cabin-in-pune',
  'porta-cabin-in-surat',
  'porta-cabin-in-nashik',
  'porta-cabin-in-vadodara',
  'porta-cabin-in-nagpur',
  'porta-cabin-in-patna',
  'porta-cabin-in-rajkot',
  'porta-cabin-in-bhubaneswar',
  'porta-cabin-in-raipur',
  'porta-cabin-in-bhopal',
  'porta-cabin-in-ranchi',
  'porta-cabin-in-guwahati',
  'porta-cabin-in-dehradun',
  'porta-cabin-in-gwalior',
  'porta-cabin-in-indore',
  'porta-cabin-in-manesar',
  'porta-cabin-in-bhiwadi',
  'porta-cabin-in-sonipat',
  'porta-cabin-in-panipat',
  'porta-cabin-in-meerut',
  'porta-cabin-in-ludhiana',
  'porta-cabin-in-bareilly',
  'porta-cabin-in-moradabad',
  'porta-cabin-in-rourkela',
  'porta-cabin-in-durgapur',
  'porta-cabin-in-jamshedpur',
  'porta-cabin-in-aurangabad',
  'container-office-in-mumbai',
  'container-office-in-delhi',
  'container-office-in-jaipur',
  'container-office-in-pune',
  'container-office-in-lucknow',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
  'container-office-in-surat',
  'container-office-in-indore',
  'container-office-in-nagpur',
  'container-office-in-vadodara',
  'container-office-in-meerut',
  'container-office-in-kanpur',
  'container-office-in-chandigarh',
  'container-office-in-ludhiana',
  'container-office-in-ankleshwar',
  'container-office-in-dahej',
  'container-office-in-morbi',
  'container-office-in-mundra',
  'container-office-in-gwalior',
  'container-office-in-bhiwadi',
  'container-office-in-bhopal',
  'container-office-in-raipur',
  'container-office-in-nashik',
  'container-office-in-panipat',
  'container-office-in-dehradun',
]);

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
    //   EXCEPTION: media asset links under /wp-content/ (click-to-enlarge full-size
    //   <a href="blog…/wp-content/…jpg">) are NOT rewritten — the static www site does
    //   not host /wp-content/, so rewriting them to www would 404 (Semrush "internal
    //   images are broken"). They must stay on the blog origin that serves the files.
    //
    // Rule 2: Strip ?utm_source=chatgpt.com ONLY from internal samanportable.com
    //   links. External URLs (grandviewresearch.com, willscot.com, etc.) are not
    //   touched.
    function normaliseContent(html: string): string {
      if (!html) return html;

      // Rule 1 — subdomain href rewrite (href only, not src), skipping /wp-content/ media links
      let cleaned = html.replace(
        /(<a[^>]*\s)href="https?:\/\/blog\.samanportable\.com\/((?!wp-content\/)[^"]*)"/gi,
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
    if (CONTENT_H1_DEMOTION_SLUGS.has(slug)) {
      post.content.rendered = demoteHtmlH1ToH2(post.content.rendered);
    }
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

    const seoTitleOverride = SEO_TITLE_OVERRIDES[slug];
    if (seoTitleOverride) {
      rankMathSEO = {
        ...(rankMathSEO || {}),
        title: seoTitleOverride,
        og_title: seoTitleOverride,
        twitter_title: seoTitleOverride,
      };
    }

    const seoMetadataOverride = SEO_METADATA_OVERRIDES[slug];
    if (seoMetadataOverride) {
      const canonicalUrl = `https://www.samanportable.com/${slug}`;
      const imageOverride = METADATA_IMAGE_OVERRIDES[slug] || rankMathSEO?.og_image || 'https://www.samanportable.com/og-image.svg';
      rankMathSEO = {
        ...(rankMathSEO || {}),
        title: seoMetadataOverride.title,
        description: seoMetadataOverride.description,
        canonical: canonicalUrl,
        og_title: seoMetadataOverride.title,
        og_description: seoMetadataOverride.description,
        og_image: imageOverride,
        twitter_title: seoMetadataOverride.title,
        twitter_description: seoMetadataOverride.description,
        twitter_image: imageOverride,
        robots: { index: 'index', follow: 'follow' },
      };
    }

    // Public marketing page with no per-user data — safe to edge-cache. Set only
    // on the success path so the 404s/redirects above keep Next's default no-store
    // and newly-published URLs are never cache-poisoned.
    setPublicEdgeCache(res);

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

const BangalorePortableOfficeCabinLanding = ({ rankMathSEO }: { rankMathSEO?: RankMathSEOData | null }) => {
  return (
    <Layout>
      <UnifiedSEO
        rankMathSEO={rankMathSEO}
        canonical={BANGALORE_OFFICE_CABIN_URL}
        fallbackTitle={BANGALORE_OFFICE_CABIN_SEO_TITLE}
        fallbackDescription={BANGALORE_OFFICE_CABIN_META_DESCRIPTION}
        fallbackCanonical={BANGALORE_OFFICE_CABIN_URL}
        fallbackOgTitle={BANGALORE_OFFICE_CABIN_SEO_TITLE}
        fallbackOgDescription={BANGALORE_OFFICE_CABIN_META_DESCRIPTION}
        fallbackOgImage={`https://www.samanportable.com${BANGALORE_OFFICE_CABIN_HERO_IMAGE}`}
        author=""
        publisher=""
        structuredData={BANGALORE_OFFICE_CABIN_SCHEMA}
      />

      <main className="min-h-screen bg-background">
        <section className="bg-[#0A3D2A] text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="max-w-4xl">
              <nav className="text-sm text-white/75 mb-8" aria-label="Breadcrumb">
                Home › Bangalore › Portable Office Cabin Manufacturer
              </nav>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
                Portable Office Cabin Manufacturer in Bangalore
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                SAMAN manufactures portable office cabins at its own unit in Gopasandra, Bengaluru, for construction sites, factories, warehouses, institutions and commercial projects across Bangalore. We build site office cabins for project durations. We build modular office cabins that reconfigure as a team grows, and prefab office cabins for permanent commercial use. Each unit leaves the factory with insulated wall and roof panels, wiring, flooring, doors and windows already fitted. Our Bangalore team handles layout confirmation, fabrication, delivery and placement. Tell us your size, layout and site location for a factory-direct quotation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-[#0A3D2A] hover:bg-white/90" asChild>
                  <a href="https://www.samanportable.com/contact">Get a factory-direct quote</a>
                </Button>
                <Button size="lg" variant="heroOutline" asChild>
                  <a href="tel:+918861622859">Call +91 88616 22859</a>
                </Button>
              </div>
              <div className="mt-10 overflow-hidden rounded-lg border border-white/15 shadow-2xl">
                <Image
                  src={BANGALORE_OFFICE_CABIN_HERO_IMAGE}
                  alt={BANGALORE_OFFICE_CABIN_HERO_ALT}
                  width={1344}
                  height={756}
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-white">
          <div className="max-w-7xl mx-auto container-padding py-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 text-sm font-medium text-foreground">
              <div>Own manufacturing unit · Gopasandra, Bengaluru 560099</div>
              <div>ISO 9001:2015 · 14001:2015 · 45001:2018 certified</div>
              <div>Free delivery inside Bangalore city limits</div>
              <div>7 to 21 working days from drawing approval</div>
              <div>Mon–Sat, 9:00 am to 8:00 pm · +91 88616 22859</div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto container-padding py-12 sm:py-16 space-y-14">
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Portable Office Cabins Built at Our Gopasandra Unit</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Our Bangalore unit at Sy No 34/2, Gopasandra, Karnataka 560099 fabricates complete cabins rather than assembling bought-in shells. The frame is cut, welded and squared on our own jigs, then panelled, wired and finished under one roof. Fabrication and finishing happen in the same building. A layout change requested mid-build therefore stays in-house, and the schedule holds.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Buyers are welcome to inspect a unit in progress before dispatch. Most Bangalore customers who visit come at the panelling stage, when the frame, the wall build-up and the electrical routing are all still visible. That is the right moment to check what you are buying. A finished cabin, closed up, shows you far less.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Our Gopasandra unit serves Bangalore city and the surrounding industrial belt directly. Our second unit at Jalpura, Greater Noida covers the north zone. A company running sites in both regions orders to one specification and receives matching cabins in each city.</p>
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <iframe
                src={BANGALORE_OFFICE_CABIN_MAP_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SAMAN POS India Private Limited Gopasandra unit map"
                className="h-full w-full"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Site Office Cabin, Modular Office Cabin or Prefab Office Cabin</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Three different buyers arrive at this page, and they need different cabins.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">A site office cabin is bought for the duration of a project. It will be craned onto uneven ground, used hard for eighteen months, then lifted and moved to the next site. Here the frame and the base matter more than the finish. A cabin that takes repeated lifting without racking beats one with a better interior.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">A modular office cabin is bought when the team size is not settled. Two or three units are placed side by side and joined, and a fourth is added later. This only works if the cabins share one module from the outset. We therefore fix the module at the drawing stage, not at delivery.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">A prefab office cabin is bought as a permanent building. It sits on a prepared plinth, it is wired into the mains rather than a generator, and it is specified for daily occupancy over years. Insulation, ventilation and finish quality carry the most weight in this configuration.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Small requirements are common in Bangalore. Our smallest standard unit is 10 by 10 feet at 100 square feet. It suits a one or two-person site office, a security-cum-supervisor cabin or a compact sales office.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Choosing a Site Office Cabin Size for Your Bangalore Project</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Size selection starts with use, not with a catalogue. A contractor asking for a site office cabin may need one table, two visitor chairs and a drawing rack. A factory may need a supervisor desk, a small records area and air-conditioning. A sales office may need a front-facing counter and enough open space for customers to stand without blocking the door.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">The first constraint is width. A 10-foot width is easy to move through most Bangalore industrial roads and works well for single-room site cabins. A 12-foot width gives better internal movement and is preferred where the cabin will be used for longer working hours. Length then decides whether the cabin remains a compact office or becomes a divided unit with meeting, store or pantry space.</p>
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-muted/60">
                    <th className="p-3 font-semibold text-foreground">Common size</th>
                    <th className="p-3 font-semibold text-foreground">Typical Bangalore use</th>
                    <th className="p-3 font-semibold text-foreground">Layout note</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 text-muted-foreground">10 x 10 ft</td>
                    <td className="p-3 text-muted-foreground">Compact site office, security-cum-supervisor cabin, small sales office</td>
                    <td className="p-3 text-muted-foreground">Keep furniture light and avoid inward door conflicts</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">20 x 10 ft</td>
                    <td className="p-3 text-muted-foreground">Project office, billing office, site coordination room</td>
                    <td className="p-3 text-muted-foreground">Allows a desk zone and visitor zone in one room</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">30 x 10 ft</td>
                    <td className="p-3 text-muted-foreground">Larger construction office, factory admin cabin, records office</td>
                    <td className="p-3 text-muted-foreground">Can take a partition if the door and window positions are planned early</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">40 x 10 ft or 40 x 12 ft</td>
                    <td className="p-3 text-muted-foreground">Extended office, meeting room, combined admin and site control cabin</td>
                    <td className="p-3 text-muted-foreground">Route access and crane placement should be checked before quotation</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">Do not decide only by asking how many people can sit inside. Desks, files, electrical points, AC location, visitor movement and the door swing all change the usable space. A 20 x 10 ft office cabin can feel larger than a poorly planned 30 x 10 ft unit if the furniture and openings are set correctly.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Occupancy depends on the internal layout you approve, not on floor area alone. We confirm the working headcount against your drawing before quoting.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What a Portable Office Cabin Really Costs in Bangalore</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Search for a portable office cabin in Bangalore. On one screen you will see the same product at nine hundred rupees and at seven and a half lakh. Both figures are real. Neither is a price.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">The low numbers are almost always a rate per square foot, or a component price, entered into a marketplace field meant for a unit price. Take a listing showing nine hundred rupees for a thirty-by-ten cabin. That is three hundred square feet at the rate, or two lakh seventy thousand for the shell. The very low figures, in the one to fifteen thousand range, are usually a single panel or a door.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">What changes a real quotation in Bangalore is straightforward. Floor area sets the base. The wall and roof build-up moves it next, because an insulated panel cabin and a plain sheeted cabin are different products with similar photographs. After that come the openings, the electrical load, the flooring, and whether the site needs a crane. The per-square-foot rate falls as the cabin gets larger, so a forty-by-ten unit does not cost four times a ten-by-ten.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">We publish a <Link href="/product/portable-office" className="text-green-700 underline underline-offset-4 hover:text-green-900">full size and price ladder</Link> rather than a single headline number, and we quote against a drawing you have approved.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Portable Office Cabin, Container Office or Porta Cabin</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Many Bangalore buyers compare these terms before they enquire. They are related, but they should not be bought as if they mean the same thing.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">A portable office cabin is the right search when the primary requirement is a working office: a finished room with insulation, wiring, door and window positions, flooring and a layout that suits day-to-day staff use. A container office usually starts from a container-style shell or heavy-duty steel module and is chosen where rugged transport, stacking feel or container aesthetics matter. A porta cabin is the broadest market term and can refer to office cabins, guard rooms, toilets, stores, kiosks and several other portable structures.</p>
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-muted/60">
                    <th className="p-3 font-semibold text-foreground">Buyer term</th>
                    <th className="p-3 font-semibold text-foreground">Best fit</th>
                    <th className="p-3 font-semibold text-foreground">What to check before ordering</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 text-muted-foreground">Portable office cabin</td>
                    <td className="p-3 text-muted-foreground">Site office, modular office, prefab office, sales office, admin cabin</td>
                    <td className="p-3 text-muted-foreground">Layout, insulation, electrical load, flooring, delivery access and warranty</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Container office</td>
                    <td className="p-3 text-muted-foreground">Heavy-duty steel office module or container-style workspace</td>
                    <td className="p-3 text-muted-foreground">Shell type, weight, lifting points, corrosion protection and internal finish</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Porta cabin</td>
                    <td className="p-3 text-muted-foreground">General portable structure requirement</td>
                    <td className="p-3 text-muted-foreground">Whether the quotation is for an office cabin, toilet, guard room, store or another category</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">If your requirement is a heavy-duty steel workspace, compare our <a href="https://www.samanportable.com/container-office-in-bangalore" className="text-green-700 underline underline-offset-4 hover:text-green-900">container office in Bangalore</a> page. If you are still at the broad category stage, the <a href="https://www.samanportable.com/portacabins-for-sale-in-bangalore" className="text-green-700 underline underline-offset-4 hover:text-green-900">porta cabins for sale in Bangalore</a> page explains the wider product family.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">This page stays focused on office cabin manufacturing. We do not mix price ladders, size ladders or technical specifications for the other two product categories here because that creates the wrong comparison and makes quoting less clear.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Delivery, Crane Placement and Site Access in Bangalore</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">This is where most Bangalore orders succeed or go wrong, and it is worth reading before you order.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Standard delivery within Bangalore city limits is included for our standard cabin sizes to accessible sites. Fabrication and delivery normally take 7 to 21 working days from drawing approval. Crane hire, night-movement permits and restricted-access sites are quoted separately.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">A cabin up to twenty feet travels on a standard trailer. Anything longer, or any double-storey unit, needs a route check before we confirm a date. Inside Bangalore the constraints are consistent: the older central areas have narrow approaches and low cable spans, several arterial roads restrict heavy vehicles during the day so placement is scheduled at night, and a number of industrial and tech-park sites require gate passes arranged in advance.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Your side of the work is short but not optional. The cabin needs a level, compacted base that will carry it without settling. The crane needs standing room and clear overhead space above the final position. Someone with authority to accept the unit should be on site at the delivery window. A cabin that cannot be placed on arrival still occupies the trailer.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">We confirm all of this on a call before dispatch rather than at the gate. Tell us the site address and the access at enquiry stage and the placement plan comes back with the quotation.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Delivering a Site Office Cabin Across Bangalore&apos;s Industrial Corridors</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Bangalore delivery is not one route. A cabin going to Peenya, Jigani, Bommasandra, Electronic City, Hoskote, Nelamangala, Whitefield, Devanahalli or Bidadi faces different access limits. Some sites are easy during the day. Some are better handled at night. Some industrial parks allow a trailer inside only after security paperwork is completed.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">For that reason we ask for the exact delivery point before confirming dispatch. A Google Maps pin helps, but it is not enough by itself. We also need the gate width, the turning radius near the final location, the overhead clearance and the distance from the unloading point to the prepared base.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">If the cabin has to be placed over a compound wall, between sheds or beside an active production area, the crane plan changes. A small crane may reach the gate but fail at the final lift. A larger crane may need road permission or a night slot. We prefer to catch that before the cabin leaves Gopasandra.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Sites outside Bangalore city limits are handled from the same unit. The quotation separates the cabin cost from additional freight or route-specific placement cost so the buyer can see what belongs to manufacturing and what belongs to transport.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Specifying a Prefab Office Cabin for Bangalore Site Conditions</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">A prefab office cabin used in Bangalore should be specified for heat, rain, dust and long working hours. The wall and roof panel decide how comfortable the office remains in the afternoon. The false ceiling and air-conditioning point decide whether cooling is practical. The window position decides whether daylight helps the room or creates glare on desks and screens.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">For construction sites, we usually prioritise a stronger base frame, practical flooring and easy-to-clean internal surfaces. For factories and warehouses, electrical load, earthing route and dust control become more important. For sales or customer-facing cabins, the visible finish, front glazing, signboard provision and visitor movement matter more than they would on a back-office site cabin.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Bangalore sites also vary by season. A cabin placed before the monsoon needs drainage around the base so water does not stand below the floor. A cabin beside a dusty yard needs window placement and cleaning access planned from the start. These are small decisions during drawing approval, but they decide how the cabin feels after three months of daily use.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">The right specification is therefore not the most expensive one. It is the one that matches the cabin&apos;s working environment. When you share the site use, we can recommend where to spend and where not to overbuild.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Portable Office Cabin Sizes, Materials and Technical Options</h2>
            <p className="text-lg text-muted-foreground leading-relaxed"><Link href="/product/portable-office" className="text-green-700 underline underline-offset-4 hover:text-green-900">Nine standard sizes</Link> run from 10 by 10 feet at 100 square feet to 40 by 12 feet at 480 square feet, all at 8.5 feet height, and we build to custom dimensions where a site demands it. The standard build is a mild steel frame to IS 2062 with insulated sandwich panel walls and roof, an 18 mm Bison panel floor base finished in 1.3 mm vinyl, a false ceiling, full internal wiring with a switchboard, and an air-conditioning connection point. Door and window positions are set on your drawing, not fixed by a catalogue. Internal partitions, toilet and pantry compartments, and double-storey configurations are available as options.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">Every unit carries a five-year structural warranty on the frame and base, with one-year warranty on finishing.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Your Quotation Includes and What It Does Not</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">A clear office cabin quotation should separate manufacturing scope from site scope. This avoids the common misunderstanding where the buyer expects civil work, crane work or external power connection to be included in the cabin price.</p>
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-muted/60">
                    <th className="p-3 font-semibold text-foreground">Scope item</th>
                    <th className="p-3 font-semibold text-foreground">Usually included in cabin quote</th>
                    <th className="p-3 font-semibold text-foreground">Usually buyer/site scope unless named</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 text-muted-foreground">Cabin frame, wall panels, roof and floor base</td>
                    <td className="p-3 text-muted-foreground">Yes</td>
                    <td className="p-3 text-muted-foreground">No</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Internal wiring, switchboard and AC point</td>
                    <td className="p-3 text-muted-foreground">Yes, as per approved drawing</td>
                    <td className="p-3 text-muted-foreground">External power supply and mains connection</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Doors, windows, flooring and false ceiling</td>
                    <td className="p-3 text-muted-foreground">Yes, as specified</td>
                    <td className="p-3 text-muted-foreground">Changes after approval unless revised in writing</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Delivery inside Bangalore city limits</td>
                    <td className="p-3 text-muted-foreground">Yes, for standard sizes to accessible sites</td>
                    <td className="p-3 text-muted-foreground">Restricted access, special permits or waiting charges</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Crane placement</td>
                    <td className="p-3 text-muted-foreground">Only if named in quotation</td>
                    <td className="p-3 text-muted-foreground">Buyer scope by default</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Ground preparation, plinth and approvals</td>
                    <td className="p-3 text-muted-foreground">No</td>
                    <td className="p-3 text-muted-foreground">Buyer/site scope</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">If you want any buyer-scope item handled by us, ask before quotation. We can price it where practical, but it must be written into the order. Spoken assumptions at delivery do not help either side.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Buyers Choose an Office Cabin Manufacturer in Bangalore</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">As an office cabin manufacturer in Bangalore rather than a reseller, we control the parts of the job that usually slip. That is the practical difference on most enquiries. The frame specification is ours and so is the fabrication schedule. A mid-build change is a conversation with the shop floor, not a renegotiation with a supplier.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">The company is certified to ISO 9001:2015 for quality management, ISO 14001:2015 for environmental management and ISO 45001:2018 for occupational health and safety. It is also NSIC enlisted, DPIIT startup recognised and Udyam registered. That matters when a cabin is bought through corporate or government procurement, where vendor documentation is checked.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">We would rather lose an enquiry at the quotation stage than at the gate, so we say what is not included: ground preparation, civil plinth work, crane hire outside standard placement, external power connection and statutory site approvals remain with the buyer unless the quotation names them.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Portable Office Cabin Questions From Bangalore Buyers</h2>
            <div className="space-y-4">
              {BANGALORE_OFFICE_CABIN_FAQS.map((faq) => (
                <div key={faq.question} className="rounded-lg border bg-card p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8 rounded-lg border bg-muted/30 p-6 sm:p-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Get a Factory-Direct Quote From Our Bangalore Team</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">Send us the cabin size or the floor area you need, how many units, the layout including door, window and partition positions, the delivery address, and the date you need it on site. A quotation comes back against those five inputs. Unsure of the size? Tell us how many people will use the cabin and what else must fit inside. We will propose one.</p>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-foreground">Phone</dt>
                  <dd><a href="tel:+918861622859" className="text-green-700 underline underline-offset-4 hover:text-green-900">+91 88616 22859</a></dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Hours</dt>
                  <dd className="text-muted-foreground">Monday to Saturday, 9:00 am to 8:00 pm</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Unit</dt>
                  <dd className="text-muted-foreground">Sy No 34/2, Gopasandra, Bengaluru, Karnataka 560099</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Directions</dt>
                  <dd><a href={BANGALORE_OFFICE_CABIN_DIRECTIONS} className="text-green-700 underline underline-offset-4 hover:text-green-900" target="_blank" rel="noopener noreferrer">Google Maps</a></dd>
                </div>
              </dl>
              <Button size="lg" asChild>
                <Link href="/contact">Request a quote</Link>
              </Button>
            </div>
            <QuoteForm variant="default" />
          </section>

          <nav className="border-t pt-8" aria-label="Local links">
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/product/portable-office" className="rounded-lg border bg-card p-4 font-medium text-foreground hover:text-green-700 transition-colors">Portable office cabin sizes, prices and specifications</Link>
              <Link href="/portable-cabin-price-in-bangalore" className="rounded-lg border bg-card p-4 font-medium text-foreground hover:text-green-700 transition-colors">Portable cabin prices in Bangalore</Link>
              <Link href="/contact" className="rounded-lg border bg-card p-4 font-medium text-foreground hover:text-green-700 transition-colors">Contact our Bangalore team</Link>
            </div>
          </nav>
        </div>
      </main>
    </Layout>
  );
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

  if (slug === BANGALORE_OFFICE_CABIN_SLUG) {
    return <BangalorePortableOfficeCabinLanding rankMathSEO={rankMathSEO} />;
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
      'owning-a-porta-cabin-is-perfect': '/hero-image/saman-portable-office-cabin-bangalore.webp',
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

          // City/geo landing pages: emit exactly three schemas
          // (Organization + BreadcrumbList + FAQPage), no LocalBusiness/Product.
          if (CITY_PAGE_SCHEMA_SLUGS.has(slug)) {
            return getCityPageGraph({
              url: `https://www.samanportable.com/${slug}`,
              breadcrumbs: [
                { name: 'Home', url: 'https://www.samanportable.com/' },
                CONTAINER_OFFICE_CITY_SLUGS.has(slug)
                  ? { name: 'Container Offices', url: 'https://www.samanportable.com/product/container-offices' }
                  : { name: 'Porta Cabins', url: 'https://www.samanportable.com/product/porta-cabins' },
                { name: decodeHtmlEntities(post.title.rendered), url: `https://www.samanportable.com/${slug}` },
              ],
              faqSchema: getFAQSchemaOverride(slug) || extractFAQSchema(post.content.rendered),
              contactTelephone: NORTH_CITY_PAGE_SLUGS.has(slug) ? ['+91 87960 39938', '+91 97089 89937'] : undefined,
            });
          }

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
            faqSchema: getFAQSchemaOverride(slug) || extractFAQSchema(post.content.rendered),
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
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
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

            {/* Featured Image — suppressed for city/geo landing pages, which carry
                their hero as the first in-body content image (eager LCP) instead, so
                the template block does not duplicate it or show a wrong fallback. */}
            {featuredImage && !CITY_PAGE_SCHEMA_SLUGS.has(slug) && (
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
