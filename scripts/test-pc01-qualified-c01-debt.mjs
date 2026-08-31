#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  KNOWN,
  MANIFEST_PATH,
  ROOT,
  assertValidationSourcesUnchanged,
  collectArtifactHashes,
  collectValidationSourceHashes,
  qualifyLegacyResult,
  runLegacyValidator,
  validateEffectiveState,
  validateManifest,
  validatePinnedHashes,
  validateQualification,
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
const CANDIDATE_B = 'c04737f28895ef5296d1ab63e8fd98762fad4557';
const PRODUCTION = '3346a532306c52932aeb2d813591bf95cb37716b';

function rejects(label, callback, messagePattern) {
  assert.throws(callback, messagePattern, label);
  console.log(`Mutation rejected: ${label}`);
}

function git(cwd, args, options = {}) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'PC01 REL-06A portability test',
      GIT_AUTHOR_EMAIL: 'pc01-rel06a@example.invalid',
      GIT_COMMITTER_NAME: 'PC01 REL-06A portability test',
      GIT_COMMITTER_EMAIL: 'pc01-rel06a@example.invalid',
      ...options.env,
    },
    input: options.input,
  });
  assert.equal(result.error, undefined, `git ${args.join(' ')} could not start`);
  assert.equal(
    result.status,
    0,
    `git ${args.join(' ')} failed: ${result.stdout || ''}${result.stderr || ''}`
  );
  return result.stdout.trim();
}

function portValidatorFiles(targetRoot) {
  for (const relativePath of [
    'page-structure/contracts/pc01-c01-qualified-legacy-debt-2026-08-29.json',
    'scripts/validate-pc01-qualified-c01-debt.mjs',
  ]) {
    const destination = path.join(targetRoot, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(path.join(ROOT, relativePath), destination);
  }
}

function runPortabilityTests() {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'pc01-rel06a-portability-'));
  const temporaryRepository = path.join(temporaryRoot, 'repository');
  const worktrees = [];

  const addWorktree = (name, revision, branchName = null) => {
    const worktree = path.join(temporaryRoot, name);
    const args = branchName
      ? ['worktree', 'add', '-b', branchName, worktree, revision]
      : ['worktree', 'add', '--detach', worktree, revision];
    git(temporaryRepository, args);
    worktrees.push(worktree);
    portValidatorFiles(worktree);
    return worktree;
  };

  try {
    git(temporaryRoot, ['clone', '--shared', '--no-checkout', ROOT, temporaryRepository]);
    git(temporaryRepository, ['update-ref', 'refs/remotes/origin/static-migration', PRODUCTION]);

    const original = addWorktree(
      'original-qualification',
      KNOWN.qualificationCommit,
      'rel06a-original-qualification'
    );
    const originalResult = validateQualification(original);
    assert.equal(originalResult.checkout.head, KNOWN.qualificationCommit);
    console.log('Portability accepted: original qualification checkpoint');

    const candidate = addWorktree('candidate-b', CANDIDATE_B, 'rel06a-candidate-b');
    const candidateResult = validateQualification(candidate);
    assert.equal(candidateResult.checkout.head, CANDIDATE_B);
    console.log('Portability accepted: Candidate B descendant');

    const renamed = addWorktree('renamed-feature', CANDIDATE_B, 'rel06a-differently-named-feature');
    const renamedResult = validateQualification(renamed);
    assert.equal(renamedResult.checkout.branch, 'rel06a-differently-named-feature');
    console.log('Portability accepted: differently named Candidate B branch');

    const detached = addWorktree('detached-candidate-b', CANDIDATE_B);
    const detachedResult = validateQualification(detached);
    assert.equal(detachedResult.checkout.detached, true);
    assert.equal(detachedResult.checkout.branch, null);
    console.log('Portability accepted: detached HEAD at Candidate B');

    const sideCommit = git(
      temporaryRepository,
      ['commit-tree', `${KNOWN.qualificationCommit}^{tree}`, '-p', KNOWN.qualificationCommit],
      { input: 'REL-06A synthetic qualification side\n' }
    );
    const mergeCommit = git(
      temporaryRepository,
      ['commit-tree', `${CANDIDATE_B}^{tree}`, '-p', CANDIDATE_B, '-p', sideCommit],
      { input: 'REL-06A synthetic integration merge\n' }
    );
    const merge = addWorktree('synthetic-merge', mergeCommit);
    const mergeResult = validateQualification(merge);
    assert.equal(mergeResult.checkout.head, mergeCommit);
    console.log('Portability accepted: synthetic merge containing qualification checkpoint');

    assert.equal(renamedResult.checkout.branch, 'rel06a-differently-named-feature');
    assert.equal(renamedResult.checkout.detached, false);
    console.log('Evidence-only checkout reporting: branch reported without controlling validation');

    const nonAncestor = addWorktree('non-ancestor', PRODUCTION);
    rejects(
      'HEAD without the qualification checkpoint in its ancestry',
      () => validateQualification(nonAncestor),
      /qualification checkpoint is not an ancestor of current HEAD/
    );
  } finally {
    for (const worktree of worktrees.reverse()) {
      const result = spawnSync('git', ['worktree', 'remove', '--force', worktree], {
        cwd: temporaryRepository,
        encoding: 'utf8',
      });
      assert.equal(
        result.status,
        0,
        `temporary worktree cleanup failed: ${result.stdout || ''}${result.stderr || ''}`
      );
    }
    if (path.resolve(temporaryRoot).startsWith(path.resolve(tmpdir()) + path.sep)) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }
}

validateManifest(manifest);
validatePinnedHashes(manifest, actualHashes);
qualifyLegacyResult(legacy, manifest, ROOT);
validateEffectiveState(manifest, generated, registry, helper.getEffectiveC01SpecificationEntry);
runPortabilityTests();

const wrongQualificationCommit = clone(manifest);
wrongQualificationCommit.qualificationCheckpoint.commit = '0'.repeat(40);
rejects(
  'wrong pinned qualification commit',
  () => validateManifest(wrongQualificationCommit),
  /qualification commit changed/
);

const wrongQualificationTree = clone(manifest);
wrongQualificationTree.qualificationCheckpoint.tree = '1'.repeat(40);
rejects(
  'wrong pinned qualification tree',
  () => validateManifest(wrongQualificationTree),
  /qualification tree changed/
);

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
  'expected failure signature changes',
  () => qualifyLegacyResult(changedFailureRow, manifest, ROOT),
  /legacy stderr changed|first failing row changed/
);

const additionalFailure = {
  ...legacy,
  stderr: `${legacy.stderr}AssertionError: Electrical wiring\n`,
};
rejects(
  'an additional legacy failure appears',
  () => qualifyLegacyResult(additionalFailure, manifest, ROOT),
  /legacy stderr changed|additional surfaced legacy failure appeared/
);

const decisionsChanged = clone(manifest);
decisionsChanged.ownerRowDecisions.Warranty = 'CONTROLLED_WORKBOOK_REQUIRED';
rejects(
  'owner row decisions are altered',
  () => validateManifest(decisionsChanged),
  /owner decisions changed/
);

const brokenRegistry = clone(registry);
brokenRegistry.overrides[0].expectedBaseDetail += ' stale';
rejects(
  'the PC-01 specification override fails',
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
  'another effective PC-01 row changes',
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

const debtResolved = clone(manifest);
debtResolved.debtStatus = 'RESOLVED';
debtResolved.controlledWorkbook.status = 'RESOLVED';
rejects(
  'debt is marked resolved without workbook-backed evidence',
  () => validateManifest(debtResolved),
  /debt cannot be marked resolved|controlled-workbook debt cannot be marked resolved/
);

const sourceHashesBefore = collectValidationSourceHashes(ROOT);
const sourceHashesAfterMutation = { ...sourceHashesBefore };
sourceHashesAfterMutation['scripts/validate-pc01-qualified-c01-debt.mjs'] = 'f'.repeat(64);
rejects(
  'validator source mutation violates the no-write control',
  () => assertValidationSourcesUnchanged(sourceHashesBefore, sourceHashesAfterMutation),
  /validation modified source bytes/
);

console.log('PC-01 qualified C01 debt portability/mutation tests: PASS (20/20)');
