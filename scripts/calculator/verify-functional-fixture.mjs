/**
 * The functional harness, proven against deliberately broken builds.
 *
 * A gate that has never failed is a gate nobody has tested. Sixteen gates
 * passed on a calculator where nothing priced, so this one does not get
 * trusted on its own word either.
 *
 * Each fixture below reintroduces a defect that has actually shipped, patches
 * it into the live browser script, runs the harness, and requires it to fail.
 * The script is restored afterwards whatever happens.
 *
 * The browser script is served from public/ at request time, so a fixture needs
 * no rebuild - the next page load picks it up.
 *
 * TWO MODES, and --check is the default for verify-all.
 *
 *   --check   Reads only. Verifies every fixture's anchor still exists in the
 *             shipped script, byte for byte, and reports. Writes NOTHING, so it
 *             is safe to run beside an editor, in parallel, or in CI.
 *   --write   The real proof: patches each defect in, runs the harness, and
 *             requires it to fail. Holds a lock file for the duration and
 *             refuses to start if one already exists.
 *
 * WHAT --check CANNOT SEE, stated plainly because a gate that overstates itself
 * is worse than no gate: it proves the fixtures still point at real code, NOT
 * that the harness would catch the defect. Only --write proves catching. Run
 * --write deliberately, alone, when the harness or the enhancer changes.
 *
 * Why the split exists: this script rewrote a tracked source file and restored
 * it from a snapshot taken at its own start. Run beside an edit, it either
 * injected a mutation into the file being edited or reverted a finished fix
 * from its stale snapshot. It did both, three times in one session, and once
 * silently removed a one-line fix that had already been verified. A
 * verification script that can revert a fix manufactures defects.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... node scripts/calculator/verify-functional-fixture.mjs --check
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... node scripts/calculator/verify-functional-fixture.mjs --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(here, '..', '..', 'public', 'scripts', 'cabin-cost-calculator.js');
const HARNESS = path.join(here, 'verify-functional.mjs');
const LOCK = path.join(here, '.fixture-write.lock');
const original = fs.readFileSync(SCRIPT, 'utf8');

const MODE = process.argv.includes('--write') ? 'write' : 'check';

/**
 * Each fixture: the defect, and the assertion it must trip. `find` must appear
 * in the script exactly as written or the fixture is reported as stale rather
 * than silently passing.
 */
const FIXTURES = [
  {
    name: 'nothing is priced',
    proves: 'chips select but no estimate line appears',
    find: "Array.from(form.querySelectorAll('[data-rate][data-rate-basis]')).forEach((field) => {",
    replace: "Array.from([]).forEach((field) => {",
  },
  {
    name: 'the itemised list never repaints',
    proves: 'the estimate list is stuck at its page-load contents',
    find: '  function renderEstimateLines(root, lines, transportNote, total, gst, quoteOnly) {',
    replace: '  function renderEstimateLines(root, lines, transportNote, total, gst, quoteOnly) {\n    if (root) return;',
  },
  {
    name: 'quantity steppers do not price',
    proves: 'a stepper driven up produces no line',
    find: "        else count = Math.max(0, num(field.value));",
    replace: "        else count = 0;",
  },
  {
    // `hidden` alone is not enough to prove this: the stylesheet hides an
    // inactive step by class, so clearing the attribute changes nothing on
    // screen. The defect that actually shipped was a specificity one - four
    // steps stayed visible because a layout rule outranked the hide - so the
    // fixture has to break what the stylesheet keys on.
    name: 'more than one step is visible',
    proves: 'the Next and Back walk counts visible steps',
    find: "      section.classList.toggle('is-active', active);",
    replace: "      section.classList.add('is-active');",
  },
  {
    name: 'the header total is frozen',
    proves: 'selecting a different product must move the header',
    find: "    setText(root, '[data-summary-ex]', quoteOnly ? 'Price on request' : INR.format(total));",
    replace: '',
  },
  {
    name: 'submit sends nothing',
    proves: 'step 9 must actually post',
    find: '  async function submitEnhanced(event, root, form) {',
    replace: '  async function submitEnhanced(event, root, form) {\n    event.preventDefault();\n    if (form) return;',
  },
];

const results = [];
let failed = false;
const pad = (s, n) => String(s).padEnd(n);

if (MODE === 'check') {
  // READ ONLY. Not one byte is written, so this is safe beside an open editor.
  for (const fixture of FIXTURES) {
    const present = original.includes(fixture.find);
    if (!present) failed = true;
    results.push({ ...fixture, verdict: present ? 'anchor present' : 'STALE — the anchor is no longer in the script' });
  }
  console.log('FUNCTIONAL FIXTURES — ANCHOR CHECK (read only, nothing written)\n');
  console.log(pad('DEFECT', 34) + pad('ASSERTION IT MUST TRIP', 46) + 'RESULT');
  console.log('-'.repeat(96));
  for (const r of results) console.log(pad(r.name, 34) + pad(r.proves, 46) + r.verdict);
  console.log('\nWhat this mode proves: every fixture still points at code that exists.');
  console.log('What it CANNOT prove: that the harness would catch the defect. Only --write proves that.');
  if (failed) {
    console.error('\nFUNCTIONAL FIXTURES (--check): FAIL — a fixture no longer matches the source, so the gate is unproven');
    process.exitCode = 1;
  } else {
    console.log(`\nFUNCTIONAL FIXTURES (--check): PASS — ${results.length} anchors intact`);
  }
} else {
  // WRITING MODE. One at a time, or the restores collide.
  let lockHeld = false;
  try {
    fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
    lockHeld = true;
  } catch {
    console.error(`REFUSING TO RUN: ${path.basename(LOCK)} exists — another writing run holds it.`);
    console.error('This mode rewrites a tracked source file. Two at once corrupt each other.');
    console.error(`If no run is active, the lock is stale: delete ${LOCK}`);
    process.exit(1);
  }

  // The restore comes from a snapshot taken at start. An edit landing mid-run
  // would be thrown away by it, so refuse to start on a file that is mid-edit.
  if (process.env.CALCULATOR_FIXTURE_FORCE !== '1') {
    const dirty = spawnSync('git', ['status', '--porcelain', '--', SCRIPT], { encoding: 'utf8' });
    if ((dirty.stdout || '').trim()) {
      fs.rmSync(LOCK, { force: true });
      console.error(`REFUSING TO RUN: ${path.basename(SCRIPT)} has uncommitted changes.`);
      console.error('This mode overwrites and restores that file, so it would discard them.');
      console.error('Commit or stash first, or set CALCULATOR_FIXTURE_FORCE=1 if the loss is acceptable.');
      process.exit(1);
    }
  }

  try {
    for (const fixture of FIXTURES) {
      if (!original.includes(fixture.find)) {
        results.push({ ...fixture, verdict: 'STALE — the anchor is no longer in the script' });
        failed = true;
        continue;
      }
      fs.writeFileSync(SCRIPT, original.replace(fixture.find, fixture.replace), 'utf8');
      const run = spawnSync(process.execPath, [HARNESS], {
        encoding: 'utf8',
        env: { ...process.env, CALCULATOR_EXPECT_FAILURE: '1' },
      });
      const out = `${run.stdout || ''}${run.stderr || ''}`;
      const caught = /FIXTURE: PASS/.test(out) && run.status === 0;
      results.push({
        ...fixture,
        verdict: caught ? 'caught' : 'NOT CAUGHT',
        detail: (out.match(/^ {2}- .*$/gm) || []).slice(0, 2).map((s) => s.trim()).join(' | '),
      });
      if (!caught) failed = true;
    }
  } finally {
    fs.writeFileSync(SCRIPT, original, 'utf8');
    if (lockHeld) fs.rmSync(LOCK, { force: true });
  }

  console.log('FUNCTIONAL HARNESS PROVEN AGAINST BROKEN BUILDS\n');
  console.log(pad('DEFECT', 34) + pad('ASSERTION IT MUST TRIP', 46) + 'RESULT');
  console.log('-'.repeat(96));
  for (const r of results) {
    console.log(pad(r.name, 34) + pad(r.proves, 46) + r.verdict);
    if (r.detail) console.log(`  ${r.detail}`);
  }
  console.log(`\nscript restored: ${fs.readFileSync(SCRIPT, 'utf8') === original ? 'yes' : 'NO — RESTORE FAILED'}`);

  if (failed) {
    console.error('\nFUNCTIONAL FIXTURES: FAIL');
    process.exitCode = 1;
  } else {
    console.log(`\nFUNCTIONAL FIXTURES: PASS — all ${results.length} defects caught`);
  }
}
