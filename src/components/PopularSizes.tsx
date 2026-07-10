import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, SquareStack, LucideIcon } from 'lucide-react';

// T6.3 — "Most In Demand" showcase with header subtitles, a decorated panels rate
// table (Group A) and standard cabin rates (Group B). Copy verbatim from the T6.3
// draft v2; all other copy byte-identical to T6.2. Links unchanged. No remote images
// (tiny local WebP, lazy, explicit dims). L12: chips/rows link only to owning pages.
//
// Reserved (owner 10 Jul 2026): "Wall Sheets" -> /product/wall-sheet and
// "Roof Sheets" -> /product/roofing-sheet rows stay omitted until those pages are live.

type Chip = { size: string; price?: string };
type Row = { label: string; href: string; chips: Chip[]; thumb?: string; icon?: LucideIcon; rateLine?: string };
type RateRow = { t: string; eps: string; puf: string; pir: string };

const CABIN_CHIPS: Chip[] = [
  { size: '10x10x8.5', price: '₹1.15 L' },
  { size: '20x10x8.5', price: '₹2.10 L' },
  { size: '30x10x8.5', price: '₹3.15 L' },
  { size: '40x10x8.5', price: '₹4.20 L' },
];

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

const groupA = {
  title: 'PUF & Sandwich Panels',
  subtitle: 'Insulated panels in nine thicknesses — factory-direct rates',
  header: '/homepage/cards/headers/panels-header.webp',
  rows: [
    {
      label: 'PUF Panels',
      href: '/product/puf-panel',
      icon: Layers,
      chips: [
        { size: '40mm', price: '₹1,150/m²' },
        { size: '50mm', price: '₹1,250/m²' },
        { size: '60mm', price: '₹1,330/m²' },
        { size: '80mm', price: '₹1,470/m²' },
      ],
    },
    {
      label: 'Sandwich Panels',
      href: '/product/sandwich-panel',
      icon: SquareStack,
      chips: [{ size: '40mm' }, { size: '50mm' }, { size: '60mm' }, { size: '80mm' }],
    },
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
    { label: 'Container Office', href: '/product/container-offices', thumb: '/homepage/cards/thumbs/container-office-112.webp', chips: CABIN_CHIPS },
    { label: 'Porta Cabin', href: '/product/porta-cabins', thumb: '/homepage/cards/thumbs/porta-cabin-112.webp', chips: CABIN_CHIPS },
    { label: 'Container Café', href: '/product/container-cafe', thumb: '/homepage/cards/thumbs/container-cafe-112.webp', chips: [], rateLine: 'From ₹1,150/sq ft' },
    { label: 'Labour Colony', href: '/product/labor-colony', thumb: '/homepage/cards/thumbs/labour-colony-112.webp', chips: [], rateLine: '₹750/sq ft' },
  ] as Row[],
  footnote:
    'Standard rates ex-GST — 200 sq ft and above ₹1,050/sq ft; smaller units ₹1,150/sq ft. Transport and customisation quoted separately. Final price confirmed at quotation.',
  cta: { label: 'See all cabin sizes', href: '/product' },
};

const tileClass =
  'flex flex-col items-center justify-center rounded-xl border border-[#0A3D2A]/10 bg-[#0A3D2A]/[0.04] px-3 py-2 text-center leading-tight transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1A6B45] hover:shadow-md';

const SizeRow = ({ row }: { row: Row }) => {
  const Icon = row.icon;
  return (
    <div className="py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-shrink-0 items-center gap-3">
          {row.thumb ? (
            <Image
              src={row.thumb}
              alt=""
              width={112}
              height={112}
              loading="lazy"
              className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
            />
          ) : Icon ? (
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#0A3D2A]/5">
              <Icon className="h-6 w-6 text-[#0A3D2A]" />
            </span>
          ) : null}
          <div>
            <Link href={row.href} className="text-base font-bold text-gray-900 transition-colors hover:text-[#0A3D2A]">
              {row.label}
            </Link>
            {row.rateLine && <p className="mt-0.5 text-sm font-bold text-[#0A3D2A]">{row.rateLine}</p>}
          </div>
        </div>
        {row.chips.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-end">
            {row.chips.map((chip) => (
              <Link key={chip.size} href={row.href} className={tileClass}>
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

const GroupHeader = ({ title, subtitle, header }: { title: string; subtitle: string; header: string }) => (
  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#0A3D2A] to-[#1A6B45] md:h-36">
    <div className="absolute inset-y-0 right-0 w-1/2">
      <Image src={header} alt="" fill sizes="(max-width: 768px) 50vw, 240px" className="object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D2A] via-[#0A3D2A]/60 to-transparent" />
    </div>
    <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-8">
      <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h3>
      <p className="mt-1 max-w-[62%] text-sm font-medium text-white/70">{subtitle}</p>
    </div>
  </div>
);

// Decorated, crawlable rate table (Group A). Forest header, zebra rows, mono prices,
// thickness column sticky on mobile horizontal scroll. Static SSR => zero CLS.
const RateTable = () => (
  <div className="mt-6">
    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0A3D2A]">{groupA.rateHeading}</p>
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full min-w-[440px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#0A3D2A] text-white">
            <th scope="col" className="sticky left-0 z-10 bg-[#0A3D2A] px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide">
              Thickness
            </th>
            <th scope="col" className="border-l border-white/10 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">EPS Panel</th>
            <th scope="col" className="border-l border-white/10 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">PUF Panel</th>
            <th scope="col" className="border-l border-white/10 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">PIR Panel</th>
          </tr>
        </thead>
        <tbody>
          {RATE_ROWS.map((r, i) => {
            const rowBg = i % 2 === 1 ? 'bg-[#F8FAF9]' : 'bg-white';
            return (
              <tr key={r.t} className={`${rowBg} transition-colors hover:bg-[#0A3D2A]/5`}>
                <th scope="row" className={`sticky left-0 z-10 ${rowBg} border-r border-gray-100 px-4 py-3 text-left font-mono font-bold text-gray-900`}>
                  {r.t}
                </th>
                <td className="border-l border-gray-100 px-4 py-3 text-right font-mono tabular-nums text-gray-700">{r.eps}</td>
                <td className="border-l border-gray-100 px-4 py-3 text-right font-mono tabular-nums text-gray-700">{r.puf}</td>
                <td className="border-l border-gray-100 px-4 py-3 text-right font-mono tabular-nums text-gray-700">{r.pir}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const CtaBar = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    className="mt-auto flex items-center justify-center gap-2 bg-[#0A3D2A] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#082F20]"
  >
    {label}
    <ArrowRight className="h-4 w-4" />
  </Link>
);

const Footnote = ({ text }: { text: string }) => (
  <p className="px-6 pb-4 pt-4 text-xs font-light text-gray-500 md:px-8">{text}</p>
);

const PopularSizes = () => {
  return (
    <section className="bg-[#F8FAF9] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0A3D2A]/10 bg-[#0A3D2A]/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0A3D2A]">
            MOST IN DEMAND
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {"India's most-ordered sizes, ready to quote"}
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-600">
            These configurations ship fastest — standard specifications, fixed base prices, delivery in 7–21 days.
          </p>
        </div>

        {/* Two group cards */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-8">
          {/* Group A */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl md:rounded-[2rem]">
            <GroupHeader title={groupA.title} subtitle={groupA.subtitle} header={groupA.header} />
            <div className="flex-1 px-6 md:px-8">
              <div className="divide-y divide-gray-100">
                {groupA.rows.map((row) => (
                  <SizeRow key={row.label} row={row} />
                ))}
              </div>
              <RateTable />
            </div>
            <Footnote text={groupA.footnote} />
            <CtaBar label={groupA.cta.label} href={groupA.cta.href} />
          </div>

          {/* Group B */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl md:rounded-[2rem]">
            <GroupHeader title={groupB.title} subtitle={groupB.subtitle} header={groupB.header} />
            <div className="flex-1 px-6 md:px-8">
              <div className="divide-y divide-gray-100">
                {groupB.rows.map((row) => (
                  <SizeRow key={row.label} row={row} />
                ))}
              </div>
            </div>
            <Footnote text={groupB.footnote} />
            <CtaBar label={groupB.cta.label} href={groupB.cta.href} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSizes;
