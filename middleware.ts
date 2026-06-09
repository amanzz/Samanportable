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
  
  // Debug logging removed for production
  
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

  // 410 Gone responses for intentionally removed content
  const goneUrls = [
    '/find-out-how-i-cured-my-easter-weekend-in-2-days/',
    '/find-out-how-i-cured-my-easter-weekend-in-2-days'
  ];

  if (goneUrls.includes(pathname)) {
    return new NextResponse(
      JSON.stringify({
        error: 'Gone',
        message: 'This content has been permanently removed.',
        status: 410
      }),
      {
        status: 410,
        statusText: 'Gone',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  }

  // 410 Gone for unwanted legacy archive/system URL patterns (GSC "Not found 404"
  // deindexing). These paths have NO route on the headless front-end and should be
  // permanently removed from Google's index. Matching is PATH-based only — never on
  // query parameters — so valid product pages carrying e.g. ?add-to-cart=<id> are
  // unaffected. Numeric-only spam keeps its separate 410 handler below, unchanged.
  const isGoneArchivePattern =
    pathname.startsWith('/product-tag/') || // WooCommerce product-tag archives (+ ?orderby/per_page/add-to-cart variants)
    pathname.startsWith('/tag/') ||         // WordPress blog-tag archives
    pathname === '/feed' ||                 // root RSS feed
    pathname.startsWith('/feed/') ||        // root-level feed paths (NOT nested /product/.../feed/)
    pathname.startsWith('/author/') ||      // WordPress author archives
    /^\/page\/\d+\/?$/.test(pathname);      // old Divi root-level pagination artifact (/page/2, /page/3, ...)

  if (isGoneArchivePattern) {
    return new NextResponse(
      JSON.stringify({
        error: 'Gone',
        message: 'This content has been permanently removed.',
        status: 410
      }),
      {
        status: 410,
        statusText: 'Gone',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  }

  // 301 Permanent Redirects for broken links
  const redirectMap: Record<string, string> = {
    // Container Houses redirects
    '/products/shipping-container-house/': '/product/container-houses',
    '/products/shipping-container-house': '/product/container-houses',
    '/products/kitchen-container/': '/product/container-houses',
    '/products/kitchen-container': '/product/container-houses',
    '/project/container-homes': '/product/container-houses',
    '/products/mobile-home': '/product/container-houses',
    
    // Portable Cabin redirects
    '/project/portable-cabins-manufacturer': '/product/portable-cabin',
    '/products/portable-cabin': '/product/portable-cabin',
    '/project/portable-cabin': '/product/portable-cabin',
    
    // Industrial Sheds redirects
    '/project/industrial-shed-manufacturer': '/product/industrial-sheds',
    '/products/industrial-shed-manufacturer': '/product/industrial-sheds',
    
    // Porta Cabins redirects
    '/porta-cabins': '/product/porta-cabins',
    
    // Container Offices redirects
    '/container-office-for-sale-in-bangalore': '/product/container-offices',
    '/container-offices-for-sale-in-nagarbhavi-3': '/product/container-offices',
    '/container-offices-for-sale-in-peenya': '/product/container-offices',
    '/container-offices-for-sale-in-hosur-3': '/product/container-offices',
    
    // Labor Colony redirects
    '/labour-colonies-in-najafgarh': '/product/labor-colony',
    '/prefab-labour-colonies-in-central-delhi': '/product/labor-colony',
    '/labour-colonies-for-sale-in-central-delhi': '/product/labor-colony',
    '/prefab-labour-colonies-in-east-delhi': '/product/labor-colony',
    '/labour-colonies-in-okhla-industrial': '/product/labor-colony',
    '/prefab-labour-colonies-in-west-delhi': '/product/labor-colony',
    '/labour-colonies-in-loni-ghaziabad': '/product/labor-colony',
    '/labour-camps-in-noida': '/product/labor-colony',
    '/prefab-labour-colonies-in-north-delhi': '/product/labor-colony',
    '/prefab-labour-camps-in-ghaziabad': '/product/labor-colony',
    '/prefab-labour-colonies-in-lucknow': '/product/labor-colony',
    '/labour-colonies-for-sale-in-north-delhi': '/product/labor-colony',
    '/labour-colonies-for-sale-in-south-delhi': '/product/labor-colony',
    '/labour-colonies-for-sale-in-new-delhi': '/product/labor-colony',
    '/prefab-labour-colonies-in-meerut': '/product/labor-colony',
    
    // Portable Toilet redirects
    '/products/mobile-toilet': '/product/portable-toilet',
    '/products/portable-toilet': '/product/portable-toilet',
    
    // Office Cabins redirects
    '/products/office-cabins': '/product/portable-office/portable-office-cabin'
  };

  // Check for redirects
  if (redirectMap[pathname]) {
    const redirectUrl = new URL(redirectMap[pathname], request.url);
    return NextResponse.redirect(redirectUrl, 301);
  }
  
  // Remove leading slash to check if the path is numeric-only
  const pathWithoutSlash = pathname.replace(/^\//, '');
  
  // Check if the path is empty (root path) - allow it
  if (pathWithoutSlash === '') {
    console.log('Root path detected, allowing');
    return NextResponse.next();
  }
  
  // Check if the path contains only digits (0-9)
  // This regex matches strings that contain only digits from start to end
  const isNumericOnly = /^\d+$/.test(pathWithoutSlash);
  
  console.log('Path without slash:', pathWithoutSlash);
  console.log('Is numeric only:', isNumericOnly);
  
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
