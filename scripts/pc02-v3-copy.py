# -*- coding: utf-8 -*-
"""Draft v3 Section 3 copy (revision ticket v1.2, Section A) + checksum gate."""
import hashlib
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

V = [
    dict(
        slug='10x10', shape='A',
        h2="10x10 ft GI Porta Cabin: Compact Cabin for Exposed Gates",
        p1="The 100 sq.ft module suits gate duty, weighbridge support and single-supervisor offices at exposed locations. One door and two sealed windows keep the envelope simple, and in salt air that matters: fewer openings mean fewer joints to maintain.",
        p2="Corner posts use the 50x50x2 mm SHS reference with reinforced openings. It travels as one module on a 20 ft trailer and sits on six level support points. Planning price Rs 1,58,125 ex-GST (Rs 1,86,588 with GST), quotation-confirmed.",
        bullets=[],
    ),
    dict(
        slug='20x8', shape='B',
        h2="20x8 ft GI Porta Cabin for Narrow Plots and Tight Lanes",
        p1="At 160 sq.ft with an 8 ft width, this size fits plot edges, jetty approaches and lanes where a 10 ft module cannot swing. The long wall carries the windows, so you can turn the openings away from prevailing sea spray. That single orientation choice decides how much salt reaches the glazing line and the window perimeter seals each season. Exterior cladding stays 0.8 to 1.2 mm BMT corrugated zinc-coated sheet on every face, so the narrow depth costs you nothing in protection.",
        p2=None,
        bullets=[
            "Interior suits a two-desk office or a store-plus-office split",
            "Windows can be replaced by corrosion-resistant louvers for washdown areas",
            "Wall insulation runs 50 to 75 mm mineral wool, or 50 mm PUF or PIR infill",
            "Moves on a 20 ft trailer; confirm lane width before dispatch",
            "Planning price Rs 2,42,000 ex-GST (Rs 2,85,560 with GST), quotation-confirmed",
        ],
    ),
    dict(
        slug='20x10', shape='A',
        h2="20x10 ft GI Porta Cabin: the 200 sq.ft Reference Build",
        p1="This is the reference configuration the GI rate of Rs 1,375 per sq.ft is set on. It gives 200 sq.ft with one door, sealed aluminium windows and room for a four-person office or a partitioned cabin-plus-store.",
        p2="Price this size first when you compare GI against MS or PUF quotations, because every other size is derived from it by the published area bands. Floors use 18 to 24 mm cement-bonded board. Planning price Rs 2,75,000 ex-GST (Rs 3,24,500 with GST), quotation-confirmed.",
        bullets=[],
    ),
    dict(
        slug='20x12', shape='B',
        h2="20x12 ft GI Porta Cabin: Wider Bay for Meetings and Labs",
        p1="The extra 2 ft of width over the 20x10 turns a corridor office into a room that takes a meeting table or a sample-testing bench with circulation space left over. Marine and process sites usually pick it as a combined engineer office and document room, where humidity control matters as much as floor area. The wider bay also lets you keep desks off the external wall, which reduces the condensation risk against cold cladding in monsoon and coastal service.",
        p2=None,
        bullets=[
            "Wider roof span carried by galvanized roof framing with positive drainage",
            "Ceiling stays moisture-tolerant metal liner or fibre-cement, not MDF",
            "Roof insulation 75 to 100 mm mineral wool, or a 60 to 80 mm insulated panel",
            "AC provision with condensate routed clear of the chassis and cladding",
            "Planning price Rs 3,16,800 ex-GST (Rs 3,73,824 with GST), quotation-confirmed",
        ],
    ),
    dict(
        slug='40x8', shape='A',
        h2="40x8 ft GI Porta Cabin: Long Linear Site Office Row",
        p1="Unique to the GI ladder, this 320 sq.ft module runs 40 ft along a boundary wall or jetty edge while staying 8 ft deep for transport. The linear plan suits a row of cubicles, a control-desk line, or office-plus-store-plus-lobby zoning.",
        p2="One long shell also halves the external joints of two smaller cabins, which is the maintenance argument for this size. It moves on a 40 ft trailer, so confirm approach-road clearance. Planning price Rs 4,18,000 ex-GST (Rs 4,93,240 with GST), quotation-confirmed.",
        bullets=[],
    ),
    dict(
        slug='40x10', shape='B',
        h2="40x10 ft GI Porta Cabin: Largest Single-Module Office",
        p1="The 400 sq.ft flagship carries open-plan seating for eight to ten staff, or a partitioned manager-plus-team layout, in one transportable module. Roof and floor framing are sized for the 40 ft span with galvanized secondary members throughout, so the shell stays square through repeated lifts. At this length the roof drainage detail matters most: framing keeps a positive fall across the full 40 ft, because standing water defeats any zinc coating given enough seasons.",
        p2=None,
        bullets=[
            "Wiring schedule starts at 1.5, 2.5 and 4 sq.mm copper, final sizing by load",
            "Distribution board with MCB and RCCB protection and segregated circuits",
            "Engineered lifting points; crane and rigging arranged by the buyer unless quoted",
            "Freight follows the published 40 ft open-trailer ladder by distance band",
            "Planning price Rs 5,22,500 ex-GST (Rs 6,16,550 with GST), quotation-confirmed",
        ],
    ),
]

EXPECT = {
    'V1_H2': '251e2a4fb24b54d1', 'V1_P1': 'b41deb4596643c2b', 'V1_P2': 'b4bb47f06ec4759b',
    'V2_H2': 'abeee6c17dea08d8', 'V2_P1': '445a8f99dc12c8d5',
    'V2_BULLET1': 'c0f50c651f594fac', 'V2_BULLET2': '11898402dcfe0ebe',
    'V2_BULLET3': 'c7cb424d8b1740d5', 'V2_BULLET4': 'f1c51c79c9f81009',
    'V2_BULLET5': '130a77f14c223afe',
    'V3_H2': '97e0d8c2cba67bad', 'V3_P1': 'ee2a2a6d2f153245', 'V3_P2': '6fad66b29825271f',
    'V4_H2': '03434317ea23309c', 'V4_P1': '1593d308f5d2d823',
    'V4_BULLET1': 'e5834b8507a3351b', 'V4_BULLET2': 'ce2fb00b40dfed64',
    'V4_BULLET3': '5e192c5ab63f7451', 'V4_BULLET4': '39d1009ccd34b0ee',
    'V4_BULLET5': '324bcd9e2e83afcd',
    'V5_H2': 'e059acb75b4be8e7', 'V5_P1': 'e2357dfc4e92d1a5', 'V5_P2': 'cf0169116420839a',
    'V6_H2': '6d9dfc955b58a03a', 'V6_P1': '7e5f82a1c58fed24',
    'V6_BULLET1': '85318432663bb61d', 'V6_BULLET2': '0d42fdd628fc9aeb',
    'V6_BULLET3': '646a44e3db6af6bc', 'V6_BULLET4': 'ccf0d980fc735d4a',
    'V6_BULLET5': '5f12110c45bfeae9',
}


def sha16(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()[:16]


if __name__ == '__main__':
    got = {}
    for i, v in enumerate(V, 1):
        got['V%d_H2' % i] = v['h2']
        got['V%d_P1' % i] = v['p1']
        if v['p2']:
            got['V%d_P2' % i] = v['p2']
        for j, b in enumerate(v['bullets'], 1):
            got['V%d_BULLET%d' % (i, j)] = b

    missing = set(EXPECT) - set(got)
    extra = set(got) - set(EXPECT)
    bad = []
    for k in sorted(EXPECT):
        if k not in got:
            continue
        h = sha16(got[k])
        ok = h == EXPECT[k]
        if not ok:
            bad.append((k, h, EXPECT[k]))
        print('%-4s %-12s %s' % ('PASS' if ok else 'FAIL', k, h))

    print('\nfields %d/%d  mismatched %d  missing %s  extra %s'
          % (len(got), len(EXPECT), len(bad), sorted(missing) or 'none', sorted(extra) or 'none'))

    print('\nprose char counts (H2 and bullets excluded):')
    for i, v in enumerate(V, 1):
        prose = v['p1'] + (' ' + v['p2'] if v['p2'] else '')
        n = len(v['p1']) + (len(v['p2']) if v['p2'] else 0)
        flag = 'OK ' if 400 <= n <= 500 else 'OUT'
        print('  V%d shape %s  %d chars  %s  bullets %d' % (i, v['shape'], n, flag, len(v['bullets'])))

    em = sum((v['p1'] + (v['p2'] or '') + ''.join(v['bullets']) + v['h2']).count('—') for v in V)
    print('\nem dashes: %d' % em)

    json.dump(V, io.open(os.path.join(HERE, 'pc02-v3-variants.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    sys.exit(1 if (bad or missing or extra) else 0)
