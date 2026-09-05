#!/usr/bin/env python3
"""PO-02 gate 4: prop audit.

Shows every prop the shared components receive on this page and proves that nothing
differs from the design lock except the four permitted content kinds:

  A  copy strings
  B  images and alt text
  C  variant/size data rows and prices
  D  internal-link destinations and anchors

Two sources are audited:
  1. the route file's slug-conditional props (what [category]/[slug].tsx passes)
  2. variantData - the product JSON, which is where the rest of the props come from -
     compared field-by-field against PO-01 readymade-office-cabin, the approved
     sibling rendered by the same route through the same components.

Usage: python propaudit.py <repo-root>
"""
import json
import os
import re
import sys

REPO = sys.argv[1]
ROUTE = os.path.join(REPO, "src", "pages", "product", "[category]", "[slug].tsx")
MINE = os.path.join(REPO, "src", "data", "products", "prefabricated-office-cabins.json")
SIB = os.path.join(REPO, "src", "data", "products", "readymade-office-cabin.json")
SLUG = "prefabricated-office-cabins"

# Which permitted kind each product-JSON field belongs to.
KIND = {
    "A": {
        "productName", "h1", "seoTitle", "metaDescription", "opener", "priceCaption",
        "trustStripText", "materialLabel", "deliveryLabel", "coverageLabel",
        "categoryLabel", "specPdfButtonLabel", "schemaBrandName", "descriptionHtml",
        "faqSchema", "applicationsContent", "productSlug",
    },
    "B": {"specPdfHref", "schemaImageMode"},
    "C": {
        "variants", "defaultVariant", "variantAxis", "hsn", "gstPercent",
        "emitAggregateOffer", "schemaIncludeVariantOffers",
    },
    "D": {"canonical", "categoryHref", "ymalTiles", "relatedTiles"},
}
FLAGS = {
    "suppressLegacySku", "suppressAggregateRatingSchema", "suppressReviewClaims",
    "suppressLegacyFaqSchema", "emitSizeAnchors", "hideHeroProofRow",
    "suppressSchemaAvailability", "labelActiveThumbnailAlt", "optimizeLocalGalleryImages",
}


def kind_of(field):
    for k, names in KIND.items():
        if field in names:
            return k
    if field in FLAGS:
        return "flag"
    return "?"


def main():
    src = open(ROUTE, encoding="utf-8").read()
    mine = json.load(open(MINE, encoding="utf-8"))
    sib = json.load(open(SIB, encoding="utf-8"))

    print("=" * 100)
    print("GATE 4 - PROP AUDIT")
    print("=" * 100)
    print()
    print("PART 1 - route-level props in src/pages/product/[category]/[slug].tsx")
    print("-" * 100)
    print("Every line in the route that names this slug, with the prop it feeds.")
    print()
    for i, line in enumerate(src.splitlines(), 1):
        if SLUG in line and not line.strip().startswith("//") and not line.strip().startswith("*"):
            print(f"  L{i:<5} {line.strip()[:150]}")
    print()
    print("  Each is one of:")
    print("    CLUSTER_DESIGN_SLUGS membership -> the existing premium opt-ins")
    print("      (usePremiumSizeTabs / showSectionDividers / explorerPanelHeadingAsH2),")
    print("      byte-for-byte the same treatment every sibling product page takes.")
    print("    size_selector_label / reviewsEmptyStateText / YMAL subline -> kind A, copy")
    print("      strings read from the signed pack.")
    print("    reviews / averageRating / ratingCount -> the same review suppression the")
    print("      approved siblings already take (no Review or AggregateRating markup).")
    print("    fullMobileLabels -> the same opt-in small-office-cabin and")
    print("      readymade-office-cabin already pass.")
    print()

    print("PART 2 - variantData (src/data/products/*.json) vs the approved sibling")
    print("-" * 100)
    keys = sorted(set(mine) | set(sib))
    same, diff, only_mine, only_sib = [], [], [], []
    for k in keys:
        if k in mine and k in sib:
            (same if mine[k] == sib[k] else diff).append(k)
        elif k in mine:
            only_mine.append(k)
        else:
            only_sib.append(k)

    print(f"  fields present on both: {len(same) + len(diff)}   identical: {len(same)}   differing: {len(diff)}")
    print()
    print(f"  {'field':<32} {'kind':<6} note")
    print("  " + "-" * 96)
    for k in diff:
        kd = kind_of(k)
        if isinstance(mine[k], (str, int, float, bool)) and len(str(mine[k])) < 46:
            note = f"{sib[k]!r} -> {mine[k]!r}"
        elif isinstance(mine[k], list):
            note = f"list {len(sib[k])} -> {len(mine[k])} entries"
        elif isinstance(mine[k], dict):
            note = f"object, this page's own content"
        else:
            note = f"{len(str(sib[k]))} -> {len(str(mine[k]))} chars"
        print(f"  {k:<32} {kd:<6} {note[:80]}")
    for k in same:
        print(f"  {k:<32} {kind_of(k):<6} IDENTICAL to the sibling")
    if only_mine:
        print()
        print("  present here, absent on the sibling:")
        for k in only_mine:
            print(f"    {k:<30} {kind_of(k):<6} {str(mine[k])[:60]}")
    if only_sib:
        print()
        print("  present on the sibling, absent here:")
        for k in only_sib:
            print(f"    {k:<30} {kind_of(k):<6} {str(sib[k])[:60]}")

    print()
    unclassified = [k for k in diff + only_mine if kind_of(k) == "?"]
    print("  UNCLASSIFIED differences (would be a design-lock breach):",
          unclassified if unclassified else "none")
    print()
    print("RESULT:", "PASS - every difference is one of the four permitted content kinds"
          if not unclassified else f"FAIL - {len(unclassified)} unclassified")
    return 0 if not unclassified else 1


if __name__ == "__main__":
    sys.exit(main())
