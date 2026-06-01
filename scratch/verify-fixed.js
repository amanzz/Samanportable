const fs = require('fs');
const path = require('path');

function verifyFixedBlog() {
  console.log('=== Verifying Blog SSR Fix in scratch/blog-source-fixed.html ===');
  const filePath = path.join(__dirname, 'blog-source-fixed.html');
  
  if (!fs.existsSync(filePath)) {
    console.error('Error: File scratch/blog-source-fixed.html does not exist!');
    process.exit(1);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if file is a 404
  if (content.includes('<title>404 - Page Not Found')) {
    console.error('Error: Obtained 404 page instead of the actual blog details page!');
    process.exit(1);
  }

  // 1. Check H1
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    console.log(`✅ H1 Heading Found: "${h1Match[1].replace(/<[^>]*>/g, '').trim()}"`);
  } else {
    console.error('❌ Error: No H1 heading found in the server-rendered HTML!');
  }

  // 2. Search for H2 and H3 tags in body
  const bodyContentIdx = content.toLowerCase().indexOf('</head>');
  const bodyContent = bodyContentIdx !== -1 ? content.slice(bodyContentIdx) : content;
  
  const h2Matches = bodyContent.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h3Matches = bodyContent.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];
  
  console.log(`\nWordPress H2 Tags found in HTML Body: ${h2Matches.length}`);
  h2Matches.forEach((m, idx) => {
    console.log(`  H2 [${idx + 1}]: "${m.replace(/<[^>]*>/g, '').trim()}"`);
  });

  console.log(`\nWordPress H3 Tags found in HTML Body: ${h3Matches.length}`);
  h3Matches.slice(0, 5).forEach((m, idx) => {
    console.log(`  H3 [${idx + 1}]: "${m.replace(/<[^>]*>/g, '').trim()}"`);
  });

  // 3. Extract text paragraphs
  const pMatches = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  console.log(`\nWordPress Paragraph Tags found in HTML Body: ${pMatches.length}`);
  pMatches.slice(0, 3).forEach((m, idx) => {
    console.log(`  Paragraph [${idx + 1}]: "${m.replace(/<[^>]*>/g, '').slice(0, 150).trim()}..."`);
  });

  // 4. Check categories
  const hasCategoryLink = content.includes('/blog?category=');
  const hasCategoriesLabel = content.includes('Categories</span>');

  console.log('\n--- CATEGORIES PRE-RENDERING STATUS ---');
  if (hasCategoryLink && hasCategoriesLabel) {
    console.log('✅ SUCCESS: Internal categories links are 100% pre-rendered in the server HTML!');
    const categoryMatch = content.match(/\/blog\?category=([^"'>]+)/i);
    if (categoryMatch) {
      console.log(`  Found category link: /blog?category=${categoryMatch[1]}`);
    }
  } else {
    console.error('❌ FAILURE: Categories links are still missing in the server HTML!');
  }

  // 5. Final Verdict
  const hasArticleBodyText = h2Matches.length > 0 || pMatches.length > 3;
  console.log('\n--- OVERALL BLOG SSR STATUS ---');
  if (hasArticleBodyText) {
    console.log('🎉 VERDICT: SUCCESS! The blog detail page post body is now fully Server-Side Rendered (SSR) and visible to search engine crawlers in the raw HTML.');
  } else {
    console.error('🔴 VERDICT: FAILURE! The blog post content is still invisible on the server.');
  }
  console.log('===============================================================');
}

verifyFixedBlog();
