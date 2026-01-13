// Help Menu System - User Manual, FAQs, Keyboard Shortcuts

const HelpMenu = {
  // Show help menu modal
  show() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-question-circle mr-2"></i>Help Center
            </h2>
            <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 88px);">
          <!-- Tab Navigation -->
          <div class="flex space-x-2 mb-6 border-b">
            <button onclick="HelpMenu.showTab('manual')" id="tab-manual" class="help-tab px-4 py-2 font-semibold border-b-2 border-blue-600 text-blue-600">
              <i class="fas fa-book mr-1"></i> User Manual
            </button>
            <button onclick="HelpMenu.showTab('faqs')" id="tab-faqs" class="help-tab px-4 py-2 font-semibold text-gray-600 hover:text-blue-600">
              <i class="fas fa-question mr-1"></i> FAQs
            </button>
            <button onclick="HelpMenu.showTab('shortcuts')" id="tab-shortcuts" class="help-tab px-4 py-2 font-semibold text-gray-600 hover:text-blue-600">
              <i class="fas fa-keyboard mr-1"></i> Shortcuts
            </button>
            <button onclick="HelpMenu.showTab('tour')" id="tab-tour" class="help-tab px-4 py-2 font-semibold text-gray-600 hover:text-blue-600">
              <i class="fas fa-play-circle mr-1"></i> Take Tour
            </button>
          </div>

          <!-- Tab Contents -->
          <div id="help-content">
            ${HelpMenu.getManualContent()}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  },

  // Switch tabs
  showTab(tabName) {
    // Update tab styles
    document.querySelectorAll('.help-tab').forEach(tab => {
      tab.className = 'help-tab px-4 py-2 font-semibold text-gray-600 hover:text-blue-600';
    });
    document.getElementById(`tab-${tabName}`).className = 'help-tab px-4 py-2 font-semibold border-b-2 border-blue-600 text-blue-600';

    // Update content
    const content = document.getElementById('help-content');
    switch(tabName) {
      case 'manual':
        content.innerHTML = HelpMenu.getManualContent();
        break;
      case 'faqs':
        content.innerHTML = HelpMenu.getFAQsContent();
        break;
      case 'shortcuts':
        content.innerHTML = HelpMenu.getShortcutsContent();
        break;
      case 'tour':
        content.innerHTML = HelpMenu.getTourContent();
        break;
    }
  },

  // User Manual Content
  getManualContent() {
    return `
      <div class="space-y-6">
        <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            <i class="fas fa-book text-blue-600 mr-2"></i>Welcome to कविता व्यासपीठ
          </h3>
          <p class="text-gray-700">
            A multilingual poetry platform where you can write, share, and discover poetry in Marathi (मराठी), Hindi (हिंदी), and English.
          </p>
        </div>

        <div class="space-y-4">
          <div class="border-l-4 border-green-500 pl-4">
            <h4 class="text-lg font-bold text-gray-900 mb-2">
              <i class="fas fa-pen-fancy text-green-600 mr-2"></i>Creating a Poem
            </h4>
            <ol class="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click the <strong>"Create New Poem"</strong> button on your dashboard</li>
              <li>Select your preferred language (Marathi, Hindi, or English)</li>
              <li>Enter a title and write your poem using the rich text editor</li>
              <li>Use formatting options: bold, italic, headings, lists, and more</li>
              <li>Click <strong>"Publish"</strong> to share or <strong>"Save as Draft"</strong> to continue later</li>
            </ol>
          </div>

          <div class="border-l-4 border-purple-500 pl-4">
            <h4 class="text-lg font-bold text-gray-900 mb-2">
              <i class="fas fa-keyboard text-purple-600 mr-2"></i>Using the Editor
            </h4>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Rich Text Mode:</strong> Visual editor with formatting buttons</li>
              <li><strong>Code View:</strong> Switch to HTML/Markdown view for advanced editing</li>
              <li><strong>Fullscreen Mode:</strong> Distraction-free writing experience</li>
              <li><strong>Auto-save:</strong> Your work is saved automatically</li>
              <li><strong>Preview:</strong> See how your poem will look before publishing</li>
            </ul>
          </div>

          <div class="border-l-4 border-orange-500 pl-4">
            <h4 class="text-lg font-bold text-gray-900 mb-2">
              <i class="fas fa-language text-orange-600 mr-2"></i>Typing in Devanagari
            </h4>
            <p class="text-gray-700 mb-2">Multiple input methods available:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Built-in Transliteration:</strong> Type in English, get Devanagari (Press Ctrl+G)</li>
              <li><strong>Google Input Tools:</strong> Advanced transliteration with suggestions</li>
              <li><strong>Pramukh IME:</strong> Popular Marathi keyboard</li>
              <li><strong>System Keyboard:</strong> Use your OS's native input method</li>
            </ul>
          </div>

          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="text-lg font-bold text-gray-900 mb-2">
              <i class="fas fa-crown text-red-600 mr-2"></i>Subscription Plans
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div class="bg-gray-50 rounded-lg p-4">
                <h5 class="font-bold text-gray-900 mb-2">Free Plan</h5>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li>✓ Up to 10 poems</li>
                  <li>✓ Basic editor features</li>
                  <li>✓ Community access</li>
                  <li>✓ Multilingual support</li>
                </ul>
              </div>
              <div class="bg-blue-50 rounded-lg p-4 border-2 border-blue-500">
                <h5 class="font-bold text-blue-900 mb-2">Premium - $4.66/year</h5>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li>✓ <strong>Unlimited poems</strong></li>
                  <li>✓ Advanced editor with rich formatting</li>
                  <li>✓ Real-time transliteration</li>
                  <li>✓ Priority support</li>
                  <li>✓ No advertisements</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="border-l-4 border-teal-500 pl-4">
            <h4 class="text-lg font-bold text-gray-900 mb-2">
              <i class="fas fa-star text-teal-600 mr-2"></i>Featured Poet Program
            </h4>
            <p class="text-gray-700 mb-2">
              Get highlighted placement and reach more readers. Featured poets appear at the top of search results and get special badges.
            </p>
            <button onclick="showSubscriptionPlans()" class="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600">
              <i class="fas fa-crown mr-1"></i>Learn More
            </button>
          </div>

          <div class="border-l-4 border-indigo-500 pl-4">
            <h4 class="text-lg font-bold text-gray-900 mb-2">
              <i class="fas fa-cog text-indigo-600 mr-2"></i>Account Settings
            </h4>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Profile:</strong> Update your display name, bio, and avatar</li>
              <li><strong>Settings:</strong> Configure notifications and privacy</li>
              <li><strong>Preferences:</strong> Set default language, editor theme, and more</li>
              <li><strong>Security:</strong> Change password and manage sessions</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },

  // FAQs Content
  getFAQsContent() {
    return `
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <h3 class="text-xl font-bold text-gray-900 mb-3">
            <i class="fas fa-question-circle text-blue-600 mr-2"></i>Frequently Asked Questions
          </h3>
        </div>

        <div class="space-y-3">
          ${HelpMenu.createFAQ(
            'How do I create my first poem?',
            'Click on "Create New Poem" button from your dashboard. Select your preferred language, enter a title, write your poem, and click "Publish". You can also save it as a draft to continue later.'
          )}
          
          ${HelpMenu.createFAQ(
            'How do I type in Marathi or Hindi?',
            'You have multiple options: 1) Use our built-in transliteration (press Ctrl+G), 2) Enable Google Input Tools from the editor toolbar, 3) Use Pramukh IME, or 4) Use your system\'s native keyboard. Our editor supports all major input methods.'
          )}
          
          ${HelpMenu.createFAQ(
            'What is the difference between Free and Premium plans?',
            'Free plan allows up to 10 poems with basic features. Premium plan ($4.66/year) offers unlimited poems, advanced editor features, real-time transliteration, priority support, and ad-free experience.'
          )}
          
          ${HelpMenu.createFAQ(
            'Can I edit or delete my published poems?',
            'Yes! Go to your dashboard, find the poem you want to edit, and click the Edit button. You can also delete poems from the same menu. Changes are saved immediately.'
          )}
          
          ${HelpMenu.createFAQ(
            'How do I become a Featured Poet?',
            'Click on "Go Featured" in the navigation menu or visit the subscription page. Featured Poet status costs $99/year and gives you priority placement, special badges, and increased visibility.'
          )}
          
          ${HelpMenu.createFAQ(
            'What languages are supported?',
            'The platform supports three languages: Marathi (मराठी), Hindi (हिंदी), and English. You can write poems in any of these languages and switch between them anytime.'
          )}
          
          ${HelpMenu.createFAQ(
            'How do I change my profile information?',
            'Click on the user menu (your name) in the top navigation bar, then select "Profile". You can update your display name, bio, avatar, and other information from there.'
          )}
          
          ${HelpMenu.createFAQ(
            'Are my poems copyrighted?',
            'Yes, you retain full copyright of your original work. By using the platform, you grant us non-exclusive rights to display your poems and include them in paid anthologies. You can read our full Terms of Service for details.'
          )}
          
          ${HelpMenu.createFAQ(
            'How do keyboard shortcuts work?',
            'Press Ctrl+G for Google Input Tools, Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for links, and Ctrl+Shift+F for fullscreen mode. Check the Shortcuts tab for the complete list.'
          )}
          
          ${HelpMenu.createFAQ(
            'Can I write poems in multiple languages?',
            'Yes! Each poem can be written in one language (Marathi, Hindi, or English), but you can have poems in all three languages in your profile. Readers can filter by language preference.'
          )}
          
          ${HelpMenu.createFAQ(
            'How do I cancel my subscription?',
            'Go to Settings > Subscription and click "Cancel Subscription". Your premium features will remain active until the end of your billing period. You can resubscribe anytime.'
          )}
          
          ${HelpMenu.createFAQ(
            'What payment methods are accepted?',
            'We accept all major payment methods through Razorpay, including credit cards, debit cards, UPI, net banking, and wallets. All payments are secure and encrypted.'
          )}
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-6">
          <h4 class="font-bold text-gray-900 mb-2">
            <i class="fas fa-lightbulb text-yellow-600 mr-2"></i>Still have questions?
          </h4>
          <p class="text-gray-700 text-sm">
            Contact us at <a href="mailto:support@poetryplatform.com" class="text-blue-600 hover:underline">support@poetryplatform.com</a> or use the contact form in your dashboard. We're here to help!
          </p>
        </div>
      </div>
    `;
  },

  // Create FAQ item
  createFAQ(question, answer) {
    return `
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
        <div class="flex items-start">
          <div class="text-blue-600 mr-3 mt-1">
            <i class="fas fa-question-circle"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-gray-900 mb-2">${question}</h4>
            <p class="text-gray-700 text-sm">${answer}</p>
          </div>
        </div>
      </div>
    `;
  },

  // Keyboard Shortcuts Content
  getShortcutsContent() {
    return `
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            <i class="fas fa-keyboard text-purple-600 mr-2"></i>Keyboard Shortcuts
          </h3>
          <p class="text-gray-700 text-sm">Speed up your workflow with these keyboard shortcuts</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center">
              <i class="fas fa-language text-orange-600 mr-2"></i>Input Methods
            </h4>
            <div class="space-y-2">
              ${HelpMenu.createShortcut('Ctrl + G', 'Toggle Google Input Tools')}
              ${HelpMenu.createShortcut('Ctrl + M', 'Toggle Pramukh IME')}
              ${HelpMenu.createShortcut('Ctrl + Shift + K', 'Open keyboard selector')}
            </div>
          </div>

          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center">
              <i class="fas fa-text-height text-blue-600 mr-2"></i>Text Formatting
            </h4>
            <div class="space-y-2">
              ${HelpMenu.createShortcut('Ctrl + B', 'Bold text')}
              ${HelpMenu.createShortcut('Ctrl + I', 'Italic text')}
              ${HelpMenu.createShortcut('Ctrl + U', 'Underline text')}
              ${HelpMenu.createShortcut('Ctrl + K', 'Insert link')}
            </div>
          </div>

          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center">
              <i class="fas fa-heading text-green-600 mr-2"></i>Headings & Lists
            </h4>
            <div class="space-y-2">
              ${HelpMenu.createShortcut('Ctrl + 1', 'Heading 1')}
              ${HelpMenu.createShortcut('Ctrl + 2', 'Heading 2')}
              ${HelpMenu.createShortcut('Ctrl + Shift + 7', 'Ordered list')}
              ${HelpMenu.createShortcut('Ctrl + Shift + 8', 'Bullet list')}
            </div>
          </div>

          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center">
              <i class="fas fa-edit text-purple-600 mr-2"></i>Editor Actions
            </h4>
            <div class="space-y-2">
              ${HelpMenu.createShortcut('Ctrl + S', 'Save draft')}
              ${HelpMenu.createShortcut('Ctrl + Shift + F', 'Toggle fullscreen')}
              ${HelpMenu.createShortcut('Ctrl + Shift + C', 'Toggle code view')}
              ${HelpMenu.createShortcut('Esc', 'Exit fullscreen')}
            </div>
          </div>

          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center">
              <i class="fas fa-undo text-red-600 mr-2"></i>Undo & Redo
            </h4>
            <div class="space-y-2">
              ${HelpMenu.createShortcut('Ctrl + Z', 'Undo last action')}
              ${HelpMenu.createShortcut('Ctrl + Y', 'Redo last action')}
              ${HelpMenu.createShortcut('Ctrl + Shift + Z', 'Redo (alternative)')}
            </div>
          </div>

          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center">
              <i class="fas fa-search text-teal-600 mr-2"></i>Navigation
            </h4>
            <div class="space-y-2">
              ${HelpMenu.createShortcut('Ctrl + /', 'Show all shortcuts')}
              ${HelpMenu.createShortcut('Ctrl + F', 'Find in document')}
              ${HelpMenu.createShortcut('Ctrl + H', 'Replace text')}
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
          <p class="text-sm text-gray-700">
            <i class="fas fa-info-circle text-blue-600 mr-2"></i>
            <strong>Tip:</strong> You can customize keyboard shortcuts in Settings > Preferences > Keyboard
          </p>
        </div>
      </div>
    `;
  },

  // Create shortcut item
  createShortcut(keys, description) {
    return `
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-700">${description}</span>
        <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono font-semibold">${keys}</kbd>
      </div>
    `;
  },

  // Tour Content
  getTourContent() {
    return `
      <div class="text-center py-8">
        <div class="text-6xl mb-6">🎯</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Take a Quick Tour</h3>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
          New to कविता व्यासपीठ? Take our guided tour to learn about all the features and get started quickly.
          The tour takes about 2 minutes.
        </p>
        <button onclick="HelpMenu.startTour()" class="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg">
          <i class="fas fa-play-circle mr-2"></i>Start Tour
        </button>
        
        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div class="bg-blue-50 rounded-lg p-6">
            <div class="text-3xl mb-3">📝</div>
            <h4 class="font-bold text-gray-900 mb-2">Create Poems</h4>
            <p class="text-sm text-gray-700">Learn how to write and publish your first poem</p>
          </div>
          <div class="bg-green-50 rounded-lg p-6">
            <div class="text-3xl mb-3">⌨️</div>
            <h4 class="font-bold text-gray-900 mb-2">Editor Features</h4>
            <p class="text-sm text-gray-700">Discover rich text formatting and shortcuts</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-6">
            <div class="text-3xl mb-3">🌐</div>
            <h4 class="font-bold text-gray-900 mb-2">Language Tools</h4>
            <p class="text-sm text-gray-700">Master transliteration and input methods</p>
          </div>
        </div>
      </div>
    `;
  },

  // Start tour
  startTour() {
    // Close help menu
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    
    // Start onboarding tour
    if (typeof OnboardingTour !== 'undefined') {
      OnboardingTour.restart();
    } else {
      alert('Tour functionality is loading. Please try again in a moment.');
    }
  }
};

// Make globally accessible
window.HelpMenu = HelpMenu;
