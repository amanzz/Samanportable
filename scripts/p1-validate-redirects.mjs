// P1 Phase 2: validate the REAL redirects() array Next.js will use, the same
// way Next.js resolves it, not a text-file eyeball.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('../next.config.js');

const rules = await config.redirects();
console.log('total redirect rules:', rules.length);

const errors = [];

// --- duplicate sources ---
const bySource = new Map();
for (const r of rules) {
  if (!bySource.has(r.source)) bySource.set(r.source, []);
  bySource.get(r.source).push(r);
}
const dupes = [...bySource.entries()].filter(([, list]) => list.length > 1);
console.log('\nduplicate sources:', dupes.length);
for (const [src, list] of dupes) {
  errors.push(`DUPLICATE SOURCE: ${src} -> ${list.map((r) => r.destination).join(' | ')}`);
}

// --- non-301 rules ---
const non301 = rules.filter((r) => r.statusCode && r.statusCode !== 301 && r.permanent !== true);
console.log('non-301/non-permanent rules:', non301.length);
for (const r of non301) errors.push(`NOT PERMANENT: ${r.source} (statusCode=${r.statusCode})`);

// --- chains: any destination path (path-only) that is ALSO a source ---
const sourceSet = new Set(rules.map((r) => r.source));
const chains = [];
for (const r of rules) {
  let destPath;
  try {
    destPath = new URL(r.destination).pathname.replace(/\/$/, '') || '/';
  } catch {
    destPath = r.destination.replace(/\/$/, '') || '/';
  }
  const srcNorm = r.source.replace(/\/$/, '') || '/';
  if (sourceSet.has(destPath) && destPath !== srcNorm) {
    chains.push({ source: r.source, mid: destPath, finalDest: bySource.get(destPath)?.[0]?.destination });
  }
}
console.log('\nchains (destination is itself a source):', chains.length);
for (const c of chains) {
  errors.push(`CHAIN: ${c.source} -> ${c.mid} -> ${c.finalDest}`);
}

// --- loops: source === destination path ---
const loops = rules.filter((r) => {
  let destPath;
  try { destPath = new URL(r.destination).pathname; } catch { destPath = r.destination; }
  return destPath.replace(/\/$/, '') === r.source.replace(/\/$/, '');
});
console.log('loops (source === destination):', loops.length);
for (const l of loops) errors.push(`LOOP: ${l.source} -> ${l.destination}`);

// --- calculator / rental-sale-cluster sources ---
const FORBIDDEN_SOURCES = [
  '/cabin-cost-calculator',
  '/portable-cabin-price-calculator',
  '/container-rent-services/40x10-porta-cabin-rental',
  '/container-rent-services/30x10-porta-cabin-rental',
  '/container-rent-services/20x10-porta-cabin-rental',
  '/container-rent-services/10x10-porta-cabin-rental',
];
const forbiddenHits = rules.filter((r) => FORBIDDEN_SOURCES.includes(r.source));
console.log('\ncalculator/rental-cluster sources present as redirect sources:', forbiddenHits.length);
for (const f of forbiddenHits) errors.push(`FORBIDDEN SOURCE REDIRECTED: ${f.source} -> ${f.destination}`);

// also check none of these appear as a DESTINATION target from a porta-cabin source (shouldn't matter but cheap to check)
const forbiddenAsDest = rules.filter((r) => FORBIDDEN_SOURCES.some((f) => r.destination.endsWith(f)));
console.log('calculator/rental-cluster URLs used as a destination:', forbiddenAsDest.length);

console.log('\n=== SUMMARY ===');
console.log(errors.length === 0 ? 'ALL CHECKS PASS' : `${errors.length} ISSUES FOUND:`);
for (const e of errors) console.log('  ' + e);
