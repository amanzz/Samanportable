import type { DsImage } from './types';
import styles from './DeliveryLogRow.module.css';

/**
 * DeliveryLogRow — one entry in a "recent deliveries" log: project, city, size,
 * delivery days, and a photo (explicit width/height, zero CLS). Renders as a
 * self-contained row that stacks cleanly at 360px. Server component.
 *
 * Delivery-days value renders in the utility mono face.
 */
export interface DeliveryLogRowProps {
  project: string;
  city: string;
  /** e.g. "20ft × 8ft" — caller-formatted. */
  size: string;
  /** Number of days to deliver. */
  deliveryDays: number | string;
  photo: DsImage;
  className?: string;
}

export function DeliveryLogRow({ project, city, size, deliveryDays, photo, className }: DeliveryLogRowProps) {
  return (
    <article className={[styles.row, className].filter(Boolean).join(' ')}>
      <span className={styles.photo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className={styles.img} loading="lazy" />
      </span>
      <span className={styles.cell} data-field="project">
        <span className={styles.k}>Project</span>
        <span className={styles.project}>{project}</span>
      </span>
      <span className={styles.cell} data-field="city">
        <span className={styles.k}>City</span>
        <span className={styles.v}>{city}</span>
      </span>
      <span className={styles.cell} data-field="size">
        <span className={styles.k}>Size</span>
        <span className={styles.mono}>{size}</span>
      </span>
      <span className={styles.cell} data-field="days">
        <span className={styles.k}>Delivered in</span>
        <span className={styles.mono}>{deliveryDays} days</span>
      </span>
    </article>
  );
}

export default DeliveryLogRow;
