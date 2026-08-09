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
 * PHASE 1 checks. Live gates as of 03 Aug 2026, when Phase 1 was released.
 *
 *
 * The two fixed-height assertions were DELETED by ruling on 03 Aug 2026:
 * height:720px and min-height:610px on the step panel contradicted design spec
 * Part 5, and the spec is right. A fixed inner height is what produced the
 * defect SAMAN rejected — a panel clipped at ~440px with its own scrollbar
 * while the viewport sat empty. Layout stability comes from reserving space on
 * the media inside the panel, not from freezing the container.
 */
const phase1Checks = [
  ['44px form controls', /min-height:44px/],
  ['visible focus state', /focus-visible\{outline:3px/],
  ['360px fixed estimate bar', /@media\(max-width:600px\).*\.mobile-estimate\{position:fixed/],
  ['range ARIA labels', /aria-label="Door \$\{index \+ 1\} position along wall"/],
  ['all steps SSR visibility', /\.calc-step\{display:block/],
  ['enhanced-only step hiding', /\.is-enhanced \.calc-step:not\(\.is-active\)/],
];

const failures = checks
  .filter(([, result]) => (result instanceof RegExp ? !result.test(renderer) : !result))
  .map(([name]) => name);
const phase1Failures = phase1Checks.filter(([, result]) => !result.test(renderer)).map(([name]) => name);

const numberInputs = (renderer.match(/type="number"/g) || []).length;
const inputModes = (renderer.match(/inputmode="(?:numeric|decimal|email)"/g) || []).length;
const ariaLabels = (renderer.match(/aria-label=/g) || []).length;

console.log('STATIC SSR UX AUDIT');
console.log(`number input templates: ${numberInputs}`);
console.log(`inputmode declarations: ${inputModes}`);
console.log(`ARIA label templates: ${ariaLabels}`);
console.log(`enhancer bytes: ${Buffer.byteLength(enhancer, 'utf8')}`);
console.log(`static UX diff: ${failures.length ? failures.join(', ') : '(empty)'}`);

console.log(`phase 1 diff: ${phase1Failures.length ? phase1Failures.join(', ') : '(empty)'}`);

/**
 * No fixed inner height on the step panel, and no internal scrollbar.
 * Design spec Part 5: the panel grows with its content.
 */
const forbiddenHeight = [
  // The old pattern required a ';' or '{' BEFORE `height`, but `.step-card{`
  // already consumed the brace, so `.step-card{height:720px` slipped past it.
  ['fixed step height', /\.step-card\{(?:[^}]*;)?\s*height:\s*(?!0\s*[;}])\d/],
  // `min-height: 0` REMOVES a minimum, so it is the opposite of the defect.
  // Only a non-zero value is a fixed height.
  ['step panel min-height', /\.step-card\{(?:[^}]*;)?\s*min-height:\s*(?!0\s*[;}])\d/],
  ['step panel internal scroll', /\.step-card\{[^}]*overflow-y:\s*(?:auto|scroll)/],
];
const heightViolations = forbiddenHeight.filter(([, re]) => re.test(renderer)).map(([name]) => name);
console.log(`fixed-height diff: ${heightViolations.length ? heightViolations.join(', ') : '(empty)'}`);

if (failures.length || phase1Failures.length || heightViolations.length) process.exitCode = 1;
