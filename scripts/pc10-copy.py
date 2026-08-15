# -*- coding: utf-8 -*-
"""PC-10 approved copy, parsed straight out of the copy pack and gated on the
per-field SHA-256 printed in its checksum index. Nothing downstream may run unless
every field verifies, so the copy can never be silently retyped or altered."""
import hashlib
import io
import json
import os
import re
import sys

PACK = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
        r'porta-cabin-shop/PC-10-porta-cabin-shop-copy-pack-v1.md')
HERE = os.path.dirname(os.path.abspath(__file__))

raw = io.open(PACK, encoding='utf-8', newline='').read()


def sha16(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()[:16]


# ── checksum index ────────────────────────────────────────────────────────────
IDX = re.compile(r'^\| `([A-Za-z0-9_]+)` \| (\d[\d,]*) \| `([0-9a-f]{16})` \|$', re.M)
index = {}
for name, chars, h in IDX.findall(raw):
    index[name] = {'chars': int(chars.replace(',', '')), 'want': h}

fields = {}

# ── simple fields: "### NAME" then "*N characters * `hash`*" then a fenced block.
# The connector must stop at any heading line (### or ##), not just at the fence,
# or a field with no fenced block of its own (SECTION2_CARD_IMAGE, a GAP) lets the
# match run on and steal the NEXT field's body under the wrong name.
SIMPLE = re.compile(
    r'^### ([A-Za-z0-9_]+)\s*\n+'
    r'(?:(?!#{2,4}[ \t])[^\n]*\n+)*?'
    r'\*[\d,]+ characters?[^\n`]*`([0-9a-f]{16})`\*\s*\n+'
    r'```(?:text|markdown)?\n(.*?)\n```',
    re.M | re.S)
for name, h, body in SIMPLE.findall(raw):
    if name in index:
        fields[name] = body

# ── bold-style fields: "**NAME** - N characters ... `hash`" then a fenced block.
# Used only by the six VARIANT_*_H2 / VARIANT_*_BODY pairs.
BOLD = re.compile(
    r'\*\*([A-Za-z0-9_]+)\*\*[^\n`]*`([0-9a-f]{16})`\s*\n+'
    r'```(?:text|markdown)?\n(.*?)\n```',
    re.M | re.S)
for name, h, body in BOLD.findall(raw):
    if name in index:
        fields[name] = body

# ── numbered bullet fields under SECTION2_CARD_BULLETS ───────────────────────
bullets_block = re.search(
    r'### SECTION2_CARD_BULLETS\s*\n.*?\n(?=### SECTION2_CARD_CTA_TEXT)', raw, re.S)
if bullets_block:
    BULLET = re.compile(
        r'^\d+\. `([0-9a-f]{16})` \(\d+ chars?\)\s*\n+```text\n(.*?)\n```',
        re.M | re.S)
    bnames = ['SECTION2_CARD_BULLET_1', 'SECTION2_CARD_BULLET_2',
              'SECTION2_CARD_BULLET_3', 'SECTION2_CARD_BULLET_4']
    for (h, body), name in zip(BULLET.findall(bullets_block.group(0)), bnames):
        fields[name] = body

# ── DESCRIPTION_TAB: no "### " heading of its own, lives under the Tab 1 section
# heading as a fenced ```markdown block. Hashed as the fenced content, stripped.
m = re.search(r'## 5\. Section 5 Tab 1 - Description.*?```markdown\n(.*?)\n```', raw, re.S)
if m:
    fields['DESCRIPTION_TAB'] = m.group(1)

# ── SPEC_TABLE_1 / SPEC_TABLE_2: raw markdown table text under their headings ─
for name, start_pat, end_pat in [
    ('SPEC_TABLE_1', r'### SPEC_TABLE_1[^\n]*\n+\*[^\n]*\*\s*\n+', r'\n\n### SPEC_TABLE_2'),
    ('SPEC_TABLE_2', r'### SPEC_TABLE_2[^\n]*\n+\*[^\n]*\*\s*\n+', r'\n\n---'),
]:
    m = re.search(start_pat + r'(.*?)' + end_pat, raw, re.S)
    if m:
        fields[name] = m.group(1).strip()


def verify(verbose=True):
    rows, bad = [], []
    for name in sorted(index):
        if name not in fields:
            rows.append((name, False, None, 0))
            bad.append(name)
            continue
        got = sha16(fields[name])
        ok = got == index[name]['want']
        rows.append((name, ok, got, len(fields[name])))
        if not ok:
            bad.append(name)
    if verbose:
        print('%-26s %-5s %-8s %-8s %s' % ('FIELD', 'OK', 'CHARS', 'WANT', 'GOT'))
        for name, ok, got, n in rows:
            print('%-26s %-5s %-8d %-8s %s' % (name, 'PASS' if ok else 'FAIL', n,
                                                index[name]['want'], got or '(missing)'))
        print('\n%d indexed fields; %d FAILED %s' % (len(rows), len(bad), bad or ''))
    return not bad


if __name__ == '__main__':
    ok = verify()
    json.dump(fields, io.open(os.path.join(HERE, 'pc10-copy.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    em = sum(t.count('\u2014') for t in fields.values() if t)
    print('U+2014 in approved copy: %d' % em)
    sys.exit(0 if ok else 1)
