#!/usr/bin/env node
/**
 * verify-redirects.js
 * Full audit: CSV redirects vs. what next.config.js actually resolves.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const CSV_PATH    = path.resolve(__dirname, '../Untitled spreadsheet - Sheet1 (1).csv');
const CONFIG_PATH = path.resolve(__dirname, '../next.config.js');

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', gray: '\x1b[90m',
};
const ok   = s => `${C.green}✅ ${s}${C.reset}`;
const warn = s => `${C.yellow}⚠️  ${s}${C.reset}`;
const fail = s => `${C.red}❌ ${s}${C.reset}`;
const hdr  = s => `\n${C.bold}${C.cyan}${s}${C.reset}`;
const dim  = s => `${C.gray}${s}${C.reset}`;

function toPathname(rawUrl) {
  try { return new URL(rawUrl.trim()).pathname || null; } catch { return null; }
}

function parseCsv(content) {
  return content.split(/\r?\n/).map(line => {
    const c = line.split(',');
    return {
      sourceUrl:      (c[0] || '').trim(),
      destinationUrl: (c[1] || '').trim(),
      bucket:         (c[3] || '').trim(),
    };
  });
}

// Sources intentionally kept with more-specific destinations in next.config.js
const HAND_CRAFTED = new Set([
  '/innovative-office-container-designs-2',
  '/luxury-porta-cabins-your-portable-oasis-of-comfort-and-style',
]);

async function main() {

  // ── STEP 1: Parse CSV ──────────────────────────────────────────────────────
  console.log(hdr('═══ STEP 1 › Parsing CSV ══════════════════════════════════'));
  const csvRows = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'));

  const stats = { csvTotal: 0, merge: 0, invalid: 0, expected: 0 };
  const expectedMap = new Map();
  const invalidRows = [];

  for (let i = 1; i < csvRows.length; i++) {
    const { sourceUrl, destinationUrl, bucket } = csvRows[i];
    if (!sourceUrl && !destinationUrl) continue;
    stats.csvTotal++;

    if (bucket.toUpperCase() === 'MERGE') { stats.merge++; continue; }

    const src  = toPathname(sourceUrl);
    const dest = toPathname(destinationUrl);

    if (!src || !dest) {
      stats.invalid++;
      invalidRows.push({ row: i + 1, sourceUrl, destinationUrl });
      continue;
    }

    if (!expectedMap.has(src)) {   // keep first occurrence of duplicates
      expectedMap.set(src, dest);
      stats.expected++;
    }
  }

  console.log(`   CSV total rows (excl. header) : ${stats.csvTotal}`);
  console.log(`   MERGE rows skipped            : ${stats.merge}`);
  console.log(`   Invalid / empty rows          : ${stats.invalid}`);
  console.log(`   Expected redirects            : ${stats.expected}`);

  // ── STEP 2: Load live redirects from next.config.js ────────────────────────
  console.log(hdr('═══ STEP 2 › Loading next.config.js ══════════════════════'));
  let allLive = [];
  try {
    const cfg = require(CONFIG_PATH);
    allLive = await cfg.redirects();   // async function
  } catch (e) {
    console.error(fail(`Could not load next.config.js: ${e.message}`));
    process.exit(1);
  }
  console.log(`   Total live redirects resolved : ${allLive.length}`);

  // Build live map + detect duplicates
  const liveMap   = new Map();
  const liveDupes = [];
  for (const r of allLive) {
    if (liveMap.has(r.source)) {
      liveDupes.push({ source: r.source, d1: liveMap.get(r.source).destination, d2: r.destination });
    } else {
      liveMap.set(r.source, { destination: r.destination, permanent: r.permanent });
    }
  }

  // ── STEP 3: Cross-reference ────────────────────────────────────────────────
  console.log(hdr('═══ STEP 3 › Cross-referencing ════════════════════════════'));

  const issues = {
    missing: [], wrongDest: [], notPermanent: [],
    loops: [], malformed: [], caseIssues: [], handCraftedOK: [],
  };
  let verifiedCount = 0;

  for (const [src, expectedDest] of expectedMap.entries()) {

    // Hand-crafted overrides – just confirm they exist in live
    if (HAND_CRAFTED.has(src)) {
      if (liveMap.has(src)) {
        issues.handCraftedOK.push({ source: src, live: liveMap.get(src).destination, csv: expectedDest });
      } else {
        issues.missing.push({ source: src, expectedDest, note: 'hand-crafted override is MISSING from live!' });
      }
      continue;
    }

    // Missing check
    if (!liveMap.has(src)) {
      issues.missing.push({ source: src, expectedDest });
      continue;
    }

    verifiedCount++;
    const live = liveMap.get(src);

    if (live.destination !== expectedDest)
      issues.wrongDest.push({ source: src, expected: expectedDest, got: live.destination });

    if (live.permanent !== true)
      issues.notPermanent.push({ source: src, permanent: live.permanent });

    if (src === live.destination)
      issues.loops.push({ source: src, destination: live.destination });

    if (src !== src.toLowerCase())
      issues.caseIssues.push(src);

    if (/%[0-9A-Fa-f]{2}/.test(src) || /%[0-9A-Fa-f]{2}/.test(live.destination))
      issues.malformed.push({ source: src, reason: 'URL-encoded chars in path' });
  }

  // ── STEP 4: Duplicate check ────────────────────────────────────────────────
  console.log(hdr('═══ STEP 4 › Duplicate Check ══════════════════════════════'));
  if (liveDupes.length === 0) {
    console.log(ok('No duplicate sources in live config.'));
  } else {
    liveDupes.forEach(d =>
      console.log(fail(`Duplicate: ${d.source}  →  "${d.d1}" vs "${d.d2}"`))
    );
  }

  // ── STEP 5: Report ─────────────────────────────────────────────────────────
  console.log(hdr('═══ STEP 5 › Verification Report ══════════════════════════'));

  let allGood = true;

  if (issues.missing.length > 0) {
    allGood = false;
    console.log(fail(`MISSING REDIRECTS (${issues.missing.length}):`));
    issues.missing.forEach(m =>
      console.log(`   ${C.red}src: ${m.source}${C.reset}\n   ${C.gray}expected-dest: ${m.expectedDest}${m.note ? ' | '+m.note : ''}${C.reset}`)
    );
  } else { console.log(ok('No missing redirects.')); }

  if (issues.wrongDest.length > 0) {
    allGood = false;
    console.log(fail(`WRONG DESTINATION (${issues.wrongDest.length}):`));
    issues.wrongDest.forEach(w =>
      console.log(`   ${C.red}${w.source}\n   expected: ${w.expected}\n   got:      ${w.got}${C.reset}`)
    );
  } else { console.log(ok('All destinations match CSV.')); }

  if (issues.notPermanent.length > 0) {
    allGood = false;
    console.log(fail(`NOT PERMANENT:true (${issues.notPermanent.length}):`));
    issues.notPermanent.forEach(n =>
      console.log(`   ${C.red}${n.source}  permanent=${n.permanent}${C.reset}`)
    );
  } else { console.log(ok('All redirects have permanent: true.')); }

  if (issues.loops.length > 0) {
    allGood = false;
    console.log(fail(`REDIRECT LOOPS (${issues.loops.length}):`));
    issues.loops.forEach(l => console.log(`   ${C.red}${l.source} → ${l.destination}${C.reset}`));
  } else { console.log(ok('No redirect loops.')); }

  if (issues.caseIssues.length > 0) {
    console.log(warn(`UPPERCASE IN SOURCE (${issues.caseIssues.length}) — may break on case-sensitive hosts`));
    issues.caseIssues.forEach(s => console.log(`   ${C.yellow}${s}${C.reset}`));
  } else { console.log(ok('No uppercase characters in source paths.')); }

  if (issues.malformed.length > 0) {
    console.log(warn(`URL-ENCODED CHARS (${issues.malformed.length}):`));
    issues.malformed.forEach(m => console.log(`   ${C.yellow}${m.source} — ${m.reason}${C.reset}`));
  } else { console.log(ok('No URL-encoding issues.')); }

  if (liveDupes.length > 0) {
    allGood = false;
    console.log(fail(`DUPLICATE SOURCES IN LIVE CONFIG: ${liveDupes.length}`));
  } else { console.log(ok('No duplicates in live config.')); }

  if (invalidRows.length > 0) {
    console.log(warn(`Invalid/unparseable CSV rows: ${invalidRows.length}`));
    invalidRows.forEach(r => console.log(dim(`   row ${r.row}: "${r.sourceUrl}" | "${r.destinationUrl}"`)));
  } else { console.log(ok('All CSV rows parsed cleanly.')); }

  if (issues.handCraftedOK.length > 0) {
    console.log(ok(`Hand-crafted overrides preserved (${issues.handCraftedOK.length}):`));
    issues.handCraftedOK.forEach(h =>
      console.log(dim(`   ${h.source}\n   live→ ${h.live}  (csv had: ${h.csv})`))
    );
  }

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  console.log(hdr('═══ SUMMARY ═══════════════════════════════════════════════'));
  console.log(`   CSV total rows (excl. header)  : ${stats.csvTotal}`);
  console.log(`   MERGE rows skipped             : ${stats.merge}`);
  console.log(`   Invalid rows skipped           : ${stats.invalid}`);
  console.log(`   Expected REDIRECT rows (CSV)   : ${stats.expected}`);
  console.log(`   Live redirects in config       : ${allLive.length}`);
  console.log(`   CSV redirects verified in live : ${verifiedCount}`);
  console.log(`   Hand-crafted overrides checked : ${issues.handCraftedOK.length}`);
  console.log(`   Missing from live              : ${issues.missing.length}`);
  console.log(`   Wrong destination              : ${issues.wrongDest.length}`);
  console.log(`   Not permanent                  : ${issues.notPermanent.length}`);
  console.log(`   Redirect loops                 : ${issues.loops.length}`);
  console.log(`   Duplicate sources (live)       : ${liveDupes.length}`);
  console.log(`   URL encoding issues            : ${issues.malformed.length}`);
  console.log(`   Case issues (uppercase paths)  : ${issues.caseIssues.length}`);

  // ── VERDICT ────────────────────────────────────────────────────────────────
  console.log('');
  const passed = allGood
    && issues.missing.length      === 0
    && issues.wrongDest.length    === 0
    && issues.loops.length        === 0
    && liveDupes.length           === 0
    && issues.notPermanent.length === 0;

  if (passed) {
    console.log(`${C.bold}${C.green}✅✅  All redirects verified successfully  ✅✅${C.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${C.bold}${C.red}❌  Verification failed — see issues above.${C.reset}\n`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
