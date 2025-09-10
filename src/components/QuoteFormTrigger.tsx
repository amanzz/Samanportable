import { useState } from 'react';
import { Button } from './ui/button';
import { QuoteIcon } from 'lucide-react';
import QuoteFormPopup from './QuoteFormPopup';

interface QuoteFormTriggerProps {
  variant?: 'default' | 'outline' | 'ghost' | 'white';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  className?: string;
}

const QuoteFormTrigger = ({ 
  variant = 'default', 
  size = 'default', 
  children = 'Get Free Quote',
  className = ''
}: QuoteFormTriggerProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={openPopup}
        className={`${className}`}
      >
        {children}
      </Button>
      
      <QuoteFormPopup isOpen={isPopupOpen} onClose={closePopup} />
    </>
  );
};

export default QuoteFormTrigger;

