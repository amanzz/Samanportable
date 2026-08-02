# C-04 IMAGE AND ALT MANIFEST — 01 Aug 2026

Four pages x nine sizes x six images = **216 rows**. Every image below was opened and read from the four contact sheets; cell number = filename number, verified. Selection per size: three exteriors + three interiors, porta-cabins parity (row 1 of each size = the Section 2 hero).

**Rules for implementation (verbatim, L4):**

1. Source folders: `D:\Project-shekhar\all-product-images\C-04\` — four product folders, size subfolders, files named `<product>-<size> (N).png`.
2. Convert each selected PNG to WebP under the **same destination path convention porta-cabins already uses in the repo** — report the destination folder in the build report before converting. Target filename: the `New filename` column, exactly.
3. Alt text: the `Alt text` column, byte-exact, on the `alt` attribute of that image everywhere it renders (gallery, lightbox, structured data image captions where applicable).
4. Unselected source files are not deployed and are not renamed. They stay where they are.
5. **Quarantine, ruling:** the three wrong-product files in `shipping-container-office\size-40x10\` — `portable-cabin-building-40x10-front angle.png`, `portable-cabin-building-40x10-hero view.png`, `portable-cabin-building-40x10-side elevation.png` — move to `D:\Project-shekhar\all-product-images\C-04\_wrong-product\`. They belong to no C-04 page. Report the move.
6. `shipping-container-office\size-40x10\` already carries semantic filenames. The six selected there keep their existing names (normalise any space to a hyphen when converting to WebP) — no renumbering.
7. Lazy loading on all gallery images; only each page's first hero eager. Image sitemap regenerated after wiring.

---

## 1 · HUB — /product/container-offices — term "container office"

### size-10x10

| Src | New filename | Alt text |
|---|---|---|
| (6) | container-offices-10x10-hero-view.webp | Grey and navy two-tone container office, 10x10 ft, three-quarter exterior view with twin sliding windows |
| (2) | container-offices-10x10-front-angle.webp | Cream-panelled 10x10 ft container office seen from the front corner on a paved yard |
| (4) | container-offices-10x10-side-elevation.webp | Dark grey side elevation of a compact 10x10 ft container office with a single entry door |
| (5) | container-offices-10x10-workspace-interior.webp | Inside a 10x10 ft container office: timber desk against the window wall with task chair |
| (8) | container-offices-10x10-corner-interior.webp | Corner desk arrangement inside a 10x10 ft container office, two workstations meeting at the wall |
| (7) | container-offices-10x10-team-interior.webp | Two facing desks fitted into a 10x10 ft container office interior with white wall panels |

### size-20x8

| Src | New filename | Alt text |
|---|---|---|
| (4) | container-offices-20x8-hero-view.webp | Blue and grey 20x8 ft container office photographed at an angle showing door and window band |
| (3) | container-offices-20x8-front-angle.webp | Yellow-finished 20x8 ft container office, front corner view on open hardstanding |
| (10) | container-offices-20x8-side-elevation.webp | Long dark grey side wall of a 20x8 ft container office with evenly spaced windows |
| (7) | container-offices-20x8-workspace-interior.webp | Single workstation with monitor inside a 20x8 ft container office, walls in white liner panel |
| (5) | container-offices-20x8-team-interior.webp | Row of desks running the length of a 20x8 ft container office interior |
| (8) | container-offices-20x8-corner-interior.webp | Partitioned desk bays inside a 20x8 ft container office, screens dividing each seat |

### size-20x10

| Src | New filename | Alt text |
|---|---|---|
| (8) | container-offices-20x10-hero-view.webp | Green-painted 20x10 ft container office, hero exterior angle with corrugated steel cladding |
| (2) | container-offices-20x10-front-angle.webp | White 20x10 ft container office viewed from the front with dark trim around openings |
| (5) | container-offices-20x10-side-elevation.webp | Black side elevation of a 20x10 ft container office, matt finish and flush window frames |
| (9) | container-offices-20x10-workspace-interior.webp | Executive desk with visitor chairs inside a 20x10 ft container office |
| (10) | container-offices-20x10-corner-interior.webp | L-shaped corner desk fitted inside a 20x10 ft container office interior |
| (7) | container-offices-20x10-entrance-interior.webp | View towards the entry door of a 20x10 ft container office with a desk beside the doorway |

### size-20x12

| Src | New filename | Alt text |
|---|---|---|
| (2) | container-offices-20x12-hero-view.webp | Turquoise 20x12 ft container office, three-quarter hero view on level paving |
| (4) | container-offices-20x12-front-angle.webp | White-bodied 20x12 ft container office with dark plinth, front corner perspective |
| (8) | container-offices-20x12-side-elevation.webp | Dark grey 20x12 ft container office standing on grass, full side elevation |
| (9) | container-offices-20x12-workspace-interior.webp | Workstation with dual monitors inside a 20x12 ft container office |
| (7) | container-offices-20x12-team-interior.webp | Paired desks for two staff inside a 20x12 ft container office interior |
| (3) | container-offices-20x12-meeting-interior.webp | Small meeting desk with chairs set up inside a 20x12 ft container office |

### size-30x10

| Src | New filename | Alt text |
|---|---|---|
| (5) | container-offices-30x10-hero-view.webp | Green 30x10 ft container office at a port-side location, hero exterior angle |
| (4) | container-offices-30x10-front-angle.webp | Yellow 30x10 ft container office with a multi-window front band |
| (8) | container-offices-30x10-side-elevation.webp | Blue-grey side elevation of a 30x10 ft container office with three window bays |
| (10) | container-offices-30x10-workspace-interior.webp | Executive workstation at the end wall of a 30x10 ft container office |
| (9) | container-offices-30x10-team-interior.webp | Open-plan desk layout inside a 30x10 ft container office |
| (7) | container-offices-30x10-corner-interior.webp | Desks grouped along the corner of a 30x10 ft container office interior |

### size-40x8

| Src | New filename | Alt text |
|---|---|---|
| (3) | container-offices-40x8-hero-view.webp | White 40x8 ft container office, long hero exterior with continuous window line |
| (4) | container-offices-40x8-front-angle.webp | Cream and green 40x8 ft container office seen from the front corner |
| (10) | container-offices-40x8-elevated-view.webp | Elevated view over an olive-toned 40x8 ft container office showing the full roofline |
| (7) | container-offices-40x8-workspace-interior.webp | Single desk placed midway along a 40x8 ft container office corridor interior |
| (6) | container-offices-40x8-team-interior.webp | Desk row seating several staff inside a 40x8 ft container office |
| (8) | container-offices-40x8-corner-interior.webp | Desk and wall-mounted screen in the corner of a 40x8 ft container office |

### size-20x20

| Src | New filename | Alt text |
|---|---|---|
| (5) | container-offices-20x20-hero-view.webp | Dark green 20x20 ft container office, square-format hero exterior |
| (2) | container-offices-20x20-front-angle.webp | Orange and yellow two-tone 20x20 ft container office from the front corner |
| (7) | container-offices-20x20-side-elevation.webp | Beige 20x20 ft container office beside a bridge, side elevation |
| (4) | container-offices-20x20-workspace-interior.webp | Desk against a planted feature wall inside a 20x20 ft container office |
| (1) | container-offices-20x20-team-interior.webp | Two desks arranged face-to-face inside a 20x20 ft container office |
| (8) | container-offices-20x20-corner-interior.webp | Workstations along two walls of a 20x20 ft container office interior |

### size-40x10

| Src | New filename | Alt text |
|---|---|---|
| (5) | container-offices-40x10-hero-view.webp | White 40x10 ft container office, hero exterior along the access road |
| (4) | container-offices-40x10-front-angle.webp | Cream 40x10 ft container office with green base band, front corner view |
| (8) | container-offices-40x10-side-elevation.webp | Flat-fronted blue 40x10 ft container office, complete side elevation |
| (10) | container-offices-40x10-workspace-interior.webp | Desk run fitted along one wall of a 40x10 ft container office |
| (9) | container-offices-40x10-team-interior.webp | Open desks for a working team inside a 40x10 ft container office |
| (7) | container-offices-40x10-corner-interior.webp | Dark-finished desks meeting in the corner of a 40x10 ft container office |

### size-40x12

| Src | New filename | Alt text |
|---|---|---|
| (6) | container-offices-40x12-hero-view.webp | Sage green 40x12 ft container office, wide hero exterior angle |
| (1) | container-offices-40x12-front-angle.webp | White 40x12 ft container office viewed from the front on open ground |
| (4) | container-offices-40x12-side-elevation.webp | Dark grey 40x12 ft container office against a glazed building, side elevation |
| (3) | container-offices-40x12-workspace-interior.webp | Single managed workstation inside a 40x12 ft container office |
| (7) | container-offices-40x12-team-interior.webp | Bank of workstations inside a 40x12 ft container office interior |
| (9) | container-offices-40x12-corner-interior.webp | Desks set against a green accent wall in a 40x12 ft container office |

---

## 2 · /product/container-offices/container-office-cabin — term "container office cabin"

### size-10x10

| Src | New filename | Alt text |
|---|---|---|
| (5) | container-office-cabin-10x10-hero-view.webp | Cream container office cabin with green base band, 10x10 ft, beside a warehouse loading bay |
| (2) | container-office-cabin-10x10-front-angle.webp | White 10x10 ft container office cabin with dark grey plinth standing on lawn |
| (6) | container-office-cabin-10x10-side-elevation.webp | Blue 10x10 ft container office cabin, side elevation with three-window run |
| (3) | container-office-cabin-10x10-workspace-interior.webp | Laptop desk facing the window inside a 10x10 ft container office cabin |
| (9) | container-office-cabin-10x10-meeting-interior.webp | Dark desk with two visitor chairs inside a 10x10 ft container office cabin |
| (10) | container-office-cabin-10x10-corner-interior.webp | Grey desk, storage cabinet and air conditioner in a 10x10 ft container office cabin corner |

### size-20x8

| Src | New filename | Alt text |
|---|---|---|
| (6) | container-office-cabin-20x8-hero-view.webp | Grey container office cabin with navy base, 20x8 ft, hero angle on gravel ground |
| (2) | container-office-cabin-20x8-front-angle.webp | Turquoise 20x8 ft container office cabin, front view against a warehouse facade |
| (8) | container-office-cabin-20x8-side-elevation.webp | Charcoal 20x8 ft container office cabin with port cranes behind, side elevation |
| (7) | container-office-cabin-20x8-team-interior.webp | Two workstations and open shelving inside a 20x8 ft container office cabin |
| (3) | container-office-cabin-20x8-meeting-interior.webp | Compact meeting nook with two chairs inside a 20x8 ft container office cabin |
| (9) | container-office-cabin-20x8-entrance-interior.webp | Desk row facing a brown entry door inside a 20x8 ft container office cabin |

### size-20x10

| Src | New filename | Alt text |
|---|---|---|
| (5) | container-office-cabin-20x10-hero-view.webp | Deep green 20x10 ft container office cabin under a road overpass, hero angle |
| (2) | container-office-cabin-20x10-front-angle.webp | Bright yellow 20x10 ft container office cabin, straight-on front elevation |
| (1) | container-office-cabin-20x10-side-elevation.webp | Pale blue 20x10 ft container office cabin with dark base, long side view |
| (3) | container-office-cabin-20x10-workspace-interior.webp | Desk with plants against sage-toned walls in a 20x10 ft container office cabin |
| (7) | container-office-cabin-20x10-team-interior.webp | White paired desks inside a 20x10 ft container office cabin work area |
| (9) | container-office-cabin-20x10-corner-interior.webp | Desk beneath the air conditioner in a wood-floored 20x10 ft container office cabin |

### size-20x12

| Src | New filename | Alt text |
|---|---|---|
| (4) | container-office-cabin-20x12-hero-view.webp | White container office cabin with dark green base, 20x12 ft, palms behind, hero angle |
| (2) | container-office-cabin-20x12-front-angle.webp | Olive green 20x12 ft container office cabin, front elevation on open paving |
| (6) | container-office-cabin-20x12-side-elevation.webp | Cream 20x12 ft container office cabin with terracotta base band, side elevation |
| (9) | container-office-cabin-20x12-workspace-interior.webp | Monitor workstations in a grey-walled 20x12 ft container office cabin |
| (7) | container-office-cabin-20x12-team-interior.webp | Open office desks with task chairs inside a 20x12 ft container office cabin |
| (3) | container-office-cabin-20x12-meeting-interior.webp | Meeting desk with cantilever chairs in a wood-floored 20x12 ft container office cabin |

### size-30x10

| Src | New filename | Alt text |
|---|---|---|
| (1) | container-office-cabin-30x10-hero-view.webp | Teal 30x10 ft container office cabin, hero exterior on a landscaped plot |
| (4) | container-office-cabin-30x10-front-angle.webp | Beige 30x10 ft container office cabin with a continuous multi-window front |
| (5) | container-office-cabin-30x10-side-elevation.webp | White 30x10 ft container office cabin with dark plinth, cable-stayed bridge behind |
| (3) | container-office-cabin-30x10-workspace-interior.webp | Black executive desk centred in a 30x10 ft container office cabin |
| (7) | container-office-cabin-30x10-team-interior.webp | Facing desk pair with task chairs inside a 30x10 ft container office cabin |
| (9) | container-office-cabin-30x10-corner-interior.webp | Timber desk run along the window wall of a 30x10 ft container office cabin |

### size-40x8

| Src | New filename | Alt text |
|---|---|---|
| (5) | container-office-cabin-40x8-hero-view.webp | Yellow container office cabin with green base, 40x8 ft, on rain-wet concrete, hero angle |
| (1) | container-office-cabin-40x8-front-angle.webp | All-white 40x8 ft container office cabin, long front elevation |
| (6) | container-office-cabin-40x8-side-elevation.webp | Sage green 40x8 ft container office cabin photographed side-on |
| (3) | container-office-cabin-40x8-meeting-interior.webp | Grey desk arranged for discussions inside a 40x8 ft container office cabin |
| (9) | container-office-cabin-40x8-team-interior.webp | Staff desks in sequence along a 40x8 ft container office cabin interior |
| (10) | container-office-cabin-40x8-corner-interior.webp | Corner workstations with laptop inside a 40x8 ft container office cabin |

### size-20x20

| Src | New filename | Alt text |
|---|---|---|
| (5) | container-office-cabin-20x20-hero-view.webp | Sage green 20x20 ft container office cabin outside a factory, hero exterior |
| (2) | container-office-cabin-20x20-front-angle.webp | Green and yellow two-tone 20x20 ft container office cabin, front elevation |
| (6) | container-office-cabin-20x20-side-elevation.webp | Red 20x20 ft container office cabin, full side elevation on paved ground |
| (3) | container-office-cabin-20x20-workspace-interior.webp | Executive desk and timber cabinet inside a 20x20 ft container office cabin |
| (7) | container-office-cabin-20x20-team-interior.webp | Twin dark desks in a grey-walled 20x20 ft container office cabin |
| (10) | container-office-cabin-20x20-lounge-interior.webp | Sofa, coffee table and desk sharing a 20x20 ft container office cabin interior |

### size-40x10

| Src | New filename | Alt text |
|---|---|---|
| (10) | container-office-cabin-40x10-hero-view.webp | Pale blue container office cabin with dark green base, 40x10 ft, hero angle |
| (3) | container-office-cabin-40x10-front-angle.webp | Yellow 40x10 ft container office cabin with green base fronting a glass building |
| (7) | container-office-cabin-40x10-side-elevation.webp | Sage green 40x10 ft container office cabin, side elevation with planted border |
| (2) | container-office-cabin-40x10-workspace-interior.webp | Grey desk near the entrance inside a 40x10 ft container office cabin |
| (6) | container-office-cabin-40x10-team-interior.webp | Open-plan desks down the length of a 40x10 ft container office cabin |
| (8) | container-office-cabin-40x10-corridor-interior.webp | Desk row along the corridor wall of a 40x10 ft container office cabin |

### size-40x12

| Src | New filename | Alt text |
|---|---|---|
| (3) | container-office-cabin-40x12-hero-view.webp | Dark green 40x12 ft container office cabin, hero exterior beside a campus block |
| (4) | container-office-cabin-40x12-front-angle.webp | Green and cream 40x12 ft container office cabin at a forest edge, front angle |
| (5) | container-office-cabin-40x12-side-elevation.webp | Beige 40x12 ft container office cabin with hills behind, side elevation |
| (2) | container-office-cabin-40x12-meeting-interior.webp | Timber desk with two guest chairs inside a 40x12 ft container office cabin |
| (6) | container-office-cabin-40x12-team-interior.webp | Wood-topped desks in an open 40x12 ft container office cabin layout |
| (9) | container-office-cabin-40x12-workspace-interior.webp | Desk with monitor beside the window in a 40x12 ft container office cabin |

---

## 3 · /product/container-offices/shipping-container-office — term "shipping container office"

### size-10x10

| Src | New filename | Alt text |
|---|---|---|
| (5) | shipping-container-office-10x10-hero-view.webp | Cream shipping container office with green base, 10x10 ft, hero angle beside a walkway |
| (3) | shipping-container-office-10x10-front-angle.webp | Green 10x10 ft shipping container office near a substation yard, front corner view |
| (9) | shipping-container-office-10x10-side-elevation.webp | Blue 10x10 ft shipping container office against a white wall, side elevation |
| (1) | shipping-container-office-10x10-workspace-interior.webp | Desk positioned under twin windows inside a 10x10 ft shipping container office |
| (8) | shipping-container-office-10x10-corridor-interior.webp | Timber desk and cabinets lining a 10x10 ft shipping container office interior |
| (10) | shipping-container-office-10x10-corner-interior.webp | Grey executive desk with wall cabinets in a 10x10 ft shipping container office |

### size-20x8

| Src | New filename | Alt text |
|---|---|---|
| (8) | shipping-container-office-20x8-hero-view.webp | Grey shipping container office with navy base, 20x8 ft, on a lawn edge, hero angle |
| (1) | shipping-container-office-20x8-front-angle.webp | Teal blue 20x8 ft shipping container office, front corner view on concrete |
| (5) | shipping-container-office-20x8-side-elevation.webp | White 20x8 ft shipping container office with dark base below a gantry bridge |
| (3) | shipping-container-office-20x8-workspace-interior.webp | Desk, plant and low sideboard inside a 20x8 ft shipping container office |
| (7) | shipping-container-office-20x8-team-interior.webp | Continuous desk row with chairs inside a 20x8 ft shipping container office |
| (9) | shipping-container-office-20x8-corner-interior.webp | Monitor workstation by the window in a 20x8 ft shipping container office |

### size-20x10

| Src | New filename | Alt text |
|---|---|---|
| (3) | shipping-container-office-20x10-hero-view.webp | Dark green 20x10 ft shipping container office, hero exterior on patterned paving |
| (4) | shipping-container-office-20x10-front-angle.webp | Pale green and white 20x10 ft shipping container office, front angle by a pool court |
| (10) | shipping-container-office-20x10-side-elevation.webp | Amber yellow 20x10 ft shipping container office among tropical planting |
| (8) | shipping-container-office-20x10-workspace-interior.webp | Timber desk with monitor and phone inside a 20x10 ft shipping container office |
| (2) | shipping-container-office-20x10-meeting-interior.webp | Meeting table with four chairs inside a 20x10 ft shipping container office |
| (6) | shipping-container-office-20x10-entrance-interior.webp | Reception counter near the door of a 20x10 ft shipping container office |

### size-20x12

| Src | New filename | Alt text |
|---|---|---|
| (5) | shipping-container-office-20x12-hero-view.webp | Light grey 20x12 ft shipping container office on a campus forecourt, hero angle |
| (7) | shipping-container-office-20x12-front-angle.webp | Blue 20x12 ft shipping container office under a site canopy, front corner view |
| (9) | shipping-container-office-20x12-side-elevation.webp | Beige 20x12 ft shipping container office with terracotta base, side elevation |
| (1) | shipping-container-office-20x12-workspace-interior.webp | Executive desk with laptop and armchairs inside a 20x12 ft shipping container office |
| (10) | shipping-container-office-20x12-team-interior.webp | Dark desks with monitors inside a 20x12 ft shipping container office |
| (8) | shipping-container-office-20x12-corner-interior.webp | Open floor with sideboard and desk inside a 20x12 ft shipping container office |

### size-30x10

| Src | New filename | Alt text |
|---|---|---|
| (2) | shipping-container-office-30x10-hero-view.webp | Teal 30x10 ft shipping container office among trees, hero exterior angle |
| (4) | shipping-container-office-30x10-front-angle.webp | White 30x10 ft shipping container office at a waterside plot, front view |
| (8) | shipping-container-office-30x10-side-elevation.webp | Charcoal 30x10 ft shipping container office on marked parking, side elevation |
| (3) | shipping-container-office-30x10-meeting-interior.webp | Meeting desk flanked by two chairs inside a 30x10 ft shipping container office |
| (9) | shipping-container-office-30x10-team-interior.webp | Monitor desks beside bright windows in a 30x10 ft shipping container office |
| (7) | shipping-container-office-30x10-lounge-interior.webp | Long work counter and visitor sofa inside a 30x10 ft shipping container office |

### size-40x8

| Src | New filename | Alt text |
|---|---|---|
| (4) | shipping-container-office-40x8-hero-view.webp | Yellow shipping container office with green base, 40x8 ft, before a glass tower, hero angle |
| (2) | shipping-container-office-40x8-front-angle.webp | Long white 40x8 ft shipping container office, front corner perspective |
| (6) | shipping-container-office-40x8-side-elevation.webp | Yellow 40x8 ft shipping container office with dark base at a waterside road |
| (7) | shipping-container-office-40x8-workspace-interior.webp | Wall desks and tall wardrobe inside a 40x8 ft shipping container office |
| (9) | shipping-container-office-40x8-team-interior.webp | Long desk row with plants inside a 40x8 ft shipping container office |
| (3) | shipping-container-office-40x8-corridor-interior.webp | Grey desks along the corridor of a 40x8 ft shipping container office |

### size-20x20

| Src | New filename | Alt text |
|---|---|---|
| (6) | shipping-container-office-20x20-hero-view.webp | Blue 20x20 ft shipping container office near a rail yard, hero exterior |
| (4) | shipping-container-office-20x20-front-angle.webp | Green and cream 20x20 ft shipping container office, front corner view |
| (8) | shipping-container-office-20x20-side-elevation.webp | Red 20x20 ft shipping container office outside an industrial hall, side elevation |
| (9) | shipping-container-office-20x20-workspace-interior.webp | L-shaped desks with monitors inside a 20x20 ft shipping container office |
| (7) | shipping-container-office-20x20-team-interior.webp | Twin desks facing a blue door inside a 20x20 ft shipping container office |
| (10) | shipping-container-office-20x20-corner-interior.webp | Timber executive desk with wall shelves in a 20x20 ft shipping container office |

### size-40x10 — existing semantic filenames, keep them

| Src (existing name) | New filename | Alt text |
|---|---|---|
| hero view | shipping-container-office-40x10-hero-view.webp | Dark green 40x10 ft shipping container office, hero exterior on a marked yard |
| front angle | shipping-container-office-40x10-front-angle.webp | Sage green 40x10 ft shipping container office with clipped shrubs, front angle |
| side elevation | shipping-container-office-40x10-side-elevation.webp | Cream 40x10 ft shipping container office beside a rendered wall, side elevation |
| workspace-interior | shipping-container-office-40x10-workspace-interior.webp | Timber desk with chair and shelf unit inside a 40x10 ft shipping container office |
| corner-interior | shipping-container-office-40x10-corner-interior.webp | Wall-length desk with task chairs inside a 40x10 ft shipping container office |
| entrance-interior | shipping-container-office-40x10-entrance-interior.webp | Office chair and desk facing the entry of a 40x10 ft shipping container office |

### size-40x12

| Src | New filename | Alt text |
|---|---|---|
| (2) | shipping-container-office-40x12-hero-view.webp | Pale green 40x12 ft shipping container office in a garden setting, hero angle |
| (3) | shipping-container-office-40x12-front-angle.webp | Dark green 40x12 ft shipping container office by a site gate, front corner view |
| (10) | shipping-container-office-40x12-side-elevation.webp | Yellow 40x12 ft shipping container office on a campus plaza, side elevation |
| (7) | shipping-container-office-40x12-workspace-interior.webp | Dark workstations with widescreen displays inside a 40x12 ft shipping container office |
| (5) | shipping-container-office-40x12-team-interior.webp | Grouped desks on wood flooring inside a 40x12 ft shipping container office |
| (8) | shipping-container-office-40x12-lounge-interior.webp | Open office with sofa corner inside a 40x12 ft shipping container office |

---

## 4 · /product/container-offices/site-office-container — term "site office container"

### size-10x10

| Src | New filename | Alt text |
|---|---|---|
| (5) | site-office-container-10x10-hero-view.webp | Green site office container with dark grey base, 10x10 ft, hero exterior angle |
| (6) | site-office-container-10x10-front-angle.webp | Yellow 10x10 ft site office container on mown grass, front corner view |
| (9) | site-office-container-10x10-side-elevation.webp | Red 10x10 ft site office container on gravel by a highway, side elevation |
| (1) | site-office-container-10x10-workspace-interior.webp | Timber desk below the air conditioner inside a 10x10 ft site office container |
| (4) | site-office-container-10x10-meeting-interior.webp | Desk with two visitor chairs inside a 10x10 ft site office container |
| (8) | site-office-container-10x10-corner-interior.webp | Grey desk and storage sideboard in a 10x10 ft site office container |

### size-20x8

| Src | New filename | Alt text |
|---|---|---|
| (5) | site-office-container-20x8-hero-view.webp | Dark green 20x8 ft site office container beside a rail siding, hero angle |
| (2) | site-office-container-20x8-front-angle.webp | Amber orange 20x8 ft site office container on a campus court, front view |
| (6) | site-office-container-20x8-side-elevation.webp | Pale green and white 20x8 ft site office container at a warehouse, side elevation |
| (4) | site-office-container-20x8-workspace-interior.webp | Desk with chairs and potted plants inside a 20x8 ft site office container |
| (8) | site-office-container-20x8-lounge-interior.webp | Workstation beside a grey sofa inside a 20x8 ft site office container |
| (10) | site-office-container-20x8-corner-interior.webp | Desk and monitor on wood flooring in a 20x8 ft site office container |

### size-20x10

| Src | New filename | Alt text |
|---|---|---|
| (2) | site-office-container-20x10-hero-view.webp | Olive green 20x10 ft site office container near solar panels, hero exterior |
| (5) | site-office-container-20x10-front-angle.webp | Light grey 20x10 ft site office container on cast concrete, front corner view |
| (7) | site-office-container-20x10-side-elevation.webp | Blue 20x10 ft site office container against a grey wall, side elevation |
| (4) | site-office-container-20x10-workspace-interior.webp | Desk backed by a tall wardrobe inside a 20x10 ft site office container |
| (1) | site-office-container-20x10-meeting-interior.webp | Dark desk with meeting table inside a 20x10 ft site office container |
| (8) | site-office-container-20x10-corner-interior.webp | Timber desk beside a red door in a 20x10 ft site office container |

### size-20x12

| Src | New filename | Alt text |
|---|---|---|
| (5) | site-office-container-20x12-hero-view.webp | Sage green site office container with dark base, 20x12 ft, hero exterior angle |
| (2) | site-office-container-20x12-front-angle.webp | Green 20x12 ft site office container with yellow base under a steel canopy |
| (6) | site-office-container-20x12-side-elevation.webp | Red 20x12 ft site office container on a landscaped campus, side elevation |
| (3) | site-office-container-20x12-workspace-interior.webp | Timber desk with two chairs inside a 20x12 ft site office container |
| (10) | site-office-container-20x12-team-interior.webp | Two staff desks on wood flooring inside a 20x12 ft site office container |
| (7) | site-office-container-20x12-lounge-interior.webp | Desks and a grey sofa sharing a 20x12 ft site office container interior |

### size-30x10

| Src | New filename | Alt text |
|---|---|---|
| (5) | site-office-container-30x10-hero-view.webp | Dark green 30x10 ft site office container at a metal-clad factory, hero angle |
| (1) | site-office-container-30x10-front-angle.webp | Powder blue 30x10 ft site office container with dark base, front corner view |
| (8) | site-office-container-30x10-side-elevation.webp | Cream 30x10 ft site office container with wind turbines behind, side elevation |
| (3) | site-office-container-30x10-workspace-interior.webp | Desk with green chairs and cabinet inside a 30x10 ft site office container |
| (9) | site-office-container-30x10-team-interior.webp | Desk rows with task chairs inside a 30x10 ft site office container |
| (7) | site-office-container-30x10-corner-interior.webp | Desk and long sideboard on wood floor in a 30x10 ft site office container |

### size-40x8

| Src | New filename | Alt text |
|---|---|---|
| (5) | site-office-container-40x8-hero-view.webp | White 40x8 ft site office container with dark base under a warehouse canopy |
| (2) | site-office-container-40x8-front-angle.webp | White 40x8 ft site office container with maroon base in a formal garden |
| (9) | site-office-container-40x8-side-elevation.webp | Charcoal 40x8 ft site office container on open lawn, side elevation |
| (4) | site-office-container-40x8-workspace-interior.webp | Desk with paired chairs midway along a 40x8 ft site office container |
| (1) | site-office-container-40x8-team-interior.webp | Desks the full length of a 40x8 ft site office container interior |
| (8) | site-office-container-40x8-corridor-interior.webp | Desks lining the right wall of a 40x8 ft site office container corridor |

### size-20x20

| Src | New filename | Alt text |
|---|---|---|
| (4) | site-office-container-20x20-hero-view.webp | Yellow site office container with green base, 20x20 ft, on a campus lawn, hero angle |
| (1) | site-office-container-20x20-front-angle.webp | Powder blue 20x20 ft site office container with green base, front corner view |
| (8) | site-office-container-20x20-side-elevation.webp | Sage green 20x20 ft site office container along a garden path, side elevation |
| (3) | site-office-container-20x20-workspace-interior.webp | Black desk and tall cabinet inside a 20x20 ft site office container |
| (9) | site-office-container-20x20-team-interior.webp | Open-plan desks on timber flooring inside a 20x20 ft site office container |
| (7) | site-office-container-20x20-corner-interior.webp | Dark desk with visitor chairs in a 20x20 ft site office container corner |

### size-40x10

| Src | New filename | Alt text |
|---|---|---|
| (2) | site-office-container-40x10-hero-view.webp | Teal 40x10 ft site office container near a comms tower, hero exterior |
| (5) | site-office-container-40x10-front-angle.webp | Cream 40x10 ft site office container at an industrial block, front corner view |
| (9) | site-office-container-40x10-side-elevation.webp | Navy blue 40x10 ft site office container beneath power lines, side elevation |
| (1) | site-office-container-40x10-entrance-interior.webp | Desk run facing a maroon door inside a 40x10 ft site office container |
| (8) | site-office-container-40x10-team-interior.webp | Desks spaced down a long 40x10 ft site office container room |
| (10) | site-office-container-40x10-corner-interior.webp | Workstations and drawer units inside a 40x10 ft site office container |

### size-40x12

| Src | New filename | Alt text |
|---|---|---|
| (2) | site-office-container-40x12-hero-view.webp | Green 40x12 ft site office container with port cranes behind, hero angle |
| (4) | site-office-container-40x12-front-angle.webp | Pale green and white 40x12 ft site office container at a warehouse, front view |
| (8) | site-office-container-40x12-side-elevation.webp | Blue 40x12 ft site office container at a seaside boulevard, side elevation |
| (3) | site-office-container-40x12-workspace-interior.webp | Timber desk near a red door inside a 40x12 ft site office container |
| (9) | site-office-container-40x12-team-interior.webp | Grey desks under the air conditioner in a 40x12 ft site office container |
| (7) | site-office-container-40x12-corner-interior.webp | Dark desks on wood flooring in a 40x12 ft site office container corner |

---

**Counts to verify at build:** 216 rows total · 54 per page · per size 3 exterior + 3 interior · all 216 filenames unique · all 216 alt strings unique · all descriptions distinct after stripping the product term and size.
