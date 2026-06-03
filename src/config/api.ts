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

// Standard headers for API requests to bypass security firewalls
function getApiHeaders() {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Saman-Portable-Website/1.0',
  };
}

// Thrown when the backend is unreachable or returns a TRANSIENT failure
// (network error, timeout, 408, 429, or any 5xx), OR when it responds with an
// unexpected/invalid shape. This is deliberately DISTINCT from "the backend
// responded successfully but the requested item does not exist" — for that
// genuine-absent case the single-item helpers return `null`.
//
// Why this matters: a server-side render (getServerSideProps) must NOT turn a
// transient backend failure into `notFound: true`. A false 404 on a real
// product/blog page tells Google the page is gone and gets it deindexed. By
// throwing this error instead of returning null on failure, the calling route
// can surface an HTTP 5xx (which search engines retry) rather than a 404.
// The message never contains the request URL, so API keys in query strings are
// never logged.
export class BackendFetchError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'BackendFetchError';
    this.status = status;
  }
}

// HTTP statuses that indicate a transient/unavailable backend (worth a retry,
// and — if retries are exhausted — should surface as a 5xx, never a 404).
function isTransientStatus(status: number): boolean {
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

// fetch() with a hard per-attempt timeout (AbortController) and a small, bounded
// retry for transient failures. Returns the Response for a 2xx or a NON-transient
// 4xx (the caller decides what a 4xx means). Throws BackendFetchError on a network
// error, a timeout, or transient failures that survive all retry attempts.
//
// Retries are conservative — at most API_CONFIG.RETRY_ATTEMPTS, with a short
// linear backoff — so a struggling backend is never hit with an aggressive burst.
async function fetchWithResilience(url: string, init?: RequestInit): Promise<Response> {
  const maxAttempts = Math.max(1, API_CONFIG.RETRY_ATTEMPTS);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);

      // Transient server-side failure → retry if attempts remain, else throw.
      if (isTransientStatus(response.status)) {
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
          continue;
        }
        throw new BackendFetchError(
          `Backend transient failure after ${maxAttempts} attempt(s): ${response.status}`,
          response.status
        );
      }

      // 2xx or a non-transient 4xx (e.g. 400/401/403/404) — hand back to caller.
      return response;
    } catch (error) {
      clearTimeout(timer);
      // A BackendFetchError thrown above for an exhausted transient status: rethrow.
      if (error instanceof BackendFetchError) throw error;
      // Otherwise this is a network error or an AbortError (timeout). Retry if we
      // still have attempts; on the last attempt fall through to the throw below.
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
        continue;
      }
      throw new BackendFetchError('Backend unreachable (network error or timeout)');
    }
  }

  // Unreachable in practice (loop either returns or throws), but keeps types happy.
  throw new BackendFetchError(`Backend unreachable after ${maxAttempts} attempt(s)`);
}


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
  sku: string;
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
  // FAQPage JSON-LD extracted from RankMath's head output for this URL.
  // Only the FAQPage node is kept (Product/Organization schema is handled elsewhere).
  faqSchema?: any;
}

// Enhanced TypeScript interfaces for better type safety
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
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
  category_slug?: string;
  category_name?: string;
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
      headers: getApiHeaders(),
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
      headers: getApiHeaders(),
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
              headers: getApiHeaders(),
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
      headers: getApiHeaders(),
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
        headers: getApiHeaders(),
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
      headers: getApiHeaders(),
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
    
    // Extract canonical. Normalize the host to the public www domain: RankMath may emit
    // the WordPress backend host (e.g. blog.samanportable.com) or a non-www variant, which
    // would point Google's canonical at a different host and risk deindexing the live page.
    const canonicalMatch = headHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (canonicalMatch) {
      seoData.canonical = canonicalMatch[1].replace(
        /^https?:\/\/(?:[a-z0-9-]+\.)*samanportable\.com/i,
        'https://www.samanportable.com'
      );
    }
    
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
    
    // Product/Organization schema is intentionally NOT taken from RankMath here
    // (ProductStructuredData handles it) to avoid duplicate Product/Organization nodes.
    // We ONLY extract the FAQPage node, because the FAQ text is genuinely rendered
    // on the page (inside the product description), so its schema is Google-compliant.
    try {
      const ldJsonBlocks = [...headHtml.matchAll(
        /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
      )];
      for (const block of ldJsonBlocks) {
        let parsed: any;
        try {
          parsed = JSON.parse(block[1].trim());
        } catch {
          continue; // skip any malformed JSON-LD block
        }
        // RankMath usually wraps everything in a single @graph array.
        const nodes = Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : [parsed];
        const faqNode = nodes.find((node: any) => {
          const t = node?.['@type'];
          return t === 'FAQPage' || (Array.isArray(t) && t.includes('FAQPage'));
        });
        if (faqNode && Array.isArray(faqNode.mainEntity) && faqNode.mainEntity.length > 0) {
          // Emit as a standalone, valid FAQPage document.
          seoData.faqSchema = { '@context': 'https://schema.org', ...faqNode };
          break;
        }
      }
    } catch {
      // FAQ extraction is best-effort; never block SEO data on it.
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

// Enhanced category-specific SEO data with proper fallbacks
const CATEGORY_SEO_DATA: Record<string, RankMathSEOData> = {
  'porta-cabins': {
    title: 'Porta Cabins in Bangalore | Portable Office Cabins | SAMAN Portable',
    description: 'Premium porta cabins and portable office cabins in Bangalore. Durable, customizable, and cost-effective solutions for temporary office spaces. Contact SAMAN Portable today!',
    og_title: 'Best Porta Cabins in Bangalore - Saman Portable',
    og_description: 'Get high-quality porta cabins in Bangalore. Perfect for construction sites, events, and temporary offices. Fast delivery and installation.',
    canonical: 'https://www.samanportable.com/product-category/porta-cabins',
    robots: { index: 'index', follow: 'follow' }
  },
  'container-offices': {
    title: 'Container Offices in Bangalore | Shipping Container Office | SAMAN Portable',
    description: 'Modern container offices in Bangalore. Convert shipping containers into fully functional office spaces. Eco-friendly and cost-effective solutions.',
    og_title: 'Container Offices Bangalore - SAMAN Portable Solutions',
    og_description: 'Transform shipping containers into modern office spaces. Sustainable, affordable, and quick setup container offices in Bangalore.',
    canonical: 'https://www.samanportable.com/product-category/container-offices',
    robots: { index: 'index', follow: 'follow' }
  },
  'portable-cabins': {
    title: 'Portable Cabins in Bangalore | Modular Office Cabins | SAMAN Portable',
    description: 'High-quality portable cabins in Bangalore. Modular, relocatable office cabins for construction sites, events, and temporary facilities.',
    og_title: 'Portable Cabins Bangalore - Saman Portable',
    og_description: 'Premium portable cabins for all your temporary space needs. Quick installation, durable construction, and customizable designs.',
    canonical: 'https://www.samanportable.com/product-category/portable-cabins',
    robots: { index: 'index', follow: 'follow' }
  },
  'prefab-structures': {
    title: 'Prefab Structures in Bangalore | Prefabricated Buildings | SAMAN Portable',
    description: 'Innovative prefab structures and prefabricated buildings in Bangalore. Fast construction, cost-effective, and sustainable building solutions.',
    og_title: 'Prefab Structures Bangalore - SAMAN Portable Solutions',
    og_description: 'Modern prefabricated structures for commercial and industrial use. Quick assembly, durable materials, and custom designs.',
    canonical: 'https://www.samanportable.com/product-category/prefab-structures',
    robots: { index: 'index', follow: 'follow' }
  },
  'security-cabins': {
    title: 'Security Cabins in Bangalore | Guard Cabins | SAMAN Portable',
    description: 'Secure and durable security cabins in Bangalore. Perfect guard cabins for construction sites, parking lots, and commercial properties.',
    og_title: 'Security Cabins Bangalore - Saman Portable',
    og_description: 'Professional security cabins and guard houses. Weather-resistant, secure, and comfortable spaces for security personnel.',
    canonical: 'https://www.samanportable.com/product-category/security-cabins',
    robots: { index: 'index', follow: 'follow' }
  },
  'toilet-blocks': {
    title: 'Portable Toilet Blocks in Bangalore | Mobile Toilets | SAMAN Portable',
    description: 'Hygienic portable toilet blocks in Bangalore. Mobile toilet solutions for construction sites, events, and temporary facilities.',
    og_title: 'Portable Toilet Blocks Bangalore - SAMAN Portable Solutions',
    og_description: 'Clean and comfortable portable toilet blocks. Perfect for construction sites, events, and areas without permanent facilities.',
    canonical: 'https://www.samanportable.com/product-category/toilet-blocks',
    robots: { index: 'index', follow: 'follow' }
  },
  'container-cafe': {
    title: 'Container Cafe in Bangalore | Shipping Container Cafe | SAMAN Portable',
    description: 'High-quality container cafe in Bangalore. Professional portable solutions for your business needs. Contact SAMAN Portable for best prices.',
    og_title: 'Container Cafe Bangalore - SAMAN Portable Solutions',
    og_description: 'Premium container cafe for all your portable space requirements. Quick delivery and professional installation.',
    canonical: 'https://www.samanportable.com/product-category/container-cafe',
    robots: { index: 'index', follow: 'follow' }
  }
};

// Fetch ONLY Rank Math SEO data from WordPress (no fallbacks)
export async function fetchCategoryRankMathSEO(categorySlug: string): Promise<RankMathSEOData | null> {
  try {
    // Use the correct WordPress blog URL for category pages
    const categoryUrl = `https://blog.samanportable.com/product-category/${categorySlug}/`;
    const wordpressData = await fetchRankMathSEO(categoryUrl);
    
    // Return only WordPress Rank Math data, even if it's generic or incomplete
    return wordpressData;
  } catch (error) {
    console.error('Failed to fetch Rank Math data:', error);
    return null;
  }
}

// Enhanced blog posts fetch with pagination - OPTIMIZED
export async function fetchBlogPosts(page = 1, perPage = API_CONFIG.BLOG_PER_PAGE): Promise<{ posts: BlogPost[]; pagination: PaginationInfo }> {
  try {
    // Build URL with embedded data for featured images
    const url = `${API_CONFIG.BLOG_API_ENDPOINT}/posts?page=${page}&per_page=${perPage}&_embed=true&status=publish`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders(),
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
    const response = await fetch(`${API_CONFIG.BLOG_API_ENDPOINT}/media/${mediaId}`, {
      headers: getApiHeaders(),
    });
    if (response.ok) {
      const media = await response.json();
      return media.source_url || null;
    } else {
      console.warn(`Failed to fetch media ${mediaId}: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching featured image ${mediaId}:`, error);
  }

  return null;
}

// Single blog post fetch.
//
// Return contract (relied upon by the blog-detail getServerSideProps):
//   • returns a post object   → post exists.
//   • returns null            → backend responded SUCCESSFULLY but no such post
//                               (WordPress returns 200 + []). A 404 is correct.
//   • THROWS BackendFetchError → backend failed/timeout/5xx/429 or invalid shape.
//                               The caller MUST surface a 5xx, never a false 404.
// Previously this swallowed every failure into null, so a transient backend
// outage was indistinguishable from a genuinely missing post and produced a 404.
export async function fetchBlogPost(slug: string) {
  const response = await fetchWithResilience(
    `${API_CONFIG.BLOG_API_ENDPOINT}/posts?slug=${slug}&_embed`,
    {
      headers: getApiHeaders(),
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new BackendFetchError(`Failed to fetch blog post: ${response.status}`, response.status);
  }

  let posts: any;
  try {
    posts = await response.json();
  } catch {
    throw new BackendFetchError('Invalid JSON from posts endpoint');
  }
  if (!Array.isArray(posts)) {
    throw new BackendFetchError('Unexpected posts response shape');
  }

  return posts[0] || null; // backend OK, post genuinely does not exist → 404 valid
}

// Enhanced product categories fetch - OPTIMIZED
export async function fetchProductCategories() {
  try {
    const response = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products/categories?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&per_page=20&hide_empty=true&_fields=id,name,slug,count`,
      {
        headers: getApiHeaders(),
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
        headers: getApiHeaders(),
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
        headers: getApiHeaders(),
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
          // Inject category info if missing to ensure correct routing
          const productsWithCategory = categoryResponse.products.map(product => ({
            ...product,
            category_slug: product.category_slug || categorySlug,
            category_name: product.category_name || (product.categories && product.categories[0]?.name) || categorySlug.replace(/-/g, ' ')
          }));
          allProducts = [...allProducts, ...productsWithCategory];
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
        headers: getApiHeaders(),
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
      headers: getApiHeaders(),
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

// Optimized single product fetch with minimal fields.
//
// Return contract (relied upon by the product-detail getServerSideProps):
//   • returns a LightweightProduct  → product exists.
//   • returns null                  → backend responded SUCCESSFULLY but no such
//                                      product (WooCommerce returns 200 + []). A
//                                      404 for this case is correct.
//   • THROWS BackendFetchError      → backend failed/timeout/5xx/429 or returned an
//                                      invalid shape. The caller MUST surface a 5xx
//                                      (retryable), never a false 404.
// This function intentionally no longer swallows fetch failures into null.
export async function fetchLightweightProduct(slug: string): Promise<LightweightProduct | null> {
  const params = new URLSearchParams({
    slug: slug,
    consumer_key: API_CONFIG.WC_CONSUMER_KEY,
    consumer_secret: API_CONFIG.WC_CONSUMER_SECRET,
    _fields: 'id,name,slug,sku,price,regular_price,sale_price,on_sale,images,short_description,stock_status,average_rating,rating_count,categories',
  });

  const response = await fetchWithResilience(
    `${API_CONFIG.WC_BASE_URL}/products?${params.toString()}`,
    {
      headers: getApiHeaders(),
      next: { revalidate: 300 },
    }
  );

  // A non-2xx here (401/403/404/400 from the REST endpoint, etc.) means the
  // request itself failed — NOT that this specific product is confirmed absent
  // (genuine absence is a 200 with an empty array). Treat as a backend failure so
  // the page returns a retryable 5xx rather than a false 404.
  if (!response.ok) {
    throw new BackendFetchError(`Failed to fetch product: ${response.status}`, response.status);
  }

  let products: any;
  try {
    products = await response.json();
  } catch {
    throw new BackendFetchError('Invalid JSON from products endpoint');
  }
  if (!Array.isArray(products)) {
    throw new BackendFetchError('Unexpected products response shape');
  }

  const product = products[0] || null;
  if (!product) return null; // backend OK, product genuinely does not exist → 404 valid

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
    sku: product.sku || '',
  };
}

// Fetch full product description separately (for product detail pages)
// Common meta keys used by themes for category extra descriptions
const CATEGORY_EXTRA_DESC_META_KEYS = [
  'extra_description',
  'category_extra_desc',
  '_category_extra_desc',
  'cat_extra_desc',
  'term_extra_description',
  'cat_seo_description',
];

export interface ProductCategoryDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  extraDescription: string;
  count: number;
  image?: {
    id: number;
    src: string;
    alt: string;
  } | null;
}

// Fetch a single product category by slug with description and meta data
export async function fetchProductCategoryBySlug(slug: string): Promise<ProductCategoryDetail | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.WC_BASE_URL}/products/categories?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&slug=${slug}`,
      {
        headers: getApiHeaders(),
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status}`);
    }

    const categories = await response.json();
    const category = categories[0] || null;
    if (!category) return null;

    // Try to find extra description from meta_data
    let extraDescription = '';
    const metaData = category.meta_data || [];
    for (const meta of metaData) {
      if (CATEGORY_EXTRA_DESC_META_KEYS.includes(meta.key) && meta.value) {
        extraDescription = meta.value;
        break;
      }
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      extraDescription,
      count: category.count || 0,
      image: category.image || null,
    };
  } catch (error) {
    console.error('Error fetching product category by slug:', error);
    return null;
  }
}

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
        headers: getApiHeaders(),
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
