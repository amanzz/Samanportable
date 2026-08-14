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
    """Strip everything that changes between two builds of identical source: the
    buildId and every content-hashed asset filename under /_next/static (chunks, css,
    fonts). What survives is the rendered markup and copy, which is what 11.8 is
    about."""
    h = re.sub(r'"buildId":"[^"]*"', '"buildId":"BUILDID"', h)
    # /_next/static/<hash>/... (buildId path segment)
    h = re.sub(r'/_next/static/[A-Za-z0-9_\-]{8,}/', '/_next/static/BUILDID/', h)
    # any content-hashed asset filename: name-<hex>.ext  or  <hex>.ext
    h = re.sub(r'(/_next/static/[^"\']*?)[-.]?[0-9a-f]{8,}(\.[a-z0-9]+)', r'\1HASH\2', h)
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
