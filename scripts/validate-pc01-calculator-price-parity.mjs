import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const VALIDATOR_INVARIANT_ID = 'PC01_REL06C_R_PRICE_PARITY_V1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const EXPECTED = [
  { sizeSlug: '10x10', priceExGst: 143750, priceInclGst: 169625 },
  { sizeSlug: '20x8', priceExGst: 220000, priceInclGst: 259600 },
  { sizeSlug: '20x10', priceExGst: 250000, priceInclGst: 295000 },
  { sizeSlug: '20x12', priceExGst: 288000, priceInclGst: 339840 },
  { sizeSlug: '30x10', priceExGst: 360000, priceInclGst: 424800 },
  { sizeSlug: '40x10', priceExGst: 475000, priceInclGst: 560500 },
];

const FILES = {
  product: 'src/data/products/porta-cabins.json',
  ladders: 'src/lib/calculatorLadders.ts',
  rates: 'src/lib/calculatorRates.ts',
  componentRates: 'src/lib/calculatorComponentRates.ts',
  tax: 'src/lib/taxRates.ts',
  server: 'src/lib/cabinCalculatorSSR.ts',
  browser: 'public/scripts/cabin-cost-calculator.js',
  estimateApi: 'src/pages/api/cabin-estimate-pdf.ts',
  estimateDocument: 'src/lib/cabinEstimateDocument.ts',
  validator: 'scripts/validate-pc01-calculator-price-parity.mjs',
};

const PROTECTED_NORMALIZED_SHA256 = {
  product: 'f662c379b89f9bb291c1f89cdfe920210788a054e392e7aad5e461e78b69ae2b',
  // PO-04 (5 Sep 2026): bumped for one added ROUTE_LADDERS key,
  // 'executive-portable-office': toRows(executivePortableOffice), plus its import.
  // This hash is a tamper tripwire on the pricing machinery; every PC-01 protection
  // in this file is unchanged and still enforced - the porta-cabins ladder is still
  // asserted to derive from its own product record, the six published prices are
  // still checked against porta-cabins.json, and the live per-variant calculator
  // computation below still runs. No rate, formula, tax or component price moved.
  // PO-05 (5 Sep 2026): re-pinned. calculatorLadders.ts changed by exactly one additive
  // ROUTE_LADDERS entry plus its import ('portable-mobile-laboratory', toRows of that
  // route's own product JSON). Verified against the branch point 3c538299: 40 -> 41 keys,
  // the added key is 'portable-mobile-laboratory' and NOTHING was removed; the whole diff
  // is five added lines (one import, three comment lines, one entry) and zero modified or
  // deleted lines, so no existing route's ladder rows, rates, GST or published prices
  // changed. This pin is a tamper tripwire only - every substantive PC-01 assertion below
  // (the live per-variant calculator computation, and the six published prices checked
  // against porta-cabins.json) is separate and still runs unchanged.
  ladders: '4225b1be7cb70704f525e2fc6aae4f3ec9caa3df371cd5118eeff2e5a1215338',
  rates: 'db62c8be57eeb09025d208df87b05ab9aac02f4183ac0e4a324f49c56291ba48',
  componentRates: '0e2c0e49ecbef688f8a262993cf7750155a5f9976209edddca3fcf4a434518dc',
  tax: 'da95cc10d8e2a5bb20bd9589630bcb1c4ad09fa1d53cfdbe32cd89c094579294',
  estimateApi: '4396bc6f8be77bc101e7c2f03f0fd1506993ce9df9d389df048a4524ccdcdf5c',
  estimateDocument: '40b4372df4eacae970d85c8a4291e38947af57ab4e1fc3214cc7e9f96f06c862',
};

function normalized(value) {
  return value.replaceAll('\r\n', '\n');
}

function sha256(value) {
  return crypto.createHash('sha256').update(normalized(value)).digest('hex');
}

export function readSnapshot(root = ROOT) {
  return Object.fromEntries(
    Object.entries(FILES).map(([key, relative]) => [key, fs.readFileSync(path.join(root, relative), 'utf8')])
  );
}

export function validateStaticSnapshot(snapshot) {
  const invariantDeclaration = "export const VALIDATOR_INVARIANT_ID = 'PC01_REL06C_R_PRICE_PARITY_V1';";
  assert.equal(snapshot.validator.split(invariantDeclaration).length - 1, 2, 'validator invariant changed');

  for (const [key, expectedHash] of Object.entries(PROTECTED_NORMALIZED_SHA256)) {
    assert.equal(sha256(snapshot[key]), expectedHash, `${FILES[key]} protected bytes changed`);
  }

  const product = JSON.parse(snapshot.product);
  assert.equal(product.variants?.length, 6, 'expected exactly six PC-01 variants');
  assert.deepEqual(
    product.variants.map(({ sizeSlug, priceExGst, priceInclGst }) => ({ sizeSlug, priceExGst, priceInclGst })),
    EXPECTED,
    'PC-01 size order or published prices changed'
  );
  assert.equal(product.gstPercent, 18, 'PC-01 GST changed');

  const prices = product.variants.map((variant) => variant.priceExGst);
  assert.equal(Math.min(...prices), 143750, 'AggregateOffer lowPrice changed');
  assert.equal(Math.max(...prices), 475000, 'AggregateOffer highPrice changed');
  assert.equal(prices.length, 6, 'AggregateOffer offerCount changed');

  assert.match(snapshot.ladders, /'porta-cabins':\s*toRows\(portaCabins\)/, 'PC-01 ladder is not derived from its product record');
  assert.match(snapshot.server, /usesPc01SelectedVariantPriceBase\(config\)/, 'server PC-01 authority missing');
  assert.match(snapshot.server, /ladderPriceFor\(ladderKeyFor\(config\), config\.length, config\.width\)/, 'server selected-variant lookup missing');
  assert.match(snapshot.server, /isPc01IncludedDefaultWindow\(config, window, index\)/, 'server hidden default adjustment guard missing');
  assert.match(snapshot.server, /data-selected-variant-price-base/, 'server browser-authority marker missing');
  assert.match(snapshot.server, /data-published-base-included-windows/, 'server included-default marker missing');

  assert.match(snapshot.browser, /function selectedVariantPrice\(root, length, width\)/, 'browser selected-variant lookup missing');
  assert.match(snapshot.browser, /querySelectorAll\('\[data-published-size\]'\)/, 'browser does not consume rendered maintained rows');
  assert.match(snapshot.browser, /dataNumber\(row, 'priceExGst'/, 'browser published-price field missing');
  assert.match(snapshot.browser, /selectedVariantAuthority/, 'browser PC-01 authority missing');
  assert.match(snapshot.browser, /isPublishedBaseIncludedWindow\(root, form, type, index\)/, 'browser hidden default adjustment guard missing');

  const implementation = `${snapshot.server}\n${snapshot.browser}`;
  for (const forbidden of [...EXPECTED.map((row) => row.priceExGst), 110000, 200000]) {
    assert.ok(!new RegExp(`\\b${forbidden}\\b`).test(implementation), `duplicate or obsolete hardcoded calculator base ${forbidden}`);
  }

  assert.match(snapshot.estimateApi, /computeCalculatorEstimate\(config\)/, 'estimate API diverges from shared server result');
  assert.match(snapshot.estimateApi, /buildCabinEstimatePdf\(input\)/, 'download estimate no longer uses shared result input');
  assert.match(snapshot.estimateDocument, /estimate:/, 'estimate document contract missing');

  return { product, expected: EXPECTED };
}

function installTypeScriptLoader(root) {
  const typescript = require('typescript');
  const Module = require('node:module');
  const originalResolve = Module._resolveFilename;
  const originalTs = require.extensions['.ts'];
  const originalTsx = require.extensions['.tsx'];

  Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
    const resolvedRequest = request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request;
    return originalResolve.call(this, resolvedRequest, parent, isMain, options);
  };
  const compile = (module, filename) => {
    const source = fs.readFileSync(filename, 'utf8');
    const output = typescript.transpileModule(source, {
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
        target: typescript.ScriptTarget.ES2020,
        esModuleInterop: true,
        resolveJsonModule: true,
        jsx: typescript.JsxEmit.ReactJSX,
      },
      fileName: filename,
    }).outputText;
    module._compile(output, filename);
  };
  require.extensions['.ts'] = compile;
  require.extensions['.tsx'] = compile;

  return () => {
    Module._resolveFilename = originalResolve;
    if (originalTs) require.extensions['.ts'] = originalTs;
    else delete require.extensions['.ts'];
    if (originalTsx) require.extensions['.tsx'] = originalTsx;
    else delete require.extensions['.tsx'];
  };
}

function loadCalculator(root) {
  const restore = installTypeScriptLoader(root);
  try {
    return require(path.join(root, 'src/lib/cabinCalculatorSSR.ts'));
  } finally {
    restore();
  }
}

export function validateRoot(root = ROOT) {
  const before = readSnapshot(root);
  const { product } = validateStaticSnapshot(before);
  const calculator = loadCalculator(root);

  for (const variant of product.variants) {
    const [length, width] = variant.sizeSlug.split('x').map(Number);
    const config = {
      ...calculator.DEFAULT_CALCULATOR_CONFIG,
      productId: 'porta-cabin',
      ladderKey: 'porta-cabins',
      length,
      width,
    };
    const estimate = calculator.computeCalculatorEstimate(config);
    assert.equal(estimate.lines[0]?.amount, variant.priceExGst, `${variant.sizeSlug} server base mismatch`);
    assert.equal(estimate.totalExGst, variant.priceExGst, `${variant.sizeSlug} default pre-freight subtotal mismatch`);
    assert.equal(estimate.gst, variant.priceInclGst - variant.priceExGst, `${variant.sizeSlug} GST mismatch`);
    assert.equal(estimate.totalInclGst, variant.priceInclGst, `${variant.sizeSlug} incl-GST mismatch`);
    assert.equal(estimate.lines.length, 1, `${variant.sizeSlug} has a hidden default paid option`);

    const html = calculator.renderCabinCalculatorSSR({
      embedded: true,
      config,
      ladderKey: 'porta-cabins',
      productName: 'Porta Cabins',
    });
    assert.match(html, /data-selected-variant-price-base="true"/, `${variant.sizeSlug} browser authority absent`);
    assert.match(html, new RegExp(`data-length="${length}" data-width="${width}" data-price-ex-gst="${variant.priceExGst}"`), `${variant.sizeSlug} browser row mismatch`);
  }

  const paidWindow = {
    ...calculator.DEFAULT_CALCULATOR_CONFIG.windows[0],
    type: 'Fixed Glass',
  };
  const paidEstimate = calculator.computeCalculatorEstimate({
    ...calculator.DEFAULT_CALCULATOR_CONFIG,
    productId: 'porta-cabin',
    ladderKey: 'porta-cabins',
    length: 20,
    width: 10,
    windows: [paidWindow, calculator.DEFAULT_CALCULATOR_CONFIG.windows[1]],
  });
  assert.ok(paidEstimate.totalExGst > 250000, 'explicit paid window did not remain separate');
  assert.ok(paidEstimate.lines.some((line) => line.label.startsWith('Window 1:')), 'explicit paid window line missing');

  const freightEstimate = calculator.computeCalculatorEstimate({
    ...calculator.DEFAULT_CALCULATOR_CONFIG,
    productId: 'porta-cabin',
    ladderKey: 'porta-cabins',
    length: 20,
    width: 10,
    deliveryZone: 'Other',
    distanceKm: 100,
  });
  assert.equal(freightEstimate.lines[0].amount, 250000, 'freight replaced the published base');
  assert.ok(freightEstimate.lines.some((line) => line.label === 'Transport 100 km'), 'freight line missing');

  const other = calculator.computeCalculatorEstimate({
    ...calculator.DEFAULT_CALCULATOR_CONFIG,
    productId: 'office-cabin',
    ladderKey: 'portable-office',
    length: 20,
    width: 10,
  });
  assert.equal(other.lines[0]?.amount, 200000, 'unrelated product base changed');
  assert.equal(other.totalExGst, 210980, 'unrelated product default result changed');

  const after = readSnapshot(root);
  assert.deepEqual(after, before, 'calculator parity validation modified a source file');
  return { variants: product.variants.length, paidWindowTotal: paidEstimate.totalExGst, freightTotal: freightEstimate.totalExGst };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = validateRoot(ROOT);
    console.log('PC-01 calculator price parity validation: PASS');
    console.log(`Variants: ${result.variants}/6`);
    console.log('Bases: 143750, 220000, 250000, 288000, 360000, 475000');
    console.log('No-freight incl-GST: 169625, 259600, 295000, 339840, 424800, 560500');
  } catch (error) {
    console.error('PC-01 calculator price parity validation: FAIL');
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  }
}
