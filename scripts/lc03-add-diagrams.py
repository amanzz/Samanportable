# -*- coding: utf-8 -*-
"""Add the diagrams[] field to the oil-field-camp entry in c06-specifications.json,
now that both diagrams have been reissued (version block + mandatory
"Illustrative" statement present, red-curve ambiguity resolved -- verified by
opening both files). CRLF-safe append, same discipline as lc03-build-specs.py."""
import json

diagrams = [
    {
        "src": "/images/products/oil-field-camp/specifications/oil-field-camp-layout-diagram.webp",
        "alt": "Oil field camp module layout diagram showing the standard narrow-body plan and the wide-body 20 ft two-room arrangement",
        "caption": "Illustrative, not for construction unless approved.",
        "width": 1920,
        "height": 1080,
    },
    {
        "src": "/images/products/oil-field-camp/specifications/oil-field-camp-services-coordination-diagram.webp",
        "alt": "Remote site access and service coordination diagram showing camp modules, crane standing zone and utility routing",
        "caption": "Illustrative, not for construction unless approved.",
        "width": 1920,
        "height": 1080,
    },
]

fragment = json.dumps(diagrams, indent=2, ensure_ascii=False)
lines = fragment.split("\n")
reindented = "\n".join(("      " + l) if l.strip() else l for l in lines)
reindented_crlf = reindented.replace("\n", "\r\n")

with open("src/data/products/c06-specifications.json", "rb") as f:
    raw = f.read().decode("utf-8")

# oil-field-camp is the last entry in the file; its own specifications/narrative
# block ends right before the file's closing braces.
OLD_TAIL = 'second."\r\n      }\r\n  }\r\n}\r\n'
assert raw.endswith(OLD_TAIL), "tail did not match, aborting to avoid corrupting the file"
NEW_TAIL = (
    'second.",\r\n'
    '      "diagrams": ' + reindented_crlf.strip() + '\r\n'
    '    }\r\n  }\r\n}\r\n'
)
raw = raw[: -len(OLD_TAIL)] + NEW_TAIL

with open("src/data/products/c06-specifications.json", "wb") as f:
    f.write(raw.encode("utf-8"))

json.load(open("src/data/products/c06-specifications.json", encoding="utf-8"))  # validate
print("added diagrams[] to oil-field-camp, valid JSON")
