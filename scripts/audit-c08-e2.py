#!/usr/bin/env python3
"""Rendered C08-E2 contact, rail-image, and heading audit."""

from __future__ import annotations

import html
import json
import re
import sys
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


ROUTES = (
    "/product/container-houses",
    "/product/container-houses/prefab-container-homes",
    "/product/container-houses/luxury-container-houses",
    "/product/container-houses/shipping-container-homes",
    "/product/container-houses/affordable-container-homes",
    "/product/container-houses/prefabricated-container-house",
)
DELETED_RAIL_PATHS = {
    "/images/product-heroes/container-houses/container-houses-with-modern-interior-design.webp",
    "/images/product-heroes/container-houses/prefab-container-home-blue-porch-hero-saman.webp",
    "/images/product-heroes/container-houses/luxury-container-house-rear-corner-single-window.webp",
    "/images/product-heroes/container-houses/turquoise-shipping-container-house-view.webp",
    "/images/product-heroes/container-houses/affordable-container-home-with-balcony.webp",
}
FALLBACK_G1_PATHS = {
    "/images/products/container-houses/20x8/container-houses-20x8-front-right-hero.webp",
    "/images/products/prefab-container-homes/20x8/prefab-container-homes-20x8-front-right-hero.webp",
    "/images/products/luxury-container-houses/20x8/luxury-container-houses-20x8-front-right-hero.webp",
    "/images/products/shipping-container-homes/20x8/shipping-container-homes-20x8-front-right-hero.webp",
    "/images/products/affordable-container-homes/20x8/affordable-container-homes-20x8-front-right-hero.webp",
}
EXPECTED_NUMBERS = {
    "+91 88616 22859",
    "+91 80886 85440",
    "+91 87960 39938",
    "+91 97089 89937",
}
EXPECTED_EMAILS = {"sales@samanportable.com", "ncr@samanportable.com"}
EXPECTED_PHONE_DIGITS = {"918861622859", "918088685440", "918796039938", "919708989937"}
APPROVED_CONTACT_BLOCK = (
    "South India — Bengaluru: +91 88616 22859 or +91 80886 85440, "
    "sales@samanportable.com North India — Greater Noida: +91 87960 39938 or "
    "+91 97089 89937, ncr@samanportable.com"
)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.text: list[str] = []
        self.images: list[dict[str, str]] = []
        self.headings: list[dict[str, str]] = []
        self._heading: tuple[str, list[str]] | None = None
        self.rail_cards = 0
        self._rail_href: str | None = None
        self.rail_images: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if tag in {"script", "style", "noscript"}:
            self.skip += 1
        if tag == "img":
            self.images.append({"src": values.get("src", ""), "alt": values.get("alt", "")})
            if self._rail_href:
                self.rail_images.append(
                    {"href": self._rail_href, "src": values.get("src", ""), "alt": values.get("alt", "")}
                )
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._heading = (tag, [])
        if values.get("data-related-product-rail-card") == "true":
            self.rail_cards += 1
            self._rail_href = values.get("href", "")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self.skip:
            self.skip -= 1
        if self._heading and tag == self._heading[0]:
            self.headings.append(
                {"level": tag, "text": re.sub(r"\s+", " ", "".join(self._heading[1])).strip()}
            )
            self._heading = None
        if tag == "a" and self._rail_href:
            self._rail_href = None

    def handle_data(self, data: str) -> None:
        if not self.skip:
            self.text.append(data)
            if self._heading:
                self._heading[1].append(data)


def fetch(url: str) -> tuple[int, bytes]:
    request = Request(url, headers={"User-Agent": "C08-E2-audit/1.0"})
    try:
        with urlopen(request, timeout=20) as response:
            return response.status, response.read()
    except Exception as exc:
        return int(getattr(exc, "code", 0) or 0), str(exc).encode()


def main() -> None:
    base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:3042"
    results = []
    broken_tags = []
    deleted_hits = []
    malformed_hits = []
    fixture_deleted_seen = 0

    for route in ROUTES:
        status, payload = fetch(base + route)
        parser = PageParser()
        parser.feed(payload.decode("utf-8", errors="replace"))
        visible = re.sub(r"\s+", " ", html.unescape(" ".join(parser.text))).strip()
        visible = re.sub(r"\s+([,;:.!?])", r"\1", visible)
        numbers = sorted(set(re.findall(r"(?:\+91[\s-]?[6-9](?:[\s-]?\d){9}|0[6-9]\d{8,9})", visible)))
        numbers = [re.sub(r"\s+", " ", value).strip(" -") for value in numbers]
        emails = sorted(set(re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", visible)))
        malformed = [
            value
            for value in numbers
            if (
                (value.startswith("+91") and len(re.sub(r"\D", "", value)) != 12)
                or (value.startswith("0") and len(re.sub(r"\D", "", value)) != 11)
            )
        ]
        malformed_hits.extend({"route": route, "value": value} for value in malformed)

        local_checks: dict[str, int] = {}
        for image in parser.images:
            src = image["src"]
            if src in DELETED_RAIL_PATHS:
                deleted_hits.append({"route": route, **image})
            if not src or src.startswith("data:"):
                if not src:
                    broken_tags.append({"route": route, **image, "status": 0})
                continue
            parsed = urlparse(src)
            if parsed.scheme and parsed.netloc not in {"www.samanportable.com", "127.0.0.1:3042", "localhost:3042"}:
                continue
            check_url = urljoin(base + "/", parsed.path + (("?" + parsed.query) if parsed.query else ""))
            if check_url not in local_checks:
                local_checks[check_url] = fetch(check_url)[0]
            if local_checks[check_url] != 200:
                broken_tags.append({"route": route, **image, "status": local_checks[check_url]})

        fixture_deleted_seen += sum(payload.decode("utf-8", errors="replace").count(path) for path in DELETED_RAIL_PATHS)
        results.append(
            {
                "route": route,
                "status": status,
                "renderedTelephoneStrings": numbers,
                "renderedEmailStrings": emails,
                "unexpectedTelephoneStrings": sorted(
                    value
                    for value in numbers
                    if (
                        ("91" + re.sub(r"\D", "", value)[1:])
                        if value.startswith("0")
                        else re.sub(r"\D", "", value)
                    )
                    not in EXPECTED_PHONE_DIGITS
                ),
                "unexpectedEmailStrings": sorted(set(emails) - EXPECTED_EMAILS),
                "approvedRouteContactBlockVisible": (
                    APPROVED_CONTACT_BLOCK in visible
                    if route.endswith("/prefabricated-container-house")
                    else None
                ),
                "imageTags": len(parser.images),
                "relatedRailCards": parser.rail_cards,
                "relatedRailImages": parser.rail_images,
                "fallbackG1RailImageTags": sum(
                    image["src"] in FALLBACK_G1_PATHS for image in parser.rail_images
                ),
                "headings": parser.headings,
            }
        )

    report = {
        "baseUrl": base,
        "routes": results,
        "route200": sum(row["status"] == 200 for row in results),
        "renderedImageTags": sum(row["imageTags"] for row in results),
        "brokenRenderedImageTags": broken_tags,
        "brokenRenderedImageTagCount": len(broken_tags),
        "deletedLegacyRailPathHits": deleted_hits,
        "deletedLegacyRailPathHitCount": len(deleted_hits),
        "fallbackG1RailImageTagCount": sum(
            row["fallbackG1RailImageTags"] for row in results
        ),
        "malformedTelephoneHits": malformed_hits,
        "malformedTelephoneHitCount": len(malformed_hits),
        "knownFailingFixture": {
            "fixture": sorted(DELETED_RAIL_PATHS),
            "fixturePathCount": len(DELETED_RAIL_PATHS),
            "fixtureWouldFailWithoutFallback": len(DELETED_RAIL_PATHS) == 5,
            "fixturePathsSurvivingRenderedHtml": fixture_deleted_seen,
            "malformedContactFixture": "0970898993",
            "malformedContactFixtureDetected": len("0970898993") != 11,
            "malformedContactFixtureSurvivingRenderedHtml": sum(
                "0970898993" in value
                for row in results
                for value in row["renderedTelephoneStrings"]
            ),
        },
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    held = next(row for row in results if row["route"].endswith("/prefabricated-container-house"))
    if (
        report["route200"] != 6
        or broken_tags
        or deleted_hits
        or malformed_hits
        or not held["approvedRouteContactBlockVisible"]
        or report["knownFailingFixture"]["malformedContactFixtureSurvivingRenderedHtml"]
    ):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
