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

const EXPECTED_HEADERS = ['id', 'store_code', 'availability', 'quantity', 'price'];
const STORE_CODES = new Set(['SA201617', '11523617060201819870']);
const VALID_AVAILABILITY = new Set(['in_stock', 'limited_availability', 'on_display_to_order', 'out_of_stock']);
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

function walkCodeFiles(dir, files = []) {
  const skip = new Set(['.git', '.next', 'node_modules', 'out', 'dist', 'reports']);
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
    if (idRows.length !== STORE_CODES.size) {
      errors.push(`${item.id}: expected exactly two store rows, got ${idRows.length}`);
    }
    const stores = new Set(idRows.map((row) => row.store_code));
    for (const storeCode of STORE_CODES) {
      if (!stores.has(storeCode)) errors.push(`${item.id}: missing store row ${storeCode}`);
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

  return { errors, warnings, primaryItems, rows, skipped };
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

  const md = `# Google Local Inventory Feed Validation - ${REPORT_DATE}

## Summary
- Public route: /feeds/google-local-inventory.tsv
- Scheduled fetch URL after deployment: https://www.samanportable.com/feeds/google-local-inventory.tsv
- Primary Merchant feed products: ${summary.primaryItems.length}
- Local inventory rows: ${summary.rows.length}
- Store rows per product: 2
- Store codes: SA201617, 11523617060201819870
- Default availability: on_display_to_order
- Quantity policy: blank for on_display_to_order
- Price source: same normalized item price as primary Merchant feed
- Supplemental source safety: Source ID ${SUPPLEMENTAL_SOURCE_ID} is not used for this local inventory feed

## Generated Files
- reports/google-local-inventory.tsv
- reports/google-local-inventory-validation-${REPORT_DATE}.md

## Validation
${validationLines}

## Warnings
${warningLines}

## Stop Point
No deployment, Merchant Center upload, Google API call, WooCommerce setting change, or Source ID ${SUPPLEMENTAL_SOURCE_ID} change was performed.
`;

  fs.writeFileSync(REPORT_MD, md, 'utf8');
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
