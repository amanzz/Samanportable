const fs = require('fs');
const path = require('path');

const CSV_PATH = '/Users/amandubey/Downloads/Saman Portable/SAMAN_301_Redirects_For_Developer_Aman_1.csv';
const NEXT_CONFIG_PATH = '/Users/amandubey/Downloads/Saman Portable/next.config.js';
const CSV_JS_PATH = '/Users/amandubey/Downloads/Saman Portable/redirects-from-csv.js';
const MIDDLEWARE_PATH = '/Users/amandubey/Downloads/Saman Portable/middleware.ts';

function normalizeUrl(url) {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\/(www\.)?samanportable\.com/, '');
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const csvRows = [];
const lines = csvContent.split(/\r?\n/);
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let c = 0; c < line.length; c++) {
    const char = line[c];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  
  if (parts.length >= 2) {
    csvRows.push({
      rawSource: parts[0].trim(),
      rawDestination: parts[1].trim(),
      source: normalizeUrl(parts[0]),
      destination: normalizeUrl(parts[1]),
      cluster: parts[2] ? parts[2].trim() : ''
    });
  }
}

const existingCsvJsRedirects = require(CSV_JS_PATH);
const existingMap = new Map();

existingCsvJsRedirects.forEach(r => {
  existingMap.set(normalizeUrl(r.source), {
    destination: normalizeUrl(r.destination),
    sourceFile: 'redirects-from-csv.js'
  });
});

const middlewareContent = fs.readFileSync(MIDDLEWARE_PATH, 'utf-8');
const redirectMapMatch = middlewareContent.match(/const redirectMap: Record<string, string> = {([\s\S]*?)};/);
if (redirectMapMatch) {
  const mapText = redirectMapMatch[1];
  const mapLines = mapText.split('\n');
  mapLines.forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) {
      existingMap.set(normalizeUrl(match[1]), {
        destination: normalizeUrl(match[2]),
        sourceFile: 'middleware.ts'
      });
    }
  });
}

const nextConfigContent = fs.readFileSync(NEXT_CONFIG_PATH, 'utf-8');
const redirectsFuncMatch = nextConfigContent.match(/async redirects\(\) {([\s\S]*?)return redirects;/);
if (redirectsFuncMatch) {
  const funcText = redirectsFuncMatch[1];
  const matches = funcText.matchAll(/source:\s*'([^']+)',\s*destination:\s*'([^']+)'/g);
  for (const match of matches) {
    existingMap.set(normalizeUrl(match[1]), {
      destination: normalizeUrl(match[2]),
      sourceFile: 'next.config.js (inline)'
    });
  }
}

console.log('=== AUDIT RESULTS TABLE ===\n');
csvRows.forEach((row, idx) => {
  const nSource = row.source;
  const nDest = row.destination;
  let status = 'New redirect required';
  let notes = '';
  
  const existing = existingMap.get(nSource);
  if (existing) {
    if (existing.destination === nDest) {
      status = 'Already exists';
      notes = `Exact match already exists in ${existing.sourceFile}`;
    } else {
      status = 'Conflict';
      notes = `Conflict: existing points to "${existing.destination}" in ${existing.sourceFile}`;
    }
  } else {
    const destRedirect = existingMap.get(nDest);
    if (destRedirect && destRedirect.destination === nSource) {
      status = 'Redirect loop risk';
      notes = `Redirect loop: destination "${nDest}" redirects back to "${nSource}"`;
    } else if (existingMap.has(nDest)) {
      const target = existingMap.get(nDest);
      status = 'Redirect chain risk';
      notes = `Redirect chain: destination "${nDest}" redirects to "${target.destination}"`;
    } else {
      let isChainSource = false;
      for (const [existingSrc, existingVal] of existingMap.entries()) {
        if (existingVal.destination === nSource) {
          isChainSource = true;
          notes = `Redirect chain: existing source "${existingSrc}" redirects here`;
          break;
        }
      }
      if (isChainSource) {
        status = 'Redirect chain risk';
      }
    }
  }
  
  console.log(`| ${row.source} | ${row.destination} | **${status}** | ${notes || 'Safe to create'} |`);
});
