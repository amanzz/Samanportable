#!/usr/bin/env python3
"""Re-encode the six owner-approved CC-01 20x8 gallery images under the 200 KB intake rule.

The owner-approved set (OA-1) shipped at 235-386 KB against a repository intake rule of
200 KB per image, and the 30 container-cafe images already in production sit at 102-141 KB.
The CC-01 ruling of 05 Sep 2026 approves the images for their visual content and geometry,
not for their encoding bytes, so this script re-encodes them.

  * Source is `05-OWNER-APPROVED/*.png`, the owner-approved master, NOT the delivered WebP.
    Re-encoding an already-lossy WebP would stack a second generation of loss for no reason;
    the PNG is the same approved artwork at full fidelity.
  * Encoder is the project's locked tooling, identical to co00/lc00/lc07: Pillow
    `save(..., "WEBP", quality=q, method=6)`.
  * Quality is the HIGHEST integer in [40, 95] whose output is <= MAX_BYTES. The ladder is a
    plain descending scan, so the chosen quality - and therefore the output bytes - is
    deterministic for a given master.
  * Geometry is asserted, never adjusted: no crop, no resize, no rotation, no recolour.
    The script fails rather than emitting an image whose dimensions or mode moved.

Quality is reported against both the PNG master and the delivered WebP via SSIM (Gaussian
11x11, sigma 1.5, on luma), so the visual-fidelity claim in the release record is measured
rather than asserted.

Run:  python scripts/cc01-optimize-20x8-images.py [--check]
      --check re-encodes to a temporary buffer and verifies the committed files match,
      without writing anything.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MASTER_DIR = Path(
    r"D:/_C-DRIVE-OFFLOAD/Desktop/SAMAN-SESSION-RECOVERY-2026-08-28/external"
    r"/SAMAN-SEO-ASSET-PRODUCTION-2026-08-28/CC-01-container-cafe-20x8/05-OWNER-APPROVED"
)
DELIVERED_DIR = MASTER_DIR.parent / "06-CODEX-READY"
OUT_DIR = ROOT / "public/images/products/container-cafe/20x8"

# The intake rule is 200 KB; 195,000 bytes is the ruled target, leaving headroom so a
# borderline image cannot drift over the rule on a future encoder revision.
MAX_BYTES = 195_000
QUALITY_CEILING = 95
QUALITY_FLOOR = 40
EXPECTED_SIZE = (1254, 1254)
# Below this, re-encoding is no longer visually neutral and the image is reported instead.
SSIM_FLOOR = 0.95

VIEWS = (
    "front-left-hero",
    "front-elevation",
    "front-right-aerial",
    "left-side-elevation",
    "entrance-axis-interior",
    "service-zone-interior",
)
STEM = "container-cafe-20x8x8-5-ft-{view}"


def _gaussian_kernel(size: int = 11, sigma: float = 1.5) -> np.ndarray:
    axis = np.arange(size, dtype=np.float64) - (size - 1) / 2.0
    kernel = np.exp(-(axis ** 2) / (2.0 * sigma ** 2))
    return kernel / kernel.sum()


def _blur(plane: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    """Separable Gaussian blur, 'valid' in both axes."""
    rows = np.apply_along_axis(lambda m: np.convolve(m, kernel, mode="valid"), 1, plane)
    return np.apply_along_axis(lambda m: np.convolve(m, kernel, mode="valid"), 0, rows)


def ssim(a: Image.Image, b: Image.Image) -> float:
    """Mean SSIM on the luma plane. Standard constants for 8-bit data."""
    x = np.asarray(a.convert("L"), dtype=np.float64)
    y = np.asarray(b.convert("L"), dtype=np.float64)
    if x.shape != y.shape:
        raise ValueError(f"SSIM needs matching shapes, got {x.shape} and {y.shape}")
    kernel = _gaussian_kernel()
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    mu_x, mu_y = _blur(x, kernel), _blur(y, kernel)
    mu_x2, mu_y2, mu_xy = mu_x * mu_x, mu_y * mu_y, mu_x * mu_y
    sigma_x = _blur(x * x, kernel) - mu_x2
    sigma_y = _blur(y * y, kernel) - mu_y2
    sigma_xy = _blur(x * y, kernel) - mu_xy
    numerator = (2 * mu_xy + c1) * (2 * sigma_xy + c2)
    denominator = (mu_x2 + mu_y2 + c1) * (sigma_x + sigma_y + c2)
    return float(np.mean(numerator / denominator))


def encode(master: Image.Image, quality: int) -> bytes:
    buffer = io.BytesIO()
    master.save(buffer, "WEBP", quality=quality, method=6)
    return buffer.getvalue()


def choose(master: Image.Image) -> tuple[int, bytes]:
    """Highest quality in the ladder whose output fits the budget."""
    for quality in range(QUALITY_CEILING, QUALITY_FLOOR - 1, -1):
        payload = encode(master, quality)
        if len(payload) <= MAX_BYTES:
            return quality, payload
    raise SystemExit(f"no quality in [{QUALITY_FLOOR}, {QUALITY_CEILING}] reaches {MAX_BYTES} bytes")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true",
                        help="verify the committed files reproduce, writing nothing")
    args = parser.parse_args()

    rows, degraded = [], []
    for view in VIEWS:
        name = STEM.format(view=view)
        master_path = MASTER_DIR / f"{name}.png"
        delivered_path = DELIVERED_DIR / f"{name}.webp"
        out_path = OUT_DIR / f"{name}.webp"

        master = Image.open(master_path)
        master.load()
        master = master.convert("RGB")
        if master.size != EXPECTED_SIZE:
            raise SystemExit(f"{name}: master is {master.size}, expected {EXPECTED_SIZE}")

        quality, payload = choose(master)

        # Decode what we are about to ship and assert geometry survived untouched.
        shipped = Image.open(io.BytesIO(payload))
        shipped.load()
        if shipped.size != EXPECTED_SIZE:
            raise SystemExit(f"{name}: re-encode is {shipped.size}, expected {EXPECTED_SIZE}")
        if shipped.mode != "RGB":
            raise SystemExit(f"{name}: re-encode is mode {shipped.mode}, expected RGB")
        if getattr(shipped, "n_frames", 1) != 1:
            raise SystemExit(f"{name}: re-encode is animated")

        delivered = Image.open(delivered_path)
        delivered.load()
        ssim_master = ssim(master, shipped)
        ssim_delivered = ssim(delivered.convert("RGB"), shipped)
        if ssim_master < SSIM_FLOOR:
            degraded.append((name, ssim_master))

        if args.check:
            actual = out_path.read_bytes()
            status = "MATCH" if actual == payload else "DIFFERS"
        else:
            OUT_DIR.mkdir(parents=True, exist_ok=True)
            out_path.write_bytes(payload)
            status = "written"

        rows.append({
            "file": f"{name}.webp",
            "quality": quality,
            "approved_bytes": delivered_path.stat().st_size,
            "approved_sha256": hashlib.sha256(delivered_path.read_bytes()).hexdigest(),
            "optimized_bytes": len(payload),
            "optimized_sha256": hashlib.sha256(payload).hexdigest(),
            "width": shipped.size[0],
            "height": shipped.size[1],
            "mode": shipped.mode,
            "ssim_vs_master": round(ssim_master, 5),
            "ssim_vs_approved_webp": round(ssim_delivered, 5),
            "status": status,
        })

    for row in rows:
        print(
            f"{row['file']:52} q={row['quality']:2}  "
            f"{row['approved_bytes']:>7,} -> {row['optimized_bytes']:>7,} B  "
            f"{row['width']}x{row['height']} {row['mode']}  "
            f"ssim(master)={row['ssim_vs_master']:.5f}  "
            f"ssim(approved)={row['ssim_vs_approved_webp']:.5f}  {row['status']}"
        )
    over = [r for r in rows if r["optimized_bytes"] > MAX_BYTES]
    print(f"\nover {MAX_BYTES:,} bytes: {len(over)}")
    print(f"below SSIM {SSIM_FLOOR}: {len(degraded)}")
    for name, value in degraded:
        print(f"  DEGRADED {name}: {value:.5f} - report this image rather than shipping it")
    print(json.dumps(rows, indent=2))


if __name__ == "__main__":
    main()
