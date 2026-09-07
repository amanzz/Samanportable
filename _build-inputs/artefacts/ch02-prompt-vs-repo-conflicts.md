# CH-02 — prompt-versus-repo conflicts

Build prompt v1 §4: *"The prompt is wrong, not the repo. Stop and report the conflict.
Do not invent a component and do not add an opt-in prop to satisfy a line in this ticket."*
§5.5: *"If `RESULT: PASS` is not reachable, do not deploy. Stop and report the failing
assert with its line number."*

`RESULT: PASS` is **not reachable**, so the branch is **not merged and not deployed**.
Every failing assertion is listed below with its line number and its root cause. The
page itself is complete: a diagnostic copy of the verifier with only these seven
mechanical problems corrected returns **364 checks, 0 failures**
(`ch02-verify-local-diagnostic.txt`).

---

## A. BLOCKING — an owner decision, not a build task

### A1. The pack publishes a **10-year** structural warranty. `CLAUDE.md` fixes it at 5.

`CLAUDE.md` → *Company facts (state identically, never alter)*, and the file's own
preamble says **"If anything contradicts this file, this file wins"**:

> Warranty, verbatim: "5-year structural warranty and 1-year finishing warranty as
> standard; finishing warranty extendable to 2 years on request, confirmed at quotation."

`CLAUDE.md` line 61 also says: *"Never invent a dimension, price, capacity, load,
certification, **warranty**, delivery promise, review or project claim."*

The CH-02 copy pack asserts the opposite in two places, both of which the verifier
requires on the page **and** in the FAQPage schema byte-for-byte:

| where | string |
|---|---|
| `description_tab.sections[7].paragraphs[0]` (L113) | "The structural warranty is **10 years**. The finishing warranty is 1 year, extendable to 2." |
| `description_tab.faq[6].a` (L123, L198) | "The structural warranty is **10 years** and the finishing warranty is 1 year, extendable to 2…" |

At the same time the verifier **bans** the CLAUDE.md string outright: L148 forbids
`5-year structural`.

So the acceptance gate simultaneously requires a 10-year claim and forbids the 5-year
one that governs the other ~69 files on the site. This is a **published commercial
warranty claim**, not a string fix, and it is SAMAN's call:

* **either** the pack is right and the company fact changes site-wide (CLAUDE.md plus
  every page that carries the 5-year line),
* **or** CLAUDE.md is right and the pack's two strings are re-issued at 5 years, with
  L148's ban re-scoped.

#### Update, 6 Sep 2026: a sibling page has already shipped the 10-year claim

While this branch was in review, **CH-PFB-04** merged to `static-migration` (PR #200,
commit `2f5cc7aa`) and changed `src/data/products/c08-specifications.json` for its own
product only:

```
- "detail": "5-year structural warranty and 1-year finishing warranty as standard"
+ "detail": "10-year structural warranty and 1-year finishing warranty as standard"
```

That dataset is keyed by product, so the cluster is now **internally inconsistent on
production**:

| product | structural warranty on `static-migration` |
|---|---|
| prefab-container-homes | **10 years** |
| container-houses (hub) | 5 years |
| shipping-container-homes | 5 years |
| affordable-container-homes | 5 years |
| prefabricated-container-house | 5 years |
| luxury-container-houses | 5 years (dead data - this page's Specs tab comes from its pack, not this file) |

`CLAUDE.md` still says 5 years verbatim. So the decision is no longer only about CH-02:
one page already contradicts the governing company fact and the other five, and a ruling
either has to roll that back or roll it out. **This branch changes nothing in that file**
and takes no position.

**What this branch does meanwhile:** renders the pack verbatim, per §1's "never retype a
string", and does **not** deploy. Nothing with a contradicted warranty claim is live.
The shared hero's default trust strip also asserts ISO 9001:2015 certification and a
structural warranty; this page sets `trustStripText: "GST registered"` — the literal
PO-03 and PO-05 already ship — so no certification or warranty is claimed there.

---

## B. Shipped-verifier defects — the assertion is wrong, not the page

Four of these **fail on the design lock itself**, measured in
`ch02-gate7-design-lock-parity.txt`. Build prompt §1 says `/product/porta-cabins` "is
built and correct" and that anything a page does differently is a defect, so making CH-02
pass them would mean diverging from the lock.

| line | assertion | why it cannot pass | one-line fix |
|---|---|---|---|
| **L96** ×6 | `f"{436480:,}"` — Western grouping `436,480` | The platform formats every price `en-IN` (`formatIndianPrice`, `types.ts:346` → `₹4,36,480`) and the pack's own visible copy is Indian-grouped throughout. Nothing in the repo emits Western grouping. The pack's `price_display[*].display` field is the only Western string and is not a rendered surface. | group Indian-style, or compare the raw digits |
| **L139** | substring `free delivery within Bangalore` | The shared freight component renders **`Free delivery: within Bangalore city (South zone)`** — with a colon. §1 requires that component "exactly as the porta-cabins page renders it". | match `free delivery: within Bangalore city` |
| **L174** | no PNG or JPG on the page | The one raster is `/credentials/optimized/calculator-band-v1-1926.jpg`, inside the calculator band. **The design lock renders the identical file**, and §3.11 rules the calculator untouched. | exclude `/credentials/` |
| **L175** | `fetchpriority="high"` ≤ 1 | The page emits 4. Two are the **shared header logo** (its preload and its `<img>`), which every page on the site renders; the other two are the slide-1 preload and the slide-1 `<img>` — exactly what **§3.10 itself asks for**. **The design lock emits the same 4.** | count only gallery `<img>` tags |
| **L176** | preload carrying `imagesrcset` | No page on the site emits `imagesrcset`; **the design lock does not either**. It requires routing the gallery through Next's optimizer, which re-encodes at request time and destroys the per-slot 80–120 KB band the asset map pins — which **§9 forbids** ("Do not re-encode"). §3.10 and §9 cannot both be satisfied with a one-file-per-slot pack. | assert the slide-1 preload itself |
| **L180** ×49 | asset URL `base + ASSETS["public_dir"] + output` | `public_dir` is `/public/images/products/container-houses/luxury-container-houses/` — a **repo** path. Next serves everything under `public/` from the site root, so the served prefix is `/images/…`. Prior packs used `output_root` and their verifiers stripped `public/` explicitly (`PO-08 verify_page.py:130`). All 49 assets serve 200 **and sit inside the 80–120 KB band** — the diagnostic run proves both. | `ASSETS["public_dir"].replace("/public/", "/")` |
| **L193** | top-level LD types == {ItemPage, Product, BreadcrumbList, FAQPage} | All four entities **are** emitted. The shared route nests `Product` in `ItemPage.mainEntity` and `BreadcrumbList` in `ItemPage.breadcrumb`, which is valid schema.org and is exactly what **the design lock emits**. The verifier reads each node's own `@type` and never walks those keys. | recurse into `mainEntity` / `breadcrumb` |

---

## C. Non-blocking — prompt text that does not match the repo

### C1. §2 names the wrong route file.

> "The page shares `src/pages/product/[category]/index.tsx` with the rest of the cluster."

`[category]/index.tsx` is the **category hub** route (`/product/container-houses`).
`/product/container-houses/luxury-container-houses` is served by
`src/pages/product/[category]/[slug].tsx`. This branch edits `[slug].tsx` and leaves
`index.tsx` untouched.

The same distinction explains why the "zero delta" structural diff in §5.3 cannot be
literally zero: the design lock is a **hub** and this is a **product** page, so the
product route's embedded calculator (13 `<section>` elements) has no counterpart on the
lock. That divergence predates this page — PO-01 through PO-08 all carry it — and §3.11
forbids touching it. `ch02-gate1-structural-diff.txt` classifies every remaining delta
onto one of the four permitted axes.

### C1b. The cluster gained a fourth live sibling after the pack was signed.

§3.6 says Explore the Range and You may also like resolve from "the approved
container-houses list, current page excluded, rendering only URLs that return 200",
and adds: *"Today that is the hub, `shipping-container-homes` and
`prefab-container-homes`."*

That was true when the pack was written. Since then **CH-FPK-06** merged (PR #203,
commit `a86f195b`) and `/product/container-houses/flat-pack-container-homes` is now in
`approvedProductionPaths` and returns 200. The approved list is four paths, but the
CH-02 pack's `explore_the_range.tiles` and `you_may_also_like.tiles` name three.

**This branch renders the pack's three and does not add a fourth.** Adding one would
change a signed internal-link set without a ruling, and the repo's own precedent is that
cluster rail freshness is fixed in a dedicated cluster ticket, not folded into a page
build - that is exactly what PO-CLUSTER-02 (PR #197) and PO-CLUSTER-03 (PR #198) did for
the Portable Office cluster, after a page built in August "never learned about a sibling
that went live in September".

So: the three tiles here are correct against the pack and all three return 200, but the
container-house cluster now needs the same treatment those two tickets gave Portable
Office. Flagging rather than acting.

### C2. §3.4 says the six description images go "one per size section" of the Description tab.

The Description tab has no size sections — its nine approved H2 sections are topical
(pricing, legality, delivery, warranty…). The images are therefore placed by the shared
`injectInfoImages()` (`src/lib/infoImageLayout.ts`), the same mechanism the design lock
uses, which spreads them evenly through the body copy and guarantees a full paragraph
above and below each one. All six render **inside** the Description tab and none appears
as a band between Section 2 and Section 3, which is what §3.4 actually rules.

### C3. The Description tab's FAQ run has no heading in the copy pack.

`description_tab` carries `faq` but no heading for it, and §1 forbids fallback text. The
heading **"Questions buyers ask about the luxury build"** is read from the approved draft
(`CH-02-luxury-container-houses-draft-v1.md`, Block 11), and `ch02-generate-page-data.py`
asserts it is present in that file rather than composing it. No string is invented.
