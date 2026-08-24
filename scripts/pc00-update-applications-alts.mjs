import fs from 'node:fs';

const PATH = 'src/data/products/porta-cabins-applications.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

// Copy pack Part B5 - GA plan alt text, verbatim.
const GA_ALT = {
  '10x10': 'Approved 10x10 ft porta cabin GA plan: one door, three windows, four workstations, four seats',
  '20x8': 'Approved 20x8 ft porta cabin GA plan: one door, four windows, three workstations, three seats',
  '20x10': 'Approved 20x10 ft porta cabin GA plan: one door, six windows, five workstations, five seats',
  '20x12': 'Approved 20x12 ft porta cabin GA plan: one door, six windows, five workstations, wide central aisle',
  '30x10': 'Approved 30x10 ft porta cabin GA plan: two doors, eight windows, twelve workstations and seats',
  '40x10': 'Approved 40x10 ft porta cabin GA plan: manager cabin, partition, three doors, twelve workstations',
};

for (const panel of data.panels) {
  const alt = GA_ALT[panel.sizeSlug];
  if (!alt) throw new Error(`no GA alt for ${panel.sizeSlug}`);
  panel.imageAlt = alt;
}

fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('updated imageAlt on', data.panels.length, 'panels. h3/paragraph/applications untouched.');
