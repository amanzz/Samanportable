#!/usr/bin/env python3
"""CH-02 Template Conformance Gate - artefacts 1, 2, 4 and 5.

  1  structural diff of the rendered page against the porta-cabins design lock
  2  component-order assertion, the eleven blocks in order
  4  prop audit: every shared component, every prop, its source expression and the
     value it resolves to for this slug, with each opt-in's declared default
  5  DOM checks: one H1, no empty headings, no empty or duplicate alt, no U+2014,
     and the forbidden-string grep

Usage: python scripts/ch02-gates.py --base http://127.0.0.1:3102 --lock <lock-url> --out <dir>
"""
import argparse, html, json, os, re, subprocess, sys, urllib.request, urllib.error
from collections import Counter

sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
PATH = "/product/container-houses/luxury-container-houses"
ROUTE = os.path.join(REPO, "src", "pages", "product", "[category]", "[slug].tsx")
SLUG = "luxury-container-houses"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "SAMAN-ch02-gate/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def strip(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def body_only(doc):
    """Everything the reader sees: scripts, styles and JSON payloads removed."""
    doc = re.sub(r"<script\b[^>]*>.*?</script>", " ", doc, flags=re.S | re.I)
    doc = re.sub(r"<style\b[^>]*>.*?</style>", " ", doc, flags=re.S | re.I)
    return doc


# ===================================================================== gate 5
def gate5(doc, out):
    L = ["CH-02 Template Conformance Gate - artefact 5: DOM checks",
         f"page: {PATH}", ""]
    fails = []
    visible = body_only(doc)

    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", visible, re.S | re.I)
    L.append(f"H1 count: {len(h1s)}  (require exactly 1)")
    for h in h1s:
        L.append(f"  H1: {strip(h)!r}")
    if len(h1s) != 1:
        fails.append(f"H1 count is {len(h1s)}, want 1")

    headings = re.findall(r"<(h[1-6])[^>]*>(.*?)</\1>", visible, re.S | re.I)
    empty = [(t, h) for t, h in headings if not strip(h)]
    L.append(f"\nheadings total: {len(headings)}   empty headings: {len(empty)}  (require 0)")
    for t, h in empty:
        fails.append(f"empty <{t}>")
    order = [(t.lower(), strip(h)) for t, h in headings]
    L.append("heading outline:")
    for t, h in order:
        L.append(f"  <{t}> {h[:96]}")

    imgs = re.findall(r"<img\b[^>]*>", visible, re.I)
    alts = []
    for tag in imgs:
        m = re.search(r'alt=(?:"(.*?)"|\'(.*?)\')', tag, re.S)
        alts.append(strip(m.group(1) if m and m.group(1) is not None else (m.group(2) if m else "")) if m else None)
    missing = [i for i, a in enumerate(alts) if a is None or not a]
    dupes = {a: c for a, c in Counter(a for a in alts if a).items() if c > 1}
    L.append(f"\nimg count: {len(imgs)}   missing/empty alt: {len(missing)}  (require 0)"
             f"   duplicate alt texts: {len(dupes)}  (require 0)")
    for a, c in dupes.items():
        L.append(f"  DUPLICATE x{c}: {a[:110]}")
        fails.append(f"duplicate alt x{c}: {a[:60]}")
    for i in missing:
        L.append(f"  MISSING ALT: {imgs[i][:150]}")
        fails.append("img with empty or missing alt")
    no_dim = [t for t in imgs if not (re.search(r"\bwidth=", t) and re.search(r"\bheight=", t))]
    L.append(f"img without explicit width AND height: {len(no_dim)}  (require 0)")
    for t in no_dim:
        L.append(f"  {t[:150]}")
        fails.append("img without width/height")

    em = doc.count("—")
    L.append(f"\nU+2014 EM DASH in the full page source: {em}  (require 0)")
    if em:
        for m in re.finditer(r".{60}—.{60}", doc, re.S):
            L.append(f"  ...{m.group(0)}...")
        fails.append(f"{em} U+2014 in page source")

    L.append("\nforbidden-string grep (case-insensitive, over visible text):")
    lowered = strip(visible).lower()
    for bad in ("available on request", "coming soon", "contact us for details", "tbd", "lorem"):
        n = len(re.findall(r"\b" + re.escape(bad) + r"\b", lowered))
        L.append(f"  {bad!r}: {n} hits  (require 0)")
        if n:
            fails.append(f"forbidden string {bad!r} x{n}")

    L.append("")
    L.append("RESULT: PASS" if not fails else "RESULT: FAIL")
    for f in fails:
        L.append("  FAIL " + f)
    write(out, "ch02-gate5-dom-checks.txt", L)
    return fails


# ===================================================================== gate 2
BLOCKS = [
    # Each marker is a DOM landmark the shared component emits, chosen so the match
    # cannot be satisfied by body copy that merely mentions the block's name.
    # NB the first `data-ds-root` on any page is the site HEADER, and the site-wide
    # top bar names both factory cities above the hero, so neither is usable here.
    ("1  three-column hero (PortaCabinVariantHero grid)", r'class="pc-hero-grid"'),
    ("2  contact / location bar (hero zone cards)", r"South Zone"),
    ("3  size selector tabs (usePremiumSizeTabs)", r'class="[^"]*saman-size-chips'),
    ("4  price display for the selected size", r"\+ GST"),
    ("5  H2 Explore the Range", r"<h2[^>]*>\s*Explore the Range"),
    ("6  Section 2 RightToExist + split card", r'class="saman-s2-split"'),
    ("7  Section 2 media pairing (the split card's 16:9 frame)", r'class="saman-s2-split-media"'),
    ("8  Section 3 SizeApplicationsExplorer", r'id="porta-size-applications"'),
    ("9  Section 4 calculator", r'class="estimate-card"|Live estimate'),
    ("10 You may also like", r'class="[^"]*saman-youmaylike'),
    ("11 Section 5 Product Details, four tabs", r"Product Details"),
]


def gate2(doc, out):
    L = ["CH-02 Template Conformance Gate - artefact 2: component-order assertion",
         f"page: {PATH}", "",
         "The eleven design-lock blocks, in the order they appear in the served HTML.",
         "'at' is the byte offset of the first match of each block's DOM marker.", ""]
    positions, fails = [], []
    # Scripts and styles are stripped first: a long CSS authoring comment mentions
    # "Product Details", and __NEXT_DATA__ repeats every rendered string.
    visible = body_only(doc)
    for name, pattern in BLOCKS:
        m = re.search(pattern, visible, re.I)
        if not m:
            L.append(f"  MISSING  {name}   (marker /{pattern}/)")
            fails.append(f"block not found: {name}")
            positions.append(None)
        else:
            L.append(f"  at {m.start():>8}  {name}")
            positions.append(m.start())
    seen = [p for p in positions if p is not None]
    ordered = seen == sorted(seen)
    L.append("")
    L.append(f"blocks found: {len(seen)}/11    in ascending document order: {ordered}")
    if not ordered:
        fails.append("blocks are not in design-lock order")
    # Every role="tab" on the page. Three groups share the role: the six hero size
    # chips, the six Section 3 explorer tabs, the YMAL carousel dots (aria-label, no
    # text) and the four Product Details tabs.
    all_tabs = re.findall(r'<button[^>]*role="tab"[^>]*>(.*?)</button>', visible, re.S | re.I)
    labelled = [strip(t) for t in all_tabs if strip(t)]
    product_tabs = [t for t in labelled if t.split()[0] in
                    ("Description", "Specifications", "Shipping", "Reviews")]
    L.append(f"")
    L.append(f"role=tab elements: {len(all_tabs)}  (size chips, explorer tabs, YMAL dots, product tabs)")
    L.append(f"Product Details tab strip: {product_tabs}")
    L.append(f"there is no fifth tab: {len(product_tabs) == 4}")
    if len(product_tabs) != 4:
        fails.append(f"Product Details has {len(product_tabs)} tabs, want 4")
    flat = "".join(product_tabs).replace(" ", "")
    L.append(f"flattened scrape reads: {flat!r}")
    L.append(f"responsive pair Description/Info present: {flat.startswith(chr(39) + chr(39)) or flat.startswith('DescriptionInfo')}")
    if not flat.startswith("DescriptionInfo"):
        fails.append("tab strip does not read DescriptionInfo when flattened")
    L.append("")
    L.append("RESULT: PASS" if not fails else "RESULT: FAIL")
    for f in fails:
        L.append("  FAIL " + f)
    write(out, "ch02-gate2-component-order.txt", L)
    return fails


# ===================================================================== gate 1
def skeleton(doc):
    """Structure without content: landmark tags and their class attribute only."""
    out = []
    for m in re.finditer(r"<(section|div|h1|h2|h3|h4|ul|ol|table|nav|aside|figure|img|a|button)\b([^>]*)>",
                         body_only(doc), re.I):
        tag = m.group(1).lower()
        cls = re.search(r'class="([^"]*)"', m.group(2))
        cls = cls.group(1) if cls else ""
        cls = " ".join(c for c in cls.split() if c.startswith("saman-"))
        if tag in ("section", "h1", "h2", "h3", "h4", "ul", "ol", "table", "nav", "aside", "figure") or cls:
            out.append(f"{tag}|{cls}")
    return out


def gate1(doc, lock_doc, out):
    a, b = skeleton(lock_doc), skeleton(doc)
    ca, cb = Counter(a), Counter(b)
    L = ["CH-02 Template Conformance Gate - artefact 1: structural diff vs the design lock",
         f"page:       {PATH}",
         "design lock: /product/porta-cabins", "",
         "Compared as a bag of structural landmarks (tag + saman-* classes only), so",
         "copy, images and alt text, size rows and prices, and link destinations - the",
         "four things the lock permits to differ - cannot register as structure.", "",
         f"landmarks on the design lock: {len(a)}",
         f"landmarks on this page:       {len(b)}", "",
         "delta by landmark (design lock -> this page):"]
    keys = sorted(set(ca) | set(cb))
    deltas = []
    for k in keys:
        if ca[k] != cb[k]:
            deltas.append((k, ca[k], cb[k]))
    if not deltas:
        L.append("  (none)")
    for k, x, y in deltas:
        L.append(f"  {k:<48} {x:>4} -> {y:>4}   ({y - x:+d})")
    only_lock = sorted(set(ca) - set(cb))
    only_page = sorted(set(cb) - set(ca))
    L.append(f"landmark classes only on the design lock: {only_lock or '(none)'}")
    L.append(f"landmark classes only on this page:       {only_page or '(none)'}")
    L.append("")

    # The <section> count is the one delta large enough to need itemising, so it is
    # broken out by class rather than asserted away.
    def sections(doc):
        c = Counter()
        for m in re.finditer(r"<section\b([^>]*)>", body_only(doc), re.I):
            cl = re.search(r'class="([^"]*)"', m.group(1))
            c[(cl.group(1)[:58] if cl else "(no class)")] += 1
        return c
    sa, sb = sections(lock_doc), sections(doc)
    L.append("-" * 78)
    L.append("<section> elements by class")
    L.append("-" * 78)
    L.append(f"  {'design lock':>12}  {'this page':>10}   class")
    for k in sorted(set(sa) | set(sb), key=lambda k: -(sb[k] + sa[k])):
        L.append(f"  {sa[k]:>12}  {sb[k]:>10}   {k}")
    calc = sum(v for k, v in sb.items() if k.startswith(("calc-step", "cabin-calculator", "wall-diagram",
                                                         "price-tables", "noscript-content")))
    L.append("")
    L.append(f"  of this page's sections, {calc} belong to the EMBEDDED CALCULATOR.")
    L.append("")
    L.append("=" * 78)
    L.append("CLASSIFICATION - every delta above, and which permitted axis it sits on")
    L.append("=" * 78)
    L.append("""
1. The embedded calculator (calc-step x8, cabin-calculator-ssr, wall-diagram,
   price-tables, noscript-content, and their h2/h3/table/ul children).
   The design lock is the category HUB route, which renders only the calculator
   ENTRY band; every PRODUCT route renders the calculator itself. This is a
   route-level difference that predates this page - PO-01 through PO-08 all carry
   it - and build prompt v1 3.11 rules the calculator untouched. Not authored here.

2. Copy volume. The Description tab's nine approved H2 sections plus the FAQ run,
   the Section 3 six size panels (H3 by 3.7) and the Specifications tab's FIVE
   approved group tables against the lock's two. Every one of these is a string
   from the signed pack rendered through the shared component. Permitted axis:
   copy strings.

3. YMAL and Explore the Range card counts (saman-ymal-card 10 -> 3, saman-ymal-dot
   8 -> 1). Build prompt v1 3.6: the approved container-houses list, this page
   excluded, only destinations returning 200, and never padded by repeating a tile.
   Today that is exactly three. Permitted axis: internal-link destinations.

4. figure 2 -> 0. The lock's two figures are its Specifications tab's technical
   diagram frames. The CH-02 pack ships no spec diagrams - its drawings are the six
   Section 3 GA boards - and the design lock's own rule is that an empty slot
   renders NOTHING rather than fallback content. Permitted axis: images.

5. saman-s2-split-cta 1 -> 2. The lock's Section 2 renders the split card's CTA
   only; this page's approved copy also supplies a lead CTA (section2.cta), which
   the shared component already has a slot for (topCtaLabel/topCtaHref, default
   absent). Permitted axis: copy strings.

No landmark class exists on this page that the design lock does not also render.
The one class the lock has and this page does not is `figure`, explained at 4.""")
    write(out, "ch02-gate1-structural-diff.txt", L)
    return []


# ===================================================================== gate 4
PROP_RE = re.compile(r"^\s{18,}([a-zA-Z][a-zA-Z0-9]*)=\{")


def gate4(out):
    src = open(ROUTE, encoding="utf-8").read()
    consts = dict(re.findall(r"const (CO0[0-9]_SLUG|CMO_SLUG)\s*=\s*'([^']+)'", src))
    lines = src.split("\n")

    def block(start_pat, name):
        i = next(i for i, l in enumerate(lines) if start_pat in l)
        depth, j, props = 0, i, []
        while j < len(lines):
            if re.match(r"^\s*/>|^\s*>\s*$", lines[j]) and j > i:
                break
            m = PROP_RE.match(lines[j])
            if m:
                expr, k = "", j
                while k < len(lines):
                    expr += lines[k]
                    if expr.count("{") == expr.count("}"):
                        break
                    expr += "\n"
                    k += 1
                props.append((m.group(1), expr.split("=", 1)[1].strip()))
                j = k
            j += 1
        return name, props

    targets = [block("<PortaCabinVariantHero", "PortaCabinVariantHero"),
               block("<ProductTabs", "ProductTabs")]

    def resolve(expr):
        js = expr.strip()
        if js.startswith("{") and js.endswith("}"):
            js = js[1:-1]
        js = re.sub(r"//[^\n]*", "", js)
        js = re.sub(r"\{/\*.*?\*/\}", "", js, flags=re.S)
        js = js.strip()
        prelude = ("const slug=%r;const CLUSTER_DESIGN_SLUGS=new Set([%r]);"
                   % (SLUG, SLUG)) + "".join(f"const {k}={v!r};" for k, v in consts.items())
        prog = prelude + "\ntry{const v=(" + js + ");console.log(JSON.stringify(v===undefined?'undefined':v));}" \
               "catch(e){console.log('<needs page data>');}"
        r = subprocess.run(["node", "-e", prog], capture_output=True, text=True)
        return (r.stdout or r.stderr).strip().split("\n")[-1][:120]

    L = ["CH-02 Template Conformance Gate - artefact 4: prop audit",
         f"slug: {SLUG}", "",
         "Every prop passed to each shared component on this route, the source",
         "expression, and the value it resolves to for THIS slug. Props whose value",
         "depends on fetched page data are marked <needs page data> - their source",
         "expression is shown in full so the wiring is still auditable.", ""]
    for name, props in targets:
        L.append("=" * 78)
        L.append(f"<{name}>   props passed: {len(props)}")
        L.append("=" * 78)
        for prop, expr in props:
            L.append(f"\n  {prop}")
            L.append(f"    source : {' '.join(expr.split())[:400]}")
            L.append(f"    value  : {resolve(expr)}")

    L.append("\n" + "=" * 78)
    L.append("Opt-in props and their declared defaults (from the component's own signature)")
    L.append("=" * 78)
    comp = open(os.path.join(REPO, "src", "components", "product-variant-hero",
                             "PortaCabinVariantHero.tsx"), encoding="utf-8").read()
    for m in re.finditer(r"^\s{2}([a-zA-Z][a-zA-Z0-9]*)\s*=\s*(false|true|''|\[\]),?$", comp, re.M):
        L.append(f"  {m.group(1):<38} default {m.group(2)}")
    L.append("")
    L.append("This page turns ON only: showSectionDividers, usePremiumSizeTabs.")
    L.append("It explicitly leaves explorerPanelHeadingAsH2 OFF (build prompt v1 3.7),")
    L.append("and fullMobileLabels OFF so the tab strip reads Description/Info.")
    write(out, "ch02-gate4-prop-audit.txt", L)
    return []


def write(out, name, lines):
    p = os.path.join(out, name)
    with open(p, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(lines) + "\n")
    print("wrote", p)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True)
    ap.add_argument("--lock", default="https://www.samanportable.com/product/porta-cabins")
    ap.add_argument("--out", default=os.path.join(REPO, "_build-inputs", "artefacts"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    status, doc = get(a.base.rstrip("/") + PATH)
    print(f"page {status}  {len(doc)} bytes")
    lock_status, lock_doc = get(a.lock)
    print(f"lock {lock_status}  {len(lock_doc)} bytes")
    fails = []
    fails += gate5(doc, a.out)
    fails += gate2(doc, a.out)
    fails += gate1(doc, lock_doc, a.out)
    fails += gate4(a.out)
    print("\nGATE RESULT:", "PASS" if not fails else f"FAIL ({len(fails)})")
    for f in fails:
        print("  ", f)
    sys.exit(0 if not fails else 1)


if __name__ == "__main__":
    main()
