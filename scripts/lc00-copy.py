# -*- coding: utf-8 -*-
"""LC-00 approved copy, parsed straight out of the build prompt and gated on the
per-field SHA-256 (full 64-hex) printed beside each field. Nothing downstream may
run unless every field verifies, so the copy can never be silently retyped."""
import hashlib
import io
import json
import os
import re
import sys

TICKET = (r'D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)/'
          r'Drafts/LC-00-labour-colony-hub-build-prompt-v1.md')
HERE = os.path.dirname(os.path.abspath(__file__))

raw = io.open(TICKET, encoding='utf-8', newline='').read()


def sha(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()


fields = {}

# ── metadata table (section 2): pipe-row with 16-hex short hash ──────────────
META = re.compile(
    r'^\| ([A-Za-z0-9 /]+) \| `([^`]+)` \| `([0-9a-f]{16})` \|$', re.M)
meta_rows = META.findall(raw)

# Named fields are handled explicitly below, section by section, since most
# headings carry the field name rather than the hash line itself.

# Section 3.2 has H2/P1/P2 each with their own "**X** - SHA-256 `hash`" line.
S32 = re.search(r'### 3\.2.*?### 3\.3', raw, re.S).group(0)
S33 = re.search(r'### 3\.3.*?### 3\.4', raw, re.S).group(0)

def extract(block, label):
    m = re.search(re.escape('**%s**' % label) + r'[^\n]*SHA-256 `([0-9a-f]{64})`\s*\n+```\n(.*?)\n```',
                   block, re.S)
    if not m:
        raise SystemExit('field not found: %s' % label)
    return m.group(1), m.group(2)

# metadata table fields
META_MAP = {
    'Visible H1': 'H1',
    'SEO / meta title': 'SEO_TITLE',
    'Meta description': 'META_DESCRIPTION',
}
for label, value, h16 in meta_rows:
    label = label.strip()
    if label in META_MAP:
        fields[META_MAP[label]] = {'want16': h16, 'text': value}

# 3.1 hero short description
m = re.search(r'### 3\.1[^\n]*\n+SHA-256 `([0-9a-f]{64})`\s*\n+```\n(.*?)\n```', raw, re.S)
fields['HERO_SHORT_DESCRIPTION'] = {'want': m.group(1), 'text': m.group(2)}

# 3.2 section 2 top block
h, t = extract(S32, 'H2')
fields['SECTION2_H2'] = {'want': h, 'text': t}
h, t = extract(S32, 'Paragraph 1')
fields['SECTION2_P1'] = {'want': h, 'text': t}
h, t = extract(S32, 'Paragraph 2')
fields['SECTION2_P2'] = {'want': h, 'text': t}

# 3.3 split card
h, t = extract(S33, 'H3')
fields['SECTION2_CARD_H3'] = {'want': h, 'text': t}
h, t = extract(S33, 'Paragraph')
fields['SECTION2_CARD_PARAGRAPH'] = {'want': h, 'text': t}

BULLET = re.compile(
    r'^\d+\. `([^`]+)`\s*\n\s*SHA-256 `([0-9a-f]{64})`', re.M)
bullets = BULLET.findall(S33)
for i, (text, h) in enumerate(bullets, start=1):
    fields['SECTION2_CARD_BULLET_%d' % i] = {'want': h, 'text': text}

# 3.4 six variants
VARIANT_SLUGS = ['60x24-gplus1', '90x24-gplus1', '90x24-gplus2',
                  '120x24-gplus1', '118x30-gplus1', '120x24-gplus2']
S34 = re.search(r'### 3\.4.*?### 3\.5', raw, re.S).group(0)
variant_blocks = re.split(r'#### Variant \d+', S34)[1:]
assert len(variant_blocks) == 6, len(variant_blocks)
for slug, vb in zip(VARIANT_SLUGS, variant_blocks):
    h, t = extract(vb, 'H2')
    fields['VARIANT_%s_H2' % slug] = {'want': h, 'text': t}
    h, t = extract(vb, 'Body')
    fields['VARIANT_%s_BODY' % slug] = {'want': h, 'text': t}

# 3.5 description tab (fenced ```markdown block, hash stated separately)
m = re.search(r'### 3\.5.*?SHA-256 of the whole block: `([0-9a-f]{64})`.*?```markdown\n(.*?)\n```',
               raw, re.S)
fields['DESCRIPTION_TAB'] = {'want': m.group(1), 'text': m.group(2)}

# 3.6 spec narrative + two tables (no individual hash given; not gated)
m = re.search(r'\*\*Narrative paragraph\*\*[^\n]*\n+```\n(.*?)\n```', raw, re.S)
fields['SPEC_NARRATIVE'] = {'want': None, 'text': m.group(1)}


def verify(verbose=True):
    bad = []
    rows = []
    for name in sorted(fields):
        f = fields[name]
        if 'want16' in f:
            got = sha(f['text'])[:16]
            ok = got == f['want16']
        elif f['want'] is None:
            got, ok = '(unhashed)', True
        else:
            got = sha(f['text'])
            ok = got == f['want']
        rows.append((name, ok, len(f['text'])))
        if not ok:
            bad.append(name)
    if verbose:
        print('%-30s %-5s %-6s' % ('FIELD', 'OK', 'CHARS'))
        for name, ok, n in rows:
            print('%-30s %-5s %-6d' % (name, 'PASS' if ok else 'FAIL', n))
        print('\n%d fields; %d FAILED %s' % (len(rows), len(bad), bad or ''))
    return not bad


if __name__ == '__main__':
    ok = verify()
    payload = {k: v['text'] for k, v in fields.items()}
    json.dump(payload, io.open(os.path.join(HERE, 'lc00-copy.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    em = sum(t.count('\u2014') for t in payload.values() if t)
    print('U+2014 in approved copy: %d' % em)
    sys.exit(0 if ok else 1)
