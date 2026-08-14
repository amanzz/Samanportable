# -*- coding: utf-8 -*-
"""Section 2 copy, owner-supplied 14 Aug 2026 (draft v4). Checksums computed here so the
owner can record them; the ticket supplied none."""
import hashlib
import io
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

H2 = "When a GI Porta Cabin Outperforms Painted Steel on Real-World Sites"

P1 = ("A GI porta cabin should be selected for the conditions it will face—not simply out of "
      "habit. On coastal sites within roughly 500 metres of the sea, beside cooling towers, inside "
      "persistently humid facilities, or near chemical storage areas, ordinary painted steel can "
      "deteriorate much sooner than expected. Once corrosion begins, repeated surface preparation "
      "and repainting add maintenance costs, disrupt operations, and reduce the cabin’s service life.")

P2 = ("A galvanized iron porta cabin offers stronger, longer-lasting corrosion protection. Its zinc "
      "coating acts sacrificially, meaning that even when the surface is scratched during transport, "
      "lifting, or daily site use, the surrounding zinc corrodes before the steel underneath. This "
      "makes a GI portable cabin a practical choice for coastal projects, industrial plants, "
      "construction sites, and other demanding environments where moisture and corrosive exposure "
      "cannot be avoided.")

P3 = ("For dry, inland locations, an MS porta cabin can often deliver the same reliable performance "
      "at a lower initial cost. Its IS 2062 structural frame can support the same platform electrics, "
      "quality checks, and office functions required for a dependable portable site office.")

P4 = ("Compare both options, then send us your site pin, exposure conditions, intended use, and "
      "preferred headcount. Our engineering team will recommend the right cabin specification and "
      "provide a fixed quotation within 48 hours.")

CTA = "Get a GI porta cabin quote"

FIELDS = [('S2_H2', H2), ('S2_P1', P1), ('S2_P2', P2), ('S2_P3', P3), ('S2_P4', P4), ('S2_CTA', CTA)]


def sha16(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()[:16]


if __name__ == '__main__':
    print('%-8s %-18s %5s  %s' % ('FIELD', 'SHA-256 (16)', 'CHARS', 'FLAGS'))
    for name, text in FIELDS:
        flags = []
        if '—' in text:
            flags.append('EM DASH x%d' % text.count('—'))
        if '’' in text:
            flags.append('curly apostrophe')
        if '–' in text:
            flags.append('en dash')
        print('%-8s %-18s %5d  %s' % (name, sha16(text), len(text), ', '.join(flags) or '-'))

    total_em = sum(t.count('—') for _n, t in FIELDS)
    print('\nTOTAL EM DASHES IN SUPPLIED COPY: %d' % total_em)
    json.dump({n: [sha16(t), t] for n, t in FIELDS},
              io.open(os.path.join(HERE, 'pc02-s2-v4.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
