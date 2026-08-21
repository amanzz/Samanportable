import fs from 'node:fs';

const PATH = 'src/data/products/c04-specifications.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
const co = data.products['container-offices'];

const GROUP1 = 'Structure, envelope, roof and floor';
const GROUP2 = 'Finish, openings, electrical, services and scope';

const rows1 = [
  ['Bottom frame', 'Primary structural base', '150×75×5 mm MS C-channel', 'Product'],
  ['Bottom stiffeners', 'Secondary base / bracing', '100×50×4 mm channels and 80×40×3 mm MS tubular members', 'Product'],
  ['Floor frame', 'Floor support / foundation interface', '100×50×3 mm primary and 80×40×3 mm secondary floor members', 'Product'],
  ['Top frame', 'Upper perimeter / primary member', '80×40×3 mm MS top perimeter', 'Product'],
  ['Roof stiffeners', 'Roof frame / secondary member', '60×40×2.5 mm rafters and 50×50×2.5 mm purlins', 'Product'],
  ['Corner posts / walls', 'Vertical / wall frame', '60×60×3 mm corner posts and 50×50×3 mm intermediate posts', 'Product'],
  ['Lifting / handling', 'Approved handling provision', 'Designed MS lifting hooks or lugs matched to the completed unit weight; handle only by the approved lifting and support-point drawing.', 'Common'],
  ['Welding & fabrication', 'Fabrication control', 'Welded MS fabrication with cleaned joints, safe edges, dimensional inspection and coating touch-up before panel closure and dispatch.', 'Common'],
  ['Exterior walls', 'External wall / enclosure', '1.25–1.6 mm corrugated MS sheet', 'Product'],
  ['Roof', 'Roof sheet / system', '1.6 mm corrugated MS sheet', 'Product'],
  ['Interior walls', 'Internal lining / partition', '12 mm plywood with 0.8–1.0 mm laminate and selected HPL feature panels', 'Product'],
  ['Ceiling', 'Ceiling / roof underside', '12.5 mm gypsum or premium laminated ceiling', 'Product'],
  ['Floor base', 'Structural floor / slab', '19 mm marine-grade plywood or 18 mm Bison panel', 'Product'],
  ['Floor finish', 'Finished walking surface', '5–6 mm SPC or 3–4 mm LVT flooring', 'Product'],
  ['Wall insulation', 'Thermal / acoustic layer', '75 mm mineral wool', 'Product'],
  ['Roof insulation', 'Roof thermal layer', '100 mm glass wool or mineral wool', 'Product'],
];

const rows2 = [
  ['Decorative / external finish', 'Coating / façade finish', 'Standard anti-rust enamel exterior finish in an approved colour combination.', 'Product'],
  ['Fasteners & sealing', 'Approved joints and seals', 'Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it.', 'Common'],
  ['Main door / service door', 'Door assembly', 'Premium insulated/laminated door with closer and upgraded lockset', 'Product'],
  ['Windows / service opening', 'Opening package', 'Large powder-coated aluminium windows with 6 mm tinted glass', 'Product'],
  ['Grills / mosquito mesh', 'Opening protection', 'Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it.', 'Product'],
  ['Electrical wiring', 'Copper wiring and containment', 'Concealed PVC-insulated copper wiring, typically 1.5 sq.mm lighting, 2.5 sq.mm sockets and 4 sq.mm higher-load or AC circuits, subject to the final load schedule.', 'Common'],
  ['Electrical protection', 'DB / MCB / RCCB / earthing', 'Distribution board with MCB/RCCB protection, earthing and segregation of lighting, socket, wet-area and AC circuits according to the approved electrical drawing.', 'Common'],
  ['Electrical fittings', 'Lights, sockets and equipment points', 'LED lights, computer/data points, UPS provision, multiple 6A/16A sockets, fan points and dedicated AC circuit.', 'Product'],
  ['Ventilation / AC', 'Ventilation and comfort services', 'Cross ventilation with wall/ceiling fans and split-AC provision.', 'Product'],
  ['Plumbing / sanitary', 'Water, waste and sanitary interface', 'Not included unless shown in the approved scope.', 'Product'],
  ['Layout / configuration', 'Product-specific planning', 'Office layout with workstations, storage and optional manager or meeting partition.', 'Product'],
  ['Painting / coating', 'Corrosion-protection system', 'One red-oxide primer coat followed by two compatible anti-rust enamel coats on prepared MS surfaces; project exposure may require an upgraded coating system.', 'Common'],
  ['Quality checks', 'Inspection and testing', 'Pre-dispatch checks cover dimensions, member and sheet identification, welds, coating, roof drainage, weather sealing, doors, windows, electrical continuity and functional operation.', 'Common'],
  ['Warranty', 'Commercially confirmed warranty', 'Warranty period and exclusions are confirmed only in the final quotation; relocation damage, misuse, site services and unapproved alterations remain outside the agreed scope…', 'Common'],
];

const toRow = (group) => ([component, detail, scopeClass, meaning]) => ({
  group,
  component,
  detail,
  scopeClass,
  meaning,
  differsFromHub: false,
});

co.specifications = [...rows1.map(toRow(GROUP1)), ...rows2.map(toRow(GROUP2))];

co.narrative = 'What the specification changes for you. Three lines in these tables decide most site problems. The 150x75x5 mm base frame sets where the module may be supported, so your plinth positions follow it rather than the other way round. The electrical line states starting cable sizes only, which is why we ask for your equipment list before quoting. And the layout line allows an optional manager or meeting partition, which the approved GA boards place on the 40 ft sizes and not on the shorter ones.';

co.diagrams = [
  {
    src: '/images/products/container-offices/specifications/co-00-container-office-frame-and-sheet-fixing-detail.webp',
    alt: 'Three-stage diagram of container office frame connection and corrugated sheet fixing, from alignment to weld to sealed cladding',
    caption: 'Illustrative - not for construction.',
    width: 1600,
    height: 900,
  },
  {
    src: '/images/products/container-offices/specifications/co-00-container-office-window-electrical-fan-detail.webp',
    alt: 'Three-stage diagram of container office window setting, distribution board circuits and fan installation with test checks',
    caption: 'Illustrative - not for construction.',
    width: 1600,
    height: 900,
  },
];

fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('rows1:', rows1.length, 'rows2:', rows2.length, 'total:', co.specifications.length);
