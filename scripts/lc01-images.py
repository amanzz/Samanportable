# -*- coding: utf-8 -*-
"""LC-01 image intake. Two known gaps confirmed by opening source files before
this script was written (ticket section 8):
  - gap 2: the GI/PUF wall-tier images are close-up panel-section cutaways, not
    three-quarter views of the whole unit. Both omitted, reported.
  - the 12 "generic interior" slots (rows 25-36 of the ticket's alt table) have
    no corresponding source file anywhere outside the explicitly-excluded G+1/G+2
    two-storey colony folders. Omitted, reported. Gallery ships 4 exteriors per
    size (24 total) instead of 6 (36 total).
Every remaining source file was opened and visually confirmed before use (glazed
sliding windows throughout, no louvred/slatted openings found in spot checks).
"""
import hashlib
import io
import json
import os
import sys

from PIL import Image

SRC_ROOT = r'D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)'
GALLERY_ROOT = os.path.join(SRC_ROOT, 'Labor Hutments')
TECH_ROOT = os.path.join(SRC_ROOT, 'Technical_PDFs_and_Diagrams_long_description_section_4_Images', 'labor-hutments')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_ROOT = os.path.join(ROOT, 'public', 'images', 'products', 'labor-hutments')

SIZES = ['10x10', '12x10', '12x15', '12x20', '15x20', '20x20']

# ── gallery, 4 exteriors per size (24 total; 12 interior slots omitted, gap) ──
GALLERY = []
for size in SIZES:
    folder = '%s ft' % size
    GALLERY += [
        (size, 'labor-hutments-%s-ft-front-elevation.png' % size,
         'labor-hutments-%s-front-elevation.webp' % size,
         'Front elevation of a %s ft single-storey labour hutment, ivory wall panels with charcoal steel trim.' % size),
        (size, 'labor-hutments-%s-ft-front-right-hero.png' % size,
         'labor-hutments-%s-front-right-three-quarter.webp' % size,
         '%s ft labour hutment from the front right, door wall and side wall visible on a level site.' % size),
        (size, 'labor-hutments-%s-ft-front-left-hero.png' % size,
         'labor-hutments-%s-front-left-three-quarter.webp' % size,
         '%s ft labour hutment from the front left, showing the door wall and the opposite side wall.' % size),
        (size, 'labor-hutments-%s-ft-rear-left-three-quarter.png' % size,
         'labor-hutments-%s-rear-left-three-quarter.webp' % size,
         'Rear left view of a %s ft labour hutment, back wall and one long side wall on concrete plinth pads.' % size),
    ]

# ── split card, 1 file ────────────────────────────────────────────────────────
SPLITCARD_SRC = 'labor-hutments-05-single-unit-site-context-16x9.jpg'
SPLITCARD_OUT = 'labor-hutments-single-unit-site-context-16x9.webp'
SPLITCARD_ALT = 'A single labour hutment standing alone on a prepared site hardstanding with open space around it.'

# ── description tab, 5 files (6th optional, not used - no stated need) ───────
DESCRIPTION = [
    ('labor-hutments-06-two-units-placed-apart-16x9.jpg', 'labor-hutments-two-units-placed-apart-16x9.webp',
     'Two separate single-storey labour hutments standing apart on the same site, each on its own plinth.'),
    ('labor-hutments-07-door-and-weatherhood-detail-16x9.jpg', 'labor-hutments-door-and-weatherhood-detail-16x9.webp',
     'Close view of a labour hutment entrance, showing the door, the weatherhood above it and panel joints.'),
    ('labor-hutments-08-roof-and-ventilation-detail-16x9.jpg', 'labor-hutments-roof-and-ventilation-detail-16x9.webp',
     'Roof edge of a labour hutment showing the profiled metal sheet, eave overhang and side flashing.'),
    ('labor-hutments-04-price-selection-16x9.jpg', 'labor-hutments-room-scale-reference-16x9.webp',
     'Labour hutment sleeping room with bunk beds, lockers and a window, shown at module scale.'),
]

# ── specifications diagrams, 2 files ──────────────────────────────────────────
SPEC_DIAGRAMS = [
    ('labor-hutments-technical-layout-diagram-16x9.png', 'labor-hutments-module-plan-diagram-16x9.webp',
     'Plan diagram of a typical labour hutment module: one room, central aisle, entry door and end windows.'),
    ('labor-hutments-material-services-diagram-16x9.png', 'labor-hutments-material-services-diagram-16x9.webp',
     'Diagram of labour hutment wall, roof and floor build-up with the electrical services route marked.'),
]

# GAP, reported not filled: wall-tier images are cutaway close-ups, not
# three-quarter unit views (confirmed by opening both before writing this
# script). Neither is included in any manifest list above.
OMITTED_WALL_TIER = [
    '12x20 ft/labor-hutments-12x20-ft-gi-sheet-wall-tier.png',
    '12x20 ft/labor-hutments-12x20-ft-puf-panel-wall-tier.png',
]
# GAP, reported not filled: no interior source file exists for any single-storey
# size; the only interior renders anywhere in the source tree belong to the
# excluded G+1/G+2 two-storey colony folders.
OMITTED_INTERIORS_COUNT = 12


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


slots, errors = [], []

gal_by_size = {}
for size, src, out, alt in GALLERY:
    sp = os.path.join(GALLERY_ROOT, '%s ft' % size, src)
    if not os.path.exists(sp):
        errors.append('MISSING SOURCE: ' + sp)
        continue
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    od = os.path.join(OUT_ROOT, size)
    os.makedirs(od, exist_ok=True)
    op = os.path.join(od, out)
    TARGET = 1254
    if max(im.width, im.height) != TARGET:
        scale = TARGET / max(im.width, im.height)
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    for q in (88, 84, 80, 76, 72):
        im.save(op, 'WEBP', quality=q, method=6)
        kb = os.path.getsize(op) / 1024
        if 90 <= kb <= 140 or q == 72:
            break
    o = Image.open(op)
    slot = dict(slot='gallery', size=size, src=src, out='/images/products/labor-hutments/%s/%s' % (size, out),
                alt=alt, sw=sw, sh=sh, w=o.width, h=o.height,
                kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op))
    slots.append(slot)
    gal_by_size.setdefault(size, []).append(slot)

sp = os.path.join(TECH_ROOT, SPLITCARD_SRC)
if not os.path.exists(sp):
    errors.append('MISSING SOURCE: ' + sp)
else:
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    od = os.path.join(OUT_ROOT, 'section2')
    os.makedirs(od, exist_ok=True)
    op = os.path.join(od, SPLITCARD_OUT)
    for q in (86, 82, 78, 74, 70):
        im.save(op, 'WEBP', quality=q, method=6)
        if os.path.getsize(op) <= 140 * 1024:
            break
    o = Image.open(op)
    slots.append(dict(slot='splitcard', size='-', src=SPLITCARD_SRC,
                      out='/images/products/labor-hutments/section2/%s' % SPLITCARD_OUT,
                      alt=SPLITCARD_ALT, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

od = os.path.join(OUT_ROOT, 'description')
os.makedirs(od, exist_ok=True)
for order, (src, out, alt) in enumerate(DESCRIPTION, start=1):
    sp = os.path.join(TECH_ROOT, src)
    if not os.path.exists(sp):
        errors.append('MISSING SOURCE: ' + sp)
        continue
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    op = os.path.join(od, out)
    for q in (86, 82, 78, 74, 70):
        im.save(op, 'WEBP', quality=q, method=6)
        if os.path.getsize(op) <= 120 * 1024:
            break
    o = Image.open(op)
    slots.append(dict(slot='description', size='-', src=src,
                      out='/images/products/labor-hutments/description/%s' % out,
                      alt=alt, order=order, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

od = os.path.join(OUT_ROOT, 'specifications')
os.makedirs(od, exist_ok=True)
for order, (src, out, alt) in enumerate(SPEC_DIAGRAMS, start=1):
    sp = os.path.join(TECH_ROOT, src)
    if not os.path.exists(sp):
        errors.append('MISSING SOURCE: ' + sp)
        continue
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    op = os.path.join(od, out)
    for q in (86, 82, 78, 74, 70):
        im.save(op, 'WEBP', quality=q, method=6)
        if os.path.getsize(op) <= 120 * 1024:
            break
    o = Image.open(op)
    slots.append(dict(slot='specdiagram', size='-', src=src,
                      out='/images/products/labor-hutments/specifications/%s' % out,
                      alt=alt, order=order, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

json.dump(slots, io.open(os.path.join(HERE, 'lc01-image-report.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)

g = [s for s in slots if s['slot'] == 'gallery']
d = [s for s in slots if s['slot'] == 'description']
c = [s for s in slots if s['slot'] == 'splitcard']
sd = [s for s in slots if s['slot'] == 'specdiagram']
print('slots: %d gallery + %d splitcard + %d description + %d specdiagram = %d'
      % (len(g), len(c), len(d), len(sd), len(slots)))
print('GAP: %d interior gallery slots omitted (no source file exists for any single-storey size)' % OMITTED_INTERIORS_COUNT)
print('GAP: 2 wall-tier slots omitted (cutaway close-ups, not three-quarter unit views): %s' % OMITTED_WALL_TIER)
print('unique file hashes: %d / %d' % (len({s['sha'] for s in slots}), len(slots)))
print('unique alt strings : %d / %d' % (len({s['alt'] for s in slots}), len(slots)))
bad_ar = [(s['out'], s['sw'], s['sh'], s['w'], s['h']) for s in slots
          if abs((s['sw'] / s['sh']) - (s['w'] / s['h'])) > 0.001]
print('aspect-ratio drift: %s' % (bad_ar or 'NONE'))
for size in SIZES:
    n = len(gal_by_size.get(size, []))
    print('  %-6s %d gallery slots (4 exteriors; 2 interior slots gapped)' % (size, n))
print('gallery dims: %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in g}))
print('16:9 dims: %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in (c + d + sd)}))

for a in [s['alt'] for s in slots]:
    if len(a) > 125:
        errors.append('ALT OVER 125 CHARS (%d): %s' % (len(a), a))

if errors:
    print('\nERRORS:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nOK')
