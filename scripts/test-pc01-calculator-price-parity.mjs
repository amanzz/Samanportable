import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readSnapshot, validateStaticSnapshot } from './validate-pc01-calculator-price-parity.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const original = readSnapshot(ROOT);
let passed = 0;

function cloneSnapshot() {
  return { ...original };
}

function rejects(name, mutate, expected) {
  const snapshot = cloneSnapshot();
  mutate(snapshot);
  assert.throws(() => validateStaticSnapshot(snapshot), expected, name);
  passed += 1;
  console.log(`PASS mutation: ${name}`);
}

rejects('old 10x10 base 110000', (s) => { s.server += '\nconst oldPc01Base10x10 = 110000;\n'; }, /hardcoded calculator base 110000/);
rejects('old 20x10 base 200000', (s) => { s.browser += '\nconst oldPc01Base20x10 = 200000;\n'; }, /hardcoded calculator base 200000/);
rejects('incorrect variant mapping', (s) => { s.product = s.product.replace('"sizeSlug": "10x10"', '"sizeSlug": "10x11"'); }, /protected bytes changed/);
rejects('hidden default paid option', (s) => { s.server = s.server.replace('if (isPc01IncludedDefaultWindow(config, window, index)) return;', ''); }, /hidden default adjustment guard missing/);
rejects('browser server divergence', (s) => { s.browser = s.browser.replace('function selectedVariantPrice(root, length, width)', 'function removedVariantPrice(root, length, width)'); }, /browser selected-variant lookup missing/);
rejects('estimate output divergence', (s) => { s.estimateApi = s.estimateApi.replace('computeCalculatorEstimate(config)', 'body.configuration.estimate'); }, /protected bytes changed/);
rejects('changed freight array', (s) => { s.rates = s.rates.replace('22500', '22501'); }, /protected bytes changed/);
rejects('changed optional rate', (s) => { s.componentRates = s.componentRates.replace('percent: 5', 'percent: 6'); }, /protected bytes changed/);
rejects('duplicated hardcoded PC-01 ladder', (s) => { s.server += '\nconst duplicatedPc01Ladder = [143750, 220000, 250000, 288000, 360000, 475000];\n'; }, /hardcoded calculator base 143750/);
rejects('changed GST', (s) => { s.tax = s.tax.replace('0.18', '0.17'); }, /protected bytes changed/);
rejects('changed published price', (s) => { s.product = s.product.replace('"priceExGst": 143750', '"priceExGst": 143751'); }, /protected bytes changed/);
rejects('validator source mutation', (s) => { s.validator = s.validator.replace("export const VALIDATOR_INVARIANT_ID = 'PC01_REL06C_R_PRICE_PARITY_V1';", "export const VALIDATOR_INVARIANT_ID = 'MUTATED_VALIDATOR';"); }, /validator invariant changed/);

assert.equal(readSnapshot(ROOT).validator, original.validator, 'mutation suite changed validator source');
assert.equal(fs.readFileSync(path.join(ROOT, 'src/data/products/porta-cabins.json'), 'utf8'), original.product, 'mutation suite changed product source');
console.log(`PC-01 calculator parity mutation tests: PASS (${passed}/12)`);
