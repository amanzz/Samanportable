import Head from 'next/head';
import { WooCommerceProduct, ProductReview } from '@/config/api';
import { generateStructuredDataDescription } from '@/utils/contentUtils';

interface ProductStructuredDataProps {
  product: WooCommerceProduct;
  category?: string;
  // REAL approved backend reviews that are ALSO rendered on the page. Only these
  // become Review JSON-LD — never fabricated. When empty/undefined, no Review
  // schema is emitted (AggregateRating is independent, from rating_count).
  reviews?: ProductReview[];
}

export default function ProductStructuredData({ product, category, reviews }: ProductStructuredDataProps) {
  if (!product) return null;

  const baseUrl = 'https://www.samanportable.com';
  const productUrl = `${baseUrl}/product/${category || product.categories?.[0]?.slug || 'uncategorized'}/${product.slug}`;
  const imageUrl = product.images?.[0]?.src || `${baseUrl}/placeholder.svg`;
  const price = parseFloat(product.price) || parseFloat(product.regular_price) || 0;
  const salePrice = product.on_sale && product.sale_price ? parseFloat(product.sale_price) : null;
  
  // Product description from REAL WooCommerce data: prefer short_description, fall back to
  // the full description, and only use a generic line if BOTH backend fields are empty.
  // HTML is stripped so the schema description is plain text matching the visible content.
  const stripHtml = (html: string): string =>
    (html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;|&apos;/gi, "'")
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();
  const backendShort = stripHtml(product.short_description);
  const backendFull = stripHtml(product.description);
  const description =
    backendShort ||
    (backendFull ? backendFull.slice(0, 5000) : '') ||
    `${product.name} - Premium portable structure by Saman Portable.`;

  // Only REAL WooCommerce attributes become additionalProperty; omit entirely if none
  // (no invented Material/Usage/Customization values).
  const realAdditionalProperty = (product.attributes || [])
    .filter(a => a && a.name && Array.isArray(a.options) && a.options.length > 0)
    .map(a => ({ '@type': 'PropertyValue', name: a.name, value: a.options.join(', ') }));

  // Review JSON-LD is built ONLY from the real approved reviews passed in (the same
  // ones rendered visibly on the page). Text is stripped to plain text. If no
  // reviews are supplied, the `review` array is omitted entirely — never invented.
  const reviewNodes = (reviews || [])
    .filter(r => r && typeof r.rating === 'number' && r.rating > 0 && r.review && stripHtml(r.review).length > 0)
    .map(r => {
      const datePublished = (r.date_created || '').split('T')[0];
      return {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: '5',
          worstRating: '1',
        },
        author: { '@type': 'Person', name: r.reviewer || 'Anonymous' },
        ...(datePublished ? { datePublished } : {}),
        reviewBody: stripHtml(r.review),
      };
    });

  // Generate structured data for Product
  const productStructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name.length > 150 ? product.name.substring(0, 147) + '...' : product.name,
    description: description,
    image: product.images?.map(img => img.src) || [imageUrl],
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Saman Portable'
    },
    manufacturer: {
      '@id': 'https://www.samanportable.com/#organization'
    },
    category: product.categories?.[0]?.name || 'Portable Structures',
    // Use the REAL WooCommerce SKU; omit the field entirely if the product has none
    // (never fall back to the numeric product id as a fake SKU).
    ...(product.sku ? { sku: product.sku } : {}),
    // Only emit an Offer when a real price exists. An Offer with price 0 (quote-only
    // products) is invalid for Google and triggers "price" errors in Search Console.
    offers: (salePrice || price) > 0 ? {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: salePrice || price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valid for 1 year
      availability: getSchemaAvailability(product.stock_status),
      itemCondition: 'https://schema.org/NewCondition',
      // Seller information removed to avoid duplicate Organization schemas
      // Manufacturer already provides Organization information
      // Mirrors the published policy at /refund-and-return-policy: 7-day window,
      // return transport paid by the customer, full refund after inspection.
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
        refundType: 'https://schema.org/FullRefund',
        merchantReturnLink: 'https://www.samanportable.com/refund-and-return-policy'
      },
      // Mirrors /delivery-policy: default flat ₹3,000 shipping shown in Merchant
      // Center (final cost quoted), standard estimate 3–5 business days.
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '3000',
          currency: 'INR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 5,
            unitCode: 'DAY'
          }
        }
      }
    } : undefined,
    aggregateRating: product.rating_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.average_rating,
      reviewCount: product.rating_count,
      bestRating: '5',
      worstRating: '1'
    } : undefined,
    // additionalProperty only from real WooCommerce attributes; omitted when none exist.
    ...(realAdditionalProperty.length > 0 ? { additionalProperty: realAdditionalProperty } : {}),
    // Review nodes ONLY for real approved reviews that are visibly rendered on the
    // page; omitted entirely when none were fetched/shown (no fake reviews).
    ...(reviewNodes.length > 0 ? { review: reviewNodes } : {}),
  };

  // Generate BreadcrumbList structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${baseUrl}/product`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.categories?.[0]?.name || 'Category',
        item: `${baseUrl}/product-category/${product.categories?.[0]?.slug || 'uncategorized'}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: productUrl
      }
    ]
  };

  // Organization information is already included in manufacturer and seller schemas
  // No need for separate Organization schema to avoid duplicates

  // Generate ItemPage schema with mainEntity pointing to Product
  // Use completely different description for ItemPage to avoid duplication
  const itemPageDescription = `Explore ${product.name} - Premium modular units designed for versatility and long-term value. Ideal for various applications and environments.`;
  
  const itemPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: `${product.name} - Product Details`,
    description: itemPageDescription,
    url: productUrl,
    mainEntity: productStructuredData,
    breadcrumb: breadcrumbStructuredData
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemPageStructuredData)
        }}
      />
      {/* Product and Breadcrumb schemas are now included in ItemPage mainEntity */}
    </Head>
  );
}

function getSchemaAvailability(stockStatus: string): string {
  switch (stockStatus) {
    case 'instock':
      return 'https://schema.org/InStock';
    case 'outofstock':
      return 'https://schema.org/OutOfStock';
    case 'onbackorder':
      return 'https://schema.org/BackOrder';
    default:
      return 'https://schema.org/InStock';
  }
}