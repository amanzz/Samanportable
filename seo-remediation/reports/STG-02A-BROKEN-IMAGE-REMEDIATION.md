# STG-02A Broken Image Remediation

Date: 2026-08-26
Outcome: `SOURCE_REFERENCE_ERROR` — corrected using existing approved assets

## Confirmed failure

| Field | Evidence |
|---|---|
| Affected page | `https://www.samanportable.com/product/container-offices/containerized-data-center` |
| Broken image URL | `https://www.samanportable.com/images/products/containerized-data-center/containerized-data-center-description-20ft-high-cube.webp` |
| Confirmed response | `404` in STG-01C local-production-equivalent and remote staging evidence |
| Source field | `descriptionHtml` in `src/data/products/containerized-data-center.json` |
| Rendered component | Dynamic commercial product template, `src/pages/product/[category]/[slug].tsx`, which renders the approved long description HTML |
| Image purpose | Third of five differentiated long-description figures; the slot describes the 40 ft High Cube service wall with three cooling louvres |
| Pre-fix image-sitemap reference | The nonexistent path was excluded because it did not resolve to a public asset. The fifth approved 53 ft figure was also absent because the five source references were shifted. |
| Structured-data reference | The broken long-description path was not used by the Product JSON-LD image list. The affected page still has one valid Product node. |

## Root cause

The approved assets already existed, but all five long-description figure `src` values had been shifted relative to their approved alt text, caption, view, and build-manifest slots. This produced one literal 404 and four wrong-image/claim pairings.

| Figure slot preserved | Previous source | Correct approved source |
|---|---|---|
| 20 ft Edge access wall | `containerized-data-center-description-10ft-edge.webp` | `containerized-data-center-description-20ft-edge.webp` |
| 40 ft ISO access wall | `containerized-data-center-description-20ft-edge.webp` | `containerized-data-center-description-40ft-iso.webp` |
| 40 ft High Cube service wall | nonexistent `containerized-data-center-description-20ft-high-cube.webp` | `containerized-data-center-description-40ft-high-cube.webp` |
| 10 ft Edge access wall | `containerized-data-center-description-40ft-iso.webp` | `containerized-data-center-description-10ft-edge.webp` |
| 53 ft High Density slot | `containerized-data-center-description-40ft-high-cube.webp` | `containerized-data-center-description-53ft-high-density.webp` |

## Approved-asset proof

- `container-offices/CO-04-containerized-data-center-draft-v1.md` lists the five approved long-description source assets, output names, alt text, and captions.
- `container-offices/CO-04-copy-pack-v1.1.json` retains the approved copy-pack mapping.
- `D:\Project-shekhar\all-product-images\Hub page (Container Offices)\Drafts\CO-04-containerized-data-center-build-prompt-v1.md` and `scripts/build_co04_assets.py` define the same five deterministic build selections.
- Source files remain in `D:\Project-shekhar\all-product-images\Hub page (Container Offices)\Containerized Data Center\02 Long Description Images`.
- Each exact existing WebP was visually inspected against its approved product/view slot. No generic, placeholder, sibling-product, or newly generated image was used.

The similarly named source `03-highcube-data-center-20ft-banner.png` is intentionally assigned to the Section 2 card by the approved build plan. It is not the missing long-description asset and was not substituted.

## Implemented correction

Only the five `src` values above were corrected. Existing figure order, HTML structure, width/height attributes, lazy-loading behavior, alt text, captions, product facts, and page copy were preserved. The build regenerated `public/sitemap-images-products.xml`, adding the valid 53 ft approved image association. The obsolete nonexistent path appears in neither schema nor sitemap.

Changed implementation files:

- `src/data/products/containerized-data-center.json`
- `public/sitemap-images-products.xml` (deterministically regenerated)

## Verification

- All five corrected local URLs return `200`, `Content-Type: image/webp`, and nonzero response bodies.
- All five decode to 1600 × 900 in browser testing.
- Complete crawl: 1,478 images checked, zero failures.
- Product page: `200`, self-canonical, `index, follow`, one H1.
- Product JSON-LD: one parseable Product node, 36 schema image references, zero failed image responses.
- Image sitemap: valid XML, all five approved description images present, obsolete broken filename absent, no `undefined`/`null` locations.
- Exact browser widths 360, 390, 768, and 1440: no horizontal overflow; all five lazy-loaded images decode; no broken rendered images; no console warnings/errors.

Final image status: `REPAIRED_VERIFIED_APPROVED_ASSET`.
