# -*- coding: utf-8 -*-
"""PC-00 asset refresh v1: convert all 50 approved images to WebP.
Rule (ticket 4.1): convert only, preserve source ratio exactly, never crop/
pad/upscale/resize -- except the GA boards, "the single permitted resize"
(proportional 3840x2160 -> 1920x1080 downscale). Every other slot ships at
its exact native pixel dimensions, quality-stepped to the stated KB budget."""
import hashlib
import json
import os
from PIL import Image

ROOT_A = r"D:\Project-shekhar\all-product-images\Hub Page (Porta Cabins)\porta-cabin\approved-website-assets-v1"
ROOT_B = r"D:\video-project\saman-products-video\ms-porta-cabin\technical-presentation-boards"
OUT_ROOT = r"C:\tmp\pc00-asset-refresh-v1\public\images\products\porta-cabins"

def encode(src_path, out_path, target_kb, quality_start, quality_floor, resize=None):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img = Image.open(src_path)
    sw, sh = img.size
    base = img.convert("RGB")
    if resize:
        base = base.resize(resize, Image.LANCZOS)
    quality = quality_start
    while True:
        base.save(out_path, "WEBP", quality=quality, method=6)
        kb = os.path.getsize(out_path) / 1024
        if kb <= target_kb or quality <= quality_floor:
            break
        quality -= 4
    out_img = Image.open(out_path)
    ow, oh = out_img.size
    sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
    return {"src": src_path, "out": out_path, "sw": sw, "sh": sh, "ow": ow, "oh": oh,
            "kb": round(os.path.getsize(out_path) / 1024, 1), "quality": quality, "sha": sha}

report = {"gallery": [], "description": [], "diagrams": [], "ga_boards": []}

# --- 36 gallery slides, 1254x1254 native, no resize, 80-120KB target ---
GALLERY = {
    "10x10": [
        ("size-10x10/01-exterior-front-left.jpg", "porta-cabin-10x10-01-exterior-front-left.webp"),
        ("size-10x10/02-exterior-front-right.jpg", "porta-cabin-10x10-02-exterior-front-right.webp"),
        ("size-10x10/03-exterior-rear-left.jpg", "porta-cabin-10x10-03-exterior-rear-left.webp"),
        ("size-10x10/04-interior-entry-to-rear.jpg", "porta-cabin-10x10-04-interior-entry-to-rear.webp"),
        ("size-10x10/05-interior-front-left-angle.jpg", "porta-cabin-10x10-05-interior-front-left-angle.webp"),
        ("size-10x10/06-interior-rear-to-entry.jpg", "porta-cabin-10x10-06-interior-rear-to-entry.webp"),
    ],
    "20x8": [
        ("size-20x8/01-exterior-front-left.jpg", "porta-cabin-20x8-01-exterior-front-left.webp"),
        ("size-20x8/02-exterior-front-right.jpg", "porta-cabin-20x8-02-exterior-front-right.webp"),
        ("size-20x8/03-exterior-rear-left.jpg", "porta-cabin-20x8-03-exterior-rear-left.webp"),
        ("size-20x8/04-interior-left-end-lengthwise.jpg", "porta-cabin-20x8-04-interior-left-end-lengthwise.webp"),
        ("size-20x8/05-interior-right-end-lengthwise.jpg", "porta-cabin-20x8-05-interior-right-end-lengthwise.webp"),
        ("size-20x8/06-interior-door-to-rear.jpg", "porta-cabin-20x8-06-interior-door-to-rear.webp"),
    ],
    "20x10": [
        ("size-20x10/01-exterior-front-left.jpg", "porta-cabin-20x10-01-exterior-front-left.webp"),
        ("size-20x10/02-exterior-front-right.jpg", "porta-cabin-20x10-02-exterior-front-right.webp"),
        ("size-20x10/03-exterior-rear-left.jpg", "porta-cabin-20x10-03-exterior-rear-left.webp"),
        ("size-20x10/04-interior-entry-to-rear.jpg", "porta-cabin-20x10-04-interior-entry-to-rear.webp"),
        ("size-20x10/05-interior-left-end-lengthwise.jpg", "porta-cabin-20x10-05-interior-left-end-lengthwise.webp"),
        ("size-20x10/06-interior-right-end-lengthwise.jpg", "porta-cabin-20x10-06-interior-right-end-lengthwise.webp"),
    ],
    "20x12": [
        ("size-20x12/01-exterior-front-left.jpg", "porta-cabin-20x12-01-exterior-front-left.webp"),
        ("size-20x12/02-exterior-front-right.jpg", "porta-cabin-20x12-02-exterior-front-right.webp"),
        ("size-20x12/03-exterior-rear-left.jpg", "porta-cabin-20x12-03-exterior-rear-left.webp"),
        ("size-20x12/04-interior-left-end-lengthwise.jpg", "porta-cabin-20x12-04-interior-left-end-lengthwise.webp"),
        ("size-20x12/05-interior-right-end-lengthwise.jpg", "porta-cabin-20x12-05-interior-right-end-lengthwise.webp"),
        ("size-20x12/06-interior-entry-to-rear.jpg", "porta-cabin-20x12-06-interior-entry-to-rear.webp"),
    ],
    "30x10": [
        ("size-30x10/01-exterior-front-left.jpg", "porta-cabin-30x10-01-exterior-front-left.webp"),
        ("size-30x10/02-exterior-front-right.jpg", "porta-cabin-30x10-02-exterior-front-right.webp"),
        ("size-30x10/03-exterior-rear-left.jpg", "porta-cabin-30x10-03-exterior-rear-left.webp"),
        ("size-30x10/04-interior-left-end-lengthwise.jpg", "porta-cabin-30x10-04-interior-left-end-lengthwise.webp"),
        ("size-30x10/05-interior-right-end-lengthwise.jpg", "porta-cabin-30x10-05-interior-right-end-lengthwise.webp"),
        ("size-30x10/06-interior-entry-to-far-end.jpg", "porta-cabin-30x10-06-interior-entry-to-far-end.webp"),
    ],
    "40x10": [
        ("size-40x10/01-exterior-front-left.jpg", "porta-cabin-40x10-01-exterior-front-left.webp"),
        ("size-40x10/02-exterior-front-right.jpg", "porta-cabin-40x10-02-exterior-front-right.webp"),
        ("size-40x10/03-exterior-rear-left.jpg", "porta-cabin-40x10-03-exterior-rear-left.webp"),
        ("size-40x10/04-interior-common-right-to-partition.jpg", "porta-cabin-40x10-04-interior-common-right-to-partition.webp"),
        ("size-40x10/05-interior-common-partition-to-right.jpg", "porta-cabin-40x10-05-interior-common-partition-to-right.webp"),
        ("size-40x10/06-interior-manager-cabin.jpg", "porta-cabin-40x10-06-interior-manager-cabin.webp"),
    ],
}
for size, items in GALLERY.items():
    out_dir = os.path.join(OUT_ROOT, size)
    for src_rel, out_name in items:
        src_path = os.path.join(ROOT_A, "01-square-product-gallery", src_rel.replace("/", os.sep))
        out_path = os.path.join(out_dir, out_name)
        r = encode(src_path, out_path, target_kb=120, quality_start=88, quality_floor=55)
        r["size"] = size
        report["gallery"].append(r)

# --- 6 description-set 16:9, 1920x1080 native, no resize, 80-120KB ---
DESC_SET = [
    ("01-porta-cabin-10x10-exterior-oxford-teal.jpg", "description", "porta-cabin-description-01-10x10-oxford-teal-exterior.webp"),
    ("02-porta-cabin-20x8-narrow-office-interior.jpg", "description", "porta-cabin-description-02-20x8-narrow-office-interior.webp"),
    ("03-porta-cabin-20x10-exterior-desert-ochre.jpg", "section2", "porta-cabin-section2-20x10-desert-ochre-site.webp"),
    ("04-porta-cabin-20x12-wide-aisle-interior.jpg", "description", "porta-cabin-description-03-20x12-wide-aisle-interior.webp"),
    ("05-porta-cabin-30x10-exterior-eucalyptus.jpg", "description", "porta-cabin-description-04-30x10-eucalyptus-exterior.webp"),
    ("06-porta-cabin-40x10-manager-common-office.jpg", "description", "porta-cabin-description-05-40x10-manager-and-common-office.webp"),
]
for src_name, out_dir_name, out_name in DESC_SET:
    src_path = os.path.join(ROOT_A, "02-long-description-16x9", src_name)
    out_path = os.path.join(OUT_ROOT, out_dir_name, out_name)
    r = encode(src_path, out_path, target_kb=120, quality_start=88, quality_floor=55)
    r["slot"] = out_dir_name
    report["description"].append(r)

# --- 2 technical diagrams, 1920x1080 native, no resize, 80-140KB @ q90 ---
DIAGRAMS = [
    ("porta-cabin-three-stage-frame-and-ms-sheet-joint.png", "porta-cabin-diagram-1-frame-and-sheet-assembly.webp"),
    ("porta-cabin-three-stage-window-electrical-fan-installation.png", "porta-cabin-diagram-2-window-electrical-fan.webp"),
]
for src_name, out_name in DIAGRAMS:
    src_path = os.path.join(ROOT_A, "03-technical-diagrams-16x9", src_name)
    out_path = os.path.join(OUT_ROOT, "specifications", out_name)
    r = encode(src_path, out_path, target_kb=140, quality_start=90, quality_floor=75)
    report["diagrams"].append(r)

# --- 6 GA boards: 3840x2160 -> 1920x1080 proportional downscale, 150-250KB @ q88 ---
GA_BOARDS = [
    ("10x10x8.5", "porta-cabin-10x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-10x10.webp"),
    ("20x8x8.5", "porta-cabin-20x8x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-20x8.webp"),
    ("20x10x8.5", "porta-cabin-20x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-20x10.webp"),
    ("20x12x8.5", "porta-cabin-20x12x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-20x12.webp"),
    ("30x10x8.5", "porta-cabin-30x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-30x10.webp"),
    ("40x10x8.5", "porta-cabin-40x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-40x10.webp"),
]
for folder, src_name, out_name in GA_BOARDS:
    src_path = os.path.join(ROOT_B, folder, src_name)
    out_path = os.path.join(OUT_ROOT, "size-section", out_name)
    r = encode(src_path, out_path, target_kb=250, quality_start=88, quality_floor=70, resize=(1920, 1080))
    report["ga_boards"].append(r)

# --- summary ---
all_rows = report["gallery"] + report["description"] + report["diagrams"] + report["ga_boards"]
print("total images:", len(all_rows))
hashes = [r["sha"] for r in all_rows]
print("hash-unique:", len(set(hashes)), "/", len(hashes))
if len(set(hashes)) != len(hashes):
    seen = {}
    for r in all_rows:
        seen.setdefault(r["sha"], []).append(r["out"])
    for h, outs in seen.items():
        if len(outs) > 1:
            print("  DUPLICATE HASH:", outs)

for label, rows in report.items():
    print(f"--- {label} ({len(rows)}) ---")
    for r in rows:
        resized = "" if (r["sw"], r["sh"]) == (r["ow"], r["oh"]) else f"  RESIZED {r['sw']}x{r['sh']} -> {r['ow']}x{r['oh']}"
        print(" ", os.path.basename(r["out"]), f"{r['ow']}x{r['oh']}", f"{r['kb']}KB", f"q{r['quality']}", resized)

json.dump(report, open("scripts/pc00-images-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nwrote scripts/pc00-images-report.json")
