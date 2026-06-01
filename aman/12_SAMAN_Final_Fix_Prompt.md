# SAMAN — FINAL FIX PROMPT (one document, all phases)
*Give the entire boxed prompt to your coding agent. All values are owner-confirmed. The agent edits files in the order listed. Schema code for every page is embedded — agent does not need to invent any schema.*

---

## OWNER-CONFIRMED CANONICAL VALUES (used everywhere — no exceptions)
| Fact | Value |
|---|---|
| Brand name (displayed) | `Saman Portable` |
| Legal name (copyright, schema legalName) | `SAMAN POS India Private Limited` |
| Founded | `2009` |
| Incorporated (Pvt Ltd) | `2019-03-07` |
| Experience claim | `15+ Years Experience` / `Serving India since 2009` |
| Projects | `500+` (NOT 5,000+ — site currently has both) |
| **Structural warranty** | **`5 years`** (NOT 25 — site currently says 25) |
| **Standard/fittings warranty** | **`1 year (default); up to 2 years on request; never more than 2`** |
| Returns / refund | `Within 7 days of delivery or installation` |
| Hours (both units) | `Mon–Sat 9:00 AM – 8:00 PM; Sunday closed` |
| Phones — Bangalore | `+91 80886 85440` (call), `+91 88616 22859` (WhatsApp) |
| Phones — Delhi NCR | `+91 87960 39938` (call), `+91 97089 89937` (WhatsApp) |

> **Critical:** the structural warranty is FIVE years, not 25. Every "25-Year Warranty" badge, label, schema FAQ answer, and trust strip on the site is currently wrong and must come down to 5 years. This is a legal exposure fix, not just SEO.

---

# AGENT PROMPT (copy box, paste to coding agent)

```
You are in CODE MODE for the SAMAN Portable codebase (samanportable.com). Make controlled
edits in the order listed. Rules:
- Do ONLY what is listed. No refactoring, no styling changes.
- One commit per numbered task with a clear message.
- After each task: list files changed, show before/after snippet, then WAIT for confirmation.
- If you find a wrong-value string in a file not listed below, STOP and report — do not guess.
- Search the ENTIRE codebase for each old value before declaring a task done.
- Do NOT change visual design. Only text content and JSON-LD.

CANONICAL VALUES — use exactly:
- Brand: "Saman Portable"
- Legal: "SAMAN POS India Private Limited"
- Founded: 2009
- Incorporated: 2019-03-07
- Experience: "15+ Years Experience" / "Serving India since 2009"
- Projects: "500+"
- Structural warranty: "5-Year Structural Warranty"
- Standard warranty (fittings): "1-Year Standard Warranty (extendable to 2 years on request)"
- Returns: "Returns accepted within 7 days of delivery or installation"
- Hours: "Mon–Sat 9:00 AM – 8:00 PM; Sunday closed"
- Bangalore: +91 80886 85440 (call), +91 88616 22859 (WhatsApp)
- Delhi NCR: +91 87960 39938 (call), +91 97089 89937 (WhatsApp)

============================================================
PHASE 1 — CONTENT FIXES (do this before any schema)
============================================================

TASK 1 — Warranty correction (HIGHEST PRIORITY — legal risk)
Replace every "25-Year" / "25 Years" structural warranty with "5-Year Structural Warranty".
Add the standard warranty line where appropriate.

Files (search and update; report any additional files found):
- src/components/TrustBar.tsx          : "25-Year Warranty" → "5-Year Structural Warranty"
- src/components/HeroSection.tsx       : 25-Year badge → "5-Year Structural Warranty"
- src/components/WhyChooseUs.tsx       : title + description → "5-Year Structural Warranty;
                                          1-Year Standard Warranty (extendable to 2 years)"
- src/components/SpecsTable.tsx        : "25 Years" → "5 Years"
- src/lib/schema.ts                    : FAQ schema warranty answers — REWRITE to:
   "Our structural warranty is 5 years on the steel frame and structure. Fittings and
    third-party items such as ACs, electricals and accessories carry a 1-year standard
    warranty, extendable to 2 years on request."
- src/components/ProductTabs.tsx       : "2-year structural warranty" → "5-Year Structural
                                          Warranty; 1-year on fittings (extendable to 2)"
- src/pages/checkout.tsx               : "5-year warranty on all our portable office solutions"
                                          → "5-Year Structural Warranty + 1-Year Standard
                                          Warranty (extendable to 2 years on request)"
- src/pages/refund-and-return-policy.tsx : REWRITE the entire warranty section to:
   "Saman Portable provides a 5-year structural warranty on the steel frame and welded
    structure of every unit we manufacture. Fittings and third-party items including
    air-conditioning, electrical fittings, plumbing fixtures and accessories carry a
    1-year standard warranty by default, which can be extended to 2 years on customer
    request at order confirmation. We do not warrant fittings beyond 2 years.
    Returns and refunds are accepted within 7 days of delivery or installation,
    subject to the conditions in our Refund Policy."
  Show the full new text in your commit message so owner can review before merge.

Verify: grep for "25-Year", "25 Years", "25-year", "5-year warranty" (lowercase, the wrong
checkout phrase). All hits must be either the new canonical wording or reported.

------------------------------------------------------------

TASK 2 — Founding year and experience claim
Replace every founding/experience inconsistency.

Files:
- src/pages/about-us.tsx            : "Since 2016" → "Since 2009"; keep "Founded in 2009";
                                       "15+ years" stays ✅
- src/components/TrustBar.tsx        : "Since 2017" → "Since 2009";
                                       "8+ Years Experience" → "15+ Years Experience"
- src/components/HeroSection.tsx     : "since 2017" → "since 2009"
- src/components/WhyChooseUs.tsx     : "since 2017" → "since 2009"
- src/lib/schema.ts                  : foundingDate "2017" → "2009"
- src/pages/index.tsx                : every "Since 2017" / "2017" referring to founding
                                        → "Since 2009"
- src/pages/prefab-solutions.tsx     : "10+ years experience" → "15+ years experience"

Verify: grep for "Since 2017", "Since 2016", "8+ Years", "10+ Years", foundingDate "2017".
Zero hits should remain.

------------------------------------------------------------

TASK 3 — Projects stat (500+, not 5,000+)
Files:
- src/components/StatsSection.tsx     : keep "500+" ✅
- src/pages/about-us.tsx               : "5,000+" → "500+" at lines 25, 85, 170, 257
                                          (and any other occurrence)

Verify: grep for "5,000" and "5000" — zero hits should remain in stats contexts.

------------------------------------------------------------

TASK 4 — About page intro rewrite
src/pages/about-us.tsx — "Our Story" para 1, replace with:
"Founded in 2009 and incorporated as SAMAN POS India Private Limited in 2019, Saman
Portable has delivered portable cabins, container offices and prefab structures across
India for over 15 years. We manufacture from our own facilities in Bengaluru and
Greater Noida and serve clients in 15+ states."

------------------------------------------------------------

TASK 5 — Footer legal name (shared component)
Locate the footer (likely src/components/Footer.tsx).
- Copyright line: "SAMAN Portable Office Solutions" → "SAMAN POS India Private Limited"
- Bangalore "Get Directions" Maps query: "SAMAN Portable Office Solutions Private Limited"
  → "SAMAN POS India Private Limited" (Greater Noida link already correct — match it)

Search any other footer/header occurrence of "SAMAN Portable Office Solutions" used as
a LEGAL name and replace. Keep "Saman Portable" wherever the BRAND is meant.

------------------------------------------------------------

TASK 6 — Default meta (shared head/_app/_document or next-seo config)
- meta-author       → "SAMAN POS India Private Limited"
- meta-publisher    → "SAMAN POS India Private Limited"
- og:site_name      → "Saman Portable" (brand, NOT legal)

------------------------------------------------------------

TASK 7 — Business hours
Every place hours are stated (page content, schema openingHours, footer if present):
- Visible text: "Mon–Sat 9:00 AM – 8:00 PM; Sunday closed"
- Schema openingHoursSpecification: dayOfWeek Monday–Saturday, opens "09:00", closes "20:00"
  (omit Sunday → schema treats as closed)

Update src/lib/schema.ts openingHours field accordingly.

------------------------------------------------------------

TASK 8 — Contact page FAQ
src/pages/contact (locate FAQ):
- "Standard delivery times range from 2-4 weeks" → "Standard delivery is 7–21 days from
  confirmed order, with on-site setup typically completed within 24–48 hours."
- "We primarily serve Bangalore and surrounding areas in Karnataka" → "We serve Bangalore
  and Delhi NCR, with project delivery across 15+ states in India."
- Quote-form product dropdown: "Marketing Office" → "Portable Office"

------------------------------------------------------------

TASK 9 — "ISI" certification check (REPORT ONLY, do not edit)
Grep for "ISI" across the codebase. List every occurrence with file + surrounding line.
STOP — owner will confirm whether ISI/BIS licence is genuinely held before any change.

============================================================
PHASE 2 — SCHEMA REWRITE (after Phase 1 confirmed)
============================================================

TASK 10 — Rewrite src/lib/schema.ts Organization + LocalBusiness blocks
Replace the existing Organization/LocalBusiness output with the JSON below. Maintain the
same export/injection mechanism currently used — do not change how schema is consumed,
only what it contains.

Organization (homepage only — keep existing injection on home page):
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.samanportable.com/#organization",
  "name": "Saman Portable",
  "legalName": "SAMAN POS India Private Limited",
  "url": "https://www.samanportable.com",
  "logo": { "@type": "ImageObject", "url": "https://www.samanportable.com/saman-logo.svg" },
  "foundingDate": "2009",
  "description": "Manufacturer of portable cabins, container offices and prefab structures, serving India since 2009. Incorporated as SAMAN POS India Private Limited in 2019.",
  "sameAs": [
    "https://www.facebook.com/p/SAMAN-Portable-Office-Solutions-is-leading-manufacturer-of-Porta-Cabins-100067811252556/",
    "https://x.com/Saman_Portable",
    "https://www.instagram.com/pos_containerhomes/",
    "https://in.pinterest.com/samanportablecabins/"
  ],
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+918088685440", "contactType": "sales", "areaServed": "IN", "availableLanguage": ["en","hi"] },
    { "@type": "ContactPoint", "telephone": "+918796039938", "contactType": "sales", "areaServed": "IN", "availableLanguage": ["en","hi"] }
  ]
}

WebSite (homepage):
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.samanportable.com/#website",
  "url": "https://www.samanportable.com",
  "name": "Saman Portable",
  "publisher": { "@id": "https://www.samanportable.com/#organization" }
}

LocalBusiness ×2 (on /contact page only):
{
  "@type": "LocalBusiness",
  "@id": "https://www.samanportable.com/#bangalore",
  "name": "Saman Portable — Bengaluru Unit",
  "parentOrganization": { "@id": "https://www.samanportable.com/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "I, Sy No 34/2, near Indian Oil petrol pump, Gopasandra",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "postalCode": "560099",
    "addressCountry": "IN"
  },
  "telephone": "+918088685440",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "09:00", "closes": "20:00"
  }]
}
{
  "@type": "LocalBusiness",
  "@id": "https://www.samanportable.com/#greaternoida",
  "name": "Saman Portable — Greater Noida Unit",
  "parentOrganization": { "@id": "https://www.samanportable.com/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri",
    "addressLocality": "Greater Noida",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "201308",
    "addressCountry": "IN"
  },
  "telephone": "+918796039938",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "09:00", "closes": "20:00"
  }]
}

CRITICAL: ensure exactly ONE Organization is emitted across the whole site. If any other
file/layout also emits Organization JSON-LD, remove the duplicate.

------------------------------------------------------------

TASK 11 — AboutPage schema on /about-us
Inject this JSON-LD on /about-us only:
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://www.samanportable.com/about-us#webpage",
  "url": "https://www.samanportable.com/about-us",
  "name": "About Saman Portable",
  "about": { "@id": "https://www.samanportable.com/#organization" },
  "isPartOf": { "@id": "https://www.samanportable.com/#website" }
}

------------------------------------------------------------

TASK 12 — 8 rental pages Product + LeaseOut Offer schema
For each of these 8 pages, inject the corresponding JSON-LD block. The owner will paste
the 8 ready blocks in a follow-up file (file 04 from prior delivery). Each block contains:
- Product name, description, image
- Offer with businessFunction "http://purl.org/goodrelations/v1#LeaseOut"
- UnitPriceSpecification with minPrice/maxPrice in INR per MON
- additionalProperty: structural warranty "5 years", fittings warranty "1 year (extendable to 2)"
- seller/brand → references #organization
URLs:
/container-rent-services/40x10-porta-cabin-rental
/container-rent-services/30x10-porta-cabin-rental
/container-rent-services/20x10-porta-cabin-rental
/container-rent-services/10x10-porta-cabin-rental
/container-rent-services/40x8-container-office-rental
/container-rent-services/30x8-container-office-rental
/container-rent-services/20x8-container-office-rental
/container-rent-services/10x8-container-office-rental

------------------------------------------------------------

TASK 13 — Category pages schema (14 product categories)
The owner is providing 14 ready JSON-LD blocks (one per product category URL below).
For each URL, inject the corresponding block on that page:
/product-category/porta-cabins
/product-category/portable-cabin
/product-category/portable-office
/product-category/container-offices
/product-category/container-cafe
/product-category/container-houses
/product-category/labor-colony
/product-category/security-cabins
/product-category/portable-toilet
/product-category/industrial-sheds
/product-category/peb-constructions
/product-category/pre-engineered-buildings
/product-category/prefab-buildings
/product-category/prefabricated-houses

Each block contains CollectionPage + ItemList + BreadcrumbList + FAQPage and references
the homepage Organization by @id. Inject as-is; do not modify the content.

Note: some category JSON-LD blocks reference URLs ending with /products/ in the breadcrumb
(plural). Verify which is canonical on this site (/product or /products) and unify to one
across all 14 blocks before injection. Report which form the site actually uses.

------------------------------------------------------------

TASK 14 — Meta titles & descriptions (all pages)
Update meta title and description per the table below. Use the existing meta mechanism;
do not change how meta is injected.

| Page | Meta title (≤60) | Meta description (≤155) |
| / | Portable Cabin & Container Office Manufacturer | India | SAMAN Portable manufactures portable cabins, container offices & prefab structures across India. Serving since 2009. ISO 9001 certified. From ₹1.45 Lakh. |
| /about-us | About SAMAN Portable | Cabin Manufacturer Since 2009 | SAMAN POS India Pvt Ltd has delivered portable cabins & container offices across India since 2009. ISO 9001, ZED & NSIC certified. Trusted by 500+ clients. |
| /contact | Contact SAMAN Portable | Bangalore & Delhi NCR | Contact SAMAN Portable for portable cabins & container offices. Factories in Bengaluru & Greater Noida. Call or WhatsApp for a free quote within 24 hours. |
| /product | Portable Cabins & Container Offices for Sale | SAMAN | Browse portable cabins, container offices & prefab structures. Factory-direct prices from ₹1.35 Lakh. ISO-certified, delivered & installed across India. |
| /gallery | Project Gallery | Portable Cabins & Container Offices | See real installations of portable cabins, container offices & labour colonies delivered by SAMAN Portable across India. Browse the project gallery. |
| /blog | Portable Cabin & Container Office Guides | SAMAN Blog | Expert guides on portable cabin prices, container office design, sizes and buying tips — written by SAMAN Portable's technical team for Indian buyers. |
| /rental-services | Porta Cabin & Container Office Rental | SAMAN Portable | Rent porta cabins & container offices in Bangalore, Delhi NCR & 15+ cities. Monthly rentals from ₹8,000. Delivery, installation & pickup included. Get a quote. |

Rental page meta (8 pages) — owner has a separate ready table; agent will be supplied
with it as a follow-up.

============================================================
PHASE 3 — BLOG REDIRECTS (owner has a separate ready CSV — 581 immediate 301s)
============================================================

TASK 15 — Implement 301 redirects from the owner's blog classification file
Owner is supplying a CSV with 581 source URLs and target URLs.
- Add to next.config.js redirects[] as permanent (statusCode 308 or `permanent: true`).
- Confirm each TARGET returns 200 before bulk apply.
- After deployment, remove redirected URLs from sitemap.xml.

============================================================
FINAL VALIDATION (after all tasks)
============================================================
- Grep the codebase for any remaining: "25-Year", "5,000+", "Since 2017", "8+ Years",
  "10+ Years", "SAMAN Portable Office Solutions" (as legal context), "2-4 weeks".
  Zero hits in the listed contexts.
- Validate every page type in Google Rich Results Test: homepage Organization (one only,
  foundingDate 2009, legalName correct), AboutPage, LocalBusiness ×2, Product+LeaseOut
  on rental pages, CollectionPage+ItemList+FAQPage on category pages.
- Report any extra schema duplication discovered during the run.

OUTPUT FORMAT after every task: "Task N complete. Files: [list]. Diff: [snippets].
Anything to report: [if anything]." Then wait for owner confirmation before next task.
```

---

# CATEGORY SCHEMAS — DEPLOYMENT NOTES

The 14 category schema blocks you uploaded are well-structured and content-accurate. Two notes before deployment:

**1. Breadcrumb URL inconsistency to unify.** Some of your category blocks reference `/products/` (plural) in the breadcrumb position 2, others reference `/product/` (singular). Pick ONE based on what your site actually uses, and unify all 14 blocks. Your live site uses `/product` (singular, no trailing slash) — so all 14 breadcrumbs should be:
```
{ "@type": "ListItem", "position": 2, "name": "Products", "item": "https://www.samanportable.com/product" }
```

**2. Strip `<script type="application/ld+json">` wrappers.** Some uploaded blocks include the HTML wrapper tags, others are pure JSON. For Next.js injection (via `dangerouslySetInnerHTML` or `Script` component), agent needs the raw JSON only — strip the `<script>` tags before paste.

**3. All 14 blocks already correctly reference `#organization` and `#website`** — these will automatically resolve once Task 10 lands the Organization/WebSite blocks on the homepage. Good architecture.

**4. The category schemas are SAFE to deploy AS-IS** — none of them contain founding-year, warranty, or stats values that conflict with your confirmed canonical facts. They reference products, prices, and counts only.

---

# EXECUTION ORDER (do not skip)

1. **Tasks 1–9 first (Content Fixes).** This is where the legal risk lives — the 25-year warranty must come down to 5 before any schema is regenerated, because schema.ts FAQ currently emits the wrong warranty into search results.
2. **Tasks 10–12 (Schema rewrite).** Organization, AboutPage, rental LeaseOut.
3. **Task 13 (14 category schemas).** Deploy after the 14 blocks have been breadcrumb-unified.
4. **Task 14 (Meta).** Per-page title and description.
5. **Task 15 (Blog 301s).** Bulk redirect from your classification CSV.

**Estimated agent runtime:** Phase 1 about 1–2 hours of agent work + your review. Phase 2 another 1–2 hours. Total review and merge time on your side: half a day if everything goes clean.

---

# WHY THIS ORDER MATTERS (your benefit, each task)

- **Task 1 (warranty)** removes legal exposure. Right now you publicly promise 25 years while your refund policy says 1–5. A customer dispute under Consumer Protection Act would side with the larger marketing claim and you'd be liable for 25 years of structural failure. Fixing to 5/1-2 aligns marketing with what you actually contract.
- **Tasks 2–4 (years/projects)** end the three-conflicting-stories problem. Google, AI engines, and IndiaMART all cross-check. One consistent story = trust score recovery.
- **Task 5–6 (legal name + meta)** lets Google connect "Saman Portable" the brand with "SAMAN POS India Private Limited" the entity. Right now they read as two different companies.
- **Task 10 (Organization schema)** fixes the foundingDate from 2017 to 2009 in your structured data — Google reads schema as authoritative, so this is what makes the 15+ years claim believable to it.
- **Task 13 (14 category schemas)** gives every category page proper structured data — Google can now show FAQ rich snippets, breadcrumb trails, and product counts directly in search results. This is pure visibility gain.
- **Task 15 (blog 301s)** removes 581 thin pages dragging down site-wide quality (Helpful Content). This is the single biggest ranking lift available to you.

The whole package, run in this order, takes your site from "self-contradicting and legally exposed" to "consistent, structured, indexable, and defensible." Everything you build after — backlinks, new content, AI presence — sits on this foundation.

---

# WHAT YOU STILL OWE THE AGENT (small, but blocking)

1. **ISI confirmation** — agent will list every occurrence in Task 9 and stop. Tell agent: "ISI is genuinely held with certificate number X" OR "ISI is not held, remove all references."
2. **Category breadcrumb URL form** — confirm `/product` (singular). Agent unifies all 14 blocks before injection.
3. **Rental pages JSON-LD** — agent will need the 8 LeaseOut blocks from file 04 (already delivered earlier). Re-share that file with the agent.
4. **Blog 301 CSV** — share the 581-row IMMEDIATE Redirects sheet from your classification file as a CSV.

Once these four small items are answered, the agent runs uninterrupted.
