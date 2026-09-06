# TICKET PO-05-R1 · Image placement repair, then deploy
**Raised 6 September 2026 by SAMAN · against PR #193, branch `feature/po05-portable-mobile-laboratory-20260905`**

**SESSION: continue in the SAME Claude Code session that built PR #193 if it is still open, so the branch and the preview at `http://localhost:3105` are already in hand. If that session is gone, start a NEW one and check the branch out.**

---

## What is wrong

The page does not match the design lock. Three defects, one root cause.

1. **Six images are rendered as a band between Section 2 and Section 3.** The design lock has no such band. Verified on the live `https://www.samanportable.com/product/porta-cabins` on 6 September 2026: between the Section 2 H2 and the Section 3 H2 the lock renders exactly one product image, `porta-cabin-section2-20x10-desert-ochre-site.webp`, which is the Section 2 split card. Nothing else.
2. **The Description tab has no images.** The lock's Description tab carries **six**: `porta-cabin-description-01-10x10-oxford-teal-exterior.webp` through `porta-cabin-description-05-40x10-manager-and-common-office.webp`, plus `saman-porta-cabin-10x10-compact-site.webp`. They sit inside the `div.prose` of the `radix-…-content-description` panel, interleaved with the H2s.
3. **A `mediaBand` opt-in prop was added to `RightToExistEntry`.** It exists only because the previous build prompt asked for a block that the lock does not have, and forbade images in the tab where the lock puts them. Remove it.

**Root cause: the build prompt was wrong, not the build.** Step 4 invented a media band, and Step 8 said "no images of any kind in this tab". Both have been corrected in the pack and in the SAMAN-105 project instructions. Your reading of the repo was right; my instruction was wrong.

## What the lock actually does, measured

Description tab of `/product/porta-cabins`, walking `div.prose` in document order:

```
H2 Porta Cabin and Portable Cabin: One Product, Two Names
  (2 paragraphs)
H2 How SAMAN Builds Every Porta Cabin
  (1 paragraph)
IMG porta-cabin-description-01-...
  (2 paragraphs)
H3 Read the Approved GA Plan Before You Fix a Size
  (1 paragraph)
IMG porta-cabin-description-02-...
  ...
H2 Choose Your Configuration...
  (1 paragraph) TABLE
IMG porta-cabin-description-03-...
```

Totals in that panel: **6 images, 13 H2s, 2 tables, 2 lists**, FAQs as H4 under a final H2. Images always follow a paragraph or a table, never another image, never before the first H2, never inside the FAQ block.

## Do this

### 1. Revert the invented prop
- Remove the `mediaBand` field from `RightToExistEntry` and every reference to it.
- Remove the six-image band from the PO-05 route.
- After this, `RightToExistEntry` must be byte-identical to `origin/static-migration`. Show the diff proving it.

### 2. Re-read the corrected pack
Both files have been rewritten and are already on disk at
`D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\portable-mobile-laboratory\_build-inputs\`:
- `PO-05-portable-mobile-laboratory-copy-v1.json` — `media_band` is gone. `description_tab.sections[].items` now contains six items of `"type": "image"`, each with its `out` filename and `alt`, sitting at the exact position in the item list where it must render.
- `PO-05-portable-mobile-laboratory-asset-map-v1.json` — `media_band` is replaced by `description_images`, six entries keyed `description_01` … `description_06`, each carrying `src`, `out`, `size`, `after_h2` and `after`.

New copy sha: `f401ddad92a0c3a5373c8662bf87c9da0b8a3bd56b7d64353f0e26ebb13f3e05`. The old pack's `sha256_of_copy` did not reproduce because it was computed over the pre-image-fix object; ignore the previous value.

### 3. Render the six inside the Description tab
Use the same mechanism the lock uses (`infoImageLayout`, or whatever the porta-cabins Description tab already renders its six images with). Do not add a new component and do not add a new prop. Render `description_tab.sections[].items` in order; an item of `type: "image"` emits an image at that point in the prose with the `alt` given.

Placement, which is already encoded in the copy pack:

| # | Size | Description H2 it sits in | Position |
|---|---|---|---|
| 01 | 20×10 | Portable mobile laboratory, or a laboratory on wheels? Read this first | after paragraph 2 |
| 02 | 30×10 | Who orders a portable mobile laboratory, and where it stands | after paragraph 1 |
| 03 | 20×8 | What lab-ready means on this page, and what it does not | after paragraph 2 |
| 04 | 10×10 | Choosing between 100, 160, 200, 240, 300 and 400 sq ft | directly under that section's table |
| 05 | 20×12 | Why the cleaning aisle decides the width | after paragraph 1 |
| 06 | 40×10 | Water, drainage, power and the one sealed sleeve | after paragraph 1 |

Two sections carry no image: `How the price is built, and what is quoted separately` and `When a portable mobile laboratory is the wrong choice`. That is deliberate.

Output paths change from `media/…` to `description/…` and the filenames change to the lock's convention, `portable-mobile-laboratory-description-01-…` through `-06-…`. Re-encode from the same `_long-description/_master/` PNGs, 1600 px, q90, 80 to 120 KB, no crop. Lazy load all six.

### 4. Section 2 keeps exactly one image
The 20×10 GA board split card, unchanged. Nothing else between the Section 2 H2 and the Section 3 H2.

### 5. Section 3 heading level
You flagged that PO-01 to PO-04 render H2 via `CLUSTER_DESIGN_SLUGS` while the lock renders H3, and you scoped the opt-in off for this slug. **Keep it off.** The lock is the lock. Raise the four siblings as their own ticket rather than propagating the drift.

### 6. Re-run everything
- `verify_po05.py` has been updated: it now asserts the six description images exist, are referenced, carry their alt text, and that **no** description image renders between Section 2 and Section 3. Copy the new file from `_build-inputs\` before running.
- All six Template Conformance Gate artefacts again, including the structural diff (which should now show zero component-tree delta and zero prop delta, since the invented prop is gone).
- `RESULT: PASS` required.

### 7. Then deploy
SAMAN has approved deployment conditional on this repair. Once the six gates are green and the verifier prints `RESULT: PASS`, merge PR #193 into `static-migration` and deploy. Report the production URL and confirm `https://www.samanportable.com/product/portable-office/portable-mobile-laboratory` returns 200, self-canonical, with the six images in the Description tab and none between Section 2 and Section 3.

## Two open items from your PR, answered

- **`sha256_of_copy` did not reproduce.** Correct, and it was not your fault. It is a hash of the pack object as built, not of the file bytes, so it never reproduced from the file. It is informational only and the verifier does not check it. The new value is above.
- **`SECTION3_<size>_BULLETS` names nothing in the repo.** Also correct. That was carried over from the SOC-01 template. Wiring the bullets verbatim into `applicationsContent.panels[].applications` is right; keep it.

## Constraints unchanged

No price, size, specification or product fact changes. The three earlier rulings stand: no Portable Office head phrase; the 10×10 gallery ships four slides deliberately; the Wall B drift is accepted. No U+2014 in body copy. Do not touch any other route.
