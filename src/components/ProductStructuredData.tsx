import Head from 'next/head';
import { WooCommerceProduct, ProductReview } from '@/config/api';
import { generateStructuredDataDescription } from '@/utils/contentUtils';
import type { VariantProductData } from '@/components/product-variant-hero/types';
import { resolveVariantProductName, resolveVariantVideo } from '@/components/product-variant-hero/presets';
import { hasRightToExistEntry } from '@/components/product-variant-hero/RightToExist';

interface ProductStructuredDataProps {
  product: WooCommerceProduct;
  category?: string;
  // REAL approved backend reviews that are ALSO rendered on the page. Only these
  // become Review JSON-LD — never fabricated. When empty/undefined, no Review
  // schema is emitted (AggregateRating is independent, from rating_count).
  reviews?: ProductReview[];
  // SHIKHAR C1 — when provided, the BreadcrumbList is built from this exact array
  // (the SAME one that renders the visible breadcrumb), guaranteeing visible/JSON-LD
  // parity. Absolute `item` URLs. Falls back to the internal 4-node build when omitted
  // (backward compatible for any caller that does not pass it).
  breadcrumbItems?: Array<{ name: string; url: string }>;
  // T24.1 — when provided (porta-cabins only), the single Product node is replaced
  // by ONE ProductGroup with a hasVariant Product entry per size. Every other page
  // (this prop omitted) keeps the existing single-Product schema, byte-for-byte.
  variantData?: VariantProductData;
}

export default function ProductStructuredData({ product, category, reviews, breadcrumbItems, variantData }: ProductStructuredDataProps) {
  if (!product) return null;

  const baseUrl = 'https://www.samanportable.com';
  const schemaMode = (product as any).schemaMode || '';
  const forceStandaloneQuoteProduct = schemaMode === 'standalone-quote-product';
  const categorySlug = category || product.categories?.[0]?.slug || 'uncategorized';
  const productPath = product.slug === categorySlug
    ? `/product/${categorySlug}`
    : `/product/${categorySlug}/${product.slug}`;
  const productUrl = `${baseUrl}${productPath}`;
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

  const offerStructuredData = !forceStandaloneQuoteProduct && (salePrice || price) > 0 ? {
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
    // Mirrors /delivery-policy: default flat â‚¹3,000 shipping shown in Merchant
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
  } : undefined;

  // When the product states real, distance-based freight on-page (shippingHtml),
  // omit the flat ₹3,000 Merchant-Center shippingDetails so the schema does not
  // contradict the page. All other products keep the default shippingDetails.
  if (offerStructuredData && (product as any).shippingHtml) {
    delete (offerStructuredData as any).shippingDetails;
  }

  const aggregateRatingStructuredData = product.rating_count > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: product.average_rating,
    reviewCount: product.rating_count,
    bestRating: '5',
    worstRating: '1'
  } : undefined;

  const hasProductRichResultEvidence = Boolean(
    offerStructuredData ||
    aggregateRatingStructuredData ||
    reviewNodes.length > 0
  );

  // T24.1 — porta-cabins variant hero: ONE ProductGroup replaces the single Product
  // node, with a hasVariant Product entry per size (name/sku/image from
  // data/products/porta-cabins.json — the SAME data the buy box renders).
  // Amendment G v2: offers.price is the INCL-GST figure (visible on-page per G1, so
  // G6 holds), and the ProductGroup carries the aggregateRating + reviews computed
  // from the 5 SAMAN-verified reviews only (ratingValue 4.6, ratingCount 5) — both
  // visible on the page (hero badge + Reviews tab), so no fake/unbacked rating.
  const variantProductName = resolveVariantProductName(variantData, product.name);
  const hasRightToExistVariant = Boolean(
    variantData && hasRightToExistEntry(variantData.productSlug)
  );

  // Ex-GST AggregateOffer for a variant product whose ladder is confirmed and which
  // opts in (variantData.emitAggregateOffer). Emitted on the ProductGroup INSTEAD of
  // per-variant Offers, so the single price signal is the ex-GST range that matches
  // the visible primary price. porta-cabins does not set the flag → this stays null and
  // its per-variant Offers are untouched (byte-identical).
  const exGstPrices = variantData
    ? variantData.variants.map((v) => v.priceExGst).filter((p): p is number => p != null)
    : [];
  const aggregateOfferStructuredData =
    (variantData?.emitAggregateOffer || hasRightToExistVariant) &&
    variantData &&
    exGstPrices.length === variantData.variants.length &&
    exGstPrices.length > 0
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: Math.min(...exGstPrices),
          highPrice: Math.max(...exGstPrices),
          offerCount: variantData.variants.length,
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
      : null;

  const productGroupStructuredData = variantData ? {
    '@context': 'https://schema.org/',
    '@type': 'ProductGroup',
    name: product.name,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Saman Portable'
    },
    variesBy: 'size',
    ...(aggregateOfferStructuredData ? { offers: aggregateOfferStructuredData } : {}),
    ...(aggregateRatingStructuredData ? { aggregateRating: aggregateRatingStructuredData } : {}),
    ...(reviewNodes.length > 0 ? { review: reviewNodes } : {}),
    hasVariant: variantData.variants.map((v) => ({
      '@type': 'Product',
      // T25 — the product noun comes from the variant data / its preset, falling
      // back to the page's real product name. It was hardcoded "Porta Cabin",
      // which would have mis-named every sibling subpage's variants.
      name: `${v.label.replace(/\s*ft$/i, '')} ft ${variantProductName}`,
      sku: v.sku,
      // T24.1 B — `size` matches the parent's variesBy: 'size' and clears the GSC
      // Merchant-listings "Missing field size" warning on all 9 variants. Value is
      // the variant's own label (honest data already in porta-cabins.json), with the
      // dimension separator normalised to × (10x10 ft -> "10×10 ft").
      size: v.label.replace(/(\d)\s*x\s*(\d)/i, '$1×$2'),
      ...(v.images[0] ? { image: `${baseUrl}${v.images[0].src}` } : {}),
      // Per-variant Offer (incl-GST) — the porta-cabins pattern. Suppressed when the
      // page emits an ex-GST AggregateOffer instead (emitAggregateOffer), and omitted
      // entirely while a price is gated (priceInclGst null). porta-cabins sets neither
      // flag → this emits exactly as before (flagship byte-identity).
      ...(((hasRightToExistVariant ? v.priceExGst : (!variantData.emitAggregateOffer ? v.priceInclGst : null)) != null) ? {
        offers: {
          '@type': 'Offer',
          price: hasRightToExistVariant ? v.priceExGst : v.priceInclGst,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: productUrl,
          ...(hasRightToExistVariant ? {
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'IN',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 7,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/ReturnShippingFees',
            },
          } : {}),
        },
      } : {}),
    })),
  } : null;

  // T24.1-V — VideoObject for the product overview video. Emitted as a SEPARATE
  // top-level node alongside the ProductGroup (which is not altered in any way).
  // No contentUrl: the file is YouTube-hosted, embedUrl is correct.
  // T25 §4 — OPT-IN, not "any variantData". It used to be gated on variantData
  // alone, which meant wiring the variant template into the sibling subpage route
  // would have emitted the FLAGSHIP's video on every subpage. It now requires the
  // product's own `hasProductVideo: true` plus its own video metadata, so exactly
  // one page (/product/porta-cabins) emits it — the same output as before.
  const variantVideo = resolveVariantVideo(variantData);
  const videoStructuredData = variantVideo ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: variantVideo.title,
    description: variantVideo.schemaDescription,
    thumbnailUrl: [variantVideo.schemaThumbnailUrl],
    uploadDate: variantVideo.uploadDate,
    duration: variantVideo.duration,
    embedUrl: variantVideo.embedUrl,
    publisher: {
      '@id': 'https://www.samanportable.com/#organization',
    },
  } : null;

  // Generate structured data for Product only when it has real Product-snippet
  // evidence. Quote-only/unrated products must not emit an ineligible Product
  // node with no offers, aggregateRating, or review.
  const productStructuredData = productGroupStructuredData ? productGroupStructuredData : (hasProductRichResultEvidence || forceStandaloneQuoteProduct) ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    ...(forceStandaloneQuoteProduct ? { '@id': `${productUrl}#product` } : {}),
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
    ...(offerStructuredData ? { offers: offerStructuredData } : {}),
    ...(aggregateRatingStructuredData ? { aggregateRating: aggregateRatingStructuredData } : {}),
    // additionalProperty only from real WooCommerce attributes; omitted when none exist.
    ...(realAdditionalProperty.length > 0 ? { additionalProperty: realAdditionalProperty } : {}),
    // Review nodes ONLY for real approved reviews that are visibly rendered on the
    // page; omitted entirely when none were fetched/shown (no fake reviews).
    ...(reviewNodes.length > 0 ? { review: reviewNodes } : {}),
  } : null;

  // Generate BreadcrumbList structured data.
  // SHIKHAR C1: when the page passes `breadcrumbItems` (the same array that renders
  // the visible trail), build the list from it so visible and JSON-LD match exactly.
  // Otherwise fall back to the original 4-node build (backward compatible).
  const breadcrumbSource = (breadcrumbItems && breadcrumbItems.length > 0)
    ? breadcrumbItems
    : [
        { name: 'Home', url: baseUrl },
        { name: 'Products', url: `${baseUrl}/product` },
        { name: product.categories?.[0]?.name || 'Category', url: `${baseUrl}/product/${product.categories?.[0]?.slug || 'uncategorized'}` },
        { name: product.name, url: productUrl },
      ];
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbSource.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
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
    ...(productStructuredData ? { mainEntity: productStructuredData } : {}),
    breadcrumb: breadcrumbStructuredData
  };

  if (forceStandaloneQuoteProduct && productStructuredData) {
    return (
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData)
          }}
        />
      </Head>
    );
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemPageStructuredData)
        }}
      />
      {/* Product and Breadcrumb schemas are now included in ItemPage mainEntity */}
      {videoStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoStructuredData)
          }}
        />
      )}
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
