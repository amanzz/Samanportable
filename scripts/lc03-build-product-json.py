# -*- coding: utf-8 -*-
"""Assemble src/data/products/oil-field-camp.json from verified copy + image report."""
import json

COPY = json.load(open("scripts/lc03-copy.json", encoding="utf-8"))
IMAGES = json.load(open("scripts/lc03-image-report.json", encoding="utf-8"))
DESC_HTML = open("scripts/lc03-description.html", encoding="utf-8").read()

SIZES = ["20x10", "30x10", "32x10", "40x10", "30x20", "40x20"]
# Section 4 table -- shell figures feed priceExGst/priceInclGst (schema Offer +
# calculator ladder base per s5/s10). Fitted figures are prose-only (S2 card),
# no separate structured field the template renders.
SHELL = {
    "20x10": {"area": 200, "rate": 1550, "exGst": 310000, "inclGst": 365800},
    "30x10": {"area": 300, "rate": 1500, "exGst": 450000, "inclGst": 531000},
    "32x10": {"area": 320, "rate": 1490, "exGst": 476800, "inclGst": 562624},
    "40x10": {"area": 400, "rate": 1450, "exGst": 580000, "inclGst": 684400},
    "30x20": {"area": 600, "rate": 1350, "exGst": 810000, "inclGst": 955800},
    "40x20": {"area": 800, "rate": 1250, "exGst": 1000000, "inclGst": 1180000},
}
BEDS_LABEL = {
    "20x10": "4 beds", "30x10": "6 beds", "32x10": "2 beds plus office",
    "40x10": "8 beds", "30x20": "8 beds", "40x20": "16 beds",
}
GALLERY_SUFFIX_ORDER = ["front-left-hero", "full-front-elevation", "side-elevation",
                        "installed-context", "interior-room-axis", "interior-sleeping-bay"]

FEATURE_CELLS = [
    {"label": "Sizes", "value": "Six, 200 to 800 sq ft built-up module area"},
    {"label": "Capacity", "value": "4 to 16 beds, one approved figure per size"},
    {"label": "Shell rate", "value": "Rs 1,550/sq ft at 200 sq ft, down to Rs 1,250/sq ft at 800 sq ft"},
    {"label": "Structure", "value": "Welded MS on a steel skid chassis with marked lifting points"},
    {"label": "Envelope", "value": "Nominal 60 mm insulated wall and roof panel, PPGI faces"},
]

img_by_slot = {r["slot"]: r for r in IMAGES}

variants = []
for idx, size in enumerate(SIZES, start=1):
    imgs = []
    for suffix in GALLERY_SUFFIX_ORDER:
        r = img_by_slot["gallery-%s-%s" % (size, suffix)]
        imgs.append({
            "src": r["out"], "alt": r["alt"], "provenance": "render",
            "width": r["w"], "height": r["h"],
        })
    variants.append({
        "sizeSlug": size,
        "label": "%s ft" % size,
        "dims": "%s ft" % size,
        "areaSqft": SHELL[size]["area"],
        "priceExGst": SHELL[size]["exGst"],
        "priceInclGst": SHELL[size]["inclGst"],
        "capacity": BEDS_LABEL[size],
        "sku": "SP-OFC-%s" % size,
        "images": imgs,
        "featureCells": FEATURE_CELLS,
    })

explorer_template = {size: img_by_slot["gallery-%s-front-left-hero" % size]["out"] for size in SIZES}

product = {
    "productSlug": "oil-field-camp",
    "productName": "Oil Field Camp",
    "variantAxis": "size",
    "defaultVariant": "20x10",
    "hsn": "9406",
    "gstPercent": 18,
    "applicationsDataset": "oil-field-camp",
    "explorerImageTemplate": explorer_template,
    "emitAggregateOffer": True,
    "productSku": "SP-OFC-2024",
    "priceCaption": "Shell specification price, fitted scope and customisations quoted separately.",
    # specPdfHref intentionally OMITTED -- HELD pending reissue + reviewer signatures (ticket s6).
    "h1": COPY["H1"],
    "seoTitle": COPY["SEO_TITLE"],
    "metaDescription": COPY["META_DESCRIPTION"],
    "opener": COPY["S1_SHORT_DESCRIPTION"],
    "descriptionHtml": DESC_HTML,
    # faqSchema intentionally OMITTED -- ticket s8: "No FAQPage. The visible FAQs
    # ship inside the Description tab; do not promise a rich result."
    "variants": variants,
}

json.dump(product, open("src/data/products/oil-field-camp.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("wrote src/data/products/oil-field-camp.json")
print("variants:", [v["sizeSlug"] for v in variants])
print("capacities:", [v["capacity"] for v in variants])

# ── Section 3 applications dataset (SizeApplicationsExplorer panels) ──────────
panels = []
for idx, size in enumerate(SIZES, start=1):
    r = img_by_slot["gallery-%s-front-left-hero" % size]
    panels.append({
        "sizeSlug": size,
        "h3": COPY["V%d_H2" % idx],
        "paragraph": COPY["V%d_BODY" % idx],
        "applications": [],
        "image": {"src": r["out"], "alt": r["alt"], "provenance": "render", "width": r["w"], "height": r["h"]},
    })
applications = {"panels": panels}
json.dump(applications, open("src/data/products/oil-field-camp-applications.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("wrote src/data/products/oil-field-camp-applications.json")
