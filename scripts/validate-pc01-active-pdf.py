#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
ACTIVE_RELATIVE_PATH = Path('public/specs/saman-porta-cabins-technical-specification.pdf')
ACTIVE_PATH = ROOT / ACTIVE_RELATIVE_PATH


class ValidationError(RuntimeError):
    pass


def fail(message: str) -> None:
    raise ValidationError(f'PC01_ACTIVE_PDF_INVALID: {message}')


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def money(value: int) -> str:
    digits = str(value)
    if len(digits) <= 3:
        return digits
    tail = digits[-3:]
    lead = digits[:-3]
    pairs: list[str] = []
    while len(lead) > 2:
        pairs.insert(0, lead[-2:])
        lead = lead[:-2]
    if lead:
        pairs.insert(0, lead)
    return ','.join([*pairs, tail])


def normalize(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()


def load_source() -> dict:
    result = subprocess.run(
        ['node', str(ROOT / 'scripts/export-pc01-pdf-source.mjs')],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding='utf-8',
    )
    return json.loads(result.stdout)


def validate_product_selection(source: dict) -> None:
    manifest = source['manifest']
    selected = source['product'].get('specPdfHref')
    if selected != manifest['activePdfHref']:
        fail(f'rendered product selection is {selected!r}, expected {manifest["activePdfHref"]!r}')
    if manifest['activePdfPath'] != ACTIVE_RELATIVE_PATH.as_posix():
        fail('manifest active path is not the controlled PC-01 PDF path')
    if 'legacy' in selected.lower() or selected.startswith('/downloads/'):
        fail('inactive legacy PDF is selected')


def _require_once(text: str, value: str, label: str) -> None:
    count = text.count(normalize(value))
    if count != 1:
        fail(f'{label} expected once, found {count}')


def _require_present(text: str, value: str, label: str) -> None:
    if normalize(value) not in text:
        fail(f'{label} is missing')


def validate_text(text: str, source: dict) -> None:
    text = normalize(text)
    manifest = source['manifest']
    _require_present(text, manifest['revision'], 'fixed revision')
    _require_present(text, manifest['company'], 'company identity')
    _require_present(text, manifest['product'], 'product identity')
    _require_present(text, manifest['canonicalUrl'], 'canonical product URL')
    _require_present(text, 'GST 18%', '18% GST statement')

    for forbidden in ('Rs 1,37,500', '20x20', '40x12', '40x8'):
        if forbidden in text:
            fail(f'forbidden stale content found: {forbidden}')

    for variant in source['variants']:
        slug = variant['sizeSlug']
        _require_present(text, variant['label'], f'{slug} published size')
        _require_present(text, variant['dimensions'], f'{slug} dimensions')
        _require_present(text, f"{variant['areaSqft']} sq ft", f'{slug} area')
        _require_present(text, variant['occupancy'], f'{slug} recommended occupancy')
        _require_present(text, f"{variant['approximateWeightTonnes']:.1f} tonnes", f'{slug} approximate weight')
        _require_once(text, f"Rs {money(variant['priceExGst'])}", f'{slug} ex-GST price')
        _require_once(text, f"Rs {money(variant['priceInclGst'])}", f'{slug} incl-GST price')
        _require_once(text, f'GA-ASSET-{slug}', f'{slug} GA marker')
        _require_once(text, variant['gaPath'], f'{slug} GA path')

    if len(source['variants']) != 6:
        fail(f'expected exactly six source variants, found {len(source["variants"])}')
    if len(source['specifications']) != 30:
        fail(f'expected exactly 30 source specification rows, found {len(source["specifications"])}')

    for index, row in enumerate(source['specifications'], start=1):
        _require_once(text, f'SPEC-{index:02d}', f'specification control SPEC-{index:02d}')
        _require_present(text, row['component'], f'specification component {row["component"]}')
        _require_once(text, row['detail'], f'specification detail {row["component"]}')

    by_component = {row['component']: row['detail'] for row in source['specifications']}
    expected_fasteners = (
        'Approved self-tapping fasteners at floor-board and panel fixings, with welded joints '
        'cleaned before panel closure. Weather sealing and roof drainage are verified at '
        'pre-dispatch inspection.'
    )
    expected_warranty = (
        'Warranty period and exclusions are confirmed only in the final quotation; relocation '
        'damage, misuse, site services and unapproved alterations remain outside the agreed scope '
        'unless stated otherwise.'
    )
    if by_component.get('Fasteners & sealing') != expected_fasteners:
        fail('effective Fasteners source is not the approved owner correction')
    if by_component.get('Warranty') != expected_warranty:
        fail('effective Warranty source is not the conservative wording')
    _require_once(text, expected_fasteners, 'exact Fasteners wording')
    _require_once(text, expected_warranty, 'exact conservative Warranty wording')
    if re.search(r'\b(?:warranty\s*)?(?:\d+)[ -]?(?:year|month)s?\b', text, re.IGNORECASE):
        fail('numeric warranty duration found')


def count_images(reader: PdfReader) -> tuple[int, list[int]]:
    per_page: list[int] = []
    for page in reader.pages:
        count = 0
        resources = page.get('/Resources') or {}
        xobjects = resources.get('/XObject') or {}
        for item in xobjects.values():
            obj = item.get_object()
            if obj.get('/Subtype') == '/Image':
                count += 1
        per_page.append(count)
    return sum(per_page), per_page


def validate_pdf(pdf_path: Path, source: dict | None = None) -> dict:
    source = source or load_source()
    validate_product_selection(source)
    path = pdf_path.resolve()
    if not path.exists():
        fail(f'file does not exist: {path}')
    if not path.is_file():
        fail(f'path is not a file: {path}')
    before = sha256(path)
    if not path.read_bytes().startswith(b'%PDF-'):
        fail('valid PDF signature is missing')
    try:
        reader = PdfReader(str(path), strict=True)
        if reader.is_encrypted:
            fail('PDF must not be encrypted')
        page_text = [page.extract_text() or '' for page in reader.pages]
    except ValidationError:
        raise
    except Exception as error:
        fail(f'PDF parse failed: {error}')
    text = normalize(' '.join(page_text))
    if len(text) < 5000:
        fail(f'extractable text is unexpectedly short ({len(text)} characters)')
    validate_text(text, source)
    if len(reader.pages) != 11:
        fail(f'expected 11 controlled pages, found {len(reader.pages)}')
    for index, page in enumerate(reader.pages, start=1):
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)
        if not (841 <= width <= 843 and 594 <= height <= 596):
            fail(f'page {index} is not A4 landscape ({width:.2f} x {height:.2f})')
    total_images, per_page_images = count_images(reader)
    if total_images != 6:
        fail(f'exactly six approved GA images must be embedded, found {total_images}')
    if per_page_images[-6:] != [1, 1, 1, 1, 1, 1]:
        fail(f'each GA page must contain one image, found {per_page_images[-6:]}')
    metadata = reader.metadata or {}
    if metadata.get('/Title') != source['manifest']['title']:
        fail('fixed PDF title metadata is incorrect')
    after = sha256(path)
    if before != after:
        fail('validator modified PDF bytes')
    return {
        'path': str(path),
        'sha256': before,
        'pages': len(reader.pages),
        'images': total_images,
        'textCharacters': len(text),
    }


def assert_deterministic(first: Path, second: Path) -> tuple[str, str]:
    first_hash = sha256(first)
    second_hash = sha256(second)
    if first_hash != second_hash:
        fail(f'non-deterministic output: {first_hash} != {second_hash}')
    return first_hash, second_hash


def main() -> int:
    parser = argparse.ArgumentParser(description='Validate the maintained active PC-01 PDF.')
    parser.add_argument('--pdf', type=Path, default=ACTIVE_PATH)
    args = parser.parse_args()
    try:
        result = validate_pdf(args.pdf)
    except (ValidationError, subprocess.CalledProcessError) as error:
        print(error, file=sys.stderr)
        return 1
    print(json.dumps({'status': 'PASS', **result}, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())
