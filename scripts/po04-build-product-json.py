#!/usr/bin/env python3
"""PO-04 - generate src/data/products/executive-portable-office.json from the signed pack.

Every visible string is read from content/po-04; nothing is retyped here. Re-running
this script reproduces the data file byte-for-byte, so the pack stays the single source
of truth for the page and a copy revision is a one-command rebuild.
"""
import html, json, os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(REPO, *a)
copy = json.load(open(P("content", "po-04", "PO-04-executive-portable-office-copy-v1.json"), encoding="utf-8"))
amap = json.load(open(P("content", "po-04", "PO-04-executive-portable-office-asset-map-v1.json"), encoding="utf-8"))

e = lambda s: html.escape(str(s), quote=True)

# ---------------------------------------------------------------- description tab
# Internal links from copy.links.internal are wrapped on the approved anchor phrase,
# ONCE each, wherever that phrase occurs in this tab. No image is rendered in this tab
# (standing ruling from PO-01, SOC-01 and PO-02).
LINKS = [(a, l["href"]) for l in copy["links"]["internal"] for a in l["anchors"]]
used = set()


def linked(text):
    out = e(text)
    for anchor, href in LINKS:
        if anchor in used:
            continue
        a = e(anchor)
        if a in out:
            out = out.replace(a, '<a href="' + href + '">' + a + '</a>', 1)
            used.add(anchor)
    return out


sections = []
for sec in copy["description_tab"]["sections"]:
    parts = ["<h2>" + e(sec["h2"]) + "</h2>"]
    for it in sec["items"]:
        if it["type"] == "p":
            parts.append("<p>" + linked(it["text"]) + "</p>")
        elif it["type"] == "bullet":
            parts.append("<ul>" + "".join("<li>" + linked(b) + "</li>" for b in it["items"]) + "</ul>")
        elif it["type"] == "table":
            head = "".join("<th>" + e(h) + "</th>" for h in it["header"])
            body = "".join("<tr>" + "".join("<td>" + e(c) + "</td>" for c in row) + "</tr>" for row in it["rows"])
            parts.append('<div class="saman-table-wrap"><table class="saman-table">'
                         "<thead><tr>" + head + "</tr></thead><tbody>" + body + "</tbody></table></div>")
        elif it["type"] == "faq":
            for f in it["items"]:
                parts.append("<h3>" + e(f["q"]) + "</h3><p>" + linked(f["a"]) + "</p>")
        else:
            raise SystemExit("unknown description item type " + repr(it["type"]))
    sections.append("<section>" + "".join(parts) + "</section>")
description_html = "".join(sections)

missing = [a for a, _ in LINKS if a not in used and a != copy["section2"]["link"]["anchor"]]
assert not missing, "internal anchors never placed: " + repr(missing)

# ------------------------------------------------------------------------ variants
gallery = {}
for g in amap["gallery"]:
    gallery.setdefault(g["size"], []).append(g)
for size, entries in gallery.items():
    entries.sort(key=lambda g: g["slide"])
    kinds = [g["kind"] for g in entries]
    # SAMAN ruling, 5 Sep 2026: this product ships three exteriors then three
    # interiors, slides 01-06 in file order. Sanctioned deviation; not to be corrected.
    assert kinds == ["exterior"] * 3 + ["interior"] * 3, size + " running order is " + repr(kinds)

FIXED = copy["hero"]["fixed_cells"]
variants = []
for v in copy["hero"]["variants"]:
    cells = [{"label": k, "value": val} for k, val in v["feature_cells"].items()]
    # The five per-size cells the pack names, then the four fixed cells. A variant's
    # own featureCells replaces the shared five-cell set outright (LC-00), so the fixed
    # four are carried here rather than through materialLabel/deliveryLabel/coverageLabel,
    # which that branch never reads.
    cells += [{"label": k, "value": val} for k, val in FIXED.items()]
    imgs = []
    for g in gallery[v["slug"]]:
        name = os.path.basename(g["output"])
        imgs.append({
            "src": g["url"],
            "alt": copy["alt_text"]["gallery"][name],
            "provenance": "render",
            "width": 1254,
            "height": 1254,
        })
    variants.append({
        "sizeSlug": v["slug"],
        "label": v["label"],
        "dims": v["size_label"],
        "areaSqft": v["area_sqft"],
        "priceExGst": v["price_ex_gst"],
        "priceInclGst": v["price_incl_gst"],
        "featureCells": cells,
        "images": imgs,
    })

# The hero derives the per-sq-ft line as priceExGst / areaSqft. Assert that reproduces
# the pack's published rate for all six sizes rather than overriding it.
for v, src in zip(variants, copy["hero"]["variants"]):
    assert abs(v["priceExGst"] / v["areaSqft"] - src["rate_per_sqft"]) < 0.005, src["slug"]
    assert v["priceInclGst"] == round(v["priceExGst"] * 1.18), src["slug"]

# ----------------------------------------------------------------------- section 3
ga = {g["size"]: g for g in amap["ga_boards"]}
panels = []
for s in copy["section3"]["sizes"]:
    board = ga[s["slug"]]
    panels.append({
        "sizeSlug": s["slug"],
        "h3": s["h3"],
        "paragraph": s["paragraph"],
        "applications": s["bullets"],
        "image": {
            "src": board["url"],
            "alt": copy["alt_text"]["ga_boards"][os.path.basename(board["output"])],
            "provenance": "drawing",
            "width": 1800,
            "height": 1012,
            # A dimensioned GA board is never cropped, so the panel's fixed 4/3 box
            # contains it instead of object-cover cropping it (CO-09's `fit` opt-in).
            "fit": "contain",
        },
    })

# --------------------------------------------------------------------------- rails
TILES = {
    "/product/portable-office": (
        "Portable Office Cabin",
        "/images/products/portable-office/20x10/portable-office-20x10-front-angle.webp",
        "Portable Office Cabin 20 x 10 ft exterior render"),
    "/product/portable-office/readymade-office-cabin": (
        "Readymade Office Cabin",
        "/images/products/readymade-office-cabin/20x10/readymade-office-cabin-20x10-front.webp",
        "Readymade Office Cabin 20 x 10 ft exterior render"),
    "/product/portable-office/small-office-cabin": (
        "Small Office Cabin",
        "/images/products/small-office-cabin/10x10/small-office-cabin-10x10-front-angle.webp",
        "Small Office Cabin 10 x 10 ft exterior render"),
    "/product/portable-office/portable-office-container": (
        "Portable Office Container",
        "/images/products/portable-office-container/20x10/portable-office-container-20x10-front-angle.webp",
        "Portable Office Container 20 x 10 ft exterior render"),
    "/product/portable-office/prefabricated-office-cabins": (
        "Prefabricated Office Cabins",
        "/images/products/prefabricated-office-cabins/20x10/prefabricated-office-cabin-20x10-front-angle.webp",
        "Prefabricated Office Cabins 20 x 10 ft exterior render"),
}
SELF = copy["route"]
NEVER = set(copy["explore_range"]["never_list"]) | set(copy["links"]["never"])
tiles, seen = [], set()
for href in copy["explore_range"]["order"]:
    assert href not in NEVER, href + " is on a never list"
    if href == SELF or href in seen:
        continue
    seen.add(href)
    title, src, alt = TILES[href]
    assert os.path.isfile(P("public", src.lstrip("/").replace("/", os.sep))), src
    tiles.append({"title": title, "href": href, "category": "Portable Office",
                  "blurb": "Explore " + title, "imageSrc": src, "imageAlt": alt})

# ---------------------------------------------------------------------------- FAQ
faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {"@type": "Question", "name": f["q"],
         "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
        for f in copy["faq_schema"]
    ],
}
# Visible/schema parity: the L20 punctuation policy rewrites em dashes in rendered body
# copy but not in faqSchema, so a pack carrying one would silently desync the two.
blob = json.dumps(faq, ensure_ascii=False) + description_html
assert "—" not in blob, "em dash in FAQ or description copy would break L20 parity"

data = {
    "productSlug": "executive-portable-office",
    "productName": copy["product"],
    "variantAxis": "size",
    "defaultVariant": copy["hero"]["default_size"],
    "hsn": "9406",
    "gstPercent": 18,
    "emitAggregateOffer": True,
    "schemaIncludeVariantOffers": True,
    "variants": variants,
    "specPdfHref": amap["spec_pdf"]["url"],
    "specPdfButtonLabel": amap["spec_pdf"]["link_text"],
    "suppressLegacySku": True,
    # suppressAggregateRatingSchema is deliberately NOT set. The rating-schema gate is
    # `rating_count >= 3` and this page has no reviews and a zero count, so no
    # AggregateRating node is emitted either way; suppressReviewClaims below holds the
    # count at zero. Setting the flag would only put the literal string
    # "AggregateRating" into __NEXT_DATA__, where the acceptance test reads it as
    # rating markup that is not actually on the page.
    "suppressReviewClaims": True,
    "suppressLegacyFaqSchema": True,
    "suppressSchemaAvailability": True,
    "emitSizeAnchors": True,
    # Every size's approved buy-box facts ship in SSR (hidden completeness block),
    # matching how all six Section 3 panels already ship their text. The visible buy
    # box still shows one size at a time, exactly as the porta-cabins reference does.
    "emitVariantFactCompleteness": True,
    # The shared hero's default trust strip publishes "ISO 9001:2015 certified
    # manufacturer" and a "5-year structural and 1-year finishing warranty", and its
    # proof row publishes "500+ projects delivered". This page's pack forbids a
    # certification, a warranty duration and an unsourced claim, and supplies no
    # replacement string, so both rows are suppressed with the existing opt-in props
    # rather than filled with copy nobody approved.
    "hideTrustRow": True,
    "hideHeroProofRow": True,
    "categoryLabel": "Portable Office Cabin",
    "categoryHref": "/product/portable-office",
    "schemaBrandName": FIXED["Brand"],
    "schemaImageMode": "variant-first-images",
    "h1": copy["meta"]["h1"],
    "seoTitle": copy["meta"]["title"],
    "metaDescription": copy["meta"]["description"],
    "canonical": copy["meta"]["canonical"],
    "opener": copy["hero"]["short_description"],
    "ymalTiles": tiles,
    "relatedTiles": tiles,
    "faqSchema": faq,
    "descriptionHtml": description_html,
    "applicationsContent": {
        "h2": copy["section3"]["h2"],
        "intro": copy["section3"]["intro"],
        "panels": panels,
    },
    "labelActiveThumbnailAlt": True,
    "optimizeLocalGalleryImages": False,
}

out = P("src", "data", "products", "executive-portable-office.json")
open(out, "w", encoding="utf-8", newline="\n").write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print("wrote " + out)
print("  variants %d  gallery slides %d  panels %d  tiles %d  faq %d" % (
    len(variants), sum(len(v["images"]) for v in variants), len(panels), len(tiles), len(faq["mainEntity"])))
print("  descriptionHtml %d chars, links placed: %s" % (len(description_html), sorted(used)))
