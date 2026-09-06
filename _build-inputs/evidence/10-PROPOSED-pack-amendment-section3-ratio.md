# PROPOSED amendments · PO-05-R2 verifier and asset map
**Raised by the build session, 6 September 2026. NOT APPLIED — needs SAMAN's approval.**

## The conflict

PO-05-R2 change 1 says the Section 3 left column takes "that size's `01 front-hero`
gallery master, **centre-cropped to 16:9**", and `verify_po05.py` line 147 asserts every
Section 3 file is 16:9.

The shared explorer panel is not a 16:9 slot. It is a fixed
`aspect-[4/3]` box and the image inside carries `class="w-full h-full object-cover"`
(`PortaCabinVariantHero.tsx:1872`). A 16:9 file dropped into a 4:3 cover box is cropped a
**second** time, losing 25% of its width — 12.5% off each end of the unit.

The design lock does not do this. On `/product/porta-cabins` the panel image is
`size-section/porta-cabin-ga-plan-20x10.webp` at **1254x1254 (1:1)**, `object-cover`.
A 1:1 file in a 4:3 box is cropped on the vertical only: full width kept, 25% of the
height trimmed equally top and bottom. That is exactly the result the ticket asks for,
"the whole unit stays inside the frame and only sky and foreground are trimmed".

The ticket's own proof sheet (`PO-05-section3-crop-proof-sheet.png`) shows the units
already spanning the full frame width at the 16:9 crop, so the second crop is guaranteed
to clip them. Worst on 30x10 and 40x10. See `09-section3-panel-crop-conflict.png` for the
two paths rendered side by side.

## What shipped

Per SAMAN's ruling of 6 September 2026, Section 3 ships the master at its **native 1:1**,
matching the design lock. Nothing is cropped.

## What still needs amending, because the build cannot amend the acceptance test

1. `PO-05-portable-mobile-laboratory-asset-map-v1.json` -> `section3_images.ratio`
   currently `"16:9"`, with a `crop` rule describing the centred 16:9 crop.
   Should read `"1:1"`, crop `"none"`, matching `rules.gallery`.
2. `verify_po05.py` line 147:
       check(f"Section 3 photo {slug} is 16:9", abs(w / h - 16 / 9) < 0.02, (w, h))
   should assert 1:1:
       check(f"Section 3 photo {slug} is 1:1", abs(w / h - 1.0) < 0.02, (w, h))

Until both are amended, `verify_po05.py` fails six checks by design — one per size. Every
other assertion in the file passes. The failure is the pack disagreeing with the repo,
not the build disagreeing with the pack.

## Note on width

`section3_images` and `section2_card` are declared 1600 px. The gallery masters in
`<size>/_master/` are natively 1254x1254 and the standing rule forbids upscaling, so both
slots ship at 1254 px. All land inside the 80-120 KB band.


---

# Amendment 2 · `verify_po05.py` contradicts its own ticket on the tab labels

`verify_po05.py` line 103 asserts:

    check("no 'Info' tab label", not re.search(r">\s*Info\s*<", doc))

PO-05-R2 change 3 requires the opposite. It says the lock renders `Description` + `Info`,
that "a flattened scrape must read `DescriptionInfo`, `SpecificationsSpecs`,
`ShippingShip`, `Reviews`", and that the fix is to "restore the shared tab component's
own label pair and pass no overrides".

**These two cannot both hold.** No build can satisfy change 3 and pass line 103. The
assertion is the same misreading change 3 was written to correct ("there is no Info tab"
meant do not add a fifth tab, not do not render the word), carried into the rev-2
verifier when the ticket text was corrected but the test was not.

The page now renders the correct pair, verified on the preview by flattening the tab
strip:

    DescriptionInfo   SpecificationsSpecs   ShippingShip

and carries no duplicated long label. Line 103 should be deleted, or replaced with the
positive assertion used in `scripts/po05-conformance-gate.py`:

    for wide, small in [("Description", "Info"), ("Specifications", "Specs"),
                        ("Shipping", "Ship")]:
        check(f"tab renders the responsive label pair {wide}/{small}",
              (wide + small) in re.sub(r"<[^>]+>", "", doc))
        check(f"tab does not duplicate the long label ({wide}{wide})",
              (wide + wide) not in re.sub(r"<[^>]+>", "", doc))

# Current verifier result

    345 PASS, 7 FAIL

    FAIL no 'Info' tab label                      <- amendment 2, contradicts change 3
    FAIL Section 3 photo 10x10 is 16:9 (1254,1254) <- amendment 1, one per size
    FAIL Section 3 photo 20x8  is 16:9 (1254,1254)
    FAIL Section 3 photo 20x10 is 16:9 (1254,1254)
    FAIL Section 3 photo 20x12 is 16:9 (1254,1254)
    FAIL Section 3 photo 30x10 is 16:9 (1254,1254)
    FAIL Section 3 photo 40x10 is 16:9 (1254,1254)

All seven are the pack disagreeing with the repo or with itself. Every other assertion
passes. The acceptance test has not been edited by this build: changing the test to make
the build pass it is not the build's call.
