/**
 * Content Utilities for SEO Optimization
 * Prevents duplicate content and keyword stuffing issues
 */

/**
 * Clean and optimize product description for SEO
 * @param description - Raw product description
 * @param maxLength - Maximum length for description
 * @returns Cleaned and optimized description
 */
export function cleanProductDescription(
  description: string | undefined | null,
  maxLength: number = 160
): string {
  if (!description) return '';
  
  // Remove HTML tags
  let cleaned = description.replace(/<[^>]*>/g, '').trim();
  
  // Remove extra whitespace and line breaks
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Truncate if too long
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength - 3) + '...';
  }
  
  return cleaned;
}

/**
 * Generate unique meta description for product
 * @param product - Product object
 * @param category - Product category
 * @returns Unique meta description
 */
export function generateProductMetaDescription(
  product: any,
  category: string
): string {
  const baseDescription = cleanProductDescription(product.description, 120);
  
  if (baseDescription) {
    return baseDescription;
  }
  
  // Fallback: Create unique description based on product name and category
  const categoryKeywords = {
    'portable-office': 'portable office solutions',
    'container-office': 'container office solutions', 
    'prefab-solutions': 'prefab construction solutions',
    'portable-cabin': 'portable cabin solutions'
  };
  
  const categoryKeyword = categoryKeywords[category as keyof typeof categoryKeywords] || 'portable solutions';
  return `${product.name} - Quality ${categoryKeyword} by Saman Portable. Customizable and durable structures for your business needs.`;
}

/**
 * Generate unique content for product tabs
 * @param product - Product object
 * @returns Unique content for display
 */
export function generateProductTabContent(product: any): string {
  // Use main description if available
  if (product.description) {
    return product.description;
  }
  
  // Use short description as fallback
  if (product.short_description) {
    return product.short_description;
  }
  
  // Generate minimal content
  return `<p>${product.name} - Quality portable solution with customization options available.</p>`;
}

/**
 * Generate structured data description without keyword stuffing
 * @param product - Product object
 * @param category - Product category
 * @returns Clean description for structured data
 */
export function generateStructuredDataDescription(
  product: any,
  category: string
): string {
  let description = cleanProductDescription(product.description, 500);
  
  if (!description) {
    description = cleanProductDescription(product.short_description, 500);
  }
  
  if (!description) {
    const categoryMap = {
      'portable-office': 'portable office',
      'container-office': 'container office',
      'prefab-solutions': 'prefab solution',
      'portable-cabin': 'portable cabin'
    };
    
    const type = categoryMap[category as keyof typeof categoryMap] || 'portable solution';
    description = `${product.name} - Quality ${type} with customization options.`;
  }
  
  // Ensure minimum length for structured data
  if (description.length < 50) {
    description += ' Durable and customizable structure for various applications.';
  }
  
  // Ensure maximum length for structured data
  if (description.length > 5000) {
    description = description.substring(0, 4997) + '...';
  }
  
  return description;
}

/**
 * Check for duplicate content patterns
 * @param content1 - First content string
 * @param content2 - Second content string
 * @returns True if content is significantly similar
 */
export function isDuplicateContent(content1: string, content2: string): boolean {
  if (!content1 || !content2) return false;
  
  const clean1 = cleanProductDescription(content1).toLowerCase();
  const clean2 = cleanProductDescription(content2).toLowerCase();
  
  // Check if one content is contained in another (80% similarity threshold)
  const similarity = calculateSimilarity(clean1, clean2);
  return similarity > 0.8;
}

/**
 * Calculate similarity between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity percentage (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Edit distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
