# L18 — VIDEO DOCTRINE + PDF SITE-WIDE · Fable 5 · 26 Jul 2026
### SAMAN's two videos, and the correction that makes them worth doing

**SAMAN is right that this is SEO-effective, but not for the reason most people assume — and the site is currently getting none of the benefit. I checked both pages live. Neither carries VideoObject structured data. A video embedded without that markup is invisible to Google: no video thumbnail in results, no video rich result, no eligibility for the Videos tab. Swapping the source without adding the schema would change nothing at all in search.**

---

## 1 · WHAT I FOUND LIVE (26 Jul)

| Page | Current state |
|---|---|
| `/product/porta-cabins` | Has a **click-to-play facade** with a same-origin poster, `porta-cabin-product-video-poster.webp`, labelled "Porta cabin product video — 9 standard sizes overview". **No VideoObject schema.** |
| `/product/portable-cabin` | **No video at all.** For this page SAMAN's request is an addition, not a replacement. |

The facade pattern already on the porta cabin hub is the correct engineering. Keep it. What is missing is the markup.

## 2 · THE ASSIGNMENT

| Video | Owning page | Action |
|---|---|---|
| `https://youtu.be/SJml1DgMY3I` | `/product/porta-cabins` | Replace the current source behind the existing facade |
| `https://youtu.be/_0pSsmEN1eo` | `/product/portable-cabin` | Add, using the same facade component |

## 3 · ONE VIDEO = ONE PAGE (new law, same logic as One Page = One Keyword)

**VideoObject schema for a given video may exist on exactly one URL.** If the same video is marked up on a hub and on its subpages, Google must choose which page owns it — and that is video cannibalisation, identical in mechanism to the keyword problem we have spent this whole programme removing.

- The porta cabin video is marked up **only on `/product/porta-cabins`**.
- The portable cabin video is marked up **only on `/product/portable-cabin`**.
- Subpages may **not** carry VideoObject for the same video. If a subpage benefits from the video visually, it may embed the facade with **no structured data**, or better, link to the hub with a descriptive anchor.
- Cross-cluster: the porta cabin video never appears on a Portable Cabin page and vice versa. That pair is the highest-risk boundary on the site.

## 4 · WHAT ACTUALLY EARNS THE RANKING — the VideoObject block

Required on the owning page, one per video:

`name` · `description` · `thumbnailUrl` · `uploadDate` · `duration` in ISO 8601 · `embedUrl` pointing at the YouTube embed · `publisher` set to the SAMAN Organization entity · `contentUrl` omitted (the asset is on YouTube, not our origin).

**Codex extracts the real title, thumbnail, publish date and duration from YouTube itself** — `https://www.youtube.com/oembed?url=<watch-url>&format=json` gives title and thumbnail; duration and upload date come from the watch page. **Any value that cannot be read → STOP to Fable 5. No estimated durations, no invented dates.** A wrong `duration` or `uploadDate` invalidates the rich result and can trigger a structured-data manual action.

`description` is written by Fable 5, not lifted from the YouTube description, so it matches the page's intent rather than the channel's.

## 5 · PERFORMANCE — L11 is not negotiable here

A standard YouTube iframe pulls roughly half a megabyte of third-party JavaScript on page load and is one of the most common causes of a CWV regression on an otherwise fast site. We just spent an event cutting hero render delay by 92%; we are not giving it back to an embed.

- **Facade only.** No iframe in the initial DOM. The iframe is created on click.
- Use **`youtube-nocookie.com`** for the embed URL.
- **Keep the existing same-origin poster** `porta-cabin-product-video-poster.webp` as the facade image rather than pulling YouTube's thumbnail — it is already optimised, already cached, and avoids a third-party request before interaction. Produce an equivalent poster for the portable cabin video.
- `preconnect` to the YouTube origins fires on hover or focus, never on load.
- Facade image is lazy-loaded and never the LCP element.
- **Acceptance: CWV no-regress against the lockfile on both pages, measured warm, same session, peer band ±10%.**

## 6 · THE EXISTING SELF-HOSTED VIDEO

`saman-porta-cabin-9-sizes-product-overview.mp4` and its caption and poster files stay in the repository — nothing is deleted. The MP4 simply stops being the page's video source. Two sources for one video adds maintenance and splits nothing useful.

**The captions are the part not to lose.** SAMAN already has `saman-porta-cabin-9-sizes-product-overview-captions.vtt` and `SAMAN-Portable-Cabin-captions-EN.srt/.vtt`. **Upload these as captions on the corresponding YouTube videos** — Google reads them, and an uncaptioned video is weaker in search and unusable for a large share of viewers who watch muted. A short on-page transcript beneath the facade is worth more than the embed itself, because it is indexable text on our own domain.

## 7 · PDF SPECIFICATION DOWNLOAD — CONFIRMED SITE-WIDE

SAMAN's instruction stands and is already law under L16-5: **every product page carries its own PDF specification download in the first section.** Not shared, not per cluster — one per page, script-generated from the specification workbook and the approved price matrix so it can never drift from the page it sits on.

Rollout order: C-01 Porta Cabins (in the current event, 9 PDFs) → C-02 Portable Cabin → Container Offices → Portable Office → the remaining clusters as each is rebuilt. Existing templates: `saman-porta-cabin-specifications.pdf` and `saman-low-cost-porta-cabin-specifications.pdf`.

## 8 · HONEST ASSESSMENT OF THE SEO VALUE

SAMAN asked whether this is SEO-effective. Precisely:

**The video, with schema, is a genuine CTR lever.** A video thumbnail beside a result lifts click-through meaningfully, and video rich results are still comparatively easy to win in this category because almost no Indian prefab competitor markes up video correctly. Porta cabin currently converts 8,992 impressions into 94 clicks — one percent. This attacks that number directly.

**The video, without schema, is worth close to nothing in search.** It helps dwell time and it helps a buyer decide, both of which matter — but it earns no SERP feature. That gap is the whole reason this ticket exists.

**The PDF is a conversion and trust lever more than a ranking one.** It will not move positions by itself. It does three real things: it answers specification intent that competitors leave unanswered, it gives a buyer something to take to a decision-maker, and the download is a strong enquiry signal we can measure. Treat it as E-E-A-T and conversion work, not as a ranking tactic — and it is worth doing on that basis alone.

**Neither displaces the biggest lever available, which remains reviews.** Your Google Business Profile holds 607 reviews at 4.9 while product pages carry review counts in the single digits. Stars and price in the snippet beat a video thumbnail. Video is the second-best CTR lever; reviews are the first.

## 9 · SCOPE AND SEQUENCING

**This is its own event, not an addition to a running one.** The C-01 content build is already specified and in flight, and adding scope to a running event is how defects get in. The portable cabin page is C-02 in any case, a different cluster.

Run it after the C-01 content event previews clean. Build ticket follows separately; it touches only the two hub pages, the facade component and two JSON-LD blocks.
