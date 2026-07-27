import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const config = require('../next.config.js');
const entries = await config.redirects();
const base = (process.env.C01_BASE_URL || '').replace(/\/$/, '');
const canonicalOrigin = 'https://www.samanportable.com';

const expected = [
  ['/product/porta-cabins/buy-porta-cabins', '/product/porta-cabins'],
  ['/product/porta-cabins/prefabricated-porta-cabin', '/product/porta-cabins'],
  ['/product/porta-cabins/porta-cabin-office', '/product/porta-cabins/portacabin-office'],
  ['/product/porta-cabins/small-portacabin', '/product/porta-cabins/mini-porta-cabin'],
  ['/product/porta-cabins/toilet-porta-cabins', '/product/porta-cabins/porta-cabin-with-toilet'],
  ['/product/luxury-porta-cabin', '/product/porta-cabins/luxury-porta-cabin'],
  ['/product/low-cost-porta-cabin', '/product/porta-cabins/low-cost-porta-cabin'],
  ['/product/steel-porta-cabin', '/product/porta-cabins/steel-porta-cabin'],
  ['/product/porta-cabin-shop', '/product/porta-cabins/porta-cabin-shop'],
  ['/product/buy-porta-cabins', '/product/porta-cabins'],
  ['/product/porta-cabin-office', '/product/porta-cabins/portacabin-office'],
  ['/product/prefabricated-porta-cabin', '/product/porta-cabins'],
  ['/product/porta-cabin/ms-porta-cabin', '/product/porta-cabins/ms-porta-cabin'],
  ['/product/porta-cabins/porta-cabins', '/product/porta-cabins'],
  ['/product/porta-cabin-house', '/product/prefabricated-houses/porta-cabin-house'],
  ['/product-category/porta-cabins', '/product/porta-cabins'],
  ['/porta-cabin-price-a-complete-guide-2024', '/porta-cabin-price-a-complete-guide-2025'],
  ['/porta-cabin-cost-per-square-foot', '/porta-cabin-price-a-complete-guide-2025'],
  ['/porta-cabin-price-in-india', '/porta-cabin-price-a-complete-guide-2025'],
  ['/porta-cabin-costs-2024-guide', '/porta-cabin-price-a-complete-guide-2025'],
  ['/porta-cabin-office-price', '/product/porta-cabins/portacabin-office'],
  ['/porta-cabins-under-4-lakhs', '/porta-cabin-price-a-complete-guide-2025'],
  ['/porta-cabins-under-5-lakhs', '/porta-cabin-price-a-complete-guide-2025'],
  ['/porta-cabins-under-6-lakhs', '/porta-cabin-price-a-complete-guide-2025'],
  ['/product/porta-cabin/low-cost-porta-cabin', '/product/porta-cabins/low-cost-porta-cabin'],
  ['/product/porta-cabin/luxury-porta-cabin', '/product/porta-cabins/luxury-porta-cabin'],
  ['/product/porta-cabin/mini-porta-cabin', '/product/porta-cabins/mini-porta-cabin'],
  ['/product/porta-cabin/portacabin-office', '/product/porta-cabins/portacabin-office'],
  ['/product/porta-cabin/porta-cabins', '/product/porta-cabins'],
  ['/product/porta-cabin/porta-cabin-shop', '/product/porta-cabins/porta-cabin-shop'],
  ['/product/porta-cabin/porta-cabin-with-toilet', '/product/porta-cabins/porta-cabin-with-toilet'],
  ['/product/porta-cabin/steel-porta-cabin', '/product/porta-cabins/steel-porta-cabin'],
];

const normalize = value => {
  try {
    const pathname = new URL(value, canonicalOrigin).pathname;
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  } catch {
    return '';
  }
};

const firstLiteral = new Map();
entries.forEach((entry, index) => {
  if (!entry || entry.has || entry.missing || typeof entry.source !== 'string') return;
  if (entry.source.includes(':') || entry.source.includes('*')) return;
  const source = normalize(entry.source);
  if (!firstLiteral.has(source)) firstLiteral.set(source, { ...entry, index });
});

const catchAllIndex = entries.findIndex(entry => entry?.source === '/product/porta-cabin/:slug*');
const configRows = expected.map(([source, destination]) => {
  const entry = firstLiteral.get(source);
  return {
    source,
    expectedDestination: destination,
    configuredDestination: entry ? normalize(entry.destination) : '',
    statusCode: entry?.statusCode || (entry?.permanent ? 308 : 307),
    index: entry?.index ?? -1,
    beforeCatchAll: !!entry && entry.index < catchAllIndex,
    pass: !!entry &&
      normalize(entry.destination) === destination &&
      entry.statusCode === 301 &&
      entry.index < catchAllIndex,
  };
});

const routeLevelSelfSlug = pathname => {
  const match = /^\/product\/([^/]+)\/\1$/.exec(pathname);
  return match ? `/product/${match[1]}` : '';
};
const chains = [];
for (const [source, entry] of firstLiteral) {
  const destination = normalize(entry.destination);
  const next = firstLiteral.get(destination);
  const routeRedirect = routeLevelSelfSlug(destination);
  if (next) {
    chains.push({ source, destination, next: normalize(next.destination), kind: 'configured' });
  } else if (routeRedirect) {
    chains.push({ source, destination, next: routeRedirect, kind: 'route-self-slug' });
  }
}

async function fetchRows() {
  if (!base) return [];
  const rows = [];
  for (const [source, expectedDestination] of [
    ...expected,
    ['/porta-cabin-cost', '/porta-cabin-price-a-complete-guide-2025'],
  ]) {
    for (const requestPath of [source, `${source}/`]) {
      const first = await fetch(`${base}${requestPath}`, { redirect: 'manual' });
      const location = first.headers.get('location') || '';
      const actualDestination = normalize(location);
      const terminalUrl = new URL(expectedDestination, base).toString();
      const terminal = await fetch(terminalUrl, { redirect: 'manual' });
      rows.push({
        source,
        requestPath,
        trailingSlash: requestPath.endsWith('/'),
        firstStatus: first.status,
        location,
        actualDestination,
        expectedDestination,
        terminalStatus: terminal.status,
        hops: first.status >= 300 && first.status < 400 && terminal.status === 200 ? 1 : null,
        pass:
          (source === '/porta-cabin-cost' ? first.status === 308 : first.status === 301) &&
          actualDestination === expectedDestination &&
          terminal.status === 200,
      });
    }
  }
  return rows;
}

const liveRows = await fetchRows();
const routeSource = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('../src/pages/product/[category]/[slug].tsx', import.meta.url), 'utf8')
);
const result = {
  expectedEventRedirects: expected.length,
  auditedWithExistingCostAlias: expected.length + 1,
  liveVariantsAudited: (expected.length + 1) * 2,
  removedWinnerSource: '/porta-cabin-price-a-complete-guide-2025',
  catchAllIndex,
  configRows,
  configFailures: configRows.filter(row => !row.pass),
  routeRejectsPortaCabin: /urlCategory\s*===\s*['"]porta-cabin['"]/.test(routeSource),
  siteWideChains: chains,
  liveRows,
  liveFailures: liveRows.filter(row => !row.pass),
};

console.log(JSON.stringify(result, null, 2));
if (
  result.configFailures.length ||
  !result.routeRejectsPortaCabin ||
  result.siteWideChains.length ||
  result.liveFailures.length
) {
  process.exitCode = 1;
}
