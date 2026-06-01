const fs = require('fs');
const path = require('path');

const CSV_PATH = '/Users/amandubey/Downloads/Saman Portable/SAMAN_301_Redirects_For_Developer_Aman_1.csv';
const NEXT_CONFIG_PATH = '/Users/amandubey/Downloads/Saman Portable/next.config.js';
const CSV_JS_PATH = '/Users/amandubey/Downloads/Saman Portable/redirects-from-csv.js';
const MIDDLEWARE_PATH = '/Users/amandubey/Downloads/Saman Portable/middleware.ts';

// Normalize URLs (remove domain, ensure leading slash, remove trailing slash)
function normalizeUrl(url) {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\/(www\.)?samanportable\.com/, '');
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  // Remove trailing slash for consistency (unless it's just '/')
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

// 1. Read CSV File
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const csvRows = [];
const lines = csvContent.split(/\r?\n/);
// Headers: Source URL (301 FROM),Destination URL (301 TO),Cluster
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Parse simple CSV row (splitting by comma, taking care of possible quotes)
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

// 2. Load Existing Redirects from redirects-from-csv.js
const existingCsvJsRedirects = require(CSV_JS_PATH);
const existingMap = new Map(); // source -> destination

existingCsvJsRedirects.forEach(r => {
  existingMap.set(normalizeUrl(r.source), {
    destination: normalizeUrl(r.destination),
    sourceFile: 'redirects-from-csv.js'
  });
});

// 3. Load Existing Redirects from middleware.ts redirectMap
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

// 4. Load Existing Redirects from next.config.js inline array
const nextConfigContent = fs.readFileSync(NEXT_CONFIG_PATH, 'utf-8');
const redirectsFuncMatch = nextConfigContent.match(/async redirects\(\) {([\s\S]*?)return redirects;/);
if (redirectsFuncMatch) {
  const funcText = redirectsFuncMatch[1];
  // Find all objects inside the redirects array definition
  const matches = funcText.matchAll(/source:\s*'([^']+)',\s*destination:\s*'([^']+)'/g);
  for (const match of matches) {
    existingMap.set(normalizeUrl(match[1]), {
      destination: normalizeUrl(match[2]),
      sourceFile: 'next.config.js (inline)'
    });
  }
}

// 5. Audit each CSV row
const auditResults = [];
let totalCsv = csvRows.length;
let newCreated = 0;
let existingSkipped = 0;
let conflictsFound = 0;
let chainsFound = 0;
let loopsFound = 0;

csvRows.forEach((row) => {
  const normalizedSource = row.source;
  const normalizedDest = row.destination;
  
  let status = 'New redirect required';
  let notes = '';
  
  const existing = existingMap.get(normalizedSource);
  
  if (existing) {
    if (existing.destination === normalizedDest) {
      status = 'Already exists';
      notes = `Exact match already exists in ${existing.sourceFile}`;
      existingSkipped++;
    } else {
      status = 'Conflict';
      notes = `WARNING: Source currently redirects to "${existing.destination}" in ${existing.sourceFile}`;
      conflictsFound++;
    }
  } else {
    // Check for Redirect Loops: A -> B and B -> A
    // If the destination redirects back to the source
    const destRedirect = existingMap.get(normalizedDest);
    if (destRedirect && destRedirect.destination === normalizedSource) {
      status = 'Redirect loop risk';
      notes = `DANGER: Destination "${normalizedDest}" redirects back to "${normalizedSource}" (Loop)`;
      loopsFound++;
    } 
    // Check for Redirect Chains: A -> B and B -> C
    // If the destination of this redirect is the source of an existing redirect
    else if (existingMap.has(normalizedDest)) {
      const target = existingMap.get(normalizedDest);
      status = 'Redirect chain risk';
      notes = `WARNING: Destination "${normalizedDest}" redirects to "${target.destination}" (Chain: A -> B -> C)`;
      chainsFound++;
    }
    // Check if another redirect points to this source: Z -> A and A -> B
    // We can also find Z -> A and warn about chain.
    else {
      let isChainSource = false;
      for (const [existingSrc, existingVal] of existingMap.entries()) {
        if (existingVal.destination === normalizedSource) {
          isChainSource = true;
          notes = `WARNING: Existing source "${existingSrc}" redirects here (Chain Z -> A -> B)`;
          break;
        }
      }
      
      if (isChainSource) {
        status = 'Redirect chain risk';
        chainsFound++;
      } else {
        newCreated++;
      }
    }
  }
  
  auditResults.push({
    source: row.rawSource,
    destination: row.rawDestination,
    normalizedSource,
    normalizedDest,
    status,
    notes
  });
});

console.log(JSON.stringify({
  stats: {
    totalCsv,
    newCreated,
    existingSkipped,
    conflictsFound,
    chainsFound,
    loopsFound
  },
  auditResults
}, null, 2));
