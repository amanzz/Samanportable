const sharp = require('sharp');
const fs = require('fs');

async function compress() {
  const files = [
    { input: 'public/container-office-by-saman (1).jpg', output: 'public/container-office-by-saman-1.webp' },
    { input: 'public/container-office-by-saman (22).jpg', output: 'public/container-office-by-saman-22.webp' }
  ];
  
  for (const f of files) {
    await sharp(f.input)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(f.output);
    const stats = fs.statSync(f.output);
    console.log(`Created: ${f.output} - ${(stats.size/1024).toFixed(1)}KB`);
  }
}
compress().catch(console.error);
