#!/usr/bin/env python3
"""PO-06 - emit src/data/products/construction-site-cabin.json from the signed pack.

Every string is READ from content/po-06; nothing is retyped here.

Design lock: this route renders the same shared components the porta-cabins route
renders. Only the four permitted content kinds differ - copy strings, images and alt
text, variant/size rows and prices, and internal-link destinations and anchors.

Two things worth knowing before editing this file:

  * Prices are SAMAN's Rs 1,450-per-sq-ft basis at 200 sq ft (ruling 1). The folder
    workbook, edited on 24 August to Rs 1,350, is the outlier and is never read; the
    six withdrawn figures are asserted absent at the bottom of this file.

  * Where an approved anchor is followed immediately by punctuation, the punctuation
    is absorbed INTO the anchor. Rendered text is identical and the clickable region
    grows by one character; the alternative - a hidden plain-text mirror - is silently
    broken inside the Description tab, where globals.css forces `display: revert
    !important` on every descendant and the "hidden" copy renders visibly (SOC-01,
    4 Sep 2026). Section 2 is not in that tab and uses the established
    `verificationText` mirror instead.
"""
import json, os, html, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(ROOT, "content", "po-06")
COPY = json.load(open(os.path.join(PACK, "PO-06-construction-site-cabin-copy-v1.json"), encoding="utf-8"))
AMAP = json.load(open(os.path.join(PACK, "PO-06-construction-site-cabin-asset-map-v1.json"), encoding="utf-8"))
MEAS = {r["out"]: r for r in json.load(open(os.path.join(ROOT, "scripts", "po06-image-measurements.json"), encoding="utf-8"))}
SLUG = "construction-site-cabin"
IMG = "/" + AMAP["output_root"].replace("public/", "")
E = lambda s: html.escape(s, quote=False)


def dim(out_rel):
    """Real encoded geometry, read back from the measurement table - never assumed."""
    m = MEAS[out_rel]
    return m["width"], m["height"]


# ---------------------------------------------------------------- hero variants
# Gallery order and output names come from the asset map: six slides per size, three
# exteriors then three interiors in file order 01-06 (SAMAN's 6 Sep 2026 sanction,
# the same one PO-04 carries - the package supplies only three exteriors per size).
# Alt text is keyed by the OUTPUT PATH in copy.alt_text.gallery_new, and comes from
# there alone: the package CSV repeats one alt per size and would fail the
# duplicate-alt DOM check (ruling 5).
galAlt = COPY["alt_text"]["gallery_new"]
fixed_cells = [{"label": lab, "value": val} for lab, val in COPY["hero"]["fixed_cells"]]
variants = []
for v in COPY["hero"]["variants"]:
    slides = AMAP["gallery_new"][v["key"]]["slides"]
    assert [s["out"] for s in slides] == v["gallery"], v["key"]
    w, h = dim(slides[0]["out"])
    variants.append({
        "sizeSlug": v["key"],
        # The chip label is DERIVED from the pack's own size key, the way PO-03 derives
        # its own; the full "10 x 10 x 8.5 ft" string is the `dims` row underneath.
        "label": v["key"].replace("x", " × ") + " ft",
        "dims": v["display"],
        "areaSqft": v["area_sqft"],
        "priceExGst": v["price_ex_gst"],
        "priceInclGst": v["price_incl_gst"],
        # The variant's own featureCells REPLACE the shared five-cell default outright
        # (LC-00), which is also how the default Delivery cell "7-21 Working Days" -
        # a string this page's pack lists in old_page_strings_absent - stops rendering
        # without any component edit or per-field override.
        "featureCells": list(v["feature_cells"]) + fixed_cells,
        "images": [{
            "src": IMG + "/" + s["out"],
            "alt": galAlt[s["out"]],
            "provenance": "render",
            "width": dim(s["out"])[0],
            "height": dim(s["out"])[1],
        } for s in slides],
    })

# ------------------------------------------------------- Section 3 explorer panels
# Headings render as H3 (project instructions section 11, 6 Sep 2026): the route joins
# CLUSTER_DESIGN_SLUGS for the premium chips, dividers, calculator and tab strip, and
# the explorerPanelHeadingAsH2 opt-in alone is scoped OFF for this slug in [slug].tsx.
gaAlt = COPY["alt_text"]["ga_boards"]
panels = []
for s in COPY["section3"]["sizes"]:
    out = s["ga_board"]
    w, h = dim(out)
    panels.append({
        "sizeSlug": s["key"],
        "h3": s["h3"],
        "paragraph": s["paragraph"],
        # Bullets wire through applicationsContent.panels[].applications. There is no
        # hashed SECTION3_<size>_BULLETS field - that name came from the retired SOC-01
        # template (project instructions section 11).
        "applications": s["applications"],
        "image": {
            "src": IMG + "/" + out,
            "alt": gaAlt[out],
            "provenance": "drawing",
            "width": w,
            "height": h,
            # A dimensioned GA board is never cropped at any size: contain it inside
            # the panel box so the dimension text and the printed price block survive.
            "fit": "contain",
        },
    })

# ------------------------------------------------------------------ Description tab
# Sections and items render in pack order. Five images (ruling 3: the 20x10 site
# exterior became the Section 2 card, so this tab carries five, not six), one bullet
# list, one table, and the eight FAQ pairs whose text is byte-identical to faq_schema.
# The Section 2 contextual link is wired in rightToExistEntries.tsx, so it is excluded.
SECTION2_HREF = COPY["section2"]["link"]["href"]
INTERNAL = [l for l in COPY["links"]["internal"] if l["href"] != SECTION2_HREF]
descAlt = COPY["alt_text"]["description"]


def linkify(text, used):
    """Wrap each approved anchor ONCE, page-wide, at the location its entry names.

    An immediately-following '.', ',', ';' or ':' is absorbed into the anchor - see
    the module docstring. Everything else is escaped and left exactly as signed.
    """
    for entry in INTERNAL:
        if entry["href"] in used:
            continue
        anchor = entry["anchor"]
        at = text.find(anchor)
        if at < 0:
            continue
        used.add(entry["href"])
        end = at + len(anchor)
        tail = ""
        if end < len(text) and text[end] in ".,;:":
            tail = text[end]
            end += 1
        return (E(text[:at])
                + '<a href="' + entry["href"] + '">' + E(anchor + tail) + '</a>'
                + linkify(text[end:], used))
    return E(text)


used_links = set()
parts = []
n_img = n_bullet = n_table = 0
for sec in COPY["description_tab"]["sections"]:
    body = ["<h2>" + E(sec["h2"]) + "</h2>"]
    for it in sec["items"]:
        kind = it["type"]
        if kind == "p":
            body.append("<p>" + linkify(it["text"], used_links) + "</p>")
        elif kind == "bullet":
            n_bullet += 1
            body.append("<ul>" + "".join("<li>" + linkify(b, used_links) + "</li>"
                                         for b in it["items"]) + "</ul>")
        elif kind == "table":
            n_table += 1
            cap = "<caption>" + E(it["caption"]) + "</caption>" if it.get("caption") else ""
            head = "".join("<th>" + E(c) + "</th>" for c in it["headers"])
            rows = "".join("<tr>" + "".join("<td>" + E(c) + "</td>" for c in r) + "</tr>"
                           for r in it["rows"])
            body.append("<table>" + cap + "<thead><tr>" + head + "</tr></thead>"
                        "<tbody>" + rows + "</tbody></table>")
        elif kind == "image":
            # The porta-cabins design lock publishes its Description-tab frames as bare
            # inline <img src width height loading alt> inside descriptionHtml - no
            # figure wrapper, no class, no injection layer. Same markup, same attribute
            # order, at the position the copy pack encodes.
            n_img += 1
            w, h = dim(it["src"])
            assert it["alt"] == descAlt[it["src"]], it["src"]
            body.append('<img src="' + IMG + "/" + it["src"] + '" width="%d" height="%d" ' % (w, h)
                        + 'loading="lazy" alt="' + html.escape(descAlt[it["src"]], quote=True) + '">')
        elif kind == "faq":
            body.append("<h3>" + E(it["question"]) + "</h3><p>" + E(it["answer"]) + "</p>")
        else:
            raise SystemExit("unknown description item type: " + kind)
    parts.append("<section>" + "".join(body) + "</section>")
description_html = "".join(parts)

missing = [e["href"] for e in INTERNAL if e["href"] not in used_links]
if missing:
    raise SystemExit("approved anchor never matched its phrase: " + repr(missing))

# ------------------------------------------------- Explore the Range / YMAL tiles
# Derived, never hand-authored: hub first, then the cluster siblings in the pack's
# order, this page excluded, no duplicates, no cross-cluster tiles, never_list never
# rendered, and only destinations returning 200 at build time. Titles come from the
# pack's own labels; the image and its alt are the literals already deployed for that
# destination on its sibling pages, so no new alt text is invented here.
TILE_META = {
    "/product/portable-office": (
        "/images/products/portable-office/20x10/portable-office-20x10-front-angle.webp",
        "Portable Office Cabin 20 x 10 ft exterior render"),
    "/product/portable-office/readymade-office-cabin": (
        "/images/products/readymade-office-cabin/20x10/readymade-office-cabin-20x10-front.webp",
        "Readymade Office Cabin 20 x 10 ft exterior render"),
    "/product/portable-office/prefabricated-office-cabins": (
        "/images/products/prefabricated-office-cabins/20x10/prefabricated-office-cabin-20x10-front-angle.webp",
        "Prefabricated Office Cabins 20 x 10 ft exterior render"),
    "/product/portable-office/portable-weighbridge-office": (
        "/images/products/portable-weighbridge-office/20x10/portable-weighbridge-office-20x10-yard-exterior-wall-a-entry.webp",
        "Portable Weighbridge Office 20 x 10 ft exterior render"),
    "/product/portable-office/executive-portable-office": (
        "/images/products/executive-portable-office/gallery/20x10/executive-portable-office-20x10-front-centred-door.webp",
        "Executive Portable Office 20 x 10 ft exterior render"),
    "/product/portable-office/small-office-cabin": (
        "/images/products/small-office-cabin/10x10/small-office-cabin-10x10-front-angle.webp",
        "Small Office Cabin 10 x 10 ft exterior render"),
}


def live(path):
    req = urllib.request.Request("https://www.samanportable.com" + path,
                                 headers={"User-Agent": "Mozilla/5.0 PO06"})
    try:
        return urllib.request.urlopen(req, timeout=45).status
    except Exception as exc:
        return getattr(exc, "code", 0)


ER = COPY["explore_range"]
tiles, skipped, seen = [], [], set()
print("Explore the Range / You may also like destinations:")
for entry in ER["order"]:
    href, title = entry["href"], entry["label"]
    if href in ER["never_list"]:
        skipped.append((href, "never_list")); continue
    if href.rstrip("/").endswith("/" + SLUG):
        skipped.append((href, "self")); continue
    if href in seen:
        skipped.append((href, "duplicate")); continue
    code = live(href)
    if code != 200:
        skipped.append((href, "HTTP %s at build time" % code)); continue
    seen.add(href)
    src, alt = TILE_META[href]
    tiles.append({"title": title, "href": href, "category": "Portable Office",
                  "blurb": "Explore " + title, "imageSrc": src, "imageAlt": alt})
    print("   %-58s 200 -> rendered" % href)
for href, why in skipped:
    print("   %-58s skipped (%s)" % (href, why))
for n in ER["never_list"]:
    assert n not in [t["href"] for t in tiles]
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
    "specPdfHref": "/" + AMAP["spec_pdf"]["out"].replace("public/", "") if AMAP["spec_pdf"]["out"].startswith("public/") else IMG + "/" + AMAP["spec_pdf"]["out"],
    "schemaIncludeVariantOffers": True,
    "suppressReviewClaims": True,
    "suppressLegacyFaqSchema": True,
    "suppressSchemaAvailability": True,
    "categoryLabel": meta["breadcrumb"][2],
    "categoryHref": SECTION2_HREF,
    "specPdfButtonLabel": COPY["specifications_tab"]["pdf_link"]["label"],
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
        "mainEntity": [{"@type": "Question", "name": f["question"],
                        "acceptedAnswer": {"@type": "Answer", "text": f["answer"]}}
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
assert [v["sizeSlug"] for v in variants] == [v["key"] for v in hero["variants"]]
assert [p["sizeSlug"] for p in panels] == [v["key"] for v in hero["variants"]]
assert data["defaultVariant"] == "20x10"
for v, src in zip(variants, hero["variants"]):
    assert v["priceInclGst"] == round(v["priceExGst"] * 1.18), v["sizeSlug"]
    assert abs(v["priceExGst"] / v["areaSqft"] - src["rate_per_sqft"]) < 0.01, v["sizeSlug"]
assert all(len(v["images"]) == 6 for v in variants), "six slides per size"
assert variants[0]["priceExGst"] == hero["from_price_ex_gst"] == 166750
assert COPY["schema"]["aggregate_offer"]["lowPrice"] == min(v["priceExGst"] for v in variants)
assert COPY["schema"]["aggregate_offer"]["highPrice"] == max(v["priceExGst"] for v in variants)
assert COPY["schema"]["aggregate_offer"]["offerCount"] == len(variants) == 6

blob = json.dumps(data, ensure_ascii=False)
# Ruling 1 - the withdrawn Rs 1,350 workbook basis must appear nowhere.
for wrong in ["1,55,250", "2,37,600", "2,70,000", "3,11,040", "3,88,800", "5,13,000",
              "155250", "237600", "270000", "311040", "388800", "513000"]:
    assert wrong not in blob, "withdrawn Rs 1,350-basis price present: " + wrong
for never in COPY["explore_range"]["never_list"]:
    assert never not in blob, "never-list link present: " + never
assert "—" not in blob, "U+2014 in rendered copy"
for bad in COPY["old_page_strings_absent"]:
    assert bad.lower() not in blob.lower(), "forbidden string present: " + bad
# Visible FAQ copy and the FAQ schema stay byte-identical (the L20 punctuation policy
# rewrites ' - ' in rendered body copy but never touches faqSchema; this pack carries
# no em dash at all, and this assertion is what keeps that true after any re-issue).
for f in COPY["faq_schema"]:
    assert E(f["question"]) in description_html and E(f["answer"]) in description_html, f["question"]
# Description tab shape: exactly one bullet list, one table, five images.
assert n_bullet == 1 and n_table == 1 and n_img == 5, (n_bullet, n_table, n_img)
assert description_html.count("<img ") == 5
assert description_html.index("<h2>") < description_html.index("<img ")
# No image sits directly against another image or against a heading.
assert "><img " not in description_html.replace("</p><img ", "").replace("</table><img ", "")
# Every alt on the page is unique.
alts = ([i["alt"] for v in variants for i in v["images"]]
        + [p["image"]["alt"] for p in panels]
        + [COPY["alt_text"]["description"][k] for k in COPY["alt_text"]["description"]]
        + [COPY["alt_text"]["section2_card"][k] for k in COPY["alt_text"]["section2_card"]]
        + [COPY["alt_text"]["spec_diagrams"][k] for k in COPY["alt_text"]["spec_diagrams"]])
assert len(alts) == len(set(alts)) == 50, (len(alts), len(set(alts)))
# Ruling 3 - the Section 2 card is a photograph, not a GA board.
assert "ga-specification-board" not in AMAP["section2_card"]["src"]

out = os.path.join(ROOT, "src", "data", "products", SLUG + ".json")
with open(out, "w", encoding="utf-8") as fh:
    json.dump(data, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("\nwrote %s\n  %d variants, %d gallery slides, %d explorer panels, %d tiles, %d unique alts"
      % (out, len(variants), sum(len(v["images"]) for v in variants), len(panels), len(tiles), len(set(alts))))
