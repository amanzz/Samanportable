#!/usr/bin/env python3
"""Generate the four C-06 PDFs from the approved page datasets."""

from __future__ import annotations

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
SPEC_PATH = ROOT / "src/data/products/c06-specifications.json"
OUTPUT_DIR = ROOT / "public/specs"
PRODUCTS = {
    "labor-colony": {
        "name": "Labour Colony (Labor Colony)",
        "canonical": "https://www.samanportable.com/product/labor-colony",
    },
    "labor-sheds": {
        "name": "Labor Sheds",
        "canonical": "https://www.samanportable.com/product/labor-colony/labor-sheds",
    },
    "labor-hutments": {
        "name": "Labor Hutments",
        "canonical": "https://www.samanportable.com/product/labor-colony/labor-hutments",
    },
    "prefab-labor-camps": {
        "name": "Prefab Labor Camps",
        "canonical": "https://www.samanportable.com/product/labor-colony/prefab-labor-camps",
    },
}
WARRANTY = (
    "Warranty period and exclusions are confirmed only in the final quotation; "
    "relocation damage, misuse, site services and unapproved alterations remain "
    "outside the agreed scope unless stated otherwise."
)
PRICE_NOTE = "Base specification price, customisations quoted separately."
CONTACTS = (
    ("South", "+91 88616 22859", "sales@samanportable.com"),
    ("North", "+91 87960 39938", "ncr@samanportable.com"),
)
BANNED_PHONE = "+91 62009 " + "09435"
GROUP_ORDER = (
    "Steel Structure",
    "Walls, Roof, Floor & Insulation",
    "Doors, Windows, Electrical & Services",
)


def indian(value: int) -> str:
    raw = str(value)
    if len(raw) <= 3:
        return raw
    tail, head = raw[-3:], raw[:-3]
    pieces: list[str] = []
    while head:
        pieces.append(head[-2:])
        head = head[:-2]
    return ",".join(reversed(pieces)) + "," + tail


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def fonts() -> tuple[str, str]:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("C06Arial", str(regular)))
        pdfmetrics.registerFont(TTFont("C06ArialBold", str(bold)))
        return "C06Arial", "C06ArialBold"
    return "Helvetica", "Helvetica-Bold"


def load() -> tuple[dict[str, Any], dict[str, Any]]:
    specs = json.loads(SPEC_PATH.read_text(encoding="utf-8"))["products"]
    products: dict[str, Any] = {}
    for slug, meta in PRODUCTS.items():
        entry = specs[slug]
        assert entry["name"] == meta["name"], slug
        assert len(entry["specifications"]) == 30, slug
        assert [row["group"] for row in entry["specifications"] if row["component"] == "Warranty"] == [
            "Doors, Windows, Electrical & Services"
        ], slug
        warranty = next(row["detail"] for row in entry["specifications"] if row["component"] == "Warranty")
        assert warranty == WARRANTY, slug
        product = json.loads((ROOT / f"src/data/products/{slug}.json").read_text(encoding="utf-8"))
        assert len(product["variants"]) == 6, slug
        assert all(isinstance(item["priceExGst"], int) for item in product["variants"]), slug
        assert all(isinstance(item["priceInclGst"], int) for item in product["variants"]), slug
        products[slug] = product
    return specs, products


def build(slug: str, spec: dict[str, Any], product: dict[str, Any], output: Path) -> None:
    regular, bold = fonts()
    forest = colors.HexColor("#173F31")
    leaf = colors.HexColor("#3E8E54")
    pale = colors.HexColor("#EEF6F1")
    highlight = colors.HexColor("#DFF1E5")
    line = colors.HexColor("#D5E2DB")
    ink = colors.HexColor("#26332D")
    muted = colors.HexColor("#5F6F67")
    styles = getSampleStyleSheet()
    body = ParagraphStyle("C06Body", parent=styles["BodyText"], fontName=regular, fontSize=8.2, leading=10.5, textColor=ink)
    small = ParagraphStyle("C06Small", parent=body, fontSize=7.1, leading=9, textColor=muted)
    h1 = ParagraphStyle("C06H1", parent=styles["Heading1"], fontName=bold, fontSize=17, leading=20, textColor=forest, spaceAfter=3 * mm)
    h2 = ParagraphStyle("C06H2", parent=styles["Heading2"], fontName=bold, fontSize=12, leading=14, textColor=forest, spaceBefore=3 * mm, spaceAfter=2 * mm)
    cell = ParagraphStyle("C06Cell", parent=body, fontSize=7, leading=8.5)
    cell_bold = ParagraphStyle("C06CellBold", parent=cell, fontName=bold, textColor=forest)
    header_cell = ParagraphStyle("C06Header", parent=cell, fontName=bold, textColor=colors.white)
    meta = PRODUCTS[slug]

    def header_footer(canvas: Any, doc: Any) -> None:
        width, height = A4
        canvas.saveState()
        canvas.setFillColor(forest)
        canvas.rect(0, height - 25 * mm, width, 25 * mm, stroke=0, fill=1)
        canvas.setFont(bold, 15)
        canvas.setFillColor(colors.white)
        canvas.drawString(18 * mm, height - 12 * mm, "SAMAN PORTABLE")
        canvas.setFont(regular, 7.5)
        canvas.setFillColor(colors.HexColor("#D5E8DE"))
        canvas.drawString(18 * mm, height - 18 * mm, "Bengaluru and Greater Noida | Pan-India supply")
        canvas.setFont(bold, 8)
        canvas.setFillColor(colors.white)
        canvas.drawRightString(width - 18 * mm, height - 12 * mm, meta["name"].upper())
        canvas.setFont(regular, 7)
        canvas.drawRightString(width - 18 * mm, height - 18 * mm, "Technical Specification and Price Sheet")
        canvas.setStrokeColor(leaf)
        canvas.setLineWidth(1.2 * mm)
        canvas.line(0, height - 25 * mm, width, height - 25 * mm)
        canvas.setStrokeColor(line)
        canvas.setLineWidth(0.3)
        canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
        canvas.setFillColor(muted)
        canvas.setFont(regular, 6.5)
        canvas.drawString(18 * mm, 9 * mm, "www.samanportable.com")
        canvas.drawRightString(width - 18 * mm, 9 * mm, f"Page {doc.page}")
        canvas.restoreState()

    doc = BaseDocTemplate(
        str(output), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=32 * mm, bottomMargin=19 * mm,
        title=f"{meta['name']} Technical Specification", author="SAMAN Portable",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="c06", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="c06-template", frames=[frame], onPage=header_footer)])

    story: list[Any] = [
        Paragraph(f"{escape(meta['name'])} - Technical Specifications and Price List", h1),
        Paragraph(f"<b>Canonical URL:</b> {escape(meta['canonical'])}", small),
        Spacer(1, 2 * mm),
        Paragraph("Six approved sizes and prices", h2),
    ]
    price_rows = [[Paragraph("SIZE", header_cell), Paragraph("AREA (SQ FT)", header_cell), Paragraph("EX-GST", header_cell), Paragraph("INCL. 18% GST", header_cell)]]
    for variant in product["variants"]:
        price_rows.append([
            Paragraph(escape(variant["label"]), cell_bold),
            Paragraph(indian(variant["areaSqft"]), cell),
            Paragraph(f"INR {indian(variant['priceExGst'])}", cell),
            Paragraph(f"INR {indian(variant['priceInclGst'])}", cell),
        ])
    price_table = Table(price_rows, colWidths=[47 * mm, 37 * mm, 45 * mm, 45 * mm], repeatRows=1)
    price_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), forest), ("GRID", (0, 0), (-1, -1), 0.35, line),
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.extend([price_table, Paragraph(PRICE_NOTE, small), Paragraph("Technical specifications", h2)])

    for group in GROUP_ORDER:
        story.append(Paragraph(escape(group), h2))
        rows = [[Paragraph("COMPONENT", header_cell), Paragraph("DETAIL", header_cell)]]
        differing_rows: list[int] = []
        for row in [item for item in spec["specifications"] if item["group"] == group]:
            rows.append([Paragraph(escape(row["component"]), cell_bold), Paragraph(escape(row["detail"]), cell)])
            if row["differsFromHub"]:
                differing_rows.append(len(rows) - 1)
        table = Table(rows, colWidths=[48 * mm, 126 * mm], repeatRows=1)
        commands: list[tuple[Any, ...]] = [
            ("BACKGROUND", (0, 0), (-1, 0), forest), ("GRID", (0, 0), (-1, -1), 0.35, line),
            ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]),
            ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]
        commands.extend(("BACKGROUND", (0, row_index), (-1, row_index), highlight) for row_index in differing_rows)
        table.setStyle(TableStyle(commands))
        story.append(table)

    story.extend([
        Paragraph("Warranty and contacts", h2),
        Paragraph(f"<b>Warranty:</b> {escape(WARRANTY)}", body),
        Paragraph("<b>South:</b> +91 88616 22859 | sales@samanportable.com", body),
        Paragraph("<b>North:</b> +91 87960 39938 | ncr@samanportable.com", body),
        Paragraph(f"<b>Generated:</b> {date.today().strftime('%d %B %Y')}", body),
    ])
    doc.build(story)


def validate(slug: str, spec: dict[str, Any], product: dict[str, Any], output: Path) -> tuple[int, int, str]:
    assert output.exists(), slug
    assert output.stat().st_size < 400_000, slug
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    reader = PdfReader(str(output))
    text = compact(" ".join(page.extract_text() or "" for page in reader.pages))
    for required in [PRODUCTS[slug]["name"], PRODUCTS[slug]["canonical"], WARRANTY, PRICE_NOTE, *[value for contact in CONTACTS for value in contact]]:
        assert compact(required) in text, f"{slug}: missing {required}"
    assert BANNED_PHONE not in text, slug
    for row in spec["specifications"]:
        assert compact(row["component"]) in text, f"{slug}: missing {row['component']}"
        assert compact(row["detail"]) in text, f"{slug}: missing detail for {row['component']}"
    for variant in product["variants"]:
        assert f"INR {indian(variant['priceExGst'])}" in text, slug
        assert f"INR {indian(variant['priceInclGst'])}" in text, slug
    return len(reader.pages), output.stat().st_size, digest


def main() -> None:
    specs, products = load()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    digests: set[str] = set()
    for slug in PRODUCTS:
        output = OUTPUT_DIR / f"{slug}-technical-specification.pdf"
        build(slug, specs[slug], products[slug], output)
        pages, size, digest = validate(slug, specs[slug], products[slug], output)
        assert digest not in digests, f"{slug}: duplicate PDF"
        digests.add(digest)
        print(f"{slug}: {pages} pages | {size} bytes | sha256 {digest}")
    print(f"Unique SHA-256: {len(digests)}/4")
    print("Canonical warranty: 4/4")
    print("Banned phone: 0")


if __name__ == "__main__":
    main()
