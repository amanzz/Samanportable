import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { fetchLightweightProductsByCategoryStrict, fetchProductCategoriesStrict, fetchProductAttributesStrict, fetchCategoryRankMathSEO, fetchProductCategoryBySlugStrict, RankMathSEOData, ProductCategoryDetail } from '@/config/api';
import { LightweightProduct, ProductFilters as ProductFiltersType, PaginationInfo } from '@/config/api';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { categorySchemas } from '@/lib/categorySchemas';

interface ProductCategoryPageProps {
  products: LightweightProduct[];
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  categoryExtraDescription: string;
  pagination: PaginationInfo;
  categories: Array<{ id: number; name: string; slug: string; count: number }>;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  rankMathSEO?: RankMathSEOData | null;
}

import { GetStaticProps, GetStaticPaths } from 'next';

// Client-side product fetch for pagination/filters. Goes through the same-origin
// /api/products-by-category route so the WooCommerce consumer key/secret stays
// server-side and is NEVER shipped to the browser. (Calling the WooCommerce fetch
// helper directly from the client previously inlined the key/secret into the
// client bundle.) getStaticProps below still calls the helper directly —
// that code runs only on the server and is stripped from the client bundle.
async function fetchCategoryProductsClient(
  slug: string,
  page: number,
  perPage = 20
): Promise<{ products: LightweightProduct[]; pagination: PaginationInfo }> {
  const res = await fetch(
    `/api/products-by-category?slug=${encodeURIComponent(slug)}&page=${page}&perPage=${perPage}`
  );
  if (!res.ok) throw new Error(`products-by-category request failed: ${res.status}`);
  return res.json();
}

// GATE-A REMEDY (ISR): the hub is rendered once, cached, background-revalidated
// hourly — no per-request WooCommerce fetch. fallback 'blocking' = an uncached
// hub still renders fully server-side on first hit. Every fetch is STRICT
// (throws on transient failure) so a failed revalidation KEEPS the last-good
// page. The old catch-all that returned EMPTY PROPS on any error was the
// THIN-200 hub shell Gate A reproduced (e.g. container-offices at 1,710 chars) —
// it is gone: failures now throw, they never render an empty grid.
// (A GENUINELY empty category still renders its empty state — parity preserved.)
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const [productsResponse, categoriesResponse, attributesResponse, categoryDetail] = await Promise.all([
      fetchLightweightProductsByCategoryStrict(slug, 1, 20), // STRICT: throws on failure, [] only on genuine empty
      fetchProductCategoriesStrict(),
      fetchProductAttributesStrict(),
      fetchProductCategoryBySlugStrict(slug),
    ]);

    const categoryName = categoryDetail?.name ||
      productsResponse.products[0]?.category ||
      slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Products';

    // Fetch Rank Math SEO data. STRICT: transient failure throws (keep last-good);
    // genuine 200-with-no-head returns null (baseline fallback behavior).
    const rankMathSEO: RankMathSEOData | null = await fetchCategoryRankMathSEO(slug, true);

    return {
      props: {
        products: productsResponse.products,
        categoryName,
        categorySlug: slug,
        categoryDescription: categoryDetail?.description || '',
        categoryExtraDescription: categoryDetail?.extraDescription || '',
        pagination: productsResponse.pagination,
        categories: categoriesResponse,
        attributes: attributesResponse,
        rankMathSEO,
      },
      revalidate: 3600, // ISR: background hourly revalidation (same as the [slug] blog route)
    };
  } catch (error) {
    // STRICT contract: a transient backend failure must NEVER cache an empty
    // shell. Re-throw: during background revalidation Next keeps the last-good
    // hub; on an uncached first render it returns a 500 (retryable, not cached).
    console.error(
      'Category hub ISR render failed — keeping last-good / returning 5xx:',
      error instanceof Error ? error.message : 'unknown error'
    );
    throw error instanceof Error ? error : new Error('Failed to render category hub');
  }
};

const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({
  products: initialProducts,
  categoryName: initialCategoryName,
  categorySlug: initialCategorySlug,
  categoryDescription,
  categoryExtraDescription,
  pagination: initialPagination,
  categories,
  attributes,
  rankMathSEO,
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<LightweightProduct[]>(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [categoryName, setCategoryName] = useState(initialCategoryName);
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: initialCategorySlug,
  });



  // Preload images for better performance
   useEffect(() => {
     const preloadImages = () => {
       initialProducts.slice(0, 6).forEach((product) => {
         const imageUrl = product.featured_image;
         if (imageUrl) {
           const link = document.createElement('link');
           link.rel = 'preload';
           link.as = 'image';
           link.href = imageUrl;
           document.head.appendChild(link);
         }
       });
     };
 
     preloadImages();
   }, [initialProducts]);

  // Reset states when initial props change
  useEffect(() => {
    setProducts(initialProducts);
    setPagination(initialPagination);
    setCurrentPage(1);
    setCategoryName(initialCategoryName);
    setFilters({ category: initialCategorySlug });
    setIsLoading(false);
  }, [initialProducts, initialPagination, initialCategoryName, initialCategorySlug]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(true);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      const slug = router.query.slug as string;
      const result = await fetchCategoryProductsClient(slug, page, 20);
      setProducts(result.products);
      setPagination(result.pagination);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters: ProductFiltersType) => {
    setIsLoading(true);
    try {
      const slug = router.query.slug as string;
      const params = new URLSearchParams();
      params.append('category', slug);
      params.append('page', '1');
      
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (typeof value === 'number') {
            params.append(key, value.toString());
          } else if (typeof value === 'string') {
            params.append(key, value);
          } else if (typeof value === 'boolean') {
            params.append(key, value.toString());
          }
        }
      });
      
      const result = await fetchCategoryProductsClient(slug, 1, 20);
      setProducts(result.products);
      setPagination(result.pagination);
      setCurrentPage(1);
      setFilters(newFilters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersReset = async () => {
    setIsLoading(true);
    try {
      const slug = router.query.slug as string;
      const result = await fetchCategoryProductsClient(slug, 1, 20);
      setProducts(result.products);
      setPagination(result.pagination);
      setCurrentPage(1);
      setFilters({ category: slug });
    } catch (error) {
      console.error('Error resetting filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Unified SEO - Single source of truth for all meta tags */}
      <UnifiedSEO 
        rankMathSEO={rankMathSEO} 
        fallbackCanonical={`https://www.samanportable.com/product-category/${initialCategorySlug}`}
        fallbackTitle={`${initialCategoryName || 'Products'} - Saman Portable`}
        fallbackDescription={`Browse our ${initialCategoryName || 'product'} collection. Quality portable solutions for your business needs at Saman Portable.`}
        fallbackOgImage="https://www.samanportable.com/og-image.svg"
        keywords={`${initialCategoryName || 'products'}, portable office, container office, prefab solutions, ${initialCategorySlug}`}
      />
      {categorySchemas[initialCategorySlug] && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchemas[initialCategorySlug]) }}
          />
        </Head>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto container-padding py-6">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/product">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#0A3D2A] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
                <p className="text-gray-600">
                  {pagination.totalProducts} products available
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters
                categories={categories}
                attributes={attributes}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleFiltersReset}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3D2A]"></div>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        priority={index < 6} // Prioritize first 6 products for better LCP
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    No products found in the {categoryName} category.
                  </p>
                  <Link href="/product">
                    <Button variant="outline">
                      Browse All Products
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Category Descriptions - Rendered at the bottom of the page, before the footer */}
          {categoryDescription && (
            <section
              className="category-description prose max-w-none bg-white rounded-lg p-6 mt-8 border border-gray-200 text-gray-700"
              dangerouslySetInnerHTML={{ __html: categoryDescription }}
            />
          )}

          {categoryExtraDescription && (
            <section
              className="category-seo-content prose max-w-none bg-white rounded-lg p-6 mt-6 border border-gray-200 text-gray-700"
              dangerouslySetInnerHTML={{ __html: categoryExtraDescription }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductCategoryPage;
