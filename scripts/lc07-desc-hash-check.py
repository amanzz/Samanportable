# -*- coding: utf-8 -*-
"""Verify DESCRIPTION_TAB's SHA-256 per the copy pack's own hashing rule:
markdown link syntax reduced to anchor text, whitespace collapsed to single
spaces, bullet lists joined with ' | ' between items."""
import hashlib
import re

RAW = open("scripts/lc07-description-raw.md", encoding="utf-8").read().rstrip("\n")
want = "fbde1aca4db8a113b37e4fbbd5d6df16651fecfb807fc12ac08bffc3466dbb9c"
print("chars (raw, trailing newline stripped):", len(RAW))

def try_variant(name, text):
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()
    print("%-45s chars=%-6d sha256=%s  %s" % (name, len(text), h, "MATCH" if h == want else ""))
    return h == want

# variant A: links -> anchor text, whitespace collapsed, no bullet join
v = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", RAW)
va = re.sub(r"\s+", " ", v).strip()
if try_variant("A: links+whitespace collapsed", va):
    raise SystemExit

# variant B: same as A, but bullet list lines ('- ...') joined with ' | ' per
# contiguous block before whitespace collapsing
lines = RAW.split("\n")
out_lines = []
i = 0
while i < len(lines):
    if lines[i].strip().startswith("- "):
        block = []
        while i < len(lines) and lines[i].strip().startswith("- "):
            block.append(lines[i].strip()[2:].strip())
            i += 1
        out_lines.append(" | ".join(block))
    else:
        out_lines.append(lines[i])
        i += 1
vb_raw = "\n".join(out_lines)
vb_raw = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", vb_raw)
vb = re.sub(r"\s+", " ", vb_raw).strip()
try_variant("B: + bullets joined with ' | '", vb)
