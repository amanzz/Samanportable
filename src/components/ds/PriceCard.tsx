import type { DsCta } from './types';
import { Cta } from './Cta';
import styles from './PriceCard.module.css';

/**
 * PriceCard — a "price-from" offer card. The price renders in the utility mono
 * face. `highlighted` promotes one card in a row. Server component.
 */
export interface PriceCardProps {
  title: string;
  /** e.g. "₹1,050" — caller-formatted, never generated. */
  priceFrom: string;
  /** e.g. "/m²" or "onwards". */
  unit?: string;
  /** Small qualifier above the price, e.g. "Starting at". */
  priceLabel?: string;
  features?: string[];
  cta?: DsCta;
  badge?: string;
  highlighted?: boolean;
  className?: string;
}

export function PriceCard({ title, priceFrom, unit, priceLabel = 'From', features, cta, badge, highlighted, className }: PriceCardProps) {
  return (
    <article className={[styles.card, highlighted ? styles.highlighted : '', className].filter(Boolean).join(' ')}>
      {badge && <span className={styles.badge}>{badge}</span>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.priceRow}>
        <span className={styles.priceLabel}>{priceLabel}</span>
        <span className={styles.priceValue}>
          <span className={styles.price}>{priceFrom}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </span>
      </p>
      {features && features.length > 0 && (
        <ul className={styles.features}>
          {features.map((f, i) => (
            <li key={i} className={styles.feature}>{f}</li>
          ))}
        </ul>
      )}
      {cta && <Cta {...cta} variant={highlighted ? 'primary' : 'secondary'} block />}
    </article>
  );
}

export default PriceCard;
