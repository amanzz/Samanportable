# FetchPriority React Warning Fix Report

This report documents the resolution of the React warning related to `fetchPriority` being passed to a native DOM element in the document header.

---

## 1. Problem Description

During server startup and page compilation, React issued the following warning in the console:
> `Warning: React does not recognize the fetchPriority prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase fetchpriority instead. If you accidentally passed it from a parent component, remove it from the DOM element. at link at head at Head`

---

## 2. Root Cause Analysis

In `src/pages/_document.tsx`, we have a preload `<link>` tag optimization designed to optimize LCP by preloading the main hero image:
```tsx
<link rel="preload" href="/hero-image/saman-portable-office-cabin-bangalore.webp" as="image" type="image/webp" fetchPriority="high" />
```
Because this is a native HTML `<link>` element (not a React wrapper or Next.js `Image`), passing camelCase `fetchPriority` causes React to trigger a validation warning, as standard HTML attributes in React are expected to be in lowercase (`fetchpriority`).

However, writing `fetchpriority="high"` directly causes a TypeScript syntax compile-time error (`TS2322: Property 'fetchpriority' does not exist on ... LinkHTMLAttributes<HTMLLinkElement>`), since TypeScript types define it as camelCase `fetchPriority`.

---

## 3. The Resolution

To satisfy both the **TypeScript compiler** (avoiding any type checks on the attribute) and the **React runtime** (passing lowercase to avoid console warnings), we utilize the standard React spread pattern `{...{ fetchpriority: "high" }}`:

### File Modified
- [src/pages/_document.tsx](file:///Users/amandubey/Downloads/Saman%20Portable/src/pages/_document.tsx)

### Before / After Code

```diff
-        <link rel="preload" href="/hero-image/saman-portable-office-cabin-bangalore.webp" as="image" type="image/webp" fetchPriority="high" />
+        <link rel="preload" href="/hero-image/saman-portable-office-cabin-bangalore.webp" as="image" type="image/webp" {...{ fetchpriority: "high" }} />
```

---

## 4. Verification Results

We verified the resolution thoroughly:

1. **TypeScript Type Verification**:
   ```bash
   npx tsc --noEmit
   ```
   *Result*: **Passed with 0 errors** (the spread operator successfully bypassed type conflicts).

2. **Next.js Production Build**:
   ```bash
   npm run build
   ```
   *Result*: **Passed successfully** (optimized production build generated without errors).

3. **Runtime Warning Verification**:
   - Launched the local Next.js dev server on port 3009.
   - Fetced `/` to trigger document layout rendering.
   - *Result*: **Passed! The fetchPriority prop warning was completely and successfully eliminated** from the console outputs.

---

*Report generated on: 2026-06-01*
