// Single source of truth for the homepage FAQ.
// Both the visible <FAQSection /> and the FAQPage JSON-LD schema are built from
// this array, so the structured data can never drift from what users actually see
// (a Google FAQ-policy requirement).

export interface HomepageFaq {
  question: string;
  answer: string;
}

export const homepageFaqs: HomepageFaq[] = [
  {
    question: 'How do I get an exact price?',
    answer:
      'Every product page on this site carries its full ex-factory price ladder by size. For your configuration, send the requirement through any enquiry form and we issue a written, itemised quotation — line items, GST and freight to your pin code included.',
  },
  {
    question: 'Where does SAMAN manufacture?',
    answer:
      'At our own units in Bangalore (serving South India) and Greater Noida (serving Delhi NCR and the North). SAMAN POS India Private Limited is ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018 certified, NSIC-enlisted and DPIIT-recognised.',
  },
  {
    question: 'How fast is delivery?',
    answer:
      'Factory-built units are typically delivered across India in 7–21 working days, dispatched complete from the nearer unit and positioned on your prepared base.',
  },
  {
    question: 'Do you install what you deliver?',
    answer:
      'Yes — units arrive factory-finished and our team positions them at your site. Site preparation requirements are confirmed with the quotation.',
  },
  {
    question: 'Is SAMAN a manufacturer or a trader?',
    answer:
      'A manufacturer. Every unit is fabricated in-house at our own factories — you deal directly with the maker, from drawing to delivery.',
  },
];
