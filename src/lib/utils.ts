import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent number formatting to prevent hydration errors
export function formatPrice(price: number): string {
  // Use a consistent format that matches server and client
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format price with currency symbol
export function formatPriceWithCurrency(price: number): string {
  return `₹${formatPrice(price)}`;
}

// Format price without currency symbol
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Parse WordPress short description to extract table data
export function parseShortDescriptionTable(shortDescription: string): Record<string, string> {
  if (!shortDescription) {
    return {};
  }

  try {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(shortDescription, 'text/html');
    
    // Find the table in the short description
    const table = doc.querySelector('table');
    if (!table) {
      return {};
    }

    const rows = table.querySelectorAll('tr');
    const result: Record<string, string> = {};

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const key = cells[0]?.textContent?.trim();
        const value = cells[1]?.textContent?.trim();

        if (key && value) {
          result[key] = value;
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error parsing short description table:', error);
    return {};
  }
}

// Consistent HTML entity decoding for both server and client (browser-safe, SSR-compatible)
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  
  const namedEntities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    rsquo: '’',
    lsquo: '‘',
    rdquo: '”',
    ldquo: '“',
    ndash: '–',
    mdash: '—',
    hellip: '…',
    middot: '·',
    nbsp: ' '
  };

  return str.replace(/&(#(?:\d+|x[a-fA-F0-9]+)|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith('#')) {
      const code = entity.startsWith('#x')
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return !isNaN(code) ? String.fromCharCode(code) : match;
    }
    return namedEntities[entity.toLowerCase()] || match;
  });
}

// Extract buttons and links from short description
export function extractButtonsFromShortDescription(shortDescription: string): Array<{
  text: string;
  href?: string;
  className?: string;
}> {
  if (!shortDescription) {
    return [];
  }

  try {
    const buttons: Array<{ text: string; href?: string; className?: string }> = [];
    
    // Extract <a> tags that look like buttons - handle content with <br /> tags
    const buttonRegex = /<a[^>]*class="[^"]*button[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = buttonRegex.exec(shortDescription)) !== null) {
      // Clean up the button text by removing HTML tags and extra whitespace
      let buttonText = match[1]?.replace(/<[^>]*>/g, '').trim();
      buttonText = decodeHtmlEntities(buttonText);
      
      if (buttonText) {
        // Extract href if present
        const hrefMatch = match[0].match(/href="([^"]*)"/);
        const href = hrefMatch ? hrefMatch[1] : undefined;
        
        buttons.push({
          text: buttonText,
          href: href,
          className: 'button'
        });
      }
    }

    // Also extract any other <a> tags that might be styled as buttons
    const linkRegex = /<a[^>]*style="[^"]*background-color:[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
    while ((match = linkRegex.exec(shortDescription)) !== null) {
      // Clean up the link text by removing HTML tags and extra whitespace
      let linkText = match[1]?.replace(/<[^>]*>/g, '').trim();
      linkText = decodeHtmlEntities(linkText);
      
      if (linkText && !buttons.some(btn => btn.text === linkText)) {
        const hrefMatch = match[0].match(/href="([^"]*)"/);
        const href = hrefMatch ? hrefMatch[1] : undefined;
        
        buttons.push({
          text: linkText,
          href: href,
          className: 'styled-link'
        });
      }
    }

    return buttons;
  } catch (error) {
    console.error('Error extracting buttons from short description:', error);
    return [];
  }
}

// Fallback function for server-side rendering (when DOMParser is not available)
export function parseShortDescriptionTableSSR(shortDescription: string): Record<string, string> {
  if (!shortDescription) {
    return {};
  }

  try {
    const result: Record<string, string> = {};

    // More robust regex to capture content between <td> tags, even if it contains other tags
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    
    let trMatch;
    while ((trMatch = trRegex.exec(shortDescription)) !== null) {
      const trContent = trMatch[1];
      const tdMatches = [];
      let tdMatch;
      
      while ((tdMatch = tdRegex.exec(trContent)) !== null) {
        // Remove all HTML tags from the cell content and decode entities
        let text = tdMatch[1].replace(/<[^>]*>/g, '').trim();
        text = decodeHtmlEntities(text);
        tdMatches.push(text);
      }
      
      if (tdMatches.length >= 2) {
        const key = tdMatches[0];
        const value = tdMatches[1];
        if (key && value) {
          result[key] = value;
        }
      }
    }

    // If no <tr> structure was found, try a flat <td> search as fallback
    if (Object.keys(result).length === 0) {
      const tdMatches = [];
      let tdMatch;
      while ((tdMatch = tdRegex.exec(shortDescription)) !== null) {
        let text = tdMatch[1].replace(/<[^>]*>/g, '').trim();
        text = decodeHtmlEntities(text);
        tdMatches.push(text);
      }
      
      for (let i = 0; i < tdMatches.length; i += 2) {
        if (i + 1 < tdMatches.length) {
          const key = tdMatches[i];
          const value = tdMatches[i + 1];
          if (key && value) {
            result[key] = value;
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing short description table (SSR):', error);
    return {};
  }
}
