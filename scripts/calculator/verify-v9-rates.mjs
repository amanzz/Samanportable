import fs from 'node:fs';
import vm from 'node:vm';
import { extractBetween, failIfDiffs, fromRoot, readText } from './common.mjs';

/**
 * BLOCKED, not passing.
 *
 * This audit reads two authority files that have never been committed to any
 * branch of this repository:
 *
 *   page-structure/content-drafts/saman-cabin-calculator-v9.html
 *   page-structure/content-drafts/SAMAN-CALCULATOR-RATE-CARD-02Aug2026.md
 *
 * `git log --all` returns nothing for either path and neither is gitignored.
 * Every previously reported result from this script — including "342 rows, 0
 * mismatches" and the 15-case parity figure — was produced against untracked
 * local files that no longer exist, so none of it is reproducible from a clean
 * checkout.
 *
 * It used to crash with ENOENT, which read as a broken script rather than a
 * missing input. It now reports the gap explicitly and fails, so the gate stays
 * visibly unmet until SAMAN commits the two files.
 */
const AUTHORITY_FILES = [
  ['page-structure', 'content-drafts', 'saman-cabin-calculator-v9.html'],
  ['page-structure', 'content-drafts', 'SAMAN-CALCULATOR-RATE-CARD-02Aug2026.md'],
];
const missing = AUTHORITY_FILES.filter((parts) => !fs.existsSync(fromRoot(...parts)));
if (missing.length) {
  console.log('V9 PARITY AUDIT: BLOCKED — authority files absent from the repository');
  for (const parts of missing) console.log(`  missing: ${parts.join('/')}`);
  console.log('');
  console.log('  Never committed to any branch; `git log --all` returns no commit for');
  console.log('  either path, and neither is gitignored. The audit cannot run, and no');
  console.log('  parity figure from it can be reproduced or trusted until they land.');
  failIfDiffs('v9-parity', missing.map((parts) => `${parts.join('/')}: authority file not in the repository`));
  process.exit(1);
}

const v9 = readText('page-structure', 'content-drafts', 'saman-cabin-calculator-v9.html');
const rateCard = readText('page-structure', 'content-drafts', 'SAMAN-CALCULATOR-RATE-CARD-02Aug2026.md');

const data = JSON.parse(extractBetween(v9, 'const DATA=', ';\nconst BYNO='));
const multiplier = (area) => area < 200 ? 1.10 : area === 200 ? 1 : area <= 300 ? 0.96 : area <= 400 ? 0.94 : area <= 600 ? 0.92 : 0.90;
const formulaDiffs = [];

for (const product of data) {
  const reference = product.sizes.find((size) => size.area === 200);
  if (!reference) {
    formulaDiffs.push(`${product.no} ${product.name}: missing 200 sq ft reference row`);
    continue;
  }
  const referenceRate = reference.rate / multiplier(reference.area);
  for (const size of product.sizes) {
    const calculatedRate = Math.round(referenceRate * multiplier(size.area));
    const calculatedBase = calculatedRate * size.area;
    if (size.rate !== calculatedRate || size.base !== calculatedBase) {
      formulaDiffs.push(`${product.no} ${product.name} ${size.label}: published ${size.rate}/${size.base}, formula ${calculatedRate}/${calculatedBase}`);
    }
  }
}

console.log('V9 AREA-BAND FORMULA');
console.log(`ladders: ${data.length}`);
console.log(`rows: ${data.reduce((sum, product) => sum + product.sizes.length, 0)}`);
console.log(`formula-versus-ladder mismatches: ${formulaDiffs.length}`);
failIfDiffs('formula-versus-ladder', formulaDiffs);

const rateObject = vm.runInNewContext(`(${extractBetween(v9, 'const R=', ';\nconst FREIGHT20=')})`);
const freight20 = vm.runInNewContext(extractBetween(v9, 'const FREIGHT20=', ';\nconst FREIGHT40='));

function numberFrom(pattern, label, divisor = 1) {
  const match = rateCard.match(pattern);
  if (!match) throw new Error(`Rate card does not contain ${label}`);
  return Number(match[1].replaceAll(',', '')) / divisor;
}

const authority = {
  wall: {
    'Particle Board': numberFrom(/Particle Board\s+([+-]?[\d,.]+)/, 'Particle Board wall'),
    PVC: numberFrom(/Particle Board\s+[+-]?[\d,.]+\s+[^\r\n]*?PVC\s+([+-]?[\d,.]+)/, 'PVC wall'),
    HDHMR: numberFrom(/HDHMR\s+([+-]?[\d,.]+)/, 'HDHMR'),
    Gypsum: numberFrom(/Gypsum\s+([+-]?[\d,.]+)/, 'Gypsum'),
    WPC: numberFrom(/WPC\s+([+-]?[\d,.]+)/, 'WPC'),
    SPC: numberFrom(/SPC\s+([+-]?[\d,.]+)/, 'SPC wall'),
    'UV Sheet': numberFrom(/UV Sheet\s+([+-]?[\d,.]+)/, 'UV Sheet'),
    ACP: numberFrom(/ACP\s+([+-]?[\d,.]+)/, 'ACP'),
  },
  ceilingPvc: numberFrom(/ceiling\s+([+-]?[\d,.]+)/, 'PVC ceiling'),
  floor: {
    PVC: numberFrom(/Flooring[^\r\n]*?PVC\s+([+-]?[\d,.]+)/, 'PVC floor'),
    SPC: numberFrom(/Flooring[^\r\n]*?SPC\s+([+-]?[\d,.]+)/, 'SPC floor'),
    'Wooden Laminate': numberFrom(/Wooden Laminate\s+([+-]?[\d,.]+)/, 'Wooden Laminate floor'),
    Tiles: numberFrom(/Tiles\s+([+-]?[\d,.]+)/, 'Tiles floor'),
  },
  panel: {
    '30 mm PUF': numberFrom(/30mm\s+([+-]?[\d,.]+)/, '30 mm PUF'),
    '40 mm PUF': numberFrom(/40mm\s+([+-]?[\d,.]+)/, '40 mm PUF'),
    '60 mm PUF': numberFrom(/60mm\s+([+-]?[\d,.]+)/, '60 mm PUF'),
    '80 mm PUF': numberFrom(/80mm\s+([+-]?[\d,.]+)/, '80 mm PUF'),
  },
  structure: {
    'GI-coated frame': numberFrom(/Structure uplift[^\r\n]*?GI\s+([+-]?[\d,.]+)/, 'GI structure'),
    'Heavier structural frame': numberFrom(/Heavy frame\s+([+-]?[\d,.]+)/, 'heavy structure'),
    'Container-form Corten build': numberFrom(/Corten container-form\s+([+-]?[\d,.]+)/, 'Corten structure'),
  },
  doorSteel: numberFrom(/extra steel door\s+([\d,]+)/, 'steel door'),
  doorUpvc: numberFrom(/uPVC\/glass door\s+([\d,]+)/, 'uPVC door'),
  window: {
    'uPVC Sliding': numberFrom(/uPVC slide\s+([\d,]+)/, 'uPVC sliding window'),
    'Aluminium Sliding': numberFrom(/alu slide\s+([\d,]+)/, 'aluminium sliding window'),
    'Openable uPVC': numberFrom(/openable uPVC\s+([\d,]+)/, 'openable uPVC window'),
    'Fixed Glass': numberFrom(/fixed glass\s+([\d,]+)/, 'fixed glass window'),
  },
  track25: numberFrom(/2\.5-track\s+\+([\d,.]+)%/, '2.5-track uplift', 100),
  partition: numberFrom(/Partition Rs\s+([\d,]+)\/sqft/, 'partition'),
  electrical: {
    'LED Panel Light': numberFrom(/LED panel\s+([\d,]+)/, 'LED panel'),
    'Tube Light': numberFrom(/tube light\s+([\d,]+)/, 'tube light'),
    'Ceiling Fan': numberFrom(/fan\s+([\d,]+)/, 'ceiling fan'),
    'Exhaust Fan': numberFrom(/exhaust\s+([\d,]+)/, 'exhaust fan'),
    'Split AC 1 Ton (Voltas/Daikin/LG class) incl. installation': numberFrom(/install\s*[^\d\r\n]*([\d,]+)/, 'installed AC'),
    'Plug Point': numberFrom(/plug point\s+([\d,]+)/, 'plug point'),
    'Pop-up Socket (table)': numberFrom(/pop-up socket\s+([\d,]+)/, 'pop-up socket'),
    'External / Entrance Light': numberFrom(/external light\s+([\d,]+)/, 'external light'),
    'FR Copper Wire Coil 90 m, 1.5 sq mm (Finolex/Polycab class)': numberFrom(/1\.5sqmm\s*~[\d,]+\s*[^\d\r\n]*([\d,]+)/, '1.5 sq mm wire'),
    'FR Copper Wire Coil 90 m, 2.5 sq mm (Finolex/Polycab class)': numberFrom(/2\.5sqmm\s*~[\d,]+\s*[^\d\r\n]*([\d,]+)/, '2.5 sq mm wire'),
  },
  addons: {
    'Attached WC / Toilet (4x4)': numberFrom(/WC\/Toilet 4x4: Rs\s+([\d,]+)/, 'attached WC'),
    'Toilet with Bath / Washroom (6x4)': numberFrom(/Toilet\+Bath 6x4: Rs\s+([\d,]+)/, 'toilet with bath'),
    'Pantry Counter': numberFrom(/pantry\s+([\d,]+)/, 'pantry'),
    'Wash Basin': numberFrom(/basin\s+([\d,]+)/, 'wash basin'),
    Urinal: numberFrom(/urinal\s+([\d,]+)/, 'urinal'),
    Workstation: numberFrom(/workstation\s+([\d,]+)/, 'workstation'),
    'Manager Table (5x2)': numberFrom(/manager table\s+([\d,]+)/, 'manager table'),
    'Manager Table (L-shaped)': numberFrom(/L-shape\s+([\d,]+)/, 'L-shape manager table'),
    'Conference Table': numberFrom(/conference\s+([\d,]+)/, 'conference table'),
    Cupboard: numberFrom(/cupboard\s+([\d,]+)/, 'cupboard'),
    'Overhead Cabinet': numberFrom(/overhead cabinet\s+([\d,]+)/, 'overhead cabinet'),
    'Table with Drawer': numberFrom(/tables\s+([\d,]+)\/([\d,]+)/, 'table with drawer'),
    'Table without Drawer': Number(rateCard.match(/tables\s+([\d,]+)\/([\d,]+)/)?.[2].replaceAll(',', '')),
    'Revolving Chair, Head Rest': numberFrom(/chairs\s+([\d,]+)\/([\d,]+)/, 'chair with head rest'),
    'Revolving Chair, Back Rest': Number(rateCard.match(/chairs\s+([\d,]+)\/([\d,]+)/)?.[2].replaceAll(',', '')),
  },
  flatRoof: numberFrom(/Flat roof\s+\+([\d,.]+)%/, 'flat roof uplift', 100),
  heightPerFt: numberFrom(/Extra height\s+\+([\d,.]+)%/, 'height uplift', 100),
  gst: numberFrom(/GST\s+([\d,.]+)%/, 'GST', 100),
  freight40Delta: numberFrom(/40 ft trailer \+Rs\s+([\d,]+)/, '40 ft trailer delta'),
  firstFreight: numberFrom(/100-150 km = Rs\s+([\d,]+)/, 'first freight band'),
};

const rateDiffs = [];
const compareNamedRows = (group, actualRows, expectedValues) => {
  for (const [label, expected] of Object.entries(expectedValues)) {
    const row = actualRows.find(([name]) => name === label);
    if (!row) rateDiffs.push(`${group}.${label}: missing from v9`);
    else if (row[1] !== expected) rateDiffs.push(`${group}.${label}: build ${row[1]}, rate card ${expected}`);
  }
};

compareNamedRows('wall', rateObject.wall, authority.wall);
compareNamedRows('ceiling', rateObject.ceil, { PVC: authority.ceilingPvc, ...Object.fromEntries(Object.entries(authority.wall).filter(([name]) => !['Particle Board', 'PVC'].includes(name))) });
compareNamedRows('floor', rateObject.floor, authority.floor);
compareNamedRows('panel', rateObject.panel, authority.panel);
compareNamedRows('structure', rateObject.struct, authority.structure);
compareNamedRows('electrical', rateObject.elec, authority.electrical);
compareNamedRows('addons', rateObject.addons, authority.addons);

const scalarChecks = [
  ['doorSteel', rateObject.doorSteel, authority.doorSteel],
  ['doorUpvc', rateObject.doorUpvc, authority.doorUpvc],
  ['track25', rateObject.track25, authority.track25],
  ['partition', rateObject.partition, authority.partition],
  ['flatRoof', rateObject.flatRoof, authority.flatRoof],
  ['heightPerFt', rateObject.heightPerFt, authority.heightPerFt],
  ['freight40Delta', 5000, authority.freight40Delta],
  ['firstFreightBand', freight20[0][2], authority.firstFreight],
];
for (const [label, actual, expected] of scalarChecks) {
  if (actual !== expected) rateDiffs.push(`${label}: build ${actual}, rate card ${expected}`);
}
for (const [index, label] of ['uPVC Sliding', 'Aluminium Sliding', 'Openable uPVC', 'Fixed Glass'].entries()) {
  if (rateObject.winRate[index] !== authority.window[label]) rateDiffs.push(`window.${label}: build ${rateObject.winRate[index]}, rate card ${authority.window[label]}`);
}

console.log('\nRATE-CARD BYTE MATCH');
console.log(`checked build rates: ${Object.keys(authority.wall).length + 1 + Object.keys(authority.floor).length + Object.keys(authority.panel).length + Object.keys(authority.structure).length + Object.keys(authority.window).length + Object.keys(authority.electrical).length + Object.keys(authority.addons).length + scalarChecks.length}`);
console.log(`freight bands: ${freight20.length}; first band ${freight20[0].join('-')}`);
console.log(`GST authority: ${authority.gst * 100}%`);
failIfDiffs('rate-card', rateDiffs);
