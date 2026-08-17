# -*- coding: utf-8 -*-
"""LC-03 copy pack transcription + SHA-256 verification against the pack's own hash index."""
import hashlib
import json

COPY = {
"H1": "Oil Field Camp: Relocatable Crew Modules on Steel Skids",
"SEO_TITLE": "Oil Field Camp Modules: 6 Sizes, Beds and Prices | SAMAN",
"META_DESCRIPTION": "Skid-mounted oil field camp modules built for repeated lift-and-shift moves. Six sizes from 200 to 800 sq ft, 4 to 16 beds, with transparent per-size rates.",
"S1_SHORT_DESCRIPTION": "An oil field camp module houses a drilling or well-site crew on a location that will not stay put. SAMAN builds it as one welded unit on a steel skid chassis, so it can be lifted on, worked out of, and lifted off again when the location moves. Six sizes run from a 200 sq ft four-bed sleeper to an 800 sq ft sixteen-bed wide-body block. Walls and roof carry nominal 60 mm insulated panel against remote-site heat, and the electrical fit-out is normal-area, with any Ex requirement priced only against your own hazardous-area classification. Published rates are shell rates. Bunk beds, toilet fit-out and the split AC unit are quoted separately, so you can see exactly what the base module includes.",
"S2_H2": "Why a Camp That Moves Is Built Differently From One That Stays",
"S2_P1": "Buyers reach this page from two directions. Some need worker housing for a project that will run in one place for years, which is a settlement question rather than a module question. Others need four to sixteen people fed, rested and back on shift beside a rig that will be released in a few months. This page is written for the second buyer. A camp that stays can be bolted together on a prepared pad; a camp that moves has to survive every lift, every move and every reinstatement.",
"S2_P2": "That difference drives almost every choice here: the runner-beam skid, the welded superstructure, the reduced glazing, the service entries that disconnect without cutting. If your crew is not going anywhere, a fixed block from our prefab labour camps range will serve you better and cost less. If it is, send us the location, the crew size and the moves you expect and we will quote the right module.",
"S2_CARD_H3": "Shell Price or Fitted Price: What Changes",
"S2_CARD_P1": "Two prices appear against every size. The shell rate covers the module itself: structure, skid, envelope, insulation, lining, floor finish, doors, windows, lighting, sockets and earthing.",
"S2_CARD_P2": "The fitted rate adds what crews always ask about: bunk beds, the toilet fit-out and the split AC unit itself. The shell carries AC provision, meaning the bracket, the point and the wall penetration, not the machine.",
"S2_CARD_CTA": "Ask for a fitted-scope quotation",
"V1_H2": "20x10 ft Oil Field Camp: 4-Bed Crew Sleeper Module",
"V1_BODY": "The smallest module in the range, and the one most often used as a two-man-per-shift sleeper beside a single rig. Four beds sit as two bunk frames along one wall, leaving a clear aisle and one desk position for shift paperwork. At 200 sq ft it is light enough for a single-point lift on most locations and small enough to place inside a tight pad layout without redrawing access. Choose it when the crew count is fixed and low, and when you expect the module to move more often than the others.",
"V2_H2": "30x10 ft Camp Module: 6 Beds With an Internal Toilet",
"V2_BODY": "Adding ten feet of length turns the sleeper into a self-contained unit. Six beds sit as three bunk frames, and an internal toilet compartment at one end removes the daily walk to a shared block. That matters most on locations where the ablution block sits across an access road, or where night movement is restricted. The module still lifts as one piece and still fits a standard trailer bed. It is the usual first step up when a location runs two shifts rather than one.",
"V3_H2": "32x10 ft Toolpusher Unit: 2 Beds, Office and Toilet",
"V3_BODY": "This is not a dormitory. The 32x10 ft unit is the toolpusher or site-in-charge module: a working office with desks, files and a meeting position at one end, two beds and a toilet at the other. It exists because supervision needs a door that closes and a surface to spread a drawing on, and because putting that person in a crew sleeper costs you both. Order it alongside any of the sleeper sizes rather than instead of one.",
"V4_H2": "40x10 ft Camp Module: 8 Beds, Toilet and Pantry Bay",
"V4_BODY": "Eight beds, a toilet and a pantry bay in one forty-foot module, which is where most multi-week campaigns settle. The pantry keeps food preparation out of the sleeping area without committing you to a separate canteen building, and the toilet removes the shared-block dependency for a full crew. It remains a ten-foot-wide unit, so it moves on the same trailer and lifts on the same rigging as the shorter sizes. Length, not width, is what changes here.",
"V5_H2": "30x20 ft Wide-Body Module: 8 Beds Across Two Rooms",
"V5_BODY": "The first wide-body size, and the point at which the internal layout genuinely changes. At twenty feet wide the module is built as two joined sections, giving eight beds in two separate four-bed rooms off a common lobby rather than one long corridor. Crews on opposing shifts stop waking each other. It ships in sections and is joined on site, so plan for a larger crane window and a level pad than the ten-foot sizes need.",
"V6_H2": "40x20 ft Wide-Body Module: 16 Beds for a Full Crew",
"V6_BODY": "The largest module SAMAN publishes on this page: 800 sq ft, sixteen beds, and the lowest rate per square foot in the range. It suits a full drilling crew or a shared camp serving two contractors, where one building replaces four smaller ones and cuts the number of lifts, pads and service connections. Anything larger than this stops being a module and becomes a multi-building camp, which we quote as a project rather than from a rate.",
}

HASHES = {
"H1": "9c76e9a3df9e27ea3e776b33ef0de0f63424ac4eb2f9d73c2b2e87f820bdcc78",
"SEO_TITLE": "18b944c6cd73131c38c31818788a71e95b6087e1e67591b313b6adb15ab079c6",
"META_DESCRIPTION": "a8a040c98adbd6f746de093bf6e158fa912a8748ae646dfd52e2c22410182848",
"S1_SHORT_DESCRIPTION": "f0cfed1797c98021e1897d097a563c48bfa95677b3ceb218ab40f679465b40bc",
"S2_H2": "275d9731db1b3a1e40c210805c77c41ae5b9969d5fb870b2e922470bef1e9b14",
"S2_P1": "55eec30b9700457b1dd84787a5b89cc8471b742b162b0023ab66841a373e2c58",
"S2_P2": "e38511135d9903010dc2bc83cec8088737de7146ff657744ed525d804b0e5d40",
"S2_CARD_H3": "f2b867fe4bb42d5a025271728180e6f251815be5892f3317163a8999c6351604",
"S2_CARD_P1": "185f6185d6abf5479ebf7d02f0333f5f5c3aa7c4d364dc11836e76d5dd369b35",
"S2_CARD_P2": "92367d0ea93a1400eff55fb627002baf456051cebeeaab02dcc72233f471ffe5",
"S2_CARD_CTA": "9eb615eeb189198dc2a5eb4527d41689c5997c0fa81bbcdcca897c08b74c2389",
"V1_H2": "ded37296e9fcd82efce5ac03bcc91c7ac25658f08bf10d2b422f8f11ef3ce843",
"V1_BODY": "8f6bb1e6d70565b8e8d1a4dfbcaf0a2b3c99ed568a0cb88cd8c66918a712c740",
"V2_H2": "1ed4f6310b53372abbd184a023be4b701258bddc14e90ebeb97627eb5e4d0647",
"V2_BODY": "c999542bf10d55e71c1337573f3428703eccf938e02c55360e23ab9f57e802c8",
"V3_H2": "8eb282ee98dc48c00758d4a78a63d8ae70711cb14467eeafac2ca8ed2c7743a7",
"V3_BODY": "d15e9a1d3fe165047944834f153213948cfc41f6b7a27ad4597f41c421994ff9",
"V4_H2": "d2e21dbb3f137f051c496ca688cd830993ec6bfebd297fa596d073d4caaeedb6",
"V4_BODY": "8ed433ed54c053a1179c7b4fd45b9a8c89a22f02324b75098f858af39ef93187",
"V5_H2": "11b924f1ee0020e3eae047ef1c38bc6113d20f8b436f0d1d9d4525d470adc407",
"V5_BODY": "81ce26beff2a1eb6d5e9e8b66b2c69ae50bea0630f9577f9a15040e776fca51d",
"V6_H2": "6ea240ec74b40fc02ef055ccd741be2388a0e6731b88e3242748ee00ca7f2e0b",
"V6_BODY": "35568b288a953493b1438686fb1b6a1bd9c62900300892eb750a71bc56ab59cd",
}

# Ticket's own char-count column, cross-checked independently of the hash.
CHAR_COUNTS = {
"H1": 55, "SEO_TITLE": 56, "META_DESCRIPTION": 156, "S1_SHORT_DESCRIPTION": 698,
"S2_H2": 62, "S2_P1": 483, "S2_P2": 400, "S2_CARD_H3": 41, "S2_CARD_P1": 187,
"S2_CARD_P2": 215, "S2_CARD_CTA": 32, "V1_H2": 50, "V1_BODY": 494, "V2_H2": 52,
"V2_BODY": 471, "V3_H2": 51, "V3_BODY": 423, "V4_H2": 51, "V4_BODY": 452,
"V5_H2": 50, "V5_BODY": 423, "V6_H2": 50, "V6_BODY": 436,
}

if __name__ == "__main__":
    ok = True
    for k, v in COPY.items():
        h = hashlib.sha256(v.encode("utf-8")).hexdigest()
        want = HASHES[k]
        hash_ok = h == want
        count_ok = len(v) == CHAR_COUNTS[k]
        status = "PASS" if (hash_ok and count_ok) else "FAIL"
        if not (hash_ok and count_ok):
            ok = False
        print("%-24s %-4s chars=%d/%d  sha256=%s" % (k, status, len(v), CHAR_COUNTS[k], "match" if hash_ok else "MISMATCH " + h))
    print()
    print("ALL PASS" if ok else "SOME FAILED")
    json.dump(COPY, open("scripts/lc03-copy.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
