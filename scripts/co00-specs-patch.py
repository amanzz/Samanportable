# -*- coding: utf-8 -*-
"""CO-00 Tab 2 Specifications: replace the container-offices entry in
c04-specifications.json with the new 16+14-row two-table structure, verbatim
from CO-00-container-offices-draft-v1.2.md lines 430-478. Scoped text splice
so every other entry in the shared file stays byte-identical."""
import json

TABLE1_GROUP = "Structure, envelope, roof and floor"
TABLE2_GROUP = "Finish, openings, electrical, services and scope"

TABLE1 = [
    ("Bottom frame", "Primary structural base", "150×75×5 mm MS C-channel", "Product"),
    ("Bottom stiffeners", "Secondary base / bracing", "100×50×4 mm channels and 80×40×3 mm MS tubular members", "Product"),
    ("Floor frame", "Floor support / foundation interface", "100×50×3 mm primary and 80×40×3 mm secondary floor members", "Product"),
    ("Top frame", "Upper perimeter / primary member", "80×40×3 mm MS top perimeter", "Product"),
    ("Roof stiffeners", "Roof frame / secondary member", "60×40×2.5 mm rafters and 50×50×2.5 mm purlins", "Product"),
    ("Corner posts / walls", "Vertical / wall frame", "60×60×3 mm corner posts and 50×50×3 mm intermediate posts", "Product"),
    ("Lifting / handling", "Approved handling provision", "Designed MS lifting hooks or lugs matched to the completed unit weight; handle only by the approved lifting and support-point drawing.", "Common"),
    ("Welding & fabrication", "Fabrication control", "Welded MS fabrication with cleaned joints, safe edges, dimensional inspection and coating touch-up before panel closure and dispatch.", "Common"),
    ("Exterior walls", "External wall / enclosure", "1.25–1.6 mm corrugated MS sheet", "Product"),
    ("Roof", "Roof sheet / system", "1.6 mm corrugated MS sheet", "Product"),
    ("Interior walls", "Internal lining / partition", "12 mm plywood with 0.8–1.0 mm laminate and selected HPL feature panels", "Product"),
    ("Ceiling", "Ceiling / roof underside", "12.5 mm gypsum or premium laminated ceiling", "Product"),
    ("Floor base", "Structural floor / slab", "19 mm marine-grade plywood or 18 mm Bison panel", "Product"),
    ("Floor finish", "Finished walking surface", "5–6 mm SPC or 3–4 mm LVT flooring", "Product"),
    ("Wall insulation", "Thermal / acoustic layer", "75 mm mineral wool", "Product"),
    ("Roof insulation", "Roof thermal layer", "100 mm glass wool or mineral wool", "Product"),
]
assert len(TABLE1) == 16, len(TABLE1)

TABLE2 = [
    ("Decorative / external finish", "Coating / façade finish", "Standard anti-rust enamel exterior finish in an approved colour combination.", "Product"),
    ("Fasteners & sealing", "Approved joints and seals", "Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it.", "Common"),
    ("Main door / service door", "Door assembly", "Premium insulated/laminated door with closer and upgraded lockset", "Product"),
    ("Windows / service opening", "Opening package", "Large powder-coated aluminium windows with 6 mm tinted glass", "Product"),
    ("Grills / mosquito mesh", "Opening protection", "Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it.", "Product"),
    ("Electrical wiring", "Copper wiring and containment", "Concealed PVC-insulated copper wiring, typically 1.5 sq.mm lighting, 2.5 sq.mm sockets and 4 sq.mm higher-load or AC circuits, subject to the final load schedule.", "Common"),
    ("Electrical protection", "DB / MCB / RCCB / earthing", "Distribution board with MCB/RCCB protection, earthing and segregation of lighting, socket, wet-area and AC circuits according to the approved electrical drawing.", "Common"),
    ("Electrical fittings", "Lights, sockets and equipment points", "LED lights, computer/data points, UPS provision, multiple 6A/16A sockets, fan points and dedicated AC circuit.", "Product"),
    ("Ventilation / AC", "Ventilation and comfort services", "Cross ventilation with wall/ceiling fans and split-AC provision.", "Product"),
    ("Plumbing / sanitary", "Water, waste and sanitary interface", "Not included unless shown in the approved scope.", "Product"),
    ("Layout / configuration", "Product-specific planning", "Office layout with workstations, storage and optional manager or meeting partition.", "Product"),
    ("Painting / coating", "Corrosion-protection system", "One red-oxide primer coat followed by two compatible anti-rust enamel coats on prepared MS surfaces; project exposure may require an upgraded coating system.", "Common"),
    ("Quality checks", "Inspection and testing", "Pre-dispatch checks cover dimensions, member and sheet identification, welds, coating, roof drainage, weather sealing, doors, windows, electrical continuity and functional operation.", "Common"),
    ("Warranty", "Commercially confirmed warranty", "Warranty period and exclusions are confirmed only in the final quotation; relocation damage, misuse, site services and unapproved alterations remain outside the agreed scope.", "Common"),
]
assert len(TABLE2) == 14, len(TABLE2)

NARRATIVE = (
    "What the specification changes for you. Two lines in these tables decide most site "
    "problems. The 150x75x5 mm base frame sets where the module may be supported, so your "
    "plinth positions follow it rather than the other way round. And the electrical line "
    "states starting cable sizes only: the final conductor size comes from your approved "
    "load schedule, which is why we ask for your equipment list before quoting."
)

DIAGRAM_CAPTION = "Illustrative - not for construction."

entry = {
    "name": "Container Offices",
    "sourceSheet": "01 Container Offices",
    "specifications": (
        [{"group": TABLE1_GROUP, "component": c, "detail": t, "scopeClass": s, "meaning": m, "differsFromHub": False}
         for c, t, s, m in TABLE1]
        + [{"group": TABLE2_GROUP, "component": c, "detail": t, "scopeClass": s, "meaning": m, "differsFromHub": False}
           for c, t, s, m in TABLE2]
    ),
    "narrative": NARRATIVE,
    "columnHeaders": {"first": "Component", "second": "Type", "fourth": "Scope"},
    "groupColumnHeaders": {
        TABLE1_GROUP: {"third": "Section / size / thickness"},
        TABLE2_GROUP: {"third": "Specification"},
    },
    "diagrams": [
        {
            "src": "/images/products/container-offices/specifications/co-00-container-offices-dgm1-reference-module-dimensions-16x9.webp",
            "alt": "Plan and long elevation of the 20x10x8.5 ft module with six structural member callouts",
            "caption": DIAGRAM_CAPTION,
            "width": 1920,
            "height": 1080,
        },
        {
            "src": "/images/products/container-offices/specifications/co-00-container-offices-dgm2-selection-decision-tree-16x9.webp",
            "alt": "Four-branch decision tree routing a buyer to the right container office product",
            "caption": DIAGRAM_CAPTION,
            "width": 1920,
            "height": 1080,
        },
    ],
}

assert len(entry["specifications"]) == 30

body = json.dumps(entry, indent=2, ensure_ascii=False)
# re-indent from 0-base to the file's existing 4-space nesting for this key
indented = "\n".join(("    " + line if line.strip() else line) for line in body.split("\n"))
# first line already gets the opening brace glued to the key by the splice below
indented = indented.lstrip()

data = open("src/data/products/c04-specifications.json", encoding="utf-8").read()
start = data.index('"container-offices": {')
end = data.index('"container-office-cabin": {')
# end points to the start of the next key; back up to just after the previous entry's comma+newline
prefix = data[:start]
suffix = data[end:]
new_block = '"container-offices": ' + indented + ",\n    "
new_data = prefix + new_block + suffix

open("src/data/products/c04-specifications.json", "w", encoding="utf-8", newline="\n").write(new_data)

# Verify: valid JSON, round-trips, entry present with 30 rows
check = json.load(open("src/data/products/c04-specifications.json", encoding="utf-8"))
co = check["products"]["container-offices"]
print("rows:", len(co["specifications"]))
print("groups:", sorted(set(r["group"] for r in co["specifications"])))
print("table1 rows:", sum(1 for r in co["specifications"] if r["group"] == TABLE1_GROUP))
print("table2 rows:", sum(1 for r in co["specifications"] if r["group"] == TABLE2_GROUP))
print("cabin entry intact:", check["products"]["container-office-cabin"]["name"])
print("em dash present:", "—" in new_data)
