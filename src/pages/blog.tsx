import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, Tag, ArrowRight, Clock } from 'lucide-react';
import { pageSEO, siteConfig } from '@/config/seo';
import BlogImage from '@/components/BlogImage';
import { decodeHtmlEntities } from '@/lib/utils';
import redirectedPageDestinations from '@/lib/redirectedPageDestinations.json';
import {
  BlogPaginationModel,
  BlogListingQuery,
  buildBlogPageHref,
  buildBlogPageWindow,
  computeBlogPagination,
} from '@/lib/blogPagination';

import { BlogPost as ApiBlogPost } from '@/config/api';
type BlogPost = ApiBlogPost;
const navigablePostPath = (slug: string) =>
  (redirectedPageDestinations as Record<string, string>)[slug] || `/${slug}`;
const BLOG_POSTS_PER_PAGE = 10;

// Reading time computed server-side (matches the previous in-component getReadingTime logic:
// 200 wpm). Computing it here lets us strip the full `content.rendered` from the returned props
// so large post bodies are no longer serialized into __NEXT_DATA__ (Large HTML fix).
function computeReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = (content || '').replace(/<[^>]*>/g, '').split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Listing cards deliberately use a compact server-prop projection. WordPress post
// exports contain large SEO/head/link payloads that are not rendered by this page;
// serializing them into __NEXT_DATA__ duplicates content and depresses the text/HTML
// ratio, especially on category pagination.
type BlogCardPost = {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  readingTime: number;
  _embedded?: {
    author?: Array<{ name: string }>;
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text?: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string; taxonomy: string }>>;
  };
};

// Per-category unique title + meta description. When a visitor lands on a category
// filter (e.g. /blog?category=porta-cabins) we serve a unique, self-canonical title
// and meta so category filter pages no longer duplicate the main blog hub's SEO.
const CATEGORY_SEO: Record<string, { title: string; meta: string }> = {
  'case-studies': {
    title: 'Porta Cabin & Prefab Project Case Studies | SAMAN',
    meta: 'Real project case studies from SAMAN: porta cabins, container offices, prefab labour colonies and industrial sheds delivered across India. Read how we built it.',
  },
  'company-updates': {
    title: 'SAMAN Portable Company News & Updates',
    meta: 'Latest updates from SAMAN POS India Pvt Ltd: new products, factory news, ISO certifications and prefab industry developments from our Bangalore and Noida factories.',
  },
  'container-cafe': {
    title: 'Container Cafe Ideas, Designs & Guides | SAMAN',
    meta: 'Articles on container cafes and coffee kiosks from SAMAN: design ideas, sizes, steel construction details and real project examples for highways, campuses and QSR outlets.',
  },
  'container-offices': {
    title: 'Container Office Articles & Buyer Guides | SAMAN',
    meta: "Read SAMAN's container office articles: sizes, MS frame specs, price factors, site office uses and delivery details. Written by India's prefab steel structure manufacturer.",
  },
  'design-customization': {
    title: 'Prefab Design & Customisation Guides | SAMAN Portable',
    meta: 'Guides on customising SAMAN prefab structures: layouts, cladding options, PUF panel insulation, electrical points, plumbing and colour finishes. Call for your requirement.',
  },
  'electronic-city': {
    title: 'Portable Cabins & Site Offices for Electronic City',
    meta: 'SAMAN articles on portable cabins and prefab site offices for Electronic City, Bangalore, dispatched from our Gopasandra factory. Fast delivery, MS frame construction.',
  },
  'industrial-shed': {
    title: 'Industrial Shed & Warehouse Articles | SAMAN Portable',
    meta: 'Articles on prefab industrial sheds and warehouses from SAMAN: steel frame spans, GI sheet cladding, purlin design, cost factors and project delivery across India.',
  },
  'industry-news': {
    title: 'Prefab & Modular Construction Industry News | SAMAN',
    meta: "Stay updated on India's prefab and modular construction industry. Material trends, IS code updates, project delivery insights and market news from SAMAN's editorial team.",
  },
  'labor-colony': {
    title: 'Labour Colony & Worker Housing Articles | SAMAN',
    meta: 'Articles on prefab labour colonies from SAMAN: MS hollow section frames, PUF panel rooms, toilet blocks, site planning and fast deployment for construction projects.',
  },
  'porta-cabins': {
    title: 'Porta Cabin Articles, Guides & Price Insights | SAMAN',
    meta: "Read SAMAN's porta cabin articles: buyer guides, size options, MS frame specs, price factors and real project insights from India's ISO-certified prefab manufacturer.",
  },
  'portable-buildings': {
    title: 'Portable Building Articles & Guides | SAMAN Portable',
    meta: 'Guides on portable and modular buildings from SAMAN: site offices, prefab classrooms, temporary showrooms and custom portable steel structures for Indian B2B buyers.',
  },
  'prefab-buildings': {
    title: 'Prefab Building Articles & Modular Construction Guides | SAMAN',
    meta: 'SAMAN prefab building articles on factory-built commercial, office and industrial structures, including modular construction methods, cost factors and project planning.',
  },
  'portable-construction': {
    title: 'Portable Construction Solutions: Articles | SAMAN',
    meta: 'Articles on portable construction site solutions from SAMAN: site offices, toilet cabins, labour hutments and security cabins dispatched from Bangalore and Greater Noida.',
  },
  'prefab-solutions': {
    title: 'Prefab Solutions Articles & Technical Guides | SAMAN',
    meta: 'Technical articles on SAMAN prefab solutions: steel fabrication methods, sandwich panel systems, anchor bolt erection, weld specs and customisation for B2B buyers.',
  },
  'tips-guides': {
    title: 'Prefab Buyer Tips & Planning Guides | SAMAN Portable',
    meta: "Practical tips for buying portable cabins, prefab offices and modular structures in India: size selection, site prep, delivery planning and installation by SAMAN's team.",
  },
  'uncategorized': {
    title: 'Prefab & Portable Cabin Articles | SAMAN Portable',
    meta: 'Articles on portable cabins, prefab structures and modular steel buildings from SAMAN POS India Pvt Ltd. ISO 9001:2015 certified manufacturer in Bangalore and Greater Noida.',
  },
};

// Per-category visible intro paragraph. Rendered above the post list on a
// category filter page so each category page carries unique on-page content
// (duplicate-content fix). Shown ONLY when ?category= is active.
const CATEGORY_INTRO: Record<string, string> = {
  'porta-cabins': "Browse SAMAN's porta cabin articles, written by our manufacturing team in Bangalore. Find buyer guides on MS frame sizes, price factors, customisation options and real project examples from construction sites, factories and campuses across India.",
  'container-offices': "SAMAN's container office articles cover everything a B2B buyer needs: 10ft to 40ft sizes, MS hollow section frame specs, PUF panel insulation, electrical fitouts, site office applications and delivery timelines from our Greater Noida and Bangalore factories.",
  'container-cafe': "SAMAN's container cafe articles cover design ideas, size options, steel fabrication details and real project examples. Whether you need a highway kiosk, campus coffee counter or a multi-unit QSR setup, find practical guidance here from India's prefab steel structure manufacturer.",
  'industrial-shed': 'Browse articles on prefab industrial sheds and warehouses from SAMAN. IS 2062 steel frame construction, GI sheet and polycarbonate cladding, purlin and girt design, foundation requirements and project cost factors for factories, storage yards and logistics centres across India.',
  'labor-colony': "SAMAN's labour colony articles cover prefab worker housing design: MS hollow section frame rooms, PUF panel insulation, attached toilet blocks, common kitchen units and site layout planning. Find guidance on fast deployment for construction projects, infrastructure sites and industrial campuses.",
  'design-customization': "SAMAN's design and customisation articles help you plan the right prefab structure for your site. Explore layout options, cladding choices, PUF and cement board panels, electrical point configurations, plumbing fitouts and colour finishes, all customised to your requirement and dispatched from our Bangalore or Greater Noida factory.",
  'prefab-solutions': "Technical articles on SAMAN's prefab solutions: covering MS frame fabrication, sandwich panel and PUF insulation systems, anchor bolt and base plate erection, weld quality standards and customisation options for Indian B2B buyers across construction, manufacturing and infrastructure sectors.",
  'portable-buildings': "SAMAN's portable building articles cover modular steel structures for a wide range of uses: construction site offices, prefab classrooms, temporary showrooms, portable health centres and custom buildings. Find size guides, material specs and deployment advice for Indian B2B buyers.",
  'prefab-buildings': "Browse SAMAN's prefab building articles for practical guidance on factory-built offices, commercial buildings, modular workspaces and industrial prefab structures. These posts focus on construction methods, planning tradeoffs and buyer questions that sit alongside the main prefab building product range.",
  'portable-construction': "Find articles on SAMAN's full range of portable construction site solutions: MS frame site offices, portable toilet cabins, prefab labour hutments and steel security cabins. All units dispatched from our Bangalore and Greater Noida factories with 3–5 day transit and ₹3,000 standard delivery.",
  'industry-news': "Stay current with India's prefab and modular construction industry. Steel material trends, IS code developments, government infrastructure project updates and market insights. Articles written and curated by SAMAN's team with 15+ years in prefab steel structure manufacturing.",
  'tips-guides': "Practical buying guides from SAMAN's manufacturing team: how to select the right size porta cabin, prepare your site for delivery, plan electrical and plumbing fitouts, understand price factors and get your prefab structure installed correctly the first time.",
  'case-studies': 'Real project case studies from SAMAN: see how we designed, fabricated and delivered porta cabins, container offices, prefab labour colonies and industrial sheds for clients across India. Each case study covers the brief, the build specs and the delivery outcome.',
  'company-updates': 'Latest news from SAMAN POS India Pvt Ltd: new product launches, factory capacity updates, ISO certification milestones and company announcements from our Bangalore (560099) and Greater Noida (201308) manufacturing units.',
  'electronic-city': "Articles on portable cabins and prefab site offices for Electronic City, Bangalore: covering MS frame construction, sizes, price factors and delivery. All units dispatched from SAMAN's Gopasandra factory in Bangalore Urban (560099) with fast turnaround for South Bangalore sites.",
  'uncategorized': 'Articles on portable cabins, prefab structures and modular steel buildings from SAMAN POS India Pvt Ltd. ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018 certified manufacturer with factories in Bangalore and Greater Noida serving buyers across India.',
};

function postMatchesCategory(post: BlogPost, categorySlug: string): boolean {
  const terms = post._embedded?.['wp:term']?.[0] || [];
  return (
    terms.some((term: any) => term?.taxonomy === 'category' && term?.slug === categorySlug) ||
    (post as any).class_list?.includes(`category-${categorySlug}`)
  );
}

// Slice a FILTERED collection using the shared pagination model, so the rendered
// slice and every pagination control are derived from the same numbers.
function paginatePosts(posts: BlogPost[], page: number, perPage: number) {
  const pagination = computeBlogPagination(posts.length, perPage, page);
  return {
    posts: posts.slice(pagination.startIndex, pagination.endIndex),
    pagination,
  };
}

function getPaginatedBlogDescription(page: number): string {
  return `Explore page ${page} of the SAMAN Portable blog for practical articles on portable cabins, prefab buildings, modular offices, PEB structures, and steel solutions.`;
}

function getPaginatedTitle(title: string, page: number): string {
  if (page <= 1) return title;
  const pipeIndex = title.lastIndexOf('|');
  if (pipeIndex === -1) return `${title} - Page ${page}`;
  return `${title.slice(0, pipeIndex).trim()} - Page ${page} ${title.slice(pipeIndex).trim()}`;
}

function getPaginatedCategoryDescription(title: string, page: number): string {
  const topic = title.replace(/\s*\|\s*SAMAN(?: Portable)?\s*$/i, '').trim();
  return `Browse page ${page} of ${topic} from SAMAN, with more buyer guides, pricing notes and project insights for Indian prefab buyers.`;
}

interface BlogProps {
  posts: BlogCardPost[];
  /** The one shared pagination model every control on this page reads from. */
  pagination: BlogPaginationModel;
  categories: Array<{ id: number; name: string; slug: string; count: number }>;
  tags: Array<{ id: number; name: string; slug: string; count: number }>;
  seoCanonical: string;
  hreflangSelf: string;
  seoNoindex: boolean;
  seoRouteBehavior: string;
  seoTitle: string;
  seoDescription: string;
  seoCategoryIntro: string | null;
  /** Active filter parameters, carried across every pagination href. */
  listingQuery: BlogListingQuery;
}

export const getServerSideProps: GetServerSideProps<BlogProps> = async ({ query }) => {
  try {
    const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
    const hasExplicitPage = typeof rawPage === 'string' && rawPage.length > 0;

    if (hasExplicitPage && !/^[1-9]\d*$/.test(rawPage)) {
      return { notFound: true };
    }

    const parsedPage = hasExplicitPage ? parseInt(rawPage, 10) : 1;
    const page = Number.isFinite(parsedPage) ? parsedPage : 1;
    const category = Array.isArray(query.category) ? query.category[0] : query.category;
    const tag = Array.isArray(query.tag) ? query.tag[0] : query.tag;

    console.log('Blog getServerSideProps: Starting to fetch blog posts...');

    const postsPerPage = BLOG_POSTS_PER_PAGE;
    const cleanCategory = category?.trim().toLowerCase();
    const cleanTag = tag?.trim();

    // Fetch blog posts with pagination - reduced to 10 posts per page for better performance.
    // Static content layer: reads exported post files — no WordPress call.
    const { fetchBlogPosts } = await import('@/lib/staticContent');
    const unfiltered = await fetchBlogPosts(page, postsPerPage);

    // ONE pagination model per request, always derived from the collection that
    // is actually rendered. The unfiltered listing starts as the default; an
    // active category filter replaces it with the filtered collection's model.
    let pagePosts: BlogPost[] = unfiltered.posts;
    let pagination: BlogPaginationModel = computeBlogPagination(
      unfiltered.pagination.totalPosts || 0,
      postsPerPage,
      page
    );
    let categoryHasMatchingPosts = false;

    if (cleanCategory) {
      const allPostsResult = await fetchBlogPosts(1, 10000);
      const matchingPosts = allPostsResult.posts.filter((post: BlogPost) => postMatchesCategory(post, cleanCategory));

      if (matchingPosts.length > 0) {
        categoryHasMatchingPosts = true;
        const filtered = paginatePosts(matchingPosts, page, postsPerPage);
        pagePosts = filtered.posts;
        pagination = filtered.pagination;
      }
    }

    // A syntactically valid page number outside the available result set is a
    // missing resource, not an empty listing. This prevents blank HTTP 200 pages
    // for crawlers while retaining deterministic SSR for every valid page.
    if (page > pagination.totalPages || (page > 1 && pagePosts.length === 0)) {
      return { notFound: true };
    }

    console.log('Blog getServerSideProps: Result:', {
      postsCount: pagePosts.length,
      pagination,
    });

    // In a real implementation, you would fetch categories and tags from WordPress
    const categories = [
      { id: 1, name: 'Portable Construction', slug: 'portable-construction', count: 15 },
      { id: 2, name: 'Industry News', slug: 'industry-news', count: 8 },
      { id: 3, name: 'Case Studies', slug: 'case-studies', count: 12 },
      { id: 4, name: 'Tips & Guides', slug: 'tips-guides', count: 20 },
      { id: 5, name: 'Company Updates', slug: 'company-updates', count: 6 },
      { id: 6, name: 'Prefab Buildings', slug: 'prefab-buildings', count: 1 }
    ];

    const tags = [
      { id: 1, name: 'Porta Cabins', slug: 'porta-cabins', count: 25 },
      { id: 2, name: 'Container Offices', slug: 'container-offices', count: 18 },
      { id: 3, name: 'Prefab Solutions', slug: 'prefab-solutions', count: 22 },
      { id: 4, name: 'Bangalore', slug: 'bangalore', count: 30 },
      { id: 5, name: 'Construction', slug: 'construction', count: 35 }
    ];

    const blogCanonicalBase = `${siteConfig.url}/blog`;
    let seoNoindex = false;
    let seoRouteBehavior = 'indexable blog hub';
    const hasMatchingCategoryPosts = Boolean(cleanCategory && categoryHasMatchingPosts);

    // Canonical strategy (duplicate-content fix):
    //  - category filter -> self-canonical, so each category is its own indexable page
    //  - tag filter       -> canonical back to /blog hub (no unique content for tags)
    //  - valid pagination -> self-canonical because each page has a different post slice
    //  - plain /blog      -> /blog
    let seoCanonical = blogCanonicalBase;

    // Derived once from the shared model, then reused by canonical, hreflang and
    // title/meta selection so those three can never disagree about validity.
    const hasValidPaginatedSlice =
      page > 1 && page <= pagination.totalPages && pagePosts.length > 0;

    if (cleanCategory && hasMatchingCategoryPosts) {
      seoCanonical = `${blogCanonicalBase}?category=${encodeURIComponent(cleanCategory)}`;
      if (hasValidPaginatedSlice) {
        seoCanonical = `${seoCanonical}&page=${encodeURIComponent(String(page))}`;
        seoRouteBehavior = 'indexable paginated category filter (self-canonical)';
      } else if (page > 1) {
        seoNoindex = true;
        seoRouteBehavior = 'out-of-range category pagination noindexed and canonicalized to category page one';
      } else {
        seoRouteBehavior = 'indexable category filter (self-canonical)';
      }
    } else if (cleanCategory) {
      seoNoindex = true;
      seoRouteBehavior = 'unknown category filter canonicalized to blog hub';
    } else if (cleanTag) {
      seoRouteBehavior = 'tag filter canonicalized to blog hub';
    } else if (hasExplicitPage && page <= 1) {
      seoRouteBehavior = 'page 0/1 canonicalized to blog hub';
    } else if (hasValidPaginatedSlice) {
      seoCanonical = `${blogCanonicalBase}?page=${encodeURIComponent(String(page))}`;
      seoRouteBehavior = 'indexable paginated blog listing (self-canonical)';
    } else if (page > 1) {
      seoNoindex = true;
      seoRouteBehavior = 'out-of-range pagination noindexed and canonicalized to blog hub';
    }

    // Self-referencing hreflang follows the normalized canonical URL policy.
    // That keeps ?page=1 variants out of alternates while preserving real page 2+ URLs.
    let hreflangSelf = blogCanonicalBase;
    if (cleanCategory && hasMatchingCategoryPosts) {
      hreflangSelf = seoCanonical;
    } else if (cleanTag) {
      hreflangSelf = `${blogCanonicalBase}?tag=${encodeURIComponent(cleanTag)}`;
    } else if (hasValidPaginatedSlice) {
      hreflangSelf = seoCanonical;
    }

    // Title / meta selection: category -> unique per-category; paginated URLs
    // include the page number so Ahrefs/Google do not see page 2+ listings as
    // duplicate title/description variants of page one.
    const categorySeo = cleanCategory && hasMatchingCategoryPosts ? CATEGORY_SEO[cleanCategory] : undefined;
    const seoTitle = getPaginatedTitle(categorySeo?.title || pageSEO.blog.title, hasValidPaginatedSlice ? page : 1);
    const seoDescription = categorySeo
      ? (hasValidPaginatedSlice ? getPaginatedCategoryDescription(categorySeo.title, page) : categorySeo.meta)
      : (
        !cleanCategory && !cleanTag && hasValidPaginatedSlice
          ? getPaginatedBlogDescription(page)
          : pageSEO.blog.description
      );

    // Visible intro paragraph: only on a category filter page (not tag/page/plain /blog).
    const seoCategoryIntro = cleanCategory && hasMatchingCategoryPosts
      ? CATEGORY_INTRO[cleanCategory] || null
      : null;

    // Compute reading time from the full content, then serialize only fields used
    // by the visible listing cards and ItemList schema.
    const lightPosts: BlogCardPost[] = pagePosts.map((post: BlogPost) => ({
      id: post.id,
      date: post.date,
      slug: post.slug,
      title: { rendered: post.title?.rendered || '' },
      excerpt: { rendered: post.excerpt?.rendered || '' },
      featured_media: post.featured_media || 0,
      readingTime: computeReadingTime(post?.content?.rendered || ''),
      _embedded: {
        ...(post._embedded?.author?.[0]
          ? { author: [{ name: post._embedded.author[0].name }] }
          : {}),
        ...(post._embedded?.['wp:featuredmedia']?.[0]
          ? {
              'wp:featuredmedia': [{
                source_url: post._embedded['wp:featuredmedia'][0].source_url,
                alt_text: post._embedded['wp:featuredmedia'][0].alt_text || '',
              }],
            }
          : {}),
        ...(post._embedded?.['wp:term']?.[0]
          ? {
              'wp:term': [post._embedded['wp:term'][0].map((term) => ({
                name: term.name,
                slug: term.slug,
                taxonomy: term.taxonomy,
              }))],
            }
          : {}),
      },
    }));

    const activeCategory = hasMatchingCategoryPosts ? cleanCategory || null : null;

    const props: BlogProps = {
      posts: lightPosts,
      pagination,
      categories,
      tags,
      seoCanonical,
      hreflangSelf,
      seoNoindex,
      seoRouteBehavior,
      seoTitle,
      seoDescription,
      seoCategoryIntro,
      // Only filters that ACTUALLY narrow this listing are carried into pagination
      // hrefs. A parameter the query ignores is not an active filter, and baking
      // it into every page link would mint a full set of crawlable duplicates of
      // the same listing (36 pages per ignored value) that all canonicalise away.
      //
      //  - category: propagated only when it matched at least one post.
      //  - tag:      NOT propagated. `?tag=` is currently read for SEO only and
      //              does not filter the collection, so a tag listing IS the
      //              unfiltered listing. If real tag filtering is implemented,
      //              set `tag: cleanTag || null` here and it will be preserved
      //              across every pagination surface automatically.
      listingQuery: {
        category: activeCategory,
        tag: null,
      },
    };

    console.log('Blog getServerSideProps: Returning props with', props.posts.length, 'posts');

    return { props };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    // Never disguise a server/data failure as an empty successful listing.
    return { notFound: true };
  }
};

const Blog = ({ posts, pagination, categories, tags, seoCanonical, hreflangSelf, seoNoindex, seoTitle, seoDescription, seoCategoryIntro, listingQuery }: BlogProps) => {
  // Every pagination control below reads these — and only these — so Next, Load
  // More, the numbered controls and the Go-to-page form can never disagree.
  const {
    totalItems: totalPosts,
    pageSize,
    currentPage,
    totalPages,
    remainingItems,
    hasPreviousPage,
    hasNextPage,
  } = pagination;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateExcerpt = (excerpt: string, maxLength: number = 150) => {
    const stripped = decodeHtmlEntities(excerpt.replace(/<[^>]*>/g, ''));
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
  };

  // Out-of-range pagination pages (e.g. ?page=25+ when only ~24 pages of posts
  // exist) return zero posts. In that case we must NOT emit the ItemList — an
  // ItemList with an empty `itemListElement` is invalid structured data (Google /
  // Semrush flag the required field as missing). We suppress the ItemList node and
  // its CollectionPage `mainEntity` reference whenever the page has no posts.
  const hasPosts = posts.length > 0;
  // Shared href builder — carries every active filter parameter across pages.
  const getBlogPageHref = (pageNumber: number) => buildBlogPageHref(pageNumber, listingQuery);

  const blogHubStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://www.samanportable.com/blog#collectionpage",
      "url": "https://www.samanportable.com/blog",
      "name": "Saman Portable Blog | Modular Construction Insights",
      "description": "Stay updated with the latest news, tips, and insights about portable construction at Saman Portable.",
      "isPartOf": { "@id": "https://www.samanportable.com/#website" },
      "about": { "@id": "https://www.samanportable.com/#organization" },
      ...(hasPosts ? { "mainEntity": { "@id": "https://www.samanportable.com/blog#itemlist" } } : {})
    },
    ...(hasPosts ? [{
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://www.samanportable.com/blog#itemlist",
      "name": "Saman Portable Blog Posts",
      "numberOfItems": posts.length,
      "itemListOrder": "https://schema.org/ItemListUnordered",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": decodeHtmlEntities(post.title?.rendered || ''),
        "url": `https://www.samanportable.com/${post.slug}`
      }))
    }] : []),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://www.samanportable.com/blog#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.samanportable.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.samanportable.com/blog" }
      ]
    }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={seoTitle}
        fallbackDescription={seoDescription}
        canonical={seoCanonical}
        hreflangSelf={hreflangSelf}
        enableHreflang={false}
        fallbackCanonical={seoCanonical}
        fallbackOgImage={siteConfig.ogImage}
        keywords={pageSEO.blog.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        structuredData={blogHubStructuredData}
        noindex={seoNoindex}
      />

      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="hero-gradient min-h-[50vh] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="max-w-7xl mx-auto container-padding relative z-20 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 hero-text-shadow">
                Our Blog
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Stay updated with the latest news, tips, and insights about portable construction
              </p>

              {/* Loading Indicator */}
              {(!posts || posts.length === 0) && (
                <div className="mt-8">
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white text-sm font-medium">Loading blog posts...</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Search and Filters */}
          <section className="section-padding bg-background border-b">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Tag className="w-4 h-4 mr-2" />
                    All Categories
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="section-padding bg-background">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg p-6 shadow-card sticky top-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog?category=${category.slug}`}
                          className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span>{category.name}</span>
                          <span className="bg-muted px-2 py-1 rounded-full text-xs">
                            {category.count}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-border mt-6 pt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Popular Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 10).map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog?tag=${tag.slug}`}
                            className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                          >
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>

                {/* Blog Posts */}
                <div className="lg:col-span-3">
                  {/* Category intro paragraph — unique on-page content per category
                      filter (duplicate-content fix). Only rendered on ?category= pages. */}
                  {seoCategoryIntro && (
                    <p className="text-muted-foreground text-base leading-relaxed mb-6">
                      {seoCategoryIntro}
                    </p>
                  )}

                  {/* Enhanced Results Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-green-900 mb-1">
                          Blog Articles
                        </h2>
                        <p className="text-green-700 text-sm">
                          {posts && posts.length > 0 ? (
                            <>
                              Showing <span className="font-semibold">{posts.length}</span> of <span className="font-semibold">{totalPosts}</span> articles
                              • Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                            </>
                          ) : (
                            'No articles available at the moment'
                          )}
                        </p>
                        {totalPosts > 100 && (
                          <p className="text-green-600 text-xs mt-1">
                            Use the pagination below or &quot;Go to Page&quot; to navigate through all {totalPosts} articles
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{totalPosts}</div>
                        <div className="text-xs text-green-500">Total Articles</div>
                      </div>
                    </div>
                  </div>

                  {/* Blog Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts && posts.length > 0 ? (
                      posts.map((post) => (
                        <article key={post.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 group">
                          {/* Featured Image */}
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <BlogImage
                              post={post}
                              index={posts.indexOf(post)}
                              className="w-full h-full"
                            />

                            {/* Category Badge */}
                            {post._embedded?.['wp:term']?.[0]?.[0] && (
                              <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                {post._embedded['wp:term'][0][0].name}
                              </div>
                            )}
                          </div>

                          {/* Post Content */}
                          <div className="p-4">
                            {/* Meta Information */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(post.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {post.readingTime} min read
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              <Link href={navigablePostPath(post.slug)} className="hover:text-primary transition-colors">
                                {decodeHtmlEntities(post.title.rendered)}
                              </Link>
                            </h3>

                            {/* Excerpt */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {truncateExcerpt(post.excerpt.rendered)}
                            </p>

                            {/* Author */}
                            {post._embedded?.author?.[0] && (
                              <div className="flex items-center mb-4">
                                <div className="w-6 h-6 bg-muted rounded-full mr-2 flex items-center justify-center">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {post._embedded.author[0].name}
                                </span>
                              </div>
                            )}

                            {/* Read More */}
                            <Link href={navigablePostPath(post.slug)}>
                              <Button variant="outline" size="sm" className="w-full group">
                                Read More
                                {/^(?:porta-cabins?-in-|portable-cabins?-in-|portacabins-for-sale-in-|affordable-porta-cabins-in-)/i.test(post.slug) && (
                                  <span className="sr-only">: {decodeHtmlEntities(post.title.rendered)}</span>
                                )}
                                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl"></span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          No blog posts available
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          We&apos;re working on creating great content for you. Please check back soon!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Load More Option — rendered only when page currentPage + 1
                      actually holds at least one article. */}
                  {hasNextPage && (
                    <div className="text-center mt-8 mb-6">
                      <Link href={getBlogPageHref(currentPage + 1)}>
                        <Button
                          variant="outline"
                          size="lg"
                          className="px-8 py-3 text-lg font-medium hover:bg-[#0A3D2A]/10 hover:border-[#0A3D2A]/30 transition-all duration-300"
                        >
                          Load More Articles
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      {remainingItems > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Next {Math.min(pageSize, remainingItems)} articles available
                        </p>
                      )}
                    </div>
                  )}

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-12">
                      <div className="flex items-center gap-2">
                        {/* Previous — a LINK only when page currentPage - 1 exists.
                            On page one it is a plain disabled button with no anchor:
                            a disabled <Button> inside <Link> still emits a crawlable
                            <a href>, which is exactly how this page came to link to
                            pages that do not exist. */}
                        {hasPreviousPage ? (
                          <Link href={getBlogPageHref(currentPage - 1)}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              ← Previous
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            aria-disabled="true"
                            className="flex items-center gap-2"
                          >
                            ← Previous
                          </Button>
                        )}

                        {/* Page Numbers — window is clamped to 1..totalPages. */}
                        {buildBlogPageWindow(currentPage, totalPages).map((entry, index) =>
                          entry === 'gap' ? (
                            <span key={`gap-${index}`} className="px-2 text-muted-foreground">...</span>
                          ) : (
                            <Link key={entry} href={getBlogPageHref(entry)}>
                              <Button
                                variant={currentPage === entry ? "default" : "outline"}
                                size="sm"
                                className="w-10 h-10 p-0"
                              >
                                {entry}
                              </Button>
                            </Link>
                          )
                        )}

                        {/* Next — a LINK only when page currentPage + 1 holds at
                            least one article. On the last page it is a plain
                            disabled button with no anchor. */}
                        {hasNextPage ? (
                          <Link href={getBlogPageHref(currentPage + 1)}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              Next →
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            aria-disabled="true"
                            className="flex items-center gap-2"
                          >
                            Next →
                          </Button>
                        )}
                      </div>

                      {/* Page Info */}
                      <div className="ml-6 text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages} • {totalPosts} total articles
                      </div>

                      {/* Quick Jump to Page */}
                      <div className="ml-6 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Go to:</span>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const page = formData.get('page') as string;
                            const pageNumber = parseInt(page, 10);
                            if (page && pageNumber >= 1 && pageNumber <= totalPages) {
                              window.location.href = getBlogPageHref(pageNumber);
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <Input
                            name="page"
                            type="number"
                            min="1"
                            max={totalPages}
                            placeholder="Page #"
                            className="w-20 h-8 text-center"
                            defaultValue={currentPage}
                          />
                          <Button type="submit" size="sm" variant="outline" className="h-8 px-3">
                            Go
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* No Posts Message */}
                  {posts.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No articles found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search criteria or browse our categories.
                      </p>
                      <Button asChild>
                        <Link href="/blog">
                          View All Articles
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>


        </main>
      </div>
    </Layout>
  );
};

export default Blog;
