# Cabin cost calculator review report

Preview route: `/cabin-cost-calculator`

SEO is set to `Cabin Cost Calculator │ Instant Price Estimate │ SAMAN`, H1 `Cabin Cost Calculator`, with the requested meta description and self-canonical. The route reuses the existing calculator engine and product JSON ladders; no homepage or wp-export files were changed.

## Formula verification

The approved area-band formula was checked against the v9 authority snapshot: 38 ladders, 342 published rows, 0 mismatches. The shared module is `src/lib/calculatorRates.ts`; it also exposes `V9_FORMULA_VERIFICATION` for automated checks. The 20 ft freight ladder contains all 18 bands from 100–150 km (₹27,500) through 950–1000 km (₹112,500), with 40 ft +₹5,000 and Bangalore city / Delhi NCR free delivery.

Spot checks: 20×10 Porta Cabin = ₹2,50,000 ex-GST; 12×11 = 132 sq ft and uses the +10% band. GST is shown separately by the existing estimate engine.

## Labour-colony source comparison

Values are read from the live C-06 variant datasets and are not duplicated in the page:

| Dataset | Published ex-GST ladder (six configurations) |
| --- | --- |
| labour-colony | 1,944,000; 2,916,000; 4,374,000; 3,888,000; 4,779,000; 5,832,000 |
| labour-sheds | 1,969,920; 2,954,880; 4,432,320; 3,939,840; 4,842,720; 5,909,760 |
| labour-hutments | 1,982,880; 2,974,320; 4,461,480; 3,965,760; 4,874,580; 5,948,640 |
| prefab-labor-camps | 1,956,960; 2,935,440; 4,403,160; 3,913,920; 4,810,860; 5,870,880 |

## Container-house preview ladders

The five preview ladders are computed from the existing container-office datasets, rounded to the nearest rupee, ex-GST. They remain preview prices pending SAMAN approval.

| Product | 9-size ladder |
| --- | --- |
| container-houses | 183,400; 293,440; 333,400; 384,240; 480,300; 501,440; 626,800; 626,800; 736,320 |
| prefab-container-homes | 158,100; 252,960; 287,600; 331,200; 414,000; 432,320; 540,400; 540,400; 634,560 |
| shipping-container-homes | 227,700; 364,320; 414,000; 476,880; 596,100; 622,720; 778,400; 778,400; 913,920 |
| affordable-container-homes | 158,100; 252,960; 287,600; 331,200; 414,000; 432,320; 540,400; 540,400; 634,560 |
| luxury-container-houses | 237,600; 380,160; 432,000; 497,760; 622,200; 649,600; 812,000; 812,000; 953,760 |

## UX and sharing

The form keeps one Full name field, requires email and mobile, splits first and last names for `/api/enquiry`, serializes the complete configuration in the message, persists guarded localStorage state, and restores compact `design` query links. Save, copy-link, WhatsApp, PDF and quote-submit analytics use the existing dataLayer helper. The four hub links are injected at render time with unique anchors: `estimate your cabin cost live`, `build a live price estimate`, `price your configuration online`, and `size and price a colony building`.

The existing print endpoint remains the PDF path; visual screenshot, axe-core, tap-target and CLS measurements should be completed in the review environment before merge.
