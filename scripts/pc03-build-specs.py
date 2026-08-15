# -*- coding: utf-8 -*-
"""Specifications tab for PC-03, parsed out of build prompt v2 section 12.7, plus the
PDF and diagram staging.

Diagram decision (build prompt v2 section 10: "A diagram carrying a factual error is
pulled and reported, not shipped with a disclaimer"):
  - Diagram A is PULLED. It labels the two-storey transfer chassis "150x75x5 mm RHS",
    while section 12.7 Table 1 and the technical PDF both specify "150x75x5 mm MS
    C-channel". RHS and C-channel are different profiles, and this is the primary
    load-bearing member of the product.
  - Diagram B ships, with the mandated caption rendered as visible HTML beneath it.
"""
import io
import json
import os
import re
import shutil
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)'
TICKET = os.path.join(SRC, 'double-story-porta-cabin', '_build-inputs',
                      'PC-03-double-story-porta-cabin-build-prompt-v2.md')

raw = io.open(TICKET, encoding='utf-8', newline='').read()

# narrative: the fenced block under "### Narrative"
NARRATIVE = re.search(r'###\s+Narrative[^\n]*\n+```\n(.*?)\n```', raw, re.S).group(1).strip()


def rows_after(header_re):
    start = re.search(header_re, raw).end()
    out = []
    for line in raw[start:].split('\n'):
        s = line.strip()
        if s.startswith('|') and not re.match(r'^\|[\s\-:|]+\|$', s):
            c = [x.strip() for x in s.strip('|').split('|')]
            if len(c) == 2:
                out.append(c)
        elif out and not s.startswith('|'):
            break
    return out[1:]


T1_NAME = 'Table 1: Structure, chassis, envelope, roof and floor'
T2_NAME = 'Table 2: Interior, openings, services and scope'
t1 = rows_after(r'###\s+Table 1:[^\n]*\n')
t2 = rows_after(r'###\s+Table 2:[^\n]*\n')

specs = []
for group, rows in ((T1_NAME, t1), (T2_NAME, t2)):
    for comp, detail in rows:
        specs.append({"group": group, "component": comp, "detail": detail,
                      "sourceSheet": "PC-G1-04", "differsFromHub": False})

# ── stage the PDF (ticket section 10 names the wired filename) ───────────────
pdf_src = os.path.join(SRC, 'SAMAN_Portable_11_SEO_Technical_Specification_PDFs',
                       'saman-double-story-g-plus-1-porta-cabin-technical-specification.pdf')
pdf_dir = os.path.join(ROOT, 'public', 'specs')
os.makedirs(pdf_dir, exist_ok=True)
pdf_out = os.path.join(pdf_dir, 'saman-double-story-porta-cabin-technical-specification.pdf')
shutil.copyfile(pdf_src, pdf_out)
print('PDF staged: %.1f KB  (source stem differs: ...-g-plus-1-...; renamed to the'
      ' filename section 10 names)' % (os.path.getsize(pdf_out) / 1024))

# ── stage diagram B only ─────────────────────────────────────────────────────
dia_dir = os.path.join(ROOT, 'public', 'images', 'products', 'double-story-porta-cabin', 'diagrams')
os.makedirs(dia_dir, exist_ok=True)
dsrc = os.path.join(SRC, 'product-specifications-tab-section-technical-diagrams',
                    'double-story-porta-cabin-diagram-2.png')
im = Image.open(dsrc).convert('RGB')
dout = os.path.join(dia_dir, 'double-story-porta-cabin-diagram-2.webp')
im.save(dout, 'WEBP', quality=86, method=6)
print('Diagram B staged: %dx%d  %.1f KB  (source PNG %.1f KB)'
      % (im.width, im.height, os.path.getsize(dout) / 1024, os.path.getsize(dsrc) / 1024))
print('Diagram A: PULLED, not staged (transfer chassis RHS vs Table 1 MS C-channel)')

# Caption: the disclaimer is supplied verbatim by section 10. No diagram version string
# is supplied anywhere in build prompt v2, so none is invented; reported as a GAP.
CAPTION = 'Illustrative, not for construction.'
DIAGRAM_ALT = ('Stacking, circulation and services overview of the double storey G+1 porta '
               'cabin, axonometric and vertical section')

path = os.path.join(ROOT, 'src', 'data', 'products', 'c01-specifications.json')
data = json.load(io.open(path, encoding='utf-8'))
data['products']['double-story-porta-cabin'] = {
    "name": "Double Story (G+1) Porta Cabin",
    "sheet": "PC-G1-04",
    "canonical": "https://www.samanportable.com/product/porta-cabins/double-story-porta-cabin",
    "specifications": specs,
    "narrative": NARRATIVE,
    "premiumTables": True,
    "diagram": {
        "src": "/images/products/double-story-porta-cabin/diagrams/double-story-porta-cabin-diagram-2.webp",
        "alt": DIAGRAM_ALT,
        "caption": CAPTION,
        "width": im.width,
        "height": im.height,
    },
}
with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

blob = json.dumps(data['products']['double-story-porta-cabin'], ensure_ascii=False)
print('\nspec rows: %d (Table 1: %d, Table 2: %d)' % (len(specs), len(t1), len(t2)))
print('narrative chars: %d' % len(NARRATIVE))
print('em dashes in the PC-03 spec entry: %d' % blob.count('\u2014'))
if blob.count('\u2014'):
    sys.exit('em dash in specifications entry')
print('c01-specifications.json now holds %d products' % len(data['products']))
