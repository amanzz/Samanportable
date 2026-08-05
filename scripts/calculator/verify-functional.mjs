/**
 * THE FUNCTIONAL HARNESS — spec §7. Highest-ranking gate in the suite.
 *
 * Sixteen gates passed on a calculator where nothing priced. Every one of them
 * read the SERVER's output: the rendered HTML, the CSS, the copy, the ladders.
 * Not one of them clicked anything. This gate does nothing else.
 *
 * On both routes it:
 *   1. selects every product in step 1 and asserts the header and the estimate
 *      both move
 *   2. clicks every chip in every group and asserts the selected state renders,
 *      the estimate line appears, and its figure is the declared rate times the
 *      declared basis
 *   3. drives every quantity stepper up and down and asserts the line tracks
 *   4. toggles every switch in step 8 and asserts the total changes
 *   5. walks Next and Back through all nine steps, asserting exactly one step
 *      is visible at each position
 *   6. submits step 9 with valid data and asserts 200
 *
 * No enquiry reaches a real recipient: the page's fetch is replaced before any
 * submit, and the replacement records the call instead of making it.
 *
 * Usage:
 *   CALCULATOR_BASE_URL=... PLAYWRIGHT_ROOT=... node scripts/calculator/verify-functional.mjs
 *   CALCULATOR_EXPECT_FAILURE=1  — assert the harness FAILS (fixture mode)
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { failIfDiffs } from './common.mjs';

const PW_ROOT = process.env.PLAYWRIGHT_ROOT;
if (!PW_ROOT) throw new Error('Set PLAYWRIGHT_ROOT.');
const { chromium } = await import(pathToFileURL(path.join(PW_ROOT, 'playwright/index.mjs')).href);
const BASE = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3120';

const ROUTES = [
  { name: 'standalone', url: '/cabin-cost-calculator', openDetails: false },
  { name: 'embedded', url: '/product/porta-cabins', openDetails: true },
];

const diffs = [];
const note = (route, text) => diffs.push(`${route}: ${text}`);
const browser = await chromium.launch();

/** Read the estimate as a buyer sees it: total, and every itemised line. */
const READ = () => {
  const root = document.querySelector('[data-cabin-calculator]');
  const money = (text) => Number(String(text).replace(/[^0-9-]/g, '')) || 0;
  return {
    headerTotal: money(root.querySelector('[data-summary-ex]')?.textContent),
    cardTotal: money(root.querySelector('[data-estimate-total]')?.textContent),
    product: root.querySelector('[data-summary-product]')?.textContent?.trim() || '',
    totalNote: root.querySelector('[data-estimate-total-note]')?.textContent?.trim() || '',
    lines: Array.from(root.querySelectorAll('[data-estimate-line]')).map((row) => ({
      label: row.querySelector('dt')?.textContent?.trim() || '',
      amount: money(row.querySelector('dd')?.textContent),
      quoted: /in quotation/i.test(row.querySelector('dd')?.textContent || ''),
    })),
  };
};

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  // No enquiry may reach a real recipient. Replaced before the page settles,
  // and kept for the life of the context.
  await context.addInitScript(() => {
    window.__sent = [];
    const real = window.fetch;
    window.fetch = (input, init) => {
      window.__sent.push({ url: String(input && input.url ? input.url : input), body: init && init.body ? String(init.body).slice(0, 200) : '' });
      return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
    };
    window.__realFetch = real;
  });

  await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle', timeout: 60000 });
  if (route.openDetails) {
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => {
      if (d.querySelector('[data-cabin-calculator]')) d.open = true;
    }));
  }
  await page.waitForTimeout(700);

  const enhanced = await page.evaluate(() =>
    document.querySelector('[data-cabin-calculator]')?.classList.contains('is-enhanced') === true);
  if (!enhanced) note(route.name, 'the enhancement script never marked the calculator enhanced');

  // ---- 1 · every product selects, and moves the header and the estimate ----
  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.product-tiles .calc-choice')).map((l, i) => ({
      i, name: l.querySelector('.choice-title')?.textContent?.trim() || l.textContent.trim().slice(0, 30),
    })));
  if (products.length !== 12) note(route.name, `step 1 offers ${products.length} products, expected 12`);

  const productReadings = [];
  for (const p of products) {
    await page.evaluate((i) => {
      document.querySelector('[data-step-link="1"]')?.click();
      document.querySelectorAll('.product-tiles .calc-choice')[i]?.querySelector('span')?.click();
    }, p.i);
    await page.waitForTimeout(160);
    const r = await page.evaluate(READ);
    productReadings.push({ ...p, ...r });
    const selected = await page.evaluate((i) =>
      document.querySelectorAll('.product-tiles .calc-choice')[i]?.querySelector('input')?.checked === true, p.i);
    if (!selected) note(route.name, `product "${p.name}" does not select`);
    if (r.product && p.name && !p.name.startsWith(r.product.slice(0, 6))) {
      // The header must name the product that is selected, not the one it loaded with.
      note(route.name, `product "${p.name}" selected but the header still reads "${r.product}"`);
    }
  }
  const distinctTotals = new Set(productReadings.map((r) => r.headerTotal)).size;
  if (distinctTotals < 2) {
    note(route.name, `all 12 products produce the same header total ${productReadings[0]?.headerTotal} — the estimate is not responding to the product`);
  }

  // Back to a priced product so the rest of the run has a base to move.
  await page.evaluate(() => {
    document.querySelector('[data-step-link="1"]')?.click();
    document.querySelector('.product-tiles .calc-choice')?.querySelector('span')?.click();
  });
  await page.waitForTimeout(200);

  // ---- 2 · every chip in every group ----
  const groups = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.calc-step fieldset').forEach((fs) => {
      if (fs.closest('.opening-card')) return;
      const chips = Array.from(fs.querySelectorAll(':scope > .calc-choice'));
      if (!chips.length) return;
      out.push({
        legend: fs.querySelector(':scope > legend')?.textContent?.trim() || '(no legend)',
        step: Number(fs.closest('[data-step]')?.dataset.step || 0),
        chips: chips.map((c, i) => {
          const input = c.querySelector('input');
          return {
            i,
            text: c.querySelector('strong')?.textContent?.trim() || c.textContent.trim().slice(0, 30),
            disabled: !!input?.disabled,
            rate: input?.dataset.rate === undefined ? null : Number(input.dataset.rate),
            basis: input?.dataset.rateBasis || null,
            lineLabel: input?.dataset.lineLabel || null,
          };
        }),
      });
    });
    return out;
  });

  let chipsClicked = 0;
  let pricedChipsChecked = 0;
  for (const group of groups) {
    for (const chip of group.chips) {
      if (chip.disabled) continue;
      await page.evaluate(({ step }) => document.querySelector(`[data-step-link="${step}"]`)?.click(), { step: group.step });
      await page.waitForTimeout(60);
      const clicked = await page.evaluate(({ legend, i }) => {
        const fs = Array.from(document.querySelectorAll('.calc-step fieldset'))
          .find((f) => (f.querySelector(':scope > legend')?.textContent?.trim() || '(no legend)') === legend);
        const chipEl = fs && Array.from(fs.querySelectorAll(':scope > .calc-choice'))[i];
        if (!chipEl) return null;
        chipEl.querySelector('span')?.click();
        const input = chipEl.querySelector('input');
        return { checked: !!input?.checked, ring: getComputedStyle(chipEl.querySelector('span')).borderColor };
      }, { legend: group.legend, i: chip.i });
      await page.waitForTimeout(120);
      chipsClicked += 1;
      if (!clicked) { note(route.name, `chip "${chip.text}" in "${group.legend}" could not be found to click`); continue; }
      if (!clicked.checked) { note(route.name, `chip "${chip.text}" in "${group.legend}" does not select`); continue; }

      if (!chip.rate) continue; // a chip that declares no rate adds no line, correctly
      pricedChipsChecked += 1;
      const reading = await page.evaluate(READ);
      const wanted = chip.lineLabel || chip.text;
      const line = reading.lines.find((l) => l.label === wanted);
      if (!line) {
        note(route.name, `chip "${chip.text}" (rate ${chip.rate} ${chip.basis}) selects but no estimate line "${wanted}" appears`);
        continue;
      }
      const expected = await page.evaluate(({ rate, basis }) => {
        const form = document.querySelector('[data-cabin-calculator] form') || document.querySelector('[data-cabin-calculator]');
        const nv = (n) => Number(form.querySelector(`[name="${n}"]`)?.value) || 0;
        const length = nv('length') || 20, width = nv('width') || 10, height = nv('height') || 8.5;
        const qty = Math.max(1, nv('quantity') || 1);
        const area = length * width;
        const wall = 2 * (length + width) * height;
        const base = Number(String(document.querySelector('[data-estimate-line] dd')?.textContent || '').replace(/[^0-9]/g, '')) || 0;
        const map = {
          'per sq ft': area,
          'per sq ft of wall': wall,
          'per sq ft of wall and roof': wall + area,
          'per sq ft of wall and ceiling': wall + area,
        };
        if (basis === 'percent of base') return Math.round(base * (rate / 100));
        if (basis === 'each') return rate * qty;
        return Math.round(rate * map[basis] * qty);
      }, { rate: chip.rate, basis: chip.basis });
      if (Math.abs(line.amount - expected) > 1) {
        note(route.name, `chip "${chip.text}": line reads ${line.amount}, rate ${chip.rate} ${chip.basis} gives ${expected}`);
      }
    }
  }
  if (chipsClicked === 0) note(route.name, 'no chip was clickable anywhere in the calculator');
  if (pricedChipsChecked === 0) note(route.name, 'not one chip in the calculator declares a rate');

  // ---- 3 · every quantity stepper, up and then down ----
  const steppers = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input[data-rate][data-line-quantified]')).map((el, i) => ({
      i, name: el.name, label: el.dataset.lineLabel, rate: Number(el.dataset.rate),
    })));
  if (!steppers.length) note(route.name, 'no quantity steppers found in steps 6 or 7');
  for (const s of steppers.slice(0, 60)) {
    const up = await page.evaluate(({ name }) => {
      const el = document.querySelector(`input[name="${CSS.escape(name)}"]`);
      el.value = String(Number(el.value || 0) + 2);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return Number(el.value);
    }, { name: s.name });
    await page.waitForTimeout(70);
    const r = await page.evaluate(READ);
    const line = r.lines.find((l) => l.label === `${up} × ${s.label}`);
    if (s.rate > 0 && !line) {
      note(route.name, `stepper "${s.label}" set to ${up} produced no line "${up} × ${s.label}"`);
    } else if (line && !line.quoted && Math.abs(line.amount - s.rate * up) > 1) {
      note(route.name, `stepper "${s.label}" at ${up}: line reads ${line.amount}, rate ${s.rate} gives ${s.rate * up}`);
    }
    await page.evaluate(({ name }) => {
      const el = document.querySelector(`input[name="${CSS.escape(name)}"]`);
      el.value = '0';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, { name: s.name });
    await page.waitForTimeout(60);
    const back = await page.evaluate(READ);
    if (back.lines.some((l) => l.label.endsWith(`× ${s.label}`))) {
      note(route.name, `stepper "${s.label}" back at 0 still shows a line`);
    }
  }

  // ---- 4 · every switch in step 8 ----
  await page.evaluate(() => document.querySelector('[data-step-link="8"]')?.click());
  await page.waitForTimeout(150);
  const switches = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#calculator-step-8 input[type="checkbox"]')).map((el) => el.name));
  if (!switches.length) note(route.name, 'step 8 offers no switches to toggle');
  for (const name of switches) {
    const before = await page.evaluate(READ);
    await page.evaluate((n) => {
      const el = document.querySelector(`#calculator-step-8 input[name="${CSS.escape(n)}"]`);
      el.checked = !el.checked;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, name);
    await page.waitForTimeout(150);
    const after = await page.evaluate(READ);
    const changed = after.headerTotal !== before.headerTotal
      || after.totalNote !== before.totalNote
      || after.lines.length !== before.lines.length
      || after.lines.some((l, i) => l.label !== before.lines[i]?.label);
    if (!changed) note(route.name, `switch "${name}" in step 8 changes nothing in the estimate`);
  }

  // ---- 5 · Next and Back through all nine, one step visible at each ----
  await page.evaluate(() => document.querySelector('[data-step-link="1"]')?.click());
  await page.waitForTimeout(150);
  const visibleCount = () => page.evaluate(() => {
    const root = document.querySelector('[data-cabin-calculator]');
    const shown = Array.from(root.querySelectorAll('.calc-step'))
      .filter((el) => el.getBoundingClientRect().height > 0);
    return { count: shown.length, at: Number(shown[0]?.dataset.step || 0) };
  });
  for (let step = 1; step <= 9; step += 1) {
    const v = await visibleCount();
    if (v.count !== 1) note(route.name, `walking forward at step ${step}: ${v.count} steps visible, expected 1`);
    if (v.at !== step) note(route.name, `walking forward: expected step ${step}, showing step ${v.at}`);
    if (step < 9) {
      await page.evaluate(() => document.querySelector('[data-action="next"], [data-step-next]')?.click());
      await page.waitForTimeout(140);
    }
  }
  for (let step = 9; step >= 1; step -= 1) {
    const v = await visibleCount();
    if (v.count !== 1) note(route.name, `walking back at step ${step}: ${v.count} steps visible, expected 1`);
    if (v.at !== step) note(route.name, `walking back: expected step ${step}, showing step ${v.at}`);
    if (step > 1) {
      await page.evaluate(() => document.querySelector('[data-action="back"], [data-step-back]')?.click());
      await page.waitForTimeout(140);
    }
  }

  // ---- 6 · step 9 submits ----
  await page.evaluate(() => document.querySelector('[data-step-link="9"]')?.click());
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const set = (name, v) => {
      const el = document.querySelector(`[name="${name}"]`);
      if (!el) return;
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('firstName', 'Gate');
    set('lastName', 'Harness');
    set('phone', '9876543210');
    set('email', 'gate@example.invalid');
  });
  // Why a submit did not fire matters more than that it did not: a form the
  // browser refuses to submit reports nothing at all unless it is asked.
  const validity = await page.evaluate(() => {
    const form = document.querySelector('[data-cabin-calculator] form');
    const bad = Array.from(form.elements).filter((el) => el.willValidate && !el.checkValidity());
    return {
      valid: form.checkValidity(),
      first: bad[0] ? `${bad[0].name || bad[0].id || bad[0].tagName}="${bad[0].value}" ${bad[0].validationMessage}` : '',
      count: bad.length,
    };
  });
  if (!validity.valid) {
    note(route.name, `step 9 cannot submit: ${validity.count} field(s) fail validation, first is ${validity.first}`);
  }
  await page.evaluate(() => document.querySelector('[data-cabin-calculator] form')
    ?.querySelector('button[type="submit"], [type="submit"]')?.click());
  await page.waitForTimeout(900);
  const sent = await page.evaluate(() => window.__sent || []);
  if (!sent.length) note(route.name, 'step 9 submit sent nothing at all');
  else if (!/gate@example\.invalid/.test(sent.map((s) => s.body).join(' '))) {
    note(route.name, 'step 9 submit fired but carried none of the entered contact details');
  }

  if (pageErrors.length) note(route.name, `script threw: ${pageErrors[0]}`);

  console.log(`${route.name.padEnd(11)} products ${products.length}  groups ${groups.length}  chips clicked ${chipsClicked}  priced ${pricedChipsChecked}  steppers ${steppers.length}  switches ${switches.length}  submits ${sent.length}`);

  await page.close();
  await context.close();
}

await browser.close();

console.log('');
if (process.env.CALCULATOR_EXPECT_FAILURE === '1') {
  // Fixture mode: the harness is pointed at a build that is known broken.
  if (!diffs.length) {
    console.error('FIXTURE: the harness found nothing on a build that is known broken.');
    process.exitCode = 1;
  } else {
    console.log(`FIXTURE: PASS — the harness caught ${diffs.length} failure(s) on the broken build.`);
    diffs.slice(0, 8).forEach((d) => console.log(`  - ${d}`));
  }
} else {
  failIfDiffs('functional', diffs);
}
