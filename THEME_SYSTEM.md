# Theme System - Light/Dark Mode Implementation

## Overview

The Poetry Platform now features a complete theme system with elegant light and dark modes. The system automatically detects user preferences, persists selections, and provides smooth transitions between themes.

## Features

### ✨ Core Features

1. **Light & Dark Mode**
   - Beautiful light mode with soft gradients and subtle patterns
   - Elegant dark mode with deep blues and enhanced contrast
   - Poetic background patterns that adapt to each theme

2. **Automatic Detection**
   - Detects system theme preference on first visit
   - Respects `prefers-color-scheme` media query
   - Falls back to light mode if no preference detected

3. **Persistent Preferences**
   - Saves theme choice to localStorage
   - Remembers user preference across sessions
   - Overrides system preference once user makes a choice

4. **Smooth Transitions**
   - All theme changes animate smoothly (0.3s ease)
   - No flash of unstyled content (FOUC)
   - Prevents transitions during initial page load

5. **Theme Toggle Button**
   - Automatically injected into navigation bar
   - Shows sun icon in dark mode, moon icon in light mode
   - Responsive design with text label on larger screens
   - Accessible with proper ARIA labels

## Files

### 1. `/public/static/styles.css` (12.6 KB)

Complete CSS implementation with:
- CSS custom properties for all theme colors
- Light mode variables (default)
- Dark mode variables (`[data-theme="dark"]`)
- Background patterns and animations
- Poem cards, navigation, forms, buttons
- Responsive design for all screen sizes

**Key CSS Variables:**

**Light Mode:**
```css
--bg-primary: #f9fafb;
--bg-secondary: #ffffff;
--text-primary: #111827;
--text-accent: #3b82f6;
--card-bg: rgba(255, 255, 255, 0.95);
```

**Dark Mode:**
```css
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--text-primary: #f1f5f9;
--text-accent: #60a5fa;
--card-bg: rgba(30, 41, 59, 0.95);
```

### 2. `/public/static/theme.js` (7.5 KB)

JavaScript theme manager with:
- Automatic initialization before page load
- Theme detection and application
- LocalStorage persistence
- Theme toggle button creation
- System preference watching
- Event dispatching for other components

**API Methods:**

```javascript
// Toggle between light and dark
ThemeManager.toggleTheme()

// Set specific theme
ThemeManager.setTheme('dark') // or 'light'

// Get current theme
ThemeManager.getCurrentTheme() // returns 'light' or 'dark'

// Check if dark mode
ThemeManager.isDarkMode() // returns boolean

// Also available globally
window.toggleTheme()
```

### 3. `/src/index.tsx`

Updated to include:
```html
<link href="/static/styles.css" rel="stylesheet">
<script src="/static/theme.js"></script>
```

Removed all inline `<style>` tags - all styles now external.

## Usage

### For Users

1. **Automatic:** The platform automatically detects your system preference
2. **Manual:** Click the theme toggle button in the navigation bar (next to language selector)
3. **Persistent:** Your choice is remembered across visits

### For Developers

#### Access Theme in JavaScript

```javascript
// Get current theme
const theme = ThemeManager.getCurrentTheme();
console.log('Current theme:', theme); // 'light' or 'dark'

// Toggle theme programmatically
ThemeManager.toggleTheme();

// Set specific theme
ThemeManager.setTheme('dark');

// Check if dark mode
if (ThemeManager.isDarkMode()) {
  console.log('Dark mode is active');
}

// Listen for theme changes
window.addEventListener('themechange', (e) => {
  console.log('Theme changed to:', e.detail.theme);
});
```

#### Add Theme-Aware Styles

Use CSS custom properties:

```css
.my-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.my-component:hover {
  background: var(--bg-accent);
}
```

#### Override Dark Mode Styles

```css
/* Light mode */
.my-element {
  color: #000;
}

/* Dark mode override */
[data-theme="dark"] .my-element {
  color: #fff;
}
```

## Theme Toggle Button

The theme toggle button is automatically created and injected into the navigation bar. It:

- Appears next to the language selector
- Shows appropriate icon (sun for light mode, moon for dark mode)
- Includes text label on larger screens
- Has proper accessibility attributes
- Triggers smooth theme transitions

**HTML Structure:**
```html
<button id="themeToggle" class="theme-toggle" 
        aria-label="Toggle theme" 
        title="Switch between light and dark mode">
  <i class="fas fa-moon"></i>
  <span class="hidden sm:inline">Dark</span>
</button>
```

## Color Palette

### Light Mode
- **Primary Background:** `#f9fafb` (Soft gray)
- **Secondary Background:** `#ffffff` (Pure white)
- **Primary Text:** `#111827` (Nearly black)
- **Secondary Text:** `#6b7280` (Medium gray)
- **Accent Color:** `#3b82f6` (Vibrant blue)

### Dark Mode
- **Primary Background:** `#0f172a` (Deep navy)
- **Secondary Background:** `#1e293b` (Slate blue)
- **Primary Text:** `#f1f5f9` (Off-white)
- **Secondary Text:** `#cbd5e1` (Light gray)
- **Accent Color:** `#60a5fa` (Lighter blue)

## Background Patterns

Both themes feature elegant, poetic background patterns:

### Light Mode
- Subtle gradient overlays with indigo and purple tints
- Very light opacity (0.03-0.05)
- Animated radial gradients for depth

### Dark Mode
- Enhanced pattern visibility with deeper colors
- Increased opacity (0.08-0.1) for better contrast
- Same animation with adjusted colors

### Floating Quote Marks
- Large decorative quotation marks
- Subtle animation (floating effect)
- Color adapts to theme
- Positioned at corners for balance

## Browser Support

✅ **Fully Supported:**
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Opera 74+

✅ **Partial Support:**
- Older browsers fall back to light mode
- CSS variables supported in IE11 with polyfill

## Performance

- **No Runtime Overhead:** Theme loads before page render
- **Prevents FOUC:** Preload class prevents transition flash
- **Efficient:** Uses CSS custom properties (native browser support)
- **Small Size:** Combined CSS + JS = ~20 KB (uncompressed)

## Accessibility

✅ **WCAG 2.1 Compliant:**
- Proper contrast ratios in both themes
- Keyboard navigation support
- ARIA labels on theme toggle
- Screen reader friendly
- Respects `prefers-reduced-motion`

## Testing

### Manual Testing

1. **Initial Load:**
   - Light mode users see light theme
   - Dark mode users see dark theme

2. **Toggle:**
   - Click theme button
   - Observe smooth transition
   - Verify colors change appropriately

3. **Persistence:**
   - Toggle theme
   - Refresh page
   - Verify theme persists

4. **System Preference:**
   - Clear localStorage
   - Change system theme
   - Refresh page
   - Verify automatic detection

### Console Testing

```javascript
// In browser console:

// Check current theme
ThemeManager.getCurrentTheme()

// Toggle theme
ThemeManager.toggleTheme()

// Force light mode
ThemeManager.setTheme('light')

// Force dark mode
ThemeManager.setTheme('dark')

// Check if dark mode
ThemeManager.isDarkMode()
```

## Troubleshooting

### Theme Not Changing

1. Check browser console for errors
2. Verify `theme.js` is loaded
3. Clear localStorage and try again
4. Hard refresh (Ctrl+Shift+R)

### Flash of Unstyled Content

1. Ensure `theme.js` loads before body content
2. Check that `preload` class is applied
3. Verify CSS is loaded in `<head>`

### Styles Not Applying

1. Check CSS file is loaded (`/static/styles.css`)
2. Verify no conflicting Tailwind classes
3. Inspect element to see computed styles
4. Check browser console for 404 errors

## Future Enhancements

Potential improvements for future versions:

1. **More Themes:**
   - Sepia/warm theme for reading
   - High contrast theme for accessibility
   - Custom color picker

2. **Advanced Features:**
   - Auto-switch based on time of day
   - Per-page theme preferences
   - Theme animations/transitions

3. **Performance:**
   - Critical CSS inlining
   - Theme CSS splitting
   - Lazy load non-critical styles

## Live Demo

🌐 **Public URL:** https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai

**To Test:**
1. Visit the URL
2. Look for theme toggle button in navigation (next to language selector)
3. Click to switch between light and dark modes
4. Observe the smooth transitions
5. Refresh page to verify persistence

## Technical Implementation Details

### Initialization Flow

1. **Immediate Execution:**
   - `theme.js` executes immediately in `<head>`
   - No waiting for DOM ready

2. **Theme Detection:**
   - Check localStorage for saved preference
   - Fall back to system preference
   - Default to light mode if neither available

3. **Apply Theme:**
   - Set `data-theme` attribute on `<html>`
   - Add `preload` class to prevent transition flash
   - Remove `preload` after 100ms

4. **Create Toggle:**
   - Wait for DOM ready
   - Find injection point (language selector)
   - Create and insert button
   - Attach event listeners

### Data Flow

```
User Action (Click Toggle)
  ↓
ThemeManager.toggleTheme()
  ↓
Apply new theme to DOM
  ↓
Save to localStorage
  ↓
Dispatch 'themechange' event
  ↓
Update UI (button icon/text)
```

## Credits

Designed and implemented for the Poetry Platform multilingual poetry application with:
- Beautiful, poetic aesthetics
- Professional color theory
- WCAG accessibility standards
- Modern web development best practices

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-13  
**Status:** ✅ Production Ready
