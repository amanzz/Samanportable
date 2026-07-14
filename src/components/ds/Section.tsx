import type { ReactNode } from 'react';
import styles from './Section.module.css';

/**
 * Section (T0.4) — the uniform page-section wrapper that creates the vertical
 * rhythm and cross-section integration on assembled pages.
 *
 *  - Full-bleed background band (paper / mist / surface / forest) so successive
 *    sections can alternate surfaces. Use inside a NON-contained PageShell.
 *  - A single vertical-spacing token (`--ds-section-y`) padding every section.
 *  - A consistent header pattern: a forest accent rule (the "eyebrow" marker) +
 *    optional mono-uppercase eyebrow text + an Archivo heading + optional
 *    one-line sub, left-aligned, identical margins everywhere.
 *
 * `eyebrow`/`sub` are optional and NOT authored on the demo page (no invented
 * copy) — the forest rule alone carries the eyebrow treatment there.
 * Server component.
 */
export interface SectionProps {
  heading?: string;
  /** Optional mono-uppercase kicker beside the forest rule. */
  eyebrow?: string;
  /** Optional one-line supporting sentence under the heading. */
  sub?: string;
  background?: 'paper' | 'mist' | 'surface' | 'forest';
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ heading, eyebrow, sub, background = 'paper', id, className, children }: SectionProps) {
  return (
    <section id={id} className={[styles.band, styles[background], className].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        {heading && (
          <header className={styles.header}>
            <span className={styles.eyebrowRow}>
              <span className={styles.rule} aria-hidden="true" />
              {eyebrow && <span className={styles.eyebrowText}>{eyebrow}</span>}
            </span>
            <h2 className={styles.heading}>{heading}</h2>
            {sub && <p className={styles.sub}>{sub}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
