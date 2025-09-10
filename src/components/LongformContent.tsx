import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown, BookOpen, List, ArrowUp } from 'lucide-react';

interface LongformContentProps {
  content: string;
  title?: string;
  disableFAQDetection?: boolean;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface ParsedSection {
  id: string;
  title: string;
  content: string;
  type: 'section' | 'faq' | 'table' | 'list';
}

const LongformContent: React.FC<LongformContentProps> = ({ content, title, disableFAQDetection = false }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [showStickyTOC, setShowStickyTOC] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Parse content into sections
  const parsedContent = useMemo(() => {
    if (!content || !isClient) return { sections: [], toc: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    const sections: ParsedSection[] = [];
    const toc: TOCItem[] = [];
    
    // Find only h1 and h2 headings for TOC
    const headings = doc.querySelectorAll('h1, h2');
    let sectionCounter = 1;
    
    let i = 0;
    while (i < headings.length) {
      const heading = headings[i];
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent?.trim() || '';
      const id = `section-${sectionCounter}`;
      
      // Skip FAQ detection if disabled (for blog posts that already have WordPress FAQs)
      let shouldTreatAsFAQ = false;
      
      if (!disableFAQDetection) {
        // Check if this is an FAQ section - more strict criteria for blog posts
        const isFAQSection = (
          text.toLowerCase().includes('faq') || 
          text.toLowerCase().includes('frequently asked questions') ||
          (text.toLowerCase().includes('question') && text.toLowerCase().includes('answer'))
        );
        
        // Additional check: if this looks like a question but we're not in a clear FAQ context,
        // check if there are multiple question-like headings nearby
        shouldTreatAsFAQ = isFAQSection;
        if (!isFAQSection && /^(what|how|why|when|where|which|can|do|does|is|are)/i.test(text)) {
          // Count question-like headings in the next few headings
          let questionCount = 1; // Current heading
          for (let j = i + 1; j < Math.min(i + 5, headings.length); j++) {
            const nextHeadingText = headings[j].textContent?.trim() || '';
            if (/^(what|how|why|when|where|which|can|do|does|is|are)/i.test(nextHeadingText)) {
              questionCount++;
            }
          }
          // If we have 3+ question-like headings in sequence, treat as FAQ
          shouldTreatAsFAQ = questionCount >= 3;
        }
      }
      
      if (shouldTreatAsFAQ) {
        // Add to TOC
        toc.push({ id, text, level });
        
        // Collect content for this FAQ section only until next heading
        let faqContent = '';
        let currentElement = heading.nextElementSibling;
        
        // Collect content until we hit h1 or h2 heading (matching TOC structure)
        while (currentElement && !currentElement.matches('h1, h2')) {
          faqContent += currentElement.outerHTML;
          currentElement = currentElement.nextElementSibling;
        }
        
        sections.push({
          id,
          title: text,
          content: faqContent,
          type: 'faq'
        });
      } else {
        // Add to TOC
        toc.push({ id, text, level });
        
        // Create regular section
        let sectionContent = '';
        let currentElement = heading.nextElementSibling;
        
        // Collect content until next h1 or h2 heading (matching TOC structure)
        while (currentElement && !currentElement.matches('h1, h2')) {
          sectionContent += currentElement.outerHTML;
          currentElement = currentElement.nextElementSibling;
        }
        
        // Determine section type
        let type: ParsedSection['type'] = 'section';
        if (sectionContent.includes('<table')) type = 'table';
        else if (sectionContent.includes('<ul') || sectionContent.includes('<ol')) type = 'list';
        
        sections.push({
          id,
          title: text,
          content: sectionContent,
          type
        });
      }
      
      sectionCounter++;
      i++;
    }
    
    return { sections, toc };
  }, [content, isClient]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 300);

      // Check if normal TOC is out of view to show sticky TOC
      const normalTOC = document.querySelector('.normal-toc');
      const isMobile = window.innerWidth < 640;
      
      if (normalTOC) {
        const rect = normalTOC.getBoundingClientRect();
        // Show sticky when normal TOC is completely out of view
        const threshold = isMobile ? -10 : window.innerWidth >= 1024 ? 100 : 80;
        setShowStickyTOC(rect.bottom < threshold);
      } else {
        // If no normal TOC found, show sticky TOC after scrolling
        setShowStickyTOC(scrollTop > 200);
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll('[data-section-id]');
      let current = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Mobile: Use 80px threshold, Desktop: 120px for large screens
        const threshold = window.innerWidth < 640 ? 80 : window.innerWidth >= 1024 ? 120 : 100;
        if (rect.top <= threshold && rect.bottom >= threshold) {
          current = section.getAttribute('data-section-id') || '';
        }
      });
      
      if (current !== activeSection) {
        setActiveSection(current);
        
        // Auto-scroll TOC to center active item for both normal and sticky TOC
        setTimeout(() => {
          // For sticky TOC (when visible)
          if (showStickyTOC) {
            const stickyTocContainer = document.querySelector('.sticky .toc-scroll-container');
            const stickyActiveButton = stickyTocContainer?.querySelector(`button[data-toc-id="${current}"]`);
            
            if (stickyActiveButton && stickyTocContainer) {
              const containerRect = stickyTocContainer.getBoundingClientRect();
              const buttonRect = stickyActiveButton.getBoundingClientRect();
              const scrollLeft = buttonRect.left - containerRect.left - (containerRect.width / 2) + (buttonRect.width / 2);
              
              stickyTocContainer.scrollTo({
                left: stickyTocContainer.scrollLeft + scrollLeft,
                behavior: 'smooth'
              });
            }
          } else {
            // For normal TOC (when sticky is not visible)
            const normalTocContainer = document.querySelector('.normal-toc .toc-scroll-container');
            const normalActiveButton = normalTocContainer?.querySelector(`button[data-toc-id="${current}"]`);
            
            if (normalActiveButton && normalTocContainer) {
              const containerRect = normalTocContainer.getBoundingClientRect();
              const buttonRect = normalActiveButton.getBoundingClientRect();
              const scrollLeft = buttonRect.left - containerRect.left - (containerRect.width / 2) + (buttonRect.width / 2);
              
              normalTocContainer.scrollTo({
                left: normalTocContainer.scrollLeft + scrollLeft,
                behavior: 'smooth'
              });
            }
          }
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, parsedContent.toc.length, showStickyTOC]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFAQs(newExpanded);
  };

  const renderFAQContent = (content: string, sectionId: string) => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const questions = doc.querySelectorAll('h3, h4, h5, h6');
    
    if (questions.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return (
      <div className="space-y-3">
        {Array.from(questions).map((question, index) => {
          const faqId = `${sectionId}-faq-${index}`;
          const isExpanded = expandedFAQs.has(faqId);
          
          let answerContent = '';
          let nextElement = question.nextElementSibling;
          
          while (nextElement && !nextElement.matches('h3, h4, h5, h6')) {
            answerContent += nextElement.outerHTML;
            nextElement = nextElement.nextElementSibling;
          }
          
          return (
            <div key={faqId} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(faqId)}
                className="w-full px-4 py-3 text-left bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {question.textContent}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>
              {isExpanded && (
                <div className="px-4 py-3 bg-background border-t border-border">
                  <div dangerouslySetInnerHTML={{ __html: answerContent }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!content || parsedContent.sections.length === 0) {
    return (
      <Card className="p-6 bg-card border border-border">
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No detailed description available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="longform-content-wrapper">
      {/* Progress Bar - Ultra Thin & Bright Green */}
      <div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-green-500 z-50 transition-transform duration-300 shadow-sm"
        style={{ transform: `scaleX(${scrollProgress / 100})`, transformOrigin: '0 50%' }}
      />

      {/* Normal TOC Navigation - Same width as content card */}
      {parsedContent.toc.length > 0 && (
        <Card className="normal-toc p-3 mb-2 bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <List className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold text-foreground">Table of Contents</h3>
          </div>
          <div 
            className="overflow-x-auto toc-scroll-container" 
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: '#16a34a #f1f5f9'
            } as React.CSSProperties}
          >
            <div className="flex gap-1 sm:gap-2 min-w-max">
              {parsedContent.toc.map((item, index) => {
                return (
                  <button
                    key={item.id}
                    data-toc-id={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-all duration-300 transform hover:scale-105 border ${
                      activeSection === item.id
                        ? 'text-white border-[#0E583D] shadow-lg shadow-green-500/25'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-white hover:border-[#0E583D] hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: activeSection === item.id ? '#0E583D' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.backgroundColor = '#0E583D';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                        activeSection === item.id ? 'bg-white' : 'bg-green-500'
                      }`}></span>
                      <span className="truncate max-w-[80px] sm:max-w-[150px] lg:max-w-none">{item.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Sticky TOC Navigation - Full Width - Compact Mode */}
      {parsedContent.toc.length > 0 && showStickyTOC && (
        <div className="fixed top-14 sm:top-16 lg:top-20 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-border shadow-lg sticky-toc-mobile">
          <div 
            className="max-w-full overflow-x-auto px-2 sm:px-4 lg:px-6 toc-scroll-container" 
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: '#16a34a #f1f5f9'
            } as React.CSSProperties}
          >
            <div className="flex gap-1 sm:gap-2 py-1.5 sm:py-2.5 min-w-max">
              {parsedContent.toc.map((item, index) => {
                return (
                  <button
                    key={`sticky-${item.id}`}
                    data-toc-id={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`whitespace-nowrap px-1.5 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-md transition-all duration-300 transform hover:scale-105 active:scale-95 border touch-manipulation ${
                      activeSection === item.id
                        ? 'text-white border-[#0E583D] shadow-lg shadow-green-500/25'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-white hover:border-[#0E583D] hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: activeSection === item.id ? '#0E583D' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.backgroundColor = '#0E583D';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                        activeSection === item.id ? 'bg-white' : 'bg-green-500'
                      }`}></span>
                      <span className="truncate max-w-[80px] sm:max-w-[150px] lg:max-w-none">{item.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-2 sm:space-y-4">
        {parsedContent.sections.map((section, index) => (
          <Card 
            key={section.id}
            id={section.id}
            data-section-id={section.id}
            className="p-6 bg-card border border-border shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Section Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {section.type === 'table' ? (
                  <List className="w-5 h-5 text-primary" />
                ) : section.type === 'faq' ? (
                  <ChevronDown className="w-5 h-5 text-primary" />
                ) : (
                  <BookOpen className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {section.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Section {index + 1} of {parsedContent.sections.length}
                </p>
              </div>
            </div>

            {/* Section Content */}
            <div className="longform-section-content">
              {section.type === 'faq' ? (
                renderFAQContent(section.content, section.id)
              ) : (
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-6 right-6 w-12 h-12 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
          size="sm"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default LongformContent;