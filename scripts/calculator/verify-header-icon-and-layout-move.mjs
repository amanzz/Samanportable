/**
 * CALC-L7 Merge 2 gates for §2.2 (the layout move) and §2.3 (the header icon).
 *
 * Both are measured against the thing they must match rather than eyeballed:
 * the icon against the call icon sitting beside it, and the button section
 * against the scroll positions CALC-L4 recorded before the move.
 *
 * Run: node scripts/calculator/verify-header-icon-and-layout-move.mjs
 * Exit: 0 when every assertion holds, 1 otherwise.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.HDR_BASE_URL || 'http://127.0.0.1:3122';
const outputDir = path.resolve('reports/calc-L7');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const results = [];
const declared = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS  ' : 'FAIL  ') + name + '  -  ' + detail);
};

const browser = await chromium.launch({ channel: 'chrome' });

// ---------------------------------------------------------------------------
// 2.3 - the header icon, measured against the call icon
// ---------------------------------------------------------------------------
const VIEWPORTS = [
  { width: 1440, height: 900, label: '1440', desktop: true },
  { width: 1920, height: 1080, label: '1920', desktop: true },
  { width: 390, height: 844, label: '390', desktop: false },
];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1200);

  const measured = await page.evaluate(() => {
    const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const alphaOf = (s) => { const p = (s.match(/[\d.]+/g) || []); return p.length > 3 ? Number(p[3]) : 1; };
    const composite = (fg, a, bg) => fg.map((c, i) => a * c + (1 - a) * bg[i]);
    const ratio = (fg, bg) => { const a = lum(fg), b = lum(bg); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
    const vis = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const effBg = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        const p = parse(bg); const a = alphaOf(bg);
        if (p.length === 3 && a > 0.5) return p;
        n = n.parentElement;
      }
      return [255, 255, 255];
    };

    const header = document.querySelector('header');
    if (!header) return { found: false };

    const calcLinks = [...header.querySelectorAll('a[href="/portable-cabin-price-calculator"]')].filter(vis);
    // The call link this icon must match is its SIBLING in the same actions row.
    // The first tel: link in the header is the utility strip's TEXT link, which
    // renders 101x16 and is not the thing being matched - measuring against it
    // reported a mismatch that does not exist.
    const allCallLinks = [...header.querySelectorAll('a[href^="tel:"]')].filter(vis);
    const calcParent = calcLinks.length ? calcLinks[0].parentElement : null;
    const siblingCalls = allCallLinks.filter((el) => el.parentElement === calcParent);
    const callLinks = siblingCalls.length ? siblingCalls : allCallLinks;
    if (!calcLinks.length) return { found: true, calcVisible: 0, callVisible: callLinks.length };

    // The icon-only entry point that sits beside the call link.
    const calc = calcLinks[0];
    const call = callLinks[0] || null;
    const calcSvg = calc.querySelector('svg');
    const callSvg = call ? call.querySelector('svg') : null;
    const box = (el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100, x: Math.round(r.x), y: Math.round(r.y) }; };

    const cs = getComputedStyle(calcSvg);
    const linkCs = getComputedStyle(calc);
    const bg = effBg(calc);
    const fgRaw = parse(linkCs.color);
    const fg = composite(fgRaw, alphaOf(linkCs.color), bg);

    // Order within the actions row: call, then calculator, then Get Quote.
    const rowKids = [...(calc.parentElement ? calc.parentElement.children : [])].filter(vis);
    const order = rowKids.map((el) => {
      if (el.matches('a[href^="tel:"]')) return 'call';
      if (el.matches('a[href="/portable-cabin-price-calculator"]')) return 'calculator';
      if (el.tagName === 'BUTTON') return 'button:' + (el.textContent || '').trim().slice(0, 14);
      return el.tagName.toLowerCase();
    });

    return {
      found: true,
      calcVisible: calcLinks.length,
      callVisible: callLinks.length,
      calcBox: box(calc),
      callBox: call ? box(call) : null,
      calcSvgBox: box(calcSvg),
      callSvgBox: callSvg ? box(callSvg) : null,
      calcStrokeWidth: cs.strokeWidth,
      callStrokeWidth: callSvg ? getComputedStyle(callSvg).strokeWidth : null,
      calcStroke: cs.stroke,
      calcFill: cs.fill,
      ariaLabel: calc.getAttribute('aria-label'),
      svgAriaHidden: calcSvg.getAttribute('aria-hidden'),
      svgFocusable: calcSvg.getAttribute('focusable'),
      contrast: Math.round(ratio(fg, bg) * 100) / 100,
      order,
      // No new network request: the icon must be inline markup.
      inlineSvg: calcSvg.tagName.toLowerCase() === 'svg' && !calcSvg.querySelector('use') && !calcSvg.querySelector('image'),
    };
  });

  const tag = `@${vp.label}`;
  if (!measured.found) { record(`${tag} header present`, false, 'no <header>'); await page.close(); continue; }
  record(`${tag} calculator entry point present`, measured.calcVisible > 0, `${measured.calcVisible} visible, beside ${measured.callVisible} call link(s)`);
  if (!measured.calcVisible) { await page.close(); continue; }

  record(`${tag} icon is inline SVG, no sprite or external ref`, measured.inlineSvg, 'inline <svg>, no <use>, no <image>');
  record(`${tag} stroke and fill inherit`, measured.calcStroke.includes('rgb') && measured.calcFill === 'none',
    `stroke ${measured.calcStroke} (currentColor resolves to the header colour), fill ${measured.calcFill}`);
  record(`${tag} same rendered box as the call icon`,
    Boolean(measured.callBox) && measured.calcBox.w === measured.callBox.w && measured.calcBox.h === measured.callBox.h,
    `calculator ${measured.calcBox.w}x${measured.calcBox.h} vs call ${measured.callBox ? measured.callBox.w + 'x' + measured.callBox.h : 'n/a'}`);
  record(`${tag} same stroke width as the call icon`,
    measured.calcStrokeWidth === measured.callStrokeWidth,
    `calculator ${measured.calcStrokeWidth} vs call ${measured.callStrokeWidth}`);
  record(`${tag} aria-label on the link, svg hidden from AT`,
    Boolean(measured.ariaLabel) && measured.svgAriaHidden === 'true' && measured.svgFocusable === 'false',
    `aria-label "${measured.ariaLabel}" · aria-hidden ${measured.svgAriaHidden} · focusable ${measured.svgFocusable}`);
  record(`${tag} contrast against the header >= 4.5:1`, measured.contrast >= 4.5, `${measured.contrast}:1`);
  record(`${tag} order is call, then calculator`,
    measured.order.indexOf('call') !== -1 && measured.order.indexOf('call') < measured.order.indexOf('calculator'),
    measured.order.join(' -> '));

  // TOUCH TARGET - a DECLARED EXCEPTION, not a silent pass.
  //
  // CALC-L7 2.3 asks for two things that cannot both hold: "same rendered box as
  // the existing call icon" and "touch target 44x44 or more". The call icon is
  // 40x40. Matching it means 40x40; reaching 44 means the header's two icon
  // buttons are different sizes.
  //
  // Built to match the sibling, because that is the instruction that names a
  // measurement. The 44px shortfall is printed on EVERY run and carried in the
  // report until SAMAN rules - raising both icons to 44 changes the existing
  // call button, which is outside this ticket.
  const t = measured.calcBox;
  const matchesSibling = Boolean(measured.callBox) && t.w === measured.callBox.w && t.h === measured.callBox.h;
  declared.push(`${tag} touch target ${t.w}x${t.h}, under the 44px rule - identical to the call icon beside it (${measured.callBox ? measured.callBox.w + 'x' + measured.callBox.h : 'n/a'}), which is also under 44`);
  record(`${tag} touch target matches its sibling, 44px shortfall DECLARED`, matchesSibling,
    `${t.w}x${t.h}, same as the call icon; both under 44 - declared below, needs SAMAN's ruling`);

  await page.screenshot({ path: path.join(outputDir, `header-calculator-icon-${vp.label}.png`), clip: { x: 0, y: 0, width: vp.width, height: Math.min(140, vp.height) } });
  await page.close();
}

// The mobile menu panel, which is a separate surface from the action bar.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1200);
  await page.locator('button[aria-label="Open mobile menu"]').first().click().catch(() => {});
  await page.waitForTimeout(900);
  const inMenu = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a[href="/portable-cabin-price-calculator"]')];
    const visible = links.filter((el) => {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return cs.display !== 'none' && r.width > 0 && r.height > 0;
    });
    const inPanel = visible.find((el) => (el.textContent || '').trim().length > 0);
    return {
      count: visible.length,
      label: inPanel ? (inPanel.textContent || '').trim() : null,
      height: inPanel ? Math.round(inPanel.getBoundingClientRect().height) : 0,
    };
  });
  record('@390 calculator entry inside the mobile MENU panel', Boolean(inMenu.label),
    inMenu.label ? `"${inMenu.label}" · ${inMenu.height}px tall` : 'not found in the open menu');
  record('@390 menu entry touch target >= 44px', inMenu.height >= 44, `${inMenu.height}px`);
  await page.screenshot({ path: path.join(outputDir, 'header-calculator-icon-390-menu.png') });
  await page.close();
}

// ---------------------------------------------------------------------------
// 2.2 - the layout move, measured the way CALC-L4 measured it
// ---------------------------------------------------------------------------
for (const vp of [{ width: 1440, height: 900, label: '1440' }, { width: 390, height: 844, label: '390' }]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(baseUrl + '/cabin-cost-calculator', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1500);
  // Step 6, the step CALC-L4 measured.
  await page.evaluate(() => { const l = document.querySelector('[data-step-link="6"]'); if (l) l.click(); });
  await page.waitForTimeout(700);

  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  // On screen at how many of four scroll positions through the step?
  let onScreen = 0;
  const positions = [];
  for (let i = 0; i < 4; i += 1) {
    await page.evaluate((frac) => {
      const el = document.querySelector('#calculator-step-6') || document.querySelector('.cabin-calculator-ssr');
      if (!el) return;
      const r = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r.top + r.height * frac - window.innerHeight * 0.5);
    }, i / 3);
    await page.waitForTimeout(350);
    const visible = await page.evaluate(() => {
      const nav = document.querySelector('.cabin-calculator-ssr .step-actions');
      if (!nav) return false;
      const cs = getComputedStyle(nav);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = nav.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0 && r.height > 0;
    });
    positions.push(visible);
    if (visible) onScreen += 1;
  }
  record(`@${vp.label} Back/Next on screen through step 6`, onScreen === 4,
    `${onScreen} of 4 scroll positions [${positions.map((p) => (p ? 'y' : 'n')).join(' ')}]  (CALC-L4 before: 3 of 4 at 1440)`);

  const sideCol = await page.evaluate(() => {
    const side = document.querySelector('.cabin-calculator-ssr .calculator-side');
    const nav = document.querySelector('.cabin-calculator-ssr .step-actions');
    const card = document.querySelector('.cabin-calculator-side > .estimate-card') || document.querySelector('.cabin-calculator-ssr .calculator-side > .estimate-card');
    return {
      sideExists: Boolean(side),
      navInSide: Boolean(side && nav && side.contains(nav)),
      cardInSide: Boolean(side && card && side.contains(card)),
      navPosition: nav ? getComputedStyle(nav).position : null,
      sidePosition: side ? getComputedStyle(side).position : null,
      gridChildren: document.querySelectorAll('.cabin-calculator-ssr .calculator-grid > *').length,
    };
  });
  record(`@${vp.label} nav and estimate card share ONE column`,
    sideCol.sideExists && sideCol.navInSide,
    `.calculator-side exists=${sideCol.sideExists}, nav inside=${sideCol.navInSide}, grid children=${sideCol.gridChildren} (2 = no third auto-placed row)`);
  // Desktop: the COLUMN is sticky and the nav rides inside it under the estimate
  // card. Mobile: no second column, so the nav itself becomes a fixed footer bar.
  const positionOk = vp.label === '390'
    ? sideCol.navPosition === 'fixed'
    : sideCol.sidePosition === 'sticky';
  record(`@${vp.label} nav positioning`, positionOk,
    vp.label === '390'
      ? `nav position: ${sideCol.navPosition} (fixed footer bar)`
      : `column position: ${sideCol.sidePosition}, nav rides inside it (${sideCol.navPosition})`);

  results.push({ name: `_docHeight@${vp.label}`, pass: true, detail: String(docHeight) });
  await page.screenshot({ path: path.join(outputDir, `layout-move-step6-${vp.label}.png`) });
  await page.close();
}

await browser.close();
await writeFile(path.join(outputDir, 'header-icon-and-layout-move.json'), JSON.stringify({ baseUrl, results }, null, 2));

const failed = results.filter((r) => !r.pass && !r.name.startsWith('_'));
console.log('');
console.log('DECLARED EXCEPTIONS - printed every run, not silently accepted:');
for (const d of declared) console.log('  - ' + d);
console.log('  These need a ruling from SAMAN: raising the calculator icon alone breaks the');
console.log('  match with the call icon; raising both changes an existing control.');
console.log(failed.length === 0 ? 'PASS: header icon and layout move both verified.' : `FAIL: ${failed.length} assertion(s).`);
process.exit(failed.length === 0 ? 0 : 1);
