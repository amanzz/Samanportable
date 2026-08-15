# -*- coding: utf-8 -*-
"""PC-04 v1.4: exact diff between the LIVE porta-cabin-with-toilet.json gallery
arrays and the new 36-slot manifest from the build prompt, per size. Written
because section 5 of the ticket claims only one filename changes
(workspace-interior -> space-interior) and the other 30 outputs "keep their
existing live filenames" -- that claim needs checking against the real JSON
before I silently accept it and only handle the one rename it names."""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'data', 'products', 'porta-cabin-with-toilet.json')

NEW_VIEWS = ['hero-view', 'front-angle', 'elevated-view', 'end-elevation', 'space-interior', 'rear-interior']


def view_of(src):
    fn = src.rsplit('/', 1)[-1]
    m = re.match(r'porta-cabin-with-toilet-[\w]+-(.+)\.webp$', fn)
    return m.group(1) if m else fn


data = json.load(open(DATA, encoding='utf-8'))

total_kept = total_new = total_dropped = 0
for v in data['variants']:
    size = v['sizeSlug']
    old_views = [view_of(im['src']) for im in v['images']]
    old_set = set(old_views)
    new_set = set(NEW_VIEWS)
    kept = old_set & new_set
    dropped = old_set - new_set
    added = new_set - old_set
    total_kept += len(kept)
    total_new += len(added)
    total_dropped += len(dropped)
    print('%-6s  live slots: %-45s' % (size, ', '.join(old_views)))
    print('        new  slots: %-45s' % ', '.join(NEW_VIEWS))
    print('        kept (same view name, same path): %s' % (sorted(kept) or '(none)'))
    print('        DROPPED from gallery (old file stays on disk unless deleted): %s' % (sorted(dropped) or '(none)'))
    print('        NEW to this size (no live file under that view name before): %s' % (sorted(added) or '(none)'))
    print()

print('TOTALS across 6 sizes: %d view-slots kept at the same output path, %d dropped, %d newly introduced'
      % (total_kept, total_dropped, total_new))
print('(ticket section 5 claims: 30 kept unchanged, 6 renamed (workspace-interior -> space-interior), 0 dropped)')
