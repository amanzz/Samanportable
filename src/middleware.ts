import { NextRequest, NextResponse } from 'next/server';

// ─── Environment-level Google block for STAGING deployments only ─────────────
//
// SAFE DEFAULT = NO-OP. When STAGING_GOOGLE_BLOCK is unset (production), this
// middleware passes every request through untouched — nothing is added to any
// response, so the production build stays "born clean" by construction.
//
// When STAGING_GOOGLE_BLOCK=1 (set ONLY on the goldfish staging app, never on
// production), EVERY route — pages, API routes (merchant feed), sitemap.xml,
// robots.txt, assets — is gated:
//   • without valid credentials → HTTP 401 basic-auth challenge (crawlers see
//     no content at all — this is the primary block)
//   • with valid credentials    → normal response PLUS X-Robots-Tag: noindex,
//     nofollow (belt-and-suspenders; never cached as indexable)
//
// Credentials come from STAGING_GOOGLE_BLOCK_CREDENTIALS ("user:password").
// If the block is on but credentials are not configured, everything stays 401
// (locked tight) until the owner sets them.
//
// Removing the block at cutover = deleting the env var in the DO dashboard.
// No code change, no "strip the block" commit — the failure mode that left
// goldfish unblocked in June 2026 cannot recur.
//
// NOTE: this file is src/middleware.ts because this project keeps its app code
// under src/ — Next.js only executes middleware from src/ in that layout. The
// legacy root-level middleware.ts is dead code (never executed) and is left
// untouched; its 410/redirect duties are already served by next.config and
// page-level handling, as production behaviour confirms.
export function middleware(request: NextRequest) {
  // Production / block off: complete no-op.
  if (process.env.STAGING_GOOGLE_BLOCK !== '1') {
    return NextResponse.next();
  }

  const expected = process.env.STAGING_GOOGLE_BLOCK_CREDENTIALS || '';
  const auth = request.headers.get('authorization') || '';
  let authorized = false;
  if (expected && auth.startsWith('Basic ')) {
    try {
      authorized = atob(auth.slice(6)) === expected;
    } catch {
      authorized = false;
    }
  }

  if (authorized) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return new NextResponse('Staging environment — authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SAMAN staging"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

// No matcher: gate EVERY path (pages, /api/*, robots.txt, sitemap.xml, assets)
// when the block is on. When off, the function returns immediately.
