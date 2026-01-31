# Shabdly UI Components - Quick Reference

## Overview
This document provides a quick reference for using the reusable UI components in `/home/user/webapp/src/lib/components.ts`.

---

## 🎨 Available Components

### 1. Logo Component
```typescript
import { getLogo } from '../../lib/components';

// With text
${getLogo(true)}

// Icon only
${getLogo(false)}
```

**Features**:
- Purple gradient logo
- Automatic fallback if image fails
- Responsive sizing
- Vector and raster formats available

---

### 2. Navigation Bar
```typescript
import { getNavigation } from '../../lib/components';

// Basic navigation
${getNavigation()}

// With active page highlighting
${getNavigation('/help')}
```

**Features**:
- Sticky top navigation
- Logo integration
- Mobile responsive hamburger menu
- Active page highlighting
- Quick Dashboard access

**Navigation Links**:
- Home (/)
- Features (/#features)
- Pricing (/#pricing)
- Help (/help)
- FAQ (/faq)
- Dashboard (/dashboard)

---

### 3. Breadcrumbs
```typescript
import { getBreadcrumbs } from '../../lib/components';

// Define breadcrumb trail
const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Help Center', href: '/help' },
  { label: 'Current Article', href: '/help/article-slug' }
];

// Render breadcrumbs
${getBreadcrumbs(breadcrumbs)}
```

**Features**:
- Hierarchical navigation
- Clickable parent links
- Current page in bold
- Chevron separators (›)
- Responsive design

**Example Output**:
```
Home › Help Center › Current Article
```

---

### 4. Page Navigation (Back/Forward)
```typescript
import { getPageNavigation } from '../../lib/components';

// With back button only
${getPageNavigation({ showBackButton: true })}

// With previous and next pages
${getPageNavigation({
  previousPage: { label: 'Previous Article', href: '/help/prev' },
  nextPage: { label: 'Next Article', href: '/help/next' },
  showBackButton: true
})}
```

**Features**:
- Browser history integration
- Previous/Next page navigation
- Styled buttons with icons
- Responsive layout

---

### 5. Footer
```typescript
import { getFooter } from '../../lib/components';

// Add footer to page
${getFooter()}
```

**Features**:
- 4-column layout
- Product, Company, Support links
- Logo integration
- Copyright and location
- Responsive grid layout

**Footer Sections**:
- **Product**: Features, Pricing, Documentation, FAQ
- **Company**: About, Contact, Terms, Privacy
- **Support**: Help Center, Refund Policy, Email Support
- **Brand**: Logo, tagline, location

---

### 6. Go-to-Top Button
```typescript
import { goToTopButton } from '../../lib/components';

// Add button to page (add before </body>)
${goToTopButton}
```

**Features**:
- Fixed bottom-right position
- Shows after 400px scroll
- Smooth scroll animation
- Hover effects
- Circular design with icon

**Behavior**:
- Hidden by default
- Fades in after scrolling 400px
- Animates on hover
- Smooth scroll to top on click

---

### 7. Shared Styles
```typescript
import { sharedStyles } from '../../lib/components';

// Add to <head> section
<head>
    ...
    ${sharedStyles}
</head>
```

**Includes**:
- Go-to-Top button styles
- Logo container styles
- Breadcrumb styles
- Navigation button styles
- Responsive utilities

---

### 8. Complete Page Template
```typescript
import { createPageTemplate } from '../../lib/components';

// Create a full page
const htmlContent = createPageTemplate({
  title: 'Page Title',
  description: 'Page description for SEO',
  currentPage: '/current-path',
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Current Page', href: '/current' }
  ],
  content: `
    <div class="content">
      <!-- Your page content here -->
    </div>
  `,
  showBackButton: true,
  previousPage: { label: 'Previous', href: '/prev' },
  nextPage: { label: 'Next', href: '/next' }
});

return c.html(htmlContent);
```

**Features**:
- Complete HTML structure
- All components integrated
- Responsive layout
- SEO-friendly
- Consistent styling

---

## 🎯 Usage Examples

### Example 1: Simple Info Page
```typescript
import { Hono } from 'hono';
import { getNavigation, getBreadcrumbs, getFooter, goToTopButton } from '../lib/components';

const app = new Hono();

app.get('/about', (c) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' }
  ];

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>About - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="/static/global.css" rel="stylesheet">
    </head>
    <body>
        ${getNavigation('/about')}
        ${getBreadcrumbs(breadcrumbs)}
        
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1>About Shabdly</h1>
            <!-- Your content -->
        </div>
        
        ${getFooter()}
        ${goToTopButton}
        <script src="/static/global.js"></script>
    </body>
    </html>
  `);
});
```

### Example 2: Help Article with Navigation
```typescript
app.get('/help/:slug', async (c) => {
  const slug = c.req.param('slug');
  const article = await fetchArticle(slug);
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Help Center', href: '/help' },
    { label: article.title, href: `/help/${slug}` }
  ];

  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>${article.title} - Shabdly Help</title>
        <link href="/static/global.css" rel="stylesheet">
    </head>
    <body>
        ${getNavigation('/help')}
        ${getBreadcrumbs(breadcrumbs)}
        
        <div class="max-w-4xl mx-auto px-4 py-12">
            ${getPageNavigation({ showBackButton: true })}
            
            <article>
                <h1>${article.title}</h1>
                <div>${article.content}</div>
            </article>
            
            ${getPageNavigation({
              previousPage: article.prev ? { label: article.prev.title, href: `/help/${article.prev.slug}` } : undefined,
              nextPage: article.next ? { label: article.next.title, href: `/help/${article.next.slug}` } : undefined,
              showBackButton: false
            })}
        </div>
        
        ${getFooter()}
        ${goToTopButton}
    </body>
    </html>
  `);
});
```

### Example 3: Using Page Template
```typescript
import { createPageTemplate } from '../lib/components';

app.get('/contact', (c) => {
  const content = `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
      <form>
        <!-- Contact form fields -->
      </form>
    </div>
  `;

  return c.html(createPageTemplate({
    title: 'Contact',
    description: 'Get in touch with Shabdly support team',
    currentPage: '/contact',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contact' }
    ],
    content: content,
    showBackButton: true
  }));
});
```

---

## 🎨 Styling Classes

### Layout Classes
```css
.max-w-4xl mx-auto px-4 py-12  /* Standard page container */
.max-w-7xl mx-auto px-4         /* Wide page container */
.grid grid-cols-1 md:grid-cols-2  /* Responsive grid */
```

### Component Classes
```css
.logo-container      /* Logo and text wrapper */
.logo-image          /* Logo image styling */
.logo-text           /* Logo text with gradient */
.breadcrumb          /* Breadcrumb navigation */
.breadcrumb-separator /* Chevron between items */
.breadcrumb-current  /* Current page indicator */
.nav-btn             /* Navigation button */
.nav-btn.primary     /* Primary action button */
```

### Go-to-Top Button Classes
```css
#goToTopBtn          /* Button element */
#goToTopBtn.show     /* Visible state */
#goToTopBtn:hover    /* Hover effects */
```

---

## 🔧 Configuration

### Global CSS File
`/home/user/webapp/public/static/global.css`
- Button styles
- Component utilities
- Responsive breakpoints

### Global JS File
`/home/user/webapp/public/static/global.js`
- Go-to-Top button logic
- Scroll event handlers
- Mobile menu toggle

### Logo Files
- `/public/static/logo.svg` (vector)
- `/public/static/logo.png` (raster)

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints Used
```
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Mobile Menu
- Hidden on desktop (md:hidden)
- Visible on mobile with hamburger button
- Toggle with `toggleMobileMenu()` function

---

## ♿ Accessibility Features

- Semantic HTML elements (nav, footer, article)
- ARIA labels on breadcrumbs
- Alt text on all images
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast ratios

---

## 🚀 Performance Tips

1. **Lazy load images**: Logo uses error handling
2. **CDN resources**: Tailwind, Font Awesome from CDN
3. **Minimal JavaScript**: Only essential scripts
4. **CSS inlining**: Shared styles embedded in components
5. **Responsive images**: SVG logo scales without quality loss

---

## 📚 Related Files

- Component definitions: `/home/user/webapp/src/lib/components.ts`
- Page templates: `/home/user/webapp/src/routes/ecommerce/pages.ts`
- Global styles: `/home/user/webapp/public/static/global.css`
- Global scripts: `/home/user/webapp/public/static/global.js`
- Logo assets: `/home/user/webapp/public/static/logo.*`

---

*Quick Reference - Last updated: January 31, 2026*
