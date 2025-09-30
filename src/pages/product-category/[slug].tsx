import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { fetchLightweightProductsByCategory, fetchProductCategories, fetchProductAttributes, fetchCategoryRankMathSEO, RankMathSEOData } from '@/config/api';
import { LightweightProduct, ProductFilters as ProductFiltersType, PaginationInfo } from '@/config/api';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

interface ProductCategoryPageProps {
  products: LightweightProduct[];
  categoryName: string;
  categorySlug: string;
  pagination: PaginationInfo;
  categories: Array<{ id: number; name: string; slug: string; count: number }>;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  rankMathSEO?: RankMathSEOData | null;
}

import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );

  const slug = params?.slug as string;
  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const [productsResponse, categoriesResponse, attributesResponse] = await Promise.all([
      fetchLightweightProductsByCategory(slug, 1, 20), // Using optimized function with 20 items per page
      fetchProductCategories(),
      fetchProductAttributes(),
    ]);

    const categoryName = productsResponse.products[0]?.category ||
      slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Products';

    // Fetch Rank Math SEO data
    let rankMathSEO: RankMathSEOData | null = null;
    try {
      rankMathSEO = await fetchCategoryRankMathSEO(slug);
    } catch (error) {
      console.warn('Failed to fetch Rank Math SEO data for category:', error);
    }

    return {
      props: {
        products: productsResponse.products,
        categoryName,
        categorySlug: slug,
        pagination: productsResponse.pagination,
        categories: categoriesResponse,
        attributes: attributesResponse,
        rankMathSEO,
      },
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      props: {
        products: [],
        categoryName: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Products',
        categorySlug: slug,
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          perPage: 20,
          hasNextPage: false,
          hasPrevPage: false,
        },
        categories: [],
        attributes: [],
        rankMathSEO: null,
      },
    };
  }
};

const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({
  products: initialProducts,
  categoryName: initialCategoryName,
  categorySlug: initialCategorySlug,
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
      const result = await fetchLightweightProductsByCategory(slug, page, 20);
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
      
      const result = await fetchLightweightProductsByCategory(slug, 1, 20);
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
      const result = await fetchLightweightProductsByCategory(slug, 1, 20);
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
        fallbackTitle={`${initialCategoryName || 'Products'} - SAMAN Portable Office Solutions`}
        fallbackDescription={`Browse our ${initialCategoryName || 'product'} collection. Quality portable solutions for your business needs at Saman Portable Office Solutions.`}
        fallbackOgImage="https://www.samanportable.com/og-image.svg"
        keywords={`${initialCategoryName || 'products'}, portable office, container office, prefab solutions, ${initialCategorySlug}`}
      />

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
        </div>
      </div>
    </Layout>
  );
};

export default ProductCategoryPage;
