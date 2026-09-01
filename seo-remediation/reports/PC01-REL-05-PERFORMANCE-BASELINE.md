# PC01-REL-05 Performance Baseline

## Scope and checkpoint

- Route: `/product/porta-cabins`
- Source checkpoint: `4dc9b4e639169b66140416d2237cb71c24fce66e`
- Production comparator: `origin/static-migration` at `3346a5329ee907641f0ac06a1e07bcc8d0c55a17`
- Baseline preview: production build on `http://127.0.0.1:3220`
- Network isolation: Chrome blocked every `https://*` request; Lighthouse reported zero third-party transfer.
- Cache policy: every run used a fresh Chrome profile.

## Controlled environment

- Windows 11 Home Single Language (`10.0.26200`)
- Node `24.16.0`; npm `11.13.0` (repository advisory is Node 22/npm 10; no engine or lockfile change was made)
- Chrome `152.0.7977.65`
- Lighthouse `13.4.1`
- Performance category only; simulated throttling
- Mobile: `390x844`, DPR 1, 150 ms RTT, 1,638.4 Kbps, 4x CPU slowdown, five runs
- Desktop: `1440x900`, DPR 1, 40 ms RTT, 10,240 Kbps, 1x CPU slowdown, three runs

## Results

| Metric | Mobile runs | Mobile median | Desktop runs | Desktop median |
|---|---:|---:|---:|---:|
| Performance score | 46, 55, 63, 57, 59 | **57** | 96, 93, 98 | **96** |
| FCP | 2,804 / 1,938 / 1,871 / 1,938 / 1,661 ms | **1,938 ms** | 559 / 510 / 448 ms | **510 ms** |
| LCP | 3,911 / 3,888 / 3,671 / 3,768 / 4,211 ms | **3,888 ms** | 1,149 / 1,110 / 1,103 ms | **1,110 ms** |
| Speed Index | 8,950 / 4,478 / 2,879 / 4,162 / 2,149 ms | **4,162 ms** | 1,111 / 874 / 814 ms | **874 ms** |
| TBT | 3,293 / 2,759 / 1,445 / 2,582 / 1,491 ms | **2,582 ms** | 96 / 185 / 49 ms | **96 ms** |
| CLS | 0.027 / 0 / 0 / 0 / 0 | **0** | 0 / 0 / 0 | **0** |
| DOM elements | 3,811 each | **3,811** | 3,820 each | **3,820** |
| Main-thread work | 8,789 / 7,337 / 5,241 / 6,488 / 4,494 ms | **6,488 ms** | 1,486 / 1,620 / 1,077 ms | **1,486 ms** |
| Total transfer | — | **2,225,805 B** | — | **2,496,621 B** |

Median mobile resource transfer was 650,063 B of JavaScript, 1,310,424 B of images, 94,561 B of document data, 30,862 B of CSS and 92,120 B of fonts. The production build reported `/product/[category]` at 581 kB first-load JavaScript (9.71 kB route code plus 123 kB shared framework code and route-loaded chunks).

## LCP validation

The LCP candidate is the first hero image:

`/images/products/porta-cabins/20x10/porta-cabin-20x10-01-exterior-front-left.webp`

It is present in initial HTML, uses explicit `1254x1254` dimensions, is eager, has `fetchpriority="high"`, and is discoverable without client rendering. Lighthouse's LCP discovery checks all passed. Representative mobile request data shows high priority, preload discovery, 117,668 B transferred, and no third-party dependency. The representative LCP breakdown was 308 ms TTFB, 23 ms load delay, 221 ms resource duration and 501 ms render delay. The image itself is not the primary defect.

## Contract gates derived from the baseline

| Gate | Required final result |
|---|---:|
| Mobile LCP (baseline above 3.5 s) | at least 20% better (**≤3,110 ms**) and ≤4.0 s |
| Mobile TBT (baseline above 600 ms) | **≤800 ms** (stronger than the 35% improvement floor) |
| DOM (baseline above 3,000) | at least 15% smaller (**≤3,239 elements**) |
| Main-thread work (baseline above 4 s) | at least 20% better (**≤5,190 ms**) |
| Mobile performance score (baseline below 70) | at least +10 (**≥67**) |
| FCP | no more than 5% worse (**≤2,035 ms**) |
| CLS | **≤0.05** |
| Category first-load JS (baseline above 500 kB) | at least 10% smaller (**≤523 kB**) unless a documented shared redesign is required |

## Evidence

Raw JSON, HTML reports, traces, DevTools logs, build manifests, initial server HTML, machine-readable medians and screenshots are under `seo-remediation/reports/evidence/PC01-REL-05/baseline/`.

Lighthouse completed and wrote every requested artifact, then Chrome Launcher emitted a Windows/Node 24 `EPERM` warning while deleting its temporary profile. The warning occurred after report, trace and DevTools-log creation and does not invalidate the measurements.
