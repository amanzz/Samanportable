# PC01 REL-06C-R Owner Final Blocker Decisions

Date: 2026-09-01
Recovered parent checkpoint: `0c07115b3a8c935471aab089a4b3e90400c88407`

## Calculator

- Decision ID: `PC01-CALCULATOR-BASE-PARITY-2026-08-31`
- Decision: `PC01_SELECTED_VARIANT_PRICE_EX_GST_IS_CALCULATOR_BASE`
- On `/product/porta-cabins`, the selected maintained variant's `priceExGst` is the calculator base.
- The default published configuration carries no paid option adjustment.
- Explicitly selected paid options retain their authorized adjustments.

## FAQ presentation

- Decision ID: `PC01-FAQ-PRESENTATION-2026-08-31`
- Decision: `STATIC_VISIBLE_FAQ_BLOCKS_APPROVED`
- Eight static, visible, server-rendered FAQ question-and-answer blocks are approved.
- No accordion and no FAQ interaction JavaScript are required or authorized.

## Enquiry dialog accessibility

- Decision ID: `PC01-ENQUIRY-DIALOG-A11Y-2026-08-31`
- Decision: `ADD_NONVISUAL_ACCESSIBLE_DIALOG_DESCRIPTION`
- Add a stable nonvisual accessible description without changing visible design or form behavior.

## Explicit boundaries

- The six published prices are unchanged.
- FAQ wording and FAQ schema wording are unchanged.
- No FAQ accordion or interaction code is authorized.
- The visible page design is unchanged.
- The enquiry form contract, endpoint, fields, validation, privacy text, and CTA wording are unchanged.
- Freight rules, free zones, optional option rates, installation rules, ODC rules, and GST at 18% are unchanged.
- Production deployment remains unauthorized.
