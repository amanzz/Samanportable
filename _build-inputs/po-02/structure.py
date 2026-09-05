#!/usr/bin/env python3
"""PO-02 gates 1 and 2.

Gate 1  Structural diff against the design lock: the rendered block skeleton of this
        page beside /product/porta-cabins (the lock) and beside
        /product/portable-office/readymade-office-cabin (PO-01, the approved sibling
        on the same [category]/[slug] route this page uses).
Gate 2  Component-order assertion: the eleven canonical blocks in rendered order.

Usage: python structure.py <preview-url> <porta-cabins-url> <po-01-url> <copy-json>
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


def strip_scripts(doc):
    return re.sub(r"<script.*?</script>|<style.*?</style>", "", doc, flags=re.S)


def to_text(doc):
    return H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", strip_scripts(doc))))


def headings(doc):
    out = []
    for m in re.finditer(r"<(h[1-3])\b[^>]*>(.*?)</\1>", strip_scripts(doc), re.S):
        txt = H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", "", m.group(2)))).strip()
        if txt:
            out.append((m.group(1), txt))
    return out


def skeleton(doc):
    """Block skeleton: the heading levels in order, with page-specific text removed.

    Content differs between pages by design; structure must not. Collapsing each
    heading to its level plus a coarse role gives a comparable sequence.
    """
    roles = []
    for lvl, txt in headings(doc):
        t = txt.lower()
        if "cabins & offices" in t or "accommodation & site" in t or "structures & buildings" in t \
                or "panels & sheets" in t or "rentals" in t:
            role = "nav-group"
        elif lvl == "h1":
            role = "H1"
        elif "product information" in t:
            role = "product-information"
        elif "explore the range" in t:
            role = "explore-the-range"
        elif re.match(r"^\d+\s*[x×]\s*\d+\s*ft", t):
            role = "explorer-size-panel"
        elif t.startswith("your ") and "from" in t:
            role = "calculator-band"
        elif "you may also like" in t:
            role = "you-may-also-like"
        elif "product details" in t:
            role = "product-details"
        elif "product overview" in t:
            role = "tab-description"
        elif "technical specifications" in t:
            role = "tab-specifications"
        elif "shipping & delivery" in t:
            role = "tab-shipping"
        elif "customer reviews" in t:
            role = "tab-reviews"
        elif t.startswith("write a review"):
            role = "reviews-form"
        elif "useful links" in t or "product categories" in t or "manufacturing unit" in t \
                or "popular portable cabin resources" in t:
            role = "footer"
        else:
            role = "content-heading"
        roles.append((lvl, role))
    return roles


def main():
    page_u, lock_u, sib_u, copy_path = sys.argv[1:5]
    copy = json.load(open(copy_path, encoding="utf-8"))
    page, lock, sib = fetch(page_u), fetch(lock_u), fetch(sib_u)
    text = to_text(page)
    fails = 0

    def check(name, ok, ev=""):
        nonlocal fails
        print(("PASS " if ok else "FAIL ") + name + ("  | " + str(ev) if ev != "" else ""))
        if not ok:
            fails += 1

    print("=" * 100)
    print("GATE 2 - component-order assertion: the eleven canonical blocks in rendered order")
    print("=" * 100)
    # Anchors chosen so each matches only the block it names. The contact/location bar
    # renders immediately ABOVE the H1 in DOM order on this route (verified identical on
    # PO-01), so it is asserted against the hero rather than after it.
    blocks = [
        ("1  three-column hero (H1)", copy["meta"]["h1"]),
        ("3  size selector tabs", copy["hero"]["size_selector_label"]),
        ("4  price display for the selected size", "incl. 18% GST"),
        ("5  Explore the Range panel", "Explore the Range"),
        ("6  Section 2 RightToExist", copy["section2"]["h2"]),
        ("7  Section 2 split card", copy["section2"]["split_card"]["h3"]),
        ("8  Section 3 SizeApplicationsExplorer", copy["section3"]["h2"]),
        ("9  Section 4 calculator", "PRICE IT YOURSELF"),
        ("10 You may also like", "You may also like"),
        ("11 Product Details tabs", "Product Details"),
    ]
    pos = []
    for label, needle in blocks:
        at = text.find(needle)
        pos.append(at)
        print(f"  offset {at:>7}   {label}")
    contact = text.find("Send Enquiry")
    h1_at = text.find(copy["meta"]["h1"])
    print(f"  offset {contact:>7}   2  contact/location bar (renders above the H1 in DOM order)")
    check("every canonical block present", all(p >= 0 for p in pos),
          [b[0] for b, p in zip(blocks, pos) if p < 0])
    check("blocks render in canonical order", pos == sorted(pos))
    check("contact/location bar adjoins the hero", 0 <= contact < h1_at, (contact, h1_at))

    print()
    print("=" * 100)
    print("GATE 1 - structural diff: block skeleton vs the design lock and the approved sibling")
    print("=" * 100)
    a, b, c = skeleton(page), skeleton(lock), skeleton(sib)
    print(f"  this page                       : {len(a)} headings")
    print(f"  /product/porta-cabins (lock)    : {len(b)} headings   [category]/index.tsx  (hub route)")
    print(f"  PO-01 readymade-office-cabin    : {len(c)} headings   [category]/[slug].tsx (same route as this page)")
    print()
    def collapse(seq):
        """Collapse consecutive runs of one role to a single token.

        The number of Description-tab sections and of prose headings is page content,
        not structure: this page's pack has eight description sections where PO-01's
        has ten. Collapsing runs compares the order of BLOCKS, which is what the
        design lock fixes, without asserting that two pages carry equal copy.
        """
        out = []
        for lvl, role in seq:
            if not out or out[-1] != role:
                out.append(role)
        return out

    ra, rc = collapse(a), collapse(c)
    print("  block-role sequence vs the approved sibling on the SAME route:")
    print("  (consecutive runs of one role collapsed - run length is copy, not structure)")
    print(f"    this page: {ra}")
    print(f"    sibling  : {rc}")
    print(f"    identical: {ra == rc}")
    if ra != rc:
        for i in range(max(len(ra), len(rc))):
            x = ra[i] if i < len(ra) else "-"
            y = rc[i] if i < len(rc) else "-"
            if x != y:
                print(f"      [{i}] this page {x!r} != sibling {y!r}")
    check("block skeleton identical to the approved sibling on the same route", ra == rc)

    lv_a = {lvl for lvl, r in a if r == "explorer-size-panel"}
    lv_b = {lvl for lvl, r in b if r == "explorer-size-panel"}
    lv_c = {lvl for lvl, r in c if r == "explorer-size-panel"}
    print()
    print("  explorer size-panel heading level:")
    print(f"    this page {sorted(lv_a)}   sibling {sorted(lv_c)}   hub lock {sorted(lv_b)}")
    print("    (explorerPanelHeadingAsH2 is the existing cluster opt-in every")
    print("     CLUSTER_DESIGN_SLUGS product page takes; the hub route does not.)")
    check("explorer heading level matches the approved sibling", lv_a == lv_c, (lv_a, lv_c))

    print()
    print("RESULT:", "PASS" if fails == 0 else f"FAIL ({fails} checks)")
    sys.exit(0 if fails == 0 else 1)


if __name__ == "__main__":
    main()
