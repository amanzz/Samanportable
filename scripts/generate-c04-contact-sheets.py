#!/usr/bin/env python3
"""Build the four report-only C04 source-image contact sheets."""

from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


SOURCE = Path(r"D:\Project-shekhar\all-product-images\C-04")
OUTPUT = Path(__file__).resolve().parents[1] / "page-structure/contact-sheets/C04"
PRODUCTS = (
    "container-offices",
    "container-office-cabin",
    "shipping-container-office",
    "site-office-container",
)
SIZES = ("10x10", "20x8", "20x10", "20x12", "30x10", "40x8", "20x20", "40x10", "40x12")
CELL = 260
LABEL_H = 48
GAP = 12
COLS = 5
PAGE_W = 40 + COLS * CELL + (COLS - 1) * GAP


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    path = Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf")
    return ImageFont.truetype(str(path), size) if path.exists() else ImageFont.load_default()


TITLE_FONT, SECTION_FONT, BADGE_FONT, FILE_FONT = font(30, True), font(23, True), font(30, True), font(14)


def order_key(path: Path) -> tuple[int, int | str]:
    match = re.search(r"\((\d+)\)", path.stem)
    return (0, int(match.group(1))) if match else (1, path.name.lower())


def own_number(path: Path) -> str:
    ordinal = re.search(r"\((\d+)\)", path.stem)
    if ordinal:
        return ordinal.group(1)
    size = re.search(r"\d+x\d+", path.stem)
    if size:
        return size.group(0)
    raise RuntimeError(f"No number exists in source filename: {path}")


def wrap_name(draw: ImageDraw.ImageDraw, name: str, width: int) -> list[str]:
    words = re.split(r"(?<=-)|(?=\()", name)
    lines: list[str] = []
    line = ""
    for word in words:
        trial = line + word
        if line and draw.textbbox((0, 0), trial, font=FILE_FONT)[2] > width:
            lines.append(line.rstrip("-"))
            line = word.lstrip("-")
        else:
            line = trial
    if line:
        lines.append(line)
    return lines[:2]


def build(product: str) -> Path:
    sections: list[tuple[str, list[Path]]] = []
    for size in SIZES:
        folder = SOURCE / product / f"size-{size}"
        files = sorted((p for p in folder.rglob("*") if p.is_file()), key=order_key)
        sections.append((size, files))
    rows = sum((len(files) + COLS - 1) // COLS for _, files in sections)
    page_h = 90 + len(sections) * 52 + rows * (CELL + LABEL_H + GAP) + 30
    sheet = Image.new("RGB", (PAGE_W, page_h), "#f7faf8")
    draw = ImageDraw.Draw(sheet)
    draw.text((20, 20), f"C-04 | {product} | source contact sheet", fill="#173f31", font=TITLE_FONT)
    y = 78
    for size, files in sections:
        draw.rectangle((20, y, PAGE_W - 20, y + 38), fill="#173f31")
        draw.text((32, y + 6), f"size-{size} | {len(files)} files", fill="white", font=SECTION_FONT)
        y += 50
        for index, path in enumerate(files):
            col, row = index % COLS, index // COLS
            x = 20 + col * (CELL + GAP)
            top = y + row * (CELL + LABEL_H + GAP)
            with Image.open(path) as source:
                image = ImageOps.fit(source.convert("RGB"), (CELL, CELL), method=Image.Resampling.LANCZOS)
            sheet.paste(image, (x, top))
            badge = own_number(path)
            box = draw.textbbox((0, 0), badge, font=BADGE_FONT)
            badge_w, badge_h = box[2] - box[0] + 22, box[3] - box[1] + 16
            draw.rounded_rectangle((x + 8, top + 8, x + 8 + badge_w, top + 8 + badge_h), radius=7, fill="#173f31")
            draw.text((x + 19, top + 13), badge, fill="white", font=BADGE_FONT)
            draw.rectangle((x, top + CELL, x + CELL, top + CELL + LABEL_H), fill="white", outline="#d5e2db")
            for line_no, line in enumerate(wrap_name(draw, path.name, CELL - 12)):
                draw.text((x + 6, top + CELL + 5 + line_no * 18), line, fill="#26332d", font=FILE_FONT)
        y += ((len(files) + COLS - 1) // COLS) * (CELL + LABEL_H + GAP)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    target = OUTPUT / f"{product}-contact-sheet.jpg"
    sheet.save(target, "JPEG", quality=88, optimize=True, progressive=True)
    return target


def main() -> None:
    for product in PRODUCTS:
        output = build(product)
        print(f"{output.relative_to(OUTPUT.parents[2])}\t{output.stat().st_size} bytes")


if __name__ == "__main__":
    main()
