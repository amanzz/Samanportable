import React from 'react';
import Link from 'next/link';
import { Tag, Ruler, Layers, Truck, MapPin, Building2 } from 'lucide-react';

interface GlassWoolInfoBoxProps {
  h1: string;
  priceMain: string;
  priceSubline: string;
  intro: string;
  sku: string;
  hsn: string;
}

// Glass-Wool variant of the product info box, modelled on EpsInfoBox /
// RockwoolInfoBox (Variant A price pattern: a single "From ₹.. / sq mt" figure
// with the base-spec/ex-GST subline, and no price in the page JSON-LD Product
// node — Glass Wool keeps the schema price-free per the C16-P2 draft, Law L9).
// All chip, spec-grid and identifier values are the owner-verified Glass Wool
// facts from the C16-P2 draft summary box (verbatim). The summary follows the
// PUF/L1 layout exactly: chip → H1 → price → subline → intro → icon spec grid;
// no marketing bullet block (the draft summary does not include one).
const GlassWoolInfoBox = ({ h1, priceMain, priceSubline, intro, sku, hsn }: GlassWoolInfoBoxProps) => {
  const specSnapshot = [
    { icon: Ruler, label: 'Size', value: 'Thickness 30–150 mm (110–200 mm made to order)' },
    { icon: Layers, label: 'Material', value: 'Glass wool core 48–64 kg/m³, steel facings' },
    { icon: Truck, label: 'Delivery', value: '3–5 day dispatch' },
    { icon: MapPin, label: 'Coverage', value: 'Bangalore · Delhi NCR' },
    { icon: Building2, label: 'Brand', value: 'SAMAN Portable' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
        <Link href="/product" className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
          Glass Wool Panels
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
              Glass Wool Panels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassWoolInfoBox;
