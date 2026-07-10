import Head from 'next/head';
import type { WooCommerceProduct, ProductReview } from '@/config/api';
import { panelAggregateOffer } from '@/lib/panelSchemaOffers';

interface ProductStructuredDataProps {
  product: WooCommerceProduct;
  category?: string;
  // Kept for call-site compatibility. Reviews may still render visibly on the page.
  reviews?: ProductReview[];
}

export default function ProductStructuredData({ product, category }: ProductStructuredDataProps) {
  if (!product) return null;

  const baseUrl = 'https://www.samanportable.com';
  const categorySlug = category || product.categories?.[0]?.slug || 'uncategorized';
  const productPath = product.slug === categorySlug
    ? `/product/${categorySlug}`
    : `/product/${categorySlug}/${product.slug}`;
  const productUrl = `${baseUrl}${productPath}`;
  const imageUrl = product.images?.[0]?.src || `${baseUrl}/placeholder.svg`;
  const price = parseFloat(product.price) || parseFloat(product.regular_price) || 0;
  const salePrice = product.on_sale && product.sale_price ? parseFloat(product.sale_price) : null;

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

  const realAdditionalProperty = (product.attributes || [])
    .map(a => {
      const name = typeof a?.name === 'string' ? a.name.trim() : '';
      const values = Array.isArray(a?.options)
        ? a.options.map(option => String(option).trim()).filter(Boolean)
        : [];

      return name && values.length > 0
        ? { '@type': 'PropertyValue', name, value: values.join(', ') }
        : null;
    })
    .filter((property): property is { '@type': 'PropertyValue'; name: string; value: string } => Boolean(property));

  const offerStructuredData = (salePrice || price) > 0
    ? panelAggregateOffer(salePrice || price, productUrl)
    : undefined;

  const productStructuredData = offerStructuredData ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name.length > 150 ? product.name.substring(0, 147) + '...' : product.name,
    description,
    image: product.images?.map(img => img.src) || [imageUrl],
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Saman Portable',
    },
    manufacturer: {
      '@id': 'https://www.samanportable.com/#organization',
    },
    category: product.categories?.[0]?.name || 'Portable Structures',
    ...(product.sku ? { sku: product.sku } : {}),
    offers: offerStructuredData,
    ...(realAdditionalProperty.length > 0 ? { additionalProperty: realAdditionalProperty } : {}),
  } : null;

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${baseUrl}/product`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.categories?.[0]?.name || 'Category',
        item: `${baseUrl}/product-category/${product.categories?.[0]?.slug || 'uncategorized'}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  const itemPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: `${product.name} - Product Details`,
    description: `Explore ${product.name} - Premium modular units designed for versatility and long-term value. Ideal for various applications and environments.`,
    url: productUrl,
    ...(productStructuredData ? { mainEntity: productStructuredData } : {}),
    breadcrumb: breadcrumbStructuredData,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemPageStructuredData),
        }}
      />
    </Head>
  );
}
