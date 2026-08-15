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
  /** Optional only because `bodyParagraphs` can replace the pair below. Every entry
      that predates that field still supplies both, so nothing else changes. */
  body?: ReactNode;
  comparison?: ReactNode;
  appendix?: ReactNode;
  /** PC-02 Section 2 draft v4 (14 Aug 2026) — an arbitrary-length run of uniformly
      styled paragraphs, for approved copy that is not the two-part
      body-plus-bolded-comparison shape. When present it replaces `body`, `comparison`
      and `appendix`. Absent everywhere else, so their markup is byte-identical.
      PC-04 also uses it: its two Section-2 paragraphs are both body copy, so the
      earlier `uniformParagraphWeight` flag is dropped in favour of this field, which
      renders the identical classes. */
  bodyParagraphs?: ReactNode[];
  /** R15 (v1.4, 14 Aug 2026) — optional image-left / content-right split card
      rendered below the lead paragraphs. Present only on the porta-cabins hub;
      every other entry renders byte-identically to before. */
  splitCard?: {
    imageSrc: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    /** PC-02 revision v1.2 (14 Aug 2026) — optional. The split layout is a mandatory
        cluster design, but a page whose approved copy supplies no card sub-heading or
        card body must render the panel without them rather than invent either. The hub
        supplies both, so its markup is unchanged. */
    subheading?: string;
    body?: string;
    /** PC-03 post-build correction 2 (15 Aug 2026) — a short list of discrete trust
        signals or requirements rendered as checkmarked bullets below `body`. Also
        used by PC-06's Section 2 card (four quotation-input bullets) via the same
        field and rendering. Absent everywhere else, so every other page's split
        card is byte-identical. */
    bullets?: string[];
    /** PC-02 rulings v1.3 follow-up (14 Aug 2026) — render the section's two approved
        paragraphs INSIDE the card's copy column, beside the image and above the CTA,
        instead of full-width above the card. Default (absent) keeps the hub's deployed
        stacking: paragraphs above, then the card. Layout only; not a word changes. */
    copyInPanel?: boolean;
    ctaLabel: string;
    ctaHref: string;
    /** PC-05 revision v1.3/v1.4/ad-hoc (14-15 Aug 2026) — opt-in placement.
        Omitted (default) renders the card after both lead paragraphs,
        unchanged for every existing entry. 'betweenParagraphs' renders the
        COMPLETE card (image + heading + body + CTA, no extra slot) between
        `body` and `comparison`, with `comparison` outside the card as
        Section 2's closing paragraph. 'comparisonInsideCard' (owner
        screenshot review, 15 Aug 2026) instead renders `comparison` beside
        the image, as the card's second paragraph, before the CTA. Set only
        on fire-rated-porta-cabin. */
    position?: 'end' | 'betweenParagraphs' | 'comparisonInsideCard';
  };
}

const RIGHT_TO_EXIST_ENTRIES: Record<string, RightToExistEntry> = {
  // PC-03 double-story-porta-cabin - Section 2 buyer orientation, build prompt v2 12.4,
  // verbatim and SHA-256 verified before wiring (S2_H2 2dfd9911, S2_P1 571b9418,
  // S2_P2 1c304999). Two equal-weight paragraphs, so `bodyParagraphs` is used rather
  // than the body-plus-bolded-comparison pair. The two anchors are exactly rows 1 and 2
  // of the section 9 link map. No `splitCard`: build prompt v2 supplies no card image,
  // sub-heading, body or CTA label for this page, and the builder writes none.
  'double-story-porta-cabin': {
    heading: 'When a G+1 Porta Cabin Beats Two Single Storey Cabins on Site',
    bodyParagraphs: [
      (
        <>
          Compare the two ways to double cabin space. Two separate cabins need double the ground area, two plinths and a walkway between them. A G+1 cabin needs one plinth, keeps vehicle lanes untouched, and puts the second team one staircase away. Choose the stacked build when ground area is the scarce resource. Choose two separate units, such as a standard <Link className={linkClass} href="https://www.samanportable.com/product/porta-cabins/ms-porta-cabin">MS porta cabin</Link> pair, when the site has spare ground and you want to avoid stair access.
        </>
      ),
      (
        <>
          The G+1 decision also changes the engineering scope. The ground floor module carries both storeys, so the chassis, columns and foundations are checked by structural calculation, not taken from single storey practice. That check protects you at windy, elevated or soft-soil sites. Share your site pin code, floor use and occupancy plan for a fixed 48-hour quotation with the structural scope stated. <Link className={linkClass} href="https://www.samanportable.com/contact">Send your G+1 requirement now</Link>.
        </>
      ),
    ],
    // Post-build correction 2 (15 Aug 2026), SAMAN-approved verbatim, SHA-256 verified:
    // SC_H3 6bb37376, SC_BODY_P aa7a023a, SC_BULLET1-4 35e0aa28/8384e5be/d571b527/291f5832,
    // SC_CTA 8c985f7d. Format (one paragraph + four bullets) is SAMAN's own call, delegated
    // in chat 15 Aug 2026 ("do not ask me anything"). copyInPanel is absent (default false):
    // the ticket keeps the top block full-width above the card, not folded into it.
    splitCard: {
      imageSrc: '/images/products/double-story-porta-cabin/section2/double-story-porta-cabin-splitcard-beige-interior.webp',
      imageAlt: 'Second view of the beige panel interior room in a double storey porta cabin ground floor',
      imageWidth: 1280,
      imageHeight: 720,
      subheading: 'See a Double Story Build Before You Order',
      body: "Every double storey build ships from the same two factories and quality system used across SAMAN's full porta cabin range, not a one-off configuration.",
      bullets: ['500+ projects delivered to 3,000+ customers across 15+ states', 'Two owned factories: Bengaluru (South) and Greater Noida (North)', 'ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018 certified', 'Manufacturer, not reseller: direct factory pricing and accountability'],
      ctaLabel: 'Send your G+1 requirement now',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
  // PC-02 gi-porta-cabin — Section 2, DRAFT V4. Copy supplied by the owner on
  // 14 Aug 2026 and wired verbatim; it supersedes the build prompt v1 §3 Section 2
  // text and its S2_H2 / S2_P1 / S2_P2_visible checksums. Computed checksums for the
  // new copy, for the record: H2 c08c9f4732c24523 · P1 ea08de68f769c864 ·
  // P2 cadf6eff43212279 · P3 e474a52d0df7924d · P4 8e26265b762c80b8 ·
  // CTA 89f209a72651c1d9.
  //
  // GAP: paragraph 1 contains one U+2014 em dash ("the conditions it will face—not
  // simply out of habit"), which acceptance criterion 11.3 bans from rendered copy.
  // It is carried VERBATIM rather than silently corrected, because editing approved
  // copy is not the builder's call. Reported for a one-character ruling.
  //
  // Four uniformly styled paragraphs, so `bodyParagraphs` is used instead of the
  // body-plus-bolded-comparison pair. The section 6 row-1 anchor (MS porta cabin) is
  // preserved inside paragraph 3; the row-2 destination is now carried solely by the
  // card CTA, whose label the new copy changes to "Get a GI porta cabin quote".
  'gi-porta-cabin': {
    heading: 'When a GI Porta Cabin Outperforms Painted Steel on Real-World Sites',
    bodyParagraphs: [
      (
        <>
          A GI porta cabin should be selected for the conditions it will face—not simply out of habit. On coastal sites within roughly 500 metres of the sea, beside cooling towers, inside persistently humid facilities, or near chemical storage areas, ordinary painted steel can deteriorate much sooner than expected. Once corrosion begins, repeated surface preparation and repainting add maintenance costs, disrupt operations, and reduce the cabin’s service life.
        </>
      ),
      (
        <>
          A galvanized iron porta cabin offers stronger, longer-lasting corrosion protection. Its zinc coating acts sacrificially, meaning that even when the surface is scratched during transport, lifting, or daily site use, the surrounding zinc corrodes before the steel underneath. This makes a GI portable cabin a practical choice for coastal projects, industrial plants, construction sites, and other demanding environments where moisture and corrosive exposure cannot be avoided.
        </>
      ),
      (
        <>
          For dry, inland locations, an <Link className={linkClass} href="https://www.samanportable.com/product/porta-cabins/ms-porta-cabin">MS porta cabin</Link> can often deliver the same reliable performance at a lower initial cost. Its IS 2062 structural frame can support the same platform electrics, quality checks, and office functions required for a dependable portable site office.
        </>
      ),
      (
        <>
          Compare both options, then send us your site pin, exposure conditions, intended use, and preferred headcount. Our engineering team will recommend the right cabin specification and provide a fixed quotation within 48 hours.
        </>
      ),
    ],
    // Rulings v1.3 D1 — the split card's own image, no longer a re-used gallery file.
    // A previously unselected 20x10 source, renamed at build, with the owner-written
    // alt (checksum 979aa00ef7623d2a) carried verbatim. This is the page's 43rd image
    // slot and it is hash-unique against the other 42.
    //
    // D2 — the CTA carries the section 6 row-2 destination. Draft v4 drops the inline
    // contact anchor from the body copy, so /contact is now a single anchor on the
    // page again, in the card CTA.
    splitCard: {
      imageSrc: '/images/products/gi-porta-cabin/section2/gi-porta-cabin-20x10-dark-grey-exterior.webp',
      imageAlt: 'Dark grey corrugated GI porta cabin 20x10 ft with a central door and three sliding windows in a factory yard',
      imageWidth: 1254,
      imageHeight: 1254,
      // Owner review of the v1.3 preview: the H2 and all four paragraphs belong beside
      // the image and above the CTA, not stacked full-width on top of it.
      copyInPanel: true,
      ctaLabel: 'Get a GI porta cabin quote',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
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
  // PC-01 (14 Aug 2026) — Section 2 "buyer orientation" copy from the approved MS
  // build ticket, verbatim, mapped onto this existing heading/body/comparison card.
  // The previous entry's links to steel-porta-cabin and portacabin-office are gone:
  // the approved §7 link map carries exactly two S2 body links, the hub and /contact.
  'ms-porta-cabin': {
    heading: 'Is the Heavy MS Build the Right Porta Cabin for Your Site?',
    body: (
      <>
        Buy the MS Porta Cabin when the cabin must work like plant equipment. Its IS 2062 Grade A frame, 1.6 mm corrugated shell and mineral-wool insulation are specified for years of fixed-position duty in industrial conditions. When you only need an economical office for general site use, choose the standard build from the <Link className={linkClass} href={CABIN_HREF}>porta cabin range</Link> instead. It carries lighter sheets, and it costs less for the same floor area.
      </>
    ),
    comparison: (
      <>
        Material is the second decision. Mild steel with a maintained coating suits most inland and dry sites. In practice, it is also what a steel porta cabin means in the Indian market. Sustained humidity or coastal salt air points to the galvanized build instead. If your duty is heavy and your site is inland, this page is the right place. Share your size and site details, and <Link className={linkClass} href="/contact">request a fixed 48-hour quotation</Link>.
      </>
    ),
    // Split-card copy is verbatim from the ticket's §4 header table; the CTA points
    // at the site's existing Gallery page (verified 200), as on the hub.
    splitCard: {
      imageSrc: '/images/products/ms-porta-cabin/section2/ms-porta-cabin-10x10-end-elevation.webp',
      imageAlt: 'End wall of a 10x10 ft MS porta cabin in corrugated steel with a single sliding window',
      imageWidth: 1280,
      imageHeight: 720,
      subheading: 'Judge the MS build with your own eyes first',
      body: 'Frame sections, shell thickness and lined interiors are easier to judge in pictures than in tables. Browse finished SAMAN cabins in the gallery, note the details that matter for plant duty, then come back and match the six MS sizes to your site.',
      ctaLabel: 'Browse the gallery',
      ctaHref: '/gallery',
    },
  },
  // PC-05 (14 Aug 2026) — Section 2 "buyer orientation" copy from the approved
  // fire-rated build ticket (copy pack v2, S2_H2/S2_P1/S2_P2), verbatim. The
  // approved §7 link map carries exactly two S2 body links: MS porta cabin and
  // /contact. No splitCard: copy pack v2 supplies no distinct split-card
  // sub-copy, so none is invented (most cluster entries have none).
  // PC-05 revision v1.3 (14 Aug 2026) — R2: S2_P2 rewritten in copy pack v3
  // (382 -> 415 chars); S2_H2/S2_P1 are byte-identical to v2. R1: split card
  // added, copy verbatim from copy pack v3 SPLIT_CARD_H3/BODY/CTA. CTA href is
  // literally the hub's own splitCard.ctaHref ('/gallery'), read from the hub
  // entry above rather than invented, per the ticket's explicit instruction.
  // Ad-hoc revision (14 Aug 2026, owner screenshots) — `position:
  // 'betweenParagraphs'` moves the card between body and comparison; every
  // other entry above/below is untouched and keeps the default end position.
  // PC-05 revision v1.4 (R9, 15 Aug 2026) — reverted an earlier same-day ad-hoc
  // change that nested `comparison` inside the card; it regressed Section 2 to
  // one prose paragraph and buried the /contact CTA under the gallery CTA. Set
  // to `betweenParagraphs`.
  // Ad-hoc revision (15 Aug 2026, later owner screenshot review) — moved back
  // to `comparisonInsideCard`: SAMAN's explicit instruction, after seeing the
  // rendered preview, was that `comparison` reads better beside the image as
  // the card's second paragraph than as a full-width line beneath the card.
  // This supersedes R9's stated reasoning for this one page by direct owner
  // instruction on the rendered result; the /contact CTA text itself is
  // unchanged, only its position relative to the card's own CTA.
  'fire-rated-porta-cabin': {
    heading: 'When Your Project Fire Strategy Demands a Fire-Rated Cabin',
    body: (
      <>
        Choose this configuration when a contract, fire consultant or statutory audit asks the cabin to meet stated fire criteria. That demand appears on refinery and plant sites, in warehouses holding combustible goods, near fuel or chemical storage, and in EPC and government tenders that specify cabin fire performance. A standard <Link className={linkClass} href={href('ms-porta-cabin')}>MS porta cabin</Link> shares the same heavy steel platform, but its conventional panels and ordinary glazing are never specified against a fire criterion.
      </>
    ),
    comparison: (
      <>
        With the fire-rated build, you state the required performance and we specify mineral-wool assemblies, fire-grade linings, rated door sets and fire-stopped penetrations to match. The supporting documentation is listed in your quotation, so the file you hand a fire officer traces every claim to a source. Send your fire criteria, size and site location through our <Link className={linkClass} href="/contact">contact page</Link> for a fixed quotation within 48 hours.
      </>
    ),
    splitCard: {
      imageSrc: '/images/products/fire-rated-porta-cabin/20x10/fire-rated-porta-cabin-20x10-tan-side.webp',
      imageAlt: 'Tan 20x10 ft porta cabin on open ground, side elevation',
      imageWidth: 1254,
      imageHeight: 1254,
      subheading: 'See the build quality behind the fire-rated spec',
      body: 'The fire-rated configuration sits on the same chassis, factory process and quality checks as every other SAMAN porta cabin. Browse completed projects from our Bengaluru and Greater Noida units to judge steelwork, openings and finish on real deliveries. Then bring your fire criteria to the quotation, where the tested systems are named.',
      ctaLabel: 'Explore the project gallery',
      ctaHref: '/gallery',
      position: 'comparisonInsideCard',
    },
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
  // PC-04 (14 Aug 2026) — Section 2 "buyer orientation" copy from the approved
  // draft v2, verbatim, mapped onto this existing heading/body/comparison card.
  // The approved §6 link map carries exactly two S2 body links: the portable-toilet
  // hub and /contact. The previous entry's wet-zone spec sentence is gone — that
  // material detail now lives in the Description and Specifications tabs.
  // PC-07 (15 Aug 2026, revised same day per SAMAN's screenshot instruction) —
  // rebuilt to match the porta-cabins HUB's own Section 2 structure exactly
  // (CLAUDE.md: "The reference is the 'Which Porta Cabin Should You Buy?' card
  // on the live /product/porta-cabins hub. Match it exactly."), using the
  // `comparisonInsideCard` axis PC-05 already established for this shape: H2 +
  // one full-width paragraph, then the split card with an H3 + up to two
  // paragraphs beside the image, then the CTA.
  //
  // Provenance, field by field:
  //   heading            — approved copy pack v1 §3 S2_H2, checksum-verified, unchanged.
  //   body (top, full width) — NOT in the copy pack. Typed directly by SAMAN in
  //                        chat on 15 Aug 2026 to match the hub reference
  //                        screenshot. No checksum exists for it.
  //   splitCard.subheading (H3) — likewise typed directly by SAMAN, not in the
  //                        copy pack, no checksum.
  //   splitCard.body (first paragraph beside the image) — approved S2_BODY
  //                        paragraph 1, checksum-verified, unchanged.
  //   comparison (second paragraph beside the image, via comparisonInsideCard)
  //                        — approved S2_BODY paragraph 2, checksum-verified,
  //                        unchanged, both approved links intact.
  // So every word already in the checksum-verified copy pack survives verbatim;
  // only the new top paragraph and the new H3 lack a copy-pack checksum. Flagged
  // in the build report for copy-side confirmation before this ships.
  //
  // ctaLabel/ctaHref reuse the "Explore the project gallery" -> /gallery pair
  // already established by the hub itself, fire-rated and with-toilet.
  // Card image: no dedicated 16:9 split-card asset was supplied in the handoff,
  // and every one of this page's 36 gallery photos is 1254x1254 (1:1) — cropping
  // one is forbidden. Per CLAUDE.md's own fallback ("If a page has no spare 16:9
  // image, reallocate one from the Description tab"), this reuses the
  // Description tab's img-1 (`puf-porta-cabin-panel-white-exterior.webp`, true
  // 1672x941), whose approved alt — "flat panel faces and visible vertical
  // panel joints" — ties directly to the copy beside it. Carried verbatim; no
  // new alt authored.
  'puf-porta-cabin': {
    heading: 'When a PUF Panel Envelope Beats a Framed and Lined Cabin',
    body: (
      <>
        Choosing the right cabin is easier when you focus on how the space will actually be used. If you need a comfortable, insulated room that looks finished as soon as it arrives, a PUF panel cabin often makes more sense.
      </>
    ),
    comparison: (
      <>
        That trade suits occupied rooms in hot climates and any project where the interior has to look finished immediately. Where the priority is a heavy fixed-position industrial shell instead, the <Link className={linkClass} href={href('ms-porta-cabin')}>MS porta cabin</Link> answers it better. <Link className={linkClass} href="/contact">Send us your site conditions and opening schedule</Link> and we will quote the panel system against them.
      </>
    ),
    splitCard: {
      imageSrc: '/images/products/puf-porta-cabin/description/puf-porta-cabin-panel-white-exterior.webp',
      imageAlt: 'Cream PUF panel cabin with brown trim, showing flat panel faces and visible vertical panel joints',
      imageWidth: 1672,
      imageHeight: 941,
      subheading: 'One panel does three jobs',
      body: 'A framed cabin carries insulation inside a structural shell, so the wall builds up in layers and the lining becomes a separate trade. A PUF cabin inverts that. The panel is the wall: outer skin, insulated core and finished inner face arrive as one factory element, and the steel takes its sizing from that panel\'s span. You gain a continuous insulated envelope and a clean interior on day one. You accept a discipline in exchange, because the core cannot be cut open for services after the fact.',
      position: 'comparisonInsideCard',
      ctaLabel: 'Explore the project gallery',
      ctaHref: '/gallery',
    },
  },
  'porta-cabin-with-toilet': {
    heading: 'Choose One Combined Unit Instead of Two Separate Deliveries',
    // v1.3 §1.1 — both Section-2 paragraphs are body copy, not body-plus-emphasis, so
    // they ride the `bodyParagraphs` run PC-02 introduced. That renders exactly the
    // classes the PC-04 `uniformParagraphWeight` flag used to produce, so the flag is
    // dropped rather than kept as a second mechanism doing the same job.
    bodyParagraphs: [
      (
        <>
          Buyers usually reach this page with one decision to make: order a cabin and a toilet as separate units, or take both inside one shell. A combined unit needs one transport slot, one level base and one plumbing hook-up. Its wet zone arrives lined, waterproofed and piped from the factory. Separate units make sense when the toilet must sit away from the work area, or when several crews share one facility. If you need sanitation alone, without a working room, a <Link className={linkClass} href="/product/portable-toilet">standalone portable toilet</Link> is the better fit and costs less.
        </>
      ),
      (
        <>
          The porta cabin with toilet suits gate offices, supervisor cabins and crew facilities where people work through the day and the washroom must stay inside the same footprint. Share your size, seat count and site location, and <Link className={linkClass} href="/contact">request a fixed quotation</Link> from our team; we return it within 48 hours.
        </>
      ),
    ],
    // v1.3 §1.1 — premium split card. Copy verbatim from the ticket. The image is
    // the 20x10 corner-interior shot, used by no gallery or Description slot, so
    // page-wide file uniqueness holds. CTA target taken from the live main
    // navigation (Header.tsx: Gallery -> /gallery), not guessed.
    splitCard: {
      imageSrc: '/images/products/porta-cabin-with-toilet/section2/porta-cabin-with-toilet-20x10-corner-interior.webp',
      imageAlt: 'Cubicle row with washbasin counter and mirror inside the 20x10 unit',
      imageWidth: 1280,
      imageHeight: 720,
      subheading: 'See the wet-zone finish before you commit',
      body: 'Look at completed SAMAN cabins from our Bengaluru and Greater Noida factories: the lining, the sealed vinyl floor, the door hardware and the openings. Judge the finish on real deliveries, then settle your size and seat count with confidence.',
      ctaLabel: 'Explore the project gallery',
      ctaHref: '/gallery',
    },
  },
  // PC-06 (15 Aug 2026) — Section 2 "buyer orientation" copy from copy pack v2,
  // verbatim. The approved link map carries exactly two S2 body links: MS porta
  // cabin and /contact.
  // v1.2 addendum (15 Aug 2026) — split card added from copy pack v3
  // SECTION2_CARD_* fields, verbatim. The card's own CTA targets the same
  // /contact destination as the top block's CTA (deliberate per the addendum:
  // one conversion destination, two appearances), so the page's internal-link
  // count stays five. Card image is the reallocated Description-tab D1 slot
  // (charcoal exterior); the Description tab now carries D2-D6 only.
  'soundproof-porta-cabin': {
    heading: 'Choose this cabin when noise, not weather, sets the site problem',
    body: (
      <>
        Most site accommodation is chosen on footprint, weather cover and price. This cabin is chosen when the deciding factor is the sound coming through the wall. A supervisor cannot take a call beside a running genset. A QA team cannot hear a measurement in a crusher yard. A shift briefing fails when the highway sits twelve metres away. The acoustic build changes four things: the chassis sizing, the wall and ceiling layers, the door and glazing, and the ventilation route.
      </>
    ),
    comparison: (
      <>
        If noise is not the governing issue, the standard <Link className={linkClass} href={href('ms-porta-cabin')}>MS porta cabin</Link> is better value. You would be paying for lining mass and decoupling you will not use. Where noise does govern, <Link className={linkClass} href="/contact">tell us the source, the distance and the internal condition you need to hold</Link>. We will then price the assembly against that target rather than sell a generic claim.
      </>
    ),
    splitCard: {
      imageSrc: '/images/products/soundproof-porta-cabin/description/soundproof-porta-cabin-charcoal-exterior.webp',
      imageAlt: 'Charcoal soundproof porta cabin with a single door and one window, standing on concrete pads',
      imageWidth: 1672,
      imageHeight: 941,
      subheading: 'What to send us so the acoustic build can be priced',
      body: 'Sound control is priced against a target, not sold from a catalogue. Four inputs let the engineering team size the mass, the cavity and the openings correctly before the quotation is issued.',
      bullets: [
        'The noise source: genset, crusher, highway, plant room or workshop',
        'Its distance from the cabin, and whether anything blocks the path',
        'The internal condition you need to hold, stated as your criterion',
        'Hours of use, and whether the site also runs at night',
      ],
      ctaLabel: 'Request a fixed 48-hour quotation',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
  // PC-08 (15 Aug 2026) - Section 2 "buyer orientation" copy from copy pack v1
  // section 3, verbatim, SHA-256 verified (S2_H2 70e3190c, S2_BODY c6c9c882). Two
  // paragraphs: the first carries no link, the second carries both approved link-map
  // anchors (MS porta cabin, /contact). Split card fields (SECTION2_CARD_*) verified
  // separately; the card CTA targets the same /contact destination named in the
  // ticket's own link map, distinct wording from the top-block CTA.
  'skid-mounted-porta-cabin': {
    heading: 'When a Skid Chassis Earns Its Cost on a Cabin That Moves',
    body: (
      <>
        We design a standard site cabin around the position it will occupy. A skid-mounted cabin answers the journey between positions instead, and that changes the build rather than the finish. The runners take the lift. The bracing resists the twist a trailer bed puts through the frame. The liner tolerates vibration that loosens board joints. Services terminate at a labelled external zone, so a site working in a hurry cannot tear the internal distribution.
      </>
    ),
    comparison: (
      <>
        The trade runs both ways, and we state it plainly. You pay the highest rate in our porta cabin range. In return the cabin survives a duty that quietly destroys lighter units. Where it will sit in one place for its working life, the heavy industrial build of the <Link className={linkClass} href={href('ms-porta-cabin')}>MS porta cabin</Link> gives you more for the same money. <Link className={linkClass} href="/contact">Tell us how often the cabin moves and how it will be lifted</Link> and we will quote the runner sizing against it.
      </>
    ),
    splitCard: {
      imageSrc: '/images/products/skid-mounted-porta-cabin/section2/skid-mounted-porta-cabin-section2-green-exterior.webp',
      imageAlt: 'Dark green relocatable steel cabin with three windows, a flush door, wall vents and free-standing steel steps',
      imageWidth: 1672,
      imageHeight: 941,
      subheading: 'What Repeated Handling Breaks First on a Cabin',
      body: 'Cabins rarely fail on the lift itself. They fail slowly, in details a single placement never tests. The skid specification therefore concentrates on the four things that give way first.',
      bullets: [
        'Door frames that rack and stop closing square',
        'Panel and liner joints loosened by road vibration',
        'Wall insulation that slumps and is never seen',
        'Service connections torn because nobody disconnected them first',
      ],
      ctaLabel: 'Send your move plan for a 48-hour quotation',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
  // PC-09 (15 Aug 2026) — Section 2 "buyer orientation" copy from copy pack v1
  // section 3, verbatim, both blocks mandatory. The ticket's own paragraph-1
  // label says "(contains the one contextual internal link)" but both approved
  // anchors ("mild steel porta cabin" -> ms-porta-cabin, "request a fixed
  // 48-hour quotation" -> /contact) are textually inside paragraph 2, not
  // paragraph 1 — paragraph 1 carries no anchor phrase at all. Wired to match
  // where the anchor text actually sits, per the ticket's own explicit Link 1 /
  // Link 2 instructions, not the header label; flagged as a one-line ticket
  // inconsistency. Two equal-weight paragraphs -> `bodyParagraphs`, default
  // (`end`) position: split card renders below both, as its own block, matching
  // the ticket's "TWO BLOCKS, both mandatory" structure.
  'knock-down-porta-cabin': {
    heading: 'When a Cabin Should Arrive as a Kit Instead of a Finished Box',
    bodyParagraphs: [
      (
        <>
          Most site cabins are welded up in the factory and delivered whole. That is the right answer when a trailer can reach the position and the cabin will stay there. It stops being the right answer when the approach road will not take a 40 ft load, when the set-down point sits behind a gate or inside a built compound, or when the cabin must come down again and go up elsewhere. A kit turns one heavy lift into a sequence of components people can carry, place and bolt.
        </>
      ),
      (
        <>
          The trade is real and worth stating plainly. A bolted cabin carries more connections than a welded one, and every connection is a joint that has to be sealed, checked and re-tightened. If your cabin is going to one place and staying there, a <Link className={linkClass} href={href('ms-porta-cabin')}>mild steel porta cabin</Link> is the simpler and cheaper answer. Tell us your access constraint and your reuse plan, and we will <Link className={linkClass} href="https://www.samanportable.com/contact">request a fixed 48-hour quotation</Link> against both routes.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/knock-down-porta-cabin/section2/kd-section2-card-exterior-graphite-20x10.webp',
      imageAlt: 'Graphite grey 20x10 ft knock-down porta cabin with champagne corner posts and a white door',
      imageWidth: 1672,
      imageHeight: 941,
      subheading: 'What You Are Actually Buying When You Buy a Kit',
      body: 'A kit is not a pile of steel with a drawing. It is a defined set of numbered members, panels, gaskets and fasteners, supplied with the sequence they go together in and the torques they are tightened to.',
      bullets: [
        'Numbered structural members with engineered splice plates and bolts',
        'A panel schedule matching every wall, roof and floor position',
        'A gasket and sealant set for joints, corners and penetrations',
        'A fastener schedule with the assembly and torque sequence',
      ],
      ctaLabel: 'Ask us what the kit includes for your size',
      ctaHref: 'https://www.samanportable.com/contact',
    },
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
