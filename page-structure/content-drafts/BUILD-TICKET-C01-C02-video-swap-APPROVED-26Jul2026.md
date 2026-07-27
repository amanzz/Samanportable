# BUILD TICKET — VIDEO SWAP + VideoObject, porta cabin & portable cabin · Fable 5 · 26 Jul 2026
**Approved by SAMAN, 26 July 2026. Governed by `L18-video-doctrine-plus-pdf-sitewide-26Jul2026.md`.**

## 1 · SCOPE — exactly two pages

| Video | Page | Action |
|---|---|---|
| `https://youtu.be/SJml1DgMY3I` | `/product/porta-cabins` | Replace the source behind the **existing** facade |
| `https://youtu.be/_0pSsmEN1eo` | `/product/portable-cabin` | **Add** — this page has no video today |

No other page is touched. No other video is added, moved or marked up.

## 2 · THE RULE THAT GOVERNS PLACEMENT — one video, one page

**VideoObject markup for a given video may exist on exactly one URL.** Marking the same video up on a hub and its subpages forces Google to choose which page owns it — that is video cannibalisation, the same mechanism as keyword cannibalisation.

- The porta cabin video is marked up **only** on `/product/porta-cabins`.
- The portable cabin video is marked up **only** on `/product/portable-cabin`.
- No subpage carries VideoObject for either video.
- The porta cabin video never appears on a Portable Cabin page, and vice versa. That pair is the highest-risk boundary on the site.

## 3 · PERFORMANCE — L11, non-negotiable

A standard YouTube iframe loads roughly half a megabyte of third-party JavaScript. The 25 July performance event cut hero render delay by 92%; this must not give it back.

- **Facade only.** No iframe in the initial DOM. The iframe is created on click. The porta cabin hub already implements this pattern — preserve it, do not rewrite it.
- Embed host: **`youtube-nocookie.com`**.
- **Keep the existing same-origin poster** `porta-cabin-product-video-poster.webp` as the facade image. Do not pull YouTube's thumbnail. Produce an equivalent same-origin poster for the portable cabin video from the existing image set.
- `preconnect` to YouTube origins fires **on hover or focus only**, never on load.
- Facade image lazy-loaded, never the LCP element.
- **Acceptance: CWV no-regress vs the lockfile on both pages**, measured warm, same session, peer band ±10%.

## 4 · VideoObject — the part that earns the ranking

Neither page carries VideoObject today, which is why the existing video earns nothing in search. One block per page, on the owning page only.

Required properties: `name` · `description` · `thumbnailUrl` · `uploadDate` · `duration` in ISO 8601 · `embedUrl` · `publisher` bound to the existing SAMAN Organization entity. **Omit `contentUrl`** — the asset is on YouTube, not our origin.

**Extract `name`, `thumbnailUrl`, `uploadDate` and `duration` from YouTube itself.** `https://www.youtube.com/oembed?url=<watch-url>&format=json` gives title and thumbnail; duration and upload date come from the watch page. **Any value that cannot be read → STOP to Fable 5. No estimated durations, no invented dates.** A wrong `duration` or `uploadDate` invalidates the rich result and can trigger a structured-data manual action.

`description` is owner-authored below — do not lift YouTube's description.

- **Porta cabin `description`:** `A walkthrough of every SAMAN porta cabin size from 10 × 10 ft to 40 × 12 ft, showing what each footprint holds, how the cabin is built, and where each size is used on real project sites.`
- **Portable cabin `description`:** `A walkthrough of every SAMAN portable cabin size, showing how each unit is craned, relocated and re-sited, and which footprint suits a site that moves as the work moves.`

## 5 · ON-PAGE TRANSCRIPT — indexable text on our own domain

Place beneath the facade in a collapsible block labelled `Video transcript`. This is worth more than the embed itself, because it is our text on our domain. **Verbatim.**

### `/product/porta-cabins` — **H3 (29c):** `Transcript: porta cabin sizes`

> SAMAN Portable manufactures porta cabins at our own works in India. Each unit is newly fabricated from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container — and is offered in nine standard sizes. The 10 × 10 ft cabin gives 100 sq ft for a single desk or duty post. The 20 × 8 ft gives 160 sq ft on a slim body for tight boundaries. The 20 × 10 ft, at 200 sq ft, is our most-ordered size. The 20 × 12 ft adds 240 sq ft with room for a records or meeting corner. The 20 × 20 ft gives a 400 sq ft square floor suited to briefings. The 30 × 10 ft holds two rooms across 300 sq ft on a single trailer. The 40 × 8 ft runs to 320 sq ft for site rows. The 40 × 10 ft gives 400 sq ft as a full site headquarters. The 40 × 12 ft, at 480 sq ft, is the largest cabin we build in one piece. Every unit uses a welded MS frame with insulated walls and roof, and arrives with wiring, lighting and AC provision fitted. Grades run from value to premium. Cabins are supplied as site offices, security posts, shops, units with an attached toilet, and heavy industrial builds. All units carry a 5-year structural warranty and a 1-year finishing warranty, extendable to 2 years on request. Delivery is 7 to 21 working days from our Bengaluru or Greater Noida facility.

### `/product/portable-cabin` — **H3 (32c):** `Transcript: portable cabin sizes`

> SAMAN Portable builds portable cabins you can move when the work moves. Each unit is factory-built, craned onto your prepared base, and relocated when the site changes. The 10 × 10 ft cabin covers 100 sq ft for one person and lifts by pickup. The 20 × 8 ft gives 160 sq ft and is narrow enough to travel without a permit. The 20 × 10 ft offers 200 sq ft for a small team, ready to relocate. The 20 × 12 ft adds 240 sq ft with a second zone that survives the lift. The 20 × 20 ft gives 400 sq ft as two modules that separate and rejoin at the next site. The 30 × 10 ft covers 300 sq ft, partitioned and engineered to be lifted. The 40 × 8 ft gives 320 sq ft in rows that re-form at the next location. The 40 × 10 ft offers 400 sq ft as a headquarters that outlives a single project. The 40 × 12 ft, at 480 sq ft, is our biggest single-lift unit. Lifting lugs are designed against the completed unit weight, and a lifting drawing ships with every cabin — handle the unit only by that drawing. Cabins serve construction sites, infrastructure fronts, rental fleets and temporary offices that move between locations. All units carry a 5-year structural warranty and a 1-year finishing warranty, extendable to 2 years on request, and are installed by our own crew from Bengaluru or Greater Noida.

## 6 · THE EXISTING SELF-HOSTED VIDEO

`saman-porta-cabin-9-sizes-product-overview.mp4` and its caption and poster files **stay in the repository — delete nothing.** The MP4 simply stops being the page's video source. Two sources for one video adds maintenance and splits nothing useful.

## 7 · OUT OF SCOPE

Captions are uploaded to YouTube by SAMAN, not by this event. No caption `<track>` element is added to the facade. No other page, no other video, no sitemap or routing change.

## 8 · ACCEPTANCE

1. Porta cabin hub plays `SJml1DgMY3I`; portable cabin hub plays `_0pSsmEN1eo`. No other video on either page.
2. **Zero iframes in the initial DOM on both pages.** Prove with a fetched-HTML grep.
3. VideoObject present on exactly two URLs site-wide, with every required property populated from YouTube-extracted values. Zero estimated values.
4. Google Rich Results Test passes for Video on both pages — paste the result.
5. Transcript present, verbatim, collapsible.
6. Facade poster is same-origin; zero requests to `i.ytimg.com` or `youtube.com` before interaction.
7. L3 zones unchanged on both pages: URL, title, H1, meta, first 100 words — 0 changes.
8. CWV no-regress vs lockfile on both pages.
9. Visual regression 360/768/1024/1440 — layout unchanged except the added transcript block.
10. TypeScript clean, production build clean.

Preview, report to Fable 5, **STOP. Do not merge.**
