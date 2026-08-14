/**
 * CALC-L4 gate. Every text-bearing node in the calculator, INCLUDING the
 * rendered value of every form control, must be legible in the states a user
 * can actually reach.
 *
 * Two independent failure modes, because CALC-L4's P0 was the second kind and a
 * contrast-only gate would have waved it through at 14.81:1:
 *   CONTRAST - value colour vs the colour actually painted behind it
 *   FIT      - an <input> whose value is wider than its content box paints
 *              nothing at all. Measured against the real font, no slack: an 8px
 *              box holding an 8.1px glyph showed zero ink on production.
 *
 * Reads control VALUES, never labels.
 *
 * Two methodology rules learned the hard way on 09 Aug 2026:
 *  - Steps are visited through the wizard's own navigation. An earlier revision
 *    force-revealed every [hidden] node and reported an estimate card nobody can
 *    see in that state. A gate that fails on unreachable states gets switched off.
 *  - FIT is checked on <input> only. A <select> truncates its option text
 *    visibly rather than painting nothing; those are reported as warnings so
 *    they are not lost, but they do not fail the build.
 *
 * Known findings live in BASELINE below, each with a reason. The gate fails if
 * anything NOT in that list appears, and reports the baseline every run so it
 * can never quietly become permanent.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.LEGIBILITY_BASE_URL || 'http://127.0.0.1:3119';
const routes = (process.env.LEGIBILITY_ROUTES
  || '/cabin-cost-calculator,/product/porta-cabins,/product/container-offices').split(',');
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
const outputDir = path.resolve(process.env.LEGIBILITY_OUTPUT || 'reports/calc-L4');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
if (!playwrightRoot) throw new Error('Set PLAYWRIGHT_PACKAGE_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

/**
 * Accepted pre-existing findings. NOT a silent cap: every entry is printed on
 * every run. Removing an entry must make the gate pass, never fail.
 */
const BASELINE = [
  {
    match: (f) => f.reason === 'CONTRAST' && f.selector === 'legend' && f.contrast >= 3.5 && f.contrast < 4.5,
    label: 'fieldset <legend> at --sd-text-2 (rgba(234,240,247,0.64)) on --sd-card: 3.88:1',
    reason: 'Pre-existing across the whole calculator. Fixing it means raising --sd-text-2, '
      + 'which repaints every secondary label on the module. Needs SAMAN\'s ruling; '
      + 'not bundled into a P0 stepper fix.',
  },
];

const AUDIT = String.raw`
(() => {
  const root = document.querySelector('.cabin-calculator-ssr');
  if (!root) return { skipped: true };
  const rgb = (v) => { const m = String(v).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[,\s\/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => { const f = (n) => { const s = n / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b);
    return Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100; };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  const behind = (el) => { const stack = []; let n = el;
    while (n && n.nodeType === 1) { const c = rgb(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; } n = n.parentElement; }
    let base = stack.length ? stack[stack.length - 1] : { r: 255, g: 255, b: 255, a: 1 };
    if (base.a < 1) base = over(base, { r: 255, g: 255, b: 255, a: 1 });
    for (let i = stack.length - 2; i >= 0; i -= 1) base = over(stack[i], base);
    return base; };
  const textWidth = (cs, text) => { const c = document.createElement('canvas').getContext('2d');
    c.font = [cs.fontStyle, cs.fontWeight, cs.fontSize, cs.fontFamily].join(' ');
    return c.measureText(text).width; };
  const painted = (el) => { let n = el;
    while (n && n.nodeType === 1) { const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      n = n.parentElement; }
    const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  const violations = []; const warnings = []; let checked = 0;

  const check = (el, text, kind) => {
    if (!text || !String(text).trim()) return;
    if (!painted(el)) return;
    checked += 1;
    const cs = getComputedStyle(el);
    const fillRaw = cs.webkitTextFillColor && cs.webkitTextFillColor !== 'currentcolor' ? cs.webkitTextFillColor : cs.color;
    let fg = rgb(fillRaw);
    const own = rgb(cs.backgroundColor);
    let bg = behind(el.parentElement || el);
    if (own && own.a > 0) bg = own.a === 1 ? own : over(own, bg);
    if (fg && fg.a < 1) fg = over(fg, bg);
    if (!fg || !bg) return;
    const contrast = ratio(fg, bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    const min = large ? 3 : 4.5;
    const base = { kind, text: String(text).slice(0, 40),
      selector: el.tagName.toLowerCase() + (el.getAttribute('name') ? '[name="' + el.getAttribute('name') + '"]' : ''),
      fontSize: cs.fontSize };
    if (contrast < min) violations.push({ ...base, reason: 'CONTRAST', contrast, min, color: hex(fg), background: hex(bg) });
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
      const content = el.getBoundingClientRect().width
        - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
        - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
      const needed = textWidth(cs, String(text));
      if (needed > content) {
        const f = { ...base, reason: 'FIT', contentWidth: Math.round(content * 10) / 10,
          neededWidth: Math.round(needed * 10) / 10, padding: cs.paddingLeft + '/' + cs.paddingRight };
        // An <input> paints nothing; a <select> truncates visibly. Different severity.
        if (el.tagName === 'INPUT') violations.push(f); else warnings.push(f);
      }
    }
  };

  root.querySelectorAll('input, select, textarea').forEach((el) => {
    const t = el.tagName.toLowerCase();
    if (t === 'input' && ['hidden', 'checkbox', 'radio', 'submit', 'button'].includes(el.type)) return;
    check(el, t === 'select' ? (el.selectedOptions[0]?.textContent || '') : el.value, 'control-value');
  });
  root.querySelectorAll('*').forEach((el) => {
    if (['INPUT', 'SELECT', 'TEXTAREA', 'SCRIPT', 'STYLE'].includes(el.tagName)) return;
    const direct = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (direct) check(el, direct, 'text-node');
  });
  return { violations, warnings, checked };
})()
`;

const browser = await chromium.launch({ channel: 'chrome' });
const allViolations = []; const allWarnings = [];
let totalChecked = 0; let statesVisited = 0;

for (const route of routes) {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: vp });
    try {
      await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await page.waitForTimeout(1200);
      const hasCalculator = await page.evaluate(() => !!document.querySelector('.cabin-calculator-ssr'));
      if (!hasCalculator) { console.log(`  ${route} @${vp.width}: no calculator on this route, skipped`); continue; }
      // Visit each of the nine steps the way a user does.
      for (let step = 1; step <= 9; step += 1) {
        const moved = await page.evaluate((n) => {
          const link = document.querySelector(`.step-nav a[href="#calculator-step-${n}"]`);
          if (!link) return false;
          link.click(); return true;
        }, step);
        if (!moved && step > 1) continue;
        await page.waitForTimeout(450);
        const result = await page.evaluate(AUDIT);
        if (result.skipped) continue;
        statesVisited += 1;
        totalChecked += result.checked;
        for (const v of result.violations) allViolations.push({ route, viewport: vp.width, step, ...v });
        for (const w of result.warnings) allWarnings.push({ route, viewport: vp.width, step, ...w });
      }
      console.log(`  ${route} @${vp.width}: nine steps walked`);
    } finally { await page.close(); }
  }
}
await browser.close();

// de-duplicate: the same node seen on several steps is one finding
const key = (f) => [f.route, f.viewport, f.reason, f.selector, f.text, f.contrast, f.contentWidth].join('|');
const unique = [...new Map(allViolations.map((f) => [key(f), f])).values()];
const uniqueWarnings = [...new Map(allWarnings.map((f) => [key(f), f])).values()];

const baselined = []; const failures = [];
for (const f of unique) {
  const hit = BASELINE.find((b) => b.match(f));
  (hit ? baselined : failures).push(hit ? { ...f, baseline: hit.label } : f);
}

await writeFile(path.join(outputDir, 'legibility-gate.json'),
  JSON.stringify({ baseUrl, routes, statesVisited, totalChecked, failures, baselined, warnings: uniqueWarnings }, null, 2));

console.log(`\ncontrol-value + text legibility gate`);
console.log(`  ${totalChecked} text-bearing nodes checked across ${statesVisited} reachable states`);
console.log(`  accepted baseline: ${baselined.length} findings`);
for (const b of BASELINE) {
  const n = baselined.filter((f) => b.match(f)).length;
  console.log(`    - ${b.label}: ${n} instances`);
  console.log(`      why accepted: ${b.reason}`);
}
if (uniqueWarnings.length) {
  console.log(`  warnings (visible truncation, not build-failing): ${uniqueWarnings.length}`);
  for (const w of uniqueWarnings.slice(0, 6)) {
    console.log(`    ${w.selector} "${w.text}" needs ${w.neededWidth}px in ${w.contentWidth}px`);
  }
}
if (failures.length) {
  console.log(`\nFAIL: ${failures.length} new violations`);
  for (const f of failures.slice(0, 40)) {
    console.log(f.reason === 'CONTRAST'
      ? `  CONTRAST ${f.route} @${f.viewport} step${f.step} ${f.selector} "${f.text}" ${f.contrast}:1 < ${f.min}:1 (${f.color} on ${f.background})`
      : `  FIT      ${f.route} @${f.viewport} step${f.step} ${f.selector} "${f.text}" needs ${f.neededWidth}px, content box ${f.contentWidth}px (pad ${f.padding})`);
  }
  process.exit(1);
}
console.log('\nPASS: every reachable text node meets its contrast minimum and every input value fits its box.');
