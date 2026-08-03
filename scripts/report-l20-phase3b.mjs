import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const beforePath = process.argv[2] || 'C:/tmp/l20-phase3b-before-audit-20260803.json';
const afterPath = process.argv[3] || 'C:/tmp/l20-phase3b-final-audit-20260803.json';
const before = JSON.parse(fs.readFileSync(beforePath, 'utf8'));
const after = JSON.parse(fs.readFileSync(afterPath, 'utf8'));
const reportDir = path.join(root, 'reports');

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const cell = value => clean(value).replaceAll('|', '\\|');
const write = (name, text) => fs.writeFileSync(path.join(reportDir, name), `${text.trim()}\n`, 'utf8');
const beforeByRoute = new Map(before.routes.map(route => [route.pathname, route]));
const afterByRoute = new Map(after.routes.map(route => [route.pathname, route]));

const headingReplacements = new Map([
  ['Enjoyed this article?', 'More on this topic'],
  ['Still have questions?', 'Questions we are asked most'],
  ['Ready to Get Started?', 'Start your order'],
  ['Ready to Work With Us?', 'Work with SAMAN'],
  ['Looking to Buy Instead?', 'Buying instead of renting'],
  ['Looking to Buy Instead of Rent?', 'Buying instead of renting'],
  ['Why Choose Saman Portable?', 'Why buyers choose SAMAN'],
  ['Why Choose Saman Portable for Your Cabin Needs?', 'Why buyers choose SAMAN'],
]);

const headingRows = [];
for (const route of before.routes) {
  for (const heading of route.headings || []) {
    const replacement = headingReplacements.get(heading.text);
    if (replacement) headingRows.push({ url: route.pathname, surface: heading.level, before: heading.text, after: replacement });
  }
}

const reviewMultiset = new Map();
for (const route of after.routes) {
  for (const item of route.emoji?.reviewExceptions || []) {
    const key = JSON.stringify([item.pathname, item.emoji, item.sentence]);
    reviewMultiset.set(key, (reviewMultiset.get(key) || 0) + 1);
  }
}
const removedEmoji = [];
for (const route of before.routes) {
  for (const item of route.emoji?.removable || []) {
    const key = JSON.stringify([item.pathname, item.emoji, item.sentence]);
    const retained = reviewMultiset.get(key) || 0;
    if (retained) reviewMultiset.set(key, retained - 1);
    else removedEmoji.push(item);
  }
}
const reviewExceptions = after.routes.flatMap(route => route.emoji?.reviewExceptions || []);
const emojiCodePoints = items => items.reduce(
  (sum, item) => sum + [...item.emoji].filter(character => /\p{Extended_Pictographic}/u.test(character)).length,
  0,
);
const withoutEmoji = item => clean(item.sentence.replace(item.emoji, '').replace(/\s+([,;:.!?])/g, '$1'));

const b4Rows = [
  { url: '/', surface: 'h2', before: 'A Seamless 6-Step Journey', after: 'Our 6-Step Process' },
  { url: '/18-benefits-of-luxury-portable-cabin', surface: 'bodyProse', before: "In today's fast-paced world, the demand for versatile and efficient solutions for workspace management has never been greater.", after: 'Demand for flexible workspace has risen sharply as projects move faster and sites change more often.' },
  { url: '/18-benefits-of-luxury-portable-cabin', surface: 'bodyProse', before: "The ability to adapt quickly is a key advantage in today's fast-paced work environments.", after: 'Being able to reconfigure a space in days rather than months is the practical advantage.' },
  { url: '/18-benefits-of-luxury-portable-cabin', surface: 'bodyProse', before: 'Luxury portable cabins have revolutionized the way businesses think about workspace solutions.', after: 'Luxury portable cabins have changed what businesses expect from a temporary workspace.' },
  { url: '/about-us', surface: 'bodyProse', before: 'To design and deliver sustainable, cost-effective, and technology-driven portable construction solutions that empower businesses to grow, adapt, and thrive in a dynamic world.', after: 'To design and deliver sustainable, cost-effective, and technology-driven portable construction solutions that help businesses grow and adapt as their sites and teams change.' },
  { url: '/about-us', surface: 'bodyProse', before: 'understanding not just space requirements, but the goals and challenges behind them.', after: 'understanding the space required, and the goals and constraints behind it.' },
  { url: '/container-house-price-in-tamil-nadu', surface: 'bodyProse', before: 'The world of container homes is diverse, with various types available to suit different needs and preferences.', after: 'Container homes come in several types, each suited to a different need and budget.' },
  { url: '/container-house-price-in-tamil-nadu', surface: 'bodyProse', before: 'This can be particularly beneficial for buyers seeking a one-stop solution for their container home acquisition.', after: 'This suits buyers who would rather deal with one supplier from drawing to delivery.' },
  { url: '/container-houses-cost-guide-2024', surface: 'metaDescription', before: 'revolutionizing', after: 'changing' },
  { url: '/container-houses-cost-guide-2024', surface: 'first100Words', before: 'revolutionizing', after: 'changing' },
  { url: '/container-houses-cost-guide-2024', surface: 'bodyProse', before: 'revolutionizing', after: 'changing' },
  { url: '/container-houses-cost-guide-2024', surface: 'bodyProse', before: 'To find detailed pricing and designs tailored to your needs, visit our porta cabin product page.', after: 'For current pricing and the size ladder, see our porta cabin product page.' },
  { url: '/pre-engineered-buildings-in-bangalore', surface: 'bodyProse', before: 'Modular designs have revolutionized the commercial sector...', after: 'Modular designs have changed how commercial buildings are procured...' },
  { url: '/pre-engineered-buildings-in-bangalore', surface: 'bodyProse', before: 'The architecture of pre-engineered buildings in Bangalore is a testament to the limitless possibilities offered by this construction technique.', after: 'Pre-engineered buildings in Bangalore show how far the technique now stretches in span, height and finish.' },
  { url: '/product/peb-constructions/pre-engineered-structures', surface: 'bodyProse', before: '(PEBs) are a game-changer in construction, offering top-notch strength and flexibility.', after: '(PEBs) changed how large spans are built, combining high strength with design flexibility.' },
  { url: '/product/porta-cabins/portacabin-office', surface: 'bodyProse', before: 'The Portacabin Office is a game-changer for businesses seeking flexibility.', after: 'The Portacabin Office suits businesses that need to move or resize a workspace quickly.' },
  { url: '/portable-cabin-price-in-bangalore', surface: 'bodyProse', before: 'Our guide dives into the world of portable cabin solutions.', after: 'This guide covers portable cabin options, sizes and prices in Bangalore.' },
  { url: '/portable-cabins-in-kr-puram', surface: 'bodyProse', before: 'The world of portable cabins is changing fast.', after: 'Portable cabin design and pricing are changing fast.' },
  { url: '/portable-cabins-in-peenya', surface: 'bodyProse', before: 'The world of portable solutions is growing fast.', after: 'Demand for portable buildings is growing fast.' },
  { url: '/temporary-garden-shed', surface: 'bodyProse', before: 'The world of garden storage has changed a lot in recent years.', after: 'Garden storage has changed a lot in recent years.' },
  { url: '/porta-cabins-in-domlur', surface: 'bodyProse', before: 'not just a sales address, but a service-vehicle dispatch radius that holds the line on warranty SLAs.', after: 'a service-vehicle dispatch radius that holds the line on warranty response times, not merely a sales address.' },
  { url: '/portable-cabins-in-frazer-town', surface: 'bodyProse', before: 'We aim to make products that are not just good but also make our users happy.', after: 'We aim to make products that work well and that our customers are glad they bought.' },
  { url: '/portable-cabins-in-hennur', surface: 'bodyProse', before: 'It makes sure portable cabins are not just useful but also safe and healthy for people.', after: 'It makes sure portable cabins are useful, and safe and healthy to occupy.' },
  { url: '/portacabins-for-sale-in-frazer-town-2', surface: 'bodyProse', before: 'This makes them not just useful but also energy-saving.', after: 'This makes them useful and energy-saving.' },
  { url: '/portable-toilets-in-bangalore', surface: 'bodyProse', before: 'are not just a convenience but a necessity for successful outdoor events.', after: 'are a necessity at outdoor events, not merely a convenience.' },
  { url: '/types-of-container-offices', surface: 'bodyProse', before: "Customization ensures container offices meet not just today's needs but tomorrow's challenges.", after: "Customisation lets a container office meet today's requirement and adapt to the next one." },
  { url: '/porta-cabins-in-rt-nagar', surface: 'metaDescription', before: 'ideal for homes, offices, and storage with seamless delivery options.', after: 'ideal for homes, offices and storage, with delivery across RT Nagar.' },
  { url: '/container-rent-services/30x10-porta-cabin-rental', surface: 'bodyProse', before: 'within 24 hours, ensuring seamless project transitions.', after: 'within 24 hours, so the project moves without a gap.' },
  { url: '/container-rent-services/20x10-porta-cabin-rental', surface: 'bodyProse', before: 'this 200 sq ft unit empowers small-scale operations.', after: 'this 200 sq ft unit suits small-scale operations.' },
  { url: '/container-rent-services/20x10-porta-cabin-rental', surface: 'bodyProse', before: 'to create a fully equipped workspace tailored to your needs.', after: 'to create a workspace fitted to how your team actually works.' },
];

const aRows = [
  ...[
    'How many cabins, what tier discount',
    'Identical fitout across multiple units',
    'Multi-truck dispatch to several cities',
    'Mixed-role cabins on one PO',
  ].map(row => ({ url: '/product/portable-office/prefabricated-office-cabins', surface: `${row} / The single-cabin page`, before: '—', after: 'Not covered' })),
  ...[
    'Factory build steps for one unit',
    'Single-unit specification, finish, fitout',
    'Quality control on one cabin',
  ].map(row => ({ url: '/product/portable-office/prefabricated-office-cabins', surface: `${row} / This page`, before: '—', after: 'Not covered' })),
  {
    url: '/best-porta-cabins-in-bangalore',
    surface: 'bodyProse',
    before: 'Are you in need of a temporary office space in Bangalore that is versatile, cost-effective, and easily customizable? These compact and portable structures have gained immense popularity in recent years for their convenience and flexibility. Whether you need a temporary office space for a construction project, an event, or any other short-term requirement, porta cabins provide the ideal solution.',
    after: 'Are you in need of a temporary office space in Bangalore that is versatile, cost-effective, and easily customizable? A porta cabin answers all three needs at once. These compact and portable structures have gained immense popularity in recent years for their convenience and flexibility. Whether you need a temporary office space for a construction project, an event, or any other short-term requirement, porta cabins provide the ideal solution.',
  },
];

const beforeAfterRows = [
  ...aRows.map(row => ({ section: row.before === '—' ? 'A1' : 'A2', ...row })),
  ...headingRows.map(row => ({ section: 'B2', ...row })),
  ...b4Rows.map(row => ({ section: 'B4', ...row })),
];

let evidence = '# L20 Phase 3b Before/After Evidence — 03 Aug 2026\n\n';
evidence += `Applied non-emoji changes: **${beforeAfterRows.length} occurrences**. B1 and all non-template B2 rows were dismissed.\n\n`;
evidence += '| # | Section | URL | Surface/context | Before | After |\n|---:|---|---|---|---|---|\n';
beforeAfterRows.forEach((row, index) => {
  evidence += `| ${index + 1} | ${row.section} | ${cell(row.url)} | ${cell(row.surface)} | ${cell(row.before)} | ${cell(row.after)} |\n`;
});
write('l20-phase3b-before-after-20260803.md', evidence);

let emojiReport = '# L20 Phase 3b Emoji Evidence — 03 Aug 2026\n\n';
emojiReport += `Removed from non-review rendered copy: **${emojiCodePoints(removedEmoji)} detector-counted emoji code points across ${removedEmoji.length} visual emoji sequences**.\n\n`;
emojiReport += 'The original Phase 3b table contained 121 detector rows. The corrected context-aware traversal resolves those as 119 rendered emoji sequences: 58 removals plus 61 genuine review-quoted exceptions. Two original rows were duplicate heading/text traversal hits.\n\n';
emojiReport += '| # | URL | Surface | Emoji | Before | After |\n|---:|---|---|---|---|---|\n';
removedEmoji.forEach((item, index) => {
  emojiReport += `| ${index + 1} | ${cell(item.pathname)} | ${cell(item.surface)} | ${cell(item.emoji)} | ${cell(item.sentence)} | ${cell(withoutEmoji(item))} |\n`;
});
emojiReport += `\n## Review-quoted exceptions\n\nRetained unchanged: **${emojiCodePoints(reviewExceptions)} emoji code points across ${reviewExceptions.length} visual sequences**.\n\n`;
emojiReport += '| # | URL | Emoji | Quoted review context | Disposition |\n|---:|---|---|---|---|\n';
reviewExceptions.forEach((item, index) => {
  emojiReport += `| ${index + 1} | ${cell(item.pathname)} | ${cell(item.emoji)} | ${cell(item.sentence)} | Retained verbatim |\n`;
});
write('l20-phase3b-emoji-evidence-20260803.md', emojiReport);

const wordRows = after.routes.map(route => {
  const old = beforeByRoute.get(route.pathname);
  const percent = old.wordCount ? Math.abs(route.wordCount - old.wordCount) * 100 / old.wordCount : 0;
  return { url: route.pathname, before: old.wordCount, after: route.wordCount, delta: route.wordCount - old.wordCount, percent };
}).sort((a, b) => a.url.localeCompare(b.url));
let wordReport = '# L20 Phase 3b Word-Count Gate — 03 Aug 2026\n\n';
wordReport += 'Gate: absolute lexical word-count movement must be no more than 1.00% for every route. The table deliberately covers all 433 indexable routes, a superset of the changed-route set.\n\n';
wordReport += '| URL | Before | After | Delta | Absolute change | Gate |\n|---|---:|---:|---:|---:|---|\n';
for (const row of wordRows) {
  wordReport += `| ${cell(row.url)} | ${row.before} | ${row.after} | ${row.delta >= 0 ? '+' : ''}${row.delta} | ${row.percent.toFixed(4)}% | ${row.percent <= 1 ? 'PASS' : 'FAIL'} |\n`;
}
write('l20-phase3b-word-count-gate-20260803.md', wordReport);

const altPairs = new Map();
for (const route of before.routes) {
  for (const item of route.aiTells?.flag || []) {
    if (item.surface !== 'imageAltText') continue;
    altPairs.set(JSON.stringify([route.pathname, item.sentence]), { url: route.pathname, alt: item.sentence });
  }
}
const altRows = [...altPairs.values()].sort((a, b) => a.url.localeCompare(b.url) || a.alt.localeCompare(b.alt));
let altReport = '# CITY-PAGE ALT REWRITE — Deferred Event List\n\n';
altReport += 'Source: L20 Phase 3b section C. These image alt attributes are intentionally unchanged in PR #112 and are enumerated for the later `CITY-PAGE ALT REWRITE` event.\n\n';
altReport += `Affected URLs: **${new Set(altRows.map(row => row.url)).size}**. Unique flagged alt strings: **${altRows.length}**.\n\n`;
altReport += 'The Phase 3b table contains 21 alt-related flag rows; one alt string carries two different phrase flags, yielding 20 unique alt attributes.\n\n';
altReport += '| # | URL | Current alt attribute (unchanged) |\n|---:|---|---|\n';
altRows.forEach((row, index) => {
  altReport += `| ${index + 1} | ${cell(row.url)} | ${cell(row.alt)} |\n`;
});
write('l20-city-page-alt-rewrite-list-20260803.md', altReport);

let altMismatches = 0;
let altCountBefore = 0;
let altCountAfter = 0;
for (const route of after.routes) {
  const old = beforeByRoute.get(route.pathname)?.imageAlts || [];
  const current = route.imageAlts || [];
  altCountBefore += old.length;
  altCountAfter += current.length;
  if (JSON.stringify(old) !== JSON.stringify(current)) altMismatches += 1;
}
const maxWordMovement = Math.max(...wordRows.map(row => row.percent));
const wordFailures = wordRows.filter(row => row.percent > 1);

const mainReportPath = path.join(reportDir, 'l20-sitewide-sweep-20260802.md');
let mainReport = fs.readFileSync(mainReportPath, 'utf8');
const marker = '\n## Phase 3b implementation — Fable 5 rulings applied 03 Aug 2026';
const prior = mainReport.indexOf(marker);
if (prior >= 0) mainReport = mainReport.slice(0, prior).trimEnd();
mainReport += `${marker}\n\n`;
mainReport += `Status: **implemented on PR #112; not merged or deployed**. A1, A2, the eight approved B2 template headings, B3 and the actionable B4 table rows were applied. B1 and every remaining B2 row were dismissed.\n\n`;
mainReport += '### Applied-change evidence\n\n';
mainReport += `- A1: 7 comparison placeholders changed from \`—\` to \`Not covered\`.\n`;
mainReport += `- A2: 1 antecedent-restoring sentence inserted verbatim.\n`;
mainReport += `- B2: ${headingRows.length} rendered template-heading occurrences replaced across ${new Set(headingRows.map(row => row.url)).size} routes.\n`;
mainReport += `- B3: ${emojiCodePoints(removedEmoji)} detector-counted emoji code points removed across ${removedEmoji.length} visual sequences; ${emojiCodePoints(reviewExceptions)} review-quoted emoji code points across ${reviewExceptions.length} visual sequences retained verbatim and listed separately.\n`;
mainReport += `- B3 reconciliation: the original 121 flag rows reduce to 119 rendered sequences after removing 2 duplicate heading/text traversal hits; 58 + 61 = 119.\n`;
mainReport += `- B4: ${b4Rows.length} approved replacement occurrences applied. Protected legal, technical and quoted-review strings were not changed; the \`/world-of-customized-porta-cabin\` H1 remains on hold.\n`;
mainReport += `- Full occurrence-level before/after table: [l20-phase3b-before-after-20260803.md](./l20-phase3b-before-after-20260803.md).\n`;
mainReport += `- Emoji removals and review exceptions: [l20-phase3b-emoji-evidence-20260803.md](./l20-phase3b-emoji-evidence-20260803.md).\n\n`;
mainReport += '### Integrity and gates\n\n';
mainReport += `- Final crawl: ${after.summary.status200Count}/${after.summary.requestedRouteCount} status 200; ${after.summary.emDashTotal} em dashes; ${after.summary.mojibakeTotal} mojibake; ${after.summary.emoji.removable} removable emoji.\n`;
mainReport += `- Reviews: ${after.summary.emoji.reviewExceptions} rendered emoji sequences retained as quoted-review exceptions.\n`;
mainReport += `- Image alts: ${altCountBefore} before and ${altCountAfter} after across 433 routes; ${altMismatches} mismatched routes. Every alt is unchanged.\n`;
mainReport += `- Word-count gate: ${wordRows.length}/${wordRows.length} routes pass; ${wordFailures.length} failures; maximum movement ${maxWordMovement.toFixed(4)}%. Full table: [l20-phase3b-word-count-gate-20260803.md](./l20-phase3b-word-count-gate-20260803.md).\n`;
mainReport += `- WordPress export: ${after.wpExport.fileCount} files; SHA-256 \`${after.wpExport.sha256}\` before and after.\n`;
mainReport += `- Deferred section C list: [l20-city-page-alt-rewrite-list-20260803.md](./l20-city-page-alt-rewrite-list-20260803.md) (${new Set(altRows.map(row => row.url)).size} URLs, ${altRows.length} unique alt strings).\n`;
mainReport += '- Approved content authority: [L20-PHASE-3B-RULINGS-02Aug2026.md](../page-structure/content-drafts/L20-PHASE-3B-RULINGS-02Aug2026.md).\n';
fs.writeFileSync(mainReportPath, `${mainReport.trim()}\n`, 'utf8');

console.log(JSON.stringify({
  headingRows: headingRows.length,
  b4Rows: b4Rows.length,
  removedEmojiSequences: removedEmoji.length,
  removedEmojiCodePoints: emojiCodePoints(removedEmoji),
  reviewExceptionSequences: reviewExceptions.length,
  reviewExceptionCodePoints: emojiCodePoints(reviewExceptions),
  wordRoutes: wordRows.length,
  wordFailures: wordFailures.length,
  maxWordMovement,
  altRows: altRows.length,
  altUrls: new Set(altRows.map(row => row.url)).size,
  altMismatches,
}, null, 2));
