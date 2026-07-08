import type { ServerResponse } from 'http';

export function setPublicEdgeCache(res: ServerResponse): void {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );
}
