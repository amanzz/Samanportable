# Deploy checklist — Segmented Image Sitemaps

This is the one-page repeatable checklist for every segmented-image-sitemap deployment.

1. Build verification
- Run locally: `IMAGE_GATE_BOOTSTRAP=1 npm run build`.
- Confirm postbuild output includes:
  - products/locations/projects/editorial page sitemap counts = `168/213/1/78`.
  - noindex/canonical exceptions: `0`.
  - `liveRemoteImageCount` and `liveLocalImageCount` printed in manifest summary.
  - generation logs mention the four image-segment files.

2. Artifact sanity checks
- Confirm repository has these files and no monolith:
  - `public/sitemap-images-products.xml`
  - `public/sitemap-images-locations.xml`
  - `public/sitemap-images-projects.xml`
  - `public/sitemap-images-editorial.xml`
  - `public/sitemap.xml` with 4 segment entries + 4 page entries.
- Confirm `public/sitemap-images.xml` is absent.
- Confirm each image sitemap has no optimizer URLs:
  - search `/_next/image` must return zero matches in each image segment file.

3. Merge and deploy
- Open PR title: `Segmented image sitemaps and manifest metadata cache`.
- PR body should include:
  - this report,
  - §1 image-count comparison,
  - production verification outcomes.
- Merge and deploy.

4. Post-deploy CDN cache purge
- Purge Cloudflare cache for:
  - `/sitemap.xml`
  - `/sitemap-images-products.xml`
  - `/sitemap-images-locations.xml`
  - `/sitemap-images-projects.xml`
  - `/sitemap-images-editorial.xml`
  - `/sitemap-images.xml` (deleted file must also be purged whenever a sitemap filename changes).

5. Production smoke checks
- Confirm `/sitemap-images.xml` returns 404.
- Confirm `/sitemap.xml` returns 200 and contains exactly 8 `<sitemap>` entries.
- Confirm all 8 entries are expected segment files (no monolith reference).
- Confirm page sitemaps remain at `167 + 213 + 1 + 78 = 459` URLs in total.
- Run 3 consecutive Googlebot-agent fetches each for the four image segment sitemaps; each should return 200.
- Sample at least 50 URLs across all image segments (across the 4 files) and confirm all are 200 and not redirects.

- After any collector change, compare new image-sitemap `<image:loc>` association count and unique-image count with the deployed `sitemap-images.xml` set, and document every delta by URL (including +/− counts and one-fewer-association cases) before merge.

6. Metadata cache (manual, once)
- Run from machine with outbound internet (not restricted CI environment):
  - `npm run image-cache:populate`
- Capture attempts, resolved, failed, and final `src/data/image-metadata-cache.json` file size.
