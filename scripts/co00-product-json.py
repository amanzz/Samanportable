# -*- coding: utf-8 -*-
"""CO-00: rewrite src/data/products/container-offices.json per build-prompt-v1
Sections 1-3, 6. Six variants only (3 withdrawn), new prices on 3, single
ticket-approved render per size, page-level hero table repeated per variant
(component reads heroActive.featureCells), h1/seoTitle/metaDescription/opener,
no specPdfHref (gate B4)."""
import json

COPY = json.load(open("scripts/co00-copy.json", encoding="utf-8"))
IMAGES = {r["slot"]: r for r in json.load(open("scripts/co00-image-report.json", encoding="utf-8"))}

FEATURE_CELLS = [
    {"label": "Sizes available", "value": "Six configurations, 100 to 400 sq.ft."},
    {"label": "Reference rate", "value": "Rs 1,450 per sq.ft. at 200 sq.ft., ex-GST"},
    {"label": "Structure", "value": "150x75x5 mm MS C-channel base frame"},
    {"label": "Insulation", "value": "75 mm wall, 100 mm roof, mineral or glass wool"},
    {"label": "Electrical", "value": "DB with MCB/RCCB, LED lighting, dedicated AC circuit"},
]

# (sizeSlug, label, dims, areaSqft, priceExGst, priceInclGst, gallerySlot, h2Key, bodyKey, bulletsKey)
VARIANTS = [
    ("10x10", "10x10 ft", "10x10x8.5 ft", 100, 166750, 196765, "gallery-10x10", "V1_H2", "V1_BODY", "V1_BULLETS"),
    ("20x8", "20x8 ft", "20x8x8.5 ft", 160, 255200, 301136, "gallery-20x8", "V2_H2", "V2_BODY", "V2_BULLETS"),
    ("20x10", "20x10 ft", "20x10x8.5 ft", 200, 290000, 342200, "gallery-20x10", "V3_H2", "V3_BODY", "V3_BULLETS"),
    ("30x10", "30x10 ft", "30x10x8.5 ft", 300, 417600, 492768, "gallery-30x10", "V4_H2", "V4_BODY", "V4_BULLETS"),
    ("40x8", "40x8 ft", "40x8x8.5 ft", 320, 440800, 520144, "gallery-40x8", "V5_H2", "V5_BODY", "V5_BULLETS"),
    ("40x10", "40x10 ft", "40x10x8.5 ft", 400, 551000, 650180, "gallery-40x10", "V6_H2", "V6_BODY", "V6_BULLETS"),
]

variants_out = []
for slug, label, dims, area, exgst, inclgst, gslot, h2k, bodyk, bulk in VARIANTS:
    img = IMAGES[gslot]
    variants_out.append({
        "sizeSlug": slug,
        "label": label,
        "dims": dims,
        "areaSqft": area,
        "priceExGst": exgst,
        "priceInclGst": inclgst,
        "sku": "SP-20-CO-2024",
        "images": [
            {
                "src": img["out"],
                "alt": img["alt"],
                "provenance": "render",
                "width": 1254,
                "height": 1254,
            }
        ],
        "featureCells": FEATURE_CELLS,
        "sectionH2": COPY[h2k],
        "sectionBody": COPY[bodyk],
        "sectionBullets": COPY[bulk].split("\n"),
    })

data = {
    "productSlug": "container-offices",
    "variantAxis": "size",
    "defaultVariant": "20x10",
    "hsn": "9406",
    "gstPercent": 18,
    "emitAggregateOffer": True,
    "trustWarranty": "5-year structural warranty and 1-year finishing warranty as standard",
    "h1": COPY["H1"],
    "seoTitle": COPY["SEO_TITLE"],
    "metaDescription": COPY["META_DESCRIPTION"],
    "opener": COPY["HERO_SHORT_DESCRIPTION"],
    "variants": variants_out,
    # Per-size map, not a {sizeSlug} template string — the six approved render
    # filenames are irregular (each carries its own colour/finish descriptor),
    # matching the oil-field-camp.json precedent for the same reason.
    "explorerImageTemplate": {v[0]: IMAGES[v[6]]["out"] for v in VARIANTS},
}

out_path = "src/data/products/container-offices.json"
json.dump(data, open(out_path, "w", encoding="utf-8", newline="\n"), indent=2, ensure_ascii=False)

# Verify
check = json.load(open(out_path, encoding="utf-8"))
print("variants:", [v["sizeSlug"] for v in check["variants"]])
print("specPdfHref present:", "specPdfHref" in check)
print("prices:", [(v["sizeSlug"], v["priceExGst"]) for v in check["variants"]])
print("h1 len:", len(check["h1"]), "seoTitle len:", len(check["seoTitle"]), "meta len:", len(check["metaDescription"]), "opener len:", len(check["opener"]))
for v in check["variants"]:
    assert len(v["sectionBullets"]) == 4, v["sizeSlug"]
    assert len(v["images"]) == 1
    assert (v["images"][0]["width"], v["images"][0]["height"]) == (1254, 1254)
    assert v["images"][0]["provenance"] == "render"
print("all variant checks passed")
