# SAMAN Porta Cabins Design Lock

Project-level gate for product-page rebuilds. Read this before editing any
product page, and cite the six Template Conformance Gate results in the PR or
handoff comment.

## Non-Negotiable Template Rule

The design is the live production template at:

`https://www.samanportable.com/product/porta-cabins`

Do not redesign, restyle, reorder, rename, or substitute components. Only
approved content and approved images may change. Any page that looks different
from the template is defective.

## Shared Component Rule

Shared component changes must be opt-in props that default to the existing
behavior. A page-specific need may pass a prop, but sibling pages must remain
unchanged unless their ticket explicitly asks for the same change.

Examples:

- Add `includeWarrantyBlock?: boolean`, default false.
- Add `intro?: string`, default current shared intro.
- Do not change fallback text globally to fix one page.
- Do not add page-local forks of shared tabs, rails, calculators, or shipping
  tables unless the ticket explicitly approves a new component.

## CO-01 Shipping Container Office Lock

Route:

`/product/container-offices/shipping-container-office`

Branch for active CO-01 build:

`codex/co-01-build-v31`

PR:

`https://github.com/amanzz/Samanportable/pull/170`

### CO-01 Must Use These Surfaces

- Dedicated route: `src/pages/product/container-offices/shipping-container-office.tsx`
- Generic product page shell: `src/pages/product/[category]/[slug].tsx`
- Product tabs: `src/components/ProductTabs.tsx`
- CO-01 page-specific approved specs/shipping entry: `src/page-specific/shipping-container-office/content.ts`
- Shared shipping tables: `src/lib/specsShippingTabs.ts`
- Verifier: `CO-01-verify-copy.mjs`
- Copy pack: `CO-01-copy-pack-v2.json`
- Page-shape additions: `CO-01-copy-pack-v2.2-additions.json`

### CO-01 Shipping Tab

CO-01 must render freight tables in the Shipping tab:

- `20 ft open trailer`
- `40 ft open trailer`
- all distance bands through `950-1,000 km` / `950 to 1,000 km`
- both destination city tables
- `ODC`
- tentative-price / final-route disclaimer

The dedicated CO-01 route must not pass an empty `shippingHtml`, because that
causes `ProductTabs` to render the generic fallback panel with unapproved
commitments.

PR #171 adds approved free-delivery lines to the shared shipping component.
Do not duplicate those lines into CO-01. Once #171 is merged, CO-01 should pick
them up through the shared component.

### CO-01 Forbidden Claims

Do not render these on CO-01 unless a later approved CO-01 copy pack or product
specification explicitly adds them:

- `Delivery in 7 to 21 working days`
- `7-21 working days`
- `Fixed-price quote within 48 hours`
- `fixed quotation within 48 hours`
- `5-year structural warranty`
- `1-year finishing warranty`
- `Finishing warranty extendable to 2 years`
- `Support Monday to Saturday`
- `On-site maintenance service`
- `Spare parts availability`
- `Installation Timeline`
- `Site Preparation 1-2 days`
- `Delivery & Setup 1 day`
- `Final Inspection Same day`

Allowed CO-01 warranty wording is only the approved specification-row wording:

`Warranty period and exclusions confirmed in the final quotation only`

### CO-01 Calculator Rule

The calculator mechanics are untouched. For CO-01 only, suppress page-visible
lead-time and response-time commitment copy where no approved source exists.
Do not change formulas, steps, rates, form behavior, or shared calculator logic
for other pages.

### CO-01 Page Shape

- Section 2 renders both blocks: top prose and split card.
- Section 3 renders all six size sections.
- Every size section has two prose paragraphs and its approved bullets.
- Every size section has six gallery slides.
- GA/specification board images use master drawings, never web-preview
  thumbnails.
- The 1:1 image before the calculator is absent; the file may remain in the
  repo.
- YMAL must show only live approved C02/C04-compatible destinations:
  - `/product/container-offices`
  - `/product/container-offices/container-office-cabin`
  - `/product/container-offices/site-office-container`
- YMAL must not say `porta cabin`.
- Do not link legacy near-duplicates:
  - `/product/container-offices/construction-site-office`
  - `/product/container-offices/container-site-office`
  - `/product/container-offices/modular-shipping-container-office`
  - `/product/container-offices/portable-container-offices`
  - `/product/container-offices/prefabricated-container-office`

## CO-01 Required Verification

Run from the CO-01 worktree after `npm run build` and `next start -p 6090`:

```powershell
node CO-01-verify-copy.mjs http://127.0.0.1:6090/product/container-offices/shipping-container-office
```

Exit code must be 0.

The verifier must include:

- loose forbidden-string matching where `7 to 21` equals `7-21`
- fetched-HTML presence checks for all four tab panels
- positive shipping probes for `20 ft open trailer`, `40 ft open trailer`,
  `950`, and `ODC`
- residual withdrawn-size scanning outside approved copy only
- positive approved-size scanning

Also grep rendered text and report:

- `working days`
- `warranty`
- `Installation Timeline`
- `Spare parts`
- `on-site maintenance`

Every survivor must be tied to an approved source. For CO-01, the only expected
`warranty` survivor is the final-quotation specification row.

## Template Conformance Gate

Report these six named results on every CO-01 handoff:

1. `Live template/components`: PASS only if the page uses existing
   porta-cabins product-shell components and tokens, with no page-local visual
   redesign.
2. `Shared component opt-in`: PASS only if any shared-component edit is guarded
   by an opt-in prop defaulting to existing behavior.
3. `Section 2 two-block shape`: PASS only if top prose and split card both
   render, with approved split-card image/content.
4. `Six-size gallery`: PASS only if all six approved size sections render six
   slides each.
5. `Four product tabs`: PASS only if tabs are exactly Description,
   Specifications, Shipping, Reviews, with responsive dual labels and no
   separate `Info` tab.
6. `Calculator mechanics`: PASS only if calculator formulas, steps, rates, form
   behavior, and shared logic are unchanged; CO-01-only claim-copy suppression
   is allowed.

## Screenshot Gate

Capture fresh screenshots after opening the Shipping tab:

- desktop 1440 px wide
- mobile 390 px wide

Verify:

- Shipping tab is active.
- Freight tables are visible.
- No horizontal overflow on mobile.
- Do not use full-page screenshots as sole evidence when sticky/fixed elements
  may tile or duplicate during capture.

## Deployment Gate

Stop at preview unless SAMAN gives separate written deployment approval. Do not
merge or deploy CO-01 on the strength of verifier pass alone.
