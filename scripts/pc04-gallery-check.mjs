// PC-04 v1.4 preview check: for each of the six size tabs, click it, confirm the
// URL fragment updates to #size-<size> (criterion 9), confirm the six thumbnail
// srcs match the new manifest exactly (criterion 2/3), and screenshot the gallery
// plus a lightbox open, desktop and mobile (criterion 12).
const pw = await import('file:///C:/Users/Saman%20Pos/Desktop/Website%20Code/Samanportable-main/saman-fresh-clone/node_modules/playwright/index.js');
const chromium = pw.chromium || pw.default?.chromium;
import fs from 'node:fs';

const BASE = 'http://localhost:5311';
const URL_ = BASE + '/product/porta-cabins/porta-cabin-with-toilet';
const OUT = './shots';
fs.mkdirSync(OUT, { recursive: true });

const SIZES = ['10x10', '20x8', '20x10', '20x12', '30x10', '40x10'];
const EXPECTED_VIEWS = ['hero-view', 'front-angle', 'elevated-view', 'end-elevation', 'space-interior', 'rear-interior'];

const browser = await chromium.launch({ channel: 'chrome' });
const results = [];

for (const [label, width, height] of [['desktop', 1440, 1400], ['mobile', 390, 1400]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: label === 'mobile', hasTouch: label === 'mobile' });
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(1000);

  for (const size of SIZES) {
    const tab = page.locator(`button:has-text("${size.replace('x', '\u00d7')}")`).first();
    const altTab = page.locator(`button:has-text("${size}")`).first();
    const target = (await tab.count()) ? tab : altTab;
    if (await target.count()) {
      await target.click();
      await page.waitForTimeout(600);
    }

    const url = page.url();
    const fragOk = url.endsWith(`#size-${size}`);

    // gallery thumbnails: read every <img> src inside the gallery/thumbnail strip
    const srcs = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((i) => i.getAttribute('src') || i.src).filter((s) => s && s.includes('/images/products/porta-cabin-with-toilet/'));
    });
    const uniqueSrcs = [...new Set(srcs)];
    const thisSize = uniqueSrcs.filter((s) => s.includes(`/porta-cabin-with-toilet/${size}/`));
    const views = thisSize.map((s) => {
      const m = s.match(/-([a-z]+(?:-[a-z]+)?)\.webp/);
      return m ? m[1] : s;
    }).sort();
    const viewsOk = JSON.stringify(views) === JSON.stringify([...EXPECTED_VIEWS].sort());

    if (label === 'desktop') {
      await page.screenshot({ path: `${OUT}/pc04-${size}-${label}-full.png`, fullPage: true });
      // gallery region only
      const galleryImg = page.locator('img[src*="hero-view"]').first();
      if (await galleryImg.count()) {
        const box = await galleryImg.boundingBox().catch(() => null);
        if (box) {
          await page.screenshot({ path: `${OUT}/pc04-${size}-${label}-gallery.png`,
            clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: Math.min(width, box.width + 400), height: box.height + 220 } }).catch(() => {});
        }
      }
    } else {
      await page.screenshot({ path: `${OUT}/pc04-${size}-${label}-full.png`, fullPage: true });
    }

    const overflow = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth }));

    results.push({ size, label, fragOk, url, thisSizeSrcs: thisSize, views, viewsOk, overflow: overflow.scrollW > overflow.clientW + 1 });
  }

  // lightbox: click the main hero image once on the last size tested, desktop only
  if (label === 'desktop') {
    const hero = page.locator('img[src*="hero-view"]').first();
    if (await hero.count()) {
      await hero.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUT}/pc04-lightbox-${label}.png` }).catch(() => {});
    }
  }

  await ctx.close();
}
await browser.close();

console.log('########## Size-tab anchor + gallery content check ##########\n');
for (const r of results) {
  console.log(`${r.label.padEnd(8)} ${r.size.padEnd(6)} frag=${r.fragOk ? 'OK' : '*** FAIL ***'}  views=${r.viewsOk ? 'OK' : '*** FAIL *** ' + r.views.join(',')}  overflow=${r.overflow ? '*** YES ***' : 'no'}`);
}
const allOk = results.every((r) => r.fragOk && r.viewsOk && !r.overflow);
console.log(allOk ? '\nALL PASS' : '\n*** SOME FAILURES ABOVE ***');

fs.writeFileSync('./scripts/pc04-gallery-check-report.json', JSON.stringify(results, null, 1));
