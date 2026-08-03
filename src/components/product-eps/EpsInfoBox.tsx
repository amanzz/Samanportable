import React from 'react';
import Link from 'next/link';
import { Tag, Ruler, Layers, Truck, MapPin, Building2 } from 'lucide-react';

interface EpsInfoBoxProps {
  h1: string;
  priceMain: string;
  priceSubline: string;
  intro: string;
  sku: string;
  hsn: string;
}

// EPS-specific variant of the product info box, modelled on RockwoolInfoBox /
// PirInfoBox (Variant A price pattern: a single "From ₹.. / sq mt" figure with
// the base-spec/ex-GST subline, and no price in the page JSON-LD Product node —
// EPS keeps the schema price-free per the C16-P2 draft, Law L9). All spec-grid,
// bullet and identifier values are the owner-verified EPS facts from the C16-P2
// draft Part 1. Unlike the Rockwool box, EPS surfaces its real draft SKU
// (SP-C16-EPS-SUB-2026) alongside HSN 940690.
const EpsInfoBox = ({ h1, priceMain, priceSubline, intro, sku, hsn }: EpsInfoBoxProps) => {
  const specSnapshot = [
    { icon: Ruler, label: 'Size', value: 'Thickness 30–150 mm' },
    { icon: Layers, label: 'Material', value: 'Expanded polystyrene core · coated steel facings' },
    { icon: Truck, label: 'Delivery', value: '3–5 day dispatch' },
    { icon: MapPin, label: 'Coverage', value: 'Bangalore · Delhi NCR' },
    { icon: Building2, label: 'Brand', value: 'SAMAN Portable' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
        <Link href="/product" className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
          EPS Panels
        </Link>
      </div>

      <h1 className="mb-1 text-xl font-bold leading-tight text-foreground sm:text-2xl">{h1}</h1>

      <div className="mb-3">
        <p className="text-lg font-bold text-primary sm:text-xl">{priceMain}</p>
        <p className="text-xs text-muted-foreground">{priceSubline}</p>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{intro}</p>

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

      <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
        <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />Steel-faced EPS sandwich panel, wall and roof profiles</li>
        <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />Standard thickness 30–150 mm (incl. 70/90 mm); 110–200 mm made to order</li>
        <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />EPS core density 16 kg/m³ standard; 20–24 kg/m³ upgrade on request</li>
        <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />Supply-only quotes; <span className="font-semibold text-foreground">panel warranty 5–10 years, confirmed at quotation</span>; transport confirmed at quotation</li>
        <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />Factory-direct from Bangalore and Greater Noida · HSN 940690</li>
      </ul>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-bold text-foreground">Product Information</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between py-1">
            <span className="font-medium text-foreground">SKU:</span>
            <span className="break-words text-muted-foreground">{sku}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-medium text-foreground">HSN Code:</span>
            <span className="break-words text-muted-foreground">{hsn}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-medium text-foreground">Category:</span>
            <Link href="/product" className="break-words text-right font-medium text-primary hover:underline">
              EPS Panels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpsInfoBox;
