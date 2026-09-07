# SCH-02 — `verify_sch02.py` v2: 276 asserts, **1 failure**, and it is not reachable from the page

Build ticket v2 §9: *"If PASS is not reachable, stop and report the failing assert with
its line number instead of deploying."* This is that report.

## Where this stands

`verify_sch02.py` was replaced with **v2** at 00:01 on 7 Sep 2026, mid-build. v2 fixes all
three verifier defects the v1 report raised (D1 missing `html.unescape()`, D2 the raw-`&`
title comparison, D3 the top-level-only JSON-LD scan) and re-scopes the shared-chrome
asserts (S1) so Header, Footer and the Section 4 calculator are exempt when the design
lock carries the same text.

**Against v2 this page goes from 8 failures to 1.** Every finding in the earlier report was
accepted. The single remaining failure is a residual oversight in v2 itself.

```
asserts run: 276   failures: 1
  FAIL: 1 copy strings not found in rendered HTML, first:
        ['Shipping container homes converted from real cargo shells. Six sizes f']
RESULT: FAIL
```

## The one failure — line 148, caused by the exclusion list at lines 140–142

```python
for s in _walk_strings({k: v for k, v in COPY.items()
                        if k not in ("canonical", "source", "page_id", "slug",
                                     "cluster", "generated")}, []):     # lines 140-142
    ...
    if plain not in TEXT:
        miss.append(plain[:70])
ck(not miss, "%d copy strings not found in rendered HTML, first: %s" % (len(miss), miss[:5]))  # line 148
```

`meta` is no longer excluded from this walk, so `meta.description` is required to appear in
`TEXT`. It cannot:

- `TEXT` is built at line 76 as `re.sub(r"<[^>]+>", " ", H)` — every **tag** is replaced by a
  space, so the whole `<meta name="description" content="...">` element disappears.
- A meta description lives in an **attribute**, never in element text. `meta.title` passes
  only incidentally, because `<title>…</title>` *is* element text.

**The string is already asserted correctly, and it passes.** Lines 121–124 compare the real
meta tag to the pack:

```python
md = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', html_src)
ck(md is not None, "no meta description")
if md:
    ck(norm(md.group(1)) == norm(COPY["meta"]["description"]), ...)   # PASSES
```

Measured: `meta tag matches pack: True`.

So the description is verified once, correctly, and then required a second time somewhere
it can never be.

**This is not a template convention.** The design lock does not render its own meta
description in body copy either — measured on the same local build:

```
design lock meta description: "Porta cabin & portable cabin range by SAMAN. Six published size options, a publi..."
...rendered in the lock's body TEXT?  False
```

Putting the meta description into visible body copy would also mean inventing a placement
the content map does not specify: the visible opener is `hero.short_description`, and Part B
Block 0 maps `meta.description` to the meta description and nothing else.

**Fix (one line):** restore `"meta"` to the exclusion list, as v1 had it —

```python
if k not in ("meta", "canonical", "source", "page_id", "slug", "cluster", "generated")
```

With that, this build is expected to reach `RESULT: PASS` with no page change.

I have not edited the verifier.

---

## Independent evidence that the page is correct

The Template Conformance Gate (`scripts/sch02-conformance-gate.py`, artefacts `01`–`06`)
passes with **zero failures**, and it unescapes entities and walks nested JSON-LD the way
v2 now does:

```
every copy-pack string renders (entities unescaped):
  strings checked : 123
  not found       : 0
meta title == pack (unescaped)       : True
meta description == pack (unescaped) : True
exactly one H1 : True    no empty/duplicate alt : True
every img has width and height : True    no PNG shipped : True
zero U+2014 in body copy : True    all four tab panels : True
structured data (incl. nested) : AggregateOffer, BreadcrumbList, FAQPage, ItemPage, Product…
  Review absent : True     AggregateRating absent : True
  FAQ byte-identical to tab : True
cluster links emitted by THIS PAGE : the four approved destinations only
```

Validator delta against a pristine worktree at the base commit: **zero newly failing
validators**. Mobile CLS 0.0000 here, on the design lock and on production.

## Also blocked, and reported rather than worked around

`public/specs/shipping-container-homes-technical-specification.pdf` (2 Aug 2026)
republishes exactly what corrections 1 and 2 withdraw: the Rs 3,64,320–9,13,920 ladder, a
5-year structural warranty, and "relocation skid provision" / coastal-duty framing. Linking
it from the corrected page would put all of it back one click away, so the product JSON sets
`specPdfDisabled: true` — the repo's existing LC-02 opt-in for *"a PDF that exists but is
unsigned/draft and must not be linked."* The control still renders, disabled, so the design
lock's layout is unchanged. The PDF needs re-issuing from the approved workbook.

---

## Note on link status: probed against the MERGED build, not production

`scripts/sch02-link-status.json` is probed against this branch's own production build
(`http://127.0.0.1:3260`), which is the state that deploys, and it is what the ticket
means by *"every destination confirmed 200 at build time"*.

That matters for one destination today. CH-FPK-06 merged Flat-Pack Container Homes into
`static-migration` on 7 Sep, so it answers **200 in the merged build** and is now the
fourth Explore the Range tile — but production has not deployed it yet and still answers
**404**. The two land together, so the tile is correct on deploy. Re-running
`scripts/sch02-probe-link-status.py` followed by `scripts/sch02-build-tile-meta.py` and
`scripts/sch02-generate-page-data.py` re-resolves the panel from whatever is live at that
moment; no tile is ever hand-written.

Still excluded, and still verified rather than assumed: `container-farmhouse` and
`expandable-container-house` answer 404, and `tiny-container-homes` answers **301 to this
very page**.
