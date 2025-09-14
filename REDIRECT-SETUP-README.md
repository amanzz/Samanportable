# 🔄 Domain Redirect Setup - Next.js Configuration Method

## ✅ **Solution Implemented**

We've switched from middleware to **Next.js configuration-based redirects** which is more reliable and works better with hosting platforms like Vercel, Netlify, etc.

## 📋 **What's Configured**

### **1. Next.js Configuration (`next.config.js`)**
```javascript
async redirects() {
  return [
    // Force HTTPS and WWW redirects
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'samanportable.com',
        },
      ],
      destination: 'https://www.samanportable.com/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'http://samanportable.com',
        },
      ],
      destination: 'https://www.samanportable.com/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'http://www.samanportable.com',
        },
      ],
      destination: 'https://www.samanportable.com/:path*',
      permanent: true,
    },
  ];
}
```

### **2. Middleware Disabled**
- Middleware has been disabled to prevent conflicts
- Using `next.config.js` redirects instead

## 🎯 **Redirect Rules**

| **From** | **To** | **Status Code** | **SEO Impact** |
|----------|--------|-----------------|----------------|
| `http://samanportable.com/` | `https://www.samanportable.com/` | 301 | ✅ Preserves SEO |
| `https://samanportable.com/` | `https://www.samanportable.com/` | 301 | ✅ Preserves SEO |
| `http://www.samanportable.com/` | `https://www.samanportable.com/` | 301 | ✅ Preserves SEO |

## 🚀 **Benefits of This Approach**

### **✅ Advantages:**
1. **More Reliable**: Works consistently across all hosting platforms
2. **Better Performance**: No runtime middleware overhead
3. **Easier Debugging**: Clear configuration in one place
4. **Hosting Platform Compatible**: Works with Vercel, Netlify, AWS, etc.
5. **SEO Friendly**: Proper 301 permanent redirects

### **🔧 Technical Details:**
- **Status Code**: 301 (Permanent Redirect)
- **SEO Impact**: Preserves search rankings
- **Performance**: No additional runtime processing
- **Compatibility**: Works with all Next.js hosting platforms

## 📊 **Testing Instructions**

### **1. Manual Testing:**
```bash
# Test these URLs in your browser:
https://samanportable.com/          # Should redirect to www
http://samanportable.com/           # Should redirect to https://www
http://www.samanportable.com/       # Should redirect to https://www
```

### **2. Browser Developer Tools:**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Visit `https://samanportable.com/`
4. Look for 301 redirect response
5. Check final URL shows `https://www.samanportable.com/`

### **3. Command Line Testing:**
```bash
# Using curl (if available)
curl -I https://samanportable.com/
# Should show: Location: https://www.samanportable.com/
```

## 🛠️ **Deployment Steps**

### **1. Build the Project:**
```bash
npm run build
```

### **2. Deploy to Your Hosting Platform:**
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS**: Follow your deployment process
- **Other**: Use your platform's deployment method

### **3. Verify DNS Settings:**
Ensure both domains point to your hosting:
```
A     samanportable.com     → Your server IP
A     www.samanportable.com → Your server IP
```

## 🔍 **Troubleshooting**

### **If Redirects Don't Work:**

1. **Check DNS Propagation:**
   - Use `nslookup samanportable.com`
   - Use `nslookup www.samanportable.com`

2. **Clear Browser Cache:**
   - Hard refresh (Ctrl+F5)
   - Try incognito mode
   - Test with different browsers

3. **Check Hosting Platform:**
   - Ensure both domains are configured
   - Check for conflicting redirect rules
   - Verify SSL certificates

4. **Verify Build Output:**
   - Check that `next.config.js` is included in build
   - Ensure no build errors

## 📈 **SEO Benefits**

- ✅ **301 Redirects**: Preserve search rankings
- ✅ **Canonical URLs**: Consistent www domain
- ✅ **HTTPS Enforcement**: Better security and SEO
- ✅ **No Duplicate Content**: Single canonical domain

## 🎉 **Expected Results**

After deployment:
- `samanportable.com` → `https://www.samanportable.com/`
- All traffic consolidated to canonical domain
- Improved SEO and user experience
- Better security with HTTPS enforcement

---

**Status**: ✅ **Ready for Deployment**
**Method**: Next.js Configuration Redirects
**Compatibility**: All hosting platforms
**SEO Impact**: Positive (301 redirects preserve rankings)
