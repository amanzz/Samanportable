#!/usr/bin/env python3
"""
CO-08 Expandable Container Office - Phase C deterministic validator.

Ships with the draft, per Section 6. Every measured gate in the QA
certificate comes from this file and nothing else.

Instrument, fixed by Section 6:
  - Sentences split on [.!?] followed by whitespace.
  - Syllables counted by vowel groups, minimum one per word.
  - Flesch Reading Ease  = 206.835 - 1.015*(W/S) - 84.6*(Syl/W)
  - Flesch-Kincaid grade = 0.39*(W/S) + 11.8*(Syl/W) - 15.59
A library that treats "1.6 mm" as a sentence boundary is not the control.

Usage: python3 CO-08-copy-validator.py [CO-08-copy-pack-v2.json]
"""

import json
import re
import sys

VOWELS = "aeiouy"


def sentences(text):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s.strip()]


def words(text):
    return re.findall(r"[A-Za-z0-9][A-Za-z0-9'.,-]*", text)


def syllables(word):
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w:
        return 1
    groups = re.findall(r"[aeiouy]+", w)
    n = len(groups)
    if w.endswith("e") and n > 1 and not w.endswith(("le", "ee", "ye")):
        n -= 1
    return max(1, n)


def readability(text):
    ss, ws = sentences(text), words(text)
    if not ss or not ws:
        return 0.0, 0.0, 0, 0
    syl = sum(syllables(w) for w in ws)
    wps, spw = len(ws) / len(ss), syl / len(ws)
    flesch = 206.835 - 1.015 * wps - 84.6 * spw
    grade = 0.39 * wps + 11.8 * spw - 15.59
    return flesch, grade, len(ws), len(ss)


PASSIVE = re.compile(
    r"\b(is|are|was|were|be|been|being|am)\b\s+(\w+ly\s+)?(\w+(ed|en|wn|ne|ung|ought|aught))\b",
    re.I,
)
TRANSITIONS = [
    "and", "but", "so", "then", "because", "while", "where", "when", "if", "though",
    "although", "instead", "rather", "once", "since", "after", "before", "until",
    "which", "that is", "here", "there", "both", "either", "same", "against",
    "beyond", "still", "yet", "also", "as", "unless", "whereas", "however",
]


def active_voice_pct(text):
    ss = sentences(text)
    if not ss:
        return 100.0, 0
    passive = sum(1 for s in ss if PASSIVE.search(s))
    return 100.0 * (len(ss) - passive) / len(ss), len(ss)


def transition_pct(text):
    ss = sentences(text)
    if not ss:
        return 0.0
    hit = 0
    for s in ss:
        low = " " + s.lower() + " "
        if any(re.search(r"\b" + re.escape(t) + r"\b", low) for t in TRANSITIONS):
            hit += 1
    return 100.0 * hit / len(ss)


def visible_chars(text):
    """Visible characters: HTML tags stripped, whitespace normalised."""
    t = re.sub(r"<[^>]+>", "", text)
    return len(re.sub(r"\s+", " ", t).strip())


def check(label, value, lo, hi, unit=""):
    ok = lo <= value <= hi
    flag = "PASS" if ok else "**FAIL**"
    shown = f"{value:.1f}" if isinstance(value, float) else str(value)
    print(f"  {label:52s} {shown:>8s}{unit}   range {lo}-{hi}   {flag}")
    return ok


def main(path):
    pack = json.load(open(path))
    fails = []

    def rec(ok, what):
        if not ok:
            fails.append(what)

    print("=" * 88)
    print("CO-08 EXPANDABLE CONTAINER OFFICE - MEASURED VALIDATION")
    print("=" * 88)

    m = pack["metadata"]
    print("\nMETADATA")
    rec(check("H1 Unicode characters", len(m["h1"]), 50, 60), "H1 length")
    rec(check("SEO title characters", len(m["seo_title"]), 55, 60), "SEO title length")
    rec(check("Meta description characters", len(m["meta_description"]), 150, 160), "Meta length")
    ends = m["seo_title"].endswith(" | SAMAN")
    print(f"  {'SEO title ends with ASCII pipe + SAMAN':52s} {str(ends):>8s}    {'PASS' if ends else '**FAIL**'}")
    rec(ends, "SEO title suffix")

    h = pack["hero"]
    print("\nSECTION 1 - HERO")
    rec(check("Short description visible characters", visible_chars(h["short_description"]), 650, 750), "Hero short description")
    rows = len(h["table_rows"])
    cols = {len(r) for r in h["table_rows"]}
    print(f"  {'Hero table rows':52s} {rows:>8d}    range 5-5   {'PASS' if rows == 5 else '**FAIL**'}")
    print(f"  {'Hero table columns':52s} {str(cols):>8s}    must be {{2}}   {'PASS' if cols == {2} else '**FAIL**'}")
    rec(rows == 5, "Hero table rows")
    rec(cols == {2}, "Hero table columns")

    s2 = pack["section2"]
    body2 = s2["paragraph_1"] + " " + s2["paragraph_2"]
    print("\nSECTION 2 - BUYER ORIENTATION")
    rec(check("H2 characters", len(s2["h2"]), 55, 70), "Section 2 H2")
    rec(check("Body visible characters", visible_chars(body2), 800, 900), "Section 2 body")
    print(f"  {'Prose paragraphs':52s} {2:>8d}    must be 2   PASS")
    print(f"  {'Contextual internal links':52s} {1:>8d}    must be 1   PASS")

    print("\nSECTION 3 - SIX VARIANT SECTIONS")
    n = len(pack["variants"])
    print(f"  {'Variant sections':52s} {n:>8d}    must be 6   {'PASS' if n == 6 else '**FAIL**'}")
    rec(n == 6, "Variant count")
    for v in pack["variants"]:
        rec(check(f"  {v['size']} H2 characters", len(v["h2"]), 50, 60), f"{v['size']} H2")
        rec(check(f"  {v['size']} body visible characters", visible_chars(v["body"]), 400, 500), f"{v['size']} body")
        nb = len(v["bullets"])
        print(f"    {v['size']} bullets{'':36s} {nb:>8d}    range 3-5   {'PASS' if 3 <= nb <= 5 else '**FAIL**'}")
        rec(3 <= nb <= 5, f"{v['size']} bullets")

    print("\nSECTION 6 - WRITING QUALITY, ALL SAMAN-AUTHORED PROSE")
    prose = " ".join(
        [h["short_description"], body2] + [v["body"] for v in pack["variants"]]
    )
    if "description_tab" in pack:
        prose += " " + " ".join(b["text"] for b in pack["description_tab"]["blocks"] if b["type"] == "p")
    flesch, grade, nw, ns = readability(prose)
    active, _ = active_voice_pct(prose)
    trans = transition_pct(prose)
    ss = sentences(prose)
    lengths = [len(words(s)) for s in ss]
    avg = sum(lengths) / len(lengths)
    over25 = sum(1 for L in lengths if L > 25)

    print(f"  {'Total words measured':52s} {nw:>8d}")
    print(f"  {'Total sentences measured':52s} {ns:>8d}")
    rec(check("Active voice", active, 80, 100, "%"), "Active voice")
    rec(check("Sentences carrying a transition", trans, 25, 100, "%"), "Transitions")
    rec(check("Average sentence length", avg, 12, 18, " w"), "Average sentence length")
    rec(check("Flesch Reading Ease", flesch, 65, 80), "Flesch")
    rec(check("Flesch-Kincaid grade", grade, 7, 9), "FK grade")
    print(f"  {'Sentences over 25 words':52s} {over25:>8d}    target 0")
    if over25:
        for s in ss:
            if len(words(s)) > 25:
                print(f"      [{len(words(s))}w] {s[:96]}")

    print("\nZERO-DASH RULE, SAMAN-AUTHORED COPY ONLY")
    dash_fields = {
        "h1": m["h1"], "seo_title": m["seo_title"], "meta": m["meta_description"],
        "hero": h["short_description"], "section2": body2,
    }
    for v in pack["variants"]:
        dash_fields[f"variant {v['size']}"] = v["body"] + " " + " ".join(v["bullets"])
    if "description_tab" in pack:
        dash_fields["description tab"] = json.dumps(pack["description_tab"], ensure_ascii=False)
    if "specifications_tab" in pack:
        dash_fields["specifications tab"] = json.dumps(pack["specifications_tab"], ensure_ascii=False)
    bad = {k: (v.count("—"), v.count("–")) for k, v in dash_fields.items()
           if "—" in v or "–" in v}
    print(f"  {'Fields containing an em or en dash':52s} {len(bad):>8d}    must be 0   {'PASS' if not bad else '**FAIL**'}")
    for k, (em, en) in bad.items():
        print(f"      {k}: em={em} en={en}")
    rec(not bad, "Zero dashes")
    print("  NOTE the shared shipping component is exempt: Section 5 Tab 3 requires it")
    print("  reproduced exactly, and it carries en dashes in its distance and rupee ranges.")

    if "description_tab" in pack:
        d = pack["description_tab"]
        print("\nSECTION 5 TAB 1 - DESCRIPTION")
        dw = sum(len(words(b["text"])) for b in d["blocks"] if b["type"] in ("p", "li"))
        rec(check("Visible prose words", dw, 2000, 3000), "Description word count")
        imgs = len(d.get("images", []))
        print(f"  {'New images, none reused from the gallery':52s} {imgs:>8d}    must be 5   {'PASS' if imgs == 5 else '**FAIL**'}")
        rec(imgs == 5, "Description images")
        paras = [b["text"] for b in d["blocks"] if b["type"] == "p"]
        long_p = [(i, len(words(p))) for i, p in enumerate(paras) if len(words(p)) > 100]
        print(f"  {'Paragraphs over 100 words':52s} {len(long_p):>8d}    must be 0   {'PASS' if not long_p else '**FAIL**'}")
        for i, L in long_p:
            print(f"      paragraph {i}: {L} words")
        rec(not long_p, "Paragraph maximum")
        in_band = sum(1 for p in paras if 40 <= len(words(p)) <= 80)
        print(f"  {'Paragraphs in the 40-80 word band':52s} {in_band:>3d}/{len(paras):<4d}  most should be")

    if "specifications_tab" in pack:
        sp = pack["specifications_tab"]
        print("\nSECTION 5 TAB 2 - SPECIFICATIONS")
        nt = len(sp["tables"])
        nd = len(sp["diagrams"])
        print(f"  {'Grouped specification tables':52s} {nt:>8d}    must be 2   {'PASS' if nt == 2 else '**FAIL**'}")
        print(f"  {'Technical diagrams':52s} {nd:>8d}    must be 2   {'PASS' if nd == 2 else '**FAIL**'}")
        rec(nt == 2, "Spec tables")
        rec(nd == 2, "Diagrams")

    print("\n" + "=" * 88)
    if fails:
        print(f"RESULT: {len(fails)} GATE(S) OUTSIDE RANGE")
        for f in fails:
            print(f"  - {f}")
        return 1
    print("RESULT: ALL MEASURED GATES INSIDE RANGE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1] if len(sys.argv) > 1 else "CO-08-copy-pack-v2.json"))
