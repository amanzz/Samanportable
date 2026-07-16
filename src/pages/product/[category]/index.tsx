import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import Layout from '../../../components/Layout';
// import SEO from '../../../components/SEO'; // Removed to avoid duplicate meta tags
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
import Link from 'next/link';
import { cn, formatPriceWithCurrency, parseShortDescriptionTableSSR, extractButtonsFromShortDescription } from '../../../lib/utils';
import { getSeoAnchorText, getHubUrl } from '../../../lib/seoAnchorMap';
import { Breadcrumb } from '../../../components/ds/Breadcrumb';
import { getProductBreadcrumb, crumbsToDsItems, crumbsToJsonLd } from '../../../lib/breadcrumbs';
import { categoryHref } from '../../../lib/categoryHubMap';
import { generateProductMetaDescription, generateProductTabContent } from '../../../utils/contentUtils';
// import { generateProductSchema } from '../../../lib/schema'; // Removed to avoid duplicate schemas
import ProductStructuredData from '../../../components/ProductStructuredData';
import RelatedProductRail from '../../../components/product/RelatedProductRail';
import ProductZoneCtas from '../../../components/product/ProductZoneCtas';
import ProductSummaryLayout from '../../../components/product/ProductSummaryLayout';
import SandwichInfoBox from '../../../components/product-sandwich/SandwichInfoBox';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { cleanText } from '../../../lib/merchantFeed';
import { getC16PanelSiblingRail, isC16PanelSlug, type RelatedRailItem } from '../../../lib/c16PanelCatalog';

const SAFE_PRODUCT_SLUG = /^[a-z0-9-]+$/;

// Dynamic import for ProductTabs to avoid SSR issues
const ProductTabs = dynamic(() => import('../../../components/ProductTabs'), {
  ssr: true,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
});



interface ProductDetailsProps {
  product: WooCommerceProduct | null;
  category: string;
  relatedProducts: WooCommerceProduct[];
  productImages?: Array<{ src: string; alt: string }>;
  rankMathSEO?: RankMathSEOData | null;
  reviews?: ProductReview[];
}

type PrefabricatedWarehouseLink = {
  label: string;
  context: string;
};

const PREFABRICATED_WAREHOUSE_SOURCE_LINKS: Record<string, PrefabricatedWarehouseLink> = {
  'prefab-buildings': {
    label: 'prefabricated warehouse options',
    context: 'Compare warehouse-grade prefab building formats for industrial storage and dispatch requirements.',
  },
  'industrial-sheds': {
    label: 'steel warehouse building solutions',
    context: 'Review prefabricated warehouse structures when a shed needs larger covered storage capacity.',
  },
  'peb-constructions': {
    label: 'warehouse building solutions',
    context: 'Explore prefabricated warehouse choices alongside PEB construction planning.',
  },
  'pre-engineered-buildings': {
    label: 'prefab industrial warehouse options',
    context: 'See warehouse-focused prefab options for pre-engineered industrial building projects.',
  },
};

const RelatedPrefabricatedWarehouseResource = ({ category }: { category: string }) => {
  const resource = PREFABRICATED_WAREHOUSE_SOURCE_LINKS[category];
  if (!resource) return null;

  return (
    <section className="mt-4 rounded-lg border border-amber-100 bg-amber-50/50 p-4 sm:p-5" aria-labelledby="related-prefabricated-warehouse-resource">
      <h2 id="related-prefabricated-warehouse-resource" className="text-lg font-semibold text-slate-900 mb-2">Related Prefabricated Warehouse Resource</h2>
      <p className="text-sm text-slate-700 leading-relaxed mb-3">{resource.context}</p>
      <Link
        href="/product/industrial-sheds"
        className="inline-flex items-center gap-2 rounded-md border border-amber-100 bg-white px-4 py-2 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-amber-300 hover:bg-amber-50"
      >
        {resource.label}
        <ArrowLeft className="w-4 h-4 rotate-180" />
      </Link>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps<ProductDetailsProps> = async ({ params }) => {
  try {
    const { category } = params as { category: string };
    
    if (!category) {
      return {
        notFound: true,
      };
    }

    // Static content layer: reads exported product files — no WordPress call.
    // Server-only module, loaded dynamically so fs never reaches the client bundle.
    const staticContent = await import('../../../lib/staticContent');

    // Fetch lightweight product data first
    const product = await staticContent.fetchLightweightProduct(category);
    
    if (!product) {
      return {
        notFound: true,
      };
    }

    // Verify if the product belongs to the specified category
    const productCategorySlug = product.category_slug.toLowerCase();
    const urlCategory = decodeURIComponent(category).toLowerCase();
    
    if (productCategorySlug !== urlCategory && !productCategorySlug.includes(urlCategory)) {
      return {
        notFound: true,
      };
    }

    // Get related products from the same category (lightweight) - OPTIMIZED
    let relatedProducts: WooCommerceProduct[] = [];
    try {
      // SHIKHAR T9 Part B: fetch ALL subpages of the cluster (uncapped) so every
      // subpage is linked from its hub. The prior cap of 12 left the 13–14-subpage
      // clusters (portable-office, container-offices, container-cafe, porta-cabins)
      // with orphaned tail subpages that had no hub link on desktop OR mobile.
      // 100 is safe headroom over the largest cluster (~15 incl. the hub-self product).
      const relatedResponse = await staticContent.fetchProducts(1, 100, {
        category: product.category_slug
      });
      // Filter out the current product manually since exclude is not supported
      relatedProducts = (relatedResponse.products || []).filter(p => p.id !== product.id);

      const relatedProductSlugs = Array.isArray((product as any).relatedProductSlugs)
        ? (product as any).relatedProductSlugs
        : [];
      if (relatedProductSlugs.length > 0) {
        const overrideProducts = await Promise.all(
          relatedProductSlugs.map(async (relatedSlug: string) => staticContent.fetchLightweightProduct(relatedSlug))
        );
        relatedProducts = overrideProducts
          .filter(Boolean)
          .map((related: any) => ({
            id: related.id,
            name: related.name,
            slug: related.slug,
            price: related.price,
            average_rating: related.average_rating,
            rating_count: related.rating_count,
            categories: [
              {
                id: 0,
                name: related.category || 'Uncategorized',
                slug: related.category_slug || 'uncategorized',
              },
            ],
            images: related.featured_image
              ? [{ id: 0, src: related.featured_image, alt: related.name }]
              : [],
          })) as unknown as WooCommerceProduct[];
      }

    } catch (error) {
      console.error('Error fetching related products:', error);
      // Silent error handling for production
    }

    // Fetch full description and images separately
    const descriptionData = await staticContent.fetchProductDescription(category);

    // Fetch REAL approved backend reviews — ONLY when the product actually has
    // ratings (rating_count > 0), so unrated products skip the extra API call.
    // fetchProductReviews is non-fatal (returns [] on any error) so a reviews
    // problem never breaks the page or causes a false 404.
    let reviews: ProductReview[] = [];
    if (product.rating_count > 0) {
      reviews = await staticContent.fetchProductReviews(product.id, 5);
    }
    const sourceAttributes = SAFE_PRODUCT_SLUG.test(category)
      ? await import(`../../../data/wp-export/products/${category}.json`)
          .then((mod: { default?: { attributes?: WooCommerceProduct['attributes'] } }) =>
            Array.isArray(mod.default?.attributes) ? mod.default.attributes : []
          )
          .catch(() => [])
      : [];

    // Fetch Rank Math SEO data with fallback
    let rankMathSEO: RankMathSEOData | null = null;
    try {
      rankMathSEO = await staticContent.fetchProductRankMathSEO(category);
      
      // If RankMath data is empty or incomplete, create fallback SEO data
      if (!rankMathSEO || Object.keys(rankMathSEO).length === 0) {
        // Create unique descriptions for each purpose to avoid duplication
        const baseDescription = product.short_description?.replace(/<[^>]*>/g, '').substring(0, 120) || product.name;
        const metaDescription = `${baseDescription} - Quality portable solution by Saman Portable.`;
        const ogDescription = `${product.name} - Premium portable structures with customization options.`;
        const twitterDescription = `${product.name} - Durable and reliable portable solutions.`;
        
        rankMathSEO = {
          title: product.name + ' - Saman Portable',
          description: metaDescription,
          canonical: `https://www.samanportable.com/product/${category}`,
          og_title: product.name,
          og_description: ogDescription,
          og_image: product.featured_image || 'https://www.samanportable.com/og-image.svg',
          og_locale: 'en_US',
          twitter_title: product.name,
          twitter_description: twitterDescription,
          twitter_image: product.featured_image || 'https://www.samanportable.com/og-image.svg',
          robots: { index: 'index', follow: 'follow' }
        };
      }
    } catch (error) {
      console.warn('Failed to fetch Rank Math SEO data:', error);
      // Create fallback SEO data with unique descriptions
      const baseDescription = product.short_description?.replace(/<[^>]*>/g, '').substring(0, 120) || product.name;
      const metaDescription = `${baseDescription} - Quality portable solution by Saman Portable.`;
      const ogDescription = `${product.name} - Premium portable structures with customization options.`;
      const twitterDescription = `${product.name} - Durable and reliable portable solutions.`;
      
      rankMathSEO = {
        title: product.name + ' - Saman Portable',
        description: metaDescription,
        canonical: `https://www.samanportable.com/product/${category}`,
        og_title: product.name,
        og_description: ogDescription,
        og_image: product.featured_image || 'https://www.samanportable.com/og-image.svg',
        og_locale: 'en_US',
        twitter_title: product.name,
        twitter_description: twitterDescription,
        twitter_image: product.featured_image || 'https://www.samanportable.com/og-image.svg',
        robots: { index: 'index', follow: 'follow' }
      };
    }

    return {
      props: {
        product: {
          ...product,
          description: descriptionData?.description || '',
          // Optional per-product tab overrides (additive; empty for all other products).
          specificationsHtml: descriptionData?.specificationsHtml || '',
          shippingHtml: descriptionData?.shippingHtml || '',
          images: descriptionData?.images?.map((img, index) => ({
            id: index,
            src: img.src,
            alt: img.alt,
            name: img.alt || `Image ${index + 1}`
          })) || [],
          // Preserve category info so UI doesn't fall back to "Uncategorized"
          categories: [
            {
              id: 0,
              name: (product as any).category || 'Uncategorized',
              slug: (product as any).category_slug || 'uncategorized'
            }
          ],
          schemaMode: (product as any).schemaMode || '',
          priceDisplay: (product as any).priceDisplay || '',
          priceSubline: (product as any).priceSubline || '',
          attributes: sourceAttributes,
          stock_quantity: null,
          weight: '',
          dimensions: { length: '', width: '', height: '' },
          date_created: '',
          date_modified: '',
        } as unknown as WooCommerceProduct,
        category,
        relatedProducts,
        // `|| []` guard: when the description fetch fails, descriptionData is null and
        // `?.images` is `undefined`, which Next.js cannot serialize as a prop → 500.
        // An empty array is serializable (the prop is optional and unused downstream).
        productImages: descriptionData?.images || [],
        rankMathSEO,
        reviews,
      },
    };
  } catch (error) {
    // A transient backend failure (network/timeout/5xx/429, surfaced as
    // BackendFetchError by fetchLightweightProduct) must NOT become a false 404 —
    // that would deindex a real product. Re-throw so Next returns HTTP 500
    // (retryable by Google) instead of notFound. A GENUINE missing product is
    // handled above (product === null → notFound) and only happens when the backend
    // responded successfully. Only the error message is logged (no request URL / keys).
    console.error(
      'Product (category index) SSR failed — returning 5xx, not 404:',
      error instanceof Error ? error.message : 'unknown error'
    );
    throw error instanceof Error ? error : new Error('Failed to render product');
  }
};

const ProductDetails = ({ product, category, relatedProducts, rankMathSEO, reviews = [] }: ProductDetailsProps) => {
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

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Get product images
  const getProductImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    return [{ src: '/placeholder.svg', alt: 'No Image' }];
  };

  const images = getProductImages();

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
      priceDisplay: (product as any).priceDisplay || '',
      priceSubline: (product as any).priceSubline || '',
    };
  }, [product]);

  // Get primary category for breadcrumb
  const primaryCategory = product?.categories?.[0] || { name: 'Uncategorized', slug: 'uncategorized' };
  const isSandwichPanel = product?.slug === 'sandwich-panel';

  // SHIKHAR C1 — the hub IS its cluster, so the trail is Home › Products › {Cluster}
  // (no duplicate leaf). Same array drives the visible breadcrumb and the
  // ProductStructuredData BreadcrumbList JSON-LD, so they match exactly.
  const breadcrumbCrumbs = getProductBreadcrumb({
    productName: product?.name || '',
    productSlug: product?.slug || category,
    clusterName: primaryCategory.name,
    clusterSlug: primaryCategory.slug,
    isHub: true,
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
      const prodSlug = p.slug.toLowerCase();
      const catNameLower = catName.toLowerCase().replace(/\s+/g, '-');
      const url = catNameLower === prodSlug
        ? `/product/${catSlug}/`
        : `/product/${catSlug}/${p.slug}`;
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
    const currentSlug = transformedProduct?.slug || category;
    if (isC16PanelSlug(currentSlug)) {
      return getC16PanelSiblingRail(currentSlug);
    }

    return transformedRelatedProducts.map((relatedProduct) => ({
      title: relatedProduct.seoAnchorText || relatedProduct.title,
      href: relatedProduct.url || `/product/${relatedProduct.categorySlug || 'default'}/${relatedProduct.slug}`,
      category: relatedProduct.category,
      blurb: relatedProduct.description || 'Factory-direct product from SAMAN Portable. Open the product page for sizes, specifications and quotation details.',
      imageSrc: relatedProduct.image && relatedProduct.image !== '/placeholder.svg' ? relatedProduct.image : undefined,
      imageAlt: relatedProduct.title,
    }));
  }, [category, transformedProduct?.slug, transformedRelatedProducts]);

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
            fallbackTitle={`${transformedProduct.title} - Saman Portable`}
            fallbackDescription={`${transformedProduct.title} - Quality portable solution by Saman Portable. Professional design and reliable construction.`}
            fallbackCanonical={`https://www.samanportable.com/product/${category}`}
            fallbackOgImage={product.images?.[0]?.src || '/og-image.svg'}
            fallbackOgDescription={`${transformedProduct.title} - Premium portable structures with advanced features and customization options.`}
            fallbackTwitterDescription={`${transformedProduct.title} - Durable and reliable portable solutions for your business needs.`}
            keywords={`${transformedProduct.title}, ${transformedProduct.category}, portable solutions`}
            structuredData={undefined} // ProductStructuredData component handles this separately
          />
          
          {/* Product Schema handled by ProductStructuredData component */}

          {/* Product Structured Data for Google Merchant Center.
              Review JSON-LD is emitted ONLY for the same real approved reviews
              that are rendered in the Customer Reviews section below. */}
          <ProductStructuredData product={product} category={category} reviews={reviews} breadcrumbItems={crumbsToJsonLd(breadcrumbCrumbs)} />

          {/* FAQ Structured Data — sourced from RankMath, which mirrors the FAQ
              actually rendered in the product description below. No fake/templated FAQs. */}
          {rankMathSEO?.faqSchema && (
            <Head>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(rankMathSEO.faqSchema) }}
              />
            </Head>
          )}

          <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

              {/* SHIKHAR C1 — cluster breadcrumb. Visible trail is projected from the
                  SAME array as the BreadcrumbList JSON-LD above (Home › Products › {Cluster}). */}
              <Breadcrumb items={crumbsToDsItems(breadcrumbCrumbs)} className="mb-4" />

              {/* T28.2 — hub hero re-rendered through ProductSummaryLayout, identical
                  treatment to the generic [slug] template: summary 35 / gallery 40 /
                  related 25, gallery sets the row height, summary & rail height-contained
                  with internal scroll — the rail can never bleed over the tabs below. */}
              <ProductSummaryLayout
                variant="summary-first"
                rail={
                  <RelatedProductRail
                    items={relatedRailItems}
                    currentHref={`/product/${category}`}
                    className="bg-white/80 shadow-lg"
                    scroll
                  />
                }
                gallery={
                  <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <div className="space-y-2">
                      {/* Main Image Slider */}
                      <div className="relative group">
                        {/* T28.2 — responsive ratio box (CSS aspect-ratio reserves the space → CLS 0):
                            1:1 on mobile, 16:9 from tablet up; this box sets the hero row height. */}
                        <div className="aspect-square md:aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden relative">
                          {transformedProduct.featured_image && transformedProduct.featured_image !== '/placeholder.svg' ? (
                            <Image 
                              src={images[selectedImageIndex]?.src || transformedProduct.featured_image}
                              unoptimized={shouldBypassOptimizer(images[selectedImageIndex]?.src || transformedProduct.featured_image)}
                              alt={transformedProduct.title}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              priority={true}
                              fetchPriority="high"
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                              sizes="(max-width: 1023px) 100vw, 40vw"
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
                                  width={150}
                                  height={150}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
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
                    </div>
                  </Card>
                }
                description={
                  isSandwichPanel ? (
                    <div className="space-y-4">
                      <SandwichInfoBox
                        h1={transformedProduct.title}
                        sku={product.sku || 'SP-C16-SWP-HUB-2026'}
                        averageRating={product.average_rating}
                        ratingCount={product.rating_count}
                      />
                      {/* Zone-contact CTAs — re-homed from the gallery column (T28.2);
                          SandwichInfoBox has no CTAs of its own, so the strip renders
                          for this branch too. Markup verbatim. */}
                      <ProductZoneCtas variant="strip" className="w-full" />
                    </div>
                  ) : (
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
                              {transformedProduct.priceDisplay || (transformedProduct.price === 'Contact for pricing' ? 'Contact for pricing' : formatPriceWithCurrency(parseFloat(transformedProduct.price)))}
                            </span>
                            <p className="text-sm text-muted-foreground">{transformedProduct.priceSubline || 'Inclusive of all taxes'}</p>
                          </div>
                        )}
                      </div>

                        {/* Short Description */}
                        <div className="space-y-3">
                         
                        {/* Short Description Content from WordPress */}
                        {product?.short_description && (
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

                      {/* Zone-contact CTAs — re-homed into the summary column (T28.2),
                          markup verbatim from the gallery column. */}
                      <ProductZoneCtas variant="strip" className="w-full" />
                    </div>
                  </Card>
                  )
                }
                mobileRail={
                  <RelatedProductRail items={relatedRailItems} currentHref={`/product/${category}`} />
                }
              />

              {/* Product Tabs */}
              <div className="mt-4">
                <ProductTabs
                  description={product.description || ''}
                  specificationsHtml={(product as any).specificationsHtml || ''}
                  shippingHtml={(product as any).shippingHtml || ''}
                  productTitle={transformedProduct.title}
                  reviews={reviews}
                  averageRating={product.average_rating}
                  ratingCount={product.rating_count}
                  productId={product.id}
                  reviewProductId={isSandwichPanel ? 272770 : undefined}
                  productName={transformedProduct.title}
                />
              </div>

              <RelatedPrefabricatedWarehouseResource category={category} />

              {/* Related Products Section */}
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
                                      width={320}
                                      height={240}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://via.placeholder.com/320x240/3B82F6/FFFFFF?text=${encodeURIComponent(relatedProduct.title)}`;
                                      }}
                                    />
                                    {relatedProduct.slug === product.slug && (
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

              {/* Cluster Hub Link */}
              <div className="mt-4 text-center">
                <Link
                  href={getHubUrl(category)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary"
                >
                  See the full range: {getSeoAnchorText(category) || transformedProduct?.category || 'Products'}
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
