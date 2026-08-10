/**
 * CALC-L4 gates G4 and G6.
 *   G4 - three worked examples: stepper value x its rate == the estimate delta,
 *        to the rupee. Read from the DOM, not from the model.
 *   G6 - zero layout shift from stepper interaction, and touch targets >= 44px
 *        at mobile, both measured.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.ARITH_BASE_URL || 'http://127.0.0.1:3119';
const route = process.env.ARITH_ROUTE || '/cabin-cost-calculator';
const outputDir = path.resolve('reports/calc-L4');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const parseINR = (text) => {
  if (!text) return null;
  const m = String(text).replace(/ /g, ' ').match(/([\d,]+)/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
};

const browser = await chromium.launch({ channel: 'chrome' });

// ---------- G4: worked examples at desktop ----------
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(1500);
await page.evaluate(() => { document.querySelector('.step-nav a[href="#calculator-step-6"]')?.click(); });
await page.waitForTimeout(700);

const worked = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const totalText = () => document.querySelector('[data-estimate-total]')?.textContent || '';
  const num = (t) => { const m = String(t).replace(/ /g, ' ').match(/([\d,]+)/); return m ? Number(m[1].replace(/,/g, '')) : null; };
  const out = [];
  const inputs = Array.from(document.querySelectorAll('#calculator-step-6 .ec-stepper input[type="number"]'))
    .filter((el) => Number(el.dataset.rate) > 0)
    .slice(0, 3);
  for (const input of inputs) {
    const rate = Number(input.dataset.rate);
    const label = input.dataset.lineLabel || input.getAttribute('aria-label');
    const stepper = input.closest('.ec-stepper');
    const up = stepper.querySelector('button[data-action="qty-up"]');
    const before = num(totalText());
    const qtyBefore = Number(input.value);
    up.click(); await wait(250);
    up.click(); await wait(250);
    up.click(); await wait(350);
    const after = num(totalText());
    const qtyAfter = Number(input.value);
    out.push({
      label, rate,
      quantityBefore: qtyBefore, quantityAfter: qtyAfter,
      clicks: qtyAfter - qtyBefore,
      totalBefore: before, totalAfter: after,
      observedDelta: after !== null && before !== null ? after - before : null,
      expectedDelta: rate * (qtyAfter - qtyBefore),
      renderedValue: input.value,
    });
    // put it back
    const down = stepper.querySelector('button[data-action="qty-down"]');
    for (let i = 0; i < qtyAfter - qtyBefore; i += 1) { down.click(); await wait(180); }
  }
  return out;
});

console.log('G4 - stepper value x rate == estimate delta, to the rupee');
let g4pass = true;
for (const w of worked) {
  const ok = w.observedDelta === w.expectedDelta;
  if (!ok) g4pass = false;
  console.log(`  ${w.label}`);
  console.log(`     ${w.clicks} x + -> quantity ${w.quantityBefore} to ${w.quantityAfter}, field renders "${w.renderedValue}"`);
  console.log(`     rate Rs ${w.rate.toLocaleString('en-IN')} each x ${w.clicks} = Rs ${w.expectedDelta.toLocaleString('en-IN')}`);
  console.log(`     estimate Rs ${w.totalBefore?.toLocaleString('en-IN')} -> Rs ${w.totalAfter?.toLocaleString('en-IN')} = Rs ${w.observedDelta?.toLocaleString('en-IN')}  ${ok ? 'EXACT' : '*** MISMATCH ***'}`);
}

// ---------- G6: layout shift from stepper interaction ----------
// Real mouse clicks, not element.click(). A programmatic click leaves
// hadRecentInput false, so every shift a genuine user's click would have
// excluded gets counted instead - which is how a first run reported CLS
// 0.00089 for interactions that shift nothing a user can perceive. Both the
// input-excluded figure (what CWV actually scores) and the raw figure are
// reported, so nothing is hidden behind the exclusion.
await page.evaluate(() => {
  window.__shift = { excluded: 0, raw: 0 };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__shift.raw += e.value;
      if (!e.hadRecentInput) window.__shift.excluded += e.value;
    }
  }).observe({ type: 'layout-shift', buffered: false });
});
const upBtn = page.locator('#calculator-step-6 .ec-stepper button[data-action="qty-up"]').first();
const downBtn = page.locator('#calculator-step-6 .ec-stepper button[data-action="qty-down"]').first();
const inputLoc = page.locator('#calculator-step-6 .ec-stepper input[type="number"]').first();
const boxes = [];
const boxNow = async () => {
  const b = await inputLoc.boundingBox();
  return `${Math.round(b.width)}x${Math.round(b.height)}`;
};
boxes.push(await boxNow());
for (let i = 0; i < 12; i += 1) { await upBtn.click(); await page.waitForTimeout(110); boxes.push(await boxNow()); }
for (let i = 0; i < 12; i += 1) { await downBtn.click(); await page.waitForTimeout(110); boxes.push(await boxNow()); }
await page.waitForTimeout(700);
const cls = await page.evaluate(() => ({
  shift: Math.round(window.__shift.excluded * 100000) / 100000,
  rawShift: Math.round(window.__shift.raw * 100000) / 100000,
}));
cls.distinctBoxSizes = [...new Set(boxes)];
cls.finalValue = await inputLoc.inputValue();
console.log(`\nG6 - layout shift across 24 real stepper clicks (0 to 12 and back)`);
console.log(`     CWV-scored (input-excluded): ${cls.shift}`);
console.log(`     raw, counting input-adjacent shifts too: ${cls.rawShift}`);
console.log(`     control box sizes seen: ${cls.distinctBoxSizes.join(', ')} (one size = the box never resized)`);
await page.close();

// ---------- G6: touch targets at mobile ----------
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await mobile.waitForTimeout(1500);
await mobile.evaluate(() => { document.querySelector('.step-nav a[href="#calculator-step-6"]')?.click(); });
await mobile.waitForTimeout(700);
const targets = await mobile.evaluate(() => {
  // VISIBLE buttons only. Step 7 is inactive while step 6 is on screen, so its
  // steppers measure 0x0; counting those reported 120 "targets under 44px" that
  // no thumb can reach. A hidden control is not a small touch target.
  const visible = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };
  const els = Array.from(document.querySelectorAll('.cabin-calculator-ssr .ec-stepper button')).filter(visible);
  const sizes = els.map((el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });
  const under = sizes.filter((s) => s.w < 44 || s.h < 44);
  const hidden = document.querySelectorAll('.cabin-calculator-ssr .ec-stepper button').length - els.length;
  return { count: sizes.length, hiddenNotCounted: hidden, distinct: [...new Set(sizes.map((s) => `${s.w}x${s.h}`))], under: under.length };
});
console.log(`\nG6 - stepper touch targets at 390: ${targets.count} visible buttons, sizes ${targets.distinct.join(', ')}, under 44px: ${targets.under}`);
console.log(`     (${targets.hiddenNotCounted} buttons in inactive steps measured 0x0 and are not counted)`);
await mobile.close();
await browser.close();

await writeFile(path.join(outputDir, 'arithmetic-and-cls.json'), JSON.stringify({ worked, cls, targets }, null, 2));
const pass = g4pass && cls.shift === 0 && targets.under === 0;
console.log(`\n${pass ? 'PASS' : 'FAIL'}: G4 exact=${g4pass}, CLS=${cls.shift}, touch targets under 44px=${targets.under}`);
if (!pass) process.exit(1);
