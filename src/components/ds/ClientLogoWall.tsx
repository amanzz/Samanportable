import type { DsImage } from './types';
import styles from './ClientLogoWall.module.css';

/**
 * ClientLogoWall — the SINGLE SOURCE OF TRUTH for client logos.
 *
 * Callers pass one flat array; the component de-duplicates by `src` so a logo
 * can never be rendered twice even if the source data double-lists it. Each
 * logo requires explicit width/height (zero CLS). Server component.
 */
export interface ClientLogoWallProps {
  logos: DsImage[];
  title?: string;
  className?: string;
}

export function ClientLogoWall({ logos, title, className }: ClientLogoWallProps) {
  // Single source of truth: collapse duplicates by src (last-wins on alt/size).
  const unique = Array.from(new Map(logos.map((l) => [l.src, l])).values());

  return (
    <section className={[styles.wall, className].filter(Boolean).join(' ')} aria-label={title ?? 'Our clients'}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <ul className={styles.grid}>
        {unique.map((logo) => (
          <li key={logo.src} className={styles.item}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={styles.logo} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ClientLogoWall;
