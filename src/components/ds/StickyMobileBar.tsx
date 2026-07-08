'use client';
// Pages Router: "use client" is a no-op here, kept to mark the intended client
// boundary (L11). The bar is purely link-based and needs no runtime state, so
// it is fully functional pre-hydration. Hidden at >=1024px via CSS.
import styles from './StickyMobileBar.module.css';

export interface StickyMobileBarProps {
  /** tel: link, e.g. "tel:+919000000000" */
  callHref: string;
  /** wa.me / whatsapp link */
  whatsappHref: string;
  /** Price calculator route */
  calculatorHref: string;
  className?: string;
}

/**
 * StickyMobileBar — fixed bottom action bar (Call | WhatsApp | Calculator) for
 * phones/tablets. Reserves a fixed height (token) so it never shifts layout;
 * hidden at >=1024px. Three equal, thumb-sized targets.
 */
export function StickyMobileBar({ callHref, whatsappHref, calculatorHref, className }: StickyMobileBarProps) {
  return (
    <div className={[styles.bar, className].filter(Boolean).join(' ')} role="group" aria-label="Quick contact">
      <a className={styles.action} href={callHref}>
        <span className={styles.icon} aria-hidden="true">✆</span>
        <span className={styles.label}>Call</span>
      </a>
      <a className={`${styles.action} ${styles.whatsapp}`} href={whatsappHref}>
        <span className={styles.icon} aria-hidden="true">◍</span>
        <span className={styles.label}>WhatsApp</span>
      </a>
      <a className={styles.action} href={calculatorHref}>
        <span className={styles.icon} aria-hidden="true">▦</span>
        <span className={styles.label}>Calculator</span>
      </a>
    </div>
  );
}

export default StickyMobileBar;
