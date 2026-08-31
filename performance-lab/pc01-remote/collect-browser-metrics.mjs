import puppeteer from 'puppeteer-core';
import { observerSource } from './collect-dom-and-long-tasks.mjs';

export async function collectBrowserMetrics({ url, mode, chromePath, profilePath, screenshotPath }) {
  const viewport = mode === 'mobile' ? { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true } : { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false };
  const blocked = [];
  const consoleErrors = [];
  const failedLocal = [];
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, userDataDir: profilePath, args: ['--no-sandbox','--disable-gpu','--disable-extensions','--disable-background-networking'] });
  try {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport(viewport);
    const cdp = await page.createCDPSession();
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.isMobile });
    await page.evaluateOnNewDocument(observerSource);
    await page.setRequestInterception(true);
    page.on('request', request => {
      const value = request.url();
      try {
        const parsed = new URL(value);
        if (['http:','https:'].includes(parsed.protocol) && !['127.0.0.1','localhost'].includes(parsed.hostname)) {
          blocked.push({ url: value, host: parsed.host, type: request.resourceType() });
          request.abort('blockedbyclient');
          return;
        }
      } catch {}
      request.continue();
    });
    page.on('console', entry => { if (entry.type() === 'error') consoleErrors.push(entry.text()); });
    page.on('requestfailed', request => { try { const host = new URL(request.url()).hostname; if (['127.0.0.1','localhost'].includes(host)) failedLocal.push({url:request.url(),error:request.failure()?.errorText}); } catch {} });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    const data = await page.evaluate(() => {
      const root = document.documentElement;
      let maxDepth = 0, maxChildren = 0;
      const visit = (node, depth) => { maxDepth=Math.max(maxDepth,depth); maxChildren=Math.max(maxChildren,node.children?.length||0); for(const child of node.children||[]) visit(child,depth+1); };
      visit(root,1);
      const resources = performance.getEntriesByType('resource').map(e=>({name:e.name,initiatorType:e.initiatorType,startTime:e.startTime,duration:e.duration,responseStart:e.responseStart,responseEnd:e.responseEnd,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,decodedBodySize:e.decodedBodySize}));
      const nav = performance.getEntriesByType('navigation')[0];
      const hero = document.querySelector('img[fetchpriority="high"],img[fetchPriority="high"]');
      const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>e.textContent);
      return {
        viewport:{innerWidth,innerHeight,clientWidth:root.clientWidth,devicePixelRatio},
        dom:{tagCount:document.getElementsByTagName('*').length,queryCount:document.querySelectorAll('*').length,maxDepth,maxChildren},
        observer:window.__pc01,
        navigation:nav?{requestStart:nav.requestStart,responseStart:nav.responseStart,responseEnd:nav.responseEnd,domContentLoadedEventEnd:nav.domContentLoadedEventEnd,loadEventEnd:nav.loadEventEnd}:null,
        resources,
        hero:hero?{outerHTML:hero.outerHTML,currentSrc:hero.currentSrc,src:hero.getAttribute('src'),srcset:hero.getAttribute('srcset'),sizes:hero.getAttribute('sizes'),loading:hero.getAttribute('loading'),decoding:hero.getAttribute('decoding'),fetchpriority:hero.getAttribute('fetchpriority'),naturalWidth:hero.naturalWidth,naturalHeight:hero.naturalHeight,width:hero.clientWidth,height:hero.clientHeight}:null,
        parity:{title:document.title,meta:document.querySelector('meta[name="description"]')?.content||null,h1:document.querySelector('h1')?.textContent?.trim()||null,canonical:document.querySelector('link[rel="canonical"]')?.href||null,robots:document.querySelector('meta[name="robots"]')?.content||null,jsonld,faqVisible:document.querySelectorAll('[data-faq],details').length,pdfLinks:[...document.querySelectorAll('a[href$=".pdf"]')].map(a=>a.getAttribute('href')),horizontalOverflow:root.scrollWidth>root.clientWidth},
      };
    });
    const flattened = await cdp.send('DOM.getFlattenedDocument', { depth: -1, pierce: true });
    data.dom.cdpNodes = flattened.nodes.length;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    return { ...data, blocked, consoleErrors, failedLocal };
  } finally { await browser.close(); }
}
