#!/usr/bin/env node
/**
 * generate-csv-redirects.js
 *
 * Reads the redirect spreadsheet CSV and outputs:
 *   redirects-from-csv.js  – a CommonJS module exporting the redirects array.
 *
 * Rules:
 *   - Skip rows where Bucket === "MERGE"
 *   - Skip rows with invalid / unparseable URLs
 *   - Convert full URLs to pathname-only redirects
 *   - Deduplicate by source path
 *   - Skip sources that already exist in EXISTING_SOURCES (to avoid
 *     overwriting more specific redirects already in next.config.js)
 */

const fs   = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const CSV_PATH = path.resolve(
  __dirname,
  '../Untitled spreadsheet - Sheet1 (1).csv'
);

const OUT_PATH = path.resolve(__dirname, '../redirects-from-csv.js');

// Sources already handled in next.config.js – skip to preserve existing logic
const EXISTING_SOURCES = new Set([
  '/container-cafes-in-central-delhi-2',
  '/container-offices-in-gurgaon-2',
  '/container-offices-for-sale-in-btm-layout-2',
  '/container-offices-for-sale-in-rt-nagar-2',
  '/portacabins-for-sale-in-hebbal-2',
  '/innovative-office-container-designs-2',
  '/luxury-porta-cabins-your-portable-oasis-of-comfort-and-style',
  '/wp-content/uploads/2020/04/saman-profiles.pdf',
  '/wp-content/uploads/2020/03/saman-catalogue.pdf',
  '/products/shipping-container-house',
  '/project/portable-cabins-manufacturer',
  '/project/industrial-shed-manufacturer',
  '/porta-cabins',
  '/products/kitchen-container',
  '/container-office-for-sale-in-bangalore',
  '/products/portable-cabin',
  '/products/mobile-toilet',
  '/project/container-homes',
  '/labour-colonies-in-najafgarh',
  '/products/portable-toilet',
  '/prefab-labour-colonies-in-central-delhi',
  '/labour-colonies-for-sale-in-central-delhi',
  '/products/industrial-shed-manufacturer',
  '/container-offices-for-sale-in-nagarbhavi-3',
  '/prefab-labour-colonies-in-east-delhi',
  '/labour-colonies-in-okhla-industrial',
  '/prefab-labour-colonies-in-west-delhi',
  '/labour-colonies-in-loni-ghaziabad',
  '/container-offices-for-sale-in-peenya',
  '/products/mobile-home',
  '/project/portable-cabin',
  '/labour-camps-in-noida',
  '/prefab-labour-colonies-in-north-delhi',
  '/prefab-labour-camps-in-ghaziabad',
  '/prefab-labour-colonies-in-lucknow',
  '/labour-colonies-for-sale-in-north-delhi',
  '/products/office-cabins',
  '/labour-colonies-for-sale-in-south-delhi',
  '/labour-colonies-for-sale-in-new-delhi',
  '/container-offices-for-sale-in-hosur-3',
  '/prefab-labour-colonies-in-meerut',
  '/find-out-how-i-cured-my-easter-weekend-in-2-days',
]);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function toPathname(rawUrl) {
  try {
    const u = new URL(rawUrl.trim());
    // pathname includes leading slash; keep trailing slash if present
    return u.pathname || null;
  } catch {
    return null;
  }
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/);
  return lines.map(line => {
    // Simple CSV split – fields don't contain commas in this file
    const cols = line.split(',');
    return {
      sourceUrl:      (cols[0] || '').trim(),
      destinationUrl: (cols[1] || '').trim(),
      cluster:        (cols[2] || '').trim(),
      bucket:         (cols[3] || '').trim(),
    };
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

function main() {
  const raw     = fs.readFileSync(CSV_PATH, 'utf8');
  const rows    = parseCsv(raw);

  const stats = {
    total:    0,
    merge:    0,
    invalid:  0,
    conflict: 0,
    duplicate:0,
    added:    0,
  };

  const seenSources = new Set();
  const redirects   = [];

  // Skip header row (index 0)
  for (let i = 1; i < rows.length; i++) {
    const { sourceUrl, destinationUrl, bucket } = rows[i];

    // Skip empty lines
    if (!sourceUrl && !destinationUrl) continue;

    stats.total++;

    // 1. Skip MERGE
    if (bucket.toUpperCase() === 'MERGE') {
      stats.merge++;
      continue;
    }

    // 2. Validate & convert URLs
    const source      = toPathname(sourceUrl);
    // Normalize destination to slash-less canonical form (site uses trailingSlash: false);
    // this prevents an extra 308 redirect hop / redirect chains. Source paths are
    // intentionally left unchanged.
    let destination   = toPathname(destinationUrl);
    if (destination && destination !== '/') destination = destination.replace(/\/+$/, '');

    if (!source || !destination) {
      stats.invalid++;
      console.warn(`[SKIP invalid]  row ${i + 1}: "${sourceUrl}" | "${destinationUrl}"`);
      continue;
    }

    // 3. Skip sources already in existing config
    if (EXISTING_SOURCES.has(source)) {
      stats.conflict++;
      console.info(`[SKIP conflict] row ${i + 1}: ${source} (already in next.config.js)`);
      continue;
    }

    // 4. Deduplicate
    if (seenSources.has(source)) {
      stats.duplicate++;
      console.warn(`[SKIP dup]      row ${i + 1}: ${source}`);
      continue;
    }

    seenSources.add(source);
    redirects.push({ source, destination, permanent: true });
    stats.added++;
  }

  // ─── OUTPUT ────────────────────────────────────────────────────────────────

  const lines = [
    '/**',
    ' * redirects-from-csv.js',
    ' * AUTO-GENERATED – do not edit by hand.',
    ` * Generated: ${new Date().toISOString()}`,
    ` * Source: Untitled spreadsheet - Sheet1 (1).csv`,
    ' *',
    ` * Stats: ${stats.added} redirects added | ${stats.merge} MERGE skipped`,
    ` *        ${stats.conflict} conflict skipped | ${stats.duplicate} duplicate skipped`,
    ` *        ${stats.invalid} invalid/empty skipped`,
    ' */',
    '',
    '/** @type {Array<{source:string, destination:string, permanent:boolean}>} */',
    'const csvRedirects = [',
  ];

  for (const r of redirects) {
    // Escape single quotes in paths (shouldn't exist, but safety first)
    const src  = r.source.replace(/'/g, "\\'");
    const dest = r.destination.replace(/'/g, "\\'");
    lines.push(`  { source: '${src}', destination: '${dest}', permanent: true },`);
  }

  lines.push('];', '', 'module.exports = csvRedirects;', '');

  fs.writeFileSync(OUT_PATH, lines.join('\n'), 'utf8');

  console.log('\n✅ Done!');
  console.log(`   Output: ${OUT_PATH}`);
  console.log(`   ─────────────────────────────`);
  console.log(`   Total CSV rows  : ${stats.total}`);
  console.log(`   MERGE skipped   : ${stats.merge}`);
  console.log(`   Conflict skipped: ${stats.conflict}`);
  console.log(`   Duplicate skipped:${stats.duplicate}`);
  console.log(`   Invalid skipped : ${stats.invalid}`);
  console.log(`   ➜ Redirects added: ${stats.added}`);
}

main();
