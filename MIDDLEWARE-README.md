# Next.js Middleware for Domain Redirects

This document explains the middleware implementation for handling domain redirects and HTTPS enforcement in your Next.js application.

## Overview

The `middleware.ts` file in the root directory handles all domain redirects at the edge level, providing better performance and SEO benefits compared to server-side redirects.

## What the Middleware Does

### 1. Domain Redirects
- **samanportable.com** → **https://www.samanportable.com**
- **http://samanportable.com** → **https://www.samanportable.com**
- **https://samanportable.com** → **https://www.samanportable.com**
- **http://www.samanportable.com** → **https://www.samanportable.com**

### 2. HTTPS Enforcement
- All HTTP requests are automatically redirected to HTTPS
- Works for any domain/subdomain

### 3. SEO-Friendly Redirects
- Uses **308 Permanent Redirect** status code
- Preserves query parameters and path structure
- Maintains SEO value during redirects

## Implementation Details

### Middleware Location
```
/middleware.ts (root directory)
```

### Key Features
- **Edge-level processing**: Redirects happen before the request reaches your application
- **Performance optimized**: Minimal overhead, fast redirects
- **Comprehensive coverage**: Handles all edge cases and protocol variations
- **Query parameter preservation**: All URL parameters are maintained during redirects

### Matcher Configuration
The middleware excludes static files and API routes to avoid unnecessary processing:
- Excludes: `api`, `_next/static`, `_next/image`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `manifest.json`, `sw.js`

## Testing the Redirects

You can test the redirects using curl or by visiting these URLs:

```bash
# Test non-www to www redirect
curl -I http://samanportable.com
curl -I https://samanportable.com

# Test HTTP to HTTPS redirect
curl -I http://www.samanportable.com

# All should return 308 redirect to https://www.samanportable.com
```

## Deployment

The middleware will automatically work when you deploy your Next.js application. No additional configuration is needed.

## Benefits

1. **SEO Benefits**: 308 redirects preserve SEO value
2. **Performance**: Edge-level redirects are faster than server-side
3. **Consistency**: All requests are standardized to the canonical domain
4. **Security**: HTTPS enforcement improves security
5. **User Experience**: Seamless redirects without breaking user sessions

## Troubleshooting

If redirects aren't working as expected:

1. Check that the middleware file is in the root directory
2. Verify the domain names in the middleware match your actual domains
3. Ensure your hosting provider supports Next.js middleware
4. Check browser developer tools for any JavaScript errors

## Related Files

- `next.config.js`: Contains other redirects for URL structure maintenance
- `middleware.ts`: Main redirect logic (this file)
