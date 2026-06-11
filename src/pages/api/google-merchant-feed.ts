import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '@/config/api';

// Google Merchant Center Product Feed API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all products (you may want to paginate for large catalogs)
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

    // Generate XML feed
    const xmlFeed = generateGoogleMerchantXML(allProducts);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    return res.status(200).send(xmlFeed);
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

function generateGoogleMerchantXML(products: any[]): string {
  const baseUrl = 'https://www.samanportable.com';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
  xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
`;
  xml += `  <channel>
`;
  xml += `    <title>Saman Portable - Container Offices &amp; Portable Cabins</title>
`;
  xml += `    <link>${baseUrl}</link>
`;
  xml += `    <description>Premium portable cabins, container offices, and modular structures in Bangalore, India</description>
`;
  xml += `    <language>en-IN</language>
`;
  xml += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;
  
  products.forEach(product => {
    // Skip products without essential data
    if (!product.name || !product.price || !product.slug) {
      return;
    }

    const productUrl = `${baseUrl}/product/${product.categories?.[0]?.slug || 'uncategorized'}/${product.slug}`;
    const imageUrl = product.images?.[0]?.src || `${baseUrl}/placeholder.svg`;
    const price = parseFloat(product.price) || parseFloat(product.regular_price) || 0;
    const salePrice = product.on_sale && product.sale_price ? parseFloat(product.sale_price) : null;
    
    // Clean description (remove HTML tags and invalid characters)
    const rawDescription = product.short_description
      ? product.short_description.replace(/<[^>]*>/g, '').trim()
      : `${product.name} - Premium quality portable cabin/container office solution`;
    const description = rawDescription.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    
    xml += `    <item>
`;
    // Clean product name
    const cleanName = (product.name || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    
    // Use consistent product ID format - this is critical for inventory matching
    xml += `      <g:id>${product.id}</g:id>
`;
    xml += `      <g:mpn>${product.id}</g:mpn>
`; // Use product ID as MPN for consistency
    xml += `      <g:title><![CDATA[${cleanName}]]></g:title>
`;
    xml += `      <g:description><![CDATA[${description}]]></g:description>
`;
    xml += `      <g:link>${productUrl}</g:link>
`;
    xml += `      <g:image_link>${imageUrl}</g:image_link>
`;
    
    // Additional images
    if (product.images && product.images.length > 1) {
      product.images.slice(1, 11).forEach((img: any) => { // Max 10 additional images
        xml += `      <g:additional_image_link>${img.src}</g:additional_image_link>
`;
      });
    }
    
    xml += `      <g:availability>${getAvailability(product.stock_status)}</g:availability>
`;
    
    // Add inventory data - this is crucial for Google Merchant Center
    if (product.stock_quantity !== null && product.stock_quantity !== undefined) {
      xml += `      <g:quantity>${product.stock_quantity}</g:quantity>
`;
    } else {
      // Default to 1 if no quantity specified (for made-to-order products)
      xml += `      <g:quantity>1</g:quantity>
`;
    }
    
    xml += `      <g:price>${price.toFixed(2)} INR</g:price>
`;
    
    if (salePrice && salePrice < price) {
      xml += `      <g:sale_price>${salePrice.toFixed(2)} INR</g:sale_price>
`;
    }
    
    xml += `      <g:brand>Saman Portable</g:brand>
`;
    xml += `      <g:condition>new</g:condition>
`;
    xml += `      <g:product_type>${escapeXml(product.categories?.[0]?.name || 'Portable Structures')}</g:product_type>
`;
    xml += `      <g:google_product_category>Business &amp; Industrial &gt; Construction &gt; Building Materials &gt; Structural Components</g:google_product_category>
`;
    
    // Custom labels for better organization
    xml += `      <g:custom_label_0>${escapeXml(product.categories?.[0]?.name || 'General')}</g:custom_label_0>
`;
    xml += `      <g:custom_label_1>${product.on_sale ? 'On Sale' : 'Regular'}</g:custom_label_1>
`;
    xml += `      <g:custom_label_2>${getStockLabel(product.stock_status)}</g:custom_label_2>
`;
    
    // Shipping information
    xml += `      <g:shipping>
`;
    xml += `        <g:country>IN</g:country>
`;
    xml += `        <g:service>Standard</g:service>
`;
    xml += `        <g:price>3000.00 INR</g:price>
`; // Default flat shipping per /delivery-policy (final cost confirmed in quotation)
    xml += `      </g:shipping>
`;
    
    // Additional required attributes for Google Merchant Center
    xml += `      <g:identifier_exists>true</g:identifier_exists>
`; // We now have MPN (product ID)
    xml += `      <g:adult>false</g:adult>
`;
    xml += `      <g:age_group>adult</g:age_group>
`;
    xml += `      <g:gender>unisex</g:gender>
`;
    xml += `      <g:material>Steel, Aluminum, Wood</g:material>
`;
    xml += `      <g:color>Customizable</g:color>
`;
    xml += `      <g:size>Customizable</g:size>
`;
    xml += `      <g:item_group_id>${product.categories?.[0]?.id || 'general'}</g:item_group_id>
`;
    
    // Business-specific attributes
    xml += `      <g:multipack>1</g:multipack>
`;
    xml += `      <g:is_bundle>false</g:is_bundle>
`;
    xml += `      <g:mobile_link>${productUrl}</g:mobile_link>
`;
    
    // Additional inventory and business data
    xml += `      <g:unit_pricing_measure>1 piece</g:unit_pricing_measure>
`;
    xml += `      <g:unit_pricing_base_measure>1 piece</g:unit_pricing_base_measure>
`;
    
    // Add cost of goods sold for better inventory tracking
    if (product.regular_price) {
      const costPrice = parseFloat(product.regular_price) * 0.7; // Estimate 70% of regular price as cost
      xml += `      <g:cost_of_goods_sold>${costPrice.toFixed(2)} INR</g:cost_of_goods_sold>
`;
    }
    
    // Shipping weight and dimensions (estimated for portable structures)
    xml += `      <g:shipping_weight>500 kg</g:shipping_weight>
`;
    xml += `      <g:shipping_length>6 m</g:shipping_length>
`;
    xml += `      <g:shipping_width>3 m</g:shipping_width>
`;
    xml += `      <g:shipping_height>3 m</g:shipping_height>
`;
    
    // Additional business attributes
    xml += `      <g:excluded_destination>Shopping Actions</g:excluded_destination>
`;
    xml += `      <g:included_destination>Shopping ads</g:included_destination>
`;
    xml += `      <g:ads_redirect>${productUrl}</g:ads_redirect>
`;
    
    xml += `    </item>
`;
  });
  
  xml += `  </channel>
`;
  xml += `</rss>`;
  
  return xml;
}

function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove invalid XML characters
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