# -*- coding: utf-8 -*-
"""LC-00 image intake, driven by the Section 6 manifest transcribed verbatim from
build prompt v1.

Rules enforced here (ticket Section 6):
  - never crop, pad or re-frame: source aspect ratio preserved exactly;
  - alt text is copy, taken verbatim from the ticket table, never from a filename;
  - every rename applied, no supplied filename survives;
  - a missing source is a GAP, never a substitution;
  - hash uniqueness AND alt-string uniqueness checked, page-wide, 42 slots.
"""
import hashlib
import io
import json
import os
import sys

from PIL import Image

SRC_ROOT = r'D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)'
GALLERY_ROOT = os.path.join(SRC_ROOT, 'Labour Colony')
TECH_ROOT = os.path.join(SRC_ROOT, 'Technical_PDFs_and_Diagrams_long_description_section_4_Images', 'labour-colony')
DRAFTS_ROOT = os.path.join(SRC_ROOT, 'Drafts')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_ROOT = os.path.join(ROOT, 'public', 'images', 'products', 'labor-colony')

# ── 6.1 hero gallery, 36 slots ────────────────────────────────────────────────
GALLERY = [
    ('60x24-gplus1', '60x24 ft G+1', 'labour-colony-60x24-ft-gplus1-front-right-hero-s01-b01.png',
     'labour-colony-60x24-gplus1-front-three-quarter.webp',
     'Two-storey labour colony block with cream panels, grey steel frame and railed walkways on both levels'),
    ('60x24-gplus1', '60x24 ft G+1', 'labour-colony-60x24-ft-gplus1-central-landing-stair-end-elevation-s01-b01.png',
     'labour-colony-60x24-gplus1-stair-end-view.webp',
     'End view of the 60x24 ft colony block showing the external steel stair to the first-floor walkway'),
    ('60x24-gplus1', '60x24 ft G+1', 'labour-colony-60x24-ft-gplus1-clean-opposite-end-elevation-s01-b01.png',
     'labour-colony-60x24-gplus1-opposite-end-elevation.webp',
     'Blank gable end elevation of the 60x24 ft colony block with walkway decks returning on both sides'),
    ('60x24-gplus1', '60x24 ft G+1', 'labour-colony-60x24-ft-gplus1-interior-bunk-layout-s01-b01.png',
     'labour-colony-60x24-gplus1-room-four-bunk-layout.webp',
     'Colony room with two double-tier bunks, wardrobe unit, ceiling fan and tube light'),
    ('60x24-gplus1', '60x24 ft G+1', 'labour-colony-60x24-ft-gplus1-interior-room-entrance-s01-b01.png',
     'labour-colony-60x24-gplus1-room-entrance-view.webp',
     'Colony room seen from the doorway with two double-tier bunks and tall lockers on the left'),
    ('60x24-gplus1', '60x24 ft G+1', 'labour-colony-60x24-ft-gplus1-interior-storage-ventilation-s01-b01.png',
     'labour-colony-60x24-gplus1-room-lockers-and-window.webp',
     'Colony room showing louvred lockers, sliding window and socket points on the panel wall'),

    ('90x24-gplus1', '90x24 ft G+1', 'labour-colony-90x24-ft-gplus1-front-left-hero-x-stair-s05-b05.png',
     'labour-colony-90x24-gplus1-front-left-three-quarter.webp',
     'Two-storey labour colony block in cream panels with charcoal steel frame and full-length railed walkways'),
    ('90x24-gplus1', '90x24 ft G+1', 'labour-colony-90x24-ft-gplus1-exact-front-elevation-s05-b05.png',
     'labour-colony-90x24-gplus1-front-elevation.webp',
     'Front elevation of the 90x24 ft colony block showing repeating door and window bays on both floors'),
    ('90x24-gplus1', '90x24 ft G+1', 'labour-colony-90x24-ft-gplus1-exact-x-stair-end-elevation-s05-b05.png',
     'labour-colony-90x24-gplus1-x-stair-end-elevation.webp',
     'End elevation of the 90x24 ft colony block with a crossing external steel stair serving both levels'),
    ('90x24-gplus1', '90x24 ft G+1', 'labour-colony-90x24-ft-gplus1-clean-opposite-end-elevation-s05-b05.png',
     'labour-colony-90x24-gplus1-opposite-end-elevation.webp',
     'Blank gable end elevation of the 90x24 ft colony block with walkway decks on both sides'),
    ('90x24-gplus1', '90x24 ft G+1', 'labour-colony-90x24-ft-gplus1-bunk-bed-layout-wide-interior-s05-b05.png',
     'labour-colony-90x24-gplus1-dormitory-bunk-rows.webp',
     'Long colony dormitory with double-tier bunks in two rows, wall fans and a steel locker bank'),
    ('90x24-gplus1', '90x24 ft G+1', 'labour-colony-90x24-ft-gplus1-room-entrance-axis-interior-s05-b05.png',
     'labour-colony-90x24-gplus1-dormitory-entrance-view.webp',
     'Colony dormitory seen from the entrance with bunk rows either side and lockers at the far wall'),

    ('90x24-gplus2', '90x24 ft G+2', 'labour-colony-90x24-ft-gplus2-front-left-hero-x-stair-s17-b17.png',
     'labour-colony-90x24-gplus2-front-left-three-quarter.webp',
     'Three-storey labour colony block in cream panels with tan steel frame and railed walkways on each level'),
    ('90x24-gplus2', '90x24 ft G+2', 'labour-colony-90x24-ft-gplus2-exact-front-elevation-s17-b17.png',
     'labour-colony-90x24-gplus2-front-elevation.webp',
     'Front elevation of the three-storey 90x24 ft colony block with five door and window bays per floor'),
    ('90x24-gplus2', '90x24 ft G+2', 'labour-colony-90x24-ft-gplus2-exact-x-stair-end-elevation-s17-b17.png',
     'labour-colony-90x24-gplus2-x-stair-end-elevation.webp',
     'End elevation of the three-storey colony block with a full-height crossing external steel stair'),
    ('90x24-gplus2', '90x24 ft G+2', 'labour-colony-90x24-ft-gplus2-clean-opposite-end-elevation-s17-b17.png',
     'labour-colony-90x24-gplus2-opposite-end-elevation.webp',
     'Blank gable end elevation of the three-storey 90x24 ft colony block showing three panel bands'),
    ('90x24-gplus2', '90x24 ft G+2', 'labour-colony-90x24-ft-gplus2-bunk-bed-layout-wide-interior-s17-b17.png',
     'labour-colony-90x24-gplus2-dormitory-bunk-rows.webp',
     'Colony dormitory with four double-tier bunks, a five-door locker bank and wall-mounted fans'),
    ('90x24-gplus2', '90x24 ft G+2', 'labour-colony-90x24-ft-gplus2-room-entrance-axis-interior-s17-b17.png',
     'labour-colony-90x24-gplus2-dormitory-entrance-view.webp',
     'Colony dormitory from the doorway with bunks either side and tall lockers flanking the entrance'),

    ('120x24-gplus1', '120x24 ft G+1', 'labour-colony-120x24-ft-gplus1-front-left-hero-x-stair-s09-b09.png',
     'labour-colony-120x24-gplus1-front-left-three-quarter.webp',
     'Two-storey labour colony block with white panels, navy steel frame and railed walkways on both levels'),
    ('120x24-gplus1', '120x24 ft G+1', 'labour-colony-120x24-ft-gplus1-exact-front-elevation-s09-b09.png',
     'labour-colony-120x24-gplus1-front-elevation.webp',
     'Front elevation of the 120x24 ft colony block showing eight door and window bays on each floor'),
    ('120x24-gplus1', '120x24 ft G+1', 'labour-colony-120x24-ft-gplus1-exact-x-stair-end-elevation-s09-b09.png',
     'labour-colony-120x24-gplus1-x-stair-end-elevation.webp',
     'End elevation of the 120x24 ft colony block with a crossing external steel stair to the upper walkway'),
    ('120x24-gplus1', '120x24 ft G+1', 'labour-colony-120x24-ft-gplus1-front-right-hero-s09-b09.png',
     'labour-colony-120x24-gplus1-front-right-three-quarter.webp',
     'Long two-storey colony block viewed from the right with the blank gable end nearest the camera'),
    ('120x24-gplus1', '120x24 ft G+1', 'labour-colony-120x24-ft-gplus1-bunk-bed-layout-wide-interior-s09-b09.png',
     'labour-colony-120x24-gplus1-dormitory-bunk-rows.webp',
     'Colony dormitory with four double-tier bunks, tall lockers either side of the window and wall fans'),
    ('120x24-gplus1', '120x24 ft G+1', 'labour-colony-120x24-ft-gplus1-room-entrance-axis-interior-s09-b09.png',
     'labour-colony-120x24-gplus1-dormitory-entrance-view.webp',
     'Colony dormitory from the doorway with bunk rows either side and locker banks at the far wall'),

    ('118x30-gplus1', '118x30 ft G+1', 'labour-colony-118x30-ft-gplus1-front-left-hero-x-stair-s13-b13.png',
     'labour-colony-118x30-gplus1-front-left-three-quarter.webp',
     'Two-storey labour colony block in cream panels with sage-green steel frame and railed walkways'),
    ('118x30-gplus1', '118x30 ft G+1', 'labour-colony-118x30-ft-gplus1-exact-front-elevation-s13-b13.png',
     'labour-colony-118x30-gplus1-front-elevation.webp',
     'Front elevation of the 118x30 ft colony block with repeating door and window bays on both floors'),
    ('118x30-gplus1', '118x30 ft G+1', 'labour-colony-118x30-ft-gplus1-exact-x-stair-end-elevation-s13-b13.png',
     'labour-colony-118x30-gplus1-stair-end-elevation.webp',
     'End elevation of the 118x30 ft colony block showing the crossing external steel stair'),
    ('118x30-gplus1', '118x30 ft G+1', 'labour-colony-118x30-ft-gplus1-clean-opposite-end-elevation-s13-b13.png',
     'labour-colony-118x30-gplus1-opposite-end-elevation.webp',
     'Blank gable end elevation of the 118x30 ft colony block with walkway bays on both long faces'),
    ('118x30-gplus1', '118x30 ft G+1', 'labour-colony-118x30-ft-gplus1-bunk-bed-layout-wide-interior-s13-b13.png',
     'labour-colony-118x30-gplus1-dormitory-bunk-rows.webp',
     'Wide colony dormitory with double-tier bunks in two rows, steel lockers and a central aisle'),
    ('118x30-gplus1', '118x30 ft G+1', 'labour-colony-118x30-ft-gplus1-room-entrance-axis-interior-s13-b13.png',
     'labour-colony-118x30-gplus1-dormitory-entrance-view.webp',
     'Colony dormitory from the doorway with bunks either side, lockers at the corners and a window ahead'),

    ('120x24-gplus2', '120x24 ft G+2', 'labour-colony-120x24-ft-gplus2-front-left-hero-x-stair-s21-b21.png',
     'labour-colony-120x24-gplus2-front-left-three-quarter.webp',
     'Three-storey labour colony block in cream panels with tan steel frame and railed walkways on each level'),
    ('120x24-gplus2', '120x24 ft G+2', 'labour-colony-120x24-ft-gplus2-exact-front-elevation-s21-b21.png',
     'labour-colony-120x24-gplus2-front-elevation.webp',
     'Front elevation of the three-storey 120x24 ft colony block with seven door and window bays per floor'),
    ('120x24-gplus2', '120x24 ft G+2', 'labour-colony-120x24-ft-gplus2-exact-x-stair-end-elevation-s21-b21.png',
     'labour-colony-120x24-gplus2-x-stair-end-elevation.webp',
     'End elevation of the three-storey 120x24 ft colony block with a full-height crossing steel stair'),
    ('120x24-gplus2', '120x24 ft G+2', 'labour-colony-120x24-ft-gplus2-front-right-hero-s21-b21.png',
     'labour-colony-120x24-gplus2-front-right-three-quarter.webp',
     'Three-storey colony block viewed from the right with the blank gable end nearest the camera'),
    ('120x24-gplus2', '120x24 ft G+2', 'labour-colony-120x24-ft-gplus2-bunk-bed-layout-wide-interior-s21-b21.png',
     'labour-colony-120x24-gplus2-dormitory-bunk-rows.webp',
     'Colony dormitory with double-tier bunks, tan lockers below the window and wall-mounted fans'),
    ('120x24-gplus2', '120x24 ft G+2', 'labour-colony-120x24-ft-gplus2-room-entrance-axis-interior-s21-b21.png',
     'labour-colony-120x24-gplus2-dormitory-entrance-view.webp',
     'Colony dormitory from the doorway with bunk rows either side and a locker bank under the window'),
]

# ── 6.2 split card, 1 file ────────────────────────────────────────────────────
SPLITCARD_SRC = 'labour-colony-01-main-context-16x9.jpg'
SPLITCARD_OUT = 'labour-colony-block-site-context-16x9.webp'
SPLITCARD_ALT = ('Two-storey labour colony block on a paved site, with external stair and '
                  'railed walkways to both floors')

# ── 6.3 description tab, 4 files ──────────────────────────────────────────────
DESCRIPTION = [
    ('labour-colony-02-layout-understanding-16x9.jpg', 'labour-colony-block-front-left-view-16x9.webp',
     'Labour colony block viewed from the front left, showing door and window bays on both floors'),
    ('labour-colony-technical-layout-diagram-16x9.png', 'labour-colony-master-site-arrangement-16x9.webp',
     'Master site arrangement showing eight dormitory blocks, a toilet and bath block, canteen, walkway, '
     'internal service road, security entry, first aid and the utility zone'),
    ('labour-colony-03-material-services-16x9.jpg', 'labour-colony-block-front-elevation-16x9.webp',
     'Front elevation of a two-storey labour colony block with walkway railings and roof canopy'),
    ('labour-colony-04-price-selection-16x9.jpg', 'labour-colony-room-interior-four-bunks-16x9.webp',
     'Colony room interior with two double-tier bunks, a lockable wardrobe unit and a sliding window'),
]

# ── 6.4 specifications tab, 1 diagram ─────────────────────────────────────────
SPEC_DIAGRAM_SRC = 'labour-colony-service-network-diagram-16x9.png'
SPEC_DIAGRAM_OUT = 'labour-colony-service-network-16x9.webp'
SPEC_DIAGRAM_ALT = ('Service network diagram showing water storage, sanitation, canteen supply and site '
                     'admin connecting to the colony core blocks, with two planned expansion slots')


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


slots, errors = [], []

# gallery
gal_by_size = {}
for sizeSlug, sizeFolder, src, out, alt in GALLERY:
    sp = os.path.join(GALLERY_ROOT, sizeFolder, src)
    if not os.path.exists(sp):
        errors.append('MISSING SOURCE: ' + sp)
        continue
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    od = os.path.join(OUT_ROOT, sizeSlug)
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
    slot = dict(slot='gallery', size=sizeSlug, src=src, out='/images/products/labor-colony/%s/%s' % (sizeSlug, out),
                alt=alt, sw=sw, sh=sh, w=o.width, h=o.height,
                kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op))
    slots.append(slot)
    gal_by_size.setdefault(sizeSlug, []).append(slot)

# split card
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
                      out='/images/products/labor-colony/section2/%s' % SPLITCARD_OUT,
                      alt=SPLITCARD_ALT, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

# description
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
                      out='/images/products/labor-colony/description/%s' % out,
                      alt=alt, order=order, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

# spec diagram
sp = os.path.join(DRAFTS_ROOT, SPEC_DIAGRAM_SRC)
if not os.path.exists(sp):
    errors.append('MISSING SOURCE: ' + sp)
else:
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    od = os.path.join(OUT_ROOT, 'specifications')
    os.makedirs(od, exist_ok=True)
    op = os.path.join(od, SPEC_DIAGRAM_OUT)
    for q in (86, 82, 78, 74, 70):
        im.save(op, 'WEBP', quality=q, method=6)
        if os.path.getsize(op) <= 120 * 1024:
            break
    o = Image.open(op)
    slots.append(dict(slot='specdiagram', size='-', src=SPEC_DIAGRAM_SRC,
                      out='/images/products/labor-colony/specifications/%s' % SPEC_DIAGRAM_OUT,
                      alt=SPEC_DIAGRAM_ALT, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

json.dump(slots, io.open(os.path.join(HERE, 'lc00-image-report.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)

g = [s for s in slots if s['slot'] == 'gallery']
d = [s for s in slots if s['slot'] == 'description']
c = [s for s in slots if s['slot'] == 'splitcard']
sd = [s for s in slots if s['slot'] == 'specdiagram']
print('slots: %d gallery + %d splitcard + %d description + %d specdiagram = %d (expect 36+1+4+1=42)'
      % (len(g), len(c), len(d), len(sd), len(slots)))
print('unique file hashes: %d / %d' % (len({s['sha'] for s in slots}), len(slots)))
print('unique alt strings : %d / %d' % (len({s['alt'] for s in slots}), len(slots)))
bad_ar = [(s['out'], s['sw'], s['sh'], s['w'], s['h']) for s in slots
          if abs((s['sw'] / s['sh']) - (s['w'] / s['h'])) > 0.001]
print('aspect-ratio drift: %s' % (bad_ar or 'NONE'))
for size in ['60x24-gplus1', '90x24-gplus1', '90x24-gplus2', '120x24-gplus1', '118x30-gplus1', '120x24-gplus2']:
    n = len(gal_by_size.get(size, []))
    print('  %-16s %d gallery slots' % (size, n))
print('16:9 dims: %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in (c + d + sd)}))
print('gallery dims: %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in g}))

if errors:
    print('\nERRORS:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nOK')
