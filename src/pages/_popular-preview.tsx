import React from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  groupA,
  groupB,
  RATE_ROWS,
  CABIN_CAFE_RATE,
  LABOUR_CONFIG,
  type Row,
  type TableSpec,
} from '@/components/PopularSizes';

/**
 * /_popular-preview — HIDDEN preview (noindex, not linked anywhere). Renders TWO
 * full visual variants of the "Most In Demand" section, one above the other, so the
 * owner can pick. Text comes verbatim from the shared PopularSizes data (byte-identical
 * to the live section). The homepage stays on its current design until a variant is chosen.
 */

const PANELS_SPEC: TableSpec = {
  heading: groupA.rateHeading,
  cols: ['Thickness', 'EPS Panel', 'PUF Panel', 'PIR Panel'],
  rows: RATE_ROWS.map((r) => [r.t, r.eps, r.puf, r.pir]),
};

type VCfg = {
  key: string;
  label: string;
  section: string;
  container: string;
  eyebrow: string;
  h2: string;
  intro: string;
  cardsWrap: string;
  card: string;
  contentPad: string;
  headerH: string;
  nameSize: string;
  chipText: string;
  cellPad: string;
  priceText: string;
  hairline: boolean; // true = column borders; false = zebra-only
  footnote: string;
  cta: string;
};

const VARIANT_A: VCfg = {
  key: 'A',
  label: 'VARIANT A — Dark flagship',
  section: 'bg-[#0A3D2A] py-20 md:py-28',
  container: 'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8',
  eyebrow: 'mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white',
  h2: 'mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl',
  intro: 'mx-auto max-w-2xl text-lg font-light leading-relaxed text-white/70 md:text-xl',
  cardsWrap: 'flex flex-col gap-8',
  card: 'flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl',
  contentPad: 'flex-1 px-10 py-8 md:px-12',
  headerH: 'h-[200px]',
  nameSize: 'text-lg',
  chipText: 'text-sm',
  cellPad: 'px-6 py-4',
  priceText: 'text-lg',
  hairline: true,
  footnote: 'px-10 pb-5 pt-3 text-xs font-light text-gray-500 md:px-12',
  cta: 'mt-auto flex items-center justify-center gap-2 bg-[#0A3D2A] px-6 py-5 text-base font-bold text-white transition-colors hover:bg-[#082F20]',
};

const VARIANT_B: VCfg = {
  key: 'B',
  label: 'VARIANT B — Light editorial',
  section: 'bg-[#F8FAF9] py-20 md:py-28',
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  eyebrow: 'mb-6 inline-flex items-center gap-2 rounded-full border border-[#0A3D2A]/10 bg-[#0A3D2A]/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0A3D2A]',
  h2: 'mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-7xl',
  intro: 'mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-600 md:text-xl',
  cardsWrap: 'grid grid-cols-1 items-stretch gap-8 md:grid-cols-2',
  card: 'flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-[#0A3D2A]/5',
  contentPad: 'flex-1 px-9 py-6 md:px-12',
  headerH: 'h-40',
  nameSize: 'text-lg',
  chipText: 'text-sm',
  cellPad: 'px-5 py-4',
  priceText: 'text-base',
  hairline: false,
  footnote: 'px-9 pb-5 pt-3 text-xs font-light text-gray-500 md:px-12',
  cta: 'mt-auto flex items-center justify-center gap-2 bg-[#0A3D2A] px-6 py-5 text-base font-bold text-white transition-colors hover:bg-[#082F20]',
};

const HeaderBand = ({ title, subtitle, header, cfg }: { title: string; subtitle: string; header: string; cfg: VCfg }) => (
  <div className={`relative ${cfg.headerH} overflow-hidden`}>
    <Image src={header} alt="" fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D2A] via-[#0A3D2A]/75 to-[#0A3D2A]/20" />
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
      <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h3>
      <p className="mt-1 max-w-[80%] text-sm font-medium text-white/75">{subtitle}</p>
    </div>
  </div>
);

const PreviewRow = ({ row, cfg }: { row: Row; cfg: VCfg }) => {
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
                <Link href={row.href} className={`${cfg.nameSize} font-bold text-gray-900 transition-colors hover:text-[#0A3D2A]`}>
                  {row.label}
                </Link>
              ) : (
                <span className={`${cfg.nameSize} font-bold text-gray-900`}>{row.label}</span>
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
                <span className={`${cfg.chipText} font-bold text-[#0A3D2A]`}>{chip.size}</span>
                {chip.price && <span className="mt-0.5 text-xs font-normal text-gray-500">{chip.price}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PreviewTable = ({ spec, cfg, minWidth }: { spec: TableSpec; cfg: VCfg; minWidth: number }) => {
  const colBorder = cfg.hairline ? 'border-l border-white/10' : '';
  const cellBorder = cfg.hairline ? 'border-l border-gray-100' : '';
  return (
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
                      ? `sticky left-0 z-10 bg-[#0A3D2A] ${cfg.cellPad} text-left font-mono text-xs font-semibold uppercase tracking-wide`
                      : `${colBorder} ${cfg.cellPad} text-right text-xs font-semibold uppercase tracking-wide`
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
                      <th key={ci} scope="row" className={`sticky left-0 z-10 ${rowBg} ${cfg.hairline ? 'border-r border-gray-100' : ''} ${cfg.cellPad} text-left font-mono font-bold text-gray-900`}>
                        {cell}
                      </th>
                    ) : (
                      <td key={ci} className={`${cellBorder} ${cfg.cellPad} text-right font-mono tabular-nums text-gray-700 ${cfg.priceText}`}>
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
};

const Cta = ({ label, href, cfg }: { label: string; href: string; cfg: VCfg }) => (
  <Link href={href} className={cfg.cta}>
    {label}
    <ArrowRight className="h-4 w-4" />
  </Link>
);

const GroupCard = ({
  data,
  tables,
  cfg,
}: {
  data: typeof groupA | typeof groupB;
  tables: { spec: TableSpec; minWidth: number }[];
  cfg: VCfg;
}) => (
  <div className={cfg.card}>
    <HeaderBand title={data.title} subtitle={data.subtitle} header={data.header} cfg={cfg} />
    <div className={cfg.contentPad}>
      <div className="divide-y divide-gray-100">
        {data.rows.map((row) => (
          <PreviewRow key={row.label} row={row} cfg={cfg} />
        ))}
      </div>
      {tables.map((t, i) => (
        <PreviewTable key={i} spec={t.spec} minWidth={t.minWidth} cfg={cfg} />
      ))}
    </div>
    <p className={cfg.footnote}>{data.footnote}</p>
    <Cta label={data.cta.label} href={data.cta.href} cfg={cfg} />
  </div>
);

const Variant = ({ cfg }: { cfg: VCfg }) => (
  <section className={cfg.section}>
    <div className={cfg.container}>
      <div className="mb-12 text-center md:mb-16">
        <div className={cfg.eyebrow}>MOST IN DEMAND</div>
        <h2 className={cfg.h2}>{"India's most-ordered sizes, ready to quote"}</h2>
        <p className={cfg.intro}>
          These configurations ship fastest — standard specifications, fixed base prices, delivery in 7–21 days.
        </p>
      </div>
      <div className={cfg.cardsWrap}>
        <GroupCard data={groupA} tables={[{ spec: PANELS_SPEC, minWidth: 460 }]} cfg={cfg} />
        <GroupCard
          data={groupB}
          tables={[
            { spec: CABIN_CAFE_RATE, minWidth: 520 },
            { spec: LABOUR_CONFIG, minWidth: 460 },
          ]}
          cfg={cfg}
        />
      </div>
    </div>
  </section>
);

const PopularPreview = () => (
  <>
    <NextSeo noindex nofollow title="Popular Sizes — variant preview (internal)" />
    <main>
      <div className="bg-gray-900 px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-white">{VARIANT_A.label}</div>
      <Variant cfg={VARIANT_A} />
      <div className="bg-gray-900 px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-white">{VARIANT_B.label}</div>
      <Variant cfg={VARIANT_B} />
    </main>
  </>
);

export default PopularPreview;
