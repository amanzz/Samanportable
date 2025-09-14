# Saman Portable Office Solutions Design Rules

## Design Patterns & Components

### Color Theme
- Primary Green Theme (Saman Brand)
  ```css
  --primary: 158 72% 20%;
  --primary-foreground: 0 0% 100%;
  --primary-light: 158 72% 30%;
  --primary-dark: 158 72% 10%;
  ```
- Accent Yellow (Saman Accent)
  ```css
  --accent: 45 100% 60%;
  --accent-foreground: 0 0% 11%;
  ```
- Background & Text Colors
  ```css
  --background: 0 0% 96%;
  --foreground: 0 0% 11%;
  ```

### Typography
- Primary Font: 'Inter' with system fallbacks
- Font Features: Kerning, Font Smoothing, Ligatures enabled
- Text Rendering: Optimized Legibility

### Reusable Components

1. Hero Section
   - Use existing `HeroSection.tsx` component
   - Maintains consistent grid layout and responsive design
   - Includes title, description, and CTA buttons
   - Optimized for LCP with background image loading

2. Button Styles
   - Use `.btn-primary` class for main actions
   - Gradient background with hover effects
   - Consistent padding and border radius
   - Smooth transitions on interaction

3. Card Layouts
   - Use `.card-stable` class for consistent card design
   - Fixed aspect ratios for images
   - Hover effects with shadow and transform
   - Flexible content area

4. Loading States
   - Use `.shimmer` class for skeleton loading
   - Consistent loading animations
   - Optimized for performance

### Animation Guidelines
- Use existing animation classes:
  - `.fade-in` for general transitions
  - `.fade-in-up` for content entry
  - `.slide-in-left/.slide-in-right` for side entries
  - Stagger animations available (`.stagger-1` to `.stagger-6`)

### Layout & Spacing
- Use `.section-padding` for consistent vertical spacing
- Use `.container-padding` for horizontal container padding
- Maintain grid system with `.grid-stable` class

## Best Practices

1. Component Reuse
   - Always check existing components before creating new ones
   - Extend existing components when possible
   - Maintain consistent props and naming conventions

2. Performance Optimization
   - Use provided loading states and animations
   - Follow image optimization guidelines with next/image
   - Implement lazy loading for below-fold content

3. Accessibility
   - Maintain WCAG compliance
   - Use semantic HTML elements
   - Ensure proper color contrast
   - Support reduced motion preferences

4. Responsive Design
   - Follow mobile-first approach
   - Use existing breakpoint system
   - Maintain consistent spacing across devices

## Development Guidelines

1. Creating New Components
   - Check existing components first
   - Follow established naming conventions
   - Implement consistent prop interfaces
   - Add proper TypeScript types
   - Include loading states

2. Modifying Existing Components
   - Maintain backward compatibility
   - Update documentation
   - Test across all breakpoints
   - Verify accessibility compliance

3. Code Organization
   - Keep components focused and single-purpose
   - Maintain consistent file structure
   - Follow established import patterns
   - Use proper TypeScript types

4. Performance Considerations
   - Implement proper code splitting
   - Optimize for Core Web Vitals
   - Follow image optimization guidelines
   - Minimize bundle size

## SEO Guidelines

1. Meta Tags
   - Use proper title and description
   - Implement Open Graph tags
   - Add Twitter card meta tags
   - Include proper canonical URLs

2. Content Structure
   - Use semantic HTML
   - Implement proper heading hierarchy
   - Add structured data where applicable
   - Optimize for featured snippets

## Testing Requirements

1. Component Testing
   - Test across all breakpoints
   - Verify accessibility compliance
   - Check performance metrics
   - Validate SEO requirements

2. Cross-browser Testing
   - Test in major browsers
   - Verify responsive behavior
   - Check animations and transitions
   - Validate form interactions

## Documentation

1. Component Documentation
   - Document props and types
   - Include usage examples
   - Add accessibility notes
   - Document any dependencies

2. Style Documentation
   - Document custom classes
   - Include theme variables
   - Add usage guidelines
   - Document breakpoints

These rules ensure consistency across the project while maintaining high performance and accessibility standards. Always refer to existing components and patterns before creating new ones, and follow the established guidelines for modifications and additions.