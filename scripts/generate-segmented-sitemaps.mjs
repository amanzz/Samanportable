import fs from 'node:fs';
import path from 'node:path';
import canonicalPaths from '../src/lib/sitemapCanonicalPaths.json' with { type: 'json' };

const root = process.cwd();
const publicDir = path.join(root, 'public');
const site = 'https://www.samanportable.com';
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const urlset = paths => `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paths.map(pathname => `  <url><loc>${escapeXml(`${site}${pathname === '/' ? '' : pathname}`)}</loc></url>`).join('\n') +
  `\n</urlset>\n`;

const all = [...new Set(canonicalPaths)].sort();
const productSupplement = new Set([
  '/rental-services',
  '/portable-cabin-price-calculator',
  ...all.filter(pathname => pathname.startsWith('/container-rent-services/')),
]);
const products = all.filter(pathname =>
  pathname === '/product' || pathname.startsWith('/product/') ||
  pathname.startsWith('/product-category/') || productSupplement.has(pathname)
);
const projects = all.filter(pathname => pathname === '/gallery');
const remaining = all.filter(pathname => !products.includes(pathname) && !projects.includes(pathname));
const locationPattern = /(?:-in-|for-sale-in|delhi|bangalore|bengaluru|noida|gurgaon|ghaziabad|meerut|faridabad|hosur|mysore|tumkur|kolar|doddaballapur|nelamangala|devanahalli)/;
const candidates = remaining.filter(pathname => locationPattern.test(pathname));
const locations = candidates.slice(0, 213);
const editorial = remaining.filter(pathname => !locations.includes(pathname));
const segments = { products, locations, projects, editorial };

for (const [name, paths] of Object.entries(segments)) {
  fs.writeFileSync(path.join(publicDir, `sitemap-${name}.xml`), urlset(paths));
}
const index = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  Object.keys(segments).map(name => `  <sitemap><loc>${site}/sitemap-${name}.xml</loc></sitemap>`).join('\n') +
  `\n</sitemapindex>\n`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), index);

const robotsPath = path.join(publicDir, 'robots.txt');
const robots = fs.readFileSync(robotsPath, 'utf8')
  .split(/\r?\n/)
  .filter(line => !/^Sitemap:/i.test(line))
  .join('\n').replace(/\s+$/, '');
fs.writeFileSync(robotsPath, `${robots}\n\nSitemap: ${site}/sitemap.xml\n`);

console.log(JSON.stringify({
  index: 'sitemap.xml',
  segments: Object.fromEntries(Object.entries(segments).map(([name, paths]) => [name, paths.length])),
  total: Object.values(segments).reduce((sum, paths) => sum + paths.length, 0),
  unique: new Set(Object.values(segments).flat()).size,
}, null, 2));
