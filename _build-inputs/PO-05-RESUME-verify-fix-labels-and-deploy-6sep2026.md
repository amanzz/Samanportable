# TICKET PO-05-R2 (rev 2) · Photographs in Section 3, tab labels, then merge and deploy
**Raised 6 September 2026 by SAMAN · PR #193, branch `feature/po05-portable-mobile-laboratory-20260905`**
**This revision supersedes the version of this file issued earlier today. Work from this one.**

**APPLICATION: Claude Code. SESSION: NEW. The previous session is gone. Check the branch out first.**

---

## Status before this ticket

The image-placement repair from ticket PO-05-R1 **is already applied** on the branch. Measured on the still-running preview at `http://localhost:3105/product/portable-office/portable-mobile-laboratory`:

- One image between the Section 2 H2 and the Section 3 H2, the split card. The six-image band is gone.
- Six images inside the Description tab, at the exact anchors R1 specified, including image 04 directly under the size table.
- The two held-out 10×10 exteriors are absent. One H1, zero empty alt attributes, no U+2014.

**Production is still 404.** Nothing was merged or deployed.

## Change 1 · Section 3 shows the product, not a drawing (SAMAN ruling, 6 September 2026)

Section 3's left column currently renders the 2D GA specification board for each size. SAMAN has ruled it must be a **photograph of the unit**. The project instructions allow either ("GA board or image on the left"); this page takes the image.

- **Section 3, left column, per size:** that size's `01 front-hero` gallery master, centre-cropped to 16:9. Paths in `asset_map.section3_images`. Alt text in `copy.alt_text.section3_images`.
- **The six GA boards move to the Specifications tab**, below the tables and above the two coordination diagrams. They keep the opening, bench and sink schedules on the page. Paths unchanged, in `asset_map.ga_boards`, whose `slot` field now says Specifications tab. Spec narrative paragraph 3 already announces them.

**Cropping.** The gallery masters are 1:1 and both slots are 16:9. Take a **centred** 16:9 crop: full width, height = width × 9/16, equal trim top and bottom. This is the sanctioned case in the standing rule, "crop only to reach the slot's ratio, never to reduce file size". I checked the 10×10, 20×10 and 40×10 front heroes and the 20×10 interior at this crop: the whole unit stays inside the frame and only sky and foreground are trimmed. **Open every output and confirm the unit is not clipped.** If one is, shift the crop window vertically; do not scale and do not change the ratio.

**GA boards are still never cropped.** They are already native 16:9 at 3840×2160 and downscale to 1800 px only.

## Change 2 · The Section 2 split card is a photograph too

The design lock's own card image is a photograph (`porta-cabin-section2-20x10-desert-ochre-site.webp`), not a drawing. Ours currently uses the 20×10 GA board.

- **New source:** `20x10/_master/05-mobile-laboratory-20x10-workbench-interior.png`, centre-cropped to 16:9, out to `section2/portable-mobile-laboratory-20x10-bench-and-sink.webp`.
- The card copy has been rewritten so it no longer refers to "the GA board". Take both card paragraphs and the alt text from the copy pack; do not reuse the previous strings.

## Change 3 · Tab labels are duplicated

The four Product Details tabs render the long label twice instead of the lock's responsive pair:

| Tab | Preview renders | Lock renders |
|---|---|---|
| 1 | `Description` + `Description` | `Description` + `Info` |
| 2 | `Specifications` + `Specifications` | `Specifications` + `Specs` |
| 3 | `Shipping` + `Shipping` | `Shipping` + `Ship` |
| 4 | `Reviews` | `Reviews` |

Each tab carries two `<span>`s, the wide-screen label and the small-screen label, and on this build both hold the long one. A flattened scrape must read `DescriptionInfo`, `SpecificationsSpecs`, `ShippingShip`, `Reviews`.

This came from my prompt line "there is no Info tab, do not add one", which meant do not add a fifth tab and was reasonably read as do not render the word. The wording is corrected in both standing documents. **Fix:** restore the shared tab component's own label pair and pass no overrides. Afterwards the tab strip must be byte-identical to the porta-cabins route's.

## Re-read the pack

Both files have been rewritten on disk at
`D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\portable-mobile-laboratory\_build-inputs\`.
New copy sha: `562ea7e51128e769e42553e2523bc62f7df9a94fcbd7edc918baab4050d25c32`. What changed since the version you built from:

- `copy.section3.sizes[].ga_board_slot` is replaced by `image_slot`.
- `copy.alt_text.section3_images` is new.
- `copy.specifications_tab.ga_board_slots` is new, with a note.
- `copy.section2.split_card.paragraph1` and `paragraph2`, `copy.alt_text.section2_card` and `copy.section3.intro` are rewritten.
- `asset_map.section3_images` is new; `asset_map.ga_boards.slot` now says Specifications tab; `asset_map.section2_card` points at the interior master with a crop rule.

## Then

1. Re-run `verify_po05.py` from `_build-inputs\`. It now asserts every Section 3 image exists, is 16:9, is referenced, and that **no GA board renders in Section 3**; and that the Section 2 card is not a GA board. `RESULT: PASS` required.
2. Re-run the six Template Conformance Gate artefacts. The structural diff must show zero component-tree delta and zero prop delta: confirm the `mediaBand` opt-in prop is gone and `RightToExistEntry` is byte-identical to `origin/static-migration`.
3. Produce the measurement table (file, width, height, KB) for every output, including the six new Section 3 crops and the new card.
4. **Then merge PR #193 into `static-migration` and deploy.** SAMAN's approval to deploy is conditional on changes 1, 2 and 3 above being done and the gates being green.
5. Report the production URL and confirm `https://www.samanportable.com/product/portable-office/portable-mobile-laboratory` returns 200, self-canonical, with a photograph in Section 3 for every size, one photograph in the Section 2 card, six images in the Description tab, and the six GA boards in the Specifications tab.

## Unchanged rulings

No Portable Office head phrase. The 10×10 gallery ships four slides deliberately. Wall B drift accepted. Section 3 headings stay H3, matching the lock; the H2 drift on PO-01 to PO-04 is a separate ticket. No price, size or specification change. No U+2014 in body copy. Do not touch any other route. If this ticket asks for something the repo does not have, the ticket is wrong: stop and report, do not invent a component or a prop.
