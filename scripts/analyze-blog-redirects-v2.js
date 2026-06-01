/**
 * Analyze blog dedupe redirects before implementation (v2 - simpler string matching)
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

// ─── Helper: find redirect in file content ───────────────────────────────────
function findRedirectInFile(fileContent, sourcePath, destPath) {
  // Look for exact source string match
  const sourcePattern = sourcePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sourceRegex = new RegExp(`source\\s*:\\s*['"]${sourcePattern}['"]`, 'g');
  if (!sourceRegex.test(fileContent)) return null;

  // If source exists, check if destination also exists nearby
  const destPattern = destPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const destRegex = new RegExp(`destination\\s*:\\s*['"]${destPattern}['"]`, 'g');
  if (!destRegex.test(fileContent)) return 'source-only';

  // More precise check: source and dest within 200 chars of each other
  const idx = fileContent.indexOf(`'${sourcePath}'`);
  if (idx === -1) return 'source-only';
  const nearby = fileContent.substring(idx, idx + 500);
  if (nearby.includes(`'${destPath}'`) || nearby.includes(`"${destPath}"`)) {
    return 'exact-match';
  }
  return 'conflict';
}

// ─── Load file contents ──────────────────────────────────────────────────────
const nextConfigContent = fs.readFileSync(path.join(__dirname, '..', 'next.config.js'), 'utf8');
const middlewareContent = fs.readFileSync(path.join(__dirname, '..', 'middleware.ts'), 'utf8');
const csvRedirectsContent = fs.readFileSync(path.join(__dirname, '..', 'redirects-from-csv.js'), 'utf8');

// ─── Analyze each requested redirect ───────────────────────────────────────────
const newRedirects = [];
const existingExactDuplicates = [];
const conflicts = [];
const chainSources = [];
const loopDetected = [];

for (const req of requestedRedirects) {
  const src = req.sourcePath;
  const dst = req.destPath;

  // Check next.config.js
  const ncResult = findRedirectInFile(nextConfigContent, src, dst);
  if (ncResult === 'exact-match') {
    existingExactDuplicates.push({ ...req, existingLocation: 'next.config.js' });
    continue;
  } else if (ncResult === 'conflict') {
    // Find what it actually redirects to
    const idx = nextConfigContent.indexOf(`'${src}'`);
    const nearby = nextConfigContent.substring(idx, idx + 500);
    const destMatch = nearby.match(/destination\s*:\s*['"](.+?)['"]/);
    const actualDest = destMatch ? destMatch[1] : 'unknown';
    conflicts.push({ ...req, existingDest: actualDest, existingLocation: 'next.config.js' });
    continue;
  } else if (ncResult === 'source-only') {
    conflicts.push({ ...req, existingDest: 'unknown', existingLocation: 'next.config.js (source only)' });
    continue;
  }

  // Check redirects-from-csv.js
  const csvResult = findRedirectInFile(csvRedirectsContent, src, dst);
  if (csvResult === 'exact-match') {
    existingExactDuplicates.push({ ...req, existingLocation: 'redirects-from-csv.js' });
    continue;
  } else if (csvResult === 'conflict') {
    const idx = csvRedirectsContent.indexOf(`'${src}'`);
    const nearby = csvRedirectsContent.substring(idx, idx + 500);
    const destMatch = nearby.match(/destination:\s*['"](.+?)['"]/);
    const actualDest = destMatch ? destMatch[1] : 'unknown';
    conflicts.push({ ...req, existingDest: actualDest, existingLocation: 'redirects-from-csv.js' });
    continue;
  } else if (csvResult === 'source-only') {
    conflicts.push({ ...req, existingDest: 'unknown', existingLocation: 'redirects-from-csv.js (source only)' });
    continue;
  }

  // Check middleware.ts
  const mwResult = findRedirectInFile(middlewareContent, src, dst);
  if (mwResult === 'exact-match') {
    existingExactDuplicates.push({ ...req, existingLocation: 'middleware.ts' });
    continue;
  } else if (mwResult === 'conflict') {
    const idx = middlewareContent.indexOf(`'${src}'`);
    const nearby = middlewareContent.substring(idx, idx + 500);
    const destMatch = nearby.match(/['"](.+?)['"]\s*:\s*['"](.+?)['"]/);
    const actualDest = destMatch ? destMatch[2] : 'unknown';
    conflicts.push({ ...req, existingDest: actualDest, existingLocation: 'middleware.ts' });
    continue;
  } else if (mwResult === 'source-only') {
    conflicts.push({ ...req, existingDest: 'unknown', existingLocation: 'middleware.ts (source only)' });
    continue;
  }

  // Check for chain: destination is itself a source in the requested CSV
  const csvDestAsSource = requestedRedirects.find(r => r.sourcePath === dst);
  if (csvDestAsSource) {
    chainSources.push({ ...req, nextHop: csvDestAsSource.destPath, chainVia: csvDestAsSource.sourcePath });
    continue;
  }

  // Check for chain: destination is a source in existing redirects
  if (nextConfigContent.includes(`'${dst}'`) || csvRedirectsContent.includes(`'${dst}'`)) {
    // Determine next hop
    let nextHop = 'unknown';
    const idx1 = nextConfigContent.indexOf(`'${dst}'`);
    if (idx1 !== -1) {
      const nearby = nextConfigContent.substring(idx1, idx1 + 500);
      const destMatch = nearby.match(/destination\s*:\s*['"](.+?)['"]/);
      if (destMatch) nextHop = destMatch[1];
    }
    const idx2 = csvRedirectsContent.indexOf(`'${dst}'`);
    if (idx2 !== -1 && nextHop === 'unknown') {
      const nearby = csvRedirectsContent.substring(idx2, idx2 + 500);
      const destMatch = nearby.match(/destination:\s*['"](.+?)['"]/);
      if (destMatch) nextHop = destMatch[1];
    }
    chainSources.push({ ...req, nextHop, chainVia: dst, chainSource: 'existing' });
    continue;
  }

  // Check for loop: destination eventually points back to source
  // Build full redirect map for loop detection
  const fullRedirectMap = new Map();
  for (const r of requestedRedirects) {
    fullRedirectMap.set(r.sourcePath, r.destPath);
  }
  // Add existing redirects from csvRedirectsContent
  const csvAllRegex = /source:\s*['"](.+?)['"],\s*destination:\s*['"](.+?)['"]/g;
  let match;
  while ((match = csvAllRegex.exec(csvRedirectsContent)) !== null) {
    fullRedirectMap.set(match[1], match[2]);
  }
  // Add next.config.js redirects
  const ncAllRegex = /source\s*:\s*['"](.+?)['"]\s*,\s*destination\s*:\s*['"](.+?)['"]/g;
  while ((match = ncAllRegex.exec(nextConfigContent)) !== null) {
    fullRedirectMap.set(match[1], match[2]);
  }

  const visited = new Set();
  let current = dst;
  let isLoop = false;
  while (true) {
    if (visited.has(current)) { isLoop = true; break; }
    visited.add(current);
    if (current === src) { isLoop = true; break; }
    const nextDst = fullRedirectMap.get(current);
    if (!nextDst) break;
    current = nextDst;
  }
  if (isLoop && current === src) {
    loopDetected.push(req);
    continue;
  }

  newRedirects.push(req);
}

// ─── Print Report ─────────────────────────────────────────────────────────────
console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║          BLOG DEDUPE REDIRECT ANALYSIS REPORT (v2)                         ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
console.log();
console.log(`Total requested redirects from CSV: ${requestedRedirects.length}`);
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
`;

fs.writeFileSync(reportPath, report);
console.log();
console.log(`Report saved to: ${reportPath}`);

module.exports = { newRedirects, existingExactDuplicates, conflicts, chainSources, loopDetected };
