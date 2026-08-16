// P1 Phase 2, I-11: scan the actual rendered DOM of all 11 approved Porta Cabins
// pages for empty H1-H6 elements, H1 count, and heading order.
const pw = await import('file:///C:/Users/Saman%20Pos/Desktop/Website%20Code/Samanportable-main/saman-fresh-clone/node_modules/playwright/index.js');
const chromium = pw.chromium || pw.default?.chromium;

const BASE = 'http://localhost:5611';
const PAGES = [
  ['hub', '/product/porta-cabins'],
  ['ms', '/product/porta-cabins/ms-porta-cabin'],
  ['gi', '/product/porta-cabins/gi-porta-cabin'],
  ['double-story', '/product/porta-cabins/double-story-porta-cabin'],
  ['with-toilet', '/product/porta-cabins/porta-cabin-with-toilet'],
  ['fire-rated', '/product/porta-cabins/fire-rated-porta-cabin'],
  ['soundproof', '/product/porta-cabins/soundproof-porta-cabin'],
  ['puf', '/product/porta-cabins/puf-porta-cabin'],
  ['skid-mounted', '/product/porta-cabins/skid-mounted-porta-cabin'],
  ['knock-down', '/product/porta-cabins/knock-down-porta-cabin'],
  ['shop', '/product/porta-cabins/porta-cabin-shop'],
];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const results = [];

for (const [name, path] of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 });
  const data = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    const empties = headings.filter((h) => h.textContent.trim().length === 0);
    const h1s = headings.filter((h) => h.tagName === 'H1');
    return {
      totalHeadings: headings.length,
      emptyCount: empties.length,
      emptyDetail: empties.map((h) => ({
        tag: h.tagName,
        className: h.className,
        outerHTMLStart: h.outerHTML.slice(0, 200),
        parentClass: h.parentElement ? h.parentElement.className : null,
      })),
      h1Count: h1s.length,
      order: headings.map((h) => h.tagName),
    };
  });
  results.push({ name, path, ...data });
  console.log(`${name.padEnd(14)} headings=${data.totalHeadings}  empty=${data.emptyCount}  h1=${data.h1Count}`);
}

await browser.close();

console.log('\n=== EMPTY HEADING DETAIL (first page with hits, deduped by className) ===');
const seenClasses = new Set();
for (const r of results) {
  for (const e of r.emptyDetail) {
    const key = e.tag + '|' + e.className + '|' + e.parentClass;
    if (seenClasses.has(key)) continue;
    seenClasses.add(key);
    console.log(`\n[from ${r.name}] ${e.tag} class="${e.className}" parentClass="${e.parentClass}"`);
    console.log('  ' + e.outerHTMLStart);
  }
}

const fs = await import('node:fs');
fs.writeFileSync('./scripts/p1-heading-scan-report.json', JSON.stringify(results, null, 1));
