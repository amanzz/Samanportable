import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestArgument = process.argv.find(argument => argument.startsWith('--manifest='));
const cacheArgument = process.argv.find(argument => argument.startsWith('--cache='));
const concurrencyArgument = process.argv.find(argument => argument.startsWith('--concurrency='));
const forceArgument = process.argv.find(argument => argument === '--force');
const manifestPath = manifestArgument?.slice('--manifest='.length) || path.join(root, 'public', 'image-manifest.json');
const cachePath = cacheArgument?.slice('--cache='.length) || path.join(root, 'src', 'data', 'image-metadata-cache.json');
const maxConcurrency = Number(concurrencyArgument?.slice('--concurrency='.length) || '12');
const forceRefresh = Boolean(forceArgument);

if (!fs.existsSync(manifestPath)) {
  throw new Error(`Manifest not found at ${manifestPath}`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const parseSvgDimensions = buffer => {
  const text = buffer.toString('utf8', 0, Math.min(buffer.length, 16_384));
  const svgMatch = text.match(/<svg\b[^>]*>/i);
  const svg = svgMatch?.[0] || '';
  const parseAttributes = tag => {
    const attributes = {};
    const normalized = tag.replaceAll('\\"', '"').replaceAll("\\'", "'");
    const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    for (const match of normalized.matchAll(pattern)) {
      attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
    }
    return attributes;
  };
  const numeric = value => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const attributes = parseAttributes(svg);
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

const dimensionsFromBuffer = (rawUrl, buffer) => {
  const extension = path.extname(new URL(rawUrl).pathname).toLowerCase();
  if (extension === '.svg') return parseSvgDimensions(buffer);
  if (extension === '.png' && buffer.length >= 24) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (extension === '.jpg' || extension === '.jpeg') return parseJpegDimensions(buffer);
  if (extension === '.webp') return parseWebpDimensions(buffer);
  if (extension === '.avif' || extension === '.gif') {
    return { width: null, height: null };
  }
  return { width: null, height: null };
};

const cacheRaw = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  : { schemaVersion: 1, updatedAt: new Date().toISOString(), entries: {} };
const cacheEntries = new Map(Object.entries(cacheRaw.entries || {}));

const needsMetadata = entry => entry.remote && (forceRefresh
  || entry.metadataCacheMiss
  || !cacheEntries.has(entry.resolvedUrl)
  || !Number.isFinite(entry.bytes)
  || !Number.isFinite(entry.intrinsicDimensions?.width)
  || !Number.isFinite(entry.intrinsicDimensions?.height));

const remoteEntries = manifest.entries.filter(needsMetadata);

console.log(JSON.stringify({
  manifest: path.relative(root, manifestPath),
  cache: path.relative(root, cachePath),
  manifestEntries: manifest.entries.length,
  remoteEntriesToResolve: remoteEntries.length,
  forceRefresh,
}, null, 2));

if (!remoteEntries.length) {
  console.log('No remote metadata candidates found. Nothing to do.');
  process.exit(0);
}

let cursor = 0;
let attempts = 0;
const results = {
  resolved: 0,
  unchanged: 0,
  failed: 0,
  missed: 0,
  noLongerRemote: 0,
};
const failures = [];

const writeCache = () => {
  const updated = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    entries: Object.fromEntries(
      [...cacheEntries.entries()].sort((left, right) => left[0].localeCompare(right[0])),
    ),
  };
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, `${JSON.stringify(updated, null, 2)}\n`);
};

const fetchOne = async entry => {
  const response = await fetch(entry.resolvedUrl, {
    method: 'GET',
    redirect: 'manual',
    signal: AbortSignal.timeout(60_000),
    headers: {
      'user-agent': 'SAMAN-Image-Metadata-Cache/1.0',
      accept: 'image/avif,image/webp,image/png,image/jpeg,image/svg+xml,*/*',
    },
  });
  const status = response.status;
  const redirectLocation = response.headers.get('location');
  const etag = response.headers.get('etag');
  const lastModified = response.headers.get('last-modified');
  const intrinsicDimensions = { width: null, height: null };
  let bytes = Number(response.headers.get('content-length')) || null;
  let sha256 = null;
  if (response.body && status === 200) {
    const buffer = Buffer.from(await response.arrayBuffer());
    bytes = buffer.length;
    sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const parsed = dimensionsFromBuffer(entry.resolvedUrl, buffer);
    if (parsed.width && parsed.height) {
      intrinsicDimensions.width = parsed.width;
      intrinsicDimensions.height = parsed.height;
      results.resolved += 1;
    } else {
      results.missed += 1;
    }
  } else if (response.body) {
    results.unchanged += 1;
    await response.body.cancel();
  }
  if (status === 200) {
    cacheEntries.set(entry.resolvedUrl, {
      status,
      redirectLocation,
      bytes,
      sha256,
      intrinsicDimensions,
      etag: etag || null,
      lastModified: lastModified || null,
      lastUpdated: new Date().toISOString(),
      schemaVersion: 1,
    });
  } else {
    cacheEntries.set(entry.resolvedUrl, {
      status,
      redirectLocation,
      bytes: Number.isFinite(bytes) ? bytes : null,
      sha256: null,
      intrinsicDimensions,
      etag: etag || null,
      lastModified: lastModified || null,
      lastUpdated: new Date().toISOString(),
      schemaVersion: 1,
    });
    if (status === 404 || (status >= 300 && status < 400)) {
      results.failed += 1;
    } else {
      results.failed += 1;
    }
  }
};

const workers = Array.from({ length: Math.max(1, maxConcurrency) }, async () => {
  while (cursor < remoteEntries.length) {
    const index = cursor++;
    const entry = remoteEntries[index];
    attempts += 1;
    try {
      await fetchOne(entry);
    } catch (error) {
      failures.push({
        url: entry.resolvedUrl,
        status: 'error',
        error: error.message,
      });
      results.failed += 1;
    }
  }
});

await Promise.all(workers);
writeCache();

console.log(JSON.stringify({
  attempts,
  cacheEntries: cacheEntries.size,
  status: results,
  failures: failures.slice(0, 20),
}, null, 2));

if (failures.length) {
  process.exitCode = 1;
}

