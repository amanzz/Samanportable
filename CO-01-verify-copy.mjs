#!/usr/bin/env node
/**
 * CO-01 Shipping Container Office - build verification script
 * SAMAN Page Build Process v3.1, Section 7.
 *
 * Node 18+, no dependencies.
 *   node CO-01-verify-copy.mjs http://localhost:3000/product/container-offices/shipping-container-office
 *
 * Exit code 0 is the only acceptable result. Do not edit this script or the
 * copy pack to make it pass. If a check looks wrong, report it.
 */

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const PACK_PATH = process.env.CO01_PACK || './CO-01-copy-pack-v2.json';
const url = process.argv[2];
if (!url) {
  console.error('usage: node CO-01-verify-copy.mjs <rendered page url>');
  process.exit(2);
}

const pack = JSON.parse(readFileSync(PACK_PATH, 'utf8'));
const additions = JSON.parse(readFileSync('./CO-01-copy-pack-v2.2-additions.json', 'utf8'));

let failures = 0;
const ok = (m) => console.log(`  PASS  ${m}`);
const bad = (m) => { failures++; console.log(`  FAIL  ${m}`); };

const html = await (await fetch(url)).text();

/* ------------------------------------------------------------------ text */
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  '&apos;': "'", '&nbsp;': ' ', '&rsquo;': '\u2019', '&ldquo;': '"', '&rdquo;': '"' };

function decode(s) {
  return s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
          .replace(/&[a-z]+;|&#39;/gi, (e) => (e in ENT ? ENT[e] : e));
}
function textOf(h) {
  return decode(h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                 .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                 .replace(/<[^>]+>/g, ' '))
         .replace(/\s+/g, ' ').trim();
}
const norm = (s) => decode(s).replace(/\s+/g, ' ').trim();
const PAGE = textOf(html);

/* -------------------------------------------------------- 1. copy fields */
console.log('\n1. APPROVED COPY PRESENT IN THE RENDERED PAGE');

const PROSE_FIELDS = [
  'h1', 'hero_paragraph_1', 'hero_paragraph_2', 'pdf_label',
  'section2_h2', 'section2_paragraph_1', 'section2_paragraph_2',
  'variant_20x8_h2', 'variant_20x8_body', 'variant_20x10_h2', 'variant_20x10_body',
  'variant_20x12_h2', 'variant_20x12_body', 'variant_30x10_h2', 'variant_30x10_body',
  'variant_40x8_h2', 'variant_40x8_body', 'variant_40x10_h2', 'variant_40x10_body',
  'specifications_narrative',
];

for (const key of PROSE_FIELDS) {
  const f = pack.fields[key];
  const digest = createHash('sha256').update(f.text, 'utf8').digest('hex').toUpperCase();
  if (digest !== f.sha256) { bad(`${key}: copy pack is corrupt, hash mismatch`); continue; }
  // markdown links in the pack become anchors on the page; compare on link text
  const plain = norm(f.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
  if (PAGE.includes(plain)) ok(`${key} (${f.characters} chars, ${f.sha256.slice(0, 16)})`);
  else bad(`${key} NOT FOUND in the rendered page. Expected: "${plain.slice(0, 90)}..."`);
}

console.log('\n1B. V2.2 PAGE-SHAPE ADDITIONS');
for (const [key, f] of Object.entries(additions)) {
  const digest = createHash('sha256').update(f.text, 'utf8').digest('hex').toUpperCase();
  if (digest !== f.sha256) { bad(`${key}: additions pack is corrupt, hash mismatch`); continue; }
  if (key.endsWith('_image_alt')) {
    html.includes(f.text)
      ? ok(`${key} (${f.characters} chars, ${f.sha256.slice(0, 16)})`)
      : bad(`${key} NOT FOUND in rendered HTML alt attributes. Expected: "${f.text.slice(0, 90)}..."`);
    continue;
  }
  const lines = f.text.split(/\n+/).map((line) => norm(line)).filter((line) => line.length >= 12);
  const missing = lines.filter((line) => !PAGE.includes(line));
  missing.length === 0
    ? ok(`${key} (${f.characters} chars, ${f.sha256.slice(0, 16)})`)
    : bad(`${key} NOT FOUND in rendered page. Missing: "${missing[0].slice(0, 90)}..."`);
}

/* Description tab: every paragraph, heading and FAQ line must be present */
console.log('\n2. DESCRIPTION TAB, PARAGRAPH BY PARAGRAPH');
const descField = pack.fields.description_tab;
const descDigest = createHash('sha256').update(descField.text, 'utf8').digest('hex').toUpperCase();
if (descDigest !== descField.sha256) bad('description_tab: copy pack is corrupt, hash mismatch');
const blocks = descField.text.split(/\n\n+/)
  .map((b) => b.trim())
  .filter((b) => b && !/^IMAGE_\d+$/.test(b));
let missing = 0;
for (const b of blocks) {
  const plain = norm(b.replace(/^#{2,3}\s+/gm, '')
                      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                      .replace(/\*\*/g, '')
                      .replace(/^- /gm, ''));
  const probe = plain.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of probe) {
    if (line.length < 12) continue;
    if (!PAGE.includes(line)) { missing++; if (missing <= 8) bad(`description block missing: "${line.slice(0, 90)}..."`); }
  }
}
if (missing === 0) ok(`all ${blocks.length} description blocks present (${descField.sha256.slice(0, 16)})`);
else bad(`${missing} description lines missing in total`);

/* ------------------------------------------------------------ 3. head */
console.log('\n3. HEAD AND HEADINGS');
const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
norm(title || '') === pack.fields.seo_title.text
  ? ok(`<title> exact (${pack.fields.seo_title.characters} chars)`)
  : bad(`<title> is "${norm(title || '')}", expected "${pack.fields.seo_title.text}"`);

const meta = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) || [])[1];
norm(meta || '') === pack.fields.meta_description.text
  ? ok(`meta description exact (${pack.fields.meta_description.characters} chars)`)
  : bad(`meta description is "${norm(meta || '')}"`);

const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1];
canon === pack.fields.canonical.text
  ? ok('canonical exact and self-referencing')
  : bad(`canonical is "${canon}", expected "${pack.fields.canonical.text}"`);

const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => norm(textOf(m[1])));
h1s.length === 1 ? ok('exactly one H1') : bad(`${h1s.length} H1 elements found`);
h1s[0] === pack.fields.h1.text ? ok('H1 text exact') : bad(`H1 is "${h1s[0]}"`);

/* ---------------------------------------------------------- 4. prices */
console.log('\n4. PRICE LADDER');
const digits = PAGE.replace(/[,\s]/g, '');
for (const p of pack.prices) {
  const grouped = p.ex_gst.toLocaleString('en-IN');
  (digits.includes(String(p.ex_gst)) || PAGE.includes(grouped))
    ? ok(`${p.size} ex-GST ${grouped} present`)
    : bad(`${p.size} ex-GST ${grouped} NOT on the page`);
}
/* Withdrawn sizes must not appear in template surfaces: the size selector,
   the price ladder, the schema, the size anchors. They may legitimately
   appear inside approved prose as a room dimension, for example the
   "true 10 x 10 ft room" inside variant_40x10_body. Approved copy is already
   hash-verified in section 1, so remove it before scanning. */
let RESIDUAL = ' ' + PAGE + ' ';
for (const f of [...Object.values(pack.fields), ...Object.values(additions)]) {
  const markdownFree = f.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '');
  RESIDUAL = RESIDUAL.split(norm(markdownFree)).join(' ');
  for (const line of markdownFree.split(/\n+/)) {
    const t = norm(line);
    if (t.length < 12) continue;
    RESIDUAL = RESIDUAL.split(t).join(' ');
  }
}
for (const s of pack.withdrawn_sizes) {
  new RegExp(`\\b${s.replace('x', '\\s*[x\u00d7]\\s*')}\\b`, 'i').test(RESIDUAL)
    ? bad(`withdrawn size ${s} present outside approved copy (selector, ladder, schema or anchor)`)
    : ok(`withdrawn size ${s} absent from template surfaces`);
}
const APPROVED_SIZES = pack.prices.map((p) => p.size);
for (const s of APPROVED_SIZES) {
  new RegExp(`\\b${s.replace('x', '\\s*[x\u00d7]\\s*')}\\b`, 'i').test(PAGE)
    ? ok(`approved size ${s} present`)
    : bad(`approved size ${s} missing from the page`);
}
console.log(`  NOTE  size selector must expose exactly ${APPROVED_SIZES.length} options: ${APPROVED_SIZES.join(', ')}`);

/* ------------------------------------------------------- 5. forbidden */
console.log('\n5. FORBIDDEN CLAIMS AND BANNED WRITING');
for (const s of pack.forbidden_strings) {
  PAGE.toLowerCase().includes(s.toLowerCase()) ? bad(`forbidden string present: ${s}`) : ok(`absent: ${s}`);
}
for (const b of ['fireproof', 'earthquake-proof', 'maintenance-free', 'waterproof', 'eco-friendly']) {
  PAGE.toLowerCase().includes(b) ? bad(`banned absolute present: ${b}`) : ok(`absent: ${b}`);
}
/(\u2014|\u2013)/.test(PAGE) ? bad('em or en dash present in rendered copy') : ok('no em or en dashes');

/* ----------------------------------------------------------- 6. assets */
console.log('\n6. ASSET MAP');
const SIZES = ['20x8', '20x10', '20x12', '30x10', '40x8', '40x10'];
const GALLERY_SLOTS = [
  '01-shipping-container-office-front-exterior',
  '02-shipping-container-office-rear-exterior',
  '03-shipping-container-office-corner-exterior',
  '04-shipping-container-office-workstation-interior',
  '05-shipping-container-office-aisle-interior',
  null, // slot 6 differs by size
];
let gallery = 0;
for (const size of SIZES) {
  const slot6 = (size === '40x8' || size === '40x10')
    ? '06-shipping-container-office-manager-interior'
    : '06-shipping-container-office-entrance-interior';
  const slots = [...GALLERY_SLOTS.slice(0, 5), slot6];
  let found = 0;
  for (const slot of slots) {
    const re = new RegExp(`size-${size}[^"')\\s]*${slot}`, 'i');
    if (re.test(html)) found++;
  }
  found === 6 ? ok(`gallery ${size}: 6 of 6 images referenced`) : bad(`gallery ${size}: only ${found} of 6 referenced`);
  gallery += found;
}
gallery === 36 ? ok('36 gallery images referenced in total') : bad(`${gallery} gallery images referenced, expected 36`);

for (const size of SIZES) {
  new RegExp(`shipping-container-office-${size}x8-5-premium-ga-specification-board-v1`, 'i').test(html)
    ? ok(`GA board ${size} referenced in its size section`)
    : bad(`GA board ${size} NOT referenced`);
}
const previewToken = 'website-preview-' + '489x374';
html.includes(previewToken)
  ? bad(`GA references include ${previewToken}; master PNG required`)
  : ok(`GA references use master drawings, no ${previewToken}`);

/07-shipping-container-office-hero-exterior\.png/i.test(html)
  ? ok('1:1 image before the calculator referenced')
  : bad('the 1:1 pre-calculator image is not referenced');

const DESC = [
  '01-shipping-container-office-20x8-exterior.webp',
  '02-shipping-container-office-20x10-workstations.webp',
  '04-shipping-container-office-30x10-workstations.webp',
  '05-shipping-container-office-40x8-exterior.webp',
  '06-shipping-container-office-40x10-teamroom.webp',
];
for (const f of DESC) html.includes(f) ? ok(`description image ${f}`) : bad(`description image missing: ${f}`);
const section2ImageRefs = (html.match(/03-shipping-container-office-20x12-exterior\.webp/g) || []).length;
section2ImageRefs === 1
  ? ok('section 2 image 03-shipping-container-office-20x12-exterior.webp referenced exactly once')
  : bad(`section 2 image 03 referenced ${section2ImageRefs} times, expected exactly once`);

for (const d of ['01-container-office-opening-reinforcement-diagram',
                 '02-container-office-electrical-ventilation-diagram']) {
  html.includes(d) ? ok(`diagram ${d}`) : bad(`diagram missing: ${d}`);
}
/saman-shipping-container-office-technical-specification-and-ga-v1\.pdf/i.test(html)
  ? ok('technical PDF download control present and enabled')
  : bad('technical PDF download control missing');

console.log('\n6B. SECTION 3 SHAPE');
const EXPECTED_BULLETS = { '20x8': 6, '20x10': 6, '20x12': 5, '30x10': 6, '40x8': 6, '40x10': 5 };
for (const size of SIZES) {
  const panel = (html.match(new RegExp(`<div[^>]+id=["']app-panel-${size}["'][\\s\\S]*?(?=<div[^>]+id=["']app-panel-|</section>)`, 'i')) || [])[0] || '';
  const paragraphCount = (panel.match(/<p\b[^>]*class=["'][^"']*leading-relaxed[^"']*text-\[var\(--ds-color-steel\)\][^"']*["']/g) || []).length;
  paragraphCount === 2 ? ok(`size ${size} renders two prose paragraphs`) : bad(`size ${size} renders ${paragraphCount} prose paragraphs, expected 2`);
  const liCount = (panel.match(/<li\b/g) || []).length;
  liCount === EXPECTED_BULLETS[size] ? ok(`size ${size} renders ${liCount} list items`) : bad(`size ${size} renders ${liCount} list items, expected ${EXPECTED_BULLETS[size]}`);
}

/* ----------------------------------------------------- 7. alt coverage */
console.log('\n7. IMAGE ALT COVERAGE');
const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const noAlt = imgs.filter((t) => !/\balt\s*=\s*["'][^"']{3,}["']/i.test(t));
noAlt.length === 0 ? ok(`${imgs.length} <img> elements, all carry alt text`) : bad(`${noAlt.length} <img> elements have no usable alt`);
const longAlt = [...html.matchAll(/\balt\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]).filter((a) => a.length >= 125);
longAlt.length === 0 ? ok('every alt is under 125 characters') : bad(`${longAlt.length} alt strings are 125 characters or longer`);

/* ---------------------------------------------------------- 8. links */
console.log('\n8. INTERNAL LINKS');
const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);
const railCards = [...html.matchAll(/<a\b[^>]*data-related-product-rail-card=["']true["'][^>]*href=["']([^"']+)["'][\s\S]*?<\/a>/gi)];
const expectedRail = [
  'https://www.samanportable.com/product/container-offices',
  'https://www.samanportable.com/product/container-offices/container-office-cabin',
  'https://www.samanportable.com/product/container-offices/site-office-container',
];
const railHrefs = railCards.map((m) => m[1]);
railHrefs.length === 3 ? ok('Explore panel renders exactly three tiles') : bad(`Explore panel renders ${railHrefs.length} tiles, expected 3`);
for (const u of expectedRail) {
  const path = u.replace('https://www.samanportable.com', '');
  railHrefs.includes(u) || railHrefs.includes(path) ? ok(`Explore tile ${u}`) : bad(`Explore tile missing: ${u}`);
}
PAGE.includes('No related products') ? bad('No related products empty state is present') : ok('No related products empty state absent');
const LINKS = {
  'https://www.samanportable.com/product/container-offices': 2,
  'https://www.samanportable.com/contact': 2,
  'https://www.samanportable.com/product/container-offices/container-office-cabin': 2,
  'https://www.samanportable.com/product/container-offices/site-office-container': 2,
};
for (const [u, want] of Object.entries(LINKS)) {
  const path = u.replace('https://www.samanportable.com', '');
  const n = hrefs.filter((h) => h === u || h === path).length;
  n === want ? ok(`${u} linked ${want} time`) : bad(`${u} linked ${n} times, expected ${want}`);
  const res = await fetch(u, { redirect: 'manual' }).catch(() => null);
  res && res.status === 200 ? ok(`  ${u} returns 200 with no redirect`) : bad(`  ${u} returned ${res ? res.status : 'no response'}`);
}

/* ---------------------------------------------------------- verdict */
console.log('\n' + '='.repeat(64));
if (failures === 0) {
  console.log('CO-01 BUILD VERIFICATION: PASS. Open the PR and supply the preview link.');
  process.exit(0);
}
console.log(`CO-01 BUILD VERIFICATION: FAIL, ${failures} check(s) failed. Do not update the PR.`);
process.exit(1);

