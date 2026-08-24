#!/usr/bin/env python3
"""Build the locked CO-04 WebP asset set from the approved PNG masters."""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

from PIL import Image


SOURCE_ROOT = Path(r"D:\Project-shekhar\all-product-images\Hub page (Container Offices)\Containerized Data Center")
PROMPT = Path(r"D:\Project-shekhar\all-product-images\Hub page (Container Offices)\Drafts\CO-04-containerized-data-center-build-prompt-v1.md")
REPO = Path(__file__).resolve().parents[1]
TARGET = REPO / "public" / "images" / "products" / "containerized-data-center"
MASTER_TARGET = TARGET / "masters"
PDF_TARGET = REPO / "public" / "specs" / "saman-containerized-data-center-technical-specification-and-ga-v1.pdf"


def mapped_rows() -> list[tuple[Path, str, str]]:
    text = PROMPT.read_text(encoding="utf-8")
    rows: list[tuple[Path, str, str]] = []
    pattern = re.compile(
        r"^\|.*?`([^`]+\.png)`(?:\s*\|\s*`[^`]+`)*\s*\|\s*`([^`]+\.webp)`\s*\|\s*`([A-Z0-9_]+_ALT)`",
        re.MULTILINE,
    )
    for source, output, alt_key in pattern.findall(text):
        rows.append((SOURCE_ROOT / source.replace("\\", "/"), output, alt_key))
    if len(rows) != 50:
        raise SystemExit(f"expected 50 image rows in build prompt, found {len(rows)}")
    if len({output for _, output, _ in rows}) != 50:
        raise SystemExit("duplicate output filename in build prompt")
    return rows


def save_webp(source: Path, output: Path, width: int, quality: int) -> tuple[int, int, int]:
    with Image.open(source) as image:
        image.load()
        height = round(image.height * width / image.width)
        resized = image if image.width == width else image.resize((width, height), Image.Resampling.LANCZOS)
        output.parent.mkdir(parents=True, exist_ok=True)
        resized.save(output, "WEBP", quality=quality, method=6)
    return width, height, output.stat().st_size


def main() -> int:
    rows = mapped_rows()
    missing = [str(source) for source, _, _ in rows if not source.is_file()]
    pdf_source = SOURCE_ROOT / "containerized-data-center-technical-specification.pdf"
    if not pdf_source.is_file():
        missing.append(str(pdf_source))
    if missing:
        print("Missing approved source assets:")
        print("\n".join(f"  - {item}" for item in missing))
        return 2

    TARGET.mkdir(parents=True, exist_ok=True)
    MASTER_TARGET.mkdir(parents=True, exist_ok=True)
    report: list[str] = []
    hero_errors: list[str] = []

    for source, output_name, _alt_key in rows:
        stem = Path(output_name).stem
        master_name = f"{stem}.png"
        shutil.copy2(source, MASTER_TARGET / master_name)

        if "-ga-board" in output_name:
            width, height, size = save_webp(source, TARGET / output_name, 2400, 90)
            report.append(f"GA {output_name}: {width}x{height}, {size / 1024:.1f} KB")
        elif any(token in output_name for token in ("-section2-card-", "-description-", "-diagram-")):
            width, height, size = save_webp(source, TARGET / output_name, 1600, 82)
            report.append(f"BAND {output_name}: {width}x{height}, {size / 1024:.1f} KB")
        else:
            for width in (1254, 800, 640):
                derivative = output_name if width == 1254 else f"{stem}-{width}.webp"
                actual_w, height, size = save_webp(source, TARGET / derivative, width, 82)
                report.append(f"HERO {derivative}: {actual_w}x{height}, {size / 1024:.1f} KB")
                if width == 1254 and size > 150 * 1024:
                    hero_errors.append(f"{output_name}: {size / 1024:.1f} KB")

    PDF_TARGET.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(pdf_source, PDF_TARGET)
    print("\n".join(report))
    print(f"PNG masters archived: {len(list(MASTER_TARGET.glob('*.png')))}")
    print(f"PDF copied byte-for-byte: {PDF_TARGET} ({PDF_TARGET.stat().st_size} bytes)")
    if hero_errors:
        print("Hero derivatives exceed the 150 KB hard stop:")
        print("\n".join(f"  - {item}" for item in hero_errors))
        return 3
    return 0


if __name__ == "__main__":
    sys.exit(main())
