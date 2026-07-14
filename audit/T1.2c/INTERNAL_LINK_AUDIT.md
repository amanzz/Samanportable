# T1.2c Internal Link Audit

Part A audit only. This file was generated before any content rewrite; the only Part A write target is `audit/T1.2c/`.

## Base

- Branch: feat/shikhar-T1.2c-internal-links
- HEAD: bc01ab73e13688161be2bd3b0939daa68e5bd949
- Scope: parsed blog post bodies in `src/data/wp-export/posts/*.json` plus TSX pages/components in `src/pages/**/*.tsx` and `src/components/**/*.tsx`.
- Static href forms audited: HTML `<a href=`, JSX `<a href=`, and Next `<Link href=` string-literal values.

## T1.2 21-Rule Map Verification

- Rules copied from the T1.2/T1.2b redirect block in `next.config.js`: 21
- Mismatches against `next.config.js`: 0

| Product-category slug | Canonical hub slug | Source present | Destination present |
| --- | --- | --- | --- |
| container-cafe | container-cafe | yes | yes |
| container-houses | container-houses | yes | yes |
| container-offices | container-offices | yes | yes |
| industrial-sheds | industrial-sheds | yes | yes |
| labor-colony | labor-colony | yes | yes |
| peb-constructions | peb-constructions | yes | yes |
| porta-cabins | porta-cabins | yes | yes |
| portable-cabin | portable-cabin | yes | yes |
| portable-office | portable-office | yes | yes |
| portable-toilet | portable-toilet | yes | yes |
| pre-engineered-buildings | pre-engineered-buildings | yes | yes |
| prefab-buildings | prefab-buildings | yes | yes |
| prefabricated-houses | prefabricated-houses | yes | yes |
| security-cabins | security-cabins | yes | yes |
| eps-panel | eps-panel | yes | yes |
| glass-wool-panel | glass-wool-panel | yes | yes |
| pir-panel | pir-panel | yes | yes |
| puf-panel | puf-panel | yes | yes |
| rockwool-panel | rockwool-panel | yes | yes |
| roofing-sheets | roofing-sheet | yes | yes |
| sandwich-panel | sandwich-panel | yes | yes |

## Blog Post Bodies

- Post JSON files scanned: 360
- Posts containing at least one mapped `/product-category/*` href: 287
- Total mapped href count: 425

### Blog Slug Distribution

| Slug | Count |
| --- | --- |
| container-cafe | 11 |
| container-houses | 9 |
| container-offices | 79 |
| industrial-sheds | 8 |
| labor-colony | 35 |
| peb-constructions | 5 |
| porta-cabins | 122 |
| portable-cabin | 101 |
| portable-office | 35 |
| portable-toilet | 3 |
| pre-engineered-buildings | 1 |
| prefab-buildings | 5 |
| prefabricated-houses | 11 |

### Blog Files With Matches

| File | Count | Slug counts |
| --- | --- | --- |
| src/data/wp-export/posts/10-foot-shipping-container-office-perfect-fit-for-small-spaces.json | 4 | container-offices: 4 |
| src/data/wp-export/posts/12ft-office-container-smart-choice-for-growing-startups.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/18-benefits-of-luxury-portable-cabin.json | 2 | container-houses: 1, portable-cabin: 1 |
| src/data/wp-export/posts/20ft-container-office.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/2nd-hand-containers.json | 1 | container-houses: 1 |
| src/data/wp-export/posts/2nd-hand-porta-cabins.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/6-reasons-benefits-2-buy-portable-building.json | 1 | portable-office: 1 |
| src/data/wp-export/posts/7-tips-for-choosing-the-perfect-portable-cabin-location.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/affordable-office-containers-for-sale.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/affordable-porta-cabins-in-hosur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/best-container-cafe-designs-for-experience.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/best-container-office-solutions.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/best-porta-cabin-manufacturer-ncr.json | 3 | porta-cabins: 3 |
| src/data/wp-export/posts/best-porta-cabins-in-bangalore.json | 4 | porta-cabins: 3, prefab-buildings: 1 |
| src/data/wp-export/posts/best-portable-cabins-in-india.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/budget-friendly-office-workspace-alternatives.json | 1 | portable-office: 1 |
| src/data/wp-export/posts/build-a-prefabricated-modular-houses.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/cheap-office-trailers-for-sale.json | 1 | portable-office: 1 |
| src/data/wp-export/posts/cheap-porta-cabins-for-sale.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/cheap-portable-cabins.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/container-cafes-in-central-delhi.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-east-delhi.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-faridabad.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-ghaziabad.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-greater-noida.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-gurgaon.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-noida.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-north-delhi.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-south-delhi.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-cafes-in-west-delhi.json | 1 | container-cafe: 1 |
| src/data/wp-export/posts/container-house-price-in-tamil-nadu.json | 1 | container-houses: 1 |
| src/data/wp-export/posts/container-houses-cost-guide-2024.json | 4 | container-houses: 4 |
| src/data/wp-export/posts/container-office-design.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-ahmedabad.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-bangalore.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-chennai.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-coimbatore.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-delhi.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-hyderabad.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-jaipur.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-kochi.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-kolkata.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-lucknow.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-madurai.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-mangalore.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-mumbai.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-mysore.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-pune.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-surat.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-vijayawada.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-in-visakhapatnam.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-office-rental-is-perfect-solution.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-anekal.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-banashankari.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-bannerghatta-road.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-bellandur.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-bommasandra.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-btm-layout.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-domlur.json | 2 | container-offices: 2 |
| src/data/wp-export/posts/container-offices-for-sale-in-electronic-city.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-frazer-town.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-hebbal.json | 2 | container-offices: 2 |
| src/data/wp-export/posts/container-offices-for-sale-in-hennur.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-hoskote.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-hosur.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-hsr-layout.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-jayanagar.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-jigani.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-jp-nagar.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-kengeri.json | 2 | container-offices: 2 |
| src/data/wp-export/posts/container-offices-for-sale-in-koramangala.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-kr-puram.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-magadi-road.json | 2 | container-offices: 2 |
| src/data/wp-export/posts/container-offices-for-sale-in-malleshwaram.json | 2 | container-offices: 2 |
| src/data/wp-export/posts/container-offices-for-sale-in-marathahalli.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-nagarbhavi.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-rajajinagar.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-rt-nagar.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-sarjapur-road.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-shivajinagar.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-ulsoor.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-vijayanagar.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-whitefield.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-for-sale-in-yelahanka.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-in-central-delhi.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-in-east-delhi.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-in-faridabad.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-in-ghaziabad.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-in-gurgaon.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-in-noida.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-in-south-delhi.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/container-offices-price.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/cost-of-prefab-homes.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/customized-office-container-solutions.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/customized-prefab-structures-ncr.json | 1 | prefab-buildings: 1 |
| src/data/wp-export/posts/discount-mobile-office-units.json | 1 | portable-office: 1 |
| src/data/wp-export/posts/durable-modular-homes-delhi.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/durable-porta-cabins.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/eco-friendly-portable-cabins.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/in-the-long-run-are-prefabricated-industrial-buildings-more-cost-effective.json | 1 | industrial-sheds: 1 |
| src/data/wp-export/posts/industrial-sheds-in-bangalore.json | 2 | industrial-sheds: 2 |
| src/data/wp-export/posts/inside-container-office.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/labour-colonies-in-central-delhi.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-east-delhi.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-faridabad.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-ghaziabad.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-greater-noida.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-gurgaon.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-noida.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-north-delhi.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-south-delhi.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/labour-colonies-in-west-delhi.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/low-cost-modular-office-solutions.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/luxury-prefab-homes.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/material-specifications-features.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/modern-portable-office-solutions.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/owning-a-porta-cabin-is-perfect.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/peb-structure-cost-per-kg-india.json | 2 | peb-constructions: 2 |
| src/data/wp-export/posts/peb-structure-cost-per-sq-ft-india.json | 2 | peb-constructions: 2 |
| src/data/wp-export/posts/porta-cabin-in-ahmedabad.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-aurangabad.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-belgaum.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-bhiwadi.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-bhopal.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-bhubaneswar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-chandigarh.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-chennai.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-coimbatore.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-dehradun.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-durgapur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-guwahati.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-gwalior.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-hosur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-hubli.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-hyderabad.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-indore.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-jaipur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-jamshedpur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-kanpur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-kochi.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-kolkata.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-lucknow.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-madurai.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-manesar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-mangalore.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-mumbai.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-mysore.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-nagpur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-nashik.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-noida.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabin-in-panipat.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-patna.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-pune.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-raipur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-rajkot.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-ranchi.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-rourkela.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-salem.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-sonipat.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-surat.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-tirupur.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabin-in-tumkur.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabin-in-vadodara.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-vijayawada.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-in-visakhapatnam.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-office-price.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabin-price-a-complete-guide-2025.json | 3 | porta-cabins: 3 |
| src/data/wp-export/posts/porta-cabin-sizes-and-specifications-in-india.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-anekal.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-banashankari.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-bellandur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-btm-layout.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-delhi-ncr.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-domlur.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-electronic-city.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-frazer.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-hebbal.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-hsr-layout.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-jayanagar.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-jigani.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-jp-nagar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-kengeri.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-koramangala.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-malleshwaram.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-marathahalli.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-nagarbhavi.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-peenya-f.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-rajajinagar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-rt-nagar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-sarjapur-road.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/porta-cabins-in-ulsoor.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-vijayanagar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-in-yelahanka.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-is-budget-friendly-product.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/porta-cabins-on-rent.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/portable-cabin-price-in-bangalore.json | 6 | container-houses: 2, portable-cabin: 4 |
| src/data/wp-export/posts/portable-cabin-rental-services.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-anekal.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-banashankari.json | 3 | portable-cabin: 3 |
| src/data/wp-export/posts/portable-cabins-in-bannerghatta-road.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-bellandur.json | 3 | portable-cabin: 3 |
| src/data/wp-export/posts/portable-cabins-in-bommasandra.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-btm-layout.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-central-delhi.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-domlur.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-east-delhi.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-electronic-city.json | 3 | portable-cabin: 3 |
| src/data/wp-export/posts/portable-cabins-in-faridabad.json | 3 | portable-cabin: 3 |
| src/data/wp-export/posts/portable-cabins-in-frazer-town.json | 5 | porta-cabins: 1, portable-cabin: 4 |
| src/data/wp-export/posts/portable-cabins-in-ghaziabad.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-greater-noida.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-gurgaon.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-hebbal.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-hennur.json | 3 | porta-cabins: 1, portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-hoskote.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-hosur.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-hsr-layout.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-indiranagar.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-jayanagar.json | 3 | portable-cabin: 3 |
| src/data/wp-export/posts/portable-cabins-in-jigani.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-jp-nagar.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-kengeri.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-koramangala.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-kr-puram.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-magadi-road.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-malleshwaram.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-marathahalli.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-mg-road.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-nagarbhavi.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-noida.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-north-delhi.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-peenya.json | 3 | portable-cabin: 3 |
| src/data/wp-export/posts/portable-cabins-in-rajajinagar.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-rt-nagar.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-sarjapur-road.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-shivajinagar.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-south-delhi.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-ulsoor.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-cabins-in-vijayanagar.json | 3 | portable-cabin: 3 |
| src/data/wp-export/posts/portable-cabins-in-west-delhi.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-whitefield.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-cabins-in-yelahanka.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/portable-classroom-for-sale-2.json | 1 | portable-cabin: 1 |
| src/data/wp-export/posts/portable-classrooms-2.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/portable-office-cabin-manufacturers-in-bangalore.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-central-delhi.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-delhi-ncr.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-east-delhi.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-faridabad.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-ghaziabad.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-greater-noida.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-gurgaon.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-noida.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-north-delhi.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-south-delhi.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-office-cabins-in-west-delhi.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/portable-sheds-complete-guide-2024.json | 1 | industrial-sheds: 1 |
| src/data/wp-export/posts/portable-toilets-in-bangalore.json | 3 | portable-toilet: 3 |
| src/data/wp-export/posts/portacabins-for-sale-in-bangalore.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/portacabins-for-sale-in-bannerghatta-road.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/portacabins-for-sale-in-bommasandra.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-frazer-town-2.json | 6 | porta-cabins: 3, portable-cabin: 1, portable-office: 1, prefabricated-houses: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-hennur.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-hoskote.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-indiranagar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-kr-puram.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-magadi-road.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-shivajinagar.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/portacabins-for-sale-in-whitefield.json | 2 | porta-cabins: 2 |
| src/data/wp-export/posts/pre-engineered-buildings-in-bangalore.json | 2 | peb-constructions: 1, pre-engineered-buildings: 1 |
| src/data/wp-export/posts/precast-housing-construction-guide.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/prefab-homes-mumbai.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/prefab-porta-cabins.json | 1 | porta-cabins: 1 |
| src/data/wp-export/posts/prefabricated-houses-in-bangalore.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/prefabricated-houses-in-hyderabad.json | 1 | prefabricated-houses: 1 |
| src/data/wp-export/posts/prefabricated-warehouse-manufacturer-in-bangalore.json | 1 | industrial-sheds: 1 |
| src/data/wp-export/posts/second-hand-container-office.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/sleek-prefab-office-cabins-ncr.json | 2 | portable-office: 2 |
| src/data/wp-export/posts/sustainable-construction.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/temporary-garden-shed.json | 7 | industrial-sheds: 3, porta-cabins: 1, prefab-buildings: 3 |
| src/data/wp-export/posts/top-quality-prefab-cabins-delhi.json | 3 | portable-cabin: 2, prefabricated-houses: 1 |
| src/data/wp-export/posts/top-rated-portable-cabin-supplier-delhi.json | 2 | portable-cabin: 2 |
| src/data/wp-export/posts/types-of-container-offices.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/what-is-a-labour-hutment.json | 2 | labor-colony: 2 |
| src/data/wp-export/posts/why-labor-camps-are-essential.json | 3 | labor-colony: 3 |
| src/data/wp-export/posts/why-you-need-to-consider-a-container-office.json | 1 | container-offices: 1 |
| src/data/wp-export/posts/world-of-customized-porta-cabin.json | 1 | porta-cabins: 1 |

## TSX Pages/Components

- TSX files scanned: 187
- TSX files containing at least one mapped static href: 3
- Total mapped static href count: 4

### TSX Slug Distribution

| Slug | Count |
| --- | --- |
| industrial-sheds | 1 |
| puf-panel | 1 |
| sandwich-panel | 2 |

### TSX Files With Matches

| File | Count | Slug counts |
| --- | --- | --- |
| src/components/product-puf/ProductInfoBox.tsx | 1 | puf-panel: 1 |
| src/components/product-sandwich/SandwichInfoBox.tsx | 2 | sandwich-panel: 2 |
| src/pages/product/roofing-sheet/metal-roofing-sheet.tsx | 1 | industrial-sheds: 1 |

## First-100-Words Note

- Blog hrefs found before word 100 of `content.rendered`: 29

| File | Line | Slug | Words before href | Href |
| --- | --- | --- | --- | --- |
| src/data/wp-export/posts/best-porta-cabin-manufacturer-ncr.json | 1 | porta-cabins | 3 | https://www.samanportable.com/product-category/porta-cabins |
| src/data/wp-export/posts/best-porta-cabins-in-bangalore.json | 5 | porta-cabins | 47 | https://www.samanportable.com/product-category/porta-cabins |
| src/data/wp-export/posts/build-a-prefabricated-modular-houses.json | 2 | prefabricated-houses | 55 | https://www.samanportable.com/product-category/prefabricated-houses |
| src/data/wp-export/posts/container-office-in-madurai.json | 1 | container-offices | 87 | /product-category/container-offices |
| src/data/wp-export/posts/container-office-in-mangalore.json | 1 | container-offices | 90 | /product-category/container-offices |
| src/data/wp-export/posts/container-office-in-surat.json | 1 | container-offices | 77 | /product-category/container-offices |
| src/data/wp-export/posts/container-office-in-vijayawada.json | 1 | container-offices | 85 | /product-category/container-offices |
| src/data/wp-export/posts/container-office-in-visakhapatnam.json | 1 | container-offices | 81 | /product-category/container-offices |
| src/data/wp-export/posts/durable-modular-homes-delhi.json | 2 | prefabricated-houses | 48 | https://www.samanportable.com/product-category/prefabricated-houses |
| src/data/wp-export/posts/labour-colonies-in-central-delhi.json | 6 | labor-colony | 96 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/labour-colonies-in-east-delhi.json | 6 | labor-colony | 76 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/labour-colonies-in-faridabad.json | 6 | labor-colony | 97 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/labour-colonies-in-greater-noida.json | 6 | labor-colony | 57 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/labour-colonies-in-gurgaon.json | 6 | labor-colony | 57 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/labour-colonies-in-noida.json | 6 | labor-colony | 85 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/labour-colonies-in-north-delhi.json | 6 | labor-colony | 69 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/labour-colonies-in-west-delhi.json | 6 | labor-colony | 94 | https://www.samanportable.com/product-category/labor-colony |
| src/data/wp-export/posts/porta-cabin-in-chennai.json | 1 | porta-cabins | 26 | /product-category/porta-cabins |
| src/data/wp-export/posts/porta-cabin-in-hyderabad.json | 1 | porta-cabins | 26 | /product-category/porta-cabins |
| src/data/wp-export/posts/porta-cabin-in-jaipur.json | 1 | porta-cabins | 14 | /product-category/porta-cabins |
| src/data/wp-export/posts/porta-cabin-in-kolkata.json | 1 | porta-cabins | 36 | /product-category/porta-cabins |
| src/data/wp-export/posts/porta-cabin-in-mangalore.json | 1 | porta-cabins | 9 | /product-category/porta-cabins |
| src/data/wp-export/posts/porta-cabin-in-mumbai.json | 1 | porta-cabins | 27 | /product-category/porta-cabins |
| src/data/wp-export/posts/porta-cabin-in-nashik.json | 1 | porta-cabins | 40 | /product-category/porta-cabins |
| src/data/wp-export/posts/porta-cabin-in-patna.json | 1 | porta-cabins | 36 | /product-category/porta-cabins |
| src/data/wp-export/posts/portable-cabins-in-hebbal.json | 4 | portable-cabin | 92 | https://www.samanportable.com/product-category/portable-cabin |
| src/data/wp-export/posts/pre-engineered-buildings-in-bangalore.json | 4 | pre-engineered-buildings | 94 | https://www.samanportable.com/product-category/pre-engineered-buildings |
| src/data/wp-export/posts/precast-housing-construction-guide.json | 2 | prefabricated-houses | 43 | https://www.samanportable.com/product-category/prefabricated-houses |
| src/data/wp-export/posts/what-is-a-labour-hutment.json | 1 | labor-colony | 78 | https://www.samanportable.com/product-category/labor-colony |

## Dynamic / Not Confidently Safe Cases

- Dynamic or non-static TSX href cases flagged for Fable 5 ruling: 2

| File | Line | Snippet |
| --- | --- | --- |
| src/pages/product/[category]/[slug].tsx | 662 | Name="font-medium text-foreground">Category:</span> <Link href={`/product-category/${primaryCategory.slug}`} className="text-primary hover:underline font-medium break-words text-right"> {transformedProduct.category} |
| src/pages/product/[category]/index.tsx | 747 | Name="font-medium text-foreground">Category:</span> <Link href={`/product-category/${primaryCategory.slug}`} className="text-primary hover:underline font-medium break-words text-right"> {transformedProduct.category} |
