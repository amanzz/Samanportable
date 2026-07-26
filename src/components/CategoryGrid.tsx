import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Home,
  Briefcase,
  Container,
  Coffee,
  Users,
  Warehouse,
  Shield,
  Droplets,
  Factory,
  HardHat,
  Building,
  Blocks,
  Layers,
  SquareStack,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

// T6.21b — homepage product category grid, LIGHT theme (owner directive): white section
// background, black (ink) headings, dark-gray (steel) descriptions, solid brand-green
// icons set in light-green (mist) tiles, and solid-green count chips. One crawlable
// <a> tile per published category, mirroring the header's Browse Categories set, plus
// Sandwich Panels as the last tile. Names/hrefs/live counts are unchanged from T6.18;
// the 16 two-line descriptions are the only new indexable copy and come verbatim from
// the approved draft (T6.19 v2 §2). Counts are read from the real category data at
// build time (getStaticProps in index.tsx) and passed via `counts` — never hardcoded.
// Sandwich tile wiring (draft §3): the sandwich-panel category exists in the data, so
// the tile links to /product/sandwich-panel (200-verified) and shows its live count;
// the count-presence check below degrades to "no chip" automatically if it ever
// stops existing, so the tile is never a dead link and never shows an invented count.

export type CategoryDef = {
  name: string;
  slug: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const CATEGORIES: CategoryDef[] = [
  { name: 'Porta Cabins', slug: 'porta-cabins', href: '/product/porta-cabins', icon: Building2, description: 'The standard welded-steel cabin range — site offices and rooms, 9 sizes, delivered in 7–21 working days.' },
  { name: 'Portable Cabin', slug: 'portable-cabin', href: '/product/portable-cabin', icon: Home, description: 'Cabins engineered to lift, relocate and reuse across sites — choose this when the unit will move.' },
  { name: 'Portable Office', slug: 'portable-office', href: '/product/portable-office', icon: Briefcase, description: 'Fitted office cabins — workstations, electricals and AC provision, working from day one.' },
  { name: 'Container Offices', slug: 'container-offices', href: '/product/container-offices', icon: Container, description: 'Container-form and converted ISO offices for industrial duty, yards and hard sites.' },
  { name: 'Container Cafe', slug: 'container-cafe', href: '/product/container-cafe', icon: Coffee, description: 'Cafes, restaurants and food-truck units built for food businesses.' },
  { name: 'Labour Colony', slug: 'labor-colony', href: '/product/labor-colony', icon: Users, description: 'Workforce housing at project scale — colonies, sheds, hutments and camps.' },
  { name: 'Container Houses', slug: 'container-houses', href: '/product/container-houses', icon: Warehouse, description: 'Container-format homes — studios to full residences built from container modules.' },
  { name: 'Security Cabins', slug: 'security-cabins', href: '/product/security-cabins', icon: Shield, description: 'Guard posts and security kiosks.' },
  { name: 'Portable Toilet', slug: 'portable-toilet', href: '/product/portable-toilet', icon: Droplets, description: 'Standalone sanitation units — single seaters to multi-cubicle blocks.' },
  { name: 'Industrial Sheds', slug: 'industrial-sheds', href: '/product/industrial-sheds', icon: Factory, description: 'Sheds, garden sheds and prefabricated warehouses.' },
  { name: 'PEB Construction', slug: 'peb-constructions', href: '/product/peb-constructions', icon: HardHat, description: 'Design-to-erection pre-engineered building projects, managed end to end by our team.' },
  { name: 'Pre-Engineered Buildings', slug: 'pre-engineered-buildings', href: '/product/pre-engineered-buildings', icon: Building, description: 'Steel-framed factories, warehouses and industrial buildings, engineered to span.' },
  { name: 'Prefab Building', slug: 'prefab-buildings', href: '/product/prefab-buildings', icon: Blocks, description: 'Modular buildings for schools, offices, healthcare and site facilities — multi-room layouts.' },
  { name: 'Prefabricated Houses', slug: 'prefabricated-houses', href: '/product/prefabricated-houses', icon: Home, description: 'Panel-built prefab homes and bunkhouses — residential builds that are not container-based.' },
  { name: 'PUF Panels', slug: 'puf-panel', href: '/product/puf-panel', icon: Layers, description: 'Insulated wall and roof panels from 30mm to 150mm, at factory-direct rates.' },
  { name: 'Sandwich Panels', slug: 'sandwich-panel', href: '/product/sandwich-panel', icon: SquareStack, description: 'EPS, rockwool, glass wool and PIR core panels for walls, roofs and cold rooms.' },
];

const CategoryGrid = ({ counts }: { counts: Record<string, number> }) => {
  return (
    <section className="bg-[var(--ds-surface)] py-16 md:py-24" data-homepage-router>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-5 inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--ds-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--ds-primary)_12%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ds-primary)]">
            ALL PRODUCTS
          </span>
          <h2
            data-homepage-router-heading
            className="text-4xl font-bold tracking-tight text-[var(--ds-text-primary)] md:text-5xl"
          >
            Which SAMAN range is right for you?
          </h2>
          <p
            data-homepage-router-intro
            className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-[var(--ds-text-secondary)]"
          >
            Every product line below has one definitive page — sizes, specifications and ex-factory prices included. Start where your requirement matches.
          </p>
        </div>

        {/* T6.19a: uniform grid — every tile identical (4x4 desktop / 2x8 tablet /
            2-col mobile). auto-rows-fr + h-full give all 16 tiles equal height
            regardless of how the descriptions wrap; content is aligned to the top. */}
        <div
          data-homepage-range-grid
          className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = counts[cat.slug];
            return (
              <div
                key={cat.slug}
                className="group relative flex h-full flex-col rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] p-5 shadow-[var(--ds-shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--ds-primary)_50%,transparent)] hover:bg-[var(--ds-surface-alt)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--ds-surface-alt)] ring-1 ring-[var(--ds-border)] transition-shadow duration-200 group-hover:ring-[color-mix(in_srgb,var(--ds-primary)_50%,transparent)]">
                    <Icon className="h-7 w-7 text-[var(--ds-primary)]" strokeWidth={2} />
                  </span>
                  {typeof count === 'number' && (
                    <span className="flex-shrink-0 rounded-full bg-[var(--ds-primary)] px-2.5 py-0.5 text-xs font-bold text-white">{count}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={cat.href}
                    className="text-base font-bold leading-snug text-[var(--ds-text-primary)]"
                  >
                    {cat.name}
                  </Link>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 -translate-x-1 text-[var(--ds-primary)] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ds-text-secondary)]">{cat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
