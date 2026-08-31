#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  EXPECTED_APP_FILES,
  KNOWN,
  MANIFEST_PATH,
  MANIFEST_RELATIVE,
  ROOT,
  assertValidationSourcesUnchanged,
  collectValidationSourceHashes,
  validateAppState,
  validateBusinessData,
  validateClaims,
  validateDeterministicEvidence,
  validateManifest,
  validateQualification,
  validateServerHtml,
} from './validate-pc01-performance-measurement-debt.mjs';

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
const serverHtml = readFileSync(path.join(ROOT, manifest.serverRenderedEvidence.path), 'utf8');
const baseline = JSON.parse(readFileSync(path.join(ROOT, manifest.deterministicEvidence.baselineSummary.path), 'utf8'));
const candidate = JSON.parse(readFileSync(path.join(ROOT, manifest.deterministicEvidence.candidateSummary.path), 'utf8'));
const ownerReport = readFileSync(path.join(ROOT, 'seo-remediation/reports/PC01-REL-06B-OWNER-PERFORMANCE-DECISION.md'), 'utf8');
const clone = (value) => structuredClone(value);
let cases = 0;

function accepts(label, callback) {
  callback();
  cases += 1;
  console.log(`Portability accepted: ${label}`);
}

function rejects(label, callback, pattern) {
  assert.throws(callback, pattern, label);
  cases += 1;
  console.log(`Mutation rejected: ${label}`);
}

function git(cwd, args, options = {}) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    windowsHide: true,
    input: options.input,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'PC01 REL-06B portability test',
      GIT_AUTHOR_EMAIL: 'pc01-rel06b@example.invalid',
      GIT_COMMITTER_NAME: 'PC01 REL-06B portability test',
      GIT_COMMITTER_EMAIL: 'pc01-rel06b@example.invalid',
    },
  });
  assert.equal(result.error, undefined, `git ${args.join(' ')} could not start`);
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stdout || ''}${result.stderr || ''}`);
  return result.stdout.trim();
}

function portQualificationFiles(target) {
  for (const relative of [
    MANIFEST_RELATIVE,
    'seo-remediation/reports/PC01-REL-06B-OWNER-PERFORMANCE-DECISION.md',
    'scripts/validate-pc01-performance-measurement-debt.mjs',
  ]) {
    const destination = path.join(target, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(path.join(ROOT, relative), destination);
  }
}

function portabilityCases() {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'pc01-rel06b-portability-'));
  const repository = path.join(temporaryRoot, 'repository');
  const worktrees = [];
  const add = (name, revision, branch = null) => {
    const target = path.join(temporaryRoot, name);
    git(repository, branch
      ? ['worktree', 'add', '-b', branch, target, revision]
      : ['worktree', 'add', '--detach', target, revision]);
    worktrees.push(target);
    portQualificationFiles(target);
    return target;
  };

  try {
    git(temporaryRoot, ['clone', '--shared', '--no-checkout', ROOT, repository]);
    git(repository, ['update-ref', 'refs/remotes/origin/static-migration', KNOWN.production]);

    const detached = add('detached', KNOWN.portability);
    accepts('detached HEAD', () => assert.equal(validateQualification(detached).checkout.detached, true));

    const descendantCommit = git(repository, ['commit-tree', `${KNOWN.portability}^{tree}`, '-p', KNOWN.portability], {
      input: 'REL-06B synthetic descendant\n',
    });
    const descendant = add('descendant', descendantCommit, 'rel06b-unrelated-descendant-name');
    accepts('differently named descendant branch', () => {
      const result = validateQualification(descendant);
      assert.equal(result.checkout.head, descendantCommit);
      assert.equal(result.checkout.branch, 'rel06b-unrelated-descendant-name');
    });

    const sideCommit = git(repository, ['commit-tree', `${KNOWN.portability}^{tree}`, '-p', KNOWN.portability], {
      input: 'REL-06B synthetic side\n',
    });
    const mergeCommit = git(repository, [
      'commit-tree', `${KNOWN.portability}^{tree}`, '-p', descendantCommit, '-p', sideCommit,
    ], { input: 'REL-06B synthetic merge\n' });
    const merge = add('merge', mergeCommit);
    accepts('synthetic merge containing pinned history', () => assert.equal(validateQualification(merge).checkout.head, mergeCommit));

    const production = add('production', KNOWN.production);
    rejects(
      'HEAD without the portability checkpoint in its ancestry',
      () => validateQualification(production),
      /checkpoint is not an ancestor of current HEAD/
    );
  } finally {
    for (const target of worktrees.reverse()) {
      const result = spawnSync('git', ['worktree', 'remove', '--force', target], { cwd: repository, encoding: 'utf8' });
      assert.equal(result.status, 0, `temporary worktree cleanup failed: ${result.stdout || ''}${result.stderr || ''}`);
    }
    if (path.resolve(temporaryRoot).startsWith(path.resolve(tmpdir()) + path.sep)) {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }
}

accepts('qualification worktree', () => validateQualification(ROOT));
portabilityCases();

const wrongControl = clone(manifest);
wrongControl.checkpoints.controlA.commit = '0'.repeat(40);
rejects('wrong Control-A commit', () => validateManifest(wrongControl), /controlA commit changed/);

const wrongCandidate = clone(manifest);
wrongCandidate.checkpoints.candidateB.commit = '0'.repeat(40);
rejects('wrong Candidate-B commit', () => validateManifest(wrongCandidate), /candidateB commit changed/);

const missingSafeCommit = clone(manifest);
missingSafeCommit.checkpoints.safePhaseAApplication.commit = '1'.repeat(40);
rejects('missing safe application checkpoint', () => validateManifest(missingSafeCommit), /safePhaseAApplication commit changed/);

const hashes = Object.fromEntries(manifest.phaseAApplication.files.map((file) => [file.path, file.sha256]));
rejects(
  'safe application file set changes',
  () => validateAppState(manifest, EXPECTED_APP_FILES.slice(1), hashes),
  /app file set changed/
);

const wrongHashes = { ...hashes, [EXPECTED_APP_FILES[0]]: '2'.repeat(64) };
rejects('safe application hash changes', () => validateAppState(manifest, EXPECTED_APP_FILES, wrongHashes), /normalized SHA-256 changed/);

const belowDomManifest = clone(manifest);
const belowDomCandidate = clone(candidate);
belowDomCandidate.mobile.medians.dom = 2200;
belowDomManifest.deterministicEvidence.dom.candidate = 2200;
belowDomManifest.deterministicEvidence.dom.reductionPercent = 42.3;
rejects('DOM reduction falls below 45%', () => validateDeterministicEvidence(belowDomManifest, baseline, belowDomCandidate), /dom minimum reduction not met/);

const belowScriptManifest = clone(manifest);
const belowScriptCandidate = clone(candidate);
for (const run of belowScriptCandidate.mobile.runs) {
  run.resourceSummary.find((entry) => entry.resourceType === 'script').transferSize = 400000;
}
belowScriptManifest.deterministicEvidence.scriptTransferBytes.candidate = 400000;
belowScriptManifest.deterministicEvidence.scriptTransferBytes.reductionPercent = 38.5;
rejects('JavaScript reduction falls below 40%', () => validateDeterministicEvidence(belowScriptManifest, baseline, belowScriptCandidate), /scriptTransferBytes minimum reduction not met/);

rejects('server-rendered prices disappear', () => validateServerHtml(serverHtml.replaceAll('"priceExGst":', '"removedPriceExGst":'), manifest), /server-rendered prices changed/);
rejects('server-rendered FAQ/specification content disappears', () => validateServerHtml(serverHtml.replace('"mainEntity":[', '"mainEntity":[],"removedMainEntity":[').replace('"specificationsHtml":', '"removedSpecificationsHtml":'), manifest), /server-rendered FAQ content changed|server-rendered specification content changed/);
rejects('required Product/FAQ/Breadcrumb schema disappears', () => validateServerHtml(serverHtml.replaceAll('"@type":"Product"', '"@type":"RemovedProduct"'), manifest), /Product schema missing/);
rejects('active PDF link disappears', () => validateServerHtml(serverHtml.replaceAll(manifest.serverRenderedEvidence.pdfPath, '/removed.pdf'), manifest), /active PDF link missing/);
rejects('an approved child link disappears', () => validateServerHtml(serverHtml.replaceAll(manifest.serverRenderedEvidence.approvedChildPaths[0], '/removed-child'), manifest), /approved child link missing/);

rejects('Core Web Vitals pass claim is inserted', () => validateClaims(manifest, `${ownerReport}\nPASS CLAIM: Core Web Vitals passed.\n`), /prohibited claim inserted/);

const falseResolution = clone(manifest);
falseResolution.measurementStatus = 'RESOLVED';
falseResolution.resolutionEvidence = { status: 'AVAILABLE', fieldDataDays: 1, stableSyntheticLab: false };
rejects('measurement debt is falsely resolved', () => validateManifest(falseResolution), /cannot be resolved without evidence/);

const before = collectValidationSourceHashes(ROOT);
const after = { ...before, 'scripts/validate-pc01-performance-measurement-debt.mjs': 'f'.repeat(64) };
rejects('validator violates no-write source control', () => assertValidationSourcesUnchanged(before, after), /validation modified source bytes/);

assert.equal(cases, 20, `expected 20 cases, ran ${cases}`);
console.log('PC-01 performance measurement debt portability/mutation tests: PASS (20/20)');
