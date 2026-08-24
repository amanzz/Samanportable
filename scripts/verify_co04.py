#!/usr/bin/env python3
"""CO-04 build verification. Usage: python3 scripts/verify_co04.py <preview-url>"""
import sys, re, json, html, hashlib, urllib.request
from urllib.parse import quote

URL = sys.argv[1]
PACK = json.load(open('container-offices/CO-04-copy-pack-v1.1.json', encoding='utf-8'))
F = PACK['fields']
fails = []

def fetch(u):
    req = urllib.request.Request(u, headers={'User-Agent': 'SAMAN-CO04-verify'})
    return urllib.request.urlopen(req, timeout=60)

raw = fetch(URL).read().decode('utf-8', 'ignore')
stripped = re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', raw)
text = html.unescape(re.sub(r'(?s)<[^>]+>', ' ', stripped))

def norm(s):
    s = html.unescape(s)
    for d in ('\u2013', '\u2014', '\u2012', '\u2015'):
        s = s.replace(d, '-')
    s = re.sub(r'(?<=\d)\s*(?:-|to)\s*(?=\d)', '-', s)
    return re.sub(r'\s+', ' ', s).strip()

ntext = norm(text)
alts = [norm(a) for a in re.findall(r'(?is)<img[^>]+alt="(.*?)"', raw)]
hrefs = [html.unescape(a) for a in re.findall(r'(?is)href="(.*?)"', raw)]

# 1. Copy pack integrity
for k, v in F.items():
    if hashlib.sha256(v.encode()).hexdigest() != PACK['sha256'][k]:
        fails.append('copy pack hash mismatch: ' + k)
manifest = hashlib.sha256(
    '\n'.join('%s:%s' % (k, PACK['sha256'][k]) for k in sorted(F)).encode()).hexdigest()
if manifest != PACK['manifest_sha256']:
    fails.append('copy pack manifest mismatch')

# 2. Every copy string present, checked in the right place
HEAD_ONLY = ('CANONICAL', 'SEO_TITLE', 'META_DESCRIPTION')
for k, v in F.items():
    if k in HEAD_ONLY:
        continue
    if k.endswith('_ALT'):
        if norm(v) not in alts:
            fails.append('alt string not rendered [%s]: %s' % (k, v[:60]))
        continue
    if k.endswith('_HREF'):
        if v not in hrefs and v.rstrip('/') not in [x.rstrip('/') for x in hrefs]:
            fails.append('href not rendered [%s]: %s' % (k, v))
        continue
    if k.endswith('_IMAGE'):
        continue
    if '_TABLE_' in k:
        for row in v.split('\n'):
            for cell in row.split('|'):
                cell = norm(cell)
                if cell and cell not in ntext:
                    fails.append('table cell missing [%s]: %s' % (k, cell[:60]))
        continue
    for piece in v.split('\n'):
        piece = norm(piece)
        if piece and piece not in ntext:
            fails.append('missing copy [%s]: %s' % (k, piece[:70]))

# 3. Head and H1
mt = re.search(r'(?is)<title[^>]*>(.*?)</title>', raw)
if not mt or norm(mt.group(1)) != norm(F['SEO_TITLE']):
    fails.append('title mismatch')
md = re.search(r'(?is)<meta[^>]+name="description"[^>]+content="(.*?)"', raw)
if not md or norm(md.group(1)) != norm(F['META_DESCRIPTION']):
    fails.append('meta description mismatch')
mc = re.search(r'(?is)<link[^>]+rel="canonical"[^>]+href="(.*?)"', raw)
if not mc or mc.group(1).rstrip('/') != F['CANONICAL'].rstrip('/'):
    fails.append('canonical mismatch')
h1 = re.findall(r'(?is)<h1[^>]*>(.*?)</h1>', raw)
if len(h1) != 1:
    fails.append('expected exactly 1 H1, found %d' % len(h1))
elif norm(re.sub(r'(?s)<[^>]+>', ' ', h1[0])) != norm(F['H1']):
    fails.append('H1 mismatch')
for tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
    for body in re.findall(r'(?is)<%s[^>]*>(.*?)</%s>' % (tag, tag), raw):
        if not re.sub(r'(?s)<[^>]+>', '', body).strip():
            fails.append('empty heading found: ' + tag)
            break

# 4. All four tab panels present, not only the active one
for label in ('Description', 'Specifications', 'Shipping', 'Reviews'):
    if label not in raw:
        fails.append('tab label missing: ' + label)

# 5. Shipping tab must carry the real freight component
for token in ('100', '1,000', 'ODC'):
    if token not in raw:
        fails.append('shipping freight token missing: ' + token)
if len(re.findall(r'(?i)\bkm\b', raw)) < 18:
    fails.append('fewer than 18 distance bands found in the shipping tab')

# 6. Assets
imgs = re.findall(r'(?is)<img[^>]+>', raw)
if len(imgs) < 50:
    fails.append('fewer than 50 img tags rendered: %d' % len(imgs))
if len(imgs) < 58:
    fails.append('fewer than 58 img tags rendered after nav tile image addition: %d' % len(imgs))
if any(not a.strip() for a in alts):
    fails.append('empty alt attribute found')
NAV_ALTS = {
    norm(v) for k, v in F.items()
    if k.endswith('_IMAGE_ALT') and (k.startswith('EXPLORE_TILE_') or k.startswith('YMAL_TILE_'))
}
for src_key in [k for k in F if k.startswith('EXPLORE_TILE_') and k.endswith('_IMAGE')] + [k for k in F if k.startswith('YMAL_TILE_') and k.endswith('_IMAGE')]:
    src = F[src_key]
    encoded_src = quote(src, safe='')
    if src not in raw and encoded_src not in raw:
        fails.append('nav tile image missing [%s]: %s' % (src_key, src))
for m in re.findall(r'(?is)<img[^>]+src="([^"]+)"', raw):
    src = html.unescape(m)
    if 'samanportable.com' in src and '/_next/image' not in src:
        fails.append('navigation tile served from an absolute host: ' + src[:100])
for k in sorted(k for k in F if k.endswith('_IMAGE') and k.startswith(('EXPLORE_TILE', 'YMAL_TILE'))):
    if F[k].startswith('http'):
        fails.append('copy pack image field is absolute, expected relative: ' + k)
dupes = sorted({a for a in alts if alts.count(a) > 1 and a.strip() and a not in NAV_ALTS})
if dupes:
    fails.append('duplicate non-navigation alt strings: %s' % dupes[:5])
for img in imgs:
    if 'width=' not in img or 'height=' not in img:
        fails.append('img without explicit width and height: ' + img[:80])
        break
if 'containerized-data-center' not in raw:
    fails.append('no containerized-data-center asset path found')
if re.search(r'containerized-data-center[^" ]*\.png[" ]', raw):
    fails.append('a source PNG is being served to the browser')

# 7. Forbidden strings
FORBIDDEN = ('available on request', 'Reference photographs', 'coming soon', 'contact us for',
             'DATA REQUIRED', 'lorem', 'TBD', 'placeholder')
for s in FORBIDDEN:
    if s.lower() in ntext.lower():
        fails.append('forbidden string on page: ' + s)
for ch, name in (('\u2014', 'em dash'), ('\u2013', 'en dash')):
    if ch in text:
        fails.append('%s found in page text' % name)

# 8. Unsourced commercial claims
for pat in (r'\d+\s*-\s*\d+\s*working days', r'lead time of', r'\d+\s*year warranty',
            r'warranty of \d+', r'24\s*x\s*7 support', r'free installation', r'Uptime Tier [IVX]'):
    if re.search(pat, ntext, re.I):
        fails.append('unsourced commercial claim matches: ' + pat)

# 9. Internal links, each 200, self-canonical, no redirect
LINKS = sorted({v for k, v in F.items() if k.endswith('_HREF')})
for u in LINKS:
    try:
        r = fetch(u)
        if r.status != 200:
            fails.append('link not 200: %s (%s)' % (u, r.status))
        if r.geturl().rstrip('/') != u.rstrip('/'):
            fails.append('link redirects: %s to %s' % (u, r.geturl()))
    except Exception as e:
        fails.append('link failed: %s (%s)' % (u, e))

BANNED = ('construction-site-office', 'container-site-office', 'modular-shipping-container-office',
          'portable-container-offices', 'prefabricated-container-office',
          'product-category/container-offices', 'bess-container', 'container-marketing-office',
          'multi-story-container-office', 'flat-pack-container-office', 'expandable-container-office')
for b in BANNED:
    if any(b in href for href in hrefs):
        fails.append('banned or non-200 destination linked: ' + b)

# 10. Schema
if 'aggregateRating' in raw or '"review"' in raw:
    fails.append('aggregateRating or review emitted on a page with no genuine reviews')

print('CO-04 verification against %s' % URL)
print('img tags: %d, alt strings: %d, unique alts: %d' % (len(imgs), len(alts), len(set(alts))))
print('copy fields checked: %d' % len(F))
if fails:
    print('FAIL, %d issue(s):' % len(fails))
    for f in fails:
        print('  -', f)
    sys.exit(1)
print('PASS')
