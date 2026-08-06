# C-08 COPY v2 · PAGES 1 AND 2 — RE-IMPLEMENTATION REPORT

**Date** 06 Aug 2026 · **Branch** `agent/c08-e2-contact-images-spec-20260805` · **Commit** `57b4fbca`
**Preview** `http://localhost:3390/product/container-houses` · `.../prefab-container-homes`
(clean worktree `C:/tmp/saman-c08-e3-clean`, own `npm ci`, **production** `next build` + `next start`)
**Screenshots** `D:\Project-shekhar\reports\C08-COPY-shots\` — description section + gallery strip per route, 1440×900.

Build only. Not merged, not deployed.

---

## 0 · TWO THINGS TO READ FIRST

**1 · Page 2 was replaced. Page 1 was not.**

`C08-COPY-01-container-houses-hub-05Aug2026.md` in `D:\Project-shekhar\reports\` is
**byte-identical in its body copy to the version I built yesterday**. It carries none of the v2
changes described in the ticket:

| Expected in v2 | Present in the file on disk? |
|---|---|
| Grown to ~2,404 body words | **No** — still 2,383, the v1 figure |
| Link to `/product/prefabricated-houses` restored | **No** — zero occurrences of `prefabricated-houses` |
| "11 links" contradiction gone, reads 7 consistently | **No** — line 130 still reads `## LINK MANIFEST — 11 links, all hub-down`, table still lists 6 |

Proof: the body copy extracted from the file hashes to `af499868eaadd904` and produces 2,383
words, and a round-trip diff against the already-committed `descriptionHtml` returns
**identical**. The file's mtime moved to 11:46, so something re-saved it, but the content is v1.

**Page 1 is therefore unchanged in this build and its numbers are yesterday's.** Place the real
v2 hub file and I will implement it in one pass — no other work is waiting on it.

**2 · The alt manifest is still not on disk.**

`C08-PREFAB-CONTAINER-HOUSE-ALT-MANIFEST-60-05Aug2026.xlsx` is not in
`D:\Project-shekhar\reports\`, not anywhere on `D:\`, and no `.xlsx` created since 05 Aug
anywhere on the machine resembles it. I searched by exact name, by `*ALT*MANIFEST*`, and by
modification date across `D:\`, Desktop, Downloads and Documents.

**Both Step A gates therefore still FAIL: 0/60 alts implemented, 10 empty alts remain on that
route.** Nothing was authored. The wiring is ready; this is a data drop.

---

## 1 · RENDERED WORD COUNT, L23

Measured on the rendered production DOM of the description panel, headings included.

| Route | v1 | **v2** | Target | Short by |
|---|---|---|---|---|
| `/product/container-houses` | 2,357 | **2,357** *(file not replaced)* | 2,500 | 143 |
| `.../prefab-container-homes` | 1,647 | **2,359** | 2,500 | 141 |

Prefab gained **712 rendered words**. Both land just short of 2,500, as you predicted.
**Nothing padded.** Your call whether to close the last ~140 on each.

---

## 2 · ADJACENCY — ZERO FAILURES, ALL SIX ROUTES

| Route | In-body images | Adjacency failures |
|---|---|---|
| container-houses | 4 | **0** |
| prefab-container-homes | 4 | **0** |
| luxury-container-houses | 2 | **0** |
| shipping-container-homes | 3 | **0** |
| affordable-container-homes | 2 | **0** |
| prefabricated-container-house | 8 | **0** |

Page 2's IMAGE 4 now sits in the delivery section between *"Installation of a single module is a
day. A run of modules is scheduled with you."* and *"What we will not do is deliver into a site
that is not ready…"* — a paragraph on both sides, no heading adjacent. Verified in the DOM and
visible in the screenshot. **Fixed in the source, not overridden.**

---

## 3 · LINKS

### Page 1 · 6 links (unchanged — file not replaced)

| # | Anchor, verbatim | Target |
|---|---|---|
| 1 | repeatable prefab module line | `/product/container-houses/prefab-container-homes` |
| 2 | villa-grade luxury build | `/product/container-houses/luxury-container-houses` |
| 3 | the reinforced shipping-form build | `/product/container-houses/shipping-container-homes` |
| 4 | the fixed-plan affordable build | `/product/container-houses/affordable-container-homes` |
| 5 | the fully fitted route | `/product/container-houses/prefabricated-container-house` |
| 6 | portable cabin | `/product/portable-cabin` |

Still **no** link to `/product/prefabricated-houses`. The addendum §4 link stays missing until
the real v2 hub file lands.

### Page 2 · 6 links — the sixth is the new cross-cluster one

| # | Anchor, verbatim | Target |
|---|---|---|
| 1 | luxury container house range | `/product/container-houses/luxury-container-houses` |
| 2 | reinforced shipping-form build | `/product/container-houses/shipping-container-homes` |
| 3 | lowest rate in the range starts at ₹1,438 per sq ft | `/product/container-houses/affordable-container-homes` |
| 4 | quoted on your drawing rather than sold from a ladder | `/product/container-houses/prefabricated-container-house` |
| 5 | container houses hub | `/product/container-houses` |
| 6 | **labour colony work** | **`/product/labor-colony`** |

All six targets return HTTP 200, including the new `/product/labor-colony`.

### Link-shape gates

| Gate | Page 1 | Page 2 |
|---|---|---|
| Zero links standing alone on their own line | **PASS** | **PASS** |
| Zero links directly beneath an image with no prose | **PASS** | **PASS** |
| Every anchor has prose before and after in the same paragraph node | **PASS** | **PASS** |

### Anchor uniqueness — one collision remains

`luxury container house range` is on **page 2 (verbatim-locked)** and on
**prefabricated-container-house (pre-existing copy)**. Page six's copy is still outstanding, so
the natural fix is its rewrite. Every other anchor across the six routes is unique, including
the new `labour colony work`.

---

## 4 · IMAGES PLACED

Both no-repeat gates pass on both pages: four different view tokens, four different sizes.

### Page 1 · `/product/container-houses`

| Slot | Size | Token | View | Filename |
|---|---|---|---|---|
| 1 | 40x12 | E06 | elevated-three-quarter | `container-houses-40x12-elevated-three-quarter.webp` |
| 2 | 40x10 | I02 | semi-kitchen-dining | `container-houses-40x10-semi-kitchen-dining.webp` |
| 3 | 20x12 | E03 | long-side-elevation | `container-houses-20x12-long-side-elevation.webp` |
| 4 | 20x8 | I04 | bathroom-reverse | `container-houses-20x8-bathroom-reverse.webp` |

### Page 2 · `.../prefab-container-homes`

| Slot | Size | Token | View | Filename |
|---|---|---|---|---|
| 1 | 40x10 | E03 | long-side-elevation | `prefab-container-homes-40x10-long-side-elevation.webp` |
| 2 | **20x10** | I02 | semi-kitchen-dining | `prefab-container-homes-20x10-semi-kitchen-dining.webp` |
| 3 | 20x8 | E02 | front-left-angle | `prefab-container-homes-20x8-front-left-angle.webp` |
| 4 | 40x12 | I03 | bedroom-view | `prefab-container-homes-40x12-bedroom-view.webp` |

Slot 2 keeps the 20x10 substitution you accepted: 20x12 has no 16:9 kitchen/dining asset, and
falling back to 20x12's `I03` would duplicate slot 4's view token.

---

## 5 · HEADINGS

One H1 per route on all six, and it is the buy-box product name. Zero H1 in any description
panel.

**Page 1** — 8 H2, no H3.
**Page 2** — 10 H2 and 6 H3, up from 8 and 4. The two new H2 sections are *"What the price
includes, and what it does not"* and *"What a repeat order actually looks like"*; the two new
H3 questions are *"Can modules be used for workforce accommodation rather than family
housing?"* (which carries the labour-colony link) and *"How long does a module last?"*.

---

## 6 · VERBATIM PROOF

Unchanged method: markup-only conversion, then the generated HTML is stripped back to text and
diffed character by character against the source prose with authoring notation removed. The
script **refuses to write on any difference**. Both pages passed.

| Route | Body words in source | Blocks emitted |
|---|---|---|
| container-houses | 2,383 | 8 H2 · 39 p · 4 images |
| prefab-container-homes | 2,371 | 10 H2 · 6 H3 · 43 p · 4 images |

---

## 7 · PRE-EXISTING FAILURES ON PAGES 3–6 — UNCHANGED, OUT OF SCOPE

Still carrying link-only paragraphs from the 02 Aug pack, in approved copy I have no
instruction to change:

| Route | Links standing alone |
|---|---|
| luxury-container-houses | `every build style compared` |
| shipping-container-homes | `the six-size range page`, `the finished building, not the container` |
| affordable-container-homes | `all five container home builds` |
| prefabricated-container-house | `ncr@samanportable.com` ending a paragraph |

These resolve when pages 3–6 copy lands.

---

## 8 · GATE SUMMARY

| Gate | Result |
|---|---|
| Page 2 re-implemented verbatim from v2 | **PASS — proved by round-trip diff** |
| Page 1 re-implemented verbatim from v2 | **NOT DONE — the file on disk is v1** |
| L23 rendered word counts re-measured and reported | **PASS — 2,357 and 2,359** |
| No padding | **PASS** |
| Zero adjacency failures | **PASS — 0 on all six routes** |
| Page 2 carries 6 links | **PASS — 6, all resolving 200** |
| Every anchor reported verbatim | **PASS — §3** |
| Zero links alone on a line / beneath an image (pages 1–2) | **PASS** |
| Zero anchor repeats across the six routes | **1 COLLISION — §3** |
| Four different views from four different sizes | **PASS — both pages** |
| One H1 per route, buy-box product name | **PASS — all six** |
| 60/60 alts byte-identical to column H | **FAIL — manifest not on disk** |
| Zero empty alts on page six | **FAIL — 10 remain** |
| Hub link to `/product/prefabricated-houses` restored | **NOT DONE — depends on the v2 hub file** |

---

## 9 · WHAT IS WAITING

**From Fable 5:** the real v2 hub file · pages 3–6 copy · the Section H pack for page six
(44 strings) · a ruling on the `luxury container house range` anchor collision · whether to
close the ~140-word gap on each page.
**From SAMAN:** the 60-row alt manifest · the video transcript and the L18
publish-without-transcript decision.
**Open from E3:** L16 Gate 1 measures 70.4% against the 63.0% in ruling 3.
