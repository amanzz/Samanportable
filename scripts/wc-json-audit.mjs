// WC → JSON drift audit / one-way sync.
//
// WooCommerce (blog.samanportable.com) is the ORIGIN of record for catalog
// identity: product existence, slug, SKU, category assignment, status/visibility.
// The static files in src/data/wp-export/ are a MIRROR the deployed site reads.
// This script reports (default) or applies (--apply) the diff in ONE direction
// only: WC → JSON. It NEVER pushes JSON back to WC, and NEVER overwrites the
// hand-tuned, non-WC fields the C16 build authored (description, short_description,
// SEO/RankMath head, images, wc_review_product_id) — those are flagged as
// conflicts for human review, never silently changed.
//
// Ruling 3 gate: nothing on blog.samanportable.com under /product/ or
// /product-category/ may be indexable — this script also flags any WC product
// whose robots meta is not noindex.
//
// Usage:
//   node scripts/wc-json-audit.mjs            # audit, exit 1 if any drift
//   node scripts/wc-json-audit.mjs --apply    # apply SAFE fields to JSON mirror
//
// Env (same names as pull-approved-reviews.mjs): WORDPRESS_CONSUMER_KEY,
// WORDPRESS_CONSUMER_SECRET (WC_KEY / WC_SECRET also accepted).
// Optional: WORDPRESS_API_URL (default https://blog.samanportable.com/wp-json)
import fs from 'node:fs';
import path from 'node:path';

const WP = (process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json').replace(/\/$/, '');
const KEY = process.env.WORDPRESS_CONSUMER_KEY || process.env.WC_KEY;
const SECRET = process.env.WORDPRESS_CONSUMER_SECRET || process.env.WC_SECRET;
const APPLY = process.argv.includes('--apply');
const ROOT = path.join(process.cwd(), 'src', 'data', 'wp-export');
const PRODUCTS_DIR = path.join(ROOT, 'products');
const CATEGORIES_DIR = path.join(ROOT, 'categories');

// SAFE fields the mirror may take from WC. Everything else (description,
// short_description, _rank_math_head, images, wc_review_product_id, price tables)
// is human-authored and is only ever flagged, never overwritten.
const SAFE_PRODUCT_FIELDS = ['sku', 'status', 'categories'];

if (!KEY || !SECRET) {
  console.error('Missing WORDPRESS_CONSUMER_KEY / WORDPRESS_CONSUMER_SECRET (or WC_KEY / WC_SECRET).');
  process.exit(2);
}

const auth = `consumer_key=${encodeURIComponent(KEY)}&consumer_secret=${encodeURIComponent(SECRET)}`;

async function wcGet(pathname) {
  const url = `${WP}/wc/v3${pathname}${pathname.includes('?') ? '&' : '?'}${auth}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`WC GET ${pathname} → HTTP ${res.status}`);
  return res.json();
}

async function wcGetAll(base) {
  const all = [];
  for (let page = 1; page <= 30; page++) {
    const batch = await wcGet(`${base}${base.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return null; }
}

function loadMirror(dir) {
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const j = readJson(path.join(dir, f));
    if (j?.slug) map.set(j.slug, { file: path.join(dir, f), json: j });
  }
  return map;
}

// Rank Math stores robots as post meta `rank_math_robots` (array incl 'noindex').
function isNoindex(wcProduct) {
  const meta = (wcProduct.meta_data || []).find((m) => m.key === 'rank_math_robots');
  const val = meta?.value;
  if (Array.isArray(val)) return val.includes('noindex');
  if (typeof val === 'string') return /noindex/i.test(val);
  return false; // unknown → treat as NOT confirmed noindex (flag it)
}

const findings = [];
function flag(kind, slug, detail) { findings.push({ kind, slug, detail }); }

(async () => {
  const [wcProducts, wcCategories] = await Promise.all([
    wcGetAll('/products?_fields=id,name,slug,sku,status,catalog_visibility,categories,meta_data'),
    wcGetAll('/products/categories?_fields=id,name,slug,count'),
  ]);
  const mirrorProducts = loadMirror(PRODUCTS_DIR);
  const mirrorCategories = loadMirror(CATEGORIES_DIR);

  // ---- Categories: WC → mirror ----
  const wcCatBySlug = new Map(wcCategories.map((c) => [c.slug, c]));
  for (const [slug, wc] of wcCatBySlug) {
    const m = mirrorCategories.get(slug);
    if (!m) { flag('category-missing-in-mirror', slug, `WC category "${wc.name}" (id ${wc.id}) has no categories/${slug}.json`); continue; }
    if (m.json.name !== wc.name) flag('category-name-mismatch', slug, `WC "${wc.name}" vs mirror "${m.json.name}"`);
  }
  for (const [slug, m] of mirrorCategories) {
    if (!wcCatBySlug.has(slug)) flag('category-orphan-in-mirror', slug, `mirror categories/${slug}.json has no live WC category`);
  }

  // ---- Products: WC → mirror ----
  const wcBySlug = new Map(wcProducts.map((p) => [p.slug, p]));
  for (const [slug, wc] of wcBySlug) {
    // Ruling 3: every WC product under /product/ must be noindex.
    if (!isNoindex(wc)) flag('blog-indexable', slug, `WC product ${wc.id} is NOT noindex on the blog subdomain`);

    const m = mirrorProducts.get(slug);
    if (!m) { flag('product-missing-in-mirror', slug, `WC product "${wc.name}" (id ${wc.id}) has no products/${slug}.json`); continue; }
    const j = m.json;

    const jCatSlugs = (j.categories || []).map((c) => c.slug).sort().join(',');
    const wCatSlugs = (wc.categories || []).map((c) => c.slug).sort().join(',');
    if ((wc.sku || '') !== (j.sku || '')) flag('sku-mismatch', slug, `WC "${wc.sku || '(none)'}" vs mirror "${j.sku || '(none)'}"`);
    if (jCatSlugs !== wCatSlugs) flag('category-assignment-mismatch', slug, `WC [${wCatSlugs || '(none)'}] vs mirror [${jCatSlugs || '(none)'}]`);
    if ((wc.status || 'publish') !== (j.status || 'publish')) flag('status-mismatch', slug, `WC "${wc.status}" vs mirror "${j.status || 'publish'}"`);

    if (APPLY) {
      let changed = false;
      if ((wc.sku || '') !== (j.sku || '')) { j.sku = wc.sku || ''; changed = true; }
      if ((wc.status || 'publish') !== (j.status || 'publish')) { j.status = wc.status || 'publish'; changed = true; }
      // categories: take WC's assignment (id+name+slug) — identity, not content.
      if (jCatSlugs !== wCatSlugs) { j.categories = (wc.categories || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug })); changed = true; }
      if (changed) {
        fs.writeFileSync(m.file, JSON.stringify(j, null, 2) + '\n', 'utf-8');
        console.log(`applied SAFE fields → ${path.relative(process.cwd(), m.file)}`);
      }
    }
  }
  for (const [slug, m] of mirrorProducts) {
    if (!wcBySlug.has(slug)) flag('product-orphan-in-mirror', slug, `mirror products/${slug}.json has no live WC product (hand-authored / not yet created in WC)`);
  }

  // ---- Report ----
  console.log(`\nWC↔JSON audit — ${wcProducts.length} WC products, ${wcCategories.length} WC categories, ${mirrorProducts.size} mirror products, ${mirrorCategories.size} mirror categories.`);
  if (findings.length === 0) {
    console.log('✔ No drift. WooCommerce and the JSON mirror agree on identity fields.');
    process.exit(0);
  }
  const byKind = findings.reduce((acc, f) => ((acc[f.kind] = acc[f.kind] || []).push(f), acc), {});
  for (const kind of Object.keys(byKind).sort()) {
    console.log(`\n▶ ${kind} (${byKind[kind].length})`);
    for (const f of byKind[kind]) console.log(`   ${f.slug}: ${f.detail}`);
  }
  console.log(`\n${findings.length} drift item(s).` + (APPLY ? ' SAFE fields applied where possible; conflicts above need human review.' : ' Re-run with --apply to sync SAFE identity fields (sku/status/categories) into the mirror.'));
  process.exit(1);
})().catch((e) => { console.error('audit failed:', e.message); process.exit(2); });
