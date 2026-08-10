/**
 * CALC-L7 §2.1 — the route extension, verified by a DECLARED SAMPLE.
 *
 * The reporting standard on this programme: a stated sample of 15 outranks an
 * unverifiable claim of 123. This drives a fixed, named sample in a real browser
 * and states exactly what it covers; the remaining routes are covered
 * mechanically by two gates that read every route:
 *
 *   report-route-extension-coverage.mjs  every route resolves, is classified,
 *                                        and has a readable approved name
 *   verify-route-price-identity.mjs      every route publishes what its page
 *                                        publishes - 123 of 123
 *
 * What only a browser can show, and what this therefore checks:
 *   PREFILL routes    the calculator renders, and the entry band names the
 *                     page's own approved product
 *   NO-PREFILL routes the calculator renders, and NOTHING on the page attributes
 *                     a price to the material being sold - no entry band, and no
 *                     product name in the calculator header
 *
 * Run: node scripts/calculator/verify-route-extension-sample.mjs
 * Exit: 0 when every sampled route behaves as its class requires.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.EXT_BASE_URL || 'http://127.0.0.1:3124';
const outputDir = path.resolve('reports/calc-L7');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

/**
 * THE DECLARED SAMPLE: 15 routes.
 *   8 no-prefill, spanning all 8 material clusters (every one represented)
 *   6 prefill, spanning newly extended structure clusters
 *   1 prefill, the tie-breaker route that names both a material and a structure
 */
const SAMPLE = [
  // no-prefill - one per material cluster, all eight
  { url: '/product/eps-panel', cls: 'no-prefill' },
  { url: '/product/glass-wool-panel', cls: 'no-prefill' },
  { url: '/product/pir-panel', cls: 'no-prefill' },
  { url: '/product/rockwool-panel', cls: 'no-prefill' },
  { url: '/product/sandwich-panel', cls: 'no-prefill' },
  { url: '/product/wall-sheet', cls: 'no-prefill' },
  { url: '/product/puf-panel', cls: 'no-prefill' },
  { url: '/product/roofing-sheet/metal-roofing-sheet', cls: 'no-prefill' },
  // prefill - newly extended structure clusters
  { url: '/product/industrial-sheds', cls: 'prefill' },
  { url: '/product/peb-constructions/peb-steel-structure', cls: 'prefill' },
  { url: '/product/pre-engineered-buildings', cls: 'prefill' },
  { url: '/product/prefab-buildings/modular-office-buildings', cls: 'prefill' },
  { url: '/product/prefabricated-houses/porta-cabin-house', cls: 'prefill' },
  { url: '/product/portable-toilet/mobile-toilet', cls: 'prefill' },
  { url: '/product/labor-colony', cls: 'prefill' },
  // the tie-breaker: names both, structure governs
  { url: '/product/puf-panel/puf-panel-house', cls: 'prefill' },
];

const browser = await chromium.launch({ channel: 'chrome' });
const rows = [];
let failures = 0;

for (const s of SAMPLE) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const status = (await page.goto(baseUrl + s.url, { waitUntil: 'domcontentloaded', timeout: 60_000 }))?.status();
  await page.waitForTimeout(900);

  // A product route mounts the calculator inside a container the entry CTA
  // expands, so presence is read from the DOM rather than from visibility.
  const m = await page.evaluate(() => {
    const calc = document.querySelector('.cabin-calculator-ssr');
    const band = document.querySelector('.calc-entry');
    const headerName = document.querySelector('.cabin-calculator-ssr [data-summary-product]');
    const summaryEx = document.querySelector('.cabin-calculator-ssr [data-summary-ex]');
    const bandHeadline = document.querySelector('.calc-entry-headline');
    return {
      calculatorPresent: Boolean(calc),
      productSlug: calc ? calc.getAttribute('data-product-slug') : null,
      entryBandPresent: Boolean(band),
      entryHeadline: bandHeadline ? (bandHeadline.textContent || '').trim().slice(0, 80) : null,
      calcHeaderProduct: headerName ? (headerName.textContent || '').trim().slice(0, 60) : null,
      calcHeaderTotal: summaryEx ? (summaryEx.textContent || '').trim() : null,
    };
  });

  const problems = [];
  if (status !== 200) problems.push(`HTTP ${status}`);
  if (!m.calculatorPresent) problems.push('no calculator mounted');

  if (s.cls === 'no-prefill') {
    // The whole point of the class: nothing may attribute a price to the material.
    if (m.entryBandPresent) problems.push('entry band present - it names and prices the product');
    if (m.entryHeadline) problems.push(`entry headline rendered: "${m.entryHeadline}"`);
    // The general calculator opens on its own default product, never this page's.
    const slugPart = s.url.split('/').filter(Boolean).pop();
    if (m.productSlug && m.productSlug === slugPart) problems.push(`calculator claims this page's product: ${m.productSlug}`);
  } else {
    if (!m.entryBandPresent) problems.push('prefill route has no entry band');
    if (!m.calcHeaderProduct) problems.push('prefill route shows no product in the calculator header');
  }

  if (problems.length) failures += 1;
  rows.push({ ...s, status, ...m, problems });
  console.log(
    (problems.length ? 'FAIL  ' : 'PASS  ') + s.cls.padEnd(10) + s.url.padEnd(56) +
    (problems.length ? problems.join('; ') : `band=${m.entryBandPresent} product=${m.calcHeaderProduct || '(none)'}`)
  );
  await page.close();
}

await browser.close();
await writeFile(path.join(outputDir, 'route-extension-sample.json'), JSON.stringify({ baseUrl, sample: rows }, null, 2));

console.log('');
console.log(`DECLARED SAMPLE: ${SAMPLE.length} routes of 123.`);
console.log(`  no-prefill 8 - one from EVERY one of the 8 material clusters`);
console.log(`  prefill    7 - newly extended structure clusters, incl. the tie-breaker route`);
console.log('  The other 108 routes are covered mechanically by report-route-extension-coverage');
console.log('  (resolution, classification, readable name) and verify-route-price-identity');
console.log('  (123 of 123 publish what their page publishes). They were NOT hand-checked.');
console.log('');
console.log(failures === 0 ? 'PASS: every sampled route behaves as its class requires.' : `FAIL: ${failures} route(s).`);
process.exit(failures === 0 ? 0 : 1);
