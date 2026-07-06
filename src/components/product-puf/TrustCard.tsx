import React from 'react';
import Link from 'next/link';
import { Factory, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface TrustCardProps {
  /** Optional — Addendum 6 relocates the warranty line to the Specifications
   *  tab, so Shipping-tab usages omit this and only show delivery + returns. */
  warrantyLine?: string;
  deliveryLine: string;
  returnsLine: string;
}

const TrustCard = ({ warrantyLine, deliveryLine, returnsLine }: TrustCardProps) => {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      {/* Two-location strip */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl bg-primary/[0.06] px-4 py-3">
          <Factory className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-foreground">Bangalore factory</p>
            <p className="text-xs text-muted-foreground">Dispatch for South India</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-primary/[0.06] px-4 py-3">
          <Factory className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-foreground">Greater Noida factory</p>
            <p className="text-xs text-muted-foreground">Dispatch for North India &amp; Delhi NCR</p>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {deliveryLine}{' '}
            <Link href="/delivery-policy" className="font-semibold text-primary hover:underline">
              Delivery Policy
            </Link>
          </p>
        </li>
        {warrantyLine && (
          <li className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">{warrantyLine}</p>
          </li>
        )}
        <li className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {returnsLine}{' '}
            <Link href="/refund-and-return-policy" className="font-semibold text-primary hover:underline">
              Refund &amp; Return Policy
            </Link>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default TrustCard;
