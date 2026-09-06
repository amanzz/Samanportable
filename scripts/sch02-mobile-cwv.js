// SCH-02 Template Conformance Gate, artefact 6 - mobile Core Web Vitals, this page
// against the design lock, measured back to back on the same machine.
//
// Measured in-page with PerformanceObserver rather than through Lighthouse, because a
// local Lighthouse run on this machine is bimodal: the same untouched page scores 90 on
// one run and 30 on the next purely from CPU contention, so a single score proves
// nothing. Running both URLs in the same session, alternating, and reporting the median
// of N runs makes the COMPARISON meaningful even when the absolute numbers move.
//
//   node scripts/sch02-mobile-cwv.js <preview-url> <design-lock-url> <out-file> [runs]
const fs = require('fs');
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer-core');

const CHROME = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const [PREVIEW, LOCK, OUT, RUNS = '5'] = process.argv.slice(2);
const N = Number(RUNS);

// Moto G Power class throttling, the Lighthouse mobile default.
const CPU_THROTTLE = 4;
const NETWORK = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

const measure = async (browser, url) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 '
    + '(KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36');
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', NETWORK);
  await client.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE });

  await page.evaluateOnNewDocument(() => {
    window.__cwv = { lcp: 0, cls: 0, longTasks: 0, longTaskMs: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__cwv.lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cwv.cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__cwv.longTasks += 1;
        window.__cwv.longTaskMs += Math.max(0, e.duration - 50);
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  await page.goto(url, { waitUntil: 'load', timeout: 180000 });
  await new Promise((r) => setTimeout(r, 6000));
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0;
    return {
      lcp: window.__cwv.lcp,
      cls: window.__cwv.cls,
      tbt: window.__cwv.longTaskMs,
      longTasks: window.__cwv.longTasks,
      fcp,
      domContentLoaded: nav.domContentLoadedEventEnd || 0,
      transferBytes: performance.getEntriesByType('resource')
        .reduce((a, r) => a + (r.transferSize || 0), 0),
      requests: performance.getEntriesByType('resource').length,
    };
  });
  await page.close();
  return m;
};

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });
  const targets = [{ name: 'this page', url: PREVIEW }, { name: 'design lock', url: LOCK }];
  const runs = { 'this page': [], 'design lock': [] };
  for (let i = 0; i < N; i += 1) {
    for (const t of targets) {
      runs[t.name].push(await measure(browser, t.url));
      process.stderr.write('.');
    }
  }
  await browser.close();

  const lines = [
    'SCH-02 artefact 6 - mobile Core Web Vitals',
    '',
    `viewport 390x844, deviceScaleFactor 2, CPU throttle ${CPU_THROTTLE}x,`,
    'network 1.6 Mbps / 150 ms RTT (Lighthouse mobile defaults).',
    `${N} runs per URL, alternating, same browser session. Median reported.`,
    '',
    `this page  : ${PREVIEW}`,
    `design lock: ${LOCK}`,
    '',
    `${'metric'.padEnd(22)}${'this page'.padStart(14)}${'design lock'.padStart(14)}`,
  ];
  const METRICS = [
    ['LCP (ms)', 'lcp'], ['CLS', 'cls'], ['TBT (ms)', 'tbt'],
    ['long tasks', 'longTasks'], ['FCP (ms)', 'fcp'],
    ['DOMContentLoaded (ms)', 'domContentLoaded'],
    ['transfer (KB)', 'transferBytes'], ['requests', 'requests'],
  ];
  const out = {};
  for (const [label, key] of METRICS) {
    let a = median(runs['this page'].map((r) => r[key]));
    let b = median(runs['design lock'].map((r) => r[key]));
    if (key === 'transferBytes') { a /= 1024; b /= 1024; }
    out[key] = { page: a, lock: b };
    const fmt = (v) => (key === 'cls' ? v.toFixed(4) : Math.round(v).toLocaleString('en-US'));
    lines.push(`${label.padEnd(22)}${fmt(a).padStart(14)}${fmt(b).padStart(14)}`);
  }
  lines.push('');
  lines.push('CLS is the metric this gate cares about most: a template-conformance defect');
  lines.push('shows up as layout shift the design lock does not have.');
  lines.push(`CLS this page ${out.cls.page.toFixed(4)} vs design lock ${out.cls.lock.toFixed(4)}.`);
  fs.writeFileSync(OUT, lines.join('\n') + '\n', 'utf8');
  console.log(lines.join('\n'));
})();
