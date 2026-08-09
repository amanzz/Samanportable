import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertBuildIdentity } from './assert-build-identity.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));

// Before anything runs: the server on the port must BE the build on disk.
//
// A stale `next start` once held the port while the new one died with
// EADDRINUSE. curl answered 200, so browser gates ran green against the old
// server for several checks. A 200 proves something is listening; it proves
// nothing about what. Skipped only when no preview URL is configured, and it
// says so rather than passing silently.
const identity = await assertBuildIdentity();
if (identity.ok) {
  console.log(`build identity: ok — serving ${identity.served}`);
} else {
  console.error(`BUILD IDENTITY: FAIL — ${identity.reason}`);
  if (identity.onDisk) console.error(`  on disk: ${identity.onDisk}`);
  if (identity.served) console.error(`  served : ${identity.served}`);
  console.error('  Browser gates would be measuring the wrong build. Fix the preview before trusting anything below.');
  process.exitCode = 1;
}

const scripts = [
  // Runs first: a white screen scores perfectly on every other gate.
  'verify-render-health.mjs',
  // Spec §7. Ranks above every other gate: sixteen of them passed on a
  // calculator where nothing priced, because not one of them clicked anything.
  'verify-functional.mjs',
  // --check: read only. The writing mode rewrites a tracked source file and
  // restores it from a snapshot taken at its own start, so run beside an edit
  // it can revert a finished fix — it did, three times in one session. Run
  // `verify-functional-fixture.mjs --write` deliberately and alone instead.
  ['verify-functional-fixture.mjs', '--check'],
  // SAMAN's base-cabin rate card (ruling 06 Aug 2026). Gates the calculator's
  // OPENING figure. Runs before the published-price gate because that gate now
  // only proves the finished ladder did not move.
  'verify-base-cabin-rate-card.mjs',
  // Every estimate surface repaints, and the server prices the quantities a
  // buyer selected. Both were silent failures: one showed a stale itemisation
  // beside a live total, the other under-quoted by discarding every electrical
  // and fit-out item before the estimate saw it.
  'verify-estimate-surfaces.mjs',
  'verify-route-price-identity.mjs',
  'report-locked-product-names.mjs',
  'verify-copy-pack.mjs',
  'verify-workbook-trace.mjs',
  'verify-hold-list.mjs',
  'verify-colour-modes.mjs',
  // Brand green on controls. Computed styles in five states, and proven
  // against six deliberately green builds — the stylesheet-reading version
  // this replaces missed a live violation twice.
  'verify-green-demotion.mjs',
  'verify-green-demotion-fixture.mjs',
  'verify-gates-catch-violations.mjs',
  'verify-no-bare-fetch.mjs',
  'verify-no-emoji.mjs',
  'verify-nojs-post.mjs',
  'verify-rate-card-diff.mjs',
  'report-product-ladders.mjs',
  'verify-hub-anchors.mjs',
  'verify-ux-static.mjs',
  // Browser gates. Both need PLAYWRIGHT_ROOT and a running preview.
  'verify-route-parity.mjs',
  'verify-drawing.mjs',
  'verify-step-density.mjs',
];
let failed = false;

for (const entry of scripts) {
  const [script, ...args] = Array.isArray(entry) ? entry : [entry];
  console.log(`\n===== ${script}${args.length ? ' ' + args.join(' ') : ''} =====`);
  const result = spawnSync(process.execPath, [path.join(directory, script), ...args], { stdio: 'inherit' });
  if (result.status !== 0) failed = true;
}

if (failed) {
  console.error('\nCALCULATOR VERIFICATION: FAIL');
  process.exitCode = 1;
} else {
  console.log('\nCALCULATOR VERIFICATION: PASS');
}
