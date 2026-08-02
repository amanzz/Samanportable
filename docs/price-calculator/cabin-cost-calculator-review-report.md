# Cabin cost calculator review report

PR: https://github.com/amanzz/Samanportable/pull/110

Review URL: https://github.com/amanzz/Samanportable/pull/110

Preview route: `/cabin-cost-calculator`. PR #110 has no deployment check or preview comment, so no externally hosted preview URL was available to report without performing a prohibited deployment.

The route now renders the v9 port as server-generated HTML from `src/lib/cabinCalculatorSSR.ts`. The first response contains every step, option, rate, table, estimate line, SVG, explainer and FAQ. The only calculator client code is the 18,452-byte deferred vanilla enhancement module at `public/scripts/cabin-cost-calculator.js`. It creates no elements or HTML and makes no pricing request.

The legacy calculator is the React page at `/portable-cabin-price-calculator`. That route is not used by the new calculator and remains byte-identical to `origin/static-migration`. It was not retired or modified. The intermediate hydrated component created earlier in this PR was removed after SAMAN fixed the architecture at SSR HTML.

## Blocker resolution

`src/lib/socialCore.d.ts` was an untracked 701-byte file containing 701 binary NUL bytes and no TypeScript declarations. TypeScript reported `TS1127: Invalid character` at line 1, columns 1 through 701. It was not mojibake. It had no Git history and no source or script importer. The dead corrupt file was deleted without an ignore, compiler exclusion or skip setting. Commit `96499e89` records the evidence independently.

## Verification summary

- V9 area-band verification: 38 ladders, 342 rows, 0 mismatches. Diff: empty.
- Rate-card verification: 57 build rates, 18 freight bands and GST checked. Diff: empty.
- Labour datasets versus live C-06 page data: diff empty.
- Container-house source mapping and derived ladders: diff empty.
- Hub anchor declarations: one occurrence each, all four unique, no exact primary-keyword match. Diff: empty.
- Static tap-target audit: 44 px minimum, 11 number input templates, 13 inputmode declarations and 7 ARIA-label templates. Diff: empty.
- Reserved enhanced step-panel height: 560 px desktop and 610 px mobile.
- Calculator-scope em dash count: 0.
- TypeScript: pass.
- Lint: pass, zero warnings.
- Next production compilation: pass, 40 static pages generated and all dynamic SSR routes compiled.
- Route count: 450 to 451, exactly +1.
- Standalone raw HTML serves no Next page runtime and no `__NEXT_DATA__`. Its only calculator script is the 18,452-byte deferred vanilla module. No new dependency.
- Product hub route-owned bundle before and after: 28,090 bytes raw / 8,522 bytes gzip, byte-identical.
- Product child route-owned bundle before and after: 24,357 bytes raw / 7,439 bytes gzip, byte-identical.
- Product total manifest assets moved from 740,680 to 741,324 bytes raw on the hub and 736,947 to 737,591 bytes raw on the child because the shared site compilation changed by 644 bytes. The calculator-specific product chunks did not change, the lockfile did not change, and no calculator enhancer is served on embedded pages.
- Postbuild: pass after updating the explicit route-count guards to 451 total and 159 unfiltered product routes.
- Sitemap: `/cabin-cost-calculator` present in `public/sitemap-products.xml`.
- Production HTTP verification: 200 with exact title, meta, self-canonical, index/follow, FAQ schema and SSR body copy.

The in-app browser returned `No browser is available.` Screenshots at 360, 768 and 1440, browser-measured CLS, axe-core and Lighthouse metrics could not be produced. Per SAMAN's ruling, all non-browser evidence was delivered instead. Static focus, ARIA, fixed mobile bar, reserved-height and tap-target gates pass. No alternate browser-control surface was used.

## Raw HTML and JavaScript-disabled evidence

Production `curl` results:

| Route | HTTP | SSR step headings | Product tables | Published rows | Numeric price cells |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/cabin-cost-calculator` | 200 | 9 of 9 | 19 | 159 | 300 |
| `/product/labor-colony` | 200 | 8 of 8 | 1 | 6 | 12 |
| `/product/labor-colony/labor-sheds` | 200 | 8 of 8 | 1 | 6 | 12 |
| `/product/labor-colony/labor-hutments` | 200 | 8 of 8 | 1 | 6 | 12 |
| `/product/labor-colony/prefab-labor-camps` | 200 | 8 of 8 | 1 | 6 | 12 |

- Standalone response: 147,527 bytes, 4,878 text words. Calculator fragment: 86,697 bytes and 4,445 words.
- Labour hub calculator fragment: 36,971 bytes and 1,411 words.
- Framework hydration word diff on standalone: 4,878 source words versus 4,878 after framework hydration, diff 0, because the route serves no framework runtime and no Next data payload.
- The embedded calculator is an opaque server HTML string inside the existing Description renderer. Its route-owned hydration chunks are byte-identical before and after.
- FAQPage JSON-LD, all four FAQ answers and both explainer sections are present in view-source.
- A shared request with `length=12&width=11` returned `12×11 ft · 132 sq ft` and `₹1,81,500` in raw source before any script ran.
- Native form action is `POST /api/enquiry`. An empty HTML POST returned HTTP 303 to `/cabin-cost-calculator?submit_error=1`; JSON validation still returned HTTP 400 JSON.
- Noscript contains the tables/options/form summary and no enable-JavaScript apology.
- Network code audit: one runtime `fetch`, exclusively the enhanced quotation POST to `/api/enquiry`; pricing/rate/ladder fetches: 0.
- DOM creation audit: `createElement`: 0; `innerHTML`: 0.
- Exact calculator page title, meta, canonical, H1 and index/follow were verified from production source.

## Formula and estimate checks

- 20 x 10 Porta Cabin: 200 sq ft x Rs 1,250 = Rs 2,50,000 ex-GST.
- 12 x 11 custom: 132 sq ft; below 200 band; reference rate Rs 1,250 x 1.10 = Rs 1,375; base Rs 1,81,500 ex-GST.

Fully loaded hand recomputation, one 20 x 10 Porta Cabin:

| Line | Hand calculation | Ex-GST |
| --- | --- | ---: |
| Published base | 200 x 1,250 | Rs 2,50,000 |
| Height 9.5 ft | 6% x base | Rs 15,000 |
| Flat roof | 4% x base | Rs 10,000 |
| GI frame | 200 x 45 | Rs 9,000 |
| One partition | 10 x 8.5 x 300 | Rs 25,500 |
| PVC walls | 570 x 70 | Rs 39,900 |
| PVC ceiling | 200 x 65 | Rs 13,000 |
| SPC flooring | 200 x 180 | Rs 36,000 |
| 60 mm PUF delta | 770 x 7.4 | Rs 5,698 |
| Extra glass door | 1 x 14,000 | Rs 14,000 |
| Two 3 x 3 uPVC windows | 18 x 610 | Rs 10,980 |
| Electrical defaults | 5 LEDs, 2 fans, 4 plugs, 1 external light | Rs 12,000 |
| Furniture | 2 workstations and 1 manager table | Rs 20,000 |
| Freight at 200 km | 150 to 200 km band | Rs 32,500 |
| Total ex-GST | sum | Rs 4,93,578 |
| GST | 18% | Rs 88,844.04 |
| Total incl-GST | sum | Rs 5,82,422.04 |

## Labour-colony live dataset comparison

Each entry is configuration, built-up area, worker capacity and published ex-GST price. The UI imports the live JSON variants and does not copy their ladder into the component.

- Labour Colony: 60x24 G+1, 2,880, 58 to 72, Rs 19,44,000; 90x24 G+1, 4,320, 86 to 108, Rs 29,16,000; 90x24 G+2, 6,480, 129 to 162, Rs 43,74,000; 120x24 G+1, 5,760, 115 to 144, Rs 38,88,000; 118x30 G+1, 7,080, 142 to 177, Rs 47,79,000; 120x24 G+2, 8,640, 173 to 216, Rs 58,32,000.
- Labor Sheds: Rs 19,69,920; Rs 29,54,880; Rs 44,32,320; Rs 39,39,840; Rs 48,42,720; Rs 59,09,760.
- Labor Hutments: Rs 19,82,880; Rs 29,74,320; Rs 44,61,480; Rs 39,65,760; Rs 48,74,580; Rs 59,48,640.
- Prefab Labor Camps: Rs 19,56,960; Rs 29,35,440; Rs 44,03,160; Rs 39,13,920; Rs 48,10,860; Rs 58,70,880.

## Container-house preview ladders

Rates are rounded to the nearest rupee first, then multiplied by area. Prices are ex-GST and remain preview values pending SAMAN approval.

| Product | 10x10 | 20x8 | 20x10 | 20x12 | 30x10 | 40x8 | 20x20 | 40x10 | 40x12 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| container-houses | 1,83,400 | 2,93,440 | 3,33,400 | 3,84,240 | 4,80,300 | 5,01,440 | 6,26,800 | 6,26,800 | 7,36,320 |
| prefab-container-homes | 1,58,100 | 2,52,960 | 2,87,600 | 3,31,200 | 4,14,000 | 4,32,320 | 5,40,400 | 5,40,400 | 6,35,040 |
| shipping-container-homes | 2,27,700 | 3,64,320 | 4,14,000 | 4,76,880 | 5,96,100 | 6,22,720 | 7,78,400 | 7,78,400 | 9,13,920 |
| affordable-container-homes | 1,58,100 | 2,52,960 | 2,87,600 | 3,31,200 | 4,14,000 | 4,32,320 | 5,40,400 | 5,40,400 | 6,35,040 |
| luxury-container-houses | 2,37,600 | 3,80,160 | 4,32,000 | 4,97,760 | 6,22,200 | 6,49,600 | 8,12,000 | 8,12,000 | 9,53,760 |

## Feature-parity checklist

| Competitor component | Status | Evidence |
| --- | --- | --- |
| Product tiles | PRESENT | Step 1 has 19 SSR tiles, including Toilet Cabin quote mode, five priced container homes and all four C-06 labour products. |
| L / W / H | PRESENT | Step 2 has numeric or decimal inputmode, 6 to 60 ft validation and inline ruled guidance. |
| Plan views | PRESENT | Step 2 and Step 5 switch between a 2D plan and four SVG elevations. |
| Rooms | PRESENT | Steps 2 and 3 select one to four rooms; partition pricing is itemised. |
| Roof | PRESENT | Sloped included and flat or mono-pitch +4% choices. |
| Materials grids | PRESENT | Structure, wall, ceiling, flooring and PUF thickness grids use the rate card. |
| Door placement | PRESENT | Per-door wall, percentage position, hinge side and inward or outward opening. |
| Window size and track | PRESENT | Per-window type, width, height, wall, percentage position, 2-track or 2.5-track. |
| Electrical suggestions | PRESENT | Area-based suggestions plus quantity steppers and light colour or shape choices. |
| Furniture add-ons | PRESENT | Full ruled furniture and fitting list, quantity steppers, position and mobility. |
| Delivery toggles | PRESENT | Free zones, road distance ladder, trailer delta and installation quotation toggle. |
| Quotation form | PRESENT | Full name, required mobile and email, optional company or location or notes; name split and full serialized enquiry message. |
| Sticky estimate | PRESENT | Desktop sticky card and fixed 360 px mobile bottom summary with expandable sheet. |
| PDF | PRESENT | Print stylesheet with exact five-line letterhead, itemised estimate, generated `SP-EST` reference and exact footer. |
| Share | PRESENT | Compact URL state, copy-link message and WhatsApp itemised text plus exact share URL. |
| Save | PRESENT | Guarded localStorage save and ruled restore banner; shared or saved state excludes contact PII. |

## Hub links

- `/product/porta-cabins`: `estimate your cabin cost live`
- `/product/portable-office`: `build a live price estimate`
- `/product/container-offices`: `price your configuration online`
- `/product/labor-colony`: `size and price a colony building`

All are injected at the render layer. The source wp-export files and product L3 zones remain untouched.
