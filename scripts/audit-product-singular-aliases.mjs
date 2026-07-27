import fs from 'node:fs';
import path from 'node:path';

const base = (process.env.ALIAS_AUDIT_BASE || '').replace(/\/$/, '');
if (!base) throw new Error('Set ALIAS_AUDIT_BASE.');

const productsDir = path.join(process.cwd(), 'src', 'data', 'wp-export', 'products');
const products = fs.readdirSync(productsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(fs.readFileSync(path.join(productsDir, file), 'utf8')));

const candidates = [];
for (const product of products) {
  const category = product.categories?.[0]?.slug || '';
  if (!category.endsWith('s') || category === 'porta-cabins') continue;
  const singular = category.slice(0, -1);
  candidates.push({
    category,
    singular,
    slug: product.slug,
    alias: `/product/${singular}/${product.slug}`,
  });
}

const audited = await Promise.all(candidates.map(async candidate => {
  const response = await fetch(`${base}${candidate.alias}`, { redirect: 'manual' });
  return {
    ...candidate,
    status: response.status,
    location: response.headers.get('location') || '',
  };
}));

const portableCabin = products
  .filter(product => product.categories?.[0]?.slug === 'portable-cabin')
  .map(product => `/product/portable-cabin/${product.slug}`);
const portableAudited = await Promise.all(portableCabin.map(async pathname => {
  const response = await fetch(`${base}${pathname}`, { redirect: 'manual' });
  return { pathname, status: response.status, location: response.headers.get('location') || '' };
}));

const group = rows => Object.values(rows.reduce((acc, row) => {
  const key = `${row.category}|${row.singular}`;
  acc[key] ||= {
    category: row.category,
    singular: row.singular,
    candidates: 0,
    resolves200: 0,
    redirects: 0,
    errors: 0,
  };
  acc[key].candidates++;
  if (row.status === 200) acc[key].resolves200++;
  else if (row.status >= 300 && row.status < 400) acc[key].redirects++;
  else acc[key].errors++;
  return acc;
}, {})).sort((a, b) => a.category.localeCompare(b.category));

const result = {
  c01ExcludedFromChanges: true,
  otherSingularCandidates: audited.length,
  otherSingular200: audited.filter(row => row.status === 200).length,
  groups: group(audited),
  resolvedAliases: audited.filter(row => row.status === 200),
  non200Candidates: audited.filter(row => row.status !== 200),
  portableCabin: {
    note: 'portable-cabin is an actual canonical category slug, not a singular alias',
    candidates: portableAudited.length,
    resolves200: portableAudited.filter(row => row.status === 200).length,
    rows: portableAudited,
  },
};
console.log(JSON.stringify(result, null, 2));
