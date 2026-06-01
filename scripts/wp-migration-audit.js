/**
 * WordPress Content Migration Audit Script
 * Fetches 100+ posts from WP REST API and audits content for migration artifacts.
 * Usage: node scripts/wp-migration-audit.js
 */

const BASE = 'https://blog.samanportable.com/wp-json/wp/v2';
const LEGACY_DOMAIN = 'blog.samanportable.com';
const CANONICAL_DOMAIN = 'www.samanportable.com';
const PER_PAGE = 50; // max allowed by WP REST API
const TARGET_POSTS = 150; // aim for 150 to ensure 100+ valid

// ─── Counters ────────────────────────────────────────────────────────────────
const counts = {
  blogSubdomainLinks: 0,
  blogSubdomainImages: 0,
  blogSubdomainCanonicals: 0,
  utmLinks: 0,
  wpContentLinks: 0,
  wpContentImages: 0,
  oldCategoryUrls: 0,
  oldTagUrls: 0,
  oldArchiveUrls: 0,
  attachmentPageLinks: 0,
  absoluteInternalLinks: 0,  // https://www.samanportable.com/... that should be relative
  embeddedCanonicals: 0,
  legacyShortcodes: 0,
  postsWithZeroLinks: 0,
  postsWithBlogLinks: 0,
  postsWithUtmLinks: 0,
  postsWithWpContent: 0,
};

// ─── Sample URL collectors (max 5 per type) ──────────────────────────────────
const samples = {
  blogSubdomainLinks: [],
  blogSubdomainImages: [],
  blogSubdomainCanonicals: [],
  utmLinks: [],
  wpContentLinks: [],
  wpContentImages: [],
  oldCategoryUrls: [],
  oldTagUrls: [],
  oldArchiveUrls: [],
  attachmentPageLinks: [],
  absoluteInternalLinks: [],
  embeddedCanonicals: [],
  legacyShortcodes: [],
};

function addSample(key, url, postSlug) {
  if (samples[key] && samples[key].length < 5) {
    samples[key].push({ url: url.substring(0, 120), post: postSlug });
  }
}

// ─── Pattern matchers ─────────────────────────────────────────────────────────
const PATTERNS = {
  // href="https://blog.samanportable.com/..."
  blogSubdomainHref: /href=["']https?:\/\/blog\.samanportable\.com\/[^"'\s]*/gi,
  // src="https://blog.samanportable.com/..."
  blogSubdomainSrc: /src=["']https?:\/\/blog\.samanportable\.com\/[^"'\s]*/gi,
  // content="https://blog.samanportable.com/..." (embedded canonical/og tags)
  blogSubdomainContent: /content=["']https?:\/\/blog\.samanportable\.com\/[^"'\s]*/gi,
  // url(https://blog.samanportable.com/...) in CSS background
  blogSubdomainCss: /url\(["']?https?:\/\/blog\.samanportable\.com\/[^"')\s]*/gi,
  // UTM params in any URL
  utmParams: /https?:\/\/[^"'\s]*\?[^"'\s]*utm_[^"'\s]*/gi,
  // /wp-content/ in href or src
  wpContentHref: /href=["'][^"']*\/wp-content\/[^"']*/gi,
  wpContentSrc: /src=["'][^"']*\/wp-content\/[^"']*/gi,
  // /category/ WordPress archive URL pattern
  oldCategory: /href=["']https?:\/\/[^"']*\/category\/[^"']*/gi,
  // /tag/ WordPress tag archive URL pattern
  oldTag: /href=["']https?:\/\/[^"']*\/tag\/[^"']*/gi,
  // /YYYY/MM/ date archive URLs
  oldArchive: /href=["']https?:\/\/[^"']*\/\d{4}\/\d{2}\/[^"']*/gi,
  // /?attachment_id= attachment pages
  attachmentPage: /href=["'][^"']*[?&]attachment_id=\d+[^"']*/gi,
  // href="https://www.samanportable.com/..." - absolute internal that should be relative
  absoluteInternal: /href=["']https?:\/\/www\.samanportable\.com\/[^"'\s]*/gi,
  // Embedded <link rel="canonical"> tags inside content (migration artifact)
  embeddedCanonical: /<link[^>]*rel=["']canonical["'][^>]*>/gi,
  // WordPress shortcodes [caption], [gallery], [embed], etc.
  legacyShortcode: /\[[a-z_]+[^\]]*\]/gi,
};

function extractMatches(pattern, text) {
  const re = new RegExp(pattern.source, pattern.flags);
  const matches = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    matches.push(m[0]);
  }
  return matches;
}

function extractUrlFromMatch(match) {
  // Extract the URL from href="..." or src="..."
  const urlMatch = match.match(/["'](https?:\/\/[^"'\s>]+)/);
  return urlMatch ? urlMatch[1] : match;
}

// ─── Per-post analysis ────────────────────────────────────────────────────────
function analyzePost(post) {
  const slug = post.slug || 'unknown';
  const content = (post.content?.rendered || '') + (post.excerpt?.rendered || '');
  
  let hasZeroLinks = true;
  let hasBlogLinks = false;
  let hasUtmLinks = false;
  let hasWpContent = false;

  // 1. blog.samanportable.com hrefs (internal links pointing to subdomain)
  const blogHrefs = extractMatches(PATTERNS.blogSubdomainHref, content);
  if (blogHrefs.length > 0) {
    counts.blogSubdomainLinks += blogHrefs.length;
    hasBlogLinks = true;
    hasZeroLinks = false;
    blogHrefs.forEach(m => addSample('blogSubdomainLinks', extractUrlFromMatch(m), slug));
  }

  // 2. blog.samanportable.com images
  const blogSrcs = extractMatches(PATTERNS.blogSubdomainSrc, content);
  if (blogSrcs.length > 0) {
    counts.blogSubdomainImages += blogSrcs.length;
    hasWpContent = true;
    blogSrcs.forEach(m => addSample('blogSubdomainImages', extractUrlFromMatch(m), slug));
  }

  // 3. blog.samanportable.com in content= attributes (embedded meta / canonical in content body)
  const blogContents = extractMatches(PATTERNS.blogSubdomainContent, content);
  if (blogContents.length > 0) {
    counts.blogSubdomainCanonicals += blogContents.length;
    blogContents.forEach(m => addSample('blogSubdomainCanonicals', extractUrlFromMatch(m), slug));
  }

  // 4. UTM-polluted links
  const utmMatches = extractMatches(PATTERNS.utmParams, content);
  if (utmMatches.length > 0) {
    counts.utmLinks += utmMatches.length;
    hasUtmLinks = true;
    hasZeroLinks = false;
    utmMatches.forEach(m => addSample('utmLinks', m, slug));
  }

  // 5. /wp-content/ in hrefs (direct WP media links)
  const wpHrefs = extractMatches(PATTERNS.wpContentHref, content);
  if (wpHrefs.length > 0) {
    counts.wpContentLinks += wpHrefs.length;
    hasWpContent = true;
    wpHrefs.forEach(m => addSample('wpContentLinks', extractUrlFromMatch(m), slug));
  }

  // 6. /wp-content/ images
  const wpSrcs = extractMatches(PATTERNS.wpContentSrc, content);
  if (wpSrcs.length > 0) {
    counts.wpContentImages += wpSrcs.length;
    hasWpContent = true;
    wpSrcs.forEach(m => addSample('wpContentImages', extractUrlFromMatch(m), slug));
  }

  // 7. Old WordPress /category/ archive URLs
  const oldCats = extractMatches(PATTERNS.oldCategory, content);
  if (oldCats.length > 0) {
    counts.oldCategoryUrls += oldCats.length;
    oldCats.forEach(m => addSample('oldCategoryUrls', extractUrlFromMatch(m), slug));
  }

  // 8. Old WordPress /tag/ archive URLs
  const oldTags = extractMatches(PATTERNS.oldTag, content);
  if (oldTags.length > 0) {
    counts.oldTagUrls += oldTags.length;
    oldTags.forEach(m => addSample('oldTagUrls', extractUrlFromMatch(m), slug));
  }

  // 9. Date archive URLs /YYYY/MM/
  const oldArchives = extractMatches(PATTERNS.oldArchive, content);
  if (oldArchives.length > 0) {
    counts.oldArchiveUrls += oldArchives.length;
    oldArchives.forEach(m => addSample('oldArchiveUrls', extractUrlFromMatch(m), slug));
  }

  // 10. ?attachment_id= links
  const attachments = extractMatches(PATTERNS.attachmentPage, content);
  if (attachments.length > 0) {
    counts.attachmentPageLinks += attachments.length;
    attachments.forEach(m => addSample('attachmentPageLinks', extractUrlFromMatch(m), slug));
  }

  // 11. Absolute internal links (https://www.samanportable.com/...)
  const absInternal = extractMatches(PATTERNS.absoluteInternal, content);
  if (absInternal.length > 0) {
    counts.absoluteInternalLinks += absInternal.length;
    hasZeroLinks = false;
    absInternal.forEach(m => addSample('absoluteInternalLinks', extractUrlFromMatch(m), slug));
  }

  // 12. Embedded <link rel="canonical"> tags inside post body
  const embCan = extractMatches(PATTERNS.embeddedCanonical, content);
  if (embCan.length > 0) {
    counts.embeddedCanonicals += embCan.length;
    embCan.forEach(m => addSample('embeddedCanonicals', m.substring(0, 100), slug));
  }

  // 13. Legacy WordPress shortcodes
  const shortcodes = extractMatches(PATTERNS.legacyShortcode, content);
  // Filter to known WP shortcode patterns
  const wpShortcodes = shortcodes.filter(s => 
    /^\[(caption|gallery|embed|video|audio|playlist|wp_caption|youtube|vc_|et_pb_)/i.test(s)
  );
  if (wpShortcodes.length > 0) {
    counts.legacyShortcodes += wpShortcodes.length;
    wpShortcodes.forEach(m => addSample('legacyShortcodes', m.substring(0, 80), slug));
  }

  // Post-level counters
  if (hasZeroLinks) counts.postsWithZeroLinks++;
  if (hasBlogLinks) counts.postsWithBlogLinks++;
  if (hasUtmLinks) counts.postsWithUtmLinks++;
  if (hasWpContent) counts.postsWithWpContent++;

  return {
    slug,
    blogHrefs: blogHrefs.length,
    blogSrcs: blogSrcs.length,
    utmLinks: utmMatches.length,
    wpContent: wpHrefs.length + wpSrcs.length,
    absoluteInternal: absInternal.length,
    shortcodes: wpShortcodes.length,
    hasZeroLinks,
  };
}

// ─── Fetch with retry ─────────────────────────────────────────────────────────
async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SAMAN-Migration-Audit/1.0', 'Accept': 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== WordPress Content Migration Audit ===');
  console.log(`Target: ${BASE}`);
  console.log(`Sampling up to ${TARGET_POSTS} posts...\n`);

  // First, get total post count
  const headRes = await fetchWithRetry(`${BASE}/posts?per_page=1&_fields=id`);
  const totalPosts = parseInt(headRes.headers.get('X-WP-Total') || '0', 10);
  const totalPages = parseInt(headRes.headers.get('X-WP-TotalPages') || '1', 10);
  console.log(`Total posts in WordPress: ${totalPosts}`);
  console.log(`Total pages (50/page): ${Math.ceil(totalPosts / PER_PAGE)}\n`);

  const postDetails = [];
  let fetched = 0;
  let page = 1;

  while (fetched < TARGET_POSTS && page <= totalPages) {
    const url = `${BASE}/posts?per_page=${PER_PAGE}&page=${page}&_embed=0&_fields=id,slug,date,content,excerpt,link`;
    process.stdout.write(`Fetching page ${page} (posts ${fetched + 1}–${Math.min(fetched + PER_PAGE, TARGET_POSTS)})... `);
    
    try {
      const res = await fetchWithRetry(url);
      const posts = await res.json();
      
      if (!Array.isArray(posts) || posts.length === 0) {
        console.log('No more posts.');
        break;
      }

      for (const post of posts) {
        if (fetched >= TARGET_POSTS) break;
        const detail = analyzePost(post);
        postDetails.push(detail);
        fetched++;
      }

      console.log(`✓ (${fetched} total)`);
      page++;
      // small delay to be polite to the API
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.log(`✗ Error: ${err.message}`);
      break;
    }
  }

  console.log(`\n✅ Analyzed ${fetched} posts.\n`);

  // ─── Output Results ────────────────────────────────────────────────────────

  // Posts with most issues
  const hotPosts = postDetails
    .map(p => ({
      slug: p.slug,
      issues: p.blogHrefs + p.blogSrcs + p.utmLinks + p.wpContent + p.absoluteInternal + p.shortcodes,
    }))
    .filter(p => p.issues > 0)
    .sort((a, b) => b.issues - a.issues)
    .slice(0, 10);

  // ─── Print summary ─────────────────────────────────────────────────────────
  console.log('=== ISSUE COUNT SUMMARY ===\n');
  console.log(`Posts sampled:                    ${fetched}`);
  console.log(`Total WP posts:                   ${totalPosts}\n`);
  console.log('--- Link & Image Issues ---');
  console.log(`blog.samanportable.com hrefs:     ${counts.blogSubdomainLinks}  (in ${counts.postsWithBlogLinks} posts)`);
  console.log(`blog.samanportable.com images:    ${counts.blogSubdomainImages}`);
  console.log(`blog.samanportable.com canonicals:${counts.blogSubdomainCanonicals}`);
  console.log(`UTM-polluted links:               ${counts.utmLinks}  (in ${counts.postsWithUtmLinks} posts)`);
  console.log(`/wp-content/ hrefs:               ${counts.wpContentLinks}`);
  console.log(`/wp-content/ image srcs:          ${counts.wpContentImages}  (in ${counts.postsWithWpContent} posts)`);
  console.log('\n--- Legacy URL Patterns ---');
  console.log(`Old /category/ archive URLs:      ${counts.oldCategoryUrls}`);
  console.log(`Old /tag/ archive URLs:           ${counts.oldTagUrls}`);
  console.log(`Date archive /YYYY/MM/ URLs:      ${counts.oldArchiveUrls}`);
  console.log(`?attachment_id= page links:       ${counts.attachmentPageLinks}`);
  console.log('\n--- Content Quality ---');
  console.log(`Absolute internal links:          ${counts.absoluteInternalLinks}`);
  console.log(`Embedded <link canonical> tags:   ${counts.embeddedCanonicals}`);
  console.log(`Legacy WP shortcodes:             ${counts.legacyShortcodes}`);
  console.log(`Posts with zero links:            ${counts.postsWithZeroLinks}/${fetched}`);

  console.log('\n=== SAMPLE URLS (up to 5 per type) ===\n');
  for (const [key, sampleList] of Object.entries(samples)) {
    if (sampleList.length === 0) continue;
    console.log(`\n[${key}]`);
    sampleList.forEach(s => console.log(`  Post: /${s.post}\n  URL:  ${s.url}`));
  }

  console.log('\n=== TOP 10 MOST-AFFECTED POSTS ===\n');
  hotPosts.forEach((p, i) => console.log(`  ${i+1}. /${p.slug}  (${p.issues} issues)`));

  // Output JSON for report writing
  const report = {
    meta: {
      auditDate: new Date().toISOString(),
      totalWpPosts: totalPosts,
      postsAnalyzed: fetched,
    },
    counts,
    samples,
    hotPosts,
  };

  process.stdout.write('\n[JSON_REPORT_START]\n');
  console.log(JSON.stringify(report, null, 2));
  process.stdout.write('[JSON_REPORT_END]\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
