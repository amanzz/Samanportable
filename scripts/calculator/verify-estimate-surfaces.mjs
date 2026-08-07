/**
 * Estimate surfaces, and the quantities that reach them.
 *
 * Two defects, both found in the CALC-L2 report and fixed under CALC-L2b. This
 * gate exists so neither can come back quietly.
 *
 * 1. THE SIDEBAR CONTRADICTION.
 *    The page renders more than one itemised estimate panel. The enhancer
 *    repainted only the FIRST one it found, which is the hidden step-9 copy —
 *    the sidebar a buyer actually reads came second and never moved. At 8x6 it
 *    showed the line "Base cabin 20x10 ft  Rs 2,00,000" above its own total of
 *    Rs 70,980: two numbers Rs 1,29,020 apart on one screen.
 *
 * 2. THE SSR PRICING GAP.
 *    The sanitiser validated posted quantities against the legacy ELECTRICAL /
 *    ADD_ONS arrays ("LED Panel Light") while the step rendered its controls
 *    from ELECTRICAL_R1 / FITOUT_R1 ("LED panel light") and the estimate priced
 *    from those too. The keys never matched, so the server silently discarded
 *    every electrical and fit-out item. A shared design that should have priced
 *    at Rs 2,26,310 was served at Rs 2,10,980 — a Rs 15,330 under-quote, and
 *    because the enhancer is deferred that figure painted for every buyer.
 *
 * Run:  node scripts/calculator/verify-estimate-surfaces.mjs
 * Exit: 0 when every assertion holds, 1 otherwise.
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
const ssr = jiti('./src/lib/cabinCalculatorSSR.ts');
const rates = jiti('./src/lib/calculatorComponentRates.ts');

const { renderCabinCalculatorSSR, computeCalculatorEstimate, DEFAULT_CALCULATOR_CONFIG } = ssr;
const { ELECTRICAL_R1, FITOUT_R1 } = rates;

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); return ok; };
const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const pad = (s, n) => String(s).padEnd(n);
const rateFor = (list, label) => list.find((item) => item.label === label)?.rate ?? null;

// ---------------------------------------------------------------------------
// 1 — every itemised surface the server renders, and they all open identically.
// ---------------------------------------------------------------------------
const html = renderCabinCalculatorSSR({ reference: 'GATE', pageUrl: '/gate' });
const lists = [...html.matchAll(/<dl class="estimate-lines" data-estimate-lines>([\s\S]*?)<\/dl>/g)].map((m) => m[1]);
console.log('ITEMISED ESTIMATE SURFACES RENDERED BY THE SERVER');
console.log(`  ${lists.length} list(s) carrying data-estimate-lines`);
check(lists.length >= 2, `expected at least 2 estimate lists, found ${lists.length}`);
const opening = lists.map((list) => (list.match(/<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/) || []).slice(1).join(' = '));
opening.forEach((line, index) => console.log(`    list ${index}: ${line}`));
check(new Set(opening).size === 1, `the server rendered different opening lines into different panels: ${opening.join(' vs ')}`);
check(opening[0].startsWith('Base cabin'), `the estimate does not open on a Base cabin line: "${opening[0]}"`);

// The panel's floor-area figure needs a hook of its own, and one per panel.
//
// It had none. The words came from the copy pack and the number was baked
// straight into the paragraph, so the enhancer could not reach it: a cabin set
// to 8x6 read "Floor area 200 sq ft" directly above a base cabin line that
// correctly said 8x6. The attribute sweep below did not find it either — it had
// no attribute to find — which is why it is asserted by count against the panels.
const areaHooks = html.split('data-estimate-area').length - 1;
console.log(`\n  floor-area hooks: ${areaHooks} for ${lists.length} panel(s)`);
check(areaHooks === lists.length, `every estimate panel needs its own data-estimate-area: ${areaHooks} hooks for ${lists.length} panels`);
const enhancerSource = fs.readFileSync(path.join(process.cwd(), 'public', 'scripts', 'cabin-cost-calculator.js'), 'utf8');
check(/setText\(\s*root,\s*'\[data-estimate-area\]'/.test(enhancerSource), 'the enhancer never repaints [data-estimate-area]');

// Other surfaces that carry a figure, so a future one is not forgotten.
const surfaces = [
  ['data-estimate-total', 'panel total'],
  ['data-estimate-total-note', 'panel total note'],
  ['data-mobile-estimate', 'mobile sticky bar'],
  ['data-summary-ex', 'header total ex-GST'],
  ['data-summary-incl', 'header total incl-GST'],
  ['data-base-price', 'drawing base-cabin tile'],
];
console.log('\nOTHER FIGURE-BEARING SURFACES');
for (const [attribute, name] of surfaces) {
  const count = html.split(attribute).length - 1;
  console.log(`  ${pad(name, 28)} ${pad(attribute, 26)} ${count}`);
  check(count > 0, `no ${name} (${attribute}) rendered`);
}

// ---------------------------------------------------------------------------
// 2 — the enhancer must repaint EVERY list, not the first.
//
// A static read of the shipped script. It is deliberately literal: the defect
// was one word, `querySelector` where `querySelectorAll` was meant, and a test
// that cannot see that word cannot see the defect.
// ---------------------------------------------------------------------------
const body = enhancerSource.slice(enhancerSource.indexOf('function renderEstimateLines'));
const fn = body.slice(0, body.indexOf('\n  }') + 4);
console.log('\nENHANCER REPAINT PATH');
const singular = /querySelector\(\s*'\[data-estimate-lines\]'\s*\)/.test(fn);
const plural = /querySelectorAll\(\s*'\[data-estimate-lines\]'\s*\)/.test(fn);
console.log(`  querySelectorAll('[data-estimate-lines]')  ${plural ? 'yes' : 'NO'}`);
console.log(`  querySelector('[data-estimate-lines]')     ${singular ? 'YES — only the first panel would repaint' : 'no'}`);
check(plural, 'renderEstimateLines does not select every [data-estimate-lines] list');
check(!singular, 'renderEstimateLines still uses the singular querySelector for [data-estimate-lines]');

// ---------------------------------------------------------------------------
// 3 — the server prices electrical and fit-out, and a key that differs only by
//     case or spacing still matches.
// ---------------------------------------------------------------------------
const base = { ...DEFAULT_CALCULATOR_CONFIG, productId: 'porta-cabin', ladderKey: 'porta-cabins', quantity: 1 };
const baseline = computeCalculatorEstimate(base).totalExGst;

const led = rateFor(ELECTRICAL_R1, 'LED panel light');
const fan = rateFor(ELECTRICAL_R1, 'Ceiling fan');
const plug = rateFor(ELECTRICAL_R1, 'Plug point (6A)');
const partition = rateFor(FITOUT_R1, 'Full-Height Dry Partition');

const cases = [
  {
    name: '6 x LED panel light',
    config: { electrical: { 'LED panel light': 6 } },
    expected: 6 * led,
  },
  {
    name: '2 x Ceiling fan + 3 x Plug point (6A)',
    config: { electrical: { 'Ceiling fan': 2, 'Plug point (6A)': 3 } },
    expected: 2 * fan + 3 * plug,
  },
  {
    name: '1 x Full-Height Dry Partition (fit-out)',
    config: { addOns: { 'Full-Height Dry Partition': 1 } },
    expected: partition,
  },
  {
    name: 'key drift "led  PANEL   light" still prices',
    config: { electrical: { 'led  PANEL   light': 6 } },
    expected: 6 * led,
  },
  {
    name: 'quantity 2 scales the electrical line',
    config: { quantity: 2, electrical: { 'LED panel light': 6 } },
    expected: 2 * 6 * led,
    baseline: computeCalculatorEstimate({ ...base, quantity: 2 }).totalExGst,
  },
];

console.log('\nSERVER-SIDE PRICING OF ELECTRICAL AND FIT-OUT');
console.log(`  ${pad('CASE', 46)} ${pad('DELTA', 13)} ${pad('EXPECTED', 13)} STATUS`);
for (const item of cases) {
  const from = item.baseline ?? baseline;
  const got = computeCalculatorEstimate({ ...base, ...item.config }).totalExGst - from;
  const ok = got === item.expected;
  check(ok, `${item.name}: server priced ${INR(got)}, expected ${INR(item.expected)}`);
  console.log(`  ${pad(item.name, 46)} ${pad(INR(got), 13)} ${pad(INR(item.expected), 13)} ${ok ? 'ok' : '*** MISMATCH ***'}`);
}

// A quantity the controls do not offer must still be refused.
const junk = computeCalculatorEstimate({ ...base, electrical: { 'Chandelier': 5 } }).totalExGst;
check(junk === baseline, `an unknown electrical item was priced: ${INR(junk - baseline)}`);
console.log(`  ${pad('unknown item "Chandelier" refused', 46)} ${pad(INR(junk - baseline), 13)} ${pad(INR(0), 13)} ${junk === baseline ? 'ok' : '*** PRICED SOMETHING UNKNOWN ***'}`);

// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(92));
if (failures.length) {
  console.log(`ESTIMATE SURFACES: FAIL — ${failures.length}`);
  failures.forEach((line) => console.log(`  - ${line}`));
} else {
  console.log('ESTIMATE SURFACES: PASS');
}
process.exit(failures.length ? 1 : 0);
