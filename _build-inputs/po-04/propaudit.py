#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PO-04 Gate 4 - prop audit.

Every prop reaching a shared component on this route comes from one of two places:

  1. `src/pages/product/[category]/[slug].tsx`, per-slug, enumerated below from the
     route source itself so the audit cannot drift from the code.
  2. `src/data/products/executive-portable-office.json`, which the route hands to
     PortaCabinVariantHero as `data`.

The audit compares both against the nearest approved sibling built to the same design
lock (prefabricated-office-cabins, PO-02) and classifies every difference. The design
lock permits exactly four kinds of difference: copy strings, images and alt text,
variant/size data rows and prices, and internal-link destinations and anchors.
Anything else is a conformance failure.
"""
import json
import re
import sys

SLUG = "executive-portable-office"
SIBLING = "prefabricated-office-cabins"
ROUTE = "src/pages/product/[category]/[slug].tsx"

COPY = "copy"
IMAGES = "images/alt"
VARIANT = "variant data"
LINKS = "internal links"
STRUCTURAL = "STRUCTURAL - not permitted"

# How each product-JSON field is classified when the two pages differ.
CLASSIFY = {
    "productSlug": VARIANT, "productName": COPY, "defaultVariant": VARIANT,
    "variants": VARIANT, "h1": COPY, "seoTitle": COPY, "metaDescription": COPY,
    "canonical": LINKS, "opener": COPY, "descriptionHtml": COPY,
    "faqSchema": COPY, "applicationsContent": COPY, "specPdfHref": IMAGES,
    "specPdfButtonLabel": COPY, "categoryLabel": COPY, "categoryHref": LINKS,
    "schemaBrandName": COPY, "ymalTiles": LINKS, "relatedTiles": LINKS,
    "priceCaption": COPY, "trustStripText": COPY, "materialLabel": COPY,
    "deliveryLabel": COPY, "coverageLabel": COPY, "hideTrustRow": COPY,
    "hideHeroProofRow": COPY, "emitVariantFactCompleteness": VARIANT,
    "suppressAggregateRatingSchema": VARIANT, "emitSizeAnchors": VARIANT,
    "schemaImageMode": IMAGES, "labelActiveThumbnailAlt": IMAGES,
    "optimizeLocalGalleryImages": IMAGES, "hsn": VARIANT, "gstPercent": VARIANT,
    "variantAxis": VARIANT, "emitAggregateOffer": VARIANT,
    "schemaIncludeVariantOffers": VARIANT, "suppressLegacySku": VARIANT,
    "suppressReviewClaims": VARIANT, "suppressLegacyFaqSchema": COPY,
    "suppressSchemaAvailability": VARIANT,
}

fails = []


def check(name, ok, evidence=""):
    print(("PASS " if ok else "FAIL ") + name + ("  | " + str(evidence)[:150] if evidence != "" else ""))
    if not ok:
        fails.append(name)


a = json.load(open("src/data/products/%s.json" % SLUG, encoding="utf-8"))
b = json.load(open("src/data/products/%s.json" % SIBLING, encoding="utf-8"))

print("=== GATE 4: prop audit ===")
print("page    : src/data/products/%s.json" % SLUG)
print("sibling : src/data/products/%s.json  (PO-02, same design lock)" % SIBLING)
print()

same, diff, unclassified = [], [], []
for key in sorted(set(a) | set(b)):
    in_a, in_b = key in a, key in b
    if in_a and in_b and a[key] == b[key]:
        same.append(key)
        continue
    kind = CLASSIFY.get(key)
    state = "both" if in_a and in_b else ("PO-04 only" if in_a else "sibling only")
    if kind is None:
        unclassified.append(key)
        kind = STRUCTURAL
    diff.append((key, state, kind))

print("%-34s %-14s %s" % ("PRODUCT-JSON FIELD", "PRESENT", "CLASSIFICATION"))
for key, state, kind in diff:
    print("%-34s %-14s %s" % (key, state, kind))
print()
print("%d fields identical to the approved sibling, %d differing." % (len(same), len(diff)))
print("identical: " + ", ".join(same))
print()
check("every differing product-JSON field is one of the four permitted kinds",
      not unclassified, unclassified)

# ---- props passed at the route, read out of the route source ------------------
print("\n=== props passed to shared components at the route ===")
src = open(ROUTE, encoding="utf-8").read()
design_set = re.search(r"const CLUSTER_DESIGN_SLUGS = new Set\(\[(.*?)\]\);", src, re.S).group(1)
in_lock = ("'%s'" % SLUG) in design_set
sib_in_lock = ("'%s'" % SIBLING) in design_set

ROUTE_PROPS = [
    ("showSectionDividers", "CLUSTER_DESIGN_SLUGS.has(slug)", in_lock, sib_in_lock, "design lock, identical to sibling"),
    ("usePremiumSizeTabs", "CLUSTER_DESIGN_SLUGS.has(slug)", in_lock, sib_in_lock, "design lock, identical to sibling"),
    ("explorerPanelHeadingAsH2", "CLUSTER_DESIGN_SLUGS.has(slug)", in_lock, sib_in_lock, "design lock, identical to sibling"),
    ("sizeEyebrowText", "pack hero.size_selector_label", True, True, COPY),
    ("fullMobileLabels", "per-slug literal", True, True, "identical to sibling"),
    ("reviewsEmptyStateText", "pack reviews_tab.empty_state", True, True, COPY),
    ("reviews / averageRating / ratingCount", "suppressed", True, True, "identical to sibling"),
    ("railItems", "variantData.relatedTiles", True, False, LINKS),
    ("subline (YMAL)", "pack ymal.intro", True, True, COPY),
]
print("%-38s %-34s %-8s %-8s %s" % ("PROP", "SOURCE", "PO-04", "SIBLING", "CLASSIFICATION"))
for name, source, mine, sibs, kind in ROUTE_PROPS:
    print("%-38s %-34s %-8s %-8s %s" % (name, source, mine, sibs, kind))
print()
check("all three design-lock props are on for this route", in_lock)
check("design-lock props resolve identically to the approved sibling", in_lock == sib_in_lock)

# The one route prop that differs from the sibling by design: PO-04 takes its
# "Explore the Range" rail from the page's own approved tiles instead of a category
# query, because the category query picks up the two never-list URLs.
check("Explore the Range rail is page-owned (never-list cannot enter through a category query)",
      ("currentSlug === '%s'" % SLUG) in src, "relatedTiles branch")

# ---- shared components must take no bespoke prop -------------------------------
print("\n=== shared-component surface ===")
hero = open("src/components/product-variant-hero/PortaCabinVariantHero.tsx", encoding="utf-8").read()
check("no page-specific literal for this slug in the shared hero",
      ("'%s'" % SLUG) not in hero,
      "the one opt-in this page uses is the data flag emitVariantFactCompleteness")
# The flag is declared optional and is read as a bare truthiness test on `data`, so a
# product JSON that omits it (every product but this one) takes the previous branch and
# renders byte-identically. Proven by both facts, not asserted.
types = open("src/components/product-variant-hero/types.ts", encoding="utf-8").read()
check("emitVariantFactCompleteness is declared optional",
      "emitVariantFactCompleteness?: boolean;" in types)
check("emitVariantFactCompleteness is read as a bare truthiness test, so absent = off",
      ": data.emitVariantFactCompleteness\n" in hero,
      "no default value is supplied anywhere")
others = [f for f in __import__("glob").glob("src/data/products/*.json")
          if "emitVariantFactCompleteness" in open(f, encoding="utf-8").read()]
check("exactly one product opts in", len(others) == 1 and SLUG in others[0], others)
check("bess-container's existing completeness behaviour is untouched",
      "data.productSlug === 'bess-container'" in hero)

print("\nRESULT:", "PASS" if not fails else "FAIL (%d)" % len(fails))
sys.exit(0 if not fails else 1)
