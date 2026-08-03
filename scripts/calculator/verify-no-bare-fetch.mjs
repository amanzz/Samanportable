/**
 * No API handler reaches an external host directly.
 *
 * Ruled 03 Aug 2026 after a test run sent a genuine lead to Zoho. Three
 * handlers were POSTing to forms.zohopublic.com with a bare `fetch`, so
 * stubbing @/lib/zohoCrm in a test did not stop the traffic. The boundary
 * looked complete and was not.
 *
 * All outbound calls to an external host now go through an integration
 * library, where a single stub stops all of them.
 *
 * Also reports the payload built for the shared Zoho public-form endpoint, so a
 * refactor can be proved to have moved nothing.
 *
 * Run: node scripts/calculator/verify-no-bare-fetch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import jitiPkg from 'jiti';
import { failIfDiffs, fromRoot } from './common.mjs';

const API_DIR = fromRoot('src', 'pages', 'api');
const EXTERNAL = /\b(?:fetch|axios\s*\.\s*(?:get|post|put|patch|delete))\s*\(\s*[`'"]https?:\/\//;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(?:ts|tsx|js|mjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const diffs = [];
console.log('BARE FETCH TO EXTERNAL HOSTS, src/pages/api/\n');

let scanned = 0;
for (const file of walk(API_DIR)) {
  scanned += 1;
  const rel = path.relative(fromRoot(), file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    if (EXTERNAL.test(line)) {
      const host = /https?:\/\/([^/'"`]+)/.exec(line)?.[1] ?? 'unknown host';
      console.log(`  ${rel}:${index + 1} -> ${host}`);
      diffs.push(`${rel}:${index + 1} issues a bare request to ${host}; route it through an integration library`);
    }
  });
}
console.log(`  files scanned: ${scanned}`);
if (!diffs.length) console.log('  none, ok');

// ---------------------------------------------------------------------------
// Payload shape, so the refactor can be proved to have moved nothing.
// ---------------------------------------------------------------------------
const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(SRC, request.slice(2));
  }
  return resolveFilename.call(this, request, ...rest);
};
const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const { buildPublicFormPayload } = jiti('./src/lib/zohoCrm.ts');

/** The seven fields, in order, that all three handlers built by hand before. */
const EXPECTED_FIELDS = [
  'Name_First', 'Name_Last', 'PhoneNumber_countrycode', 'Email',
  'Dropdown1', 'Dropdown', 'SingleLine',
];

const sample = buildPublicFormPayload({
  firstName: 'Test', lastName: 'Submitter', phone: '9876543210',
  email: 'nobody@example.invalid', category: 'MS Porta Cabin',
  region: 'Karnataka', context: 'context line',
});
const fields = [...sample.keys()];

console.log('\nZOHO PUBLIC-FORM PAYLOAD, built by @/lib/zohoCrm');
for (const [key, value] of sample.entries()) console.log(`  ${key.padEnd(26)} ${value}`);

if (fields.join(',') !== EXPECTED_FIELDS.join(',')) {
  diffs.push(`payload fields changed: ${fields.join(',')} vs expected ${EXPECTED_FIELDS.join(',')}`);
}

// Defaults must match what the handlers used to send for empty values.
const empty = buildPublicFormPayload({});
const EXPECTED_EMPTY = { Name_First: '-', Name_Last: '-', PhoneNumber_countrycode: '', Email: '', Dropdown1: '-Select-', Dropdown: '-Select-', SingleLine: '' };
console.log('\n  defaults for an empty lead:');
for (const [key, expected] of Object.entries(EXPECTED_EMPTY)) {
  const actual = empty.get(key);
  const ok = actual === expected;
  console.log(`    ${key.padEnd(26)} ${JSON.stringify(actual)}${ok ? '' : `  EXPECTED ${JSON.stringify(expected)}`}`);
  if (!ok) diffs.push(`default for ${key} changed: ${JSON.stringify(actual)} vs ${JSON.stringify(expected)}`);
}

console.log('');
failIfDiffs('bare-fetch', diffs);
