// Shabdly Settings Management
// Comprehensive settings page with tabs for Personal, Professional, Skills, etc.

const API_BASE = window.location.origin + '/api';
let currentTab = 'personal';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  renderSettingsPage();
  loadSettings();
});

// Main render function
function renderSettingsPage() {
  const root = document.getElementById('settings-root');
  
  root.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation Bar -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="flex items-center">
                <img src="/static/shabdly-logo.png" alt="Shabdly" style="height:35px; width:auto; max-width:180px; object-fit:contain;">
              </a>
            </div>
            <div class="flex items-center space-x-4">
              <a href="/dashboard" class="text-gray-600 hover:text-gray-900">
                <i class="fas fa-home mr-2"></i>Dashboard
              </a>
              <button onclick="logout()" class="text-red-600 hover:text-red-800">
                <i class="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Settings Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow">
          <!-- Header -->
          <div class="px-6 py-4 border-b">
            <h1 class="text-2xl font-bold text-gray-900">
              <i class="fas fa-cog mr-2 text-gray-600"></i>Settings
            </h1>
            <p class="text-sm text-gray-600 mt-1">Manage your profile, preferences, and account settings</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <!-- Sidebar Navigation -->
            <div class="md:w-64 border-r">
              <nav class="p-4 space-y-1">
                <button onclick="switchTab('personal')" id="tab-personal" class="settings-tab active">
                  <i class="fas fa-user mr-3"></i>Personal Info
                </button>
                <button onclick="switchTab('professional')" id="tab-professional" class="settings-tab">
                  <i class="fas fa-briefcase mr-3"></i>Professional
                </button>
                <button onclick="switchTab('skills')" id="tab-skills" class="settings-tab">
                  <i class="fas fa-code mr-3"></i>Skills
                </button>
                <button onclick="switchTab('certifications')" id="tab-certifications" class="settings-tab">
                  <i class="fas fa-certificate mr-3"></i>Certifications
                </button>
                <button onclick="switchTab('projects')" id="tab-projects" class="settings-tab">
                  <i class="fas fa-project-diagram mr-3"></i>Projects
                </button>
                <button onclick="switchTab('experience')" id="tab-experience" class="settings-tab">
                  <i class="fas fa-building mr-3"></i>Experience
                </button>
                <button onclick="switchTab('education')" id="tab-education" class="settings-tab">
                  <i class="fas fa-graduation-cap mr-3"></i>Education
                </button>
                <button onclick="switchTab('preferences')" id="tab-preferences" class="settings-tab">
                  <i class="fas fa-sliders-h mr-3"></i>Preferences
                </button>
                <button onclick="switchTab('danger')" id="tab-danger" class="settings-tab text-red-600">
                  <i class="fas fa-exclamation-triangle mr-3"></i>Danger Zone
                </button>
              </nav>
            </div>

            <!-- Content Area -->
            <div class="flex-1 p-6">
              <div id="settings-content">
                <!-- Dynamic content loaded here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div id="confirmModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4" id="modalTitle">Confirm Action</h3>
        <p class="text-gray-600 mb-6" id="modalMessage"></p>
        <div class="flex justify-end space-x-3">
          <button onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button onclick="confirmModalAction()" id="modalConfirmBtn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Confirm
          </button>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .settings-tab {
      width: 100%;
      text-align: left;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .settings-tab:hover {
      background-color: #F3F4F6;
    }
    .settings-tab.active {
      background-color: #EEF2FF;
      color: #4F46E5;
      font-weight: 500;
    }
    .form-section {
      margin-bottom: 2rem;
    }
    .form-section h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #111827;
    }
    .data-card {
      border: 1px solid #E5E7EB;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
      transition: all 0.2s;
    }
    .data-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(style);
}

// Tab switching
function switchTab(tab) {
  currentTab = tab;
  
  // Update active tab styling
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  
  // Load tab content
  loadTabContent(tab);
}

// Load settings data
async function loadSettings() {
  loadTabContent('personal');
}

// Load tab content
async function loadTabContent(tab) {
  const content = document.getElementById('settings-content');
  const token = localStorage.getItem('token');

  try {
    switch(tab) {
      case 'personal':
        content.innerHTML = await renderPersonalInfo(token);
        break;
      case 'professional':
        content.innerHTML = await renderProfessionalInfo(token);
        break;
      case 'skills':
        content.innerHTML = await renderSkills(token);
        break;
      case 'certifications':
        content.innerHTML = await renderCertifications(token);
        break;
      case 'projects':
        content.innerHTML = await renderProjects(token);
        break;
      case 'experience':
        content.innerHTML = await renderExperience(token);
        break;
      case 'education':
        content.innerHTML = await renderEducation(token);
        break;
      case 'preferences':
        content.innerHTML = await renderPreferences(token);
        break;
      case 'danger':
        content.innerHTML = renderDangerZone();
        break;
    }
  } catch (error) {
    console.error('Load tab error:', error);
    content.innerHTML = `<div class="text-red-600">Error loading content. Please try again.</div>`;
  }
}

// Personal Info Tab
async function renderPersonalInfo(token) {
  const response = await axios.get(`${API_BASE}/settings/personal`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = response.data.personal || {};
  
  return `
    <form onsubmit="savePersonalInfo(event)" class="space-y-6">
      <div class="form-section">
        <h3><i class="fas fa-id-card mr-2 text-gray-600"></i>Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="full_name" value="${data.full_name || ''}" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" name="date_of_birth" value="${data.date_of_birth || ''}" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Gender</option>
              <option value="male" ${data.gender === 'male' ? 'selected' : ''}>Male</option>
              <option value="female" ${data.gender === 'female' ? 'selected' : ''}>Female</option>
              <option value="non-binary" ${data.gender === 'non-binary' ? 'selected' : ''}>Non-binary</option>
              <option value="prefer-not-to-say" ${data.gender === 'prefer-not-to-say' ? 'selected' : ''}>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div class="flex space-x-2">
              <input type="text" name="phone_country_code" value="${data.phone_country_code || '+91'}" 
                placeholder="+91" class="w-20 px-3 py-2 border border-gray-300 rounded-md">
              <input type="tel" name="phone" value="${data.phone || ''}" 
                placeholder="9876543210" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3><i class="fas fa-map-marker-alt mr-2 text-gray-600"></i>Address</h3>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input type="text" name="address_line1" value="${data.address_line1 || ''}" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input type="text" name="address_line2" value="${data.address_line2 || ''}" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value="${data.city || ''}" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" name="state" value="${data.state || ''}" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input type="text" name="postal_code" value="${data.postal_code || ''}" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" name="country" value="${data.country || 'India'}" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3><i class="fas fa-info-circle mr-2 text-gray-600"></i>About</h3>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea name="bio" rows="4" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself...">${data.bio || ''}</textarea>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button type="button" onclick="loadTabContent('personal')" 
          class="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" 
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <i class="fas fa-save mr-2"></i>Save Changes
        </button>
      </div>
    </form>
  `;
}

// Save personal info
async function savePersonalInfo(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    await axios.put(`${API_BASE}/settings/personal`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showNotification('Personal information saved successfully', 'success');
  } catch (error) {
    showNotification('Failed to save personal information', 'error');
    console.error('Save error:', error);
  }
}

// Professional Info Tab
async function renderProfessionalInfo(token) {
  const response = await axios.get(`${API_BASE}/settings/professional`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = response.data.professional || {};
  
  return `
    <form onsubmit="saveProfessionalInfo(event)" class="space-y-6">
      <div class="form-section">
        <h3><i class="fas fa-briefcase mr-2 text-gray-600"></i>Current Position</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input type="text" name="current_title" value="${data.current_title || ''}" 
              placeholder="e.g., Software Engineer" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" name="current_company" value="${data.current_company || ''}" 
              placeholder="e.g., Google" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input type="text" name="industry" value="${data.industry || ''}" 
              placeholder="e.g., Technology" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input type="number" name="experience_years" value="${data.experience_years || ''}" 
              placeholder="5" min="0" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3><i class="fas fa-link mr-2 text-gray-600"></i>Professional Links</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input type="url" name="linkedin_url" value="${data.linkedin_url || ''}" 
              placeholder="https://linkedin.com/in/yourprofile" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input type="url" name="github_url" value="${data.github_url || ''}" 
              placeholder="https://github.com/yourusername" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
            <input type="url" name="portfolio_url" value="${data.portfolio_url || ''}" 
              placeholder="https://yourportfolio.com" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
            <input type="url" name="resume_url" value="${data.resume_url || ''}" 
              placeholder="https://yourresume.pdf" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3><i class="fas fa-hands-helping mr-2 text-gray-600"></i>HeyShabdly Settings</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Role</option>
              <option value="Lending a Hand" ${data.role === 'Lending a Hand' ? 'selected' : ''}>Lending a Hand</option>
              <option value="Seeking Guidance" ${data.role === 'Seeking Guidance' ? 'selected' : ''}>Seeking Guidance</option>
              <option value="Both" ${data.role === 'Both' ? 'selected' : ''}>Both</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cal.com Username</label>
            <input type="text" name="calcom_username" value="${data.calcom_username || ''}" 
              placeholder="yourusername" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button type="button" onclick="loadTabContent('professional')" 
          class="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" 
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <i class="fas fa-save mr-2"></i>Save Changes
        </button>
      </div>
    </form>
  `;
}

// Save professional info
async function saveProfessionalInfo(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    await axios.put(`${API_BASE}/settings/professional`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showNotification('Professional information saved successfully', 'success');
  } catch (error) {
    showNotification('Failed to save professional information', 'error');
    console.error('Save error:', error);
  }
}

// Skills tab - List, Add, Edit, Delete
async function renderSkills(token) {
  const response = await axios.get(`${API_BASE}/settings/skills`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const skills = response.data.skills || [];
  
  let skillsHTML = skills.map(skill => `
    <div class="data-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900">${skill.skill_name}</h4>
          <p class="text-sm text-gray-600">
            Level: <span class="capitalize">${skill.proficiency_level}</span>
            ${skill.years_experience ? ` • ${skill.years_experience} years` : ''}
          </p>
        </div>
        <div class="flex space-x-2">
          <button onclick="editSkill(${skill.id}, '${skill.skill_name}', '${skill.proficiency_level}', ${skill.years_experience})" 
            class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteSkill(${skill.id})" class="text-red-600 hover:text-red-800">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (skills.length === 0) {
    skillsHTML = '<p class="text-gray-500 text-center py-8">No skills added yet. Add your first skill below.</p>';
  }

  return `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          <i class="fas fa-code mr-2 text-gray-600"></i>Your Skills
        </h2>
        ${skillsHTML}
      </div>

      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold mb-4">Add New Skill</h3>
        <form onsubmit="addSkill(event)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
              <input type="text" name="skill_name" required 
                placeholder="e.g., JavaScript" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
              <select name="proficiency_level" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate" selected>Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="number" name="years_experience" min="0" placeholder="3" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <div class="flex justify-end">
            <button type="submit" 
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <i class="fas fa-plus mr-2"></i>Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Add skill
async function addSkill(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    await axios.post(`${API_BASE}/settings/skills`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showNotification('Skill added successfully', 'success');
    loadTabContent('skills');
  } catch (error) {
    showNotification('Failed to add skill', 'error');
    console.error('Add skill error:', error);
  }
}

// Delete skill
async function deleteSkill(id) {
  if (!confirm('Are you sure you want to delete this skill?')) return;
  
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${API_BASE}/settings/skills/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showNotification('Skill deleted successfully', 'success');
    loadTabContent('skills');
  } catch (error) {
    showNotification('Failed to delete skill', 'error');
    console.error('Delete skill error:', error);
  }
}

// Danger Zone Tab
function renderDangerZone() {
  return `
    <div class="space-y-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 class="text-xl font-bold text-red-900 mb-2">
          <i class="fas fa-exclamation-triangle mr-2"></i>Danger Zone
        </h2>
        <p class="text-red-700 mb-6">
          These actions are irreversible. Please be certain before proceeding.
        </p>

        <!-- Export Data -->
        <div class="bg-white rounded-lg p-4 mb-4">
          <h3 class="font-semibold text-gray-900 mb-2">Export Your Data</h3>
          <p class="text-sm text-gray-600 mb-3">
            Download a copy of all your personal data in JSON format (GDPR compliant).
          </p>
          <button onclick="exportData()" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <i class="fas fa-download mr-2"></i>Export Data
          </button>
        </div>

        <!-- Delete Account -->
        <div class="bg-white rounded-lg p-4">
          <h3 class="font-semibold text-red-900 mb-2">Delete Account</h3>
          <p class="text-sm text-gray-600 mb-3">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <div class="flex space-x-3">
            <button onclick="scheduleAccountDeletion()" 
              class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              <i class="fas fa-clock mr-2"></i>Schedule Deletion (30 days)
            </button>
            <button onclick="deleteAccountImmediately()" 
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              <i class="fas fa-trash-alt mr-2"></i>Delete Immediately
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Export user data
async function exportData() {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_BASE}/settings/export-data`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Create downloadable file
    const dataStr = JSON.stringify(response.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shabdly-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully', 'success');
  } catch (error) {
    showNotification('Failed to export data', 'error');
    console.error('Export error:', error);
  }
}

// Schedule account deletion
async function scheduleAccountDeletion() {
  const reason = prompt('Please tell us why you\'re leaving (optional):');
  if (reason === null) return; // User cancelled
  
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_BASE}/settings/delete-account`, {
      reason,
      delete_immediately: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert(`Account deletion scheduled for ${new Date(response.data.scheduled_for).toLocaleDateString()}. You can cancel this within 30 days.`);
    showNotification('Account deletion scheduled', 'success');
  } catch (error) {
    showNotification('Failed to schedule deletion', 'error');
    console.error('Schedule deletion error:', error);
  }
}

// Delete account immediately
async function deleteAccountImmediately() {
  const confirmation = prompt('Type "DELETE" to confirm immediate account deletion:');
  if (confirmation !== 'DELETE') {
    alert('Confirmation failed. Account not deleted.');
    return;
  }
  
  const reason = prompt('Please tell us why you\'re leaving (optional):');
  if (reason === null) return;
  
  const token = localStorage.getItem('token');
  try {
    await axios.post(`${API_BASE}/settings/delete-account`, {
      reason,
      delete_immediately: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Clear local storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Your account has been deleted. We\'re sorry to see you go.');
    window.location.href = '/';
  } catch (error) {
    showNotification('Failed to delete account', 'error');
    console.error('Delete account error:', error);
  }
}

// Placeholder functions for other tabs (certifications, projects, experience, education, preferences)
// These follow similar patterns to the skills tab
async function renderCertifications(token) {
  return '<p class="text-gray-500">Certifications management - similar to skills</p>';
}

async function renderProjects(token) {
  return '<p class="text-gray-500">Projects management - similar to skills</p>';
}

async function renderExperience(token) {
  return '<p class="text-gray-500">Experience management - similar to skills</p>';
}

async function renderEducation(token) {
  return '<p class="text-gray-500">Education management - similar to skills</p>';
}

async function renderPreferences(token) {
  return '<p class="text-gray-500">Privacy and notification preferences</p>';
}

// Utility functions
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// Modal functions
let modalCallback = null;

function showConfirmModal(title, message, callback) {
  modalCallback = callback;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('confirmModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('confirmModal').classList.add('hidden');
  modalCallback = null;
}

function confirmModalAction() {
  if (modalCallback) {
    modalCallback();
  }
  closeModal();
}
