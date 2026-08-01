"""Apply the approved C04 Section H and use-case copy directly from its draft."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DRAFT = ROOT / "page-structure/content-drafts/C04-GAP-CLOSE-PACK-01Aug2026.md"
HUB = ROOT / "src/data/products/container-offices-applications.json"
SITE = ROOT / "src/data/products/site-office-container-applications.json"
DATASETS = ROOT / "src/data/products/section-h-datasets.json"
SIZES = ["10x10", "20x8", "20x10", "20x12", "30x10", "40x8", "20x20", "40x10", "40x12"]


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save(path: Path, value) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


text = DRAFT.read_text(encoding="utf-8")

hub_section = text.split("## HUB SECTION H, full replacement", 1)[1].split(
    "## SUBPAGE USE-CASES", 1
)[0]
guidance = re.search(r"\*\*Guidance line:\*\* (.+)", hub_section).group(1)
tabs = re.findall(
    r"### Tab \d+, ([^\n]+)\n\n\*\*Title:\*\* ([^\n]+)\n\n(.+?)\n\nUse-cases: (.+?)(?=\n\n### Tab|\Z)",
    hub_section,
    flags=re.S,
)
if len(tabs) != 9:
    raise RuntimeError(f"Expected 9 hub tabs, found {len(tabs)}")

hub = load(HUB)
hub["intro"] = guidance
for panel, (size, title, body, uses) in zip(hub["panels"], tabs):
    if panel["sizeSlug"] != size:
        raise RuntimeError(f"Hub size order mismatch: {panel['sizeSlug']} != {size}")
    panel["h3"] = title
    panel["paragraph"] = " ".join(body.splitlines()).strip()
    panel["applications"] = [item.strip() for item in uses.strip().split("|")]
save(HUB, hub)

uses_section = text.split("## SUBPAGE USE-CASES", 1)[1].split(
    "## SEVEN-WORD COLLISION PATCHES", 1
)[0]
parsed_uses: dict[str, dict[str, list[str]]] = {}
for slug in ["container-office-cabin", "shipping-container-office", "site-office-container"]:
    block = uses_section.split(f"### {slug}", 1)[1]
    next_heading = block.find("\n### ")
    if next_heading >= 0:
        block = block[:next_heading]
    rows = re.findall(r"^- ([^:]+): (.+)$", block, flags=re.M)
    if len(rows) != 9:
        raise RuntimeError(f"Expected 9 use-case rows for {slug}, found {len(rows)}")
    parsed_uses[slug] = {
        size: [item.strip() for item in uses.split("|")] for size, uses in rows
    }

datasets = load(DATASETS)
for slug in ["container-office-cabin", "shipping-container-office"]:
    for size in SIZES:
        datasets[slug][size]["applications"] = parsed_uses[slug][size]

# Approved collision patches. The first three spans are prescribed verbatim;
# the final two are the smallest grammatical word-pair swaps for cabin spans.
datasets["container-office-cabin"]["40x8"]["intro"] = datasets["container-office-cabin"]["40x8"]["intro"].replace(
    "Seven to nine people work in line", "A seven-to-nine person team works in line"
)
datasets["shipping-container-office"]["40x8"]["intro"] = datasets["shipping-container-office"]["40x8"]["intro"].replace(
    "Seven to nine people work in line", "Crews of seven to nine keep working in line"
)
datasets["shipping-container-office"]["20x20"]["intro"] = datasets["shipping-container-office"]["20x20"]["intro"].replace(
    "Four hundred square feet on a square", "Four hundred square feet across a square"
)
datasets["container-office-cabin"]["30x10"]["intro"] = datasets["container-office-cabin"]["30x10"]["intro"].replace(
    "still travels", "travels intact"
)
datasets["container-office-cabin"]["40x12"]["intro"] = datasets["container-office-cabin"]["40x12"]["intro"].replace(
    "carries the", "has our"
)
datasets["shipping-container-office"]["h2"] = (
    "Explore Shipping Container Office sizes and applications"
)
save(DATASETS, datasets)

site = load(SITE)
for panel in site["panels"]:
    panel["applications"] = parsed_uses["site-office-container"][panel["sizeSlug"]]
save(SITE, site)

print("Applied approved C04 hub Section H and 144 subpage use cases.")
