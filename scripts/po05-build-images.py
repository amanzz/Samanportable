#!/usr/bin/env python3
"""PO-05 Portable Mobile Laboratory - encode every published image from the
approved package.

Rules are read from the signed asset map, never hard-coded here:
  * every browser-fetched file is WebP and lands inside the 80-120 KB band;
  * gallery slides re-encode from the PNG masters in <size>/_master/, never from
    the supplied full-size WebP (those run 88-236 KB, mostly outside the band);
  * nothing is cropped - quality is adjusted first, then width, then re-measured;
  * no source PNG is ever copied into public/.

The 10x10 gallery ships FOUR slides. SAMAN's 5 Sep 2026 ruling holds out
10x10/02-rear-angle and 10x10/03-side-elevation (the rendered body reads ~12-14 ft
against a GA that fixes 10 ft 0 in square). That is deliberate; the asset map's
gallery_new carries only the four published slides for that size.

Writes scripts/po05-image-measurements.json - the measurement table for the PR.
"""
import json, os, io, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKG = r"D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\portable-mobile-laboratory"
AMAP = json.load(open(os.path.join(ROOT, "content", "po-05",
    "PO-05-portable-mobile-laboratory-asset-map-v1.json"), encoding="utf-8"))

BAND_LO_KB, BAND_HI_KB = AMAP["rules"]["webp_size_band_kb"]
OUT_ROOT = os.path.join(ROOT, AMAP["output_root"].replace("/", os.sep))


def encode(src_rel, out_rel, width, q_start, slot, crop_169=False):
    src = os.path.join(PKG, src_rel.replace("/", os.sep))
    if not os.path.exists(src):
        raise SystemExit("MISSING SOURCE: " + src)
    if src.lower().endswith(".png") is False and src.lower().endswith(".webp"):
        raise SystemExit("asset map points at a WebP for " + out_rel)
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGB")
    if crop_169:
        # PO-05-R2 change 1/2: the gallery masters are 1:1 and the Section 3 and
        # Section 2 slots are 16:9. Take a CENTRED 16:9 crop - full width, equal
        # trim top and bottom. This is the sanctioned case in the standing rule
        # ("crop only to reach the slot's ratio, never to reduce file size").
        cw, ch = im.size
        nh = int(round(cw * 9 / 16))
        if nh < ch:
            top = (ch - nh) // 2
            im = im.crop((0, top, cw, top + nh))
    sw, sh = im.size

    def render(w, q):
        # Downscale proportionally only. Never upscale, never crop.
        w = min(w, sw)
        h = max(1, int(round(sh * w / sw)))
        frame = im if (w, h) == (sw, sh) else im.resize((w, h), Image.LANCZOS)
        buf = io.BytesIO()
        frame.save(buf, "WEBP", quality=q, method=6)
        return buf.getvalue(), w, h

    tried = []
    # Quality first, at the declared width; only then width.
    for w in [width, int(width * 0.92), int(width * 0.85), int(width * 0.78)]:
        data, rw, rh = render(w, q_start)
        kb = len(data) // 1024
        tried.append((rw, q_start, kb))
        if BAND_LO_KB <= kb <= BAND_HI_KB:
            return write(out_rel, data, rw, rh, q_start, slot, src_rel, tried)
        if kb > BAND_HI_KB:
            lo, hi, best = 1, q_start, None
            while lo <= hi:                      # largest q that fits under the cap
                mid = (lo + hi) // 2
                d, mw, mh = render(w, mid)
                k = len(d) // 1024
                if k <= BAND_HI_KB:
                    best = (d, mw, mh, mid, k); lo = mid + 1
                else:
                    hi = mid - 1
            if best and BAND_LO_KB <= best[4]:
                tried.append((best[1], best[3], best[4]))
                return write(out_rel, best[0], best[1], best[2], best[3], slot, src_rel, tried)
        else:
            lo, hi, best = q_start, 100, None
            while lo <= hi:                      # smallest q that clears the floor
                mid = (lo + hi) // 2
                d, mw, mh = render(w, mid)
                k = len(d) // 1024
                if k >= BAND_LO_KB:
                    best = (d, mw, mh, mid, k); hi = mid - 1
                else:
                    lo = mid + 1
            if best and best[4] <= BAND_HI_KB:
                tried.append((best[1], best[3], best[4]))
                return write(out_rel, best[0], best[1], best[2], best[3], slot, src_rel, tried)
            break   # a narrower frame only gets smaller; widening would upscale
    raise SystemExit("OUT OF BAND after quality and width sweep: %s %s" % (out_rel, tried))


def write(out_rel, data, w, h, q, slot, src_rel, tried):
    path = os.path.join(OUT_ROOT, out_rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "wb").write(data)
    kb = len(data) // 1024
    return {"slot": slot, "file": AMAP["output_root"].replace("public", "") + "/" + out_rel,
            "source": src_rel, "width": w, "height": h, "quality": q,
            "bytes": len(data), "kb": kb, "attempts": tried}


def main():
    rules, rows = AMAP["rules"], []
    for size, gal in AMAP["gallery_new"].items():
        for s in gal["slides"]:
            rows.append(encode(s["src"], s["out"], rules["gallery"]["width_px"],
                               rules["gallery"]["quality_start"], "gallery/" + size))
    for size, f in AMAP["ga_boards"]["files"].items():
        rows.append(encode(f["src"], f["out"], rules["ga_board"]["width_px"],
                           rules["ga_board"]["quality_start"], "ga/" + size))
    # PO-05-R2 change 1 (SAMAN ruling 6 Sep 2026): Section 3's left column shows a
    # PHOTOGRAPH of the unit, not the 2D GA drawing. The GA boards move to the
    # Specifications tab and are still never cropped.
    # SAMAN ruling 6 Sep 2026 (PO-05-R2, second pass): ship the master at its native
    # 1:1, NOT a 16:9 crop. The shared explorer panel is a fixed aspect-[4/3]
    # object-cover box, so a 16:9 file is cropped a second time by 12.5% per side and
    # both ends of the unit are clipped. The design lock feeds this same box a 1:1
    # file (porta-cabin-ga-plan-20x10.webp, 1254x1254), where object-cover trims only
    # sky and foreground. Matching the lock is what keeps the whole unit in frame.
    for size, f in AMAP["section3_images"]["files"].items():
        rows.append(encode(f["src"], f["out"], rules["gallery"]["width_px"],
                           rules["gallery"]["quality_start"], "section3/" + size))
    # PO-05-R2 change 2: the split card is a photograph too, matching the lock's own
    # card, centre-cropped from the 1:1 interior master to the slot's native 16:9.
    c = AMAP["section2_card"]
    rows.append(encode(c["src"], c["out"], rules["section2_card"]["width_px"],
                       rules["section2_card"]["quality_start"], "section2",
                       crop_169=True))
    # The six 16:9 frames live INSIDE the Description tab, at the anchors the copy pack
    # encodes - the same way the porta-cabins design lock publishes its own six. There
    # is no image band between Section 2 and Section 3 (PO-05-R1, 6 Sep 2026).
    for slot, f in AMAP["description_images"]["files"].items():
        rows.append(encode(f["src"], f["out"], rules["description_image"]["width_px"],
                           rules["description_image"]["quality_start"], "description/" + f["size"]))
    for k, f in AMAP["spec_diagrams"].items():
        rows.append(encode(f["src"], f["out"], rules["spec_diagram"]["width_px"],
                           rules["spec_diagram"]["quality_start"], "diagram/" + k))

    out = os.path.join(ROOT, "scripts", "po05-image-measurements.json")
    json.dump(rows, open(out, "w", encoding="utf-8"), indent=1)
    bad = [r for r in rows if not (BAND_LO_KB <= r["kb"] <= BAND_HI_KB)]
    print("%d outputs, %d outside the %d-%d KB band" % (len(rows), len(bad), BAND_LO_KB, BAND_HI_KB))
    for r in rows:
        print("  %-78s %5dx%-5d q%-3d %4d KB" % (r["file"], r["width"], r["height"], r["quality"], r["kb"]))
    if bad:
        sys.exit(1)


if __name__ == "__main__":
    main()
