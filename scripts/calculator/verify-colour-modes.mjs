/**
 * Colour gate — dark surface system, Fable 5 spec 04 Aug 2026.
 *
 * Supersedes the two-mode light/green gate. That system is gone: there is one
 * dark ground now, so a gate asserting two light modes would be asserting a
 * design that no longer exists.
 *
 * Four assertions:
 *
 *   1. SURFACE SEPARATION. Every surface differs from the one it sits on.
 *      Ground -> panel -> card -> inset must each be distinguishable, or the
 *      elevation reads as flat and the green-on-green class returns in a new
 *      colour.
 *
 *   2. ACCENT DISCIPLINE. Amber appears in exactly five roles: price figures,
 *      primary CTA fill, active pill fill, selected card border, add-on "+"
 *      values. Any sixth use is a failure. This is the rule that makes the
 *      restraint hold, so it is mechanical rather than a matter of taste.
 *
 *   3. THE #2d7a3f DEMOTION. It may not appear in any active or selected
 *      state, nor as a CTA fill. Success and confirmation only.
 *
 *   4. CONTRAST. Text >= 4.5:1, UI borders and controls >= 3:1, computed
 *      against the surface each actually sits on, alpha resolved.
 *
 * The browser gate in verify-browser-gates.mjs runs on top of this and checks
 * what actually paints. Where the two disagree, that disagreement is the
 * finding.
 *
 * Run: node scripts/calculator/verify-colour-modes.mjs
 */
import fs from 'node:fs';
import { failIfDiffs, fromRoot } from './common.mjs';

const source = fs.readFileSync(fromRoot('src', 'lib', 'cabinCalculatorSSR.ts'), 'utf8');
const styles = /export const CABIN_CALCULATOR_SSR_STYLES = `([\s\S]*?)`;/.exec(source)?.[1] ?? '';
const dark = styles.slice(styles.indexOf('DARK SURFACE SYSTEM'));
const rules = dark.replace(/\/\*[\s\S]*?\*\//g, ' ');

/**
 * Token values are READ FROM THE STYLESHEET, never hardcoded here.
 *
 * They used to be copied into this file, which made the gate blind: a fixture
 * that set --sd-card to the panel colour, and one that dropped --sd-text-2 to
 * 0.20 alpha, both passed. The gate was checking its own copy of the palette
 * rather than the palette that ships.
 */
function hexToken(name) {
  const m = new RegExp(String.raw`--${name}:\s*(#[0-9a-fA-F]{3,8})`).exec(styles);
  if (!m) throw new Error(`token --${name} not found in the stylesheet`);
  return m[1];
}
function alphaToken(name) {
  // String.raw, because in a plain template literal \s and \( collapse to s
  // and ( — the pattern then matched nothing useful and every alpha token
  // resolved to NaN, which the gate reported as "below 4.5:1".
  const m = new RegExp(String.raw`--${name}:\s*rgba\(([^)]+)\)`).exec(styles);
  if (!m) throw new Error(`token --${name} not found in the stylesheet`);
  return m[1].split(',').map((v) => Number(v.trim()));
}
const TOKENS = {
  ground: hexToken('sd-ground'), panel: hexToken('sd-panel'), card: hexToken('sd-card'),
  inset: hexToken('sd-inset'), text: hexToken('sd-text'), amber: hexToken('saman-amber'),
};
const ALPHA_TEXT = { text2: alphaToken('sd-text-2'), text3: alphaToken('sd-text-3') };
const HAIRLINE = {
  hairline: alphaToken('sd-hairline'), hairlineHi: alphaToken('sd-hairline-hi'),
  control: alphaToken('sd-control-border'),
};
const DEMOTED = '#2d7a3f';

const diffs = [];
const pad = (s, n) => String(s).padEnd(n);

// --- colour maths -----------------------------------------------------------
const rgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const over = ([r, g, b, a], bg) => {
  const [br, bg2, bb] = rgb(bg);
  return [r * a + br * (1 - a), g * a + bg2 * (1 - a), b * a + bb * (1 - a)];
};
const lum = (c) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// --- 1 · surface separation -------------------------------------------------
console.log('SURFACE SEPARATION — each surface against the one beneath it');
const STACK = [
  ['panel on ground', TOKENS.panel, TOKENS.ground],
  ['card on panel', TOKENS.card, TOKENS.panel],
  ['inset on panel', TOKENS.inset, TOKENS.panel],
  ['header gradient on ground', '#1A3C2E', TOKENS.ground],
];
/** The total block is an overlay, so it is compared after compositing. */
const LIFT = [255, 255, 255, 0.06];
for (const [name, fg, bg] of STACK) {
  const same = fg.toLowerCase() === bg.toLowerCase();
  const r = ratio(rgb(fg), rgb(bg));
  console.log(`  ${pad(name, 30)} ${pad(fg, 10)} on ${pad(bg, 10)} ${same ? 'IDENTICAL' : `separated, ${r.toFixed(2)}:1`}`);
  if (same) diffs.push(`${name}: ${fg} is identical to the surface beneath it`);
}

{
  const lifted = over(LIFT, TOKENS.panel);
  const panel = rgb(TOKENS.panel);
  const same = lifted.every((v, i) => Math.round(v) === panel[i]);
  const r = ratio(lifted, panel);
  console.log(`  ${pad('total block on panel', 30)} ${pad('lift 6%', 10)} on ${pad(TOKENS.panel, 10)} ${same ? 'IDENTICAL' : `separated, ${r.toFixed(2)}:1`}`);
  if (same) diffs.push('total block: the lifted fill is identical to the panel beneath it');
  const amber = ratio(rgb(TOKENS.amber), lifted);
  console.log(`  ${pad('amber total figure on lift', 30)} ${amber.toFixed(2)}:1  min 4.5  ${amber >= 4.5 ? '' : 'BELOW'}`);
  if (amber < 4.5) diffs.push(`amber total figure on the lifted block is ${amber.toFixed(2)}:1, below 4.5:1`);
}

// --- 2 · accent discipline --------------------------------------------------
/** The five permitted roles, each identified by the selector that carries it. */
const PERMITTED_AMBER = [
  ['price figures', /\.choice-price\{[^}]*var\(--saman-amber\)/],
  ['primary CTA fill', /button\.primary[^{]*\{[^}]*background:var\(--saman-amber\)/],
  ['active pill fill', /a\[aria-current="step"\][^{]*\{[^}]*background:var\(--saman-amber\)/],
  ['selected card border', /input:checked\+span\{[^}]*border:1px solid var\(--saman-amber\)/],
  ['estimate total figure', /\[data-estimate-total\]\{[^}]*var\(--saman-amber\)/],
];
console.log('\nACCENT DISCIPLINE — amber in exactly five roles');
for (const [role, re] of PERMITTED_AMBER) {
  const present = re.test(rules);
  console.log(`  ${pad(role, 30)} ${present ? 'present' : 'MISSING'}`);
  if (!present) diffs.push(`amber role "${role}" is not implemented`);
}

/** Any amber use OUTSIDE those roles, plus the sanctioned support uses. */
const SANCTIONED_EXTRA = [
  'summary-ex',            // the header price figure — role 1
  'step-progress',         // progress fill, reads as the active state
  'focus-visible',         // focus ring must be the accent to be seen on dark
  'mobile-estimate',       // the mobile total figure — role 1
  '--saman-amber:',        // the declaration itself
  'rgba(224,163,64',       // the selected-card ring
  // The chip's "+₹" delta. This is role 1, a price figure, on a chip rather
  // than a product tile - the tile carries .choice-price, the chip carries the
  // delta as its first small. Same role, different element, so it is named
  // here rather than added to the five, which stay exactly five.
  'span > small:first-of-type',
];
const amberRules = rules.split('\n').filter((line) => /saman-amber|E0A340/i.test(line));
const unexplained = amberRules.filter((line) => {
  if (PERMITTED_AMBER.some(([, re]) => re.test(line))) return false;
  return !SANCTIONED_EXTRA.some((s) => line.includes(s));
});
console.log(`  ${pad('rules mentioning amber', 30)} ${amberRules.length}`);
console.log(`  ${pad('outside permitted roles', 30)} ${unexplained.length}`);
for (const line of unexplained) {
  console.log(`      ${line.trim().slice(0, 92)}`);
  diffs.push(`amber used outside its five roles: ${line.trim().slice(0, 80)}`);
}

// Amber must never carry a heading, body copy or an icon.
const FORBIDDEN_AMBER = [/h2[^{]*\{[^}]*saman-amber/, /\.choice-description\{[^}]*saman-amber/, /svg[^{]*\{[^}]*saman-amber/];
for (const re of FORBIDDEN_AMBER) {
  if (re.test(rules)) diffs.push(`amber applied to a heading, body string or icon: ${re}`);
}

// --- 3 · the #2d7a3f demotion ----------------------------------------------
/**
 * Matched on RULE BLOCKS, not lines.
 *
 * The stylesheet is pretty-printed in places, so a selector and its
 * declarations sit on different lines. A line-based scan reported zero
 * violations while `.calc-choice:has(input:checked)` was painting every
 * selected card with the accent, and while `.step-nav a.is-active` was
 * filling the active pill with it. Both are exactly what this rule forbids.
 *
 * The whole stylesheet is scanned, not just the dark layer: the violation
 * that mattered lived in the legacy rules above it.
 */
console.log('\n#2d7a3f DEMOTION — never active, never selected, never a CTA');
const allCss = styles.replace(/\/\*[\s\S]*?\*\//g, ' ');
const blocks = [...allCss.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((m) => ({
  selector: m[1].replace(/\s+/g, ' ').trim(),
  body: m[2].replace(/\s+/g, ' ').trim(),
}));
const usesDemoted = (body) => /#2d7a3f/i.test(body) || /var\(--calc-accent(?:-strong)?\)/.test(body);
const isStateSelector = (sel) => /\.is-active|aria-current="step"|:checked|button\.primary|\[type="submit"\]/.test(sel);
const stateBlocks = blocks.filter((b) => isStateSelector(b.selector));
const violating = stateBlocks.filter((b) => usesDemoted(b.body) && /background|border-color|border:/.test(b.body));
console.log(`  ${pad('active/selected/CTA rules', 30)} ${stateBlocks.length}`);
console.log(`  ${pad('of those using #2d7a3f', 30)} ${violating.length}`);
for (const b of violating) {
  console.log(`      ${b.selector.slice(0, 60)}  ->  ${b.body.slice(0, 60)}`);
  diffs.push(`#2d7a3f in an active, selected or CTA state: ${b.selector.slice(0, 60)}`);
}

// --- 4 · contrast -----------------------------------------------------------
console.log('\nCONTRAST — text >= 4.5:1, UI borders and controls >= 3:1');
const TEXT_PAIRS = [
  ['body text on panel', rgb(TOKENS.text), TOKENS.panel, 4.5],
  ['body text on card', rgb(TOKENS.text), TOKENS.card, 4.5],
  ['muted text on panel', over(ALPHA_TEXT.text2, TOKENS.panel), TOKENS.panel, 4.5],
  ['muted text on card', over(ALPHA_TEXT.text2, TOKENS.card), TOKENS.card, 4.5],
  // The eyebrow is 11px/700. WCAG large text starts at 18.66px bold, so 4.5:1
  // applies. --calc-text-3 gives 3.57:1 here, so the eyebrow uses text-2.
  ['eyebrow on header', over(ALPHA_TEXT.text2, '#1A3C2E'), '#1A3C2E', 4.5],
  ['amber figure on header', rgb(TOKENS.amber), '#1A3C2E', 4.5],
  ['amber figure on panel', rgb(TOKENS.amber), TOKENS.panel, 4.5],
  ['CTA text on amber', rgb(TOKENS.ground), TOKENS.amber, 4.5],
  ['active pill text on amber', rgb(TOKENS.ground), TOKENS.amber, 4.5],
];
for (const [name, fg, bg, min] of TEXT_PAIRS) {
  const r = ratio(fg, rgb(bg));
  const ok = r >= min;
  console.log(`  ${pad(name, 30)} ${r.toFixed(2)}:1  min ${min}  ${ok ? '' : 'BELOW'}`);
  if (!ok) diffs.push(`${name} is ${r.toFixed(2)}:1, below ${min}:1`);
}
const UI_PAIRS = [
  // Decorative hairlines separate surfaces and carry no meaning, so 1.4.11
  // does not apply to them. A control BORDER does identify the control, so it
  // gets its own stronger token.
  ['control border on panel', over(HAIRLINE.control, TOKENS.panel), TOKENS.panel, 3],
  ['control border on inset', over(HAIRLINE.control, TOKENS.inset), TOKENS.inset, 3],
  ['amber border on card', rgb(TOKENS.amber), TOKENS.card, 3],
];
for (const [name, fg, bg, min] of UI_PAIRS) {
  const r = ratio(fg, rgb(bg));
  const ok = r >= min;
  console.log(`  ${pad(name, 30)} ${r.toFixed(2)}:1  min ${min}  ${ok ? '' : 'BELOW'}`);
  if (!ok) diffs.push(`${name} is ${r.toFixed(2)}:1, below ${min}:1`);
}

// The competitor's brand orange must never appear.
if (/249,\s*140,\s*16|#f98c10/i.test(styles)) {
  diffs.push('competitor brand orange rgb(249,140,16) present in the stylesheet');
}

console.log('');
failIfDiffs('colour-system', diffs);
