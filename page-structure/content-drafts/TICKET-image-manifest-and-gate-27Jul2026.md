# TICKET — IMAGE MANIFEST, LIVE SITEMAP, AND INTAKE GATE
<!-- PASTE INTO: the SAME image session. This ticket is the governing document. -->

Excellent scoping. Three findings change the design, and one of them is bigger than the thing I asked about.

**First: save this file.** `L19-AMENDMENT-image-intake-gate-27Jul2026.md` never reached the repository. **This ticket is now the governing document.** Write it verbatim to `page-structure/content-drafts/TICKET-image-manifest-and-gate-27Jul2026.md` and commit as `docs: image manifest and intake gate ticket`. Report the hash. Do not paraphrase it.

## What your report changed

**The snapshot defect is confirmed and it is worse than a stale file.** The generator reads a committed inventory compiled by a script that is in neither `package.json` nor CI. So the XML is rewritten every build from frozen data, which is the most deceptive possible failure: it looks generated, it passes review, and it is wrong the moment anyone adds an image.

**1,758 of 2,926 images are remote `blog.samanportable.com` URLs.** That is 60% of our images on a WordPress subdomain we do not optimise, do not control the delivery of, and cannot put behind any gate. I did not know this and it reshapes the whole programme. See §4.

**No provenance field exists anywhere.** So "a render may not be presented as a delivered project" is currently unenforceable by machine, which is precisely how 164 truth defects accumulated.

## 1 · Build the manifest, and build it once

You proposed a normalised image manifest as the single enforcement point. **Agreed, and it does double duty.** It is the sitemap's source and the gate's source, so we are not building two things that can disagree with each other. **Two systems reading two sources is how the snapshot defect happened in the first place.**

Generate `image-manifest.json` at build time, before sitemap generation, from live collection rather than from any committed inventory:

- file scan of `public/**`
- structured product JSON in `src/data/products/**`
- HTML parse of `src/data/wp-export/**`
- static extraction from `src/components/**`, `src/pages/**`, `src/config/**`, `src/lib/**`
- remote `blog.samanportable.com` references, recorded and flagged as remote

Per entry: resolved URL · source file · pages it renders on · alt text · filename · format · bytes · intrinsic dimensions · local or remote · in-schema yes or no · provenance.

**`compile-image-sitemap-inventory.mjs` is deleted, and `imageSitemapInventory.json` with it.** A committed inventory that CI does not regenerate is a defect, not an asset. Nothing may read frozen image data after this event.

Then `generate-segmented-sitemaps.mjs` reads the manifest instead. **Prove it: add one throwaway image to a page, run the build, confirm it appears in `sitemap-images.xml` without any manual step, then remove it and confirm it disappears.** That test is the acceptance criterion for this half of the event. Reporting that the code looks correct is not evidence.

Re-run the full P0 acceptance set afterwards: every listed image 200 with zero redirects · zero `/_next/image` · page sitemaps still 167 + 213 + 1 + 78 = 459 · `robots.txt` unchanged · both `noindex` pages still absent · **zero visible-text, zero JSON-LD, zero markup change**, proven with a content-layer diff. The image count may legitimately change from 2,923 now that collection is live rather than frozen. **If it does, explain every delta.** An unexplained delta means the collector is wrong.

## 2 · Provenance

Add a `provenance` field, values `photograph` or `render`, to the product image objects in `src/data/products/**` and to the manifest schema.

**Do not populate it by guessing.** Default every existing entry to `unknown` and report the count. Truthful values are assigned during each cluster remediation, by someone who looks at the image. `unknown` is allowed in the allow-list and forbidden on any new image.

`src/data/wp-export/**` is read-only for content, so its images carry provenance in the manifest layer, never by editing that directory.

## 3 · The gate

CI check, blocking merge, reading the manifest.

Every **new or changed** image must pass: filename lowercase and hyphen-separated on `[product]-[size]-[view].[ext]`, unique site-wide, no `IMG_`, `DSC_`, `Screenshot`, bare numbers, `copy`, `final`, `v2` · alt present, unique site-wide, 60 to 125 characters · WebP for photographic content or SVG for vector · under 200 KB · served at no more than 2x its largest render width · `provenance` set to `photograph` or `render`, never `unknown`.

**Where provenance is `render`, alt text and caption may not contain a client name, a project name, a city, or any word asserting delivery, installation or completion.** This is an L15 truth rule and it is the single most important line in the gate.

**Existing files are allow-listed at switch-on**, generated from the manifest at that moment. Without this the build fails on day one against 1,405 bad filenames and 6,121 short alts, and the gate gets switched off within a week. **An entry leaves the allow-list when its cluster is remediated and can never be re-added.** The allow-list only ever shrinks, and the CI job reports its size on every run so we can see it fall.

Failure messages name the file, the rule broken and the correction required.

Empty alt is permitted only where the code marks the image decorative.

## 4 · Report only, and this is the strategic question

**Do not act on this. Report.**

1. Is `blog.samanportable.com` still a live WordPress installation, or is it now serving only images?
2. Do those 1,758 images resolve from a domain we control and can back up, and what happens to 1,758 references if it is ever retired?
3. What is the total byte weight, and how many appear on `/product/` routes?
4. Could they be migrated into `public/**` mechanically, with references rewritten, or does each one need a decision?

My reasoning, so you can test it rather than accept it: an image URL change normally resets whatever equity that image has earned, which is the argument against migrating anything. **But our images have earned nothing yet.** Indexation was near zero before the sitemap went live yesterday. That makes right now the cheapest moment this migration will ever be, and the cost rises every week the sitemap works. If the answer is that migration is mechanical, I would rather take the disruption now than in six months.

## Sequence and stop

Build §1, §2 and §3 in one event since all three read the same manifest. Preview, report, **STOP. Do not merge.** Report §4 alongside, and I rule on it separately.