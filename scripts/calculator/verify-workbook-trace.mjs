/**
 * Every component rate the calculator applies traces to a cell in SAMAN's
 * workbook. Anything that traces to neither the workbook nor the 576 Pricing
 * Matrix is reported.
 *
 * This is the ticket's headline gate. It walks the option lists the steps
 * actually render, and for each one asserts the figure equals the value in
 * src/data/calculator/price-input-05Aug2026.json at the recorded sheet and
 * row. A rate that cannot be walked back to a cell is a rate nobody approved.
 *
 * Run: node scripts/calculator/verify-workbook-trace.mjs
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

const data = JSON.parse(fs.readFileSync(
  fromRoot('src', 'data', 'calculator', 'price-input-05Aug2026.json'), 'utf8'));
const byCode = new Map(Object.values(data.rates).flat().map((r) => [r.code, r]));

const diffs = [];
const pad = (s, n) => String(s).padEnd(n);

console.log('WORKBOOK TRACE — every applied component rate back to a cell');
console.log(`source: ${data.source.file}`);
console.log(`        modified ${data.source.modified}\n`);

const LISTS = [
  ['internal wall', rates.INTERNAL_WALLS],
  ['ceiling', rates.CEILINGS_R1],
  ['flooring', rates.FLOORINGS_R1],
  ['insulation', rates.INSULATIONS_R1],
  ['electrical', rates.ELECTRICAL_R1],
  ['fit-out', rates.FITOUT_R1],
];

console.log(pad('GROUP', 16) + pad('ROWS', 7) + pad('TRACED', 9) + 'UNTRACEABLE');
let total = 0;
for (const [name, list] of LISTS) {
  let traced = 0;
  for (const item of list || []) {
    const cell = byCode.get(item.code);
    if (!cell) {
      diffs.push(`${item.code} (${name}) is applied but has no row in the workbook`);
      continue;
    }
    if (cell.rate !== item.rate) {
      diffs.push(`${item.code}: applies ${item.rate} but the workbook cell holds ${cell.rate}`);
      continue;
    }
    if (cell.hold) {
      diffs.push(`${item.code} is on hold yet reached an applied list`);
      continue;
    }
    traced += 1;
  }
  total += (list || []).length;
  const bad = (list || []).length - traced;
  console.log(pad(name, 16) + pad((list || []).length, 7) + pad(traced, 9) + (bad || 'none'));
}
console.log(`\ntotal applied component rates: ${total}`);

/**
 * Frame percentages and the PUF matrix are sourced, not component rates: they
 * come from SAMAN's 05 Aug ruling as recorded in the workbook's own sourced
 * list, and the PUF figures match rate card v2's per-sq-ft deltas to two
 * decimals. Asserted here so a later edit cannot drift them silently.
 */
console.log('\nSOURCED, NOT FROM A COMPONENT ROW');
const FRAME_EXPECTED = { 'FR-MS': 0, 'FR-GI': 5, 'FR-CONV': 10 };
for (const opt of rates.FRAME_OPTIONS) {
  const ok = FRAME_EXPECTED[opt.code] === opt.percent;
  console.log(`  ${pad(opt.code, 10)} ${pad(opt.label, 26)} +${opt.percent}%  ${ok ? '' : 'UNEXPECTED'}`);
  if (!ok) diffs.push(`${opt.code} applies +${opt.percent}%, not the ruled +${FRAME_EXPECTED[opt.code]}%`);
}
const PUF_EXPECTED = { 30: 1050, 40: 1150, 50: 1250, 60: 1330, 80: 1470 };
for (const [mm, expected] of Object.entries(PUF_EXPECTED)) {
  const actual = rates.PUF_PER_SQM[mm];
  const ok = actual === expected;
  console.log(`  ${pad(`PUF ${mm} mm`, 10)} ${pad(`${actual} per sq.m`, 26)} delta ${rates.pufDeltaPerSqft(Number(mm)).toFixed(2)}/sq ft  ${ok ? '' : 'UNEXPECTED'}`);
  if (!ok) diffs.push(`PUF ${mm} mm is ${actual}, not the sourced ${expected}`);
}

/** EPS is specified but unpriced, so it must ship disabled and never priced. */
const eps = rates.WALL_BUILD_OPTIONS.find((o) => o.code === 'WB-EPS');
console.log(`\n  EPS wall panel: ${eps && eps.disabled ? 'disabled, rate pending' : 'ENABLED — no rate exists for it'}`);
if (!eps || !eps.disabled || eps.perSqmDelta !== null) {
  diffs.push('EPS is enabled or carries a rate, but no EPS rate exists in any source');
}

console.log('');
failIfDiffs('workbook-trace', diffs);
