# TICKET — SITE-WIDE SINGULAR-ALIAS CLOSURE · Fable 5 · 27 Jul 2026
**Approved by Fable 5 as senior SEO lead, 27 July 2026. Same pattern proven in the C-01 redirect event.**

## 1 · WHY THIS IS THE HIGHEST-VALUE EVENT REMAINING

The C-01 audit found the singular-alias defect is **site-wide: 79 duplicate 200 URLs across ten clusters.** Every one is a second address for a page that already exists, and the route accepts them without limit — so the true duplicate surface is unbounded, not 79.

Search Console currently reports **8,415 not-found, 4,811 excluded-by-noindex and 1,329 redirect URLs against only 588 indexed pages.** A parallel duplicate namespace across most of the site is a leading candidate for a large share of that. No amount of page rebuilding offsets a crawl budget spent on phantom URLs.

Evidence this matters commercially: on C-01, the singular orphan `/product/porta-cabin/ms-porta-cabin` was out-earning the real page **8.5:1 on impressions** — 19,020 against 2,250. Google had picked the duplicate.

## 2 · SCOPE — ten singular namespaces

| Canonical category | Singular alias to close | Duplicates found |
|---|---|---|
| container-houses | `container-house` | 14 |
| peb-constructions | `peb-construction` | 12 |
| prefab-buildings | `prefab-building` | 10 |
| container-offices | `container-office` | 9 |
| industrial-sheds | `industrial-shed` | 9 |
| pre-engineered-buildings | `pre-engineered-building` | 8 |
| prefabricated-houses | `prefabricated-house` | 8 |
| security-cabins | `security-cabin` | 6 |
| roofing-sheets | `roofing-sheet` | 3 |
| wall-sheets | `wall-sheet` | 0 |

**`porta-cabin` is already closed** by the C-01 event. Do not touch it.

## 3 · THE ONE RULE THAT MUST NOT BE BROKEN

**`/product/portable-cabin/` is a real canonical category, not an alias.** It has its own cluster, its own hub and its own subpages. Closing it would destroy a live cluster.

**Before closing any singular namespace, prove it is an alias and not a canonical category.** A namespace may only be closed when **every** slug under it resolves to a page whose canonical URL sits under the plural form. If even one slug under a singular namespace is canonical there, **STOP and report that namespace** — do not close it, do not partially close it.

Report the proof per namespace. This is the check that separates a correct sweep from one that takes a cluster offline.

## 4 · THE FIX — identical shape to the C-01 event

For each namespace that passes §3:

1. **Stop the dynamic route accepting the singular form as a category.**
2. **Explicit 301** for every enumerated alias → its plural canonical, single hop.
3. **Self-slugs** — `/product/<singular>/<singular-plural-name>` — target the **cluster hub directly**, never the plural self-slug, so nothing chains. Where a self-slug already returns **410**, leave it at 410; do not convert it to a redirect.
4. **One catch-all per namespace, ordered after the explicit rules:**
   `/product/<singular>/:slug*` → 301 → `/product/<plural>/:slug*`
5. Prove ordering with a hop-count test on each namespace's self-slug and on one arbitrary unlisted alias.

## 5 · TARGET VERIFICATION — every target, before writing it

**No redirect target is written into the config until it has been verified as a live 200.** If a plural canonical does not resolve 200, that alias is **excluded and reported**, never pointed at a guess.

This is a standing rule from the C-01 event, where a target named from Search Console click data turned out to be a redirect itself.

## 6 · OUT OF SCOPE

No page component, copy, specification table, PDF or schema change. No sitemap content decisions beyond removing URLs that stop being 200. No cluster consolidations. No new pages. **If a fix appears to require any of these, STOP and report.**

## 7 · ACCEPTANCE

1. Per-namespace proof that it is an alias, not a canonical category, per §3. `portable-cabin` explicitly excluded and named as excluded.
2. Every redirect resolves in **exactly one hop** to a live 200. Full hop-count table, both slash variants.
3. **Zero configured redirect chains site-wide**, including through the existing trailing-slash 308.
4. Each namespace's self-slug proven to reach its hub in one hop, or documented as a retained 410.
5. One arbitrary unlisted alias per namespace resolves through its catch-all without chaining.
6. Routes no longer accept any closed singular form as a category.
7. Every target verified 200 before configuration; excluded aliases listed with reasons.
8. **Zero visible-text and zero JSON-LD change on every live page**, proven with a content-layer diff against a same-date control build.
9. Zero internal links resolve through a redirect or error — count before and after.
10. Live-200 count and sitemap count before and after, with the delta explained URL by URL.
11. Deleted file and line counts **from git, not estimates**. Archive byte-identical, proven by blob hash.
12. TypeScript clean, production build clean, CWV no-regress against the lockfile.

Preview, report to Fable 5, **STOP. Do not merge.**

## 8 · AFTER DEPLOY

Resubmit the sitemap in Search Console and open Validate Fix one report at a time: Not found (404) → Redirect error → Soft 404 → Excluded by noindex. Expect discovered-URL count and crawl requests to fall within two to three weeks; the 404 backlog drains over four to eight. Judge this at the 23 August checkpoint on indexed-page count and crawl stats, never on week-one impressions.
