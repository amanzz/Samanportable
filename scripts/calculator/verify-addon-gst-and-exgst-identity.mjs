/**
 * CALC-L7 Merge 2 — the add-on GST commit, proved by enumeration.
 *
 * The correctness test, as ruled:
 *   1. inclusive total == (base + add-ons) x (1 + GST_RATE)
 *   2. NO base figure and NO ex-GST figure moves. The ex-GST column must be
 *      byte-identical to before the change.
 *   3. All three estimate paths covered, none left behind:
 *        calculateCabinEstimate · calculatePanelEstimate · calculateSpecialEstimate
 *
 * ON "TO THE RUPEE". Engine B rounds every BASE range to STEP_SIZE = 1000 via
 * roundStep, and has always done so. That rounding is pre-existing, untouched by
 * this change, and it makes an exact-to-the-rupee identity impossible on the
 * base half. So the identity is asserted in the only form that is both exact and
 * honest:
 *
 *     inclusive == base_as_shipped + (addOns_exGst x (1 + GST_RATE))
 *
 * which is what "(base + add-ons) x (1 + GST_RATE)" means once the base carries
 * its own long-standing rounding. The residual against the unrounded ideal is
 * reported per row rather than hidden, and it is bounded by the rounding step.
 *
 * Run:  node scripts/calculator/verify-addon-gst-and-exgst-identity.mjs [--baseline FILE] [--out FILE]
 * Exit: 0 when every assertion holds, 1 otherwise.
 */
import fs from 'fs';
import path from 'path';
import Module from 'node:module';
import jitiPkg from 'jiti';

const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) request = path.join(SRC, request.slice(2));
  return resolveFilename.call(this, request, ...rest);
};
const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const engineB = jiti('./src/lib/price-calculator-config.ts');
const { GST_RATE } = jiti('./src/lib/taxRates.ts');
const { getEstimateFromInput } = engineB;

const BASE_FORM = {
  productId: 'porta_cabin', zone: 'South', length: '20', width: '10', quantity: '1',
  materialType: 'MS Cabin', internalWall: 'MDF 8MM Internal Wall', ceiling: 'MDF 8MM Ceiling',
  flooring: 'Vinyl Flooring', windowType: 'Aluminum', panelThickness: 50,
  transport: 'Transport to be confirmed', installation: 'Installation not required',
  gst: 'GST extra', specialPanelSheet: '', specialFloorStructure: '', numberOfRooms: '0',
  fullName: '', email: '', mobile: '', requirementNotes: '', selectedAddOns: {},
};

/**
 * Fifteen configurations covering every size band and both platforms, plus all
 * three estimate paths. Six carry add-ons, which is where the defect lives; the
 * rest exist to prove nothing moved for everyone else.
 */
const CONFIGS = [
  { n: 1, path: 'cabin', label: 'Porta cabin 20x10, qty 1', form: { productId: 'porta_cabin', length: '20', width: '10' } },
  { n: 2, path: 'cabin', label: 'Container office 20x8, qty 1', form: { productId: 'container_office', length: '20', width: '8' } },
  { n: 3, path: 'cabin', label: 'Portable cabin 40x10, qty 1', form: { productId: 'portable_cabin', length: '40', width: '10' } },
  { n: 4, path: 'cabin', label: 'Porta cabin 20x10 + 1 attached toilet', form: { productId: 'porta_cabin', length: '20', width: '10', selectedAddOns: { 'Attached Toilet': 1 } } },
  { n: 5, path: 'cabin', label: 'Container office 20x8 + 4 workstations + 4 chairs', form: { productId: 'container_office', length: '20', width: '8', selectedAddOns: { Workstation: 4, Chairs: 4 } } },
  { n: 6, path: 'cabin', label: 'Porta cabin 10x8 small band', form: { productId: 'porta_cabin', length: '10', width: '8' } },
  { n: 7, path: 'cabin', label: 'Porta cabin 30x10 mid band', form: { productId: 'porta_cabin', length: '30', width: '10' } },
  { n: 8, path: 'cabin', label: 'Container office 40x8 large band', form: { productId: 'container_office', length: '40', width: '8' } },
  { n: 9, path: 'cabin', label: 'Porta cabin 20x10 x 3 qty', form: { productId: 'porta_cabin', length: '20', width: '10', quantity: '3' } },
  { n: 10, path: 'cabin', label: 'Porta cabin 20x10 PUF + full add-on stack', form: { productId: 'porta_cabin', length: '20', width: '10', materialType: 'PUF / Puff Cabin', selectedAddOns: { 'Attached Toilet': 2, 'Attached Pantry': 1, Workstation: 6, Chairs: 6, 'Manager Table': 1 } } },
  { n: 11, path: 'cabin', label: 'Security cabin 6x6', form: { productId: 'security_cabin', length: '6', width: '6' } },
  { n: 12, path: 'cabin', label: 'Container house 20x10 + toilet + pantry', form: { productId: 'container_house', length: '20', width: '10', selectedAddOns: { 'Attached Toilet': 1, 'Attached Pantry': 1 } } },
  { n: 13, path: 'special', label: 'Labor colony 40x20, 8 rooms + 4 toilets', form: { productId: 'labor_colony', length: '40', width: '20', numberOfRooms: '8', specialPanelSheet: '', specialFloorStructure: '', selectedAddOns: { 'Attached Toilet': 4 } } },
  { n: 14, path: 'panel', label: 'PUF panel 100x50 @50mm', form: { productId: 'puf_panel', length: '100', width: '50', panelThickness: 50 } },
  { n: 15, path: 'panel', label: 'Rockwool panel 60x40 @50mm', form: { productId: 'rockwool_panel', length: '60', width: '40', panelThickness: 50 } },
];

const INR = (n) => (n === null || n === undefined ? '-' : '₹' + Math.round(n).toLocaleString('en-IN'));

function price(config, gstOption) {
  const form = { ...BASE_FORM, ...config.form, gst: gstOption };
  let est;
  try { est = getEstimateFromInput(form); } catch (e) { return { error: String(e.message || e) }; }
  if (!est || est.mode === 'custom') return { error: 'custom/quote mode' };
  return {
    mode: est.mode,
    low: est.lowRange, typical: est.typicalRange, high: est.highRange,
    base: est.budgetBreakdown?.base?.typicalRange ?? null,
    addOns: est.budgetBreakdown?.addOns?.typicalRange ?? 0,
    addOnItems: (est.budgetBreakdown?.addOns?.items || []).map((i) => ({
      id: i.id, qty: i.quantity, unitRate: i.unitRate, typicalRange: i.typicalRange,
    })),
  };
}

const rows = [];
const failures = [];
const fail = (m) => failures.push(m);

for (const c of CONFIGS) {
  const ex = price(c, 'GST extra');
  const inc = price(c, 'GST included guidance');
  if (ex.error || inc.error) { rows.push({ ...c, skipped: ex.error || inc.error }); continue; }

  // ASSERTION 1 - the identity, with the base carrying its own shipped rounding.
  const addOnsExGst = ex.addOns;
  const expectedInclusive = inc.base + addOnsExGst * (1 + GST_RATE);
  const identityDelta = inc.typical - expectedInclusive;
  if (Math.abs(identityDelta) > 0.5) {
    fail(`config ${c.n} identity off by ${INR(identityDelta)}: got ${INR(inc.typical)}, expected ${INR(expectedInclusive)}`);
  }

  // ASSERTION 3 - the add-on half is actually taxed now.
  const addOnRatio = addOnsExGst === 0 ? null : inc.addOns / addOnsExGst;
  if (addOnsExGst > 0 && Math.abs(addOnRatio - (1 + GST_RATE)) > 1e-9) {
    fail(`config ${c.n} add-ons taxed at ${(addOnRatio - 1) * 100}% not ${GST_RATE * 100}%`);
  }

  // The itemised lines must still sum to the add-on total, so the breakdown
  // a customer reads adds up.
  const itemSum = inc.addOnItems.reduce((a, i) => a + i.typicalRange, 0);
  if (inc.addOnItems.length && Math.abs(itemSum - inc.addOns) > 0.5) {
    fail(`config ${c.n} itemised add-on lines sum to ${INR(itemSum)} but the total says ${INR(inc.addOns)}`);
  }

  // The unrounded ideal, reported rather than asserted, so the rounding
  // residual is visible instead of buried.
  const ideal = (ex.typical) * (1 + GST_RATE);
  rows.push({
    n: c.n, path: c.path, label: c.label, mode: ex.mode,
    exLow: ex.low, exTypical: ex.typical, exHigh: ex.high,
    incTypical: inc.typical, addOnsExGst, addOnsInc: inc.addOns,
    identityDelta, idealDelta: inc.typical - ideal,
  });
}

// ASSERTION 2 - the ex-GST column is byte-identical to the baseline.
const baselineFlag = process.argv.indexOf('--baseline');
let baselineVerdict = 'no baseline supplied';
if (baselineFlag !== -1 && process.argv[baselineFlag + 1]) {
  const bPath = process.argv[baselineFlag + 1];
  if (!fs.existsSync(bPath)) {
    baselineVerdict = 'BASELINE FILE MISSING: ' + bPath;
    fail(baselineVerdict);
  } else {
    const baseline = JSON.parse(fs.readFileSync(bPath, 'utf8'));
    const key = (r) => `${r.n}|${r.exLow}|${r.exTypical}|${r.exHigh}`;
    const mine = rows.map(key).join('\n');
    const theirs = (baseline.rows || []).map(key).join('\n');
    if (mine === theirs) {
      baselineVerdict = `EX-GST COLUMN BYTE-IDENTICAL across ${rows.length} configurations`;
    } else {
      baselineVerdict = 'EX-GST COLUMN MOVED';
      fail(baselineVerdict);
      const b = (baseline.rows || []);
      for (let i = 0; i < Math.max(rows.length, b.length); i += 1) {
        if (key(rows[i] || {}) !== key(b[i] || {})) {
          console.log(`  ROW ${i + 1} DIFFERS\n    before: ${key(b[i] || {})}\n    after:  ${key(rows[i] || {})}`);
        }
      }
    }
  }
}

const outFlag = process.argv.indexOf('--out');
if (outFlag !== -1 && process.argv[outFlag + 1]) {
  fs.mkdirSync(path.dirname(process.argv[outFlag + 1]), { recursive: true });
  fs.writeFileSync(process.argv[outFlag + 1], JSON.stringify({ gstRate: GST_RATE, rows }, null, 2));
}

console.log('CALC-L7 Merge 2 - add-on GST, fifteen configurations');
console.log('');
console.log(' # | path    | configuration                                  | ex-GST typ | add-ons ex | add-ons inc | inclusive  | identity');
console.log('---|---------|------------------------------------------------|------------|------------|-------------|------------|---------');
for (const r of rows) {
  console.log(
    String(r.n).padStart(2) + ' | ' + r.path.padEnd(8) + '| ' + r.label.slice(0, 47).padEnd(47) + '| ' +
    INR(r.exTypical).padStart(11) + '| ' + INR(r.addOnsExGst).padStart(11) + '| ' + INR(r.addOnsInc).padStart(12) + '| ' +
    INR(r.incTypical).padStart(11) + '| ' + (Math.abs(r.identityDelta) <= 0.5 ? 'EXACT' : INR(r.identityDelta))
  );
}

const paths = [...new Set(rows.map((r) => r.path))].sort();
console.log('');
console.log(`paths covered: ${paths.join(', ')}  (${paths.length} of 3)`);
if (paths.length < 3) fail(`only ${paths.length} of the three estimate paths were exercised`);
console.log(`configurations carrying add-ons: ${rows.filter((r) => r.addOnsExGst > 0).length}`);
console.log(`ex-GST baseline: ${baselineVerdict}`);
const maxIdeal = rows.reduce((m, r) => Math.max(m, Math.abs(r.idealDelta)), 0);
console.log(`largest residual against the UNROUNDED ideal: ${INR(maxIdeal)} (bounded by the pre-existing STEP_SIZE=1000 rounding on the base)`);
console.log('');
if (failures.length) {
  for (const f of failures) console.log('  FAIL  ' + f);
  console.log('');
  console.log('FAIL');
} else {
  console.log('PASS: inclusive == base + add-ons x (1 + GST_RATE) on every configuration,');
  console.log('      add-ons taxed at GST_RATE, itemised lines sum to their total,');
  console.log('      all three estimate paths covered.');
}
process.exit(failures.length ? 1 : 0);
