import type { DsSpecItem } from './types';
import { SizeVariantChips } from './SizeVariantChips';
import styles from './SizeVariantSelector.module.css';

export interface SizeVariant {
  /** Short chip label, e.g. "10 × 8 ft". */
  label: string;
  /** Full dimensions string, e.g. "3.0m × 2.4m × 2.6m (L×W×H)". */
  dimensions: string;
  /** Caller-formatted "from" price, e.g. "₹1,15,000". */
  priceFrom: string;
  /** Key specs shown in the panel and summarised in the table. */
  keySpecs: DsSpecItem[];
}

export interface SizeVariantSelectorProps {
  /** EXACTLY 9 size variants. Throws in dev if not. */
  sizes: SizeVariant[];
  /** Optional heading above the selector. */
  title?: string;
  className?: string;
}

/**
 * SizeVariantSelector — the interactive size picker.
 *
 * Renders TWO things:
 *  1. An interactive chip layer + fixed-height panel (client — SizeVariantChips)
 *     that swaps the displayed price/dimensions with zero CLS and no navigation.
 *  2. A full, crawlable HTML table of all 9 sizes, rendered SERVER-SIDE here so
 *     search engines index every size/price even though the panel shows one at
 *     a time. On desktop both are visible; on mobile the table is collapsed
 *     under a native <details> (still in the DOM, still crawlable).
 *
 * Validates `sizes.length === 9` and throws in development if violated.
 */
export function SizeVariantSelector({ sizes, title, className }: SizeVariantSelectorProps) {
  if (process.env.NODE_ENV !== 'production' && sizes.length !== 9) {
    throw new Error(`SizeVariantSelector requires exactly 9 sizes, received ${sizes.length}.`);
  }

  return (
    <section className={[styles.selector, className].filter(Boolean).join(' ')}>
      {title && <h2 className={styles.heading}>{title}</h2>}

      {/* Interactive layer (hydrates client-side). */}
      <SizeVariantChips sizes={sizes} />

      {/* Full crawlable table of ALL 9 sizes — server-rendered, always in HTML. */}
      <details className={styles.tableWrap}>
        <summary className={styles.tableSummary}>All 9 sizes &amp; prices</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <caption className={styles.caption}>Complete size &amp; price matrix</caption>
            <thead>
              <tr>
                <th scope="col" className={styles.th}>Size</th>
                <th scope="col" className={styles.th}>Dimensions</th>
                <th scope="col" className={styles.thNum}>Price from</th>
                <th scope="col" className={styles.th}>Key specs</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s, i) => (
                <tr key={`${s.label}-${i}`} className={styles.tr}>
                  <th scope="row" className={styles.rowLabel}>{s.label}</th>
                  <td className={styles.cell}>{s.dimensions}</td>
                  <td className={styles.numCell}>{s.priceFrom}</td>
                  <td className={styles.cell}>
                    {s.keySpecs.map((k) => `${k.label}: ${k.value}`).join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

export default SizeVariantSelector;
