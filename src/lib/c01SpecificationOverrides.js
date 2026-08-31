const generatedC01Specifications = require('../data/products/c01-specifications.json');
const c01SpecificationOverrideRegistry = require('../data/products/c01-specification-overrides.json');

const ERROR_CODE = 'STALE_OR_INVALID_SPECIFICATION_OVERRIDE';
const APPROVED_PRODUCT_SLUG = 'porta-cabins';
const APPROVED_ROW_LABEL = 'Fasteners & sealing';
const REQUIRED_STRING_FIELDS = [
  'id',
  'productSlug',
  'rowLabel',
  'expectedSourceWorkbook',
  'expectedSourceWorkbookMd5',
  'expectedBaseDetail',
  'replacementDetail',
  'authorityType',
  'authorityDecision',
  'authorityPackage',
  'reason',
  'scope',
  'siblingPolicy',
  'sunsetCondition',
];

function fail(reason) {
  throw new Error(`${ERROR_CODE}: ${reason}`);
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validateC01SpecificationOverrides(
  dataset = generatedC01Specifications,
  registry = c01SpecificationOverrideRegistry
) {
  if (!isRecord(dataset) || !isRecord(dataset.products)) {
    fail('generated dataset or products map is missing');
  }
  if (!isRecord(registry) || registry.schemaVersion !== 1 || !Array.isArray(registry.overrides)) {
    fail('registry schemaVersion or overrides array is invalid');
  }
  if (registry.overrides.length !== 1) {
    fail(`expected exactly one approved override, found ${registry.overrides.length}`);
  }

  const ids = new Set();
  const productRowKeys = new Set();
  for (const override of registry.overrides) {
    if (!isRecord(override)) fail('override entry is not an object');
    for (const field of REQUIRED_STRING_FIELDS) {
      if (typeof override[field] !== 'string' || override[field].trim() === '') {
        fail(`override field ${field} must be a non-empty string`);
      }
    }

    if (ids.has(override.id)) fail(`duplicate override id ${override.id}`);
    ids.add(override.id);

    const productRowKey = `${override.productSlug}\u0000${override.rowLabel}`;
    if (productRowKeys.has(productRowKey)) {
      fail(`duplicate product/row override ${override.productSlug}/${override.rowLabel}`);
    }
    productRowKeys.add(productRowKey);

    if (
      override.productSlug !== APPROVED_PRODUCT_SLUG ||
      override.rowLabel !== APPROVED_ROW_LABEL
    ) {
      fail(`unauthorized target ${override.productSlug}/${override.rowLabel}`);
    }
    if (override.authorityType !== 'OWNER_APPROVED_CORRECTION') {
      fail(`unsupported authorityType ${override.authorityType}`);
    }
    if (override.authorityDecision !== 'Fasteners = A') {
      fail(`unsupported authorityDecision ${override.authorityDecision}`);
    }
    if (override.authorityPackage !== 'PC-01 content package v2.7') {
      fail(`unsupported authorityPackage ${override.authorityPackage}`);
    }
    if (override.scope !== 'PC-01 runtime/rendered specification only') {
      fail(`unsupported scope ${override.scope}`);
    }
    if (override.siblingPolicy !== 'DO_NOT_CHANGE') {
      fail(`unsupported siblingPolicy ${override.siblingPolicy}`);
    }
    if (dataset.sourceWorkbook !== override.expectedSourceWorkbook) {
      fail('generated sourceWorkbook does not match the approved override');
    }
    if (dataset.sourceWorkbookMd5 !== override.expectedSourceWorkbookMd5) {
      fail('generated sourceWorkbookMd5 does not match the approved override');
    }

    const product = dataset.products[override.productSlug];
    if (!isRecord(product) || !Array.isArray(product.specifications)) {
      fail(`target product ${override.productSlug} is missing or invalid`);
    }
    const matchingRows = product.specifications.filter(
      (row) => isRecord(row) && row.component === override.rowLabel
    );
    if (matchingRows.length !== 1) {
      fail(`expected one ${override.rowLabel} row, found ${matchingRows.length}`);
    }
    if (matchingRows[0].detail !== override.expectedBaseDetail) {
      fail(`base detail does not match for ${override.productSlug}/${override.rowLabel}`);
    }
  }

  return true;
}

function getEffectiveC01SpecificationEntry(
  productSlug,
  dataset = generatedC01Specifications,
  registry = c01SpecificationOverrideRegistry
) {
  validateC01SpecificationOverrides(dataset, registry);
  const baseEntry = dataset.products[productSlug];
  if (!baseEntry) return undefined;

  const matchingOverrides = registry.overrides.filter(
    (override) => override.productSlug === productSlug
  );
  if (productSlug === APPROVED_PRODUCT_SLUG && matchingOverrides.length !== 1) {
    fail(`expected exactly one matching override for ${APPROVED_PRODUCT_SLUG}`);
  }
  if (matchingOverrides.length > 1) {
    fail(`multiple overrides target ${productSlug}`);
  }

  const effectiveRows = baseEntry.specifications.map((row) => {
    const override = matchingOverrides.find((item) => item.rowLabel === row.component);
    return override ? { ...row, detail: override.replacementDetail } : { ...row };
  });

  return { ...baseEntry, specifications: effectiveRows };
}

function getEffectiveC01Specifications(
  productSlug,
  dataset = generatedC01Specifications,
  registry = c01SpecificationOverrideRegistry
) {
  return getEffectiveC01SpecificationEntry(productSlug, dataset, registry)?.specifications;
}

module.exports = {
  ERROR_CODE,
  getEffectiveC01SpecificationEntry,
  getEffectiveC01Specifications,
  validateC01SpecificationOverrides,
};
