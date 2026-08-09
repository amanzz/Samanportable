/**
 * CALC-L4 item 2 §2.1 / gate G7. Reads the real resolver and the real ladder
 * table - no reimplementation - and reports, for every product route in
 * public/sitemap-products.xml:
 *   does it get a calculator, and if it does, does it publish a ladder?
 * A route with a calculator but no ladder renders the existing no-ladder
 * "Design your {product}" behaviour. That is the authorised pattern; a rate is
 * never invented to make a route work.
 */
import fs from 'node:fs';
import path from 'node:path';
import { resolveEmbeddedCalculatorProduct } from '../../src/lib/cabinCalculatorEmbedRoutes.ts';
import { getRouteLadder } from '../../src/lib/calculatorLadders.ts';

const xml = fs.readFileSync('public/sitemap-products.xml', 'utf8');
const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
  .filter((r) => r.startsWith('/product/'));

type Row = {
  route: string;
  category: string;
  slug: string | null;
  hasCalculator: boolean;
  productId: string | null;
  ladderKey: string | null;
  ladderRows: number;
  behaviour: string;
};

const rows: Row[] = routes.map((route) => {
  const parts = route.split('/').filter(Boolean); // ['product', category, slug?]
  const category = parts[1];
  const slug = parts[2] || null;
  const resolved = resolveEmbeddedCalculatorProduct(category, slug || undefined);
  const ladder = resolved ? getRouteLadder(resolved.ladderKey) : null;
  return {
    route,
    category,
    slug,
    hasCalculator: !!resolved,
    productId: resolved?.productId ?? null,
    ladderKey: resolved?.ladderKey ?? null,
    ladderRows: ladder ? ladder.length : 0,
    behaviour: !resolved
      ? 'NO CALCULATOR'
      : ladder && ladder.length
        ? `priced from own ladder (${ladder.length} rows)`
        : 'no-ladder "Design your {product}"',
  };
});

const withCalc = rows.filter((r) => r.hasCalculator);
const withoutCalc = rows.filter((r) => !r.hasCalculator);
const calcNoLadder = withCalc.filter((r) => r.ladderRows === 0);

console.log(`product routes in sitemap-products.xml: ${rows.length}`);
console.log(`  WITH calculator today: ${withCalc.length}`);
console.log(`    of those, priced from own ladder: ${withCalc.length - calcNoLadder.length}`);
console.log(`    of those, no-ladder "Design your {product}": ${calcNoLadder.length}`);
console.log(`  WITHOUT calculator today: ${withoutCalc.length}`);

const byCategory = new Map<string, Row[]>();
for (const r of withoutCalc) {
  if (!byCategory.has(r.category)) byCategory.set(r.category, []);
  byCategory.get(r.category)!.push(r);
}
console.log(`\n--- routes with NO calculator, by category (${withoutCalc.length} total) ---`);
for (const [cat, list] of [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const laddered = list.filter((r) => getRouteLadder(r.slug || r.category)).length;
  console.log(`${cat}: ${list.length} routes, ${laddered} of which publish a ladder under their own key`);
  for (const r of list) {
    const own = getRouteLadder(r.slug || r.category);
    console.log(`   ${r.route}  ladderKey="${r.slug || r.category}" -> ${own ? `${own.length} rows` : 'NO LADDER -> would render "Design your {product}"'}`);
  }
}

console.log(`\n--- the ${calcNoLadder.length} routes that already render no-ladder behaviour ---`);
for (const r of calcNoLadder) console.log(`   ${r.route}  productId=${r.productId} ladderKey=${r.ladderKey}`);

fs.mkdirSync('reports/calc-L4', { recursive: true });
fs.writeFileSync(path.join('reports/calc-L4', 'route-coverage-before.json'), JSON.stringify({
  total: rows.length,
  withCalculator: withCalc.length,
  withoutCalculator: withoutCalc.length,
  calculatorButNoLadder: calcNoLadder.length,
  rows,
}, null, 2));
