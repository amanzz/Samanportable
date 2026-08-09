/**
 * Every covered route actually renders. No white screens.
 *
 * WHY THIS EXISTS. On 05 Aug the whole site white-screened with "Application
 * error: a client-side exception has occurred", and every gate passed:
 *
 *   - the browser harness visited only two routes
 *   - one of them, /product/porta-cabins, WAS white-screening
 *   - axe found 0 violations, because there was nothing on the page to audit
 *   - interaction CLS measured 0.0000, because nothing laid out
 *   - tap targets measured 0 under 44px, because there were no targets
 *
 * An empty error page scores perfectly on every quality gate ever written.
 * Nothing checked that a page had rendered at all, and /cabin-cost-calculator
 * hid the fault because it sets unstable_runtimeJS:false and never hydrates —
 * the one route immune to a hydration crash was the one being watched.
 *
 * So this gate runs FIRST and asserts the cheapest, most fundamental thing:
 * the page rendered, and the browser logged no error doing it.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... node scripts/calculator/verify-render-health.mjs
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { failIfDiffs } from './common.mjs';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);
const BASE = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3120';

/**
 * Coverage. The two calculator routes plus a spread wide enough that a global
 * failure cannot hide: the root, a listing page, a form page, both product
 * route shapes, and a page outside the calculator's blast radius.
 */
const ROUTES = [
  '/',
  '/cabin-cost-calculator',
  '/product/porta-cabins',
  '/product/portable-office',
  '/product/porta-cabins/steel-porta-cabin',
  '/product/puf-panel',
  '/blog',
  '/contact',
];

/** Below this, a page is an error screen rather than a page. */
const MIN_TEXT = 400;

const browser = await chromium.launch();
const diffs = [];
const rows = [];

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e && e.message ? e.message : e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });

  let status = 0;
  try {
    const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
    status = response ? response.status() : 0;
    // Hydration errors surface after load, not during it.
    await page.waitForTimeout(2000);
  } catch (e) {
    diffs.push(`${route}: navigation failed — ${e.message.slice(0, 120)}`);
  }

  const body = await page.evaluate(() => ({
    text: document.body ? document.body.innerText.trim().length : 0,
    errorScreen: document.body
      ? /Application error: a client-side exception/.test(document.body.innerText)
      : false,
  })).catch(() => ({ text: 0, errorScreen: false }));

  rows.push({ route, status, text: body.text, pageErrors, consoleErrors, errorScreen: body.errorScreen });

  if (status !== 200) diffs.push(`${route}: HTTP ${status}`);
  if (body.errorScreen) diffs.push(`${route}: renders the client-side exception screen`);
  else if (body.text < MIN_TEXT) diffs.push(`${route}: only ${body.text} characters rendered, below ${MIN_TEXT}`);
  if (pageErrors.length) diffs.push(`${route}: ${pageErrors.length} uncaught page error(s) — ${pageErrors[0]}`);

  await page.close();
  await context.close();
}
await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(`RENDER HEALTH — ${ROUTES.length} routes against ${BASE}\n`);
console.log(pad('ROUTE', 44) + pad('HTTP', 6) + pad('TEXT', 8) + pad('PAGE ERR', 10) + 'RESULT');
console.log('-'.repeat(88));
for (const r of rows) {
  const verdict = r.errorScreen ? 'CLIENT-SIDE EXCEPTION'
    : r.status !== 200 ? 'BAD STATUS'
      : r.text < MIN_TEXT ? 'TOO LITTLE RENDERED'
        : r.pageErrors.length ? 'RENDERED WITH ERRORS'
          : 'ok';
  console.log(pad(r.route, 44) + pad(r.status, 6) + pad(r.text, 8) + pad(r.pageErrors.length, 10) + verdict);
}

const consoleTotal = rows.reduce((n, r) => n + r.consoleErrors.length, 0);
console.log(`\nconsole errors across all routes: ${consoleTotal}`);
for (const r of rows) {
  for (const c of r.consoleErrors.slice(0, 2)) console.log(`  ${r.route}: ${c}`);
}

console.log('');
failIfDiffs('render-health', diffs);
