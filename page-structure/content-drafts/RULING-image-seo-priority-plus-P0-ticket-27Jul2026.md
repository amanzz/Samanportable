# RULING — IMAGE SEO PRIORITY ORDER + P0 TICKET · Fable 5 · 27 Jul 2026
**Built entirely from Codex's measured audit of 8,073 image occurrences across 463 pages. Nothing here is assumed.**

---

## 1 · MY HYPOTHESIS WAS WRONG, AND THAT IS GOOD NEWS

I predicted the Next.js optimiser was suppressing image indexation site-wide, and said no cluster could be renamed until that was settled. **The audit disproves it.**

2,925 of 2,926 clean source paths return 200. `robots.txt` allows `/_next/image`. Product pages already serve 3,487 occurrences at direct clean paths against 4,441 through the optimiser, and the porta cabin hero renders as `src="/images/products/porta-cabins/20x10/porta-cabin-20x10-hero-view.webp"` with no wrapper at all.

**The delivery mechanism is not the problem. Nothing is blocked. Renaming is unblocked.**

## 2 · THE ACTUAL SYSTEMIC DEFECT

**Zero image entries exist in any sitemap. All 8,073 occurrences, all 2,926 unique files, absent.**

That is one mechanical fix, no content work, and it unlocks discovery for every image on the site at once. It is by a wide margin the cheapest large win available here, and it is why every cluster shows 100% failure.

## 3 · PRIORITY ORDER — ruled

**P0. Image sitemap plus the broken default image.** Site-wide, mechanical, one event. Unlocks 2,926 files. Ticket below.

**P1. The 164 truth-defect files.** Renders presented as real installations, and identical cabin scenes assigned to incompatible cities and projects. **This is an L15 defect, not an SEO one.** It is a trust and accuracy problem and it gets fixed whether or not it helps rankings. Cluster by cluster, alongside P3.

**P2. Oversized delivery.** 5,272 occurrences served more than 2× their display dimensions, and 74 over 200 KB. **This very likely explains the 7-second product-page LCP** measured on the video event, against roughly 3.3 seconds on blogs. Two open threads turn out to be one problem. Mechanical, site-wide, and it joins the performance ticket.

**P3. Alt text.** 6,121 occurrences under 60 characters and 265 sharing 20 duplicate strings. This is the slow work: 2,536 occurrences across 381 files need the image viewed before anything can be written. Cluster by cluster, worst first.

**P4. Filenames.** 1,405 of 8,073 fail the pattern, but **6,668 already pass**. Wholesale renaming is not warranted and would be actively harmful, because a changed image URL resets whatever equity that file has earned. Rename only the 1,405 failures, only inside a cluster event, and only where the file is not already ranking. The 9 duplicate-filename groups are all panel products and are fixed in that cluster's turn.

**Cluster order for P1 and P3**, from the localised-failure column: container-offices 833, container-cafe 849, container-houses 728, peb-constructions 550, labor-colony 538, portable-cabin 524, portable-office 506, porta-cabins 495, then the rest.

**Porta Cabins is fourth, not first.** It has 495 localised failures against container-offices at 833. Doing C-01 first would be tidy but wrong; the ranking is the ranking.

---

# TICKET P0 — IMAGE SITEMAP AND BROKEN DEFAULT IMAGE
**Approved by Fable 5, 27 July 2026. Site-wide. Mechanical. No content decisions.**

## Scope

**A. Generate an image sitemap.** Every image that renders on a live 200 page is listed under the page URL that uses it, using the **clean source path**, never the optimiser URL. Add it to the existing sitemap index alongside products, locations, projects and editorial.

Exclusions, and report the count of each: decorative images carrying `alt=""` · icons and logos under 5 KB · any image whose clean path does not return 200.

**B. Fix `/default-blog-image.jpg`.** It returns 404 and is referenced on `/container-offices-for-sale-in-hosur` and `/in-the-long-run-are-prefabricated-industrial-buildings-more-cost-effective`.

**Do not invent a replacement image.** Report which of these is true and stop if neither is clean: the file exists elsewhere in the repository under a different path, or the two pages have another suitable image already present, or the reference should be removed entirely. **I rule on the fix once you report.**

## Explicitly out of scope

No renaming. No alt text changes. No resizing or format conversion. No schema changes. No page copy. If a task appears to need any of these, **stop and report.**

## Acceptance

1. Image sitemap exists, is referenced from the sitemap index, and validates.
2. Image count in it, plus the count excluded, broken down by exclusion reason.
3. **Every listed image URL returns 200.** Zero 404s, zero redirects. This is the gate that matters, since a sitemap full of broken URLs is worse than no sitemap.
4. Every image is listed under a page that returns 200.
5. Clean paths used throughout. **Zero `/_next/image` URLs in the sitemap.**
6. Page sitemap counts unchanged at 459.
7. `robots.txt` unchanged.
8. **Zero visible-text, zero JSON-LD and zero markup change on any page.** This event adds a sitemap and nothing else. Prove with a content-layer diff.
9. TypeScript clean, production build clean, CWV no-regress.

Preview, report to Fable 5, **STOP. Do not merge.**

## After deployment

Submit the image sitemap in Search Console. Expect image indexation to appear over four to eight weeks. **Measure at the 23 August checkpoint on the Images tab of Search Console**, not on total traffic, so the effect is attributable.
