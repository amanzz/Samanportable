import fs from 'node:fs';

const PATH = 'src/data/products/container-offices-applications.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

data.intro = 'Six approved general arrangements, one controlled platform. Pick the footprint by how many people work inside it, then check the opening schedule and the partition line on the drawing before you order.';

const gaImage = (sizeSlug) => ({
  src: `/images/products/container-offices/size-section/co-00-container-office-${sizeSlug}-general-arrangement-board.webp`,
  alt: `General arrangement drawing for the ${sizeSlug} ft container office: floor plan, four elevations, opening map and furniture list`,
  provenance: 'render',
  width: 1600,
  height: 1200,
});

const PANELS = [
  {
    sizeSlug: '10x10',
    h3: '10x10 ft Container Office: Four Seats, One Central Aisle',
    paragraph: 'The compact site office in the range. Its approved arrangement places four workstations and four cabinets around a clear central working zone, with one door on the front long wall. Each of the other three walls carries one window, so daylight reaches the room from three sides. That near-square plan is also the constraint: door and window compete for the same wall length, which is why the opening schedule is agreed before fabrication rather than after. Rate carries the below-200 sq.ft. premium.',
    applications: [
      '100 sq.ft. floor area, Rs 1,66,750 ex-GST',
      '4 workstations, 4 seats, 4 cabinets',
      '1 door, 3 windows, no partition',
      'Lifts onto a compact plinth or a bearer pair',
    ],
  },
  {
    sizeSlug: '20x8',
    h3: '20x8 ft Container Office: Narrow Sites, Three Workstations',
    paragraph: 'Sixty per cent more floor than the 10x10, and one workstation fewer. That is not a drafting error; it is what eight feet of internal width does. The approved arrangement seats three people against opposite walls with clear entry circulation between them, and both end walls stay blank, so all four windows sit on the two long faces. Choose this size when the site boundary rather than the headcount sets the limit, and when the module must drop into a compound that will not accept a wide-body unit.',
    applications: [
      '160 sq.ft. floor area, Rs 2,55,200 ex-GST',
      '3 workstations, 3 seats, 3 cabinets',
      '1 door, 4 windows, both end walls blank',
      'Standard 20 ft transport envelope',
    ],
  },
  {
    sizeSlug: '20x10',
    h3: '20x10 ft Container Office: The 200 sq.ft. Reference Size',
    paragraph: 'Two extra feet of width over the 20x8 lift the arrangement from three workstations to five, and add a window in each end wall. That is the cross-ventilation this configuration is named for, and it is why most orders settle here. Every published rate on this page is calculated from this module at Rs 1,450 per square foot, and every other size derives from it through the area-band table. Compare vendor quotations at this size first, because both the specification and the price are anchored to it.',
    applications: [
      '200 sq.ft. floor area, Rs 2,90,000 ex-GST at Rs 1,450/sq.ft.',
      '5 workstations, 5 seats, 5 cabinets',
      '1 door, 6 windows including both end walls',
      'Reference size for every published rate',
    ],
  },
  {
    sizeSlug: '30x10',
    h3: '30x10 ft Container Office: Twelve Seats, Two Entry Doors',
    paragraph: 'The largest open-plan arrangement we build, and the biggest single step in the ladder: five workstations at 20x10 become twelve here. Two doors on the front long wall let a twelve-person office empty without everyone crossing the same aisle, which matters at shift change and matters more in an emergency. There is no partition on the approved drawing. Where a separate manager\'s room is needed, the 40 ft arrangements carry one as standard rather than as a modification to this plan.',
    applications: [
      '300 sq.ft. floor area, Rs 4,17,600 ex-GST',
      '12 workstations, 12 seats, 12 cabinets',
      '2 doors, 8 windows, continuous central aisle',
      'Open plan, no partition on the approved GA',
    ],
  },
  {
    sizeSlug: '40x8',
    h3: '40x8 ft Container Office: Manager Cabin Plus Seven Desks',
    paragraph: 'This is where the partition arrives. The approved GA divides forty feet into a ten-foot manager cabin and a thirty-foot common office, joined by one internal door. Seven workstations plus the manager and two guest chairs give ten seats, three fewer than the shorter 30x10, because eight feet of width and a partition each cost desk positions. Both end walls stay blank again. It travels on a 40 ft trailer, so check your gate and turning circle before choosing length over width.',
    applications: [
      '320 sq.ft. floor area, Rs 4,40,800 ex-GST',
      '7 workstations, 10 seats, 7 cabinets',
      '2 external doors, 1 internal door, 1 partition',
      '10 ft manager cabin plus 30 ft common office',
    ],
  },
  {
    sizeSlug: '40x10',
    h3: '40x10 ft Container Office: Fifteen Seats and a Manager',
    paragraph: 'The largest single module in the range. It carries the same ten-foot manager cabin and thirty-foot common office as the 40x8, but at ten feet of width that common office takes twelve workstations instead of seven. Fifteen seats in total, ten windows including one in each end wall, and one internal door into the cabin. Above this size we place modules end to end or move you to a multi-storey build, because a longer single unit becomes difficult to lift and to transport safely on Indian roads.',
    applications: [
      '400 sq.ft. floor area, Rs 5,51,000 ex-GST',
      '12 workstations, 15 seats, 12 cabinets',
      '2 external doors, 1 internal door, 1 partition',
      'Largest single module, 10 windows including both end walls',
    ],
  },
];

data.panels = PANELS.map((p) => ({ ...p, image: gaImage(p.sizeSlug) }));

fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('panels:', data.panels.length);
for (const p of data.panels) {
  console.log(p.sizeSlug, 'h3:', p.h3.length, 'body:', p.paragraph.length, 'bullets:', p.applications.length);
}
