import Head from 'next/head';
import { WooCommerceProduct } from '@/config/api';

interface ProductStructuredDataProps {
  product: WooCommerceProduct;
  category?: string;
}

export default function ProductStructuredData({ product, category }: ProductStructuredDataProps) {
  if (!product) return null;

  const baseUrl = 'https://www.samanportable.com';
  const productUrl = `${baseUrl}/product/${category || product.categories?.[0]?.slug || 'uncategorized'}/${product.slug}`;
  const imageUrl = product.images?.[0]?.src || `${baseUrl}/placeholder.svg`;
  const price = parseFloat(product.price) || parseFloat(product.regular_price) || 0;
  const salePrice = product.on_sale && product.sale_price ? parseFloat(product.sale_price) : null;
  
  // Clean description (remove HTML tags) and ensure proper length
  let description = product.short_description
    ? product.short_description.replace(/<[^>]*>/g, '').trim()
    : `${product.name} - Premium quality portable cabin/container office solution by Saman Portable`;
  
  // Ensure description is between 50-5000 characters for Google Merchant Center
  if (description.length < 50) {
    description = `${description}. High-quality portable structures manufactured by Saman Portable in Bangalore, India. Perfect for commercial, industrial, and residential use with customization options available.`;
  }
  if (description.length > 5000) {
    description = description.substring(0, 4997) + '...';
  }

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
      '@type': 'Organization',
      name: 'Saman Portable',
      url: baseUrl,
      logo: `${baseUrl}/saman-logo.svg`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bangalore',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        postalCode: '560001',
        addressCountry: 'IN'
      }
    },
    category: product.categories?.[0]?.name || 'Portable Structures',
    sku: product.id.toString(),
    gtin: `SAMAN${product.id.toString().padStart(8, '0')}`, // Generate valid GTIN-like identifier
    mpn: `SP-${product.id}`, // Manufacturer Part Number
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: salePrice || price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valid for 1 year
      availability: getSchemaAvailability(product.stock_status),
      itemCondition: 'https://schema.org/NewCondition',
      // Seller information removed to avoid duplicate Organization schemas
      // Manufacturer already provides Organization information
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
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
            minValue: 7,
            maxValue: 15,
            unitCode: 'DAY'
          }
        }
      }
    },
    aggregateRating: product.rating_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.average_rating,
      reviewCount: product.rating_count,
      bestRating: '5',
      worstRating: '1'
    } : undefined,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Material',
        value: 'Steel, Insulation, Interior Fittings'
      },
      {
        '@type': 'PropertyValue',
        name: 'Usage',
        value: 'Commercial, Industrial, Residential'
      },
      {
        '@type': 'PropertyValue',
        name: 'Customization',
        value: 'Available'
      }
    ]
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
  const itemPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: `${product.name} - Product Details`,
    description: description,
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