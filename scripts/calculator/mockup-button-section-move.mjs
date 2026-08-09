/**
 * CALC-L4 item 3 - MOCKUP ONLY. Nothing here ships.
 *
 * Renders the proposed move as a real browser layout by injecting CSS at
 * runtime, screenshots before and after at 1440, 1920 and 390, and measures the
 * layout shift the move itself causes. SAMAN rules from the pictures; this file
 * exists so he is ruling on a rendered page and not on a description.
 *
 * The proposal, from the measurements in blank-space-measurements.json:
 *   At 1440 and 1920 the grid is 852px step card + 340px sidebar, capped at
 *   1216px, so both viewports render identically. On step 6 the estimate card
 *   ends 553px above the bottom of the step card, leaving an empty column, and
 *   Back / Next sit at y=1631 - roughly 730px below a 900px fold.
 *   The move docks Back / Next into that empty column, under the estimate card
 *   and sticky with it, so the controls are reachable without scrolling to the
 *   bottom of a tall panel. At 390 there is no second column, so the proposal
 *   there is a sticky footer bar instead and is shown separately.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.MOCK_BASE_URL || 'http://127.0.0.1:3119';
const outputDir = path.resolve('D:/Project-shekhar/reports/calc-L4-09Aug');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

/** Desktop: lift the step navigation into the empty sidebar column. */
const DESKTOP_MOCKUP = `
.cabin-calculator-ssr .calculator-grid { align-items: start; }
.cabin-calculator-ssr .calculator-grid > .estimate-card { position: sticky; top: 5.5rem; }
.cabin-calculator-ssr .step-nav-proposed {
  position: sticky; top: calc(5.5rem + var(--proposed-offset, 495px));
  grid-column: 2; display: flex; gap: 10px; margin-top: 12px;
  background: var(--sd-panel); border: 1px solid var(--sd-hairline);
  border-radius: 16px; padding: 14px; width: 340px;
}
.cabin-calculator-ssr .step-nav-proposed > * { flex: 1 1 0; justify-content: center; }
.cabin-calculator-ssr .step-actions-original { opacity: 0.25; }
`;

/** Mobile: a sticky footer bar, since 390 has no second column. */
const MOBILE_MOCKUP = `
.cabin-calculator-ssr .step-nav-proposed {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
  display: flex; gap: 10px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: var(--sd-panel); border-top: 1px solid var(--sd-hairline-hi);
}
.cabin-calculator-ssr .step-nav-proposed > * { flex: 1 1 0; justify-content: center; min-height: 44px; }
.cabin-calculator-ssr .step-card { padding-bottom: 5.5rem; }
.cabin-calculator-ssr .step-actions-original { opacity: 0.25; }
`;

const viewports = [
  { label: '1440', width: 1440, height: 900, css: DESKTOP_MOCKUP },
  { label: '1920', width: 1920, height: 1080, css: DESKTOP_MOCKUP },
  { label: '390', width: 390, height: 844, css: MOBILE_MOCKUP },
];

const browser = await chromium.launch({ channel: 'chrome' });
const summary = [];

for (const vp of viewports) {
  for (const step of [2, 6, 9]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(baseUrl + '/cabin-cost-calculator', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(1400);
    await page.evaluate((n) => { document.querySelector(`.step-nav a[href="#calculator-step-${n}"]`)?.click(); }, step);
    await page.waitForTimeout(600);

    const before = await page.evaluate(() => {
      const nav = Array.from(document.querySelectorAll('.cabin-calculator-ssr button, .cabin-calculator-ssr a'))
        .filter((el) => /^(back|next)$/i.test((el.textContent || '').trim()));
      const r = nav[0]?.getBoundingClientRect();
      return { navTop: r ? Math.round(r.top + window.scrollY) : null, fold: window.innerHeight, docHeight: document.documentElement.scrollHeight };
    });
    await page.screenshot({ path: path.join(outputDir, `item3-BEFORE-${vp.label}-step${step}.png`) });

    // apply the mockup: clone the Back/Next pair into the proposed position
    const after = await page.evaluate(async ({ css }) => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
      const buttons = Array.from(document.querySelectorAll('.cabin-calculator-ssr button, .cabin-calculator-ssr a'))
        .filter((el) => /^(back|next)$/i.test((el.textContent || '').trim()));
      if (!buttons.length) return null;
      const original = buttons[0].parentElement;
      original.classList.add('step-actions-original');
      const holder = document.createElement('div');
      holder.className = 'step-nav-proposed';
      for (const b of buttons) holder.appendChild(b.cloneNode(true));
      const grid = document.querySelector('.cabin-calculator-ssr .calculator-grid');
      const sidebar = document.querySelector('.cabin-calculator-ssr .calculator-grid > .estimate-card');
      if (sidebar && sidebar.getBoundingClientRect().height > 0) {
        // Appending straight to the grid made a THIRD grid item, which
        // auto-placed on a new row and pushed Back/Next 116px FURTHER down -
        // the opposite of the proposal. The sidebar and the nav have to share
        // one column, so they go in a wrapper that becomes that column.
        const column = document.createElement('div');
        column.className = 'proposed-column';
        column.style.cssText = 'display:flex;flex-direction:column;gap:12px;position:sticky;top:5.5rem;align-self:start;';
        sidebar.parentElement.insertBefore(column, sidebar);
        column.appendChild(sidebar);
        sidebar.style.position = 'static';
        column.appendChild(holder);
        holder.style.position = 'static';
        holder.style.width = 'auto';
      } else {
        document.querySelector('.cabin-calculator-ssr').appendChild(holder);
      }
      let shift = 0;
      new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) shift += e.value; })
        .observe({ type: 'layout-shift', buffered: false });
      await new Promise((r) => setTimeout(r, 800));
      const r2 = holder.getBoundingClientRect();
      return {
        navTop: Math.round(r2.top + window.scrollY),
        shiftFromMove: Math.round(shift * 100000) / 100000,
        docHeight: document.documentElement.scrollHeight,
      };
    }, { css: vp.css });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outputDir, `item3-AFTER-${vp.label}-step${step}.png`) });

    summary.push({ viewport: vp.label, step, before, after });
    console.log(`${vp.label} step${step}: Back/Next top ${before.navTop}px -> ${after?.navTop}px (fold ${before.fold}px), doc ${before.docHeight} -> ${after?.docHeight}, shift from move ${after?.shiftFromMove}`);
    await page.close();
  }
}
await browser.close();
await writeFile(path.join(outputDir, 'item3-mockup-summary.json'), JSON.stringify(summary, null, 2));
console.log(`\nmockups in ${outputDir}`);
