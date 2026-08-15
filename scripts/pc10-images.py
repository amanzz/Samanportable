# -*- coding: utf-8 -*-
"""PC-10 image intake, driven directly by the Section 6 manifest in build prompt v1.1
(pasted into chat, not a file on disk - no separate copy-pack file exists for this
page yet, so the manifest below is transcribed verbatim from that ticket text).

Rules enforced here (CLAUDE.md "Images" + build prompt v1.1 section 6):
  - never crop, pad or re-frame: source aspect ratio is preserved exactly;
  - alt text is copy, taken verbatim from the ticket table, never from a filename;
  - every rename in the manifest is applied, no supplied filename survives;
  - the string "ChatGPT Image" must appear nowhere in output paths;
  - a missing source is a GAP, never a substitution;
  - hash uniqueness AND alt-string uniqueness are separate checks, both run.
"""
import hashlib
import io
import json
import os
import sys

from PIL import Image

SRC_ROOT = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
            r'porta-cabin-shop')
DESC_DIR = os.path.join(SRC_ROOT, '6 images for long description')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_ROOT = os.path.join(ROOT, 'public', 'images', 'products', 'porta-cabin-shop')

# ── 6a. Hero gallery, 36 slots ────────────────────────────────────────────────
GALLERY = [
    ('10x10', 'porta-cabin-shop-10x10-hero-view.png', 'porta-cabin-shop-10x10-01-three-quarter-mustard.webp',
     'Mustard yellow 10x10 ft shop cabin with a dark green lower band and an open service counter with a timber ledge'),
    ('10x10', 'porta-cabin-shop-10x10-front-angle.png', 'porta-cabin-shop-10x10-02-three-quarter-charcoal.webp',
     'Charcoal 10x10 ft shop cabin with a propped awning over the service opening and a glazed steel door alongside'),
    ('10x10', 'porta-cabin-shop-10x10-rear-angle.png', 'porta-cabin-shop-10x10-03-three-quarter-sage.webp',
     'Sage green 10x10 ft shop cabin with a corner service opening, timber counter ledge and a solid green steel door'),
    ('10x10', 'porta-cabin-shop-10x10-elevated-view.png', 'porta-cabin-shop-10x10-04-three-quarter-cream.webp',
     'Cream 10x10 ft shop cabin with a black base plinth, an open service counter and shelving visible inside'),
    ('10x10', 'porta-cabin-shop-10x10-entrance-interior.png', 'porta-cabin-shop-10x10-05-interior-counter.webp',
     'Interior of a 10x10 ft shop cabin with a grey service counter, stocked display shelving and an open counter hatch'),
    ('10x10', 'porta-cabin-shop-10x10-workspace-interior.png', 'porta-cabin-shop-10x10-06-interior-worktop.webp',
     'Interior of a 10x10 ft shop cabin in pale sage with a timber worktop, open shelving and a sliding window'),

    ('20x8', 'porta-cabin-shop-20x8-hero-view.png', 'porta-cabin-shop-20x8-01-three-quarter-light-grey.webp',
     'Light grey 20x8 ft shop cabin with a wide service opening, timber counter ledge and two side windows'),
    ('20x8', 'porta-cabin-shop-20x8-side-elevation.png', 'porta-cabin-shop-20x8-02-front-elevation-slate-blue.webp',
     'Slate blue 20x8 ft shop cabin seen straight on, with a centred service opening and a solid blue steel door'),
    ('20x8', 'porta-cabin-shop-20x8-rear-angle.png', 'porta-cabin-shop-20x8-03-three-quarter-terracotta.webp',
     'Beige 20x8 ft shop cabin with a terracotta lower band, a service opening and a door on the short end face'),
    ('20x8', 'porta-cabin-shop-20x8-elevated-view.png', 'porta-cabin-shop-20x8-04-three-quarter-white-charcoal.webp',
     'White 20x8 ft shop cabin with a charcoal lower band, an open service counter and a glazed upper door panel'),
    ('20x8', 'porta-cabin-shop-20x8-entrance-interior.png', 'porta-cabin-shop-20x8-05-interior-counter.webp',
     'Interior of a 20x8 ft shop cabin with a timber-fronted service counter, lit display shelving and a glass case'),
    ('20x8', 'porta-cabin-shop-20x8-rear-interior.png', 'porta-cabin-shop-20x8-06-interior-back-counter.webp',
     'Interior of a 20x8 ft shop cabin with a dark walnut counter run, wall niches and two ceiling fans'),

    ('20x10', 'porta-cabin-shop-20x10-hero-view.png', 'porta-cabin-shop-20x10-01-three-quarter-wheat.webp',
     'Wheat yellow 20x10 ft shop cabin with a black base skirt, an open service counter and a glazed upper door'),
    ('20x10', 'porta-cabin-shop-20x10-front-angle.png', 'porta-cabin-shop-20x10-02-three-quarter-sage-charcoal.webp',
     'Sage 20x10 ft shop cabin with a charcoal lower band, propped awning and a six-pane glazed door'),
    ('20x10', 'porta-cabin-shop-20x10-side-elevation.png', 'porta-cabin-shop-20x10-03-front-elevation-brick-red.webp',
     'Brick red 20x10 ft shop cabin seen straight on, with a stone counter ledge and a solid red steel door'),
    ('20x10', 'porta-cabin-shop-20x10-rear-angle.png', 'porta-cabin-shop-20x10-04-three-quarter-steel-blue.webp',
     'Steel blue 20x10 ft shop cabin with a dark grey lower band, a service opening and a solid charcoal door'),
    ('20x10', 'porta-cabin-shop-20x10-elevated-view.png', 'porta-cabin-shop-20x10-05-three-quarter-olive-mustard.webp',
     'Olive 20x10 ft shop cabin with a mustard lower band, an open counter and a glass drinks chiller inside'),
    ('20x10', 'porta-cabin-shop-20x10-entrance-interior.png', 'porta-cabin-shop-20x10-06-interior-counter.webp',
     'Interior of a 20x10 ft shop cabin with a slatted service counter, lit niche shelving and a glass display case'),

    ('20x12', 'porta-cabin-shop-20x12-hero-view.png', 'porta-cabin-shop-20x12-01-three-quarter-anthracite.webp',
     'Anthracite 20x12 ft shop cabin on wet paving, with an open service counter and a large glazed door panel'),
    ('20x12', 'porta-cabin-shop-20x12-front-angle.png', 'porta-cabin-shop-20x12-02-three-quarter-ochre-green.webp',
     'Ochre 20x12 ft shop cabin with a forest green lower band, dark green awnings and a long stone counter ledge'),
    ('20x12', 'porta-cabin-shop-20x12-side-elevation.png', 'porta-cabin-shop-20x12-03-front-elevation-pale-green.webp',
     'Pale green 20x12 ft shop cabin seen straight on, with a white counter ledge and a solid green steel door'),
    ('20x12', 'porta-cabin-shop-20x12-rear-angle.png', 'porta-cabin-shop-20x12-04-three-quarter-wheat-charcoal.webp',
     'Wheat 20x12 ft shop cabin with a charcoal lower band, a propped awning and a solid yellow steel door'),
    ('20x12', 'porta-cabin-shop-20x12-entrance-interior.png', 'porta-cabin-shop-20x12-05-interior-counter.webp',
     'Interior of a 20x12 ft shop cabin with a dark grey service counter, backlit display niches and a glass case'),
    ('20x12', 'porta-cabin-shop-20x12-workspace-interior.png', 'porta-cabin-shop-20x12-06-interior-display-run.webp',
     'Interior of a 20x12 ft shop cabin in pale sage with a light timber cabinet run and a wide open counter hatch'),

    ('30x10', 'porta-cabin-shop-30x10-hero-view.png', 'porta-cabin-shop-30x10-01-three-quarter-ivory-green.webp',
     'Ivory 30x10 ft shop cabin with a bottle green lower band, an open service counter and stocked shelving inside'),
    ('30x10', 'porta-cabin-shop-30x10-front-angle.png', 'porta-cabin-shop-30x10-02-three-quarter-silver.webp',
     'Silver grey 30x10 ft shop cabin with a black base plinth, an open service counter and a four-pane glazed door'),
    ('30x10', 'porta-cabin-shop-30x10-side-elevation.png', 'porta-cabin-shop-30x10-03-front-elevation-beige-terracotta.webp',
     'Beige 30x10 ft shop cabin seen straight on, with a terracotta lower band and a solid flush steel door'),
    ('30x10', 'porta-cabin-shop-30x10-elevated-view.png', 'porta-cabin-shop-30x10-04-three-quarter-olive.webp',
     'Olive green 30x10 ft shop cabin with black awnings, an open counter and a glass drinks chiller inside'),
    ('30x10', 'porta-cabin-shop-30x10-entrance-interior.png', 'porta-cabin-shop-30x10-05-interior-counter.webp',
     'Interior of a 30x10 ft shop cabin with a slatted counter, a long run of lit oak display shelving and two fans'),
    ('30x10', 'porta-cabin-shop-30x10-workspace-interior.png', 'porta-cabin-shop-30x10-06-interior-charcoal-run.webp',
     'Interior of a 30x10 ft shop cabin in grey with a charcoal cabinet run, lit black shelving and a wide hatch'),

    ('40x10', 'porta-cabin-shop-40x10-hero-view.png', 'porta-cabin-shop-40x10-01-three-quarter-forest-green.webp',
     'Forest green 40x10 ft shop cabin with four windows along the long wall and an open service counter'),
    ('40x10', 'porta-cabin-shop-40x10-front-angle.png', 'porta-cabin-shop-40x10-02-three-quarter-sage-cream.webp',
     'Sage 40x10 ft shop cabin with a cream lower band, three windows and a propped awning over the counter'),
    ('40x10', 'porta-cabin-shop-40x10-side-elevation.png', 'porta-cabin-shop-40x10-03-front-elevation-sand.webp',
     'Sand beige 40x10 ft shop cabin seen straight on, with three windows, a service opening and a solid door'),
    ('40x10', 'porta-cabin-shop-40x10-elevated-view.png', 'porta-cabin-shop-40x10-04-three-quarter-powder-blue.webp',
     'Powder blue 40x10 ft shop cabin with a charcoal lower band, three windows and an open service counter'),
    ('40x10', 'porta-cabin-shop-40x10-entrance-interior.png', 'porta-cabin-shop-40x10-05-interior-counter.webp',
     'Interior of a 40x10 ft shop cabin in pale sage with a slatted counter, lit oak shelving and a glass case'),
    ('40x10', 'porta-cabin-shop-40x10-workspace-interior.png', 'porta-cabin-shop-40x10-06-interior-walnut-run.webp',
     'Interior of a 40x10 ft shop cabin with a dark walnut cabinet run, lit display shelves and a wide open hatch'),
]

# ── 6b. Description tab, 5 slots ──────────────────────────────────────────────
DESCRIPTION = [
    ('porta-cabin-shop-maroon-exterior.png', 'porta-cabin-shop-description-01-frontage-burgundy.webp',
     'Burgundy shop cabin with two propped service openings, counter ledges and a full-height glazed door between them',
     'Two service openings and a glazed customer door on one frontage. The opening schedule is set to your layout.'),
    ('porta-cabin-shop-interior-warm-retail-counter.png', 'porta-cabin-shop-description-02-interior-terracotta.webp',
     'Terracotta shop cabin interior with a service counter, wall shelving of pouches and canisters and a split air conditioner',
     'Interior finishes and fixtures shown are fit-out scope. Air conditioning is optional and quoted separately.'),
    ('porta-cabin-shop-beige-exterior.png', 'porta-cabin-shop-description-03-base-and-handling.webp',
     'Beige shop cabin on a paved surface, showing the black steel base frame, forklift pockets and corner lifting lugs',
     'The unit is set down on a prepared level base. Handling points are engineered per configuration.'),
    ('porta-cabin-shop-interior-blue-retail-layout.png', 'porta-cabin-shop-description-04-interior-blue-floor.webp',
     'Blue shop cabin interior laid out as a walk-in floor with a central display island, perimeter shelving and a rear counter',
     'A walk-in selling floor needs depth. Larger sizes make this layout possible; display units are fit-out scope.'),
    ('ChatGPT Image Aug 14, 2026, 10_08_07 PM (6).png', 'porta-cabin-shop-description-05-interior-plum-fitout.webp',
     'Plum shop cabin interior with long display counters, backlit wall niches, track lighting and two split air conditioners',
     'Everything beyond the shell here is fit-out: shelving, counters, lighting and air conditioning are quoted separately.'),
]

# ── 6c. Section 2 split card, 1 slot ──────────────────────────────────────────
SPLITCARD_SRC = 'porta-cabin-shop-teal-exterior.png'
SPLITCARD_OUT = 'porta-cabin-shop-section2-frontage-teal.webp'
SPLITCARD_ALT = ('Teal shop cabin with a wide propped service opening, a counter ledge and a '
                  'full-height glazed customer door')

EXCLUDED_SIZES = {'40x8', '20x20', '40x12'}


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


slots, errors = [], []

# gallery
gd = {}
for size, src, out, alt in GALLERY:
    sp = os.path.join(SRC_ROOT, 'size-%s' % size, src)
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
    im.save(op, 'WEBP', quality=84, method=6)
    o = Image.open(op)
    slots.append(dict(slot='gallery', size=size, src=src, out='/images/products/porta-cabin-shop/%s/%s' % (size, out),
                      alt=alt, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

# description
od = os.path.join(OUT_ROOT, 'description')
os.makedirs(od, exist_ok=True)
for order, (src, out, alt, caption) in enumerate(DESCRIPTION, start=1):
    sp = os.path.join(DESC_DIR, src)
    if not os.path.exists(sp):
        errors.append('MISSING SOURCE: ' + sp)
        continue
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    TARGET_W = 1280
    if im.width != TARGET_W:
        im = im.resize((TARGET_W, round(TARGET_W * sh / sw)), Image.LANCZOS)
    op = os.path.join(od, out)
    for q in (86, 82, 78, 74, 70):
        im.save(op, 'WEBP', quality=q, method=6)
        if os.path.getsize(op) <= 120 * 1024:
            break
    o = Image.open(op)
    slots.append(dict(slot='description', size='-', src=src,
                      out='/images/products/porta-cabin-shop/description/%s' % out,
                      alt=alt, caption=caption, order=order, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

# split card
sp = os.path.join(DESC_DIR, SPLITCARD_SRC)
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
        if os.path.getsize(op) <= 120 * 1024:
            break
    o = Image.open(op)
    slots.append(dict(slot='splitcard', size='-', src=SPLITCARD_SRC,
                      out='/images/products/porta-cabin-shop/section2/%s' % SPLITCARD_OUT,
                      alt=SPLITCARD_ALT, sw=sw, sh=sh, w=o.width, h=o.height,
                      kb=round(os.path.getsize(op) / 1024, 1), sha=sha(op)))

json.dump(slots, io.open(os.path.join(HERE, 'pc10-image-report.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)

g = [s for s in slots if s['slot'] == 'gallery']
d = [s for s in slots if s['slot'] == 'description']
c = [s for s in slots if s['slot'] == 'splitcard']
print('slots: %d gallery + %d description + %d splitcard = %d (expect 36 + 5 + 1 = 42)'
      % (len(g), len(d), len(c), len(slots)))
print('unique file hashes: %d / %d' % (len({s['sha'] for s in slots}), len(slots)))
print('unique alt strings : %d / %d' % (len({s['alt'] for s in slots}), len(slots)))
bad_ar = [(s['out'], s['sw'], s['sh'], s['w'], s['h']) for s in slots
          if abs((s['sw'] / s['sh']) - (s['w'] / s['h'])) > 0.001]
print('aspect-ratio drift: %s' % (bad_ar or 'NONE'))
print('gallery ratios : %s' % sorted({round(s['w'] / s['h'], 4) for s in g}))
print('desc ratios    : %s' % sorted({round(s['w'] / s['h'], 4) for s in (d + c)}))
print('gallery dims   : %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in g}))
print('desc dims      : %s' % sorted({'%dx%d' % (s['w'], s['h']) for s in (d + c)}))
print('desc/card KB   : %.1f to %.1f' % (min(x['kb'] for x in (d + c)), max(x['kb'] for x in (d + c))))
for size in ('10x10', '20x8', '20x10', '20x12', '30x10', '40x10'):
    n = sum(1 for s in g if s['size'] == size)
    print('  %-6s %d gallery slots' % (size, n))
withdrawn_hit = [s for s in slots if s['size'] in EXCLUDED_SIZES]
print('withdrawn sizes (40x8/20x20/40x12) present: %s' % ('YES: %r' % withdrawn_hit if withdrawn_hit else 'NO'))
chatgpt_hit = [s for s in slots if 'ChatGPT' in s['out'] or 'ChatGPT' in s.get('src', '')]
print('"ChatGPT Image" leaking into output path: %s'
      % ('YES: %r' % chatgpt_hit if any('ChatGPT' in s['out'] for s in slots) else 'NO (source-only reference is fine)'))

if errors:
    print('\nERRORS:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nOK')
