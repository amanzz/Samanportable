# -*- coding: utf-8 -*-
"""PC-04 v1.4: replace each size's `images` array in porta-cabin-with-toilet.json
with the new 6-slot manifest (hero-view, front-angle, elevated-view,
end-elevation, space-interior, rear-interior), using the actual converted
output dimensions. Deletes the 3 real workspace-interior physical files (the
ticket says six; only three exist -- 20x8, 20x10, 30x10 -- reported, not
silently corrected to match the ticket's wrong count). Leaves the other 13
now-unreferenced files (rear-angle, side-elevation, corner-interior,
entrance-interior variants) on disk untouched -- their removal is not
authorised by this ticket, only reported."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'data', 'products', 'porta-cabin-with-toilet.json')
IMG_ROOT = os.path.join(ROOT, 'public', 'images', 'products', 'porta-cabin-with-toilet')

report = json.load(open(os.path.join(os.path.dirname(__file__), 'pc04-image-report.json'), encoding='utf-8'))
slots_by_size = {}
for s in report['slots']:
    slots_by_size.setdefault(s['size'], []).append(s)

VIEW_ORDER = ['hero-view', 'front-angle', 'elevated-view', 'end-elevation', 'space-interior', 'rear-interior']


def view_of(out_path):
    fn = out_path.rsplit('/', 1)[-1]
    for v in VIEW_ORDER:
        if fn.endswith('-%s.webp' % v):
            return v
    return None


data = json.load(open(DATA, encoding='utf-8'))

# the three real workspace-interior files to delete (ticket claims six; three exist)
WORKSPACE_INTERIOR_TO_DELETE = [
    ('20x8', 'porta-cabin-with-toilet-20x8-workspace-interior.webp'),
    ('20x10', 'porta-cabin-with-toilet-20x10-workspace-interior.webp'),
    ('30x10', 'porta-cabin-with-toilet-30x10-workspace-interior.webp'),
]

changes = []
for v in data['variants']:
    size = v['sizeSlug']
    slots = sorted(slots_by_size[size], key=lambda s: VIEW_ORDER.index(view_of(s['out'])))
    old_images = v['images']
    new_images = [
        dict(src=s['out'], alt=s['alt'], provenance='render', width=s['w'], height=s['h'])
        for s in slots
    ]
    v['images'] = new_images
    changes.append(dict(size=size, old_count=len(old_images), new_count=len(new_images),
                         old_srcs=[im['src'] for im in old_images],
                         new_srcs=[im['src'] for im in new_images]))

json.dump(data, open(DATA, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

deleted = []
missing = []
for size, fn in WORKSPACE_INTERIOR_TO_DELETE:
    fp = os.path.join(IMG_ROOT, size, fn)
    if os.path.exists(fp):
        os.remove(fp)
        deleted.append(fp)
    else:
        missing.append(fp)

print('JSON updated: %d variants, images array replaced with the new 6-slot manifest each' % len(changes))
for c in changes:
    print('  %-6s %d -> %d images' % (c['size'], c['old_count'], c['new_count']))

print('\nworkspace-interior physical files deleted (%d):' % len(deleted))
for d in deleted:
    print('  ' + d)
if missing:
    print('expected but not found:')
    for m in missing:
        print('  ' + m)

with open(os.path.join(os.path.dirname(__file__), 'pc04-json-update-report.json'), 'w', encoding='utf-8') as f:
    json.dump(dict(changes=changes, deleted=deleted, missing=missing), f, indent=1)
