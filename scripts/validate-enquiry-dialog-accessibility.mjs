import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

const dialogPath = 'src/components/EnquiryDialog.tsx';
const before = read(dialogPath);
const contentCount = (before.match(/<DialogContent\b/g) || []).length;
const descriptionCount = (before.match(/<DialogDescription\b/g) || []).length;

assert.match(before, /DialogDescription/, 'DialogDescription primitive is not imported');
assert.equal(contentCount, 2, 'unexpected enquiry DialogContent state count');
assert.equal(descriptionCount, contentCount, 'each enquiry DialogContent must have a description');
assert.equal((before.match(/<DialogDescription className="sr-only">/g) || []).length, 2, 'dialog descriptions must be nonvisual');
assert.match(
  before,
  /Tell us your Porta Cabin requirement and contact details so the SAMAN team can respond with an itemised quotation\./,
  'required enquiry dialog description missing'
);

for (const contract of [
  'action="/api/enquiry"',
  "fetch('/api/enquiry'",
  'name="firstName"',
  'name="lastName"',
  'name="email"',
  'name="phone"',
  'name="region"',
  'name="message"',
  "'Send Enquiry'",
  'onSubmit={handleSubmit}',
]) {
  assert.ok(before.includes(contract), `enquiry form contract missing: ${contract}`);
}

const importers = [
  'src/components/Header.tsx',
  'src/components/product-variant-hero/PortaCabinVariantHero.tsx',
];
for (const importer of importers) {
  assert.match(read(importer), /EnquiryDialog/, `shared dialog importer missing: ${importer}`);
}
assert.match(before, /LabourColonyEnquiryDialog/, 'labour-colony delegation changed');
assert.equal(read(dialogPath), before, 'accessibility validator changed dialog source');

console.log('Enquiry dialog accessibility contract validation: PASS');
console.log(`Dialog descriptions: ${descriptionCount}/${contentCount}`);
console.log(`Shared importers checked: ${importers.length}; labour-colony delegation preserved`);
