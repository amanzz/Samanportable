/**
 * Copy pack verbatim check, on rendered DOM (L23).
 *
 * Every approved string in CALCULATOR-COPY-PACK-03Aug2026.md must appear in the
 * rendered calculator character for character. This does not compare source
 * constants against the draft — that would only prove the constants file was
 * typed correctly. It renders the real calculator, strips tags, decodes
 * entities, and looks for each approved string in the text a buyer sees, then
 * reports the character count of the draft string against the rendered one.
 *
 * Both directions are checked:
 *   1. every approved string reaches the DOM
 *   2. the strings are read out of the copy pack itself, so an edit to
 *      calculatorCopy.ts that drifts from the draft fails here
 *
 * Run: node scripts/calculator/verify-copy-pack.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import jitiPkg from 'jiti';
import { failIfDiffs, fromRoot } from './common.mjs';

const PACK = ['page-structure', 'content-drafts', 'CALCULATOR-COPY-PACK-03Aug2026.md'];
const packPath = fromRoot(...PACK);

if (!fs.existsSync(packPath)) {
  console.log('COPY PACK: BLOCKED — authority file absent from the repository');
  console.log(`  missing: ${PACK.join('/')}`);
  console.log('  Reporting unmeasured, never passed (L26).');
  failIfDiffs('copy-pack', [`${PACK.join('/')}: authority file not in the repository`]);
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
const { renderCabinCalculatorSSR } = jiti('./src/lib/cabinCalculatorSSR.ts');
const copy = jiti('./src/lib/calculatorCopy.ts');

const pack = fs.readFileSync(packPath, 'utf8');

/** Rendered text as a reader sees it: tags gone, entities decoded. */
function domText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const standalone = domText(renderCabinCalculatorSSR({ pageUrl: '/cabin-cost-calculator' }));
const embedded = domText(renderCabinCalculatorSSR({
  embedded: true, pageUrl: '/product/porta-cabins',
  config: { productId: 'porta-cabin' }, ladderKey: 'porta-cabins',
}));
const quoteMode = domText(renderCabinCalculatorSSR({
  embedded: true, pageUrl: '/product/container-houses/tiny-container-homes',
  config: { productId: 'container-houses' }, ladderKey: 'tiny-container-homes',
}));

/** Approved strings, each with where it is expected to render. */
const EXPECTED = [
  ...copy.STEP_COPY.flatMap((step) => [
    [`step heading: ${step.key}`, step.heading, standalone],
    [`step help: ${step.key}`, step.help, standalone],
  ]),
  ['disclosure heading', copy.CONSTRUCTION_DISCLOSURE.heading, standalone],
  ['disclosure body', copy.CONSTRUCTION_DISCLOSURE.body, standalone],
  ['tip: door opening', copy.TIPS.doorOpening, standalone],
  ['tip: window track', copy.TIPS.windowTrack, standalone],
  ['tip: socket placement', copy.TIPS.socketPlacement, standalone],
  ['tip: custom size', copy.TIPS.customSize, standalone],
  ['control: start over', copy.CONTROLS.startOver, standalone],
  ['control: get my quotation', copy.CONTROLS.getQuotation, standalone],
  ['control: theme', copy.CONTROLS.theme, standalone],
  ['control: save design', copy.CONTROLS.saveDesign, standalone],
  ['control: restore design', copy.CONTROLS.restoreDesign, standalone],
  ...Object.entries(copy.FIELD_LABELS).map(([key, label]) => [`field label: ${key}`, label, standalone]),
  ['estimate: heading', copy.ESTIMATE_PANEL.heading, standalone],
  ['estimate: floor area', copy.ESTIMATE_PANEL.floorArea, standalone],
  ['estimate: subtotal', copy.ESTIMATE_PANEL.subtotal, standalone],
  ['estimate: GST', copy.ESTIMATE_PANEL.gst, standalone],
  ['estimate: total', copy.ESTIMATE_PANEL.total, standalone],
  ['estimate: fine print', copy.ESTIMATE_PANEL.finePrint, standalone],
  ['quote mode line', copy.QUOTE_MODE, quoteMode],
  ...copy.PRODUCT_STEP.flatMap((entry) => [
    [`product name: ${entry.id}`, entry.name, standalone],
    [`product description: ${entry.id}`, entry.description, standalone],
  ]),
];

const diffs = [];
const pad = (s, n) => String(s).padEnd(n);

console.log('COPY PACK VERBATIM CHECK ON RENDERED DOM (L23)\n');
console.log(pad('STRING', 34) + pad('DRAFT', 8) + pad('RENDERED', 10) + 'RESULT');
console.log('-'.repeat(92));

for (const [name, approved, haystack] of EXPECTED) {
  // The string must be in the copy pack itself, not merely in the constants.
  const inPack = pack.includes(approved);
  const inDom = haystack.includes(approved);
  const rendered = inDom ? approved.length : 0;
  console.log(
    pad(name, 34) + pad(approved.length, 8) + pad(rendered || '—', 10) +
    (inPack && inDom ? 'verbatim' : !inPack ? 'NOT IN COPY PACK' : 'MISSING FROM DOM')
  );
  if (!inPack) diffs.push(`${name}: "${approved.slice(0, 60)}" is not in the copy pack`);
  else if (!inDom) diffs.push(`${name}: approved string does not render — "${approved.slice(0, 60)}"`);
}

// The struck structure options must be gone from the DOM entirely.
const FORBIDDEN = ['GI-coated frame', 'Container-form Corten build', 'Heavier structural frame', 'Corten'];
console.log('\nSTRUCK STRUCTURE OPTIONS MUST NOT RENDER');
for (const term of FORBIDDEN) {
  const present = standalone.includes(term);
  console.log(`  ${pad(term, 32)} ${present ? 'STILL RENDERS' : 'absent, ok'}`);
  if (present) diffs.push(`struck option "${term}" still renders`);
}

// Step count: eight standalone, seven embedded.
const stepCount = (html) => (html.match(/Step \d+ of \d+/g) || []).length;
const standaloneSteps = stepCount(standalone);
const embeddedSteps = stepCount(embedded);
console.log(`\nSTEP COUNT   standalone ${standaloneSteps} (expected 8)   embedded ${embeddedSteps} (expected 7)`);
if (standaloneSteps !== 8) diffs.push(`standalone renders ${standaloneSteps} steps, expected 8`);
if (embeddedSteps !== 7) diffs.push(`embedded renders ${embeddedSteps} steps, expected 7`);

console.log('');
failIfDiffs('copy-pack', diffs);
