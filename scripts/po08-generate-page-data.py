#!/usr/bin/env python3
"""Generate PO-08's product JSON and wp-export record from the signed pack.

Every rendered string is READ from content/po-08/*.json. Nothing is retyped here:
this file contains structure and wiring only, so the pack stays the single source
of copy and a re-run reproduces the data files byte-for-byte.
"""
import json, os, sys, re

sys.stdout.reconfigure(encoding="utf-8")

REPO = r"C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\po08-portable-conference-cabin-20260906"
PACK = os.path.join(REPO, "content", "po-08")
copy = json.load(open(os.path.join(PACK, "PO-08-portable-conference-cabin-copy-v1.json"), encoding="utf-8"))
amap = json.load(open(os.path.join(PACK, "PO-08-portable-conference-cabin-asset-map-v1.json"), encoding="utf-8"))

SLUG = copy["slug"]
IMG_ROOT = "/" + amap["output_root"].replace("public/", "")

def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

def esc_attr(s):
    return esc(s).replace('"', "&quot;")

# ---------------------------------------------------------------- alt lookups
# alt_text.gallery_new is keyed by OUTPUT FILE NAME, as the asset map says.
gallery_alt = copy["alt_text"]["gallery_new"]
def alt_for_out(out):
    if out in gallery_alt:
        return gallery_alt[out]
    base = os.path.basename(out)
    for k, v in gallery_alt.items():
        if os.path.basename(k) == base:
            return v
    raise KeyError(f"no alt for gallery output {out}")

# ------------------------------------------------------------------- variants
variants = []
for v in copy["hero"]["variants"]:
    slug = v["slug"]
    cells = v["feature_cells"]
    feature_cells = [{"label": k, "value": cells[k]} for k in
                     ["Size", "Roof", "Openings", "Table & seats", "Clear circulation"]]
    feature_cells += [{"label": k, "value": copy["hero"]["fixed_cells"][k]} for k in
                      ["Material", "Delivery", "Coverage", "Brand"]]
    images = []
    for slide in amap["gallery_new"][slug]["slides"]:
        images.append({
            "src": f"{IMG_ROOT}/{slide['out']}",
            "alt": alt_for_out(slide["out"]),
            "provenance": "render",
            "width": amap["rules"]["gallery"]["width_px"],
            "height": amap["rules"]["gallery"]["width_px"],
        })
    variants.append({
        "sizeSlug": slug,
        "label": v["label"],
        "dims": v["size_label"],
        "areaSqft": v["area_sqft"],
        "priceExGst": v["price_ex_gst"],
        "priceInclGst": v["price_incl_gst"],
        "featureCells": feature_cells,
        "images": images,
    })

# ------------------------------------------------------- Section 3 explorer
panels = []
s3files = amap["section3_images"]["files"]
s3alt = copy["alt_text"]["section3_images"]
for s in copy["section3"]["sizes"]:
    slug = s["slug"]
    panels.append({
        "sizeSlug": slug,
        "h3": s["h3"],
        "paragraph": s["paragraph"],
        # SECTION3_<size>_BULLETS names nothing in the repo; the pack's bullets are
        # wired verbatim into the explorer's applications list.
        "applications": list(s["bullets"]),
        "image": {
            "src": f"{IMG_ROOT}/{s3files[slug]['out']}",
            "alt": s3alt[s3files[slug]["out"]],
            "width": amap["rules"]["section3_image"]["width_px"],
            "height": round(amap["rules"]["section3_image"]["width_px"] * 9 / 16),
        },
    })

# ------------------------------------------------------- Description tab HTML
# The six images render INSIDE this tab, at the anchors the pack gives, using the
# same author-marked-slot mechanism the design lock uses (data-c08-info-image).
desc_alt = copy["alt_text"]["description_images"]
desc_files = amap["description_images"]["files"]
out_to_key = {f["out"]: k for k, f in desc_files.items()}

# Only the links whose `where` names the Description tab are wrapped here; the
# Section 2 link is placed in rightToExistEntries. Longest anchor first, because
# the Section 2 anchor "Portable Office Cabin range" is a substring of the
# Description tab's "general Portable Office Cabin range" and would shadow it.
internal_links = sorted(
    [li for li in copy["links"]["internal"] if li["where"].startswith("Description tab")],
    key=lambda li: -max(len(a) for a in li["anchors"]),
)

def linkify(text, used):
    """Wrap each approved anchor in its href, once each, where the phrase occurs.

    A paragraph may carry more than one anchor (the "wrong choice" section carries
    both), so every anchor is located first and the paragraph is rebuilt in one
    pass; matches are non-overlapping and longest-anchor-first, so a shorter anchor
    can never consume a longer one's phrase.
    """
    hits = []
    for li in internal_links:
        for anchor in li["anchors"]:
            key = (li["href"], anchor)
            if key in used:
                continue
            start = 0
            while True:
                idx = text.find(anchor, start)
                if idx < 0:
                    break
                if any(idx < h_end and h_start < idx + len(anchor) for h_start, h_end, _, _ in hits):
                    start = idx + 1
                    continue
                # The acceptance gate compares the paragraph's TAG-STRIPPED text
                # against the pack string, and tag stripping substitutes a space for
                # every tag. A </a> that lands immediately before punctuation would
                # therefore leave "range . If" where the pack reads "range. If". So
                # the link is grown over any adjacent punctuation until both of its
                # boundaries sit on whitespace (or the paragraph edge); the approved
                # anchor phrase is always wholly inside the link, and only trailing
                # punctuation is ever absorbed.
                a_start, a_end = idx, idx + len(anchor)
                while a_end < len(text) and not text[a_end].isspace() and not text[a_end].isalnum():
                    a_end += 1
                while a_start > 0 and not text[a_start - 1].isspace() and not text[a_start - 1].isalnum():
                    a_start -= 1
                hits.append((a_start, a_end, li["href"], text[a_start:a_end]))
                used.add(key)
                break
    if not hits:
        return esc(text)
    hits.sort()
    out, cursor = [], 0
    for h_start, h_end, href, shown in hits:
        out.append(esc(text[cursor:h_start]))
        out.append(f'<a href="{esc_attr(href)}">{esc(shown)}</a>')
        cursor = h_end
    out.append(esc(text[cursor:]))
    return "".join(out)

used_links = set()
sections_html = []
for sec in copy["description_tab"]["sections"]:
    parts = [f"<h2>{esc(sec['h2'])}</h2>"]
    for it in sec["items"]:
        t = it["type"]
        if t == "p":
            parts.append(f"<p>{linkify(it['text'], used_links)}</p>")
        elif t == "bullet":
            lis = "".join(f"<li>{esc(x)}</li>" for x in it["items"])
            parts.append(f"<ul>{lis}</ul>")
        elif t == "table":
            head = "".join(f"<th>{esc(h)}</th>" for h in it["header"])
            body = "".join("<tr>" + "".join(f"<td>{esc(c)}</td>" for c in row) + "</tr>"
                           for row in it["rows"])
            parts.append(f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>")
        elif t == "faq":
            parts.append(f"<h3>{esc(it['q'])}</h3><p>{esc(it['a'])}</p>")
        elif t == "image":
            w = amap["rules"]["description_image"]["width_px"]
            parts.append(
                f'<img src="{esc_attr(IMG_ROOT + "/" + it["out"])}"'
                f' alt="{esc_attr(it["alt"])}"'
                f' width="{w}" height="{round(w * 9 / 16)}"'
                f' data-c08-info-image="true" />'
            )
            base = os.path.basename(it["out"])
            assert desc_alt[base] == it["alt"], f"alt mismatch for {base}"
            assert it["out"] in out_to_key, f"unmapped description image {it['out']}"
        else:
            raise ValueError(f"unknown description item type {t}")
    sections_html.append("<section>" + "".join(parts) + "</section>")
description_html = "".join(sections_html)

missing = [(li["href"], a) for li in internal_links for a in li["anchors"]
           if (li["href"], a) not in used_links]
if missing:
    print("  !! internal anchors not placed in the Description tab:", missing)

# ------------------------------------------------------------------ FAQ schema
faq_schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {"@type": "Question", "name": f["q"],
         "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
        for f in copy["faq_schema"]
    ],
}

# --------------------------------------------------------- cluster link tiles
# Explore the Range / YMAL: hub first, then the pack's cluster order, this page
# excluded, never_list excluded, and only destinations that answer 200.
STATUS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                     "link-status.json"), encoding="utf-8"))
never = set(copy["explore_range"]["never_list"]) | set(copy["links"]["never"])
self_path = f"/product/portable-office/{SLUG}"

TILE_META = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                        "tile-meta.json"), encoding="utf-8"))

tiles = []
for href in copy["explore_range"]["order"]:
    if href in never or href == self_path:
        continue
    if STATUS.get(href) != 200:
        print(f"  .. skipped (not 200): {href}")
        continue
    tiles.append(dict(TILE_META[href]))

product = {
    "productSlug": SLUG,
    "productName": copy["schema"]["product_name"],
    "variantAxis": "size",
    "defaultVariant": copy["hero"]["default_size"],
    "hsn": 9406,
    "gstPercent": 18,
    "emitAggregateOffer": True,
    "variants": variants,
    "specPdfHref": "/" + amap["spec_pdf"]["out"].replace("public/", ""),
    "schemaIncludeVariantOffers": True,
    "suppressLegacySku": True,
    "suppressReviewClaims": True,
    "suppressLegacyFaqSchema": True,
    # PO-08 - the Explorer renders an <img> for the ACTIVE panel only, so this
    # opt-in emits the hidden manifest of all six Section 3 photographs.
    "emitExplorerImageManifest": True,
    # PO-08 - the buy box renders ONE size's cells at a time, exactly as the design
    # lock does; this PO-04 opt-in additionally ships every other size's approved
    # facts in the hidden completeness block so all six are crawlable in SSR.
    "emitVariantFactCompleteness": True,
    "materialLabel": copy["hero"]["fixed_cells"]["Material"],
    "deliveryLabel": copy["hero"]["fixed_cells"]["Delivery"],
    "coverageLabel": copy["hero"]["fixed_cells"]["Coverage"],
    # The shared default asserts ISO 9001:2015 certification and a 5-year warranty;
    # this page may claim neither, so it carries the PO-03/PO-05 literal.
    "trustStripText": "GST registered",
    "hideHeroProofRow": True,
    "categoryLabel": copy["meta"]["breadcrumb"][2],
    "categoryHref": "/product/portable-office",
    "specPdfButtonLabel": amap["spec_pdf"]["link_label"],
    "schemaBrandName": copy["schema"]["brand"],
    "priceCaption": "Prices exclude GST. GST is 18 per cent under HSN 9406.",
    "h1": copy["meta"]["h1"],
    "seoTitle": copy["meta"]["title"],
    "metaDescription": copy["meta"]["description"],
    "canonical": copy["meta"]["canonical"],
    "opener": copy["hero"]["short_description"],
    "ymalTiles": tiles,
    "relatedTiles": tiles,
    "suppressSchemaAvailability": True,
    "faqSchema": faq_schema,
    "descriptionHtml": description_html,
    "applicationsContent": {
        "h2": copy["section3"]["h2"],
        "intro": copy["section3"]["intro"],
        "panels": panels,
    },
    "labelActiveThumbnailAlt": True,
    "optimizeLocalGalleryImages": False,
}

dest = os.path.join(REPO, "src", "data", "products", f"{SLUG}.json")
with open(dest, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(product, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("wrote", dest)

# ------------------------------------------------------------ wp-export record
head = (
    f"<title>{esc(copy['meta']['title'])}</title>\n"
    f"<meta name=\"description\" content=\"{esc_attr(copy['meta']['description'])}\"/>\n"
    f"<meta name=\"robots\" content=\"index, follow\"/>\n"
    f"<link rel=\"canonical\" href=\"{esc_attr(copy['meta']['canonical'])}\" />\n"
)
wp = {
    "id": 2026090601,
    "name": copy["schema"]["product_name"],
    "slug": SLUG,
    "permalink": copy["meta"]["canonical"],
    "date_created": "2026-09-06T00:00:00",
    "date_modified": "2026-09-06T00:00:00",
    "type": "simple",
    "status": "publish",
    "featured": False,
    "catalog_visibility": "visible",
    "description": "",
    "short_description": "",
    "sku": "",
    "price": "",
    "regular_price": "",
    "sale_price": "",
    "on_sale": False,
    "purchasable": False,
    "virtual": False,
    "downloadable": False,
    "downloads": [],
    "manage_stock": False,
    "stock_quantity": None,
    "stock_status": "instock",
    "backorders": "no",
    "reviews_allowed": True,
    "average_rating": "0.00",
    "rating_count": 0,
    "categories": [{"id": 230, "name": "Portable Office", "slug": "portable-office"}],
    "brands": [{"id": 3870, "name": "Saman Portable", "slug": "saman-portable"}],
    "tags": [],
    "images": [],
    "attributes": [],
    "dimensions": {"length": "", "width": "", "height": ""},
    "weight": "",
    "meta_data": [],
    "_rank_math_head": {"success": True, "head": head},
    "category": "Portable Office",
    "category_slug": "portable-office",
}
dest2 = os.path.join(REPO, "src", "data", "wp-export", "products", f"{SLUG}.json")
with open(dest2, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(wp, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("wrote", dest2)

print(f"\nvariants={len(variants)} panels={len(panels)} tiles={len(tiles)} "
      f"descHtml={len(description_html)} faqs={len(faq_schema['mainEntity'])}")
print("internal links placed:", sorted(used_links))
