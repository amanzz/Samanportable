import fs from 'node:fs';

const renderer = fs.readFileSync('src/lib/cabinCalculatorSSR.ts', 'utf8');
const enhancer = fs.readFileSync('public/scripts/cabin-cost-calculator.js', 'utf8');

/**
 * Phase 0 checks. These assert behaviour that exists today, so a failure here
 * is a real regression and fails the script.
 */
const checks = [
  ['numeric input mode', /inputmode="numeric"/],
  ['decimal input mode', /inputmode="decimal"/],
  ['step navigation label', /aria-label="Calculator steps"/],
  ['no DOM content creation', !/createElement|innerHTML/.test(enhancer)],
  ['one enquiry fetch only', (enhancer.match(/\bfetch\(/g) || []).length === 1 && /fetch\(form\.dataset\.enhancedAction \|\| '\/api\/enquiry'/.test(enhancer)],
];

/**
 * PHASE 1 checks — reported, NOT failed.
 *
 * Phase 1 is suspended and none of this has been built. These have never
 * passed on this branch, so reporting them as failures would imply a
 * regression that did not happen, and it made the whole suite red for work
 * that was never started.
 *
 * Two of them need a ruling before Phase 1 builds against them:
 *
 *   'desktop fixed step height' and 'mobile reserved step height' assert
 *   height:720px and min-height:610px on the step panel. Design spec Part 5
 *   says the opposite — "No fixed inner height. No internal scrollbar. The
 *   panel grows with its content." One of the two is wrong.
 *
 *   'all steps SSR visibility' and 'enhanced-only step hiding' are design-spec
 *   item 1.2, which Phase 1 is meant to implement.
 */
const phase1Checks = [
  ['44px form controls', /min-height:44px/],
  ['visible focus state', /focus-visible\{outline:3px/],
  ['desktop fixed step height', /height:720px;min-height:720px/],
  ['mobile reserved step height', /min-height:610px/],
  ['360px fixed estimate bar', /@media\(max-width:600px\).*\.mobile-estimate\{position:fixed/],
  ['range ARIA labels', /aria-label="Door \$\{index \+ 1\} position along wall"/],
  ['all steps SSR visibility', /\.calc-step\{display:block/],
  ['enhanced-only step hiding', /\.is-enhanced \.calc-step:not\(\.is-active\)/],
];

const failures = checks
  .filter(([, result]) => (result instanceof RegExp ? !result.test(renderer) : !result))
  .map(([name]) => name);
const phase1Outstanding = phase1Checks.filter(([, result]) => !result.test(renderer)).map(([name]) => name);

const numberInputs = (renderer.match(/type="number"/g) || []).length;
const inputModes = (renderer.match(/inputmode="(?:numeric|decimal|email)"/g) || []).length;
const ariaLabels = (renderer.match(/aria-label=/g) || []).length;

console.log('STATIC SSR UX AUDIT');
console.log(`number input templates: ${numberInputs}`);
console.log(`inputmode declarations: ${inputModes}`);
console.log(`ARIA label templates: ${ariaLabels}`);
console.log(`enhancer bytes: ${Buffer.byteLength(enhancer, 'utf8')}`);
console.log(`static UX diff: ${failures.length ? failures.join(', ') : '(empty)'}`);

console.log(`\nPHASE 1, NOT YET BUILT — reported, not failed: ${phase1Outstanding.length} of ${phase1Checks.length}`);
for (const name of phase1Outstanding) console.log(`  ${name}`);
console.log('  NOTE: the two fixed-step-height checks contradict design spec Part 5,');
console.log('  which requires no fixed inner height and no internal scrollbar.');

if (failures.length) process.exitCode = 1;
