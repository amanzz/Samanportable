"""Verify every C08-E4 gate against the rendered production DOM."""
import json, os, re, sys, urllib.request

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import analyse_routes as A

A.BASE = os.environ.get('C08_BASE', 'http://localhost:3360')
SUBPAGES = [s for s in A.ROUTES if s != 'container-houses']
results, failures = {}, []


def fail(msg):
    failures.append(msg)


for slug in A.ROUTES:
    raw = A.fetch(slug)
    html = A.strip(raw)
    body = html.split('<body', 1)[1]
    panel = A.description_panel(body)

    # --- 1 · gallery track and thumbnail count ---------------------------------
    track = re.search(r'class="grid grid-cols-(\d) gap-2"', body)
    cols = int(track.group(1)) if track else None
    strip_m = re.search(r'<div class="grid grid-cols-\d gap-2">([\s\S]*?)\n?\s*</div>\s*</div>', body)
    # count the direct <button> children of the strip
    strip_html = body[track.start():] if track else ''
    depth, end = 0, 0
    for m in re.finditer(r'<div\b|</div>', strip_html):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            end = m.end()
            break
    strip_html = strip_html[:end]
    thumbs = len(re.findall(r'<button\b', strip_html))
    thumb_imgs = len(re.findall(r'<img\b', strip_html))
    # a placeholder/empty cell would be a child that is not a button, or a button
    # with no image inside it
    empty_cells = thumbs - thumb_imgs

    # --- 2 · in-body image adjacency -------------------------------------------
    seq = [(m.start(), m.group(1))
           for m in re.finditer(r'<(img|p|h2|h3|h4|ul|ol|table|figure|div)\b[^>]*>', panel)]
    img_pos = [i for i, (_p, t) in enumerate(seq) if t == 'img']
    adjacent = 0
    for a, b in zip(img_pos, img_pos[1:]):
        between = [t for _p, t in seq[a + 1:b]]
        if not any(t in ('p', 'h2', 'h3', 'h4', 'ul', 'ol', 'table') for t in between):
            adjacent += 1
    # Count rendered Info images by their SRC, not by the data- marker:
    # OptimizedContent rewrites every content <img> and keeps only a safe
    # attribute set, so the marker survives in __NEXT_DATA__ but never in the DOM.
    injected = len(re.findall(r'<img[^>]*/info/[^>]*>', body))
    paragraphs = len(re.findall(r'<p\b', panel))

    # --- 3 · video surfaces -----------------------------------------------------
    # VIDEO iframes only. The site-wide Google Tag Manager <noscript> iframe
    # (0x0, display:none) is pre-existing, unrelated to L18 and out of scope.
    iframes = len(re.findall(r'<iframe[^>]*(?:youtube|youtu\.be|vimeo)[^>]*>', body, re.I))
    gtm_iframes = len(re.findall(r'<iframe[^>]*googletagmanager[^>]*>', body, re.I))
    videoobj = len(re.findall(r'"@type"\s*:\s*"VideoObject"', raw))

    # --- 4 - exactly one H1 per route (E5 item 1) ------------------------------
    h1s = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', m.group(1))).strip()
           for m in re.finditer(r'<h1[^>]*>([\s\S]*?)</h1>', body, re.I)]
    h1_in_panel = len(re.findall(r'<h1', panel, re.I))
    yt_refs = len(re.findall(r'youtube(?:-nocookie)?\.com', raw))
    preconnect = len(re.findall(r'rel="preconnect"[^>]*youtube', raw))

    results[slug] = {
        'cols': cols, 'thumbs': thumbs, 'thumbImgs': thumb_imgs, 'emptyCells': empty_cells,
        'panelImages': len(img_pos), 'injected': injected, 'adjacentPairs': adjacent,
        'paragraphs': paragraphs, 'iframes': iframes, 'videoObject': videoobj,
        'ytRefs': yt_refs, 'preconnectOnLoad': preconnect, 'gtmIframes': gtm_iframes,
        'h1Count': len(h1s), 'h1Text': h1s, 'h1InDescriptionPanel': h1_in_panel,
    }

    # E5 item 3, gate amended: the five-thumbnail rule governs the five SUBPAGES.
    # The hub carries a sixth cell because of the video facade, which is correct
    # and intended, so its expectation is six.
    expected_thumbs = 6 if slug == 'container-houses' else 5
    if thumbs != expected_thumbs:
        fail(f'{slug}: {thumbs} thumbnails, expected {expected_thumbs}'
             + (' (hub = 5 photos + video facade)' if slug == 'container-houses' else ''))
    if cols != expected_thumbs:
        fail(f'{slug}: grid-cols-{cols} for {thumbs} thumbs — reserved slot')
    if empty_cells:
        fail(f'{slug}: {empty_cells} empty gallery cell(s)')
    if adjacent:
        fail(f'{slug}: {adjacent} adjacent in-body image pair(s)')
    if iframes:
        fail(f'{slug}: {iframes} VIDEO iframe(s) in the initial DOM')
    if preconnect:
        fail(f'{slug}: youtube preconnect present on load')
    if slug in SUBPAGES and videoobj:
        fail(f'{slug}: {videoobj} VideoObject block(s) on a subpage')
    if slug == 'container-houses' and videoobj != 1:
        fail(f'hub: {videoobj} VideoObject blocks, expected exactly 1')
    if len(h1s) != 1:
        fail(f'{slug}: {len(h1s)} <h1> elements, expected exactly 1 - {h1s}')
    if h1_in_panel:
        fail(f'{slug}: {h1_in_panel} <h1> inside the description panel; every description heading must be h2')

print(f'{"route":32s}{"cols":>5s}{"thumbs":>7s}{"empty":>6s}{"paras":>6s}'
      f'{"16:9":>5s}{"adj":>4s}{"iframe":>7s}{"VideoObj":>9s}{"ytRefs":>7s}')
for slug, r in results.items():
    print(f'{slug:32s}{r["cols"]:>5}{r["thumbs"]:>7}{r["emptyCells"]:>6}{r["paragraphs"]:>6}'
          f'{r["injected"]:>5}{r["adjacentPairs"]:>4}{r["iframes"]:>8}{r["videoObject"]:>9}'
          f'{r["h1Count"]:>4}{r["h1InDescriptionPanel"]:>10}')

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'e4-verification.json'),
          'w', encoding='utf-8') as fh:
    json.dump(results, fh, indent=1, ensure_ascii=False)

print()
if failures:
    print(f'{len(failures)} GATE FAILURE(S):')
    for f in failures:
        print('  ✗', f)
else:
    print('ALL E4 GATES PASS')
sys.exit(1 if failures else 0)
