/**
 * The demotion gate, proven against builds that are deliberately green.
 *
 * The rule says #2d7a3f may not fill, border or tint a control. The gate that
 * enforced it has now been rewritten twice, and the honest reason is that it
 * was never proven against a violation - it was only ever proven against a
 * codebase that happened to be clean at the time.
 *
 * Each fixture below paints one control green in one state and requires the
 * gate to go red. The last two also cover the shade that actually shipped:
 * #1a3c2e, which the previous gate ignored because it keyed on one hex.
 */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const GATE = path.join(here, 'verify-green-demotion.mjs');

/*
 * Each fixture's selector has to be strong enough to actually win. Four of the
 * first six lost their specificity contest against the calculator's own rules,
 * turned nothing green, and were reported as "the gate missed it" when what
 * really happened was that there was nothing to miss. A fixture that does not
 * bite is worse than no fixture: it reads as a gate failure and sends you to
 * fix code that is fine. These match the shape of the rules they are competing
 * with and are injected last.
 *
 * Two are written as SHORTHANDS on purpose - `border`, `outline`. A gate that
 * asks for longhand property names by hand never sees those, which is exactly
 * what one of these caught.
 */
const FIXTURES = [
  {
    name: 'a selected chip filled green',
    css: '.cabin-calculator-ssr .calc-choice>input:checked+span{background:#2d7a3f}',
  },
  {
    name: 'an unselected chip filled green',
    css: '.cabin-calculator-ssr fieldset .calc-choice > span{background:#2d7a3f}',
  },
  {
    name: 'a green border on hover, written as a shorthand',
    css: '.cabin-calculator-ssr fieldset .calc-choice:hover > span{border:1px solid #2d7a3f}',
  },
  {
    name: 'a green focus ring, written as a shorthand',
    css: '.cabin-calculator-ssr .calc-choice>input:focus+span{outline:2px solid #2d7a3f}',
  },
  {
    name: 'the electrical cards in #1a3c2e — the shade that shipped',
    css: '.cabin-calculator-ssr .quantity-row{background:#1a3c2e}',
  },
  {
    name: 'a green tint through a token, not a literal',
    css: '.cabin-calculator-ssr,.cabin-calculator-ssr[data-theme="light"]{--calc-card:#2d7a3f}',
  },
];

const results = [];
let failed = false;

for (const fixture of FIXTURES) {
  const run = spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, CALCULATOR_EXPECT_FAILURE: '1', CALCULATOR_INJECT_CSS: fixture.css },
  });
  const out = `${run.stdout || ''}${run.stderr || ''}`;
  /*
   * The gate going red is not enough. Every one of these "passed" on an
   * unrelated pre-existing violation the first time they ran green - the gate
   * was red anyway, so six fixtures all reported success while proving
   * nothing. A fixture has to see ITS OWN colour and its own property come
   * back, or it has not tested anything.
   */
  /*
   * Match the colour in either notation. A default-state hit is reported as
   * the hex the gate parsed; a confirmed hover or focus hit is reported as the
   * browser's own computed `rgb(...)`. Matching only the hex called two
   * correct catches "RED, BUT NOT FOR #2d7a3f" and would have sent someone
   * looking for a gate bug that was not there.
   */
  const wantHex = (fixture.css.match(/#[0-9a-f]{6}/i) || [''])[0].toLowerCase();
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(wantHex.slice(i, i + 2), 16));
  const wantRgb = `rgb(${r}, ${g}, ${b})`;
  const lines = out.match(/^ {2}- .*$/gm) || [];
  const mine = lines.filter((l) => {
    const low = l.toLowerCase();
    return low.includes(wantHex) || low.includes(wantRgb);
  });
  const wentRed = /FIXTURE: PASS/.test(out) && run.status === 0;
  const caught = wentRed && mine.length > 0;
  results.push({
    ...fixture,
    verdict: caught ? 'caught' : wentRed ? `RED, BUT NOT FOR ${wantHex}` : 'NOT CAUGHT',
    first: (mine[0] || lines[0] || '').trim(),
  });
  if (!caught) failed = true;
}

const pad = (s, n) => String(s).padEnd(n);
console.log('DEMOTION GATE PROVEN AGAINST GREEN BUILDS\n');
console.log(pad('DELIBERATE VIOLATION', 52) + 'RESULT');
console.log('-'.repeat(70));
for (const r of results) {
  console.log(pad(r.name, 52) + r.verdict);
  if (r.first) console.log(`  ${r.first.slice(0, 120)}`);
}

if (failed) {
  console.error('\nDEMOTION FIXTURES: FAIL — the gate is still blind');
  process.exitCode = 1;
} else {
  console.log(`\nDEMOTION FIXTURES: PASS — all ${results.length} caught`);
}
