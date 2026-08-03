/**
 * Locked product name on every route that carries a calculator.
 *
 * Enumerates every /product/ URL in public/sitemap-products.xml, runs each
 * through the real resolveEmbeddedCalculatorProduct(), and reports the product
 * name the embedded calculator locks to plus the ladder it prices from.
 *
 * Porta Cabin against Portable Cabin is the highest-risk term pair on this
 * site, so the name is asserted, not merely printed: any route under
 * /product/porta-cabins/ that does not lock to a Porta-Cabin-family product is
 * a failure.
 *
 * Run: node scripts/calculator/report-locked-product-names.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import jitiPkg from 'jiti';
import { fromRoot } from './common.mjs';

const SRC = path.join(process.cwd(), 'src');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(SRC, request.slice(2));
  }
  return resolveFilename.call(this, request, ...rest);
};

const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const { PRODUCTS } = jiti('./src/lib/cabinCalculatorSSR.ts');
const { resolveEmbeddedCalculatorProduct } = jiti('./src/lib/cabinCalculatorEmbedRoutes.ts');
const { getRouteLadder } = jiti('./src/lib/calculatorLadders.ts');

/** Colony products price from a block ladder chosen by index, not by L×W. */
const COLONY = new Set(['labour-colony', 'labor-sheds', 'labor-hutments', 'prefab-labor-camps']);

const sitemap = fs.readFileSync(fromRoot('public', 'sitemap-products.xml'), 'utf8');
const urls = [...new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1].split('samanportable.com')[1] || '')
    .filter((u) => u.startsWith('/product/'))
)].sort();

const nameOf = (id) => PRODUCTS.find((p) => p.id === id)?.name ?? '(unknown)';
const pad = (s, n) => String(s).padEnd(n);

const withCalculator = [];
const without = [];
for (const url of urls) {
  const parts = url.replace(/\/$/, '').split('/').filter(Boolean);
  if (parts[0] !== 'product' || parts.length < 2) continue;
  const [, category, slug] = parts;
  const mapping = resolveEmbeddedCalculatorProduct(category, slug);
  if (!mapping) { without.push({ url, category }); continue; }
  withCalculator.push({
    url,
    category,
    productId: mapping.productId,
    name: nameOf(mapping.productId),
    ladderKey: mapping.ladderKey,
    hasLadder: COLONY.has(mapping.productId) || Boolean(getRouteLadder(mapping.ladderKey)),
    isColony: COLONY.has(mapping.productId),
  });
}

console.log(`LOCKED PRODUCT NAME — ${withCalculator.length} routes carry a calculator\n`);
console.log(pad('ROUTE', 56) + pad('LOCKED NAME', 24) + pad('PRICES FROM', 30) + 'MODE');
console.log('-'.repeat(126));
for (const r of withCalculator) {
  console.log(
    pad(r.url, 56) + pad(r.name, 24) +
    pad(r.isColony ? `${r.productId} blocks` : r.hasLadder ? r.ladderKey : '—', 30) +
    (r.isColony ? 'block ladder' : r.hasLadder ? 'ladder' : 'quote mode, no number')
  );
}

// --- assertions -----------------------------------------------------------
const diffs = [];
const PORTA_FAMILY = new Set(['porta-cabin', 'office-cabin', 'toilet-cabin', 'security-cabin', 'accommodation-cabin']);
for (const r of withCalculator) {
  if (r.category === 'porta-cabins' && !PORTA_FAMILY.has(r.productId)) {
    diffs.push(`${r.url}: under /porta-cabins/ but locks to "${r.name}" (${r.productId})`);
  }
  if (r.category === 'porta-cabins' && r.name === 'Portable Cabin') {
    diffs.push(`${r.url}: renders "Portable Cabin" on a Porta Cabin route`);
  }
}

const reachable = new Set(withCalculator.map((r) => r.productId));
const unreachable = PRODUCTS.filter((p) => !reachable.has(p.id));
console.log(`\nPRODUCTS WITH NO ROUTE THAT CAN LOCK TO THEM: ${unreachable.length}`);
for (const p of unreachable) console.log(`  ${pad(p.id, 28)} ${p.name}`);

const noLadder = withCalculator.filter((r) => !r.hasLadder);
console.log(`\nROUTES IN QUOTE MODE (no ladder of their own): ${noLadder.length}`);
for (const r of noLadder) console.log(`  ${r.url}`);

const byCategory = without.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {});
console.log(`\nROUTES WITHOUT A CALCULATOR: ${without.length}`);
for (const [cat, n] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${pad(cat, 30)} ${n}`);
}

console.log('\n' + '='.repeat(126));
if (diffs.length) {
  console.log(`LOCKED NAME: FAIL — ${diffs.length} wrong`);
  for (const d of diffs) console.log(`  - ${d}`);
  process.exit(1);
}
console.log(`LOCKED NAME: PASS — all ${withCalculator.length} routes correct`);
