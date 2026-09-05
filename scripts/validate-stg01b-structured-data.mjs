import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const baseUrl = (
  process.argv.find((value) => value.startsWith('--base-url='))?.slice('--base-url='.length)
  || process.env.STG01B_BASE_URL
  || 'http://127.0.0.1:3210'
).replace(/\/$/, '');
const siteOrigin = 'https://www.samanportable.com';
const checkpoint = '82494c30d23709eba4a808a6bd1fda8af287ba55';
const failures = [];

const productPages = [
  { path: '/product/labor-colony/labor-sheds', name: 'Labour Sheds', offers: false },
  { path: '/product/labor-colony/prefab-site-canteen', name: 'Prefab Site Canteen', offers: true },
  { path: '/product/rockwool-panel', name: 'Rockwool Panel', offers: true },
  { path: '/product/security-cabins/frp-security-cabin', name: 'FRP Security Cabin', offers: false },
];

const breadcrumbPages = [
  { path: '/product/container-offices/site-office-container', name: 'Site Office Container' },
  { path: '/product/container-offices/flat-pack-container-office', name: 'Flat-Pack Container Office' },
  { path: '/product/container-offices/multi-story-container-office', name: 'Multi-Story Container Office' },
];

const affectedPages = [...productPages, ...breadcrumbPages];
const expectedBreadcrumb = (page) => [
  { position: 1, name: 'Home', item: `${siteOrigin}/` },
  { position: 2, name: 'Container Offices', item: `${siteOrigin}/product/container-offices` },
  { position: 3, name: page.name, item: `${siteOrigin}${page.path}` },
];

function fail(message) {
  failures.push(message);
}

function decodeEntities(value) {
  return String(value || '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripHtml(value) {
  return decodeEntities(String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function attr(tag, name) {
  return decodeEntities(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i').exec(tag || '')?.[1] || '');
}

function canonical(html) {
  const tag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(candidate));
  return attr(tag, 'href');
}

function meta(html, name) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => new RegExp(`\\bname=["']${name}["']`, 'i').test(candidate));
  return attr(tag, 'content');
}

function jsonLdStrings(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => /\btype=["']application\/ld\+json["']/i.test(match[1]))
    .map((match) => match[2].trim());
}

function parseJsonLd(strings, label) {
  const parsed = [];
  strings.forEach((source, index) => {
    try {
      parsed.push(JSON.parse(source));
    } catch (error) {
      fail(`${label} JSON-LD block ${index + 1} failed to parse: ${error.message}`);
    }
  });
  return parsed;
}

function schemaNodes(value, wantedType, output = []) {
  if (!value || typeof value !== 'object') return output;
  const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
  if (types.includes(wantedType)) output.push(value);
  Object.values(value).forEach((nested) => schemaNodes(nested, wantedType, output));
  return output;
}

function hasKey(value, wantedKey) {
  if (!value || typeof value !== 'object') return false;
  if (Object.prototype.hasOwnProperty.call(value, wantedKey)) return true;
  return Object.values(value).some((nested) => hasKey(nested, wantedKey));
}

function h1(html) {
  return stripHtml(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] || '');
}

async function request(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: 'manual',
    headers: { 'user-agent': 'SAMAN-STG-01B-Schema-Validator/1.0' },
  });
  const contentType = response.headers.get('content-type') || '';
  const html = contentType.includes('text/html') ? await response.text() : '';
  if (!html && response.body) await response.body.cancel();
  return {
    pathname,
    status: response.status,
    location: response.headers.get('location'),
    contentType,
    html,
  };
}

async function imageResponse(imageUrl) {
  const parsed = new URL(imageUrl, siteOrigin);
  const target = parsed.origin === siteOrigin ? `${baseUrl}${parsed.pathname}${parsed.search}` : parsed.href;
  const response = await fetch(target, {
    redirect: 'manual',
    headers: { 'user-agent': 'SAMAN-STG-01B-Image-Validator/1.0' },
  });
  const result = {
    status: response.status,
    location: response.headers.get('location'),
    contentType: response.headers.get('content-type') || '',
  };
  if (response.body) await response.body.cancel();
  return result;
}

function assertProtectedSourcesUnchanged() {
  const protectedPaths = [
    'src/data',
    'src/lib/containerOfficeClusterRail.ts',
    'src/lib/unapprovedCommercialGating.ts',
    'src/lib/freight.ts',
  ];
  const changed = execFileSync('git', ['diff', '--name-only', checkpoint, '--', ...protectedPaths], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  if (changed) fail(`protected content/product/rail/gating/freight sources changed: ${changed.replace(/\r?\n/g, ', ')}`);

  const baselineRockwool = execFileSync('git', ['show', `${checkpoint}:src/pages/product/rockwool-panel/index.tsx`], {
    cwd: root,
    encoding: 'utf8',
  });
  const currentRockwool = fs.readFileSync(path.join(root, 'src/pages/product/rockwool-panel/index.tsx'), 'utf8');
  const withoutProductSchema = (source) => source
    .replace(/\r\n/g, '\n')
    .replace(/const PRODUCT_JSONLD = \{[\s\S]*?\n\};\n\nconst BREADCRUMB_JSONLD/, 'const PRODUCT_JSONLD = {SCHEMA_ONLY};\n\nconst BREADCRUMB_JSONLD');
  if (withoutProductSchema(baselineRockwool) !== withoutProductSchema(currentRockwool)) {
    fail('Rockwool page changed outside its Product schema adapter');
  }
}

async function main() {
  const architecture = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/commercialArchitecture.json'), 'utf8'));
  // PO-04 (5 Sep 2026): /product/portable-office/executive-portable-office ships, so it
  // moves from the planned-release backlog into the approved production list. 61/43 -> 62/42.
  // PO-05 (5 Sep 2026): 64/40. Still 62/42 on entry (PO-03 published a 63rd approved
  // path without moving this pin), so this also repairs that pre-existing drift.
  if (architecture.approvedProductionPaths.length !== 64 || architecture.plannedReleasePaths.length !== 40) {
    fail(`architecture is ${architecture.approvedProductionPaths.length}/${architecture.plannedReleasePaths.length}, expected 64/40`);
  }
  assertProtectedSourcesUnchanged();

  const ssr = new Map();
  for (const page of affectedPages) {
    const response = await request(page.path);
    if (response.status !== 200 || response.location) fail(`${page.path} returned ${response.status}${response.location ? ` -> ${response.location}` : ''}`);
    const expectedCanonical = `${siteOrigin}${page.path}`;
    if (canonical(response.html) !== expectedCanonical) fail(`${page.path} canonical is ${canonical(response.html) || 'missing'}`);
    const robots = meta(response.html, 'robots').toLowerCase().replace(/\s+/g, ' ');
    if (!robots.includes('index') || !robots.includes('follow') || robots.includes('noindex')) fail(`${page.path} robots is ${robots || 'missing'}`);
    const strings = jsonLdStrings(response.html);
    const parsed = parseJsonLd(strings, `${page.path} SSR`);
    ssr.set(page.path, { response, strings, parsed });
  }

  for (const pathname of architecture.approvedProductionPaths) {
    let entry = ssr.get(pathname);
    if (!entry) {
      const response = await request(pathname);
      const strings = jsonLdStrings(response.html);
      const parsed = parseJsonLd(strings, `${pathname} approved-page SSR`);
      entry = { response, strings, parsed };
      ssr.set(pathname, entry);
    }
    const products = schemaNodes(entry.parsed, 'Product');
    const breadcrumbs = schemaNodes(entry.parsed, 'BreadcrumbList');
    if (products.length !== 1) fail(`${pathname} has ${products.length} Product entities in approved-page SSR`);
    if (breadcrumbs.length !== 1) fail(`${pathname} has ${breadcrumbs.length} BreadcrumbList entities in approved-page SSR`);
    const expectedCanonical = `${siteOrigin}${pathname}`;
    for (const product of products) {
      if (product.url && product.url !== expectedCanonical) fail(`${pathname} Product url conflicts with canonical: ${product.url}`);
    }
  }

  const checkedImages = new Set();
  for (const page of productPages) {
    const { response, parsed } = ssr.get(page.path);
    const products = schemaNodes(parsed, 'Product');
    if (products.length !== 1) {
      fail(`${page.path} has ${products.length} Product entities in SSR`);
      continue;
    }
    const product = products[0];
    const expectedUrl = `${siteOrigin}${page.path}`;
    if (product.url !== expectedUrl) fail(`${page.path} Product url is ${product.url || 'missing'}`);
    if (product.name !== page.name) fail(`${page.path} Product name is ${JSON.stringify(product.name)}`);
    if (!h1(response.html).toLowerCase().includes(page.name.toLowerCase())) fail(`${page.path} H1 does not agree with ${JSON.stringify(page.name)}`);
    if (!product.description || String(product.description).trim().length < 40) fail(`${page.path} Product description is missing/thin`);
    if (!product.brand && !product.manufacturer) fail(`${page.path} Product has no supported brand/manufacturer`);
    if (hasKey(product, 'aggregateRating') || hasKey(product, 'review') || hasKey(product, 'ratingValue') || hasKey(product, 'reviewCount')) {
      fail(`${page.path} emits unsupported rating/review fields`);
    }
    for (const key of ['priceValidUntil', 'shippingDetails', 'hasMerchantReturnPolicy', 'warranty', 'availability', 'mpn', 'gtin', 'gtin8', 'gtin12', 'gtin13', 'gtin14']) {
      if (hasKey(product, key)) fail(`${page.path} emits unsupported ${key}`);
    }
    const offerCount = schemaNodes(product, 'Offer').length + schemaNodes(product, 'AggregateOffer').length;
    if (!page.offers && offerCount !== 0) fail(`${page.path} emits ${offerCount} unsupported Offer/AggregateOffer nodes`);
    if (page.offers && offerCount < 1) fail(`${page.path} lost its approved visible-price Offer/AggregateOffer`);
    if (page.offers) {
      const offerNodes = [...schemaNodes(product, 'Offer'), ...schemaNodes(product, 'AggregateOffer')];
      if (offerNodes.some((offer) => offer.priceCurrency !== 'INR')) fail(`${page.path} Offer currency is not INR`);
    }
    const images = (Array.isArray(product.image) ? product.image : [product.image]).filter(Boolean);
    if (!images.length) fail(`${page.path} Product has no image`);
    for (const image of images) {
      if (checkedImages.has(image)) continue;
      checkedImages.add(image);
      const result = await imageResponse(image);
      if (result.status !== 200 || result.location || !result.contentType.startsWith('image/')) {
        fail(`${page.path} Product image ${image} returned ${result.status}${result.location ? ` -> ${result.location}` : ''} (${result.contentType || 'no content type'})`);
      }
    }
    const breadcrumbs = schemaNodes(parsed, 'BreadcrumbList');
    if (breadcrumbs.length !== 1) fail(`${page.path} has ${breadcrumbs.length} BreadcrumbList entities in SSR`);
  }

  for (const page of breadcrumbPages) {
    const { parsed } = ssr.get(page.path);
    const products = schemaNodes(parsed, 'Product');
    const breadcrumbs = schemaNodes(parsed, 'BreadcrumbList');
    if (products.length !== 1) fail(`${page.path} has ${products.length} Product entities in SSR`);
    if (breadcrumbs.length !== 1) {
      fail(`${page.path} has ${breadcrumbs.length} BreadcrumbList entities in SSR`);
      continue;
    }
    const actual = (breadcrumbs[0].itemListElement || []).map(({ position, name, item }) => ({ position, name, item }));
    const expected = expectedBreadcrumb(page);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`${page.path} breadcrumb is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    for (const crumb of expected) {
      const pathname = new URL(crumb.item).pathname;
      const result = await request(pathname);
      if (result.status !== 200 || result.location) fail(`${page.path} breadcrumb target ${pathname} returned ${result.status}${result.location ? ` -> ${result.location}` : ''}`);
    }
  }

  if (failures.length) {
    console.error('STG-01B structured-data validation failed:');
    failures.forEach((message) => console.error(`- ${message}`));
    process.exit(1);
  }

  console.log('STG-01B structured-data validation passed.');
  console.log(JSON.stringify({
    productPages: productPages.map((page) => page.path),
    breadcrumbPages: breadcrumbPages.map((page) => page.path),
    affectedPages: affectedPages.length,
    approvedPagesChecked: architecture.approvedProductionPaths.length,
    productImagesChecked: checkedImages.size,
    ssrJsonLdParseErrors: 0,
    duplicateProductEntities: 0,
    duplicateBreadcrumbEntities: 0,
    architecture: { approved: 64, planned: 40 },
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
