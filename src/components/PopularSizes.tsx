import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

// T7 — "Most In Demand" 8-tab section (SAP-style). Replaces the previous two-card
// PopularSizes. Content authority: page-structure/content-drafts/
// T7_MostInDemand_8Tab_Draft_v1_11Jul2026.md (owner-approved). All 8 tab panels are
// SERVER-RENDERED into the HTML (crawlable) and toggled purely by CSS via hidden radio
// inputs + the general-sibling combinator — NO JavaScript, NO new dependencies, and no
// click-time lazy loading of panel content. With JS disabled the first panel shows and
// every panel's text remains in view-source.
//
// Copy is verbatim from the draft. Prices are pre-authorized: PUF 9-thickness rates and
// cabin/café/labour figures diff-match T6.3/T6.4/T6.5. Image alt text: Tabs 1–4 come
// from the T2.2 image pack; Tabs 5–6 from the T6.12-approved panel alt (owner-authorized
// reuse for Tab 5); Tabs 7–8 are "Launching soon" stand-ins with decorative alt=""
// (owner ruling). Wall/Roof tabs carry NO anchor element until their product pages ship.
// Price-surface disclaimers reuse the approved T6.3 footnotes verbatim.

type Price = { size: string; price: string };
type Tab = {
  key: string;
  name: string;
  href?: string;
  img: string;
  alt: string;
  desc: string;
  bullets: readonly [string, string];
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
  ['40mm', '₹1,150'],
  ['50mm', '₹1,250'],
  ['60mm', '₹1,330'],
  ['80mm', '₹1,470'],
  ['90mm', '₹1,550'],
  ['100mm', '₹1,650'],
  ['120mm', '₹1,850'],
  ['150mm', '₹2,150'],
];

// Cabin / Container Office chips — T6.3 §3. Café chips — T6.4 §1.
const CABIN_PRICES: readonly Price[] = [
  { size: '10×10', price: '₹1.15 L' },
  { size: '20×10', price: '₹2.10 L' },
  { size: '30×10', price: '₹3.15 L' },
  { size: '40×10', price: '₹4.20 L' },
];
const CAFE_PRICES: readonly Price[] = [
  { size: '10×10', price: '₹1.35 L' },
  { size: '20×10', price: '₹2.30 L' },
  { size: '30×10', price: '₹3.45 L' },
  { size: '40×10', price: '₹4.60 L' },
];

// Approved price-surface disclaimer for the cabin group — T6.3 §3 Group B footnote (verbatim).
const CABIN_NOTE =
  'Standard rates ex-GST — 200 sq ft and above ₹1,050/sq ft; smaller units ₹1,150/sq ft. Transport and customisation quoted separately. Final price confirmed at quotation.';
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
    prices: CABIN_PRICES,
    bullets: ['50mm PUF-insulated steel panels', 'Fully relocatable — move it to your next site'],
    cta: 'See all Porta Cabins',
    note: CABIN_NOTE,
  },
  {
    key: 'container-office',
    name: 'Container Office',
    href: '/product/container-offices',
    img: '/homepage/cards/container-office-20ft-construction-site.webp',
    alt: 'New 20 ft container office with grilled windows and AC unit installed at an Indian project site',
    desc: '20 ft and 40 ft container offices built for heavy-duty project sites.',
    prices: CABIN_PRICES,
    bullets: ['AC, wiring and interiors fitted before delivery', 'Ready to move in on arrival'],
    cta: 'See all Container Offices',
    note: CABIN_NOTE,
  },
  {
    key: 'container-cafe',
    name: 'Container Café',
    href: '/product/container-cafe',
    img: '/homepage/cards/container-cafe-food-outlet-service-window.webp',
    alt: 'Modern container café with fold-up service window, counter and outdoor seating at golden hour',
    desc: 'Cafés, kiosks and food outlets delivered ready to open.',
    prices: CAFE_PRICES,
    bullets: ['Branding, plumbing and electrical done at the factory', 'Relocatable — move any time'],
    cta: 'See Container Café options',
    note: CABIN_NOTE,
  },
  {
    key: 'labour',
    name: 'Labour Colony',
    href: '/product/labor-colony',
    img: '/homepage/cards/labour-colony-prefab-worker-accommodation.webp',
    alt: 'Rows of new prefab labour colony units with walkway and drainage at an Indian construction project',
    desc: 'Complete worker accommodation camps, up to G+2.',
    labourLine: 'Ground / G+1 / G+2 · 60×24 to 120×24 ft · from ₹750/sq ft',
    bullets: ['Rooms, toilets and services set up in days', 'Individual units or multi-storey blocks'],
    cta: 'See Labour Colony options',
  },
  {
    key: 'puf',
    name: 'PUF Panels',
    href: '/product/puf-panel',
    img: '/homepage/cards/headers/panels-header.webp',
    alt: 'Insulated sandwich panels manufactured at a SAMAN Portable factory',
    desc: 'Insulated wall and roof panels at factory-direct rates.',
    pufTable: true,
    bullets: ['PPGI-coated PUF sandwich panels', 'Thicknesses 30mm to 150mm'],
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
    thicknessLine: '30 · 40 · 50 · 80 mm, up to 150mm',
    bullets: ['Core options for fire, thermal and acoustic needs', 'Wall and roof profiles'],
    cta: 'Explore Sandwich Panels',
  },
  {
    key: 'wall',
    name: 'Wall Sheets',
    img: '/homepage/cards/headers/panels-header.webp',
    alt: '',
    badge: 'Launching soon',
    desc: 'Decorative and cladding wall sheets in a range of finishes.',
    bullets: ['PVC, UV-marble and cladding options', 'For interiors and building façades'],
  },
  {
    key: 'roof',
    name: 'Roofing Sheets',
    img: '/homepage/cards/panels-factory.webp',
    alt: '',
    badge: 'Launching soon',
    desc: 'Metal, polycarbonate and PVC roofing sheets for every span.',
    bullets: ['Profile and transparent options', 'Pairs with industrial sheds and PEB'],
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
  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
    {prices.map((p) => (
      <div key={p.size} className="rounded-xl border border-[var(--ds-border)] bg-[var(--ds-surface-alt)] px-3 py-2.5 text-center leading-tight">
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
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      {/* Image LEFT (stacks on top < lg). Fixed 4:3 aspect box → space reserved, no CLS. */}
      <div className="lg:w-[44%] lg:flex-shrink-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--ds-border)]">
          <Image src={tab.img} alt={tab.alt} fill sizes="(max-width: 1024px) 100vw, 500px" className="object-cover" loading="lazy" />
        </div>
      </div>

      {/* Details RIGHT */}
      <div className="min-w-0 flex-1">
        {tab.badge && (
          <span className="mb-3 inline-flex items-center rounded-full bg-[var(--ds-surface-alt)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--ds-color-forest)]">
            {tab.badge}
          </span>
        )}
        <h3 className="text-2xl font-bold tracking-tight text-[var(--ds-color-forest)] md:text-3xl">{tab.name}</h3>
        <p className="mt-2 text-base text-[var(--ds-text-secondary)]">{tab.desc}</p>

        {tab.prices && <PriceChips prices={tab.prices} />}
        {tab.labourLine && (
          <div className="mt-5 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--ds-color-forest)]">
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
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--ds-primary)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--ds-color-leaf-dark)]"
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
    <section className="bg-[var(--ds-surface)] py-20 md:py-28">
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
