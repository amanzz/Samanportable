import {
  buildContainerOfficesShippingHtml,
  buildC04SpecificationsHtml,
} from '@/lib/specsShippingTabs';

const SPECIFICATIONS_INTRO =
  'A shipping container office starts from marine-grade corrugated container steel: the specification below covers the conversion: structural frame retained, openings framed into the corrugation, insulation and interior built inside the original shell.';

const SHIPPING_INTRO =
  'A converted shipping container office moves the way containers always have: craned onto an open trailer, hauled, and craned off at site, with the structural frame carrying every lift. The distance-based freight tables below cover both zones; your exact pin code cost is fixed in the quotation.';

const WARRANTY_LINE = '12-month workmanship warranty, confirmed at quotation.';

/**
 * A MATCHING KEY, NOT COPY. Never rendered — its only use is the `includes`
 * check in appendShippingContainerOfficePriceSection below, which refuses to
 * append the price section unless the approved opener is present.
 *
 * It must therefore stay byte-for-byte identical to the opener paragraph in
 * src/data/wp-export/products/shipping-container-office.json, which is frozen
 * export content. DO NOT normalise punctuation here. The em dash below is not
 * an AI tell to be swept — it is the character the frozen copy contains, and
 * changing it does not change one pixel of the page, it only stops this string
 * matching.
 *
 * That is exactly what happened: 13599402 ("enforce sitewide L20 copy
 * normalization") rewrote this em dash to a colon without touching the frozen
 * JSON, the `includes` failed, the throw below fired inside getServerSideProps,
 * and /product/container-offices/shipping-container-office served a 500 in
 * production until 08 Aug 2026. The sibling module names its equivalent
 * FROZEN_OPENER_ANCHOR, which is the clearer name and the reason the sweep left
 * that one alone.
 */
const FROZEN_OPENER =
  '<p class="font-claude-response-body break-words whitespace-normal leading-[1.7]">Buyers typing "shipping container office" are usually at one of two decision points — choosing between the 20-ft and 40-ft form factor, or confirming whether the unit they are about to receive is a purpose-built office structure or a retrofitted used cargo container. Both decisions affect what you get on site, what documentation comes with it, and how long it lasts.</p>';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const replaceFirstParagraph = (
  html: string,
  className: string,
  replacement: string
): string => {
  const opening = `<p class="${className}">`;
  const start = html.indexOf(opening);
  const end = start < 0 ? -1 : html.indexOf('</p>', start);
  if (start < 0 || end < 0) {
    throw new Error('Shipping Container Office tab intro anchor is missing.');
  }

  return (
    html.slice(0, start) +
    `${opening}${escapeHtml(replacement)}</p>` +
    html.slice(end + 4)
  );
};

export const buildShippingContainerOfficeSpecificationsHtml = (): string => {
  return buildC04SpecificationsHtml('shipping-container-office');
};

export const buildShippingContainerOfficeShippingHtml = (): string =>
  replaceFirstParagraph(
    buildContainerOfficesShippingHtml(),
    'mb-4 text-sm leading-relaxed text-slate-600',
    SHIPPING_INTRO
  );

const PRICE_SECTION =
  '<section id="shipping-container-office-price-by-size">' +
    '<h2>Shipping Container Office Price by Size: Ex-Factory Rates</h2>' +
    '<p>Every shipping container office is priced from one controlled rate card: ₹1,800 per sq ft at the 200 sq ft reference, stepping +10% below 200 sq ft and down in bands as the floor grows. The full ladder is below so you can budget before you enquire. Prices are ex-factory; interior fit-out and freight are quoted separately at confirmation.</p>' +
    '<div class="overflow-x-auto">' +
      '<table>' +
        '<thead><tr><th>Size (ft)</th><th>Area</th><th>Rate/sq ft</th><th>ex-GST</th><th>incl-GST</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>10×10</td><td>100</td><td>₹1,980</td><td>₹1,98,000</td><td>₹2,33,640</td></tr>' +
          '<tr><td>20×8</td><td>160</td><td>₹1,980</td><td>₹3,16,800</td><td>₹3,73,824</td></tr>' +
          '<tr><td>20×10</td><td>200</td><td>₹1,800</td><td>₹3,60,000</td><td>₹4,24,800</td></tr>' +
          '<tr><td>20×12</td><td>240</td><td>₹1,728</td><td>₹4,14,720</td><td>₹4,89,370</td></tr>' +
          '<tr><td>30×10</td><td>300</td><td>₹1,728</td><td>₹5,18,400</td><td>₹6,11,712</td></tr>' +
          '<tr><td>40×8</td><td>320</td><td>₹1,692</td><td>₹5,41,440</td><td>₹6,38,899</td></tr>' +
          '<tr><td>20×20</td><td>400</td><td>₹1,692</td><td>₹6,76,800</td><td>₹7,98,624</td></tr>' +
          '<tr><td>40×10</td><td>400</td><td>₹1,692</td><td>₹6,76,800</td><td>₹7,98,624</td></tr>' +
          '<tr><td>40×12</td><td>480</td><td>₹1,656</td><td>₹7,94,880</td><td>₹9,37,958</td></tr>' +
        '</tbody>' +
      '</table>' +
    '</div>' +
    '<p>All figures confirmed at quotation. GST 18%. Transport is quoted to your pin code before you commit.</p>' +
  '</section>';

export const appendShippingContainerOfficePriceSection = (description: string): string => {
  if (!description.includes(FROZEN_OPENER)) {
    throw new Error('Shipping Container Office frozen opener anchor is missing.');
  }

  return `${description}${PRICE_SECTION}`;
};
