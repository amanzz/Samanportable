# -*- coding: utf-8 -*-
"""CO-00 v2: 6 native 16:9 finished-product renders. 20x10 deep-forest-green
goes to the Section 2 split card; the other five go to the Description tab.
Sources are 1920x1080 RGBA PNG -- flattened onto white before WebP encode."""
import hashlib
import json
import os
from PIL import Image

SRC_DIR = r"D:/Project-shekhar/all-product-images/Hub page (Container Offices)/container-offices/6-images-for-long-description-tab"

# (src_name, out_dir, out_name, alt, width, height, quality)
ITEMS = [
    ("container-office-20x10-deep-forest-green-finished-product-16x9.png",
     r"public/images/products/container-offices/section2",
     "co-00-container-office-20x10-deep-forest-green-finished-16x9.webp",
     "Deep forest green 20x10 ft container office with a central door and windows either side, on paving",
     1280, 720, 80),
    ("container-office-10x10-midnight-navy-finished-product-16x9.png",
     r"public/images/products/container-offices/description",
     "co-00-container-office-10x10-midnight-navy-finished-16x9.webp",
     "Midnight navy 10x10 ft container office on paving, with a single door, one window and black corner castings",
     1600, 900, 80),
    ("container-office-20x8-graphite-charcoal-finished-product-16x9.png",
     r"public/images/products/container-offices/description",
     "co-00-container-office-20x8-graphite-charcoal-finished-16x9.webp",
     "Graphite charcoal 20x8 ft container office with two windows either side of a central door, on paving",
     1600, 900, 80),
    ("container-office-30x10-burnt-terracotta-finished-product-16x9.png",
     r"public/images/products/container-offices/description",
     "co-00-container-office-30x10-burnt-terracotta-finished-16x9.webp",
     "Burnt terracotta 30x10 ft container office with two doors and three windows visible, on paving",
     1600, 900, 80),
    ("container-office-40x8-deep-burgundy-finished-product-16x9.png",
     r"public/images/products/container-offices/description",
     "co-00-container-office-40x8-deep-burgundy-finished-16x9.webp",
     "Deep burgundy 40x8 ft container office with windows and a door on the long wall, industrial building behind",
     1600, 900, 80),
    ("container-office-40x10-pearl-white-finished-product-16x9.png",
     r"public/images/products/container-offices/description",
     "co-00-container-office-40x10-pearl-white-finished-16x9.webp",
     "Pearl white 40x10 ft container office with a row of windows and a door on the long wall, palms behind",
     1280, 720, 75),
]

report = []
for src_name, out_dir, out_name, alt, w, h, q in ITEMS:
    src_path = os.path.join(SRC_DIR, src_name)
    if not os.path.isfile(src_path):
        print("MISSING SOURCE:", src_path)
        continue
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, out_name)
    src_img = Image.open(src_path)
    sw, sh = src_img.size
    if src_img.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", src_img.size, (255, 255, 255))
        rgba = src_img.convert("RGBA")
        bg.paste(rgba, mask=rgba.split()[-1])
        base = bg
    else:
        base = src_img.convert("RGB")
    base = base.resize((w, h), Image.LANCZOS)
    base.save(out_path, "WEBP", quality=q, method=6)
    kb = os.path.getsize(out_path) / 1024
    sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
    report.append({"src": src_path, "out": out_path, "alt": alt, "sw": sw, "sh": sh,
                    "w": w, "h": h, "kb": round(kb, 1), "sha": sha})
    print(out_name, f"{kb:.1f} KB", f"{w}x{h}")

hashes = [r["sha"] for r in report]
print("hash-unique:", len(set(hashes)), "/", len(hashes))
alts = [r["alt"] for r in report]
print("alt-unique:", len(set(alts)), "/", len(alts))
json.dump(report, open("scripts/co00-splitcard-description-v2-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
