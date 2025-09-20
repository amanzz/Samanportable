// API Configuration - Easy to replace URLs and credentials
export const API_CONFIG = {
  // WordPress REST API base URLs
  WP_BASE_URL: process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json',
  WC_BASE_URL: (process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json') + '/wc/v3',
  
  // WooCommerce API credentials
  WC_CONSUMER_KEY: process.env.WORDPRESS_CONSUMER_KEY || 'ck_8649e855e2c557f0a545b674bd5fb1eacc32ad59',
  WC_CONSUMER_SECRET: process.env.WORDPRESS_CONSUMER_SECRET || 'cs_d9b9536ff84a86871d7877481225b939cd4bacb2',
  
  // Blog API endpoint (WordPress posts)
  BLOG_API_ENDPOINT: process.env.WORDPRESS_BLOG_API || 'https://blog.samanportable.com/wp-json/wp/v2',
  
  // Rank Math API endpoint for headless CMS
  RANK_MATH_API_ENDPOINT: process.env.RANK_MATH_API || 'https://blog.samanportable.com/wp-json/rankmath/v1/getHead',
  
  // Pagination defaults - Reduced for better performance
  DEFAULT_PER_PAGE: 12, // Reduced from 20 to 12 for better performance
  BLOG_PER_PAGE: 6, // Reduced from 20 to 6 for better performance
  
  // Cache settings - Enhanced for Core Web Vitals
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  CACHE_DURATION_LONG: 15 * 60 * 1000, // 15 minutes for static content
  CACHE_DURATION_SHORT: 2 * 60 * 1000, // 2 minutes for dynamic content
  
  // Performance settings
  MAX_CONCURRENT_REQUESTS: 5, // Limit concurrent API calls
  REQUEST_TIMEOUT: 10000, // 10 seconds timeout
  RETRY_ATTEMPTS: 2, // Number of retry attempts
};

// Lightweight product interface for category pages
export interface LightweightProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  featured_image: string; // Single thumbnail image
  category: string;
  category_slug: string;
  short_description: string;
  stock_status: string;
  average_rating: string;
  rating_count: number;
}

// Rank Math SEO data interface
export interface RankMathSEOData {
  title?: string;
  description?: string;
  robots?: {
    index?: string;
    follow?: string;
    'max-snippet'?: string;
    'max-image-preview'?: string;
    'max-video-preview'?: string;
  };
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_locale?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema?: any;
}

// Enhanced TypeScript interfaces for better type safety
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: Array<{
    id: number;
    src: string;
    alt: string;
    name: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  short_description: string;
  description: string;
  average_rating: string;
  rating_count: number;
  stock_status: string;
  stock_quantity: number | null;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  date_created: string;
  date_modified: string;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  attributes?: Record<string, string[]>;
  search?: string;
  on_sale?: boolean;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  orderby?: 'date' | 'price' | 'title' | 'popularity' | 'rating';
  order?: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts?: number;
  totalPosts?: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  products: WooCommerceProduct[];
  pagination: PaginationInfo;
}

// WordPress Blog Post interface
export interface BlogPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls: Record<string, string>;
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      date: string;
      slug: string;
      type: string;
      link: string;
      title: {
        rendered: string;
      };
      source_url: string;
      alt_text?: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      link: string;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

// Test if WordPress site is accessible
export async function testWordPressAccessibility(): Promise<boolean> {
  try {
    const testUrl = 'https://blog.samanportable.com/wp-json/';
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Saman-Portable-Website/1.0',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Test WooCommerce API connection
export async function testWooCommerceConnection(): Promise<boolean> {
  try {
    const testUrl = `${API_CONFIG.WC_BASE_URL}/products?per_page=1&consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Saman-Portable-Website/1.0',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      const errorText = await response.text();
      
      // Check for common API errors
      if (response.status === 401) {
        console.error('API Error: Unauthorized - Check consumer key and secret');
      } else if (response.status === 403) {
        console.error('API Error: Forbidden - Check API permissions');
      } else if (response.status === 404) {
        console.error('API Error: Not Found - Check API endpoint URL');
      } else if (response.status === 500) {
        console.error('API Error: Internal Server Error - WooCommerce server issue');
      }
      
      return false;
    }
  } catch (error) {
    console.error('Test API Connection failed:', error);
    
    // Check for network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network Error: Unable to reach the API endpoint');
    }
    
    return false;
  }
}

// Enhanced product fetching with filters and pagination - OPTIMIZED
export async function fetchProducts(
  page = 1, 
  perPage = API_CONFIG.DEFAULT_PER_PAGE,
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  try {
    // Build query parameters with minimal fields for reduced payload
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      consumer_key: API_CONFIG.WC_CONSUMER_KEY,
      consumer_secret: API_CONFIG.WC_CONSUMER_SECRET,
      // Fetch essential fields including inventory data for Google Merchant Center
      _fields: 'id,name,slug,price,regular_price,sale_price,on_sale,images,short_description,stock_status,stock_quantity,average_rating,rating_count,categories,weight,dimensions',
    });

    // Add filters
    if (filters.category) {
      // Check if category is a slug (string) or ID (number)
      if (isNaN(Number(filters.category))) {
        // It's a slug, convert to ID first
        try {
          const categoryResponse = await fetch(
            `${API_CONFIG.WC_BASE_URL}/products/categories?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&slug=${filters.category}`,
            {
              next: { revalidate: 3600 },
            }
          );
          
          if (categoryResponse.ok) {
            const categories = await categoryResponse.json();
            if (categories.length > 0) {
              params.append('category', categories[0].id.toString());
            }
          }
        } catch (error) {
          // Silent error handling for production
        }
      } else {
        // It's already an ID
        params.append('category', filters.category);
      }
    }
    
    if (filters.min_price !== undefined) {
      params.append('min_price', filters.min_price.toString());
    }
    
    if (filters.max_price !== undefined) {
      params.append('max_price', filters.max_price.toString());
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (filters.on_sale) {
      params.append('on_sale', 'true');
    }
    
    if (filters.stock_status) {
      params.append('stock_status', filters.stock_status);
    }
    
    if (filters.orderby) {
      params.append('orderby', filters.orderby);
    }
    
    if (filters.order) {
      params.append('order', filters.order);
    }

    // Don't add _embed to reduce payload size - we only need basic product data

    const apiUrl = `${API_CONFIG.WC_BASE_URL}/products?${params.toString()}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
    }
    
    const products = await response.json();
    
    // Get pagination info from headers
    const totalProducts = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');
    
    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages,
      totalProducts,
      perPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      products: products || [],
      pagination,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
        perPage,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// Enhanced single product fetch
export async function fetchProduct(slug: string): Promise<WooCommerceProduct | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products?slug=${slug}&consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&_embed`,
      {
        next: { revalidate: 300 },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    
    const products = await response.json();
    const product = products[0] || null;
    

    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Fetch Rank Math SEO data for a specific URL
export async function fetchRankMathSEO(url: string): Promise<RankMathSEOData | null> {
  try {
    const params = new URLSearchParams({
      url: url,
    });

    const apiUrl = `${API_CONFIG.RANK_MATH_API_ENDPOINT}?${params}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Saman-Portable-Website/1.0',
      },
      next: { revalidate: API_CONFIG.CACHE_DURATION_LONG / 1000 }, // Cache for 15 minutes
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.head) {
      return null;
    }

    // Parse HTML head content to extract meta tags
    const headHtml = data.head;
    const seoData: RankMathSEOData = {};
    
    // Extract title
    const titleMatch = headHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) seoData.title = titleMatch[1];
    
    // Extract description
    const descMatch = headHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (descMatch) seoData.description = descMatch[1];
    
    // Extract canonical
    const canonicalMatch = headHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (canonicalMatch) seoData.canonical = canonicalMatch[1];
    
    // Extract Open Graph tags
    const ogTitleMatch = headHtml.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    if (ogTitleMatch) seoData.og_title = ogTitleMatch[1];
    
    const ogDescMatch = headHtml.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (ogDescMatch) seoData.og_description = ogDescMatch[1];
    
    const ogImageMatch = headHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (ogImageMatch) seoData.og_image = ogImageMatch[1];
    
    const ogLocaleMatch = headHtml.match(/<meta\s+property=["']og:locale["']\s+content=["']([^"']+)["']/i);
    if (ogLocaleMatch) seoData.og_locale = ogLocaleMatch[1];
    
    // Extract Twitter tags
    const twitterTitleMatch = headHtml.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
    if (twitterTitleMatch) seoData.twitter_title = twitterTitleMatch[1];
    
    const twitterDescMatch = headHtml.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
    if (twitterDescMatch) seoData.twitter_description = twitterDescMatch[1];
    
    const twitterImageMatch = headHtml.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
    if (twitterImageMatch) seoData.twitter_image = twitterImageMatch[1];
    
    // Extract robots
    const robotsMatch = headHtml.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
    if (robotsMatch) {
      const robotsContent = robotsMatch[1];
      seoData.robots = {
        index: robotsContent.includes('noindex') ? 'noindex' : 'index',
        follow: robotsContent.includes('nofollow') ? 'nofollow' : 'follow'
      };
    }
    
    // Extract JSON-LD schema
    const schemaMatch = headHtml.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/i);
    if (schemaMatch) {
      try {
        seoData.schema = JSON.parse(schemaMatch[1]);
      } catch (e) {
        // Silent error handling for production
      }
    }

    return seoData;
  } catch (error) {
    return null;
  }
}

// Fetch Rank Math SEO data for a product
export async function fetchProductRankMathSEO(categorySlug: string): Promise<RankMathSEOData | null> {
  const productUrl = `https://www.samanportable.com/product/${categorySlug}/`;
  return await fetchRankMathSEO(productUrl);
}

// Fetch Rank Math SEO data for a blog post
export async function fetchBlogPostRankMathSEO(slug: string): Promise<RankMathSEOData | null> {
  const blogUrl = `https://www.samanportable.com/${slug}`;
  return await fetchRankMathSEO(blogUrl);
}

// Fetch Rank Math SEO data for a category page
export async function fetchCategoryRankMathSEO(categorySlug: string): Promise<RankMathSEOData | null> {
  const categoryUrl = `https://www.samanportable.com/product-category/${categorySlug}`;
  return await fetchRankMathSEO(categoryUrl);
}

// Enhanced blog posts fetch with pagination - OPTIMIZED
export async function fetchBlogPosts(page = 1, perPage = API_CONFIG.BLOG_PER_PAGE): Promise<{ posts: BlogPost[]; pagination: PaginationInfo }> {
  try {
    // Build URL with embedded data for featured images
    const url = `${API_CONFIG.BLOG_API_ENDPOINT}/posts?page=${page}&per_page=${perPage}&_embed=true&status=publish`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Saman-Portable-Website/1.0',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }

    const posts = await response.json();
    
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);

    if (!Array.isArray(posts)) {
      throw new Error('Invalid response format from WordPress API');
    }

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        perPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    return {
      posts: [],
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalPosts: 0,
        perPage,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// Utility function to get featured image URL
export async function getFeaturedImageUrl(mediaId: number): Promise<string | null> {
  if (!mediaId) return null;
  
  try {
    const response = await fetch(`${API_CONFIG.BLOG_API_ENDPOINT}/media/${mediaId}`);
    if (response.ok) {
      const media = await response.json();
      return media.source_url || null;
    }
  } catch (error) {
    // Silent error handling for production
  }
  return null;
}

export async function fetchBlogPost(slug: string) {
  try {
    const response = await fetch(
      `${API_CONFIG.BLOG_API_ENDPOINT}/posts?slug=${slug}&_embed`,
      {
        next: { revalidate: 300 },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts[0] || null;
  } catch (error) {
    return null;
  }
}

// Enhanced product categories fetch - OPTIMIZED
export async function fetchProductCategories() {
  try {
    const response = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products/categories?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&per_page=20&hide_empty=true&_fields=id,name,slug,count`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product categories: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
}

// Enhanced products by category fetch
export async function fetchProductsByCategory(
  categorySlug: string, 
  page = 1, 
  perPage = API_CONFIG.DEFAULT_PER_PAGE,
  additionalFilters: Omit<ProductFilters, 'category'> = {}
): Promise<ProductsResponse> {
  try {
    // First get the category ID
    const categoriesResponse = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products/categories?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&slug=${categorySlug}`,
      {
        next: { revalidate: 3600 },
      }
    );
    
    if (!categoriesResponse.ok) {
      throw new Error(`Failed to fetch category: ${categoriesResponse.status}`);
    }
    
    const categories = await categoriesResponse.json();
    if (!categories.length) {
      return {
        products: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalProducts: 0,
          perPage,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
    
    const categoryId = categories[0].id;
    
    // Then get products by category ID with filters
    const filters: ProductFilters = {
      ...additionalFilters,
      category: categoryId.toString(),
    };
    
    return await fetchProducts(page, perPage, filters);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return {
      products: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
        perPage: API_CONFIG.DEFAULT_PER_PAGE,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// Get product attributes for filtering - OPTIMIZED
export async function fetchProductAttributes() {
  try {
    const response = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products/attributes?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&per_page=10&_fields=id,name,options`,
      {
        next: { revalidate: 3600 },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product attributes: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    return [];
  }
}

// ===== OPTIMIZED API FUNCTIONS FOR REDUCED PAGE DATA =====

// Fetch products from multiple categories in priority order
export async function fetchProductsByCategoryPriority(
  page = 1,
  perPage = 8,
  additionalFilters: Omit<ProductFilters, 'category'> = {}
): Promise<ProductsResponse> {
  try {
    // Define category priority order
    const categoryPriority = [
      'portable-cabin',
      'container-offices', 
      'porta-cabins',
      'labor-colony',
      'portable-office',
      'container-cafe',
      'industrial-sheds'
    ];

    let allProducts: any[] = [];
    let totalProducts = 0;
    let totalPages = 0;

    // Fetch products from each category in priority order
    for (const categorySlug of categoryPriority) {
      try {
        const categoryResponse = await fetchProductsByCategory(categorySlug, 1, 20, additionalFilters);
        if (categoryResponse.products && categoryResponse.products.length > 0) {
          allProducts = [...allProducts, ...categoryResponse.products];
          totalProducts += categoryResponse.pagination?.totalProducts || 0;
        }
      } catch (error) {
        console.warn(`Failed to fetch products for category ${categorySlug}:`, error);
        // Continue with other categories
      }
    }

    // Calculate pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    totalPages = Math.ceil(allProducts.length / perPage);

    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages,
      totalProducts: allProducts.length,
      perPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      products: paginatedProducts,
      pagination,
    };
  } catch (error) {
    console.error('Error fetching products by category priority:', error);
    return {
      products: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
        perPage,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// Optimized lightweight product fetch for category pages
export async function fetchLightweightProductsByCategory(
  categorySlug: string, 
  page = 1, 
  perPage = 20
): Promise<{ products: LightweightProduct[]; pagination: PaginationInfo }> {
  try {
    // First get the category ID
    const categoriesResponse = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products/categories?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&slug=${categorySlug}`,
      {
        next: { revalidate: 3600 },
      }
    );
    
    if (!categoriesResponse.ok) {
      throw new Error(`Failed to fetch category: ${categoriesResponse.status}`);
    }
    
    const categories = await categoriesResponse.json();
    if (!categories.length) {
      return {
        products: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalProducts: 0,
          perPage,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
    
    const categoryId = categories[0].id;
    const categoryName = categories[0].name;
    
    // Build query parameters with _fields to fetch only required data
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      category: categoryId.toString(),
      consumer_key: API_CONFIG.WC_CONSUMER_KEY,
      consumer_secret: API_CONFIG.WC_CONSUMER_SECRET,
      _fields: 'id,name,slug,price,regular_price,sale_price,on_sale,images,short_description,stock_status,average_rating,rating_count',
    });

    const apiUrl = `${API_CONFIG.WC_BASE_URL}/products?${params.toString()}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
    }
    
    const products = await response.json();
    
    // Get pagination info from headers
    const totalProducts = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');
    
    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages,
      totalProducts,
      perPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    // Transform to lightweight format with proper image handling
    const lightweightProducts: LightweightProduct[] = products.map((product: any) => {
      // Ensure we have a valid image URL
      let imageUrl = '/placeholder.svg';
      if (product.images && product.images.length > 0 && product.images[0].src) {
        imageUrl = product.images[0].src;
      }
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        on_sale: product.on_sale,
        featured_image: imageUrl,
        category: categoryName,
        category_slug: categorySlug,
        short_description: product.short_description,
        stock_status: product.stock_status,
        average_rating: product.average_rating,
        rating_count: product.rating_count,
      };
    });

    return {
      products: lightweightProducts,
      pagination,
    };
  } catch (error) {
    console.error('Error fetching lightweight products by category:', error);
    return {
      products: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
        perPage,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// Optimized single product fetch with minimal fields
export async function fetchLightweightProduct(slug: string): Promise<LightweightProduct | null> {
  try {
    const params = new URLSearchParams({
      slug: slug,
      consumer_key: API_CONFIG.WC_CONSUMER_KEY,
      consumer_secret: API_CONFIG.WC_CONSUMER_SECRET,
      _fields: 'id,name,slug,price,regular_price,sale_price,on_sale,images,short_description,stock_status,average_rating,rating_count,categories',
    });

    const response = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products?${params.toString()}`,
      {
        next: { revalidate: 300 },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    
    const products = await response.json();
    const product = products[0] || null;
    
    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      on_sale: product.on_sale,
      featured_image: product.images?.[0]?.src || '/placeholder.svg',
      category: product.categories?.[0]?.name || 'Uncategorized',
      category_slug: product.categories?.[0]?.slug || 'uncategorized',
      short_description: product.short_description,
      stock_status: product.stock_status,
      average_rating: product.average_rating,
      rating_count: product.rating_count,
    };
  } catch (error) {
    console.error('Error fetching lightweight product:', error);
    return null;
  }
}

// Fetch full product description separately (for product detail pages)
export async function fetchProductDescription(slug: string): Promise<{ description: string; images: Array<{ src: string; alt: string }> } | null> {
  try {
    const params = new URLSearchParams({
      slug: slug,
      consumer_key: API_CONFIG.WC_CONSUMER_KEY,
      consumer_secret: API_CONFIG.WC_CONSUMER_SECRET,
      _fields: 'description,images',
    });

    const response = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products?${params.toString()}`,
      {
        next: { revalidate: 300 },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product description: ${response.status}`);
    }
    
    const products = await response.json();
    const product = products[0] || null;
    
    if (!product) return null;

    return {
      description: product.description,
      images: product.images || [],
    };
  } catch (error) {
    console.error('Error fetching product description:', error);
    return null;
  }
}
