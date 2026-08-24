#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pack = JSON.parse(readFileSync(resolve(root, 'content/co-07/CO-07-copy-pack-v1.json'), 'utf8'));
const filenameMap = JSON.parse(readFileSync(resolve(root, 'scripts/CO-07-output-filename-map-v1.2.json'), 'utf8'));

const outputFor = (source) => {
  const row = filenameMap.find((item) => item.source === source);
  if (!row) throw new Error(`Missing CO-07 v1.2 output filename for ${source}`);
  return row.output;
};

const parseIndianNumber = (value) => Number(value.replaceAll(',', ''));
const dimensions = (size) => {
  const [length, width] = size.split('x').map(Number);
  return { length, width, area: length * width };
};

const variants = pack.variants.map((copy) => {
  const { length, width, area } = dimensions(copy.size);
  const priceLine = copy.bullets.find((line) => /ex-GST, Rs/.test(line));
  const rateLine = copy.bullets.find((line) => /per sq ft/.test(line));
  const priceMatch = priceLine?.match(/Rs ([\d,]+) ex-GST, Rs ([\d,]+)/);
  const rateMatch = rateLine?.match(/Rs ([\d,]+) per sq ft/);
  if (!priceMatch || !rateMatch) throw new Error(`Missing approved price data for ${copy.size}`);

  return {
    sizeSlug: copy.size,
    label: `${length} x ${width} ft`,
    chipLabel: `${length} x ${width} ft`,
    dims: `${length} x ${width} x 8.5 ft`,
    areaSqft: area,
    priceExGst: parseIndianNumber(priceMatch[1]),
    priceInclGst: parseIndianNumber(priceMatch[2]),
    images: pack.gallery[copy.size].map((image) => ({
      src: outputFor(image.file),
      alt: image.alt,
      provenance: 'render',
      width: image.width,
      height: image.height,
    })),
  };
});

const product = {
  productSlug: pack.canonical.split('/').at(-1),
  productName: 'Flat-Pack Container Office',
  variantAxis: 'size',
  defaultVariant: pack.variants[0].size,
  gstPercent: 18,
  categoryLabel: 'Container Offices',
  categoryHref: '/product/container-offices',
  canonical: pack.canonical,
  openGraphImage: variants[0].images[0].src,
  applicationsDataset: 'flat-pack-container-office',
  emitSizeAnchors: true,
  emitAggregateOffer: true,
  schemaOfferType: 'aggregateOffer',
  schemaItemCondition: 'new',
  schemaImageMode: 'variant-first-images',
  schemaIncludeVariantOffers: true,
  schemaBrandName: 'SAMAN',
  schemaOutputMode: 'productOnly',
  suppressLegacyFaqSchema: true,
  hideTrustRow: true,
  pricePerSqft: Object.fromEntries(pack.variants.map((copy) => {
    const rateLine = copy.bullets.find((line) => /per sq ft/.test(line));
    const rate = rateLine.match(/Rs ([\d,]+) per sq ft/)[1];
    return [copy.size, `Rs ${rate} per sq ft`];
  })),
  variants,
};

writeFileSync(
  resolve(root, 'src/data/products/flat-pack-container-office.json'),
  `${JSON.stringify(product, null, 2)}\n`,
  'utf8',
);

const catalogTemplate = JSON.parse(
  readFileSync(resolve(root, 'src/data/wp-export/products/site-office-container.json'), 'utf8'),
);
const catalogRecord = {
  ...catalogTemplate,
  id: 9707,
  name: 'Flat-Pack Container Office',
  slug: product.productSlug,
  permalink: pack.canonical,
  description: '',
  short_description: '',
  sku: '',
  price: '',
  regular_price: '',
  sale_price: '',
  price_html: '',
  purchasable: false,
  on_sale: false,
  reviews_allowed: true,
  average_rating: '0.00',
  rating_count: 0,
  total_sales: 0,
  categories: [{ id: 0, name: 'Container Offices', slug: 'container-offices' }],
  tags: [],
  images: variants.flatMap((variant, variantIndex) => variant.images.map((image, imageIndex) => ({
    id: 970700 + variantIndex * 10 + imageIndex,
    src: image.src,
    alt: image.alt,
    name: image.alt,
  }))),
  attributes: [],
  related_ids: [],
  meta_data: [],
  _links: {},
  _rank_math_head: {
    success: true,
    head: `<title>${pack.seo_title}</title>\n<meta name="description" content="${pack.meta_description}"/>\n<meta name="robots" content="index, follow"/>\n<link rel="canonical" href="${pack.canonical}" />`,
  },
};

writeFileSync(
  resolve(root, 'src/data/wp-export/products/flat-pack-container-office.json'),
  `${JSON.stringify(catalogRecord, null, 2)}\n`,
  'utf8',
);

console.log(`Wrote ${product.productSlug}: ${variants.length} variants, ${variants.flatMap((v) => v.images).length} gallery images.`);
