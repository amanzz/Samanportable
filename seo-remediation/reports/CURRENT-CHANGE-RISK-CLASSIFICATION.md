# Current Change Risk Classification and Integration Plan

Updated: 2026-08-25
Captured base: `feature/llms-txt` at `296082c64db2332d9bfb4d0febcd192a34463d59`

## Classification rules

- **A â€” Reports and tracking only:** documentation, audit correction, checkpoints and readiness evidence.
- **B â€” Safe technical remediation:** verified redirects/direct links, known-false schema removal, mechanical approved-fact normalization and release validation.
- **C â€” Temporary 63-URL gating:** exact-set discovery, sitemap, listing, robots and schema containment. This is excluded from the initial release candidate.
- **D â€” Visible content/source-data:** user-visible prose or facts. New Codex-authored prose is `WAITING_CLAUDE` and excluded from the initial release candidate.
- **E â€” Forms and conversion:** POST/native field contracts and the enquiry API fix; separately reviewable.
- **F â€” Performance:** DOM/template reduction; separately reviewable.
- **X â€” Pre-existing or unrelated working-tree state:** preserved by the checkpoint only and not transferred.

A mixed label means the file must be split by hunk or refactored before integration. File-level copying is forbidden for mixed files.

## Categorized commit/diff plan

1. **Commit 1 â€” reports, tracker and release validation infrastructure**
   - Add integration reports/checkpoint references.
   - Add an approved-production/planned-backlog fixture and strict validation.
   - Refactor the current combined fixture so the exact 63-URL list does not enter this commit.
2. **Commit 2 â€” safe redirects and internal-link corrections**
   - Apply only the seven evidence-backed redirect destination changes, the direct retired Portable Cabin redirect/link changes, and the render-layer mapping for 375 audited occurrences.
   - Keep the 11 Tiny Container Homes occurrences unresolved and reported.
3. **Commit 3 â€” known-false schema removal and mechanical freight handling**
   - Remove the false flat â‚¹3,000 shipping schema.
   - Apply only approved-fact normalization; do not transfer new marketing prose.
4. **Commit 4 â€” forms and conversion contracts**
   - Apply POST actions, named controls and the enquiry API name fix.
5. **Commit 5 â€” performance/DOM**
   - Apply only if the DOM reduction can be separated from new visible copy. Otherwise hold it as `WAITING_CLAUDE`.
6. **Separate non-release commit â€” temporary 63-URL gating**
   - Place the exact 63-URL set, robots middleware, listing/discovery exclusions, schema suppression and sitemap exclusions on a separate branch/commit.
   - Do not include it in the initial production-base integration branch.

## Visible-content hold

The following current changes alter user-visible prose and will not enter the initial release candidate without Claude approval:

- `src/components/ProductTabs.tsx`: compact replacement delivery/freight panel; mixed with the DOM reduction.
- `src/pages/delivery-policy.tsx`: newly phrased freight policy copy.
- `src/pages/blog.tsx`: rewritten category-introduction sentence.

The render-time removal/normalization of the known-false â‚¹3,000 claim is mechanical and may remain in Commit 3. No product JSON copy, facts or assets will be overwritten from this incomplete feature checkout.

## Full changed/untracked classification

| File/path | Git state | Classification / integration action |
|---|---|---|
| `BLOG_IMAGE_FINAL_VERIFICATION_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `BLOG_IMAGE_HOST_FIX_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `BLOG_REDIRECT_ANALYSIS_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `BLOG_REDIRECT_FINAL_AUDIT.txt` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `BLOG_REDIRECT_IMPLEMENTATION_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `BLOG_SSR_FIX_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `CATEGORY_ROUTE_VALIDATION_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `DESIGN_RULES.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `EMAIL-SYSTEM-README.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `FETCHPRIORITY_WARNING_FIX.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `FINAL_SSR_SEO_VERIFICATION_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `GOOGLE-MERCHANT-CENTER-FIX.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `HTML_ENTITY_RENDERING_AUDIT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `HTML_ENTITY_RENDERING_FIX_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `IMAGE-OPTIMIZATION-README.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `INTERNAL_LINKING_AUDIT_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `INTERNAL_LINKING_AUDIT_REVISED.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `MIDDLEWARE-README.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `PERFORMANCE-OPTIMIZATION-GUIDE.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `PRODUCTION_READINESS_AUDIT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `PRODUCTTABS_SSR_IMPLEMENTATION_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `PRODUCTTABS_SSR_RISK_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `README-JWT-SETUP.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `README-PRODUCTS.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `README-SEO-SETUP.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `README.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `REDIRECT-SETUP-README.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `SCHEMA_AUDIT_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `SCHEMA_IMPLEMENTATION_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `SEO_SCHEMA_IMPLEMENTATION_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `SHORT-DESCRIPTION-PARSING-README.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `SSR_AUDIT_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `SSR_EVIDENCE_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `WORDPRESS_MIGRATION_AUDIT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `WORDPRESS_MIGRATION_FIX_REPORT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `WORDPRESS_SEO_HARDENING_PLAN.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `WORDPRESS_SUBDOMAIN_SEO_AUDIT.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `aman/12_SAMAN_Final_Fix_Prompt.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `aman/13_SAMAN_Rental_LeaseOut_Schema_Corrected.md` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `baseline.json` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `compress-container.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `compress-slider.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `next-sitemap.config.js` | M | C |
| `next.config.js` | M | B + X |
| `package.json` | M | B |
| `parse_lcp.py` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `response.html` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `response2.html` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `run_lighthouse.sh` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/all_products_detailed.json` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/analyze-html.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/audit_blog_images.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/audit_categories.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/audit_redirects.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/blog-source-fixed.html` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/category-hub-source.html` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/crawl_and_verify.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/extract-snippets.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/fetch_all_detailed.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/fetch_all_products.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/inject_rental_breadcrumbs.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/luxury-porta-cabin-source.html` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/porta-cabins-category-source.html` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/print_audit_details.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/product-detail-source.html` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/production_readiness_audit.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/redirect_sanity_check.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/verify-fixed.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/verify_pages.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scratch/verify_warning.js` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scripts/generate-sitemap.js` | M | C |
| `src/components/CategoryGrid.tsx` | M | B |
| `src/components/ContactCTA.tsx` | M | E |
| `src/components/EnquiryDialog.tsx` | M | E |
| `src/components/Footer.tsx` | M | B |
| `src/components/Header.tsx` | M | B |
| `src/components/HeroSection.tsx` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `src/components/HomepageCertifications.tsx` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `src/components/ProductStructuredData.tsx` | M | B |
| `src/components/ProductTabs.tsx` | M | D + F â€” WAITING_CLAUDE |
| `src/components/QuoteForm.tsx` | M | E |
| `src/components/ReviewForm.tsx` | M | E |
| `src/lib/schema.ts` | M | B |
| `src/lib/staticContent.ts` | M | B + C |
| `src/middleware.ts` | M | C |
| `src/pages/404.tsx` | M | B |
| `src/pages/[slug].tsx` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `src/pages/api/dynamic-sitemap.xml.ts` | M | C |
| `src/pages/api/enquiry.ts` | M | E |
| `src/pages/blog.tsx` | M | D â€” WAITING_CLAUDE |
| `src/pages/delivery-policy.tsx` | M | D â€” WAITING_CLAUDE |
| `src/pages/product/[category]/[slug].tsx` | M | C |
| `src/pages/product/[category]/index.tsx` | M | C |
| `start-clean.bat` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tsconfig.tsbuildinfo` | M | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `.worktrees/cmo-01-build/` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `.worktrees/co-08-expandable-container-office/` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `.worktrees/co-09-build/` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `System.Collections.Hashtable.Out` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `new-issue/blog-pagination-fix-production-report-20260802.md` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `new-issue/blog-sidebar-fix-local-report-20260803.md` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `new-issue/blog-sidebar-taxonomy-draft-20260803.md` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `page-structure/content-drafts/_archive/2026-08-22-co-01-asset-fix-v1.1/BUILD-PACK-C04-AGENT-2-shipping-container-office-25Jul2026.md` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `public/image-manifest.json` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `public/images/blr-01/portable-office-cabin-manufacturer-bangalore-hero.webp` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `reports/l20-live-postdeploy-audit-20260803.json` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `reports/l20-postdeploy-live-serial-20260803.json` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scripts/CO-07-output-filename-map-v1.2.json` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `scripts/validate-commercial-architecture.js` | ?? | B |
| `seo-remediation/reports/CURRENT-REMEDIATION-CHECKPOINT.md` | ?? | A |
| `src/data/seo/commercialArchitectureFixture.json` | ?? | C |
| `src/lib/commercialArchitecture.ts` | ?? | C |
| `src/lib/internalLinkRemediation.ts` | ?? | B |
| `src/lib/verifiedCommercialFacts.ts` | ?? | B + D (mechanical approved-fact rendering) |
| `tmp/__pycache__/lc05_reimport_assets.cpython-314.pyc` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/cabin_census_e1_part1.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/cabin_inlinks_matrix.json` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/cabin_sitemap_classified.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/cabin_sitemap_matches.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/crawl_cabin_pages.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/E1-PIB-porta-portable-consolidation-report.md` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/census_detail.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/constraint_file_scope.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/cross_cluster_contamination.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/gsc_16m_census_page_aggregate_matches.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/gsc_16m_cluster_queries_aggregate_only.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/merchant_feed_cabin_items.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/pair_faq_overlap.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/pair_shared_7word_sequences.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/pair_side_by_side_l3.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/pair_spec_rows.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/portable_11_subpage_evidence.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/redirect_chains_detected.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/redirects_touching_cabin_paths.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/route_candidates_absent_from_sitemap.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/e1-pib-porta-portable-report-20260803/videoobject_hits.csv` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/extract_routes.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/l20-live-audit-20260803.json` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/l20-phase3b-before-audit-20260803.json` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/l20_verify_extract.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/lc05_postbuild_audit.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/lc05_reimport_assets.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/__pycache__/generate_lc05_r2.cpython-314.pyc` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/generate_lc05_r2.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r1-inspect/r1-page-01.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r1-inspect/r1-page-03.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r1-inspect/r1-page-08.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r1-inspect/r1-page-09.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r1-inspect/r1-page-12.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r1-inspect/r1-page-13.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/contact-sheet.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-01.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-02.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-03.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-04.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-05.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-06.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-07.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-08.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-09.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-10.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-11.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-12.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2-render/page-13.png` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2/page-01-cover.pdf` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2/page-03-diagrams.pdf` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2/page-08-rates.pdf` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2/page-09-scope.pdf` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2/page-12-faq.pdf` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2/page-13-control.pdf` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/lc05-r2/r1-preserved-pages-with-r2-headers.pdf` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/pdfs/render_lc05_r2.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp/repo_route_candidates.txt` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `tmp_products.py` | ?? | X â€” pre-existing/unrelated; checkpoint only, do not integrate |
| `outputs/full-site-seo-audit-2026-08-11/AUDIT_SEVERITY_REPORT_CORRECTED_2026-08-24.md` | IGNORED | A |
| `outputs/full-site-seo-audit-2026-08-11/IMPLEMENTATION_BACKLOG_CORRECTED_2026-08-24.md` | IGNORED | A |

## External modified file

| File/path | State | Classification |
|---|---|---|
| `D:\Project-shekhar\SAMAN Structural Approved Design\reports\seo\2026-08-24-full-site-technical-seo-audit\SAMAN-full-site-technical-seo-audit-2026-08-24.md` | modified outside repository | A â€” report only; checkpointed separately |

## Safety decision

The initial release candidate will contain only groups A, B, E and any strictly code-only F hunk that preserves approved visible content. Group C stays separate. Group D stays `WAITING_CLAUDE`. Group X is not integrated.
