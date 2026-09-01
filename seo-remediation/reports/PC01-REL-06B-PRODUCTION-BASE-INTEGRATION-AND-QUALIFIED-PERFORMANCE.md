# PC01-REL-06B — Production-base integration and qualified performance

Date: 2026-08-31

## Final verdict

BLOCKED_INTEGRATION_VALIDATION

The production-base integration is structurally complete, backed up, and available as a local-only candidate, but it is not release-ready. The integrated approved source fails the required calculator price-parity check and does not provide the required eight FAQ accordions. One enquiry-dialog accessibility warning also means the captured browser console is not clean. No corrective product, calculator, FAQ, or form change was authorized by this task.

## Checkpoints and integration

- Approved source checkpoint: cb4b8ad1c7220c3ade42851a681ee0439e0ab984, tree 12db4887563547aee7d80fc034c190b125939498.
- Exact production base: 3346a532306c52932aeb2d813591bf95cb37716b.
- Exact main control: 9188cab7e415569b85f2dddf750992cdeb5abc62.
- Owner decision: PC01-PERFORMANCE-QUALIFICATION-2026-08-31 / PC01_PERFORMANCE_IMPROVED_WITH_QUALIFIED_MEASUREMENT_DEBT.
- Qualification manifest: page-structure/contracts/pc01-performance-measurement-debt-2026-08-31.json.
- Qualification validator/test: scripts/validate-pc01-performance-measurement-debt.mjs and scripts/test-pc01-performance-measurement-debt.mjs; 20/20 expected outcomes passed.
- Performance qualification commit/tree: 030389327da61e4f693ce7d7ad809233fac104f6 / a06fbb4e4926694ab4739f3aabf67bbf8d3f1d1b.
- Protected qualification backup: origin/backup/seo-recovery-20260831/pc01-performance-measurement-debt-qualified-final at the same commit and tree.
- Introduced-commit manifest: C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\evidence\PC01-PERFORMANCE-MEASUREMENT-DEBT\PC01-REL-06B-INTEGRATION-COMMIT-MANIFEST.md; 45 commits classified.
- Integration merge commit: a704bbe44e1b7f88ea3840658f2da68cff97a2a7.
- Merge parents: 3346a532306c52932aeb2d813591bf95cb37716b and 030389327da61e4f693ce7d7ad809233fac104f6.
- Merge tree: a06fbb4e4926694ab4739f3aabf67bbf8d3f1d1b.
- Tree-equivalence proof: the committed merge tree exactly equals the performance-qualified tree; zero conflicts and zero merge-only paths.

## Performance qualification

The safe Phase-A application changes are preserved and synthetic measurement remains QUALIFIED_UNRESOLVED. This is not an LCP, TBT, INP, or Core Web Vitals pass and is not deployment approval.

- DOM: 3811 to 1745, 54.2% reduction; minimum 45%.
- Script transfer: 650063 to 355906 bytes, 45.3% reduction.
- Category first-load JavaScript: 581 to 308 kB, 47.0% reduction.
- Required route/script threshold: at least 40%; retained.
- Valid release-authoritative synthetic runs: zero.
- No Lighthouse run was performed in REL-06B.

## Integrated validation

Passed:

- performance-debt validator and 20/20 portability/mutation tests;
- deterministic Phase-A checks;
- qualified C01 validator and 20/20 portability/mutation tests;
- specification-override validator;
- maintained PDF validator, 19 mutation checks, and determinism;
- keyword-ownership validator and 11/11 mutation checks;
- TypeScript, lint, and production build;
- strict architecture: 61 approved/live and 43 planned/unpublished;
- temporary controls: 63;
- publication gate: 61/43/63, with 138 gated-link occurrences across 42 targets;
- sitemap/XML: 321 ordinary unique locations, zero undefined/null locations, zero product-category commercial locations;
- complete crawl: all 61 approved routes and 321 sitemap routes returned 200; zero broken internal edges, canonical conflicts, indexability conflicts, schema parse errors, duplicate approved schema, broken images, broken PDFs, missing titles, missing H1s, or internal-path exposure;
- keyword crawl: 321 pages, 6368 occurrences, 445 groups, zero findings;
- product/schema: direct 200, self-canonical, index/follow, one H1, six exact variants, GST 18%, eight visible answers matching eight FAQPage answers byte-for-byte, 30 specifications, one Product, one FAQPage, one BreadcrumbList, no Review/AggregateRating, AggregateOffer 143750/475000/count 6;
- direct PC-01 merchant feed parity: six incl-GST rows at 169625, 259600, 295000, 339840, 424800, and 560500;
- active PDF SHA-256: 9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96;
- generated C01 SHA-256: 3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099;
- six prices, occupancy, approximate weights, qualification wording, six GA boards, ten subtype links, maintained PDF content, exact Fasteners override, and five protected siblings remained unchanged;
- form contract: /api/enquiry POST with required identity/contact/message fields; forms submitted: 0.

Lint completed with the same three accepted warnings: two site-office-container useMemo dependency warnings and one legacy img warning in the slug route.

The two permitted roofing redirect sources terminate at held-draft 404 targets. Status, Location, response byte length, and build-normalized body hash were identical between approved source and integration for both; no change was made.

## Release blockers and baseline-equivalent debt

1. Calculator price parity fails. Published 20x10 ex-GST is ₹250,000 while calculator base is ₹200,000. Published 10x10 ex-GST is ₹143,750 while calculator base is ₹110,000. The interactive 10x10 estimate with current selections displayed ₹120,980. Freight behavior works: a 100 km Other-zone estimate was ₹148,480 and choosing Bangalore city changed it to ₹120,980. Formula/rate bytes match the approved source and were not changed because REL-06B prohibited calculator formula changes.
2. Eight FAQ questions/answers are visible and schema-identical, but they are static heading/answer blocks rather than eight interactive accordions. This matches the approved source.
3. Opening the enquiry dialog emitted one warning: DialogContent lacks Description or an explicit aria-describedby value. There were no console errors, hydration errors, broken PC-01 images, or broken PC-01 PDFs, but the console is not strictly clean.
4. The whole-repository merchant validator reports six pre-existing non-PC01 products without images (IDs 990005 and related records); direct PC-01 feed parity passes.
5. scripts/calculator/report-product-ladders.mjs has a pre-existing Labour Colony failure because variant.capacity is undefined; PC-01 was checked directly in the browser.
6. LCP/TBT/INP/CWV remains QUALIFIED_UNRESOLVED pending 28 days of reliable field data or an independently validated stable lab.

These are integration-validation blockers, not conflicts or visual regressions. No remediation was authorized in REL-06B.

## Browser and visual QA

The production server was exercised at exact CSS viewports 360×800, 390×844, 768×1024, and 1440×900. No horizontal overflow, clipping, loading-shell defect, hydration error, broken image, or broken PDF was observed. Hero/gallery, six size selectors, price update, Specifications, Shipping, six GA panels, ten child links, calculator activation/navigation, freight selection, enquiry dialog, touch-size layouts, and keyboard focus were exercised without submission.

Visual comparison against the approved source found no redesign or visual regression.

Evidence directory: C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\evidence\PC01-FINAL-INTEGRATED-PREVIEW

Captured: server-html.html, hydrated-dom.html, local-network-log.json, browser-console.json, browser-qa-summary.json, porta-cabins-390x844.png, porta-cabins-1440x900.png, complete crawl JSON, and merchant validation output.

Evidence SHA-256:

- server-html.html: 97e8283b2f74fbeb84245aa2c237644dfee269df0c9cbb3b7a5a0f472fafd876
- hydrated-dom.html: 44f906feb4f503c8a2a521264dfc55e8eb23177c87b3300fc8c9e575a0421426
- local-network-log.json: 5ef9f0b33716a44d1d411c99b72bfb8cd14099a3eb7a1bf3bc24a18c3c4be19b
- browser-console.json: 120c48d60ac63a4f1efd3e558247462f0a25700ce5b8ba1e798a3626d5c846f9
- 390×844 PNG: 31dcb6e9badc43e6cca59e578ec274906d7015f79fee58162afd0469357c0f89
- 1440×900 PNG: a6c024262a2ce48bd911bd0f2c2d1873278a7218935826debf0d61d13b43b0c4

## Local preview

The production-equivalent server remains running on the task-owned local port. The URL is intentionally withheld while the calculator, FAQ-accordion, and console-clean gates are unresolved, following the prompt's no-URL-before-pass rule.

## Exact files changed over production

The following 211-entry name-status list is the exact final candidate diff against 3346a532306c52932aeb2d813591bf95cb37716b, including this report (A = added; M = modified):

```text
M	next.config.js
M	package.json
A	page-structure/contracts/pc01-c01-qualified-legacy-debt-2026-08-29.json
A	page-structure/contracts/pc01-performance-measurement-debt-2026-08-31.json
A	page-structure/pdf-sources/pc01-porta-cabins-v1.json
A	page-structure/pdf-templates/pc01_porta_cabins_technical_specification/README.md
A	page-structure/pdf-templates/pc01_porta_cabins_technical_specification/layout.py
A	page-structure/pdf-templates/pc01_porta_cabins_technical_specification/requirements.txt
M	public/sitemap-images-products.xml
M	public/sitemap-products.xml
M	public/specs/saman-porta-cabins-technical-specification.pdf
M	scripts/collect-image-manifest.mjs
A	scripts/export-pc01-pdf-source.mjs
A	scripts/generate-pc01-technical-pdf.py
M	scripts/generate-segmented-sitemaps.mjs
A	scripts/generate-stg01c-complete-crawl.mjs
A	scripts/generate-stg01c-gated-link-crosswalk.mjs
A	scripts/summarize-pc01-lighthouse.mjs
A	scripts/summarize-stg01c-lighthouse.mjs
A	scripts/test-pc01-active-pdf.py
A	scripts/test-pc01-keyword-ownership.mjs
A	scripts/test-pc01-performance-measurement-debt.mjs
A	scripts/test-pc01-qualified-c01-debt.mjs
A	scripts/validate-c01-specification-overrides.mjs
A	scripts/validate-commercial-architecture.js
A	scripts/validate-container-office-rail.mjs
A	scripts/validate-pc01-active-pdf.py
A	scripts/validate-pc01-keyword-ownership.mjs
A	scripts/validate-pc01-performance-measurement-debt.mjs
A	scripts/validate-pc01-qualified-c01-debt.mjs
A	scripts/validate-rb01c-publication-gate.mjs
A	scripts/validate-stg01b-structured-data.mjs
A	scripts/validate-unapproved-commercial-gating.js
A	seo-remediation/progress.md
A	seo-remediation/reports/AHREFS-BASELINE-2026-08-24.md
A	seo-remediation/reports/AUDIT-SEVERITY-REPORT-2026-08-25.md
A	seo-remediation/reports/C01-SPEC-01-PROVENANCE-SAFE-OVERRIDE.md
A	seo-remediation/reports/C01-SPEC-01A-BASELINE-FAILURE-QUALIFICATION.md
A	seo-remediation/reports/CURRENT-CHANGE-RISK-CLASSIFICATION.md
A	seo-remediation/reports/CURRENT-REMEDIATION-CHECKPOINT.md
A	seo-remediation/reports/IMPLEMENTATION-BACKLOG-2026-08-25.md
A	seo-remediation/reports/PC-01-CONTROLLED-LOCAL-PREVIEW.md
A	seo-remediation/reports/PC-01-V27-RESUMED-FINAL-LOCAL-PREVIEW.md
A	seo-remediation/reports/PC01-REL-02-OWNER-C01-POLICY-DECISION.md
A	seo-remediation/reports/PC01-REL-02-QUALIFIED-C01-DEBT-AND-ACTIVE-PDF.md
A	seo-remediation/reports/PC01-REL-03-MAINTAINED-PDF-PIPELINE.md
A	seo-remediation/reports/PC01-REL-04-KEYWORD-OWNERSHIP-AND-INTERNAL-LINKS.md
A	seo-remediation/reports/PC01-REL-04-OWNERSHIP-BASELINE.md
A	seo-remediation/reports/PC01-REL-05-PERFORMANCE-BASELINE.md
A	seo-remediation/reports/PC01-REL-05-PERFORMANCE-BOTTLENECK-MATRIX.md
A	seo-remediation/reports/PC01-REL-05-PERFORMANCE-REMEDIATION.md
A	seo-remediation/reports/PC01-REL-06A-QUALIFIED-DEBT-BRANCH-COUPLING-BASELINE.md
A	seo-remediation/reports/PC01-REL-06A-QUALIFIED-DEBT-VALIDATOR-PORTABILITY.md
A	seo-remediation/reports/PC01-REL-06B-OWNER-PERFORMANCE-DECISION.md
A	seo-remediation/reports/PRODUCTION-BASE-IDENTIFICATION.md
A	seo-remediation/reports/PRODUCTION-BASE-INTEGRATION-READINESS.md
A	seo-remediation/reports/PRODUCTION-READINESS-REPORT-2026-08-25.md
A	seo-remediation/reports/RB-01-PUBLICATION-STATUS-RECONCILIATION.md
A	seo-remediation/reports/RB-01C-PUBLICATION-GATE-IMPLEMENTATION.md
A	seo-remediation/reports/STG-01A-CONTAINER-OFFICE-RAIL-MATRIX.md
A	seo-remediation/reports/STG-01A-PRODUCTION-DELTA-RECONCILIATION.md
A	seo-remediation/reports/STG-01B-SCHEMA-FAILURE-MATRIX.md
A	seo-remediation/reports/STG-01B-STRUCTURED-DATA-PREREQUISITE.md
A	seo-remediation/reports/STG-01C-CONTROLLED-STAGING-VERIFICATION.md
A	seo-remediation/reports/STG-01C-FORM-DELIVERY-QA.md
A	seo-remediation/reports/STG-01C-GATED-LINK-CROSSWALK.csv
A	seo-remediation/reports/STG-01C-GATED-LINK-CROSSWALK.md
A	seo-remediation/reports/STG-01C-PERFORMANCE-BASELINE.md
A	seo-remediation/reports/STG-02A-BROKEN-IMAGE-REMEDIATION.md
A	seo-remediation/reports/STG-02A-FORM-TEST-DESTINATION-REQUIREMENTS.md
A	seo-remediation/reports/STG-02A-LEGACY-REDIRECT-DECISIONS.md
A	seo-remediation/reports/STG-02A-RELEASE-BLOCKER-TRIAGE.md
A	seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.csv
A	seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.md
A	seo-remediation/reports/evidence/PC-01/pc-01-porta-cabins-1440px.png
A	seo-remediation/reports/evidence/PC-01/pc-01-porta-cabins-390px.png
A	seo-remediation/reports/evidence/PC01-REL-04/porta-cabin-anchor-baseline.csv
A	seo-remediation/reports/evidence/PC01-REL-04/porta-cabin-anchor-final.csv
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-01-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-01-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-01.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-01.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-02-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-02-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-02.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-02.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-03-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-03-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-03.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-desktop/run-03.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-01-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-01-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-01.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-01.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-02-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-02-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-02.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-02.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-03-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-03-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-03.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-03.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-04-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-04-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-04.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-04.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-05-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-05-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-05.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/lighthouse-mobile/run-05.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/manifests/build-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/manifests/middleware-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/manifests/pages-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/manifests/routes-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/screenshots/desktop-baseline.png
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/screenshots/mobile-baseline.png
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/server-html.html
A	seo-remediation/reports/evidence/PC01-REL-05/baseline/summary.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-desktop/run-01.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-desktop/run-01.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-desktop/run-02.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-desktop/run-02.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-desktop/run-03.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-desktop/run-03.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-01-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-01-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-01.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-01.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-02-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-02-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-02.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-02.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-03-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-03-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-03.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-03.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-04-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-04-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-04.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-04.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-05-0.devtoolslog.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-05-0.trace.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-05.report.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/lighthouse-mobile/run-05.report.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/manifests/build-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/manifests/middleware-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/manifests/pages-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/manifests/routes-manifest.json
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/ownership-current.csv
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/screenshots/desktop-phase-a.png
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/screenshots/mobile-phase-a.png
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/server-html.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/server-v2-html.html
A	seo-remediation/reports/evidence/PC01-REL-05/phase-a/summary.json
M	src/components/CategoryGrid.tsx
M	src/components/ContactCTA.tsx
A	src/components/DeferredCabinCalculator.tsx
M	src/components/EnquiryDialog.tsx
M	src/components/Footer.tsx
M	src/components/Header.tsx
A	src/components/LegacyEmbeddedCalculator.tsx
M	src/components/ProductStructuredData.tsx
M	src/components/QuoteForm.tsx
M	src/components/ReviewForm.tsx
M	src/components/ds/RelatedProductLink.tsx
M	src/components/product-variant-hero/presets.ts
M	src/components/product-variant-hero/rightToExistEntries.tsx
A	src/data/products/c01-specification-overrides.json
M	src/data/products/containerized-data-center.json
M	src/data/products/expandable-container-office.json
M	src/data/products/porta-cabins-applications.json
M	src/data/products/porta-cabins.json
A	src/data/seo/commercialArchitecture.json
A	src/data/seo/unapprovedCommercialGating.json
M	src/data/wp-export/products/expandable-container-office.json
M	src/lib/blogContentCluster.ts
M	src/lib/breadcrumbs.ts
A	src/lib/c01SpecificationOverrides.js
M	src/lib/cabinCalculatorSSR.ts
M	src/lib/calculatorRates.ts
M	src/lib/categoryHubMap.ts
M	src/lib/containerOfficeClusterRail.ts
M	src/lib/labourColonyClusterRail.ts
M	src/lib/panelSchemaOffers.ts
M	src/lib/portaCabinClusterRail.ts
M	src/lib/schema.ts
M	src/lib/sitemapCanonicalPaths.json
M	src/lib/specsShippingTabs.ts
M	src/lib/staticContent.ts
A	src/lib/unapprovedCommercialGating.ts
A	src/lib/verifiedCommercialFacts.ts
M	src/middleware.ts
M	src/pages/[slug].tsx
M	src/pages/api/dynamic-sitemap.xml.ts
M	src/pages/blog.tsx
M	src/pages/product/[category]/[slug].tsx
M	src/pages/product/[category]/index.tsx
M	src/pages/product/container-offices/site-office-container.tsx
M	src/pages/product/puf-panel/cold-storage-puf-panel.tsx
M	src/pages/product/puf-panel/puf-panel-house.tsx
M	src/pages/product/puf-panel/puf-panel-price.tsx
M	src/pages/product/puf-panel/puf-panel-roofing.tsx
M	src/pages/product/puf-panel/puf-panel-specification.tsx
M	src/pages/product/puf-panel/puf-sandwich-panel.tsx
M	src/pages/product/rockwool-panel/index.tsx
M	src/pages/product/roofing-sheet.tsx
M	src/pages/product/roofing-sheet/metal-roofing-sheet.tsx
M	src/pages/product/roofing-sheet/pvc-roofing-sheet.tsx
M	src/pages/product/sandwich-panel.tsx
M	src/pages/product/wall-sheet.tsx
A	seo-remediation/reports/PC01-REL-06B-PRODUCTION-BASE-INTEGRATION-AND-QUALIFIED-PERFORMANCE.md
```

## Rollback

Production and main were never changed, so no production rollback is required. To discard only this isolated candidate after stopping its preview, remove the pc01-production-base-integration-final worktree and local seo/pc01-production-base-integration-final branch. The protected backup ref preserves the checkpoint. Do not delete protected recovery refs.

## No-change proof

- origin/static-migration remains 3346a532306c52932aeb2d813591bf95cb37716b.
- origin/main remains 9188cab7e415569b85f2dddf750992cdeb5abc62.
- Normal integration branch pushed: no.
- Pull requests created: 0.
- Merges into production: 0.
- Deployments: 0.
- Forms submitted: 0.
- Temporary CI performance branches changed: no.
- Protected recovery refs changed: no.
- Only task-authorized qualification and final integration backup refs were pushed.

Separate owner approval and blocker remediation are required before production action.
