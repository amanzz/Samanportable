/**
 * SAMAN Design System — Design Tokens (PROJECT SHIKHAR / T0)
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every literal value in the design system.
 *
 * RULE (acceptance criterion): This is the ONLY file in `src/components/ds`
 * that is permitted to contain hardcoded hex color values. Every component
 * consumes tokens exclusively through the CSS custom properties emitted by
 * `dsCssVariables()` (see PageShell, which injects them) — never a raw hex.
 *
 * The token objects below are the authoritative data. `dsCssVariables()`
 * serialises them into `--ds-*` custom properties so both TS callers and
 * CSS Modules read from the same source.
 *
 * Fonts are NOT declared here — they are provided by `next/font` in
 * `./fonts.ts`, which binds `--ds-font-sans` / `--ds-font-mono`.
 */

/* -------------------------------------------------------------------------- */
/* Raw palette — the only hex literals in the whole design system.            */
/* -------------------------------------------------------------------------- */
export const palette = {
  forest: '#1a3c2e', // deep brand green — headers, dark surfaces
  leaf: '#2d7a3f', // primary action green
  mist: '#f0f7f2', // pale green tint — alt surfaces
  ink: '#14211b', // near-black (slight green cast) — primary text
  steel: '#5f6f67', // mid neutral — secondary text / meta
  paper: '#f8faf8', // off-white — page background
  white: '#ffffff', // pure white — cards / panels
  leafDark: '#245f31', // primary hover (darker leaf)
  border: '#dbe7df', // hairline borders on light surfaces
  borderStrong: '#c2d6c9', // stronger divider
  focus: '#7cc48c', // focus ring (accessible against forest & white)
  onDark: '#eaf3ec', // text on forest/leaf surfaces
} as const;

/* -------------------------------------------------------------------------- */
/* Semantic aliases — what components actually reference.                      */
/* -------------------------------------------------------------------------- */
export const semantic = {
  primary: palette.leaf,
  primaryHover: palette.leafDark,
  primaryActive: palette.forest, // pressed state — deeper than hover
  surface: palette.white,
  surfaceAlt: palette.mist,
  surfaceInverse: palette.forest,
  textPrimary: palette.ink,
  textSecondary: palette.steel,
  textInverse: palette.onDark,
  border: palette.border,
  borderStrong: palette.borderStrong,
  success: palette.leaf,
  focus: palette.focus,
  background: palette.paper,
} as const;

/* -------------------------------------------------------------------------- */
/* Typography scale.                                                          */
/* Two families / four weights total (PERF LOCK L11): Archivo (400/600/800)   */
/* covers display + body + headings; IBM Plex Mono (500) is the spec face.    */
/* Display vs body character is achieved by weight+size, not a 3rd family.    */
/* -------------------------------------------------------------------------- */
export const fontFamily = {
  sans: 'var(--ds-font-sans), system-ui, "Segoe UI", Arial, sans-serif',
  mono: 'var(--ds-font-mono), ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
} as const;

export const fontWeight = {
  regular: 400,
  semibold: 600,
  black: 800,
} as const;

/**
 * Each role: [font-size (fluid clamp allowed), line-height, weight, letter-spacing].
 * Sizes use clamp() so headings scale from 360px → 1440px with zero manual media.
 */
// T0.1 owner review ("text big"): heading scale shifted down one step.
// Desktop caps reduced ~15–18% (display 56→46px, h1 44→36px, h2 32→27px,
// h3 22→20px) and line-heights tightened so headings read dense/engineered.
export const type = {
  display: { size: 'clamp(1.875rem, 1.1rem + 2.7vw, 2.875rem)', lineHeight: '1.02', weight: fontWeight.black, tracking: '-0.02em', family: fontFamily.sans },
  h1: { size: 'clamp(1.625rem, 1.05rem + 2.2vw, 2.25rem)', lineHeight: '1.05', weight: fontWeight.black, tracking: '-0.015em', family: fontFamily.sans },
  // T0.2 owner review round 2: h2/h3 reduced one further step (display/h1 unchanged).
  // h2 27→23px desktop / 21→19px mobile; h3 20→18px desktop / 18→16px mobile.
  h2: { size: 'clamp(1.1875rem, 1.05rem + 0.6vw, 1.4375rem)', lineHeight: '1.1', weight: fontWeight.semibold, tracking: '-0.01em', family: fontFamily.sans },
  h3: { size: 'clamp(1rem, 0.93rem + 0.35vw, 1.125rem)', lineHeight: '1.2', weight: fontWeight.semibold, tracking: '-0.005em', family: fontFamily.sans },
  body: { size: '1rem', lineHeight: '1.6', weight: fontWeight.regular, tracking: '0', family: fontFamily.sans },
  small: { size: '0.875rem', lineHeight: '1.5', weight: fontWeight.regular, tracking: '0', family: fontFamily.sans },
  caption: { size: '0.75rem', lineHeight: '1.4', weight: fontWeight.semibold, tracking: '0.06em', family: fontFamily.sans },
  /** Utility face for spec/price data — the SpecStrip / SpecTable / PriceCard numerals. */
  mono: { size: '0.8125rem', lineHeight: '1.4', weight: 500, tracking: '0.01em', family: fontFamily.mono },
} as const;

/* -------------------------------------------------------------------------- */
/* Spacing — 4px base scale.                                                  */
/* -------------------------------------------------------------------------- */
export const spacing = {
  0: '0',
  1: '0.25rem', // 4
  2: '0.5rem', // 8
  3: '0.75rem', // 12
  4: '1rem', // 16
  5: '1.25rem', // 20
  6: '1.5rem', // 24
  8: '2rem', // 32
  10: '2.5rem', // 40
  12: '3rem', // 48
  16: '4rem', // 64
  20: '5rem', // 80
} as const;

/* -------------------------------------------------------------------------- */
/* Radius (small/medium), one shadow level, max content width.                */
/* -------------------------------------------------------------------------- */
export const radius = {
  sm: '6px',
  md: '12px',
} as const;

/**
 * Single elevation level. T0.1: tightened to a crisp, "machined" treatment
 * (near-hairline offsets) — cards ground themselves with the 1px border token
 * rather than floating on a soft blur.
 */
export const shadow = {
  card: '0 1px 1px rgba(20, 33, 27, 0.04), 0 1px 3px rgba(20, 33, 27, 0.07)',
} as const;

export const layout = {
  maxWidth: '1200px',
  /** Header + StickyMobileBar reserve these fixed heights → zero CLS (L11). */
  headerHeight: '64px',
  stickyBarHeight: '60px',
  /** T0.4: single vertical rhythm between page sections (40→64px fluid). */
  sectionSpacing: 'clamp(2.5rem, 1.9rem + 2.4vw, 4rem)',
} as const;

export const motion = {
  /** Only subtle hover/reveal is permitted; respect prefers-reduced-motion. */
  fast: '140ms',
  base: '220ms',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/* -------------------------------------------------------------------------- */
/* CSS custom property serialisation.                                          */
/* Every value above is emitted as a `--ds-*` variable. PageShell injects the  */
/* returned string once, so CSS Modules can reference var(--ds-*) with no hex. */
/* -------------------------------------------------------------------------- */
export function dsCssVariables(): string {
  const decls: string[] = [];
  const push = (name: string, value: string | number) => decls.push(`--ds-${name}: ${value};`);

  // Raw palette (exposed for edge cases; components prefer the semantic set).
  for (const [k, v] of Object.entries(palette)) push(`color-${kebab(k)}`, v);

  // Semantic aliases.
  for (const [k, v] of Object.entries(semantic)) push(kebab(k), v);

  // Typography roles.
  for (const [role, t] of Object.entries(type)) {
    push(`text-${role}-size`, t.size);
    push(`text-${role}-lh`, t.lineHeight);
    push(`text-${role}-weight`, t.weight);
    push(`text-${role}-tracking`, t.tracking);
    push(`text-${role}-family`, t.family);
  }
  push('font-sans-stack', fontFamily.sans);
  push('font-mono-stack', fontFamily.mono);

  // Spacing.
  for (const [k, v] of Object.entries(spacing)) push(`space-${k}`, v);

  // Radius / shadow / layout / motion.
  push('radius-sm', radius.sm);
  push('radius-md', radius.md);
  push('shadow-card', shadow.card);
  push('maxw', layout.maxWidth);
  push('header-h', layout.headerHeight);
  push('sticky-bar-h', layout.stickyBarHeight);
  push('section-y', layout.sectionSpacing);
  push('motion-fast', motion.fast);
  push('motion-base', motion.base);
  push('motion-ease', motion.ease);

  return decls.join('\n  ');
}

function kebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Convenience export for consumers that need raw token objects in TS. */
export const tokens = {
  palette,
  semantic,
  type,
  fontFamily,
  fontWeight,
  spacing,
  radius,
  shadow,
  layout,
  motion,
} as const;

export type Tokens = typeof tokens;
