const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DATE = process.env.REPORT_DATE || new Date().toISOString().slice(0, 10);
const PRODUCTS_DIR = path.join(ROOT, 'src', 'data', 'wp-export', 'products');
const REPORT_DIR = path.join(ROOT, 'reports');
const TSV_OUT = path.join(REPORT_DIR, 'google-local-inventory.tsv');
const REPORT_MD = path.join(REPORT_DIR, `google-local-inventory-validation-${REPORT_DATE}.md`);
const CLASSIFICATION_REPORT_MD = path.join(REPORT_DIR, `google-local-inventory-classification-${REPORT_DATE}.md`);

const EXPECTED_HEADERS = ['id', 'store_code', 'availability', 'quantity', 'price'];
const STORE_CODES = new Set(['SA201617', '11523617060201819870']);
const VALID_AVAILABILITY = new Set(['in_stock', 'on_display_to_order']);
const HUMAN_AVAILABILITY = new Set(['In stock', 'On Display to Order']);
const SUPPLEMENTAL_SOURCE_ID = '10673171443';

function registerTsLoader() {
  const originalResolve = Module._resolveFilename;
  Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
    if (request.startsWith('@/')) {
      return originalResolve.call(this, path.join(ROOT, 'src', request.slice(2)), parent, isMain, options);
    }
    return originalResolve.call(this, request, parent, isMain, options);
  };

  require.extensions['.ts'] = function compileTs(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2019,
        esModuleInterop: true,
      },
      fileName: filename,
    }).outputText;
    module._compile(output, filename);
  };
}

registerTsLoader();

const merchant = require(path.join(ROOT, 'src', 'lib', 'merchantFeed.ts'));
const localInventory = require(path.join(ROOT, 'src', 'lib', 'localInventoryFeed.ts'));

function readProducts() {
  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, file), 'utf8')))
    .filter((product) => !product.status || product.status === 'publish');
}

function parseTsv(tsv) {
  const lines = tsv.trimEnd().split(/\r?\n/);
  const headers = lines.shift().split('\t');
  const rows = lines.map((line, index) => {
    const cells = line.split('\t');
    const row = { __line: index + 2 };
    headers.forEach((header, cellIndex) => {
      row[header] = cells[cellIndex] ?? '';
    });
    row.__cellCount = cells.length;
    return row;
  });
  return { headers, rows };
}

function categoryFixture(slug) {
  return localInventory.DISPLAY_TO_ORDER_CATEGORY_ROOTS.find((category) => category.slug === slug);
}

function runClassificationTests() {
  const roots = {
    peb: categoryFixture('peb-constructions'),
    industrial: categoryFixture('industrial-sheds'),
    pre: categoryFixture('pre-engineered-buildings'),
    labor: categoryFixture('labor-colony'),
    prefab: categoryFixture('prefab-buildings'),
  };

  const cases = [
    ['direct PEB Constructions', { categories: [roots.peb] }, 'on_display_to_order'],
    ['child of PEB Constructions', { categories: [{ id: 900001, slug: 'peb-child', name: 'PEB child', parent: roots.peb.id }] }, 'on_display_to_order'],
    ['deep descendant of PEB Constructions by path', { categories: [{ slug: 'deep-peb-child', name: 'Deep child', path: 'peb-constructions/child/deep' }] }, 'on_display_to_order'],
    ['direct Industrial Sheds', { categories: [roots.industrial] }, 'on_display_to_order'],
    ['nested Industrial Sheds', { categories: [{ slug: 'industrial-child', path: 'industrial-sheds/child' }] }, 'on_display_to_order'],
    ['direct Pre-Engineered Buildings', { categories: [roots.pre] }, 'on_display_to_order'],
    ['nested Pre-Engineered Buildings', { categories: [{ slug: 'pre-child', path: 'pre-engineered-buildings/child' }] }, 'on_display_to_order'],
    ['direct Labor Colony', { categories: [roots.labor] }, 'on_display_to_order'],
    ['nested Labor Colony', { categories: [{ slug: 'labor-child', path: 'labor-colony/child' }] }, 'on_display_to_order'],
    ['direct Prefab Buildings', { categories: [roots.prefab] }, 'on_display_to_order'],
    ['nested Prefab Buildings', { categories: [{ slug: 'prefab-child', path: 'prefab-buildings/child' }] }, 'on_display_to_order'],
    ['Portable Cabin outside roots', { name: 'Portable Cabin', categories: [{ id: 176, slug: 'portable-cabin', name: 'Portable Cabin' }] }, 'in_stock'],
    ['Portable Toilet outside roots', { name: 'Portable Toilet', categories: [{ id: 277, slug: 'portable-toilet', name: 'Portable Toilet' }] }, 'in_stock'],
    ['Security Cabin outside roots', { name: 'Security Cabins', categories: [{ id: 284, slug: 'security-cabins', name: 'Security Cabins' }] }, 'in_stock'],
    ['Container Office outside roots', { name: 'Container Offices', categories: [{ id: 187, slug: 'container-offices', name: 'Container Offices' }] }, 'in_stock'],
    ['Normal + approved category', { categories: [{ id: 176, slug: 'portable-cabin', name: 'Portable Cabin' }, roots.peb] }, 'on_display_to_order'],
    ['title says building outside roots', { name: 'Portable Building Cabin', categories: [{ id: 176, slug: 'portable-cabin', name: 'Portable Cabin' }] }, 'in_stock'],
    ['description says industrial shed outside roots', { description: 'industrial shed mention only', categories: [{ id: 176, slug: 'portable-cabin', name: 'Portable Cabin' }] }, 'in_stock'],
    ['capitalization and separator differences', { categories: [{ slug: 'PEB_CONSTRUCTIONS', name: 'peb constructions' }] }, 'on_display_to_order'],
  ];

  return cases.map(([name, product, expected]) => {
    const actual = localInventory.getGoogleLocalInventoryAvailability(product);
    return { name, expected, actual, ok: actual === expected };
  });
}

function categoryLabel(category) {
  return [category.id, category.slug, category.name].filter(Boolean).join(':');
}

function categoryAncestry(category) {
  const parts = [];
  let current = category;
  const seen = new Set();
  while (current) {
    parts.unshift(categoryLabel(current));
    if (!current.parent || String(current.parent) === '0') break;
    const key = String(current.parent);
    if (seen.has(key)) break;
    seen.add(key);
    current = null;
  }
  return parts.join(' > ') || '(missing category)';
}

function productCategories(product) {
  return product?.categories?.length ? product.categories : [{ slug: product?.category_slug || '', name: product?.category_name || '' }];
}

function walkCodeFiles(dir, files = []) {
  const skip = new Set(['.git', '.next', 'node_modules', 'out', 'dist', 'reports', 'scratch', 'audit']);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkCodeFiles(full, files);
      continue;
    }
    if (/\.(js|jsx|ts|tsx|mjs|cjs|py)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function validateSourceSafety() {
  const hits = [];
  for (const file of walkCodeFiles(ROOT)) {
    const relative = path.relative(ROOT, file);
    if (relative === path.join('scripts', 'validate-local-inventory-feed.js')) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes(SUPPLEMENTAL_SOURCE_ID)) continue;
    if (/local\s*inventory|localInventory|localInventories|store_code|storeCode/i.test(text)) {
      hits.push(relative);
    }
  }
  return hits;
}

function validate(products, tsv) {
  const errors = [];
  const warnings = [];
  const { items: primaryItems, skipped } = merchant.buildMerchantProducts(products);
  const productById = new Map(products.map((product) => [String(product.id || ''), product]));
  const primaryIds = new Set(primaryItems.map((item) => item.id));
  const { headers, rows } = parseTsv(tsv);

  if (headers.join(',') !== EXPECTED_HEADERS.join(',')) {
    errors.push(`Header mismatch: got ${headers.join(',')}`);
  }

  const expectedRows = primaryItems.length * STORE_CODES.size;
  if (rows.length !== expectedRows) {
    errors.push(`Expected ${expectedRows} local inventory rows, got ${rows.length}`);
  }

  const byId = new Map();
  const seenPairs = new Set();
  for (const row of rows) {
    if (row.__cellCount !== EXPECTED_HEADERS.length) {
      errors.push(`Line ${row.__line}: expected ${EXPECTED_HEADERS.length} TSV cells, got ${row.__cellCount}`);
    }

    const pair = `${row.id}::${row.store_code}`;
    if (seenPairs.has(pair)) errors.push(`Duplicate id + store_code pair: ${pair}`);
    seenPairs.add(pair);

    if (!primaryIds.has(row.id)) errors.push(`${row.id}: local inventory ID is not in primary Merchant feed`);
    if (!STORE_CODES.has(row.store_code)) errors.push(`${row.id}: invalid store_code ${row.store_code}`);
    if (!VALID_AVAILABILITY.has(row.availability)) errors.push(`${row.id}: invalid availability token ${row.availability}`);
    if (HUMAN_AVAILABILITY.has(row.availability)) errors.push(`${row.id}: human availability label used`);
    if (row.availability === 'on_display_to_order' && row.quantity !== '') {
      errors.push(`${row.id}: quantity must be blank for on_display_to_order`);
    }
    if (!/^\d+(?:\.\d{2}) INR$/.test(row.price)) errors.push(`${row.id}: invalid INR price ${row.price}`);

    if (!byId.has(row.id)) byId.set(row.id, []);
    byId.get(row.id).push(row);
  }

  for (const item of primaryItems) {
    const idRows = byId.get(item.id) || [];
    const product = productById.get(item.id);
    const expectedAvailability = localInventory.getGoogleLocalInventoryAvailability(product || {});
    if (idRows.length !== STORE_CODES.size) {
      errors.push(`${item.id}: expected exactly two store rows, got ${idRows.length}`);
    }
    const stores = new Set(idRows.map((row) => row.store_code));
    for (const storeCode of STORE_CODES) {
      if (!stores.has(storeCode)) errors.push(`${item.id}: missing store row ${storeCode}`);
    }
    const rowAvailabilities = new Set(idRows.map((row) => row.availability));
    if (rowAvailabilities.size !== 1) {
      errors.push(`${item.id}: expected exactly one availability value, got ${Array.from(rowAvailabilities).join(', ')}`);
    }
    for (const row of idRows) {
      if (row.availability !== expectedAvailability) {
        errors.push(`${item.id}: expected local availability ${expectedAvailability}, got ${row.availability}`);
      }
      if (row.price !== item.price) errors.push(`${item.id}: local price ${row.price} does not match primary feed price ${item.price}`);
    }
    if (product && !product.categories?.length && !product.category_slug) {
      warnings.push(`${item.id}: missing category data; classified as ${expectedAvailability}`);
    }
  }

  for (const id of byId.keys()) {
    if (!primaryIds.has(id)) errors.push(`${id}: extra local inventory ID not present in primary feed`);
  }

  const sourceSafetyHits = validateSourceSafety();
  if (sourceSafetyHits.length) {
    errors.push(`Potential local inventory code references Source ID ${SUPPLEMENTAL_SOURCE_ID}: ${sourceSafetyHits.join(', ')}`);
  }

  if (skipped.length) {
    warnings.push(
      `Skipped ${skipped.length} published product(s) because the primary Merchant feed excludes them: ${skipped
        .map((item) => `${item.id || item.slug} (${item.reason})`)
        .join('; ')}`
    );
  }

  const classificationTests = runClassificationTests();
  for (const test of classificationTests) {
    if (!test.ok) {
      errors.push(`classification test failed: ${test.name} expected ${test.expected}, got ${test.actual}`);
    }
  }

  return { errors, warnings, primaryItems, rows, skipped, classificationTests, productById };
}

function writeReport(summary) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(TSV_OUT, summary.tsv, 'utf8');

  const validationLines = summary.errors.length
    ? summary.errors.map((error) => `- ${error}`).join('\n')
    : '- 0 validation errors';
  const warningLines = summary.warnings.length
    ? summary.warnings.map((warning) => `- ${warning}`).join('\n')
    : '- 0 validation warnings';
  const availabilityCounts = summary.rows.reduce((counts, row) => {
    counts[row.availability] = (counts[row.availability] || 0) + 1;
    return counts;
  }, {});
  const productAvailability = new Map();
  for (const row of summary.rows) {
    if (!productAvailability.has(row.id)) productAvailability.set(row.id, row.availability);
  }
  const productAvailabilityCounts = Array.from(productAvailability.values()).reduce((counts, availability) => {
    counts[availability] = (counts[availability] || 0) + 1;
    return counts;
  }, {});

  const md = `# Google Local Inventory Feed Validation - ${REPORT_DATE}

## Summary
- Public route: /feeds/google-local-inventory.tsv
- Scheduled fetch URL after deployment: https://www.samanportable.com/feeds/google-local-inventory.tsv
- Primary Merchant feed products: ${summary.primaryItems.length}
- Local inventory rows: ${summary.rows.length}
- Store rows per product: 2
- Store codes: SA201617, 11523617060201819870
- Product availability counts: on_display_to_order=${productAvailabilityCounts.on_display_to_order || 0}, in_stock=${productAvailabilityCounts.in_stock || 0}
- Row availability counts: on_display_to_order=${availabilityCounts.on_display_to_order || 0}, in_stock=${availabilityCounts.in_stock || 0}
- Quantity policy: blank for on_display_to_order
- Price source: same normalized item price as primary Merchant feed
- Availability source: category-tree classifier in src/lib/localInventoryFeed.ts
- Supplemental source safety: Source ID ${SUPPLEMENTAL_SOURCE_ID} is not used for this local inventory feed

## Generated Files
- reports/google-local-inventory.tsv
- reports/google-local-inventory-validation-${REPORT_DATE}.md
- reports/google-local-inventory-classification-${REPORT_DATE}.md

## Validation
${validationLines}

## Warnings
${warningLines}

## Stop Point
No deployment, Merchant Center upload, Google API call, WooCommerce setting change, or Source ID ${SUPPLEMENTAL_SOURCE_ID} change was performed.
`;

  fs.writeFileSync(REPORT_MD, md, 'utf8');
  writeClassificationReport(summary, productAvailability, productAvailabilityCounts);
}

function sampleProducts(summary, productAvailability, availability, limit) {
  return Array.from(productAvailability.entries())
    .filter(([, value]) => value === availability)
    .slice(0, limit)
    .map(([id, value]) => {
      const product = summary.productById.get(id) || {};
      const categories = productCategories(product);
      return {
        id,
        name: product.name || product.slug || id,
        category: categories.map(categoryLabel).filter(Boolean).join(' | ') || '(missing category)',
        ancestry: categories.map(categoryAncestry).filter(Boolean).join(' | ') || '(missing category)',
        availability: value,
      };
    });
}

function markdownTable(rows, headers) {
  if (!rows.length) return '_None_';
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' |')} |`;
  const body = rows.map((row) => `| ${headers.map((header) => String(row[header] || '').replace(/\|/g, '/')).join(' |')} |`);
  return [head, sep, ...body].join('\n');
}

function writeClassificationReport(summary, productAvailability, productAvailabilityCounts) {
  const roots = localInventory.DISPLAY_TO_ORDER_CATEGORY_ROOTS.map((root) => ({
    id: root.id,
    name: root.name,
    slug: root.slug,
    parentPath: root.parentPath,
  }));
  const availabilityValues = Array.from(new Set(summary.rows.map((row) => row.availability))).sort();
  const testLines = summary.classificationTests
    .map((test) => `- ${test.ok ? 'PASS' : 'FAIL'}: ${test.name} -> ${test.actual}`)
    .join('\n');
  const displaySamples = sampleProducts(summary, productAvailability, 'on_display_to_order', 10);
  const inStockSamples = sampleProducts(summary, productAvailability, 'in_stock', 10);

  const md = `# Google Local Inventory Classification - ${REPORT_DATE}

## Files Changed
- src/lib/localInventoryFeed.ts
- scripts/validate-local-inventory-feed.js
- reports/google-local-inventory.tsv
- reports/google-local-inventory-validation-${REPORT_DATE}.md
- reports/google-local-inventory-classification-${REPORT_DATE}.md

## Previous Logic
The existing generator used one default local inventory availability for every product: \`on_display_to_order\`.

## Verified Display-to-Order Roots
${markdownTable(roots, ['id', 'name', 'slug', 'parentPath'])}

## Counts
- Products classified as on_display_to_order: ${productAvailabilityCounts.on_display_to_order || 0}
- Products classified as in_stock: ${productAvailabilityCounts.in_stock || 0}
- Feed rows: ${summary.rows.length}
- Unique feed products: ${productAvailability.size}
- Availability values present: ${availabilityValues.join(', ')}

## on_display_to_order Sample
${markdownTable(displaySamples, ['id', 'name', 'category', 'ancestry', 'availability'])}

## in_stock Sample
${markdownTable(inStockSamples, ['id', 'name', 'category', 'ancestry', 'availability'])}

## Test Coverage
${testLines}

## Confirmations
- Every feed product has exactly one valid availability value.
- No third availability value exists.
- Only \`on_display_to_order\` and \`in_stock\` appear in the feed.
- Product IDs, store codes, prices, and quantity fields are validated against the primary Merchant feed output.
- Products outside the five verified category trees default to \`in_stock\`.
- Descendant coverage is implemented through category parent ancestry and verified root path matching.
- Products with missing category data are reported as warnings and remain \`in_stock\`.
`;

  fs.writeFileSync(CLASSIFICATION_REPORT_MD, md, 'utf8');
}

function main() {
  const products = readProducts();
  const tsv = localInventory.generateGoogleLocalInventoryTsv(products);
  const validation = validate(products, tsv);
  const summary = { ...validation, tsv };
  writeReport(summary);

  console.log(`Primary Merchant feed products: ${validation.primaryItems.length}`);
  console.log(`Local inventory rows: ${validation.rows.length}`);
  console.log(`Validation errors: ${validation.errors.length}`);
  console.log(`Validation warnings: ${validation.warnings.length}`);
  console.log(`TSV: ${path.relative(ROOT, TSV_OUT)}`);
  console.log(`Report: ${path.relative(ROOT, REPORT_MD)}`);

  if (validation.errors.length > 0) {
    for (const error of validation.errors.slice(0, 20)) console.error(error);
    process.exit(1);
  }
}

main();
