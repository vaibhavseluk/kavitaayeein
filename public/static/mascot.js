/**
 * Site Mascot - Interactive Poetry Companion
 * A colorful character that follows cursor and changes colors
 */

(function() {
  'use strict';

  const Mascot = {
    mascot: null,
    eyes: null,
    targetX: 0,
    targetY: 0,
    currentX: window.innerWidth - 100,
    currentY: window.innerHeight - 100,
    colorIndex: 0,
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
     * Initialize mascot
     */
    init() {
      console.log('Mascot: Starting initialization...');
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('Mascot: DOM loaded, creating mascot...');
          this.create();
        });
      } else {
        console.log('Mascot: DOM already loaded, creating mascot...');
        this.create();
      }
    },

    /**
     * Create mascot element
     */
    create() {
      // Check if mascot already exists
      if (document.getElementById('siteMascot')) {
        console.log('Mascot already exists');
        return;
      }

      // Create mascot container
      this.mascot = document.createElement('div');
      this.mascot.id = 'siteMascot';
      this.mascot.className = 'site-mascot';
      
      // Create mascot HTML structure (cute character)
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

      // Add to body
      document.body.appendChild(this.mascot);
      console.log('Mascot: Added to DOM');

      // Set initial position (bottom right)
      this.currentX = window.innerWidth - 120;
      this.currentY = window.innerHeight - 120;
      this.mascot.style.display = 'block';
      this.mascot.style.opacity = '1';
      this.updatePosition();
      console.log('Mascot: Positioned at', this.currentX, this.currentY);

      // Start tracking cursor
      this.startTracking();

      // Start color changing
      this.startColorChange();

      // Add hover interaction
      this.addInteractions();

      console.log('Mascot created successfully');
    },

    /**
     * Start tracking cursor movement
     */
    startTracking() {
      // Track mouse movement
      document.addEventListener('mousemove', (e) => {
        this.targetX = e.clientX - 40; // Center on cursor
        this.targetY = e.clientY - 40;
      });

      // Smooth follow animation
      const animate = () => {
        // Smooth easing
        const dx = this.targetX - this.currentX;
        const dy = this.targetY - this.currentY;
        
        this.currentX += dx * 0.05; // Adjust speed (0.05 = slow, smooth)
        this.currentY += dy * 0.05;

        this.updatePosition();
        
        // Continue animation
        requestAnimationFrame(animate);
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
     * Start automatic color changing
     */
    startColorChange() {
      // Change color every 10 seconds
      setInterval(() => {
        this.changeColor();
      }, 10000);

      // Set initial color
      this.changeColor();
    },

    /**
     * Change mascot color
     */
    changeColor() {
      const body = this.mascot?.querySelector('.mascot-body');
      if (body) {
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        body.style.background = this.colors[this.colorIndex];
        
        // Add pulse animation
        body.style.animation = 'none';
        setTimeout(() => {
          body.style.animation = 'mascot-pulse 0.5s ease';
        }, 10);
      }
    },

    /**
     * Add interactive behaviors
     */
    addInteractions() {
      if (!this.mascot) return;

      // Bounce on click
      this.mascot.addEventListener('click', () => {
        this.mascot.style.animation = 'mascot-bounce 0.6s ease';
        setTimeout(() => {
          this.mascot.style.animation = '';
        }, 600);
        
        // Change color on click
        this.changeColor();
      });

      // Grow on hover
      this.mascot.addEventListener('mouseenter', () => {
        this.mascot.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(1.2)`;
      });

      this.mascot.addEventListener('mouseleave', () => {
        this.mascot.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(1)`;
      });
    },

    /**
     * Show/hide mascot
     */
    toggle(show) {
      if (this.mascot) {
        this.mascot.style.display = show ? 'block' : 'none';
      }
    },

    /**
     * Remove mascot
     */
    destroy() {
      if (this.mascot) {
        this.mascot.remove();
        this.mascot = null;
      }
    }
  };

  // Initialize
  Mascot.init();

  // Expose to global scope
  window.Mascot = Mascot;

})();
