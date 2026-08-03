#!/usr/bin/env python3
"""Publish the C-08 gallery images from the approved Markdown manifest."""

from __future__ import annotations

import hashlib
import io
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

from PIL import Image


REPO = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"D:\Project-shekhar\all-product-images\C-08")
MANIFEST_PATH = (
    REPO
    / "page-structure"
    / "content-drafts"
    / "C08-IMAGE-ALT-MANIFEST-180-02Aug2026.md"
)
REPORT_PATH = REPO / "page-structure" / "C08" / "c08-image-processing-report.json"
TARGET_SIDE = 900
TARGET_LOW = 80 * 1024
TARGET_HIGH = 120 * 1024
EXPECTED_SLUGS = {
    "container-houses",
    "prefab-container-homes",
    "luxury-container-houses",
    "shipping-container-homes",
    "affordable-container-homes",
}
EXPECTED_SIZES = {"20x8", "20x10", "20x12", "40x8", "40x10", "40x12"}
PRODUCT_TERMS = {
    "container-houses": "container house",
    "prefab-container-homes": "prefab container home",
    "luxury-container-houses": "luxury container house",
    "shipping-container-homes": "shipping container home",
    "affordable-container-homes": "affordable container home",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def encode_webp(image: Image.Image) -> tuple[bytes, int]:
    """Use the highest WebP quality that stays inside the standing 120 KiB cap."""
    best_under: tuple[bytes, int] | None = None
    smallest: tuple[bytes, int] | None = None
    low, high = 10, 95
    while low <= high:
        quality = (low + high) // 2
        buffer = io.BytesIO()
        image.save(buffer, format="WEBP", quality=quality, method=4)
        payload = buffer.getvalue()
        if smallest is None or len(payload) < len(smallest[0]):
            smallest = (payload, quality)
        if len(payload) <= TARGET_HIGH:
            best_under = (payload, quality)
            low = quality + 1
        else:
            high = quality - 1
    assert smallest is not None
    return best_under or smallest


def parse_manifest() -> list[dict[str, str]]:
    manifest_text = MANIFEST_PATH.read_text(encoding="utf-8")
    rows: list[dict[str, str]] = []
    slug: str | None = None
    source_folder: str | None = None
    size_slug: str | None = None
    for line in manifest_text.splitlines():
        if line.startswith("## "):
            route = re.search(r"(/product/container-houses(?:/[a-z0-9-]+)?)\s*$", line)
            if route:
                slug = route.group(1).rstrip("/").split("/")[-1]
                source_folder = None
                size_slug = None
            continue
        source = re.match(r"Source folder: `([^`]+)`", line)
        if source and slug:
            source_folder = source.group(1)
            continue
        size = re.match(r"### (\d+)x(\d+) ft$", line)
        if size and slug:
            size_slug = f"{size.group(1)}x{size.group(2)}"
            continue
        row = re.match(r"^\| ([EI]\d\d) \| ([^|]+) \| ([^|]+) \|$", line)
        if row:
            if not slug or not source_folder or not size_slug:
                raise RuntimeError(f"Manifest row has incomplete context: {line}")
            rows.append(
                {
                    "slug": slug,
                    "sourceFolder": source_folder,
                    "sizeSlug": size_slug,
                    "sourceViewToken": row.group(1),
                    "filename": row.group(2).strip(),
                    "alt": row.group(3).strip(),
                }
            )
    amendments = [
        json.loads(match.group(1))
        for match in re.finditer(r"<!-- C08_ALT_AMENDMENT (\{.*?\}) -->", manifest_text)
    ]
    for amendment in amendments:
        matches = [
            row
            for row in rows
            if row["slug"] == amendment["slug"]
            and row["sizeSlug"] == amendment["sizeSlug"]
            and row["sourceViewToken"] == amendment["sourceViewToken"]
            and row["filename"] == amendment["filename"]
        ]
        if len(matches) != 1:
            raise RuntimeError(
                "Manifest amendment target must resolve once: "
                f"{amendment['slug']}/{amendment['sizeSlug']}/{amendment['sourceViewToken']}"
            )
        if matches[0]["alt"] != amendment["originalAlt"]:
            raise RuntimeError(
                f"Manifest amendment original alt does not match the retained row: {amendment['filename']}"
            )
        matches[0]["alt"] = amendment["supersedingAlt"]
    return rows


def stripped_description(row: dict[str, str]) -> str:
    text = re.sub(re.escape(PRODUCT_TERMS[row["slug"]]), "", row["alt"], flags=re.I)
    text = re.sub(rf"\b{re.escape(row['sizeSlug'])}\s*ft\b", "", text, flags=re.I)
    return re.sub(r"\s+", " ", text).strip(" ,.-").casefold()


def find_size_folder(product_folder: Path, size_slug: str) -> Path:
    width, length = size_slug.split("x")
    pattern = re.compile(rf"^{width}\s*[x×]\s*{length}\b", re.I)
    matches = [item for item in product_folder.iterdir() if item.is_dir() and pattern.search(item.name)]
    if len(matches) != 1:
        raise RuntimeError(
            f"{product_folder.name}/{size_slug}: expected one size folder, found {len(matches)}: "
            f"{[item.name for item in matches]}"
        )
    return matches[0]


def find_source(row: dict[str, str]) -> Path:
    source_dir = find_size_folder(SOURCE_ROOT / row["sourceFolder"], row["sizeSlug"])
    token = f"_{row['sizeSlug']}_{row['sourceViewToken']}_".casefold()
    matches = [item for item in source_dir.glob("*.png") if token in item.name.casefold()]
    if len(matches) != 1:
        raise RuntimeError(
            f"{row['slug']}/{row['sizeSlug']}/{row['sourceViewToken']}: expected one source, "
            f"found {len(matches)}: {[item.name for item in matches]}"
        )
    return matches[0]


def validate_manifest(rows: list[dict[str, str]]) -> None:
    if len(rows) != 180:
        raise RuntimeError(f"Expected 180 manifest rows, found {len(rows)}")
    if {row["slug"] for row in rows} != EXPECTED_SLUGS:
        raise RuntimeError("Manifest product slugs do not match the five approved C-08 pages")
    if len({row["filename"] for row in rows}) != 180:
        raise RuntimeError("Manifest target filenames are not unique")
    if len({row["alt"] for row in rows}) != 180:
        raise RuntimeError("Manifest alt strings are not unique")
    for slug in EXPECTED_SLUGS:
        page_descriptions = {
            stripped_description(row) for row in rows if row["slug"] == slug
        }
        if len(page_descriptions) != 36:
            raise RuntimeError(
                f"{slug}: expected 36 unique descriptions after product and size stripping, "
                f"found {len(page_descriptions)}"
            )

    grouped: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        grouped[(row["slug"], row["sizeSlug"])].append(row)
    if set(grouped) != {(slug, size) for slug in EXPECTED_SLUGS for size in EXPECTED_SIZES}:
        raise RuntimeError("Manifest does not contain all five-product/six-size bands")
    for key, items in grouped.items():
        if len(items) != 6:
            raise RuntimeError(f"{key}: expected six ordered images, found {len(items)}")
        view_counts = Counter(item["sourceViewToken"][0] for item in items)
        if view_counts != Counter({"E": 3, "I": 3}):
            raise RuntimeError(f"{key}: expected three exterior and three interior rows, found {view_counts}")

    approved_targets = {
        (REPO / "public" / "images" / "products" / row["slug"] / row["sizeSlug"] / row["filename"]).resolve()
        for row in rows
    }
    existing_by_name: dict[str, list[Path]] = defaultdict(list)
    for item in (REPO / "public" / "images").rglob("*"):
        if item.is_file() and item.resolve() not in approved_targets:
            existing_by_name[item.name.casefold()].append(item)
    collisions = {
        row["filename"]: existing_by_name[row["filename"].casefold()]
        for row in rows
        if row["filename"].casefold() in existing_by_name
    }
    if collisions:
        raise RuntimeError(f"Site-wide filename collisions: {collisions}")


def main() -> None:
    rows = parse_manifest()
    validate_manifest(rows)
    by_variant: dict[tuple[str, str], list[dict[str, object]]] = defaultdict(list)
    report_rows: list[dict[str, object]] = []
    previous_report = (
        json.loads(REPORT_PATH.read_text(encoding="utf-8"))
        if REPORT_PATH.exists()
        else {"images": []}
    )
    previous_by_target = {
        row["target"]: row for row in previous_report.get("images", [])
    }

    for position, row in enumerate(rows, start=1):
        source = find_source(row)
        target = (
            REPO
            / "public"
            / "images"
            / "products"
            / row["slug"]
            / row["sizeSlug"]
            / row["filename"]
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target_relative = target.relative_to(REPO).as_posix()
        source_digest = sha256(source)
        previous = previous_by_target.get(target_relative)
        can_reuse = (
            target.exists()
            and previous is not None
            and previous.get("sourceSha256") == source_digest
            and previous.get("targetSha256") == sha256(target)
            and target.stat().st_size <= TARGET_HIGH
        )
        if can_reuse:
            source_width, source_height = previous["sourceDimensions"]
            quality = previous["webpQuality"]
        else:
            with Image.open(source) as opened:
                source_width, source_height = opened.size
                image = opened.convert("RGB")
                if image.size != (TARGET_SIDE, TARGET_SIDE):
                    image = image.resize((TARGET_SIDE, TARGET_SIDE), Image.Resampling.LANCZOS)
                payload, quality = encode_webp(image)
            target.write_bytes(payload)

        public_src = f"/images/products/{row['slug']}/{row['sizeSlug']}/{row['filename']}"
        by_variant[(row["slug"], row["sizeSlug"])].append(
            {
                "src": public_src,
                "alt": row["alt"],
                "provenance": "unknown",
                "width": TARGET_SIDE,
                "height": TARGET_SIDE,
            }
        )
        report_rows.append(
            {
                **row,
                "manifestPosition": position,
                "sourceFilename": source.name,
                "sourceSha256": source_digest,
                "sourceDimensions": [source_width, source_height],
                "target": target.relative_to(REPO).as_posix(),
                "targetSha256": sha256(target),
                "targetDimensions": [TARGET_SIDE, TARGET_SIDE],
                "targetBytes": target.stat().st_size,
                "webpQuality": quality,
            }
        )

    for slug in sorted(EXPECTED_SLUGS):
        product_path = REPO / "src" / "data" / "products" / f"{slug}.json"
        product = json.loads(product_path.read_text(encoding="utf-8"))
        product.pop("galleryImages", None)
        for variant in product["variants"]:
            variant["images"] = by_variant[(slug, variant["sizeSlug"])]
        product_path.write_text(
            json.dumps(product, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
            newline="\n",
        )

    report = {
        "manifest": MANIFEST_PATH.relative_to(REPO).as_posix(),
        "manifestSha256": sha256(MANIFEST_PATH),
        "sourceRoot": str(SOURCE_ROOT),
        "destinationConvention": "public/images/products/<product-slug>/<size>/<manifest-filename>",
        "targetDimensions": [TARGET_SIDE, TARGET_SIDE],
        "published": len(report_rows),
        "pages": len({row["slug"] for row in rows}),
        "sizesPerPage": 6,
        "imagesPerPage": 36,
        "imagesPerSize": 6,
        "exteriorPerSize": 3,
        "interiorPerSize": 3,
        "uniqueFilenames": len({row["filename"] for row in rows}),
        "uniqueAlts": len({row["alt"] for row in rows}),
        "uniqueStrippedDescriptionsSitewide": len({stripped_description(row) for row in rows}),
        "uniqueStrippedDescriptionsByPage": {
            slug: len(
                {
                    stripped_description(row)
                    for row in rows
                    if row["slug"] == slug
                }
            )
            for slug in sorted(EXPECTED_SLUGS)
        },
        "filenameCollisionCount": 0,
        "below80KiB": sum(row["targetBytes"] < TARGET_LOW for row in report_rows),
        "above120KiB": sum(row["targetBytes"] > TARGET_HIGH for row in report_rows),
        "images": report_rows,
    }
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(
        f"Published {report['published']} WebPs; unique filenames {report['uniqueFilenames']}; "
        f"unique alts {report['uniqueAlts']}; site-wide stripped descriptions "
        f"{report['uniqueStrippedDescriptionsSitewide']}; "
        f"below 80 KiB {report['below80KiB']}; above 120 KiB {report['above120KiB']}."
    )


if __name__ == "__main__":
    main()
