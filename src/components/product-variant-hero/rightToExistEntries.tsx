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
    /** LC-05 - reserve the ruled 16:9 media slot while the source is awaiting
        human verification. No image, alt text or substitute is emitted. */
    /** PC-02 revision v1.2 (14 Aug 2026) — optional. The split layout is a mandatory
        cluster design, but a page whose approved copy supplies no card sub-heading or
        card body must render the panel without them rather than invent either. The hub
        supplies both, so its markup is unchanged. */
    subheading?: string;
    body?: string;
    /** LC-03 (17 Aug 2026) — a second card paragraph, for approved copy that
        splits the card body into two short paragraphs rather than one
        paragraph plus bullets (the standing Section 2 shape rule allows
        either). Rendered directly below `body`. Absent everywhere else, so
        every other split card's markup is byte-identical. */
    body2?: string;
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
  // PC-01 (14 Aug 2026) — Section 2 "buyer orientation" copy from the approved MS
  // build ticket, verbatim, mapped onto this existing heading/body/comparison card.
  // The previous entry's links to steel-porta-cabin and portacabin-office are gone:
  // the approved §7 link map carries exactly two S2 body links, the hub and /contact.
  // Phase 1 Porta Cabin consolidation (SAMAN approval, 15 Aug 2026): the entries
  // for low-cost-porta-cabin, luxury-porta-cabin, mini-porta-cabin,
  // steel-porta-cabin and portacabin-office are removed. All five routes now 301,
  // so the entries were unreachable, and between them they carried the last
  // in-copy links to portacabin-office anywhere in this file. No copy that renders
  // on a surviving page was edited: every removed block belonged to a retired page.
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
  // PC-10 (15 Aug 2026) - Section 2 "buyer orientation" rewrite from copy pack v1
  // section 3, verbatim, SHA-256 verified (SECTION2_H2 0f6fa307, SECTION2_P1
  // 6f914343, SECTION2_P2 8c584530). Two paragraphs on `bodyParagraphs`: the first
  // carries no link, the second carries both approved link-map anchors (MS porta
  // cabin, /contact). Split card fields (SECTION2_CARD_*) verified separately; the
  // card CTA reuses the same /contact destination as the top block's CTA, per the
  // build prompt's own link map (five unique destinations, plus /contact twice).
  // Card image is manifest slot 42, the native 16:9 teal-exterior render - no crop,
  // no reuse from the gallery or Description tab.
  'porta-cabin-shop': {
    heading: 'Why a Trading Cabin Is Not an Office Cabin With a Window Cut In',
    bodyParagraphs: [
      (
        <>
          An office cabin is designed for the people inside it. A shop is designed for the person standing outside it, and nearly every specification choice follows from that. The opening has to be wide enough to serve through and secure enough to close. The floor takes trolleys, spills and customer traffic rather than office chairs. The face your customer looks at is a finish, not a lining.
        </>
      ),
      (
        <>
          This is also why cutting a service window into a finished office cabin rarely ends well. A large opening in a wall never framed for it weakens the panel run, and a cut edge made on site cannot be sealed to the standard of a factory edge. If your staff work inside and nobody buys anything at the wall, a <Link className={linkClass} href={href('ms-porta-cabin')}>mild steel porta cabin</Link> is the simpler and cheaper build. If you are trading from it, tell us your frontage width and your closing arrangement, and we will <Link className={linkClass} href="/contact">send a fixed quotation within 48 hours</Link>.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/porta-cabin-shop/section2/porta-cabin-shop-section2-frontage-teal.webp',
      imageAlt: 'Teal shop cabin with a wide propped service opening, a counter ledge and a full-height glazed customer door',
      imageWidth: 1672,
      imageHeight: 941,
      subheading: 'The Frontage Is the Part You Are Actually Buying',
      body: 'Four decisions set what your shop looks like from the pavement: how much of the front is glazed, whether you serve through a counter opening or across a floor, how the unit locks overnight, and where the signage sits.',
      bullets: [
        'Large aluminium service glazing with a lockable counter opening',
        'Staff or customer door, positioned for your trading pattern',
        'Lockable service shutter for closing the unit overnight',
        'Signage zones and equipment power points set to your layout',
      ],
      ctaLabel: 'Tell us your frontage width and we will price it',
      ctaHref: 'https://www.samanportable.com/contact',
    },
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
  // LC-00 (16 Aug 2026) - Section 2 "buyer orientation" rewrite from build prompt
  // v1 section 3.2/3.3, verbatim, SHA-256 verified against every granular field in
  // the ticket (only the whole-document Description-tab convenience hash was
  // stale; this Section 2 copy is unaffected). Two paragraphs on `bodyParagraphs`:
  // the second carries the one approved link, `a labour shed` -> labor-sheds.
  // Split card CTA reuses the same /contact destination as the top block's CTA,
  // per the ticket's own link map (section 10).
  'labor-colony': {
    heading: 'Why This Page Covers a Whole Colony, Not a Single Building',
    bodyParagraphs: [
      (
        <>
          Most buyers reach this page with a headcount, not a drawing. That is the right place to start. A colony is a settlement, so the real question is how many blocks you need. Then you decide how they sit on the plot. After that, you fix where the toilets, kitchen and site office go. Get that order wrong and the colony works badly for years. So we plan the whole site first and price the buildings second.
        </>
      ),
      (
        <>
          A single structure is a different purchase altogether. If you only need one building standing on its own, <Link className={linkClass} href={labourHref('labor-sheds')}>a labour shed</Link> answers that need directly and costs far less. This page is instead for the buyer who must house a workforce and run a site around it. Because every plot differs, we start from your numbers. Send us your peak headcount, plot size and location. Then we return a block mix, a layout and a fixed written price.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/labor-colony/section2/labour-colony-block-site-context-16x9.webp',
      imageAlt: 'Two-storey labour colony block on a paved site, with external stair and railed walkways to both floors',
      imageWidth: 1920,
      imageHeight: 1080,
      subheading: 'How Many Blocks Does Your Site Actually Need?',
      body: 'First divide your peak headcount by the bunks in one block. Then add a block for growth, because sites almost always grow. So a 300-worker site usually runs two or three dormitory blocks plus its services.',
      bullets: [
        'Count your peak workers, not just the day-one crew',
        'Keep the sleeping blocks well away from the kitchen',
        'Leave a clear fire route and ambulance access lane',
        'Fix the toilet block ratio before you place the order',
      ],
      // No CTA label text is given in the ticket (section 3.3 hashes the H3,
      // paragraph and four bullets, not a CTA string) - "request a fixed
      // 48-hour quotation" is the exact phrase already reused verbatim on
      // three other pages in this file for the same /contact destination,
      // not authored fresh for this entry.
      ctaLabel: 'request a fixed 48-hour quotation',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
  // LC-02 (16 Aug 2026) - Section 2 "buyer orientation" rewrite from copy pack
  // v1, verbatim, SHA-256 verified against every field (25/25 match). TWO
  // BLOCKS per the ticket's own repeated rule: top block on `bodyParagraphs`
  // (both paragraphs are equal-weight prose, not a body-plus-emphasis pair),
  // split card below with its own H3/paragraph/4 bullets/CTA. Both approved
  // S2_PARA_2 links sit inside that single paragraph: `labour hutments` to
  // labor-hutments, and the /contact CTA phrase. Card image is the sole
  // approved split-card asset (media manifest 5.2), reallocated from the
  // Description tab per the ticket's own note - the original split-card
  // source was rejected (gap G3).
  'labor-sheds': {
    heading: 'Why an Open Hall Beats a Room Block for Large Site Crews',
    bodyParagraphs: [
      (
        <>
          The decision is not really about the building. It is about whether your workforce can share one sleeping space. An open hall puts every bunk under one roof with one aisle, which is why it costs less per bed and goes up faster than any partitioned option. Nothing inside is spent on walls, doors or corridors, and the money saved goes into the frame, the floor and the ventilation. The trade you accept is privacy: there is no lockable room anywhere in the hall.
        </>
      ),
      (
        <>
          If the crew needs lockable rooms, supervisor privacy or family accommodation, the shed is the wrong product and a partitioned block is the right one. That is a real fork in the road, so compare the two before you price either, because switching later means rebuilding rather than adapting. Our <Link className={linkClass} href={labourHref('labor-hutments')}>labour hutments</Link> page covers the room-block route. When you know which one fits, <Link className={linkClass} href="https://www.samanportable.com/contact">send us your crew size and site details</Link> and we will quote it.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/labor-sheds/section2/labour-shed-open-hall-split-card.webp',
      imageAlt: 'Single-storey labour shed with an open door showing bunk beds inside and a continuous louvre band',
      imageWidth: 1672,
      imageHeight: 941,
      subheading: 'Shed or Room Block: How to Decide Quickly',
      body: 'Answer one question first. Can the crew sleep in shared, undivided space for the length of this project? If yes, the shed is cheaper per bed and quicker to erect.',
      bullets: [
        'Shed: highest bed density, lowest cost per bed',
        'Shed: one hall, one aisle, distributed exits',
        'Room block: lockable rooms, supervisor and family use',
        'Both: sanitation stays in a separate structure',
      ],
      ctaLabel: 'Get a quote for your crew',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
  // LC-01 (17 Aug 2026) - Section 2 "buyer orientation" rewrite from build prompt
  // v1 section 4, verbatim (no SHA-256 was supplied in this ticket, unlike
  // LC-00/PC-10; verified instead against every character count in the
  // ticket's own acceptance table, section 9 - 20/20 exact matches). Two
  // paragraphs on `bodyParagraphs`: the second carries both approved links,
  // `plan the whole colony` -> the colony hub and `request a hutment
  // quotation` -> /contact. Split card CTA reuses the same /contact
  // destination, per the ticket's own link map (section 6).
  'labor-hutments': {
    heading: 'Why a Single Hutment Beats a Block When the Crew Is Small',
    bodyParagraphs: [
      (
        <>
          A colony block is the right answer when a site houses a hundred workers for two years. It is the wrong answer when a contractor needs sixteen beds next month on a plot corner that will be built over later. The hutment exists for that second case. Each unit is complete on its own, so beds arrive in the number the programme needs, and the order can be repeated when the workforce grows.
        </>
      ),
      (
        <>
          That also changes what happens at the end. A hutment sits on plinth pads rather than a poured raft, and the prefab floor option is built to be lifted and set down again, so a unit can follow the work to the next site. If the requirement is instead a full settlement with roads, sanitation and dining, <Link className={linkClass} href={LABOUR_COLONY_HREF}>plan the whole colony</Link> rather than ordering units one at a time. Send us your crew size, site location and start date and we will price the exact combination you need: <Link className={linkClass} href="/contact">request a hutment quotation</Link>.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/labor-hutments/section2/labor-hutments-single-unit-site-context-16x9.webp',
      imageAlt: 'A single labour hutment standing alone on a prepared site hardstanding with open space around it.',
      imageWidth: 1920,
      imageHeight: 1080,
      subheading: 'Which Hutment Size Fits Your Site Crew?',
      body: 'Size follows the bed plan, not the other way round. Count the workers who must sleep on site at peak, allow for a clear central aisle and locker space, then pick the smallest unit that holds them comfortably.',
      bullets: [
        'Four to five workers, take the 10x10 or 12x10',
        'Seven to ten workers, take the 12x15 or 12x20',
        'Twelve to sixteen workers, take the 15x20 or 20x20',
        'Mixed gangs or shift work, order two smaller units',
      ],
      ctaLabel: 'Request a hutment quotation',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
  // LC-05 (16 Aug 2026) - build prompt v1 Section 2, both blocks mandatory.
  'accommodation-container': {
    heading: 'Container Module or Panel Bunkhouse: Which One Your Site Needs',
    bodyParagraphs: [
      (
        <>
          A container module and a panel bunkhouse both sleep site crews, and they are built differently. SAMAN fabricates the bunkhouse from PUF and EPS panel on a steel base. The Accommodation Container is a container-form steel box. At 8 ft width it begins as a used shipping container, and above that width we weld it up from MS corrugated sheet. Choose the container route when the unit will be lifted between sites repeatedly and handled by yard equipment.
        </>
      ),
      (
        <>
          Width is the second decision, and it changes the plan more than length does. An 8 ft shell gives one bunk run and a side aisle. A 10 or 12 ft wide-body gives two bunk runs with a central aisle, which is why most site managers move up once the crew grows. The wider range of worker housing, from single modules to complete settlements, sits on the <Link className={linkClass} href="https://www.samanportable.com/product/labor-colony">labour colony hub</Link>. <Link className={linkClass} href="https://www.samanportable.com/contact">Send us your headcount and site access and we will quote the right width.</Link>
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/accommodation-container/section2/lc05-split-build-routes.webp',
      imageAlt: 'Converted 20x8 ft shipping container beside a fabricated 40x12 ft wide-body module',
      imageWidth: 1280,
      imageHeight: 720,
      subheading: 'Converted Shell or Fabricated Wide-Body?',
      body: 'The two routes are priced and specified differently, and the difference is visible on the drawing rather than in the brochure. Match the route to how the unit will be moved and how long it stays.',
      bullets: [
        'Converted shells: 20x8 ft and 40x8 ft only',
        'Wide-body fabricated: 20x10, 30x10, 40x10, 40x12 ft',
        'Donor condition is inspected and recorded before build',
        'Cut openings receive engineered headers and jambs',
      ],
      ctaLabel: 'Ask for a route recommendation',
      ctaHref: 'https://www.samanportable.com/contact',
    },
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
  // LC-06 (17 Aug 2026) - Section 2 "buyer orientation" rewrite from copy pack
  // v1, verbatim, SHA-256 verified against every field (28/28 match). Both
  // paragraphs are equal-weight prose on `bodyParagraphs`. The single
  // approved contextual link sits inside paragraph 2: `prefab labour camps`
  // to prefab-labor-camps. The ticket's own separate SECTION2_CTA field has
  // no top-level ctaLabel/ctaHref slot to render into on this branch of the
  // interface (RightToExistEntry only carries ctaLabel/ctaHref inside
  // splitCard) - the LC-04 revert removed that field before this page
  // merged, so the CTA sentence is instead rendered as an inline link
  // closing paragraph 2, the same convention labor-hutments above already
  // uses for its own closing CTA.
  'prefab-site-canteen': {
    heading: 'Buying the canteen building rather than the catering operation',
    bodyParagraphs: [
      (
        <>
          Most canteen quotations in this market arrive as a single rate per square foot with no scope attached. That is why the same 400 sq ft canteen can be quoted at Rs 600 and at Rs 1,200. One price covers a clean enclosure with a serving hatch and a drain. The other quietly includes a cookline, an extraction hood and a set of tables. Neither supplier is lying. They are answering different questions.
        </>
      ),
      (
        <>
          This page answers one question only: what does the building cost. If you also need the whole camp around it, our <Link className={linkClass} href="https://www.samanportable.com/product/labor-colony/prefab-labor-camps">prefab labour camps</Link> page prices accommodation blocks the same way, block by block. Your caterer or contractor brings the cooking equipment, and we frame the openings and run the services it needs. Tell us the headcount, the number of meal sittings and whether cooking happens on site or arrives in insulated carriers, and the size answers itself. <Link className={linkClass} href="https://www.samanportable.com/contact">Send us your headcount and meal sittings for a canteen quotation</Link>.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/prefab-site-canteen/section2/canteen-splitcard-serving-and-dining.webp',
      imageAlt: 'Prefab site canteen showing the serving hatch side and dining glazing',
      imageWidth: 1920,
      imageHeight: 1080,
      subheading: 'Why we do not print a diner count on this page',
      body: 'Seating follows the table plan and the number of meal sittings, not the floor area. The same 600 sq ft block feeds twice as many workers on two sittings as on one. A published diner count would be a guess.',
      bullets: [
        'Two sittings roughly double the workforce a block serves',
        'Bench seating fits more diners than four-seat tables',
        'Serving-line length sets the queue, not the dining floor',
        'Tray return and wash areas take floor away from seating',
      ],
      ctaLabel: 'Ask for a seating and sittings layout',
      ctaHref: 'https://www.samanportable.com/contact',
    },
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
  'oil-field-camp': {
    heading: 'Why a Camp That Moves Is Built Differently From One That Stays',
    bodyParagraphs: [
      (
        <>
          Buyers reach this page from two directions. Some need worker housing for a project that will run in one place for years, which is a settlement question rather than a module question. Others need four to sixteen people fed, rested and back on shift beside a rig that will be released in a few months. This page is written for the second buyer. A camp that stays can be bolted together on a prepared pad; a camp that moves has to survive every lift, every move and every reinstatement.
        </>
      ),
      (
        <>
          That difference drives almost every choice here: the runner-beam skid, the welded superstructure, the reduced glazing, the service entries that disconnect without cutting. If your crew is not going anywhere, a fixed block from our <Link className={linkClass} href={labourHref('prefab-labor-camps')}>prefab labour camps range</Link> will serve you better and cost less. If it is, <Link className={linkClass} href="/contact">send us the location, the crew size and the moves you expect</Link> and we will quote the right module.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/oil-field-camp/section2/oil-field-camp-door-and-services-detail.webp',
      imageAlt: 'Door end of an oil field camp module showing steps, external AC condenser and protected electrical entry',
      imageWidth: 1600,
      imageHeight: 900,
      subheading: 'Shell Price or Fitted Price: What Changes',
      body: 'Two prices appear against every size. The shell rate covers the module itself: structure, skid, envelope, insulation, lining, floor finish, doors, windows, lighting, sockets and earthing.',
      body2: 'The fitted rate adds what crews always ask about: bunk beds, the toilet fit-out and the split AC unit itself. The shell carries AC provision, meaning the bracket, the point and the wall penetration, not the machine.',
      ctaLabel: 'Ask for a fitted-scope quotation',
      ctaHref: 'https://www.samanportable.com/contact',
    },
  },
  'ablution-block': {
    heading: 'When One Wash Block Beats a Scatter of Single Toilet Cabins',
    bodyParagraphs: [
      (
        <>
          Most camps reach this page after the single cabins stop coping. Ten units mean ten water connections, ten drain runs and ten cleaning stops, and the crew still queues at the two nearest ones. A multi-toilet ablution block replaces that with one building on one manifold, planned around the wash routine rather than around what fits on a trailer. It belongs inside a wider camp layout, so plan it alongside the accommodation and the service spine on your <Link className={linkClass} href={LABOUR_COLONY_HREF}>labour colony</Link> plot.
        </>
      ),
      (
        <>
          The block suits any project where the workforce stays long enough to justify a settled wash routine: a construction camp, a plant shutdown, a highway or transmission job, a mine, a relief deployment. Where you need sanitation for a few people at a gate, a single cabin is still the cheaper answer. Send us your headcount, your shift pattern and your drainage level, and <Link className={linkClass} href="/contact">request a fixed quotation</Link>; we return it within 48 hours.
        </>
      ),
    ],
    splitCard: {
      imageSrc: '/images/products/ablution-block/section2/ablution-block-split-card-camp-context.webp',
      imageAlt: 'Ablution block installed on an Indian labour camp site, entry and service side both visible',
      imageWidth: 1600,
      imageHeight: 900,
      subheading: 'Choose the Depth Before You Choose the Length',
      body: 'Length adds cubicles. Depth changes the plan. At 10 ft the block runs one bank served from one wall. At 12 ft two banks face each other across a central pipe duct, and every fixture sits nearer its isolation valve.',
      bullets: [
        '10 ft depth: one bank, shortest service run, smallest plot',
        '12 ft depth: two banks sharing one central pipe duct',
        '20 ft depth: dry entry lobby and split sides become possible',
        'Every depth ships as one factory-built and wet-tested block',
      ],
      ctaLabel: 'Send your camp headcount and site levels and request a fixed quotation.',
      ctaHref: 'https://www.samanportable.com/contact',
    },
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
