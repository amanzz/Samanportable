// PO-06 Template Conformance Gate, artefact 3 - full-page screenshots of the local
// preview and of the live porta-cabins design lock, at desktop 1440 and mobile 390.
//
// Uses puppeteer-core against the system Chrome, so nothing is added to the repo's
// dependency tree. Run it from the scratchpad project that has puppeteer-core:
//   node scripts/po06-screenshots.js <preview-url> <design-lock-url> <out-dir>
const path = require('path');
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer-core');

const CHROME = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const [PREVIEW, LOCK, OUT] = process.argv.slice(2);
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
];
const TARGETS = [
  { name: 'preview', url: PREVIEW },
  { name: 'designlock', url: LOCK },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  for (const t of TARGETS) {
    for (const v of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({
        width: v.width, height: v.height,
        isMobile: v.mobile, hasTouch: v.mobile,
        deviceScaleFactor: 1,
      });
      if (v.mobile) {
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 '
          + '(KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36');
      }
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 120000 });
      // Scroll the whole page so every lazy image and the tab strip have painted.
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let y = 0;
          const step = () => {
            window.scrollBy(0, 900); y += 900;
            if (y < document.body.scrollHeight + 2000) setTimeout(step, 90);
            else { window.scrollTo(0, 0); setTimeout(resolve, 900); }
          };
          step();
        });
      });
      // A single scroll pass is NOT enough for a full-page capture: puppeteer's
      // fullPage screenshot resizes the viewport and re-renders, and any image still
      // marked loading="lazy" that has not yet fetched paints BLANK - which is exactly
      // how the five Description-tab frames went missing from the first capture even
      // though they load correctly for a real reader. Force every image eager and wait
      // for all of them to decode before the shutter. This changes only the capture,
      // never the page.
      await page.evaluate(async () => {
        const imgs = [...document.querySelectorAll('img')];
        imgs.forEach((i) => { i.loading = 'eager'; i.removeAttribute('loading'); });
        await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
      });
      await new Promise((r) => setTimeout(r, 1200));
      const file = path.join(OUT, `03-${t.name}-${v.name}.jpg`);
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 72 });
      const h = await page.evaluate(() => document.body.scrollHeight);
      // Horizontal-overflow probe: the mobile shots are also the evidence for the
      // known site-wide 360/390 clipping, so record the measurement next to the shot.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      console.log(`${file}  ${v.width}x${h}  scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`);
      await page.close();
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
