# -*- coding: utf-8 -*-
"""Convert lc07-description-raw.md to the Description tab HTML.
## -> h2 (this doc has no h3 sub-level). [IMAGE n] markers replaced with the
manifest's <img>. Bold whole-line FAQ questions -> h4/strong."""
import re

IMAGES = {
    1: ("/images/products/ablution-block/description/ablution-block-site-installed-block.webp",
        "Ablution block connected and in service on a working project site"),
    2: ("/images/products/ablution-block/description/ablution-block-single-vs-double-loaded.webp",
        "A 10 ft deep single-loaded block beside a 12 ft deep double-loaded block for comparison"),
    3: ("/images/products/ablution-block/description/ablution-block-cubicle-bank-and-wash-run.webp",
        "Interior circulation route with the cubicle bank on one side and the wash run opposite"),
    4: ("/images/products/ablution-block/description/ablution-block-service-riser-access-panel.webp",
        "Open service riser showing pipework, isolation valves and the removable access panel"),
}

def inline(s):
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    return s

def img_tag(n):
    src, alt = IMAGES[n]
    return '<img src="%s" width="1600" height="900" loading="lazy" alt="%s">' % (src, alt)

text = open("scripts/lc07-description-raw.md", encoding="utf-8").read().rstrip("\n")
lines = text.split("\n")
html_parts = []
i = 0
in_list = False

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

    if stripped.startswith("## "):
        html_parts.append("<h2>%s</h2>" % inline(stripped[3:].strip()))
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

    # FAQ whole-line bold question (ends in "?")
    m_q = re.match(r"^\*\*(.+\?)\*\*$", stripped)
    if m_q:
        html_parts.append("<h4><strong>%s</strong></h4>" % inline(m_q.group(1)))
        i += 1
        continue

    # bold group-label lines (e.g. "**Included in the published block price**")
    html_parts.append("<p>%s</p>" % inline(stripped))
    i += 1

if in_list:
    html_parts.append("</ul>")

html = "".join(html_parts)
open("scripts/lc07-description.html", "w", encoding="utf-8").write(html)

h2 = len(re.findall(r"<h2>", html))
h4 = len(re.findall(r"<h4>", html))
imgs = len(re.findall(r"<img ", html))
links = len(re.findall(r"<a href", html))
print("h2:", h2, "h4 (FAQ):", h4, "imgs:", imgs, "links:", links)
print("em-dash count:", html.count("—"))
print("length:", len(html))
print("[IMAGE marker survives]:", "[IMAGE" in html)
