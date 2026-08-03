import fs from 'node:fs';

const renderer = fs.readFileSync('src/lib/cabinCalculatorSSR.ts', 'utf8');
const enhancer = fs.readFileSync('public/scripts/cabin-cost-calculator.js', 'utf8');

const checks = [
  ['44px form controls', /min-height:44px/],
  ['visible focus state', /focus-visible\{outline:3px/],
  ['desktop fixed step height', /height:720px;min-height:720px/],
  ['mobile reserved step height', /min-height:610px/],
  ['360px fixed estimate bar', /@media\(max-width:600px\).*\.mobile-estimate\{position:fixed/],
  ['numeric input mode', /inputmode="numeric"/],
  ['decimal input mode', /inputmode="decimal"/],
  ['range ARIA labels', /aria-label="Door \$\{index \+ 1\} position along wall"/],
  ['step navigation label', /aria-label="Calculator steps"/],
  ['all steps SSR visibility', /\.calc-step\{display:block/],
  ['enhanced-only step hiding', /\.is-enhanced \.calc-step:not\(\.is-active\)/],
  ['no DOM content creation', !/createElement|innerHTML/.test(enhancer)],
  ['one enquiry fetch only', (enhancer.match(/\bfetch\(/g) || []).length === 1 && /fetch\(form\.dataset\.enhancedAction \|\| '\/api\/enquiry'/.test(enhancer)],
];

const failures = checks.filter(([, result]) => result instanceof RegExp ? !result.test(renderer) : !result).map(([name]) => name);
const numberInputs = (renderer.match(/type="number"/g) || []).length;
const inputModes = (renderer.match(/inputmode="(?:numeric|decimal|email)"/g) || []).length;
const ariaLabels = (renderer.match(/aria-label=/g) || []).length;

console.log('STATIC SSR UX AUDIT');
console.log('minimum tap target: 44 px');
console.log(`number input templates: ${numberInputs}`);
console.log(`inputmode declarations: ${inputModes}`);
console.log(`ARIA label templates: ${ariaLabels}`);
console.log('fixed step panel height: 720 px desktop / 610 px mobile');
console.log(`enhancer bytes: ${Buffer.byteLength(enhancer, 'utf8')}`);
console.log(`static UX diff: ${failures.length ? failures.join(', ') : '(empty)'}`);

if (failures.length) process.exitCode = 1;
