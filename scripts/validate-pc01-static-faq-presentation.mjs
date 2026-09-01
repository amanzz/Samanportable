import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PRESENTATION_MODE = 'STATIC_VISIBLE_BLOCKS';

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .trim();
}

export function validatePc01StaticFaq(root = ROOT) {
  const productPath = path.join(root, 'src/data/products/porta-cabins.json');
  const pagePath = path.join(root, 'src/pages/product/[category]/index.tsx');
  const productBefore = fs.readFileSync(productPath, 'utf8');
  const pageBefore = fs.readFileSync(pagePath, 'utf8');
  const product = JSON.parse(productBefore);
  const html = product.descriptionHtml;

  assert.equal(PRESENTATION_MODE, 'STATIC_VISIBLE_BLOCKS', 'FAQ presentation mode changed');
  assert.equal(typeof html, 'string', 'PC-01 server-rendered description HTML missing');
  assert.ok(!/<details\b/i.test(html), 'FAQ must not require disclosure interaction');
  assert.ok(!/<button\b/i.test(html), 'FAQ must not require a button click');
  assert.ok(!/accordion/i.test(html), 'FAQ UI was redesigned as an accordion');

  const visible = [...html.matchAll(/<h4\b[^>]*>([\s\S]*?)<\/h4>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => ({ question: decodeHtml(match[1]), answer: decodeHtml(match[2]) }));
  assert.equal(visible.length, 8, 'expected eight visible static FAQ question-answer pairs');
  assert.ok(visible.every((entry) => entry.question.endsWith('?')), 'FAQ question is not a semantic question heading');
  assert.ok(visible.every((entry) => entry.answer.length > 0), 'visible FAQ answer missing');

  const schemaText = JSON.stringify(product.faqSchema);
  assert.equal((schemaText.match(/"@type":"FAQPage"/g) || []).length, 1, 'expected exactly one FAQPage');
  assert.equal(product.faqSchema?.mainEntity?.length, 8, 'expected eight FAQPage entries');
  const schema = product.faqSchema.mainEntity.map((entry) => ({
    question: entry.name,
    answer: entry.acceptedAnswer?.text,
  }));
  assert.deepEqual(visible, schema, 'visible/schema FAQ parity changed');

  const allText = `${JSON.stringify(visible)}\n${schemaText}`;
  assert.ok(!/\b(?:rent|rental|hire)\b/i.test(allText), 'rental FAQ detected');
  assert.ok(!/\b(?:lorem|placeholder|filler|sample faq)\b/i.test(allText), 'filler FAQ detected');
  assert.ok(!/"@type":"(?:Review|AggregateRating)"/.test(schemaText), 'Review or AggregateRating is not authorized');

  for (const entry of visible) {
    assert.ok(html.includes(entry.question), `question absent from server HTML: ${entry.question}`);
    assert.ok(html.includes(entry.answer), `answer absent from server HTML: ${entry.question}`);
  }
  assert.match(pageBefore, /variantData\?\.faqSchema/, 'PC-01 FAQPage is not emitted by the server route');
  assert.match(pageBefore, /variantData\?\.descriptionHtml/, 'PC-01 visible FAQ source is not carried into server page props');

  assert.equal(fs.readFileSync(productPath, 'utf8'), productBefore, 'FAQ validator changed product data');
  assert.equal(fs.readFileSync(pagePath, 'utf8'), pageBefore, 'FAQ validator changed page source');
  return { presentationMode: PRESENTATION_MODE, visibleCount: visible.length, schemaCount: schema.length };
}

try {
  const result = validatePc01StaticFaq(ROOT);
  console.log('PC-01 static FAQ presentation validation: PASS');
  console.log(`Presentation: ${result.presentationMode}`);
  console.log(`Visible/schema pairs: ${result.visibleCount}/${result.schemaCount}`);
} catch (error) {
  console.error('PC-01 static FAQ presentation validation: FAIL');
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
}
