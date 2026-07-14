# T8.3 — Blog Coverage Expansion via Content Classification

**Ticket:** SHIKHAR T8.3 · **Branch:** `feat/shikhar-T8.3-blog-coverage` off `origin/static-migration` @ 3ac9934 (T8.2 merged)
**Date:** 14 Jul 2026 · **Packet:** `content-drafts/T8.3_Blog_Coverage_ContentClassification_Packet_14Jul2026.md`

## Method

Every post that renders no module today is classified from its OWN CONTENT — title first
(highest weight), then body text — against the packet phrase table. A cluster is assigned only
when exactly one cluster matches, or when one cluster is the sole TITLE match (title beats
body-only matches). Zero signal, or 2+ clusters with no clean title winner → UNCLASSIFIED → no
module. Nothing is guessed. The 160 posts T8.2 already covers by category are not re-touched.

### Hard-conflict guards — owner ruling, 14 Jul 2026

The packet is self-contradictory here. Line 50 lets a clean title tiebreak rescue a conflicted
post; acceptance criterion #4 requires that *no* post carrying hard-conflict signals gets a
module. The owner ruled:

- **`porta cabin` + `portable cabin` co-present → UNCLASSIFIED, always.** No title tiebreak.
  That boundary is never guessed, even when the title looks unambiguous. (10 posts)
- **PEB-family** (industrial-sheds / pre-engineered-buildings / peb-constructions /
  prefab-buildings) and **prefab commercial-vs-residential** conflicts → a clean sole-title-cluster
  winner DOES rescue the post, per line 50.

## Totals

| Metric | Count |
|---|---|
| Post JSON files on disk | 360 |
| Excluded — slug 301-redirects, never render as a post | 77 |
| **Posts in scope** | **283** |
| Covered by T8.2 (category-resolved) | 160 |
| Module-less before T8.3 | 123 |
| **Newly classified by T8.3 (content-resolved)** | **103** |
| Residual UNCLASSIFIED — no module, by design | 20 |
| **New total coverage** | **263 / 283 (92.9%)** |

Coverage before T8.3: **160 / 283 (56.5%)** → after: **263 / 283 (92.9%)**.

## Newly classified, by cluster

| Hub | Posts |
|---|---|
| `/product/container-cafe` | 1 |
| `/product/container-houses` | 1 |
| `/product/container-offices` | 13 |
| `/product/industrial-sheds` | 6 |
| `/product/labor-colony` | 1 |
| `/product/porta-cabins` | 29 |
| `/product/portable-cabin` | 27 |
| `/product/portable-office` | 15 |
| `/product/portable-toilet` | 1 |
| `/product/pre-engineered-buildings` | 3 |
| `/product/prefab-buildings` | 1 |
| `/product/prefabricated-houses` | 5 |
| **Total** | **103** |

## UNCLASSIFIED — render no module

| Reason | Count |
|---|---|
| `boundary-pair-porta-vs-portable` | 10 |
| `ambiguous-no-title-tiebreak` | 9 |
| `ambiguous-multi-title-cluster` | 1 |
| **Total** | **20** |

### Every UNCLASSIFIED post

| Slug | Reason | Competing cluster signals |
|---|---|---|
| `2nd-hand-containers` | ambiguous-no-title-tiebreak | container-houses, industrial-sheds |
| `budget-friendly-office-workspace-alternatives` | ambiguous-no-title-tiebreak | portable-office, industrial-sheds |
| `container-houses-cost-guide-2024` | boundary-pair-porta-vs-portable | porta-cabins, container-offices, container-houses, portable-cabin |
| `container-offices-in-greater-noida` | ambiguous-multi-title-cluster | container-offices, industrial-sheds, portable-office |
| `cost-of-prefab-homes` | boundary-pair-porta-vs-portable | prefabricated-houses, porta-cabins, portable-cabin, portable-office |
| `discount-mobile-office-units` | ambiguous-no-title-tiebreak | container-offices, portable-office, security-cabins, prefab-buildings |
| `in-the-long-run-are-prefabricated-industrial-buildings-more-cost-effective` | ambiguous-no-title-tiebreak | portable-office, industrial-sheds, prefab-buildings |
| `low-cost-modular-office-solutions` | ambiguous-no-title-tiebreak | portable-office, prefab-buildings |
| `porta-cabins-in-hebbal` | ambiguous-no-title-tiebreak | porta-cabins, security-cabins |
| `porta-cabins-in-malleshwaram` | boundary-pair-porta-vs-portable | porta-cabins, portable-cabin |
| `portable-cabins-in-frazer-town` | boundary-pair-porta-vs-portable | portable-cabin, porta-cabins, portable-office, security-cabins |
| `portable-cabins-in-mg-road` | boundary-pair-porta-vs-portable | portable-cabin, porta-cabins, portable-office |
| `portable-classroom-for-sale-2` | ambiguous-no-title-tiebreak | portable-cabin, prefab-buildings |
| `portable-sheds-complete-guide-2024` | ambiguous-no-title-tiebreak | labor-colony, portable-office, industrial-sheds |
| `portacabins-for-sale-in-frazer-town-2` | boundary-pair-porta-vs-portable | porta-cabins, portable-cabin, portable-office |
| `prefab-homes-mumbai` | boundary-pair-porta-vs-portable | prefabricated-houses, porta-cabins, portable-cabin, portable-office |
| `prefabricated-houses-in-hyderabad` | boundary-pair-porta-vs-portable | prefabricated-houses, porta-cabins, portable-cabin, portable-office |
| `temporary-garden-shed` | ambiguous-no-title-tiebreak | container-offices, porta-cabins, portable-cabin, industrial-sheds, prefab-buildings |
| `top-rated-portable-cabin-supplier-delhi` | boundary-pair-porta-vs-portable | portable-cabin, labor-colony, porta-cabins, portable-toilet, security-cabins, industrial-sheds, prefab-buildings |
| `types-of-container-offices` | boundary-pair-porta-vs-portable | container-offices, porta-cabins, portable-cabin, portable-office, security-cabins |

## Every newly-classified post

| Slug | Assigned hub | Matched phrase(s) | Title match |
|---|---|---|---|
| `best-container-cafe-designs-for-experience` | `/product/container-cafe` | `container cafe`, `container coffee` | yes |
| `container-house-price-in-tamil-nadu` | `/product/container-houses` | `container house`, `container home` | yes |
| `best-container-office-solutions` | `/product/container-offices` | `container office`, `office container`, `shipping container office` | yes |
| `container-office-rental-is-perfect-solution` | `/product/container-offices` | `container office` | yes |
| `container-offices-for-sale-in-bommasandra` | `/product/container-offices` | `container office` | yes |
| `container-offices-for-sale-in-hosur` | `/product/container-offices` | `container office` | yes |
| `container-offices-for-sale-in-jp-nagar` | `/product/container-offices` | `container office` | yes |
| `container-offices-in-central-delhi` | `/product/container-offices` | `container office` | yes |
| `container-offices-in-faridabad` | `/product/container-offices` | `container office` | yes |
| `container-offices-in-south-delhi` | `/product/container-offices` | `container office` | yes |
| `container-offices-in-west-delhi` | `/product/container-offices` | `container office`, `office container` | yes |
| `container-offices-price` | `/product/container-offices` | `container office` | yes |
| `second-hand-container-office` | `/product/container-offices` | `container office`, `office container`, `shipping container office`, `container site office` | yes |
| `sustainable-construction` | `/product/container-offices` | `container office` | yes |
| `why-you-need-to-consider-a-container-office` | `/product/container-offices` | `container office` | yes |
| `industrial-sheds-in-bangalore` | `/product/industrial-sheds` | `industrial shed`, `steel shed`, `storage shed`, `warehouse` | yes |
| `portable-car-shed` | `/product/industrial-sheds` | `industrial shed`, `steel shed`, `warehouse` | body only |
| `portable-carports` | `/product/industrial-sheds` | `industrial shed`, `steel shed`, `warehouse` | body only |
| `prefabricated-warehouse-manufacturer-in-bangalore` | `/product/industrial-sheds` | `warehouse`, `industrial shed` | yes |
| `temporary-garage-shelter` | `/product/industrial-sheds` | `industrial shed`, `steel shed`, `warehouse` | body only |
| `temporary-shed` | `/product/industrial-sheds` | `industrial shed`, `steel shed`, `storage shed`, `warehouse` | body only |
| `what-is-a-labour-hutment` | `/product/labor-colony` | `labour hutment`, `labour colony`, `worker accommodation` | yes |
| `2nd-hand-porta-cabins` | `/product/porta-cabins` | `porta cabin` | yes |
| `best-porta-cabin-manufacturer-ncr` | `/product/porta-cabins` | `porta cabin` | yes |
| `best-porta-cabins-in-bangalore` | `/product/porta-cabins` | `porta cabin` | yes |
| `cheap-porta-cabins-for-sale` | `/product/porta-cabins` | `porta cabin` | yes |
| `durable-porta-cabins` | `/product/porta-cabins` | `porta cabin` | yes |
| `owning-a-porta-cabin-is-perfect` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabin-in-chennai` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabin-in-noida` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabin-price-a-complete-guide-2025` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabin-sizes-and-specifications-in-india` | `/product/porta-cabins` | `porta cabin`, `portacabin` | yes |
| `porta-cabins-in-anekal` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-banashankari` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-delhi-ncr` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-hsr-layout` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-jayanagar` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-jigani` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-jp-nagar` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-kengeri` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-koramangala` | `/product/porta-cabins` | `porta cabin`, `portacabin` | yes |
| `porta-cabins-in-marathahalli` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-in-nagarbhavi` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-is-budget-friendly-product` | `/product/porta-cabins` | `porta cabin` | yes |
| `porta-cabins-on-rent` | `/product/porta-cabins` | `porta cabin` | yes |
| `portacabins-for-sale-in-bangalore` | `/product/porta-cabins` | `porta cabin` | yes |
| `portacabins-for-sale-in-bannerghatta-road` | `/product/porta-cabins` | `porta cabin` | yes |
| `portacabins-for-sale-in-bommasandra` | `/product/porta-cabins` | `porta cabin` | yes |
| `portacabins-for-sale-in-whitefield` | `/product/porta-cabins` | `portacabin`, `porta cabin` | yes |
| `prefab-porta-cabins` | `/product/porta-cabins` | `porta cabin` | yes |
| `world-of-customized-porta-cabin` | `/product/porta-cabins` | `porta cabin` | yes |
| `18-benefits-of-luxury-portable-cabin` | `/product/portable-cabin` | `portable cabin` | yes |
| `7-tips-for-choosing-the-perfect-portable-cabin-location` | `/product/portable-cabin` | `portable cabin` | yes |
| `best-portable-cabins-in-india` | `/product/portable-cabin` | `portable cabin` | yes |
| `cheap-portable-cabins` | `/product/portable-cabin` | `portable cabin` | yes |
| `eco-friendly-portable-cabins` | `/product/portable-cabin` | `portable cabin` | yes |
| `material-specifications-features` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabin-price-in-bangalore` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabin-rental-services` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-bellandur` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-central-delhi` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-east-delhi` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-faridabad` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-ghaziabad` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-greater-noida` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-gurgaon` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-hennur` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-hoskote` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-hosur` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-indiranagar` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-kr-puram` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-magadi-road` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-north-delhi` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-peenya` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-shivajinagar` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-south-delhi` | `/product/portable-cabin` | `portable cabin` | yes |
| `portable-cabins-in-west-delhi` | `/product/portable-cabin` | `portable cabin` | yes |
| `top-quality-prefab-cabins-delhi` | `/product/portable-cabin` | `portable cabin` | body only |
| `cheap-office-trailers-for-sale` | `/product/portable-office` | `portable office`, `office cabin` | body only |
| `modern-portable-office-solutions` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabin-manufacturers-in-bangalore` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-central-delhi` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-delhi-ncr` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-east-delhi` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-faridabad` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-ghaziabad` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-greater-noida` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-gurgaon` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-noida` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-north-delhi` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-south-delhi` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `portable-office-cabins-in-west-delhi` | `/product/portable-office` | `portable office`, `office cabin` | yes |
| `sleek-prefab-office-cabins-ncr` | `/product/portable-office` | `office cabin`, `portable office` | yes |
| `portable-toilets-in-bangalore` | `/product/portable-toilet` | `portable toilet`, `mobile toilet` | yes |
| `peb-structure-cost-per-kg-india` | `/product/pre-engineered-buildings` | `peb structure` | yes |
| `peb-structure-cost-per-sq-ft-india` | `/product/pre-engineered-buildings` | `peb structure`, `peb building` | yes |
| `pre-engineered-buildings-in-bangalore` | `/product/pre-engineered-buildings` | `pre-engineered building`, `pre engineered building`, `peb building`, `peb structure` | yes |
| `customized-prefab-structures-ncr` | `/product/prefab-buildings` | `prefab structure`, `prefab building` | yes |
| `build-a-prefabricated-modular-houses` | `/product/prefabricated-houses` | `modular home`, `prefabricated house`, `prefab home` | yes |
| `durable-modular-homes-delhi` | `/product/prefabricated-houses` | `modular home`, `prefabricated house` | yes |
| `luxury-prefab-homes` | `/product/prefabricated-houses` | `prefab home`, `prefabricated house` | yes |
| `precast-housing-construction-guide` | `/product/prefabricated-houses` | `prefab house`, `prefabricated house` | body only |
| `prefabricated-houses-in-bangalore` | `/product/prefabricated-houses` | `prefabricated house`, `prefab house`, `prefab home`, `modular home` | yes |
