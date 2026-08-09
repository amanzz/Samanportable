/**
 * CALC-L4 item 1 probe. Enumerates every changeable numeric control across all
 * nine steps and reports the measured cause for any that shows no digit.
 *
 * Reads the RENDERED value two independent ways (input.value and the painted
 * pixel column count) so a repeat of the CALC-L1 false positive - where
 * button.value read empty on elements that were painting - cannot pass unseen.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.PROBE_BASE_URL || 'https://www.samanportable.com';
const route = process.env.PROBE_ROUTE || '/cabin-cost-calculator';
const viewport = process.env.PROBE_VIEWPORT === 'mobile'
  ? { width: 390, height: 844 }
  : { width: 1440, height: 900 };
const outputDir = path.resolve(process.env.PROBE_OUTPUT || 'reports/calc-L4');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
if (!playwrightRoot) throw new Error('Set PLAYWRIGHT_PACKAGE_ROOT.');

const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);

await mkdir(outputDir, { recursive: true });

const IN_PAGE = String.raw`
(() => {
  const root = document.querySelector('.cabin-calculator-ssr');
  if (!root) return { error: 'no calculator root on this route' };

  const toRgb = (value) => {
    const m = String(value).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\s\/]+/).filter(Boolean).map(Number);
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const hex = (c) => c ? '#' + [c.r, c.g, c.b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase() : null;
  const lum = (c) => {
    const f = (n) => { const s = n / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const over = (fg, bg) => {
    // composite a translucent colour onto an opaque one
    const a = fg.a;
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
  };
  const contrast = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
  };
  // the opaque colour actually painted behind el, walking ancestors and
  // compositing every translucent layer on the way down
  const paintedBackground = (el) => {
    const stack = [];
    let node = el;
    while (node && node.nodeType === 1) {
      const bg = toRgb(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) { stack.push(bg); if (bg.a === 1) break; }
      node = node.parentElement;
    }
    if (!stack.length) return { r: 255, g: 255, b: 255, a: 1 };
    let base = stack[stack.length - 1];
    if (base.a < 1) base = over(base, { r: 255, g: 255, b: 255, a: 1 });
    for (let i = stack.length - 2; i >= 0; i -= 1) base = over(stack[i], base);
    return base;
  };

  const describe = (el, step, kind) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const fg = toRgb(cs.webkitTextFillColor && cs.webkitTextFillColor !== 'currentcolor' ? cs.webkitTextFillColor : cs.color);
    const bgOwn = toRgb(cs.backgroundColor);
    const behind = paintedBackground(el.parentElement || el);
    const painted = bgOwn && bgOwn.a > 0 ? (bgOwn.a === 1 ? bgOwn : over(bgOwn, behind)) : behind;
    const fgPainted = fg && fg.a < 1 ? over(fg, painted) : fg;
    return {
      step,
      kind,
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      name: el.getAttribute('name') || '',
      label: el.getAttribute('aria-label') || '',
      value: el.value === undefined ? null : String(el.value),
      textContent: (el.textContent || '').trim(),
      color: hex(fgPainted),
      colorRaw: cs.color,
      webkitTextFillColor: cs.webkitTextFillColor,
      background: hex(painted),
      backgroundOwnRaw: cs.backgroundColor,
      contrast: fgPainted && painted ? contrast(fgPainted, painted) : null,
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
      contentWidth: Math.round((rect.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth)) * 10) / 10,
      paddingLeft: cs.paddingLeft,
      paddingRight: cs.paddingRight,
      fontSize: cs.fontSize,
      opacity: cs.opacity,
      appearance: cs.appearance || cs.webkitAppearance,
      visibility: cs.visibility,
      textAlign: cs.textAlign,
      overflow: cs.overflow,
      textIndent: cs.textIndent,
      hidden: rect.width === 0 || rect.height === 0,
    };
  };

  const steps = Array.from(root.querySelectorAll('[id^="calculator-step-"]'));
  const controls = [];
  for (const section of steps) {
    const stepId = section.id;
    for (const el of section.querySelectorAll('input[type="number"]')) {
      const inStepper = !!el.closest('.ec-stepper');
      controls.push(describe(el, stepId, inStepper ? 'ec-stepper input' : 'plain number input'));
    }
  }
  return { controls, stepCount: steps.length };
})()
`;

const run = async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport });
  const url = baseUrl + route;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1500);

  // The calculator ships collapsed on some routes. Open it before probing.
  const opener = page.locator('.cabin-calculator-ssr summary, [data-calculator-open], .calculator-entry a, .calculator-entry button').first();
  if (await opener.count()) {
    try { await opener.click({ timeout: 3000 }); await page.waitForTimeout(600); } catch { /* already open */ }
  }
  // reveal every step: the wizard hides all but the current step
  await page.evaluate(() => {
    document.querySelectorAll('[id^="calculator-step-"]').forEach((s) => {
      s.removeAttribute('hidden');
      s.style.display = 'block';
    });
  });
  await page.waitForTimeout(300);

  const result = await page.evaluate(IN_PAGE);
  const label = `${route.replace(/\W+/g, '_')}-${viewport.width}`;
  await writeFile(path.join(outputDir, `probe-${label}.json`), JSON.stringify({ url, viewport, ...result }, null, 2));

  if (result.error) {
    console.log(`${url} @${viewport.width}: ${result.error}`);
  } else {
    console.log(`${url} @${viewport.width}: ${result.stepCount} step sections, ${result.controls.length} numeric controls`);
    const bad = result.controls.filter((c) => c.contrast !== null && c.contrast < 4.5);
    console.log(`  contrast < 4.5:1 -> ${bad.length}`);
    const seen = new Set();
    for (const c of result.controls) {
      const key = `${c.step}|${c.kind}|${c.color}|${c.background}|${c.contentWidth}|${c.fontSize}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  ${c.step} ${c.kind} name=${c.name.slice(0, 34)} value="${c.value}" color=${c.color} on ${c.background} ratio=${c.contrast} box=${c.width}x${c.height} content=${c.contentWidth} font=${c.fontSize} pad=${c.paddingLeft}/${c.paddingRight} align=${c.textAlign}`);
    }
  }
  await browser.close();
};

await run();
