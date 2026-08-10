/**
 * CALC-L4 gates G1, G2, G4, G6. Walks all nine steps, enumerates every control
 * that displays a number the user can change, and records for each:
 *   at rest -> after one + -> after one - , plus whether the estimate moved.
 *
 * Visibility is decided by TWO independent probes that must agree:
 *   (a) fit arithmetic  - measured text width of the value vs its content box
 *   (b) painted pixels  - glyph-coloured pixels inside the control
 * Probe (b) runs on every control the fit math calls clipped, plus a healthy
 * control from each step as a negative control. Disagreement fails the run:
 * "the probe was wrong, the control was fine" is how CALC-L1 produced a false
 * positive on this exact control family, so the two must corroborate.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.PROBE_BASE_URL || 'https://www.samanportable.com';
const route = process.env.PROBE_ROUTE || '/cabin-cost-calculator';
const width = Number(process.env.PROBE_WIDTH || 1440);
const outputDir = path.resolve(process.env.PROBE_OUTPUT || 'reports/calc-L4');
const tag = process.env.PROBE_TAG || 'live';
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
if (!playwrightRoot) throw new Error('Set PLAYWRIGHT_PACKAGE_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 2 });
page.setDefaultTimeout(8000);
console.log(`opening ${baseUrl + route} @${width} ...`);
await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(1500);

await page.evaluate(() => {
  document.querySelectorAll('[id^="calculator-step-"]').forEach((s) => { s.removeAttribute('hidden'); s.style.display = 'block'; });
  document.querySelectorAll('.cabin-calculator-ssr [hidden]').forEach((s) => s.removeAttribute('hidden'));
  document.querySelectorAll('.cabin-calculator-ssr details').forEach((d) => { d.open = true; });
});
await page.waitForTimeout(400);

// Everything below happens in ONE page evaluation: clicking a stepper button
// through the page is orders of magnitude faster than driving it from node,
// and it exercises the same handler the user's click reaches.
const enumeration = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const textWidth = (cs, text) => {
    const c = document.createElement('canvas').getContext('2d');
    c.font = [cs.fontStyle, cs.fontWeight, cs.fontSize, cs.fontFamily].join(' ');
    return Math.round(c.measureText(String(text)).width * 10) / 10;
  };
  const estimate = () => {
    const el = document.querySelector('[data-estimate-total], .estimate-card .total strong, .estimate-card .total');
    return el ? el.textContent.trim().replace(/\s+/g, ' ') : null;
  };
  const stepHeading = (section) => (section.querySelector('h2')?.textContent || '').trim().replace(/\s+/g, ' ');

  const rows = [];
  const sections = Array.from(document.querySelectorAll('[id^="calculator-step-"]'));
  for (const section of sections) {
    const heading = stepHeading(section);
    const controls = Array.from(section.querySelectorAll('input[type="number"]'));
    for (let i = 0; i < controls.length; i += 1) {
      const el = controls[i];
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const probeId = `${section.id}::${i}`;
      el.setAttribute('data-probe-id', probeId);
      const cs = getComputedStyle(el);
      const stepper = el.closest('.ec-stepper');
      const up = stepper?.querySelector('button[data-action="qty-up"]');
      const down = stepper?.querySelector('button[data-action="qty-down"]');

      const contentWidth = Math.round((rect.width
        - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
        - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth)) * 10) / 10;

      const rest = el.value;
      const estBefore = estimate();
      const neededRest = textWidth(cs, rest);

      let afterPlus = null; let afterMinus = null; let estAfterPlus = null; let estAfterMinus = null;
      if (up && down) {
        up.click(); await wait(200);
        afterPlus = el.value; estAfterPlus = estimate();
        down.click(); await wait(200);
        afterMinus = el.value; estAfterMinus = estimate();
      } else {
        const start = Number(rest) || 0;
        const step = Number(el.step) || 1;
        el.value = String(start + step);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        await wait(180);
        afterPlus = el.value; estAfterPlus = estimate();
        el.value = String(start);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        await wait(180);
        afterMinus = el.value; estAfterMinus = estimate();
      }

      rows.push({
        probeId, step: section.id, stepHeading: heading,
        name: el.getAttribute('name') || '', label: el.getAttribute('aria-label') || '',
        family: stepper ? 'ec-stepper' : (el.closest('.socket-nudge') ? 'socket-nudge' : 'plain number input'),
        hasButtons: !!(up && down),
        rest, afterPlus, afterMinus,
        estBefore, estAfterPlus, estAfterMinus,
        estimateMoved: estBefore !== estAfterPlus,
        boxWidth: Math.round(rect.width * 10) / 10, boxHeight: Math.round(rect.height * 10) / 10,
        contentWidth, neededWidth: neededRest,
        neededWidthTwoDigit: textWidth(cs, '88'),
        // No slack. A first run allowed +0.5px and called an 8px box holding an
        // 8.1px glyph a fit; the pixel probe said zero ink and the run failed on
        // its own disagreement check. Sub-pixel shortfall clips the glyph away
        // entirely, so the comparison is strict.
        fitsAtRest: contentWidth >= neededRest,
        fitsTwoDigit: contentWidth >= textWidth(cs, '88'),
        fontSize: cs.fontSize, padding: `${cs.paddingLeft}/${cs.paddingRight}`,
        color: cs.color, background: cs.backgroundColor, textAlign: cs.textAlign,
        opacity: cs.opacity, webkitTextFillColor: cs.webkitTextFillColor,
        appearance: cs.appearance || cs.webkitAppearance,
        upDisabled: up ? up.disabled : null, downDisabled: down ? down.disabled : null,
      });
    }
  }
  return { rows, sections: sections.map((s) => ({ id: s.id, heading: stepHeading(s) })) };
});

console.log(`enumerated ${enumeration.rows.length} numeric controls across ${enumeration.sections.length} step sections`);

// Painted-pixel corroboration: every control the fit math calls clipped, plus
// one healthy control per step as a negative control.
const suspects = enumeration.rows.filter((r) => !r.fitsAtRest);
const negatives = [];
const seenSteps = new Set();
for (const r of enumeration.rows) {
  if (r.fitsAtRest && !seenSteps.has(r.step)) { seenSteps.add(r.step); negatives.push(r); }
}
const toShoot = [...suspects, ...negatives];
console.log(`pixel-checking ${toShoot.length} controls (${suspects.length} suspected clipped, ${negatives.length} negative controls)`);

const inkOf = async (probeId) => {
  const el = page.locator(`[data-probe-id="${probeId}"]`).first();
  const buf = await el.screenshot({ type: 'png' }).catch(() => null);
  if (!buf) return null;
  return page.evaluate(async ({ b64 }) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const inset = Math.max(2, Math.round(Math.min(img.width, img.height) * 0.18));
    const w = Math.max(1, img.width - inset * 2);
    const h = Math.max(1, img.height - inset * 2);
    const d = ctx.getImageData(inset, inset, w, h).data;
    const counts = new Map();
    for (let i = 0; i < d.length; i += 4) {
      const k = `${d[i]},${d[i + 1]},${d[i + 2]}`;
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    const bg = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(',').map(Number);
    let ink = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 60) ink += 1;
    }
    return { ink, total: w * h, inkPct: Math.round((ink / (w * h)) * 1000) / 10 };
  }, { b64: buf.toString('base64') });
};

const byId = new Map(enumeration.rows.map((r) => [r.probeId, r]));
let done = 0;
for (const r of toShoot) {
  const ink = await inkOf(r.probeId);
  const row = byId.get(r.probeId);
  row.pixels = ink;
  row.paintsGlyph = ink ? ink.ink > 0 : null;
  row.probeAgreement = ink === null ? 'unknown'
    : (row.fitsAtRest === row.paintsGlyph ? 'agree' : 'DISAGREE');
  done += 1;
  if (done % 10 === 0 || done === toShoot.length) console.log(`  pixels ${done}/${toShoot.length}`);
}

const out = { url: baseUrl + route, viewport: width, tag, ...enumeration };
await writeFile(path.join(outputDir, `enumeration-${tag}-${width}.json`), JSON.stringify(out, null, 2));

const clipped = enumeration.rows.filter((r) => !r.fitsAtRest);
const invisible = enumeration.rows.filter((r) => r.paintsGlyph === false);
const disagree = enumeration.rows.filter((r) => r.probeAgreement === 'DISAGREE');

console.log(`\n===== ${route} @${width} (${tag}) =====`);
console.log(`step sections: ${enumeration.sections.length}`);
console.log(`numeric controls: ${enumeration.rows.length}`);
console.log(`value does not fit its box: ${clipped.length}`);
console.log(`paints zero glyph pixels:  ${invisible.length}`);
console.log(`probe disagreements:       ${disagree.length}`);
console.log(`cannot hold two digits:    ${enumeration.rows.filter((r) => !r.fitsTwoDigit).length}`);

const groups = new Map();
for (const r of enumeration.rows) {
  const key = `${r.step}|${r.family}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(r);
}
console.log(`\nstep | family | n | rest -> + -> - | content/needed | fits | est moved`);
for (const [key, list] of groups) {
  const s = list[0];
  const moved = list.filter((r) => r.estimateMoved).length;
  const bad = list.filter((r) => !r.fitsAtRest).length;
  console.log(`${key} | n=${list.length} | "${s.rest}" -> "${s.afterPlus}" -> "${s.afterMinus}" | ${s.contentWidth}px/${s.neededWidth}px @${s.fontSize} pad ${s.padding} | ${bad === 0 ? 'all fit' : `${bad} CLIPPED`} | ${moved}/${list.length} moved estimate`);
}
await browser.close();
if (disagree.length) { console.log(`\nFAIL: ${disagree.length} probe disagreements, do not trust this run`); process.exit(2); }
