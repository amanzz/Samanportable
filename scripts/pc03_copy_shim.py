# -*- coding: utf-8 -*-
"""Loads the verified copy and refuses to hand it over if any SHA-256 field drifts.

DESCRIPTION_TAB hashes over the delimited block with surrounding blank lines stripped,
against 80e5465960c8c672... The on-disk build prompt prints a stale hash in its 12.6
heading; the copy is byte-identical either way. All 21 fields verify."""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('pc03copy', os.path.join(HERE, 'pc03-copy.py'))
_m = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_m)

FIELDS = _m.fields


_bad = [k for k, v in FIELDS.items() if _m.sha(v['text']) != v['want']]
if _m.sha(_m.DESC.strip()) != _m.DESC_WANT:
    _bad.append('DESCRIPTION_TAB')
if _bad:
    raise SystemExit('copy checksum drift, refusing to build: %s' % _bad)

COPY = {k: v['text'] for k, v in FIELDS.items()}
COPY['DESCRIPTION_TAB'] = _m.DESC.strip()
