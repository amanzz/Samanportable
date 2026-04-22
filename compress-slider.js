const sharp = require('sharp');
async function compress() {
  const files = [
    'public/hero-image/modular-prefab-homes-structures-india.webp',
    'public/hero-image/premium-container-site-office-rental.webp',
  ];
  for (const f of files) {
    const tmp = f.replace('.webp', '-tmp.webp');
    await sharp(f)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 60 })
      .toFile(tmp);
    require('fs').renameSync(tmp, f);
    const s = require('fs').statSync(f);
    console.log(f, '->', (s.size/1024).toFixed(1)+'KB');
  }
}
compress().catch(console.error);
