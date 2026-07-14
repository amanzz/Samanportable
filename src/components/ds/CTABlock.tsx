import type { ReactNode } from 'react';
import type { DsCta } from './types';
import { Cta } from './Cta';
import styles from './CTABlock.module.css';

/**
 * CTABlock — a full-width conversion band (headline + optional supporting line
 * + actions) on the inverse forest surface. Actions default to one/two inline
 * CTAs, or you can supply a custom `actions` node (e.g. a <CTARow />). Server
 * component.
 */
export interface CTABlockProps {
  title: string;
  description?: string;
  /** Required unless `actions` is supplied. */
  primaryCta?: DsCta;
  secondaryCta?: DsCta;
  /** Custom actions node — overrides primary/secondary (e.g. a CTARow). */
  actions?: ReactNode;
  /** `inverse` (forest) is the default; `soft` uses the mist surface. */
  tone?: 'inverse' | 'soft';
  className?: string;
}

export function CTABlock({ title, description, primaryCta, secondaryCta, actions, tone = 'inverse', className }: CTABlockProps) {
  return (
    <section className={[styles.block, styles[tone], className].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
        <div className={styles.actions}>
          {actions ? (
            actions
          ) : primaryCta ? (
            <>
              <Cta {...primaryCta} variant="primary" />
              {secondaryCta && (
                <Cta {...secondaryCta} variant="secondary" className={tone === 'inverse' ? styles.onDarkSecondary : undefined} />
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default CTABlock;
