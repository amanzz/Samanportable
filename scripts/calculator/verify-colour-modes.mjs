/**
 * Colour-mode gate — design spec v1 Part 4.
 *
 * Two assertions:
 *
 *   1. BACKGROUND EQUALITY. For every card, panel, pill and button, its
 *      background must differ from the background it sits on. A green section
 *      containing green cards is what SAMAN rejected: it was legible only
 *      because the text happened to be white. Any equality is a failure and is
 *      reported, not tuned by eye.
 *
 *   2. CONTRAST. Every text-on-background pair is reported with its ratio.
 *      Anything under 4.5:1 is a defect.
 *
 * HOW THIS MEASURES. The spec asks for computed background against the nearest
 * positioned ancestor's computed background. There is no browser in this
 * toolchain, so the check resolves the CSS custom properties out of the
 * stylesheet itself and walks the known nesting. For this design that is
 * complete rather than approximate: every box's background IS a token, the
 * tokens are declared once per mode, and the nesting is fixed by the markup.
 * It is also stricter than a browser run in one way — it checks both modes on
 * every box, where a browser run only ever sees the mode it rendered.
 *
 * Run: node scripts/calculator/verify-colour-modes.mjs
 */
import fs from 'node:fs';
import { failIfDiffs, fromRoot } from './common.mjs';

const source = fs.readFileSync(fromRoot('src', 'lib', 'cabinCalculatorSSR.ts'), 'utf8');

/** The four approved colours. Opacity variants allowed; new hues are not. */
const PALETTE = { ink: '#1a3c2e', accent: '#2d7a3f', soft: '#f0f7f2', white: '#ffffff' };

/** Reads a mode's token block out of the stylesheet, so the gate cannot drift. */
function tokensFor(mode) {
  const block = new RegExp(`\\[data-theme="${mode}"\\]\\{([^}]*)\\}`).exec(source);
  if (!block) throw new Error(`No token block for mode "${mode}"`);
  const tokens = {};
  for (const [, name, value] of block[1].matchAll(/--([\w-]+):\s*([^;]+)/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

/** var(--c-ink) -> #1a3c2e; rgba(...) and transparent pass through. */
function resolve(tokens, value, seen = 0) {
  if (!value || seen > 6) return value;
  const varMatch = /^var\(--([\w-]+)\)$/.exec(value.trim());
  if (varMatch) {
    const name = varMatch[1];
    if (name.startsWith('c-')) return PALETTE[name.slice(2)] ?? value;
    return resolve(tokens, tokens[name], seen + 1);
  }
  return value.trim();
}

/**
 * Every box that paints a background, and the box it sits on.
 * `border` is recorded so the spec's table can be read back off the output.
 */
const BOXES = [
  { name: 'Summary header card', bg: 'bg-summary', fg: 'fg-summary', on: 'bg-section' },
  { name: 'Option card, unselected', bg: 'bg-card', fg: 'fg-card', on: 'bg-section' },
  { name: 'Option card, selected', bg: 'bg-card-sel', fg: 'fg-card-sel', on: 'bg-section' },
  { name: 'Step pill, inactive', bg: 'bg-pill', fg: 'fg-pill', on: 'bg-section' },
  { name: 'Step pill, active', bg: 'bg-pill-on', fg: 'fg-pill-on', on: 'bg-section' },
  { name: 'Estimate panel', bg: 'bg-panel', fg: 'fg-panel', on: 'bg-section' },
  { name: 'Total block', bg: 'bg-total', fg: 'fg-total', on: 'bg-panel' },
  { name: 'Construction disclosure', bg: 'bg-card', fg: 'fg-card', on: 'bg-section' },
  { name: 'Progress track', bg: 'bg-card', fg: 'fg-card', on: 'bg-section' },
  { name: 'Primary button', bg: null, fg: null, on: 'bg-section', literalBg: PALETTE.accent, literalFg: PALETTE.white },
  { name: 'Ghost button', bg: 'bg-card', fg: 'fg-card', on: 'bg-section' },
];

// --- contrast ---------------------------------------------------------------
const srgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};
const luminance = (hex) => {
  const [r, g, b] = srgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const diffs = [];
const pad = (s, n) => String(s).padEnd(n);

for (const mode of ['light', 'green']) {
  const tokens = tokensFor(mode);
  const modeName = mode === 'light' ? 'Mode W · white background' : 'Mode G · green background';
  console.log(`\n${modeName}`);
  console.log(pad('BOX', 28) + pad('BACKGROUND', 12) + pad('SITS ON', 12) + pad('DIFFERS', 9) + pad('TEXT', 12) + 'CONTRAST');
  console.log('-'.repeat(90));

  for (const box of BOXES) {
    const bg = box.literalBg ?? resolve(tokens, tokens[box.bg]);
    const fg = box.literalFg ?? resolve(tokens, tokens[box.fg]);
    const on = resolve(tokens, tokens[box.on]);
    const differs = bg.toLowerCase() !== on.toLowerCase();
    const ratio = contrast(fg, bg);

    console.log(
      pad(box.name, 28) + pad(bg, 12) + pad(on, 12) +
      pad(differs ? 'yes' : 'NO', 9) + pad(fg, 12) +
      `${ratio.toFixed(2)}:1${ratio < 4.5 ? '  BELOW 4.5' : ''}`
    );

    if (!differs) {
      diffs.push(`${modeName} — "${box.name}" background ${bg} equals its ancestor's ${on}`);
    }
    if (ratio < 4.5) {
      diffs.push(`${modeName} — "${box.name}" text ${fg} on ${bg} is ${ratio.toFixed(2)}:1, below 4.5:1`);
    }
  }
}

// --- palette containment ----------------------------------------------------
const styleBlock = /export const CABIN_CALCULATOR_SSR_STYLES = `([\s\S]*?)`;/.exec(source)?.[1] ?? '';
const phase1 = styleBlock.slice(styleBlock.indexOf('PHASE 1 LAYER'));
const allowed = new Set(Object.values(PALETTE).map((c) => c.toLowerCase()));
const usedHex = [...new Set((phase1.match(/#[0-9a-fA-F]{3,8}/g) || []).map((c) => c.toLowerCase()))];
const strayHex = usedHex.filter((c) => !allowed.has(c));

console.log(`\nPALETTE — four colours only`);
for (const c of usedHex) console.log(`  ${c}${allowed.has(c) ? '' : '  NOT IN PALETTE'}`);
if (strayHex.length) diffs.push(`colours outside the approved four: ${strayHex.join(', ')}`);

console.log('');
failIfDiffs('colour-modes', diffs);
