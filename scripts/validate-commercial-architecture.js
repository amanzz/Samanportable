const fs = require('fs');
const path = require('path');
const architecture = require('../src/data/seo/commercialArchitecture.json');
const customCanonicalPaths = require('../src/lib/customProductCanonicalPaths.json');

// PO-06 (6 Sep 2026) - /product/portable-office/construction-site-cabin ships, so it
// moves out of the planned-release backlog and into the approved production list. The
// PO-07 (6 Sep 2026) - /product/portable-office/portable-control-room ships, so it
// moves out of the planned-release backlog into the approved production list. The
// fixture counts move with it: 63 -> 64 approved, 41 -> 40 planned.
// PO-07 (6 Sep 2026) - /product/portable-office/portable-control-room ships too.
// PO-05 (6 Sep 2026) - and /product/portable-office/portable-mobile-laboratory with it.
// PO-06 and PO-07 both landed on static-migration while this branch was open, so three
// pages leave the backlog in all: 63 -> 66 approved, 41 -> 38 planned.
const EXPECTED = { approved: 66, planned: 38 };
const strict = process.argv.includes('--strict') || process.env.SAMAN_STRICT_PRODUCTION_DATA === 'true';
const failures = [];
const warnings = [];
const approved = new Set(architecture.approvedProductionPaths);
const planned = new Set(architecture.plannedReleasePaths);

if (architecture.plannedReleaseBacklogCurrentCount !== EXPECTED.planned) {
  failures.push(
    `planned-release current count is ${architecture.plannedReleaseBacklogCurrentCount}, expected ${EXPECTED.planned}`,
  );
}

if (approved.size !== EXPECTED.approved) failures.push(`approved production path count is ${approved.size}, expected ${EXPECTED.approved}`);
if (planned.size !== EXPECTED.planned) failures.push(`planned-release path count is ${planned.size}, expected ${EXPECTED.planned}`);
for (const url of approved) {
  if (planned.has(url)) failures.push(`path is both production-approved and planned-release: ${url}`);
}

const customCanonicalBySlug = new Map(customCanonicalPaths.map((entry) => [entry.slug, entry.canonicalPath]));
const productDir = path.join(process.cwd(), 'src', 'data', 'wp-export', 'products');
const productPaths = new Map();

for (const filename of fs.readdirSync(productDir).filter((name) => name.endsWith('.json'))) {
  const product = JSON.parse(fs.readFileSync(path.join(productDir, filename), 'utf8'));
  const category = product.category_slug || product.categories?.[0]?.slug;
  if (!product.slug || !category) continue;
  const productPath = customCanonicalBySlug.get(product.slug) || (product.slug === category
    ? `/product/${category}`
    : `/product/${category}/${product.slug}`);
  productPaths.set(productPath, { filename, product });
}

const missingApprovedData = [];
const nonPublishedApproved = [];
for (const url of approved) {
  const record = productPaths.get(url);
  if (!record) missingApprovedData.push(url);
  else if (record.product.status && record.product.status !== 'publish') {
    nonPublishedApproved.push(`${url} (${record.filename}: ${record.product.status})`);
  }
}

const plannedRecords = [];
const publishedPlannedRecords = [];
for (const url of planned) {
  const record = productPaths.get(url);
  if (!record) continue;
  const detail = `${url} (${record.filename}: ${record.product.status || 'status missing'})`;
  plannedRecords.push(detail);
  if (!record.product.status || record.product.status === 'publish') publishedPlannedRecords.push(detail);
}

if (missingApprovedData.length) {
  const message = `${missingApprovedData.length} approved live paths lack product data: ${missingApprovedData.join(', ')}`;
  strict ? failures.push(message) : warnings.push(message);
}
if (nonPublishedApproved.length) {
  const message = `approved live records are not published: ${nonPublishedApproved.join(', ')}`;
  strict ? failures.push(message) : warnings.push(message);
}
if (publishedPlannedRecords.length) {
  const message = `${publishedPlannedRecords.length} planned-release paths have publish-status records: ${publishedPlannedRecords.join(', ')}`;
  strict ? failures.push(message) : warnings.push(message);
}

if (warnings.length) console.warn(`Commercial architecture warnings:\n- ${warnings.join('\n- ')}`);
if (failures.length) {
  console.error(`Commercial architecture validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(
  `Commercial architecture valid: ${approved.size} approved live paths and ${planned.size} planned-release paths`
  + ` (${plannedRecords.length} retained draft record${plannedRecords.length === 1 ? '' : 's'}).`,
);
