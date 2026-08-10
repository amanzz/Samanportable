/** CALC-L4 visual evidence: the step-6 electrical stepper card, magnified. */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.EV_BASE_URL;
const label = process.env.EV_LABEL || 'shot';
const width = Number(process.env.EV_WIDTH || 1440);
const outputDir = path.resolve(process.env.EV_OUTPUT || 'reports/calc-L4/evidence');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 4 });
await page.goto(baseUrl + '/cabin-cost-calculator', { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  document.querySelectorAll('[id^="calculator-step-"]').forEach((s) => { s.removeAttribute('hidden'); s.style.display = 'block'; });
  document.querySelectorAll('.cabin-calculator-ssr [hidden]').forEach((s) => s.removeAttribute('hidden'));
});
await page.waitForTimeout(400);

// three electrical cards, so the +/- and the value are all in frame
const cards = page.locator('#calculator-step-6 .ec-card');
const n = Math.min(3, await cards.count());
for (let i = 0; i < n; i += 1) {
  await cards.nth(i).screenshot({ path: path.join(outputDir, `${label}-step6-card${i + 1}-${width}.png`) });
}
// and one step-7 card for comparison
const c7 = page.locator('#calculator-step-7 .quantity-row').first();
if (await c7.count()) await c7.screenshot({ path: path.join(outputDir, `${label}-step7-row-${width}.png`) });

// set a two-digit value on the first electrical stepper and shoot it again
await page.evaluate(() => {
  const input = document.querySelector('#calculator-step-6 .ec-stepper input');
  if (input) { input.value = '12'; input.dispatchEvent(new Event('input', { bubbles: true })); }
});
await page.waitForTimeout(250);
await cards.nth(0).screenshot({ path: path.join(outputDir, `${label}-step6-card1-twodigit-${width}.png`) });

console.log(`${label}: wrote evidence crops to ${outputDir}`);
await browser.close();
