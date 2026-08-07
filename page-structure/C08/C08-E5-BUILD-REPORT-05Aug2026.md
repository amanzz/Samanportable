# C-08 E5 BUILD REPORT — hub copy (blocked), H1, §H, gate amendment, video

**Ticket** C08-E5 · **Date** 05 Aug 2026 · **Branch** `agent/c08-e2-contact-images-spec-20260805`
**Commit** `6e2a5960`
**Preview** `http://localhost:3370/product/container-houses`
(clean worktree `C:/tmp/saman-c08-e3-clean`, own `npm ci`, **production** `next build` + `next start`)

Build only. Not merged, not deployed.

---

## 0 · HEADLINE

| Item | State |
|---|---|
| **Hub copy, C08-COPY-01, verbatim** | **BLOCKED — the file is not in `D:\Project-shekhar\reports\`.** Nothing implemented, nothing authored. |
| 1 · one H1 per page | **ALREADY TRUE on all six.** No second H1 exists on this branch. Evidence below. Now a standing gate. |
| 2 · §H for page six | **BLOCKED — needs 44 authored strings.** The H asset is already bound to the slot; only the copy is missing. |
| 3 · amend the five-thumbnail gate | **DONE.** |
| 4 · video: build, hold publish | **DONE.** Built, held, recorded. |
| 5 · full YouTube description | **DONE.** 2,371 characters, verified byte-identical. |

---

## 1 · HUB COPY — the file is not there

`D:\Project-shekhar\reports\C08-COPY-01-container-houses-hub-05Aug2026.md` does not exist. I
checked the directory this session; the only C-08 files there are my own E3 and E4 reports and
the E4 screenshot folder.

**No copy was implemented and none was written.** Per L4 and the standing zero-invention rule I
did not draft, paraphrase or place a single sentence.

### Rendered word count as it stands, per L23

Reported so you can see the gap the copy has to close. Measured on the rendered production DOM.

| Measure | Words |
|---|---|
| Description panel, rendered text | 130 |
| Page-specific headings (H1/H2/H3, 15 of them) | 97 |
| **L23 basis — panel + headings** | **227** |
| Whole page minus nav/header/footer | 2,299 |
| Target | 2,500 |
| **Shortfall on the L23 basis** | **2,273** |

The 2,299 figure is not the L23 number and should not be read as one: it sweeps in the
cross-sell rails, the certifications block, the reviews furniture and the size-explorer copy —
components, not this page's body. The honest figure is **227 rendered words**, and the page is
**2,273 short**. It is under 2,500, so per your instruction: **reported, and stopped. Nothing
padded.**

---

## 2 · ONE H1 PER PAGE — already true, with evidence

Measured on all six rendered routes:

| Route | `<h1>` count | H1 text | `<h1>` inside the description panel |
|---|---|---|---|
| container-houses | 1 | Container Houses | 0 |
| prefab-container-homes | 1 | Prefab Container Homes | 0 |
| luxury-container-houses | 1 | Luxury Container Houses | 0 |
| shipping-container-homes | 1 | Shipping Container Homes | 0 |
| affordable-container-homes | 1 | Affordable Container Homes | 0 |
| prefabricated-container-house | 1 | Prefabricated Container House | 0 |

In every case the single H1 **is** the buy-box product name, and every description heading is
already H2 — which is what you asked for.

**On the reported second H1 on page six:** it is not present on this branch, and it was not
present before my E3 work either. I still had the pre-E3 render of that route captured from
this session's first dev fetch — before page six had variant data and while it was still on the
generic layout — and it shows **one** H1, `Prefabricated Container House`. Neither its
WordPress source description nor any of the other five contains an `<h1>` at all.

So there was nothing to demote. **I did not add `prefabricated-container-house` to
`PRODUCT_DESCRIPTION_H1_DEMOTION_SLUGS`**, because a demotion entry for a page with no H1 in
its description is dead config that would read like a fix and do nothing.

What I did instead: the one-H1 rule is now a **standing gate** in
`page-structure/C08/c08-gate-verification.py`, checking both "exactly one `<h1>` per route" and
"zero `<h1>` inside the description panel". It fails loudly if either ever regresses.

If you are seeing two H1s, it will be on the deployed page rather than this branch — say the
word and I will check the live URL directly.

---

## 3 · SECTION H FOR PAGE SIX — wiring done, copy missing

**The wiring you asked for is already in place.** Since E3 ruling 1, page six is in
`C08_PRODUCT_SLUGS`, so:

- `imagesForVariant` slices its six-image manifest to five for the gallery — verified, the
  gallery renders 5 and `I03 bedroom-doorway` is confirmed absent from it;
- `c08ExplorerImage = variantImages[5]` binds that same I03 asset to the Section H panel.

The section does not render because `APPLICATIONS_DATASETS` has no entry for the slug, and by
design it renders **nothing** rather than borrow another product's copy.

**What is missing is copy, and it is 44 authored strings:**

| Piece | Count |
|---|---|
| Section H2 | 1 |
| Guidance line | 1 |
| Per size (6 sizes): panel H2, intro paragraph (~90 words), H3, 4 application lines | 6 × 7 = 42 |
| **Total** | **44** |

That is page content. I have not written any of it. Drop a §H copy pack for
`prefabricated-container-house` and it becomes one data file — no code change, and the I03
image binds itself.

---

## 4 · GATE AMENDED

The five-thumbnail gate now governs **the five subpages**. The hub's sixth cell is the video
facade and is expected, not a defect. Encoded in the verification script:

```python
# E5 item 3, gate amended: the five-thumbnail rule governs the five SUBPAGES.
# The hub carries a sixth cell because of the video facade, which is correct
# and intended, so its expectation is six.
expected_thumbs = 6 if slug == 'container-houses' else 5
```

Re-verified on the production build: hub 6 columns / 6 children / 0 empty cells; all five
subpages 5 / 5 / 0.

---

## 5 · VIDEO — built, publish held

Recorded in `page-structure/C08/c08-e5-video-publish-hold.json`:

- **status** `BUILT — PUBLISH HELD`
- **reason** L18 requires an on-page transcript; none exists and SAMAN has not ruled. No
  transcript was generated, paraphrased, summarised or auto-captioned.
- **to release** add `transcriptHeading` and `transcript` to the `container-houses` preset.
  Data-only, no code change.
- **visible on preview: yes** (so you can review it, and consistent with item 3's ruling that
  the hub's six-up strip is correct). **deploy blocked: yes.**

The VideoObject as actually shipped on the hub, read back from the rendered page:

| Field | Value |
|---|---|
| name | Container House in India \| Full Home Tour \| SAMAN Portable |
| uploadDate | 2026-08-04T01:12:03-07:00 |
| duration | PT1M56S |
| thumbnailUrl | https://i.ytimg.com/vi/M9MsHw2_CCc/maxresdefault.jpg |
| embedUrl | https://www.youtube-nocookie.com/embed/M9MsHw2_CCc |
| description | 2,371 chars — **byte-identical** to YouTube's `shortDescription` |
| transcript | **absent** — the blocker |

Zero video iframes in the initial DOM, zero VideoObject on the five subpages, zero preconnect
on load.

---

## 6 · FULL YOUTUBE DESCRIPTION — item 5

`schemaDescription` is now YouTube's **complete** `shortDescription` field: 2,371 characters
across 39 lines, including the chapter markers, both contact blocks, the two URLs and the six
hashtags.

It was written into the preset **from the committed extract, not retyped**, then decoded back
out of `presets.ts` and compared:

```
stored length : 2371
served length : 2371
BYTE-IDENTICAL: True
```

Truth checks on the imported text: both approved numbers present (+91 88616 22859,
+91 87960 39938); the banned +91 62009 09435 **absent**.

---

## 7 · GATE SUMMARY

| Gate | Result |
|---|---|
| Hub copy implemented verbatim | **BLOCKED** — file not placed |
| Rendered word count reported, no padding | **REPORTED — 227, target 2,500, short by 2,273** |
| Exactly one `<h1>` on each of the six routes | **PASS — 1 on all six** |
| Zero `<h1>` in any description panel | **PASS — 0 on all six** |
| §H built for page six and H asset wired | **WIRING DONE, COPY BLOCKED** (44 strings) |
| Five thumbnails on the five subpages | **PASS — 5/5/0 empty on each** |
| Hub six-up correct and gate amended | **DONE** |
| Zero video iframes in the initial DOM | **PASS** |
| Zero VideoObject on the five subpages | **PASS** |
| VideoObject description = full YouTube field | **PASS — byte-identical, 2,371 chars** |
| Video publish held pending transcript | **HELD and recorded** |
| Zero adjacent in-body image pairs | **PASS — 0 on all six** |

---

## 8 · WHAT IS STILL WAITING ON YOU

1. **`C08-COPY-01-container-houses-hub-05Aug2026.md`** — not placed. Pages 2–6 will need theirs too.
2. **`C08-PREFAB-CONTAINER-HOUSE-ALT-MANIFEST-60-05Aug2026.xlsx`** — still not placed. Checked
   again this session; page six's 60 alts remain empty.
3. **§H copy pack for page six** — 44 strings.
4. **Video transcript** — publish held until it exists.
5. **L16 Gate 1** — 70.4% measured against the 63.0% in E3 ruling 3, still open and untouched.
