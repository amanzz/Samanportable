#!/usr/bin/env python3
"""Extract the four approved C-04 specification datasets from workbook sheets 42-45."""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_WORKBOOK = Path(
    r"D:\Project-shekhar\all-technical-specifications\00-FINAL-FILES"
    r"\SAMAN_MASTER_64_Products_Detailed_Technical_Specs_9_Sizes_Report-with-price- PR.xlsx"
)
OUTPUT = ROOT / "src/data/products/c04-specifications.json"
SHEET_NAMES = {
    "container-offices": "42 Container Offices",
    "container-office-cabin": "43 Container Office Cabin",
    "shipping-container-office": "44 Shipping Container Office",
    "site-office-container": "45 Site Office Container",
}
GROUP_ROWS = {
    "Steel Structure": range(14, 22),
    "Walls, Roof, Floor & Insulation": range(25, 35),
    "Doors, Windows, Electrical & Services": range(38, 50),
}
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return ["".join(node.text or "" for node in item.findall(".//m:t", NS)) for item in root.findall("m:si", NS)]


def cell_value(cell: ET.Element | None, strings: list[str]) -> str:
    if cell is None:
        return ""
    if cell.get("t") == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(".//m:t", NS))
    value = cell.find("m:v", NS)
    if value is None or value.text is None:
        return ""
    if cell.get("t") == "s":
        return strings[int(value.text)]
    return value.text


def sheet_targets(archive: zipfile.ZipFile) -> dict[str, str]:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    rel_map = {rel.get("Id"): rel.get("Target") for rel in rels}
    targets: dict[str, str] = {}
    for sheet in workbook.findall(".//m:sheet", NS):
        rel_id = sheet.get(f"{{{REL_NS}}}id")
        target = rel_map.get(rel_id or "")
        if not target:
            continue
        targets[sheet.get("name", "")] = target if target.startswith("xl/") else f"xl/{target.lstrip('/')}"
    return targets


def extract_rows(archive: zipfile.ZipFile, target: str, strings: list[str]) -> list[dict[str, str]]:
    root = ET.fromstring(archive.read(target))
    rows = {int(row.get("r", "0")): row for row in root.findall(".//m:row", NS)}
    extracted: list[dict[str, str]] = []
    for group, row_numbers in GROUP_ROWS.items():
        for row_number in row_numbers:
            row = rows[row_number]
            cells = {cell.get("r", "")[:1]: cell for cell in row.findall("m:c", NS)}
            component = cell_value(cells.get("A"), strings)
            detail = cell_value(cells.get("D"), strings)
            if not component or not detail:
                raise ValueError(f"Missing C-04 specification value in {target} row {row_number}")
            extracted.append({"group": group, "component": component, "detail": detail})
    if len(extracted) != 30:
        raise ValueError(f"Expected 30 rows in {target}, found {len(extracted)}")
    return extracted


def main() -> None:
    workbook = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_WORKBOOK
    if not workbook.is_file():
        raise FileNotFoundError(workbook)

    with zipfile.ZipFile(workbook) as archive:
        strings = shared_strings(archive)
        targets = sheet_targets(archive)
        raw = {
            slug: extract_rows(archive, targets[sheet_name], strings)
            for slug, sheet_name in SHEET_NAMES.items()
        }

    hub_details = {row["component"]: row["detail"] for row in raw["container-offices"]}
    products: dict[str, object] = {}
    for slug, rows in raw.items():
        products[slug] = {
            "name": SHEET_NAMES[slug].split(" ", 1)[1],
            "sourceSheet": SHEET_NAMES[slug],
            "specifications": [
                {
                    **row,
                    "differsFromHub": slug != "container-offices"
                    and hub_details[row["component"]] != row["detail"],
                }
                for row in rows
            ],
        }

    OUTPUT.write_text(json.dumps({"products": products}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT}")
    for slug, entry in products.items():
        count = len(entry["specifications"])  # type: ignore[index]
        differing = sum(1 for row in entry["specifications"] if row["differsFromHub"])  # type: ignore[index]
        print(f"{slug}: {count} rows; {differing} differ from hub")


if __name__ == "__main__":
    main()
