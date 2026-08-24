# -*- coding: utf-8 -*-
"""CO-00 v2: 2 Specifications-tab technical diagrams, replacing the old
dimensions/decision-tree pair with frame-fixing and window-electrical-fan
detail per draft v2.0 Section D Tab 2 / build-prompt section 5.4."""
import hashlib
import json
import os
from PIL import Image

SRC_DIR = r"D:/Project-shekhar/all-product-images/Hub page (Container Offices)/container-offices/technical-diagrams-for-specification-tab"
OUT_DIR = r"C:/tmp/saman-co00/public/images/products/container-offices/specifications"

ITEMS = [
    ("container-office-three-stage-frame-and-ms-sheet-joint.png",
     "co-00-container-office-frame-and-sheet-fixing-detail.webp"),
    ("container-office-three-stage-window-electrical-fan-installation.png",
     "co-00-container-office-window-electrical-fan-detail.webp"),
]

os.makedirs(OUT_DIR, exist_ok=True)
report = []
for src_name, out_name in ITEMS:
    src_path = os.path.join(SRC_DIR, src_name)
    if not os.path.isfile(src_path):
        print("MISSING:", src_path)
        continue
    img = Image.open(src_path).convert("RGB")
    sw, sh = img.size
    resized = img.resize((1600, 900), Image.LANCZOS)
    out_path = os.path.join(OUT_DIR, out_name)
    quality = 85
    resized.save(out_path, "WEBP", quality=quality, method=6)
    kb = os.path.getsize(out_path) / 1024
    sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
    report.append({"src": src_path, "out": out_path, "sw": sw, "sh": sh, "kb": round(kb, 1), "sha": sha})
    print(out_name, f"{kb:.1f} KB", "native", f"{sw}x{sh}")

hashes = [r["sha"] for r in report]
print("hash-unique:", len(set(hashes)), "/", len(hashes))
json.dump(report, open("scripts/co00-spec-diagrams-v2-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
