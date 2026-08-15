import json
import re

d = json.load(open('src/data/products/porta-cabin-with-toilet.json', encoding='utf-8'))
gallery_alts = [im['alt'] for v in d['variants'] for im in v['images']]
print('gallery: %d alts, %d unique' % (len(gallery_alts), len(set(gallery_alts))))

desc_alts = re.findall(r'alt="([^"]*)"', d['descriptionHtml'])
print('descriptionHtml image alts found: %d' % len(desc_alts))
for a in desc_alts:
    print('   -', a)

overlap = set(gallery_alts) & set(desc_alts)
print('overlap between gallery alts and description alts:', overlap or 'none')

all_alts = gallery_alts + desc_alts
print('\npage-wide total: %d alt strings, %d unique -> %s'
      % (len(all_alts), len(set(all_alts)), 'PASS' if len(all_alts) == len(set(all_alts)) else 'FAIL'))
