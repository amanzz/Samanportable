'use client';
// The interactive chip layer of SizeVariantSelector. This is the ONLY part that
// needs client state — selection swaps the displayed price/dimensions inside a
// fixed-height panel (zero CLS) with no navigation. The full 9-size table is
// rendered separately, server-side, by the parent (see SizeVariantSelector).
import { useState } from 'react';
import type { SizeVariant } from './SizeVariantSelector';
import styles from './SizeVariantSelector.module.css';

export interface SizeVariantChipsProps {
  sizes: SizeVariant[];
}

export function SizeVariantChips({ sizes }: SizeVariantChipsProps) {
  const [active, setActive] = useState(0);
  const current = sizes[active];

  return (
    <div className={styles.interactive}>
      <div className={styles.chips} role="group" aria-label="Choose a size">
        {sizes.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={styles.chip}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Fixed-height panel: dimensions never change layout height on swap. */}
      <div className={styles.panel} aria-live="polite">
        <div className={styles.panelRow}>
          <div className={styles.panelPrimary}>
            <span className={styles.panelK}>Selected</span>
            <span className={styles.panelSize}>{current.label}</span>
            <span className={styles.panelDims}>{current.dimensions}</span>
          </div>
          <div className={styles.panelPrice}>
            <span className={styles.panelK}>Price from</span>
            <span className={styles.panelPriceValue}>{current.priceFrom}</span>
          </div>
        </div>
        <dl className={styles.panelSpecs}>
          {current.keySpecs.map((spec, i) => (
            <div className={styles.panelSpec} key={`${spec.label}-${i}`}>
              <dt className={styles.panelSpecK}>{spec.label}</dt>
              <dd className={styles.panelSpecV}>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default SizeVariantChips;
