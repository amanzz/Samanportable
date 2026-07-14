import type { DsSpecItem } from './types';
import styles from './SpecStrip.module.css';

/**
 * SpecStrip — the SIGNATURE design-system element.
 *
 * A thin, persistent horizontal band for product pages that surfaces 3–5 live
 * spec / "price-from" data points in the utility mono face. It reads like an
 * engineering spec plate: label above, monospace value below, hairline
 * dividers between. Scrolls horizontally on very narrow screens rather than
 * wrapping/overflowing (360px safe).
 *
 * Server component (no interactivity). Validates 3–5 items in dev.
 */
export interface SpecStripProps {
  /** 3 to 5 spec/price items. */
  items: DsSpecItem[];
  /** Optional leading eyebrow label (e.g. product name). */
  eyebrow?: string;
  className?: string;
}

export function SpecStrip({ items, eyebrow, className }: SpecStripProps) {
  if (process.env.NODE_ENV !== 'production' && (items.length < 3 || items.length > 5)) {
    throw new Error(`SpecStrip expects 3–5 items, received ${items.length}.`);
  }

  return (
    <div className={[styles.strip, className].filter(Boolean).join(' ')} role="group" aria-label={eyebrow ?? 'Key specifications'}>
      <div className={styles.inner}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <dl className={styles.list}>
          {items.map((item, i) => (
            <div className={styles.item} key={`${item.label}-${item.value}-${i}`}>
              {item.label ? <dt className={styles.label}>{item.label}</dt> : null}
              <dd className={styles.value}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default SpecStrip;
