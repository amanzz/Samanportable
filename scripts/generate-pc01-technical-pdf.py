#!/usr/bin/env python3
from __future__ import annotations

import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / 'public/specs/saman-porta-cabins-technical-specification.pdf'
LAYOUT_PATH = ROOT / 'page-structure/pdf-templates/pc01_porta_cabins_technical_specification/layout.py'


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


def load_layout():
    spec = importlib.util.spec_from_file_location('pc01_pdf_layout', LAYOUT_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f'Unable to load layout module: {LAYOUT_PATH}')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    parser = argparse.ArgumentParser(description='Generate the maintained PC-01 technical PDF.')
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    output = args.output.resolve()
    source = load_source()
    load_layout().build_pdf(source, ROOT, output)
    print(output)
    return 0


if __name__ == '__main__':
    sys.exit(main())
