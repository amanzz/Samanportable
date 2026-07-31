#!/usr/bin/env python3
"""Publish the C-06 image intake exactly from the approved pack manifest."""

from __future__ import annotations

import hashlib
import io
import json
from pathlib import Path

from PIL import Image, ImageOps


REPO = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"D:\Project-shekhar\all-product-images\C-06")
MANIFEST_PATH = REPO / "page-structure" / "c06-generated-manifest.json"
REPORT_PATH = REPO / "page-structure" / "c06-image-processing-report.json"
TARGET_WIDTH = 1200
TARGET_LOW = 80 * 1024
TARGET_HIGH = 120 * 1024


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def encode_webp(image: Image.Image) -> tuple[bytes, int]:
    """Choose the highest WebP quality that stays inside the standing 120 KiB cap."""
    best_under: tuple[bytes, int] | None = None
    smallest: tuple[bytes, int] | None = None
    low, high = 40, 90
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


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    previous_report = json.loads(REPORT_PATH.read_text(encoding="utf-8")) if REPORT_PATH.exists() else {"images": []}
    previous_by_target = {row["target"]: row for row in previous_report.get("images", [])}
    gallery_rows = [dict(row, kind="variant") for page in manifest["pages"] for row in page["images"]]
    description_rows = [dict(row, kind="description") for page in manifest["pages"] for row in page["descriptionImages"]]
    rows = gallery_rows + description_rows
    if len(gallery_rows) != 144 or len(description_rows) != 24:
        raise RuntimeError(
            f"Expected 144 variant and 24 description rows, found {len(gallery_rows)} and {len(description_rows)}"
        )

    target_names = [row["filename"] for row in rows]
    if len(target_names) != len(set(target_names)):
        raise RuntimeError("Approved target filenames are not unique")

    approved_targets = {
        (Path("public") / "images" / "products" / page["slug"] / row["sizeSlug"] / row["filename"]).as_posix().lower()
        for page in manifest["pages"]
        for row in [*page["images"], *page["descriptionImages"]]
    }
    existing_names = {
        item.name.lower()
        for item in (REPO / "public" / "images").rglob("*")
        if item.is_file()
        and item.relative_to(REPO).as_posix().lower() not in approved_targets
    }
    collisions = sorted({name for name in target_names if name.lower() in existing_names})
    if collisions:
        raise RuntimeError(f"Published filename collision(s): {collisions}")

    report_rows: list[dict[str, object]] = []
    dimensions: dict[tuple[str, str], tuple[int, int]] = {}
    for page in manifest["pages"]:
        slug = page["slug"]
        for row in [
            *[dict(item, kind="variant") for item in page["images"]],
            *[dict(item, kind="description") for item in page["descriptionImages"]],
        ]:
            source_dir = SOURCE_ROOT / Path(row["sourceFolder"])
            matches = [
                item
                for item in source_dir.glob("*.png")
                if row["sourceViewToken"].lower() in item.stem.lower()
            ]
            if len(matches) != 1:
                raise RuntimeError(
                    f"{slug}/{row['sizeSlug']}/{row['sourceViewToken']}: expected one source match, found {len(matches)}: "
                    f"{[item.name for item in matches]}"
                )
            source = matches[0]
            target = REPO / "public" / "images" / "products" / slug / row["sizeSlug"] / row["filename"]
            target.parent.mkdir(parents=True, exist_ok=True)
            target_relative = target.relative_to(REPO).as_posix()

            if row["kind"] == "variant" and target.exists() and target_relative in previous_by_target:
                previous = dict(previous_by_target[target_relative])
                previous["kind"] = "variant"
                report_rows.append(previous)
                dimensions[(slug, f"/images/products/{slug}/{row['sizeSlug']}/{row['filename']}")] = tuple(previous["targetDimensions"])
                continue

            with Image.open(source) as opened:
                image = opened.convert("RGB")
                source_width, source_height = image.size
                if row["kind"] == "description":
                    image = ImageOps.fit(
                        image,
                        (TARGET_WIDTH, 675),
                        method=Image.Resampling.LANCZOS,
                        centering=(0.5, 0.5),
                    )
                elif source_width != TARGET_WIDTH:
                    target_height = round(source_height * TARGET_WIDTH / source_width)
                    image = image.resize((TARGET_WIDTH, target_height), Image.Resampling.LANCZOS)
                payload, quality = encode_webp(image)
                target.write_bytes(payload)
                width, height = image.size

            if row["kind"] == "variant":
                dimensions[(slug, f"/images/products/{slug}/{row['sizeSlug']}/{row['filename']}")] = (width, height)
            report_rows.append(
                {
                    "slug": slug,
                    "size": row.get("size", row.get("sourceSizeFolder")),
                    "sizeSlug": row["sizeSlug"],
                    "slot": row.get("slot", "description"),
                    "kind": row["kind"],
                    "sourceFolder": row["sourceFolder"],
                    "sourceViewToken": row["sourceViewToken"],
                    "sourceFilename": source.name,
                    "sourceSha256": sha256(source),
                    "target": target_relative,
                    "targetSha256": sha256(target),
                    "sourceDimensions": [source_width, source_height],
                    "targetDimensions": [width, height],
                    "targetBytes": target.stat().st_size,
                    "webpQuality": quality,
                    "alt": row["alt"],
                }
            )

    for slug in {row["slug"] for row in report_rows}:
        product_path = REPO / "src" / "data" / "products" / f"{slug}.json"
        product = json.loads(product_path.read_text(encoding="utf-8"))
        for variant in product["variants"]:
            for image in variant["images"]:
                image["width"], image["height"] = dimensions[(slug, image["src"])]
        product_path.write_text(
            json.dumps(product, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
            newline="\n",
        )

    report = {
        "sourceRoot": str(SOURCE_ROOT),
        "targetWidth": TARGET_WIDTH,
        "expected": 168,
        "expectedVariant": 144,
        "expectedDescription": 24,
        "published": len(report_rows),
        "filenameCollisionCount": 0,
        "below80KiB": sum(row["targetBytes"] < TARGET_LOW for row in report_rows),
        "above120KiB": sum(row["targetBytes"] > TARGET_HIGH for row in report_rows),
        "images": report_rows,
    }
    REPORT_PATH.write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(
        f"Published {len(report_rows)} WebPs; filename collisions 0; "
        f"below 80 KiB {report['below80KiB']}; above 120 KiB {report['above120KiB']}."
    )


if __name__ == "__main__":
    main()
