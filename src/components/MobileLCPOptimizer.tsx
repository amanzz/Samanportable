import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Mobile LCP Optimizer Component
 * Specifically designed to improve Largest Contentful Paint on mobile devices
 */
const MobileLCPOptimizer = () => {
  const router = useRouter();

  useEffect(() => {
    // Preload critical resources for mobile
    const preloadCriticalResources = () => {
      // Preload critical fonts with high priority
      const fontPreloads = [
        '/fonts/Inter-Regular.woff2',
        '/fonts/Inter-Medium.woff2'
      ];

      fontPreloads.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = font;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        // High priority for mobile
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });

      // Preload critical images for mobile viewport
      const criticalImages = [
        '/container-office-by-saman (1).jpg'
      ];

      criticalImages.forEach(image => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = image;
        link.as = 'image';
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      });
    };

    // Mobile-specific optimizations
    const optimizeForMobile = () => {
      // Force font-display: swap for faster text rendering
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'Inter-Mobile';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('/fonts/Inter-Regular.woff2') format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        @font-face {
          font-family: 'Inter-Mobile';
          font-style: normal;
          font-weight: 500;
          font-display: swap;
          src: url('/fonts/Inter-Medium.woff2') format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        
        /* Mobile-specific LCP optimizations */
        @media (max-width: 768px) {
          .hero-section-responsive {
            font-family: 'Inter-Mobile', system-ui, -apple-system, sans-serif;
            contain: layout style paint;
            content-visibility: auto;
          }
          
          .hero-section-responsive h1 {
            font-display: swap;
            contain: layout style paint;
            will-change: auto;
          }
          
          /* Reduce paint complexity on mobile */
          .hero-section-responsive::before {
            content: '';
            position: absolute;
            inset: 0;
            background: #082F20;
            z-index: -1;
          }
          
          /* Optimize button rendering */
          .btn-primary {
            contain: layout style paint;
            transform: translateZ(0);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Resource hints for mobile performance
    const addResourceHints = () => {
      // DNS prefetch for external resources
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = '//fonts.googleapis.com';
      document.head.appendChild(dnsPrefetch);

      // Preconnect to same origin for faster resource loading
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = window.location.origin;
      document.head.appendChild(preconnect);
    };

    // Mobile viewport optimization
    const optimizeViewport = () => {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      // Optimize viewport for mobile performance
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no');
    };

    // Execute optimizations
    if (typeof window !== 'undefined') {
      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      
      if (isMobile) {
        preloadCriticalResources();
        optimizeForMobile();
        addResourceHints();
        optimizeViewport();
        
        // Force immediate font loading on mobile
        document.fonts.ready.then(() => {
          // Trigger reflow to ensure fonts are applied
          document.body.style.fontFamily = 'Inter-Mobile, system-ui, -apple-system, sans-serif';
        });
      }
    }
  }, [router.pathname]);

  // This component doesn't render anything
  return null;
};

export default MobileLCPOptimizer;