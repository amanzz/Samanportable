# `verify_po07.py` — 666 checks run, 636 pass, 30 fail

Full output: `gate-6-verify_po07-full-output.txt`.

The 30 failures fall into **five** groups. Not one is a page-level defect that could be
fixed by changing this page's content, and two were decided by SAMAN before the build
started. Every one is reproducible on already-merged sibling pages or traceable to a
contradiction inside the signed inputs.

---

## 1 — 26 checks: per-size feature cells are not in the SSR HTML (shared-hero behaviour)

```
FAIL size 20x8  feature cell Operators rendered   | 3 positions · 1 console island
FAIL size 20x10 feature cell Rate rendered        | ₹1,750.00/sq ft ex-GST
... 16 of these, plus the 10 "size X operator/opening count rendered" checks
```

Only the **selected** size's feature cells exist in the server-rendered DOM. The other
five sizes' cells are held in the page props and rendered by the shared hero when the
size chip is clicked. `verify_po07.py` scrapes tag-stripped SSR text, so it can only ever
see the default size (`10x10` — all of whose cells **pass**).

**Evidence this is the shared template, not this page:**

* All 30 cells (5 labels × 6 sizes) are present in the SSR `__NEXT_DATA__` payload —
  verified 30/30 — with exactly the pack's labels `Size / Operators / Openings / Roof / Rate`.
* The merged, accepted PO-03 page has the identical limitation: its 10x10, 20x8, 20x12,
  30x10 and 40x10 feature-cell values are likewise absent from its SSR text.
* `renderInactiveGalleryImages` and `renderOnlyActiveExplorerPanel` are `false` for both
  pages (Gate 4), which is what makes the hero render the active variant only.

**Why it was not "fixed":** the only mechanism in the repo that would put every variant's
cells into SSR HTML is `Co04SsrManifest`, a hidden `<section hidden aria-hidden="true">`
hard-scoped to `containerized-data-center`. Extending it here would add a DOM block that
no sibling has, breaking the Gate 1 zero-structural-delta requirement, and the build
prompt is explicit: *"If this prompt asks for something the repo does not have, the prompt
is wrong, not the repo. Stop and report the conflict rather than inventing a component or
a prop. That is what went wrong on PO-05."* Reported rather than invented.

## 2 — 1 check: `no cross-cluster tile in YMAL/Explore` (shared footer chrome)

The check greps the **whole document** for `href="/product/<other-cluster>/..."`. The only
two matches are in the site-wide footer tag cloud:

```
/product/container-houses/prefab-container-homes   (offset 417375 of 566683)
/product/container-houses/luxury-container-houses  (offset 418050)
```

Both sit ~74% down the page in the shared footer, thousands of characters after the YMAL
block. The merged PO-03 page carries the same footer link. This page's own Explore rail
and YMAL contain **six** tiles, all `/product/portable-office/*`, self excluded, both
`never_list` URLs excluded — the dedicated `never-link absent` checks all **pass**.
Per the standing ruling, shared chrome is evidenced, never edited.

## 3 — 1 check: `technical PDF shipped and under 10 MB` (SAMAN decision, PDF path)

The two signed inputs disagree and the verifier checks both halves:

* `copy.specifications_tab.pdf_href` = `/specs/saman-portable-control-room-technical-specification.pdf`
* `asset_map.spec_pdf.out` = `public/downloads/saman-portable-control-room-technical-specification.pdf`

**SAMAN's decision (6 Sep 2026): ship to `public/specs/` only.** That makes the rendered
link resolve and matches the dominant repo convention (20+ product JSONs already use
`specPdfHref: '/specs/...'`; `public/downloads/` holds only 8 older files). The verifier
looks for the file under `public/downloads/`, so this one check fails by design.
The sibling check `technical PDF link present` — which tests the rendered href against
`pdf_href` — **passes**. The file is shipped at 4.46 MB, well under the 10 MB cap.

## 4 — 1 check: `no schema type outside the approved list`

```
FAIL | ['AggregateOffer','Answer','Brand','BreadcrumbList','FAQPage','ItemPage',
        'ListItem','Offer','PriceSpecification','Product','Question']
```

`Brand` and `PriceSpecification` are missing from the verifier's allowlist. Both are
emitted by the **shared** product-schema path, not by anything this page configures. The
rendered type set is **byte-identical** to three already-merged pages built to the same
lock — `portable-weighbridge-office`, `executive-portable-office` and
`prefabricated-office-cabins` all emit exactly the same eleven types. Removing them would
be a delta from the design lock. All five required types (`ItemPage`, `Product`,
`AggregateOffer`, `BreadcrumbList`, `FAQPage`) are present, and the "no Review /
no AggregateRating" checks pass.

## 5 — 1 check: `forbidden string absent: office cabin range` (SAMAN decision, pack self-collision)

`copy.forbidden_strings` contains `"office cabin range"`. The mandated Section 2
paragraph 2 — which also carries the page's one approved contextual link — reads:

> "…the **portable office cabin range** is the right starting point and is priced differently."

The substring is inside the signed copy itself, so rendering the paragraph verbatim
guarantees this failure. **SAMAN's decision (6 Sep 2026): the copy wins; the
forbidden-list entry is a pack defect.** The entry was plainly meant to stop this page
describing *itself* as an office cabin range, while the link sentence points at the
sibling product. Copy is rendered byte-for-byte as signed; nothing was reworded.
The other 12 forbidden strings all pass, as does the `cluster_terms_not_to_target`
heading gate and the zero-U+2014 gate.

---

## Suggested one-line pack amendments that would make this reach `RESULT: PASS`

None of these are applied — they change signed artefacts and are SAMAN's call:

1. Drop `"office cabin range"` from `copy.forbidden_strings` (group 5).
2. Set `asset_map.spec_pdf.out` to `public/specs/...` so it agrees with `pdf_href` (group 3).
3. Add `Brand` and `PriceSpecification` to the verifier's schema allowlist (group 4).
4. Scope the cross-cluster tile regex to the YMAL/Explore markup rather than the whole
   document (group 2).
5. Have the feature-cell checks read `__NEXT_DATA__`, or drive the size selector, rather
   than scraping SSR text (group 1).
