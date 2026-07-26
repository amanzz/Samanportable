# L16 — SPEC DIFFERENTIATION + PAGE RIGHT-TO-EXIST LAW · Fable 5 · 26 Jul 2026

**SAMAN asked three things: (1) can every page carry 30–40% unique technical specifications, (2) every page must have a PDF download button in the first section as the porta cabin cluster does, (3) every page must state why it exists in its cluster. Answer: yes to all three, the data supports it — but 14 of 51 subpages currently cannot meet the 30% floor and would ship as duplicates if built as-is. This law sets the measurement, the floor, the four legal differentiation axes, the PDF spec and the right-to-exist block. It binds every page built from this point and retro-applies to the 7 already-live rebuilt pages at next touch.**

---

## PART A — THE MEASUREMENT (what "unique" means, precisely)

Uniqueness is measured on the **30-row component table** that every product carries in `SAMAN_MASTER_64_Products_Detailed_Technical_Specs_9_Sizes_Report-with-price-PR.xlsx` — one row per component, value taken from the `Detail` column.

**Uniqueness is measured against the page's OWN HUB, not against the site.** A subpage competing for rankings competes with its hub and its cluster siblings, never with a PEB page. Measuring site-wide flatters the numbers and misses the actual cannibalisation risk.

### The 30 rows split three ways (measured across all 64 products)

| Class | Rows | Which | Rule |
|---|---|---|---|
| **HARD-COMMON** | 6 | Welding & fabrication · Fasteners & sealing · Grills / mosquito mesh · Electrical wiring · Electrical protection · Warranty | Byte-identical on every page, forever. These are platform and legal facts. Divergence here is a defect. |
| **NEAR-COMMON** | 3 | Lifting / handling · Painting / coating · Quality checks | Seven approved wordings exist. Use the one that matches the product's real coating/QC class. Never invent a new one. |
| **DIFFERENTIABLE** | 21 | Bottom frame · Bottom stiffeners · Floor frame · Top frame · Roof stiffeners · Corner posts / walls · Exterior walls · Roof · Interior walls · Ceiling · Floor base · Floor finish · Wall insulation · Roof insulation · Decorative / external finish · Main door · Windows · Electrical fittings · Ventilation / AC · Plumbing / sanitary · Layout / configuration | May and should differ where the product genuinely differs. |

**Structural ceiling = 21/30 = 70% unique.** SAMAN's 30–40% target sits comfortably inside it.

**CORRECTION I OWE.** I earlier quoted "73% unique available" from the workbook's `Common?` Yes/No column. That column is unreliable — `Grills / mosquito mesh` is marked `No` (variable) yet carries one identical value on all 64 products, and three rows marked `Yes` carry seven variants. **The `Common?` column is now advisory only. The measured distinct-value count above governs.**

---

## PART B — THE FLOOR AND THE CEILING (L16-1)

- **Floor: ≥ 30% of the 30 rows must differ from the page's own hub** (≥ 9 rows). Below this a page is a duplicate and may not be built.
- **Target band: 33–50%** (10–15 rows). This is where the already-good pages sit.
- **Ceiling: ≤ 70%** (21 rows). Above this the page is claiming to be a different product and belongs in its own cluster, not as a subpage.
- **Hub pages are exempt** — a hub is the reference, it has nothing to differ from.
- Every differing row must be **true**. Differentiation is achieved by assigning the product its real specification, never by rewording the same specification. Synonym-swapping to hit a percentage is a fabrication and an L15 defect of the same severity as a wrong price.

### Measured status of all 51 live subpages (vs own hub)

**Median 43%. Passing: 37. Failing: 14.**

| Cluster | Passing | Failing (below 30%) |
|---|---|---|
| Porta Cabins | 12 of 13 (30–47%) | Buy Porta Cabins **0%** |
| Portable Toilet | 6 of 6 (all 80%) | — |
| Container Cafe | 4 of 5 (47–70%) | Container Coffee Shop **0%** |
| Container Offices | 3 of 3 (43–53%) | — |
| Industrial Sheds | 3 of 3 (all 70%) | — |
| Labour Colony | 3 of 3 (all 70%) | — |
| Pre-Engineered Buildings | 3 of 3 (all 70%) | — |
| Portable Cabin | 2 of 2 (43%, 47%) | — |
| Prefab Buildings | 1 of 1 (70%) | — |
| **Portable Office** | **0 of 4** | Readymade Office Cabin · Modern Office Cabin · Prefabricated Office Cabins · Portable Office Container — **all 3%** |
| **Container Houses** | **0 of 4** | Prefab Container Homes · Luxury Container Houses · Shipping Container Homes · Affordable Container Homes — **all 3%** |
| **Prefabricated Houses** | **0 of 3** | Prefabricated Bunkhouse · Porta Cabin House · SAMAN Prefab Office — **all 3%** |
| Security Cabins | 0 of 1 | Readymade Security Cabin **3%** |

**This is a build-blocker, and it lands exactly on the next cluster in the queue.** Portable Office's five pages currently carry one identical spec table — building them as-is manufactures the duplicate-content problem PROJECT SHIKHAR exists to remove. The workbook maps all five to `technical Porta Cabin` while giving each a *different price source*. Same for Container Houses, all five mapped to `technical Container Offices`.

---

## PART C — THE FOUR LEGAL DIFFERENTIATION AXES (L16-2)

A page may only differ from its hub along these. Nothing else is admissible.

1. **Thickness ladder** — the workbook's `Thickness Level` field (Lower · Common Standard · Higher Standard · Heavy · Higher Custom · Premium Custom). Drives frame sections, sheet gauges, insulation. This is the axis that produces the honest 33% on Low Cost vs Luxury Porta Cabin.
2. **Material grade** — the `Material Type` field (Standard · Custom · Custom Decorative). Drives lining, ceiling, floor finish, façade, doors, windows.
3. **Fit-out and layout** — the `Layout / configuration` row plus electrical fittings, ventilation and plumbing. This is the axis for with-toilet, shop, café, dormitory and multi-zone office variants.
4. **Supply model** — factory-standard fixed BOM (ready-dispatch, no customisation) vs made-to-order to approved drawing. Real, already established by the Refund & Return Policy's standard-vs-custom split, and it legitimately changes layout, finish, opening schedule and lead time rows.

**THE PRICE-SOURCE RULE (new, and it fixes most of the failures):** if a page's price is derived from a different source product than its hub, its specification **must** follow that same source product. A page cannot cost more and be specified identically — that is a commercial contradiction as well as a duplicate. Applying this alone clears three of the four Portable Office failures.

### Proposed assignments for the 14 failing pages

Where the axis is derivable from the workbook or an existing SAMAN ruling, I have assigned it. **Bold items need one line from SAMAN.**

**Portable Office** (price-source rule applies; all four resolve without new facts)
| Page | Spec source | Axis | Resulting divergence |
|---|---|---|---|
| Modern Office Cabin | Luxury Porta Cabin | material grade + thickness | 33% ✓ |
| Prefabricated Office Cabins | Prefabricated Porta Cabin | thickness | 30% ✓ |
| Portable Office Container | Porta Cabin Office | thickness + layout | 37% ✓ |
| Readymade Office Cabin | Buy Porta Cabins + supply model | **supply model — fixed factory BOM, ready dispatch, no drawing customisation** | needs the axis-4 row set written; ~30% |

**Container Houses** (axis follows the price ladder already ruled — Container Offices +15%, luxury +3%, affordable −3%)
| Page | Axis | Needs |
|---|---|---|
| Prefab Container Homes | hub-equivalent, factory-built modules | **Confirm this is the cluster's reference spec** |
| Luxury Container Houses | material grade — premium lining, glazing, resilient flooring, façade | matches +3% price |
| Affordable Container Homes | thickness — lower gauge, economy lining and finish | matches −3% price |
| Shipping Container Homes | **is this a repurposed ISO container shell, or a new-build steel module styled as one?** If repurposed, the frame rows genuinely differ and this hits 50%+. If new-build, it has no axis and should be a redirect candidate. | **SAMAN ruling — one line** |

**Prefabricated Houses** (axis 3, layout and services)
| Page | Axis |
|---|---|
| Prefabricated Bunkhouse | multi-bed dormitory layout, higher ventilation and lighting density, wet-area interface |
| Porta Cabin House | single-module dwelling — kitchenette and sanitary provision, domestic finish |
| SAMAN Prefab Office | office fit-out — data/power points, partitioning, AC provision |

**Security Cabins**
| Page | Axis |
|---|---|
| Readymade Security Cabin | supply model — fixed BOM small cabin, ready dispatch, standard glazing and door schedule |

**The two 0% pages — EXEMPT CLASS, separate ruling**
`Buy Porta Cabins` and `Container Coffee Shop` are not specification variants. They are the *same physical product* addressed to a different intent (transactional, and a use-case). They are **exempt from the 30% floor** and instead governed by L16-3:
> An exempt-class page must NOT reproduce the hub's specification table at all. It carries a short summary block (≤ 6 rows, the buyer-facing ones only) plus a prominent link to the hub's full specification, and earns its existence entirely on a different content axis — price list and buying process for `Buy Porta Cabins`, the coffee-shop operating fit-out for `Container Coffee Shop`.
> If an exempt page cannot be written to that standard, it is a redirect candidate, not a page.

---

## PART D — THE RIGHT-TO-EXIST BLOCK (L16-4) — new mandatory section on every page

SAMAN's third requirement. Every hub and every subpage carries one block, placed **immediately after the first section (below the price/CTA band, above the specification table)**.

**Purpose:** it tells a buyer in four sentences why this page and not its sibling, and it tells Google that this URL owns a distinct intent. It is the single cheapest anti-cannibalisation device we have, and it is currently on zero pages.

### Hard format
- **Heading:** `Why choose the [Product Name]` — H2, **30–58 characters**. Never the page's primary keyword in a different case; never a question.
- **Body:** exactly **three sentences**, **340–430 characters** total including spaces.
  - Sentence 1 — what this product is, in the cluster's terms.
  - Sentence 2 — **the specific difference**, naming at least two real specification values from the differentiable rows (e.g. "1.25–1.6 mm exterior sheet and 12 mm laminated lining"). This sentence is what makes the block non-duplicative.
  - Sentence 3 — who it is for and when to choose it over the sibling, **naming the sibling and linking to it**.
- **Comparison line:** one sentence, **90–150 characters**, of the form `Choosing between models? Compare with [sibling A] and [sibling B].` with both as contextual links inside the cluster.
- **Uniqueness gate:** no sentence in any right-to-exist block may share a 7-word sequence with any other page's block, site-wide. Codex verifies mechanically before merge.
- **Hub variant:** the hub's block names the cluster's decision axis instead of a sibling — "the range splits by thickness and fit-out; the pages below cover each" — and links to all cluster members exactly once.

Copy for these blocks is written by Fable 5, per cluster, and delivered in the same drop as the §H Explorer copy. **No page ships without one from this point forward.**

---

## PART E — PDF SPECIFICATION DOWNLOAD (L16-5) — first section, every page

Replicating the porta cabin cluster pattern, now mandatory site-wide.

**Placement:** first section, in the CTA row beside the primary enquiry button — secondary/outline style, never competing visually with the enquiry CTA. Design-frozen pages keep their existing button styling.

**Button label:** `Download Specification PDF` (fixed, 26 characters, no variants). Sub-label if the design has room: `[Product Name] · 9 sizes · PDF`.

**The file:**
- Path: `/specs/[url-slug]-technical-specification.pdf` — one PDF per page, never a shared cluster PDF. A shared PDF re-introduces the duplication we just removed.
- Contents, in order: SAMAN letterhead with the canonical fact block (L15 §1–§4) · product name and canonical URL · the **page's own 30-row specification table**, the differing rows visually marked · the page's own price ladder from ONE-MASTER (ex-GST and incl-GST, GST 18%, "base specification price — customisations quoted separately") · warranty sentence verbatim from L15 §6 · delivery and quotation turnaround from L15 §5 · certifications from L15 §3 · the three contact routes · generation date.
- Generated from ONE-MASTER + the specs workbook by script, never hand-authored. Regenerating is part of every propagation event, so a PDF can never drift from the page.
- Max 400 KB. Not linked from the sitemap. `rel="nofollow"` not required; PDFs indexing on their own is acceptable and adds a second surface.

**Tracking:** the download is an enquiry-intent signal. Fire the existing analytics event with the product slug so we can rank pages by download-to-enquiry ratio at the 28-day checkpoint.

**Gate:** a page whose PDF is missing, whose PDF prices differ by even ₹1 from the page, or whose PDF is shared with a sibling, fails acceptance.

---

## PART F — HARVESTING THE REDIRECTED PAGES (L16-6)

SAMAN is right that the retired pages hold usable specification detail. The rule that keeps it safe:

1. Specification content from a retired page may be transplanted **only into that page's redirect target**, L4-verbatim, and only rows that are true for the target product.
2. It may **never** be split across two live pages — that recreates the duplication under new URLs.
3. Every harvested row is checked against the specs workbook before it goes live. Where they conflict, **the workbook wins** and the conflict is reported to Fable 5 as a truth defect.
4. Harvesting is a Codex research task, output is a per-target row list to me, and I rule on inclusion. Codex never merges harvested copy directly.

---

## PART G — ACCEPTANCE (added to every build ticket from now)

- Spec divergence vs own hub ≥ 30% and ≤ 70%, computed on the 30-row table and printed in the proof pack as `n/30 = x%`. Exempt-class pages instead prove ≤ 6 summary rows plus hub link.
- All 6 HARD-COMMON rows byte-identical to the hub. NEAR-COMMON rows drawn from the 7 approved wordings only.
- Right-to-exist block present, within character bands, three sentences, sibling named and linked, no 7-word overlap with any other block site-wide.
- `Download Specification PDF` button present in the first section; PDF exists at the canonical path, is page-specific, and its prices and warranty match the page byte-for-byte.
- No new specification value appears anywhere that is not traceable to the specs workbook or a written SAMAN ruling.

---

## WHAT I NEED FROM SAMAN (three lines, unblocks the whole queue)

1. **Shipping Container Homes** — repurposed ISO container shell, or new-build steel module? (Determines whether it has a real axis or becomes a redirect.)
2. **Prefab Container Homes** — confirm it carries the Container Houses reference specification (site's #1 page, 4,916 clicks, L3-STRICT — I will not touch its title, H1, meta or opener either way).
3. **MS Porta Cabin vs Steel Porta Cabin** — still open from this morning. Identical prices at all nine sizes and identical specs. Same product under two names: keep both with a real axis, or redirect one into the other?

Once these land, Portable Office (5 pages), Container Houses (5), Prefabricated Houses (4) and Security Cabins (2) are all clear to build with genuine differentiation, and the answer to SAMAN's question is a measured yes rather than an intention.
