/**
 * CALC-L4 item 3, measurement half. PROPOSE ONLY - this script measures and
 * screenshots, it changes nothing.
 *
 * Names the empty region by the element that OWNS it and gives its measured
 * height per step per viewport, and locates the step navigation ("button
 * section") relative to the panel and the fold.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.BLANK_BASE_URL || 'http://127.0.0.1:3119';
const route = process.env.BLANK_ROUTE || '/cabin-cost-calculator';
const outputDir = path.resolve(process.env.BLANK_OUTPUT || 'D:/Project-shekhar/reports/calc-L4-09Aug');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
const viewports = [{ label: '1440', width: 1440, height: 900 }, { label: '1920', width: 1920, height: 1080 }, { label: '390', width: 390, height: 844 }];
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const report = [];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1500);

  for (let step = 1; step <= 9; step += 1) {
    await page.evaluate((n) => {
      const link = document.querySelector(`.step-nav a[href="#calculator-step-${n}"]`);
      if (link) link.click();
    }, step);
    await page.waitForTimeout(600);

    const measured = await page.evaluate((n) => {
      const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
      const grid = document.querySelector('.cabin-calculator-ssr .calculator-grid');
      const stepCard = document.querySelector('.cabin-calculator-ssr .step-card');
      const section = document.getElementById(`calculator-step-${n}`);
      const sidebar = document.querySelector('.cabin-calculator-ssr .calculator-grid > .estimate-card');
      const nav = document.querySelector('.cabin-calculator-ssr .step-actions, .cabin-calculator-ssr .step-buttons, .cabin-calculator-ssr [data-step-actions]');
      // the wizard's Back / Continue controls, however they are marked up
      const buttons = Array.from(document.querySelectorAll('.cabin-calculator-ssr button, .cabin-calculator-ssr a'))
        .filter((el) => /^(back|continue|next|previous)$/i.test((el.textContent || '').trim()))
        .map((el) => ({ text: el.textContent.trim(), ...box(el) }));

      // The empty tail of the step card: distance from the bottom of the last
      // painted child of the active step to the bottom of the card that holds it.
      let lastChildBottom = null;
      if (section) {
        for (const child of section.children) {
          const r = child.getBoundingClientRect();
          if (r.height > 0 && r.width > 0) lastChildBottom = Math.max(lastChildBottom ?? 0, r.bottom);
        }
      }
      const cardRect = stepCard ? stepCard.getBoundingClientRect() : null;
      const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;

      return {
        step: n,
        heading: (section?.querySelector('h2')?.textContent || '').trim(),
        viewportHeight: window.innerHeight,
        grid: box(grid),
        gridTemplateColumns: grid ? getComputedStyle(grid).gridTemplateColumns : null,
        stepCard: box(stepCard),
        section: box(section),
        sidebarEstimate: box(sidebar),
        explicitNavContainer: box(nav),
        navButtons: buttons,
        // OWNER of the empty region + its measured height
        emptyTailOwner: stepCard ? '.cabin-calculator-ssr .step-card' : null,
        emptyTailHeight: cardRect && lastChildBottom !== null ? Math.round(cardRect.bottom - lastChildBottom) : null,
        // the column beside the sidebar: how much of the sidebar column is unused
        sidebarColumnUnused: cardRect && sidebarRect ? Math.round(cardRect.bottom - sidebarRect.bottom) : null,
      };
    }, step);

    measured.viewport = vp.label;
    report.push(measured);
    await page.screenshot({ path: path.join(outputDir, `before-${vp.label}-step${step}.png`) });
  }
  await page.close();
}
await browser.close();

await writeFile(path.join(outputDir, 'blank-space-measurements.json'), JSON.stringify(report, null, 2));

console.log('viewport | step | heading | step-card | empty tail below last child | sidebar column unused | nav buttons found');
for (const r of report) {
  console.log(`${r.viewport} | ${r.step} | ${r.heading.slice(0, 26).padEnd(26)} | card h=${r.stepCard?.h} | ${r.emptyTailHeight}px owned by ${r.emptyTailOwner} | ${r.sidebarColumnUnused}px | ${r.navButtons.map((b) => b.text).join(',') || 'none'}`);
}
console.log(`\nscreenshots + JSON in ${outputDir}`);
