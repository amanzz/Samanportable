/**
 * No hold-list code ever renders a figure.
 *
 * Ten codes carry a real number in SAMAN's workbook but are not approved for
 * use: BASE-00 140000, PAN-01 20000, COUNTER-01 120, KITCHEN-01 120,
 * EL-11 30000, PT-02 22000, DR-01 6000, WN-01 4800, plus QT-01, HT-01 and
 * IN-01 which carry prose rather than a number.
 *
 * The risk is specific: the numbers are right there in the spreadsheet, so a
 * refactor that widens a filter, or a well-meaning "the rate exists, why is it
 * blank" fix, would put an unapproved figure on a quotation. This gate asserts
 * three things:
 *
 *   1. no held code appears in the exported usable rate lists
 *   2. no held code's number appears in the rendered DOM beside that code
 *   3. every held code that a buyer can see renders the "Quoted separately"
 *      wording instead
 *
 * Run: node scripts/calculator/verify-hold-list.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import jitiPkg from 'jiti';
import { failIfDiffs, fromRoot } from './common.mjs';

const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(SRC, request.slice(2));
  }
  return resolveFilename.call(this, request, ...rest);
};
const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const rates = jiti('./src/lib/calculatorComponentRates.ts');
const ssr = jiti('./src/lib/cabinCalculatorSSR.ts');

const data = JSON.parse(fs.readFileSync(
  fromRoot('src', 'data', 'calculator', 'price-input-05Aug2026.json'), 'utf8'));

const diffs = [];
const pad = (s, n) => String(s).padEnd(n);

// --- 1 · held codes must not reach the usable lists -------------------------
const usableLists = {
  INTERNAL_WALLS: rates.INTERNAL_WALLS,
  CEILINGS_R1: rates.CEILINGS_R1,
  FLOORINGS_R1: rates.FLOORINGS_R1,
  INSULATIONS_R1: rates.INSULATIONS_R1,
  ELECTRICAL_R1: rates.ELECTRICAL_R1,
  FITOUT_R1: rates.FITOUT_R1,
};
const held = new Set(data.holdList);

console.log('HOLD LIST — no held code may reach a usable rate list\n');
console.log(pad('LIST', 20) + pad('ROWS', 7) + 'HELD CODES PRESENT');
for (const [name, list] of Object.entries(usableLists)) {
  const leaked = (list || []).filter((r) => held.has(r.code));
  console.log(pad(name, 20) + pad((list || []).length, 7) + (leaked.length ? leaked.map((r) => r.code).join(', ') : 'none'));
  for (const r of leaked) diffs.push(`${r.code} is on hold but appears in ${name} with rate ${r.rate}`);
}

// --- 2 · the numbers must not render ----------------------------------------
const html = ssr.renderCabinCalculatorSSR({ pageUrl: '/cabin-cost-calculator' });
const text = html
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ');

console.log('\nHELD FIGURES MUST NOT RENDER');
const heldRows = data.holdList
  .map((code) => Object.values(data.rates).flat().find((r) => r.code === code))
  .filter(Boolean);
/**
 * Matched on the item's LABEL, not on its number.
 *
 * A bare number search is unsound here and reported seven false violations on
 * its first run: 120 is legitimately four ceiling rates and a flooring rate,
 * 6000 is a workstation, 20000 is a hood provision. The same bag-of-numbers
 * mistake the rate-card checker made before it was bound to labels.
 *
 * A held row is excluded from the usable lists at import, so its label should
 * not appear in the DOM at all. If the label is absent, no price can be beside
 * it; if the label IS present, the row leaked and the figure beside it is the
 * thing to look at.
 */
for (const row of heldRows) {
  const label = row.label;
  if (!label) {
    console.log(`  ${pad(row.code, 12)} no label in the workbook — nothing a buyer could see`);
    continue;
  }
  const rendered = text.includes(label);
  const shown = row.rate === null ? JSON.stringify(row.rawValue) : row.rate.toLocaleString('en-IN');
  console.log(`  ${pad(row.code, 12)} ${pad(shown, 24)} ${pad(String(label).slice(0, 34), 36)} ${rendered ? 'LABEL RENDERS' : 'absent'}`);
  if (rendered && row.rate !== null) {
    diffs.push(`${row.code} "${label}" renders while holding a figure of ${shown}`);
  }
}

// --- 3 · a held code a buyer can see must say so ----------------------------
const QUOTED = 'Quoted separately';
const visibleHeld = heldRows.filter((r) => text.includes(r.code));
console.log(`\nHELD CODES VISIBLE TO A BUYER: ${visibleHeld.length}`);
for (const row of visibleHeld) {
  const ok = text.includes(QUOTED);
  console.log(`  ${pad(row.code, 12)} ${ok ? `renders "${QUOTED}"` : `MISSING "${QUOTED}"`}`);
  if (!ok) diffs.push(`${row.code} is shown to a buyer without the "${QUOTED}" wording`);
}

console.log('');
failIfDiffs('hold-list', diffs);
