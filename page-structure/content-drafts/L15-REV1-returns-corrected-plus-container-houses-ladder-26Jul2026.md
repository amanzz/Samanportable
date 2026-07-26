# L15 REV 1 — returns policy CORRECTED + Container Houses price ladder · Fable 5 · 26 Jul 2026
**Two SAMAN rulings, 26 Jul: (1) the live Refund & Return Policy page governs — Fable 5 read it in full and REVERSES its own earlier §7 ruling; (2) Container Houses = Container Offices rate + 15%. Supersedes §7 of the L15 Canonical Fact Sheet v1 and unblocks the container-houses cluster.**

## PART A — RETURNS: MY EARLIER RULING WAS WRONG, CORRECTED HERE
I previously ruled that everything is made-to-order and set `MerchantReturnNotPermitted`. **That was based on the external audit's summary, not the page itself.** Having read the live page (`/refund-and-return-policy`, last updated 7 Jun 2026), it is coherent, professional and there is **no contradiction to eliminate** — the audit misread a two-tier policy as a conflict. It governs as written.

### The operative policy (from the live page — this is now canonical)
| | Standard products | Custom / site-specific products |
|---|---|---|
| Non-defective return | **Yes — 7 days** from delivery or installation, product new, unused, undamaged, unmodified | **Not eligible** |
| Defect / damage / wrong product / spec-mismatch | Yes | **Yes — raise within 3 days** of delivery or installation; return, repair, replacement or correction subject to inspection |
- Condition accepted: **new only**. Restocking fee: **none as standard** (deductions if accessories, documents or condition are missing).
- Return method: written authorisation from SAMAN required first; never ship back unauthorised.
- Return logistics (transport, crane, loading, dismantling, RTO): **customer's responsibility**, except approved defect/damage/wrong-product/spec-mismatch cases within Bangalore and Delhi NCR service areas (Bangalore, Noida, Greater Noida, Delhi, Gurugram, Faridabad, Ghaziabad), where SAMAN may support or arrange it.
- Refund: within **7 days** of the returned product being received, inspected and approved; original payment method where possible, else bank transfer after verification. Bank/gateway time additional.
- Exchanges accepted where practical and approved (size, configuration, colour/finish, correction, defect replacement); any price or logistics difference payable before dispatch.
- Non-returnable: request after window · used/installed/modified/altered after delivery · custom product returned for non-defective reasons · returned without authorisation · missing accessories or documents · damage from improper handling, site conditions, unauthorised repair, misuse or natural events.

### Consequences (these override the fact sheet)
1. **"7-day full refund" product copy is NOT retired after all** — for **standard** products it is accurate, provided it states the conditions (new, unused, 7 days, return logistics customer-paid). Product copy must carry the qualified form, never a bare "7-day full refund".
2. **Merchant/schema:** standard SKUs → `MerchantReturnFiniteReturnWindow`, `merchantReturnDays: 7`, `returnMethod: ReturnByMail`, `returnFees: ReturnShippingFees` (customer-paid), `applicableCountry: IN`. Custom/made-to-order SKUs → `MerchantReturnNotPermitted` with the defect remedy stated in visible copy. This resolves the 116 feed warnings correctly rather than by understating the policy.
3. **The open "ready stock" question is CLOSED** — the policy itself establishes the standard-vs-custom split. Codex classifies each SKU as standard or custom from the Published Content Log during the propagation event; any SKU that cannot be classified with certainty → STOP to Fable 5.

### Warranty — the policy page CONFIRMS and EXTENDS the fact sheet
Page states: **5 years structural frame and base · 1–2 years finishing depending on product specification · 20–25 years engineered service life under proper use and maintenance (explicitly NOT a warranty period).** This matches SAMAN's ruling exactly. Canonical sentence updated to: `5-year structural warranty on frame and base, 1-year finishing warranty as standard (extendable to 2 years on request), and a 20–25 year engineered service life under proper use and maintenance — service life is not a warranty period.` The service-life qualifier must always travel with the claim.

### One contact-number discrepancy to resolve (SAMAN)
The policy page lists **Bangalore call +91 80886 85440** and **WhatsApp +91 88616 22859**, plus North call +91 87960 39938 / WhatsApp +91 97089 89937. The fact sheet's number set does not include 80886 85440. **Confirm whether 80886 85440 is a current line** — if yes it joins the canonical set as the Bangalore landline/call number; if no it is retired site-wide like 62009 09435.

## PART B — CONTAINER HOUSES LADDER (SAMAN ruling: Container Offices rate + 15%)
Derivation: product 42 (Container Offices, all rows "Approved — direct source") × 1.15, rate and ex-GST both; incl-GST = ex × 1.18. Verified: rate × area = ex-GST for all nine rows.

| Size (ft) | Area | Rate ₹/sq ft | ex-GST | incl-GST |
|---|---|---|---|---|
| 10×10×8.5 | 100 | ₹1,834 | ₹1,83,425 | ₹2,16,442 |
| 20×8×8.5 | 160 | ₹1,834 | ₹2,93,480 | ₹3,46,306 |
| 20×10×8.5 | 200 | ₹1,667 | ₹3,33,500 | ₹3,93,530 |
| 20×12×8.5 | 240 | ₹1,601 | ₹3,84,192 | ₹4,53,347 |
| 30×10×8.5 | 300 | ₹1,601 | ₹4,80,240 | ₹5,66,683 |
| 40×8×8.5 | 320 | ₹1,567 | ₹5,01,584 | ₹5,91,869 |
| 20×20×8.5 | 400 | ₹1,567 | ₹6,26,980 | ₹7,39,836 |
| 40×10×8.5 | 400 | ₹1,567 | ₹6,26,980 | ₹7,39,836 |
| 40×12×8.5 | 480 | ₹1,534 | ₹7,36,368 | ₹8,68,914 |
**AggregateOffer: low 183425 · high 736368 · offerCount 9.**

### Subpage inheritance — NEEDS SAMAN'S CONFIRMATION (one line)
This ladder is the **hub** (product 33, /product/container-houses). Applying the standing Controls-sheet rules (subpages inherit ±1–5%; premium angle +3%, economy angle −3%), the proposal is:
- **prefab-container-homes** (34) — hub ladder, no modifier *(site's #1 page, 4,916 clicks — L3 STRICT, touch least)*
- **shipping-container-homes** (36) — hub ladder, no modifier
- **luxury-container-houses** (35) — hub ladder **+3%**
- **affordable-container-homes** (37) — hub ladder **−3%**
**Confirm or correct these four, and the cluster is fully priced.** The existing page figures (₹30.5 lakh card, "starts at ₹12 lakh", 2,200–3,300 sq ft configurations) are multi-module *configured project* quotes, not per-unit ladder prices — they are retired from price positions and may only survive as clearly-labelled example project configurations if SAMAN confirms them as real.

### Still blocking the container-houses build
**Images.** There is no image set for this cluster anywhere in `all-product-images`. Nine sizes × the curated view set are required before any page can be built, exactly as every other cluster.

## PROPAGATION
Parts A and B fold into the single L15 propagation event. ONE-MASTER rows S64-33-SZ-01…09 move from "Pending" to "Approved — SAMAN ruling 26 Jul (Container Offices +15%)".
