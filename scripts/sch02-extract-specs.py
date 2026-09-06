#!/usr/bin/env python3
"""SCH-02: build the Specifications-tab dataset from its approved sources.

Nothing in this file is authored copy. Every cell is READ from:

  Group A  the signed copy pack's `variants` (areas, rates, ex-GST and incl-GST)
  Group B  workbook sheet "02 Shipping Container Homes", the 17 rows whose
           Classification column reads "Product-Specific"
  Group C  the approved opening ledger, section 6 of
           02-size-standards/container-house-six-size-family.md, which is the same
           ledger the six Section 3 drawings and the pack's Section 3 bullets read
  Group D  the same workbook sheet, the 13 rows whose Classification column reads
           "Platform Common"
  Group E  the workbook's scope-control wording plus the pack's own exclusions list
           (description_tab section 5 bullets)

Re-running reproduces src/data/products/sch02-specifications.json byte-for-byte.
"""
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRIVE = r"D:\Project-shekhar"
PKG = os.path.join(DRIVE, "all-product-images", "Hub page (Container Houses)",
                   "shipping-container-homes")
XLSX = os.path.join(PKG, "SAMAN_Container_Houses_8_Pages_6_Sizes_Technical_Specs_Priced.xlsx")
LEDGER = os.path.join(DRIVE, "SAMAN Structural Approved Design", "02-size-standards",
                      "container-house-six-size-family.md")
COPY = json.load(open(os.path.join(REPO, "content", "sch-02",
                                   "SCH-02-shipping-container-homes-copy-v1.json"),
                      encoding="utf-8"))

SHEET = "02 Shipping Container Homes"
BLOCK_TITLES = ("Steel Structure",
                "Walls, Roof, Floor & Insulation",
                "Doors, Windows, Electrical & Services")


def inr(n):
    """Indian digit grouping, the same form the copy pack writes its prices in."""
    s = str(int(n))
    if len(s) <= 3:
        return s
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    if head:
        parts.insert(0, head)
    return ",".join(parts) + "," + tail


# ------------------------------------------------------------------- Group A
variants = COPY["variants"]
group_a = {
    "title": "A. Sizes, areas and published prices",
    "header": ["Size", "Built-up", "Carpet", "Rate / sq.ft", "Price ex-GST",
               "Price incl. 18% GST"],
    "rows": [[v["label"],
              "%d sq.ft" % v["built_up_sqft"],
              "%d sq.ft" % v["carpet_sqft"],
              "Rs %s" % inr(v["rate_per_sqft_inr"]),
              "Rs %s" % inr(v["price_ex_gst_inr"]),
              "Rs %s" % inr(v["price_incl_gst_inr"])] for v in variants],
    "note": ("Prices are ex-GST unless stated; 18 per cent GST applies. The area basis is the "
             "built-up area of the converted and joined modules."),
}

# -------------------------------------------------------------- Groups B, D
import openpyxl  # noqa: E402

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb[SHEET]

rows = []
current_block = None
for r in ws.iter_rows(values_only=True):
    cells = ["" if c is None else str(c).strip() for c in r]
    nonblank = [c for c in cells if c]
    if not nonblank:
        continue
    if len(nonblank) == 1 and cells[0] in BLOCK_TITLES:
        current_block = cells[0]
        continue
    if cells[0] == "Component" or current_block is None:
        continue
    klass = next((c for c in cells if c in ("Platform Common", "Product-Specific")), None)
    if not klass:
        continue
    body = [c for c in cells[:cells.index(klass)] if c]
    if len(body) < 4:
        continue
    rows.append({
        "block": current_block,
        "component": body[0],
        "material": body[1],
        "section": body[2],
        "detail": body[3],
        "classification": klass,
    })

specific = [r for r in rows if r["classification"] == "Product-Specific"]
common = [r for r in rows if r["classification"] == "Platform Common"]
assert len(specific) == 17, "expected 17 product-specific lines, read %d" % len(specific)
assert len(common) == 13, "expected 13 platform-common lines, read %d" % len(common)

SPEC_HEADER = ["Component", "Material / type", "Section / size / thickness", "Detail"]


def spec_rows(src):
    return [[r["component"], r["material"], r["section"], r["detail"]] for r in src]


group_b = {
    "title": "B. Product-specific build: the cargo shell and what is done to it",
    "header": SPEC_HEADER,
    "rows": spec_rows(specific),
    "note": ("Seventeen of the thirty technical lines on this page are specific to the "
             "cargo-shell conversion. Source: workbook sheet \u201c02 Shipping Container "
             "Homes\u201d."),
}
group_d = {
    "title": "D. Platform-common material key",
    "header": SPEC_HEADER,
    "rows": spec_rows(common),
    "note": ("Thirteen lines shared by design with every SAMAN cabin and container product. "
             "Source: workbook sheet \u201c02 Shipping Container Homes\u201d."),
}

# ------------------------------------------------------------------- Group C
led = open(LEDGER, encoding="utf-8").read()
block = led.split("## 6. Immutable opening ledger", 1)[1].split("## 7.", 1)[0]
ledger = {}
size = None
for line in block.splitlines():
    s = line.strip()
    m = re.fullmatch(r"\*\*(\d+x\d+)\*\*", s)
    if m:
        size = m.group(1)
        ledger[size] = {}
        continue
    m = re.match(r"-\s*(Wall A|Wall B|End C|End D|Internal doors):\s*(.+)", s)
    if m and size:
        ledger[size][m.group(1)] = m.group(2).replace("`", "").strip()

assert set(ledger) == {v["size"] for v in variants}, "ledger sizes do not match the pack"

label_by_size = {v["size"]: v["label"] for v in variants}
group_c = {
    "title": "C. Opening schedule and staged layout, by size",
    "header": ["Size", "Wall A (entrance long wall)", "Wall B (rear long wall)",
               "End C", "End D", "Internal doors"],
    "rows": [[label_by_size[v["size"]],
              ledger[v["size"]]["Wall A"], ledger[v["size"]]["Wall B"],
              ledger[v["size"]]["End C"], ledger[v["size"]]["End D"],
              ledger[v["size"]]["Internal doors"]] for v in variants],
    "note": ("Positions are foot ranges measured from End C, the plan origin. The plan and all "
             "four elevations are drawn from this ledger and from nothing else. Standard window "
             "4'-0\" x 3'-0\", sill 3'-6\", head 6'-6\". External door 3'-0\" x 7'-0\", internal "
             "doors 2'-6\" x 7'-0\". Wet-area high-level louvre EF/L-n 1'-6\" x 1'-0\", "
             "head 7'-6\"."),
}

# ------------------------------------------------------------------- Group E
group_e = {
    "title": "E. Scope boundary and exclusions",
    "header": ["Outside the published price", "Status"],
    "rows": [[b, "Confirmed separately"]
             for b in COPY["description_tab"]["sections"][4]["bullets"]],
    "note": ("Conversion basis for a documented shipping or cargo shell with engineered "
             "openings, insulation, residential lining and fixed services. Shell condition, "
             "opening reinforcement, connection steel, stacking and site joints remain "
             "project-specific and can materially change cost. No certification, fire rating, "
             "thermal value, acoustic rating, floor capacity, relocation count or transport "
             "status is asserted without the specific evidence and approval behind it."),
}

out = {
    "_source": {
        "groupA": "content/sch-02/SCH-02-shipping-container-homes-copy-v1.json > variants",
        "groupB": "%s > sheet '%s' > Classification = Product-Specific (17 rows)"
                  % (os.path.basename(XLSX), SHEET),
        "groupC": "SAMAN Structural Approved Design/02-size-standards/"
                  "container-house-six-size-family.md > section 6",
        "groupD": "%s > sheet '%s' > Classification = Platform Common (13 rows)"
                  % (os.path.basename(XLSX), SHEET),
        "groupE": "content/sch-02/SCH-02-shipping-container-homes-copy-v1.json > "
                  "description_tab section 5 bullets",
        "generatedBy": "scripts/sch02-extract-specs.py",
    },
    "narrative": COPY["specifications_tab"]["narrative"],
    "groups": [group_a, group_b, group_c, group_d, group_e],
}

dest = os.path.join(REPO, "src", "data", "products", "sch02-specifications.json")
with open(dest, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(out, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print("wrote", dest)
for g in out["groups"]:
    print("  %-62s %2d rows x %d cols" % (g["title"], len(g["rows"]), len(g["header"])))
