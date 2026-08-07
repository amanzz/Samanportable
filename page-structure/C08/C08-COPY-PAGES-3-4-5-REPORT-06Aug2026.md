# C-08 COPY · PAGES 3, 4, 5 — BUILD REPORT (page 1 halted)

**Date** 06 Aug 2026 · **Branch** `agent/c08-e2-contact-images-spec-20260805` · **Commit** `8647c5bb`
**Preview** `http://localhost:3400/product/container-houses/luxury-container-houses`
(clean worktree `C:/tmp/saman-c08-e3-clean`, own `npm ci`, **production** `next build` + `next start`)
**Screenshots** `D:\Project-shekhar\reports\C08-COPY-shots\` — description section + gallery strip per route, 1440×900.

Build only. Not merged, not deployed.

---

## 0 · THE HUB CHECK YOU ASKED FOR — IT STILL HASHES TO af499868eaadd904

**Stopped on page 1, as instructed.** The hub was not rebuilt.

Two hub files are now on disk and **both are byte-identical to each other and to v1**:

| File | File sha256 | Body sha256 | Body words | `/product/prefabricated-houses` | Reads |
|---|---|---|---|---|---|
| `…hub-05Aug2026.md` (11:46) | `8bf1a42f0c01760b` | **`af499868eaadd904`** | 2,383 | absent | "11 links" |
| `…hub-05Aug2026_1.md` (13:38) | `8bf1a42f0c01760b` | **`af499868eaadd904`** | 2,383 | absent | "11 links" |

The `_1` file was dropped at 13:38 alongside pages 3–5 — the timestamp says it came with this
batch — but it is a **duplicate of v1**, not v2. Identical file hash, not merely identical body.
It looks like the save produced a deduplicated filename rather than an overwrite, and the
content that got saved was still v1.

The hub's numbers below are therefore yesterday's, and the `/product/prefabricated-houses` link
required by addendum §4 is still missing. Place the real v2 and it is one pass.

---

## 1 · RENDERED WORD COUNT, L23

| Route | Source body | **Rendered (L23)** | Target | Short by |
|---|---|---|---|---|
| container-houses *(v1, not rebuilt)* | 2,383 | **2,357** | 2,500 | 143 |
| prefab-container-homes *(unchanged)* | 2,371 | **2,359** | 2,500 | 141 |
| **luxury-container-houses** | 2,437 | **2,420** | 2,500 | **80** |
| **shipping-container-homes** | 2,116 | **2,104** | 2,500 | **396** |
| **affordable-container-homes** | 2,150 | **2,130** | 2,500 | **370** |

**Nothing padded.** Note the rendered figures come out slightly *below* the source body counts,
not above: the rendered panel counts the heading text but the source count already included it,
and my extractor drops the authoring notation (`H2 ·`, `**`, markdown link brackets) that the
source count retained. Luxury is within 80 of target; shipping and affordable are the two that
need most.

Measured against your source figures: luxury 2,471 → I count 2,437 body words, shipping 2,150 →
2,116, affordable 2,184 → 2,150. Each is 34 under, consistently, which is the notation
difference rather than missing copy.

---

## 2 · SIX IMAGES SIT IMMEDIATELY BEFORE A HEADING — SOURCE FIX NEEDED

This is the same defect you fixed on page 2's IMAGE 4, and it recurs six times across the three
new files. L4 forbids me from moving a marker, so I implemented them exactly as written and am
reporting rather than silently relocating.

| Route | Slot | Source line | Immediately followed by |
|---|---|---|---|
| luxury-container-houses | IMAGE 3 | 68 | `### H2 · What the price includes, and what it does not` |
| shipping-container-homes | IMAGE 2 | 54 | `### H2 · Coastal and industrial exposure` |
| shipping-container-homes | IMAGE 3 | 76 | `### H2 · What the price includes, and what it does not` |
| shipping-container-homes | IMAGE 4 | 98 | `### H2 · Transport, permits and what to check on arrival` |
| affordable-container-homes | IMAGE 2 | 46 | `### H2 · What is optional, and priced separately` |
| affordable-container-homes | IMAGE 3 | 70 | `### H2 · Who this build is genuinely right for` |

Each needs the marker moved down past the first paragraph of the following section — exactly the
move you made for page 2. The other six image slots across the three pages have a paragraph on
both sides and pass.

**Adjacency by route:** container-houses 0 failures · prefab 0 · luxury **1** · shipping **3** ·
affordable **2** · prefabricated-container-house 0.

---

## 3 · IMAGES PLACED, WITH EVERY CHOICE REPORTED

Both no-repeat gates hold on all three pages: four different view tokens, four different sizes.

### Page 3 · luxury-container-houses — all four sizes as named

| Slot | Brief | Size | Token | View |
|---|---|---|---|---|
| 1 | EXTERIOR HERO · 40x12 | 40x12 | E06 | elevated-three-quarter |
| 2 | INTERIOR kitchen/dining · 20x10 | 20x10 | I02 | semi-kitchen-dining |
| 3 | EXTERIOR different angle · 20x12 | 20x12 | E03 | long-side-elevation |
| 4 | INTERIOR bedroom/bathroom · 40x8 | 40x8 | I04 | bathroom-reverse |

No substitutions. Every named size had an asset in the named family.

### Page 4 · shipping-container-homes — one substitution

| Slot | Brief | Size | Token | View |
|---|---|---|---|---|
| 1 | EXTERIOR rear or side · 40x10 | 40x10 | E04 | rear-right-angle |
| 2 | INTERIOR living or entry · **20x8** | **20x10** | I02 | semi-kitchen-dining |
| 3 | EXTERIOR elevated/three-quarter · 40x12 | 40x12 | E06 | elevated-three-quarter |
| 4 | INTERIOR bathroom/bedroom · 20x12 | 20x12 | I03 | bedroom-view |

**Slot 2 deviates on both size and room family, and had to.** There is **no 16:9 "living or
entry" asset at any size on any route** — the entry/living frame is `I01`, and `I01` is consumed
by the square gallery at every size, so cutting a 16:9 from it would breach the standing gate
that no source file is used twice on a route. The only interior at 20x8 is `I04 bathroom-reverse`,
which is the wrong room and would also collide with nothing here but reads as a bathroom.
I took the nearest available family — `I02 semi-kitchen-dining`, which is the open
living-dining-kitchen frame — and moved the size to 20x10 to keep both no-repeat gates.

### Page 5 · affordable-container-homes — two size substitutions

| Slot | Brief | Size | Token | View |
|---|---|---|---|---|
| 1 | EXTERIOR HERO · 20x10 | 20x10 | E06 | elevated-three-quarter |
| 2 | INTERIOR kitchen/dining · **40x8** | **40x10** | I02 | semi-kitchen-dining |
| 3 | EXTERIOR end or alternate angle · **40x10** | **40x12** | E05 | end-dominant |
| 4 | INTERIOR bedroom/bathroom · 20x8 | 20x8 | I04 | bathroom-reverse |

**Both deviations are forced by one constraint.** The kitchen/dining frame `I02` exists at only
two sizes, 20x10 and 40x10. Slot 1 already takes 20x10 as named, so slot 2 must be 40x10 — which
then makes slot 3's named 40x10 unavailable under the no-same-size gate. I moved slot 3 to 40x12
while keeping its "end" view family (`E05 end-dominant`).

The alternative — leaving slot 3 at 40x10 and moving slot 2 — is impossible: slot 2's room type
only exists at the two sizes already spoken for. Room types are preserved on every slot.

---

## 4 · LINKS — 5 PER PAGE, ALL UNIQUE CLUSTER-WIDE

### Page 3 · luxury-container-houses

| # | Anchor, verbatim | Target |
|---|---|---|
| 1 | modules repeated to one drawing | `/product/container-houses/prefab-container-homes` |
| 2 | built for relocation and coastal duty | `/product/container-houses/shipping-container-homes` |
| 3 | one efficient plan per size | `/product/container-houses/affordable-container-homes` |
| 4 | delivered as a single completed unit | `/product/container-houses/prefabricated-container-house` |
| 5 | the full container house range | `/product/container-houses` |

### Page 4 · shipping-container-homes

| # | Anchor, verbatim | Target |
|---|---|---|
| 1 | the villa-grade interior specification | `/product/container-houses/luxury-container-houses` |
| 2 | identical factory modules | `/product/container-houses/prefab-container-homes` |
| 3 | the lowest per-square-foot rate we publish | `/product/container-houses/affordable-container-homes` |
| 4 | a unit that arrives finished and needs no site team at all | `/product/container-houses/prefabricated-container-house` |
| 5 | our container house range | `/product/container-houses` |

### Page 5 · affordable-container-homes

| # | Anchor, verbatim | Target |
|---|---|---|
| 1 | the hospitality-grade finish | `/product/container-houses/luxury-container-houses` |
| 2 | a heavier shell engineered for relocation | `/product/container-houses/shipping-container-homes` |
| 3 | repeatable modules for colony work | `/product/container-houses/prefab-container-homes` |
| 4 | the fitted single-unit route | `/product/container-houses/prefabricated-container-house` |
| 5 | every container house we build | `/product/container-houses` |

**Cluster-wide check: 35 distinct anchors, one duplicate.** All 15 new anchors are unique
against pages 1, 2 and 6. The single remaining duplicate is the pre-existing
`luxury container house range` on page 2 and page six, which page six's rewrite will clear.

### Link-shape gates — now clean on pages 3–5

The new copy **removed the link-only paragraphs** that pages 3, 4 and 5 previously carried
(`every build style compared`, `the six-size range page`, `the finished building, not the
container`, `all five container home builds`). Those failures are gone.

| Gate | Pages 3, 4, 5 |
|---|---|
| Zero links standing alone on their own line | **PASS — 0** |
| Zero links directly beneath an image | **PASS — 0** |
| Every anchor has prose before and after in the same paragraph node | **PASS** |

The only remaining link-shape failure anywhere in the cluster is page six's
`ncr@samanportable.com` ending a paragraph — the E2 contact-block override, pre-existing, and it
clears with page six's copy.

---

## 5 · HEADINGS

One H1 per route on all six, and it is the buy-box product name. Zero H1 in any description panel.

| Route | H2 | H3 |
|---|---|---|
| luxury-container-houses | 10 | 5 |
| shipping-container-homes | 10 | 5 |
| affordable-container-homes | 10 | 5 |

---

## 6 · VERBATIM PROOF

Same method, unchanged: markup-only conversion, then the generated HTML is stripped back to text
and diffed character by character against the source prose with authoring notation removed. The
script **refuses to write on any difference**. All three new pages passed first time.

| Route | Body words | Blocks emitted |
|---|---|---|
| luxury-container-houses | 2,437 | 10 H2 · 5 H3 · 48 p · 4 images |
| shipping-container-homes | 2,116 | 10 H2 · 5 H3 · 46 p · 4 images |
| affordable-container-homes | 2,150 | 10 H2 · 5 H3 · 48 p · 4 images |

---

## 7 · GATE SUMMARY

| Gate | Result |
|---|---|
| Pages 3, 4, 5 implemented verbatim | **PASS — proved by round-trip diff** |
| Page 1 implemented from v2 | **HALTED — file on disk is still v1 (§0)** |
| L23 rendered counts reported | **PASS — 2,420 · 2,104 · 2,130** |
| No padding | **PASS** |
| Four different views from four different sizes | **PASS — all three pages** |
| Every image choice reported | **PASS — §3, with all three substitutions explained** |
| 5 links per new page | **PASS — 5 each** |
| Every anchor unique cluster-wide | **PASS for the 15 new · 1 pre-existing duplicate (§4)** |
| Zero links alone on a line / beneath an image | **PASS on pages 3–5 (newly fixed by the copy)** |
| Adjacency: paragraph before and after every image | **6 FAILURES — all in the source (§2)** |
| One H1 per route | **PASS — all six** |
| Gallery strip | **PASS — 5/5/0px subpages, 6/6/0px hub** |

---

## 8 · WHAT IS WAITING

**From Fable 5:** the real v2 hub file · the six IMAGE markers that sit before headings (§2) ·
page 6 copy · the Section H pack for page six (44 strings) · a ruling on the
`luxury container house range` collision · whether to close the remaining word gaps
(80 · 396 · 370 · 141 · 143).
**From SAMAN:** the 60-row alt manifest — **still not on disk**, checked again this session ·
the video transcript and the L18 publish-without-transcript decision.
**Open from E3:** L16 Gate 1 measures 70.4% against the 63.0% in ruling 3.
