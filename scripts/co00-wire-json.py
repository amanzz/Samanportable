# -*- coding: utf-8 -*-
"""Wire descriptionHtml + faqSchema into container-offices.json, and update
the legacy wp-export price fields to match the ruling table (h1/description
overridden by variantData so wp-export's own stale description is inert, but
price/name feed listing-card logic elsewhere so 10x10's new ex-GST price is
applied there for from-price consistency)."""
import json

PRODUCT_PATH = "src/data/products/container-offices.json"
WP_PATH = "src/data/wp-export/products/container-offices.json"

data = json.load(open(PRODUCT_PATH, encoding="utf-8"))
desc = json.load(open("scripts/co00-description-html.json", encoding="utf-8"))
data["descriptionHtml"] = desc["descriptionHtml"]

FAQS = [
    ("What does a container office cost in India?",
     "Our published rate is Rs 1,450 per square foot at the 200 sq.ft. reference size, with a premium below "
     "that area and a reduction above it. A 20x10 ft module is Rs 2,90,000 before GST. Those are workbook "
     "rates for the standard specification. Your signed quote sets the final figure."),
    ("Is this an ISO-certified shipping container?",
     "No. The modules on this page are fabricated to a container form factor. We do not claim ISO 668 "
     "compliance, CSC plate approval or stackability for them without project-specific evidence. If you "
     "need a genuine converted freight shell, that is a different product and we build it."),
    ("Can it be moved again later?",
     "Yes, from the approved lifting points, on a suitable vehicle. Repeated relocation is harder on the "
     "base and the coating than a single delivery. So tell us at enquiry stage if the module will move "
     "several times. We specify it differently."),
    ("How long does delivery take?",
     "It depends on the size, the fit-out and the current works load. We confirm it in your quote rather "
     "than publish a figure we cannot hold for every order."),
    ("What is the warranty?",
     "The warranty period and its exclusions are confirmed in your final quote. Relocation damage, misuse, "
     "site utilities and unapproved alterations sit outside it. Every container office we build carries "
     "the same pre-dispatch checks listed above, whichever size you order."),
]

data["faqSchema"] = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://www.samanportable.com/product/container-offices#faq",
    "url": "https://www.samanportable.com/product/container-offices",
    "mainEntity": [
        {
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        }
        for q, a in FAQS
    ],
}

json.dump(data, open(PRODUCT_PATH, "w", encoding="utf-8", newline="\n"), indent=2, ensure_ascii=False)

wp = json.load(open(WP_PATH, encoding="utf-8"))
old_price, old_regular, old_sale, old_on_sale = wp.get("price"), wp.get("regular_price"), wp.get("sale_price"), wp.get("on_sale")
wp["price"] = "166750.00"
wp["regular_price"] = "166750.00"
wp["sale_price"] = ""
wp["on_sale"] = False
json.dump(wp, open(WP_PATH, "w", encoding="utf-8", newline="\n"), indent=2, ensure_ascii=False)

print("descriptionHtml wired, length:", len(data["descriptionHtml"]))
print("faqSchema mainEntity count:", len(data["faqSchema"]["mainEntity"]))
print("wp-export price: %r/%r/%r/%r -> %r/%r/%r/%r" % (
    old_price, old_regular, old_sale, old_on_sale,
    wp["price"], wp["regular_price"], wp["sale_price"], wp["on_sale"]))
print("wp-export rating untouched:", wp.get("average_rating"), wp.get("rating_count"))
