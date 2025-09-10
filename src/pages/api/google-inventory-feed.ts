import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '@/config/api';

// Google Merchant Center Inventory Feed API
// This provides real-time inventory data for Google Merchant Center
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all products with inventory data
    const allProducts = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 50) { // Limit to 50 pages to prevent infinite loops
      const result = await fetchProducts(page, 100); // Fetch 100 products per page
      
      if (result.products && result.products.length > 0) {
        allProducts.push(...result.products);
        hasMore = result.pagination.hasNextPage;
        page++;
      } else {
        hasMore = false;
      }
    }

    // Generate inventory XML feed
    const xmlFeed = generateInventoryXML(allProducts);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes (shorter for inventory)
    
    return res.status(200).send(xmlFeed);
  } catch (error) {
    console.error('Error generating Google inventory feed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

function generateInventoryXML(products: any[]): string {
  const baseUrl = 'https://www.samanportable.com';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
  xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
`;
  xml += `  <channel>
`;
  xml += `    <title>Saman Portable - Inventory Data</title>
`;
  xml += `    <link>${baseUrl}</link>
`;
  xml += `    <description>Real-time inventory data for Saman Portable products</description>
`;
  xml += `    <language>en-IN</language>
`;
  xml += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;

  products.forEach(product => {
    // Skip products without essential data
    if (!product.name || !product.id) {
      return;
    }

    // Clean product name
    const cleanName = (product.name || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    
    xml += `    <item>
`;
    xml += `      <g:id>${product.id}</g:id>
`;
    xml += `      <g:title><![CDATA[${cleanName}]]></g:title>
`;
    
    // Inventory data - this is the core of the inventory feed
    xml += `      <g:availability>${getAvailability(product.stock_status)}</g:availability>
`;
    
    // Quantity information
    if (product.stock_quantity !== null && product.stock_quantity !== undefined) {
      xml += `      <g:quantity>${product.stock_quantity}</g:quantity>
`;
    } else {
      // For made-to-order products, set quantity to 1
      xml += `      <g:quantity>1</g:quantity>
`;
    }
    
    // Price information for inventory context
    const price = parseFloat(product.price) || parseFloat(product.regular_price) || 0;
    xml += `      <g:price>${price.toFixed(2)} INR</g:price>
`;
    
    if (product.on_sale && product.sale_price) {
      const salePrice = parseFloat(product.sale_price);
      if (salePrice < price) {
        xml += `      <g:sale_price>${salePrice.toFixed(2)} INR</g:sale_price>
`;
      }
    }
    
    // Additional inventory attributes
    xml += `      <g:mpn>${product.id}</g:mpn>
`;
    xml += `      <g:brand>Saman Portable</g:brand>
`;
    xml += `      <g:condition>new</g:condition>
`;
    
    // Stock status details
    xml += `      <g:custom_label_0>${getStockLabel(product.stock_status)}</g:custom_label_0>
`;
    
    // Last updated timestamp
    xml += `      <g:last_updated>${new Date().toISOString()}</g:last_updated>
`;
    
    xml += `    </item>
`;
  });
  
  xml += `  </channel>
`;
  xml += `</rss>`;
  
  return xml;
}

function getAvailability(stockStatus: string): string {
  switch (stockStatus) {
    case 'instock':
      return 'in_stock';
    case 'outofstock':
      return 'out_of_stock';
    case 'onbackorder':
      return 'backorder';
    default:
      return 'in_stock'; // Default to in stock
  }
}

function getStockLabel(stockStatus: string): string {
  switch (stockStatus) {
    case 'instock':
      return 'In Stock';
    case 'outofstock':
      return 'Out of Stock';
    case 'onbackorder':
      return 'Backorder';
    default:
      return 'Available';
  }
}
