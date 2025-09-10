import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import QuoteForm from './QuoteForm';

interface QuoteFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const QuoteFormPopup: React.FC<QuoteFormPopupProps> = ({ isOpen, onClose, productName }) => {
  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }

    return () => {
      document.body.classList.remove('popup-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Create portal content
  const portalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 quote-form-popup"
      style={{ zIndex: 2147483647 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300" style={{ zIndex: 2147483647 }}>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#0A3D2A] to-[#1a5f3a] px-3 sm:px-4 py-2 sm:py-3 relative">
          <h2 className="text-base sm:text-lg font-bold text-white text-center">
            Get Your Free Quote
          </h2>
          <p className="text-white/90 text-xs text-center mt-0.5">
            We&apos;ll get back to you within 24 hours
          </p>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/25 hover:bg-white/40 transition-all duration-200 quote-form-close-btn group border border-white/30 flex items-center justify-center"
            aria-label="Close quote form"
          >
            <X className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-3 sm:p-4 quote-form-container">
          <QuoteForm variant="popup" onClose={onClose} />
        </div>
      </div>
    </div>
  );

  // Render using portal to avoid stacking context issues
  return createPortal(portalContent, document.body);
};

export default QuoteFormPopup;

