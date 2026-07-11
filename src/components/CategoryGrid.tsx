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

// T6.19 — homepage product category grid, dark deep-forest treatment. One crawlable
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
  { name: 'Porta Cabin', slug: 'porta-cabins', href: '/product/porta-cabins', icon: Building2, description: 'Site offices, guard rooms, stores and accommodation for construction sites — factory-built and delivered ready to use.' },
  { name: 'Portable Cabin', slug: 'portable-cabin', href: '/product/portable-cabin', icon: Home, description: 'Relocatable cabins for offices, shops and flexible workspaces. Move them whenever your requirement changes.' },
  { name: 'Portable Office Cabin', slug: 'portable-office', href: '/product/portable-office', icon: Briefcase, description: 'Office cabins with interiors, wiring and AC fitted at the factory — walk in and start working.' },
  { name: 'Container Office', slug: 'container-offices', href: '/product/container-offices', icon: Container, description: '20 ft and 40 ft container offices built for heavy-duty industrial and project site use.' },
  { name: 'Container Cafe', slug: 'container-cafe', href: '/product/container-cafe', icon: Coffee, description: 'Cafés, kiosks and food outlets delivered ready to open — branding, plumbing and electrical done.' },
  { name: 'Labour Colony', slug: 'labor-colony', href: '/product/labor-colony', icon: Users, description: 'Complete worker accommodation camps up to G+2 — rooms, toilets and services set up in days.' },
  { name: 'Container House', slug: 'container-houses', href: '/product/container-houses', icon: Warehouse, description: 'Insulated container homes with full living interiors, delivered and placed on your plot.' },
  { name: 'Security Cabin', slug: 'security-cabins', href: '/product/security-cabins', icon: Shield, description: 'Compact guard cabins for gates, societies and factories. Installed in hours, no foundation needed.' },
  { name: 'Portable Toilet', slug: 'portable-toilet', href: '/product/portable-toilet', icon: Droplets, description: 'Clean, durable sanitation units for construction sites, events and public locations.' },
  { name: 'Industrial Shed', slug: 'industrial-sheds', href: '/product/industrial-sheds', icon: Factory, description: 'Factory, warehouse and workshop sheds in structural steel — large spans, fast erection.' },
  { name: 'PEB Construction', slug: 'peb-constructions', href: '/product/peb-constructions', icon: HardHat, description: 'Design-to-erection pre-engineered building projects, managed end to end by our team.' },
  { name: 'Pre-Engineered Building', slug: 'pre-engineered-buildings', href: '/product/pre-engineered-buildings', icon: Building, description: 'Engineered steel building systems with clear spans for industrial and commercial use.' },
  { name: 'Prefab Building', slug: 'prefab-buildings', href: '/product/prefab-buildings', icon: Blocks, description: 'Modular buildings for schools, offices, healthcare and site facilities — multi-room layouts.' },
  { name: 'Prefabricated House', slug: 'prefabricated-houses', href: '/product/prefabricated-houses', icon: Home, description: 'Factory-built homes assembled on site in days, with proper doors, windows and finishes.' },
  { name: 'PUF Panels', slug: 'puf-panel', href: '/product/puf-panel', icon: Layers, description: 'Insulated wall and roof panels from 30mm to 150mm, at factory-direct rates.' },
  { name: 'Sandwich Panels', slug: 'sandwich-panel', href: '/product/sandwich-panel', icon: SquareStack, description: 'EPS, rockwool, glass wool and PIR core panels for walls, roofs and cold rooms.' },
];

const CategoryGrid = ({ counts }: { counts: Record<string, number> }) => {
  return (
    <section className="bg-[#0A3D2A] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-5 inline-flex items-center rounded-full border border-[#1A6B45]/40 bg-[#1A6B45]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
            ALL PRODUCTS
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Explore Every Product Category</h2>
        </div>

        {/* T6.19a: uniform grid — every tile identical (4x4 desktop / 2x8 tablet /
            2-col mobile). auto-rows-fr + h-full give all 16 tiles equal height
            regardless of how the descriptions wrap; content is aligned to the top. */}
        <div className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = counts[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative flex h-full flex-col rounded-2xl border border-[#1A6B45]/20 bg-white/5 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1A6B45]/60 hover:bg-white/[0.08]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A6B45] to-[#0A3D2A] shadow-lg shadow-black/25 ring-1 ring-white/10 transition-shadow duration-200 group-hover:ring-[#1A6B45]/60 group-hover:shadow-[#1A6B45]/40">
                    <Icon className="h-7 w-7 text-[#F8FAF9]" strokeWidth={2} />
                  </span>
                  {typeof count === 'number' && (
                    <span className="flex-shrink-0 rounded-full bg-[#1A6B45] px-2.5 py-0.5 text-xs font-bold text-white">{count}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold leading-snug text-white">{cat.name}</h3>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 -translate-x-1 text-[#F8FAF9] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[#F8FAF9]/75">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
