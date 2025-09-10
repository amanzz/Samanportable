import React, { useState, useEffect } from 'react';
import { Clock, Image as ImageIcon, Zap } from 'lucide-react';

interface CategoryPerformanceMonitorProps {
  totalImages: number;
}

const CategoryPerformanceMonitor: React.FC<CategoryPerformanceMonitorProps> = ({
  totalImages
}) => {
  const [loadedImages, setLoadedImages] = useState(0);
  const [startTime] = useState(Date.now());

  // Simple image load tracking
  useEffect(() => {
    const handleImageLoad = () => {
      setLoadedImages(prev => prev + 1);
    };

    // Listen for image load events
    document.addEventListener('load', handleImageLoad, true);

    return () => {
      document.removeEventListener('load', handleImageLoad, true);
    };
  }, []);

  const loadTime = Date.now() - startTime;
  const progress = totalImages > 0 ? (loadedImages / totalImages) * 100 : 0;

  return (
    <div className="fixed top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg z-40 max-w-xs">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Image Loading
        </h3>
      
      <div className="space-y-3 text-xs">
        {/* Progress */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium">
            {loadedImages} / {totalImages}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Load Time */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Time:</span>
          <span className={`font-medium ${loadTime <= 2000 ? 'text-green-600' : loadTime <= 5000 ? 'text-yellow-600' : 'text-red-600'}`}>
            {loadTime}ms
          </span>
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status:</span>
            <div className="flex items-center gap-1">
              {loadTime <= 2000 ? (
                <Zap className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-600" />
              )}
              <span className={`text-xs ${loadTime <= 2000 ? 'text-green-600' : 'text-yellow-600'}`}>
                {loadTime <= 2000 ? 'Fast' : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPerformanceMonitor;

