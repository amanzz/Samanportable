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
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';
  condition: 'new';
  brand: typeof MERCHANT_BRAND_PORTABLE | typeof MERCHANT_BRAND_PREFAB;
  mpn?: string;
  identifier_exists: 'no';
  product_type: string;
  google_product_category: string;
  shipping_label: string;
  shipping_weight: string;
  shipping_length: string;
  shipping_width: string;
  shipping_height: string;
  adult: 'no';
  is_bundle: 'no';
  custom_label_0: string;
  custom_label_1: string;
  custom_label_2: string;
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

const CATEGORY_DEFAULTS: Record<
  string,
  { lengthCm: number; widthCm: number; heightCm: number; weightKg: number; shippingLabel: string }
> = {
  'container-cafe': { lengthCm: 610, widthCm: 305, heightCm: 290, weightKg: 3500, shippingLabel: 'freight-container-cafe' },
  'container-houses': { lengthCm: 1220, widthCm: 366, heightCm: 320, weightKg: 9000, shippingLabel: 'freight-container-house' },
  'container-offices': { lengthCm: 610, widthCm: 305, heightCm: 290, weightKg: 3000, shippingLabel: 'freight-container-office' },
  'industrial-sheds': { lengthCm: 1200, widthCm: 600, heightCm: 450, weightKg: 10000, shippingLabel: 'freight-prefab-building' },
  'labor-colony': { lengthCm: 1220, widthCm: 305, heightCm: 320, weightKg: 8000, shippingLabel: 'freight-labour-housing' },
  'peb-constructions': { lengthCm: 1800, widthCm: 900, heightCm: 600, weightKg: 12000, shippingLabel: 'freight-peb-structure' },
  'porta-cabins': { lengthCm: 610, widthCm: 305, heightCm: 290, weightKg: 3000, shippingLabel: 'freight-porta-cabin' },
  'portable-cabin': { lengthCm: 610, widthCm: 305, heightCm: 290, weightKg: 2800, shippingLabel: 'freight-portable-cabin' },
  'portable-office': { lengthCm: 610, widthCm: 305, heightCm: 290, weightKg: 3000, shippingLabel: 'freight-portable-office' },
  'portable-toilet': { lengthCm: 240, widthCm: 180, heightCm: 240, weightKg: 600, shippingLabel: 'freight-compact-unit' },
  'pre-engineered-buildings': { lengthCm: 1800, widthCm: 900, heightCm: 600, weightKg: 12000, shippingLabel: 'freight-peb-building' },
  'prefab-buildings': { lengthCm: 610, widthCm: 457, heightCm: 290, weightKg: 4500, shippingLabel: 'freight-prefab-building' },
  'prefabricated-houses': { lengthCm: 1220, widthCm: 366, heightCm: 320, weightKg: 8500, shippingLabel: 'freight-prefab-house' },
  'security-cabins': { lengthCm: 240, widthCm: 240, heightCm: 240, weightKg: 700, shippingLabel: 'freight-compact-cabin' },
};

const FALLBACK_DEFAULT = {
  lengthCm: 610,
  widthCm: 305,
  heightCm: 290,
  weightKg: 3000,
  shippingLabel: 'freight-portable-structure',
};

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
  const salePrice = parseNumber(product.sale_price);
  if (product.on_sale && salePrice > 0) return salePrice;

  const price = parseNumber(product.price);
  if (price > 0) return price;

  return parseNumber(product.regular_price);
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

function getDimensionDefaults(product: ProductLike) {
  return CATEGORY_DEFAULTS[getPrimaryCategorySlug(product)] || FALLBACK_DEFAULT;
}

function convertToCm(value: number, unit: string): number {
  const normalized = unit.toLowerCase();
  if (normalized === 'ft' || normalized === 'feet') return value * 30.48;
  if (normalized === 'm' || normalized === 'meter' || normalized === 'metre') return value * 100;
  return value;
}

function extractDimensionsFromText(product: ProductLike): { lengthCm?: number; widthCm?: number; heightCm?: number } {
  const text = [
    product.name,
    stripHtml(product.short_description),
    stripHtml(product.description),
  ].join(' ');

  const pattern = /(\d+(?:\.\d+)?)\s*(?:x|\u00d7)\s*(\d+(?:\.\d+)?)(?:\s*(?:x|\u00d7)\s*(\d+(?:\.\d+)?))?\s*(ft|feet|m|meter|metre|cm)\b/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const unit = match[4];
    const length = parseFloat(match[1]);
    const width = parseFloat(match[2]);
    const height = match[3] ? parseFloat(match[3]) : 0;
    if (!isPlausibleDimension(length, width, height, unit)) continue;
    return {
      lengthCm: convertToCm(length, unit),
      widthCm: convertToCm(width, unit),
      ...(height ? { heightCm: convertToCm(height, unit) } : {}),
    };
  }
  return {};
}

function isPlausibleDimension(length: number, width: number, height: number, unit: string): boolean {
  if (!Number.isFinite(length) || !Number.isFinite(width) || length <= 0 || width <= 0) return false;
  const normalized = unit.toLowerCase();
  if (normalized === 'ft' || normalized === 'feet') {
    return length >= 4 && length <= 220 && width >= 3 && width <= 120 && (!height || (height >= 5 && height <= 80));
  }
  if (normalized === 'm' || normalized === 'meter' || normalized === 'metre') {
    return length >= 1 && length <= 70 && width >= 1 && width <= 40 && (!height || (height >= 1.5 && height <= 25));
  }
  return length >= 100 && length <= 7000 && width >= 100 && width <= 4000 && (!height || (height >= 150 && height <= 2500));
}

export function getShippingAttributes(product: ProductLike) {
  const defaults = getDimensionDefaults(product);
  const extracted = extractDimensionsFromText(product);
  const directDimensions = {
    lengthCm: parseNumber(product.dimensions?.length) || undefined,
    widthCm: parseNumber(product.dimensions?.width) || undefined,
    heightCm: parseNumber(product.dimensions?.height) || undefined,
  };

  const lengthCm = directDimensions.lengthCm || extracted.lengthCm || defaults.lengthCm;
  const widthCm = directDimensions.widthCm || extracted.widthCm || defaults.widthCm;
  const heightCm = directDimensions.heightCm || extracted.heightCm || defaults.heightCm;
  const weightKg = parseNumber(product.weight) || defaults.weightKg;

  return {
    shipping_label: defaults.shippingLabel,
    shipping_weight: `${Math.max(1, Math.round(weightKg))} kg`,
    shipping_length: `${Math.max(1, Math.round(lengthCm))} cm`,
    shipping_width: `${Math.max(1, Math.round(widthCm))} cm`,
    shipping_height: `${Math.max(1, Math.round(heightCm))} cm`,
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
        getEffectiveProductPrice(product) <= 0
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

export function generateGoogleMerchantXml(products: ProductLike[], baseUrl = MERCHANT_BASE_URL): string {
  const { items } = buildMerchantProducts(products, baseUrl);
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
    xml += xmlElement('g:shipping_weight', item.shipping_weight);
    xml += xmlElement('g:shipping_length', item.shipping_length);
    xml += xmlElement('g:shipping_width', item.shipping_width);
    xml += xmlElement('g:shipping_height', item.shipping_height);
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
