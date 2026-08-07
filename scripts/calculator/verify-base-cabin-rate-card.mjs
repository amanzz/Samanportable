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
const { computeCalculatorEstimate, DEFAULT_CALCULATOR_CONFIG } = ssr;
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
  if (area <= 50) return null;          // no rate stated — STOP
  // Edge takes the cheaper rate, so every comparison is strict "<".
  const rate = area < 70 ? 1200
    : area < 90 ? 1150
      : area < 150 ? 1100
        : area < 200 ? 1050
          : 1000;
  return { rate, base: Math.round(area * rate), why: `band ${rate}` };
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

// The size inputs the buyer actually drives: length and width, 6 to 60 ft in
// 0.5 ft steps (min/max/step declared on the number fields in step 2).
const SIZE_MIN = 6, SIZE_MAX = 60, SIZE_STEP = 0.5;

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
// GATE 5 — STOP LIST. Every selectable size at or under 50 sq ft that is not
// one of the five fixed sizes. Reported, never priced, never interpolated.
// ---------------------------------------------------------------------------
const sweep = [];
for (let l = SIZE_MIN; l <= SIZE_MAX; l += SIZE_STEP) {
  for (let w = SIZE_MIN; w <= l; w += SIZE_STEP) {
    const area = Number((l * w).toFixed(2));
    if (area > 50) continue;
    if (baseCabinRate(l, w) !== null) continue;
    sweep.push({ length: l, width: w, area });
  }
}
console.log('\nSTOP LIST — selectable sizes at or under 50 sq ft with NO rate from SAMAN');
console.log('The size inputs accept 6 to 60 ft in 0.5 ft steps. These combinations land at or under 50 sq ft');
console.log('and are not one of the five fixed sizes, so the ruling forbids pricing them. Interpolation refused.\n');
console.log(pad('L x W (ft)', 16) + padL('AREA', 9) + '   RULING');
for (const s of sweep) {
  console.log(pad(`${s.length} x ${s.width}`, 16) + padL(s.area, 9) + '   no rate stated — STOP and ask');
}
console.log(`\n  ${sweep.length} selectable size${sweep.length === 1 ? '' : 's'} at or under 50 sq ft carry no rate.`);
console.log('  Reachable fixed sizes on these inputs: '
  + FIXED_RATE_SIZES.filter((s) => Math.min(s.lengthFt, s.widthFt) >= SIZE_MIN).map((s) => s.sizeLabel).join(', '));
console.log('  UNREACHABLE fixed sizes (a width below the 6 ft input minimum): '
  + (FIXED_RATE_SIZES.filter((s) => Math.min(s.lengthFt, s.widthFt) < SIZE_MIN).map((s) => s.sizeLabel).join(', ') || 'none'));

// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(133));
console.log(`GATE 1 price table:     ${rowCount - mismatches.length} of ${rowCount} route/size rows agree with the independent recomputation.`);
console.log(`GATE 2 boundary proof:  ${BOUNDARIES.length - boundaryFailures.length} of ${BOUNDARIES.length} edges take the cheaper rate.`);
console.log(`GATE 3 fixed sizes:     ${FIXED_RATE_SIZES.length - fixedFailures.length} of ${FIXED_RATE_SIZES.length} exact to the rupee.`);
console.log(`GATE 4 security cabins: ${securityRoutes.length - securityFailures.length} of ${securityRoutes.length} in quote mode with no number.`);
console.log(`GATE 5 stop list:       ${sweep.length} selectable sizes with no rate — reported for SAMAN, not priced.`);
if (mismatches.length) {
  console.log('\nMISMATCHES:');
  for (const m of mismatches) console.log(`  ${m.route}  ${m.size.length}x${m.size.width}  ${m.why}`);
}
process.exit(mismatches.length || boundaryFailures.length || fixedFailures.length || securityFailures.length ? 1 : 0);
