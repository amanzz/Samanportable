import React from 'react';
import { List } from 'lucide-react';

export interface JumpNavItem {
  id: string;
  label: string;
}

interface JumpNavProps {
  items: JumpNavItem[];
}

// In-flow only, at every breakpoint — no position:sticky/fixed. This component
// renders inside the Description tab's single-column content flow (not its own
// sidebar column), so a sticky nav here would stick in place and float over the
// H2 headings scrolling up beneath it. That was the rev.3 overlap bug (Addendum 7
// FIX 5): a normal-flow bordered card is the safe default and cannot overlap
// anything, at 360px, 768px or 1440px alike.
const JumpNav = ({ items }: JumpNavProps) => {
  return (
    <nav aria-label="On this page" className="mb-8 rounded-xl border border-border bg-background p-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <List className="h-4 w-4 text-primary" aria-hidden="true" />
        On this page
      </p>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default JumpNav;
