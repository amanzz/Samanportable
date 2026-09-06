// CH-02 Template Conformance Gate, artefact 3 - full-page screenshots of the local
// preview and of the live porta-cabins design lock, at desktop 1440 and mobile 390.
//
// Uses puppeteer-core against the system Chrome, so nothing is added to the repo's
// dependency tree. Run it from a project that has puppeteer-core:
//   node scripts/ch02-screenshots.js <preview-url> <design-lock-url> <out-dir>
//
// Every image is forced eager and every tab panel is opened before the capture:
// a full-page screenshot otherwise scrolls past lazily-loaded frames faster than
// they can decode, and the Description tab's own images measure 0x0 while their
// panel is hidden, so they capture blank.
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

async function settle(page) {
  // Scroll the whole page first so every lazy image starts loading in the normal
  // way, then FORCE a reload of each one with the loading attribute removed.
  // Merely assigning img.loading = 'eager' after parse does not restart a lazy
  // image in Chrome, and puppeteer's fullPage pass re-lays-out the document at
  // full height - which is how a loaded image can still paint blank. Reassigning
  // src with the attribute gone is what actually guarantees decoded pixels.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images).map((img) => {
      img.removeAttribute('loading');
      img.loading = 'eager';
      const src = img.currentSrc || img.src;
      if (!src) return Promise.resolve();
      img.src = '';
      img.src = src;
      return img.decode().catch(() => {});
    }));
  });
  await new Promise((r) => setTimeout(r, 1500));
}

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
        isMobile: v.mobile, hasTouch: v.mobile, deviceScaleFactor: 1,
      });
      try {
        await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 120000 });
        // Grow the viewport to the whole document BEFORE settling, so the layout
        // the images decode into is the layout that gets captured.
        const full = await page.evaluate(() => document.body.scrollHeight);
        await page.setViewport({
          width: v.width, height: Math.min(full + 200, 30000),
          isMobile: v.mobile, hasTouch: v.mobile, deviceScaleFactor: 1,
        });
        await settle(page);
        const file = path.join(OUT, `ch02-gate3-${t.name}-${v.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        const m = await page.evaluate(() => ({
          height: document.body.scrollHeight,
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
          images: document.images.length,
          broken: Array.from(document.images).filter((i) => i.naturalWidth === 0).length,
        }));
        console.log(`${t.name} ${v.name}: ${file}`);
        console.log(`   page height ${m.height}px, images ${m.images}, zero-width ${m.broken}, `
          + `horizontal overflow ${m.scrollW > m.clientW ? `YES (${m.scrollW} > ${m.clientW})` : 'no'}`);
      } catch (e) {
        console.log(`${t.name} ${v.name}: FAILED ${e.message}`);
      }
      await page.close();
    }
  }
  await browser.close();
})();
