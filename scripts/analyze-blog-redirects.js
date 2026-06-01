/**
 * Analyze blog dedupe redirects before implementation
 */
const fs = require('fs');
const path = require('path');

// ─── Parse CSV ───────────────────────────────────────────────────────────────
const csvPath = path.join(__dirname, '..', 'SAMAN_Blog_Dedupe_Action_List.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const csvLines = csvContent.split('\n').slice(1); // skip header

const requestedRedirects = [];
for (const line of csvLines) {
  const cols = line.split(',');
  if (cols.length < 4) continue;
  const num = cols[0].trim();
  const sourceFull = cols[1].trim();
  const destFull = cols[2].trim();
  if (!sourceFull || !destFull) continue;
  const sourcePath = new URL(sourceFull).pathname;
  const destPath = new URL(destFull).pathname;
  requestedRedirects.push({ num, sourcePath, destPath, sourceFull, destFull });
}

// ─── Load existing redirects-from-csv.js ─────────────────────────────────────
const csvRedirectsPath = path.join(__dirname, '..', 'redirects-from-csv.js');
const csvRedirectsContent = fs.readFileSync(csvRedirectsPath, 'utf8');

// Parse redirects-from-csv.js using regex
const csvRedirectMap = new Map(); // sourcePath -> destPath
const csvRegex = /\{ source:\s*['"](.+?)['"],\s*destination:\s*['"](.+?)['"],\s*permanent:\s*(true|false)\s*\}/g;
let m;
while ((m = csvRegex.exec(csvRedirectsContent)) !== null) {
  let src = m[1];
  let dst = m[2];
  if (!src.startsWith('/')) src = '/' + src;
  if (!dst.startsWith('/')) dst = '/' + dst;
  csvRedirectMap.set(src, dst);
}

// ─── Load next.config.js hardcoded redirects ─────────────────────────────────
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

const nextConfigRedirectMap = new Map();
const nextRegex = /\{\s*source:\s*['"](.+?)['"],\s*destination:\s*['"](.+?)['"],\s*permanent:\s*(?:true|false)\s*,?\s*\}/gs;
while ((m = nextRegex.exec(nextConfigContent)) !== null) {
  let src = m[1];
  let dst = m[2];
  if (!src.startsWith('/')) src = '/' + src;
  if (!dst.startsWith('/')) dst = '/' + dst;
  nextConfigRedirectMap.set(src, dst);
}

// ─── Load middleware.ts redirects ────────────────────────────────────────────
const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

const middlewareRedirectMap = new Map();
const mwRegex = /['"](.+?)['"]:\s*['"](.+?)['"],?/g;
while ((m = mwRegex.exec(middlewareContent)) !== null) {
  let src = m[1];
  let dst = m[2];
  if (!src.startsWith('/')) src = '/' + src;
  if (!dst.startsWith('/')) dst = '/' + dst;
  // Only capture entries that look like redirects (not random strings)
  if (src.includes('/') && dst.includes('/')) {
    middlewareRedirectMap.set(src, dst);
  }
}

// ─── Combine all existing redirects ──────────────────────────────────────────
const allExistingRedirects = new Map();
for (const [src, dst] of csvRedirectMap) allExistingRedirects.set(src, { dest: dst, location: 'redirects-from-csv.js' });
for (const [src, dst] of nextConfigRedirectMap) {
  if (!allExistingRedirects.has(src)) {
    allExistingRedirects.set(src, { dest: dst, location: 'next.config.js (hardcoded)' });
  }
}
for (const [src, dst] of middlewareRedirectMap) {
  if (!allExistingRedirects.has(src)) {
    allExistingRedirects.set(src, { dest: dst, location: 'middleware.ts' });
  }
}

// ─── Analysis ────────────────────────────────────────────────────────────────
const newRedirects = [];
const existingExactDuplicates = [];
const conflicts = [];
const chainSources = [];
const loopDetected = [];

for (const req of requestedRedirects) {
  const src = req.sourcePath;
  const dst = req.destPath;

  // Check if exact redirect already exists
  if (allExistingRedirects.has(src)) {
    const existing = allExistingRedirects.get(src);
    if (existing.dest === dst) {
      existingExactDuplicates.push({ ...req, existingLocation: existing.location });
      continue;
    } else {
      conflicts.push({ ...req, existingDest: existing.dest, existingLocation: existing.location });
      continue;
    }
  }

  // Check for chain: destination is itself a source in the requested CSV
  const csvDestAsSource = requestedRedirects.find(r => r.sourcePath === dst);
  if (csvDestAsSource) {
    chainSources.push({ ...req, nextHop: csvDestAsSource.destPath, chainVia: csvDestAsSource.sourcePath });
    continue;
  }

  // Check for chain: destination is a source in existing redirects
  if (allExistingRedirects.has(dst)) {
    chainSources.push({ ...req, nextHop: allExistingRedirects.get(dst).dest, chainVia: dst, chainSource: 'existing' });
    continue;
  }

  // Check for loop: destination eventually points back to source
  const visited = new Set();
  let current = dst;
  let isLoop = false;
  while (true) {
    if (visited.has(current)) { isLoop = true; break; }
    visited.add(current);
    if (current === src) { isLoop = true; break; }
    // Check in all redirects
    const nextDst = allExistingRedirects.get(current)?.dest || requestedRedirects.find(r => r.sourcePath === current)?.destPath;
    if (!nextDst) break;
    current = nextDst;
  }
  if (isLoop && current === src) {
    loopDetected.push(req);
    continue;
  }

  newRedirects.push(req);
}

// Also check for full chains among existing redirects that would be created
const fullRedirectMap = new Map();
for (const [src, info] of allExistingRedirects) fullRedirectMap.set(src, info.dest);
for (const req of requestedRedirects) {
  if (!fullRedirectMap.has(req.sourcePath)) {
    fullRedirectMap.set(req.sourcePath, req.destPath);
  }
}

// Detect all chains in the full map
const allChains = [];
for (const [src, dst] of fullRedirectMap) {
  if (fullRedirectMap.has(dst)) {
    allChains.push({ from: src, to: dst, thenTo: fullRedirectMap.get(dst) });
  }
}

// ─── Print Report ─────────────────────────────────────────────────────────────
console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║          BLOG DEDUPE REDIRECT ANALYSIS REPORT                               ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
console.log();
console.log(`Total requested redirects from CSV: ${requestedRedirects.length}`);
console.log(`Existing redirects in redirects-from-csv.js: ${csvRedirectMap.size}`);
console.log(`Existing redirects in next.config.js (hardcoded): ${nextConfigRedirectMap.size}`);
console.log(`Existing redirects in middleware.ts: ${middlewareRedirectMap.size}`);
console.log();

console.log('─── NEW REDIRECTS TO CREATE ──────────────────────────────────────────────────');
console.log(`Count: ${newRedirects.length}`);
for (const r of newRedirects) {
  console.log(`  ${r.num}: ${r.sourcePath} → ${r.destPath}`);
}
console.log();

console.log('─── EXACT DUPLICATES (already in place, skipped) ─────────────────────────────');
console.log(`Count: ${existingExactDuplicates.length}`);
for (const r of existingExactDuplicates) {
  console.log(`  ${r.num}: ${r.sourcePath} → ${r.destPath}  [already in ${r.existingLocation}]`);
}
console.log();

console.log('─── CONFLICTS (source redirects to DIFFERENT destination) ────────────────────');
console.log(`Count: ${conflicts.length}`);
for (const r of conflicts) {
  console.log(`  ${r.num}: ${r.sourcePath} → ${r.destPath}  [CONFLICT: already redirects to ${r.existingDest} in ${r.existingLocation}]`);
}
console.log();

console.log('─── CHAIN DETECTION ──────────────────────────────────────────────────────────');
console.log(`Count: ${chainSources.length}`);
for (const r of chainSources) {
  console.log(`  ${r.num}: ${r.sourcePath} → ${r.destPath}  [CHAIN: then → ${r.nextHop}]`);
}
console.log();

console.log('─── LOOP DETECTION ────────────────────────────────────────────────────────────');
console.log(`Count: ${loopDetected.length}`);
for (const r of loopDetected) {
  console.log(`  ${r.num}: ${r.sourcePath} → ${r.destPath}  [LOOP DETECTED]`);
}
console.log();

console.log('─── SUMMARY ───────────────────────────────────────────────────────────────────');
console.log(`New redirects to create:        ${newRedirects.length}`);
console.log(`Existing exact duplicates:      ${existingExactDuplicates.length}`);
console.log(`Conflicts found:                ${conflicts.length}`);
console.log(`Chains found:                   ${chainSources.length}`);
console.log(`Loops found:                    ${loopDetected.length}`);
console.log(`───────────────────────────────────────────────────────────────────────────────`);
console.log(`Total active redirect rules after implementation: ${allExistingRedirects.size + newRedirects.length}`);

// ─── Output new redirects as next.config.js snippet ──────────────────────────
console.log();
console.log('─── NEW REDIRECTS SNIPPET FOR next.config.js ─────────────────────────────────');
console.log('      // ─── BLOG DEDUPE REDIRECTS ───────────────────────────────────────────');
for (const r of newRedirects) {
  console.log(`      {`);
  console.log(`        source: '${r.sourcePath}',`);
  console.log(`        destination: '${r.destPath}',`);
  console.log(`        permanent: true,`);
  console.log(`      },`);
}

// Write report to file
const reportPath = path.join(__dirname, '..', 'BLOG_REDIRECT_ANALYSIS_REPORT.md');
const report = `# Blog Dedupe Redirect Analysis Report

Generated: ${new Date().toISOString()}

## Input
- CSV: SAMAN_Blog_Dedupe_Action_List.csv
- Total requested redirects: ${requestedRedirects.length}

## Existing Redirects Inventory
- redirects-from-csv.js: ${csvRedirectMap.size} redirects
- next.config.js (hardcoded): ${nextConfigRedirectMap.size} redirects
- middleware.ts: ${middlewareRedirectMap.size} redirects

## New Redirects to Create (${newRedirects.length})

| # | Source | Destination |
|---|--------|-------------|
${newRedirects.map(r => `| ${r.num} | ${r.sourcePath} | ${r.destPath} |`).join('\n')}

## Exact Duplicates Already in Place (${existingExactDuplicates.length})

| # | Source | Destination | Existing Location |
|---|--------|-------------|-------------------|
${existingExactDuplicates.map(r => `| ${r.num} | ${r.sourcePath} | ${r.destPath} | ${r.existingLocation} |`).join('\n')}

## Conflicts Found (${conflicts.length})

| # | Source | Requested Dest | Existing Dest | Location |
|---|--------|---------------|---------------|----------|
${conflicts.map(r => `| ${r.num} | ${r.sourcePath} | ${r.destPath} | ${r.existingDest} | ${r.existingLocation} |`).join('\n')}

## Chains Found (${chainSources.length})

| # | Source | Destination | Next Hop |
|---|--------|-------------|----------|
${chainSources.map(r => `| ${r.num} | ${r.sourcePath} | ${r.destPath} | ${r.nextHop} |`).join('\n')}

## Loops Found (${loopDetected.length})

| # | Source | Destination |
|---|--------|-------------|
${loopDetected.map(r => `| ${r.num} | ${r.sourcePath} | ${r.destPath} |`).join('\n')}

## Summary
- New redirects created: ${newRedirects.length}
- Existing redirects already in place: ${existingExactDuplicates.length}
- Conflicts found: ${conflicts.length}
- Chains found: ${chainSources.length}
- Loops found: ${loopDetected.length}
- Total active redirect rules after implementation: ${allExistingRedirects.size + newRedirects.length}
`;

fs.writeFileSync(reportPath, report);
console.log();
console.log(`Report saved to: ${reportPath}`);

// Export for potential further use
module.exports = { newRedirects, existingExactDuplicates, conflicts, chainSources, loopDetected };
