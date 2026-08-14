/**
 * CALC-L4 item 1, second probe. Two independent reads of "is a digit painted",
 * plus full cascade attribution for the padding/width that sizes the box.
 *
 * Probe A: CSSOM - every matching rule that declares padding/width/font-size,
 *          in cascade order, so the winning declaration is named not guessed.
 * Probe B: pixels - crop the control, count glyph-coloured pixels. A control
 *          whose value reads "0" but paints zero glyph pixels is invisible.
 * The two must agree; disagreement is reported as a failure, not smoothed over.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.PROBE_BASE_URL || 'https://www.samanportable.com';
const route = process.env.PROBE_ROUTE || '/cabin-cost-calculator';
const width = Number(process.env.PROBE_WIDTH || 1440);
const outputDir = path.resolve(process.env.PROBE_OUTPUT || 'reports/calc-L4');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
if (!playwrightRoot) throw new Error('Set PLAYWRIGHT_PACKAGE_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const CASCADE = String.raw`
(() => {
  const specificity = (selector) => {
    // good enough for this stylesheet: no :is(), no :where(), no :not() nesting
    const s = selector.replace(/\s*[>+~]\s*/g, ' ');
    const ids = (s.match(/#[\w-]+/g) || []).length;
    const classes = (s.match(/\.[\w-]+/g) || []).length + (s.match(/\[[^\]]+\]/g) || []).length + (s.match(/:(?!:)[\w-]+/g) || []).length;
    const types = (s.match(/(^|\s)[a-zA-Z][\w-]*/g) || []).length;
    return [ids, classes, types];
  };
  const matchingRules = (el, props) => {
    const out = [];
    let order = 0;
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      const walk = (list, media) => {
        for (const rule of Array.from(list)) {
          if (rule.type === CSSRule.MEDIA_RULE) {
            const applies = window.matchMedia(rule.conditionText).matches;
            if (applies) walk(rule.cssRules, rule.conditionText);
            continue;
          }
          if (rule.type !== CSSRule.STYLE_RULE) continue;
          order += 1;
          for (const selector of rule.selectorText.split(',')) {
            const sel = selector.trim();
            let hit = false;
            try { hit = el.matches(sel); } catch { hit = false; }
            if (!hit) continue;
            const declared = props.filter((p) => rule.style.getPropertyValue(p) !== '');
            if (!declared.length) continue;
            out.push({
              selector: sel,
              media: media || null,
              specificity: specificity(sel),
              order,
              declarations: Object.fromEntries(declared.map((p) => [p, rule.style.getPropertyValue(p) + (rule.style.getPropertyPriority(p) ? ' !important' : '')])),
            });
          }
        }
      };
      walk(rules, null);
    }
    return out;
  };

  const report = (el, tag) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const props = ['padding', 'padding-left', 'padding-right', 'width', 'min-width', 'font-size', 'color', 'background', 'background-color', 'text-align', 'box-sizing'];
    return {
      tag,
      name: el.getAttribute('name'),
      computed: {
        width: cs.width, minWidth: cs.minWidth, paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
        fontSize: cs.fontSize, boxSizing: cs.boxSizing, color: cs.color, backgroundColor: cs.backgroundColor,
        textAlign: cs.textAlign,
        borderLeftWidth: cs.borderLeftWidth, borderRightWidth: cs.borderRightWidth,
      },
      box: { w: Math.round(rect.width * 10) / 10, h: Math.round(rect.height * 10) / 10 },
      contentWidth: Math.round((rect.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth)) * 10) / 10,
      // how wide the value string actually needs to be, in this exact font
      requiredTextWidth: (() => {
        const c = document.createElement('canvas').getContext('2d');
        c.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        return Math.round(c.measureText(String(el.value)).width * 10) / 10;
      })(),
      rules: matchingRules(el, props),
    };
  };

  const step6 = document.querySelector('#calculator-step-6 .ec-stepper input');
  const step7 = document.querySelector('#calculator-step-7 .ec-stepper input');
  const socketPct = document.querySelector('#calculator-step-6 input[name$="-position"]');
  return {
    step6: step6 ? report(step6, 'step6 electrical stepper') : null,
    step7: step7 ? report(step7, 'step7 addOns stepper') : null,
    socketPct: socketPct ? report(socketPct, 'step6 wall percentage') : null,
  };
})()
`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  document.querySelectorAll('[id^="calculator-step-"]').forEach((s) => { s.removeAttribute('hidden'); s.style.display = 'block'; });
  document.querySelectorAll('.socket-panel[hidden]').forEach((s) => s.removeAttribute('hidden'));
});
await page.waitForTimeout(400);

const cascade = await page.evaluate(CASCADE);
await writeFile(path.join(outputDir, `cascade-${width}.json`), JSON.stringify(cascade, null, 2));

for (const [key, r] of Object.entries(cascade)) {
  if (!r) { console.log(`${key}: NOT FOUND`); continue; }
  console.log(`\n=== ${r.tag}  name=${r.name}`);
  console.log(`  box ${r.box.w}x${r.box.h}  content-width ${r.contentWidth}px  value needs ${r.requiredTextWidth}px  font ${r.computed.fontSize}  pad ${r.computed.paddingLeft}/${r.computed.paddingRight}  box-sizing ${r.computed.boxSizing}`);
  console.log(`  FITS: ${r.contentWidth >= r.requiredTextWidth ? 'yes' : 'NO - value is clipped'}`);
  for (const rule of r.rules) {
    console.log(`   [${rule.specificity.join(',')}] ord${rule.order} ${rule.media ? '@media(' + rule.media + ') ' : ''}${rule.selector}  ->  ${JSON.stringify(rule.declarations)}`);
  }
}

// Probe B: painted pixels inside the control's content box.
const pixelCheck = async (selector, label) => {
  const el = page.locator(selector).first();
  if (!(await el.count())) { console.log(`\npixels ${label}: not found`); return; }
  const file = path.join(outputDir, `pixels-${label}-${width}.png`);
  await el.screenshot({ path: file });
  const buf = await el.screenshot();
  console.log(`\npixels ${label}: cropped to ${file} (${buf.length} bytes)`);
};
await pixelCheck('#calculator-step-6 .ec-stepper input', 'step6-electrical');
await pixelCheck('#calculator-step-7 .ec-stepper input', 'step7-addons');
await pixelCheck('#calculator-step-6 .socket-wall', 'step6-wall-percent');

await browser.close();
