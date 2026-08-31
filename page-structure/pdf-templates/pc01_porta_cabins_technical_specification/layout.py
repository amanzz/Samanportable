from __future__ import annotations

import hashlib
import html
from pathlib import Path

from PIL import Image as PillowImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
import reportlab


PAGE_SIZE = landscape(A4)
INK = colors.HexColor('#26162A')
MUTED = colors.HexColor('#665B67')
PINK = colors.HexColor('#A72855')
GREEN = colors.HexColor('#14735C')
PALE = colors.HexColor('#F7F1F3')
RULE = colors.HexColor('#DCCFD4')
WHITE = colors.white


def _register_fonts() -> None:
    font_dir = Path(reportlab.__file__).resolve().parent / 'fonts'
    pdfmetrics.registerFont(TTFont('PC01-Regular', str(font_dir / 'Vera.ttf')))
    pdfmetrics.registerFont(TTFont('PC01-Bold', str(font_dir / 'VeraBd.ttf')))


class DeterministicCanvas(Canvas):
    def __init__(self, *args, **kwargs):
        kwargs['invariant'] = 1
        kwargs['pageCompression'] = 1
        super().__init__(*args, **kwargs)


def _money(value: int) -> str:
    digits = str(value)
    if len(digits) <= 3:
        return digits
    tail = digits[-3:]
    lead = digits[:-3]
    pairs = []
    while len(lead) > 2:
        pairs.insert(0, lead[-2:])
        lead = lead[:-2]
    if lead:
        pairs.insert(0, lead)
    return ','.join(pairs + [tail])


def _styles():
    _register_fonts()
    styles = getSampleStyleSheet()
    return {
        'cover_kicker': ParagraphStyle('cover_kicker', fontName='PC01-Bold', fontSize=10,
            leading=13, textColor=PINK, spaceAfter=8),
        'cover_title': ParagraphStyle('cover_title', fontName='PC01-Bold', fontSize=29,
            leading=34, textColor=INK, spaceAfter=11),
        'cover_subtitle': ParagraphStyle('cover_subtitle', fontName='PC01-Regular', fontSize=13,
            leading=18, textColor=MUTED, spaceAfter=22),
        'h1': ParagraphStyle('h1', fontName='PC01-Bold', fontSize=19, leading=23,
            textColor=INK, spaceAfter=5),
        'h2': ParagraphStyle('h2', fontName='PC01-Bold', fontSize=11, leading=14,
            textColor=PINK, spaceBefore=5, spaceAfter=5),
        'body': ParagraphStyle('body', fontName='PC01-Regular', fontSize=8.2, leading=11.2,
            textColor=INK, spaceAfter=5),
        'small': ParagraphStyle('small', fontName='PC01-Regular', fontSize=6.5, leading=8.4,
            textColor=MUTED),
        'cell': ParagraphStyle('cell', fontName='PC01-Regular', fontSize=7.7, leading=10.2,
            textColor=INK),
        'cell_bold': ParagraphStyle('cell_bold', fontName='PC01-Bold', fontSize=7.3, leading=9.6,
            textColor=INK),
        'table_head': ParagraphStyle('table_head', fontName='PC01-Bold', fontSize=6.8,
            leading=8.2, textColor=WHITE, alignment=TA_LEFT),
        'ga_title': ParagraphStyle('ga_title', fontName='PC01-Bold', fontSize=17, leading=21,
            textColor=INK, alignment=TA_CENTER, spaceAfter=5),
        'ga_meta': ParagraphStyle('ga_meta', fontName='PC01-Regular', fontSize=6.2, leading=8,
            textColor=MUTED, alignment=TA_CENTER),
    }


def _header_footer(canvas, doc, manifest):
    width, height = PAGE_SIZE
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.6)
    canvas.line(15 * mm, height - 13 * mm, width - 15 * mm, height - 13 * mm)
    canvas.setFont('PC01-Bold', 7)
    canvas.setFillColor(INK)
    canvas.drawString(15 * mm, height - 10 * mm, 'SAMAN  |  PORTA CABINS')
    canvas.setFont('PC01-Regular', 6.2)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 15 * mm, height - 10 * mm, manifest['revision'])
    canvas.line(15 * mm, 12 * mm, width - 15 * mm, 12 * mm)
    canvas.drawString(15 * mm, 8 * mm, manifest['canonicalUrl'])
    canvas.drawCentredString(width / 2, 8 * mm, manifest['status'])
    canvas.drawRightString(width - 15 * mm, 8 * mm, f'Page {doc.page}')
    canvas.restoreState()


def _paragraph(text, style):
    return Paragraph(html.escape(str(text)), style)


def _fit_image(asset: Path, max_width: float, max_height: float) -> Image:
    with PillowImage.open(asset) as img:
        width, height = img.size
    scale = min(max_width / width, max_height / height)
    return Image(str(asset), width=width * scale, height=height * scale)


def _section_title(number: str, title: str, styles):
    return [
        Paragraph(f'{number}  {title}', styles['h1']),
        Spacer(1, 2 * mm),
    ]


def build_pdf(source: dict, root: Path, output: Path) -> None:
    styles = _styles()
    manifest = source['manifest']
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output),
        pagesize=PAGE_SIZE,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=18 * mm,
        bottomMargin=17 * mm,
        title=manifest['title'],
        author=manifest['fixedPdfMetadata']['author'],
        subject=manifest['fixedPdfMetadata']['subject'],
        creator=manifest['fixedPdfMetadata']['creator'],
    )
    story = []

    story.extend([
        Spacer(1, 17 * mm),
        _paragraph(f"{manifest['company']}  /  TECHNICAL REFERENCE", styles['cover_kicker']),
        Paragraph('Porta Cabins', styles['cover_title']),
        Paragraph(manifest['title'], styles['cover_subtitle']),
    ])
    cover_data = [
        [Paragraph('REVISION', styles['table_head']), Paragraph('STATUS', styles['table_head']), Paragraph('PRODUCT PAGE', styles['table_head'])],
        [_paragraph(manifest['revision'], styles['cell_bold']), _paragraph(manifest['status'], styles['cell']), _paragraph(manifest['canonicalUrl'], styles['cell'])],
    ]
    cover_table = Table(cover_data, colWidths=[67 * mm, 68 * mm, 115 * mm], rowHeights=[9 * mm, 18 * mm])
    cover_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), INK),
        ('BACKGROUND', (0, 1), (-1, 1), PALE),
        ('BOX', (0, 0), (-1, -1), 0.7, RULE),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, RULE),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.extend([
        cover_table,
        Spacer(1, 18 * mm),
        Paragraph('CONTROLLED SCOPE', styles['h2']),
        _paragraph(manifest['scopeStatement'], styles['body']),
        Paragraph('This pack presents the current published selection data, the effective 30-row technical specification and the six approved GA reference boards.', styles['body']),
        Spacer(1, 7 * mm),
        Paragraph('HSN 9406  |  GST 18%  |  All monetary values use Rs', styles['cover_kicker']),
        PageBreak(),
    ])

    story.extend(_section_title('01', 'Six-variant price and selection reference', styles))
    headers = ['SIZE', 'DIMENSIONS', 'AREA', 'RECOMMENDED OCCUPANCY', 'APPROX. COMPLETED WEIGHT', 'EX-GST', 'INCL. 18% GST']
    price_rows = [[Paragraph(item, styles['table_head']) for item in headers]]
    for variant in source['variants']:
        weight = f"{variant['approximateWeightTonnes']:.1f} tonnes"
        values = [
            variant['label'], variant['dimensions'], f"{variant['areaSqft']} sq ft",
            variant['occupancy'], weight,
            f"Rs {_money(variant['priceExGst'])}", f"Rs {_money(variant['priceInclGst'])}",
        ]
        price_rows.append([_paragraph(value, styles['cell_bold'] if idx == 0 else styles['cell']) for idx, value in enumerate(values)])
    price_table = Table(price_rows, colWidths=[24*mm, 32*mm, 23*mm, 43*mm, 46*mm, 35*mm, 39*mm], repeatRows=1)
    price_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), INK),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, PALE]),
        ('GRID', (0, 0), (-1, -1), 0.4, RULE),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.extend([
        price_table,
        Spacer(1, 6 * mm),
        _paragraph(manifest['weightQualification'], styles['body']),
        Spacer(1, 3 * mm),
        Paragraph('COMMERCIAL BOUNDARY', styles['h2']),
    ])
    for item in manifest['commercialBoundary']:
        story.append(_paragraph(f'• {item}', styles['body']))
    story.append(PageBreak())

    specs = source['specifications']
    for page_index, chunk in enumerate((specs[:15], specs[15:]), start=1):
        story.extend(_section_title(f'02.{page_index}', f'Effective technical specification ({page_index} of 2)', styles))
        rows = [[Paragraph('CONTROL', styles['table_head']), Paragraph('COMPONENT', styles['table_head']), Paragraph('CURRENT EFFECTIVE REQUIREMENT', styles['table_head'])]]
        offset = (page_index - 1) * 15
        for index, row in enumerate(chunk, start=offset + 1):
            rows.append([
                Paragraph(f'SPEC-{index:02d}', styles['cell_bold']),
                _paragraph(row['component'], styles['cell_bold']),
                _paragraph(row['detail'], styles['cell']),
            ])
        table = Table(rows, colWidths=[20 * mm, 49 * mm, 173 * mm], repeatRows=1)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), INK),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, PALE]),
            ('GRID', (0, 0), (-1, -1), 0.35, RULE),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 4.2),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4.2),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(table)
        story.append(PageBreak())

    story.extend(_section_title('03', 'How to use this technical pack', styles))
    use_rows = [
        ('1', 'SELECT A SIZE', 'Compare the six current published variants on area, occupancy, approximate completed unit weight and reference price.'),
        ('2', 'REVIEW THE EFFECTIVE SPECIFICATION', 'Use all 30 rows as the current technical reference. Final member selections, openings, services and fit-out follow the approved project documents.'),
        ('3', 'CHECK THE APPROVED GA BOARD', 'Use the board for the selected size as a planning reference. The final approved drawing governs fabrication and supplied layout.'),
        ('4', 'REQUEST AN ITEMISED QUOTATION', 'Confirm delivery location, access, unloading, foundations, utilities, installation and customisation before order acceptance.'),
    ]
    for number, heading, body in use_rows:
        block = Table([[Paragraph(number, styles['cover_title']), Paragraph(heading, styles['h2'])], ['', Paragraph(body, styles['body'])]], colWidths=[18*mm, 216*mm])
        block.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PALE),
            ('SPAN', (0, 0), (0, 1)),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOX', (0, 0), (-1, -1), 0.5, RULE),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.extend([block, Spacer(1, 4 * mm)])
    story.extend([
        Spacer(1, 4 * mm),
        _paragraph(manifest['scopeStatement'], styles['h1']),
        _paragraph(f"Contact: {manifest['contactUrl']}", styles['body']),
        PageBreak(),
    ])

    for number, variant in enumerate(source['variants'], start=1):
        asset = root / 'public' / variant['gaPath'].lstrip('/')
        digest = hashlib.sha256(asset.read_bytes()).hexdigest()
        story.extend([
            _paragraph(f"04.{number}  Approved GA reference - {variant['label']}", styles['ga_title']),
            Paragraph('Fit-within-page reproduction of the existing approved repository asset. Final approved drawing governs the supplied layout.', styles['ga_meta']),
            Spacer(1, 3 * mm),
            _fit_image(asset, 248 * mm, 144 * mm),
            Spacer(1, 2 * mm),
            _paragraph(f"GA-ASSET-{variant['sizeSlug']}  |  {variant['gaPath']}  |  SHA256 {digest}", styles['ga_meta']),
        ])
        if number != len(source['variants']):
            story.append(PageBreak())

    def decorate(canvas, current_doc):
        _header_footer(canvas, current_doc, manifest)

    doc.build(story, onFirstPage=decorate, onLaterPages=decorate, canvasmaker=DeterministicCanvas)
