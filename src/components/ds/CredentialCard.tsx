import type { ReactNode } from 'react';
import { CertificateIcon } from './icons';
import styles from './CredentialCard.module.css';

export interface CredentialCardProps {
  /** Credential / certification name, e.g. "MSME ZED Bronze". */
  name: string;
  /** Registration / certificate number — rendered in the mono face. */
  regNumber: string;
  /** Issuing body caption, e.g. "Ministry of MSME". */
  issuer?: string;
  /** Optional icon node; defaults to a certificate glyph. */
  icon?: ReactNode;
  className?: string;
}

/**
 * CredentialCard (T0.1) — a compact credential tile for the future About-page
 * credentials grid: icon slot, credential name, registration number (mono),
 * and an issuing-body caption. Machined treatment (1px border + tight shadow).
 * Server component.
 */
export function CredentialCard({ name, regNumber, issuer, icon, className }: CredentialCardProps) {
  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')}>
      <span className={styles.iconSlot} aria-hidden="true">{icon ?? <CertificateIcon />}</span>
      <span className={styles.body}>
        <span className={styles.name}>{name}</span>
        <span className={styles.reg}>{regNumber}</span>
        {issuer && <span className={styles.issuer}>{issuer}</span>}
      </span>
    </article>
  );
}

export default CredentialCard;
