/**
 * Approved calculator copy.
 *
 * Every string here is transcribed verbatim from
 * page-structure/content-drafts/CALCULATOR-COPY-PACK-03Aug2026.md and is
 * implemented under L4. Nothing in this file may be edited, shortened,
 * re-cased or "improved" without a new copy pack: the strings are checked
 * character for character against the draft on rendered DOM under L23 by
 * scripts/calculator/verify-copy-pack.mjs.
 *
 * No emoji. Icons are inline SVG, never glyphs in text.
 */

/** Step headings and their one-line help, in render order. */
export const STEP_COPY = [
  { key: 'product', heading: 'Choose your product', help: 'Pick the building closest to what you need. You can change it at any point.' },
  { key: 'size', heading: 'Set the size', help: 'Area and price update as you type. Sizes we publish use our listed price; any other size is estimated from the same rate.' },
  { key: 'interior', heading: 'Choose the interior', help: 'Standard finishes are included. Upgrades and savings are shown per square foot.' },
  { key: 'openings', heading: 'Add doors and windows', help: 'Set the type, the count and where each one sits. The plan updates as you choose.' },
  { key: 'electrical', heading: 'Add electrical fittings', help: 'Tick what you need. Quantities are suggested from the floor area and you can change every one.' },
  { key: 'addons', heading: 'Add furniture and fittings', help: 'Everything here is optional. Add only what you want fitted before delivery.' },
  { key: 'delivery', heading: 'Delivery and taxes', help: 'Transport and installation are optional and depend on your site. GST is shown as its own line.' },
  { key: 'quotation', heading: 'Get your quotation', help: 'Send us this configuration and we will confirm it with a fixed price within 48 hours.' },
] as const;

export type StepKey = typeof STEP_COPY[number]['key'];

/**
 * Replaces the structure step. Only one construction is approved, so this is a
 * stated standard rather than a choice — a step that offers one option is not
 * a step.
 */
export const CONSTRUCTION_DISCLOSURE = {
  heading: 'How your cabin is built',
  body: 'Every cabin is newly fabricated on an MS structural frame with insulated wall and roof panels. It is not a converted used shipping container. Frame sections, panel thickness and cladding are confirmed on the drawing at quotation.',
} as const;

export const TIPS = {
  doorOpening: 'If the entrance sits under a shed or a covered walkway, choose opens in, so rain does not blow through the doorway. On an open site choose opens out, because the door seals tighter against wind. Hinge left and hinge right set which side the handle falls on.',
  windowTrack: 'A 2.5 track slides more smoothly and costs more than a 2 track. The difference scales with the size of the window.',
  socketPlacement: 'Placement moves a socket, it does not add one. The charge is the plug point count above, and moving a socket costs nothing.',
  customSize: 'Sizes we publish carry our listed price. Any other size is estimated from the same rate and confirmed on the drawing.',
} as const;

export const CONTROLS = {
  back: 'Back',
  startOver: 'Start over',
  next: 'Next',
  getQuotation: 'Get my quotation',
  downloadPdf: 'Download PDF',
  sendWhatsApp: 'Send on WhatsApp',
  copyLink: 'Copy link',
  theme: 'Theme',
  saveDesign: 'Save design',
  restoreDesign: 'Restore design',
} as const;

export const FIELD_LABELS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  companyName: 'Company Name',
  phone: 'Mobile Number',
  email: 'Email Address',
  city: 'City',
  state: 'State',
  notes: 'Notes',
} as const;

/** First Name, Last Name, Mobile Number and Email Address are required. */
export const REQUIRED_FIELDS: ReadonlyArray<keyof typeof FIELD_LABELS> = ['firstName', 'lastName', 'phone', 'email'];

export const ESTIMATE_PANEL = {
  heading: 'Live estimate',
  floorArea: 'Floor area',
  baseCabin: 'Base cabin',
  subtotal: 'Subtotal',
  gst: 'GST at 18%',
  total: 'Estimated total',
  finePrint: 'Indicative estimate from our published price list, ex-factory and ex-GST. Your fixed price is confirmed on the drawing within 48 hours.',
} as const;

/** Shown wherever a route has no approved ladder. Carries no number. */
export const QUOTE_MODE = 'We price this product on drawing. Send your requirement and we will confirm a fixed price within 48 hours.';

/** The closed bar the calculator renders as on a product page. */
export const CLOSED_STATE = {
  label: 'Estimate your cabin cost',
  subLine: 'Set the size and finishes and see a price as you go.',
  control: 'Open the calculator',
} as const;

/**
 * The product step lists hub products only, capped at five by ruling.
 * Subpages never appear here; the embedded calculator on a subpage locks to
 * that subpage and prices from its own ladder.
 */
export const PRODUCT_STEP = [
  { id: 'porta-cabin', name: 'Porta Cabin', description: 'Our standard modular cabin, nine published sizes.' },
  { id: 'portable-cabin', name: 'Portable Cabin', description: 'General-purpose portable unit for site and storage use.' },
  { id: 'office-cabin', name: 'Portable Office', description: 'Fitted workspace with electrical and interior finishes.' },
  { id: 'container-office', name: 'Container Office', description: 'Container-form office in insulated panel construction.' },
  { id: 'container-houses', name: 'Container House', description: 'Container-form living unit, six published sizes.' },
] as const;

export const PAGE_TITLE = 'Cabin Cost Calculator | Instant Price Estimate | SAMAN Portable';
