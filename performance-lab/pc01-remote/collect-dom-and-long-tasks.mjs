export const observerSource = `(() => {
  window.__pc01 = { lcp: [], longTasks: [], shifts: [], paints: [] };
  try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__pc01.lcp.push({startTime:e.startTime,renderTime:e.renderTime,loadTime:e.loadTime,size:e.size,url:e.url||null,outerHTML:e.element?.outerHTML?.slice(0,1500)||null,currentSrc:e.element?.currentSrc||null}))).observe({type:'largest-contentful-paint',buffered:true}); } catch {}
  try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__pc01.longTasks.push({startTime:e.startTime,duration:e.duration,name:e.name,attribution:[...(e.attribution||[])].map(a=>({name:a.name,containerType:a.containerType,containerName:a.containerName,containerSrc:a.containerSrc}))}))).observe({type:'longtask',buffered:true}); } catch {}
  try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__pc01.shifts.push({startTime:e.startTime,value:e.value,hadRecentInput:e.hadRecentInput}))).observe({type:'layout-shift',buffered:true}); } catch {}
  try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__pc01.paints.push({name:e.name,startTime:e.startTime}))).observe({type:'paint',buffered:true}); } catch {}
})();`;

export function domMetricsSource() {
  const root = document.documentElement;
  let maxDepth = 0;
  let maxChildren = 0;
  const visit = (node, depth) => {
    maxDepth = Math.max(maxDepth, depth);
    maxChildren = Math.max(maxChildren, node.children?.length || 0);
    for (const child of node.children || []) visit(child, depth + 1);
  };
  visit(root, 1);
  return {
    tagCount: document.getElementsByTagName('*').length,
    queryCount: document.querySelectorAll('*').length,
    maxDepth,
    maxChildren,
    innerWidth,
    innerHeight,
    clientWidth: root.clientWidth,
    devicePixelRatio,
    horizontalOverflow: root.scrollWidth > root.clientWidth
  };
}
