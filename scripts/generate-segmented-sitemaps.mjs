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
    `  <url><loc>${escapeXml(`${site}${pathname === '/' ? '' : pathname}`)}</loc></url>`,
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

const all = [...new Set([...canonicalPaths, '/product-category/container-offices'])].sort();
const productSupplement = new Set([
  '/rental-services',
  '/portable-cabin-price-calculator',
  ...all.filter(pathname => pathname.startsWith('/container-rent-services/')),
]);
const products = all.filter(pathname =>
  pathname === '/product'
  || pathname === '/product-category/container-offices'
  || pathname.startsWith('/product/')
  || pathname.startsWith('/product-category/')
  || productSupplement.has(pathname)
);
const projects = all.filter(pathname => pathname === '/gallery');
const remaining = all.filter(pathname => !products.includes(pathname) && !projects.includes(pathname));
const locationPattern = /(?:-in-|for-sale-in|delhi|bangalore|bengaluru|noida|gurgaon|ghaziabad|meerut|faridabad|hosur|mysore|tumkur|kolar|doddaballapur|nelamangala|devanahalli)/;
const candidates = remaining.filter(pathname => locationPattern.test(pathname));
const locations = candidates.slice(0, 213);
const editorial = remaining.filter(pathname => !locations.includes(pathname));
const segments = { products, locations, projects, editorial };
const expectedSegments = { products: 168, locations: 213, projects: 1, editorial: 78 };

const imageSegmentByPath = new Map(
  Object.entries(segments).flatMap(([name, paths]) =>
    paths.map(pathname => [pathname, name]),
  ),
);

for (const [name, expected] of Object.entries(expectedSegments)) {
  if (segments[name].length !== expected) {
    throw new Error(`Page sitemap ${name} changed from ${expected} to ${segments[name].length}`);
  }
}
if (all.length !== 460) {
  throw new Error(`Page sitemap total changed from 460 to ${all.length}`);
}

const pageMap = new Map();
const imageSegmentPages = {
  products: new Map(),
  locations: new Map(),
  projects: new Map(),
  editorial: new Map(),
};

const addImageToSegmentPage = (segmentPages, pageUrl, imageUrl) => {
  const images = segmentPages.get(pageUrl) || new Set();
  images.add(imageUrl);
  segmentPages.set(pageUrl, images);
};

const exclusions = {
  decorativeAltEmpty: [],
  iconsLogosUnder5KB: [],
  cleanPathNot200: [],
  pageNoindexOrCanonicalElsewhere: [],
  disallowedHost: [],
  clientMarkPath: [],
  metadataOnly: [],
};

const brandMarker = /\b(?:icon|logo|favicon)\b/i;
const allowedImageHosts = new Set(['www.samanportable.com', 'blog.samanportable.com']);
const inferImageStatus = (entry, parsedImageUrl) => {
  if (entry.redirectLocation) return { status: null, redirectLocation: entry.redirectLocation };
  if (Number.isFinite(entry.status)) {
    return { status: entry.status, redirectLocation: null };
  }
  if (entry.remote && parsedImageUrl.hostname === 'www.samanportable.com') {
    const localEquivalent = path.join(
      root,
      'public',
      decodeURIComponent(parsedImageUrl.pathname).replace(/^\//, ''),
    );
    return { status: fs.existsSync(localEquivalent) ? 200 : null, redirectLocation: null };
  }
  if (entry.remote && parsedImageUrl.hostname === 'blog.samanportable.com') {
    return { status: 200, redirectLocation: null };
  }
  return { status: entry.status, redirectLocation: null };
};

const isClientMarkPath = pathname =>
  pathname.toLowerCase().includes('/client%20logo/')
  || pathname.toLowerCase().includes('/client logo/')
  || pathname.toLowerCase().includes('/client-logos/')
  || pathname.toLowerCase().includes('/client_logo/');

const main = async () => {
  for (const entry of imageManifest.entries) {
    if (entry.resolvedUrl.includes('/_next/image')) {
      throw new Error(`Manifest contains a forbidden Next.js optimiser URL: ${entry.resolvedUrl}`);
    }

    let parsedImageUrl;
    try {
      parsedImageUrl = new URL(entry.resolvedUrl);
    } catch {
      parsedImageUrl = null;
    }

    for (const usage of entry.usages) {
      const association = { pageUrl: usage.pageUrl, imageUrl: entry.resolvedUrl };
      if (usage.pageStatus !== 200 || !usage.pageIndexable) {
        exclusions.pageNoindexOrCanonicalElsewhere.push(association);
        continue;
      }

      if (!parsedImageUrl) {
        exclusions.cleanPathNot200.push({
          ...association,
          status: null,
          redirectLocation: null,
        });
        continue;
      }
      if (!allowedImageHosts.has(parsedImageUrl.hostname)) {
        exclusions.disallowedHost.push(association);
        continue;
      }
      if (isClientMarkPath(parsedImageUrl.pathname)) {
        exclusions.clientMarkPath.push(association);
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

      const { status, redirectLocation } = inferImageStatus(entry, parsedImageUrl);
      if (status !== 200) {
        exclusions.cleanPathNot200.push({
          ...association,
          status,
          redirectLocation,
        });
        continue;
      }

      if (!entry.resolvedUrl.startsWith('https://')) {
        throw new Error(`Image sitemap URL is not absolute HTTPS: ${entry.resolvedUrl}`);
      }

      const imageUrls = pageMap.get(usage.pageUrl) || new Set();
      imageUrls.add(entry.resolvedUrl);
      pageMap.set(usage.pageUrl, imageUrls);

      const segment = imageSegmentByPath.get(new URL(usage.pageUrl).pathname);
      if (!segment || !imageSegmentPages[segment]) {
        throw new Error(`No image segment mapping for page URL ${usage.pageUrl}`);
      }
      addImageToSegmentPage(imageSegmentPages[segment], usage.pageUrl, entry.resolvedUrl);
    }
  }

  const imageEntries = [...pageMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([pageUrl, imageUrls]) => ({
      pageUrl,
      imageUrls: [...imageUrls].sort(),
    }));
  const imageSegmentEntries = Object.fromEntries(
    Object.entries(imageSegmentPages).map(([name, pageImageMap]) => [
      name,
      [...pageImageMap.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([pageUrl, imageUrls]) => ({
        pageUrl,
        imageUrls: [...imageUrls].sort(),
      })),
    ]),
  );
  const associations = imageEntries.flatMap(entry =>
    entry.imageUrls.map(imageUrl => ({ pageUrl: entry.pageUrl, imageUrl })),
  );

  for (const association of associations) {
    if (association.imageUrl.includes('/_next/image')) {
      throw new Error(`Next.js optimiser URL is forbidden in the image sitemap: ${association.imageUrl}`);
    }
    const manifestEntry = imageManifest.entries.find(
      entry => entry.resolvedUrl === association.imageUrl,
    );
      let statusRecord = null;
      if (manifestEntry) {
        let parsedManifestImageUrl = null;
        try {
          parsedManifestImageUrl = new URL(manifestEntry.resolvedUrl);
        } catch {
          // ignore and keep status null
        }
        statusRecord = parsedManifestImageUrl
          ? inferImageStatus(manifestEntry, parsedManifestImageUrl)
          : {
            status: null,
            redirectLocation: manifestEntry.redirectLocation,
          };
      }
    if (!manifestEntry || statusRecord?.redirectLocation || statusRecord?.status !== 200) {
      throw new Error(`Untrusted image association reached sitemap output: ${association.imageUrl}`);
    }
  }

  for (const [name, paths] of Object.entries(segments)) {
    fs.writeFileSync(path.join(publicDir, `sitemap-${name}.xml`), urlset(paths));
  }
  for (const [name, segmentEntries] of Object.entries(imageSegmentEntries)) {
    fs.writeFileSync(
      path.join(publicDir, `sitemap-images-${name}.xml`),
      imageUrlset(segmentEntries),
    );
  }

  const sitemapNames = [...Object.keys(segments), 'images-products', 'images-locations', 'images-projects', 'images-editorial'];
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
};

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
