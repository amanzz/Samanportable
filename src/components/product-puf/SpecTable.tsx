import React from 'react';
import { Wrench, type LucideIcon } from 'lucide-react';

export interface SpecRow {
  label: string;
  value: string;
}

interface SpecTableProps {
  title: string;
  subtitle?: string;
  rows: SpecRow[];
  icon?: LucideIcon;
}

// Definition-style two-column table on desktop; stacked label/value cards on
// mobile so nothing is squeezed into unreadable columns at 360px. Both blocks
// render the same data — only one is visible at a given breakpoint via
// Tailwind display utilities, so there is no client-side measurement/reflow.
const SpecTable = ({ title, subtitle, rows, icon: Icon = Wrench }: SpecTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
      <div className="flex items-center gap-3 bg-primary px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white sm:text-lg">{title}</h3>
          {subtitle && <p className="text-xs text-white/75">{subtitle}</p>}
        </div>
      </div>

      {/* Desktop: two-column definition table */}
      <table className="hidden w-full md:table">
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.label} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
              <td className="w-2/5 px-5 py-3 text-sm font-semibold text-foreground">{row.label}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked label/value cards */}
      <dl className="divide-y divide-border md:hidden">
        {rows.map((row) => (
          <div key={row.label} className="px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 text-sm text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default SpecTable;
