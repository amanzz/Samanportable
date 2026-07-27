import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const manifestPath = path.join(root, 'public/image-manifest.json');
const allowlistPath = path.join(root, 'src/data/image-intake-allowlist.json');
const bootstrap = process.argv.includes('--bootstrap');
const baseRefArgument = process.argv.find(argument => argument.startsWith('--base-ref='));
const baseRef = baseRefArgument?.slice('--base-ref='.length);

if (!fs.existsSync(manifestPath)) {
  throw new Error('Image intake gate cannot run: public/image-manifest.json has not been generated');
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const stable = value => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, stable(value[key])]),
    );
  }
  return value;
};
const fingerprint = entry => crypto.createHash('sha256')
  .update(JSON.stringify(stable({
    resolvedUrl: entry.resolvedUrl,
    sourceFiles: entry.sourceFiles,
    pagesItRendersOn: entry.pagesItRendersOn,
    usages: entry.usages.map(usage => ({
      pageUrl: usage.pageUrl,
      altText: usage.altText,
      caption: usage.caption,
      rendered: usage.rendered,
      inSchema: usage.inSchema,
      inMetadata: usage.inMetadata,
      decorative: usage.decorative,
      largestRenderWidth: usage.largestRenderWidth,
    })),
    filename: entry.filename,
    format: entry.format,
    bytes: entry.bytes,
    sha256: entry.sha256,
    intrinsicDimensions: entry.intrinsicDimensions,
    local: entry.local,
    remote: entry.remote,
    provenance: entry.provenance,
    etag: entry.remote ? entry.etag : null,
    lastModified: entry.remote ? entry.lastModified : null,
  })))
  .digest('hex');

if (bootstrap) {
  const allowlist = {
    schemaVersion: 1,
    switchedOn: '2026-07-27',
    rule: 'Existing entries only. This list may shrink but must never gain or alter an entry.',
    entries: manifest.entries.map(entry => ({
      key: entry.resolvedUrl,
      fingerprint: fingerprint(entry),
    })).sort((left, right) => left.key.localeCompare(right.key)),
  };
  fs.writeFileSync(allowlistPath, `${JSON.stringify(allowlist, null, 2)}\n`);
  console.log(JSON.stringify({
    allowlist: path.relative(root, allowlistPath),
    size: allowlist.entries.length,
  }, null, 2));
  process.exit(0);
}

if (!fs.existsSync(allowlistPath)) {
  throw new Error(
    'Image intake allow-list is missing. It may be created once with --bootstrap at switch-on.',
  );
}
const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
const allowed = new Map(allowlist.entries.map(entry => [entry.key, entry.fingerprint]));
const manifestByKey = new Map(manifest.entries.map(entry => [entry.resolvedUrl, entry]));
const failures = [];

for (const [key, allowedFingerprint] of allowed) {
  const entry = manifestByKey.get(key);
  if (!entry) {
    failures.push({
      file: key,
      rule: 'allow-list only shrinks',
      correction: 'Remove this stale entry from src/data/image-intake-allowlist.json.',
    });
  } else if (fingerprint(entry) !== allowedFingerprint) {
    failures.push({
      file: key,
      rule: 'changed images leave the allow-list',
      correction: 'Make the changed image pass every intake rule, then remove its old allow-list entry.',
    });
  }
}

if (baseRef) {
  try {
    const baseRaw = execFileSync(
      'git',
      ['show', `${baseRef}:src/data/image-intake-allowlist.json`],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    const base = JSON.parse(baseRaw);
    const baseEntries = new Map(base.entries.map(entry => [entry.key, entry.fingerprint]));
    for (const entry of allowlist.entries) {
      if (!baseEntries.has(entry.key) || baseEntries.get(entry.key) !== entry.fingerprint) {
        failures.push({
          file: 'src/data/image-intake-allowlist.json',
          rule: 'allow-list additions and altered fingerprints are forbidden',
          correction: `Remove re-added or altered allow-list entry ${entry.key}.`,
        });
      }
    }
  } catch (error) {
    const message = String(error.stderr || error.message || '');
    if (!/does not exist|exists on disk, but not in|unknown revision/i.test(message)) throw error;
    console.log('Base branch has no image intake allow-list: treating this as the one-time switch-on.');
  }
}

const filenameOwners = new Map();
const altOwners = new Map();
for (const entry of manifest.entries) {
  const normalizedFilename = entry.filename.toLowerCase();
  const owners = filenameOwners.get(normalizedFilename) || new Set();
  owners.add(entry.resolvedUrl);
  filenameOwners.set(normalizedFilename, owners);
  for (const usage of entry.usages) {
    if (!usage.rendered) continue;
    for (const altText of usage.altText) {
      if (!altText) continue;
      const altKey = altText.trim().toLocaleLowerCase('en');
      const altUrls = altOwners.get(altKey) || new Set();
      altUrls.add(entry.resolvedUrl);
      altOwners.set(altKey, altUrls);
    }
  }
}

const filenamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*-\d+x\d+(?:x[\d.]+)?-[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|svg)$/;
const forbiddenFilename = /(?:^|[-_.])(?:img|dsc|screenshot|copy|final|v\d+|\d+)(?:[-_.]|$)/i;
const deliveryClaim = /\b(?:client|project|delivered|delivery|installed|installation|completed|completion|commissioned|handed over|on-site)\b/i;
const cityClaim = /\b(?:bangalore|bengaluru|delhi|noida|gurgaon|gurugram|ghaziabad|meerut|faridabad|hosur|mysore|mysuru|tumkur|kolar|doddaballapur|nelamangala|devanahalli|aneka[l]?|whitefield|hebbal|yelahanka|ulsoor|koramangala|electronic city|greater noida|hyderabad|chennai|mumbai|pune|kolkata)\b/i;

const report = (entry, rule, correction) => failures.push({
  file: entry.sourceFile || entry.resolvedUrl,
  image: entry.resolvedUrl,
  rule,
  correction,
});

for (const entry of manifest.entries) {
  if (allowed.get(entry.resolvedUrl) === fingerprint(entry)) continue;
  const remoteMetadataMissing = Boolean(entry.remote && entry.metadataCacheMiss);

  if (!filenamePattern.test(entry.filename) || forbiddenFilename.test(entry.filename)) {
    report(
      entry,
      'filename must be unique lowercase [product]-[size]-[view].[ext] with no camera/export/version tokens',
      'Rename the source to a unique lowercase hyphenated filename containing product, dimensions and view.',
    );
  }
  if ((filenameOwners.get(entry.filename.toLowerCase())?.size || 0) > 1) {
    report(
      entry,
      'filename must be unique site-wide',
      'Choose a filename that is not used by any local or remote image.',
    );
  }
  if (!['webp', 'svg'].includes(entry.format)) {
    report(
      entry,
      'photos must be WebP and vectors must be SVG',
      'Convert the photograph to WebP or provide the vector as SVG before intake.',
    );
  }
  if (!remoteMetadataMissing && (!Number.isFinite(entry.bytes) || entry.bytes >= 200 * 1024)) {
    report(
      entry,
      'image must be below 200 KB',
      'Optimise the image to less than 204800 bytes and regenerate the manifest.',
    );
  }
  if (!['photograph', 'render'].includes(entry.provenance)) {
    report(
      entry,
      'provenance must be declared as photograph or render',
      'Set provenance explicitly; unknown is allowed only for unchanged switch-on entries.',
    );
  }
  if (!entry.usages.some(usage => usage.rendered)) {
    report(
      entry,
      'every accepted image must have a rendered use with alt text',
      'Reference the image from a rendered page and supply a unique 60–125 character alt before intake.',
    );
  }

  for (const usage of entry.usages.filter(usage => usage.rendered)) {
    const alts = usage.altText.length ? usage.altText : [''];
    for (const altText of alts) {
      if (!altText) {
        if (!usage.decorative) {
          report(
            entry,
            'empty alt is permitted only for an explicitly code-marked decorative image',
            'Write a unique 60–125 character alt or add data-decorative="true"/role="presentation" when genuinely decorative.',
          );
        }
      } else {
        if (altText.length < 60 || altText.length > 125) {
          report(
            entry,
            'alt text must contain 60 to 125 characters',
            `Rewrite the ${altText.length}-character alt to the approved length.`,
          );
        }
        if ((altOwners.get(altText.trim().toLocaleLowerCase('en'))?.size || 0) > 1) {
          report(
            entry,
            'alt text must be unique site-wide',
            'Write alt text that identifies this specific image and is not used by another image.',
          );
        }
      }
      if (
        entry.provenance === 'render'
        && (deliveryClaim.test(altText) || cityClaim.test(altText))
      ) {
        report(
          entry,
          'render text may not name a client, project or city or assert delivery, installation or completion',
          'Describe only the depicted product, size and view and make the render status truthful.',
        );
      }
    }
    for (const caption of usage.caption) {
      if (
        entry.provenance === 'render'
        && (deliveryClaim.test(caption) || cityClaim.test(caption))
      ) {
        report(
          entry,
          'render caption may not name a client, project or city or assert delivery, installation or completion',
          'Remove the prohibited claim and identify the image truthfully as a render.',
        );
      }
    }
  }

  const width = entry.intrinsicDimensions?.width;
  const renderWidth = entry.largestRenderWidth;
  if (!remoteMetadataMissing && (!Number.isFinite(width) || !Number.isFinite(renderWidth) || renderWidth <= 0)) {
    report(
      entry,
      'intrinsic and largest render widths must be measurable',
      'Declare image dimensions and a responsive sizes/width value so the 2× limit can be checked.',
    );
  } else if (!remoteMetadataMissing && width > renderWidth * 2) {
    report(
      entry,
      'served image width must not exceed 2× its largest render width',
      `Provide an image no wider than ${Math.floor(renderWidth * 2)}px for this ${renderWidth}px render.`,
    );
  }
}

console.log(JSON.stringify({
  manifestEntries: manifest.entries.length,
  allowlistSize: allowlist.entries.length,
  changedOrNewEntries: manifest.entries.filter(
    entry => allowed.get(entry.resolvedUrl) !== fingerprint(entry),
  ).length,
  failures: failures.length,
}, null, 2));

if (failures.length) {
  for (const failure of failures) {
    console.error(`\nFILE: ${failure.file}`);
    if (failure.image) console.error(`IMAGE: ${failure.image}`);
    console.error(`RULE: ${failure.rule}`);
    console.error(`CORRECTION: ${failure.correction}`);
  }
  process.exitCode = 1;
}
