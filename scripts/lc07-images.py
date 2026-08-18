# -*- coding: utf-8 -*-
"""LC-07 image intake: 36 gallery + 1 split-card + 4 Description + 2 diagrams
= 43 slots. Convert to WebP, rename per the ticket's manifest, verify
hash-uniqueness and alt-string uniqueness page-wide, verify aspect ratio."""
import hashlib
import json
import os
from PIL import Image

GALLERY_ROOT = r"D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)/Multi-Toilet-Ablution-Block"
DESC_ROOT = r"D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)/Technical_PDFs_and_Diagrams_long_description_section_4_Images/multi-toilet-ablution-block"
OUT_ROOT = r"C:/tmp/saman-lc07/public/images/products/ablution-block"

# (folder, size-token-for-filenames, output-size-slug, colour-token, output-colour-slug)
SIZES = [
    ("01-12x10-ft-Cornflower-Blue-White", "12x10-ft-Cornflower-Blue-White", "12x10", "cornflower-blue"),
    ("02-16x10-ft-Oat-Beige-White", "16x10-ft-Oat-Beige-White", "16x10", "oat-beige"),
    ("03-24x12-ft-Deep-Green-White", "24x12-ft-Deep-Green-White", "24x12", "deep-green"),
    ("04-30x12-ft-Rust-Orange-White", "30x12-ft-Rust-Orange-White", "30x12", "rust-orange"),
    ("05-40x12-ft-Charcoal-Grey-White", "40x12-ft-Charcoal-Grey-White", "40x12", "charcoal-grey"),
    ("06-40x20-ft-Bronze-White", "40x20-ft-Bronze-White", "40x20", "bronze"),
]

# suffix -> (placement-role, alt-template). alt uses {colour} {size} tokens.
COLOUR_DISPLAY = {
    "cornflower-blue": "Cornflower Blue", "oat-beige": "Oat Beige", "deep-green": "Deep Green",
    "rust-orange": "Rust Orange", "charcoal-grey": "Charcoal Grey", "bronze": "Bronze",
}

# Per-size gallery slot list: (src_suffix, out_suffix, alt_template). Folders
# 01-04 use exterior-front-left-hero as the hero; 05/06 use
# exterior-installed-context instead (V2 mitigation -- front-left-hero for
# those two is dropped from the gallery entirely, per section 4a/4d).
STANDARD_SUFFIXES = [
    ("exterior-front-left-hero", "exterior-front-left-hero",
     "{colour} {size} ft ablution block, front left three-quarter view, white trim and high-level privacy louvres"),
    ("exterior-full-front", "exterior-full-front",
     "{colour} {size} ft ablution block, full front elevation showing the cubicle door line"),
    ("exterior-installed-context", "exterior-installed-context",
     "{colour} {size} ft ablution block, installed on an Indian construction site with RCC frame structure behind"),
    ("exterior-rear-left-utility", "exterior-rear-left-utility",
     "{colour} {size} ft ablution block, rear utility side with external service door, water inlet and waste outlet"),
    ("interior-toilet-cubicles", "interior-toilet-cubicles",
     "{colour} {size} ft ablution block, interior cubicle bank with washable wall liner and anti-skid floor"),
    ("interior-washbasins", "interior-washbasins",
     "{colour} {size} ft ablution block, interior wash run with stainless basins and a trapped floor drain"),
]

WIDE_SUFFIXES = [
    ("exterior-installed-context", "exterior-installed-context",
     "{colour} {size} ft ablution block, installed on an Indian project site, plinth and drainage channel visible"),
    ("exterior-full-front", "exterior-full-front",
     "{colour} {size} ft ablution block, full front elevation showing the cubicle door line"),
    ("exterior-rear-left-utility", "exterior-rear-left-utility",
     "{colour} {size} ft ablution block, rear utility side with external service door, water inlet and waste outlet"),
    ("exterior-side-elevation", "exterior-side-elevation",
     "{colour} {size} ft ablution block, side elevation showing the body depth and roof vent terminals"),
    ("interior-toilet-cubicles", "interior-toilet-cubicles",
     "{colour} {size} ft ablution block, interior cubicle bank with washable wall liner and anti-skid floor"),
    ("interior-washbasins", "interior-washbasins",
     "{colour} {size} ft ablution block, interior wash run with stainless basins and a trapped floor drain"),
]

slots = []
for folder, filetoken, size_slug, colour_slug in SIZES:
    is_wide = size_slug in ("40x12", "40x20")
    suffix_list = WIDE_SUFFIXES if is_wide else STANDARD_SUFFIXES
    colour_disp = COLOUR_DISPLAY[colour_slug]
    for src_suffix, out_suffix, alt_template in suffix_list:
        src = os.path.join(GALLERY_ROOT, folder, "multi-toilet-ablution-block-%s-%s.png" % (filetoken, src_suffix))
        out_dir = os.path.join(OUT_ROOT, size_slug)
        out_name = "ablution-block-%s-ft-%s-%s.webp" % (size_slug, colour_slug, out_suffix)
        alt = alt_template.format(colour=colour_disp, size=size_slug)
        slots.append({"slot": "gallery-%s-%s" % (size_slug, out_suffix), "src": src,
                       "out_dir": out_dir, "out_name": out_name, "alt": alt})

# split-card
slots.append({
    "slot": "splitcard", "src": os.path.join(DESC_ROOT, "multi-toilet-ablution-block-split-card-camp-context-16x9.png"),
    "out_dir": os.path.join(OUT_ROOT, "section2"), "out_name": "ablution-block-split-card-camp-context.webp",
    "alt": "Ablution block installed on an Indian labour camp site, entry and service side both visible",
})

# description
DESC_IMAGES = [
    ("multi-toilet-ablution-block-01-site-installed-block-16x9.png", "ablution-block-site-installed-block.webp",
     "Ablution block connected and in service on a working project site"),
    ("multi-toilet-ablution-block-02-single-vs-double-loaded-16x9.png", "ablution-block-single-vs-double-loaded.webp",
     "A 10 ft deep single-loaded block beside a 12 ft deep double-loaded block for comparison"),
    ("multi-toilet-ablution-block-03-cubicle-bank-and-wash-run-16x9.png", "ablution-block-cubicle-bank-and-wash-run.webp",
     "Interior circulation route with the cubicle bank on one side and the wash run opposite"),
    ("multi-toilet-ablution-block-04-service-riser-access-panel-16x9.png", "ablution-block-service-riser-access-panel.webp",
     "Open service riser showing pipework, isolation valves and the removable access panel"),
]
for src_name, out_name, alt in DESC_IMAGES:
    slots.append({"slot": "description-%s" % out_name, "src": os.path.join(DESC_ROOT, src_name),
                  "out_dir": os.path.join(OUT_ROOT, "description"), "out_name": out_name, "alt": alt})

# diagrams
DIAGRAMS = [
    ("multi-toilet-ablution-block-technical-layout-diagram-16x9.png", "ablution-block-bank-layout-diagram.webp",
     "Ablution block bank layout diagram showing the central pipe duct, dry entry and cleaning circulation"),
    ("multi-toilet-ablution-block-material-services-diagram-16x9.png", "ablution-block-wet-service-section-diagram.webp",
     "Wet-service section diagram showing floor fall to a trapped drain, vent stack and exhaust discharge"),
]
for src_name, out_name, alt in DIAGRAMS:
    slots.append({"slot": "diagram-%s" % out_name, "src": os.path.join(DESC_ROOT, src_name),
                  "out_dir": os.path.join(OUT_ROOT, "specifications"), "out_name": out_name, "alt": alt})

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
    is_diagram = s["slot"].startswith("diagram")
    if is_gallery:
        target_kb = (150, 250)
        max_dim = 1200
    elif is_diagram:
        target_kb = (0, 200)
        max_dim = 1920
    else:
        target_kb = (80, 120)
        max_dim = 1600
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
    rel_out = "/images/products/ablution-block/" + os.path.relpath(out_path, OUT_ROOT).replace("\\", "/")
    report.append({"slot": s["slot"], "src": s["src"], "out": rel_out, "alt": s["alt"],
                   "sw": sw, "sh": sh, "w": w, "h": h, "sha": sha, "kb": round(size_kb, 1)})

print("missing sources: %d" % len(missing))
for m in missing:
    print("  MISSING:", m["slot"], m["src"])

hashes = [r["sha"] for r in report]
print("hash-unique: %d/%d" % (len(set(hashes)), len(hashes)))
if len(set(hashes)) != len(hashes):
    seen = {}
    for r in report:
        seen.setdefault(r["sha"], []).append(r["slot"])
    for h, s_ in seen.items():
        if len(s_) > 1:
            print("  DUPLICATE HASH:", s_)

alts = [r["alt"] for r in report]
print("alt-unique: %d/%d" % (len(set(alts)), len(alts)))
if len(set(alts)) != len(alts):
    seen = {}
    for r in report:
        seen.setdefault(r["alt"], []).append(r["slot"])
    for a, s_ in seen.items():
        if len(s_) > 1:
            print("  DUPLICATE ALT:", s_, "->", a)

bad_ar = [r for r in report if abs((r["sw"] / r["sh"]) - (r["w"] / r["h"])) > 0.001]
print("aspect ratio preserved:", "all good" if not bad_ar else bad_ar)

long_alts = [r for r in report if len(r["alt"]) > 150]
print("alts over 150 chars:", long_alts if long_alts else "none")

# criterion 7a: dropped files never touched
dropped = ["05-40x12-ft-Charcoal-Grey-White-exterior-front-left-hero",
           "06-40x20-ft-Bronze-White-exterior-front-left-hero"]
touched_srcs = " | ".join(r["src"] for r in report)
for d in dropped:
    print("dropped file NOT referenced (%s):" % d, d not in touched_srcs)

json.dump(report, open("scripts/lc07-image-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nwrote scripts/lc07-image-report.json (%d entries)" % len(report))
