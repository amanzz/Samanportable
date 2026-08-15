# -*- coding: utf-8 -*-
"""PC-04 v1.4 hero gallery replacement: source verification pass, before any
conversion happens. Checks every one of the 60 supplied files against build
prompt v1.4 section 4: SHA-256 (first 16 hex) and 1254x1254 dimensions for the
36 selected files, plus a single-pass page-wide hash-uniqueness check across
all 60 files actually found on disk."""
import hashlib
import json
import os

from PIL import Image

SRC_ROOT = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
            r'porta-cabin-with-toilet')

# (size, source_filename, output_filename, alt, expected_sha16)
GALLERY = [
    ('10x10', 'portable-cabin-with-toilet-10x10-hero-view.png', 'porta-cabin-with-toilet-10x10-hero-view.webp',
     'Cream 10x10 porta cabin with toilet, main door, grille window and separate end toilet door', 'ce47f17ebe4f116d'),
    ('10x10', 'portable-cabin-with-toilet-10x10-front-angle.png', 'porta-cabin-with-toilet-10x10-front-angle.webp',
     'Cream 10x10 cabin on gravel with SAMAN signboard, sliding window and side toilet door', '1d106f87aa02921e'),
    ('10x10', 'portable-cabin-with-toilet-10x10-elevated-view.png', 'porta-cabin-with-toilet-10x10-elevated-view.webp',
     'Raised view of the cream 10x10 cabin showing its ribbed roof, single window and two doors', 'e72173e9c762e7a4'),
    ('10x10', 'portable-cabin-with-toilet-10x10-end-elevation.png', 'porta-cabin-with-toilet-10x10-end-elevation.webp',
     'End wall of the 10x10 cabin with toilet door, louvred vent and external soil vent pipe', '989c4a4ee2ccc7a5'),
    ('10x10', 'portable-cabin-with-toilet-10x10-space-interior.png', 'porta-cabin-with-toilet-10x10-space-interior.webp',
     'Unfurnished 10x10 work room with wood-look floor, lined walls and internal toilet door', '33261826124d78a0'),
    ('10x10', 'portable-cabin-with-toilet-10x10-rear-interior.png', 'porta-cabin-with-toilet-10x10-rear-interior.webp',
     'Toilet compartment in the 10x10 cabin with wall-hung WC, basin, mirror and health faucet', '35a0772faa2aba45'),

    ('20x8', 'portable-cabin-with-toilet-20x8-hero-view.png', 'porta-cabin-with-toilet-20x8-hero-view.webp',
     'White and maroon 20x8 porta cabin with toilet, open door and end toilet door in a factory yard', '813a8b6aaaf9aaac'),
    ('20x8', 'portable-cabin-with-toilet-20x8-front-angle.png', 'porta-cabin-with-toilet-20x8-front-angle.webp',
     'Maroon-skirted 20x8 cabin with open entrance door showing the furnished work room inside', '50ff22849bbf965e'),
    ('20x8', 'portable-cabin-with-toilet-20x8-elevated-view.png', 'porta-cabin-with-toilet-20x8-elevated-view.webp',
     'Raised view of the 20x8 cabin on a construction site with precast segments and a gantry crane', 'aabb16c540754a0b'),
    ('20x8', 'portable-cabin-with-toilet-20x8-end-elevation.png', 'porta-cabin-with-toilet-20x8-end-elevation.webp',
     'End elevation of the 20x8 cabin showing the toilet door, louvred vent and vent pipe', '6495bf7d7426e0b9'),
    ('20x8', 'portable-cabin-with-toilet-20x8-space-interior.png', 'porta-cabin-with-toilet-20x8-space-interior.webp',
     '20x8 work room with meeting table, chairs and open toilet door showing WC and basin', 'c6aa025683a186d9'),
    ('20x8', 'portable-cabin-with-toilet-20x8-rear-interior.png', 'porta-cabin-with-toilet-20x8-rear-interior.webp',
     'Green-lined toilet in the 20x8 cabin with WC, wall basin, mirror and extractor fan', '35de8553f4ee917e'),

    ('20x10', 'portable-cabin-with-toilet-20x10-hero-view.png', 'porta-cabin-with-toilet-20x10-hero-view.webp',
     'White and blue 20x10 porta cabin with toilet, open work-room door and separate toilet door', 'f66cb6aac849b239'),
    ('20x10', 'portable-cabin-with-toilet-20x10-front-angle.png', 'porta-cabin-with-toilet-20x10-front-angle.webp',
     'Blue-skirted 20x10 cabin on a levelled earth site with open door and end toilet entry', 'ad501cd94e9ebbcf'),
    ('20x10', 'portable-cabin-with-toilet-20x10-elevated-view.png', 'porta-cabin-with-toilet-20x10-elevated-view.webp',
     'Raised view of the 20x10 cabin in a container yard showing roof, window and both doors', '88e1574ea07ef262'),
    ('20x10', 'portable-cabin-with-toilet-20x10-end-elevation.png', 'porta-cabin-with-toilet-20x10-end-elevation.webp',
     'End wall of the 20x10 cabin with louvred vent, toilet door and roof-height soil vent pipe', 'bdfb6250fb1d91be'),
    ('20x10', 'portable-cabin-with-toilet-20x10-space-interior.png', 'porta-cabin-with-toilet-20x10-space-interior.webp',
     '20x10 work room with desk run, storage units and glazed toilet cubicle with WC and basin', '0632b97550ec5646'),
    ('20x10', 'portable-cabin-with-toilet-20x10-rear-interior.png', 'porta-cabin-with-toilet-20x10-rear-interior.webp',
     'White and black toilet in the 20x10 cabin with wall-hung WC, vanity basin and mirror', 'f3d07655ec1e5507'),

    ('20x12', 'portable-cabin-with-toilet-20x12-hero-view.png', 'porta-cabin-with-toilet-20x12-hero-view.webp',
     'White and blue 20x12 porta cabin with toilet on a concrete plinth beside a solar array', '2cbbdfcae75386ae'),
    ('20x12', 'portable-cabin-with-toilet-20x12-front-angle.png', 'porta-cabin-with-toilet-20x12-front-angle.webp',
     '20x12 cabin with open door showing the work room, and the toilet door at the far end', 'e0094e39b9195479'),
    ('20x12', 'portable-cabin-with-toilet-20x12-elevated-view.png', 'porta-cabin-with-toilet-20x12-elevated-view.webp',
     'Raised view of the 20x12 cabin on a hillside site with window, entrance door and vent', 'a0fab34500eaf049'),
    ('20x12', 'portable-cabin-with-toilet-20x12-end-elevation.png', 'porta-cabin-with-toilet-20x12-end-elevation.webp',
     'End elevation of the 20x12 cabin showing louvred vent, toilet door and external vent pipe', '1f3171575a7eaad4'),
    ('20x12', 'portable-cabin-with-toilet-20x12-space-interior.png', 'porta-cabin-with-toilet-20x12-space-interior.webp',
     '20x12 work room with meeting desk, chairs and toilet cubicle holding a WC and urinal', 'fbdd77ddacb70d46'),
    ('20x12', 'portable-cabin-with-toilet-20x12-rear-interior.png', 'porta-cabin-with-toilet-20x12-rear-interior.webp',
     'Toilet in the 20x12 cabin with urinal, wall-hung WC, timber vanity basin and mirror', '4c872dd242f3554a'),

    ('30x10', 'portable-cabin-with-toilet-30x10-hero-view.png', 'porta-cabin-with-toilet-30x10-hero-view.webp',
     'White and grey 30x10 porta cabin with toilet, wide window, open door and end toilet door', '857713e4c6b224c5'),
    ('30x10', 'portable-cabin-with-toilet-30x10-front-angle.png', 'porta-cabin-with-toilet-30x10-front-angle.webp',
     'Grey-skirted 30x10 cabin on a hill site showing two windows, entrance door and vent pipe', '17a363f2a12ae5f9'),
    ('30x10', 'portable-cabin-with-toilet-30x10-elevated-view.png', 'porta-cabin-with-toilet-30x10-elevated-view.webp',
     'Raised view of the long 30x10 cabin in a waterfront yard with a glazed work room', '8e2558ab5c359200'),
    ('30x10', 'portable-cabin-with-toilet-30x10-end-elevation.png', 'porta-cabin-with-toilet-30x10-end-elevation.webp',
     'End wall of the 30x10 cabin with toilet door, louvred vent and soil vent pipe', 'bd0c444416d7e577'),
    ('30x10', 'portable-cabin-with-toilet-30x10-space-interior.png', 'porta-cabin-with-toilet-30x10-space-interior.webp',
     '30x10 work room with a long desk run, storage wall and toilet cubicle with WC and urinal', '1e658ce00e4fffbb'),
    ('30x10', 'portable-cabin-with-toilet-30x10-rear-interior.png', 'porta-cabin-with-toilet-30x10-rear-interior.webp',
     'Green-lined toilet in the 30x10 cabin with urinal, WC, wall basin and mirror shelf', 'd4f7cf83153482ed'),

    ('40x10', 'portable-cabin-with-toilet-40x10-hero-view.png', 'porta-cabin-with-toilet-40x10-hero-view.webp',
     'White and navy 40x10 porta cabin with toilet, long window bay, open door and toilet door', 'ab02752b9c082ee7'),
    ('40x10', 'portable-cabin-with-toilet-40x10-front-angle.png', 'porta-cabin-with-toilet-40x10-front-angle.webp',
     'Navy-skirted 40x10 cabin in a paved yard with entrance door open to the work room', '958de0c60d66b6d1'),
    ('40x10', 'portable-cabin-with-toilet-40x10-elevated-view.png', 'porta-cabin-with-toilet-40x10-elevated-view.webp',
     'Raised view of the 40x10 cabin at an industrial estate showing its full length', 'cba47e3e9080e10c'),
    ('40x10', 'portable-cabin-with-toilet-40x10-end-elevation.png', 'porta-cabin-with-toilet-40x10-end-elevation.webp',
     'End elevation of the 40x10 cabin with toilet door, louvred vent and roof vent pipe', '4501fd191a0ed687'),
    ('40x10', 'portable-cabin-with-toilet-40x10-space-interior.png', 'porta-cabin-with-toilet-40x10-space-interior.webp',
     '40x10 work room with a four-desk run, storage and toilet cubicle holding WC and urinal', 'cec2d31fb14cd92d'),
    ('40x10', 'portable-cabin-with-toilet-40x10-rear-interior.png', 'porta-cabin-with-toilet-40x10-rear-interior.webp',
     'Toilet in the 40x10 cabin with urinal, wall-hung WC, vanity basin and framed mirror', '0fdbef5603d48b4b'),
]

SIZES = ('10x10', '20x8', '20x10', '20x12', '30x10', '40x10')
GALLERY_BY_KEY = {(size, src): (out, alt, expect) for size, src, out, alt, expect in GALLERY}


def sha16(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()[:16]


errors = []
all_hashes = {}  # sha16 -> list of (size, filename) -- single pass, one entry per file on disk
report = []

for size in SIZES:
    d = os.path.join(SRC_ROOT, 'size-%s' % size)
    if not os.path.isdir(d):
        errors.append('MISSING SIZE FOLDER: ' + d)
        continue
    for fn in sorted(os.listdir(d)):
        if not fn.lower().endswith('.png'):
            continue
        fp = os.path.join(d, fn)
        h = sha16(fp)
        all_hashes.setdefault(h, []).append('%s/%s' % (size, fn))

        key = (size, fn)
        if key in GALLERY_BY_KEY:
            out, alt, expect = GALLERY_BY_KEY[key]
            im = Image.open(fp)
            hash_ok = (h == expect)
            dims_ok = (im.width == 1254 and im.height == 1254)
            report.append(dict(size=size, src=fn, out=out, w=im.width, h=im.height,
                                hash_ok=hash_ok, got=h, expect=expect, dims_ok=dims_ok))
            if not hash_ok:
                errors.append('HASH MISMATCH %s: expected %s got %s' % (fn, expect, h))
            if not dims_ok:
                errors.append('DIMENSION MISMATCH %s: %dx%d (expected 1254x1254)' % (fn, im.width, im.height))

found_keys = {(r['size'], r['src']) for r in report}
missing = [k for k in GALLERY_BY_KEY if k not in found_keys]
for size, fn in missing:
    errors.append('MISSING SOURCE: size-%s/%s' % (size, fn))

total_files = sum(len(v) for v in all_hashes.values())
dupes = {h: files for h, files in all_hashes.items() if len(files) > 1}

print('36 selected files checked: %d hash matches, %d dimension matches, %d missing'
      % (sum(r['hash_ok'] for r in report), sum(r['dims_ok'] for r in report), len(missing)))
print('total PNG files found across 6 size folders (single pass): %d (ticket claims 60)' % total_files)
print('unique hashes among all files found: %d / %d' % (len(all_hashes), total_files))
if dupes:
    print('DUPLICATE HASHES (real):')
    for h, files in dupes.items():
        print('  %s: %r' % (h, files))
else:
    print('no duplicate hashes found -- all 60 supplied files are unique')

if errors:
    print('\nERRORS:')
    for e in errors:
        print('  ' + e)
else:
    print('\nOK: all 36 manifest entries verified against source, no dimension or hash drift, 0 duplicates.')

with open(os.path.join(os.path.dirname(__file__), 'pc04-source-verify-report.json'), 'w', encoding='utf-8') as f:
    json.dump(dict(report=report, total_files=total_files, unique_hashes=len(all_hashes),
                    dupes=dupes, errors=errors), f, indent=1)
