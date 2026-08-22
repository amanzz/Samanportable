import Head from 'next/head';
import { WooCommerceProduct, ProductReview } from '@/config/api';
import type { VariantProductData } from '@/components/product-variant-hero/types';
import { resolveVariantVideo } from '@/components/product-variant-hero/presets';

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
  // Variant pages use this approved price ladder for the primary Product's
  // AggregateOffer; individual selector options do not become Product entities.
  variantData?: VariantProductData;
  // Commercial-truth gate for a live route awaiting an owner-approved ladder.
  // ItemPage/BreadcrumbList may remain, but Product and Offer must not emit.
  suppressProductEntity?: boolean;
  /** The page's approved meta description. Becomes the schema `description` so the
      Product node carries a concise summary rather than a slice of the body. */
  metaDescription?: string;
}

export default function ProductStructuredData({ product, category, reviews, breadcrumbItems, variantData, suppressProductEntity = false, metaDescription }: ProductStructuredDataProps) {
  if (!product) return null;

  const baseUrl = 'https://www.samanportable.com';
  const categorySlug = category || product.categories?.[0]?.slug || 'uncategorized';
  const productPath = product.slug === categorySlug
    ? `/product/${categorySlug}`
    : `/product/${categorySlug}/${product.slug}`;
  const productUrl = `${baseUrl}${productPath}`;
  const price = parseFloat(product.price) || parseFloat(product.regular_price) || 0;
  const salePrice = product.on_sale && product.sale_price ? parseFloat(product.sale_price) : null;
  const valueAddedTaxIncluded = (product as any).valueAddedTaxIncluded;
  
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
  // Schema `description` is a PRODUCT SUMMARY, not the sales document. It takes the
  // page's approved meta description first; only where a route has none does it fall
  // back to the old behaviour, so nothing regresses on pages without approved meta.
  // Long-form bodies made the old fallback visible: a 2,500-word description was being
  // sliced to 5,000 chars and emitted twice, inflating every byte served for no gain.
  const approvedMeta = stripHtml(metaDescription || variantData?.metaDescription || '');
  const description = approvedMeta || backendShort || (backendFull ? backendFull.slice(0, 5000) : '');

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

  // Product-wide rating-schema gate: fewer than three approved reviews is not
  // enough evidence for AggregateRating or Review/Rating JSON-LD. Visible review
  // cards remain governed by ProductReviews and are deliberately unchanged.
  const shouldEmitRatingSchema = Number(product.rating_count) >= 3;
  const reviewNodes = shouldEmitRatingSchema
    ? (reviews || [])
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
        })
    : [];

  const schemaAvailability = getSchemaAvailability(product.stock_status);
  const schemaItemCondition = getSchemaItemCondition(variantData?.schemaItemCondition);
  const offerStructuredData = (salePrice || price) > 0 ? {
    '@type': 'Offer',
    url: productUrl,
    priceCurrency: 'INR',
    price: salePrice || price,
    ...(typeof valueAddedTaxIncluded === 'boolean' ? {
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: salePrice || price,
        priceCurrency: 'INR',
        valueAddedTaxIncluded,
      },
    } : {}),
    ...(schemaAvailability ? { availability: schemaAvailability } : {}),
    itemCondition: schemaItemCondition,
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

  const aggregateRatingStructuredData = shouldEmitRatingSchema && !variantData?.suppressAggregateRatingSchema ? {
    '@type': 'AggregateRating',
    ratingValue: product.average_rating,
    reviewCount: product.rating_count,
    bestRating: '5',
    worstRating: '1'
  } : undefined;
  const productImages = product.images?.length
    ? product.images
        .slice(0, variantData?.schemaImageLimit && variantData.schemaImageLimit > 0 ? variantData.schemaImageLimit : product.images.length)
        .map(img => img.src)
    : [];

    // Variant pages render one primary Product. Most pages keep one Product-level
    // Offer/AggregateOffer; pages with an owner-approved per-size schema ruling can
    // opt into a six-offer array without turning selector options into Products.
  const exGstPrices = variantData
    ? variantData.variants.map((v) => v.priceExGst).filter((p): p is number => p != null)
    : [];
  const variantOfferStructuredData =
      variantData &&
      variantData.schemaOfferType === 'offer' &&
    exGstPrices.length === variantData.variants.length &&
    exGstPrices.length > 0
      ? {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'INR',
          price: Math.min(...exGstPrices),
          ...(schemaAvailability ? { availability: schemaAvailability } : {}),
          itemCondition: schemaItemCondition,
          }
        : null;
  const variantOffersStructuredData =
      variantData &&
      variantData.schemaOfferType === 'offers' &&
      exGstPrices.length === variantData.variants.length &&
      exGstPrices.length > 0
        ? variantData.variants.map((variant) => ({
            '@type': 'Offer',
            url: `${productUrl}#size-${variant.sizeSlug}`,
            name: `${variant.label} ${variantData.productName || product.name}`,
            priceCurrency: 'INR',
            price: variant.priceExGst,
            priceValidUntil: '2027-12-31',
            ...(schemaAvailability ? { availability: schemaAvailability } : {}),
            itemCondition: schemaItemCondition,
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: variant.priceExGst,
              priceCurrency: 'INR',
              valueAddedTaxIncluded: false,
            },
          }))
        : null;
  const aggregateOfferStructuredData =
    variantData &&
    variantData.schemaOfferType !== 'offer' &&
    exGstPrices.length === variantData.variants.length &&
    exGstPrices.length > 0
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: Math.min(...exGstPrices),
          highPrice: Math.max(...exGstPrices),
          offerCount: variantData.variants.length,
          ...(schemaAvailability ? { availability: schemaAvailability } : {}),
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'INR',
            valueAddedTaxIncluded: false,
          },
        }
      : null;

  const productOfferStructuredData = variantOffersStructuredData || variantOfferStructuredData || aggregateOfferStructuredData || offerStructuredData;
  const hasProductRichResultEvidence = Boolean(
    productOfferStructuredData ||
    aggregateRatingStructuredData ||
    reviewNodes.length > 0
  );

  // T24.1-V — VideoObject for the product overview video. Emitted as a separate
  // top-level node alongside the primary ItemPage/Product graph.
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
  const productStructuredData = !suppressProductEntity && (hasProductRichResultEvidence || variantData?.emitQuoteOnlyProduct) ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
      name: (variantData?.h1 || product.name).length > 150 ? (variantData?.h1 || product.name).substring(0, 147) + '...' : (variantData?.h1 || product.name),
    ...(description ? { description } : {}),
    ...(productImages.length ? { image: productImages } : {}),
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Saman Portable'
    },
    manufacturer: {
      '@id': 'https://www.samanportable.com/#organization'
    },
    ...(product.categories?.[0]?.name ? { category: product.categories[0].name } : {}),
    // Use the REAL WooCommerce SKU; omit the field entirely if the product has none
    // (never fall back to the numeric product id as a fake SKU).
    ...(product.sku ? { sku: product.sku } : {}),
    ...(productOfferStructuredData ? { offers: productOfferStructuredData } : {}),
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

  // ItemPage reuses the real catalog values instead of inventing separate copy.
  const itemPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: product.name,
    // No `description` here. It belongs on the Product node nested below as
    // mainEntity, and emitting it on both duplicated the whole string in every
    // document. One copy, on the entity the field actually describes.
    url: productUrl,
    ...(productStructuredData ? { mainEntity: productStructuredData } : {}),
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

function getSchemaAvailability(stockStatus: string): string | undefined {
  switch (stockStatus) {
    case 'instock':
      return 'https://schema.org/InStock';
    case 'outofstock':
      return 'https://schema.org/OutOfStock';
    case 'onbackorder':
      return 'https://schema.org/BackOrder';
    default:
      return undefined;
  }
}

function getSchemaItemCondition(condition: VariantProductData['schemaItemCondition'] | undefined): string {
  switch (condition) {
    case 'used':
      return 'https://schema.org/UsedCondition';
    case 'refurbished':
      return 'https://schema.org/RefurbishedCondition';
    case 'new':
    default:
      return 'https://schema.org/NewCondition';
  }
}
