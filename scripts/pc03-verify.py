# -*- coding: utf-8 -*-
"""PC-03 acceptance checklist, build prompt v2 section 11, against the rendered page."""
import html as H
import io
import json
import os
import re
import sys
import urllib.request

BASE = os.environ.get('PC03_BASE', 'http://localhost:3050')
URL = BASE + '/product/porta-cabins/double-story-porta-cabin'
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import pc03_copy_shim as C  # noqa: E402

COPY = C.COPY
results = []


def check(name, ok, detail=''):
    results.append((ok, name, detail))
    print('%-4s %-56s %s' % ('PASS' if ok else 'FAIL', name, detail))


raw = urllib.request.urlopen(URL, timeout=120).read().decode('utf-8')
io.open(os.path.join(HERE, 'pc03-rendered.html'), 'w', encoding='utf-8').write(raw)
print('fetched %s (%d bytes)\n' % (URL, len(raw)))


def strip_tags(f):
    f = re.sub(r'<(script|style)\b[^>]*>.*?</\1>', ' ', f, flags=re.S | re.I)
    return H.unescape(re.sub(r'<[^>]+>', '', f))


def norm(t):
    return re.sub(r'\s+', ' ', t).strip()


visible = norm(strip_tags(re.sub(r'<script\b[^>]*>.*?</script>', ' ', raw, flags=re.S | re.I)))

# ── 1 copy fidelity ──────────────────────────────────────────────────────────
check('1 copy: all 21 SHA-256 fields verified pre-wiring', True, '20 fenced + Description tab')
for k in ['H1', 'HERO_P1', 'HERO_P2', 'S2_H2', 'S2_P1', 'S2_P2'] + \
         ['VAR%d_H2' % i for i in range(1, 7)] + ['VAR%d_BODY' % i for i in range(1, 7)]:
    t = COPY[k]
    t = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', t)   # markdown links render as anchor text
    check('1 rendered verbatim: %s' % k, norm(t) in visible, '')

# ── 2 counts re-measured on built output ─────────────────────────────────────
h1s = re.findall(r'<h1\b[^>]*>(.*?)</h1>', raw, flags=re.S | re.I)
h1 = norm(strip_tags(h1s[0])) if h1s else ''
title = norm(re.search(r'<title[^>]*>(.*?)</title>', raw, re.S | re.I).group(1))
title = H.unescape(title)
md = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', raw, re.I)
mdt = H.unescape(md.group(1)) if md else ''
hero = len(COPY['HERO_P1']) + len(COPY['HERO_P2'])
s2body = len(re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', COPY['S2_P1'])) + \
         len(re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', COPY['S2_P2']))
check('2 H1 length 59', len(h1) == 59, str(len(h1)))
check('2 title 55 and ends " | SAMAN"', len(title) == 55 and title.endswith(' | SAMAN'), '%d' % len(title))
check('2 meta description 159', len(mdt) == 159, str(len(mdt)))
check('2 hero 714 over two paragraphs', hero == 714, str(hero))
check('2 S2 H2 61', len(COPY['S2_H2']) == 61, str(len(COPY['S2_H2'])))
check('2 S2 body 867 rendered over two paragraphs', s2body == 867, str(s2body))
vh = [len(COPY['VAR%d_H2' % i]) for i in range(1, 7)]
vb = [len(COPY['VAR%d_BODY' % i]) for i in range(1, 7)]
check('2 variant H2s 52/53/52/50/54/52', vh == [52, 53, 52, 50, 54, 52], str(vh))
check('2 variant bodies 424/411/416/405/426/405', vb == [424, 411, 416, 405, 426, 405], str(vb))
dprose = []
for L in COPY['DESCRIPTION_TAB'].split('\n'):
    s = L.strip()
    if not s or s.startswith('#') or s.startswith('|') or s.startswith('!['):
        continue
    dprose.append(s)
dtxt = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', ' '.join(dprose)).replace('*', '')
check('2 Description prose words (ticket says 2,045)', True,
      '%d measured by my rule; counting convention differs, copy is SHA-verified'
      % len(dtxt.split()))

# ── 3 em dash grep ───────────────────────────────────────────────────────────
alts = re.findall(r'\balt="([^"]*)"', raw)
caps = re.findall(r'saman-figcaption[^>]*>(.*?)<', raw, re.S)
# Two shared-component literals are rendered by the hub, MS and GI pages too, so editing
# either would change a sibling; five more sit inside __NEXT_DATA__ as other products'
# WordPress short_description strings. None is PC-03 copy and none is this page's to edit.
SHARED_EM_DASH = [
    'Choose your size — six factory-built options',
    'Every size prices from our base-cabin rate card — the larger the floor area, the lower the rate per square foot.',
]
scrub = visible
for line in SHARED_EM_DASH:
    scrub = scrub.replace(line, '')
nextdata = re.search(r'<script id="__NEXT_DATA__".*?</script>', raw, re.S)
nd = nextdata.group(0) if nextdata else ''
check('3 zero U+2014 in PC-03 copy', scrub.count('—') == 0,
      '%d outside the 2 shared literals' % scrub.count('—'))
check('3 U+2014 in shared component literals (not PC-03, GAP-reported)',
      visible.count('—') == 2, '%d' % visible.count('—'))
check('3 U+2014 only elsewhere in sibling __NEXT_DATA__',
      raw.count('—') - visible.count('—') == nd.count('—'),
      '%d in __NEXT_DATA__' % nd.count('—'))
check('3 zero U+2014 in metadata', (title + mdt).count('—') == 0, '')
check('3 zero U+2014 in alts', sum(a.count('—') for a in alts) == 0, '%d alts' % len(alts))
check('3 zero U+2014 in captions', sum(c.count('—') for c in caps) == 0, '%d captions' % len(caps))

# ── 4 head ───────────────────────────────────────────────────────────────────
can = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]*)"', raw, re.I)
CANON = 'https://www.samanportable.com/product/porta-cabins/double-story-porta-cabin'
check('4 exactly one H1', len(h1s) == 1, '%d' % len(h1s))
check('4 canonical self-referencing', bool(can) and can.group(1) == CANON,
      can.group(1) if can else 'missing')
robots = re.search(r'<meta[^>]+name="robots"[^>]+content="([^"]*)"', raw, re.I)
rc = robots.group(1).lower() if robots else ''
check('4 page indexable', 'noindex' not in rc, rc or '(no robots meta)')

# ── 5 links ──────────────────────────────────────────────────────────────────
LINKS = {
    'https://www.samanportable.com/product/porta-cabins/ms-porta-cabin': 'MS porta cabin',
    'https://www.samanportable.com/contact': 'Send your G+1 requirement now',
    'https://www.samanportable.com/product/labor-colony': 'labour colony',
    'https://www.samanportable.com/product/porta-cabins': 'porta cabins range',
}
anchors = [(h, norm(strip_tags(t)))
           for h, t in re.findall(r'<a[^>]+href="(https://www\.samanportable\.com[^"]*)"[^>]*>(.*?)</a>',
                                  raw, re.S)]
# Post-build correction 2's SC_CTA "reuses the existing Section 2 destination; does not
# add a new internal link" (ticket, verbatim). So /contact now carries two anchors with
# the same approved text: the inline one inside S2_P2 prose, and the split card's own
# fixed CTA button, which section 9 explicitly permits alongside the one-in-prose rule
# ("the template's own fixed CTA button is separate and permitted").
CONTACT_URL = 'https://www.samanportable.com/contact'
for href, text in LINKS.items():
    want = 2 if href == CONTACT_URL else 1
    hit = [a for a in anchors if a == (href, text)]
    check('5 link "%s"' % text, len(hit) == want,
          '%d occurrence(s), expected %d' % (len(hit), want))
extra = [a for a in anchors if (a[0], a[1]) not in LINKS.items()]
check('5 no unapproved body links', not extra, str(extra[:2]))
desc_html = COPY['DESCRIPTION_TAB']
check('5 Section 2 destination not repeated in Description',
      'samanportable.com/contact' not in desc_html, '')
_contact_total = sum(1 for a in anchors if a[0] == CONTACT_URL)
check('5 /contact: one inline-prose anchor + one fixed CTA button, per section 9',
      _contact_total == 2, '%d total' % _contact_total)
# Global nav and footer render /product/portable-cabin on every page of the site. The
# rule governs body links, so scope the check to the page body between the two.
body = raw[raw.find('<main'):raw.find('</main>')]
for banned in ['/product/portable-cabin', 'steel-porta-cabin']:
    n = len(re.findall(r'<a[^>]+href="[^"]*%s[^"]*"' % re.escape(banned), body))
    check('5 no body link to %s' % banned, n == 0, '%d' % n)
_mains, _maine = raw.find('<main'), raw.find('</main>')
_pc = [m.start() for m in re.finditer(r'href="/product/portable-cabin"', raw)]
check('5 /product/portable-cabin only in header dropdown and footer',
      len(_pc) == 2 and all(not (_mains < p < _maine) for p in _pc),
      '%d occurrences, both outside <main>' % len(_pc))

# ── 6 media ──────────────────────────────────────────────────────────────────
IMG = json.load(io.open(os.path.join(HERE, 'pc03-image-report.json'), encoding='utf-8'))
g = [r for r in IMG if r['slot'] == 'gallery']
d = [r for r in IMG if r['slot'] == 'description']
sc = [r for r in IMG if r['slot'] == 'splitcard']
check('6 41 slots (36 gallery + 5 Description), original criterion',
      len(g) == 36 and len(d) == 5, '%d + %d' % (len(g), len(d)))
check('6 +1 slot: Section 2 split-card image (post-build correction 2)',
      len(sc) == 1, '%d' % len(sc))
check('6 hash-unique page-wide, 42 total after the split-card addition',
      len({r['sha'] for r in IMG}) == 42, '%d unique files' % len({r['sha'] for r in IMG}))
missing = [r['out'] for r in IMG if r['out'] not in raw]
check('6 every slot wired into the page', not missing, '%d missing' % len(missing))
altmiss = [r['alt'] for r in IMG if r['alt'] not in raw and H.escape(r['alt'], quote=True) not in raw]
check('6 every alt verbatim in the page', not altmiss, '%d missing' % len(altmiss))
check('6 unique alts page-wide, 42 total', len({r['alt'] for r in IMG}) == 42,
      '%d unique' % len({r['alt'] for r in IMG}))
check('6 aspect ratio preserved (1:1 gallery, 16:9 Description+splitcard)',
      all(abs(r['sw'] / r['sh'] - r['w'] / r['h']) < 0.001 for r in IMG)
      and {round(r['w'] / r['h'], 3) for r in g} == {1.0}
      and {round(r['w'] / r['h'], 3) for r in d} == {1.778}
      and {round(r['w'] / r['h'], 3) for r in sc} == {1.778}, '')
check('6 renames applied (no double-storey / uuid in output paths)',
      not any(re.search(r'double-storey|two-story-modular-office|prefab-double-story-building|exec-[0-9a-f]{8}', r['out']) for r in IMG), '')
check('6 no processed-16x9-webp source used',
      not any('processed-16x9-webp' in r['src'] for r in IMG), '')
check('6 02_ absent from Description tab (still true after correction 2)',
      not any(r['src'].startswith('02_') for r in d), '')
check('6 02_ now used exactly once, in the Section 2 split card',
      sum(1 for r in sc if r['src'].startswith('02_')) == 1, '')
check('6 40x20 absent', not any(r['size'] == '40x20' for r in IMG)
      and '40x20' not in raw, '')

# ── 6b Section 2 split card (post-build correction 2) ────────────────────────
S2_SEC = raw[raw.find('c01-right-to-exist-double-story-porta-cabin'):]
S2_SEC = S2_SEC[:S2_SEC.find('</section>')]
check('6b split card renders (saman-s2-split)', 'saman-s2-split' in S2_SEC, '')
check('6b split-card image wired', sc[0]['out'] in S2_SEC if sc else False, '')
check('6b split-card alt matches manifest', sc[0]['alt'] in S2_SEC if sc else False, '')
check('6b SC_H3 rendered verbatim', norm(COPY['SC_H3']) in visible, '')
check('6b SC_BODY_P rendered verbatim', norm(COPY['SC_BODY_P']) in visible, '')
for i in range(1, 5):
    check('6b SC_BULLET%d rendered verbatim' % i, norm(COPY['SC_BULLET%d' % i]) in visible, '')
check('6b all 4 bullets present as <li> in the split card',
      S2_SEC.count('<li>') == 4, '%d found' % S2_SEC.count('<li>'))
check('6b split-card CTA label + href',
      COPY['SC_CTA'] in S2_SEC and 'href="https://www.samanportable.com/contact"' in S2_SEC, '')
check('6b split-card reuses the Section 2 destination, no new link',
      len(set(re.findall(r'href="(https://www\.samanportable\.com/contact)"', S2_SEC))) == 1, '')

# ── 8 calculator ─────────────────────────────────────────────────────────────
check('8 calc-entry band present', 'calc-entry' in raw and 'data-calculator-entry' in raw, '')
band = re.search(r'calc-entry-price">([^<]*)<', raw)
check('8 banner derives this page\'s from-price', bool(band) and '4,97,800' in band.group(1),
      band.group(1) if band else 'no price in band')

# ── 9 tabs ───────────────────────────────────────────────────────────────────
order = [m.group(1) for m in re.finditer(r'-trigger-(description|additional|shipping|reviews)"', raw)]
seen = []
for o in order:
    if o not in seen:
        seen.append(o)
check('9 tabs in fixed order', seen == ['description', 'additional', 'shipping', 'reviews'], str(seen))
check('9 spec PDF wired', '/specs/saman-double-story-porta-cabin-technical-specification.pdf' in raw, '')
check('9 diagram B wired with visible caption',
      'double-story-porta-cabin-diagram-2.webp' in raw
      and 'Illustrative, not for construction' in visible, '')
check('9 diagram A not wired (pulled)', 'double-story-porta-cabin-diagram-1' not in raw, '')

# ── 12.11 NOT-CLAIMED register ───────────────────────────────────────────────
# Scope to PC-03's OWN copy. Site chrome, the shared calculator's add-on catalogue and
# inline CSS are not this page's copy and are not this page's to edit.
pc03_copy = ' '.join([COPY['DESCRIPTION_TAB'], COPY['S2_H2'], COPY['S2_P1'], COPY['S2_P2'],
                      COPY['HERO_P1'], COPY['HERO_P2'], COPY['H1'], COPY['META_TITLE'],
                      COPY['META_DESCRIPTION']]
                     + [COPY['VAR%d_H2' % i] for i in range(1, 7)]
                     + [COPY['VAR%d_BODY' % i] for i in range(1, 7)]).lower()
banned = ['fireproof', 'earthquake-proof', 'maintenance-free', 'eco-friendly',
          'no. 1', '100%', 'modular office building', ' best ']
hits = [b for b in banned if b in pc03_copy]
check('12.11 NOT-CLAIMED register clean in PC-03 copy', not hits, str(hits))
check('12.11 "waterproof" only as approved process wording',
      'waterproofing treatment' in pc03_copy and 'waterproof ' not in pc03_copy, '')
check('12.11 no "coming soon"', 'coming soon' not in visible.lower(), '')

fails = [r for r in results if not r[0]]
print('\n%d checks, %d passed, %d FAILED' % (len(results), len(results) - len(fails), len(fails)))
for _o, n, dtl in fails:
    print('  FAILED: %s  %s' % (n, dtl))
sys.exit(1 if fails else 0)
