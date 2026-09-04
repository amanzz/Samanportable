# PO-01 — one input conflict, held for a SAMAN ruling

`verify_po01.py` returns **379 PASS / 1 FAIL**. The single failure is not a build
defect: it is a contradiction between the copy pack and the design lock, and it
cannot be resolved without breaking one of them. Per the build prompt
("If anything in the inputs is ambiguous or contradicts the repo, stop and report
the exact conflict; do not improvise"), it is reported rather than worked around.

## The failing check

```
FAIL old-page string absent: Freight tables and delivery terms
```

Source: `copy.old_page_strings_absent[4]`.

## Where the string comes from

`src/components/ProductTabs.tsx:392` — the shared Product Details tab strip:

```tsx
{shippingHtml && shippingHtml.trim()
  ? 'Freight tables and delivery terms'
  : 'Delivery information and warranty details'}
```

It is the **subtitle under the "Shipping & Delivery" heading**, rendered by the
shared component on every page that supplies a shipping panel.

## Why it is not removable on this page alone

Measured on the preview build and on production:

| Page | renders the string? |
|---|---|
| `/product/porta-cabins` — **the design lock** | yes (local **and** live) |
| `/product/portable-office/small-office-cabin` — SOC-01, approved & merged in #185 | yes (local **and** live) |
| this build | yes |

Removing it would require editing `ProductTabs.tsx`, a shared component. That
would (a) change every other product page, (b) break Template Conformance Gate 1
and Gate 4, which require zero delta against the design lock other than the four
permitted content kinds, and (c) contradict the design lock's own rule:
"Anything else that differs means the build is wrong."

It is also not reachable through the sanctioned escape hatch — an opt-in prop
defaulting to false — without adding a prop whose only purpose is to suppress a
string the reference page displays.

## Why the pack most likely lists it

The audit row that generated this entry reads:

> Shipping tab | 318 chars, generic panel, heading says 'Freight tables and
> delivery terms' **with no tables** | shared freight component: 4 tables, 64 rows

The defect was the *absent tables*, not the subtitle — the subtitle was flagged
because on the old page it promised tables that were not there. That substantive
defect is fixed, and the page now matches the design lock exactly:

| | live before | this build | design lock |
|---|---|---|---|
| Shipping panel text | 318 chars | **3,035 chars** | 3,035 chars |
| Tables | 0 | **4** | 4 |
| Rows | 0 | **64** | 64 |
| Zone city tables, free-delivery lines, ODC note, tentative-price disclaimer | absent | **present** | present |

The subtitle is now accurate on this page for the first time.

## What is needed

One of:

1. **Strike the entry from the pack** (recommended). `old_page_strings_absent`
   drops `"Freight tables and delivery terms"`; the verifier then returns
   `RESULT: PASS`. The string is a shared-template label, not page copy, and it
   is now true.
2. **Rule that the shared subtitle changes site-wide**, in which case it is a
   separate ticket against `ProductTabs.tsx` covering every product page, not a
   PO-01 change.

No code in this PR depends on which is chosen. Nothing else in the verifier fails.
