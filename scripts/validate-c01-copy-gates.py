#!/usr/bin/env python3
"""Measure the copy-only C-01 acceptance gates from the approved draft and build data."""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SUBPAGES = [
    "low-cost-porta-cabin",
    "luxury-porta-cabin",
    "mini-porta-cabin",
    "ms-porta-cabin",
    "steel-porta-cabin",
    "porta-cabin-shop",
    "porta-cabin-with-toilet",
    "portacabin-office",
]


def tokens(value: str) -> list[str]:
    return re.findall(r"[a-z0-9₹×–-]+", value.lower())


def seven_grams(value: str) -> set[str]:
    words = tokens(value)
    return {" ".join(words[index : index + 7]) for index in range(len(words) - 6)}


def strings(value: Any) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [part for item in value for part in strings(item)]
    if isinstance(value, dict):
        return [part for item in value.values() for part in strings(item)]
    return []


def duplicate_pairs(corpus: dict[str, str]) -> dict[tuple[str, str], list[str]]:
    grams = {key: seven_grams(value) for key, value in corpus.items()}
    duplicates: dict[tuple[str, str], list[str]] = {}
    keys = list(corpus)
    for left_index, left in enumerate(keys):
        for right in keys[left_index + 1 :]:
            shared = sorted(grams[left] & grams[right])
            if shared:
                duplicates[(left, right)] = shared
    return duplicates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--draft", required=True, type=Path)
    args = parser.parse_args()

    draft = args.draft.read_text(encoding="utf-8")
    section = draft.split("## 7 · RIGHT-TO-EXIST BLOCKS — all 9 pages", 1)[1].split(
        "## 8 · §H COPY", 1
    )[0]
    right_to_exist: dict[str, str] = {}
    for route, block in re.findall(r"### (/[^\n]+)\n(.*?)(?=\n### |\Z)", section, re.S):
        body_match = re.search(r"\*\*Body \((\d+)c, 3 sentences\):\*\*\s*>\s*(.+)", block)
        comparison_match = re.search(r"\*\*Comparison line \((\d+)c\):\*\* `(.+?)`", block)
        assert body_match and comparison_match, route
        expected_body_chars = int(body_match.group(1))
        body = body_match.group(2).strip()
        expected_comparison_chars = int(comparison_match.group(1))
        comparison = comparison_match.group(2)
        assert len(body) == expected_body_chars, route
        assert len(comparison) == expected_comparison_chars, route
        assert len(re.findall(r"[.!?](?=\s|$)", body)) == 3, route
        slug = route.rstrip("/").split("/")[-1]
        right_to_exist[slug] = f"{body} {comparison}"
        print(
            f"{slug}: body {len(body)}c / 3 sentences; "
            f"comparison {len(comparison)}c"
        )

    rte_duplicates = duplicate_pairs(right_to_exist)
    assert not rte_duplicates, rte_duplicates
    print("Right-to-exist shared 7-word sequences: 0")

    section_h = json.loads(
        (ROOT / "src/data/products/section-h-datasets.json").read_text(encoding="utf-8")
    )
    h_corpus: dict[str, str] = {}
    for slug in SUBPAGES:
        panels = {
            key: value for key, value in section_h[slug].items() if isinstance(value, dict)
        }
        expected = 4 if slug == "mini-porta-cabin" else 9
        assert len(panels) == expected, slug
        h_corpus[slug] = " ".join(panel["intro"] for panel in panels.values())
        print(f"{slug}: §H tabs {len(panels)}")
    h_duplicates = duplicate_pairs(h_corpus)
    assert not h_duplicates, h_duplicates
    print("Section H shared 7-word sequences: 0")

    specs = json.loads(
        (ROOT / "src/data/products/c01-specifications.json").read_text(encoding="utf-8")
    )
    hard_common = specs["hardCommonRows"]
    for component in hard_common:
        values = {
            next(
                row["detail"]
                for row in entry["specifications"]
                if row["component"] == component
            )
            for entry in specs["products"].values()
        }
        assert len(values) == 1, component
    print(f"Hard-common rows byte-identical: {len(hard_common)}/6 across 9 pages")


if __name__ == "__main__":
    main()
