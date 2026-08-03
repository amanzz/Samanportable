/**
 * Route-level price identity test.
 *
 * The gate: for every route carrying a calculator, the calculator's BASE price
 * at that page's default size equals the price that page publishes, to the
 * rupee. Zero tolerance.
 *
 * This replaces the "342 rows, 0 mismatches" check in calculatorRates.ts, which
 * compared the area-band formula against the three ladders the formula was
 * derived from and therefore could not fail. This test compares each route
 * against the ladder that route's own page publishes, which is the thing a
 * buyer actually sees.
 *
 * Run: node scripts/calculator/verify-route-price-identity.mjs
 * Exit: 0 when every route matches, 1 otherwise.
 */
import jitiPkg from 'jiti';
import fs from 'fs';
import path from 'path';
import Module from 'node:module';

// The source uses the Next.js `@/…` path alias, which Node cannot resolve on
// its own and which jiti 1.x does not apply to nested requires. Rewrite the
// specifier at resolution time so the real modules load unmodified — the point
// of this test is to exercise the shipped pricing code, not a copy of it.
const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(SRC, request.slice(2));
  }
  return resolveFilename.call(this, request, ...rest);
};

const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const ssr = jiti('./src/lib/cabinCalculatorSSR.ts');
const embed = jiti('./src/lib/cabinCalculatorEmbedRoutes.ts');

const { computeCalculatorEstimate, DEFAULT_CALCULATOR_CONFIG, PRODUCTS } = ssr;
const { resolveEmbeddedCalculatorProduct } = embed;

/**
 * Every route carrying a calculator, enumerated from the sitemap and filtered
 * through the real resolver — not a hand-maintained list, so a route added
 * later cannot silently escape the gate.
 *
 * The invariant is two-sided:
 *   page publishes a ladder  -> calculator base must equal it, to the rupee
 *   page publishes no ladder -> calculator must be in quote mode, no number
 */
const sitemap = fs.readFileSync(path.join(process.cwd(), 'public', 'sitemap-products.xml'), 'utf8');
const ROUTES = [...new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1].split('samanportable.com')[1] || '')
    .filter((u) => u.startsWith('/product/'))
)].sort().map((url) => {
  const parts = url.replace(/\/$/, '').split('/').filter(Boolean);
  return { url, category: parts[1], slug: parts[2] };
}).filter((r) => r.category);

const COLONY = new Set(['labour-colony', 'labor-sheds', 'labor-hutments', 'prefab-labor-camps']);
const INR = (n) => (n === null || n === undefined ? 'quote mode' : '₹' + Number(n).toLocaleString('en-IN'));

function loadLadder(jsonSlug) {
  const p = path.join(process.cwd(), 'src', 'data', 'products', `${jsonSlug}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function dims(sizeSlug) {
  const m = String(sizeSlug).match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/i);
  return m ? { length: Number(m[1]), width: Number(m[2]) } : null;
}

const rows = [];
for (const { url: route, category, slug } of ROUTES) {
  const mapping = resolveEmbeddedCalculatorProduct(category, slug);
  if (!mapping) continue;
  const productId = mapping.productId;
  const def = PRODUCTS.find((p) => p.id === productId) || null;

  const data = loadLadder(slug || category);
  const variants = data?.variants || [];
  const variant =
    variants.find((v) => v.sizeSlug === data?.defaultVariant) || variants[0] || null;
  const published = variant?.priceExGst ?? null;

  let calculated = null;
  let note = '';
  if (productId) {
    // Exactly what the page passes: the route's own ladder key from the same
    // resolver the product templates call.
    const cfg = {
      ...DEFAULT_CALCULATOR_CONFIG,
      productId,
      ladderKey: mapping?.ladderKey ?? null,
      quantity: 1,
    };
    if (COLONY.has(productId)) {
      const idx = variants.findIndex((v) => v.sizeSlug === data?.defaultVariant);
      cfg.colonyVariant = idx >= 0 ? idx : 0;
    } else {
      const d = variant ? dims(variant.sizeSlug) : null;
      if (d) {
        cfg.length = d.length;
        cfg.width = d.width;
      } else {
        note = `could not parse size "${variant?.sizeSlug}"`;
      }
    }
    const est = computeCalculatorEstimate(cfg);
    calculated = est.lines[0]?.amount ?? null;
  }

  const rate = COLONY.has(productId)
    ? 'colony block ladder'
    : calculated === null
      ? 'no ladder (quote mode)'
      : `ladder ${mapping.ladderKey || def?.ladderKey}`;

  const diff = published !== null && calculated !== null ? calculated - published : null;
  // Two-sided invariant: no published ladder must mean no calculated number.
  const bothAbsent = published === null && calculated === null;
  if (bothAbsent) note = 'page publishes no ladder; calculator in quote mode';
  rows.push({
    route,
    size: variant?.label ?? '—',
    productId,
    rate,
    published,
    calculated,
    diff,
    ok: diff === 0 || bothAbsent,
    note,
  });
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

console.log('ROUTE-LEVEL PRICE IDENTITY TEST');
console.log('Base price at each page\'s default size. Zero tolerance.\n');
console.log(
  pad('ROUTE', 54) + pad('SIZE', 15) + pad('RATE USED', 24) +
  padL('PUBLISHED', 14) + padL('CALCULATED', 14) + padL('DIFF', 13) + '  '
);
console.log('-'.repeat(138));
for (const r of rows) {
  console.log(
    pad(r.route, 54) + pad(r.size, 15) + pad(r.rate, 24) +
    padL(INR(r.published), 14) + padL(INR(r.calculated), 14) +
    padL(r.diff === null ? 'n/a' : (r.diff === 0 ? '0' : (r.diff > 0 ? '+' : '') + r.diff.toLocaleString('en-IN')), 13) +
    '  ' + (r.ok ? 'ok' : '*** MISMATCH ***') + (r.note ? '  ' + r.note : '')
  );
}

// ---------------------------------------------------------------------------
// Gate 2 — Container House ladders equal the published C-08 values, rupee for
// rupee, and are stored rather than recomputed.
// ---------------------------------------------------------------------------
const C08_PUBLISHED = {
  'container-houses': [293440, 333400, 384240, 501440, 626800, 736320],
  'prefab-container-homes': [259520, 295000, 339840, 443520, 554400, 651360],
  'shipping-container-homes': [364320, 414000, 476880, 622720, 778400, 913920],
  'affordable-container-homes': [252960, 287600, 331200, 432320, 540400, 634560],
  'luxury-container-houses': [380160, 432000, 497760, 649600, 812000, 953760],
};
const ladders = jiti('./src/lib/calculatorLadders.ts');
const houseFailures = [];
console.log('\nCONTAINER HOUSE LADDERS — stored values vs published C-08 values');
for (const [key, expected] of Object.entries(C08_PUBLISHED)) {
  const actual = (ladders.getRouteLadder(key) || []).map((r) => r.priceExGst);
  const same = actual.length === expected.length && actual.every((v, i) => v === expected[i]);
  if (!same) houseFailures.push({ key, expected, actual });
  console.log(`  ${pad(key, 28)} ${same ? `${actual.length} of ${expected.length} exact` : 'MISMATCH'}`);
  if (!same) {
    console.log(`      expected ${expected.join(', ')}`);
    console.log(`      actual   ${actual.join(', ')}`);
  }
}

// ---------------------------------------------------------------------------
// Gate 3 — a product with no ladder of its own renders quote mode with no
// number. It must not inherit a rate from a parent, sibling or reference row.
// ---------------------------------------------------------------------------
const NO_LADDER = ['security-cabin', 'accommodation-cabin', 'prefab-modular-home', 'container-cafe'];
const quoteFailures = [];
console.log('\nNO-LADDER PRODUCTS — must render quote mode with no number');
for (const productId of NO_LADDER) {
  const est = computeCalculatorEstimate({
    ...DEFAULT_CALCULATOR_CONFIG,
    productId,
    ladderKey: null,
    quantity: 1,
  });
  const base = est.lines[0]?.amount ?? null;
  const ok = base === null && est.quoteOnly === true;
  if (!ok) quoteFailures.push({ productId, base, quoteOnly: est.quoteOnly });
  console.log(`  ${pad(productId, 28)} base=${base === null ? 'none' : INR(base)}  quoteOnly=${est.quoteOnly}  ${ok ? 'ok' : '*** LEAKED A NUMBER ***'}`);
}

const failed = rows.filter((r) => !r.ok);
console.log('\n' + '='.repeat(138));
console.log(`RESULT: ${rows.length - failed.length} of ${rows.length} routes at zero difference.`);
console.log(`        ${Object.keys(C08_PUBLISHED).length - houseFailures.length} of ${Object.keys(C08_PUBLISHED).length} container-house ladders exact to the rupee.`);
console.log(`        ${NO_LADDER.length - quoteFailures.length} of ${NO_LADDER.length} no-ladder products in quote mode with no number.`);
if (failed.length) {
  const over = failed.filter((r) => r.diff > 0);
  const under = failed.filter((r) => r.diff < 0);
  const quote = failed.filter((r) => r.diff === null);
  console.log(`FAILED: ${failed.length} routes.`);
  if (over.length) console.log(`  overpriced vs published: ${over.length} (worst +₹${Math.max(...over.map((r) => r.diff)).toLocaleString('en-IN')})`);
  if (under.length) console.log(`  underpriced vs published: ${under.length} (worst -₹${Math.abs(Math.min(...under.map((r) => r.diff))).toLocaleString('en-IN')})`);
  if (quote.length) console.log(`  no comparable number: ${quote.length}`);
}
process.exit(failed.length || houseFailures.length || quoteFailures.length ? 1 : 0);
