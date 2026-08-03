import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import Layout from '../../../components/Layout';
// import { SEO } from '../../../components/SEO'; // Removed to avoid duplicate meta tags
import { UnifiedSEO } from '../../../components/UnifiedSEO';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import MobileBottomNav from '../../../components/MobileBottomNav';
import { 
  Star, 
  Package,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import type { WooCommerceProduct, RankMathSEOData, ProductReview } from '../../../config/api';
import { categoryHref } from '../../../lib/categoryHubMap';
import Link from 'next/link';
import { cn, formatPriceWithCurrency, parseShortDescriptionTableSSR, extractButtonsFromShortDescription } from '../../../lib/utils';
import { getSeoAnchorText, getHubUrl } from '../../../lib/seoAnchorMap';
import { Breadcrumb } from '../../../components/ds/Breadcrumb';
import { getProductBreadcrumb, crumbsToDsItems, crumbsToJsonLd } from '../../../lib/breadcrumbs';
import { getProductTabsHtml } from '../../../lib/specsShippingTabs';
import { generateProductMetaDescription, generateProductTabContent } from '../../../utils/contentUtils';
// import { generateProductSchema } from '../../../lib/schema'; // Removed to avoid duplicate schemas
import ProductStructuredData from '../../../components/ProductStructuredData';
import ManufacturerTrustStrip from '../../../components/ManufacturerTrustStrip';
import RelatedProductRail from '../../../components/product/RelatedProductRail';
import ProductZoneCtas from '../../../components/product/ProductZoneCtas';
import ProductSummaryLayout from '../../../components/product/ProductSummaryLayout';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { demoteHtmlH1ToH2 } from '../../../lib/seoHtml';
import { setPublicEdgeCache } from '../../../lib/cacheHeaders';
import { cleanText } from '../../../lib/merchantFeed';
import { getNavigableProductPath } from '../../../lib/productCanonicalPaths';
import { toRelatedProductSummary } from '../../../lib/relatedProductSummary';
import { getC16PanelSiblingRail, isC16PanelSlug, type RelatedRailItem } from '../../../lib/c16PanelCatalog';
import {
  isPortaCabinStripSlug,
  orderPortaCabinStrip,
  slugFromProductHref,
  c01HubReturnAnchorForSlug,
} from '../../../lib/portaCabinClusterRail';
import { orderContainerOfficeRail } from '../../../lib/containerOfficeClusterRail';
import { getEmbeddedProductSummary, renderCabinCalculatorSSR } from '../../../lib/cabinCalculatorSSR';
import { makeCalculatorPageUrl, resolveEmbeddedCalculatorProduct } from '../../../lib/cabinCalculatorEmbedRoutes';
import { CLOSED_STATE } from '../../../lib/calculatorCopy';
import { PortaCabinVariantHero } from '../../../components/product-variant-hero/PortaCabinVariantHero';
import type { VariantProductData } from '../../../components/product-variant-hero/types';

// Guards the dynamic data/products import below against path traversal — the slug
// comes straight from the URL. Same regex as the category hub route.
const SAFE_PRODUCT_SLUG = /^[a-z0-9-]+$/;

// Dynamic import for ProductTabs to avoid SSR issues
const ProductTabs = dynamic(() => import('../../../components/ProductTabs'), {
  ssr: true,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  )
});

const PRODUCT_DESCRIPTION_H1_DEMOTION_SLUGS = new Set([
  'portable-office-cabin',
]);

// Section 17: exported WordPress records are immutable. Route-specific content
// corrections are applied to the fetched render string, with the full anchor
// matched so neither unrelated copy nor the destination can change.
const PRODUCT_DESCRIPTION_ANCHOR_TEXT_REPLACEMENTS: Record<string, { before: string; after: string }> = {
  'saman-prefab-office': {
    before: '<a href="https://www.samanportable.com/product/portable-office/readymade-office-cabin">readymade office cabin</a>',
    after: '<a href="https://www.samanportable.com/product/portable-office/readymade-office-cabin">ready-built office cabin</a>',
  },
};

function applyProductDescriptionAnchorTextCorrection(slug: string, html: string): string {
  const replacement = PRODUCT_DESCRIPTION_ANCHOR_TEXT_REPLACEMENTS[slug];
  return replacement ? html.replace(replacement.before, replacement.after) : html;
}

interface ProductDetailsProps {
  product: WooCommerceProduct | null;
  category: string;
  slug: string;
  relatedProducts: WooCommerceProduct[];
  rankMathSEO?: RankMathSEOData | null;
  reviews?: ProductReview[];
  // T31 — real Specifications + shared Shipping tab HTML, present only for the porta-
  // cabin cluster subpages (null everywhere else → generic tab content unchanged).
  specificationsHtml?: string;
  shippingHtml?: string;
  // T25 — variant-hero data for sibling subpages at /product/{category}/{slug}.
  // Present only when data/products/{slug}.json exists; every other subpage keeps
  // the generic ProductSummaryLayout hero, byte-for-byte.
  variantData?: VariantProductData | null;
}

export const getServerSideProps: GetServerSideProps<ProductDetailsProps> = async ({ params, res }) => {
  try {
    const { category, slug } = params as { category: string; slug: string };
    
    if (!category || !slug) {
      return {
        notFound: true,
      };
    }

    // Check if category and slug are the same (case-insensitive)
    const categoryLower = decodeURIComponent(category).toLowerCase();
    const slugLower = decodeURIComponent(slug).toLowerCase();
    
    if (categoryLower === slugLower) {
      // Redirect to the shorter URL format
      return {
        redirect: {
          destination: `/product/${category}`,
          permanent: true,
        },
      };
    }

    // Static content layer: reads exported product files — no WordPress call.
    // Server-only module, loaded dynamically so fs never reaches the client bundle.
    const staticContent = await import('../../../lib/staticContent');

    // Fetch lightweight product data first
    const product = await staticContent.fetchLightweightProduct(slug);

    // T31 — real Specifications + shared Shipping tab HTML for the porta-cabin cluster
    // subpages; null for every other subpage (its tabs stay unchanged).
    const t31Tabs = getProductTabsHtml(slug);

    if (!product) {
      return {
        notFound: true,
      };
    }

    // Verify if the product belongs to the specified category
    const productCategorySlug = product.category_slug.toLowerCase();
    const urlCategory = decodeURIComponent(category).toLowerCase();
    
    // C01 namespace closure (Fable 5 + SAMAN, 27 Jul 2026): `porta-cabin`
    // was accepted as a substring of the real `porta-cabins` category, exposing
    // an unbounded parallel URL namespace. Explicit redirects plus the ordered
    // catch-all in next.config.js own those aliases; the page route must not.
    if (
      urlCategory === 'porta-cabin' ||
      (productCategorySlug !== urlCategory && !productCategorySlug.includes(urlCategory))
    ) {
      return {
        notFound: true,
      };
    }

    // Get related products from the same category (lightweight)
    let relatedProducts: WooCommerceProduct[] = [];
    try {
      // 100 is safe headroom over the largest cluster. T25: the porta cabin S4
      // strip is a FIXED set of siblings from the internal-linking matrix, and at
      // the old cap of 12 a named sibling could fall outside the window and be
      // silently dropped from the strip. Mirrors the hub route's cap.
      const relatedResponse = await staticContent.fetchProducts(1, 100, {
        category: product.category_slug
      });
      // Filter out the current product, then serialize ONLY the lightweight fields
      // the related-products UI actually reads (id, name, slug, price, rating,
      // first category, first image). Full WooCommerce objects — chiefly each
      // product's `description` (~11KB) — bloated __NEXT_DATA__ by ~120KB but are
      // never rendered by the slider or MobileBottomNav, so they are dropped to
      // shrink the client hydration payload. SSR-rendered cards are unchanged.
      relatedProducts = (relatedResponse.products || [])
        .filter(p => p.id !== product.id)
        .map(toRelatedProductSummary);
      const { excludeRedirectingProducts } = await import('../../../lib/redirectSources');
      relatedProducts = await excludeRedirectingProducts(relatedProducts);
      if (urlCategory === 'container-offices') {
        relatedProducts = orderContainerOfficeRail(slug, relatedProducts);
      }
    } catch (error) {
      // Silent error handling for production
    }

    // Fetch full description and images separately
    const descriptionData = await staticContent.fetchProductDescription(slug);
    const productDescriptionWithHeadingCorrection = PRODUCT_DESCRIPTION_H1_DEMOTION_SLUGS.has(slugLower)
      ? demoteHtmlH1ToH2(descriptionData?.description || '')
      : descriptionData?.description || '';
    const productDescription = applyProductDescriptionAnchorTextCorrection(
      slugLower,
      productDescriptionWithHeadingCorrection
    );

    // Fetch REAL approved backend reviews — ONLY when the product actually has
    // ratings (rating_count > 0), so unrated products skip the extra API call.
    // fetchProductReviews is non-fatal (returns [] on any error) so a reviews
    // problem never breaks the page or causes a false 404.
    let reviews: ProductReview[] = [];
    if (product.rating_count > 0) {
      reviews = await staticContent.fetchProductReviews(product.id, 5);
    }

    // Fetch Rank Math SEO data
    let rankMathSEO: RankMathSEOData | null = null;
    try {
      rankMathSEO = await staticContent.fetchProductRankMathSEO(`${category}/${slug}`);
    } catch (error) {
      console.warn('Failed to fetch Rank Math SEO data:', error);
    }

    // Public marketing page with no per-user data — safe to edge-cache. Set only
    // on the success path so the 404s/redirects above keep Next's default no-store
    // and newly-published URLs are never cache-poisoned.
    setPublicEdgeCache(res);

    // T25 — variant hero data, keyed on the SUBPAGE slug (not the category). Same
    // guard + non-fatal .catch() as the hub route: a subpage with no
    // data/products/{slug}.json resolves to null and renders exactly as before.
    const variantData: VariantProductData | null = SAFE_PRODUCT_SLUG.test(slug)
      ? await import(`../../../data/products/${slug}.json`)
          .then((mod: { default?: VariantProductData }) => mod.default || null)
          .catch(() => null)
      : null;

    // Event B owns all commercial size/price data when its product JSON exists.
    // Keep the legacy record for its frozen title, descriptions and head data, but
    // do not hydrate obsolete commercial fields that the variant hero never reads.
    const productForPageProps = { ...product } as Partial<WooCommerceProduct> & Record<string, unknown>;
    if (variantData) {
      for (const field of [
        'price',
        'regular_price',
        'sale_price',
        'priceDisplay',
        'priceSubline',
        'short_description',
        'attributes',
        'dimensions',
      ] as const) {
        delete productForPageProps[field];
      }
    }

    return {
      props: {
        product: {
          ...productForPageProps,
          description: `${variantData?.descriptionHtml || productDescription}`,
          images: descriptionData?.images?.map((img, index) => ({
            id: index,
            src: img.src,
            alt: img.alt,
            name: img.alt || `Image ${index + 1}`
          })) || [],
          categories: [
            {
              id: 0,
              name: (product as any).category || 'Uncategorized',
              slug: (product as any).category_slug || 'uncategorized'
            }
          ],
          ...(variantData ? {} : {
            attributes: [],
            dimensions: { length: '', width: '', height: '' },
          }),
          stock_quantity: null,
          weight: '',
          date_created: '',
          date_modified: '',
        } as unknown as WooCommerceProduct,
        category,
        slug,
        // T31 — real tab HTML for the 12 in-scope cluster pages; null otherwise.
        specificationsHtml: t31Tabs?.specificationsHtml || '',
        shippingHtml: t31Tabs?.shippingHtml || '',
        relatedProducts,
        // productImages prop removed: it was never destructured/used in the component
        // (the gallery uses getProductImages() from product.images), and serializing
        // it added ~7KB of dead data to __NEXT_DATA__.
        rankMathSEO,
        reviews,
        variantData,
      },
    };
  } catch (error) {
    // A transient backend failure (network/timeout/5xx/429, surfaced as
    // BackendFetchError by fetchLightweightProduct) must NOT become a false 404 —
    // that would deindex a real product. Re-throw so Next returns HTTP 500
    // (retryable by Google) instead of notFound. A GENUINE missing product is
    // handled above (product === null → notFound) and only happens when the backend
    // responded successfully; the category-mismatch 404 likewise only runs after a
    // successful fetch. Only the error message is logged (no request URL / keys).
    console.error(
      'Product SSR failed, returning 5xx, not 404:',
      error instanceof Error ? error.message : 'unknown error'
    );
    throw error instanceof Error ? error : new Error('Failed to render product');
  }
};

const ProductDetails = ({ product, category, slug, relatedProducts, rankMathSEO, reviews = [], specificationsHtml = '', shippingHtml = '', variantData = null }: ProductDetailsProps) => {
  // All hooks must be called FIRST, before any conditional logic
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Parse short description table data
  const shortDescriptionData = useMemo(() => {
    return parseShortDescriptionTableSSR(product?.short_description || '');
  }, [product?.short_description]);

  // Extract buttons from short description
  const shortDescriptionButtons = useMemo(() => {
    return extractButtonsFromShortDescription(product?.short_description || '');
  }, [product?.short_description]);

  // Transform product data to match Vite design
  const transformedProduct = useMemo(() => {
    if (!product) return null;
    
    return {
      id: product.id,
      title: product.name,
      slug: product.slug,
      content: product.short_description || '',
      description: product.description || '',
      featured_image: product.images?.[0]?.src || '/placeholder.svg',
      price: product.price || 'Contact for pricing',
      regular_price: product.regular_price || product.price || 'Contact for pricing',
      sale_price: product.sale_price || product.price || 'Contact for pricing',
      on_sale: product.on_sale || false,
      features: ['Professional Design', 'High Quality', 'Durable', 'Customizable', 'Weather Resistant'],
      category: product.categories?.[0]?.name || 'Uncategorized',
      categoryId: product.categories?.[0]?.id?.toString() || '1',
      categories: product.categories || [],
      rating: parseFloat(product.average_rating) || 0,
      reviews: typeof product.rating_count === 'string' ? parseInt(product.rating_count) || 0 : product.rating_count || 0,
      date: product.date_created || '2024-01-01',
      stock_status: product.stock_status || 'instock',
      images: product.images || [],
      attributes: product.attributes || [],
    };
  }, [product]);

  // Get primary category for breadcrumb
  const primaryCategory = product?.categories?.[0] || { name: 'Uncategorized', slug: 'uncategorized' };

  // SHIKHAR C1 — single source for BOTH the visible breadcrumb and the
  // BreadcrumbList JSON-LD (fed to ProductStructuredData below), so they match
  // exactly: Home › Products › {Cluster} › {Product}, cluster node linked to its hub.
  const breadcrumbCrumbs = getProductBreadcrumb({
    productName: product?.name || '',
    productSlug: slug,
    clusterName: primaryCategory.name,
    clusterSlug: primaryCategory.slug,
    isHub: false,
  });

  // Handle scroll to top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} 
      />
    ));
  }, []);

  // Transform related products to match Vite design
  const transformedRelatedProducts = useMemo(() => {
    return relatedProducts.map((p) => {
      const catSlug = p.categories && p.categories.length > 0 ? p.categories[0].slug : 'default';
      const catName = p.categories && p.categories.length > 0 ? p.categories[0].name : 'Uncategorized';
      const url = getNavigableProductPath(p);
      return {
        id: p.id,
        title: p.name,
        slug: p.slug,
        category: catName,
        categorySlug: catSlug,
        image: p.images && p.images.length > 0 ? p.images[0].src : '/placeholder.svg',
        price: p.price || 'Contact for pricing',
        rating: parseFloat(p.average_rating) || 0,
        ratingCount: Number(p.rating_count) || 0,
        description: cleanText((p as any).short_description || p.description || '', 130),
        url,
        seoAnchorText: p.name,
      };
    });
  }, [relatedProducts]);

  const relatedRailItems = useMemo<RelatedRailItem[]>(() => {
    const currentSlug = transformedProduct?.slug || slug;
    if (isC16PanelSlug(currentSlug)) {
      return getC16PanelSiblingRail(currentSlug);
    }

    const built = transformedRelatedProducts.map((relatedProduct) => ({
      title: relatedProduct.seoAnchorText || relatedProduct.title,
      href: relatedProduct.url || `/product/${relatedProduct.categorySlug || 'default'}/${relatedProduct.slug}`,
      category: relatedProduct.category,
      blurb: relatedProduct.description || 'Factory-direct product from SAMAN Portable. Open the product page for sizes, specifications and quotation details.',
      imageSrc: relatedProduct.image && relatedProduct.image !== '/placeholder.svg' ? relatedProduct.image : undefined,
      imageAlt: relatedProduct.title,
    }));

    // T25 — S4 strip order is LOCKED by the internal-linking matrix v2: hub first,
    // then exactly the three assigned siblings. Applies only to porta cabin
    // cluster slugs; every other product keeps the live related ordering.
    if (isPortaCabinStripSlug(currentSlug)) {
      return orderPortaCabinStrip(currentSlug, built, (item) => slugFromProductHref(item.href));
    }

    return built;
  }, [slug, transformedProduct?.slug, transformedRelatedProducts]);

  const embeddedCalculatorMapping = useMemo(() => resolveEmbeddedCalculatorProduct(category, slug), [category, slug]);
  const embeddedCalculatorSummary = useMemo(() => (
    embeddedCalculatorMapping ? getEmbeddedProductSummary(embeddedCalculatorMapping.productId, embeddedCalculatorMapping.ladderKey, product?.name) : null
  ), [embeddedCalculatorMapping]);

  const embeddedCalculatorSummaryText = useMemo(() => {
    if (!embeddedCalculatorSummary) return '';
    return `${embeddedCalculatorSummary.name} | ${embeddedCalculatorSummary.priceLabel}`;
  }, [embeddedCalculatorSummary]);

  const embeddedCalculatorHtml = useMemo(() => {
    if (!embeddedCalculatorMapping) return null;
    return renderCabinCalculatorSSR({
      embedded: true,
      config: {
        productId: embeddedCalculatorMapping.productId,
      },
      ladderKey: embeddedCalculatorMapping.ladderKey,
      // This page's own approved product name, never its hub's.
      productName: product?.name,
      pageUrl: makeCalculatorPageUrl(category, slug),
    });
  }, [category, slug, embeddedCalculatorMapping]);

  // Prevent hydration mismatch by only showing dynamic content after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!product) {
    return (
      <Layout>
        <main className="section-padding bg-background">
          <div className="max-w-7xl mx-auto container-padding text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground">Product not found</h1>
          </div>
        </main>
      </Layout>
    );
  }

  // Get product images
  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [{ src: '/placeholder.svg', alt: 'No Image' }];
  };

  const images = getProductImages();

  return (
    <Layout>
      {!transformedProduct ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/product">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Unified SEO - Single source of truth for all meta tags */}
        <UnifiedSEO 
          rankMathSEO={rankMathSEO} 
          fallbackCanonical={`https://www.samanportable.com/product/${category}/${slug}`}
          fallbackTitle={`${transformedProduct.title} - Saman Portable`}
          fallbackDescription={`${transformedProduct.title} - Quality portable solution by Saman Portable. Professional design and reliable construction.`}
          fallbackOgImage={product.images?.[0]?.src || '/og-image.svg'}
          fallbackOgDescription={`${transformedProduct.title} - Premium portable structures with advanced features and customization options.`}
          fallbackTwitterDescription={`${transformedProduct.title} - Durable and reliable portable solutions for your business needs.`}
          keywords={`${transformedProduct.title}, ${transformedProduct.category}, portable solutions`}
          structuredData={undefined} // ProductStructuredData component handles this separately
        />
          
          {/* Product Structured Data for Google Merchant Center.
              Review JSON-LD is emitted ONLY for the same real approved reviews
              that are rendered in the Customer Reviews section below. */}
          <ProductStructuredData product={product} category={category} reviews={reviews} breadcrumbItems={crumbsToJsonLd(breadcrumbCrumbs)} variantData={variantData || undefined} />

          {/* FAQ Structured Data: the approved variant dataset owns its rendered
              FAQs; legacy products continue to use RankMath. */}
          {(variantData?.faqSchema || rankMathSEO?.faqSchema) && (
            <Head>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(variantData?.faqSchema || rankMathSEO?.faqSchema) }}
              />
            </Head>
          )}
          {embeddedCalculatorHtml && (
            <Head>
              <script defer src="/scripts/cabin-cost-calculator.js" />
            </Head>
          )}

          <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

              {/* SHIKHAR C1 — cluster-parent breadcrumb. Visible trail is projected from
                  the SAME array as the BreadcrumbList JSON-LD above, so they match
                  exactly: Home › Products › {Cluster} › {Product}. */}
              <Breadcrumb items={crumbsToDsItems(breadcrumbCrumbs)} className="mb-4" />

              {/* T28 — contained 3-column equal-height hero (summary 35 / gallery 40 /
                  related 25). ProductSummaryLayout is the single layout source shared
                  with the bespoke product pages: the gallery column establishes the row
                  height; the summary and related columns are height-contained and scroll
                  internally, so the rail can never bleed over the sections below. */}
              {variantData ? (
                /* T25 — sibling subpage with a size-variant data file renders the
                   T24.1 variant hero (related rail 25 / gallery+zone-contacts 40 /
                   info-only buy box 35, size chips, Size & Applications Explorer,
                   deep-link fragments, sticky mobile CTA). The rail renders INSIDE
                   the hero, so the separate position-9 strip below is skipped for
                   these pages — related cards appear exactly once. */
                <PortaCabinVariantHero
                  data={variantData}
                  productTitle={transformedProduct.title}
                  averageRating={product.average_rating}
                  ratingCount={product.rating_count}
                  railItems={relatedRailItems}
                  currentHref={`/product/${category}/${slug}`}
                />
              ) : (
              <ProductSummaryLayout
                variant="summary-first"
                rail={
                  <RelatedProductRail
                    items={relatedRailItems}
                    currentHref={`/product/${category}/${slug}`}
                    className="bg-white/80 shadow-lg lg:h-auto lg:min-h-full"
                    scroll
                  />
                }
                gallery={
                  <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm lg:h-full lg:flex lg:flex-col">
                    <div className="space-y-2 lg:flex lg:flex-1 lg:flex-col">
                      {/* Main Image Slider */}
                      <div className="relative group">
                        {/* T28 — 1:1 ratio box at ALL breakpoints (square product assets render
                            uncropped; CSS aspect-ratio reserves the space → CLS 0). The gallery
                            column (image + thumbnails) sets the hero row height — no forced ratio
                            on the section itself. max-h clamp keeps the hero on one screen for
                            short laptops; both constraints are viewport-deterministic (CLS-safe). */}
                        <div className="aspect-square max-h-[calc(100vh-280px)] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden relative">
                          {transformedProduct.featured_image && transformedProduct.featured_image !== '/placeholder.svg' ? (
                            <Image 
                              src={images[selectedImageIndex]?.src || transformedProduct.featured_image}
                              unoptimized={shouldBypassOptimizer(images[selectedImageIndex]?.src || transformedProduct.featured_image)}
                              alt={transformedProduct.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              width={800}
                              height={600}
                              priority={true}
                              fetchPriority="high"
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                              // T30 / T24.1-IMG §5.1 — same correction as the hub/variant
                              // heroes: contained by the page padding (px-4 <640,
                              // px-6 >=640) and the gallery Card (p-2), so the hero
                              // renders 100vw-48px / 100vw-64px, never the full
                              // viewport. 100vw made mobile pull the w=1200 variant.
                              sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 64px), 40vw"
                              quality={85}
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=${encodeURIComponent(transformedProduct.title)}`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <div className="text-center">
                                <div className="text-6xl opacity-60 mb-4">📦</div>
                                <p className="text-muted-foreground">No image available</p>
                                <p className="text-sm text-muted-foreground">Contact us for details</p>
                              </div>
                            </div>
                          )}
                          {/* Image Navigation Arrows */}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                                aria-label="Previous image"
                              >
                                <ArrowLeft className="w-5 h-5 text-gray-700" />
                              </button>
                              <button
                                onClick={() => setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                                aria-label="Next image"
                              >
                                <ArrowLeft className="w-5 h-5 text-gray-700 rotate-180" />
                              </button>
                            </>
                          )}
                          {/* Image Counter */}
                          {images.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                              {selectedImageIndex + 1} / {images.length}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Thumbnail Images */}
                      {images.length > 1 && (
                        <div className="grid grid-cols-5 gap-3">
                          {images.map((image: any, index: number) => (
                            <button
                              key={index}
                              className={`aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                selectedImageIndex === index 
                                  ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                                  : 'border-transparent hover:border-primary/50'
                              }`}
                              onClick={() => setSelectedImageIndex(index)}
                            >
                              {image.src && image.src !== '/placeholder.svg' ? (
                                <Image 
                                  src={image.src}
                                  unoptimized={shouldBypassOptimizer(image.src)}
                                  alt={`${transformedProduct.title} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  width={150}
                                  height={150}
                                  loading="lazy"
                                  placeholder="blur"
                                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXwGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                  sizes="(max-width: 768px) 25vw, 150px"
                                  quality={75}
                                  onError={(e) => {
                                    e.currentTarget.src = `https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=${encodeURIComponent(transformedProduct.title)}`;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                  <div className="text-2xl opacity-60">📷</div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Dynamic Buttons from Short Description */}
                      {isHydrated && shortDescriptionButtons.length > 0 && (
                        <div className="flex gap-3 mt-4">
                          {shortDescriptionButtons.map((button, index) => (
                            <Button
                              key={index}
                              className="flex-1 bg-black hover:bg-gray-800 text-white rounded-lg py-3 px-4 font-medium transition-all duration-200 hover:scale-105"
                              onClick={() => {
                                if (button.href) {
                                  window.open(button.href, '_blank');
                                } else {
                                  console.log(`${button.text} clicked`);
                                }
                              }}
                            >
                              {button.text}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* T28.4 — zone-contact CTAs live in the GALLERY column, under the
                          thumbnails, as the LAST row; lg flex-1 stretches the two zone
                          cards equally to absorb remaining column space so the gallery
                          bottom edge meets the other two columns. Markup verbatim. */}
                      <div className="-mx-2 pt-1 md:pt-3 lg:flex lg:flex-1">
                        <ProductZoneCtas variant="strip" className="w-full" stretch />
                      </div>
                    </div>
                  </Card>
                }
                description={
                  <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden lg:min-h-full">
                    <div className="space-y-4">
                      
                      {/* Title and Price */}
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight break-words">
                            {transformedProduct.title}
                          </h1>
                          {/* Real ratings only: render stars/review count solely when
                              WooCommerce has genuine reviews (rating_count > 0). No fake stars. */}
                          {product.rating_count > 0 && (
                            <div className="flex items-center space-x-2 flex-wrap">
                              <div className="flex items-center space-x-1">
                                {renderStars(parseFloat(product.average_rating) || 0)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({product.rating_count} {product.rating_count === 1 ? 'review' : 'reviews'})
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {transformedProduct.on_sale && transformedProduct.sale_price ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                              <span className="text-2xl md:text-3xl font-bold text-primary break-words">{formatPriceWithCurrency(parseFloat(transformedProduct.sale_price))}</span>
                              <span className="text-lg md:text-xl text-muted-foreground line-through break-words">{formatPriceWithCurrency(parseFloat(transformedProduct.regular_price))}</span>
                              {/* Sale badge removed */}
                            </div>
                            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-2xl md:text-3xl font-bold text-primary break-words">
                              {transformedProduct.price === 'Contact for pricing' ? 'Contact for pricing' : formatPriceWithCurrency(parseFloat(transformedProduct.price))}
                            </span>
                            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
                          </div>
                        )}
                      </div>

                          {/* Short Description */}
                          <div className="space-y-3">
                         
                          {/* Short Description Content from WordPress */}
                          {product.short_description && (
                            <div 
                              className="text-muted-foreground text-sm leading-relaxed mb-4 short-description-content"
                              dangerouslySetInnerHTML={{ 
                                __html: product.short_description 
                              }}
                            />
                          )}

                          {/* Dynamic Specifications Table (only if data is found and not already in description) */}
                          {Object.keys(shortDescriptionData).length > 0 && !product.short_description?.includes('<table') && (
                            <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200 mb-4">
                              <table className="w-full">
                                <tbody>
                                  {Object.entries(shortDescriptionData).map(([key, value], index, array) => (
                                    <tr 
                                      key={key} 
                                      className={cn(
                                        index !== array.length - 1 && "border-b border-slate-200"
                                      )}
                                    >
                                      <td className="px-3 py-2 font-semibold text-foreground bg-slate-100/80 text-xs uppercase tracking-wider w-1/3">{key}</td>
                                      <td className="px-3 py-2 text-muted-foreground text-sm break-words">
                                        {value}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          </div>

                      {/* Actions — enquiry-only business (owner-approved):
                          Add to Cart replaced by a direct Call button; the quantity
                          stepper only served the cart and was removed with it. */}
                      {/* Product Info */}
                      <div className="space-y-3 pt-6 border-t border-slate-200">
                        <h3 className="text-lg font-semibold text-foreground">Product Information</h3>
                        <div className="space-y-2 text-sm">
                          {/* Real WooCommerce SKU only; row hidden when the product has none. */}
                          {product.sku && (
                            <div className="flex justify-between items-center py-2">
                              <span className="font-medium text-foreground">SKU:</span>
                              <span className="text-muted-foreground break-words">{product.sku}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium text-foreground">Category:</span>
                            <Link href={categoryHref(primaryCategory.slug)} className="text-primary hover:underline font-medium break-words text-right">
                              {transformedProduct.category}
                            </Link>
                          </div>
                        </div>
                      </div>

                    </div>
                  </Card>
                }
                mobileRail={
                  <RelatedProductRail items={relatedRailItems} currentHref={`/product/${category}/${slug}`} />
                }
              />
              )}

              {embeddedCalculatorHtml && (
                <section className="mt-4">
                  <details className="rounded-xl border border-slate-200 bg-white/90 shadow-sm">
                    <summary className="cursor-pointer list-none px-4 py-3">
                      <span className="text-lg font-semibold text-foreground">{CLOSED_STATE.label}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{CLOSED_STATE.subLine}</span>
                      <span className="ml-2 text-sm font-medium underline">{CLOSED_STATE.control}</span>
                    </summary>
                    <div className="mt-3 px-1 pb-1" dangerouslySetInnerHTML={{ __html: embeddedCalculatorHtml }} />
                  </details>
                </section>
              )}

              {/* Product Tabs */}
              <div className="mt-4">
                <ProductTabs
                  description={product.description || ''}
                  specificationsHtml={specificationsHtml}
                  shippingHtml={shippingHtml}
                  productTitle={transformedProduct.title}
                  reviews={reviews}
                  averageRating={product.average_rating}
                  ratingCount={product.rating_count}
                  productId={product.id}
                  productName={transformedProduct.title}
                />
              </div>

              {slug === 'portacabin-office' && (
                <section
                  className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  aria-labelledby="portacabin-office-word-forms"
                >
                  <h3 id="portacabin-office-word-forms" className="mb-3 text-xl font-bold text-slate-900">
                    Porta cabin office or portacabin office?
                  </h3>
                  <p className="m-0 text-sm leading-relaxed text-slate-700">
                    Buyers write it both ways and mean the same thing: a factory-built cabin fitted out as a working office. We build one product for both spellings: the configuration described on this page, with workstations, storage and an optional manager partition, finished a grade above the plain site cabin. If you searched for a porta cabin office and landed here, you are in the right place; the specification, the nine sizes and the prices above are what you were looking for.
                  </p>
                </section>
              )}

              {/* Manufacturer Trust Strip ★ NEW (links to /about-us#certifications) */}
              <div className="mt-4">
                <ManufacturerTrustStrip />
              </div>

              {/* Related Products Section — SKIPPED for the variant-hero pages
                  (T25, mirroring the hub route): the related rail lives inside the
                  hero — desktop column 1, mobile last — so these cards must appear
                  exactly once. Every other subpage keeps the desktop-only slider
                  unchanged. */}
              {!variantData && (
              <div className="mt-4 hidden lg:block">
                <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">Related Products</h3>
                          <p className="text-sm text-muted-foreground">Explore similar items</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => {
                            const container = document.getElementById('related-products-slider');
                            if (container) {
                              container.scrollBy({ left: -256, behavior: 'smooth' });
                            }
                          }}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => {
                            const container = document.getElementById('related-products-slider');
                            if (container) {
                              container.scrollBy({ left: 256, behavior: 'smooth' });
                            }
                          }}
                        >
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative w-full overflow-hidden">
                       <div 
                         id="related-products-slider"
                         className="related-products-slider flex space-x-4 overflow-x-auto scroll-smooth pb-2"
                       >
                        {transformedRelatedProducts.length > 0 ? (
                          transformedRelatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct.id} className="flex-shrink-0 w-64 min-w-64">
                              <Card className="h-full border border-slate-200 hover:border-primary/50 transition-all duration-200 hover:shadow-lg group">
                                <div className="p-4 space-y-3">
                                  {/* Product Image */}
                                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden relative">
                                    <Image 
                                      src={relatedProduct.image || `https://via.placeholder.com/320x240/3B82F6/FFFFFF?text=${encodeURIComponent(relatedProduct.title)}`}
                                      unoptimized={shouldBypassOptimizer(relatedProduct.image || `https://via.placeholder.com/320x240/3B82F6/FFFFFF?text=${encodeURIComponent(relatedProduct.title)}`)}
                                      alt={relatedProduct.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      width={320}
                                      height={240}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://via.placeholder.com/320x240/3B82F6/FFFFFF?text=${encodeURIComponent(relatedProduct.title)}`;
                                      }}
                                    />
                                    {relatedProduct.slug === slug && (
                                      <div className="absolute top-2 left-2 bg-[#126e4c] text-white text-xs px-2 py-1 rounded-md font-medium">
                                        Current
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Product Info */}
                                  <div className="space-y-2">
                                    <Link
                                      href={relatedProduct.url}
                                      className="block group/link"
                                    >
                                      <h4 className="font-semibold text-foreground line-clamp-2 group-hover/link:text-primary transition-colors">
                                        {relatedProduct.seoAnchorText}
                                      </h4>
                                    </Link>
                                    
                                    <div className="flex items-center justify-between">
                                      <Badge variant="secondary" className="text-xs">
                                        {relatedProduct.category}
                                      </Badge>
                                      {relatedProduct.ratingCount > 0 && (
                                        <div className="flex items-center space-x-1">
                                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                          <span className="text-xs text-muted-foreground">{relatedProduct.rating}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-lg font-bold text-primary">
                                        {relatedProduct.price === 'Contact for pricing' 
                                          ? 'Contact for pricing' 
                                          : formatPriceWithCurrency(parseFloat(relatedProduct.price))
                                        }
                                      </span>
                                      <Link
                                        href={relatedProduct.url}
                                        className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-8 px-3 py-1.5 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                      >
                                        View Details
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center w-full py-12">
                            <div className="text-center">
                              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                              <p className="text-muted-foreground">No related products available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              )}

              {/* Cluster Hub Link */}
              <div className="mt-4 text-center">
                <Link
                  href={getHubUrl(category)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary"
                >
                  {category === 'porta-cabins' && c01HubReturnAnchorForSlug(slug)
                    ? c01HubReturnAnchorForSlug(slug)
                    : <>See the full range: {getSeoAnchorText(category) || transformedProduct?.category || 'Products'}</>}
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>

            </div>
          </main>
          
          {/* Scroll to Top Button */}
          {showScrollToTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-20 sm:bottom-6 right-6 z-50 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ArrowLeft className="w-5 h-5 rotate-90" />
            </button>
            )}

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav relatedProducts={transformedRelatedProducts} />
        </>
      )}
    </Layout>
  );
};

export default ProductDetails;


