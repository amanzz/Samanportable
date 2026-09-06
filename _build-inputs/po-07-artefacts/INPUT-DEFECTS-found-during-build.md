# Contradictions found inside the signed PO-07 inputs

Four. Two were put to SAMAN before any code was written and decided on 6 Sep 2026; two
are recorded here with the resolution taken and the evidence to review it.

---

## 1 — `forbidden_strings` collides with the mandated Section 2 copy  *(decided)*

`copy.forbidden_strings[7]` is `"office cabin range"`. `copy.section2.paragraph2`, which
is mandatory verbatim copy and carries the page's one approved contextual link, contains
`"portable office cabin range"`.

**SAMAN, 6 Sep 2026: the copy wins; the forbidden-list entry is a pack defect.** Copy
rendered byte-for-byte. Costs one `verify_po07.py` check — see
`KNOWN-FAILURES-verify_po07.md` group 5.

## 2 — the technical PDF has two different destinations  *(decided)*

`copy.specifications_tab.pdf_href` says `/specs/…`; `asset_map.spec_pdf.out` says
`public/downloads/…`. `verify_po07.py` checks **both**, so one copy of the file cannot
satisfy it.

**SAMAN, 6 Sep 2026: ship to `public/specs/` only** — the link resolves and it matches
the convention 20+ product JSONs already use. Costs one check — group 3.

## 3 — six of the 36 gallery sources are not 1:1, and the map forbids cropping

`asset_map.rules.gallery` declares `"ratio": "1:1", "crop": "none"`. Six sources are not
square and cannot be made square without cropping:

| size | file | source | ratio |
|---|---|---|---|
| 20x10 | `02-…-20x10-rear.png` | 1774×887 | 2.00 |
| 20x10 | `03-…-20x10-aerial.png` | 1448×1086 | 1.33 |
| 20x10 | `05-…-20x10-console.png` | 1774×887 | 2.00 |
| 30x10 | `02-…-30x10-rear.png` | 1774×887 | 2.00 |
| 30x10 | `04-…-30x10-interior.png` | 1448×1086 | 1.33 |
| 40x10 | `02-…-40x10-rear.png` | 1983×793 | 2.50 |

The other 30 are exactly 1254×1254 and were re-encoded with no geometry change at all.

**Resolution taken.** Cropping a *photographic render* is already established practice —
SOC-01 (`0c19817d`) and PO-02 did it — and the never-crop rule exists to protect GA-board
dimension text, which is untouched here. Each of the six gets a **full-height square
window whose horizontal position is chosen by edge energy**, so the cabin fills the frame
instead of a dead-centre slab of wall or sky. No upscaling: the outputs keep their native
square size (887, 1086 or 793 px) rather than being blown up to the declared 1254 px,
because upscaling invents detail the master does not have. `verify_po07.py` checks ratio
and file size, not width, and all six pass.

Review before approving — a dead-centre crop was visibly worse, especially the 40x10:

* `non-square-gallery-sources-crop-review.jpg` — full source beside the naive centre crop
* `non-square-gallery-six-shipped.jpg` — the six as actually shipped

All six still match their pack alt text (the rears show a window wall with no external
door; the 20x10 aerial shows the ridge and lifting eyes; the 30x10 interior shows both
console islands).

## 4 — `asset_map.not_used` contradicts `asset_map.description_images`

`not_used` lists `03-long-description-images/01-…-10x10-overview.png` and
`04-…-20x12-overview.png` as *"not placed on this page"*, but
`description_images.description_02` and `description_04` place exactly those two files.
The specific placement instruction was followed and the stale `not_used` line ignored;
five description images ship, as the copy pack and SAMAN's 6 Sep ruling require.

---

## Also worth flagging (not contradictions)

* **The "only four of nine return 200" note in the build prompt is stale.** PO-03 and
  PO-04 merged to `static-migration` after it was written. At this HEAD **six** of the
  nine `explore_range.order` destinations are approved production paths, and all six are
  rendered. The three still on `plannedReleasePaths` (`portable-mobile-laboratory`,
  `construction-site-cabin`, `portable-conference-cabin`) are skipped, as are both
  `never_list` URLs.
* **`ymal.intro` says "Three more cabins"** while six tiles now render. The house
  precedent is that this subline is a fixed string, not a tile count — PO-02 shipped
  "Eight more office configurations…" with fewer tiles. Shipped as signed; reword if you
  would rather it tracked the count.
* **Four aerial slides needed q21–q41** to reach the 80–120 KB band at the declared
  1254 px (quality first, then width, per the rules). Opened at 1:1 against the source:
  every wall, opening, frame, door handle and roof rib survives; only high-frequency
  ground texture softens. Same trade PO-03 made at q29/q43. See
  `low-quality-aerials-1to1-comparison.jpg`.
