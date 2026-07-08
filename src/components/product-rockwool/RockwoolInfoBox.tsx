import React from 'react';
import Link from 'next/link';
import { Tag, Ruler, Layers, Truck, MapPin, Building2, Wrench } from 'lucide-react';

interface RockwoolInfoBoxProps {
  h1: string;
  priceMain: string;
  priceSubline: string;
  shortDescription: string;
  hsn: string;
}

// Rockwool-specific variant of the product info box, modelled on PirInfoBox
// (Variant A price pattern, identical to the live C15 PUF and C16 PIR products):
// a single "From ₹.. / sq mt" figure with the base-spec/ex-GST subline and no
// price in the page JSON-LD Product node (AggregateOffer carries the range).
// Spec-snapshot values are the owner-locked Rockwool facts from the C16-P1 spec
// table. No SKU is shown — the WooCommerce product carries no SKU, so the
// identifier row surfaces the owner-verified HSN code instead of an invented one.
const RockwoolInfoBox = ({ h1, priceMain, priceSubline, shortDescription, hsn }: RockwoolInfoBoxProps) => {
  const specSnapshot = [
    { icon: Ruler, label: 'Size', value: 'Thickness 30–150 mm (made-to-order to 200 mm)' },
    { icon: Layers, label: 'Material', value: 'Non-combustible stone wool core; PPGI / PPGL / SS / aluminium facings' },
    { icon: Truck, label: 'Delivery', value: '3–5 day dispatch (standard thicknesses)' },
    { icon: MapPin, label: 'Coverage', value: 'Bangalore · Delhi NCR — pan-India' },
    { icon: Building2, label: 'Brand', value: 'SAMAN Portable' },
    { icon: Wrench, label: 'Application', value: 'Fire-rated walls, acoustic enclosures, plant rooms' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
        <Link href="/product" className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
          Rockwool Panels
        </Link>
      </div>

      <h1 className="mb-1 text-xl font-bold leading-tight text-foreground sm:text-2xl">{h1}</h1>

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
            <span className="font-medium text-foreground">HSN Code:</span>
            <span className="break-words text-muted-foreground">{hsn}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-medium text-foreground">Category:</span>
            <Link href="/product" className="break-words text-right font-medium text-primary hover:underline">
              Insulated Panels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockwoolInfoBox;
