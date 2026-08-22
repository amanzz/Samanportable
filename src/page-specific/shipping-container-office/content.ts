import {
  buildContainerOfficesShippingHtml,
  buildC04SpecificationsHtml,
} from '@/lib/specsShippingTabs';

const SPECIFICATIONS_NARRATIVE =
  'Read these two tables as a pair. The first fixes what the shell is and what it can take. The second fixes what you get inside it and what you still have to buy. Two numbers matter more than the rest. The 1.6 mm skin is what separates this product from a 0.5 mm panel cabin. The 60 x 60 x 3 mm boxed posts are what make a cut opening safe in a wall that used to be continuous. Sizes and grades below are the approved starting values for a standard unit. Final member sizes, loads, lifting points and electrical design follow the signed quotation and project engineering.';

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
  const table = (title: string, rows: [string, string][]) =>
    '<section class="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">' +
      `<h4 class="m-0 bg-slate-50 px-4 py-3 text-base font-bold text-emerald-900">${title}</h4>` +
      '<div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr><th class="border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700">Item</th><th class="border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700">Approved value</th></tr></thead><tbody>' +
      rows.map(([item, value]) => `<tr><td class="border border-slate-200 px-4 py-3 align-top text-sm font-semibold text-slate-700">${item}</td><td class="border border-slate-200 px-4 py-3 align-top text-sm text-slate-600">${value}</td></tr>`).join('') +
      '</tbody></table></div></section>';
  const figure = (src: string, alt: string) =>
    `<figure class="mt-4 m-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><img src="${src}" alt="${alt}" width="1920" height="1080" loading="lazy" class="w-full h-auto rounded-lg" /><figcaption class="mt-2 text-xs italic text-slate-500">Illustrative - not for construction. Diagram v1.1, issued 22 August 2026.</figcaption></figure>`;
  return '<div class="not-prose">' +
    `<p class="mb-5 text-sm leading-relaxed text-slate-600">${SPECIFICATIONS_NARRATIVE}</p>` +
    table('Shell, structure, envelope, roof and floor', [
      ['External sizes', '20x8, 20x10, 20x12, 30x10, 40x8 and 40x10 ft, all 8 ft 6 in external height'],
      ['Finished wall thickness', '100 mm'],
      ['Bottom frame', '150 x 75 x 5 mm MS C-channel'],
      ['Bottom stiffeners', '100 x 50 x 4 mm channels with 80 x 40 x 3 mm cross members and local reinforcement'],
      ['Floor frame', '100 x 50 x 3 mm primary members, 80 x 40 x 3 mm secondary members'],
      ['Top frame', '80 x 40 x 3 mm MS rectangular-pipe top perimeter'],
      ['Corner posts and opening frame', '60 x 60 x 3 mm MS square-pipe posts, 80 x 40 x 3 mm boxed head at each cut-out'],
      ['Roof stiffeners', '60 x 40 x 2.5 mm rafters and purlins'],
      ['Exterior wall skin', '1.6 mm corrugated MS sheet, vertical profile'],
      ['Roof sheet', '1.6 mm corrugated MS sheet'],
      ['Roof family', 'Flat ISO container roof with container corner posts and ISO corner castings'],
      ['Floor base', '24 mm cement board or heavy MS floor plate'],
      ['Floor finish', '2 to 3 mm commercial PVC, epoxy, or 3 mm chequered plate'],
      ['Coating system', 'One red-oxide primer coat plus two compatible anti-rust enamel coats on prepared MS'],
      ['Fabrication control', 'Welded MS fabrication, cleaned joints, safe edges, dimensional inspection, coating touch-up before dispatch'],
    ]) +
    figure('/images/products/shipping-container-office/diagrams/01-container-office-opening-reinforcement-diagram.png', 'Diagram of a shipping container office wall: outer skin, mineral wool, inner lining and boxed opening frame') +
    table('Insulation, interior, openings, services and scope', [
      ['Wall insulation', '50 to 75 mm mineral wool, fitted around corrugations and conversion steel'],
      ['Roof insulation', '75 to 100 mm mineral wool on pins and retainers'],
      ['Interior lining', '8 to 10 mm fibre-cement board or 0.50 mm pre-painted metal liner'],
      ['Ceiling', '8 mm fibre-cement ceiling or 0.50 mm metal liner, removable panels at service points'],
      ['External door', '3 x 7 ft heavy single or double-leaf MS door with industrial lockset; corrugation, profile and colour matched to the adjacent wall'],
      ['Internal partition door', '3 x 7 ft, on 40x8 and 40x10 only, one per unit'],
      ['Windows', '4 x 3 ft reduced-size aluminium with 5 mm glass, boxed frame and drained sill; sill 3 ft 6 in, head 6 ft 6 in'],
      ['Opening counts by size', '20x8, 20x10 and 20x12: 1 door and 6 windows. 30x10: 2 doors and 8 windows. 40x8 and 40x10: 2 external doors, 1 internal door and 10 windows'],
      ['Electrical wiring', 'Concealed PVC-insulated copper: 1.5 sq mm lighting, 2.5 sq mm sockets, 4 sq mm AC and higher load, subject to the final load schedule'],
      ['Electrical protection', 'Distribution board with MCB and RCCB protection, protective earthing, segregated lighting, socket and AC circuits'],
      ['Electrical fittings', 'LED ceiling lights, data points, UPS provision, 6A and 16A sockets, fan points, dedicated AC circuit'],
      ['Ventilation and cooling', 'Cross ventilation through controlled openings, wall or ceiling fans, split-AC provision'],
      ['Plumbing and sanitary', 'EXCLUDED unless shown in the approved scope; framed and sealed penetrations required where included'],
      ['Lifting provision', 'Designed MS lifting hooks or lugs matched to the finished unit weight, issued with an approved lifting and support-point drawing'],
      ['Quality checks and warranty', 'Pre-dispatch checks on dimensions, welds, coating, roof drainage, sealing, doors, windows and electrical function. Warranty period and exclusions confirmed in the final quotation only'],
    ]) +
    figure('/images/products/shipping-container-office/diagrams/02-container-office-electrical-ventilation-diagram.png', 'Diagram of window, electrical and ventilation integration in a shipping container office shell') +
  '</div>';
};

export const buildShippingContainerOfficeShippingHtml = (): string =>
  buildContainerOfficesShippingHtml();

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
