#!/usr/bin/env python3
"""Evidence crawl for the SAMAN full-site Google policy/remapping audit.

The crawler deliberately combines four inventories: live XML sitemaps, internal
links, local Search Console exports, and the application's redirect map.  It
does not change the website or deploy anything.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import html as html_lib
import json
import re
import subprocess
import threading
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlsplit, urlunsplit

import requests
from bs4 import BeautifulSoup


ORIGIN = "https://www.samanportable.com"
ALLOWED_HOSTS = {"www.samanportable.com", "samanportable.com"}
USER_AGENT = "SAMAN-Google-Policy-Audit/2026-08 (+https://www.samanportable.com/)"
ASSET_EXTENSIONS = {
    ".avif", ".css", ".csv", ".doc", ".docx", ".gif", ".ico", ".jpeg",
    ".jpg", ".js", ".json", ".mp3", ".mp4", ".pdf", ".png", ".svg",
    ".txt", ".webm", ".webp", ".xls", ".xlsx", ".xml", ".zip",
}
TECHNICAL_RE = re.compile(
    r"\b(specification|technical|material|construction|frame|wall|roof|floor|"
    r"dimension|size|insulation|electrical|plumbing|foundation|thickness)\b",
    re.I,
)
PHONE_RE = re.compile(r"(?:\+?91[\s-]?)?[6-9]\d(?:[\s-]?\d){8}")
SCHEMA_TYPE_RE = re.compile(r"https?://schema\.org/([^\"'/}\s]+)", re.I)


def normalize_url(value: str, keep_query: bool = False) -> str | None:
    if not value:
        return None
    value = html_lib.unescape(value.strip())
    try:
        absolute = urljoin(ORIGIN, value)
        parts = urlsplit(absolute)
    except ValueError:
        return None
    host = parts.hostname.lower() if parts.hostname else ""
    if host not in ALLOWED_HOSTS:
        return None
    path = re.sub(r"/{2,}", "/", parts.path or "/")
    if len(path) > 1:
        path = path.rstrip("/")
    if Path(path).suffix.lower() in ASSET_EXTENSIONS:
        return None
    query = parts.query if keep_query else ""
    return urlunsplit(("https", "www.samanportable.com", path, query, ""))


def sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8", errors="ignore")).hexdigest()


def attr_content(soup: BeautifulSoup, tag: str, attrs: dict[str, Any], attr: str) -> str:
    node = soup.find(tag, attrs=attrs)
    return str(node.get(attr, "")).strip() if node else ""


def schema_types(soup: BeautifulSoup) -> list[str]:
    found: set[str] = set()
    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        raw = script.get_text(" ", strip=True)
        try:
            payload = json.loads(raw)
            stack = [payload]
            while stack:
                item = stack.pop()
                if isinstance(item, dict):
                    value = item.get("@type")
                    if isinstance(value, str):
                        found.add(value)
                    elif isinstance(value, list):
                        found.update(str(v) for v in value)
                    stack.extend(item.values())
                elif isinstance(item, list):
                    stack.extend(item)
        except (json.JSONDecodeError, TypeError):
            found.update(SCHEMA_TYPE_RE.findall(raw))
    return sorted(found)


def parse_html(url: str, body: str) -> dict[str, Any]:
    soup = BeautifulSoup(body, "html.parser")
    for node in soup(["script", "style", "noscript", "template", "svg"]):
        node.decompose()

    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    description = attr_content(soup, "meta", {"name": re.compile(r"^description$", re.I)}, "content")
    robots = attr_content(soup, "meta", {"name": re.compile(r"^(robots|googlebot)$", re.I)}, "content")
    canonical_node = soup.find("link", rel=lambda value: value and "canonical" in value)
    canonical = normalize_url(canonical_node.get("href", "")) if canonical_node else None
    h1s = [node.get_text(" ", strip=True) for node in soup.find_all("h1")]
    h2s = [node.get_text(" ", strip=True) for node in soup.find_all("h2")]
    headings = [node.get_text(" ", strip=True) for node in soup.find_all(["h2", "h3", "h4"])]

    internal_urls: set[str] = set()
    external_links = 0
    for anchor in soup.find_all("a", href=True):
        href = str(anchor.get("href", "")).strip()
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        normalized = normalize_url(href)
        if normalized:
            internal_urls.add(normalized)
        elif href.startswith(("http://", "https://")):
            external_links += 1

    images = soup.find_all("img")
    missing_alt = sum(1 for image in images if not str(image.get("alt", "")).strip())

    content_root = soup.find("main") or soup.body or soup
    content_copy = BeautifulSoup(str(content_root), "html.parser")
    for selector in ["nav", "footer", "header", "aside", "form", "script", "style", "noscript", "svg"]:
        for node in content_copy.select(selector):
            node.decompose()
    visible_text = re.sub(r"\s+", " ", content_copy.get_text(" ", strip=True)).strip()
    normalized_text = re.sub(r"[^a-z0-9]+", " ", visible_text.lower()).strip()
    words = normalized_text.split()

    technical_headings = [heading for heading in headings if TECHNICAL_RE.search(heading)]
    table_headers: list[str] = []
    for table in soup.find_all("table"):
        headers = [cell.get_text(" ", strip=True) for cell in table.find_all("th")]
        if headers:
            table_headers.append(" | ".join(headers[:12]))

    return {
        "title": title,
        "meta_description": description,
        "canonical": canonical or "",
        "meta_robots": robots,
        "noindex": bool(re.search(r"\bnoindex\b", robots, re.I)),
        "h1": h1s[0] if h1s else "",
        "h1_count": len(h1s),
        "h2s": h2s[:40],
        "word_count": len(words),
        "text_hash": sha256(normalized_text),
        "content_text": visible_text[:150000],
        "internal_urls": sorted(internal_urls),
        "internal_link_count": len(internal_urls),
        "external_link_count": external_links,
        "image_count": len(images),
        "missing_alt_count": missing_alt,
        "schema_types": schema_types(soup),
        "technical_headings": technical_headings[:20],
        "table_headers": table_headers[:20],
        "table_count": len(soup.find_all("table")),
        "phones": sorted(set(PHONE_RE.findall(visible_text))),
        "html_bytes": len(body.encode("utf-8", errors="ignore")),
    }


_thread_state = threading.local()


def session() -> requests.Session:
    if not hasattr(_thread_state, "session"):
        value = requests.Session()
        value.headers.update({"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.7"})
        _thread_state.session = value
    return _thread_state.session


def fetch_one(url: str) -> tuple[str, dict[str, Any]]:
    last_error = ""
    for attempt in range(3):
        try:
            response = session().get(url, allow_redirects=False, timeout=(8, 25))
            content_type = response.headers.get("content-type", "")
            record: dict[str, Any] = {
                "status": response.status_code,
                "location": response.headers.get("location", ""),
                "content_type": content_type,
                "x_robots_tag": response.headers.get("x-robots-tag", ""),
            }
            if response.status_code in {429, 500, 502, 503, 504} and attempt < 2:
                time.sleep(0.6 * (attempt + 1))
                continue
            if "text/html" in content_type.lower():
                response.encoding = response.encoding or "utf-8"
                record.update(parse_html(url, response.text))
            return url, record
        except requests.RequestException as exc:
            last_error = str(exc)
            if attempt < 2:
                time.sleep(0.6 * (attempt + 1))
    return url, {"status": 0, "error": last_error}


def fetch_xml(url: str) -> str:
    response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=(8, 30))
    response.raise_for_status()
    return response.text


def discover_live_sitemaps() -> tuple[dict[str, set[str]], dict[str, str]]:
    source_map: dict[str, set[str]] = defaultdict(set)
    raw: dict[str, str] = {}
    queue = [f"{ORIGIN}/sitemap.xml"]
    seen: set[str] = set()
    while queue:
        sitemap_url = queue.pop(0)
        if sitemap_url in seen:
            continue
        seen.add(sitemap_url)
        xml = fetch_xml(sitemap_url)
        raw[sitemap_url] = xml
        locs = re.findall(r"<loc>\s*([^<]+?)\s*</loc>", xml, flags=re.I)
        for loc in locs:
            loc = html_lib.unescape(loc.strip())
            if loc.lower().endswith(".xml"):
                queue.append(loc)
                continue
            normalized = normalize_url(loc)
            if normalized:
                label = Path(urlsplit(sitemap_url).path).stem
                source_map[normalized].add(label)
    return source_map, raw


def load_gsc_sources(root: Path) -> tuple[dict[str, set[str]], dict[str, dict[str, dict[str, Any]]]]:
    source_map: dict[str, set[str]] = defaultdict(set)
    metrics: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
    patterns = {
        "gsc16": root / "GSC_REPORTS" / "LAST_16_MONTHS" / "GSC_16M_Pages.csv",
        "gsc_mid": root / "GSC_REPORTS" / "LAST_6_MONTHS" / "GSC_6M_Pages.csv",
        "gsc_recent": root / "GSC_REPORTS" / "LAST_3_MONTHS" / "GSC_3M_Pages.csv",
    }
    for label, path in patterns.items():
        if not path.exists():
            continue
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            for row in csv.DictReader(handle):
                raw_url = row.get("Top pages", "")
                normalized = normalize_url(raw_url)
                if not normalized:
                    continue
                source_map[normalized].add(label)
                try:
                    metrics[normalized][label] = {
                        "clicks": float(row.get("Clicks", 0) or 0),
                        "impressions": float(row.get("Impressions", 0) or 0),
                        "ctr": row.get("CTR", ""),
                        "position": float(row.get("Position", 0) or 0),
                        "raw_url": raw_url,
                    }
                except ValueError:
                    metrics[normalized][label] = {"raw_url": raw_url}
    return source_map, metrics


def load_redirects(root: Path) -> list[dict[str, Any]]:
    script = r"""
const cfg = require('./next.config.js');
(async () => {
  const rows = await cfg.redirects();
  process.stdout.write('\n__REDIRECT_JSON__' + JSON.stringify(rows));
})().catch(err => { console.error(err); process.exit(1); });
"""
    completed = subprocess.run(
        ["node", "-e", script], cwd=root, capture_output=True, text=True,
        encoding="utf-8", errors="replace", check=True,
    )
    marker = "__REDIRECT_JSON__"
    payload = completed.stdout.rsplit(marker, 1)[-1]
    rows = json.loads(payload)
    result: list[dict[str, Any]] = []
    for row in rows:
        source = row.get("source", "")
        destination = row.get("destination", "")
        status_code = row.get("statusCode")
        if not isinstance(status_code, int):
            status_code = 308 if row.get("permanent") else 307
        literal = bool(source and ":" not in source and "*" not in source and not row.get("has") and not row.get("missing"))
        # A slash-only alias such as /product/x/ -> /product/x is not the
        # canonical no-slash URL.  normalize_url intentionally removes the
        # trailing slash, so do not collapse that alias onto the live winner.
        source_url = normalize_url(source) if literal and not (len(source) > 1 and source.endswith("/")) else None
        result.append({
            "source_pattern": source,
            "destination_pattern": destination,
            "status_code": status_code,
            "permanent": bool(row.get("permanent")) or status_code in {301, 308},
            "literal": literal,
            "source_url": source_url,
            "destination_url": normalize_url(destination) if literal else None,
        })
    return result


def add_sources(target: dict[str, set[str]], incoming: dict[str, set[str]]) -> None:
    for url, labels in incoming.items():
        target[url].update(labels)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, help="Output directory")
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--limit", type=int, default=3500)
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[2]
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=True)

    url_sources: dict[str, set[str]] = defaultdict(set)
    sitemap_sources, raw_sitemaps = discover_live_sitemaps()
    add_sources(url_sources, sitemap_sources)
    gsc_sources, gsc_metrics = load_gsc_sources(root)
    add_sources(url_sources, gsc_sources)
    redirects = load_redirects(root)
    for row in redirects:
        if row["source_url"]:
            url_sources[row["source_url"]].add("redirect_source")
        if row["destination_url"]:
            url_sources[row["destination_url"]].add("redirect_destination")
    url_sources[f"{ORIGIN}/"].add("homepage")

    records: dict[str, dict[str, Any]] = {}
    pending = set(url_sources)
    while pending and len(records) < args.limit:
        batch = sorted(pending)[: max(0, args.limit - len(records))]
        pending.difference_update(batch)
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            futures = [executor.submit(fetch_one, url) for url in batch]
            for future in as_completed(futures):
                url, record = future.result()
                records[url] = record
                location = record.get("location", "")
                if location:
                    target = normalize_url(urljoin(url, location))
                    if target:
                        url_sources[target].add("redirect_hop")
                        if target not in records:
                            pending.add(target)
                for target in record.get("internal_urls", []):
                    url_sources[target].add("internal_link")
                    if target not in records:
                        pending.add(target)

    for url, record in records.items():
        record["sources"] = sorted(url_sources.get(url, set()))
        record["gsc"] = gsc_metrics.get(url, {})

    text_hash_groups: dict[str, list[str]] = defaultdict(list)
    for url, record in records.items():
        if record.get("status") == 200 and record.get("text_hash"):
            text_hash_groups[record["text_hash"]].append(url)
    duplicate_groups = [sorted(group) for group in text_hash_groups.values() if len(group) > 1]

    summary = {
        "generated_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "live_sitemap_urls": len(sitemap_sources),
        "gsc_known_urls": len(gsc_sources),
        "redirect_rules": len(redirects),
        "literal_redirect_rules": sum(1 for row in redirects if row["literal"]),
        "crawled_urls": len(records),
        "status_counts": dict(sorted({str(status): sum(1 for record in records.values() if record.get("status") == status) for status in set(record.get("status") for record in records.values())}.items())),
        "exact_duplicate_groups": len(duplicate_groups),
    }
    payload = {
        "summary": summary,
        "sitemap_documents": {url: sha256(xml) for url, xml in raw_sitemaps.items()},
        "redirects": redirects,
        "duplicate_groups": duplicate_groups,
        "records": records,
    }
    (output / "live-crawl-evidence.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
