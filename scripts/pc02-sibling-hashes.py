# -*- coding: utf-8 -*-
"""Captures normalised HTML hashes for the sibling pages that share the components
PC-02 touched, so the build can prove acceptance criterion 11.8 (sibling pages' built
HTML unchanged) against the 8ee21bb6 baseline.

Build-to-build noise (the Next.js buildId, chunk filename hashes, and the __NEXT_DATA__
blob that embeds the buildId) is normalised out; everything else is compared byte for
byte."""
import hashlib
import io
import json
import os
import re
import sys
import urllib.request

BASE = os.environ.get('PC02_BASE', 'http://localhost:3022')
LABEL = sys.argv[1] if len(sys.argv) > 1 else 'current'
HERE = os.path.dirname(os.path.abspath(__file__))

PAGES = [
    '/product/porta-cabins',
    '/product/porta-cabins/ms-porta-cabin',
    '/product/porta-cabins/steel-porta-cabin',
    '/product/porta-cabins/luxury-porta-cabin',
    '/product/porta-cabins/mini-porta-cabin',
    '/product/porta-cabins/low-cost-porta-cabin',
    '/product/porta-cabins/porta-cabin-shop',
    '/product/porta-cabins/porta-cabin-with-toilet',
    '/product/porta-cabins/porta-cabin-house',
    '/product/container-offices',
    '/product/portable-office',
    '/product/container-cafe',
    '/product/portable-cabin',
    '/product/puf-panel',
]


def normalise(h):
    h = re.sub(r'/_next/static/[^/"]+/', '/_next/static/BUILDID/', h)
    h = re.sub(r'"buildId":"[^"]*"', '"buildId":"BUILDID"', h)
    h = re.sub(r'/_next/static/chunks/[^"]*?\.js', '/_next/static/chunks/CHUNK.js', h)
    h = re.sub(r'/_next/static/css/[^"]*?\.css', '/_next/static/css/CHUNK.css', h)
    return h


out = {}
for p in PAGES:
    try:
        req = urllib.request.Request(BASE + p, headers={'User-Agent': 'pc02-hash'})
        body = urllib.request.urlopen(req, timeout=120).read().decode('utf-8', 'replace')
        out[p] = {'sha': hashlib.sha256(normalise(body).encode('utf-8')).hexdigest()[:16],
                  'bytes': len(body)}
    except Exception as e:
        out[p] = {'sha': 'ERROR', 'bytes': 0, 'error': str(e)[:120]}
    print('%-52s %s  %d bytes' % (p, out[p]['sha'], out[p]['bytes']))

path = os.path.join(HERE, 'pc02-sibling-hashes-%s.json' % LABEL)
json.dump(out, io.open(path, 'w', encoding='utf-8'), indent=1)
print('\nwrote', os.path.basename(path))
