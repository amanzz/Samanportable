import styles from './GSTRegistrationCard.module.css';

export interface GstEntry {
  /** State + plant, e.g. "KARNATAKA — BANGALORE PLANT". */
  stateLabel: string;
  /** The GSTIN, shown in the mono face. */
  gstin: string;
  /** Caption under the GSTIN. */
  caption: string;
}

export interface GSTRegistrationCardProps {
  /** Registration entries (typically two: KA + UP). Stacks at 360px. */
  entries: GstEntry[];
  className?: string;
}

/**
 * GSTRegistrationCard (T0.4) — a refined GST registration block. One machined
 * card (1px border, tight shadow) holding a responsive column per registration:
 * a forest state label (mono uppercase) with a forest left accent, the GSTIN in
 * the mono face at a comfortable size with letter-spacing, and a caption.
 * Two columns at ≥768px, stacked at 360px. Server component.
 */
export function GSTRegistrationCard({ entries, className }: GSTRegistrationCardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.grid}>
        {entries.map((e, i) => (
          <div className={styles.col} key={`${e.gstin}-${i}`}>
            <span className={styles.state}>{e.stateLabel}</span>
            <span className={styles.gstin}>{e.gstin}</span>
            <span className={styles.caption}>{e.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GSTRegistrationCard;
