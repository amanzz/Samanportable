# GATE 4 — prop audit

Every prop passed to a shared component at this route's two call sites in
`src/pages/product/[category]/[slug].tsx`, resolved for **`portable-control-room`**
and for the merged sibling product page built to the same lock,
**`portable-weighbridge-office`** (PO-03, on `static-migration`).

The four permitted difference kinds are:
**C** copy strings · **I** images and alt text · **V** variant/size data rows and prices ·
**L** internal-link destinations and anchors.
Anything marked **D** would be a disallowed structural/behavioural difference.

## `<PortaCabinVariantHero>` — 19 props

| prop | portable-control-room | portable-weighbridge-office (PO-03) | same? | kind |
|---|---|---|---|---|
| `data` | `portable-control-room.json` | `portable-weighbridge-office.json` | differs | **C/I/V** |
| `productTitle` | Portable Control Room | Portable Weighbridge Office | differs | **C** |
| `averageRating` | `product.average_rating` | same expression | same | — |
| `ratingCount` | `product.rating_count` | same expression | same | — |
| `railItems` | `variantData.relatedTiles` (6 cluster tiles) | `variantData.relatedTiles` (5) | differs | **L/I** |
| `currentHref` | `/product/portable-office/portable-control-room` | sibling path | differs | **L** |
| `showSectionDividers` | `true` | `true` | same | — |
| `usePremiumSizeTabs` | `true` | `true` | same | — |
| `explorerPanelHeadingAsH2` | **`false`** | `true` | **differs** | see note 1 |
| `compactMobileDividers` | `false` | `false` | same | — |
| `sizeEyebrowText` | pack `hero.size_selector_label` | pack value | differs | **C** |
| `emitSizeAnchors` | `false` | `false` | same | — |
| `explorerHidePanelImages` | `false` | `false` | same | — |
| `deferNonLcpImagesUntilHeroPaint` | `false` | `false` | same | — |
| `renderOnlyActiveExplorerPanel` | `false` | `false` | same | — |
| `syncVariantSelection` | `false` | `false` | same | — |
| `eagerActiveGalleryImages` | `false` | `false` | same | — |
| `renderInactiveGalleryImages` | `false` | `false` | same | — |
| `explorerSingleColumnApplications` | `false` | `false` | same | — |

**Note 1 — the only non-content prop difference on the page, and it is the one the
PO-07 build ruling requires.** The build prompt says: *"Section 3 heading level: the lock
renders H3. Keep the `CLUSTER_DESIGN_SLUGS` H2 opt-in **off** for this slug. Do not
propagate the PO-01 to PO-04 drift."* Membership of `CLUSTER_DESIGN_SLUGS` would
otherwise switch this on, so the slug is excluded at that one call site only:

```tsx
explorerPanelHeadingAsH2={CLUSTER_DESIGN_SLUGS.has(slug) && slug !== 'portable-control-room'}
```

Every other page keeps the exact value it had. This is the source of the six
`h2 -> h3` entries in the Gate 1 structural diff.

## `<ProductTabs>` — 11 props

| prop | portable-control-room | portable-weighbridge-office (PO-03) | same? | kind |
|---|---|---|---|---|
| `description` | this page's `descriptionHtml` | sibling's | differs | **C/I** |
| `specificationsHtml` | `buildPortableControlRoomSpecificationsHtml()` | sibling builder | differs | **C/I** |
| `shippingHtml` | `buildShippingHtml()` — shared, **no options** | identical call | **same** | — |
| `productTitle` | Portable Control Room | sibling | differs | **C** |
| `reviews` | `[]` | `[]` | same | — |
| `averageRating` | `undefined` | `undefined` | same | — |
| `ratingCount` | `0` | `0` | same | — |
| `productId` | `product.id` | same expression | same | — |
| `productName` | Portable Control Room | sibling | differs | **C** |
| `fullMobileLabels` | **`false`** | `true` | **differs** | see note 2 |
| `reviewsEmptyStateText` | pack `reviews_tab.empty_state` | pack value | differs | **C** |

**Note 2 — required by the build prompt, and a correction of sibling behaviour.**
The prompt requires the four-tab strip to carry *responsive dual labels*
(Description/Info, Specifications/Specs, Shipping/Ship) and states: *"The second word of
each pair is the small-screen label and must differ from the first; `DescriptionDescription`
is a defect."* In `ProductTabs.tsx` the small-screen label is
`{fullMobileLabels ? 'Description' : 'Info'}` — so `fullMobileLabels={true}` is exactly
what produces the doubled form the prompt calls a defect. PO-01…PO-04 and SOC-01 all set
it `true`; this page leaves it at the component default (`false`) and therefore renders
`Info` / `Specs` / `Ship`, verified in the Gate 5 DOM checks. No sibling page is changed.

## Shipping tab

`shippingHtml: buildShippingHtml()` is called with **no options**, byte-identical to the
sibling and to the lock, so both trailer ladders (18 bands each), both zone city tables,
the two free-delivery lines, the ODC note and the tentative-price disclaimer all render
from the shared component. No page-specific shipping copy and no `shippingDetails`
schema were added (`verify_po07.py`: *no shippingDetails schema* → PASS; all nine
shipping-line checks → PASS).
