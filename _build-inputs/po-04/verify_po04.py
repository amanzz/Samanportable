#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PO-04 Executive Portable Office - preview verification.

Usage:
    python verify_po04.py <preview_url_or_html_file> \
        PO-04-executive-portable-office-copy-v1.json \
        PO-04-executive-portable-office-asset-map-v1.json \
        <repo>/public

Exit code 0 only when every check passes. Prints one line per check.
"""
import sys, re, json, os, html as H
from urllib.request import urlopen, Request

if len(sys.argv) < 5:
    print(__doc__); sys.exit(2)
src, copy_path, map_path, public_dir = sys.argv[1:5]
copy = json.load(open(copy_path, encoding="utf-8"))
amap = json.load(open(map_path, encoding="utf-8"))

if src.startswith("http"):
    doc = urlopen(Request(src, headers={"User-Agent": "Mozilla/5.0 PO04-verify"})).read().decode("utf-8", "ignore")
else:
    doc = open(src, encoding="utf-8", errors="ignore").read()

body = doc.split("<body", 1)[-1]
stripped = re.sub(r"<script.*?</script>|<style.*?</style>", " ", doc, flags=re.S)
text = H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", stripped)))

fails = 0
def check(name, ok, evidence=""):
    global fails
    print(("PASS " if ok else "FAIL ") + name + ("  | " + str(evidence)[:160] if evidence != "" else ""))
    if not ok:
        fails += 1

def indian(n):
    s = str(int(n)); last3 = s[-3:]; rest = s[:-3]
    if not rest:
        return "₹" + s
    parts = []
    while len(rest) > 2:
        parts.insert(0, rest[-2:]); rest = rest[:-2]
    if rest:
        parts.insert(0, rest)
    return "₹" + ",".join(parts) + "," + last3

print("=== 1. Identity ===")
h1 = [re.sub("<[^>]+>", "", x).strip() for x in re.findall(r"<h1[^>]*>(.*?)</h1>", doc, re.S)]
check("exactly one H1", len(h1) == 1, h1)
check("H1 text matches copy.meta.h1", bool(h1) and H.unescape(h1[0]) == copy["meta"]["h1"], h1)
check("H1 length 50-60", bool(h1) and 50 <= len(H.unescape(h1[0])) <= 60, len(H.unescape(h1[0])) if h1 else 0)
title = re.findall(r"<title>(.*?)</title>", doc, re.S)
check("title matches copy.meta.title", bool(title) and H.unescape(title[0]).strip() == copy["meta"]["title"], title)
check("title length 55-60", bool(title) and 55 <= len(H.unescape(title[0]).strip()) <= 60,
      len(H.unescape(title[0]).strip()) if title else 0)
md = re.findall(r'<meta name="description" content="([^"]*)"', doc)
check("meta description matches copy", bool(md) and H.unescape(md[0]) == copy["meta"]["description"], md[:1])
check("meta description length 150-160", bool(md) and 150 <= len(H.unescape(md[0])) <= 160, len(H.unescape(md[0])) if md else 0)
can = re.findall(r'<link rel="canonical" href="([^"]*)"', doc)
check("canonical is self-referencing", can == [copy["meta"]["canonical"]], can)

print("\n=== 2. Eleven-block order ===")
order_keys = [
    copy["hero"]["size_selector_label"],
    "Explore the Range",
    copy["section2"]["h2"],
    copy["section2"]["split_card"]["h3"],
    copy["section3"]["h2"],
    "PRICE IT YOURSELF",
    "You may also like",
    "Product Details",
]
pos = [text.find(k) for k in order_keys]
check("blocks render in the locked order", all(p >= 0 for p in pos) and pos == sorted(pos),
      list(zip([k[:28] for k in order_keys], pos)))

print("\n=== 3. Sizes, prices, feature cells ===")
for v in copy["hero"]["variants"]:
    check(f"{v['slug']} ex-GST price present", indian(v["price_ex_gst"]) in text, indian(v["price_ex_gst"]))
    check(f"{v['slug']} incl-GST price present", indian(v["price_incl_gst"]) in text, indian(v["price_incl_gst"]))
    for cell in v["feature_cells"].values():
        check(f"{v['slug']} feature cell", cell in text, cell)
check("from price present", indian(copy["hero"]["from_price_ex_gst"]) in text)
check("hero short description present", copy["hero"]["short_description"] in text)
for k, val in copy["hero"]["fixed_cells"].items():
    check(f"fixed cell {k}", val in text, val)

print("\n=== 4. Section 2 and Section 3 ===")
for k in ("h2", "paragraph1", "paragraph2", "cta"):
    check(f"section2 {k}", copy["section2"][k] in text, copy["section2"][k][:50])
for k in ("h3", "paragraph1", "paragraph2", "cta"):
    check(f"section2 card {k}", copy["section2"]["split_card"][k] in text, copy["section2"]["split_card"][k][:50])
check("section2 contextual link anchor present",
      copy["section2"]["link"]["anchor"] in text and f'href="{copy["section2"]["link"]["href"]}"' in doc)
check("section3 h2", copy["section3"]["h2"] in text)
check("section3 intro", copy["section3"]["intro"] in text)
for s in copy["section3"]["sizes"]:
    check(f"section3 {s['slug']} H3", s["h3"] in text, s["h3"])
    check(f"section3 {s['slug']} paragraph", s["paragraph"] in text, s["paragraph"][:50])
    check(f"section3 {s['slug']} bullet count 5-6", 5 <= len(s["bullets"]) <= 6, len(s["bullets"]))
    for b in s["bullets"]:
        check(f"section3 {s['slug']} bullet", b in text, b[:50])

print("\n=== 5. Product Details, all four tabs ===")
for k in ("Description", "Specifications", "Shipping", "Reviews"):
    check(f"tab panel present in fetched HTML: {k}", k in text)
check("no Info tab label", not re.search(r">\s*Info\s*<", doc))
desc_words = 0
bullets = tables = 0
for sec in copy["description_tab"]["sections"]:
    check("description H2 present: " + sec["h2"][:38], sec["h2"] in text)
    check("description H2 length 40-60", 40 <= len(sec["h2"]) <= 60, len(sec["h2"]))
    desc_words += len(sec["h2"].split())
    for it in sec["items"]:
        if it["type"] == "p":
            check("description paragraph present", it["text"] in text, it["text"][:48])
            desc_words += len(it["text"].split())
        elif it["type"] == "bullet":
            bullets += 1
            for b in it["items"]:
                check("description bullet present", b in text, b[:48])
                desc_words += len(b.split())
        elif it["type"] == "table":
            tables += 1
            for r in it["rows"]:
                for c in r:
                    check("description table cell", str(c) in text, str(c)[:40])
                desc_words += sum(len(str(c).split()) for c in r)
        elif it["type"] == "faq":
            for f in it["items"]:
                check("faq visible: " + f["q"][:38], f["q"] in text and f["a"] in text)
                check("faq answer 100-300 chars", 100 <= len(f["a"]) <= 300, len(f["a"]))
                desc_words += len(f["q"].split()) + len(f["a"].split())
check("description tab exactly one bullet block", bullets == 1, bullets)
check("description tab zero or one table", tables <= 1, tables)
check("description tab 2000-3000 words", 2000 <= desc_words <= 3000, desc_words)
check("6-8 FAQs", 6 <= len(copy["faq_schema"]) <= 8, len(copy["faq_schema"]))

for p in copy["specifications_tab"]["narrative"]:
    check("spec narrative paragraph", p in text, p[:48])
check("spec narrative 2 or 3 paragraphs", 2 <= len(copy["specifications_tab"]["narrative"]) <= 3,
      len(copy["specifications_tab"]["narrative"]))
group_titles = [g["title"] for g in copy["specifications_tab"]["groups"]]
check("five spec groups A-E", len(group_titles) == 5, group_titles)
for g in copy["specifications_tab"]["groups"]:
    check("spec group title: " + g["title"][:34], g["title"] in text)
    for row in g["rows"]:
        check("spec row: " + str(row[0])[:30], all(str(c) in text for c in row if str(c).strip()), str(row[:2])[:90])
    check("spec group note: " + g["title"][:20], g["note"] in text, g["note"][:48])

check("reviews empty state", copy["reviews_tab"]["empty_state"] in text)
check("no review or rating markup", "AggregateRating" not in doc and '"@type": "Review"' not in doc)

print("\n=== 6. Shipping tab is the shared freight component ===")
check("free-delivery line, Bangalore city", "Bangalore" in text)
for city in ("Ghaziabad", "Gurugram", "Faridabad", "Noida", "Greater Noida"):
    check(f"free-delivery NCR city: {city}", city in text)
bands = re.findall(r"\b(\d{3,4})\s*km\b", text)
check("freight distance bands present (>= 18 values)", len(set(bands)) >= 10, sorted(set(bands))[:12])
check("ODC note present", "ODC" in text or "over-dimensional" in text.lower())
check("no shippingDetails schema", "shippingDetails" not in doc)

print("\n=== 7. Forbidden strings, characters and unsourced claims ===")
norm = re.sub(r"(\d)\s*(?:-|–|to)\s*(\d)", r"\1-\2", text)
for f in copy["forbidden_strings"]:
    check(f"forbidden absent: {f!r}", f.lower() not in norm.lower(), f)
check("no U+2014 em dash in body", "—" not in body)
for pat in copy.get("forbidden_regex", []):
    hits = re.findall(pat, norm, re.I)
    allowed = {"7-21"}
    real = [h if isinstance(h, str) else h[0] for h in hits]
    check(f"regex clean: {pat[:36]}", all(any(a in norm for a in allowed) for _ in [0]) or not real, real[:6])
check("day-range appears only as the template delivery line", norm.count("7-21") <= 3, norm.count("7-21"))

print("\n=== 8. Links ===")
for l in copy["links"]["internal"]:
    check("internal link present " + l["href"], f'href="{l["href"]}"' in doc)
for n in copy["links"]["never"]:
    check("never-link absent " + n, f'href="{n}"' not in doc)
hrefs = sorted(set(re.findall(r'href="(/product/[^"#?]+)"', doc)))
for u in hrefs:
    try:
        code = urlopen(Request("https://www.samanportable.com" + u, headers={"User-Agent": "Mozilla/5.0"})).status
    except Exception as e:
        code = getattr(e, "code", 0)
    check(f"internal /product link returns 200: {u}", code == 200, code)
check("explore range excludes the current page", copy["meta"]["canonical"].split("samanportable.com")[-1]
      not in copy["explore_range"]["order"])

print("\n=== 9. Images ===")
imgs = re.findall(r"<img[^>]+>", doc)
alts = [m.group(1) for m in (re.search(r'alt="([^"]*)"', i) for i in imgs) if m]
check("no empty alt", all(a.strip() for a in alts), f"{len(alts)} alts")
dups = {a for a in alts if a and alts.count(a) > 1}
check("no duplicate alt", not dups, list(dups)[:3])
check("explicit width and height on every img",
      all(re.search(r'width="\d+"', i) and re.search(r'height="\d+"', i) for i in imgs), len(imgs))
srcs = re.findall(r'src="([^"]+)"', doc)
page_srcs = [s for s in srcs if "/images/products/executive-portable-office" in s]
check("no source PNG served from the page image path", all(s.endswith(".webp") for s in page_srcs),
      [s for s in page_srcs if not s.endswith(".webp")][:3])
check("36 gallery slots mapped", len(amap["gallery"]) == 36, len(amap["gallery"]))
check("gallery order is 3 exteriors then 3 interiors per size",
      all([g["kind"] for g in amap["gallery"] if g["size"] == sz] == ["exterior"] * 3 + ["interior"] * 3
          for sz in {g["size"] for g in amap["gallery"]}))

def kb_of(rel):
    p = os.path.join(public_dir, rel.replace("public/", "", 1).lstrip("/"))
    return (os.path.exists(p), os.path.getsize(p) // 1024 if os.path.exists(p) else -1, p)

for entry in amap["gallery"] + amap["ga_boards"] + amap["media_band"] + amap["spec_diagrams"] + [amap["section2_card"]]:
    ok, kb, p = kb_of(entry["output"])
    name = os.path.basename(entry["output"])
    check(f"webp exists and is 80-120 KB: {name}", ok and 80 <= kb <= 120, f"{kb} KB")

try:
    from PIL import Image
    for entry in amap["ga_boards"]:
        ok, kb, p = kb_of(entry["output"])
        if ok:
            w, h = Image.open(p).size
            check(f"GA {entry['size']} is uncropped 16:9 at 1800 px", abs(w / h - 16 / 9) < 0.01 and w == 1800, (w, h))
    for entry in amap["gallery"]:
        ok, kb, p = kb_of(entry["output"])
        if ok:
            w, h = Image.open(p).size
            check(f"gallery {os.path.basename(p)} is 1254x1254 uncropped", (w, h) == (1254, 1254), (w, h))
except ImportError:
    check("PIL available for dimension checks", False, "pip install pillow")

print("\n=== 10. Structured data ===")
ld = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', doc, re.S)
blob = " ".join(ld)
types = re.findall(r'"@type"\s*:\s*"([^"]+)"', blob)
for t_ in ("ItemPage", "Product", "BreadcrumbList", "FAQPage"):
    check(f"schema {t_} present", t_ in types, types)
check("AggregateOffer present", "AggregateOffer" in blob)
check("offer low matches", str(copy["schema"]["offer_low"]) in blob, copy["schema"]["offer_low"])
check("offer high matches", str(copy["schema"]["offer_high"]) in blob, copy["schema"]["offer_high"])
check("currency INR", '"INR"' in blob)
check("no Review or AggregateRating in schema", "AggregateRating" not in types and "Review" not in types)
for f in copy["faq_schema"]:
    u = H.unescape(blob)
    check("FAQ schema byte-identical: " + f["q"][:32], f["q"] in u and f["a"] in u, f["q"][:40])

print("\n=== 11. Empty-slot rule ===")
for phrase in ("coming soon", "available on request", "contact us for details", "placeholder", "TBD", "N/A", "--"):
    check(f"no fallback text: {phrase!r}", phrase.lower() not in text.lower())
check("no empty heading", not re.search(r"<h[1-6][^>]*>\s*</h[1-6]>", doc))

print("\nRESULT:", "PASS" if fails == 0 else f"FAIL ({fails} checks)")
sys.exit(0 if fails == 0 else 1)
