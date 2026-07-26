import Head from 'next/head';
import { WooCommerceProduct, ProductReview } from '@/config/api';
import {
  buildProductUrl,
  cleanText,
  getEffectiveProductPrice,
  getMerchantAvailability,
  getProductBrand,
  getProductSku,
  selectProductImages,
  stripHtml,
} from '@/lib/merchantFeed';

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
  const productUrl = buildProductUrl(product, category, baseUrl);
  const productImages = selectProductImages(product, baseUrl).map((image) => image.url);
  const imageUrl = productImages[0] || `${baseUrl}/placeholder.svg`;
  const price = getEffectiveProductPrice(product);
  const brandName = getProductBrand(product);
  const sku = getProductSku(product);
  
  // Product description from REAL WooCommerce data: prefer short_description, fall back to
  // the full description, and only use a generic line if BOTH backend fields are empty.
  // HTML is stripped so the schema description is plain text matching the visible content.
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

  const offerStructuredData = price > 0 ? {
    '@type': 'Offer',
    url: productUrl,
    priceCurrency: 'INR',
    price: price.toFixed(2),
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valid for 1 year
    availability: getSchemaAvailability(getMerchantAvailability(product.stock_status)),
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
    // Mirrors /delivery-policy: default flat â‚¹3,000 shipping shown in Merchant
    // Center (final cost quoted), standard estimate 3â€“5 business days.
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
  } : undefined;

  const aggregateRatingStructuredData = product.rating_count > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: product.average_rating,
    reviewCount: product.rating_count,
    bestRating: '5',
    worstRating: '1'
  } : undefined;

  const productId = `${productUrl}#product`;
  const breadcrumbId = `${productUrl}#breadcrumb`;
  const itemPageId = `${productUrl}#webpage`;

  const hasProductRichResultEvidence = Boolean(
    offerStructuredData ||
    aggregateRatingStructuredData ||
    reviewNodes.length > 0
  );

  const productStructuredData = hasProductRichResultEvidence ? {
    '@type': 'Product',
    '@id': productId,
    name: cleanText(product.name, 150),
    description,
    image: productImages.length > 0 ? productImages : [imageUrl],
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: brandName
    },
    manufacturer: {
      '@id': 'https://www.samanportable.com/#organization'
    },
    category: product.categories?.[0]?.name || 'Portable Structures',
    // Use the REAL WooCommerce SKU; omit the field entirely if the product has none
    // (never fall back to the numeric product id as a fake SKU).
    ...(sku ? { sku, mpn: sku } : {}),
    ...(offerStructuredData ? { offers: offerStructuredData } : {}),
    ...(aggregateRatingStructuredData ? { aggregateRating: aggregateRatingStructuredData } : {}),
    // additionalProperty only from real WooCommerce attributes; omitted when none exist.
    ...(realAdditionalProperty.length > 0 ? { additionalProperty: realAdditionalProperty } : {}),
    // Review nodes ONLY for real approved reviews that are visibly rendered on the
    // page; omitted entirely when none were fetched/shown (no fake reviews).
    ...(reviewNodes.length > 0 ? { review: reviewNodes } : {}),
  } : null;

  // Generate BreadcrumbList structured data
  const breadcrumbStructuredData = {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
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
    '@type': 'ItemPage',
    '@id': itemPageId,
    name: `${product.name} - Product Details`,
    description: itemPageDescription,
    url: productUrl,
    ...(productStructuredData ? { mainEntity: { '@id': productId } } : {}),
    breadcrumb: { '@id': breadcrumbId }
  };

  const structuredDataGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      productStructuredData,
      breadcrumbStructuredData,
      itemPageStructuredData,
    ].filter(Boolean),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataGraph)
        }}
      />
      {/* Product, Breadcrumb and ItemPage are emitted as a single @graph. */}
    </Head>
  );
}

function getSchemaAvailability(stockStatus: string): string {
  switch (stockStatus) {
    case 'in_stock':
      return 'https://schema.org/InStock';
    case 'out_of_stock':
      return 'https://schema.org/OutOfStock';
    case 'backorder':
      return 'https://schema.org/BackOrder';
    case 'preorder':
      return 'https://schema.org/PreOrder';
    default:
      return 'https://schema.org/InStock';
  }
}
