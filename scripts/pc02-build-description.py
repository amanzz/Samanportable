# -*- coding: utf-8 -*-
"""Renders the approved PC-02 Description tab markdown to the descriptionHtml string.

The markdown file is the checksum-verified artefact (DESC_TAB b0e5f88a2000372e). This
script only changes markup, never words: every transformation below is structural, and
pc02-verify.py re-extracts the visible text from the generated HTML and diffs it back
against this source to prove that."""
import hashlib
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = io.open(os.path.join(HERE, 'pc02-description.md'), encoding='utf-8', newline='').read()

DESC_TAB_SHA = 'b0e5f88a2000372e'
got = hashlib.sha256(SRC.encode('utf-8')).hexdigest()[:16]
if got != DESC_TAB_SHA:
    sys.exit('DESC_TAB checksum drift: %s != %s' % (got, DESC_TAB_SHA))

IMG_DIR = '/images/products/gi-porta-cabin/description/'

# Section 6 link map, rows 3 and 4 (the only two anchors inside the Description tab).
LINKS = {
    'PUF porta cabin': 'https://www.samanportable.com/product/porta-cabins/puf-porta-cabin',
    'porta cabins range': 'https://www.samanportable.com/product/porta-cabins',
}


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def inline(t):
    """Escape, then resolve the approved [anchor] brackets. Anchor text is the bracket
    content unchanged; an unmapped bracket is a hard error, never a silent passthrough."""
    out = esc(t)

    def sub(m):
        label = m.group(1)
        if label not in LINKS:
            raise SystemExit('unmapped link anchor: [%s]' % label)
        return '<a href="%s">%s</a>' % (LINKS[label], label)

    return re.sub(r'\[([^\]\|]+)\]', sub, out)


lines = SRC.split('\n')
html = []
i = 0
n_img = n_table = n_list = n_faq = n_h2 = n_p = 0

while i < len(lines):
    line = lines[i].rstrip()

    if not line.strip():
        i += 1
        continue

    # heading
    if line.startswith('## '):
        html.append('<h2>%s</h2>' % esc(line[3:].strip()))
        n_h2 += 1
        i += 1
        continue

    # image marker  [IMAGE n: file | alt]
    m = re.match(r'^\[IMAGE\s+\d+:\s*([^|]+?)\s*\|\s*(.+?)\]$', line)
    if m:
        fn, alt = m.group(1).strip(), m.group(2).strip()
        html.append(
            '<img src="%s%s" width="1280" height="720" loading="lazy" alt="%s">'
            % (IMG_DIR, fn, esc(alt))
        )
        n_img += 1
        i += 1
        continue

    # table
    if line.startswith('|'):
        head = [c.strip() for c in line.strip('|').split('|')]
        i += 2  # skip the |---| separator
        body = []
        while i < len(lines) and lines[i].startswith('|'):
            body.append([c.strip() for c in lines[i].strip('|').split('|')])
            i += 1
        html.append(
            '<table class="saman-table"><thead><tr>'
            + ''.join('<th>%s</th>' % inline(c) for c in head)
            + '</tr></thead><tbody>'
            + ''.join('<tr>' + ''.join('<td>%s</td>' % inline(c) for c in r) + '</tr>' for r in body)
            + '</tbody></table>'
        )
        n_table += 1
        continue

    # bullet list
    if line.startswith('- '):
        items = []
        while i < len(lines) and lines[i].startswith('- '):
            items.append(lines[i][2:].strip())
            i += 1
        html.append('<ul>' + ''.join('<li>%s</li>' % inline(x) for x in items) + '</ul>')
        n_list += 1
        continue

    # FAQ pair: **Question**  then the answer on the next line
    m = re.match(r'^\*\*(.+?)\*\*$', line)
    if m:
        q = m.group(1)
        a = lines[i + 1].strip()
        html.append('<p><strong>%s</strong> %s</p>' % (inline(q), inline(a)))
        n_faq += 1
        i += 2
        continue

    # paragraph
    html.append('<p>%s</p>' % inline(line.strip()))
    n_p += 1
    i += 1

out = ''.join(html)

if '—' in out:
    sys.exit('em dash (U+2014) present in generated description HTML')

json.dump({'descriptionHtml': out}, open(os.path.join(HERE, 'pc02-description.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

print('h2=%d  p=%d  faq=%d  img=%d  table=%d  list=%d' % (n_h2, n_p, n_faq, n_img, n_table, n_list))
print('anchors: %d' % out.count('<a href='))
print('chars: %d' % len(out))
print('em dashes: 0')
