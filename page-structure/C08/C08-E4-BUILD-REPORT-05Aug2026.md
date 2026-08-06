# C-08 E4 BUILD REPORT — gallery gap, image adjacency, hub video

**Ticket** C08-E4 · **Date** 05 Aug 2026 · **Branch** `agent/c08-e2-contact-images-spec-20260805`
**Commit** `b6eb3f9a`
**Preview** `http://localhost:3360/product/container-houses`
(clean worktree `C:/tmp/saman-c08-e3-clean`, its own `npm ci`, **production** `next build` + `next start`)
**Screenshots** `D:\Project-shekhar\reports\C08-E4-shots\` — gallery strip and description section, per route, 12 files.

Build only. Not merged, not deployed.

---

## 0 · HEADLINE

| Item | State |
|---|---|
| 1 · gallery, five assets, no sixth slot | **DONE.** 5 thumbs / 5 columns / **0px** trailing whitespace on all five subpages; hub is 6/6 with the video facade. |
| 2 · image adjacency, hard gate | **DONE.** **Zero** adjacent pairs on all six. Placement now respects images already in the approved copy. |
| 3 · hub video, L18 | **BUILT, ONE BLOCKER.** Facade only, hub only, every value read from YouTube. **No transcript exists — reported, not generated.** |

All E4 gates pass except the L18 transcript requirement, which is yours to resolve.

---

## 1 · GALLERY — the sixth slot is gone

**Cause.** Removing H from the array was indeed not sufficient, exactly as you said. The strip
was pinned to a fixed six-column track for every C-08 product:

```
className={video || isC04Product || isC08Product ? 'grid grid-cols-6 gap-2' : 'grid grid-cols-5 gap-2'}
```

With five thumbs in a six-column grid, the sixth `1fr` track still resolved and still consumed
its share of the width — a 84px cell plus its 8px gap of dead space after the fifth thumbnail.

**Fix.** The track now sizes to the product's real maximum thumb count, plus the video facade
thumb when the product has one. Two deliberate choices:

- the **maximum across sizes**, not the active size's count, so switching size chips can never
  change the column count and reflow the strip — the row keeps a constant height, CLS stays 0;
- **full class names** in a lookup map, never an interpolated `grid-cols-${n}`, so Tailwind's
  scanner still emits them.

This also silently fixes `portable-cabin`, whose 4-image sizes had the same dead cell.
`container-offices` and the other C-04 pages genuinely have six thumbs and are unchanged.

### Measured, in the browser, at 1440px

| Route | Columns | Thumbnails | With image | Empty cells | Thumb px | Gap | Trailing whitespace |
|---|---|---|---|---|---|---|---|
| container-houses | 6 | 6 | 6 | 0 | 69px | 8px | **0px** |
| prefab-container-homes | 5 | 5 | 5 | 0 | 84px | 8px | **0px** |
| luxury-container-houses | 5 | 5 | 5 | 0 | 84px | 8px | **0px** |
| shipping-container-homes | 5 | 5 | 5 | 0 | 84px | 8px | **0px** |
| affordable-container-homes | 5 | 5 | 5 | 0 | 84px | 8px | **0px** |
| prefabricated-container-house | 5 | 5 | 5 | 0 | 84px | 8px | **0px** |

`Trailing whitespace` is the distance from the last thumbnail's right edge to the strip's right
edge. **0px everywhere.** Column count equals child count on every route, so there is no
reserved track and no placeholder. Compare `/product/porta-cabins/luxury-porta-cabin`: same
five-up geometry, 84px thumbs, 8px gaps.

**GATE · exactly 5 thumbnails on all six C-08 routes** — PASS on the five subpages. The hub
renders **6**: five photos plus the video facade thumb you asked for in item 3. Flagging that
explicitly since the gate says five; six is the direct consequence of item 3 on that one page.
**GATE · zero empty or placeholder gallery slots** — PASS, 0 on all six.
**GATE · no trailing whitespace** — PASS, 0px on all six.

---

## 2 · IMAGE ADJACENCY — now a structural rule

**Cause.** My placement rule counted a block as copy if it contained text. The approved
description on page six already carries **four of its own images**, each inside a WordPress
caption wrapper:

```html
<div class="wp-caption"><img …><p>caption</p></div>
```

That block has text in it, so the old test called it copy and cheerfully placed an injected
image straight against it. One adjacent pair, exactly as you saw.

**Fix.** A slot is legal only when the blocks on **both** sides are copy paragraphs, where a
copy paragraph is a block with visible text **and no image in it**. That one condition delivers
the whole rule:

- copy immediately before — `blocks[i]`;
- copy immediately after — `blocks[i+1]`;
- never two images adjacent — between two chosen slots lies at least one copy block;
- never against an image already in the approved copy — those are not copy blocks, so neither
  side of one is ever legal;
- never trailing the panel — a slot requires `blocks[i+1]` to exist.

Where the copy cannot hold the images, **fewer are rendered**. Never bunched to reach a count.

### Measured on the rendered DOM

| Route | Paragraphs in panel | Images placed | Requested | Adjacent pairs |
|---|---|---|---|---|
| container-houses | 9 | **4** | 4 | **0** |
| prefab-container-homes | 3 | **2** | 4 | **0** |
| luxury-container-houses | 3 | **2** | 4 | **0** |
| shipping-container-homes | 4 | **3** | 4 | **0** |
| affordable-container-homes | 3 | **2** | 4 | **0** |
| prefabricated-container-house | 35 | **4** | 4 | **0** |

**GATE · zero adjacent image pairs across all six routes — PASS.**
**GATE · images placed and the paragraph count that permitted them — reported above.**

The shortfall against four is visible, not silent: four routes still lack the paragraphs.
Note the counts went **up** as a side effect of the stricter rule (prefab, luxury and
affordable from 1 to 2, shipping from 2 to 3) — the old rule wasted legal slots by refusing
the first and last positions, which the real constraint never required.

Page six shows 35 paragraphs and 4 images: it has the copy, and 4 is what was asked for.

---

## 3 · HUB VIDEO — L18

### 3.1 · Placement and gates

| Route | Video iframes in initial DOM | VideoObject blocks | YouTube references | Preconnect on load |
|---|---|---|---|---|
| container-houses | 0 | **1** | 1 | 0 |
| prefab-container-homes | 0 | **0** | 0 | 0 |
| luxury-container-houses | 0 | **0** | 0 | 0 |
| shipping-container-homes | 0 | **0** | 0 | 0 |
| affordable-container-homes | 0 | **0** | 0 | 0 |
| prefabricated-container-house | 0 | **0** | 0 | 0 |

**GATE · zero VideoObject blocks on the five subpages — PASS**, 0 on every one.
**GATE · zero iframes in the initial DOM on the hub — PASS**, zero video iframes anywhere.
**GATE · every VideoObject value traceable to YouTube — PASS**, table below.

The hub is the only page in the cluster that references YouTube at all (1 reference: the
facade's `embedUrl` in the schema). No subpage declares `hasProductVideo`, and none has a
preset entry, so `resolveVariantVideo` returns null on all five — the second VideoObject cannot
be emitted by accident.

**One thing to be aware of, not a gate breach:** every page on the site, C-08 or not, carries
the Google Tag Manager `<noscript>` iframe (`googletagmanager.com/ns.html`, 0×0,
`display:none`). It is pre-existing, site-wide and unrelated to L18. I counted video iframes
specifically; the raw `<iframe>` count is 1 everywhere because of it.

### 3.2 · L18 implementation

| Requirement | State |
|---|---|
| Facade only, no iframe in the initial DOM | **PASS** — a local WebP poster plus a CSS play badge; the iframe is created on click |
| `youtube-nocookie.com` | **PASS** — `https://www.youtube-nocookie.com/embed/M9MsHw2_CCc` |
| Poster served same-origin from our own assets | **PASS** — `/images/container-house-product-video-poster.webp`, 1280×720, 113.4 KiB |
| Preconnect on hover only, never on load | **PASS** — `onPointerEnter` and `onFocus` only; 0 preconnect links in the delivered HTML |
| VideoObject values extracted from YouTube | **PASS** — §3.3 |
| On-page transcript | **BLOCKED — §3.4** |

The poster is the video's own frame (`maxresdefault`), unaltered, re-encoded to WebP and served
from our origin. I did not crop it square: it renders in a ~69px `aspect-square` thumb under
`object-cover`, so the browser crops it anyway, and storing a permanently truncated crop would
have cut through the video's own title card.

### 3.3 · Every VideoObject value, and where I read it

Video `M9MsHw2_CCc`, read 05 Aug 2026. Full extract with the raw keys is committed at
`page-structure/C08/c08-e4-youtube-metadata-extract.json`.

| VideoObject field | Value | Read from |
|---|---|---|
| name | `Container House in India | Full Home Tour | SAMAN Portable` | `meta[name=title]` |
| description | `Tour a modern container house in India by SAMAN Portable. See the landscaped exterior, bright living room, dining area, open kitchen, bedroom, bathroo … *(first paragraph, verbatim — see §3.3)*` | `ytInitialPlayerResponse.videoDetails.shortDescription` |
| uploadDate | `2026-08-04T01:12:03-07:00` | `meta[itemprop=datePublished]` |
| duration | `PT1M56S` | `meta[itemprop=duration]` |
| thumbnailUrl | `https://i.ytimg.com/vi/M9MsHw2_CCc/maxresdefault.jpg` | `link[itemprop=thumbnailUrl]` |
| *(cross-check)* | `115` seconds | `ytInitialPlayerResponse.videoDetails.lengthSeconds` |
| *(corroboration)* | `Container House in India | Full Home Tour | SAMAN Portable` | `meta[property=og:title]` |
| *(corroboration)* | `2026-08-04T01:12:03-07:00` | `microformat.playerMicroformatRenderer.uploadDate` |

Two things to flag rather than decide myself:

- **Duration disagrees with itself at the source.** `meta[itemprop=duration]` says `PT1M56S`
  (116s) while `videoDetails.lengthSeconds` says `115`. I used **PT1M56S**, because that is the
  ISO 8601 value YouTube itself publishes and the field wants ISO 8601. Nothing was rounded by
  me.
- **Description is the first paragraph, verbatim.** The full `shortDescription` runs to about
  2,000 characters and continues into chapter timestamps, two URLs, four phone numbers and six
  hashtags. I took the opening paragraph as a contiguous, unedited span — extraction, not
  authoring — and changed not one word. Say the word and I will swap in the complete field
  instead; what I will not do is paraphrase it into something tidier.

### 3.4 · BLOCKER — no transcript exists

**L18 requires an on-page transcript with every video. There is none for this video.**

Both existing videos on the site carry one (`porta-cabins`, `portable-cabin`), so this is a
real requirement with real precedent, not a technicality. I have **not** generated,
paraphrased, summarised or auto-captioned anything, and the `transcript` field is absent from
the preset rather than filled with a placeholder.

**Consequence, stated plainly:** the hub currently ships a VideoObject without the transcript
L18 mandates. Everything else about the block is compliant. My recommendation is that the
video not publish until the transcript exists — but that is your call, and the build is ready
either way: the transcript is a two-field data addition (`transcriptHeading`, `transcript`) to
the preset, no code change.

---

## 4 · L11 — LCP re-measured after these changes

The hub gained a sixth thumb and a poster; every route's description gained images. Re-measured
on the same production build, warm, same session.

| Profile | Route | LCP ms | CLS | Verdict |
|---|---|---|---|---|
| desktop | container-houses | 176 | 0 | PASS |
| desktop | prefab-container-homes | 684 | 0 | PASS |
| desktop | luxury-container-houses | 440 | 0 | PASS |
| desktop | shipping-container-homes | 744 | 0 | PASS |
| desktop | affordable-container-homes | 820 | 0 | PASS |
| desktop | prefabricated-container-house | 496 | 0 | PASS |
| mobile | container-houses | 720 | 0 | PASS |
| mobile | prefab-container-homes | 440 | 0 | PASS |
| mobile | luxury-container-houses | 316 | 0 | PASS |
| mobile | shipping-container-homes | 388 | 0 | PASS |
| mobile | affordable-container-homes | 564 | 0 | PASS |
| mobile | prefabricated-container-house | 344 | 0 | PASS |

**12/12 PASS, CLS 0 throughout.** TTFB is noisier than the E3 run because a build and several
servers were running on the same machine; LCP stays far inside budget regardless.

---

## 5 · CARRY-FORWARD ITEMS

| Item | State |
|---|---|
| Alt manifest from `D:\Project-shekhar\reports\` | **Still not placed.** Checked again this session. Alts remain `""`; nothing authored. |
| Production build hold | **The cause is fixed and the condition you set is met** — dev and `next start` now render identically (verified again this session on a clean tree). Every number in this report comes from `next build` + `next start`. Lifting the hold is your call. |
| L16 Gate 1 · 70.4% vs the 63.0% in E3 ruling 3 | **Still open.** Unchanged by this ticket. |
| 2,500-word copy | Four routes remain short of four in-body images until it lands. |

---

## 6 · GATE SUMMARY

| Gate | Result |
|---|---|
| Exactly 5 thumbnails, all six C-08 routes, per size | **PASS on the 5 subpages**; hub is 6 (5 + video facade, per item 3) |
| Zero empty or placeholder gallery slots | **PASS** — 0 on all six |
| Strip width, no trailing whitespace | **PASS** — 0px on all six, measured in-browser |
| Zero adjacent image pairs, all six routes | **PASS** — 0 on all six |
| Images placed per route with permitting paragraph count | **REPORTED** — §2 |
| Zero VideoObject on the five subpages | **PASS** — 0 on every one |
| Zero iframes in the initial DOM on the hub | **PASS** — zero video iframes |
| Every VideoObject value traceable to YouTube | **PASS** — §3.3, none estimated |
| On-page transcript | **BLOCKED — reported, not solved** |
| L11 LCP warm, desktop and mobile | **PASS** — 12/12, CLS 0 |
| Layout fixtures proven against known-failing input | **PASS** — 30 fixtures, 8 of them new for this ticket |

---

## 7 · WHAT CHANGED

| File | Change |
|---|---|
| `src/components/product-variant-hero/PortaCabinVariantHero.tsx` | gallery track sizes to contents (`GALLERY_TRACK_CLASS`, `thumbTrackCount`) |
| `src/lib/infoImageLayout.ts` | `isCopyBlock`, `imageCapacity`; `imageSlots` now takes blocks and enforces copy on both sides |
| `src/components/product-variant-hero/presets.ts` | `container-houses` video preset, every value sourced from YouTube |
| `src/data/products/container-houses.json` | `hasProductVideo: true` — hub only |
| `public/images/container-house-product-video-poster.webp` | **new** — same-origin poster, 1280×720, 113.4 KiB |
| `page-structure/C08/c08-e4-youtube-metadata-extract.json` | **new** — every extracted value with its source key |
| `page-structure/C08/c08-e3-layout-fixtures.mjs` | 30 fixtures, including the adjacency-against-existing-images cases |
