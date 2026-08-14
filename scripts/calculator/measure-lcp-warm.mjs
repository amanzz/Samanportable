/**
 * CALC-L4 gate G9. Warm LCP, five runs per route, median reported.
 *
 * Warm means the browser context is reused and each route is loaded once to
 * fill the HTTP cache before the five measured runs. Same context, same
 * machine, same throttling for the before and after builds, so the two are
 * comparable to each other - which is the only comparison this gate makes.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.LCP_BASE_URL || 'http://127.0.0.1:3119';
const label = process.env.LCP_LABEL || 'after';
const routes = (process.env.LCP_ROUTES || [
  '/product/container-cafe',
  '/product/container-cafe/container-restaurant',
  '/product/container-cafe/food-truck-containers',
  '/product/container-cafe/container-hotel',
  '/product/container-cafe/modular-container-cafe',
  '/product/container-cafe/container-coffee-shop',
].join(',')).split(',');
const runs = Number(process.env.LCP_RUNS || 5);
const outputDir = path.resolve(process.env.LCP_OUTPUT_DIR || 'reports/calc-L4');
const playwrightRoot = process.env.PLAYWRIGHT_PACKAGE_ROOT;
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, 'playwright/index.mjs')).href);
await mkdir(outputDir, { recursive: true });

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

const browser = await chromium.launch({ channel: 'chrome' });
// One context for the whole run so the cache stays warm across routes.
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

const measure = async (url) => {
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  // Mobile-ish conditions, identical for before and after.
  await client.send('Network.emulateNetworkConditions', {
    offline: false, latency: 40, downloadThroughput: (10 * 1024 * 1024) / 8, uploadThroughput: (3 * 1024 * 1024) / 8,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  const reading = await page.evaluate(() => new Promise((resolve) => {
    let lcp = 0;
    let cls = 0;
    new PerformanceObserver((list) => { for (const e of list.getEntries()) lcp = e.startTime; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    // give late images a chance, then settle
    setTimeout(() => resolve({ lcp: Math.round(lcp), cls: Number(cls.toFixed(4)) }), 2500);
  }));
  await page.close();
  return reading;
};

const results = [];
for (const route of routes) {
  const url = baseUrl + route;
  await measure(url); // warm-up, discarded
  const readings = [];
  for (let i = 0; i < runs; i += 1) readings.push(await measure(url));
  const lcpSamples = readings.map((reading) => reading.lcp);
  const clsSamples = readings.map((reading) => reading.cls);
  const lcpMedian = median(lcpSamples);
  const clsWorst = Math.max(...clsSamples);
  results.push({ route, lcpSamples, lcpMedian, clsSamples, clsWorst });
  console.log(`${route.padEnd(50)} LCP=[${lcpSamples.join(', ')}] median=${lcpMedian}ms ${lcpMedian <= 2500 ? 'PASS <=2500' : 'OVER 2500'} CLS=[${clsSamples.join(', ')}] worst=${clsWorst}`);
}
await browser.close();

await writeFile(path.join(outputDir, `lcp-${label}.json`), JSON.stringify({ baseUrl, label, runs, results }, null, 2));
const worst = Math.max(...results.map((r) => r.lcpMedian));
console.log(`\n${label}: worst median LCP ${worst}ms across ${routes.length} routes`);
