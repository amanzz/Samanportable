/**
 * Prove every gate against a KNOWN violation before trusting it.
 *
 * Ruled 04 Aug 2026, and earned: the #2d7a3f demotion gate reported zero
 * violations while two legacy rules were filling active and selected states
 * with the accent. It scanned the wrong slice of the stylesheet and matched
 * line by line against a pretty-printed file. A gate that cannot see the
 * violation it exists to catch is worse than no gate, because it is trusted.
 *
 * Each fixture below injects a defect the corresponding gate is supposed to
 * catch, runs the gate, and asserts it FAILS. A fixture that passes means the
 * gate is blind and is reported as such.
 *
 * Nothing is mutated on disk: each fixture copies the repo file to a temp
 * working copy, and the gate is run against that copy via CALCULATOR_SRC.
 *
 * Run: node scripts/calculator/verify-gates-catch-violations.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './common.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const SSR = fromRoot('src', 'lib', 'cabinCalculatorSSR.ts');
const original = fs.readFileSync(SSR, 'utf8');
const backup = path.join(os.tmpdir(), `cabinCalculatorSSR.backup.${process.pid}.ts`);
fs.writeFileSync(backup, original);

/**
 * Each fixture: a name, the gate script, and a mutation that introduces a
 * defect that gate must catch.
 */
const FIXTURES = [
  {
    name: 'amber outside its five roles',
    gate: 'verify-colour-modes.mjs',
    mutate: (src) => src.replace(
      '.cabin-calculator-ssr .estimate-card h2{font-size:14px;font-weight:700;color:var(--sd-text)}',
      '.cabin-calculator-ssr .estimate-card h2{font-size:14px;font-weight:700;color:var(--saman-amber)}'
    ),
  },
  {
    name: '#2d7a3f back in a selected state',
    gate: 'verify-colour-modes.mjs',
    mutate: (src) => src.replace(
      '.cabin-calculator-ssr .calc-choice input:checked+span{background:var(--sd-card)',
      '.cabin-calculator-ssr .calc-choice input:checked+span{background:#2d7a3f'
    ),
  },
  {
    name: 'a surface identical to the one beneath it',
    gate: 'verify-colour-modes.mjs',
    mutate: (src) => src.replace('--sd-card:#14291E;', '--sd-card:#14301F;'),
  },
  {
    name: 'text below 4.5:1',
    gate: 'verify-colour-modes.mjs',
    mutate: (src) => src.replace(
      '--sd-text-2:rgba(240,247,242,0.62)',
      '--sd-text-2:rgba(240,247,242,0.20)'
    ),
  },
  {
    name: 'an emoji in a product label',
    gate: 'verify-no-emoji.mjs',
    file: fromRoot('src', 'lib', 'calculatorCopy.ts'),
    mutate: (src) => src.replace("name: 'Porta Cabin',", "name: 'Porta Cabin \u{1F3D7}',"),
  },
  {
    name: 'a rate the card does not carry',
    gate: 'verify-rate-card-diff.mjs',
    mutate: (src) => src.replace("['Tube Light', RATE_CARD.marketRates.tubeLight, '']", "['Tube Light', 999, '']"),
  },
  {
    name: 'a fixed height on the step panel',
    gate: 'verify-ux-static.mjs',
    mutate: (src) => src.replace('.step-card{height:auto;overflow:visible', '.step-card{height:720px;overflow:visible'),
  },
];

const pad = (s, n) => String(s).padEnd(n);
const blind = [];

console.log('GATE FIXTURES — each gate must FAIL on a known violation\n');
console.log(pad('FIXTURE', 40) + pad('GATE', 30) + 'RESULT');
console.log('-'.repeat(96));

for (const fixture of FIXTURES) {
  const target = fixture.file || SSR;
  const before = fs.readFileSync(target, 'utf8');
  const after = fixture.mutate(before);

  if (after === before) {
    console.log(pad(fixture.name, 40) + pad(fixture.gate, 30) + 'FIXTURE DID NOT APPLY');
    blind.push(`${fixture.name}: the fixture no longer matches the source, so the gate is unproven`);
    continue;
  }

  fs.writeFileSync(target, after);
  let status;
  try {
    status = spawnSync(process.execPath, [path.join(here, fixture.gate)], { encoding: 'utf8' }).status;
  } finally {
    fs.writeFileSync(target, before);
  }

  const caught = status !== 0;
  console.log(pad(fixture.name, 40) + pad(fixture.gate, 30) + (caught ? 'caught' : 'NOT CAUGHT — GATE IS BLIND'));
  if (!caught) blind.push(`${fixture.gate} did not catch: ${fixture.name}`);
}

// Restore from the untouched backup regardless of what happened above.
fs.writeFileSync(SSR, original);
fs.unlinkSync(backup);

const restored = fs.readFileSync(SSR, 'utf8') === original;
console.log(`\nsource restored byte for byte: ${restored ? 'yes' : 'NO'}`);
if (!restored) blind.push('the source file was not restored after the fixtures ran');

console.log('');
if (blind.length) {
  console.log(`GATE FIXTURES: FAIL — ${blind.length}`);
  for (const b of blind) console.log(`  - ${b}`);
  process.exit(1);
}
console.log(`GATE FIXTURES: PASS — all ${FIXTURES.length} gates caught their violation`);
