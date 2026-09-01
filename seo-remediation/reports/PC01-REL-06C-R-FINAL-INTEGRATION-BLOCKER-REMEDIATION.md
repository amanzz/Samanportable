# PC01-REL-06C-R — Final Integration Blocker Remediation

Date: 2026-09-01

## Final verdict

READY_FOR_OWNER_FINAL_INTEGRATED_PREVIEW

The exact integrated PC-01 checkpoint was rehydrated from its protected remote backup, the three authorized blockers were corrected in two separate implementation commits, the complete regression remained baseline-compatible, and the production-equivalent owner preview is available at:

`http://127.0.0.1:3210/product/porta-cabins`

No production push, main push, pull request, merge, deployment, or form submission occurred.

## Recovery and worktree

- Authoritative remote: `https://github.com/amanzz/Samanportable.git`.
- Recovered backup ref: `refs/heads/backup/seo-recovery-20260831/pc01-production-base-integration-final`.
- Verified checkpoint: commit `0c07115b3a8c935471aab089a4b3e90400c88407`, tree `a6d099371be717b636333309982e07ec78840990`, parent `a704bbe44e1b7f88ea3840658f2da68cff97a2a7`, subject `docs(seo): record final integrated PC-01 release candidate`.
- Verified controls before recovery: `origin/static-migration` at `3346a532306c52932aeb2d813591bf95cb37716b`; `origin/main` at `9188cab7e415569b85f2dddf750992cdeb5abc62`.
- Valid recovery repository: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\repos\Samanportable-rel06c-rehydrated`.
- Local recovery anchor: `recovery/pc01-production-base-integration-final-rehydrated` at the exact checkpoint; not pushed.
- Genuine remediation worktree: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-final-integration-blocker-remediation-rehydrated-v2`.
- Branch: `seo/pc01-final-integration-blocker-remediation-rehydrated-v2`. The `-v2` path was required because Windows could not complete the first long-path checkout; the incomplete first worktree was preserved and was not used.

The prior expected directory was inspected read-only and remains an empty orphaned plain directory: it exists, contains no `.git`, contains zero files and zero bytes, and was never used as source authority. Evidence is outside that directory at `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\evidence\PC01-REL-06C-ORPHANED-WORKTREE` in `ORPHANED-DIRECTORY-INVENTORY.md` and `ORPHANED-DIRECTORY-HASHES.csv`.

## Owner decisions and boundaries

- `PC01-CALCULATOR-BASE-PARITY-2026-08-31`: `PC01_SELECTED_VARIANT_PRICE_EX_GST_IS_CALCULATOR_BASE`.
- `PC01-FAQ-PRESENTATION-2026-08-31`: `STATIC_VISIBLE_FAQ_BLOCKS_APPROVED`.
- `PC01-ENQUIRY-DIALOG-A11Y-2026-08-31`: `ADD_NONVISUAL_ACCESSIBLE_DIALOG_DESCRIPTION`.

The six published prices, FAQ wording/schema/design, specifications, qualified C01 policy, active PDF, GA assets, freight bands, optional rates, keyword ownership, route architecture, metadata, sitemap sources, redirects, and publication state were not changed. The enquiry form contract and endpoint were not changed. Deployment remains unauthorized.

## Calculator root cause and correction

The maintained route ladder was already passed from the PC-01 page through the deferred calculator, but both browser and server calculators ignored it for the base amount and instead used the old bare-cabin area rate card. They also charged the two standard 3×3 ft uPVC windows as paid options, adding ₹10,980 to every default configuration. The estimate PDF API recomputed through the same server calculator and inherited the mismatch.

The correction is scoped to `ladderKey === 'porta-cabins'` and exact published dimensions. The server selects the maintained ladder row; the browser reads the server-rendered published-price rows; the two unchanged standard windows are treated as included. Custom/unmatched PC-01 sizes remain quotation-only. Other product families retain their previous rate-card behavior. Changed or added windows, explicit options, GST, freight, installation, ODC, and quotation-only rules retain their existing behavior.

| Size | Before base | Before default adjustment | Before subtotal | After base/subtotal | After incl. GST |
|---|---:|---:|---:|---:|---:|
| 10x10 | 110000 | 10980 | 120980 | 143750 | 169625 |
| 20x8 | 168000 | 10980 | 178980 | 220000 | 259600 |
| 20x10 | 200000 | 10980 | 210980 | 250000 | 295000 |
| 20x12 | 240000 | 10980 | 250980 | 288000 | 339840 |
| 30x10 | 300000 | 10980 | 310980 | 360000 | 424800 |
| 40x10 | 400000 | 10980 | 410980 | 475000 | 560500 |

Browser evidence confirms all six after values, zero default paid-window lines, a separately selected 4% roof option changing ₹250,000 to ₹260,000, and a separate 150 km freight line of ₹27,500. The representative unrelated calculator route retained its prior ₹200,000 base and ₹210,980 default total.

Calculator commit: `b545e3868f2ab99299bc41d72f736d34efb8f644` — `fix(calculator): align Porta Cabins estimates with published prices`.

## FAQ and accessibility correction

The FAQ UI and data were not edited. The targeted gate now requires eight visible server-rendered heading/answer blocks, eight FAQPage entries, exact text parity, one FAQPage, and no Review/AggregateRating; it explicitly accepts `STATIC_VISIBLE_BLOCKS` and rejects accordion requirements, rental FAQs, and filler FAQs.

The shared enquiry dialog now uses the existing `DialogDescription` primitive with a visually hidden description: “Tell us your Porta Cabin requirement and contact details so the SAMAN team can respond with an itemised quotation.” The success state also has a nonvisual description. Title, visible layout, fields, names, CTA, validation, `/api/enquiry`, spacing, dimensions, and focus order are unchanged.

Browser checks confirmed mouse activation, initial input focus, Tab, Shift+Tab, Escape close, focus containment, and the exact screen-reader description. The same shared dialog passed on PC-01, the Container Offices hub, the MS Porta Cabin child, and `/contact`. Console warnings/errors were zero and forms submitted were zero.

Second commit: `df952a3d91b2a9083dd4270c058dd35f2acd2ef9` — `fix(a11y): describe enquiry dialog and approve static FAQ presentation`.

## Performance qualification compatibility

No file pinned by the performance qualification manifest changed, so the manifest was not edited. The existing validator and all 20 portability/mutation cases pass. Status remains `QUALIFIED_UNRESOLVED`; deterministic DOM reduction remains 54.2%, script-transfer reduction 45.3%, and category route JavaScript reduction 47.0%. This is not an LCP, TBT, INP, or Core Web Vitals pass. Lighthouse was not run.

## Complete regression

Passed:

- calculator parity validator and 12/12 mutations;
- static FAQ presentation/parity validator;
- enquiry-dialog static contract and browser/shared-route checks;
- performance qualification validator and 20/20 mutations;
- deterministic Phase-A thresholds;
- qualified C01 validator and 20/20 mutations;
- specification override validator: 30/30 effective rows, exact Fasteners override, 5/5 protected siblings;
- active PDF validation, 19 mutation cases, and determinism: 11 pages, 6 images;
- keyword ownership validator and 11/11 mutations: 321 pages, 6,368 relevant occurrences, 445 groups, zero findings;
- TypeScript, lint, and production build/postbuild;
- strict commercial architecture: 61 approved/live and 43 planned/unpublished;
- temporary controls: 63;
- publication gate: 61/43/63, 138 gated-link occurrences across 42 targets;
- gated-link crosswalk and sitemap/XML: 321 ordinary locations;
- complete crawl: 31,518 internal-link occurrences, zero new redirect/error edges, canonical conflicts, sitemap indexability conflicts, schema parse errors, approved duplicate schemas, broken images, broken PDFs, missing titles, or missing/multiple H1s;
- direct product/schema: one Product, one FAQPage, one BreadcrumbList, six exact offers, AggregateOffer low/high/count 143750/475000/6, no Review/AggregateRating;
- direct PC-01 merchant-feed item remains ID 1298 at `250000.00 INR` with the canonical PC-01 URL;
- safe form contract: zero submissions.

Lint retained exactly the three accepted baseline warnings: two `useMemo` dependency warnings on `site-office-container` and one legacy `img` warning on the slug route.

Three baseline-qualified conditions remain unchanged and are not introduced regressions:

1. The complete crawl exits nonzero only for the two inherited roofing redirect sources whose held-draft targets intentionally return 404; the source/target behavior is baseline-identical.
2. The whole-repository merchant validator still identifies six unrelated pre-existing image omissions (IDs 990005, 990008, 990003, 990002, 990004, and 990007); direct PC-01 feed parity passes.
3. The generic STG-01B historical structured-data diff gate is not descendant-aware and rejects four already-integrated PC-01 baseline files. The targeted live product/schema validation passes and the historical gate was not weakened.

Protected hashes remain:

- generated C01 JSON: `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099`;
- active PC-01 PDF: `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96`.

Qualified C01 debt and performance measurement debt both remain `QUALIFIED_UNRESOLVED` under their existing sunset conditions.

## Browser and visual QA

Chrome 152 exercised exact CSS viewports 360×800, 390×844, 768×1024, and 1440×900 against the production build. Every viewport had zero document-level horizontal overflow and zero failed images. Off-viewport carousel cards remained clipped within the intentional carousel viewport and did not widen the document. Visual inspection confirmed the approved hero/gallery, six selectors and GA tabs, price table, calculator, PDF link, product tabs, static FAQs, ten unique specialist child destinations, guide/contact links, and dialog without clipping or redesign.

The in-app browser connection supplied the initial semantic inspection but became unresponsive during repeated viewport reloads. Following the browser-control recovery guidance, the final coherent screenshot, interaction, console, and network evidence was captured in an isolated local headless Chrome profile against the same production server. No external site, credentials, persistent profile, or form endpoint was used.

Evidence directory: `seo-remediation/reports/evidence/PC01-REL-06C-R/`.

- `porta-cabins-390x844.png`
- `porta-cabins-1440x900.png`
- `porta-cabins-calculator-1440x900.png`
- `porta-cabins-enquiry-dialog-1440x900.png`
- `calculator-breakdowns.json`
- `faq-server-html.html`
- `faq-jsonld.json`
- `dialog-accessibility.json`
- `browser-qa.json`
- `browser-console.json`
- `browser-network.json`
- production server logs

The final browser evidence contains zero network failures, zero HTTP errors, zero console warnings/errors, zero runtime exceptions, and zero form submissions.

## Exact remediation files

Application, validator, and decision/report files changed from the recovered checkpoint before this final report/evidence commit:

- `package.json`
- `public/scripts/cabin-cost-calculator.js`
- `scripts/test-pc01-calculator-price-parity.mjs`
- `scripts/validate-enquiry-dialog-accessibility.mjs`
- `scripts/validate-pc01-calculator-price-parity.mjs`
- `scripts/validate-pc01-static-faq-presentation.mjs`
- `src/components/EnquiryDialog.tsx`
- `src/lib/cabinCalculatorSSR.ts`
- `seo-remediation/reports/PC01-REL-06C-R-OWNER-FINAL-BLOCKER-DECISIONS.md`
- `seo-remediation/reports/PC01-REL-06C-R-CALCULATOR-ROOT-CAUSE.md`
- `seo-remediation/reports/PC01-REL-06C-R-FAQ-PRESENTATION-DECISION.md`
- this final report and the evidence files listed above.

No product-data, PDF, GA, specification, route, redirect, sitemap-source, architecture, keyword, performance-manifest, production, or main file changed.

## Rollback and control proof

Rollback is isolated: discard the final backup branch or revert the report commit, then `df952a3d91b2a9083dd4270c058dd35f2acd2ef9` and `b545e3868f2ab99299bc41d72f736d34efb8f644` in reverse order. No production rollback is needed because nothing was merged or deployed.

The ordinary implementation branch remains local-only. The only authorized remote write is the protected backup namespace requested by the owner. Final remote control refs, protected hashes, ancestry, branch non-publication, and the running HTTP 200 preview are verified again after the report commit and backup push.
