#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import {
  KNOWN,
  MANIFEST_PATH,
  ROOT,
  collectArtifactHashes,
  qualifyLegacyResult,
  runLegacyValidator,
  validateEffectiveState,
  validateManifest,
  validatePinnedHashes,
} from './validate-pc01-qualified-c01-debt.mjs';

const require = createRequire(import.meta.url);
const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));
const clone = (value) => structuredClone(value);
const manifest = readJson(MANIFEST_PATH);
const generated = readJson(path.join(ROOT, manifest.pinnedArtifacts.generatedC01.path));
const registry = readJson(path.join(ROOT, 'src/data/products/c01-specification-overrides.json'));
const helper = require('../src/lib/c01SpecificationOverrides.js');
const actualHashes = collectArtifactHashes(ROOT, manifest);
const legacy = runLegacyValidator(manifest, ROOT);

function rejects(label, callback, messagePattern) {
  assert.throws(callback, messagePattern, label);
  console.log(`Mutation rejected: ${label}`);
}

validateManifest(manifest);
validatePinnedHashes(manifest, actualHashes);
qualifyLegacyResult(legacy, manifest, ROOT);
validateEffectiveState(manifest, generated, registry, helper.getEffectiveC01SpecificationEntry);

const generatedHashMutation = { ...actualHashes, generatedC01: '0'.repeat(64) };
rejects(
  'generated C01 SHA changes',
  () => validatePinnedHashes(manifest, generatedHashMutation),
  /generatedC01 SHA-256 changed/
);

const validatorHashMutation = { ...actualHashes, legacyCopyValidator: '1'.repeat(64) };
rejects(
  'legacy validator hash changes',
  () => validatePinnedHashes(manifest, validatorHashMutation),
  /legacyCopyValidator SHA-256 changed/
);

const copyPackHashMutation = { ...actualHashes, approvedCopyPack: '2'.repeat(64) };
rejects(
  'approved copy-pack hash changes',
  () => validatePinnedHashes(manifest, copyPackHashMutation),
  /approvedCopyPack SHA-256 changed/
);

const changedFailureRow = {
  ...legacy,
  stderr: String(legacy.stderr).replace(
    'AssertionError: Electrical protection',
    'AssertionError: Electrical wiring'
  ),
};
rejects(
  'expected failure row changes',
  () => qualifyLegacyResult(changedFailureRow, manifest, ROOT),
  /legacy stderr changed|first failing row changed/
);

const additionalFailure = {
  ...legacy,
  stderr: `${legacy.stderr}AssertionError: Electrical wiring\n`,
};
rejects(
  'an additional failure appears',
  () => qualifyLegacyResult(additionalFailure, manifest, ROOT),
  /legacy stderr changed|additional surfaced legacy failure appeared/
);

const brokenRegistry = clone(registry);
brokenRegistry.overrides[0].expectedBaseDetail += ' stale';
rejects(
  'the PC-01 override fails',
  () =>
    validateEffectiveState(
      manifest,
      generated,
      brokenRegistry,
      helper.getEffectiveC01SpecificationEntry
    ),
  /STALE_OR_INVALID_SPECIFICATION_OVERRIDE/
);

const otherPc01RowChanged = (slug, dataset, suppliedRegistry) => {
  const effective = helper.getEffectiveC01SpecificationEntry(slug, dataset, suppliedRegistry);
  if (slug === KNOWN.targetSlug) {
    effective.specifications.find((row) => row.component !== KNOWN.targetRow).detail += ' changed';
  }
  return effective;
};
rejects(
  'another PC-01 row changes',
  () => validateEffectiveState(manifest, generated, registry, otherPc01RowChanged),
  /non-Fasteners PC-01 row changed/
);

const changedSibling = manifest.pc01Override.protectedSiblingEntries[0];
const protectedSiblingChanged = (slug, dataset, suppliedRegistry) => {
  const effective = helper.getEffectiveC01SpecificationEntry(slug, dataset, suppliedRegistry);
  if (slug === changedSibling) effective.specifications[0].detail += ' changed';
  return effective;
};
rejects(
  'a protected sibling changes',
  () => validateEffectiveState(manifest, generated, registry, protectedSiblingChanged),
  new RegExp(`${changedSibling} effective entry changed`)
);

const decisionsChanged = clone(manifest);
decisionsChanged.ownerRowDecisions.Warranty = 'CONTROLLED_WORKBOOK_REQUIRED';
rejects(
  'owner decisions are altered',
  () => validateManifest(decisionsChanged),
  /owner decisions changed/
);

const debtResolved = clone(manifest);
debtResolved.debtStatus = 'RESOLVED';
debtResolved.controlledWorkbook.status = 'RESOLVED';
rejects(
  'debt is marked resolved without a workbook-backed event',
  () => validateManifest(debtResolved),
  /debt cannot be marked resolved|controlled-workbook debt cannot be marked resolved/
);

console.log('PC-01 qualified C01 debt mutation tests: PASS (10/10)');
