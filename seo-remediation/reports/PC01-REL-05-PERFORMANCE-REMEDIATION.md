# PC01-REL-05 Performance Remediation

## Final verdict

`BLOCKED_PERFORMANCE_TARGET_NOT_MET`

The safe Phase A checkpoint is preserved at `71fd5b5cd857fe710f19ec29355a34bd116b38ab`. It materially reduces initial rendering, JavaScript, DOM volume, main-thread work and TBT, but it does not satisfy the applicable mobile LCP target or the absolute TBT target. All experimental Phase B application changes were rejected and removed. There is no Phase B commit.

## Checkpoints and repository protection

- Source checkpoint: `4dc9b4e639169b66140416d2237cb71c24fce66e`
- Source branch: `seo/pc01-keyword-ownership-remediation`
- Protected backup: `origin/backup/seo-recovery-20260830/pc01-keyword-ownership-remediation`
- Backup commit after fetch: `4dc9b4e639169b66140416d2237cb71c24fce66e`
- Performance worktree: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-performance-remediation`
- Performance branch: `seo/pc01-performance-remediation`
- Phase A commit: `71fd5b5cd857fe710f19ec29355a34bd116b38ab`
- Production ref remained `origin/static-migration` at `3346a532306c52932aeb2d813591bf95cb37716b`.
- Local `main` remained `9188cab7e415569b85f2dddf750992cdeb5abc62`.
- Performance branch pushes, PRs, merges and deployments: zero.
- Active PDF SHA-256 remained `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96`.

The checkpoint range was inspected before the backup push. No credential, environment, profile, dependency, cache, dump or personal-file payload was found. The fetched backup ref had the same commit, tree, complete ancestry and active-PDF hash as the source checkpoint.

## Controlled environment

- OS: Windows 11
- Node: 24.16.0 (repository preference is Node 22)
- npm: 11.13.0 (repository preference is npm 10)
- Chrome: 152.0.0.0
- Lighthouse: 13.4.1
- Server: `npm run start -- --port <port>` after `npm run build`
- External requests: blocked with `--blocked-url-patterns='https://*'`
- Storage/cache reset: Lighthouse default cold-browser-cache navigation for every run
- Mobile: 412 x 823, DPR 1.75, simulated mobile throttling, 4x CPU slowdown
- Desktop: desktop preset, 1440 x 900, DPR 1, simulated desktop throttling
- Baseline: five mobile runs and three desktop runs
- Final safe checkpoint: five mobile runs and three desktop runs

The same Node/npm environment was used for baseline and final measurements. No engine or lockfile was changed.

## Baseline and safe Phase A medians

| Metric | Baseline | Phase A | Change | Required gate | Result |
|---|---:|---:|---:|---:|---|
| Mobile score | 57 | 65 | +8 points | at least 67 | FAIL |
| Mobile FCP | 1,937.717 ms | 1,472.960 ms | -24.0% | no worse than 2,034.603 ms | PASS |
| Mobile LCP | 3,887.717 ms | 3,713.588 ms | -4.5% | at least 20% better and no more than 4,000 ms; effective max 3,110.174 ms | FAIL |
| Mobile TBT | 2,582.500 ms | 1,109.206 ms | -57.0% | at least 35% better and no more than 800 ms | FAIL |
| Mobile CLS | 0 | 0 | unchanged | no more than 0.05 | PASS |
| Mobile DOM nodes | 3,811 | 1,745 | -54.2% | no more than 3,239 | PASS |
| Mobile main-thread work | 6,487.568 ms | 4,463.088 ms | -31.2% | no more than 5,190.054 ms | PASS |
| Mobile transfer | 2,225,805 B | 1,900,034 B | -14.6% | informational | PASS |
| Mobile JavaScript transfer | 650,063 B | 355,906 B | -45.3% | preserve/reduce | PASS |
| Server HTML | 551,326 B | 344,751 B | -37.5% | SEO markers preserved | PASS |
| Category first-load JS | 581 kB | 308 kB | -47.0% | no more than 523 kB | PASS |
| Desktop score | 96 | 97 | +1 point | informational | PASS |
| Desktop FCP | 509.616 ms | 347.454 ms | -31.8% | no material regression | PASS |
| Desktop LCP | 1,109.616 ms | 1,276.089 ms | +15.0% | no regression over 5% | FAIL |
| Desktop TBT | 95.500 ms | 0.000 ms median | -100% | no material regression | PASS |
| Desktop CLS | 0 | 0 | unchanged | no more than 0.05 | PASS |

The performance score cannot override the factual LCP and TBT failures. The hard-stop rule therefore applies.

## LCP and bottlenecks

The LCP element remained the approved default 20x10 hero image:

`/images/products/porta-cabins/20x10/porta-cabin-20x10-01-exterior-front-left.webp`

It is in the initial server HTML, eager, `fetchpriority="high"`, explicitly 1254 x 1254, has the existing responsive `sizes` contract, and receives one preload/priority signal. Lighthouse's discovery checks all pass. The measured bottlenecks were the serialized calculator payload/runtime, category-route client payload, hydrated commercial DOM, eager non-LCP imagery, and unstable image render/decode timing. The detailed inventory and risk analysis is in `PC01-REL-05-PERFORMANCE-BOTTLENECK-MATRIX.md`.

## Phase A implementation

Commit `71fd5b5c` made three focused application changes:

- `DeferredCabinCalculator.tsx` keeps the existing PC-01 calculator entry content server-rendered and exposes an accessible button/loading shell, while loading the interaction engine at a 900 px viewport sentinel or on keyboard/pointer activation.
- `LegacyEmbeddedCalculator.tsx` preserves the complete legacy calculator on every non-PC-01 category hub while preventing its large HTML/runtime string from being serialized through `__NEXT_DATA__`.
- `src/pages/product/[category]/index.tsx` supplies the compact PC-01 calculator entry on the server and resolves legacy mappings inside the non-PC-01 dynamic boundary.

No title, H1, copy, product fact, price, specification, FAQ, schema fact, PDF, GA asset, formula, freight value, link, route, redirect, sitemap source, publication state or form was changed.

## Phase B investigation and rejection

Phase A did not meet the gate, so a second profile was performed. Scoped trials deferred non-LCP visual images until the hero paint and tested the existing hero through the Next image optimizer at standard qualities, a response preload, and synchronous LCP decoding. Representative mobile medians/results were:

| Trial | Score | LCP | TBT | DOM | Main thread | Decision |
|---|---:|---:|---:|---:|---:|---|
| Defer non-LCP images | 82 | 4,088 ms | 220 ms | 1,788 | 2,032 ms | Reject: LCP failed |
| Optimized hero, q85 | 67-85 | 5,481 ms median | 234-486 ms | 1,788 | reduced | Reject: LCP unstable/failed |
| HTTP response preload | 78-81 | 4,733 ms median | 98-300 ms | 1,788 | reduced | Reject: LCP failed |
| Optimized hero, q75 | 67-88 | 4,848 ms median | 103-398 ms | 1,788 | reduced | Reject: LCP failed |
| q75 plus synchronous decode | 77-81 | 4,910 ms median | 105-239 ms | 1,788 | reduced | Reject: LCP failed |

The deferral trial also removed one image-manifest association (4,209 to 4,208), which is outside the no-SEO-regression contract. All trial source and generated sitemap changes were removed. No Phase B commit exists.

## SEO, functional and blast-radius evidence

The Phase A server HTML retains the title, self-canonical, `index, follow`, single approved H1, opener/core copy, six size/price choices, eight FAQ bodies and FAQPage schema, Product schema, BreadcrumbList, 30 specifications, ten approved child links, guide link, maintained PDF link and enquiry CTA. The full calculator is absent from the initial PC-01 payload, but the commercial entry content and accessible activation/no-script boundary remain.

Representative non-PC-01 category hubs (`labor-colony` and `container-offices`) retained their complete calculator HTML and anchors; their server responses differed only by the dynamic wrapper bookkeeping. The route-wide first-load bundle fell from 581 kB to 308 kB without changing child-route bundles.

Completed checkpoint/Phase A validation included:

- keyword-ownership validator: 321 pages, 6,368 relevant occurrences, zero findings;
- all 11 keyword-ownership mutations rejected;
- specification-override validator: pass;
- maintained-PDF validator: pass;
- PDF determinism: pass;
- TypeScript: pass;
- production build: pass;
- ESLint: pass with the same three pre-existing warnings and no new warning;
- PC-01 route/mapping parity and calculator checks: pass;
- image manifest restored to 321 pages, 4,209 associations and 3,221 unique images.

Because Section 13 mandates `STOP` when safe scoped work cannot meet the applicable targets, no performance-budget baseline was approved, no budget validator/mutation suite was commissioned, and the post-success full release-regression stage was not run. Creating budgets from failed medians would encode an unapproved standard.

## Browser and visual QA

The final Phase A production preview was checked at effective 360 x 800, 390 x 844, 768 x 1024 and 1440 x 900 viewports. Each had one H1, no horizontal overflow, a loaded hero, self-canonical and no captured console warning/error. At 390 x 844 the size selector was exercised: selecting 10x10 updated the visible price to `₹1,43,750 + GST`. The maintained PDF resolved to `/specs/saman-porta-cabins-technical-specification.pdf`, and the calculator activation boundary was present. No form was submitted.

Baseline and Phase A screenshots, Lighthouse HTML/JSON, traces, manifests, server HTML and summaries are under `seo-remediation/reports/evidence/PC01-REL-05/`. The final mobile filmstrip/trace is in `phase-a/lighthouse-mobile/run-03-0.trace.json`; final screenshots are in `phase-a/screenshots/`.

## Files changed and rollback

Application files in Phase A:

- `src/components/DeferredCabinCalculator.tsx`
- `src/components/LegacyEmbeddedCalculator.tsx`
- `src/pages/product/[category]/index.tsx`

The remaining changed files are the baseline/bottleneck/final reports, Lighthouse evidence, manifests and `scripts/summarize-pc01-lighthouse.mjs`.

To roll back the safe implementation without rewriting history, revert commit `71fd5b5cd857fe710f19ec29355a34bd116b38ab` on this local branch and rebuild. Do not reset the protected ownership checkpoint.

## Remaining blocker and preview

The safe implementation misses mobile LCP by 603.414 ms, mobile TBT by 309.206 ms, and the score target by two points. Meeting all three with the profiled route would require a broader shared commercial-template/client-registry redesign or an SEO/design compromise, neither authorized here.

Verified local preview:

`http://127.0.0.1:3222/product/porta-cabins`

Final verdict: `BLOCKED_PERFORMANCE_TARGET_NOT_MET`
