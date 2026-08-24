// PC-00 asset refresh v1: apply C1-C6 copy edits and reposition/replace the
// 5 Description-tab image slots in porta-cabins.json's descriptionHtml.
// Every replacement asserts its exact target string exists first, so a
// mismatch throws instead of silently no-op'ing.
import fs from 'node:fs';

const PATH = 'src/data/products/porta-cabins.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
let html = data.descriptionHtml;

function mustReplace(label, from, to) {
  const idx = html.indexOf(from);
  if (idx === -1) throw new Error(`Target not found for ${label}: ${JSON.stringify(from.slice(0, 80))}`);
  const count = html.split(from).length - 1;
  if (count > 1) throw new Error(`Target not unique for ${label} (${count} occurrences)`);
  html = html.replace(from, to);
}

// --- 1. Remove the two old before-paragraph images we are repositioning/replacing ---
mustReplace(
  'remove old How-SAMAN-Builds image',
  '<img src="/images/products/porta-cabins/description/saman-porta-cabin-20x8-narrow-office.webp" width="1280" height="720" loading="lazy" alt="Narrow SAMAN porta cabin with corrugated MS walls, sliding windows and outward-opening door on the long face">',
  ''
);
mustReplace(
  'remove old What-Buyers-Use image',
  '<img src="/images/products/porta-cabins/description/saman-porta-cabin-40x10-multiroom-interior.webp" width="1280" height="720" loading="lazy" alt="Long interior of a 40x10 ft porta cabin with lined walls, window row and desks arranged as work zones">',
  ''
);
mustReplace(
  'remove old Customisation-Options image',
  '<img src="/images/products/porta-cabins/description/saman-porta-cabin-20x12-partition-interior.webp" width="1280" height="720" loading="lazy" alt="Interior of a 20x12 ft porta cabin with lined walls, vinyl floor, office desk and internal door">',
  ''
);
// NOTE: the fourth old image (Delivery, Installation and Site Readiness section,
// saman-porta-cabin-10x10-compact-site.webp) is NOT in the new manifest's 5 slots
// and is left completely untouched, per "four things change and nothing else".

// --- 2. C1 replace ---
mustReplace(
  'C1',
  'The downloadable PDF in the hero carries the same numbers, with a document ID and revision date you can hold us to.',
  'The downloadable PDF in the hero carries the same numbers, the version marker and the source workbook they came from.'
);

// --- 3. C2 replace ---
mustReplace(
  'C2',
  'The photographs on this page show representative builds, not a fixed appearance.',
  'The images on this page are approved SAMAN visualisations of the standard build, not a fixed appearance.'
);

// --- 4. D-01 insert after "How SAMAN Builds Every Porta Cabin" paragraph 1 ---
const p1HowBuilt = 'Every cabin starts as a welded chassis of 100x50x3 mm MS C-channel with cross stiffeners. The floor is what a cabin lives or dies by, so the chassis gets the heaviest steel. Onto that frame we fix an 18 mm Bison cement-fibre floor board. A 1.3 mm vinyl layer finishes the walking surface. The wall frame uses 50x50 mm MS square pipe with an approximately 60 mm cavity. Outside, the walls carry 1.2 mm specially corrugated MS sheet. Inside, they carry 8 mm pre-laminated MDF lining. The roof runs 1.4 mm corrugated MS sheet over its own stiffener grid.';
mustReplace(
  'D-01 insertion point',
  `<p>${p1HowBuilt}</p>`,
  `<p>${p1HowBuilt}</p><img src="/images/products/porta-cabins/description/porta-cabin-description-01-10x10-oxford-teal-exterior.webp" width="1920" height="1080" loading="lazy" alt="Oxford Teal 10x10 ft porta cabin on a paved yard, door and one window on the front face">`
);

// --- 5. Insert C4 (H3) + C5 (P) + D-02 (img) + C6 (P), after the 3rd "How SAMAN
//    Builds" paragraph and before the "Choose Your Configuration" H2 ---
mustReplace(
  'C4/C5/D-02/C6 insertion point',
  '<h2>Choose Your Configuration: The Full SAMAN Porta Cabin Range</h2>',
  '<h3>Read the Approved GA Plan Before You Fix a Size</h3>' +
    '<p>Each of the six sizes on this page now carries its approved general-arrangement plan. The plan shows the exact door and window positions, the workstation grid, the clear central aisle and the four exterior elevations for that footprint. Counts are stated on the plan itself: the 10x10 ft carries one door and three windows for four workstations, while the 40x10 ft carries three doors, a partition and twelve workstations with a separate manager cabin.</p>' +
    '<img src="/images/products/porta-cabins/description/porta-cabin-description-02-20x8-narrow-office-interior.webp" width="1920" height="1080" loading="lazy" alt="Almond Stone 20x8 ft porta cabin interior, single desk run and circulation strip to the grey door">' +
    '<p>Use the plan to test your layout before you commit. Check that the door falls on the side your site access allows, that the window line suits your orientation, and that the seat count matches your team. These are buyer-facing arrangements: fabrication, services and foundations still follow the approved project drawing issued with your order.</p>' +
    '<h2>Choose Your Configuration: The Full SAMAN Porta Cabin Range</h2>'
);

// --- 6. C3 replace (source contains a real em dash, matched literally) ---
mustReplace(
  'C3',
  'The table below gives a buyer choosing between eleven builds the side-by-side routing view that prose cannot give — every configuration is one click away.',
  'The table below gives a buyer choosing between eleven builds the side-by-side routing view that prose cannot give. Every configuration is one click away.'
);

// --- 7. D-03 insert immediately after the configuration routing table ---
mustReplace(
  'D-03 insertion point',
  '</tbody></table></div><p>Is your requirement a cabin to live in',
  '</tbody></table></div><img src="/images/products/porta-cabins/description/porta-cabin-description-03-20x12-wide-aisle-interior.webp" width="1920" height="1080" loading="lazy" alt="Soft Clay Greige 20x12 ft interior showing the wide aisle between facing workstation runs"><p>Is your requirement a cabin to live in'
);

// --- 8. D-04 insert after "What Buyers Use Porta Cabins For" paragraph 1 ---
const p1BuyersUse = "Site and project offices are the largest use. A contractor orders the cabin with the work order, and the office lands before the first excavation. General-purpose rooms come next: security points, drivers' rooms, first-aid rooms, storage and sample rooms. Retail and service use covers shops, kiosks, ticket counters and reception units, usually in the shop configuration. Sanitation and project-support configurations round out the family, from toilet-fitted cabins to stores.";
mustReplace(
  'D-04 insertion point',
  `<p>${p1BuyersUse}</p>`,
  `<p>${p1BuyersUse}</p><img src="/images/products/porta-cabins/description/porta-cabin-description-04-30x10-eucalyptus-exterior.webp" width="1920" height="1080" loading="lazy" alt="Eucalyptus Grey-Green 30x10 ft porta cabin with two doors and grilled windows beside a solar array">`
);

// --- 9. D-05 insert after "Customisation Options" paragraph 1 ---
const p1Customisation = 'The published price buys the standard open-room specification. Almost everything else is configurable. STANDARD scope covers the shell, insulation, floor, one door, windows and the electrical baseline. OPTIONAL additions include partitions, furniture packages, AC provision and units, attached toilet modules, extra doors and windows, and grills or mesh.';
mustReplace(
  'D-05 insertion point',
  `<p>${p1Customisation}</p>`,
  `<p>${p1Customisation}</p><img src="/images/products/porta-cabins/description/porta-cabin-description-05-40x10-manager-and-common-office.webp" width="1920" height="1080" loading="lazy" alt="Champagne Linen 40x10 ft porta cabin with the manager cabin door open off the common office">`
);

data.descriptionHtml = html;
fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');

const imgCount = (html.match(/<img/g) || []).length;
const emdash = (html.match(/—/g) || []).length;
console.log('descriptionHtml updated. length:', html.length, 'img count:', imgCount, 'em-dashes:', emdash);
