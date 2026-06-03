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
    question: 'How much does a portable cabin cost in India?',
    answer:
      'Prices start at ₹1,45,000 for a 10×10 ft security cabin. Standard site offices (10×20 ft) from ₹2,55,000. Large container offices (40×10 ft) range ₹3,35,000–₹5,00,000. Per sq ft cost: ₹900–₹2,500 depending on spec and fittings. We provide a fixed-price quote within 48 hours — no hidden charges.',
  },
  {
    question: 'What is the difference between a portable cabin and a prefab structure?',
    answer:
      'A portable cabin is fully assembled at the factory and delivered ready to use — relocatable at any time. "Prefab structure" is a broader term covering portable cabins, container offices, and modular buildings. All Saman Portable products are prefabricated — built in our factory, not on your site.',
  },
  {
    question: 'What materials are used in Saman Portable structures?',
    answer:
      'Quality-tested MS steel frame (1.2–2.0 mm thickness), 50mm PUF-insulated sandwich panels with 0.50mm PPGI cladding, galvanised steel roofing, and 18mm cement particle board flooring. EPS, Rockwool and Glasswool insulation options available on request.',
  },
  {
    question: 'What sizes are available? Can I get a custom size?',
    answer:
      'Standard sizes: 10×10 ft, 10×14 ft, 10×20 ft, 20×10 ft, 30×10 ft, 40×10 ft, 40×12 ft. Custom sizes available at no extra charge — we design to your site requirements. Custom orders of 1–5 units delivered within the standard 21-day timeline.',
  },
  {
    question: 'How long does delivery and installation take?',
    answer:
      'Standard orders are delivered and fully installed within 7–21 days anywhere in India. This includes manufacturing, transport and on-site installation by our own crew. No crane or civil team required on your end — we handle everything.',
  },
  {
    question: 'Can portable cabins withstand Indian weather conditions?',
    answer:
      '50mm PUF insulation reduces interior temperature by 8–12°C. Galvanised steel roof handles up to 3,000mm annual rainfall. Wind-load certified to 200 km/hr. Successfully installed across Kerala (heavy rain), Rajasthan (extreme heat), coastal Karnataka (humidity) and high-altitude sites.',
  },
  {
    question: 'Do you offer portable cabins on rent?',
    answer:
      'Yes. Monthly rental starts from ₹8,000. Available in Bangalore, Delhi NCR, Hyderabad, Chennai, Pune and Mumbai. Delivery, installation and removal are all included in the rental price. Short-term (1–6 months) and long-term (6+ months) contracts available.',
  },
  {
    question: 'What is included inside a standard portable cabin?',
    answer:
      'Electrical wiring, switch boards, LED lighting, fan points and ventilation. Flooring is pre-installed (cement particle board or vinyl). Optional additions: AC points, attached toilet, furniture, partition walls, exterior branding. Everything is fitted at our factory before delivery.',
  },
  {
    question: 'Can I customise the size, interior and exterior?',
    answer:
      'Yes. Size, layout, electrical configuration, number of rooms, attached toilets, exterior colour and company branding are all customisable. We provide a layout drawing for approval before manufacturing begins. No extra charge for custom dimensions on orders of 1–5 units.',
  },
  {
    question: 'Do you deliver and install across all of India?',
    answer:
      'Yes. We manufacture in Bengaluru (Karnataka) and Greater Noida (UP), and deliver to 15+ states: Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Maharashtra, Goa, Gujarat, Rajasthan, Delhi NCR, UP, Haryana, Punjab, West Bengal, Odisha and more.',
  },
  {
    question: 'How do I get a quote? How quickly will you respond?',
    answer:
      'Three ways: (1) Fill the quote form on this website — response within 24 hours. (2) Call +91 88616 22859 (Bangalore) or +91 8796039938 (Delhi NCR). (3) WhatsApp us — typically under 2 hours on weekdays. You receive a fixed-price quote with layout drawing within 48 hours.',
  },
];
