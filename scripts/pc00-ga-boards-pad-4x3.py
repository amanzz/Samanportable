# -*- coding: utf-8 -*-
"""PC-00 fix: the Section 3 explorer image slot is CSS aspect-[4/3] with
overflow-hidden (object-fit cover), the same shared component CO-00 uses.
The ticket's "convert only, native 16:9" instruction for the GA boards did
not account for this: a 16:9 image inside a 4:3 cover-cropped box loses its
left/right edges -- confirmed visually, "PORTA CABIN" clipped to "ORTA
CABIN", dimension and window/workstation counts clipped. Fix: pad each
board onto a 4:3 canvas (letterboxed top/bottom, since 16:9 is wider than
4:3) using a colour sampled from the board's own background, matching the
CO-00 GA-board approach. Source: the same 3840x2160 masters used before."""
import hashlib
import json
import os
from PIL import Image

ROOT_B = r"D:\video-project\saman-products-video\ms-porta-cabin\technical-presentation-boards"
OUT_DIR = r"C:\tmp\pc00-asset-refresh-v1\public\images\products\porta-cabins\size-section"

GA_BOARDS = [
    ("10x10x8.5", "porta-cabin-10x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-10x10.webp"),
    ("20x8x8.5", "porta-cabin-20x8x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-20x8.webp"),
    ("20x10x8.5", "porta-cabin-20x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-20x10.webp"),
    ("20x12x8.5", "porta-cabin-20x12x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-20x12.webp"),
    ("30x10x8.5", "porta-cabin-30x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-30x10.webp"),
    ("40x10x8.5", "porta-cabin-40x10x8-5-premium-ga-specification-board-v1.png", "porta-cabin-ga-plan-40x10.webp"),
]

CANVAS_W, CANVAS_H = 1920, 1440  # 4:3, matches the live explorer slot (aspect-[4/3])

report = []
for folder, src_name, out_name in GA_BOARDS:
    src_path = os.path.join(ROOT_B, folder, src_name)
    board = Image.open(src_path).convert("RGB")
    sw, sh = board.size

    bg_color = board.getpixel((10, 10))

    scale = min(CANVAS_W / sw, CANVAS_H / sh)
    new_w, new_h = round(sw * scale), round(sh * scale)
    resized = board.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), bg_color)
    off_x = (CANVAS_W - new_w) // 2
    off_y = (CANVAS_H - new_h) // 2
    canvas.paste(resized, (off_x, off_y))

    out_path = os.path.join(OUT_DIR, out_name)
    quality = 88
    while True:
        canvas.save(out_path, "WEBP", quality=quality, method=6)
        kb = os.path.getsize(out_path) / 1024
        if kb <= 250 or quality <= 70:
            break
        quality -= 4
    sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
    report.append({
        "folder": folder, "src": src_path, "out": out_path, "src_w": sw, "src_h": sh,
        "bg_color": bg_color, "scaled_w": new_w, "scaled_h": new_h, "offset": [off_x, off_y],
        "canvas_w": CANVAS_W, "canvas_h": CANVAS_H, "kb": round(kb, 1), "quality": quality, "sha": sha,
    })
    print(out_name, f"{kb:.1f} KB", f"q{quality}", f"bg={bg_color}", f"board {new_w}x{new_h} at ({off_x},{off_y}) on {CANVAS_W}x{CANVAS_H}")

hashes = [r["sha"] for r in report]
print("hash-unique:", len(set(hashes)), "/", len(hashes))
json.dump(report, open("scripts/pc00-ga-boards-pad-report.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
