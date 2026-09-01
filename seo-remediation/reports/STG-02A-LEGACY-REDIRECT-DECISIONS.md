# STG-02A Legacy Redirect Decisions

Date: 2026-08-26
Branch: `seo/stg-02a-release-blocker-triage`
Starting commit: `22a42d294b25d4fa0315124392a9431731cfab73`

## Scope and stop condition

This record covers only the two literal redirects identified by the STG-01C complete crawl. No redirect source, destination, status code, canonical-path record, approved URL, or commercial-architecture record was changed. Neither URL has enough retained evidence for a permanent disposition in this task.

## Decision records

| Evidence field | Metal roofing sheet | PVC roofing sheet |
|---|---|---|
| Legacy source URL | `https://www.samanportable.com/product/roofing-sheets/metal-roofing-sheet` | `https://www.samanportable.com/product/roofing-sheets/pvc-roofing-sheet` |
| Current redirect status | `301` | `301` |
| Current intermediate URL | None. The source redirects in one hop to the URL in the next row. | None. The source redirects in one hop to the URL in the next row. |
| Current final URL | `https://www.samanportable.com/product/roofing-sheet/metal-roofing-sheet` | `https://www.samanportable.com/product/roofing-sheet/pvc-roofing-sheet` |
| Final HTTP status | `404` in the validated candidate | `404` in the validated candidate |
| Final source publication status | Product record is `draft` in `src/data/wp-export/products/metal-roofing-sheet.json`. | Product record is `draft` in `src/data/wp-export/products/pvc-roofing-sheet.json`. |
| Final approved-plan status | Absent from both the 61 approved/live paths and the 43 planned/unpublished paths. It is retained within the temporary 63-path control. | Absent from both the 61 approved/live paths and the 43 planned/unpublished paths. It is retained within the temporary 63-path control. |
| Sitemap presence | Zero. Neither the legacy source nor draft final URL is in the generated page sitemaps. | Zero. Neither the legacy source nor draft final URL is in the generated page sitemaps. |
| Current internal-link presence | Zero links to the legacy redirect or its 404 destination in the complete local crawl. The retained pre-gating baseline recorded one source occurrence to the final URL; that is historical, not current discovery. | Zero links to the legacy redirect or its 404 destination in the complete local crawl. The retained pre-gating baseline recorded one source occurrence to the final URL; that is historical, not current discovery. |
| Known GSC/Ahrefs evidence | `UNKNOWN_NO_RETAINED_GSC`; no URL-level traffic, conversion, or backlink export is retained. Ahrefs/STG evidence confirms draft 404 and sitemap exclusion, not disposition value. | `UNKNOWN_NO_RETAINED_GSC`; no URL-level traffic, conversion, or backlink export is retained. Ahrefs/STG evidence confirms draft 404 and sitemap exclusion, not disposition value. |
| Closest approved live same-intent page | No exact same-intent approved live page exists. `/product/roofing-sheet` is the nearest approved live commercial owner, but it is a broader family hub and is not an exact substitute for the metal-sheet intent. | No exact same-intent approved live page exists. `/product/roofing-sheet` is the nearest approved live commercial owner, but it is a broader family hub and is not an exact substitute for the PVC/uPVC intent. |
| Workbook redirect guidance | `SAMAN_Portable_URL_Structure_v1.1.xlsx` marks the singular final URL `KEEP` as an existing product page. Its Redirect Plan contains no plural-category alias row and warns that cluster changes require GSC/PIB validation rather than bulk action. | `SAMAN_Portable_URL_Structure_v1.1.xlsx` marks the singular final URL `KEEP` as an existing product page. Its Redirect Plan contains no plural-category alias row and warns that cluster changes require GSC/PIB validation rather than bulk action. |
| Direct approved 200 destination exists | No | No |
| Recommended decision | `OWNER_DECISION_REQUIRED` | `OWNER_DECISION_REQUIRED` |

## Why neither automatic option is safe

- `DIRECT_301_TO_APPROVED_LIVE_PAGE` is not supported because the only live candidate is a broader family hub, not an exact intent-equivalent page.
- `410_RETIRE` is not supported because absence from the final approved plan is insufficient on its own, the older workbook says `KEEP`, and retained GSC/backlink/conversion evidence is unavailable.
- `KEEP_CURRENT_PENDING_DESTINATION` would knowingly preserve a redirect-to-404 release blocker without resolving the contradictory publication guidance.
- `OWNER_DECISION_REQUIRED` is therefore the only evidence-consistent decision. The owner must reconcile the workbook `KEEP` instruction with the later publication architecture, then approve either publication of the exact product intent or a supported retirement/redirect decision after GSC and backlink review.

## Exact implementation evidence

- `src/lib/customProductCanonicalPaths.json` defines the singular-category canonical paths for both slugs.
- `next.config.js` generates the plural-category duplicate redirects from those records as permanent `301` rules.
- `src/data/wp-export/products/metal-roofing-sheet.json` and `src/data/wp-export/products/pvc-roofing-sheet.json` mark the final records `draft`.
- `src/data/seo/commercialArchitecture.json` contains neither final URL in approved or planned sets.
- `src/data/seo/unapprovedCommercialGating.json` retains both final URLs within the temporary control set.
- `seo-remediation/reports/RB-01C-PUBLICATION-GATE-IMPLEMENTATION.md` records both draft 404 exclusions.
- `seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.csv` records the missing retained GSC evidence, historical single-link evidence, and owner-review requirement.
- `seo-remediation/reports/STG-01C-REMOTE-STAGING-VERIFICATION.md` and `.qa/stg01c-complete-crawl.json` identify the two exact redirect-to-404 paths.
- `C:\Users\Saman Pos\.codex\attachments\58f7fabf-54bd-4437-a58d-292c3b6dde82\SAMAN_Portable_URL_Structure_v1.1.xlsx`, sheets `Easy Final Structure`, `Complete URL Map`, and `Redirect Plan`, provides the older workbook guidance.

## SEO risk

The current state wastes any remaining legacy signal and produces poor user/bot outcomes at the destination. Redirecting either source to the broader hub without exact equivalence risks soft-404 treatment and intent dilution. Issuing a 410 without GSC/backlink evidence risks avoidable equity loss. No redirect code was changed in STG-02A.
