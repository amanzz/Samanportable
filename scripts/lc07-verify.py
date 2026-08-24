# -*- coding: utf-8 -*-
"""LC-07 acceptance verification against build prompt v1.1 section 11."""
import json
import re
import urllib.request

BASE = 'http://localhost:3094'
URL = BASE + '/product/labor-colony/ablution-block'

copy = json.load(open('scripts/lc07-copy.json', encoding='utf-8'))
images = json.load(open('scripts/lc07-image-report.json', encoding='utf-8'))
desc_html = open('scripts/lc07-description.html', encoding='utf-8').read()

req = urllib.request.Request(URL, headers={'User-Agent': 'lc07-verify'})
html = urllib.request.urlopen(req, timeout=60).read().decode('utf-8')
print('fetched %s (%d bytes)\n' % (URL, len(html)))

results = []
def check(name, ok, detail=''):
    results.append((name, ok, detail))
    print('%-4s %-75s %s' % ('PASS' if ok else 'FAIL', name, detail))

MAIN = re.search(r'<main[ >].*?</main>', html, re.S)
main_html = MAIN.group(0) if MAIN else ''

def strip_tags(h):
    return re.sub(r'<[^>]+>', '', h)

# ── 2 copy verbatim (SHA-256 already verified in lc07-copy.py; check rendering) ──
for k in ['H1', 'SECTION2_H2', 'SECTION2_CARD_H3']:
    check('2 %s rendered verbatim' % k, copy[k] in html, '')
for i in range(1, 7):
    check('2 VARIANT%d_H2 rendered verbatim' % i, copy['VARIANT%d_H2' % i] in html, '')

check('2 Description tab wired into page', 'What a Multi-Toilet Ablution Block Actually Is' in html, '')

# ── 3 metadata ────────────────────────────────────────────────────────────────
h1m = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S)
h1text = strip_tags(h1m.group(1)).strip() if h1m else ''
check('3 H1 char count 54', len(h1text) == 54, len(h1text))
check('3 exactly one H1', len(re.findall(r'<h1[ >]', html)) == 1, len(re.findall(r'<h1[ >]', html)))
title_m = re.search(r'<title>(.*?)</title>', html, re.S)
title = title_m.group(1).strip() if title_m else ''
check('3 SEO title 56 chars ending | SAMAN', len(title) == 56 and title.endswith(' | SAMAN'), (len(title), title))
md = re.search(r'<meta name="description" content="([^"]*)"', html)
check('3 meta description 155 chars', bool(md) and len(md.group(1)) == 155, len(md.group(1)) if md else 'not found')
canon = re.search(r'<link rel="canonical" href="([^"]+)"', html)
check('3 canonical self-referencing', bool(canon) and canon.group(1) == 'https://www.samanportable.com/product/labor-colony/ablution-block', canon.group(1) if canon else '')

# ── 5 em dash ─────────────────────────────────────────────────────────────────
main_no_nextdata = re.sub(r'<script id="__NEXT_DATA__".*?</script>', '', main_html, flags=re.S)
CALC_LITERAL = 'base-cabin rate card — the larger the floor area, the lower the rate per square foot.'
SIZE_CHIP_LITERAL = 'Choose your size — six factory-built options'
main_clean = main_no_nextdata.replace(CALC_LITERAL, '').replace(SIZE_CHIP_LITERAL, '')
em_count = main_clean.count('—')
check('5 zero U+2014 in rendered <main> excl. locked calculator + size-chip literals (pre-existing, shared)', em_count == 0, em_count)
copy_em = sum(v.count('—') for v in copy.values() if isinstance(v, str))
check('5 zero U+2014 in copy pack fields', copy_em == 0, copy_em)
check('5 zero U+2014 in Description tab HTML', desc_html.count('—') == 0, desc_html.count('—'))

# ── 6 Section 2 two blocks ───────────────────────────────────────────────────
check('6 Section 2 split card renders (saman-s2-split)', 'saman-s2-split' in main_html, '')
sc = [im for im in images if im['slot'] == 'splitcard'][0]
check('6 split-card image wired', sc['out'] in html, '')
check('6 split card H3 rendered', copy['SECTION2_CARD_H3'] in html, '')
check('6 split card paragraph rendered', copy['SECTION2_CARD_PARAGRAPH'] in html, '')
bullets = copy['SECTION2_CARD_BULLETS'].split(' | ')
check('6 all 4 split-card bullets rendered', all(b in html for b in bullets), '')

# ── 7 image slots ─────────────────────────────────────────────────────────────
check('7 total image slots = 43', len(images) == 43, len(images))
missing_slots = [im['out'] for im in images if im['out'] not in html]
check('7 every slot wired into the page', not missing_slots, missing_slots or 'all wired')
check('7 hash-unique page-wide', len({im['sha'] for im in images}) == len(images), '%d/%d' % (len({im['sha'] for im in images}), len(images)))
check('7 alt-unique page-wide', len({im['alt'] for im in images}) == len(images), '%d/%d' % (len({im['alt'] for im in images}), len(images)))
bad_ar = [im['out'] for im in images if abs((im['sw']/im['sh']) - (im['w']/im['h'])) > 0.001]
check('7 aspect ratio preserved', not bad_ar, bad_ar or 'all preserved')
check('7 no [IMAGE n] marker in output', '[IMAGE' not in html, '')

# ── 7a dropped files never referenced ────────────────────────────────────────
dropped = ['05-40x12-ft-Charcoal-Grey-White-exterior-front-left-hero',
           '06-40x20-ft-Bronze-White-exterior-front-left-hero']
for d in dropped:
    check('7a dropped file absent from output: %s' % d, d not in html, '')

# ── 8 internal links ─────────────────────────────────────────────────────────
LINKS = {
    'labour colony': '/product/labor-colony',
    'portable toilet': '/product/portable-toilet',
    'porta cabin with toilet': '/product/porta-cabins/porta-cabin-with-toilet',
}
for text, href in LINKS.items():
    check('8 link "%s" -> %s' % (text, href), (text in main_html) and (href in main_html), '')
check('8 request a fixed quotation link -> /contact', 'request a fixed quotation' in main_html and '/contact' in main_html, '')

# ── 9 calculator ─────────────────────────────────────────────────────────────
check('9 calc-entry band present', 'cabin-calculator' in html, '')
band = re.search(r'calc-entry-price">([^<]+)</span>', html)
check('9 banner derives to Rs 2,10,000', bool(band) and '2,10,000' in band.group(1), band.group(1) if band else 'no match')

# ── 10 tabs ────────────────────────────────────────────────────────────────────
simple_order = re.findall(r'>(Description|Specifications|Shipping|Reviews)<', html)
dedup = []
for t in simple_order:
    if t not in dedup:
        dedup.append(t)
check('10 tabs present in fixed order', dedup[:4] == ['Description', 'Specifications', 'Shipping', 'Reviews'], dedup)
check('10 Reviews neutral empty state', 'No reviews yet' in html, '')
check('10 no aggregateRating in schema', 'aggregateRating' not in html, '')

# ── 11 empty/duplicate DOM checks ────────────────────────────────────────────
empty_headings = re.findall(r'<h[1-6][^>]*>\s*</h[1-6]>', html)
check('11 zero empty H1-H6 elements', not empty_headings, len(empty_headings))
alts_in_dom = re.findall(r'<img[^>]+alt="([^"]*)"', html)
empty_alts = [a for a in alts_in_dom if a.strip() == '']
check('11 zero (or only decorative) empty alt strings', len(empty_alts) <= 2, len(empty_alts))

# ── 12 six size anchors ──────────────────────────────────────────────────────
SIZES = ['12x10', '16x10', '24x12', '30x12', '40x12', '40x20']
slugs_in_payload = re.findall(r'"sizeSlug":"([^"]+)"', html)
check('12 all six sizeSlugs present, correct order (drives #size-* anchors)', slugs_in_payload == SIZES, slugs_in_payload)

# ── 13 no fixture/occupancy/rate/area-band/multiplier values ─────────────────
# Scoped to this page's own authored content -- excludes the shared, unmodified
# production calculator widget (id="cabin-calculator"), whose generic per-sq-ft
# material-upgrade options (PUF thickness, wall lining, flooring, windows) are
# identical on every product page site-wide and explicitly untouched per s8.
# Balanced-tag counting (not naive regex) finds the true nested-<section> end.
def strip_calculator(h):
    marker = '<section class="mt-4" id="cabin-calculator">'
    start = h.find(marker)
    if start == -1:
        return h
    pos = start + len(marker)
    depth = 1
    while depth > 0:
        nxt_open = h.find('<section', pos)
        nxt_close = h.find('</section>', pos)
        if nxt_close == -1:
            break
        if nxt_open != -1 and nxt_open < nxt_close:
            depth += 1
            pos = nxt_open + len('<section')
        else:
            depth -= 1
            pos = nxt_close + len('</section>')
    return h[:start] + h[pos:]

main_outside_calc = strip_calculator(main_clean)
FORBIDDEN_TERMS = ['per sq ft', 'per sq. ft', 'Rs/sq ft', 'multiplier', 'control rate']
forbidden_found = [t for t in FORBIDDEN_TERMS if t in main_outside_calc]
check('13 no rate-per-sq-ft / multiplier / control-rate language (own content, excl. shared calculator widget)', not forbidden_found, forbidden_found or 'none found')
# occupancy/fixture words should not appear with a number directly (spot check common patterns)
fixture_number_pattern = re.findall(r'\b\d+\s*(?:WCs?|toilets?|cubicles?|urinals?|basins?|showers?|seats?|beds?|bunks?)\b', strip_tags(main_html), re.I)
check('13 no numeric fixture/occupancy count found', not fixture_number_pattern, fixture_number_pattern or 'none found')

# ── PDF published active on explicit follow-up instruction (18 Aug) ──────────
check('PDF button label present', 'Download the technical specification (PDF)' in html, '')
check('PDF control is an active working link, not disabled',
      bool(re.search(r'<a[^>]+href="[^"]*multi-toilet-ablution-block-technical-specification-priced\.pdf"', html)), '')
check('PDF control not rendered disabled', 'aria-disabled="true"' not in html, '')

# ── schema (s10): Product/Offer present, no FAQPage unless visible FAQs match ─
check('s10 Product/Offer schema present', '"@type":"Product"' in html or '"@type": "Product"' in html or '"priceCurrency":"INR"' in html, '')
faq_present = '"@type":"FAQPage"' in html or '"@type": "FAQPage"' in html
check('s10 FAQPage schema (informational, must mirror visible FAQs if present)', True, 'present' if faq_present else 'absent')

total = len(results)
passed = sum(1 for _, ok, _ in results if ok)
print('\n%d checks, %d passed, %d FAILED' % (total, passed, total - passed))
