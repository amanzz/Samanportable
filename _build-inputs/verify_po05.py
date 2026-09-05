#!/usr/bin/env python3
"""SAMAN-105 verifier - PO-05 Portable Mobile Laboratory.
Adapted from templates/verify_page.py. Adds: media-band checks, held-out gallery files,
the deliberate four-slide 10x10 gallery, and the laboratory-specific forbidden strings.
Usage: python verify_page.py <preview_url_or_html_file> <copy_json> <asset_map_json> <repo_public_dir>
The copy JSON may carry "old_page_strings_absent": [...] and the asset map "gallery_new" / "keep_as_is" / "ga_boards" as in the SOC-01 example.
Exit code 0 only when every check passes. Prints one line per check: PASS/FAIL + evidence.
"""
import sys, re, json, os, html as H
from urllib.request import urlopen, Request

src, copy_path, map_path, public_dir = sys.argv[1:5]
copy = json.load(open(copy_path, encoding="utf-8"))
amap = json.load(open(map_path, encoding="utf-8"))
if src.startswith("http"):
    raw = urlopen(Request(src, headers={"User-Agent": "Mozilla/5.0 PO05-verify"})).read().decode("utf-8", "ignore")
else:
    raw = open(src, encoding="utf-8", errors="ignore").read()
doc = raw
text = H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", re.sub(r"<script.*?</script>|<style.*?</style>", "", doc, flags=re.S))))
fails = 0
def check(name, ok, evidence=""):
    global fails
    print(("PASS " if ok else "FAIL ") + name + ("  | " + str(evidence) if evidence else ""))
    if not ok: fails += 1

# 1 identity
h1 = [re.sub("<[^>]+>", "", x).strip() for x in re.findall(r"<h1[^>]*>(.*?)</h1>", doc, re.S)]
check("exactly one H1", len(h1) == 1, h1)
check("H1 text", h1 and H.unescape(h1[0]) == copy["meta"]["h1"], h1)
title = re.findall(r"<title>(.*?)</title>", doc, re.S)
check("title text", title and H.unescape(title[0]).strip() == copy["meta"]["title"], title)
md = re.findall(r'<meta name="description" content="([^"]*)"', doc)
check("meta description", md and H.unescape(md[0]) == copy["meta"]["description"], md[:1])
can = re.findall(r'<link rel="canonical" href="([^"]*)"', doc)
check("canonical self", can == [copy["meta"]["canonical"]], can)

# 2 block order (eleven blocks) - anchors by text that only that block carries
order_keys = [copy["hero"]["size_selector_label"], "Explore the Range", copy["section2"]["h2"], copy["section2"]["split_card"]["h3"],
              copy["section3"]["h2"], "PRICE IT YOURSELF", "You may also like", "Product Details"]
pos = [text.find(k) for k in order_keys]
check("block order hero > explore > section2 > card > section3 > calculator > YMAL > product details", all(p >= 0 for p in pos) and pos == sorted(pos), list(zip(order_keys, pos)))

# 3 sizes and prices
for v in copy["hero"]["variants"]:
    lab = v["size_label"]
    ex = "₹{:,}".format(v["price_ex_gst"]).replace(",", "X")  # placeholder; Indian grouping checked below
def indian(n):
    s = str(n); last3 = s[-3:]; rest = s[:-3]
    if rest:
        parts = []
        while len(rest) > 2:
            parts.insert(0, rest[-2:]); rest = rest[:-2]
        if rest: parts.insert(0, rest)
        return "₹" + ",".join(parts) + "," + last3
    return "₹" + s
for v in copy["hero"]["variants"]:
    check(f"size {v['slug']} ex-GST price present", indian(v["price_ex_gst"]) in text, indian(v["price_ex_gst"]))
    check(f"size {v['slug']} incl-GST price present", indian(v["price_incl_gst"]) in text, indian(v["price_incl_gst"]))
check("from price", indian(copy["hero"]["from_price_ex_gst"]) in text)
for bad in copy.get("old_page_strings_absent", []):
    check(f"old-page string absent: {bad}", bad not in text)

# 4 section 2 and 3 copy present
for k in ["paragraph1", "paragraph2"]:
    check(f"section2 {k}", copy["section2"][k] in text)
for k in ["paragraph1", "paragraph2"]:
    check(f"section2 card {k}", copy["section2"]["split_card"][k] in text)
for s in copy["section3"]["sizes"]:
    check(f"section3 {s['slug']} H3", s["h3"] in text)
    check(f"section3 {s['slug']} paragraph", s["paragraph"] in text)
    for b in s["bullets"]:
        check(f"section3 {s['slug']} bullet", b in text, b[:50])

# 5 four tab panels present in fetched HTML (not only the active tab)
for k in ["Description", "Specifications", "Shipping", "Reviews"]:
    check(f"tab panel present: {k}", k in text)
for sec in copy["description_tab"]["sections"]:
    check("description H2: " + sec["h2"][:40], sec["h2"] in text)
    for it in sec["items"]:
        if it["type"] == "p":
            check("description paragraph", it["text"] in text, it["text"][:50])
        elif it["type"] == "faq":
            check("faq visible: " + it["q"][:40], it["q"] in text and it["a"] in text)
for p in copy["specifications_tab"]["narrative"]:
    check("spec narrative", p in text, p[:50])
for g in copy["specifications_tab"]["groups"]:
    for row in g["rows"]:
        check("spec row: " + row[0][:30], all(cell in text for cell in row if cell), row[:2])
check("reviews empty state", copy["reviews_tab"]["empty_state"] in text)
check("shipping free-delivery lines", "Ghaziabad" in text and "Greater Noida" in text and "Bangalore" in text)
check("shipping 20 ft first band", "25" in text and "30" in text and "100" in text)

# 6 forbidden strings and characters
norm = re.sub(r"(\d)\s*(?:-|–|to)\s*(\d)", r"\1-\2", text)
for f in copy["forbidden_strings"]:
    check(f"forbidden absent: {f!r}", f not in text)
# note: "placeholder" is NOT forbidden on this page - "exhaust cowl placeholder" is the
# approved GA control term for a held position, and is checked by count above.
check("no U+2014 in copy", "—" not in doc.split("<body")[-1])
check("no 'Info' tab label", not re.search(r">\s*Info\s*<", doc))

# 7 links
for l in copy["links"]["internal"]:
    check("link present " + l["href"], f'href="{l["href"]}"' in doc)
for n in copy["links"]["never"]:
    check("legacy link absent " + n, f'href="{n}"' not in doc)
hrefs = set(re.findall(r'href="(/product/[^"#?]+)"', doc))
for u in sorted(hrefs):
    try:
        code = urlopen(Request("https://www.samanportable.com" + u, headers={"User-Agent": "Mozilla/5.0"})).status
    except Exception as e:
        code = getattr(e, "code", 0)
    check(f"internal link 200: {u}", code == 200, code)

# 8 images
imgs = re.findall(r"<img[^>]+>", doc)
alts = [re.search(r'alt="([^"]*)"', i) for i in imgs]
alts = [a.group(1) for a in alts if a]
check("no empty alt", all(a.strip() for a in alts), len(alts))
dups = {a for a in alts if alts.count(a) > 1 and a}
check("no duplicate alt", not dups, dups)
check("no source PNG served", ".png" not in " ".join(re.findall(r'src="([^"]+)"', doc)) or all("/images/products/portable-mobile-laboratory" not in s or s.endswith(".webp") for s in re.findall(r'src="([^"]+)"', doc)))
check("explicit width/height on every img", all(re.search(r'width="\d+"', i) and re.search(r'height="\d+"', i) for i in imgs), len(imgs))
for slug, gal in amap.get("gallery_new", {}).items():
    if not isinstance(gal, dict) or "slides" not in gal: continue
    for s in gal["slides"]:
        p = os.path.join(public_dir, amap["output_root"].replace("public/", ""), s["out"])
        ok = os.path.exists(p); kb = os.path.getsize(p) // 1024 if ok else -1
        check(f"webp {s['out']} exists and 80-120 KB", ok and 80 <= kb <= 120, kb)
for slug, f in amap.get("ga_boards", {}).get("files", {}).items():
    p = os.path.join(public_dir, amap["output_root"].replace("public/", ""), f["out"])
    ok = os.path.exists(p); kb = os.path.getsize(p) // 1024 if ok else -1
    check(f"GA webp {slug} exists and 80-120 KB", ok and 80 <= kb <= 120, kb)
    if ok:
        try:
            from PIL import Image
            w, h = Image.open(p).size
            check(f"GA {slug} ratio 16:9 (never cropped)", abs(w / h - 16 / 9) < 0.01, (w, h))
        except Exception as e:
            check(f"GA {slug} ratio check", False, e)
for slug, files in amap.get("keep_as_is", {}).items():
    if not isinstance(files, list): continue
    for f in files:
        check(f"retained live image referenced: {f}", f in doc)


# 8b media band (block 7)
for slug, f in amap.get("media_band", {}).get("files", {}).items():
    p = os.path.join(public_dir, amap["output_root"].replace("public/", ""), f["out"])
    ok = os.path.exists(p); kb = os.path.getsize(p) // 1024 if ok else -1
    check(f"media-band webp {slug} exists and 80-120 KB", ok and 80 <= kb <= 120, kb)
for slug, f in amap.get("spec_diagrams", {}).items():
    p = os.path.join(public_dir, amap["output_root"].replace("public/", ""), f["out"])
    ok = os.path.exists(p); kb = os.path.getsize(p) // 1024 if ok else -1
    check(f"spec diagram {slug} exists and 80-120 KB", ok and 80 <= kb <= 120, kb)
p = os.path.join(public_dir, amap["output_root"].replace("public/", ""), amap["section2_card"]["out"])
check("section 2 card webp exists and 80-120 KB", os.path.exists(p) and 80 <= os.path.getsize(p)//1024 <= 120,
      os.path.getsize(p)//1024 if os.path.exists(p) else -1)

# 8c SAMAN ruling: two 10x10 exteriors are held out and must not appear anywhere
for held in amap.get("held_out", {}).get("files", []):
    stem = os.path.basename(held).rsplit(".", 1)[0]
    check(f"held-out source not published: {stem}", stem not in doc, stem)
counts = {slug: len(g["slides"]) for slug, g in amap.get("gallery_new", {}).items() if isinstance(g, dict)}
check("10x10 gallery ships four slides (SAMAN ruling, deliberate)", counts.get("10x10") == 4, counts)
check("every other size ships six slides", all(v == 6 for k, v in counts.items() if k != "10x10"), counts)

# 8d laboratory-specific safety: nothing on this page may promise accreditation or containment
# Phrase-precise: a bare "NABL" substring false-matches "cleanable", and "ISO corner casting"
# false-matches the correct negative statement "no ISO corner castings".
for bad in ["NABL", "accredited by", "is accredited", "fume hood included",
            "GMP compliant", "validated laboratory", "turnkey laboratory",
            "lab on wheels", "mobile laboratory van"]:
    check(f"unsafe claim absent: {bad!r}", not re.search(r"\b" + re.escape(bad) + r"\b", text, re.I), bad)
for need in copy.get("required_strings", []):
    check(f"required string present: {need!r}", need in text, need)
check("placeholder word absent outside the exhaust-cowl control row",
      text.lower().count("placeholder") <= 2, text.lower().count("placeholder"))

# 9 schema
ld = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', doc, re.S)
types = re.findall(r'"@type"\s*:\s*"([^"]+)"', " ".join(ld))
for t_ in ["ItemPage", "Product", "BreadcrumbList", "FAQPage"]:
    check(f"schema {t_}", t_ in types)
check("no review schema", "AggregateRating" not in types and "Review" not in types)
check("no shippingDetails", "shippingDetails" not in " ".join(ld))
for f in copy["faq_schema"]:
    check("faq schema matches visible: " + f["q"][:30], f["q"] in " ".join(ld) and f["a"][:60] in H.unescape(" ".join(ld)))

print("\nRESULT:", "PASS" if fails == 0 else f"FAIL ({fails} checks)")
sys.exit(0 if fails == 0 else 1)
