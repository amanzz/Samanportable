# TICKET — IMAGE SEO AUDIT, C-01 PORTA CABINS (READ ONLY) · Fable 5 · 27 Jul 2026
**Approved by SAMAN, 27 July 2026. Governed by `L19-image-seo-and-indexation-law-27Jul2026.md`.**
**Supersedes the site-wide audit ticket. SAMAN's ruling: image SEO runs cluster by cluster, not the whole site at once.**
**This event measures. It changes nothing.**

---

## 1 · SAMAN'S RULING, AND WHY IT IS RIGHT

Cluster by cluster is the correct call. A site-wide image event would mean thousands of filename changes landing in one deployment, and every changed image URL resets whatever ranking that image had earned. Doing it a cluster at a time means each batch can be measured against the next Search Console cycle before the following one starts.

It also matches how the rest of this programme works. C-01 was rebuilt cluster by cluster and that is why it is defensible.

## 2 · ONE THING STAYS SITE-WIDE

**The delivery-mechanism question is answered once, now, for the whole site.** It is a single code path, the answer does not change per cluster, and it may make every filename change pointless until it is resolved.

Every image on the site is served through the Next.js optimiser as `/_next/image?url=<encoded>&w=<n>&q=<n>`. That is a query-string endpoint rather than a file, and the descriptive filename sits inside an encoded parameter.

**Answer with evidence:**

1. Is the original file also reachable at a clean path, for example `https://www.samanportable.com/images/<filename>.webp`, returning 200?
2. Does `robots.txt` allow or disallow `/_next/image`?
3. Does an image sitemap exist today? If so, which URL form does it list?
4. What does the rendered HTML of `/product/porta-cabins` actually contain: `src`, `srcset`, `sizes`, and whether a clean path appears anywhere in that markup.

**If image indexation is being suppressed by the delivery mechanism, that is a bigger single fix than renaming every file on the site, and it must be settled before any cluster is renamed.** Everything else in this ticket is C-01 only.

## 3 · SCOPE — nine pages

`/product/porta-cabins` · `low-cost-porta-cabin` · `luxury-porta-cabin` · `mini-porta-cabin` · `ms-porta-cabin` · `steel-porta-cabin` · `porta-cabin-shop` · `porta-cabin-with-toilet` · `portacabin-office`

Every image that renders on those nine pages, including component-level and gallery images. **Do not sample.**

## 4 · THE TABLE — one row per image occurrence

| Column | Contains |
|---|---|
| Page URL | where it renders |
| Image source path | the raw path as authored |
| Delivered URL | as it appears in rendered HTML, including any optimiser wrapper |
| Filename | file name only |
| Alt text | verbatim, or `EMPTY`, or `MISSING` |
| Alt length | character count |
| Element type | `img`, `next/image`, CSS background, schema-only |
| Loading | `lazy`, `eager`, absent |
| Dimensions | as served |
| File size | KB |
| Format | webp, jpg, png, svg |
| In sitemap | yes or no |
| In page schema | yes or no, which block |
| Source file | repository file, and whether under `src/data/wp-export/` |

Write to `audit/image-seo/c01/` as CSV and JSON.

## 5 · SUMMARY COUNTS

1. Total images across the nine pages, total unique files, files used on more than one page.
2. **Duplicate filenames** across different images. List them.
3. **Duplicate alt text** across different images. List every repeated string with its count.
4. Missing alt, and empty alt.
5. Filenames matching the L19 pattern versus not. Count camera and export codes: `IMG_`, `DSC_`, `Screenshot`, bare numbers.
6. Alt text outside 60 to 125 characters, split into too short and too long.
7. Images not in any sitemap.
8. Images not in the page's `ProductGroup` image array.
9. Images delivered only as CSS backgrounds.
10. Images over 200 KB, and any served more than 2x larger than display size.
11. Non-webp images.
12. **Per page**, image count and the count failing any L19 rule.

## 6 · TRIAGE — the count that decides the schedule

Classify every image's existing alt text into exactly one:

- **A** accurate but poorly written. Describes what is in frame. Can be rewritten without viewing the image.
- **B** generic, duplicated, missing or empty. **The image must be viewed** before alt text can be written.
- **C** inaccurate, or implies a render is a delivered project. **Flag separately. These are truth defects under L15, not SEO defects.**

**Report the count in each.** The size of B decides how the remediation is staged.

## 7 · HARD PROHIBITIONS

Change nothing. No rename, no alt edit, no sitemap regeneration, no schema change, no commit beyond the docs commit. If a page cannot be crawled or an image cannot be resolved, **list it rather than skipping it silently.**

## 8 · DELIVERABLE

The per-image table, the twelve counts, the four site-wide answers from §2, the A/B/C triage counts, and a per-page ranking of image SEO debt worst first.

Report to Fable 5 and **STOP.** The C-01 remediation ticket is written from this data, and not before. Other clusters follow one at a time, each measured against a Search Console cycle before the next begins.
