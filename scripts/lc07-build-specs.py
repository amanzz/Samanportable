# -*- coding: utf-8 -*-
"""Build the ablution-block entry for c06-specifications.json and splice it in
surgically (append as a new top-level product key), CRLF-safe, matching the
LC-03 precedent for this file."""
import json

NARRATIVE = (
    "Read these two tables as one decision rather than two lists. The first table sets what the "
    "building is: the frame that carries wet loads and lifting, and the envelope that has to stay "
    "washable and keep water out of insulation and steel. The second sets how it works day to day: "
    "the openings that give privacy and airflow, the manifold you will isolate and maintain, and the "
    "boundary where SAMAN's supply stops. Where a line says the final value follows the approved "
    "drawing, that is not evasion. It means the value is set for your site rather than assumed here."
)

# (component, material_type, specification, what_it_changes)
TABLE1 = [
    ("Bottom frame", "Labour-colony structural base / module support frame", "IS 2062 or approved equivalent MS channel, RHS or formed sections; member sizes and support reactions from the signed structural drawing", "Anchor position, corrosion access and allowable bearing are frozen before fabrication"),
    ("Bottom stiffeners", "Secondary floor and wall support members", "RHS, channel or angle stiffeners selected to the approved floor grid, partitions, wet services and relocation duty", "Spacing is coordinated with board edges, cubicle partitions and openings; site cutting needs approval"),
    ("Floor frame", "Wet-block floor support frame", "Corrosion-protected MS, RHS or channel floor grid with local cross-members around WC pans, shower trays, partitions, tanks and service penetrations; slab base where site-built", "Penetrations are planned before fabrication so primary members are not cut on site"),
    ("Top frame", "Upper perimeter / eave support frame", "MS RHS or channel, or the documented proprietary upper rail, sized for roof reactions, wall restraint and opening headers", "Tank, solar, exhaust or service-platform reactions are added only after project engineering"),
    ("Roof stiffeners", "Ablution roof / vent-service framing", "RHS or formed roof members supporting the insulated PPGI roof, with framed and sealed openings for soil vent stacks, exhaust fans and service entries where specified", "All penetrations use curbs and flashings and stay maintainable"),
    ("Corner posts / walls", "Cubicle and service-wall structural frame", "MS or RHS external frame plus corrosion-resistant partition supports, reinforced at manifold, fixture, door and grab-bar positions", "Valves and traps stay serviceable; accessibility supports are structural, not fixed to thin liner"),
    ("Lifting / handling", "Approved lifting, unloading and repositioning provisions", "Marked lifting lugs, corner fittings, skid points or transport brackets only where the signed GA and lifting drawing show them", "The lift plan sets finished weight, centre of gravity and support points"),
    ("Welding & fabrication", "Controlled welded and bolted fabrication", "IS 2062 / IS 1161 class structural steel or approved equivalent; weld sizes, bolt grades and joint details as the fabrication drawings", "Certified WPS, PQR and NDT are supplied only where the contract or QA plan specifies them"),
    ("Exterior walls", "Wet-area wall envelope", "Nominal 50 mm PUF/PPGI panel, or MS frame with moisture-resistant cement, FRP or PVC liner; cut edges and panel bases protected from persistent wetting", "The assembly is washable and resists splash and cleaning water"),
    ("Roof", "Insulated wet-block roof", "PPGI or PPGL insulated roof with defined slope, gutters and sealed vent and exhaust penetrations; vapour and condensation treatment to project climate", "Roof drainage is separate from sanitary drainage; humid exhaust discharges outside"),
    ("Interior walls", "Sanitary internal wall finish", "FRP or PVC sheet, glazed or tiled cementitious board, prefinished metal or another washable moisture-tolerant liner with sealed corners and service access", "Chosen for disinfectant compatibility and easy replacement; concealed pipe zones get access panels"),
    ("Ceiling", "Moisture-resistant ceiling", "FRP, PVC, cement board or coated metal with sealed penetrations and access to exhaust, traps or valves where applicable", "Withstands humidity and cleaning without exposed absorbent surfaces"),
    ("Floor base", "Waterproof ablution floor base", "18-24 mm cement or cement-fibre board, or RCC / cementitious substrate, with waterproof membrane, perimeter upstand and positive fall to trapped drains", "Membrane continuity is held at pan collars, shower outlets and wall junctions; wet testing before final finish where the method allows"),
    ("Floor finish", "Slip-resistant sanitary floor finish", "Safety vinyl, anti-skid ceramic or porcelain tile, FRP pan or approved wet-area finish with sealed coved and upstand edges", "Falls and thresholds prevent ponding into dry circulation"),
    ("Wall insulation", "Moisture-protected wall insulation", "Closed-cell PUF or PIR class, or protected mineral-wool system behind a wet-area liner; cores and edges isolated from direct water", "Helps condensation control; waterproofing comes from the wet-side assembly, not the insulation"),
    ("Roof insulation", "Roof insulation and condensation control", "Insulated roof panel or approved vapour-controlled insulation with a mechanically or naturally ventilated wet space", "Whole-roof thermal claims require the exact assembly"),
    ("External interfaces", "Water, sewer and cleaning interfaces", "Single or multiple water inlet, manifold isolation, sewer or holding-tank outlet, vent termination, cleaning hose point, external signage and service access per the approved schematic", "Tanks, pumps, STP, septic and buried networks stay separate unless quoted"),
    ("Fasteners & sealing", "Weather, wet-service and panel-joint sealing system", "Corrosion-compatible fasteners, EPDM washers, butyl or PU sealants, closures, flashing, sleeves and isolation tapes matched to the selected build-up", "Joints drain outward, stay cleanable and allow maintenance; field drilling is deburred and resealed"),
]

TABLE2 = [
    ("Cubicle and service doors", "Privacy cubicle and service doors", "Corrosion-resistant cubicle doors and partitions plus an external entrance or service door; privacy latch, ventilation gap and durable wet-area hardware", "Clearances preserve cleaning and emergency assistance; accessible cubicles follow project-required openings"),
    ("Windows / service opening", "High-level privacy ventilation openings", "High-level louvres or frosted windows with insect protection, plus mechanical exhaust openings sized to wet load and privacy requirement", "Openings avoid direct sightlines while supporting airflow"),
    ("Grills / mosquito mesh", "Security grille, insect screen and privacy accessories", "Removable mesh, louvres, restrictors, privacy screens or protected MS grilles only where room use and the approved opening schedule require", "Ventilation, cleaning access and emergency escape are maintained"),
    ("Electrical wiring", "Copper wiring and labelled containment", "Typical references 1.5 sq mm lighting, 2.5 sq mm sockets, 4 sq mm high-load; final sizing follows connected load, voltage drop and protection coordination", "FR/FRLS copper in conduit, separated from water and waste routes"),
    ("Electrical protection", "Distribution, residual-current protection and earthing", "Main isolator, MCB / RCBO or RCCB protection, labelled neutral and earth bars, bonding, surge protection where required", "Frame and exposed conductive parts bond to the tested site earth; this workbook does not certify the installation"),
    ("Electrical fittings", "Fixed lights, fans, sockets and service points", "LED luminaires, fan points, 6A/16A sockets, exhaust points and emergency lighting only in the quantities on the approved schedule", "Loose appliances, AC units and DG or UPS equipment are excluded unless itemised"),
    ("Ventilation", "Continuous wet-area exhaust strategy", "Natural high-level ventilation supplemented by exhaust fans and ducts as needed; quantity and airflow sized from cubicle and shower load against room volume", "Air-change values and controls are project decisions, not workbook values"),
    ("Plumbing / sanitary", "Multi-fixture plumbing manifold", "CPVC or PPR supply, uPVC soil, waste and vent, isolation by bank, WCs, urinals, basins and showers per the fixture schedule, floor drains, traps and external sewer or holding-tank connection", "Fixture count is not inferred from area; tender and applicable site rules set ratios, gender split and storage"),
    ("Layout / configuration", "Ablution bank and maintenance layout", "Repeated toilet, shower and basin banks with dry entry, privacy segregation, central or service-side pipe access and cleaning circulation; accessible cubicle where the project requires it", "Resolves headcount, shifts, gender, pressure, drainage level and maintenance access; distinct from a single attached-toilet cabin"),
    ("Painting / coating", "Corrosion protection and external finish", "Prepared carbon steel with compatible primer and top coats, or galvanized / pre-painted sheet with repaired cut edges; upgraded for coastal, industrial or wet-service exposure", "Skid undersides, roof drains, cut edges and wet thresholds govern field durability"),
    ("Quality checks", "Factory and site QA and handover evidence", "Dimensional, member, weld and bolt, coating, panel, roof-drainage, opening, electrical and plumbing checks plus wet-test checks", "Handover evidence identifies the approved GA, BOM, test records and maintenance points"),
    ("Warranty", "Contract-controlled warranty and maintenance obligations", "Period, start date, remedy, relocation conditions, consumables and exclusions exactly as the signed quotation and handover documents state", "Site foundations, utilities, misuse, blocked drains and missed maintenance remain excluded unless expressly covered"),
]

specifications = []
for component, material_type, spec, changes in TABLE1:
    specifications.append({
        "group": "Structure, Envelope, Floor and Insulation",
        "component": component, "detail": material_type,
        "scopeClass": spec, "meaning": changes, "differsFromHub": True,
    })
for component, material_type, spec, changes in TABLE2:
    specifications.append({
        "group": "Openings, Services, Layout, Finish and Handover",
        "component": component, "detail": material_type,
        "scopeClass": spec, "meaning": changes, "differsFromHub": True,
    })

entry = {
    "name": "Multi-Toilet Ablution Block",
    "specifications": specifications,
    "narrative": NARRATIVE,
    "columnHeaders": {
        "first": "Component", "second": "Material / Type",
        "third": "Specification", "fourth": "What It Changes for the Buyer",
    },
    "diagrams": [
        {
            "src": "/images/products/ablution-block/specifications/ablution-block-bank-layout-diagram.webp",
            "alt": "Ablution block bank layout diagram showing the central pipe duct, dry entry and cleaning circulation",
            "caption": "Illustrative - not for construction unless approved.",
            "width": 1920, "height": 1080,
        },
        {
            "src": "/images/products/ablution-block/specifications/ablution-block-wet-service-section-diagram.webp",
            "alt": "Wet-service section diagram showing floor fall to a trapped drain, vent stack and exhaust discharge",
            "caption": "Illustrative - not for construction unless approved.",
            "width": 1920, "height": 1080,
        },
    ],
}

with open("src/data/products/c06-specifications.json", "rb") as f:
    raw = f.read().decode("utf-8")

fragment = json.dumps({"ablution-block": entry}, indent=2, ensure_ascii=False)
inner = fragment.strip()[1:-1].strip()
lines = inner.split("\n")
reindented = "\n".join(("    " + l) if l.strip() else l for l in lines)
reindented_crlf = reindented.replace("\n", "\r\n")

OLD_TAIL = "\r\n  }\r\n}\r\n"
assert raw.endswith(OLD_TAIL), "tail did not match, aborting to avoid corrupting the file"
NEW_TAIL = ",\r\n" + reindented_crlf + "\r\n  }\r\n}\r\n"
raw = raw[: -len(OLD_TAIL)] + NEW_TAIL

with open("src/data/products/c06-specifications.json", "wb") as f:
    f.write(raw.encode("utf-8"))

json.load(open("src/data/products/c06-specifications.json", encoding="utf-8"))
print("appended ablution-block: %d Table1 rows, %d Table2 rows, valid JSON" % (len(TABLE1), len(TABLE2)))
