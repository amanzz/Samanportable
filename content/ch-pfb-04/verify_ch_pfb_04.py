#!/usr/bin/env python3
"""CH-PFB-04 Prefab Container Homes - build verifier.
Usage:  python verify_ch_pfb_04.py <path-to-copy-v1.json> <path-to-asset-map-v1.json> [rendered-html]
Prints RESULT: PASS or RESULT: FAIL with every failing check named."""
import json, sys, os, re

F=[]; P=[]
def chk(name, ok, detail=""):
    (P if ok else F).append("%s%s"%(name," - "+detail if detail else ""))

def blen(s): return len(s)

def main():
    copy_p = sys.argv[1] if len(sys.argv)>1 else "CH-PFB-04-prefab-container-homes-copy-v1.json"
    map_p  = sys.argv[2] if len(sys.argv)>2 else "CH-PFB-04-prefab-container-homes-asset-map-v1.json"
    html_p = sys.argv[3] if len(sys.argv)>3 else None
    c=json.load(open(copy_p,encoding="utf-8")); a=json.load(open(map_p,encoding="utf-8"))

    # ---- 1 meta
    t=c["meta"]["title"]; chk("meta title 55-60",55<=blen(t)<=60,"%d"%blen(t))
    chk("meta title contains SAMAN once",t.count("SAMAN")==1,"count %d"%t.count("SAMAN"))
    h=c["meta"]["h1"]; chk("h1 50-60",50<=blen(h)<=60,"%d"%blen(h))
    d=c["meta"]["description"]; chk("meta description 150-160",150<=blen(d)<=160,"%d"%blen(d))
    chk("canonical self-referencing",c["meta"]["canonical_self"] is True)
    chk("canonical url",c["canonical"]=="https://www.samanportable.com/product/container-houses/prefab-container-homes")

    # ---- 2 hero
    hero=c["hero"]["short_description"]; chk("hero 700-800",700<=blen(hero)<=800,"%d"%blen(hero))
    SIZES=["20x8","20x10","20x12","40x8","40x10","40x12"]
    chk("size tab order",[s["key"] for s in c["size_tabs"]]==SIZES,
        str([s["key"] for s in c["size_tabs"]]))
    for k in SIZES:
        chk("FEATURE_CELLS %s = 5"%k,len(c["hero"]["feature_cells"][k])==5,
            "%d"%len(c["hero"]["feature_cells"][k]))

    # ---- 3 prices against SAMAN's own area-band rule, base 1625 at 200 sq.ft
    BANDS=[(100,149,1.15),(150,199,1.10),(200,200,1.00),(201,300,0.96),(301,400,0.95),
           (401,500,0.94),(501,600,0.93),(601,700,0.92),(701,800,0.91),(801,900,0.90)]
    for s in c["size_tabs"]:
        area=s["area_sqft"]; mult=[m for lo,hi,m in BANDS if lo<=area<=hi]
        chk("area band exists %s"%s["key"],len(mult)==1)
        if not mult: continue
        rate=round(1625.0*mult[0],2)
        chk("rate %s"%s["key"],abs(s["rate_per_sqft"]-rate)<0.01,"%s vs %s"%(s["rate_per_sqft"],rate))
        ex=round(rate*area)
        chk("ex-GST %s"%s["key"],s["price_ex_gst"]==ex,"%s vs %s"%(s["price_ex_gst"],ex))
        chk("incl-GST %s"%s["key"],s["price_incl_gst"]==round(ex*1.18),
            "%s vs %s"%(s["price_incl_gst"],round(ex*1.18)))
    chk("aggregate low = 20x8 ex-GST",c["structured_data"]["product"]["aggregateOffer"]["lowPrice"]==286000)
    chk("aggregate high = 40x12 ex-GST",c["structured_data"]["product"]["aggregateOffer"]["highPrice"]==733200)
    chk("aggregate offerCount 6",c["structured_data"]["product"]["aggregateOffer"]["offerCount"]==6)
    chk("aggregate currency INR",c["structured_data"]["product"]["aggregateOffer"]["priceCurrency"]=="INR")

    # ---- 4 section 2
    s2=c["section2"]; chk("s2 h2 55-70",55<=blen(s2["h2"])<=70,"%d"%blen(s2["h2"]))
    tot=blen(s2["p1"])+blen(s2["p2"])
    chk("s2 two paragraphs 800-900",800<=tot<=900,"%d"%tot)
    links=re.findall(r'href="([^"]+)"',s2["p1"]+s2["p2"])
    chk("s2 exactly one internal link",len(links)==1,str(links))
    chk("s2 link target",links==["/product/container-houses"] if links else False,str(links))
    chk("s2 one CTA","label" in s2["cta"] and "href" in s2["cta"])
    sc=s2["split_card"]
    chk("split h3 35-65",35<=blen(sc["h3"])<=65,"%d"%blen(sc["h3"]))
    chk("split p1 150-220",150<=blen(sc["p1"])<=220,"%d"%blen(sc["p1"]))
    chk("split p2 150-220",150<=blen(sc["p2"])<=220,"%d"%blen(sc["p2"]))
    chk("split card image is 16:9 slot",sc["image_slot"]=="section2.split.image_16x9")

    # ---- 5 section 3
    s3=c["section3"]; chk("s3 h2 50-60",50<=blen(s3["h2"])<=60,"%d"%blen(s3["h2"]))
    chk("s3 intro 100-140",100<=blen(s3["intro"])<=140,"%d"%blen(s3["intro"]))
    chk("s3 six sizes in folder order",[x["key"] for x in s3["sizes"]]==SIZES)
    for x in s3["sizes"]:
        chk("s3 h3 %s 50-62"%x["key"],50<=blen(x["h3"])<=62,"%d"%blen(x["h3"]))
        chk("s3 para %s 400-500"%x["key"],400<=blen(x["paragraph"])<=500,"%d"%blen(x["paragraph"]))
        chk("s3 bullets %s 5-6"%x["key"],5<=len(x["bullets"])<=6,"%d"%len(x["bullets"]))
        for b in x["bullets"]:
            FIT=(r'\b(rather than|instead of|without|separates?|takes?|unchanged|calibrated|'
                 r'over-width|trailer|coupl\w+|bay|plot|quoted per|largest|widest|narrowest|'
                 r'cheapest|only|same|no|not)\b')
            chk("s3 bullet carries a figure or fit decision (%s)"%x["key"],
                bool(re.search(r'\d',b)) or bool(re.search(FIT,b,re.I)),b[:48])

    # ---- 6 you may also like
    y=c["you_may_also_like"]; chk("ymal intro < 90",blen(y["intro"])<90,"%d"%blen(y["intro"]))
    for it in y["items"]:
        chk("ymal stays in cluster",it["href"].startswith("/product/container-houses"),it["href"])

    # ---- 7 description tab
    dt=c["tabs"]["description"]
    words=0; bullets=0; tables=1 if dt.get("table") else 0
    for sec in dt["sections"]:
        chk("desc h2 40-60",40<=blen(sec["h2"])<=60,"%d %s"%(blen(sec["h2"]),sec["h2"][:40]))
        words+=len(sec["h2"].split())
        for p in sec["paragraphs"]:
            if p=="@BULLETS": bullets+=1
            elif p=="@TABLE": pass
            else: words+=len(p.split())
    words+=sum(len(b.split()) for b in dt["bullets"])
    words+=len(" ".join(dt["table"]["head"]).split())+sum(len(" ".join(r).split()) for r in dt["table"]["rows"])
    chk("description 2000-3000 words",2000<=words<=3000,"%d"%words)
    chk("exactly one bullet block",bullets==1,"%d"%bullets)
    chk("zero or one table",tables<=1,"%d"%tables)
    chk("faq count 6-8",6<=len(dt["faqs"])<=8,"%d"%len(dt["faqs"]))
    for i,f in enumerate(dt["faqs"]):
        chk("faq %d answer 100-300"%(i+1),100<=blen(f["a"])<=300,"%d"%blen(f["a"]))
    chk("first desc section disambiguates intent",
        "container house" in dt["sections"][0]["h2"].lower())
    chk("no images in description tab","images" not in dt)

    # ---- 8 specifications tab
    sp=c["tabs"]["specifications"]
    chk("spec narrative 2-3 paragraphs",2<=len(sp["narrative"])<=3,"%d"%len(sp["narrative"]))
    for g in ["A_sizes_and_prices","B_product_build","C_openings_and_layout",
              "D_platform_common_material_key","E_scope_boundary"]:
        chk("spec group %s present"%g[0],g in sp["groups"])
    rows_b=sp["groups"]["B_product_build"]["rows"]
    rows_c=sp["groups"]["C_openings_and_layout"]["rows"]
    rows_e=sp["groups"]["E_scope_boundary"]["rows"]
    for nm,rows in [("B",rows_b),("C",rows_c),("E",rows_e)]:
        chk("group %s is product-specific only"%nm,
            all(r["platform_common"] is False for r in rows),
            "%d rows"%len(rows))
    rows_d=sp["groups"]["D_platform_common_material_key"]["rows"]
    chk("group D is platform-common only",all(r["platform_common"] is True for r in rows_d),
        "%d rows"%len(rows_d))
    chk("30 spec rows total",len(rows_b)+len(rows_c)+len(rows_e)+len(rows_d)==30,
        "%d"%(len(rows_b)+len(rows_c)+len(rows_e)+len(rows_d)))
    chk("17 product-specific",len(rows_b)+len(rows_c)+len(rows_e)==17,
        "%d"%(len(rows_b)+len(rows_c)+len(rows_e)))
    chk("group C carries all six sizes",len(sp["groups"]["C_openings_and_layout"]["by_size"])==6)
    chk("no diagrams slot filled",sp["diagrams"]==[])
    chk("no technical pdf invented",sp["technical_pdf"] is None)

    # ---- 9 shipping and reviews
    chk("shipping is the shared component",
        c["tabs"]["shipping"]["component"]=="shared-freight-component")
    rv=c["tabs"]["reviews"]
    chk("no invented reviews",rv["reviews"]==[])
    chk("reviews empty state",rv["empty_state"]=="No verified reviews yet.")
    chk("no rating schema",rv["rating_schema"] is False)

    # ---- 10 structured data
    sd=c["structured_data"]
    chk("structured data types exact",
        sd["types"]==["ItemPage","Product","BreadcrumbList","FAQPage"],str(sd["types"]))

    # ---- 11 em dash ban across every string
    def walk(o,path="$"):
        if isinstance(o,str):
            if "\u2014" in o: chk("no U+2014 at %s"%path,False,o[:60])
        elif isinstance(o,dict):
            for k,v in o.items(): walk(v,path+"."+str(k))
        elif isinstance(o,list):
            for i,v in enumerate(o): walk(v,path+"[%d]"%i)
    walk(c)
    chk("em dash scan completed",True)

    # ---- 12 banned unsourced claims
    BANNED=[r"\b5[- ]year structural\b", r"\bfire[- ]rated\b", r"\bU[- ]value\b",
            r"\bR[- ]value\b", r"\bdB\b", r"\bcyclone[- ]rated\b", r"\bearthquake[- ]proof\b",
            r"\bISO (?:668|1496)\b", r"\bCSC plate\b", r"\blifetime\b"]
    flat=json.dumps(c,ensure_ascii=False)
    for b in BANNED:
        m=re.search(b,flat,re.I)
        chk("no unsourced claim %s"%b, m is None, m.group(0) if m else "")
    chk("10-year structural warranty stated","10-year structural warranty" in flat)

    # ---- 13 asset map
    slots={s["slot"] for s in a["slots"]}
    for k in SIZES:
        for n in ["01","02","03","04","05","06"]:
            chk("gallery slot %s.%s"%(k,n),"gallery.%s.%s"%(k,n) in slots)
        chk("section3 GA slot %s"%k,"section3.%s.ga"%k in slots)
    chk("section 2 16:9 slot","section2.split.image_16x9" in slots)
    chk("46 asset slots",len(a["slots"])==46,"%d"%len(a["slots"]))
    for s in a["slots"]:
        chk("alt present %s"%s["slot"],bool(s.get("alt")))
        chk("output is webp %s"%s["slot"],s["output"].endswith(".webp"),s["output"])
        chk("no source png in public %s"%s["slot"],".png" not in s["output"].lower())
    ga=[s for s in a["slots"] if s["slot"].startswith("section3.")]
    chk("six GA outputs",len(ga)==6,"%d"%len(ga))
    chk("section 2 image is a render not a drawing",
        all("3d-general-arrangement" not in s["output"] for s in a["slots"]
            if s["slot"]=="section2.split.image_16x9"))
    chk("no 1:1 image declared for the media band",
        all("gallery/" not in s["output"] for s in a["slots"] if s["slot"].startswith("media_band")))

    # ---- 14 optional rendered-HTML checks
    if html_p and os.path.exists(html_p):
        html=open(html_p,encoding="utf-8",errors="ignore").read()
        chk("exactly one H1 in render",len(re.findall(r"<h1[ >]",html,re.I))==1,
            "%d"%len(re.findall(r"<h1[ >]",html,re.I)))
        chk("no U+2014 in render","\u2014" not in html)
        chk("no Info tab in render","info tab" not in html.lower())
        for f in dt["faqs"]:
            chk("faq answer byte-identical in schema",f["a"] in html,f["a"][:40])

    print("checks passed: %d"%len(P))
    if F:
        print("checks FAILED: %d"%len(F))
        for x in F: print("  FAIL  "+x)
        print("RESULT: FAIL"); sys.exit(1)
    print("RESULT: PASS")

if __name__=="__main__": main()
