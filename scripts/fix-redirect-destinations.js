/**
 * fix-redirect-destinations.js
 *
 * Makes all REDIRECT destinations absolute (https://www.samanportable.com/...)
 * so the live server lands on the final canonical www URL in one hop, instead of
 * adding a separate non-www -> www hop after the content redirect.
 *
 * SAFETY: In next.config.js this ONLY rewrites destinations inside the redirects()
 * block. The rewrites() block (e.g. /track-your-order -> /410, which produces a
 * true HTTP 410) and the headers() block are left untouched, because a rewrite to
 * an absolute URL becomes an external proxy and would break the 410-Gone handling.
 * redirects-from-csv.js is 100% redirect rules, so it is transformed globally.
 */
const fs = require('fs');
const BASE = 'https://www.samanportable.com';

function makeAbsolute(text) {
  let count = 0;
  const out = text.replace(
    /destination:\s*(['"])(\/[^'"]*)\1/g,
    (match, quote, path) => {
      if (path.startsWith('http')) return match; // already absolute — skip
      count++;
      return `destination: ${quote}${BASE}${path}${quote}`;
    }
  );
  return { out, count };
}

// 1) redirects-from-csv.js — entire file is the csvRedirects array, safe to transform globally
let csv = fs.readFileSync('redirects-from-csv.js', 'utf8');
const csvRes = makeAbsolute(csv);
fs.writeFileSync('redirects-from-csv.js', csvRes.out, 'utf8');
console.log(`redirects-from-csv.js updated: ${csvRes.count} destinations made absolute`);

// 2) next.config.js — ONLY transform inside redirects(); never touch rewrites()/headers()
let config = fs.readFileSync('next.config.js', 'utf8');
const startMarker = 'async redirects() {';
const endMarker = 'async rewrites() {';
const start = config.indexOf(startMarker);
const end = config.indexOf(endMarker);
if (start === -1 || end === -1 || end <= start) {
  throw new Error('Could not locate redirects() block boundaries — aborting to avoid touching rewrites().');
}
const before = config.slice(0, start);
const redirectsBlock = config.slice(start, end);
const after = config.slice(end); // rewrites() + headers() — left untouched
const cfgRes = makeAbsolute(redirectsBlock);
fs.writeFileSync('next.config.js', before + cfgRes.out + after, 'utf8');
console.log(`next.config.js updated: ${cfgRes.count} destinations made absolute (inside redirects() only; rewrites()/headers() untouched)`);
