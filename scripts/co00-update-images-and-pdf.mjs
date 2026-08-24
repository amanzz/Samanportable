import fs from 'node:fs';

const PATH = 'src/data/products/container-offices.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

const galleryReport = JSON.parse(fs.readFileSync('scripts/co00-gallery-v2-report.json', 'utf8'));
const bySize = {};
for (const r of galleryReport) {
  (bySize[r.size] ||= []).push(r);
}

for (const variant of data.variants) {
  const rows = bySize[variant.sizeSlug];
  if (!rows || rows.length !== 6) throw new Error(`bad gallery rows for ${variant.sizeSlug}`);
  variant.images = rows.map((r) => ({
    src: r.out,
    alt: r.alt,
    provenance: 'render',
    width: r.w,
    height: r.h,
  }));
}

data.explorerImageTemplate = Object.fromEntries(
  data.variants.map((v) => [v.sizeSlug, v.images[0].src])
);

data.specPdfHref = '/specs/saman-container-offices-technical-specification-and-ga-v2.pdf';

fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('updated images for', data.variants.length, 'variants');
console.log('specPdfHref:', data.specPdfHref);
