#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const fail = (message) => { throw new Error(`PO_FAMILY_INVALID: ${message}`); };
const assert = (condition, message) => { if (!condition) fail(message); };

const sizes = ['10x10', '20x8', '20x10', '20x12', '30x10', '40x10'];
const retired = ['40x8', '20x20', '40x12'];
const occupancy = {
  '10x10': 'Recommended occupancy 2–3 people',
  '20x8': 'Recommended occupancy 3–4 people',
  '20x10': 'Recommended occupancy 4–6 people',
  '20x12': 'Recommended occupancy 5–7 people',
  '30x10': 'Recommended occupancy 6–8 people',
  '40x10': 'Recommended occupancy 8–10 people',
};
const prices = {
  'portable-office': [148500, 237600, 270000, 311040, 388800, 507600],
  'readymade-office-cabin': [141100, 225760, 256400, 295440, 369300, 482400],
};
const expectedTiles = {
  'portable-office': ['Readymade Office Cabin', 'Prefabricated Office Cabins', 'Small Office Cabin'],
  'readymade-office-cabin': ['Portable Office', 'Prefabricated Office Cabins', 'Small Office Cabin'],
};
const results = {};

for (const slug of Object.keys(prices)) {
  const relative = `src/data/products/${slug}.json`;
  const data = readJson(relative);
  const serialized = JSON.stringify(data);
  assert(data.variants.map((item) => item.sizeSlug).join('|') === sizes.join('|'), `${slug}: six-size order`);
  assert(data.variants.map((item) => item.priceExGst).join('|') === prices[slug].join('|'), `${slug}: ex-GST ladder`);
  assert(data.variants.every((item) => item.priceInclGst === Math.round(item.priceExGst * 1.18)), `${slug}: GST arithmetic`);
  assert(data.variants.every((item) => item.capacity === occupancy[item.sizeSlug]), `${slug}: PC-01 occupancy parity`);
  assert(data.variants.every((item) => !item.sku), `${slug}: no per-size SKU`);
  assert(data.suppressLegacySku && data.suppressReviewClaims && data.suppressAggregateRatingSchema, `${slug}: legacy commercial suppression`);
  assert(data.emitAggregateOffer && data.schemaIncludeVariantOffers, `${slug}: six-offer schema mode`);
  assert(data.hsn === '9406' && data.gstPercent === 18, `${slug}: tax identity`);
  assert(data.faqSchema?.mainEntity?.length === 6, `${slug}: six FAQ schema entries`);
  for (const faq of data.faqSchema.mainEntity) {
    assert(data.descriptionHtml.includes(faq.name), `${slug}: visible FAQ question parity`);
    assert(data.descriptionHtml.includes(faq.acceptedAnswer.text), `${slug}: visible FAQ answer parity`);
  }
  for (const value of retired) assert(!serialized.includes(value), `${slug}: retired size ${value}`);
  for (const value of ['635000', '425000', '445000', '8.6 ft']) assert(!serialized.includes(value), `${slug}: stale value ${value}`);
  for (const variant of data.variants) {
    assert(variant.images.length === 5, `${slug}/${variant.sizeSlug}: local gallery count`);
    for (const image of variant.images) {
      assert(image.src.startsWith('/images/products/'), `${slug}: local image URL`);
      assert(fs.existsSync(path.join(root, 'public', image.src)), `${slug}: missing image ${image.src}`);
      assert(image.provenance === 'render' && / render\.$/.test(image.alt), `${slug}: render provenance/alt`);
    }
  }
  assert(data.ymalTiles.map((item) => item.title).join('|') === expectedTiles[slug].join('|'), `${slug}: MT-32 destinations`);
  assert(data.ymalTiles.every((item) => fs.existsSync(path.join(root, 'public', item.imageSrc))), `${slug}: MT-32 destination images`);
  assert(data.descriptionHtml.includes('+91 88616 22859') && data.descriptionHtml.includes('+91 87960 39938'), `${slug}: zonal phones`);
  assert(!data.descriptionHtml.includes('Pan-India delivery'), `${slug}: unsupported delivery scope`);
  if (slug === 'portable-office') assert(data.suppressSchemaAvailability === false, 'PO-01 availability enabled');
  if (slug === 'readymade-office-cabin') {
    assert(data.suppressSchemaAvailability === true, 'PO-02 availability omitted');
    for (const claim of ['Ready to Dispatch', 'ready stock', 'held stock', '1–2-day', '1 to 2 working days']) {
      assert(!serialized.toLowerCase().includes(claim.toLowerCase()), `PO-02 unsupported claim ${claim}`);
    }
  }
  results[slug] = {
    variants: data.variants.length,
    lowPrice: Math.min(...prices[slug]),
    highPrice: Math.max(...prices[slug]),
    offerCount: data.variants.length,
    faqCount: data.faqSchema.mainEntity.length,
    images: data.variants.flatMap((item) => item.images).length,
  };
}

const applications = readJson('src/data/products/portable-office-applications.json');
assert(applications.panels.map((item) => item.sizeSlug).join('|') === sizes.join('|'), 'PO-01 explorer sizes');
const sectionH = readJson('src/data/products/section-h-datasets.json')['readymade-office-cabin'];
assert(sizes.every((size) => sectionH[size]) && retired.every((size) => !sectionH[size]), 'PO-02 explorer sizes');
const specs = readJson('src/data/products/specs-tab-dataset.json');
for (const slug of Object.keys(prices)) {
  const warranty = specs[slug].groups['Doors, Windows, Electrical & Services'].Warranty;
  assert(warranty.startsWith('Five-year structural warranty and one-year finishing warranty'), `${slug}: warranty`);
  assert(specs[slug].referenceSize.endsWith('8.5 ft'), `${slug}: 8.5 ft reference`);
}
for (const credential of [
  'saman-pos-iso-9001-2015-quality-management-certificate.pdf',
  'saman-pos-gst-karnataka-certificate.pdf',
  'saman-pos-gst-uttar-pradesh-greater-noida-certificate.pdf',
  'saman-pos-udyam-registration-certificate.pdf',
  'saman-pos-startup-india-recognition-certificate.pdf',
  'saman-pos-nsic-government-purchase-enlistment.pdf',
]) assert(fs.existsSync(path.join(root, 'public/certifications', credential)), `credential copy: ${credential}`);

console.log(JSON.stringify({ status: 'PASS', sizes, results }, null, 2));
