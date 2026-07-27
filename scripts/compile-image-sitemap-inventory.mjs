import fs from 'node:fs';
import path from 'node:path';

const [auditCsvPath, outputPath = 'src/lib/imageSitemapInventory.json'] = process.argv.slice(2);
if (!auditCsvPath) {
  throw new Error(
    'Usage: node scripts/compile-image-sitemap-inventory.mjs <audit-csv> [output-json]',
  );
}

const parseCsv = text => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows;
};

const rawRows = parseCsv(fs.readFileSync(path.resolve(auditCsvPath), 'utf8'));
const headers = rawRows.shift().map((header, index) =>
  index === 0 ? header.replace(/^\uFEFF/, '') : header
);
const requiredHeaders = [
  'Page URL',
  'Clean URL',
  'Clean URL status',
  'Element type',
  'Alt text',
  'Filename',
  'Image source path',
  'File size (KB)',
];
for (const header of requiredHeaders) {
  if (!headers.includes(header)) throw new Error(`Audit CSV is missing "${header}"`);
}

const rows = rawRows
  .filter(values => values.some(Boolean))
  .map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));

const normalizeUrl = value => new URL(value).href;
const pairs = new Map();
for (const row of rows) {
  const pageUrl = normalizeUrl(row['Page URL']);
  const imageUrl = normalizeUrl(row['Clean URL']);
  const key = `${pageUrl}\n${imageUrl}`;
  const existing = pairs.get(key) || { pageUrl, imageUrl, rows: [] };
  existing.rows.push(row);
  pairs.set(key, existing);
}

const brandMarker = /\b(?:icon|logo|favicon)\b/i;
const uniqueCount = items => new Set(items.map(item => item.imageUrl)).size;
const pageIndexabilityResolution = {
  excludedNoindexPages: [
    {
      pageUrl: 'https://www.samanportable.com/blog/search',
      robotsMeta: 'noindex, follow',
      xRobotsTag: null,
      canonical: 'https://www.samanportable.com/blog/search',
    },
    {
      pageUrl: 'https://www.samanportable.com/my-orders',
      robotsMeta: 'noindex, nofollow',
      xRobotsTag: null,
      canonical: null,
    },
  ],
  retainedPageSitemapGaps: [
    {
      pageUrl: 'https://www.samanportable.com/product-category/container-offices',
      robotsMeta: 'index, follow',
      xRobotsTag: null,
      canonical: 'https://www.samanportable.com/product-category/container-offices',
    },
  ],
};
const noindexPageUrls = new Set(
  pageIndexabilityResolution.excludedNoindexPages.map(page => page.pageUrl),
);
const exclusions = {
  decorativeAltEmpty: [],
  iconsLogosUnder5KB: [],
  cleanPathNot200: [],
  pageNoindex: [],
};
const included = [];

for (const pair of pairs.values()) {
  const statuses = new Set(pair.rows.map(row => row['Clean URL status']));
  const broken = statuses.size !== 1 || !statuses.has('200');
  const renderedRows = pair.rows.filter(row => row['Element type'] !== 'schema-only');
  const decorative = renderedRows.length > 0
    && renderedRows.every(row => row['Alt text'] === '');
  const iconOrLogoUnder5KB = pair.rows.some(row => {
    const size = Number.parseFloat(row['File size (KB)']);
    const labels = `${row.Filename} ${row['Image source path']} ${row['Alt text']}`;
    return Number.isFinite(size) && size < 5 && brandMarker.test(labels);
  });

  if (noindexPageUrls.has(pair.pageUrl)) {
    exclusions.pageNoindex.push(pair);
  } else if (decorative) {
    exclusions.decorativeAltEmpty.push(pair);
  } else if (iconOrLogoUnder5KB) {
    exclusions.iconsLogosUnder5KB.push(pair);
  } else if (broken) {
    exclusions.cleanPathNot200.push(pair);
  } else {
    included.push(pair);
  }
}

const pageMap = new Map();
for (const pair of included) {
  const imageUrls = pageMap.get(pair.pageUrl) || [];
  imageUrls.push(pair.imageUrl);
  pageMap.set(pair.pageUrl, imageUrls);
}

const entries = [...pageMap.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([pageUrl, imageUrls]) => ({
    pageUrl,
    imageUrls: [...new Set(imageUrls)].sort(),
  }));

const renderedPairCount = included.filter(pair =>
  pair.rows.some(row => row['Element type'] !== 'schema-only'),
).length;
const schemaOnlyPairCount = included.length - renderedPairCount;

const inventory = {
  generatedFrom: 'site-wide image SEO audit, 27 July 2026',
  sourceBaselineCommit: '6c3d82570c8b56387de40159aacc55185a4e7dfd',
  targetBaselineCommit: 'dd315fa543c479619df75bcfcaabec99e6d6b4d8',
  pageSitemapCount: 459,
  auditedOccurrenceCount: rows.length,
  auditedPageImageAssociationCount: pairs.size,
  includedPageCount: entries.length,
  includedImageAssociationCount: included.length,
  includedRenderedAssociationCount: renderedPairCount,
  includedSchemaAssociationCount: schemaOnlyPairCount,
  includedUniqueImageCount: uniqueCount(included),
  pageIndexabilityResolution,
  exclusions: Object.fromEntries(
    Object.entries(exclusions).map(([reason, items]) => [
      reason,
      {
        associationCount: items.length,
        uniqueImageCount: uniqueCount(items),
        entries: items.map(({ pageUrl, imageUrl }) => ({ pageUrl, imageUrl })),
      },
    ]),
  ),
  entries,
};

const resolvedOutput = path.resolve(outputPath);
fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
fs.writeFileSync(resolvedOutput, `${JSON.stringify(inventory, null, 2)}\n`);
console.log(JSON.stringify({
  output: resolvedOutput,
  includedPageCount: inventory.includedPageCount,
  includedImageAssociationCount: inventory.includedImageAssociationCount,
  includedUniqueImageCount: inventory.includedUniqueImageCount,
  exclusions: Object.fromEntries(
    Object.entries(inventory.exclusions).map(([reason, value]) => [
      reason,
      value.associationCount,
    ]),
  ),
}, null, 2));
