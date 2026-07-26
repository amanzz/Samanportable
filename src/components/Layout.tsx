import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  homepageNeutrality?: boolean;
}

export default function Layout({ children, homepageNeutrality = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Mobile bottom padding - only applied on mobile devices, removed on desktop */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer homepageNeutrality={homepageNeutrality} />
    </div>
  );
}
