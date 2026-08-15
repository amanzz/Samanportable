# -*- coding: utf-8 -*-
"""PC-04 v1.4 hero gallery replacement. Converts the 36 approved sources
(already hash- and dimension-verified by pc04-verify-sources.py) to WebP,
80-120 KB target, native 1254x1254 preserved exactly -- no crop, pad, resize
or upscale. Writes into the live asset path, size folder unchanged, filename
per section 4. Ruling A (SAMAN, 15 Aug 2026): ship as supplied, no re-render."""
import hashlib
import json
import os

from PIL import Image

SRC_ROOT = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
            r'porta-cabin-with-toilet')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_ROOT = os.path.join(ROOT, 'public', 'images', 'products', 'porta-cabin-with-toilet')

GALLERY = [
    ('10x10', 'portable-cabin-with-toilet-10x10-hero-view.png', 'porta-cabin-with-toilet-10x10-hero-view.webp',
     'Cream 10x10 porta cabin with toilet, main door, grille window and separate end toilet door'),
    ('10x10', 'portable-cabin-with-toilet-10x10-front-angle.png', 'porta-cabin-with-toilet-10x10-front-angle.webp',
     'Cream 10x10 cabin on gravel with SAMAN signboard, sliding window and side toilet door'),
    ('10x10', 'portable-cabin-with-toilet-10x10-elevated-view.png', 'porta-cabin-with-toilet-10x10-elevated-view.webp',
     'Raised view of the cream 10x10 cabin showing its ribbed roof, single window and two doors'),
    ('10x10', 'portable-cabin-with-toilet-10x10-end-elevation.png', 'porta-cabin-with-toilet-10x10-end-elevation.webp',
     'End wall of the 10x10 cabin with toilet door, louvred vent and external soil vent pipe'),
    ('10x10', 'portable-cabin-with-toilet-10x10-space-interior.png', 'porta-cabin-with-toilet-10x10-space-interior.webp',
     'Unfurnished 10x10 work room with wood-look floor, lined walls and internal toilet door'),
    ('10x10', 'portable-cabin-with-toilet-10x10-rear-interior.png', 'porta-cabin-with-toilet-10x10-rear-interior.webp',
     'Toilet compartment in the 10x10 cabin with wall-hung WC, basin, mirror and health faucet'),

    ('20x8', 'portable-cabin-with-toilet-20x8-hero-view.png', 'porta-cabin-with-toilet-20x8-hero-view.webp',
     'White and maroon 20x8 porta cabin with toilet, open door and end toilet door in a factory yard'),
    ('20x8', 'portable-cabin-with-toilet-20x8-front-angle.png', 'porta-cabin-with-toilet-20x8-front-angle.webp',
     'Maroon-skirted 20x8 cabin with open entrance door showing the furnished work room inside'),
    ('20x8', 'portable-cabin-with-toilet-20x8-elevated-view.png', 'porta-cabin-with-toilet-20x8-elevated-view.webp',
     'Raised view of the 20x8 cabin on a construction site with precast segments and a gantry crane'),
    ('20x8', 'portable-cabin-with-toilet-20x8-end-elevation.png', 'porta-cabin-with-toilet-20x8-end-elevation.webp',
     'End elevation of the 20x8 cabin showing the toilet door, louvred vent and vent pipe'),
    ('20x8', 'portable-cabin-with-toilet-20x8-space-interior.png', 'porta-cabin-with-toilet-20x8-space-interior.webp',
     '20x8 work room with meeting table, chairs and open toilet door showing WC and basin'),
    ('20x8', 'portable-cabin-with-toilet-20x8-rear-interior.png', 'porta-cabin-with-toilet-20x8-rear-interior.webp',
     'Green-lined toilet in the 20x8 cabin with WC, wall basin, mirror and extractor fan'),

    ('20x10', 'portable-cabin-with-toilet-20x10-hero-view.png', 'porta-cabin-with-toilet-20x10-hero-view.webp',
     'White and blue 20x10 porta cabin with toilet, open work-room door and separate toilet door'),
    ('20x10', 'portable-cabin-with-toilet-20x10-front-angle.png', 'porta-cabin-with-toilet-20x10-front-angle.webp',
     'Blue-skirted 20x10 cabin on a levelled earth site with open door and end toilet entry'),
    ('20x10', 'portable-cabin-with-toilet-20x10-elevated-view.png', 'porta-cabin-with-toilet-20x10-elevated-view.webp',
     'Raised view of the 20x10 cabin in a container yard showing roof, window and both doors'),
    ('20x10', 'portable-cabin-with-toilet-20x10-end-elevation.png', 'porta-cabin-with-toilet-20x10-end-elevation.webp',
     'End wall of the 20x10 cabin with louvred vent, toilet door and roof-height soil vent pipe'),
    ('20x10', 'portable-cabin-with-toilet-20x10-space-interior.png', 'porta-cabin-with-toilet-20x10-space-interior.webp',
     '20x10 work room with desk run, storage units and glazed toilet cubicle with WC and basin'),
    ('20x10', 'portable-cabin-with-toilet-20x10-rear-interior.png', 'porta-cabin-with-toilet-20x10-rear-interior.webp',
     'White and black toilet in the 20x10 cabin with wall-hung WC, vanity basin and mirror'),

    ('20x12', 'portable-cabin-with-toilet-20x12-hero-view.png', 'porta-cabin-with-toilet-20x12-hero-view.webp',
     'White and blue 20x12 porta cabin with toilet on a concrete plinth beside a solar array'),
    ('20x12', 'portable-cabin-with-toilet-20x12-front-angle.png', 'porta-cabin-with-toilet-20x12-front-angle.webp',
     '20x12 cabin with open door showing the work room, and the toilet door at the far end'),
    ('20x12', 'portable-cabin-with-toilet-20x12-elevated-view.png', 'porta-cabin-with-toilet-20x12-elevated-view.webp',
     'Raised view of the 20x12 cabin on a hillside site with window, entrance door and vent'),
    ('20x12', 'portable-cabin-with-toilet-20x12-end-elevation.png', 'porta-cabin-with-toilet-20x12-end-elevation.webp',
     'End elevation of the 20x12 cabin showing louvred vent, toilet door and external vent pipe'),
    ('20x12', 'portable-cabin-with-toilet-20x12-space-interior.png', 'porta-cabin-with-toilet-20x12-space-interior.webp',
     '20x12 work room with meeting desk, chairs and toilet cubicle holding a WC and urinal'),
    ('20x12', 'portable-cabin-with-toilet-20x12-rear-interior.png', 'porta-cabin-with-toilet-20x12-rear-interior.webp',
     'Toilet in the 20x12 cabin with urinal, wall-hung WC, timber vanity basin and mirror'),

    ('30x10', 'portable-cabin-with-toilet-30x10-hero-view.png', 'porta-cabin-with-toilet-30x10-hero-view.webp',
     'White and grey 30x10 porta cabin with toilet, wide window, open door and end toilet door'),
    ('30x10', 'portable-cabin-with-toilet-30x10-front-angle.png', 'porta-cabin-with-toilet-30x10-front-angle.webp',
     'Grey-skirted 30x10 cabin on a hill site showing two windows, entrance door and vent pipe'),
    ('30x10', 'portable-cabin-with-toilet-30x10-elevated-view.png', 'porta-cabin-with-toilet-30x10-elevated-view.webp',
     'Raised view of the long 30x10 cabin in a waterfront yard with a glazed work room'),
    ('30x10', 'portable-cabin-with-toilet-30x10-end-elevation.png', 'porta-cabin-with-toilet-30x10-end-elevation.webp',
     'End wall of the 30x10 cabin with toilet door, louvred vent and soil vent pipe'),
    ('30x10', 'portable-cabin-with-toilet-30x10-space-interior.png', 'porta-cabin-with-toilet-30x10-space-interior.webp',
     '30x10 work room with a long desk run, storage wall and toilet cubicle with WC and urinal'),
    ('30x10', 'portable-cabin-with-toilet-30x10-rear-interior.png', 'porta-cabin-with-toilet-30x10-rear-interior.webp',
     'Green-lined toilet in the 30x10 cabin with urinal, WC, wall basin and mirror shelf'),

    ('40x10', 'portable-cabin-with-toilet-40x10-hero-view.png', 'porta-cabin-with-toilet-40x10-hero-view.webp',
     'White and navy 40x10 porta cabin with toilet, long window bay, open door and toilet door'),
    ('40x10', 'portable-cabin-with-toilet-40x10-front-angle.png', 'porta-cabin-with-toilet-40x10-front-angle.webp',
     'Navy-skirted 40x10 cabin in a paved yard with entrance door open to the work room'),
    ('40x10', 'portable-cabin-with-toilet-40x10-elevated-view.png', 'porta-cabin-with-toilet-40x10-elevated-view.webp',
     'Raised view of the 40x10 cabin at an industrial estate showing its full length'),
    ('40x10', 'portable-cabin-with-toilet-40x10-end-elevation.png', 'porta-cabin-with-toilet-40x10-end-elevation.webp',
     'End elevation of the 40x10 cabin with toilet door, louvred vent and roof vent pipe'),
    ('40x10', 'portable-cabin-with-toilet-40x10-space-interior.png', 'porta-cabin-with-toilet-40x10-space-interior.webp',
     '40x10 work room with a four-desk run, storage and toilet cubicle holding WC and urinal'),
    ('40x10', 'portable-cabin-with-toilet-40x10-rear-interior.png', 'porta-cabin-with-toilet-40x10-rear-interior.webp',
     'Toilet in the 40x10 cabin with urinal, wall-hung WC, vanity basin and framed mirror'),
]

TARGET_MIN_KB, TARGET_MAX_KB = 80, 120


def sha256(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


slots, errors = [], []

for size, src, out, alt in GALLERY:
    sp = os.path.join(SRC_ROOT, 'size-%s' % size, src)
    if not os.path.exists(sp):
        errors.append('MISSING SOURCE: ' + sp)
        continue
    im = Image.open(sp)
    sw, sh = im.width, im.height
    if sw != 1254 or sh != 1254:
        errors.append('DIMENSION DRIFT AT CONVERT TIME %s: %dx%d' % (src, sw, sh))
        continue
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')

    od = os.path.join(OUT_ROOT, size)
    os.makedirs(od, exist_ok=True)
    op = os.path.join(od, out)

    # Quality search only -- no resize, no crop. Aim inside the 80-120 KB band;
    # if even quality=95 undershoots 80 KB that's fine (detail preserved), and if
    # quality=40 still exceeds 120 KB we keep the lowest quality tried and flag it.
    chosen_q = None
    for q in (95, 90, 86, 82, 78, 74, 70, 65, 60, 50, 40, 35, 30, 25, 20, 15):
        im.save(op, 'WEBP', quality=q, method=6)
        kb = os.path.getsize(op) / 1024
        chosen_q = q
        if kb <= TARGET_MAX_KB:
            break

    kb = os.path.getsize(op) / 1024
    o = Image.open(op)
    in_band = TARGET_MIN_KB <= kb <= TARGET_MAX_KB
    slots.append(dict(size=size, src=src, out='/images/products/porta-cabin-with-toilet/%s/%s' % (size, out),
                       alt=alt, sw=sw, sh=sh, w=o.width, h=o.height, kb=round(kb, 1),
                       quality=chosen_q, in_band=in_band, sha256=sha256(op)))

print('converted: %d / 36' % len(slots))
print('unique output hashes: %d / %d' % (len({s['sha256'] for s in slots}), len(slots)))
print('unique alt strings  : %d / %d' % (len({s['alt'] for s in slots}), len(slots)))
kbs = [s['kb'] for s in slots]
print('KB range: %.1f to %.1f' % (min(kbs), max(kbs)))
out_of_band = [s for s in slots if not s['in_band']]
print('outside 80-120 KB band: %d' % len(out_of_band))
for s in out_of_band:
    print('  %-70s %6.1f KB at quality=%d' % (s['out'], s['kb'], s['quality']))
dims = {(s['w'], s['h']) for s in slots}
print('output dimensions: %s (source was 1254x1254 for all)' % dims)

if errors:
    print('\nERRORS:')
    for e in errors:
        print('  ' + e)

with open(os.path.join(HERE, 'pc04-image-report.json'), 'w', encoding='utf-8') as f:
    json.dump(dict(slots=slots, errors=errors), f, indent=1)

if errors:
    raise SystemExit(1)
print('\nOK')
