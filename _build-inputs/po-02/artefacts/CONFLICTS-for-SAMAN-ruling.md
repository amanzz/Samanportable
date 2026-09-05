# PO-02 — input conflicts for SAMAN's ruling

Six points where the signed inputs disagree with the repository, the design lock or the
live site. None is improvised in the build: each is left in the state described below and
raised here, as the build prompt requires.

---

## 1. `verify_po02.py` gate B fails on `40×8`, which is site chrome, not this page

**Check:** `withdrawn size or claim absent: 40×8` → FAIL.

**Finding:** the string occurs **once** in the whole document, inside the site `<header>`
navigation:

```
src/components/Header.tsx:141
{ name: '40×8 Container Office', href: '/container-rent-services/40x8-container-office-rental', icon: Container },
```

It is a nav link to a container **rental** product, unrelated to this page's withdrawn
40×8 cabin size. Evidence that it is shared chrome:

| page | `40×8 Container Office` in header |
|---|---|
| this preview | 1 |
| `/product/porta-cabins` (the design lock itself) | 1 |
| `/product/portable-office/readymade-office-cabin` (untouched sibling) | 1 |

**This page's own content region is clean.** Counting between `</header>` and `<footer`:

```
40×8: 0    20×20: 0    40×12: 0    40x8: 0    20x20: 0    40x12: 0
```

**Why it is not fixed here:** removing it means editing `Header.tsx`, a shared component on
every route, and breaking the navigation of an unrelated rental page. Build prompt Step 10
forbids exactly that, and doing it would make this page diverge from the design lock it is
being measured against.

**Ruling needed:** confirm gate B is satisfied by the page content (it is), and that the
header nav is out of scope. If the rental nav entry is genuinely unwanted, it belongs in a
sitewide ticket.

---

## 2. Gate F (the redirect) cannot pass before deployment

**Check:** `saman-prefab-office 301 to this page (one hop)` → FAIL, `HTTP Error 403`.

The gate tests **production**, which this branch has not been deployed to — SAMAN deploys
after approving the preview. Two separate things are going on:

- The live URL still returns **200**, because the retirement is in this branch only.
- The verifier's own request was answered **403** by production's bot protection; a normal
  browser User-Agent gets 200.

**The redirect itself is implemented and proven** against the built preview:

```
$ curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}"  \
    http://127.0.0.1:3277/product/prefabricated-houses/saman-prefab-office
301 -> https://www.samanportable.com/product/portable-office/prefabricated-office-cabins

$ curl -s -o /dev/null -L -w "final: %{http_code} %{url_effective} (hops: %{num_redirects})" ...
final: 200 https://www.samanportable.com/product/portable-office/prefabricated-office-cabins (hops: 1)
```

Exactly one hop, 301, landing on the canonical URL. It also appears in
`.next/routes-manifest.json` as `301`. The predecessor `/product/saman-prefab-office` was
repointed at the same final keeper in the same change so the chain never grows to two hops.

**Ruling needed:** none — this gate should be re-run after deployment.

---

## 3. `ymal.intro` says "Eight more" above three tiles

`copy.ymal.intro` is:

> "Eight more office configurations on the same portable cabin platform."

Only **three** tiles can render. Of the nine URLs in `explore_range.order`, six return 404
today (the build prompt anticipated four). Measured live, 5 Sep 2026:

| URL | status |
|---|---|
| `/product/portable-office` | 200 |
| `/product/portable-office/readymade-office-cabin` | 200 |
| `/product/portable-office/small-office-cabin` | 200 |
| `/product/portable-office/portable-weighbridge-office` | 404 |
| `/product/portable-office/executive-portable-office` | 404 |
| `/product/portable-office/portable-mobile-laboratory` | 404 |
| `/product/portable-office/construction-site-cabin` | 404 |
| `/product/portable-office/portable-control-room` | 404 |
| `/product/portable-office/portable-conference-cabin` | 404 |

**What was built:** the pack string is rendered verbatim, as the design lock requires copy to
come from the pack, and because **SOC-01 ships the identical pattern today** — its pack says
"Eight more portable office configurations on the same cabin platform." over the same three
tiles, and that page is approved and merged (PR #185).

**Ruling needed:** this is a factual overstatement on three pages now (SOC-01, and this one).
Either the four missing sibling pages get built, or the line should become a count-free
sentence across the cluster. This is a copy decision, so it is not made here.

---

## 4. The asset map's eager-loading rule contradicts the design lock

`asset_map.rules.loading` asks for:

> "the six images of the default size 20x10 eager with fetchpriority=high on slide 1 only;
> the other thirty lazy … preload link for slide 1 of 20x10 carrying the same imagesrcset"

The locked shared hero renders **one** eager product image, not six, and the other slides are
not in the served DOM at all — they are swapped client-side from props. Measured:

| page | product `<img>` | eager | lazy | `fetchpriority=high` | preload as=image |
|---|---|---|---|---|---|
| this preview | 14 | 1 | 13 | 2 | 2 |
| `/product/porta-cabins` (lock) | 37 | 1 | 36 | 2 | 2 |

The one eager image *is* slide 1 of the default 20×10 size, and it carries both
`fetchpriority="high"` and a matching `<link rel="preload" as="image">`. There is no
`imagesrcset` on the preload because the gallery images carry no `srcset`
(`optimizeLocalGalleryImages: false`, as on the lock) — so there is no srcset to mirror.

**What was built:** the shared component's behaviour, unchanged. Forcing six eager 100 KB
images would author a loading strategy the lock does not have and would regress LCP.

**Ruling needed:** confirm the design lock wins over the asset map on loading. (Recommended:
yes — it is both conformant and faster.)

---

## 5. `split_card.cta_target: "#sizes"` is not an anchor on this route

The pack's card CTA targets `#sizes`. That id exists only on the unrelated
`/product/eps-panel` and `/product/glass-wool-panel` routes. On this route the Section 3
explorer's id is `#porta-size-applications` (`PortaCabinVariantHero.tsx:491`).

**What was built:** `ctaHref: '#porta-size-applications'` — the Section 3 anchor the pack's
own wording describes ("Compare the six sizes"), and the same target PO-01 and SOC-01 use.
`#sizes` would have been a dead link.

---

## 6. The pack's third breadcrumb crumb differs from both approved siblings

`copy.meta.breadcrumb` is `["Home", "Products", "Portable Office Cabin", "Prefabricated Office Cabins"]`.

The rendered breadcrumb is `Home / Products / Portable Office / Prefabricated Office Cabins`.
Crumb 3 is produced by the shared `Breadcrumb` component from the category record
(`portable-office`), not per page. Both approved siblings' packs agree with the repo, and
only this pack differs:

| pack | crumb 3 |
|---|---|
| SOC-01 | `Portable Office` |
| PO-01 | `Portable Office` |
| **PO-02** | **`Portable Office Cabin`** |

**What was built:** the shared breadcrumb is left alone, so this page matches both siblings.
The pack's `Portable Office Cabin` *is* honoured where the template exposes a category label —
the hero's "Category" row and the footer's "See the full range" line both read
"Portable Office Cabin", from `categoryLabel`.

**Ruling needed:** if crumb 3 should read "Portable Office Cabin", that is a category-level
change affecting every page under `/product/portable-office`, and belongs in its own ticket.

---

## 7. The asset map points the Section 2 card at a GA board — overridden on instruction

**SAMAN instruction, 5 September 2026:** the Section 2 split card must show a realistic 16:9
render, not a drawing. This is the **second** time the correction has been needed — SOC-01
took it as commit `0c19817d`, "realistic exterior render in the Section 2 card".

The signed asset map asks for the drawing:

```json
"section2_card": {
  "src": "01-ga-boards/size-20x10/01-prefabricated-office-20x10-ga-board.png",
  "note": "native 16:9 3840x2160 GA board; downscale only, never crop"
}
```

It is 16:9 and approved, so it passes every automated gate — which is exactly why an agent
building strictly to the pack ships it. It still reads as a spec sheet in a marketing slot.

**What is built now:**

| | |
|---|---|
| source | `03-long-description-images/08-prefabricated-office-10x10-compact-exterior.png` |
| native size | **1920×1080 — already 16:9**, so downscaled to 1600×900 with **no crop at all** |
| output | `section2/prefabricated-office-cabins-section2-card.webp`, 94.8 KB |
| uniqueness | the long-description set is otherwise unused on this page, so it appears nowhere else |
| alt | written to the pack's style, describing only what the render shows — the pack's `alt_text.section2_card` describes the GA board and no longer applies |

The orphaned `...-20x10-ga-board-card.webp` is deleted. The 20×10 GA board itself is
untouched and still renders in Section 3, where a drawing belongs.

**One trade-off worth your eye:** the card copy names the **20×10**, but every 20×10 render in
the package is 1:1 and all six are already used in the gallery, so no unused 16:9 image of that
size exists. The 10×10 compact exterior was chosen because it shows precisely what the card
talks about — the vertical bolted-panel seams, the top-corner interface plates and the steel
skid — and because a single standalone module is a literal reading of the card's headline,
"One module today, a multi-bay office next year". The only other native-16:9 exterior is the
20×12 shallow-roof end elevation. Swapping to it is a one-line change in
`rightToExistEntries.tsx` (`imageSrc` plus the alt) if you prefer it.

The signed pack is **not** edited for this: `content/po-02/*` stays byte-identical to the
source and its `sha256_of_copy` still verifies.

---

## Also noted, no ruling needed

- **The retired `saman-prefab-office` page is still linked from the `prefabricated-houses`
  category description and from `categorySchemas.ts`.** Those links now point at a 301.
  They were deliberately not repointed: the anchor reads "our signature SAMAN office cabin"
  and is followed by "(₹2,25,000)" and a "20×20 ft" description — carrying that onto this
  page would publish a withdrawn size and a price that is not in this page's ladder. House
  precedent agrees: the three previously retired products
  (`prefabricated-portable-office-cabin`, `modular-portable-office-cabin`,
  `prefabricated-site-office`) are all still referenced in `categorySchemas.ts`. Build
  prompt Step 9 puts "everything else" in the sitewide redirect ticket.

- **The regenerated image-sitemap block lists one GA board, not six.** All six GA boards
  are in the served DOM (verified); the repo's own crawler
  (`scripts/collect-image-manifest.mjs`) recorded one. The block is that crawler's
  unmodified output, and every other product's entries were left byte-identical rather
  than committing a full sitemap regeneration, which is known to sweep in 28 unrelated
  CO-01 image entries.
