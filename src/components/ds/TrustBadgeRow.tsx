import { TRUST_ICON_CYCLE } from './icons';
import styles from './TrustBadgeRow.module.css';

export interface TrustBadgeItem {
  label: string;
  subLabel?: string;
}

export interface TrustBadgeRowProps {
  /** 3–6 badge items. Each gets an auto-assigned line-icon glyph by index. */
  items: TrustBadgeItem[];
  /** `default` = ink on paper; `inverse` = reversed on forest. */
  tone?: 'default' | 'inverse';
  className?: string;
}

/**
 * TrustBadgeRow (T0.1) — a horizontal row of small credibility badges. Each
 * badge pairs an inline line-icon glyph with a bold label + small sub-label in
 * the utility mono face. Wraps to multiple rows on narrow screens (360px safe).
 * Server component; no interactivity.
 */
export function TrustBadgeRow({ items, tone = 'default', className }: TrustBadgeRowProps) {
  if (process.env.NODE_ENV !== 'production' && (items.length < 3 || items.length > 6)) {
    throw new Error(`TrustBadgeRow expects 3–6 items, received ${items.length}.`);
  }

  return (
    <ul className={[styles.row, styles[tone], className].filter(Boolean).join(' ')}>
      {items.map((item, i) => {
        const Icon = TRUST_ICON_CYCLE[i % TRUST_ICON_CYCLE.length];
        return (
          <li className={styles.badge} key={`${item.label}-${i}`}>
            <span className={styles.glyph} aria-hidden="true">
              <Icon />
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{item.label}</span>
              {item.subLabel && <span className={styles.sub}>{item.subLabel}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default TrustBadgeRow;
