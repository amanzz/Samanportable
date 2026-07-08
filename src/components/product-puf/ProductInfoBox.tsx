import React from 'react';
import Link from 'next/link';
import { Tag, Ruler, Layers, Truck, MapPin, Building2, Wrench, Star } from 'lucide-react';

interface ProductInfoBoxProps {
  h1: string;
  priceMain: string;
  priceSubline: string;
  shortDescription: string;
  application: string;
  sku: string;
  averageRating?: string;
  ratingCount?: number;
  materialOverride?: string;
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

// Mirrors the porta-cabins product info box (H1 / star row / price+subline /
// short description / spec-snapshot rows / SKU / category), minus the two
// banned elements for C15: no strikethrough was-price, no "inclusive of all
// taxes" — price sub-line states "ex-GST" instead. Star row only renders when
// a real approved review exists (component's natural behaviour, same gate as
// ProductReviews) — with 0 reviews on every C15 product today, it renders
// nothing, which is correct, not broken.
const ProductInfoBox = ({
  h1,
  priceMain,
  priceSubline,
  shortDescription,
  application,
  sku,
  averageRating,
  ratingCount = 0,
  materialOverride,
}: ProductInfoBoxProps) => {
  const specSnapshot = [
    { icon: Ruler, label: 'Size', value: 'Thickness 30–200 mm' },
    { icon: Layers, label: 'Material', value: materialOverride ?? 'PPGI-faced PUF core, 40 ± 2 kg/m³' },
    { icon: Truck, label: 'Delivery', value: '3–5 day dispatch' },
    { icon: MapPin, label: 'Coverage', value: 'Bangalore · Delhi NCR' },
    { icon: Building2, label: 'Brand', value: 'SAMAN Portable' },
    { icon: Wrench, label: 'Application', value: application },
  ];
  const avg = averageRating ? parseFloat(averageRating) : 0;

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
        <Link href="/product/puf-panel" className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
          PUF Panels
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
        <p className="text-lg font-bold text-primary sm:text-xl">{priceMain}</p>
        <p className="text-xs text-muted-foreground">{priceSubline}</p>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{shortDescription}</p>

      <dl className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
        {specSnapshot.map((row) => (
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
          <div className="flex items-center justify-between py-1">
            <span className="font-medium text-foreground">SKU:</span>
            <span className="break-words text-muted-foreground">{sku}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-medium text-foreground">Category:</span>
            <Link href="/product-category/puf-panel" className="break-words text-right font-medium text-primary hover:underline">
              PUF Panels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoBox;
