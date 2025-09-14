import React, { useState, useEffect } from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSuccessMessageProps {
  orderNumber?: string;
  onClose?: () => void;
  onRedirect?: () => void;
}

const OrderSuccessMessage: React.FC<OrderSuccessMessageProps> = ({ 
  orderNumber, 
  onClose,
  onRedirect
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your order has been placed and is being processed. 
            {orderNumber && (
              <span className="block mt-2 font-medium">
                Order #: {orderNumber}
              </span>
            )}
            <span className="block mt-2 text-sm text-gray-600">
              Order ID: {orderNumber}
            </span>
            <span className="block mt-2 text-sm text-gray-500">
              Redirecting to My Orders in {countdown} second{countdown !== 1 ? 's' : ''}...
            </span>
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              onClick={onRedirect}
            >
              <Package className="w-4 h-4 mr-2" />
              View My Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {onClose && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              You will be redirected to your orders page shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessMessage;

