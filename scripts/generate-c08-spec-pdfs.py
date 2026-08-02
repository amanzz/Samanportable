#!/usr/bin/env python3
"""Generate and validate the five approved C-08 technical PDFs."""

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
from reportlab.platypus import BaseDocTemplate, Frame, KeepTogether, PageTemplate, Paragraph, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
SPEC_PATH = ROOT / "src/data/products/c08-specifications.json"
OUTPUT_DIR = ROOT / "public/specs"
PRODUCTS = {
    "container-houses": ("Container Houses", "https://www.samanportable.com/product/container-houses", "SP-CH-2026"),
    "prefab-container-homes": ("Prefab Container Homes", "https://www.samanportable.com/product/container-houses/prefab-container-homes", "SP-PCH-2026"),
    "luxury-container-houses": ("Luxury Container Houses", "https://www.samanportable.com/product/container-houses/luxury-container-houses", "SP-LCH-2026"),
    "shipping-container-homes": ("Shipping Container Homes", "https://www.samanportable.com/product/container-houses/shipping-container-homes", "SP-SCH-2026"),
    "affordable-container-homes": ("Affordable Container Homes", "https://www.samanportable.com/product/container-houses/affordable-container-homes", "SP-ACH-2026"),
}
GROUPS = ("Steel Structure", "Walls, Roof, Floor & Insulation", "Doors, Windows, Electrical & Services")
WARRANTY_ROW = "5-year structural warranty and 1-year finishing warranty as standard"
WARRANTY_BODY = (
    "5-year structural warranty and 1-year finishing warranty as standard; finishing warranty "
    "extendable to 2 years on request, confirmed at quotation. Typical service life is 20 to 25 "
    "years under proper use and maintenance, which is an engineering expectation, not a warranty period."
)
SUPPLY_ONLY = (
    "Published prices are ex-factory for the unit as specified, exclusive of GST. Foundation, site "
    "levelling, water and drainage connection and the electrical service point are arranged at your "
    "site and are quoted separately."
)
DELIVERY = "Delivery in 7 to 21 working days and fixed quotation within 48 hours."
CERTIFICATIONS = (
    "ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, NSIC SPRS, Udyam, ZED Bronze, DPIIT Startup India"
)
CONTACTS = (
    "Bengaluru: +91 88616 22859 and +91 80886 85440 | sales@samanportable.com",
    "Greater Noida: +91 87960 39938 and +91 97089 89937 | ncr@samanportable.com",
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


def normalized(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def font_names() -> tuple[str, str]:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("C08Arial", str(regular)))
        pdfmetrics.registerFont(TTFont("C08ArialBold", str(bold)))
        return "C08Arial", "C08ArialBold"
    return "Helvetica", "Helvetica-Bold"


def build(slug: str, spec: dict[str, Any], product: dict[str, Any], output: Path) -> None:
    regular, bold = font_names()
    forest = colors.HexColor("#173F31")
    leaf = colors.HexColor("#3E8E54")
    pale = colors.HexColor("#EEF6F1")
    line = colors.HexColor("#D5E2DB")
    ink = colors.HexColor("#26332D")
    muted = colors.HexColor("#5F6F67")
    styles = getSampleStyleSheet()
    body = ParagraphStyle("C08Body", parent=styles["BodyText"], fontName=regular, fontSize=8, leading=10, textColor=ink)
    small = ParagraphStyle("C08Small", parent=body, fontSize=7, leading=8.5, textColor=muted)
    h1 = ParagraphStyle("C08H1", parent=styles["Heading1"], fontName=bold, fontSize=17, leading=20, textColor=forest, spaceAfter=3 * mm)
    h2 = ParagraphStyle("C08H2", parent=styles["Heading2"], fontName=bold, fontSize=11, leading=13, textColor=forest, spaceBefore=3 * mm, spaceAfter=2 * mm)
    cell = ParagraphStyle("C08Cell", parent=body, fontSize=6.8, leading=8.2)
    cell_bold = ParagraphStyle("C08CellBold", parent=cell, fontName=bold, textColor=forest)
    header = ParagraphStyle("C08Header", parent=cell, fontName=bold, textColor=colors.white)
    name, canonical, _ = PRODUCTS[slug]

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
        canvas.drawString(18 * mm, height - 18 * mm, "Bengaluru and Greater Noida | Pan-India supply")
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

    doc = BaseDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=32 * mm,
        bottomMargin=19 * mm,
        title=f"{name} Technical Specification",
        author="SAMAN Portable",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="c08", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="c08-template", frames=[frame], onPage=chrome)])

    story: list[Any] = [
        Paragraph(f"{escape(name)} - Technical Specification", h1),
        Paragraph(f"<b>Canonical URL:</b> {escape(canonical)}", small),
        Spacer(1, 2 * mm),
    ]

    for group in GROUPS:
        story.append(Paragraph(escape(group), h2))
        rows = [[Paragraph("COMPONENT", header), Paragraph("DETAIL", header)]]
        for row in (item for item in spec["specifications"] if item["group"] == group):
            rows.append([Paragraph(escape(row["component"]), cell_bold), Paragraph(escape(row["detail"]), cell)])
        table = Table(rows, colWidths=[48 * mm, 126 * mm], repeatRows=1)
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), forest),
            ("GRID", (0, 0), (-1, -1), 0.35, line),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]),
            ("PADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(table)

    price_rows = [[Paragraph("SIZE", header), Paragraph("AREA (SQ FT)", header), Paragraph("EX-GST", header), Paragraph("INCL. 18% GST", header)]]
    for variant in product["variants"]:
        price_rows.append([
            Paragraph(escape(variant["label"]), cell_bold),
            Paragraph(indian(variant["areaSqft"]), cell),
            Paragraph(f"INR {indian(variant['priceExGst'])}", cell),
            Paragraph(f"INR {indian(variant['priceInclGst'])}", cell),
        ])
    price_table = Table(price_rows, colWidths=[47 * mm, 37 * mm, 45 * mm, 45 * mm], repeatRows=1)
    price_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), forest),
        ("GRID", (0, 0), (-1, -1), 0.35, line),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]),
        ("PADDING", (0, 0), (-1, -1), 4),
    ]))
    story.extend([
        KeepTogether([Paragraph("Six approved sizes and prices", h2), price_table]),
        Paragraph("Warranty", h2),
        Paragraph(escape(WARRANTY_BODY), body),
        Paragraph("Supply scope", h2),
        Paragraph(escape(SUPPLY_ONLY), body),
        Paragraph("Delivery and quotation", h2),
        Paragraph(escape(DELIVERY), body),
        Paragraph("Certifications", h2),
        Paragraph(escape(CERTIFICATIONS), body),
        Paragraph("Contacts", h2),
        *[Paragraph(escape(contact), body) for contact in CONTACTS],
        Paragraph(f"<b>Generated:</b> {date.today().strftime('%d %B %Y')}", body),
    ])
    doc.build(story)


def main() -> None:
    specs = json.loads(SPEC_PATH.read_text(encoding="utf-8"))["products"]
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    digests: set[str] = set()
    for slug, (name, canonical, product_sku) in PRODUCTS.items():
        spec = specs[slug]
        product = json.loads((ROOT / f"src/data/products/{slug}.json").read_text(encoding="utf-8"))
        assert len(spec["specifications"]) == 30
        assert {row["group"] for row in spec["specifications"]} == set(GROUPS)
        assert len(product["variants"]) == 6
        assert product["productSku"] == product_sku
        assert product["priceCaption"] == SUPPLY_ONLY
        assert WARRANTY_BODY in product["descriptionHtml"]
        assert next(row["detail"] for row in spec["specifications"] if row["component"] == "Warranty") == WARRANTY_ROW
        expected_variant_skus = {f"{product_sku}-{variant['sizeSlug'].upper()}" for variant in product["variants"]}
        assert {variant["sku"] for variant in product["variants"]} == expected_variant_skus

        output = OUTPUT_DIR / f"{slug}-technical-specification.pdf"
        build(slug, spec, product, output)
        assert output.stat().st_size < 400_000
        digest = hashlib.sha256(output.read_bytes()).hexdigest()
        assert digest not in digests
        digests.add(digest)

        reader = PdfReader(str(output))
        extracted = normalized(" ".join(page.extract_text() or "" for page in reader.pages))
        for required in (name, canonical, WARRANTY_BODY, SUPPLY_ONLY, DELIVERY, CERTIFICATIONS, *CONTACTS, *GROUPS):
            assert normalized(required) in extracted, f"{slug}: missing {required}"
        for row in spec["specifications"]:
            assert normalized(row["component"]) in extracted, f"{slug}: missing {row['component']}"
            assert normalized(row["detail"]) in extracted, f"{slug}: missing detail for {row['component']}"
        for variant in product["variants"]:
            assert f"INR {indian(variant['priceExGst'])}" in extracted
            assert f"INR {indian(variant['priceInclGst'])}" in extracted
        assert "+91 62009 09435" not in extracted
        print(f"{slug}: {len(reader.pages)} pages | {output.stat().st_size} bytes | sha256 {digest}")
    print(f"Unique SHA-256: {len(digests)}/5")


if __name__ == "__main__":
    main()
