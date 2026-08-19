# -*- coding: utf-8 -*-
"""CO-00 image intake: 6 gallery + 1 split-card + 5 Description + 2 diagrams
= 14 slots. Convert to WebP, exact dimensions preserved (1254x1254 gallery,
1672x941 photos -- NOT 16:9 -- 1920x1080 diagrams)."""
import hashlib
import json
import os
from PIL import Image

GALLERY_ROOT = r"D:/Project-shekhar/all-product-images/Hub page (Container Offices)/container-offices"
DESC_ROOT = r"D:/Project-shekhar/all-product-images/Hub page (Container Offices)/Technical_PDFs_and_Diagrams_long_description_section_4_Images/CO-00-container-offices"
OUT_ROOT = r"C:/tmp/saman-co00/public/images/products/container-offices"

GALLERY = [
    ("10x10", "size-10x10/modular-container-office-10x10-cream-exterior.png",
     "co-00-container-office-10x10-cream-exterior.webp",
     "Cream 10x10 ft container office with a black base rail, one door and two sliding windows"),
    ("20x8", "size-20x8/prefab-container-office-20x8-olive-green-yellow.png",
     "co-00-container-office-20x8-olive-mustard-exterior.webp",
     "Olive green 20x8 ft container office with a mustard lower band, steel support legs and a substation behind"),
    ("20x10", "size-20x10/container-office-20x10-light-blue-dark-green.png",
     "co-00-container-office-20x10-powder-blue-dark-green-exterior.webp",
     "Powder blue 20x10 ft container office with a dark green lower band and a warehouse behind it"),
    ("30x10", "size-30x10/modular-container-office-30x10-tan-brown-exterior.png",
     "co-00-container-office-30x10-mustard-tan-exterior.webp",
     "Mustard tan 30x10 ft container office with a black base rail, one door and four windows, arid hills behind"),
    ("40x8", "size-40x8/shipping-container-office-40x8-white-grey-exterior.png",
     "co-00-container-office-40x8-light-grey-charcoal-exterior.webp",
     "Light grey 40x8 ft container office with a charcoal lower band, six windows with white grilles and steel legs"),
    ("40x10", "size-40x10/prefab-container-office-40x10-blue-side-view.png",
     "co-00-container-office-40x10-slate-blue-elevation.webp",
     "Slate blue 40x10 ft container office photographed as a flat side elevation against a plain warehouse wall"),
]

SPLITCARD = ("co-00-container-offices-ld01-range-comparison-line-16x9.png",
             "co-00-container-offices-ld01-range-comparison-line-16x9.webp",
             "Three container offices of increasing length standing on a gravel yard beside an industrial shed")

DESCRIPTION = [
    ("co-00-container-offices-ld03-40ft-workstation-manager-layout-16x9.png",
     "co-00-container-offices-ld03-40ft-workstation-manager-layout-16x9.webp",
     "Interior of a 40 ft container office with an open workstation bay and a glazed partitioned manager cabin"),
    ("co-00-container-offices-ld05-end-to-end-site-configuration-16x9.png",
     "co-00-container-offices-ld05-end-to-end-site-configuration-16x9.webp",
     "Two container offices joined end to end on levelling blocks with a shared timber deck and two entrance steps"),
    ("co-00-container-offices-ld04-corner-construction-detail-16x9.png",
     "co-00-container-offices-ld04-corner-construction-detail-16x9.webp",
     "Close view of a charcoal container office corner showing the corner casting, base rail and window sill flashing"),
    ("co-00-container-offices-ld02-crane-placement-prepared-plinth-16x9.png",
     "co-00-container-offices-ld02-crane-placement-prepared-plinth-16x9.webp",
     "White and blue container office on a four-point spreader beam lowering onto a concrete plinth at a construction site"),
    ("co-00-container-offices-ld06-low-loader-transport-envelope-16x9.png",
     "co-00-container-offices-ld06-low-loader-transport-envelope-16x9.webp",
     "Container office chained to a low-loader trailer on an Indian highway beneath a concrete flyover"),
]

DIAGRAMS = [
    ("co-00-container-offices-dgm1-reference-module-dimensions-16x9.png",
     "co-00-container-offices-dgm1-reference-module-dimensions-16x9.webp",
     "Plan and long elevation of the 20x10x8.5 ft module with six structural member callouts"),
    ("co-00-container-offices-dgm2-selection-decision-tree-16x9.png",
     "co-00-container-offices-dgm2-selection-decision-tree-16x9.webp",
     "Four-branch decision tree routing a buyer to the right container office product"),
]

slots = []
for size, rel, out_name, alt in GALLERY:
    slots.append({"slot": "gallery-%s" % size, "src": os.path.join(GALLERY_ROOT, rel.replace("/", os.sep)),
                  "out_dir": os.path.join(OUT_ROOT, size), "out_name": out_name, "alt": alt, "kind": "gallery"})

src_name, out_name, alt = SPLITCARD
slots.append({"slot": "splitcard", "src": os.path.join(DESC_ROOT, src_name),
              "out_dir": os.path.join(OUT_ROOT, "section2"), "out_name": out_name, "alt": alt, "kind": "photo"})

for src_name, out_name, alt in DESCRIPTION:
    slots.append({"slot": "description-%s" % out_name, "src": os.path.join(DESC_ROOT, src_name),
                  "out_dir": os.path.join(OUT_ROOT, "description"), "out_name": out_name, "alt": alt, "kind": "photo"})

for src_name, out_name, alt in DIAGRAMS:
    slots.append({"slot": "diagram-%s" % out_name, "src": os.path.join(DESC_ROOT, src_name),
                  "out_dir": os.path.join(OUT_ROOT, "specifications"), "out_name": out_name, "alt": alt, "kind": "diagram"})

print("total slots: %d" % len(slots))

report = []
missing = []
for s in slots:
    if not os.path.isfile(s["src"]):
        missing.append(s)
        continue
    os.makedirs(s["out_dir"], exist_ok=True)
    src_img = Image.open(s["src"])
    sw, sh = src_img.size
    out_path = os.path.join(s["out_dir"], s["out_name"])
    # No resize -- exact source dimensions preserved throughout (1254x1254 /
    # 1672x941 / 1920x1080). Conversion only, per the ticket's explicit rule.
    if s["kind"] == "gallery":
        target_kb = (80, 120)
    elif s["kind"] == "diagram":
        target_kb = (80, 150)
    else:
        target_kb = (150, 250)
    base = src_img.convert("RGB")
    quality = 88
    while True:
        base.save(out_path, "WEBP", quality=quality, method=6)
        kb = os.path.getsize(out_path) / 1024
        if kb <= target_kb[1] or quality <= 40:
            break
        quality -= 6
    out_img = Image.open(out_path)
    w, h = out_img.size
    sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
    size_kb = os.path.getsize(out_path) / 1024
    rel_out = "/images/products/container-offices/" + os.path.relpath(out_path, OUT_ROOT).replace("\\", "/")
    report.append({"slot": s["slot"], "src": s["src"], "out": rel_out, "alt": s["alt"],
                   "sw": sw, "sh": sh, "w": w, "h": h, "sha": sha, "kb": round(size_kb, 1), "quality": quality})

print("missing sources: %d" % len(missing))
for m in missing:
    print("  MISSING:", m["slot"], m["src"])

hashes = [r["sha"] for r in report]
print("hash-unique: %d/%d" % (len(set(hashes)), len(hashes)))
alts = [r["alt"] for r in report]
print("alt-unique (string equality): %d/%d" % (len(set(alts)), len(alts)))
if len(set(alts)) != len(alts):
    seen = {}
    for r in report:
        seen.setdefault(r["alt"], []).append(r["slot"])
    for a, s_ in seen.items():
        if len(s_) > 1:
            print("  DUPLICATE ALT:", s_, "->", a)

bad_dims = [r for r in report if (r["w"], r["h"]) != (r["sw"], r["sh"])]
print("dimension mismatch (should be none, no resize):", bad_dims if bad_dims else "none")

# expected exact dims
for r in report:
    if r["slot"].startswith("gallery") and (r["w"], r["h"]) != (1254, 1254):
        print("  UNEXPECTED gallery dims:", r["slot"], r["w"], r["h"])
    if (r["slot"] == "splitcard" or r["slot"].startswith("description")) and (r["w"], r["h"]) != (1672, 941):
        print("  UNEXPECTED photo dims:", r["slot"], r["w"], r["h"])
    if r["slot"].startswith("diagram") and (r["w"], r["h"]) != (1920, 1080):
        print("  UNEXPECTED diagram dims:", r["slot"], r["w"], r["h"])

json.dump(report, open("scripts/co00-image-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nwrote scripts/co00-image-report.json (%d entries)" % len(report))
