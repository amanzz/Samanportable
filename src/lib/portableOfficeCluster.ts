// C-03 / W3-A — portable-office cluster: the subpage slugs retired by the 25 Jul 2026
// consolidation (Fable 5 ruling, Ruling 4).
//
// These six URLs now answer with a single-hop 301 (see the C03 block in next.config.js),
// so no surface may render a link to them: a related card or rail tile pointing here
// would send the visitor — and Googlebot — through a redirect instead of to a 200.
// Mirrors the C01 porta-cabins pattern (PORTA_CABIN_REDIRECTED_SLUGS): the hub's
// route-level related-products list is filtered by this array, which covers BOTH the
// subpage grid and the related rail because both derive from that one list.
//
// Event A (28 Jul 2026) retires the remaining three duplicate Portable Office
// subpages. The cross-cluster prefabricated-site-office retirement is filtered at
// the global listing chokepoint because it does not belong to this cluster.
export const PORTABLE_OFFICE_REDIRECTED_SLUGS: readonly string[] = [
  'portable-office-cabin',
  'buy-portable-office-cabin',
  'modular-portable-office-cabin',
  'modular-portable-office',
  'modular-office-cabin',
  'prefab-portable-office',
  'prefabricated-portable-office-cabin',
  'prefab-mobile-office',
  'ms-portable-office-cabin',
];
