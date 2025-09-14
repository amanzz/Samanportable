import React, { useEffect, useState } from 'react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  selector?: string;
}

const AccessibilityChecker: React.FC = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') return;

    // Toggle visibility with Ctrl+Shift+A
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsVisible(prev => !prev);
        if (!isVisible) {
          runAccessibilityCheck();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  const runAccessibilityCheck = () => {
    const newIssues: AccessibilityIssue[] = [];

    // Check for images without alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        newIssues.push({
          type: 'error',
          message: 'Image missing alt text',
          element: `img[${index}]`,
          selector: `img:nth-child(${index + 1})`
        });
      }
    });

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const hasText = button.textContent && button.textContent.trim() !== '';
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasAriaLabelledby = button.getAttribute('aria-labelledby');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
        newIssues.push({
          type: 'error',
          message: 'Button missing accessible name',
          element: `button[${index}]`,
          selector: `button:nth-child(${index + 1})`
        });
      }
    });

    // Check for links without discernible text
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      const hasText = link.textContent && link.textContent.trim() !== '';
      const hasAriaLabel = link.getAttribute('aria-label');
      const hasAriaLabelledby = link.getAttribute('aria-labelledby');
      const hasImage = link.querySelector('img');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasImage) {
        newIssues.push({
          type: 'error',
          message: 'Link missing discernible text',
          element: `a[${index}]`,
          selector: `a:nth-child(${index + 1})`
        });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`);
      
      if (!hasLabel) {
        newIssues.push({
          type: 'warning',
          message: 'Form input missing label',
          element: `${input.tagName.toLowerCase()}[${index}]`,
          selector: `${input.tagName.toLowerCase()}:nth-child(${index + 1})`
        });
      }
    });

    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel - previousLevel > 1) {
        newIssues.push({
          type: 'warning',
          message: `Heading level skipped: ${previousLevel} → ${currentLevel}`,
          element: `${heading.tagName}[${index}]`,
          selector: `${heading.tagName}:nth-child(${index + 1})`
        });
      }
      previousLevel = currentLevel;
    });

    // Check for color contrast issues (basic check)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    textElements.forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Basic contrast check (this is simplified - real contrast checking needs more sophisticated analysis)
      if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgba(0, 0, 0, 0)') {
        newIssues.push({
          type: 'info',
          message: 'Potential contrast issue: white text on transparent background',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          selector: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`
        });
      }
    });

    setIssues(newIssues);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-w-md max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Accessibility Checker</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        {issues.length === 0 ? (
          <p className="text-sm text-gray-600">No accessibility issues found! 🎉</p>
        ) : (
          issues.map((issue, index) => (
            <div key={index} className="p-2 border rounded text-xs">
              <div className="flex items-start gap-2">
                <span className="text-lg">{getIssueIcon(issue.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{issue.message}</p>
                  {issue.element && (
                    <p className="text-gray-600 mt-1 font-mono text-xs">
                      Element: {issue.element}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Press Ctrl+Shift+A to toggle • {issues.length} issues found
      </div>
    </div>
  );
};

export default AccessibilityChecker;

