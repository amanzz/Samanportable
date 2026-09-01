# PC01 REL-06C-R FAQ Presentation Decision

Date: 2026-09-01
Decision ID: `PC01-FAQ-PRESENTATION-2026-08-31`
Decision: `STATIC_VISIBLE_FAQ_BLOCKS_APPROVED`

The recovered integrated checkpoint contains eight visible static question headings, eight visible answer paragraphs, and eight `FAQPage.mainEntity` entries. The visible questions and answers are the owner-approved source and remain crawlable in server HTML without a click.

Release validation for PC-01 must require:

- presentation mode `STATIC_VISIBLE_BLOCKS`;
- eight visible questions and eight visible answers;
- eight FAQPage entries;
- byte-identical visible/schema question and answer parity;
- semantic heading/question structure;
- all answers present in server HTML;
- exactly one FAQPage;
- no rental or filler FAQ;
- no Review or AggregateRating.

It must not require `ACCORDION`, buttons, disclosure icons, hidden answers, animation, or FAQ interaction JavaScript. The approved static presentation preserves crawlability, matches the approved source, avoids unnecessary JavaScript, is not a visual regression, and does not change schema facts or wording.
