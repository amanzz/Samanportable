# SEO Implementation for Saman Portable Website

This document outlines the comprehensive SEO implementation for the Saman Portable Next.js website with WordPress CMS backend.

## 🎯 SEO Features Implemented

### 1. Meta Tags & Open Graph
- **Title**: Dynamic page titles with brand suffix
- **Description**: Unique meta descriptions for each page
- **Canonical URLs**: All pointing to `https://www.samanportable.com`
- **Open Graph**: Facebook and social media optimization
- **Twitter Cards**: Optimized for Twitter sharing

### 2. Sitemap & Robots.txt
- **next-sitemap**: Automatically generates sitemap.xml
- **Robots.txt**: Proper crawling instructions
- **WordPress Subdomain**: `blog.samanportable.com` set to noindex

### 3. Structured Data (Schema.org)
- **Organization Schema**: Company information
- **Product Schema**: Product details with pricing
- **Blog Post Schema**: Article metadata
- **Breadcrumb Schema**: Navigation structure

### 4. Performance & Caching
- **Image Optimization**: next/image with WebP/AVIF support
- **Caching Headers**: Static assets and API responses
- **Preloading**: Critical resources and fonts

### 5. Redirects & HTTPS
- **HTTPS Enforcement**: All traffic redirected to HTTPS
- **WWW Redirect**: Non-www traffic redirected to www
- **Trailing Slash Removal**: Clean URLs

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install next-seo next-sitemap
```

### 2. Build and Generate Sitemap
```bash
npm run build
# Sitemap is automatically generated after build
```

### 3. Deploy
- Upload to your hosting provider
- Ensure `robots.txt` and `sitemap.xml` are accessible

## 📁 File Structure

```
src/
├── components/
│   ├── SEO.tsx                 # Reusable SEO component
│   └── ...
├── config/
│   └── seo.ts                  # SEO configuration
├── lib/
│   └── schema.ts               # Schema.org utilities
└── pages/
    ├── _app.tsx                # Global SEO provider
    ├── _document.tsx           # Document-level meta tags
    ├── index.tsx               # Home page SEO
    ├── about-us.tsx            # About page SEO
    ├── blog.tsx                # Blog page SEO
    └── product/[category]/[slug].tsx  # Product page SEO

next-sitemap.config.js          # Sitemap configuration
public/
└── robots-wordpress.txt        # WordPress subdomain robots.txt
```

## 🔧 Configuration

### SEO Component Usage
```tsx
import SEO from '@/components/SEO';

<SEO
  title="Page Title"
  description="Page description"
  canonical="https://www.samanportable.com/page"
  openGraph={{
    title: "Open Graph Title",
    description: "Open Graph Description",
    image: "/og-image.jpg",
    url: "https://www.samanportable.com/page",
  }}
/>
```

### Page-Specific SEO
```tsx
import { pageSEO } from '@/config/seo';

<SEO
  title={pageSEO.home.title}
  description={pageSEO.home.description}
  canonical={pageSEO.home.canonical}
/>
```

### Schema.org Integration
```tsx
import { generateProductSchema } from '@/lib/schema';

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateProductSchema(productData))
  }}
/>
```

## 🌐 WordPress CMS Setup

### 1. WordPress Subdomain Configuration
- **URL**: `blog.samanportable.com`
- **Purpose**: Content management only
- **SEO**: Set to noindex

### 2. WordPress SEO Settings
```php
// Add to functions.php or use Yoast SEO plugin
add_action('wp_head', function() {
    echo '<meta name="robots" content="noindex, nofollow">';
});
```

### 3. WordPress Robots.txt
Upload `public/robots-wordpress.txt` to `blog.samanportable.com/robots.txt`

## 📊 Google Search Console

### 1. Submit Sitemap
- **URL**: `https://www.samanportable.com/sitemap.xml`
- **Do NOT submit**: WordPress subdomain sitemap

### 2. Verify Ownership
- Use HTML tag or DNS record
- Ensure main domain is verified

### 3. Monitor Performance
- Track indexing status
- Monitor search performance
- Check for crawl errors

## 🔍 Testing & Validation

### 1. Meta Tags
- Use browser dev tools
- Check `<head>` section
- Verify Open Graph tags

### 2. Schema.org
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### 3. Sitemap
- Access `/sitemap.xml`
- Validate XML structure
- Check all URLs are correct

### 4. Robots.txt
- Access `/robots.txt`
- Verify sitemap location
- Check crawling rules

## 📈 Performance Optimization

### 1. Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/product-image.jpg"
  alt="Product Description"
  width={800}
  height={600}
  priority={true}
  placeholder="blur"
/>
```

### 2. Caching Strategy
- Static assets: 1 year
- API responses: 5 minutes
- Images: 30 days

### 3. Preloading
- Critical fonts
- Hero images
- Navigation resources

## 🚨 Important Notes

### 1. Canonical URLs
- **Always use**: `https://www.samanportable.com`
- **Never use**: `blog.samanportable.com` for main site
- **Update**: All internal links to use main domain

### 2. WordPress Content
- **API Only**: Use WordPress for content management
- **No Direct Access**: Users should never visit WordPress directly
- **Content Sync**: Ensure content is properly synced to Next.js

### 3. Image URLs
- **Update**: All image references to use main domain
- **Optimize**: Use next/image for all images
- **CDN**: Consider using a CDN for better performance

## 🔄 Maintenance

### 1. Regular Updates
- Monitor SEO performance
- Update meta descriptions
- Refresh structured data
- Check for broken links

### 2. Content Updates
- Keep product information current
- Update blog posts regularly
- Maintain accurate company information

### 3. Technical SEO
- Monitor Core Web Vitals
- Check mobile optimization
- Verify HTTPS implementation
- Test page speed

## 📞 Support

For technical support or questions about the SEO implementation:
- Check the code comments
- Review Next.js and next-seo documentation
- Test with browser dev tools
- Validate with Google's testing tools

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Next.js Version**: 14.2.5
**SEO Package**: next-seo
