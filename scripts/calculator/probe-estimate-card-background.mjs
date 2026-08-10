/** Is the estimate-card contrast finding real, or a walk-to-white artifact? */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
await page.goto((process.env.EV_BASE_URL || 'http://127.0.0.1:3119') + '/cabin-cost-calculator', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const target = [...document.querySelectorAll('.cabin-calculator-ssr h2')].find((h) => h.textContent.trim() === 'Live estimate');
  if (!target) return { error: 'not found' };
  const chain = [];
  let n = target;
  while (n && n.nodeType === 1) {
    const cs = getComputedStyle(n);
    chain.push({
      tag: n.tagName.toLowerCase(),
      cls: (n.className || '').toString().slice(0, 50),
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage.slice(0, 80),
      color: cs.color,
      opacity: cs.opacity,
    });
    if (n.classList && n.classList.contains('cabin-calculator-ssr')) break;
    n = n.parentElement;
  }
  const r = target.getBoundingClientRect();
  return { chain, rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
});
console.log(JSON.stringify(info, null, 2));

// Ground truth: what colour is actually on screen where that heading sits?
const el = page.locator('.cabin-calculator-ssr .estimate-card').first();
if (await el.count()) {
  await el.screenshot({ path: 'reports/calc-L4/evidence/estimate-card-actual.png' });
  console.log('wrote reports/calc-L4/evidence/estimate-card-actual.png');
}
await browser.close();
