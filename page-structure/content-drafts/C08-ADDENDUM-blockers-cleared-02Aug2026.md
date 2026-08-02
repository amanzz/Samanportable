# C-08 ADDENDUM: ALL SEVEN BLOCKERS CLEARED — 02 Aug 2026

Verbatim under L4. Applies to PR #111, same branch.

## 1 · CANONICAL WARRANTY, THREE SURFACES (identical to the C-04 pattern)

Trust strip, all five pages, verbatim:
`5-year structural warranty and 1-year finishing warranty as standard`

Specification table warranty row, all five pages, verbatim, same string:
`5-year structural warranty and 1-year finishing warranty as standard`

Description body, all five pages, verbatim, both sentences:
`5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation. Typical service life is 20 to 25 years under proper use and maintenance, which is an engineering expectation, not a warranty period.`

## 2 · SKU CODES, 2026 PATTERN

Product-level: hub `SP-CH-2026` · prefab `SP-PCH-2026` · luxury `SP-LCH-2026` · shipping `SP-SCH-2026` · affordable `SP-ACH-2026`.
Variant-level, where a per-size SKU is emitted: append the size code in uppercase with the letter x, for example `SP-CH-2026-20X10`, `SP-LCH-2026-40X12`. Six variants per product, matching the six published sizes and no others.

## 3 · SUPPLY-ONLY PRICING DISCLAIMER

One sentence, placed immediately under the price ladder on all five pages, verbatim:
`Published prices are ex-factory for the unit as specified, exclusive of GST. Foundation, site levelling, water and drainage connection and the electrical service point are arranged at your site and are quoted separately.`

## 4 · HUB TO PREFABRICATED HOUSES, CROSS-CLUSTER SENTENCE

Placed in the hub body, never in the first paragraph, verbatim:
`If you want a permanent home built from insulated panels on a conventional rectangular footprint rather than in container form, that is a different platform, and our [prefabricated houses range] covers it.`
Anchor: `prefabricated houses range` pointing at `/product/prefabricated-houses`. Unique site-wide; verify mechanically.

## 5 · DUPLICATE ANCHOR FIX

The affordable page's right-to-exist comparison line is replaced, verbatim:
`If you expect to add units or extend later, the [repeatable module line] earns its premium over a fixed plan.`
Anchor becomes `repeatable module line`, still pointing at the prefab child. The luxury page keeps `prefab container homes`. Each anchor now occurs once site-wide.

## 6 · SEVEN-WORD COLLISION FIX, HUB 20x8 BODY

Replace the third sentence only. Old: `The shell is the standard build: welded MS frame, corrugated MS walls, 75 mm mineral wool in the walls and 100 mm glasswool over the ceiling.`
New, verbatim: `The shell is the standard build: welded MS frame, corrugated MS walls, mineral wool insulation at 75 mm and a 100 mm glasswool layer above the ceiling.`
Verified: body 537 characters, 5 sentences, both inside band; the colliding sequence is gone; zero new collisions against any other pack body.

## 7 · PDF SPECIFICATION, SOP SECTION 11

Five PDFs, one per product page, never shared. Path `/specs/<slug>-technical-specification.pdf` for the five slugs. Button label exactly `Download Specification PDF`, placed in the first section beside the enquiry CTA. Script-generated from the wired 30-row dataset and the approved ladder so it cannot drift. Maximum 400 KB, five distinct SHA-256 values.

Each PDF contains, in this order: product name and canonical URL · that page's own 30-row specification table with its three group headings · its own six-size price ladder showing ex-GST and incl-GST · the canonical warranty sentence from section 1 above, both sentences · the supply-only disclaimer from section 3 · delivery in 7 to 21 working days and fixed quotation within 48 hours · certifications ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, NSIC SPRS, Udyam, ZED Bronze, DPIIT Startup India · all four contacts, Bengaluru +91 88616 22859 and +91 80886 85440 with sales@samanportable.com, Greater Noida +91 87960 39938 and +91 97089 89937 with ncr@samanportable.com · generation date.

## 8 · MERCHANT

Thirty variants are now unblocked by the SKUs in section 2. Feed titles follow `<Product Name> <W>x<L> ft (<area> sq ft) | SAMAN Portable`, price incl-GST, `item_group_id` the product slug, condition new, `identifier_exists` false. Merchant price language verbatim: `Base specification price - customisations quoted separately.` Five stale C-08 catalogue entries stay excluded and are reported.

## 9 · THE TWO HELD REDIRECTS, RULING

Codex correctly held `prefabricated-container-house` and `prefabricated-container-home` after reading their query exports. **Both stay live at 200 and both stay out of this PR.** They do not block the C-08 publish.

To rule finally I need evidence I do not yet have, so the C-08 session reports, without changing anything: for each of the two pages, the **top 20 queries with clicks, impressions and average position each**, the count of those queries that the prefab child already ranks for, and the same table for `prefab-container-homes` itself. The named families, capsule and container-room on one page and container-cabin on the other, may belong to a different cluster entirely, which is a boundary ruling, not a redirect ruling.

Until then neither page may be redirected, merged or rewritten.
