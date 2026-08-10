/**
 * L4-locked copy for the Engine A estimate document.
 *
 * Authority:
 * - OPUS5-RULINGS-PDF-COPY-AND-ENGINE-PASTE-THIS-09Aug2026.md
 * - OPUS 5 ruling, FOUR D-LINES APPROVED + THE NO-PREFILL LABEL, 10 Aug 2026
 *
 * Keep every sentence byte-exact. Mechanical gates character-count the
 * validity lines and the no-prefill disclosure.
 */

export const ESTIMATE_VALIDITY = {
  lineA: 'This is an estimate generated from the size and options you selected. It is not a fixed-price quotation.',
  lineB: 'The base cabin figure is for the cabin itself. Fittings and add-ons are listed separately above.',
  lineC: 'Final pricing depends on specification, customisation and site conditions, and is confirmed in a written fixed-price quotation within 48 hours of enquiry.',
  lineD1: 'Figures are ex-factory and do not include transport or installation.',
  lineD2: 'Figures are ex-factory. Transport and installation are shown as separate lines above.',
  lineD3: 'Figures are ex-factory. Transport is shown as a separate line above; installation is not included.',
  lineD4: 'Figures are ex-factory. Installation is shown as a separate line above; transport is not included.',
} as const;

export const GENERAL_ESTIMATE_DISCLOSURE =
  'This is a general cabin estimate. It does not price the product on this page.';

export const CANONICAL_CABIN_WARRANTY =
  '5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation.';

export const ESTIMATE_DELIVERY_AND_TURNAROUND =
  'Delivery in 7 to 21 working days and fixed quotation within 48 hours.';

export const ESTIMATE_CONTACTS = [
  { unit: 'Bengaluru (South)', phone: '+91 88616 22859', email: 'sales@samanportable.com' },
  { unit: 'Bengaluru (South)', phone: '+91 80886 85440', email: 'sales@samanportable.com' },
  { unit: 'Greater Noida (North)', phone: '+91 87960 39938', email: 'ncr@samanportable.com' },
  { unit: 'Greater Noida (North)', phone: '+91 97089 89937', email: 'ncr@samanportable.com' },
] as const;
