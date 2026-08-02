import fs from 'node:fs';
import path from 'node:path';
import { failIfDiffs, fromRoot, readText } from './common.mjs';

const rulings = [
  ['/product/porta-cabins', 'porta cabins', 'estimate your cabin cost live', 'If you want the number before you talk to us, you can estimate your cabin cost live and send the same configuration in for a fixed quotation.'],
  ['/product/portable-office', 'portable office', 'build a live price estimate', 'Before requesting a quote, you can build a live price estimate with your own size, finishes and add-ons.'],
  ['/product/container-offices', 'container offices', 'price your configuration online', 'For a configured figure rather than a table, price your configuration online and submit it for the fixed quotation.'],
  ['/product/labor-colony', 'labor colony', 'size and price a colony building', 'To match a building to your headcount, you can size and price a colony building and send the result to our team.'],
].map(([hub, primary, anchor, sentence]) => ({ hub, primary, anchor, sentence }));

function sourceFiles(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...sourceFiles(fullPath));
    else if (/\.(?:ts|tsx|js|jsx|json|md)$/.test(entry.name)) results.push(fullPath);
  }
  return results;
}

const texts = sourceFiles(fromRoot('src')).map((file) => ({ file, text: fs.readFileSync(file, 'utf8') }));
const renderLayer = readText('src', 'pages', 'product', '[category]', 'index.tsx');
const diffs = [];

console.log('FOUR CLUSTER-HUB ANCHORS');
for (const ruling of rulings) {
  const declaration = `anchor: '${ruling.anchor}'`;
  const occurrences = texts.flatMap(({ file, text }) => {
    const count = text.split(declaration).length - 1;
    return count ? [{ file: path.relative(fromRoot(), file), count }] : [];
  });
  const total = occurrences.reduce((sum, item) => sum + item.count, 0);
  const exactMatch = ruling.anchor.toLocaleLowerCase('en') === ruling.primary;
  console.log(`${ruling.hub} | "${ruling.anchor}" | occurrences ${total} | exact primary match ${exactMatch ? 'YES' : 'NO'}`);
  if (total !== 1) diffs.push(`${ruling.anchor}: expected one render-layer anchor declaration, found ${total} (${occurrences.map((item) => `${item.file}:${item.count}`).join(', ') || 'none'})`);
  if (exactMatch) diffs.push(`${ruling.anchor}: exact-matches primary keyword ${ruling.primary}`);
  if (!renderLayer.includes(ruling.sentence)) diffs.push(`${ruling.hub}: exact ruled sentence missing from category render layer`);
  if (!renderLayer.includes(`anchor: '${ruling.anchor}'`)) diffs.push(`${ruling.hub}: anchor declaration missing from category render layer`);
}
if (new Set(rulings.map((item) => item.anchor)).size !== rulings.length) diffs.push('ruled anchors are not mutually unique');
console.log('');
failIfDiffs('hub-anchor', diffs);
