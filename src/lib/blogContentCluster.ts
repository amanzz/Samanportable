/**
 * SHIKHAR T8.3 — blog post slug → owning product-hub, derived from post CONTENT.
 *
 * GENERATED — do not hand-edit. Regenerate from the T8.3 packet's deterministic
 * classifier (title-weighted phrase match + hard-conflict guards) whenever posts
 * are added or their content changes.
 *
 * WHY THIS EXISTS: T8.2 resolves a post's hub from its blog CATEGORY term
 * (see blogHubLink.ts / CATEGORY_HUB_MAP). That covers 160 of 283 posts. The
 * remaining 123 sit in NOISY categories — portable-buildings, prefab-solutions,
 * uncategorized — which cross cluster boundaries and cannot be bulk-mapped: e.g.
 * `best-porta-cabins-in-bangalore` is filed under portable-buildings. This map
 * recovers them by classifying each post on the cluster-defining phrases in its
 * own title and body, never on its category.
 *
 * PRECISION OVER RECALL. A post appears here ONLY when exactly one cluster wins.
 * The 20 posts with no clear single-cluster signal are deliberately ABSENT and
 * render no module — a missing link is cheap, a wrong-intent link is not. In
 * particular, any post carrying BOTH `porta cabin` and `portable cabin` signals
 * is never assigned (owner ruling, 14 Jul 2026): that boundary is never guessed,
 * even when the title looks unambiguous.
 *
 * Every value below is a hub slug that exists in the product-category data, so a
 * lookup can never produce a dead link. `getPostHubLink()` consults this map ONLY
 * after the category-based resolution returns null, so the 160 T8.2 posts are
 * completely unaffected.
 *
 * Coverage: 160 (T8.2, by category) + 103 (T8.3, by content) = 263 / 283 posts.
 */
export const BLOG_CONTENT_CLUSTER: Readonly<Record<string, string>> = Object.freeze({
  // ── container-cafe (1) ───────────────────────────────────────────
  'best-container-cafe-designs-for-experience': 'container-cafe',

  // ── container-houses (1) ─────────────────────────────────────────
  'container-house-price-in-tamil-nadu': 'container-houses',

  // ── container-offices (13) ───────────────────────────────────────
  'best-container-office-solutions': 'container-offices',
  'container-office-rental-is-perfect-solution': 'container-offices',
  'container-offices-for-sale-in-bommasandra': 'container-offices',
  'container-offices-for-sale-in-hosur': 'container-offices',
  'container-offices-for-sale-in-jp-nagar': 'container-offices',
  'container-offices-in-central-delhi': 'container-offices',
  'container-offices-in-faridabad': 'container-offices',
  'container-offices-in-south-delhi': 'container-offices',
  'container-offices-in-west-delhi': 'container-offices',
  'container-offices-price': 'container-offices',
  'second-hand-container-office': 'container-offices',
  'sustainable-construction': 'container-offices',
  'why-you-need-to-consider-a-container-office': 'container-offices',

  // ── industrial-sheds (6) ─────────────────────────────────────────
  'industrial-sheds-in-bangalore': 'industrial-sheds',
  'portable-car-shed': 'industrial-sheds',
  'portable-carports': 'industrial-sheds',
  'prefabricated-warehouse-manufacturer-in-bangalore': 'industrial-sheds',
  'temporary-garage-shelter': 'industrial-sheds',
  'temporary-shed': 'industrial-sheds',

  // ── labor-colony (1) ─────────────────────────────────────────────
  'what-is-a-labour-hutment': 'labor-colony',

  // ── porta-cabins (29) ────────────────────────────────────────────
  '2nd-hand-porta-cabins': 'porta-cabins',
  'best-porta-cabin-manufacturer-ncr': 'porta-cabins',
  'best-porta-cabins-in-bangalore': 'porta-cabins',
  'cheap-porta-cabins-for-sale': 'porta-cabins',
  'durable-porta-cabins': 'porta-cabins',
  'owning-a-porta-cabin-is-perfect': 'porta-cabins',
  'porta-cabin-in-chennai': 'porta-cabins',
  'porta-cabin-in-noida': 'porta-cabins',
  'porta-cabin-price-a-complete-guide-2025': 'porta-cabins',
  'porta-cabin-sizes-and-specifications-in-india': 'porta-cabins',
  'porta-cabins-in-anekal': 'porta-cabins',
  'porta-cabins-in-banashankari': 'porta-cabins',
  'porta-cabins-in-delhi-ncr': 'porta-cabins',
  'porta-cabins-in-hsr-layout': 'porta-cabins',
  'porta-cabins-in-jayanagar': 'porta-cabins',
  'porta-cabins-in-jigani': 'porta-cabins',
  'porta-cabins-in-jp-nagar': 'porta-cabins',
  'porta-cabins-in-kengeri': 'porta-cabins',
  'porta-cabins-in-koramangala': 'porta-cabins',
  'porta-cabins-in-marathahalli': 'porta-cabins',
  'porta-cabins-in-nagarbhavi': 'porta-cabins',
  'porta-cabins-is-budget-friendly-product': 'porta-cabins',
  'porta-cabins-on-rent': 'porta-cabins',
  'portacabins-for-sale-in-bangalore': 'porta-cabins',
  'portacabins-for-sale-in-bannerghatta-road': 'porta-cabins',
  'portacabins-for-sale-in-bommasandra': 'porta-cabins',
  'portacabins-for-sale-in-whitefield': 'porta-cabins',
  'prefab-porta-cabins': 'porta-cabins',
  'world-of-customized-porta-cabin': 'porta-cabins',

  // ── portable-cabin (27) ──────────────────────────────────────────
  '18-benefits-of-luxury-portable-cabin': 'portable-cabin',
  '7-tips-for-choosing-the-perfect-portable-cabin-location': 'portable-cabin',
  'best-portable-cabins-in-india': 'portable-cabin',
  'cheap-portable-cabins': 'portable-cabin',
  'eco-friendly-portable-cabins': 'portable-cabin',
  'material-specifications-features': 'portable-cabin',
  'portable-cabin-price-in-bangalore': 'portable-cabin',
  'portable-cabin-rental-services': 'portable-cabin',
  'portable-cabins-in-bellandur': 'portable-cabin',
  'portable-cabins-in-central-delhi': 'portable-cabin',
  'portable-cabins-in-east-delhi': 'portable-cabin',
  'portable-cabins-in-faridabad': 'portable-cabin',
  'portable-cabins-in-ghaziabad': 'portable-cabin',
  'portable-cabins-in-greater-noida': 'portable-cabin',
  'portable-cabins-in-gurgaon': 'portable-cabin',
  'portable-cabins-in-hennur': 'portable-cabin',
  'portable-cabins-in-hoskote': 'portable-cabin',
  'portable-cabins-in-hosur': 'portable-cabin',
  'portable-cabins-in-indiranagar': 'portable-cabin',
  'portable-cabins-in-kr-puram': 'portable-cabin',
  'portable-cabins-in-magadi-road': 'portable-cabin',
  'portable-cabins-in-north-delhi': 'portable-cabin',
  'portable-cabins-in-peenya': 'portable-cabin',
  'portable-cabins-in-shivajinagar': 'portable-cabin',
  'portable-cabins-in-south-delhi': 'portable-cabin',
  'portable-cabins-in-west-delhi': 'portable-cabin',
  'top-quality-prefab-cabins-delhi': 'portable-cabin',

  // ── portable-office (15) ─────────────────────────────────────────
  'cheap-office-trailers-for-sale': 'portable-office',
  'modern-portable-office-solutions': 'portable-office',
  'portable-office-cabin-manufacturers-in-bangalore': 'portable-office',
  'portable-office-cabins-in-central-delhi': 'portable-office',
  'portable-office-cabins-in-delhi-ncr': 'portable-office',
  'portable-office-cabins-in-east-delhi': 'portable-office',
  'portable-office-cabins-in-faridabad': 'portable-office',
  'portable-office-cabins-in-ghaziabad': 'portable-office',
  'portable-office-cabins-in-greater-noida': 'portable-office',
  'portable-office-cabins-in-gurgaon': 'portable-office',
  'portable-office-cabins-in-noida': 'portable-office',
  'portable-office-cabins-in-north-delhi': 'portable-office',
  'portable-office-cabins-in-south-delhi': 'portable-office',
  'portable-office-cabins-in-west-delhi': 'portable-office',
  'sleek-prefab-office-cabins-ncr': 'portable-office',

  // ── portable-toilet (1) ──────────────────────────────────────────
  'portable-toilets-in-bangalore': 'portable-toilet',

  // ── pre-engineered-buildings (3) ─────────────────────────────────
  'peb-structure-cost-per-kg-india': 'pre-engineered-buildings',
  'peb-structure-cost-per-sq-ft-india': 'pre-engineered-buildings',
  'pre-engineered-buildings-in-bangalore': 'pre-engineered-buildings',

  // ── prefab-buildings (1) ─────────────────────────────────────────
  'customized-prefab-structures-ncr': 'prefab-buildings',

  // ── prefabricated-houses (5) ─────────────────────────────────────
  'build-a-prefabricated-modular-houses': 'prefabricated-houses',
  'durable-modular-homes-delhi': 'prefabricated-houses',
  'luxury-prefab-homes': 'prefabricated-houses',
  'precast-housing-construction-guide': 'prefabricated-houses',
  'prefabricated-houses-in-bangalore': 'prefabricated-houses',
});
