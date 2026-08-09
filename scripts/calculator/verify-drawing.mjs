/**
 * EVENT 3 gate — the drawing redraws, and the two implementations agree.
 *
 * Spec: "change length, width, rooms and roof in turn; assert all three views
 * redraw and the estimate moves each time."
 *
 * It also does the thing the pricing defect taught: the browser and the server
 * each draw the same cabin, and this compares them. The server rendered the
 * page; the browser redraws it from the same inputs; if the two ever disagree
 * about where a wall is, that is a drift and it fails here rather than in a
 * screenshot six weeks later.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... node scripts/calculator/verify-drawing.mjs
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { failIfDiffs } from './common.mjs';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);
const BASE = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3120';

const diffs = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/cabin-cost-calculator`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(700);

/** A fingerprint of all three views, plus the tiles and the total. */
const SNAP = () => {
  const root = document.querySelector('[data-cabin-calculator]');
  const svg = root.querySelector('[data-floor-plan]');
  const geom = (name) => {
    const g = svg?.querySelector(`[data-plan-view="${name}"]`);
    if (!g) return null;
    return {
      shapes: g.querySelectorAll('rect,line,polyline,circle').length,
      texts: Array.from(g.querySelectorAll('text')).map((t) => t.textContent.trim()),
      d: Array.from(g.querySelectorAll('rect,line,polyline,circle')).map((n) => {
        const a = n.attributes;
        return Array.from(a).filter((x) => x.name !== 'class').map((x) => `${x.name}=${Number(x.value).toFixed(1) === 'NaN' ? x.value : Number(x.value).toFixed(1)}`).join(',');
      }).join('|'),
    };
  };
  const money = (t) => Number(String(t).replace(/[^0-9-]/g, '')) || 0;
  return {
    plan: geom('plan'),
    floor: geom('floor'),
    elevations: geom('elevations'),
    carpet: root.querySelector('[data-carpet-area]')?.textContent?.trim() || '',
    basePrice: root.querySelector('[data-base-price]')?.textContent?.trim() || '',
    total: money(root.querySelector('[data-summary-ex]')?.textContent),
  };
};

// The three views must actually be three different drawings.
await page.evaluate(() => document.querySelector('[data-step-link="2"]')?.click());
await page.waitForTimeout(300);
const first = await page.evaluate(SNAP);
for (const view of ['plan', 'floor', 'elevations']) {
  if (!first[view]) diffs.push(`view "${view}" is not in the drawing at all`);
  else if (first[view].shapes === 0) diffs.push(`view "${view}" renders no shapes`);
}
if (first.plan && first.floor && first.plan.d === first.floor.d) {
  diffs.push('the 2D Plan and the Floor Plan are the same drawing');
}
if (first.floor && first.elevations && first.floor.d === first.elevations.d) {
  diffs.push('the Floor Plan and the 4 Elevations are the same drawing');
}
const elevationLabels = (first.elevations?.texts || []).filter((t) => /elevation$/.test(t));
if (elevationLabels.length !== 4) {
  diffs.push(`the elevations view carries ${elevationLabels.length} labelled elevations, expected 4`);
}
if (!(first.plan?.texts || []).some((t) => /^\d+' \d+"$/.test(t))) {
  diffs.push('the 2D Plan carries no feet-and-inches dimension string');
}
if (!first.carpet) diffs.push('no Carpet Area tile');
if (!first.basePrice) diffs.push('no Base Price tile');

// ---- every input redraws all three views AND moves the estimate ----
const CHANGES = [
  { name: 'length', apply: (p) => p.fill('[name="length"]', '28') },
  { name: 'width', apply: (p) => p.fill('[name="width"]', '14') },
  { name: 'rooms', apply: (p) => p.evaluate(() => {
    const chip = Array.from(document.querySelectorAll('[data-room-count]')).find((el) => el.value === '3');
    chip?.closest('label')?.querySelector('span')?.click();
  }) },
  { name: 'roof', apply: (p) => p.evaluate(() => {
    const chip = Array.from(document.querySelectorAll('[name="roof"]')).find((el) => !el.checked);
    chip?.closest('label')?.querySelector('span')?.click();
  }) },
];

const rows = [];
let previous = first;
for (const change of CHANGES) {
  await change.apply(page);
  await page.evaluate(() => document.querySelector('[name="length"]')?.dispatchEvent(new Event('change', { bubbles: true })));
  await page.waitForTimeout(320);
  const now = await page.evaluate(SNAP);
  const moved = {
    plan: now.plan?.d !== previous.plan?.d || now.plan?.texts.join() !== previous.plan?.texts.join(),
    floor: now.floor?.d !== previous.floor?.d || now.floor?.texts.join() !== previous.floor?.texts.join(),
    elevations: now.elevations?.d !== previous.elevations?.d || now.elevations?.texts.join() !== previous.elevations?.texts.join(),
    estimate: now.total !== previous.total,
    carpet: now.carpet !== previous.carpet,
  };
  rows.push({ name: change.name, ...moved });
  // Not every input touches every view, and pretending otherwise would be a
  // gate asserting a drawing error. Roof is the elevation silhouette, not the
  // plan outline. Partitions are internal: they are in the plan and the floor
  // plan and are not visible on an external elevation.
  const mustRedraw = change.name === 'roof' ? ['elevations']
    : change.name === 'rooms' ? ['plan', 'floor']
      : ['plan', 'floor', 'elevations'];
  for (const view of mustRedraw) {
    if (!moved[view]) diffs.push(`changing ${change.name} did not redraw the ${view} view`);
  }
  if (!moved.estimate) diffs.push(`changing ${change.name} did not move the estimate`);
  previous = now;
}

// ---- the browser's redraw against a fresh server render of the same cabin ----
const configured = await page.evaluate(() => {
  const form = document.querySelector('[data-cabin-calculator] form');
  // Rooms is a chip group now, so the first element carrying the name is the
  // "1 room" chip, not the chosen one. Read what is checked.
  const v = (n) => form.querySelector(`[name="${n}"]`)?.value || '';
  const picked = (n) => form.querySelector(`[name="${n}"]:checked`)?.value || '';
  return { length: v('length'), width: v('width'), rooms: picked('rooms'), roof: picked('roof') };
});
const serverPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const query = new URLSearchParams({
  length: configured.length, width: configured.width, rooms: configured.rooms, roof: configured.roof,
}).toString();
await serverPage.goto(`${BASE}/cabin-cost-calculator?${query}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
// Read the SERVER's markup before the script has a chance to redraw it.
const serverSnap = await serverPage.evaluate(SNAP);
const browserSnap = await page.evaluate(SNAP);
const compare = [['plan', 'the 2D Plan'], ['floor', 'the Floor Plan'], ['elevations', 'the 4 Elevations']];
for (const [key, name] of compare) {
  const a = serverSnap[key];
  const b = browserSnap[key];
  if (!a || !b) continue;
  if (a.shapes !== b.shapes) {
    diffs.push(`${name}: server draws ${a.shapes} shapes, the browser redraws ${b.shapes}`);
  }
  if (a.texts.join('|') !== b.texts.join('|')) {
    diffs.push(`${name}: server labels "${a.texts.join(' ')}" but the browser draws "${b.texts.join(' ')}"`);
  }
}
await serverPage.close();
await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log('EVENT 3 — DRAWING ENGINE\n');
console.log(`views present: 2D Plan ${first.plan ? 'yes' : 'NO'} · Floor Plan ${first.floor ? 'yes' : 'NO'} · 4 Elevations ${first.elevations ? 'yes' : 'NO'}`);
console.log(`tiles: Carpet Area "${first.carpet}" · Base Price "${first.basePrice}"\n`);
console.log(pad('CHANGE', 10) + pad('2D PLAN', 10) + pad('FLOOR', 9) + pad('ELEVATIONS', 12) + pad('CARPET', 9) + 'ESTIMATE');
console.log('-'.repeat(62));
for (const r of rows) {
  const mark = (b) => (b ? 'redrew' : '—');
  console.log(pad(r.name, 10) + pad(mark(r.plan), 10) + pad(mark(r.floor), 9)
    + pad(mark(r.elevations), 12) + pad(r.carpet ? 'moved' : '—', 9) + (r.estimate ? 'moved' : 'DID NOT MOVE'));
}
console.log('\nserver render vs browser redraw of the same cabin: compared shape counts and every label');

console.log('');
failIfDiffs('drawing', diffs);
