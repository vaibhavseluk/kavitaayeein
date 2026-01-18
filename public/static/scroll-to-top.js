/**
 * Scroll to Top Button
 * Shows a floating button when user scrolls down more than 400px
 * Works on all pages of the SPA
 */

(function() {
  'use strict';

  const ScrollToTop = {
    buttonCreated: false,
    scrollHandler: null,
    
    /**
     * Initialize scroll to top button
     */
    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.createButton());
      } else {
        this.createButton();
      }
      
      console.log('Scroll to Top initialized');
    },

    /**
     * Ensure button exists and is functional
     */
    ensureButton() {
      const existingButton = document.getElementById('scrollToTopBtn');
      if (!existingButton) {
        this.createButton();
      } else {
        // Button exists, just update visibility based on current scroll
        this.handleScroll();
      }
    },

    /**
     * Create and inject the scroll to top button
     */
    createButton() {
      // Check if button already exists
      if (document.getElementById('scrollToTopBtn')) {
        console.log('Scroll to Top button already exists');
        return;
      }

      // Create button element
      const button = document.createElement('button');
      button.id = 'scrollToTopBtn';
      button.className = 'scroll-to-top-btn';
      button.setAttribute('aria-label', 'Scroll to top');
      button.setAttribute('title', 'Back to top');
      button.innerHTML = '<i class="fas fa-arrow-up"></i>';
      
      // Add to body
      document.body.appendChild(button);
      
      // Add click event
      button.addEventListener('click', () => this.scrollToTop());
      
      // Setup scroll event listener (only once)
      if (!this.scrollHandler) {
        this.scrollHandler = () => this.handleScroll();
        window.addEventListener('scroll', this.scrollHandler);
      }
      
      // Initial check
      this.handleScroll();
      
      this.buttonCreated = true;
      console.log('Scroll to Top button created');
    },

    /**
     * Handle scroll event to show/hide button
     */
    handleScroll() {
      const button = document.getElementById('scrollToTopBtn');
      if (!button) {
        // Button was removed, recreate it
        this.createButton();
        return;
      }
      
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollPosition > 400) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    },

    /**
     * Smooth scroll to top of page
     */
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Optional: Add haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    },

    /**
     * Reset scroll position and hide button (useful for page transitions)
     */
    reset() {
      window.scrollTo(0, 0);
      const button = document.getElementById('scrollToTopBtn');
      if (button) {
        button.classList.remove('visible');
      }
    }
  };

  // Initialize
  ScrollToTop.init();

  // Expose to global scope
  window.ScrollToTop = ScrollToTop;

  // Re-check button existence periodically (for SPA page changes)
  setInterval(() => {
    ScrollToTop.ensureButton();
  }, 2000);

})();
