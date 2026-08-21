import fs from 'node:fs';

const PATH = 'src/data/products/porta-cabins.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

const imagesReport = JSON.parse(fs.readFileSync('scripts/pc00-images-report.json', 'utf8'));

// Alt text (verbatim, from copy pack Part B1), keyed by gallery output filename.
const GALLERY_ALT = {
  'porta-cabin-10x10-01-exterior-front-left.webp': 'Oxford Teal 10x10 ft porta cabin, outward-opening door beside one sliding window on the long face',
  'porta-cabin-10x10-02-exterior-front-right.webp': 'Oxford Teal 10x10 ft porta cabin from the right, door on the long wall and a window on the end wall',
  'porta-cabin-10x10-03-exterior-rear-left.webp': 'Oxford Teal 10x10 ft porta cabin rear corner with sliding windows on the rear and end walls',
  'porta-cabin-10x10-04-interior-entry-to-rear.webp': 'Porcelain Sage 10x10 ft porta cabin interior, four desks and three windows seen from the entry',
  'porta-cabin-10x10-05-interior-front-left-angle.webp': 'Porcelain Sage 10x10 ft interior from the front left, overhead cabinets above two desk runs',
  'porta-cabin-10x10-06-interior-rear-to-entry.webp': 'Porcelain Sage 10x10 ft interior looking back at the closed entry door between two desk runs',
  'porta-cabin-20x8-01-exterior-front-left.webp': 'Mineral Bronze 20x8 ft porta cabin, centre door with a sliding window on each side',
  'porta-cabin-20x8-02-exterior-front-right.webp': 'Mineral Bronze 20x8 ft porta cabin from the right, long wall carrying the door and two windows',
  'porta-cabin-20x8-03-exterior-rear-left.webp': 'Mineral Bronze 20x8 ft porta cabin rear elevation with two sliding windows and no door',
  'porta-cabin-20x8-04-interior-left-end-lengthwise.webp': 'Almond Stone 20x8 ft interior, three-desk run under a window line with the door on the right',
  'porta-cabin-20x8-05-interior-right-end-lengthwise.webp': 'Almond Stone 20x8 ft interior from the far end, grey entry door facing the single desk run',
  'porta-cabin-20x8-06-interior-door-to-rear.webp': 'Almond Stone 20x8 ft interior, three desks and pedestals below two windows and wall cabinets',
  'porta-cabin-20x10-01-exterior-front-left.webp': 'Desert Ochre 20x10 ft porta cabin, door centred between sliding windows on the long wall',
  'porta-cabin-20x10-02-exterior-front-right.webp': 'Desert Ochre 20x10 ft porta cabin at a corporate frontage, door and three windows visible',
  'porta-cabin-20x10-03-exterior-rear-left.webp': 'Desert Ochre 20x10 ft porta cabin rear corner showing three sliding windows along the long wall',
  'porta-cabin-20x10-04-interior-entry-to-rear.webp': 'Mist Blue-Grey 20x10 ft interior, continuous desk run below two sliding windows and wall cabinets',
  'porta-cabin-20x10-05-interior-left-end-lengthwise.webp': 'Mist Blue-Grey 20x10 ft interior from the left end, desk runs on both sides with a clear aisle',
  'porta-cabin-20x10-06-interior-right-end-lengthwise.webp': 'Mist Blue-Grey 20x10 ft interior from the right end, white internal door beside the left desk run',
  'porta-cabin-20x12-01-exterior-front-left.webp': 'Slate Violet 20x12 ft porta cabin with grilled windows, rain hoods and a corrugated door',
  'porta-cabin-20x12-02-exterior-front-right.webp': 'Slate Violet 20x12 ft porta cabin from the right, hooded grilled windows either side of the door',
  'porta-cabin-20x12-03-exterior-rear-left.webp': 'Slate Violet 20x12 ft porta cabin rear corner with three hooded grilled windows on the long wall',
  'porta-cabin-20x12-04-interior-left-end-lengthwise.webp': 'Soft Clay Greige 20x12 ft interior, two desk runs facing a white internal door and end window',
  'porta-cabin-20x12-05-interior-right-end-lengthwise.webp': 'Soft Clay Greige 20x12 ft interior from the right end, laptops on desk runs either side of the aisle',
  'porta-cabin-20x12-06-interior-entry-to-rear.webp': 'Soft Clay Greige 20x12 ft interior from the entry, five-desk arrangement below two windows',
  'porta-cabin-30x10-01-exterior-front-left.webp': 'Eucalyptus Grey-Green 30x10 ft porta cabin with two doors and hooded grilled windows',
  'porta-cabin-30x10-02-exterior-front-right.webp': 'Eucalyptus Grey-Green 30x10 ft porta cabin from the right, two entrances on the long wall',
  'porta-cabin-30x10-03-exterior-rear-left.webp': 'Eucalyptus Grey-Green 30x10 ft porta cabin rear elevation with four grilled windows in a row',
  'porta-cabin-30x10-04-interior-left-end-lengthwise.webp': 'Pale Celadon 30x10 ft interior, long desk runs on both sides beside a white internal door',
  'porta-cabin-30x10-05-interior-right-end-lengthwise.webp': 'Pale Celadon 30x10 ft interior from the right end, opposing desk runs under a continuous window line',
  'porta-cabin-30x10-06-interior-entry-to-far-end.webp': 'Pale Celadon 30x10 ft interior from the entry, laptop workstations flanking a full-length aisle',
  'porta-cabin-40x10-01-exterior-front-left.webp': 'Warm Putty Taupe 40x10 ft porta cabin, two external doors and four windows along the long wall',
  'porta-cabin-40x10-02-exterior-front-right.webp': 'Warm Putty Taupe 40x10 ft porta cabin from the right, two doors and four windows on the long face',
  'porta-cabin-40x10-03-exterior-rear-left.webp': 'Warm Putty Taupe 40x10 ft porta cabin rear elevation with six windows along the full length',
  'porta-cabin-40x10-04-interior-common-right-to-partition.webp': 'Champagne Linen 40x10 ft common office, opposing workstation runs facing the closed partition door',
  'porta-cabin-40x10-05-interior-common-partition-to-right.webp': 'Champagne Linen 40x10 ft common office from the partition end, desk runs under two window lines',
  'porta-cabin-40x10-06-interior-manager-cabin.webp': 'Champagne Linen 40x10 ft manager cabin, single desk with two visitor chairs and three windows',
};

const bySize = {};
for (const r of imagesReport.gallery) {
  (bySize[r.size] ||= []).push(r);
}

for (const variant of data.variants) {
  const rows = bySize[variant.sizeSlug];
  if (!rows || rows.length !== 6) throw new Error(`bad gallery rows for ${variant.sizeSlug}`);
  variant.images = rows.map((r) => {
    const base = r.out.split(/[\\/]/).pop();
    const alt = GALLERY_ALT[base];
    if (!alt) throw new Error(`no alt for ${base}`);
    return {
      src: `/images/products/porta-cabins/${variant.sizeSlug}/${base}`,
      alt,
      provenance: 'render',
      width: r.ow,
      height: r.oh,
    };
  });
}

// explorerImageTemplate -> the 6 new GA plan boards (Section 3, copy pack B5 alts
// live on porta-cabins-applications.json's panel.imageAlt, updated separately).
data.explorerImageTemplate = {
  '10x10': '/images/products/porta-cabins/size-section/porta-cabin-ga-plan-10x10.webp',
  '20x8': '/images/products/porta-cabins/size-section/porta-cabin-ga-plan-20x8.webp',
  '20x10': '/images/products/porta-cabins/size-section/porta-cabin-ga-plan-20x10.webp',
  '20x12': '/images/products/porta-cabins/size-section/porta-cabin-ga-plan-20x12.webp',
  '30x10': '/images/products/porta-cabins/size-section/porta-cabin-ga-plan-30x10.webp',
  '40x10': '/images/products/porta-cabins/size-section/porta-cabin-ga-plan-40x10.webp',
};

fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('gallery updated for', data.variants.length, 'variants (36 images)');
console.log('explorerImageTemplate updated to GA plan boards');
