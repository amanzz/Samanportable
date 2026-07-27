# TICKET — SITE-WIDE IMAGE SEO AUDIT (READ ONLY) · Fable 5 · 27 Jul 2026
**Approved by SAMAN, 27 July 2026. Governed by `L19-IMAGE-SEO-AND-INDEXATION-LAW-27Jul2026.md`.**
**This event measures. It changes nothing. Not one file is edited.**

---

## 1 · WHY AN AUDIT BEFORE ANY TICKET

Remediation needs the exact current filename and the exact current alt text of every image before a replacement can be specified. Writing per-page tickets without that produces instructions that cannot be executed, which is precisely what happened with the C-01 link closure and cost a full cycle.

**Nothing is assumed here. Everything is enumerated.**

## 2 · SCOPE

Every image on every live page. The live authority is the current sitemap, 459 URLs, plus any live 200 page not in it.

Include: product hubs and subpages, blogs, location pages, project pages, category pages, policy pages, homepage, and any component-level image that renders on those pages.

## 3 · THE TABLE — one row per image occurrence

| Column | What it must contain |
|---|---|
| Page URL | the live URL where the image renders |
| Image source path | the raw path as authored, before optimisation |
| Delivered URL | the URL as it actually appears in the rendered HTML, including any `/_next/image?url=...` wrapper |
| Filename | the file name only |
| Alt text | verbatim, or `EMPTY` if `alt=""`, or `MISSING` if the attribute is absent |
| Alt length | character count |
| Element type | `img`, `next/image`, CSS background, or schema-only |
| Loading | `lazy`, `eager`, or absent |
| Dimensions | width and height as served |
| File size | in KB |
| Format | webp, jpg, png, svg |
| In sitemap | yes or no |
| In page schema | yes or no, and which schema block |
| Source file | the repository file that renders it, and whether it sits under `src/data/wp-export/` |

## 4 · THE SUMMARY COUNTS I NEED TO RULE FROM

1. Total images, total unique files, and how many files are used on more than one page.
2. **Duplicate filenames** across different images. List them.
3. **Duplicate alt text** across different images. List every string used more than once, with its count.
4. Images with **missing** alt, and images with **empty** alt.
5. Images whose filename matches the L19 pattern, and images that do not. Report the count of camera or export codes such as `IMG_`, `DSC_`, `Screenshot`, or a bare number.
6. Alt text outside the 60 to 125 character band, split into too short and too long.
7. Images **not in any sitemap**.
8. Images **not in page schema** on product pages.
9. Images delivered only as **CSS backgrounds**.
10. Images over **200 KB**, and any image served larger than its display size by more than 2x.
11. Images in **non-webp** formats.
12. **Per cluster**, the count of images and the count that fail any L19 rule. This is what decides the remediation order.

## 5 · THE ONE QUESTION THAT DECIDES THE TECHNICAL FIX

Every image reference I have seen is delivered through the Next.js optimiser as `/_next/image?url=<encoded>&w=<n>&q=<n>`.

**Report, with evidence:**

1. Is the original file also reachable at a clean path, for example `https://www.samanportable.com/images/<filename>.webp` returning 200?
2. Does `robots.txt` allow or disallow `/_next/image`?
3. Do any images currently appear in an image sitemap, and if so which URL form is listed, the clean path or the optimiser URL?
4. What does the rendered HTML actually contain for a representative product page: `src`, `srcset`, `sizes`, and whether a clean path appears anywhere in that markup.

**This determines whether image indexation is being suppressed site-wide by the delivery mechanism.** If it is, that is a bigger single fix than renaming every file on the site, and it needs to be settled before anyone renames anything.

## 6 · THE TRIAGE COLUMN THAT DECIDES THE SCHEDULE

For each image, classify the existing alt text into exactly one of three:

- **A — accurate but poorly written.** It describes what is in the frame. It can be rewritten without anyone viewing the image.
- **B — generic, duplicated, missing or empty.** The image must be viewed before alt text can be written.
- **C — inaccurate.** It describes something not in the frame, or implies a render is a delivered project. **Flag these separately; they are truth defects, not SEO defects.**

**Report the count in each category.** The size of B is the single number that determines whether remediation takes a week or a month, and it decides how I stage the work.

## 7 · HARD PROHIBITIONS

**Change nothing.** No file renamed, no alt text edited, no sitemap regenerated, no schema touched, no commit, no branch beyond a clean read-only worktree.

Do not sample. **Every page, every image.** If the output is large, write it to `audit/image-seo/` as JSON and CSV and report the summary counts inline.

If any page cannot be crawled or any image cannot be resolved, **list it rather than skipping it silently.**

## 8 · DELIVERABLE

1. The full per-image table as CSV.
2. The twelve summary counts from §4.
3. The four answers from §5, with evidence.
4. The A, B and C triage counts from §6.
5. A per-cluster ranking of image-SEO debt, worst first.

Report to Fable 5 and **STOP**. Remediation tickets are written per cluster from this data, and not before.
