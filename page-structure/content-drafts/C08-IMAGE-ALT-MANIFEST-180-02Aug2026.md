# C-08 IMAGE AND ALT MANIFEST, 180 ROWS — 02 Aug 2026

Five pages x six sizes x six images. Every one of the 300 source images was opened and read from the five contact sheets in `tmp/c08-sheets`; cell numbers follow filename numbers. Selection per size: one Section 2 hero plus five gallery images, three exterior and three interior, porta-cabins parity.

**Implementation rules, verbatim under L4:**

1. Source: `D:\Project-shekhar\all-product-images\C-08\<product folder>\<size folder>\`. The `Src` column gives the view code in the source filename.
2. Convert each selected PNG to WebP using the same destination convention porta-cabins uses. Report the destination folder before converting. Target filename is the `New filename` column exactly.
3. Alt text is the `Alt text` column byte-exact, on every surface where that image renders.
4. Unselected source files are not deployed, not renamed, not moved.
5. Row order within each size is the render order: row one is the Section 2 hero, rows two to six are the gallery.
6. First hero per page eager, everything else lazy. Regenerate the image sitemap after wiring.
7. The two malformed `uxury-*` filenames and the leading-space shipping alt were already corrected in PR #111; this manifest supersedes the remaining legacy gallery wiring.

**Counts to verify at build:** 180 rows, 36 per page, 6 per size, 3 exterior and 3 interior per size, 180 unique filenames, 180 unique alt strings, 180 distinct descriptions after stripping the product term and size.


---

## Container Houses (hub) — /product/container-houses

Source folder: `container-house`


### 20x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | container-houses-20x8-front-right-hero.webp | Front-right hero view of a 20x8 ft container house, white steel cladding, on a paved court in a hillside garden |
| I01 | container-houses-20x8-entry-living-hall.webp | Entry and living area inside a 20x8 ft container house, with a compact living seat and dining nook |
| E03 | container-houses-20x8-long-side-elevation.webp | Long side elevation of a 20x8 ft container house showing the full window run, white steel cladding, on a paved court in a hillside garden |
| E06 | container-houses-20x8-elevated-three-quarter.webp | Elevated three-quarter view over a 20x8 ft container house, white steel cladding, on a paved court in a hillside garden |
| I02 | container-houses-20x8-kitchen-dining.webp | Kitchen and dining zone inside a 20x8 ft container house, with a galley kitchen running to a dining table |
| I03 | container-houses-20x8-bedroom-view.webp | Bedroom inside a 20x8 ft container house, with a bed against timber-panelled wall |

### 20x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | container-houses-20x10-front-right-hero.webp | Front-right hero view of a 20x10 ft container house, cream cladding with a pale base, on paving with planted borders and mountains behind |
| I01 | container-houses-20x10-entry-living-hall.webp | Entry and living area inside a 20x10 ft container house, with a long living run with a low TV console |
| E02 | container-houses-20x10-front-left-angle.webp | Front-left angle on a 20x10 ft container house in cream cladding with a pale base, on paving with planted borders and mountains behind |
| E05 | container-houses-20x10-end-dominant-view.webp | End view of a 20x10 ft container house, cream cladding with a pale base, on paving with planted borders and mountains behind |
| I03 | container-houses-20x10-bedroom-view.webp | Bedroom inside a 20x10 ft container house, with a curtained bedroom with a window seat |
| I04 | container-houses-20x10-bathroom-reverse.webp | Looking back through a 20x10 ft container house towards a WC and basin beyond the sliding door |

### 20x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | container-houses-20x12-front-right-hero.webp | Front-right hero view of a 20x12 ft container house, sage green cladding, on a lawn edge below a rocky ridge |
| I01 | container-houses-20x12-entry-living-hall.webp | Entry and living area inside a 20x12 ft container house, with a sofa facing a wall-mounted screen |
| E04 | container-houses-20x12-rear-right-angle.webp | Rear-right angle on a 20x12 ft container house, sage green cladding, on a lawn edge below a rocky ridge |
| E06 | container-houses-20x12-elevated-three-quarter.webp | Elevated three-quarter view over a 20x12 ft container house, sage green cladding, on a lawn edge below a rocky ridge |
| I02 | container-houses-20x12-kitchen-dining.webp | Kitchen and dining zone inside a 20x12 ft container house, with an open kitchen with a round dining table |
| I04 | container-houses-20x12-bathroom-reverse.webp | Looking back through a 20x12 ft container house towards a shower room reached past the dining area |

### 40x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | container-houses-40x8-front-right-hero.webp | Front-right hero view of a 40x8 ft container house, blue-grey cladding, on red-earth paving in a tropical garden |
| I01 | container-houses-40x8-entry-living-hall.webp | Entry and living area inside a 40x8 ft container house, with a living seat under recessed lighting |
| E03 | container-houses-40x8-long-side-elevation.webp | Long side elevation of a 40x8 ft container house showing the full window run, blue-grey cladding, on red-earth paving in a tropical garden |
| E05 | container-houses-40x8-end-dominant-view.webp | End-on view of a 40x8 ft container house with the gable glazing lit, blue-grey cladding, on red-earth paving in a tropical garden |
| I02 | container-houses-40x8-kitchen-dining.webp | Kitchen and dining zone inside a 40x8 ft container house, with a kitchen bar with upholstered dining chairs |
| I03 | container-houses-40x8-bedroom-view.webp | Bedroom inside a 40x8 ft container house, with a bed under a slim high-level window |

### 40x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | container-houses-40x10-front-right-hero.webp | Front-right hero view of a 40x10 ft container house, charcoal cladding, on stone paving cut into a wooded slope |
| I01 | container-houses-40x10-entry-living-hall.webp | Entry and living area inside a 40x10 ft container house, with a lounge opening onto a full-height glazed wall |
| E02 | container-houses-40x10-front-left-angle.webp | Front-left angle on a 40x10 ft container house in charcoal cladding, on stone paving cut into a wooded slope |
| E06 | container-houses-40x10-elevated-three-quarter.webp | Elevated three-quarter view over a 40x10 ft container house, charcoal cladding, on stone paving cut into a wooded slope |
| I03 | container-houses-40x10-bedroom-view.webp | Bedroom inside a 40x10 ft container house, with a bedroom with wardrobes and a corner window |
| I04 | container-houses-40x10-bathroom-reverse.webp | Looking back through a 40x10 ft container house towards a WC with a laundry appliance recessed opposite |

### 40x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | container-houses-40x12-front-right-hero.webp | Front-right hero view of a 40x12 ft container house, sand-toned cladding, on gravel among vineyard hills in jacaranda bloom |
| I01 | container-houses-40x12-entry-living-hall.webp | Entry and living area inside a 40x12 ft container house, with a lounge with a rug and full-width glazing |
| E04 | container-houses-40x12-rear-right-angle.webp | Rear-right angle on a 40x12 ft container house, sand-toned cladding, on gravel among vineyard hills in jacaranda bloom |
| E03 | container-houses-40x12-long-side-elevation.webp | Side elevation of a 40x12 ft container house, sand-toned cladding, on gravel among vineyard hills in jacaranda bloom |
| I02 | container-houses-40x12-kitchen-dining.webp | Kitchen and dining zone inside a 40x12 ft container house, with a dining table under pendant lighting |
| I04 | container-houses-40x12-bathroom-reverse.webp | Looking back through a 40x12 ft container house towards a bathroom with a laundry recess alongside |

---

## Prefab Container Homes — /product/container-houses/prefab-container-homes

Source folder: `prefab-container-homes`


### 20x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | prefab-container-homes-20x8-front-right-hero.webp | Front-right hero view of a 20x8 ft prefab container home, pale silver-grey cladding, on a clipped formal lawn with a paved grid court |
| I01 | prefab-container-homes-20x8-entry-living-hall.webp | Entry and living area inside a 20x8 ft prefab container home, with a compact sofa with a folding dining table |
| E03 | prefab-container-homes-20x8-long-side-elevation.webp | Side elevation of a 20x8 ft prefab container home, pale silver-grey cladding, on a clipped formal lawn with a paved grid court |
| E06 | prefab-container-homes-20x8-elevated-three-quarter.webp | Elevated three-quarter view over a 20x8 ft prefab container home, pale silver-grey cladding, on a clipped formal lawn with a paved grid court |
| I02 | prefab-container-homes-20x8-kitchen-dining.webp | Kitchen and dining zone inside a 20x8 ft prefab container home, with a kitchenette facing a two-seat dining set |
| I03 | prefab-container-homes-20x8-bedroom-view.webp | Bedroom inside a 20x8 ft prefab container home, with a bed with blue linen under a high window |

### 20x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | prefab-container-homes-20x10-front-right-hero.webp | Front-right hero view of a 20x10 ft prefab container home, olive green cladding, on red-earth borders under flowering trees |
| I01 | prefab-container-homes-20x10-entry-living-hall.webp | Entry and living area inside a 20x10 ft prefab container home, with a living run with a low media unit |
| E02 | prefab-container-homes-20x10-front-left-angle.webp | Front-left angle on a 20x10 ft prefab container home in olive green cladding, on red-earth borders under flowering trees |
| E05 | prefab-container-homes-20x10-end-dominant-view.webp | End-on view of a 20x10 ft prefab container home with the gable glazing lit, olive green cladding, on red-earth borders under flowering trees |
| I03 | prefab-container-homes-20x10-bedroom-view.webp | Bedroom inside a 20x10 ft prefab container home, with a bedroom with fitted timber wardrobes |
| I04 | prefab-container-homes-20x10-bathroom-reverse.webp | Looking back through a 20x10 ft prefab container home towards a WC and basin beside the wardrobe wall |

### 20x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | prefab-container-homes-20x12-front-right-hero.webp | Front-right hero view of a 20x12 ft prefab container home, terracotta cladding, on lawn edging a paved villa court |
| I01 | prefab-container-homes-20x12-entry-living-hall.webp | Entry and living area inside a 20x12 ft prefab container home, with a long sofa facing a wall screen |
| E04 | prefab-container-homes-20x12-rear-right-angle.webp | Rear-right angle on a 20x12 ft prefab container home, terracotta cladding, on lawn edging a paved villa court |
| E06 | prefab-container-homes-20x12-elevated-three-quarter.webp | Elevated three-quarter view over a 20x12 ft prefab container home, terracotta cladding, on lawn edging a paved villa court |
| I02 | prefab-container-homes-20x12-kitchen-dining.webp | Kitchen and dining zone inside a 20x12 ft prefab container home, with an open kitchen island with dining seating |
| I04 | prefab-container-homes-20x12-bathroom-reverse.webp | Looking back through a 20x12 ft prefab container home towards a shower room off the dining end |

### 40x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | prefab-container-homes-40x8-front-right-hero.webp | Front-right hero view of a 40x8 ft prefab container home, teal cladding, on paving beside clipped hedges and roses |
| I01 | prefab-container-homes-40x8-entry-living-hall.webp | Entry and living area inside a 40x8 ft prefab container home, with a sofa with a coffee table on timber flooring |
| E03 | prefab-container-homes-40x8-long-side-elevation.webp | Long side elevation of a 40x8 ft prefab container home showing the full window run, teal cladding, on paving beside clipped hedges and roses |
| E05 | prefab-container-homes-40x8-end-dominant-view.webp | End-on view of a 40x8 ft prefab container home with the gable glazing lit, teal cladding, on paving beside clipped hedges and roses |
| I02 | prefab-container-homes-40x8-kitchen-dining.webp | Kitchen and dining zone inside a 40x8 ft prefab container home, with a kitchen with a solid timber dining table |
| I03 | prefab-container-homes-40x8-bedroom-view.webp | Bedroom inside a 40x8 ft prefab container home, with a bed under a narrow ribbon window |

### 40x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | prefab-container-homes-40x10-front-right-hero.webp | Front-right hero view of a 40x10 ft prefab container home, slate blue cladding, on wet stone paving on a forested hillside |
| I01 | prefab-container-homes-40x10-entry-living-hall.webp | Entry and living area inside a 40x10 ft prefab container home, with a lounge with a low bench and sliding doors |
| E02 | prefab-container-homes-40x10-front-left-angle.webp | Front-left angle on a 40x10 ft prefab container home in slate blue cladding, on wet stone paving on a forested hillside |
| E06 | prefab-container-homes-40x10-elevated-three-quarter.webp | Elevated three-quarter view over a 40x10 ft prefab container home, slate blue cladding, on wet stone paving on a forested hillside |
| I03 | prefab-container-homes-40x10-bedroom-view.webp | Bedroom inside a 40x10 ft prefab container home, with a bedroom with a timber wardrobe wall |
| I04 | prefab-container-homes-40x10-bathroom-reverse.webp | Looking back through a 40x10 ft prefab container home towards a shower and WC facing a laundry recess |

### 40x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | prefab-container-homes-40x12-front-right-hero.webp | Front-right hero view of a 40x12 ft prefab container home, dark bronze cladding, on paving with a timber deck under mountains |
| I01 | prefab-container-homes-40x12-entry-living-hall.webp | Entry and living area inside a 40x12 ft prefab container home, with a lounge with sliding doors to the deck |
| E04 | prefab-container-homes-40x12-rear-right-angle.webp | Rear-right angle on a 40x12 ft prefab container home, dark bronze cladding, on paving with a timber deck under mountains |
| E03 | prefab-container-homes-40x12-long-side-elevation.webp | Side elevation of a 40x12 ft prefab container home, dark bronze cladding, on paving with a timber deck under mountains |
| I02 | prefab-container-homes-40x12-kitchen-dining.webp | Kitchen and dining zone inside a 40x12 ft prefab container home, with an island kitchen with a timber dining table |
| I04 | prefab-container-homes-40x12-bathroom-reverse.webp | Looking back through a 40x12 ft prefab container home towards a bathroom with laundry appliances alongside |

---

## Luxury Container Houses — /product/container-houses/luxury-container-houses

Source folder: `luxury-container-houses`


### 20x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | luxury-container-houses-20x8-front-right-hero.webp | Front-right hero view of a 20x8 ft luxury container house, white cladding with a dark plinth, on red laterite ground among coastal palms |
| I01 | luxury-container-houses-20x8-entry-living-hall.webp | Entry and living area inside a 20x8 ft luxury container house, with a linen sofa with a compact dining table |
| E03 | luxury-container-houses-20x8-long-side-elevation.webp | Side elevation of a 20x8 ft luxury container house, white cladding with a dark plinth, on red laterite ground among coastal palms |
| E06 | luxury-container-houses-20x8-elevated-three-quarter.webp | Elevated three-quarter view over a 20x8 ft luxury container house, white cladding with a dark plinth, on red laterite ground among coastal palms |
| I02 | luxury-container-houses-20x8-kitchen-dining.webp | Kitchen and dining zone inside a 20x8 ft luxury container house, with a slim work counter facing built-in shelving |
| I03 | luxury-container-houses-20x8-bedroom-view.webp | Bedroom inside a 20x8 ft luxury container house, with a bed with a padded headboard and reading lights |

### 20x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | luxury-container-houses-20x10-front-right-hero.webp | Front-right hero view of a 20x10 ft luxury container house, mid-grey cladding, on a paved terrace beside a backwater lagoon |
| I01 | luxury-container-houses-20x10-entry-living-hall.webp | Entry and living area inside a 20x10 ft luxury container house, with a lounge with a media wall and sliding doors |
| E02 | luxury-container-houses-20x10-front-left-angle.webp | Front-left angle on a 20x10 ft luxury container house in mid-grey cladding, on a paved terrace beside a backwater lagoon |
| E05 | luxury-container-houses-20x10-end-dominant-view.webp | End-on view of a 20x10 ft luxury container house with the gable glazing lit, mid-grey cladding, on a paved terrace beside a backwater lagoon |
| I03 | luxury-container-houses-20x10-bedroom-view.webp | Bedroom inside a 20x10 ft luxury container house, with a bedroom with wardrobes and a garden window |
| I04 | luxury-container-houses-20x10-bathroom-reverse.webp | Looking back through a 20x10 ft luxury container house towards a bathroom with a vanity mirror wall |

### 20x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | luxury-container-houses-20x12-front-right-hero.webp | Front-right hero view of a 20x12 ft luxury container house, near-black cladding, on a terrace above a bay with bougainvillea |
| I01 | luxury-container-houses-20x12-entry-living-hall.webp | Entry and living area inside a 20x12 ft luxury container house, with a lounge with an armchair and rug |
| E04 | luxury-container-houses-20x12-rear-right-angle.webp | Rear-right angle on a 20x12 ft luxury container house, near-black cladding, on a terrace above a bay with bougainvillea |
| E06 | luxury-container-houses-20x12-elevated-three-quarter.webp | Elevated three-quarter view over a 20x12 ft luxury container house, near-black cladding, on a terrace above a bay with bougainvillea |
| I02 | luxury-container-houses-20x12-kitchen-dining.webp | Kitchen and dining zone inside a 20x12 ft luxury container house, with a dining table beside a dark timber kitchen |
| I04 | luxury-container-houses-20x12-bathroom-reverse.webp | Looking back through a 20x12 ft luxury container house towards a mirrored bathroom off the living end |

### 40x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | luxury-container-houses-40x8-front-right-hero.webp | Front-right hero view of a 40x8 ft luxury container house, dark brown cladding, on a eucalyptus slope with hydrangea beds |
| I01 | luxury-container-houses-40x8-entry-living-hall.webp | Entry and living area inside a 40x8 ft luxury container house, with a sofa with a timber coffee table |
| E03 | luxury-container-houses-40x8-long-side-elevation.webp | Side elevation of a 40x8 ft luxury container house, dark brown cladding, on a eucalyptus slope with hydrangea beds |
| E05 | luxury-container-houses-40x8-end-dominant-view.webp | End-on view of a 40x8 ft luxury container house with the gable glazing lit, dark brown cladding, on a eucalyptus slope with hydrangea beds |
| I02 | luxury-container-houses-40x8-kitchen-dining.webp | Kitchen and dining zone inside a 40x8 ft luxury container house, with a dining table beneath pendant lights |
| I03 | luxury-container-houses-40x8-bedroom-view.webp | Bedroom inside a 40x8 ft luxury container house, with a bed under a slim window with a bedside lamp |

### 40x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | luxury-container-houses-40x10-front-right-hero.webp | Front-right hero view of a 40x10 ft luxury container house, powder blue cladding, on a misty pine hillside |
| I01 | luxury-container-houses-40x10-entry-living-hall.webp | Entry and living area inside a 40x10 ft luxury container house, with a corner sofa opening to a glazed wall |
| E02 | luxury-container-houses-40x10-front-left-angle.webp | Front-left angle on a 40x10 ft luxury container house in powder blue cladding, on a misty pine hillside |
| E06 | luxury-container-houses-40x10-elevated-three-quarter.webp | Elevated three-quarter view over a 40x10 ft luxury container house, powder blue cladding, on a misty pine hillside |
| I03 | luxury-container-houses-40x10-bedroom-view.webp | Bedroom inside a 40x10 ft luxury container house, with a bedroom with soft blue bedding |
| I04 | luxury-container-houses-40x10-bathroom-reverse.webp | Looking back through a 40x10 ft luxury container house towards a shower and WC with shelving beside them |

### 40x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | luxury-container-houses-40x12-front-right-hero.webp | Front-right hero view of a 40x12 ft luxury container house, steel blue cladding with a blue roof, on a tea-estate slope framed by pines |
| I01 | luxury-container-houses-40x12-entry-living-hall.webp | Entry and living area inside a 40x12 ft luxury container house, with a lounge with a rug and armchairs |
| E04 | luxury-container-houses-40x12-rear-right-angle.webp | Rear-right angle on a 40x12 ft luxury container house, steel blue cladding with a blue roof, on a tea-estate slope framed by pines |
| E03 | luxury-container-houses-40x12-long-side-elevation.webp | Side elevation of a 40x12 ft luxury container house, steel blue cladding with a blue roof, on a tea-estate slope framed by pines |
| I02 | luxury-container-houses-40x12-kitchen-dining.webp | Kitchen and dining zone inside a 40x12 ft luxury container house, with a navy island kitchen with a dining table |
| I04 | luxury-container-houses-40x12-bathroom-reverse.webp | Looking back through a 40x12 ft luxury container house towards a bathroom with laundry appliances built in |

---

## Shipping Container Homes — /product/container-houses/shipping-container-homes

Source folder: `shipping-container-homes`


### 20x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | shipping-container-homes-20x8-front-right-hero.webp | Front-right hero view of a 20x8 ft shipping container home, dark green cladding, on a coastal hillside above the sea |
| I01 | shipping-container-homes-20x8-entry-living-hall.webp | Entry and living area inside a 20x8 ft shipping container home, with a sofa with a round side table |
| E03 | shipping-container-homes-20x8-long-side-elevation.webp | Long side elevation of a 20x8 ft shipping container home showing the full window run, dark green cladding, on a coastal hillside above the sea |
| E06 | shipping-container-homes-20x8-elevated-three-quarter.webp | Elevated three-quarter view over a 20x8 ft shipping container home, dark green cladding, on a coastal hillside above the sea |
| I02 | shipping-container-homes-20x8-kitchen-dining.webp | Kitchen and dining zone inside a 20x8 ft shipping container home, with a kitchen island with two stools |
| I03 | shipping-container-homes-20x8-bedroom-view.webp | Bedroom inside a 20x8 ft shipping container home, with a bed with a green throw under a garden window |

### 20x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | shipping-container-homes-20x10-front-right-hero.webp | Front-right hero view of a 20x10 ft shipping container home, sand-toned cladding, on a paved suburban court behind low hedges |
| I01 | shipping-container-homes-20x10-entry-living-hall.webp | Entry and living area inside a 20x10 ft shipping container home, with a rust-red sofa facing a media wall |
| E02 | shipping-container-homes-20x10-front-left-angle.webp | Front-left angle on a 20x10 ft shipping container home in sand-toned cladding, on a paved suburban court behind low hedges |
| E05 | shipping-container-homes-20x10-end-dominant-view.webp | End-on view of a 20x10 ft shipping container home with the gable glazing lit, sand-toned cladding, on a paved suburban court behind low hedges |
| I03 | shipping-container-homes-20x10-bedroom-view.webp | Bedroom inside a 20x10 ft shipping container home, with a bedroom with a terracotta throw |
| I04 | shipping-container-homes-20x10-bathroom-reverse.webp | Looking back through a 20x10 ft shipping container home towards a shower room with a fitted vanity |

### 20x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | shipping-container-homes-20x12-front-right-hero.webp | Front-right hero view of a 20x12 ft shipping container home, dark grey cladding, on paving with planters below apartment blocks |
| I01 | shipping-container-homes-20x12-entry-living-hall.webp | Entry and living area inside a 20x12 ft shipping container home, with a sofa and low table on pale flooring |
| E04 | shipping-container-homes-20x12-rear-right-angle.webp | Rear-right angle on a 20x12 ft shipping container home, dark grey cladding, on paving with planters below apartment blocks |
| E06 | shipping-container-homes-20x12-elevated-three-quarter.webp | Elevated three-quarter view over a 20x12 ft shipping container home, dark grey cladding, on paving with planters below apartment blocks |
| I02 | shipping-container-homes-20x12-kitchen-dining.webp | Kitchen and dining zone inside a 20x12 ft shipping container home, with a kitchen with a four-seat dining table |
| I04 | shipping-container-homes-20x12-bathroom-reverse.webp | Looking back through a 20x12 ft shipping container home towards a bathroom with a glazed shower screen |

### 40x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | shipping-container-homes-40x8-front-right-hero.webp | Front-right hero view of a 40x8 ft shipping container home, rust-brown cladding, on wet paving below a waterfall ridge |
| I01 | shipping-container-homes-40x8-entry-living-hall.webp | Entry and living area inside a 40x8 ft shipping container home, with a sofa with a timber coffee table |
| E03 | shipping-container-homes-40x8-long-side-elevation.webp | Long side elevation of a 40x8 ft shipping container home showing the full window run, rust-brown cladding, on wet paving below a waterfall ridge |
| E05 | shipping-container-homes-40x8-end-dominant-view.webp | End-on view of a 40x8 ft shipping container home with the gable glazing lit, rust-brown cladding, on wet paving below a waterfall ridge |
| I02 | shipping-container-homes-40x8-kitchen-dining.webp | Kitchen and dining zone inside a 40x8 ft shipping container home, with a kitchen counter with a dining set |
| I03 | shipping-container-homes-40x8-bedroom-view.webp | Bedroom inside a 40x8 ft shipping container home, with a bed beside a slim corner window |

### 40x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | shipping-container-homes-40x10-front-right-hero.webp | Front-right hero view of a 40x10 ft shipping container home, white cladding, on gravel among tea-covered hills and palms |
| I01 | shipping-container-homes-40x10-entry-living-hall.webp | Entry and living area inside a 40x10 ft shipping container home, with a corner sofa facing a long media wall |
| E02 | shipping-container-homes-40x10-front-left-angle.webp | Front-left angle on a 40x10 ft shipping container home in white cladding, on gravel among tea-covered hills and palms |
| E06 | shipping-container-homes-40x10-elevated-three-quarter.webp | Elevated three-quarter view over a 40x10 ft shipping container home, white cladding, on gravel among tea-covered hills and palms |
| I03 | shipping-container-homes-40x10-bedroom-view.webp | Bedroom inside a 40x10 ft shipping container home, with a bedroom with a timber panel wall |
| I04 | shipping-container-homes-40x10-bathroom-reverse.webp | Looking back through a 40x10 ft shipping container home towards a WC with a laundry recess opposite |

### 40x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | shipping-container-homes-40x12-front-right-hero.webp | Front-right hero view of a 40x12 ft shipping container home, navy cladding, on stone paving in an arid hill village |
| I01 | shipping-container-homes-40x12-entry-living-hall.webp | Entry and living area inside a 40x12 ft shipping container home, with a lounge with a sectional sofa and rug |
| E04 | shipping-container-homes-40x12-rear-right-angle.webp | Rear-right angle on a 40x12 ft shipping container home, navy cladding, on stone paving in an arid hill village |
| E03 | shipping-container-homes-40x12-long-side-elevation.webp | Long side elevation of a 40x12 ft shipping container home showing the full window run, navy cladding, on stone paving in an arid hill village |
| I02 | shipping-container-homes-40x12-kitchen-dining.webp | Kitchen and dining zone inside a 40x12 ft shipping container home, with a kitchen run with a timber dining table |
| I04 | shipping-container-homes-40x12-bathroom-reverse.webp | Looking back through a 40x12 ft shipping container home towards a bathroom with a shower and laundry stack |

---

## Affordable Container Homes — /product/container-houses/affordable-container-homes

Source folder: `affordable-container-homes`


### 20x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | affordable-container-homes-20x8-front-right-hero.webp | Front-right hero view of a 20x8 ft affordable container home, light grey cladding, on grass at the edge of an orchard |
| I01 | affordable-container-homes-20x8-entry-living-hall.webp | Entry and living area inside a 20x8 ft affordable container home, with a compact sofa with a low table |
| E03 | affordable-container-homes-20x8-long-side-elevation.webp | Long side elevation of a 20x8 ft affordable container home showing the full window run, light grey cladding, on grass at the edge of an orchard |
| E06 | affordable-container-homes-20x8-elevated-three-quarter.webp | Elevated three-quarter view over a 20x8 ft affordable container home, light grey cladding, on grass at the edge of an orchard |
| I02 | affordable-container-homes-20x8-kitchen-dining.webp | Kitchen and dining zone inside a 20x8 ft affordable container home, with a kitchen counter with a breakfast bar |
| I03 | affordable-container-homes-20x8-bedroom-view.webp | Bedroom inside a 20x8 ft affordable container home, with a bed with grey linen beside a wardrobe |

### 20x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | affordable-container-homes-20x10-front-right-hero.webp | Front-right hero view of a 20x10 ft affordable container home, teal cladding, on a paved plot in a coastal palm village |
| I01 | affordable-container-homes-20x10-entry-living-hall.webp | Entry and living area inside a 20x10 ft affordable container home, with a sofa facing a media unit |
| E02 | affordable-container-homes-20x10-front-left-angle.webp | Front-left angle on a 20x10 ft affordable container home in teal cladding, on a paved plot in a coastal palm village |
| E05 | affordable-container-homes-20x10-end-dominant-view.webp | End-on view of a 20x10 ft affordable container home with the gable glazing lit, teal cladding, on a paved plot in a coastal palm village |
| I03 | affordable-container-homes-20x10-bedroom-view.webp | Bedroom inside a 20x10 ft affordable container home, with a bedroom with fitted wardrobes |
| I04 | affordable-container-homes-20x10-bathroom-reverse.webp | Looking back through a 20x10 ft affordable container home towards a shower room with a basin and mirror |

### 20x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | affordable-container-homes-20x12-front-right-hero.webp | Front-right hero view of a 20x12 ft affordable container home, brown cladding, on stone paving above a river gorge |
| I01 | affordable-container-homes-20x12-entry-living-hall.webp | Entry and living area inside a 20x12 ft affordable container home, with a sofa with a rug and side lamp |
| E04 | affordable-container-homes-20x12-rear-right-angle.webp | Rear-right angle on a 20x12 ft affordable container home, brown cladding, on stone paving above a river gorge |
| E06 | affordable-container-homes-20x12-elevated-three-quarter.webp | Elevated three-quarter view over a 20x12 ft affordable container home, brown cladding, on stone paving above a river gorge |
| I02 | affordable-container-homes-20x12-kitchen-dining.webp | Kitchen and dining zone inside a 20x12 ft affordable container home, with a kitchen with a dining table beside the window |
| I04 | affordable-container-homes-20x12-bathroom-reverse.webp | Looking back through a 20x12 ft affordable container home towards a WC and basin off the corridor |

### 40x8 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | affordable-container-homes-40x8-front-right-hero.webp | Front-right hero view of a 40x8 ft affordable container home, khaki cladding, on desert scrub among agave planting |
| I01 | affordable-container-homes-40x8-entry-living-hall.webp | Entry and living area inside a 40x8 ft affordable container home, with a bench seat with a slim dining counter |
| E03 | affordable-container-homes-40x8-long-side-elevation.webp | Long side elevation of a 40x8 ft affordable container home showing the full window run, khaki cladding, on desert scrub among agave planting |
| E05 | affordable-container-homes-40x8-end-dominant-view.webp | End-on view of a 40x8 ft affordable container home with the gable glazing lit, khaki cladding, on desert scrub among agave planting |
| I02 | affordable-container-homes-40x8-kitchen-dining.webp | Kitchen and dining zone inside a 40x8 ft affordable container home, with a kitchen with a mustard dining chair set |
| I03 | affordable-container-homes-40x8-bedroom-view.webp | Bedroom inside a 40x8 ft affordable container home, with a bed with a mustard throw |

### 40x10 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | affordable-container-homes-40x10-front-right-hero.webp | Front-right hero view of a 40x10 ft affordable container home, pale grey cladding, on gravel in a forested valley |
| I01 | affordable-container-homes-40x10-entry-living-hall.webp | Entry and living area inside a 40x10 ft affordable container home, with a sofa and coffee table on timber flooring |
| E02 | affordable-container-homes-40x10-front-left-angle.webp | Front-left angle on a 40x10 ft affordable container home in pale grey cladding, on gravel in a forested valley |
| E06 | affordable-container-homes-40x10-elevated-three-quarter.webp | Elevated three-quarter view over a 40x10 ft affordable container home, pale grey cladding, on gravel in a forested valley |
| I03 | affordable-container-homes-40x10-bedroom-view.webp | Bedroom inside a 40x10 ft affordable container home, with a bedroom with a corner window |
| I04 | affordable-container-homes-40x10-bathroom-reverse.webp | Looking back through a 40x10 ft affordable container home towards a WC and basin with laundry opposite |

### 40x12 ft

| Src | New filename | Alt text |
|---|---|---|
| E01 | affordable-container-homes-40x12-front-right-hero.webp | Front-right hero view of a 40x12 ft affordable container home, red-oxide cladding, on open rural ground with fields behind |
| I01 | affordable-container-homes-40x12-entry-living-hall.webp | Entry and living area inside a 40x12 ft affordable container home, with a lounge with a pink throw and media unit |
| E04 | affordable-container-homes-40x12-rear-right-angle.webp | Rear-right angle on a 40x12 ft affordable container home, red-oxide cladding, on open rural ground with fields behind |
| E03 | affordable-container-homes-40x12-long-side-elevation.webp | Side elevation of a 40x12 ft affordable container home, red-oxide cladding, on open rural ground with fields behind |
| I02 | affordable-container-homes-40x12-kitchen-dining.webp | Kitchen and dining zone inside a 40x12 ft affordable container home, with a kitchen counter with a long dining table |
| I04 | affordable-container-homes-40x12-bathroom-reverse.webp | Looking back through a 40x12 ft affordable container home towards a shower room off the corridor |

## Dated amendment — 03 Aug 2026

This amendment supersedes one alt without editing the approved 02 Aug 2026 manifest row in place.

- **Row replaced:** `luxury-container-houses` / `40x8` / `I01`
- **Filename:** `luxury-container-houses-40x8-entry-living-hall.webp`
- **Original approved wording retained above:** `Entry and living area inside a 40x8 ft luxury container house, with a sofa with a timber coffee table`
- **Superseding approved alt:** `Entry and living area inside a 40x8 ft luxury container house, with a linen sofa and a low timber table beneath framed artwork.`
- **Reason:** resolves the approved seven-gram collision between luxury 40x8 I01 and shipping 40x8 I01.
- **Effective date:** 03 Aug 2026

<!-- C08_ALT_AMENDMENT {"date":"2026-08-03","slug":"luxury-container-houses","sizeSlug":"40x8","sourceViewToken":"I01","filename":"luxury-container-houses-40x8-entry-living-hall.webp","originalAlt":"Entry and living area inside a 40x8 ft luxury container house, with a sofa with a timber coffee table","supersedingAlt":"Entry and living area inside a 40x8 ft luxury container house, with a linen sofa and a low timber table beneath framed artwork."} -->
