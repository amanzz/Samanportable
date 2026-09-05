#!/usr/bin/env python3
"""PO-02 template conformance gate 5: DOM checks on the preview HTML.

Gate 2 (component-order assertion) and gate 1 (structural diff) live in structure.py.

Usage: python gates.py <preview-url-or-file> <porta-cabins-url-or-file> <copy-json>
"""
import html as H
import json
import re
import sys
from urllib.request import Request, urlopen


def fetch(src):
    if src.startswith("http"):
        return urlopen(Request(src, headers={"User-Agent": "Mozilla/5.0 PO02-gates"})).read().decode("utf-8", "ignore")
    return open(src, encoding="utf-8", errors="ignore").read()


def to_text(doc):
    stripped = re.sub(r"<script.*?</script>|<style.*?</style>", "", doc, flags=re.S)
    return H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", stripped)))


def main():
    page, ref, copy_path = sys.argv[1], sys.argv[2], sys.argv[3]
    copy = json.load(open(copy_path, encoding="utf-8"))
    doc = fetch(page)
    text = to_text(doc)
    fails = 0

    def check(name, ok, ev=""):
        nonlocal fails
        print(("PASS " if ok else "FAIL ") + name + ("  | " + str(ev) if ev != "" else ""))
        if not ok:
            fails += 1

    # ---------------------------------------------------------------- gate 5
    print()
    print("=" * 78)
    print("GATE 5 - DOM checks on the preview HTML")
    print("=" * 78)
    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", doc, re.S)
    check("exactly one H1", len(h1s) == 1, len(h1s))

    heads = re.findall(r"<(h[1-6])[^>]*>(.*?)</\1>", doc, re.S)
    empty_heads = [h for h in heads if not re.sub("<[^>]+>", "", h[1]).strip()]
    check("no empty heading", not empty_heads, empty_heads[:3])

    imgs = re.findall(r"<img[^>]+>", doc)
    alts = [m.group(1) for m in (re.search(r'alt="([^"]*)"', i) for i in imgs) if m]
    check("every img carries an alt", len(alts) == len(imgs), f"{len(alts)}/{len(imgs)}")
    check("no empty alt", all(a.strip() for a in alts), sum(1 for a in alts if not a.strip()))
    dups = sorted({a for a in alts if alts.count(a) > 1})
    check("no duplicate alt", not dups, dups[:5])
    check(
        "explicit width and height on every img",
        all(re.search(r'\bwidth="\d+"', i) and re.search(r'\bheight="\d+"', i) for i in imgs),
        len(imgs),
    )

    body = doc.split("<body", 1)[-1]
    check("no U+2014 em dash in body text", "—" not in body)

    for tab in ["Description", "Specifications", "Shipping", "Reviews"]:
        check(f"tab panel present in fetched HTML: {tab}", tab in text)
    check("no Info tab", not re.search(r">\s*Info\s*<", doc))

    # normalise -, en dash and " to " between digits before grepping
    norm = re.sub(r"(\d)\s*(?:-|–|to)\s*(\d)", r"\1-\2", text)
    for bad in ["coming soon", "available on request", "contact us for details", "placeholder", "TBD"]:
        hits = [m.start() for m in re.finditer(re.escape(bad), norm, re.I)]
        check(f"zero hits for {bad!r}", not hits, hits[:3])

    # ---------------------------------------------------------------- reference
    print()
    print("=" * 78)
    print("Design-lock reference: /product/porta-cabins block order")
    print("=" * 78)
    rdoc = fetch(ref)
    rtext = to_text(rdoc)
    for label, needle in [
        ("Explore the Range", "Explore the Range"),
        ("calculator", "PRICE IT YOURSELF"),
        ("You may also like", "You may also like"),
        ("Product Details", "Product Details"),
        ("Description tab", "Description"),
        ("Specifications tab", "Specifications"),
        ("Shipping tab", "Shipping"),
        ("Reviews tab", "Reviews"),
    ]:
        print(f"  {rtext.find(needle):>8}  {label}")

    print()
    print("RESULT:", "PASS" if fails == 0 else f"FAIL ({fails} checks)")
    sys.exit(0 if fails == 0 else 1)


if __name__ == "__main__":
    main()
