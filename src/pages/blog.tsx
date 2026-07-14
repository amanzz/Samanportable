import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import Image from 'next/image';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import { Calendar, ArrowRight, Clock, Search } from 'lucide-react';
import { pageSEO, siteConfig } from '@/config/seo';
import BlogImage from '@/components/BlogImage';
import { decodeHtmlEntities } from '@/lib/utils';
import { dsCssVariables } from '@/components/ds/tokens';
import type { StartHereItem } from '@/lib/staticContent';
import type { BlogHubLink } from '@/lib/blogHubLink';

import { BlogPost as ApiBlogPost } from '@/config/api';
type BlogPost = ApiBlogPost;

// T8: excerpts are stripped to PLAIN TEXT server-side (no dangerouslySetInnerHTML in the
// card), decoded, collapsed and truncated at a word boundary.
function plainExcerpt(html: string, maxLength = 140): string {
  const text = decodeHtmlEntities((html || '').replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?–—-]+$/, '');
  return `${trimmed}…`;
}

// Listing only needs card data + precomputed reading time and plain-text excerpt.
type BlogCardPost = BlogPost & { readingTime: number; excerptText: string };

// Per-category unique title + meta description. When a visitor lands on a category
// filter (e.g. /blog?category=porta-cabins) we serve a unique, self-canonical title
// and meta so category filter pages no longer duplicate the main blog hub's SEO.
const CATEGORY_SEO: Record<string, { title: string; meta: string }> = {
  'case-studies': {
    title: 'Porta Cabin & Prefab Project Case Studies | SAMAN',
    meta: 'Real project case studies from SAMAN — porta cabins, container offices, prefab labour colonies and industrial sheds delivered across India. Read how we built it.',
  },
  'company-updates': {
    title: 'SAMAN Portable Company News & Updates',
    meta: 'Latest updates from SAMAN POS India Pvt Ltd — new products, factory news, ISO certifications and prefab industry developments from our Bangalore and Noida factories.',
  },
  'container-cafe': {
    title: 'Container Cafe Ideas, Designs & Guides | SAMAN',
    meta: 'Articles on container cafes and coffee kiosks from SAMAN — design ideas, sizes, steel construction details and real project examples for highways, campuses and QSR outlets.',
  },
  'container-offices': {
    title: 'Container Office Articles & Buyer Guides | SAMAN',
    meta: "Read SAMAN's container office articles — sizes, MS frame specs, price factors, site office uses and delivery details. Written by India's prefab steel structure manufacturer.",
  },
  'design-customization': {
    title: 'Prefab Design & Customisation Guides | SAMAN Portable',
    meta: 'Guides on customising SAMAN prefab structures — layouts, cladding options, PUF panel insulation, electrical points, plumbing and colour finishes. Call for your requirement.',
  },
  'electronic-city': {
    title: 'Portable Cabins & Site Offices for Electronic City',
    meta: 'SAMAN articles on portable cabins and prefab site offices for Electronic City, Bangalore — dispatched from our Gopasandra factory. Fast delivery, MS frame construction.',
  },
  'industrial-shed': {
    title: 'Industrial Shed & Warehouse Articles | SAMAN Portable',
    meta: 'Articles on prefab industrial sheds and warehouses from SAMAN — steel frame spans, GI sheet cladding, purlin design, cost factors and project delivery across India.',
  },
  'industry-news': {
    title: 'Prefab & Modular Construction Industry News | SAMAN',
    meta: "Stay updated on India's prefab and modular construction industry — material trends, IS code updates, project delivery insights and market news from SAMAN's editorial team.",
  },
  'labor-colony': {
    title: 'Labour Colony & Worker Housing Articles | SAMAN',
    meta: 'Articles on prefab labour colonies from SAMAN — MS hollow section frames, PUF panel rooms, toilet blocks, site planning and fast deployment for construction projects.',
  },
  'porta-cabins': {
    title: 'Porta Cabin Articles, Guides & Price Insights | SAMAN',
    meta: "Read SAMAN's porta cabin articles — buyer guides, size options, MS frame specs, price factors and real project insights from India's ISO-certified prefab manufacturer.",
  },
  'portable-buildings': {
    title: 'Portable Building Articles & Guides | SAMAN Portable',
    meta: 'Guides on portable and modular buildings from SAMAN — site offices, prefab classrooms, temporary showrooms and custom portable steel structures for Indian B2B buyers.',
  },
  'portable-construction': {
    title: 'Portable Construction Solutions — Articles | SAMAN',
    meta: 'Articles on portable construction site solutions from SAMAN — site offices, toilet cabins, labour hutments and security cabins dispatched from Bangalore and Greater Noida.',
  },
  'prefab-solutions': {
    title: 'Prefab Solutions Articles & Technical Guides | SAMAN',
    meta: 'Technical articles on SAMAN prefab solutions — steel fabrication methods, sandwich panel systems, anchor bolt erection, weld specs and customisation for B2B buyers.',
  },
  'tips-guides': {
    title: 'Prefab Buyer Tips & Planning Guides | SAMAN Portable',
    meta: "Practical tips for buying portable cabins, prefab offices and modular structures in India — size selection, site prep, delivery planning and installation by SAMAN's team.",
  },
  'uncategorized': {
    title: 'Prefab & Portable Cabin Articles | SAMAN Portable',
    meta: 'Articles on portable cabins, prefab structures and modular steel buildings from SAMAN POS India Pvt Ltd — ISO 9001:2015 certified manufacturer in Bangalore and Greater Noida.',
  },
};

// Per-category visible intro paragraph. Rendered above the post list on a
// category filter page so each category page carries unique on-page content
// (duplicate-content fix). Shown ONLY when ?category= is active.
const CATEGORY_INTRO: Record<string, string> = {
  'porta-cabins': "Browse SAMAN's porta cabin articles — written by our manufacturing team in Bangalore. Find buyer guides on MS frame sizes, price factors, customisation options and real project examples from construction sites, factories and campuses across India.",
  'container-offices': "SAMAN's container office articles cover everything a B2B buyer needs — 10ft to 40ft sizes, MS hollow section frame specs, PUF panel insulation, electrical fitouts, site office applications and delivery timelines from our Greater Noida and Bangalore factories.",
  'container-cafe': "SAMAN's container cafe articles cover design ideas, size options, steel fabrication details and real project examples. Whether you need a highway kiosk, campus coffee counter or a multi-unit QSR setup, find practical guidance here from India's prefab steel structure manufacturer.",
  'industrial-shed': 'Browse articles on prefab industrial sheds and warehouses from SAMAN — IS 2062 steel frame construction, GI sheet and polycarbonate cladding, purlin and girt design, foundation requirements and project cost factors for factories, storage yards and logistics centres across India.',
  'labor-colony': "SAMAN's labour colony articles cover prefab worker housing design — MS hollow section frame rooms, PUF panel insulation, attached toilet blocks, common kitchen units and site layout planning. Find guidance on fast deployment for construction projects, infrastructure sites and industrial campuses.",
  'design-customization': "SAMAN's design and customisation articles help you plan the right prefab structure for your site. Explore layout options, cladding choices, PUF and cement board panels, electrical point configurations, plumbing fitouts and colour finishes — all customised to your requirement and dispatched from our Bangalore or Greater Noida factory.",
  'prefab-solutions': "Technical articles on SAMAN's prefab solutions — covering MS frame fabrication, sandwich panel and PUF insulation systems, anchor bolt and base plate erection, weld quality standards and customisation options for Indian B2B buyers across construction, manufacturing and infrastructure sectors.",
  'portable-buildings': "SAMAN's portable building articles cover modular steel structures for a wide range of uses — construction site offices, prefab classrooms, temporary showrooms, portable health centres and custom buildings. Find size guides, material specs and deployment advice for Indian B2B buyers.",
  'portable-construction': "Find articles on SAMAN's full range of portable construction site solutions — MS frame site offices, portable toilet cabins, prefab labour hutments and steel security cabins. All units dispatched from our Bangalore and Greater Noida factories with 3–5 day transit and ₹3,000 standard delivery.",
  'industry-news': "Stay current with India's prefab and modular construction industry — steel material trends, IS code developments, government infrastructure project updates and market insights. Articles written and curated by SAMAN's team with 15+ years in prefab steel structure manufacturing.",
  'tips-guides': "Practical buying guides from SAMAN's manufacturing team — how to select the right size porta cabin, prepare your site for delivery, plan electrical and plumbing fitouts, understand price factors and get your prefab structure installed correctly the first time.",
  'case-studies': 'Real project case studies from SAMAN — see how we designed, fabricated and delivered porta cabins, container offices, prefab labour colonies and industrial sheds for clients across India. Each case study covers the brief, the build specs and the delivery outcome.',
  'company-updates': 'Latest news from SAMAN POS India Pvt Ltd — new product launches, factory capacity updates, ISO certification milestones and company announcements from our Bangalore (560099) and Greater Noida (201308) manufacturing units.',
  'electronic-city': "Articles on portable cabins and prefab site offices for Electronic City, Bangalore — covering MS frame construction, sizes, price factors and delivery. All units dispatched from SAMAN's Gopasandra factory in Bangalore Urban (560099) with fast turnaround for South Bangalore sites.",
  'uncategorized': 'Articles on portable cabins, prefab structures and modular steel buildings from SAMAN POS India Pvt Ltd — ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018 certified manufacturer with factories in Bangalore and Greater Noida serving buyers across India.',
};

// T8.1 B: the featured (newest) post, rendered as the lead card on page 1 only.
// It is post #1 of the same 10 this page already returns — so the grid simply skips
// it, the ItemList still describes exactly the 10 visible posts, and the pagination
// math (36 pages of 10) is untouched.
type FeaturedPost = {
  slug: string;
  title: string;
  date: string;
  readTime: number;
  excerpt: string;
  image: { src: string; alt: string } | null;
  category: { name: string; slug: string } | null;
};

interface BlogProps {
  posts: BlogCardPost[];
  featured: FeaturedPost | null;
  startHere: StartHereItem[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
  categories: Array<{ id: number; name: string; slug: string; count: number }>;
  activeCategory: string | null;
  seoCanonical: string;
  hreflangSelf: string;
  seoNoindex: boolean;
  seoRouteBehavior: string;
  seoTitle: string;
  seoDescription: string;
  seoCategoryIntro: string | null;
  /**
   * SHIKHAR T8.2: the real clusters this library covers that also own a product hub —
   * the entity set behind the Blog `about` array. Derived from the same category data
   * the page renders, so it can never name a cluster with no posts or no hub.
   */
  hubClusters: BlogHubLink[];
}

export const getServerSideProps: GetServerSideProps<BlogProps> = async ({ query }) => {
  try {
    const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
    const parsedPage = rawPage ? parseInt(rawPage, 10) : 1;
    const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const category = Array.isArray(query.category) ? query.category[0] : query.category;
    const tag = Array.isArray(query.tag) ? query.tag[0] : query.tag;

    // Static content layer: reads exported post files — no WordPress call.
    const { fetchBlogPosts, getBlogCategories, getStartHerePosts, computeReadTime } = await import(
      '@/lib/staticContent'
    );
    const result = await fetchBlogPosts(page, 10);

    // T8 B1: REAL categories with REAL counts, derived from the post data itself.
    // (The previous hardcoded list invented both the categories and their counts.)
    const categories = getBlogCategories();

    // T8.1 D2: newest post of each of the 4 largest categories. Pure data.
    const startHere = getStartHerePosts(4);

    // T8.2 Part B: the clusters this library actually covers that own a product hub.
    // Same category data as above, filtered through categoryHubMap — no invented topics.
    const { getBlogHubClusters } = await import('@/lib/blogHubLink');
    const hubClusters = getBlogHubClusters();

    const blogCanonicalBase = `${siteConfig.url}/blog`;
    const cleanCategory = category?.trim();
    const cleanTag = tag?.trim();
    let seoNoindex = false;
    let seoRouteBehavior = 'indexable blog hub';

    // Canonical strategy:
    //  - category filter -> self-canonical, so each category is its own indexable page
    //  - tag filter      -> canonical back to /blog hub (no unique content for tags)
    //  - pagination      -> T8 B5: in-range pages 2+ are now SELF-canonical + indexable
    //                       (recovers crawl depth to the deep legacy posts);
    //                       out-of-range stays noindex + canonical to hub
    //  - plain /blog     -> /blog
    let seoCanonical = blogCanonicalBase;

    const categorySeo = cleanCategory ? CATEGORY_SEO[cleanCategory.toLowerCase()] : undefined;
    let seoTitle = categorySeo?.title || pageSEO.blog.title;
    // Meta description is NOT altered by pagination (L3: hub meta stays as-is).
    const seoDescription = categorySeo?.meta || pageSEO.blog.description;

    const inRangePage = page > 1 && page <= result.pagination.totalPages && result.posts.length > 0;

    if (cleanCategory) {
      seoCanonical = `${blogCanonicalBase}?category=${encodeURIComponent(cleanCategory)}`;
      seoRouteBehavior = 'indexable category filter (self-canonical)';
    } else if (cleanTag) {
      seoRouteBehavior = 'tag filter canonicalized to blog hub';
    } else if (rawPage && page <= 1) {
      seoRouteBehavior = 'page 0/1 canonicalized to blog hub';
    } else if (inRangePage) {
      seoCanonical = `${blogCanonicalBase}?page=${page}`;
      seoTitle = `${pageSEO.blog.title} — Page ${page}`;
      seoRouteBehavior = 'indexable paginated listing (self-canonical)';
    } else if (page > 1) {
      seoNoindex = true;
      seoRouteBehavior = 'out-of-range pagination noindexed and canonicalized to blog hub';
    }

    // Self-referencing hreflang: mirror the EXACT crawled filter URL.
    let hreflangSelf = blogCanonicalBase;
    if (cleanCategory) {
      hreflangSelf = `${blogCanonicalBase}?category=${encodeURIComponent(cleanCategory)}`;
    } else if (cleanTag) {
      hreflangSelf = `${blogCanonicalBase}?tag=${encodeURIComponent(cleanTag)}`;
    } else if (rawPage) {
      hreflangSelf = `${blogCanonicalBase}?page=${encodeURIComponent(String(rawPage))}`;
    }

    // Visible intro paragraph: only on a category filter page (not tag/page/plain /blog).
    const seoCategoryIntro = cleanCategory
      ? CATEGORY_INTRO[cleanCategory.toLowerCase()] || null
      : null;

    // Compute reading time + plain-text excerpt from the full post, then strip the heavy
    // `content.rendered` / `excerpt.rendered` so post bodies are NOT serialized into
    // __NEXT_DATA__.
    const lightPosts: BlogCardPost[] = (result.posts || []).map((post: BlogPost) => ({
      ...post,
      readingTime: computeReadTime(post?.content?.rendered || ''),
      excerptText: plainExcerpt(post?.excerpt?.rendered || ''),
      content: { ...(post.content || {}), rendered: '' },
      excerpt: { ...(post.excerpt || {}), rendered: '' },
    }));

    // T8.1 B: featured lead card = the newest post, on page 1 only. Its longer excerpt,
    // image and real category are read from the SAME post object the grid would have
    // rendered, before `content`/`excerpt` were stripped above.
    const featuredSource: any = page === 1 ? (result.posts || [])[0] : undefined;
    let featured: FeaturedPost | null = null;

    if (featuredSource) {
      const media = featuredSource?._embedded?.['wp:featuredmedia']?.[0];
      const terms: any[] = featuredSource?._embedded?.['wp:term']?.[0] || [];
      const term = terms.find((t) => t?.taxonomy === 'category' && t?.slug);

      featured = {
        slug: featuredSource.slug,
        title: featuredSource?.title?.rendered || '',
        date: featuredSource.date,
        readTime: computeReadTime(featuredSource?.content?.rendered || ''),
        excerpt: plainExcerpt(featuredSource?.excerpt?.rendered || '', 200),
        image: media?.source_url
          ? {
              src: media.source_url,
              alt: decodeHtmlEntities(media.alt_text || featuredSource?.title?.rendered || ''),
            }
          : null,
        category: term ? { name: term.name, slug: term.slug } : null,
      };
    }

    return {
      props: {
        posts: lightPosts,
        featured,
        startHere,
        totalPages: result.pagination.totalPages,
        currentPage: result.pagination.currentPage,
        totalPosts: result.pagination.totalPosts || 0,
        categories,
        activeCategory: cleanCategory?.toLowerCase() || null,
        seoCanonical,
        hreflangSelf,
        seoNoindex,
        seoRouteBehavior,
        seoTitle,
        seoDescription,
        seoCategoryIntro,
        hubClusters,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        posts: [],
        featured: null,
        startHere: [],
        totalPages: 1,
        currentPage: 1,
        totalPosts: 0,
        categories: [],
        activeCategory: null,
        seoCanonical: `${siteConfig.url}/blog`,
        hreflangSelf: `${siteConfig.url}/blog`,
        seoNoindex: true,
        seoRouteBehavior: 'blog fetch error noindexed and canonicalized to blog hub',
        seoTitle: pageSEO.blog.title,
        seoDescription: pageSEO.blog.description,
        seoCategoryIntro: null,
        hubClusters: [],
      },
    };
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Page numbers to render (with gaps) — mirrors the previous "smart pagination" window.
function pageWindow(currentPage: number, totalPages: number): Array<number | 'gap'> {
  const maxVisible = 7;
  if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, 'gap', totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, 'gap', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'gap', currentPage - 1, currentPage, currentPage + 1, 'gap', totalPages];
}

// Category pills (T8.1 C). /blog/search carries its own copy of these class strings —
// importing them from this page module would pull the hub into the search bundle.
const pillClass =
  'inline-flex items-center whitespace-nowrap rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] px-3.5 py-1.5 text-sm font-medium text-[var(--ds-color-forest)] transition-colors hover:border-[var(--ds-color-forest)] hover:bg-[var(--ds-color-mist)]';
const pillActiveClass =
  'inline-flex items-center whitespace-nowrap rounded-full border border-[var(--ds-color-forest)] bg-[var(--ds-color-forest)] px-3.5 py-1.5 text-sm font-semibold text-white';

const Blog = ({
  posts,
  featured,
  startHere,
  totalPages,
  currentPage,
  totalPosts,
  categories,
  activeCategory,
  seoCanonical,
  hreflangSelf,
  seoNoindex,
  seoTitle,
  seoDescription,
  seoCategoryIntro,
  hubClusters,
}: BlogProps) => {
  // Out-of-range pagination pages return zero posts. An ItemList with an empty
  // `itemListElement` is invalid structured data, so we suppress the ItemList node and
  // its CollectionPage `mainEntity` reference whenever the page has no posts.
  const hasPosts = posts.length > 0;

  // The featured card IS post #1 of this page's 10, so the grid renders the other 9 and
  // no post appears twice. ItemList below still describes all 10 (featured + grid).
  const gridPosts = featured ? posts.slice(1) : posts;

  // MOBILE CWV LAW: only the first hero image is priority-loaded. When the featured card
  // is present it owns that slot, so grid images must not also load eagerly — BlogImage
  // prioritises index < 3, so we offset past the threshold.
  const gridImageIndex = (index: number) => (featured ? index + 3 : index);

  // T8 B7: schema @id / url reflect the CURRENT (canonical) page URL, so a paginated
  // listing describes itself rather than the hub. ItemList mirrors exactly the posts
  // rendered on this page (G6).
  const pageUrl = seoCanonical;

  const blogHubStructuredData = [
    // T8.1 G: Blog entity, tying the content library to the site's Organization. The
    // publisher is referenced by the @id the rest of the site already uses for the
    // Organization node — no new org fields invented here.
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${pageUrl}#blog`,
      url: pageUrl,
      name: seoTitle,
      publisher: { '@id': 'https://www.samanportable.com/#organization' },
      // T8.2 Part B: the real clusters this library covers, each tied to its canonical
      // /product hub. Derived from the same category data the page renders (via
      // categoryHubMap), so no topic here is invented and no hub URL is guessed.
      // `Thing`, not `Product`: a hub is a CollectionPage of many products, so claiming
      // a Product entity at that URL would be false. Omitted entirely if empty.
      ...(hubClusters.length > 0 && {
        about: hubClusters.map((cluster) => ({
          '@type': 'Thing',
          '@id': `https://www.samanportable.com${cluster.hubPath}`,
          name: cluster.hubName,
          url: `https://www.samanportable.com${cluster.hubPath}`,
        })),
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#collectionpage`,
      url: pageUrl,
      name: 'Saman Portable Blog | Modular Construction Insights',
      description: 'Stay updated with the latest news, tips, and insights about portable construction at Saman Portable.',
      isPartOf: { '@id': 'https://www.samanportable.com/#website' },
      about: { '@id': 'https://www.samanportable.com/#organization' },
      ...(hasPosts ? { mainEntity: { '@id': `${pageUrl}#itemlist` } } : {}),
    },
    ...(hasPosts
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${pageUrl}#itemlist`,
            name: 'Saman Portable Blog Posts',
            numberOfItems: posts.length,
            itemListOrder: 'https://schema.org/ItemListUnordered',
            itemListElement: posts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: decodeHtmlEntities(post.title?.rendered || ''),
              url: `https://www.samanportable.com/${post.slug}`,
            })),
          },
        ]
      : []),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': 'https://www.samanportable.com/blog#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.samanportable.com/blog' },
      ],
    },
  ];

  // Pagination hrefs preserve an active category filter.
  const pageHref = (n: number) =>
    activeCategory ? `/blog?category=${activeCategory}&page=${n}` : `/blog?page=${n}`;

  const pageLinkClass =
    'inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border border-[var(--ds-border)] px-3 text-sm font-medium text-[var(--ds-text-secondary)] transition-colors hover:border-[var(--ds-color-forest)] hover:text-[var(--ds-color-forest)]';
  const pageLinkActiveClass =
    'inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border border-[var(--ds-color-forest)] bg-[var(--ds-color-forest)] px-3 text-sm font-semibold text-white';

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={seoTitle}
        fallbackDescription={seoDescription}
        canonical={seoCanonical}
        hreflangSelf={hreflangSelf}
        fallbackCanonical={seoCanonical}
        fallbackOgImage={siteConfig.ogImage}
        keywords={pageSEO.blog.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        structuredData={blogHubStructuredData}
        noindex={seoNoindex}
      />

      {/* The DS custom properties are not defined globally, so this page scopes its own
          token block — every var(--ds-*) below then resolves within the blog subtree. */}
      <div data-ds-root="" className="min-h-screen bg-[var(--ds-surface)]">
        <style dangerouslySetInnerHTML={{ __html: `[data-ds-root]{${dsCssVariables()}}` }} />

        <main>
          {/* Compact page header (T8 B3 — replaces the 50vh dark hero; no background image
              so the LCP text paints immediately). */}
          <section className="border-b border-[var(--ds-border)] bg-[var(--ds-color-mist)]">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
              {/* T8.1 A: visible breadcrumb — mirrors the BreadcrumbList JSON-LD exactly
                  (Home › Blog), and stays Home › Blog on paginated pages. */}
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex items-center gap-1.5 text-xs text-[var(--ds-text-secondary)]">
                  <li>
                    <Link href="/" className="transition-colors hover:text-[var(--ds-color-forest)]">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-[var(--ds-border-strong)]">
                    ›
                  </li>
                  <li aria-current="page" className="font-medium text-[var(--ds-color-forest)]">
                    Blog
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl font-bold tracking-tight text-[var(--ds-color-forest)] md:text-4xl">
                Prefab &amp; Portable Cabin Insights
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--ds-text-secondary)] md:text-lg">
                Buying guides, price breakdowns, specifications and project stories from SAMAN&apos;s manufacturing team — updated regularly.
              </p>

              {/* T8.1 F: plain GET form — no JS required. The placeholder count is the
                  real post total, so it follows the data. */}
              <form action="/blog/search" method="get" role="search" className="mt-6 flex max-w-xl gap-2">
                <input
                  type="search"
                  name="q"
                  aria-label="Search guides"
                  placeholder={`Search ${totalPosts} guides…`}
                  className="h-11 w-full rounded-lg border border-[var(--ds-border)] bg-[var(--ds-surface)] px-4 text-sm text-[var(--ds-text-primary)] outline-none transition-colors placeholder:text-[var(--ds-text-secondary)] focus:border-[var(--ds-color-forest)]"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--ds-color-forest)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--ds-color-leaf)]"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search
                </button>
              </form>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar (T8.1 D) — the category list moved out to the pills row, so the
                    sidebar now carries the E-E-A-T box and the deterministic Start Here list. */}
                <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    <div className="rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] p-6">
                      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--ds-color-forest)]">
                        From the factory floor
                      </h2>
                      <p className="text-sm leading-relaxed text-[var(--ds-text-secondary)]">
                        Every guide here is written from real manufacturing and installation experience — portable cabins, container offices, prefab structures and site accommodation built and delivered across India.
                      </p>

                      <div className="mt-5 space-y-3 border-t border-[var(--ds-border)] pt-5 text-sm text-[var(--ds-text-secondary)]">
                        <p>
                          South — Bengaluru:{' '}
                          <a href="tel:+918861622859" className="font-semibold text-[var(--ds-color-forest)] hover:text-[var(--ds-color-leaf)]">
                            +91 88616 22859
                          </a>{' '}
                          ·{' '}
                          <a href="mailto:sales@samanportable.com" className="font-semibold text-[var(--ds-color-forest)] hover:text-[var(--ds-color-leaf)]">
                            sales@samanportable.com
                          </a>
                        </p>
                        <p>
                          North — Greater Noida:{' '}
                          <a href="tel:+918796039938" className="font-semibold text-[var(--ds-color-forest)] hover:text-[var(--ds-color-leaf)]">
                            +91 87960 39938
                          </a>{' '}
                          ·{' '}
                          <a href="mailto:ncr@samanportable.com" className="font-semibold text-[var(--ds-color-forest)] hover:text-[var(--ds-color-leaf)]">
                            ncr@samanportable.com
                          </a>
                        </p>
                      </div>

                      <Link
                        href="/about-us"
                        className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:text-[var(--ds-color-forest)]"
                      >
                        About SAMAN Portable
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {startHere.length > 0 && (
                      <div className="rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] p-6">
                        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--ds-color-forest)]">
                          Start here — by topic
                        </h2>
                        <ul className="space-y-4">
                          {startHere.map((item) => (
                            <li key={item.categorySlug}>
                              <p className="text-xs uppercase tracking-wide text-[var(--ds-text-secondary)]">
                                {decodeHtmlEntities(item.categoryName)}
                              </p>
                              <Link
                                href={`/${item.postSlug}`}
                                className="mt-0.5 block text-sm font-semibold leading-snug text-[var(--ds-text-primary)] transition-colors hover:text-[var(--ds-color-forest)]"
                              >
                                {decodeHtmlEntities(item.postTitle)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </aside>

                {/* Posts */}
                <div className="lg:col-span-3">
                  {/* T8.1 B: featured lead card — the newest post, page 1 only. */}
                  {featured && (
                    <section aria-labelledby="latest-guide" className="mb-10">
                      <p
                        id="latest-guide"
                        className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--ds-color-leaf)]"
                      >
                        LATEST GUIDE
                      </p>

                      <article className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] transition-colors hover:border-[var(--ds-color-forest)] md:grid-cols-2">
                        {/* Fixed height on mobile, stretched grid cell on desktop → the box is
                            reserved before the image loads. Zero CLS. */}
                        <div className="relative h-56 w-full bg-[var(--ds-color-mist)] md:h-full md:min-h-[20rem]">
                          {featured.image && (
                            <Image
                              src={featured.image.src}
                              unoptimized={shouldBypassOptimizer(featured.image.src)}
                              alt={featured.image.alt}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
                          {featured.category && (
                            <Link
                              href={`/blog?category=${featured.category.slug}`}
                              className="w-fit rounded-full bg-[var(--ds-color-mist)] px-3 py-1 text-xs font-semibold text-[var(--ds-color-forest)] transition-colors hover:bg-[var(--ds-color-forest)] hover:text-white"
                            >
                              {decodeHtmlEntities(featured.category.name)}
                            </Link>
                          )}

                          <h2 className="text-xl font-bold leading-snug text-[var(--ds-text-primary)] md:text-2xl">
                            <Link
                              href={`/${featured.slug}`}
                              className="transition-colors hover:text-[var(--ds-color-forest)]"
                            >
                              {decodeHtmlEntities(featured.title)}
                            </Link>
                          </h2>

                          <p className="text-sm leading-relaxed text-[var(--ds-text-secondary)]">
                            {featured.excerpt}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-[var(--ds-text-secondary)]">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(featured.date)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {featured.readTime} min read
                            </span>
                          </div>

                          <Link
                            href={`/${featured.slug}`}
                            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:text-[var(--ds-color-forest)]"
                          >
                            Read article
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </article>
                    </section>
                  )}

                  {/* T8.1 C: category pills — real counts from getBlogCategories(). SSR links;
                      one scrollable row on mobile (CSS only), wrapping on desktop. */}
                  {categories.length > 0 && (
                    <nav aria-label="Blog categories" className="mb-8">
                      <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
                        <li className="shrink-0">
                          <Link href="/blog" className={activeCategory ? pillClass : pillActiveClass}>
                            All articles ({totalPosts})
                          </Link>
                        </li>
                        {categories.map((category) => (
                          <li key={category.id} className="shrink-0">
                            <Link
                              href={`/blog?category=${category.slug}`}
                              className={activeCategory === category.slug ? pillActiveClass : pillClass}
                            >
                              {decodeHtmlEntities(category.name)} ({category.count})
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}

                  {/* Category intro paragraph — unique on-page content per category filter. */}
                  {seoCategoryIntro && (
                    <p className="mb-6 text-base leading-relaxed text-[var(--ds-text-secondary)]">
                      {seoCategoryIntro}
                    </p>
                  )}

                  {/* Results summary (T8 B4) — one muted line, no emoji, no gradient. */}
                  {hasPosts && (
                    <p className="mb-6 text-sm text-[var(--ds-text-secondary)]">
                      Showing {posts.length} of {totalPosts} articles · Page {currentPage} of {totalPages}
                    </p>
                  )}

                  {hasPosts ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {gridPosts.map((post, index) => (
                        <article
                          key={post.id}
                          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--ds-color-forest)] hover:shadow-md"
                        >
                          {/* Fixed aspect box → space reserved, zero CLS. */}
                          <div className="relative aspect-video overflow-hidden bg-[var(--ds-color-mist)]">
                            <BlogImage post={post} index={gridImageIndex(index)} className="h-full w-full" />
                          </div>

                          <div className="flex flex-grow flex-col p-5">
                            <div className="mb-3 flex items-center gap-4 text-xs text-[var(--ds-text-secondary)]">
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDate(post.date)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {post.readingTime} min read
                              </span>
                            </div>

                            <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[var(--ds-text-primary)]">
                              <Link
                                href={`/${post.slug}`}
                                className="transition-colors hover:text-[var(--ds-color-forest)]"
                              >
                                {decodeHtmlEntities(post.title.rendered)}
                              </Link>
                            </h3>

                            <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-[var(--ds-text-secondary)]">
                              {post.excerptText}
                            </p>

                            <Link
                              href={`/${post.slug}`}
                              className="mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:text-[var(--ds-color-forest)]"
                            >
                              Read article
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] p-12 text-center">
                      <h2 className="mb-2 text-xl font-semibold text-[var(--ds-text-primary)]">No articles found</h2>
                      <p className="mb-6 text-[var(--ds-text-secondary)]">
                        Browse all articles or pick a category from the list.
                      </p>
                      <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ds-color-leaf)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--ds-color-forest)]"
                      >
                        View all articles
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}

                  {/* Pagination (T8 B5) — real SSR <a href> links; no JS controls. */}
                  {totalPages > 1 && (
                    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
                      {currentPage > 1 && (
                        <Link href={pageHref(currentPage - 1)} rel="prev" className={pageLinkClass}>
                          ← Previous
                        </Link>
                      )}

                      {pageWindow(currentPage, totalPages).map((p, i) =>
                        p === 'gap' ? (
                          <span key={`gap-${i}`} className="px-1 text-[var(--ds-text-secondary)]">
                            …
                          </span>
                        ) : (
                          <Link
                            key={p}
                            href={pageHref(p)}
                            aria-current={p === currentPage ? 'page' : undefined}
                            className={p === currentPage ? pageLinkActiveClass : pageLinkClass}
                          >
                            {p}
                          </Link>
                        )
                      )}

                      {currentPage < totalPages && (
                        <Link href={pageHref(currentPage + 1)} rel="next" className={pageLinkClass}>
                          Next →
                        </Link>
                      )}
                    </nav>
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
