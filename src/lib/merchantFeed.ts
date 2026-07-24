export const MERCHANT_BASE_URL = 'https://www.samanportable.com';
export const MERCHANT_BRAND_PORTABLE = 'SAMAN Portable';
export const MERCHANT_BRAND_PREFAB = 'SAMAN Prefab';
export const GOOGLE_PRODUCT_CATEGORY_ID = '720';
export const GOOGLE_PRODUCT_CATEGORY_NAME =
  'Home & Garden > Lawn & Garden > Outdoor Living > Outdoor Structures > Sheds, Garages & Carports';

type ProductLike = {
  id?: number | string;
  name?: string;
  slug?: string;
  sku?: string;
  price?: string | number | null;
  regular_price?: string | number | null;
  sale_price?: string | number | null;
  priceDisplay?: string | null;
  priceSubline?: string | null;
  on_sale?: boolean;
  stock_status?: string;
  short_description?: string;
  description?: string;
  images?: Array<{
    src?: string;
    alt?: string;
    name?: string;
    width?: number | string;
    height?: number | string;
  }>;
  categories?: Array<{
    id?: number | string;
    name?: string;
    slug?: string;
  }>;
  category_slug?: string;
  category_name?: string;
  weight?: string | number | null;
  dimensions?: {
    length?: string | number | null;
    width?: string | number | null;
    height?: string | number | null;
  };
};

export type MerchantImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type MerchantProduct = {
  id: string;
  sku: string;
  title: string;
  description: string;
  link: string;
  mobile_link: string;
  image_link: string;
  additional_image_link: string[];
  price: string;
  priceValue: number;
  // 'in stock' (with a space) is the value the porta-cabin variant group emits
  // per PACKET-C §3; the 168 catalogue items keep the underscore form.
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder' | 'in stock';
  condition: 'new';
  brand: typeof MERCHANT_BRAND_PORTABLE | typeof MERCHANT_BRAND_PREFAB;
  mpn?: string;
  // 'false' is the value the porta-cabin variant group emits per PACKET-C §3
  // (no GTIN/MPN); the 168 catalogue items keep 'no'.
  identifier_exists: 'no' | 'false';
  product_type: string;
  google_product_category: string;
  shipping_label: string;
  adult: 'no';
  is_bundle: 'no';
  custom_label_0: string;
  custom_label_1: string;
  custom_label_2: string;
  // Present only on variant-group items (porta cabins); groups variants in Merchant.
  item_group_id?: string;
};

export type SkippedMerchantProduct = {
  id: string;
  sku: string;
  title: string;
  slug: string;
  reason: string;
};

const PREFAB_BRAND_CATEGORIES = new Set([
  'industrial-sheds',
  'peb-constructions',
  'pre-engineered-buildings',
  'prefab-buildings',
  'prefabricated-houses',
]);

const PANEL_CATEGORY_SLUGS = new Set([
  'eps-panel',
  'pir-panel',
  'puf-panel',
  'rockwool-panel',
  'sandwich-panel',
]);

const COMPACT_UNIT_CATEGORY_SLUGS = new Set([
  'portable-toilet',
  'security-cabins',
]);

export function decodeHtmlEntities(value: string): string {
  if (!value) return '';
  const named: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    ndash: '-',
    mdash: '-',
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
  };

  return value.replace(/&(#(?:x[a-f0-9]+|\d+)|[a-z]+);/gi, (match, entity) => {
    const key = String(entity).toLowerCase();
    if (key.startsWith('#x')) {
      const code = parseInt(key.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (key.startsWith('#')) {
      const code = parseInt(key.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return named[key] || match;
  });
}

export function stripHtml(value: string | undefined | null): string {
  return decodeHtmlEntities(String(value || ''))
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
}

export function cleanText(value: string | undefined | null, maxLength?: number): string {
  const cleaned = stripHtml(String(value || ''))
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return maxLength && cleaned.length > maxLength ? cleaned.slice(0, maxLength - 1).trim() : cleaned;
}

export function escapeXml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
}

function toCdata(value: string): string {
  return `<![CDATA[${String(value).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

function parseNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const normalized = String(value || '').replace(/,/g, '').trim();
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getEffectiveProductPrice(product: ProductLike): number {
  // C01b (SAMAN ruling, 24 Jul 2026): every feed carries the actual current SELLING price
  // only — never a sale / compare-at / "was ₹X" reference. product.price is WooCommerce's
  // active price, which already equals the current selling price (sale_price when a product
  // was flagged on sale, so this is byte-identical to the prior sale branch). regular_price
  // is used only as a fallback when price is absent. sale_price and on_sale are deliberately
  // NOT consulted, so no fake strike-through reference can ever leak into feed output.
  const price = parseNumber(product.price);
  if (price > 0) return price;

  return parseNumber(product.regular_price);
}

export function hasMerchantUnsafePrice(product: ProductLike): boolean {
  const visiblePriceText = [
    product.priceDisplay,
    product.priceSubline,
  ]
    .filter(Boolean)
    .join(' ');

  return /\bex\s*-?\s*gst\b/i.test(visiblePriceText);
}

export function formatMerchantPrice(value: number): string {
  return `${value.toFixed(2)} INR`;
}

export function getPrimaryCategorySlug(product: ProductLike): string {
  return (
    product.category_slug ||
    product.categories?.[0]?.slug ||
    'uncategorized'
  );
}

export function getPrimaryCategoryName(product: ProductLike): string {
  return cleanText(
    product.category_name ||
      product.categories?.[0]?.name ||
      'Portable Structures',
    120
  );
}

export function getProductBrand(product: ProductLike): typeof MERCHANT_BRAND_PORTABLE | typeof MERCHANT_BRAND_PREFAB {
  return PREFAB_BRAND_CATEGORIES.has(getPrimaryCategorySlug(product)) ? MERCHANT_BRAND_PREFAB : MERCHANT_BRAND_PORTABLE;
}

export function getProductSku(product: ProductLike): string {
  return cleanText(product.sku || '', 50);
}

export function buildProductUrl(product: ProductLike, preferredCategory?: string, baseUrl = MERCHANT_BASE_URL): string {
  const categorySlug = cleanText(preferredCategory || getPrimaryCategorySlug(product), 100).toLowerCase();
  const slug = cleanText(product.slug || `product-${product.id || ''}`, 160).toLowerCase();
  const path = slug && slug === categorySlug ? `/product/${slug}` : `/product/${categorySlug || 'uncategorized'}/${slug}`;
  return `${baseUrl}${path}`;
}

export function getMerchantAvailability(stockStatus: string | undefined): MerchantProduct['availability'] {
  switch (String(stockStatus || '').toLowerCase()) {
    case 'outofstock':
    case 'out_of_stock':
      return 'out_of_stock';
    case 'onbackorder':
    case 'backorder':
      return 'backorder';
    case 'preorder':
      return 'preorder';
    default:
      return 'in_stock';
  }
}

function inferImageDimensionsFromUrl(url: string): { width?: number; height?: number } {
  const match = url.match(/(?:^|[-_])(\d{3,5})x(\d{3,5})(?:[-_.]|$)/i);
  if (!match) return {};
  return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
}

function absoluteUrl(value: string | undefined, baseUrl = MERCHANT_BASE_URL): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('/')) return `${baseUrl}${raw}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  return '';
}

function getHtmlAttribute(tag: string, attribute: string): string {
  const pattern = new RegExp(`${attribute}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
  const match = tag.match(pattern);
  return match?.[2] || match?.[3] || '';
}

export function selectProductImages(product: ProductLike, baseUrl = MERCHANT_BASE_URL): MerchantImage[] {
  const candidates: Array<MerchantImage & { score: number; index: number }> = [];
  let index = 0;

  for (const image of product.images || []) {
    const url = absoluteUrl(image.src, baseUrl);
    if (!url) continue;
    const inferred = inferImageDimensionsFromUrl(url);
    const width = parseNumber(image.width) || inferred.width;
    const height = parseNumber(image.height) || inferred.height;
    candidates.push({
      url,
      width,
      height,
      alt: cleanText(image.alt || image.name || product.name || '', 180),
      score: scoreImage(url, width, height, true),
      index: index++,
    });
  }

  const description = String(product.description || '');
  const imageTags = description.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imageTags) {
    const url = absoluteUrl(getHtmlAttribute(tag, 'src'), baseUrl);
    if (!url) continue;
    const inferred = inferImageDimensionsFromUrl(url);
    const width = parseNumber(getHtmlAttribute(tag, 'width')) || inferred.width;
    const height = parseNumber(getHtmlAttribute(tag, 'height')) || inferred.height;
    candidates.push({
      url,
      width,
      height,
      alt: cleanText(getHtmlAttribute(tag, 'alt') || product.name || '', 180),
      score: scoreImage(url, width, height, false),
      index: index++,
    });
  }

  const seen = new Set<string>();
  return candidates
    .filter((image) => {
      if (seen.has(image.url)) return false;
      seen.add(image.url);
      return !/placeholder|logo/i.test(image.url);
    })
    .sort((a, b) => (b.score === a.score ? a.index - b.index : b.score - a.score))
    .map(({ score: _score, index: _index, ...image }) => image);
}

function scoreImage(url: string, width?: number, height?: number, galleryImage = false): number {
  let score = galleryImage ? 200000 : 0;
  const area = width && height ? width * height : 650000;
  score += area;
  if (width && height && width >= 800 && height >= 600) score += 5000000;
  else if (width && height && width >= 500 && height >= 500) score += 1500000;
  if (/600x600/i.test(url)) score -= 250000;
  if (/placeholder|logo/i.test(url)) score -= 10000000;
  return score;
}

export function getShippingAttributes(product: ProductLike) {
  const categorySlug = getPrimaryCategorySlug(product);
  const title = cleanText(product.name, 160).toLowerCase();
  const isPanel =
    PANEL_CATEGORY_SLUGS.has(categorySlug) ||
    /\b(?:eps|pir|puf|rockwool|sandwich)\s+panel\b/i.test(title);

  const isCompactUnit =
    COMPACT_UNIT_CATEGORY_SLUGS.has(categorySlug) ||
    /\b(?:portable\s+toilet|security\s+cabin|frp\s+security)\b/i.test(title);

  return {
    shipping_label: isPanel
      ? 'freight_panels_quote_required'
      : isCompactUnit
        ? 'freight_compact_unit'
        : 'freight_quote_required',
  };
}

function buildDescription(product: ProductLike, brand: string): string {
  const full = cleanText(product.description, 5000);
  const short = cleanText(product.short_description, 1000);
  let description = full.length >= 180 ? full : [short, full].filter(Boolean).join(' ');

  if (description.length < 120) {
    const category = getPrimaryCategoryName(product).toLowerCase();
    description = `${cleanText(product.name, 150)} by ${brand}. Factory-built ${category} for commercial, industrial, project-site and infrastructure use, with custom layout, electrical fitout, durable structure, delivery and installation support across India.`;
  }

  return cleanText(description, 5000);
}

export function buildMerchantProduct(product: ProductLike, baseUrl = MERCHANT_BASE_URL): MerchantProduct | null {
  const id = cleanText(String(product.id || ''), 50);
  const sku = getProductSku(product);
  const title = cleanText(product.name, 150);
  const slug = cleanText(product.slug, 160);
  const priceValue = getEffectiveProductPrice(product);

  if (!id || !title || !slug) return null;
  if (hasMerchantUnsafePrice(product)) return null;
  if (!priceValue || priceValue <= 0) return null;

  const images = selectProductImages(product, baseUrl);
  if (!images.length) return null;

  const brand = getProductBrand(product);
  const categoryName = getPrimaryCategoryName(product);
  const shipping = getShippingAttributes(product);

  return {
    id,
    sku,
    title,
    description: buildDescription(product, brand),
    link: buildProductUrl(product, undefined, baseUrl),
    mobile_link: buildProductUrl(product, undefined, baseUrl),
    image_link: images[0].url,
    additional_image_link: images.slice(1, 11).map((image) => image.url),
    price: formatMerchantPrice(priceValue),
    priceValue,
    availability: getMerchantAvailability(product.stock_status),
    condition: 'new',
    brand,
    ...(sku ? { mpn: sku } : {}),
    identifier_exists: 'no',
    product_type: `${brand} > ${categoryName}`,
    google_product_category: GOOGLE_PRODUCT_CATEGORY_ID,
    ...shipping,
    adult: 'no',
    is_bundle: 'no',
    custom_label_0: categoryName,
    custom_label_1: brand,
    custom_label_2: shipping.shipping_label,
  };
}

// ─── Porta-cabin variant group (PACKET-C) ─────────────────────────────────────
// The nine standard porta-cabin sizes are emitted as ONE Merchant variant group
// (shared g:item_group_id). Every value is transplanted from the single source of
// truth src/data/products/porta-cabins.json (sizes, incl-GST prices, images,
// Section-E copy) plus the fixed title/description copy specified verbatim in
// PACKET-C §1–§3. The literal U+00D7 (multiplication sign), U+2013 (en dash) and
// U+2014 (em dash) constants below emit those exact bytes, verified byte-for-byte
// against the PACKET-C source.
const PC_TIMES = '×'; // U+00D7 multiplication sign
const PC_NDASH = '–'; // U+2013 en dash
const PC_MDASH = '—'; // U+2014 em dash

const PORTA_CABIN_VARIANT_DESCRIPTORS: Record<string, string> = {
  '10x10': 'Guard Room & Gate Office',
  '20x8': 'Narrow-Plot Site Office',
  '20x10': 'Standard Site Office',
  '20x12': 'Office with Manager Area',
  '30x10': 'Office + Meeting Room',
  '40x8': 'Linear Office & Bunkhouse',
  '20x20': 'Open-Floor Twin Module',
  '40x10': 'Large Site Office',
  '40x12': 'Multi-Room Office Complex',
};

type PortaCabinVariant = {
  sizeSlug?: string;
  label?: string;
  areaSqft?: number;
  priceInclGst?: number;
  shortDescription?: string;
  sku?: string;
  images?: Array<{ src?: string; alt?: string; width?: number | string; height?: number | string }>;
};

export type PortaCabinVariantData = {
  variants?: PortaCabinVariant[];
};

function portaCabinVariantTitle(v: PortaCabinVariant): string {
  const [length, width] = String(v.sizeSlug).split('x');
  const descriptor = PORTA_CABIN_VARIANT_DESCRIPTORS[String(v.sizeSlug)] || '';
  return `Porta Cabin ${length}${PC_TIMES}${width} ft (${v.areaSqft} sq ft) ${PC_NDASH} ${descriptor} | ${MERCHANT_BRAND_PORTABLE}`;
}

function portaCabinVariantDescription(v: PortaCabinVariant): string {
  const [length, width] = String(v.sizeSlug).split('x');
  const fixedBlock =
    'Factory-built by SAMAN Portable on a welded MS frame with 1.2 mm corrugated steel walls, ' +
    'insulated panels, pre-laminated interior, vinyl flooring and complete electricals. ' +
    `Dimensions ${length}${PC_TIMES}${width}${PC_TIMES}8.5 ft. Delivered and installed across South and North India in ` +
    `7${PC_NDASH}21 working days. Base specification price ${PC_MDASH} customisations quoted separately. ` +
    '5-year structural warranty. GST-registered manufacturer, Bengaluru & Greater Noida. HSN 9406.';
  return `${v.shortDescription} ${fixedBlock}`;
}

// Builds the nine porta-cabin variant feed items. Kept fs-free (pure): the caller
// supplies the parsed JSON so this module never touches the filesystem.
export function buildPortaCabinVariantItems(
  data: PortaCabinVariantData | null | undefined,
  baseUrl = MERCHANT_BASE_URL
): MerchantProduct[] {
  const variants = data?.variants || [];
  const items: MerchantProduct[] = [];

  for (const v of variants) {
    const sizeSlug = String(v?.sizeSlug || '');
    if (!sizeSlug || !PORTA_CABIN_VARIANT_DESCRIPTORS[sizeSlug]) continue;
    if (!v.priceInclGst || v.priceInclGst <= 0) continue;

    const images = (v.images || []).map((img) => absoluteUrl(img?.src, baseUrl)).filter(Boolean);
    if (!images.length) continue;

    const link = `${baseUrl}/product/porta-cabins#size-${sizeSlug}`;
    const shipping = getShippingAttributes({ name: v.label, category_slug: 'porta-cabins' });

    items.push({
      id: `porta-cabin-${sizeSlug}`,
      item_group_id: 'porta-cabins',
      sku: v.sku || '',
      title: portaCabinVariantTitle(v),
      description: portaCabinVariantDescription(v),
      link,
      mobile_link: link,
      image_link: images[0],
      additional_image_link: images.slice(1, 11),
      price: formatMerchantPrice(v.priceInclGst),
      priceValue: v.priceInclGst,
      availability: 'in stock',
      condition: 'new',
      brand: MERCHANT_BRAND_PORTABLE,
      identifier_exists: 'false',
      product_type: `Porta Cabins > Standard Porta Cabin > ${v.label}`,
      google_product_category: '720',
      ...shipping,
      adult: 'no',
      is_bundle: 'no',
      custom_label_0: 'Porta Cabins',
      custom_label_1: MERCHANT_BRAND_PORTABLE,
      custom_label_2: shipping.shipping_label,
    });
  }

  return items;
}

// ─── T26 · variant groups for the 11 porta-cabin SUBPAGES ─────────────────────
// Same nine-size variant-group shape as the flagship above, generalised across the
// T25 subpages. The flagship builder is deliberately left untouched so its nine
// existing feed items cannot move.
//
// Per slug: the product NAME and the single DESCRIPTOR come from that pack's §G
// title format, transcribed verbatim —
//   "{name} {W}×{L} ft ({area} sq ft) – {descriptor} | SAMAN Portable"
// (U+00D7 × and U+2013 – exactly as the packs print them). low-cost-porta-cabin has
// no §G block in the T24.2 pack; its title is the SAMAN ruling of 19 Jul 2026.
export type SubpageVariantConfig = { slug: string; name: string; descriptor: string };

// C01 consolidation (Fable 5 ruling, 24 Jul 2026): the four slugs buy-porta-cabins,
// prefabricated-porta-cabin, porta-cabin-office and small-portacabin now 301 to their
// keepers, so their variant groups are DROPPED from the feed (their 36 SKUs leave the
// feed entirely — no hub-landing replacement). portacabin-office gets no feed entry here;
// that follows later via the standard merchant flag-flip (separate ticket). Seven
// surviving subpage groups remain.
export const SUBPAGE_VARIANT_CONFIGS: readonly SubpageVariantConfig[] = [
  { slug: 'ms-porta-cabin', name: 'MS Porta Cabin', descriptor: 'IS 2062 Steel Site Office' },
  { slug: 'steel-porta-cabin', name: 'Steel Porta Cabin', descriptor: 'MS/GI/Pre-Galv Site Office' },
  { slug: 'luxury-porta-cabin', name: 'Luxury Porta Cabin', descriptor: 'Premium Executive Cabin' },
  { slug: 'mini-porta-cabin', name: 'Mini Porta Cabin', descriptor: 'Compact Guard/Gate Cabin' },
  { slug: 'porta-cabin-shop', name: 'Porta Cabin Shop', descriptor: 'Retail Counter Cabin' },
  { slug: 'porta-cabin-with-toilet', name: 'Porta Cabin with Toilet', descriptor: 'Office + Sanitation' },
  { slug: 'low-cost-porta-cabin', name: 'Low Cost Porta Cabin', descriptor: 'Value-Tier Site Cabin' },
];

/**
 * Builds one subpage's nine variant items.
 *
 * `description` is that size's approved §C short description verbatim. The flagship's
 * fixed spec block is deliberately NOT reused: it states "1.2 mm corrugated steel
 * walls", which is untrue of the low-cost tier (0.8–1.0 mm per the T24.2 ruling), so
 * copying it across would put a wrong specification in the feed.
 */
export function buildSubpageVariantItems(
  config: SubpageVariantConfig,
  data: PortaCabinVariantData | null | undefined,
  baseUrl = MERCHANT_BASE_URL
): MerchantProduct[] {
  const variants = data?.variants || [];
  const items: MerchantProduct[] = [];

  for (const v of variants) {
    const sizeSlug = String(v?.sizeSlug || '');
    if (!sizeSlug || !/^\d+x\d+$/.test(sizeSlug)) continue;
    if (!v.priceInclGst || v.priceInclGst <= 0) continue;

    const images = (v.images || []).map((img) => absoluteUrl(img?.src, baseUrl)).filter(Boolean);
    if (!images.length) continue;

    const [length, width] = sizeSlug.split('x');
    const link = `${baseUrl}/product/porta-cabins/${config.slug}#size-${sizeSlug}`;
    const shipping = getShippingAttributes({ name: v.label, category_slug: 'porta-cabins' });

    items.push({
      id: `${config.slug}-${sizeSlug}`,
      item_group_id: config.slug,
      sku: v.sku || '',
      title: `${config.name} ${length}${PC_TIMES}${width} ft (${v.areaSqft} sq ft) ${PC_NDASH} ${config.descriptor} | ${MERCHANT_BRAND_PORTABLE}`,
      description: String(v.shortDescription || '').trim(),
      link,
      mobile_link: link,
      image_link: images[0],           // hero-view is images[0] by the P7 gallery order
      additional_image_link: images.slice(1, 11),
      price: formatMerchantPrice(v.priceInclGst),
      priceValue: v.priceInclGst,
      availability: 'in stock',
      condition: 'new',
      brand: MERCHANT_BRAND_PORTABLE,
      identifier_exists: 'false',
      product_type: `Porta Cabins > ${config.name} > ${v.label}`,
      google_product_category: '720',
      ...shipping,
      adult: 'no',
      is_bundle: 'no',
      custom_label_0: 'Porta Cabins',
      custom_label_1: MERCHANT_BRAND_PORTABLE,
      custom_label_2: shipping.shipping_label,
    });
  }

  return items;
}

/**
 * Every porta-cabin variant item: the flagship's nine (unchanged, from the original
 * builder) followed by the seven surviving subpages' nine each. `dataBySlug` is supplied by the
 * caller so this module stays filesystem-free.
 */
export function buildAllVariantItems(
  flagshipData: PortaCabinVariantData | null | undefined,
  dataBySlug: Record<string, PortaCabinVariantData | null | undefined>,
  baseUrl = MERCHANT_BASE_URL
): MerchantProduct[] {
  const items = buildPortaCabinVariantItems(flagshipData, baseUrl);
  for (const config of SUBPAGE_VARIANT_CONFIGS) {
    items.push(...buildSubpageVariantItems(config, dataBySlug[config.slug], baseUrl));
  }
  return items;
}

export function buildMerchantProducts(products: ProductLike[], baseUrl = MERCHANT_BASE_URL) {
  const items: MerchantProduct[] = [];
  const skipped: SkippedMerchantProduct[] = [];

  for (const product of products) {
    const item = buildMerchantProduct(product, baseUrl);
    if (item) {
      items.push(item);
      continue;
    }

    skipped.push({
      id: cleanText(String(product.id || ''), 50),
      sku: getProductSku(product),
      title: cleanText(product.name, 150),
      slug: cleanText(product.slug, 160),
      reason:
        hasMerchantUnsafePrice(product)
          ? 'tax_exclusive_price_not_merchant_safe'
          : getEffectiveProductPrice(product) <= 0
          ? 'missing_visible_price'
          : selectProductImages(product, baseUrl).length === 0
            ? 'missing_valid_image'
            : 'missing_required_identity_fields',
    });
  }

  return { items, skipped };
}

function xmlElement(name: string, value: string | number, cdata = false): string {
  return `      <${name}>${cdata ? toCdata(String(value)) : escapeXml(value)}</${name}>\n`;
}

/** Reduce a feed link to its comparable pathname: strip origin, query and fragment,
 *  drop a trailing slash. Mirrors redirectSources.normalizeRedirectPath so the merchant
 *  feed and the sitemap judge a URL "redirecting" by the identical rule. */
function feedLinkPathname(link: string): string {
  if (typeof link !== 'string' || !link) return '';
  let p = link;
  const hash = p.indexOf('#');
  if (hash !== -1) p = p.slice(0, hash);
  const q = p.indexOf('?');
  if (q !== -1) p = p.slice(0, q);
  const scheme = p.indexOf('://');
  if (scheme !== -1) {
    const rest = p.slice(scheme + 3);
    const slash = rest.indexOf('/');
    p = slash === -1 ? '/' : rest.slice(slash);
  }
  if (!p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

/** WooCommerce category-placeholder products: /product/{a}/{a} where a === a. */
function isDuplicateProductSegmentPath(pathname: string): boolean {
  const m = /^\/product\/([^/]+)\/([^/]+)$/.exec(pathname);
  return !!m && m[1] === m[2];
}

export function generateGoogleMerchantXml(
  products: ProductLike[],
  baseUrl = MERCHANT_BASE_URL,
  extraItems: MerchantProduct[] = [],
  // C01 hardening (Fable 5 ruling, 24 Jul 2026): when the caller supplies the redirect
  // source set (from getRedirectSourceSet()), every item whose landing URL the site
  // 301-redirects is structurally dropped — the same filter the sitemap applies. Omitted
  // ⇒ no filtering, so all other output stays byte-identical.
  redirectSources?: Set<string>
): string {
  const { items: catalogueItems } = buildMerchantProducts(products, baseUrl);
  // Catalogue items first (byte-unchanged), then any pre-built variant items.
  let items = [...catalogueItems, ...extraItems];
  if (redirectSources && redirectSources.size) {
    items = items.filter((item) => {
      const pathname = feedLinkPathname(item.link);
      if (!pathname) return true;
      return !redirectSources.has(pathname) && !isDuplicateProductSegmentPath(pathname);
    });
  }
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
  xml += '  <channel>\n';
  xml += '    <title>SAMAN Portable Product Feed</title>\n';
  xml += `    <link>${escapeXml(baseUrl)}</link>\n`;
  xml += '    <description>Portable cabins, container offices, prefab buildings and modular structures from SAMAN.</description>\n';
  xml += '    <language>en-IN</language>\n';
  xml += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;

  for (const item of items) {
    xml += '    <item>\n';
    xml += xmlElement('g:id', item.id);
    if (item.item_group_id) xml += xmlElement('g:item_group_id', item.item_group_id);
    xml += xmlElement('g:title', item.title, true);
    xml += xmlElement('g:description', item.description, true);
    xml += xmlElement('g:link', item.link);
    xml += xmlElement('g:mobile_link', item.mobile_link);
    xml += xmlElement('g:image_link', item.image_link);
    for (const image of item.additional_image_link) {
      xml += xmlElement('g:additional_image_link', image);
    }
    xml += xmlElement('g:price', item.price);
    xml += xmlElement('g:availability', item.availability);
    xml += xmlElement('g:condition', item.condition);
    xml += xmlElement('g:brand', item.brand);
    if (item.mpn) xml += xmlElement('g:mpn', item.mpn);
    xml += xmlElement('g:identifier_exists', item.identifier_exists);
    xml += xmlElement('g:product_type', item.product_type, true);
    xml += xmlElement('g:google_product_category', item.google_product_category);
    xml += xmlElement('g:shipping_label', item.shipping_label);
    xml += xmlElement('g:adult', item.adult);
    xml += xmlElement('g:is_bundle', item.is_bundle);
    xml += xmlElement('g:custom_label_0', item.custom_label_0, true);
    xml += xmlElement('g:custom_label_1', item.custom_label_1);
    xml += xmlElement('g:custom_label_2', item.custom_label_2);
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>\n';
  return xml;
}
