import type { ServerResponse } from 'http';

export function setPublicEdgeCache(res: ServerResponse): void {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );
}

export function setNoStoreCache(res: ServerResponse): void {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
}
