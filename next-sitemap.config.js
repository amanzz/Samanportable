/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.samanportable.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://www.samanportable.com/sitemap.xml',
    ],
    sitemap: 'https://www.samanportable.com/sitemap.xml',
  },
  exclude: [
    '/api/*',
    '/_next/*',
    '/admin/*',
    '/checkout',
    '/cart',
    '/my-orders',
    '/test-optimizations',
  ],
  generateIndexSitemap: false,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  outDir: 'public',
  
  // Use custom sitemap generation for comprehensive content
  additionalPaths: async (config) => {
    const paths = [];
    
    try {
      
      
      // Fetch product categories
      
      const categoriesResponse = await fetch(
        'https://blog.samanportable.com/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2'
      );
      
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        categories.forEach(category => {
          if (category.slug && category.slug !== 'uncategorized') {
            paths.push({
              loc: `/product-category/${category.slug}`,
              changefreq: 'weekly',
              priority: 0.8,
              lastmod: new Date().toISOString(),
            });
          }
        });
        
      }
      
      // Fetch products with pagination
      
      let page = 1;
      let hasMore = true;
      const perPage = 100;
      
      while (hasMore) {
        const productsUrl = `https://blog.samanportable.com/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2&_embed`;
        
        const productsResponse = await fetch(productsUrl);
        if (productsResponse.ok) {
          const products = await productsResponse.json();
          
          if (products.length === 0) {
            hasMore = false;
          } else {
            products.forEach(product => {
              if (product.slug && product.categories && product.categories.length > 0) {
                const primaryCategory = product.categories[0];
                paths.push({
                  loc: `/product/${primaryCategory.slug}/${product.slug}`,
                  changefreq: 'weekly',
                  priority: 0.8,
                  lastmod: new Date(product.date_modified || product.date_created).toISOString(),
                });
              }
            });
            
            page++;
          }
        } else {
          hasMore = false;
        }
      }
      
      // Fetch blog posts with pagination
      
      page = 1;
      hasMore = true;
      let totalPostsFetched = 0;
      
      while (hasMore) {
        const postsUrl = `https://blog.samanportable.com/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_embed`;
        
        try {
          const postsResponse = await fetch(postsUrl);
          
          
          if (postsResponse.ok) {
            const posts = await postsResponse.json();
            
            if (posts.length === 0) {
              
              hasMore = false;
            } else {
              posts.forEach(post => {
                if (post.slug) {
                  paths.push({
                    loc: `/${post.slug}`,
                    changefreq: 'monthly',
                    priority: 0.6,
                    lastmod: new Date(post.modified || post.date).toISOString(),
                  });
                }
              });
              totalPostsFetched += posts.length;
              
              page++;
              
              // Add a small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } else {
            
            hasMore = false;
          }
        } catch (error) {
          
          hasMore = false;
        }
      }
      
      
      
      
      
    } catch (error) {
      
    }
    
    return paths;
  },
  
  transform: async (config, path) => {
    // Custom priority and changefreq for different page types
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/product-category/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/product/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/blog')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/container-rent-services/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Default for other pages
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
