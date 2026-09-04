import type { VariantProductData } from '@/components/product-variant-hero/types';
import productData from '@/data/products/flat-pack-container-office.json';
import copyPack from '../../../content/co-07/CO-07-copy-pack-v1.json';
import filenameMap from '../../../scripts/CO-07-output-filename-map-v1.2.json';

type CopyPack = typeof copyPack;

const outputFor = (source: string): string => {
  const row = filenameMap.find((item) => item.source === source);
  if (!row) throw new Error(`Missing CO-07 v1.2 output filename for ${source}`);
  return row.output;
};

const esc = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const inlineMarkdown = (value: string): string => {
  const escaped = esc(value);
  return escaped.replace(
    /\[([^\]]+)\]\((https:\/\/www\.samanportable\.com[^)]+)\)/g,
    '<a href="$2">$1</a>',
  );
};

const paragraph = (value: string): string =>
  `<p>${inlineMarkdown(value)}</p>`;

const heading = (level: 'h2' | 'h3', value: string): string =>
  `<${level}>${esc(value)}</${level}>`;

const descriptionImage = (item: CopyPack['description_images'][number]): string => {
  return `<figure class="my-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><img src="${outputFor(item.file)}" alt="${esc(item.alt)}" width="1920" height="1080" loading="lazy" decoding="async" class="h-auto w-full" /></figure>`;
};

const table = (headers: string[], rows: string[][]): string => (
  `<div class="my-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div class="overflow-x-auto"><table class="w-full border-collapse"><thead class="bg-slate-50"><tr>`
  + headers.map((cell) => `<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">${esc(cell)}</th>`).join('')
  + `</tr></thead><tbody>`
  + rows.map((row) => `<tr>${row.map((cell) => `<td class="border-t border-slate-200 px-3 py-2 align-top text-sm text-slate-700">${esc(cell)}</td>`).join('')}</tr>`).join('')
  + `</tbody></table></div></div>`
);

const DESCRIPTION_TABLE_A = table(
  ['Build', 'Rate at 200 sq ft, ex-GST', 'What you are buying'],
  [
    ['Flat-Pack Container Office, this page', 'Rs 1,900 per sq ft', 'Parts that reach a site a module cannot, and an office that comes apart'],
    ['Container Offices hub range', 'Rs 1,450 per sq ft', 'The standard fabricated module, delivered whole'],
    ['Container Office Cabin', 'Rs 1,250 per sq ft', 'The welded value line, for a unit that stays put'],
  ],
);

const DESCRIPTION_TABLE_A_NOTE = 'Sibling rates are quoted with their basis stated: each is that page\'s own published figure at the same 200 sq ft reference, read from the live page on 24 August 2026. All are published firm.';

const DESCRIPTION_TABLE_B = table(
  ['Scope', 'Items'],
  [
    ['STANDARD', 'Structure, envelope, openings, standard electrical fit-out, finishes described in the Specifications tab'],
    ['OPTIONAL', 'Wet-service kit, air conditioning, upgraded finishes, branding overlays, opening accessories'],
    ['CUSTOM', 'Non-standard openings, upgraded coating systems for harsh exposure, any frame change for a special load'],
    ['EXCLUDED', 'Foundations and levelling, transport, unloading, craneage, site assembly labour, site utilities, project engineering and certification, loose furniture'],
  ],
);

const descriptionImageByHeading = new Map(
  copyPack.description_images.map((item) => [item.after, descriptionImage(item)]),
);
const outline = new Map(copyPack.description_outline.map(([level, text]) => [text, level as 'h2' | 'h3']));
const h = (text: string, fallback: 'h2' | 'h3' = 'h2') => heading(outline.get(text) || fallback, text);
const blocks = copyPack.description_blocks;
const prose = (from: number, to: number) => blocks.slice(from, to + 1).map(paragraph).join('');

function buildDescriptionHtml(): string {
  const imageAfter = (title: string) => descriptionImageByHeading.get(title) || '';
  return `<div class="co07-description space-y-4">`
    + h('What actually turns up on the truck')
    + prose(0, 2)
    + h('Welded in the works, bolted on your site', 'h3')
    + prose(3, 4)
    + h('Why the rate sits above a welded cabin')
    + imageAfter('Why the rate sits above a welded cabin')
    + prose(5, 7)
    + DESCRIPTION_TABLE_A
    + `<p><em>${esc(DESCRIPTION_TABLE_A_NOTE)}</em></p>`
    + h('What the site has to be before the first panel lands')
    + h('Level, reach and room to work', 'h3')
    + prose(8, 11)
    + h('Reading the six sizes: width buys rooms, length buys desks')
    + imageAfter('Reading the six sizes: width buys rooms, length buys desks')
    + prose(12, 16)
    + h('Taking it down and putting it up again')
    + imageAfter('Taking it down and putting it up again')
    + prose(17, 18)
    + h('What gets replaced each time', 'h3')
    + prose(19, 20)
    + h('The handover pack and the checks that close the job')
    + prose(21, 22)
    + h('Power, air and water in a building that comes apart')
    + imageAfter('Power, air and water in a building that comes apart')
    + prose(23, 26)
    // This heading is explicitly supplied by build prompt v1.1 section 7.
    + heading('h2', 'What this product is not')
    + prose(27, 27)
    + h('What the published price covers, and what it does not')
    + prose(28, 30)
    + DESCRIPTION_TABLE_B
    + h('The other three ways SAMAN builds a steel office')
    + prose(31, 35)
    + `</div>`;
}

const specTable = (group: CopyPack['spec_tables'][number]): string => table(
  group.columns,
  group.rows.map((row) => [row.component, row.material, row.spec, row.detail]),
).replace(
  '<div class="my-5 overflow-hidden',
  `<section class="my-5 overflow-hidden" aria-label="${esc(group.title)}"><h3 class="m-0 bg-slate-50 px-4 py-3 text-base font-bold text-emerald-900">${esc(group.title)}</h3><div class="overflow-hidden`,
).replace('</div></div>', '</div></div></section>');

const specificationDiagram = (item: CopyPack['diagrams'][number]): string => {
  return `<figure class="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><picture><source media="(max-width: 767px)" srcset="${outputFor(item.svg)}" /><img src="${outputFor(item.file)}" alt="${esc(item.alt)}" width="1920" height="1080" loading="lazy" decoding="async" class="h-auto w-full rounded-lg" /></picture></figure>`;
};

function buildSpecificationsHtml(): string {
  return `<div class="not-prose">`
    + copyPack.spec_tables.map(specTable).join('')
    + copyPack.spec_narratives.map((item) => `<p class="mb-4 text-sm leading-relaxed text-slate-600">${esc(item)}</p>`).join('')
    + copyPack.diagrams.map(specificationDiagram).join('')
    + `</div>`;
}

const gaImage = (size: string) => {
  const item = copyPack.ga_boards[size as keyof typeof copyPack.ga_boards];
  return {
    src: outputFor(item.file),
    previewSrc: outputFor(item.svg),
    alt: item.alt,
    provenance: 'render' as const,
    width: item.width,
    height: item.height,
    fit: 'contain' as const,
  };
};

const relatedTileImages: Record<string, { imageSrc: string; imageAlt: string }> = {
  'Shipping Container Office': {
    imageSrc: '/images/products/shipping-container-office/description/03-shipping-container-office-20x12-exterior.webp',
    imageAlt: 'Indigo Grey 20 x 12 ft shipping container office, front long wall with window, door and window',
  },
  'Site Office Container': {
    imageSrc: '/images/products/site-office-container/description/05-site-office-container-20x10-entrance-and-levelling.webp',
    imageAlt: 'Site office container entrance with steel step, boot mat and concrete bearing pads',
  },
  'Container Office Cabin': {
    imageSrc: '/images/products/container-office-cabin/section2/container-office-cabin-section2-20x10-moss-olive.webp',
    imageAlt: 'Moss olive 20x10 ft container office cabin on paved ground, door and window line on the long wall',
  },
};

const relatedTiles = copyPack.hero_tabs.map((item) => ({
  title: item.label,
  // The query distinguishes the hero/YMAL navigation link from the editorial
  // in-body link to the same canonical route while preserving its destination.
  href: `${item.url}?from=flat-pack-container-office`,
  category: 'Container Offices',
  blurb: item.why,
  ...relatedTileImages[item.label],
}));

export const flatPackContainerOfficeData: VariantProductData = {
  ...(productData as VariantProductData),
  h1: copyPack.h1,
  seoTitle: copyPack.seo_title,
  metaDescription: copyPack.meta_description,
  canonical: copyPack.canonical,
  opener: copyPack.short_description,
  heroTable: copyPack.hero_table,
  specPdfHref: '/specs/flat-pack-container-office-technical-specification.pdf',
  descriptionHtml: buildDescriptionHtml(),
  specificationsHtml: buildSpecificationsHtml(),
  relatedTiles,
  ymalTiles: relatedTiles,
  applicationsContent: {
    panels: copyPack.variants.map((variant) => ({
      sizeSlug: variant.size,
      h3: variant.h2,
      paragraph: variant.paragraphs.join('\n\n'),
      applications: variant.bullets,
      tabLabel: `${variant.size.replace('x', ' x ')} ft`,
      image: gaImage(variant.size),
    })),
  },
};
