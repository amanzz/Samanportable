#!/usr/bin/env python3
"""Generate the two maintained PO-FAM-01B technical PDFs from curated sources."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
import reportlab

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public/specs"
SPECS = ROOT / "src/data/products/specs-tab-dataset.json"
LOGO = ROOT / "public/credentials/optimized/saman-logo-band-cropped.png"
ISSUE = "PO-FAM-01B / 01 Sep 2026"
PAGE_SIZE = landscape(A4)
PRODUCTS = {
    "portable-office": {
        "name": "Portable Office Cabin",
        "url": "https://www.samanportable.com/product/portable-office",
        "stock": "The six published standard sizes are regularly stocked. Custom sizes are made to order and priced in the written quotation.",
    },
    "readymade-office-cabin": {
        "name": "Readymade Office Cabin",
        "url": "https://www.samanportable.com/product/portable-office/readymade-office-cabin",
        "stock": "Availability is confirmed with the written quotation.",
    },
}
GROUPS = ("Steel Structure", "Walls, Roof, Floor & Insulation", "Doors, Windows, Electrical & Services")
INK = colors.HexColor("#26162A")
PINK = colors.HexColor("#A72855")
GREEN = colors.HexColor("#14735C")
MUTED = colors.HexColor("#665B67")
PALE = colors.HexColor("#F7F1F3")
RULE = colors.HexColor("#DCCFD4")


def money(value: int) -> str:
    digits = str(value)
    if len(digits) <= 3:
        return digits
    tail, lead = digits[-3:], digits[:-3]
    pairs: list[str] = []
    while len(lead) > 2:
        pairs.insert(0, lead[-2:])
        lead = lead[:-2]
    if lead:
        pairs.insert(0, lead)
    return ",".join([*pairs, tail])


class NumberedCanvas(Canvas):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        kwargs["invariant"] = 1
        kwargs["pageCompression"] = 1
        super().__init__(*args, **kwargs)
        self._saved_page_states: list[dict[str, Any]] = []

    def showPage(self) -> None:
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self) -> None:
        total = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.setFont("PO-Regular", 6.5)
            self.setFillColor(MUTED)
            self.drawRightString(PAGE_SIZE[0] - 15 * mm, 7.5 * mm, f"Page {self._pageNumber} of {total}")
            Canvas.showPage(self)
        Canvas.save(self)


def styles() -> dict[str, ParagraphStyle]:
    font_dir = Path(reportlab.__file__).resolve().parent / "fonts"
    pdfmetrics.registerFont(TTFont("PO-Regular", str(font_dir / "Vera.ttf")))
    pdfmetrics.registerFont(TTFont("PO-Bold", str(font_dir / "VeraBd.ttf")))
    sample = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("title", parent=sample["Heading1"], fontName="PO-Bold", fontSize=24, leading=29, textColor=INK, spaceAfter=5 * mm),
        "h1": ParagraphStyle("h1", parent=sample["Heading1"], fontName="PO-Bold", fontSize=17, leading=21, textColor=INK, spaceAfter=3 * mm),
        "h2": ParagraphStyle("h2", parent=sample["Heading2"], fontName="PO-Bold", fontSize=10, leading=13, textColor=PINK, spaceBefore=2 * mm, spaceAfter=2 * mm),
        "body": ParagraphStyle("body", parent=sample["BodyText"], fontName="PO-Regular", fontSize=8, leading=11, textColor=INK, spaceAfter=2 * mm),
        "small": ParagraphStyle("small", parent=sample["BodyText"], fontName="PO-Regular", fontSize=6.5, leading=8.2, textColor=MUTED),
        "cell": ParagraphStyle("cell", parent=sample["BodyText"], fontName="PO-Regular", fontSize=7, leading=9, textColor=INK),
        "cell_bold": ParagraphStyle("cell_bold", parent=sample["BodyText"], fontName="PO-Bold", fontSize=7, leading=9, textColor=INK),
        "head": ParagraphStyle("head", parent=sample["BodyText"], fontName="PO-Bold", fontSize=6.7, leading=8, textColor=colors.white, alignment=TA_LEFT),
    }


def para(value: Any, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(str(value)), style)


def header_footer(canvas: Canvas, doc: Any, meta: dict[str, str]) -> None:
    width, height = PAGE_SIZE
    canvas.saveState()
    canvas.drawImage(str(LOGO), 15 * mm, height - 12.2 * mm, width=43 * mm, height=7 * mm, preserveAspectRatio=True, mask="auto")
    canvas.setFillColor(INK)
    canvas.setFont("PO-Bold", 8)
    canvas.drawString(63 * mm, height - 9 * mm, "SAMAN POS India Private Limited")
    canvas.setFont("PO-Regular", 6.3)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 15 * mm, height - 6.5 * mm, meta["name"])
    canvas.drawRightString(width - 15 * mm, height - 10 * mm, "Technical Specification")
    canvas.setStrokeColor(RULE)
    canvas.line(15 * mm, height - 14 * mm, width - 15 * mm, height - 14 * mm)
    canvas.line(15 * mm, 11 * mm, width - 15 * mm, 11 * mm)
    canvas.setFont("PO-Regular", 6.3)
    canvas.drawString(15 * mm, 7.5 * mm, "SAMAN POS India Private Limited")
    canvas.drawCentredString(width / 2, 7.5 * mm, "www.samanportable.com  |  South India: +91 88616 22859  |  North India: +91 87960 39938")
    canvas.drawRightString(width - 15 * mm, 12.5 * mm, ISSUE)
    canvas.restoreState()


def styled_table(rows: list[list[Paragraph]], widths: list[float]) -> Table:
    table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
        ("GRID", (0, 0), (-1, -1), 0.35, RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return table


def build(slug: str, meta: dict[str, str], spec: dict[str, Any], product: dict[str, Any]) -> Path:
    s = styles()
    output = OUTPUT_DIR / f"{slug}-technical-specification.pdf"
    doc = SimpleDocTemplate(str(output), pagesize=PAGE_SIZE, leftMargin=15 * mm, rightMargin=15 * mm, topMargin=18 * mm, bottomMargin=16 * mm, title=f"{meta['name']} Technical Specification", author="SAMAN POS India Private Limited", subject="Published technical specification and price reference", creator="Maintained PO-FAM-01B PDF pipeline")
    story: list[Any] = [
        Spacer(1, 8 * mm),
        para("TECHNICAL REFERENCE", s["h2"]),
        para(meta["name"], s["title"]),
        para("Technical Specification", s["h1"]),
        para(meta["url"], s["small"]),
        Spacer(1, 4 * mm),
        para("Six published sizes and prices", s["h2"]),
    ]
    rows = [[para(x, s["head"]) for x in ("SIZE", "DIMENSIONS", "AREA", "RECOMMENDED OCCUPANCY", "EX-GST", "INCL. 18% GST")]]
    for item in product["variants"]:
        rows.append([
            para(item["label"], s["cell_bold"]), para(item["dims"], s["cell"]), para(f"{item['areaSqft']} sq ft", s["cell"]),
            para(item["capacity"], s["cell"]), para(f"INR {money(item['priceExGst'])}", s["cell"]), para(f"INR {money(item['priceInclGst'])}", s["cell"]),
        ])
    story.extend([
        styled_table(rows, [25 * mm, 35 * mm, 25 * mm, 55 * mm, 43 * mm, 48 * mm]),
        Spacer(1, 3 * mm),
        para("GST 18%  |  HSN 9406  |  Published prices use the approved current ladder.", s["body"]),
        para(meta["stock"], s["body"]),
        para("Written quotation within 48 hours. Delivery in 7–21 working days. Free delivery within Bangalore city and Delhi NCR; freight outside those zones is quoted separately.", s["body"]),
        para("Five-year structural warranty and one-year finishing warranty, subject to the written warranty and quotation terms.", s["body"]),
        PageBreak(),
    ])
    for index, group in enumerate(GROUPS, start=1):
        spec_rows = [[para("COMPONENT", s["head"]), para("APPROVED CURRENT REQUIREMENT", s["head"])]]
        for component, detail in spec["groups"][group].items():
            spec_rows.append([para(component, s["cell_bold"]), para(detail, s["cell"])])
        story.extend([
            para(f"0{index + 1}  {group}", s["h1"]),
            para(spec["commonPlatformSummary"], s["body"]),
            styled_table(spec_rows, [55 * mm, 185 * mm]),
            PageBreak(),
        ])
    story.extend([
        para("05  Approved inclusions and company evidence", s["h1"]),
        para(spec["fullTechnicalDescription"], s["body"]),
        para("Approved current inclusions", s["h2"]),
        para("The three specification tables in this document are the maintained inclusion source for the structural frame, wall/roof/floor build, insulation, openings, electrical services, finishes, quality checks and warranty.", s["body"]),
        para("Verified company credentials", s["h2"]),
        para("SAMAN POS India Private Limited", s["body"]),
        para("ISO 9001:2015 quality management certificate, subject to the certificate conditions; GST registrations for Karnataka and Uttar Pradesh; Udyam registration; DPIIT Startup India recognition; and NSIC Government Purchase enlistment.", s["body"]),
        para("Zonal contacts", s["h2"]),
        para("South India: +91 88616 22859", s["body"]),
        para("North India: +91 87960 39938", s["body"]),
        para("www.samanportable.com", s["body"]),
        para(f"Document version: {ISSUE}", s["small"]),
    ])
    doc.build(story, onFirstPage=lambda c, d: header_footer(c, d, meta), onLaterPages=lambda c, d: header_footer(c, d, meta), canvasmaker=NumberedCanvas)
    return output


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    specs = json.loads(SPECS.read_text(encoding="utf-8"))
    for slug, meta in PRODUCTS.items():
        product = json.loads((ROOT / f"src/data/products/{slug}.json").read_text(encoding="utf-8"))
        assert len(product["variants"]) == 6
        output = build(slug, meta, specs[slug], product)
        print(output)


if __name__ == "__main__":
    main()
