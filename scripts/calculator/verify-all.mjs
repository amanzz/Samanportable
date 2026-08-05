import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const scripts = [
  // Runs first: a white screen scores perfectly on every other gate.
  'verify-render-health.mjs',
  // Spec §7. Ranks above every other gate: sixteen of them passed on a
  // calculator where nothing priced, because not one of them clicked anything.
  'verify-functional.mjs',
  'verify-functional-fixture.mjs',
  'verify-route-price-identity.mjs',
  'report-locked-product-names.mjs',
  'verify-copy-pack.mjs',
  'verify-workbook-trace.mjs',
  'verify-hold-list.mjs',
  'verify-colour-modes.mjs',
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

for (const script of scripts) {
  console.log(`\n===== ${script} =====`);
  const result = spawnSync(process.execPath, [path.join(directory, script)], { stdio: 'inherit' });
  if (result.status !== 0) failed = true;
}

if (failed) {
  console.error('\nCALCULATOR VERIFICATION: FAIL');
  process.exitCode = 1;
} else {
  console.log('\nCALCULATOR VERIFICATION: PASS');
}
