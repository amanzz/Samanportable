// PO-04 Gate 3 - full-page screenshots, desktop 1440 and mobile 390, of the preview
// and of the live porta-cabins design-lock reference.
//
// puppeteer-core drives the Chrome already installed on this machine (no Chromium
// download) and takes a real fullPage capture, so each image's height IS the page
// height. Installed with `npm install --no-save puppeteer-core`, so package.json and
// package-lock.json are untouched.
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'artefacts');
mkdirSync(OUT, { recursive: true });

const PO04 = 'http://127.0.0.1:3211/product/portable-office/executive-portable-office';
const REF = 'https://www.samanportable.com/product/porta-cabins';

const TARGETS = [
  ['gate3-po04-desktop-1440.png', PO04, 1440, 900, 1],
  ['gate3-po04-mobile-390.png', PO04, 390, 844, 2],
  ['gate3-portacabins-desktop-1440.png', REF, 1440, 900, 1],
  ['gate3-portacabins-mobile-390.png', REF, 390, 844, 2],
];

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

for (const [name, url, width, height, dsf] of TARGETS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: dsf, isMobile: width < 500, hasTouch: width < 500 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
  // Scroll the whole page so every lazy image and the deferred calculator load, then
  // return to the top before capturing.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += 600;
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else { window.scrollTo(0, 0); setTimeout(resolve, 1500); }
      };
      step();
    });
  });
  await new Promise((r) => setTimeout(r, 1500));
  const dims = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`PASS  ${name.padEnd(40)} page ${dims.w}x${dims.h} css px  <- ${url}`);
  await page.close();
}

await browser.close();
