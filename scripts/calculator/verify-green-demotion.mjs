/**
 * #2d7a3f DEMOTION — computed styles, every interactive element, every state.
 *
 * The previous demotion gate has missed a live green selected state twice. Both
 * times for the same reason: it read the STYLESHEET. A stylesheet says
 * `background: var(--calc-soft)`, and whether that is green depends on which
 * theme block won a specificity contest three hundred lines earlier. Reading
 * the text of a rule cannot answer that. Only the element can.
 *
 * So this one asks the elements. For every interactive element it reads the
 * computed value of every colour-bearing property in five states — default,
 * hover, focus, checked, active — and fails on #2d7a3f anywhere outside a named
 * allowlist of success and confirmation selectors.
 *
 * Hover and focus cannot be computed without the pointer being there, so for
 * those two the gate collects every CSS rule whose selector would match the
 * element under that pseudo-class, and resolves each declaration's var() chain
 * against that element's own computed custom properties. Same answer, no mouse.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... node scripts/calculator/verify-green-demotion.mjs
 *   CALCULATOR_EXPECT_FAILURE=1  — fixture mode: assert this gate goes red
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { failIfDiffs } from './common.mjs';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);
const BASE = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3120';

/**
 * The only places #2d7a3f may appear. Success and confirmation, nothing else.
 * A selector earns a place here by being an explicit "this worked" element —
 * never by being a control that happens to look nice in green.
 */
const SUCCESS_ALLOWLIST = [
  '[data-calculator-notice]',
  '[data-restore-banner]',
  '.calculator-status',
];

const ROUTES = [
  { name: 'standalone', url: '/cabin-cost-calculator', openDetails: false },
  { name: 'embedded', url: '/product/porta-cabins', openDetails: true },
];

const diffs = [];
const browser = await chromium.launch();
const rows = [];

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle', timeout: 60000 });
  if (route.openDetails) {
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => {
      if (d.querySelector('[data-cabin-calculator]')) d.open = true;
    }));
  }
  await page.waitForTimeout(700);

  /*
   * Fixture hook. verify-green-demotion-fixture.mjs sets this to a rule that
   * paints a chip green, so the gate can be proven to go red on a build that
   * is deliberately wrong. It appends to the END OF THE BODY because the
   * calculator ships its stylesheet inline in the body, and a tag added to the
   * head loses every specificity tie to it.
   *
   * Nothing else sets it. The gate is doing what it always does: reading the
   * computed styles of the page in front of it.
   */
  if (process.env.CALCULATOR_INJECT_CSS) {
    await page.evaluate((text) => {
      const el = document.createElement('style');
      el.textContent = text;
      document.body.appendChild(el);
    }, process.env.CALCULATOR_INJECT_CSS);
    await page.waitForTimeout(150);
  }

  // Make every step visible at once. A state on a step nobody opened is still a
  // state that ships, and the last two misses were both on unopened steps.
  await page.evaluate(() => {
    document.querySelectorAll('[data-cabin-calculator] .calc-step').forEach((s) => {
      s.hidden = false;
      s.classList.add('is-active');
    });
  });
  await page.waitForTimeout(200);

  const found = await page.evaluate((allowlist) => {
    /*
     * Not one hex — any brand green.
     *
     * The first version of this check keyed on #2d7a3f exactly and reported
     * zero on a build that was painting 42 electrical cards #1a3c2e. The
     * arithmetic was right and the question was wrong: the rule is about brand
     * green on controls, and #1a3c2e is brand green. So the test is now the
     * hue. The navy palette is blue-dominant and passes; amber is
     * red-dominant and passes; anything where green leads by a clear margin
     * fails and is named with its own hex.
     */
    const hex = (r, g, b) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
    const greenLed = (r, g, b) => g > r + 8 && g > b + 8;
    const findGreen = (text) => {
      if (!text) return null;
      let hit = null;
      String(text).replace(/#([0-9a-f]{6})\b/gi, (m, h) => {
        const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
        if (!hit && greenLed(r, g, b)) hit = `#${h.toLowerCase()}`;
        return m;
      });
      String(text).replace(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/g, (m, r, g, b) => {
        const [rr, gg, bb] = [Number(r), Number(g), Number(b)];
        if (!hit && greenLed(rr, gg, bb)) hit = hex(rr, gg, bb);
        return m;
      });
      return hit;
    };
    const isGreen = (text) => findGreen(text) !== null;

    const PROPS = [
      'background-color', 'background-image', 'border-top-color', 'border-right-color',
      'border-bottom-color', 'border-left-color', 'box-shadow', 'outline-color',
      'color', 'fill', 'stroke', 'text-decoration-color', 'caret-color',
    ];

    const INTERACTIVE = [
      '.calc-choice', '.calc-choice > span', '.quantity-row', 'button', 'a[data-step-link]',
      'input', 'select', 'textarea', 'summary', '.drawing-tile', '.step-progress > span',
      '.estimate-card', '.step-card', '[data-view-tab]', '.dw-door', '.dw-window', '.dw-room-fill',
    ].join(',');

    const root = document.querySelector('[data-cabin-calculator]');
    const elements = Array.from(root.querySelectorAll(INTERACTIVE));
    const allowed = (el) => allowlist.some((sel) => el.closest(sel));

    const describe = (el) => {
      const own = el.closest('label') || el;
      const name = own.querySelector?.('strong')?.textContent?.trim()
        || el.getAttribute?.('name') || el.textContent?.trim().slice(0, 30) || el.tagName.toLowerCase();
      const step = el.closest('[data-step]')?.dataset.step || '-';
      return `step ${step} · ${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? `.${el.className.split(' ')[0]}` : ''} "${name}"`;
    };

    const hits = [];
    let inspected = 0;
    let pseudoMatches = 0;

    // ---- states the element can actually be put into ----
    const setChecked = (el) => {
      const input = el.matches('input') ? el : el.closest('label')?.querySelector('input');
      if (!input || input.disabled) return null;
      const was = input.checked;
      input.checked = true;
      return () => { input.checked = was; };
    };

    const readComputed = (el, state) => {
      // index carried so the CDP pass can find this exact node again
      const cs = getComputedStyle(el);
      PROPS.forEach((prop) => {
        const v = cs.getPropertyValue(prop);
        const found = findGreen(v);
        if (found) hits.push({ where: describe(el), state, prop, hex: found, value: v.trim().slice(0, 46), elementIndex: el.__idx });
      });
    };

    // ---- states that need the pointer, resolved from the rules instead ----
    // Collect every rule in the document once, then match per element.
    const rules = [];
    Array.from(document.styleSheets).forEach((sheet) => {
      let list;
      try { list = sheet.cssRules; } catch { return; }
      /*
       * Collect the rule FIRST, then descend.
       *
       * The obvious order - "if it has cssRules it is a group, otherwise it is
       * a rule" - collected nothing at all. Chrome's CSSStyleRule implements
       * CSSGroupingRule now, for CSS nesting, so every ordinary style rule
       * carries an empty cssRules list and an `if (rule.cssRules)` test sends
       * all of them down the group branch. The hover and focus scan was
       * reading zero rules and reporting a clean result. The rule and match
       * counts are printed for exactly this reason.
       */
      const walk = (collection) => Array.from(collection || []).forEach((rule) => {
        if (rule.selectorText && rule.style) rules.push(rule);
        if (rule.cssRules && rule.cssRules.length) walk(rule.cssRules);
      });
      walk(list);
    });
    const PSEUDO = [':hover', ':focus', ':focus-visible', ':active', ':checked'];
    const pseudoRules = rules.filter((r) => PSEUDO.some((p) => r.selectorText.includes(p)));

    const resolve = (el, value, depth = 0) => {
      if (depth > 6 || !value.includes('var(')) return value;
      const next = value.replace(/var\(\s*(--[\w-]+)\s*(?:,([^()]*))?\)/g, (m, name, fallback) => {
        const own = getComputedStyle(el).getPropertyValue(name).trim();
        return own || (fallback || '').trim();
      });
      return next === value ? value : resolve(el, next, depth + 1);
    };

    elements.forEach((el, elementIndex) => {
      if (allowed(el)) return;
      inspected += 1;
      el.__idx = elementIndex;
      readComputed(el, 'default');
      const undo = setChecked(el);
      if (undo) { readComputed(el, 'checked'); undo(); }

      pseudoRules.forEach((rule) => {
        // Strip the state pseudo-classes and ask whether this element is the
        // one the rule is about.
        const bare = rule.selectorText.split(',').map((s) => s.trim())
          .map((s) => PSEUDO.reduce((acc, p) => acc.split(p).join(''), s))
          .filter(Boolean);
        let matches = false;
        bare.forEach((sel) => {
          try { if (sel && el.matches(sel)) matches = true; } catch { /* :has() and friends */ }
        });
        if (!matches) return;
        pseudoMatches += 1;
        /*
         * Every property the rule actually declares, not a list of longhands.
         *
         * The first version asked for `border-top-color` and friends by name,
         * so a rule written as the shorthand `border-color: #2d7a3f` declared
         * nothing this gate had asked about and went straight through. A
         * fixture caught that. Iterating the rule's own declarations covers
         * `border`, `background`, `outline` and anything else written short.
         */
        Array.from(rule.style).forEach((prop) => {
          if (!/color|background|border|outline|shadow|fill|stroke/.test(prop)) return;
          const declared = rule.style.getPropertyValue(prop);
          if (!declared) return;
          const value = resolve(el, declared);
          const foundHex = findGreen(value);
          if (foundHex) {
            const state = PSEUDO.find((p) => rule.selectorText.includes(p)) || 'state';
            hits.push({ where: describe(el), state: state.replace(':', ''), prop, hex: foundHex, value: value.trim().slice(0, 46), rule: rule.selectorText.slice(0, 80), elementIndex });
          }
        });
      });
    });

    return {
      hits,
      inspected,
      elements: elements.length,
      // Reported, not assumed. If the pseudo-state scan ever matches nothing,
      // the gate is silently checking one state instead of five and would
      // still print a clean result.
      pseudoRules: pseudoRules.length,
      pseudoMatches,
      // The confirmation pass re-queries with this exact selector. It was
      // missing from this object, so that pass called querySelectorAll on
      // `undefined`, tagged nothing, matched nothing, and reported every
      // candidate as overridden — a clean result produced by a typo.
      interactiveSelector: INTERACTIVE,
    };
  }, SUCCESS_ALLOWLIST);

  /*
   * Confirm every hover/focus/active candidate against the real cascade.
   *
   * The rule scan reports what a matching rule DECLARES. It cannot know
   * whether that rule wins: the site-wide a:hover paints brand green and is
   * overridden by a stronger calculator rule, and the scan reported all nine
   * step links as green anyway. A gate that cannot tell "declared" from
   * "winning" cries wolf forever and gets ignored, which is worse than the
   * gate that missed.
   *
   * So the scan is now a cheap pre-filter, and the browser settles it: force
   * the pseudo-class through CDP, read the computed value, keep the hit only
   * if it is still green. Default and checked states need none of this - they
   * were computed properly to begin with.
   */
  const NEEDS_FORCING = new Set(['hover', 'focus', 'focus-visible', 'active']);
  const candidates = found.hits.filter((h) => NEEDS_FORCING.has(h.state));
  if (candidates.length) {
    await page.evaluate((probes) => {
      const root = document.querySelector('[data-cabin-calculator]');
      const els = Array.from(root.querySelectorAll(probes.selector));
      // A space-separated list, not a single value. Several candidates share
      // one element - the same span flagged for border-top, border-left and
      // so on - and setAttribute overwrote each previous probe id, so most
      // lookups came back null and were silently counted as overridden.
      probes.indexes.forEach((i, n) => {
        if (!els[i]) return;
        const prior = els[i].getAttribute('data-green-probe');
        els[i].setAttribute('data-green-probe', prior ? prior + ' ' + n : String(n));
      });
    }, { selector: found.interactiveSelector, indexes: candidates.map((c) => c.elementIndex) });

    // Never let a tagging failure read as a clean page. Every silent pass in
    // this gate's history looked exactly like this from the outside.
    const tagged = await page.evaluate(() => document.querySelectorAll('[data-green-probe]').length);
    if (!tagged) {
      diffs.push(`${route.name}: ${candidates.length} hover/focus candidates could not be tagged for confirmation — the gate cannot clear them`);
    }

    /*
     * Turn each state pseudo-class into a real class and read it normally.
     *
     * Two earlier attempts went through CDP's CSS.forcePseudoState. Page
     * getComputedStyle cannot see a forced pseudo-class at all, and reading
     * back through CSS.getComputedStyleForNode did not settle it either. Both
     * failures looked identical to "the page is clean", which is the one
     * answer a gate must never give by accident.
     *
     * A duplicated stylesheet has no such ambiguity: `.x:hover > span` becomes
     * `.x.__st-hover > span`, appended last so it wins ties, and the class is
     * put on the element and everything whose state can reach it. Then it is
     * just getComputedStyle, which cannot be wrong about a class.
     */
    const confirmed = await page.evaluate((cands) => {
      const STATES = ['hover', 'focus', 'focus-visible', 'active'];
      const out = [];
      const sheet = document.createElement('style');
      const lines = [];
      Array.from(document.styleSheets).forEach((s) => {
        let list;
        try { list = s.cssRules; } catch { return; }
        const walk = (coll) => Array.from(coll || []).forEach((rule) => {
          if (rule.selectorText && rule.style && STATES.some((st) => rule.selectorText.includes(`:${st}`))) {
            let sel = rule.selectorText;
            STATES.forEach((st) => { sel = sel.split(`:${st}`).join(`.__st-${st}`); });
            lines.push(`${sel}{${rule.style.cssText}}`);
          }
          if (rule.cssRules && rule.cssRules.length) walk(rule.cssRules);
        });
        walk(list);
      });
      sheet.textContent = lines.join('\n');
      document.body.appendChild(sheet);

      const root = document.querySelector('[data-cabin-calculator]');
      cands.forEach((cand, i) => {
        const el = document.querySelector(`[data-green-probe~="${i}"]`);
        if (!el) { out.push(null); return; }
        const marked = [];
        let node = el;
        let depth = 0;
        while (node && depth < 8) {
          marked.push(node);
          if (node.previousElementSibling) marked.push(node.previousElementSibling);
          if (node === root) break;
          node = node.parentElement;
          depth += 1;
        }
        marked.forEach((m) => m.classList.add(`__st-${cand.state}`));
        const value = getComputedStyle(el).getPropertyValue(cand.prop);
        marked.forEach((m) => m.classList.remove(`__st-${cand.state}`));
        out.push(value);
      });
      sheet.remove();
      return out;
    }, candidates.map((c) => ({ state: c.state, prop: c.prop })));
    // Fall through to the CDP path only if the class rewrite produced nothing.
    candidates.forEach((hit, i) => {
      const live = confirmed[i];
      if (live === null || live === undefined) return;
      const m = String(live).match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      const green = m
        ? Number(m[2]) > Number(m[1]) + 8 && Number(m[2]) > Number(m[3]) + 8
        : /#(0a3d2a|1a3c2e|2d7a3f)/i.test(String(live));
      hit.confirmed = green;
      hit.computed = String(live).trim().slice(0, 40);
      hit.resolvedBy = 'class-rewrite';
    });
  }
  await page.evaluate(() => document.querySelectorAll('[data-green-probe]')
    .forEach((el) => el.removeAttribute('data-green-probe')));

  const survivors = found.hits.filter((h) => !NEEDS_FORCING.has(h.state) || h.confirmed);
  const overridden = found.hits.length - survivors.length;
  rows.push({ route: route.name, ...found, overridden, confirmed: survivors.length });

  const seen = new Set();
  survivors.forEach((hit) => {
    const key = `${hit.where}|${hit.state}|${hit.prop}`;
    if (seen.has(key)) return;
    seen.add(key);
    diffs.push(`${route.name}: ${hit.where} — ${hit.prop} computes ${hit.computed || hit.hex} in the ${hit.state} state${hit.rule ? ` from "${hit.rule}"` : ''}`);
  });

  await page.close();
}

await browser.close();

console.log('#2d7a3f DEMOTION — computed styles, every state\n');
console.log('allowlist (success and confirmation only):');
SUCCESS_ALLOWLIST.forEach((s) => console.log(`  ${s}`));
console.log('');
const pad = (s, n) => String(s).padEnd(n);
console.log(pad('ROUTE', 12) + pad('ELEMENTS', 9) + pad('RULES', 7) + pad('MATCHES', 9) + pad('CANDIDATES', 12) + pad('OVERRIDDEN', 12) + 'CONFIRMED GREEN');
console.log('-'.repeat(70));
for (const r of rows) {
  console.log(pad(r.route, 12) + pad(r.elements, 9) + pad(r.pseudoRules, 7) + pad(r.pseudoMatches, 9) + pad(r.hits.length, 12) + pad(r.overridden, 12) + r.confirmed);
  if (!r.pseudoMatches) diffs.push(`: the hover/focus/active scan matched no rules at all - the gate is only checking one state`);
}

console.log('');
if (process.env.CALCULATOR_EXPECT_FAILURE === '1') {
  if (!diffs.length) {
    console.error('FIXTURE: the demotion gate found nothing on a build that is deliberately green.');
    process.exitCode = 1;
  } else {
    console.log(`FIXTURE: PASS — caught ${diffs.length} green state(s).`);
    diffs.slice(0, 6).forEach((d) => console.log(`  - ${d}`));
  }
} else {
  failIfDiffs('green-demotion', diffs);
}
