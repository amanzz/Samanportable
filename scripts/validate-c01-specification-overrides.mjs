import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GENERATED_PATH = path.join(ROOT, 'src/data/products/c01-specifications.json');
const EXPECTED_GENERATED_SHA256 = '3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099';
const TARGET_SLUG = 'porta-cabins';
const TARGET_LABEL = 'Fasteners & sealing';
const SIBLINGS = [
  'low-cost-porta-cabin',
  'luxury-porta-cabin',
  'mini-porta-cabin',
  'portacabin-office',
  'steel-porta-cabin',
];

const generated = require('../src/data/products/c01-specifications.json');
const registry = require('../src/data/products/c01-specification-overrides.json');
const {
  ERROR_CODE,
  getEffectiveC01SpecificationEntry,
  validateC01SpecificationOverrides,
} = require('../src/lib/c01SpecificationOverrides.js');

const clone = (value) => structuredClone(value);
const hash = (value) => createHash('sha256').update(value).digest('hex');
const generatedBytes = readFileSync(GENERATED_PATH);

function expectFailClosed(label, callback) {
  assert.throws(callback, (error) => {
    assert.match(String(error?.message), new RegExp(`^${ERROR_CODE}:`));
    return true;
  }, label);
}

assert.equal(hash(generatedBytes), EXPECTED_GENERATED_SHA256, 'generated JSON drifted from baseline');
assert.equal(validateC01SpecificationOverrides(generated, registry), true);

const ids = registry.overrides.map((entry) => entry.id);
const keys = registry.overrides.map((entry) => `${entry.productSlug}\u0000${entry.rowLabel}`);
assert.equal(new Set(ids).size, ids.length, 'override IDs must be unique');
assert.equal(new Set(keys).size, keys.length, 'product/row keys must be unique');
assert.equal(registry.overrides.length, 1, 'only one override is authorized');

const approved = registry.overrides[0];
assert.equal(approved.productSlug, TARGET_SLUG);
assert.equal(approved.rowLabel, TARGET_LABEL);

const baseTarget = generated.products[TARGET_SLUG];
const effectiveTarget = getEffectiveC01SpecificationEntry(TARGET_SLUG, generated, registry);
assert.ok(effectiveTarget, 'effective PC-01 entry is missing');
assert.equal(baseTarget.specifications.length, generated.rowCount);
assert.equal(effectiveTarget.specifications.length, generated.rowCount);

const targetRows = baseTarget.specifications.filter((row) => row.component === TARGET_LABEL);
const effectiveRows = effectiveTarget.specifications.filter((row) => row.component === TARGET_LABEL);
assert.equal(targetRows.length, 1, 'base target row count');
assert.equal(effectiveRows.length, 1, 'effective target row count');
assert.equal(targetRows[0].detail, approved.expectedBaseDetail);
assert.equal(effectiveRows[0].detail, approved.replacementDetail);

for (let index = 0; index < baseTarget.specifications.length; index += 1) {
  const baseRow = baseTarget.specifications[index];
  const effectiveRow = effectiveTarget.specifications[index];
  assert.equal(effectiveRow.component, baseRow.component, `row order changed at ${index}`);
  if (baseRow.component === TARGET_LABEL) {
    const { detail: baseDetail, ...baseRest } = baseRow;
    const { detail: effectiveDetail, ...effectiveRest } = effectiveRow;
    assert.deepEqual(effectiveRest, baseRest, 'target row fields other than detail changed');
    assert.equal(baseDetail, approved.expectedBaseDetail);
    assert.equal(effectiveDetail, approved.replacementDetail);
  } else {
    assert.deepEqual(effectiveRow, baseRow, `non-target PC-01 row changed at ${index}`);
  }
}

for (const slug of SIBLINGS) {
  const effectiveSibling = getEffectiveC01SpecificationEntry(slug, generated, registry);
  assert.deepEqual(effectiveSibling, generated.products[slug], `${slug} effective data changed`);
}

const baseGrills = baseTarget.specifications.find((row) => row.component === 'Grills / mosquito mesh');
const effectiveGrills = effectiveTarget.specifications.find((row) => row.component === 'Grills / mosquito mesh');
assert.ok(baseGrills && effectiveGrills, 'Grills / mosquito mesh row is missing');
assert.deepEqual(effectiveGrills, baseGrills, 'Grills / mosquito mesh changed');

const detailMismatch = clone(generated);
detailMismatch.products[TARGET_SLUG].specifications.find(
  (row) => row.component === TARGET_LABEL
).detail += ' stale';
expectFailClosed('base-detail mismatch must fail closed', () =>
  validateC01SpecificationOverrides(detailMismatch, registry)
);

const md5Mismatch = clone(generated);
md5Mismatch.sourceWorkbookMd5 = '00000000000000000000000000000000';
expectFailClosed('MD5 mismatch must fail closed', () =>
  validateC01SpecificationOverrides(md5Mismatch, registry)
);

const duplicateRegistry = clone(registry);
duplicateRegistry.overrides.push({
  ...duplicateRegistry.overrides[0],
  id: 'PC01-FASTENERS-SEALING-2026-08-27-DUPLICATE',
});
expectFailClosed('duplicate override must fail closed', () =>
  validateC01SpecificationOverrides(generated, duplicateRegistry)
);

assert.equal(hash(readFileSync(GENERATED_PATH)), EXPECTED_GENERATED_SHA256, 'generated JSON changed during validation');

console.log('C01 specification override validation: PASS');
console.log(`Generated SHA-256: ${EXPECTED_GENERATED_SHA256}`);
console.log(`Effective target: ${TARGET_SLUG} / ${TARGET_LABEL}`);
console.log(`Sibling entries unchanged: ${SIBLINGS.length}/5`);
console.log('Fail-closed simulations: base detail, MD5, duplicate override PASS');
