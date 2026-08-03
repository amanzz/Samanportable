/**
 * Rate-card diff against SAMAN-CALCULATOR-RATE-CARD-v2-03Aug2026.md.
 *
 * Replaces the retired v9 parity audit, which compared prices against a
 * hand-built HTML mock that was never committed.
 *
 * Two lists, both of which should be empty, and both reported either way:
 *
 *   1. every rate the calculator APPLIES that does not appear in v2
 *   2. every rate IN v2 that the calculator never applies
 *
 * v2 struck the three structure uplifts v1 carried — GI +45, Heavy frame +60,
 * Corten container-form +75 — because those were approved from market
 * convention rather than from the specification workbook. The binding rule is
 * that an option needs a rate AND an approved specification, and a rate without
 * a specification is removed rather than priced. List 1 is what enforces that:
 * if the calculator still applies a struck rate, it shows up there.
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
  console.log('');
  console.log('  The calculator applies rates that cannot be checked against anything,');
  console.log('  so this gate is UNMEASURED. It is not passing and must not be recorded');
  console.log('  as passing (L26).');
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

/**
 * Every rate the calculator actually applies to a price, flattened to
 * label -> number. Anything with a zero delta is skipped: a zero is the
 * baseline option, not a rate, and the rate card does not list it.
 */
function appliedRates() {
  const applied = new Map();
  const add = (group, label, value) => {
    if (typeof value !== 'number' || value === 0) return;
    applied.set(`${group}: ${label}`, value);
  };

  for (const [label, delta] of ssr.WALL_FINISHES) add('wall', label, delta);
  for (const [label, delta] of ssr.CEILINGS) add('ceiling', label, delta);
  for (const [label, delta] of ssr.FLOORING) add('floor', label, delta);
  for (const [label, delta] of ssr.STRUCTURES) add('structure', label, delta);
  for (const [label, rate] of ssr.ELECTRICAL) add('electrical', label, rate);
  for (const [label, rate] of ssr.ADD_ONS) add('addon', label, rate);
  for (const [mm, delta] of Object.entries(rates.RATE_CARD.pufThicknessDeltaPerSqft)) {
    add('panel', `${mm} mm PUF`, delta);
  }
  for (const [label, rate] of Object.entries(rates.RATE_CARD.marketRates)) {
    add('market', label, rate);
  }
  add('freight', '40 ft trailer delta', rates.RATE_CARD.freight.trailer40ftDelta);
  add('freight', 'first 20 ft band', rates.RATE_CARD.freight.bands20ft[0]);
  add('tax', 'GST', rates.GST_RATE);
  return applied;
}

/**
 * Numbers the rate card states. Tolerant of table or list form: any line
 * carrying a label and a number is a candidate, and matching is done on the
 * number, since label wording differs between the card and the code.
 */
function cardNumbers(text) {
  const found = new Map();
  for (const line of text.split('\n')) {
    if (/^\s*(#|>)/.test(line)) continue;
    const struck = /~~/.test(line) || /\bstruck\b|\bremoved\b/i.test(line);
    for (const m of line.matchAll(/([+-]?\d[\d,]*(?:\.\d+)?)\s*%?/g)) {
      const n = Number(m[1].replaceAll(',', ''));
      if (!Number.isFinite(n) || n === 0) continue;
      if (!found.has(n)) found.set(n, { line: line.trim(), struck });
    }
  }
  return found;
}

const text = fs.readFileSync(rateCardPath, 'utf8');
const applied = appliedRates();
const card = cardNumbers(text);

if (card.size === 0) {
  console.log('RATE-CARD DIFF: BLOCKED — authority file parsed to zero rates');
  console.log(`  ${RATE_CARD.join('/')} contains no readable numbers.`);
  console.log('  Reporting unmeasured rather than passing on an empty comparison (L26).');
  failIfDiffs('rate-card', ['rate card parsed to zero rates']);
  process.exit(1);
}

const appliedNotInCard = [];
for (const [label, value] of applied) {
  const hit = card.get(value) ?? card.get(Math.abs(value)) ?? card.get(value * 100);
  if (!hit) appliedNotInCard.push(`${label} = ${value}`);
  else if (hit.struck) appliedNotInCard.push(`${label} = ${value} — STRUCK in v2: "${hit.line}"`);
}

const appliedValues = new Set([...applied.values()].flatMap((v) => [v, Math.abs(v), v * 100]));
const cardNotApplied = [];
for (const [value, meta] of card) {
  if (meta.struck) continue;
  if (!appliedValues.has(value)) cardNotApplied.push(`${value} — "${meta.line.slice(0, 90)}"`);
}

console.log('RATE-CARD DIFF vs v2\n');
console.log(`rates the calculator applies: ${applied.size}`);
console.log(`distinct numbers in the rate card: ${card.size}\n`);

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
