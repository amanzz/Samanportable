import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  isLoading: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning Loader */}
        <div className="relative">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-200 rounded-full"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading...</h3>
          <p className="text-sm text-gray-600">Please wait while we prepare your page</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

