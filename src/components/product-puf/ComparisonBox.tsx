import React from 'react';
import { Sparkles, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonBoxProps {
  eyebrow?: string;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

// The flagship information-gain block on its page (PUF-vs-PIR on the hub,
// the quote-comparison checklist on the price page) — styled to stand out
// from ordinary prose/table sections with an accent border and tinted panel.
const ComparisonBox = ({ eyebrow, title, icon: Icon = Sparkles, children, className }: ComparisonBoxProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-background to-background p-5 shadow-md sm:p-7',
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-foreground/70">
          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h3 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">{title}</h3>
      {children}
    </div>
  );
};

export default ComparisonBox;
