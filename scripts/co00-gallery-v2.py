# -*- coding: utf-8 -*-
"""CO-00 v2 gallery rebuild: 36 images, six per size, ONE consistent
colourway per size tab (draft v2.0 / build-prompt v1.0 section 5.1).
Replaces the earlier mixed-colourway 36-image set. Source: 1254x1254 JPG,
1:1, RGB from the new asset pack's size-* folders. Encoded 800x800 WebP,
quality-stepped to a <=130KB ceiling (measured range in the ticket is
21-134KB, budget 150-250KB)."""
import hashlib
import json
import os
from PIL import Image

SRC_ROOT = r"D:/Project-shekhar/all-product-images/Hub page (Container Offices)/container-offices"
OUT_ROOT = r"C:/tmp/saman-co00/public/images/products/container-offices"

# (size, [ (src_relpath, out_name, alt) x6 ]) -- exact mapping from build prompt v1.0 section 5.1
SELECTIONS = {
    "10x10": [
        ("size-10x10/10x10-container-office-exterior-front-view.jpg",
         "co-00-container-office-10x10-midnight-navy-main-exterior.webp",
         "Midnight navy 10x10 ft container office, three-quarter view with door and window, glazed office building behind"),
        ("size-10x10/10x10-container-office-exterior-side-view.jpg",
         "co-00-container-office-10x10-midnight-navy-second-exterior.webp",
         "Midnight navy 10x10 ft container office standing on grass with trees behind, door and window on the near face"),
        ("size-10x10/10x10-container-office-exterior-door-side-view.jpg",
         "co-00-container-office-10x10-midnight-navy-long-elevation.webp",
         "Flat front elevation of a midnight navy 10x10 ft container office with a centred door and corner castings"),
        ("size-10x10/10x10-container-office-exterior-corner-view.jpg",
         "co-00-container-office-10x10-midnight-navy-site-context.webp",
         "Midnight navy 10x10 ft container office on bare ground at a construction site with a tower crane behind"),
        ("size-10x10/10x10-container-office-interior-desk-seating-view.jpg",
         "co-00-container-office-10x10-midnight-navy-interior-main.webp",
         "Interior of a 10x10 ft container office with white desks, mesh chairs, overhead cabinets and two windows"),
        ("size-10x10/10x10-container-office-interior-office-layout.jpg",
         "co-00-container-office-10x10-midnight-navy-interior-second.webp",
         "Interior of a 10x10 ft container office showing a corner desk run, storage pedestals and wall cabinets"),
    ],
    "20x8": [
        ("size-20x8/20x8-container-office-exterior-front-left-view.jpg",
         "co-00-container-office-20x8-graphite-charcoal-main-exterior.webp",
         "Graphite charcoal 20x8 ft container office, three-quarter view with a central door between two windows"),
        ("size-20x8/20x8-container-office-exterior-corner-view.jpg",
         "co-00-container-office-20x8-graphite-charcoal-second-exterior.webp",
         "Graphite charcoal 20x8 ft container office seen from the corner, two windows on the long wall, trees behind"),
        ("size-20x8/20x8-container-office-exterior-front-view.jpg",
         "co-00-container-office-20x8-graphite-charcoal-long-elevation.webp",
         "Front elevation of a graphite charcoal 20x8 ft container office with double doors between two windows"),
        ("size-20x8/20x8-container-office-exterior-front-angle-view.jpg",
         "co-00-container-office-20x8-graphite-charcoal-site-context.webp",
         "Graphite charcoal 20x8 ft container office on gravel with a solar panel array in the background"),
        ("size-20x8/20x8-container-office-interior-furnished-workspace-view.jpg",
         "co-00-container-office-20x8-graphite-charcoal-interior-main.webp",
         "Interior of a 20x8 ft container office with a continuous desk run, three chairs and overhead cabinets"),
        ("size-20x8/20x8-container-office-interior-workstation-angle-view.jpg",
         "co-00-container-office-20x8-graphite-charcoal-interior-second.webp",
         "Angled interior view of a 20x8 ft container office showing monitors, pedestals and a window above the desk"),
    ],
    "20x10": [
        ("size-20x10/20x10-container-office-green-exterior-front-angle.jpg",
         "co-00-container-office-20x10-deep-forest-green-main-exterior.webp",
         "Deep forest green 20x10 ft container office, three-quarter view with a central door and three windows"),
        ("size-20x10/20x10-portable-container-office-landscaped-exterior.jpg",
         "co-00-container-office-20x10-deep-forest-green-second-exterior.webp",
         "Deep forest green 20x10 ft container office in landscaped grounds with planting and hills behind"),
        ("size-20x10/20x10-container-office-cabin-front-elevation.jpg",
         "co-00-container-office-20x10-deep-forest-green-long-elevation.webp",
         "Front elevation of a deep forest green 20x10 ft container office with a central door and two windows"),
        ("size-20x10/20x10-prefabricated-container-office-corner-view.jpg",
         "co-00-container-office-20x10-deep-forest-green-site-context.webp",
         "Deep forest green 20x10 ft container office on a paved courtyard, corner view with three windows"),
        ("size-20x10/20x10-container-office-interior-workstation-layout.jpg",
         "co-00-container-office-20x10-deep-forest-green-interior-main.webp",
         "Interior of a 20x10 ft container office with desks along both walls and a clear central aisle"),
        ("size-20x10/20x10-furnished-container-office-interior-layout.jpg",
         "co-00-container-office-20x10-deep-forest-green-interior-second.webp",
         "Interior of a 20x10 ft container office looking toward the end door, with desks and cabinets each side"),
    ],
    "30x10": [
        ("size-30x10/30x10-container-office-orange-exterior-front-view.jpg",
         "co-00-container-office-30x10-burnt-terracotta-main-exterior.webp",
         "Burnt terracotta 30x10 ft container office, three-quarter view with a door and two windows on the long wall"),
        ("size-30x10/30x10-portable-container-office-side-angle-view.jpg",
         "co-00-container-office-30x10-burnt-terracotta-second-exterior.webp",
         "Burnt terracotta 30x10 ft container office standing on red earth with trees behind"),
        ("size-30x10/30x10-container-office-cabin-front-elevation-view.jpg",
         "co-00-container-office-30x10-burnt-terracotta-long-elevation.webp",
         "Long side elevation of a burnt terracotta 30x10 ft container office with an end door and two windows"),
        ("size-30x10/30x10-modular-office-container-long-side-elevation.jpg",
         "co-00-container-office-30x10-burnt-terracotta-site-context.webp",
         "Burnt terracotta 30x10 ft container office showing the full long wall with five windows, buildings behind"),
        ("size-30x10/30x10-container-office-interior-workstation-row.jpg",
         "co-00-container-office-30x10-burnt-terracotta-interior-main.webp",
         "Interior of a 30x10 ft container office with two long desk rows facing a central aisle"),
        ("size-30x10/30x10-furnished-container-office-interior-aisle-view.jpg",
         "co-00-container-office-30x10-burnt-terracotta-interior-second.webp",
         "Interior of a 30x10 ft container office looking along the central aisle to the far door"),
    ],
    "40x8": [
        ("size-40x8/40x8-container-office-maroon-exterior-front-angle.jpg",
         "co-00-container-office-40x8-deep-burgundy-main-exterior.webp",
         "Deep burgundy 40x8 ft container office on gravel, three-quarter view with a door and four windows"),
        ("size-40x8/40x8-portable-container-office-side-perspective.jpg",
         "co-00-container-office-40x8-deep-burgundy-second-exterior.webp",
         "Deep burgundy 40x8 ft container office on gravel beneath a concrete overpass, windows along the long wall"),
        ("size-40x8/40x8-container-office-cabin-front-elevation.jpg",
         "co-00-container-office-40x8-deep-burgundy-long-elevation.webp",
         "Long side elevation of a deep burgundy 40x8 ft container office with an end door and three windows"),
        ("size-40x8/40x8-portable-office-container-exterior-roadside-view.jpg",
         "co-00-container-office-40x8-deep-burgundy-site-context.webp",
         "Deep burgundy 40x8 ft container office beside a road with an industrial shed and planting behind"),
        ("size-40x8/40x8-container-office-interior-workstation-corridor.jpg",
         "co-00-container-office-40x8-deep-burgundy-interior-main.webp",
         "Interior of a 40x8 ft container office with a single long desk run and chairs along one wall"),
        ("size-40x8/40x8-furnished-container-office-interior-manager-desk.jpg",
         "co-00-container-office-40x8-deep-burgundy-interior-second.webp",
         "Manager cabin inside a 40x8 ft container office with a desk, two guest chairs and windows on two walls"),
    ],
    "40x10": [
        ("size-40x10/40x10-container-office-white-exterior-front-angle.jpg",
         "co-00-container-office-40x10-pearl-white-main-exterior.webp",
         "Pearl white 40x10 ft container office on paving with palms behind, showing a door and five windows"),
        ("size-40x10/40x10-portable-container-office-landscape-side-view.jpg",
         "co-00-container-office-40x10-pearl-white-second-exterior.webp",
         "Pearl white 40x10 ft container office with high-rise construction and tower cranes in the background"),
        ("size-40x10/40x10-container-office-cabin-wide-exterior-view.jpg",
         "co-00-container-office-40x10-pearl-white-long-elevation.webp",
         "Pearl white 40x10 ft container office seen wide, with a door and four windows along the long wall"),
        ("size-40x10/40x10-portable-office-container-commercial-site-view.jpg",
         "co-00-container-office-40x10-pearl-white-site-context.webp",
         "Pearl white 40x10 ft container office beside a glass office building, windows along the full long wall"),
        ("size-40x10/40x10-container-office-interior-open-workstation-layout.jpg",
         "co-00-container-office-40x10-pearl-white-interior-main.webp",
         "Interior of a 40x10 ft container office with facing desk rows, monitors and overhead cabinets"),
        ("size-40x10/40x10-furnished-container-office-interior-manager-room.jpg",
         "co-00-container-office-40x10-pearl-white-interior-second.webp",
         "Manager cabin inside a 40x10 ft container office with a desk, two chairs and windows on both side walls"),
    ],
}

report = []
missing = []
for size, items in SELECTIONS.items():
    out_dir = os.path.join(OUT_ROOT, size)
    os.makedirs(out_dir, exist_ok=True)
    for src_rel, out_name, alt in items:
        src_path = os.path.join(SRC_ROOT, src_rel.replace("/", os.sep))
        if not os.path.isfile(src_path):
            missing.append((size, src_rel))
            continue
        out_path = os.path.join(out_dir, out_name)
        src_img = Image.open(src_path)
        sw, sh = src_img.size
        base = src_img.convert("RGB").resize((800, 800), Image.LANCZOS)
        quality = 82
        while True:
            base.save(out_path, "WEBP", quality=quality, method=6)
            kb = os.path.getsize(out_path) / 1024
            if kb <= 130 or quality <= 40:
                break
            quality -= 6
        out_img = Image.open(out_path)
        w, h = out_img.size
        sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
        rel_out = "/images/products/container-offices/" + os.path.relpath(out_path, OUT_ROOT).replace("\\", "/")
        report.append({"size": size, "src": src_path, "out": rel_out, "alt": alt,
                        "sw": sw, "sh": sh, "w": w, "h": h, "sha": sha,
                        "kb": round(os.path.getsize(out_path) / 1024, 1), "quality": quality})

print("missing sources:", len(missing))
for m in missing:
    print("  MISSING:", m)

print("total slots:", len(report))
hashes = [r["sha"] for r in report]
print("hash-unique:", len(set(hashes)), "/", len(hashes))
if len(set(hashes)) != len(hashes):
    seen = {}
    for r in report:
        seen.setdefault(r["sha"], []).append(r["out"])
    for h, outs in seen.items():
        if len(outs) > 1:
            print("  DUPLICATE HASH:", outs)

alts = [r["alt"] for r in report]
print("alt-unique:", len(set(alts)), "/", len(alts))
if len(set(alts)) != len(alts):
    seen = {}
    for r in report:
        seen.setdefault(r["alt"], []).append(r["out"])
    for a, outs in seen.items():
        if len(outs) > 1:
            print("  DUPLICATE ALT:", outs, "->", a)

for r in report:
    if (r["sw"], r["sh"]) != (1254, 1254):
        print("  SOURCE DIM WARNING:", r["out"], r["sw"], r["sh"])
    if (r["w"], r["h"]) != (800, 800):
        print("  OUTPUT DIM WARNING:", r["out"], r["w"], r["h"])

for size in SELECTIONS:
    n = sum(1 for r in report if r["size"] == size)
    print(size, "slots:", n)

kbs = [r["kb"] for r in report]
print("kb range:", min(kbs), "-", max(kbs), "avg:", round(sum(kbs) / len(kbs), 1))

json.dump(report, open("scripts/co00-gallery-v2-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nwrote scripts/co00-gallery-v2-report.json")
