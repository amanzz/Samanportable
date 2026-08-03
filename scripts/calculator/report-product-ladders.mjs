import { failIfDiffs, inr, readJson, readText } from './common.mjs';

const labourFiles = [
  'labor-colony.json',
  'labor-sheds.json',
  'labor-hutments.json',
  'prefab-labor-camps.json',
];
const labourDiffs = [];

console.log('LABOUR-COLONY LIVE DATASET COMPARISON');
for (const file of labourFiles) {
  const product = readJson('src', 'data', 'products', file);
  const rates = new Set();
  console.log(`\n${product.productName} (${file})`);
  console.log('configuration | built-up area | workers | published ex-GST | flat rate');
  for (const variant of product.variants) {
    const rate = variant.priceExGst / variant.areaSqft;
    rates.add(rate);
    console.log(`${variant.label} | ${variant.areaSqft} sq ft | ${variant.capacity} | ${inr(variant.priceExGst)} | Rs ${rate}/sq ft`);
    const expectedRow = `<tr><td>${variant.label}</td><td>${variant.areaSqft.toLocaleString('en-IN')} sq ft</td><td>${variant.capacity.replace(' workers', '')}</td><td>${inr(variant.priceExGst)}</td></tr>`;
    if (!product.descriptionHtml.includes(expectedRow)) labourDiffs.push(`${file} ${variant.label}: rendered price-table row differs from variants dataset`);
  }
  if (rates.size !== 1) labourDiffs.push(`${file}: expected one flat rate, found ${[...rates].join(', ')}`);
}
console.log('');
failIfDiffs('labour dataset-versus-live-page', labourDiffs);

const sources = {
  'container-offices': readJson('src', 'data', 'products', 'container-offices.json').variants,
  'container-office-cabin': readJson('src', 'data', 'products', 'container-office-cabin.json').variants,
  'shipping-container-office': readJson('src', 'data', 'products', 'shipping-container-office.json').variants,
};
const sourceRateAt200 = Object.fromEntries(Object.entries(sources).map(([name, variants]) => [name, variants.find((item) => item.areaSqft === 200).priceExGst / 200]));
const lowest = Object.entries(sourceRateAt200).sort((a, b) => a[1] - b[1])[0][0];
const highest = Object.entries(sourceRateAt200).sort((a, b) => b[1] - a[1])[0][0];
const mappings = [
  ['container-houses', 'container-offices', 1.15],
  ['prefab-container-homes', 'container-office-cabin', 1.15],
  ['shipping-container-homes', 'shipping-container-office', 1.15],
  ['affordable-container-homes', lowest, 1.15],
  ['luxury-container-houses', highest, 1.20],
];
const ladderDiffs = [];

console.log('\nCONTAINER-HOUSE DERIVED LADDERS');
console.log(`lowest source ladder: ${lowest} (${sourceRateAt200[lowest]}/sq ft at 200 sq ft)`);
console.log(`highest source ladder: ${highest} (${sourceRateAt200[highest]}/sq ft at 200 sq ft)`);
for (const [product, source, uplift] of mappings) {
  const variants = sources[source];
  console.log(`\n${product} <- ${source} +${Math.round((uplift - 1) * 100)}%`);
  console.log('size | area | source rate | rounded house rate | house price ex-GST');
  for (const variant of variants) {
    const sourceRate = variant.priceExGst / variant.areaSqft;
    const roundedRate = Math.round(sourceRate * uplift);
    const price = roundedRate * variant.areaSqft;
    console.log(`${variant.label} | ${variant.areaSqft} | ${sourceRate} | ${roundedRate} | ${inr(price)}`);
  }
  // SUPERSEDED (Fable 5, 03 Aug 2026): this used to assert that
  // calculatorRates.ts computed the house ladders at runtime as
  // `Math.round(rate * uplift) * area`. That mapping is now forbidden — the
  // approved values are stored in src/lib/calculatorLadders.ts and the runtime
  // derivation is gone, because a published price must not depend on a
  // floating-point rounding tie. Exactness of the stored values is asserted by
  // scripts/calculator/verify-route-price-identity.mjs instead. The block above
  // stays as a report of how the values were originally derived.
}
console.log('');
failIfDiffs('container-house mapping', ladderDiffs);
