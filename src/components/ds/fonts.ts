/**
 * SAMAN Design System — Self-hosted fonts (PERF LOCK L11).
 * ---------------------------------------------------------------------------
 * next/font downloads & self-hosts these at build time (no runtime request to
 * Google) and generates the @font-face + preload automatically. Two families,
 * four weights total — deliberately NOT Inter (the site body face) to give the
 * design system its own industrial/engineering identity.
 *
 *   Archivo        400 / 600 / 800   → display, headings, and body (weight-differentiated)
 *   IBM Plex Mono  500               → utility spec/price face (SpecStrip, SpecTable, PriceCard)
 *
 * `display: 'swap'` on both. The `.variable` classNames are applied to the
 * PageShell root, which binds `--ds-font-sans` / `--ds-font-mono` for the
 * subtree — this is what lets tokens.ts reference them without touching _app.
 *
 * NOTE: the first `next build` fetches these font files from Google's font CDN
 * once and caches them under `.next`; subsequent builds are offline-safe.
 */
import { Archivo, IBM_Plex_Mono } from 'next/font/google';

export const dsSans = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
  variable: '--ds-font-sans',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

export const dsMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  variable: '--ds-font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
});

/** Space-joined variable classNames — apply to the PageShell root element. */
export const dsFontVariables = `${dsSans.variable} ${dsMono.variable}`;
