import React from 'react';
import { MoveHorizontal } from 'lucide-react';

export interface PriceRow {
  thickness: string;
  ratePerM2: string;
  ratePerSqFt: string;
  use: string;
  isQuoteOnly?: boolean;
}

interface PriceTableUIProps {
  rows: PriceRow[];
  labelLine: string;
}

const PriceTableUI = ({ rows, labelLine }: PriceTableUIProps) => {
  return (
    <div>
      <p className="mb-3 rounded-lg bg-muted/60 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:text-sm">
        {labelLine}
      </p>

      {/* Mobile scroll affordance — table itself scrolls at 360px without pinch-zoom */}
      <div className="mb-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:hidden">
        <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        Scroll for more
      </div>

      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full min-w-[560px] border-collapse">
          <thead className="sticky top-0 z-10 bg-primary">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                Thickness
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                Rate ₹/m²
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                Rate ₹/sq ft
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                Typical use
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.thickness}
                className={index % 2 === 0 ? 'bg-background' : 'bg-muted/40'}
              >
                <td className="px-4 py-3 text-sm font-bold text-foreground sm:text-base">{row.thickness}</td>
                <td
                  className={
                    row.isQuoteOnly
                      ? 'px-4 py-3 text-sm italic text-muted-foreground/70'
                      : 'px-4 py-3 text-sm text-foreground'
                  }
                >
                  {row.ratePerM2}
                </td>
                <td
                  className={
                    row.isQuoteOnly
                      ? 'px-4 py-3 text-sm italic text-muted-foreground/70'
                      : 'px-4 py-3 text-sm text-foreground'
                  }
                >
                  {row.ratePerSqFt}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceTableUI;
