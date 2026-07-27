import fs from 'node:fs';
import crypto from 'node:crypto';

const beforePath = process.env.C01_BEFORE_CRAWL;
const afterPath = process.env.C01_AFTER_CRAWL;
if (!beforePath || !afterPath) {
  throw new Error('Set C01_BEFORE_CRAWL and C01_AFTER_CRAWL.');
}

const before = JSON.parse(fs.readFileSync(beforePath, 'utf8'));
const after = JSON.parse(fs.readFileSync(afterPath, 'utf8'));
const afterBase = (process.env.C01_AFTER_BASE || '').replace(/\/$/, '');
const baselineDate = new Date(before.generatedAt);
const baselinePriceValidUntil = new Date(Date.UTC(
  baselineDate.getUTCFullYear() + 1,
  baselineDate.getUTCMonth(),
  baselineDate.getUTCDate(),
)).toISOString().slice(0, 10);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');

const normalizedJsonLdHash = async pathname => {
  if (!afterBase) return null;
  const response = await fetch(`${afterBase}${pathname}`);
  const html = await response.text();
  let normalizedPriceDates = 0;
  const normalize = value => {
    if (Array.isArray(value)) return value.map(normalize);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => {
      if (key === 'priceValidUntil') {
        normalizedPriceDates++;
        return [key, baselinePriceValidUntil];
      }
      return [key, normalize(child)];
    }));
  };
  const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => JSON.stringify(normalize(JSON.parse(match[1]))))
    .sort()
    .join('\n');
  return { hash: hash(jsonLd), normalizedPriceDates };
};
const survivors = [
  '/product/porta-cabins',
  '/product/porta-cabins/low-cost-porta-cabin',
  '/product/porta-cabins/luxury-porta-cabin',
  '/product/porta-cabins/steel-porta-cabin',
  '/product/porta-cabins/porta-cabin-with-toilet',
  '/product/porta-cabins/porta-cabin-shop',
  '/product/porta-cabins/mini-porta-cabin',
  '/product/porta-cabins/portacabin-office',
  '/product/porta-cabins/ms-porta-cabin',
];

const rows = await Promise.all(survivors.map(async pathname => {
  const oldPage = before.pages[pathname];
  const newPage = after.pages[pathname];
  const normalized = await normalizedJsonLdHash(pathname);
  const comparedJsonLdHash = normalized?.hash || newPage?.jsonLdHash;
  return {
    pathname,
    beforeStatus: oldPage?.status ?? null,
    afterStatus: newPage?.status ?? null,
    visibleTextChanged: oldPage?.visibleTextHash !== newPage?.visibleTextHash,
    rawJsonLdChanged: oldPage?.jsonLdHash !== newPage?.jsonLdHash,
    runtimePriceDatesNormalized: normalized?.normalizedPriceDates || 0,
    jsonLdChanged: oldPage?.jsonLdHash !== comparedJsonLdHash,
    pass:
      oldPage?.status === 200 &&
      newPage?.status === 200 &&
      oldPage.visibleTextHash === newPage.visibleTextHash &&
      oldPage.jsonLdHash === comparedJsonLdHash,
  };
}));

const result = {
  pagesCompared: rows.length,
  baselinePriceValidUntil,
  visibleTextChanges: rows.filter(row => row.visibleTextChanged).length,
  rawJsonLdChanges: rows.filter(row => row.rawJsonLdChanged).length,
  runtimePriceDatesNormalized: rows.reduce((total, row) => total + row.runtimePriceDatesNormalized, 0),
  jsonLdChanges: rows.filter(row => row.jsonLdChanged).length,
  failures: rows.filter(row => !row.pass),
  rows,
};
console.log(JSON.stringify(result, null, 2));
if (result.failures.length) process.exitCode = 1;
