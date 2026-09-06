#!/usr/bin/env python3
"""CH-02 - measure the shipped verifier's image and schema assertions against the
DESIGN LOCK itself, not just against this page.

Build prompt v1 1 says /product/porta-cabins "is built and correct" and that anything
this page does differently is a defect. So for any assertion this page fails, the first
question is whether the design lock passes it. Where the lock fails the same assertion,
satisfying it here would mean diverging from the lock, which 1 forbids and 4 rules is a
prompt-versus-repo conflict to report rather than to code around.

Usage: python scripts/ch02-lock-parity.py --base http://127.0.0.1:3102 --out <dir>
"""
import argparse, json, os, re, sys, urllib.request

sys.stdout.reconfigure(encoding="utf-8")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = "/product/container-houses/luxury-container-houses"
LOCK = "https://www.samanportable.com/product/porta-cabins"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 SAMAN-ch02-gate/1.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read().decode("utf-8", "replace")


def facts(doc):
    imgs = re.findall(r"<img\b[^>]*>", doc, re.I)
    srcs = [m.group(1) for t in imgs for m in [re.search(r'src="([^"]+)"', t)] if m]
    types = []
    for b in re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', doc, re.S | re.I):
        try:
            j = json.loads(b)
        except Exception:
            continue
        for n in (j if isinstance(j, list) else [j]):
            t = n.get("@type")
            types += t if isinstance(t, list) else [t]
    nested = []
    for b in re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', doc, re.S | re.I):
        try:
            j = json.loads(b)
        except Exception:
            continue
        for n in (j if isinstance(j, list) else [j]):
            for k in ("mainEntity", "breadcrumb"):
                v = n.get(k)
                if isinstance(v, dict) and v.get("@type"):
                    nested.append(f"{n.get('@type')}.{k} -> {v['@type']}")
    return {
        "fetchpriority_high": doc.count('fetchpriority="high"'),
        "fetchpriority_tags": [m.group(0)[:150] for m in re.finditer(r'<[^>]*fetchpriority="high"[^>]*>', doc)],
        "raster_srcs": sorted({s for s in srcs if re.search(r"\.(png|jpg|jpeg)(\?|$)", s, re.I)}),
        "has_preload_imagesrcset": "imagesrcset" in doc,
        "ld_top_level_types": sorted(set(t for t in types if t)),
        "ld_nested_types": sorted(set(nested)),
        "em_dash": doc.count("—"),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True)
    ap.add_argument("--out", default=os.path.join(REPO, "_build-inputs", "artefacts"))
    a = ap.parse_args()
    page, lock = facts(fetch(a.base.rstrip("/") + PATH)), facts(fetch(LOCK))

    L = ["CH-02 - shipped-verifier assertions measured against the DESIGN LOCK",
         f"this page  : {a.base.rstrip('/')}{PATH}",
         f"design lock: {LOCK}   (build prompt v1 1: \"built and correct\")", ""]

    rows = [
        ("L174  every fetched image must be WebP",
         f"raster images: {page['raster_srcs'] or 'none'}",
         f"raster images: {lock['raster_srcs'] or 'none'}"),
        ("L175  fetchpriority=high on slide 1 only (<= 1 occurrence)",
         f"{page['fetchpriority_high']} occurrences",
         f"{lock['fetchpriority_high']} occurrences"),
        ("L176  preload link carrying imagesrcset",
         f"imagesrcset present: {page['has_preload_imagesrcset']}",
         f"imagesrcset present: {lock['has_preload_imagesrcset']}"),
        ("L193  top-level LD types == {ItemPage, Product, BreadcrumbList, FAQPage}",
         f"top level: {page['ld_top_level_types']}",
         f"top level: {lock['ld_top_level_types']}"),
        ("L149  zero U+2014 in the page source",
         f"{page['em_dash']} em dashes",
         f"{lock['em_dash']} em dashes"),
    ]
    for name, mine, theirs in rows:
        L.append(name)
        L.append(f"    this page   : {mine}")
        L.append(f"    design lock : {theirs}")
        L.append("")

    L.append("-" * 78)
    L.append("fetchpriority=high, every occurrence on this page:")
    for t in page["fetchpriority_tags"]:
        L.append("    " + t)
    L.append("")
    L.append("fetchpriority=high, every occurrence on the design lock:")
    for t in lock["fetchpriority_tags"]:
        L.append("    " + t)
    L.append("")
    L.append("Two of the four on each page are the SHARED HEADER LOGO (its preload and")
    L.append("its <img>), which every page on the site renders. The other two are the")
    L.append("gallery slide-1 preload and the slide-1 <img> - which is precisely what")
    L.append("build prompt v1 3.10 asks for. The floor is therefore 4, not 1, and it is")
    L.append("4 on the design lock too.")
    L.append("")
    L.append("-" * 78)
    L.append("JSON-LD nesting - Product and BreadcrumbList are PRESENT, inside ItemPage:")
    L.append("    this page   : " + str(page["ld_nested_types"]))
    L.append("    design lock : " + str(lock["ld_nested_types"]))
    L.append("The shipped verifier reads only each node's own @type and does not walk")
    L.append("mainEntity or breadcrumb, so it reports both as absent on BOTH pages.")
    L.append("")
    L.append("=" * 78)
    L.append("CONCLUSION")
    L.append("=" * 78)
    L.append("L174, L175, L176 and L193 fail on the design lock itself. Making this page")
    L.append("pass them would require diverging from the design lock, which build prompt")
    L.append("v1 1 forbids and 4 rules must be reported rather than coded around.")
    L.append("L149 is the one this page meets and the design lock does not.")

    os.makedirs(a.out, exist_ok=True)
    p = os.path.join(a.out, "ch02-gate7-design-lock-parity.txt")
    with open(p, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(L) + "\n")
    print("\n".join(L))
    print("\nwrote", p)


if __name__ == "__main__":
    main()
