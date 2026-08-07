import { NextRequest, NextResponse } from 'next/server';

// Environment-level Google block for staging deployments only.
//
// Safe default: when STAGING_GOOGLE_BLOCK is unset, production returns a plain
// NextResponse.next() for matched page/API-like routes and never touches static
// or optimizer responses.
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
  const isObsoleteJunk =
    pathname === '/find-out-how-i-cured-my-easter-weekend-in-2-days' ||
    pathname === '/feed' ||
    /^\/(?:product-tag|tag|author)(?:\/|$)/.test(pathname) ||
    /^\/page\/\d+$/.test(pathname) ||
    /^\/\d+$/.test(pathname);

  if (isObsoleteJunk) {
    return new NextResponse(null, {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'public, max-age=0, s-maxage=86400',
      },
    });
  }

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

  return new NextResponse('Staging environment - authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SAMAN staging"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

// Match pages/API-like routes, but never run middleware on Next internals or
// static assets. Even a no-op middleware pass can turn optimizer/static responses
// into edge-middleware responses at the host/CDN layer, preventing reliable
// Cloudflare edge storage for /_next/image.
export const config = {
  matcher: [
    '/((?!_next/|static/|favicon.ico$|robots.txt$|sitemap.xml$|manifest.json$|sw.js$|.well-known/|.*\\.(?:css|js|mjs|map|jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|otf|eot)$).*)',
  ],
};
