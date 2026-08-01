import {
  buildContainerOfficesShippingHtml,
  buildC04SpecificationsHtml,
} from '@/lib/specsShippingTabs';

const SPECIFICATIONS_INTRO =
  'A site office container is specified for construction-site duty — the frame, envelope and electricals below are the SAMAN container standard, configured for gate placement, site power and repeated relocation between projects.';

const SHIPPING_INTRO =
  'A site office container is usually the first delivery a project takes: dispatched complete from Bangalore or Greater Noida, placed at the gate on a prepared base, and running the same day. Budget freight from the tables below — the quotation fixes the figure to your pin code.';

const WARRANTY_LINE = '12-month workmanship warranty, confirmed at quotation.';

const FROZEN_OPENER_ANCHOR =
  '<p class="font-claude-response-body break-words whitespace-normal leading-[1.7]">Two things determine whether your project site needs a container or a cabin: project duration and site conditions.</p>';

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
    throw new Error('Site Office Container tab intro anchor is missing.');
  }

  return (
    html.slice(0, start) +
    `${opening}${escapeHtml(replacement)}</p>` +
    html.slice(end + 4)
  );
};

export const buildSiteOfficeContainerSpecificationsHtml = (): string => {
  return buildC04SpecificationsHtml('site-office-container');
};

export const buildSiteOfficeContainerShippingHtml = (): string =>
  replaceFirstParagraph(
    buildContainerOfficesShippingHtml(),
    'mb-4 text-sm leading-relaxed text-slate-600',
    SHIPPING_INTRO
  );

const PRICE_SECTION =
  '<section id="site-office-container-price-by-size">' +
    '<h2>Site Office Container Price by Size — Ex-Factory Rates</h2>' +
    '<p>Every site office container is priced from one controlled rate card — ₹1,350 per sq ft at the 200 sq ft reference, stepping +10% below 200 sq ft and down in bands as the floor grows. The full ladder is below so you can budget before you enquire. Prices are ex-factory; interior fit-out and freight are quoted separately at confirmation.</p>' +
    '<div class="overflow-x-auto">' +
      '<table>' +
        '<thead><tr><th>Size (ft)</th><th>Area</th><th>Rate/sq ft</th><th>ex-GST</th><th>incl-GST</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>10×10</td><td>100</td><td>₹1,485</td><td>₹1,48,500</td><td>₹1,75,230</td></tr>' +
          '<tr><td>20×8</td><td>160</td><td>₹1,485</td><td>₹2,37,600</td><td>₹2,80,368</td></tr>' +
          '<tr><td>20×10</td><td>200</td><td>₹1,350</td><td>₹2,70,000</td><td>₹3,18,600</td></tr>' +
          '<tr><td>20×12</td><td>240</td><td>₹1,296</td><td>₹3,11,040</td><td>₹3,67,027</td></tr>' +
          '<tr><td>30×10</td><td>300</td><td>₹1,296</td><td>₹3,88,800</td><td>₹4,58,784</td></tr>' +
          '<tr><td>40×8</td><td>320</td><td>₹1,269</td><td>₹4,06,080</td><td>₹4,79,174</td></tr>' +
          '<tr><td>20×20</td><td>400</td><td>₹1,269</td><td>₹5,07,600</td><td>₹5,98,968</td></tr>' +
          '<tr><td>40×10</td><td>400</td><td>₹1,269</td><td>₹5,07,600</td><td>₹5,98,968</td></tr>' +
          '<tr><td>40×12</td><td>480</td><td>₹1,242</td><td>₹5,96,160</td><td>₹7,03,469</td></tr>' +
        '</tbody>' +
      '</table>' +
    '</div>' +
    '<p>All figures confirmed at quotation. GST 18%. Transport is quoted to your pin code before you commit.</p>' +
  '</section>';

export const insertSiteOfficeContainerPriceSection = (description: string): string => {
  if (!description.includes(FROZEN_OPENER_ANCHOR)) {
    throw new Error('Site Office Container frozen opener anchor is missing.');
  }

  return description.replace(FROZEN_OPENER_ANCHOR, `${FROZEN_OPENER_ANCHOR}${PRICE_SECTION}`);
};
