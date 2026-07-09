import type { ReactNode } from 'react';
import type { DsCta } from './types';
import { Cta } from './Cta';
import styles from './CTARow.module.css';

/** A CTA-row item: a CTA plus an optional leading icon node. */
export interface CtaRowItem extends DsCta {
  icon?: ReactNode;
}

export interface CTARowProps {
  /** The single bold, filled primary action (pill, lg). */
  primary: CtaRowItem;
  /** Up to 2 outlined actions rendered after the primary. */
  outlines?: CtaRowItem[];
  /** `onDark` recolours all buttons for the forest surface. */
  tone?: 'default' | 'onDark';
  className?: string;
}

/**
 * CTARow (T0.2) — the owner-approved action row: one bold filled pill CTA
 * followed by up to two outlined pill CTAs, laid out horizontally with
 * consistent gaps. Wraps cleanly, and stacks full-width on the smallest
 * screens (≤419px). Server component; all pieces are token-driven Cta.
 */
export function CTARow({ primary, outlines = [], tone = 'default', className }: CTARowProps) {
  const outs = outlines.slice(0, 2);
  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')}>
      <div className={styles.item}>
        <Cta {...primary} variant="primary" size="lg" pill tone={tone} />
      </div>
      {outs.map((o, i) => (
        <div className={styles.item} key={`${o.label}-${i}`}>
          <Cta {...o} variant="secondary" size="lg" pill tone={tone} />
        </div>
      ))}
    </div>
  );
}

export default CTARow;
