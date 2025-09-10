#!/usr/bin/env node

/**
 * LCP Testing Script for Saman Portable Website
 * Tests the performance improvements made to text-heavy pages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing LCP Performance Improvements...\n');

// Test URLs to check
const testUrls = [
  'http://localhost:3000', // Homepage
  'http://localhost:3000/about-us', // About Us page
];

// Function to run Lighthouse audit
function runLighthouseAudit(url, outputPath) {
  try {
    console.log(`📊 Running Lighthouse audit for ${url}...`);
    
    const command = `npx lighthouse "${url}" --output=json --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance --form-factor=mobile --throttling-method=simulate --throttling.cpuSlowdownMultiplier=4 --throttling.rttMs=150 --throttling.throughputKbps=1638.4`;
    
    execSync(command, { stdio: 'pipe' });
    
    const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const lcp = report.lighthouseResult.audits['largest-contentful-paint'];
    
    console.log(`✅ LCP Score: ${lcp.score * 100}/100`);
    console.log(`⏱️  LCP Time: ${lcp.numericValue}ms`);
    console.log(`📝 LCP Element: ${lcp.details?.items?.[0]?.node?.snippet || 'N/A'}\n`);
    
    return {
      score: lcp.score * 100,
      time: lcp.numericValue,
      element: lcp.details?.items?.[0]?.node?.snippet || 'N/A'
    };
  } catch (error) {
    console.error(`❌ Error running Lighthouse for ${url}:`, error.message);
    return null;
  }
}

// Function to check if server is running
function checkServerRunning() {
  try {
    execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Main function
async function main() {
  console.log('🔍 Checking if Next.js server is running...');
  
  if (!checkServerRunning()) {
    console.log('❌ Next.js server is not running. Please start it with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is running!\n');
  
  const results = [];
  
  for (const url of testUrls) {
    const outputPath = path.join(__dirname, `lighthouse-${url.split('/').pop() || 'homepage'}.json`);
    const result = runLighthouseAudit(url, outputPath);
    
    if (result) {
      results.push({
        url,
        ...result
      });
    }
  }
  
  // Summary
  console.log('📋 LCP Performance Summary:');
  console.log('========================\n');
  
  results.forEach(result => {
    const status = result.score >= 90 ? '🟢' : result.score >= 50 ? '🟡' : '🔴';
    console.log(`${status} ${result.url}`);
    console.log(`   Score: ${result.score.toFixed(1)}/100`);
    console.log(`   LCP: ${result.time.toFixed(0)}ms`);
    console.log(`   Element: ${result.element}\n`);
  });
  
  // Check if LCP is under 2.5 seconds
  const allGood = results.every(result => result.time < 2500);
  
  if (allGood) {
    console.log('🎉 SUCCESS: All pages have LCP under 2.5 seconds!');
  } else {
    console.log('⚠️  WARNING: Some pages still have LCP above 2.5 seconds.');
    console.log('   Consider further optimizations.');
  }
  
  console.log('\n✨ LCP testing complete!');
}

main().catch(console.error);
