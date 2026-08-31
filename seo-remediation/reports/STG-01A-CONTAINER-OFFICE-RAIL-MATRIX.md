# STG-01A Container Office rail matrix

Date: 2026-08-26

Previous validated base: `4fcb0d089404ecc966d343df89bdd74ecd8ddf44`

Latest production base: `3346a532306c52932aeb2d813591bf95cb37716b`

Validated integration: `60b494b7cfce92d920787a326f03ae2a1ff43ed3`

## Decision basis

The table distinguishes the hub/sibling product rail from the shared You May Also Like (YMAL) order. A value such as `Hub: no; YMAL: yes` means the child existed in the file's secondary Container Offices rail but was not rendered by the primary hub/sibling keep list. The New Approved plan column is represented by the controlled commercial-architecture fixture; none of these paths appears in the planned-release cohort.

The pre-resolution decision used the validated `60b494b7` production-equivalent baseline recorded by `PRODUCTION-BASE-INTEGRATION-READINESS.md`. After reconciliation, STG-01A re-ran the route and metadata checks against the `3346a532` candidate. All nine rows below returned direct 200, self-canonical, `index, follow`; the dedicated rail validator also confirmed child-specific hub anchors and child-to-hub links.

| Child name | URL | Present in old validated base? | Present in latest production? | Present in validated integration? | Present in New Approved plan? | Approved-production fixture? | Planned-release fixture? | Source product record exists? | Source status | Temporarily gated among the 63? | Current local HTTP result | Canonical/indexability | Final rail decision | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Container Office Cabin | `/product/container-offices/container-office-cabin` | Hub: yes; YMAL: yes | Hub: yes; YMAL: yes | Hub: yes; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Established approved child in every primary rail version. |
| Shipping Container Office | `/product/container-offices/shipping-container-office` | Hub: yes; YMAL: yes | Hub: yes; YMAL: yes | Hub: yes; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Established approved child; production keeps the specific rail label `Shipping Container Office`. |
| Site Office Container | `/product/container-offices/site-office-container` | Hub: yes; YMAL: yes | Hub: yes; YMAL: yes | Hub: yes; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Established approved child in every primary rail version. |
| Flat-Pack Container Office | `/product/container-offices/flat-pack-container-office` | Hub: no; YMAL: yes | Hub: yes; YMAL: yes | Hub: no; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Latest production promoted this approved, published, child-specific intent into the primary rail. |
| Multi-Story Container Office | `/product/container-offices/multi-story-container-office` | Hub: no; YMAL: yes | Hub: yes; YMAL: yes | Hub: no; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Latest production promoted this approved, published, child-specific intent into the primary rail. |
| Containerized Data Center | `/product/container-offices/containerized-data-center` | Hub: no; YMAL: yes | Hub: yes; YMAL: yes | Hub: no; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Approved specialized Container Offices child retained from latest production. |
| BESS Container | `/product/container-offices/bess-container` | Hub: no; YMAL: yes | Hub: yes; YMAL: yes | Hub: no; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Approved specialized Container Offices child retained from latest production. |
| Container Marketing Office | `/product/container-offices/container-marketing-office` | Hub: no; YMAL: yes | Hub: yes; YMAL: yes | Hub: no; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `KEEP_PRODUCTION_CHILD` | Approved customer-facing office intent retained from latest production. |
| Expandable Container Office | `/product/container-offices/expandable-container-office` | Hub: no; YMAL: yes | Hub: no; YMAL: yes | Hub: yes; YMAL: yes | Yes | Yes | No | Yes, both product stores | `publish` | No | 200 direct (STG-01A) | Self-canonical; `index,follow` (STG-01A) | `ADD_EXPANDABLE_CONTAINER_OFFICE` | Explicit STG-01A ruling; approved/live RB-01C child retained exactly once. |

## Reviewed resolution

- Structural starting point: latest production `3346a532`.
- Retained production ordering and all eight production primary-rail children.
- Added `expandable-container-office` once at the end of the primary child order.
- Retained the production-specific Shipping Container Office tile label and all production YMAL blurbs.
- Retained the validated shared publication gate and exact temporary-gating listing filter outside this file. Those filters remove draft, planned and temporarily gated records before the ordering function receives products.
- Added no alias, redirect, product-category archive, planned URL, draft URL or temporarily gated URL.

No row is `REVIEW_REQUIRED`; all production-added children satisfy the eight explicit inclusion conditions and the runtime checks. A separate strict schema-presence diagnostic found missing Breadcrumb schema on Site Office Container, Flat-Pack Container Office and Multi-Story Container Office. That pre-existing template/schema issue does not change their rail inclusion decision, but it blocks the overall STG-01A readiness recommendation until separately authorized and corrected.
