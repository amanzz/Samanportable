# L15 — CANONICAL COMMERCIAL FACT SHEET v1 · Fable 5 · 26 Jul 2026
**SAMAN's ruling 26 Jul: the homepage and About Us pages are correct and govern the whole site. This sheet extracts that fact set, adds SAMAN's answers on hours and warranty, and rules the returns contradiction. From now on EVERY page, policy page, schema block, feed field and external profile states these facts and no others. Any contradiction found anywhere is a defect of the same severity as a wrong price (L15).**

## 1. COMPANY IDENTITY
- Legal name: **SAMAN POS India Private Limited** · brand: **SAMAN Portable**
- **Founded 2009; incorporated as SAMAN POS India Private Limited in 2019.** Always state both together in this form — never "founded 2016", "since 2017", or incorporation year alone.
- Experience claim: **"over 15 years"** (2009 base). Acceptable and understated; do not inflate.
- External profiles to correct to match (SAMAN, in progress): LinkedIn (currently 2016), IndiaMART (currently 2017), and any directory listing with a different founding year or address.

## 2. MANUFACTURING & COVERAGE
- Own facilities: **Bengaluru** (South India) and **Greater Noida** (Delhi NCR / North India). Manufacturer, not reseller — every unit fabricated in-house.
- Coverage: delivered across India; **clients in 15+ states**.

## 3. CERTIFICATIONS & REGISTRATIONS (verbatim, verifiable — reuse exactly)
- ISO 9001:2015 Quality Management System — Royal Assessments Pvt. Ltd.
- ISO 14001:2015 Environmental Management System — Royal Assessments Pvt. Ltd., Reg. E20250218646, valid until 12 Feb 2028
- ISO 45001:2018 Occupational Health & Safety Management System — Royal Assessments Pvt. Ltd.
- NSIC Government Purchase Enlistment (Single Point Registration, OEM supplier) — Reg. NSIC/GP/BAN/2024/0055207, valid until 23 Mar 2027
- Udyam / MSME Registration — Reg. UDYAM-KR-03-0172770
- ZED Bronze (Zero Defect Zero Effect) · DPIIT Startup India recognised · GST registered
Certificate PDFs are linked from the credentials section; that section is to be reused on every product hub (queued ticket).

## 4. CONTACT & HOURS — CORRECTED (SAMAN, 26 Jul)
- **Business hours: Monday–Saturday, 9:00–20:00 IST. Sunday closed.**
- **"24/7 support" is RETIRED site-wide.** The About page line "Customer Support — 24/7 support and maintenance services for all our products" is replaced with: `Customer Support — Support and maintenance handled by our own service team, Monday to Saturday, 9:00–20:00.`
- Numbers: pan-India +91 97089 89937 · South +91 88616 22859 / sales@samanportable.com · North +91 87960 39938 / ncr@samanportable.com. The retired number **+91 62009 09435 must appear nowhere** on the site, in schema, feeds, GBP or directories.
- Schema: `OpeningHoursSpecification` Mo–Sa 09:00–20:00 on Organization and both LocalBusiness entities. No 24/7 anywhere.

## 5. DELIVERY
- **7–21 working days** for factory-built units, dispatched complete from the nearer facility and positioned on the customer's prepared base. Installation by SAMAN's own crew is included.
- Freight: quoted to pin code at confirmation; free delivery within Bangalore city and the listed Delhi NCR zones per the freight ladder.
- Quotation turnaround: **fixed-price quote in 48 hours.**

## 6. WARRANTY MATRIX — SAMAN's ruling 26 Jul (replaces every prior warranty statement)
| Element | Standard (default, stated everywhere) | On customer request |
|---|---|---|
| Structural | **5 years** | — |
| Finishing / workmanship | **1 year** | **2 years** |
Canonical sentence, use verbatim: `5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation.`
- The container cluster's "12-month workmanship warranty" is the SAME fact expressed in months — align the wording to the canonical sentence at next touch of those pages.
- Retire: "5–10 years confirmed at quotation", any "5-year warranty" stated alone without the finishing term, and any page implying 1 year is the only warranty.

## 7. RETURNS & CANCELLATION — FABLE 5 RULING (contradiction eliminated)
**Canonical policy — the defect-and-warranty remedy governs. The "7-day full refund" product copy is RETIRED site-wide.**
Reason: units are fabricated to an approved drawing; a blanket refund window is neither operationally true nor credible to a buyer, and Merchant structured data must mirror the operative policy. The old policy page's own conflict ("3-day custom window" *and* "custom non-refundable") is resolved below.
- **Made-to-order units (the standard case):** not returnable once fabrication has begun. Defects are remedied by repair or replacement under the warranty above.
- **Transit damage:** report within **48 hours of delivery** with photographs; SAMAN repairs or replaces the affected unit.
- **Manufacturing defect:** report within **7 days of delivery**; SAMAN repairs or replaces. This is a defect remedy, not a refund window.
- **Cancellation:** free of charge any time **before fabrication begins**; after fabrication begins, per the terms stated in the accepted quotation.
- Schema: `MerchantReturnPolicy` → `returnPolicyCategory: MerchantReturnNotPermitted` for made-to-order items, with the warranty and defect remedy stated in visible copy on the policy page. Applies to the 116 feed items currently carrying return-policy warnings.
- **ONE OPEN QUESTION FOR SAMAN:** are any products sold as ready **stock** units (the "readymade" range) that a customer genuinely *could* return unused? If yes, those SKUs get a real finite return window and a separate schema declaration; if no, the above governs everything.

## 8. SCALE CLAIMS (About page figures, now canonical — use these exact numbers or none)
**500+ projects completed · 3,000+ happy customers · 200+ team members · 15+ states served.** No other figures may appear anywhere. Do not round up, do not invent per-page variants.

## 9. PRICE FLOOR & PRICE CLAIMS
- Any "starting from" claim must **name the product and size** and match that page's approved ONE-MASTER ladder exactly. Generic floors like "from ₹1.45 lakh" are banned unless they name the exact SKU they refer to.
- Lowest approved cabin entry today: **₹1,37,500 ex-GST (10×10 ft, 100 sq ft)** — Porta Cabins and Container Office Cabin. Panels and sheets are priced per unit area on their own pages and are not comparable to cabin ladder pricing.
- All displayed prices are ex-factory, ex-GST primary with incl-GST muted, GST 18%; fit-out and freight quoted separately.

## 10. PROPAGATION EVENT (Codex, one event, no partial application)
Sweep and align: every product/blog/local page · About Us (hours line, §4) · Contact page · refund/returns policy page (rewrite to §7) · warranty statements everywhere (§6) · Organization + LocalBusiness + MerchantReturnPolicy schema · Merchant and LIA feed fields · then SAMAN updates GBP and directory profiles to match.
Acceptance: zero occurrences site-wide of `+91 62009 09435`, `24/7`, `7-day full refund`, `5–10 years`, or any scale figure other than §8 · warranty sentence byte-identical wherever it appears · MerchantReturnPolicy matches §7 · hours match §4 in copy and schema · no page states a price floor without naming its SKU.
