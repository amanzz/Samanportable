/**
 * Every step fits the viewport, and the named steps hit their density targets.
 *
 * Parity spec v1 section 6: "No step scrolls at 1440x900. Every one of the
 * nine fits the viewport." Section 7 adds per-step ceilings: Step 3 <= 200px,
 * Step 4 <= 470px, Step 1 shows all twelve products without scrolling.
 *
 * Measures the rendered height of each step panel with that step active, and
 * saves one screenshot per step so all nine can be reviewed together instead
 * of discovered one at a time.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... CALCULATOR_EVIDENCE_DIR=...
 *   node scripts/calculator/verify-step-density.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { failIfDiffs } from './common.mjs';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);
const BASE = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3120';
const OUT = process.env.CALCULATOR_EVIDENCE_DIR || path.join(os.tmpdir(), 'saman-step-shots');
fs.mkdirSync(OUT, { recursive: true });

/** Per-step ceilings. null means only the viewport law applies. */
const TARGET = { 3: 200, 4: 470 };
const VIEWPORT_H = 900;

/**
 * Steps whose content is Event 3 and Event 4 and has not been built yet. They
 * are measured and printed like every other step - a deferral that hides its
 * own number is just a silent cap - but they do not fail this build.
 */
const DEFERRED = { 2: 'Event 3, drawing engine', 5: 'Event 4, openings', 6: 'Event 4, sockets' };

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: VIEWPORT_H }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.goto(`${BASE}/cabin-cost-calculator`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(900);

const diffs = [];
const rows = [];
const links = await page.$$('[data-step-link]');

for (let i = 0; i < links.length; i += 1) {
  await links[i].click();
  await page.waitForTimeout(200);
  const m = await page.evaluate(() => {
    const root = document.querySelector('[data-cabin-calculator]');
    const active = root.querySelector('.calc-step.is-active');
    const card = root.querySelector('.step-card');
    const heading = active ? active.querySelector('h2') : null;
    // Each step carries a top pad so its first control clears the sticky live
    // estimate header. That is chrome, not density, so it is reported apart.
    const cs = active ? getComputedStyle(active) : null;
    const chrome = cs ? Math.round(parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)) : 0;
    return {
      name: heading ? heading.textContent.replace(/^Step \d+ of \d+:\s*/, '').trim() : '(none)',
      chrome,
      stepHeight: active ? Math.round(active.getBoundingClientRect().height) : 0,
      panelHeight: card ? Math.round(card.getBoundingClientRect().height) : 0,
      panelScrolls: card ? card.scrollHeight > card.clientHeight + 1 : false,
      // One step is visible at a time. A layout rule that wins its specificity
      // contest against the hide rule stacks two steps on top of each other,
      // and measuring only the active one never sees it.
      visibleSteps: [...root.querySelectorAll('.calc-step')]
        .filter((el) => el.getBoundingClientRect().height > 0).length,
      cardsVisible: active
        ? [...active.querySelectorAll('.product-tiles .calc-choice')].length
        : 0,
      chips: active ? active.querySelectorAll('fieldset .calc-choice').length : 0,
    };
  });

  const n = i + 1;
  // Scroll the card into view first. A viewport screenshot taken from the top
  // of the page shows the intro copy, not the step it is named after.
  await page.evaluate(() => {
    document.querySelector('.step-card')?.scrollIntoView({ block: 'start', behavior: 'instant' });
    window.scrollBy(0, -130); // clear the site header, which is sticky
  });
  await page.waitForTimeout(150);
  const shot = path.join(OUT, `step-${String(n).padStart(2, '0')}-1440.png`);
  await page.screenshot({ path: shot });

  rows.push({ n, ...m, target: TARGET[n] || null });

  if (m.visibleSteps !== 1) {
    diffs.push(`step ${n} "${m.name}": ${m.visibleSteps} steps are visible at once, expected 1`);
  }
  if (DEFERRED[n]) continue;
  if (m.panelScrolls) diffs.push(`step ${n} "${m.name}": the step panel scrolls internally`);
  if (m.stepHeight > VIEWPORT_H) {
    diffs.push(`step ${n} "${m.name}": ${m.stepHeight}px exceeds the ${VIEWPORT_H}px viewport`);
  }
  if (TARGET[n] && m.stepHeight > TARGET[n]) {
    diffs.push(`step ${n} "${m.name}": ${m.stepHeight}px box, ${m.stepHeight - m.chrome}px content, over its ${TARGET[n]}px density target`);
  }
}

// Step 1 must show all twelve products without scrolling within the section.
const step1 = rows.find((r) => r.n === 1);
if (step1 && step1.cardsVisible !== 12) {
  diffs.push(`step 1 renders ${step1.cardsVisible} product cards, expected 12`);
}

await page.close(); await context.close(); await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(`STEP DENSITY at 1440x${VIEWPORT_H}\n`);
console.log(pad('#', 4) + pad('STEP', 26) + pad('BOX', 7) + pad('CONTENT', 9) + pad('TARGET', 8) + pad('CHIPS', 7) + 'RESULT');
console.log('-'.repeat(86));
for (const r of rows) {
  const verdict = DEFERRED[r.n] ? `deferred: ${DEFERRED[r.n]}`
    : r.panelScrolls ? 'PANEL SCROLLS'
      : r.stepHeight > VIEWPORT_H ? `OVER VIEWPORT by ${r.stepHeight - VIEWPORT_H}`
        : r.target && r.stepHeight > r.target ? `OVER TARGET by ${r.stepHeight - r.target}`
          : 'ok';
  console.log(pad(r.n, 4) + pad(r.name.slice(0, 24), 26) + pad(r.stepHeight, 7)
    + pad(r.stepHeight - r.chrome, 9) + pad(r.target || '-', 8) + pad(r.chips, 7) + verdict);
}
console.log(`\nEvery step carries ${rows[0].chrome}px of padding of its own. CONTENT is the step`);
console.log('without it, so a target can be read against the controls rather than the frame.');
console.log(`\nscreenshots: ${rows.length} written to ${OUT}`);

console.log('');
failIfDiffs('step-density', diffs);
