# SCH-02 — `verify_sch02.py` cannot reach `RESULT: PASS`. Not deployed.

Build ticket v2 §9: *"If PASS is not reachable, stop and report the failing assert with
its line number instead of deploying."* This is that report.

**Status:** the page itself is built, correct and verified — the six-artefact Template
Conformance Gate passes with zero failures (`01`–`06` in this folder), and the branch
introduces zero new validator failures against pristine `static-migration` HEAD (`08`).
The 8 remaining `verify_sch02.py` failures are **not defects in the page**. Every one is
either a defect in the verifier itself or a string that lives in shared site chrome /
the Section 4 calculator, both of which §1 and §9 of this ticket put out of bounds.

**Decisive evidence: the design lock fails the same asserts.** `porta-cabins` is the
page this ticket calls "built and correct". Measured on the same local build:

| | this page (branch) | **porta-cabins design lock** | this page (production today) |
|---|---:|---:|---:|
| `&#x27;` entities in HTML | 43 | **10** | 12 |
| top-level JSON-LD `@type` | ItemPage, FAQPage | **ItemPage, FAQPage** | ItemPage |
| anchors reading "container house" | 2 | **2** | 2 |
| "48 business hours" occurrences | 6 | **4** | 9 |

---

## A. Verifier defects — the assert cannot be satisfied by correct HTML

### A1. Line 33 — `meta title mismatch`

```python
ck(m and m.group(1).strip() == COPY["meta"]["title"], "meta title mismatch")
```

Compares the **raw** `<title>` bytes to `Shipping Container House India: 6 Sizes & Price
| SAMAN`. Correct HTML encodes that `&` as `&amp;`, so the page serves
`6 Sizes &amp; Price` and the equality can never hold. Satisfying it would require
emitting an unescaped `&` from `next/head`, which no page in this repo does.

### A2. Lines 21–29 + 66 — `copy strings not found in rendered HTML`

```python
def norm(s):                                   # line 21 — no html.unescape()
    s = unicodedata.normalize("NFKC", s)
    ...
TEXT = norm(re.sub(r"<[^>]+>", " ", H))        # line 29
ck(not miss, "copy strings not found in rendered HTML: %s" % miss[:6])   # line 66
```

`norm()` never unescapes HTML entities. `ReactDOMServer` escapes `'` → `&#x27;` and
`"` → `&quot;` in every text child, so any pack string containing an apostrophe or an
inch mark can never match. All six reported misses are exactly those strings —
`19'-6" x 7'-6"`, `4'-0" x 3'-0"`, `8'-6"`, and so on.

**This is a verifier bug, and its own sibling proves it.** `verify_po08.py`, written by
the same author for the immediately preceding page, line 22:

```python
text = H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", ...)))
```

and line 34: `H.unescape(title[0]).strip() == copy["meta"]["title"]`.
`scripts/po06-conformance-gate.py` does the same in its `plain()`.

**With that one missing `html.unescape()` supplied, all 123 copy-pack strings render and
both meta fields match exactly** — measured in `05-dom-checks.txt`:

```
every copy-pack string renders (entities unescaped):
  strings checked                    : 123
  not found                          : 0
meta title == pack (unescaped)       : True
meta description == pack (unescaped) : True
```

### A3. Lines 122–138 — `structured data missing: Product` / `BreadcrumbList`

```python
for o in (d if isinstance(d, list) else [d]):
    t = o.get("@type")                          # top level only, no recursion
    ...
for req in ["ItemPage", "Product", "BreadcrumbList", "FAQPage"]:
    ck(req in types, "structured data missing: %s" % req)   # line 138
```

Both entities **are emitted**. This repo nests them the way schema.org intends — the
Product is the ItemPage's `mainEntity` and the BreadcrumbList is its `breadcrumb`:

```json
{"@type": "ItemPage", "mainEntity": {"@type": "Product", ...,
   "offers": {"@type": "AggregateOffer", "lowPrice": 281600, "highPrice": 721920,
              "priceCurrency": "INR"}},
 "breadcrumb": {"@type": "BreadcrumbList", ...}}
```

The check only reads top-level `@type`, so it cannot see them. **No page in this repo
passes it — including the design lock**, whose top-level types are also just
`ItemPage, FAQPage`. Recursing into nested nodes finds everything §7 requires and
nothing it forbids (`05-dom-checks.txt`):

```
structured data types (incl. nested) : ['AggregateOffer', 'Answer', 'Brand',
  'BreadcrumbList', 'FAQPage', 'ItemPage', 'ListItem', 'PriceSpecification',
  'Product', 'Question']
  Review absent: True    AggregateRating absent: True
  FAQ byte-identical to tab: True
```

Making this pass would mean emitting duplicate top-level Product and BreadcrumbList
nodes — schema spam, and a divergence from the design lock.

---

## B. Out-of-boundary strings — shared chrome and the ring-fenced calculator

### B1. Line 80 — `forbidden string on page: 48 business hours`

Ticket correction 4 requires this string deleted; the verifier asserts zero occurrences
anywhere in the document. **Production carried 9. This branch reduces it to 6** by
enabling `suppressCommitmentCopy`, the repo's existing per-slug opt-in (already used by
`shipping-container-office`), which clears the calculator's own commitment lines.

The remaining 6 have no in-boundary fix:

| # | Source | Boundary |
|---|---|---|
| 1 | `src/components/Header.tsx:309` — top contact bar | Global site header, every page |
| 2 | `src/components/Header.tsx:517` — "Not sure which fits?" card | Global site header, every page |
| 3 | `src/lib/cabinCalculatorSSR.ts:409` — `submitSuccess` | Section 4 calculator |
| 4 | `src/lib/calculatorCopy.ts:27` — step-9 guidance | Section 4 calculator |
| 5–6 | `src/lib/calculatorCopy.ts:83` — estimate fine print (×2) | Section 4 calculator |

§1: *"The only sanctioned change to a shared component is an opt-in prop defaulting to
false."* §9 block 9: the calculator is *"untouched; only the `ROUTE_LADDERS` entry reads
the page's prices."* Editing `Header.tsx` would rewrite chrome on ~100 live pages.
**The design lock carries 4 of these itself.**

### B2. Line 153 — `link to retired/non-approved URL: affordable-container-homes`

Production carried 5 occurrences; this branch has 2. Both survivors are in the shared
calculator's product chooser, as a form value, not a link:

```html
<input type="radio" name="productId" value="affordable-container-homes"
       data-product-choice="1" data-ladder="affordable-container-homes">
```

Source: `src/lib/cabinCalculatorSSR.ts` product list — the ring-fenced calculator.
**Zero `<a href>` on this page points anywhere outside the approved set** — the page's
own cluster links are exactly the three the ticket permits (`05-dom-checks.txt`).

### B3. Lines 157–163 — `forbidden anchor text: 'container house'` (×2)

```
<a href="/product/container-houses">Container House</a>   ← src/components/Header.tsx:104
<a href="/product/container-houses">Container House</a>   ← src/components/Footer.tsx:70
```

The global primary nav and footer nav, identical on every page of the site — **the
design lock renders the same two**. `src/lib/seoAnchorMap.ts:22` also maps this hub to
the anchor `Container House`; this build deliberately does **not** use it for the
Explore the Range / YMAL tiles, which read each destination's own `productName`
(`Container Houses`, `Luxury Container Houses`, `Prefab Container Homes`) precisely to
stay clear of the forbidden list.

---

## What SAMAN needs to decide

1. **Patch the verifier** (recommended). Two changes bring it in line with its own
   siblings, after which this build is expected to pass outright:
   - add `html.unescape(...)` in `norm()` (line 21) and to the `<title>` comparison
     (line 33) — resolves A1 and A2;
   - recurse into nested JSON-LD nodes when collecting `@type` (lines 122–129) —
     resolves A3.
2. **Rule on correction 4 and the calculator chooser.** Removing the last six
   "48 business hours" occurrences and the two `affordable-container-homes` form values
   means editing the global `Header.tsx` and the Section 4 calculator, which §1 and §9
   forbid. Either the ticket's scope widens (a site-wide chrome change, its own ticket)
   or the assert is scoped to the page's own markup.
3. **Rule on the forbidden anchor.** Same shape: `Header.tsx:104` and the footer nav are
   global. Changing the hub's nav label is a site-wide SEO decision, not a page build.
4. **Re-issue the technical PDF** — see below.

## Also blocked, and reported rather than worked around

`public/specs/shipping-container-homes-technical-specification.pdf` (created 2 Aug 2026)
republishes exactly what corrections 1 and 2 withdraw: the Rs 3,64,320–9,13,920 ladder,
a 5-year structural warranty, and "relocation skid provision" / coastal-duty framing.
Linking it from the corrected page would put all of it back one click away, so the
product JSON sets `specPdfDisabled: true` — the repo's existing LC-02 opt-in for *"a PDF
that exists but is unsigned/draft and must not be linked."* The download control still
renders in the buy box, disabled, so the design lock's layout is unchanged. The PDF
needs re-issuing from the approved workbook before it can be linked again.
