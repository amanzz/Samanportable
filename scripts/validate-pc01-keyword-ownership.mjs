import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HUB = '/product/porta-cabins';
export const RETIRED_HUB = '/product/portable-cabin';
export const GUIDE = '/porta-cabin-price-a-complete-guide-2025';

export const CHILDREN = Object.freeze([
  { slug: 'double-story-porta-cabin', name: 'Double Story Porta Cabin', qualifier: /double[- ]story|g\+1/i },
  { slug: 'fire-rated-porta-cabin', name: 'Fire-Rated Porta Cabin', qualifier: /fire[- ]rated/i },
  { slug: 'gi-porta-cabin', name: 'GI Porta Cabin', qualifier: /\bgi\b|galvani[sz]ed/i },
  { slug: 'knock-down-porta-cabin', name: 'Knock-Down Porta Cabin', qualifier: /knock[- ]down|flat[- ]pack/i },
  { slug: 'ms-porta-cabin', name: 'MS Porta Cabin', qualifier: /\bms\b|mild[- ]steel/i },
  { slug: 'porta-cabin-shop', name: 'Porta Cabin Shop', qualifier: /shop|kiosk/i },
  { slug: 'porta-cabin-with-toilet', name: 'Porta Cabin with Toilet', qualifier: /toilet|washroom|sanitary/i },
  { slug: 'puf-porta-cabin', name: 'PUF Porta Cabin', qualifier: /\bpuf\b/i },
  { slug: 'skid-mounted-porta-cabin', name: 'Skid-Mounted Porta Cabin', qualifier: /skid[- ]mounted|\bskid\b/i },
  { slug: 'soundproof-porta-cabin', name: 'Soundproof Porta Cabin', qualifier: /soundproof|acoustic/i },
].map((child) => ({ ...child, href: `${HUB}/${child.slug}` })));

const PAGE_SITEMAPS = [
  'sitemap-products.xml',
  'sitemap-locations.xml',
  'sitemap-projects.xml',
  'sitemap-editorial.xml',
];

const BROAD_ANCHOR = /^(?:(?:view|explore|compare|browse|our|the|a|current|full|general-purpose)\s+)*(?:porta|portable)\s+cabins?(?:\s+(?:range|sizes?(?:\s+and\s+prices)?|prices?|options?|configurations?|overview|lineup|line-up))?$/i;
const INFORMATIONAL_GUIDE = /\b(?:guide|how\b[^\n]{0,50}\bpricing\b|pricing\s+(?:works|breakdown|logic)|cost(?:-per-[a-z-]+|\s+per\s+[a-z]+)?\s+(?:factors?|benchmark|breakdown)|understand\b[^\n]{0,50}\bpricing\b)\b/i;
const COMMERCIAL_GUIDE_TO_HUB = /\b(?:explore|view|compare|browse)\b[^\n]{0,80}\bporta(?:ble)?\s+cabins?\b/i;
const LOCAL_PATH = /^\/(?:porta-cabins?-in-|portable-cabins?-in-|portacabins-for-sale-in-|affordable-porta-cabins-in-|portable-cabin-price-in-)/i;

const cleanText = (value) => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/\s+/g, ' ')
  .trim();

export function normalizeInternalHref(value, siteOrigin = 'https://www.samanportable.com') {
  try {
    const url = new URL(value, siteOrigin);
    if (!['www.samanportable.com', 'samanportable.com', '127.0.0.1', 'localhost'].includes(url.hostname)) {
      return null;
    }
    const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
    return { pathname, search: url.search, href: `${pathname}${url.search}` };
  } catch {
    return null;
  }
}

function surfaceAt(html, anchorIndex) {
  const before = html.slice(0, anchorIndex).toLowerCase();
  if (before.lastIndexOf('<header') > before.lastIndexOf('</header>')) return 'header';
  if (before.lastIndexOf('<footer') > before.lastIndexOf('</footer>')) return 'footer';
  return 'contextual';
}

function isRelevant(anchor, pathname) {
  return /\b(?:porta|portable)\s+cabins?\b/i.test(anchor) || /(?:porta|portable)-cabins?/i.test(pathname);
}

function classifyPath(pathname, gatedPaths) {
  if (pathname === HUB) return 'hub';
  if (pathname === RETIRED_HUB) return 'retired';
  if (pathname === GUIDE) return 'guide';
  if (CHILDREN.some((child) => child.href === pathname)) return 'child';
  if (LOCAL_PATH.test(pathname)) return 'local';
  if (pathname.startsWith('/product-category/')) return 'archive';
  if (gatedPaths.has(pathname)) return 'gated';
  if (pathname.startsWith('/container-rent-services/')) return 'rental';
  if (pathname.startsWith('/specs/')) return 'technical-pdf';
  if (pathname === '/blog') return 'informational-taxonomy';
  return 'supporting';
}

function sourceLocation(sourcePage, surface, root) {
  if (surface === 'header') return { file: 'src/components/Header.tsx', module: 'shared header navigation' };
  if (surface === 'footer') return { file: 'src/components/Footer.tsx', module: 'shared footer resources/navigation' };
  if (sourcePage === '/blog') return { file: 'src/pages/blog.tsx', module: 'blog listing cards' };
  if (sourcePage === '/') return { file: 'src/data/wp-export/homepage.json; src/pages/index.tsx', module: 'homepage content' };
  if (sourcePage === HUB) {
    return {
      file: 'src/data/products/porta-cabins.json; src/components/product-variant-hero/rightToExistEntries.tsx; src/lib/portaCabinClusterRail.ts',
      module: 'PC-01 content and maintained hub rail',
    };
  }
  const child = CHILDREN.find((item) => sourcePage === item.href);
  if (child) {
    return {
      file: `src/data/products/${child.slug}.json; src/lib/portaCabinClusterRail.ts`,
      module: 'approved child content and maintained family rail',
    };
  }
  const productMatch = sourcePage.match(/^\/product\/[^/]+\/([^/]+)$/);
  if (productMatch) {
    const slug = productMatch[1];
    const maintained = `src/data/products/${slug}.json`;
    const exported = `src/data/wp-export/products/${slug}.json`;
    const file = fs.existsSync(path.join(root, maintained)) ? maintained : exported;
    return { file, module: 'product content' };
  }
  const postSlug = sourcePage.replace(/^\//, '');
  const postFile = `src/data/wp-export/posts/${postSlug}.json`;
  if (fs.existsSync(path.join(root, postFile))) return { file: `${postFile}; src/pages/[slug].tsx`, module: 'post content and post template' };
  return { file: 'rendered route (no unique maintained source resolved)', module: 'rendered contextual link' };
}

export function extractRelevantAnchors(html, sourcePage, gatedPaths = new Set(), root = process.cwd()) {
  const anchors = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const hrefMatch = match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const normalized = normalizeInternalHref(hrefMatch[1]);
    if (!normalized) continue;
    const anchor = cleanText(match[2]);
    if (!isRelevant(anchor, normalized.pathname)) continue;
    const surface = surfaceAt(html, match.index);
    const source = sourceLocation(sourcePage, surface, root);
    anchors.push({
      sourcePage,
      sourceFile: source.file,
      module: source.module,
      surface,
      anchor,
      href: normalized.href,
      pathname: normalized.pathname,
      classification: classifyPath(normalized.pathname, gatedPaths),
    });
  }
  return anchors;
}

function localQualifier(pathname) {
  return pathname
    .replace(/^\//, '')
    .replace(/^(?:porta-cabins?-in-|portable-cabins?-in-|portacabins-for-sale-in-|affordable-porta-cabins-in-|portable-cabin-price-in-)/i, '')
    .split('-')
    .filter((token) => token.length > 2);
}

export function anchorIntent(anchor) {
  const child = CHILDREN.find((item) => item.href === anchor.pathname);
  if (anchor.classification === 'retired') return 'RETIRED_OWNER';
  if (anchor.classification === 'gated') return 'GATED_OR_UNAPPROVED';
  if (anchor.classification === 'archive' && BROAD_ANCHOR.test(anchor.anchor)) return 'BROAD_TO_ARCHIVE';
  if (anchor.classification === 'guide') return INFORMATIONAL_GUIDE.test(anchor.anchor) ? 'INFORMATIONAL_GUIDE' : 'BARE_COMMERCIAL_TO_GUIDE';
  if (anchor.classification === 'local') {
    const words = localQualifier(anchor.pathname);
    return words.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(anchor.anchor))
      || /\b(?:north|south|east|west|central)\s+india\b/i.test(anchor.anchor)
      ? 'LOCATION_QUALIFIED'
      : 'UNQUALIFIED_LOCAL';
  }
  if (child) return child.qualifier.test(anchor.anchor) ? 'SUBTYPE_SPECIFIC' : 'BROAD_TO_CHILD';
  if (BROAD_ANCHOR.test(anchor.anchor)) {
    if (anchor.pathname === HUB) return 'BROAD_OWNER';
    if (anchor.pathname === '/blog' && /(?:^|[?&])(?:category|tag)=porta-cabins(?:&|$)/.test(anchor.href)) return 'INFORMATIONAL_TAXONOMY';
    return 'BROAD_TO_OTHER_OWNER';
  }
  return 'SPECIALIST_OR_SUPPORTING';
}

async function mapConcurrent(items, concurrency, operation) {
  const output = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await operation(items[index], index);
    }
  }));
  return output;
}

async function requestPage(baseUrl, pathname, redirect = 'follow') {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect,
    headers: { 'user-agent': 'PC01-REL-04-keyword-ownership-validator' },
  });
  return { status: response.status, headers: response.headers, html: await response.text() };
}

function metadata(html) {
  const canonical = (
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)
    || []
  )[1] || '';
  const robots = (
    html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i)
    || []
  )[1] || '';
  return { canonical: normalizeInternalHref(canonical)?.pathname || canonical, robots };
}

async function inspectDestination(baseUrl, pathname) {
  let current = pathname;
  const redirects = [];
  let initialStatus = 0;
  for (let step = 0; step < 5; step += 1) {
    const response = await requestPage(baseUrl, current, 'manual');
    if (step === 0) initialStatus = response.status;
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      const next = normalizeInternalHref(location)?.pathname;
      redirects.push({ status: response.status, to: next || location });
      if (!next) break;
      current = next;
      continue;
    }
    return {
      requested: pathname,
      status: initialStatus,
      redirects,
      finalPath: current,
      finalStatus: response.status,
      ...metadata(response.html),
    };
  }
  return { requested: pathname, status: initialStatus, redirects, finalPath: current, finalStatus: null, canonical: '', robots: '' };
}

function sitemapPaths(root) {
  return [...new Set(PAGE_SITEMAPS.flatMap((filename) => {
    const xml = fs.readFileSync(path.join(root, 'public', filename), 'utf8');
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  }))];
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(full) : [full];
  });
}

export function sourceHashManifest(root = process.cwd()) {
  const files = [
    ...walkFiles(path.join(root, 'src')),
    path.join(root, 'public/specs/saman-porta-cabins-technical-specification.pdf'),
  ].filter((file) => fs.existsSync(file)).sort();
  return Object.fromEntries(files.map((file) => [
    path.relative(root, file).replaceAll('\\', '/'),
    crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  ]));
}

export function compareHashManifests(before, after) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((key) => before[key] !== after[key]).sort();
}

export async function crawlOwnership({ baseUrl, root = process.cwd() }) {
  const gated = new Set(JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/unapprovedCommercialGating.json'), 'utf8')).paths);
  const beforeHashes = sourceHashManifest(root);
  const paths = sitemapPaths(root);
  const pages = await mapConcurrent(paths, 16, async (pathname) => {
    const response = await requestPage(baseUrl, pathname);
    return { pathname, status: response.status, html: response.html, ...metadata(response.html) };
  });
  const anchors = pages.flatMap((page) => extractRelevantAnchors(page.html, page.pathname, gated, root));
  const targetPaths = [...new Set(anchors.map((anchor) => anchor.pathname))];
  const destinations = await mapConcurrent(targetPaths, 16, (pathname) => inspectDestination(baseUrl, pathname));
  const destinationByPath = new Map(destinations.map((destination) => [destination.requested, destination]));
  const occurrenceCounts = new Map();
  for (const anchor of anchors) {
    const key = `${anchor.surface}\u0000${anchor.anchor}\u0000${anchor.href}`;
    occurrenceCounts.set(key, (occurrenceCounts.get(key) || 0) + 1);
  }
  const enrichedAnchors = anchors.map((anchor) => {
    const key = `${anchor.surface}\u0000${anchor.anchor}\u0000${anchor.href}`;
    return {
      ...anchor,
      intent: anchorIntent(anchor),
      occurrenceScope: occurrenceCounts.get(key) > 10 ? 'repeated/sitewide' : anchor.surface,
      occurrenceCount: occurrenceCounts.get(key),
      destination: destinationByPath.get(anchor.pathname),
    };
  });
  const afterHashes = sourceHashManifest(root);
  return {
    baseUrl,
    sitemapPageCount: paths.length,
    pages,
    anchors: enrichedAnchors,
    destinations,
    sourceMutations: compareHashManifests(beforeHashes, afterHashes),
  };
}

function addFailure(failures, condition, message, evidence = []) {
  failures.push({ condition, message, evidence: evidence.slice(0, 25) });
}

export function validateSnapshot(snapshot) {
  const failures = [];
  const anchors = snapshot.anchors || [];
  const pageByPath = new Map((snapshot.pages || []).map((page) => [page.pathname, page]));
  const destinationByPath = new Map((snapshot.destinations || []).map((row) => [row.requested, row]));
  const retired = anchors.filter((anchor) => anchor.pathname === RETIRED_HUB);
  if (retired.length) addFailure(failures, 1, 'Retired Portable Cabin href is present.', retired);

  const broadBadDestination = anchors.filter((anchor) => ['BROAD_TO_OTHER_OWNER', 'BROAD_TO_CHILD'].includes(anchor.intent)
    || (/^BROAD_/.test(anchor.intent) && anchor.destination && (anchor.destination.status !== 200 || anchor.destination.redirects.length)));
  if (broadBadDestination.length) addFailure(failures, 2, 'Broad Porta Cabin anchors nominate a redirect, error, child, or other owner.', broadBadDestination);

  const broadArchive = anchors.filter((anchor) => anchor.intent === 'BROAD_TO_ARCHIVE');
  if (broadArchive.length) addFailure(failures, 3, 'Broad commercial anchors nominate product-category archives.', broadArchive);

  const gated = anchors.filter((anchor) => anchor.classification === 'gated');
  if (gated.length) addFailure(failures, 4, 'Temporary or unapproved URLs are linked.', gated);

  const broadOwners = anchors.filter((anchor) => BROAD_ANCHOR.test(anchor.anchor) && !['INFORMATIONAL_TAXONOMY', 'INFORMATIONAL_GUIDE', 'LOCATION_QUALIFIED'].includes(anchor.intent));
  const wrongBroadOwners = broadOwners.filter((anchor) => anchor.pathname !== HUB);
  if (wrongBroadOwners.length) addFailure(failures, 5, 'Broad commercial owner is not the PC-01 hub.', wrongBroadOwners);

  const guideBad = anchors.filter((anchor) => anchor.pathname === GUIDE && !INFORMATIONAL_GUIDE.test(anchor.anchor));
  if (guideBad.length) addFailure(failures, 6, 'Price-guide links lack informational qualification.', guideBad);

  const localBad = anchors.filter((anchor) => anchor.classification === 'local' && anchor.intent !== 'LOCATION_QUALIFIED');
  if (localBad.length) addFailure(failures, 7, 'Local-page links lack a location qualifier.', localBad);

  const childBad = anchors.filter((anchor) => anchor.classification === 'child' && anchor.intent !== 'SUBTYPE_SPECIFIC');
  if (childBad.length) addFailure(failures, 8, 'Child links lack subtype-specific product names.', childBad);

  const hubAnchors = anchors.filter((anchor) => anchor.sourcePage === HUB);
  const missingHubChildren = CHILDREN.filter((child) => !hubAnchors.some((anchor) => anchor.pathname === child.href));
  if (missingHubChildren.length) addFailure(failures, 9, 'The hub does not link every approved child.', missingHubChildren);

  const missingChildReturns = CHILDREN.filter((child) => !anchors.some((anchor) => anchor.sourcePage === child.href && anchor.pathname === HUB));
  if (missingChildReturns.length) addFailure(failures, 10, 'Approved children lack a direct hub-return link.', missingChildReturns);

  const childSelfLinks = CHILDREN.flatMap((child) => anchors.filter((anchor) => anchor.sourcePage === child.href && anchor.pathname === child.href));
  if (childSelfLinks.length) addFailure(failures, 11, 'A child links to itself in its family surface.', childSelfLinks);

  const guidePage = pageByPath.get(GUIDE);
  const guideDestination = destinationByPath.get(GUIDE);
  const guideRetained = guidePage?.status === 200 && guidePage.canonical === GUIDE && !/noindex/i.test(guidePage.robots || '')
    && guideDestination?.finalStatus === 200;
  if (guideRetained) {
    const guideToHub = anchors.filter((anchor) => anchor.sourcePage === GUIDE && anchor.surface === 'contextual' && anchor.pathname === HUB);
    if (guideToHub.length !== 1 || !guideToHub.every((anchor) => COMMERCIAL_GUIDE_TO_HUB.test(anchor.anchor))) {
      addFailure(failures, 12, 'Retained guide must have exactly one purposeful commercial-selection link to the hub.', guideToHub);
    }
  }

  const hubToGuide = anchors.filter((anchor) => anchor.sourcePage === HUB && anchor.pathname === GUIDE);
  if (guideRetained && hubToGuide.length !== 1) addFailure(failures, 13, 'Hub-to-guide link count is not the one approved intended occurrence.', hubToGuide);

  const badRelatedTargets = anchors.filter((anchor) => anchor.classification === 'child' && anchor.destination
    && (anchor.destination.status !== 200 || anchor.destination.redirects.length || anchor.destination.finalStatus !== 200));
  if (badRelatedTargets.length) addFailure(failures, 14, 'Related-product surfaces include a redirect, error, planned, draft, gated, or archive URL.', badRelatedTargets);

  if ((snapshot.sourceMutations || []).length) addFailure(failures, 15, 'Validation changed source files.', snapshot.sourceMutations);

  const hubPage = pageByPath.get(HUB);
  if (!hubPage || hubPage.status !== 200 || hubPage.canonical !== HUB || /noindex/i.test(hubPage.robots || '')) {
    addFailure(failures, 5, 'The broad owner hub is not direct 200, self-canonical, and indexable.', hubPage ? [hubPage] : []);
  }
  return failures;
}

function csv(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function writeEvidenceCsv(snapshot, outputPath) {
  const columns = [
    'source_page', 'source_file', 'module', 'rendered_anchor', 'href', 'final_destination',
    'http_result', 'canonical_destination', 'robots', 'surface', 'occurrence_scope',
    'occurrence_count', 'classification', 'intent_verdict',
  ];
  const lines = [columns.join(',')];
  for (const anchor of snapshot.anchors) {
    const destination = anchor.destination || {};
    lines.push([
      anchor.sourcePage, anchor.sourceFile, anchor.module, anchor.anchor, anchor.href,
      destination.finalPath, `${destination.status || ''}${destination.redirects?.length ? ` redirect:${destination.redirects.map((row) => row.to).join('>')}` : ''}`,
      destination.canonical, destination.robots, anchor.surface, anchor.occurrenceScope,
      anchor.occurrenceCount, anchor.classification, anchor.intent,
    ].map(csv).join(','));
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
}

export function summarize(snapshot, failures = validateSnapshot(snapshot)) {
  const anchors = snapshot.anchors;
  const count = (predicate) => anchors.filter(predicate).length;
  return {
    sitemapPages: snapshot.sitemapPageCount,
    relevantOccurrences: anchors.length,
    relevantAnchorGroups: new Set(anchors.map((row) => `${row.surface}\u0000${row.anchor}\u0000${row.href}`)).size,
    broadHub: count((row) => row.pathname === HUB && BROAD_ANCHOR.test(row.anchor)),
    retiredHub: count((row) => row.pathname === RETIRED_HUB),
    approvedChildren: count((row) => row.classification === 'child'),
    priceGuide: count((row) => row.pathname === GUIDE),
    localPages: count((row) => row.classification === 'local'),
    productCategoryArchives: count((row) => row.classification === 'archive'),
    gatedOrUnapproved: count((row) => row.classification === 'gated'),
    contextual: count((row) => row.surface === 'contextual'),
    repeatedOrSitewide: count((row) => row.occurrenceScope === 'repeated/sitewide'),
    header: count((row) => row.surface === 'header'),
    footer: count((row) => row.surface === 'footer'),
    findings: failures.map((failure) => ({ condition: failure.condition, message: failure.message, count: failure.evidence.length })),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const valueAfter = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const root = process.cwd();
  const baseUrl = (valueAfter('--base-url') || process.env.PC01_BASE_URL || 'http://127.0.0.1:3211').replace(/\/$/, '');
  const snapshot = await crawlOwnership({ baseUrl, root });
  const failures = validateSnapshot(snapshot);
  const evidence = valueAfter('--write-evidence');
  if (evidence) writeEvidenceCsv(snapshot, path.resolve(root, evidence));
  const summary = summarize(snapshot, failures);
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) {
    for (const failure of failures) console.error(`FAIL [${failure.condition}]: ${failure.message} (${failure.evidence.length})`);
    if (!args.includes('--baseline')) process.exitCode = 1;
  } else {
    console.log('PASS: PC-01 keyword ownership and internal-link contract.');
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
