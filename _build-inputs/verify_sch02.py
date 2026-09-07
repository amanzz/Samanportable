#!/usr/bin/env python3
"""SCH-02 Shipping Container Homes verifier.

Usage:
    python verify_sch02.py <page-url> [lock-url]

    page-url  defaults to http://127.0.0.1:3260/product/container-houses/shipping-container-homes
    lock-url  defaults to the same origin + /product/porta-cabins

v2, 6 September 2026. Three defects in v1 are fixed and five asserts are re-scoped.
See the CORRECTIONS block below before changing anything here.

CORRECTIONS TO v1
-----------------
D1  norm() never called html.unescape(), so any pack string containing an
    apostrophe or an inch mark could not match React's &#x27; / &quot;.
    Fixed: unescape happens first, on both the page text and the head fields.
D2  The <title> and meta-description checks compared a raw & against the
    correctly escaped &amp;. Fixed by the same unescape.
D3  The JSON-LD scan read only top-level @type, so it could not see the Product
    and BreadcrumbList this repo nests inside ItemPage. Fixed: walk the whole
    tree, including @graph, mainEntity and mainEntityOfPage.

RE-SCOPED ASSERTS
-----------------
S1  Forbidden strings, forbidden URLs and forbidden anchors are the page's
    responsibility, not the shared chrome's. Ticket sections 1 and 9 forbid
    touching Header, Footer and the Section 4 calculator, so a string that also
    appears on the design-lock page is shared-component text by definition and
    is exempt. The assert now fires only when the string is in this page's own
    authored copy, or appears in the rendered page in a context the lock page
    does not also contain.
S2  Forbidden URLs are matched inside href= and src= only. A radio-button value
    inside the shared calculator is not a link and was never the defect.
"""

import sys, os, re, json, html as _html, unicodedata
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
COPY = json.load(open(os.path.join(BASE, "SCH-02-shipping-container-homes-copy-v1.json"), encoding="utf-8"))
AMAP = json.load(open(os.path.join(BASE, "SCH-02-shipping-container-homes-asset-map-v1.json"), encoding="utf-8"))
PKG = os.path.join(os.path.dirname(BASE), "approved-website-assets-v1")

fails, n = [], 0


def ck(cond, msg):
    global n
    n += 1
    if not cond:
        fails.append(msg)


def norm(s):
    """Unescape first (D1/D2), then normalise unicode, dash ranges and whitespace."""
    s = _html.unescape(s)
    s = unicodedata.normalize("NFKC", s)
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"')
    s = re.sub(r"(?<=\d)\s*(?:-|–|—|\s+to\s+)\s*(?=\d)", "-", s)
    return re.sub(r"\s+", " ", s).strip()


def fetch(u):
    return urllib.request.urlopen(u, timeout=60).read().decode("utf-8", "replace")


url = sys.argv[1] if len(sys.argv) > 1 else \
    "http://127.0.0.1:3260/product/container-houses/shipping-container-homes"
origin = "/".join(url.split("/")[:3])
lock_url = sys.argv[2] if len(sys.argv) > 2 else origin + "/product/porta-cabins"

html_src = fetch(url)
H = norm(re.sub(r"<script[^>]*>.*?</script>", " ", html_src, flags=re.S))
TEXT = norm(re.sub(r"<[^>]+>", " ", H))

try:
    lock_src = fetch(lock_url)
except Exception as e:
    print("CANNOT REACH THE DESIGN-LOCK PAGE at %s (%s)." % (lock_url, e))
    print("Start it on the same server and re-run. The shared-component exemption")
    print("cannot be evaluated without it, and asserting without it is wrong.")
    print("RESULT: FAIL")
    sys.exit(1)
LOCK_TEXT = norm(re.sub(r"<[^>]+>", " ", re.sub(r"<script[^>]*>.*?</script>", " ", lock_src, flags=re.S)))
LOCK_HREFS = set(re.findall(r'(?:href|src)="([^"]*)"', lock_src))
LOCK_ANCHORS = set(norm(re.sub(r"<[^>]+>", " ", a)).lower().strip(" .,:;")
                   for a in re.findall(r"<a\b[^>]*>(.*?)</a>", lock_src, re.S))

# authored surface: every string this page is responsible for
def _walk_strings(o, out):
    if isinstance(o, str):
        out.append(o)
    elif isinstance(o, dict):
        for v in o.values():
            _walk_strings(v, out)
    elif isinstance(o, list):
        for v in o:
            _walk_strings(v, out)
    return out

AUTHORED = norm(" ".join(_walk_strings(COPY, []) +
                         [e.get("alt", "") for e in AMAP["images"]])).lower()


def shared_with_lock(s):
    """True when the lock page carries the same text, so it is shared-component text."""
    return norm(s).lower() in LOCK_TEXT.lower()


# ---- 1 meta, h1 ----
m = re.search(r"<title>(.*?)</title>", html_src, re.S)
ck(m is not None, "no <title> element")
if m:
    ck(norm(m.group(1)) == norm(COPY["meta"]["title"]),
       "meta title mismatch: page=%r pack=%r" % (norm(m.group(1)), norm(COPY["meta"]["title"])))
ck(55 <= len(COPY["meta"]["title"]) <= 60, "meta title length %d" % len(COPY["meta"]["title"]))

md = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', html_src)
ck(md is not None, "no meta description")
if md:
    ck(norm(md.group(1)) == norm(COPY["meta"]["description"]),
       "meta description mismatch: page=%r" % norm(md.group(1))[:90])
ck(150 <= len(COPY["meta"]["description"]) <= 160,
   "meta description length %d" % len(COPY["meta"]["description"]))

h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", html_src, re.S)
ck(len(h1s) == 1, "expected exactly one H1, found %d" % len(h1s))
if h1s:
    ck(norm(COPY["h1"]) in norm(re.sub(r"<[^>]+>", " ", h1s[0])), "H1 mismatch")
ck(50 <= len(COPY["h1"]) <= 60, "H1 length %d" % len(COPY["h1"]))

# ---- 2 canonical, no U+2014 in this page's own copy ----
ck(COPY["canonical"] in html_src, "self-referencing canonical missing")
ck("—" not in norm(" ".join(_walk_strings(COPY, []))), "U+2014 em dash in the copy pack")

# ---- 3 every copy string renders ----
miss = []
for s in _walk_strings({k: v for k, v in COPY.items()
                        if k not in ("canonical", "source", "page_id", "slug",
                                     "cluster", "generated")}, []):
    if len(s) <= 24 or s.startswith("http"):
        continue
    plain = norm(re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s))
    if plain not in TEXT:
        miss.append(plain[:70])
ck(not miss, "%d copy strings not found in rendered HTML, first: %s" % (len(miss), miss[:5]))

# ---- 4 prices present, legacy prices gone ----
flat = html_src.replace(",", "")
for v in COPY["variants"]:
    ck(str(v["price_ex_gst_inr"]) in flat, "price missing for %s" % v["size"])
for bad in ["364320", "414000", "476880", "622720", "778400", "913920"]:
    ck(bad not in flat, "legacy unsourced price still on page: %s" % bad)

# ---- 5 forbidden strings, scoped to this page's responsibility (S1) ----
FORBIDDEN = ["5-year structural", "5 year structural", "48 business hours",
             "available on request", "coming soon", "contact us for details",
             "TBD", "placeholder", "Lorem ipsum"]
for bad in FORBIDDEN:
    b = norm(bad).lower()
    ck(b not in AUTHORED, "forbidden string in this page's authored copy: %s" % bad)
    if b in TEXT.lower() and not shared_with_lock(bad):
        ck(False, "forbidden string on this page and NOT on the design lock, so it is "
                  "this page's: %s" % bad)
ck("10-year" in TEXT or "10 year" in TEXT, "10-year structural warranty not stated")
ck("7-21 working days" in TEXT, "lead time 7-21 working days not stated")

# ---- 6 four tab panels ----
for lab in ["Description", "Specifications", "Shipping", "Reviews"]:
    ck(lab in TEXT, "tab label missing: %s" % lab)
ck("Info" in TEXT and "Specs" in TEXT and "Ship" in TEXT, "responsive tab labels missing")

# ---- 7 shipping tab freight component ----
ck("free delivery" in TEXT.lower(), "free-delivery lines missing from the Shipping tab")

# ---- 8 reviews ----
ck("No verified reviews yet." in TEXT, "Reviews empty state missing")
ck("aggregateRating" not in html_src, "rating schema present with no verified reviews")

# ---- 9 images ----
imgs = re.findall(r"<img[^>]*>", html_src)
alts = [re.search(r'alt="([^"]*)"', i) for i in imgs]
ck(all(a and a.group(1).strip() for a in alts), "empty alt attribute present")
seen = [a.group(1) for a in alts if a]
ck(len(seen) == len(set(seen)), "duplicate alt text present")
for i in imgs:
    ck(not re.search(r'src="[^"]*\.png"', i), "PNG shipped to the browser: %s" % i[:90])
    ck("width=" in i and "height=" in i, "img without width/height: %s" % i[:90])
ck(len(imgs) >= 12, "too few images rendered (%d)" % len(imgs))

# ---- 10 asset package bytes ----
for e in AMAP["images"]:
    p = os.path.join(os.path.dirname(PKG), e["prebuilt_webp"].replace("/", os.sep))
    ck(os.path.exists(p), "missing asset %s" % e["prebuilt_webp"])
    if os.path.exists(p):
        b = os.path.getsize(p)
        ck(80 * 1024 <= b <= 120 * 1024,
           "asset outside the 80-120 KB band: %s = %.1f KB. If every file is over by the "
           "same amount, a metadata chunk has been appended after signing; strip it and "
           "repair the package to its manifest rather than re-encoding."
           % (os.path.basename(p), b / 1024.0))
ck(len(AMAP["images"]) == 49, "asset map must carry 49 images, has %d" % len(AMAP["images"]))

# ---- 11 structured data, walking nested graphs (D3) ----
def collect_types(o, out):
    if isinstance(o, dict):
        t = o.get("@type")
        for tt in (t if isinstance(t, list) else [t]):
            if tt:
                out.add(tt)
        for v in o.values():
            collect_types(v, out)
    elif isinstance(o, list):
        for v in o:
            collect_types(v, out)
    return out


def find_nodes(o, wanted, out):
    if isinstance(o, dict):
        t = o.get("@type")
        ts = t if isinstance(t, list) else [t]
        if wanted in ts:
            out.append(o)
        for v in o.values():
            find_nodes(v, wanted, out)
    elif isinstance(o, list):
        for v in o:
            find_nodes(v, wanted, out)
    return out


blocks = re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', html_src, re.S)
types, docs = set(), []
for b in blocks:
    try:
        d = json.loads(b)
    except Exception:
        ck(False, "JSON-LD block does not parse")
        continue
    docs.append(d)
    collect_types(d, types)

for req in ["ItemPage", "Product", "BreadcrumbList", "FAQPage"]:
    ck(req in types, "structured data missing (searched nested graphs too): %s" % req)
for extra in ["Review", "AggregateRating"]:
    ck(extra not in types, "unsanctioned structured data type: %s" % extra)
ck("AggregateOffer" in html_src, "AggregateOffer missing")

faq_nodes = []
for d in docs:
    find_nodes(d, "FAQPage", faq_nodes)
ck(len(faq_nodes) >= 1, "no FAQPage node found anywhere in the JSON-LD")
for node in faq_nodes[:1]:
    qs = node.get("mainEntity", [])
    ck(len(qs) == len(COPY["description_tab"]["faqs"]),
       "FAQPage question count %d, pack has %d" % (len(qs), len(COPY["description_tab"]["faqs"])))
    for a, c in zip(qs, COPY["description_tab"]["faqs"]):
        ck(a.get("name", "").strip() == c["question"],
           "FAQ question not byte-identical: %s" % c["question"][:40])
        txt = a.get("acceptedAnswer", {}).get("text", "")
        ck(re.sub(r"<[^>]+>", "", txt).strip() == c["answer"],
           "FAQ answer not byte-identical: %s" % c["question"][:40])

# ---- 12 internal links, href/src only, lock-exempt (S1, S2) ----
APPROVED = {"container-houses", "container-farmhouse", "expandable-container-house",
            "flat-pack-container-homes", "luxury-container-houses", "prefab-container-homes",
            "shipping-container-homes", "tiny-container-homes"}
page_links = set(re.findall(r'href="(/product/container-houses[^"#?]*)"', html_src))
for href in page_links:
    slug = href.rstrip("/").split("/")[-1]
    ck(slug in APPROVED or href in LOCK_HREFS, "link to a non-approved cluster URL: %s" % href)

hrefs_and_srcs = set(re.findall(r'(?:href|src)="([^"]*)"', html_src))
for bad in ["prebuilt-container-homes", "prefabricated-container-home",
            "prefabricated-container-house", "modern-container-home",
            "affordable-container-homes", "/product-category/container-houses"]:
    hits = [h for h in hrefs_and_srcs if bad in h and h not in LOCK_HREFS]
    ck(not hits, "link to a retired or non-approved URL: %s in %s" % (bad, hits[:2]))

# ---- 12b forbidden anchors, lock-exempt (S1) ----
FORBIDDEN_ANCHORS = {"container house", "container house price", "container home",
                     "container homes", "container room", "container house design",
                     "low cost container house"}
for a in re.findall(r"<a\b[^>]*>(.*?)</a>", html_src, re.S):
    txt = norm(re.sub(r"<[^>]+>", " ", a)).lower().strip(" .,:;")
    if txt in FORBIDDEN_ANCHORS and txt not in LOCK_ANCHORS:
        ck(False, "forbidden anchor text introduced by this page: %r" % txt)
ck("/product/container-houses/prefab-container-homes" in
   " ".join(re.findall(r'href="([^"]*)"', html_src)),
   "Section 2 contextual link to prefab-container-homes missing")

# ---- 13 six sizes, six panels ----
for v in COPY["variants"]:
    ck(v["label"] in TEXT or v["size"].replace("x", " x ") in TEXT,
       "size label missing: %s" % v["label"])
ck(len(COPY["section3"]["panels"]) == 6, "Section 3 must carry six panels")
for p in COPY["section3"]["panels"]:
    ck(5 <= len(p["applications"]) <= 6, "Section 3 %s bullets out of range" % p["size"])
    ck(400 <= len(p["paragraph"]) <= 500, "Section 3 %s paragraph out of range" % p["size"])

# ---- 14 counts on the copy pack ----
ck(700 <= len(COPY["hero"]["short_description"]) <= 800, "hero short description length")
s2 = COPY["section2"]
ck(800 <= len(s2["paragraphs"][0]) + len(s2["paragraphs"][1]) <= 910, "Section 2 combined length")
for p in s2["card"]["paragraphs"]:
    ck(150 <= len(p) <= 220, "Section 2 card paragraph length")
words = sum(len(p.split()) for s in COPY["description_tab"]["sections"] for p in s["paragraphs"])
words += sum(len(b.split()) for s in COPY["description_tab"]["sections"] for b in s.get("bullets", []))
words += sum(len(f["question"].split()) + len(f["answer"].split())
             for f in COPY["description_tab"]["faqs"])
ck(2000 <= words <= 3000, "Description tab visible prose is %d words" % words)
for f in COPY["description_tab"]["faqs"]:
    ck(100 <= len(f["answer"]) <= 300, "FAQ answer length: %s" % f["question"][:40])
ck(6 <= len(COPY["description_tab"]["faqs"]) <= 8, "FAQ count")
bl = sum(1 for s in COPY["description_tab"]["sections"] if s.get("bullets"))
ck(bl == 1, "Description tab must carry exactly one bullet block, found %d" % bl)

print("page: %s" % url)
print("lock: %s" % lock_url)
print("asserts run: %d   failures: %d" % (n, len(fails)))
for f in fails:
    print("  FAIL: %s" % f)
print("RESULT: %s" % ("PASS" if not fails else "FAIL"))
sys.exit(0 if not fails else 1)
