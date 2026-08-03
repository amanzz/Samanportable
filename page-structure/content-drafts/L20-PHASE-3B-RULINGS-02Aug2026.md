# L20 PHASE 3B RULINGS + THE TWO OPEN FIXES — 02 Aug 2026

Fable 5 read all 870 flag rows. Most are detector noise. Rulings are per class.

---

## A · THE TWO ITEMS FROM THE LAST REPORT

### A1 · Seven Rule G placeholders, ruled

All seven sit in one comparison table on `/product/portable-office/prefabricated-office-cabins` and mean "not covered on this page". A bare dash is not punctuation here, but it is also poor for a screen reader. **Replace all seven em dashes with the words `Not covered`.** No other change to that table.

### A2 · The "look no further" paragraph, defect confirmed

Deleting the sentence broke the paragraph. `These compact and portable structures` now has no antecedent, because the deleted sentence was what introduced porta cabins. **Insert this replacement sentence in its place, verbatim:**

`A porta cabin answers all three needs at once.`

The paragraph then reads: question, answer, `These compact and portable structures...`. Antecedent restored and the word count returns inside the one percent gate.

**Standing correction to the sweep rule:** a Phase 3a deletion may never leave a dangling reference. Where deleting a filler sentence removes the noun that a following sentence depends on, the deletion is reported and held for Fable 5, not applied blind.

---

## B · CLASS RULINGS ON THE 870 FLAGS

### B1 · Three-item rhetorical triad, 244 rows: DISMISSED ENTIRELY, false positive

42 rows are inline CSS parsed as prose. Of the rest, the dominant pattern is our own certification line: `ISO 9001:2015 (Cert No. E20250218645), ISO 14001:2015 (...), ISO 45001:2018 (...)`. That is L15 canonical factual data and explicitly exempt. **No action on any triad row. The detector is wrong and must exclude style blocks, script blocks and certification strings before it is ever run again.**

### B2 · Rhetorical question headings, 422 rows: MOSTLY FALSE POSITIVE

248 distinct strings, of which 167 are one repeated blog CTA. Genuine FAQ questions and real editorial headings such as `MS Frame or Sandwich Panel: Which Holds Up Better in Delhi's Climate?` are good headings that answer buyer intent, and they stay untouched.

**Act on template CTA headings only.** Replacements, verbatim:

| Current heading | Replacement |
|---|---|
| `Enjoyed this article?` (167 instances) | `More on this topic` |
| `Still have questions?` | `Questions we are asked most` |
| `Ready to Get Started?` | `Start your order` |
| `Ready to Work With Us?` | `Work with SAMAN` |
| `Looking to Buy Instead?` | `Buying instead of renting` |
| `Looking to Buy Instead of Rent?` | `Buying instead of renting` |
| `Why Choose Saman Portable?` | `Why buyers choose SAMAN` |
| `Why Choose Saman Portable for Your Cabin Needs?` | `Why buyers choose SAMAN` |

Every other rhetorical-question row is dismissed.

### B3 · Emoji in body copy, 121 rows: REAL, ACT

Emoji in body copy on a manufacturer's site reads as spam and is a clear generated-content signal. **Remove every emoji from body copy, headings, alt text and meta while preserving the fact beside it.** Examples: `📞 +91 97089 89937` becomes `+91 97089 89937`; `📍 Factory: Bangalore · South India + Greater Noida` becomes `Factory: Bangalore, South India and Greater Noida`; `✅` and `👉` and `🏗️` are deleted with the surrounding text left intact.

**Exception:** emoji inside a genuine quoted customer review stay, because we do not edit what a customer wrote. Report each review-quoted emoji separately so Fable 5 can confirm it is a real review.

### B4 · Phrase tells, 78 rows: REAL, WITH FOUR LEGITIMATE USES PROTECTED

**Protected, no change:** `Both Acts empower labour inspectors to issue stop-work notices and fines for non-compliance` on `/product/portable-toilet` (correct legal usage) · `A seamless 20-foot wall is a render, not a product` and `You want a seamless large-sheet look, panel joints show as lines` on `/product/wall-sheet` (genuine technical term about sheet joints) · every `game-changer` inside a quoted customer review.

**`Whether you need A, B or C` openers are DOWNGRADED and kept** where they list real specific options, such as the Janakpuri, Dwarka and Rajouri Garden line. They are useful buyer copy, not a tell. No action.

**Replacements, verbatim:**

| URL | Current | Replacement |
|---|---|---|
| `/` | `A Seamless 6-Step Journey` | `Our 6-Step Process` |
| `/18-benefits-of-luxury-portable-cabin` | `In today's fast-paced world, the demand for versatile and efficient solutions for workspace management has never been greater.` | `Demand for flexible workspace has risen sharply as projects move faster and sites change more often.` |
| `/18-benefits-of-luxury-portable-cabin` | `The ability to adapt quickly is a key advantage in today's fast-paced work environments.` | `Being able to reconfigure a space in days rather than months is the practical advantage.` |
| `/18-benefits-of-luxury-portable-cabin` | `Luxury portable cabins have revolutionized the way businesses think about workspace solutions.` | `Luxury portable cabins have changed what businesses expect from a temporary workspace.` |
| `/about-us` | `...that empower businesses to grow, adapt, and thrive in a dynamic world.` | `...that help businesses grow and adapt as their sites and teams change.` |
| `/about-us` | `understanding not just space requirements, but the goals and challenges behind them.` | `understanding the space required, and the goals and constraints behind it.` |
| `/container-house-price-in-tamil-nadu` | `The world of container homes is diverse, with various types available to suit different needs and preferences.` | `Container homes come in several types, each suited to a different need and budget.` |
| `/container-house-price-in-tamil-nadu` | `This can be particularly beneficial for buyers seeking a one-stop solution for their container home acquisition.` | `This suits buyers who would rather deal with one supplier from drawing to delivery.` |
| `/container-houses-cost-guide-2024` | every `revolutionizing` instance | `changing` |
| `/container-houses-cost-guide-2024` | `To find detailed pricing and designs tailored to your needs, visit our porta cabin product page.` | `For current pricing and the size ladder, see our porta cabin product page.` |
| `/pre-engineered-buildings-in-bangalore` | `Modular designs have revolutionized the commercial sector...` | `Modular designs have changed how commercial buildings are procured...` |
| `/pre-engineered-buildings-in-bangalore` | `The architecture of pre-engineered buildings in Bangalore is a testament to the limitless possibilities offered by this construction technique.` | `Pre-engineered buildings in Bangalore show how far the technique now stretches in span, height and finish.` |
| `/product/peb-constructions/pre-engineered-structures` | `(PEBs) are a game-changer in construction, offering top-notch strength and flexibility.` | `(PEBs) changed how large spans are built, combining high strength with design flexibility.` |
| `/product/porta-cabins/portacabin-office` | `The Portacabin Office is a game-changer for businesses seeking flexibility.` | `The Portacabin Office suits businesses that need to move or resize a workspace quickly.` |
| `/product/porta-cabins` | `It was quick and seamless, saving us a lot of time.` | Review text, protected, no change |
| `/portable-cabin-price-in-bangalore` | `Our guide dives into the world of portable cabin solutions.` | `This guide covers portable cabin options, sizes and prices in Bangalore.` |
| `/portable-cabins-in-kr-puram` | `The world of portable cabins is changing fast.` | `Portable cabin design and pricing are changing fast.` |
| `/portable-cabins-in-peenya` | `The world of portable solutions is growing fast.` | `Demand for portable buildings is growing fast.` |
| `/temporary-garden-shed` | `The world of garden storage has changed a lot in recent years.` | `Garden storage has changed a lot in recent years.` |
| `/porta-cabins-in-domlur` | `not just a sales address, but a service-vehicle dispatch radius that holds the line on warranty SLAs.` | `a service-vehicle dispatch radius that holds the line on warranty response times, not merely a sales address.` |
| `/portable-cabins-in-frazer-town` | `We aim to make products that are not just good but also make our users happy.` | `We aim to make products that work well and that our customers are glad they bought.` |
| `/portable-cabins-in-hennur` | `It makes sure portable cabins are not just useful but also safe and healthy for people.` | `It makes sure portable cabins are useful, and safe and healthy to occupy.` |
| `/portacabins-for-sale-in-frazer-town-2` | `This makes them not just useful but also energy-saving.` | `This makes them useful and energy-saving.` |
| `/portable-toilets-in-bangalore` | `are not just a convenience but a necessity for successful outcomes at outdoor events.` | `are a necessity at outdoor events, not merely a convenience.` |
| `/types-of-container-offices` | `Customization ensures container offices meet not just today's needs but tomorrow's challenges.` | `Customisation lets a container office meet today's requirement and adapt to the next one.` |
| `/world-of-customized-porta-cabin` | H1 `Explore the World of Customized Porta Cabin` | **HOLD.** This is an L3 H1 on a page whose slug also carries the phrase. Report the page's 90-day clicks, impressions and top ten queries before any change; Fable 5 rules separately. |
| `/porta-cabins-in-rt-nagar` | meta `...ideal for homes, offices, and storage with seamless delivery options.` | `...ideal for homes, offices and storage, with delivery across RT Nagar.` |
| `/container-rent-services/30x10-porta-cabin-rental` | `...within 24 hours, ensuring seamless project transitions.` | `...within 24 hours, so the project moves without a gap.` |
| `/container-rent-services/20x10-porta-cabin-rental` | `this 200 sq ft unit empowers small-scale operations.` | `this 200 sq ft unit suits small-scale operations.` |
| `/container-rent-services/20x10-porta-cabin-rental` | `...to create a fully equipped workspace tailored to your needs.` | `...to create a workspace fitted to how your team actually works.` |

---

## C · NEW DEFECT CLASS FOUND, NOT PART OF THIS SWEEP

Roughly 21 flagged rows are `imageAltText` on city and local pages, and they are not alt text at all. They are **AI image-generation prompts published as alt attributes**, for example `An overhead drone camera captures the scene, showcasing the seamless integration of the portable cabin within a sustainable, forward-thinking city` and `A state-of-the-art SAMAN Portable cabin manufacturing facility, bathed in warm, natural lighting that filters through large windows`.

These breach SOP section 12 on three counts: they describe a scene rather than what is visible, they describe things that are not in the frame, and they are plainly generated. Rewriting the phrase tells inside them would leave the real defect standing.

**Ruling: do not touch these alt attributes in the L20 sweep.** They are enumerated as their own event, `CITY-PAGE ALT REWRITE`, scoped after C-08 closes. The L20 report lists every affected URL and alt string so nothing is lost.

---

## D · WHAT THE L20 SWEEP DOES NEXT

Apply A1, A2, B2 table, B3 and the B4 replacement table. Dismiss B1 and the remaining B2 rows. Leave every protected string and every alt attribute untouched. Report before and after for each applied change, the emoji count removed with the review exceptions listed separately, and confirm the word-count gate holds on every changed route.
