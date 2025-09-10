const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://www.samanportable.com';
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');

// Static pages (existing)
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about-us', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/product', priority: '0.8', changefreq: 'weekly' },
  { path: '/rental-services', priority: '0.7', changefreq: 'monthly' },
  { path: '/cart', priority: '0.5', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms-and-conditions', priority: '0.5', changefreq: 'monthly' },
  { path: '/delivery-policy', priority: '0.5', changefreq: 'monthly' },
  { path: '/refund-and-return-policy', priority: '0.5', changefreq: 'monthly' },
];

// Rental service pages (existing)
const RENTAL_PAGES = [
  '/container-rent-services/10x10-porta-cabin-rental',
  '/container-rent-services/10x8-container-office-rental',
  '/container-rent-services/20x10-porta-cabin-rental',
  '/container-rent-services/20x8-container-office-rental',
  '/container-rent-services/30x10-porta-cabin-rental',
  '/container-rent-services/30x8-container-office-rental',
  '/container-rent-services/40x10-porta-cabin-rental',
  '/container-rent-services/40x8-container-office-rental',
];

// Fetch all items with pagination
async function fetchAllWithPagination(baseUrl, itemType = 'items') {
  const allItems = [];
  let page = 1;
  let hasMore = true;
  const perPage = 100; // Maximum allowed by WordPress API
  
  console.log(`Fetching all ${itemType} with pagination...`);
  
  while (hasMore) {
    try {
      const url = `${baseUrl}&page=${page}&per_page=${perPage}`;
      console.log(`  Fetching page ${page}...`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Error fetching page ${page}: ${response.status} ${response.statusText}`);
        break;
      }
      
      const items = await response.json();
      
      if (items.length === 0) {
        hasMore = false;
        console.log(`  No more items on page ${page}`);
      } else {
        allItems.push(...items);
        console.log(`  Fetched ${items.length} items from page ${page}`);
        
        // Check if we've reached the last page
        const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
        if (page >= totalPages) {
          hasMore = false;
          console.log(`  Reached last page (${totalPages})`);
        }
        
        page++;
      }
      
      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMore = false;
    }
  }
  
  console.log(`✅ Total ${itemType} fetched: ${allItems.length}`);
  return allItems;
}

// Fetch dynamic content from WordPress
async function fetchDynamicContent() {
  const dynamicPaths = [];
  
  try {
    // Fetch ALL product categories
    console.log('\n📂 Fetching product categories...');
    const categoriesResponse = await fetch(
      'https://blog.samanportable.com/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2'
    );
    
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      categories.forEach(category => {
        if (category.slug && category.slug !== 'uncategorized') {
          dynamicPaths.push({
            path: `/product-category/${category.slug}`,
            priority: '0.8',
            changefreq: 'weekly',
            lastmod: new Date().toISOString(),
          });
        }
      });
      console.log(`✅ Added ${categories.length} product categories`);
    }
    
    // Fetch ALL products with pagination
    console.log('\n🛍️ Fetching ALL products...');
    const productsBaseUrl = 'https://blog.samanportable.com/wp-json/wc/v3/products?consumer_key=ck_34fce5a6d68e1199b9ac194e1a3431c76b7e6c92&consumer_secret=cs_2205531d149e9d4835ee3485dd5414133817fdf2&_embed';
    const allProducts = await fetchAllWithPagination(productsBaseUrl, 'products');
    
    allProducts.forEach(product => {
      if (product.slug && product.categories && product.categories.length > 0) {
        const primaryCategory = product.categories[0];
        dynamicPaths.push({
          path: `/product/${primaryCategory.slug}/${product.slug}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: new Date(product.date_modified || product.date_created).toISOString(),
        });
      }
    });
    console.log(`✅ Added ${allProducts.length} products to sitemap`);
    
    // Fetch ALL blog posts with pagination
    console.log('\n📝 Fetching ALL blog posts...');
    const blogBaseUrl = 'https://blog.samanportable.com/wp-json/wp/v2/posts?_embed';
    const allBlogPosts = await fetchAllWithPagination(blogBaseUrl, 'blog posts');
    
    allBlogPosts.forEach(post => {
      if (post.slug) {
        dynamicPaths.push({
          path: `/${post.slug}`,
          priority: '0.6',
          changefreq: 'monthly',
          lastmod: new Date(post.modified || post.date).toISOString(),
        });
      }
    });
    console.log(`✅ Added ${allBlogPosts.length} blog posts to sitemap`);
    
  } catch (error) {
    console.error('❌ Error fetching dynamic content:', error);
  }
  
  return dynamicPaths;
}

// Generate sitemap XML
function generateSitemapXML(allPaths) {
  const now = new Date().toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';
  
  // Add static pages
  STATIC_PAGES.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  // Add rental pages
  RENTAL_PAGES.forEach(rentalPath => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${rentalPath}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });
  
  // Add dynamic paths
  allPaths.forEach(item => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${item.path}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += '</urlset>';
  return xml;
}

// Main function
async function generateSitemap() {
  console.log('🚀 Starting comprehensive sitemap generation...');
  console.log('📊 This will fetch ALL blog posts and products (no limits)');
  
  try {
    // Fetch dynamic content
    const dynamicPaths = await fetchDynamicContent();
    
    // Combine all paths
    const allPaths = [...dynamicPaths];
    
    // Generate XML
    const sitemapXML = generateSitemapXML(allPaths);
    
    // Write to file
    fs.writeFileSync(OUTPUT_FILE, sitemapXML, 'utf8');
    
    console.log('\n🎉 Sitemap generated successfully!');
    console.log(`📁 Location: ${OUTPUT_FILE}`);
    console.log(`📊 Total URLs: ${STATIC_PAGES.length + RENTAL_PAGES.length + allPaths.length}`);
    console.log(`   - Static pages: ${STATIC_PAGES.length}`);
    console.log(`   - Rental pages: ${RENTAL_PAGES.length}`);
    console.log(`   - Dynamic content: ${dynamicPaths.length}`);
    
    // Count by type
    const productCategories = dynamicPaths.filter(p => p.path.startsWith('/product-category/')).length;
    const products = dynamicPaths.filter(p => p.path.startsWith('/product/')).length;
    const blogPosts = dynamicPaths.filter(p => !p.path.startsWith('/product') && !p.path.startsWith('/product-category')).length;
    
    console.log(`   📂 Product categories: ${productCategories}`);
    console.log(`   🛍️ Products: ${products}`);
    console.log(`   📝 Blog posts: ${blogPosts}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };
