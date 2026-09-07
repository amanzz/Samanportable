#!/usr/bin/env python3
"""SCH-02: build the Explore the Range / You may also like tile metadata.

Nothing here is authored. Every tile reads the DESTINATION'S OWN product JSON:
its `productName` is the tile title and its first approved gallery image is the
tile image. Run it after scripts/sch02-probe-link-status.py and before
scripts/sch02-generate-page-data.py, so a sibling that goes live joins the panel
and a sibling whose gallery moves is picked up automatically.

The hub's seoAnchorMap entry is deliberately NOT used as the anchor: it reads
"Container House", which build ticket v2 section 3 forbids as an anchor on this
page. `productName` gives "Container Houses", which is not on that list.
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = "/product/container-houses"
SELF = CH + "/shipping-container-homes"

status = json.load(open(os.path.join(REPO, "scripts", "sch02-link-status.json"),
                        encoding="utf-8"))

meta = {}
skipped = []
for href, row in status["results"].items():
    if href == SELF:
        skipped.append((href, "this page"))
        continue
    if row.get("status") != 200:
        skipped.append((href, "status %s" % row.get("status")))
        continue
    slug = href.rstrip("/").split("/")[-1]
    path = os.path.join(REPO, "src", "data", "products", "%s.json" % slug)
    if not os.path.exists(path):
        skipped.append((href, "no product JSON"))
        continue
    d = json.load(open(path, encoding="utf-8"))
    images = (d.get("variants") or [{}])[0].get("images") or d.get("galleryImages") or []
    if not images:
        skipped.append((href, "no gallery image"))
        continue
    name = d.get("productName") or d.get("h1")
    meta[href] = {
        "title": name,
        "href": href,
        "category": "Container Houses",
        "blurb": "Explore %s" % name,
        "imageSrc": images[0]["src"],
        "imageAlt": images[0]["alt"],
    }

dest = os.path.join(REPO, "scripts", "sch02-tile-meta.json")
with open(dest, "w", encoding="utf-8", newline="\n") as fh:
    json.dump({"_source": "each destination's own src/data/products/<slug>.json: "
                          "productName as the tile title, first approved gallery image "
                          "as the tile image. Built by scripts/sch02-build-tile-meta.py "
                          "from scripts/sch02-link-status.json.",
               "tiles": meta}, fh, indent=2, ensure_ascii=False)
    fh.write("\n")

print("wrote", dest)
for href, v in meta.items():
    print("  200  %-52s %s" % (v["title"], v["imageSrc"]))
for href, why in skipped:
    print("  --   %-52s %s" % (href, why))
