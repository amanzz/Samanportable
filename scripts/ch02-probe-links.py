#!/usr/bin/env python3
"""Measure the HTTP status of every CH-02 cluster tile destination.

Run against the built page server; writes scripts/ch02-link-status.json, which
ch02-generate-page-data.py reads so that only destinations answering 200 are
rendered as tiles.
"""
import argparse, json, os, sys, urllib.request, urllib.error

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
copy = json.load(open(os.path.join(REPO, "content", "ch-02",
                                   "CH-02-luxury-container-houses-copy-v1.json"), encoding="utf-8"))

ap = argparse.ArgumentParser()
ap.add_argument("--base", required=True)
base = ap.parse_args().base.rstrip("/")

hrefs = sorted({t["href"] for key in ("explore_the_range", "you_may_also_like")
                for t in copy[key]["tiles"]})
out = {}
for href in hrefs:
    req = urllib.request.Request(base + href, headers={"User-Agent": "SAMAN-ch02-probe/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            out[href] = r.status
    except urllib.error.HTTPError as e:
        out[href] = e.code
    except Exception as exc:
        out[href] = f"error: {exc}"
    print(f"{out[href]}  {href}")

with open(os.path.join(HERE, "ch02-link-status.json"), "w", encoding="utf-8", newline="\n") as fh:
    json.dump(out, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("\nwrote scripts/ch02-link-status.json")
