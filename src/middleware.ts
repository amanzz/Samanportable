import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// STAGING GOOGLE-BLOCK MIDDLEWARE — migration-staging branch ONLY.
//
// ⚠️ THIS FILE MUST NEVER REACH `main` OR `migration-batch1`. Shipping it to
//    production would 401 the whole site and noindex it = mass deindex.
//
// Layers (defense-in-depth, all on the staging deploy):
//   1. HTTP Basic-Auth (creds from process.env.STAGING_AUTH, format "user:pass").
//      Every path 401s without valid creds. FAIL-CLOSED: if STAGING_AUTH is unset,
//      everything 401s.
//   2. X-Robots-Tag: noindex, nofollow on every response.
//   3. /robots.txt is served publicly (no auth) as "Disallow: /" so crawlers that
//      somehow reach the host are told to stay out (overrides any dynamic robots).
// ─────────────────────────────────────────────────────────────────────────────

const NOINDEX = 'noindex, nofollow';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Layer 3: robots.txt — always public, always Disallow: / (override dynamic robots).
  if (pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': NOINDEX },
    });
  }

  // Layer 1: Basic-Auth gate on EVERYTHING else (incl. _next, api, static).
  const expected = process.env.STAGING_AUTH; // "user:pass"
  const header = req.headers.get('authorization') || '';
  let ok = false;
  if (expected && header.startsWith('Basic ')) {
    try {
      ok = atob(header.slice(6)) === expected;
    } catch {
      ok = false;
    }
  }

  if (!ok) {
    return new NextResponse('Authentication required (staging).', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="staging", charset="UTF-8"',
        'X-Robots-Tag': NOINDEX,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  // Authenticated: pass through but still mark noindex (Layer 2).
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', NOINDEX);
  return res;
}

// Match ALL paths — no crawlable hole (covers _next, api, static, robots, etc.).
export const config = {
  matcher: ['/(.*)'],
};
