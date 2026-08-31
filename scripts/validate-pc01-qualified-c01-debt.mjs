#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MANIFEST_PATH = path.join(
  ROOT,
  'page-structure/contracts/pc01-c01-qualified-legacy-debt-2026-08-29.json'
);

export const KNOWN = Object.freeze({
  schemaVersion: 2,
  decisionId: 'PC01-REL-02-OPTION-3-2026-08-29',
  decision: 'OPTION_3_QUALIFIED_LEGACY_DEBT',
  ownerAuthority: 'PC01-REL-02_DIRECT_OWNER_INSTRUCTION',
  debtStatus: 'QUALIFIED_UNRESOLVED',
  recoveredCommit: '74ce8bc7e11363be9253d25d582b5347a78b143d',
  recoveredTree: '62bdb5f47e6af7b69ff9ad81c961fbab034367ed',
  historicalSourceBranch: 'seo/pc01-qualified-c01-debt-active-pdf',
  branchSemantics: 'HISTORICAL_PROVENANCE_ONLY',
  qualificationCommit: 'e2fe1fcccffcc93b9cb3c21d2569738d83074c0c',
  qualificationTree: 'c298f08137e31892116f4ee774ffbfadb265fd25',
  qualificationSubject: 'chore(validation): qualify legacy C01 debt for PC-01 release',
  qualificationAncestryPolicy: 'REQUIRED_ANCESTOR_OF_CURRENT_HEAD',
  branchAuthorityStatement:
    'Current branch names and detached-HEAD state are not factual or security authorities. The pinned qualification commit, tree, content hashes, expected legacy failure and owner decisions control validation.',
  productionCommit: '3346a532306c52932aeb2d813591bf95cb37716b',
  generatedSha256: '3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099',
  legacyValidatorSha256: '3cd4cd1323d5cd1974f098b4a063ddadcb38ad0ae84a8590aa7c228e965eb60d',
  copyPackSha256: '22fed88951b15cd7b9f7d861dc1c4efd2f544e2fb1f66567d00d6e401522b132',
  legacyExitCode: 1,
  legacyAssertion: 'assert len(values) == 1, component',
  legacyRow: 'Electrical protection',
  legacyActualDistinctValueCount: 13,
  stdoutSha256: '1c59583f67845b7a486310e884b78c904e6aed17af181d5ad3959ea76988a13b',
  stderrSha256: 'e0296b5315561f83805445e19c0d7e71a62cdb2189de1e62a880da12b69a228b',
  overrideId: 'PC01-FASTENERS-SEALING-2026-08-27',
  targetSlug: 'porta-cabins',
  targetRow: 'Fasteners & sealing',
  targetDetail:
    'Approved self-tapping fasteners at floor-board and panel fixings, with welded joints cleaned before panel closure. Weather sealing and roof drainage are verified at pre-dispatch inspection.',
  activePdfPath: '/specs/saman-porta-cabins-technical-specification.pdf',
  sunsetCondition:
    'Remove this qualification after a controlled workbook programme reconciles the six rows and the legacy validator passes under a new approved contract.',
});

export const EXPECTED_OWNER_DECISIONS = Object.freeze({
  'Electrical protection': 'CONTROLLED_WORKBOOK_REQUIRED',
  'Electrical wiring': 'CONTROLLED_WORKBOOK_REQUIRED',
  'Fasteners & sealing': 'CONTROLLED_WORKBOOK_REQUIRED',
  'Grills / mosquito mesh': 'CONTROLLED_WORKBOOK_REQUIRED',
  Warranty: 'OWNER_FACT_REQUIRED',
  'Welding & fabrication': 'CONTROLLED_WORKBOOK_REQUIRED',
});

export const EXPECTED_PROHIBITIONS = Object.freeze([
  'This is not engineering approval.',
  'This does not approve specialist divergences.',
  'This does not make missing rows not applicable.',
  'This does not authorize deployment by itself.',
  'This does not suppress or weaken the legacy validator.',
]);

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const clone = (value) => structuredClone(value);

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd || ROOT,
    encoding: 'utf8',
    env: options.env || process.env,
  });
}

function commandText(result) {
  return `${result.stdout || ''}${result.stderr || ''}`.trim();
}

function requireSuccessful(result, label) {
  assert.equal(result.error, undefined, `${label} could not start: ${result.error?.message}`);
  assert.equal(result.status, 0, `${label} failed: ${commandText(result)}`);
}

export function validateManifest(manifest) {
  assert.equal(manifest.schemaVersion, KNOWN.schemaVersion, 'manifest schemaVersion changed');
  assert.equal(manifest.decisionId, KNOWN.decisionId, 'decision ID changed');
  assert.equal(manifest.decision, KNOWN.decision, 'owner option changed');
  assert.equal(manifest.ownerAuthority, KNOWN.ownerAuthority, 'owner authority changed');
  assert.equal(manifest.debtStatus, KNOWN.debtStatus, 'debt cannot be marked resolved without evidence');
  assert.equal(manifest.recoveredSource?.commit, KNOWN.recoveredCommit, 'recovered commit changed');
  assert.equal(manifest.recoveredSource?.tree, KNOWN.recoveredTree, 'recovered tree changed');
  assert.equal(
    manifest.recoveredSource?.historicalSourceBranch,
    KNOWN.historicalSourceBranch,
    'historical source branch changed'
  );
  assert.equal(
    manifest.recoveredSource?.branchSemantics,
    KNOWN.branchSemantics,
    'historical branch semantics changed'
  );
  assert.equal(
    manifest.qualificationCheckpoint?.commit,
    KNOWN.qualificationCommit,
    'qualification commit changed'
  );
  assert.equal(
    manifest.qualificationCheckpoint?.tree,
    KNOWN.qualificationTree,
    'qualification tree changed'
  );
  assert.equal(
    manifest.qualificationCheckpoint?.subject,
    KNOWN.qualificationSubject,
    'qualification subject changed'
  );
  assert.equal(
    manifest.qualificationCheckpoint?.ancestryPolicy,
    KNOWN.qualificationAncestryPolicy,
    'qualification ancestry policy changed'
  );
  assert.equal(
    manifest.branchAuthorityStatement,
    KNOWN.branchAuthorityStatement,
    'branch authority statement changed'
  );
  assert.equal(
    manifest.recoveredSource?.productionCommit,
    KNOWN.productionCommit,
    'production comparison changed'
  );
  assert.equal(
    manifest.pinnedArtifacts?.generatedC01?.sha256,
    KNOWN.generatedSha256,
    'generated C01 pin changed'
  );
  assert.equal(
    manifest.pinnedArtifacts?.legacyCopyValidator?.sha256,
    KNOWN.legacyValidatorSha256,
    'legacy validator pin changed'
  );
  assert.equal(
    manifest.pinnedArtifacts?.approvedCopyPack?.sha256,
    KNOWN.copyPackSha256,
    'approved copy-pack pin changed'
  );
  assert.equal(manifest.expectedLegacyFailure?.exitCode, KNOWN.legacyExitCode);
  assert.equal(manifest.expectedLegacyFailure?.assertion, KNOWN.legacyAssertion);
  assert.equal(manifest.expectedLegacyFailure?.rowLabel, KNOWN.legacyRow);
  assert.equal(manifest.expectedLegacyFailure?.expectedDistinctValueCount, 1);
  assert.equal(
    manifest.expectedLegacyFailure?.actualDistinctValueCount,
    KNOWN.legacyActualDistinctValueCount
  );
  assert.equal(manifest.expectedLegacyFailure?.surfacedFailureCount, 1);
  assert.equal(manifest.expectedLegacyFailure?.normalizedStdoutSha256, KNOWN.stdoutSha256);
  assert.equal(manifest.expectedLegacyFailure?.normalizedStderrSha256, KNOWN.stderrSha256);
  assert.deepEqual(manifest.ownerRowDecisions, EXPECTED_OWNER_DECISIONS, 'owner decisions changed');
  assert.equal(
    manifest.controlledWorkbook?.status,
    'REQUIRED_UNRESOLVED',
    'controlled-workbook debt cannot be marked resolved'
  );
  assert.equal(
    manifest.controlledWorkbook?.expectedMd5,
    '2bb681dff71ae744ea4d44418a09476a',
    'controlled-workbook fingerprint changed'
  );
  assert.equal(
    manifest.warrantyAuthority?.status,
    'OWNER_FACT_REQUIRED',
    'warranty authority changed without a new owner decision'
  );
  assert.equal(manifest.warrantyAuthority?.numericTermApproved, false);
  assert.equal(manifest.pc01Override?.id, KNOWN.overrideId);
  assert.equal(manifest.pc01Override?.productSlug, KNOWN.targetSlug);
  assert.equal(manifest.pc01Override?.rowLabel, KNOWN.targetRow);
  assert.equal(manifest.pc01Override?.effectiveDetail, KNOWN.targetDetail);
  assert.deepEqual(manifest.pc01Override?.protectedSiblingEntries, [
    'low-cost-porta-cabin',
    'luxury-porta-cabin',
    'mini-porta-cabin',
    'portacabin-office',
    'steel-porta-cabin',
  ]);
  assert.equal(manifest.activePc01PdfPath, KNOWN.activePdfPath);
  assert.equal(manifest.sunsetCondition, KNOWN.sunsetCondition);
  assert.deepEqual(manifest.prohibitedInterpretations, EXPECTED_PROHIBITIONS);
  return true;
}

export function collectArtifactHashes(root, manifest) {
  return Object.fromEntries(
    Object.entries(manifest.pinnedArtifacts).map(([key, artifact]) => [
      key,
      sha256(readFileSync(path.join(root, artifact.path))),
    ])
  );
}

export function validatePinnedHashes(manifest, actualHashes) {
  for (const [key, artifact] of Object.entries(manifest.pinnedArtifacts)) {
    assert.equal(actualHashes[key], artifact.sha256, `${key} SHA-256 changed`);
  }
  return true;
}

export function normalizeLegacyOutput(value, root = ROOT) {
  let normalized = String(value || '').replace(/\r\n/g, '\n');
  for (const rootVariant of [root, root.replaceAll('\\', '/')]) {
    normalized = normalized.split(rootVariant).join('<WORKTREE>');
  }
  return normalized.replaceAll('\\', '/');
}

export function runLegacyValidator(manifest, root = ROOT) {
  const [command, ...args] = manifest.expectedLegacyFailure.command;
  return run(command, args, {
    cwd: root,
    env: { ...process.env, PYTHONUTF8: '1' },
  });
}

export function qualifyLegacyResult(result, manifest, root = ROOT) {
  assert.equal(result.error, undefined, `legacy validator could not start: ${result.error?.message}`);
  assert.equal(result.status, manifest.expectedLegacyFailure.exitCode, 'legacy exit code changed');
  const stdout = normalizeLegacyOutput(result.stdout, root);
  const stderr = normalizeLegacyOutput(result.stderr, root);
  assert.equal(sha256(stdout), manifest.expectedLegacyFailure.normalizedStdoutSha256, 'legacy stdout changed');
  assert.equal(sha256(stderr), manifest.expectedLegacyFailure.normalizedStderrSha256, 'legacy stderr changed');
  assert.ok(stderr.includes(KNOWN.legacyAssertion), 'expected assertion is absent');
  assert.ok(stderr.includes(`AssertionError: ${KNOWN.legacyRow}`), 'first failing row changed');
  assert.equal(
    (stderr.match(/AssertionError:/g) || []).length,
    manifest.expectedLegacyFailure.surfacedFailureCount,
    'additional surfaced legacy failure appeared'
  );
  return { stdoutSha256: sha256(stdout), stderrSha256: sha256(stderr) };
}

export function countDistinctHardCommonValues(generated, rowLabel) {
  const values = new Set();
  for (const [slug, entry] of Object.entries(generated.products || {})) {
    const rows = entry.specifications.filter((row) => row.component === rowLabel);
    assert.equal(rows.length, 1, `${slug} does not have exactly one ${rowLabel} row`);
    values.add(rows[0].detail);
  }
  return values.size;
}

export function validateEffectiveState(manifest, generated, registry, getEffective) {
  assert.equal(registry.overrides?.length, 1, 'override registry count changed');
  assert.equal(registry.overrides[0]?.id, manifest.pc01Override.id, 'PC-01 override ID changed');
  assert.equal(registry.overrides[0]?.replacementDetail, KNOWN.targetDetail, 'PC-01 override wording changed');

  const base = generated.products[KNOWN.targetSlug];
  const effective = getEffective(KNOWN.targetSlug, generated, registry);
  assert.ok(base && effective, 'PC-01 specification entry is missing');
  assert.equal(base.specifications.length, 30, 'PC-01 base row count changed');
  assert.equal(effective.specifications.length, 30, 'PC-01 effective row count changed');

  for (let index = 0; index < base.specifications.length; index += 1) {
    const baseRow = base.specifications[index];
    const effectiveRow = effective.specifications[index];
    assert.equal(typeof effectiveRow.component, 'string', `row ${index + 1} component is invalid`);
    assert.ok(effectiveRow.component.trim(), `row ${index + 1} component is empty`);
    assert.equal(typeof effectiveRow.detail, 'string', `row ${index + 1} detail is invalid`);
    assert.ok(effectiveRow.detail.trim(), `row ${index + 1} detail is empty`);
    assert.equal(effectiveRow.component, baseRow.component, `PC-01 row order changed at ${index}`);
    if (baseRow.component === KNOWN.targetRow) {
      const { detail: baseDetail, ...baseRest } = baseRow;
      const { detail: effectiveDetail, ...effectiveRest } = effectiveRow;
      assert.deepEqual(effectiveRest, baseRest, 'Fasteners fields other than detail changed');
      assert.equal(effectiveDetail, KNOWN.targetDetail, 'effective Fasteners detail changed');
      assert.notEqual(baseDetail, effectiveDetail, 'Fasteners override was not applied');
    } else {
      assert.deepEqual(effectiveRow, baseRow, `non-Fasteners PC-01 row changed at ${index}`);
    }
  }

  for (const slug of manifest.pc01Override.protectedSiblingEntries) {
    assert.deepEqual(
      getEffective(slug, generated, registry),
      generated.products[slug],
      `${slug} effective entry changed`
    );
  }
  return effective;
}

function renderSpecificationsHtml(root) {
  const typescript = require('typescript');
  const sourcePath = path.join(root, 'src/lib/specsShippingTabs.ts');
  const source = readFileSync(sourcePath, 'utf8');
  const compiled = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: sourcePath,
  }).outputText;
  const loaded = { exports: {} };
  const localRequire = (specifier) =>
    specifier.startsWith('@/')
      ? require(path.join(root, 'src', specifier.slice(2)))
      : require(specifier);
  const execute = new Function('require', 'module', 'exports', '__filename', '__dirname', compiled);
  execute(localRequire, loaded, loaded.exports, sourcePath, path.dirname(sourcePath));
  return loaded.exports.getProductTabsHtml(KNOWN.targetSlug)?.specificationsHtml;
}

export function validateRenderedPc01Table(root = ROOT) {
  const html = renderSpecificationsHtml(root);
  assert.equal(typeof html, 'string', 'PC-01 Specifications HTML was not produced');
  const bodies = [...html.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].map((match) => match[1]);
  const renderedRows = bodies.reduce(
    (count, body) => count + (body.match(/<tr(?:\s|>)/g) || []).length,
    0
  );
  assert.equal(renderedRows, 30, 'PC-01 did not render exactly 30 specification rows');
  assert.ok(html.includes('Fasteners &amp; sealing'), 'rendered Fasteners label is missing');
  assert.ok(html.includes(KNOWN.targetDetail), 'rendered Fasteners detail is stale');
  return renderedRows;
}

export function verifyGitState(manifest, root) {
  const branch = run('git', ['branch', '--show-current'], { cwd: root });
  requireSuccessful(branch, 'branch check');

  const head = run('git', ['rev-parse', 'HEAD'], { cwd: root });
  requireSuccessful(head, 'HEAD check');

  const recoveredCommit = run(
    'git',
    ['cat-file', '-e', `${manifest.recoveredSource.commit}^{commit}`],
    { cwd: root }
  );
  requireSuccessful(recoveredCommit, 'recovered commit existence check');

  const tree = run('git', ['rev-parse', `${manifest.recoveredSource.commit}^{tree}`], { cwd: root });
  requireSuccessful(tree, 'recovered tree check');
  assert.equal(tree.stdout.trim(), manifest.recoveredSource.tree, 'recovered source tree changed');

  const qualificationCommit = run(
    'git',
    ['cat-file', '-e', `${manifest.qualificationCheckpoint.commit}^{commit}`],
    { cwd: root }
  );
  requireSuccessful(qualificationCommit, 'qualification commit existence check');

  const qualificationTree = run(
    'git',
    ['rev-parse', `${manifest.qualificationCheckpoint.commit}^{tree}`],
    { cwd: root }
  );
  requireSuccessful(qualificationTree, 'qualification tree check');
  assert.equal(
    qualificationTree.stdout.trim(),
    manifest.qualificationCheckpoint.tree,
    'qualification checkpoint tree changed'
  );

  const qualificationSubject = run(
    'git',
    ['show', '-s', '--format=%s', manifest.qualificationCheckpoint.commit],
    { cwd: root }
  );
  requireSuccessful(qualificationSubject, 'qualification subject check');
  assert.equal(
    qualificationSubject.stdout.trim(),
    manifest.qualificationCheckpoint.subject,
    'qualification checkpoint subject changed'
  );

  const qualificationAncestor = run(
    'git',
    ['merge-base', '--is-ancestor', manifest.qualificationCheckpoint.commit, 'HEAD'],
    { cwd: root }
  );
  requireSuccessful(
    qualificationAncestor,
    'qualification checkpoint is not an ancestor of current HEAD'
  );

  const recoveredAncestor = run(
    'git',
    ['merge-base', '--is-ancestor', manifest.recoveredSource.commit, 'HEAD'],
    { cwd: root }
  );
  requireSuccessful(recoveredAncestor, 'recovered source ancestry check');

  const production = run('git', ['rev-parse', manifest.recoveredSource.productionRef], { cwd: root });
  requireSuccessful(production, 'production ref check');
  assert.equal(production.stdout.trim(), manifest.recoveredSource.productionCommit, 'production ref changed');

  const branchName = branch.stdout.trim();
  return {
    head: head.stdout.trim(),
    branch: branchName || null,
    detached: branchName.length === 0,
  };
}

export const VALIDATION_SOURCE_PATHS = Object.freeze([
  'page-structure/contracts/pc01-c01-qualified-legacy-debt-2026-08-29.json',
  'scripts/validate-pc01-qualified-c01-debt.mjs',
  'scripts/validate-c01-copy-gates.py',
  'scripts/validate-c01-specification-overrides.mjs',
  'page-structure/content-drafts/COPY-PACK-C01-porta-cabins-9pages-APPROVED-26Jul2026.md',
  'src/data/products/c01-specifications.json',
  'src/data/products/c01-specification-overrides.json',
  'src/lib/c01SpecificationOverrides.js',
  'src/lib/specsShippingTabs.ts',
]);

export function collectValidationSourceHashes(root = ROOT) {
  return Object.fromEntries(
    VALIDATION_SOURCE_PATHS.map((relativePath) => [
      relativePath,
      sha256(readFileSync(path.join(root, relativePath))),
    ])
  );
}

export function assertValidationSourcesUnchanged(before, after) {
  assert.deepEqual(after, before, 'validation modified source bytes');
  return true;
}

export function validateQualification(root = ROOT) {
  const manifest = readJson(path.join(root, path.relative(ROOT, MANIFEST_PATH)));
  validateManifest(manifest);
  const checkout = verifyGitState(manifest, root);
  const sourceHashesBefore = collectValidationSourceHashes(root);
  validatePinnedHashes(manifest, collectArtifactHashes(root, manifest));

  const legacy = runLegacyValidator(manifest, root);
  const signatures = qualifyLegacyResult(legacy, manifest, root);

  const generated = readJson(path.join(root, manifest.pinnedArtifacts.generatedC01.path));
  assert.equal(
    countDistinctHardCommonValues(generated, KNOWN.legacyRow),
    manifest.expectedLegacyFailure.actualDistinctValueCount,
    'known Electrical protection distinct-value count changed'
  );

  const overrideResult = run('node', ['scripts/validate-c01-specification-overrides.mjs'], { cwd: root });
  requireSuccessful(overrideResult, 'dedicated specification-override validator');
  assert.ok(overrideResult.stdout.includes('C01 specification override validation: PASS'));

  const registry = readJson(path.join(root, 'src/data/products/c01-specification-overrides.json'));
  const helper = require(path.join(root, 'src/lib/c01SpecificationOverrides.js'));
  validateEffectiveState(
    manifest,
    generated,
    registry,
    helper.getEffectiveC01SpecificationEntry
  );
  const renderedRows = validateRenderedPc01Table(root);
  validatePinnedHashes(manifest, collectArtifactHashes(root, manifest));
  assertValidationSourcesUnchanged(sourceHashesBefore, collectValidationSourceHashes(root));

  return { manifest, signatures, renderedRows, checkout };
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  try {
    const result = validateQualification();
    console.log('PC-01 qualified C01 legacy debt validation: PASS');
    console.log(`Recovered source: ${result.manifest.recoveredSource.commit}`);
    console.log(`Qualification checkpoint: ${result.manifest.qualificationCheckpoint.commit}`);
    console.log(`Qualification tree: ${result.manifest.qualificationCheckpoint.tree}`);
    console.log(
      `Current checkout: ${result.checkout.detached ? 'detached HEAD' : result.checkout.branch} @ ${result.checkout.head}`
    );
    console.log(`Generated C01 SHA-256: ${KNOWN.generatedSha256}`);
    console.log(`Legacy result: exit ${KNOWN.legacyExitCode}, AssertionError: ${KNOWN.legacyRow}`);
    console.log(`Legacy stdout SHA-256: ${result.signatures.stdoutSha256}`);
    console.log(`Legacy stderr SHA-256: ${result.signatures.stderrSha256}`);
    console.log(`Effective PC-01 rows rendered: ${result.renderedRows}/30`);
    console.log('Protected sibling entries unchanged: 5/5');
    console.log('Debt status: QUALIFIED_UNRESOLVED');
  } catch (error) {
    console.error(`PC-01 qualified C01 legacy debt validation: FAIL\n${error.stack || error}`);
    process.exitCode = 1;
  }
}
