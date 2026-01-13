// User Profile Menu System
// Profile, Settings, Preferences, and Logout functionality

const UserProfileMenu = {
  // Show profile modal
  showProfile() {
    if (!currentUser) {
      alert('Please log in to view your profile');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-user-circle mr-2"></i>My Profile
            </h2>
            <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <form id="profileForm" onsubmit="UserProfileMenu.saveProfile(event)">
            <div class="text-center mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold mb-3">
                ${(currentUser.display_name || currentUser.username).charAt(0).toUpperCase()}
              </div>
              <button type="button" class="text-sm text-blue-600 hover:underline">
                <i class="fas fa-camera mr-1"></i>Change Avatar
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  <i class="fas fa-user mr-1"></i>Username
                </label>
                <input type="text" value="${currentUser.username}" disabled 
                  class="w-full border border-gray-300 rounded px-4 py-2 bg-gray-50 cursor-not-allowed">
                <p class="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  <i class="fas fa-signature mr-1"></i>Display Name
                </label>
                <input type="text" id="displayName" value="${currentUser.display_name || ''}" 
                  class="w-full border border-gray-300 rounded px-4 py-2" placeholder="Your display name">
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  <i class="fas fa-envelope mr-1"></i>Email
                </label>
                <input type="email" id="email" value="${currentUser.email || ''}" 
                  class="w-full border border-gray-300 rounded px-4 py-2" placeholder="your@email.com">
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  <i class="fas fa-align-left mr-1"></i>Bio
                </label>
                <textarea id="bio" rows="3" class="w-full border border-gray-300 rounded px-4 py-2" 
                  placeholder="Tell us about yourself...">${currentUser.bio || ''}</textarea>
                <p class="text-xs text-gray-500 mt-1">Max 500 characters</p>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">
                  <i class="fas fa-language mr-1"></i>Preferred Language
                </label>
                <select id="languagePreference" class="w-full border border-gray-300 rounded px-4 py-2">
                  <option value="en" ${currentUser.language_preference === 'en' ? 'selected' : ''}>English</option>
                  <option value="hi" ${currentUser.language_preference === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
                  <option value="mr" ${currentUser.language_preference === 'mr' ? 'selected' : ''}>मराठी (Marathi)</option>
                </select>
              </div>

              <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 class="font-bold text-gray-900 mb-2">
                  <i class="fas fa-crown text-yellow-500 mr-1"></i>Subscription Status
                </h4>
                <div class="text-sm text-gray-700">
                  <p><strong>Plan:</strong> ${currentUser.subscription_tier === 'premium' ? 'Premium Unlimited' : 'Free'}</p>
                  ${currentUser.subscription_tier === 'free' ? 
                    '<p><strong>Poems:</strong> ' + (currentUser.poems_used || 0) + ' / 10 used</p>' : 
                    '<p><strong>Poems:</strong> Unlimited</p>'}
                </div>
                ${currentUser.subscription_tier === 'free' ? 
                  '<button type="button" onclick="showUpgradeModal()" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"><i class="fas fa-arrow-up mr-1"></i>Upgrade to Premium</button>' : 
                  ''}
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" onclick="this.closest('.fixed').remove()" 
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <i class="fas fa-save mr-1"></i>Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  },

  // Save profile changes
  async saveProfile(e) {
    e.preventDefault();
    
    try {
      const response = await axios.put(API_BASE + '/auth/profile', {
        display_name: document.getElementById('displayName').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value,
        language_preference: document.getElementById('languagePreference').value
      }, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('auth_token') }
      });

      currentUser = response.data.user;
      alert('Profile updated successfully!');
      document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
      updateUI();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  },

  // Show settings modal
  showSettings() {
    if (!currentUser) {
      alert('Please log in to access settings');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-3xl w-full">
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-cog mr-2"></i>Settings
            </h2>
            <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-6">
            <!-- Account Security -->
            <div class="border-b pb-4">
              <h3 class="text-lg font-bold text-gray-900 mb-4">
                <i class="fas fa-shield-alt text-green-600 mr-2"></i>Account Security
              </h3>
              <button onclick="UserProfileMenu.showChangePassword()" 
                class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <i class="fas fa-key mr-2"></i>Change Password
              </button>
              <p class="text-sm text-gray-600 mt-2">Last password change: Never</p>
            </div>

            <!-- Privacy Settings -->
            <div class="border-b pb-4">
              <h3 class="text-lg font-bold text-gray-900 mb-4">
                <i class="fas fa-user-lock text-purple-600 mr-2"></i>Privacy Settings
              </h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <div class="font-semibold text-gray-900">Public Profile</div>
                    <div class="text-sm text-gray-600">Allow others to view your profile</div>
                  </div>
                  <input type="checkbox" checked class="toggle-checkbox w-12 h-6">
                </label>
                <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <div class="font-semibold text-gray-900">Show Email</div>
                    <div class="text-sm text-gray-600">Display email on public profile</div>
                  </div>
                  <input type="checkbox" class="toggle-checkbox w-12 h-6">
                </label>
                <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <div class="font-semibold text-gray-900">Poem Comments</div>
                    <div class="text-sm text-gray-600">Allow comments on your poems</div>
                  </div>
                  <input type="checkbox" checked class="toggle-checkbox w-12 h-6">
                </label>
              </div>
            </div>

            <!-- Notification Settings -->
            <div class="border-b pb-4">
              <h3 class="text-lg font-bold text-gray-900 mb-4">
                <i class="fas fa-bell text-yellow-600 mr-2"></i>Notifications
              </h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <div class="font-semibold text-gray-900">Email Notifications</div>
                    <div class="text-sm text-gray-600">Receive updates via email</div>
                  </div>
                  <input type="checkbox" checked class="toggle-checkbox w-12 h-6">
                </label>
                <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <div class="font-semibold text-gray-900">New Likes</div>
                    <div class="text-sm text-gray-600">Notify when someone likes your poem</div>
                  </div>
                  <input type="checkbox" checked class="toggle-checkbox w-12 h-6">
                </label>
                <label class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div>
                    <div class="font-semibold text-gray-900">New Comments</div>
                    <div class="text-sm text-gray-600">Notify when someone comments</div>
                  </div>
                  <input type="checkbox" checked class="toggle-checkbox w-12 h-6">
                </label>
              </div>
            </div>

            <!-- Subscription Management -->
            <div class="border-b pb-4">
              <h3 class="text-lg font-bold text-gray-900 mb-4">
                <i class="fas fa-credit-card text-blue-600 mr-2"></i>Subscription
              </h3>
              <div class="bg-${currentUser.subscription_tier === 'premium' ? 'blue' : 'gray'}-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-bold text-gray-900">
                      ${currentUser.subscription_tier === 'premium' ? 'Premium Unlimited' : 'Free Plan'}
                    </p>
                    <p class="text-sm text-gray-600">
                      ${currentUser.subscription_tier === 'premium' ? 'Active subscription' : 'Limited to 10 poems'}
                    </p>
                  </div>
                  ${currentUser.subscription_tier === 'free' ? 
                    '<button onclick="showUpgradeModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><i class="fas fa-arrow-up mr-1"></i>Upgrade</button>' :
                    '<button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><i class="fas fa-times mr-1"></i>Cancel</button>'}
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div>
              <h3 class="text-lg font-bold text-red-600 mb-4">
                <i class="fas fa-exclamation-triangle mr-2"></i>Danger Zone
              </h3>
              <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <button onclick="UserProfileMenu.confirmDeleteAccount()" 
                  class="w-full md:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <i class="fas fa-trash-alt mr-2"></i>Delete Account
                </button>
                <p class="text-sm text-red-700 mt-2">
                  <strong>Warning:</strong> This action cannot be undone. All your poems and data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button onclick="this.closest('.fixed').remove()" 
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  },

  // Show change password modal
  showChangePassword() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">
          <i class="fas fa-key mr-2"></i>Change Password
        </h3>
        <form onsubmit="UserProfileMenu.changePassword(event)">
          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Current Password</label>
              <input type="password" id="currentPassword" required 
                class="w-full border border-gray-300 rounded px-4 py-2">
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">New Password</label>
              <input type="password" id="newPassword" required 
                class="w-full border border-gray-300 rounded px-4 py-2">
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
              <input type="password" id="confirmPassword" required 
                class="w-full border border-gray-300 rounded px-4 py-2">
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" onclick="this.closest('.fixed').remove()" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Change Password
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
  },

  // Change password
  async changePassword(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      await axios.post(API_BASE + '/auth/change-password', {
        current_password: document.getElementById('currentPassword').value,
        new_password: newPassword
      }, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('auth_token') }
      });

      alert('Password changed successfully!');
      document.querySelectorAll('.fixed.z-\\[60\\]').forEach(el => el.remove());
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password');
    }
  },

  // Show preferences modal
  showPreferences() {
    if (!currentUser) {
      alert('Please log in to access preferences');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">
              <i class="fas fa-sliders-h mr-2"></i>Preferences
            </h2>
            <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <form onsubmit="UserProfileMenu.savePreferences(event)">
            <div class="space-y-6">
              <!-- Editor Preferences -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-3">
                  <i class="fas fa-edit text-blue-600 mr-2"></i>Editor Preferences
                </h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Default Editor Mode</label>
                    <select id="editorMode" class="w-full border border-gray-300 rounded px-4 py-2">
                      <option value="visual">Visual (WYSIWYG)</option>
                      <option value="markdown">Markdown</option>
                      <option value="code">HTML Code</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Editor Theme</label>
                    <select id="editorTheme" class="w-full border border-gray-300 rounded px-4 py-2">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="sepia">Sepia</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Font Size</label>
                    <select id="fontSize" class="w-full border border-gray-300 rounded px-4 py-2">
                      <option value="small">Small</option>
                      <option value="medium" selected>Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>
                  <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" id="autoSave" checked class="mr-3">
                    <div>
                      <div class="font-semibold text-gray-900">Auto-save</div>
                      <div class="text-sm text-gray-600">Automatically save drafts while writing</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Language & Input -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-3">
                  <i class="fas fa-language text-green-600 mr-2"></i>Language & Input
                </h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Default Poem Language</label>
                    <select id="defaultPoemLanguage" class="w-full border border-gray-300 rounded px-4 py-2">
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Default Input Method</label>
                    <select id="inputMethod" class="w-full border border-gray-300 rounded px-4 py-2">
                      <option value="system">System Keyboard</option>
                      <option value="google">Google Input Tools</option>
                      <option value="pramukh">Pramukh IME</option>
                      <option value="transliteration">Built-in Transliteration</option>
                    </select>
                  </div>
                  <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" id="autoTransliterate" class="mr-3">
                    <div>
                      <div class="font-semibold text-gray-900">Auto-transliteration</div>
                      <div class="text-sm text-gray-600">Automatically convert English to Devanagari</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Display Preferences -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-3">
                  <i class="fas fa-palette text-purple-600 mr-2"></i>Display Preferences
                </h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Theme</label>
                    <select id="theme" class="w-full border border-gray-300 rounded px-4 py-2">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" id="compactView" class="mr-3">
                    <div>
                      <div class="font-semibold text-gray-900">Compact View</div>
                      <div class="text-sm text-gray-600">Show more content on screen</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" onclick="this.closest('.fixed').remove()" 
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <i class="fas fa-save mr-1"></i>Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  },

  // Save preferences
  async savePreferences(e) {
    e.preventDefault();
    
    const preferences = {
      editor_mode: document.getElementById('editorMode').value,
      editor_theme: document.getElementById('editorTheme').value,
      font_size: document.getElementById('fontSize').value,
      auto_save: document.getElementById('autoSave').checked,
      default_poem_language: document.getElementById('defaultPoemLanguage').value,
      input_method: document.getElementById('inputMethod').value,
      auto_transliterate: document.getElementById('autoTransliterate').checked,
      theme: document.getElementById('theme').value,
      compact_view: document.getElementById('compactView').checked
    };

    // Save to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    alert('Preferences saved successfully!');
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
  },

  // Confirm account deletion
  confirmDeleteAccount() {
    if (confirm('⚠️ WARNING: This will permanently delete your account and all your poems!\n\nAre you absolutely sure? This action cannot be undone.')) {
      if (confirm('Last chance! Type "DELETE" in the next prompt to confirm.')) {
        const confirmation = prompt('Type DELETE to confirm account deletion:');
        if (confirmation === 'DELETE') {
          this.deleteAccount();
        } else {
          alert('Account deletion cancelled.');
        }
      }
    }
  },

  // Delete account
  async deleteAccount() {
    try {
      await axios.delete(API_BASE + '/auth/account', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('auth_token') }
      });
      
      localStorage.clear();
      alert('Your account has been deleted. We\'re sorry to see you go!');
      location.reload();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete account');
    }
  }
};

// Make globally accessible
window.UserProfileMenu = UserProfileMenu;
