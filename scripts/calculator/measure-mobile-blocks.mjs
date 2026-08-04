/**
 * Mobile height enumeration, block by block, theirs against ours.
 *
 * At 390x844 their calculator section is 2016px tall and ours is 3980px — a
 * +1964px difference that none of the desktop density rows explain. This walks
 * the visible block structure of each and reports where the height actually
 * goes, so the fix targets measured blocks rather than a guess.
 *
 * Reports only. Changes nothing.
 *
 * Usage:
 *   PLAYWRIGHT_ROOT=<abs> node scripts/calculator/measure-mobile-blocks.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);

const OUT = process.env.CALCULATOR_EVIDENCE_DIR || path.join(os.tmpdir(), 'saman-calculator-evidence');
fs.mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { key: 'theirs', url: 'https://portableofficecabin.com/#cabin-calculator', root: '#cabin-calculator', advance: true },
  { key: 'ours', url: 'http://127.0.0.1:3119/cabin-cost-calculator', root: '[data-cabin-calculator]', advance: false },
];

/**
 * Walks the block structure and returns every visible box that contributes
 * height, with its own height and its share of the section.
 */
function enumerate(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return { error: 'root not found' };
  const total = root.getBoundingClientRect().height;

  const name = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = String(el.className || '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
    const data = [...el.attributes].map((a) => a.name).find((n) => n.startsWith('data-') && n !== 'data-testid');
    return `${el.tagName.toLowerCase()}${id}${cls ? '.' + cls : ''}${data ? `[${data}]` : ''}`.slice(0, 62);
  };

  const rows = [];
  const walk = (el, depth) => {
    for (const child of el.children) {
      const r = child.getBoundingClientRect();
      const cs = getComputedStyle(child);
      if (cs.display === 'none' || child.hidden) continue;
      if (r.height < 4) continue;
      // Skip absolutely positioned decoration that does not add flow height.
      if (cs.position === 'absolute' || cs.position === 'fixed') continue;
      rows.push({
        depth,
        name: name(child),
        h: Math.round(r.height),
        pct: Math.round((r.height / total) * 1000) / 10,
        mt: Math.round(parseFloat(cs.marginTop) || 0),
        mb: Math.round(parseFloat(cs.marginBottom) || 0),
        pt: Math.round(parseFloat(cs.paddingTop) || 0),
        pb: Math.round(parseFloat(cs.paddingBottom) || 0),
        text: (child.children.length === 0 ? child.textContent.trim().slice(0, 30) : ''),
      });
      if (depth < 2) walk(child, depth + 1);
    }
  };
  walk(root, 0);

  return { total: Math.round(total), rows };
}

const browser = await chromium.launch();
const results = {};
for (const target of TARGETS) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  try {
    await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);
    results[target.key] = await page.evaluate(enumerate, target.root);
    await page.screenshot({ path: path.join(OUT, `mobile-blocks-${target.key}.png`), fullPage: true });
  } catch (e) {
    results[target.key] = { error: e.message.slice(0, 200) };
  }
  await page.close();
  await context.close();
}
await browser.close();

fs.writeFileSync(path.join(OUT, 'mobile-blocks.json'), JSON.stringify(results, null, 2));

for (const [key, data] of Object.entries(results)) {
  console.log(`\n${'='.repeat(96)}`);
  console.log(`${key.toUpperCase()} — section height ${data.total ?? 'ERROR'}px at 390x844`);
  console.log('='.repeat(96));
  if (data.error) { console.log('  ' + data.error); continue; }
  console.log('  H     %     m-t  m-b  p-t  p-b   BLOCK');
  for (const r of data.rows) {
    if (r.depth === 0 || r.h >= 60) {
      console.log(
        `  ${String(r.h).padStart(5)} ${String(r.pct).padStart(5)} ${String(r.mt).padStart(4)} ${String(r.mb).padStart(4)} ${String(r.pt).padStart(4)} ${String(r.pb).padStart(4)}   ${'  '.repeat(r.depth)}${r.name}${r.text ? '  "' + r.text + '"' : ''}`
      );
    }
  }
}

// Top contributors at depth 0, which is where a fix has to land.
console.log(`\n${'='.repeat(96)}`);
console.log('TOP-LEVEL BLOCKS, LARGEST FIRST');
console.log('='.repeat(96));
for (const [key, data] of Object.entries(results)) {
  if (data.error) continue;
  const top = data.rows.filter((r) => r.depth === 0).sort((a, b) => b.h - a.h);
  const sum = top.reduce((n, r) => n + r.h, 0);
  console.log(`\n${key} — ${top.length} top-level blocks summing ${sum}px of ${data.total}px`);
  for (const r of top) console.log(`  ${String(r.h).padStart(5)}px  ${String(r.pct).padStart(5)}%   ${r.name}`);
}
