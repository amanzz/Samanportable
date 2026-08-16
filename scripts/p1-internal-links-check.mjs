// P1 Phase 2: cross-reference every internal href in Header/Footer/CategoryGrid
// and the porta-cabins cluster rail against the real redirects() array. Any
// href that IS a redirect source is a retired-source-in-internal-links defect.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('../next.config.js');
const rules = await config.redirects();
const sourceSet = new Set(rules.map((r) => r.source));

const FILES = [
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/components/CategoryGrid.tsx',
  'src/lib/portaCabinClusterRail.ts',
];

let totalHrefs = 0;
const hits = [];
for (const f of FILES) {
  const text = fs.readFileSync(f, 'utf8');
  const matches = [...text.matchAll(/href[:=]\s*['"`](\/[a-zA-Z0-9\-_/]*)['"`]/g)];
  for (const m of matches) {
    totalHrefs++;
    const path = m[1].replace(/\/$/, '') || '/';
    if (sourceSet.has(path) || sourceSet.has(m[1])) {
      hits.push({ file: f, href: m[1] });
    }
  }
}
console.log(`Checked ${totalHrefs} hrefs across ${FILES.length} files.`);
console.log(`Retired-source hrefs found: ${hits.length}`);
for (const h of hits) console.log(`  ${h.file}: ${h.href}`);
