#!/usr/bin/env node
/**
 * CO-07 Flat-Pack Container Office - build verification.
 *
 *   node scripts/verify-co-07.mjs <preview-url>
 *        [--pack ./CO-07-copy-pack-v1.json] [--hashes ./CO-07-copy-hashes-v1.1.json]
 *
 * Fetches the rendered page and fails if the approved copy, the assets, the counts
 * or the links are not present. Exit 0 means every check passed. Exit 1 means the
 * build does not match the ticket. Paste the full output into the PR.
 *
 * This script proves presence, not correctness of design. It never edits anything.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const url = process.argv[2];
if (!url) { console.error('usage: verify-co-07.mjs <preview-url> [--pack <path>]'); process.exit(2); }
const argOf = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const here = (f) => new URL(`./${f}`, import.meta.url).pathname;
const packPath = argOf('--pack', here('CO-07-copy-pack-v1.json'));
// The hash manifest is named explicitly. Do NOT derive it from the pack filename:
// the pack is still called v1 while the manifest is v1.1, and a void v1 manifest exists.
const hashPath = argOf('--hashes', here('CO-07-copy-hashes-v1.1.json'));

const packRaw = readFileSync(packPath);
const P = JSON.parse(packRaw.toString('utf8'));
const MAPPATH = argOf('--map', here('CO-07-output-filename-map-v1.2.json'));
let MAP = null;
try { MAP = JSON.parse(readFileSync(MAPPATH, 'utf8')); } catch { MAP = null; }
/** Output basename for a source path, per the rename rule. No supplied filename survives. */
const outBase = (src) => {
  const row = MAP && MAP.find(r => r.source === src);
  if (!row) return src.split('/').pop().replace(/\.(png|svg|pdf)$/, '');
  return row.output.split('/').pop().replace(/\.(webp|svg|jpg|pdf)$/, '');
};
const outPath = (src) => {
  const row = MAP && MAP.find(r => r.source === src);
  return row ? row.output : src;
};
const H = JSON.parse(readFileSync(hashPath, 'utf8'));

// ---- integrity gate. Nothing else runs until the inputs prove themselves. ----
{
  const packSha = createHash('sha256').update(packRaw).digest('hex');
  const problems = [];
  if (H.copy_pack_sha256 !== packSha)
    problems.push(`copy pack SHA-256 mismatch\n    manifest: ${H.copy_pack_sha256}\n    on disk : ${packSha}`);
  if (H.copy_pack_version !== P.version)
    problems.push(`version mismatch: manifest says ${H.copy_pack_version}, pack says ${P.version}`);
  if (P.version !== 'v1.1')
    problems.push(`this script builds against copy pack v1.1, found ${P.version}`);
  if (!P.s2_card)
    problems.push('copy pack has no s2_card. That is the superseded v1 pack. Do not build from it.');
  if (problems.length) {
    console.error('FATAL: input files failed the integrity gate.\n');
    problems.forEach(p => console.error(`  - ${p}`));
    console.error(`\n  pack    : ${packPath}\n  manifest: ${hashPath}`);
    console.error('\nUse CO-07-copy-hashes-v1.1.json. CO-07-copy-hashes-v1.json is void.');
    process.exit(2);
  }
  console.log(`integrity gate: pack ${P.version} sha256 ${packSha} matches ${hashPath.split('/').pop()}`);
}

let pass = 0, fail = 0;
const failures = [];
const ok  = (m) => { pass++; console.log(`  PASS  ${m}`); };
const bad = (m) => { fail++; failures.push(m); console.log(`  FAIL  ${m}`); };
const check = (cond, m) => cond ? ok(m) : bad(m);
const section = (t) => console.log(`\n== ${t} ==`);

const res = await fetch(url, { redirect: 'follow' });
if (!res.ok) { console.error(`FATAL: ${url} returned ${res.status}`); process.exit(1); }
if (res.redirected) console.log(`NOTE: followed a redirect to ${res.url}`);
const html = await res.text();

const allImgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
const imgTagsEarly = () => allImgTags;

// visible text: strip script/style, then tags, then collapse whitespace
const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ').trim();
const norm = (s) => s
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/\s+/g, ' ').trim();
const has = (s) => text.includes(norm(s));

// ---------------------------------------------------------------- metadata
section('Metadata');
check(new RegExp(`<title>\\s*${P.seo_title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</title>`, 'i').test(html),
      `SEO title exact: ${P.seo_title}`);
check(html.includes(`content="${P.meta_description}"`) || html.includes(`content='${P.meta_description}'`),
      'meta description exact');
check(html.includes(`rel="canonical"`) && html.includes(P.canonical), `canonical is ${P.canonical}`);
const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
check(h1s.length === 1, `exactly one H1 on the page (found ${h1s.length})`);
check(h1s.length === 1 && norm(h1s[0][1].replace(/<[^>]+>/g, '')) === P.h1, `H1 exact: ${P.h1}`);
P.breadcrumb.forEach(b => check(has(b), `breadcrumb crumb present: ${b}`));

// ---------------------------------------------------------------- copy
section('Approved copy, rendered verbatim');
P.short_description.split('\n\n').forEach((p, i) =>
  check(has(p), `hero short description paragraph ${i + 1}`));
P.hero_table.forEach(r => check(has(r[0]) && has(r[1]), `hero table row: ${r[0]}`));
check(has(P.s2_h2), 'Section 2 H2');
P.s2_paragraphs.forEach((p, i) => check(has(p), `Section 2 paragraph ${i + 1}`));
check(has(P.s2_cta_text), 'Section 2 block 1 CTA text');

section('Section 2 split card, mandatory on every page');
const C = P.s2_card;
check(has(C.h3), `card H3 present: ${C.h3}`);
check(has(C.paragraph), 'card paragraph present');
C.bullets.forEach((b, i) => check(has(b), `card bullet ${i + 1}: ${b}`));
check(has(C.cta_text), 'card CTA text present');
check(html.includes(C.cta_url) || html.includes('/contact'), 'card CTA points at /contact');
{
  const base = outBase(C.image);
  const t = imgTagsEarly().find(x => (x.match(/\bsrc="([^"]+)"/i) || [, ''])[1].includes(outPath(C.image)));
  check(!!t, `card image rendered: ${base}`);
  if (t) {
    check(((t.match(/\balt="([^"]*)"/i) || [, ''])[1]) === C.image_alt, 'card image alt exact');
    check(!/width="1254"/.test(t), 'card image is the 16:9 scene, not a square gallery crop');
  }
  const others = [...Object.values(P.gallery).flat().map(g => g.file), ...P.description_images.map(d => d.file), P.calc_entry_band.source];
  check(!others.includes(C.image), 'card image is not reused from another slot on this page');
}
P.variants.forEach(v => {
  check(has(v.h2), `Section 3 ${v.size} H2`);
  v.paragraphs.forEach(p => check(has(p), `Section 3 ${v.size} body`));
  v.bullets.forEach((b, i) => check(has(b), `Section 3 ${v.size} bullet ${i + 1}`));
  check(v.bullets.length >= 5 && v.bullets.length <= 6, `Section 3 ${v.size} has 5 or 6 bullets`);
});
P.description_blocks.forEach((b, i) => check(has(b), `Description block ${i + 1} of ${P.description_blocks.length}`));
P.description_outline.forEach(([lvl, t]) => check(has(t), `Description heading: ${t}`));
P.spec_narratives.forEach((n, i) => check(has(n), `Specification narrative ${i + 1}`));
P.spec_tables.forEach((t, ti) => {
  check(has(t.title), `spec table ${ti + 1} title`);
  check(t.rows.length === (ti === 0 ? 14 : 16), `spec table ${ti + 1} row count`);
  t.rows.forEach(r => check(has(r.component), `spec table ${ti + 1} row: ${r.component}`));
});

// ---------------------------------------------------------------- assets
section('Assets');
const imgTags = allImgTags;
const srcOf = (t) => (t.match(/\bsrc="([^"]+)"/i) || [, ''])[1];
const altOf = (t) => (t.match(/\balt="([^"]*)"/i) || [, null])[1];
const gallery = Object.values(P.gallery).flat();
check(gallery.length === 36, `copy pack declares 36 gallery images (${gallery.length})`);
gallery.forEach(g => {
  const base = outBase(g.file);
  const t = imgTags.find(x => srcOf(x).includes(outPath(g.file)));
  check(!!t, `gallery image rendered: ${base}`);
  if (t) {
    check(altOf(t) === g.alt, `gallery alt exact: ${base}`);
    check(/\bwidth="1254"/.test(t) && /\bheight="1254"/.test(t), `gallery width/height 1254: ${base}`);
  }
});
Object.entries(P.ga_boards).forEach(([size, g]) => {
  const base = outBase(g.file);
  check(html.includes(outPath(g.file)), `GA board rendered inside the ${size} section: ${base}`);
  check(html.includes(g.alt), `GA board alt exact: ${size}`);
});
check(P.description_images.length >= 4 && P.description_images.length <= 6,
      `Description tab carries 4 to 6 images (${P.description_images.length}) after the card reallocation`);
P.description_images.forEach(i => {
  const base = outBase(i.file);
  const t = imgTags.find(x => srcOf(x).includes(outPath(i.file)));
  check(!!t, `Description image rendered: ${base}`);
  if (t) check(altOf(t) === i.alt, `Description image alt exact: ${base}`);
});
P.diagrams.forEach(d => {
  const base = outBase(d.file);
  check(html.includes(outPath(d.file)), `diagram rendered: ${base}`);
  check(html.includes(d.alt), `diagram alt exact: ${base}`);
});
check(html.includes(P.technical_pdf.file) || /flat-pack-container-office-technical-specification/.test(html),
      'technical PDF download present');

// alt hygiene
const alts = imgTags.map(altOf).filter(a => a !== null);
check(alts.every(a => a.trim().length > 0), 'no empty alt attribute on any img');
check(alts.every(a => a.length < 125), 'every alt under 125 characters');
check(new Set(alts).size === alts.length, `no duplicate alt strings (${alts.length} images, ${new Set(alts).size} unique)`);

// ---------------------------------------------------------------- calc band
section('Calculator entry band');
const band = (html.match(/<section[^>]*class="[^"]*calc-entry[^"]*"[\s\S]*?<\/section>/i) || [''])[0];
check(!!band, 'section.calc-entry present');
check(/flat-pack-container-office-calculator-band/.test(band), 'band photograph swapped to this page asset');
check(band.includes(P.calc_entry_band.alt), 'band alt exact');
check(band.includes('width="1926"') && band.includes('height="817"'), 'band width 1926 and height 817 unchanged');
check(band.includes(P.calc_entry_band.eyebrow), 'band eyebrow unchanged');
check(band.includes(P.calc_entry_band.subheading), 'band subheading unchanged');
check(band.includes(P.calc_entry_band.cta), 'band button unchanged');
check(has(P.calc_entry_band.headline), 'band headline carries this page from-price');
check(!/1080["\s]/.test(band), 'band asset is not a 1:1 crop');
const between = html.split(/<section[^>]*class="[^"]*calc-entry/i)[0].split(/<\/section>/i).pop() || '';
check(!/<img\b/i.test(between), 'no standalone image block inserted above the calc-entry band');

// ---------------------------------------------------------------- prices
section('Price ladder');
const PRICES = [['10x8','1,91,520','2,25,994'],['20x8','3,34,400','3,94,592'],['20x10','3,80,000','4,48,400'],
                ['30x10','5,47,200','6,45,696'],['40x10','7,22,000','8,51,960'],['40x20','13,83,200','16,32,176']];
PRICES.forEach(([s, ex, inc]) => {
  check(text.includes(ex), `${s} ex-GST price present: Rs ${ex}`);
  check(text.includes(inc), `${s} incl-GST price present: Rs ${inc}`);
});

// ---------------------------------------------------------------- links
section('Internal links');
for (const l of P.link_ledger) {
  const path = l.destination.replace('https://www.samanportable.com', '');
  const re = new RegExp(`<a\\b[^>]*href="(?:https://www\\.samanportable\\.com)?${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?"[^>]*>([\\s\\S]*?)</a>`, 'i');
  const m = html.match(re);
  check(!!m, `link present: ${path}`);
  if (m) check(norm(m[1].replace(/<[^>]+>/g, '')) === l.anchor, `anchor exact for ${path}: ${l.anchor}`);
  const r = await fetch(l.destination, { method: 'GET', redirect: 'manual' });
  check(r.status === 200, `${path} returns 200 with no redirect (got ${r.status})`);
}
const contactCount = (html.match(/href="(?:https:\/\/www\.samanportable\.com)?\/contact\/?"/gi) || []).length;
check(contactCount === 2, `contact URL used exactly twice, block 1 CTA and card CTA (found ${contactCount})`);
check(P.link_ledger.filter(l => l.destination.endsWith('/contact')).length === 1,
      'contact appears once in the internal-link map, per the split-card rule');
const DEAD = ['bess-container','containerized-data-center','container-marketing-office',
              'multi-story-container-office','expandable-container-office','flat-pack-container-homes'];
const hrefs = [...html.matchAll(/\bhref="([^"]+)"/gi)].map(m => m[1]);
DEAD.forEach(d => check(!hrefs.some(h => new RegExp(`(^|/)${d}/?$`).test(h.split('?')[0].split('#')[0])),
                        `no link to the 404 sibling ${d}`));
const OUT_OF_PLAN = ['container-portable-office','container-site-office','portable-container-offices',
  'prefabricated-container-office','modular-container-office','cargo-container-office',
  'mobile-office-container','storage-container-office','modular-shipping-container-office',
  'mobile-container-office','construction-site-office'];
OUT_OF_PLAN.forEach(d => check(!hrefs.some(h => new RegExp(`(^|/)${d}/?$`).test(h.split('?')[0].split('#')[0])),
                        `no link to the out-of-plan URL ${d}`));

// ---------------------------------------------------------------- prohibitions
section('Prohibitions');
{
  const supplied = new Set();
  Object.values(P.gallery).flat().forEach(g => supplied.add(g.file.split('/').pop()));
  Object.values(P.ga_boards).forEach(g => { supplied.add(g.file.split('/').pop()); supplied.add(g.svg.split('/').pop()); });
  P.description_images.forEach(i => supplied.add(i.file.split('/').pop()));
  P.diagrams.forEach(d => { supplied.add(d.file.split('/').pop()); supplied.add(d.svg.split('/').pop()); });
  supplied.add(C.image.split('/').pop());
  supplied.add(P.calc_entry_band.source.split('/').pop());
  const leaked = [...supplied].filter(f => html.includes(f.replace(/\.(png|svg)$/, '')));
  check(leaked.length === 0,
        `no supplied source filename survives into the build (${leaked.length} leaked${leaked.length ? ': ' + leaked.slice(0,3).join(', ') : ''})`);
}
['available on request','Reference photographs','coming soon','contact us for','[DATA REQUIRED]',
 'TBD','lorem','fireproof','earthquake-proof','maintenance-free','waterproof','eco-friendly']
  .forEach(s => check(!text.toLowerCase().includes(s.toLowerCase()), `absent from rendered copy: "${s}"`));
check(!text.includes('\u2014') && !text.includes('\u2013'), 'zero em dashes and en dashes in rendered copy');
const emptyHeads = [...html.matchAll(/<h([1-6])[^>]*>\s*<\/h\1>/gi)];
check(emptyHeads.length === 0, `no empty H1 to H6 elements (found ${emptyHeads.length})`);
check(!/aggregateRating/i.test(html), 'no aggregateRating schema on a page with no reviews');
check(!/"@type"\s*:\s*"FAQPage"/i.test(html), 'no FAQPage schema, because no FAQ block ships in v1');

// ---------------------------------------------------------------- summary
console.log(`\n${'='.repeat(64)}`);
console.log(`CO-07 verification: ${pass} passed, ${fail} failed`);
console.log(`copy pack sha256 : ${H.copy_pack_sha256}`);
console.log(`preview url      : ${url}`);
if (fail) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  - ${f}`));
  console.log('\nRESULT: FAIL. Do not open the PR until every line above passes.');
  process.exit(1);
}
console.log('\nRESULT: PASS.');
process.exit(0);
