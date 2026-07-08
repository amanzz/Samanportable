import type { CSSProperties, ReactNode } from 'react';
import { dsCssVariables } from './tokens';
import { dsFontVariables } from './fonts';
import styles from './PageShell.module.css';

/**
 * PageShell — the root container for every SAMAN Design System surface.
 *
 * Responsibilities:
 *  1. Binds the self-hosted font variables (`--ds-font-sans` / `--ds-font-mono`).
 *  2. Injects every design token as a `--ds-*` CSS custom property (generated
 *     from tokens.ts — the only place hex literals exist). All descendant
 *     components resolve their styles from these variables.
 *  3. Provides base typography, an accessible focus ring, and a
 *     prefers-reduced-motion guard, scoped to the `.ds-root` subtree so the
 *     design system never leaks styles into (or inherits from) existing pages.
 *  4. Reserves a fixed header height so header mount causes zero CLS (L11).
 *
 * Server-safe (no client hooks). CSS Module + injected `:root`-scoped vars.
 */
export interface PageShellProps {
  children: ReactNode;
  /** Optional sticky header content. Rendered in a fixed-height bar (no CLS). */
  header?: ReactNode;
  /** Optional footer content. */
  footer?: ReactNode;
  /** Page background surface. Defaults to `paper`. */
  background?: 'paper' | 'mist' | 'surface';
  /** Constrain the main content column. Defaults to the token max width. */
  contained?: boolean;
  className?: string;
}

const BACKGROUND_VAR: Record<NonNullable<PageShellProps['background']>, string> = {
  paper: 'var(--ds-background)',
  mist: 'var(--ds-surface-alt)',
  surface: 'var(--ds-surface)',
};

export function PageShell({
  children,
  header,
  footer,
  background = 'paper',
  contained = true,
  className,
}: PageShellProps) {
  const rootStyle: CSSProperties = { background: BACKGROUND_VAR[background] };

  return (
    <div
      className={[styles.root, dsFontVariables, className].filter(Boolean).join(' ')}
      style={rootStyle}
      data-ds-root=""
    >
      {/* Token variables + scoped base styles, scoped to [data-ds-root] — the
          SAME element next/font binds --ds-font-sans/mono to. This co-location
          is required: composed family vars (--ds-text-*-family) reference the
          font vars, which are substituted where declared, so they must share an
          element or they compute empty. Generated from tokens.ts (hex lives
          only there, never inline here). */}
      <style
        dangerouslySetInnerHTML={{
          __html: `[data-ds-root] {\n  ${dsCssVariables()}\n}\n${BASE_CSS}`,
        }}
      />

      {header !== undefined && (
        <header className={styles.header}>
          <div className={styles.headerInner}>{header}</div>
        </header>
      )}

      <main className={contained ? styles.mainContained : styles.main}>{children}</main>

      {footer !== undefined && <footer className={styles.footer}>{footer}</footer>}
    </div>
  );
}

/**
 * Base, subtree-scoped CSS. Uses only `--ds-*` variables (no hex here).
 * Kept as a string so it ships inside the same injected <style> as the tokens.
 */
const BASE_CSS = `
[data-ds-root], [data-ds-root] *, [data-ds-root] *::before, [data-ds-root] *::after {
  box-sizing: border-box;
}
[data-ds-root] {
  font-family: var(--ds-font-sans-stack);
  color: var(--ds-text-primary);
  font-size: var(--ds-text-body-size);
  line-height: var(--ds-text-body-lh);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
[data-ds-root] :where(a) { color: inherit; }
[data-ds-root] :where(h1, h2, h3, p, figure, ul, ol) { margin: 0; }
[data-ds-root] :where(img) { max-width: 100%; height: auto; }
[data-ds-root] :where(:focus-visible) {
  outline: 3px solid var(--ds-focus);
  outline-offset: 2px;
  border-radius: var(--ds-radius-sm);
}
@media (prefers-reduced-motion: reduce) {
  [data-ds-root] *, [data-ds-root] *::before, [data-ds-root] *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`;

export default PageShell;
