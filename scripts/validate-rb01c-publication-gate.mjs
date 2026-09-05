import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseUrl = (
  process.argv.find((value) => value.startsWith('--base-url='))?.slice('--base-url='.length)
  || process.env.RB01C_BASE_URL
  || 'http://127.0.0.1:3210'
).replace(/\/$/, '');
const siteOrigin = 'https://www.samanportable.com';
const architecture = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/commercialArchitecture.json'), 'utf8'));
const temporaryGating = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/unapprovedCommercialGating.json'), 'utf8'));
const customCanonicalPaths = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/customProductCanonicalPaths.json'), 'utf8'));
const customCanonicalBySlug = new Map(customCanonicalPaths.map((entry) => [entry.slug, entry.canonicalPath]));
const failures = [];
const observations = [];

const ACCOMMODATION = '/product/labor-colony/accommodation-container';
const EXPANDABLE_OFFICE = '/product/container-offices/expandable-container-office';
const EXPANDABLE_HOUSE = '/product/container-houses/expandable-container-house';
const gatingFiles = [
  'src/data/seo/unapprovedCommercialGating.json',
  'src/lib/unapprovedCommercialGating.ts',
  'scripts/validate-unapproved-commercial-gating.js',
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

function attr(html, name) {
  const first = new RegExp(`<meta\\b[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i').exec(html);
  const second = new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i').exec(html);
  return decodeEntities(first?.[1] || second?.[1] || '');
}

function canonical(html) {
  const first = /<link\b[^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(html);
  const second = /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*>/i.exec(html);
  return decodeEntities(first?.[1] || second?.[1] || '');
}

function title(html) {
  return stripHtml(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || '');
}

function h1s(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripHtml(match[1]));
}

function jsonLdObjects(html) {
  const values = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      values.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`invalid JSON-LD: ${error.message}`);
    }
  }
  return values;
}

function schemaNodes(values, wantedType) {
  const hits = [];
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== 'object') return;
    const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
    if (types.includes(wantedType)) hits.push(value);
    Object.values(value).forEach(visit);
  };
  values.forEach(visit);
  return hits;
}

function productPath(product) {
  const category = product.category_slug || product.categories?.[0]?.slug;
  return customCanonicalBySlug.get(product.slug)
    || (product.slug === category ? `/product/${category}` : `/product/${category}/${product.slug}`);
}

function productRecords() {
  const directory = path.join(root, 'src/data/wp-export/products');
  return fs.readdirSync(directory)
    .filter((name) => name.endsWith('.json'))
    .map((name) => ({
      name,
      product: JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')),
    }));
}

async function request(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: 'manual',
    headers: { 'user-agent': 'SAMAN-RB01C-Publication-Gate/1.0' },
  });
  const contentType = response.headers.get('content-type') || '';
  const html = contentType.includes('text/html') ? await response.text() : '';
  if (!html && response.body) await response.body.cancel();
  return {
    pathname,
    status: response.status,
    location: response.headers.get('location'),
    xRobots: response.headers.get('x-robots-tag') || '',
    html,
  };
}

async function mapConcurrent(values, concurrency, callback) {
  const results = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await callback(values[index], index);
    }
  }));
  return results;
}

function sitemapLocs(filename) {
  const xml = fs.readFileSync(path.join(root, 'public', filename), 'utf8');
  if (!/^<\?xml/.test(xml) || !/<(?:urlset|sitemapindex)\b/.test(xml) || /undefined/.test(xml)) {
    fail(`${filename} is malformed or contains undefined`);
  }
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeEntities(match[1]));
}

function internalPaths(html) {
  const paths = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi)) {
    try {
      const url = new URL(decodeEntities(match[1]), siteOrigin);
      if (url.origin !== siteOrigin) continue;
      const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : '/';
      if (!/\.(?:pdf|webp|png|jpe?g|gif|svg|xml|txt|json|zip)$/i.test(pathname)) paths.push(pathname);
    } catch {
      fail(`invalid internal href ${match[1]}`);
    }
  }
  return paths;
}

async function main() {
  const approved = new Set(architecture.approvedProductionPaths);
  const planned = new Set(architecture.plannedReleasePaths);
  // PO-04 (5 Sep 2026): /product/portable-office/executive-portable-office ships, so it
  // moves from the planned-release backlog into the approved production list. 61/43 -> 62/42.
  // PO-05 (5 Sep 2026): 64/40. This pin was still 62/42 on entry - PO-03 published a
  // 63rd approved path without moving it - so this line also repairs that drift.
  if (approved.size !== 64 || planned.size !== 40) fail(`architecture counts are ${approved.size}/64 approved and ${planned.size}/40 planned`);
  if (!approved.has(EXPANDABLE_OFFICE) || planned.has(EXPANDABLE_OFFICE)) fail('Expandable Container Office release classification is wrong');
  if (!planned.has(ACCOMMODATION) || approved.has(ACCOMMODATION)) fail('Accommodation Container release classification is wrong');
  if (!planned.has(EXPANDABLE_HOUSE) || approved.has(EXPANDABLE_HOUSE)) fail('Expandable Container House release classification is wrong');

  for (const file of gatingFiles) if (!fs.existsSync(path.join(root, file))) fail(`temporary 63 gating file missing: ${file}`);
  const gatedPaths = new Set(temporaryGating.paths || []);
  const preExcludedDraftPaths = new Set([
    '/product/roofing-sheet/metal-roofing-sheet',
    '/product/roofing-sheet/pvc-roofing-sheet',
  ]);
  if (temporaryGating.status !== 'TEMPORARY_OWNER_DISPOSITION_PENDING' || gatedPaths.size !== 63) {
    fail(`temporary gating fixture is ${temporaryGating.status || 'missing-status'} with ${gatedPaths.size} paths`);
  }
  for (const pathname of gatedPaths) {
    if (approved.has(pathname) || planned.has(pathname)) fail(`temporarily gated path overlaps approved/planned architecture: ${pathname}`);
  }

  const records = productRecords();
  const draftRecords = records.filter(({ product }) => product.status === 'draft');
  const draftResults = await mapConcurrent(draftRecords, 6, async ({ name, product }) => {
    const pathname = productPath(product);
    const response = await request(pathname);
    if (response.status !== 404 || response.location) fail(`${name} draft route ${pathname} returned ${response.status}${response.location ? ` -> ${response.location}` : ''}`);
    if (schemaNodes(jsonLdObjects(response.html), 'Product').length) fail(`${pathname} draft 404 emitted Product schema`);
    return { name: product.name, source: name, pathname, status: response.status };
  });
  if (draftRecords.length !== 3) fail(`current implementation has ${draftRecords.length} draft records, expected 3 after publishing CO-08`);

  const approvedResults = await mapConcurrent([...approved], 12, async (pathname) => {
    const response = await request(pathname);
    if (response.status !== 200 || response.location) fail(`approved path ${pathname} returned ${response.status}${response.location ? ` -> ${response.location}` : ''}`);
    return response;
  });
  const plannedResults = await mapConcurrent([...planned], 12, async (pathname) => {
    const response = await request(pathname);
    if (response.status !== 404 || response.location) fail(`planned path ${pathname} returned ${response.status}${response.location ? ` -> ${response.location}` : ''}`);
    return response;
  });
  const gatedResults = await mapConcurrent([...gatedPaths], 12, async (pathname) => {
    const response = await request(pathname);
    if (preExcludedDraftPaths.has(pathname)) {
      if (response.status !== 404 || response.location) fail(`pre-excluded draft path ${pathname} returned ${response.status}${response.location ? ` -> ${response.location}` : ''}`);
      if (schemaNodes(jsonLdObjects(response.html), 'Product').length) fail(`${pathname} draft 404 emitted Product schema`);
      return response;
    }
    if (response.status !== 200 || response.location) fail(`temporarily gated path ${pathname} returned ${response.status}${response.location ? ` -> ${response.location}` : ''}`);
    const robots = `${attr(response.html, 'robots')} ${response.xRobots}`.toLowerCase();
    if (!robots.includes('noindex') || !robots.includes('follow')) fail(`temporarily gated path ${pathname} lacks noindex,follow`);
    if (schemaNodes(jsonLdObjects(response.html), 'Product').length) fail(`${pathname} temporarily gated page emitted Product schema`);
    return response;
  });

  const office = approvedResults.find((result) => result.pathname === EXPANDABLE_OFFICE);
  if (!office) fail('Expandable Container Office was not tested as approved');
  else {
    const expectedCanonical = `${siteOrigin}${EXPANDABLE_OFFICE}`;
    if (canonical(office.html) !== expectedCanonical) fail(`Expandable Container Office canonical is ${canonical(office.html) || 'missing'}`);
    if (!/^index\s*,\s*follow$/i.test(attr(office.html, 'robots'))) fail(`Expandable Container Office robots is ${attr(office.html, 'robots') || 'missing'}`);
    const officeH1s = h1s(office.html);
    if (officeH1s.length !== 1 || officeH1s[0] !== 'Expandable Container Office That Folds for Transport') fail(`Expandable Container Office H1 gate failed: ${JSON.stringify(officeH1s)}`);
    const schema = jsonLdObjects(office.html);
    const products = schemaNodes(schema, 'Product');
    const breadcrumbs = schemaNodes(schema, 'BreadcrumbList');
    if (products.length !== 1) fail(`Expandable Container Office has ${products.length} Product schema nodes`);
    if (breadcrumbs.length !== 1) fail(`Expandable Container Office has ${breadcrumbs.length} BreadcrumbList schema nodes`);
    const productImages = Array.isArray(products[0]?.image) ? products[0].image : products[0]?.image ? [products[0].image] : [];
    if (!productImages.length) fail('Expandable Container Office Product schema has no primary image');
    else {
      const primary = new URL(typeof productImages[0] === 'string' ? productImages[0] : productImages[0]?.url, siteOrigin);
      const primaryResponse = await request(primary.pathname);
      if (primaryResponse.status !== 200) fail(`Expandable Container Office primary image returned ${primaryResponse.status}: ${primary.pathname}`);
    }
  }

  const productLocs = sitemapLocs('sitemap-products.xml');
  const imageProductLocs = sitemapLocs('sitemap-images-products.xml');
  for (const pathname of [ACCOMMODATION, EXPANDABLE_HOUSE]) {
    if (productLocs.includes(`${siteOrigin}${pathname}`)) fail(`${pathname} appears in product sitemap`);
    if (imageProductLocs.includes(`${siteOrigin}${pathname}`)) fail(`${pathname} appears in product-image sitemap`);
  }
  if (!productLocs.includes(`${siteOrigin}${EXPANDABLE_OFFICE}`)) fail('Expandable Container Office missing from product sitemap');
  if (!imageProductLocs.includes(`${siteOrigin}${EXPANDABLE_OFFICE}`)) fail('Expandable Container Office missing from product-image sitemap');
  for (const pathname of gatedPaths) {
    if (productLocs.includes(`${siteOrigin}${pathname}`)) fail(`${pathname} temporarily gated path appears in product sitemap`);
    if (imageProductLocs.includes(`${siteOrigin}${pathname}`)) fail(`${pathname} temporarily gated path appears in product-image sitemap`);
  }

  const hub = await request('/product/container-offices');
  if (hub.status !== 200) fail(`Container Offices hub returned ${hub.status}`);
  const officeAnchors = [...hub.html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .filter((match) => new URL(decodeEntities(match[1]), siteOrigin).pathname.replace(/\/$/, '') === EXPANDABLE_OFFICE);
  if (!officeAnchors.length) fail('Container Offices hub does not link to Expandable Container Office');
  if (!officeAnchors.some((match) => /Expandable Container Office/i.test(stripHtml(match[2])))) fail('Expandable Office hub link lacks child-specific anchor text');
  if (office && !internalPaths(office.html).includes('/product/container-offices')) fail('Expandable Container Office does not link back to its hub');

  const approvedTitles = new Map();
  const approvedDescriptions = new Map();
  for (const page of approvedResults) {
    const pageTitle = title(page.html);
    const pageDescription = attr(page.html, 'description');
    if (pageTitle) approvedTitles.set(pageTitle, [...(approvedTitles.get(pageTitle) || []), page.pathname]);
    if (pageDescription) approvedDescriptions.set(pageDescription, [...(approvedDescriptions.get(pageDescription) || []), page.pathname]);
  }
  const officeTitle = title(office?.html || '');
  const officeDescription = attr(office?.html || '', 'description');
  if ((approvedTitles.get(officeTitle) || []).length !== 1) fail('Expandable Container Office title is not unique across approved pages');
  if ((approvedDescriptions.get(officeDescription) || []).length !== 1) fail('Expandable Container Office meta description is not unique across approved pages');

  const pageSitemapFiles = ['sitemap-products.xml', 'sitemap-locations.xml', 'sitemap-projects.xml', 'sitemap-editorial.xml'];
  const sitemapPaths = [...new Set(pageSitemapFiles.flatMap((filename) => sitemapLocs(filename).map((url) => new URL(url).pathname)))];
  const crawledPages = await mapConcurrent(sitemapPaths, 16, request);
  const linkOccurrences = crawledPages.flatMap((page) => internalPaths(page.html).map((target) => ({ source: page.pathname, target })));
  for (const target of [ACCOMMODATION, EXPANDABLE_HOUSE, ...draftResults.map((draft) => draft.pathname)]) {
    const incoming = linkOccurrences.filter((edge) => edge.target === target);
    if (incoming.length) fail(`${target} has ${incoming.length} public internal link occurrence(s)`);
  }
  const gatedIncomingLinks = linkOccurrences.filter((edge) => gatedPaths.has(edge.target));
  const gatedIncomingTargets = new Set(gatedIncomingLinks.map((edge) => edge.target));
  const uniqueTargets = [...new Set(linkOccurrences.map((edge) => edge.target))];
  const targetResults = await mapConcurrent(uniqueTargets, 16, request);
  const statusByPath = new Map(targetResults.map((result) => [result.pathname, result]));
  const badEdges = linkOccurrences.filter((edge) => statusByPath.get(edge.target)?.status !== 200);
  if (badEdges.length) fail(`${badEdges.length} internal links point to redirects/errors; first: ${JSON.stringify(badEdges[0])}`);

  observations.push({
    architecture: { approved: approved.size, planned: planned.size },
    drafts: draftResults,
    approvedRoutesChecked: approvedResults.length,
    plannedRoutesChecked: plannedResults.length,
    temporarilyGatedRoutesChecked: gatedResults.length,
    temporarilyGatedIncomingLinkOccurrences: gatedIncomingLinks.length,
    temporarilyGatedIncomingLinkTargets: gatedIncomingTargets.size,
    sitemapPagesCrawled: crawledPages.length,
    internalLinkOccurrences: linkOccurrences.length,
    uniqueInternalTargets: uniqueTargets.length,
  });

  if (failures.length) {
    console.error('RB-01C publication-gate validation failed:');
    failures.forEach((message) => console.error(`- ${message}`));
    process.exit(1);
  }
  console.log('RB-01C publication-gate validation passed.');
  console.log(JSON.stringify(observations[0], null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
