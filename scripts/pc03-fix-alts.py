# -*- coding: utf-8 -*-
"""Applies the 10 alt corrections SAMAN supplied on 15 Aug 2026 (post-build correction
2) to the on-disk ticket, matched by each row's unique source filename so there is no
ambiguity. Nothing else in section 8.1 changes."""
import io

TICKET = (r'D:/Project-shekhar/all-product-images/Hub Page (Porta Cabins)/'
          r'double-story-porta-cabin/_build-inputs/'
          r'PC-03-double-story-porta-cabin-build-prompt-v2.md')

FIXES = {
    '20x10-ivory-double-storey-porta-cabin-07-ground-floor-interior.png':
        'Ground floor interior of the 20x10 ft double storey porta cabin with panel walls, sliding windows and vinyl floor',
    '20x10-ivory-double-storey-porta-cabin-09-upper-floor-interior.png':
        'Upper floor interior of the 20x10 ft double storey porta cabin with strip lighting and balcony access door',
    '30x10-cobalt-double-storey-porta-cabin-07-ground-floor-interior.png':
        'Ground floor interior of the 30x10 ft double storey porta cabin with panel walls, sliding windows and vinyl floor',
    '30x10-cobalt-double-storey-porta-cabin-09-upper-floor-interior.png':
        'Upper floor interior of the 30x10 ft double storey porta cabin with strip lighting and balcony access door',
    '20x20-charcoal-double-storey-porta-cabin-07-ground-floor-interior.png':
        'Ground floor interior of the 20x20 ft double storey porta cabin with panel walls, sliding windows and vinyl floor',
    '20x20-charcoal-double-storey-porta-cabin-09-upper-floor-interior.png':
        'Upper floor interior of the 20x20 ft double storey porta cabin with strip lighting and balcony access door',
    '40x10-terracotta-double-storey-porta-cabin-07-ground-floor-interior.png':
        'Ground floor interior of the 40x10 ft double storey porta cabin with panel walls, sliding windows and vinyl floor',
    '40x10-terracotta-double-storey-porta-cabin-09-upper-floor-interior.png':
        'Upper floor interior of the 40x10 ft double storey porta cabin with strip lighting and balcony access door',
    '30x20-forest-double-storey-porta-cabin-07-ground-floor-interior.png':
        'Ground floor interior of the 30x20 ft double storey porta cabin with panel walls, sliding windows and vinyl floor',
    '30x20-forest-double-storey-porta-cabin-09-upper-floor-interior.png':
        'Upper floor interior of the 30x20 ft double storey porta cabin with strip lighting and balcony access door',
}

raw = io.open(TICKET, encoding='utf-8', newline='').read()
lines = raw.split('\n')
applied = []
for i, line in enumerate(lines):
    if not line.startswith('|'):
        continue
    for srcfile, newalt in FIXES.items():
        if srcfile in line:
            cells = line.split('|')
            old_alt = cells[-2].strip()
            if old_alt == newalt:
                applied.append((srcfile, 'already correct'))
                continue
            cells[-2] = ' ' + newalt + ' '
            lines[i] = '|'.join(cells)
            applied.append((srcfile, 'FIXED'))

out = '\n'.join(lines)
if out == raw:
    print('NO CHANGE MADE - investigate')
else:
    io.open(TICKET, 'w', encoding='utf-8', newline='').write(out)
print('%d/%d rows processed' % (len(applied), len(FIXES)))
for s, r in applied:
    print(' ', r, s)
