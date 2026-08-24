# CO-00 Section 9 changeset — PREPARED, NOT APPLIED

Per build-prompt-v1 Section 9. None of this has been touched in the live
sitemap, redirects config or Merchant feed. Staged here for review only.

## Sitemap
No new URL. Remove nothing yet — the 17 out-of-plan `/product/container-offices/*`
URLs are subject to the open B1 ruling (Section 10).

## Anchors
Remove from any anchor/redirect registry: `#size-20x12`, `#size-20x20`, `#size-40x12`.
No other anchor changes.

## Merchant feed — to move in the SAME release as the page, never before or after
- Update `price` on 10x10 to Rs 1,66,750.
- Update `price` on 40x8 to Rs 4,40,800.
- Update `price` on 40x10 to Rs 5,51,000.
- 20x8, 20x10 and 30x10 unchanged — do not touch.
- Remove the `20x12`, `20x20` and `40x12` items, and any `item_group_id`
  variant entry pointing at them.
- A page price and a feed price that disagree is a price-mismatch
  disapproval; they ship together with the page, not before or after it.

## Reported, not fixed in this ticket
Two indexed `?add-to-cart=` parameter URLs exist under this path (per the
ticket, out of scope here).
