import localFont from 'next/font/local';

// Configure Inter font with local files for optimal LCP performance
export const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap', // Critical for LCP optimization
  preload: true, // Preload for better performance
  fallback: ['system-ui', 'arial'], // Fallback fonts to prevent layout shift
  variable: '--font-inter', // CSS variable for Tailwind integration
});

// Export className for easy usage
export const interClassName = inter.className;