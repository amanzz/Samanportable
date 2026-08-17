# -*- coding: utf-8 -*-
"""Build src/data/wp-export/products/oil-field-camp.json: a brand-new page has no
real WooCommerce history, so this uses labor-hutments.json's full field shape
(every WooCommerce boilerplate field the pipeline expects) as a template, with
only the product-specific fields overridden. `description`/`short_description`
are left empty -- the route prefers `variantData.descriptionHtml` from
oil-field-camp.json whenever it is present, so this field never renders."""
import copy
import json

d = json.load(open(r"C:/tmp/saman-lc03/src/data/wp-export/products/labor-hutments.json", encoding="utf-8"))
new = copy.deepcopy(d)

new["id"] = 990025  # next free synthetic id after skid-mounted-porta-cabin's 990024
new["name"] = "Oil Field Camp"
new["slug"] = "oil-field-camp"
new["permalink"] = "https://blog.samanportable.com/product/labor-colony/oil-field-camp/"
new["date_created"] = "2026-08-17T00:00:00"
new["date_created_gmt"] = "2026-08-16T18:30:00"
new["date_modified"] = "2026-08-17T00:00:00"
new["date_modified_gmt"] = "2026-08-16T18:30:00"
new["description"] = ""
new["short_description"] = ""
new["sku"] = "SP-OFC-2024"
new["price"] = "310000"          # cheapest shell price (20x10 ft), matches the from-price banner
new["regular_price"] = "310000"
new["sale_price"] = ""
new["on_sale"] = False
new["average_rating"] = "0.00"
new["rating_count"] = 0
new["categories"] = [{"id": 289, "name": "Labor Colony", "slug": "labor-colony"}]
new["tags"] = []  # no approved tag taxonomy supplied for this page; empty, not invented
new["images"] = [{
    "id": 0,
    "date_created": new["date_created"], "date_created_gmt": new["date_created_gmt"],
    "date_modified": new["date_modified"], "date_modified_gmt": new["date_modified_gmt"],
    "src": "/images/products/oil-field-camp/20x10/oil-field-camp-20x10-front-left-hero.webp",
    "name": "oil-field-camp-20x10-front-left-hero",
    "alt": "20x10 ft oil field camp module in Oyster White, front left view, steel skid base and entrance steps",
}]
new["attributes"] = []
new["default_attributes"] = []
new["variations"] = []
new["related_ids"] = []
new["upsell_ids"] = []
new["cross_sell_ids"] = []
new["meta_data"] = []
new["_rank_math_head"] = None  # stale SEO header from the template product; this page's SEO
                                # comes from oil-field-camp.json's own h1/seoTitle/metaDescription
new["global_unique_id"] = ""

json.dump(new, open("src/data/wp-export/products/oil-field-camp.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("wrote src/data/wp-export/products/oil-field-camp.json")
print("id:", new["id"], "name:", new["name"], "slug:", new["slug"], "price:", new["price"])
