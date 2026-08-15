# -*- coding: utf-8 -*-
"""PC-03 image intake, driven by parsing build prompt v2 sections 8.1 and 8.2 rather
than retyping them.

Rules enforced here (CLAUDE.md "Images" + build prompt section 8):
  - never crop, pad or re-frame: source aspect ratio is preserved exactly;
  - alt text is copy, taken verbatim from the ticket table, never from a filename;
  - every rename in the manifest is applied;
  - nothing under processed-16x9-webp/ is ever opened;
  - a missing source is a GAP, never a substitution.
"""
import hashlib
import io
import json
import os
import re
import sys

from PIL import Image

TICKET = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
          r'double-story-porta-cabin/_build-inputs/'
          r'PC-03-double-story-porta-cabin-build-prompt-v2.md')
SRC_ROOT = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
            r'double-story-porta-cabin')
DESC_DIR = os.path.join(SRC_ROOT, 'Double_Story_G1_Porta_Cabin_6_Full_Background_16x9')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_ROOT = os.path.join(ROOT, 'public', 'images', 'products', 'double-story-porta-cabin')

# The five Description outputs map back to these supplied originals (section 8.2 lists
# output names; the originals are named in the ticket's own ordering table).
DESC_SOURCES = {
    'double-story-porta-cabin-dark-grey-exterior-hero.webp':
        '01_Double_Story_G1_Porta_Cabin_Dark_Grey_Exterior_Hero_Full_Background_16x9.jpg',
    'double-story-porta-cabin-side-walkway-staircase.webp':
        '03_Double_Story_G1_Porta_Cabin_Side_Walkway_Exterior_Full_Background_16x9.jpg',
    'double-story-porta-cabin-rear-services-ac-units.webp':
        '05_Double_Story_G1_Porta_Cabin_Rear_Services_Exterior_Full_Background_16x9.jpg',
    'double-story-porta-cabin-beige-interior-room.webp':
        'Double_Story_G1_Porta_Cabin_Premium_Beige_Interior_No_Staircase_4K_16x9.jpg',
    'double-story-porta-cabin-crane-module-installation.webp':
        '06_Double_Story_G1_Porta_Cabin_Crane_Installation_Full_Background_16x9.jpg',
}
EXCLUDED_DESC = '02_Double_Story_G1_Porta_Cabin_Premium_Beige_Interior_Full_Background_16x9.jpg'
EXCLUDED_SIZE = '40x20'

raw = io.open(TICKET, encoding='utf-8', newline='').read()


def table_rows(header_re, ncols):
    """Rows of the first markdown table after a heading matching header_re."""
    start = re.search(header_re, raw).end()
    rows = []
    for line in raw[start:].split('\n'):
        s = line.strip()
        if s.startswith('|') and not re.match(r'^\|[\s\-:|]+\|$', s):
            cells = [c.strip() for c in s.strip('|').split('|')]
            if len(cells) == ncols:
                rows.append(cells)
        elif rows and not s.startswith('|'):
            break
    return rows[1:]  # drop the header row


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


def code(c):
    return c.strip().strip('`')


slots, errors = [], []

# ── 8.1 gallery, 36 slots ────────────────────────────────────────────────────
gal = table_rows(r'###\s+8\.1[^\n]*\n', 4)
for size, src, out, alt in gal:
    size, src, out = size.strip(), code(src), code(out)
    if size == EXCLUDED_SIZE:
        errors.append('40x20 row present in ticket table but excluded: ' + src)
        continue
    sp = os.path.join(SRC_ROOT, src.replace('\\', '/'))
    if 'processed-16x9-webp' in sp:
        errors.append('REFUSED processed source: ' + sp)
        continue
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
    im.save(op, 'WEBP', quality=82, method=6)   # no resize, no crop: frame preserved
    o = Image.open(op)
    slots.append(dict(slot='gallery', size=size, src=src, out='/images/products/double-story-porta-cabin/%s/%s' % (size, out),
                      alt=alt.strip(), sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

# ── 8.2 Description, 5 slots ─────────────────────────────────────────────────
desc = table_rows(r'###\s+8\.2[^\n]*\n', 5)
od = os.path.join(OUT_ROOT, 'description')
os.makedirs(od, exist_ok=True)
for order, out, alt, caption, placement in desc:
    out = code(out)
    src = DESC_SOURCES.get(out)
    if not src:
        errors.append('no supplied original mapped for ' + out)
        continue
    sp = os.path.join(DESC_DIR, src)
    if not os.path.exists(sp):
        errors.append('MISSING SOURCE: ' + sp)
        continue
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    # resize proportionally to the template Description width, 16:9 preserved exactly
    TARGET_W = 1280
    if im.width != TARGET_W:
        im = im.resize((TARGET_W, round(TARGET_W * sh / sw)), Image.LANCZOS)
    op = os.path.join(od, out)
    for q in (86, 82, 78, 74, 70):
        im.save(op, 'WEBP', quality=q, method=6)
        if os.path.getsize(op) <= 120 * 1024:
            break
    o = Image.open(op)
    cap = caption.strip()
    slots.append(dict(slot='description', size='-', src=src,
                      out='/images/products/double-story-porta-cabin/description/%s' % out,
                      alt=alt.strip(), caption='' if cap in ('(none)', '') else cap,
                      order=int(order), sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

# ── Section 2 split-card image, 1 slot (post-build correction 2, 15 Aug 2026) ──
# The 02_ file, deliberately excluded from the Description tab in 8.2 as a near-
# duplicate of the 4K beige-interior file used there, is placed here instead. Opened
# and confirmed to show the same beige panel interior scene (walls, AC unit, steel
# door) before wiring, per the ticket's own re-confirmation instruction.
SPLITCARD_SRC = '02_Double_Story_G1_Porta_Cabin_Premium_Beige_Interior_Full_Background_16x9.jpg'
SPLITCARD_OUT = 'double-story-porta-cabin-splitcard-beige-interior.webp'
SPLITCARD_ALT = ('Second view of the beige panel interior room in a double storey '
                  'porta cabin ground floor')
sp = os.path.join(DESC_DIR, SPLITCARD_SRC)
if not os.path.exists(sp):
    errors.append('MISSING SOURCE: ' + sp)
else:
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    TARGET_W = 1280
    if im.width != TARGET_W:
        im = im.resize((TARGET_W, round(TARGET_W * sh / sw)), Image.LANCZOS)
    od = os.path.join(OUT_ROOT, 'section2')
    os.makedirs(od, exist_ok=True)
    op = os.path.join(od, SPLITCARD_OUT)
    for q in (86, 82, 78, 74, 70):
        im.save(op, 'WEBP', quality=q, method=6)
        if os.path.getsize(op) <= 120 * 1024:
            break
    o = Image.open(op)
    slots.append(dict(slot='splitcard', size='-', src=SPLITCARD_SRC,
                      out='/images/products/double-story-porta-cabin/section2/%s' % SPLITCARD_OUT,
                      alt=SPLITCARD_ALT, caption='', order=0, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

json.dump(slots, io.open(os.path.join(HERE, 'pc03-image-report.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)

g = [s for s in slots if s['slot'] == 'gallery']
d = [s for s in slots if s['slot'] == 'description']
sc = [s for s in slots if s['slot'] == 'splitcard']
print('slots: %d gallery + %d description + %d splitcard = %d (expect 36 + 5 + 1 = 42)'
      % (len(g), len(d), len(sc), len(slots)))
print('unique files: %d' % len({s['sha'] for s in slots}))
print('unique alts : %d' % len({s['alt'] for s in slots}))
bad_ar = [(s['out'], s['sw'], s['sh'], s['w'], s['h']) for s in slots
          if abs((s['sw'] / s['sh']) - (s['w'] / s['h'])) > 0.001]
print('aspect-ratio drift: %s' % (bad_ar or 'NONE'))
print('gallery ratios : %s' % sorted({round(s['w'] / s['h'], 4) for s in g}))
print('desc ratios    : %s' % sorted({round(s['w'] / s['h'], 4) for s in d}))
print('gallery dims   : %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in g}))
print('desc dims      : %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in d}))
print('desc KB        : %.1f to %.1f' % (min(x['kb'] for x in d), max(x['kb'] for x in d)))
print('splitcard ratio: %s  KB: %.1f' % (
    (round(sc[0]['w'] / sc[0]['h'], 4) if sc else 'MISSING'), sc[0]['kb'] if sc else 0))
print('40x20 in output: %s' % ('YES' if any(s['size'] == '40x20' for s in slots) else 'NO'))
print('02_ absent from Description tab: %s   used in Section 2 split card: %s'
      % ('YES' if not any(EXCLUDED_DESC in s['src'] for s in d) else 'NO',
         'YES' if any(EXCLUDED_DESC in s['src'] for s in sc) else 'NO'))
print('processed-16x9-webp used: NO (never opened; refusal guard active)')
if errors:
    print('\nERRORS:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nOK')
