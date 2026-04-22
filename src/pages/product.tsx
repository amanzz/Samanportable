import React, { useState, useEffect, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
// import OptimizedImage from '../components/OptimizedImage';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Filter, Grid3X3, List, Star, ShoppingCart, Eye, Loader2 } from 'lucide-react';
import {
  fetchProducts,
  fetchProductsByCategoryPriority,
  fetchProductCategories,
  fetchProductAttributes,
  fetchRankMathSEO,
  ProductFilters as ProductFiltersType,
  PaginationInfo,
  RankMathSEOData
} from '../config/api';
import { sortProductsByCategoryPriority, debugCategoryPriorities } from '@/utils/categoryPriority';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';
import { formatPriceWithCurrency } from '../lib/utils';
import OptimizedProductImage from '../components/OptimizedProductImage';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamic import for ImagePreloader to reduce initial bundle size
const ImagePreloader = dynamic(() => import('../components/ImagePreloader'), {
  ssr: false,
  loading: () => null
});

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface Attribute {
  id: number;
  name: string;
  options: string[];
}

interface MinimalProductCategory { id: number; name: string; slug: string; }
interface MinimalProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string | null;
  sale_price?: string | null;
  on_sale?: boolean;
  image: string;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  average_rating?: string;
  rating_count?: number | string;
  categories?: MinimalProductCategory[];
}

interface ProductsProps {
  products: MinimalProduct[];
  pagination: PaginationInfo;
  categories: Category[];
  attributes: Attribute[];
  rankMathSEO?: RankMathSEOData | null;
}

export const getServerSideProps: GetServerSideProps<ProductsProps> = async ({ query }) => {
  try {
    console.log('getServerSideProps: Starting to fetch products...');
    
    const page = parseInt(query.page as string) || 1;
    const category = query.category as string;
    const search = query.search as string;
    const minPrice = query.min_price ? parseInt(query.min_price as string) : undefined;
    const maxPrice = query.max_price ? parseInt(query.max_price as string) : undefined;
    const onSale = query.on_sale === 'true';
    const stockStatus = query.stock_status as 'instock' | 'outofstock' | 'onbackorder' | undefined;
    const orderby = query.orderby as 'date' | 'price' | 'title' | 'popularity' | 'rating' | undefined;
    const order = query.order as 'asc' | 'desc' | undefined;

    // Build filters object
    const filters: ProductFiltersType = {};
    if (category) filters.category = category;
    if (search) filters.search = search;
    if (minPrice !== undefined) filters.min_price = minPrice;
    if (maxPrice !== undefined) filters.max_price = maxPrice;
    if (onSale) filters.on_sale = true;
    if (stockStatus) filters.stock_status = stockStatus;
    if (orderby) filters.orderby = orderby;
    if (order) filters.order = order;

    console.log('getServerSideProps: Filters:', filters);

    // Fetch products and supporting data in parallel - limit data for better performance
    // Use the new category priority function to get products in the correct order
    const [productsResponse, cats, attrs] = await Promise.all([
      fetchProductsByCategoryPriority(page, 8, filters), // Use new priority-based function
      fetchProductCategories().then(c => c?.slice(0, 8) || []), // Reduced from 10 to 8
      fetchProductAttributes().then(a => a?.slice(0, 3) || [])   // Reduced from 5 to 3
    ]);

    console.log('getServerSideProps: Products response:', {
      productsCount: productsResponse.products?.length || 0,
      pagination: productsResponse.pagination
    });

    // Minimize product payload for SSR JSON - only essential data
    const minimalProducts = (productsResponse.products || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price || '0',
      regular_price: p.regular_price || null,
      sale_price: p.sale_price || null,
      on_sale: Boolean(p.on_sale),
      image: p.images?.[0]?.src || p.featured_image || '/placeholder.svg',
      stock_status: p.stock_status || 'instock',
      average_rating: p.average_rating || '0',
      rating_count: p.rating_count || 0,
      categories: Array.isArray(p.categories) && p.categories.length > 0
        ? p.categories.slice(0, 1).map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))
        : []
    }));

    // Products are already fetched in priority order from fetchProductsByCategoryPriority
    console.log('getServerSideProps: Products fetched in priority order:', minimalProducts.map(p => ({
      name: p.name,
      category: p.categories?.[0]?.slug || 'no-category'
    })));

    console.log('getServerSideProps: Returning props with', minimalProducts.length, 'products');

    // Minimize categories and attributes payload
    const minimalCategories = (cats || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c.count || 0
    }));

    const minimalAttributes = (attrs || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      options: Array.isArray(a.options) ? a.options.slice(0, 5) : [] // Limit options to 5
    }));

    // Fetch Rank Math SEO data for main products page
    let rankMathSEO: RankMathSEOData | null = null;
    try {
      rankMathSEO = await fetchRankMathSEO('https://www.samanportable.com/product');
    } catch (error) {
      console.warn('Failed to fetch Rank Math SEO data for products page:', error);
    }

    return {
      props: {
        products: minimalProducts,
        pagination: productsResponse.pagination,
        categories: minimalCategories,
        attributes: minimalAttributes,
        rankMathSEO,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return fallback data for development
    return {
      props: {
        products: [
          {
            id: 1,
            name: "Portable Office Cabin",
            slug: "portable-office-cabin",
            price: "25000",
            regular_price: "30000",
            sale_price: "25000",
            on_sale: true,
            image: "/placeholder.svg",
            stock_status: "instock",
            average_rating: "4.5",
            rating_count: "12",
            categories: [{ id: 1, name: "Portable Office", slug: "portable-office" }]
          },
          {
            id: 2,
            name: "Container Office",
            slug: "container-office",
            price: "45000",
            regular_price: null,
            sale_price: null,
            on_sale: false,
            image: "/placeholder.svg",
            stock_status: "instock",
            average_rating: "4.8",
            rating_count: "8",
            categories: [{ id: 2, name: "Container Office", slug: "container-office" }]
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 2,
          perPage: 12,
          hasNextPage: false,
          hasPrevPage: false,
        },
        categories: [
          { id: 1, name: "Portable Office", slug: "portable-office", count: 5 },
          { id: 2, name: "Container Office", slug: "container-office", count: 3 }
        ],
        attributes: [],
        rankMathSEO: null,
      },
    };
  }
};

const Products = ({ products, pagination, categories, attributes, rankMathSEO }: ProductsProps) => {
  const router = useRouter();
  const { addItem } = useCart();
  
  // Products are already sorted by category priority from the server
  const sortedProducts = products;
  
  // Debug logging
  console.log('Products component rendered with:', {
    productsCount: products?.length || 0,
    pagination,
    categoriesCount: categories?.length || 0,
    attributesCount: attributes?.length || 0
  });
  


  const handleAddToCart = (product: MinimalProduct) => {
    try {
      const price = parseFloat(product.price || '0');
      const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
      const finalPrice = salePrice || price;
      
      addItem({
        id: product.id,
        name: product.name,
        price: finalPrice,
        quantity: 1,
        category: product.categories?.[0]?.name || 'Uncategorized',
        image: product.image || '/placeholder.svg',
        slug: product.slug || `product-${product.id}`
      });
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };
  
  // State management
  // products and pagination are fully SSR-driven now
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: router.query.category as string || undefined,
    search: router.query.search as string || undefined,
    min_price: router.query.min_price ? parseInt(router.query.min_price as string) : undefined,
    max_price: router.query.max_price ? parseInt(router.query.max_price as string) : undefined,
    on_sale: router.query.on_sale === 'true',
    stock_status: router.query.stock_status as any || undefined,
    orderby: router.query.orderby as any || 'date',
    order: router.query.order as any || 'desc',
  });
  
  // Since this is SSR, we don't need loading state for initial render
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update URL when filters or pagination change
  const updateURL = useCallback((newFilters: ProductFiltersType, newPage: number = 1) => {
    const query = { ...router.query };
    
    // Update filters in URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query[key] = value.toString();
      } else {
        delete query[key];
      }
    });
    
    // Update page in URL
    if (newPage > 1) {
      query.page = newPage.toString();
    } else {
      delete query.page;
    }
    
    // Remove empty values
    Object.keys(query).forEach(key => {
      if (query[key] === '' || query[key] === undefined) {
        delete query[key];
      }
    });
    
    router.push({ pathname: router.pathname, query });
  }, [router]);

  // Fetch products with current filters and page
  // Client fetch removed; pagination/filters use SSR navigation

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ProductFiltersType) => {
    setFilters(newFilters);
    updateURL(newFilters, 1);
  }, [updateURL]);

  // Handle filter reset
  const handleFiltersReset = useCallback(() => {
    const resetFilters: ProductFiltersType = {};
    setFilters(resetFilters);
    updateURL(resetFilters, 1);
  }, [updateURL]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    updateURL(filters, newPage);
  }, [filters, updateURL]);

  // Handle search input
  const handleSearch = useCallback((searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm || undefined };
    setFilters(newFilters);
    updateURL(newFilters, 1);
  }, [filters, updateURL]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== router.query.search) {
        handleSearch(filters.search || '');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search, router.query.search, handleSearch]);

  // Get product image
  const getProductImage = (product: MinimalProduct) => {
    const image = product.image;
    // Return placeholder if image is invalid or missing
    if (!image || image === '/placeholder.svg' || !image.startsWith('http')) {
      return '/placeholder.svg';
    }
    return image;
  };

  return (
    <Layout>
      {/* Unified SEO - Single source of truth for all meta tags */}
      <UnifiedSEO 
        rankMathSEO={rankMathSEO} 
        fallbackCanonical="https://www.samanportable.com/product"
        fallbackTitle="All Products - Saman Portable Office Solutions"
        fallbackDescription="Browse our complete collection of portable office solutions, cabins, and containers at Saman Portable Office Solutions."
        keywords="portable cabins, container offices, prefab solutions, portable buildings, modular offices"
        author="Saman Portable Office Solutions"
        publisher="Saman Portable Office Solutions"
      />

      {/* Preload critical images for better performance */}
      <ImagePreloader 
        images={products.map(p => p.image).filter(Boolean).filter(url => 
          url && url !== '/placeholder.svg' && url.startsWith('http')
        )} 
        maxPreload={3} // Reduced from 6 to 3 for faster loading
      />

        <main className="section-padding bg-background">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Products
              </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our comprehensive range of portable cabins, container offices, and prefab solutions designed for durability, efficiency, and flexibility.
              </p>
            </div>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10"
                    />
                </div>
                
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                      <List className="w-4 h-4" />
                    </Button>
              </div>
            </div>

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
                  {/* Results Summary */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground">
                  Showing {sortedProducts.length} of {pagination.totalProducts} products
                    </p>
                    <p className="text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                  </div>

              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {sortedProducts.map((product, index) => (
                      <div key={product.id} className={`bg-card rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 group ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}>
                        {/* Product Image */}
                        <div className={`bg-muted relative overflow-hidden ${
                          viewMode === 'list' ? 'w-48 h-32' : 'aspect-video'
                        }`}>
                          <Link href={`/product/${product.categories?.[0]?.slug || 'uncategorized'}/${product.slug}`}>
                            <OptimizedProductImage
                              src={getProductImage(product)}
                              alt={product.name}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                              priority={index < 3}
                              index={index}
                            />
                          </Link>
                          
                          {/* Badges removed as requested */}

                          {/* Quick Actions */}
                          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="w-8 h-8 p-0">
                                <ShoppingCart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          {/* Categories */}
                          {product.categories && product.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                              {product.categories.slice(0, 2).map((category) => (
                              <span
                                key={category.id}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                          )}
                          
                          {/* Title */}
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            <Link href={`/product/${product.categories?.[0]?.slug || 'uncategorized'}/${product.slug}`} className="hover:text-primary transition-colors">
                            {product.name}
                            </Link>
                          </h3>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            {product.on_sale && product.sale_price ? (
                              <>
                                <span className="text-lg font-bold text-red-600">
                                  {formatPriceWithCurrency(parseFloat(product.sale_price || product.price))}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPriceWithCurrency(parseFloat(product.regular_price || product.price))}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-foreground">
                                {formatPriceWithCurrency(parseFloat(product.price))}
                              </span>
                            )}
                          </div>
                          
                          {/* Rating */}
                          {product.average_rating && parseFloat(product.average_rating || '0') > 0 && (
                            <div className="flex items-center gap-1 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                      i < Math.floor(parseFloat(product.average_rating || '0'))
                                      ? 'text-yellow-400 fill-current'
                                        : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                              <span className="text-sm text-muted-foreground ml-1">
                                ({product.rating_count})
                            </span>
                          </div>
                          )}
                          
                          {/* Description (omitted in minimal payload) */}
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Link href={`/product/${product.categories?.[0]?.slug || 'uncategorized'}/${product.slug}`}>
                              <Button variant="outline" size="sm" className="flex-1">
                                View Details
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>



                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12">
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={handleFiltersReset}>
                    Clear All Filters
                  </Button>
                </div>
              )}
                </div>
              </div>
            </div>
        </main>
        
    </Layout>
  );
};

export default Products;

