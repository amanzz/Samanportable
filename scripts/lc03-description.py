# -*- coding: utf-8 -*-
"""Convert LC-03-DESCRIPTION-TAB-exact.md to the Description tab HTML.
#### -> h2, ##### -> h3. [IMAGE n] markers replaced with the manifest's <img>.
Bold whole-line FAQ questions -> h4/strong, followed answer paragraph -> p."""
import json
import re

SRC = r"D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)/Drafts/LC-03-DESCRIPTION-TAB-exact.md"

IMAGES = {
    1: ("/images/products/oil-field-camp/description/oil-field-camp-main-context.webp",
        "Oil field camp module on a remote location with a drilling rig in the distance"),
    2: ("/images/products/oil-field-camp/description/oil-field-camp-price-selection.webp",
        "Two oil field camp modules of different lengths on the same gravel pad"),
    3: ("/images/products/oil-field-camp/description/oil-field-camp-wide-body-interior.webp",
        "Wide-body oil field camp module interior with bunk frames along both walls and a central aisle"),
    4: ("/images/products/oil-field-camp/description/oil-field-camp-skid-and-lifting-detail.webp",
        "Steel skid chassis of an oil field camp module with runner beam and marked corner lifting lug"),
    5: ("/images/products/oil-field-camp/description/oil-field-camp-two-modules-on-site.webp",
        "Two oil field camp modules placed apart on one location showing access between them"),
    6: ("/images/products/oil-field-camp/description/oil-field-camp-layout-understanding.webp",
        "Oil field camp module with external service connections at a remote site"),
}

def esc(s):
    return s

def inline(s):
    # bold
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    # links [text](url)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    return s

def img_tag(n):
    src, alt = IMAGES[n]
    return '<img src="%s" width="1600" height="900" loading="lazy" alt="%s">' % (src, alt)

text = open(SRC, encoding="utf-8").read()
# strip everything up to and including the first "---" separator (title/companion-file/measured-count preamble)
parts = text.split("\n---\n", 1)
body = parts[1] if len(parts) > 1 else text
# also drop a trailing "---" if present at the very end
body = re.sub(r"\n---\s*$", "", body.strip())

lines = body.split("\n")
html_parts = []
i = 0
in_table = False
table_rows = []
in_list = False

def flush_table():
    global table_rows
    if not table_rows:
        return
    header, sep, *rows = table_rows
    heads = [c.strip() for c in header.strip("|").split("|")]
    html_parts.append("<table><thead><tr>" + "".join("<th>%s</th>" % inline(h) for h in heads) + "</tr></thead><tbody>")
    for r in rows:
        cells = [c.strip() for c in r.strip("|").split("|")]
        html_parts.append("<tr>" + "".join("<td>%s</td>" % inline(c) for c in cells) + "</tr>")
    html_parts.append("</tbody></table>")
    table_rows = []

while i < len(lines):
    line = lines[i].rstrip()
    stripped = line.strip()

    if stripped == "":
        if in_list:
            html_parts.append("</ul>")
            in_list = False
        i += 1
        continue

    m_img = re.match(r"^\[IMAGE (\d)\]$", stripped)
    if m_img:
        html_parts.append(img_tag(int(m_img.group(1))))
        i += 1
        continue

    if stripped.startswith("##### "):
        html_parts.append("<h3>%s</h3>" % inline(stripped[6:].strip()))
        i += 1
        continue
    if stripped.startswith("#### "):
        html_parts.append("<h2>%s</h2>" % inline(stripped[5:].strip()))
        i += 1
        continue

    if stripped.startswith("|"):
        table_rows.append(stripped)
        i += 1
        continue
    else:
        if table_rows:
            flush_table()

    if stripped.startswith("*") and stripped.endswith("*") and not stripped.startswith("**"):
        html_parts.append("<p><em>%s</em></p>" % inline(stripped.strip("*")))
        i += 1
        continue

    if stripped.startswith("- "):
        if not in_list:
            html_parts.append("<ul>")
            in_list = True
        html_parts.append("<li>%s</li>" % inline(stripped[2:].strip()))
        i += 1
        continue
    else:
        if in_list:
            html_parts.append("</ul>")
            in_list = False

    # FAQ whole-line bold question, e.g. **Can the module be towed between locations?**
    # (ends in "?" -- distinguishes it from bold group-labels like "**Included in
    # the shell rate:**", which end in ":" and are followed by a bullet list.)
    m_q = re.match(r"^\*\*(.+\?)\*\*$", stripped)
    if m_q:
        html_parts.append("<h4><strong>%s</strong></h4>" % inline(m_q.group(1)))
        i += 1
        continue

    # plain paragraph
    html_parts.append("<p>%s</p>" % inline(stripped))
    i += 1

if in_list:
    html_parts.append("</ul>")
if table_rows:
    flush_table()

html = "".join(html_parts)
open("scripts/lc03-description.html", "w", encoding="utf-8").write(html)

# stats
h2 = len(re.findall(r"<h2>", html))
h3 = len(re.findall(r"<h3>", html))
h4 = len(re.findall(r"<h4>", html))
imgs = len(re.findall(r"<img ", html))
links = len(re.findall(r"<a href", html))
print("h2:", h2, "h3:", h3, "h4 (FAQ):", h4, "imgs:", imgs, "links:", links)
print("em-dash count:", html.count("\u2014"))
print("length:", len(html))
