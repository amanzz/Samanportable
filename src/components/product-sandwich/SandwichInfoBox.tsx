import React from 'react';
import Link from 'next/link';
import { Tag, Ruler, Layers, Truck, MapPin, Building2, Star } from 'lucide-react';

interface SandwichInfoBoxProps {
  h1: string;
  sku: string;
  averageRating?: string;
  ratingCount?: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
      ))}
    </div>
  );
}

const summaryRows = [
  { icon: Ruler, label: 'SIZE', value: 'Thickness 30–200 mm' },
  { icon: Layers, label: 'MATERIAL', value: '5 cores: PUF · PIR · EPS · Rockwool · Glass Wool, steel facings' },
  { icon: Truck, label: 'DELIVERY', value: '3–5 day dispatch' },
  { icon: MapPin, label: 'COVERAGE', value: 'Bangalore · Delhi NCR' },
  { icon: Building2, label: 'BRAND', value: 'SAMAN Portable' },
];

const SandwichInfoBox = ({ h1, sku, averageRating, ratingCount = 0 }: SandwichInfoBoxProps) => {
  const avg = averageRating ? parseFloat(averageRating) : 0;

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
        <Link href="/product-category/sandwich-panel" className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
          Sandwich Panels
        </Link>
      </div>

      <h1 className="mb-1 text-xl font-bold leading-tight text-foreground sm:text-2xl">{h1}</h1>

      {ratingCount > 0 && (
        <div className="mb-2 flex items-center gap-2">
          {avg > 0 && <Stars rating={Math.round(avg)} />}
          <span className="text-sm text-muted-foreground">
            {avg > 0 ? `${avg.toFixed(2)} out of 5 · ` : ''}
            {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      )}

      <div className="mb-3">
        <p className="text-lg font-bold text-primary sm:text-xl">From ₹770 / sq mt</p>
        <p className="text-xs text-muted-foreground">30mm base spec · ex-GST · final price at quotation</p>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        A sandwich panel is an insulated building board — two steel facing sheets bonded to an insulating core — used for walls, roofs, cabins and cold rooms. SAMAN manufactures all five cores — PUF, PIR, EPS, Rockwool and Glass Wool — on our own lines in Bangalore and Greater Noida, so you choose the core by your thermal, fire, acoustic or budget need and buy the finished panel factory-direct.
      </p>

      <dl className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
        {summaryRows.map((row) => (
          <div key={row.label} className="flex items-start gap-2">
            <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{row.label}</dt>
              <dd className="text-sm text-foreground">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-bold text-foreground">Product Information</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="font-medium text-foreground">SKU:</span>
            <span className="break-words text-right text-muted-foreground">{sku}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="font-medium text-foreground">Category:</span>
            <Link href="/product-category/sandwich-panel" className="break-words text-right font-medium text-primary hover:underline">
              Sandwich Panels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandwichInfoBox;
