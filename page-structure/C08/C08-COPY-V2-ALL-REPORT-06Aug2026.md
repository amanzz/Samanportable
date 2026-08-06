# C-08 COPY V2 · FOUR FILES IMPLEMENTED — BUILD REPORT

**Date** 06 Aug 2026 · **Branch** `agent/c08-e2-contact-images-spec-20260805` · **Commit** `a14819ba`
**Preview** `http://localhost:3410/product/container-houses`
(clean worktree `C:/tmp/saman-c08-e3-clean`, own `npm ci`, **production** `next build` + `next start`)
**Screenshots** `D:\Project-shekhar\reports\C08-COPY-shots\` — description section + gallery strip per route, 1440×900.

Build only. Not merged, not deployed.

---

## 0 · THE HUB GATE — PASSED, SO I BUILT

| Check | Result |
|---|---|
| Body hash moved off `af499868eaadd904` | **YES → `b4af91f08e3882e5`** |
| Contains `/product/prefabricated-houses` | **YES** |
| Reads "7 links" | **YES** |
| Still says "11 links" | **No — gone** |

The v2 files supersede everything prior. The converter now reads only
`C08-HUB-V2`, `C08-LUXURY-V2`, `C08-SHIPPING-V2`, `C08-AFFORDABLE-V2` and the page-2 pack; the
dead `COPY-01/03/04/05` files and the `_1` duplicate are no longer referenced.

---

## 1 · RENDERED WORD COUNT, L23

| Route | Source body | **Rendered (L23)** | vs 2,500 |
|---|---|---|---|
| container-houses | 2,448 | **2,422** | short 78 |
| prefab-container-homes | 2,371 | **2,359** | short 141 |
| luxury-container-houses | 2,437 | **2,420** | short 80 |
| **shipping-container-homes** | 2,588 | **2,573** | **over by 73** |
| affordable-container-homes | 2,381 | **2,360** | short 140 |
| prefabricated-container-house *(no copy yet)* | — | 2,054 | short 446 |

**Shipping clears 2,500.** The other four sit 78–141 short. Nothing padded.

The rendered figure runs slightly below the source body count on every page — that is the
authoring notation (`H2 ·`, `**`, markdown link brackets) which the source count includes and
the rendered DOM does not. It is not missing copy.

---

## 2 · ADJACENCY — ZERO FAILURES, ALL SIX ROUTES

| Route | In-body images | Adjacency failures |
|---|---|---|
| container-houses | 4 | **0** |
| prefab-container-homes | 4 | **0** |
| luxury-container-houses | 4 | **0** |
| shipping-container-homes | 4 | **0** |
| affordable-container-homes | 4 | **0** |
| prefabricated-container-house | 8 | **0** |

The six markers that previously sat against a heading are gone at source — I re-checked every
marker in all four v2 files before building and none is adjacent to a heading, on either side.
Nothing was overridden in code.

---

## 3 · IMAGES — CHOICES UNCHANGED, ALL GATES HOLD

Four different view tokens from four different sizes on every page.

| Route | Slot 1 | Slot 2 | Slot 3 | Slot 4 |
|---|---|---|---|---|
| container-houses | 40x12 E06 elevated-three-quarter | 40x10 I02 semi-kitchen-dining | 20x12 E03 long-side-elevation | 20x8 I04 bathroom-reverse |
| prefab-container-homes | 40x10 E03 long-side-elevation | **20x10** I02 semi-kitchen-dining | 20x8 E02 front-left-angle | 40x12 I03 bedroom-view |
| luxury-container-houses | 40x12 E06 elevated-three-quarter | 20x10 I02 semi-kitchen-dining | 20x12 E03 long-side-elevation | 40x8 I04 bathroom-reverse |
| shipping-container-homes | 40x10 E04 rear-right-angle | **20x10** I02 semi-kitchen-dining | 40x12 E06 elevated-three-quarter | 20x12 I03 bedroom-view |
| affordable-container-homes | 20x10 E06 elevated-three-quarter | **40x10** I02 semi-kitchen-dining | **40x12** E05 end-dominant | 20x8 I04 bathroom-reverse |

Bold marks the three accepted substitutions, kept as ruled:

- **prefab slot 2** — 20x12 has no 16:9 kitchen/dining asset; 20x12's `I03` would duplicate slot 4's token.
- **shipping slot 2** — no 16:9 "living or entry" asset exists at any size on any route (`I01` is consumed by the square gallery everywhere), so the nearest family at a free size.
- **affordable slots 2 and 3** — `I02` exists only at 20x10 and 40x10; slot 1 takes 20x10, so slot 2 must be 40x10, which pushes slot 3 to 40x12 keeping its "end" view.

---

## 4 · LINKS — EVERY ANCHOR VERBATIM

### container-houses — 7 links, the `prefabricated-houses` link restored

| # | Anchor | Target |
|---|---|---|
| 1 | repeatable prefab module line | `/product/container-houses/prefab-container-homes` |
| 2 | villa-grade luxury build | `/product/container-houses/luxury-container-houses` |
| 3 | the reinforced shipping-form build | `/product/container-houses/shipping-container-homes` |
| 4 | the fixed-plan affordable build | `/product/container-houses/affordable-container-homes` |
| 5 | the fully fitted route | `/product/container-houses/prefabricated-container-house` |
| 6 | **prefabricated houses range** | **`/product/prefabricated-houses`** |
| 7 | portable cabin | `/product/portable-cabin` |

Addendum §4's unique site-wide link is back, inside the sentence explaining the platform
difference.

### prefab-container-homes — 6 links

| # | Anchor | Target |
|---|---|---|
| 1 | luxury container house range | `/product/container-houses/luxury-container-houses` |
| 2 | reinforced shipping-form build | `/product/container-houses/shipping-container-homes` |
| 3 | lowest rate in the range starts at ₹1,438 per sq ft | `/product/container-houses/affordable-container-homes` |
| 4 | quoted on your drawing rather than sold from a ladder | `/product/container-houses/prefabricated-container-house` |
| 5 | container houses hub | `/product/container-houses` |
| 6 | labour colony work | `/product/labor-colony` |

### luxury-container-houses — 5 links

| # | Anchor | Target |
|---|---|---|
| 1 | modules repeated to one drawing | `/product/container-houses/prefab-container-homes` |
| 2 | built for relocation and coastal duty | `/product/container-houses/shipping-container-homes` |
| 3 | one efficient plan per size | `/product/container-houses/affordable-container-homes` |
| 4 | delivered as a single completed unit | `/product/container-houses/prefabricated-container-house` |
| 5 | the full container house range | `/product/container-houses` |

### shipping-container-homes — 5 links

| # | Anchor | Target |
|---|---|---|
| 1 | the villa-grade interior specification | `/product/container-houses/luxury-container-houses` |
| 2 | identical factory modules | `/product/container-houses/prefab-container-homes` |
| 3 | the lowest per-square-foot rate we publish | `/product/container-houses/affordable-container-homes` |
| 4 | a unit that arrives finished and needs no site team at all | `/product/container-houses/prefabricated-container-house` |
| 5 | our container house range | `/product/container-houses` |

### affordable-container-homes — 5 links

| # | Anchor | Target |
|---|---|---|
| 1 | the hospitality-grade finish | `/product/container-houses/luxury-container-houses` |
| 2 | a heavier shell engineered for relocation | `/product/container-houses/shipping-container-homes` |
| 3 | repeatable modules for colony work | `/product/container-houses/prefab-container-homes` |
| 4 | the fitted single-unit route | `/product/container-houses/prefabricated-container-house` |
| 5 | every container house we build | `/product/container-houses` |

### Link-shape and uniqueness

| Gate | Result |
|---|---|
| Zero links standing alone on their own line | **PASS on all five copy pages** |
| Zero links directly beneath an image | **PASS on all five** |
| Every anchor has prose before and after in the same paragraph node | **PASS on all five** |
| Anchor uniqueness cluster-wide | **36 distinct · 1 duplicate** |

The single duplicate is `luxury container house range`, on page 2 and on
prefabricated-container-house. Page six's copy is the last one outstanding and clears it.

---

## 5 · HEADINGS

One H1 on every route, and it is the buy-box product name. Zero H1 inside any description panel.

| Route | H2 | H3 |
|---|---|---|
| container-houses | 8 | 0 |
| prefab-container-homes | 10 | 6 |
| luxury-container-houses | 10 | 5 |
| shipping-container-homes | 12 | 5 |
| affordable-container-homes | 11 | 5 |

Shipping and affordable each gained two sections, as stated.

---

## 6 · VERBATIM PROOF

Markup-only conversion, then the generated HTML is stripped back to text and diffed character by
character against the source prose with authoring notation removed. The script **refuses to
write on any difference**. All four v2 files passed first time.

| Route | Body words | Blocks emitted |
|---|---|---|
| container-houses | 2,448 | 8 H2 · 40 p · 4 images |
| luxury-container-houses | 2,437 | 10 H2 · 5 H3 · 48 p · 4 images |
| shipping-container-homes | 2,588 | 12 H2 · 5 H3 · 55 p · 4 images |
| affordable-container-homes | 2,381 | 11 H2 · 5 H3 · 54 p · 4 images |

---

## 7 · L11 RE-MEASURED — FIVE ROUTES GAINED SUBSTANTIAL CONTENT

| Profile | Route | LCP ms | CLS |
|---|---|---|---|
| desktop | container-houses | 156 | 0 |
| desktop | prefab-container-homes | 168 | 0 |
| desktop | luxury-container-houses | 168 | 0 |
| desktop | shipping-container-homes | 200 | 0 |
| desktop | affordable-container-homes | 204 | 0 |
| desktop | prefabricated-container-house | 188 | 0 |
| mobile | container-houses | 252 | 0 |
| mobile | prefab-container-homes | 260 | 0 |
| mobile | luxury-container-houses | 188 | 0 |
| mobile | shipping-container-homes | 160 | 0 |
| mobile | affordable-container-homes | 164 | 0 |
| mobile | prefabricated-container-house | 268 | 0 |

**12/12 PASS, CLS 0 throughout**, with roughly 2,400 words and four images added per route.
Localhost figures, so treat them as a floor.

Gallery strips unchanged: 5 thumbs / 5 columns / 0px trailing whitespace on the five subpages,
6/6/0px on the hub.

---

## 8 · GATE SUMMARY

| Gate | Result |
|---|---|
| Hub v2 verified before building | **PASS — hash moved, both markers present** |
| All four implemented verbatim | **PASS — round-trip diff, first time** |
| L23 rendered counts reported | **PASS — 2,422 · 2,420 · 2,573 · 2,360** |
| No padding | **PASS** |
| Zero adjacency failures | **PASS — 0 on all six routes** |
| Four different views from four different sizes | **PASS — all five copy pages** |
| Image choices reported | **PASS — §3** |
| Every anchor reported verbatim | **PASS — §4** |
| Zero links alone / beneath an image | **PASS on all five copy pages** |
| Anchor uniqueness cluster-wide | **1 duplicate, clears with page six** |
| One H1 per route | **PASS — all six** |
| Hub links to `/product/prefabricated-houses` | **PASS — restored** |
| L11 LCP warm, desktop and mobile | **PASS — 12/12, CLS 0** |

---

## 9 · WHAT IS LEFT

**From Fable 5:** page 6 copy — the last one · the Section H pack for page six (44 strings) ·
whether to close the remaining word gaps (78 · 141 · 80 · 140; shipping is already over).
**From SAMAN:** the 60-row alt manifest — **still not on disk**, checked again this session, so
page six's 60 assets keep empty alts · the video transcript and the L18
publish-without-transcript decision.
**Open from E3:** L16 Gate 1 measures 70.4% against the 63.0% in ruling 3.
