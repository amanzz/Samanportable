/**
 * CALC-L7 Merge 1 gate — "step 9 estimate card: heading, floor area and total
 * all at 4.5:1 or better, measured."
 *
 * CALC-L4 item 1b found step 9's in-form estimate card still on the retired
 * light-mint --bg-panel, measuring 1.05:1 on the heading, 1.03:1 on the floor
 * area and 2.04:1 on the total itself - the number the whole page exists to
 * show. This asserts the three named elements, by name, after the fix.
 *
 * The card only exists once the wizard is on step 9, so this walks there
 * through the wizard's own step navigation rather than force-revealing it. A
 * gate that measures a state no user can reach proves nothing.
 *
 * Run: node scripts/calculator/verify-step9-estimate-card-contrast.mjs
 * Exit: 0 when all three clear 4.5:1, 1 otherwise.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.STEP9_BASE_URL || 'http://127.0.0.1:3121';
const outputDir = path.resolve('reports/calc-L7');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const rows = [];

for (const vp of [{ width: 1440, height: 1000, label: '1440' }, { width: 390, height: 844, label: '390' }]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(baseUrl + '/cabin-cost-calculator', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const link = document.querySelector('[data-step-link="9"]');
    if (link) link.click();
  });
  await page.waitForTimeout(900);

  const measured = await page.evaluate(() => {
    const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const alphaOf = (s) => {
      const parts = (s.match(/[\d.]+/g) || []);
      return parts.length > 3 ? Number(parts[3]) : 1;
    };
    /** A semi-transparent foreground is NOT its nominal colour. --sd-text-2 is
     *  rgba(...,0.64); scoring it at full opacity inflates the ratio, which is
     *  the flattering answer, not the true one. Composite it over its ground
     *  first. */
    const composite = (fg, alpha, bg) => fg.map((c, i) => alpha * c + (1 - alpha) * bg[i]);
    const ratio = (fg, bg) => {
      const a = lum(fg), b = lum(bg);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    /** Walk up for the first non-transparent background, the way a browser
     *  composites it - the card's own ground, not the page's. */
    const effectiveBg = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        const p = parse(bg);
        const alpha = (bg.match(/[\d.]+/g) || [])[3];
        if (p.length === 3 && (alpha === undefined || Number(alpha) > 0.5)) return { color: p, from: node.className || node.tagName };
        node = node.parentElement;
      }
      return { color: [255, 255, 255], from: 'document' };
    };

    const card = document.querySelector('#calculator-step-9 .estimate-card');
    if (!card) return { found: false };

    const pick = (predicate) => [...card.querySelectorAll('h2, h3, p, span, strong, li, div')]
      .find((el) => predicate((el.textContent || '').trim()) && el.children.length === 0);

    const targets = {
      heading: [...card.querySelectorAll('h2, h3')][0],
      floorArea: pick((t) => /sq ft/i.test(t)),
      total: pick((t) => /^₹[\d,]+$/.test(t)),
    };

    const out = { found: true, cardBg: getComputedStyle(card).backgroundColor, items: {} };
    for (const [key, el] of Object.entries(targets)) {
      if (!el) { out.items[key] = { present: false }; continue; }
      const cs = getComputedStyle(el);
      const bg = effectiveBg(el);
      const alpha = alphaOf(cs.color);
      const fgNominal = parse(cs.color);
      const fg = composite(fgNominal, alpha, bg.color);
      out.items[key] = {
        present: true,
        text: (el.textContent || '').trim().slice(0, 40),
        color: cs.color,
        alpha,
        compositedColor: `rgb(${fg.map((c) => Math.round(c)).join(', ')})`,
        background: `rgb(${bg.color.join(', ')})`,
        backgroundFrom: String(bg.from).slice(0, 40),
        ratio: Math.round(ratio(fg, bg.color) * 100) / 100,
      };
    }
    return out;
  });

  await page.screenshot({ path: path.join(outputDir, `step9-estimate-card-${vp.label}.png`) });
  rows.push({ viewport: vp.label, ...measured });
  await page.close();
}

await browser.close();
await writeFile(path.join(outputDir, 'step9-estimate-card-contrast.json'), JSON.stringify(rows, null, 2));

const MIN = 4.5;
let failures = 0;
console.log('step 9 in-form estimate card - the three elements CALC-L4 measured at 1.05, 1.03 and 2.04');
console.log('');
for (const row of rows) {
  console.log(`@${row.viewport}  card background ${row.cardBg}`);
  if (!row.found) { console.log('  CARD NOT FOUND'); failures += 1; continue; }
  for (const [key, item] of Object.entries(row.items)) {
    if (!item.present) { console.log(`  ${key.padEnd(10)} NOT FOUND`); failures += 1; continue; }
    const ok = item.ratio >= MIN;
    if (!ok) failures += 1;
    const alphaNote = item.alpha < 1 ? ` [alpha ${item.alpha} composited to ${item.compositedColor}]` : '';
    console.log(`  ${key.padEnd(10)} ${String(item.ratio).padStart(6)}:1  ${ok ? 'PASS' : 'FAIL'}  "${item.text}"  ${item.color} on ${item.background}${alphaNote}`);
  }
  console.log('');
}
console.log(failures === 0
  ? `PASS: heading, floor area and total all at ${MIN}:1 or better, both viewports.`
  : `FAIL: ${failures} measurement(s) below ${MIN}:1.`);
process.exit(failures === 0 ? 0 : 1);
