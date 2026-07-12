# T2 — Homepage Hero & Trust Upgrade — Content Draft v1
**Date:** 09 Jul 2026 · **Author:** Fable 5 (Strategy & Content lead) · **Ticket:** SHIKHAR T2
**Status:** Owner-approved when SAMAN issues the T2 build/resume prompt naming this file.

---

## 0. Scope declaration

Layout-only ticket. No SEO-bearing text changes anywhere. The ONLY new content-bearing
elements are: one CTA button label (§2, item 3) and three image alt texts (§3).
Everything else on the page stays byte-identical.

## 1. SEO LOCK confirmation (L3)

Page title, meta description, H1, hero paragraph, and all other indexable copy stay
**byte-identical** to the branch base (`origin/static-migration`). Verification method:
`git diff` on the branch must show zero changes to any string rendered as indexable
text, except the additions authorized in §2–§3 below. Facts registry unchanged, as
currently live: "ISO 9001:2015 Certified", "7–21 Day Delivery", "5-Year Structural
Warranty", "since 2009".

## 2. Hero CTA row — exactly three buttons, this order

1. **"Get a Free Quote"** — existing label, existing href (quote page route).
   No change to label or target. Primary DS button style.
2. **"Browse Solutions"** — existing label, existing href. No change. Secondary DS style.
3. **"Call +91 97089 89937"** — NEW. href `tel:+919708989937`.
   Secondary/outline DS style. Label verbatim as written here.
   **Authorization:** +91 97089 89937 is the pan-India contact listed in
   PROJECT-SHIKHAR-MASTER fixed facts. Fable 5 ruling 09 Jul 2026: pan-India number
   is authorized for national pages (homepage); South (+91 88616 22859) and North
   (+91 87960 39938) numbers remain the CTA numbers for their zonal pages, unchanged.
   Owner sign-off: given via the build prompt that names this draft.

The hero "Get a Free Quote" embedded form card is removed from the hero layout.
The form component itself is NOT deleted — it remains available at its existing
quote page, which CTA 1 links to.

## 3. Hero certification badge row — three badges, this order

Placement: inside the hero, directly below the CTA row. Optimized WebP derivatives
(≤30 KB, ~240px wide) generated from owner-supplied files in `public/credentials/`
(originals untouched). Equal display height (~48–56px desktop, ~40px mobile), DS-token
chip background. Explicit width/height attributes; zero CLS; loading priority below
hero background.

| # | Badge | Source file | Alt text (verbatim) |
|---|-------|------------|---------------------|
| 1 | ZED Bronze | `public/credentials/zed-bronze.png` | ZED Bronze certified manufacturer — SAMAN Portable |
| 2 | MSME Udyam | `public/credentials/msme-udyam.png` | MSME Udyam registered enterprise — SAMAN Portable |
| 3 | DPIIT | `public/credentials/dpiit-startup.png` | DPIIT recognised startup — SAMAN Portable |

**Truth basis:** certifications held by SAMAN; badge artwork supplied by the owner
into `public/credentials/` on 09 Jul 2026. No claim text beyond the alt attributes
above. No expiry dates, certificate numbers, or additional wording anywhere on the page.

## 4. Explicitly out of scope

- No changes to header/nav files (T1 owns those).
- No import of any content from `saman-homepage-rewrite-guide.xlsx` or
  `saman-complete-homepage-guide-v3.xlsx` (contain outdated facts: 25-year warranty,
  since 2017, 21-day delivery — all superseded).
- No repositioning or redesign of ProductShowcase (Part C is diagnose/render-fix only).
- No new indexable copy beyond §2 item 3 and §3 alt texts.
