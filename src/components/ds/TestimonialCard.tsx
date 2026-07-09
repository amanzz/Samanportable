import type { DsImage } from './types';
import styles from './TestimonialCard.module.css';

/**
 * TestimonialCard — a customer quote with attribution.
 * Optional avatar image requires explicit width/height. Server component.
 */
export interface TestimonialCardProps {
  quote: string;
  name: string;
  designation: string;
  company: string;
  avatar?: DsImage;
  className?: string;
}

export function TestimonialCard({ quote, name, designation, company, avatar, className }: TestimonialCardProps) {
  return (
    <figure className={[styles.card, className].filter(Boolean).join(' ')}>
      <blockquote className={styles.quote}>{quote}</blockquote>
      <figcaption className={styles.caption}>
        {avatar && (
          <span className={styles.avatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar.src} alt={avatar.alt} width={avatar.width} height={avatar.height} className={styles.avatarImg} loading="lazy" />
          </span>
        )}
        <span className={styles.who}>
          <span className={styles.name}>{name}</span>
          <span className={styles.role}>
            {designation}, {company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default TestimonialCard;
