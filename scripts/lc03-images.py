# -*- coding: utf-8 -*-
"""LC-03 image intake: 36 gallery + 1 split-card + 6 Description = 43 slots.
Convert to WebP, rename per the ticket's manifest, verify hash-uniqueness and
alt-string uniqueness page-wide, verify aspect ratio preserved exactly."""
import hashlib
import json
import os
from PIL import Image

GALLERY_SRC_DIR = r"D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)/Oil Field Camp"
DESC_SRC_DIR = r"D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)/Technical_PDFs_and_Diagrams_long_description_section_4_Images/oil-field-camp"
OUT_ROOT = r"C:/tmp/saman-lc03/public/images/products/oil-field-camp"

SIZES = ["20x10", "30x10", "32x10", "40x10", "30x20", "40x20"]
COLOUR = {
    "20x10": "Oyster White", "30x10": "Denim Blue", "32x10": "Clay Brown",
    "40x10": "Moss Green", "30x20": "Flint Grey", "40x20": "Amber Ochre",
}
BEDS = {"20x10": "4", "30x10": "6", "40x10": "8", "30x20": "8", "40x20": "16"}

# suffix order per the ticket's Section 2 Column 2 manifest
SUFFIXES = ["front-left-hero", "full-front-elevation", "side-elevation",
            "installed-context", "interior-room-axis", "interior-sleeping-bay"]

# 32x10 exception: officer unit, different source files for the two interior
# slots (chosen after opening every candidate -- interior-desk-window shows
# the two-desk office, interior-sleeping-bay shows the bunk + locker, best
# matching each override alt below).
SRC_OVERRIDE = {
    ("32x10", "interior-room-axis"): "interior-desk-window",
    ("32x10", "interior-sleeping-bay"): "interior-sleeping-bay",
}

def alt_for(size, suffix):
    if size == "32x10" and suffix == "interior-room-axis":
        return "Interior of a 32x10 ft oil field camp toolpusher unit with desks, files and a work position"
    if size == "32x10" and suffix == "interior-sleeping-bay":
        return "Sleeping area of a 32x10 ft oil field camp toolpusher unit with 2 beds and a locker"
    colour = COLOUR[size]
    if suffix == "front-left-hero":
        return "%s ft oil field camp module in %s, front left view, steel skid base and entrance steps" % (size, colour)
    if suffix == "full-front-elevation":
        return "%s ft oil field camp module, straight front elevation showing door and window run" % size
    if suffix == "side-elevation":
        return "%s ft oil field camp module, gable end elevation showing module width" % size
    if suffix == "installed-context":
        return "%s ft oil field camp module installed on a gravel pad at a remote drilling location" % size
    if suffix == "interior-room-axis":
        return "Interior of a %s ft oil field camp module looking down the room, %s beds in bunk frames" % (size, BEDS[size])
    if suffix == "interior-sleeping-bay":
        return "Sleeping bay in a %s ft oil field camp module with bunk frame, locker and reading light" % size
    raise ValueError(suffix)

slots = []

# 36 gallery slots
for size in SIZES:
    for suffix in SUFFIXES:
        src_suffix = SRC_OVERRIDE.get((size, suffix), suffix)
        src = os.path.join(GALLERY_SRC_DIR, "%s ft" % size, "oil-field-camp-%s-ft-%s.png" % (size, src_suffix))
        out_dir = os.path.join(OUT_ROOT, size)
        out_name = "oil-field-camp-%s-%s.webp" % (size, suffix)
        slots.append({
            "slot": "gallery-%s-%s" % (size, suffix), "src": src,
            "out_dir": out_dir, "out_name": out_name,
            "alt": alt_for(size, suffix), "size": size,
        })

# split-card slot
slots.append({
    "slot": "splitcard", "src": os.path.join(DESC_SRC_DIR, "oil-field-camp-08-door-and-services-detail-16x9.jpg"),
    "out_dir": os.path.join(OUT_ROOT, "section2"), "out_name": "oil-field-camp-door-and-services-detail.webp",
    "alt": "Door end of an oil field camp module showing steps, external AC condenser and protected electrical entry",
})

# 6 Description-tab slots
DESC_IMAGES = [
    ("oil-field-camp-01-main-context-16x9.jpg", "oil-field-camp-main-context.webp",
     "Oil field camp module on a remote location with a drilling rig in the distance"),
    ("oil-field-camp-04-price-selection-16x9.jpg", "oil-field-camp-price-selection.webp",
     "Two oil field camp modules of different lengths on the same gravel pad"),
    ("oil-field-camp-06-wide-body-interior-16x9.jpg", "oil-field-camp-wide-body-interior.webp",
     "Wide-body oil field camp module interior with bunk frames along both walls and a central aisle"),
    ("oil-field-camp-05-skid-and-lifting-detail-16x9.jpg", "oil-field-camp-skid-and-lifting-detail.webp",
     "Steel skid chassis of an oil field camp module with runner beam and marked corner lifting lug"),
    ("oil-field-camp-07-two-modules-on-site-16x9.jpg", "oil-field-camp-two-modules-on-site.webp",
     "Two oil field camp modules placed apart on one location showing access between them"),
    ("oil-field-camp-02-layout-understanding-16x9.jpg", "oil-field-camp-layout-understanding.webp",
     "Oil field camp module with external service connections at a remote site"),
]
for src_name, out_name, alt in DESC_IMAGES:
    slots.append({
        "slot": "description-%s" % out_name, "src": os.path.join(DESC_SRC_DIR, src_name),
        "out_dir": os.path.join(OUT_ROOT, "description"), "out_name": out_name, "alt": alt,
    })

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
    is_gallery = s["slot"].startswith("gallery")
    target_kb = (150, 250) if is_gallery else (80, 120)
    # "served display size" per the ticket's image rules: resize down from the
    # oversized masters (2048x2048 gallery, 1920x1080 description) before
    # compressing, aspect ratio held exactly, so the budget is hit without
    # visible quality loss from over-aggressive WebP quantisation alone.
    max_dim = 1200 if is_gallery else 1600
    scale = min(1.0, max_dim / max(sw, sh))
    rw, rh = (round(sw * scale), round(sh * scale)) if scale < 1.0 else (sw, sh)
    base = src_img.convert("RGB").resize((rw, rh), Image.LANCZOS) if scale < 1.0 else src_img.convert("RGB")
    quality = 84
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
    rel_out = "/images/products/oil-field-camp/" + os.path.relpath(out_path, OUT_ROOT).replace("\\", "/")
    report.append({
        "slot": s["slot"], "src": s["src"], "out": rel_out, "alt": s["alt"],
        "sw": sw, "sh": sh, "w": w, "h": h, "sha": sha, "kb": round(size_kb, 1),
    })

print("missing sources: %d" % len(missing))
for m in missing:
    print("  MISSING:", m["slot"], m["src"])

# hash uniqueness
hashes = [r["sha"] for r in report]
print("hash-unique: %d/%d" % (len(set(hashes)), len(hashes)))
if len(set(hashes)) != len(hashes):
    seen = {}
    for r in report:
        seen.setdefault(r["sha"], []).append(r["slot"])
    for h, slots_ in seen.items():
        if len(slots_) > 1:
            print("  DUPLICATE HASH:", slots_)

# alt uniqueness
alts = [r["alt"] for r in report]
print("alt-unique: %d/%d" % (len(set(alts)), len(alts)))
if len(set(alts)) != len(alts):
    seen = {}
    for r in report:
        seen.setdefault(r["alt"], []).append(r["slot"])
    for a, slots_ in seen.items():
        if len(slots_) > 1:
            print("  DUPLICATE ALT:", slots_, "->", a)

# aspect ratio
bad_ar = [r for r in report if abs((r["sw"] / r["sh"]) - (r["w"] / r["h"])) > 0.001]
print("aspect ratio preserved:", "all good" if not bad_ar else bad_ar)

# alt length
long_alts = [r for r in report if len(r["alt"]) > 130]
print("alts over 130 chars:", long_alts if long_alts else "none")

json.dump(report, open("scripts/lc03-image-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nwrote scripts/lc03-image-report.json (%d entries)" % len(report))
