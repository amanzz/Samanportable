# -*- coding: utf-8 -*-
"""CO-00 gallery correction: 6 images per size (36 total), matching the
porta-cabins carousel model. Every source file opened and its content
verified directly (colours, doors, context) before selection -- filenames
were not trusted. Plain, factual visual-description alt text only, no
marketing copy. Slide 1 per size is that size's locked primary colourway.
No image reused across sizes or slots."""
import hashlib
import json
import os
from PIL import Image

GALLERY_ROOT = r"D:/Project-shekhar/all-product-images/Hub page (Container Offices)/container-offices"
OUT_ROOT = r"C:/tmp/saman-co00/public/images/products/container-offices"

# (size, [ (src_relpath, out_name, alt) x6 ])
SELECTIONS = {
    "10x10": [
        ("size-10x10/modular-container-office-10x10-cream-exterior.png",
         "co-00-container-office-10x10-cream-exterior.webp",
         "Cream 10x10 ft container office with a black base rail, one door and two sliding windows"),
        ("size-10x10/container-office-10x10-grey-blue-trim-exterior.png",
         "co-00-container-office-10x10-grey-navy-elevation.webp",
         "Grey 10x10 ft container office with a navy blue lower band, flat front elevation with one door and two windows"),
        ("size-10x10/portable-container-office-10x10-white-red-exterior.png",
         "co-00-container-office-10x10-white-maroon-exterior.webp",
         "White 10x10 ft container office with a maroon lower band, standing on a paved path lined with trees"),
        ("size-10x10/prefab-container-office-10x10-cyan-blue-exterior.png",
         "co-00-container-office-10x10-teal-exterior.webp",
         "Teal 10x10 ft container office on a paved plaza in front of a glazed commercial building"),
        ("size-10x10/container-office-10x10-interior-workspace.png",
         "co-00-container-office-10x10-interior-workspace.webp",
         "Interior of a 10x10 ft container office with a single desk, wall art and a storage cabinet"),
        ("size-10x10/modular-container-office-10x10-interior-desk-setup.png",
         "co-00-container-office-10x10-interior-desk-visitor-chairs.webp",
         "Desk with laptop and two visitor chairs inside a 10x10 ft container office, with a wall storage unit"),
    ],
    "20x8": [
        ("size-20x8/co-00-container-office-20x8-olive-mustard-exterior.png",
         "co-00-container-office-20x8-olive-mustard-exterior.webp",
         "Olive green 20x8 ft container office with a mustard lower band, steel support legs and a substation behind"),
        ("size-20x8/prefab-container-office-20x8-olive-green-yellow.png",
         "co-00-container-office-20x8-olive-khaki-elevated-view.webp",
         "Olive green and khaki 20x8 ft container office on steel support legs, elevated view in a plaza near a substation"),
        ("size-20x8/portable-container-office-20x8-dark-grey-exterior.png",
         "co-00-container-office-20x8-dark-grey-exterior.webp",
         "Dark grey 20x8 ft container office on steel support legs against a plain curved white wall"),
        ("size-20x8/container-office-20x8-red-white-trim-exterior.png",
         "co-00-container-office-20x8-oxide-red-elevation.webp",
         "Oxide red 20x8 ft container office, flat front elevation on a paved plaza with a reflecting pool behind"),
        ("size-20x8/co-00-container-office-20x8-interior-meeting-space.png",
         "co-00-container-office-20x8-interior-meeting-space.webp",
         "Desk and a round meeting table with two chairs inside a 20x8 ft container office, storage cabinet at the rear"),
        ("size-20x8/container-office-20x8-interior-workspace.png",
         "co-00-container-office-20x8-interior-corridor-desk.webp",
         "Long corridor interior of a 20x8 ft container office with a dark wood desk and wall cabinet at the far end"),
    ],
    "20x10": [
        ("size-20x10/container-office-20x10-light-blue-dark-green.png",
         "co-00-container-office-20x10-powder-blue-dark-green-exterior.webp",
         "Powder blue 20x10 ft container office with a dark green lower band and a warehouse behind it"),
        ("size-20x10/co-00-container-office-20x10-tan-charcoal-exterior.png",
         "co-00-container-office-20x10-tan-charcoal-exterior.webp",
         "Tan 20x10 ft container office with a charcoal lower band, parked in front of an industrial warehouse"),
        ("size-20x10/co-00-container-office-20x10-white-exterior.png",
         "co-00-container-office-20x10-white-exterior.webp",
         "White 20x10 ft container office with a black base rail, standing against a plain industrial wall"),
        ("size-20x10/shipping-container-office-20x10-dark-grey.png",
         "co-00-container-office-20x10-dark-grey-plaza.webp",
         "Dark grey 20x10 ft container office on a paved plaza in front of a curved glass-fronted building"),
        ("size-20x10/container-office-20x10-interior-workspace.png",
         "co-00-container-office-20x10-interior-desk-storage.webp",
         "Grey-toned interior of a 20x10 ft container office with an executive desk and a dark storage cabinet"),
        ("size-20x10/shipping-container-office-20x10-interior-meeting-space.png",
         "co-00-container-office-20x10-interior-two-desks.webp",
         "Two workstations inside a 20x10 ft container office with a sea view visible through the window"),
    ],
    "30x10": [
        ("size-30x10/modular-container-office-30x10-tan-brown-exterior.png",
         "co-00-container-office-30x10-mustard-tan-exterior.webp",
         "Mustard tan 30x10 ft container office with a black base rail, one door and four windows, arid hills behind"),
        ("size-30x10/co-00-container-office-30x10-dark-grey-exterior.png",
         "co-00-container-office-30x10-dark-grey-exterior.webp",
         "Dark grey 30x10 ft container office with three windows and one door, standing beside a rail yard"),
        ("size-30x10/co-00-container-office-30x10-oxide-red-exterior.png",
         "co-00-container-office-30x10-oxide-red-exterior.webp",
         "Oxide red 30x10 ft container office with four windows and one door, standing beside a rail yard"),
        ("size-30x10/portable-container-office-30x10-light-green-grey.png",
         "co-00-container-office-30x10-sage-green-charcoal-exterior.webp",
         "Sage green 30x10 ft container office with a charcoal lower band, gantry cranes visible in the background"),
        ("size-30x10/container-office-30x10-interior-workstations-setup.png",
         "co-00-container-office-30x10-interior-multi-desk.webp",
         "Multiple workstations with monitors inside a 30x10 ft container office, storage cabinets along the wall"),
        ("size-30x10/portable-container-office-30x10-interior-executive-desk.png",
         "co-00-container-office-30x10-interior-desk-meeting-zone.webp",
         "Executive desk in the foreground of a 30x10 ft container office with a four-seat meeting table beyond a partition"),
    ],
    "40x8": [
        ("size-40x8/co-00-container-office-40x8-light-grey-charcoal-exterior.png",
         "co-00-container-office-40x8-light-grey-charcoal-exterior.webp",
         "Light grey 40x8 ft container office with a charcoal lower band, six windows with white grilles and steel legs"),
        ("size-40x8/co-00-container-office-40x8-light-grey-charcoal-elevation.png",
         "co-00-container-office-40x8-light-grey-charcoal-elevation.webp",
         "Light grey 40x8 ft container office with a charcoal lower band, flat front elevation against a warehouse wall"),
        ("size-40x8/modular-container-office-40x8-white-dark-green.png",
         "co-00-container-office-40x8-white-dark-green-exterior.webp",
         "White 40x8 ft container office with a dark green lower band, on a paved courtyard beside a landscaped pond"),
        ("size-40x8/shipping-container-office-40x8-white-grey-exterior.png",
         "co-00-container-office-40x8-grey-charcoal-parking-lot.webp",
         "Light grey 40x8 ft container office with a charcoal lower band and barred windows, parked on an empty lot"),
        ("size-40x8/container-office-40x8-interior-hallway-workspace.png",
         "co-00-container-office-40x8-interior-long-corridor-desk.webp",
         "Long corridor interior of a 40x8 ft container office lined with windows on both sides, single desk at the far end"),
        ("size-40x8/container-office-40x8-interior-workstations-setup.png",
         "co-00-container-office-40x8-interior-partitioned-workstations.webp",
         "Blue-walled interior of a 40x8 ft container office with partitioned workstations and a printer station"),
    ],
    "40x10": [
        ("size-40x10/prefab-container-office-40x10-blue-side-view.png",
         "co-00-container-office-40x10-slate-blue-elevation.webp",
         "Slate blue 40x10 ft container office photographed as a flat side elevation against a plain warehouse wall"),
        ("size-40x10/co-00-container-office-40x10-slate-blue-exterior.png",
         "co-00-container-office-40x10-slate-blue-exterior.webp",
         "Slate blue 40x10 ft container office, three-quarter exterior view with five windows and one door"),
        ("size-40x10/co-00-container-office-40x10-cream-terracotta-exterior.png",
         "co-00-container-office-40x10-cream-terracotta-exterior.webp",
         "Cream 40x10 ft container office with a terracotta lower band, photographed inside a steel-framed warehouse"),
        ("size-40x10/modular-container-office-40x10-white-dark-green.png",
         "co-00-container-office-40x10-beige-dark-green-exterior.webp",
         "Beige 40x10 ft container office with a dark green lower band, on a paved plaza with bare trees behind"),
        ("size-40x10/modular-container-office-40x10-interior-layout.png",
         "co-00-container-office-40x10-interior-manager-desk-open-bay.webp",
         "Manager desk with a visitor chair in the foreground of a 40x10 ft container office, a second desk visible in the open bay beyond"),
        ("size-40x10/container-office-40x10-interior-workstations-setup.png",
         "co-00-container-office-40x10-interior-open-floor-desks.webp",
         "Dark wood-floored open bay inside a 40x10 ft container office with multiple desks and container units visible outside"),
    ],
}

report = []
missing = []
for size, items in SELECTIONS.items():
    out_dir = os.path.join(OUT_ROOT, size)
    os.makedirs(out_dir, exist_ok=True)
    for src_rel, out_name, alt in items:
        src_path = os.path.join(GALLERY_ROOT, src_rel.replace("/", os.sep))
        if not os.path.isfile(src_path):
            missing.append((size, src_rel))
            continue
        out_path = os.path.join(out_dir, out_name)
        src_img = Image.open(src_path)
        sw, sh = src_img.size
        base = src_img.convert("RGB")
        quality = 88
        while True:
            base.save(out_path, "WEBP", quality=quality, method=6)
            kb = os.path.getsize(out_path) / 1024
            if kb <= 120 or quality <= 40:
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

bad_dims = [r for r in report if (r["w"], r["h"]) != (1254, 1254)]
print("dimension mismatch (should be none):", bad_dims if bad_dims else "none")

for size in SELECTIONS:
    n = sum(1 for r in report if r["size"] == size)
    print(size, "slots:", n)

json.dump(report, open("scripts/co00-gallery-36-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nwrote scripts/co00-gallery-36-report.json")
