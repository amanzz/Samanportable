'use client';
// NOTE: This project is Pages Router, where "use client" is a no-op — there are
// no React Server Components. The directive is kept to mark the intended client
// boundary from the SHIKHAR spec (L11). The component itself needs no JS: it is
// built on native <details>/<summary>, so it is fully functional pre-hydration
// and remains crawlable/accessible with scripts disabled.
import type { ReactNode } from 'react';
import styles from './FAQAccordion.module.css';

export interface FaqItem {
  question: string;
  /** Answer may be a string or rich node; string is used for JSON-LD. */
  answer: ReactNode;
  /** Plain-text answer used for JSON-LD when `answer` is a node. */
  answerText?: string;
}

export interface FAQAccordionProps {
  items: FaqItem[];
  /** Only one panel open at a time (native exclusive accordion). */
  exclusive?: boolean;
  /** Emit FAQPage JSON-LD structured data (schema-ready). */
  emitJsonLd?: boolean;
  /** Grouping name for exclusive mode; defaults to a stable string. */
  name?: string;
  className?: string;
}

export function FAQAccordion({ items, exclusive, emitJsonLd, name = 'ds-faq', className }: FAQAccordionProps) {
  const jsonLd = emitJsonLd
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((it) => ({
          '@type': 'Question',
          name: it.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: it.answerText ?? (typeof it.answer === 'string' ? it.answer : ''),
          },
        })),
      }
    : null;

  return (
    <div className={[styles.faq, className].filter(Boolean).join(' ')}>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {items.map((it, i) => (
        // `name` groups <details> into a native exclusive accordion. Spread as
        // any because React 18.3's DOM types predate the details `name` attr.
        <details key={i} className={styles.item} {...(exclusive ? ({ name } as any) : {})}>
          <summary className={styles.summary}>
            <span className={styles.question}>{it.question}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.answer}>
            {typeof it.answer === 'string' ? <p>{it.answer}</p> : it.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

export default FAQAccordion;
