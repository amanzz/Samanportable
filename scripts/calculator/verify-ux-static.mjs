import fs from 'node:fs';

const file = 'src/components/calculator/CabinCostCalculatorV9.tsx';
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['global button minimum', /button\{min-height:44px/],
  ['form control minimum', /min-height:44px;border:1px/],
  ['quantity button width', /quantity-controls button\{width:44px/],
  ['visible focus state', /button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible/],
  ['reserved step height', /step-panel\{min-height:560px/],
  ['mobile breakpoint', /@media\(max-width:600px\)/],
  ['mobile estimate fixed', /mobile-estimate\{display:block;position:fixed/],
  ['numeric input mode', /inputMode="numeric"/],
  ['decimal input mode', /inputMode="decimal"/],
  ['range aria label', /aria-label={`Door \$\{index \+ 1\} position`}/],
  ['step navigation label', /aria-label="Calculator steps"/],
];

const failures = checks.filter(([, pattern]) => !pattern.test(source)).map(([name]) => name);
const numberInputs = (source.match(/type="number"/g) || []).length;
const numericInputModes = (source.match(/inputMode=(?:"(?:numeric|decimal|email)"|\{)/g) || []).length;
const ariaLabels = (source.match(/aria-label/g) || []).length;

console.log('STATIC UX AUDIT');
console.log(`44 px tap-target rules checked: 3`);
console.log(`number input templates: ${numberInputs}`);
console.log(`inputmode declarations: ${numericInputModes}`);
console.log(`ARIA label declarations: ${ariaLabels}`);
console.log(`reserved step panel height: 560 px`);
console.log(`static UX diff: ${failures.length ? failures.join(', ') : '(empty)'}`);

if (failures.length) process.exitCode = 1;
