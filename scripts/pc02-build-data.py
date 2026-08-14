# -*- coding: utf-8 -*-
"""Emits the three PC-02 data files from one ladder, so no number is typed twice.

Every value here traces to the approved build prompt v1 (sections 2, 3, 5, 9) or to the
v1.1 addendum rulings. Derived-not-invented values (category id, product id, HSN) are
copied from the ms-porta-cabin sibling in the same cluster and are called out in the
build report."""
import io
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

DESC = json.load(open(os.path.join(HERE, 'pc02-description.json'), encoding='utf-8'))['descriptionHtml']
IMG = json.load(open(os.path.join(HERE, 'pc02-image-report.json'), encoding='utf-8'))

# ── Ruling 3: derived identifiers ────────────────────────────────────────────
PRODUCT_ID = 990022          # max existing numeric product id (990021) + 1
CATEGORY = {"id": 202, "name": "Porta Cabins", "slug": "porta-cabins"}   # copied from ms-porta-cabin.json
HSN = "9406"                 # cluster value carried by every sibling cabin record

# ── Section 3 ladder, in SSOT order ──────────────────────────────────────────
LADDER = [
    dict(code="SZ-01", slug="10x10", dims="10x10x8.5 ft", area=100, ex=158125, incl=186588, rate="1,581.25",
         h2="10x10 ft GI Porta Cabin: Compact Cabin for Exposed Gates",
         app="Compact gate / single-supervisor office at exposed locations",
         body="The 100 sq.ft size suits gate duty, weighbridge support and single-supervisor offices at exposed locations. One door and two sealed windows keep the envelope simple, which matters in salt air: fewer openings mean fewer joints to maintain. It travels as one module on a 20 ft trailer and needs only six level support points. Planning price ₹1,58,125 ex-GST (₹1,86,588 with GST), quotation-confirmed. The 50x50 SHS wall frame keeps corners square during lifts."),
    dict(code="SZ-02", slug="20x8", dims="20x8x8.5 ft", area=160, ex=242000, incl=285560, rate="1,512.50",
         h2="20x8 ft GI Porta Cabin for Narrow Plots and Tight Lanes",
         app="Narrow-plot and tight-lane site office; orientation flexibility",
         body="At 160 sq.ft with an 8 ft width, this size fits plot edges, jetty approaches and lanes where a 10 ft module cannot swing. The long wall takes the windows, so you can face openings away from prevailing sea spray, a real orientation decision on coastal plots. Interior suits a two-desk office or store-plus-office split. Planning price ₹2,42,000 ex-GST (₹2,85,560 with GST), quotation-confirmed. Wall insulation options run 50–75 mm mineral wool."),
    dict(code="SZ-03", slug="20x10", dims="20x10x8.5 ft", area=200, ex=275000, incl=324500, rate="1,375.00",
         h2="20x10 ft GI Porta Cabin: the 200 sq.ft Reference Build",
         app="Reference two-zone site office; rate benchmark size",
         body="This is the reference configuration the GI rate of ₹1,375/sq.ft is set on. It gives 200 sq.ft with one door, sealed aluminium windows and room for a four-person office or a partitioned cabin-plus-store. If you need one benchmark to compare against MS or PUF quotations, price this size first. Planning price ₹2,75,000 ex-GST (₹3,24,500 with GST), quotation-confirmed. Floors use 18–24 mm cement-bonded board on a protected grid."),
    dict(code="SZ-04", slug="20x12", dims="20x12x8.5 ft", area=240, ex=316800, incl=373824, rate="1,320.00",
         h2="20x12 ft GI Porta Cabin: Wider Bay for Meetings and Labs",
         app="Wider office / meeting / sample-testing bay",
         body="The extra 2 ft of width over the 20x10 turns a corridor office into a room that takes a meeting table or sample-testing bench with circulation space. Marine and process sites often pick it as a combined engineer office and document room. Wider roof span is carried by the galvanized roof framing with positive drainage. Planning price ₹3,16,800 ex-GST (₹3,73,824 with GST), quotation-confirmed. Ceiling liner stays moisture-tolerant metal or fibre-cement."),
    dict(code="SZ-05", slug="40x8", dims="40x8x8.5 ft", area=320, ex=418000, incl=493240, rate="1,306.25",
         h2="40x8 ft GI Porta Cabin: Long Linear Site Office Row",
         app="Long linear office row along boundaries and jetty edges",
         body="Unique to the GI ladder, this 320 sq.ft module runs 40 ft along a boundary wall or jetty edge while staying 8 ft deep for transport. The linear plan suits a row of cubicles, a control-desk line or office-plus-store-plus-toilet-lobby zoning. It moves on a 40 ft trailer, so confirm approach-road clearance early. Planning price ₹4,18,000 ex-GST (₹4,93,240 with GST), quotation-confirmed. Roof framing keeps positive drainage across the full run."),
    dict(code="SZ-06", slug="40x10", dims="40x10x8.5 ft", area=400, ex=522500, incl=616550, rate="1,306.25",
         h2="40x10 ft GI Porta Cabin: Largest Single-Module Office",
         app="Largest open-plan or partitioned team office",
         body="The 400 sq.ft flagship carries open-plan seating for eight to ten staff, or a partitioned manager-plus-team layout, in one transportable module. Roof and floor framing are sized for the 40 ft span with galvanized secondary members throughout. Site needs a 40 ft trailer approach and crane access. Planning price ₹5,22,500 ex-GST (₹6,16,550 with GST), quotation-confirmed. Freight follows the published 40 ft trailer ladder."),
]

H1 = "Galvanized Iron (GI) Porta Cabin for Corrosive Sites"
SEO_TITLE = "GI Porta Cabin: Galvanized, Coastal-Ready Build | SAMAN"
META_DESC = "GI porta cabin with galvanized frame and 0.8–1.2 mm zinc-coated cladding for coastal, humid and chemical-adjacent sites. Six sizes from ₹1,58,125 ex-GST."
HERO_P1 = "The Galvanized Iron (GI) Porta Cabin is SAMAN's corrosion-focused cabin for coastal, humid and chemical-adjacent sites where painted steel needs frequent repair. The build separates three routes most quotations mix up: a full-GI hot-dip galvanized structure, hybrid galvanized critical members, and GI/PPGI cladding on an MS frame. Your quotation names the route, the base-metal thickness and the coating mass."
HERO_P2 = "Walls use 0.8–1.2 mm BMT corrugated zinc-coated sheet to IS 277 or approved equivalent, with corrosion-compatible fasteners and EPDM/butyl sealing. Six factory-built sizes from 10x10 to 40x10 ft ship from Bengaluru and Greater Noida in 7–21 working days. Prices start at ₹1,58,125 ex-GST, with a fixed quote in 48 hours."

MATERIAL = "Zinc-coated GI/PPGI shell (full-GI, hybrid or GI-cladding build stated in quotation)"
DELIVERY = "7–21 working days"     # Ruling 3.5: explicit lower-case, shared default untouched
COVERAGE = "Pan-India, 15+ states"

gallery = {}
for r in IMG:
    if r['slot'] == 'gallery':
        gallery.setdefault(r['size'], []).append(
            {"src": r['out'], "alt": r['alt'], "provenance": "render", "width": r['w'], "height": r['h']}
        )

# ── src/data/products/gi-porta-cabin.json ────────────────────────────────────
variants = []
for v in LADDER:
    variants.append({
        "sizeSlug": v['slug'],
        "label": "%s ft" % v['slug'],
        "dims": v['dims'],
        "areaSqft": v['area'],
        "priceExGst": v['ex'],
        "priceInclGst": v['incl'],
        "sku": "SP-GIPC-%s" % v['slug'],
        "useCase": v['app'],
        "images": gallery[v['slug']],
    })

product = {
    "productSlug": "gi-porta-cabin",
    "variantAxis": "size",
    "defaultVariant": "20x10",
    "hsn": HSN,
    "gstPercent": 18,
    "h1": H1,
    "seoTitle": SEO_TITLE,
    "metaDescription": META_DESC,
    "opener": HERO_P1 + "\n\n" + HERO_P2,
    "materialLabel": MATERIAL,
    "deliveryLabel": DELIVERY,
    "coverageLabel": COVERAGE,
    "pricePerSqft": {v['slug']: v['rate'] for v in LADDER},
    "applicationsDataset": "gi-porta-cabin",
    "emitAggregateOffer": True,
    "variants": variants,
    "descriptionHtml": DESC,
    "suppressLegacyFaqSchema": True,
    "specPdfHref": "/specs/saman-gi-porta-cabin-technical-specification.pdf",
    "specPdfButtonLabel": "Download technical specification (PDF)",
    "hasProductVideo": False,
}

# ── src/data/products/gi-porta-cabin-applications.json ───────────────────────
# Section 3 of the build prompt: six H2s and six bodies, no application bullets and no
# section heading or intro in the approved copy, so none is invented.
applications = {
    "panels": [
        {"sizeSlug": v['slug'], "h3": v['h2'], "paragraph": v['body'], "applications": []}
        for v in LADDER
    ]
}

# ── src/data/wp-export/products/gi-porta-cabin.json ──────────────────────────
# Ruling 3: local static-content record. No WooCommerce product exists, so
# wc_review_product_id is omitted and the Reviews tab renders its neutral empty state.
wp = {
    "id": PRODUCT_ID,
    "name": "Galvanized Iron (GI) Porta Cabin",
    "slug": "gi-porta-cabin",
    "date_created": "2026-08-14T00:00:00",
    "status": "publish",
    "description": "",
    "short_description": "",
    "sku": "SP-GIPC-20x10",
    "price": str(LADDER[2]['ex']),
    "regular_price": str(LADDER[2]['ex']),
    "sale_price": "",
    "on_sale": False,
    "stock_status": "instock",
    "stock_quantity": None,
    "average_rating": "0.00",
    "rating_count": 0,
    "categories": [CATEGORY],
    "images": [{"id": PRODUCT_ID, "src": gallery['20x10'][0]['src'], "name": "Galvanized Iron (GI) Porta Cabin", "alt": gallery['20x10'][0]['alt']}],
    "attributes": [],
    "weight": "",
    "dimensions": {"length": "", "width": "", "height": ""},
}


def write(rel, obj):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with io.open(p, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('wrote %-52s %7.1f KB' % (rel, os.path.getsize(p) / 1024))


write('src/data/products/gi-porta-cabin.json', product)
write('src/data/products/gi-porta-cabin-applications.json', applications)
write('src/data/wp-export/products/gi-porta-cabin.json', wp)

print('\nproduct id %d | category %d | sku %s' % (PRODUCT_ID, CATEGORY['id'], wp['sku']))
print('variants %d | gallery images %d | ladder %s' % (
    len(variants), sum(len(g) for g in gallery.values()),
    ' '.join(str(v['ex']) for v in LADDER)))
