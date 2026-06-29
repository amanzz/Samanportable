# Core Web Vitals Fix Log

## Fix 1: Product Detail LCP Image Priority

Date: 2026-06-29

Affected URLs:
- /product/container-houses/prefab-container-homes
- /product/industrial-sheds/garden-sheds

Issue:
- GSC exports show product detail pages are the largest LCP improvement group.
- Mobile LCP group includes 135 represented product-detail URLs.
- Desktop LCP group includes 94 represented product-detail URLs.

Likely LCP element:
- The above-the-fold main product gallery image.
- Rendered HTML for both sample pages shows the main product image is emitted before the H1/body content and is preloaded.

Files changed:
- src/pages/product/[category]/[slug].tsx

Change made:
- Added an explicit `fetchPriority="high"` prop to the main product image.
- Kept `priority={true}`, dimensions, alt text, layout, schema, canonical, hreflang, content, gallery, tabs, and internal links unchanged.

Why this is safe:
- The change applies only to the first/main product image in the product detail template.
- It does not change URLs, visible content, SEO tags, schema data, image paths, layout structure, or lazy loading behavior for non-LCP images.
- It reinforces the browser priority for the already identified above-the-fold product image.

Validation:
- npm run build: passed
- npx tsc --noEmit: passed
- Local page checks:
  - /product/container-houses/prefab-container-homes: 200, one canonical, 2 JSON-LD scripts, H1 unchanged, main product image renders with fetchpriority high and 800x600 dimensions.
  - /product/industrial-sheds/garden-sheds: 200, one canonical, 2 JSON-LD scripts, H1 unchanged, main product image renders with fetchpriority high and 800x600 dimensions.
- Main image URL checks:
  - https://blog.samanportable.com/wp-content/uploads/2024/10/prefab-container-home-blue-porch-hero-saman.webp: 200 image/webp.
  - https://blog.samanportable.com/wp-content/uploads/2024/10/garden-shed-maroon-15x10-front.jpeg: 200 image/jpeg.
- Hreflang note: these two product pages show no en-IN or x-default hreflang tags on both live and local rendered HTML, so this image-only patch did not alter hreflang behavior.
- Layout/content note: no layout classes, visible content, image paths, canonical logic, schema logic, or page text were changed.

Expected impact:
- Helps preserve high network priority for the product detail LCP image across the product detail template.
- Expected impact is targeted to product detail LCP and does not address INP, category pages, city pages, or blog pages.

## Fix 2 Planning: Product Detail Main Image Sizing

Date: 2026-06-29

Scope inspected:
- src/pages/product/[category]/[slug].tsx
- Rendered local output for:
  - /product/container-houses/prefab-container-homes
  - /product/industrial-sheds/garden-sheds

Current main image implementation:
- The main product image is rendered directly in `src/pages/product/[category]/[slug].tsx`.
- It uses `selectedImageIndex` with initial state `0`, so the first product image is present in SSR HTML.
- The image is not hidden behind hydration. The `isHydrated` guard is used later for short-description buttons, not for the main image.
- Current props:
  - `priority={true}`
  - `fetchPriority="high"`
  - `width={800}`
  - `height={600}`
  - `placeholder="blur"`
  - `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
  - `quality={85}`

Rendered attributes observed:
- /product/container-houses/prefab-container-homes:
  - HTTP 200
  - One image preload
  - Main image source: https://blog.samanportable.com/wp-content/uploads/2024/10/prefab-container-home-blue-porch-hero-saman.webp
  - Format: WebP
  - Bytes checked: 65,860
  - `fetchpriority="high"` present
  - `width="800"` and `height="600"` present
  - `sizes` present
  - `decoding="async"` present
  - no `loading` attribute emitted, which is expected for a Next priority image
- /product/industrial-sheds/garden-sheds:
  - HTTP 200
  - One image preload
  - Main image source: https://blog.samanportable.com/wp-content/uploads/2024/10/garden-shed-maroon-15x10-front.jpeg
  - Format: JPEG
  - Bytes checked: 116,964
  - Intrinsic dimensions checked: 1254x1254
  - `fetchpriority="high"` present
  - `width="800"` and `height="600"` present
  - `sizes` present
  - `decoding="async"` present
  - no `loading` attribute emitted, which is expected for a Next priority image

Responsive image behavior:
- The template emits a `srcset`, but the project uses `image-loader.js`, whose custom loader returns the original source URL unchanged.
- Because the loader passes sources through untouched, the `srcset` repeats the same original image URL at multiple widths instead of generating resized Next image URLs.
- This means mobile browsers are likely downloading the original product image, not a smaller transformed mobile variant.

Oversized mobile image assessment:
- The garden shed sample is a 1254x1254 JPEG rendered into an 800x600 4:3 box, so it is likely oversized and shape-mismatched for mobile.
- The prefab sample is already WebP and only about 66 KB, so it is less urgent.
- A global source-path rewrite is not safe without verifying matching resized files exist for every product image. Sample WordPress-style size variants for these two images were not available.

Blur placeholder / client state assessment:
- The blur placeholder is a small inline base64 placeholder and does not block SSR image markup.
- No evidence that client-side gallery state delays the initial main image render.

Preload assessment:
- A single image preload is already emitted for the main product image on both samples.
- Adding a manual preload would risk duplicate preloads, so no preload change is recommended.

Is Fix 2 needed:
- Not as another template-code-only change.
- The remaining LCP opportunity is image byte optimization for original product images, especially JPEGs, but that requires a controlled product-image asset plan rather than another small prop change.

Recommended next action:
- Do not make another product template code change now.
- Move to a separate image-asset optimization plan for the highest-traffic product detail hero images, with per-image verification that replacement files are relevant, visually equivalent, compressed, correctly sized, and keep URLs/content stable unless approved.

Exact proposed change if owner wants a later asset fix:
- Create optimized 4:3 WebP versions for selected product hero images and update only verified product image references to those files.
- Start with the product detail URLs from GSC, one small batch at a time.
- Do not derive WordPress size-variant URLs blindly because the tested variants returned 404.

Files that would be touched for a later asset fix:
- Product image assets under `public/` or the specific product JSON records that reference images, depending on the approved delivery method.
- No product template source file is recommended for Fix 2.

SEO risk:
- No template-code Fix 2: none.
- Later asset replacement: low to medium, because image relevance, alt consistency, and visual parity must be verified.

UX risk:
- No template-code Fix 2: none.
- Later asset replacement: low if images remain visually equivalent and dimensions stay stable.

Expected CWV impact:
- No extra template prop change is likely to materially improve LCP because priority/preload/fetch priority are already present.
- Optimized hero image assets could improve LCP on JPEG-heavy product pages by reducing transferred bytes.

Validation plan for any later approved image-asset fix:
- Verify old and new image visual relevance.
- Verify image URL returns 200 and correct content type.
- Verify rendered product page returns 200.
- Verify main image remains above the fold with `fetchpriority="high"`.
- Verify one canonical remains.
- Verify schema JSON-LD remains present.
- Verify no broken images.
- Run `npm run build` and `npx tsc --noEmit`.

## Fix 3 Planning — Product Hero Image Assets

Date: 2026-06-29

Scope inspected:
- /product/container-houses/prefab-container-homes
- /product/industrial-sheds/garden-sheds
- Product data files:
  - `src/data/wp-export/products/prefab-container-homes.json`
  - `src/data/wp-export/products/garden-sheds.json`

Important implementation context:
- Product detail hero images are data-driven from `product.images?.[0]?.src`.
- The two inspected hero image paths appear only in their own product JSON files.
- Each path also appears inside the same product JSON's Rank Math `head` block as OG/Twitter/schema image data.
- The project uses a custom Next image loader that returns the original source URL unchanged, so the browser does not receive transformed Next image URLs.
- Replacing the same `https://blog.samanportable.com/...` file path is not possible from this static repo unless the remote WordPress/blog-hosted file is changed outside the repo.

Image inventory:

| Sample URL | Current hero image path | Type | Dimensions | File size | Alternate format/variant found | Reuse found in repo | Assessment |
| --- | --- | --- | ---: | ---: | --- | --- | --- |
| `/product/container-houses/prefab-container-homes` | `https://blog.samanportable.com/wp-content/uploads/2024/10/prefab-container-home-blue-porch-hero-saman.webp` | WebP | 640x640 | 65,860 bytes | AVIF not found. `-600x600.webp` exists at 49,046 bytes; `-300x300.webp` exists at 14,112 bytes. | `src/data/wp-export/products/prefab-container-homes.json` only | Already modest. Square source is object-cropped into a 4:3 render box, but bytes are not excessive. |
| `/product/industrial-sheds/garden-sheds` | `https://blog.samanportable.com/wp-content/uploads/2024/10/garden-shed-maroon-15x10-front.jpeg` | JPEG | 1254x1254 | 116,964 bytes | WebP not found. AVIF not found. JPEG variants exist: `-768x768.jpeg` at 118,620 bytes, `-600x600.jpeg` at 75,553 bytes, `-300x300.jpeg` at 21,378 bytes. | `src/data/wp-export/products/garden-sheds.json` only | Worth optimizing. Current original is square, larger than the rendered 4:3 hero need, and not WebP. |

Rendered display need:
- The product template renders the hero in a stable `aspect-[4/3]` box with `object-cover`.
- The source images are square, so the browser downloads extra pixels that are vertically cropped by the render box.
- A 4:3 optimized hero around 800x600 WebP would better match the rendered box while preserving desktop sharpness.

Whether image quality can be reduced safely:
- Prefab container homes: likely no immediate need; current 640x640 WebP is already about 66 KB.
- Garden sheds: yes, likely safe if the replacement is visually checked. A cropped 800x600 WebP should plausibly land near 45-75 KB while matching the visible 4:3 box better than the current 1254x1254 JPEG.

Recommended optimized target:
- Prefab container homes: no asset change for now.
- Garden sheds: 800x600 WebP, visually equivalent crop of the current maroon shed hero.
- Recommended target file size for garden sheds: under 75 KB, ideally near 50-65 KB if quality remains excellent.

Preferred implementation option:
- Option B for garden sheds: add a new optimized WebP hero image and update only the affected product's main image reference after owner approval.
- Option C for prefab container homes: do nothing for this sample because the current WebP is already reasonably small.

Why not Option A:
- The current paths are remote `blog.samanportable.com` uploads, not local repo files. Replacing the same path cannot be done safely from this static site repo.
- Replacing a remote image in WordPress/blog storage would require a separate media operation and visual QA outside this repo.

Safest implementation method if approved:
- Add one new local optimized image, for example:
  - `public/images/products/garden-shed-maroon-15x10-front-hero-800x600.webp`
- Update `src/data/wp-export/products/garden-sheds.json` carefully so the visible product hero uses the new image.
- Because the old image also appears in OG/Twitter/schema inside the same JSON `head` field, decide explicitly whether to keep social/schema image unchanged or update all same-product image references consistently. Updating only `images[0].src` would be the smallest visible LCP change, but it would leave metadata pointing at the old image.
- Preserve existing alt text and product content.
- Do not touch other product JSON files or global templates.

Files/assets that would be touched if approved:
- `public/images/products/garden-shed-maroon-15x10-front-hero-800x600.webp` (new)
- `src/data/wp-export/products/garden-sheds.json` (only the approved image URL fields)

Risk level:
- Prefab container homes: no-change risk is none.
- Garden sheds Option B: low to medium.
  - Low UX risk if the crop is visually equivalent and dimensions remain stable.
  - Medium SEO/schema risk if metadata/schema image references are changed without careful verification.

Expected CWV impact:
- Prefab container homes: little expected benefit from asset work on this exact image.
- Garden sheds: likely modest LCP improvement from reducing hero image bytes and serving WebP instead of the 1254x1254 JPEG.
- This will not address server delay, CSS, JavaScript, or INP issues.

Rollback method:
- Revert the product JSON image URL fields to the current remote JPEG path:
  - `https://blog.samanportable.com/wp-content/uploads/2024/10/garden-shed-maroon-15x10-front.jpeg`
- Remove the newly added local WebP asset only after verifying no page references it.
- If committed, use a normal git revert of the specific asset-fix commit.

Validation plan if approved:
- Verify new image dimensions and byte size before editing JSON.
- Verify local product page returns 200.
- Verify main hero image renders above the fold with `fetchpriority="high"`.
- Verify no broken image in `src` or `srcset`.
- Verify exactly one canonical remains.
- Verify schema JSON-LD remains present and valid.
- Verify visible title/content/alt text are unchanged.
- Run `npm run build` and `npx tsc --noEmit`.

## Fix 3: Garden Sheds Product Hero Image Asset

Date: 2026-06-29

Affected URL:
- /product/industrial-sheds/garden-sheds

Source image:
- https://blog.samanportable.com/wp-content/uploads/2024/10/garden-shed-maroon-15x10-front.jpeg
- JPEG, 1254x1254, 116,964 bytes

New image:
- /images/products/garden-shed-maroon-15x10-front-hero-800x600.webp
- WebP, 800x600, 66,232 bytes

Files changed:
- public/images/products/garden-shed-maroon-15x10-front-hero-800x600.webp
- src/data/wp-export/products/garden-sheds.json
- reports/core-web-vitals-fix-log.md

Validation:
- npm run build: passed
- npx tsc --noEmit: passed
- /product/industrial-sheds/garden-sheds returned 200
- New image returned 200 image/webp
- Main image uses the new WebP
- Main image keeps `fetchpriority="high"`
- Main image keeps `width="800"` and `height="600"`
- Canonical count: 1
- JSON-LD scripts present: 2
- Old JPEG absent from rendered HTML

Expected impact:
- Reduces the garden-sheds hero image transfer from 116,964 bytes to 66,232 bytes.
- Serves WebP instead of JPEG.
- Matches the rendered 4:3 product hero box instead of downloading a square 1254x1254 source.
- Expected impact is a modest LCP improvement for the garden-sheds product detail page and its represented GSC LCP group.
