import React from 'react';

interface NavigationOptimizerProps {
  children: React.ReactNode;
}

export const NavigationOptimizer: React.FC<NavigationOptimizerProps> = ({ children }) => {
  // Next.js 13+ handles all navigation optimization automatically
  return <>{children}</>;
};

export default NavigationOptimizer;

