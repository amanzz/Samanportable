// T31 — Specifications + Shipping tab HTML for the 13 live porta-cabin cluster pages.
//
// The Specifications tab is per-product, driven by src/data/products/specs-tab-dataset.json
// (verbatim spec data, Fable 5 19 Jul 2026). The Shipping tab is shared across all pages
// in the cluster — freight depends on trailer size, not product — and its copy is
// transcribed VERBATIM from the T31 ticket.
//
// Both are returned as HTML strings and rendered by ProductTabs via OptimizedContent
// (dangerouslySetInnerHTML, computed synchronously → present in SSR HTML, crawlable).
// No structured shippingDetails / shipping-rate schema is emitted anywhere — freight is
// quote-confirmed.
//
// SLUG MAP (confirmed against static-migration, reported in the T31 build report):
//   - dataset key `porta-cabin` (singular) ⇒ the live flagship page slug `porta-cabins`
//     (plural). No `porta-cabin` page exists; this is a rename map, not an invention.
//   - dataset key `toilet-porta-cabins` has NO live page: it 301s permanently to
//     porta-cabin-with-toilet (T25 consolidation) and is excluded from the sitemap, so
//     its entry is never rendered. Its spec content is covered by the separate
//     `porta-cabin-with-toilet` entry.
import specsDataset from '@/data/products/specs-tab-dataset.json';

type SpecGroups = Record<string, Record<string, string | number>>;
export interface SpecsEntry {
  product: string;
  cluster: string;
  referenceSize: string;
  groups: SpecGroups;
  fullTechnicalDescription: string;
  commonPlatformSummary: string;
  keyDifferentiator?: string;
}
const DATASET = specsDataset as unknown as Record<string, SpecsEntry>;

// Live page slug → dataset key. Everything else maps to itself.
const PAGE_SLUG_TO_DATASET_KEY: Record<string, string> = {
  'porta-cabins': 'porta-cabin',
};

/** The dataset key for a page slug, or null when the page is not one of the 13 in scope. */
export function resolveSpecsKey(pageSlug: string | undefined | null): string | null {
  if (!pageSlug) return null;
  const key = PAGE_SLUG_TO_DATASET_KEY[pageSlug] || pageSlug;
  return Object.prototype.hasOwnProperty.call(DATASET, key) ? key : null;
}

const esc = (v: string | number): string =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Render order is fixed by the ticket; a group absent from a product is skipped.
const GROUP_ORDER = [
  'Structure & Chassis',
  'Cladding & Sheets',
  'Interior & Insulation',
  'Openings & Services',
  'Layout',
];

function specGroupCard(title: string, fields: Record<string, string | number>): string {
  const rows = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(
      ([label, value]) =>
        `<div class="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:gap-4">` +
          `<dt class="w-full shrink-0 text-sm font-semibold text-slate-700 sm:w-56">${esc(label)}</dt>` +
          `<dd class="text-sm text-slate-600">${esc(value)}</dd>` +
        `</div>`
    )
    .join('');
  if (!rows) return '';
  return (
    `<section class="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">` +
      `<h4 class="mb-3 text-base font-bold text-emerald-900">${esc(title)}</h4>` +
      `<dl class="m-0">${rows}</dl>` +
    `</section>`
  );
}

/** Full Specifications tab body for one product. Renders below ProductTabs' own
    "Technical Specifications" header, replacing the generic placeholder. */
export function buildSpecificationsHtml(entry: SpecsEntry): string {
  const cards = GROUP_ORDER.map((g) => (entry.groups[g] ? specGroupCard(g, entry.groups[g]) : ''))
    .filter(Boolean)
    .join('');

  const referenceNote =
    `<p class="mb-5 text-sm text-slate-500">Specifications shown for the ${esc(entry.referenceSize)} ` +
    `reference size; all nine sizes are built to the same specification unless customised at quotation.</p>`;

  const fullTech =
    `<section class="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">` +
      `<h4 class="mb-2 text-base font-bold text-emerald-900">Full technical specification</h4>` +
      `<p class="m-0 text-sm leading-relaxed text-slate-600">${esc(entry.fullTechnicalDescription)}</p>` +
    `</section>`;

  const platformBand =
    `<section class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">` +
      `<h4 class="mb-2 text-base font-bold text-emerald-900">Built on the SAMAN platform</h4>` +
      `<p class="m-0 text-sm leading-relaxed text-emerald-800">${esc(entry.commonPlatformSummary)}</p>` +
    `</section>`;

  return `<div class="not-prose">${referenceNote}${cards}${fullTech}${platformBand}</div>`;
}

// ─── Shipping tab (shared) — copy VERBATIM from the T31 ticket ────────────────
const SHIPPING_INTRO =
  'Every SAMAN cabin is delivered factory-direct from our Bengaluru (South) or Greater Noida ' +
  '(North) unit on an open trailer, with delivery and installation across South and North India ' +
  'in 7–21 working days. Cabins up to 20 ft travel on a 20 ft open trailer; 30 ft and 40 ft cabins ' +
  'travel on a 40 ft open trailer. Unloading by crane or manual placement is arranged based on your ' +
  'site access and confirmed at quotation.';

const FREE_DELIVERY =
  'Free delivery: within Bangalore city (South zone) · Delhi NCR — Ghaziabad, Gurugram, Faridabad, ' +
  'Noida and Greater Noida (North zone).';

const FOOTNOTES =
  'Distances beyond 1,000 km are quoted at booking. ODC (over-dimensional cargo) charges depend on ' +
  'the state. All freight figures are tentative — the final charge is confirmed once your delivery ' +
  'location and order are confirmed, and may vary slightly with the route and return-vehicle availability.';

// [distance, freight] — 20 ft open trailer
const FREIGHT_20FT: [string, string][] = [
  ['100–150 km', '25,000–30,000'], ['150–200 km', '30,000–35,000'], ['200–250 km', '35,000–40,000'],
  ['250–300 km', '40,000–45,000'], ['300–350 km', '45,000–50,000'], ['350–400 km', '50,000–55,000'],
  ['400–450 km', '55,000–60,000'], ['450–500 km', '60,000–65,000'], ['500–550 km', '65,000–70,000'],
  ['550–600 km', '70,000–75,000'], ['600–650 km', '75,000–80,000'], ['650–700 km', '80,000–85,000'],
  ['700–750 km', '85,000–90,000'], ['750–800 km', '90,000–95,000'], ['800–850 km', '95,000–100,000'],
  ['850–900 km', '100,000–105,000'], ['900–950 km', '105,000–110,000'], ['950–1,000 km', '110,000–115,000'],
];
// [distance, freight] — 40 ft open trailer
const FREIGHT_40FT: [string, string][] = [
  ['100–150 km', '30,000–35,000'], ['150–200 km', '35,000–40,000'], ['200–250 km', '40,000–45,000'],
  ['250–300 km', '45,000–50,000'], ['300–350 km', '50,000–55,000'], ['350–400 km', '55,000–60,000'],
  ['400–450 km', '60,000–65,000'], ['450–500 km', '65,000–70,000'], ['500–550 km', '70,000–75,000'],
  ['550–600 km', '75,000–80,000'], ['600–650 km', '80,000–85,000'], ['650–700 km', '85,000–90,000'],
  ['700–750 km', '90,000–95,000'], ['750–800 km', '95,000–100,000'], ['800–850 km', '100,000–105,000'],
  ['850–900 km', '110,000–115,000'], ['900–950 km', '115,000–120,000'], ['950–1,000 km', '120,000–125,000'],
];
// [city, distance, band] — Bengaluru unit (South zone)
const DEST_SOUTH: [string, string, string][] = [
  ['Mysuru', '~145 km', '100–150 km'], ['Salem', '~215 km', '200–250 km'], ['Tirupati', '~250 km', '250–300 km'],
  ['Mangaluru', '~350 km', '300–350 km'], ['Chennai', '~350 km', '300–350 km'], ['Coimbatore', '~365 km', '350–400 km'],
  ['Hubballi', '~410 km', '400–450 km'], ['Madurai', '~435 km', '400–450 km'], ['Kochi', '~550 km', '500–550 km'],
  ['Goa (Panaji)', '~560 km', '550–600 km'], ['Hyderabad', '~570 km', '550–600 km'], ['Vijayawada', '~630 km', '600–650 km'],
];
// [city, distance, band] — Greater Noida unit (North zone)
const DEST_NORTH: [string, string, string][] = [
  ['Agra', '~165 km', '150–200 km'], ['Haridwar', '~230 km', '200–250 km'], ['Jaipur', '~255 km', '250–300 km'],
  ['Dehradun', '~285 km', '250–300 km'], ['Chandigarh', '~290 km', '250–300 km'], ['Gwalior', '~330 km', '300–350 km'],
  ['Ludhiana', '~390 km', '350–400 km'], ['Kanpur', '~440 km', '400–450 km'], ['Lucknow', '~470 km', '450–500 km'],
  ['Amritsar', '~490 km', '450–500 km'], ['Bhopal', '~600 km', '550–600 km'], ['Varanasi', '~760 km', '750–800 km'],
];

const TH = 'border-b-2 border-slate-300 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-600';
const TD = 'border-b border-slate-100 px-3 py-2 text-sm text-slate-600';

function freightTable(caption: string, rows: [string, string][]): string {
  const body = rows.map(([d, f]) => `<tr><td class="${TD}">${esc(d)}</td><td class="${TD}">${esc(f)}</td></tr>`).join('');
  return (
    `<div class="mb-6 overflow-x-auto">` +
      `<h4 class="mb-2 text-base font-bold text-emerald-900">${esc(caption)}</h4>` +
      `<table class="w-full border-collapse"><thead><tr>` +
        `<th class="${TH}">Distance</th><th class="${TH}">Freight (Rs)</th>` +
      `</tr></thead><tbody>${body}</tbody></table>` +
    `</div>`
  );
}

function destinationTable(caption: string, note: string, rows: [string, string, string][]): string {
  const body = rows
    .map(([c, d, b]) => `<tr><td class="${TD}">${esc(c)}</td><td class="${TD}">${esc(d)}</td><td class="${TD}">${esc(b)}</td></tr>`)
    .join('');
  return (
    `<div class="mb-6 overflow-x-auto">` +
      `<h4 class="mb-1 text-base font-bold text-emerald-900">${esc(caption)}</h4>` +
      `<p class="mb-2 text-xs italic text-slate-500">${esc(note)}</p>` +
      `<table class="w-full border-collapse"><thead><tr>` +
        `<th class="${TH}">City</th><th class="${TH}">Approx. distance</th><th class="${TH}">Freight band</th>` +
      `</tr></thead><tbody>${body}</tbody></table>` +
    `</div>`
  );
}

const DEST_NOTE = 'approximate road distance — find your freight band in the tables above; final charge confirmed at quotation';

// Warranty & Support — Master wording "5–10 years confirmed at quotation" (replaces the
// generic "5-Year Structural / 1-Year Standard" placeholder that shipped before T31).
const WARRANTY_BLOCK =
  `<section class="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-5">` +
    `<h4 class="mb-2 text-base font-bold text-emerald-900">Warranty &amp; Support</h4>` +
    `<p class="m-0 text-sm leading-relaxed text-emerald-800">Structural warranty 5–10 years, confirmed at ` +
    `quotation. Base specification price — customisations quoted separately. After-sales support and ` +
    `spare parts available from our Bengaluru and Greater Noida units.</p>` +
  `</section>`;

/** The shared Shipping tab body (identical on all 13 pages). */
export function buildShippingHtml(): string {
  return (
    `<div class="not-prose space-y-2">` +
      `<p class="mb-4 text-sm leading-relaxed text-slate-600">${esc(SHIPPING_INTRO)}</p>` +
      `<div class="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">` +
        `<span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-green-600" aria-hidden="true"></span>` +
        `<p class="m-0 text-sm font-medium text-emerald-900">${esc(FREE_DELIVERY)}</p>` +
      `</div>` +
      freightTable('20 ft open trailer · freight by distance (both zones)', FREIGHT_20FT) +
      freightTable('40 ft open trailer · freight by distance (both zones)', FREIGHT_40FT) +
      destinationTable('Typical destinations from our Bengaluru unit (South zone)', DEST_NOTE, DEST_SOUTH) +
      destinationTable('Typical destinations from our Greater Noida unit (North zone)', DEST_NOTE, DEST_NORTH) +
      `<p class="mt-2 text-xs leading-relaxed text-slate-500">${esc(FOOTNOTES)}</p>` +
      WARRANTY_BLOCK +
    `</div>`
  );
}

// ─── C-02 Portable Shop Cabin — flat Specifications table (Fable 5 §C, verbatim) ─
// This page is NOT part of the T31 grouped specs dataset. Its Specifications tab is
// a single flat Element/Specification table with a retail-duty intro and three
// retail-fitment rows (shopfront opening, display glazing, service counter) that are
// highlighted but carry NO invented dimensions — configuration stays "to approved
// drawing" exactly as written. Rendered through the SAME specificationsHtml override
// slot the route already reads, so no route change is needed and the 13 porta-cabin
// pages are untouched. Shipping stays the shared buildShippingHtml.
const PSC_SPEC_INTRO =
  'A portable shop cabin uses the same relocatable MS platform as our portable cabin ' +
  'range, specified here for retail duty: the corrugated steel shell and welded frame ' +
  'carry a shopfront opening, service counter and display glazing without losing ' +
  'liftability. The materials and sections below are the shared SAMAN cabin standard; ' +
  'the shop configuration adds the counter and front opening in the approved drawing, ' +
  'so the unit reads as a shopfront yet still travels and re-sites like any portable cabin.';

// [element, specification, isRetailFitment] — verbatim from copy pack §C.
const PSC_SPEC_ROWS: [string, string, boolean][] = [
  ['Primary base frame', '100×50×3 mm MS C-channel (ISI-standard or approved equivalent), welded', false],
  ['Floor framing', 'MS base + cross-member grid supporting 18 mm Bison / cement-fibre board', false],
  ['Top frame', '50×50×1.6 mm MS square-pipe perimeter', false],
  ['Roof stiffeners', '50×50×1.2 mm MS square-pipe + 50×40/40×40/25×25 mm secondary', false],
  ['Corner / wall posts', '50×50×2 mm MS square-pipe (or approved 60×60 mm MS angle)', false],
  ['Exterior wall', '1.2 mm specially corrugated MS sheet', false],
  ['Roof', '1.4 mm corrugated MS sheet', false],
  ['Interior wall', '8 mm pre-laminated MDF with aluminium H-joint sections', false],
  ['Ceiling', '8 mm pre-laminated MDF', false],
  ['Floor board / finish', '18 mm Bison panel + 1.3 mm vinyl flooring', false],
  ['Wall insulation', '25 mm glass wool or 12 mm heatlon', false],
  ['Roof insulation', '50 mm glass wool, ~42 kg/m³', false],
  ['Shopfront opening', 'Roller shutter and/or sliding display window at the front bay, sized to approved drawing', true],
  ['Display glazing', 'Sliding aluminium display window, 4 mm glass', true],
  ['Service counter', 'Fixed front counter shelf; position and height to approved drawing', true],
  ['Door', '7×3 ft externally opening MS-framed, 30×30 mm MS tubular (service/rear door)', false],
  ['Windows', 'Two-track powder-coated aluminium sliding, 4 mm glass', false],
  ['Electrical', 'LED lights, modular switches, 6A/16A sockets, fan + AC provision; signage/display power point on request', false],
  ['Finish', 'Anti-rust enamel, approved colour', false],
  ['Warranty', '5–10 years, confirmed at quotation', false],
];

export function buildPortableShopCabinSpecificationsHtml(): string {
  const rows = PSC_SPEC_ROWS.map(([element, spec, retail]) => {
    const cls = retail ? `${TD} font-semibold text-emerald-900` : TD;
    return `<tr><td class="${cls}">${esc(element)}</td><td class="${cls}">${esc(spec)}</td></tr>`;
  }).join('');
  return (
    `<div class="not-prose">` +
      `<p class="mb-5 text-sm leading-relaxed text-slate-600">${esc(PSC_SPEC_INTRO)}</p>` +
      `<div class="overflow-x-auto">` +
        `<table class="w-full border-collapse"><thead><tr>` +
          `<th class="${TH}">Element</th><th class="${TH}">Specification</th>` +
        `</tr></thead><tbody>${rows}</tbody></table>` +
      `</div>` +
    `</div>`
  );
}

/** Both tab bodies for a page slug, or null when the slug is not in scope. */
export function getProductTabsHtml(
  pageSlug: string | undefined | null
): { specificationsHtml: string; shippingHtml: string } | null {
  // C-02 portable shop cabin — flat spec table + shared shipping.
  if (pageSlug === 'portable-shop-cabin') {
    return {
      specificationsHtml: buildPortableShopCabinSpecificationsHtml(),
      shippingHtml: buildShippingHtml(),
    };
  }
  const key = resolveSpecsKey(pageSlug);
  if (!key) return null;
  return {
    specificationsHtml: buildSpecificationsHtml(DATASET[key]),
    shippingHtml: buildShippingHtml(),
  };
}
