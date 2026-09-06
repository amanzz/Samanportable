# PO-05 · Pack amendment applied · both blockers cleared
**6 September 2026 · answers `_build-inputs/evidence/10-PROPOSED-pack-amendment-section3-ratio.md`**

**APPLICATION: Claude Code. SESSION: the SAME one that built rev 2 if it is still open, otherwise a NEW one on the same branch.**

You were right on both counts and you were right not to edit the verifier to make it pass. Both were the pack contradicting itself. Both are now fixed at source. Re-read the pack and re-run; no build change is needed for blocker 1, and only the six Section 3 crops change for blocker 2.

---

## Blocker 1 · `no 'Info' tab label` · withdrawn

`verify_po05.py` line 103 carried `check("no 'Info' tab label", not re.search(r">\s*Info\s*<", doc))`. It came from the generic template verifier and it contradicted Change 3 of the same ticket. It is deleted and replaced with the positive checks:

```python
for _long, _short in [("Description", "Info"), ("Specifications", "Specs"), ("Shipping", "Ship")]:
    check(f"tab pair {_long}/{_short} present", _long in text and _short in text, (_long, _short))
check("tab short label is not a repeat of the long one",
      "DescriptionDescription" not in text.replace(" ", "")
      and "ShippingShipping" not in text.replace(" ", ""))
```

Your build already satisfies these. Nothing to change.

## Blocker 2 · Section 3 is 4:3, not 16:9 · the pack was wrong

Measured on the live design lock on 6 September 2026, with the Section 3 panel scrolled into view so the image had loaded:

| Slot | Panel | Lock's own asset | object-fit |
|---|---|---|---|
| Section 3 left | `aspect-ratio: 4 / 3`, rendered 535×401 | `porta-cabin-ga-plan-20x10.webp`, **1920×1440** | cover |
| Section 2 card | 16:9, rendered 525×295 | `porta-cabin-section2-20x10-desert-ochre-site.webp`, **1920×1080** | fill |

So your 4:3 panel box reading is correct. The pack's 16:9 claim for Section 3 is withdrawn. The Section 2 card at 16:9 was right and does not change.

**What changed in the pack**

- `asset_map.section3_images.ratio` is now `4:3`, with a `ratio_evidence` field recording the measurement.
- `asset_map.rules.section3_image` is now `{width_px: 1600, height_px: 1200, quality_start: 88, ratio: "4:3"}`.
- The crop instruction is now a centred **4:3** crop of the 1:1 master: full width, height = width × 3/4, equal trim top and bottom.
- `verify_po05.py` asserts `abs(w/h - 4/3) < 0.02` for each Section 3 output.

**What you need to do:** re-encode the six Section 3 photographs at 1600×1200 from the same masters and re-measure. Nothing else in Section 3 changes: same sources, same output paths, same alt text. A 4:3 crop of a 1:1 frame trims far less than the 16:9 crop did, so every unit is comfortably inside the frame; the proof sheet `PO-05-section3-crop-proof-sheet-v2.png` in `_build-inputs\` shows the actual crops.

Note in passing: this is also why the lock ships a separate 4:3 `ga-plan` asset rather than putting its 16:9 GA board in that panel. A 16:9 board in a 4:3 cover box loses about a quarter of its width, which would have cut the dimension text off both ends. Another reason the boards belong in the Specifications tab.

## Also fixed · `ga_board_note` was a build instruction sitting in the copy pack

Correct call not to render it. It has been removed from `copy.specifications_tab` and moved to `asset_map.ga_boards.placement_note`, where it belongs. `specifications_tab.narrative[2]` still announces the boards to the reader, so nothing is lost.

## New copy sha

`8f18fe0a14d31c99dfcdd7b010425b36252eb990d8c00911da7d704851c10119`

## Then

Re-run `verify_po05.py`. `RESULT: PASS` should now be reachable. Re-run gates 3 and 6, refresh the measurement table for the six re-encoded files, then **merge PR #193 into `static-migration` and deploy**, per step 4 of the rev-2 ticket.

## Your three out-of-scope findings, acknowledged

- Six sibling pages ship the duplicate tab label. Confirmed out of scope here; it goes into the same sibling ticket as the Section 3 H2 drift.
- The 390 px clip is site-wide and matches the lock, so it is not a regression for this page.
- Reverting the five sibling spec builders and keeping the diff purely additive was the right call.
