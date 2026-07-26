import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const require = createRequire(import.meta.url);
const apply = process.argv.includes('--apply');
const norm = value => {
  if (typeof value !== 'string') return '';
  let valuePath = value.trim();
  if (/^https?:\/\//i.test(valuePath)) {
    try { valuePath = new URL(valuePath).pathname; } catch { return ''; }
  }
  valuePath = valuePath.split(/[?#]/)[0];
  if (!valuePath.startsWith('/')) return '';
  return valuePath.length > 1 ? valuePath.replace(/\/+$/, '') : '/';
};

const nextConfig = require(path.join(root, 'next.config.js'));
const rawRedirects = await nextConfig.redirects();
const redirects = new Map();
const declarations = [];
for (const entry of rawRedirects) {
  if (!entry || entry.has || entry.missing || typeof entry.source !== 'string' ||
      entry.source.includes(':') || entry.source.includes('*')) continue;
  const source = norm(entry.source);
  const destination = norm(entry.destination);
  if (!source || !destination) continue;
  declarations.push({ source, destination, permanent: Boolean(entry.permanent) });
  if (!redirects.has(source)) redirects.set(source, destination);
}
const terminal = source => {
  const seen = new Set();
  let current = norm(source);
  while (redirects.has(current) && !seen.has(current)) {
    seen.add(current);
    current = redirects.get(current);
  }
  return current;
};

const exportRoot = path.join(root, 'src', 'data', 'wp-export');
const customCanonical = new Map(
  require(path.join(root, 'src', 'lib', 'customProductCanonicalPaths.json'))
    .map(entry => [entry.slug, entry.canonicalPath])
);
const kinds = [
  { name: 'posts', archive: 'redirected-posts' },
  { name: 'products', archive: 'redirected-products' },
];
const retired = [];
for (const kind of kinds) {
  const liveDir = path.join(exportRoot, kind.name);
  for (const file of fs.readdirSync(liveDir).filter(file => file.endsWith('.json'))) {
    const full = path.join(liveDir, file);
    const record = JSON.parse(fs.readFileSync(full, 'utf8'));
    const slug = record.slug || file.slice(0, -5);
    const categorySlug = record.categories?.[0]?.slug || 'uncategorized';
    const source = kind.name === 'products'
      ? (customCanonical.get(slug) ||
        (slug === categorySlug ? `/product/${categorySlug}` : `/product/${categorySlug}/${slug}`))
      : `/${slug}`;
    if (!redirects.has(source)) continue;
    retired.push({
      kind: kind.name,
      archive: kind.archive,
      file,
      slug,
      source,
      destination: terminal(source),
      lines: fs.readFileSync(full, 'utf8').split(/\r?\n/).length,
    });
  }
}

const productDir = path.join(exportRoot, 'products');
const selfSlugs = fs.readdirSync(productDir).filter(file => file.endsWith('.json')).flatMap(file => {
  const record = JSON.parse(fs.readFileSync(path.join(productDir, file), 'utf8'));
  const categorySlugs = (record.categories || []).map(category => category.slug).filter(Boolean);
  return categorySlugs.includes(record.slug)
    ? [{ file, slug: record.slug, route: `/product/${record.slug}/${record.slug}` }]
    : [];
});

if (apply) {
  const mapping = {};
  for (const item of retired) {
    const from = path.join(exportRoot, item.kind, item.file);
    const archiveDir = path.join(exportRoot, item.archive);
    const to = path.join(archiveDir, item.file);
    fs.mkdirSync(archiveDir, { recursive: true });
    if (fs.existsSync(from)) fs.renameSync(from, to);
    mapping[item.slug] = item.destination;
  }
  const sortedMapping = Object.fromEntries(Object.entries(mapping).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(
    path.join(root, 'src', 'lib', 'redirectedPageDestinations.json'),
    `${JSON.stringify(sortedMapping, null, 2)}\n`
  );
}

const duplicates = declarations.length - new Set(declarations.map(item => item.source)).size;
const chains = [...redirects].filter(([, destination]) => redirects.has(destination));
const result = {
  declarations: declarations.length,
  uniqueLiteralSources: redirects.size,
  duplicateDeclarations: duplicates,
  redirectChains: chains,
  retired: {
    posts: retired.filter(item => item.kind === 'posts').length,
    products: retired.filter(item => item.kind === 'products').length,
    files: retired,
  },
  selfSlugs,
};
const reportDir = path.join(root, 'audit', 'index-hygiene');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, apply ? 'applied-source-inventory.json' : 'baseline-source-inventory.json'),
  `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({
  declarations: result.declarations,
  uniqueLiteralSources: result.uniqueLiteralSources,
  duplicateDeclarations: result.duplicateDeclarations,
  redirectChains: result.redirectChains.length,
  retiredPosts: result.retired.posts,
  retiredProducts: result.retired.products,
  selfSlugs: result.selfSlugs.length,
  applied: apply,
}, null, 2));
