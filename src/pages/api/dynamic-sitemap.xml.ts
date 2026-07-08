import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts, fetchProductCategories } from '@/lib/staticContent';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set proper headers for XML
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    
    const baseUrl = 'https://www.samanportable.com';
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about-us', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/blog', priority: '0.7', changefreq: 'weekly' },
      { url: '/product', priority: '0.8', changefreq: 'weekly' },
      { url: '/gallery', priority: '0.7', changefreq: 'monthly' },
      { url: '/rental-services', priority: '0.7', changefreq: 'monthly' },
      { url: '/quote', priority: '0.6', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
    ];
    
    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
`;
      sitemap += `    <loc>${baseUrl}${page.url}</loc>
`;
      sitemap += `    <lastmod>${currentDate}</lastmod>
`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>
`;
      sitemap += `    <priority>${page.priority}</priority>
`;
      sitemap += `  </url>
`;
    });
    
    try {
      // Fetch product categories
      const categories = await fetchProductCategories();
      
      // Add category pages
      if (categories && categories.length > 0) {
        categories.forEach((category: any) => {
          if (category.slug && category.slug !== 'uncategorized') {
            sitemap += `  <url>
`;
            sitemap += `    <loc>${baseUrl}/product/${category.slug}</loc>
`;
            sitemap += `    <lastmod>${currentDate}</lastmod>
`;
            sitemap += `    <changefreq>weekly</changefreq>
`;
            sitemap += `    <priority>0.7</priority>
`;
            sitemap += `  </url>
`;
          }
        });
      }
      
      // Fetch all products
      const allProducts = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore && page <= 20) { // Limit to prevent infinite loops
        const result = await fetchProducts(page, 100);
        
        if (result.products && result.products.length > 0) {
          allProducts.push(...result.products);
          hasMore = result.pagination.hasNextPage;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      // Add individual product pages
      allProducts.forEach((product: any) => {
        if (product.slug && product.categories && product.categories.length > 0) {
          const categorySlug = product.categories[0].slug || 'uncategorized';
          
          // Category listing page for this product
          sitemap += `  <url>
`;
          sitemap += `    <loc>${baseUrl}/product/${categorySlug}</loc>
`;
          sitemap += `    <lastmod>${currentDate}</lastmod>
`;
          sitemap += `    <changefreq>weekly</changefreq>
`;
          sitemap += `    <priority>0.7</priority>
`;
          sitemap += `  </url>
`;
          
          // Individual product page
          sitemap += `  <url>
`;
          sitemap += `    <loc>${baseUrl}/product/${categorySlug}/${product.slug}</loc>
`;
          sitemap += `    <lastmod>${product.date_modified || currentDate}</lastmod>
`;
          sitemap += `    <changefreq>monthly</changefreq>
`;
          sitemap += `    <priority>0.6</priority>
`;
          sitemap += `  </url>
`;
        }
      });
      
    } catch (productError) {
      console.error('Error fetching products for sitemap:', productError);
      // Continue with static pages only
    }
    
    sitemap += `</urlset>`;
    
    res.status(200).send(sitemap);
    
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    
    // Fallback sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.samanportable.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    res.status(200).send(fallbackSitemap);
  }
}