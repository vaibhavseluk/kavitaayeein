/**
 * Site Mascot - Smart Interactive Poetry Companion
 * Features:
 * - Only appears when user is idle (3 seconds of no mouse movement)
 * - Stays away from interactive elements (buttons, links, inputs)
 * - User can toggle on/off with a button
 * - Auto-hides on mouse movement near it
 * - Remembers user preference in localStorage
 */

(function() {
  'use strict';

  const Mascot = {
    mascot: null,
    toggleButton: null,
    eyes: null,
    targetX: 0,
    targetY: 0,
    currentX: window.innerWidth - 120,
    currentY: window.innerHeight - 120,
    colorIndex: 0,
    isEnabled: true,
    isVisible: false,
    isIdle: false,
    idleTimer: null,
    animationFrame: null,
    lastMouseX: 0,
    lastMouseY: 0,
    IDLE_TIMEOUT: 3000, // Show mascot after 3 seconds of idle
    SAFE_DISTANCE: 100, // Keep 100px away from cursor
    colors: [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Orange
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Teal
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Pastel
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'  // Rose
    ],

    /**
     * Initialize mascot system
     */
    init() {
      console.log('Mascot: Starting smart initialization...');
      
      // Load user preference
      this.loadPreference();
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.setup();
        });
      } else {
        this.setup();
      }
    },

    /**
     * Setup mascot and controls
     */
    setup() {
      this.createToggleButton();
      this.create();
      this.setupIdleDetection();
      
      // Initially hide mascot until user is idle
      if (this.isEnabled) {
        this.hide();
      }
      
      console.log('Mascot: Setup complete (idle mode enabled)');
    },

    /**
     * Create toggle button for user control
     */
    createToggleButton() {
      // Check if button already exists
      if (document.getElementById('mascotToggle')) {
        return;
      }

      this.toggleButton = document.createElement('button');
      this.toggleButton.id = 'mascotToggle';
      this.toggleButton.className = 'mascot-toggle-btn';
      this.toggleButton.innerHTML = `
        <i class="fas fa-dove"></i>
        <span class="mascot-toggle-tooltip">Toggle Mascot Helper</span>
      `;
      this.toggleButton.setAttribute('aria-label', 'Toggle site mascot');
      this.toggleButton.title = 'Toggle mascot helper (appears when idle)';
      
      // Set initial state
      this.updateToggleButton();
      
      // Add click handler
      this.toggleButton.addEventListener('click', () => {
        this.toggleEnabled();
      });
      
      document.body.appendChild(this.toggleButton);
      console.log('Mascot: Toggle button created');
    },

    /**
     * Update toggle button appearance
     */
    updateToggleButton() {
      if (!this.toggleButton) return;
      
      if (this.isEnabled) {
        this.toggleButton.classList.add('active');
        this.toggleButton.querySelector('i').className = 'fas fa-dove';
      } else {
        this.toggleButton.classList.remove('active');
        this.toggleButton.querySelector('i').className = 'fas fa-dove';
        this.toggleButton.style.opacity = '0.5';
      }
    },

    /**
     * Create mascot element
     */
    create() {
      if (document.getElementById('siteMascot')) {
        this.mascot = document.getElementById('siteMascot');
        return;
      }

      this.mascot = document.createElement('div');
      this.mascot.id = 'siteMascot';
      this.mascot.className = 'site-mascot';
      
      this.mascot.innerHTML = `
        <div class="mascot-body">
          <div class="mascot-wing mascot-wing-left"></div>
          <div class="mascot-wing mascot-wing-right"></div>
          <div class="mascot-face">
            <div class="mascot-eyes">
              <div class="mascot-eye mascot-eye-left">
                <div class="mascot-pupil"></div>
              </div>
              <div class="mascot-eye mascot-eye-right">
                <div class="mascot-pupil"></div>
              </div>
            </div>
            <div class="mascot-beak"></div>
          </div>
          <div class="mascot-feet">
            <div class="mascot-foot mascot-foot-left"></div>
            <div class="mascot-foot mascot-foot-right"></div>
          </div>
        </div>
        <div class="mascot-sparkles">
          <span class="sparkle" style="--delay: 0s; --x: -10px; --y: -10px;">✨</span>
          <span class="sparkle" style="--delay: 0.3s; --x: 10px; --y: -15px;">✨</span>
          <span class="sparkle" style="--delay: 0.6s; --x: 0px; --y: -20px;">✨</span>
        </div>
      `;

      document.body.appendChild(this.mascot);
      
      // Set initial position
      this.currentX = window.innerWidth - 120;
      this.currentY = window.innerHeight - 120;
      this.updatePosition();
      
      // Add hover interaction
      this.addInteractions();
      
      // Start color changing
      this.startColorChange();
      
      console.log('Mascot: Created at position', this.currentX, this.currentY);
    },

    /**
     * Setup idle detection
     */
    setupIdleDetection() {
      let lastX = 0;
      let lastY = 0;

      document.addEventListener('mousemove', (e) => {
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        // Clear idle timer
        if (this.idleTimer) {
          clearTimeout(this.idleTimer);
        }
        
        // Check if moving (not just hovering)
        const moved = Math.abs(e.clientX - lastX) > 5 || Math.abs(e.clientY - lastY) > 5;
        
        if (moved) {
          lastX = e.clientX;
          lastY = e.clientY;
          
          // Hide mascot when user is actively moving mouse
          if (this.isEnabled && this.isVisible) {
            this.hide();
          }
          
          // Set timer to show mascot when idle
          if (this.isEnabled) {
            this.idleTimer = setTimeout(() => {
              this.onIdle();
            }, this.IDLE_TIMEOUT);
          }
        }
      });

      // Also detect mouse leaving window
      document.addEventListener('mouseleave', () => {
        if (this.isEnabled) {
          this.idleTimer = setTimeout(() => {
            this.onIdle();
          }, this.IDLE_TIMEOUT);
        }
      });

      console.log('Mascot: Idle detection enabled (appears after 3s idle)');
    },

    /**
     * Called when user becomes idle
     */
    onIdle() {
      if (!this.isEnabled) return;
      
      this.isIdle = true;
      this.show();
      this.startSmartTracking();
      
      console.log('Mascot: User idle - mascot activated');
    },

    /**
     * Smart tracking - follows cursor but keeps safe distance
     */
    startSmartTracking() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      const animate = () => {
        if (!this.isVisible || !this.isEnabled) {
          return;
        }

        // Calculate distance to cursor
        const dx = this.lastMouseX - this.currentX - 40;
        const dy = this.lastMouseY - this.currentY - 40;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If too close to cursor, move away
        if (distance < this.SAFE_DISTANCE) {
          // Move to opposite side
          this.targetX = this.currentX - dx * 0.3;
          this.targetY = this.currentY - dy * 0.3;
        } else {
          // Follow at a safe distance
          const targetDistance = this.SAFE_DISTANCE + 20;
          const ratio = targetDistance / distance;
          this.targetX = this.lastMouseX - dx * ratio - 40;
          this.targetY = this.lastMouseY - dy * ratio - 40;
        }

        // Keep within viewport bounds
        this.targetX = Math.max(0, Math.min(window.innerWidth - 80, this.targetX));
        this.targetY = Math.max(0, Math.min(window.innerHeight - 80, this.targetY));

        // Smooth movement
        this.currentX += (this.targetX - this.currentX) * 0.05;
        this.currentY += (this.targetY - this.currentY) * 0.05;
        
        this.updatePosition();
        
        this.animationFrame = requestAnimationFrame(animate);
      };

      animate();
    },

    /**
     * Update mascot position
     */
    updatePosition() {
      if (this.mascot) {
        this.mascot.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
      }
    },

    /**
     * Show mascot
     */
    show() {
      if (!this.mascot || !this.isEnabled) return;
      
      this.isVisible = true;
      this.mascot.classList.add('visible');
      this.mascot.style.pointerEvents = 'auto';
      console.log('Mascot: Showing');
    },

    /**
     * Hide mascot
     */
    hide() {
      if (!this.mascot) return;
      
      this.isVisible = false;
      this.isIdle = false;
      this.mascot.classList.remove('visible');
      this.mascot.style.pointerEvents = 'none';
      
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      
      console.log('Mascot: Hidden');
    },

    /**
     * Toggle mascot enabled/disabled
     */
    toggleEnabled() {
      this.isEnabled = !this.isEnabled;
      this.savePreference();
      this.updateToggleButton();
      
      if (this.isEnabled) {
        console.log('Mascot: Enabled');
        // Start idle detection
        this.hide(); // Hide initially, will show when idle
        if (this.idleTimer) {
          clearTimeout(this.idleTimer);
        }
        this.idleTimer = setTimeout(() => {
          this.onIdle();
        }, this.IDLE_TIMEOUT);
      } else {
        console.log('Mascot: Disabled');
        this.hide();
        if (this.idleTimer) {
          clearTimeout(this.idleTimer);
        }
      }
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },

    /**
     * Start automatic color changing
     */
    startColorChange() {
      setInterval(() => {
        if (!this.isVisible) return;
        
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        const body = this.mascot?.querySelector('.mascot-body');
        if (body) {
          body.style.background = this.colors[this.colorIndex];
        }
      }, 10000); // Change every 10 seconds
    },

    /**
     * Add hover/click interactions
     */
    addInteractions() {
      if (!this.mascot) return;

      // Hover effect
      this.mascot.addEventListener('mouseenter', () => {
        this.mascot.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(1.1)`;
      });

      this.mascot.addEventListener('mouseleave', () => {
        this.mascot.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(1)`;
      });

      // Click effect
      this.mascot.addEventListener('click', () => {
        this.mascot.style.animation = 'mascot-shake 0.5s ease';
        setTimeout(() => {
          this.mascot.style.animation = '';
        }, 500);
        
        if (navigator.vibrate) {
          navigator.vibrate([50, 100, 50]);
        }
      });
    },

    /**
     * Save user preference to localStorage
     */
    savePreference() {
      try {
        localStorage.setItem('poetryMascotEnabled', this.isEnabled ? 'true' : 'false');
      } catch (e) {
        console.warn('Mascot: Could not save preference', e);
      }
    },

    /**
     * Load user preference from localStorage
     */
    loadPreference() {
      try {
        const saved = localStorage.getItem('poetryMascotEnabled');
        if (saved !== null) {
          this.isEnabled = saved === 'true';
        }
      } catch (e) {
        console.warn('Mascot: Could not load preference', e);
      }
    },

    /**
     * Public API - Toggle visibility
     */
    toggle(show) {
      if (show) {
        this.show();
      } else {
        this.hide();
      }
    },

    /**
     * Public API - Destroy mascot
     */
    destroy() {
      if (this.mascot) {
        this.mascot.remove();
        this.mascot = null;
      }
      if (this.toggleButton) {
        this.toggleButton.remove();
        this.toggleButton = null;
      }
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
      }
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    }
  };

  // Initialize
  Mascot.init();

  // Expose to global scope
  window.Mascot = Mascot;

})();
