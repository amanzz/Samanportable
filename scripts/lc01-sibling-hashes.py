# -*- coding: utf-8 -*-
"""Rendered-HTML hashes across a broad set of hub/product pages, to prove LC-01's
shared-component edits (rightToExistEntries.tsx, PortaCabinVariantHero.tsx
applications registration, calculatorLadders.ts, labourColonyClusterRail.ts,
[category]/[slug].tsx rail wiring, c01-specifications.json) are opt-in / additive
and change nothing on any page except labor-hutments itself."""
import hashlib
import io
import json
import os
import re
import sys
import urllib.request

BASE = os.environ.get('LC01_BASE', 'http://localhost:3090')
LABEL = sys.argv[1] if len(sys.argv) > 1 else 'current'
HERE = os.path.dirname(os.path.abspath(__file__))

PAGES = [
    '/product/labor-colony',
    '/product/labor-colony/labor-sheds',
    '/product/labor-colony/prefab-labor-camps',
    '/product/porta-cabins',
    '/product/porta-cabins/ms-porta-cabin',
    '/product/porta-cabins/gi-porta-cabin',
    '/product/porta-cabins/porta-cabin-shop',
    '/product/porta-cabins/fire-rated-porta-cabin',
    '/product/porta-cabins/skid-mounted-porta-cabin',
    '/product/container-offices',
    '/product/portable-office',
    '/product/container-cafe',
    '/product/portable-cabin',
    '/product/puf-panel',
    '/product/container-offices/container-office-cabin',
]


def normalise(h, drop_next_data=False):
    h = re.sub(r'"buildId":"[^"]*"', '"buildId":"BUILDID"', h)
    h = re.sub(r'/_next/static/[A-Za-z0-9_\-]{8,}/', '/_next/static/BUILDID/', h)
    h = re.sub(r'/_next/static/chunks/[^"]+\.js', '/_next/static/chunks/CHUNK.js', h)
    h = re.sub(r'/_next/static/(css|media)/[^"]+', r'/_next/static/\1/ASSET', h)
    h = re.sub(r'radix-:[A-Za-z0-9]+:', 'radix-:ID:', h)
    if drop_next_data:
        h = re.sub(r'<script id="__NEXT_DATA__".*?</script>', '', h, flags=re.S)
    return h


out = {}
for p in PAGES:
    try:
        req = urllib.request.Request(BASE + p, headers={'User-Agent': 'lc01-hash'})
        body = urllib.request.urlopen(req, timeout=120).read().decode('utf-8', 'replace')
        out[p] = {
            'sha': hashlib.sha256(normalise(body).encode('utf-8')).hexdigest()[:16],
            'markup': hashlib.sha256(normalise(body, True).encode('utf-8')).hexdigest()[:16],
            'bytes': len(body),
        }
    except Exception as e:
        out[p] = {'sha': 'ERROR', 'markup': 'ERROR', 'bytes': 0, 'error': str(e)[:150]}
    print('%-48s full %s  markup %s  %d B' % (p, out[p]['sha'], out[p]['markup'], out[p]['bytes']))

path = os.path.join(HERE, 'lc01-sibling-hashes-%s.json' % LABEL)
json.dump(out, io.open(path, 'w', encoding='utf-8'), indent=1)
print('\nwrote', os.path.basename(path))
