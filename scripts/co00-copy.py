# -*- coding: utf-8 -*-
"""CO-00 copy transcription + character-count verification against the
ticket's own stated counts (no SHA-256 supplied this time)."""
import json

COPY = {
"SEO_TITLE": "Container Office Sizes, Build, Rates and Fit-Out | SAMAN",
"META_DESCRIPTION": "Compare SAMAN container office sizes from 10x10 to 40x10 ft, with steel specifications, published rates, inclusions and site notes before you ask for a quote.",
"H1": "Container Offices Built, Fitted and Delivered in India",
"HERO_SHORT_DESCRIPTION": "A container office is a steel office module built on a welded MS frame, insulated, wired and finished before it leaves our works. SAMAN builds them for construction, industrial, logistics and commercial sites across India. This page is the selection page for the range. It publishes the standard six-configuration ladder, the structural members behind each module, and the boundary between this standard office and our specialist container products. Use it to fix your footprint, your opening schedule and your service load before you ask for a price. Where a converted freight shell, a site-duty build or a value-line cabin suits you better, the comparison below says so plainly rather than selling you the nearest option.",
"SECTION2_H2": "Why start on this page instead of one container office model",
"SECTION2_P1": "Most buyers arrive knowing they want a steel office module and not knowing which one. The decision rarely turns on price. It turns on whether your shell must be a converted freight container, how often the unit will be relocated, how many people work inside it, and what your electrical load looks like once the drawings are frozen. Fix those four answers and the size follows almost by itself.",
"SECTION2_P2": "This hub covers the standard fabricated container office at six footprints. If your structural shell must be a genuine ISO freight container, with the corner castings and cargo-door end that come with it, the shipping container office is the right build and a different specification. Tell us the site, the occupancy and the electrical load you expect, and we will size the module with you and put the exclusions in writing.",
"SECTION2_CTA": "Send us your site details and get a project quote",
"V1_H2": "10x10 ft Container Office for One Desk and a Visitor",
"V1_BODY": "At 100 sq.ft. this is the smallest module we build as a working office. One desk, one visitor chair and a storage unit fit comfortably; a second workstation does not. Site engineers and security supervisors take this size most often, because it lifts onto a small plinth and needs no crane road closure. The near-square footprint means the door and the window compete for the same wall, so agree the opening schedule early. Rate carries the below-200 sq.ft. premium.",
"V1_BULLETS": "100 sq.ft. floor area\nRs 1,66,750 ex-GST\nOne workstation, one visitor\nFits a compact plinth or bearer pair",
"V2_H2": "20x8 ft Container Office for Narrow Site Boundaries",
"V2_BODY": "The 20x8 module suits sites where the boundary, not the budget, sets the limit. At 160 sq.ft. it takes two desks along one wall with a clear walking line beside them. Because it matches the footprint of a standard 20 ft freight container, it moves on ordinary trailers and drops into compounds that will not take a wide-body unit. The narrower span also keeps the floor frame stiff under filing loads.",
"V2_BULLETS": "160 sq.ft. floor area\nRs 2,55,200 ex-GST\nTwo desks in line\nStandard 20 ft transport envelope",
"V3_H2": "20x10 ft Container Office, the Size Most Orders Start From",
"V3_BODY": "This is the reference configuration for the whole range, and the size our published rate is calculated from. Two hundred square feet gives you three workstations, or two plus a small meeting table, without the room feeling like a corridor. The extra two feet of width over the 20x8 changes how desks face each other, which matters more in daily use than the area figure suggests. Every specification on this page is drawn against this module.",
"V3_BULLETS": "200 sq.ft. floor area\nRs 2,90,000 ex-GST\nThree workstations or two plus meeting\nReference size for all published rates",
"V4_H2": "30x10 ft Container Office That Splits Into Two Rooms",
"V4_BODY": "Three hundred square feet is the first size where a partition earns its place. A manager's cabin at one end and an open bay at the other is the layout we build most often here. The partition changes the electrical drawing as well as the plan, because each room needs its own lighting circuit and switch position. Confirm the partition line before fabrication starts; moving it afterwards means opening the ceiling.",
"V4_BULLETS": "300 sq.ft. floor area\nRs 4,17,600 ex-GST\nSupports one internal partition\nSeparate lighting circuit per room",
"V5_H2": "40x8 ft Container Office for Long, Narrow Compounds",
"V5_BODY": "The 40x8 gives you 320 sq.ft. in the narrowest band we build at full length. It suits a line of desks against one wall, which is why contractors use it as a document and drawing office. The narrow span limits how you can partition it, so treat it as one long room rather than two. It travels on the same trailer as a 40 ft container and needs the matching turning circle on site, which is the constraint that catches most buyers out on a tight compound.",
"V5_BULLETS": "320 sq.ft. floor area\nRs 4,40,800 ex-GST\nOne long room, limited partitioning\n40 ft transport envelope",
"V6_H2": "40x10 ft Container Office for a Complete Project Team",
"V6_BODY": "Four hundred square feet is the largest single module in this range, and the point where most projects stop adding units and start planning one building. It holds an open workstation bay and a partitioned manager's cabin comfortably. Above this size we would usually place two modules end to end or move you to a multi-storey build, because a single longer unit becomes difficult to lift and to transport safely.",
"V6_BULLETS": "400 sq.ft. floor area\nRs 5,51,000 ex-GST\nOpen bay plus partitioned cabin\nLargest single module in this range",
}

CHAR_COUNTS = {
"SEO_TITLE": 56, "META_DESCRIPTION": 158, "H1": 54, "HERO_SHORT_DESCRIPTION": 723,
"SECTION2_H2": 60,
"V1_H2": 52, "V1_BODY": 466, "V2_H2": 51, "V2_BODY": 401, "V3_H2": 58, "V3_BODY": 442,
"V4_H2": 52, "V4_BODY": 414, "V5_H2": 51, "V5_BODY": 453, "V6_H2": 53, "V6_BODY": 412,
}
# Section 2 body = P1+P2, ticket states 819 chars across exactly two paragraphs.
# No standalone char count is given for SECTION2_CTA in the ticket itself.

if __name__ == "__main__":
    ok = True
    for k, target in CHAR_COUNTS.items():
        v = COPY[k]
        status = "PASS" if len(v) == target else "FAIL"
        if len(v) != target:
            ok = False
        print("%-24s %-4s chars=%d/%d" % (k, status, len(v), target))
    s2_total = len(COPY["SECTION2_P1"]) + len(COPY["SECTION2_P2"])
    status = "PASS" if s2_total == 819 else "FAIL"
    if s2_total != 819:
        ok = False
    print("%-24s %-4s chars=%d/%d (P1=%d P2=%d)" % ("SECTION2_BODY", status, s2_total, 819, len(COPY["SECTION2_P1"]), len(COPY["SECTION2_P2"])))
    for i in range(1, 7):
        bullets = COPY["V%d_BULLETS" % i].split("\n")
        print("V%d bullets: %d items" % (i, len(bullets)))
    print()
    print("ALL PASS" if ok else "SOME FAILED (report, do not silently fix)")
    json.dump(COPY, open("scripts/co00-copy.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
