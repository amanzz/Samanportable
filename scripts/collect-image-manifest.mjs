import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const site = 'https://www.samanportable.com';
const imageExtensions = new Set(['.webp', '.jpg', '.jpeg', '.png', '.svg']);
const sourceRoots = [
  'src/data/products',
  'src/data/wp-export',
  'src/components',
  'src/pages',
  'src/config',
  'src/lib',
];
const canonicalPaths = JSON.parse(
  fs.readFileSync(path.join(root, 'src/lib/sitemapCanonicalPaths.json'), 'utf8'),
);
const outputArgument = process.argv.find(argument => argument.startsWith('--output='));
const baseArgument = process.argv.find(argument => argument.startsWith('--base-url='));
const outputPath = path.resolve(
  outputArgument?.slice('--output='.length) || 'public/image-manifest.json',
);
const baseUrl = baseArgument?.slice('--base-url='.length);
const metadataCachePath = path.join(root, 'src/data', 'image-metadata-cache.json');
const metadataCacheRaw = fs.existsSync(metadataCachePath)
  ? JSON.parse(fs.readFileSync(metadataCachePath, 'utf8'))
  : { schemaVersion: 1, generatedAt: new Date().toISOString(), entries: {} };
const metadataCache = new Map(Object.entries(metadataCacheRaw.entries || {}));
const sectionHDatasets = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/products/section-h-datasets.json'), 'utf8'),
);

if (!baseUrl) {
  throw new Error('collect-image-manifest.mjs requires --base-url=<local built site>');
}

const toPosix = value => value.split(path.sep).join('/');
const decodeEntities = value => String(value || '')
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const walk = directory => {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else files.push(absolute);
  }
  return files;
};

const normalizeImageUrl = rawValue => {
  let raw = decodeEntities(rawValue)
    .replaceAll('\\/', '/')
    .trim()
    .replace(/[),.;]+$/, '');
  if (!raw || raw.startsWith('data:') || raw.startsWith('blob:') || raw.startsWith('#')) {
    return null;
  }
  try {
    const candidate = new URL(raw, site);
    if (candidate.pathname === '/_next/image') {
      const underlying = candidate.searchParams.get('url');
      return underlying ? normalizeImageUrl(decodeURIComponent(underlying)) : null;
    }
    if (!['http:', 'https:'].includes(candidate.protocol)) return null;
    if (!imageExtensions.has(path.posix.extname(candidate.pathname).toLowerCase())) return null;
    candidate.hash = '';
    return candidate.href;
  } catch {
    return null;
  }
};

const parseAttributes = tag => {
  const attributes = {};
  const normalized = tag.replaceAll('\\"', '"').replaceAll("\\'", "'");
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of normalized.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
};

const extractUrls = text => {
  const urls = [];
  const pattern = /(?:https?:\\?\/\\?\/[^"'\\\s<>]+|\/[^"'\\\s<>]+)\.(?:webp|jpe?g|png|svg)(?:\?[^"'\\\s<>]*)?/gi;
  for (const match of text.matchAll(pattern)) {
    const normalized = normalizeImageUrl(match[0]);
    if (normalized) urls.push(normalized);
  }
  return urls;
};

const parseSvgDimensions = buffer => {
  const text = buffer.toString('utf8', 0, Math.min(buffer.length, 16_384));
  const svg = text.match(/<svg\b[^>]*>/i)?.[0] || '';
  const attributes = parseAttributes(svg);
  const numeric = value => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  let width = numeric(attributes.width);
  let height = numeric(attributes.height);
  if ((!width || !height) && attributes.viewbox) {
    const viewBox = attributes.viewbox.trim().split(/[\s,]+/).map(Number);
    if (viewBox.length === 4 && viewBox.every(Number.isFinite)) {
      width ||= viewBox[2];
      height ||= viewBox[3];
    }
  }
  return { width, height };
};

const parseJpegDimensions = buffer => {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (
      [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]
        .includes(marker)
    ) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }
    if (!length || length < 2) break;
    offset += 2 + length;
  }
  return { width: null, height: null };
};

const parseWebpDimensions = buffer => {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF') {
    return { width: null, height: null };
  }
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }
  if (chunk === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  if (chunk === 'VP8 ' && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  return { width: null, height: null };
};

const readDimensions = (file, buffer = fs.readFileSync(file)) => {
  const extension = path.extname(file).toLowerCase();
  if (extension === '.svg') return parseSvgDimensions(buffer);
  if (extension === '.png' && buffer.length >= 24) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (extension === '.jpg' || extension === '.jpeg') return parseJpegDimensions(buffer);
  if (extension === '.webp') return parseWebpDimensions(buffer);
  return { width: null, height: null };
};

const sourceIndex = new Map();
const sourceMetadata = new Map();
const basenameIndex = new Map();
const publishedVariantImages = [];

const addSource = (url, sourceFile, metadata = {}) => {
  if (!url) return;
  const files = sourceIndex.get(url) || new Set();
  files.add(sourceFile);
  sourceIndex.set(url, files);
  const current = sourceMetadata.get(url) || {
    altTexts: new Set(),
    captions: new Set(),
    dimensions: [],
    provenances: new Set(),
  };
  if (metadata.altText !== undefined) current.altTexts.add(metadata.altText);
  if (metadata.caption) current.captions.add(metadata.caption);
  if (metadata.width || metadata.height) {
    current.dimensions.push({
      width: Number(metadata.width) || null,
      height: Number(metadata.height) || null,
    });
  }
  if (metadata.provenance) current.provenances.add(metadata.provenance);
  sourceMetadata.set(url, current);
  const basename = path.posix.basename(new URL(url).pathname).toLowerCase();
  const basenameFiles = basenameIndex.get(basename) || new Set();
  basenameFiles.add(sourceFile);
  basenameIndex.set(basename, basenameFiles);
};

const visitProductImages = (value, sourceFile) => {
  if (Array.isArray(value)) {
    value.forEach(item => visitProductImages(item, sourceFile));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.src === 'string' && normalizeImageUrl(value.src)) {
    addSource(normalizeImageUrl(value.src), sourceFile, {
      altText: typeof value.alt === 'string' ? value.alt : undefined,
      caption: typeof value.caption === 'string' ? value.caption : undefined,
      width: value.width,
      height: value.height,
      provenance: value.provenance || 'unknown',
    });
  }
  Object.values(value).forEach(item => visitProductImages(item, sourceFile));
};

const sourceFiles = sourceRoots.flatMap(relativeRoot =>
  walk(path.join(root, relativeRoot))
    .filter(file => /\.(?:json|tsx?|jsx?|mjs|html)$/i.test(file)),
);

for (const absolute of sourceFiles) {
  const sourceFile = toPosix(path.relative(root, absolute));
  const text = fs.readFileSync(absolute, 'utf8');
  for (const url of extractUrls(text)) addSource(url, sourceFile);
  for (const tag of text.matchAll(/<img\b[^>]*>/gi)) {
    const attributes = parseAttributes(tag[0]);
    const url = normalizeImageUrl(attributes.src);
    addSource(url, sourceFile, {
      altText: attributes.alt,
      width: attributes.width,
      height: attributes.height,
    });
  }
  if (sourceFile.startsWith('src/data/products/') && sourceFile.endsWith('.json')) {
    try {
      const productData = JSON.parse(text);
      visitProductImages(productData, sourceFile);
      if (typeof productData.productSlug === 'string' && Array.isArray(productData.variants)) {
        const applicationsKey = productData.applicationsDataset || productData.productSlug;
        const applicationsPath = path.join(
          root,
          'src/data/products',
          `${applicationsKey}-applications.json`,
        );
        const applicationsSourceFile = fs.existsSync(applicationsPath)
          ? toPosix(path.relative(root, applicationsPath))
          : null;
        const applicationPanels = applicationsSourceFile
          ? JSON.parse(fs.readFileSync(applicationsPath, 'utf8')).panels
          : [];
        const applicationPanelBySlug = new Map(
          (Array.isArray(applicationPanels) ? applicationPanels : [])
            .map(panel => [panel?.sizeSlug, panel]),
        );
        for (const variant of productData.variants) {
          for (const image of Array.isArray(variant.images) ? variant.images : []) {
            const resolvedUrl = normalizeImageUrl(image?.src);
            if (!resolvedUrl) continue;
            publishedVariantImages.push({
              productSlug: productData.productSlug,
              resolvedUrl,
              sourceFile,
              altText: typeof image.alt === 'string' ? image.alt : '',
              width: Number(image.width) || null,
              height: Number(image.height) || null,
            });
          }
          const sizeSlug = typeof variant.sizeSlug === 'string' ? variant.sizeSlug : '';
          const applicationImage = applicationPanelBySlug.get(sizeSlug)?.image;
          const explorerTemplate = productData.explorerImageTemplate;
          const explorerSource = applicationImage?.src
            || (typeof explorerTemplate === 'string'
              ? explorerTemplate.replaceAll('{sizeSlug}', sizeSlug)
              : explorerTemplate?.[sizeSlug]);
          const explorerUrl = normalizeImageUrl(explorerSource);
          if (explorerUrl) {
            const explorerAlt = applicationImage?.alt
              || sectionHDatasets?.[applicationsKey]?.[sizeSlug]?.imageAlt;
            publishedVariantImages.push({
              productSlug: productData.productSlug,
              resolvedUrl: explorerUrl,
              sourceFile: applicationImage ? applicationsSourceFile : sourceFile,
              altText: typeof explorerAlt === 'string' ? explorerAlt : '',
              width: Number(applicationImage?.width) || null,
              height: Number(applicationImage?.height) || null,
            });
          }
        }
      }
    } catch (error) {
      throw new Error(`Cannot parse product image data in ${sourceFile}: ${error.message}`);
    }
  }
}

const provenanceOverridesPath = path.join(root, 'src/data/image-provenance-overrides.json');
const provenanceOverrides = fs.existsSync(provenanceOverridesPath)
  ? JSON.parse(fs.readFileSync(provenanceOverridesPath, 'utf8'))
  : {};

const localAssets = new Map();
let metadataCacheHits = 0;
let metadataCacheMisses = 0;

for (const absolute of walk(path.join(root, 'public'))) {
  const extension = path.extname(absolute).toLowerCase();
  if (!imageExtensions.has(extension)) continue;
  const relative = toPosix(path.relative(path.join(root, 'public'), absolute));
  const encodedPath = `/${relative.split('/').map(encodeURIComponent).join('/')}`;
  const resolvedUrl = new URL(encodedPath, site).href;
  const buffer = fs.readFileSync(absolute);
  const metadata = {
    absolute,
    sourceFile: `public/${relative}`,
    bytes: buffer.length,
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
    dimensions: readDimensions(absolute, buffer),
  };
  localAssets.set(resolvedUrl, metadata);
  addSource(resolvedUrl, metadata.sourceFile);
}

const getImageMetadata = resolvedUrl => {
  const metadata = metadataCache.get(resolvedUrl);
  if (!metadata) {
    return null;
  }
  metadataCacheHits += 1;
  return metadata;
};

const parseLength = (value, viewport) => {
  const match = String(value).trim().match(/^([\d.]+)(px|vw)$/);
  if (!match) return null;
  const number = Number(match[1]);
  return match[2] === 'vw' ? viewport * number / 100 : number;
};

const estimateSizesWidth = sizes => {
  if (!sizes) return null;
  const clauses = sizes.split(',').map(clause => clause.trim()).filter(Boolean);
  const viewports = [360, 768, 1024, 1440, 1920];
  const widths = [];
  for (const viewport of viewports) {
    let selected = null;
    for (const clause of clauses) {
      const condition = clause.match(/^\((max|min)-width:\s*([\d.]+)px\)\s+(.+)$/i);
      if (condition) {
        const threshold = Number(condition[2]);
        const matches = condition[1].toLowerCase() === 'max'
          ? viewport <= threshold
          : viewport >= threshold;
        if (matches) {
          selected = parseLength(condition[3], viewport);
          break;
        }
      } else {
        selected = parseLength(clause, viewport);
      }
    }
    if (selected) widths.push(selected);
  }
  return widths.length ? Math.round(Math.max(...widths)) : null;
};

const extractRenderedImages = html => {
  const images = new Map();
  const record = (rawUrl, metadata = {}) => {
    const resolvedUrl = normalizeImageUrl(rawUrl);
    if (!resolvedUrl) return;
    const current = images.get(resolvedUrl) || {
      altTexts: new Set(),
      captions: new Set(),
      rendered: false,
      inSchema: false,
      inMetadata: false,
      decorative: false,
      declaredWidths: [],
      declaredHeights: [],
      largestRenderWidths: [],
    };
    if (metadata.altText !== undefined) current.altTexts.add(metadata.altText);
    if (metadata.caption) current.captions.add(metadata.caption);
    current.rendered ||= Boolean(metadata.rendered);
    current.inSchema ||= Boolean(metadata.inSchema);
    current.inMetadata ||= Boolean(metadata.inMetadata);
    current.decorative ||= Boolean(metadata.decorative);
    if (metadata.width) current.declaredWidths.push(Number(metadata.width));
    if (metadata.height) current.declaredHeights.push(Number(metadata.height));
    if (metadata.largestRenderWidth) {
      current.largestRenderWidths.push(Number(metadata.largestRenderWidth));
    }
    images.set(resolvedUrl, current);
  };

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const decorative = attributes['data-decorative'] === 'true'
      || attributes.role === 'presentation'
      || attributes['aria-hidden'] === 'true';
    const largestRenderWidth = estimateSizesWidth(attributes.sizes)
      || Number(attributes.width)
      || null;
    record(attributes.src, {
      altText: attributes.alt,
      rendered: true,
      decorative,
      width: attributes.width,
      height: attributes.height,
      largestRenderWidth,
    });
    for (const srcset of [attributes.srcset, attributes.imagesrcset]) {
      if (!srcset) continue;
      for (const candidate of srcset.split(',')) {
        record(candidate.trim().split(/\s+/)[0], {
          altText: attributes.alt,
          rendered: true,
          decorative,
          width: attributes.width,
          height: attributes.height,
          largestRenderWidth,
        });
      }
    }
  }

  for (const match of html.matchAll(/<source\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    for (const candidate of String(attributes.srcset || '').split(',')) {
      record(candidate.trim().split(/\s+/)[0], {
        rendered: true,
        largestRenderWidth: estimateSizesWidth(attributes.sizes),
      });
    }
  }

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const key = (attributes.property || attributes.name || '').toLowerCase();
    if (/^(?:og:image|twitter:image)/.test(key)) {
      record(attributes.content, { inMetadata: true });
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const url of extractUrls(match[1])) record(url, { inSchema: true });
  }

  for (const match of html.matchAll(/url\((["']?)([^)"']+)\1\)/gi)) {
    record(match[2], { rendered: true, altText: '', decorative: false });
  }
  return images;
};

const pagePaths = [...new Set(canonicalPaths)]
  .filter(pathname => !pathname.startsWith('/product-category/'))
  .sort();
const pages = [];
let pageCursor = 0;
const pageWorkers = Array.from({ length: 12 }, async () => {
  while (pageCursor < pagePaths.length) {
    const index = pageCursor++;
    const pathname = pagePaths[index];
    const response = await fetch(new URL(pathname, baseUrl), {
      redirect: 'manual',
      signal: AbortSignal.timeout(30_000),
    });
    const html = await response.text();
    const robots = [...html.matchAll(/<meta\b[^>]*>/gi)]
      .map(match => parseAttributes(match[0]))
      .find(attributes => attributes.name?.toLowerCase() === 'robots')?.content || '';
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)]
      .map(match => parseAttributes(match[0]))
      .find(attributes => attributes.rel?.toLowerCase() === 'canonical')?.href || null;
    pages[index] = {
      pathname,
      pageUrl: new URL(pathname, site).href,
      status: response.status,
      redirectLocation: response.headers.get('location'),
      robots,
      canonical: canonical ? new URL(canonical, site).href : null,
      indexable: response.status === 200
        && !/\bnoindex\b/i.test(robots)
        && (!canonical || new URL(canonical, site).pathname === pathname),
      images: extractRenderedImages(html),
    };
  }
});
await Promise.all(pageWorkers);

const entries = new Map();
const ensureEntry = resolvedUrl => {
  if (!entries.has(resolvedUrl)) {
    const url = new URL(resolvedUrl);
    const local = url.origin === site && localAssets.has(resolvedUrl);
    const cacheEntry = local ? null : getImageMetadata(resolvedUrl);
    const sources = sourceIndex.get(resolvedUrl)
      || basenameIndex.get(path.posix.basename(url.pathname).toLowerCase())
      || new Set();
    if (!local && !cacheEntry) metadataCacheMisses += 1;
    entries.set(resolvedUrl, {
      resolvedUrl,
      sourceFiles: new Set(sources),
      usages: [],
      filename: decodeURIComponent(path.posix.basename(url.pathname)),
      format: path.posix.extname(url.pathname).slice(1).toLowerCase(),
      bytes: local ? localAssets.get(resolvedUrl).bytes : Number(cacheEntry?.bytes) || null,
      sha256: local ? localAssets.get(resolvedUrl).sha256 : cacheEntry?.sha256 || null,
      intrinsicDimensions: local
        ? localAssets.get(resolvedUrl).dimensions
        : cacheEntry?.intrinsicDimensions || { width: null, height: null },
      local,
      remote: !local,
      metadataCacheMiss: !local && !cacheEntry,
      metadataCacheVersion: cacheEntry?.schemaVersion || null,
      inSchema: false,
      inMetadata: false,
      provenance: provenanceOverrides[resolvedUrl]
        || [...(sourceMetadata.get(resolvedUrl)?.provenances || [])]
          .find(value => value !== 'unknown')
        || 'unknown',
      status: local ? 200 : cacheEntry?.status || null,
      redirectLocation: local ? null : cacheEntry?.redirectLocation || null,
      etag: local ? null : cacheEntry?.etag || null,
      lastModified: local ? null : cacheEntry?.lastModified || null,
      metadataCacheLastUpdated: local ? null : cacheEntry?.lastUpdated || null,
    });
  }
  return entries.get(resolvedUrl);
};

for (const resolvedUrl of localAssets.keys()) ensureEntry(resolvedUrl);
for (const page of pages) {
  for (const [resolvedUrl, image] of page.images) {
    const entry = ensureEntry(resolvedUrl);
    entry.inSchema ||= image.inSchema;
    entry.inMetadata ||= image.inMetadata;
    entry.usages.push({
      pageUrl: page.pageUrl,
      pageStatus: page.status,
      pageIndexable: page.indexable,
      altText: [...image.altTexts].sort(),
      caption: [...image.captions].sort(),
      rendered: image.rendered,
      inSchema: image.inSchema,
      inMetadata: image.inMetadata,
      decorative: image.decorative,
      declaredWidth: image.declaredWidths.length
        ? Math.max(...image.declaredWidths.filter(Number.isFinite))
        : null,
      declaredHeight: image.declaredHeights.length
        ? Math.max(...image.declaredHeights.filter(Number.isFinite))
        : null,
      largestRenderWidth: image.largestRenderWidths.length
        ? Math.max(...image.largestRenderWidths.filter(Number.isFinite))
        : null,
    });
  }
}

const productPageBySlug = new Map(
  pagePaths
    .filter(pathname => pathname.startsWith('/product/'))
    .map(pathname => [pathname.split('/').filter(Boolean).at(-1), pathname]),
);
const pageByPathname = new Map(pages.map(page => [page.pathname, page]));

for (const published of publishedVariantImages) {
  const pathname = productPageBySlug.get(published.productSlug);
  const page = pathname ? pageByPathname.get(pathname) : null;
  // Variant datasets without a canonical product route are not published pages.
  if (!page) continue;
  const entry = ensureEntry(published.resolvedUrl);
  const existingUsage = entry.usages.find(usage => usage.pageUrl === page.pageUrl);
  if (existingUsage) {
    existingUsage.publishedVariant = true;
    existingUsage.altText = [...new Set([...existingUsage.altText, published.altText])].sort();
    existingUsage.declaredWidth ||= published.width;
    existingUsage.declaredHeight ||= published.height;
    continue;
  }
  entry.usages.push({
    pageUrl: page.pageUrl,
    pageStatus: page.status,
    pageIndexable: page.indexable,
    altText: [published.altText],
    caption: [],
    rendered: false,
    publishedVariant: true,
    inSchema: false,
    inMetadata: false,
    decorative: false,
    declaredWidth: published.width,
    declaredHeight: published.height,
    largestRenderWidth: published.width,
  });
}

for (const entry of entries.values()) {
  if (!entry.intrinsicDimensions.width || !entry.intrinsicDimensions.height) {
    const candidates = [
      ...(sourceMetadata.get(entry.resolvedUrl)?.dimensions || []),
      ...entry.usages.map(usage => ({
        width: usage.declaredWidth,
        height: usage.declaredHeight,
      })),
    ].filter(candidate => candidate.width || candidate.height);
    if (candidates.length) {
      const selected = candidates.sort((left, right) =>
        (right.width || 0) * (right.height || 0) - (left.width || 0) * (left.height || 0)
      )[0];
      entry.intrinsicDimensions = selected;
    }
  }
}

const serializedEntries = [...entries.values()]
  .sort((left, right) => left.resolvedUrl.localeCompare(right.resolvedUrl))
  .map(entry => {
    const sourceFilesForEntry = [...entry.sourceFiles].sort();
    const usages = entry.usages.sort((left, right) => left.pageUrl.localeCompare(right.pageUrl));
    return {
      resolvedUrl: entry.resolvedUrl,
      sourceFile: sourceFilesForEntry[0] || null,
      sourceFiles: sourceFilesForEntry,
      pagesItRendersOn: [...new Set(usages.map(usage => usage.pageUrl))].sort(),
      usages,
      altText: [...new Set(usages.flatMap(usage => usage.altText))].sort(),
      filename: entry.filename,
      format: entry.format,
      bytes: entry.bytes,
      sha256: entry.sha256,
      intrinsicDimensions: entry.intrinsicDimensions,
      local: entry.local,
      remote: entry.remote,
      inSchema: entry.inSchema,
      inMetadata: entry.inMetadata,
      provenance: entry.provenance,
      status: entry.status,
      metadataCacheMiss: entry.metadataCacheMiss,
      metadataCacheVersion: entry.metadataCacheVersion,
      metadataCacheLastUpdated: entry.metadataCacheLastUpdated || null,
      redirectLocation: entry.redirectLocation,
      etag: entry.etag || null,
      lastModified: entry.lastModified || null,
      largestRenderWidth: Math.max(
        0,
        ...usages.map(usage => usage.largestRenderWidth || 0),
      ) || null,
    };
  });

const live = serializedEntries.filter(entry => entry.pagesItRendersOn.length > 0);
const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  generatedFrom: {
    renderedBaseUrl: baseUrl,
    publicAssets: 'public/**',
    productData: 'src/data/products/**',
    wordpressHtml: 'src/data/wp-export/**',
    staticSource: [
      'src/components/**',
      'src/pages/**',
      'src/config/**',
      'src/lib/**',
    ],
  },
  site,
  collection: {
    pageCount: pages.length,
    indexablePageCount: pages.filter(page => page.indexable).length,
    non200Pages: pages.filter(page => page.status !== 200)
      .map(page => ({ pageUrl: page.pageUrl, status: page.status })),
    noindexOrCanonicalElsewherePages: pages.filter(page => page.status === 200 && !page.indexable)
      .map(page => ({
        pageUrl: page.pageUrl,
        robots: page.robots,
        canonical: page.canonical,
      })),
    sourceFileCount: sourceFiles.length,
    publicImageCount: localAssets.size,
    manifestEntryCount: serializedEntries.length,
    liveImageCount: live.length,
    liveRemoteImageCount: live.filter(entry => entry.remote).length,
    liveLocalImageCount: live.filter(entry => entry.local).length,
    unknownProvenanceCount: serializedEntries.filter(entry => entry.provenance === 'unknown').length,
    metadataCacheStats: {
      configuredPath: path.relative(root, metadataCachePath),
      entries: metadataCache.size,
      hits: metadataCacheHits,
      misses: metadataCacheMisses,
    },
  },
  pages: pages.map(({ images: _images, ...page }) => page),
  entries: serializedEntries,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({
  output: outputPath,
  ...manifest.collection,
}, null, 2));
