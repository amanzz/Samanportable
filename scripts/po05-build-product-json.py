#!/usr/bin/env python3
"""PO-05 - emit src/data/products/portable-mobile-laboratory.json from the signed
pack. Every string is READ from content/po-05; nothing is retyped here.

Design lock: this route renders the same shared components the porta-cabins route
renders. Only the four permitted content kinds differ - copy strings, images and
alt text, variant/size rows and prices, and internal-link destinations.
"""
import json, os, html, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(ROOT, "content", "po-05")
COPY = json.load(open(os.path.join(PACK, "PO-05-portable-mobile-laboratory-copy-v1.json"), encoding="utf-8"))
AMAP = json.load(open(os.path.join(PACK, "PO-05-portable-mobile-laboratory-asset-map-v1.json"), encoding="utf-8"))
SLUG = "portable-mobile-laboratory"
IMG = "/" + AMAP["output_root"].replace("public/", "")
E = lambda s: html.escape(s, quote=False)

# ---------------------------------------------------------------- hero variants
# Gallery order and output names come from the asset map; alt text is keyed by the
# OUTPUT FILE NAME in copy.alt_text.gallery_new. The 10x10 gallery is four slides,
# not six: SAMAN's 5 Sep 2026 ruling holds out its two exteriors (asset_map.held_out).
galAlt = COPY["alt_text"]["gallery_new"]
variants = []
for v in COPY["hero"]["variants"]:
    slides = AMAP["gallery_new"][v["slug"]]["slides"]
    cells = [{"label": k, "value": val} for k, val in v["feature_cells"].items()]
    cells += [{"label": k, "value": val} for k, val in COPY["hero"]["fixed_cells"].items()]
    variants.append({
        "sizeSlug": v["slug"],
        "label": v["label"],
        "dims": v["size_label"],
        "areaSqft": v["area_sqft"],
        "priceExGst": v["price_ex_gst"],
        "priceInclGst": v["price_incl_gst"],
        "featureCells": cells,
        "images": [{
            "src": IMG + "/" + s["out"],
            "alt": galAlt[os.path.basename(s["out"])],
            "provenance": "render",
            "width": 1254, "height": 1254,
        } for s in slides],
    })

# ------------------------------------------------------- Section 3 explorer panels
gaAlt = COPY["alt_text"]["ga_boards"]
panels = [{
    "sizeSlug": s["slug"],
    "h3": s["h3"],
    "paragraph": s["paragraph"],
    "applications": s["bullets"],
    "image": {
        "src": IMG + "/" + AMAP["ga_boards"]["files"][s["slug"]]["out"],
        "alt": gaAlt[s["slug"]],
        "provenance": "drawing",
        "width": 1800, "height": 1012,
        # A dimensioned GA board is never cropped: contain inside the panel 4:3 box.
        "fit": "contain",
    },
} for s in COPY["section3"]["sizes"]]

# ------------------------------------------------------------------ Description tab
# Sections render in pack order. No image of any kind is emitted into this tab.
# The Section 2 anchor is wired in rightToExistEntries.tsx (that block is rendered by
# the shared RightToExist component, not by descriptionHtml), so it is excluded here.
SECTION2_HREF = COPY["section2"]["link"]["href"]
INTERNAL = [l for l in COPY["links"]["internal"] if l["href"] != SECTION2_HREF]


def linkify(text, used):
    """Wrap each approved anchor ONCE, at its first occurrence, page-wide."""
    for entry in INTERNAL:
        for anchor in entry["anchors"]:
            if entry["href"] in used:
                continue
            at = text.find(anchor)
            if at < 0:
                continue
            used.add(entry["href"])
            return (E(text[:at])
                    + '<a href="' + entry["href"] + '">' + E(anchor) + '</a>'
                    + linkify(text[at + len(anchor):], used))
    return E(text)


used_links = set()
parts = []
for sec in COPY["description_tab"]["sections"]:
    body = ["<h2>" + E(sec["h2"]) + "</h2>"]
    for it in sec["items"]:
        if it["type"] == "p":
            body.append("<p>" + linkify(it["text"], used_links) + "</p>")
        elif it["type"] == "bullet":
            body.append("<ul>" + "".join("<li>" + linkify(b, used_links) + "</li>" for b in it["items"]) + "</ul>")
        elif it["type"] == "table":
            head = "".join("<th>" + E(h) + "</th>" for h in it["header"])
            rows = "".join("<tr>" + "".join("<td>" + E(c) + "</td>" for c in r) + "</tr>" for r in it["rows"])
            body.append("<table><thead><tr>" + head + "</tr></thead><tbody>" + rows + "</tbody></table>")
        elif it["type"] == "faq":
            body.append("<h3>" + E(it["q"]) + "</h3><p>" + E(it["a"]) + "</p>")
        else:
            raise SystemExit("unknown description item type: " + it["type"])
    parts.append("<section>" + "".join(body) + "</section>")
description_html = "".join(parts)

missing = [e["href"] for e in INTERNAL if e["href"] not in used_links]
if missing:
    raise SystemExit("approved anchor never matched its phrase: " + repr(missing))

# ------------------------------------------------- Explore the Range / YMAL tiles
# Derived: hub first, then the pack cluster order, then pending_until_200 entries
# that have gone live. Self excluded. never_list NEVER rendered. Only 200s ship.
TILE_META = {
    "/product/portable-office": ("Portable Office",
        "/images/products/portable-office/20x10/portable-office-20x10-front-angle.webp",
        "Portable Office 20 x 10 ft exterior render"),
    "/product/portable-office/readymade-office-cabin": ("Readymade Office Cabin",
        "/images/products/readymade-office-cabin/20x10/readymade-office-cabin-20x10-front.webp",
        "Readymade Office Cabin 20 x 10 ft exterior render"),
    "/product/portable-office/prefabricated-office-cabins": ("Prefabricated Office Cabins",
        "/images/products/prefabricated-office-cabins/20x10/prefabricated-office-cabin-20x10-front-angle.webp",
        "Prefabricated Office Cabins 20 x 10 ft exterior render"),
    "/product/portable-office/small-office-cabin": ("Small Office Cabin",
        "/images/products/small-office-cabin/10x10/small-office-cabin-10x10-front-angle.webp",
        "Small Office Cabin 10 x 10 ft exterior render"),
    "/product/portable-office/executive-portable-office": ("Executive Portable Office",
        "/images/products/executive-portable-office/gallery/20x10/executive-portable-office-20x10-front-centred-door.webp",
        "Executive Portable Office 20 x 10 ft exterior render"),
    "/product/portable-office/portable-weighbridge-office": ("Portable Weighbridge Office",
        "/images/products/portable-weighbridge-office/20x10/portable-weighbridge-office-20x10-yard-exterior-wall-a-entry.webp",
        "Portable Weighbridge Office 20 x 10 ft exterior render"),
}


def live(path):
    req = urllib.request.Request("https://www.samanportable.com" + path,
                                 headers={"User-Agent": "Mozilla/5.0 PO05"})
    try:
        return urllib.request.urlopen(req, timeout=30).status == 200
    except Exception as exc:
        return False


ER = COPY["explore_range"]
tiles, skipped = [], []
print("Explore the Range / YMAL destinations:")
for href in list(ER["order"]) + list(ER["pending_until_200"]):
    if href in ER["never_list"] or href.endswith("/" + SLUG):
        skipped.append((href, "never_list" if href in ER["never_list"] else "self"))
        continue
    if not live(href):
        skipped.append((href, "not 200 at build time"))
        continue
    title, src, alt = TILE_META[href]
    tiles.append({"title": title, "href": href, "category": "Portable Office",
                  "blurb": "Explore " + title, "imageSrc": src, "imageAlt": alt})
    print("   %-58s 200 -> rendered" % href)
for href, why in skipped:
    print("   %-58s skipped (%s)" % (href, why))
for t in tiles:
    assert os.path.exists(os.path.join(ROOT, "public" + t["imageSrc"])), t["imageSrc"]

# ------------------------------------------------------------------------ assemble
meta, hero = COPY["meta"], COPY["hero"]
data = {
    "productSlug": SLUG,
    "productName": COPY["schema"]["product_name"],
    "variantAxis": "size",
    "defaultVariant": hero["default_size"],
    "hsn": "9406",
    "gstPercent": 18,
    "emitAggregateOffer": True,
    "variants": variants,
    "specPdfHref": "/" + AMAP["spec_pdf"]["out"].replace("public/", ""),
    "schemaIncludeVariantOffers": True,
    "suppressLegacySku": True,
    "suppressReviewClaims": True,
    "suppressLegacyFaqSchema": True,
    "suppressSchemaAvailability": True,
    # SAMAN forbidden-claim list bans a published certification, accreditation or
    # warranty period on this page. The shared hero DEFAULT trust line asserts both
    # ("ISO 9001:2015 certified manufacturer ... 5-year structural and 1-year finishing
    # warranty"), so this route supplies its own trust string through the component
    # existing data field. The component itself is untouched; PO-03 set the same value.
    "trustStripText": "GST registered",
    "categoryLabel": meta["breadcrumb"][2],
    "categoryHref": COPY["section2"]["link"]["href"],
    "specPdfButtonLabel": AMAP["spec_pdf"]["link_label"],
    "schemaBrandName": COPY["schema"]["brand"],
    "h1": meta["h1"],
    "seoTitle": meta["title"],
    "metaDescription": meta["description"],
    "canonical": meta["canonical"],
    "opener": hero["short_description"],
    "ymalTiles": tiles,
    "relatedTiles": tiles,
    "faqSchema": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": f["q"],
                        "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
                       for f in COPY["faq_schema"]],
    },
    "descriptionHtml": description_html,
    "applicationsContent": {
        "h2": COPY["section3"]["h2"],
        "intro": COPY["section3"]["intro"],
        "panels": panels,
    },
    "labelActiveThumbnailAlt": True,
    "optimizeLocalGalleryImages": False,
}

# ------------------------------------------------------------------- assert, write
assert [v["sizeSlug"] for v in variants] == [v["slug"] for v in hero["variants"]]
for v, src in zip(variants, hero["variants"]):
    assert v["priceInclGst"] == round(v["priceExGst"] * 1.18), v["sizeSlug"]
    assert round(v["priceExGst"] / v["areaSqft"]) == src["rate_per_sqft"], v["sizeSlug"]
assert len(variants[0]["images"]) == 4, "10x10 ships four slides (SAMAN ruling)"
assert all(len(v["images"]) == 6 for v in variants[1:])
blob = json.dumps(data, ensure_ascii=False)
for held in AMAP["held_out"]["files"]:
    stem = os.path.basename(held).rsplit(".", 1)[0]
    assert stem not in blob, "held-out file referenced: " + stem
for never in COPY["links"]["never"]:
    if never.startswith("/"):
        assert never not in blob, "never-list link present: " + never
# Visible FAQ copy and the FAQ schema must stay byte-identical.
for q in COPY["faq_schema"]:
    assert E(q["q"]) in description_html and E(q["a"]) in description_html, q["q"]
assert "—" not in blob, "U+2014 in rendered copy"
alts = [i["alt"] for v in variants for i in v["images"]] + [p["image"]["alt"] for p in panels]
assert len(alts) == len(set(alts)), "duplicate alt"

out = os.path.join(ROOT, "src", "data", "products", SLUG + ".json")
with open(out, "w", encoding="utf-8") as fh:
    json.dump(data, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("\nwrote %s  (%d variants, %d gallery images, %d panels, %d tiles)"
      % (out, len(variants), len(alts) - len(panels), len(panels), len(tiles)))
