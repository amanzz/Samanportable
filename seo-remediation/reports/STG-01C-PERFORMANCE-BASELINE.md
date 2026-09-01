# STG-01C Performance Baseline

## Scope and method

Measurement only; no optimization was implemented. Lighthouse 13.4.1 ran sequentially against the local production-equivalent Next.js server on loopback, with the mobile form factor, simulated throttling, headless Chrome, and extensions disabled. Each page has three samples; medians are reported. Raw Lighthouse JSON remains in the ignored local `.qa/lighthouse` directory and is not committed.

Lighthouse saved all 15 valid JSON reports but emitted a Windows `EPERM` warning while deleting each temporary Chrome profile. The saved reports parsed successfully and contain complete performance categories; this cleanup warning is tooling-only and is not hidden.

## Median results

| Page | Route | Score | FCP | LCP | TBT | CLS | Speed Index | Transfer | JS transfer / build first-load JS | DOM nodes | Main thread | Long tasks / duration |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Homepage | `/` | 85 | 1.09 s | 4.29 s | 94 ms | 0.000 | 2.47 s | 519 KiB | 250 KiB / 191 kB | 1788 | 1.48 s | 3 / 338 ms |
| Porta Cabins hub | `/product/porta-cabins` | 62 | 1.54 s | 9.64 s | 468 ms | 0.015 | 2.76 s | 2172 KiB | 635 KiB / 581 kB | 3815 | 2.57 s | 10 / 1.47 s |
| Container Offices hub | `/product/container-offices` | 65 | 1.57 s | 9.94 s | 786 ms | 0.000 | 2.40 s | 4290 KiB | 635 KiB / 581 kB | 3904 | 3.40 s | 9 / 1.90 s |
| Portable Office hub | `/product/portable-office` | 65 | 1.53 s | 8.74 s | 382 ms | 0.000 | 2.54 s | 1578 KiB | 635 KiB / 581 kB | 3841 | 2.06 s | 7 / 1.15 s |
| Expandable Container Office detail | `/product/container-offices/expandable-container-office` | 68 | 1.53 s | 12.00 s | 297 ms | 0.000 | 3.45 s | 4378 KiB | 639 KiB / 583 kB | 3792 | 1.98 s | 7 / 880 ms |

The build first-load JavaScript values come from the same successful production build. The Lighthouse JavaScript value is transferred script bytes; the build value is the route's compiled first-load bundle, so the two columns answer different questions.

## All samples

| Page | Sample | Score | FCP | LCP | TBT | CLS | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|
| Homepage | 1 | 85 | 1.10 s | 4.29 s | 94 ms | 0.000 | 2.47 s |
| Homepage | 2 | 78 | 1.09 s | 4.51 s | 219 ms | 0.000 | 4.24 s |
| Homepage | 3 | 89 | 1.08 s | 3.69 s | 15 ms | 0.000 | 1.18 s |
| Porta Cabins hub | 1 | 62 | 1.54 s | 10.00 s | 466 ms | 0.000 | 2.89 s |
| Porta Cabins hub | 2 | 62 | 1.54 s | 9.64 s | 468 ms | 0.015 | 2.76 s |
| Porta Cabins hub | 3 | 70 | 1.62 s | 4.10 s | 665 ms | 0.015 | 1.67 s |
| Container Offices hub | 1 | 48 | 1.62 s | 9.94 s | 1.08 s | 0.000 | 4.67 s |
| Container Offices hub | 2 | 65 | 1.57 s | 4.42 s | 786 ms | 0.000 | 1.57 s |
| Container Offices hub | 3 | 70 | 1.54 s | 10.02 s | 246 ms | 0.000 | 2.40 s |
| Portable Office hub | 1 | 63 | 1.53 s | 8.29 s | 480 ms | 0.015 | 2.54 s |
| Portable Office hub | 2 | 71 | 1.53 s | 8.74 s | 211 ms | 0.000 | 2.43 s |
| Portable Office hub | 3 | 65 | 1.53 s | 8.75 s | 382 ms | 0.000 | 2.64 s |
| Expandable Container Office detail | 1 | 68 | 1.53 s | 12.00 s | 297 ms | 0.000 | 2.95 s |
| Expandable Container Office detail | 2 | 69 | 1.54 s | 12.25 s | 250 ms | 0.000 | 3.45 s |
| Expandable Container Office detail | 3 | 55 | 1.53 s | 11.04 s | 777 ms | 0.000 | 3.66 s |

## LCP, assets, image savings, unused JavaScript and third parties

### Homepage

- LCP element (median-LCP run): Saman Portable Office Cabin in Bangalore - High Quality Site Office
- Largest transferred asset in that run: `http://127.0.0.1:3210/_next/static/chunks/framework-840cff9d6bb95703.js` (45 KiB)
- Median estimated image savings: 57 KiB
- Median unused JavaScript opportunity: 48 KiB
- Median third-party/absolute-production-host transfer: 0 KiB; main-thread time 0 ms. Entities observed: none.

### Porta Cabins hub

- LCP element (median-LCP run): Desert Ochre 20x10 ft porta cabin, door centred between sliding windows on the …
- Largest transferred asset in that run: `http://127.0.0.1:3210/_next/static/chunks/9236-3b668bef174a0626.js` (262 KiB)
- Median estimated image savings: 1178 KiB
- Median unused JavaScript opportunity: 0 KiB
- Median third-party/absolute-production-host transfer: 0 KiB; main-thread time 0 ms. Entities observed: none.

### Container Offices hub

- LCP element (median-LCP run): Deep forest green 20x10 ft container office, three-quarter view with a central …
- Largest transferred asset in that run: `https://www.samanportable.com/images/products/shipping-container-office/size-20x8/01-shipping-container-office-front-exterior.png` (2021 KiB)
- Median estimated image savings: 3341 KiB
- Median unused JavaScript opportunity: 0 KiB
- Median third-party/absolute-production-host transfer: 2238 KiB; main-thread time 0 ms. Entities observed: samanportable.com.

### Portable Office hub

- LCP element (median-LCP run): Portable office cabin, 20 x 10 ft, orange-red body viewed from the door corner.
- Largest transferred asset in that run: `http://127.0.0.1:3210/_next/static/chunks/9236-3b668bef174a0626.js` (262 KiB)
- Median estimated image savings: 637 KiB
- Median unused JavaScript opportunity: 0 KiB
- Median third-party/absolute-production-host transfer: 0 KiB; main-thread time 0 ms. Entities observed: none.

### Expandable Container Office detail

- LCP element (median-LCP run): Deep Oxford Blue 10 by 20 ft expandable container office deployed, entrance wal…
- Largest transferred asset in that run: `https://www.samanportable.com/images/products/shipping-container-office/size-20x8/01-shipping-container-office-front-exterior.png` (2020 KiB)
- Median estimated image savings: 3351 KiB
- Median unused JavaScript opportunity: 0 KiB
- Median third-party/absolute-production-host transfer: 2238 KiB; main-thread time 0 ms. Entities observed: samanportable.com.

## Existing warnings preserved

- Four React Hook dependency warnings: two in `site-office-container.tsx` and two in `product/[category]/index.tsx`.
- One raw `<img>` lint warning in `product/[category]/[slug].tsx`.
- Next.js custom-route warning: 1,008 redirects, six headers and two rewrites (1,016 custom routes total).
- Commercial templates remain approximately 579–584 kB first-load JavaScript; the measured hub/detail routes are 581–583 kB.
- Dependency install reported the pre-existing Node/npm engine mismatch and 45 dependency vulnerabilities (3 low, 22 moderate, 19 high, 1 critical). No dependency change was attempted.
- Lighthouse temporary-profile cleanup emitted the Windows `EPERM` warning described above.

## Baseline interpretation

The median scores and especially hub/detail LCP values confirm that performance remediation remains open. This report is not a release waiver and does not begin AH-016 or any performance work. Absolute image URLs on the local build can be attributed by Lighthouse to `samanportable.com` as a third party even though they are first-party production assets; those rows are retained rather than suppressed.
