#!/usr/bin/env python3
"""Validate PO-FAM-01B PDF source parity and active PDF content."""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SLUGS = ("portable-office", "readymade-office-cabin")
SIZES = ("10x10", "20x8", "20x10", "20x12", "30x10", "40x10")
FORBIDDEN = ("40x8", "20x20", "40x12", "INR 635,000", "INR 425,000", "INR 445,000", "8.6 ft", "AggregateRating", "SKU")


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def validate(slug: str) -> dict[str, Any]:
    source = json.loads((ROOT / f"src/data/products/{slug}.json").read_text(encoding="utf-8"))
    path = ROOT / f"public/specs/{slug}-technical-specification.pdf"
    assert [item["sizeSlug"] for item in source["variants"]] == list(SIZES)
    assert path.read_bytes().startswith(b"%PDF-")
    reader = PdfReader(str(path), strict=True)
    assert not reader.is_encrypted
    assert len(reader.pages) == 5, (slug, len(reader.pages))
    pages = [normalize(page.extract_text() or "") for page in reader.pages]
    assert all(pages), f"{slug}: blank page"
    text = normalize(" ".join(pages))
    for value in FORBIDDEN:
        assert value not in text, f"{slug}: forbidden {value}"
    for item in source["variants"]:
        assert item["capacity"] in text
        assert f"INR {money(item['priceExGst'])}" in text
        assert f"INR {money(item['priceInclGst'])}" in text
        assert item["priceInclGst"] == round(item["priceExGst"] * 1.18)
    for value in ("GST 18%", "HSN 9406", "within 48 hours", "7–21 working days", "Bangalore city", "Delhi NCR", "Five-year structural warranty", "one-year finishing warranty", "ISO 9001:2015", "Udyam registration", "DPIIT Startup India recognition", "NSIC Government Purchase enlistment", "+91 88616 22859", "+91 87960 39938", "Page 1 of 5", "Page 5 of 5"):
        assert value in text, f"{slug}: missing {value}"
    if slug == "portable-office":
        assert "six published standard sizes are regularly stocked" in text
    else:
        assert "Availability is confirmed with the written quotation" in text
        for value in ("InStock", "ready stock", "held stock", "dispatch from stock"):
            assert value not in text, f"{slug}: unsupported stock claim {value}"
    image_counts = []
    for page in reader.pages:
        resources = page.get("/Resources") or {}
        xobjects = resources.get("/XObject") or {}
        image_counts.append(sum(1 for obj in xobjects.values() if obj.get_object().get("/Subtype") == "/Image"))
    assert image_counts == [1, 1, 1, 1, 1], (slug, image_counts)
    return {"path": str(path), "pages": len(reader.pages), "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}


def money(value: int) -> str:
    raw = str(value)
    if len(raw) <= 3:
        return raw
    tail, head = raw[-3:], raw[:-3]
    groups: list[str] = []
    while head:
        groups.insert(0, head[-2:])
        head = head[:-2]
    return ",".join([*groups, tail])


if __name__ == "__main__":
    print(json.dumps({"status": "PASS", "files": [validate(slug) for slug in SLUGS]}, indent=2))
