# -*- coding: utf-8 -*-
"""CO-00 Tab 1 Description: convert the verbatim draft markdown (Section D /
Tab 1 of CO-00-container-offices-draft-v1.2.md) to HTML matching the sibling
descriptionHtml idiom (h2/h3/p/table/ul/img/FAQ h4+strong), inserting the two
Section-7 links at their named anchor phrases and the size-ladder table with
the same values as Section 2's price table. No copy is added, removed or
reworded -- transcription only."""
import json
import re

IMAGES = {r["slot"]: r for r in json.load(open("scripts/co00-image-report.json", encoding="utf-8"))}


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def img_tag(desc_slot_suffix):
    key = next(k for k in IMAGES if k.startswith("description-") and desc_slot_suffix in k)
    r = IMAGES[key]
    return (f'<img src="{r["out"]}" width="{r["w"]}" height="{r["h"]}" loading="lazy" '
            f'alt="{esc(r["alt"])}">')


SIZE_TABLE_ROWS = [
    ("10x10x8.5 ft", "100 sq.ft.", "Rs 1,667.50", "Rs 1,66,750"),
    ("20x8x8.5 ft", "160 sq.ft.", "Rs 1,595.00", "Rs 2,55,200"),
    ("20x10x8.5 ft", "200 sq.ft.", "Rs 1,450.00", "Rs 2,90,000"),
    ("30x10x8.5 ft", "300 sq.ft.", "Rs 1,392.00", "Rs 4,17,600"),
    ("40x8x8.5 ft", "320 sq.ft.", "Rs 1,377.50", "Rs 4,40,800"),
    ("40x10x8.5 ft", "400 sq.ft.", "Rs 1,377.50", "Rs 5,51,000"),
]

size_table_html = (
    "<table><thead><tr><th>Size</th><th>Area</th><th>Rate per sq.ft.</th><th>Price ex-GST</th></tr></thead><tbody>"
    + "".join(f"<tr><td>{esc(a)}</td><td>{esc(b)}</td><td>{esc(c)}</td><td>{esc(d)}</td></tr>" for a, b, c, d in SIZE_TABLE_ROWS)
    + "</tbody></table>"
)

LINK_SITE_OFFICE = ('<a href="https://www.samanportable.com/product/container-offices/site-office-container">'
                     'our site office container</a>')
LINK_CABIN = ('<a href="https://www.samanportable.com/product/container-offices/container-office-cabin">'
              'the container office cabin</a>')

FAQS = [
    ("What does a container office cost in India?",
     "Our published rate is Rs 1,450 per square foot at the 200 sq.ft. reference size, with a premium below "
     "that area and a reduction above it. A 20x10 ft module is Rs 2,90,000 before GST. Those are workbook "
     "rates for the standard specification. Your signed quote sets the final figure."),
    ("Is this an ISO-certified shipping container?",
     "No. The modules on this page are fabricated to a container form factor. We do not claim ISO 668 "
     "compliance, CSC plate approval or stackability for them without project-specific evidence. If you "
     "need a genuine converted freight shell, that is a different product and we build it."),
    ("Can it be moved again later?",
     "Yes, from the approved lifting points, on a suitable vehicle. Repeated relocation is harder on the "
     "base and the coating than a single delivery. So tell us at enquiry stage if the module will move "
     "several times. We specify it differently."),
    ("How long does delivery take?",
     "It depends on the size, the fit-out and the current works load. We confirm it in your quote rather "
     "than publish a figure we cannot hold for every order."),
    ("What is the warranty?",
     "The warranty period and its exclusions are confirmed in your final quote. Relocation damage, misuse, "
     "site utilities and unapproved alterations sit outside it. Every container office we build carries "
     "the same pre-dispatch checks listed above, whichever size you order."),
]

# --- Body sections, transcribed verbatim from the draft (paragraphs as read
# directly from CO-00-container-offices-draft-v1.2.md lines 216-405). ---

SECTIONS_HTML = []

def h2(t): SECTIONS_HTML.append(f"<h2>{esc(t)}</h2>")
def h3(t): SECTIONS_HTML.append(f"<h3>{esc(t)}</h3>")
def p(t): SECTIONS_HTML.append(f"<p>{esc(t)}</p>")
def raw(t): SECTIONS_HTML.append(t)

h2("What a container office is, and what it is not")
p("A container office is a steel office module. We build it on a welded mild steel frame, clad it, insulate it, wire it and finish it inside our works. It arrives as a finished room on a truck. You lift it onto a prepared base and connect the power.")
p("That is not the same thing as a shipping container with a door cut into it. Most modules on this page are fabricated from new steel to a container form factor. They borrow the proportions, the corner castings and the handling method. They do not start life carrying freight.")
p("The difference matters commercially. A fabricated module gives you a clean shell, a known steel history and openings framed where you want them. A converted freight shell gives you the genuine article, with the provenance some clients ask for. Both are honest choices, and we build both.")

h2("The six configurations, and how the rate moves with area")
p("We publish six footprints. They run from 100 to 400 square feet, and they cover the great majority of what sites actually order. Each one is the same controlled platform. What changes is the floor area, the opening schedule and how the inside can be divided.")
p("Our rate is calculated from the 20x10 ft module at 200 square feet. Below that size the rate per square foot rises, because the fixed content of a module does not shrink with the floor. A door, a distribution board, a frame and a coating system cost roughly the same at 100 square feet as at 200. Above 200 square feet the rate falls, for the same reason in reverse.")
raw(size_table_html)
raw('<p><em>Rates are workbook-controlled budgetary figures, ex-GST. The signed quote governs.</em></p>')
raw('<p><strong>Why this is a table and not prose.</strong> Six sizes, each with an area, a rate and a price, is a three-variable comparison the buyer scans rather than reads. Written as sentences it forces the reader to hold five numbers in memory to compare the sixth. This is the only table in the Description tab, and the specification tables in Tab 2 are not repeated here.</p>')
p("So the cheapest module is not the cheapest office. Work out your occupancy first, then read the rate. A buyer who needs three desks and orders a 20x8 to save money usually orders a second unit within the year.")
raw(img_tag("ld03"))

h2("Which container office product actually fits your project")
p("This page sells the standard fabricated office. Four other decisions can pull you off it, and it is cheaper to find that out now than after a quotation.")
h3("When the shell has to be a real freight container")
p("Some clients need the freight shell itself. Port and logistics work, client specifications that name ISO dimensions, and projects where the unit may later move as cargo all point that way. That is a conversion, not a fabrication, and it carries its own spec and its own price.")
h3("When site duty is the deciding factor")
raw(f'<p>If the module will be lifted, dragged and relocated several times across a project, the build changes. Base rails, lifting points and the coating system all take more punishment. {LINK_SITE_OFFICE} is specified for that life, and it is the right answer for a contractor moving offices between phases.</p>')
h3("When the value line is enough")
raw(f'<p>Not every office needs the full platform. Some units sit in one compound, house one or two people and never move again. For that job {LINK_CABIN} does the work at a lower rate. It is a built cabin. It has no ISO container history, and we never present it as if it did.</p>')
h3("When a specialist system replaces the office entirely")
p("Battery storage enclosures, containerised data centre shells, customer-facing marketing offices, multi-storey stacks, flat-pack kits and fold-out expandable units are separate products with separate scopes. If your requirement names one of those, this standard office is the wrong starting point. Ask us and we will point you at the right specification.")
raw(img_tag("ld05"))

h2("How the module is built")
h3("Steel structure and the load path")
p("The base is a 150x75x5 mm mild steel C-channel perimeter. It carries the floor, the walls, the transport loads and the reactions at every support point. Inside it we run 100x50x4 mm channels and 80x40x3 mm tubular members as stiffeners, spaced to suit the floor boards and the partitions above them.")
p("The floor frame uses 100x50x3 mm primary members with 80x40x3 mm secondaries. Corner posts are 60x60x3 mm, with 60x60x3 mm at the corners and 50x50x3 mm intermediates completing the wall frame. The top perimeter is 80x40x3 mm. Roof rafters are 60x40x2.5 mm, with 50x50x2.5 mm purlins across them.")
p("Those numbers matter for one practical reason. Every door, window and service cut-out has to be framed and the load carried around the opening. An opening is never simply removed from a wall. If you move a window after fabrication, that framing has to move with it.")
raw(img_tag("ld04"))

h3("Envelope, insulation and finish")
p("Exterior walls are 1.25 to 1.6 mm corrugated MS sheet. The roof is 1.6 mm corrugated sheet, laid to a positive fall with sealed laps and controlled rainwater discharge. Wall insulation is 75 mm mineral wool. Roof insulation is 100 mm glass wool or mineral wool.")
p("Nominal thickness alone does not describe performance. Density, combustibility, vapour control and thermal bridging all move the result, and they are selected against your climate and your project fire strategy. We will not quote a U-value or a fire rating for an assembly we have not tested.")
p("Inside, walls are 12 mm plywood with 0.8 to 1.0 mm laminate. The ceiling is 12.5 mm gypsum or a laminated panel. The floor base is 19 mm marine-grade plywood or 18 mm Bison panel. On top of it we lay 5 to 6 mm SPC or 3 to 4 mm LVT. Externally the module takes a red-oxide primer coat and two anti-rust enamel coats.")

h3("Electrical and services")
p("Wiring is concealed PVC-insulated copper. Typical starting sizes are 1.5 sq.mm for lighting, 2.5 sq.mm for sockets and 4 sq.mm for air-conditioning and higher loads. Those are starting values only. Final conductor sizes follow your approved load schedule.")
p("Each module carries a distribution board with MCB and RCCB protection, protective earthing, and segregated lighting, socket and air-conditioning circuits. We provide LED lighting, data points, a UPS provision, 6A and 16A sockets, fan points and a dedicated air-conditioning circuit. Plumbing is excluded unless your approved scope says otherwise.")
raw(img_tag("ld02"))

h2("Standard, optional and excluded: where our scope stops")
p("Most disputes on modular orders start at the boundary, not the build. So we set it out plainly. Standard scope covers the structure, the envelope, the insulation and the internal finish. It also covers the doors and windows on the approved schedule, plus the electrical package described above.")
p("Optional items include air-conditioning, better flooring, security grilles, insect mesh, extra partitions and branding. Custom items include odd-sized openings, heavy-duty coatings for harsh exposure, and any frame change for a special load.")
raw('<p>Excluded unless your order states otherwise:</p><ul>'
    '<li>Loose furniture and office equipment</li>'
    '<li>Transport, unloading, craneage and installation</li>'
    '<li>Foundations, plinths and site levelling</li>'
    '<li>Site utilities up to the module connection point</li>'
    '<li>Statutory approvals and project certification</li></ul>')
p("None of that is a hidden cost. It is a scope line. Tell us which items you want inside the order and we will price them; leave them out and the quote will say so in writing.")

h2("Getting the site ready before the module arrives")
p("A container office needs a level, firm, load-bearing base. Concrete plinths, precast blocks or steel bearers all work. What matters is that the support points sit under the frame where the drawing says, and that the surface is level across the full footprint.")
p("Water is the second thing to plan. The roof discharges rainwater at defined points, so the ground around the module has to take it away. On monsoon-season sites, raise the module enough that the step-up stays usable when the compound turns to mud.")
p("Then check your incoming supply. We deliver the module wired to its board, ready for a single connection. The cable from your site distribution to that point is yours to provide. So is the isolator at it, unless the quote says we are doing it.")
raw(img_tag("ld06"))

h2("Transport, craneage and site access")
p("Every module in this range travels as one finished unit on a flatbed or low-loader. The 40 ft sizes need the road, the gate and the turning circle that a 40 ft trailer needs. That constraint catches more buyers than any other, and it is worth checking before you choose a size.")
p("Lifting is by crane or telehandler, from the approved lifting points only. We issue the shipped weight, the centre of gravity and the support points before dispatch. Lift from anywhere else and you distort the frame.")
p("Transport, unloading, craneage and installation are quoted separately unless your order says so. Freight in India varies by route, vehicle and season. We would rather price it against your actual site than bury an average in the module rate.")

h2("What we check before the module leaves the works")
p("Pre-dispatch inspection covers dimensions, member and sheet identification, welds, coating, roof drainage, weather sealing, doors, windows and electrical continuity. We test the electrical installation for continuity, insulation resistance, polarity and RCD operation.")
p("Punch-list items close before dispatch, not after arrival. Damaged coating is repaired at the works, where it can be done properly. That is the whole argument for factory-built offices, and it only holds if the factory finishes the job.")

h2("What to send us so we can quote well")
p("A vague enquiry gets a vague number. Five inputs let us quote properly, and they take about ten minutes to gather.")
raw('<ul><li>Delivery location and site access width</li>'
    '<li>Occupancy: how many people, and what they do</li>'
    '<li>Equipment load, including air-conditioning, UPS or servers</li>'
    '<li>Whether the module will be relocated, and how often</li>'
    '<li>Your required handover date</li></ul>')
p("Send those and your quote comes back with the inclusions and the exclusions written out. You will not get a rate per square foot that moves at order stage.")

h2("Questions buyers ask before ordering")
for q, a in FAQS:
    raw(f'<h4><strong>{esc(q)}</strong></h4><p>{esc(a)}</p>')

h2("One module or several: configuring a larger office")
p("Four hundred square feet is our largest single module. Above that, you stop buying an office and start planning a layout. There are two honest ways forward, and they behave differently on site.")
p("The first is to place modules end to end. Two 40x10 units give you 800 square feet with a shared entrance deck between them. Each unit still arrives finished, and each still lifts on its own. The joint between them needs a weather detail and a level base across both footprints.")
p("The second is to go upward. A stacked build brings in foundations, external stairs, landings, guardrails and structural calculations for the project. That is a different product with its own design scope. So we quote it apart, not as a bigger office.")
p("In practice, most sites reach four modules before a permanent building starts to make better sense. We will say so if your requirement crosses that line. Selling you a sixth container office when a shed would serve you better helps nobody.")

h2("How long the module lasts, and what it needs")
p("Life span rests far more on upkeep and exposure than on the build. Coastal air, industrial fumes and standing water all shorten it. Reseal and touch up a module in a dry inland yard and it lasts well. Leave the same unit in a wet corner of a coastal site and it will not.")
p("Three habits do most of the work. Keep the roof drainage clear so water leaves the module instead of sitting on it. Touch up coating damage as soon as it appears, before rust gets under the paint. Reseal around openings after any relocation, because transport moves joints that looked sound.")
p("We do not publish a life-span figure in years. Any number we printed would rest on your site, your upkeep and your exposure. We cannot check those from here. What we can tell you is the coating system, the steel sections and the sealing detail, which is what actually determines the answer.")

h2("New build or refurbished shell: what changes")
p("Buyers often ask if a second-hand shell costs less. It usually does. It also brings trade-offs worth naming first.")
p("A used shell carries a past you did not see. Floor condition, previous cargo, repair welds and existing corrosion all vary between units, so the specification cannot be identical from one order to the next. That is fine on a short-life site office. It is awkward on a five-year one.")
p("A new module gives you a known steel history. Openings sit where you want them, and the finish matches across every unit in a large order. Where a project needs ten offices that match, that consistency is usually worth more than the saving on a refurbished shell.")

html = "".join(SECTIONS_HTML)

# --- Checks ---
h2_count = html.count("<h2>")
h3_count = html.count("<h3>")
print("h2 count:", h2_count, "(ticket: 13)")
print("h3 count:", h3_count, "(ticket: 7)")
print("table count:", html.count("<table>"), "(ticket: 1)")
print("ul count:", html.count("<ul>"), "(ticket: 2 bullet groups)")
print("img count:", html.count("<img "), "(ticket: 5)")
print("faq h4 count:", html.count("<h4>"), "(ticket: 5)")
print("link count:", html.count("<a href="), "(ticket: 2 in description)")
print("em dash present:", "—" in html)

text_only = re.sub(r"<[^>]+>", " ", html)
words = [w for w in re.split(r"\s+", text_only) if w.strip()]
print("word count (rough, incl FAQ Q&A):", len(words), "(ticket: 2082, table/FAQ text also counted here)")

json.dump({"descriptionHtml": html}, open("scripts/co00-description-html.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nwrote scripts/co00-description-html.json, length", len(html))
