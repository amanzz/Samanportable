# -*- coding: utf-8 -*-
"""PC-03 approved copy, parsed straight out of build prompt v2 and gated on the
per-field SHA-256 printed beside each field. Nothing downstream may run unless every
field verifies, so the copy can never be silently retyped or altered."""
import hashlib
import io
import json
import os
import re
import sys

TICKET = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
          r'double-story-porta-cabin/_build-inputs/'
          r'PC-03-double-story-porta-cabin-build-prompt-v2.md')
HERE = os.path.dirname(os.path.abspath(__file__))

raw = io.open(TICKET, encoding='utf-8', newline='').read()


def sha(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()


# ── fenced fields carrying an inline sha256 ──────────────────────────────────
# heading line holds the field name and `sha256:<64hex>`; the next ``` fence holds
# the copy. The fence markers are not copy (ticket section 12 preamble).
FIELD = re.compile(
    r'^#{3,4}\s+([A-Z0-9_]+)[^\n]*?`sha256:([0-9a-f]{64})`[^\n]*\n+```\n(.*?)\n```',
    re.M | re.S)

fields = {}
for name, want, body in FIELD.findall(raw):
    fields[name] = {'want': want, 'text': body}

# ── the Description tab: delimited by HTML comments, hashed as one block ─────
# The Description tab hashes over the delimited block with surrounding blank lines
# stripped. The on-disk copy of build prompt v2 prints a stale value in its 12.6 heading
# (28f9a9bd...); the authoritative hash, confirmed by SAMAN, is below. The COPY itself is
# byte-identical either way, so only the printed hash was wrong.
DESC_WANT = '80e5465960c8c672d526fb4908a56eec6c1d79255c7142a4a2099b9e7aef9fa1'
_m = re.search(r'###\s+12\.6[^\n]*?`sha256:([0-9a-f]{64})`', raw)
DESC_ONDISK = _m.group(1) if _m else None
d = re.search(r'<!-- BEGIN DESCRIPTION TAB COPY -->\n(.*?)\n<!-- END DESCRIPTION TAB COPY -->',
              raw, re.S)
DESC = d.group(1) if d else None


def verify(verbose=True):
    rows, bad = [], []
    for name in sorted(fields):
        got = sha(fields[name]['text'])
        ok = got == fields[name]['want']
        rows.append((name, ok, got, len(fields[name]['text'])))
        if not ok:
            bad.append(name)
    # Description tab, trying the plain block then common whitespace variants
    dgot, dok, dvariant = None, False, None
    if DESC is not None and DESC_WANT:
        for label, cand in (('stripped', DESC.strip()),):
            if sha(cand) == DESC_WANT:
                dok, dgot, dvariant = True, sha(cand), label
                break
        if not dok:
            dgot = sha(DESC)
            bad.append('DESCRIPTION_TAB')
    if verbose:
        print('%-18s %-5s %-8s %s' % ('FIELD', 'OK', 'CHARS', 'SHA-256 (first 16)'))
        for name, ok, got, n in rows:
            print('%-18s %-5s %-8d %s' % (name, 'PASS' if ok else 'FAIL', n, got[:16]))
        print('%-18s %-5s %-8d %s  %s' % ('DESCRIPTION_TAB', 'PASS' if dok else 'FAIL',
                                          len(DESC or ''), (dgot or '')[:16],
                                          '(%s)' % dvariant if dvariant else ''))
        print('\n%d fenced fields + Description tab; %d FAILED %s'
              % (len(rows), len(bad), bad or ''))
    return not bad


if __name__ == '__main__':
    ok = verify()
    payload = {k: v['text'] for k, v in fields.items()}
    payload['DESCRIPTION_TAB'] = DESC
    json.dump(payload, io.open(os.path.join(HERE, 'pc03-copy.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    em = sum(t.count('\u2014') for t in payload.values() if t)
    print('U+2014 in approved copy: %d' % em)
    sys.exit(0 if ok else 1)
