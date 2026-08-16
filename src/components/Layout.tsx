import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import ProductCalculatorLayoutFallback, {
  needsProductCalculatorLayoutStreamGuard,
} from './ProductCalculatorLayoutFallback';

interface LayoutProps {
  children: React.ReactNode;
  homepageNeutrality?: boolean;
  /** LC-02 - passthrough to Footer's opt-in resource-strip removal. */
  hideFooterResourceStrip?: boolean;
}

export default function Layout({ children, homepageNeutrality = false, hideFooterResourceStrip = false }: LayoutProps) {
  const router = useRouter();
  const hasLayoutStreamGuard = needsProductCalculatorLayoutStreamGuard(router.pathname || '');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Mobile bottom padding - only applied on mobile devices, removed on desktop */}
      <main className={`flex-1 pb-16 lg:pb-0${hasLayoutStreamGuard ? ' calculator-layout-pending' : ''}`}>
        {hasLayoutStreamGuard ? (
          <style dangerouslySetInnerHTML={{ __html: '.calculator-layout-pending:not(.calculator-layout-ready)>:not(style):not(.calculator-layout-fallback){visibility:hidden}' }} />
        ) : null}
        {hasLayoutStreamGuard ? (
          <script dangerouslySetInnerHTML={{ __html: "(()=>{const main=document.currentScript.closest('main');const reveal=()=>{const top=main.querySelector('.grid.grid-cols-1.items-start.gap-6');if(top&&top.nextElementSibling){main.classList.add('calculator-layout-ready');observer.disconnect()}};const observer=new MutationObserver(reveal);observer.observe(main,{childList:true,subtree:true});reveal()})()" }} />
        ) : null}
        {children}
        <ProductCalculatorLayoutFallback />
      </main>
      <Footer homepageNeutrality={homepageNeutrality} hideResourceStrip={hideFooterResourceStrip} />
    </div>
  );
}
