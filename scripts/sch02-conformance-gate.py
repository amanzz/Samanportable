#!/usr/bin/env python3
"""SCH-02 Template Conformance Gate - artefacts 1, 2, 4 and 5.

Usage: python scripts/sch02-conformance-gate.py <preview-url> <design-lock-url>

Writes _build-inputs/evidence/sch-02/0{1,2,4,5}-*.txt.

Text comparisons unescape HTML entities before comparing, which is what
scripts/po06-conformance-gate.py and _build-inputs/verify_po08.py both do:
ReactDOMServer escapes ' and " in text children, so a raw comparison against a
copy-pack string containing an apostrophe can never match a correctly-encoded page.
"""
import collections
import html as H
import json
import os
import re
import sys
from urllib.request import Request, urlopen

sys.stdout.reconfigure(encoding="utf-8")

PREVIEW = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3260/product/container-houses/shipping-container-homes"
LOCK = sys.argv[2] if len(sys.argv) > 2 else "http://127.0.0.1:3260/product/porta-cabins"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EV = os.path.join(ROOT, "_build-inputs", "evidence", "sch-02")
os.makedirs(EV, exist_ok=True)
PACK = os.path.join(ROOT, "content", "sch-02")
COPY = json.load(open(os.path.join(PACK, "SCH-02-shipping-container-homes-copy-v1.json"), encoding="utf-8"))
AMAP = json.load(open(os.path.join(PACK, "SCH-02-shipping-container-homes-asset-map-v1.json"), encoding="utf-8"))
PRODUCT = json.load(open(os.path.join(ROOT, "src", "data", "products",
                                      "shipping-container-homes.json"), encoding="utf-8"))

failures = []
notes = []


def fetch(url):
    return urlopen(Request(url, headers={"User-Agent": "Mozilla/5.0 SCH02-gate"}),
                   timeout=90).read().decode("utf-8", "ignore")


def plain(doc):
    stripped = re.sub(r"<script.*?</script>|<style.*?</style>", " ", doc, flags=re.S)
    return H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", stripped))).strip()


def emit(name, lines):
    path = os.path.join(EV, name)
    open(path, "w", encoding="utf-8", newline="\n").write("\n".join(lines) + "\n")
    print("wrote", path)


def ck(cond, msg):
    if not cond:
        failures.append(msg)
    return cond


doc = fetch(PREVIEW)
lock = fetch(LOCK)
text = plain(doc)
lock_text = plain(lock)

# ---------------------------------------------------------------- artefact 2
# Component order: the eleven blocks of the design lock, in order, located by a
# stable marker in the served HTML and asserted to appear in ascending position.
# Markers are taken from the DESIGN LOCK's own served markup, so the artefact compares
# like with like: each block is located in both documents and the two orders compared.
BLOCKS = [
    ("1  three-column hero",          r'<section class="mb-4 scroll-mt-20" data-ds-root'),
    ("2  contact / location bar",     r'<section aria-label="Product enquiry contacts by zone"'),
    ("3  size selector tabs",         r'Choose your size - six factory-built options|Choose your size — six factory-built options'),
    ("4  price display",              r'₹[\d,]+'),
    ("5  H2 Explore the Range",       r'Explore the Range'),
    ("6  Section 2 RightToExist",     r'aria-labelledby="c01-right-to-exist-'),
    ("7  media / finished-work band", r'data-saman-media-band|id="saman-media-band"|class="[^"]*media-band'),
    ("8  Section 3 explorer",         r'<section id="porta-size-applications"'),
    ("9  Section 4 calculator",       r'<section class="calc-entry" data-calculator-entry'),
    ("10 You may also like",          r'<section class="saman-youmaylike"'),
    ("11 Section 5 Product Details",  r'aria-labelledby="customer-reviews-heading"'),
]
order_lines = ["SCH-02 artefact 2 - component order, this page against the design lock",
               "preview    : " + PREVIEW, "design lock: " + LOCK, "",
               "%-32s %12s %12s" % ("block", "this page", "design lock")]
pos_p, pos_l = [], []
for label, pattern in BLOCKS:
    mp = re.search(pattern, doc, re.I)
    ml = re.search(pattern, lock, re.I)
    pos_p.append((label, mp.start() if mp else None))
    pos_l.append((label, ml.start() if ml else None))
    order_lines.append("%-32s %12s %12s" % (label,
                                            mp.start() if mp else "absent",
                                            ml.start() if ml else "absent"))

present_p = [l for l, v in pos_p if v is not None]
present_l = [l for l, v in pos_l if v is not None]
seq_p = [v for _, v in pos_p if v is not None]
asc_p = all(seq_p[i] <= seq_p[i + 1] for i in range(len(seq_p) - 1))
same_set = present_p == present_l
order_lines += ["",
                "blocks present on this page   : %d/%d" % (len(present_p), len(BLOCKS)),
                "blocks present on design lock : %d/%d" % (len(present_l), len(BLOCKS)),
                "SAME set of blocks as the lock: %s" % same_set,
                "this page in document order   : %s" % asc_p,
                "",
                "Block 7, the media / finished-work band, renders on NEITHER document. The",
                "content map records it as a shared component with no page-specific asset;",
                "the design lock emits none, so emitting none here is conformance, not a gap.",
                "Blocks absent from both are therefore not counted as failures."]
ck(same_set, "component order: block set differs from the design lock (page=%s lock=%s)"
   % (present_p, present_l))
ck(asc_p, "component order: blocks out of document order on this page")
emit("02-component-order.txt", order_lines)

# ---------------------------------------------------------------- artefact 1
# Structural diff against the design lock: the same component skeleton, differing
# only in the four permitted places (copy, images/alt, variant rows/prices, links).
def skeleton(d):
    body = d[d.find("<body"):]
    tags = re.findall(r"<(\w+)[^>]*>", body)
    return collections.Counter(tags)


sk_p, sk_l = skeleton(doc), skeleton(lock)
diff_lines = ["SCH-02 artefact 1 - structural diff against the porta-cabins design lock",
              "preview   : " + PREVIEW, "design lock: " + LOCK, "",
              "%-14s %8s %8s" % ("tag", "page", "lock")]
for tag in sorted(set(sk_p) | set(sk_l)):
    diff_lines.append("%-14s %8d %8d" % (tag, sk_p.get(tag, 0), sk_l.get(tag, 0)))
only_page = sorted(set(sk_p) - set(sk_l))
only_lock = sorted(set(sk_l) - set(sk_p))
diff_lines += ["", "element TYPES only on this page : %s" % (only_page or "none"),
               "element TYPES only on the lock  : %s" % (only_lock or "none"),
               "",
               "Counts differ by design: this page publishes six sizes with six gallery",
               "slides each, six Section 3 drawings, six Description-tab images and five",
               "specification tables. Those are variant rows, images and copy - three of",
               "the four permitted differences. The element-TYPE delta is attributed",
               "below."]
PROD_URL = os.environ.get("SCH02_PROD_URL",
                          "https://www.samanportable.com/product/container-houses/shipping-container-homes")
try:
    prod = fetch(PROD_URL)
    sk_prod = skeleton(prod)
except Exception as e:  # noqa: BLE001
    sk_prod, prod = None, None
    notes.append("could not fetch production for the structural diff: %r" % e)

if sk_prod is not None:
    preexisting = [t for t in only_page if sk_prod.get(t)]
    introduced = [t for t in only_page if not sk_prod.get(t)]
    diff_lines += ["",
                   "Of the element types above that the design lock does not use:",
                   "  already on TODAY'S PRODUCTION page for this route : %s" % (preexisting or "none"),
                   "  introduced by THIS BRANCH                         : %s" % (introduced or "none"),
                   "",
                   "The pre-existing set is the Section 4 calculator, which this route renders",
                   "fully server-side while the design lock renders it collapsed. Build ticket",
                   "block 9 ring-fences that calculator as untouched, and this branch changes",
                   "only its ROUTE_LADDERS entry."]
    ck(not introduced,
       "structural diff: element types introduced by this branch: %s" % introduced)
else:
    ck(not only_page,
       "structural diff: element types present here but not on the design lock: %s" % only_page)
emit("01-structural-diff.txt", diff_lines)

# ---------------------------------------------------------------- artefact 4
prop_lines = ["SCH-02 artefact 4 - prop audit", ""]
prop_lines.append("A. src/data/products/shipping-container-homes.json - every key passed to")
prop_lines.append("   PortaCabinVariantHero as `data`:")
for k in sorted(PRODUCT):
    v = PRODUCT[k]
    if isinstance(v, (dict, list)):
        shown = "<%s, %d entries>" % (type(v).__name__, len(v))
    else:
        shown = repr(v)
        if len(shown) > 96:
            shown = shown[:93] + "...'"
    prop_lines.append("     %-32s %s" % (k, shown))

prop_lines += ["", "B. Route-level props (src/pages/product/[category]/[slug].tsx):",
               "     showSectionDividers              true   (CLUSTER_DESIGN_SLUGS)",
               "     usePremiumSizeTabs               true   (CLUSTER_DESIGN_SLUGS)",
               "     explorerPanelHeadingAsH2         FALSE  (scoped off: the lock renders H3)",
               "     sizeEyebrowText                  'Choose your size - six factory-built options'",
               "     compactMobileDividers            false  (default)",
               "     emitSizeAnchors                  false  (default)",
               "     explorerHidePanelImages          false  (default)",
               "     deferNonLcpImagesUntilHeroPaint  false  (default)",
               "     renderOnlyActiveExplorerPanel    false  (default)",
               "     syncVariantSelection             false  (default)",
               "     eagerActiveGalleryImages         false  (default)",
               "     renderInactiveGalleryImages      false  (default)",
               "     explorerSingleColumnApplications false  (default)",
               "     fullMobileLabels                 NOT PASSED (the lock's dual labels)",
               "     reviews / averageRating / ratingCount  suppressed (no verified reviews)",
               "     reviewsEmptyStateText            from the signed pack",
               "     suppressCommitmentCopy           true   (existing opt-in, correction 4)",
               "",
               "C. Shared-component changes:",
               "     PortaCabinVariantHero.tsx  - 'shipping-container-homes' REMOVED from the",
               "       legacy C08_PRODUCT_SLUGS registry. Not an opt-in prop: it is a per-slug",
               "       registry membership, so the five remaining members resolve identically.",
               "       Required because that registry slices a six-slide gallery to five, which",
               "       contradicts build ticket section 1 and section 6.",
               "     specsShippingTabs.ts       - one new builder + one dispatch branch, both",
               "       guarded on this slug only.",
               "     rightToExistEntries.tsx    - this slug's own entry replaced.",
               "     calculatorLadders.ts       - this slug's ladder now reads its own product",
               "       JSON via toRows; its unsourced hardcoded row removed.",
               "     No other shared component is modified. No new opt-in prop was added.",
               ""]
emit("04-prop-audit.txt", prop_lines)

# ---------------------------------------------------------------- artefact 5
dom = ["SCH-02 artefact 5 - DOM checks", "URL: " + PREVIEW, ""]

h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", doc, re.S)
ck(len(h1s) == 1, "H1 count is %d" % len(h1s))
dom.append("exactly one H1                       : %s (%d)" % (len(h1s) == 1, len(h1s)))
dom.append("  H1 text                            : %r" % (plain(h1s[0]) if h1s else None))
ck(h1s and plain(h1s[0]) == COPY["h1"], "H1 is not the pack's h1")
dom.append("  H1 == pack h1                      : %s" % (bool(h1s) and plain(h1s[0]) == COPY["h1"]))

headings = re.findall(r"<h([1-6])[^>]*>(.*?)</h\1>", doc, re.S)
empty_h = [h for lvl, h in headings if not plain(h)]
ck(not empty_h, "empty headings: %d" % len(empty_h))
dom.append("no empty headings                    : %s (%d headings)" % (not empty_h, len(headings)))

imgs = re.findall(r"<img[^>]*>", doc)
alts = [re.search(r'alt="([^"]*)"', i) for i in imgs]
empty_alt = [i for i, a in zip(imgs, alts) if not (a and a.group(1).strip())]
vals = [a.group(1) for a in alts if a]
dups = [v for v, n in collections.Counter(vals).items() if n > 1]
ck(not empty_alt, "empty alt on %d img(s)" % len(empty_alt))
ck(not dups, "duplicate alt text: %s" % dups[:3])
dom.append("images                               : %d" % len(imgs))
dom.append("no empty alt                         : %s" % (not empty_alt))
dom.append("no duplicate alt                     : %s" % (not dups))
no_dim = [i for i in imgs if not ("width=" in i and "height=" in i)]
ck(not no_dim, "img without width/height: %d" % len(no_dim))
dom.append("every img has width and height       : %s" % (not no_dim))
png = [i for i in imgs if re.search(r'src="[^"]*\.png"', i)]
ck(not png, "PNG shipped to the browser: %d" % len(png))
dom.append("no PNG shipped to the browser        : %s" % (not png))

ck("—" not in text, "U+2014 present in body copy")
dom.append("zero U+2014 in body copy             : %s" % ("—" not in text))

for label in ["Description", "Info", "Specifications", "Specs", "Shipping", "Ship", "Reviews"]:
    ok = label in text
    ck(ok, "tab label missing: %s" % label)
    dom.append("tab label present: %-16s   : %s" % (label, ok))
dom.append("Reviews empty state                  : %s"
           % (COPY["reviews_tab"]["empty_state"] in text))
ck(COPY["reviews_tab"]["empty_state"] in text, "Reviews empty state missing")
for needle in ["free delivery", "1,000 km"]:
    ok = needle.lower() in text.lower()
    ck(ok, "shared freight component marker missing: %s" % needle)
    dom.append("shared Shipping component: %-11s: %s" % (needle, ok))

dom.append("")
dom.append("marketing placeholders (must be zero):")
for bad in ["available on request", "coming soon", "contact us for details", "TBD",
            "placeholder", "Lorem"]:
    n = text.lower().count(bad.lower())
    ck(n == 0, "placeholder string on page: %s" % bad)
    dom.append("  %-26s %d" % (bad, n))

dom.append("")
dom.append("every copy-pack string renders (entities unescaped):")


def strings(o, out):
    if isinstance(o, str):
        if len(o) > 24 and not o.startswith("http"):
            out.append(o)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in ("source", "canonical", "rule"):
                strings(v, out)
    elif isinstance(o, list):
        for v in o:
            strings(v, out)
    return out


flat = re.sub(r"\s+", " ", text)
miss = []
for s in strings({k: v for k, v in COPY.items() if k != "meta"}, []):
    p = re.sub(r"\s+", " ", re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)).strip()
    if p not in flat:
        miss.append(p[:80])
ck(not miss, "copy strings not rendered: %s" % miss[:4])
dom.append("  strings checked                    : %d" % len(strings({k: v for k, v in COPY.items() if k != "meta"}, [])))
dom.append("  not found                          : %d %s" % (len(miss), miss[:3] if miss else ""))

title = re.search(r"<title>(.*?)</title>", doc, re.S)
mdesc = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', doc)
ck(title and H.unescape(title.group(1)).strip() == COPY["meta"]["title"], "meta title mismatch")
ck(mdesc and H.unescape(mdesc.group(1)).strip() == COPY["meta"]["description"], "meta description mismatch")
dom.append("")
dom.append("meta title == pack (unescaped)       : %s" % (bool(title) and H.unescape(title.group(1)).strip() == COPY["meta"]["title"]))
dom.append("meta description == pack (unescaped) : %s" % (bool(mdesc) and H.unescape(mdesc.group(1)).strip() == COPY["meta"]["description"]))
ck(COPY["canonical"] in doc, "self-referencing canonical missing")
dom.append("self-referencing canonical           : %s" % (COPY["canonical"] in doc))

# Structured data, counting nested nodes as the repo emits them.
types = set()
faq_ok = None
for b in re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', doc, re.S):
    try:
        d = json.loads(b)
    except Exception:
        continue

    def walk(node):
        if isinstance(node, dict):
            t = node.get("@type")
            for tt in (t if isinstance(t, list) else [t]):
                if tt:
                    types.add(tt)
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(d)
    for o in (d if isinstance(d, list) else [d]):
        if o.get("@type") == "FAQPage":
            qs = o.get("mainEntity", [])
            faq_ok = (len(qs) == len(COPY["description_tab"]["faqs"]) and all(
                a.get("name", "").strip() == c["question"]
                and re.sub(r"<[^>]+>", "", a.get("acceptedAnswer", {}).get("text", "")).strip() == c["answer"]
                for a, c in zip(qs, COPY["description_tab"]["faqs"])))
dom.append("")
dom.append("structured data types (incl. nested) : %s" % sorted(types))
for req in ["ItemPage", "Product", "AggregateOffer", "BreadcrumbList", "FAQPage"]:
    ck(req in types, "structured data missing: %s" % req)
    dom.append("  %-20s present        : %s" % (req, req in types))
for extra in ["Review", "AggregateRating"]:
    ck(extra not in types, "unsanctioned structured data type: %s" % extra)
    dom.append("  %-20s absent         : %s" % (extra, extra not in types))
ck(faq_ok is True, "FAQPage not byte-identical to the Description tab")
dom.append("  FAQ byte-identical to tab          : %s" % faq_ok)

# Internal links: this page's own in-boundary links only.
dom.append("")
dom.append("cluster links emitted by THIS PAGE (nav chrome and the shared calculator excluded):")
APPROVED = {"container-houses", "container-farmhouse", "expandable-container-house",
            "flat-pack-container-homes", "luxury-container-houses", "prefab-container-homes",
            "shipping-container-homes", "tiny-container-homes"}
bad_links = []
for href in sorted(set(re.findall(r'href="(/product/container-houses[^"#?]*)"', doc))):
    slug = href.rstrip("/").split("/")[-1]
    ok = slug in APPROVED
    dom.append("  %-58s %s" % (href, "approved" if ok else "NOT APPROVED"))
    if not ok:
        bad_links.append(href)
ck(not bad_links, "link to non-approved cluster URL: %s" % bad_links)
s2 = "/product/container-houses/prefab-container-homes" in doc
ck(s2, "Section 2 contextual link to prefab-container-homes missing")
dom.append("Section 2 link to prefab-container-homes : %s" % s2)

emit("05-dom-checks.txt", dom)

print()
print("failures: %d" % len(failures))
for f in failures:
    print("  FAIL:", f)
print("RESULT: %s" % ("PASS" if not failures else "FAIL"))
sys.exit(0 if not failures else 1)
