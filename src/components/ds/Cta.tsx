import type { ReactNode } from 'react';
import type { DsCta } from './types';
import styles from './Cta.module.css';

/**
 * Internal CTA primitive shared by Hero, CTABlock, ZoneContactCard, etc.
 * Renders an <a> when `href` is set, otherwise a <button>. Token-driven,
 * visible keyboard focus (inherited from PageShell), CSS-only hover + a
 * pressed/active state. Not a top-level spec component — a shared building block.
 */
export interface CtaProps extends DsCta {
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Optional leading icon (inline SVG node) — e.g. a phone glyph on Call CTAs. */
  icon?: ReactNode;
  /** Fully-rounded pill radius (~999px) — the owner-approved CTA-row style. */
  pill?: boolean;
  /** `md` = 44px min (default); `lg` = 48px min + generous padding (primary CTA). */
  size?: 'md' | 'lg';
  /** `onDark` recolours the button for placement on the forest surface. */
  tone?: 'default' | 'onDark';
  /** Full-width on its own line (used inside StickyMobileBar-style layouts). */
  block?: boolean;
  className?: string;
}

export function Cta({ label, href, onClick, ariaLabel, variant = 'primary', icon, pill, size = 'md', tone = 'default', block, className }: CtaProps) {
  const cls = [
    styles.cta,
    styles[variant],
    styles[size],
    pill ? styles.pill : '',
    tone === 'onDark' ? styles.onDark : '',
    block ? styles.block : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const inner = (
    <>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} aria-label={ariaLabel} onClick={onClick}>
      {inner}
    </button>
  );
}

export default Cta;
