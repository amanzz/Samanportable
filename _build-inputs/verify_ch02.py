#!/usr/bin/env python3
"""CH-02 Luxury Container House - page verifier. Prints RESULT: PASS or RESULT: FAIL."""
import argparse, json, re, sys, urllib.request, urllib.error, os, html

PATH = "/product/container-houses/luxury-container-houses"
HERE = os.path.dirname(os.path.abspath(__file__))
COPY = json.load(open(os.path.join(HERE, "CH-02-luxury-container-houses-copy-v1.json"), encoding="utf-8"))
ASSETS = json.load(open(os.path.join(HERE, "CH-02-luxury-container-houses-asset-map-v1.json"), encoding="utf-8"))

FAILS, CHECKS = [], 0
def ck(cond, msg, line):
    global CHECKS; CHECKS += 1
    if not cond: FAILS.append(f"L{line}: {msg}")

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "SAMAN-verifier/1.0"})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.status, r.read().decode("utf-8", "replace"), dict(r.headers)

def head_len(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "SAMAN-verifier/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, int(r.headers.get("Content-Length") or 0)
    except urllib.error.HTTPError as e:
        return e.code, 0
    except Exception:
        return 0, 0

def norm(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    s = s.replace("–", "-").replace("—", "-").replace("’", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip()

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--base", required=True)
    base = ap.parse_args().base.rstrip("/")
    url = base + PATH
    status, body, _ = get(url)
    ck(status == 200, f"page returned {status}", 44)
    T = norm(body)

    # --- head ---
    m = re.search(r"<title>(.*?)</title>", body, re.S|re.I)
    title = norm(m.group(1)) if m else ""
    ck(title == COPY["head"]["meta_title"], f"meta title mismatch: {title!r}", 50)
    ck(55 <= len(title) <= 60, f"meta title {len(title)} chars, want 55-60", 51)
    ck(title.count("SAMAN") == 1, "SAMAN must appear exactly once in the meta title", 52)
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', body, re.S|re.I)
    desc = norm(m.group(1)) if m else ""
    ck(desc == COPY["head"]["meta_description"], "meta description mismatch", 55)
    ck(150 <= len(desc) <= 160, f"meta description {len(desc)} chars, want 150-160", 56)
    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", body, re.S|re.I)
    ck(len(h1s) == 1, f"expected exactly one H1, found {len(h1s)}", 58)
    if h1s:
        ck(norm(h1s[0]) == COPY["head"]["h1"], f"H1 mismatch: {norm(h1s[0])!r}", 60)
        ck(50 <= len(norm(h1s[0])) <= 60, f"H1 {len(norm(h1s[0]))} chars, want 50-60", 61)
    ck(re.search(r'rel=["\']canonical["\'][^>]*href=["\']'+re.escape(COPY["head"]["canonical"]), body, re.I) is not None,
       "canonical missing or not self-referencing", 63)

    # --- hero, section 2, section 3 copy present verbatim ---
    ck(norm(COPY["hero"]["short_description"]) in T, "hero short description not found verbatim", 66)
    s2 = COPY["section2"]
    ck(norm(s2["h2"]) in T, "Section 2 H2 not found", 68)
    ck(norm(s2["paragraph1"]) in T, "Section 2 paragraph 1 not found", 69)
    p2 = norm(re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s2["paragraph2_markdown"]))
    ck(p2 in T, "Section 2 paragraph 2 not found", 71)
    ck(800 <= len(norm(s2["paragraph1"])) + len(p2) + 1 <= 900, "Section 2 body outside 800-900 chars", 72)
    card = s2["card"]
    for key, lo, hi in (("h3", 35, 65), ("paragraph1", 150, 220), ("paragraph2", 150, 220)):
        ck(norm(card[key]) in T, f"split card {key} not found", 75)
        ck(lo <= len(norm(card[key])) <= hi, f"split card {key} outside {lo}-{hi}", 76)
    s3 = COPY["section3"]
    ck(norm(s3["h2"]) in T and 50 <= len(s3["h2"]) <= 60, "Section 3 H2 missing or outside 50-60", 78)
    ck(norm(s3["intro"]) in T and 100 <= len(s3["intro"]) <= 140, "Section 3 intro missing or outside 100-140", 79)
    ck(len(s3["panels"]) == 6, "Section 3 must carry six size panels", 80)
    for p in s3["panels"]:
        ck(norm(p["h3"]) in T, f"Section 3 H3 missing for {p['size_key']}", 82)
        ck(50 <= len(p["h3"]) <= 62, f"Section 3 H3 outside 50-62 for {p['size_key']}", 83)
        ck(norm(p["paragraph"]) in T, f"Section 3 paragraph missing for {p['size_key']}", 84)
        ck(400 <= len(p["paragraph"]) <= 500, f"Section 3 paragraph outside 400-500 for {p['size_key']}", 85)
        ck(5 <= len(p["applications"]) <= 6, f"Section 3 bullets outside 5-6 for {p['size_key']}", 86)
        for b in p["applications"]:
            ck(norm(b) in T, f"Section 3 bullet missing for {p['size_key']}: {b[:40]}", 88)
    # Section 3 headings must be H3, not H2
    for p in s3["panels"]:
        ck(re.search(r"<h3[^>]*>\s*"+re.escape(p["h3"]), body, re.I|re.S) is not None,
           f"Section 3 heading for {p['size_key']} must render as H3", 92)

    # --- prices ---
    for k, v in COPY["price_display"].items():
        ck(f"{v['ex_gst']:,}" in T, f"ex-GST price for {k} ({v['ex_gst']:,}) not on the page", 96)
    for wrong in ("3,80,160", "9,53,760", "380160", "953760", "4,32,000"):
        ck(wrong not in T, f"stale live price {wrong} still on the page", 99)

    # --- all four tab panels present in the fetched HTML ---
    for panel in ("Description", "Specifications", "Shipping", "Reviews"):
        ck(panel in T, f"tab panel {panel} not in the fetched HTML", 103)
    ck("DescriptionInfo" in re.sub(r"\s+", "", T) or ("Description" in T and "Info" in T),
       "responsive tab label pair Description/Info not rendered", 105)
    ck("Product Details" in T, "Product Details strip missing", 106)

    # --- description tab content ---
    dt = COPY["description_tab"]
    for sec in dt["sections"]:
        ck(norm(sec["h2"]) in T, f"description H2 missing: {sec['h2']}", 110)
        ck(40 <= len(sec["h2"]) <= 60, f"description H2 outside 40-60: {sec['h2']}", 111)
        for p in sec["paragraphs"]:
            ck(norm(p) in T, f"description paragraph missing: {p[:50]}", 113)
    words = sum(len(p.split()) for s in dt["sections"] for p in s["paragraphs"])
    words += len(dt["bullet_block"]["lead"].split()) + sum(len(b.split()) for b in dt["bullet_block"]["items"])
    words += len(dt["bullet_block"]["closing"].split()) + sum(len(f["q"].split()) + len(f["a"].split()) for f in dt["faq"])
    ck(2000 <= words <= 3000, f"description tab {words} visible words, want 2000-3000", 118)
    for b in dt["bullet_block"]["items"]: ck(norm(b) in T, f"bullet missing: {b[:40]}", 119)
    ck(6 <= len(dt["faq"]) <= 8, "FAQ count must be 6-8", 120)
    for f in dt["faq"]:
        ck(norm(f["q"]) in T, f"FAQ question missing: {f['q'][:40]}", 122)
        ck(norm(f["a"]) in T, f"FAQ answer missing: {f['q'][:40]}", 123)
        ck(100 <= len(f["a"]) <= 300, f"FAQ answer outside 100-300: {f['q'][:40]}", 124)

    # --- specifications tab ---
    st = COPY["specifications_tab"]
    for p in st["narrative"]: ck(norm(p) in T, f"specs narrative missing: {p[:50]}", 128)
    ck(2 <= len(st["narrative"]) <= 3, "specs narrative must be two or three paragraphs", 129)
    for g in st["groups"]:
        ck(norm(g["title"]) in T, f"specs group missing: {g['title']}", 131)
    ck(len(st["groups"][1]["rows"]) == 17, "Group B must carry the 17 product-specific rows", 132)
    ck(len(st["groups"][3]["rows"]) == 13, "Group D must carry the 13 platform-common rows", 133)

    # --- shipping tab must be the shared freight component ---
    for token in ("100", "1,000 km", "ODC"):
        ck(token in T, f"shipping freight token missing: {token}", 137)
    for token in ("free delivery within Bangalore", "Greater Noida"):
        ck(token.lower() in T.lower(), f"free-delivery line missing: {token}", 139)

    # --- reviews ---
    ck("No verified reviews yet." in T, "reviews empty state missing", 142)
    ck("aggregateRating" not in body, "aggregateRating schema must not be present without reviews", 143)

    # --- forbidden strings, normalised ---
    N = re.sub(r"(\d)\s*(?:-|to)\s*(\d)", r"\1-\2", T.lower())
    for bad in ("available on request", "coming soon", "contact us for details", "lorem", "tbd",
                "placeholder", "5 year structural", "5-year structural", "100 mm acoustic-density"):
        ck(bad not in N, f"forbidden string on the page: {bad}", 148)
    ck("—" not in body, "U+2014 em dash found in the page source", 149)

    # --- internal links ---
    hrefs = set(re.findall(r'href=["\']([^"\']+)["\']', body))
    for banned in ("affordable-container-homes", "prefabricated-container-house", "prebuilt-container-homes",
                   "prefabricated-container-home", "inexpensive-container-homes", "tiny-container-homes"):
        ck(not any(banned in h for h in hrefs), f"link to a redirected or non-approved URL: {banned}", 155)
    ck(any(h.rstrip("/").endswith("/product/container-houses") for h in hrefs),
       "contextual link to the hub /product/container-houses is missing", 157)
    for _, u in [(t["label"], t["href"]) for t in COPY["you_may_also_like"]["tiles"]]:
        s, _b, _h = get(base + u) if u.startswith("/") else (200, "", {})
        ck(s == 200, f"You may also like target {u} returned {s}", 160)

    # --- images ---
    imgs = re.findall(r"<img\b[^>]*>", body, re.I)
    srcs, alts = [], []
    for tag in imgs:
        s = re.search(r'src=["\']([^"\']+)["\']', tag); a = re.search(r'alt=["\'](.*?)["\']', tag, re.S)
        if s: srcs.append(s.group(1))
        alts.append(norm(a.group(1)) if a else None)
    ck(all(a is not None and a.strip() for a in alts), "empty or missing alt attribute found", 168)
    dup = [a for a in set(alts) if a and alts.count(a) > 1]
    ck(not dup, f"duplicate alt text: {dup[:3]}", 170)
    for tag in imgs:
        ck(re.search(r'\bwidth=', tag) and re.search(r'\bheight=', tag), "img without explicit width and height", 172)
    ck(not any(s.lower().endswith(".png") or s.lower().endswith(".jpg") for s in srcs),
       "a PNG or JPG reached the page; every fetched image must be WebP", 174)
    ck(body.count('fetchpriority="high"') <= 1, "fetchpriority=high must be on slide 1 only", 175)
    ck('rel="preload"' in body and "imagesrcset" in body, "preload link with imagesrcset missing", 176)
    for slot in ASSETS["slots"]:
        u = base + ASSETS["public_dir"] + slot["output"]
        s, n = head_len(u)
        ck(s == 200, f"asset {slot['output']} returned {s}", 180)
        if s == 200:
            ck(80 * 1024 <= n <= 120 * 1024, f"asset {slot['output']} is {n/1024:.1f} KB, want 80-120 KB", 182)

    # --- structured data ---
    blocks = re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', body, re.S|re.I)
    types = set()
    for b in blocks:
        try: data = json.loads(b)
        except Exception: ck(False, "invalid JSON-LD block", 189); continue
        for node in (data if isinstance(data, list) else [data]):
            t = node.get("@type")
            for x in (t if isinstance(t, list) else [t]): types.add(x)
    ck(types == {"ItemPage", "Product", "BreadcrumbList", "FAQPage"},
       f"structured data types are {sorted(types)}, want exactly ItemPage, Product, BreadcrumbList, FAQPage", 193)
    joined = " ".join(blocks)
    ck('"priceCurrency": "INR"' in joined or '"priceCurrency":"INR"' in joined, "AggregateOffer priceCurrency INR missing", 195)
    ck("436480" in joined and "1118976" in joined, "AggregateOffer lowPrice/highPrice must be 436480 and 1118976", 196)
    for f in COPY["description_tab"]["faq"]:
        ck(f["a"] in joined, f"FAQPage answer not byte-identical: {f['q'][:40]}", 198)

    print(f"checks run: {CHECKS}   failures: {len(FAILS)}")
    for f in FAILS: print("  FAIL", f)
    print("RESULT: PASS" if not FAILS else "RESULT: FAIL")
    sys.exit(0 if not FAILS else 1)

if __name__ == "__main__":
    main()
