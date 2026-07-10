import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, LucideIcon } from 'lucide-react';

// "Most In Demand" showcase — Variant A "Dark flagship" (T6.9). Deep-forest full-bleed
// section, centered white heading, cards stacked full-width, full-bleed header photos
// with overlaid titles, 72px row thumbnails, roomier tables. Copy verbatim; links as
// verified; local WebP only (lazy, explicit dims -> 0 CLS). L12: chips/rows link only
// to owning pages. Wall/Roof rows are non-links with a "Launching soon" pill until
// /product/wall-sheet and /product/roofing-sheet return 200.

type Chip = { size: string; price?: string };
type Row = { label: string; href?: string; chips: Chip[]; thumb?: string; icon?: LucideIcon; rateLine?: string; pill?: string };
type RateRow = { t: string; eps: string; puf: string; pir: string };
type TableSpec = { heading: string; cols: string[]; rows: string[][]; note?: string };

const RATE_ROWS: RateRow[] = [
  { t: '30mm', eps: '₹770', puf: '₹1,050', pir: '₹1,410' },
  { t: '40mm', eps: '₹840', puf: '₹1,150', pir: '₹1,550' },
  { t: '50mm', eps: '₹910', puf: '₹1,250', pir: '₹1,680' },
  { t: '60mm', eps: '₹970', puf: '₹1,330', pir: '₹1,790' },
  { t: '80mm', eps: '₹1,070', puf: '₹1,470', pir: '₹1,980' },
  { t: '90mm', eps: '₹1,130', puf: '₹1,550', pir: '₹2,090' },
  { t: '100mm', eps: '₹1,210', puf: '₹1,650', pir: '₹2,220' },
  { t: '120mm', eps: '₹1,350', puf: '₹1,850', pir: '₹2,490' },
  { t: '150mm', eps: '₹1,570', puf: '₹2,150', pir: '₹2,900' },
];

const CABIN_CAFE_RATE: TableSpec = {
  heading: 'Standard rate card — popular sizes, ex-GST',
  cols: ['Size (ft)', 'Area (sq ft)', 'Cabin / Container Office', 'Container Café'],
  rows: [
    ['10×10×8.5', '100', '₹1.15 L', '₹1.35 L'],
    ['20×10×8.5', '200', '₹2.10 L', '₹2.30 L'],
    ['30×10×8.5', '300', '₹3.15 L', '₹3.45 L'],
    ['40×10×8.5', '400', '₹4.20 L', '₹4.60 L'],
  ],
};

const LABOUR_CONFIG: TableSpec = {
  heading: 'Labour colony — 9 standard configurations',
  cols: ['Size (ft)', 'Floors', 'Built-up area (sq ft)'],
  rows: [
    ['60×24×10', 'Ground', '1,440'],
    ['90×24×10', 'Ground', '2,160'],
    ['120×24×10', 'Ground', '2,880'],
    ['60×24×19', 'G+1', '2,880'],
    ['90×24×19', 'G+1', '4,320'],
    ['120×24×19', 'G+1', '5,760'],
    ['60×24×28', 'G+2', '4,320'],
    ['90×24×28', 'G+2', '6,480'],
    ['120×24×28', 'G+2', '8,640'],
  ],
  note: 'Labour colony rate: ₹750/sq ft. Exact configuration and total quoted at site assessment.',
};

const groupA = {
  title: 'PUF & Sandwich Panels',
  subtitle: 'Insulated panels in nine thicknesses — factory-direct rates',
  header: '/homepage/cards/headers/panels-header.webp',
  rows: [
    {
      label: 'PUF Panels',
      href: '/product/puf-panel',
      thumb: '/homepage/cards/thumbs/puf-panels-112.webp',
      chips: [
        { size: '30mm', price: '₹1,050/m²' },
        { size: '40mm', price: '₹1,150/m²' },
        { size: '50mm', price: '₹1,250/m²' },
        { size: '80mm', price: '₹1,470/m²' },
      ],
    },
    {
      label: 'Sandwich Panels',
      href: '/product/sandwich-panel',
      thumb: '/homepage/cards/thumbs/sandwich-panels-112.webp',
      chips: [{ size: '30mm' }, { size: '40mm' }, { size: '50mm' }, { size: '80mm' }],
    },
    { label: 'Wall Sheets', icon: Layers, chips: [], pill: 'Launching soon' },
    { label: 'Roofing Sheets', icon: Layers, chips: [], pill: 'Launching soon' },
  ] as Row[],
  rateHeading: 'Factory rate card — ₹ per m², ex-GST',
  footnote:
    'Rates per m², ex-GST, base specification — freight, installation and accessories quoted separately. Final price confirmed at quotation.',
  cta: { label: 'See all panel sizes & prices', href: '/product/sandwich-panel' },
};

const groupB = {
  title: 'Cabins & Container Offices',
  subtitle: 'Nine standard sizes at standard rates — ready in 7–21 days',
  header: '/homepage/cards/headers/cabins-header.webp',
  rows: [
    { label: 'Container Office', href: '/product/container-offices', thumb: '/homepage/cards/thumbs/container-office-112.webp', chips: [] },
    { label: 'Porta Cabin', href: '/product/porta-cabins', thumb: '/homepage/cards/thumbs/porta-cabin-112.webp', chips: [] },
    { label: 'Container Café', href: '/product/container-cafe', thumb: '/homepage/cards/thumbs/container-cafe-112.webp', chips: [], rateLine: 'From ₹1,150/sq ft' },
    { label: 'Labour Colony', href: '/product/labor-colony', thumb: '/homepage/cards/thumbs/labour-colony-112.webp', chips: [], rateLine: '₹750/sq ft' },
  ] as Row[],
  footnote:
    'Standard rates ex-GST — 200 sq ft and above ₹1,050/sq ft; smaller units ₹1,150/sq ft. Transport and customisation quoted separately. Final price confirmed at quotation.',
  cta: { label: 'See all cabin sizes', href: '/product' },
};

const PANELS_SPEC: TableSpec = {
  heading: groupA.rateHeading,
  cols: ['Thickness', 'EPS Panel', 'PUF Panel', 'PIR Panel'],
  rows: RATE_ROWS.map((r) => [r.t, r.eps, r.puf, r.pir]),
};

const HeaderBand = ({ title, subtitle, header }: { title: string; subtitle: string; header: string }) => (
  <div className="relative h-40 overflow-hidden">
    <Image src={header} alt="" fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D2A] via-[#0A3D2A]/75 to-[#0A3D2A]/20" />
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
      <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h3>
      <p className="mt-1 max-w-[80%] text-sm font-medium text-white/75">{subtitle}</p>
    </div>
  </div>
);

const SizeRow = ({ row }: { row: Row }) => {
  const Icon = row.icon;
  return (
    <div className="py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-shrink-0 items-center gap-4">
          {row.thumb ? (
            <Image src={row.thumb} alt="" width={112} height={112} loading="lazy" className="h-[72px] w-[72px] flex-shrink-0 rounded-2xl object-cover" />
          ) : Icon ? (
            <span className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-2xl bg-[#0A3D2A]/5">
              <Icon className="h-7 w-7 text-[#0A3D2A]" />
            </span>
          ) : null}
          <div>
            <div className="flex items-center gap-2">
              {row.href ? (
                <Link href={row.href} className="text-lg font-bold text-gray-900 transition-colors hover:text-[#0A3D2A]">
                  {row.label}
                </Link>
              ) : (
                <span className="text-lg font-bold text-gray-900">{row.label}</span>
              )}
              {row.pill && <span className="rounded-full bg-[#0A3D2A]/5 px-2.5 py-1 text-[11px] font-semibold text-[#0A3D2A]">{row.pill}</span>}
            </div>
            {row.rateLine && <p className="mt-0.5 text-sm font-bold text-[#0A3D2A]">{row.rateLine}</p>}
          </div>
        </div>
        {row.chips.length > 0 && row.href && (
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-end">
            {row.chips.map((chip) => (
              <Link
                key={chip.size}
                href={row.href as string}
                className="flex flex-col items-center justify-center rounded-xl border border-[#0A3D2A]/10 bg-[#0A3D2A]/[0.04] px-3.5 py-2 text-center leading-tight transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1A6B45] hover:shadow-md"
              >
                <span className="text-sm font-bold text-[#0A3D2A]">{chip.size}</span>
                {chip.price && <span className="mt-0.5 text-xs font-normal text-gray-500">{chip.price}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Decorated, crawlable rate table (roomier cells, 18px prices). Forest header, zebra
// rows, mono right-aligned cells, first column sticky on mobile scroll. Static SSR => 0 CLS.
const RateGrid = ({ spec, minWidth }: { spec: TableSpec; minWidth: number }) => (
  <div className="mt-6">
    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0A3D2A]">{spec.heading}</p>
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full border-collapse text-sm" style={{ minWidth }}>
        <thead>
          <tr className="bg-[#0A3D2A] text-white">
            {spec.cols.map((c, ci) => (
              <th
                key={c}
                scope="col"
                className={
                  ci === 0
                    ? 'sticky left-0 z-10 bg-[#0A3D2A] px-6 py-4 text-left font-mono text-xs font-semibold uppercase tracking-wide'
                    : 'border-l border-white/10 px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide'
                }
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((r, i) => {
            const rowBg = i % 2 === 1 ? 'bg-[#F8FAF9]' : 'bg-white';
            return (
              <tr key={i} className={`${rowBg} transition-colors hover:bg-[#0A3D2A]/5`}>
                {r.map((cell, ci) =>
                  ci === 0 ? (
                    <th key={ci} scope="row" className={`sticky left-0 z-10 ${rowBg} border-r border-gray-100 px-6 py-4 text-left font-mono font-bold text-gray-900`}>
                      {cell}
                    </th>
                  ) : (
                    <td key={ci} className="border-l border-gray-100 px-6 py-4 text-right font-mono text-lg tabular-nums text-gray-700">
                      {cell}
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    {spec.note && <p className="mt-3 text-xs font-light text-gray-500">{spec.note}</p>}
  </div>
);

const CtaBar = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    className="mt-auto flex items-center justify-center gap-2 bg-[#0A3D2A] px-6 py-5 text-base font-bold text-white transition-colors hover:bg-[#082F20]"
  >
    {label}
    <ArrowRight className="h-4 w-4" />
  </Link>
);

type Photo = { src: string; alt: string; caption: string };

// Flex-grow photo panel (T6.12): sits between the footnote and CTA bar of the
// shorter card and absorbs all leftover vertical space so both cards end on the
// same line at >=1024px; fixed 160px when the cards are stacked (<1024px). The
// height is layout-determined (fill image), so there is no CLS.
const PhotoPanel = ({ photo }: { photo: Photo }) => (
  <div className="relative mx-6 mb-4 mt-2 h-40 overflow-hidden rounded-2xl md:mx-8 lg:h-auto lg:min-h-[140px] lg:flex-grow">
    <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" loading="lazy" />
    <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#0A3D2A] shadow-sm">{photo.caption}</span>
  </div>
);

const GroupCard = ({
  data,
  tables,
  photo,
}: {
  data: typeof groupA | typeof groupB;
  tables: { spec: TableSpec; minWidth: number }[];
  photo?: Photo;
}) => (
  <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
    <HeaderBand title={data.title} subtitle={data.subtitle} header={data.header} />
    <div className={`${photo ? '' : 'flex-1 '}px-6 py-6 md:px-8`}>
      <div className="divide-y divide-gray-100">
        {data.rows.map((row) => (
          <SizeRow key={row.label} row={row} />
        ))}
      </div>
      {tables.map((t, i) => (
        <RateGrid key={i} spec={t.spec} minWidth={t.minWidth} />
      ))}
    </div>
    <p className="px-6 pb-5 pt-3 text-xs font-light text-gray-500 md:px-8">{data.footnote}</p>
    {photo && <PhotoPanel photo={photo} />}
    <CtaBar label={data.cta.label} href={data.cta.href} />
  </div>
);

const PopularSizes = () => {
  return (
    <section className="bg-[#0A3D2A] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
            MOST IN DEMAND
          </div>
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
            {"India's most-ordered sizes, ready to quote"}
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-white/70 md:text-xl">
            These configurations ship fastest — standard specifications, fixed base prices, delivery in 7–21 days.
          </p>
        </div>

        {/* Cards side-by-side (stack below lg) — tops and CTA bars aligned via stretch */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          <GroupCard
            data={groupA}
            tables={[{ spec: PANELS_SPEC, minWidth: 460 }]}
            photo={{
              src: '/homepage/cards/panels-factory.webp',
              alt: 'Insulated sandwich panels manufactured at a SAMAN Portable factory',
              caption: 'Manufactured at our Bengaluru & Greater Noida factories',
            }}
          />
          <GroupCard
            data={groupB}
            tables={[
              { spec: CABIN_CAFE_RATE, minWidth: 520 },
              { spec: LABOUR_CONFIG, minWidth: 460 },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default PopularSizes;
