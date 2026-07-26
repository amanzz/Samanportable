#!/usr/bin/env python3
"""Validate and render the nine generated C-01 technical-specification PDFs."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

import fitz
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SPEC_DATA = json.loads(
    (ROOT / "src/data/products/c01-specifications.json").read_text(encoding="utf-8")
)
SLUGS = list(SPEC_DATA["products"])
WARRANTY = (
    "5-year structural warranty and 1-year finishing warranty as standard; "
    "finishing warranty extendable to 2 years on request, confirmed at quotation."
)
CONTACTS = [
    "+91 88616 22859",
    "+91 80886 85440",
    "+91 87960 39938",
    "+91 97089 89937",
    "sales@samanportable.com",
    "ncr@samanportable.com",
]


def indian(value: int) -> str:
    raw = str(value)
    if len(raw) <= 3:
        return raw
    tail = raw[-3:]
    head = raw[:-3]
    groups: list[str] = []
    while head:
        groups.append(head[-2:])
        head = head[:-2]
    return ",".join(reversed(groups)) + "," + tail


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def main() -> None:
    render_dir = ROOT / "tmp/pdfs/c01-final"
    render_dir.mkdir(parents=True, exist_ok=True)
    digests: set[str] = set()
    outputs: list[str] = []

    for slug in SLUGS:
        pdf_path = ROOT / f"public/specs/{slug}-technical-specification.pdf"
        assert pdf_path.is_file(), f"Missing PDF: {pdf_path}"
        size = pdf_path.stat().st_size
        assert size <= 400_000, f"{slug}: {size} bytes exceeds 400 KB"
        digest = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
        assert digest not in digests, f"{slug}: PDF is not page-specific"
        digests.add(digest)

        reader = PdfReader(str(pdf_path))
        text = compact(" ".join(page.extract_text() or "" for page in reader.pages))
        entry = SPEC_DATA["products"][slug]
        variant = json.loads(
            (ROOT / f"src/data/products/{slug}.json").read_text(encoding="utf-8")
        )

        assert entry["name"] in text
        assert entry["canonical"] in text
        assert WARRANTY in text
        assert "Delivery in 7–21 working days" in text
        assert "fixed-price quotation in 48 hours" in text
        assert "ISO 9001:2015" in text
        assert "Generated: 26 July 2026" in text
        for contact in CONTACTS:
            assert contact in text, f"{slug}: missing {contact}"
        for row in entry["specifications"]:
            assert compact(row["component"]) in text
            assert compact(row["detail"]) in text
        for price in variant["variants"]:
            assert f"₹{indian(price['priceExGst'])}" in text
            assert f"₹{indian(price['priceInclGst'])}" in text

        doc = fitz.open(pdf_path)
        for page_index, suffix in ((0, "first"), (len(doc) - 1, "last")):
            pix = doc[page_index].get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
            pix.save(render_dir / f"{slug}-{suffix}.png")
        outputs.append(
            f"{slug}: {len(reader.pages)} pages, {size} bytes, "
            f"{len(entry['specifications'])} specs, {len(variant['variants'])} prices"
        )

    print("\n".join(outputs))
    print(f"Unique PDF SHA-256 digests: {len(digests)}/9")
    print(f"Warranty byte-identical: 9/9")
    print(f"Rendered first/last pages: {len(SLUGS) * 2}")


if __name__ == "__main__":
    main()
