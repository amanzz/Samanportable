# RULING — wp-export sanitisation + C-01 fix ticket · Fable 5 · 26 Jul 2026
<!-- PASTE INTO: the EXISTING Event B Codex session. -->

Excellent diagnosis. **Your production table disproves my defect call and I withdraw it.** All nine pages serve Event B content correctly — I read stale responses under `s-maxage=3600, stale-while-revalidate=86400` and reported a deployment failure that did not exist. Checking production was right; treating a single cached read as proof was not.

Your audit did surface three real defects that my check would never have found. Rulings below.

---

## RULING 1 — wp-export price serialisation: SANITISE AT THE ROUTE, NEVER EDIT wp-export

`portacabin-office` renders ₹2,90,000 correctly, but still serialises `price: 525000.00 / regular_price: 545000.00` and the single 40′×11′×9′ configuration into production `__NEXT_DATA__`. That JSON is in the delivered HTML and is machine-readable. **It is a live L15 truth defect** — two prices on no approved ladder, inside a page whose visible copy says something else.

**Ruling: do not touch `src/data/wp-export/`.** That layer is the L3-frozen source of truth for titles, descriptions and Rank Math head data. Editing it to fix a price would put the L3 lock at risk to solve a serialisation problem.

**Fix in the route templates instead.** In both `src/pages/product/[category]/index.tsx` and `src/pages/product/[category]/[slug].tsx`: when Event B data exists for a slug at `src/data/products/<slug>.json`, **do not serialise the legacy record's commercial fields** — `price`, `regular_price`, `sale_price`, and any legacy size or configuration field — into page props. Where Event B data is absent, behaviour is unchanged.

**Scope: site-wide, because it is one code path in two files.** A C-01-only conditional would leave the same defect on every other product page and create a divergence we would have to unwind later. Report how many product pages change as a result.

**Acceptance:** zero occurrences of any legacy price in `__NEXT_DATA__` on the nine C-01 pages · visible prices unchanged · JSON-LD unchanged · L3 zones unchanged on every page touched · production build clean.

## RULING 2 — the hub's duplicate legacy block

The hub carries `Why Buy Your Porta Cabin From SAMAN` in its lower description **in addition to** the new right-to-exist block. Two blocks answering the same question is exactly the redundancy this event exists to remove.

**Ruling: remove the legacy block from the hub.** Its factual content — manufacturer not reseller, two units, 500+ projects, the ISO/NSIC/DPIIT/Udyam certifications — is already carried by the certifications section and by L15 facts elsewhere on the page. Nothing true is lost.

If that text lives in the wp-export description rather than in a component, **STOP and report** — suppressing it may require the same route-level treatment as Ruling 1, and I will rule on that separately.

## RULING 3 — missing §H section headings on Low Cost and Luxury

Good catch, and it is my defect: their entries in `section-h-datasets.json` carry size panels but no section `h2`. The tabs and panel copy are correct; only the heading is absent.

**Add these two, verbatim.** Both are L13 REV 2.1 compliant.

- `low-cost-porta-cabin` → **H2 (58c):** `Explore every Low Cost Porta Cabin size & its applications`
- `luxury-porta-cabin` → **H2 (55c):** `Explore every Luxury Porta Cabin size and its uses`

## DEFECT 1 — remove the duplicated platform sentence, all 9 pages

Delete the standalone bold platform line. Keep the three-sentence body unchanged; it already carries the platform statement in its first sentence. Re-verify sentence count, character bands and seven-word uniqueness afterwards.

## DEFECT 2 — remove the chip grid, all 9 pages

Links live only inside the third sentence and the comparison line, as inline anchors on the words already written. No boxes, no separate module, no extra anchors.

### Hub follow-on sentence — owner-authored, use verbatim

Place immediately after the comparison line, in the same paragraph flow. Each product name is an inline link to its own page.

> Beyond those, the Luxury Porta Cabin covers client-facing rooms, the Mini Porta Cabin the four compact sizes, the Steel Porta Cabin units lifted between sites, the Porta Cabin Shop retail counters, and the Porta Cabin with Toilet cabins that need their own facilities.

268 characters, five inline links, verified to share no seven-word sequence with any of the nine right-to-exist blocks. Together with the comparison line's three existing links, the hub reaches all eight subpages exactly once.

## NOTE — trailing slash is already solved

Your table shows every `/slug/` returning **308 → non-slash canonical**, and apex → www. That is clean single-hop canonicalisation. The slash duplicates in Google Search Console are historical, not live, and the CI8 ticket can be closed on that evidence. Report it so the register is updated.

---

## EVENT A IS NOW FULLY UNBLOCKED

All nine pages are verified correct on production, so the reason for splitting the redirects into waves has gone. **Run the complete 27-redirect ticket as one event, not Wave 1 and Wave 2.** Instruct the redirect session accordingly.

Sequence: apply the rulings and defects above → preview → report → I approve → deploy → then the full Event A.
