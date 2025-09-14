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
export function parseShortDescriptionTable(shortDescription: string): {
  size?: string;
  materials?: string;
  brand?: string;
} {
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
    const result: {
      size?: string;
      materials?: string;
      brand?: string;
    } = {};

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const key = cells[0]?.textContent?.trim().toLowerCase();
        const value = cells[1]?.textContent?.trim();

        if (key && value) {
          switch (key) {
            case 'size':
              result.size = value;
              break;
            case 'materials':
              result.materials = value;
              break;
            case 'brand':
              result.brand = value;
              break;
          }
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error parsing short description table:', error);
    return {};
  }
}

// Consistent HTML entity decoding for both server and client
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8242;/g, "'")
    .replace(/&#8243;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"');
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
export function parseShortDescriptionTableSSR(shortDescription: string): {
  size?: string;
  materials?: string;
  brand?: string;
} {
  if (!shortDescription) {
    return {};
  }

  try {
    // Simple regex-based parsing for server-side
    const result: {
      size?: string;
      materials?: string;
      brand?: string;
    } = {};

    // Extract all td elements first
    const tdRegex = /<td[^>]*>([^<]*?)<\/td>/gi;
    const tdMatches = [];
    let match;

    while ((match = tdRegex.exec(shortDescription)) !== null) {
      tdMatches.push(match[1]?.trim());
    }

    // Process td elements in pairs (key-value pairs)
    for (let i = 0; i < tdMatches.length; i += 2) {
      if (i + 1 < tdMatches.length) {
        let key = tdMatches[i]?.toLowerCase();
        let value = tdMatches[i + 1];

        // Use consistent HTML entity decoding for both server and client
        key = decodeHtmlEntities(key);
        value = decodeHtmlEntities(value);

        if (key && value) {
          switch (key) {
            case 'size':
              result.size = value;
              break;
            case 'materials':
              result.materials = value;
              break;
            case 'brand':
              result.brand = value;
              break;
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
