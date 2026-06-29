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
