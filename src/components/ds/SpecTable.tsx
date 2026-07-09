import type { DsSpecItem } from './types';
import styles from './SpecTable.module.css';

/**
 * SpecTable — a semantic, crawlable specification table (T0.2 premium pass).
 * Wrapped in a machined card (1px border, small radius, tight shadow) with a
 * forest header row (mono uppercase), hairline separators, subtle zebra, and a
 * right-aligned value column in tabular numerals. Scrolls horizontally inside
 * its card at 360px — never breaks the page. Server-rendered.
 */
export interface SpecTableProps {
  rows: DsSpecItem[];
  /** Visible caption / table title. */
  caption?: string;
  /** Column header for the value column (defaults to "Specification"). */
  valueHeading?: string;
  /** Column header for the label column (defaults to "Attribute"). */
  labelHeading?: string;
  className?: string;
}

export function SpecTable({ rows, caption, labelHeading = 'Attribute', valueHeading = 'Specification', className }: SpecTableProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {caption && <div className={styles.title}>{caption}</div>}
      <div className={styles.scroll}>
        <table className={styles.table} aria-label={caption}>
          <thead>
            <tr>
              <th scope="col" className={styles.th}>{labelHeading}</th>
              <th scope="col" className={styles.thValue}>{valueHeading}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.label}-${i}`} className={styles.tr}>
                <th scope="row" className={styles.rowLabel}>{row.label}</th>
                <td className={styles.value}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpecTable;
