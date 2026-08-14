# -*- coding: utf-8 -*-
"""Builds labelled contact sheets so every wired image can be opened and checked
against its approved alt (build prompt v1 section 4: filenames are unreliable)."""
import json
import os

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
rows = json.load(open(os.path.join(HERE, 'pc02-image-report.json'), encoding='utf-8'))
OUT = os.path.join(HERE, 'contact')
os.makedirs(OUT, exist_ok=True)

CELL = 420
PAD = 26
COLS = 3


def sheet(items, name):
    n = len(items)
    cols = min(COLS, n)
    rowsn = (n + cols - 1) // cols
    W = cols * CELL + (cols + 1) * PAD
    H = rowsn * (CELL + PAD + 30) + PAD
    canvas = Image.new('RGB', (W, H), (250, 250, 250))
    d = ImageDraw.Draw(canvas)
    for i, r in enumerate(items):
        c, rr = i % cols, i // cols
        x = PAD + c * (CELL + PAD)
        y = PAD + rr * (CELL + PAD + 30)
        im = Image.open(os.path.join(ROOT, 'public', r['out'].lstrip('/').replace('/', os.sep)))
        im = im.convert('RGB')
        im.thumbnail((CELL, CELL), Image.LANCZOS)
        canvas.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2))
        d.rectangle([x, y, x + CELL, y + CELL], outline=(180, 180, 180))
        d.rectangle([x, y, x + 34, y + 26], fill=(20, 90, 60))
        d.text((x + 11, y + 8), str(i + 1), fill=(255, 255, 255))
        d.text((x + 2, y + CELL + 8), os.path.basename(r['out'])[:62], fill=(30, 30, 30))
    canvas.save(os.path.join(OUT, name), quality=90)
    print('wrote', name, '(%d images)' % n)


for size in ['10x10', '20x8', '20x10', '20x12', '40x8', '40x10']:
    sheet([r for r in rows if r['slot'] == 'gallery' and r['size'] == size], 'gallery-%s.jpg' % size)
sheet([r for r in rows if r['slot'] == 'description'], 'description.jpg')
