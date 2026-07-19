const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DATE = process.env.REPORT_DATE || new Date().toISOString().slice(0, 10);
const REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_MD = path.join(REPORT_DIR, `google-merchant-feed-validation-${REPORT_DATE}.md`);

// T26 — the product count is now COMPUTED, not hardcoded. It was pinned at 177
// (168 catalogue items + the flagship's 9 variant items, PACKET-C); adding the eleven
// T25 subpage variant groups moves it to 276, and pinning a literal would have to be
// re-edited by hand every time a variant group is added. The relationship is what
// matters: catalogue items + every variant item the builder emits.
const EXCLUDED_IDS = new Set(['990018', '900010']);
const FORBIDDEN_SHIPPING_FIELDS = [
  'shipping_weight',
  'shipping_length',
  'shipping_width',
  'shipping_height',
];
const AFFECTED_IMAGE_IDS = new Set([
  '990001',
  '990005',
  '990008',
  '990003',
  '990016',
  '990002',
  '990004',
  '990007',
  '990006',
]);
const PRICE_PATTERN = /^\d+(?:\.\d{2}) INR$/;

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

function textOf(item, tag) {
  const match = item.match(new RegExp(`<g:${tag}>([\\s\\S]*?)</g:${tag}>`));
  return (match?.[1] || '').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
}

function parseItems(xml) {
  return Array.from(xml.matchAll(/<item>[\s\S]*?<\/item>/g)).map((match) => match[0]);
}

function validate() {
  registerTsLoader();

  const { getAllProductsForFeed, getPortaCabinVariantData, getSubpageVariantData } = require(path.join(ROOT, 'src', 'lib', 'staticContent.ts'));
  const { generateGoogleMerchantXml, buildAllVariantItems, buildMerchantProducts, SUBPAGE_VARIANT_CONFIGS, MERCHANT_BASE_URL } = require(path.join(ROOT, 'src', 'lib', 'merchantFeed.ts'));

  // T26 — same item set the routes publish: flagship nine + eleven subpage groups.
  const variantItems = buildAllVariantItems(
    getPortaCabinVariantData(),
    getSubpageVariantData(SUBPAGE_VARIANT_CONFIGS.map((c) => c.slug))
  );
  const xml = generateGoogleMerchantXml(getAllProductsForFeed(), MERCHANT_BASE_URL, variantItems);
  const items = parseItems(xml);
  const errors = [];
  const warnings = [];
  const labelCounts = new Map();

  // Computed expectation: every catalogue item the builder accepted, plus every
  // variant item it emitted. Catches a silently dropped item without needing a literal.
  const expectedProductCount = buildMerchantProducts(getAllProductsForFeed(), MERCHANT_BASE_URL).items.length
    + variantItems.length;
  if (items.length !== expectedProductCount) {
    errors.push(`Expected ${expectedProductCount} products (catalogue + variant items), got ${items.length}`);
  }

  for (const item of items) {
    const id = textOf(item, 'id');
    const price = textOf(item, 'price');
    const image = textOf(item, 'image_link');
    const label = textOf(item, 'shipping_label');

    if (EXCLUDED_IDS.has(id)) errors.push(`${id}: excluded product is present`);
    if (!PRICE_PATTERN.test(price)) errors.push(`${id}: invalid price format ${price}`);
    if (!label) errors.push(`${id}: missing shipping_label`);
    if (label) labelCounts.set(label, (labelCounts.get(label) || 0) + 1);

    for (const field of FORBIDDEN_SHIPPING_FIELDS) {
      if (item.includes(`<g:${field}>`)) errors.push(`${id}: forbidden ${field} emitted`);
    }

    if (AFFECTED_IMAGE_IDS.has(id) && !image.startsWith('https://')) {
      errors.push(`${id}: affected product image_link is not absolute https: ${image}`);
    }
  }

  for (const id of AFFECTED_IMAGE_IDS) {
    if (!items.some((item) => textOf(item, 'id') === id)) {
      errors.push(`${id}: affected image product missing from feed`);
    }
  }

  const report = [
    `# Google Merchant Feed Validation - ${REPORT_DATE}`,
    '',
    '## Summary',
    `- Products: ${items.length}`,
    `- Forbidden shipping weight/dimension fields: ${FORBIDDEN_SHIPPING_FIELDS.join(', ')}`,
    `- Validation errors: ${errors.length}`,
    `- Validation warnings: ${warnings.length}`,
    '',
    '## Shipping Labels',
    ...Array.from(labelCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Validation',
    ...(errors.length ? errors.map((error) => `- ${error}`) : ['- 0 validation errors']),
    '',
    '## Warnings',
    ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ['- 0 validation warnings']),
    '',
    `No Merchant Center upload, Google API call, WooCommerce setting change, or Source ID 10673171443 change was performed.`,
    '',
  ].join('\n');

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_MD, report, 'utf8');

  console.log(`Merchant feed products: ${items.length}`);
  console.log(`Validation errors: ${errors.length}`);
  console.log(`Validation warnings: ${warnings.length}`);
  console.log('Shipping labels:');
  for (const [label, count] of Array.from(labelCounts.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${label}: ${count}`);
  }
  console.log(`Report: ${path.relative(ROOT, REPORT_MD)}`);

  if (errors.length > 0) {
    for (const error of errors.slice(0, 20)) console.error(error);
    process.exit(1);
  }
}

validate();
