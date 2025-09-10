import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to handle unwanted numeric-only URLs and performance optimization
 * 
 * This middleware checks if the requested path contains only digits.
 * If it does, it returns a 410 Gone response to tell search engines
 * that the page is intentionally removed and should be deindexed.
 * 
 * Examples of blocked URLs:
 * - /12345
 * - /67890
 * - /123456789
 * 
 * Examples of allowed URLs:
 * - /blog/hello-world
 * - /products/abc123
 * - /about-us
 * - /contact
 */

export function middleware(request: NextRequest) {
  // Get the pathname from the URL (excluding query parameters)
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for development and Fast Refresh requests
  if (process.env.NODE_ENV === 'development') {
    // Skip Fast Refresh and webpack requests
    if (pathname.includes('_next') || 
        pathname.includes('webpack') || 
        pathname.includes('hot-update') ||
        pathname.includes('__nextjs_original-stack-frame') ||
        pathname.includes('on-demand-entries-ping')) {
      return NextResponse.next();
    }
  }
  
  // Debug logging (commented out for production)
  // console.log('=== MIDDLEWARE CALLED ===');
  // console.log('Path:', pathname);
  // console.log('URL:', request.url);
  
  // TEMPORARY TEST: Block all requests to test if middleware is working
  if (pathname === '/test-middleware') {
    // console.log('=== TESTING MIDDLEWARE ===');
    return new NextResponse(
      JSON.stringify({
        message: 'Middleware is working!',
        path: pathname
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
  
  // Remove leading slash to check if the path is numeric-only
  const pathWithoutSlash = pathname.replace(/^\//, '');
  
  // Check if the path is empty (root path) - allow it
  if (pathWithoutSlash === '') {
    // console.log('Root path detected, allowing');
    return NextResponse.next();
  }
  
  // Check if the path contains only digits (0-9)
  // This regex matches strings that contain only digits from start to end
  const isNumericOnly = /^\d+$/.test(pathWithoutSlash);
  
  // console.log('Path without slash:', pathWithoutSlash);
  // console.log('Is numeric only:', isNumericOnly);
  
  if (isNumericOnly) {
    // console.log('=== BLOCKING NUMERIC URL ===');
    // Return 410 Gone response for numeric-only URLs
    // This tells search engines that the page is intentionally removed
    // and should be deindexed from search results
    return new NextResponse(
      JSON.stringify({
        error: 'Gone',
        message: 'This resource has been intentionally removed.',
        status: 410
      }),
      {
        status: 410,
        statusText: 'Gone',
        headers: {
          'Content-Type': 'application/json',
          // Add cache headers to prevent repeated requests
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          // Add security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  }
  
  // For all other URLs, add performance headers and continue with normal Next.js processing
  const response = NextResponse.next();
  
  // Add performance headers for better Core Web Vitals
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add caching headers for static content
  if (pathname.includes('/Gallery/') || 
      pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
  }
  
  // Add caching headers for CSS and JS files
  if (pathname.includes('/_next/static/') || 
      pathname.includes('/_next/image/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
  }
  
  return response;
}

/**
 * Configure which paths the middleware should run on
 * 
 * This matcher ensures the middleware only runs on:
 * - All paths except static files (images, CSS, JS, etc.)
 * - API routes
 * - Dynamic routes
 */
export const config = {
  matcher: [
    // Match all paths except static files, API routes, and Fast Refresh
    '/((?!_next/static|_next/image|_next/webpack|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|.well-known|api).*)',
  ],
};
