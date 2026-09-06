#!/usr/bin/env python3
"""PO-08 image pipeline.

Every browser-fetched image is WebP and must land in the 80-120 KB band as the
verifier measures it (os.path.getsize(p) // 1024). Source PNGs are never copied.

Per asset_map.rules: adjust QUALITY first, then width, and re-measure. Nothing is
cropped except the two slots whose rule explicitly says "centred 16:9 crop of the
1:1 master" (section2_card, section3_image). GA boards are downscaled
proportionally only and are NEVER cropped.

Line art (GA boards, technical diagrams) is far too compressible to reach the
80 KB floor at the asset map's declared q88 start, so quality is raised - and
lossless is preferred for the GA boards whenever it lands in band, because that
is the encoding that best preserves the dimension text the prompt requires to
stay legible.
"""
import json, os, io, sys, shutil
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

BUILD = r"D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\portable-conference-cabin\_build-inputs"
AMAP = os.path.join(BUILD, "PO-08-portable-conference-cabin-asset-map-v1.json")
REPO = r"C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\po08-portable-conference-cabin-20260906"

amap = json.load(open(AMAP, encoding="utf-8"))
PKG = amap["package_root"]
OUT_ROOT = os.path.join(REPO, amap["output_root"].replace("/", os.sep))

LO, HI = 80 * 1024, 121 * 1024 - 1        # //1024 lands in [80, 120]

def src_path(rel):
    return os.path.join(PKG, rel.replace("/", os.sep))

def encode_bytes(im, quality=None, lossless=False, method=6):
    b = io.BytesIO()
    if lossless:
        im.save(b, "WEBP", lossless=True, method=method)
    else:
        im.save(b, "WEBP", quality=quality, method=method)
    return b.getvalue()

def best_encoding(im, prefer_lossless=False):
    """Highest-fidelity encoding whose byte size lands in the band."""
    if prefer_lossless:
        data = encode_bytes(im, lossless=True)
        if LO <= len(data) <= HI:
            return data, "lossless"
    # Highest quality whose size is still <= HI. Binary search on a fast method,
    # then re-encode the winner at method=6; size is monotonic in quality, and the
    # final re-encode is only ever smaller, so the result stays inside the band.
    lo, hi, pick = 1, 100, None
    while lo <= hi:
        mid = (lo + hi) // 2
        if len(encode_bytes(im, quality=mid, method=4)) <= HI:
            pick = mid
            lo = mid + 1
        else:
            hi = mid - 1
    if pick is None:
        return None, None
    data = encode_bytes(im, quality=pick, method=6)
    if len(data) > HI:                       # method=6 should shrink, never grow
        for q in range(pick - 1, 0, -1):
            data = encode_bytes(im, quality=q, method=6)
            if len(data) <= HI:
                pick = q
                break
    best = (data, f"q{pick}")
    if len(best[0]) >= LO:
        return best
    # Even q100 is under the floor: fall back to lossless if that lands in band.
    data = encode_bytes(im, lossless=True)
    if LO <= len(data) <= HI:
        return data, "lossless"
    return best  # caller reports the miss

def load_rgb(rel):
    return Image.open(src_path(rel)).convert("RGB")

def centred_169(im):
    """Centred 16:9 crop of the FULL WIDTH of a 1:1 master."""
    w, h = im.size
    ch = round(w * 9 / 16)
    top = (h - ch) // 2
    return im.crop((0, top, w, top + ch))

results = []

def emit(rel_out, im, target_w, target_h, prefer_lossless=False, kind=""):
    im = im.resize((target_w, target_h), Image.LANCZOS)
    data, how = best_encoding(im, prefer_lossless=prefer_lossless)
    dest = os.path.join(OUT_ROOT, rel_out.replace("/", os.sep))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as fh:
        fh.write(data)
    kb = len(data) // 1024
    ok = 80 <= kb <= 120
    results.append({
        "kind": kind, "file": rel_out, "width": target_w, "height": target_h,
        "kb": kb, "encoding": how, "in_band": ok,
    })
    if not ok:
        print(f"  !! OUT OF BAND {rel_out}: {kb} KB via {how}")

# ---- 1. gallery: 36 squares, 1254 px, no crop -----------------------------
g = amap["rules"]["gallery"]
for size_slug, gal in amap["gallery_new"].items():
    for slide in gal["slides"]:
        im = load_rgb(slide["src"])
        emit(slide["out"], im, g["width_px"], g["width_px"], kind="gallery")

# ---- 2. section 3: 6 photographs, centred 16:9 crop, 1600 px --------------
r3 = amap["rules"]["section3_image"]
for size_slug, f in amap["section3_images"]["files"].items():
    im = centred_169(load_rgb(f["src"]))
    emit(f["out"], im, r3["width_px"], round(r3["width_px"] * 9 / 16), kind="section3")

# ---- 3. section 2 card: 1 photograph, centred 16:9 crop, 1600 px ----------
r2 = amap["rules"]["section2_card"]
c = amap["section2_card"]
im = centred_169(load_rgb(c["src"]))
emit(c["out"], im, r2["width_px"], round(r2["width_px"] * 9 / 16), kind="section2_card")

# ---- 4. GA boards: 1800 px, proportional downscale ONLY, never cropped ----
rg = amap["rules"]["ga_board"]
for size_slug, f in amap["ga_boards"]["files"].items():
    im = load_rgb(f["src"])
    w = rg["width_px"]
    h = round(im.height * w / im.width)
    emit(f["out"], im, w, h, prefer_lossless=True, kind="ga_board")

# ---- 5. description images: native 16:9 masters, downscale only ------------
rd = amap["rules"]["description_image"]
for key, f in amap["description_images"]["files"].items():
    im = load_rgb(f["src"])
    w = rd["width_px"]
    h = round(im.height * w / im.width)
    emit(f["out"], im, w, h, kind="description")

# ---- 6. technical diagrams: downscale only --------------------------------
rs = amap["rules"]["spec_diagram"]
for key, f in amap["spec_diagrams"].items():
    im = load_rgb(f["src"])
    w = rs["width_px"]
    h = round(im.height * w / im.width)
    emit(f["out"], im, w, h, prefer_lossless=True, kind="spec_diagram")

# ---- 7. technical PDF ------------------------------------------------------
pdf_dest = os.path.join(REPO, amap["spec_pdf"]["out"].replace("/", os.sep))
os.makedirs(os.path.dirname(pdf_dest), exist_ok=True)
shutil.copyfile(src_path(amap["spec_pdf"]["src"]), pdf_dest)
pdf_kb = os.path.getsize(pdf_dest) // 1024

out_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), "po08-measurements.json")
json.dump({"images": results, "pdf_kb": pdf_kb}, open(out_json, "w", encoding="utf-8"), indent=1)

bad = [r for r in results if not r["in_band"]]
print(f"\nencoded {len(results)} images, PDF {pdf_kb} KB")
print(f"in band: {len(results) - len(bad)} / {len(results)}")
if bad:
    print("OUT OF BAND:")
    for r in bad:
        print("  ", r)
else:
    print("every output is inside the 80-120 KB band")
