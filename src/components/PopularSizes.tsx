import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// T6.1 — "Most In Demand" showcase. Copy verbatim from the draft §2, design per §3.
// L12: variants render in-page only; every chip/row links to its OWNING page only
// (no variant URLs, no new routes). All hrefs below verified 200 on the local build.
//
// Reserved (owner 10 Jul 2026): the "Wall Sheets" -> /product/wall-sheet and
// "Roof Sheets" -> /product/roofing-sheet rows are intentionally omitted until
// those two pages go live (~2 days), because CLAUDE.md forbids linking to
// not-yet-live pages. Add both rows to groupA.rows once each returns 200.

type Chip = { size: string; price?: string };
type Row = { label: string; href: string; chips: Chip[] };

const CABIN_CHIPS: Chip[] = [
  { size: '10x10x8.5' },
  { size: '20x10x8.5' },
  { size: '30x10x8.5' },
  { size: '40x10x8.5' },
];

const groupA: { title: string; rows: Row[]; footnote: string; cta: { label: string; href: string } } = {
  title: 'PUF & Sandwich Panels',
  rows: [
    {
      label: 'PUF Panels',
      href: '/product/puf-panel',
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
      chips: [{ size: '40mm' }, { size: '50mm' }, { size: '60mm' }, { size: '80mm' }],
    },
  ],
  footnote: 'Prices per m², ex-GST, base specification — confirmed at quotation.',
  cta: { label: 'See all panel sizes & prices', href: '/product/sandwich-panel' },
};

const groupB: { title: string; rows: Row[]; cta: { label: string; href: string } } = {
  title: 'Cabins & Container Offices',
  rows: [
    { label: 'Container Office', href: '/product/container-offices', chips: CABIN_CHIPS },
    { label: 'Porta Cabin', href: '/product/porta-cabins', chips: CABIN_CHIPS },
    { label: 'Container Café', href: '/product/container-cafe', chips: [] },
    { label: 'Labour Colony', href: '/product/labor-colony', chips: [] },
  ],
  cta: { label: 'See all cabin sizes', href: '/product' },
};

const chipClass =
  'inline-flex items-center rounded-full bg-[#0A3D2A]/5 px-3 py-1.5 text-sm text-[#0A3D2A] transition-colors hover:bg-[#0A3D2A]/10';

const SizeRow = ({ row }: { row: Row }) => (
  <div className="py-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={row.href}
        className="text-base font-bold text-gray-900 transition-colors hover:text-[#0A3D2A]"
      >
        {row.label}
      </Link>
      {row.chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {row.chips.map((chip) => (
            <Link key={chip.size} href={row.href} className={chipClass}>
              <span className="font-bold">{chip.size}</span>
              {chip.price && <span className="ml-1.5 font-normal">{chip.price}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
);

const PopularSizes = () => {
  return (
    <section className="bg-white py-16 md:py-24">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Group A */}
          <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-lg md:rounded-[2rem] md:p-8">
            <h3 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">{groupA.title}</h3>
            <div className="divide-y divide-gray-100">
              {groupA.rows.map((row) => (
                <SizeRow key={row.label} row={row} />
              ))}
            </div>
            <p className="mt-4 text-xs font-light text-gray-500">{groupA.footnote}</p>
            <Link
              href={groupA.cta.href}
              className="group mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-[#0A3D2A] transition-colors hover:text-[#082F20]"
            >
              {groupA.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Group B */}
          <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-lg md:rounded-[2rem] md:p-8">
            <h3 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">{groupB.title}</h3>
            <div className="divide-y divide-gray-100">
              {groupB.rows.map((row) => (
                <SizeRow key={row.label} row={row} />
              ))}
            </div>
            <Link
              href={groupB.cta.href}
              className="group mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-[#0A3D2A] transition-colors hover:text-[#082F20]"
            >
              {groupB.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSizes;
