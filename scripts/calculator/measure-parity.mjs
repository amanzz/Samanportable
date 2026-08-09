/**
 * Geometry measurement, theirs against ours. Numbers only, no description.
 *
 * Loads both calculators at the same two viewports and extracts computed
 * geometry, so the comparison is measured rather than read off a screenshot.
 *
 * Structure is DISCOVERED, not hardcoded, because the two DOMs share nothing:
 * the two-column grid is found by computed `display:grid` with two tracks, the
 * panels are its children, and the rest is located relative to those. Where a
 * counterpart genuinely does not exist the value is reported as null rather
 * than guessed.
 *
 * Usage:
 *   PLAYWRIGHT_ROOT=<abs> node scripts/calculator/measure-parity.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);

const OUT = process.env.CALCULATOR_EVIDENCE_DIR
  || path.join(os.tmpdir(), 'saman-calculator-evidence');
fs.mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { key: 'theirs', url: 'https://portableofficecabin.com/#cabin-calculator', root: '#cabin-calculator' },
  { key: 'ours', url: 'http://127.0.0.1:3119/cabin-cost-calculator', root: '[data-cabin-calculator]' },
];
const VIEWPORTS = [
  { key: '1440', width: 1440, height: 900, dpr: 1 },
  { key: '390', width: 390, height: 844, dpr: 2 },
];

/** Runs in the page. Returns a flat measurement object. */
function extract(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return { error: 'root not found' };

  const px = (v) => (v == null ? null : Math.round(parseFloat(v) * 100) / 100);
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const pad = (el) => {
    const s = cs(el);
    return s ? `${px(s.paddingTop)}/${px(s.paddingRight)}/${px(s.paddingBottom)}/${px(s.paddingLeft)}` : null;
  };
  const font = (el) => {
    const s = cs(el);
    return s ? { size: px(s.fontSize), weight: s.fontWeight, colour: s.color } : null;
  };
  const visible = (el) => el && el.getBoundingClientRect().width > 1 && el.getBoundingClientRect().height > 1;

  const all = [...root.querySelectorAll('*')].filter(visible);

  // --- the two-column split: a grid with exactly two non-zero tracks --------
  let grid = null;
  for (const el of all) {
    const s = getComputedStyle(el);
    if (!s.display.includes('grid')) continue;
    const tracks = s.gridTemplateColumns.split(' ').filter((t) => t && t !== 'none');
    if (tracks.length !== 2) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 500) continue;               // ignore small inner grids
    if (!grid || r.width > grid.getBoundingClientRect().width) grid = el;
  }
  const gridCs = cs(grid);
  const cols = gridCs ? gridCs.gridTemplateColumns.split(' ').map((t) => px(t)) : null;
  const left = grid ? grid.children[0] : null;
  const right = grid ? grid.children[1] : null;

  // --- container -----------------------------------------------------------
  // The nearest ancestor of the grid that constrains width, else the root.
  let container = grid ? grid.parentElement : root;
  while (container && container !== root && container.getBoundingClientRect().width === (grid ? grid.getBoundingClientRect().width : 0)) {
    container = container.parentElement;
  }
  container = container || root;

  // --- summary header bar: the widest block above the grid ------------------
  let header = null;
  if (grid) {
    const gTop = grid.getBoundingClientRect().top;
    const candidates = all.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.bottom <= gTop + 2 && r.width > 400 && r.height > 40 && r.height < 260;
    });
    header = candidates.sort((a, b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom)[0] || null;
  }

  // --- step pills: the widest horizontal run of >=4 sibling links/buttons ---
  let pillRow = null;
  for (const el of all) {
    const kids = [...el.children].filter(visible);
    if (kids.length < 4) continue;
    const interactive = kids.filter((k) => /^(A|BUTTON)$/.test(k.tagName) || k.querySelector('a,button'));
    if (interactive.length < 4) continue;
    const tops = new Set(kids.map((k) => Math.round(k.getBoundingClientRect().top / 6)));
    if (tops.size > 2) continue;               // must be on one or two rows
    const r = el.getBoundingClientRect();
    if (r.height > 140) continue;
    if (!pillRow || r.width > pillRow.getBoundingClientRect().width) pillRow = el;
  }
  const pills = pillRow ? [...pillRow.children].filter(visible) : [];
  const activePill = pills.find((p) => {
    const s = getComputedStyle(p.matches('a,button') ? p : (p.querySelector('a,button') || p));
    return s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
  }) || pills[0] || null;
  const pillEl = activePill && !activePill.matches('a,button') ? (activePill.querySelector('a,button') || activePill) : activePill;

  // --- product card grid: a grid of >=3 similar cards inside the left panel -
  let cardGrid = null;
  const scope = left || root;
  for (const el of scope.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    if (!s.display.includes('grid') && !s.display.includes('flex')) continue;
    const kids = [...el.children].filter(visible);
    if (kids.length < 3) continue;
    const ws = kids.map((k) => Math.round(k.getBoundingClientRect().width));
    if (new Set(ws).size > 2) continue;        // cards are equal width
    const h = kids[0].getBoundingClientRect().height;
    if (h < 40) continue;
    if (!cardGrid || kids.length > [...cardGrid.children].filter(visible).length) cardGrid = el;
  }
  const cards = cardGrid ? [...cardGrid.children].filter(visible) : [];
  const card = cards[0] || null;
  const cardCs = cs(cardGrid);
  const cardBox = box(card);
  const cardTexts = card ? [...card.querySelectorAll('*')].filter((n) => n.children.length === 0 && n.textContent.trim()) : [];
  const icon = card ? card.querySelector('svg,img') : null;

  // --- estimate panel ------------------------------------------------------
  const panel = right ? (right.querySelector('[class*="sticky"],[class*="card"],aside,div') || right) : null;
  const panelRows = panel ? [...panel.querySelectorAll('*')].filter((n) => {
    const r = n.getBoundingClientRect();
    const s = getComputedStyle(n);
    return r.height > 12 && r.height < 60 && (s.display === 'flex' || n.tagName === 'DIV') && n.children.length >= 2;
  }) : [];
  const totalBlock = panel ? [...panel.querySelectorAll('*')].filter(visible)
    .filter((n) => getComputedStyle(n).backgroundColor !== 'rgba(0, 0, 0, 0)')
    .sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0] : null;
  const buttons = [...root.querySelectorAll('button,a[class*="btn"],[type="submit"]')].filter(visible);

  // --- typography and colour inventories -----------------------------------
  const typo = {};
  const colours = {};
  for (const el of all) {
    if (el.children.length) continue;
    const t = el.textContent.trim();
    if (!t) continue;
    const s = getComputedStyle(el);
    const key = `${px(s.fontSize)}px/${s.fontWeight}`;
    typo[key] = (typo[key] || 0) + 1;
    colours[s.color] = (colours[s.color] || 0) + 1;
  }
  const backgrounds = {};
  for (const el of all) {
    const s = getComputedStyle(el);
    if (s.backgroundColor === 'rgba(0, 0, 0, 0)') continue;
    backgrounds[s.backgroundColor] = (backgrounds[s.backgroundColor] || 0) + 1;
  }

  const rootBox = box(root);
  const containerCs = cs(container);
  const gap = gridCs ? px(gridCs.columnGap) : null;
  const cw = container ? container.getBoundingClientRect().width : null;

  return {
    section: { height: rootBox.h, width: rootBox.w },
    container: {
      width: cw ? Math.round(cw) : null,
      maxWidth: containerCs ? containerCs.maxWidth : null,
      paddingX: containerCs ? `${px(containerCs.paddingLeft)}/${px(containerCs.paddingRight)}` : null,
      marginX: containerCs ? `${containerCs.marginLeft}/${containerCs.marginRight}` : null,
    },
    split: {
      tracks: gridCs ? gridCs.gridTemplateColumns : null,
      leftWidth: box(left) ? box(left).w : null,
      rightWidth: box(right) ? box(right).w : null,
      gap,
      leftPct: box(left) && cw ? Math.round((box(left).w / cw) * 1000) / 10 : null,
      rightPct: box(right) && cw ? Math.round((box(right).w / cw) * 1000) / 10 : null,
      leftHeight: box(left) ? box(left).h : null,
      rightHeight: box(right) ? box(right).h : null,
    },
    header: header ? {
      height: box(header).h, width: box(header).w, padding: pad(header),
      background: cs(header).backgroundColor, radius: px(cs(header).borderRadius),
      childWidths: [...header.children].filter(visible).map((c) => box(c).w),
      fonts: [...header.querySelectorAll('*')].filter((n) => !n.children.length && n.textContent.trim())
        .slice(0, 8).map((n) => ({ text: n.textContent.trim().slice(0, 26), ...font(n) })),
    } : null,
    pills: pillEl ? {
      count: pills.length,
      height: box(pillEl).h, width: box(pillEl).w, padding: pad(pillEl),
      gap: pillRow ? px(cs(pillRow).columnGap || cs(pillRow).gap) : null,
      fontSize: font(pillEl).size, fontWeight: font(pillEl).weight,
      radius: px(cs(pillEl).borderRadius),
      activeBackground: cs(pillEl).backgroundColor, activeColour: cs(pillEl).color,
    } : null,
    productCards: card ? {
      count: cards.length,
      columns: cardCs && cardCs.gridTemplateColumns !== 'none'
        ? cardCs.gridTemplateColumns.split(' ').filter(Boolean).length
        : (() => { const tops = new Set(cards.map((c) => Math.round(c.getBoundingClientRect().top))); return Math.round(cards.length / tops.size); })(),
      width: cardBox.w, height: cardBox.h,
      ratio: Math.round((cardBox.w / cardBox.h) * 100) / 100,
      gap: cardCs ? px(cardCs.gap || cardCs.columnGap) : null,
      padding: pad(card), radius: px(cs(card).borderRadius),
      iconSize: icon ? `${box(icon).w}x${box(icon).h}` : null,
      textFonts: cardTexts.slice(0, 4).map((n) => ({ text: n.textContent.trim().slice(0, 24), ...font(n) })),
    } : null,
    estimate: panel ? {
      width: box(panel).w, height: box(panel).h, padding: pad(panel),
      background: cs(panel).backgroundColor, radius: px(cs(panel).borderRadius),
      rowCount: panelRows.length,
      rowHeights: panelRows.slice(0, 6).map((n) => Math.round(n.getBoundingClientRect().height)),
      rowFonts: panelRows.slice(0, 2).flatMap((n) => [...n.children].slice(0, 2).map((c) => ({ text: c.textContent.trim().slice(0, 18), ...font(c) }))),
      totalBlock: totalBlock ? { height: box(totalBlock).h, padding: pad(totalBlock), background: cs(totalBlock).backgroundColor } : null,
    } : null,
    buttons: buttons.slice(0, 8).map((b) => ({
      text: b.textContent.trim().slice(0, 22), height: box(b).h, width: box(b).w,
      padding: pad(b), radius: px(cs(b).borderRadius),
      background: cs(b).backgroundColor, colour: cs(b).color, fontSize: font(b).size,
    })),
    rhythm: {
      headerToGrid: header && grid ? Math.round(grid.getBoundingClientRect().top - header.getBoundingClientRect().bottom) : null,
      pillsToContent: pillRow && cardGrid ? Math.round(cardGrid.getBoundingClientRect().top - pillRow.getBoundingClientRect().bottom) : null,
    },
    typography: Object.entries(typo).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => `${k} x${n}`),
    textColours: Object.entries(colours).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => `${k} x${n}`),
    backgrounds: Object.entries(backgrounds).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, n]) => `${k} x${n}`),
  };
}

const results = {};
const browser = await chromium.launch();
for (const target of TARGETS) {
  results[target.key] = {};
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();
    try {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(2500);
      results[target.key][vp.key] = await page.evaluate(extract, target.root);
      await page.screenshot({ path: path.join(OUT, `parity-${target.key}-${vp.key}.png`), fullPage: false });
    } catch (e) {
      results[target.key][vp.key] = { error: e.message.slice(0, 200) };
    }
    await page.close();
    await context.close();
  }
}
await browser.close();

fs.writeFileSync(path.join(OUT, 'parity-measurements.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
