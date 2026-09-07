#!/usr/bin/env python3
"""SCH-02: install the 49 approved WebPs into public/ from the signed asset map.

The package files are the approved encodes. They are NOT re-encoded here: the only
change is removal of the ancillary `C2PA` RIFF chunk that was appended after
SCH-02-shipping-container-homes-asset-map-v1.json was written. That chunk is why every
file measures ~5.6 KB above the map's declared `bytes` and above the 120 KB ceiling the
verifier asserts. Dropping it restores each file to the map's exact declared byte count,
leaves the `VP8 ` bitstream byte-identical, and matches every other image already shipped
in this repo (all of which are bare VP8 streams with no ancillary chunks).
"""
import json, os, struct, shutil, sys

PKG_ROOT = r"D:\Project-shekhar\all-product-images\Hub page (Container Houses)\shipping-container-homes"
MAP = os.path.join(PKG_ROOT, "_build-inputs", "SCH-02-shipping-container-homes-asset-map-v1.json")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(REPO, "public", "images", "products", "shipping-container-homes")

GROUP_DIR = {
    "02-section3-drawings": "size-section",
    "03-section2-split-card": "section2",
    "04-description-images": "description",
}


def riff_chunks(data):
    out, i = [], 12
    while i + 8 <= len(data):
        fourcc = data[i:i + 4]
        size = struct.unpack("<I", data[i + 8 - 4:i + 8])[0]
        out.append((fourcc, i, size))
        i += 8 + size + (size & 1)
    return out


def strip_ancillary(data):
    """Keep only the image chunks; drop C2PA/EXIF/XMP. Returns (bytes, dropped)."""
    keep = []
    dropped = []
    for fourcc, off, size in riff_chunks(data):
        blob = data[off:off + 8 + size + (size & 1)]
        if fourcc in (b"VP8 ", b"VP8L", b"VP8X", b"ALPH", b"ANIM", b"ANMF", b"ICCP"):
            keep.append(blob)
        else:
            dropped.append((fourcc.decode("latin1"), size))
    body = b"".join(keep)
    out = b"RIFF" + struct.pack("<I", 4 + len(body)) + b"WEBP" + body
    return out, dropped


def webp_size(data):
    for fourcc, off, size in riff_chunks(data):
        if fourcc == b"VP8 ":
            b = data[off + 8:off + 8 + size]
            j = b.find(b"\x9d\x01\x2a")
            w = struct.unpack("<H", b[j + 3:j + 5])[0] & 0x3FFF
            h = struct.unpack("<H", b[j + 5:j + 7])[0] & 0x3FFF
            return w, h
    raise ValueError("no VP8 chunk")


def main():
    amap = json.load(open(MAP, encoding="utf-8"))
    rows = []
    for e in amap["images"]:
        src = os.path.join(PKG_ROOT, e["prebuilt_webp"].replace("/", os.sep))
        group = e["group"]
        if group == "01-gallery-webp":
            sub = e["slot"].split(".")[1]           # gallery.20x8.01 -> 20x8
        else:
            sub = GROUP_DIR[group]
        dest_dir = os.path.join(PUB, sub)
        os.makedirs(dest_dir, exist_ok=True)
        dest = os.path.join(dest_dir, os.path.basename(src))

        raw = open(src, "rb").read()
        out, dropped = strip_ancillary(raw)
        w, h = webp_size(out)
        with open(dest, "wb") as fh:
            fh.write(out)

        declared = e["bytes"]
        rows.append({
            "slot": e["slot"],
            "dest": "/" + os.path.relpath(dest, os.path.join(REPO, "public")).replace(os.sep, "/"),
            "package_bytes": len(raw),
            "shipped_bytes": len(out),
            "map_declared_bytes": declared,
            "matches_map": len(out) == declared,
            "dropped_chunks": dropped,
            "px": "%dx%d" % (w, h),
            "declared_px": e["output_px"],
            "px_ok": "%dx%d" % (w, h) == e["output_px"],
            "in_band": 80 * 1024 <= len(out) <= 120 * 1024,
            "alt": e["alt"],
        })

    bad = [r for r in rows if not (r["matches_map"] and r["px_ok"] and r["in_band"])]
    json.dump(rows, open(os.path.join(REPO, "_build-inputs", "artefacts", "sch02-image-install-ledger.json"), "w",
                         encoding="utf-8"), indent=1, ensure_ascii=False)
    print("installed %d files" % len(rows))
    print("byte-exact vs asset map: %d/%d" % (sum(r["matches_map"] for r in rows), len(rows)))
    print("px-exact vs asset map:   %d/%d" % (sum(r["px_ok"] for r in rows), len(rows)))
    print("inside 80-120 KB band:   %d/%d" % (sum(r["in_band"] for r in rows), len(rows)))
    for r in bad:
        print("  BAD", r["slot"], r["shipped_bytes"], r["map_declared_bytes"], r["px"], r["declared_px"])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
