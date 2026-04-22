import json

r = json.load(open('lcp-check.json'))
print('LCP:', r['audits']['largest-contentful-paint']['displayValue'])
print('TTFB:', r['audits']['server-response-time']['displayValue'])
lcp_el = r['audits'].get('largest-contentful-paint-element',{})
for item in lcp_el.get('details',{}).get('items',[]):
    node = item.get('node',{})
    print('LCP Element:', node.get('snippet','')[:200])

lcp_bd = r['audits'].get('lcp-breakdown-insight',{}).get('details',{})
print('LCP Breakdown:', json.dumps(lcp_bd, indent=2)[:500])
