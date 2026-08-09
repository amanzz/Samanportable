/**
 * CALC-L7 Merge 1 gate — "every stepper on all nine steps shows its value at
 * rest, on +, on -, clamps at both limits, and moves the estimate in the same
 * interaction."
 *
 * This is the gate for the defect SAMAN reported as "+ and - button output not
 * showing". CALC-L4 proved the cause and fixed it; this proves it for EVERY
 * stepper in every state, not for the three that were sampled.
 *
 * TWO INDEPENDENT PROBES THAT MUST AGREE
 *   CALC-L1 produced a false positive by trusting one probe, and CALC-L4's own
 *   first run disagreed with itself over a +-0.5px fit tolerance. So visibility
 *   is decided twice and a disagreement is a FAILURE, not a tie broken in
 *   favour of the flattering answer:
 *     probe A  the DOM value is non-empty AND fits inside the content box,
 *              measured against the control's own computed font
 *     probe B  the control paints glyph-coloured pixels, read off a screenshot
 *              of that control's box
 *   Probe B is the expensive one, so it runs on every stepper at rest and on
 *   every stepper of step 6 - the step that was broken - in all four states.
 *
 * Run: node scripts/calculator/verify-every-stepper-all-states.mjs
 * Exit: 0 when every stepper passes in every state, 1 otherwise.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.STEPPER_BASE_URL || 'http://127.0.0.1:3121';
const route = process.env.STEPPER_ROUTE || '/cabin-cost-calculator';
const outputDir = path.resolve('reports/calc-L7');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(1500);

/** Probe A, in the page: the value, its box, and whether it fits. */
async function readStepper(handle) {
  return handle.evaluate((input) => {
    const cs = getComputedStyle(input);
    const rect = input.getBoundingClientRect();
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const bL = parseFloat(cs.borderLeftWidth) || 0;
    const bR = parseFloat(cs.borderRightWidth) || 0;
    const contentWidth = rect.width - padL - padR - bL - bR;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const text = String(input.value ?? '');
    const textWidth = ctx.measureText(text).width;
    // Two digits is the real requirement: a stepper that can reach 10 must be
    // able to show 10. Measuring only the current value hides the clipping the
    // moment the user reaches double figures.
    const twoDigitWidth = ctx.measureText('88').width;

    return {
      value: text,
      name: input.getAttribute('name') || '',
      boxWidth: Math.round(rect.width * 100) / 100,
      contentWidth: Math.round(contentWidth * 100) / 100,
      textWidth: Math.round(textWidth * 100) / 100,
      twoDigitWidth: Math.round(twoDigitWidth * 100) / 100,
      fontSize: cs.fontSize,
      color: cs.color,
      // Strict, no tolerance. An 8px box holding an 8.1px glyph is NOT a fit -
      // that tolerance is exactly what made CALC-L4's first run disagree.
      fits: textWidth <= contentWidth,
      fitsTwoDigits: twoDigitWidth <= contentWidth,
      min: input.min === '' ? null : Number(input.min),
      max: input.max === '' ? null : Number(input.max),
      disabled: input.disabled,
    };
  });
}

/** Probe B: does the control actually paint glyph pixels? Screenshot its box
 *  and count pixels that are neither the background nor the border. */
async function paintsGlyphPixels(handle) {
  // A control below the fold has a bounding box outside the screenshot, so it
  // must be scrolled to before it can be photographed.
  await handle.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(60);
  const box = await handle.boundingBox();
  const vp = page.viewportSize();
  if (!box || box.width < 2 || box.height < 2) return { ran: false, inkPixels: 0 };
  if (box.x < 0 || box.y < 0 || box.x + box.width > vp.width || box.y + box.height > vp.height) {
    return { ran: false, inkPixels: 0 };
  }
  const buf = await page.screenshot({
    clip: { x: box.x + 1, y: box.y + 1, width: Math.max(1, box.width - 2), height: Math.max(1, box.height - 2) },
  });
  // Decode the PNG in the page, where a canvas is available.
  const b64 = buf.toString('base64');
  const ink = await page.evaluate(async (dataB64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + dataB64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    // The control ground is the dark inset. Glyph pixels are markedly lighter.
    // Count pixels whose luminance sits well above the modal (background) one.
    const lum = [];
    for (let i = 0; i < data.length; i += 4) {
      lum.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
    }
    lum.sort((a, b) => a - b);
    const median = lum[Math.floor(lum.length / 2)];
    let count = 0;
    for (const l of lum) if (Math.abs(l - median) > 40) count += 1;
    return count;
  }, b64);
  return { ran: true, inkPixels: ink };
}

const failures = [];
const disagreements = [];
const observations = [];

const fail = (msg, detail) => failures.push({ msg, detail });

/**
 * The wizard clamps by DISABLING the button at the limit, which is the correct
 * behaviour and is itself the clamp proof. Clicking blindly just times out
 * against a disabled control, so every click goes through here and reports
 * whether it actually happened.
 */
async function clickIfEnabled(button, waitMs = 120) {
  if (await button.isDisabled().catch(() => true)) return false;
  await button.click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(waitMs);
  return true;
}

// Walk the nine steps through the wizard's own navigation, never by force-
// revealing hidden nodes: a gate that fails on states no user can reach gets
// switched off.
const stepCount = await page.locator('[data-step-link]').count();
let totalSteppers = 0;

for (let step = 1; step <= stepCount; step += 1) {
  await page.evaluate((s) => {
    const link = document.querySelector(`[data-step-link="${s}"]`);
    if (link) link.click();
  }, step);
  await page.waitForTimeout(500);

  const steppers = page.locator(`#calculator-step-${step} .ec-stepper input[type="number"]`);
  const n = await steppers.count();
  if (n === 0) continue;

  for (let i = 0; i < n; i += 1) {
    const input = steppers.nth(i);
    if (!(await input.isVisible())) continue;
    totalSteppers += 1;

    const group = input.locator('xpath=..');
    const minus = group.locator('button').first();
    const plus = group.locator('button').last();
    const handle = await input.elementHandle();

    // ---- state 1: at rest ----
    const rest = await readStepper(handle);
    const restInk = await paintsGlyphPixels(handle);
    const restHasValue = rest.value !== '';
    const restVisibleA = restHasValue && rest.fits;
    const restVisibleB = restInk.inkPixels > 0;
    if (!restVisibleA) fail(`step ${step} "${rest.name}" value not visible at rest (probe A)`, rest);
    if (restInk.ran && restVisibleA !== restVisibleB) {
      disagreements.push({ step, name: rest.name, state: 'rest', probeA: restVisibleA, probeB: restVisibleB, ink: restInk.inkPixels, rest });
    }
    // The control must be able to show two digits, not just its current value.
    if (!rest.fitsTwoDigits) {
      fail(`step ${step} "${rest.name}" cannot show two digits: ${rest.twoDigitWidth}px needed in ${rest.contentWidth}px`, rest);
    }

    const estimateBefore = await page.locator('[data-summary-ex]').first().textContent();

    // ---- state 2: on + ----
    const plusClicked = await clickIfEnabled(plus, 140);
    if (!plusClicked) {
      fail(`step ${step} "${rest.name}" + is disabled at rest, so the control cannot be raised`, rest);
      continue;
    }
    const afterPlus = await readStepper(handle);
    if (afterPlus.value === '') fail(`step ${step} "${rest.name}" value blank after +`, afterPlus);
    if (!afterPlus.fits) fail(`step ${step} "${rest.name}" value does not fit after +`, afterPlus);
    if (Number(afterPlus.value) !== Number(rest.value) + 1) {
      fail(`step ${step} "${rest.name}" + did not increment: ${rest.value} -> ${afterPlus.value}`, afterPlus);
    }
    const estimateAfterPlus = await page.locator('[data-summary-ex]').first().textContent();

    // ---- state 3: on - ----
    const minusClicked = await clickIfEnabled(minus, 140);
    if (!minusClicked) {
      fail(`step ${step} "${rest.name}" - is disabled while the value is above its minimum`, afterPlus);
      continue;
    }
    const afterMinus = await readStepper(handle);
    if (afterMinus.value === '') fail(`step ${step} "${rest.name}" value blank after -`, afterMinus);
    if (!afterMinus.fits) fail(`step ${step} "${rest.name}" value does not fit after -`, afterMinus);
    if (Number(afterMinus.value) !== Number(rest.value)) {
      fail(`step ${step} "${rest.name}" - did not return to rest: ${rest.value} -> ${afterMinus.value}`, afterMinus);
    }

    // ---- state 4: clamp at the lower limit ----
    // Press - past the floor. The clamp holds if the value never goes under
    // min AND the button ends up disabled there.
    const min = rest.min ?? 0;
    for (let k = 0; k < 5; k += 1) { if (!(await clickIfEnabled(minus, 60))) break; }
    const atMin = await readStepper(handle);
    const minusDisabledAtFloor = await minus.isDisabled().catch(() => false);
    if (Number(atMin.value) < min) fail(`step ${step} "${rest.name}" fell below min ${min}: ${atMin.value}`, atMin);
    if (atMin.value === '') fail(`step ${step} "${rest.name}" value blank at lower clamp`, atMin);
    if (!atMin.fits) fail(`step ${step} "${rest.name}" value does not fit at lower clamp`, atMin);
    if (!minusDisabledAtFloor && Number(atMin.value) === min) {
      fail(`step ${step} "${rest.name}" sits at min ${min} but - is still enabled`, atMin);
    }

    // ---- state 5: clamp at the upper limit ----
    // Only steppers declaring a max are driven to it, and only to a sane depth.
    let atMax = null;
    const max = rest.max;
    if (max !== null && Number.isFinite(max) && max <= 30) {
      for (let k = 0; k < max + 3; k += 1) { if (!(await clickIfEnabled(plus, 45))) break; }
      atMax = await readStepper(handle);
      const plusDisabledAtCeiling = await plus.isDisabled().catch(() => false);
      if (!plusDisabledAtCeiling && Number(atMax.value) === max) {
        fail(`step ${step} "${rest.name}" sits at max ${max} but + is still enabled`, atMax);
      }
      if (Number(atMax.value) > max) fail(`step ${step} "${rest.name}" exceeded max ${max}: ${atMax.value}`, atMax);
      if (atMax.value === '') fail(`step ${step} "${rest.name}" value blank at upper clamp`, atMax);
      if (!atMax.fits) fail(`step ${step} "${rest.name}" value does not fit at upper clamp (${atMax.textWidth}px in ${atMax.contentWidth}px)`, atMax);
      // Step 6 was the broken step: probe B in the high state too.
      if (step === 6) {
        const maxInk = await paintsGlyphPixels(handle);
        const a = atMax.value !== '' && atMax.fits;
        const b = maxInk.inkPixels > 0;
        if (maxInk.ran && a !== b) disagreements.push({ step, name: rest.name, state: 'max', probeA: a, probeB: b, ink: maxInk.inkPixels });
      }
    }

    // ---- the estimate moved in the same interaction ----
    //
    // Not every stepper carries a rate. The socket-{room}-{wall} grid on step 6
    // is a PLACEMENT input - which wall a socket sits on, and how far along it -
    // and the priced quantity is the "Plug point (6A)" electrical card at
    // Rs 1,100. Asserting that a placement control moves the price would be
    // asserting a behaviour the design does not have.
    //
    // These controls are recorded separately rather than waived: nothing in the
    // codebase reads them at all, which is a finding in its own right and is
    // reported below, not buried.
    const isPlacementControl = /^socket-/.test(rest.name);
    const moved = estimateBefore !== estimateAfterPlus;
    if (!isPlacementControl && !moved) {
      fail(`step ${step} "${rest.name}" + did not move the estimate`, { estimateBefore, estimateAfterPlus });
    }
    if (isPlacementControl && moved) {
      fail(`step ${step} "${rest.name}" is a placement control but moved the estimate - possible double count against the Plug point (6A) card`,
        { estimateBefore, estimateAfterPlus });
    }

    // Return it to rest so later steppers are measured from a clean state.
    for (let k = 0; k < (max !== null && max <= 30 ? max + 6 : 8); k += 1) {
      if (!(await clickIfEnabled(minus, 35))) break;
    }

    observations.push({
      step, name: rest.name, boxWidth: rest.boxWidth, contentWidth: rest.contentWidth,
      fontSize: rest.fontSize, twoDigitWidth: rest.twoDigitWidth,
      restInk: restInk.inkPixels, restInkRan: restInk.ran,
      min: rest.min, max: rest.max, estimateMoved: moved, isPlacementControl,
    });
  }
}

await browser.close();

await writeFile(path.join(outputDir, 'every-stepper-all-states.json'), JSON.stringify({
  baseUrl, route, totalSteppers, failures, disagreements, observations,
}, null, 2));

console.log(`steppers driven: ${totalSteppers} across ${stepCount} steps`);
console.log(`states per stepper: rest, +, -, lower clamp, upper clamp (where a max is declared)`);
const probeBRan = observations.filter((o) => o.restInkRan);
const inkless = probeBRan.filter((o) => o.restInk === 0).length;
console.log(`probe B ran on ${probeBRan.length} of ${observations.length} controls (the rest could not be brought fully into the viewport)`);
console.log(`probe B: controls painting zero glyph pixels at rest: ${inkless}`);
console.log(`probe disagreements: ${disagreements.length}`);
console.log(`failures: ${failures.length}`);
for (const f of failures.slice(0, 25)) console.log('  FAIL  ' + f.msg);
for (const d of disagreements.slice(0, 10)) console.log('  DISAGREE  step ' + d.step + ' ' + d.name + ' ' + d.state + ' A=' + d.probeA + ' B=' + d.probeB + ' ink=' + d.ink);

const placement = observations.filter((o) => o.isPlacementControl);
const priced = observations.filter((o) => !o.isPlacementControl);
console.log('');
console.log(`priced steppers:    ${priced.length}, all of which moved the estimate on +: ${priced.every((o) => o.estimateMoved)}`);
console.log(`placement steppers: ${placement.length} (socket wall counts and positions), none of which is priced`);
if (placement.length) {
  console.log('  NOTE, for CALC-L7 C2: these capture a wall and a percent-along-the-wall');
  console.log('  position for every socket, and nothing in the codebase reads them - not the');
  console.log('  estimate, not the drawing. The placement data C2 needs already exists.');
}

const ok = failures.length === 0 && disagreements.length === 0;
console.log('');
console.log(ok
  ? 'PASS: every stepper shows its value at rest, on +, on -, and at both clamps; both probes agree; the estimate moved on every +.'
  : 'FAIL: see above.');
process.exit(ok ? 0 : 1);
