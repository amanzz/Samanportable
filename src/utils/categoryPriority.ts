/**
 * Category priority mapping based on the desired order from the screenshot
 * This ensures products are displayed in the correct category order
 */
export const CATEGORY_PRIORITY: { [key: string]: number } = {
  'portable-cabin': 1,
  'container-offices': 2,
  'porta-cabins': 3,
  'labor-colony': 4,
  'portable-office': 5,
  'container-cafe': 6,
  'industrial-sheds': 7, // Add industrial-sheds with lower priority
};

// Debug function to log category priorities
export function debugCategoryPriorities() {
  console.log('Category Priority Mapping:', CATEGORY_PRIORITY);
}

/**
 * Sort products by category priority
 * @param products Array of products with categories
 * @returns Sorted array of products
 */
export function sortProductsByCategoryPriority<T extends { categories?: Array<{ slug: string }> }>(
  products: T[]
): T[] {
  return [...products].sort((a, b) => {
    const categoryA = a.categories?.[0]?.slug || '';
    const categoryB = b.categories?.[0]?.slug || '';
    
    const priorityA = CATEGORY_PRIORITY[categoryA] || 999; // Unknown categories go to end
    const priorityB = CATEGORY_PRIORITY[categoryB] || 999;
    
    return priorityA - priorityB;
  });
}
