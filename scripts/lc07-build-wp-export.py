# -*- coding: utf-8 -*-
"""Build src/data/wp-export/products/ablution-block.json using oil-field-camp.json's
full field shape as a template (brand-new page, no real WooCommerce history)."""
import copy
import json

d = json.load(open(r"C:/tmp/saman-lc07/src/data/wp-export/products/oil-field-camp.json", encoding="utf-8"))
new = copy.deepcopy(d)

new["id"] = 990027
new["name"] = "Multi-Toilet Ablution Block"
new["slug"] = "ablution-block"
new["permalink"] = "https://blog.samanportable.com/product/labor-colony/ablution-block/"
new["date_created"] = "2026-08-17T00:00:00"
new["date_created_gmt"] = "2026-08-16T18:30:00"
new["date_modified"] = "2026-08-17T00:00:00"
new["date_modified_gmt"] = "2026-08-16T18:30:00"
new["description"] = ""
new["short_description"] = ""
new["sku"] = "SP-ABL-2024"
new["price"] = "210000"
new["regular_price"] = "210000"
new["sale_price"] = ""
new["on_sale"] = False
new["average_rating"] = "0.00"
new["rating_count"] = 0
new["categories"] = [{"id": 289, "name": "Labor Colony", "slug": "labor-colony"}]
new["tags"] = []
new["images"] = [{
    "id": 0,
    "date_created": new["date_created"], "date_created_gmt": new["date_created_gmt"],
    "date_modified": new["date_modified"], "date_modified_gmt": new["date_modified_gmt"],
    "src": "/images/products/ablution-block/12x10/ablution-block-12x10-ft-cornflower-blue-exterior-front-left-hero.webp",
    "name": "ablution-block-12x10-ft-cornflower-blue-exterior-front-left-hero",
    "alt": "Cornflower Blue 12x10 ft ablution block, front left three-quarter view, white trim and high-level privacy louvres",
}]
new["attributes"] = []
new["default_attributes"] = []
new["variations"] = []
new["related_ids"] = []
new["upsell_ids"] = []
new["cross_sell_ids"] = []
new["meta_data"] = []
new["_rank_math_head"] = None
new["global_unique_id"] = ""

json.dump(new, open("src/data/wp-export/products/ablution-block.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("wrote src/data/wp-export/products/ablution-block.json")
print("id:", new["id"], "name:", new["name"], "slug:", new["slug"], "price:", new["price"])
