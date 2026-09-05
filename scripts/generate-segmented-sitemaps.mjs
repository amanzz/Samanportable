import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');
const { tryToParsePath } = require('next/dist/lib/try-to-parse-path');

const root = process.cwd();
const publicDir = path.join(root, 'public');
const site = 'https://www.samanportable.com';
const manifestPath = path.join(publicDir, 'image-manifest.json');
const canonicalPaths = JSON.parse(
  fs.readFileSync(path.join(root, 'src/lib/sitemapCanonicalPaths.json'), 'utf8'),
);
const temporarilyGatedCommercialPaths = new Set(
  JSON.parse(
    fs.readFileSync(path.join(root, 'src/data/seo/unapprovedCommercialGating.json'), 'utf8'),
  ).paths,
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

const all = [...new Set(canonicalPaths)]
  .filter(pathname => !pathname.startsWith('/product-category/'))
  .filter(pathname => !temporarilyGatedCommercialPaths.has(pathname))
  .sort();
const productSupplement = new Set([
  '/rental-services',
  '/portable-cabin-price-calculator',
  '/cabin-cost-calculator',
  ...all.filter(pathname => pathname.startsWith('/container-rent-services/')),
]);
const products = all.filter(pathname =>
  pathname === '/product'
  || pathname.startsWith('/product/')
  || productSupplement.has(pathname)
);
const projects = all.filter(pathname => pathname === '/gallery');
const remaining = all.filter(pathname => !products.includes(pathname) && !projects.includes(pathname));
const locationPattern = /(?:-in-|for-sale-in|delhi|bangalore|bengaluru|noida|gurgaon|ghaziabad|meerut|faridabad|hosur|mysore|tumkur|kolar|doddaballapur|nelamangala|devanahalli)/;
const candidates = remaining.filter(pathname => locationPattern.test(pathname));
const locations = candidates.slice(0, 213);
const editorial = remaining.filter(pathname => !locations.includes(pathname));
const unfilteredSegments = { products, locations, projects, editorial };
// Phase 1 Porta Cabin redirect consolidation (SAMAN approval, 15 Aug 2026):
// products 162 -> 144, editorial 79 -> 78.
//
// Nineteen paths leave sitemapCanonicalPaths.json across this release, not
// eighteen. Eighteen are Phase 1 retired sources: the five P0 variant pages, the
// eleven Portable Cabin product pages, /product/prefabricated-houses/portable-cabin-house,
// and /cheap-porta-cabins-for-sale, which is the single editorial removal. Every one
// of them now 301s, and a sitemap must never advertise a redirect.
//
// The nineteenth is /portable-cabin-price-calculator, dropped by the calculator
// parity commit in this same release when that route went noindex. That commit did
// not bump these guards, so it carried the exact PC-07 defect described below and
// would have failed the postbuild on its own. The Phase 1 build caught it. Both
// movements are folded into the numbers here.
//
// Phase 2 local doorway cleanup (SAMAN approval, 15 Aug 2026): locations
// 213 -> 196, editorial 78 -> 65, total 436 -> 406. Thirty local paths leave
// sitemapCanonicalPaths.json: 11 that now 301 to the hub, and 19 that stay live
// on `noindex, follow`. A sitemap must advertise neither a redirect nor a
// noindex URL.
//
// Note the locations cap above stops binding at this size. `candidates` is now
// 196, below the 213 slice, so every location candidate lands in the locations
// segment and none spills into editorial. That is why editorial falls by 13
// while only 8 of the 30 removed paths were editorial: the other 5 of the drop
// is spill that no longer happens. Do not "fix" this by raising the cap.
//
// Sitemap inclusion for the four held pages (SAMAN approval, 16 Aug 2026):
// products 144 -> 148. double-story-porta-cabin, fire-rated-porta-cabin,
// soundproof-porta-cabin and skid-mounted-porta-cabin were built and routable
// but deliberately excluded from sitemapCanonicalPaths.json pending this exact
// ruling (see the PC-07/PR #132 note above this file already carries). All
// four re-verified 200/self-canonical/index,follow immediately before this
// change. No content, title, H1, redirect, calculator, rental or size change
// rides with this commit - sitemap inclusion only.
// SEO-006 remediation: six verified live approved pages joined the product and
// image sitemap crawl set. RB-01C then adds published Expandable Container
// Office and removes the two draft roofing-sheet pages, a net product change
// of minus one. Accommodation Container remains held as draft and excluded.
// Temporary containment removes every gated path that is still present in the
// canonical input. Three gated draft/legacy paths were already absent, leaving
// 94 product candidates before redirect-source exclusion.
// PO-04 (5 Sep 2026): products 94 -> 95, +1 for
// /product/portable-office/executive-portable-office, which this release publishes
// and adds to sitemapCanonicalPaths.json in the same commit (the PC-07 incident
// noted below is why the guard moves with the canonical-paths entry, not after it).
// PO-03 (5 Sep 2026): products 95 -> 96 for /product/portable-office/portable-weighbridge-office,
// published in this commit and added to sitemapCanonicalPaths.json in the same commit (Ruling 6).
// Both this guard and the total below move with it - see the PC-07 / PR #132 incident note below.
const expectedSegments = { products: 96, locations: 196, projects: 1, editorial: 65 };

const redirectEntries = await nextConfig.redirects();
const redirectMatchers = redirectEntries
  .filter(entry =>
    entry
    && typeof entry.source === 'string'
    && !entry.has
    && !entry.missing
  )
  .map(entry => {
    const parsed = tryToParsePath(entry.source);
    if (parsed.error || !parsed.regexStr) {
      throw new Error(`Could not parse redirect source ${entry.source}`);
    }
    return { entry, regex: new RegExp(parsed.regexStr) };
  });

const redirectRuleByPath = new Map(
  all.flatMap(pathname => {
    const match = redirectMatchers.find(({ regex }) => regex.test(pathname));
    return match ? [[pathname, match.entry]] : [];
  }),
);
const segments = Object.fromEntries(
  Object.entries(unfilteredSegments).map(([name, paths]) => [
    name,
    paths.filter(pathname => !redirectRuleByPath.has(pathname)),
  ]),
);

const imageSegmentByPath = new Map(
  Object.entries(segments).flatMap(([name, paths]) =>
    paths.map(pathname => [pathname, name]),
  ),
);

for (const [name, expected] of Object.entries(expectedSegments)) {
  if (unfilteredSegments[name].length !== expected) {
    throw new Error(`Page sitemap ${name} changed from ${expected} to ${unfilteredSegments[name].length}`);
  }
}
// 453 = 452 before PC-02, +1 for /product/porta-cabins/gi-porta-cabin, which
// Ruling 6 (14 Aug 2026) puts in the sitemap in this deploy rather than leaving
// the new page to organic discovery. The products segment moves 159 -> 160 with
// it. Earlier note, still true: both sides of an old merge independently wrote
// 451 here for different pages, so git merged the literal cleanly and silently
// left it one short, and the segment gates above are what caught it.
// 454 = 453 before PC-07, +1 for /product/porta-cabins/puf-porta-cabin, same
// Ruling 6 basis. The products segment moves 160 -> 161 with it.
//
// 455 = 454 before PC-09, +1 for /product/porta-cabins/knock-down-porta-cabin,
// same Ruling 6 basis. The products segment moves 161 -> 162 with it. Bumped
// in the same commit as the canonical-paths addition this time, not as a
// follow-up hotfix (PC-07 shipped the sitemapCanonicalPaths.json entry without
// moving this guard, which correctly failed the DO postbuild and needed
// PR #132 to fix - see that PR for the incident).
//
// double-story-porta-cabin, soundproof-porta-cabin, fire-rated-porta-cabin and
// skid-mounted-porta-cabin were built and routable but deliberately held out of
// sitemapCanonicalPaths.json pending an owner ruling - resolved 16 Aug 2026,
// see the expectedSegments note above. Kept here so the "why 406 before, why
// 410 now" history stays in one place rather than needing the git log.
// 436 = 455 minus the 19 paths this release removes from sitemapCanonicalPaths.json:
// 18 Phase 1 retired sources plus /portable-cabin-price-calculator from the calculator
// parity commit. See the expectedSegments note above for the breakdown.
// 406 = 436 minus the 30 local paths removed by the Phase 2 cleanup (11 redirected,
// 19 noindex). See the expectedSegments note above for the segment breakdown.
// 410 = 406 plus the four porta-cabin pages this commit adds to the sitemap.
// 357 = 356 plus /product/portable-office/executive-portable-office (PO-04).
// 358 = 357 plus /product/portable-office/portable-weighbridge-office (PO-03).
if (all.length !== 358) {
  throw new Error(`Page sitemap total changed from 358 to ${all.length}`);
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
  redirectingPage: [],
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
      const usagePathname = new URL(usage.pageUrl).pathname;
      if (redirectRuleByPath.has(usagePathname)) {
        exclusions.redirectingPage.push(association);
        continue;
      }
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
      if (!usage.rendered && !usage.inSchema && !usage.publishedVariant) {
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
    indexedTotal: Object.values(segments).reduce((sum, paths) => sum + paths.length, 0),
    redirectExclusions: [...redirectRuleByPath.entries()].map(([pathname, entry]) => ({
      pathname,
      source: entry.source,
      destination: entry.destination,
    })),
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
