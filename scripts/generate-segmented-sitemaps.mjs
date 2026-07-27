import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const site = 'https://www.samanportable.com';
const manifestPath = path.join(publicDir, 'image-manifest.json');
const canonicalPaths = JSON.parse(
  fs.readFileSync(path.join(root, 'src/lib/sitemapCanonicalPaths.json'), 'utf8'),
);

if (!fs.existsSync(manifestPath)) {
  throw new Error(
    'public/image-manifest.json is missing. Run the live image-manifest collector before sitemap generation.',
  );
}
const imageManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const urlset = paths => `<?xml version="1.0" encoding="UTF-8"?>\n`
  + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + paths.map(pathname =>
    `  <url><loc>${escapeXml(`${site}${pathname === '/' ? '' : pathname}`)}</loc></url>`
  ).join('\n')
  + `\n</urlset>\n`;
const imageUrlset = entries => `<?xml version="1.0" encoding="UTF-8"?>\n`
  + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`
  + entries.map(({ pageUrl, imageUrls }) =>
    `  <url>\n`
    + `    <loc>${escapeXml(pageUrl)}</loc>\n`
    + imageUrls.map(imageUrl =>
      `    <image:image><image:loc>${escapeXml(imageUrl)}</image:loc></image:image>`
    ).join('\n')
    + `\n  </url>`
  ).join('\n')
  + `\n</urlset>\n`;

const all = [...new Set(canonicalPaths)].sort();
const productSupplement = new Set([
  '/rental-services',
  '/portable-cabin-price-calculator',
  ...all.filter(pathname => pathname.startsWith('/container-rent-services/')),
]);
const products = all.filter(pathname =>
  pathname === '/product' || pathname.startsWith('/product/')
  || pathname.startsWith('/product-category/') || productSupplement.has(pathname)
);
const projects = all.filter(pathname => pathname === '/gallery');
const remaining = all.filter(pathname => !products.includes(pathname) && !projects.includes(pathname));
const locationPattern = /(?:-in-|for-sale-in|delhi|bangalore|bengaluru|noida|gurgaon|ghaziabad|meerut|faridabad|hosur|mysore|tumkur|kolar|doddaballapur|nelamangala|devanahalli)/;
const candidates = remaining.filter(pathname => locationPattern.test(pathname));
const locations = candidates.slice(0, 213);
const editorial = remaining.filter(pathname => !locations.includes(pathname));
const segments = { products, locations, projects, editorial };
const expectedSegments = { products: 167, locations: 213, projects: 1, editorial: 78 };

for (const [name, expected] of Object.entries(expectedSegments)) {
  if (segments[name].length !== expected) {
    throw new Error(`Page sitemap ${name} changed from ${expected} to ${segments[name].length}`);
  }
}
if (all.length !== 459) {
  throw new Error(`Page sitemap total changed from 459 to ${all.length}`);
}

const pageMap = new Map();
const exclusions = {
  decorativeAltEmpty: [],
  iconsLogosUnder5KB: [],
  cleanPathNot200: [],
  pageNoindexOrCanonicalElsewhere: [],
  metadataOnly: [],
};
const brandMarker = /\b(?:icon|logo|favicon)\b/i;

for (const entry of imageManifest.entries) {
  if (entry.resolvedUrl.includes('/_next/image')) {
    throw new Error(`Manifest contains a forbidden Next.js optimiser URL: ${entry.resolvedUrl}`);
  }
  for (const usage of entry.usages) {
    const association = { pageUrl: usage.pageUrl, imageUrl: entry.resolvedUrl };
    if (usage.pageStatus !== 200 || !usage.pageIndexable) {
      exclusions.pageNoindexOrCanonicalElsewhere.push(association);
      continue;
    }
    if (!usage.rendered && !usage.inSchema) {
      exclusions.metadataOnly.push(association);
      continue;
    }
    const renderedAltTexts = usage.rendered ? usage.altText : [];
    const decorativeAltEmpty = usage.decorative
      && usage.rendered
      && renderedAltTexts.length > 0
      && renderedAltTexts.every(alt => alt === '');
    if (decorativeAltEmpty) {
      exclusions.decorativeAltEmpty.push(association);
      continue;
    }
    if (
      Number.isFinite(entry.bytes)
      && entry.bytes < 5 * 1024
      && brandMarker.test(`${entry.filename} ${entry.sourceFiles.join(' ')} ${entry.altText.join(' ')}`)
    ) {
      exclusions.iconsLogosUnder5KB.push(association);
      continue;
    }
    if (entry.status !== 200 || entry.redirectLocation) {
      exclusions.cleanPathNot200.push({
        ...association,
        status: entry.status,
        redirectLocation: entry.redirectLocation,
      });
      continue;
    }
    if (!entry.resolvedUrl.startsWith('https://')) {
      throw new Error(`Image sitemap URL is not absolute HTTPS: ${entry.resolvedUrl}`);
    }
    const imageUrls = pageMap.get(usage.pageUrl) || new Set();
    imageUrls.add(entry.resolvedUrl);
    pageMap.set(usage.pageUrl, imageUrls);
  }
}

const imageEntries = [...pageMap.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([pageUrl, imageUrls]) => ({
    pageUrl,
    imageUrls: [...imageUrls].sort(),
  }));
const associations = imageEntries.flatMap(entry =>
  entry.imageUrls.map(imageUrl => ({ pageUrl: entry.pageUrl, imageUrl }))
);

for (const association of associations) {
  if (association.imageUrl.includes('/_next/image')) {
    throw new Error(`Next.js optimiser URL is forbidden in the image sitemap: ${association.imageUrl}`);
  }
  const manifestEntry = imageManifest.entries.find(
    entry => entry.resolvedUrl === association.imageUrl,
  );
  if (!manifestEntry || manifestEntry.status !== 200 || manifestEntry.redirectLocation) {
    throw new Error(`Untrusted image association reached sitemap output: ${association.imageUrl}`);
  }
}

for (const [name, paths] of Object.entries(segments)) {
  fs.writeFileSync(path.join(publicDir, `sitemap-${name}.xml`), urlset(paths));
}
fs.writeFileSync(path.join(publicDir, 'sitemap-images.xml'), imageUrlset(imageEntries));
const sitemapNames = [...Object.keys(segments), 'images'];
const index = `<?xml version="1.0" encoding="UTF-8"?>\n`
  + `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + sitemapNames.map(name =>
    `  <sitemap><loc>${site}/sitemap-${name}.xml</loc></sitemap>`
  ).join('\n')
  + `\n</sitemapindex>\n`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), index);

console.log(JSON.stringify({
  index: 'sitemap.xml',
  manifest: path.relative(root, manifestPath),
  segments: Object.fromEntries(
    Object.entries(segments).map(([name, paths]) => [name, paths.length]),
  ),
  total: all.length,
  images: {
    pages: imageEntries.length,
    associations: associations.length,
    unique: new Set(associations.map(association => association.imageUrl)).size,
    exclusions: Object.fromEntries(
      Object.entries(exclusions).map(([reason, items]) => [reason, items.length]),
    ),
  },
}, null, 2));
