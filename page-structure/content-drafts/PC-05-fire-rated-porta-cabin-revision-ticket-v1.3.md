# PC-05 Fire-Rated Porta Cabin — Revision Ticket v1.3

**Issued:** 14 August 2026 · **Against:** preview at commit `81d94b38` on `feature/pc05-fire-rated-porta-cabin`
**Supersedes:** nothing. Base ticket v1 and rulings v1.2 stand. This adds the SAMAN revision and answers all five GAPs.
**Copy source is now `PC-05-fire-rated-porta-cabin-copy-pack-v3.md`** in `_build-inputs\`. v2 and v1 are withdrawn.

**Build accepted in substance.** 24/24 checksums, PDF gate PASS, both diagrams correctly pulled, two self-found em-dash defects fixed, calculator untouched, GAPs reported rather than guessed. Nothing below is a rebuke; three of the five GAPs are my inputs being wrong.

---

## R1 — Section 2 must use the split card (SAMAN instruction)

The preview renders Section 2 as a plain two-paragraph card. The **split card with gallery CTA is a mandatory cluster design** (standing rule 16, ruled at PC-00 v1.4) and SAMAN has confirmed it is required here. Your GAP 4 was correct: copy pack v2 supplied no sub-copy, and rule 14 forbids you inventing it. **That was my omission, not your error.**

Copy pack v3 adds three checksummed fields:

| Field | Length | SHA-256 |
|---|---|---|
| `SPLIT_CARD_H3` | 48 | `3ddf6c10874dce3b7e5efbdb48bae5fbb05a81271cb770450a43dd4f4840995c` |
| `SPLIT_CARD_BODY` | 336 | `245079bcdb958e0f0065df45048e70b35af79c6f7b2816f29fcb4d589885e979` |
| `SPLIT_CARD_CTA` | 27 | `4c88bfdeb3b24ebc2e2e58f63f1441abbf54f6b86f84dbffc60f4f7955176592` |

Render with the **same Section-2 split card component the PC-00 hub uses**: image left, `SPLIT_CARD_H3` as heading, `SPLIT_CARD_BODY` as text, `SPLIT_CARD_CTA` as the link label. The trailing arrow comes from the component, not the copy string.

- **CTA destination:** the same project-gallery URL the hub's Section-2 card already links to. Read it from the hub component. **Do not invent a URL.** This takes the page from four internal links to five; the link map is amended accordingly and the addition is approved.
- **Card image:** `fire-rated-porta-cabin-20x10-tan-side.webp` (gallery slot 16), already produced by your build.
- **Truth constraint:** the card deliberately does not claim the gallery shows completed *fire-rated* projects, because no such evidence exists. It claims shared chassis, factory process and quality checks, which the specification supports. Do not retitle or reword it.

## R2 — Section 2 length

Also per SAMAN: the section reads thin against the hub. `S2_P2` is rewritten and Section 2 body moves **857 → 890 characters**, still inside the 800-900 limit. With the split card, visible content in Section 2 goes **857 → 1,301 characters**.

**Only `S2_P2` changed.** New checksum `68a8c3d160e9487e1e5ea31091284425aaee97d0d864bba40ff5abfc0b8ff60c` (415 chars). `S2_H2` and `S2_P1` are byte-identical to v2. Pack total is now **27 fields**.

## R3 — GAP 1 resolved: the tables are wrong, the narrative is right

I checked the workbook directly. **PC-FR-06 is 19 Product-Specific and 11 Platform Common, exactly as the two checksummed copy fields state.** My tables were wrong, in two places that partially cancelled:

1. **Table 1 row "Reference configuration" is not one of the 30 technical line items.** It is a dimensional header I added, and I labelled it `Product-Specific`, inflating the count to 20. **Fix: keep the row, blank its Classification cell** (or render an em-dash-free placeholder such as `n/a`). It is not part of the classification count.
2. **Table 2 merged two distinct Platform Common rows into one.** The workbook has both `Decorative / external finish` (row 33) and `Painting / coating` (row 47). I combined them as "External finish / coating", deflating the count to 10. **Fix: split into two rows:**

| Component | Specification | Classification |
|---|---|---|
| Decorative / external finish | Project-selected colour and compatible coating system; substrate preparation and compatibility confirmed at order | Platform Common |
| Painting / coating | Corrosion protection matched to substrate and exposure; prepared MS receives the approved coating system, with touch-up on site | Platform Common |

After both fixes the tables sum to **19/11** and agree with `SPEC_NARRATIVE` and `DESCRIPTION_TAB`. No checksummed copy changes.

## R4 — GAP 2 resolved: six dedicated explorer images

Your reasoning was right: reuse beat firing unapproved placeholder copy. But you should not have had to choose, because v2 declared 42 slots and allocated none to the explorer. **Copy pack v3 §3-A allocates six previously unused files, one per size**, with output names and alts. Four need the `fireproof` rename.

Slot count is now **48: 36 gallery + 6 explorer + 6 Description**, all hash-unique, zero reuse. Acceptance criterion 7 changes from 42 to 48.

## R5 — GAP 3 ruled: the empty accordion must not ship

Correct not to touch it, and correct to report it. **Ruling: a visible price table with empty or generic rows is a truth defect and must not go live on this page.** A buyer reading unpriced rows under a fire-rated cabin will assume the price is unknown, when six prices are published on the same page.

In order of preference:

1. **Suppress the accordion on this page** via an opt-in prop defaulting to current behaviour everywhere else. Display-only. No calculator logic, no `calculatorLadders.ts` edit.
2. If suppression cannot be done without touching calculator logic or breaking sibling byte-identity, **STOP and report**. SAMAN rules then.

Do not populate it with the six-size ladder. PART 1-A stands: the published ladder never enters calculator data.

## R6 — GAP 4: closed by R1. GAP 5: accepted

The sibling delta is the mobile-nav badge 8→9 and `relatedProducts` gaining `fire-rated-porta-cabin`. That is the correct, unavoidable consequence of a tenth product joining the category, and your bracket-matched verification is accepted as evidence. Not a defect.

## R7 — Diagrams: both correctly pulled, and this is now a source defect

Both exclusions are upheld under rule 10, and they are good catches:

- Diagram 1: `150x75x5 mm RHS` twice, where Table 1 and the verified PDF both say **C-channel**. A different structural profile, not a paraphrase.
- Diagram 2: floor resting on **calcium silicate board**, where the Floor base row permits only cement-bonded board or an engineered steel/cementitious deck. Calcium silicate is approved for interior wall lining only.

These are errors in the approved drawings themselves, not build defects. Recorded for the technical approver. The Specifications tab ships with narrative plus both tables and no diagrams, which the base ticket permits.

## R8 — The two em-dash defects you found and fixed

Both were mine. The `Table 1 —` / `Table 2 —` labels came from my draft's own section headings, which is exactly how an authoring artifact leaks into shipped copy. Your hyphen fix is accepted. The rail-card alt likewise. The inherited `Choose your size` literal stays untouched and stays on the PC-00 shared-component fix list.

---

## Do now

1. Pull `PC-05-fire-rated-porta-cabin-copy-pack-v3.md` from `_build-inputs\` into the repo, commit it, verify **27** checksums. Only `S2_P2` changed; three are new; the other 23 must still match.
2. Apply R1 split card, R2 copy, R3 table corrections, R4 explorer images, R5 accordion suppression.
3. Re-run acceptance: criterion 1 covers 27 fields, criterion 7 covers 48 slots, plus the five internal links.
4. Re-verify sibling diffs and the U+2014 grep.
5. **Stop at preview again.** No PR to production unless SAMAN asks in writing.
