const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.argv.find((value) => value.startsWith('--base-url='))?.slice(11)
  || 'http://127.0.0.1:3106';
const SITE_ORIGIN = 'https://www.samanportable.com';
const PAGE_SITEMAPS = [
  'sitemap-products.xml',
  'sitemap-locations.xml',
  'sitemap-projects.xml',
  'sitemap-editorial.xml',
];
const RETIRED_PATHS = new Set([
  '/product/labor-colony/prefab-labor-sheds',
  '/product/labor-colony/prefab-labor-hutments',
  '/product/labor-colony/labor-camps',
  '/product/labor-colony/labor-accommodations',
  '/product/labor-colony/labor-cottages',
  '/product/labor-colony/labor-shelters',
  '/product/labor-colony/prefab-labour-colony',
  '/product-category/labor-colony',
]);
const WINNERS = new Set([
  '/product/labor-colony',
  '/product/labor-colony/labor-sheds',
  '/product/labor-colony/labor-hutments',
  '/product/labor-colony/prefab-labor-camps',
]);

function sitemapPaths() {
  const paths = [];
  for (const filename of PAGE_SITEMAPS) {
    const xml = fs.readFileSync(path.join(ROOT, 'public', filename), 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      paths.push(new URL(match[1]).pathname);
    }
  }
  return paths;
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

function internalAnchorHrefs(html) {
  const hrefs = [];
  for (const anchor of String(html || '').matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>/gi)) {
    const href = anchor[1] ?? anchor[2] ?? '';
    if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript):/i.test(href)) continue;
    try {
      const parsed = new URL(href, SITE_ORIGIN);
      if (parsed.origin !== SITE_ORIGIN) continue;
      hrefs.push({
        href,
        kind: /^https:\/\/www\.samanportable\.com/i.test(href) ? 'absolute' : 'relative',
        path: parsed.pathname,
      });
    } catch {
      // Invalid hrefs are reported by their source page in the caller.
      hrefs.push({ href, kind: 'invalid', path: '' });
    }
  }
  return hrefs;
}

async function main() {
  const paths = sitemapPaths();
  const duplicateSitemapPaths = paths.filter((value, index) => paths.indexOf(value) !== index);
  const pageResults = await mapConcurrent(paths, 20, async (pathname) => {
    const response = await fetch(`${BASE_URL}${pathname}`, { redirect: 'manual' });
    const html = response.status === 200 ? await response.text() : '';
    return { pathname, status: response.status, hrefs: internalAnchorHrefs(html) };
  });

  const non200SitemapPages = pageResults
    .filter((page) => page.status !== 200)
    .map(({ pathname, status }) => ({ pathname, status }));
  const anchorOccurrences = pageResults.flatMap((page) =>
    page.hrefs.map((href) => ({ source: page.pathname, ...href }))
  );
  const uniqueInternalPaths = [...new Set(anchorOccurrences.map((item) => item.path).filter(Boolean))];
  const linkStatuses = await mapConcurrent(uniqueInternalPaths, 20, async (pathname) => {
    const response = await fetch(`${BASE_URL}${pathname}`, { redirect: 'manual' });
    if (response.body) await response.body.cancel();
    return { pathname, status: response.status, location: response.headers.get('location') };
  });
  const statusByPath = new Map(linkStatuses.map((item) => [item.pathname, item]));
  const badInternalLinks = anchorOccurrences
    .filter((item) => item.kind === 'invalid' || statusByPath.get(item.path)?.status !== 200)
    .map((item) => ({
      ...item,
      status: statusByPath.get(item.path)?.status || 0,
      location: statusByPath.get(item.path)?.location || null,
    }));
  const retiredLinks = anchorOccurrences.filter((item) => RETIRED_PATHS.has(item.path));
  const presentWinners = [...WINNERS].filter((winner) => paths.includes(winner));

  const result = {
    sitemapPages: paths.length,
    duplicateSitemapPaths,
    non200SitemapPages,
    presentWinners,
    internalAnchorOccurrences: anchorOccurrences.length,
    uniqueInternalPaths: uniqueInternalPaths.length,
    badInternalLinks,
    retiredLinks: {
      absolute: retiredLinks.filter((item) => item.kind === 'absolute').length,
      relative: retiredLinks.filter((item) => item.kind === 'relative').length,
      details: retiredLinks,
    },
  };
  console.log(JSON.stringify(result, null, 2));

  if (
    process.argv.includes('--assert') &&
    (
      paths.length !== 450 ||
      duplicateSitemapPaths.length ||
      non200SitemapPages.length ||
      presentWinners.length !== WINNERS.size ||
      badInternalLinks.length ||
      retiredLinks.length
    )
  ) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
