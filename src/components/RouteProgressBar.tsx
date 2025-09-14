import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const RouteProgressBar: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const handleStart = () => {
      setIsLoading(true);
      setProgress(0);
      
      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    const handleError = () => {
      setIsLoading(false);
      setProgress(0);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div 
        className="h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="h-1 bg-gray-200" />
    </div>
  );
};

export default RouteProgressBar;

