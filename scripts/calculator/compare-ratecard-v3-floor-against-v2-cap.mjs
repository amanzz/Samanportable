/**
 * CALC-L7 §B3 — "The codebase already carries a monotonic guard from CALC-L2d.
 * Report whether it can carry this, or whether this replaces it. Do not build a
 * second mechanism alongside a first."
 *
 * This answers that with arithmetic before anything is built.
 *
 * THE SHORT OF IT: the guard on disk and the guard CALC-L7 rules are BOTH
 * monotonicity guards and they point in OPPOSITE directions.
 *
 *   on disk (CALC-L2d / rate card v2, ruled 07 Aug):
 *     a monotonic CAP.  price(a) = min( raw(a), raw(e) for every anchor e >= a )
 *     It LOWERS prices just below each boundary, pulling them down to the
 *     larger cabin's cheaper figure.
 *
 *   CALC-L7 B3 (ruled 09 Aug):
 *     a monotonic FLOOR. base(A) = max( A x bandRate(A), carryForwardFloor(A) )
 *     It RAISES prices just above each boundary, holding them at the smaller
 *     cabin's dearer figure until the band rate catches up.
 *
 * Both produce a non-decreasing curve. They are not the same curve, and a
 * customer is quoted a different number under each. That is a ruling for SAMAN,
 * not a detail to pick.
 *
 * Run:  node scripts/calculator/compare-ratecard-v3-floor-against-v2-cap.mjs
 * Exit: 0 always - this reports, it does not gate.
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
const card = jiti('./src/lib/baseCabinRateCard.ts');
const { baseCabinRate, FIXED_RATE_SIZES, AREA_BANDS } = card;

const INR = (n) => (n === null || n === undefined ? 'quote mode' : '₹' + Math.round(n).toLocaleString('en-IN'));

// ---------------------------------------------------------------------------
// CALC-L7's model, implemented here ONLY to compare. Nothing is wired to it.
// ---------------------------------------------------------------------------
const V3_BANDS = [
  { from: 50, to: 70, rate: 1200 },
  { from: 70, to: 90, rate: 1150 },
  { from: 90, to: 150, rate: 1100 },
  { from: 150, to: 200, rate: 1050 },
  { from: 200, to: Infinity, rate: 1000 },
];
const v3BandRate = (a) => (V3_BANDS.find((b) => a >= b.from && a < b.to) || {}).rate ?? null;

/** B3's carry-forward floor: the highest price any smaller cabin carries. */
function v3FloorPrice(a) {
  const rate = v3BandRate(a);
  if (rate === null) return null;
  const raw = a * rate;
  // The dearest price reachable at any area below this one, using the band
  // rates as written. The supremum sits just under each band's lower edge.
  let floor = 0;
  for (const b of V3_BANDS) {
    if (b.from >= a) break;
    const topOfBand = Math.min(a, b.to);
    floor = Math.max(floor, topOfBand * b.rate);
  }
  return Math.round(Math.max(raw, floor));
}

// ---------------------------------------------------------------------------
// G20 - the five named sizes, to the rupee
// ---------------------------------------------------------------------------
console.log('G20 - the five named sizes');
const EXPECTED = { '4x4x7': 38400, '5x5x7': 53750, '6x4x8': 46800, '6x6x8': 54000, '8x6x8': 60000 };
let g20 = true;
for (const s of FIXED_RATE_SIZES) {
  const got = baseCabinRate(s.lengthFt, s.widthFt);
  const want = EXPECTED[s.sizeLabel];
  const ok = got && got.basePriceExGst === want;
  if (!ok) g20 = false;
  console.log(`  ${s.sizeLabel.padEnd(8)} ${String(s.areaSqft).padStart(3)} sq ft x ${String(s.ratePerSqft).padStart(4)} = ${INR(got?.basePriceExGst).padStart(10)}  want ${INR(want).padStart(10)}  ${ok ? 'EXACT' : 'MISMATCH'}`);
}
console.log(`  G20: ${g20 ? 'PASS' : 'FAIL'}`);

// ---------------------------------------------------------------------------
// G22 - the 50 sq ft join
// ---------------------------------------------------------------------------
const at48 = baseCabinRate(8, 6);
const at50 = baseCabinRate(10, 5);
console.log('');
console.log('G22 - the 50 sq ft join');
console.log(`  8x6  = 48 sq ft -> ${INR(at48?.basePriceExGst)}`);
console.log(`  10x5 = 50 sq ft -> ${INR(at50?.basePriceExGst)}   (50 x 1200 = ₹60,000)`);
console.log(`  G22: ${at48?.basePriceExGst === 60000 && at50?.basePriceExGst === 60000 ? 'PASS - both sides return ₹60,000' : 'FAIL'}`);

// ---------------------------------------------------------------------------
// G21 - monotonicity of what is ON DISK, proved by enumeration
// ---------------------------------------------------------------------------
console.log('');
console.log('G21 - monotonicity of the SHIPPED card, every 0.25 sq ft from 16 to 400');
let prev = null, breaches = 0, firstBreach = null;
const shipped = [];
for (let a = 16; a <= 400; a += 0.25) {
  const r = baseCabinRate(a, 1);
  const price = r ? r.basePriceExGst : null;
  shipped.push({ a, price });
  if (price !== null && prev !== null && price < prev.price - 0.5) {
    breaches += 1;
    if (!firstBreach) firstBreach = { from: prev.a, to: a, fromPrice: prev.price, toPrice: price };
  }
  if (price !== null) prev = { a, price };
}
console.log(`  areas evaluated: ${shipped.length}   priced: ${shipped.filter((s) => s.price !== null).length}   quote mode: ${shipped.filter((s) => s.price === null).length}`);
console.log(`  monotonicity breaches: ${breaches}`);
if (firstBreach) console.log(`  first breach: ${firstBreach.from} -> ${firstBreach.to} sq ft, ${INR(firstBreach.fromPrice)} -> ${INR(firstBreach.toPrice)}`);
console.log(`  G21 against the card on disk: ${breaches === 0 ? 'PASS - already non-decreasing' : 'FAIL'}`);

// ---------------------------------------------------------------------------
// THE COMPARISON THAT MATTERS - cap vs floor, in rupees
// ---------------------------------------------------------------------------
console.log('');
console.log('CAP (on disk) vs FLOOR (CALC-L7 B3) at and around every band boundary');
console.log('');
console.log('  area   | on disk (cap) | CALC-L7 (floor) | difference | who pays more');
console.log('  -------|---------------|-----------------|------------|--------------');
const PROBE = [49.75, 50, 69.75, 70, 73, 73.04, 75, 89.75, 90, 94, 94.09, 100, 149.75, 150, 157, 157.14, 175, 199.75, 200, 205, 210, 250, 300, 400];
const diffs = [];
for (const a of PROBE) {
  const disk = baseCabinRate(a, 1);
  const diskPrice = disk ? disk.basePriceExGst : null;
  const floorPrice = v3FloorPrice(a);
  const delta = diskPrice !== null && floorPrice !== null ? floorPrice - diskPrice : null;
  if (delta !== null) diffs.push({ a, diskPrice, floorPrice, delta });
  console.log(
    '  ' + String(a).padEnd(7) + '| ' + INR(diskPrice).padStart(14) + '| ' + INR(floorPrice).padStart(16) + '| ' +
    (delta === null ? 'n/a' : (delta > 0 ? '+' : '') + INR(delta)).padStart(11) + '| ' +
    (delta === null ? '' : delta > 0 ? 'CALC-L7 floor' : delta < 0 ? 'card on disk' : 'same')
  );
}

const disagree = diffs.filter((d) => d.delta !== 0);
const worst = disagree.slice().sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))[0];
console.log('');
console.log(`  probed areas where the two models disagree: ${disagree.length} of ${diffs.length}`);
if (worst) console.log(`  widest gap: ${worst.a} sq ft, ${INR(worst.diskPrice)} on disk vs ${INR(worst.floorPrice)} under B3 = ${(worst.delta > 0 ? '+' : '') + INR(worst.delta)}`);

// Sweep the whole range so the claim is not hostage to the probe list.
let sweepDisagree = 0, sweepWorst = null, higherUnderFloor = 0;
for (let a = 50; a <= 400; a += 0.25) {
  const disk = baseCabinRate(a, 1);
  const d = disk ? disk.basePriceExGst : null;
  const f = v3FloorPrice(a);
  if (d === null || f === null) continue;
  const delta = f - d;
  if (delta !== 0) {
    sweepDisagree += 1;
    if (delta > 0) higherUnderFloor += 1;
    if (!sweepWorst || Math.abs(delta) > Math.abs(sweepWorst.delta)) sweepWorst = { a, d, f, delta };
  }
}
console.log('');
console.log(`  full sweep 50-400 sq ft at 0.25 steps: ${sweepDisagree} areas disagree`);
console.log(`     of those, dearer under CALC-L7's floor: ${higherUnderFloor}`);
if (sweepWorst) console.log(`     widest: ${sweepWorst.a} sq ft  ${INR(sweepWorst.d)} -> ${INR(sweepWorst.f)}  (${(sweepWorst.delta > 0 ? '+' : '') + INR(sweepWorst.delta)})`);

// ---------------------------------------------------------------------------
// B4.1 vs the 36-50 slide
// ---------------------------------------------------------------------------
console.log('');
console.log('B4.1 - "below 50 sq ft, only the five named sizes are priced"');
console.log('   vs the 36-50 linear slide SAMAN ruled on 07 Aug (rate card v2 §3)');
console.log('');
const SUB50 = [[7, 7, 49], [6, 7, 42], [6.5, 6, 39], [7.5, 6, 45], [5, 6, 30], [4, 8, 32]];
for (const [l, w, area] of SUB50) {
  const r = baseCabinRate(l, w);
  const b41 = 'quote mode';
  console.log(`  ${String(l + 'x' + w).padEnd(8)} ${String(area).padStart(2)} sq ft   on disk: ${(r ? INR(r.basePriceExGst) + ' (' + r.source + ')' : 'quote mode').padEnd(28)} under B4.1: ${b41}`);
}

fs.mkdirSync('reports/calc-L7', { recursive: true });
fs.writeFileSync('reports/calc-L7/ratecard-v3-floor-vs-v2-cap.json', JSON.stringify({
  g20, g21Breaches: breaches, probe: diffs, sweepDisagree, higherUnderFloor, sweepWorst,
}, null, 2));
console.log('');
console.log('Written: reports/calc-L7/ratecard-v3-floor-vs-v2-cap.json');
