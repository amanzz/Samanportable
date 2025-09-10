import React from 'react';

const CriticalCSS = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for LCP optimization - Inline for immediate rendering */
          .hero-section-responsive {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            contain: layout style paint;
            content-visibility: auto;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .hero-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            align-items: center;
            justify-items: center;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          @media (min-width: 1024px) {
            .hero-grid {
              grid-template-columns: 1fr 1fr;
              gap: 4rem;
              align-items: center;
              justify-items: stretch;
            }
          }
          
          .hero-left-content {
            order: 1;
            text-align: left;
            padding: 1rem 0;
            width: 100%;
            max-width: 600px;
          }
          
          @media (min-width: 1024px) {
            .hero-left-content {
              order: 1;
              text-align: left;
              padding: 0;
              max-width: 600px;
            }
          }
          
          .hero-text-shadow {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-display: swap;
          }
          
          .mobile-lcp-optimized {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-display: swap;
            text-rendering: optimizeSpeed;
            contain: layout style paint;
            content-visibility: auto;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #0A3D2A 0%, #082F20 100%);
            color: white;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #0F5A3A 0%, #0A3D2A 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(10, 61, 42, 0.3);
          }
          
          .container-padding {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          @media (min-width: 640px) {
            .container-padding {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
          }
          
          @media (min-width: 1024px) {
            .container-padding {
              padding-left: 2rem;
              padding-right: 2rem;
            }
          }
          
          /* Force mobile layout on smaller screens */
          @media (max-width: 1023px) {
            .hero-section-responsive .hero-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
              padding: 2rem 0 !important;
              justify-items: center !important;
              max-width: 600px !important;
            }
            
            .hero-section-responsive .hero-left-content {
              order: 1 !important;
              padding: 1rem 0 !important;
              text-align: left !important;
              width: 100% !important;
              max-width: 600px !important;
            }
            
            .hero-section-responsive .hero-left-content h1 {
              font-size: 2.5rem !important;
              line-height: 1.2 !important;
              margin-bottom: 1rem !important;
              text-align: left !important;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            
            .hero-section-responsive .hero-left-content p {
              font-size: 1.125rem !important;
              line-height: 1.6 !important;
              margin-bottom: 1.5rem !important;
              text-align: left !important;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
          }
        `,
      }}
    />
  );
};

export default CriticalCSS;
