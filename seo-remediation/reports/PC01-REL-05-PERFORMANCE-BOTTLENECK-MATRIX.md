# PC01-REL-05 Performance Bottleneck Matrix

| Rank | Bottleneck | Direct evidence | Metrics affected | Scope / blast radius | Decision |
|---:|---|---|---|---|---|
| 1 | Hidden embedded calculator is rendered and hydrated in the initial document | Representative mobile run attributes ~275 ms main-thread time to `cabin-cost-calculator.js`; the route synchronously imports a 3,100-line renderer and emits the full nine-step form before any calculator interaction. The calculator contributes a large fraction of the 3,811-node DOM. | TBT, main thread, DOM, HTML bytes, route JS | Renderer is shared; behavior change must be PC-01-only. | Preserve the existing entry band and renderer, but place PC-01 calculator markup/runtime behind a viewport and keyboard activation boundary. Ordinary category hubs retain server-rendered calculators. |
| 2 | Calculator renderer is in the initial category-route module graph | Build baseline reports 581 kB first-load JS. Treemap shows very large route-loaded chunks (about 1.22 MB and 504 kB uncompressed) plus a 63 kB static calculator runtime. | First-load JS, parse/compile, TBT | Static import lives in shared `/product/[category]`; removing it changes bundling for all hubs. | Move ordinary calculator rendering into `getServerSideProps` and pass exact HTML. This retains ordinary hubs' server HTML/design while excluding the renderer from their client module graph; PC-01 dynamically imports it only on activation. Validate representative sibling hubs. |
| 3 | Main-thread rendering delays an already-correct LCP request | LCP discovery, priority and dimensions all pass; representative render delay is 501 ms. Mobile median main-thread work is 6,488 ms with 1,724 ms script evaluation and 861 ms style/layout in the representative run. | LCP, TBT, Speed Index | PC-01 initial render | Reduce unrelated below-fold DOM/client work; do not change the LCP asset, dimensions, priority or visible hero. |
| 4 | Large DOM | Lighthouse reports 3,811 mobile elements, depth 22 and 67 children on the largest node. | DOM gate, style/layout, main thread | PC-01; calculator is removable from initial tree, SEO body/FAQ/specifications are protected. | Remove only the hidden calculator form from initial DOM. Keep body copy, prices, specs, FAQ and JSON-LD server-rendered. |
| 5 | Images dominate bytes, but are mostly product content and below-fold media | Median mobile image transfer is 1.31 MB. Hero LCP asset is correctly prioritized; other imagery already uses lazy/deferred patterns. | Total bytes, Speed Index | Shared hero/gallery and locked design | No Phase A media swap. Reconsider only if primary calculator remediation misses gates, and never lazy-load the LCP image. |
| 6 | Hero component statically owns multiple product application datasets | Treemap points to a large route-loaded data chunk. The component is shared across several product families. | JS bytes, parse work | High shared blast radius and SEO-copy risk | Do not touch in Phase A. A shared dataset split would require broader owner approval and regression proof. |

## Protected invariants

- Exact hero image URL, eager/high priority behavior, width/height and responsive sizing.
- Canonical, title, meta description, H1, schema graph, six approved size/price rows, freight facts, FAQ/specification/body copy and internal links in initial server HTML.
- Existing calculator renderer, calculator rate card, product mapping, freight math, form endpoint, GA behavior and URL architecture.
- Existing calculator entry-band HTML and visual design.
- Keyboard activation and an explicit no-JavaScript route to the maintained standalone calculator.

## Phase selection

Phase A is sufficient in design: defer only PC-01's initially hidden calculator markup/runtime and remove the calculator renderer from the client page graph. Phase B will be omitted unless final five-run mobile medians miss a required gate.
