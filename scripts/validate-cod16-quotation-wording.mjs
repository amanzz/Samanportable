#!/usr/bin/env node
/**
 * CO-D16 quotation-wording gate (04 Sep 2026).
 *
 * CO-D16 retired the unqualified 48-hour guarantee ("fixed-price quote in/within
 * 48 hours") in favour of the qualified target wording. The first pass of this
 * check was an ad-hoc CASE-SENSITIVE grep and it reported a false PASS: every
 * surviving instance in the tree was lower-case, so none of them matched. This
 * gate exists so that failure mode cannot recur — matching is case-insensitive
 * and tolerant of hyphen and whitespace variants.
 *
 * Scope is exactly the phrase family the owner ruling names: "fixed-price quote
 * in/within 48 hours". The adjacent "...quotation within 48 hours" strings are
 * a different, still-approved construction; they are reported for visibility but
 * do not fail the gate.
 *
 * Usage:
 *   node scripts/validate-cod16-quotation-wording.mjs
 *   node scripts/validate-cod16-quotation-wording.mjs --base-url http://127.0.0.1:3211
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const baseUrl = (args.includes('--base-url') ? args[args.indexOf('--base-url') + 1] : '').replace(/\/$/, '');

/** The retired guarantee. Case-insensitive; tolerates hyphen/space and "business". */
const LEGACY = /fixed[-\s]?price\s+quote\s+(?:in|within)\s+48\s*(?:business\s+)?hours?/gi;
/** Reported only — a different construction that CO-D16 did not retire. */
const ADJACENT = /fixed[^.]{0,24}quotation\s+(?:in|within)\s+48\s*(?:business\s+)?hours?/gi;

const APPROVED = 'Custom quote target: 48 business hours';

const SCAN_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html']);
const SKIP_DIR = new Set(['node_modules', '.next', '.git', 'out', 'dist', 'coverage']);

function walk(dir, hits) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIR.has(entry.name)) walk(path.join(dir, entry.name), hits);
      continue;
    }
    if (!SCAN_EXT.has(path.extname(entry.name))) continue;
    const file = path.join(dir, entry.name);
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(LEGACY)) {
      hits.legacy.push({ file: path.relative(root, file), match: m[0], line: text.slice(0, m.index).split('\n').length });
    }
    for (const m of text.matchAll(ADJACENT)) {
      hits.adjacent.push({ file: path.relative(root, file), match: m[0] });
    }
  }
}

const hits = { legacy: [], adjacent: [] };
walk(path.join(root, 'src'), hits);
const packPath = path.join(root, 'page-structure/content-drafts/CALCULATOR-COPY-PACK-03Aug2026.md');
if (fs.existsSync(packPath)) {
  const text = fs.readFileSync(packPath, 'utf8');
  for (const m of text.matchAll(LEGACY)) {
    hits.legacy.push({ file: path.relative(root, packPath), match: m[0], line: text.slice(0, m.index).split('\n').length });
  }
}

const failures = [];
if (hits.legacy.length) {
  failures.push(`retired CO-D16 guarantee wording found in ${hits.legacy.length} place(s):`);
  for (const h of hits.legacy.slice(0, 25)) failures.push(`  - ${h.file}:${h.line} :: "${h.match}"`);
}

const copySource = fs.readFileSync(path.join(root, 'src/lib/calculatorCopy.ts'), 'utf8');
if (!copySource.includes(APPROVED)) failures.push(`approved wording "${APPROVED}" absent from src/lib/calculatorCopy.ts`);

if (baseUrl) {
  const routes = [
    '/product/container-offices',
    ...['shipping-container-office', 'site-office-container', 'bess-container', 'containerized-data-center',
        'container-marketing-office', 'multi-story-container-office', 'flat-pack-container-office',
        'expandable-container-office', 'container-office-cabin'].map((s) => `/product/container-offices/${s}`),
    '/product/porta-cabins/gi-porta-cabin',
    '/product/container-houses/luxury-container-houses',
    '/product/container-houses/prefabricated-container-house',
    '/product/portable-office',
  ];
  for (const route of routes) {
    let res;
    try {
      res = await fetch(baseUrl + route, { redirect: 'follow' });
    } catch (error) {
      failures.push(`${route}: fetch failed (${error.message})`);
      continue;
    }
    if (!res.ok) { failures.push(`${route}: HTTP ${res.status}`); continue; }
    const html = await res.text();
    const found = [...html.matchAll(LEGACY)].map((m) => m[0]);
    if (found.length) failures.push(`${route}: rendered HTML still carries ${found.length} retired string(s): ${[...new Set(found)].join(', ')}`);
  }
  console.log(`  checked rendered HTML for ${routes.length} routes at ${baseUrl}`);
}

if (hits.adjacent.length) {
  const uniq = [...new Set(hits.adjacent.map((h) => h.match.toLowerCase()))];
  console.log(`  note: ${hits.adjacent.length} "…quotation within 48 hours" string(s) present (not retired by CO-D16): ${uniq.slice(0, 4).join(' | ')}`);
}

if (failures.length) {
  console.error('CO-D16 quotation-wording validation: FAIL');
  for (const line of failures) console.error(line.startsWith('  ') ? line : `- ${line}`);
  process.exit(1);
}

console.log('CO-D16 quotation-wording validation: PASS');
console.log(`  retired-guarantee matches (case-insensitive): 0`);
console.log(`  approved wording present in calculatorCopy.ts: yes`);
