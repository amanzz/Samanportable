#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MANIFEST_RELATIVE =
  'page-structure/contracts/pc01-performance-measurement-debt-2026-08-31.json';
export const MANIFEST_PATH = path.join(ROOT, MANIFEST_RELATIVE);

export const KNOWN = Object.freeze({
  schemaVersion: 1,
  decisionId: 'PC01-PERFORMANCE-QUALIFICATION-2026-08-31',
  decision: 'PC01_PERFORMANCE_IMPROVED_WITH_QUALIFIED_MEASUREMENT_DEBT',
  authority: 'PC01-REL-06B_DIRECT_OWNER_INSTRUCTION',
  status: 'QUALIFIED_UNRESOLVED',
  production: '3346a532306c52932aeb2d813591bf95cb37716b',
  controlA: '4dc9b4e639169b66140416d2237cb71c24fce66e',
  controlATree: '898ec91b66acdee7ba379d39499a1d830c53732b',
  candidateB: 'c04737f28895ef5296d1ab63e8fd98762fad4557',
  candidateBTree: '0207136814c1e0cf3b766c2792e19670a1a550da',
  safeApp: '71fd5b5cd857fe710f19ec29355a34bd116b38ab',
  safeAppTree: '3b1d2b0d9f2b1db4488071dfa7991b9367dba198',
  portability: 'cb4b8ad1c7220c3ade42851a681ee0439e0ab984',
  portabilityTree: '12db4887563547aee7d80fc034c190b125939498',
  remoteResults: '636e56f7d0fe9036f777f4a5373b85d9b9e2838f',
  rawC01: '3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099',
  pdf: '9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96',
});

export const EXPECTED_APP_FILES = Object.freeze([
  'src/components/DeferredCabinCalculator.tsx',
  'src/components/LegacyEmbeddedCalculator.tsx',
  'src/pages/product/[category]/index.tsx',
]);

export const FORBIDDEN_REMOTE_PATHS = Object.freeze([
  '.github/workflows/pc01-remote-performance-lab.yml',
  'performance-lab/pc01-remote/',
]);

const EXPECTED_PROHIBITED = Object.freeze([
  'Synthetic LCP passed.',
  'Synthetic TBT passed.',
  'Production INP passed.',
  'Core Web Vitals passed.',
]);

const OWNER_REPORT = 'seo-remediation/reports/PC01-REL-06B-OWNER-PERFORMANCE-DECISION.md';

const run = (root, args) =>
  spawnSync('git', args, { cwd: root, encoding: 'utf8', windowsHide: true });
const output = (result) => `${result.stdout || ''}${result.stderr || ''}`.trim();
const ok = (result, label) => {
  assert.equal(result.error, undefined, `${label} could not start: ${result.error?.message}`);
  assert.equal(result.status, 0, `${label} failed: ${output(result)}`);
  return result.stdout.trim();
};
const normalize = (buffer) => Buffer.from(buffer.toString('utf8').replace(/\r\n/g, '\n'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const normalizedFileSha = (file) => sha256(normalize(readFileSync(file)));
const rawFileSha = (file) => sha256(readFileSync(file));
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const reduction = (before, after) => Number((((before - after) / before) * 100).toFixed(1));

export function validateManifest(manifest) {
  assert.equal(manifest.schemaVersion, KNOWN.schemaVersion, 'manifest schema changed');
  assert.equal(manifest.decisionId, KNOWN.decisionId, 'decision ID changed');
  assert.equal(manifest.decision, KNOWN.decision, 'owner decision changed');
  assert.equal(manifest.ownerAuthority, KNOWN.authority, 'owner authority changed');
  assert.equal(manifest.measurementStatus, KNOWN.status, 'measurement debt cannot be resolved without evidence');
  assert.equal(manifest.historicalProvenance?.branchSemantics, 'HISTORICAL_PROVENANCE_ONLY');
  assert.match(manifest.branchAuthorityStatement || '', /branch names.*detached-HEAD state are evidence only/i);
  assert.equal(manifest.productionComparison?.ref, 'origin/static-migration', 'production ref changed');
  assert.equal(manifest.productionComparison?.commit, KNOWN.production, 'production commit changed');

  const pins = [
    ['controlA', KNOWN.controlA, KNOWN.controlATree],
    ['candidateB', KNOWN.candidateB, KNOWN.candidateBTree],
    ['safePhaseAApplication', KNOWN.safeApp, KNOWN.safeAppTree],
    ['portabilitySource', KNOWN.portability, KNOWN.portabilityTree],
  ];
  for (const [name, commit, tree] of pins) {
    assert.equal(manifest.checkpoints?.[name]?.commit, commit, `${name} commit changed`);
    assert.equal(manifest.checkpoints?.[name]?.tree, tree, `${name} tree changed`);
  }
  assert.equal(manifest.checkpoints?.ancestryPolicy, 'REQUIRED_ANCESTOR_OF_CURRENT_HEAD');
  assert.deepEqual(manifest.phaseAApplication?.changedFileSet, EXPECTED_APP_FILES, 'Phase-A app file set changed');
  assert.deepEqual(
    manifest.phaseAApplication?.files?.map(({ path: file }) => file),
    EXPECTED_APP_FILES,
    'Phase-A app hash file set changed'
  );
  assert.equal(manifest.phaseAApplication?.hashNormalization, 'CRLF_TO_LF');

  const d = manifest.deterministicEvidence;
  assert.deepEqual(d?.dom, { baseline: 3811, candidate: 1745, reductionPercent: 54.2, minimumReductionPercent: 45 });
  assert.deepEqual(d?.scriptTransferBytes, { baseline: 650063, candidate: 355906, reductionPercent: 45.3, minimumReductionPercent: 40 });
  assert.deepEqual(d?.categoryFirstLoadJavaScriptKb, { baseline: 581, candidate: 308, reductionPercent: 47, minimumReductionPercent: 40 });
  assert.equal(manifest.remoteMeasurement?.actionsRunId, 33375322649);
  assert.equal(manifest.remoteMeasurement?.runConclusion, 'cancelled');
  assert.equal(manifest.remoteMeasurement?.resultsCommit, KNOWN.remoteResults);
  assert.equal(manifest.remoteMeasurement?.artifactId, 9755113831);
  assert.equal(manifest.remoteMeasurement?.artifactDigest, null);
  assert.equal(manifest.remoteMeasurement?.validAuthoritativeRuns, 0);
  assert.deepEqual(manifest.prohibitedClaims, EXPECTED_PROHIBITED);
  assert.deepEqual(manifest.resolutionEvidence, {
    status: 'NOT_AVAILABLE', fieldDataDays: 0, stableSyntheticLab: false,
  });
  assert.match(manifest.sunsetCondition || '', /28 days.*field data.*stable synthetic laboratory/i);
  assert.deepEqual(manifest.requiredPostReleaseEvidence, [
    'field LCP', 'field INP', 'field CLS', 'Search Console/CrUX where available',
    'production resource timing', 'production CDN/image delivery',
  ]);
  return true;
}

export function validateAppState(manifest, actualFiles, hashes) {
  assert.deepEqual(actualFiles, EXPECTED_APP_FILES, 'safe Phase-A app file set changed');
  for (const file of manifest.phaseAApplication.files) {
    assert.equal(hashes[file.path], file.sha256, `${file.path} normalized SHA-256 changed`);
  }
  return true;
}

export function validateDeterministicEvidence(manifest, baseline, candidate) {
  const scriptBytes = (summary) => {
    const values = summary.mobile.runs.map((entry) =>
      entry.resourceSummary.find((resource) => resource.resourceType === 'script')?.transferSize
    );
    assert.ok(values.length > 0 && values.every((value) => value === values[0]), 'mobile script evidence is inconsistent');
    return values[0];
  };
  const actual = {
    dom: [baseline.mobile.medians.dom, candidate.mobile.medians.dom],
    scriptTransferBytes: [scriptBytes(baseline), scriptBytes(candidate)],
  };
  for (const name of Object.keys(actual)) {
    const pinned = manifest.deterministicEvidence[name];
    assert.deepEqual(actual[name], [pinned.baseline, pinned.candidate], `${name} evidence changed`);
    assert.equal(reduction(...actual[name]), pinned.reductionPercent, `${name} reduction changed`);
    assert.ok(pinned.reductionPercent >= pinned.minimumReductionPercent, `${name} minimum reduction not met`);
  }
  const category = manifest.deterministicEvidence.categoryFirstLoadJavaScriptKb;
  assert.equal(reduction(category.baseline, category.candidate), category.reductionPercent);
  assert.ok(category.reductionPercent >= category.minimumReductionPercent);
  return actual;
}

function decodeHtml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
}

export function validateServerHtml(html, manifest) {
  const evidence = manifest.serverRenderedEvidence;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  assert.equal(decodeHtml(title || ''), evidence.title, 'server title changed');
  assert.ok(html.includes(`rel="canonical" href="${evidence.canonical}"`), 'server canonical changed');
  assert.ok(html.includes('name="robots" content="index, follow"'), 'server robots changed');
  assert.equal((html.match(/<h1(?:\s|>)/gi) || []).length, 1, 'server H1 count changed');
  const h1 = html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, '');
  assert.equal(decodeHtml(h1 || ''), evidence.h1, 'server H1 changed');
  assert.ok(html.includes(evidence.pdfPath), 'active PDF link missing from server HTML');
  for (const child of evidence.approvedChildPaths) assert.ok(html.includes(child), `approved child link missing: ${child}`);
  assert.ok(html.includes(evidence.primaryEnquiryCta), 'primary enquiry CTA missing');
  for (const schema of evidence.schemaTypes) assert.ok(html.includes(`"@type":"${schema}"`), `${schema} schema missing`);
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(nextDataMatch, 'server-rendered Next data missing');
  const pageProps = JSON.parse(nextDataMatch[1]).props?.pageProps;
  assert.deepEqual(
    pageProps?.variantData?.variants?.map((variant) => variant.priceExGst),
    evidence.priceExGst,
    'server-rendered prices changed'
  );
  const questions = pageProps?.variantData?.faqSchema?.mainEntity;
  assert.equal(questions?.length, evidence.faqCount, 'server-rendered FAQ content changed');
  assert.ok(questions.every((entry) => entry.name && entry.acceptedAnswer?.text), 'server-rendered FAQ answer missing');
  const specificationsHtml = pageProps?.product?.specificationsHtml || '';
  const specificationBodies = [...specificationsHtml.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)];
  assert.equal(
    specificationBodies.reduce((count, match) => count + (match[1].match(/<tr(?:\s|>)/g) || []).length, 0),
    evidence.specificationCount,
    'server-rendered specification content changed'
  );
  return true;
}

export function validateBusinessData(manifest, root) {
  for (const artifact of manifest.businessData.files) {
    assert.equal(normalizedFileSha(path.join(root, artifact.path)), artifact.sha256, `${artifact.path} normalized SHA-256 changed`);
  }
  const product = readJson(path.join(root, 'src/data/products/porta-cabins.json'));
  assert.deepEqual(product.variants.map((variant) => variant.priceExGst), manifest.serverRenderedEvidence.priceExGst, 'price ladder changed');
  assert.equal(product.faqSchema.mainEntity.length, manifest.serverRenderedEvidence.faqCount, 'FAQ count changed');
  const c01Path = path.join(root, 'src/data/products/c01-specifications.json');
  assert.equal(rawFileSha(c01Path), manifest.businessData.generatedC01RawSha256, 'generated C01 raw SHA-256 changed');
  const c01 = readJson(c01Path);
  assert.equal(c01.products['porta-cabins'].specifications.length, manifest.serverRenderedEvidence.specificationCount, 'PC-01 specification count changed');
  assert.equal(rawFileSha(path.join(root, manifest.businessData.activePdfPath)), manifest.businessData.activePdfSha256, 'active PDF SHA-256 changed');
  return true;
}

export function validateClaims(manifest, reportText) {
  assert.ok(reportText.includes(`Decision: \`${KNOWN.decision}\``), 'owner decision report changed');
  assert.ok(reportText.includes('Synthetic LCP, TBT, INP, and Core Web Vitals status is `NOT PROVEN`.'), 'NOT PROVEN qualification missing');
  assert.ok(reportText.includes('Measurement status is `QUALIFIED_UNRESOLVED`.'), 'unresolved measurement status missing');
  const lines = reportText.split(/\r?\n/).map((line) => line.trim());
  for (const claim of manifest.prohibitedClaims) {
    assert.ok(
      !lines.some((line) => line === claim || line === `PASS CLAIM: ${claim}`),
      `prohibited claim inserted: ${claim}`
    );
  }
  return true;
}

export function verifyGitState(manifest, root) {
  const branch = ok(run(root, ['branch', '--show-current']), 'branch check');
  const head = ok(run(root, ['rev-parse', 'HEAD']), 'HEAD check');
  assert.equal(ok(run(root, ['rev-parse', manifest.productionComparison.ref]), 'production ref check'), KNOWN.production, 'production ref changed');
  for (const checkpoint of Object.values(manifest.checkpoints).filter((value) => typeof value === 'object')) {
    ok(run(root, ['cat-file', '-e', `${checkpoint.commit}^{commit}`]), `${checkpoint.commit} existence check`);
    assert.equal(ok(run(root, ['rev-parse', `${checkpoint.commit}^{tree}`]), 'tree check'), checkpoint.tree, `${checkpoint.commit} tree changed`);
  }
  for (const name of ['candidateB', 'safePhaseAApplication', 'portabilitySource']) {
    ok(run(root, ['merge-base', '--is-ancestor', manifest.checkpoints[name].commit, 'HEAD']), `${name} checkpoint is not an ancestor of current HEAD`);
  }
  const remoteAncestor = run(root, ['merge-base', '--is-ancestor', KNOWN.remoteResults, 'HEAD']);
  assert.notEqual(remoteAncestor.status, 0, 'unapproved remote-results commit entered current ancestry');
  for (const forbidden of FORBIDDEN_REMOTE_PATHS) {
    const tracked = run(root, ['ls-files', '--error-unmatch', forbidden]);
    assert.notEqual(tracked.status, 0, `unapproved remote harness path is tracked: ${forbidden}`);
  }
  return { head, branch: branch || null, detached: !branch };
}

export const VALIDATION_SOURCE_PATHS = Object.freeze([
  MANIFEST_RELATIVE,
  OWNER_REPORT,
  'scripts/validate-pc01-performance-measurement-debt.mjs',
  ...EXPECTED_APP_FILES,
  'seo-remediation/reports/evidence/PC01-REL-05/baseline/summary.json',
  'seo-remediation/reports/evidence/PC01-REL-05/phase-a/summary.json',
  'seo-remediation/reports/evidence/PC01-REL-05/phase-a/server-html.html',
  'src/data/products/porta-cabins.json',
  'src/data/products/c01-specifications.json',
  'src/data/products/c01-specification-overrides.json',
  'public/specs/saman-porta-cabins-technical-specification.pdf',
]);

export function collectValidationSourceHashes(root = ROOT) {
  return Object.fromEntries(VALIDATION_SOURCE_PATHS.map((relative) => [relative, rawFileSha(path.join(root, relative))]));
}

export function assertValidationSourcesUnchanged(before, after) {
  assert.deepEqual(after, before, 'validation modified source bytes');
  return true;
}

export function validateQualification(root = ROOT) {
  const manifest = readJson(path.join(root, MANIFEST_RELATIVE));
  validateManifest(manifest);
  const checkout = verifyGitState(manifest, root);
  const before = collectValidationSourceHashes(root);
  const actualFiles = ok(run(root, ['diff-tree', '--no-commit-id', '--name-only', '-r', KNOWN.safeApp]), 'safe app file-set check')
    .split(/\r?\n/).filter((file) => file.startsWith('src/')).sort();
  const hashes = Object.fromEntries(EXPECTED_APP_FILES.map((file) => [file, normalizedFileSha(path.join(root, file))]));
  validateAppState(manifest, actualFiles, hashes);
  const baselinePath = path.join(root, manifest.deterministicEvidence.baselineSummary.path);
  const candidatePath = path.join(root, manifest.deterministicEvidence.candidateSummary.path);
  assert.equal(normalizedFileSha(baselinePath), manifest.deterministicEvidence.baselineSummary.normalizedSha256, 'baseline summary SHA-256 changed');
  assert.equal(normalizedFileSha(candidatePath), manifest.deterministicEvidence.candidateSummary.normalizedSha256, 'candidate summary SHA-256 changed');
  const deterministic = validateDeterministicEvidence(manifest, readJson(baselinePath), readJson(candidatePath));
  const serverPath = path.join(root, manifest.serverRenderedEvidence.path);
  assert.equal(normalizedFileSha(serverPath), manifest.serverRenderedEvidence.normalizedSha256, 'server HTML SHA-256 changed');
  validateServerHtml(readFileSync(serverPath, 'utf8'), manifest);
  validateBusinessData(manifest, root);
  validateClaims(manifest, readFileSync(path.join(root, OWNER_REPORT), 'utf8'));
  assertValidationSourcesUnchanged(before, collectValidationSourceHashes(root));
  return { manifest, checkout, deterministic };
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  try {
    const result = validateQualification();
    console.log('PC-01 performance measurement debt validation: PASS');
    console.log(`Decision: ${result.manifest.decision}`);
    console.log(`Checkout: ${result.checkout.detached ? 'detached HEAD' : result.checkout.branch} @ ${result.checkout.head}`);
    console.log('Deterministic reductions: DOM 54.2%; script transfer 45.3%; category first-load JavaScript 47.0%');
    console.log('Release-authoritative synthetic runs: 0');
    console.log('Measurement status: QUALIFIED_UNRESOLVED');
  } catch (error) {
    console.error(`PC-01 performance measurement debt validation: FAIL\n${error.stack || error}`);
    process.exitCode = 1;
  }
}
