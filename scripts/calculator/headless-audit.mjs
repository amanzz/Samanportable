import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.CALCULATOR_AUDIT_BASE_URL || 'http://127.0.0.1:3119';
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const lighthouseRoot = process.env.LIGHTHOUSE_PACKAGE_ROOT;
const outputDir = path.resolve(process.env.CALCULATOR_AUDIT_OUTPUT || 'docs/price-calculator/evidence/headless-20260803');

if (!playwrightRoot) throw new Error('Set PLAYWRIGHT_PACKAGE_ROOT to the cached npx node_modules directory.');
if (!lighthouseRoot) throw new Error('Set LIGHTHOUSE_PACKAGE_ROOT to the cached npx node_modules directory.');

const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
const lighthouse = (await import(pathToFileURL(path.join(lighthouseRoot, 'lighthouse/core/index.js')).href)).default;
const { launch: launchChrome } = await import(pathToFileURL(path.join(lighthouseRoot, 'chrome-launcher/dist/chrome-launcher.js')).href);
const axePath = path.join(lighthouseRoot, 'axe-core/axe.min.js');
const lockfile = JSON.parse(await readFile('audit/baseline/cwv-lockfile.json', 'utf8'));

await mkdir(outputDir, { recursive: true });

const evidence = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  chromePath,
  screenshots: [],
  noJavaScript: {},
  axe: {},
  interactionCls: {},
  tapTargets: {},
  network: {},
  lighthouse: {},
};

const screenshot = async (page, name, options = {}) => {
  const filename = `${name}.jpg`;
  await page.screenshot({
    path: path.join(outputDir, filename),
    type: 'jpeg',
    quality: 82,
    ...options,
  });
  evidence.screenshots.push(filename);
};

const waitForPage = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.waitForTimeout(800);
};

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const runtimeRequests = [];
  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType())) {
      runtimeRequests.push({ method: request.method(), resourceType: request.resourceType(), url: request.url() });
    }
  });
  await waitForPage(page, `${baseUrl}/cabin-cost-calculator`);
  const initialSsrTotal = await page.locator('.calculator-header > p strong').textContent();
  await page.waitForSelector('[data-cabin-calculator].is-enhanced');
  const initialEnhancedTotal = await page.locator('[data-estimate-ex-gst]').first().textContent();
  evidence.runtimeEstimate = {
    initialSsrTotal: initialSsrTotal.trim(),
    initialEnhancedTotal: initialEnhancedTotal.trim(),
    match: initialSsrTotal.trim() === initialEnhancedTotal.trim(),
  };
  if (!evidence.runtimeEstimate.match) throw new Error(`SSR/enhanced total mismatch: ${JSON.stringify(evidence.runtimeEstimate)}`);

  for (const [width, height] of [[360, 800], [768, 1024], [1440, 1000]]) {
    await page.setViewportSize({ width, height });
    for (const theme of ['light', 'dark']) {
      for (const step of [1, 2, 5, 9]) {
        await page.evaluate(({ selectedStep, selectedTheme }) => {
          const root = document.querySelector('[data-cabin-calculator]');
          root.dataset.theme = selectedTheme;
          root.querySelector(`[data-step-link="${selectedStep}"]`).click();
          const target = root.querySelector(`[data-step="${selectedStep}"]`);
          target.scrollIntoView({ block: 'start' });
          window.scrollBy(0, -24);
        }, { selectedStep: step, selectedTheme: theme });
        await page.waitForTimeout(180);
        await screenshot(page, `standalone-${theme}-${width}-step-${step}`);
      }
    }
  }

  await page.setViewportSize({ width: 360, height: 800 });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((selectedTheme) => {
      const root = document.querySelector('[data-cabin-calculator]');
      root.dataset.theme = selectedTheme;
      root.querySelector('[data-step-link="2"]').click();
      root.querySelector('[data-step="2"]').scrollIntoView({ block: 'start' });
    }, theme);
    await page.waitForTimeout(150);
    await page.locator('.mobile-estimate').screenshot({ path: path.join(outputDir, `mobile-sticky-${theme}-360.png`) });
    evidence.screenshots.push(`mobile-sticky-${theme}-360.png`);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    window.__calculatorLayoutShift = 0;
    window.__calculatorLayoutShiftEntries = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__calculatorLayoutShift += entry.value;
          window.__calculatorLayoutShiftEntries.push(entry.value);
        }
      }
    });
    observer.observe({ type: 'layout-shift' });
    window.__calculatorLayoutShiftObserver = observer;
  });
  for (const step of [1, 2, 5, 9, 1]) {
    await page.evaluate((selectedStep) => {
      document.querySelector(`[data-step-link="${selectedStep}"]`).click();
    }, step);
    await page.waitForTimeout(350);
  }
  evidence.interactionCls = await page.evaluate(() => ({
    value: Number(window.__calculatorLayoutShift.toFixed(6)),
    entries: window.__calculatorLayoutShiftEntries.map((value) => Number(value.toFixed(6))),
  }));

  await page.setViewportSize({ width: 360, height: 800 });
  const tapAudit = [];
  for (const step of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    await page.evaluate((selectedStep) => document.querySelector(`[data-step-link="${selectedStep}"]`).click(), step);
    await page.waitForTimeout(60);
    tapAudit.push(...await page.evaluate((selectedStep) => {
      const root = document.querySelector('[data-cabin-calculator]');
      const candidates = [...root.querySelectorAll('button,a,input,select,textarea,summary')];
      return candidates.flatMap((element) => {
        if (element.disabled || element.type === 'hidden') return [];
        let target = element;
        if (['radio', 'checkbox'].includes(element.type)) target = element.closest('label') || element;
        const rect = target.getBoundingClientRect();
        const style = getComputedStyle(target);
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
        return [{
          step: selectedStep,
          tag: element.tagName.toLowerCase(),
          type: element.getAttribute('type') || '',
          name: element.getAttribute('name') || element.textContent.trim().slice(0, 48),
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2)),
        }];
      });
    }, step));
  }
  const uniqueTapAudit = [...new Map(tapAudit.map((item) => [`${item.step}:${item.tag}:${item.type}:${item.name}`, item])).values()];
  const tapFailures = uniqueTapAudit.filter((item) => item.width < 44 || item.height < 44);
  evidence.tapTargets = {
    audited: uniqueTapAudit.length,
    minimumWidth: Math.min(...uniqueTapAudit.map((item) => item.width)),
    minimumHeight: Math.min(...uniqueTapAudit.map((item) => item.height)),
    failures: tapFailures,
  };

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.querySelector('[data-step-link="1"]').click());
  await page.addScriptTag({ path: axePath });
  const axeResults = await page.evaluate(async () => {
    const serialize = (result) => result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.length,
      targets: violation.nodes.map((node) => node.target),
    }));
    return {
      document: serialize(await window.axe.run(document)),
      calculator: serialize(await window.axe.run(document.querySelector('[data-cabin-calculator]'))),
    };
  });
  evidence.axe = {
    documentViolations: axeResults.document,
    calculatorViolations: axeResults.calculator,
    documentViolationCount: axeResults.document.length,
    calculatorViolationCount: axeResults.calculator.length,
  };
  evidence.network = {
    xhrOrFetchCount: runtimeRequests.length,
    pricingRequestCount: runtimeRequests.filter((request) => /rate|price|ladder/i.test(request.url)).length,
    requests: runtimeRequests,
  };

  await context.close();

  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const noJsPage = await noJsContext.newPage();
  await waitForPage(noJsPage, `${baseUrl}/cabin-cost-calculator`);
  const standaloneCounts = await noJsPage.evaluate(() => ({
    steps: document.querySelectorAll('[data-cabin-calculator] [data-step]').length,
    tables: document.querySelectorAll('[data-cabin-calculator] [data-product-price-table]').length,
    forms: document.querySelectorAll('[data-cabin-calculator] form[action="/api/enquiry"]').length,
    enhancerLoaded: document.querySelector('[data-cabin-calculator]').classList.contains('is-enhanced'),
  }));
  await screenshot(noJsPage, 'no-js-standalone-full-page', { fullPage: true, quality: 70 });
  await noJsPage.locator('[data-step="9"]').screenshot({ path: path.join(outputDir, 'no-js-standalone-enquiry-form.png') });
  evidence.screenshots.push('no-js-standalone-enquiry-form.png');
  await noJsPage.locator('[data-product-price-table="porta-cabin"]').screenshot({ path: path.join(outputDir, 'no-js-standalone-price-table.png') });
  evidence.screenshots.push('no-js-standalone-price-table.png');

  await waitForPage(noJsPage, `${baseUrl}/product/labor-colony`);
  const embeddedCounts = await noJsPage.evaluate(() => ({
    steps: document.querySelectorAll('[data-cabin-calculator][data-mode="embedded"] [data-step]').length,
    tables: document.querySelectorAll('[data-cabin-calculator][data-mode="embedded"] [data-product-price-table]').length,
    forms: document.querySelectorAll('[data-cabin-calculator][data-mode="embedded"] form[action="/api/enquiry"]').length,
    enhancerLoaded: document.querySelector('[data-cabin-calculator][data-mode="embedded"]').classList.contains('is-enhanced'),
  }));
  await screenshot(noJsPage, 'no-js-embedded-full-page', { fullPage: true, quality: 70 });
  await noJsPage.locator('[data-cabin-calculator][data-mode="embedded"] [data-step="9"]').screenshot({ path: path.join(outputDir, 'no-js-embedded-enquiry-form.png') });
  evidence.screenshots.push('no-js-embedded-enquiry-form.png');
  await noJsPage.locator('[data-cabin-calculator][data-mode="embedded"] [data-product-price-table]').screenshot({ path: path.join(outputDir, 'no-js-embedded-price-table.png') });
  evidence.screenshots.push('no-js-embedded-price-table.png');

  let interceptedPost = null;
  await noJsPage.route('**/api/enquiry', async (route) => {
    const request = route.request();
    const postData = request.postData() || '';
    const fields = new URLSearchParams(postData);
    interceptedPost = {
      method: request.method(),
      contentType: request.headers()['content-type'] || '',
      bodyBytes: Buffer.byteLength(postData),
      fullName: fields.get('fullName'),
      mobile: fields.get('mobile'),
      email: fields.get('email'),
      configurationPresent: Boolean(fields.get('configuration')),
      estimatePresent: Boolean(fields.get('estimate')),
    };
    await route.fulfill({ status: 303, headers: { location: `${baseUrl}/cabin-cost-calculator?submitted=1` }, body: '' });
  });
  await noJsPage.locator('[data-cabin-calculator][data-mode="embedded"] input[name="fullName"]').fill('Headless Audit');
  await noJsPage.locator('[data-cabin-calculator][data-mode="embedded"] input[name="mobile"]').fill('9876543210');
  await noJsPage.locator('[data-cabin-calculator][data-mode="embedded"] input[name="email"]').fill('audit@example.com');
  const nativeValidity = await noJsPage.locator('[data-cabin-calculator][data-mode="embedded"] form').evaluate((form) => ({
    valid: form.checkValidity(),
    submitButtonAssociated: form.querySelector('button[type="submit"]')?.form === form,
    method: form.method,
    action: form.action,
    invalidFields: [...form.elements].filter((field) => field.willValidate && !field.validity.valid).map((field) => ({
      name: field.name,
      validationMessage: field.validationMessage,
    })),
  }));
  if (!nativeValidity.valid) throw new Error(`Native form invalid: ${JSON.stringify(nativeValidity.invalidFields)}`);
  const postRequest = noJsPage.waitForRequest((request) => request.url().endsWith('/api/enquiry') && request.method() === 'POST', { timeout: 20_000 });
  await noJsPage.locator('[data-cabin-calculator][data-mode="embedded"] form').evaluate((form) => {
    form.requestSubmit(form.querySelector('button[type="submit"]'));
  });
  await postRequest;
  await noJsPage.waitForURL('**/cabin-cost-calculator?submitted=1', { timeout: 20_000 });
  const resultMessage = await noJsPage.locator('[data-calculator-notice]').textContent();
  await noJsPage.locator('[data-calculator-notice]').screenshot({ path: path.join(outputDir, 'no-js-form-post-result.png') });
  evidence.screenshots.push('no-js-form-post-result.png');
  evidence.noJavaScript = {
    standalone: standaloneCounts,
    embedded: embeddedCounts,
    formSubmission: {
      interceptedRequest: interceptedPost,
      nativeValidity,
      resultUrl: noJsPage.url(),
      resultMessage: resultMessage.trim(),
      externalLeadSent: false,
    },
  };
  await noJsContext.close();
} finally {
  await browser.close();
}

const lighthouseChrome = await launchChrome({
  chromePath,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

try {
  const targets = [
    { key: 'standalone', path: '/cabin-cost-calculator' },
    { key: 'productLaborColony', path: '/product/labor-colony', lockfile: lockfile['C14 hub'] },
  ];
  for (const target of targets) {
    const url = `${baseUrl}${target.path}`;
    await fetch(url);
    await fetch(url);
    const runs = [];
    for (let run = 1; run <= 3; run += 1) {
      const result = await lighthouse(url, {
        port: lighthouseChrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 3, disabled: false },
      });
      const audits = result.lhr.audits;
      runs.push({
        run,
        performance: Math.round(result.lhr.categories.performance.score * 100),
        LCP_ms: Math.round(audits['largest-contentful-paint'].numericValue),
        CLS: Number(audits['cumulative-layout-shift'].numericValue.toFixed(4)),
        TBT_ms: Math.round(audits['total-blocking-time'].numericValue),
      });
    }
    const median = (field) => {
      const values = runs.map((run) => run[field]).sort((a, b) => a - b);
      return Number(values[Math.floor(values.length / 2)].toFixed(field === 'CLS' ? 4 : 0));
    };
    const summary = {
      runs,
      median: {
        performance: median('performance'),
        LCP_ms: median('LCP_ms'),
        CLS: median('CLS'),
        TBT_ms: median('TBT_ms'),
      },
    };
    if (target.lockfile) {
      summary.lockfile = target.lockfile;
      summary.delta = {
        performance: summary.median.performance - target.lockfile.lighthouse_perf,
        LCP_ms: summary.median.LCP_ms - target.lockfile.LCP_ms,
        CLS: Number((summary.median.CLS - target.lockfile.CLS).toFixed(4)),
        TBT_ms: summary.median.TBT_ms - target.lockfile.TBT_ms,
      };
    }
    evidence.lighthouse[target.key] = summary;
  }
} finally {
  try {
    await lighthouseChrome.kill();
  } catch (error) {
    evidence.lighthouse.cleanupWarning = error.message;
  }
}

await writeFile(path.join(outputDir, 'headless-audit-results.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(evidence, null, 2));
