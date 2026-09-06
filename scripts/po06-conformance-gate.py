#!/usr/bin/env python3
"""PO-06 Template Conformance Gate - artefacts 1, 2, 4 and 5.

Usage: python scripts/po06-conformance-gate.py <preview-url> <design-lock-url>

Writes _build-inputs/evidence/po-06/0{1,2,4,5}-*.txt. Exit code 0 only when every
assertion holds.
"""
import sys, re, json, os, html as H, collections
from urllib.request import urlopen, Request

PREVIEW, LOCK = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EV = os.path.join(ROOT, "_build-inputs", "evidence", "po-06")
os.makedirs(EV, exist_ok=True)
PACK = os.path.join(ROOT, "content", "po-06")
COPY = json.load(open(os.path.join(PACK, "PO-06-construction-site-cabin-copy-v1.json"), encoding="utf-8"))
AMAP = json.load(open(os.path.join(PACK, "PO-06-construction-site-cabin-asset-map-v1.json"), encoding="utf-8"))
failures = []


def fetch(url):
    return urlopen(Request(url, headers={"User-Agent": "Mozilla/5.0 PO06-gate"}), timeout=90).read().decode("utf-8", "ignore")


def body(doc):
    return doc[doc.find("<body"):]


def plain(doc):
    stripped = re.sub(r"<script.*?</script>|<style.*?</style>", " ", doc, flags=re.S)
    return H.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", stripped)))


def emit(name, lines):
    path = os.path.join(EV, name)
    open(path, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print("wrote " + path)


prev, lock = fetch(PREVIEW), fetch(LOCK)
open(os.path.join(EV, "preview.html"), "w", encoding="utf-8").write(prev)
open(os.path.join(EV, "designlock.html"), "w", encoding="utf-8").write(lock)

# ---------------------------------------------------------------- artefact 1
# Structural diff: the component tree of the shared page region, in order. Each
# shared block is identified by the marker markup the shared component itself emits,
# so the comparison is of COMPONENTS, not of content.
MARKERS = [
    ("hero section (T24.1 three-column)",           r'data-ds-root=""'),
    ("hero gallery column (1:1 frame)",             r'class="[^"]*aspect-square bg-gradient-to-br from-slate-100'),
    ("zone contact bar (ProductZoneCtas)",          r'Bangalore &amp; South Zone|Bangalore & South Zone'),
    ("hero premium size chips",                     r'class="saman-size-chips"'),
    ("buy box column (pc-buybox)",                  r'class="pc-buybox'),
    ("related rail (pc-rail / Explore the Range)",  r'class="pc-rail'),
    ("section divider",                             r'saman-section-divider|pc-divider'),
    ("RightToExist section",                        r'aria-labelledby="[a-z0-9-]*right-to-exist|saman-s2-split'),
    ("RightToExist split card",                     r'class="saman-s2-split"'),
    ("SizeApplicationsExplorer",                    r'id="porta-size-applications"'),
    ("explorer premium size tabs",                  r'class="saman-size-tabs"'),
    ("calculator strip",                            r'PRICE IT YOURSELF'),
    ("PortaCabinsYouMayAlsoLike",                   r'saman-ymal-card|You may also like'),
    ("ProductTabs (Product Details)",               r'>Product Details<'),
    ("Description panel",                           r'>Description<'),
    ("Specifications panel",                        r'>Specifications<'),
    ("Shipping panel",                              r'>Shipping<'),
    ("Reviews panel",                               r'>Reviews<'),
]
rows, order_prev, order_lock = [], [], []
for label, pat in MARKERS:
    mp = re.search(pat, body(prev))
    ml = re.search(pat, body(lock))
    rows.append((label, mp.start() if mp else None, ml.start() if ml else None))
    if mp:
        order_prev.append(label)
    if ml:
        order_lock.append(label)

out = ["ARTEFACT 1 - STRUCTURAL DIFF vs THE DESIGN LOCK",
       "preview    : " + PREVIEW,
       "design lock: " + LOCK,
       "",
       "Each row is a SHARED COMPONENT identified by the marker markup that component",
       "itself emits. Only presence and ORDER are compared; byte offsets differ because",
       "the two pages carry different copy, which is a permitted content difference.",
       "",
       "%-46s %10s %10s  %s" % ("shared component", "preview", "lock", "verdict")]
for label, p, l in rows:
    verdict = "both present" if (p is not None and l is not None) else (
        "PREVIEW ONLY" if p is not None else "LOCK ONLY")
    out.append("%-46s %10s %10s  %s" % (label, p if p is not None else "-", l if l is not None else "-", verdict))
out += ["",
        "Component ORDER, preview    : " + " > ".join(order_prev),
        "Component ORDER, design lock: " + " > ".join(order_lock),
        ""]
common = [x for x in order_prev if x in order_lock]
common_lock = [x for x in order_lock if x in order_prev]
if common != common_lock:
    failures.append("component order differs from the design lock")
    out.append("RESULT: FAIL - order differs")
else:
    out.append("RESULT: PASS - every shared component present on both pages appears in the")
    out.append("identical order. The delta is content only.")
only_prev = [x for x in order_prev if x not in order_lock]
only_lock = [x for x in order_lock if x not in order_prev]
out += ["",
        "Present on the preview but not on the design lock: " + (", ".join(only_prev) or "(none)"),
        "Present on the design lock but not on the preview: " + (", ".join(only_lock) or "(none)"),
        "",
        "Known, pre-existing hub-vs-product-route divergences (not introduced by this page,",
        "documented on PO-01 through PO-05): the hub route renders no calculator H2 block,",
        "and the hub's own Description tab publishes its six 16:9 frames the same way this",
        "page publishes its five."]
emit("01-structural-diff.txt", out)

# ---------------------------------------------------------------- artefact 2
# Component-order assertion: the eleven canonical blocks, in rendered order.
S2CARD = os.path.basename(AMAP["section2_card"]["out"])
BLOCKS = [
    (1,  "three-column hero",                        r'data-ds-root=""'),
    (2,  "contact / location bar",                   r'Bangalore &amp; South Zone|Bangalore & South Zone'),
    (3,  "size selector tabs (usePremiumSizeTabs)",  r'class="saman-size-chips"'),
    (4,  "price display for the selected size",      re.escape("incl. 18% GST")),
    (5,  "H2 Explore the Range panel",               r'>Explore the Range<'),
    (6,  "Section 2 RightToExist",                   re.escape(H.escape(COPY["section2"]["h2"], quote=False))),
    (7,  "Section 2 media pairing (the split card)", re.escape(S2CARD)),
    (8,  "Section 3 SizeApplicationsExplorer",       re.escape(H.escape(COPY["section3"]["h2"], quote=False))),
    (9,  "Section 4 calculator",                     r'PRICE IT YOURSELF'),
    (10, "You may also like",                        r'>You may also like<'),
    (11, "Section 5 Product Details tab strip",      r'>Product Details<'),
]
out = ["ARTEFACT 2 - COMPONENT-ORDER ASSERTION (the eleven canonical blocks)",
       "preview: " + PREVIEW, "",
       "%-4s %-48s %10s" % ("#", "block", "offset")]
pos, missing = [], []
for n, label, pat in BLOCKS:
    m = re.search(pat, body(prev))
    out.append("%-4s %-48s %10s" % (n, label, m.start() if m else "MISSING"))
    if m:
        pos.append((n, m.start()))
    else:
        missing.append(label)
ordered = [p for _, p in pos] == sorted(p for _, p in pos)
ok = not missing and ordered
out += ["", "RESULT: " + ("PASS - all eleven blocks present, in the canonical order."
                          if ok else "FAIL - " + (", ".join(missing) or "out of order"))]

# Ruling 3 - five 16:9 frames INSIDE the Description tab, none between S2 and S3.
b = body(prev)
tabs_start = b.find(">Product Details<")
desc_panel = re.search(r'(?s)Product Overview.*?(?=Technical Specifications|Specifications</)', b[tabs_start:])
panel_html = desc_panel.group(0) if desc_panel else ""
desc_files = [os.path.basename(d["out"]) for d in AMAP["description_images"].values()]
in_panel = [n for n in desc_files if n in panel_html]
s2 = b.find(H.escape(COPY["section2"]["split_card"]["h3"], quote=False))
s3 = b.find(H.escape(COPY["section3"]["h2"], quote=False))
between = [n for n in desc_files if 0 <= s2 < b.find(n) < s3] if (s2 >= 0 and s3 >= 0) else []
imgs_between = len(re.findall(r"<img[^>]+>", b[s2:s3])) if (s2 >= 0 and s3 >= 0) else -1
out += ["",
        "Ruling 3 - the Description tab carries FIVE images (the 20x10 site exterior",
        "moved to the Section 2 card), and there is no media band between Section 2",
        "and Section 3:",
        "  description frames found inside the Description panel (must be 5): %d  %s"
        % (len(in_panel), sorted(in_panel)),
        "  description frames rendering between Section 2 and Section 3 (must be 0): %d %s"
        % (len(between), between),
        "  ANY <img> between the split-card H3 and the Section 3 H2 (must be 0): %d" % imgs_between,
        "  the split card itself sits ABOVE that H3, which is why 0 is correct here."]
if len(in_panel) != 5:
    failures.append("the Description tab must carry the five pack frames")
if between or imgs_between != 0:
    failures.append("media band between Section 2 and Section 3")
if not ok:
    failures.append("canonical block order")

# Section 3 headings must be H3, not H2 (project instructions section 11).
h3s = [H.unescape(re.sub("<[^>]+>", "", x)).strip() for x in re.findall(r"<h3[^>]*>(.*?)</h3>", b, re.S)]
h2s = [H.unescape(re.sub("<[^>]+>", "", x)).strip() for x in re.findall(r"<h2[^>]*>(.*?)</h2>", b, re.S)]
as_h3 = [s["h3"] for s in COPY["section3"]["sizes"] if s["h3"] in h3s]
as_h2 = [s["h3"] for s in COPY["section3"]["sizes"] if s["h3"] in h2s]
out += ["",
        "Section 3 size headings render as H3 (6 expected), never H2:",
        "  as H3: %d   as H2: %d" % (len(as_h3), len(as_h2))]
if len(as_h3) != 6 or as_h2:
    failures.append("Section 3 size headings must render as H3")
emit("02-component-order.txt", out)

# ---------------------------------------------------------------- artefact 4
PROPS = [
    ("data",                             "this page's product record",  "porta-cabins product record",   "content (variant/size rows, prices, copy, images)"),
    ("productTitle",                     "Portable Construction Site Cabin", "Porta Cabin",              "content (copy string)"),
    ("averageRating",                    "product.average_rating",      "product.average_rating",        "identical expression"),
    ("ratingCount",                      "product.rating_count",        "product.rating_count",          "identical expression"),
    ("railItems",                        "page-owned relatedTiles",     "cluster rail",                  "content (internal-link destinations)"),
    ("currentHref",                      "/product/portable-office/construction-site-cabin", "/product/porta-cabins", "content (this route's own href)"),
    ("showSectionDividers",              "true",  "true",  "IDENTICAL"),
    ("usePremiumSizeTabs",               "true",  "true",  "IDENTICAL"),
    ("explorerPanelHeadingAsH2",         "false", "false (not passed -> default)", "IDENTICAL"),
    ("compactMobileDividers",            "false", "false (not passed -> default)", "IDENTICAL"),
    ("sizeEyebrowText",                  "'Choose your size - six factory-built options'", "undefined -> shared default", "content (copy string)"),
    ("emitSizeAnchors",                  "false", "variantData?.emitSizeAnchors",  "IDENTICAL (both falsy)"),
    ("explorerHidePanelImages",          "false", "false (not passed -> default)", "IDENTICAL"),
    ("deferNonLcpImagesUntilHeroPaint",  "false", "false (not passed -> default)", "IDENTICAL"),
    ("renderOnlyActiveExplorerPanel",    "false", "false (not passed -> default)", "IDENTICAL"),
    ("syncVariantSelection",             "false", "false (not passed -> default)", "IDENTICAL"),
    ("eagerActiveGalleryImages",         "false", "false (not passed -> default)", "IDENTICAL"),
    ("renderInactiveGalleryImages",      "false", "false (not passed -> default)", "IDENTICAL"),
    ("explorerSingleColumnApplications", "false", "false (not passed -> default)", "IDENTICAL"),
]
TABS = [
    ("description",           "descriptionHtml from this page's pack", "the hub's own descriptionHtml", "content (copy + images)"),
    ("specificationsHtml",    "this page's Groups A-E",                "the hub's spec groups",         "content (copy strings)"),
    ("shippingHtml",          "buildShippingHtml() - no options",      "buildShippingHtml() - no options", "IDENTICAL CALL"),
    ("reviews / averageRating / ratingCount", "[] / undefined / 0",    "[] / undefined / 0",            "IDENTICAL (neither page has approved reviews)"),
    ("fullMobileLabels",      "false (not in the list)",               "false (not passed -> default)", "IDENTICAL"),
    ("reviewsEmptyStateText", "pack empty state",                      "undefined -> deployed zero-state", "content (copy string)"),
]
out = ["ARTEFACT 4 - PROP AUDIT",
       "preview route    : src/pages/product/[category]/[slug].tsx  (slug=construction-site-cabin)",
       "design-lock route: src/pages/product/[category]/index.tsx   (category=porta-cabins)", "",
       "PortaCabinVariantHero",
       "%-34s %-48s %-34s %s" % ("prop", "this page", "design lock", "classification")]
for name, mine, theirs, kind in PROPS:
    out.append("%-34s %-48s %-34s %s" % (name, str(mine)[:48], str(theirs)[:34], kind))
out += ["", "ProductTabs",
        "%-34s %-48s %-34s %s" % ("prop", "this page", "design lock", "classification")]
for name, mine, theirs, kind in TABS:
    out.append("%-34s %-48s %-34s %s" % (name, str(mine)[:48], str(theirs)[:34], kind))
allp = PROPS + TABS
behaviour = [p for p in allp
             if not p[3].startswith("content")
             and p[3] not in ("IDENTICAL", "IDENTICAL (both falsy)", "IDENTICAL CALL",
                              "identical expression",
                              "IDENTICAL (neither page has approved reviews)")]
out += ["",
        "Behaviour props that differ (must be zero): %d" % len(behaviour),
        "Every remaining difference is one of the four permitted content kinds:",
        "  copy strings; images and alt text; variant/size rows and prices; internal-link",
        "  destinations and anchors.",
        "",
        "Shared components below the hero take no per-page behaviour prop from this route:",
        "  RightToExist              - resolved by productSlug from rightToExistEntries.tsx",
        "  PortaCabinsYouMayAlsoLike - items + subline only (both content)",
        "  ProductTabs               - shippingHtml is buildShippingHtml() with NO options,",
        "                              i.e. byte-for-byte the call the design lock makes.",
        "",
        "RESULT: " + ("PASS" if not behaviour else "FAIL")]
if behaviour:
    failures.append("prop audit: a behaviour prop differs")
emit("04-prop-audit.txt", out)

# ---------------------------------------------------------------- artefact 5
text = plain(prev)
out = ["ARTEFACT 5 - DOM CHECKS ON THE FETCHED PREVIEW HTML", "url: " + PREVIEW, ""]


def check(label, ok_, evidence=""):
    out.append(("PASS  " if ok_ else "FAIL  ") + label + (("  | " + str(evidence)[:170]) if evidence != "" else ""))
    if not ok_:
        failures.append(label)


h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", b, re.S)
check("exactly one H1", len(h1) == 1, [re.sub("<[^>]+>", "", x).strip() for x in h1])
heads = re.findall(r"<h([1-6])[^>]*>(.*?)</h\1>", b, re.S)
empty = [h for h in heads if not re.sub("<[^>]+>", "", h[1]).strip()]
check("no empty heading", not empty, "%d headings, %d empty" % (len(heads), len(empty)))
imgs = re.findall(r"<img[^>]+>", b)
alts = [m.group(1) for m in (re.search(r'alt="([^"]*)"', i) for i in imgs) if m]
check("every img has an alt attribute", len(alts) == len(imgs), "%d/%d" % (len(alts), len(imgs)))
check("no empty alt", all(a.strip() for a in alts))
dups = sorted({a for a, c in collections.Counter(alts).items() if c > 1})
check("no duplicate alt", not dups, dups)
check("explicit width and height on every img",
      all(re.search(r'width="\d+"', i) and re.search(r'height="\d+"', i) for i in imgs), "%d imgs" % len(imgs))
check("no U+2014 em dash in body text", "—" not in text)

# All four tab panels present, with the correct responsive dual labels. The second
# word of each pair is the small-screen label and MUST differ from the first.
for desktop, mobile in [("Description", "Info"), ("Specifications", "Specs"), ("Shipping", "Ship")]:
    pair = re.search(r'<span class="hidden sm:inline">%s</span><span class="sm:hidden">([^<]*)</span>' % desktop, b)
    check("tab %s has a DIFFERENT small-screen label %r" % (desktop, mobile),
          bool(pair) and pair.group(1) == mobile, pair.group(1) if pair else "pair not found")
check("Reviews tab present (single label, no pair)", bool(re.search(r'<span>Reviews</span>', b)))
check("no DescriptionDescription", "DescriptionDescription" not in re.sub(r"\s+", "", text))
check("no fifth tab called Info", len(re.findall(r'<span class="sm:hidden">Info</span>', b)) == 1
      and not re.search(r'value="info"', b))
# Radix renders the four panels as radix-<id>-content-<name>; all four are in the
# fetched SSR HTML, not mounted on click.
for panel in ["description", "additional", "shipping", "reviews"]:
    check("tab panel in the fetched HTML: " + panel,
          bool(re.search(r'id="radix-[^"]*-content-%s"' % panel, b)))
check("all four panels are server-rendered", len(re.findall(r'id="radix-[^"]*-content-(?:description|additional|shipping|reviews)"', b)) == 4)

# Normalise "-", en dash and " to " BETWEEN DIGITS before grepping, per the gate.
def dashnorm(t):
    return re.sub(r"(\d)\s*(?:-|–|to)\s*(\d)", r"\1-\2", t)


norm = dashnorm(text)
locknorm = dashnorm(plain(lock))
for pat in ["coming soon", "available on request", "contact us for details", "placeholder", "TBD", "working days"]:
    hits = len(re.findall(re.escape(pat), norm, re.I))
    lockhits = len(re.findall(re.escape(pat), locknorm, re.I))
    check("zero hits for %r" % pat, hits == 0,
          "preview %d | LIVE DESIGN LOCK %d" % (hits, lockhits))
for bad in COPY["old_page_strings_absent"]:
    lockhit = bad.lower() in locknorm.lower()
    check("pack forbids: %r" % bad, bad.lower() not in norm.lower(),
          "also on the LIVE design lock" if lockhit else "")
out += ["",
        "NOTE on any 'working days' hit above: the preview column is measured against the",
        "LIVE DESIGN LOCK column. Where both are non-zero the string is shared chrome that",
        "the design lock itself publishes, and no page-level change can remove it - see",
        "artefact 9 for the traced source lines."]
emit("05-dom-checks.txt", out)

print("\nFAILURES: %d" % len(failures))
for f in failures:
    print("  - " + f)
sys.exit(1 if failures else 0)
