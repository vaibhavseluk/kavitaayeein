/**
 * Theme Switcher for Poetry Platform
 * Handles light/dark mode with smooth transitions and localStorage persistence
 */

(function() {
  'use strict';

  // Theme constants
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };

  const STORAGE_KEY = 'poetry-platform-theme';

  // Theme manager object
  const ThemeManager = {
    
    /**
     * Initialize theme system
     */
    init() {
      // Add preload class to prevent transitions on page load
      document.documentElement.classList.add('preload');
      
      // Load saved theme or detect system preference
      const savedTheme = this.getSavedTheme();
      const theme = savedTheme || this.getSystemTheme();
      
      // Apply theme immediately (before page renders)
      this.applyTheme(theme, false);
      
      // Remove preload class after a short delay
      setTimeout(() => {
        document.documentElement.classList.remove('preload');
      }, 100);
      
      // Create and inject theme toggle button
      this.createThemeToggle();
      
      // Listen for system theme changes
      this.watchSystemTheme();
      
      console.log('Theme system initialized:', theme);
    },

    /**
     * Get saved theme from localStorage
     */
    getSavedTheme() {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Could not access localStorage:', e);
        return null;
      }
    },

    /**
     * Save theme to localStorage
     */
    saveTheme(theme) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        console.warn('Could not save theme to localStorage:', e);
      }
    },

    /**
     * Get system theme preference
     */
    getSystemTheme() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEMES.DARK;
      }
      return THEMES.LIGHT;
    },

    /**
     * Apply theme to document
     */
    applyTheme(theme, animate = true) {
      const html = document.documentElement;
      const body = document.body;
      
      // If not animating, temporarily disable transitions
      if (!animate) {
        html.classList.add('preload');
        body.classList.add('preload');
      }
      
      // Set theme attribute
      html.setAttribute('data-theme', theme);
      
      // Update theme toggle button if it exists
      this.updateThemeToggle(theme);
      
      // Re-enable transitions
      if (!animate) {
        setTimeout(() => {
          html.classList.remove('preload');
          body.classList.remove('preload');
        }, 50);
      }
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
      const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      
      this.applyTheme(newTheme);
      this.saveTheme(newTheme);
      
      // Optional: Add haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      return newTheme;
    },

    /**
     * Create theme toggle button and inject into navigation
     */
    createThemeToggle() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.createThemeToggle());
        return;
      }

      // Check if button already exists in HTML
      let themeToggle = document.getElementById('themeToggle');
      
      if (themeToggle) {
        // Button exists in HTML, just update its content and attach handler
        const currentTheme = document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
        this.updateThemeToggleContent(themeToggle, currentTheme);
        
        // Add click handler
        themeToggle.addEventListener('click', () => {
          const newTheme = this.toggleTheme();
          this.updateThemeToggleContent(themeToggle, newTheme);
        });
        
        console.log('Theme toggle button found and initialized');
        return;
      }

      // Button doesn't exist, create it dynamically
      const navContainer = document.querySelector('nav .flex.items-center.space-x-6');
      if (!navContainer) {
        console.warn('Navigation container not found, theme toggle not added to navigation');
        return;
      }

      // Create theme toggle button
      themeToggle = document.createElement('button');
      themeToggle.id = 'themeToggle';
      themeToggle.className = 'theme-toggle';
      themeToggle.setAttribute('aria-label', 'Toggle theme');
      themeToggle.setAttribute('title', 'Switch between light and dark mode');
      
      // Set initial icon
      const currentTheme = document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
      this.updateThemeToggleContent(themeToggle, currentTheme);
      
      // Add click handler
      themeToggle.addEventListener('click', () => {
        const newTheme = this.toggleTheme();
        this.updateThemeToggleContent(themeToggle, newTheme);
      });
      
      // Insert as first child of navigation container
      navContainer.insertBefore(themeToggle, navContainer.firstChild);
      console.log('Theme toggle button created and inserted');
    },

    /**
     * Update theme toggle button content
     */
    updateThemeToggleContent(button, theme) {
      if (!button) return;
      
      if (theme === THEMES.DARK) {
        button.innerHTML = '<i class="fas fa-sun"></i><span class="hidden sm:inline">Light</span>';
        button.setAttribute('title', 'Switch to light mode');
      } else {
        button.innerHTML = '<i class="fas fa-moon"></i><span class="hidden sm:inline">Dark</span>';
        button.setAttribute('title', 'Switch to dark mode');
      }
    },

    /**
     * Update existing theme toggle button
     */
    updateThemeToggle(theme) {
      const button = document.getElementById('themeToggle');
      if (button) {
        this.updateThemeToggleContent(button, theme);
      }
    },

    /**
     * Watch for system theme changes
     */
    watchSystemTheme() {
      if (!window.matchMedia) return;
      
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Modern browsers
      if (darkModeQuery.addEventListener) {
        darkModeQuery.addEventListener('change', (e) => {
          // Only apply system theme if user hasn't set a preference
          if (!this.getSavedTheme()) {
            const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
            this.applyTheme(newTheme);
          }
        });
      }
      // Older browsers
      else if (darkModeQuery.addListener) {
        darkModeQuery.addListener((e) => {
          if (!this.getSavedTheme()) {
            const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
            this.applyTheme(newTheme);
          }
        });
      }
    },

    /**
     * Get current theme
     */
    getCurrentTheme() {
      return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
    },

    /**
     * Check if dark mode is active
     */
    isDarkMode() {
      return this.getCurrentTheme() === THEMES.DARK;
    },

    /**
     * Set specific theme
     */
    setTheme(theme) {
      if (theme !== THEMES.LIGHT && theme !== THEMES.DARK) {
        console.warn('Invalid theme:', theme);
        return;
      }
      this.applyTheme(theme);
      this.saveTheme(theme);
    }
  };

  // Initialize immediately (before DOMContentLoaded to prevent flash)
  ThemeManager.init();

  // Expose to global scope for easy access
  window.ThemeManager = ThemeManager;

  // Expose toggle function for inline onclick handlers
  window.toggleTheme = () => ThemeManager.toggleTheme();

  // Log available methods
  console.log('Theme Manager loaded. Available methods:', {
    toggleTheme: 'Toggle between light and dark mode',
    setTheme: 'Set specific theme (light/dark)',
    getCurrentTheme: 'Get current theme',
    isDarkMode: 'Check if dark mode is active'
  });

})();
