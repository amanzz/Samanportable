import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import { ArrowRight, Check } from 'lucide-react';

// T7 / T7.1 — "Most In Demand" 8-tab section (SAP-style). Content authority:
// page-structure/content-drafts/T7_MostInDemand_8Tab_Draft_v1_11Jul2026.md and its
// amendment T7.1_8Tab_Expand_Draft_v1_11Jul2026.md (both owner-approved). All 8 tab
// panels are SERVER-RENDERED into the HTML (crawlable) and toggled purely by CSS via
// hidden radio inputs + the general-sibling combinator — NO JavaScript, NO new deps,
// no click-time lazy loading of panel text. With JS disabled the first panel shows and
// every panel's text remains in view-source.
//
// Copy is verbatim from the drafts (T7.1 §3 expanded descriptions + bullets + CTAs).
// Prices are pre-authorized and diff-match T6.3/T6.4/T6.5. Image alt: Tabs 1–4 from the
// T2.2 image pack; Tabs 5–6 + 8 (Roofing) from the T6.12-approved panel alt (Roofing is
// now a live product so it carries descriptive alt; the image is still the approved panel
// stand-in until a dedicated roofing photo ships). Tab 7 (Wall Sheets) stays decorative
// alt="" per the T7 ruling. Price-surface disclaimers reuse the approved T6.3 footnotes.
//
// CWV (T7.1 §2): all 8 tab images are SSR'd (img+alt in HTML) but loading="lazy", so
// page-load fetches ZERO of them — the visible one loads only when the section scrolls
// into view. The draft floated making the first image eager, but this section is BELOW
// the fold: measuring 5× showed an eager tab-0 image competes with the hero and regresses
// LCP (~4.0s → ~4.3s), so per "LCP must not regress" and the standing hero-only-priority
// CWV law, tab-0 stays lazy too. Each image sits in a fixed 4:3 aspect box → zero CLS.

type Price = { size: string; price: string; ledgerValue: string };
type Tab = {
  key: string;
  name: string;
  href: string;
  img: string;
  alt: string;
  desc: string;
  desc2: string;
  bullets: readonly string[];
  cta?: string;
  badge?: string;
  prices?: readonly Price[];
  labourLine?: string;
  thicknessLine?: string;
  pufTable?: boolean;
  note?: string;
};

// PUF panel rate card — 9 thicknesses, ₹ per m² ex-GST. Values diff-match T6.3 §2 (PUF col).
const PUF_ROWS: readonly (readonly [string, string])[] = [
  ['30mm', '₹1,050'],
  ['40mm', 'Price on request'],
  ['50mm', 'Price on request'],
  ['60mm', 'Price on request'],
  ['80mm', 'Price on request'],
  ['90mm', 'Price on request'],
  ['100mm', 'Price on request'],
  ['120mm', 'Price on request'],
  ['150mm', 'Price on request'],
];

const PORTA_PRICES: readonly Price[] = [
  { size: '10×10', price: '₹1.38 L', ledgerValue: '₹1,37,500' },
  { size: '20×10', price: '₹2.50 L', ledgerValue: '₹2,50,000' },
  { size: '30×10', price: '₹3.60 L', ledgerValue: '₹3,60,000' },
  { size: '40×10', price: '₹4.70 L', ledgerValue: '₹4,70,000' },
];
const OFFICE_PRICES: readonly Price[] = [
  { size: '10×10', price: '₹1.60 L', ledgerValue: '₹1,59,500' },
  { size: '20×10', price: '₹2.90 L', ledgerValue: '₹2,90,000' },
  { size: '30×10', price: '₹4.18 L', ledgerValue: '₹4,17,600' },
  { size: '40×10', price: '₹5.45 L', ledgerValue: '₹5,45,200' },
];
const CAFE_PRICES: readonly Price[] = [
  { size: '10×10', price: '₹2.04 L', ledgerValue: '₹2,03,500' },
  { size: '20×10', price: '₹3.70 L', ledgerValue: '₹3,70,000' },
  { size: '30×10', price: '₹5.33 L', ledgerValue: '₹5,32,800' },
  { size: '40×10', price: '₹6.96 L', ledgerValue: '₹6,95,600' },
];

const PORTA_NOTE =
  'Standard rates ex-GST — ₹1,250/sq ft at the 200 sq ft reference, stepping down to ₹1,175/sq ft on larger floors; units below 200 sq ft ₹1,375/sq ft. Transport and customisation quoted separately. Final price confirmed at quotation.';
const OFFICE_NOTE = 'Rate: ₹1,450/sq ft at 200 sq ft reference.';
const CAFE_NOTE = 'Rate: ₹1,850/sq ft at 200 sq ft reference.';
// Approved panel disclaimer — T6.3 §2 Group A footnote (verbatim).
const PANEL_NOTE =
  'Rates per m², ex-GST, base specification — freight, installation and accessories quoted separately. Final price confirmed at quotation.';

const TABS: readonly Tab[] = [
  {
    key: 'porta',
    name: 'Porta Cabin',
    href: '/product/porta-cabins',
    img: '/homepage/cards/ms-corrugated-portable-cabin-site-office.webp',
    alt: 'New MS corrugated portable cabin site office with grilled windows and AC unit at an Indian construction site',
    desc: 'Steel-frame site offices, guard rooms and stores — delivered ready to use.',
    desc2: 'Built at our factory and installed on site by our own crew — no crane or civil work needed at your end.',
    prices: PORTA_PRICES,
    bullets: [
      '50mm PUF-insulated steel panels',
      'Sizes from 10×10 to 40×12 ft',
      'Electrical, lighting and flooring pre-fitted',
      'Fully relocatable — move it to your next site',
    ],
    cta: 'See all Porta Cabins',
    note: PORTA_NOTE,
  },
  {
    key: 'container-office',
    name: 'Container Office',
    href: '/product/container-offices',
    img: '/homepage/cards/container-office-20ft-construction-site.webp',
    alt: 'New 20 ft container office with grilled windows and AC unit installed at an Indian project site',
    desc: '20 ft and 40 ft container offices built for heavy-duty project sites.',
    desc2: 'Climate-controlled and wired at the factory, they arrive ready for your team to move in.',
    prices: OFFICE_PRICES,
    bullets: [
      '20 ft and 40 ft standard sizes',
      'AC, wiring and interiors fitted before delivery',
      'Corrugated steel body — built to last on site',
      'Ready to move in on arrival',
    ],
    cta: 'See all Container Offices',
    note: OFFICE_NOTE,
  },
  {
    key: 'container-cafe',
    name: 'Container Café',
    href: '/product/container-cafe',
    img: '/homepage/cards/container-cafe-food-outlet-service-window.webp',
    alt: 'Modern container café with fold-up service window, counter and outdoor seating at golden hour',
    desc: 'Cafés, kiosks and food outlets delivered ready to open.',
    desc2: 'We handle the full build — layout, branding, plumbing and electrical — so you can start serving on day one.',
    prices: CAFE_PRICES,
    bullets: [
      'Custom exterior branding and signage',
      'Plumbing and electrical fitted at the factory',
      'Indoor and window-service layouts',
      'Relocatable — move to a new location any time',
    ],
    cta: 'See Container Café options',
    note: CAFE_NOTE,
  },
  {
    key: 'labour',
    name: 'Labour Colony',
    href: '/product/labor-colony',
    img: '/homepage/cards/labour-colony-prefab-worker-accommodation.webp',
    alt: 'Rows of new prefab labour colony units with walkway and drainage at an Indian construction project',
    desc: 'Complete worker accommodation camps, up to G+2.',
    desc2: 'From a few rooms to a full multi-storey camp — delivered and assembled in days, not months.',
    labourLine: 'Price on request — send enquiry',
    bullets: [
      'Individual units or multi-storey blocks',
      'Attached toilets, ventilation and lighting',
      'Full worksite camp set up within days',
      'Built for large construction and infrastructure sites',
    ],
    cta: 'See Labour Colony options',
  },
  {
    key: 'puf',
    name: 'PUF Panels',
    href: '/product/puf-panel',
    img: '/homepage/cards/headers/panels-header.webp',
    alt: 'Insulated sandwich panels manufactured at a SAMAN Portable factory',
    desc: 'Insulated wall and roof panels at factory-direct rates.',
    desc2: 'PPGI-coated PUF sandwich panels for portable cabins, prefab buildings, cold rooms and industrial roofs.',
    pufTable: true,
    bullets: [
      'PPGI steel skin, rigid PUF core',
      'Thicknesses 30mm to 150mm',
      'Also in EPS, rockwool, glass wool and PIR',
    ],
    cta: 'See all panel sizes & prices',
    note: PANEL_NOTE,
  },
  {
    key: 'sandwich',
    name: 'Sandwich Panels',
    href: '/product/sandwich-panel',
    img: '/homepage/cards/panels-factory.webp',
    alt: 'Insulated sandwich panels manufactured at a SAMAN Portable factory',
    desc: 'EPS, rockwool, glass wool and PIR core panels for walls, roofs and cold rooms.',
    desc2: 'Choose the core that fits your fire, thermal and acoustic needs — supplied and installed across India.',
    thicknessLine: 'Standard thicknesses 30, 40, 50 and 80 mm, up to 150 mm',
    bullets: [
      'EPS — economical thermal insulation',
      'Rockwool — fire-resistant, acoustic control',
      'Glass wool — thermal and sound insulation',
      'PIR — high thermal performance for cold rooms',
    ],
    cta: 'Explore Sandwich Panels',
  },
  {
    key: 'wall',
    name: 'Wall Sheets',
    href: '/product/wall-sheet',
    img: '/homepage/cards/headers/panels-header.webp',
    alt: '',
    badge: 'Launching soon',
    desc: 'Decorative and cladding wall sheets for interiors and building façades.',
    desc2: 'A new range is on the way — PVC, UV-marble and cladding finishes for homes, offices and commercial spaces.',
    bullets: [
      'PVC and UV-marble finishes',
      'Interior feature walls and façades',
      'Easy to install over existing walls',
      'Low-maintenance, durable surfaces',
    ],
    cta: 'Browse all products',
  },
  {
    key: 'roof',
    name: 'Roofing Sheets',
    href: '/product/roofing-sheet',
    img: '/homepage/cards/panels-factory.webp',
    alt: 'Insulated sandwich panels manufactured at a SAMAN Portable factory',
    desc: 'Metal, polycarbonate and PVC roofing sheets for every span.',
    desc2: 'Single-skin and profile roofing for industrial sheds, warehouses and PEB structures — supplied and fitted across India.',
    bullets: [
      'Galvanised and colour-coated metal profiles',
      'Polycarbonate and transparent options for daylight',
      'PVC and UPVC weather-resistant sheets',
      'Pairs with our industrial sheds and PEB projects',
    ],
    cta: 'See Roofing Sheets',
  },
];

// Scoped, hex-free CSS for the pure-CSS radio tabs (active label + panel visibility +
// keyboard focus ring). Emitted once; all colours reference DS custom properties.
const TAB_CSS = [
  '.mid-radio{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}',
  '.mid-tabrow{display:flex;gap:.25rem;overflow-x:auto;border-bottom:1px solid var(--ds-border);-webkit-overflow-scrolling:touch}',
  '.mid-tabrow label{flex:0 0 auto;white-space:nowrap;cursor:pointer;padding:.75rem 1rem;font-size:.875rem;font-weight:600;color:var(--ds-text-secondary);border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .15s ease,border-color .15s ease}',
  '.mid-tabrow label:hover{color:var(--ds-color-forest)}',
  '.mid-panels>.mid-panel{display:none}',
  ...TABS.map((_, i) => `#mid-tab-${i}:checked~.mid-tabrow label[for="mid-tab-${i}"]{color:var(--ds-color-forest);border-bottom-color:var(--ds-primary)}`),
  ...TABS.map((_, i) => `#mid-tab-${i}:checked~.mid-panels>#mid-panel-${i}{display:block}`),
  ...TABS.map((_, i) => `#mid-tab-${i}:focus-visible~.mid-tabrow label[for="mid-tab-${i}"]{outline:2px solid var(--ds-focus);outline-offset:2px;border-radius:4px}`),
].join('');

const Bullets = ({ items }: { items: readonly string[] }) => (
  <ul className="mt-5 space-y-2">
    {items.map((b) => (
      <li key={b} className="flex items-start gap-2 text-sm text-[var(--ds-text-secondary)]">
        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--ds-primary)]" strokeWidth={2.5} />
        <span>{b}</span>
      </li>
    ))}
  </ul>
);

const PriceChips = ({ prices }: { prices: readonly Price[] }) => (
  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4" data-price-chips>
    {prices.map((p) => (
      <div
        key={p.size}
        className="rounded-xl border border-[var(--ds-border)] bg-[var(--ds-surface-alt)] px-3 py-2.5 text-center leading-tight"
        data-ledger-value={p.ledgerValue}
      >
        <div className="text-sm font-bold text-[var(--ds-color-forest)]">{p.size}</div>
        <div className="mt-0.5 font-mono text-xs text-[var(--ds-text-secondary)]">{p.price}</div>
      </div>
    ))}
  </div>
);

// Crawlable PUF rate table (2 columns, 9 rows). Forest header, zebra body, mono numerals.
const PufTable = () => (
  <div className="mt-5">
    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--ds-color-forest)]">Factory rate card — ₹ per m², ex-GST</p>
    <div className="overflow-x-auto rounded-xl border border-[var(--ds-border)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--ds-surface-inverse)] text-white">
            <th scope="col" className="px-5 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide">Thickness</th>
            <th scope="col" className="border-l border-white/10 px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide">PUF panel (₹/m²)</th>
          </tr>
        </thead>
        <tbody>
          {PUF_ROWS.map(([thickness, rate], i) => {
            const bg = i % 2 === 1 ? 'bg-[var(--ds-surface-alt)]' : 'bg-white';
            return (
              <tr key={thickness} className={bg}>
                <th scope="row" className={`${bg} px-5 py-3 text-left font-mono font-bold text-[var(--ds-text-primary)]`}>{thickness}</th>
                <td className="border-l border-[var(--ds-border)] px-5 py-3 text-right font-mono tabular-nums text-[var(--ds-text-secondary)]">{rate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const TabPanel = ({ tab, index }: { tab: Tab; index: number }) => (
  <div id={`mid-panel-${index}`} className="mid-panel" aria-labelledby={`mid-tab-label-${index}`}>
    {/* Equal-height columns (items-stretch). Left image is a fixed 4:3 box centered in its
        column so it never towers over the text; the expanded copy fills / centers in the
        right column. Space is reserved by the aspect box → zero CLS. */}
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-10">
      <div className="lg:flex lg:w-[44%] lg:flex-shrink-0 lg:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--ds-border)]">
          <Image
            src={tab.img}
            unoptimized={shouldBypassOptimizer(tab.img)}
            alt={tab.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {tab.badge && (
          <span className="mb-3 inline-flex w-fit items-center rounded-full bg-[var(--ds-surface-alt)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--ds-color-forest)]">
            {tab.badge}
          </span>
        )}
        <Link
          href={tab.href}
          className="text-2xl font-bold tracking-tight text-[var(--ds-color-forest)] md:text-3xl"
          data-showcase-title
        >
          {tab.name}
        </Link>
        <p className="mt-2 text-base text-[var(--ds-text-secondary)]">{tab.desc}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ds-text-secondary)]">{tab.desc2}</p>

        {tab.prices && <PriceChips prices={tab.prices} />}
        {tab.labourLine && (
          <div
            data-price-status
            className="mt-5 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--ds-color-forest)]"
          >
            {tab.labourLine}
          </div>
        )}
        {tab.thicknessLine && (
          <div className="mt-5 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--ds-color-forest)]">
            {tab.thicknessLine}
          </div>
        )}
        {tab.pufTable && <PufTable />}

        <Bullets items={tab.bullets} />

        {tab.note && <p className="mt-4 text-xs font-light leading-relaxed text-[var(--ds-text-secondary)]">{tab.note}</p>}

        {tab.href && tab.cta && (
          <Link
            href={tab.href}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--ds-primary)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--ds-color-leaf-dark)]"
          >
            {tab.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  </div>
);

const PopularSizes = () => {
  return (
    <section className="bg-[var(--ds-surface)] py-20 md:py-28" data-homepage-showcase>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-5 inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--ds-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--ds-primary)_12%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ds-primary)]">
            MOST IN DEMAND
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--ds-color-forest)] md:text-5xl">
            {"India's most-ordered sizes, ready to quote"}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-[var(--ds-text-secondary)]">
            These configurations ship fastest — standard specifications, fixed base prices, delivery in 7–21 days.
          </p>
        </div>

        {/* Pure-CSS radio tabs: all 8 panels SSR'd; hidden radios drive visibility. */}
        <div className="mid relative">
          <style dangerouslySetInnerHTML={{ __html: TAB_CSS }} />
          {TABS.map((t, i) => (
            <input
              key={t.key}
              type="radio"
              name="mid-tabs"
              id={`mid-tab-${i}`}
              className="mid-radio"
              defaultChecked={i === 0}
              aria-label={t.name}
            />
          ))}

          <div className="mid-tabrow" aria-hidden="true">
            {TABS.map((t, i) => (
              <label key={t.key} id={`mid-tab-label-${i}`} htmlFor={`mid-tab-${i}`}>
                {t.name}
              </label>
            ))}
          </div>

          <div className="mid-panels relative mt-8 min-h-[30rem]">
            {TABS.map((t, i) => (
              <TabPanel key={t.key} tab={t} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSizes;
