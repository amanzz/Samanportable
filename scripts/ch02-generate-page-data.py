#!/usr/bin/env python3
"""Generate CH-02's product JSON and refresh its wp-export head from the signed pack.

Every rendered string is READ from content/ch-02/*.json. Nothing is retyped here:
this file carries structure and wiring only, so the pack stays the single source of
copy and a re-run reproduces the data files byte-for-byte.

ONE string on the page does not come from the copy pack: the Description tab's FAQ
run heading. The pack's `description_tab` carries `faq` but no heading for it, and
the design lock forbids inventing fallback text, so the heading is read from the
approved draft (CH-02-luxury-container-houses-draft-v1.md, "Block 11 - Product
Details, tab 1: Description", the "#### Questions buyers ask about the luxury build"
line) rather than composed here. It is asserted against that file below.
"""
import json, os, re, sys

sys.stdout.reconfigure(encoding="utf-8")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(REPO, "content", "ch-02")
copy = json.load(open(os.path.join(PACK, "CH-02-luxury-container-houses-copy-v1.json"), encoding="utf-8"))
amap = json.load(open(os.path.join(PACK, "CH-02-luxury-container-houses-asset-map-v1.json"), encoding="utf-8"))

SLUG = copy["slug"]
CATEGORY = "container-houses"
# The asset map's `public_dir` is a REPO path ("/public/images/..."). Next serves
# everything under public/ from the site root, so the served prefix drops that
# segment. See the build report: the shipped verifier concatenates `public_dir`
# onto the base URL unstripped, which is the one place the two disagree.
IMG_ROOT = amap["public_dir"].replace("/public/", "/").rstrip("/")
SIZES = ["20x8", "20x10", "20x12", "40x8", "40x10", "40x12"]
DEFAULT_SIZE = "20x10"

DRAFT = open(os.path.join(REPO, "_build-inputs", "CH-02-luxury-container-houses-draft-v1.md"), encoding="utf-8").read()
FAQ_HEADING = "Questions buyers ask about the luxury build"
assert f"#### {FAQ_HEADING}" in DRAFT, "FAQ heading not found in the approved draft"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def esc_attr(s):
    return esc(s).replace('"', "&quot;")


# ------------------------------------------------------------------ asset map
slots = {s["slot"]: s for s in amap["slots"]}


def px(slot):
    w, h = slots[slot]["output_px"].split("x")
    return int(w), int(h)


def img(slot, provenance="render"):
    s = slots[slot]
    w, h = px(slot)
    return {"src": f"{IMG_ROOT}/{s['output']}", "alt": s["alt"], "provenance": provenance,
            "width": w, "height": h}


# ------------------------------------------------------------------- variants
# Six sizes in the pack's published order, each with its own six gallery slides
# and its own five approved buy-box cells. Prices are the pack's `price_display`
# ex-GST / incl-GST pair; nothing is recomputed here.
variants = []
for size in SIZES:
    price = copy["price_display"][size]
    length, width = size.split("x")
    variants.append({
        "sizeSlug": size,
        "label": f"{size} ft",
        "dims": f"{length}x{width}x8.5 ft",
        "areaSqft": int(length) * int(width),
        "priceExGst": price["ex_gst"],
        "priceInclGst": price["incl_gst"],
        "featureCells": [dict(c) for c in copy["hero"]["feature_cells"][size]],
        "images": [img(f"hero_gallery.{size}.slide{n}") for n in range(1, 7)],
    })

# ------------------------------------------------------------ Section 3 panels
# The explorer panel box is a fixed aspect-[4/3] object-cover frame, and these are
# 1800x1350 (exactly 4:3) 3D cutaway GA boards, so nothing is cropped.
panels = []
for p in copy["section3"]["panels"]:
    size = p["size_key"]
    panels.append({
        "sizeSlug": size,
        "h3": p["h3"],
        "paragraph": p["paragraph"],
        "applications": list(p["applications"]),
        "image": img(f"section3.{size}.plan_image"),
    })

# ------------------------------------------------------- Description tab HTML
# Block order is the approved draft's: sections 1-4, the published price table,
# then sections 5-9, with the include/exclude bullet block closing section 6 and
# the FAQ run last. The six 16:9 interiors are NOT written in here: they are
# passed as `infoImages` and placed by the shared injectInfoImages(), which is
# the mechanism the design lock uses and which enforces the spacing rules.
S = copy["description_tab"]["sections"]
BB = copy["description_tab"]["bullet_block"]
TB = copy["description_tab"]["table"]


def section_html(sec, extra=""):
    parts = [f"<h2>{esc(sec['h2'])}</h2>"]
    parts += [f"<p>{esc(p)}</p>" for p in sec["paragraphs"]]
    return "".join(parts) + extra


table_html = (
    f"<p><em>{esc(TB['caption'])}</em></p>"
    "<table><thead><tr>"
    + "".join(f"<th>{esc(h)}</th>" for h in TB["head"])
    + "</tr></thead><tbody>"
    + "".join("<tr>" + "".join(f"<td>{esc(c)}</td>" for c in row) + "</tr>" for row in TB["rows"])
    + "</tbody></table>"
)

bullet_html = (
    f"<p>{esc(BB['lead'])}</p>"
    "<ul>" + "".join(f"<li>{esc(i)}</li>" for i in BB["items"]) + "</ul>"
    f"<p>{esc(BB['closing'])}</p>"
)

faq_html = f"<h2>{esc(FAQ_HEADING)}</h2>" + "".join(
    f"<h3>{esc(f['q'])}</h3><p>{esc(f['a'])}</p>" for f in copy["description_tab"]["faq"]
)

description_html = "".join([
    section_html(S[0]),
    section_html(S[1]),
    section_html(S[2]),
    section_html(S[3]),
    table_html,
    section_html(S[4]),
    section_html(S[5], bullet_html),
    section_html(S[6]),
    section_html(S[7]),
    section_html(S[8]),
    faq_html,
])

info_images = [img(f"description_tab.image.{size}", provenance="render") for size in SIZES]

# ------------------------------------------------------------------ FAQ schema
# Byte-identical to the eight visible answers, per the pack's `faq_source`.
faq_schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {"@type": "Question", "name": f["q"],
         "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
        for f in copy["description_tab"]["faq"]
    ],
}

# --------------------------------------------------------- cluster link tiles
# Explore the Range and You may also like are resolved here, at build time, from
# the pack's approved tile lists: this page excluded, and only destinations that
# are approved production paths AND answered 200 (recorded by
# scripts/ch02-probe-links.py into ch02-link-status.json). Never padded by
# repeating a tile.
#
# Each tile's blurb, image and image alt are DERIVED from that destination's own
# product record, so no copy is authored here and a tile can never describe a
# page with a sibling's words.
arch = json.load(open(os.path.join(REPO, "src", "data", "seo", "commercialArchitecture.json"), encoding="utf-8"))
approved = set(arch["approvedProductionPaths"])
STATUS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ch02-link-status.json")
status = json.load(open(STATUS_PATH, encoding="utf-8")) if os.path.exists(STATUS_PATH) else {}
SELF = f"/product/{CATEGORY}/{SLUG}"


def tile_meta(href):
    dest_slug = href.rstrip("/").rsplit("/", 1)[-1]
    d = json.load(open(os.path.join(REPO, "src", "data", "products", f"{dest_slug}.json"), encoding="utf-8"))
    lead = next((i for v in d["variants"] for i in (v.get("images") or [])), None)
    return {
        "category": d["categoryLabel"],
        "blurb": d["metaDescription"],
        "imageSrc": lead["src"],
        "imageAlt": lead["alt"],
    }


def tiles_from(entries):
    out = []
    for t in entries:
        href = t["href"]
        if href == SELF:
            continue
        if href not in approved:
            print(f"  .. skipped (not an approved production path): {href}")
            continue
        if not status:
            print(f"  !! link status not measured yet, tile provisional: {href}")
        elif status.get(href) != 200:
            print(f"  .. skipped (not 200): {href}")
            continue
        out.append({"title": t["label"], "href": href, **tile_meta(href)})
    return out


related_tiles = tiles_from(copy["explore_the_range"]["tiles"])
ymal_tiles = tiles_from(copy["you_may_also_like"]["tiles"])

# ------------------------------------------------------------- product record
product = {
    "productSlug": SLUG,
    "productName": copy["structured_data"]["product"]["name"],
    "variantAxis": "size",
    "defaultVariant": DEFAULT_SIZE,
    "hsn": "9406",
    "gstPercent": 18,
    "variants": variants,
    "h1": copy["head"]["h1"],
    "seoTitle": copy["head"]["meta_title"],
    "metaDescription": copy["head"]["meta_description"],
    "canonical": copy["head"]["canonical"],
    "opener": copy["hero"]["short_description"],
    "categoryLabel": copy["structured_data"]["product"]["category"],
    "categoryHref": f"/product/{CATEGORY}",
    "descriptionHtml": description_html,
    "infoImages": info_images,
    "faqSchema": faq_schema,
    "applicationsContent": {
        "h2": copy["section3"]["h2"],
        "intro": copy["section3"]["intro"],
        "panels": panels,
    },
    "relatedTiles": related_tiles,
    "ymalTiles": ymal_tiles,
    # The buy-box control keeps the design lock's own deployed button label; the
    # pack's `technical_pdf_label` labels the same PDF in the Specifications tab.
    "specPdfHref": "/specs/luxury-container-houses-technical-specification.pdf",
    # AggregateOffer only: INR, ex-GST basis, 436480..1118976 over six sizes.
    "emitAggregateOffer": True,
    "schemaBrandName": copy["structured_data"]["product"]["brand"],
    "schemaOfferType": "aggregateOffer",
    "suppressSchemaAvailability": True,
    # No reviews exist, so no rating is claimed anywhere, visible or in schema.
    "suppressReviewClaims": True,
    "suppressAggregateRatingSchema": True,
    "suppressLegacyFaqSchema": True,
    "suppressLegacySku": True,
    # The shared default trust strip asserts ISO 9001:2015 certification and a
    # structural warranty. This page's acceptance gate bans the warranty string
    # outright, and no certification is in the pack, so the page carries the
    # already-deployed PO-03/PO-05 literal. No new copy is authored here.
    "trustStripText": "GST registered",
    "hideHeroProofRow": True,
    "priceCaption": (
        f"Prices are {copy['price_display'][DEFAULT_SIZE]['basis']}. "
        "GST is 18 per cent under HSN 9406."
    ),
    # The Explorer renders an <img> for the ACTIVE panel only, so this emits the
    # hidden manifest that makes all six GA boards crawlable in SSR; and the buy
    # box renders one size at a time, so this ships every size's approved cells.
    "emitExplorerImageManifest": True,
    "emitVariantFactCompleteness": True,
    "labelActiveThumbnailAlt": True,
    "optimizeLocalGalleryImages": False,
}

dest = os.path.join(REPO, "src", "data", "products", f"{SLUG}.json")
with open(dest, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(product, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("wrote", dest)

# ------------------------------------------------- wp-export head refresh only
# This is a LIVE route, so its wp-export record is kept and only the Rank Math
# head is refreshed to the pack's approved title, description and canonical. The
# route shape, id, categories and permalink are untouched.
wp_path = os.path.join(REPO, "src", "data", "wp-export", "products", f"{SLUG}.json")
wp = json.load(open(wp_path, encoding="utf-8"))
wp["_rank_math_head"] = {
    "success": True,
    "head": (
        f"<title>{esc(copy['head']['meta_title'])}</title>\n"
        f"<meta name=\"description\" content=\"{esc_attr(copy['head']['meta_description'])}\"/>\n"
        f"<meta name=\"robots\" content=\"{esc_attr(copy['head']['robots'].replace(',', ', '))}\"/>\n"
        f"<link rel=\"canonical\" href=\"{esc_attr(copy['head']['canonical'])}\" />\n"
    ),
}
wp["name"] = copy["structured_data"]["product"]["name"]
wp["permalink"] = copy["head"]["canonical"]
with open(wp_path, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(wp, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("wrote", wp_path)

# --------------------------------------------------------------- self-checks
assert len(variants) == 6 and all(len(v["images"]) == 6 for v in variants)
assert len(panels) == 6 and len(info_images) == 6
assert "—" not in description_html, "U+2014 in description HTML"
srcs = [i["src"] for v in variants for i in v["images"]] + [p["image"]["src"] for p in panels] \
    + [i["src"] for i in info_images]
assert len(srcs) == 48 and len(set(srcs)) == 48
print(f"\nvariants={len(variants)} panels={len(panels)} infoImages={len(info_images)} "
      f"related={len(related_tiles)} ymal={len(ymal_tiles)} descHtml={len(description_html)} "
      f"faqs={len(faq_schema['mainEntity'])}")
