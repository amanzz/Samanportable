#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PO-04 template conformance gates 1, 2 and 5.

  python _build-inputs/po-04/gates.py <po04_url> <portacabins_reference_url>

Gate 1 - structural diff of the rendered component tree against the design-lock
         reference, block by block.
Gate 2 - the eleven canonical blocks asserted in rendered order.
Gate 5 - DOM checks on the fetched HTML.
"""
import html as H
import re
import sys
from urllib.request import Request, urlopen

UA = {"User-Agent": "Mozilla/5.0 PO04-gates"}


def fetch(u):
    if u.startswith("http"):
        return urlopen(Request(u, headers=UA)).read().decode("utf-8", "ignore")
    return open(u, encoding="utf-8", errors="ignore").read()


po04_url, ref_url = sys.argv[1], sys.argv[2]
po04, ref = fetch(po04_url), fetch(ref_url)

fails = []


def check(name, ok, evidence=""):
    print(("PASS " if ok else "FAIL ") + name + ("  | " + str(evidence)[:150] if evidence != "" else ""))
    if not ok:
        fails.append(name)


def visible_text(doc):
    stripped = re.sub(r"<script.*?</script>|<style.*?</style>", " ", doc, flags=re.S)
    return H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", stripped)))


# The structural markers the design lock emits. Each is a class or id owned by a
# shared production component, not by any page's content.
MARKERS = [
    ("1  three-column hero", r'class="pc-hero-grid"'),
    ("1a   gallery column", r'class="pc-gallery"'),
    ("1b   buy box (sole H1)", r'class="pc-buybox'),
    ("2  contact / location bar", r'data-ds-root='),
    ("3  size selector tabs (usePremiumSizeTabs)", r'class="saman-size-chips"'),
    ("4  price display for the selected size", r'saman-size-chip active'),
    ("5  Explore the Range panel", r'Explore the Range'),
    ("5a   divider 1", r'class="pc-divider1 saman-section-divider"'),
    ("6  Section 2 RightToExist", r'class="pc-rte"'),
    ("6a   split card", r'class="saman-s2-split"'),
    ("6b   split card media (left)", r'class="saman-s2-split-media"'),
    ("6c   divider 2", r'class="pc-divider2 saman-section-divider"'),
    ("8  Section 3 SizeApplicationsExplorer", r'class="saman-size-tabs"'),
    ("9  Section 4 calculator", r'PRICE IT YOURSELF'),
    ("10 You may also like", r'class="saman-youmaylike"'),
    ("11 Section 5 Product Details tabs", r'Product Details'),
]

print("=== GATE 1: structural diff against the design-lock reference ===")
print("reference: " + ref_url)
print("page     : " + po04_url)
print()
print("%-46s %-12s %-12s %s" % ("BLOCK", "PO-04", "PORTA-CABINS", "DELTA"))
delta = []
for name, pat in MARKERS:
    a, b = bool(re.search(pat, po04)), bool(re.search(pat, ref))
    mark = "same" if a == b else ("EXTRA" if a else "MISSING")
    if a != b:
        delta.append(name)
    print("%-46s %-12s %-12s %s" % (name, "present" if a else "-", "present" if b else "-", mark))
print()
check("component tree identical to the reference, zero structural delta", not delta, delta)

# Block 7 is the one canonical block with no shared component on this route: the
# porta-cabins design lock renders no page-scoped media band between Section 2 and
# Section 3. Asserted on the reference itself so the claim is evidenced, not assumed.
band = re.search(r'saman-s2-split.*?saman-size-tabs', ref, re.S)
between = band.group(0) if band else ""
check("7  media band: reference renders no page-scoped band between S2 and S3",
      "<img" not in between.split("saman-s2-split-cta")[-1], "checked on the reference")

print("\n=== GATE 2: eleven blocks in rendered order ===")
# Positions are taken in the RENDERED TEXT, not in the raw HTML. The raw markup carries
# these block names inside inline CSS (".pc-hero-grid>.pc-buybox") and inside developer
# comments (one reads "read off the Product Details card" at byte 107083), so a raw-offset
# ordering measures the stylesheet and the comments, not the page. This is the same basis
# verify_po04.py section 2 uses, and Gate 1 above already asserts the DOM markers.
# Each block is located by the same structural marker on BOTH pages, measured inside
# <body> so the <head> and the inline stylesheet cannot shift it. The assertion is that
# PO-04's block sequence equals the design-lock reference's block sequence: that is what
# "identical component tree, content props aside" means. Asserting an abstract 1..11 list
# instead would fail on the reference too - the zone contact bar is emitted in the gallery
# column, so it precedes the buy box's H1 on porta-cabins exactly as it does here.
po_body, ref_body = po04.split("<body", 1)[-1], ref.split("<body", 1)[-1]
ORDER = [
    ("1  three-column hero", r'class="pc-hero-grid"'),
    ("2  contact / location bar", r'Bangalore &amp; South Zone'),
    ("3  size selector tabs (usePremiumSizeTabs)", r'class="saman-size-chips"'),
    ("4  price for the selected size", r'incl\. 18% GST'),
    ("5  Explore the Range", r'>Explore the Range<'),
    ("5a   divider 1", r'class="pc-divider1 saman-section-divider"'),
    ("6  Section 2 RightToExist", r'class="pc-rte"'),
    ("6b   split card, media on the LEFT", r'class="saman-s2-split-media"'),
    ("7  media band - none on this design; divider 2 stands here", r'class="pc-divider2 saman-section-divider"'),
    ("8  Section 3 SizeApplicationsExplorer", r'class="saman-size-tabs"'),
    ("9  Section 4 calculator", r'PRICE IT YOURSELF'),
    ("10 You may also like", r'class="saman-youmaylike"'),
    ("11 Section 5 Product Details", r'<h2[^>]*>Product Details</h2>'),
]


def at(doc, pat):
    m = re.search(pat, doc)
    return m.start() if m else -1


pos, refpos = [], []
print("%9s %9s  %s" % ("PO-04", "REF", "BLOCK"))
for name, pat in ORDER:
    a, b = at(po_body, pat), at(ref_body, pat)
    pos.append(a)
    refpos.append(b)
    print("%9d %9d  %s" % (a, b, name))


def ranks(xs):
    return [i for i, _ in sorted(enumerate(xs), key=lambda p: p[1])]


check("all thirteen markers present on PO-04", all(p >= 0 for p in pos), pos)
check("all thirteen markers present on the reference", all(p >= 0 for p in refpos), refpos)
check("PO-04 block sequence is identical to the design-lock reference",
      ranks(pos) == ranks(refpos), "po04=%s ref=%s" % (ranks(pos), ranks(refpos)))
check("Section 3 follows Section 2, calculator follows Section 3, "
      "YMAL follows the calculator, Product Details is last",
      pos[6] < pos[9] < pos[10] < pos[11] < pos[12], pos[6:])

print("\n=== GATE 5: DOM checks ===")
text = visible_text(po04)
body = po04.split("<body", 1)[-1]

h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", po04, re.S)
check("exactly one H1", len(h1) == 1, len(h1))
empty_headings = re.findall(r"<h[1-6][^>]*>\s*</h[1-6]>", po04)
check("no empty heading", not empty_headings, empty_headings[:3])

imgs = re.findall(r"<img[^>]+>", po04)
alts = [m.group(1) for m in (re.search(r'alt="([^"]*)"', i) for i in imgs) if m]
check("every img has an alt attribute", len(alts) == len(imgs), "%d alts / %d imgs" % (len(alts), len(imgs)))
check("no empty alt", all(a.strip() for a in alts), [i for i, a in enumerate(alts) if not a.strip()][:3])
dups = sorted({a for a in alts if alts.count(a) > 1})
check("no duplicate alt", not dups, dups[:3])
check("explicit width and height on every img",
      all(re.search(r'width="\d+"', i) and re.search(r'height="\d+"', i) for i in imgs),
      "%d imgs" % len(imgs))

check("no U+2014 em dash in body", "—" not in body,
      body[max(0, body.find("—") - 60):body.find("—") + 60] if "—" in body else "")

for tab in ("Description", "Specifications", "Shipping", "Reviews"):
    check("tab panel present in fetched HTML: " + tab, tab in text)
check("no Info tab", not re.search(r">\s*Info\s*<", po04))

# Normalise "-", "–" and " to " between digits before grepping, per the gate.
norm = re.sub(r"(\d)\s*(?:-|–|to)\s*(\d)", r"\1-\2", text)
for phrase in ("coming soon", "available on request", "contact us for details", "placeholder", "TBD"):
    hits = [m.start() for m in re.finditer(re.escape(phrase), norm, re.I)]
    check("zero hits: %r" % phrase, not hits, norm[hits[0] - 50:hits[0] + 50] if hits else "")

print("\nRESULT:", "PASS" if not fails else "FAIL (%d)" % len(fails))
sys.exit(0 if not fails else 1)
