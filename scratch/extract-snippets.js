const fs = require('fs');
const path = require('path');

const productContent = fs.readFileSync(path.join(__dirname, 'luxury-porta-cabin-source.html'), 'utf8');

// Look for bg-muted or mt-4 container in DOM
const divStart = productContent.indexOf('bg-muted');
if (divStart !== -1) {
  const snippet = productContent.slice(divStart - 100, divStart + 600);
  console.log('=== bg-muted tag match ===');
  console.log(snippet);
  console.log('==========================\n');
} else {
  console.log('No bg-muted found.');
}

const mt4Start = productContent.indexOf('mt-4');
if (mt4Start !== -1) {
  // Let's find matches for mt-4 in DOM
  let tempContent = productContent;
  let idx = 0;
  while (true) {
    const matchIdx = tempContent.indexOf('mt-4');
    if (matchIdx === -1) break;
    console.log(`=== mt-4 Match [${++idx}] ===`);
    console.log(tempContent.slice(matchIdx - 50, matchIdx + 250));
    tempContent = tempContent.slice(matchIdx + 4);
    if (idx > 5) break;
  }
}
