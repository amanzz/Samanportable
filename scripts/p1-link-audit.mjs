// P1 internal-link audit: extract every <a href> from each of the 11 approved
// pages' descriptionHtml (the "main description" body), classify hub/sibling/
// other, and flag risky anchors (exact-match, repeated, wrong-cluster).
import fs from 'node:fs';

const PAGES = [
  ['porta-cabins', 'Porta Cabins (hub)'],
  ['ms-porta-cabin', 'MS Porta Cabin'],
  ['gi-porta-cabin', 'GI Porta Cabin'],
  ['double-story-porta-cabin', 'Double Story Porta Cabin'],
  ['porta-cabin-with-toilet', 'Porta Cabin with Toilet'],
  ['fire-rated-porta-cabin', 'Fire-Rated Porta Cabin'],
  ['soundproof-porta-cabin', 'Soundproof Porta Cabin'],
  ['puf-porta-cabin', 'PUF Porta Cabin'],
  ['skid-mounted-porta-cabin', 'Skid-Mounted Porta Cabin'],
  ['knock-down-porta-cabin', 'Knock-Down Porta Cabin'],
  ['porta-cabin-shop', 'Porta Cabin Shop'],
];
const HUB = '/product/porta-cabins';
const SIBLING_PATHS = new Set(PAGES.filter(([s]) => s !== 'porta-cabins').map(([s]) => `/product/porta-cabins/${s}`));

const report = [];
for (const [slug, name] of PAGES) {
  const d = JSON.parse(fs.readFileSync(`src/data/products/${slug}.json`, 'utf8'));
  const html = d.descriptionHtml || '';
  const links = [...html.matchAll(/<a\s+href="([^"]*)"[^>]*>([^<]*)<\/a>/g)].map((m) => ({ href: m[1], anchor: m[2] }));
  const ownPath = slug === 'porta-cabins' ? HUB : `/product/porta-cabins/${slug}`;
  const hasHubLink = links.some((l) => l.href.endsWith(HUB) || l.href === 'https://www.samanportable.com/product/porta-cabins');
  const siblingLinks = links.filter((l) => {
    const path = l.href.replace('https://www.samanportable.com', '');
    return SIBLING_PATHS.has(path) && path !== ownPath;
  });
  const otherLinks = links.filter((l) => {
    const path = l.href.replace('https://www.samanportable.com', '');
    return path !== HUB && !SIBLING_PATHS.has(path);
  });
  report.push({ slug, name, ownPath, totalLinks: links.length, hasHubLink, siblingLinks, otherLinks, allLinks: links });
}

console.log('| Page | Links | Hub link? | Sibling links | Other links |');
console.log('|---|---|---|---|---|');
for (const r of report) {
  console.log(`| ${r.name} | ${r.totalLinks} | ${r.hasHubLink ? 'YES' : '**NO**'} | ${r.siblingLinks.map((l) => l.anchor).join('; ') || '(none)'} | ${r.otherLinks.map((l) => l.anchor + ' -> ' + l.href.replace('https://www.samanportable.com', '')).join('; ') || '(none)'} |`);
}

console.log('\n=== full detail per page ===\n');
for (const r of report) {
  console.log(`--- ${r.name} (${r.ownPath}) ---`);
  if (r.allLinks.length === 0) console.log('  (zero links in descriptionHtml)');
  for (const l of r.allLinks) console.log(`  "${l.anchor}" -> ${l.href}`);
  console.log('');
}

// anchor-text repetition check across the whole cluster
const anchorCount = new Map();
for (const r of report) for (const l of r.allLinks) {
  const key = l.anchor.toLowerCase().trim();
  anchorCount.set(key, (anchorCount.get(key) || 0) + 1);
}
console.log('=== anchor text used more than once across the cluster ===');
for (const [anchor, n] of anchorCount) if (n > 1) console.log(`  "${anchor}" used ${n} times`);

fs.writeFileSync('scripts/p1-link-audit-report.json', JSON.stringify(report, null, 1));
