#!/usr/bin/env python3
"""SCH-02 Shipping Container Homes verifier.
Usage: python verify_sch02.py http://127.0.0.1:3210/product/container-houses/shipping-container-homes
Exits 0 and prints RESULT: PASS only when every assert holds.
"""
import sys, os, re, json, glob, unicodedata
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
COPY = json.load(open(os.path.join(BASE, "SCH-02-shipping-container-homes-copy-v1.json"), encoding="utf-8"))
AMAP = json.load(open(os.path.join(BASE, "SCH-02-shipping-container-homes-asset-map-v1.json"), encoding="utf-8"))
PKG  = os.path.join(os.path.dirname(BASE), "approved-website-assets-v1")

fails, n = [], 0
def ck(cond, msg):
    global n
    n += 1
    if not cond:
        fails.append(msg)

def norm(s):
    s = unicodedata.normalize("NFKC", s)
    s = re.sub(r"(?<=\d)\s*(?:-|–|—|\s+to\s+)\s*(?=\d)", "-", s)
    return re.sub(r"\s+", " ", s).strip()

url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3210/product/container-houses/shipping-container-homes"
html = urllib.request.urlopen(url, timeout=60).read().decode("utf-8", "replace")
H = norm(re.sub(r"<script[^>]*>.*?</script>", " ", html, flags=re.S))
TEXT = norm(re.sub(r"<[^>]+>", " ", H))

# ---- 1 meta, h1 ----
m = re.search(r"<title>(.*?)</title>", html, re.S)
ck(m and m.group(1).strip() == COPY["meta"]["title"], "meta title mismatch")
ck(55 <= len(COPY["meta"]["title"]) <= 60, "meta title length")
md = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', html)
ck(md and md.group(1).strip() == COPY["meta"]["description"], "meta description mismatch")
ck(150 <= len(COPY["meta"]["description"]) <= 160, "meta description length")
h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S)
ck(len(h1s) == 1, "expected exactly one H1, found %d" % len(h1s))
ck(h1s and COPY["h1"] in norm(re.sub(r"<[^>]+>", " ", h1s[0])), "H1 mismatch")
ck(50 <= len(COPY["h1"]) <= 60, "H1 length")

# ---- 2 canonical, no U+2014 ----
ck(COPY["canonical"] in html, "self-referencing canonical missing")
ck("—" not in TEXT, "U+2014 em dash present in body copy")

# ---- 3 every copy string renders ----
def strings(o, out):
    if isinstance(o, str):
        if len(o) > 24 and not o.startswith("http"):
            out.append(o)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k in ("source", "canonical", "rule"):
                continue
            strings(v, out)
    elif isinstance(o, list):
        for v in o:
            strings(v, out)
    return out
miss = []
for s in strings({k: v for k, v in COPY.items() if k not in ("meta",)}, []):
    plain = norm(re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s))
    if plain not in TEXT:
        miss.append(plain[:70])
ck(not miss, "copy strings not found in rendered HTML: %s" % miss[:6])

# ---- 4 prices, no live-page legacy figures ----
for v in COPY["variants"]:
    ck(("%d" % v["price_ex_gst_inr"]) in html.replace(",", "") or
       ("{:,}".format(v["price_ex_gst_inr"]).replace(",", ",")) in html,
       "price missing for %s" % v["size"])
for bad in ["3,64,320", "4,14,000", "4,76,880", "6,22,720", "7,78,400", "9,13,920", "364320", "913920"]:
    ck(bad not in html, "legacy unsourced price still on page: %s" % bad)

# ---- 5 forbidden strings ----
for bad in ["5-year structural", "5 year structural", "48 business hours",
            "available on request", "coming soon", "contact us for details",
            "TBD", "placeholder", "Lorem"]:
    ck(norm(bad).lower() not in TEXT.lower(), "forbidden string on page: %s" % bad)
ck("10-year" in TEXT or "10 year" in TEXT, "10-year structural warranty not stated")
ck("7-21 working days" in norm(TEXT), "lead time 7-21 working days not stated")

# ---- 6 four tab panels ----
for lab in ["Description", "Info", "Specifications", "Specs", "Shipping", "Ship", "Reviews"]:
    ck(lab in TEXT, "tab label missing: %s" % lab)
ck("DescriptionInfo" in re.sub(r"\s+", "", TEXT) or ("Description" in TEXT and "Info" in TEXT),
   "responsive tab label pair wrong")

# ---- 7 shipping tab freight component ----
ck("free delivery" in TEXT.lower() or "Free delivery" in TEXT, "free-delivery lines missing from Shipping tab")
ck("1,000 km" in TEXT or "1000 km" in TEXT, "freight distance bands missing from Shipping tab")

# ---- 8 reviews ----
ck("No verified reviews yet." in TEXT, "Reviews empty state missing")
ck("aggregateRating" not in html, "rating schema present with no verified reviews")

# ---- 9 images: alt, no PNG, band ----
imgs = re.findall(r"<img[^>]*>", html)
alts = [re.search(r'alt="([^"]*)"', i) for i in imgs]
ck(all(a and a.group(1).strip() for a in alts), "empty alt attribute present")
seen = [a.group(1) for a in alts if a]
ck(len(seen) == len(set(seen)), "duplicate alt text present")
for i in imgs:
    ck(not re.search(r'src="[^"]*\.png"', i), "PNG source shipped to browser: %s" % i[:90])
    ck("width=" in i and "height=" in i, "img without explicit width/height: %s" % i[:90])
ck(len(imgs) >= 12, "too few images rendered (%d)" % len(imgs))

# ---- 10 asset package bytes ----
for e in AMAP["images"]:
    p = os.path.join(os.path.dirname(PKG), e["prebuilt_webp"].replace("/", os.sep))
    ck(os.path.exists(p), "missing asset %s" % e["prebuilt_webp"])
    if os.path.exists(p):
        b = os.path.getsize(p)
        ck(80 * 1024 <= b <= 120 * 1024, "asset outside 80-120 KB band: %s = %.1f KB" % (os.path.basename(p), b / 1024.0))
ck(len(AMAP["images"]) == 49, "asset map must carry 49 images, has %d" % len(AMAP["images"]))

# ---- 11 structured data ----
blocks = re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', html, re.S)
types = set()
for b in blocks:
    try:
        d = json.loads(b)
    except Exception:
        continue
    for o in (d if isinstance(d, list) else [d]):
        t = o.get("@type")
        for tt in (t if isinstance(t, list) else [t]):
            types.add(tt)
        if tt == "FAQPage" or o.get("@type") == "FAQPage":
            qs = o.get("mainEntity", [])
            ck(len(qs) == len(COPY["description_tab"]["faqs"]), "FAQPage question count mismatch")
            for a, c in zip(qs, COPY["description_tab"]["faqs"]):
                ck(a.get("name", "").strip() == c["question"], "FAQ question not byte-identical: %s" % c["question"][:40])
                txt = a.get("acceptedAnswer", {}).get("text", "")
                ck(re.sub(r"<[^>]+>", "", txt).strip() == c["answer"], "FAQ answer not byte-identical: %s" % c["question"][:40])
for req in ["ItemPage", "Product", "BreadcrumbList", "FAQPage"]:
    ck(req in types, "structured data missing: %s" % req)
ck("AggregateOffer" in html, "AggregateOffer missing")
for extra in ["Review", "AggregateRating", "Organization"]:
    ck(extra not in types, "unsanctioned structured data type: %s" % extra)

# ---- 12 internal links: approved cluster only ----
APPROVED = {"container-houses", "container-farmhouse", "expandable-container-house",
            "flat-pack-container-homes", "luxury-container-houses", "prefab-container-homes",
            "shipping-container-homes", "tiny-container-homes"}
for href in set(re.findall(r'href="(/product/container-houses[^"#?]*)"', html)):
    slug = href.rstrip("/").split("/")[-1]
    ck(slug in APPROVED, "link to non-approved cluster URL: %s" % href)
for bad in ["prebuilt-container-homes", "prefabricated-container-home",
            "prefabricated-container-house", "modern-container-home",
            "affordable-container-homes", "/product-category/container-houses"]:
    ck(bad not in html, "link to retired/non-approved URL: %s" % bad)

# ---- 12b forbidden anchor text (keyword ownership, content map Part A2) ----
anchors = [re.sub(r"<[^>]+>", " ", a) for a in re.findall(r"<a\b[^>]*>(.*?)</a>", html, re.S)]
FORBIDDEN_ANCHORS = ["container house", "container house price", "container home",
                     "container homes", "container room", "container house design",
                     "low cost container house"]
for a in anchors:
    txt = norm(a).lower().strip(" .,:;")
    ck(txt not in FORBIDDEN_ANCHORS,
       "forbidden anchor text (owned by hub or prefab-container-homes): %r" % txt)
s2links = re.findall(r'href="(/product/container-houses/[^"#?]*)"', html)
ck("/product/container-houses/prefab-container-homes" in s2links,
   "Section 2 contextual link to prefab-container-homes missing")

# ---- 13 six sizes and six panels ----
for v in COPY["variants"]:
    ck(v["label"] in TEXT or v["size"].replace("x", " x ") in TEXT, "size label missing: %s" % v["label"])
ck(len(COPY["section3"]["panels"]) == 6, "Section 3 must carry six panels")
for p in COPY["section3"]["panels"]:
    ck(5 <= len(p["applications"]) <= 6, "Section 3 %s bullets out of range" % p["size"])
    ck(400 <= len(p["paragraph"]) <= 500, "Section 3 %s paragraph out of range" % p["size"])

# ---- 14 counts on the copy pack itself ----
ck(700 <= len(COPY["hero"]["short_description"]) <= 800, "hero short description length")
s2 = COPY["section2"]
ck(800 <= len(s2["paragraphs"][0]) + len(s2["paragraphs"][1]) <= 900, "Section 2 combined length")
for p in s2["card"]["paragraphs"]:
    ck(150 <= len(p) <= 220, "Section 2 card paragraph length")
words = sum(len(p.split()) for s in COPY["description_tab"]["sections"] for p in s["paragraphs"])
words += sum(len(b.split()) for s in COPY["description_tab"]["sections"] for b in s.get("bullets", []))
ck(2000 <= words <= 3000, "Description tab prose is %d words" % words)
for f in COPY["description_tab"]["faqs"]:
    ck(100 <= len(f["answer"]) <= 300, "FAQ answer length: %s" % f["question"][:40])
ck(6 <= len(COPY["description_tab"]["faqs"]) <= 8, "FAQ count")
bl = sum(1 for s in COPY["description_tab"]["sections"] if s.get("bullets"))
ck(bl == 1, "Description tab must carry exactly one bullet block, found %d" % bl)

print("asserts run: %d   failures: %d" % (n, len(fails)))
for f in fails:
    print("  FAIL: %s" % f)
print("RESULT: %s" % ("PASS" if not fails else "FAIL"))
sys.exit(0 if not fails else 1)
