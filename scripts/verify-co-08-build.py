#!/usr/bin/env python3
"""CO-08 build verification. Fetches the rendered preview and fails on any gap."""
import hashlib, json, re, sys, urllib.request

URL   = sys.argv[1]
PACK  = json.load(open("CO-08-copy-pack-v2.json"))
HASH  = json.load(open("CO-08-copy-hashes.json"))
AMAP  = json.load(open("CO-08-asset-map-v1.json"))
fails = []

def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s)).strip()

html = urllib.request.urlopen(URL, timeout=60).read().decode("utf-8", "replace")
text = norm(html)

if hashlib.sha256(open("CO-08-copy-pack-v2.json","rb").read()).hexdigest() != HASH["copy_pack_sha256"]:
    fails.append("copy pack file hash mismatch: the pack was edited after the ticket was issued")

def field(path):
    o = PACK
    for k in path.split("."):
        o = o[int(k)] if k.isdigit() else o[k]
    return o if isinstance(o, str) else json.dumps(o, ensure_ascii=False)

for path, want in HASH["fields"].items():
    val = field(path)
    if hashlib.sha256(val.encode()).hexdigest() != want:
        fails.append(f"field hash mismatch in pack: {path}")
        continue
    if path.endswith((".bullets", ".table_rows", ".blocks", ".tables")):
        items = json.loads(val)
        flat  = []
        def walk(x):
            if isinstance(x, str): flat.append(x)
            elif isinstance(x, list): [walk(i) for i in x]
            elif isinstance(x, dict): [walk(v) for v in x.values()]
        walk(items)
        for s in flat:
            if len(s) > 25 and norm(s) not in text:
                fails.append(f"copy missing from page: {path} :: {s[:70]}")
    elif norm(val) not in text:
        fails.append(f"copy missing from page: {path} :: {norm(val)[:70]}")

m = PACK["metadata"]
if f"<title>{m['seo_title']}</title>" not in html:
    fails.append("SEO title not rendered exactly")
if m["meta_description"] not in html:
    fails.append("meta description not rendered exactly")
if PACK["canonical"] not in html:
    fails.append("canonical not rendered")

for g in AMAP["gallery_36"]:
    if g["output"] not in html:
        fails.append(f"gallery asset missing: {g['output']}")
    if g["alt"] not in html:
        fails.append(f"gallery alt missing: {g['alt'][:60]}")
imgs = re.findall(r"<img[^>]+>", html)
for tag in imgs:
    if "width=" not in tag or "height=" not in tag:
        fails.append(f"img without explicit width/height: {tag[:90]}")
    if "alt=" not in tag:
        fails.append(f"img without alt: {tag[:90]}")

for n, s in enumerate(["10x20","20x20","30x20","40x20","40x40","60x20"], 1):
    if f"0{n}-expandable-office-{s}-approved-ga" not in html:
        fails.append(f"GA board missing for {s}")
for d in ("20x20-envelope-diagram", "20x20-layout-diagram"):
    if d not in html:
        fails.append(f"diagram missing: {d}")

LINKS = ["https://www.samanportable.com/product/container-offices",
         "https://www.samanportable.com/contact",
         "https://www.samanportable.com/product/container-offices/container-office-cabin",
         "https://www.samanportable.com/product/container-offices/shipping-container-office",
         "https://www.samanportable.com/product/container-offices/site-office-container"]
for u in LINKS:
    if u not in html:
        fails.append(f"internal link missing: {u}")
    try:
        request = urllib.request.Request(u, headers={"User-Agent": "SAMAN-CO08-build-verifier/1.0"})
        r = urllib.request.urlopen(request, timeout=30)
        if r.status != 200:
            fails.append(f"internal link not 200: {u} -> {r.status}")
    except Exception as e:
        fails.append(f"internal link unreachable: {u} :: {e}")

for dead in ("bess-container","containerized-data-center","container-marketing-office",
             "multi-story-container-office","flat-pack-container-office"):
    if dead in html:
        fails.append(f"404 sibling linked: {dead}")

if "aggregateRating" in html:
    fails.append("aggregateRating present: this URL has no genuine reviews")

for token in ("[DATA REQUIRED]", "TODO", "Measured:", "range 50-60", "SHA-256", "copy pack"):
    if token in text:
        fails.append(f"drafting instruction leaked to the page: {token}")

for p in ("3,75,000","7,12,500","10,46,250","13,65,000","27,00,000","20,25,000"):
    if p not in text:
        fails.append(f"price missing from page: Rs {p}")

print(f"checks complete against {URL}")
print(f"images found: {len(imgs)}")
if fails:
    print(f"\nFAILURES ({len(fails)}):")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("\nALL BUILD CHECKS PASSED")
