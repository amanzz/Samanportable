import Image from 'next/image';
import type { DsImage } from './types';
import styles from './CategoryCard.module.css';

/**
 * CategoryCard — a linked product/category tile (T0.4 uniform imagery).
 * The image is rendered with next/image `fill` + object-fit cover inside a
 * FIXED 4:3 frame, so every card looks identical regardless of the source
 * file's aspect ratio (no letterboxing bands). Cards stretch to equal height
 * per row; the arrow is pinned to the bottom. `image.width/height` are retained
 * on the DsImage type but the frame (aspect-ratio) is what guarantees zero CLS.
 * Server component; CSS-only hover lift + arrow shift (reduced-motion safe).
 */
export interface CategoryCardProps {
  title: string;
  href: string;
  image: DsImage;
  description?: string;
  /** Optional overline, e.g. "12 products" or a category kicker. */
  eyebrow?: string;
  className?: string;
}

export function CategoryCard({ title, href, image, description, eyebrow, className }: CategoryCardProps) {
  return (
    <a href={href} className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.media}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          unoptimized
          className={styles.img}
        />
      </div>
      <div className={styles.body}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}
        <span className={styles.arrow} aria-hidden="true">→</span>
      </div>
    </a>
  );
}

export default CategoryCard;
