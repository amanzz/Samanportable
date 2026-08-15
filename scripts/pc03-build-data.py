# -*- coding: utf-8 -*-
"""Emits the PC-03 data files. Every string comes from build prompt v2 section 12 via
pc03-copy.py, which refuses to run unless the SHA-256 fields verify, so no copy can be
retyped here. Numbers come from the section 12.5 workbook table only."""
import hashlib
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import pc03_copy_shim as C  # noqa: E402

COPY = C.COPY
IMG = json.load(io.open(os.path.join(HERE, 'pc03-image-report.json'), encoding='utf-8'))

# ── derived identifiers (same method as the GI sibling) ──────────────────────
PRODUCT_ID = 990023
CATEGORY = {"id": 202, "name": "Porta Cabins", "slug": "porta-cabins"}
HSN = "9406"

# ── section 12.5 workbook table, SSOT order SZ-01 to SZ-06 ───────────────────
LADDER = [
    dict(code="SZ-01", slug="20x10", area=400,  ex=497800,  incl=587404,  rate="1,244.50",
         cells="20x10 ft x G+1 · 400 sq ft",   app="office over office, gate zone"),
    dict(code="SZ-02", slug="30x10", area=600,  ex=730980,  incl=862556,  rate="1,218.30",
         cells="30x10 ft x G+1 · 600 sq ft",   app="boundary-strip offices"),
    dict(code="SZ-03", slug="20x20", area=800,  ex=953680,  incl=1125342, rate="1,192.10",
         cells="20x20 ft x G+1 · 800 sq ft",   app="open team rooms, training"),
    dict(code="SZ-04", slug="40x10", area=800,  ex=953680,  incl=1125342, rate="1,192.10",
         cells="40x10 ft x G+1 · 800 sq ft",   app="multi-room linear rows"),
    dict(code="SZ-05", slug="40x12", area=960,  ex=1131840, incl=1335571, rate="1,179.00",
         cells="40x12 ft x G+1 · 960 sq ft",   app="deeper offices, conference"),
    dict(code="SZ-06", slug="30x20", area=1200, ex=1414800, incl=1669464, rate="1,179.00",
         cells="30x20 ft x G+1 · 1,200 sq ft", app="multi-department building"),
]

MATERIAL = "MS Frame · Engineered Stacked Modules"
DELIVERY = "7-21 Working Days"        # 12.3, hyphen as written; deployed default is an en dash
COVERAGE = "Bangalore · Delhi NCR"    # equals the deployed default, so no override is emitted
EXPLORER_INTRO = "Choose your footprint: six factory-engineered G+1 options."

gallery = {}
for r in IMG:
    if r['slot'] == 'gallery':
        gallery.setdefault(r['size'], []).append(
            {"src": r['out'], "alt": r['alt'], "provenance": "render",
             "width": r['w'], "height": r['h']})

# ── Description tab: markdown to HTML, structure only, never words ───────────
DESC_IMG = {r['out'].rsplit('/', 1)[-1]: r for r in IMG if r['slot'] == 'description'}
LINKS = {
    'labour colony': 'https://www.samanportable.com/product/labor-colony',
    'porta cabins range': 'https://www.samanportable.com/product/porta-cabins',
}


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def inline(t):
    out = esc(t)
    def sub(m):
        label, url = m.group(1), m.group(2)
        if LINKS.get(label) != url:
            raise SystemExit('unapproved Description link: [%s](%s)' % (label, url))
        return '<a href="%s">%s</a>' % (url, label)
    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', sub, out)


def build_description(md):
    lines, html, i = md.split('\n'), [], 0
    n = dict(h2=0, h3=0, p=0, img=0, table=0, cap=0)
    while i < len(lines):
        s = lines[i].rstrip()
        if not s.strip():
            i += 1; continue
        if s.startswith('### '):
            html.append('<h3>%s</h3>' % esc(s[4:].strip())); n['h3'] += 1; i += 1; continue
        if s.startswith('## '):
            html.append('<h2>%s</h2>' % esc(s[3:].strip())); n['h2'] += 1; i += 1; continue
        m = re.match(r'^!\[([^\]]*)\]\(([^)]+)\)$', s)
        if m:
            fn = m.group(2).strip()
            rec = DESC_IMG.get(fn)
            if not rec:
                raise SystemExit('Description image not in manifest: ' + fn)
            # alt is copy: taken from the manifest table (section 8.2), never the md label
            html.append('<img src="%s" width="%d" height="%d" loading="lazy" alt="%s">'
                        % (rec['out'], rec['w'], rec['h'], esc(rec['alt'])))
            n['img'] += 1
            i += 1
            if i < len(lines) and lines[i].strip().startswith('*') and lines[i].strip().endswith('*'):
                cap = lines[i].strip().strip('*')
                if rec.get('caption') and cap != rec['caption']:
                    raise SystemExit('caption mismatch for %s' % fn)
                html.append('<figcaption class="saman-figcaption">%s</figcaption>' % esc(cap))
                n['cap'] += 1; i += 1
            continue
        if s.startswith('|'):
            head = [c.strip() for c in s.strip('|').split('|')]
            i += 2
            body = []
            while i < len(lines) and lines[i].startswith('|'):
                body.append([c.strip() for c in lines[i].strip('|').split('|')]); i += 1
            html.append('<div class="saman-table-wrap"><table class="saman-table"><thead><tr>'
                        + ''.join('<th>%s</th>' % inline(c) for c in head)
                        + '</tr></thead><tbody>'
                        + ''.join('<tr>' + ''.join('<td>%s</td>' % inline(c) for c in r) + '</tr>' for r in body)
                        + '</tbody></table></div>')
            n['table'] += 1
            continue
        html.append('<p>%s</p>' % inline(s.strip())); n['p'] += 1; i += 1
    return ''.join(html), n


DESC_HTML, DESC_N = build_description(COPY['DESCRIPTION_TAB'].strip())

if '—' in DESC_HTML:
    sys.exit('em dash in generated Description HTML')

# ── product data file ────────────────────────────────────────────────────────
variants = []
for v in LADDER:
    variants.append({
        "sizeSlug": v['slug'],
        "label": "%s ft" % v['slug'],
        "dims": "%s ft x G+1" % v['slug'],
        "areaSqft": v['area'],
        "priceExGst": v['ex'],
        "priceInclGst": v['incl'],
        "sku": "SP-DSPC-%s" % v['slug'],
        "useCase": v['app'],
        "images": gallery[v['slug']],
    })

product = {
    "productSlug": "double-story-porta-cabin",
    "variantAxis": "size",
    "defaultVariant": "20x10",
    "hsn": HSN,
    "gstPercent": 18,
    "h1": COPY['H1'],
    "seoTitle": COPY['META_TITLE'],
    "metaDescription": COPY['META_DESCRIPTION'],
    "opener": COPY['HERO_P1'] + "\n\n" + COPY['HERO_P2'],
    "materialLabel": MATERIAL,
    "deliveryLabel": DELIVERY,
    "pricePerSqft": {v['slug']: v['rate'] for v in LADDER},
    "applicationsDataset": "double-story-porta-cabin",
    "emitAggregateOffer": True,
    "variants": variants,
    "descriptionHtml": DESC_HTML,
    "suppressLegacyFaqSchema": True,
    "specPdfHref": "/specs/saman-double-story-porta-cabin-technical-specification.pdf",
    "specPdfButtonLabel": "Download technical specification (PDF)",
    "hasProductVideo": False,
}

# ── Section 3 explorer dataset ───────────────────────────────────────────────
panels = []
for i, v in enumerate(LADDER, 1):
    panels.append({
        "sizeSlug": v['slug'],
        "h3": COPY['VAR%d_H2' % i],
        "paragraph": COPY['VAR%d_BODY' % i],
        "applications": [],
        # VariantImage shape: the panel re-uses this size's lead gallery image and
        # therefore its approved alt, so no alt is derived or invented.
        "image": {k: gallery[v['slug']][0][k]
                  for k in ('src', 'alt', 'provenance', 'width', 'height')},
    })
applications = {"intro": EXPLORER_INTRO, "panels": panels}

# ── static-content route record ──────────────────────────────────────────────
wp = {
    "id": PRODUCT_ID,
    "name": "Double Story (G+1) Porta Cabin",
    "slug": "double-story-porta-cabin",
    "date_created": "2026-08-15T00:00:00",
    "status": "publish",
    "description": "",
    "short_description": "",
    "sku": "SP-DSPC-20x10",
    "price": str(LADDER[0]['ex']),
    "regular_price": str(LADDER[0]['ex']),
    "sale_price": "",
    "on_sale": False,
    "stock_status": "instock",
    "stock_quantity": None,
    "average_rating": "0.00",
    "rating_count": 0,
    "categories": [CATEGORY],
    "images": [{"id": PRODUCT_ID, "src": gallery['20x10'][0]['src'],
                "name": "Double Story (G+1) Porta Cabin", "alt": gallery['20x10'][0]['alt']}],
    "attributes": [],
    "weight": "",
    "dimensions": {"length": "", "width": "", "height": ""},
}


def write(rel, obj):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with io.open(p, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(obj, f, ensure_ascii=False, indent=2); f.write('\n')
    print('wrote %-58s %7.1f KB' % (rel, os.path.getsize(p) / 1024))


write('src/data/products/double-story-porta-cabin.json', product)
write('src/data/products/double-story-porta-cabin-applications.json', applications)
write('src/data/wp-export/products/double-story-porta-cabin.json', wp)

print('\nDescription HTML: h2=%(h2)d h3=%(h3)d p=%(p)d img=%(img)d table=%(table)d caption=%(cap)d' % DESC_N)
print('anchors: %d   chars: %d' % (DESC_HTML.count('<a href='), len(DESC_HTML)))
print('product id %d | category %d | sku %s | ladder %s'
      % (PRODUCT_ID, CATEGORY['id'], wp['sku'], ' '.join(str(v['ex']) for v in LADDER)))
