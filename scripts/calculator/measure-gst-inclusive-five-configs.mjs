/**
 * CALC-L7 §A2 — the GST-inclusive figure Engine B prints, on the five
 * configurations CALC-L5 used, measured before and after the shared-constant
 * extraction.
 *
 * Engine B's "GST included guidance" option multiplied by 1.05 while the repo's
 * own GST_RATE is 0.18. A buyer selecting that option was shown a
 * "tax-inclusive" figure understating GST by roughly 13 percentage points. This
 * script drives the SHIPPED module — getEstimateFromInput, loaded through jiti
 * exactly as verify-route-price-identity.mjs loads it — so the figures are what
 * the page prints, not a re-derivation of them.
 *
 * The comparison that matters is per-configuration: the same config priced with
 * gst = "GST extra" (the ex-GST base) against gst = "GST included guidance".
 * Correct behaviour is inclusive == extra x (1 + GST_RATE), to the rupee.
 *
 * Run:  node scripts/calculator/measure-gst-inclusive-five-configs.mjs [--out FILE]
 * Exit: 0 always. This measures; it does not gate. The gate is G27.
 */
import jitiPkg from 'jiti';
import fs from 'fs';
import path from 'path';
import Module from 'node:module';

const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(SRC, request.slice(2));
  }
  return resolveFilename.call(this, request, ...rest);
};

const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const engineB = jiti('./src/lib/price-calculator-config.ts');
const rates = jiti('./src/lib/calculatorRates.ts');

const { getEstimateFromInput } = engineB;
const { GST_RATE } = rates;

/** Every field PriceCalculatorFormState requires, at the values the form opens
 *  with. Only what a configuration names is overridden below. */
const BASE_FORM = {
  productId: 'porta_cabin',
  zone: 'South',
  length: '20',
  width: '10',
  quantity: '1',
  materialType: 'MS Cabin',
  internalWall: 'MDF 8MM Internal Wall',
  ceiling: 'MDF 8MM Ceiling',
  flooring: 'Vinyl Flooring',
  windowType: 'Aluminum',
  panelThickness: 50,
  transport: 'Transport to be confirmed',
  installation: 'Installation not required',
  gst: 'GST extra',
  specialPanelSheet: '',
  specialFloorStructure: '',
  numberOfRooms: '0',
  fullName: '',
  email: '',
  mobile: '',
  requirementNotes: '',
  selectedAddOns: {},
};

/** CALC-L5's five configurations, unchanged, so the figures line up row for row
 *  with the table in that report. */
const CONFIGS = [
  { n: 1, label: 'Porta cabin 20x10 ft, qty 1', form: { productId: 'porta_cabin', length: '20', width: '10' } },
  { n: 2, label: 'Container office 20x8 ft, qty 1', form: { productId: 'container_office', length: '20', width: '8' } },
  { n: 3, label: 'Portable cabin 40x10 ft, qty 1', form: { productId: 'portable_cabin', length: '40', width: '10' } },
  { n: 4, label: 'Porta cabin 20x10 ft + 1 attached toilet', form: { productId: 'porta_cabin', length: '20', width: '10', selectedAddOns: { 'Attached Toilet': 1 } } },
  { n: 5, label: 'Container office 20x8 ft + 4 workstations + 4 chairs', form: { productId: 'container_office', length: '20', width: '8', selectedAddOns: { Workstation: 4, Chairs: 4 } } },
];

const INR = (n) => '₹' + Math.round(Number(n)).toLocaleString('en-IN');

function price(config, gstOption) {
  const form = { ...BASE_FORM, ...config.form, gst: gstOption };
  const est = getEstimateFromInput(form);
  return {
    low: est.lowRange,
    typical: est.typicalRange,
    high: est.highRange,
    // Engine B taxes the base line and then ADDS the add-on total to the
    // result, so the add-on portion carries no GST at any multiplier value.
    // Split it out rather than inferring it, so the residual is measured.
    baseTypical: est.budgetBreakdown?.base?.typicalRange ?? null,
    addOnTypical: est.budgetBreakdown?.addOns?.typicalRange ?? 0,
  };
}

const rows = CONFIGS.map((c) => {
  const exGst = price(c, 'GST extra');
  const inclusive = price(c, 'GST included guidance');
  // What the inclusive figure SHOULD be if the option means what it says.
  const correct = exGst.typical * (1 + GST_RATE);
  const impliedRate = exGst.typical === 0 ? null : inclusive.typical / exGst.typical - 1;
  return {
    n: c.n,
    label: c.label,
    exGstTypical: exGst.typical,
    inclusiveTypical: inclusive.typical,
    inclusiveLow: inclusive.low,
    inclusiveHigh: inclusive.high,
    arithmeticallyCorrectInclusive: correct,
    gapToCorrect: correct - inclusive.typical,
    impliedGstRate: impliedRate,
    addOnTypicalUntaxed: inclusive.addOnTypical,
    gstForegoneOnAddOns: inclusive.addOnTypical * GST_RATE,
  };
});

const out = {
  gstRateConstant: GST_RATE,
  measuredAt: process.env.CALC_L7_STAMP || null,
  rows,
};

const outFlag = process.argv.indexOf('--out');
if (outFlag !== -1 && process.argv[outFlag + 1]) {
  const p = process.argv[outFlag + 1];
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(out, null, 2));
}

console.log('GST_RATE constant in repo: ' + GST_RATE + '  (' + (GST_RATE * 100).toFixed(0) + '%)');
console.log('');
console.log('# | configuration                                        | ex-GST typical | "GST included" typical | implied rate | correct @ GST_RATE | gap');
console.log('--|------------------------------------------------------|----------------|------------------------|--------------|--------------------|-----');
for (const r of rows) {
  console.log(
    String(r.n).padEnd(2) + '| ' +
    r.label.padEnd(53) + '| ' +
    INR(r.exGstTypical).padStart(15) + '| ' +
    INR(r.inclusiveTypical).padStart(23) + '| ' +
    (r.impliedGstRate === null ? 'n/a' : (r.impliedGstRate * 100).toFixed(2) + '%').padStart(13) + '| ' +
    INR(r.arithmeticallyCorrectInclusive).padStart(19) + '| ' +
    INR(r.gapToCorrect)
  );
}
console.log('');
// Engine B rounds every range to a step, so an exact-to-the-rupee assertion
// would fail on rounding alone. Half a step is the honest tolerance.
const ROUNDING_TOLERANCE = 500;
const withAddOns = rows.filter((r) => r.addOnTypicalUntaxed > 0);
const bodyCorrect = rows
  .filter((r) => r.addOnTypicalUntaxed === 0)
  .every((r) => Math.abs(r.gapToCorrect) <= ROUNDING_TOLERANCE);

console.log(bodyCorrect
  ? 'Cabin body: all add-on-free configurations now tax at GST_RATE, within rounding (<= ₹' + ROUNDING_TOLERANCE + ').'
  : 'Cabin body: configurations still NOT taxing at GST_RATE beyond rounding.');

if (withAddOns.length) {
  console.log('');
  console.log('RESIDUAL, pre-existing and NOT fixed here: add-ons are added after the GST');
  console.log('multiplier, so they carry no tax at any multiplier value.');
  for (const r of withAddOns) {
    console.log(
      '  config ' + r.n + ': ' + INR(r.addOnTypicalUntaxed) + ' of add-ons untaxed, ' +
      INR(r.gstForegoneOnAddOns) + ' of GST not charged (implied blended rate ' +
      (r.impliedGstRate * 100).toFixed(2) + '%)'
    );
  }
}
