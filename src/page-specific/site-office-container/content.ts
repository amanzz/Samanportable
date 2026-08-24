import pageData from '@/data/products/site-office-container-page.json';
import { buildContainerOfficesShippingHtml } from '@/lib/specsShippingTabs';

type SpecTable = {
  title: string;
  rows: Array<[string, string]>;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderTable = (table: SpecTable): string =>
  '<section class="mb-6">' +
    `<h3>${escapeHtml(table.title)}</h3>` +
    '<div class="overflow-x-auto">' +
      '<table>' +
        '<tbody>' +
          table.rows
            .map(([label, value]) =>
              `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
            )
            .join('') +
        '</tbody>' +
      '</table>' +
    '</div>' +
  '</section>';

const renderDiagram = (index: number): string => {
  const diagram = pageData.spec_diagrams[index];
  if (!diagram) return '';
  return (
    '<figure class="my-6 overflow-hidden rounded-lg border border-slate-200 bg-white">' +
      `<img src="${escapeHtml(diagram.output)}" alt="${escapeHtml(diagram.alt)}" width="1920" height="1080" loading="lazy" decoding="async" />` +
      `<figcaption>${escapeHtml(diagram.caption)}</figcaption>` +
    '</figure>'
  );
};

export const buildSiteOfficeContainerSpecificationsHtml = (): string => {
  const tables = pageData.spec_tables as SpecTable[];
  return (
    '<section id="site-office-container-specifications">' +
      renderTable(tables[0]) +
      renderDiagram(0) +
      renderTable(tables[1]) +
      renderDiagram(1) +
      `<p>${escapeHtml(pageData.spec_narrative)}</p>` +
    '</section>'
  );
};

export const buildSiteOfficeContainerShippingHtml = (): string =>
  buildContainerOfficesShippingHtml();

export const addSiteOfficeContainerCalculatorImage = (entryHtml: string): string => {
  const image = pageData.pre_calculator;
  const picture =
    '<picture class="calc-entry-photo">' +
      `<source type="image/webp" srcset="${escapeHtml(image.output)}">` +
      `<img src="${escapeHtml(image.output)}" alt="${escapeHtml(image.alt)}" width="1254" height="1254" loading="lazy" decoding="async">` +
    '</picture>';

  return entryHtml.replace(
    /<picture class="calc-entry-photo">[\s\S]*?<\/picture>/,
    picture
  );
};
