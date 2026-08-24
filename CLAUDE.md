# CLAUDE.md

Project memory for **samanportable.com**. Written 15 August 2026. **This file replaces every earlier CLAUDE.md, agent-memory file, standing-rules file, rulings file and revision ticket in this repository.** Delete those when you next touch the repo and list what you deleted. Their arguments are closed. Do not reopen them, do not cite them, do not treat them as precedent. If anything contradicts this file, this file wins.

---

## What this project is

Rebuild **106 approved pages** on samanportable.com: new content, new images, existing design.

The design is finished. It is the live template at `https://www.samanportable.com/product/porta-cabins`. Nothing about layout, components, spacing, tokens or component order is open for discussion on any page. **Only content and images change.** A page that looks different from the template is a defect, not a variation.

This is deliberately repetitive work. The same build, 106 times, with different copy and different pictures. It should be boring. If a page is taking a long argument, something has gone wrong with the process, not with the page.

---

## Who does what

| Role | Does | Does not |
|---|---|---|
| **SAMAN** | Approves drafts, reviews previews, says when to ship | Write copy, chase rulings |
| **Content model** (Claude chat) | Researches, writes the draft, writes the self-contained build prompt, produces PDF and diagrams | Touch the repo |
| **Claude Code** (builder) | Builds exactly what the build prompt says, self-checks, shows a preview, ships when told | Decide anything, invent anything, rewrite copy |

**The builder decides nothing.** If the build prompt does not cover something, that is a gap: report it in one line and continue with everything else. Do not invent, do not infer, do not substitute, do not halt the whole page over one slot.

---

## The process

1. Content model writes the draft. SAMAN approves it.
2. Content model writes **one self-contained build prompt** into that page's folder, with every asset beside it.
3. Claude Code builds it and shows SAMAN a local preview.
4. SAMAN reviews. Changes → make them, new preview. Approved → **SAMAN says ship, and it ships.**

That is the entire process. There is no ruling chain, no ticket chain, no approval chain, no second reviewer.

**Shipping.** When SAMAN says push, merge or deploy: do it, as one unbroken sequence. Push the branch, open the PR, wait for green checks, merge, verify the live URL returns 200 and renders. Report the result. Do not re-ask, do not re-confirm, do not quote an older instruction back as a reason to pause. If live verification fails, revert the merge immediately and report that first.

**Permissions.** `bypassPermissions` is set deliberately so builds run unattended. Do not ask for confirmation on ordinary build commands. Do not add extra caution around `.md` files, memory files, JSON data files or scratch files.

---

## Self-contained build prompts

**Everything the build needs is in the build prompt or in a file beside it in that page's folder.** No build prompt may reference a document the builder cannot open, a chat message, a Project doc, or "the copy pack" without that pack sitting in the same folder.

Copy is carried in the ticket, character-for-character. Not summarised, not described, not linked.

If a ticket points at something unreachable, that is the content model's error. Report it in one line and build everything else.

---

## Hard rules

These exist because they protect SAMAN commercially or legally. Everything else is negotiable; these are not.

**Content truth**
- Page copy is **verbatim** from the build prompt. Never rewrite, shorten, expand, re-punctuate or improve it.
- **Never write customer-facing copy.** Not headings, captions, alt text, empty states, placeholders, tooltips or fallbacks. No approved copy for a slot means render nothing and report it.
- Never invent a dimension, price, capacity, load, certification, warranty, delivery promise, review or project claim. Every number traces to the build prompt.
- **No em dash (U+2014) anywhere.** Hyphens instead. En dash only inside numeric ranges. Grep the built output before reporting.

**Images**
- SAMAN supplies every image, already framed. **Never crop, re-frame, pad, generate or substitute.** Convert and compress only, preserving the source aspect ratio exactly.
- **Open every image before using it.** Filenames across this project are unreliable: they carry wrong colours, wrong views, wrong product names and sometimes banned terms.
- Alt text is copy: verbatim from the build prompt, never derived from a filename.
- Hash every image and confirm uniqueness page-wide before building. Duplicate pairs under different names have appeared before.
- These are approved renders. Provenance is `render`. Never label one a completed project.
- A missing source file is a gap to report, never a slot to fill with something else.

**Section 2 is TWO blocks, never one. This is the most-repeated build defect on this project.**

Section 2 renders a `RightToExist` split card. Supplying only the H2 and two paragraphs leaves the card half empty, which is a visible defect on the preview. Every page, no exception:

1. **Top block:** one H2 (55-70 chars), then exactly two short paragraphs, containing one contextual internal link, ending with one CTA sentence. Budget 800-900 visible characters for the two paragraphs. This budget covers the top block ONLY.
2. **Split card, directly below:** one image on the left, **16:9, always**, from the page's own approved supplied set. Never cropped, never generated, never reused from another slot.
3. **Beside the image, to its right:** one H3 (35-65 chars), then either two short paragraphs of roughly 150-220 characters each, or one paragraph of 150-220 characters plus three to four bullets of 8-12 words each. The content model picks prose or prose-plus-bullets to fit the material.
4. **One CTA inside the card.** Same destination as the top block's CTA unless the build prompt's link map approves a different one.

The reference is the "Which Porta Cabin Should You Buy?" card on the live `/product/porta-cabins` hub. Match it exactly.

**Build prompts must carry all of it.** The assembly map shows two rows for Section 2, not one. The media manifest lists the split-card image as its own numbered slot, counted in the page total and in the page-wide hash-uniqueness check. Acceptance criteria measure both blocks separately and confirm the card renders with content, checked on a screenshot and not inferred from markup.

**If a page has no spare 16:9 image**, reallocate one from the Description tab, which may carry four to six. Reissue the Description file and its hash. Never crop a square gallery image to fill the card, and never leave the card empty.

**Design lock**
- Reuse the live porta-cabins components and tokens (`#1a3c2e`, `#2d7a3f`, `#f0f7f2`) exactly.
- Any change to a shared component is an **opt-in prop defaulting to false**, so sibling pages stay byte-identical. Verify with a rendered-HTML diff.
- Never restyle per page.

**Scope**
- One page, one branch: `feature/<page-id>-<slug>`, cut off current `origin/static-migration`. Record the pre-build SHA and take a backup ref before the first edit.
- Verify you are on the named branch before trusting any file finding. A stale worktree produces confident, wrong reports.
- Do not touch redirects, the sitemap or the merchant feed unless the build prompt says so.

---

## Standing decisions

These are settled. Do not raise them again on any page.

**Calculator ladder.** A page that publishes a price ladder **gets a `ROUTE_LADDERS` entry in `calculatorLadders.ts`, read from that page's own product JSON** via `toRows(...)`. A page that publishes no prices gets no entry and renders quote mode. That is the file's own design intent: the calculator and the page read the same JSON, so they cannot drift. Add the entry as part of the build and report it in one line. Where an already-live page is missing its entry, that is a defect to fix, not a precedent to copy.

Everything else about the calculator is untouched: no logic, step, formula or copy change. The from-price banner derives and is never hardcoded.

**Specs tab data.** `c01-specifications.json`, key `porta-cabins`. `specs-tab-dataset.json` is dead code.

**Section mapping.** Section 2 → `RightToExist`. Section 3 → `SizeApplicationsExplorer`. Hero gallery is per-size-variant; hero cells are per-variant `FEATURE_CELLS`. There is no static five-row hero table.

**Existing opt-in props**, prefer these to adding new ones: `showSectionDividers`, `usePremiumSizeTabs`, `explorerPanelHeadingAsH2`, `paragraph2`, `bodyParagraphs`, `copyInPanel`, plus the `FEATURE_CELLS` overrides. `VariantImage.fit` (`'cover' | 'contain'`, in `product-variant-hero/types.ts`) overrides the Section 3 panel image's default `object-cover` crop — set `'contain'` when the panel image is a dimensioned drawing (a GA/spec plan) whose ratio is close to but not exactly the box's `aspect-[4/3]`, where any crop at all is a false drawing. Absent everywhere else, so it is byte-identical for every panel that doesn't set it. Added for CO-09 (22 Aug 2026); do not add a second prop for the same problem.

**YMAL constants.** `PORTA_CABIN_SIBLING_YMAL` feeds MS. `..._NO_EM_DASH` feeds GI and every page built since. New pages pick one. Never modify either.

**Tabs.** Description, Specifications, Shipping, Reviews, in that order. Shipping is byte-identical to the shared component. Reviews shows the neutral empty state on a new page.

**Explore the Range panel (Section 1, column 3). SAMAN ruling, 17 August 2026.**
The panel lists every product page in the CURRENT PAGE'S OWN CLUSTER and nothing
else. Hub first, then siblings in approved-plan order. The current page is always
excluded from its own panel. No destination appears twice. NO CROSS-CLUSTER TILES.
Cross-cluster alternatives belong in Description-tab prose, not in this panel.
The rail is DERIVED from the cluster's approved page list, never hand-authored
per page: hand-authored rails drifted out of sync across C05 and produced four
different panels in one cluster. Every destination is confirmed 200 at build time;
a non-200 destination is dropped and reported, never rendered, never labelled
"coming soon". Applies to every cluster.

**Section 3 block shape, empty slots and placeholder markers. SAMAN ruling,
21 August 2026, after three defects reached CO-09 in one day. Canonical, all
106 pages, every cluster.**

1. *A size section is never prose alone.* Every one of the six (or nine)
   variant sections in Section 3 carries one H2, then EITHER two short prose
   paragraphs, OR one prose paragraph plus five to six bullets. The 400-500
   character body count covers the prose only; bullets are measured
   separately and never counted toward it. Every bullet carries an approved
   figure or fit decision, none restates the paragraph, none repeats a price
   already shown in the price strip beneath the block, and bullet
   length/shape should vary rather than read as templated.
2. *An empty slot renders nothing, never text.* If an image, PDF, diagram or
   media slot cannot be filled, render nothing and report it in one line.
   A shared component's own text fallback is customer-facing copy too — it
   does not become acceptable because a component supplied it rather than an
   agent typing it. Never write "coming soon", "available on request",
   "contact us for details" or any variant. Grep the built output for these
   strings and report zero hits.
3. *No placeholder marker survives into a build prompt.* The only marker
   permitted to reach a builder is an image placement marker of the form
   `[IMAGE …]`, and the ticket must say what to do with it. A draft with
   "fill this in later" markers is an outline, not a draft — do not build
   from it.
4. *Source the master, not the thumbnail.* When an asset pack supplies both
   a full-resolution master and a small web preview of the same artwork, the
   build sources the master and downscales proportionally to the served
   width. A proportional downscale is the one permitted resize; cropping
   remains forbidden everywhere, and a cropped dimensioned drawing becomes a
   false drawing.

Full detail and the CO-09 incident writeup:
`D:\Project-shekhar\all-product-images\Hub page (Container Offices)\Drafts\SAMAN_Standing_Section3_Block_and_Empty_Slot_Rules.md`

**Build-verification lessons from CO-09 (22 Aug 2026), so the next build (any
agent) doesn't re-learn these the slow way.**

- **A price ladder update touches every row, not just the ones the ticket
  calls out as changed.** CO-09 v1.1 correctly applied the flagged deltas but
  left one untouched row (40x10) still carrying its pre-ticket live price.
  Diff **all** rows in the product JSON against the ticket's ladder table,
  every build, even the rows the changelog doesn't mention.
- **A cluster-href helper that builds sibling links (`slug => hub/slug`) must
  never be called with the hub's own slug** — it doubles the path
  (`/hub/hub`) instead of linking the hub. If a page needs to link its own
  cluster hub, use the hub constant directly, not the sibling-link helper.
  Grep any new `*Href('<hub-slug>')` call before shipping.
- **`claude/SAMAN_PORTA_CABINS_DESIGN_LOCK.md` (the Template Conformance Gate
  doc referenced by build prompts) does not exist anywhere in this repo.**
  Do not assume it silently passed; report it as an unreachable reference
  per the self-contained-build-prompts rule, and substitute a manual
  component-order + screenshot + prop-audit pass.
- **A full-page screenshot (Chrome `--screenshot`, Playwright `fullPage`)
  tiles a tall page by scrolling, and any `position: sticky`/`fixed` element
  (fixed header, mobile sticky CTA bar, calculator step bar) repaints once
  per tile** — it reads as duplicated page content but is a capture artifact,
  not a bug. Verify a suspected duplication by counting DOM nodes
  (`page.locator('h1').count()`, etc.), not by eyeballing the stitched image.
  A single-viewport screenshot (no `fullPage`) at the section in question
  avoids the artifact entirely.
- **A Next.js `Image` with `loading="lazy"` inside a wide `--window-size`
  headless Chrome `--screenshot` capture can render blank** even though the
  file is a valid 200 — it's a paint-timing artifact of that specific capture
  method, not a broken image. Confirm the raw asset URL returns 200 directly,
  and if the screenshot still shows a blank box, recapture with Playwright's
  `waitUntil: 'networkidle'` (or `channel: 'chrome'` if no browser is
  installed) before concluding the image is actually broken.
- **Before reporting "this em dash / default string can't be fixed without
  touching the shared component," grep `[slug].tsx` (and the component
  itself) for an existing per-slug override list first.** CO-09 nearly
  reported the `sizeEyebrowText` default em dash as an unfixable gap; it is
  actually a sanctioned, already-wired override (`slug === '…' ? '<approved
  hyphen string>' : undefined`), reused byte-for-byte by five other pages —
  it only needed CO-09's slug added to the list. The other em dash on the
  same page (a rate-card guidance line) genuinely has no override anywhere
  and stays a reported gap. Check both before deciding which bucket a
  hardcoded default falls into.

---

## Internal links: check, do not memorise

**Never trust a hardcoded live-status table.** Pages go live continuously, so any list in a memory file is stale within days. Before linking to any URL, request it and confirm 200. Link only to 200 destinations, never through a redirect. Never write "coming soon".

Temporary 404s on unbuilt sibling pages inside the shared YMAL carousel are accepted in writing and are not a defect.

**Repo presence does not mean live.** A product JSON in `src/data/products/` proves nothing about deployment. Confirm with a real request.

---

## Standard checks before reporting

1. Copy matches the build prompt exactly; counts re-measured on built output.
2. Exactly one H1; canonical self-referencing; page indexable.
3. Zero U+2014 in built output.
4. Every internal link confirmed 200 by live request, none through a redirect.
5. Every image slot filled from the manifest, renamed, alt verbatim, hash-unique, source ratio preserved.
6. Rendered-HTML diff versus siblings shows zero unintended change.
7. Calculator is the production version and otherwise untouched; banner derives; ladder entry added and reported.
8. Tabs in order; Shipping byte-identical; Reviews neutral empty state.
9. Mobile: approved stacking, chips within two rows, no horizontal overflow. Say so plainly if you could not verify this visually.
10. Pre-build SHA recorded so rollback is a branch reset.

Report gaps in one line each. Do not patch silently. Do not escalate a gap into a page-wide halt.

---

## Company facts (state identically, never alter)

SAMAN POS India Private Limited, brand SAMAN Portable. Founded 2009, incorporated 2019, over 15 years experience. Factories: Bengaluru (South) and Greater Noida (North); manufacturer, not reseller. 500+ projects, 3,000+ customers, 200+ team, 15+ states. Monday to Saturday, 09:00 to 20:00 IST. Delivery 7 to 21 working days; fixed-price quote in 48 hours. Warranty, verbatim: "5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation." Service life 20 to 25 years under proper use and maintenance, which is a design life and not a warranty period. GST 18%, HSN 9406. Contact page: `https://www.samanportable.com/contact`.

---

## Current page

**This section goes stale fast — PC-06 sat here unshipped for over a week
after PR #130 actually merged, and CO-00 / PC-00 / LC-07 and others all
shipped after that with no update.** Whoever ships or picks up a page:
update this section in the SAME commit/session, not "later." A wrong
"current page" pointer costs the next session a full re-diagnosis before
it can even start.

**CO-09 Container Office Cabin**, `/product/container-offices/container-office-cabin`, branch `feature/co-09-container-office-cabin` (pre-build SHA `2ff60ca2`, backup ref `backup/co-09-container-office-cabin-prebuild-2026-08-22`). Built to draft v1.3 / build prompt v1.2, all 23 acceptance criteria self-checked and reported. **PR #167** (`https://github.com/amanzz/Samanportable/pull/167`) open against `static-migration` — **not yet merged.**

**Two things block merge, both must be resolved before this section is cleared:**
1. **The 40x8 ft price, Rs 3,80,000 ex-GST, is computed (not a workbook row) and is still awaiting SAMAN's written confirmation.** If SAMAN returns a different figure it changes three cells in the ladder (`container-office-cabin.json`) and nothing else — no copy string moves.
2. **Known, reported-not-fixed gaps**, all pre-existing patterns rather than CO-09-introduced defects, listed in the PR description: the Shipping tab carries a per-product intro paragraph (not byte-identical to a sibling, matches the whole C04 cluster's existing convention); the technical PDF's clickable link now targets the canonical page but its visible link *text* still shows the hub URL; one U+2014 renders from the shared calculator's rate-card guidance line, which has no override prop (the other em dash, the `sizeEyebrowText` default, is fixed — see the lessons list above: `container-office-cabin` was missing from `[slug].tsx`'s existing no-em-dash slug list even though the sanctioned override string already existed and is reused by five other pages).

When CO-09 ships (merged, live URL verified 200), replace this section with the next page and delete the "goes stale fast" note only once you've actually developed the discipline it's asking for.

---

## Agent handoff addendum - CMO-01

Added 24 August 2026 after the Container Marketing Office preview review.
For every new product page, Section 2 must use the same post-WooCommerce
design as the live `/product/porta-cabins` reference: `RightToExist` renders
immediately after the hero/product block and before `SizeApplicationsExplorer`.

Do not put approved Section 2 copy inside `descriptionHtml` or the Description
tab. If the build data already has the Section 2 H2 and two lead paragraphs at
the start of the long description, move that block into
`src/components/product-variant-hero/rightToExistEntries.tsx`, add the 16:9
split-card image and card copy there, and let the long description start with
its own next H2.
