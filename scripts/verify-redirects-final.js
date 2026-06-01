/**
 * Final redirect audit after Row 26 correction
 */
const fs = require('fs');
const path = require('path');

// ─── Parse CSV ───────────────────────────────────────────────────────────────
const csvPath = path.join(__dirname, '..', 'SAMAN_Blog_Dedupe_Action_List.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const csvLines = csvContent.split('\n').slice(1);

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
  requestedRedirects.push({ num, sourcePath, destPath });
}

// ─── Load all redirect rules ─────────────────────────────────────────────────
const nextConfigContent = fs.readFileSync(path.join(__dirname, '..', 'next.config.js'), 'utf8');
const csvRedirectsContent = fs.readFileSync(path.join(__dirname, '..', 'redirects-from-csv.js'), 'utf8');
const middlewareContent = fs.readFileSync(path.join(__dirname, '..', 'middleware.ts'), 'utf8');

// Build full redirect map
const fullRedirectMap = new Map();

// From redirects-from-csv.js
const csvRegex = /source:\s*['"](.+?)['"],\s*destination:\s*['"](.+?)['"]/g;
let m;
while ((m = csvRegex.exec(csvRedirectsContent)) !== null) {
  fullRedirectMap.set(m[1], m[2]);
}

// From next.config.js
const ncRegex = /source\s*:\s*['"](.+?)['"]\s*,\s*destination\s*:\s*['"](.+?)['"]/g;
while ((m = ncRegex.exec(nextConfigContent)) !== null) {
  fullRedirectMap.set(m[1], m[2]);
}

// From middleware.ts
const mwRegex = /['"](.+?)['"]\s*:\s*['"](.+?)['"],?/g;
while ((m = mwRegex.exec(middlewareContent)) !== null) {
  if (m[1].includes('/') && m[2].includes('/')) {
    fullRedirectMap.set(m[1], m[2]);
  }
}

// ─── Audit ───────────────────────────────────────────────────────────────────
let chains = 0;
let loops = 0;
const chainDetails = [];
const loopDetails = [];

for (const [src, dst] of fullRedirectMap) {
  // Check chain: destination is itself a source
  if (fullRedirectMap.has(dst)) {
    chains++;
    chainDetails.push({ from: src, to: dst, thenTo: fullRedirectMap.get(dst) });
  }

  // Check loop
  const visited = new Set();
  let current = dst;
  let foundLoop = false;
  while (true) {
    if (visited.has(current)) { foundLoop = true; break; }
    visited.add(current);
    if (current === src) { foundLoop = true; break; }
    const nextDst = fullRedirectMap.get(current);
    if (!nextDst) break;
    current = nextDst;
  }
  if (foundLoop && current === src) {
    loops++;
    loopDetails.push({ from: src, to: dst });
  }
}

// ─── Count redirects ─────────────────────────────────────────────────────────
const ncHardcodedCount = (nextConfigContent.match(/permanent:\s*true/g) || []).length;
const csvCount = (csvRedirectsContent.match(/\{ source:/g) || []).length;
const mwCount = (middlewareContent.match(/:\s*['"]\//g) || []).length;

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║          FINAL REDIRECT AUDIT (after Row 26 correction)                     ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
console.log();
console.log('─── REDIRECT CHAIN DETECTION ─────────────────────────────────────────────────');
console.log(`Chains found: ${chains}`);
if (chains > 0) {
  for (const c of chainDetails.slice(0, 10)) {
    console.log(`  ${c.from} → ${c.to} → ${c.thenTo}`);
  }
  if (chains > 10) console.log(`  ... and ${chains - 10} more`);
}
console.log();
console.log('─── REDIRECT LOOP DETECTION ──────────────────────────────────────────────────');
console.log(`Loops found: ${loops}`);
if (loops > 0) {
  for (const l of loopDetails) {
    console.log(`  ${l.from} → ${l.to}`);
  }
}
console.log();
console.log('─── REDIRECT STATISTICS ──────────────────────────────────────────────────────');
console.log(`redirects-from-csv.js:      ${csvCount}`);
console.log(`next.config.js (hardcoded): ${ncHardcodedCount}`);
console.log(`middleware.ts:              ${mwCount}`);
console.log(`───────────────────────────────────────────────────────────────────────────────`);
console.log(`Total active redirect rules: ${csvCount + ncHardcodedCount + mwCount}`);
console.log();
console.log('─── ROW 26 VERIFICATION ──────────────────────────────────────────────────────');
const hebbal2Dest = fullRedirectMap.get('/portacabins-for-sale-in-hebbal-2');
console.log(`/portacabins-for-sale-in-hebbal-2 → ${hebbal2Dest}`);
if (hebbal2Dest === '/porta-cabins-in-hebbal') {
  console.log('✅ CORRECT: Direct redirect to canonical target');
} else {
  console.log('❌ INCORRECT');
}
console.log();
console.log('─── OVERALL STATUS ───────────────────────────────────────────────────────────');
if (chains === 0 && loops === 0) {
  console.log('✅ ALL CLEAR: No chains, no loops');
} else {
  console.log('⚠️  ISSUES DETECTED');
}

// Save to file
const reportPath = path.join(__dirname, '..', 'BLOG_REDIRECT_FINAL_AUDIT.txt');
const report = `FINAL REDIRECT AUDIT (after Row 26 correction)
Generated: ${new Date().toISOString()}

Redirect Chains Found: ${chains}
Redirect Loops Found: ${loops}

Redirect Statistics:
- redirects-from-csv.js: ${csvCount}
- next.config.js (hardcoded): ${ncHardcodedCount}
- middleware.ts: ${mwCount}
- Total active redirect rules: ${csvCount + ncHardcodedCount + mwCount}

Row 26 Verification:
/portacabins-for-sale-in-hebbal-2 → ${hebbal2Dest}
Status: ${hebbal2Dest === '/porta-cabins-in-hebbal' ? 'CORRECT (direct to canonical)' : 'INCORRECT'}

Overall: ${chains === 0 && loops === 0 ? 'ALL CLEAR' : 'ISSUES DETECTED'}
`;
fs.writeFileSync(reportPath, report);
console.log(`Audit saved to: ${reportPath}`);
