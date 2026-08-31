# PC01-REL-06B owner performance decision

Date: 2026-08-31

Decision ID: `PC01-PERFORMANCE-QUALIFICATION-2026-08-31`

Decision: `PC01_PERFORMANCE_IMPROVED_WITH_QUALIFIED_MEASUREMENT_DEBT`

## Authorized meaning

- Preserve the safe Phase-A application changes.
- Accept the deterministic reductions in DOM and route JavaScript.
- Do not claim that synthetic LCP or TBT passed.
- Do not claim that Core Web Vitals passed.
- Do not run another Lighthouse laboratory before integration.
- Treat local and remote synthetic-measurement failures as qualified, unresolved measurement debt.
- Require complete deterministic SEO, content, data, PDF, crawl, visual, and functional regression.
- Review real production field data after deployment.
- Deployment still requires separate owner approval.

The accepted deterministic evidence is DOM `3811 -> 1745` (-54.2%), mobile script transfer `650063 -> 355906` bytes (-45.3%), and category first-load JavaScript `581 -> 308 kB` (-47.0%).

Valid release-authoritative synthetic runs remain zero. Synthetic LCP, TBT, INP, and Core Web Vitals status is `NOT PROVEN`. Measurement status is `QUALIFIED_UNRESOLVED`.

## Prohibited interpretations

- This is not a Core Web Vitals pass.
- This is not proof of production LCP.
- This is not proof of production INP.
- This is not proof of production TBT.
- This is not permission to remove SEO content.
- This is not permission to skip production-base QA.
- This is not deployment approval.
