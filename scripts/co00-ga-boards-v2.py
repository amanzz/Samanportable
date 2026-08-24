# -*- coding: utf-8 -*-
"""CO-00 v2: 6 GA boards for the Section 3 size-explorer slot. Native boards
are 3912x2992 (ratio 1.3075); the live template's explorer slot is 533x400
(ratio 1.3347, object-fit: cover). Padding, not cropping, reconciles the
mismatch: each board is scaled to fit inside a 1600x1200 (4:3) canvas and
centred, with the margin filled by a colour sampled from the board's own
background (a corner pixel -- the boards use a flat field there)."""
import hashlib
import json
import os
from PIL import Image

SRC_ROOT = r"D:/Project-shekhar/all-product-images/Hub page (Container Offices)/container-offices/6-2d-GA-for-6-sizesection"
OUT_DIR = r"C:/tmp/saman-co00/public/images/products/container-offices/size-section"

BOARDS = [
    ("10x10x8.5", "co-00-container-office-10x10-general-arrangement-board.webp"),
    ("20x8x8.5", "co-00-container-office-20x8-general-arrangement-board.webp"),
    ("20x10x8.5", "co-00-container-office-20x10-general-arrangement-board.webp"),
    ("30x10x8.5", "co-00-container-office-30x10-general-arrangement-board.webp"),
    ("40x8x8.5", "co-00-container-office-40x8-general-arrangement-board.webp"),
    ("40x10x8.5", "co-00-container-office-40x10-general-arrangement-board.webp"),
]

CANVAS_W, CANVAS_H = 1600, 1200

os.makedirs(OUT_DIR, exist_ok=True)
report = []
for folder, out_name in BOARDS:
    src_path = os.path.join(SRC_ROOT, folder, f"container-office-{folder.replace('.', '-')}-premium-ga-specification-board-v1.png")
    if not os.path.isfile(src_path):
        print("MISSING:", src_path)
        continue
    board = Image.open(src_path).convert("RGB")
    sw, sh = board.size

    # Sample the board's own background colour from a corner, a few px in
    # from the true edge to avoid an anti-aliased border pixel.
    bg_color = board.getpixel((10, 10))

    scale = min(CANVAS_W / sw, CANVAS_H / sh)
    new_w, new_h = round(sw * scale), round(sh * scale)
    resized = board.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), bg_color)
    off_x = (CANVAS_W - new_w) // 2
    off_y = (CANVAS_H - new_h) // 2
    canvas.paste(resized, (off_x, off_y))

    out_path = os.path.join(OUT_DIR, out_name)
    canvas.save(out_path, "WEBP", quality=85, method=6)
    kb = os.path.getsize(out_path) / 1024
    sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
    report.append({
        "folder": folder, "src": src_path, "out": out_path,
        "src_w": sw, "src_h": sh, "bg_color": bg_color,
        "scaled_w": new_w, "scaled_h": new_h, "offset": [off_x, off_y],
        "canvas_w": CANVAS_W, "canvas_h": CANVAS_H, "kb": round(kb, 1), "sha": sha,
    })
    print(out_name, f"{kb:.1f} KB", f"bg={bg_color}", f"board {new_w}x{new_h} at ({off_x},{off_y}) on {CANVAS_W}x{CANVAS_H}")

hashes = [r["sha"] for r in report]
print("hash-unique:", len(set(hashes)), "/", len(hashes))
print("boards done:", len(report), "/ 6")
json.dump(report, open("scripts/co00-ga-boards-v2-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
