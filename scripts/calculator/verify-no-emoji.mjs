/**
 * Zero emoji in the calculator.
 *
 * The L20 sweep removed emoji site-wide as a generated-content signal, and the
 * calculator reintroduced twenty of them as PRODUCT_ICON glyphs sitting inside
 * label text. They are now inline SVG line icons. This is the regression guard.
 *
 * Scope note: box-drawing characters (U+2500–U+257F) are deliberately NOT
 * treated as emoji. `│` is a typographic separator, not a pictograph. It is
 * reported separately as an advisory so a real occurrence stays visible without
 * failing an emoji gate for something that is not an emoji.
 *
 * Run: node scripts/calculator/verify-no-emoji.mjs
 */
import fs from 'node:fs';
import { failIfDiffs, fromRoot } from './common.mjs';

const FILES = [
  ['src', 'lib', 'cabinCalculatorSSR.ts'],
  ['src', 'lib', 'cabinCalculatorEmbedRoutes.ts'],
  ['src', 'lib', 'calculatorLadders.ts'],
  ['src', 'lib', 'calculatorRates.ts'],
  ['src', 'pages', 'cabin-cost-calculator.tsx'],
  ['public', 'scripts', 'cabin-cost-calculator.js'],
];

// Pictographs, dingbats, symbols and variation selectors. Box drawing excluded.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu;
const BOX_DRAWING = /[\u{2500}-\u{257F}]/gu;

const diffs = [];
let total = 0;
let boxTotal = 0;

console.log('EMOJI IN THE CALCULATOR\n');
for (const parts of FILES) {
  const file = parts.join('/');
  const full = fromRoot(...parts);
  if (!fs.existsSync(full)) { diffs.push(`${file}: expected calculator file is missing`); continue; }
  const text = fs.readFileSync(full, 'utf8');

  const hits = [...text.matchAll(EMOJI)];
  const boxes = [...text.matchAll(BOX_DRAWING)];
  total += hits.length;
  boxTotal += boxes.length;

  console.log(`  ${file.padEnd(46)} emoji ${hits.length}${boxes.length ? `   (box-drawing ${boxes.length}, advisory)` : ''}`);
  for (const hit of hits) {
    const line = text.slice(0, hit.index).split('\n').length;
    const cp = hit[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    diffs.push(`${file}:${line} contains U+${cp}`);
  }
  for (const box of boxes) {
    const line = text.slice(0, box.index).split('\n').length;
    const cp = box[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    console.log(`      advisory ${file}:${line} U+${cp} box-drawing separator, not an emoji`);
  }
}

console.log(`\nTOTAL EMOJI: ${total}`);
if (boxTotal) console.log(`TOTAL BOX-DRAWING (advisory, does not fail this gate): ${boxTotal}`);
console.log('');
failIfDiffs('emoji', diffs);
