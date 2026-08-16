const pw = await import('file:///C:/Users/Saman%20Pos/Desktop/Website%20Code/Samanportable-main/saman-fresh-clone/node_modules/playwright/index.js');
const chromium = pw.chromium || pw.default?.chromium;
const BASE = 'http://localhost:5611';
const PAGES = [
  ['hub', '/product/porta-cabins'], ['ms', '/product/porta-cabins/ms-porta-cabin'],
  ['fire-rated', '/product/porta-cabins/fire-rated-porta-cabin'], ['shop', '/product/porta-cabins/porta-cabin-shop'],
];
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
for (const [name, path] of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 });
  const data = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    const empties = headings.filter((h) => h.textContent.trim().length === 0);
    return { total: headings.length, empty: empties.length, h1: headings.filter(h=>h.tagName==='H1').length };
  });
  console.log(`${name.padEnd(12)} mobile: headings=${data.total} empty=${data.empty} h1=${data.h1}`);
}
await browser.close();
