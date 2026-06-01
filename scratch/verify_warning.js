const { spawn } = require('child_process');
const http = require('http');

console.log('Verifying fetchPriority warning removal...');

const server = spawn('npx', ['next', 'dev', '-p', '3009'], {
  cwd: process.cwd(),
  env: { ...process.env }
});

let serverStarted = false;
let warningFound = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[STDOUT]: ${output.trim()}`);
  if (output.toLowerCase().includes('fetchpriority')) {
    warningFound = true;
  }
  if (output.includes('localhost:3009') || output.includes('Ready')) {
    if (!serverStarted) {
      serverStarted = true;
      triggerFetch();
    }
  }
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  console.error(`[STDERR]: ${output.trim()}`);
  if (output.toLowerCase().includes('fetchpriority')) {
    warningFound = true;
  }
  if (output.includes('localhost:3009') || output.includes('Ready')) {
    if (!serverStarted) {
      serverStarted = true;
      triggerFetch();
    }
  }
});

function triggerFetch() {
  console.log('\nFetching homepage / to trigger _document render...');
  http.get('http://localhost:3009/', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`Homepage fetched with status code: ${res.statusCode}`);
      
      // Wait another second for logs to settle
      setTimeout(() => {
        console.log('\n--- VERIFICATION RESULTS ---');
        if (warningFound) {
          console.error('❌ FAIL: The fetchPriority DOM prop warning is still present!');
        } else {
          console.log('🎉 SUCCESS: The fetchPriority DOM prop warning has been completely eliminated!');
        }
        server.kill('SIGINT');
        process.exit(warningFound ? 1 : 0);
      }, 1500);
    });
  }).on('error', (err) => {
    console.error('Error fetching homepage:', err.message);
    server.kill('SIGINT');
    process.exit(1);
  });
}

// Timeout backup
setTimeout(() => {
  if (!serverStarted) {
    serverStarted = true;
    triggerFetch();
  }
}, 8000);
