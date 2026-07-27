# L19 — IMAGE SEO AND INDEXATION LAW · Fable 5 · 27 Jul 2026
**SAMAN, 27 July: every image on every page must have a unique SEO filename, unique alt text, and must be indexable. This law sets the standard. The audit that follows measures the site against it. Remediation tickets are written per cluster from that measured data, never from assumption.**

---

## 1 · WHY THIS IS THE BIGGEST REMAINING OPPORTUNITY

You sell a product people need to see. Cabins, colonies, interiors, site installations. Image search is a real entry point for this category and almost no Indian prefab competitor treats it seriously.

There is also a specific problem worth naming before anything else. **The site serves images through the Next.js optimiser**, so a page reference looks like `/_next/image?url=%2Fimages%2Fporta-cabin-product-video-poster.webp&w=1920&q=75`. That is a query-string endpoint, not a file. Google can index it, but it is a far weaker signal than a clean path like `/images/porta-cabin-20x10-front-view.webp`, and the descriptive filename, which is one of the ranking inputs, is buried inside an encoded parameter.

**Whether that is worth changing is a technical decision I will make from the audit, not before it.** It may be that a clean canonical path already exists alongside the optimised one. Measuring comes first.

## 2 · FILENAME STANDARD

Lowercase, hyphen separated, descriptive, product specific. No camera codes, no export codes, no numbers alone.

**Pattern:** `[product]-[size-or-variant]-[view-or-feature].[ext]`

Correct:
`porta-cabin-20x10-front-view.webp`
`labour-colony-90x24-central-courtyard.webp`
`container-office-40x10-interior-workstations.webp`
`portable-toilet-2-seater-exterior.webp`

Wrong:
`IMG_2847.jpg` · `image1.webp` · `final-v2.png` · `porta-cabin.webp` used on nine pages · `best-porta-cabin-price-manufacturer-india.webp`

**Every filename on the site must be unique.** The same physical image reused on two pages keeps one filename, but two different images may never share one.

## 3 · ALT TEXT STANDARD

Alt text describes what is actually visible. It is written for a person who cannot see the image, and it earns its ranking value as a side effect of being accurate.

**Include where visible:** product type, size, exterior or interior view, colour, layout, application, notable feature.

**Length:** 60 to 125 characters. Under 60 is usually too thin to be useful; over 125 gets truncated by screen readers and reads as stuffing.

**Every alt attribute on the site must be unique.** Repeating one string across a gallery is the single most common failure and it wastes every image after the first.

Correct:
`20x10 ft porta cabin with steel-blue corrugated exterior, aluminium sliding windows and a flush entrance door`

Wrong:
`Porta cabin` · `Image 1` · `Best porta cabin price manufacturer India` · the same sentence on all nine gallery images · describing a feature that is not in the frame

**Decorative images take an empty alt attribute** (`alt=""`), never a filler description. An icon or a background texture is not content.

## 4 · INDEXATION REQUIREMENTS

An image with a perfect filename that Google cannot reach is worth nothing. All four must hold.

1. **Crawlable.** Not blocked by `robots.txt`, not behind a login, not injected only by client-side JavaScript after interaction.
2. **In an image sitemap.** Every indexable image appears in the sitemap under the page that uses it, so Google associates image and page explicitly rather than guessing.
3. **Referenced with a real `<img>` or `next/image` element**, never as a CSS background, for anything that carries meaning. Background images do not get indexed as images.
4. **Reachable at a stable URL.** Filenames do not change between deployments, because a changed URL resets whatever ranking the image had earned.

**Lazy loading is required and does not block indexing** provided the `src` is present in the HTML. Lazy loading via JavaScript that leaves `src` empty until scroll does block it.

## 5 · SCHEMA

Every product page's existing `ProductGroup` block carries an `image` array. That array must list the page's real image URLs, primary image first. This is what surfaces images in rich results, and it is separate from the sitemap.

Where a page carries a genuine photograph of a completed project, `ImageObject` with `contentUrl`, `caption` and `creditText` is permitted. **No invented `datePublished`, no invented location.**

## 6 · WHAT IS NEVER ACCEPTABLE

Keyword stuffing in a filename or alt attribute · describing something not visible · the same alt text on more than one image · claiming a photograph is a SAMAN project when it is a render or a stock image · alt text written for a search engine rather than a person.

**If an image is a render rather than a photograph, the alt text must not imply it is a delivered project.** That is an L15 truth defect, and it is the one image failure that can cost trust rather than just ranking.

## 7 · SEQUENCE — this is how the work runs

1. **Audit, site-wide, read-only.** Every image on every live page: file path, filename, alt text, dimensions, format, file size, loading attribute, whether it sits in the sitemap, whether it is in schema, and which pages use it. **No changes.**
2. **Fable 5 rules** from the measured data: which clusters are worst, whether the optimiser path is a real indexation problem, and what the remediation order is.
3. **Remediation, one ticket per cluster**, each carrying a per-page and per-image table with the exact new filename and the exact new alt text, written verbatim.

**Step 3 does not begin before step 1 completes.** A filename cannot be assigned to an image nobody has looked at, and alt text cannot describe a photograph nobody has seen.

## 8 · ONE PRACTICAL CONSTRAINT ON WRITING ALT TEXT

Alt text has to describe what is in the frame. That means someone must look at each image. For a set of nine gallery images per product across dozens of products, that is a large amount of looking.

**The efficient path:** the audit reports the existing alt text and the filename for every image. Where an existing alt text is accurate but poorly worded, it can be rewritten from that description without viewing the image. Where it is absent, generic, or duplicated, the image must be viewed before alt text is written.

**The audit must report which of the two categories each image falls into.** That number decides how the remediation is staged and is the difference between a week of work and a month of it.
