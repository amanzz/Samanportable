/**
 * SAMAN base-cabin rate card — enumeration and gate.
 *
 * Authority: SAMAN-RULING-BASE-CABIN-RATE-CARD-06Aug2026.md.
 * Order:     CC-TICKET-CALC-L2 (07 Aug 2026).
 *
 * This REPLACES gate 1 of verify-route-price-identity.mjs, which asserted that
 * the calculator's base at a page's default size equals that page's published
 * price. The ruling retires that identity for the base line: the page keeps the
 * finished-product price, the calculator opens at the bare-cabin figure.
 *
 * Gates, in order:
 *   1. Price table — every selectable size on every calculator route:
 *      size, area, rate source, computed base, and an INDEPENDENT recomputation
 *      written separately below. Zero mismatches tolerated.
 *   2. Boundary proof — 70, 90, 150 and 200 sq ft each take the CHEAPER rate.
 *   3. The five fixed sizes produce exactly 38,400 / 53,750 / 46,800 / 54,000 / 60,000.
 *   4. Security Cabins renders quote mode — no base figure.
 *   5. STOP LIST — every selectable size at or under 50 sq ft that is not one
 *      of the five fixed sizes. SAMAN has stated no rate for these and
 *      interpolation is forbidden. Reported, never priced.
 *
 * Run:  node scripts/calculator/verify-base-cabin-rate-card.mjs
 * Exit: 0 when gates 1-4 pass. Gate 5 is a report, not a failure: the ticket
 *       says do not block the other sizes on it.
 */
import jitiPkg from 'jiti';
import fs from 'fs';
import path from 'path';
import Module from 'node:module';

const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(SRC, request.slice(2));
  }
  return resolveFilename.call(this, request, ...rest);
};

const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const card = jiti('./src/lib/baseCabinRateCard.ts');
const ssr = jiti('./src/lib/cabinCalculatorSSR.ts');
const embed = jiti('./src/lib/cabinCalculatorEmbedRoutes.ts');
const ladders = jiti('./src/lib/calculatorLadders.ts');

const { baseCabinRate, FIXED_RATE_SIZES } = card;
const { computeCalculatorEstimate, DEFAULT_CALCULATOR_CONFIG, renderCabinCalculatorSSR } = ssr;
const { resolveEmbeddedCalculatorProduct } = embed;
const { getRouteLadder } = ladders;

// ---------------------------------------------------------------------------
// INDEPENDENT RECOMPUTATION.
//
// Written from the ruling document directly, not from the shipped module, so
// gate 1 compares two implementations rather than a module against itself. If
// this and src/lib/baseCabinRateCard.ts ever agree only because they are the
// same code, the gate is worthless — that was the exact defect in the old
// "342 rows, 0 mismatches" check.
// ---------------------------------------------------------------------------
function expectedBase(length, width) {
  const fixed = {
    '4x4': 2400, '5x5': 2150, '6x4': 1950, '4x6': 1950,
    '6x6': 1500, '8x6': 1250, '6x8': 1250,
  }[`${length}x${width}`];
  if (fixed !== undefined) return { rate: fixed, base: length * width * fixed, why: 'fixed' };

  const area = length * width;
  const raw = rawExpected(area);
  if (raw === null) return null;
  return { rate: raw.rate, base: Math.min(raw.base, expectedCeiling(area)), why: raw.why };
}

/** The card before the cap, written from the ruling. */
function rawExpected(area) {
  // v2 §3: below 36 sq ft only the fixed sizes exist — no rate, STOP.
  if (area < 36) return null;
  // v2 §3: the 36-50 slide, between SAMAN's own anchors. Rate un-rounded.
  if (area <= 48) {
    const rate = 1500 + (area - 36) * ((1250 - 1500) / 12);
    return { rate, base: Math.round(area * rate), why: 'slide 36-48' };
  }
  if (area <= 50) {
    const rate = 1250 + (area - 48) * ((1200 - 1250) / 2);
    return { rate, base: Math.round(area * rate), why: 'slide 48-50' };
  }
  // Edge takes the cheaper rate, so every comparison is strict "<".
  const rate = area < 70 ? 1200
    : area < 90 ? 1150
      : area < 150 ? 1100
        : area < 200 ? 1050
          : 1000;
  return { rate, base: Math.round(area * rate), why: `band ${rate}` };
}

/**
 * The monotonic cap, written independently from the ruling of 07 Aug:
 * price(a) = min(raw(a), raw(e) for every anchor e >= a), anchors 50/70/90/150/200.
 */
const CAP_ANCHORS = [50, 70, 90, 150, 200];
function expectedCeiling(area) {
  return CAP_ANCHORS
    .filter((anchor) => anchor >= area)
    .reduce((lowest, anchor) => Math.min(lowest, rawExpected(anchor)?.base ?? Infinity), Infinity);
}

const INR = (n) => (n === null || n === undefined ? '—' : '₹' + Number(n).toLocaleString('en-IN'));
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

// ---------------------------------------------------------------------------
// Routes carrying a calculator, from the sitemap through the real resolver.
// ---------------------------------------------------------------------------
const sitemap = fs.readFileSync(path.join(process.cwd(), 'public', 'sitemap-products.xml'), 'utf8');
const ROUTES = [...new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1].split('samanportable.com')[1] || '')
    .filter((u) => u.startsWith('/product/'))
)].sort().map((url) => {
  const parts = url.replace(/\/$/, '').split('/').filter(Boolean);
  return { url, category: parts[1], slug: parts[2] };
}).filter((r) => r.category)
  .map((r) => ({ ...r, mapping: resolveEmbeddedCalculatorProduct(r.category, r.slug) }))
  .filter((r) => r.mapping);

// The size inputs the buyer actually drives: length and width, 4 to 60 ft in
// 0.5 ft steps. The floor dropped from 6 to 4 under rate card v2 §4 so that all
// five fixed sizes become selectable — 4x4x7, 5x5x7 and 6x4x8 carried stated
// rates that no buyer could reach. Read from the shipped markup rather than
// hard-coded, so this gate cannot drift from the control it is describing.
const SIZE_STEP = 0.5;
const sizeMarkup = renderCabinCalculatorSSR({ reference: 'GATE', pageUrl: '/gate' });
const lengthField = sizeMarkup.match(/min="(\d+(?:\.\d+)?)" max="(\d+(?:\.\d+)?)" step="0\.5" name="length"/);
const widthField = sizeMarkup.match(/min="(\d+(?:\.\d+)?)" max="(\d+(?:\.\d+)?)" step="0\.5" name="width"/);
if (!lengthField || !widthField) {
  console.error('Could not read the length/width input range from the rendered markup.');
  process.exit(1);
}
const SIZE_MIN = Math.max(Number(lengthField[1]), Number(widthField[1]));
const SIZE_MAX = Math.min(Number(lengthField[2]), Number(widthField[2]));
console.log(`Size inputs read from the shipped markup: ${SIZE_MIN} to ${SIZE_MAX} ft in ${SIZE_STEP} ft steps.\n`);

/**
 * The named sizes on a route: every row of that route's own published ladder
 * (the sizes its price table lists and a buyer types), plus the calculator's
 * default 20x10 so no route escapes the table.
 */
function namedSizesFor(mapping) {
  const ladder = getRouteLadder(mapping.ladderKey) || [];
  const sizes = ladder
    .filter((row) => row.length !== null && row.width !== null)
    .map((row) => ({ label: row.label, length: row.length, width: row.width }));
  if (!sizes.some((s) => s.length === 20 && s.width === 10)) {
    sizes.unshift({ label: '20x10 ft (calculator default)', length: 20, width: 10 });
  }
  return sizes;
}

// ---------------------------------------------------------------------------
// GATE 1 — price table, every selectable named size on every route.
// ---------------------------------------------------------------------------
console.log('BASE-CABIN RATE CARD — PRICE TABLE, EVERY SELECTABLE SIZE ON EVERY ROUTE');
console.log('Base cabin = floor area x per-sq-ft rate, ex-GST. Page headline is unchanged and is not this figure.\n');
console.log(
  pad('ROUTE', 50) + pad('SIZE', 14) + padL('AREA', 9) + '  ' + pad('RATE SOURCE', 16)
  + padL('RATE', 8) + padL('COMPUTED', 14) + padL('EXPECTED', 14) + '  STATUS'
);
console.log('-'.repeat(133));

const mismatches = [];
const stopList = new Map();
let rowCount = 0;

for (const route of ROUTES) {
  const quoteRoute = route.mapping.productId === 'security-cabin';
  for (const size of namedSizesFor(route.mapping)) {
    rowCount += 1;
    const got = baseCabinRate(size.length, size.width);
    const want = expectedBase(size.length, size.width);

    if (quoteRoute) {
      // Gate 4 covers this route; it must publish no base at all.
      console.log(
        pad(route.url, 50) + pad(`${size.length}x${size.width}`, 14)
        + padL((size.length * size.width).toLocaleString('en-IN'), 9) + '  '
        + pad('quote mode', 16) + padL('—', 8) + padL('—', 14) + padL('—', 14) + '  quote mode'
      );
      continue;
    }

    if (!got || !want) {
      stopList.set(`${size.length}x${size.width}`, { length: size.length, width: size.width, area: size.length * size.width });
      const agree = !got && !want;
      if (!agree) mismatches.push({ route: route.url, size, got, want, why: 'one side stated a rate, the other did not' });
      console.log(
        pad(route.url, 50) + pad(`${size.length}x${size.width}`, 14)
        + padL((size.length * size.width).toLocaleString('en-IN'), 9) + '  '
        + pad('NO RATE', 16) + padL('—', 8) + padL('—', 14) + padL('—', 14)
        + (agree ? '  *** STOP: SAMAN has stated no rate ***' : '  *** MISMATCH ***')
      );
      continue;
    }

    const ok = got.basePriceExGst === want.base && got.ratePerSqft === want.rate;
    if (!ok) mismatches.push({ route: route.url, size, got, want, why: 'computed != expected' });
    console.log(
      pad(route.url, 50) + pad(`${size.length}x${size.width}`, 14)
      + padL(got.areaSqft.toLocaleString('en-IN'), 9) + '  '
      + pad(`${got.source} ${got.sourceLabel}`, 16) + padL(got.ratePerSqft, 8)
      + padL(INR(got.basePriceExGst), 14) + padL(INR(want.base), 14)
      + (ok ? '  ok' : '  *** MISMATCH ***')
    );
  }
}

// ---------------------------------------------------------------------------
// GATE 2 — boundary proof. Each edge takes the cheaper rate.
// ---------------------------------------------------------------------------
console.log('\nBOUNDARY PROOF — the edge takes the CHEAPER rate');
console.log(pad('AREA', 10) + pad('SIZE USED', 14) + pad('BAND BELOW', 14) + pad('BAND TAKEN', 14) + padL('RATE', 8) + padL('BASE', 14) + '  STATUS');
const BOUNDARIES = [
  { area: 70, length: 10, width: 7, below: '>50-70 @1200', expectRate: 1150 },
  { area: 90, length: 10, width: 9, below: '>70-90 @1150', expectRate: 1100 },
  { area: 150, length: 15, width: 10, below: '>90-150 @1100', expectRate: 1050 },
  { area: 200, length: 20, width: 10, below: '>150-200 @1050', expectRate: 1000 },
];
const boundaryFailures = [];
for (const b of BOUNDARIES) {
  const got = baseCabinRate(b.length, b.width);
  const ok = got && got.ratePerSqft === b.expectRate && got.basePriceExGst === b.area * b.expectRate;
  if (!ok) boundaryFailures.push(b);
  console.log(
    pad(b.area, 10) + pad(`${b.length}x${b.width}`, 14) + pad(b.below, 14)
    + pad(got ? got.sourceLabel + ' @' + got.ratePerSqft : '—', 14)
    + padL(got ? got.ratePerSqft : '—', 8) + padL(got ? INR(got.basePriceExGst) : '—', 14)
    + (ok ? '  ok, cheaper rate taken' : '  *** WRONG SIDE OF THE EDGE ***')
  );
}

// ---------------------------------------------------------------------------
// GATE 3 — the five fixed sizes, to the rupee.
// ---------------------------------------------------------------------------
console.log('\nFIXED-RATE SIZES — must be exact');
console.log(pad('SIZE', 12) + padL('AREA', 7) + padL('RATE', 8) + padL('COMPUTED', 14) + padL('RULING', 14) + '  STATUS');
const RULED = { '4x4x7': 38400, '5x5x7': 53750, '6x4x8': 46800, '6x6x8': 54000, '8x6x8': 60000 };
const fixedFailures = [];
for (const size of FIXED_RATE_SIZES) {
  const got = baseCabinRate(size.lengthFt, size.widthFt);
  const ruled = RULED[size.sizeLabel];
  const ok = got && got.basePriceExGst === ruled && got.source === 'fixed';
  if (!ok) fixedFailures.push(size.sizeLabel);
  console.log(
    pad(size.sizeLabel, 12) + padL(size.areaSqft, 7) + padL(size.ratePerSqft, 8)
    + padL(got ? INR(got.basePriceExGst) : '—', 14) + padL(INR(ruled), 14)
    + (ok ? '  ok' : '  *** MISMATCH ***')
  );
}

// ---------------------------------------------------------------------------
// GATE 4 — Security Cabins stays quote mode. No base figure renders.
// ---------------------------------------------------------------------------
console.log('\nSECURITY CABINS — quote mode, no base figure');
const securityRoutes = ROUTES.filter((r) => r.mapping.productId === 'security-cabin');
const securityFailures = [];
for (const route of securityRoutes) {
  const est = computeCalculatorEstimate({
    ...DEFAULT_CALCULATOR_CONFIG,
    productId: 'security-cabin',
    ladderKey: route.mapping.ladderKey ?? null,
    quantity: 1,
  });
  const base = est.lines[0]?.amount ?? null;
  const ok = base === null && est.quoteOnly === true;
  if (!ok) securityFailures.push(route.url);
  console.log(`  ${pad(route.url, 50)} base=${base === null ? 'none' : INR(base)}  quoteOnly=${est.quoteOnly}  ${ok ? 'ok' : '*** LEAKED A NUMBER ***'}`);
}
if (!securityRoutes.length) console.log('  (no security-cabin route resolved from the sitemap)');

// ---------------------------------------------------------------------------
// GATE 5 — THE 36-50 SLIDE. The seven sizes SAMAN ruled on, exact.
// Rate to the paisa, total to the rupee.
// ---------------------------------------------------------------------------
// `base` is the figure after the monotonic cap of 07 Aug. `l2dTicket` is the
// figure the CALC-L2d ticket tabulated: it differs by Rs 1 on exactly the two
// sizes whose total lands on an exact half-rupee, which is a rounding-convention
// question rather than a cap question. Both are printed so the difference cannot
// hide. The assertion follows the AUTHORITY file, rate card v2 §3.
//
// RULED 07 Aug 2026, CALC-L3 §1: ROUND HALF UP. Rs 56,063 and Rs 59,063 stand,
// rate card v2 is correct, and the L2d ticket table is the side that is out by
// Rs 1. Math.round already rounds half toward +Infinity for positive values on
// both the server (baseCabinRateCard.ts) and the browser enhancer, so no
// arithmetic changed under this ruling — only the question closed. The dual
// column is deliberately KEPT: it is what surfaced the half-rupee at all, and a
// future change that starts moving either figure should still be made to say so.
const RULED_SLIDE = [
  { label: '6.5x6', length: 6.5, width: 6, area: 39.00, rate: 1437.50, base: 56063, l2dTicket: 56062, capped: false },
  { label: '7x6', length: 7, width: 6, area: 42.00, rate: 1375.00, base: 57750, l2dTicket: 57750, capped: false },
  { label: '6.5x6.5', length: 6.5, width: 6.5, area: 42.25, rate: 1369.79, base: 57874, l2dTicket: 57874, capped: false },
  { label: '7.5x6', length: 7.5, width: 6, area: 45.00, rate: 1312.50, base: 59063, l2dTicket: 59062, capped: false },
  { label: '7x6.5', length: 7, width: 6.5, area: 45.50, rate: 1302.08, base: 59245, l2dTicket: 59245, capped: false },
  { label: '7.5x6.5', length: 7.5, width: 6.5, area: 48.75, rate: 1231.25, base: 60000, l2dTicket: 60000, capped: true },
  { label: '7x7', length: 7, width: 7, area: 49.00, rate: 1225.00, base: 60000, l2dTicket: 60000, capped: true },
];
console.log('\n36-50 SQ FT SLIDE — the seven ruled sizes, after the monotonic cap');
console.log(pad('SIZE', 10) + padL('AREA', 7) + padL('RATE', 11) + padL('RAW', 11) + padL('PRICE', 11) + padL('EXPECTED', 11) + padL('L2D TKT', 10) + '  STATUS');
const slideFailures = [];
const roundingConflicts = [];
for (const row of RULED_SLIDE) {
  const got = baseCabinRate(row.length, row.width);
  const rateOk = got && Math.abs(Number(got.ratePerSqft.toFixed(2)) - row.rate) < 0.005;
  const baseOk = got && got.basePriceExGst === row.base;
  const capOk = got && got.capped === row.capped;
  if (!rateOk || !baseOk || !capOk) slideFailures.push(row.label);
  if (row.base !== row.l2dTicket) roundingConflicts.push(row);
  console.log(
    pad(row.label, 10) + padL(row.area.toFixed(2), 7)
    + padL(got ? got.ratePerSqft.toFixed(2) : '—', 11)
    + padL(got ? INR(got.rawPriceExGst) : '—', 11)
    + padL(got ? INR(got.basePriceExGst) : '—', 11) + padL(INR(row.base), 11)
    + padL(INR(row.l2dTicket), 10)
    + (rateOk && baseOk && capOk ? (row.capped ? '  ok, capped' : '  ok') : '  *** MISMATCH ***')
    + (row.base !== row.l2dTicket ? '  <- ticket differs by Rs 1' : '')
  );
}

// ---------------------------------------------------------------------------
// GATE 6 — MONOTONICITY across the entire selectable range.
//
// Two different claims live here and the difference matters:
//
//   RATE monotonicity  — the rate per sq ft never rises as the cabin grows.
//                        This is SAMAN's stated invariant in v1: "the larger
//                        cabin never pays more per square foot".
//   TOTAL monotonicity — no size costs less in rupees than a smaller one.
//                        This is what rate card v2 §64 asserts and what this
//                        ticket gates on.
//
// They are not the same claim, and a banded card can satisfy the first while
// failing the second: at a band edge the rate drops for the WHOLE area at once,
// so the total falls even though the cabin got bigger. Both are measured and
// both are reported, because reporting only the one that passes would be the
// same failure mode as the old "342 rows, 0 mismatches" check.
// ---------------------------------------------------------------------------
// THE STATED POINTS. The cap must be a no-op on every figure SAMAN stated.
const STATED_POINTS = [
  { label: '4x4x7 fixed', length: 4, width: 4, price: 38400 },
  { label: '6x4x8 fixed', length: 6, width: 4, price: 46800 },
  { label: '5x5x7 fixed', length: 5, width: 5, price: 53750 },
  { label: '6x6x8 fixed', length: 6, width: 6, price: 54000 },
  { label: '8x6x8 fixed', length: 8, width: 6, price: 60000 },
  { label: '50 sq ft anchor', length: 10, width: 5, price: 60000 },
  { label: '70 sq ft anchor', length: 10, width: 7, price: 80500 },
  { label: '90 sq ft anchor', length: 10, width: 9, price: 99000 },
  { label: '150 sq ft anchor', length: 15, width: 10, price: 157500 },
  { label: '200 sq ft anchor', length: 20, width: 10, price: 200000 },
  { label: '400 sq ft (40x10)', length: 40, width: 10, price: 400000 },
];
console.log('\nSTATED POINTS — the cap must never touch one');
console.log(pad('POINT', 20) + pad('SIZE', 10) + padL('RAW', 12) + padL('PRICE', 12) + padL('STATED', 12) + '  STATUS');
const statedFailures = [];
for (const point of STATED_POINTS) {
  const got = baseCabinRate(point.length, point.width);
  const ok = got && got.basePriceExGst === point.price && got.capped === false;
  if (!ok) statedFailures.push(point.label);
  console.log(
    pad(point.label, 20) + pad(`${point.length}x${point.width}`, 10)
    + padL(got ? INR(got.rawPriceExGst) : '—', 12)
    + padL(got ? INR(got.basePriceExGst) : '—', 12) + padL(INR(point.price), 12)
    + (ok ? '  ok, untouched' : `  *** ${got && got.capped ? 'CAP MOVED A STATED POINT' : 'MISMATCH'} ***`)
  );
}

// THE FULL SWEEP the ruling was verified over: 36 to 400 sq ft at 0.25 steps.
// Area-driven, so it covers areas no length x width pair on the 0.5 ft grid can
// reach — a stricter test than the selectable grid alone.
const sweepInversions = [];
let sweepPrevious = null;
for (let a = 36; a <= 400 + 1e-9; a += 0.25) {
  const area = Number(a.toFixed(2));
  const raw = rawExpected(area);
  if (!raw) continue;
  const price = Math.min(raw.base, expectedCeiling(area));
  if (sweepPrevious && price < sweepPrevious.price) {
    sweepInversions.push({ previous: sweepPrevious, current: { area, price }, drop: sweepPrevious.price - price });
  }
  sweepPrevious = { area, price };
}
console.log(`\nFULL SWEEP — 36 to 400 sq ft at 0.25 steps: ${sweepInversions.length === 0 ? 'ZERO non-monotonic points' : `*** ${sweepInversions.length} INVERSION(S) ***`}`);
for (const item of sweepInversions.slice(0, 8)) {
  console.log(`    ${item.previous.area} sq ft ${INR(item.previous.price)} -> ${item.current.area} sq ft ${INR(item.current.price)}  (-${item.drop})`);
}

const priced = [];
for (let l = SIZE_MIN; l <= SIZE_MAX + 1e-9; l += SIZE_STEP) {
  for (let w = SIZE_MIN; w <= l + 1e-9; w += SIZE_STEP) {
    const length = Number(l.toFixed(1));
    const width = Number(w.toFixed(1));
    const rate = baseCabinRate(length, width);
    if (!rate) continue;
    priced.push({ length, width, area: Number((length * width).toFixed(4)), rate: rate.ratePerSqft, base: rate.basePriceExGst, source: rate.source });
  }
}
// One row per distinct area — the cheapest reading of that area, which is what a
// buyer could actually pay for it.
const byArea = new Map();
for (const row of priced) {
  const seen = byArea.get(row.area);
  if (!seen || row.base < seen.base) byArea.set(row.area, row);
}
const ladderRows = [...byArea.values()].sort((a, b) => a.area - b.area);

const rateInversions = [];
const totalInversions = [];
for (let i = 1; i < ladderRows.length; i += 1) {
  const previous = ladderRows[i - 1];
  const current = ladderRows[i];
  if (current.rate > previous.rate + 1e-9) rateInversions.push({ previous, current });
  if (current.base < previous.base) totalInversions.push({ previous, current, drop: previous.base - current.base });
}

console.log(`\nMONOTONICITY — ${ladderRows.length} distinct priced areas from ${SIZE_MIN} to ${SIZE_MAX} ft`);
console.log(`  RATE per sq ft never rises with area:  ${rateInversions.length === 0 ? 'HOLDS' : `*** ${rateInversions.length} VIOLATION(S) ***`}`);
console.log(`  TOTAL never falls as area grows:       ${totalInversions.length === 0 ? 'HOLDS' : `*** ${totalInversions.length} VIOLATION(S) ***`}`);
for (const item of rateInversions.slice(0, 10)) {
  console.log(`    rate rises: ${item.previous.area} sq ft @${item.previous.rate} -> ${item.current.area} sq ft @${item.current.rate}`);
}
if (totalInversions.length) {
  console.log('\n  TOTAL INVERSIONS — a larger cabin costing less than a smaller one:');
  console.log('  ' + pad('SMALLER', 22) + pad('LARGER', 22) + padL('DROP', 12) + '  WHERE');
  const worst = [...totalInversions].sort((a, b) => b.drop - a.drop);
  for (const item of worst.slice(0, 12)) {
    console.log('  '
      + pad(`${item.previous.area} sq ft ${INR(item.previous.base)}`, 22)
      + pad(`${item.current.area} sq ft ${INR(item.current.base)}`, 22)
      + padL('-' + item.drop.toLocaleString('en-IN'), 12)
      + `  ${item.previous.source} -> ${item.current.source}`);
  }
  if (worst.length > 12) console.log(`  ... and ${worst.length - 12} more`);
}

// ---------------------------------------------------------------------------
// GATE 7 — STOP LIST. Selectable sizes UNDER 36 sq ft that are not fixed sizes.
// v2 §3: below 36 sq ft only the fixed sizes exist. Reported, never priced.
// ---------------------------------------------------------------------------
const sweep = [];
for (let l = SIZE_MIN; l <= SIZE_MAX + 1e-9; l += SIZE_STEP) {
  for (let w = SIZE_MIN; w <= l + 1e-9; w += SIZE_STEP) {
    const length = Number(l.toFixed(1));
    const width = Number(w.toFixed(1));
    const area = Number((length * width).toFixed(2));
    if (area > 50) continue;
    if (baseCabinRate(length, width) !== null) continue;
    sweep.push({ length, width, area });
  }
}
console.log('\nSTOP LIST — selectable sizes with NO rate (under 36 sq ft, not a fixed size)');
console.log(`The size inputs accept ${SIZE_MIN} to ${SIZE_MAX} ft in ${SIZE_STEP} ft steps. Below 36 sq ft the ruling states`);
console.log('only the fixed sizes exist, so these render quote mode. Interpolation refused outside 36-50.\n');
console.log(pad('L x W (ft)', 16) + padL('AREA', 9) + '   RULING');
for (const s of sweep.sort((a, b) => a.area - b.area)) {
  console.log(pad(`${s.length} x ${s.width}`, 16) + padL(s.area, 9) + '   no rate stated — quote mode');
}
console.log(`\n  ${sweep.length} selectable size${sweep.length === 1 ? '' : 's'} carry no rate.`);
console.log('  Reachable fixed sizes on these inputs: '
  + FIXED_RATE_SIZES.filter((s) => Math.min(s.lengthFt, s.widthFt) >= SIZE_MIN).map((s) => s.sizeLabel).join(', '));
console.log('  UNREACHABLE fixed sizes (a side below the input minimum): '
  + (FIXED_RATE_SIZES.filter((s) => Math.min(s.lengthFt, s.widthFt) < SIZE_MIN).map((s) => s.sizeLabel).join(', ') || 'none'));

// ---------------------------------------------------------------------------
// GATE 8 — the copy describes the rate card, not a published price list.
//
// Every phrase below asserts the model SAMAN's ruling replaced: that the base
// price comes from the published product ladder. Under the two-price doctrine
// it does not, so a surviving occurrence is a factual error on the page, not a
// wording preference. Scanned in three places because the same sentence can
// exist three times: the copy module, the rendered SSR output, and the FAQPage
// JSON-LD on the page, which is a SECOND hand-maintained copy of the FAQ.
// ---------------------------------------------------------------------------
const BANNED_PHRASES = ['published price list', 'listed price', 'published formula', 'standard nine sizes'];
const copySources = [
  ['src/lib/calculatorCopy.ts', fs.readFileSync(path.join(process.cwd(), 'src/lib/calculatorCopy.ts'), 'utf8')],
  ['src/pages/cabin-cost-calculator.tsx (FAQPage JSON-LD)', fs.readFileSync(path.join(process.cwd(), 'src/pages/cabin-cost-calculator.tsx'), 'utf8')],
  ['rendered SSR output', renderCabinCalculatorSSR({ reference: 'GATE', pageUrl: '/gate' })],
  ['rendered FAQ output', ssr.renderCalculatorFaq()],
];
console.log('\nRATE-CARD COPY — zero occurrences of the published-price-list model');
const phraseHits = [];
for (const [where, text] of copySources) {
  for (const phrase of BANNED_PHRASES) {
    const count = text.split(phrase).length - 1;
    if (count > 0) phraseHits.push({ where, phrase, count });
  }
}
console.log(pad('PHRASE', 26) + pad('WHERE', 46) + 'COUNT');
for (const phrase of BANNED_PHRASES) {
  const hits = phraseHits.filter((h) => h.phrase === phrase);
  if (!hits.length) {
    console.log(pad(phrase, 26) + pad('—', 46) + '0  ok');
  } else {
    for (const hit of hits) console.log(pad(hit.phrase, 26) + pad(hit.where, 46) + `${hit.count}  *** STILL PRESENT ***`);
  }
}

// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(133));
console.log(`GATE 1 price table:     ${rowCount - mismatches.length} of ${rowCount} route/size rows agree with the independent recomputation.`);
console.log(`GATE 2 boundary proof:  ${BOUNDARIES.length - boundaryFailures.length} of ${BOUNDARIES.length} edges take the cheaper rate.`);
console.log(`GATE 3 fixed sizes:     ${FIXED_RATE_SIZES.length - fixedFailures.length} of ${FIXED_RATE_SIZES.length} exact to the rupee.`);
console.log(`GATE 4 security cabins: ${securityRoutes.length - securityFailures.length} of ${securityRoutes.length} in quote mode with no number.`);
console.log(`GATE 5 36-50 slide:     ${RULED_SLIDE.length - slideFailures.length} of ${RULED_SLIDE.length} exact — rate to the paisa, total to the rupee.`);
console.log(`GATE 6 monotonicity:    TOTAL ${totalInversions.length === 0 ? 'HOLDS' : `FAILS (${totalInversions.length})`} across ${ladderRows.length} selectable areas · full sweep 36-400 @0.25 ${sweepInversions.length === 0 ? 'HOLDS' : `FAILS (${sweepInversions.length})`}.`);
console.log(`       rate monotonicity: ${rateInversions.length === 0 ? 'holds' : `${rateInversions.length} inversion(s)`} — reported, NOT a gate (ruled 07 Aug: two products may carry different per-sq-ft rates).`);
console.log(`GATE 9 stated points:   ${STATED_POINTS.length - statedFailures.length} of ${STATED_POINTS.length} untouched by the cap.`);
console.log(`GATE 7 stop list:       ${sweep.length} selectable sizes with no rate — reported for SAMAN, not priced.`);
console.log(`GATE 8 rate-card copy:  ${phraseHits.length === 0 ? 'clean' : `*** ${phraseHits.reduce((n, h) => n + h.count, 0)} occurrence(s) of the published-price-list model remain ***`}`);
if (mismatches.length) {
  console.log('\nMISMATCHES:');
  for (const m of mismatches) console.log(`  ${m.route}  ${m.size.length}x${m.size.width}  ${m.why}`);
}
if (totalInversions.length) {
  const worst = Math.max(...totalInversions.map((i) => i.drop));
  console.log(`\nSTOP: total monotonicity is violated at ${totalInversions.length} step(s), worst ${INR(worst)}.`);
  console.log('      Rate card v2 asserts totals are monotonic across the whole range. They are not, and the');
  console.log('      cause is structural, not a coding error: the bands apply their rate to the WHOLE area, so');
  console.log('      at every band edge the total drops even though the cabin grew. Needs a ruling.');
}
if (phraseHits.length) {
  console.log('\nSTOP: copy still asserting the published-price-list model:');
  for (const hit of phraseHits) console.log(`      "${hit.phrase}" x${hit.count} in ${hit.where}`);
}
if (roundingConflicts.length) {
  console.log('\nNOTE — rounding convention, RULED 07 Aug 2026 (CALC-L3 §1): round half up.');
  for (const row of roundingConflicts) {
    console.log(`      ${row.label} ${row.area} sq ft x ${row.rate} = ${(row.area * row.rate).toFixed(2)} exactly.`);
    console.log(`        rate card v2 table: ${INR(row.base)}   ·   CALC-L2d ticket table: ${INR(row.l2dTicket)}`);
  }
  console.log('      Both land on an exact half-rupee. Ruled: round half up, so v2 stands and the');
  console.log('      L2d ticket table is the one that is out by Rs 1. The build already follows v2.');
  console.log('      The dual column stays: it caught this and it keeps watching.');
}
// Rate monotonicity is reported, not gated: ruled 07 Aug that two distinct
// products may carry different per-sq-ft rates. Only TOTAL monotonicity gates.
process.exit(
  mismatches.length || boundaryFailures.length || fixedFailures.length
  || securityFailures.length || slideFailures.length || statedFailures.length
  || totalInversions.length || sweepInversions.length || phraseHits.length
    ? 1 : 0
);
