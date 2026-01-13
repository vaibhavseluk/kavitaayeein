// User Onboarding Tour System
// Lightweight tour guide for first-time users

const OnboardingTour = {
  isFirstLogin: false,
  currentStep: 0,
  tourOverlay: null,
  highlightBox: null,

  // Tour steps configuration
  steps: [
    {
      target: '#userMenu',
      title: 'Welcome to कविता व्यासपीठ! 🎉',
      content: 'Welcome! Let\'s take a quick tour to help you get started. This is your user menu where you can access your profile, settings, and more.',
      position: 'bottom',
      highlight: true
    },
    {
      target: 'button[onclick*="showCreatePoem"]',
      title: 'Create Your First Poem ✍️',
      content: 'Click here to create a new poem. You can write in Marathi, Hindi, or English with our advanced editor.',
      position: 'bottom',
      highlight: true
    },
    {
      target: 'button[onclick*="showDashboard"]',
      title: 'Your Dashboard 📊',
      content: 'Access your dashboard to view all your poems, edit them, check stats, and manage your content.',
      position: 'bottom',
      highlight: true
    },
    {
      target: '#languageSelect',
      title: 'Language Selection 🌐',
      content: 'Choose your preferred interface language. The platform supports English, Hindi (हिंदी), and Marathi (मराठी).',
      position: 'bottom',
      highlight: true
    },
    {
      target: '.nav-link[onclick*="showSubscriptionPlans"]',
      title: 'Go Featured ⭐',
      content: 'Upgrade to Featured Poet status for premium placement, unlimited poems, and advanced features. Only $4.66/year!',
      position: 'bottom',
      highlight: true
    },
    {
      target: '#helpMenuIcon',
      title: 'Need Help? 💡',
      content: 'Click the help icon anytime to access the user manual, FAQs, keyboard shortcuts, and restart this tour.',
      position: 'left',
      highlight: true
    }
  ],

  // Initialize the tour system
  init() {
    // Check if this is first login
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    const authToken = localStorage.getItem('auth_token');
    
    if (authToken && !hasSeenTour) {
      this.isFirstLogin = true;
      // Wait for page to load completely
      setTimeout(() => this.start(), 1000);
    }
  },

  // Start the tour
  start() {
    this.currentStep = 0;
    this.createOverlay();
    this.showStep(0);
  },

  // Create overlay elements
  createOverlay() {
    // Create backdrop
    this.tourOverlay = document.createElement('div');
    this.tourOverlay.id = 'tourOverlay';
    this.tourOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-[9998]';
    document.body.appendChild(this.tourOverlay);

    // Create highlight box
    this.highlightBox = document.createElement('div');
    this.highlightBox.id = 'tourHighlight';
    this.highlightBox.className = 'fixed border-4 border-blue-500 rounded-lg shadow-2xl bg-white bg-opacity-10 z-[9999] pointer-events-none transition-all duration-300';
    document.body.appendChild(this.highlightBox);

    // Create tour card
    this.tourCard = document.createElement('div');
    this.tourCard.id = 'tourCard';
    this.tourCard.className = 'fixed bg-white rounded-lg shadow-2xl p-6 z-[10000] max-w-md';
    document.body.appendChild(this.tourCard);
  },

  // Show specific step
  showStep(stepIndex) {
    if (stepIndex >= this.steps.length) {
      this.complete();
      return;
    }

    this.currentStep = stepIndex;
    const step = this.steps[stepIndex];
    const target = document.querySelector(step.target);

    if (!target) {
      // Skip to next step if target not found
      this.showStep(stepIndex + 1);
      return;
    }

    // Highlight target element
    if (step.highlight) {
      this.highlightElement(target);
    }

    // Position and show tour card
    this.positionTourCard(target, step);
  },

  // Highlight element
  highlightElement(element) {
    const rect = element.getBoundingClientRect();
    const padding = 8;

    this.highlightBox.style.left = `${rect.left - padding}px`;
    this.highlightBox.style.top = `${rect.top - padding}px`;
    this.highlightBox.style.width = `${rect.width + padding * 2}px`;
    this.highlightBox.style.height = `${rect.height + padding * 2}px`;
    this.highlightBox.style.display = 'block';

    // Bring element to front
    element.style.position = 'relative';
    element.style.zIndex = '10001';
  },

  // Position tour card
  positionTourCard(target, step) {
    const rect = target.getBoundingClientRect();
    const card = this.tourCard;
    
    card.innerHTML = `
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold text-gray-900">${step.title}</h3>
          <button onclick="OnboardingTour.skip()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="text-gray-700">${step.content}</p>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Step ${this.currentStep + 1} of ${this.steps.length}
        </div>
        <div class="space-x-2">
          ${this.currentStep > 0 ? '<button onclick="OnboardingTour.prev()" class="px-4 py-2 text-gray-600 hover:text-gray-900"><i class="fas fa-arrow-left mr-1"></i> Back</button>' : ''}
          ${this.currentStep < this.steps.length - 1 
            ? '<button onclick="OnboardingTour.next()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next <i class="fas fa-arrow-right ml-1"></i></button>'
            : '<button onclick="OnboardingTour.complete()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Got it! <i class="fas fa-check ml-1"></i></button>'}
        </div>
      </div>
      <div class="mt-3 text-center">
        <button onclick="OnboardingTour.skip()" class="text-sm text-gray-500 hover:text-gray-700">Skip Tour</button>
      </div>
    `;

    // Position based on step.position
    const cardRect = card.getBoundingClientRect();
    let left, top;

    switch (step.position) {
      case 'bottom':
        left = rect.left + (rect.width / 2) - (cardRect.width / 2);
        top = rect.bottom + 20;
        break;
      case 'top':
        left = rect.left + (rect.width / 2) - (cardRect.width / 2);
        top = rect.top - cardRect.height - 20;
        break;
      case 'left':
        left = rect.left - cardRect.width - 20;
        top = rect.top + (rect.height / 2) - (cardRect.height / 2);
        break;
      case 'right':
        left = rect.right + 20;
        top = rect.top + (rect.height / 2) - (cardRect.height / 2);
        break;
      default:
        left = rect.left + (rect.width / 2) - (cardRect.width / 2);
        top = rect.bottom + 20;
    }

    // Keep card within viewport
    left = Math.max(20, Math.min(left, window.innerWidth - cardRect.width - 20));
    top = Math.max(20, Math.min(top, window.innerHeight - cardRect.height - 20));

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.display = 'block';
  },

  // Navigation methods
  next() {
    this.showStep(this.currentStep + 1);
  },

  prev() {
    this.showStep(this.currentStep - 1);
  },

  skip() {
    if (confirm('Are you sure you want to skip the tour? You can restart it anytime from the Help menu.')) {
      this.complete();
    }
  },

  // Complete tour
  complete() {
    localStorage.setItem('hasSeenTour', 'true');
    this.cleanup();
    
    // Show completion message
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">You're All Set!</h3>
        <p class="text-gray-600 mb-6">
          You're ready to start creating beautiful poetry. Need help anytime? Click the help icon in the navigation bar.
        </p>
        <button onclick="this.closest('div').remove()" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Start Writing! <i class="fas fa-pen-fancy ml-2"></i>
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => modal.remove(), 5000);
  },

  // Cleanup tour elements
  cleanup() {
    if (this.tourOverlay) this.tourOverlay.remove();
    if (this.highlightBox) this.highlightBox.remove();
    if (this.tourCard) this.tourCard.remove();
    
    // Reset z-index of highlighted elements
    document.querySelectorAll('[style*="z-index: 10001"]').forEach(el => {
      el.style.zIndex = '';
    });
  },

  // Restart tour (for Help menu)
  restart() {
    this.cleanup();
    setTimeout(() => this.start(), 100);
  }
};

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => OnboardingTour.init());
} else {
  OnboardingTour.init();
}
