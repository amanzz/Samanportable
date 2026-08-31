# PC-01 maintained technical PDF

This directory owns the layout and pinned Python runtime for the active Porta Cabins PDF.

## Sources of truth

- `src/data/products/porta-cabins.json` owns the six variants, prices, GST, occupancy text, weight statements, active PDF href and GA asset paths.
- `src/lib/c01SpecificationOverrides.js` owns the effective specification boundary used by the website. The exporter calls `getEffectiveC01SpecificationEntry('porta-cabins')`; it does not read the generated base as the final specification.
- `page-structure/pdf-sources/pc01-porta-cabins-v1.json` owns fixed document control, approved scope copy and the exact active output path.
- This directory owns layout only. It contains no duplicated product prices or specification rows.

The historical PDF is a visual reference, not a factual source. Generated `src/data/products/c01-specifications.json` must not be used directly as the final PDF specification. Do not copy an override value into this template.

## Environment and commands

Use Python 3.11 or later and Node.js 20 or later. Install the pinned PDF dependencies into an isolated environment:

```text
python -m pip install -r page-structure/pdf-templates/pc01_porta_cabins_technical_specification/requirements.txt
```

The build is non-interactive and performs no network access:

```text
npm run generate:pc01-pdf
npm run validate:pc01-pdf
npm run test:pc01-pdf
```

For a pre-release comparison without replacing the active binary:

```text
python scripts/generate-pc01-technical-pdf.py --output <temporary-path.pdf>
python scripts/validate-pc01-active-pdf.py --pdf <temporary-path.pdf>
```

## Deterministic controls

The generator uses ReportLab invariant mode, page compression, fixed document metadata, a fixed revision, deterministic source ordering, pinned dependencies and the ReportLab-bundled Bitstream Vera fonts. It does not write a build timestamp. Tests generate into two unrelated temporary directories and require byte-identical SHA-256 values.

## Update, validation and rollback

Update an authoritative repository source, run all three commands, inspect a fresh 200 DPI render, then commit source and binary separately. The validator proves content parity and hashes the binary before and after validation. Roll back by reverting the source commit and regenerated-PDF commit together; do not hand-edit the PDF or restore an inactive sibling PDF.
