"""Verify the C-08 copy gates on the rendered production DOM."""
import json, os, re, sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import analyse_routes as A

A.BASE = os.environ.get('C08_BASE', 'http://localhost:3380')
BUILT = ['container-houses', 'prefab-container-homes']
failures, results = [], {}


def fail(m):
    failures.append(m)


def blocks_of(panel):
    """Top-level children of the description panel, in order."""
    out = []
    for m in re.finditer(r'<(h2|h3|p|img|ul|ol|table|figure)\b[^>]*>', panel):
        out.append((m.start(), m.group(1).lower()))
    return out


for slug in A.ROUTES:
    raw = A.fetch(slug)
    body = A.strip(raw).split('<body', 1)[1]
    panel = A.description_panel(body)
    seq = blocks_of(panel)

    imgs = [i for i, (_p, t) in enumerate(seq) if t == 'img']
    # adjacency: a copy paragraph immediately before AND after every image
    bad_adj = []
    for i in imgs:
        before = seq[i - 1][1] if i > 0 else None
        after = seq[i + 1][1] if i + 1 < len(seq) else None
        if before not in ('p',) or after not in ('p',):
            bad_adj.append((i, before, after))

    # anchors, in order, with their containing paragraph
    anchors = []
    for m in re.finditer(r'<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)</a>', panel):
        anchors.append({'href': m.group(1), 'anchor': A.text_of(m.group(2)), 'pos': m.start()})

    # link isolation: every anchor must have body text before AND after it
    # inside the same paragraph node
    lonely = []
    for p_m in re.finditer(r'<p\b[^>]*>([\s\S]*?)</p>', panel):
        inner = p_m.group(1)
        if '<a ' not in inner:
            continue
        for a_m in re.finditer(r'<a\b[^>]*>[\s\S]*?</a>', inner):
            before = A.text_of(inner[:a_m.start()])
            after = A.text_of(inner[a_m.end():])
            if not before or not after:
                lonely.append({'anchor': A.text_of(a_m.group(0)),
                               'textBefore': before[-40:], 'textAfter': after[:40]})
    # an anchor whose whole paragraph is just the link
    for p_m in re.finditer(r'<p\b[^>]*>([\s\S]*?)</p>', panel):
        inner = p_m.group(1).strip()
        if re.fullmatch(r'<a\b[^>]*>[\s\S]*?</a>', inner):
            lonely.append({'anchor': A.text_of(inner), 'wholeParagraphIsTheLink': True})

    # an image immediately followed by a link-only node
    img_then_link = 0
    for i in imgs:
        if i + 1 < len(seq):
            start = seq[i + 1][0]
            end = seq[i + 2][0] if i + 2 < len(seq) else len(panel)
            nxt = panel[start:end]
            if '<a ' in nxt and not A.text_of(re.sub(r'<a\b[^>]*>[\s\S]*?</a>', '', nxt)):
                img_then_link += 1

    h2 = len(re.findall(r'<h2\b', panel))
    h3 = len(re.findall(r'<h3\b', panel))
    h1_page = len(re.findall(r'<h1\b', body, re.I))
    h1_panel = len(re.findall(r'<h1\b', panel, re.I))

    words = len(A.text_of(panel).split())
    heads = [A.text_of(m.group(2)) for m in re.finditer(r'<(h2|h3)[^>]*>([\s\S]*?)</\1>', panel)]

    results[slug] = {
        'renderedWordsL23': words, 'h2': h2, 'h3': h3,
        'h1Page': h1_page, 'h1Panel': h1_panel,
        'images': len(imgs), 'badAdjacency': bad_adj,
        'anchors': [{'anchor': a['anchor'], 'href': a['href']} for a in anchors],
        'lonelyLinks': lonely, 'imageThenLinkOnly': img_then_link,
        'headings': heads,
    }

    if h1_page != 1:
        fail(f'{slug}: {h1_page} <h1>, expected 1')
    if h1_panel:
        fail(f'{slug}: <h1> inside the description panel')
    if bad_adj:
        fail(f'{slug}: {len(bad_adj)} image(s) without a paragraph both sides {bad_adj}')
    if lonely:
        fail(f'{slug}: {len(lonely)} link(s) not surrounded by prose {lonely}')
    if img_then_link:
        fail(f'{slug}: {img_then_link} link-only node(s) directly beneath an image')

# anchor-text uniqueness across the whole cluster
seen = {}
for slug, r in results.items():
    for a in r['anchors']:
        seen.setdefault(a['anchor'].lower(), []).append(slug)
dupes = {k: v for k, v in seen.items() if len(v) > 1}
if dupes:
    for k, v in dupes.items():
        fail(f'anchor text repeats across routes: "{k}" on {v}')

print(f'{"route":32s}{"words":>7s}{"H1":>4s}{"h2":>4s}{"h3":>4s}{"imgs":>6s}'
      f'{"links":>7s}{"badAdj":>8s}{"lonely":>8s}')
for slug, r in results.items():
    print(f'{slug:32s}{r["renderedWordsL23"]:>7}{r["h1Page"]:>4}{r["h2"]:>4}{r["h3"]:>4}'
          f'{r["images"]:>6}{len(r["anchors"]):>7}{len(r["badAdjacency"]):>8}{len(r["lonelyLinks"]):>8}')

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'copy-verification.json'),
          'w', encoding='utf-8') as fh:
    json.dump(results, fh, indent=1, ensure_ascii=False)

print()
if failures:
    print(f'{len(failures)} GATE FAILURE(S):')
    for f in failures:
        print('  x', f)
else:
    print('ALL COPY GATES PASS')
sys.exit(1 if failures else 0)
