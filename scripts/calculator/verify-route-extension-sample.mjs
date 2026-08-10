/**
 * CALC-L7 §2.1 — the route extension, verified by a DECLARED SAMPLE.
 *
 * The reporting standard on this programme: a stated sample of 16 outranks an
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
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Module from 'node:module';
import jitiPkg from 'jiti';

const baseUrl = process.env.EXT_BASE_URL || 'http://127.0.0.1:3124';
const outputDir = path.resolve('reports/calc-L7');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) request = path.join(SRC, request.slice(2));
  return resolveFilename.call(this, request, ...rest);
};
const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const { classifyCalculatorRoute } = jiti('./src/lib/cabinCalculatorEmbedRoutes.ts');

/**
 * THE DECLARED SAMPLE: 16 routes.
 *   8 no-prefill, spanning all 8 material clusters (every one represented)
 *   6 routes that exposed the unresolved ProductId class
 *   1 known configured prefill route
 *   1 puf-panel-house route that exposed the missing mount
 *
 * Expected behaviour is imported from the production classifier. It is never
 * copied into this gate, so a ruled reclassification changes both together.
 */
const DISCOVERY_SAMPLE_URLS = [
  // no-prefill - one per material cluster, all eight
  '/product/eps-panel',
  '/product/glass-wool-panel',
  '/product/pir-panel',
  '/product/rockwool-panel',
  '/product/sandwich-panel',
  '/product/wall-sheet',
  '/product/puf-panel',
  '/product/roofing-sheet/metal-roofing-sheet',
  // the six routes whose sample exposed the unresolved ProductId class
  '/product/industrial-sheds',
  '/product/peb-constructions/peb-steel-structure',
  '/product/pre-engineered-buildings',
  '/product/prefab-buildings/modular-office-buildings',
  '/product/prefabricated-houses/porta-cabin-house',
  '/product/portable-toilet/mobile-toilet',
  // a configured prefill control and the previously unmounted house route
  '/product/labor-colony',
  '/product/puf-panel/puf-panel-house',
];
const FRESH_CLUSTER_ROUTES = [
  '/product/container-cafe',
  '/product/container-houses',
  '/product/container-offices/shipping-container-office',
  '/product/porta-cabins',
  '/product/portable-cabin',
  '/product/portable-office',
  '/product/security-cabins',
];
const expanded = process.env.EXT_SAMPLE === 'expanded';
const full = process.env.EXT_SAMPLE === 'full';
const sitemapXml = full ? await readFile(path.join('public', 'sitemap-products.xml'), 'utf8') : '';
const FULL_ROUTE_URLS = full
  ? [...new Set([...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((match) => match[1].split('samanportable.com')[1] || '')
      .filter((url) => url.startsWith('/product/')))].sort()
  : [];
const SAMPLE_URLS = full
  ? FULL_ROUTE_URLS
  : expanded
    ? [...DISCOVERY_SAMPLE_URLS, ...FRESH_CLUSTER_ROUTES]
    : DISCOVERY_SAMPLE_URLS;
const SAMPLE = SAMPLE_URLS.map((url) => {
  const parts = url.split('/').filter(Boolean);
  const classification = classifyCalculatorRoute(parts[1], parts[2]);
  return { url, cls: classification.prefill ? 'prefill' : 'no-prefill' };
});

const browser = await chromium.launch({ channel: 'chrome' });
const rows = [];
let failures = 0;

for (const s of SAMPLE) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const status = (await page.goto(baseUrl + s.url, { waitUntil: 'domcontentloaded', timeout: 60_000 }))?.status();
  await page.waitForSelector('.cabin-calculator-ssr', { state: 'attached', timeout: 10_000 }).catch(() => null);
  await page.waitForSelector('.cabin-calculator-ssr.is-enhanced', { state: 'attached', timeout: 10_000 }).catch(() => null);
  if (s.cls === 'prefill') {
    const opener = page.locator('[data-calculator-entry] [data-copy-slot="cta"]');
    if (await opener.count()) await opener.click();
  }

  // A product route mounts the calculator inside a container the entry CTA
  // expands, so presence is read from the DOM rather than from visibility.
  const m = await page.evaluate(() => {
    const calc = document.querySelector('.cabin-calculator-ssr');
    const band = document.querySelector('.calc-entry');
    const headerName = document.querySelector('.cabin-calculator-ssr [data-summary-product]');
    const summaryEx = document.querySelector('.cabin-calculator-ssr [data-summary-ex]');
    const bandHeadline = document.querySelector('.calc-entry-headline');
    return {
      calculatorCount: document.querySelectorAll('.cabin-calculator-ssr').length,
      calculatorPresent: Boolean(calc),
      calculatorVisible: Boolean(calc && calc.getClientRects().length && !calc.closest('[hidden]')),
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
  if (m.calculatorCount !== 1) problems.push(`expected one calculator, found ${m.calculatorCount}`);
  if (!m.calculatorVisible) problems.push('calculator mounted but not visible or openable');

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
const reportName = full
  ? 'route-extension-full-browser.json'
  : expanded
    ? 'route-extension-expanded-sample.json'
    : 'route-extension-sample.json';
await writeFile(path.join(outputDir, reportName), JSON.stringify({ baseUrl, sample: rows }, null, 2));

console.log('');
console.log(`DECLARED SAMPLE: ${SAMPLE.length} routes of 123.`);
const noPrefillCount = SAMPLE.filter((route) => route.cls === 'no-prefill').length;
const prefillCount = SAMPLE.length - noPrefillCount;
console.log(`  no-prefill ${noPrefillCount} - every material cluster plus the ruled unresolved-identity routes`);
console.log(`  prefill    ${prefillCount} - configured control route(s)`);
if (expanded) console.log(`  fresh      ${FRESH_CLUSTER_ROUTES.length} - one route from every cluster absent from the discovery sample`);
if (full) console.log('  full set   every product route read from sitemap-products.xml');
console.log(`  The other ${123 - SAMPLE.length} routes are covered mechanically by report-route-extension-coverage`);
console.log('  (resolution, classification, readable name) and verify-route-price-identity');
console.log('  (123 of 123 publish what their page publishes). They were NOT hand-checked.');
console.log('');
console.log(failures === 0 ? 'PASS: every sampled route behaves as its class requires.' : `FAIL: ${failures} route(s).`);
process.exit(failures === 0 ? 0 : 1);
