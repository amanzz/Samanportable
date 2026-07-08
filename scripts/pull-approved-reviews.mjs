// Hourly reviews bridge — the ONLY WordPress connection in the static site.
//
// Pulls APPROVED WooCommerce reviews and writes them into the static data files
// the site renders from (src/data/wp-export/reviews/product-<id>.json), and
// refreshes each product's average_rating / rating_count from those approved
// reviews so visible stars, counts, and schema stay truthful.
//
// Read-only against WordPress. Runs on a schedule (see
// .github/workflows/pull-reviews.yml) — NEVER in the visitor request path.
//
// Env (same names as .env.local): WORDPRESS_CONSUMER_KEY, WORDPRESS_CONSUMER_SECRET
// Optional: WORDPRESS_API_URL (default https://blog.samanportable.com/wp-json)
import fs from 'node:fs';
import path from 'node:path';

const WP = (process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json').replace(/\/$/, '');
const KEY = process.env.WORDPRESS_CONSUMER_KEY;
const SECRET = process.env.WORDPRESS_CONSUMER_SECRET;
const OUT = path.join(process.cwd(), 'src', 'data', 'wp-export');

if (!KEY || !SECRET) {
  console.error('Missing WORDPRESS_CONSUMER_KEY / WORDPRESS_CONSUMER_SECRET');
  process.exit(1);
}

async function fetchAllApproved() {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const url = `${WP}/wc/v3/products/reviews?status=approved&per_page=100&page=${page}` +
      `&consumer_key=${encodeURIComponent(KEY)}&consumer_secret=${encodeURIComponent(SECRET)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`reviews fetch failed: HTTP ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

function writeIfChanged(file, data) {
  const next = JSON.stringify(data, null, 2);
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : null;
  if (prev === next) return false;
  fs.writeFileSync(file, next, 'utf-8');
  return true;
}

const reviews = await fetchAllApproved();
const byProduct = new Map();
for (const r of reviews) {
  delete r.reviewer_avatar_urls;
  if (!byProduct.has(r.product_id)) byProduct.set(r.product_id, []);
  byProduct.get(r.product_id).push(r);
}

let changed = 0;
const reviewsDir = path.join(OUT, 'reviews');
fs.mkdirSync(reviewsDir, { recursive: true });
for (const [productId, items] of byProduct) {
  items.sort((a, b) => (a.date_created < b.date_created ? 1 : -1));
  if (writeIfChanged(path.join(reviewsDir, `product-${productId}.json`), items)) changed++;
}

// Refresh rating summary on the product files from the approved reviews.
const productsDir = path.join(OUT, 'products');
for (const f of fs.readdirSync(productsDir)) {
  if (!f.endsWith('.json')) continue;
  const file = path.join(productsDir, f);
  const product = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const items = byProduct.get(product.id) || [];
  const count = items.length;
  const avg = count ? (items.reduce((s, r) => s + (r.rating || 0), 0) / count).toFixed(2) : '0.00';
  if (product.rating_count !== count || product.average_rating !== avg) {
    product.rating_count = count;
    product.average_rating = avg;
    fs.writeFileSync(file, JSON.stringify(product, null, 2), 'utf-8');
    changed++;
  }
}

console.log(`approved reviews: ${reviews.length} across ${byProduct.size} products; files changed: ${changed}`);
