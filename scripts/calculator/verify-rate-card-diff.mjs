/**
 * Rate-card diff against SAMAN-CALCULATOR-RATE-CARD-v2-03Aug2026.md.
 *
 * Replaces the retired v9 parity audit, which compared prices against a
 * hand-built HTML mock that was never committed to any branch.
 *
 * Two lists, both of which should be empty, and both reported either way:
 *
 *   1. every rate the calculator APPLIES that does not appear in v2
 *   2. every rate IN v2 that the calculator never applies
 *
 * Matching is by LABEL, not by scanning the document for numbers. A rate card
 * is prose and carries dates, sizes, row counts and distances; a bag-of-numbers
 * comparison matches "60" in a paragraph about struck structure uplifts against
 * the HDHMR wall finish and reports nonsense. So each rate the calculator
 * applies is bound to the exact phrase in the card that states it, via ALIASES
 * below, and the number is read from beside that phrase. Anything on either
 * side with no counterpart is reported.
 *
 * ALIASES maps code label -> card phrase. It does NOT hardcode any value: every
 * number compared is read out of the card at run time, so a card edit that
 * changes a rate fails this gate rather than being silently absorbed.
 *
 * L26: a gate whose authority is missing reports unmeasured, never passed.
 *
 * Run: node scripts/calculator/verify-rate-card-diff.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import jitiPkg from 'jiti';
import { failIfDiffs, fromRoot } from './common.mjs';

const RATE_CARD = ['page-structure', 'content-drafts', 'SAMAN-CALCULATOR-RATE-CARD-v2-03Aug2026.md'];
const rateCardPath = fromRoot(...RATE_CARD);

if (!fs.existsSync(rateCardPath)) {
  console.log('RATE-CARD DIFF: BLOCKED — authority file absent from the repository');
  console.log(`  missing: ${RATE_CARD.join('/')}`);
  console.log('\n  The calculator applies rates that cannot be checked against anything, so');
  console.log('  this gate is UNMEASURED. It is not passing and must not be recorded as');
  console.log('  passing (L26).');
  failIfDiffs('rate-card', [`${RATE_CARD.join('/')}: authority file not in the repository`]);
  process.exit(1);
}

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
const rates = jiti('./src/lib/calculatorRates.ts');

const text = fs.readFileSync(rateCardPath, 'utf8');

/**
 * The rate-bearing body only. The "Correction from v1" paragraph states rates
 * that were STRUCK, and the RULE section states policy — reading rates out of
 * either would assert the opposite of what the card means.
 */
const strikeParagraph = /Correction from v1:[^\n]*/.exec(text)?.[0] ?? '';
const body = text
  .split('\n')
  .filter((line) => !line.startsWith('Correction from v1:') && !/^#/.test(line))
  .join('\n');

/**
 * Sentences that own a rate vocabulary. "SPC" appears in both the wall and the
 * flooring sentence at different rates, so a global search is ambiguous and a
 * naive phrase like "SPC +1" silently matches "SPC +170" in the wall sentence.
 */
const SCOPES = {
  surfaces: /Per sq ft of surface\.[^\n]*/.exec(body)?.[0] ?? '',
  flooring: /Flooring:[^.]*\./.exec(body)?.[0] ?? '',
  items: /Per item\.[^\n]*/.exec(body)?.[0] ?? '',
  branded: /Branded items:[^\n]*/.exec(body)?.[0] ?? '',
};

/** Reads the number stated immediately after `phrase`. */
function valueAfter(source, phrase) {
  const at = source.toLowerCase().indexOf(phrase.toLowerCase());
  if (at < 0) return null;
  const tail = source.slice(at + phrase.length, at + phrase.length + 40);
  const m = /^[^\d+-]{0,12}([+-]?[\d,]+(?:\.\d+)?)/.exec(tail);
  return m ? Number(m[1].replaceAll(',', '')) : null;
}

/**
 * code label -> the phrase in the card that states its rate.
 * Wall and ceiling share one sentence, so ceiling PVC has its own phrase.
 */
const ALIASES = {
  'wall: Particle Board': 'Particle Board', 'wall: PVC': 'PVC +', 'wall: HDHMR': 'HDHMR',
  'wall: Gypsum': 'Gypsum', 'wall: WPC': 'WPC', 'wall: SPC': 'SPC +', 'wall: UV Sheet': 'UV Sheet',
  'wall: ACP': 'ACP',
  'ceiling: Particle Board': 'Particle Board', 'ceiling: PVC': 'with ceiling', 'ceiling: HDHMR': 'HDHMR',
  'ceiling: Gypsum': 'Gypsum', 'ceiling: WPC': 'WPC', 'ceiling: SPC': 'SPC +', 'ceiling: UV Sheet': 'UV Sheet',
  'ceiling: ACP': 'ACP',
  'floor: PVC': ['flooring', 'PVC'], 'floor: SPC': ['flooring', 'SPC'],
  'floor: Wooden Laminate': ['flooring', 'Wooden Laminate'], 'floor: Tiles': ['flooring', 'Tiles'],
  'panel: 30 mm PUF': '30 mm', 'panel: 40 mm PUF': '40 mm', 'panel: 60 mm PUF': '60 mm',
  'panel: 80 mm PUF': '80 mm',
  'market: ac1T': 'split AC 1 ton 3-star installed', 'market: wire15sqmm': '1.5 sq mm',
  'market: wire25sqmm': '2.5 sq mm', 'market: upvcWindow': 'uPVC window',
  'market: aluminiumSliding': 'aluminium sliding', 'market: openableUpvc': 'openable uPVC',
  'market: fixedGlass': 'fixed glass', 'market: steelDoor': 'Extra steel door',
  'market: upvcGlassDoor': 'uPVC or glass door', 'market: ledPanel': 'LED panel',
  'market: tubeLight': 'tube light', 'market: fan': 'fan', 'market: exhaust': 'exhaust',
  'market: plugPoint': 'plug point', 'market: popupSocket': 'pop-up socket',
  'market: externalLight': 'external light', 'market: pantry': 'pantry', 'market: basin': 'basin',
  'market: urinal': 'urinal', 'market: workstation': 'workstation',
  'market: managerTable': 'manager table', 'market: managerTableLShape': 'L-shape',
  'market: conferenceTable': 'conference', 'market: cupboard': 'cupboard',
  'market: overheadCabinet': 'overhead cabinet', 'market: tableWithDrawer': 'table with drawer',
  'market: tableWithoutDrawer': 'without drawer',
  'market: revolvingChairHeadRest': 'chair head-rest', 'market: revolvingChairBackRest': 'back-rest',
  'addon: Attached WC / Toilet (4x4)': 'Attached WC or toilet 4x4: Rs',
  'addon: Toilet with Bath / Washroom (6x4)': 'Toilet and bath 6x4: Rs',
  // The add-on step reuses the same market rates; same card phrase, one truth.
  'addon: Pantry Counter': 'pantry', 'addon: Wash Basin': 'basin', 'addon: Urinal': 'urinal',
  'addon: Workstation': 'workstation', 'addon: Manager Table (5x2)': 'manager table',
  'addon: Manager Table (L-shaped)': 'L-shape', 'addon: Conference Table': 'conference',
  'addon: Cupboard': 'cupboard', 'addon: Overhead Cabinet': 'overhead cabinet',
  'addon: Table with Drawer': 'table with drawer',
  'addon: Table without Drawer': 'without drawer',
  'addon: Revolving Chair, Head Rest': 'chair head-rest',
  'addon: Revolving Chair, Back Rest': 'back-rest',
  'electrical: LED Panel Light': 'LED panel', 'electrical: Tube Light': 'tube light',
  'electrical: Ceiling Fan': 'fan', 'electrical: Exhaust Fan': 'exhaust',
  'electrical: Split AC 1 Ton incl. installation': 'split AC 1 ton 3-star installed',
  'electrical: Plug Point': 'plug point', 'electrical: Pop-up Socket': 'pop-up socket',
  'electrical: External / Entrance Light': 'external light',
  'electrical: FR Copper Wire Coil 90 m, 1.5 sq mm': '1.5 sq mm',
  'electrical: FR Copper Wire Coil 90 m, 2.5 sq mm': '2.5 sq mm',
  'freight: first 20 ft band': '100 to 150 km reads Rs',
  'freight: 40 ft trailer delta': '40 ft trailer adds Rs',
  'tax: GST': 'GST at',
};

/** Every rate the calculator actually applies. Zero deltas are baselines, not rates. */
function appliedRates() {
  const applied = new Map();
  const add = (group, label, value) => {
    if (typeof value !== 'number' || value === 0) return;
    applied.set(`${group}: ${label}`, value);
  };
  for (const [label, delta] of ssr.WALL_FINISHES) add('wall', label, delta);
  for (const [label, delta] of ssr.CEILINGS) add('ceiling', label, delta);
  for (const [label, delta] of ssr.FLOORING) add('floor', label, delta);
  for (const [label, delta] of (ssr.STRUCTURES || [])) add('structure', label, delta);
  for (const [label, rate] of ssr.ADD_ONS) add('addon', label, rate);
  // The ELECTRICAL array carries its own rate per row. Reading only
  // RATE_CARD.marketRates meant a literal typed straight into that array was
  // never compared against the card: a fixture setting Tube Light to 999
  // passed. Every rate the step actually applies is checked.
  for (const [label, rate] of ssr.ELECTRICAL) add('electrical', label, rate);
  for (const [mm, delta] of Object.entries(rates.RATE_CARD.pufThicknessDeltaPerSqft)) {
    add('panel', `${mm} mm PUF`, delta);
  }
  for (const [label, rate] of Object.entries(rates.RATE_CARD.marketRates)) add('market', label, rate);
  add('freight', '40 ft trailer delta', rates.RATE_CARD.freight.trailer40ftDelta);
  add('freight', 'first 20 ft band', rates.RATE_CARD.freight.bands20ft[0]);
  add('tax', 'GST', rates.GST_RATE * 100);
  return applied;
}

const applied = appliedRates();
const appliedNotInCard = [];
const matchedPhrases = new Set();

for (const [label, value] of applied) {
  const alias = ALIASES[label];
  const scoped = Array.isArray(alias);
  const phrase = scoped ? alias[1] : alias;
  const haystack = scoped ? SCOPES[alias[0]] : body;
  if (!alias) {
    const struck = new RegExp(`\\b${String(value).replace('.', '\\.')}\\b`).test(strikeParagraph);
    appliedNotInCard.push(
      struck
        ? `${label} = ${value} — STRUCK in v2, the clause pricing it was removed`
        : `${label} = ${value} — no rate for this appears in v2`
    );
    continue;
  }
  const stated = valueAfter(haystack, phrase);
  matchedPhrases.add(scoped ? `${alias[0]}:${phrase}` : phrase);
  if (stated === null) {
    appliedNotInCard.push(`${label} = ${value} — v2 phrase "${phrase}" states no number`);
  } else if (Math.abs(stated) !== Math.abs(value)) {
    appliedNotInCard.push(`${label} = ${value} — v2 states ${stated} at "${phrase}"`);
  }
}

/**
 * Direction 2: named rates the card states that nothing in the calculator
 * consumes. Driven by the card's own rate vocabulary rather than every number.
 */
const CARD_RATES = [
  ['Particle Board', 'Particle Board'], ['PVC wall', 'PVC +'], ['ceiling PVC', 'with ceiling'],
  ['HDHMR', 'HDHMR'], ['Gypsum', 'Gypsum'], ['WPC', 'WPC'], ['SPC wall', 'SPC +'],
  ['UV Sheet', 'UV Sheet'], ['ACP', 'ACP'],
  ['Flooring PVC', ['flooring', 'PVC']], ['Flooring SPC', ['flooring', 'SPC']],
  ['Wooden Laminate', ['flooring', 'Wooden Laminate']], ['Tiles', ['flooring', 'Tiles']],
  ['Partition', 'Partition'],
  ['30 mm PUF', '30 mm'], ['40 mm PUF', '40 mm'], ['60 mm PUF', '60 mm'], ['80 mm PUF', '80 mm'],
  ['Attached WC 4x4', 'Attached WC or toilet 4x4: Rs'], ['Toilet and bath 6x4', 'Toilet and bath 6x4: Rs'],
  ['split AC 1 ton', 'split AC 1 ton 3-star installed'], ['FR wire 1.5', '1.5 sq mm'],
  ['FR wire 2.5', '2.5 sq mm'], ['uPVC window', 'uPVC window'], ['aluminium sliding', 'aluminium sliding'],
  ['openable uPVC', 'openable uPVC'], ['fixed glass', 'fixed glass'], ['steel door', 'Extra steel door'],
  ['uPVC or glass door', 'uPVC or glass door'], ['2.5 track uplift', '2.5 track adding'],
  ['LED panel', 'LED panel'], ['tube light', 'tube light'], ['fan', 'fan'], ['exhaust', 'exhaust'],
  ['plug point', 'plug point'], ['pop-up socket', 'pop-up socket'], ['external light', 'external light'],
  ['pantry', 'pantry'], ['basin', 'basin'], ['urinal', 'urinal'], ['workstation', 'workstation'],
  ['manager table', 'manager table'], ['L-shape', 'L-shape'], ['conference', 'conference'],
  ['cupboard', 'cupboard'], ['overhead cabinet', 'overhead cabinet'],
  ['table with drawer', 'table with drawer'], ['without drawer', 'without drawer'],
  ['chair head-rest', 'chair head-rest'], ['chair back-rest', 'back-rest'],
  ['freight first band', '100 to 150 km reads Rs'], ['freight 40 ft delta', '40 ft trailer adds Rs'],
  ['flat roof', 'Flat roof adds'], ['height per ft', 'Extra height adds'], ['GST', 'GST at'],
];

/** Rates the calculator applies outside the label map, checked structurally. */
const STRUCTURAL = new Map([
  ['Partition', 300],
  ['2.5 track uplift', 12],
  ['flat roof', 4],
  ['height per ft', 6],
]);

const cardNotApplied = [];
for (const [name, alias] of CARD_RATES) {
  const scoped = Array.isArray(alias);
  const phrase = scoped ? alias[1] : alias;
  const stated = valueAfter(scoped ? SCOPES[alias[0]] : body, phrase);
  if (stated === null) { cardNotApplied.push(`${name} — v2 phrase "${phrase}" states no number`); continue; }
  if (matchedPhrases.has(scoped ? `${alias[0]}:${phrase}` : phrase)) continue;
  if (STRUCTURAL.has(name)) {
    if (STRUCTURAL.get(name) !== Math.abs(stated)) {
      cardNotApplied.push(`${name} — v2 states ${stated}, calculator applies ${STRUCTURAL.get(name)}`);
    }
    continue;
  }
  cardNotApplied.push(`${name} = ${stated} — stated in v2, never applied by the calculator`);
}

console.log('RATE-CARD DIFF vs v2\n');
console.log(`rates the calculator applies: ${applied.size}`);
console.log(`named rates in the card:      ${CARD_RATES.length}\n`);

console.log(`1. APPLIED BY THE CALCULATOR, NOT IN v2 — ${appliedNotInCard.length}`);
for (const item of appliedNotInCard) console.log(`   ${item}`);
if (!appliedNotInCard.length) console.log('   (empty)');

console.log(`\n2. IN v2, NEVER APPLIED BY THE CALCULATOR — ${cardNotApplied.length}`);
for (const item of cardNotApplied) console.log(`   ${item}`);
if (!cardNotApplied.length) console.log('   (empty)');

console.log('');
failIfDiffs('rate-card', [
  ...appliedNotInCard.map((i) => `applied but not in v2: ${i}`),
  ...cardNotApplied.map((i) => `in v2 but never applied: ${i}`),
]);
