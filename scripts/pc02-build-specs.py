# -*- coding: utf-8 -*-
"""Adds the gi-porta-cabin entry to the C-01 specifications dataset, and stages the
Specifications-tab diagram plus the technical PDF.

Both tables are transcribed character-for-character from Section B of the PC-02 v1.1
addendum. The only edit anywhere is the two group headings, where the addendum's em dash
is rendered as a colon: acceptance criterion 11.3 bans U+2014 from this page's output,
and ': ' is exactly what the repo's own heading transform substitutes. No word changes.

Diagram 1 is deliberately NOT wired (Ruling 4: pulled for a wrong area figure, a broken
callout sequence and an unsourced IS 4759 / ASTM A123 claim). Diagram 2 ships with the
version and illustrative disclaimer as a rendered HTML caption, per the same ruling."""
import io
import json
import os
import shutil

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC_ROOT = r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)'

T1 = 'Table 1: Structure, chassis, envelope, roof and floor'
T2 = 'Table 2: Interior, openings, services, protection and scope'

TABLE1 = [
    ("Bottom frame", "100×50×3 mm structural channel reference; hot-dip galvanized for the full-GI build, to approved galvanizing schedule with certificates and coating-repair procedure"),
    ("Bottom stiffeners", "100×50 channels, 50×50 angles, 75×40 channels or engineered equivalent; galvanized/zinc-protected; welded/cut locations repaired with approved zinc-rich system"),
    ("Floor frame", "Galvanized/MS cross-grid; dissimilar-material contact and trapped-water pockets isolated or drained; underside corrosion-protected"),
    ("Top frame", "50×50×1.6 mm SHS reference, galvanized/pre-galvanized; final section by span and openings"),
    ("Roof stiffeners", "50×50×1.2 mm primary with 50×40 / 40×40 / 50×25 secondary members as required; positive drainage retained"),
    ("Corner posts / walls", "50×50×2 mm SHS or 60×60 mm angle reference, galvanized/zinc-protected; reinforced door/window openings"),
    ("Exterior walls", "0.8–1.2 mm BMT corrugated GI/PPGI; IS 277 or approved equivalent; BMT and coating mass stated in project schedule"),
    ("Roof sheet", "1.0–1.4 mm BMT profiled GI/PPGI; sealed laps and flashings; compatible fasteners and washers"),
    ("Floor base", "18–24 mm cement-bonded board on protected steel grid, screw-fixed with corrosion-compatible fasteners"),
    ("Floor finish", "2 mm commercial vinyl (office duty) or 3 mm chequered steel (rough duty), per quotation"),
    ("Lifting / handling", "Engineered lifting/support points; movement only to approved lifting, support and transport drawing"),
    ("Welding & fabrication", "Qualified welding/bolting to approved shop drawings; frame inspected before panels close"),
]

TABLE2 = [
    ("Interior walls", "0.40–0.50 mm pre-painted GI liner (default) or 8 mm fibre-cement board; MDF not default in damp service"),
    ("Ceiling", "0.40–0.50 mm pre-painted metal liner or 6–8 mm fibre-cement board; cut edges and penetrations sealed"),
    ("Wall insulation", "50–75 mm mineral wool or 50 mm PUF/PIR infill; climate-specific vapour control"),
    ("Roof insulation", "75–100 mm mineral wool or 60–80 mm insulated roof panel; condensation, drainage and flashings detailed as one system"),
    ("External finish", "Project-selected colour and compatible coating system per approved finish schedule"),
    ("Fasteners & sealing", "Corrosion-compatible fasteners; EPDM/butyl/approved sealants at joints, corners, laps, penetrations; no unsealed field cuts"),
    ("Main door", "7×3 ft office door or heavy-duty leaf; galvanized/MS frame; compatible hardware; anti-water-trap threshold"),
    ("Windows", "Powder-coated aluminium, 4–5 mm glass, sealed and isolated from dissimilar steel; louvers/reduced openings optional"),
    ("Grills / mesh", "Grill, mosquito mesh, guard or louver only where the approved opening schedule requires"),
    ("Electrical wiring", "1.5 / 2.5 / 4 sq.mm copper starting schedule; final by load and approved drawing"),
    ("Electrical protection", "DB with MCB/RCCB, earthing, segregated circuits to approved electrical drawing"),
    ("Electrical fittings", "LED lights, modular switches, 6A/16A sockets, fan/AC provision; quantities quotation-specific"),
    ("Ventilation / AC", "Natural ventilation, corrosion-resistant louver/exhaust, AC provision; condensate routed clear of chassis and cladding"),
    ("Plumbing (optional)", "Not standard; sleeved, sealed penetrations; dissimilar metals isolated"),
    ("Layout", "Single-room or partitioned; quotation states full-GI / hybrid / GI-cladding route"),
    ("Painting / coating", "Substrate-matched protection; galvanized steel gets compatible cut-edge and damage repair"),
    ("Quality checks", "Pre-dispatch dimensional, enclosure, service and functional QA; specialist certificates verified where required"),
    ("Warranty", "5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation"),
]

NARRATIVE = ("These specifications change three things a buyer feels later. The stated "
             "BMT-plus-coating-mass line makes offers comparable and auditable at delivery. "
             "The corrosion-compatible fastener and sealing scope removes the usual first "
             "failure points. And the quotation-named build route decides which members "
             "carry certificates, so procurement files close without follow-up letters.")

# Ruling 4, verbatim.
CAPTION = ("Figure 1. GI porta cabin wall and roof build-up. Diagram version "
           "DGM-PC-GI-03-02 Rev 1, 14 August 2026. Illustrative, not for construction.")
# Alt derived from Section B's own description of diagram 2, not newly authored.
DIAGRAM_ALT = ("GI porta cabin wall and roof build-up showing cladding, insulation, "
               "liner and sealing")

# ── stage the diagram (PNG source to WebP) ───────────────────────────────────
dia_dir = os.path.join(ROOT, 'public', 'images', 'products', 'gi-porta-cabin', 'diagrams')
os.makedirs(dia_dir, exist_ok=True)
dia_src = os.path.join(SRC_ROOT, 'product-specifications-tab-section-technical-diagrams', 'gi-porta-cabin-diagram-2.png')
dia_out = os.path.join(dia_dir, 'gi-porta-cabin-diagram-2.webp')
im = Image.open(dia_src).convert('RGB')
im.save(dia_out, 'WEBP', quality=86, method=6)
print('diagram: %dx%d  %.1f KB  (source PNG %.1f KB)' % (
    im.width, im.height, os.path.getsize(dia_out) / 1024, os.path.getsize(dia_src) / 1024))

# ── stage the technical PDF ──────────────────────────────────────────────────
pdf_dir = os.path.join(ROOT, 'public', 'specs')
os.makedirs(pdf_dir, exist_ok=True)
pdf_src = os.path.join(SRC_ROOT, 'SAMAN_Portable_11_SEO_Technical_Specification_PDFs', 'saman-gi-porta-cabin-technical-specification.pdf')
pdf_out = os.path.join(pdf_dir, 'saman-gi-porta-cabin-technical-specification.pdf')
shutil.copyfile(pdf_src, pdf_out)
print('pdf: %.1f KB -> /specs/%s' % (os.path.getsize(pdf_out) / 1024, os.path.basename(pdf_out)))

# ── write the dataset entry ──────────────────────────────────────────────────
path = os.path.join(ROOT, 'src', 'data', 'products', 'c01-specifications.json')
data = json.load(io.open(path, encoding='utf-8'))

rows = []
for group, table in ((T1, TABLE1), (T2, TABLE2)):
    for comp, detail in table:
        rows.append({
            "group": group,
            "component": comp,
            "detail": detail,
            "sourceSheet": "PC-GI-03",
            "differsFromHub": False,
        })

data['products']['gi-porta-cabin'] = {
    "name": "Galvanized Iron (GI) Porta Cabin",
    "sheet": "PC-GI-03",
    "canonical": "https://www.samanportable.com/product/porta-cabins/gi-porta-cabin",
    "specifications": rows,
    "narrative": NARRATIVE,
    "premiumTables": True,
    "diagram": {
        "src": "/images/products/gi-porta-cabin/diagrams/gi-porta-cabin-diagram-2.webp",
        "alt": DIAGRAM_ALT,
        "caption": CAPTION,
        "width": im.width,
        "height": im.height,
    },
}

with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

blob = json.dumps(data['products']['gi-porta-cabin'], ensure_ascii=False)
print('spec rows: %d (table 1: %d, table 2: %d)' % (len(rows), len(TABLE1), len(TABLE2)))
print('em dashes in GI spec entry: %d' % blob.count('\u2014'))
print('wrote c01-specifications.json (%d products)' % len(data['products']))
