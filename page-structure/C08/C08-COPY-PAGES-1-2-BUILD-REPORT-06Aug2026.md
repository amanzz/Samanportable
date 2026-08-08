# C-08 COPY · PAGES 1 AND 2 — BUILD REPORT

**Date** 06 Aug 2026 · **Branch** `agent/c08-e2-contact-images-spec-20260805` · **Commit** `51275a4b`
**Preview** `http://localhost:3380/product/container-houses`
(clean worktree `C:/tmp/saman-c08-e3-clean`, own `npm ci`, **production** `next build` + `next start`)
**Screenshots** `D:\Project-shekhar\reports\C08-COPY-shots\` — description section + gallery strip per route, captured at 1440×900.

Build only. Not merged, not deployed.

---

## 0 · HEADLINE

| | Page 1 · hub | Page 2 · prefab |
|---|---|---|
| Source | C08-COPY-01 | C08-COPY-02 |
| Implemented verbatim | **YES — proved** | **YES — proved** |
| L23 rendered words | **2,357** | **1,647** |
| Under 2,500 | yes, short by **143** | yes, short by **853** |
| Headings | 8 H2, one page H1 | 8 H2 + 4 H3, one page H1 |
| Links rendered | **6** | **5** (the ticket says 6 — see §4) |
| Images, 4 different views from 4 different sizes | **PASS** | **PASS** |
| Adjacency, paragraph both sides | **PASS** | **1 fails — the copy places IMAGE 4 against a heading (§3)** |
| Links inside sentences | **PASS** | **PASS** |

Nothing was padded. Nothing was rewritten.

### How verbatim was proved, not asserted

The build script converts **markup only** — `### H2 · Title` → `<h2>`, `**bold**` → `<strong>`,
`[anchor](/href)` → `<a>`, blank-line runs → `<p>`. It then strips the generated HTML back to
plain text and diffs it character by character against the source prose with authoring notation
removed, and **refuses to write the file on any difference**. Both pages passed on that check;
the one difference it did catch during development was my own comparison inserting a space
where `<em>` had been, which I fixed in the checker rather than in the copy.

---

## 1 · RENDERED WORD COUNT, L23

Measured on the rendered production DOM of the description panel, headings included.

| Route | Rendered words | Target | Short by |
|---|---|---|---|
| `/product/container-houses` | **2,357** | 2,500 | 143 |
| `/product/container-houses/prefab-container-homes` | **1,647** | 2,500 | 853 |

Both are under 2,500. Reported, and stopped. **No padding.**

For reference against the pack's own estimate: C08-COPY-01 predicted "~2,700" body words. The
rendered figure is 2,357 — the gap is the link-manifest and measurement sections at the foot of
the file, which are documentation rather than body copy and were correctly not implemented.

---

## 2 · IMAGES PLACED

**Standing rule: four different view types from four different sizes.** Both pages pass both
gates — no two images on a route share a view token, and no two come from the same size.

### Page 1 · `/product/container-houses`

| Slot | Brief in the copy | Size | Token | View | Filename |
|---|---|---|---|---|---|
| 1 | exterior hero, 40x10 or 40x12 | 40x12 | E06 | elevated-three-quarter | `container-houses-40x12-elevated-three-quarter.webp` |
| 2 | interior, living or kitchen, larger size | 40x10 | I02 | semi-kitchen-dining | `container-houses-40x10-semi-kitchen-dining.webp` |
| 3 | exterior, different size and colour from 1 | 20x12 | E03 | long-side-elevation | `container-houses-20x12-long-side-elevation.webp` |
| 4 | interior, different room type from 2 | 20x8 | I04 | bathroom-reverse | `container-houses-20x8-bathroom-reverse.webp` |

Tokens E06 · I02 · E03 · I04 — four distinct. Sizes 40x12 · 40x10 · 20x12 · 20x8 — four
distinct. Slot 1 is tan, slot 3 sage green, so "different colour" holds as well as different size.

### Page 2 · `/product/container-houses/prefab-container-homes`

| Slot | Brief in the copy | Size | Token | View | Filename |
|---|---|---|---|---|---|
| 1 | EXTERIOR HERO, 40x10 | 40x10 | E03 | long-side-elevation | `prefab-container-homes-40x10-long-side-elevation.webp` |
| 2 | INTERIOR kitchen/dining, **20x12** | **20x10** | I02 | semi-kitchen-dining | `prefab-container-homes-20x10-semi-kitchen-dining.webp` |
| 3 | EXTERIOR different angle and size, 20x8 | 20x8 | E02 | front-left-angle | `prefab-container-homes-20x8-front-left-angle.webp` |
| 4 | INTERIOR bedroom/bathroom, 40x12 | 40x12 | I03 | bedroom-view | `prefab-container-homes-40x12-bedroom-view.webp` |

Tokens E03 · I02 · E02 · I03 — four distinct. Sizes 40x10 · 20x10 · 20x8 · 40x12 — four distinct.

**Slot 2 deviates on size, and could not do otherwise.** The brief asks for a kitchen-or-dining
interior at 20x12. At 20x12 the only 16:9 Info asset that is an interior is `I03 bedroom-view`.
The kitchen/dining frame at that size (`I02 semi-kitchen-dining`) is consumed by the square
gallery, and re-cutting it as a 16:9 would breach the standing gate that **no source file is
used twice on the same route**.

Falling back to 20x12's `I03` was the other option, and it is worse: slot 4 is also `I03`, so
the page would then carry the same view token twice — the exact repeat the standing rule exists
to stop. I therefore kept the **view type** and both no-repeat gates, and moved the size one
step to 20x10. If you would rather have the size than the room type, say so and slot 2 becomes
20x12 `I03 bedroom-view` — but then slot 4 must change too.

---

## 3 · ADJACENCY

Gate: a copy paragraph immediately before **and** after every in-body image.

| Route | Images | Failures |
|---|---|---|
| container-houses | 4 | **0** |
| prefab-container-homes | 4 | **1** |
| prefabricated-container-house | 8 | 0 |

**Page 2's single failure is in the approved copy itself.** C08-COPY-02 places

```
**[IMAGE 4 · 16:9 · INTERIOR · bedroom or bathroom · use the 40x12 size]**

### H2 · Warranty and service life
```

so IMAGE 4 has a paragraph before it and a **heading** after it. L4 forbids me from reordering,
so I implemented it exactly as written and am reporting the gate failure rather than quietly
moving the marker one block later. Two ways to close it, both yours: move the IMAGE 4 marker
below the first paragraph of "Warranty and service life", or rule that a heading after an image
satisfies the rule.

**One real defect found and fixed along the way.** On page six an injected image had landed
between an FAQ question and its answer — my copy-block test counted an `<h3>` as copy because it
has words in it. A copy block must now be a `<p>`, so an image can never split a question from
its answer nor wedge between a heading and the section it introduces. Three new fixtures cover
it; 35 layout fixtures now pass.

---

## 4 · LINKS

### Page 1 · 6 rendered links, verbatim anchors

| # | Anchor | Target |
|---|---|---|
| 1 | repeatable prefab module line | `/product/container-houses/prefab-container-homes` |
| 2 | villa-grade luxury build | `/product/container-houses/luxury-container-houses` |
| 3 | the reinforced shipping-form build | `/product/container-houses/shipping-container-homes` |
| 4 | the fixed-plan affordable build | `/product/container-houses/affordable-container-homes` |
| 5 | the fully fitted route | `/product/container-houses/prefabricated-container-house` |
| 6 | portable cabin | `/product/portable-cabin` |

Matches the pack's own manifest and the ticket's "hub carries 6". Zero links in the first
paragraph; the hub never links out on its own primary keyword; the cross-cluster link sits
inside the sentence that explains the difference.

*Note: C08-COPY-01 says "Eleven links" in its implementation notes and "**11 links**" in the
manifest heading, but the manifest table lists six, its own footer says "Six rendered links",
and the ticket says six. I implemented the six that are actually inline in the body. The "11"
appears to be a stale figure.*

### Page 2 · 5 rendered links, verbatim anchors

| # | Anchor | Target |
|---|---|---|
| 1 | luxury container house range | `/product/container-houses/luxury-container-houses` |
| 2 | reinforced shipping-form build | `/product/container-houses/shipping-container-homes` |
| 3 | lowest rate in the range starts at ₹1,438 per sq ft | `/product/container-houses/affordable-container-homes` |
| 4 | quoted on your drawing rather than sold from a ladder | `/product/container-houses/prefabricated-container-house` |
| 5 | container houses hub | `/product/container-houses` |

**The ticket says prefab carries 6. The file contains 5.** Four are in the "Where this sits
against the rest of the range" paragraph and one in the sentence that follows it; there is no
sixth anchor anywhere in the body. I did not invent one.

### Link-shape gates

| Gate | Page 1 | Page 2 |
|---|---|---|
| Zero links standing alone on their own line | **PASS** | **PASS** |
| Zero links directly beneath an image with no prose | **PASS** | **PASS** |
| Every anchor has body text before and after, same paragraph node | **PASS** | **PASS** |

### Anchor uniqueness across the six routes — one collision

`luxury container house range` appears on **page 2 (new, approved)** and on
**prefabricated-container-house (pre-existing)**. I cannot change page 2's anchor — it is
verbatim-locked. Page six's copy is still outstanding, so the natural fix is for its rewrite to
use a different anchor. Flagged rather than resolved.

Every other anchor across the cluster is unique.

---

## 5 · TWO LINKS THAT THE NEW HUB COPY REMOVES

Implementing C08-COPY-01 verbatim replaces the hub's previous description, and with it two
links that earlier rulings put there deliberately. Stating them so the removal is a decision
rather than an accident:

| Removed anchor | Target | Put there by |
|---|---|---|
| prefabricated houses range | `/product/prefabricated-houses` | C-08 addendum §4, 02 Aug — "unique site-wide; verify mechanically" |
| affordable container homes | `/product/container-houses/affordable-container-homes` | HELD-PAGES ruling, 02 Aug — the hub RTE comparison line |

Also gone: `what steel space really costs` → `/ship-container-price-in-india` and
`container house prices in Tamil Nadu` → `/container-house-price-in-tamil-nadu`. The new copy
still reaches all four siblings and adds a cross-cluster link to `/product/portable-cabin`, so
no sibling is orphaned — but `/product/prefabricated-houses` now has no inbound link from this
hub, and the cross-cluster link to Tamil Nadu is gone.

---

## 6 · PRE-EXISTING FAILURES ON PAGES 3–6, OUT OF SCOPE

The link-shape gates read cluster-wide, so I ran them cluster-wide. The four routes whose copy
has **not** been re-authored still carry link-only paragraphs from the 02 Aug content pack:

| Route | Links standing alone | Link-only node directly beneath an image |
|---|---|---|
| luxury-container-houses | 1 — `every build style compared` | 1 |
| shipping-container-homes | 2 — `the six-size range page`, `the finished building, not the container` | 2 |
| affordable-container-homes | 1 — `all five container home builds` | 1 |
| prefabricated-container-house | 1 — `ncr@samanportable.com` at a paragraph end | 0 |

These are in approved copy I have no instruction to change, and rewriting them would breach L4
just as surely as rewriting pages 1 and 2 would. **They resolve when pages 3–6 copy lands.** The
page-six one is the contact-block override from the E2 ruling, where the email ends the
paragraph.

---

## 7 · GATE SUMMARY

| Gate | Result |
|---|---|
| Implemented verbatim, character for character | **PASS — proved by round-trip diff, both pages** |
| L23 rendered word count reported | **PASS — 2,357 and 1,647** |
| No padding | **PASS — nothing added** |
| No two description images share a view token | **PASS — both pages** |
| No two description images from the same size | **PASS — both pages** |
| Adjacency: paragraph before and after | **PASS page 1 · 1 FAIL page 2, caused by the copy (§3)** |
| Zero links standing alone on their own line | **PASS pages 1–2 · pre-existing failures on 3–6 (§6)** |
| Zero links directly beneath an image | **PASS pages 1–2 · pre-existing failures on 3–6 (§6)** |
| Every anchor has prose both sides in the same node | **PASS pages 1–2** |
| Zero anchor repeats across the six routes | **1 COLLISION (§4)** |
| One H1 per route, buy-box product name | **PASS — 1 on all six, 0 in any description panel** |
| Every heading H2, FAQ questions on page 2 H3 | **PASS — 8 H2 page 1; 8 H2 + 4 H3 page 2** |
| Gallery strip unchanged by this work | **PASS — 5/5/0px on subpages, 6/6/0px hub** |

---

## 8 · STILL OUTSTANDING

**From Fable 5:** pages 3–6 copy · the Section H pack for page six (44 strings) · the 60-row alt
manifest (checked again this session — still not placed).
**From SAMAN:** the video transcript and the L18 publish-without-transcript decision.
**Open from E3:** L16 Gate 1 measures 70.4% against the 63.0% stated in ruling 3.
**New, from this build:** the IMAGE 4 placement on page 2 (§3), the missing sixth link on
page 2 (§4), the `luxury container house range` anchor collision (§4), and the four hub links
the new copy removes (§5).
