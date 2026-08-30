import assert from 'node:assert/strict';
import {
  CHILDREN,
  GUIDE,
  HUB,
  RETIRED_HUB,
  anchorIntent,
  extractRelevantAnchors,
  validateSnapshot,
} from './validate-pc01-keyword-ownership.mjs';

const direct = (requested) => ({
  requested,
  status: 200,
  redirects: [],
  finalPath: requested,
  finalStatus: 200,
  canonical: requested,
  robots: 'index, follow',
});

const page = (pathname) => ({
  pathname,
  status: 200,
  canonical: pathname,
  robots: 'index, follow',
  html: '',
});

function fixtureAnchor(sourcePage, label, href, gatedPaths = new Set()) {
  const row = extractRelevantAnchors(`<main><a href="${href}">${label}</a></main>`, sourcePage, gatedPaths)[0];
  assert(row, `fixture anchor was not relevant: ${label} -> ${href}`);
  return { ...row, intent: anchorIntent(row), occurrenceScope: 'contextual', occurrenceCount: 1 };
}

function healthySnapshot() {
  const destinations = [direct(HUB), direct(GUIDE), ...CHILDREN.map((child) => direct(child.href))];
  const byPath = new Map(destinations.map((row) => [row.requested, row]));
  const anchors = [
    ...CHILDREN.map((child) => fixtureAnchor(HUB, child.name, child.href)),
    ...CHILDREN.map((child) => fixtureAnchor(child.href, 'Porta Cabins Range', HUB)),
    fixtureAnchor(GUIDE, 'Explore the Porta Cabins range', HUB),
    fixtureAnchor(HUB, 'Porta Cabin price guide', GUIDE),
  ].map((row) => ({ ...row, destination: byPath.get(row.pathname) }));
  return {
    sitemapPageCount: CHILDREN.length + 2,
    pages: [page(HUB), page(GUIDE), ...CHILDREN.map((child) => page(child.href))],
    anchors,
    destinations,
    sourceMutations: [],
  };
}

const clone = (value) => structuredClone(value);
const conditionSet = (snapshot) => new Set(validateSnapshot(snapshot).map((failure) => failure.condition));

const baseline = healthySnapshot();
assert.deepEqual(validateSnapshot(baseline), [], 'healthy ownership fixture must pass');

const mutations = [
  {
    name: 'retired hub href',
    condition: 1,
    mutate(snapshot) {
      const row = fixtureAnchor('/support', 'Porta Cabin', RETIRED_HUB);
      snapshot.anchors.push({ ...row, destination: { ...direct(RETIRED_HUB), status: 301, redirects: [{ status: 301, to: HUB }], finalPath: HUB } });
    },
  },
  {
    name: 'broad anchor to child',
    condition: 2,
    mutate(snapshot) {
      const child = CHILDREN[0];
      snapshot.anchors.push({ ...fixtureAnchor('/support', 'Portable Cabin', child.href), destination: direct(child.href) });
    },
  },
  {
    name: 'bare price anchor to guide',
    condition: 6,
    mutate(snapshot) {
      snapshot.anchors.push({ ...fixtureAnchor('/support', 'Porta Cabin prices', GUIDE), destination: direct(GUIDE) });
    },
  },
  {
    name: 'unqualified local anchor',
    condition: 7,
    mutate(snapshot) {
      const target = '/porta-cabin-in-noida';
      snapshot.destinations.push(direct(target));
      snapshot.anchors.push({ ...fixtureAnchor('/support', 'Portable Cabin', target), destination: direct(target) });
    },
  },
  {
    name: 'broad product-category archive anchor',
    condition: 3,
    mutate(snapshot) {
      const target = '/product-category/porta-cabins';
      snapshot.destinations.push(direct(target));
      snapshot.anchors.push({ ...fixtureAnchor('/support', 'Porta Cabins', target), destination: direct(target) });
    },
  },
  {
    name: 'missing child hub return',
    condition: 10,
    mutate(snapshot) {
      snapshot.anchors = snapshot.anchors.filter((row) => !(row.sourcePage === CHILDREN[0].href && row.pathname === HUB));
    },
  },
  {
    name: 'wrong hub child slug',
    condition: 9,
    mutate(snapshot) {
      snapshot.anchors = snapshot.anchors.filter((row) => !(row.sourcePage === HUB && row.pathname === CHILDREN[0].href));
      const wrong = `${HUB}/double-storey-porta-cabin`;
      snapshot.anchors.push({ ...fixtureAnchor(HUB, CHILDREN[0].name, wrong), destination: { ...direct(wrong), status: 404, finalStatus: 404 } });
    },
  },
  {
    name: 'child self-link',
    condition: 11,
    mutate(snapshot) {
      const child = CHILDREN[0];
      snapshot.anchors.push({ ...fixtureAnchor(child.href, child.name, child.href), destination: direct(child.href) });
    },
  },
  {
    name: 'gated planned link',
    condition: 4,
    mutate(snapshot) {
      const target = '/product/portable-office/modern-office-cabin';
      const row = fixtureAnchor('/support', 'Porta Cabin option', target, new Set([target]));
      snapshot.anchors.push({ ...row, destination: direct(target) });
    },
  },
  {
    name: 'redirecting child destination',
    condition: 14,
    mutate(snapshot) {
      const child = CHILDREN[0];
      const bad = { ...direct(child.href), status: 301, redirects: [{ status: 301, to: HUB }], finalPath: HUB };
      snapshot.destinations = snapshot.destinations.map((row) => row.requested === child.href ? bad : row);
      snapshot.anchors = snapshot.anchors.map((row) => row.pathname === child.href ? { ...row, destination: bad } : row);
    },
  },
  {
    name: 'validator source mutation',
    condition: 15,
    mutate(snapshot) {
      snapshot.sourceMutations = ['src/lib/staticContent.ts'];
    },
  },
];

for (const mutation of mutations) {
  const snapshot = clone(baseline);
  mutation.mutate(snapshot);
  assert(conditionSet(snapshot).has(mutation.condition), `${mutation.name} did not fail condition ${mutation.condition}`);
  console.log(`PASS mutation: ${mutation.name} -> condition ${mutation.condition}`);
}

console.log(`PASS: ${mutations.length}/${mutations.length} PC-01 keyword-ownership mutations rejected.`);
