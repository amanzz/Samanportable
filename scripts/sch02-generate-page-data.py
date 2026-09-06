#!/usr/bin/env python3
"""Generate SCH-02's product JSON and wp-export record from the signed pack.

Every rendered string is READ from content/sch-02/*.json. Nothing is retyped here:
this file holds structure and wiring only, so the pack stays the single source of
copy and a re-run reproduces the data files byte-for-byte.

Two structural values are NOT copy and are therefore written here:

  * featureCells labels. The pack's FEATURE_CELLS table (draft BLOCK 1) supplies five
    self-describing VALUES per size and names its columns "Cell 1".."Cell 5"; the
    design lock's buy box renders label/value pairs. The labels below are the cells'
    category names only - the published fact is the pack's string, used verbatim as
    the value. Same shape accommodation-container already ships via LC-00.
  * chipLabel / tabLabel. Sliced from the pack's own Section 3 h3 prefix
    ("20x8x8.5 ft: ..." -> "20x8x8.5 ft") so the compact selectors carry a pack
    string rather than an authored abbreviation. `label` keeps the pack's full
    "20 x 8 x 8.5 ft" for the enquiry prefill and the Group A table.
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(REPO, "content", "sch-02")
copy = json.load(open(os.path.join(PACK, "SCH-02-shipping-container-homes-copy-v1.json"),
                      encoding="utf-8"))
amap = json.load(open(os.path.join(PACK, "SCH-02-shipping-container-homes-asset-map-v1.json"),
                      encoding="utf-8"))

SLUG = copy["slug"]
IMG_ROOT = "/images/products/" + SLUG
CLUSTER_HREF = "/product/container-houses"
SELF_PATH = "%s/%s" % (CLUSTER_HREF, SLUG)

# The build ticket's approved Container Houses set, hub first. Membership alone does
# not put a tile on the page: scripts/sch02-link-status.json records the status code
# each destination actually answered at build time, and only 200s are rendered.
APPROVED_ORDER = [
    CLUSTER_HREF,
    CLUSTER_HREF + "/container-farmhouse",
    CLUSTER_HREF + "/expandable-container-house",
    CLUSTER_HREF + "/flat-pack-container-homes",
    CLUSTER_HREF + "/luxury-container-houses",
    CLUSTER_HREF + "/prefab-container-homes",
    CLUSTER_HREF + "/shipping-container-homes",
    CLUSTER_HREF + "/tiny-container-homes",
]

FEATURE_CELL_LABELS = ["Built-up area", "Carpet area", "Rooms", "Openings", "Price"]


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def esc_attr(s):
    return esc(s).replace('"', "&quot;")


# ------------------------------------------------------------------ asset index
by_slot = {e["slot"]: e for e in amap["images"]}


def public_src(entry):
    """Where scripts/sch02-install-images.py puts each package file."""
    group = entry["group"]
    name = os.path.basename(entry["prebuilt_webp"])
    if group == "01-gallery-webp":
        return "%s/%s/%s" % (IMG_ROOT, entry["slot"].split(".")[1], name)
    sub = {"02-section3-drawings": "size-section",
           "03-section2-split-card": "section2",
           "04-description-images": "description"}[group]
    return "%s/%s/%s" % (IMG_ROOT, sub, name)


def px(entry):
    w, h = entry["output_px"].split("x")
    return int(w), int(h)


# ---------------------------------------------------------------------- variants
h3_prefix = {p["size"]: p["h3"].split(":", 1)[0].strip() for p in copy["section3"]["panels"]}

variants = []
for v in copy["variants"]:
    size = v["size"]
    cells = copy["hero"]["feature_cells"][size]
    assert len(cells) == len(FEATURE_CELL_LABELS), "feature cell count changed for %s" % size
    images = []
    for n in range(1, 7):
        e = by_slot["gallery.%s.%02d" % (size, n)]
        w, h = px(e)
        images.append({
            "src": public_src(e),
            "alt": e["alt"],
            "provenance": "render",
            "width": w,
            "height": h,
        })
    variants.append({
        "sizeSlug": size,
        "label": v["label"],
        "chipLabel": h3_prefix[size],
        "dims": v["label"],
        "areaSqft": v["built_up_sqft"],
        "priceExGst": v["price_ex_gst_inr"],
        "priceInclGst": v["price_incl_gst_inr"],
        "featureCells": [{"label": lab, "value": val}
                         for lab, val in zip(FEATURE_CELL_LABELS, cells)],
        "images": images,
    })

# ------------------------------------------------------------ Section 3 explorer
panels = []
for p in copy["section3"]["panels"]:
    e = by_slot["section3.%s.plan" % p["size"]]
    w, h = px(e)
    panels.append({
        "sizeSlug": p["size"],
        "h3": p["h3"],
        "tabLabel": h3_prefix[p["size"]],
        "paragraph": p["paragraph"],
        "applications": list(p["applications"]),
        # 1920x1440 into the panel's aspect-[4/3] object-cover box is an exact fit,
        # so the approved drawing is never cropped and no `fit` override is needed.
        "image": {"src": public_src(e), "alt": e["alt"], "provenance": "render",
                  "width": w, "height": h},
    })

# ------------------------------------------------------- Description tab HTML
# Nine sections in pack order. Sections 1-6 each carry the description image the
# content map assigns to them, one per size, INSIDE this tab. Section 9 is the FAQ
# container: its eight questions are the same strings the FAQPage schema carries.
DESC_IMAGE_SIZES = [v["size"] for v in copy["variants"]]
sections_html = []
for i, sec in enumerate(copy["description_tab"]["sections"]):
    parts = ["<h2>%s</h2>" % esc(sec["h2"])]
    for para in sec["paragraphs"]:
        parts.append("<p>%s</p>" % esc(para))
    if sec.get("bullets"):
        parts.append("<ul>%s</ul>" % "".join("<li>%s</li>" % esc(b) for b in sec["bullets"]))
    if i < len(DESC_IMAGE_SIZES):
        e = by_slot["description.%s" % DESC_IMAGE_SIZES[i]]
        w, h = px(e)
        parts.append(
            '<img src="%s" alt="%s" width="%d" height="%d" loading="lazy" '
            'data-c08-info-image="true" />' % (esc_attr(public_src(e)), esc_attr(e["alt"]), w, h)
        )
    if i == len(copy["description_tab"]["sections"]) - 1:
        for f in copy["description_tab"]["faqs"]:
            parts.append("<h3>%s</h3><p>%s</p>" % (esc(f["question"]), esc(f["answer"])))
    # No <section> wrapper: the design lock's own descriptionHtml is a bare
    # h2/p/ul/img sequence, so wrapping would add nine elements it does not have.
    sections_html.append("".join(parts))
description_html = "".join(sections_html)

# ------------------------------------------------------------------ FAQ schema
# Byte-identical to the Description tab: the same pack strings, unescaped, so the
# schema text and the visible text compare equal character for character.
faq_schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {"@type": "Question", "name": f["question"],
         "acceptedAnswer": {"@type": "Answer", "text": f["answer"]}}
        for f in copy["description_tab"]["faqs"]
    ],
}

# --------------------------------------------------------- cluster link tiles
STATUS = json.load(open(os.path.join(REPO, "scripts", "sch02-link-status.json"),
                        encoding="utf-8"))
TILE_META = json.load(open(os.path.join(REPO, "scripts", "sch02-tile-meta.json"),
                           encoding="utf-8"))["tiles"]

tiles = []
skipped = []
for href in APPROVED_ORDER:
    if href == SELF_PATH:
        skipped.append((href, "this page"))
        continue
    code = STATUS["results"].get(href, {}).get("status")
    if code != 200:
        skipped.append((href, "status %s" % code))
        continue
    tiles.append(dict(TILE_META[href]))

assert tiles, "Explore the Range resolved to zero tiles"
assert len({t["href"] for t in tiles}) == len(tiles), "duplicate tile destination"

# ----------------------------------------------------------------- product data
product = {
    "productSlug": SLUG,
    "productName": "Shipping Container Homes",
    "variantAxis": "Size",
    "defaultVariant": "20x10",
    "gstPercent": 18,
    "emitAggregateOffer": True,
    "variants": variants,
    "h1": copy["h1"],
    "seoTitle": copy["meta"]["title"],
    "metaDescription": copy["meta"]["description"],
    "canonical": copy["canonical"],
    "opener": copy["hero"]["short_description"],
    "categoryLabel": "Container Houses",
    "categoryHref": CLUSTER_HREF,
    "schemaBrandName": "SAMAN Portable",
    # Pack sentence, description_tab section 5 paragraph 3, first clause.
    "priceCaption": "Prices are ex-GST unless stated; 18 per cent GST applies.",
    # Correction 2. The shared hero's fallback trust strip is a hardcoded literal
    # reading "5-year structural and 1-year finishing warranty", and `trustWarranty`
    # is only consulted on the legacy C04/C08 branch this page no longer takes. So
    # the strip is set outright, in the shared literal's own shape, carrying the
    # pack's figures instead: "Structural warranty on a SAMAN conversion is 10 years.
    # Finishing warranty is 1 year, extendable to 2." and "SAMAN is ISO 9001:2015
    # certified" (description_tab section 8 and section 1).
    "trustStripText": ("GST registered · ISO 9001:2015 certified manufacturer · "
                       "10-year structural and 1-year finishing warranty · "
                       "Pan-India delivery"),
    # The template proof row's generic claims are not in this pack.
    "hideHeroProofRow": True,
    # The 2 Aug 2026 spec PDF republishes the Rs 3,64,320-9,13,920 ladder and the
    # 5-year structural warranty this build withdraws, so it is not linked. The
    # control still renders, disabled, exactly as LC-02 provides for a PDF that
    # exists but must not be linked. specPdfHref is omitted so no stale href ships.
    "specPdfDisabled": True,
    "suppressLegacySku": True,
    "suppressLegacyFaqSchema": True,
    "suppressReviewClaims": True,
    "suppressSchemaAvailability": True,
    # The Explorer renders an <img> for the ACTIVE panel only, so this ships the
    # hidden manifest of all six approved Section 3 drawings.
    "emitExplorerImageManifest": True,
    # The buy box renders one size at a time, as the lock does; this additionally
    # ships every size's approved facts into SSR so all six are crawlable.
    "emitVariantFactCompleteness": True,
    "labelActiveThumbnailAlt": True,
    "optimizeLocalGalleryImages": False,
    "faqSchema": faq_schema,
    "descriptionHtml": description_html,
    "applicationsContent": {
        "h2": copy["section3"]["h2"],
        "intro": copy["section3"]["intro"],
        "panels": panels,
    },
    "ymalTiles": tiles,
    "relatedTiles": tiles,
}

dest = os.path.join(REPO, "src", "data", "products", "%s.json" % SLUG)
with open(dest, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(product, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("wrote", dest)

# ------------------------------------------------------------ wp-export record
# The route replaces the head fields from the product JSON, but the exported record
# is what the legacy Rank Math head falls back to, so it is brought in line here
# rather than left publishing the withdrawn title and price.
wp_path = os.path.join(REPO, "src", "data", "wp-export", "products", "%s.json" % SLUG)
wp = json.load(open(wp_path, encoding="utf-8"))
head = (
    '<title>%s</title>\n'
    '<meta name="description" content="%s"/>\n'
    '<meta name="robots" content="index, follow"/>\n'
    '<link rel="canonical" href="%s" />\n'
) % (esc(copy["meta"]["title"]), esc_attr(copy["meta"]["description"]), esc_attr(copy["canonical"]))
wp["_rank_math_head"] = {"success": True, "head": head}
wp["description"] = ""
wp["short_description"] = ""
wp["price"] = ""
wp["regular_price"] = ""
wp["sale_price"] = ""
wp["on_sale"] = False
wp["purchasable"] = False
wp["average_rating"] = "0.00"
wp["rating_count"] = 0
wp["images"] = []
wp["date_modified"] = "2026-09-06T00:00:00"
with open(wp_path, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(wp, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("wrote", wp_path)

print("\nvariants=%d  panels=%d  tiles=%d  descHtml=%d chars  faqs=%d"
      % (len(variants), len(panels), len(tiles), len(description_html),
         len(faq_schema["mainEntity"])))
print("Explore the Range / YMAL tiles:")
for t in tiles:
    print("   200  %-58s %s" % (t["href"], t["title"]))
for href, why in skipped:
    print("   --   %-58s excluded: %s" % (href, why))
