#!/usr/bin/env python3
"""PO-06 Portable Construction Site Cabin - acceptance test.

Usage:
    python verify_po06.py <url_or_html_file> PO-06-construction-site-cabin-copy-v1.json \
                          PO-06-construction-site-cabin-asset-map-v1.json <repo>/public

Exit code 0 only when every check passes. Prints PASS/FAIL per check and RESULT: PASS at the end.
"""
import sys, re, json, os, html as H
from urllib.request import urlopen, Request

src, copy_path, map_path, public_dir = sys.argv[1:5]
copy = json.load(open(copy_path, encoding="utf-8"))
amap = json.load(open(map_path, encoding="utf-8"))
if src.startswith("http"):
    doc = urlopen(Request(src, headers={"User-Agent": "Mozilla/5.0 PO06-verify"})).read().decode("utf-8", "ignore")
else:
    doc = open(src, encoding="utf-8", errors="ignore").read()

stripped = re.sub(r"<script.*?</script>|<style.*?</style>", " ", doc, flags=re.S)
text = H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", stripped)))

fails = 0
def check(name, ok, evidence=""):
    global fails
    print(("PASS " if ok else "FAIL ") + name + ("  | " + str(evidence)[:180] if evidence != "" else ""))
    if not ok: fails += 1

def inpage(s):
    return re.sub(r"\s+", " ", s).strip() in text

def indian(n):
    s = str(n); last3 = s[-3:]; rest = s[:-3]
    if not rest: return "₹" + s
    parts = []
    while len(rest) > 2:
        parts.insert(0, rest[-2:]); rest = rest[:-2]
    if rest: parts.insert(0, rest)
    return "₹" + ",".join(parts) + "," + last3

print("== 1. Identity ==")
h1 = [re.sub("<[^>]+>", "", x).strip() for x in re.findall(r"<h1[^>]*>(.*?)</h1>", doc, re.S)]
check("exactly one H1", len(h1) == 1, h1)
check("H1 text matches pack", bool(h1) and H.unescape(h1[0]) == copy["meta"]["h1"], h1[:1])
check("H1 length 50-60", bool(h1) and 50 <= len(H.unescape(h1[0])) <= 60, len(h1[0]) if h1 else 0)
t = re.findall(r"<title>(.*?)</title>", doc, re.S)
check("title matches pack", bool(t) and H.unescape(t[0]).strip() == copy["meta"]["title"], t[:1])
check("title length 55-60", bool(t) and 55 <= len(H.unescape(t[0]).strip()) <= 60)
md = re.findall(r'<meta name="description" content="([^"]*)"', doc)
check("meta description matches pack", bool(md) and H.unescape(md[0]) == copy["meta"]["description"], md[:1])
check("meta description length 150-160", bool(md) and 150 <= len(H.unescape(md[0])) <= 160, len(md[0]) if md else 0)
can = re.findall(r'<link rel="canonical" href="([^"]*)"', doc)
check("canonical is self-referencing", can == [copy["meta"]["canonical"]], can)

print("== 2. Block order (eleven blocks) ==")
keys = ["Explore the Range", copy["section2"]["h2"], copy["section2"]["split_card"]["h3"],
        copy["section3"]["h2"], "PRICE IT YOURSELF", "You may also like", "Product Details"]
pos = [text.find(re.sub(r"\s+", " ", k)) for k in keys]
check("blocks render in canonical order", all(p >= 0 for p in pos) and pos == sorted(pos), list(zip(keys, pos)))

print("== 3. Sizes, prices and the price basis ==")
for v in copy["hero"]["variants"]:
    check(f"{v['key']} ex-GST price on page", indian(v["price_ex_gst"]) in text or f"Rs {indian(v['price_ex_gst'])[1:]}" in text, indian(v["price_ex_gst"]))
    check(f"{v['key']} incl-GST price on page", indian(v["price_incl_gst"]) in text or f"Rs {indian(v['price_incl_gst'])[1:]}" in text, indian(v["price_incl_gst"]))
check("from-price is the 10x10 ex-GST figure", indian(copy["hero"]["from_price_ex_gst"]) in text, indian(copy["hero"]["from_price_ex_gst"]))
# the Rs 1,350 workbook basis must not appear anywhere
for wrong in ["1,55,250", "2,37,600", "2,70,000", "3,11,040", "3,88,800", "5,13,000"]:
    check(f"withdrawn Rs 1,350-basis price absent: {wrong}", wrong not in text)
check("six variants in the pack", len(copy["hero"]["variants"]) == 6)

print("== 4. Hero, Section 2, Section 3 copy ==")
check("hero short description present", inpage(copy["hero"]["short_description"]))
check("hero short description 700-800 chars", 700 <= len(copy["hero"]["short_description"]) <= 800, len(copy["hero"]["short_description"]))
check("section2 H2 present", inpage(copy["section2"]["h2"]))
check("section2 H2 55-70 chars", 55 <= len(copy["section2"]["h2"]) <= 70, len(copy["section2"]["h2"]))
check("section2 paragraph 1 present", inpage(copy["section2"]["p1"]))
check("section2 paragraph 2 present", inpage(copy["section2"]["p2"]))
comb = len(copy["section2"]["p1"]) + len(copy["section2"]["p2"])
check("section2 paragraphs 800-900 chars combined", 800 <= comb <= 900, comb)
sc = copy["section2"]["split_card"]
check("split card H3 present", inpage(sc["h3"]))
check("split card H3 35-65 chars", 35 <= len(sc["h3"]) <= 65, len(sc["h3"]))
for i in ("p1", "p2"):
    check(f"split card {i} present", inpage(sc[i]))
    check(f"split card {i} 150-220 chars", 150 <= len(sc[i]) <= 220, len(sc[i]))
check("section3 H2 present", inpage(copy["section3"]["h2"]))
check("section3 H2 50-60 chars", 50 <= len(copy["section3"]["h2"]) <= 60, len(copy["section3"]["h2"]))
check("section3 intro 100-140 chars", 100 <= len(copy["section3"]["intro"]) <= 140, len(copy["section3"]["intro"]))
h3s = [re.sub("<[^>]+>", "", x).strip() for x in re.findall(r"<h3[^>]*>(.*?)</h3>", doc, re.S)]
for s in copy["section3"]["sizes"]:
    check(f"section3 {s['key']} heading renders as H3", s["h3"] in [H.unescape(x) for x in h3s], s["h3"])
    check(f"section3 {s['key']} H3 50-62 chars", 50 <= len(s["h3"]) <= 62, len(s["h3"]))
    check(f"section3 {s['key']} paragraph present", inpage(s["paragraph"]))
    check(f"section3 {s['key']} paragraph 400-500 chars", 400 <= len(s["paragraph"]) <= 500, len(s["paragraph"]))
    check(f"section3 {s['key']} has 5-6 bullets", 5 <= len(s["applications"]) <= 6, len(s["applications"]))
    for b in s["applications"]:
        check(f"section3 {s['key']} bullet present", inpage(b), b[:48])

print("== 5. Product Details, four tabs ==")
for lab in ["Description", "Info", "Specifications", "Specs", "Shipping", "Ship", "Reviews"]:
    check(f"tab label present: {lab}", lab in text)
check("no DescriptionDescription (small-screen label wrongly set)", "DescriptionDescription" not in re.sub(r"\s+", "", text))
nb = nt = ni = 0
for sec in copy["description_tab"]["sections"]:
    check("description H2 present: " + sec["h2"][:42], inpage(sec["h2"]))
    check("description H2 40-60 chars: " + sec["h2"][:42], 40 <= len(sec["h2"]) <= 60, len(sec["h2"]))
    for it in sec["items"]:
        if it["type"] == "p": check("description paragraph present", inpage(it["text"]), it["text"][:48])
        elif it["type"] == "bullet":
            nb += 1
            for b in it["items"]: check("description bullet present", inpage(b), b[:48])
        elif it["type"] == "table":
            nt += 1
            for row in it["rows"]:
                check("description table row: " + row[0][:26], all(inpage(c) for c in row if c), row[:2])
        elif it["type"] == "faq":
            check("faq visible: " + it["question"][:40], inpage(it["question"]) and inpage(it["answer"]))
            check("faq answer 100-300 chars", 100 <= len(it["answer"]) <= 300, len(it["answer"]))
        elif it["type"] == "image":
            ni += 1
            check("description image in the tab: " + it["src"], it["src"] in doc, it["src"])
check("description tab has exactly one bullet block", nb == 1, nb)
check("description tab has at most one table", nt <= 1, nt)
check("description tab carries five images", ni == 5, ni)
check("FAQ count 6-8", 6 <= len(copy["faq_schema"]) <= 8, len(copy["faq_schema"]))
for p in copy["specifications_tab"]["narrative"]:
    check("spec narrative paragraph present", inpage(p), p[:48])
check("spec narrative is 2 or 3 paragraphs", 2 <= len(copy["specifications_tab"]["narrative"]) <= 3)
for g in copy["specifications_tab"]["groups"]:
    check("spec group heading: " + g["title"][:40], inpage(g["title"]))
    for row in g["rows"]:
        check("spec row: " + str(row[0])[:30], all(inpage(str(c)) for c in row if c), row[:2])
check("reviews empty state", inpage(copy["reviews_tab"]["empty_state"]))
check("no rating schema on an unreviewed page", "AggregateRating" not in doc and '"Review"' not in doc)

print("== 6. Shipping tab is the shared freight component ==")
check("free delivery, Bangalore city", "Bangalore" in text)
for city in ["Ghaziabad", "Gurugram", "Faridabad", "Noida", "Greater Noida"]:
    check(f"free delivery NCR city: {city}", city in text)
check("freight distance bands present", "100-150 km" in re.sub(r"\s*(?:-|–|to)\s*", "-", text) and "950-1000 km" in re.sub(r"\s*(?:-|–|to)\s*", "-", text))
check("ODC note present", "ODC" in text or "over-dimensional" in text.lower())

print("== 7. Forbidden strings and characters ==")
norm = re.sub(r"(\d)\s*(?:-|–|to)\s*(\d)", r"\1-\2", text)
for bad in copy.get("old_page_strings_absent", []):
    check(f"absent: {bad!r}", bad.lower() not in norm.lower())
for bad in ["coming soon", "available on request", "contact us for details", "placeholder", "TBD",
            "working days", "warranty period", "lead time", "years warranty"]:
    check(f"unsourced promise absent: {bad!r}", bad.lower() not in norm.lower())
body = doc.split("<body", 1)[-1]
check("no U+2014 em dash in the page body", "—" not in H.unescape(re.sub("<[^>]+>", " ", body)))
headings = re.findall(r"<h[1-6][^>]*>(.*?)</h[1-6]>", doc, re.S)
check("no empty heading", all(re.sub("<[^>]+>", "", x).strip() for x in headings), len(headings))

print("== 8. Internal links ==")
for l in copy["links"]["internal"]:
    check("internal link present: " + l["href"], f'href="{l["href"]}"' in doc)
for n in copy["explore_range"]["never_list"]:
    check("never-list URL absent: " + n, f'href="{n}"' not in doc)
hrefs = sorted(set(re.findall(r'href="(/product/[^"#?]+)"', doc)))
for u in hrefs:
    try:
        code = urlopen(Request("https://www.samanportable.com" + u, headers={"User-Agent": "Mozilla/5.0"})).status
    except Exception as e:
        code = getattr(e, "code", 0)
    check(f"internal link returns 200: {u}", code == 200, code)

print("== 9. Images ==")
imgs = re.findall(r"<img[^>]+>", doc)
alts = [m.group(1) for m in (re.search(r'alt="([^"]*)"', i) for i in imgs) if m]
check("every img has a non-empty alt", len(alts) == len(imgs) and all(a.strip() for a in alts), f"{len(alts)}/{len(imgs)}")
dups = sorted({a for a in alts if alts.count(a) > 1 and a})
check("no duplicate alt", not dups, dups)
check("explicit width and height on every img", all(re.search(r'width="\d+"', i) and re.search(r'height="\d+"', i) for i in imgs), len(imgs))
srcs = re.findall(r'src="([^"]+)"', doc)
check("no source PNG served from the product image folder",
      all(not (s.startswith("/images/products/construction-site-cabin") and not s.endswith(".webp")) for s in srcs))
root = amap["output_root"].replace("public/", "")
def measure(rel, label, ratio=None):
    p = os.path.join(public_dir, root, rel)
    ok = os.path.exists(p)
    kb = os.path.getsize(p) // 1024 if ok else -1
    check(f"{label} exists and is 80-120 KB: {rel}", ok and 80 <= kb <= 120, kb)
    if ok and ratio:
        try:
            from PIL import Image
            w, h = Image.open(p).size
            check(f"{label} ratio {ratio[0]}:{ratio[1]}: {rel}", abs(w / h - ratio[0] / ratio[1]) < 0.02, (w, h))
        except Exception as e:
            check(f"{label} ratio check: {rel}", False, e)
for k, gal in amap["gallery_new"].items():
    check(f"gallery {k} has six slides", len(gal["slides"]) == 6, len(gal["slides"]))
    for s in gal["slides"]:
        measure(s["out"], "gallery", (1, 1))
for k, g in amap["ga_boards"].items():
    measure(g["out"], "GA board", (16, 9))
measure(amap["section2_card"]["out"], "section 2 card", (16, 9))
for k, d in amap["description_images"].items():
    measure(d["out"], "description image", (16, 9))
for k, d in amap["spec_diagrams"].items():
    measure(d["out"], "spec diagram", (16, 9))
check("section 2 card is a photograph, not a GA board", "ga-specification-board" not in amap["section2_card"]["src"])
check("description images 05 and 06 come from the repaired 16:9 masters",
      all("_repaired-16x9-v1" in amap["description_images"][k]["src"] for k in ("desc_04", "desc_05")))
check("no pillared original referenced",
      not any(d["src"] == "02-long-description-16x9/05-site-cabin-30x10-team-interior.png" for d in amap["description_images"].values()))

print("== 10. Structured data ==")
ld = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', doc, re.S)
blob = " ".join(ld)
types = re.findall(r'"@type"\s*:\s*"([^"]+)"', blob)
for t_ in ["ItemPage", "Product", "BreadcrumbList", "FAQPage"]:
    check(f"schema {t_} present", t_ in types, types)
check("AggregateOffer in INR", '"priceCurrency": "INR"' in blob.replace('"priceCurrency":"INR"', '"priceCurrency": "INR"'))
check("AggregateOffer low price is the 10x10 ex-GST figure", str(copy["schema"]["aggregate_offer"]["lowPrice"]) in blob)
check("AggregateOffer high price is the 40x10 ex-GST figure", str(copy["schema"]["aggregate_offer"]["highPrice"]) in blob)
check("no shippingDetails in schema", "shippingDetails" not in blob)
for f in copy["faq_schema"]:
    j = H.unescape(blob)
    check("FAQ schema byte-identical: " + f["question"][:34], f["question"] in j and f["answer"] in j, f["question"][:34])

print()
print("RESULT:", "PASS" if fails == 0 else f"FAIL ({fails} checks)")
sys.exit(0 if fails == 0 else 1)
