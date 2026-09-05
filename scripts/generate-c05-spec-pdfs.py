#!/usr/bin/env python3
"""Generate and validate the C-05 container cafe hub technical PDF.

Structure, chrome and validation are the C-04 generator's, unchanged. Only the
product set, the price-table columns (§7 carries a rate per sq ft and covers) and
the warranty string differ:

  * six approved sizes, not nine;
  * WARRANTY is the draft's §8 row-30 override, NOT the SSOT's quotation-deferred
    formulation (retired under L15). CC-01 (05 Sep 2026): the warranty row is
    withdrawn for `container-cafe` only, so the sheet carries neither the row nor
    the closing warranty paragraph. Warranty is read from the spec dataset rather
    than assumed, so the five subpages are unaffected;
  * CC-01: the COVERS column is already data-driven via `has_capacity`, so removing
    `capacity` from the product JSON removes the column with no change here;
  * `--only <slug>` regenerates one sheet, leaving the others byte-identical;
  * every specification detail is transcribed byte-exact from
    src/data/products/c05-specifications.json, itself generated from the SSOT.

Nothing in this file authors page content: every string it emits comes from the
approved draft, the SSOT, or the C-04 template it mirrors.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import date
from pathlib import Path
from typing import Any
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
SPEC_PATHS = (
    ROOT / "src/data/products/c05-specifications.json",
    ROOT / "src/data/products/c05-subpage-specifications.json",
    ROOT / "src/data/products/c05-subpage-specifications-2.json",
)
OUTPUT_DIR = ROOT / "public/specs"
PRODUCTS = {
    "container-cafe": ("Container Cafe", "https://www.samanportable.com/product/container-cafe"),
    "container-restaurant": (
        "Container Restaurant",
        "https://www.samanportable.com/product/container-cafe/container-restaurant",
    ),
    "food-truck-containers": (
        "Food Truck Containers",
        "https://www.samanportable.com/product/container-cafe/food-truck-containers",
    ),
    "container-hotel": (
        "Container Hotel",
        "https://www.samanportable.com/product/container-cafe/container-hotel",
    ),
    "modular-container-cafe": (
        "Modular Container Cafe",
        "https://www.samanportable.com/product/container-cafe/modular-container-cafe",
    ),
    "container-coffee-shop": (
        "Container Coffee Shop",
        "https://www.samanportable.com/product/container-cafe/container-coffee-shop",
    ),
}
GROUPS = ("Steel Structure", "Walls, Roof, Floor & Insulation", "Doors, Windows, Electrical & Services")
# Draft of record §8, row 30. Scoped to this route in this event.
WARRANTY = (
    "5-year structural warranty and 1-year finishing warranty as standard; "
    "finishing warranty extendable to 2 years on request, confirmed at quotation. "
    "Relocation damage, misuse, site services and unapproved alterations remain "
    "outside the agreed scope unless stated otherwise."
)
PRICE_CAPTION = "Base specification price - customisations quoted separately. Ex-factory, ex-GST."
# CC-01 (05 Sep 2026). The sheet's warranty statement is derived from the route's own
# specification rows, not from the WARRANTY constant directly. A route whose dataset
# carries no Warranty row publishes no warranty statement -- the CC-01 owner ruling --
# and every route that still carries one is byte-identical to before.
WITHDRAWN_WARRANTY_SLUGS = ("container-cafe",)
# CC-01 (05 Sep 2026). The header strap is per-route. Every sheet keeps the deployed
# manufacturing/supply line except container-cafe, whose owner ruling withdraws it as
# an unverified manufacturing claim (OF-07). Scoped by slug so the five sibling sheets
# stay byte-identical.
DEFAULT_HEADER_STRAP = "Bengaluru and Greater Noida | Pan-India supply"
HEADER_STRAP_BY_SLUG = {
    "container-cafe": "SAMAN Portable | Container Cafe technical specification",
}


def warranty_for(spec: dict[str, Any]) -> str | None:
    rows = spec["summary"] if spec.get("exemptClass") else spec["specifications"]
    for row in rows:
        if (row.get("item") or row.get("component")) == "Warranty":
            return str(row["detail"])
    return None
CONTACTS = (
    "South: +91 88616 22859 | sales@samanportable.com",
    "North: +91 87960 39938 | ncr@samanportable.com",
)


def indian(value: int) -> str:
    value_text = str(value)
    if len(value_text) <= 3:
        return value_text
    tail, head = value_text[-3:], value_text[:-3]
    parts: list[str] = []
    while head:
        parts.append(head[-2:])
        head = head[:-2]
    return ",".join(reversed(parts)) + "," + tail


def font_names() -> tuple[str, str]:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("C05Arial", str(regular)))
        pdfmetrics.registerFont(TTFont("C05ArialBold", str(bold)))
        return "C05Arial", "C05ArialBold"
    return "Helvetica", "Helvetica-Bold"


def build(slug: str, spec: dict[str, Any], product: dict[str, Any], output: Path) -> None:
    regular, bold = font_names()
    forest, leaf = colors.HexColor("#173F31"), colors.HexColor("#3E8E54")
    pale, line, ink, muted = colors.HexColor("#EEF6F1"), colors.HexColor("#D5E2DB"), colors.HexColor("#26332D"), colors.HexColor("#5F6F67")
    styles = getSampleStyleSheet()
    body = ParagraphStyle("C05Body", parent=styles["BodyText"], fontName=regular, fontSize=8, leading=10, textColor=ink)
    small = ParagraphStyle("C05Small", parent=body, fontSize=7, leading=8.5, textColor=muted)
    h1 = ParagraphStyle("C05H1", parent=styles["Heading1"], fontName=bold, fontSize=17, leading=20, textColor=forest, spaceAfter=3 * mm)
    h2 = ParagraphStyle("C05H2", parent=styles["Heading2"], fontName=bold, fontSize=11, leading=13, textColor=forest, spaceBefore=3 * mm, spaceAfter=2 * mm)
    cell = ParagraphStyle("C05Cell", parent=body, fontSize=6.8, leading=8.2)
    cell_bold = ParagraphStyle("C05CellBold", parent=cell, fontName=bold, textColor=forest)
    header = ParagraphStyle("C05Header", parent=cell, fontName=bold, textColor=colors.white)
    name, canonical = PRODUCTS[slug]

    def chrome(canvas: Any, doc: Any) -> None:
        width, height = A4
        canvas.saveState()
        canvas.setFillColor(forest)
        canvas.rect(0, height - 25 * mm, width, 25 * mm, stroke=0, fill=1)
        canvas.setFont(bold, 15)
        canvas.setFillColor(colors.white)
        canvas.drawString(18 * mm, height - 12 * mm, "SAMAN PORTABLE")
        canvas.setFont(regular, 7.5)
        canvas.setFillColor(colors.HexColor("#D5E8DE"))
        canvas.drawString(18 * mm, height - 18 * mm, HEADER_STRAP_BY_SLUG.get(slug, DEFAULT_HEADER_STRAP))
        canvas.setFont(bold, 8)
        canvas.setFillColor(colors.white)
        canvas.drawRightString(width - 18 * mm, height - 12 * mm, name.upper())
        canvas.setFont(regular, 7)
        canvas.drawRightString(width - 18 * mm, height - 18 * mm, "Technical Specification and Price Sheet")
        canvas.setStrokeColor(leaf)
        canvas.setLineWidth(1.2 * mm)
        canvas.line(0, height - 25 * mm, width, height - 25 * mm)
        canvas.setStrokeColor(line)
        canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
        canvas.setFillColor(muted)
        canvas.setFont(regular, 6.5)
        canvas.drawString(18 * mm, 9 * mm, "www.samanportable.com")
        canvas.drawRightString(width - 18 * mm, 9 * mm, f"Page {doc.page}")
        canvas.restoreState()

    doc = BaseDocTemplate(str(output), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=32 * mm, bottomMargin=19 * mm, title=f"{name} Technical Specification", author="SAMAN Portable")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="c05", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="c05-template", frames=[frame], onPage=chrome)])

    story: list[Any] = [
        Paragraph(f"{escape(name)} - Technical Specifications and Price List", h1),
        Paragraph(f"<b>Canonical URL:</b> {escape(canonical)}", small),
        Spacer(1, 2 * mm),
        Paragraph("Six approved sizes and prices", h2),
    ]
    has_capacity = any(v.get("capacity") for v in product["variants"])
    head_cells = [Paragraph("SIZE", header), Paragraph("AREA (SQ FT)", header)]
    if has_capacity:
        head_cells.append(Paragraph("COVERS", header))
    head_cells += [Paragraph("RATE EX-GST", header), Paragraph("EX-GST", header),
                   Paragraph("INCL. 18% GST", header)]
    rows = [head_cells]
    for variant in product["variants"]:
        rate = round(variant["priceExGst"] / variant["areaSqft"])
        row_cells = [Paragraph(escape(variant["dims"]), cell_bold),
                     Paragraph(indian(variant["areaSqft"]), cell)]
        if has_capacity:
            row_cells.append(Paragraph(escape(variant.get("capacity", "")), cell))
        row_cells += [Paragraph(f"INR {indian(rate)}/sq ft", cell),
                      Paragraph(f"INR {indian(variant['priceExGst'])}", cell),
                      Paragraph(f"INR {indian(variant['priceInclGst'])}", cell)]
        rows.append(row_cells)
    widths = ([30, 24, 22, 32, 33, 33] if has_capacity else [34, 30, 36, 37, 37])
    table = Table(rows, colWidths=[w * mm for w in widths], repeatRows=1)
    table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), forest), ("GRID", (0, 0), (-1, -1), 0.35, line), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]), ("PADDING", (0, 0), (-1, -1), 4)]))
    story.extend([table, Paragraph(escape(PRICE_CAPTION), small)])

    if spec.get("exemptClass"):
        story.append(Paragraph("Coffee shop fit-out", h2))
        rows = [[Paragraph("ITEM", header), Paragraph("DETAIL", header)]]
        for row in spec["summary"]:
            rows.append([Paragraph(escape(row["item"]), cell_bold),
                         Paragraph(escape(row["detail"]), cell)])
        table = Table(rows, colWidths=[48 * mm, 126 * mm], repeatRows=1)
        table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), forest), ("GRID", (0, 0), (-1, -1), 0.35, line), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]), ("PADDING", (0, 0), (-1, -1), 4)]))
        story.append(table)
        story.append(Paragraph(
            "This unit is built on the standard cafe shell. The full 30-row structural "
            "specification is published on the container cafe hub at "
            "https://www.samanportable.com/product/container-cafe", small))
    for group in (() if spec.get("exemptClass") else GROUPS):
        story.append(Paragraph(escape(group), h2))
        rows = [[Paragraph("COMPONENT", header), Paragraph("DETAIL", header)]]
        for row in (item for item in spec["specifications"] if item["group"] == group):
            rows.append([Paragraph(escape(row["component"]), cell_bold), Paragraph(escape(row["detail"]), cell)])
        table = Table(rows, colWidths=[48 * mm, 126 * mm], repeatRows=1)
        table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), forest), ("GRID", (0, 0), (-1, -1), 0.35, line), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]), ("PADDING", (0, 0), (-1, -1), 4)]))
        story.append(table)

    warranty = warranty_for(spec)
    story.extend([
        Paragraph("Warranty and contacts" if warranty else "Contacts", h2),
        *([Paragraph(f"<b>Warranty:</b> {escape(warranty)}", body)] if warranty else []),
        *[Paragraph(f"<b>{escape(entry)}</b>", body) for entry in CONTACTS],
        Paragraph(f"<b>Generated:</b> {date.today().strftime('%d %B %Y')}", body),
    ])
    doc.build(story)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--only", action="append", choices=sorted(PRODUCTS),
                        help="regenerate only this slug; repeatable. Omitted, all six are built.")
    args = parser.parse_args()
    wanted = tuple(args.only) if args.only else tuple(PRODUCTS)

    specs = {}
    for path in SPEC_PATHS:
        specs.update(json.loads(path.read_text(encoding="utf-8"))["products"])
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for slug, (name, canonical) in PRODUCTS.items():
        if slug not in wanted:
            continue
        spec = specs[slug]
        product = json.loads((ROOT / f"src/data/products/{slug}.json").read_text(encoding="utf-8"))
        exempt = bool(spec.get("exemptClass"))
        warranty = warranty_for(spec)
        if slug in WITHDRAWN_WARRANTY_SLUGS:
            # CC-01 owner ruling: withdrawn, and not replaced by any substitute claim.
            assert warranty is None, f"{slug}: warranty row must stay withdrawn"
        else:
            assert warranty == WARRANTY, f"{slug}: warranty row is not the ruled override"
        if exempt:
            assert len(spec["summary"]) == 6, len(spec["summary"])
        else:
            expected_rows = 29 if slug in WITHDRAWN_WARRANTY_SLUGS else 30
            assert len(spec["specifications"]) == expected_rows, len(spec["specifications"])
        assert len(product["variants"]) == 6, len(product["variants"])
        output = OUTPUT_DIR / f"{slug}-technical-specification.pdf"
        build(slug, spec, product, output)
        assert output.stat().st_size < 400_000, output.stat().st_size
        digest = hashlib.sha256(output.read_bytes()).hexdigest()
        reader = PdfReader(str(output))
        extracted = re.sub(r"\s+", " ", " ".join(page.extract_text() or "" for page in reader.pages))
        for required in (name, canonical, PRICE_CAPTION, *CONTACTS, *( (warranty,) if warranty else () )):
            assert re.sub(r"\s+", " ", required) in extracted, f"{slug}: missing {required}"
        # Retired strings must not reach the sheet (draft §11 gate 10).
        banned_common = ("+91 62009 09435", "8,50,000", "9,15,000", "24/7",
                         "12-month workmanship warranty")
        if slug in WITHDRAWN_WARRANTY_SLUGS:
            # CC-01: capacity and warranty are withdrawn, so neither the COVERS column,
            # any cover count, nor any warranty wording may reach the sheet.
            assert not any(v.get("capacity") for v in product["variants"]), f"{slug}: capacity re-entered the data"
            for gone in ("COVERS", "diners", "Warranty", "warranty", "structural warranty",
                         DEFAULT_HEADER_STRAP, "Bengaluru", "Greater Noida", "Pan-India"):
                assert gone not in extracted, f"{slug}: withdrawn string present: {gone}"
        banned_route = {
            "container-restaurant": ("15,55,000", "16,95,000", "11,85,000"),
            "food-truck-containers": ("4,55,000", "4,95,000", "6,40,000"),
            "container-hotel": ("8,25,000",),
            "modular-container-cafe": ("32,55,000",),
            "container-coffee-shop": ("2,85,000",),
        }.get(slug, ())
        for banned in banned_common + banned_route:
            assert banned not in extracted, f"{slug}: banned string present: {banned}"
        checks = (spec["summary"] if exempt else spec["specifications"])
        for row in checks:
            label = row.get("item") or row.get("component")
            assert re.sub(r"\s+", " ", row["detail"]) in extracted, f"{slug}: missing {label}"
        print(f"{slug}: {len(reader.pages)} pages | {output.stat().st_size} bytes | sha256 {digest}")


if __name__ == "__main__":
    main()
