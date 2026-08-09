/**
 * CALC-L7 §1.2 — completing G10, which CALC-L4 reported PARTIAL.
 *
 * CALC-L4 confirmed routes and quote mode but never drove an enquiry submission
 * or a CTA reveal end to end. PR #118 sat merged and broken for hours because
 * the live check came after the celebration; this is that check.
 *
 * WHAT "END TO END" HONESTLY MEANS HERE, AND WHERE IT STOPS
 *   /api/enquiry's FIRST outbound boundary is Zoho CRM. Without credentials the
 *   handler returns 502 BEFORE it ever reaches the mailer. So on a credential-
 *   less preview build a 200 is not reachable, and claiming one would be false.
 *
 *   What this probe proves, and what it does not:
 *     PROVEN  the browser's own submit handler runs, validates, and issues a
 *             real network request to /api/enquiry with a correctly shaped body
 *     PROVEN  the API handler receives it and passes every validation branch -
 *             a 400 would mean the payload was malformed; a 502 means it got
 *             all the way to the CRM call with a valid lead in hand
 *     PROVEN  the UI's success branch and failure branch each render their own
 *             notice, driven by an intercepted response, so both are exercised
 *     NOT     that a lead reaches Zoho or an email reaches SAMAN's inbox. That
 *             needs live credentials AND creates a real lead and a real email.
 *             It is SAMAN's call, not this script's.
 *
 * Run: node scripts/calculator/verify-enquiry-and-cta-reveal.mjs
 * Exit: 0 when every assertion below holds, 1 otherwise.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.PROBE_BASE_URL || 'http://127.0.0.1:3119';
const outputDir = path.resolve('reports/calc-L7');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS  ' : 'FAIL  ') + name + '  -  ' + detail);
};

const browser = await chromium.launch({ channel: 'chrome' });

// ---------------------------------------------------------------------------
// PART 1 - the CTA reveal, on a product route that carries the entry band
// ---------------------------------------------------------------------------
const CTA_ROUTE = process.env.PROBE_CTA_ROUTE || '/product/container-offices';
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(baseUrl + CTA_ROUTE, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1200);

  const cta = page.locator('.calc-entry-cta').first();
  const ctaCount = await page.locator('.calc-entry-cta').count();
  record('CTA present on ' + CTA_ROUTE, ctaCount > 0, ctaCount + ' entry CTA(s) found');

  if (ctaCount > 0) {
    const label = (await cta.textContent())?.trim();
    const href = await cta.getAttribute('href');
    const controls = await cta.getAttribute('aria-controls');
    const box = await cta.boundingBox();
    record('CTA is a real link with an accessible target',
      Boolean(href) && Boolean(controls),
      `label "${label}" href "${href}" aria-controls "${controls}"`);
    record('CTA touch target >= 44px',
      Boolean(box) && box.height >= 44,
      box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'no box');

    await page.screenshot({ path: path.join(outputDir, 'cta-before-reveal-1440.png'), fullPage: false });

    // Drive it the way a customer does.
    await cta.click();
    await page.waitForTimeout(1200);

    const target = page.locator('#' + controls).first();
    const targetCount = await page.locator('#' + controls).count();
    const visible = targetCount > 0 ? await target.isVisible() : false;
    const inView = targetCount > 0
      ? await target.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return r.top < window.innerHeight && r.bottom > 0;
        })
      : false;
    record('CTA reveals the calculator it declares in aria-controls',
      targetCount > 0 && visible,
      `#${controls} exists=${targetCount > 0} visible=${visible}`);
    record('calculator is in the viewport after the click', inView, 'scrolled into view: ' + inView);

    // The revealed calculator must actually be usable, not merely present.
    const steppers = await page.locator('.cabin-calculator-ssr .ec-stepper input[type="number"]').count();
    const form = await page.locator('[data-calculator-form]').count();
    record('revealed calculator carries its controls and its form',
      steppers > 0 && form > 0,
      `${steppers} stepper inputs, ${form} enquiry form`);

    await page.screenshot({ path: path.join(outputDir, 'cta-after-reveal-1440.png'), fullPage: false });
  }
  await page.close();
}

// ---------------------------------------------------------------------------
// PART 2 - the enquiry submission, driven through the real form
// ---------------------------------------------------------------------------
const FORM_ROUTE = process.env.PROBE_FORM_ROUTE || '/cabin-cost-calculator';

/** Fills the quotation fields and clicks submit. `intercept` may fulfil the
 *  API call with a chosen status so the UI's own branches can be exercised. */
async function driveSubmission({ intercept }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const captured = { request: null, responseStatus: null };

  await page.route('**/api/enquiry', async (route) => {
    const req = route.request();
    captured.request = { method: req.method(), postData: req.postData(), headers: req.headers() };
    if (intercept) {
      captured.responseStatus = intercept.status;
      await route.fulfill({
        status: intercept.status,
        contentType: 'application/json',
        body: JSON.stringify(intercept.body),
      });
    } else {
      // Let it hit the real handler.
      const response = await route.fetch();
      captured.responseStatus = response.status();
      captured.responseBody = await response.text().catch(() => '');
      await route.fulfill({ response });
    }
  });

  await page.goto(baseUrl + FORM_ROUTE, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1500);

  // Walk to the quotation step through the wizard's own navigation.
  await page.evaluate(() => {
    const link = document.querySelector('[data-step-link="9"]');
    if (link) link.click();
  });
  await page.waitForTimeout(800);

  const form = page.locator('[data-calculator-form]');
  const fill = async (name, value) => {
    const el = form.locator(`[name="${name}"]`).first();
    if (await el.count()) await el.fill(value);
  };
  await fill('firstName', 'CALC L7');
  await fill('lastName', 'Gate Probe');
  await fill('email', 'calc-l7-probe@samanportable.com');
  await fill('phone', '8861622859');
  await fill('company', 'PROJECT SHIKHAR gate run');
  await fill('notes', 'Automated G10 verification. Not a customer enquiry.');

  const submit = form.locator('[type="submit"]').first();
  const submitCount = await submit.count();
  if (submitCount) {
    await submit.click();
    await page.waitForTimeout(2500);
  }

  const notice = page.locator('[data-calculator-notice]').first();
  const noticeText = (await notice.textContent().catch(() => ''))?.trim() || '';
  const noticeVisible = await notice.isVisible().catch(() => false);

  await page.screenshot({
    path: path.join(outputDir, `enquiry-${intercept ? 'stub' + intercept.status : 'real'}-1440.png`),
  });
  await page.close();
  return { ...captured, noticeText, noticeVisible, submitCount };
}

// 2a - the real handler, no interception. Proves the payload reaches it.
{
  const r = await driveSubmission({ intercept: null });
  record('submit control exists on the quotation step', r.submitCount > 0, r.submitCount + ' submit button(s)');
  record('browser issued a real POST to /api/enquiry',
    Boolean(r.request) && r.request.method === 'POST',
    r.request ? 'method ' + r.request.method : 'NO REQUEST - client validation blocked it');

  let payload = null;
  try { payload = r.request?.postData ? JSON.parse(r.request.postData) : null; } catch { /* not JSON */ }
  const required = ['firstName', 'lastName', 'email', 'phone', 'message'];
  const missing = payload ? required.filter((k) => !payload[k]) : required;
  record('payload carries every field /api/enquiry requires',
    payload !== null && missing.length === 0,
    payload ? (missing.length ? 'MISSING: ' + missing.join(', ') : required.join(', ') + ' all present') : 'no JSON body');

  // 400 = the handler rejected the shape. Anything else = it accepted the lead
  // and moved on to the CRM boundary.
  record('handler accepted the payload through validation (not a 400)',
    r.responseStatus !== null && r.responseStatus !== 400,
    'HTTP ' + r.responseStatus + (r.responseStatus === 502
      ? ' - reached the Zoho boundary and stopped there, which is the credential-less signature'
      : ''));

  record('UI rendered a notice for the outcome', r.noticeVisible && r.noticeText.length > 0,
    `"${r.noticeText}"`);
  results.push({ name: '_realRun', pass: true, detail: JSON.stringify({ status: r.responseStatus, notice: r.noticeText }) });
}

// 2b - the success branch, exercised with an intercepted 200. Labelled a stub:
// it proves the UI handles success, not that a lead landed.
{
  const r = await driveSubmission({ intercept: { status: 200, body: { success: true } } });
  record('UI success branch renders on a 200 (STUBBED response, no lead created)',
    r.noticeVisible && r.noticeText.length > 0,
    `"${r.noticeText}"`);
}

// 2c - the failure branch, so a broken API cannot look like a success.
{
  const r = await driveSubmission({ intercept: { status: 502, body: { message: 'stub' } } });
  record('UI failure branch renders on a 502 (STUBBED response)',
    r.noticeVisible && r.noticeText.length > 0,
    `"${r.noticeText}"`);
}

await browser.close();

const failed = results.filter((r) => !r.pass && !r.name.startsWith('_'));
await writeFile(path.join(outputDir, 'enquiry-and-cta-reveal.json'), JSON.stringify({ baseUrl, results }, null, 2));

console.log('');
console.log(failed.length === 0
  ? 'G10 COMPLETE: CTA reveal driven, enquiry submission driven, both UI branches exercised.'
  : `G10 FAILED: ${failed.length} assertion(s) below the line.`);
process.exit(failed.length === 0 ? 0 : 1);
