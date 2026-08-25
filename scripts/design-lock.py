#!/usr/bin/env python3
"""
Design lock. Compares the rendered page against the porta-cabins reference
and fails on any styling the reference does not use.

Premise: a locked template means the new page may introduce NEW DATA but
never NEW CLASS NAMES and never NEW INLINE STYLES. A class on the new page
that is absent from the reference means a component was written, not reused.

Usage: python3 scripts/design-lock.py <preview-url> <reference-url>
"""
import re, sys, urllib.request
from collections import Counter

NEW_URL, REF_URL = sys.argv[1], sys.argv[2]

def fetch(u):
    req = urllib.request.Request(u, headers={"User-Agent": "saman-design-lock"})
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")

def classes(html):
    out = Counter()
    for attr in re.findall(r'class="([^"]*)"', html) + re.findall(r"class='([^']*)'", html):
        for c in attr.split():
            out[c] += 1
    return out

def inline_styles(html):
    return re.findall(r'style="([^"]*)"', html) + re.findall(r"style='([^']*)'", html)

def tags(html):
    return Counter(t.lower() for t in re.findall(r"<([a-zA-Z][a-zA-Z0-9]*)", html))

new, ref = fetch(NEW_URL), fetch(REF_URL)
fails = []

cnew, cref = classes(new), classes(ref)
novel = sorted(set(cnew) - set(cref))
if novel:
    fails.append(f"{len(novel)} class name(s) not present on the reference page")
    for c in novel[:60]:
        fails.append(f"    new class: {c}   (used {cnew[c]}x)")
    if len(novel) > 60:
        fails.append(f"    ... and {len(novel) - 60} more")

snew, sref = set(inline_styles(new)), set(inline_styles(ref))
novel_styles = sorted(snew - sref)
if novel_styles:
    fails.append(f"{len(novel_styles)} inline style(s) not present on the reference page")
    for s in novel_styles[:20]:
        fails.append(f"    new inline style: {s[:110]}")

tnew, tref = tags(new), tags(ref)
novel_tags = sorted(set(tnew) - set(tref))
if novel_tags:
    fails.append(f"element types not on the reference page: {', '.join(novel_tags)}")

structural = {c for c, n in cref.items() if n > 2}
missing = sorted(structural - set(cnew))
if missing:
    fails.append(f"{len(missing)} structural class(es) from the reference are absent")
    for c in missing[:40]:
        fails.append(f"    missing: {c}   (reference uses it {cref[c]}x)")

print(f"new page : {NEW_URL}")
print(f"reference: {REF_URL}")
print(f"classes  : new {len(cnew)} distinct, reference {len(cref)} distinct")
print(f"inline   : new {len(snew)} distinct, reference {len(sref)} distinct")
if fails:
    print(f"\nDESIGN LOCK FAILURES ({len([f for f in fails if not f.startswith('    ')])}):")
    for f in fails:
        print(("  " + f) if not f.startswith("    ") else f)
    sys.exit(1)
print("\nDESIGN LOCK PASSED: no new class, no new inline style, no new element type,")
print("and every structural class from the reference is present.")
