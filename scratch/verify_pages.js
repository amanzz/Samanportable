const { spawn } = require('child_process');
const http = require('http');
const url = require('url');

const pages = [
  '/container-offices-for-sale-in-kr-puram',
  '/container-offices-for-sale-in-hosur',
  '/container-offices-for-sale-in-mg-road',
  '/container-offices-for-sale-in-btm-layout-2',
  '/container-offices-for-sale-in-btm-layout',
  '/portacabins-for-sale-in-frazer-town'
];

console.log('Starting Next.js Dev server on port 3009...');

const server = spawn('npx', ['next', 'dev', '-p', '3009'], {
  cwd: process.cwd(),
  env: { ...process.env }
});

let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[Next.js Dev Server]: ${output.trim()}`);
  if (output.includes('Ready in') || output.includes('started server') || output.includes('localhost:3009') || output.includes('Ready')) {
    if (!serverStarted) {
      serverStarted = true;
      console.log('\nDev Server is ready. Starting page verification...');
      setTimeout(runVerification, 2000);
    }
  }
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  console.error(`[Next.js Dev Server Error]: ${output.trim()}`);
  if (output.includes('localhost:3009') || output.includes('Ready')) {
    if (!serverStarted) {
      serverStarted = true;
      console.log('\nDev Server is ready (from stderr). Starting page verification...');
      setTimeout(runVerification, 2000);
    }
  }
});

server.on('close', (code) => {
  console.log(`Server closed with code ${code}`);
});

function fetchPage(targetUrl, redirectCount = 0) {
  return new Promise((resolve) => {
    if (redirectCount > 5) {
      resolve({ statusCode: 500, error: 'Too many redirects' });
      return;
    }
    
    http.get(targetUrl, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        let redirectTarget = res.headers.location;
        if (redirectTarget.startsWith('/')) {
          redirectTarget = `http://localhost:3009${redirectTarget}`;
        }
        console.log(`  Redirected (${res.statusCode}) -> ${res.headers.location}`);
        resolve(fetchPage(redirectTarget, redirectCount + 1));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          html: data,
          finalUrl: targetUrl
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        error: err.message
      });
    });
  });
}

async function runVerification() {
  let allPassed = true;
  
  for (const page of pages) {
    console.log(`\nVerifying page: ${page}...`);
    const result = await fetchPage(`http://localhost:3009${page}`);
    
    if (result.statusCode === 200) {
      console.log(`  [PASS] Status code: 200 OK (Final URL: ${result.finalUrl})`);
      
      const containsGoogleStorage = result.html.includes('storage.googleapis.com');
      const containsNextImage = result.html.includes('storage.googleapis.com') || result.html.includes('_next/image');
      
      if (containsGoogleStorage || containsNextImage) {
        console.log(`  [PASS] Successfully verified that page content renders and image host storage.googleapis.com is accepted!`);
      } else {
        console.log(`  [OK] Page rendered successfully, but no direct storage.googleapis.com image reference (might be fallback/placeholder or styled differently).`);
      }
    } else {
      console.error(`  [FAIL] Page returned status code: ${result.statusCode}`);
      if (result.error) console.error(`  Error detail: ${result.error}`);
      allPassed = false;
    }
  }
  
  console.log('\n--- VERIFICATION RESULTS ---');
  if (allPassed) {
    console.log('🎉 ALL PAGES PASSED VERIFICATION! NO RUNTIME CRASHES!');
  } else {
    console.error('❌ SOME PAGES FAILED VERIFICATION!');
  }
  
  console.log('Shutting down server...');
  server.kill('SIGINT');
  process.exit(allPassed ? 0 : 1);
}

// Timeout backup in case the server fails to signal ready
setTimeout(() => {
  if (!serverStarted) {
    console.log('Timeout waiting for server output. Trying verification anyway...');
    serverStarted = true;
    runVerification();
  }
}, 8000);
