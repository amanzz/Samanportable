// Updates src/data/products/container-offices.json in place with draft-v2.0 content:
// seoTitle, metaDescription, opener, per-variant featureCells, descriptionHtml, faqSchema.
import fs from 'node:fs';

const PATH = 'src/data/products/container-offices.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

data.seoTitle = 'Container Office Sizes, Layouts, Rates and Fit-Out | SAMAN';
data.metaDescription = 'Compare six approved SAMAN container office layouts from 100 to 400 sq.ft., with workstation counts, opening schedules, steel sections and published rates.';
data.opener = "A container office is a steel module built on a welded MS frame, then insulated, wired and finished in our works before it ships. SAMAN builds them for construction, industrial, logistics and commercial sites across India. This is the range's selection page, not one model. It publishes six approved arrangements, the workstation and opening schedule for each, the members they share, and the boundary between this office and our specialist container products. Width decides capacity here more than length does, so settle your footprint, openings and service load before asking for a price. Where a converted freight shell, a site-duty build or a value-line cabin suits you better, the comparison below says so.";

const FEATURE_CELLS = {
  '10x10': [
    { label: 'Size', value: '10x10 x 8.5 ft, 100 sq.ft.' },
    { label: 'Layout', value: '4 workstations, 4 seats' },
    { label: 'Openings', value: '1 doors, 3 windows' },
    { label: 'Structure', value: '150x75x5 mm MS C-channel' },
    { label: 'Rate', value: 'Rs 1,667.50/sq.ft. ex-GST' },
  ],
  '20x8': [
    { label: 'Size', value: '20x8 x 8.5 ft, 160 sq.ft.' },
    { label: 'Layout', value: '3 workstations, 3 seats' },
    { label: 'Openings', value: '1 doors, 4 windows' },
    { label: 'Structure', value: '150x75x5 mm MS C-channel' },
    { label: 'Rate', value: 'Rs 1,595.00/sq.ft. ex-GST' },
  ],
  '20x10': [
    { label: 'Size', value: '20x10 x 8.5 ft, 200 sq.ft.' },
    { label: 'Layout', value: '5 workstations, 5 seats' },
    { label: 'Openings', value: '1 doors, 6 windows' },
    { label: 'Structure', value: '150x75x5 mm MS C-channel' },
    { label: 'Rate', value: 'Rs 1,450.00/sq.ft. ex-GST' },
  ],
  '30x10': [
    { label: 'Size', value: '30x10 x 8.5 ft, 300 sq.ft.' },
    { label: 'Layout', value: '12 workstations, 12 seats' },
    { label: 'Openings', value: '2 doors, 8 windows' },
    { label: 'Structure', value: '150x75x5 mm MS C-channel' },
    { label: 'Rate', value: 'Rs 1,392.00/sq.ft. ex-GST' },
  ],
  '40x8': [
    { label: 'Size', value: '40x8 x 8.5 ft, 320 sq.ft.' },
    { label: 'Layout', value: '7 workstations, 10 seats' },
    { label: 'Openings', value: '3 doors, 8 windows' },
    { label: 'Structure', value: '150x75x5 mm MS C-channel' },
    { label: 'Rate', value: 'Rs 1,377.50/sq.ft. ex-GST' },
  ],
  '40x10': [
    { label: 'Size', value: '40x10 x 8.5 ft, 400 sq.ft.' },
    { label: 'Layout', value: '12 workstations, 15 seats' },
    { label: 'Openings', value: '3 doors, 10 windows' },
    { label: 'Structure', value: '150x75x5 mm MS C-channel' },
    { label: 'Rate', value: 'Rs 1,377.50/sq.ft. ex-GST' },
  ],
};

for (const variant of data.variants) {
  const cells = FEATURE_CELLS[variant.sizeSlug];
  if (!cells) throw new Error(`no featureCells for ${variant.sizeSlug}`);
  variant.featureCells = cells;
}

data.descriptionHtml = fs.readFileSync('scripts/co00-description-v2-output.html', 'utf8');

data.faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.samanportable.com/product/container-offices#faq',
  url: 'https://www.samanportable.com/product/container-offices',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does a container office cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our published rate is Rs 1,450 per square foot at the 200 sq.ft. reference size. A premium applies below that area, and a reduction above it. A 20x10 ft module is Rs 2,90,000 before GST. Those are workbook rates for the standard specification. Your signed quotation sets the final figure.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many people fit in each size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The approved general arrangements give four seats at 10x10, three at 20x8, five at 20x10, twelve at 30x10, ten at 40x8 and fifteen at 40x10. Those counts assume the standard workstation size and the standard aisle. Change the furniture and the numbers change with it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this an ISO-certified shipping container?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The modules on this page are fabricated to a container form factor. We do not claim ISO 668 compliance, CSC plate approval or stackability for them without project-specific evidence. If you need a genuine converted freight shell, that is a different product and we build it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can it be moved again later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, from the approved lifting points, on a suitable vehicle. Repeated relocation is harder on the base and the coating than a single delivery. So tell us at enquiry stage if the module will move several times. We specify it differently.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the warranty?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The warranty period and its exclusions are confirmed in your final quotation. Relocation damage, misuse, site utilities and unapproved alterations sit outside it. Every container office we build carries the same pre-dispatch checks listed above, whichever size you order.',
      },
    },
  ],
};

fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('updated', PATH);
console.log('seoTitle chars:', data.seoTitle.length);
console.log('metaDescription chars:', data.metaDescription.length);
console.log('opener chars:', data.opener.length);
