import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PREVIEW = (process.env.C06_PREVIEW_BASE || 'http://127.0.0.1:3106').replace(/\/$/, '');
const PRODUCTION = (process.env.C06_PRODUCTION_BASE || 'https://www.samanportable.com').replace(/\/$/, '');
const ROUTES = {
  'labor-colony': '/product/labor-colony',
  'labor-sheds': '/product/labor-colony/labor-sheds',
  'labor-hutments': '/product/labor-colony/labor-hutments',
  'prefab-labor-camps': '/product/labor-colony/prefab-labor-camps',
};
const PRIMARY_TERMS = {
  'labor-colony': ['labour colony', 'labor colony', 'labour accommodation'],
  'labor-sheds': ['labour shed', 'labor shed'],
  'labor-hutments': ['labour hutment', 'labor hutment'],
  'prefab-labor-camps': ['prefab labour camp', 'prefab labor camp', 'labour camp', 'labor camp'],
};
const PACK_ANCHORS = [
  'labour shed building',
  'labour hutment room block',
  'relocatable prefab labour camp',
  'the full worker housing range',
  'every colony building compared',
  'fixed and movable options side by side',
];
const RETIRED_CLAIMS = [
  '20×30 to 30×50 ft', '20x30 to 30x50 ft',
  '10×10 to 15×20 ft', '10x10 to 15x20 ft',
  '80 to 400 workers',
];
const CLAIMS = ['best', 'no. 1', 'guarantee', '24/7', 'cheapest', 'free delivery'];

const decode = value => value
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)))
  .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&apos;', "'")
  .replaceAll('&nbsp;', ' ');
const text = html => decode(html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const attr = (source, name) => decode(source.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '');
const norm = value => value.toLowerCase().replace(/\s+/g, ' ').trim();
const tokenise = value => norm(value).match(/[a-z0-9]+/g) || [];
const grams = value => {
  const words = tokenise(value);
  return new Set(Array.from({ length: Math.max(0, words.length - 6) }, (_, index) => words.slice(index, index + 7).join(' ')));
};
const snippet = (value, needle) => {
  const lower = value.toLowerCase();
  const index = lower.indexOf(needle.toLowerCase());
  return index < 0 ? null : value.slice(Math.max(0, index - 90), Math.min(value.length, index + needle.length + 90));
};
const extract = html => {
  const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  const links = [...withoutScripts.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(match => ({ href: attr(match[1], 'href'), text: text(match[2]) }));
  const contentStart = withoutScripts.indexOf('class="pc-hero-grid"');
  const contentEnd = contentStart >= 0 ? withoutScripts.indexOf('</main>', contentStart) : -1;
  const contentHtml = contentStart >= 0 ? withoutScripts.slice(contentStart, contentEnd >= 0 ? contentEnd : undefined) : withoutScripts;
  const contentLinks = [...contentHtml.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(match => ({ href: attr(match[1], 'href'), text: text(match[2]) }));
  const h1 = text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const h1Index = html.search(/<h1\b/i);
  const firstParagraph = h1Index >= 0 ? html.slice(h1Index).match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '' : '';
  const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
  return {
    title: decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim(),
    h1,
    metaDescription: decode(html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=["']([^"']*)["'][^>]*>/i)?.[1] || ''),
    canonical: decode(html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']*)["'][^>]*>/i)?.[1] || ''),
    visibleText: text(withoutScripts),
    contentText: text(contentHtml),
    links,
    contentLinks,
    firstParagraphHasLink: /<a\b/i.test(firstParagraph),
    jsonLd,
  };
};
const findType = (value, type) => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findType(item, type);
      if (found) return found;
    }
    return null;
  }
  if (!value || typeof value !== 'object') return null;
  if (value['@type'] === type || (Array.isArray(value['@type']) && value['@type'].includes(type))) return value;
  for (const child of Object.values(value)) {
    const found = findType(child, type);
    if (found) return found;
  }
  return null;
};
const hasClaim = (value, claim) => {
  if (/^[a-z]+$/.test(claim)) return new RegExp(`\\b${claim}\\b`, 'i').test(value);
  return value.toLowerCase().includes(claim.toLowerCase());
};

async function fetchPage(base, pathname, redirect = 'follow') {
  const separator = pathname.includes('?') ? '&' : '?';
  const response = await fetch(`${base}${pathname}${separator}c06=${Date.now()}`, {
    redirect,
    headers: { 'user-agent': 'C06-preview-audit/1.0' },
    signal: AbortSignal.timeout(base === PREVIEW ? 30_000 : 20_000),
  });
  return { status: response.status, location: response.headers.get('location'), html: await response.text() };
}

const sitemapFiles = ['sitemap-products.xml', 'sitemap-locations.xml', 'sitemap-projects.xml', 'sitemap-editorial.xml'];
const paths = [...new Set(sitemapFiles.flatMap(file => [...fs.readFileSync(path.join(ROOT, 'public', file), 'utf8').matchAll(/<loc>https:\/\/www\.samanportable\.com([^<]*)<\/loc>/g)].map(match => match[1] || '/')))].sort();
if (paths.length !== 450) throw new Error(`Expected 450 sitemap routes, found ${paths.length}`);

const pages = new Map();
let cursor = 0;
async function worker() {
  while (cursor < paths.length) {
    const pathname = paths[cursor++];
    const response = await fetchPage(PREVIEW, pathname);
    pages.set(pathname, { status: response.status, ...extract(response.html) });
  }
}
await Promise.all(Array.from({ length: 12 }, worker));
const non200 = [...pages].filter(([, page]) => page.status !== 200).map(([pathname, page]) => ({ pathname, status: page.status }));

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'page-structure', 'c06-generated-manifest.json'), 'utf8'));
const c06 = {};
const targetStatusCache = new Map();
const checkTarget = pathname => {
  if (!targetStatusCache.has(pathname)) targetStatusCache.set(pathname, fetchPage(PREVIEW, pathname, 'manual'));
  return targetStatusCache.get(pathname);
};
for (const [slug, pathname] of Object.entries(ROUTES)) {
  const page = pages.get(pathname);
  const product = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'products', `${slug}.json`), 'utf8'));
  const aggregate = page.jsonLd.map(node => findType(node, 'ProductGroup')).find(Boolean);
  const variantOffers = aggregate?.hasVariant?.map(variant => variant.offers).filter(Boolean) || [];
  const vatValues = [aggregate?.offers?.priceSpecification?.valueAddedTaxIncluded, ...variantOffers.map(offer => offer.priceSpecification?.valueAddedTaxIncluded)].filter(value => value !== undefined);
  const expectedPrices = product.variants.map(variant => variant.priceExGst).sort((a, b) => a - b);
  const emittedPrices = variantOffers.map(offer => offer.price).sort((a, b) => a - b);
  const internalLinks = page.contentLinks.filter(link => link.href && !/^(mailto:|tel:|javascript:|#)/i.test(link.href) && (link.href.startsWith('/') || link.href.startsWith('https://www.samanportable.com')));
  const checkedTargets = await Promise.all(internalLinks.map(async link => {
    const pathnameTarget = link.href.startsWith('/') ? link.href : new URL(link.href).pathname;
    const target = await checkTarget(pathnameTarget);
    return { anchor: link.text, href: link.href, status: target.status, location: target.location };
  }));
  const ownPrimaryLinks = page.contentLinks.filter(link => PRIMARY_TERMS[slug].includes(norm(link.text)));
  const visibleLower = page.contentText.toLowerCase();
  c06[slug] = {
    pathname,
    status: page.status,
    title: page.title,
    h1: page.h1,
    metaDescription: page.metaDescription,
    canonical: page.canonical,
    firstParagraphHasLink: page.firstParagraphHasLink,
    internalLinks: internalLinks.length,
    redirectedOrErrorTargets: checkedTargets.filter(target => target.status !== 200),
    ownPrimaryLinks,
    retiredClaimHits: RETIRED_CLAIMS.filter(claim => visibleLower.includes(claim.toLowerCase())),
    claimHits: CLAIMS.filter(claim => hasClaim(page.contentText, claim)).map(claim => ({ claim, snippet: snippet(page.contentText, claim) })),
    jsonLd: {
      productGroup: Boolean(aggregate),
      aggregateOffer: aggregate?.offers || null,
      variantOfferCount: variantOffers.length,
      emittedPrices,
      expectedPrices,
      vatValues,
      vatAllFalse: vatValues.length === 7 && vatValues.every(value => value === false),
    },
    pdf: await fetchPage(PREVIEW, `/specs/${slug}-technical-specification.pdf`, 'manual').then(result => ({ status: result.status })),
    downloadLabelCount: (page.visibleText.match(/Download Specification PDF/g) || []).length,
  };
}

const anchorOccurrences = Object.fromEntries(PACK_ANCHORS.map(anchor => [anchor, []]));
for (const [pathname, page] of pages) {
  for (const link of page.links) {
    const normalized = norm(link.text);
    if (PACK_ANCHORS.includes(normalized)) anchorOccurrences[normalized].push({ pathname, href: link.href });
  }
}

const sitewideSevenWordCollisions = [];
const routeGramSets = new Map([...pages].map(([pathname, page]) => [pathname, grams(page.visibleText)]));
for (const packPage of manifest.pages) {
  const sourceBodies = [
    ...Object.entries(JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products/section-h-datasets.json'), 'utf8'))[packPage.slug]).filter(([, value]) => typeof value === 'object').map(([sizeSlug, value]) => ({ surface: `${sizeSlug} Section H`, value: value.intro })),
    { surface: 'right-to-exist', value: `${packPage.rte.body} ${packPage.rte.comparison}` },
  ];
  for (const source of sourceBodies) {
    const sourceGrams = grams(source.value);
    for (const [pathname, page] of pages) {
      if (pathname === ROUTES[packPage.slug]) continue;
      const shared = [...sourceGrams].filter(sequence => routeGramSets.get(pathname).has(sequence));
      if (shared.length) sitewideSevenWordCollisions.push({ sourceUrl: ROUTES[packPage.slug], surface: source.surface, competingUrl: pathname, sequences: shared });
    }
  }
}

const l3 = await Promise.all(Object.entries(ROUTES).map(async ([slug, pathname]) => {
  try {
    const live = await fetchPage(PRODUCTION, pathname);
    const prod = extract(live.html);
    const local = c06[slug];
    return {
      pathname,
      productionStatus: live.status,
      titleEqual: prod.title === local.title,
      h1Equal: prod.h1 === local.h1,
      metaDescriptionEqual: prod.metaDescription === local.metaDescription,
      canonicalEqual: prod.canonical === local.canonical,
      production: { title: prod.title, h1: prod.h1, metaDescription: prod.metaDescription, canonical: prod.canonical },
      preview: { title: local.title, h1: local.h1, metaDescription: local.metaDescription, canonical: local.canonical },
    };
  } catch (error) {
    return { pathname, error: error instanceof Error ? error.message : String(error) };
  }
}));

const imageReport = JSON.parse(fs.readFileSync(path.join(ROOT, 'page-structure/c06-image-processing-report.json'), 'utf8'));
const imageSitemap = fs.readFileSync(path.join(ROOT, 'public/sitemap-images-products.xml'), 'utf8');
const imageSitemapHits = imageReport.images.filter(image => imageSitemap.includes(image.target.replace(/^public/, '').replaceAll('\\', '/'))).length;

const result = {
  previewBase: PREVIEW,
  productionBase: PRODUCTION,
  sitemapRoutes: paths.length,
  route200Count: paths.length - non200.length,
  non200,
  c06,
  packAnchorOccurrences: anchorOccurrences,
  packAnchorUniqueSitewide: Object.values(anchorOccurrences).every(entries => entries.length === 1),
  sitewideSevenWordCollisions,
  l3,
  imageSitemap: { expected: 144, hits: imageSitemapHits },
};
fs.writeFileSync(path.join(ROOT, 'page-structure/c06-preview-audit-final.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({
  sitemapRoutes: result.sitemapRoutes,
  route200Count: result.route200Count,
  non200: result.non200,
  c06: Object.fromEntries(Object.entries(c06).map(([slug, page]) => [slug, {
    status: page.status,
    firstParagraphHasLink: page.firstParagraphHasLink,
    redirectedOrErrorTargets: page.redirectedOrErrorTargets,
    ownPrimaryLinks: page.ownPrimaryLinks,
    retiredClaimHits: page.retiredClaimHits,
    claimHits: page.claimHits,
    jsonLd: page.jsonLd,
    pdf: page.pdf,
    downloadLabelCount: page.downloadLabelCount,
  }])),
  packAnchorOccurrences: result.packAnchorOccurrences,
  sitewideSevenWordCollisionCount: result.sitewideSevenWordCollisions.length,
  l3: result.l3,
  imageSitemap: result.imageSitemap,
}, null, 2));
if (non200.length || !result.packAnchorUniqueSitewide || imageSitemapHits !== 144) process.exitCode = 1;
