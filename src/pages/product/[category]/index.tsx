import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Layout from '../../../components/Layout';
// import SEO from '../../../components/SEO'; // Removed to avoid duplicate meta tags
import { UnifiedSEO } from '../../../components/UnifiedSEO';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import QuoteFormPopup from '../../../components/QuoteFormPopup';
import MobileBottomNav from '../../../components/MobileBottomNav';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  Minus,
  Plus,
  BookOpen,
  Check
} from 'lucide-react';
import { fetchLightweightProduct, fetchProductDescriptionStrict, fetchRelatedProductsStrict, WooCommerceProduct, fetchProductRankMathSEO, RankMathSEOData, fetchProductReviews, ProductReview } from '../../../config/api';
import Link from 'next/link';
import { cn, formatPriceWithCurrency, parseShortDescriptionTableSSR, extractButtonsFromShortDescription } from '../../../lib/utils';
import { getSeoAnchorText, getHubUrl } from '../../../lib/seoAnchorMap';
import { generateProductMetaDescription, generateProductTabContent } from '../../../utils/contentUtils';
import { useCart } from '../../../contexts/CartContext';
// import { generateProductSchema } from '../../../lib/schema'; // Removed to avoid duplicate schemas
import ProductStructuredData from '../../../components/ProductStructuredData';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamic import for ImagePreloader to reduce initial bundle size
const ImagePreloader = dynamic(() => import('../../../components/ImagePreloader'), {
  ssr: false,
  loading: () => null
});

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

// GATE-A REMEDY (ISR): rendered once, cached, background-revalidated hourly —
// no per-request WooCommerce fetch. fallback 'blocking' = uncached pages still
// render fully server-side on first hit. STRICT fetchers throw on transient
// failure so a failed revalidation keeps the last-good page (never a THIN-200).
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async ({ params }) => {
  try {
    const { category } = params as { category: string };
    
    if (!category) {
      return {
        notFound: true,
      };
    }

    // Fetch lightweight product data first
    const product = await fetchLightweightProduct(category);
    
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

    // Get related products from the same category (lightweight).
    // STRICT: a failed fetch THROWS (ISR keeps last-good) — the old swallow
    // pattern shipped the page with this section missing.
    const relatedProducts: WooCommerceProduct[] =
      (await fetchRelatedProductsStrict(product.category_slug)).filter(p => p.id !== product.id);

    // Fetch full description and images separately.
    // STRICT: the old null-on-failure version rendered description:'' = THIN-200.
    const descriptionData = await fetchProductDescriptionStrict(category);

    // Fetch REAL approved backend reviews — ONLY when the product actually has
    // ratings (rating_count > 0), so unrated products skip the extra API call.
    // fetchProductReviews is non-fatal (returns [] on any error) so a reviews
    // problem never breaks the page or causes a false 404.
    let reviews: ProductReview[] = [];
    if (product.rating_count > 0) {
      reviews = await fetchProductReviews(product.id, 5);
    }

    // Fetch Rank Math SEO data. STRICT: a transient failure THROWS (ISR keeps
    // last-good meta — never caches fallback meta for an hour). The genuine-empty
    // fallback below is baseline behavior and stays: it only runs after a
    // SUCCESSFUL fetch that returned no RankMath head for this page.
    let rankMathSEO: RankMathSEOData | null = await fetchProductRankMathSEO(category, true);

    // If RankMath data is genuinely empty, create fallback SEO data
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

    return {
      props: {
        product: {
          ...product,
          description: descriptionData?.description || '',
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
          attributes: [],
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
      revalidate: 3600, // ISR: background hourly revalidation (same as the [slug] blog route)
    };
  } catch (error) {
    // A transient backend failure (network/timeout/5xx/429, surfaced as
    // BackendFetchError by any STRICT fetcher above) must NOT become a false 404 —
    // that would deindex a real product. Re-throw: during an ISR background
    // revalidation Next then KEEPS the last-good cached page; on an uncached
    // first render it returns HTTP 500 (retryable by Google, never cached).
    // A GENUINE missing product is handled above (product === null → notFound).
    console.error(
      'Product (category index) ISR render failed — keeping last-good / returning 5xx, not 404:',
      error instanceof Error ? error.message : 'unknown error'
    );
    throw error instanceof Error ? error : new Error('Failed to render product');
  }
};

const ProductDetails = ({ product, category, relatedProducts, rankMathSEO, reviews = [] }: ProductDetailsProps) => {
  // All hooks must be called FIRST, before any conditional logic
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { addItem, isInCart } = useCart();
  const isProductInCart = isInCart(product?.id || 0);

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
    };
  }, [product]);

  // Get primary category for breadcrumb
  const primaryCategory = product?.categories?.[0] || { name: 'Uncategorized', slug: 'uncategorized' };

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
    console.log('Related products count:', relatedProducts.length);
    console.log('Related products:', relatedProducts.map(p => ({ name: p.name, category: p.categories?.[0]?.name })));
    
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
        description: p.description || '',
        url,
        seoAnchorText: getSeoAnchorText(catSlug) || p.name,
      };
    });
  }, [relatedProducts]);

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
          <ProductStructuredData product={product} category={category} reviews={reviews} />

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

          {/* Preload critical images for better performance */}
          <ImagePreloader 
            images={images.map(img => img.src).filter(Boolean)} 
            maxPreload={4} 
          />

          <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              
              {/* Enhanced Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm mb-4">
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  Home
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link 
                  href="/product" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  Products
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-semibold">{transformedProduct.title}</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Sidebar - Related Products (Desktop Only) */}
                <div className="hidden lg:block lg:col-span-3">
                  <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm h-fit max-h-[80vh]">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Related Products</h2>
                        <p className="text-sm text-muted-foreground">Explore similar items</p>
                      </div>
                    </div>
                    <ScrollArea className="h-[60vh] pr-4">
                      {transformedRelatedProducts.length > 0 ? (
                        <div className="space-y-3 related-products-list">
                          {transformedRelatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct.id} className="group related-product-item">
                              <Link 
                                href={`/product/${relatedProduct.categorySlug || 'default'}/${relatedProduct.slug}`} 
                                className={cn(
                                  "block p-4 rounded-lg border transition-all duration-200 hover:shadow-md relative",
                                  relatedProduct.slug === product.slug 
                                    ? "bg-[#126e4c] border-[#126e4c] shadow-lg ring-2 ring-[#126e4c]/30" 
                                    : "bg-card border-border hover:border-primary/30 hover:bg-accent/5"
                                )}
                              >
                                {/* Current Product Indicator */}
                                {relatedProduct.slug === product.slug && (
                                  <div className="absolute -top-1 -right-1 bg-[#126e4c] text-white text-xs px-2 py-0.5 rounded-md border border-white shadow-sm font-medium z-10">
                                    Current
                                  </div>
                                )}
                                <div className="flex items-start space-x-3">
                                  {/* Product Icon */}
                                  <div className={cn(
                                    "w-12 h-12 rounded-lg flex-shrink-0 border-2 flex items-center justify-center",
                                    relatedProduct.slug === product.slug 
                                      ? "border-white bg-white/20 shadow-md" 
                                      : "border-border group-hover:border-primary/50 bg-muted group-hover:bg-primary/5"
                                  )}>
                                    <ShoppingCart className={cn(
                                      "w-6 h-6",
                                      relatedProduct.slug === product.slug 
                                        ? "text-white" 
                                        : "text-muted-foreground group-hover:text-primary"
                                    )} />
                                  </div>
                                  
                                  {/* Product Info */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className={cn(
                                      "font-medium text-sm leading-tight mb-1 transition-colors line-clamp-1",
                                      relatedProduct.slug === product.slug 
                                        ? "text-white font-semibold" 
                                        : "text-foreground group-hover:text-primary"
                                    )}>
                                      {relatedProduct.seoAnchorText}
                                    </h4>
                                    
                                    {/* Category Badge */}
                                    <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                                      <Badge 
                                        variant="secondary"
                                        className={cn(
                                          "text-xs px-2 py-0.5 whitespace-nowrap",
                                          relatedProduct.slug === product.slug 
                                            ? "bg-white/20 text-white border-white/30" 
                                            : ""
                                        )}
                                      >
                                        {relatedProduct.category}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {/* Arrow Icon */}
                                  <div className={cn(
                                    "w-4 h-4 transition-transform group-hover:translate-x-1 flex items-center justify-center mr-1 mt-1",
                                    relatedProduct.slug === product.slug 
                                      ? "text-white" 
                                      : "text-muted-foreground group-hover:text-primary"
                                  )}>
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm">No products in this category.</p>
                        </div>
                      )}
                    </ScrollArea>
                  </Card>
                </div>

                {/* Middle Section - Product Images */}
                <div className="lg:col-span-5">
                  <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <div className="space-y-2">
                      {/* Main Image Slider */}
                      <div className="relative group">
                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden relative">
                          {transformedProduct.featured_image && transformedProduct.featured_image !== '/placeholder.svg' ? (
                            <Image 
                              src={images[selectedImageIndex]?.src || transformedProduct.featured_image}
                              alt={transformedProduct.title}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              priority={true}
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                </div>

                {/* Right Section - Product Details */}
                <div className="lg:col-span-4">
                  <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
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

                      {/* Quantity and Actions */}
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        {/* Quantity Selector */}
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold text-foreground">Quantity</h3>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                              <Button 
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-slate-100 rounded-none"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-4 py-1 border-x border-slate-300 font-medium text-foreground min-w-[50px] text-center text-sm">{quantity}</span>
                              <Button 
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-slate-100 rounded-none"
                                onClick={() => setQuantity(prev => prev + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            size="lg" 
                            className={`flex-1 w-full sm:w-auto py-3 px-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] ${
                              isProductInCart 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white'
                            }`}
                            onClick={() => {
                              if (!isProductInCart && transformedProduct) {
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: parseFloat(product.price || '0'),
                                  image: product.images?.[0]?.src || '/placeholder.svg',
                                  category: product.categories?.[0]?.name || 'Uncategorized',
                                  slug: product.slug,
                                });
                              }
                            }}
                            disabled={isProductInCart}
                          >
                            {isProductInCart ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Added to Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="lg" 
                            className="flex-1 w-full sm:w-auto py-3 px-4 text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-[1.02]"
                            onClick={() => setIsQuoteFormOpen(true)}
                          >
                            Send Enquiry
                          </Button>
                        </div>
                      </div>

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
                            <Link href={`/product-category/${primaryCategory.slug}`} className="text-primary hover:underline font-medium break-words text-right">
                              {transformedProduct.category}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Product Tabs */}
              <div className="mt-4">
                <ProductTabs
                  description={product.description || ''}
                  productTitle={transformedProduct.title}
                  reviews={reviews}
                  averageRating={product.average_rating}
                  ratingCount={product.rating_count}
                  productId={product.id}
                  productName={transformedProduct.title}
                />
              </div>

              {/* Related Products Section */}
              <div className="mt-4 hidden lg:block">
                <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-primary" />
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
                              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
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

              {/* Enhanced Contact CTA */}
              <Card className="mt-4 p-6 shadow-xl border-0 bg-gradient-to-br from-primary/10 via-blue-50/50 to-accent/10 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
               <div className="relative z-10 text-center">
                 <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Phone className="w-8 h-8 text-primary" />
                 </div>
                 <h3 className="text-3xl font-bold mb-4 text-foreground">Need Custom Requirements?</h3>
                 <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                   Get in touch with our experts for customized solutions and bulk orders. We&apos;re here to help you find the perfect solution.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-6 justify-center">
                   <Button 
                     size="lg" 
                     className="h-14 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                     onClick={() => window.location.href = 'tel:+919708989937'}
                   >
                     <Phone className="w-5 h-5 mr-3" />
                     Call: +91 97089 89937
                   </Button>
                   <Button 
                     variant="outline" 
                     size="lg" 
                     className="h-14 px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all duration-200 transform hover:scale-105"
                     onClick={() => setIsQuoteFormOpen(true)}
                   >
                     <Mail className="w-5 h-5 mr-3" />
                     Contact Us
                   </Button>
                 </div>
               </div>
             </Card>
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

          {/* Quote Form Popup */}
          <QuoteFormPopup isOpen={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} />

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav relatedProducts={transformedRelatedProducts} />
        </>
      )}
      
      {/* Mobile Bottom Navigation - Always visible outside conditional */}
      <MobileBottomNav relatedProducts={transformedRelatedProducts} />
    </Layout>
  );
};

export default ProductDetails;
