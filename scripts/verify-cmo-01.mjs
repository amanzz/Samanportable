#!/usr/bin/env node
// CMO-01 Container Marketing Office - build verification.
// Usage: node scripts/verify-cmo-01.mjs <preview-url>
// Exit 0 only when every check passes.

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const URL_ = process.argv[2];
if (!URL_) { console.error('usage: verify-cmo-01.mjs <preview-url>'); process.exit(2); }

const pack = JSON.parse(await readFile('CMO-01-copy-pack-v1.json', 'utf8'));
const map  = JSON.parse(await readFile('CMO-01-asset-map-v1.json', 'utf8'));

const res  = await fetch(URL_, { redirect: 'follow' });
const html = await res.text();

let fails = 0;
const ok   = (m) => console.log('PASS  ' + m);
const bad  = (m) => { fails++; console.log('FAIL  ' + m); };
const sha  = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const strip = (s) => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .replace(/\s+([.,;:!?])/g, '$1')
  .trim();
const text = strip(html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' '));
const renderedCopyChecks = (key, value, path = []) => {
  if (typeof value === 'string') {
    if (value.length < 25) return [];
    const leaf = path[path.length - 1];
    if (leaf === 'why' || leaf === 'file' || leaf === 'title') return [];
    const needle = strip(value);
    return [{
      needle,
      surface: /^https?:\/\//.test(value) || leaf === 'alt' ? 'html' : 'text',
    }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => renderedCopyChecks(key, item, [...path, String(index)]));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([childKey, childValue]) =>
      renderedCopyChecks(key, childValue, [...path, childKey])
    );
  }
  return [];
};

// 1. HTTP and canonical
res.status === 200 ? ok('HTTP 200') : bad('HTTP ' + res.status);
const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [])[1];
canon === pack.canonical ? ok('canonical ' + canon) : bad('canonical is ' + canon + ', expected ' + pack.canonical);

// 2. One H1, exact text
const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => strip(m[1]));
h1s.length === 1 ? ok('exactly one H1') : bad('H1 count is ' + h1s.length);
h1s[0] === pack.fields['meta.h1'].value ? ok('H1 text exact') : bad('H1 text is "' + h1s[0] + '"');

// 3. Title and meta description
const title = strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
title === pack.fields['meta.seo_title'].value ? ok('SEO title exact') : bad('SEO title is "' + title + '"');
const md = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || [])[1];
md === pack.fields['meta.meta_description'].value ? ok('meta description exact') : bad('meta description mismatch');

// 4. Every copy field present verbatim, and its hash still matches the pack
for (const [key, field] of Object.entries(pack.fields)) {
  if (key.startsWith('meta.')) continue;
  const check = typeof field.value === 'string'
    ? sha(field.value) === field.sha256
    : sha(JSON.stringify(field.value)) === field.sha256;
  if (!check) bad('copy pack hash drifted for ' + key);
  for (const { needle, surface } of renderedCopyChecks(key, field.value)) {
    if (needle.length < 25) continue;
    const haystack = surface === 'html' ? html : text;
    if (!haystack.includes(needle)) { bad('missing copy: ' + key + ' -> "' + needle.slice(0, 70) + '..."'); break; }
  }
}
if (!fails) ok('all copy fields rendered verbatim');

// 5. Assets
const all = [...map.gallery, ...map.ga_boards, ...(map.pre_calculator.renditions || [map.pre_calculator]), ...map.description, ...map.diagrams];
let missingAssets = 0;
for (const a of all) if (!html.includes(a.out)) { missingAssets++; console.log('FAIL  missing asset ' + a.out); }
missingAssets === 0 ? ok(all.length + ' assets referenced') : fails += missingAssets;
map.gallery.length === 36 ? ok('36 gallery entries in the map') : bad('gallery map has ' + map.gallery.length);
html.includes(map.technical_pdf.out) ? ok('technical PDF linked') : bad('technical PDF not linked');

// 6. Alt text present and under 125 characters
for (const a of all) {
  if (!a.alt) continue;
  if (!html.includes(a.alt)) bad('missing alt for ' + a.out);
  if (a.alt.length >= 125) bad('alt too long for ' + a.out);
}

// 7. Internal links
const links = [
  'https://www.samanportable.com/product/container-offices',
  'https://www.samanportable.com/contact',
  'https://www.samanportable.com/product/container-offices/shipping-container-office',
  'https://www.samanportable.com/product/container-offices/site-office-container',
  'https://www.samanportable.com/product/container-offices/container-office-cabin',
];
for (const l of links) {
  html.includes('href="' + l + '"') ? ok('link present ' + l) : bad('link missing ' + l);
  const r = await fetch(l, { method: 'HEAD', redirect: 'manual' });
  r.status === 200 ? ok('200 ' + l) : bad(r.status + ' ' + l);
}
for (const dead of ['bess-container','containerized-data-center','multi-story-container-office','flat-pack-container-office','expandable-container-office'])
  html.includes(dead) ? bad('links to unpublished sibling ' + dead) : ok('no link to ' + dead);

// 8. Forbidden strings
for (const s of ['[DATA REQUIRED]','TODO','Lorem','aggregateRating','\u2014','\u2013'])
  html.includes(s) ? bad('forbidden string present: ' + s) : ok('absent: ' + s);

// 9. Tabs and calculator
for (const t of ['Description','Specifications','Shipping','Reviews'])
  text.includes(t) ? ok('tab ' + t) : bad('tab missing ' + t);
for (const p of ['3,34,400','5,77,600','11,18,720','16,41,600','21,88,800'])
  text.includes(p) ? ok('price row ' + p) : bad('price row missing ' + p);

console.log('---');
console.log(fails === 0 ? 'VERIFICATION PASSED' : fails + ' CHECK(S) FAILED');
process.exit(fails === 0 ? 0 : 1);
