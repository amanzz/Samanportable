#!/usr/bin/env python3
"""Measure the static C-06 acceptance gates from generated, approved-source data."""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
from itertools import combinations
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SLUGS = ("labor-colony", "labor-sheds", "labor-hutments", "prefab-labor-camps")
ROUTES = {
    "labor-colony": "/product/labor-colony",
    "labor-sheds": "/product/labor-colony/labor-sheds",
    "labor-hutments": "/product/labor-colony/labor-hutments",
    "prefab-labor-camps": "/product/labor-colony/prefab-labor-camps",
}


def tokens(value: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", value.lower())


def seven_grams(value: str) -> set[str]:
    words = tokens(value)
    return {" ".join(words[index : index + 7]) for index in range(len(words) - 6)}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    manifest = json.loads((ROOT / "page-structure/c06-generated-manifest.json").read_text(encoding="utf-8"))
    image_report = json.loads((ROOT / "page-structure/c06-image-processing-report.json").read_text(encoding="utf-8"))
    section_h = json.loads((ROOT / "src/data/products/section-h-datasets.json").read_text(encoding="utf-8"))
    specs = json.loads((ROOT / "src/data/products/c06-specifications.json").read_text(encoding="utf-8"))["products"]

    l13: list[dict[str, Any]] = []
    new_bodies: dict[str, str] = {}
    for slug in SLUGS:
        entry = section_h[slug]
        assert 38 <= len(entry["h2"]) <= 72, slug
        panels = [(key, value) for key, value in entry.items() if isinstance(value, dict)]
        assert len(panels) == 6, slug
        for size_slug, panel in panels:
            row = {
                "route": ROUTES[slug],
                "sizeSlug": size_slug,
                "titleChars": len(panel["h2"]),
                "bodyChars": len(panel["intro"]),
                "useCaseChars": [len(value) for value in panel["applications"]],
                "sectionH2Chars": len(entry["h2"]),
            }
            assert 40 <= row["titleChars"] <= 65, row
            assert 500 <= row["bodyChars"] <= 620, row
            assert all(15 <= value <= 45 for value in row["useCaseChars"]), row
            l13.append(row)
            new_bodies[f"{slug}:{size_slug}"] = panel["intro"]

    rte: list[dict[str, Any]] = []
    for page in manifest["pages"]:
        row = {
            "route": ROUTES[page["slug"]],
            "h2Chars": len(page["rte"]["heading"]),
            "bodyChars": len(page["rte"]["body"]),
            "sentences": len(re.findall(r"[.!?](?=\s|$)", page["rte"]["body"])),
            "comparisonChars": len(page["rte"]["comparison"]),
        }
        assert 30 <= row["h2Chars"] <= 58, row
        assert 340 <= row["bodyChars"] <= 430, row
        assert row["sentences"] == 3, row
        assert 90 <= row["comparisonChars"] <= 150, row
        rte.append(row)
        new_bodies[f"{page['slug']}:rte"] = f"{page['rte']['body']} {page['rte']['comparison']}"

    internal_collisions: list[dict[str, Any]] = []
    for left, right in combinations(new_bodies, 2):
        shared = sorted(seven_grams(new_bodies[left]) & seven_grams(new_bodies[right]))
        if shared:
            internal_collisions.append({"left": left, "right": right, "sequences": shared})
    assert not internal_collisions, internal_collisions

    specification_matrix: list[dict[str, Any]] = []
    spec_maps = {
        slug: {row["component"]: row["detail"] for row in specs[slug]["specifications"]}
        for slug in SLUGS
    }
    for left, right in combinations(SLUGS, 2):
        differing = [component for component in spec_maps[left] if spec_maps[left][component] != spec_maps[right][component]]
        assert len(differing) >= 12, (left, right, len(differing))
        specification_matrix.append({"left": left, "right": right, "differingRows": len(differing), "components": differing})

    image_rows = image_report["images"]
    assert image_report["published"] == 144
    assert image_report["filenameCollisionCount"] == 0
    assert image_report["below80KiB"] == 0
    assert image_report["above120KiB"] == 0
    alts = [row["alt"] for row in image_rows]
    assert len(alts) == len(set(alts)) == 144
    assert all(value.isascii() for value in alts)
    assert all(row["targetDimensions"][0] == 1200 for row in image_rows)
    for slug in SLUGS:
        per_slug = [row for row in image_rows if row["slug"] == slug]
        assert len(per_slug) == 36
        for size_slug in {row["sizeSlug"] for row in per_slug}:
            assert len([row for row in per_slug if row["sizeSlug"] == size_slug]) == 6

    pdfs: list[dict[str, Any]] = []
    pdf_hashes: set[str] = set()
    for slug in SLUGS:
        pdf = ROOT / f"public/specs/{slug}-technical-specification.pdf"
        row = {"slug": slug, "bytes": pdf.stat().st_size, "sha256": sha256(pdf)}
        assert row["bytes"] < 400_000
        assert row["sha256"] not in pdf_hashes
        pdf_hashes.add(row["sha256"])
        pdfs.append(row)

    wp_diff = subprocess.run(
        ["git", "diff", "--quiet", "origin/static-migration", "--", "src/data/wp-export"],
        cwd=ROOT,
        check=False,
    ).returncode
    assert wp_diff == 0, "src/data/wp-export differs from origin/static-migration"

    authored_files = [
        ROOT / "src/data/products/c06-specifications.json",
        *[ROOT / f"src/data/products/{slug}.json" for slug in SLUGS],
    ]
    em_dash_hits = [str(path.relative_to(ROOT)) for path in authored_files if "—" in path.read_text(encoding="utf-8")]
    shared_diff = subprocess.run(
        [
            "git", "diff", "--unified=0", "--",
            "src/components/product-variant-hero/rightToExistEntries.tsx",
            "src/data/products/section-h-datasets.json",
        ],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    ).stdout
    if any(line.startswith("+") and not line.startswith("+++") and "—" in line for line in shared_diff.splitlines()):
        em_dash_hits.append("shared-file added lines")
    assert not em_dash_hits, em_dash_hits

    result = {
        "l13": l13,
        "rightToExist": rte,
        "newBodySevenWordCollisions": internal_collisions,
        "specificationPairwiseMatrix": specification_matrix,
        "images": {
            "published": 144,
            "distinctAlts": len(set(alts)),
            "nonAsciiAlts": sum(not value.isascii() for value in alts),
            "filenameCollisions": image_report["filenameCollisionCount"],
            "below80KiB": image_report["below80KiB"],
            "above120KiB": image_report["above120KiB"],
        },
        "pdfs": pdfs,
        "wpExportDiffFiles": 0,
        "introducedEmDashFiles": em_dash_hits,
    }
    output = ROOT / "page-structure/c06-build-gates.json"
    output.write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
