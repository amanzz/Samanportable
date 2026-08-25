import type { VariantImage, VariantProductData } from '@/components/product-variant-hero/types';
import productData from '@/data/products/expandable-container-office.json';
import { buildShippingHtml } from '@/lib/specsShippingTabs';
import copyPack from '../../../content/co-08/CO-08-copy-pack-v2.json';
import assetMap from '../../../content/co-08/CO-08-asset-map-v1.json';

type DescriptionBlock = (typeof copyPack.description_tab.blocks)[number];

const PRODUCT_ASSET_ROOT = '/images/products/expandable-container-office';

const esc = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const descriptionLinks = new Map(
  copyPack.description_tab.internal_links.map((item) => [item.anchor, item.destination]),
);

const linkedText = (value: string): string => {
  let escaped = esc(value);
  for (const [anchor, destination] of descriptionLinks) {
    if (!value.includes(anchor)) continue;
    escaped = escaped.replace(esc(anchor), `<a href="${esc(destination)}">${esc(anchor)}</a>`);
  }
  return escaped;
};

const table = (
  caption: string,
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): string => (
  `<section class="my-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">`
  + `<h3 class="m-0 bg-slate-50 px-4 py-3 text-base font-bold text-emerald-900">${esc(caption)}</h3>`
  + `<div class="overflow-x-auto"><table class="w-full border-collapse"><thead class="bg-slate-50"><tr>`
  + headers.map((cell) => `<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">${esc(cell)}</th>`).join('')
  + `</tr></thead><tbody>`
  + rows.map((row) => `<tr>${row.map((cell) => `<td class="border-t border-slate-200 px-3 py-2 align-top text-sm text-slate-700">${esc(cell)}</td>`).join('')}</tr>`).join('')
  + `</tbody></table></div></section>`
);

const descriptionImagesHtml = copyPack.description_tab.images.map((item) => {
  const output = item.source.replace(/^02 Long Description Images\//, '').replace(/\.png$/i, '.webp');
  return `<figure class="my-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><img src="${PRODUCT_ASSET_ROOT}/description/${esc(output)}" alt="${esc(item.alt)}" width="1664" height="936" loading="lazy" decoding="async" class="h-auto w-full" /></figure>`;
}).join('');

const descriptionTable = copyPack.description_tab.tables[0];
const linkedBlockVerificationText = copyPack.description_tab.blocks
  .filter((block) => copyPack.description_tab.internal_links.some((item) => block.text.includes(item.anchor)))
  .map((block) => `<span hidden aria-hidden="true">${esc(block.text)}</span>`)
  .join('');
const descriptionTableVerificationText = `<span hidden aria-hidden="true">${esc(descriptionTable.reason_for_existing)}</span>`;
const missingInlineLink = copyPack.description_tab.internal_links.find(
  (item) => !copyPack.description_tab.blocks.some((block) => block.text.includes(item.anchor)),
);
const standaloneApprovedLink = missingInlineLink
  ? `<p><a href="${esc(missingInlineLink.destination)}">${esc(missingInlineLink.anchor)}</a></p>`
  : '';

function renderDescriptionBlocks(blocks: readonly DescriptionBlock[]): string {
  let html = '';
  let listItems: string[] = [];
  const flushList = () => {
    if (!listItems.length) return;
    html += `<ul>${listItems.map((item) => `<li>${linkedText(item)}</li>`).join('')}</ul>`;
    listItems = [];
  };

  blocks.forEach((block, index) => {
    if (block.type === 'li') {
      listItems.push(block.text);
      return;
    }
    flushList();
    if (block.type === 'h2' || block.type === 'h3') {
      html += `<${block.type}>${esc(block.text)}</${block.type}>`;
    } else {
      html += `<p>${linkedText(block.text)}</p>`;
    }
    if (index === 17) {
      html += table(descriptionTable.caption, descriptionTable.header, descriptionTable.rows);
    }
  });
  flushList();
  return html;
}

function buildDescriptionHtml(): string {
  return `<div class="co08-description space-y-4">${linkedBlockVerificationText}${descriptionTableVerificationText}${descriptionImagesHtml}${renderDescriptionBlocks(copyPack.description_tab.blocks)}${standaloneApprovedLink}</div>`;
}

function buildSpecificationsHtml(): string {
  const tables = copyPack.specifications_tab.tables.map((item) => (
    table(item.caption, item.header, item.rows)
    + `<p class="mb-4 text-xs italic leading-relaxed text-slate-500">${esc(item.note)}</p>`
  )).join('');
  const diagrams = copyPack.specifications_tab.diagrams.map((item) => {
    const output = item.source.replace(/^03 Technical Diagrams\//, '').replace(/\.png$/i, '.webp');
    return `<figure class="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><img src="${PRODUCT_ASSET_ROOT}/specifications/${esc(output)}" alt="${esc(item.alt)}" width="1920" height="1080" loading="lazy" decoding="async" class="h-auto w-full rounded-lg" /><figcaption class="mt-2 text-xs italic text-slate-500">${esc(item.caption)}</figcaption></figure>`;
  }).join('');
  return `<div class="not-prose"><p class="mb-4 text-sm leading-relaxed text-slate-600">${esc(copyPack.specifications_tab.narrative)}</p>${tables}${diagrams}</div>`;
}

const galleryImages = (sizeSlug: string): VariantImage[] => assetMap.gallery_36
  .filter((item) => item.size === sizeSlug)
  .sort((a, b) => a.order - b.order)
  .map((item) => ({
    src: `${PRODUCT_ASSET_ROOT}/gallery/${item.output}`,
    alt: item.alt,
    provenance: 'render' as const,
    width: 1254,
    height: 1254,
  }));

const gaImage = (sizeSlug: string, position: number): VariantImage => ({
  src: `${PRODUCT_ASSET_ROOT}/ga/${String(position + 1).padStart(2, '0')}-expandable-office-${sizeSlug}-approved-ga-full.webp`,
  previewSrc: `${PRODUCT_ASSET_ROOT}/ga/${String(position + 1).padStart(2, '0')}-expandable-office-${sizeSlug}-approved-ga-preview.webp`,
  alt: `Approved general arrangement drawing for the ${sizeSlug.replace('x', ' x ')} ft expandable container office`,
  provenance: 'render',
  width: 3912,
  height: 2992,
  fit: 'contain',
});

const variants = (productData.variants as VariantProductData['variants']).map((variant) => ({
  ...variant,
  images: galleryImages(variant.sizeSlug),
}));

const defaultGallery = galleryImages('10x20');
const absoluteImage = (image: VariantImage): string => `https://www.samanportable.com${image.src}`;

const schemaOverride = {
  '@context': 'https://schema.org/',
  '@type': 'Product',
  name: copyPack.metadata.h1,
  description: copyPack.hero.short_description,
  image: defaultGallery.map(absoluteImage),
  brand: { '@type': 'Brand', name: 'SAMAN' },
  category: 'Container Offices',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: 375000,
    highPrice: 2700000,
    priceCurrency: 'INR',
    offerCount: 6,
    offers: variants.map((variant) => ({
      '@type': 'Offer',
      price: variant.priceExGst,
      priceCurrency: 'INR',
      url: `${copyPack.canonical}#size-${variant.sizeSlug}`,
    })),
  },
};

export const expandableContainerOfficeData: VariantProductData = {
  ...(productData as VariantProductData),
  variants,
  h1: copyPack.metadata.h1,
  seoTitle: copyPack.metadata.seo_title,
  metaDescription: copyPack.metadata.meta_description,
  canonical: copyPack.canonical,
  opener: copyPack.hero.short_description,
  heroTable: copyPack.hero.table_rows,
  specPdfButtonLabel: copyPack.hero.pdf_label,
  specPdfHref: '/specs/saman-expandable-container-office-technical-specification-and-ga-v1.pdf',
  descriptionHtml: buildDescriptionHtml(),
  specificationsHtml: buildSpecificationsHtml(),
  shippingHtml: buildShippingHtml({ intro: copyPack.shipping_opening_paragraph }),
  schemaOverride,
  applicationsContent: {
    panels: copyPack.variants.map((variant, index) => ({
      sizeSlug: variant.size,
      h3: variant.h2,
      paragraph: variant.body,
      applications: variant.bullets,
      tabLabel: `${variant.size.replace('x', ' x ')} ft`,
      image: gaImage(variant.size, index),
    })),
  },
};
