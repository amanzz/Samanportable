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
  type LucideIcon,
} from 'lucide-react';

// T6.18 — homepage product category grid (replaces the SpecsTable slot). One tile per
// published category, mirroring the header's Browse Categories set (Header.tsx
// productCategories). Category names are existing copy; the only new string is the
// section heading. Product counts are computed at BUILD TIME from the real category
// data (src/data/wp-export/categories/*.json) and passed in via the `counts` prop —
// never hardcoded here. Whole tile is a crawlable <a> rendered in SSR.

export type CategoryDef = { name: string; slug: string; href: string; icon: LucideIcon };

export const CATEGORIES: CategoryDef[] = [
  { name: 'Porta Cabin', slug: 'porta-cabins', href: '/product/porta-cabins', icon: Building2 },
  { name: 'Portable Cabin', slug: 'portable-cabin', href: '/product/portable-cabin', icon: Home },
  { name: 'Portable Office Cabin', slug: 'portable-office', href: '/product/portable-office', icon: Briefcase },
  { name: 'Container Office', slug: 'container-offices', href: '/product/container-offices', icon: Container },
  { name: 'Container Cafe', slug: 'container-cafe', href: '/product/container-cafe', icon: Coffee },
  { name: 'Labour Colony', slug: 'labor-colony', href: '/product/labor-colony', icon: Users },
  { name: 'Container House', slug: 'container-houses', href: '/product/container-houses', icon: Warehouse },
  { name: 'Security Cabin', slug: 'security-cabins', href: '/product/security-cabins', icon: Shield },
  { name: 'Portable Toilet', slug: 'portable-toilet', href: '/product/portable-toilet', icon: Droplets },
  { name: 'Industrial Shed', slug: 'industrial-sheds', href: '/product/industrial-sheds', icon: Factory },
  { name: 'PEB Construction', slug: 'peb-constructions', href: '/product/peb-constructions', icon: HardHat },
  { name: 'Pre-Engineered Building', slug: 'pre-engineered-buildings', href: '/product/pre-engineered-buildings', icon: Building },
  { name: 'Prefab Building', slug: 'prefab-buildings', href: '/product/prefab-buildings', icon: Blocks },
  { name: 'Prefabricated House', slug: 'prefabricated-houses', href: '/product/prefabricated-houses', icon: Home },
  { name: 'PUF Panels', slug: 'puf-panel', href: '/product/puf-panel', icon: Layers },
];

const CategoryGrid = ({ counts }: { counts: Record<string, number> }) => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-14">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Explore Every Product Category</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = counts[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0A3D2A]/20 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A3D2A]/5 text-[#0A3D2A] transition-colors group-hover:bg-[#0A3D2A] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-[#0A3D2A]">
                  {cat.name}
                </span>
                {typeof count === 'number' && (
                  <span className="flex-shrink-0 rounded-full bg-[#0A3D2A]/5 px-2.5 py-0.5 text-xs font-bold text-[#0A3D2A]">{count}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
