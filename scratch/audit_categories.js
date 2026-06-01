const fs = require('fs');
const path = require('path');

const products = require('./all_products_detailed.json');

const categoriesToAudit = [
  { label: "Porta Cabin", current: "/product/porta-cabins", slugMatch: "porta-cabins" },
  { label: "Portable Cabin", current: "/product/portable-cabin", slugMatch: "portable-cabin" },
  { label: "Portable Office Cabin", current: "/product/portable-office", slugMatch: "portable-office" },
  { label: "Container Office", current: "/product/container-offices", slugMatch: "container-offices" },
  { label: "Container Cafe", current: "/product/container-cafe", slugMatch: "container-cafe" },
  { label: "Labour Colony", current: "/product/labor-colony", slugMatch: "labor-colony" },
  { label: "Container House", current: "/product/container-houses", slugMatch: "container-houses" },
  { label: "Security Cabin", current: "/product/security-cabins", slugMatch: "security-cabins" },
  { label: "Portable Toilet", current: "/product/portable-toilet", slugMatch: "portable-toilet" },
  { label: "Industrial Shed", current: "/product/industrial-sheds", slugMatch: "industrial-sheds" },
  { label: "PEB Construction", current: "/product-category/peb-constructions", slugMatch: "peb-constructions" },
  { label: "Pre-Engineered Building", current: "/product-category/pre-engineered-buildings", slugMatch: "pre-engineered-buildings" },
  { label: "Prefab Building", current: "/product-category/prefab-buildings", slugMatch: "prefab-buildings" },
  { label: "Prefabricated House", current: "/product/prefabricated-houses", slugMatch: "prefabricated-houses" }
];

console.log('Auditing Footer Categories and identifying candidate products:\n');

categoriesToAudit.forEach((cat) => {
  console.log(`=== Category: ${cat.label} ===`);
  console.log(`Current URL: ${cat.current}`);
  
  // Find all products matching this category slug
  const matchingProducts = products.filter((p) => {
    return p.categories.some((c) => c.slug === cat.slugMatch || c.slug.replace('s', '') === cat.slugMatch.replace('s', ''));
  });
  
  console.log(`Found ${matchingProducts.length} matching products:`);
  matchingProducts.slice(0, 10).forEach((p) => {
    const relativeUrl = p.permalink.replace('https://blog.samanportable.com', '');
    console.log(`  - Product: "${p.name}" -> URL: ${relativeUrl} (slug: ${p.slug})`);
  });
  console.log('\n');
});
