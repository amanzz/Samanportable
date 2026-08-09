/**
 * CALC-L7 §2.1 / G29 — the route extension's discovery pass.
 *
 * Answers the question the ticket makes a STOP condition: can every product
 * route's approved name be read programmatically, or must some routes be left
 * out? Writing a name for a route would be invention and a hard-gate breach, so
 * this runs BEFORE any extension is built.
 *
 * Two approved sources are consulted, in order, and neither is written to:
 *   1. src/data/products/{key}.json          -> productName  (the L3 product record)
 *   2. src/data/wp-export/products/{key}.json -> name        (the published export)
 * `key` is the route's own last segment - the subpage slug where there is one,
 * otherwise the category - so a route can never borrow a sibling's name.
 *
 * Subtitle is reused only where one already exists. Where none does, the field
 * is emitted blank: a composed subtitle is a defect, a blank one is correct.
 *
 * Run: node scripts/calculator/report-route-extension-coverage.mjs
 * Exit: 0 when every uncovered route has a readable approved name, 1 otherwise.
 */
import fs from 'fs';
import path from 'path';
import Module from 'node:module';
import jitiPkg from 'jiti';

const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) request = path.join(SRC, request.slice(2));
  return resolveFilename.call(this, request, ...rest);
};
const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const { resolveEmbeddedCalculatorProduct } = jiti('./src/lib/cabinCalculatorEmbedRoutes.ts');

const PRODUCTS_DIR = path.join('src', 'data', 'products');
const WP_DIR = path.join('src', 'data', 'wp-export', 'products');

/** Read a route's approved name and subtitle. Never composes either. */
function approvedCopyFor(key) {
  const pd = path.join(PRODUCTS_DIR, `${key}.json`);
  if (fs.existsSync(pd)) {
    const j = JSON.parse(fs.readFileSync(pd, 'utf8'));
    if (j.productName) return { name: j.productName, subtitle: j.metaDescription || null, source: 'products' };
  }
  const wp = path.join(WP_DIR, `${key}.json`);
  if (fs.existsSync(wp)) {
    const j = JSON.parse(fs.readFileSync(wp, 'utf8'));
    if (j.name) return { name: j.name, subtitle: j.metaDescription || j.shortDescription || null, source: 'wp-export' };
  }
  return null;
}

const xml = fs.readFileSync(path.join('public', 'sitemap-products.xml'), 'utf8');
const routes = [...new Set(
  [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1].split('samanportable.com')[1] || '')
    .filter((u) => u.startsWith('/product/'))
)].sort().map((url) => {
  const parts = url.replace(/\/$/, '').split('/').filter(Boolean);
  return { url, category: parts[1], slug: parts[2] };
}).filter((r) => r.category);

const covered = [];
const uncovered = [];
for (const r of routes) {
  (resolveEmbeddedCalculatorProduct(r.category, r.slug) ? covered : uncovered).push(r);
}

const clusters = new Map();
const unreadable = [];
for (const r of uncovered) {
  const key = r.slug || r.category;
  const copy = approvedCopyFor(key);
  if (!copy) unreadable.push(r.url);
  if (!clusters.has(r.category)) clusters.set(r.category, { routes: 0, named: 0, subtitled: 0, sources: new Set() });
  const c = clusters.get(r.category);
  c.routes += 1;
  if (copy) { c.named += 1; c.sources.add(copy.source); }
  if (copy && copy.subtitle) c.subtitled += 1;
}

console.log('CALC-L7 route extension - discovery');
console.log('');
console.log(`product routes in sitemap-products.xml : ${routes.length}`);
console.log(`carrying the calculator today          : ${covered.length}`);
console.log(`to be extended                         : ${uncovered.length}`);
console.log(`clusters to be extended                : ${clusters.size}`);
console.log('');
console.log('G29 CLUSTER COVERAGE');
console.log('cluster'.padEnd(28) + 'routes'.padStart(7) + 'name'.padStart(6) + 'subtitle'.padStart(10) + '   approved source');
for (const [name, c] of [...clusters.entries()].sort()) {
  console.log(
    name.padEnd(28) + String(c.routes).padStart(7) + String(c.named).padStart(6) +
    String(c.subtitled).padStart(10) + '   ' + [...c.sources].join(', ')
  );
}
console.log('');
console.log(`approved NAME readable    : ${uncovered.length - unreadable.length} of ${uncovered.length}`);
console.log(`approved SUBTITLE present : ${[...clusters.values()].reduce((a, c) => a + c.subtitled, 0)} of ${uncovered.length}`);
console.log('  Where no approved subtitle exists the field is emitted BLANK.');
console.log('  A composed subtitle would be invention; a blank one is correct.');
console.log('');
if (unreadable.length) {
  console.log('STOP on these routes only - no approved name can be read:');
  for (const u of unreadable) console.log('  ' + u);
} else {
  console.log('No route triggers the section 6 stop condition: every name is reusable, none is written.');
}
process.exit(unreadable.length ? 1 : 0);
