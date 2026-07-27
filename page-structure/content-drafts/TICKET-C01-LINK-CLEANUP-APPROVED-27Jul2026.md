# TICKET — C-01 LINK CLEANUP + 404 RECOVERY · Fable 5 · 27 Jul 2026
**Approved by Fable 5 as senior SEO lead, 27 July 2026, built entirely from Codex's measured link audit. Supersedes and replaces the withdrawn `TICKET-C01-LINK-CLOSURE-APPROVED-27Jul2026.md`, which was built on unverified assumptions.**

---

## 1 · WHAT THE AUDIT ACTUALLY SHOWED

345 body links into C-01 from 111 source pages. **Every source and every target returns a direct 200. Zero broken links, zero chains.** The graph is in good shape.

Two real defects:

**Anchor over-optimisation.** 33 anchor strings repeat. The worst are bare head terms: `porta cabins` used **36 times** and `porta cabin` **16 times** — 52 links whose entire anchor is the hub's own primary keyword. That is the classic over-optimisation pattern.

**Hub over-concentration.** The hub receives **221 of 345 links (64%)** while `porta-cabin-shop` receives **2** and `porta-cabin-with-toilet` receives **5**. Several of those hub links carry anchors that explicitly name a *different* product.

**Both are fixable without changing a single visible word.** This ticket does exactly that and nothing more.

## 2 · WP-EXPORT BOUNDARY — refined, because 315 of the 345 links live there

The read-only rule stands for **product records**, which feed L3 head data. It is refined for **post bodies**:

> **`src/data/wp-export/products/*.json` remains read-only.** Its fields feed titles, meta, Rank Math head data and the L3-frozen first 100 words.
>
> **`src/data/wp-export/posts/*.json` may have link markup edited** — an `href` changed, or an `<a>` unwrapped — **provided the visible text is byte-identical before and after, and the link is outside the first 100 words of body copy.** No sentence is rewritten, no word added or removed. Any edit that would alter visible text → **STOP and report.**

The eleven links inside the first 100 words are **out of scope entirely.** Do not touch them.

## 3 · ACTION A — RETARGET 14 MIS-POINTED ANCHORS

These anchors name a specific configuration in their own words but point at the hub. Change the `href` only. **The visible text does not change.**

| Source page | Anchor text (unchanged) | Retarget to |
|---|---|---|
| `/porta-cabin-in-chandigarh` | `portable steel cabin lineup` | steel-porta-cabin |
| `/porta-cabin-in-durgapur` | `steel-frame porta cabins built for industry` | steel-porta-cabin |
| `/porta-cabin-in-gwalior` | `durable steel porta cabin formats` | steel-porta-cabin |
| `/porta-cabin-in-hyderabad` | `our steel porta cabins` | steel-porta-cabin |
| `/porta-cabin-in-bhopal` | `custom MS porta cabin configurations` | ms-porta-cabin |
| `/porta-cabin-in-nagpur` | `MS steel porta cabin build options` | ms-porta-cabin |
| `/porta-cabin-in-bhubaneswar` | `site-ready porta cabin office systems` | portacabin-office |
| `/porta-cabin-in-dehradun` | `hill-site porta cabin office options` | portacabin-office |
| `/porta-cabin-in-guwahati` | `monsoon-ready porta cabin office builds` | portacabin-office |
| `/porta-cabin-in-indore` | `factory-built porta cabin site offices` | portacabin-office |
| `/porta-cabin-in-manesar` | `porta cabin offices built for industrial sites` | portacabin-office |
| `/porta-cabin-in-nashik` | `insulated porta cabin office formats` | portacabin-office |
| `/porta-cabin-in-tirupur` | `porta cabin for site office` | portacabin-office |
| `/porta-cabin-in-chennai` | `porta cabin products` | *no change — verify only* |

The last row is a control. If its anchor differs from what is recorded here, **STOP** — the audit and the repository have drifted and I need to know before anything else is applied.

**Deliberately excluded:** the `entry-level MS porta-cabin spec sheet` anchors on `/porta-cabins-in-marathahalli` and `/porta-cabins-in-nagarbhavi`. "Entry-level" points to Low Cost while "MS" points to MS Porta Cabin. **Ambiguous, so untouched.** Report them; I will rule separately.

## 4 · ACTION B — UNLINK DUPLICATE BARE HEAD-TERM ANCHORS

**The rule, applied mechanically:**

> Where a single source page links to `/product/porta-cabins` **more than once**, and one of those anchors is a bare head term — exactly `porta cabin`, `porta cabins`, `portacabin` or `portacabins`, case-insensitive, with no other words — **unwrap that anchor.** Remove the `<a>` element and leave its text in place.

**Every page keeps at least one hub link**, always the descriptive one. Visible text is byte-identical. This removes the exact-match concentration without losing a single crawl path.

**Do not unwrap** where a bare head term is the page's **only** link to the hub — retarget nothing, remove nothing, leave it.
**Do not unwrap** anything inside the first 100 words.

**Report the exact count removed and the resulting per-page link counts.** I expect roughly 30–40 removals; if the figure lands far outside that, stop and report rather than proceeding.

## 5 · ACTION C — RECOVER 217 CLICKS FROM A 404

`/used-portacabin-for-sale-porta-cabin-office-second-hand-portacabins` returns **404** and earned **217 clicks** over sixteen months. Your audit proved it never existed in the repository — it is a historical alias that was never represented in code, so no event retired it. It was simply missed.

The singular-ending variant already resolves: `…second-hand-portacabin` → 308 → `/2nd-hand-porta-cabins` → 200.

**Add: `/used-portacabin-for-sale-porta-cabin-office-second-hand-portacabins` → 301 → `/2nd-hand-porta-cabins`**

Single hop, terminating on the same live 200 its sibling already reaches. Verify the hop count and confirm no chain.

## 6 · OUT OF SCOPE — stated so it is not attempted

- **The 28 gap pages.** Adding links there needs new sentences, which needs me to read each body first. Separate ticket.
- **`porta-cabin-shop` at 2 links and `porta-cabin-with-toilet` at 5.** No existing anchor on any page names a shop or a toilet cabin, so nothing can be retargeted to them. Fixing this requires new copy. Separate ticket, and the shop gap is a content gap, not a linking gap.
- **The 11 first-100-word links.** L3 zone.
- **Any product record under `wp-export/products/`.**
- **Any change to visible text anywhere.**

## 7 · ACCEPTANCE

1. 13 anchors retargeted per §3; the control row verified unchanged; the two ambiguous anchors reported and untouched.
2. Bare head-term anchors unwrapped per §4, with the count reported and per-page link counts before and after.
3. **Every one of the 111 source pages still links into C-01 at least once.** Report any page that would drop to zero — that must not happen.
4. **Zero visible-text change on any page.** Prove with a content-layer diff: word counts identical on all touched files.
5. New links-per-target table, before and after. Hub concentration should fall below 64%.
6. Remaining duplicate-anchor count, before and after.
7. The 404 redirect resolves 301 → 200 in exactly one hop; zero chains site-wide.
8. Zero links inside the first 100 words touched.
9. Zero changes under `wp-export/products/`.
10. All 9 C-01 pages still return 200 with unchanged visible text and JSON-LD.
11. TypeScript clean, production build clean, CWV no-regress.

Preview, report to Fable 5, **STOP. Do not merge.**
