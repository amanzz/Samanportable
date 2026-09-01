#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VALIDATOR_PATH = ROOT / 'scripts/validate-pc01-active-pdf.py'
GENERATOR_PATH = ROOT / 'scripts/generate-pc01-technical-pdf.py'


def load_validator():
    spec = importlib.util.spec_from_file_location('pc01_pdf_validator', VALIDATOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError('unable to load validator')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


validator = load_validator()


def expect_failure(name, action) -> None:
    try:
        action()
    except (validator.ValidationError, FileNotFoundError):
        print(f'PASS mutation: {name}')
        return
    raise AssertionError(f'mutation unexpectedly passed: {name}')


def replace_or_fail(text: str, old: str, new: str, replace_all: bool = False) -> str:
    if old not in text:
        raise AssertionError(f'test fixture text is missing: {old}')
    return text.replace(old, new) if replace_all else text.replace(old, new, 1)


def main() -> int:
    source = validator.load_source()
    with tempfile.TemporaryDirectory(prefix='pc01-pdf-test-a-') as first_dir, tempfile.TemporaryDirectory(prefix='pc01-pdf-test-b-') as second_dir:
        first = Path(first_dir) / 'pc01.pdf'
        second = Path(second_dir) / 'pc01.pdf'
        subprocess.run([sys.executable, str(GENERATOR_PATH), '--output', str(first)], cwd=ROOT, check=True)
        subprocess.run([sys.executable, str(GENERATOR_PATH), '--output', str(second)], cwd=ROOT, check=True)
        baseline = validator.validate_pdf(first, source)
        first_hash, second_hash = validator.assert_deterministic(first, second)
        if first_hash != second_hash:
            raise AssertionError('determinism precondition failed')

        reader = validator.PdfReader(str(first), strict=True)
        text = validator.normalize(' '.join(page.extract_text() or '' for page in reader.pages))

        wrong_selection = copy.deepcopy(source)
        wrong_selection['product']['specPdfHref'] = '/downloads/inactive-legacy-pc01.pdf'
        expect_failure('wrong active PDF path', lambda: validator.validate_product_selection(wrong_selection))
        expect_failure('missing PDF', lambda: validator.validate_pdf(Path(first_dir) / 'missing.pdf', source))
        corrupt = Path(first_dir) / 'corrupt.pdf'
        corrupt.write_bytes(b'not a pdf')
        expect_failure('corrupt PDF', lambda: validator.validate_pdf(corrupt, source))

        mutations = [
            ('wrong revision', source['manifest']['revision'], 'PC01-TECH-SPEC-WRONG', True),
            ('wrong first published price', 'Rs 1,43,750', 'Rs 1,43,751', False),
            ('missing size', '10x10 ft', 'size removed', True),
            ('unexpected size', 'HSN 9406', 'HSN 9406 20x20', False),
            ('wrong incl-GST value', 'Rs 1,69,625', 'Rs 1,69,626', False),
            ('missing occupancy', '2-3 people', 'occupancy removed', False),
            ('missing approximate weight', '1.5 tonnes', 'weight removed', False),
            ('missing specification row', 'SPEC-01', 'SPEC-MISSING', False),
            ('duplicate specification row', 'SPEC-02', 'SPEC-02 SPEC-01', False),
        ]
        for name, old, new, replace_all in mutations:
            mutated = replace_or_fail(text, old, new, replace_all)
            expect_failure(name, lambda value=mutated: validator.validate_text(value, source))

        by_component = {row['component']: row['detail'] for row in source['specifications']}
        fasteners = by_component['Fasteners & sealing']
        grills = by_component['Grills / mosquito mesh']
        warranty = by_component['Warranty']
        expect_failure(
            'stale Fasteners wording',
            lambda: validator.validate_text(replace_or_fail(text, fasteners, 'Stale fastener text.'), source),
        )
        expect_failure(
            'duplicated Grills wording under Fasteners',
            lambda: validator.validate_text(replace_or_fail(text, fasteners, grills), source),
        )
        expect_failure(
            'numeric warranty promise',
            lambda: validator.validate_text(replace_or_fail(text, warranty, f'{warranty} 5-year warranty.'), source),
        )
        first_variant = source['variants'][0]
        expect_failure(
            'missing GA board',
            lambda: validator.validate_text(replace_or_fail(text, f"GA-ASSET-{first_variant['sizeSlug']}", 'GA-ASSET-MISSING'), source),
        )
        expect_failure(
            'altered GA path',
            lambda: validator.validate_text(replace_or_fail(text, first_variant['gaPath'], '/images/altered-ga.webp'), source),
        )

        non_deterministic = Path(second_dir) / 'mutated.pdf'
        non_deterministic.write_bytes(second.read_bytes() + b'\nchanged')
        expect_failure('non-deterministic output', lambda: validator.assert_deterministic(first, non_deterministic))

        before = validator.sha256(first)
        validator.validate_pdf(first, source)
        after = validator.sha256(first)
        if before != after:
            raise AssertionError('validator modified PDF bytes')
        print('PASS mutation: validator modifying PDF bytes')
        print(f'PASS: 19 mutation scenarios; deterministic SHA256 {baseline["sha256"]}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
