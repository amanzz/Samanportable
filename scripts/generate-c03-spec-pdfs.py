#!/usr/bin/env python3
"""Generate and validate the six C-03 technical-specification PDFs.

Specifications come only from specs-tab-dataset.json. Prices come only from the
published variant JSON files. The generator deliberately does not read or
recompute values from a workbook.
"""

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
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
SPEC_DATASET = ROOT / "src/data/products/specs-tab-dataset.json"
OUTPUT_DIR = ROOT / "public/specs"

PRODUCTS: dict[str, dict[str, str]] = {
    "portable-office": {
        "name": "Portable Office Cabin",
        "canonical": "https://www.samanportable.com/product/portable-office",
    },
    "readymade-office-cabin": {
        "name": "Readymade Office Cabin",
        "canonical": (
            "https://www.samanportable.com/product/portable-office/"
            "readymade-office-cabin"
        ),
    },
    "modern-office-cabin": {
        "name": "Modern Office Cabin",
        "canonical": (
            "https://www.samanportable.com/product/portable-office/"
            "modern-office-cabin"
        ),
    },
    "prefabricated-office-cabins": {
        "name": "Prefabricated Office Cabins",
        "canonical": (
            "https://www.samanportable.com/product/portable-office/"
            "prefabricated-office-cabins"
        ),
    },
    "portable-office-container": {
        "name": "Portable Office Container",
        "canonical": (
            "https://www.samanportable.com/product/portable-office/"
            "portable-office-container"
        ),
    },
    "small-office-cabin": {
        "name": "Small Office Cabin",
        "canonical": (
            "https://www.samanportable.com/product/portable-office/"
            "small-office-cabin"
        ),
    },
}

WARRANTY = (
    "5-year structural warranty and 1-year finishing warranty as standard; "
    "finishing warranty extendable to 2 years on request, confirmed at quotation."
)
DELIVERY = "Delivery in 7 to 21 working days"
QUOTE = "Fixed-price quote within 48 hours"
CERTIFICATIONS = (
    "ISO 9001:2015 (E20250218645); ISO 14001:2015 (E20250218646); "
    "ISO 45001:2018 (E20250218647); NSIC SPRS "
    "(NSIC/GP/BAN/2024/0055207); Udyam UDYAM-KR-03-0172770; "
    "ZED Bronze; DPIIT Startup India (DIPP56005); GST registered."
)
CONTACTS = (
    (
        "Bengaluru Unit 1 South",
        "+91 88616 22859",
        "+91 80886 85440",
        "sales@samanportable.com",
    ),
    (
        "Greater Noida Unit 2 North",
        "+91 87960 39938",
        "+91 97089 89937",
        "ncr@samanportable.com",
    ),
)
RETIRED_PHONE = "+91 62009 " + "09435"
GROUP_ORDER = (
    "Steel Structure",
    "Walls, Roof, Floor & Insulation",
    "Doors, Windows, Electrical & Services",
)


def indian(value: int) -> str:
    raw = str(abs(int(value)))
    if len(raw) <= 3:
        grouped = raw
    else:
        tail = raw[-3:]
        head = raw[:-3]
        groups: list[str] = []
        while head:
            groups.append(head[-2:])
            head = head[:-2]
        grouped = ",".join(reversed(groups)) + "," + tail
    return f"-{grouped}" if value < 0 else grouped


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def register_fonts() -> tuple[str, str]:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("C03Arial", str(regular)))
        pdfmetrics.registerFont(TTFont("C03ArialBold", str(bold)))
        return "C03Arial", "C03ArialBold"
    return "Helvetica", "Helvetica-Bold"


def load_sources() -> tuple[dict[str, Any], dict[str, dict[str, Any]]]:
    specs = json.loads(SPEC_DATASET.read_text(encoding="utf-8"))
    variants: dict[str, dict[str, Any]] = {}
    for slug, meta in PRODUCTS.items():
        assert slug in specs, f"Missing specification entry: {slug}"
        assert specs[slug]["product"] == meta["name"], slug
        assert list(specs[slug]["groups"]) == list(GROUP_ORDER), slug
        row_count = sum(len(group) for group in specs[slug]["groups"].values())
        assert row_count == 30, f"{slug}: expected 30 rows, found {row_count}"
        assert (
            specs[slug]["groups"]["Doors, Windows, Electrical & Services"]["Warranty"]
            == WARRANTY
        ), f"{slug}: non-canonical warranty"

        variant_path = ROOT / f"src/data/products/{slug}.json"
        variant = json.loads(variant_path.read_text(encoding="utf-8"))
        assert variant["productSlug"] == slug, slug
        assert variant["variants"], f"{slug}: no variants"
        for item in variant["variants"]:
            assert isinstance(item["priceExGst"], int), f"{slug}: ex-GST price missing"
            assert isinstance(item["priceInclGst"], int), f"{slug}: incl-GST price missing"
        variants[slug] = variant
    return specs, variants


def build_pdf(
    slug: str,
    meta: dict[str, str],
    spec: dict[str, Any],
    variant: dict[str, Any],
    output: Path,
) -> None:
    regular_font, bold_font = register_fonts()
    forest = colors.HexColor("#173F31")
    leaf = colors.HexColor("#3E8E54")
    pale = colors.HexColor("#EEF6F1")
    line = colors.HexColor("#D5E2DB")
    ink = colors.HexColor("#26332D")
    muted = colors.HexColor("#5F6F67")

    styles = getSampleStyleSheet()
    body = ParagraphStyle(
        "C03Body",
        parent=styles["BodyText"],
        fontName=regular_font,
        fontSize=8.2,
        leading=10.5,
        textColor=ink,
        alignment=TA_LEFT,
    )
    small = ParagraphStyle(
        "C03Small", parent=body, fontSize=7.2, leading=9, textColor=muted
    )
    h1 = ParagraphStyle(
        "C03H1",
        parent=styles["Heading1"],
        fontName=bold_font,
        fontSize=17,
        leading=20,
        textColor=forest,
        spaceAfter=3 * mm,
    )
    h2 = ParagraphStyle(
        "C03H2",
        parent=styles["Heading2"],
        fontName=bold_font,
        fontSize=12,
        leading=14,
        textColor=forest,
        spaceBefore=3 * mm,
        spaceAfter=2 * mm,
    )
    cell = ParagraphStyle("C03Cell", parent=body, fontSize=7, leading=8.5)
    cell_bold = ParagraphStyle(
        "C03CellBold", parent=cell, fontName=bold_font, textColor=forest
    )
    header_cell = ParagraphStyle(
        "C03HeaderCell",
        parent=cell,
        fontName=bold_font,
        textColor=colors.white,
    )

    def header_footer(canvas: Any, doc: Any) -> None:
        canvas.saveState()
        width, height = A4
        canvas.setFillColor(forest)
        canvas.rect(0, height - 25 * mm, width, 25 * mm, stroke=0, fill=1)
        canvas.setFillColor(colors.white)
        canvas.setFont(bold_font, 15)
        canvas.drawString(18 * mm, height - 12 * mm, "SAMAN PORTABLE")
        canvas.setFont(regular_font, 7.5)
        canvas.setFillColor(colors.HexColor("#D5E8DE"))
        canvas.drawString(
            18 * mm,
            height - 18 * mm,
            "Bengaluru and Greater Noida | Pan-India delivery",
        )
        canvas.setFont(bold_font, 8)
        canvas.setFillColor(colors.white)
        canvas.drawRightString(width - 18 * mm, height - 12 * mm, meta["name"].upper())
        canvas.setFont(regular_font, 7)
        canvas.drawRightString(
            width - 18 * mm, height - 18 * mm, "Technical Specification & Price Sheet"
        )
        canvas.setStrokeColor(leaf)
        canvas.setLineWidth(1.2 * mm)
        canvas.line(0, height - 25 * mm, width, height - 25 * mm)
        canvas.setStrokeColor(line)
        canvas.setLineWidth(0.3)
        canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
        canvas.setFillColor(muted)
        canvas.setFont(regular_font, 6.5)
        canvas.drawString(18 * mm, 9 * mm, "SAMAN POS India Private Limited")
        canvas.drawCentredString(width / 2, 9 * mm, "www.samanportable.com")
        canvas.drawRightString(width - 18 * mm, 9 * mm, f"Page {doc.page}")
        canvas.restoreState()

    doc = BaseDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=32 * mm,
        bottomMargin=19 * mm,
        title=f"{meta['name']} Technical Specification",
        author="SAMAN POS India Private Limited",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        id="c03-content",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates(
        [PageTemplate(id="c03-saman", frames=[frame], onPage=header_footer)]
    )

    story: list[Any] = [
        Paragraph(f"{escape(meta['name'])} - Technical Specifications & Price List", h1),
        Paragraph(f"<b>Canonical URL:</b> {escape(meta['canonical'])}", small),
        Spacer(1, 2 * mm),
        Paragraph("Sizes & Prices", h2),
    ]

    price_data = [
        [
            Paragraph("SIZE", header_cell),
            Paragraph("AREA (SQ FT)", header_cell),
            Paragraph("EX-GST", header_cell),
            Paragraph("INCL. 18% GST", header_cell),
        ]
    ]
    for item in variant["variants"]:
        price_data.append(
            [
                Paragraph(escape(item["label"]), cell_bold),
                Paragraph(str(item["areaSqft"]), cell),
                Paragraph(f"INR {indian(item['priceExGst'])}", cell),
                Paragraph(f"INR {indian(item['priceInclGst'])}", cell),
            ]
        )
    price_table = Table(
        price_data,
        colWidths=[42 * mm, 37 * mm, 46 * mm, 49 * mm],
        repeatRows=1,
        hAlign="LEFT",
    )
    price_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), forest),
                ("GRID", (0, 0), (-1, -1), 0.35, line),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.extend(
        [
            price_table,
            Paragraph(
                "Prices shown are the published page values. Ex-GST and incl. 18% GST "
                "amounts are listed separately.",
                small,
            ),
            Paragraph("Technical Specifications", h2),
        ]
    )

    for group_name in GROUP_ORDER:
        story.append(Paragraph(escape(group_name), h2))
        group_rows = [
            [
                Paragraph("COMPONENT", header_cell),
                Paragraph("DETAIL", header_cell),
            ]
        ]
        for component, detail in spec["groups"][group_name].items():
            group_rows.append(
                [
                    Paragraph(escape(str(component)), cell_bold),
                    Paragraph(escape(str(detail)), cell),
                ]
            )
        table = Table(
            group_rows,
            colWidths=[48 * mm, 126 * mm],
            repeatRows=1,
            hAlign="LEFT",
        )
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), forest),
                    ("GRID", (0, 0), (-1, -1), 0.35, line),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, pale]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        story.append(table)

    facts = [
        Paragraph("Commercial & Company Facts", h2),
        Paragraph(f"<b>Warranty:</b> {escape(WARRANTY)}", body),
        Paragraph(f"<b>Delivery:</b> {escape(DELIVERY)}", body),
        Paragraph(f"<b>Quotation:</b> {escape(QUOTE)}", body),
        Paragraph(f"<b>Certifications:</b> {escape(CERTIFICATIONS)}", body),
        Paragraph(
            "<b>Bengaluru Unit 1 South:</b> +91 88616 22859 | "
            "+91 80886 85440 | sales@samanportable.com",
            body,
        ),
        Paragraph(
            "<b>Greater Noida Unit 2 North:</b> +91 87960 39938 | "
            "+91 97089 89937 | ncr@samanportable.com",
            body,
        ),
        Paragraph(f"<b>Generated:</b> {date.today().strftime('%d %B %Y')}", body),
    ]
    story.append(KeepTogether(facts))
    doc.build(story)


def validate_pdf(
    slug: str,
    meta: dict[str, str],
    spec: dict[str, Any],
    variant: dict[str, Any],
    output: Path,
) -> tuple[int, int, str]:
    assert output.is_file(), f"Missing PDF: {output}"
    size = output.stat().st_size
    assert size < 400_000, f"{slug}: {size} bytes exceeds 400 KB"
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    reader = PdfReader(str(output))
    text = compact(" ".join(page.extract_text() or "" for page in reader.pages))

    required = [
        meta["name"],
        meta["canonical"],
        WARRANTY,
        DELIVERY,
        QUOTE,
        CERTIFICATIONS,
        *[value for contact in CONTACTS for value in contact],
        f"Generated: {date.today().strftime('%d %B %Y')}",
    ]
    for value in required:
        assert compact(value) in text, f"{slug}: missing {value}"
    assert RETIRED_PHONE not in text, f"{slug}: retired phone found"

    for group_name in GROUP_ORDER:
        for component, detail in spec["groups"][group_name].items():
            assert compact(component) in text, f"{slug}: missing {component}"
            assert compact(detail) in text, f"{slug}: missing detail for {component}"
    for item in variant["variants"]:
        assert f"INR {indian(item['priceExGst'])}" in text, slug
        assert f"INR {indian(item['priceInclGst'])}" in text, slug
    return len(reader.pages), size, digest


def main() -> None:
    specs, variants = load_sources()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    digests: set[str] = set()

    for slug, meta in PRODUCTS.items():
        output = OUTPUT_DIR / f"{slug}-technical-specification.pdf"
        build_pdf(slug, meta, specs[slug], variants[slug], output)
        page_count, size, digest = validate_pdf(
            slug, meta, specs[slug], variants[slug], output
        )
        assert digest not in digests, f"{slug}: PDF is byte-identical to another file"
        digests.add(digest)
        print(
            f"{slug}: {page_count} pages | {size} bytes | "
            f"30 specs | {len(variants[slug]['variants'])} prices"
        )

    print(f"Unique PDF SHA-256 digests: {len(digests)}/6")
    print("Canonical warranty: 6/6")
    print("Retired phone: 0")


if __name__ == "__main__":
    main()
