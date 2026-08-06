"""Convert the approved C-08 copy packs to descriptionHtml, verbatim.

L4: not a character of prose changes. This converts MARKUP only —
`### H2 · Title` to `<h2>Title</h2>`, `**bold**` to `<strong>`,
`[anchor](/href)` to `<a>`, blank-line-separated runs to `<p>` — and swaps each
`**[IMAGE n · …]**` marker for the chosen 16:9 asset.

The `H2 · ` / `H3 · ` prefixes are authoring notation, not content, and are
stripped exactly as the 02 Aug standing rule requires band counts to be measured
on rendered DOM text with authoring notation removed.

Every conversion is proved: the rendered text is compared back against the
source prose with notation stripped, and any difference is a hard failure.
"""
import html as htmllib
import io, json, os, re, sys

sys.stdout.reconfigure(encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = r'C:\tmp\saman-c08-e2-20260805'
REPORTS = r'D:\Project-shekhar\reports'

# Slot -> (size, source view token). Chosen against the assets that actually
# exist; see the report for the one deviation and why it was unavoidable.
PAGES = {
    'container-houses': {
        'file': 'C08-COPY-01-container-houses-hub-05Aug2026.md',
        'slots': [
            ('40x12', 'E06'),   # 1 exterior hero, 40x10 or 40x12
            ('40x10', 'I02'),   # 2 interior, living or kitchen, larger size
            ('20x12', 'E03'),   # 3 exterior, different size and colour from 1
            ('20x8', 'I04'),    # 4 interior, different room type from 2
        ],
    },
    'prefab-container-homes': {
        'file': 'C08-COPY-02-prefab-container-homes-05Aug2026.md',
        'slots': [
            ('40x10', 'E03'),   # 1 exterior hero, 40x10 as instructed
            ('20x10', 'I02'),   # 2 interior kitchen/dining — SIZE DEVIATES, see report
            ('20x8', 'E02'),    # 3 exterior, different angle and size, 20x8 as instructed
            ('40x12', 'I03'),   # 4 interior bedroom, 40x12 as instructed
        ],
    },
}

IMAGE_MARKER = re.compile(r'^\*\*\[IMAGE (\d)[^\]]*\]\*\*$')
HEADING = re.compile(r'^###\s+(H[23])\s+·\s+(.*)$')
FAQ_H3 = re.compile(r'^\*\*H3\s+·\s+(.*?)\*\*$')


def body_lines(path):
    """Only the approved body copy: from `## BODY COPY` to the next `---`/`##`."""
    text = io.open(path, encoding='utf-8').read()
    start = text.index('## BODY COPY')
    start = text.index('\n', start) + 1
    rest = text[start:]
    for stop in ('\n---\n', '\n## LINK MANIFEST', '\n## MEASUREMENT'):
        i = rest.find(stop)
        if i != -1:
            rest = rest[:i]
    return rest.strip('\n').split('\n')


def inline(md):
    """Inline markdown -> HTML. Escapes first so copy can never inject markup."""
    out = htmllib.escape(md, quote=False)
    out = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                 lambda m: f'<a href="{htmllib.escape(m.group(2), quote=True)}">{m.group(1)}</a>',
                 out)
    out = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', out)
    out = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', out)
    return out


def to_blocks(lines):
    """[(kind, payload)] where kind is h2 | h3 | p | image."""
    blocks, buf = [], []

    def flush():
        if buf:
            blocks.append(('p', ' '.join(buf).strip()))
            buf.clear()

    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            flush()
            continue
        m = IMAGE_MARKER.match(line.strip())
        if m:
            flush()
            blocks.append(('image', int(m.group(1))))
            continue
        m = FAQ_H3.match(line.strip())
        if m:
            flush()
            blocks.append(('h3', m.group(1)))
            continue
        m = HEADING.match(line.strip())
        if m:
            flush()
            blocks.append((m.group(1).lower(), m.group(2)))
            continue
        buf.append(line.strip())
    flush()
    return blocks


def plain(md):
    """Source prose with markup notation removed, for the verbatim proof."""
    t = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', md)
    t = t.replace('**', '').replace('*', '')
    return re.sub(r'\s+', ' ', t).strip()


def main():
    derived = json.load(open(os.path.join(HERE, 'step-b-derived.json'), encoding='utf-8'))
    summary = {}

    for slug, cfg in PAGES.items():
        lines = body_lines(os.path.join(REPORTS, cfg['file']))
        blocks = to_blocks(lines)

        picks = []
        for size, token in cfg['slots']:
            rec = next(r for r in derived
                       if r['route'] == slug and r['sizeSlug'] == size
                       and r['sourceViewToken'] == token)
            picks.append(rec)

        parts, used_images = [], []
        for kind, payload in blocks:
            if kind == 'image':
                rec = picks[payload - 1]
                src = '/' + rec['target'].split('public/', 1)[1]
                parts.append(
                    f'<img src="{src}" alt="" width="1200" height="675"'
                    f' data-c08-info-image="true" />'
                )
                used_images.append(rec)
            elif kind in ('h2', 'h3'):
                parts.append(f'<{kind}>{inline(payload)}</{kind}>')
            else:
                parts.append(f'<p>{inline(payload)}</p>')
        description_html = ''.join(parts)

        # ---- VERBATIM PROOF -------------------------------------------------
        # Block tags become a space (they separate words); INLINE tags become
        # nothing at all, because `it is *repeated*.` must read back as
        # "repeated." and not "repeated ." — a space there would be a false
        # mismatch, and worse, hiding it would mask a real one.
        rendered = re.sub(r'</?(?:a|strong|em|span|b|i)\b[^>]*>', '', description_html)
        rendered = re.sub(r'<[^>]+>', ' ', rendered)
        rendered = htmllib.unescape(rendered)
        rendered = re.sub(r'\s+', ' ', rendered).strip()
        source = ' '.join(plain(p) for k, p in blocks if k != 'image')
        source = re.sub(r'\s+', ' ', source).strip()
        if rendered != source:
            for i, (a, b) in enumerate(zip(rendered, source)):
                if a != b:
                    raise SystemExit(f'{slug}: VERBATIM MISMATCH at {i}\n'
                                     f'  rendered …{rendered[max(0,i-60):i+60]}…\n'
                                     f'  source   …{source[max(0,i-60):i+60]}…')
            raise SystemExit(f'{slug}: VERBATIM LENGTH MISMATCH '
                             f'{len(rendered)} vs {len(source)}')

        # ---- write ----------------------------------------------------------
        path = os.path.join(REPO, 'src', 'data', 'products', slug + '.json')
        data = json.load(open(path, encoding='utf-8'))
        data['descriptionHtml'] = description_html
        # The copy now carries its own images at the author's marked slots, so the
        # automatic injector must not add a second set on top.
        data.pop('infoImages', None)
        with io.open(path, 'w', encoding='utf-8', newline='\n') as fh:
            json.dump(data, fh, indent=2, ensure_ascii=False)
            fh.write('\n')

        anchors = re.findall(r'<a href="([^"]+)">([^<]+)</a>', description_html)
        summary[slug] = {
            'sourceFile': cfg['file'],
            'blocks': {k: sum(1 for kk, _ in blocks if kk == k) for k in ('h2', 'h3', 'p', 'image')},
            'htmlChars': len(description_html),
            'renderedWords': len(source.split()),
            'anchors': [{'anchor': a, 'href': h} for h, a in anchors],
            'images': [{'slot': i + 1, 'size': r['sizeSlug'], 'token': r['sourceViewToken'],
                        'view': r['view'], 'filename': r['filename']}
                       for i, r in enumerate(used_images)],
        }
        print(f'{slug}: VERBATIM OK · {summary[slug]["blocks"]} · '
              f'{summary[slug]["renderedWords"]} body words · {len(anchors)} links')

    with io.open(os.path.join(HERE, 'copy-build-summary.json'), 'w', encoding='utf-8') as fh:
        json.dump(summary, fh, indent=1, ensure_ascii=False)
    print('\nwrote copy-build-summary.json')


if __name__ == '__main__':
    main()
