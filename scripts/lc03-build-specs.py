# -*- coding: utf-8 -*-
"""Build the oil-field-camp entry for c06-specifications.json and splice it in
surgically (append as a new top-level product key), so every other entry's
formatting stays byte-identical."""
import json

TABLE1 = [
    ("Bottom frame", "IS 2062 or approved equivalent MS channel, RHS or formed sections; member sizes and support reactions from the signed structural drawing"),
    ("Bottom stiffeners", "RHS, channel or angle stiffeners set to the approved floor grid, partitions, bunks and relocation duty"),
    ("Floor frame", "Heavy-duty lift-and-carry skid chassis with two runner beams and reinforced cross-members; skid reactions, lift points and deck supports shown on the transport drawing"),
    ("Top frame", "MS RHS or channel upper perimeter ring sized for roof reactions, wall restraint and opening headers"),
    ("Roof stiffeners", "RHS or formed roof members supporting a nominal 60 mm class insulated roof panel"),
    ("Corner posts and walls", "Welded MS or RHS corner posts and rails tied directly into the skid, with local reinforcement at door, AC, service and wet-room openings"),
    ("Lifting and handling", "Marked lifting lugs, corner fittings, skid points or transport brackets, only where shown on the signed GA and lifting drawing"),
    ("Welding and fabrication", "IS 2062 or IS 1161 class structural steel or approved equivalent; weld sizes, bolt grades and joint details per the fabrication drawings"),
    ("Exterior walls", "Nominal 60 mm PUF or approved insulated panel with PPGI or prepainted faces; external service entries protected by glands and hoods"),
    ("Roof", "PPGI or PPGL outer roof with nominal 60 mm PUF or approved insulated sandwich construction, sealed laps, protected penetrations"),
    ("Wall insulation", "Nominal 60 mm PUF; alternate mineral wool or PIR system by fire and climate brief"),
    ("Roof insulation", "Nominal 60 mm insulated roof or higher project-selected build-up with condensation and vapour control"),
    ("Floor base", "Steel-supported cement board or heavy structural deck for dry sleepers; cementitious waterproof substrate in wet modules"),
    ("Painting and coating", "Prepared carbon steel with compatible primer and top coats, or galvanized and pre-painted sheet with repaired cut edges; system upgraded for coastal, industrial or wet-service exposure"),
    ("Fasteners and sealing", "Corrosion-compatible fasteners, EPDM washers, butyl or PU sealants, closures, flashing, sleeves and isolation tapes matched to the selected build-up"),
]

TABLE2 = [
    ("Interior walls", "Prelaminated, PPGI or cement-board class liner in dry rooms; FRP, PVC or cementitious wet liner in toilet and shower modules only"),
    ("Ceiling", "PUF panel underside or durable liner below roof insulation, with removable access at cable, AC and exhaust interfaces"),
    ("Floor finish", "Heavy commercial vinyl or project-selected resilient finish in dry areas; slip-resistant wet finish with coved or upstand details in sanitation zones"),
    ("Doors", "Weather-sealed steel or insulated doors, heavy hinges, positive latching, reinforced frames; additional emergency or service doors per the approved room plan"),
    ("Windows", "Aluminium windows with mesh or grille, optional storm or security shutters; glazing area chosen against daylight, heat gain, privacy and site risk"),
    ("Grilles and mesh", "Removable mosquito mesh, louvres, restrictors or protected MS grilles only where the approved opening schedule requires them"),
    ("Electrical wiring", "FR or FRLS copper in approved conduit or trunking; typical references 1.5 sq mm lighting, 2.5 sq mm sockets, 4 sq mm AC and high-load; final sizing per the project electrical schedule"),
    ("Electrical protection", "Main isolator, MCB, RCBO or RCCB protection, labelled neutral and earth bars, bonding, and surge protection where required"),
    ("Electrical fittings", "LED luminaires, fan points, 6A and 16A sockets, exhaust points and dedicated equipment outlets, in the quantities on the approved schedule"),
    ("Ventilation and AC", "Split or package AC provision sized from remote heat load. Normal-area equipment in the base module. Ex equipment or interfaces only where the client hazardous-area classification requires it"),
    ("Plumbing and sanitary", "WC, shower, basin or pantry manifolds, water tank and pump, uPVC waste and vent, protected external stubs, for designated variants only. Dry crew sleepers carry no plumbing"),
    ("Layout and configuration", "Crew sleeper, toolpusher or officer, and wide-body two-room configurations, per the published size schedule"),
    ("Quality checks", "Dimensional, member, weld and bolt, coating, panel, roof-drainage, opening, electrical and plumbing checks, plus deployment checks"),
    ("Warranty", "5-year structural and 1-year finishing as standard; finishing extendable to 2 years on request, confirmed at quotation"),
    ("Delivery and tax", "7 to 21 working days; fixed-price quotation in 48 hours; prices ex-GST, GST 18%, HSN 9406"),
    ("Excluded scope", "Ex-rated equipment, gas detection, blast and fire engineering, process interfaces, hazardous-area certification, sanitary tanks, transport, craneage, foundations, site infrastructure, statutory approvals, commissioning"),
]

NARRATIVE = (
    "Two lines in these tables change more for a buyer than the rest combined. The first is the floor frame: "
    "a lift-and-carry skid with runner beams is what makes the building relocatable, and it is why the "
    "transport drawing, not the floor plan, governs how the unit may be handled. The second is ventilation "
    "and AC: the base module is normal-area, so a location with a classified hazardous area needs a separate "
    "engineered package, priced against your own classification document. Everything else in Table 1 "
    "supports the first of those, and most of Table 2 supports the second."
)

specifications = []
for component, detail in TABLE1:
    specifications.append({"group": "Structure, Chassis and Envelope", "component": component, "detail": detail, "differsFromHub": True})
for component, detail in TABLE2:
    specifications.append({"group": "Interior, Services, Scope and Commercial Terms", "component": component, "detail": detail, "differsFromHub": True})

entry = {
    "name": "Oil Field Camp",
    "specifications": specifications,
    "narrative": NARRATIVE,
    # diagrams intentionally OMITTED -- both HELD pending reissue (ticket s6, Tab 2).
}

fragment = json.dumps({"oil-field-camp": entry}, indent=2, ensure_ascii=False)
# strip the outer {...} so it's just `"oil-field-camp": {...}` at 4-space indent,
# matching the file's existing per-entry indentation.
inner = fragment.strip()
inner = inner[1:-1].strip()  # drop outer braces
# re-indent from 2-space (json.dumps default here used indent=2 relative to a
# 0-indent root) to the file's 4-space product-entry indent
lines = inner.split("\n")
reindented = "\n".join(("    " + l) if l.strip() else l for l in lines)

# binary read/write throughout -- the file is CRLF, and Python's default text
# mode newline translation would rewrite every line ending (LF only), making
# git see the whole file as changed instead of just the appended entry.
with open("src/data/products/c06-specifications.json", "rb") as f:
    raw = f.read().decode("utf-8")

OLD_TAIL = "      ]\r\n    }\r\n  }\r\n}\r\n"
assert raw.endswith(OLD_TAIL), "tail did not match, aborting to avoid corrupting the file"
reindented_crlf = reindented.replace("\n", "\r\n")
NEW_TAIL = "      ]\r\n    },\r\n" + reindented_crlf + "\r\n  }\r\n}\r\n"
raw = raw[: -len(OLD_TAIL)] + NEW_TAIL

with open("src/data/products/c06-specifications.json", "wb") as f:
    f.write(raw.encode("utf-8"))

json.load(open("src/data/products/c06-specifications.json", encoding="utf-8"))  # validate
print("appended oil-field-camp: %d Table1 rows, %d Table2 rows, valid JSON" % (len(TABLE1), len(TABLE2)))
