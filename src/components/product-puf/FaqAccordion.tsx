import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  id?: string;
}

// Native <details>/<summary> — every Q&A is in the DOM for crawlers regardless
// of open/closed state, zero JS required to render or expand, zero CLS (no
// height animation library, browser-native disclosure).
const FaqAccordion = ({ items, id }: FaqAccordionProps) => {
  return (
    <div id={id} className="space-y-3">
      {items.map((item, index) => (
        <details
          key={item.question}
          open={index === 0}
          className="group rounded-xl border border-border bg-background px-4 py-3 open:shadow-sm sm:px-5 sm:py-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-foreground marker:content-none">
            <span className="text-sm sm:text-base">{item.question}</span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
};

export default FaqAccordion;
