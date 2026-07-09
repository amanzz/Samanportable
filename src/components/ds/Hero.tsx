import type { ReactNode } from 'react';
import type { DsCta, DsImage } from './types';
import { Cta } from './Cta';
import { PhoneIcon } from './icons';
import styles from './Hero.module.css';

/** Zone-aware Call CTA: renders the phone number itself as a tel: link. */
export interface CallContact {
  label: string;
  phone: string;
}

/**
 * Hero — top-of-page banner.
 *
 * Slots: headline + subline + primary CTA (+ optional secondary CTA), an
 * optional media slot (image with REQUIRED width/height for zero CLS, or any
 * node), and an optional SpecStrip slot rendered as a persistent band beneath
 * the copy. Server component; CSS-only reveal, reduced-motion safe.
 *
 * NOTE (role rule): this component never generates copy — headline/subline are
 * caller-supplied strings.
 */
export interface HeroProps {
  headline: string;
  subline?: string;
  /** Required unless `actions` is supplied. */
  primaryCta?: DsCta;
  secondaryCta?: DsCta;
  /** Custom actions node (e.g. a CTARow) — overrides primary/secondary/call. */
  actions?: ReactNode;
  /** Media slot: either a typed image (width/height required) or arbitrary node. */
  media?: DsImage | ReactNode;
  /** Optional zone-aware Call button (ghost, phone icon) after the CTAs. */
  callContact?: CallContact;
  /** Optional trust slot (e.g. a TrustBadgeRow) rendered under the CTA row. */
  trustSlot?: ReactNode;
  /** Optional SpecStrip (or any node) rendered as a band below the hero copy. */
  specStrip?: ReactNode;
  className?: string;
}

function isDsImage(m: unknown): m is DsImage {
  return !!m && typeof m === 'object' && 'src' in (m as object) && 'width' in (m as object);
}

/** tel: href from a display phone number (strip spaces/punctuation, keep +). */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export function Hero({ headline, subline, primaryCta, secondaryCta, actions, callContact, trustSlot, media, specStrip, className }: HeroProps) {
  return (
    <section className={[styles.hero, className].filter(Boolean).join(' ')}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          <h1 className={styles.headline}>{headline}</h1>
          {subline && <p className={styles.subline}>{subline}</p>}
          {actions ? (
            actions
          ) : (
            <div className={styles.actions}>
              {primaryCta && <Cta {...primaryCta} variant="primary" />}
              {secondaryCta && <Cta {...secondaryCta} variant="secondary" />}
              {callContact && (
                <Cta
                  variant="ghost"
                  icon={<PhoneIcon />}
                  label={`${callContact.label} ${callContact.phone}`}
                  href={telHref(callContact.phone)}
                  ariaLabel={`${callContact.label}: ${callContact.phone}`}
                />
              )}
            </div>
          )}
          {trustSlot !== undefined && <div className={styles.trustSlot}>{trustSlot}</div>}
        </div>

        {media !== undefined && (
          <div className={styles.media}>
            {isDsImage(media) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.src} alt={media.alt} width={media.width} height={media.height} className={styles.mediaImg} />
            ) : (
              media
            )}
          </div>
        )}
      </div>

      {specStrip !== undefined && <div className={styles.specSlot}>{specStrip}</div>}
    </section>
  );
}

export default Hero;
