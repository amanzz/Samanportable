import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const scripts = [
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
