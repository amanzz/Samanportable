const fs = require('fs');
const path = require('path');

function analyzeFile(filename, label) {
  console.log(`=== Analyzing ${label} (${filename}) ===`);
  const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');

  // Check if file is actually a 404
  if (content.includes('<title>404 - Page Not Found')) {
    console.log('Error: This is a 404 Page Not Found response!');
    return;
  }

  // 1. Search for H1 tags in DOM
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  console.log(`H1 Tags found: ${h1Matches.length}`);
  h1Matches.forEach((m, idx) => {
    console.log(`  H1 [${idx + 1}]: ${m.replace(/<[^>]*>/g, '').trim()}`);
  });

  // 2. Search for H2 tags in DOM
  const h2Matches = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  console.log(`H2 Tags found: ${h2Matches.length}`);
  h2Matches.slice(0, 5).forEach((m, idx) => {
    console.log(`  H2 [${idx + 1}]: ${m.replace(/<[^>]*>/g, '').trim()}`);
  });

  // 3. Check for specific keywords inside the body (excluding head schemas)
  // Let's split content into head and body
  const headEndIdx = content.toLowerCase().indexOf('</head>');
  const bodyContent = headEndIdx !== -1 ? content.slice(headEndIdx) : content;

  // Visual text search in body
  const hasDescription = bodyContent.includes('Transforming Modern Living') || bodyContent.includes('Introduction: Why Luxury');
  const hasSpecsTable = bodyContent.includes('Technical Specifications') || bodyContent.includes('Construction Details');
  const hasVisualFAQs = bodyContent.includes('What is the cost of a Luxury') || bodyContent.includes('How long does installation');

  console.log(`Body Contains Product Description Text: ${hasDescription ? 'YES' : 'NO'}`);
  console.log(`Body Contains Specifications Table: ${hasSpecsTable ? 'YES' : 'NO'}`);
  console.log(`Body Contains Visual FAQs: ${hasVisualFAQs ? 'YES' : 'NO'}`);

  // 4. Check for JSON-LD schemas in <head>
  const headContent = headEndIdx !== -1 ? content.slice(0, headEndIdx) : '';
  const ldJsonScripts = headContent.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log(`JSON-LD Schema Tags in Head: ${ldJsonScripts.length}`);
  ldJsonScripts.forEach((script, idx) => {
    const jsonText = script.replace(/<script[^>]*>|<\/script>/gi, '').trim();
    try {
      const parsed = JSON.parse(jsonText);
      console.log(`  Schema [${idx + 1}]: @type = ${parsed['@type'] || parsed.map?.(x => x['@type']).join(', ')}`);
    } catch (e) {
      console.log(`  Schema [${idx + 1}]: (Failed to parse JSON) - Snippet: ${jsonText.slice(0, 100)}...`);
    }
  });

  // 5. Look for dynamic load skeletons
  const hasPulse = bodyContent.includes('animate-pulse') || bodyContent.includes('skeleton') || bodyContent.includes('bg-muted');
  console.log(`Dynamic load skeleton/placeholder in Body: ${hasPulse ? 'YES' : 'NO'}`);

  console.log('\n');
}

analyzeFile('luxury-porta-cabin-source.html', 'Product Detail Page');
analyzeFile('porta-cabins-category-source.html', 'Product Category Hub Page');
analyzeFile('../blog-source.html', 'Blog Detail Page');
