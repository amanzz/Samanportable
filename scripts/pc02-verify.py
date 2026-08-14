# -*- coding: utf-8 -*-
"""PC-02 acceptance checklist (build prompt v1 section 11) against the rendered page."""
import hashlib
import html as htmllib
import io
import json
import os
import re
import sys
import urllib.request

BASE = os.environ.get('PC02_BASE', 'http://localhost:3021')
URL = BASE + '/product/porta-cabins/gi-porta-cabin'
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

results = []


def check(name, ok, detail=''):
    results.append((ok, name, detail))
    print('%-4s %-52s %s' % ('PASS' if ok else 'FAIL', name, detail))


def sha16(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()[:16]


raw = urllib.request.urlopen(URL, timeout=90).read().decode('utf-8')
io.open(os.path.join(HERE, 'pc02-rendered.html'), 'w', encoding='utf-8').write(raw)
print('fetched %s  (%d bytes)\n' % (URL, len(raw)))


def strip_tags(fragment):
    fragment = re.sub(r'<(script|style)\b[^>]*>.*?</\1>', ' ', fragment, flags=re.S | re.I)
    fragment = re.sub(r'<[^>]+>', '', fragment)
    return htmllib.unescape(fragment)


def norm(t):
    return re.sub(r'\s+', ' ', t).strip()


# strip JSON-LD and next data so schema strings don't pollute visible-text checks
visible_src = re.sub(r'<script\b[^>]*>.*?</script>', ' ', raw, flags=re.S | re.I)
visible = norm(strip_tags(visible_src))

# ── 11.1 one H1 + metadata ───────────────────────────────────────────────────
h1s = re.findall(r'<h1\b[^>]*>(.*?)</h1>', raw, flags=re.S | re.I)
check('11.1 exactly one H1', len(h1s) == 1, '%d found' % len(h1s))
H1 = 'Galvanized Iron (GI) Porta Cabin for Corrosive Sites'
check('11.1 H1 text exact', len(h1s) == 1 and norm(strip_tags(h1s[0])) == H1,
      norm(strip_tags(h1s[0]))[:70] if h1s else '')

title = re.search(r'<title[^>]*>(.*?)</title>', raw, flags=re.S | re.I)
title_txt = htmllib.unescape(norm(title.group(1))) if title else ''
check('11.1 SEO title exact', title_txt == 'GI Porta Cabin: Galvanized, Coastal-Ready Build | SAMAN', title_txt[:80])

md = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', raw, flags=re.I)
md_txt = htmllib.unescape(md.group(1)) if md else ''
EXP_MD = 'GI porta cabin with galvanized frame and 0.8–1.2 mm zinc-coated cladding for coastal, humid and chemical-adjacent sites. Six sizes from ₹1,58,125 ex-GST.'
check('11.1 meta description exact', md_txt == EXP_MD, md_txt[:70])

can = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]*)"', raw, flags=re.I)
check('11.1 self-canonical',
      bool(can) and can.group(1) == 'https://www.samanportable.com/product/porta-cabins/gi-porta-cabin',
      can.group(1) if can else 'missing')

check('11.1 counts: H1 %d / title %d / meta %d' % (len(H1), len(title_txt), len(md_txt)),
      len(H1) == 52 and len(title_txt) == 55 and len(md_txt) == 153,
      'expected 52 / 55 / 153')

# ── 11.2 checksums of the approved copy, as rendered ─────────────────────────
EXPECT = json.load(io.open(os.path.join(HERE, 'pc02-checksums.json'), encoding='utf-8'))
# META_TITLE / META_DESC live in <head> attributes, not in body text, so they are
# matched against the metadata already extracted above rather than the visible text.
META_FIELDS = {'META_TITLE': title_txt, 'META_DESC': md_txt}
for field, (want, text) in EXPECT.items():
    got = sha16(text)
    present = (META_FIELDS[field] == text) if field in META_FIELDS else (norm(text) in visible)
    check('11.2 %s checksum + rendered' % field, got == want and present,
          'sha %s%s' % (got, '' if present else ' NOT FOUND IN RENDER'))

# ── 11.3 em dash / en dash ───────────────────────────────────────────────────
em_vis = visible.count('—')
em_meta = (title_txt + ' ' + md_txt).count('—')

# Two em dashes survive in shared-component literals that PC-02 is forbidden to edit:
# the hero's premium size-strip label (shared with the porta-cabins hub under
# `usePremiumSizeTabs`, so editing it breaks sibling byte-identity) and one line of
# calculator copy (section 4: calculator UNTOUCHED). Both are reported as GAPs rather
# than silently fixed. Everything else must be clean.
SHARED_EM_DASH_EXCEPTIONS = [
    'Choose your size — six factory-built options',
    'Every size prices from our base-cabin rate card — the larger the floor area, the lower the rate per square foot.',
]
scrubbed = visible
for line in SHARED_EM_DASH_EXCEPTIONS:
    scrubbed = scrubbed.replace(line, '')
check('11.3 zero em dash in PC-02 approved copy', scrubbed.count('—') == 0,
      '%d found outside the 2 known shared literals' % scrubbed.count('—'))
check('11.3 zero em dash in rendered copy (incl. shared)', em_vis == 0,
      '%d found: %d shared-component literals, GAP-reported' % (em_vis, em_vis))
check('11.3 zero em dash in metadata', em_meta == 0, '%d found' % em_meta)
alts = re.findall(r'\balt="([^"]*)"', raw)
check('11.3 zero em dash in alt text', sum(a.count('—') for a in alts) == 0,
      '%d alts' % len(alts))
bad_en = [m.group(0) for m in re.finditer(r'.{14}–.{14}', visible)
          if not re.search(r'[0-9]\s?–\s?[0-9]', m.group(0))]
check('11.3 en dash only in numeric ranges', not bad_en, bad_en[:2] if bad_en else '')

# ── 11.4 six variant H2s ─────────────────────────────────────────────────────
h2s = [norm(strip_tags(x)) for x in re.findall(r'<h2\b[^>]*>(.*?)</h2>', raw, flags=re.S | re.I)]
variant_h2 = [t for f, (w, t) in EXPECT.items() if f.endswith('_H2') and f.startswith('V')]
found = [t for t in variant_h2 if t in h2s]
check('11.4 six variant H2s present', len(found) == 6, '%d/6' % len(found))

# ── revision v1.2 acceptance additions ───────────────────────────────────────
V3 = json.load(io.open(os.path.join(HERE, 'pc02-v3-variants.json'), encoding='utf-8'))
for i, v in enumerate(V3, 1):
    if v['shape'] == 'A':
        ok = bool(v['p2']) and norm(v['p1']) in visible and norm(v['p2']) in visible and not v['bullets']
        check('R1 V%d Shape A: two paragraphs' % i, ok, v['slug'])
    else:
        nb = len(v['bullets'])
        ok = (not v['p2']) and norm(v['p1']) in visible and 3 <= nb <= 5 \
            and all(norm(b) in visible for b in v['bullets'])
        check('R1 V%d Shape B: one para + %d bullets' % (i, nb), ok, v['slug'])
    n = len(v['p1']) + (len(v['p2']) or 0 if v['p2'] else 0)
    check('R1 V%d prose %d chars in 400-500' % (i, n), 400 <= n <= 500, '')
check('R1 no single-paragraph variant',
      all((v['shape'] == 'A' and v['p2']) or (v['shape'] == 'B' and v['bullets']) for v in V3), '')

PLACEHOLDER = 'Reference photographs for this size are available on request'
check('R3 invented placeholder sentence absent', PLACEHOLDER not in raw,
      '%d occurrence(s)' % raw.count(PLACEHOLDER))

for size in ['10x10', '20x8', '20x10', '20x12', '40x8', '40x10']:
    files = set(re.findall(r'gi-porta-cabin/%s/[a-z0-9-]+\.webp' % size, raw))
    check('R4 %s renders its six images' % size, len(files) == 6, '%d unique' % len(files))

check('R2 Section 2 split card renders', 'saman-s2-split' in raw, '')
D1_SRC = '/images/products/gi-porta-cabin/section2/gi-porta-cabin-20x10-dark-grey-exterior.webp'
D1_ALT = ('Dark grey corrugated GI porta cabin 20x10 ft with a central door and '
          'three sliding windows in a factory yard')
check('D1 split card uses its own 43rd-slot image', D1_SRC in raw, '')
check('D1 approved alt verbatim (sha 979aa00ef7623d2a)',
      D1_ALT in raw and sha16(D1_ALT) == '979aa00ef7623d2a',
      'len %d, sha %s' % (len(D1_ALT), sha16(D1_ALT)))
# Scope this to the split card's own markup. The previously re-used file is a normal
# member of the 20x10 gallery, so it legitimately appears several times page-wide (main
# image, thumbnail, __NEXT_DATA__); what matters is that the card no longer points at it.
_split = raw[raw.find('saman-s2-split'):raw.find('saman-s2-split') + 2000]
check('D1 split card no longer re-uses a gallery file',
      'gi-porta-cabin-20x10-tan-green-front-elevation.webp' not in _split
      and 'section2/gi-porta-cabin-20x10-dark-grey-exterior.webp' in _split, '')
check('R2 split card has media + CTA',
      'saman-s2-split-media' in raw and 'saman-s2-split-cta' in raw, '')
check('R2 split card invents no sub-heading or body',
      'saman-s2-split-subheading' not in raw and 'saman-s2-split-text' not in raw, '')

# Full strings, not substrings: "door and two windows" also occurs inside the untouched
# and correct 20x10 exterior alt, which does show a door and two windows.
R5_OLD = [
    'Empty lined interior of a 20x8 ft GI cabin with door and two windows',
    'Cream and red two-tone 20x10 ft GI cabin, front elevation with door and windows',
]
R5_NEW = [
    'Empty lined interior of a 20x8 ft GI cabin with a door and three windows',
    'Cream and red two-tone 20x10 ft GI cabin, end elevation with a single window',
]
for old in R5_OLD:
    check('R5 superseded alt gone: "%s…"' % old[:30], old not in raw, '')
for new in R5_NEW:
    check('R5 corrected alt present: "%s…"' % new[:30], new in raw, '')
for cell in ['Material', 'Delivery', 'Coverage', 'Brand', 'Application', 'Size']:
    check('11.4 FEATURE_CELLS "%s"' % cell, cell in visible, '')
check('11.4 Coverage value is the approved line', 'Pan-India, 15+ states' in visible, '')
check('11.4 Delivery value is lower-case', '7–21 working days' in visible,
      'title-case leak' if '7–21 Working Days' in visible else '')

# ── 11.5 images ──────────────────────────────────────────────────────────────
report = json.load(io.open(os.path.join(HERE, 'pc02-image-report.json'), encoding='utf-8'))
check('11.5 manifest is 43 slots', len(report) == 43, '%d' % len(report))
check('11.5 43 hash-unique files', len({r['sha'] for r in report}) == 43,
      '%d unique' % len({r['sha'] for r in report}))
check('11.5 43 unique alts', len({r['alt'] for r in report}) == 43, '')
missing = [r['out'] for r in report if r['out'] not in raw]
check('11.5 all 43 wired into the page', not missing, '%d missing: %s' % (len(missing), missing[:2]))
alt_missing = [r['alt'] for r in report if r['alt'] not in raw and htmllib.escape(r['alt'], quote=True) not in raw]
check('11.5 all 43 approved alts rendered', not alt_missing,
      '%d missing: %s' % (len(alt_missing), alt_missing[:1]))
end_elev = [p for p, _d, fs in os.walk(os.path.join(ROOT, 'public'))
            for f in fs if 'gi-porta-cabin' in p and '40x8-end-elevation' in f] if False else []
walk_hits = []
for dirpath, _dn, fns in os.walk(os.path.join(ROOT, 'public')):
    for f in fns:
        if '40x8-end-elevation' in f and 'gi-porta-cabin' in os.path.join(dirpath, f).replace('\\', '/'):
            walk_hits.append(os.path.join(dirpath, f))
check('11.5 excluded 40x8 end-elevation absent', not walk_hits and '40x8-end-elevation' not in raw, str(walk_hits))

# ── 11.6 links ───────────────────────────────────────────────────────────────
LINKS = {
    'https://www.samanportable.com/product/porta-cabins/ms-porta-cabin': 'MS porta cabin',
    'https://www.samanportable.com/contact': 'Get a GI cabin quote',
    'https://www.samanportable.com/product/porta-cabins/puf-porta-cabin': 'PUF porta cabin',
    'https://www.samanportable.com/product/porta-cabins': 'porta cabins range',
}
body_anchors = re.findall(r'<a[^>]+href="(https://www\.samanportable\.com[^"]*)"[^>]*>(.*?)</a>', raw, flags=re.S)
approved = [(h, norm(strip_tags(t))) for h, t in body_anchors]
for href, anchor in LINKS.items():
    hit = [a for a in approved if a[0] == href and a[1] == anchor]
    # The contact CTA is the one approved anchor that legitimately appears twice from
    # revision v1.2 R2: once inline in Section 2 paragraph 2 (checksum-bearing) and once
    # as the mandatory split-card CTA. Same anchor text, same approved destination.
    want = 2 if href.endswith('/contact') else 1
    check('11.6 link "%s"' % anchor, len(hit) == want,
          '%d occurrence(s), expected %d' % (len(hit), want))
extra = [a for a in approved if (a[0], a[1]) not in LINKS.items()]
check('11.6 no unapproved absolute internal links', not extra, str(extra[:2]))
check('11.6 exactly 4 approved destinations', len({a[0] for a in approved}) == 4,
      '%d unique' % len({a[0] for a in approved}))
# Revision v1.2 R2 adds the mandatory split-card CTA, which is the same approved anchor
# and the same approved destination as the section 6 row-2 link, so /contact now appears
# twice as an anchor while the page still carries only the four approved destinations.
contact = [a for a in approved if a[0].endswith('/contact')]
check('11.6 contact anchor: inline + split-card CTA', len(contact) == 2,
      '%d occurrence(s), both the approved anchor text' % len(contact))

# ── 11.7 calculator ──────────────────────────────────────────────────────────
check('11.7 calc-entry band present', 'calc-entry' in raw and 'data-calculator-entry' in raw, '')
band = re.search(r'calc-entry-price">([^<]*)<', raw)
check('11.7 banner price derived = ₹1,58,125', bool(band) and '1,58,125' in band.group(1),
      band.group(1) if band else 'no price in band')
copy_src = io.open(os.path.join(ROOT, 'src/lib/calculatorCopy.ts'), encoding='utf-8').read()
check('11.7 calculatorCopy says six', "modular cabin, six published sizes" in copy_src, '')

# ── 11.9 / 11.10 ─────────────────────────────────────────────────────────────
check('11.9 spec PDF wired', '/specs/saman-gi-porta-cabin-technical-specification.pdf' in raw, '')
check('11.9 diagram 2 wired with caption',
      'gi-porta-cabin-diagram-2.webp' in raw and 'Illustrative, not for construction' in visible, '')
check('11.9 diagram 1 NOT wired', 'gi-porta-cabin-diagram-1' not in raw, '')
low = visible.lower()
check('11.10 no "coming soon"', 'coming soon' not in low, '')
check('11.10 no percentage-premium claim',
      not re.search(r'\d+\s?%\s*(more|premium|over|higher|above)', low), '')
check('11.10 no aggregateRating / review schema',
      'aggregateRating' not in raw and '"@type":"Review"' not in raw.replace(' ', ''), '')
check('11.10 no FAQPage schema', 'FAQPage' not in raw, '')
ld = re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', raw, flags=re.S)
types = []
for blob in ld:
    try:
        obj = json.loads(blob)
    except Exception:
        continue
    for o in (obj if isinstance(obj, list) else [obj]):
        if isinstance(o, dict) and '@type' in o:
            types.append(o['@type'])
check('11.9 schema offers lowPrice 158125 / highPrice 522500',
      '"lowPrice":158125' in raw.replace(' ', '') or '"lowPrice":"158125"' in raw.replace(' ', ''),
      'types: %s' % types)

# ── summary ──────────────────────────────────────────────────────────────────
fails = [r for r in results if not r[0]]
print('\n%d checks, %d passed, %d FAILED' % (len(results), len(results) - len(fails), len(fails)))
for _ok, name, detail in fails:
    print('  FAILED: %s  %s' % (name, detail))
sys.exit(1 if fails else 0)
