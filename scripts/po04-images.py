#!/usr/bin/env python3
"""PO-04 Executive Portable Office - build the page's public image set.

Policy (build prompt step 9): COPY the prebuilt WebP derivative the approved v2
package already carries; a second lossy pass costs quality for nothing. Re-encode
from the PNG master ONLY where the prebuilt file is missing or fails the pack's own
80-120 KB band assertion - and then from the master, never from the delivered WebP,
so it stays a single generation of loss.

Encoder is the project's locked one: Pillow save(..., "WEBP", quality=q, method=6),
same as co00-images.py / lc07-images.py. Quality descends from the pack's declared
start until the file lands inside the band; deterministic, so --check reproduces it.

Nothing is cropped. Nothing is upscaled. No source PNG is copied into public/.
"""
import json, os, shutil, sys
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BI = r"D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\executive-portable-office\_build-inputs"
AMAP = os.path.join(BI, "PO-04-executive-portable-office-asset-map-v1.json")
COPY = os.path.join(BI, "PO-04-executive-portable-office-copy-v1.json")
BAND = (80 * 1024, 120 * 1024)

amap = json.load(open(AMAP, encoding="utf-8"))
copy = json.load(open(COPY, encoding="utf-8"))

# SAMAN ruling, 5 Sep 2026 (this session): the Section 2 split card must carry a
# realistic 16:9 render, never a GA board - the same correction already applied to
# SOC-01 (0c19817d) and PO-02 (d95a2ff3). The asset map names the 40x10 GA board for
# this slot; that is a known defect in the pack, not an instruction. The 40x10 wide
# overview is photographic, natively 16:9, names the size the card copy names, and is
# used nowhere else on the page (this route renders no page-scoped media band).
# The output PATH stays the one the signed asset map declares, because verify_po04.py
# section 9 asserts that exact path exists and is in band; only the bytes behind it
# change. The "-ga" in the filename is therefore now inaccurate and is flagged in the PR.
SECTION2_SOURCE_SIZE = "40x10"

# Block 7: the porta-cabins design lock renders no page-scoped media band between
# Section 2 and Section 3 - the split card is the only media element there, and no
# shared component on this route accepts page-scoped band images. Per the build
# prompt's own fallback the shared band is left untouched. The six wide overviews are
# still shipped because verify_po04.py asserts each media_band output path exists and
# is 80-120 KB; only the 40x10 is actually referenced by the page, as the Section 2
# card. The other five are reported as unused.
SHIP_WIDE = True


def measure(path):
    with Image.open(path) as im:
        w, h = im.size
    return w, h, os.path.getsize(path)


def encode(src_png, dst, width, q_start):
    """Downscale proportionally to `width` and step quality down into the band."""
    with Image.open(src_png) as im:
        im = im.convert("RGB")
        if im.width < width:
            raise SystemExit(f"REFUSE upscale: {src_png} is {im.width}px < {width}px")
        if im.width != width:
            h = round(im.height * width / im.width)
            im = im.resize((width, h), Image.LANCZOS)
        for q in range(q_start, 9, -1):
            im.save(dst, "WEBP", quality=q, method=6)
            if os.path.getsize(dst) <= BAND[1]:
                if os.path.getsize(dst) < BAND[0]:
                    raise SystemExit(f"{dst}: q{q} undershoots the band")
                return q
    raise SystemExit(f"{dst}: no quality lands in band")


rows, notes = [], []


def place(entry, out_rel, alt, expect_w, expect_h, slot):
    """Copy the prebuilt derivative; re-encode from the master only if it fails."""
    dst = os.path.join(REPO, out_rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    pre = entry.get("prebuilt_webp")
    how = "copied"
    if pre and os.path.isfile(pre):
        w, h, b = measure(pre)
        if BAND[0] <= b <= BAND[1] and w == expect_w and (expect_h is None or h == expect_h):
            shutil.copy2(pre, dst)
        else:
            q = encode(entry["source"], dst, expect_w, entry.get("quality_start", 90))
            how = f"re-encoded q{q} (prebuilt was {b/1024:.1f} KB, outside 80-120)"
            notes.append(f"{os.path.basename(out_rel)}: prebuilt {b/1024:.1f} KB out of band -> {how}")
    else:
        q = encode(entry["source"], dst, expect_w, entry.get("quality_start", 90))
        how = f"re-encoded q{q} (no prebuilt derivative)"
        notes.append(f"{os.path.basename(out_rel)}: {how}")
    w, h, b = measure(dst)
    assert BAND[0] <= b <= BAND[1], f"{out_rel} is {b/1024:.1f} KB, outside 80-120 KB"
    assert w == expect_w and (expect_h is None or h == expect_h), f"{out_rel} is {w}x{h}, expected {expect_w}x{expect_h}"
    assert alt, f"{out_rel} has no alt text"
    rows.append((slot, out_rel.replace("public/", "/"), w, h, b / 1024, how))


for e in amap["gallery"]:
    name = os.path.basename(e["output"])
    place(e, e["output"], copy["alt_text"]["gallery"][name], 1254, 1254, f"gallery {e['size']} slide {e['slide']}")

for e in amap["ga_boards"]:
    name = os.path.basename(e["output"])
    place(e, e["output"], copy["alt_text"]["ga_boards"][name], 1800, 1012, f"ga {e['size']}")

for e in amap["spec_diagrams"]:
    name = os.path.basename(e["output"])
    place(e, e["output"], copy["alt_text"]["diagrams"][name], 1600, 900, e["slot"])

wide = {e["size"]: e for e in amap["media_band"]}
card = wide[SECTION2_SOURCE_SIZE]
place(card, amap["section2_card"]["output"],
      "Wide view of the 40x10 ft executive portable office, the only size that arrives "
      "partitioned, showing the 400 sq ft shell that carries the manager room and the open bay",
      1600, 900, "section2 card")
if SHIP_WIDE:
    for e in amap["media_band"]:
        place(e, e["output"], copy["alt_text"]["wide"][os.path.basename(e["output"])], 1600, 900, f"wide {e['size']}")
    notes.append("media band: this route renders no page-scoped media band (block 7 does not exist "
                 "on the porta-cabins design lock), so the five wide overviews other than the 40x10 "
                 "are shipped only because verify_po04.py asserts their output paths, and are "
                 "referenced by nothing on the page.")

pdf = amap["spec_pdf"]
dst = os.path.join(REPO, pdf["output"].replace("/", os.sep))
os.makedirs(os.path.dirname(dst), exist_ok=True)
shutil.copy2(pdf["source"], dst)
notes.append(f"spec PDF: {pdf['output']} ({os.path.getsize(dst)/1024:.1f} KB)")

out = ["PO-04 Executive Portable Office - image measurement table",
       "Every output is WebP. Nothing cropped, nothing upscaled, no source PNG in public/.",
       "",
       "%-26s %-96s %6s %6s %9s  %s" % ("SLOT", "URL", "W", "H", "KB", "HOW")]
for r in sorted(rows):
    out.append("%-26s %-96s %6d %6d %9.1f  %s" % r)
kb = [r[4] for r in rows]
out += ["", f"{len(rows)} outputs, {min(kb):.1f}-{max(kb):.1f} KB, all inside the 80-120 KB band.", "", "NOTES"]
out += [f"  - {n}" for n in notes]
text = "\n".join(out) + "\n"
open(os.path.join(REPO, "_build-inputs", "po-04", "artefacts", "measurement-table.txt"), "w", encoding="utf-8").write(text)
print(text)
