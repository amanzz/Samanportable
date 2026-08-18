# -*- coding: utf-8 -*-
"""Assemble src/data/products/ablution-block.json + applications dataset."""
import json

COPY = json.load(open("scripts/lc07-copy.json", encoding="utf-8"))
IMAGES = json.load(open("scripts/lc07-image-report.json", encoding="utf-8"))
DESC_HTML = open("scripts/lc07-description.html", encoding="utf-8").read()

SIZES = ["12x10", "16x10", "24x12", "30x12", "40x12", "40x20"]
PRICE = {
    "12x10": {"area": 120, "exGst": 210000, "inclGst": 247800},
    "16x10": {"area": 160, "exGst": 272000, "inclGst": 320960},
    "24x12": {"area": 288, "exGst": 460800, "inclGst": 543744},
    "30x12": {"area": 360, "exGst": 558000, "inclGst": 658440},
    "40x12": {"area": 480, "exGst": 696000, "inclGst": 821280},
    "40x20": {"area": 800, "exGst": 1080000, "inclGst": 1274400},
}
# Gallery suffix order per size (matches section 4a manifest exactly; 40x12/40x20
# substitute exterior-installed-context for exterior-front-left-hero as slot 1,
# and side-elevation replaces one of the four standard exterior slots).
STANDARD_ORDER = ["exterior-front-left-hero", "exterior-full-front", "exterior-installed-context",
                   "exterior-rear-left-utility", "interior-toilet-cubicles", "interior-washbasins"]
WIDE_ORDER = ["exterior-installed-context", "exterior-full-front", "exterior-rear-left-utility",
              "exterior-side-elevation", "interior-toilet-cubicles", "interior-washbasins"]

FEATURE_CELLS = [
    {"label": "Published sizes", "value": "Six, 12x10 ft to 40x20 ft (120 to 800 sq ft)"},
    {"label": "Price from", "value": "Rs 2,10,000 ex-GST (Rs 2,47,800 incl. 18% GST)"},
    {"label": "Plan type", "value": "Single-loaded to 160 sq ft; two banks on a central pipe duct from 288 sq ft"},
    {"label": "Wet envelope", "value": "Nominal 50 mm PUF/PPGI panel or MS frame with moisture-resistant liner"},
    {"label": "Fixture schedule", "value": "Set from headcount, shifts and site rules, never from floor area"},
]

img_by_slot = {r["slot"]: r for r in IMAGES}

variants = []
for idx, size in enumerate(SIZES, start=1):
    order = WIDE_ORDER if size in ("40x12", "40x20") else STANDARD_ORDER
    imgs = []
    for suffix in order:
        r = img_by_slot["gallery-%s-%s" % (size, suffix)]
        imgs.append({"src": r["out"], "alt": r["alt"], "provenance": "render", "width": r["w"], "height": r["h"]})
    variants.append({
        "sizeSlug": size,
        "label": "%s ft" % size,
        "dims": "%s ft" % size,
        "areaSqft": PRICE[size]["area"],
        "priceExGst": PRICE[size]["exGst"],
        "priceInclGst": PRICE[size]["inclGst"],
        "sku": "SP-ABL-%s" % size,
        "images": imgs,
        "featureCells": FEATURE_CELLS,
    })

explorer_template = {}
for size in SIZES:
    order = WIDE_ORDER if size in ("40x12", "40x20") else STANDARD_ORDER
    explorer_template[size] = img_by_slot["gallery-%s-%s" % (size, order[0])]["out"]

# specPdfHref: the PDF's own reviewer fields still read PENDING/DRAFT, but
# published active on explicit follow-up instruction after being flagged,
# same disposition as the LC-03/LC-04 PDFs earlier in this project.
product = {
    "productSlug": "ablution-block",
    "productName": "Multi-Toilet Ablution Block",
    "variantAxis": "size",
    "defaultVariant": "12x10",
    "hsn": "9406",
    "gstPercent": 18,
    "applicationsDataset": "ablution-block",
    "explorerImageTemplate": explorer_template,
    "emitAggregateOffer": True,
    "productSku": "SP-ABL-2024",
    "priceCaption": "Base specification price; fixture schedule and site services quoted separately.",
    # P01: "filename unchanged" per section 4c, unlike every other asset.
    "specPdfHref": "/downloads/multi-toilet-ablution-block-technical-specification-priced.pdf",
    "specPdfButtonLabel": "Download the technical specification (PDF)",
    "h1": COPY["H1"],
    "seoTitle": COPY["SEO_TITLE"],
    "metaDescription": COPY["META_DESCRIPTION"],
    "opener": COPY["HERO_SHORT_DESCRIPTION"],
    "descriptionHtml": DESC_HTML,
    "variants": variants,
}

json.dump(product, open("src/data/products/ablution-block.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("wrote src/data/products/ablution-block.json")
print("variants:", [v["sizeSlug"] for v in variants])

# applications dataset (Section 3 panels)
panels = []
for idx, size in enumerate(SIZES, start=1):
    order = WIDE_ORDER if size in ("40x12", "40x20") else STANDARD_ORDER
    r = img_by_slot["gallery-%s-%s" % (size, order[0])]
    panels.append({
        "sizeSlug": size,
        "h3": COPY["VARIANT%d_H2" % idx],
        "paragraph": COPY["VARIANT%d_BODY" % idx],
        "applications": COPY["VARIANT%d_BULLETS" % idx].split(" | "),
        "image": {"src": r["out"], "alt": r["alt"], "provenance": "render", "width": r["w"], "height": r["h"]},
    })
applications = {"panels": panels}
json.dump(applications, open("src/data/products/ablution-block-applications.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("wrote src/data/products/ablution-block-applications.json")
