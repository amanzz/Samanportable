#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(import.meta.url);
const manifestPath = path.join(root, 'page-structure/pdf-sources/pc01-porta-cabins-v1.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const productPath = path.join(root, manifest.productDataPath);
const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));
const { getEffectiveC01SpecificationEntry } = require(path.join(
  root,
  manifest.effectiveSpecificationModule
));
const effective = getEffectiveC01SpecificationEntry(product.productSlug);

function fail(message) {
  throw new Error(`PC01_PDF_SOURCE_INVALID: ${message}`);
}

if (!effective || !Array.isArray(effective.specifications)) {
  fail('effective C01 specification entry is missing');
}
if (effective.specifications.length !== 30) {
  fail(`expected 30 effective specification rows, found ${effective.specifications.length}`);
}
if (!Array.isArray(product.variants) || product.variants.length !== 6) {
  fail(`expected six published variants, found ${product.variants?.length ?? 0}`);
}
if (product.specPdfHref !== manifest.activePdfHref) {
  fail(`product selects ${product.specPdfHref}, expected ${manifest.activePdfHref}`);
}
if (product.gstPercent !== 18) fail(`expected 18% GST, found ${product.gstPercent}`);

const weightText = product.descriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const variants = product.variants.map((variant) => {
  const occupancy = /^Recommended occupancy (\d+)[–-](\d+) people$/.exec(variant.capacity);
  if (!occupancy) fail(`unparseable occupancy for ${variant.sizeSlug}`);
  const labelPattern = variant.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const weight = new RegExp(`${labelPattern} approximately ([0-9.]+) tonnes`).exec(weightText);
  if (!weight) fail(`approved approximate weight is missing for ${variant.sizeSlug}`);
  const gaPath = product.explorerImageTemplate?.[variant.sizeSlug];
  if (typeof gaPath !== 'string' || !gaPath.endsWith(`porta-cabin-ga-plan-${variant.sizeSlug}.webp`)) {
    fail(`approved GA path is missing or altered for ${variant.sizeSlug}`);
  }
  const assetPath = path.join(root, 'public', gaPath.replace(/^\//, ''));
  if (!fs.existsSync(assetPath)) fail(`approved GA asset does not exist: ${gaPath}`);
  return {
    sizeSlug: variant.sizeSlug,
    label: variant.label,
    dimensions: variant.dims,
    areaSqft: variant.areaSqft,
    occupancy: `${occupancy[1]}-${occupancy[2]} people`,
    approximateWeightTonnes: Number(weight[1]),
    priceExGst: variant.priceExGst,
    priceInclGst: variant.priceInclGst,
    gaPath
  };
});

const expectedOrder = ['10x10', '20x8', '20x10', '20x12', '30x10', '40x10'];
if (variants.map((item) => item.sizeSlug).join(',') !== expectedOrder.join(',')) {
  fail('published variant order changed');
}

const output = {
  manifest,
  product: {
    productSlug: product.productSlug,
    h1: product.h1,
    hsn: product.hsn,
    gstPercent: product.gstPercent,
    specPdfHref: product.specPdfHref
  },
  variants,
  specifications: effective.specifications.map(({ group, component, detail }) => ({
    group,
    component,
    detail
  }))
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
