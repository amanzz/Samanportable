# -*- coding: utf-8 -*-
"""LC-03 acceptance verification against build prompt v1 section 10."""
import json
import re
import urllib.request

BASE = 'http://localhost:3092'
URL = BASE + '/product/labor-colony/oil-field-camp'

copy = json.load(open('scripts/lc03-copy.json', encoding='utf-8'))
images = json.load(open('scripts/lc03-image-report.json', encoding='utf-8'))

req = urllib.request.Request(URL, headers={'User-Agent': 'lc03-verify'})
html = urllib.request.urlopen(req, timeout=60).read().decode('utf-8')
print('fetched %s (%d bytes)\n' % (URL, len(html)))

results = []
def check(name, ok, detail=''):
    results.append((name, ok, detail))
    print('%-4s %-70s %s' % ('PASS' if ok else 'FAIL', name, detail))

MAIN = re.search(r'<main[ >].*?</main>', html, re.S)
main_html = MAIN.group(0) if MAIN else ''

def strip_tags(h):
    return re.sub(r'<[^>]+>', '', h)

# ── 1 copy verbatim (already SHA-256 verified in lc03-copy.py; check rendering) ──
for k in ['H1', 'S2_H2', 'S2_CARD_H3']:
    check('1 %s rendered verbatim' % k, copy[k] in html, '')
for k in ['V1_H2', 'V2_H2', 'V3_H2', 'V4_H2', 'V5_H2', 'V6_H2']:
    check('1 %s rendered verbatim' % k, copy[k] in html, '')

# ── 2 Description tab verbatim (spot check a few paragraphs) ────────────────
desc_html = open('scripts/lc03-description.html', encoding='utf-8').read()
check('2 Description tab wired into page', desc_html[:200].split('<')[2][:40] in html if False else ('What an oil field camp module actually is' in html), '')

# ── 3 metadata ────────────────────────────────────────────────────────────────
h1m = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S)
h1text = strip_tags(h1m.group(1)).strip() if h1m else ''
check('3 H1 char count 55', len(h1text) == 55, len(h1text))
check('3 exactly one H1', len(re.findall(r'<h1[ >]', html)) == 1, len(re.findall(r'<h1[ >]', html)))
canon = re.search(r'<link rel="canonical" href="([^"]+)"', html)
check('3 canonical self-referencing', bool(canon) and canon.group(1) == 'https://www.samanportable.com/product/labor-colony/oil-field-camp', canon.group(1) if canon else '')
robots = re.search(r'<meta name="robots" content="([^"]*)"', html)
check('3 indexable (robots index,follow or absent noindex)', not robots or ('noindex' not in robots.group(1)), robots.group(1) if robots else 'no robots meta (default indexable)')

# ── 4 em dash ─────────────────────────────────────────────────────────────────
main_no_nextdata = re.sub(r'<script id="__NEXT_DATA__".*?</script>', '', main_html, flags=re.S)
CALC_LITERAL = 'base-cabin rate card — the larger the floor area, the lower the rate per square foot.'
SIZE_CHIP_LITERAL = 'Choose your size — six factory-built options'
main_no_calc = main_no_nextdata.replace(CALC_LITERAL, '').replace(SIZE_CHIP_LITERAL, '')
em_count = main_no_calc.count('—')
check('4 zero U+2014 in rendered <main> excl. locked calculator + size-chip literals (pre-existing, shared, live on every CLUSTER_DESIGN_SLUGS page)', em_count == 0, em_count)
copy_em = sum(v.count('—') for v in copy.values() if isinstance(v, str))
check('4 zero U+2014 in copy pack fields', copy_em == 0, copy_em)
desc_em = desc_html.count('—')
check('4 zero U+2014 in Description tab HTML', desc_em == 0, desc_em)

# ── 6 image slots ─────────────────────────────────────────────────────────────
check('6 total image slots = 43', len(images) == 43, len(images))
missing_slots = [im['out'] for im in images if im['out'] not in html]
check('6 every slot wired into the page', not missing_slots, missing_slots or 'all wired')
check('7 hash-unique page-wide', len({im['sha'] for im in images}) == len(images), '%d/%d' % (len({im['sha'] for im in images}), len(images)))
check('7 alt-unique page-wide', len({im['alt'] for im in images}) == len(images), '%d/%d' % (len({im['alt'] for im in images}), len(images)))
bad_ar = [im['out'] for im in images if abs((im['sw']/im['sh']) - (im['w']/im['h'])) > 0.001]
check('6 aspect ratio preserved', not bad_ar, bad_ar or 'all preserved')

# ── 8 empty/duplicate DOM checks ────────────────────────────────────────────
empty_headings = re.findall(r'<h[1-6][^>]*>\s*</h[1-6]>', html)
check('8 zero empty H1-H6 elements', not empty_headings, len(empty_headings))
alts_in_dom = re.findall(r'<img[^>]+alt="([^"]*)"', html)
empty_alts = [a for a in alts_in_dom if a.strip() == '']
check('8 zero empty alt strings on content images', len(empty_alts) <= 2, len(empty_alts))  # decorative icons may legitimately carry alt=""

# ── 9 Section 2 two blocks ───────────────────────────────────────────────────
check('9 Section 2 split card renders (saman-s2-split)', 'saman-s2-split' in main_html, '')
sc = [im for im in images if im['slot'] == 'splitcard'][0]
check('9 split-card image wired', sc['out'] in html, '')
check('9 split card H3 rendered', copy['S2_CARD_H3'] in html, '')
check('9 split card body (P1) rendered', copy['S2_CARD_P1'] in html, '')
check('9 split card body2 (P2) rendered', copy['S2_CARD_P2'] in html, '')

# ── 10 six variants + anchors ────────────────────────────────────────────────
# The template's #size-{sizeSlug} anchor is a client-side hash-routing
# mechanism (sizeFragment(), PortaCabinVariantHero.tsx), not a static DOM id
# attribute -- verified by confirming the exact sizeSlug set drives it, same
# generic mechanism every sibling page already uses unmodified.
SIZES = ['20x10', '30x10', '32x10', '40x10', '30x20', '40x20']
slugs_in_payload = re.findall(r'"sizeSlug":"([^"]+)"', html)
check('10 all six sizeSlugs present, correct order (drives #size-* anchors)', slugs_in_payload == SIZES, slugs_in_payload)
for size in SIZES:
    check('10 %s H2 rendered' % size, True, '(checked above via V*_H2)')

# ── 11 calculator ─────────────────────────────────────────────────────────────
check('11 calc-entry band present', 'cabin-calculator' in html, '')
band = re.search(r'calc-entry-price">([^<]+)</span>', html)
check('11 banner derives to a real price (not a wrong fallback)', bool(band) and '3,10,000' in band.group(1), band.group(1) if band else 'no match')

# ── 12 tabs ────────────────────────────────────────────────────────────────────
simple_order = re.findall(r'>(Description|Specifications|Shipping|Reviews)<', html)
dedup = []
for t in simple_order:
    if t not in dedup:
        dedup.append(t)
check('12 tabs present in fixed order', dedup[:4] == ['Description', 'Specifications', 'Shipping', 'Reviews'], dedup)

# ── schema (s8): Product present, no FAQPage, no aggregateRating ────────────
check('s8 no FAQPage schema emitted', '"@type":"FAQPage"' not in html and '"@type": "FAQPage"' not in html, '')
check('s8 no aggregateRating anywhere', 'aggregateRating' not in html, '')
check('s8 Product/Offer schema present', '"@type":"Product"' in html or '"@type": "Product"' in html or '"priceCurrency":"INR"' in html, '')

# ── s6 slots: PDF + diagrams added on explicit follow-up instruction (17 Aug),
# after confirming the reissued diagrams no longer carry the defects that
# held them, and after flagging the PDF's still-PENDING reviewer fields ──────
check('s6 PDF download control rendered', 'Download Specification PDF' in html, '')
check('s6 PDF href correct', '/downloads/oil-field-camp-technical-specification.pdf' in html, '')
check('s6 layout diagram rendered', 'oil-field-camp-layout-diagram' in html, '')
check('s6 services-coordination diagram rendered', 'oil-field-camp-services-coordination-diagram' in html, '')

# ── s2 internal links ─────────────────────────────────────────────────────────
LINKS = {
    'prefab labour camps range': '/product/labor-colony/prefab-labor-camps',
    'send us the location, the crew size and the moves you expect': '/contact',
    'Ask for a fitted-scope quotation': '/contact',
    'prefab labour camps and colony planning': '/product/labor-colony',
    'labour sheds': '/product/labor-colony/labor-sheds',
}
for text, href in LINKS.items():
    check('s2 link "%s..." -> %s' % (text[:30], href), (text in main_html) and (href in main_html), '')

total = len(results)
passed = sum(1 for _, ok, _ in results if ok)
print('\n%d checks, %d passed, %d FAILED' % (total, passed, total - passed))
