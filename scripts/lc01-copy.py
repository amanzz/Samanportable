# -*- coding: utf-8 -*-
"""LC-01 approved copy, transcribed verbatim from the build prompt (Section 4) and
the draft file (Description/Specifications tabs, Section 3 variant bodies). No
SHA-256 was supplied in this ticket, unlike LC-00/PC-10, so verification here is
against the acceptance-criteria character counts in ticket Section 9 instead.
"""
import io
import json
import os
import re

DRAFT = (r'D:/Project-shekhar/all-product-images/Hub Page (Labour Colony)/'
         r'Drafts/LC-01-labor-hutments-draft-v1.md')
HERE = os.path.dirname(os.path.abspath(__file__))

draft_raw = io.open(DRAFT, encoding='utf-8', newline='').read()

fields = {}

fields['H1'] = 'Labour Hutments: Single-Room Units from 10x10 Feet'
fields['SEO_TITLE'] = 'Labour Hutments Price List, 6 Sizes and Layouts | SAMAN'
fields['META_DESCRIPTION'] = ('Labour hutments in six sizes from 10x10 to 20x20 ft, sleeping 4 to 16 '
                               'workers. Compare prices, wall options and room layouts, then request a site quote.')

fields['HERO_SHORT_DESCRIPTION'] = (
    'A labour hutment is one small sleeping unit, built complete in the factory and set down on its own plinth. '
    'SAMAN makes it in six sizes, from 10x10 ft for four workers to 20x20 ft for sixteen, so a site can add beds '
    'in the quantity it actually needs instead of committing to a full colony block. The frame is welded and '
    'bolted mild steel to IS 2062 or approved equivalent. Walls are a choice of profiled GI sheet or 30 to 40 mm '
    'insulated PUF panel. Every unit carries one 900 mm class door, two opposing sliding windows for cross '
    'ventilation, fan and light points and a labelled distribution board. Bunks, lockers, sanitation and the '
    'civil base are quoted separately, so the published price is the shell you receive.'
)

fields['HERO_TABLE'] = [
    ('Sizes', '10x10 ft to 20x20 ft, 100 to 400 sq ft'),
    ('Sleeps', '4 to 16 workers, one figure per size'),
    ('Price', 'Rs 87,975 to Rs 2,90,700 ex-GST'),
    ('Wall options', 'Profiled GI sheet, or 30 to 40 mm insulated PUF panel'),
    ('Delivery', '7 to 21 working days from confirmed order'),
]

fields['SECTION2_H2'] = 'Why a Single Hutment Beats a Block When the Crew Is Small'

fields['SECTION2_P1'] = (
    'A colony block is the right answer when a site houses a hundred workers for two years. It is the wrong '
    'answer when a contractor needs sixteen beds next month on a plot corner that will be built over later. '
    'The hutment exists for that second case. Each unit is complete on its own, so beds arrive in the number '
    'the programme needs, and the order can be repeated when the workforce grows.'
)

fields['SECTION2_P2'] = (
    'That also changes what happens at the end. A hutment sits on plinth pads rather than a poured raft, and '
    'the prefab floor option is built to be lifted and set down again, so a unit can follow the work to the '
    'next site. If the requirement is instead a full settlement with roads, sanitation and dining, plan the '
    'whole colony rather than ordering units one at a time. Send us your crew size, site location and start '
    'date and we will price the exact combination you need: request a hutment quotation.'
)

fields['SECTION2_CARD_H3'] = 'Which Hutment Size Fits Your Site Crew?'

fields['SECTION2_CARD_PARAGRAPH'] = (
    'Size follows the bed plan, not the other way round. Count the workers who must sleep on site at peak, '
    'allow for a clear central aisle and locker space, then pick the smallest unit that holds them comfortably.'
)

fields['SECTION2_CARD_BULLET_1'] = 'Four to five workers, take the 10x10 or 12x10'
fields['SECTION2_CARD_BULLET_2'] = 'Seven to ten workers, take the 12x15 or 12x20'
fields['SECTION2_CARD_BULLET_3'] = 'Twelve to sixteen workers, take the 15x20 or 20x20'
fields['SECTION2_CARD_BULLET_4'] = 'Mixed gangs or shift work, order two smaller units'

VARIANT_SLUGS = ['10x10', '12x10', '12x15', '12x20', '15x20', '20x20']
VARIANT_H2 = {
    '10x10': '10x10 ft Hutment: Four Beds on the Smallest Footprint',
    '12x10': '12x10 ft Hutment: Five Beds for a Gang or Guard Post',
    '12x15': '12x15 ft Hutment: Seven Beds and a Usable Central Aisle',
    '12x20': '12x20 ft Hutment: Ten Beds in One Long Narrow Room',
    '15x20': '15x20 ft Hutment: Twelve Beds and Wider Circulation',
    '20x20': '20x20 ft Hutment: Sixteen Beds in One Square Module',
}
VARIANT_BODY = {
    '10x10': (
        'At 100 sq ft this is the smallest unit SAMAN builds for sleeping, and it holds four workers in two '
        'bunks with a clear aisle between them. It suits a watchman pair, a small commissioning team or the '
        'first crew on a site that has no infrastructure yet. Because the footprint is barely larger than a '
        'parking bay, it fits into leftover corners of a plot without disturbing material stacking or crane '
        'access, and one trailer carries it whole.'
    ),
    '12x10': (
        'At 120 sq ft the extra two feet of length give room for a fifth bed or, more usefully, for lockers '
        'and a small changing space at the door end. Contractors commonly use this size where a gang of five '
        'works a single shift, and where a supervisor needs to be housed close to the gate rather than in the '
        'main accommodation area. It carries the same single door and opposing window pair as the smallest '
        'unit, so ventilation behaves identically.'
    ),
    '12x15': (
        'At 180 sq ft the aisle finally becomes properly usable, and seven beds fit without anyone climbing '
        'over a neighbour to reach the door. This is the first size where the two-room option makes sense, '
        'splitting the module so a supervisor or a couple can be housed separately behind their own door. Site '
        'planners often treat this as the default when the workforce is settled rather than mobilising, '
        'because the comfort gain over 120 sq ft is disproportionate.'
    ),
    '12x20': (
        'At 240 sq ft the room runs twenty feet back from the door, and ten beds line the two long walls with '
        'the aisle down the centre. The long narrow shape is deliberate: it keeps the unit within a standard '
        'trailer envelope while adding capacity, and it puts every bed within reach of the cross draught '
        'between the two end windows. Where a site is short of frontage but has depth, this is usually the '
        'most efficient unit on the ladder.'
    ),
    '15x20': (
        'At 300 sq ft the width grows to fifteen feet, which widens the aisle rather than adding another bed '
        'row. Twelve workers sleep here with genuine circulation space, room for lockers along one wall and '
        'clearance to move a stretcher or a large kit bag through without disturbing the beds. Sites running '
        'two shifts favour this size, because people are moving in and out at all hours and a tight aisle '
        'becomes a nightly argument.'
    ),
    '20x20': (
        'At 400 sq ft this is the largest single hutment, holding sixteen workers in one square room roughly '
        'the footprint of a double garage. It is the point at which a buyer should genuinely compare a hutment '
        'against an open shed, because the room is now large enough that partitioning starts to matter. Choose '
        'it when the whole gang must be housed together and the site has the frontage and the crane access to '
        'place a single large module.'
    ),
}
for slug in VARIANT_SLUGS:
    fields['VARIANT_%s_H2' % slug] = VARIANT_H2[slug]
    fields['VARIANT_%s_BODY' % slug] = VARIANT_BODY[slug]

# ── Description tab: extracted from the draft file, "### Tab 1, Description"
# section, up to "### Tab 2, Specifications". Keep markdown as-is; converted to
# HTML by a separate script, same convention as LC-00.
m = re.search(r'### Tab 1, Description\n\n(.*?)\n\n---\n\n### Tab 2, Specifications', draft_raw, re.S)
fields['DESCRIPTION_TAB'] = m.group(1).strip()

# ── Specifications: narrative + two tables, extracted verbatim from the draft.
m = re.search(r'#### Table 1, structure, envelope, roof and floor\n\n(.*?)\n\n#### Table 2', draft_raw, re.S)
fields['SPEC_TABLE_1_MD'] = m.group(1).strip()
m = re.search(r'#### Table 2, interior, insulation, openings, services and scope\n\n(.*?)\n\n\*\*Diagrams', draft_raw, re.S)
fields['SPEC_TABLE_2_MD'] = m.group(1).strip()
m = re.search(r'\*\*Narrative for this tab\.\*\* (.*?)\n\n---', draft_raw, re.S)
fields['SPEC_NARRATIVE'] = m.group(1).strip()


def verify():
    TARGETS = {
        'H1': 50,
        'SEO_TITLE': 55,
        'META_DESCRIPTION': 152,
        'HERO_SHORT_DESCRIPTION': 715,
        'SECTION2_H2': 57,
        'SECTION2_CARD_H3': 39,
        'SECTION2_CARD_PARAGRAPH': 208,
        'VARIANT_10x10_H2': 53, 'VARIANT_10x10_BODY': 437,
        'VARIANT_12x10_H2': 52, 'VARIANT_12x10_BODY': 439,
        'VARIANT_12x15_H2': 55, 'VARIANT_12x15_BODY': 454,
        'VARIANT_12x20_H2': 50, 'VARIANT_12x20_BODY': 429,
        'VARIANT_15x20_H2': 51, 'VARIANT_15x20_BODY': 423,
        'VARIANT_20x20_H2': 51, 'VARIANT_20x20_BODY': 433,
    }
    rows = []
    bad = []
    for name, want in TARGETS.items():
        got = len(fields[name])
        ok = got == want
        rows.append((name, ok, got, want))
        if not ok:
            bad.append(name)
    s2body = len(fields['SECTION2_P1']) + len(fields['SECTION2_P2'])
    rows.append(('SECTION2_BODY(P1+P2)', s2body == 882, s2body, 882))
    if s2body != 882:
        bad.append('SECTION2_BODY(P1+P2)')
    print('%-28s %-5s %-6s %-6s' % ('FIELD', 'OK', 'GOT', 'WANT'))
    for name, ok, got, want in rows:
        print('%-28s %-5s %-6d %-6d' % (name, 'PASS' if ok else 'FAIL', got, want))
    em = sum(v.count('\u2014') for v in fields.values() if isinstance(v, str))
    print('\nU+2014 in approved copy: %d' % em)
    print('%d checks; %d FAILED %s' % (len(rows), len(bad), bad or ''))
    return not bad and em == 0


if __name__ == '__main__':
    ok = verify()
    json.dump(fields, io.open(os.path.join(HERE, 'lc01-copy.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    import sys
    sys.exit(0 if ok else 1)
