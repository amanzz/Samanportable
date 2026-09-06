#!/usr/bin/env python3
"""PO-06 Portable Construction Site Cabin - encode every published image from the
approved package.

Every rule is READ from the signed asset map, never hard-coded here:
  * every file a browser fetches is WebP and lands inside the 80-120 KB band;
  * nothing is cropped - quality is adjusted first, then width, then re-measured;
  * GA boards downscale proportionally only (the dimension text and the printed
    price block have to stay legible);
  * no source PNG is ever copied into public/.

Fifty images ship plus the technical PDF:
  36 gallery slides (six sizes x six slides: three exteriors then three interiors in
     file order 01-06, SAMAN's 6 Sep 2026 sanction, the same one PO-04 carries),
   6 GA specification boards,
   1 Section 2 split-card photograph (ruling 3 - a photograph, never a GA board),
   5 Description-tab frames (ruling 3 again: the 20x10 site exterior moved to the
     Section 2 card, so this tab carries five, not six),
   2 technical diagrams.

Description images 05 and 06 are read from 02-long-description-16x9/_repaired-16x9-v1/
(ruling 4). The pillared originals - a 1080x1080 square centred in a 1920x1080 frame
with 420 px of blurred pillar each side - are never referenced; the assertion at the
bottom of this file fails the build if they ever are.

Writes scripts/po06-image-measurements.json - the measurement table for the PR.
"""
import json, os, io, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AMAP = json.load(open(os.path.join(ROOT, "content", "po-06",
    "PO-06-construction-site-cabin-asset-map-v1.json"), encoding="utf-8"))
PKG = AMAP["package_root"]

BAND_LO_KB, BAND_HI_KB = AMAP["rules"]["webp_size_band_kb"]
OUT_ROOT = os.path.join(ROOT, AMAP["output_root"].replace("/", os.sep))
WEB_ROOT = "/" + AMAP["output_root"].replace("public/", "")


def encode(src_rel, out_rel, width, q_start, slot):
    src = os.path.join(PKG, src_rel.replace("/", os.sep))
    if not os.path.exists(src):
        raise SystemExit("MISSING SOURCE: " + src)
    if not src.lower().endswith(".png"):
        raise SystemExit("asset map points at a non-PNG master for " + out_rel)
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGB")
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
            return write(out_rel, data, rw, rh, q_start, slot, src_rel, tried, (sw, sh))
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
                return write(out_rel, best[0], best[1], best[2], best[3], slot, src_rel, tried, (sw, sh))
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
                return write(out_rel, best[0], best[1], best[2], best[3], slot, src_rel, tried, (sw, sh))
            break   # a narrower frame only gets smaller; widening would upscale
    raise SystemExit("OUT OF BAND after quality and width sweep: %s %s" % (out_rel, tried))


def write(out_rel, data, w, h, q, slot, src_rel, tried, src_size):
    path = os.path.join(OUT_ROOT, out_rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "wb").write(data)
    return {"slot": slot, "file": WEB_ROOT + "/" + out_rel, "out": out_rel,
            "source": src_rel, "source_size": "%dx%d" % src_size,
            "width": w, "height": h, "quality": q,
            "bytes": len(data), "kb": len(data) // 1024, "attempts": tried}


def main():
    rules, rows = AMAP["rules"], []
    for size, gal in AMAP["gallery_new"].items():
        for s in gal["slides"]:
            rows.append(encode(s["src"], s["out"], rules["gallery"]["width_px"],
                               rules["gallery"]["quality_start"], "gallery/" + size))
    for size, g in AMAP["ga_boards"].items():
        rows.append(encode(g["src"], g["out"], rules["ga_board"]["width_px"],
                           rules["ga_board"]["quality_start"], "ga/" + size))
    c = AMAP["section2_card"]
    rows.append(encode(c["src"], c["out"], rules["section2_card"]["width_px"],
                       rules["section2_card"]["quality_start"], "section2"))
    # Five, not six: the 20x10 site exterior became the Section 2 card (ruling 3).
    for k, d in sorted(AMAP["description_images"].items()):
        rows.append(encode(d["src"], d["out"], rules["description"]["width_px"],
                           rules["description"]["quality_start"], "description/" + k))
    for k, d in sorted(AMAP["spec_diagrams"].items()):
        rows.append(encode(d["src"], d["out"], rules["spec_diagram"]["width_px"],
                           rules["spec_diagram"]["quality_start"], "diagram/" + k))

    # The technical PDF is copied byte-for-byte; it is not an image and has no band.
    pdf_src = os.path.join(PKG, AMAP["spec_pdf"]["src"].replace("/", os.sep))
    pdf_out = os.path.join(OUT_ROOT, AMAP["spec_pdf"]["out"].replace("/", os.sep))
    os.makedirs(os.path.dirname(pdf_out), exist_ok=True)
    open(pdf_out, "wb").write(open(pdf_src, "rb").read())

    out = os.path.join(ROOT, "scripts", "po06-image-measurements.json")
    json.dump(rows, open(out, "w", encoding="utf-8"), indent=1)

    bad = [r for r in rows if not (BAND_LO_KB <= r["kb"] <= BAND_HI_KB)]
    print("%-74s %-11s %-5s %s" % ("FILE", "W x H", "q", "KB"))
    for r in rows:
        print("%-74s %5dx%-5d q%-4d %4d" % (r["file"], r["width"], r["height"], r["quality"], r["kb"]))
    print("\nPDF  %s  %d KB" % (WEB_ROOT + "/" + AMAP["spec_pdf"]["out"], os.path.getsize(pdf_out) // 1024))
    print("\n%d image outputs, %d outside the %d-%d KB band"
          % (len(rows), len(bad), BAND_LO_KB, BAND_HI_KB))

    # No source PNG may ever land under public/.
    strays = [os.path.join(dp, f) for dp, _, fs in os.walk(OUT_ROOT) for f in fs
              if not (f.endswith(".webp") or f.endswith(".pdf"))]
    if strays:
        raise SystemExit("non-WebP/PDF under the output root: " + repr(strays))
    # Ruling 4 - the pillared originals must never be referenced.
    for k in ("desc_04", "desc_05"):
        if "_repaired-16x9-v1" not in AMAP["description_images"][k]["src"]:
            raise SystemExit("description image %s is not the repaired 16:9 master" % k)
    if bad:
        sys.exit(1)


if __name__ == "__main__":
    main()
