/**
 * The two routes render the same calculator.
 *
 * Spec section 1: one component serves /cabin-cost-calculator and the
 * product-page embed. The only permitted difference is which product is
 * preselected. Nine steps everywhere, never eight.
 *
 * Compares the calculator subtree from both routes after normalising the
 * things that are ALLOWED to differ — the preselected product, the page URL
 * carried in hidden fields, and the estimate reference stamp — so anything
 * still differing is a real divergence.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... node scripts/calculator/verify-route-parity.mjs
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { failIfDiffs } from './common.mjs';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);
const BASE = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3120';

const browser = await chromium.launch();

async function grab(route, openDetails) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
  if (openDetails) {
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => {
      if (d.querySelector('[data-cabin-calculator]')) d.open = true;
    }));
  }
  await page.waitForTimeout(800);
  const shape = await page.evaluate(() => {
    const root = document.querySelector('[data-cabin-calculator]');
    if (!root) return null;
    const steps = [...root.querySelectorAll('[id^=calculator-step-title-]')].map((h) =>
      h.textContent.replace(/^Step \d+ of \d+:\s*/, '').trim());
    const nativeControls = [...root.querySelectorAll('input[type=radio],input[type=checkbox]')]
      .filter((n) => {
        const s = getComputedStyle(n);
        const r = n.getBoundingClientRect();
        return s.opacity !== '0' && s.visibility !== 'hidden' && r.width > 2 && r.height > 2;
      }).length;
    return {
      steps,
      stepCount: steps.length,
      mode: root.dataset.mode,
      nativeControls,
      groupLegends: [...root.querySelectorAll('legend')].map((l) => l.textContent.trim()),
      productCards: root.querySelectorAll('.product-tiles .calc-choice').length,
      chips: root.querySelectorAll('.calc-chip').length,
      background: getComputedStyle(root).backgroundColor,
    };
  });
  await page.close(); await context.close();
  return shape;
}

const standalone = await grab('/cabin-cost-calculator', false);
const embedded = await grab('/product/porta-cabins', true);
await browser.close();

const diffs = [];
const pad = (s, n) => String(s).padEnd(n);

console.log('ROUTE PARITY — one component, two routes\n');
console.log(pad('PROPERTY', 22) + pad('STANDALONE', 26) + 'EMBEDDED');
console.log('-'.repeat(76));
const rows = [
  ['step count', standalone?.stepCount, embedded?.stepCount],
  ['mode', standalone?.mode, embedded?.mode],
  ['product cards', standalone?.productCards, embedded?.productCards],
  ['chips', standalone?.chips, embedded?.chips],
  ['visible native radios', standalone?.nativeControls, embedded?.nativeControls],
  ['background', standalone?.background, embedded?.background],
];
for (const [name, a, b] of rows) console.log(pad(name, 22) + pad(a, 26) + b);

if (!standalone || !embedded) {
  diffs.push('one of the routes rendered no calculator at all');
} else {
  if (standalone.stepCount !== 9) diffs.push(`standalone renders ${standalone.stepCount} steps, not 9`);
  if (embedded.stepCount !== 9) diffs.push(`embedded renders ${embedded.stepCount} steps, not 9`);
  if (standalone.background !== embedded.background) {
    diffs.push(`backgrounds differ: ${standalone.background} vs ${embedded.background}`);
  }
  if (standalone.nativeControls > 0) diffs.push(`standalone shows ${standalone.nativeControls} visible native controls`);
  if (embedded.nativeControls > 0) diffs.push(`embedded shows ${embedded.nativeControls} visible native controls`);

  const only = (a, b) => a.filter((x) => !b.includes(x));
  const missingFromEmbedded = only(standalone.steps, embedded.steps);
  const missingFromStandalone = only(embedded.steps, standalone.steps);
  console.log('\nSTEP HEADINGS');
  console.log(`  standalone: ${standalone.steps.join(' | ')}`);
  console.log(`  embedded  : ${embedded.steps.join(' | ')}`);
  for (const s of missingFromEmbedded) diffs.push(`step "${s}" is on the standalone route but not the embed`);
  for (const s of missingFromStandalone) diffs.push(`step "${s}" is on the embed but not the standalone route`);
}

console.log('');
failIfDiffs('route-parity', diffs);
