#!/usr/bin/env python3
"""Process the authorised C08-E2 prefab render intake without authoring alt text."""

from __future__ import annotations

import hashlib
import io
import json
from pathlib import Path

from PIL import Image


REPO = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(
    r"D:\Project-shekhar\all-product-images\C-08\prefabricated-container-house"
)
TARGET_ROOT = REPO / "public" / "images" / "products" / "prefabricated-container-house"
REPORT_PATH = REPO / "page-structure" / "C08" / "c08-e2-image-intake-report.json"
SQUARE_TOKENS = {"E01", "E03", "E06", "I01", "I02", "I03"}
INFO_TOKENS = {"E02", "E04", "E05", "I04"}
SIZE_ORDER = ("20x8", "20x10", "20x12", "40x8", "40x10", "40x12")
TARGET_HIGH = 120 * 1024


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def encode_webp(image: Image.Image) -> tuple[bytes, int]:
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


def size_folder(size_slug: str) -> Path:
    matches = sorted(SOURCE_ROOT.glob(f"{size_slug}x8.5ft"))
    if len(matches) != 1:
        raise RuntimeError(f"{size_slug}: expected one source folder, found {matches}")
    return matches[0]


def center_crop_16_9(image: Image.Image) -> Image.Image:
    width, height = image.size
    crop_height = round(width * 9 / 16)
    top = (height - crop_height) // 2
    return image.crop((0, top, width, top + crop_height))


def main() -> None:
    rows: list[dict[str, object]] = []
    source_hashes: set[str] = set()
    target_names: set[str] = set()

    for size_slug in SIZE_ORDER:
        sources = sorted(size_folder(size_slug).glob("*.png"))
        if len(sources) != 10:
            raise RuntimeError(f"{size_slug}: expected ten sources, found {len(sources)}")

        for source in sources:
            token, view_with_ext = source.name.split("_", 1)
            view = Path(view_with_ext).stem
            if token in SQUARE_TOKENS:
                derivative = "gallery"
                target_dimensions = (900, 900)
                target_dir = TARGET_ROOT / size_slug
            elif token in INFO_TOKENS:
                derivative = "info"
                target_dimensions = (1200, 675)
                target_dir = TARGET_ROOT / "info" / size_slug
            else:
                raise RuntimeError(f"Unruled source token: {source.name}")

            filename = f"prefabricated-container-house-{size_slug}-{view}.webp"
            if filename in target_names:
                raise RuntimeError(f"Duplicate target filename: {filename}")
            target_names.add(filename)
            target = target_dir / filename
            target.parent.mkdir(parents=True, exist_ok=True)

            with Image.open(source) as opened:
                source_dimensions = opened.size
                image = opened.convert("RGB")
                if derivative == "info":
                    image = center_crop_16_9(image)
                image = image.resize(target_dimensions, Image.Resampling.LANCZOS)
                payload, quality = encode_webp(image)
            target.write_bytes(payload)

            source_digest = sha256(source)
            if source_digest in source_hashes:
                raise RuntimeError(f"Source reused: {source}")
            source_hashes.add(source_digest)
            rows.append(
                {
                    "assetType": "render",
                    "sizeSlug": size_slug,
                    "sourceViewToken": token,
                    "sourceFilename": source.name,
                    "sourcePath": str(source),
                    "sourceSha256": source_digest,
                    "sourceDimensions": list(source_dimensions),
                    "derivative": derivative,
                    "filename": filename,
                    "alt": "",
                    "altStatus": "pending-fable-5-manifest",
                    "target": target.relative_to(REPO).as_posix(),
                    "targetSha256": sha256(target),
                    "targetDimensions": list(target_dimensions),
                    "targetBytes": target.stat().st_size,
                    "webpQuality": quality,
                    "crop": "none" if derivative == "gallery" else "visual-review-approved-center-16:9",
                }
            )

    if len(rows) != 60 or len(source_hashes) != 60 or len(target_names) != 60:
        raise RuntimeError("Expected 60 one-source/one-output intake rows")
    for size_slug in SIZE_ORDER:
        size_rows = [row for row in rows if row["sizeSlug"] == size_slug]
        if sum(row["derivative"] == "gallery" for row in size_rows) != 6:
            raise RuntimeError(f"{size_slug}: gallery allocation is not six")
        if sum(row["derivative"] == "info" for row in size_rows) != 4:
            raise RuntimeError(f"{size_slug}: info allocation is not four")

    report = {
        "sourceRoot": str(SOURCE_ROOT),
        "assetType": "render",
        "selectionRule": "Each source is used exactly once: six square gallery and four 16:9 Info derivatives per size.",
        "altPolicy": "No alt text authored; all alt fields remain empty pending Fable 5's byte-exact manifest.",
        "visualCropReview": "Passed for all 24 Info derivatives; complete exterior building or principal interior subject retained.",
        "processed": len(rows),
        "uniqueSources": len(source_hashes),
        "uniqueFilenames": len(target_names),
        "gallery": sum(row["derivative"] == "gallery" for row in rows),
        "info": sum(row["derivative"] == "info" for row in rows),
        "wiredToRoute": 0,
        "images": rows,
    }
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(
        f"Processed {report['processed']} one-use render sources: "
        f"{report['gallery']} gallery, {report['info']} Info; "
        "all alt fields empty and nothing wired."
    )


if __name__ == "__main__":
    main()
