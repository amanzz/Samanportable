#!/usr/bin/env node
/**
 * CO-06 Multi-Story Container Office - rendered page verification.
 *
 *   node verify-co-06.mjs <preview-url> [--control CO-06-verify-control-v1.json]
 *
 * Fetches the rendered page and fails if any approved copy string, asset path,
 * internal link or metadata field is missing, or if a forbidden pattern is present.
 * Exit code 0 means every check passed. Paste the full output into the PR.
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const url = args[0];
if (!url) {
  console.error("usage: node verify-co-06.mjs <preview-url> [--control <file>]");
  process.exit(2);
}
const ci = args.indexOf("--control");
const controlPath = ci !== -1 ? args[ci + 1] : "CO-06-verify-control-v1.json";
const control = JSON.parse(readFileSync(controlPath, "utf8"));

let pass = 0;
let fail = 0;
const failures = [];

function check(label, ok, detail) {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    failures.push(label + (detail ? ` :: ${detail}` : ""));
    console.log(`  FAIL  ${label}${detail ? ` :: ${detail}` : ""}`);
  }
}

function section(name) {
  console.log(`\n== ${name} ==`);
}

// Normalise the rendered HTML to plain visible text so that a string check is not
// defeated by markup, entities or line wrapping.
function toText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function squash(s) {
  return s.replace(/\s+/g, " ").trim();
}

const res = await fetch(url, { redirect: "follow" });
if (res.status !== 200) {
  console.error(`page did not return 200: ${res.status} ${url}`);
  process.exit(1);
}
const html = await res.text();
const text = toText(html);
const markup = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ");

// ---------------------------------------------------------------- metadata
section("Metadata");
const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
check("SEO title exact", titleMatch && squash(toText(titleMatch[1])) === control.seo_title,
  titleMatch ? squash(toText(titleMatch[1])) : "no <title>");
const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);
check("Meta description exact", descMatch && squash(descMatch[1]) === control.meta_description,
  descMatch ? squash(descMatch[1]) : "no meta description");
const canonMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
check("Canonical self referencing", canonMatch && canonMatch[1] === control.canonical,
  canonMatch ? canonMatch[1] : "no canonical");
const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => squash(toText(m[1])));
check("Exactly one H1", h1s.length === 1, `found ${h1s.length}`);
check("H1 exact", h1s[0] === control.h1, h1s[0]);
check("No noindex", !/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html));

// ---------------------------------------------------------------- copy
section("Approved copy, verbatim");
for (const [label, value] of Object.entries(control.copy)) {
  check(`copy: ${label}`, text.includes(squash(value)), squash(value).slice(0, 60) + "...");
}

// ---------------------------------------------------------- hero feature cells
section("Hero feature cells");
for (const [k, v] of control.feature_cells_first_size) {
  check(`feature cell: ${k}`, text.includes(squash(k)) && text.includes(squash(v)));
}
check("Feature-cell control has five rows only", control.feature_cells_first_size.length === 5);
check("Superseded hero-table row is absent", !text.includes("Six G+1 footprints, 20 x 8 ft to 40 x 32 ft"));
for (const chip of control.size_chips) {
  check(`size chip: ${chip}`, text.includes(squash(chip)));
}
const heroStart = markup.indexOf("<h1");
const heroEnd = markup.indexOf("pc-divider1", heroStart);
const heroMarkup = heroStart >= 0 && heroEnd > heroStart ? markup.slice(heroStart, heroEnd) : "";
check("No hand-authored table in the hero", heroMarkup.length > 0 && !/<table\b/i.test(heroMarkup));

// ---------------------------------------------------------- v1.2 component map
section("Addendum v1.2 component map");
const railCards = (markup.match(/data-related-product-rail-card="true"/g) || []).length;
check("Three related-product rail cards", railCards === 3, `${railCards} cards`);
for (const imagePath of control.related_card_images) {
  check(
    `related card image: ${imagePath}`,
    markup.includes(imagePath) || markup.includes(encodeURIComponent(imagePath))
  );
}
check("No related-card icon fallback", !markup.includes('data-rail-fallback="true"'));

const rteStart = markup.indexOf('class="pc-rte"');
const rteEnd = markup.indexOf("pc-divider2", rteStart);
const rteMarkup = rteStart >= 0 && rteEnd > rteStart ? markup.slice(rteStart, rteEnd) : "";
check("Section 2 split card uses the shared component", rteMarkup.includes('class="saman-s2-split"'));
const contactLinks = (rteMarkup.match(/href="https:\/\/www\.samanportable\.com\/contact"/g) || []).length;
check("Section 2 has exactly two contact links", contactLinks === 2, `${contactLinks} links`);

const sizeSlugs = Object.keys(control.variant_bullet_counts);
for (let i = 0; i < sizeSlugs.length; i += 1) {
  const sizeSlug = sizeSlugs[i];
  const panelStart = markup.indexOf(`id="app-panel-${sizeSlug}"`);
  const panelEnd = i + 1 < sizeSlugs.length
    ? markup.indexOf(`id="app-panel-${sizeSlugs[i + 1]}"`, panelStart + 1)
    : markup.indexOf("</section>", panelStart);
  const panelMarkup = panelStart >= 0 && panelEnd > panelStart ? markup.slice(panelStart, panelEnd) : "";
  const listItems = (panelMarkup.match(/<li\b/g) || []).length;
  check(`${sizeSlug} has five list items`, listItems === control.variant_bullet_counts[sizeSlug], `${listItems} items`);
  check(`${sizeSlug} facts stay in one column`, !panelMarkup.includes("sm:grid-cols-2"));
}
const firstPanelStart = markup.indexOf('id="app-panel-20x8"');
const firstPanelEnd = markup.indexOf('id="app-panel-20x16"', firstPanelStart + 1);
const firstPanel = firstPanelStart >= 0 && firstPanelEnd > firstPanelStart
  ? markup.slice(firstPanelStart, firstPanelEnd)
  : "";
check(
  "Active GA board occupies the Explorer image slot",
  firstPanel.indexOf("/ga/multi-story-container-office-ga-plan-20x8.webp") >= 0 &&
    firstPanel.indexOf("/ga/multi-story-container-office-ga-plan-20x8.webp") < firstPanel.indexOf("<h2")
);

// ---------------------------------------------------------------- assets
section("Assets");
for (const [label, paths] of Object.entries(control.assets)) {
  const missing = paths.filter((p) => !html.includes(p));
  check(`${label} (${paths.length})`, missing.length === 0,
    missing.length ? `missing ${missing.length}: ${missing.slice(0, 3).join(", ")}` : "");
}
const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const noDims = imgTags.filter((t) => !/\bwidth=/.test(t) || !/\bheight=/.test(t));
check("Every <img> carries width and height", noDims.length === 0, `${noDims.length} without both`);
const longAlt = [...html.matchAll(/alt=["']([^"']*)["']/gi)].map((m) => m[1]).filter((a) => a.length >= 125);
check("Every alt under 125 characters", longAlt.length === 0, `${longAlt.length} too long`);

// ---------------------------------------------------------------- links
section("Internal links");
for (const link of control.links) {
  const present = html.includes(link.url);
  check(`link present: ${link.url}`, present);
  if (present) {
    const r = await fetch(link.url, { method: "GET", redirect: "manual" });
    check(`link returns 200 without redirect: ${link.url}`, r.status === 200, `status ${r.status}`);
  }
}
// The hub URL also appears in the site nav, the breadcrumb and the footer on every
// page of the cluster, so count it only inside the article body.
const bodyOnly = html
  .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
  .replace(/<header[\s\S]*?<\/header>/gi, " ")
  .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
  .replace(/<[^>]*breadcrumb[\s\S]*?<\/(ol|ul|div|nav)>/gi, " ");
const hubRe = new RegExp(`href=["']${control.hub_url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "g");
const hubCount = (bodyOnly.match(hubRe) || []).length;
check("Hub linked once in the article body", hubCount === 1, `${hubCount} occurrences in body`);
for (const forbidden of control.forbidden_links) {
  check(`forbidden link absent: ${forbidden}`, !html.includes(forbidden));
}

// ---------------------------------------------------------------- forbidden content
section("Forbidden content");
for (const pattern of control.forbidden_text) {
  check(`absent: ${pattern}`, !text.toLowerCase().includes(pattern.toLowerCase()));
}
check("No em dash in rendered copy", !text.includes("—"));
check("No en dash in rendered copy", !text.includes("–"));
check("No aggregateRating in structured data", !/aggregateRating/.test(html));
check("No review schema", !/"@type"\s*:\s*"Review"/.test(html));

// ---------------------------------------------------------------- template lock
section("Template lock");
const calcIdx = html.search(/<section[^>]+class=["'][^"']*calc-entry/i);
check("calc-entry band present", calcIdx !== -1);
if (calcIdx !== -1) {
  const before = html.slice(Math.max(0, calcIdx - 4000), calcIdx);
  const strayFigure = /<figure\b|<img\b/i.test(before.split(/<hr[^>]*saman-section-divider[^>]*>/i).pop() || "");
  check("No standalone image block between the last size section and calc-entry", !strayFigure);
  check("calc-entry photo swapped to the CO-06 band asset",
    html.includes(control.calc_band_marker));
  check("calc-entry band keeps width 1926 and height 817",
    /width=["']1926["']/.test(html) && /height=["']817["']/.test(html));
}
check("Four product detail tabs present in the DOM",
  control.tabs.every((t) => text.includes(t)), control.tabs.join(", "));

// ---------------------------------------------------------------- summary
console.log("\n----------------------------------------");
console.log(`checks passed : ${pass}`);
console.log(`checks failed : ${fail}`);
if (fail) {
  console.log("\nFAILURES");
  for (const f of failures) console.log("  - " + f);
}
process.exit(fail ? 1 : 0);
