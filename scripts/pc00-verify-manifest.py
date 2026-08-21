# -*- coding: utf-8 -*-
"""PC-00 Step 0.3/0.4: verify every hash in MANIFEST-sha256.txt against the
actual file on disk, and count files found per set."""
import hashlib
import os
import re

MANIFEST = r"D:\Project-shekhar\all-product-images\Hub Page (Porta Cabins)\porta-cabin\approved-website-assets-v1\_PC00-BUILD-HANDOFF\MANIFEST-sha256.txt"
ROOT_A = r"D:\Project-shekhar\all-product-images\Hub Page (Porta Cabins)\porta-cabin\approved-website-assets-v1"
ROOT_B = r"D:\video-project\saman-products-video\ms-porta-cabin\technical-presentation-boards"
HANDOFF = r"D:\Project-shekhar\all-product-images\Hub Page (Porta Cabins)\porta-cabin\approved-website-assets-v1\_PC00-BUILD-HANDOFF"

lines = open(MANIFEST, encoding="utf-8").read().splitlines()
entries = []
current_root = None
for line in lines:
    if "ROOT A" in line or "HANDOFF FILES" in line:
        current_root = None  # resolved per-line below
    m = re.match(r"^([0-9a-fA-F]{64})\s+(.+)$", line.strip())
    if m:
        entries.append((m.group(1).lower(), m.group(2).strip()))

print("total manifest entries parsed:", len(entries))

matched = 0
mismatched = []
missing = []
for expected_hash, relpath in entries:
    candidates = [
        os.path.join(HANDOFF, relpath),
        os.path.join(ROOT_A, relpath),
        os.path.join(ROOT_B, relpath),
    ]
    found_path = None
    for c in candidates:
        if os.path.isfile(c):
            found_path = c
            break
    if not found_path:
        missing.append(relpath)
        continue
    actual = hashlib.sha256(open(found_path, "rb").read()).hexdigest()
    if actual == expected_hash:
        matched += 1
    else:
        mismatched.append((relpath, expected_hash, actual))

print("matched:", matched)
print("missing:", len(missing))
for m in missing:
    print("  MISSING:", m)
print("mismatched:", len(mismatched))
for r, e, a in mismatched:
    print("  MISMATCH:", r, "expected", e[:16], "actual", a[:16])
