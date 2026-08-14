/**
 * Walks the nine steps the way a user does - activating each step through the
 * wizard's own navigation - and reports what is ACTUALLY painted in each state.
 *
 * The force-reveal approach used earlier turned every display:none element into
 * a finding, including an estimate card the user never sees in that state. A
 * gate that fails on states nobody can reach is a gate that gets switched off.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.PROBE_BASE_URL || 'http://127.0.0.1:3119';
const width = Number(process.env.PROBE_WIDTH || 1440);
const tag = process.env.PROBE_TAG || 'local';
const outputDir = path.resolve('reports/calc-L4/steps');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(baseUrl + '/cabin-cost-calculator', { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(1500);

const results = [];
for (let step = 1; step <= 9; step += 1) {
  // Use the wizard's own step navigation, not a style override.
  const navigated = await page.evaluate((n) => {
    const link = document.querySelector(`.step-nav a[href="#calculator-step-${n}"], .step-nav a[href$="step-${n}"]`);
    if (link) { link.click(); return 'step-nav'; }
    return null;
  }, step);
  await page.waitForTimeout(700);

  const state = await page.evaluate((n) => {
    const section = document.getElementById(`calculator-step-${n}`);
    const visible = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0 && r.width > 0 && r.height > 0;
    };
    const estimateCard = document.querySelector('.cabin-calculator-ssr .estimate-card');
    const mobileEstimate = document.querySelector('.cabin-calculator-ssr .mobile-estimate');
    const heading = (section?.querySelector('h2')?.textContent || '').trim();
    const cs = estimateCard ? getComputedStyle(estimateCard) : null;
    return {
      step: n,
      heading,
      sectionVisible: visible(section),
      estimateCardVisible: visible(estimateCard),
      estimateCardBackground: cs ? cs.backgroundColor : null,
      estimateCardColor: cs ? cs.color : null,
      mobileEstimateVisible: visible(mobileEstimate),
      numericControlsVisible: section ? Array.from(section.querySelectorAll('input[type="number"]'))
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length : 0,
    };
  }, step);
  state.navigatedVia = navigated;
  results.push(state);
  console.log(`step ${step} "${state.heading}" visible=${state.sectionVisible} numericControls=${state.numericControlsVisible} estimateCard=${state.estimateCardVisible} (${state.estimateCardBackground} / ${state.estimateCardColor}) mobileEstimate=${state.mobileEstimateVisible}`);
  if (state.sectionVisible) {
    await page.screenshot({ path: path.join(outputDir, `${tag}-${width}-step${step}.png`), fullPage: false });
  }
}
await writeFile(path.join(outputDir, `natural-states-${tag}-${width}.json`), JSON.stringify(results, null, 2));
await browser.close();
