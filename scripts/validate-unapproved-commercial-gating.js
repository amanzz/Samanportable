const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const readJson = relativePath => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), 'utf8')
);

const architecture = readJson('src/data/seo/commercialArchitecture.json');
const gating = readJson('src/data/seo/unapprovedCommercialGating.json');
const canonicalPaths = readJson('src/lib/sitemapCanonicalPaths.json');
const errors = [];

if (gating.status !== 'TEMPORARY_OWNER_DISPOSITION_PENDING') {
  errors.push(`unexpected gating status: ${gating.status}`);
}
if (!Array.isArray(gating.paths) || gating.paths.length !== 63) {
  errors.push(`expected exactly 63 gated paths, found ${gating.paths?.length ?? 'none'}`);
}

const uniquePaths = new Set(gating.paths || []);
if (uniquePaths.size !== (gating.paths || []).length) {
  errors.push('gated paths contain duplicates');
}

const approvedOrPlanned = new Set([
  ...architecture.approvedProductionPaths,
  ...architecture.plannedReleasePaths,
]);
const sitemapInputs = new Set(canonicalPaths);
const expectedPreExcludedPaths = new Set([
  '/product/roofing-sheet/metal-roofing-sheet',
  '/product/roofing-sheet/pvc-roofing-sheet',
  '/product-category/container-offices',
]);

for (const commercialPath of uniquePaths) {
  if (!/^\/product(?:-category)?\//.test(commercialPath)) {
    errors.push(`not a normalized commercial path: ${commercialPath}`);
  }
  if (approvedOrPlanned.has(commercialPath)) {
    errors.push(`approved or planned path must not be temporarily gated: ${commercialPath}`);
  }
  if (!sitemapInputs.has(commercialPath) && !expectedPreExcludedPaths.has(commercialPath)) {
    errors.push(`audit path is absent from the current sitemap input: ${commercialPath}`);
  }
}

for (const commercialPath of expectedPreExcludedPaths) {
  if (!uniquePaths.has(commercialPath)) {
    errors.push(`expected pre-excluded gated path is missing: ${commercialPath}`);
  }
  if (sitemapInputs.has(commercialPath)) {
    errors.push(`pre-excluded gated path re-entered sitemap input: ${commercialPath}`);
  }
}

const requiredConsumers = [
  'src/middleware.ts',
  'src/lib/staticContent.ts',
  'scripts/collect-image-manifest.mjs',
  'scripts/generate-segmented-sitemaps.mjs',
  'src/pages/api/dynamic-sitemap.xml.ts',
];
for (const relativePath of requiredConsumers) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  if (!source.includes('unapprovedCommercialGating')) {
    errors.push(`gating fixture is not consumed by ${relativePath}`);
  }
}

if (errors.length) {
  console.error('Temporary commercial gating invalid:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  'Temporary commercial gating valid: 63 exact paths, no approved/planned overlap, '
  + 'and 3 stricter lifecycle/category exclusions preserved.'
);
