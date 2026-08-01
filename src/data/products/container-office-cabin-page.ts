import {
  buildC04SpecificationsHtml,
  buildContainerOfficesShippingHtml,
} from '@/lib/specsShippingTabs';

const esc = (value: string | number): string =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TH =
  'border-b-2 border-slate-300 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-600';
const TD = 'border-b border-slate-100 px-3 py-2 text-sm text-slate-600';

export const CONTAINER_OFFICE_CABIN_PRICE_HTML =
  `<h2>Container Office Cabin Price by Size — Ex-Factory Rates</h2>` +
  `<p>Every container office cabin is priced from one controlled rate card — ₹1,250 per sq ft at the 200 sq ft reference, stepping +10% below 200 sq ft and down in bands as the floor grows. The full ladder is below so you can budget before you enquire. Prices are ex-factory; interior fit-out and freight are quoted separately at confirmation.</p>` +
  `<div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr>` +
  `<th class="${TH}">Size (ft)</th><th class="${TH}">Area</th><th class="${TH}">Rate/sq ft</th><th class="${TH}">ex-GST</th><th class="${TH}">incl-GST</th>` +
  `</tr></thead><tbody>` +
  [
    ['10×10', '100', '₹1,375', '₹1,37,500', '₹1,62,250'],
    ['20×8', '160', '₹1,375', '₹2,20,000', '₹2,59,600'],
    ['20×10', '200', '₹1,250', '₹2,50,000', '₹2,95,000'],
    ['20×12', '240', '₹1,200', '₹2,88,000', '₹3,39,840'],
    ['30×10', '300', '₹1,200', '₹3,60,000', '₹4,24,800'],
    ['40×8', '320', '₹1,175', '₹3,76,000', '₹4,43,680'],
    ['20×20', '400', '₹1,175', '₹4,70,000', '₹5,54,600'],
    ['40×10', '400', '₹1,175', '₹4,70,000', '₹5,54,600'],
    ['40×12', '480', '₹1,150', '₹5,52,000', '₹6,51,360'],
  ]
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td class="${TD}">${cell}</td>`).join('')}</tr>`
    )
    .join('') +
  `</tbody></table></div>` +
  `<p>All figures confirmed at quotation. GST 18%. Transport is quoted to your pin code before you commit.</p>`;

export function insertContainerOfficeCabinPriceHtml(description: string): string {
  const priceHeading = '<h2>Office Container Price — What Drives It</h2>';
  const faqHeading = '<h3>FAQ</h3>';
  const priceIndex = description.indexOf(priceHeading);
  const insertIndex = description.indexOf(faqHeading, priceIndex);
  if (priceIndex < 0 || insertIndex < 0) {
    throw new Error('Container Office Cabin price insertion anchor is missing');
  }
  return `${description.slice(0, insertIndex)}${CONTAINER_OFFICE_CABIN_PRICE_HTML}${description.slice(insertIndex)}`;
}

export function buildContainerOfficeCabinSpecificationsHtml(): string {
  return buildC04SpecificationsHtml('container-office-cabin');
}

const SHIPPING_INTRO =
  'A container office cabin travels as one factory-sealed unit on an open trailer and sets onto your prepared base the day it arrives. Dispatch is from Bangalore for the South and Greater Noida for the North; freight follows the distance tables below and is confirmed to your pin code in the quotation.';

export function buildContainerOfficeCabinShippingHtml(): string {
  return buildContainerOfficesShippingHtml().replace(
    /<p class="mb-4 text-sm leading-relaxed text-slate-600">.*?<\/p>/,
    `<p class="mb-4 text-sm leading-relaxed text-slate-600">${esc(SHIPPING_INTRO)}</p>`
  );
}
