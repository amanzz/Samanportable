#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const BASE_URL = process.argv.find((arg) => arg.startsWith('--base-url='))?.slice(11)
  || 'http://127.0.0.1:3111';
const MANIFEST = path.join(
  ROOT,
  'page-structure/content-drafts/C08-IMAGE-ALT-MANIFEST-180-02Aug2026.md',
);
const SITEMAP = fs.readFileSync(path.join(ROOT, 'public/sitemap-images-products.xml'), 'utf8');
const PRODUCT_TERMS = {
  'container-houses': 'container house',
  'prefab-container-homes': 'prefab container home',
  'luxury-container-houses': 'luxury container house',
  'shipping-container-homes': 'shipping container home',
  'affordable-container-homes': 'affordable container home',
};

function invariant(value, message) {
  if (!value) throw new Error(message);
}

function parseManifest() {
  const manifestText = fs.readFileSync(MANIFEST, 'utf8');
  const rows = [];
  let slug;
  let sizeSlug;
  for (const line of manifestText.split(/\r?\n/)) {
    if (line.startsWith('## ')) {
      const route = line.match(/(\/product\/container-houses(?:\/[a-z0-9-]+)?)\s*$/);
      if (route) {
        slug = route[1].replace(/\/$/, '').split('/').at(-1);
        sizeSlug = undefined;
      }
      continue;
    }
    const size = line.match(/^### (\d+)x(\d+) ft$/);
    if (size && slug) {
      sizeSlug = `${size[1]}x${size[2]}`;
      continue;
    }
    const row = line.match(/^\| ([EI]\d\d) \| ([^|]+) \| ([^|]+) \|$/);
    if (row) {
      invariant(slug && sizeSlug, `Incomplete manifest context: ${line}`);
      rows.push({
        slug,
        sizeSlug,
        sourceViewToken: row[1],
        filename: row[2].trim(),
        alt: row[3].trim(),
      });
    }
  }

  const amendments = [...manifestText.matchAll(/<!-- C08_ALT_AMENDMENT (\{.*?\}) -->/g)]
    .map((match) => JSON.parse(match[1]));
  for (const amendment of amendments) {
    const matches = rows.filter((row) =>
      row.slug === amendment.slug
      && row.sizeSlug === amendment.sizeSlug
      && row.sourceViewToken === amendment.sourceViewToken
      && row.filename === amendment.filename);
    invariant(matches.length === 1,
      `Manifest amendment target must resolve once: ${amendment.slug}/${amendment.sizeSlug}/${amendment.sourceViewToken}`);
    invariant(matches[0].alt === amendment.originalAlt,
      `Manifest amendment original alt does not match the retained row: ${amendment.filename}`);
    matches[0].alt = amendment.supersedingAlt;
  }
  return rows;
}

function strippedDescription(row) {
  return row.alt
    .replace(new RegExp(PRODUCT_TERMS[row.slug], 'ig'), '')
    .replace(new RegExp(`\\b${row.sizeSlug}\\s*ft\\b`, 'ig'), '')
    .replace(/\s+/g, ' ')
    .replace(/^[ ,.-]+|[ ,.-]+$/g, '')
    .toLocaleLowerCase('en');
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
  return match?.[1]
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function routeFor(slug) {
  return slug === 'container-houses'
    ? '/product/container-houses'
    : `/product/container-houses/${slug}`;
}

function walkFiles(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walkFiles(absolute, output);
    else output.push(absolute);
  }
  return output;
}

const manifestRows = parseManifest();
invariant(manifestRows.length === 180, `Expected 180 manifest rows, found ${manifestRows.length}`);
invariant(new Set(manifestRows.map((row) => row.filename)).size === 180, 'Filename uniqueness failed');
invariant(new Set(manifestRows.map((row) => row.alt)).size === 180, 'Alt uniqueness failed');

const publicBasenames = new Map();
for (const file of walkFiles(path.join(ROOT, 'public/images'))) {
  const basename = path.basename(file).toLocaleLowerCase('en');
  publicBasenames.set(basename, (publicBasenames.get(basename) || 0) + 1);
}
for (const row of manifestRows) {
  invariant(publicBasenames.get(row.filename.toLocaleLowerCase('en')) === 1,
    `${row.filename}: expected one site-wide file`);
}

const reports = [];
let brokenRequests = 0;
for (const slug of Object.keys(PRODUCT_TERMS)) {
  const rows = manifestRows.filter((row) => row.slug === slug);
  const product = JSON.parse(fs.readFileSync(path.join(ROOT, `src/data/products/${slug}.json`), 'utf8'));
  const dataImages = product.variants.flatMap((variant) => variant.images || []);
  const expectedPaths = rows.map((row) => `/images/products/${slug}/${row.sizeSlug}/${row.filename}`);
  const expectedAlts = rows.map((row) => row.alt);
  invariant(dataImages.length === 36, `${slug}: expected 36 data images`);
  invariant(JSON.stringify(dataImages.map((image) => image.src)) === JSON.stringify(expectedPaths),
    `${slug}: source order differs from manifest`);
  invariant(JSON.stringify(dataImages.map((image) => image.alt)) === JSON.stringify(expectedAlts),
    `${slug}: alt order differs from manifest`);

  for (const sizeSlug of ['20x8', '20x10', '20x12', '40x8', '40x10', '40x12']) {
    const sizeRows = rows.filter((row) => row.sizeSlug === sizeSlug);
    invariant(sizeRows.length === 6, `${slug}/${sizeSlug}: expected six images`);
    invariant(sizeRows.filter((row) => row.sourceViewToken.startsWith('E')).length === 3,
      `${slug}/${sizeSlug}: exterior count failed`);
    invariant(sizeRows.filter((row) => row.sourceViewToken.startsWith('I')).length === 3,
      `${slug}/${sizeSlug}: interior count failed`);
  }

  const response = await fetch(`${BASE_URL}${routeFor(slug)}`);
  invariant(response.status === 200, `${slug}: page returned ${response.status}`);
  const html = await response.text();
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  invariant(nextDataMatch, `${slug}: __NEXT_DATA__ missing`);
  const nextData = JSON.parse(nextDataMatch[1]);
  const renderedVariant = nextData.props.pageProps.variantData;
  const renderedImages = renderedVariant.variants.flatMap((variant) => variant.images || []);
  invariant(JSON.stringify(renderedImages.map((image) => image.src)) === JSON.stringify(expectedPaths),
    `${slug}: built DOM source order differs from manifest`);
  invariant(JSON.stringify(renderedImages.map((image) => image.alt)) === JSON.stringify(expectedAlts),
    `${slug}: built DOM alt order differs from manifest`);
  invariant(nextData.props.pageProps.product.images.length === 36,
    `${slug}: serialized product gallery is not 36 images`);

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  const itemPage = schemas.find((schema) => schema['@type'] === 'ItemPage');
  invariant(itemPage?.mainEntity?.image?.length === 36, `${slug}: Product schema is not 36 images`);
  invariant(JSON.stringify(itemPage.mainEntity.image) === JSON.stringify(expectedPaths),
    `${slug}: Product schema images differ from manifest`);

  const defaultVariant = renderedVariant.variants.find(
    (variant) => variant.sizeSlug === renderedVariant.defaultVariant,
  );
  const defaultRows = rows.filter((row) => row.sizeSlug === renderedVariant.defaultVariant);
  const defaultHero = defaultVariant.images[0].src;
  const imageTags = [...html.matchAll(/<img\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => attr(tag, 'src')?.includes(`/images/products/${slug}/`));
  invariant(imageTags.length === 7, `${slug}: expected one hero and six thumbnails, found ${imageTags.length}`);
  invariant(attr(imageTags[0], 'src') === defaultHero, `${slug}: row-one hero is not first`);
  invariant(attr(imageTags[0], 'loading') !== 'lazy', `${slug}: first hero is lazy`);
  invariant(attr(imageTags[0], 'fetchpriority') === 'high', `${slug}: first hero lacks high priority`);
  invariant(imageTags.slice(1).every((tag) => attr(tag, 'loading') === 'lazy'),
    `${slug}: a thumbnail is not lazy`);
  invariant(JSON.stringify(imageTags.slice(1).map((tag) => attr(tag, 'src')))
    === JSON.stringify(defaultVariant.images.map((image) => image.src)),
  `${slug}: thumbnail order differs from manifest`);
  invariant(imageTags.every((tag) => {
    const image = dataImages.find((candidate) => candidate.src === attr(tag, 'src'));
    return image?.alt === attr(tag, 'alt');
  }), `${slug}: a rendered image alt is not byte-exact`);
  invariant(html.includes(`<link rel="preload" href="${defaultHero}" as="image" fetchpriority="high"/>`),
    `${slug}: default hero preload missing`);
  invariant(html.includes('grid grid-cols-6 gap-2'), `${slug}: six-column thumbnail grid missing`);

  const absoluteDefaultHero = `https://www.samanportable.com${defaultHero}`;
  invariant(html.includes(`<meta property="og:image" content="${absoluteDefaultHero}"/>`),
    `${slug}: Open Graph image is not the approved default hero`);
  invariant(html.includes(`<meta name="twitter:image" content="${absoluteDefaultHero}"/>`),
    `${slug}: Twitter image is not the approved default hero`);

  const sitemapBlock = SITEMAP.match(
    new RegExp(`<loc>https://www\\.samanportable\\.com${routeFor(slug)}</loc>([\\s\\S]*?)</url>`),
  )?.[1] || '';
  const sitemapApproved = expectedPaths.filter((imagePath) => sitemapBlock.includes(imagePath));
  invariant(sitemapApproved.length === 36, `${slug}: image sitemap does not contain all 36 images`);

  const requestResults = await Promise.all(expectedPaths.map(async (imagePath) => {
    const imageResponse = await fetch(`${BASE_URL}${imagePath}`);
    const payload = new Uint8Array(await imageResponse.arrayBuffer());
    const isWebp = String.fromCharCode(...payload.slice(0, 4)) === 'RIFF'
      && String.fromCharCode(...payload.slice(8, 12)) === 'WEBP';
    return imageResponse.status === 200
      && imageResponse.headers.get('content-type')?.startsWith('image/webp')
      && isWebp;
  }));
  brokenRequests += requestResults.filter((passed) => !passed).length;

  reports.push({
    slug,
    route: routeFor(slug),
    status: response.status,
    images: renderedImages.length,
    distinctFilenames: new Set(renderedImages.map((image) => path.basename(image.src))).size,
    distinctAlts: new Set(renderedImages.map((image) => image.alt)).size,
    distinctStrippedDescriptions: new Set(rows.map(strippedDescription)).size,
    perSize: Object.fromEntries(['20x8', '20x10', '20x12', '40x8', '40x10', '40x12']
      .map((sizeSlug) => [sizeSlug, { images: 6, exterior: 3, interior: 3 }])),
    renderedImageTags: imageTags.length,
    eagerHeroes: imageTags.filter((tag) => attr(tag, 'loading') !== 'lazy').length,
    lazyThumbnails: imageTags.filter((tag) => attr(tag, 'loading') === 'lazy').length,
    approvedSitemapImages: sitemapApproved.length,
    brokenImageRequests: requestResults.filter((passed) => !passed).length,
  });
}

invariant(brokenRequests === 0, `Broken image requests: ${brokenRequests}`);
console.log(JSON.stringify({
  baseUrl: BASE_URL,
  manifestRows: manifestRows.length,
  uniqueFilenamesSitewide: new Set(manifestRows.map((row) => row.filename)).size,
  uniqueAltsSitewide: new Set(manifestRows.map((row) => row.alt)).size,
  uniqueStrippedDescriptionsSitewide: new Set(manifestRows.map(strippedDescription)).size,
  brokenImageRequests: brokenRequests,
  pages: reports,
}, null, 2));
