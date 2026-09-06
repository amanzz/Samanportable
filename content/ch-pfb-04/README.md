# CH-PFB-04 — Prefab Container Homes

Signed build pack for `/product/container-houses/prefab-container-homes`, rewritten to the
porta-cabins design lock on 6 September 2026.

| File | Role |
|---|---|
| `CH-PFB-04-prefab-container-homes-copy-v1.json` | Every string on the page. Read verbatim; nothing on this route is authored. |
| `CH-PFB-04-prefab-container-homes-asset-map-v1.json` | All 46 image slots: source, output, settings, alt text. |
| `CH-PFB-04-prefab-container-homes-build-prompt-v1.md` | The ticket. |
| `verify_ch_pfb_04.py` | The acceptance verifier. |
| `evidence/` | The six Template Conformance Gate artefacts. |

`specsShippingTabs.ts` imports the copy pack directly, so the Specifications tab cannot
drift from it.

## DEPLOY HOLD — prices

Build prompt section 3: the six approved Option B prices (200 sq.ft base Rs 1,625/sq.ft,
ex-GST Rs 2,86,000 to Rs 7,33,200) **must not deploy until SAMAN confirms them in
writing.** No such confirmation was present in the build inputs, so the page is built and
the deploy is held. The route previously published a Rs 1,475/sq.ft base.

The same six ex-GST figures are wired into `CONTAINER_HOUSE_PRICES['prefab-container-homes']`
in `src/lib/calculatorLadders.ts`, so the calculator moves with the page. Nothing else in
the calculator changed.

## Warranty — unresolved contradiction, owner decision

This route now publishes a **10-year** structural warranty (build prompt section 4, and the
copy pack's own text; `verify_ch_pfb_04.py` both bans the 5-year string and requires the
10-year one).

That contradicts `CLAUDE.md` → *Company facts (state identically, never alter)*, which fixes
the figure verbatim sitewide:

> "5-year structural warranty and 1-year finishing warranty as standard; finishing warranty
> extendable to 2 years on request, confirmed at quotation."

and whose preamble says *"If anything contradicts this file, this file wins."* The ticket was
followed for this route, but the governing fact file has **not** been changed, and five
sibling container-house records still publish 5 years. Settle this before deploy.

## Reported deviations

1. **Block 7, the media / finished-work band, has no renderer.** `mediaBand` / `media_band` /
   `media-band` return zero hits in `src/`. The three approved wide frames publish through the
   sanctioned `infoImages` route instead, spread through the Description body.
2. **21 vs 27 gallery files over the 120 KB ceiling.** The ticket records 21; the measured
   figure on the shipped bytes is **27 of 36** over 120 KiB (30 over 120,000 bytes), 121–313 KiB.
3. **`wide/prefab-container-homes-40x8-wide-end-dominant.webp` is unreferenced.** It ships with
   the folder as instructed but is not one of the 46 asset-map slots.
4. **The Shipping tab states both free-delivery zones on one line,** not two. The panel is
   byte-identical to the porta-cabins lock, which is the governing requirement.
5. **The FAQ block heading comes from draft v1** (`##### FAQs`). The copy JSON supplies no
   heading for that block.
6. **`src/lib/relatedProductSummary.ts` still advertises the retired 20x8 render** for this slug
   on sibling pages. Out of this page's boundary; the file still resolves 200.
