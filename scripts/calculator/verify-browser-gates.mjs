/**
 * Browser gates — screenshots, axe, interaction CLS, tap targets, and the
 * computed-style colour check.
 *
 * Lighthouse is deliberately NOT run. Its only baseline is the CWV lockfile,
 * which is void under L24 (production against localhost, unwarmed against
 * warmed, different viewport, DPR, Chrome, machine identity unrecorded). A
 * score against a void baseline would put a meaningless number in front of
 * SAMAN.
 *
 * The token-resolution colour gate in verify-colour-modes.mjs is kept and this
 * runs ON TOP of it. If the two disagree, the disagreement IS the finding and
 * is reported rather than resolved by preference.
 *
 * Evidence is written OUTSIDE the repository. Nothing here is committed.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=http://127.0.0.1:3119 \
 *   CALCULATOR_EVIDENCE_DIR=<abs path> \
 *   node scripts/calculator/verify-browser-gates.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Playwright lives OUTSIDE the project tree.
 *
 * Installing it into the project with `npm install --no-save` wiped
 * node_modules/.bin and gutted node_modules/next, so `next build` stopped
 * working and the tree had to be rebuilt from the lockfile. Keeping the test
 * browser in its own directory means running these gates can never damage the
 * application's dependencies again.
 *
 * Set PLAYWRIGHT_ROOT to that directory's node_modules.
 */
const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT to the node_modules directory holding playwright.');
const load = (spec) => import(pathToFileURL(path.join(PW_ROOT, spec)).href);
const { chromium } = await load('playwright/index.mjs');
const { AxeBuilder } = await load('@axe-core/playwright/dist/index.js');

const BASE = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3119';
const OUT = process.env.CALCULATOR_EVIDENCE_DIR
  || path.join(os.tmpdir(), 'saman-calculator-evidence');
const WARMUP_REQUESTS = 3;
const CLS_RUNS = 3;

const ROUTES = [
  { key: 'standalone', url: '/cabin-cost-calculator', steps: 8 },
  { key: 'porta-cabins', url: '/product/porta-cabins', steps: 7, embedded: true },
];
const VIEWPORTS = [
  { key: '1440', width: 1440, height: 900, dpr: 1 },
  { key: 'mobile-390', width: 390, height: 844, dpr: 2 },
];
const MODES = ['light', 'green'];

fs.mkdirSync(OUT, { recursive: true });
const diffs = [];
const report = { conditions: {}, screenshots: [], axe: {}, cls: {}, tapTargets: {}, colour: {} };

const browser = await chromium.launch();
const version = browser.version();

// --- capture conditions (L24) ----------------------------------------------
report.conditions = {
  machine: `${os.hostname()} · ${os.platform()} ${os.release()} · ${os.arch()} · ${os.cpus().length} cores`,
  chromium: version,
  playwright: JSON.parse(fs.readFileSync(path.join(PW_ROOT, 'playwright', 'package.json'), 'utf8')).version,
  baseUrl: BASE,
  warmupRequestsBeforeMeasurement: WARMUP_REQUESTS,
  clsRuns: CLS_RUNS,
  clsAggregation: 'median of 3 runs',
  viewports: VIEWPORTS.map((v) => `${v.width}x${v.height} @ DPR ${v.dpr}`),
  capturedAt: new Date().toISOString(),
};

async function openCalculator(page, route) {
  // Product pages render the calculator closed in a <details>. Open it.
  if (route.embedded) {
    await page.evaluate(() => {
      document.querySelectorAll('details').forEach((d) => {
        if (d.querySelector('[data-cabin-calculator]')) d.open = true;
      });
    });
  }
}

async function setMode(page, mode) {
  await page.evaluate((target) => {
    const root = document.querySelector('[data-cabin-calculator]');
    if (root) root.dataset.theme = target;
  }, mode);
}

async function warm(context, url) {
  for (let i = 0; i < WARMUP_REQUESTS; i += 1) {
    const p = await context.newPage();
    await p.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
    await p.close();
  }
}

// ---------------------------------------------------------------------------
// 1 · Screenshots — every step, both modes, both viewports.
// ---------------------------------------------------------------------------
for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.dpr,
  });
  for (const route of ROUTES) {
    await warm(context, route.url);
    for (const mode of MODES) {
      const page = await context.newPage();
      await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle' });

      // Closed state, product pages only, before opening.
      if (route.embedded) {
        const shot = path.join(OUT, `${route.key}-${viewport.key}-${mode}-closed.png`);
        await setMode(page, mode).catch(() => {});
        await page.screenshot({ path: shot, fullPage: false });
        report.screenshots.push(path.relative(OUT, shot));
      }

      await openCalculator(page, route);
      await setMode(page, mode);
      const openShot = path.join(OUT, `${route.key}-${viewport.key}-${mode}-open.png`);
      await page.screenshot({ path: openShot, fullPage: true });
      report.screenshots.push(path.relative(OUT, openShot));

      // Every step.
      const stepLinks = await page.$$('[data-step-link]');
      for (let i = 0; i < stepLinks.length; i += 1) {
        await stepLinks[i].click();
        await page.waitForTimeout(120);
        const shot = path.join(OUT, `${route.key}-${viewport.key}-${mode}-step-${i + 1}.png`);
        await page.screenshot({ path: shot, fullPage: false });
        report.screenshots.push(path.relative(OUT, shot));

        // No internal scrollbar on the step panel.
        const overflow = await page.evaluate(() => {
          const card = document.querySelector('.step-card');
          if (!card) return null;
          return { scrollH: card.scrollHeight, clientH: card.clientHeight };
        });
        if (overflow && overflow.scrollH > overflow.clientH + 1) {
          diffs.push(`${route.key} ${viewport.key} ${mode} step ${i + 1}: step panel scrolls internally (${overflow.scrollH} > ${overflow.clientH})`);
        }
      }
      await page.close();
    }
  }
  await context.close();
}

// ---------------------------------------------------------------------------
// 2 · Computed-style background equality, in a real browser, both modes.
// ---------------------------------------------------------------------------
for (const route of ROUTES) {
  for (const mode of MODES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle' });
    await openCalculator(page, route);
    await setMode(page, mode);
    await page.waitForTimeout(150);

    const result = await page.evaluate(() => {
      const SELECTORS = [
        '.calculator-header', '.calc-choice > span', '.step-nav a',
        '.estimate-card', '.estimate-card .total', '.construction-disclosure',
        '.step-progress', 'button.primary', 'button.ghost', '[type="submit"]',
      ];
      const transparent = (c) => !c || c === 'transparent' || /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(c);
      const out = [];
      for (const selector of SELECTORS) {
        const nodes = [...document.querySelectorAll(selector)];
        // One representative per selector is enough: they share a rule.
        const el = nodes.find((n) => n.offsetParent !== null) || nodes[0];
        if (!el) continue;
        const bg = getComputedStyle(el).backgroundColor;
        let parent = el.parentElement;
        let ancestorBg = null;
        let ancestorTag = null;
        while (parent) {
          const pbg = getComputedStyle(parent).backgroundColor;
          if (!transparent(pbg)) { ancestorBg = pbg; ancestorTag = parent.className || parent.tagName; break; }
          parent = parent.parentElement;
        }
        out.push({
          selector, background: bg, ancestorBackground: ancestorBg,
          ancestor: String(ancestorTag).slice(0, 40),
          differs: transparent(bg) ? null : bg !== ancestorBg,
          colour: getComputedStyle(el).color,
        });
      }
      return out;
    });

    report.colour[`${route.key}/${mode}`] = result;
    for (const row of result) {
      if (row.differs === false) {
        diffs.push(`${route.key} ${mode}: ${row.selector} background ${row.background} equals ancestor ${row.ancestor} ${row.ancestorBackground}`);
      }
    }
    await page.close();
    await context.close();
  }
}

// ---------------------------------------------------------------------------
// 3 · axe-core, zero violations.
// ---------------------------------------------------------------------------
for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle' });
  await openCalculator(page, route);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  /**
   * Split violations by whether they are INSIDE the calculator.
   *
   * The product page has 21 pre-existing colour-contrast failures of its own
   * (#16a34a link green on white, 3.9:1) in body copy that has nothing to do
   * with this event. Failing the calculator gate on them would either block a
   * clean calculator or, worse, invite someone to "fix" frozen page copy to
   * make a calculator gate pass. They are counted, reported and handed on as a
   * separate finding — not dropped, and not silently absorbed.
   */
  const inside = [];
  const outside = [];
  for (const v of results.violations) {
    for (const n of v.nodes) {
      const within = await page.evaluate((sel) => {
        try { const el = document.querySelector(sel); return Boolean(el && el.closest('[data-cabin-calculator]')); }
        catch { return false; }
      }, n.target[0]);
      (within ? inside : outside).push({ id: v.id, impact: v.impact, help: v.help, target: n.target[0] });
    }
  }
  report.axe[route.key] = {
    insideCalculator: inside.length,
    outsideCalculator: outside.length,
    detail: results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })),
    outsideDetail: outside.slice(0, 25),
  };
  for (const v of inside) diffs.push(`${route.key} axe INSIDE calculator: ${v.id} (${v.impact}) at ${v.target}`);
  await page.close();
  await context.close();
}

// ---------------------------------------------------------------------------
// 4 · CLS measured ON INTERACTION, not on load — the step machinery is what
//     moves things. Median of 3 runs.
// ---------------------------------------------------------------------------
for (const route of ROUTES) {
  const samples = [];
  for (let run = 0; run < CLS_RUNS; run += 1) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle' });
    await openCalculator(page, route);
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: false });
    });
    const links = await page.$$('[data-step-link]');
    for (const link of links) { await link.click(); await page.waitForTimeout(160); }
    samples.push(await page.evaluate(() => window.__cls || 0));
    await page.close();
    await context.close();
  }
  const median = [...samples].sort((a, b) => a - b)[Math.floor(samples.length / 2)];
  report.cls[route.key] = { samples, median };
  if (median > 0.1) diffs.push(`${route.key}: interaction CLS median ${median.toFixed(4)} exceeds 0.1`);
}

// ---------------------------------------------------------------------------
// 5 · Tap targets at mobile width.
// ---------------------------------------------------------------------------
for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle' });
  await openCalculator(page, route);
  const small = await page.evaluate(() => {
    const root = document.querySelector('[data-cabin-calculator]');
    if (!root) return [];
    const nodes = [...root.querySelectorAll('a[href],button,input,select,textarea')];
    return nodes
      .filter((n) => n.offsetParent !== null && n.type !== 'hidden')
      .map((n) => {
        // WCAG 2.5.8 measures the ACTIVATION area, not the painted box.
        //  - a radio wrapped in a label is activated anywhere in that label
        //  - a compact pill carries its 44px hit area on an ::after overlay,
        //    which is the pattern the parity spec asks for: "keep 44px hit
        //    area via padding/pseudo-element, visual height unchanged"
        // Measuring the painted box would fail a control that is genuinely
        // 44px to a finger, and would push us to inflate the visual design to
        // satisfy a measurement rather than a user.
        const wrapper = n.closest('label');
        const target = wrapper && (n.type === 'radio' || n.type === 'checkbox') ? wrapper : n;
        const r = target.getBoundingClientRect();
        const after = getComputedStyle(target, '::after');
        const overlayH = after.content !== 'none' ? parseFloat(after.height) || 0 : 0;
        const overlayW = after.content !== 'none' ? parseFloat(after.minWidth) || 0 : 0;
        const hitH = Math.max(r.height, overlayH);
        const hitW = Math.max(r.width, overlayW);
        return { tag: n.tagName.toLowerCase(), type: n.type || '', w: Math.round(hitW), h: Math.round(hitH),
                 measured: overlayH ? 'hit area via ::after' : (target === n ? 'control' : 'label'),
                 label: (n.textContent || n.getAttribute('aria-label') || n.name || '').trim().slice(0, 36) };
      })
      .filter((n) => n.h < 44);
  });
  report.tapTargets[route.key] = { under44: small.length, detail: small.slice(0, 20) };
  for (const n of small) diffs.push(`${route.key} tap target ${n.tag}[${n.type}] "${n.label}" is ${n.w}x${n.h} (${n.measured}), under 44px`);
  await page.close();
  await context.close();
}

await browser.close();

fs.writeFileSync(path.join(OUT, 'browser-gates.json'), JSON.stringify(report, null, 2));

// --- output ----------------------------------------------------------------
console.log('BROWSER GATES\n');
console.log('CAPTURE CONDITIONS (L24)');
for (const [k, v] of Object.entries(report.conditions)) {
  console.log(`  ${k.padEnd(32)} ${Array.isArray(v) ? v.join(', ') : v}`);
}
console.log(`\nSCREENSHOTS: ${report.screenshots.length} written to ${OUT}`);
console.log('\nAXE-CORE');
for (const [k, v] of Object.entries(report.axe)) {
  console.log(`  ${k.padEnd(18)} inside calculator ${v.insideCalculator}   outside (pre-existing page) ${v.outsideCalculator}`);
  for (const d of v.detail) console.log(`      ${d.id} (${d.impact}, ${d.nodes} nodes total)`);
}
console.log('\nINTERACTION CLS (median of 3)');
for (const [k, v] of Object.entries(report.cls)) {
  console.log(`  ${k.padEnd(18)} median ${v.median.toFixed(4)}   samples ${v.samples.map((s) => s.toFixed(4)).join(', ')}`);
}
console.log('\nTAP TARGETS AT 390px');
for (const [k, v] of Object.entries(report.tapTargets)) {
  console.log(`  ${k.padEnd(18)} under 44px: ${v.under44}`);
  for (const d of v.detail) console.log(`      ${d.tag}[${d.type}] "${d.label}" ${d.w}x${d.h}`);
}
console.log('\nCOMPUTED BACKGROUND vs NEAREST PAINTED ANCESTOR');
for (const [key, rows] of Object.entries(report.colour)) {
  console.log(`  ${key}`);
  for (const r of rows) {
    console.log(`    ${r.selector.padEnd(26)} ${String(r.background).padEnd(22)} on ${String(r.ancestorBackground).padEnd(22)} ${r.differs === null ? 'transparent' : r.differs ? 'differs' : 'EQUAL'}`);
  }
}

console.log('');
if (diffs.length) {
  console.log(`BROWSER GATES: FAIL — ${diffs.length}`);
  for (const d of diffs) console.log(`  - ${d}`);
  process.exit(1);
}
console.log('BROWSER GATES: PASS');
