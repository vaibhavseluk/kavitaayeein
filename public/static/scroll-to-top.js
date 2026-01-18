/**
 * Scroll to Top Button
 * Shows a floating button when user scrolls down more than 400px
 */

(function() {
  'use strict';

  const ScrollToTop = {
    
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
     * Create and inject the scroll to top button
     */
    createButton() {
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
      
      // Add scroll event listener
      window.addEventListener('scroll', () => this.handleScroll());
      
      // Initial check
      this.handleScroll();
      
      console.log('Scroll to Top button created');
    },

    /**
     * Handle scroll event to show/hide button
     */
    handleScroll() {
      const button = document.getElementById('scrollToTopBtn');
      if (!button) return;
      
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
    }
  };

  // Initialize
  ScrollToTop.init();

  // Expose to global scope
  window.ScrollToTop = ScrollToTop;

})();
