import Link from 'next/link';
import type { ReactNode } from 'react';

const CABIN_HREF = '/product/porta-cabins';
const href = (slug: string) => `${CABIN_HREF}/${slug}`;
const LABOUR_COLONY_HREF = '/product/labor-colony';
const labourHref = (slug: string) => `${LABOUR_COLONY_HREF}/${slug}`;
const CONTAINER_OFFICES_HREF = '/product/container-offices';
const containerOfficeHref = (slug: string) => `${CONTAINER_OFFICES_HREF}/${slug}`;
const CONTAINER_HOUSES_HREF = '/product/container-houses';
const containerHouseHref = (slug: string) => `${CONTAINER_HOUSES_HREF}/${slug}`;
const CONTAINER_CAFE_HREF = '/product/container-cafe';
const containerCafeHref = (slug: string) => `${CONTAINER_CAFE_HREF}/${slug}`;

const bodyClass = 'text-sm leading-relaxed text-slate-700';
const linkClass = 'font-semibold text-[var(--ds-color-leaf)] underline underline-offset-2';

export interface RightToExistEntry {
  heading: string;
  body: ReactNode;
  comparison: ReactNode;
  appendix?: ReactNode;
  /** R15 (v1.4, 14 Aug 2026) — optional image-left / content-right split card
      rendered below the lead paragraphs. Present only on the porta-cabins hub;
      every other entry renders byte-identically to before. */
  splitCard?: {
    imageSrc: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    subheading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

const RIGHT_TO_EXIST_ENTRIES: Record<string, RightToExistEntry> = {
  // C-05 container-cafe HUB — §5 of the 08 Aug draft of record, verbatim. The
  // comparison line's anchor is exactly the ruled §9 string; it is neither
  // extended nor shortened. No `appendix`: the draft supplies none.
  'container-cafe': {
    heading: 'Why this page, and not one of the five below',
    body: (
      <>
        This hub is where you compare the whole container cafe range and settle on a size before you narrow down to a use. It carries the six published sizes, the rate at each of them, and the specification that every unit in this cluster is built from. If you already know the trade you are opening, one of the five pages below will answer you faster than this one.
      </>
    ),
    comparison: (
      <>
        Opening a full-service kitchen with table seating? <Link className={linkClass} href={containerCafeHref('container-restaurant')}>Container Restaurant carries the heavier ladder and larger covers</Link>.
      </>
    ),
  },
  // C-05 subpages — section 2 of their 08 Aug drafts of record, verbatim. The two
  // anchors in each comparison line are exactly the section 6 link plan: one
  // back-link to the hub, one sideways link, both inside the sentence that explains
  // the difference. No other links on either page.
  'container-restaurant': {
    heading: 'Why choose the SAMAN Container Restaurant',
    body: (
      <>
        The container restaurant is the heaviest build in the container cafe range, engineered for seated dine-in service backed by a production kitchen. It carries a 150×75×5 mm MS base frame, 24 mm waterproofed cement board flooring and 100 mm mineral wool roof insulation that the lighter cafe units do not. Fix on it for seated venues of 8 to 40 diners; for takeaway counters the standard cafe format costs less per unit.
      </>
    ),
    comparison: (
      <>
        Choosing between formats? Compare the <Link className={linkClass} href={containerCafeHref('food-truck-containers')}>road-mobile food truck unit</Link> and the <Link className={linkClass} href={CONTAINER_CAFE_HREF}>counter-service cafe range</Link> before fixing your layout.
      </>
    ),
  },
  'food-truck-containers': {
    heading: 'Why choose the SAMAN Food Truck Container',
    body: (
      <>
        The food truck container is the relocation specialist of the container cafe range, built to earn at one pitch and move to the next. Against the static units it adds corner gussets on a 150×75×5 mm base, additional lifting support in the top frame and transport locking across all loose items and openings. Pick it for seasonal or roaming trade; for one fixed location the dine-in container restaurant build seats far more.
      </>
    ),
    comparison: (
      <>
        Not planning to relocate? See the <Link className={linkClass} href={CONTAINER_CAFE_HREF}>static cafe sizes and prices</Link>, or the <Link className={linkClass} href={containerCafeHref('container-restaurant')}>dine-in restaurant floors</Link>, before you commit.
      </>
    ),
  },
  // C-05 last three subpages — section 2 of their 08 Aug drafts of record, verbatim.
  // Each carries exactly one link, the section 6 back-link to the hub.
  'container-hotel': {
    heading: 'Why choose the SAMAN Container Hotel module',
    body: (
      <>
        The hotel module is the only page in this range built for guests to sleep in rather than eat in. It replaces food-service surfaces with 12 mm laminate and HPL room lining, 12.5 mm gypsum ceiling, 5 to 6 mm SPC flooring and an attached bathroom carrying WC, shower, basin and floor drains. Choose it for keyed accommodation on resort, site or tourism land; anything selling food belongs on the cafe range.
      </>
    ),
    comparison: (
      <>
        Building hospitality rather than a kitchen? Start from the <Link className={linkClass} href={CONTAINER_CAFE_HREF}>container cafe hub</Link> if guests will be buying food rather than sleeping.
      </>
    ),
  },
  'modular-container-cafe': {
    heading: 'Why choose the Modular Container Cafe system',
    body: (
      <>
        The modular system is the only cafe format designed around joining, so growth becomes an ordering decision rather than a rebuild. Its joint faces, aligned counter line, coordinated facade panels and expandable service runs are engineered before the first module ships, which single-unit formats do not carry. Choose it when the site plan is phased; with a fixed footprint, one container cafe unit costs less per square foot.
      </>
    ),
    comparison: (
      <>
        Know your final footprint already? A single unit from the <Link className={linkClass} href={CONTAINER_CAFE_HREF}>standard cafe range</Link> will cost less per square foot than joining modules.
      </>
    ),
  },
  'container-coffee-shop': {
    heading: 'Why the Container Coffee Shop is its own page',
    body: (
      <>
        The coffee shop is not a different building from the container cafe; it is the same shell with a fit-out planned around one workflow. Its electrical schedule carries dedicated espresso and grinder circuits, its plumbing adds a treated water feed and under-counter waste, and its counter face is glazed for display and set for pickup. Read this page for the fit-out; read the container cafe range for the shell specification.
      </>
    ),
    comparison: (
      <>
        Serving more than coffee? The <Link className={linkClass} href={CONTAINER_CAFE_HREF}>container cafe range</Link> covers the same shell fitted for general food service and full menus.
      </>
    ),
  },
  'container-houses': {
    heading: 'Why the range page instead of one home model',
    body: (
      <>This page exists to route you to the right build, not to sell one configuration. The four home pages under it each own a distinct specification: repeatable prefab modules, villa-grade luxury finish, the reinforced shipping-form shell, and the fixed-plan affordable build. Start here when you know the size you need but not yet the build style that fits your plot and budget.</>
    ),
    comparison: (
      <>If you already know you want the budget build, go straight to the <Link className={linkClass} href={containerHouseHref('affordable-container-homes')}>affordable container homes</Link> page.</>
    ),
  },
  'prefab-container-homes': {
    heading: 'Why the prefab module instead of the range page',
    body: (
      <>This page owns the repeatable-module configuration: bolted inter-module connection plates, standard service risers and identical panel sizes that let one approved drawing become five or twenty homes. Choose it when you may ever need a second unit, a colony, or a later extension, because the expansion gable is built in from day one. The range page routes; this page standardises.</>
    ),
    comparison: (
      <>For one home with villa-grade finish instead of repeatability, see the <Link className={linkClass} href={containerHouseHref('luxury-container-houses')}>luxury container house</Link> build.</>
    ),
  },
  'luxury-container-houses': {
    heading: 'Why the luxury build instead of the prefab line',
    body: (
      <>This page owns the finish ladder: acoustic-grade 100 mm wall insulation, veneer and HPL feature walls, engineered wood underfoot, layered lighting circuits and split AC provision in every habitable room. Choose it when the unit is a residence guests will judge, a resort suite, a designer farmhouse, a second home with a point of view. The structure matches the range; the experience does not.</>
    ),
    comparison: (
      <>If repeatable modules matter more than finish, the <Link className={linkClass} href={containerHouseHref('prefab-container-homes')}>prefab module line</Link> is the better buy for you.</>
    ),
  },
  'shipping-container-homes': {
    heading: 'Why the shipping-form build instead of the hub range',
    body: (
      <>This page owns the reinforced configuration: upsized corner posts, cross-membered base with relocation skids, weatherproof window hoods and a marine-duty paint system that shrugs off coastal air. Choose it when the home will move between sites, sit near salt water, or face wind loads the standard build should not be asked to carry. It is the range&apos;s working boots, not its slippers.</>
    ),
    comparison: (
      <>For a settled plot with no relocation ahead, the standard <Link className={linkClass} href={CONTAINER_HOUSES_HREF}>container house range</Link> costs less and lives identically.</>
    ),
  },
  'affordable-container-homes': {
    heading: 'Why the affordable build instead of prefab modules',
    body: (
      <>This page owns budget transparency: one fixed room plan per size, standard pre-laminated interiors, vinyl sheet floors and a modest glazing schedule, published at the lowest rate in the range. Choose it when the question is simply the cheapest honest way into a steel home, with the structure uncompromised and the options priced separately where you can see them. Nothing is hidden in the rate.</>
    ),
    comparison: (
      <>If you expect to add units or extend later, the <Link className={linkClass} href={containerHouseHref('prefab-container-homes')}>repeatable module line</Link> earns its premium over a fixed plan.</>
    ),
  },
  'container-offices': {
    heading: 'Why the range page instead of one model',
    body: (
      <>This page holds the whole container office range so a buyer can set the cabin, shipping-form and site-office builds against each other before committing to one. All three are newly fabricated steel modules from our own works, differing in duty, layout and finish rather than in platform. Start here when you know the need but not yet the model.</>
    ),
    comparison: (
      <>Already certain a construction site office is the job? <Link className={linkClass} href={containerOfficeHref('site-office-container')}>The dedicated site office page</Link> carries that build alone.</>
    ),
  },
  'container-office-cabin': {
    heading: 'Why the cabin model earns its own page',
    body: (
      <>The cabin is the office-first member of the range: a defined manager-and-staff layout, computer and data points, lockable records storage and AC provision all arrive as one quotation-ready module. It is specified for the people who will sit in it every working day, not just visit it between rounds. Choose it when the office itself matters more than the relocation schedule.</>
    ),
    comparison: (
      <>Moving the office between projects every season? The <Link className={linkClass} href={containerOfficeHref('shipping-container-office')}>shipping-form container office</Link> is hardened for exactly that duty.</>
    ),
  },
  'shipping-container-office': {
    heading: 'Why the shipping-form build stands apart',
    body: (
      <>This model is the range&apos;s relocation specialist: stronger handling interfaces, reinforced cut-outs, durable floor and liner selections and secure doors, with relocation documentation included in the delivery pack. It is engineered to be lifted, moved and lifted again without anything working loose. Choose it when the office&apos;s next address is already written on the project plan.</>
    ),
    comparison: (
      <>If the unit will stay put and daily office comfort leads, <Link className={linkClass} href={containerOfficeHref('container-office-cabin')}>the office-first cabin model</Link> is specified for that instead.</>
    ),
  },
  'site-office-container': {
    heading: 'Why the site office is its own model',
    body: (
      <>This build is drawn around a construction site&apos;s working day: plan-table clearance, manager and staff seating, pin-up walls for current drawings, an external PPE transition point and quick service connection on arrival. It is the model that runs a project rather than merely housing its desks. Choose it when the office is going to be the site&apos;s command point.</>
    ),
    comparison: (
      <>Need the same module hardened for repeated lifts between projects? The <Link className={linkClass} href={containerOfficeHref('shipping-container-office')}>shipping-form office build</Link> carries that duty.</>
    ),
  },
  // PC-00 (14 Aug 2026) — Section 2 "buyer orientation" copy from the approved
  // hub draft, mapped onto this existing heading/body/comparison card (no new
  // page section added; Template Lock forbids that). appendix removed: the
  // draft's approved link plan (Block G) does not include the value/luxury/
  // mini/steel-porta-cabin/portacabin-office links the old copy carried.
  'porta-cabins': {
    heading: 'Which Porta Cabin Should You Buy? Match the Cabin to the Job',
    body: (
      <>
        Start with the job the cabin must do. A single office, room or guard point fits the standard build on this page, so you only pick the size below. Move to a configuration page when one condition dominates. Heavy industrial duty points to the MS build. Daily wet use needs the toilet-fitted cabin. Customer-facing retail suits the shop and kiosk format. Every configuration shares one chassis platform, so the order stays simple: duty first, then size, then fit-out.
      </>
    ),
    comparison: (
      <>
        Next, fix the budget against published numbers. Prices here are base-specification, ex-GST figures from our costing workbook. Customisations are quoted separately. Our <Link className={linkClass} href="/porta-cabin-price-a-complete-guide-2025">porta cabin price guide</Link> explains how size bands, interiors and transport change the final amount. When your shortlist is ready, share your site pin code and use-case, and <Link className={linkClass} href="/contact">request a fixed 48-hour quotation</Link>.
      </>
    ),
    // R15 (v1.4) — split card copy is verbatim from the revision ticket; the
    // CTA destination is the site's existing Gallery page, taken from the live
    // main navigation and verified 200.
    splitCard: {
      imageSrc: '/images/products/porta-cabins/section2/saman-porta-cabin-20x10-elevated.webp',
      imageAlt: 'Elevated view of a 20x10 ft SAMAN porta cabin exterior',
      imageWidth: 1280,
      imageHeight: 720,
      subheading: 'See finished SAMAN cabins before you decide',
      body: 'Browse completed porta cabin projects from our Bengaluru and Greater Noida factories — site offices, guard rooms, retail units and interiors. Judge the finish, the openings and the build quality on real deliveries, then shortlist your size with confidence.',
      ctaLabel: 'Explore the project gallery',
      ctaHref: '/gallery',
    },
  },
  'low-cost-porta-cabin': {
    heading: 'Why choose the Low Cost Porta Cabin',
    body: (
      <>
        The value grade of our newly fabricated porta cabin, built on the identical welded MS frame and offered across all nine standard sizes. It specifies a 0.8–1.0 mm corrugated exterior, 6 mm pre-laminated lining and 1.5 mm vinyl over an 18 mm BWP plywood floor, saving on finish and never on structure. Choose it when the cabin serves your own team; move to the <Link className={linkClass} href={href('luxury-porta-cabin')}>Luxury Porta Cabin</Link> when clients will walk into it.
      </>
    ),
    comparison: (
      <>
        Only need a compact footprint? The <Link className={linkClass} href={href('mini-porta-cabin')}>Mini Porta Cabin</Link> covers the four smallest sizes at this same value grade.
      </>
    ),
  },
  'luxury-porta-cabin': {
    heading: 'Why choose the Luxury Porta Cabin',
    body: (
      <>
        The premium grade of the same newly fabricated cabin, specified for reception areas and client-facing rooms. It carries a 1.25–1.6 mm exterior, 12 mm plywood lining with laminate and HPL feature panels, a 12.5 mm gypsum ceiling and 5–6 mm SPC flooring over marine ply. Choose it where the room is seen by customers; the <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> covers working offices at upgraded rather than premium grade.
      </>
    ),
    comparison: (
      <>
        Want this finish without a desk layout? This page keeps the open room; <Link className={linkClass} href={href('portacabin-office')}>office fit-outs</Link> sit one grade below.
      </>
    ),
  },
  'mini-porta-cabin': {
    heading: 'Why choose the Mini Porta Cabin',
    body: (
      <>
        The compact end of our newly fabricated range, covering the four smallest sizes from a one-person duty post to a four-person room. It keeps the value specification: a 0.8–1.0 mm exterior with 6 mm lining, and adds a second window and separate socket circuit once the cabin passes 200 sq ft. Choose it for gate posts, kiosks and small teams; the <Link className={linkClass} href={href('low-cost-porta-cabin')}>Low Cost Porta Cabin</Link> carries the same grade in the larger sizes.
      </>
    ),
    comparison: (
      <>
        Need a fitted workspace rather than a duty room? The <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> adds workstations, storage and glazing.
      </>
    ),
  },
  'ms-porta-cabin': {
    heading: 'Why choose the MS Porta Cabin build',
    body: (
      <>
        The heavy industrial grade of our newly fabricated cabin, specified for plants, workshops and hostile environments. It carries a 1.6 mm exterior and roof, 8–10 mm fibre-cement lining, a 24 mm cement board floor and 2–3 mm commercial PVC or epoxy finish behind a single-leaf industrial door. Choose it for a fixed industrial position; the <Link className={linkClass} href={href('steel-porta-cabin')}>Steel Porta Cabin</Link> covers units that are lifted and re-sited repeatedly.
      </>
    ),
    comparison: (
      <>
        Housing an office rather than a workshop? The <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> trades industrial lining for a working fit-out.
      </>
    ),
  },
  'steel-porta-cabin': {
    heading: 'Why choose the Steel Porta Cabin',
    body: (
      <>
        The heavy relocation build of our newly fabricated cabin, made for units that are lifted, moved and stacked repeatedly. It takes the 1.6 mm exterior with a 0.50 mm pre-painted metal liner, a heavy MS floor plate with 3 mm chequered plate finish, double-leaf MS doors and upgraded lifting lugs. Choose it where the cabin moves between sites; the <Link className={linkClass} href={href('ms-porta-cabin')}>MS Porta Cabin</Link> suits a unit that stays in one position.
      </>
    ),
    comparison: (
      <>
        Need a lighter cabin that stays on one site? The <Link className={linkClass} href={CABIN_HREF}>Porta Cabins hub</Link> carries the standard reference specification.
      </>
    ),
  },
  'porta-cabin-shop': {
    heading: 'Why choose the Porta Cabin Shop',
    body: (
      <>
        The retail configuration of our newly fabricated cabin, planned around a front service counter with staff preparation and storage behind it. It carries 8–12 mm plywood with laminate or 6–8 mm HPL panels, a 4 mm ACP or decorative ceiling, 3–4 mm LVT flooring and large service glazing with a lockable counter opening. Choose it when customers are served at the cabin; the <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> covers staff-only working space.
      </>
    ),
    comparison: (
      <>
        Selling food or drink rather than goods? The <Link className={linkClass} href="/product/container-cafe">container cafe range</Link> is planned around kitchen services instead.
      </>
    ),
  },
  'porta-cabin-with-toilet': {
    heading: 'Why choose the Porta Cabin with Toilet',
    body: (
      <>
        A working cabin with its own attached toilet in one newly fabricated unit: one delivery, one base, one drainage connection, no separate sanitary block. The wet zone uses 10–12 mm moisture-tolerant fibre-cement lining, an 18–24 mm cement board deck with waterproof membrane, and 2.5–3 mm anti-skid safety vinyl with sealed joints. Choose it wherever staff work and need facilities on the spot rather than at the far end of a site.
      </>
    ),
    comparison: (
      <>
        Need a standalone sanitary unit with no working space? The <Link className={linkClass} href="/product/portable-toilet">portable toilet range</Link> is sized by model, not by cabin.
      </>
    ),
  },
  'portacabin-office': {
    heading: 'Why choose the Portacabin Office',
    body: (
      <>
        The office configuration of our newly fabricated cabin: workstations, storage and an optional manager partition. Upgraded lining and flooring sit under office-grade glazing, with power and data drawn to your furniture plan and none of the gypsum ceiling or HPL panelling of the premium build. Choose it for any working office; at ₹1,450 per square foot it sits between the <Link className={linkClass} href={CABIN_HREF}>plain cabin</Link> and the <Link className={linkClass} href={href('luxury-porta-cabin')}>premium build</Link>.
      </>
    ),
    comparison: (
      <>
        Room will be seen by clients? The <Link className={linkClass} href={href('luxury-porta-cabin')}>Luxury Porta Cabin</Link> adds the gypsum ceiling, feature panelling and SPC flooring.
      </>
    ),
  },
  'labor-colony': {
    heading: 'Why the colony page and not a single building',
    body: (
      <>
        This page carries the whole worker housing site, dormitory buildings plus the toilet blocks, kitchens and services that make a colony liveable, so a contractor plans the site once instead of buying buildings one at a time. Every building on it is newly fabricated steel in the six approved configurations. Choose it when your brief is the site, not one block.
      </>
    ),
    comparison: (
      <>
        Need only one open sleeping hall rather than a full site? The <Link className={linkClass} href={labourHref('labor-sheds')}>Labor Sheds page</Link> carries that single-hall building.
      </>
    ),
  },
  'labor-sheds': {
    heading: 'Why choose the shed over the room block',
    body: (
      <>
        The shed puts every bed into one open hall per floor, which is the cheapest way to house a large crew and by far the easiest arrangement to supervise as a single space. Fire exits, zoned lighting circuits and high-level ventilation are all sized for open-hall occupancy rather than for individual rooms. Choose it when bed count per rupee matters more than room privacy.
      </>
    ),
    comparison: (
      <>
        Crews that need lockable individual rooms are better served by the Labor Hutments room block, and <Link className={linkClass} href={LABOUR_COLONY_HREF}>the full worker housing range</Link> shows where each build fits.
      </>
    ),
  },
  'labor-hutments': {
    heading: 'Why choose rooms over an open hall',
    body: (
      <>
        The hutment divides each floor into individual sleeping rooms with their own doors, windows, fans and distribution boards, so mixed gangs, supervisors and longer-posting crews get privacy and lockable space that an open hall cannot offer. The trade is a lower bed count per floor at a slightly higher rate. Choose it when room separation matters on your site.
      </>
    ),
    comparison: (
      <>
        If maximum beds in one supervised space is the priority, the open-hall Labor Sheds building houses more per floor; see <Link className={linkClass} href={LABOUR_COLONY_HREF}>every colony building compared</Link> before you choose.
      </>
    ),
  },
  'prefab-labor-camps': {
    heading: 'Why choose the relocatable camp build',
    body: (
      <>
        The camp is engineered to move: bolted panel joints, pedestal footings and plug-and-play services mean the same buildings dismantle at one project and re-erect at the next instead of being written off. It costs slightly more per square foot than the fixed shed and repays it the first time the camp relocates. Choose it when your projects move.
      </>
    ),
    comparison: (
      <>
        If the housing stays on one site for its whole life, the Labour Colony configuration is more economical, with <Link className={linkClass} href={LABOUR_COLONY_HREF}>fixed and movable options side by side</Link> on the range page.
      </>
    ),
  },
  'portable-office': {
    heading: 'Why the range page and not a single cabin',
    body: (
      <>
        This page carries the whole portable office cabin range so a buyer can compare nine sizes on one screen before choosing a configuration. Every unit here is newly fabricated on an MS frame in Bengaluru or Greater Noida, insulated, fitted and tested before dispatch, and delivered in 7 to 21 working days. Pick the size first on this page, then the configuration on the page that matches how you buy.
      </>
    ),
    comparison: (
      <>
        Need it from ready stock rather than built to order? The Readymade Office Cabin dispatches from the floor.
      </>
    ),
  },
  'readymade-office-cabin': {
    heading: 'Why choose Readymade over building to order',
    body: (
      <>
        Every cabin on this page carries one fixed inclusion list, which is what allows us to finish units before anyone orders them rather than after. Sizes we are holding dispatch within 1 to 2 working days of advance; the rest are built to that same list on a 7 to 21 working day lead time. Choose this when the date matters more than the specification.
      </>
    ),
    comparison: (
      <>
        Want a specified finish instead of a fixed one? The Modern Office Cabin is drawn to your brief, not held on the floor.
      </>
    ),
  },
  'modern-office-cabin': {
    heading: 'Why choose the Modern Office Cabin',
    body: (
      <>
        This is the premium line of our office range, built on the same MS platform as every cabin here and then finished to a specified schedule: premium laminate walls, larger tinted windows, LED lighting in a false ceiling and SPC or LVT flooring. You choose it when clients, patients or applicants will judge the room. The structure is shared; the difference is everything a visitor can see.
      </>
    ),
    comparison: (
      <>
        Working office where the finish does not matter? The Readymade Office Cabin does the same job at the economy rate.
      </>
    ),
  },
  'prefabricated-office-cabins': {
    heading: 'Why choose Prefabricated Office Cabins',
    body: (
      <>
        This page exists for orders of three units and more: identical offices fabricated as a batch, priced in tiers, and delivered to one site or ten cities on a single purchase order. Every unit matches the approved drawing, so a multi-site programme gets consistency that one-at-a-time buying cannot deliver. Order one cabin and a sibling page serves you better; order a fleet and this is the page.
      </>
    ),
    comparison: (
      <>
        Buying a single office for one site? Start at our portable office range page and pick the size that fits.
      </>
    ),
  },
  'portable-office-container': {
    heading: 'Why choose the Portable Office Container',
    body: (
      <>
        Every cabin we build can be transported once; this line is for offices that relocate again and again. The build adds reinforced lifting interfaces, a stiffened frame and protected service runs, so repeated craning and road moves do not turn into repair bills. It is a newly fabricated MS unit wearing container-style hardening rather than a converted shipping box, chosen when your office&apos;s next address is already certain.
      </>
    ),
    comparison: (
      <>
        Placing the office once and leaving it? The standard portable office range carries the same floors without the hardening premium.
      </>
    ),
  },
  'small-office-cabin': {
    heading: 'Why choose the Small Office Cabin',
    body: (
      <>
        This page carries only the three compact sizes, priced and fitted for teams of one to four, so a small-office buyer compares three honest options instead of scrolling a nine-size ladder built for site headquarters. Every unit is newly fabricated MS with the standard fitted electricals, delivered working. When the team passes four people, the step up is the main range page, and this page says so plainly.
      </>
    ),
    comparison: (
      <>
        Team growing past four, or need a store and partitions? The full portable office cabin range carries the nine-size ladder.
      </>
    ),
  },
};

export const hasRightToExistEntry = (slug: string): boolean =>
  Object.prototype.hasOwnProperty.call(RIGHT_TO_EXIST_ENTRIES, slug);

export const getRightToExistEntry = (slug: string): RightToExistEntry | undefined =>
  RIGHT_TO_EXIST_ENTRIES[slug];

// Existing DOM id contract. Kept in the data module so the renderer remains
// cluster-neutral while all currently rendered markup stays byte-identical.
export const getRightToExistHeadingId = (slug: string): string =>
  `c01-right-to-exist-${slug}`;
