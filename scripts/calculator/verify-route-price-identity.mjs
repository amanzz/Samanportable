/**
 * Route-level PUBLISHED PRICE test — what survives of the 03 Aug identity gate.
 *
 * RETIRED, 06 Aug 2026, by SAMAN's base-cabin rate card ruling:
 *
 *   The old gate 1 asserted "the calculator's base at a page's default size
 *   equals that page's published price, to the rupee." SAMAN's two-price
 *   doctrine makes that assertion false BY DESIGN. The page publishes the
 *   FINISHED product with every fitting in it; the calculator now opens at the
 *   BARE cabin from the rate card and grows as the buyer adds fittings. The
 *   opening figure is deliberately lower. Asserting they are equal would now
 *   re-introduce the defect the ruling was written to remove — an estimate that
 *   starts at the finished price and then charges for the fittings again.
 *
 * What survives, and is asserted below:
 *
 *   1. The PUBLISHED ladder is unchanged. Each route's ladder row still equals
 *      that route's own page JSON, to the rupee, so the page, the band headline,
 *      the feed and the PDF are untouched by the calculator work. The
 *      calculator's base is printed beside it and is EXPECTED to differ — the
 *      column is there so a reviewer can see the gap the doctrine creates.
 *   2. Container House ladders equal the published C-08 values exactly.
 *   3. A product with no ladder of its own renders quote mode with no number.
 *
 * The calculator's base figure is gated separately and in full by
 * scripts/calculator/verify-base-cabin-rate-card.mjs.
 *
 * Run: node scripts/calculator/verify-route-price-identity.mjs
 * Exit: 0 when every published ladder still matches its page, 1 otherwise.
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
const ladders = jiti('./src/lib/calculatorLadders.ts');

const { computeCalculatorEstimate, DEFAULT_CALCULATOR_CONFIG, PRODUCTS } = ssr;
const { resolveEmbeddedCalculatorProduct } = embed;

/**
 * Every route carrying a calculator, enumerated from the sitemap and filtered
 * through the real resolver — not a hand-maintained list, so a route added
 * later cannot silently escape the gate.
 *
 * The invariant is two-sided:
 *   page publishes a ladder  -> the shipped ladder must equal it, to the rupee
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

/**
 * Container-house product JSONs live on origin/agent/c08-container-houses-build-20260802,
 * which is not merged, so there is no in-repo page ladder to read for these
 * five routes. Their published authority is the C-08 transcription asserted
 * exactly by the container-house gate further down. Default size is 20x10.
 */
const C08_ROUTE_AUTHORITY = {
  'container-houses': { sizeSlug: '20x10', label: '20x10 ft', priceExGst: 333400 },
  'prefab-container-homes': { sizeSlug: '20x10', label: '20x10 ft', priceExGst: 295000 },
  'shipping-container-homes': { sizeSlug: '20x10', label: '20x10 ft', priceExGst: 414000 },
  'affordable-container-homes': { sizeSlug: '20x10', label: '20x10 ft', priceExGst: 287600 },
  'luxury-container-houses': { sizeSlug: '20x10', label: '20x10 ft', priceExGst: 432000 },
};

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

  const key = slug || category;
  const data = loadLadder(key);
  const variants = data?.variants || [];
  let variant =
    variants.find((v) => v.sizeSlug === data?.defaultVariant) || variants[0] || null;
  let source = variant ? 'page JSON' : '';
  if (!variant && C08_ROUTE_AUTHORITY[key]) {
    variant = C08_ROUTE_AUTHORITY[key];
    source = 'C-08 transcription';
  }
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
      : 'base-cabin rate card';

  // THE ASSERTION. Not "calculator == page" any more, but "the ladder the site
  // publishes still equals the page's own data". The calculator's base is
  // carried alongside as information, and is expected to sit below it.
  const d = variant ? dims(variant.sizeSlug) : null;
  const laddered = COLONY.has(productId) || !d
    ? published
    : ladders.ladderPriceFor(mapping.ladderKey ?? def?.ladderKey, d.length, d.width);

  const gap = published !== null && calculated !== null ? calculated - published : null;
  const bothAbsent = published === null && calculated === null;
  if (bothAbsent) note = 'page publishes no ladder; calculator in quote mode';
  rows.push({
    route,
    size: variant?.label ?? '—',
    productId,
    rate,
    published,
    laddered,
    calculated,
    gap,
    ok: bothAbsent || laddered === published,
    note: note || (source === 'C-08 transcription' ? 'published figure from C-08 transcription; product JSON not on this branch' : note),
  });
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

console.log('PUBLISHED LADDER UNCHANGED — the finished-product price the page, band headline, feed and PDF carry');
console.log('Gated: PAGE == LADDER, zero tolerance. Shown: the calculator base, which the two-price doctrine puts BELOW it.\n');
console.log(
  pad('ROUTE', 54) + pad('SIZE', 15) + pad('CALC BASE FROM', 22) +
  padL('PAGE', 13) + padL('LADDER', 13) + padL('CALC BASE', 13) + padL('GAP', 13) + '  '
);
console.log('-'.repeat(146));
for (const r of rows) {
  console.log(
    pad(r.route, 54) + pad(r.size, 15) + pad(r.rate, 22) +
    padL(INR(r.published), 13) + padL(INR(r.laddered), 13) + padL(INR(r.calculated), 13) +
    padL(r.gap === null ? 'n/a' : (r.gap === 0 ? '0' : (r.gap > 0 ? '+' : '') + r.gap.toLocaleString('en-IN')), 13) +
    '  ' + (r.ok ? 'ok' : '*** PUBLISHED PRICE MOVED ***') + (r.note ? '  ' + r.note : '')
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
// Derived, not hand-listed. This was a literal array until CALC-L4 (09 Aug
// 2026), when container-cafe gained the six-row ladder its own pages publish
// and the stale entry then failed the gate for having stopped being true.
// A list of "products with no ladder" that does not ask the ladder table is a
// second source of truth about the thing the ladder table already knows.
// Colony products are excluded: they price from a block ladder chosen by index,
// not from a length x width row, so they are not quote-mode products.
const COLONY_PRODUCT_IDS = new Set(['labour-colony', 'labor-sheds', 'labor-hutments', 'prefab-labor-camps']);
const NO_LADDER = PRODUCTS
  .filter((product) => !COLONY_PRODUCT_IDS.has(product.id))
  .filter((product) => !ladders.getRouteLadder(product.ladderKey))
  .map((product) => product.id);
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
const gaps = rows.filter((r) => r.gap !== null);
const above = gaps.filter((r) => r.gap > 0);
console.log('\n' + '='.repeat(146));
console.log(`RESULT: ${rows.length - failed.length} of ${rows.length} routes still publish exactly what their page publishes.`);
console.log(`        ${Object.keys(C08_PUBLISHED).length - houseFailures.length} of ${Object.keys(C08_PUBLISHED).length} container-house ladders exact to the rupee.`);
console.log(`        ${NO_LADDER.length - quoteFailures.length} of ${NO_LADDER.length} no-ladder products in quote mode with no number.`);
if (gaps.length) {
  const worst = Math.abs(Math.min(...gaps.map((r) => r.gap)));
  console.log(`\nTWO-PRICE DOCTRINE, observed: the calculator base sits below the published finished price on`);
  console.log(`        ${gaps.length - above.length} of ${gaps.length} priced routes (widest gap -₹${worst.toLocaleString('en-IN')}).`);
  if (above.length) {
    console.log(`        *** ${above.length} route(s) open ABOVE the published finished price, which inverts the doctrine:`);
    for (const r of above) console.log(`            ${r.route}  ${r.size}  page ${INR(r.published)} -> base ${INR(r.calculated)}`);
  }
}
if (failed.length) {
  console.log(`FAILED: ${failed.length} routes whose published price no longer matches their page.`);
  for (const r of failed) console.log(`  ${r.route}  page ${INR(r.published)} vs ladder ${INR(r.laddered)}`);
}
process.exit(failed.length || houseFailures.length || quoteFailures.length ? 1 : 0);
