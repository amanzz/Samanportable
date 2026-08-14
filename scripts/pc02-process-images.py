# -*- coding: utf-8 -*-
"""PC-02 image intake. Converts the 36 approved gallery sources to WebP at the
production 1254x1254 gallery dimension, copies the 6 pre-processed 16:9 description
WebPs, and hashes every output. Sources are already 1254x1254, so no crop or resample
occurs on the gallery set. Nothing is renamed except the luxury-* sources that the
addendum's Section A explicitly arrows."""
import hashlib
import io
import json
import os
import shutil
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MAN = json.load(open(os.path.join(HERE, 'pc02-image-manifest.json'), encoding='utf-8'))
SRC_ROOT = MAN['sourceRoot']
OUT_ROOT = os.path.join(ROOT, 'public', 'images', 'products', 'gi-porta-cabin')
DESC_SRC = os.path.join(SRC_ROOT, '6 images for long description', 'processed-16x9-webp')

GALLERY_W = GALLERY_H = 1254
QUALITY = 82

rows = []
errors = []


def sha(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


# ---- gallery: 36 slots -------------------------------------------------------
for size, items in MAN['gallery'].items():
    outdir = os.path.join(OUT_ROOT, size)
    os.makedirs(outdir, exist_ok=True)
    srcdir = os.path.join(SRC_ROOT, 'size-' + size)
    for src_name, out_name, alt in items:
        src = os.path.join(srcdir, src_name)
        if not os.path.exists(src):
            errors.append('MISSING SOURCE: ' + src)
            continue
        im = Image.open(src)
        orig = '%dx%d' % (im.width, im.height)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGB')
        if (im.width, im.height) != (GALLERY_W, GALLERY_H):
            errors.append('UNEXPECTED SOURCE SIZE %s for %s (expected 1254x1254)' % (orig, src_name))
            im = im.resize((GALLERY_W, GALLERY_H), Image.LANCZOS)
        out = os.path.join(outdir, out_name)
        im.save(out, 'WEBP', quality=QUALITY, method=6)
        rows.append({
            'slot': 'gallery',
            'size': size,
            'src': src_name,
            'out': '/images/products/gi-porta-cabin/%s/%s' % (size, out_name),
            'alt': alt,
            'w': GALLERY_W, 'h': GALLERY_H,
            'kb': round(os.path.getsize(out) / 1024, 1),
            'sha': sha(out),
        })

# ---- description: 6 slots ----------------------------------------------------
outdir = os.path.join(OUT_ROOT, 'description')
os.makedirs(outdir, exist_ok=True)
for name, alt in MAN['description']:
    src = os.path.join(DESC_SRC, name)
    if not os.path.exists(src):
        errors.append('MISSING SOURCE: ' + src)
        continue
    out = os.path.join(outdir, name)
    shutil.copyfile(src, out)
    im = Image.open(out)
    rows.append({
        'slot': 'description',
        'size': '-',
        'src': name,
        'out': '/images/products/gi-porta-cabin/description/%s' % name,
        'alt': alt,
        'w': im.width, 'h': im.height,
        'kb': round(os.path.getsize(out) / 1024, 1),
        'sha': sha(out),
    })

# ---- report ------------------------------------------------------------------
json.dump(rows, open(os.path.join(HERE, 'pc02-image-report.json'), 'w', encoding='utf-8'), indent=1)

print('slots written: %d (expected 42)' % len(rows))
hashes = {}
for r in rows:
    hashes.setdefault(r['sha'], []).append(r['out'])
dupes = {k: v for k, v in hashes.items() if len(v) > 1}
print('unique files: %d' % len(hashes))
print('duplicate-content groups: %d' % len(dupes))
for k, v in dupes.items():
    print('  DUPLICATE %s -> %s' % (k[:12], v))

alts = {}
for r in rows:
    alts.setdefault(r['alt'], []).append(r['out'])
dupalts = {k: v for k, v in alts.items() if len(v) > 1}
print('duplicate alts: %d' % len(dupalts))
for k, v in dupalts.items():
    print('  DUPLICATE ALT %r -> %s' % (k, v))

kbs = [r['kb'] for r in rows if r['slot'] == 'gallery']
print('gallery KB min/max: %.1f / %.1f' % (min(kbs), max(kbs)))

# excluded file must not exist anywhere under public/
bad = []
for dirpath, _dirnames, filenames in os.walk(os.path.join(ROOT, 'public')):
    for f in filenames:
        if '40x8-end-elevation' in f and 'gi-porta-cabin' in os.path.join(dirpath, f):
            bad.append(os.path.join(dirpath, f))
print('excluded 40x8 end-elevation present in build output: %s' % (bad or 'NO'))

if errors:
    print('\nERRORS:')
    for e in errors:
        print('  ' + e)
    sys.exit(1)
print('\nOK')
