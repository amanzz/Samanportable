/**
 * CC-01 — visible/schema FAQ parity on /product/container-cafe.
 *
 * Why this exists. The page ships `descriptionHtml` and `faqSchema` from the same product
 * JSON, but they reach the browser by different routes: the Description tab is rendered
 * through `OptimizedContent` -> `normaliseHtml`, which applies the L20 punctuation policy
 * and rewrites " — " to a comma or a colon, while `faqSchema` is JSON.stringify-ed straight
 * into the FAQPage script and is never normalised. Storing the approved copy verbatim in
 * both therefore produced three answers whose visible and schema wording differed, and every
 * structural check still passed: the counts were right, the questions matched, and only a
 * byte comparison of the answers exposed it.
 *
 * So this asserts parity AFTER rendering, against a served page, rather than against the
 * source JSON. Fix a future failure by aligning the stored `faqSchema` text with what the
 * page renders — never by weakening the global L20 transform to make this page pass.
 *
 * Scope is deliberately one route and four assertions: visible count, schema count,
 * question equality, answer equality.
 *
 * Usage:  node scripts/validate-cc01-faq-parity.mjs [--base-url=http://127.0.0.1:3210]
 */

const baseUrl = (
  process.argv.find((value) => value.startsWith('--base-url='))?.slice('--base-url='.length)
  || process.env.CC01_FAQ_PARITY_BASE_URL
  || 'http://127.0.0.1:3210'
).replace(/\/$/, '');

const pathname = '/product/container-cafe';
const EXPECTED_ENTRIES = 3;
const failures = [];

/** Entity decode + tag strip, so visible DOM text is compared on the same footing as
 *  the schema's plain-text field. */
const toText = (html) => html
  .replace(/<[^>]+>/g, '')
  .replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, entity) => {
    if (entity[0] === '#') {
      const code = entity[1] === 'x' || entity[1] === 'X'
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
    return Object.prototype.hasOwnProperty.call(named, entity) ? named[entity] : whole;
  });

const response = await fetch(`${baseUrl}${pathname}`, { headers: { 'user-agent': 'cc01-faq-parity' } });
if (!response.ok) {
  console.error(`CC-01 FAQ parity: ${pathname} returned ${response.status} from ${baseUrl}`);
  console.error('Start a server first, e.g. `npx next start -p 3210`.');
  process.exit(1);
}
const html = await response.text();

// --- schema side -----------------------------------------------------------
const scripts = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1].trim());
let faqPage = null;
for (const block of scripts) {
  let parsed;
  try { parsed = JSON.parse(block); } catch { continue; }
  for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
    if (node && node['@type'] === 'FAQPage') faqPage = node;
  }
}
if (!faqPage) {
  failures.push('no FAQPage block found in the rendered page');
}
const schemaEntries = faqPage?.mainEntity ?? [];

// --- visible side ----------------------------------------------------------
const visible = [...html.matchAll(/<h4>([\s\S]*?)<\/h4>\s*<p>([\s\S]*?)<\/p>/g)]
  .map((match) => ({ question: toText(match[1]).trim(), answer: toText(match[2]).trim() }));

// --- the four assertions ---------------------------------------------------
if (visible.length !== EXPECTED_ENTRIES) {
  failures.push(`visible FAQ count is ${visible.length}, expected ${EXPECTED_ENTRIES}`);
}
if (schemaEntries.length !== EXPECTED_ENTRIES) {
  failures.push(`schema FAQ count is ${schemaEntries.length}, expected ${EXPECTED_ENTRIES}`);
}
const pairs = Math.min(visible.length, schemaEntries.length);
for (let index = 0; index < pairs; index += 1) {
  const shown = visible[index];
  const schemaQuestion = String(schemaEntries[index]?.name ?? '');
  const schemaAnswer = String(schemaEntries[index]?.acceptedAnswer?.text ?? '');
  if (shown.question !== schemaQuestion) {
    failures.push(
      `question ${index + 1} differs\n    visible: ${JSON.stringify(shown.question)}\n    schema : ${JSON.stringify(schemaQuestion)}`,
    );
  }
  if (shown.answer !== schemaAnswer) {
    const at = [...shown.answer].findIndex((character, position) => character !== schemaAnswer[position]);
    failures.push(
      `answer ${index + 1} differs at character ${at}\n`
      + `    visible: ${JSON.stringify(shown.answer.slice(Math.max(0, at - 40), at + 40))}\n`
      + `    schema : ${JSON.stringify(schemaAnswer.slice(Math.max(0, at - 40), at + 40))}`,
    );
  }
}

if (failures.length) {
  console.error('CC-01 FAQ parity validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(
  `CC-01 FAQ parity OK — ${visible.length} visible and ${schemaEntries.length} schema entries, `
  + 'questions and answers byte-identical after rendering.',
);
