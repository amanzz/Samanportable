const fs = require('fs');
const path = require('path');

const rentDir = path.join(__dirname, '../src/pages/container-rent-services');
const files = fs.readdirSync(rentDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(rentDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if BreadcrumbList is already injected
  if (content.includes('"@type": "BreadcrumbList"')) {
    console.log(`Skipping ${file} - BreadcrumbList already present`);
    return;
  }

  // Find the Product schema script block
  const scriptRegex = /<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*"(\\{.*?\}|.*?)"\s*\}\}\s*\/>/;
  const match = content.match(scriptRegex);
  
  if (!match) {
    console.warn(`Could not find Product schema script in ${file}`);
    return;
  }

  // Extract name and slug
  const slug = file.replace('.tsx', '');
  // Extract display name (e.g. "10x8 Container Office Rental")
  let name = slug.split('-').map(word => {
    if (word === 'porta' || word === 'cabin' || word === 'container' || word === 'office' || word === 'rental') {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');

  // Standardize naming (e.g. 10x8 -> 10x8, 20x10 -> 20x10)
  name = name.replace(/(\d+)x(\d+)/i, '$1x$2');

  const breadcrumbSchema = `
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.samanportable.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Rental Services",
                "item": "https://www.samanportable.com/rental-services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "${name}",
                "item": "https://www.samanportable.com/container-rent-services/${slug}"
              }
            ]
          }) }}
        />`;

  // Insert breadcrumb script after the product script block
  const fullMatch = match[0];
  const newScriptBlock = fullMatch + breadcrumbSchema;
  
  content = content.replace(fullMatch, newScriptBlock);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully injected BreadcrumbList into ${file}`);
});
