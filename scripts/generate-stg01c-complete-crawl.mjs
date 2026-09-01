import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const require = createRequire(import.meta.url);
const nextConfig = require(path.join(root, 'next.config.js'));
const baseUrl = (process.argv.find((value) => value.startsWith('--base-url='))?.slice(11) || 'http://127.0.0.1:3210').replace(/\/$/, '');
const publicOrigin = 'https://www.samanportable.com';
const architecture = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/commercialArchitecture.json'), 'utf8'));
const gating = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/unapprovedCommercialGating.json'), 'utf8'));
const customCanonical = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/customProductCanonicalPaths.json'), 'utf8'));
const customBySlug = new Map(customCanonical.map((row) => [row.slug, row.canonicalPath]));
const approved = new Set(architecture.approvedProductionPaths);
const planned = new Set(architecture.plannedReleasePaths);
const gated = new Set(gating.paths);

function decode(value) {
  return String(value || '').replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function strip(value) {
  return decode(String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function title(html) {
  return strip(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || '');
}

function meta(html, name) {
  const first = new RegExp(`<meta\\b[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i').exec(html);
  const second = new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i').exec(html);
  return decode(first?.[1] || second?.[1] || '');
}

function canonical(html) {
  const first = /<link\b[^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(html);
  const second = /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*>/i.exec(html);
  return decode(first?.[1] || second?.[1] || '');
}

function h1s(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => strip(match[1]));
}

function jsonLd(html) {
  const values = [];
  let errors = 0;
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { values.push(JSON.parse(match[1])); } catch { errors += 1; }
  }
  return { values, errors };
}

function schemaCount(values, wanted) {
  let count = 0;
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== 'object') return;
    const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
    if (types.includes(wanted)) count += 1;
    Object.values(value).forEach(visit);
  };
  values.forEach(visit);
  return count;
}

function normalizeInternal(value) {
  try {
    const url = new URL(decode(value), publicOrigin);
    if (url.origin !== publicOrigin) return null;
    return url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : '/';
  } catch { return null; }
}

function links(html) {
  const values = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi)) {
    const pathname = normalizeInternal(match[1]);
    if (pathname && !/\.(?:pdf|webp|png|jpe?g|gif|svg|xml|txt|json|zip)$/i.test(pathname)) values.push(pathname);
  }
  return values;
}

function assets(html) {
  const images = new Set();
  const pdfs = new Set();
  for (const match of html.matchAll(/<(?:img|source)\b[^>]*\s(src|srcset)=["']([^"']+)["'][^>]*>/gi)) {
    const candidates = match[1].toLowerCase() === 'srcset'
      ? decode(match[2]).split(',').map((item) => item.trim().replace(/\s+\d+(?:\.\d+)?[wx]$/, ''))
      : [decode(match[2])];
    for (const candidate of candidates) {
      try {
        const url = new URL(candidate, publicOrigin);
        if (url.origin !== publicOrigin) continue;
        if (url.pathname === '/_next/image') {
          const original = url.searchParams.get('url');
          if (!original) continue;
          const originalUrl = new URL(original, publicOrigin);
          if (originalUrl.origin === publicOrigin) images.add(originalUrl.pathname + originalUrl.search);
        } else {
          images.add(url.pathname + url.search);
        }
      } catch {}
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+\.pdf(?:\?[^"']*)?)["'][^>]*>/gi)) {
    try {
      const url = new URL(decode(match[1]), publicOrigin);
      if (url.origin === publicOrigin) pdfs.add(url.pathname + url.search);
    } catch {}
  }
  return { images: [...images], pdfs: [...pdfs] };
}

function productPath(product) {
  const category = product.category_slug || product.categories?.[0]?.slug;
  return customBySlug.get(product.slug) || (product.slug === category ? `/product/${category}` : `/product/${category}/${product.slug}`);
}

function draftPaths() {
  const directory = path.join(root, 'src/data/wp-export/products');
  return fs.readdirSync(directory).filter((name) => name.endsWith('.json')).map((name) => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'))).filter((product) => product.status === 'draft').map(productPath);
}

function sitemapLocs(files) {
  return new Set(files.flatMap((filename) => [...fs.readFileSync(path.join(root, 'public', filename), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]))));
}

async function request(pathname) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${pathname}`, { redirect: 'manual', signal: AbortSignal.timeout(30_000), headers: { 'user-agent': 'SAMAN-STG01C-Crawl/1.0' } });
      const contentType = response.headers.get('content-type') || '';
      const html = contentType.includes('text/html') ? await response.text() : '';
      if (!html && response.body) await response.body.cancel();
      return { pathname, status: response.status, location: response.headers.get('location'), xRobots: response.headers.get('x-robots-tag') || '', contentType, html };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }
  return { pathname, status: 0, location: null, xRobots: '', contentType: '', html: '', error: lastError?.message || 'request failed' };
}

async function requestStaticAware(pathname) {
  try {
    const cleanPath = decodeURIComponent(new URL(pathname, publicOrigin).pathname);
    const publicRoot = path.resolve(root, 'public');
    const candidate = path.resolve(publicRoot, `.${cleanPath}`);
    if (candidate.startsWith(`${publicRoot}${path.sep}`) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return { pathname, status: 200, location: null, xRobots: '', contentType: 'local-static-file', html: '' };
    }
  } catch {}
  return request(pathname);
}

async function mapConcurrent(values, concurrency, callback) {
  const output = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      output[index] = await callback(values[index], index);
    }
  }));
  return output;
}

function distribution(rows, getter = (row) => row.status) {
  return Object.fromEntries([...rows.reduce((map, row) => map.set(getter(row), (map.get(getter(row)) || 0) + 1), new Map())].sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
}

async function main() {
  const pageSitemaps = ['sitemap-products.xml', 'sitemap-locations.xml', 'sitemap-projects.xml', 'sitemap-editorial.xml'];
  const imageSitemaps = ['sitemap-images-products.xml', 'sitemap-images-locations.xml', 'sitemap-images-projects.xml', 'sitemap-images-editorial.xml'];
  const pageLocs = sitemapLocs(pageSitemaps);
  const imageLocs = sitemapLocs(imageSitemaps);
  const sitemapPaths = [...new Set([...pageLocs].map((url) => new URL(url).pathname.replace(/\/$/, '') || '/'))];
  const crawled = await mapConcurrent(sitemapPaths, 16, request);
  const pageByPath = new Map(crawled.map((row) => [row.pathname, row]));
  const linkEdges = crawled.flatMap((page) => links(page.html).map((target) => ({ source: page.pathname, target })));
  const uniqueTargets = [...new Set(linkEdges.map((edge) => edge.target))];
  const targetRows = await mapConcurrent(uniqueTargets, 20, request);
  const targetByPath = new Map(targetRows.map((row) => [row.pathname, row]));
  const badEdges = linkEdges.filter((edge) => targetByPath.get(edge.target)?.status !== 200);
  const noindexEdges = linkEdges.filter((edge) => {
    const row = targetByPath.get(edge.target);
    return `${meta(row?.html || '', 'robots')} ${row?.xRobots || ''}`.toLowerCase().includes('noindex');
  });
  const gatedEdges = linkEdges.filter((edge) => gated.has(edge.target));

  const approvedRows = [...approved].map((pathname) => pageByPath.get(pathname) || { pathname, status: 0, location: null, html: '' });
  const approvedFindings = approvedRows.map((row) => {
    const data = jsonLd(row.html);
    return {
      pathname: row.pathname, status: row.status, location: row.location, canonical: canonical(row.html), robots: meta(row.html, 'robots'),
      title: title(row.html), h1Count: h1s(row.html).length, jsonLdErrors: data.errors,
      productEntities: schemaCount(data.values, 'Product'), breadcrumbEntities: schemaCount(data.values, 'BreadcrumbList'),
      inPageSitemap: pageLocs.has(`${publicOrigin}${row.pathname}`), inImageSitemap: imageLocs.has(`${publicOrigin}${row.pathname}`),
    };
  });
  const approvedFailures = approvedFindings.filter((row) => row.status !== 200 || row.location || row.canonical !== `${publicOrigin}${row.pathname}` || (/noindex|nofollow/i.test(row.robots)) || !row.title || row.h1Count !== 1 || row.jsonLdErrors || row.productEntities !== 1 || row.breadcrumbEntities !== 1 || !row.inPageSitemap || !row.inImageSitemap);

  const gatedRows = await mapConcurrent([...gated], 6, request);
  const gatedFindings = gatedRows.map((row) => {
    const data = jsonLd(row.html);
    const robots = `${meta(row.html, 'robots')} ${row.xRobots}`.toLowerCase();
    return { pathname: row.pathname, status: row.status, location: row.location, robots, productEntities: schemaCount(data.values, 'Product'), faqEntities: schemaCount(data.values, 'FAQPage'), inPageSitemap: pageLocs.has(`${publicOrigin}${row.pathname}`), inImageSitemap: imageLocs.has(`${publicOrigin}${row.pathname}`) };
  });

  const drafts = draftPaths();
  const plannedRows = await mapConcurrent([...planned], 6, request);
  const draftRows = await mapConcurrent(drafts, 6, request);
  const discoveryExposure = linkEdges.filter((edge) => planned.has(edge.target) || drafts.includes(edge.target));

  const rules = await nextConfig.redirects();
  const literalRules = rules.filter((rule) => !/[\:*+?()]/.test(rule.source));
  const redirectSources = await mapConcurrent(literalRules, 12, (rule) => request(rule.source));
  const destinationPaths = [...new Set(literalRules.map((rule) => {
    try { return new URL(rule.destination, publicOrigin).pathname.replace(/\/$/, '') || '/'; } catch { return null; }
  }).filter(Boolean))];
  const destinationRows = await mapConcurrent(destinationPaths, 8, request);
  const destinationByPath = new Map(destinationRows.map((row) => [row.pathname, row]));
  const redirectRows = literalRules.map((rule, index) => {
    let destinationPath = null;
    try { destinationPath = new URL(rule.destination, publicOrigin).pathname.replace(/\/$/, '') || '/'; } catch {}
    const source = redirectSources[index];
    const destination = destinationByPath.get(destinationPath) || { status: null, location: null };
    return { source: rule.source, declaredDestination: rule.destination, sourceStatus: source.status, sourceLocation: source.location, destinationPath, destinationStatus: destination.status, destinationLocation: destination.location, permanent: rule.permanent, statusCode: rule.statusCode };
  });
  const redirectUnexpected = redirectRows.filter((row) => ![301, 308].includes(row.sourceStatus) || row.destinationStatus !== 200 || row.destinationLocation);

  const indexableFindings = crawled.map((row) => {
    const data = jsonLd(row.html);
    return { pathname: row.pathname, status: row.status, location: row.location, canonical: canonical(row.html), robots: meta(row.html, 'robots'), title: title(row.html), h1Count: h1s(row.html).length, jsonLdErrors: data.errors, productEntities: schemaCount(data.values, 'Product'), breadcrumbEntities: schemaCount(data.values, 'BreadcrumbList') };
  });
  const canonicalConflicts = indexableFindings.filter((row) => row.canonical !== `${publicOrigin}${row.pathname}`);
  const sitemapIndexabilityConflicts = indexableFindings.filter((row) => row.status !== 200 || row.location || /noindex/i.test(row.robots));
  const missingTitles = indexableFindings.filter((row) => !row.title).map((row) => row.pathname);
  const missingOrMultipleH1 = indexableFindings.filter((row) => row.h1Count !== 1).map((row) => ({ pathname: row.pathname, count: row.h1Count }));
  const schemaParseErrors = indexableFindings.filter((row) => row.jsonLdErrors).map((row) => ({ pathname: row.pathname, count: row.jsonLdErrors }));
  const approvedDuplicateSchema = approvedFindings.filter((row) => row.productEntities !== 1 || row.breadcrumbEntities !== 1).map((row) => ({ pathname: row.pathname, product: row.productEntities, breadcrumb: row.breadcrumbEntities }));

  const incomingByPath = new Map();
  linkEdges.forEach((edge) => incomingByPath.set(edge.target, (incomingByPath.get(edge.target) || 0) + 1));
  const orphanCandidates = sitemapPaths.filter((pathname) => pathname !== '/' && !incomingByPath.has(pathname));

  const imagePaths = new Set();
  const pdfPaths = new Set();
  crawled.forEach((row) => {
    const found = assets(row.html);
    found.images.forEach((item) => imagePaths.add(item));
    found.pdfs.forEach((item) => pdfPaths.add(item));
  });
  const imageRows = await mapConcurrent([...imagePaths], 30, requestStaticAware);
  const pdfRows = await mapConcurrent([...pdfPaths], 12, requestStaticAware);
  const brokenImages = imageRows.filter((row) => row.status !== 200).map((row) => ({ pathname: row.pathname, status: row.status }));
  const brokenPdfs = pdfRows.filter((row) => row.status !== 200).map((row) => ({ pathname: row.pathname, status: row.status }));

  const plannedLinks = linkEdges.filter((edge) => planned.has(edge.target));
  const draftLinks = linkEdges.filter((edge) => drafts.includes(edge.target));
  const internalPathExposure = crawled.filter((row) => /(?:[A-Z]:\\Users\\|\/home\/|\/workspace\/|\.env(?:\.|<|\s))/i.test(row.html)).map((row) => row.pathname);

  const result = {
    classification: 'LOCAL_PRODUCTION_EQUIVALENT_ONLY',
    groups: {
      approved: { requested: approvedRows.length, statusDistribution: distribution(approvedRows), failures: approvedFailures },
      gated: { requested: gatedRows.length, statusDistribution: distribution(gatedRows), findings: { noindexFollow200: gatedFindings.filter((row) => row.status === 200 && row.robots.includes('noindex') && row.robots.includes('follow')).length, exact404: gatedFindings.filter((row) => row.status === 404).length, redirectOr410: gatedFindings.filter((row) => row.location || row.status === 410).length, schemaSuppressionFailures: gatedFindings.filter((row) => row.productEntities || row.faqEntities).length, sitemapExposure: gatedFindings.filter((row) => row.inPageSitemap || row.inImageSitemap).length } },
      plannedDraft: { plannedRequested: plannedRows.length, plannedStatusDistribution: distribution(plannedRows), draftRequested: draftRows.length, draftStatusDistribution: distribution(draftRows), discoveryExposure: discoveryExposure.length, plannedLinks: plannedLinks.length, draftLinks: draftLinks.length },
      redirects: { declared: rules.length, literalRequested: redirectRows.length, sourceStatusDistribution: distribution(redirectRows, (row) => row.sourceStatus), unexpectedOrChains: redirectUnexpected },
      otherIndexable: { sitemapPages: crawled.length, nonApproved: crawled.filter((row) => !approved.has(row.pathname)).length, statusDistribution: distribution(crawled) },
    },
    crawl: {
      internalLinkOccurrences: linkEdges.length, uniqueInternalTargets: uniqueTargets.length, redirectOrErrorEdges: badEdges.length, redirectOrErrorEdgeSample: badEdges.slice(0, 20),
      linksFromIndexableToNoindex: noindexEdges.length, noindexTargets: new Set(noindexEdges.map((edge) => edge.target)).size,
      gatedLinkOccurrences: gatedEdges.length, gatedLinkTargets: new Set(gatedEdges.map((edge) => edge.target)).size,
      canonicalConflicts, sitemapIndexabilityConflicts, schemaParseErrors, approvedDuplicateSchema,
      brokenImages: { checked: imageRows.length, failures: brokenImages }, brokenPdfs: { checked: pdfRows.length, failures: brokenPdfs },
      orphanCandidates, missingTitles, missingOrMultipleH1, internalPathExposure,
    },
    controls: { pageSitemapCount: sitemapPaths.length, pageSitemapLocCount: pageLocs.size, imageSitemapLocCount: imageLocs.size, approvedCount: approved.size, plannedCount: planned.size, gatedCount: gated.size, draftPaths: drafts },
  };

  fs.writeFileSync(path.join(root, '.qa/stg01c-complete-crawl.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    classification: result.classification,
    groups: {
      approved: result.groups.approved,
      gated: result.groups.gated,
      plannedDraft: result.groups.plannedDraft,
      redirects: { ...result.groups.redirects, unexpectedOrChains: result.groups.redirects.unexpectedOrChains.length, unexpectedSample: result.groups.redirects.unexpectedOrChains.slice(0, 20) },
      otherIndexable: result.groups.otherIndexable,
    },
    crawl: { ...result.crawl, canonicalConflicts: result.crawl.canonicalConflicts.length, sitemapIndexabilityConflicts: result.crawl.sitemapIndexabilityConflicts.length, schemaParseErrors: result.crawl.schemaParseErrors.length, approvedDuplicateSchema: result.crawl.approvedDuplicateSchema.length, orphanCandidates: result.crawl.orphanCandidates.length, missingTitles: result.crawl.missingTitles.length, missingOrMultipleH1: result.crawl.missingOrMultipleH1.length, internalPathExposure: result.crawl.internalPathExposure.length },
    controls: result.controls,
  }, null, 2));

  if (approvedFailures.length || badEdges.length || canonicalConflicts.length || sitemapIndexabilityConflicts.length || schemaParseErrors.length || approvedDuplicateSchema.length || brokenImages.length || brokenPdfs.length || discoveryExposure.length || redirectUnexpected.length) process.exitCode = 1;
}

main().catch((error) => { console.error(error); process.exit(1); });
