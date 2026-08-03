/**
 * Hub descriptions carry no calculator copy.
 *
 * INVERTED on 03 Aug 2026. This file used to assert that four authored
 * sentences were present in the render layer and injected into each hub's
 * `description`. Fable 5 ruled that injection out entirely:
 *
 *   "Injecting sentences into a hub's description writes into the zone L3
 *   freezes. Delete calculatorHubCopy and delete the injection. Not replace,
 *   delete. The calculator does not need to speak inside a hub's description,
 *   and it never should have."
 *
 * The teaser copy now belongs on the closed-state bar of the calculator
 * section, where it is reviewable as copy. So this gate is the opposite of what
 * it was: none of those four sentences or anchors may appear anywhere in src/,
 * and no hub-description injection helper may exist.
 */
import fs from 'node:fs';
import path from 'node:path';
import { failIfDiffs, fromRoot } from './common.mjs';

/** The four anchors that were injected into hub descriptions. Now forbidden. */
const FORBIDDEN_ANCHORS = [
  ['/product/porta-cabins', 'estimate your cabin cost live'],
  ['/product/portable-office', 'build a live price estimate'],
  ['/product/container-offices', 'price your configuration online'],
  ['/product/labor-colony', 'size and price a colony building'],
].map(([hub, anchor]) => ({ hub, anchor }));

/** Helpers whose only purpose was writing into a hub description. */
const FORBIDDEN_SYMBOLS = ['calculatorHubCopy'];

function sourceFiles(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...sourceFiles(fullPath));
    else if (/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) results.push(fullPath);
  }
  return results;
}

const texts = sourceFiles(fromRoot('src')).map((file) => ({
  file: path.relative(fromRoot(), file),
  text: fs.readFileSync(file, 'utf8'),
}));

const diffs = [];

console.log('HUB DESCRIPTIONS CARRY NO CALCULATOR COPY');
for (const { hub, anchor } of FORBIDDEN_ANCHORS) {
  const hits = texts.filter((entry) => entry.text.includes(anchor));
  console.log(`${hub} | "${anchor}" | occurrences ${hits.length} | ${hits.length === 0 ? 'absent, ok' : 'STILL PRESENT'}`);
  for (const hit of hits) {
    diffs.push(`${anchor}: still present in ${hit.file}; ruled deleted on 03 Aug 2026`);
  }
}

for (const symbol of FORBIDDEN_SYMBOLS) {
  const hits = texts.filter((entry) => entry.text.includes(symbol));
  console.log(`helper ${symbol} | occurrences ${hits.length} | ${hits.length === 0 ? 'absent, ok' : 'STILL PRESENT'}`);
  for (const hit of hits) {
    diffs.push(`${symbol}: still present in ${hit.file}; ruled deleted on 03 Aug 2026`);
  }
}

console.log('');
failIfDiffs('hub-description injection', diffs);
