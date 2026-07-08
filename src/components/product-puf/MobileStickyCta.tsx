import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import QuoteFormTrigger from '@/components/QuoteFormTrigger';

// Fixed positioning removes this bar from normal document flow, so mounting,
// dismissing, and re-showing it never shifts surrounding content — zero CLS
// regardless of state. Thumb-reachable 44px+ tap targets, lg:hidden (desktop
// already has the always-visible ProductZoneCtas strip).
const MobileStickyCta = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <div className="flex items-center gap-1.5 pb-2">
        <a
          href="tel:+918861622859"
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-2 text-xs font-semibold text-primary-foreground"
        >
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          South
        </a>
        <a
          href="tel:+918796039938"
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-2 text-xs font-semibold text-primary-foreground"
        >
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          North
        </a>
        <QuoteFormTrigger
          size="sm"
          variant="outline"
          className="min-h-11 flex-1 border-primary/30 bg-primary/5 text-xs font-semibold text-primary"
        >
          Send Enquiry
        </QuoteFormTrigger>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss quick contact bar"
          className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default MobileStickyCta;
