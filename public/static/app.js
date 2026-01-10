// Poetry Platform Frontend Application

// API Base URL
const API_BASE = '/api';

// Global state
let currentUser = null;
let currentLanguage = 'en';
let authToken = null;

// Translation system
const translations = {
  en: {
    siteName: 'Poetry Platform',
    tagline: 'Share Your Poetry with the World',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    home: 'Home',
    myPoems: 'My Poems',
    createPoem: 'Create Poem',
    dashboard: 'Dashboard',
    admin: 'Admin Panel',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    displayName: 'Display Name',
    title: 'Title',
    content: 'Content',
    language: 'Language',
    english: 'English',
    hindi: 'Hindi',
    marathi: 'Marathi',
    publish: 'Publish',
    saveDraft: 'Save as Draft',
    edit: 'Edit',
    delete: 'Delete',
    report: 'Report',
    like: 'Like',
    views: 'Views',
    rating: 'Rating',
    allPoems: 'All Poems',
    featuredPoems: 'Featured Only',
    filterByLanguage: 'Filter by Language:',
    sortBy: 'Sort By:',
    newest: 'Newest',
    popular: 'Most Popular',
    topRated: 'Top Rated',
    acceptTerms: 'I accept the',
    terms: 'Terms of Service',
    loginSuccess: 'Login successful!',
    loginError: 'Invalid credentials',
    registerSuccess: 'Registration successful!',
    poemCreated: 'Poem published successfully!',
    poemUpdated: 'Poem updated successfully!',
    poemDeleted: 'Poem deleted successfully!',
  },
  hi: {
    siteName: 'कविता मंच',
    tagline: 'अपनी कविता दुनिया के साथ साझा करें',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    logout: 'लॉगआउट',
    home: 'होम',
    myPoems: 'मेरी कविताएँ',
    createPoem: 'कविता लिखें',
    admin: 'एडमिन पैनल',
    username: 'उपयोगकर्ता नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    displayName: 'प्रदर्शन नाम',
    title: 'शीर्षक',
    content: 'सामग्री',
    language: 'भाषा',
    publish: 'प्रकाशित करें',
    saveDraft: 'ड्राफ्ट सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    views: 'देखे गए',
    filterByLanguage: 'भाषा से फ़िल्टर करें:',
    sortBy: 'क्रमबद्ध करें:',
    newest: 'नवीनतम',
    popular: 'सबसे लोकप्रिय',
    topRated: 'शीर्ष रेटेड',
  },
  mr: {
    siteName: 'कविता व्यासपीठ',
    tagline: 'तुमची कविता जगासोबत शेअर करा',
    login: 'लॉगिन',
    register: 'नोंदणी',
    logout: 'लॉगआउट',
    home: 'होम',
    myPoems: 'माझ्या कविता',
    createPoem: 'कविता लिहा',
    admin: 'प्रशासन पॅनेल',
    username: 'वापरकर्तानाव',
    email: 'ईमेल',
    password: 'पासवर्ड',
    displayName: 'प्रदर्शन नाव',
    title: 'शीर्षक',
    content: 'सामग्री',
    language: 'भाषा',
    publish: 'प्रकाशित करा',
    saveDraft: 'ड्राफ्ट म्हणून जतन करा',
    edit: 'संपादित करा',
    delete: 'हटवा',
    views: 'पाहिले',
    filterByLanguage: 'भाषेनुसार फिल्टर करा:',
    sortBy: 'क्रमवारी लावा:',
    newest: 'नवीनतम',
    popular: 'सर्वात लोकप्रिय',
    topRated: 'सर्वोच्च रेटेड',
  }
};

function t(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.getElementById('site-name').textContent = t('siteName');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Check for existing token
  authToken = localStorage.getItem('authToken');
  if (authToken) {
    loadCurrentUser();
  }

  // Language selector
  document.getElementById('language-selector').addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    updateTranslations();
  });

  // Filter and sort
  document.getElementById('filter-language').addEventListener('change', loadPoems);
  document.getElementById('sort-by').addEventListener('change', loadPoems);
  document.getElementById('filter-featured').addEventListener('change', loadPoems);

  // Forms
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
  document.getElementById('create-poem-form').addEventListener('submit', handleCreatePoem);

  // Load initial poems
  loadPoems();
});

// Modal functions
function showLoginModal() {
  document.getElementById('login-modal').classList.add('active');
}

function showRegisterModal() {
  document.getElementById('register-modal').classList.add('active');
}

function showCreatePoemModal() {
  if (!authToken) {
    alert('Please login first');
    showLoginModal();
    return;
  }
  document.getElementById('create-poem-modal').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Auth functions
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value;
  const password = form.password.value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      
      // Update UI
      document.getElementById('auth-buttons').classList.add('hidden');
      document.getElementById('user-menu').classList.remove('hidden');
      
      if (currentUser.role === 'admin') {
        document.getElementById('admin-btn').classList.remove('hidden');
      }

      closeModal('login-modal');
      form.reset();
      alert(t('loginSuccess'));
      loadPoems();
    } else {
      document.getElementById('login-error').textContent = data.error || t('loginError');
      document.getElementById('login-error').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const display_name = form.display_name.value;
  const language_preference = currentLanguage;

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, display_name, language_preference })
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      
      // Update UI
      document.getElementById('auth-buttons').classList.add('hidden');
      document.getElementById('user-menu').classList.remove('hidden');

      closeModal('register-modal');
      form.reset();
      alert(t('registerSuccess'));
      loadPoems();
    } else {
      document.getElementById('register-error').textContent = data.error;
      document.getElementById('register-error').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Register error:', error);
    alert('Registration failed. Please try again.');
  }
}

async function loadCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      
      // Update UI
      document.getElementById('auth-buttons').classList.add('hidden');
      document.getElementById('user-menu').classList.remove('hidden');
      
      if (currentUser.role === 'admin') {
        document.getElementById('admin-btn').classList.remove('hidden');
      }
    } else {
      // Token expired or invalid
      logout();
    }
  } catch (error) {
    console.error('Load user error:', error);
  }
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  
  // Update UI
  document.getElementById('auth-buttons').classList.remove('hidden');
  document.getElementById('user-menu').classList.add('hidden');
  document.getElementById('admin-btn').classList.add('hidden');
  
  loadPoems();
}

// Poem functions
async function loadPoems() {
  const language = document.getElementById('filter-language').value;
  const sort = document.getElementById('sort-by').value;
  const featured = document.getElementById('filter-featured').checked;

  const params = new URLSearchParams();
  if (language) params.append('language', language);
  params.append('sort', sort);
  if (featured) params.append('featured', 'true');
  params.append('limit', '50');

  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('poems-grid').innerHTML = '';

  try {
    const response = await fetch(`${API_BASE}/poems?${params}`);
    const data = await response.json();

    document.getElementById('loading').classList.add('hidden');

    if (data.poems && data.poems.length > 0) {
      displayPoems(data.poems);
    } else {
      document.getElementById('poems-grid').innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">No poems found</div>';
    }
  } catch (error) {
    console.error('Load poems error:', error);
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('poems-grid').innerHTML = '<div class="col-span-full text-center text-red-500 py-12">Failed to load poems</div>';
  }
}

function displayPoems(poems) {
  const grid = document.getElementById('poems-grid');
  grid.innerHTML = '';

  poems.forEach(poem => {
    const avgRating = poem.average_rating || 0;
    const languageEmoji = poem.language === 'mr' ? '🇮🇳' : poem.language === 'hi' ? '🇮🇳' : '🇬🇧';
    const languageText = poem.language === 'mr' ? 'मराठी' : poem.language === 'hi' ? 'हिंदी' : 'English';

    const card = document.createElement('div');
    card.className = 'poem-card bg-white rounded-lg shadow-md p-6 cursor-pointer';
    card.onclick = () => viewPoem(poem.id);

    card.innerHTML = `
      ${poem.is_featured ? '<div class="text-yellow-500 text-sm font-semibold mb-2"><i class="fas fa-star mr-1"></i>Featured</div>' : ''}
      <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">${escapeHtml(poem.title)}</h3>
      <p class="text-gray-600 text-sm mb-2">${languageEmoji} ${languageText} • by ${escapeHtml(poem.author_display_name || poem.author_name)}</p>
      <div class="text-gray-700 mb-4 line-clamp-4 whitespace-pre-wrap">${escapeHtml(poem.content)}</div>
      <div class="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
        <span><i class="fas fa-eye mr-1"></i>${poem.view_count}</span>
        <span><i class="fas fa-heart mr-1"></i>${poem.like_count}</span>
        <span><i class="fas fa-star mr-1 text-yellow-500"></i>${avgRating.toFixed(1)}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

async function viewPoem(id) {
  try {
    const response = await fetch(`${API_BASE}/poems/${id}`);
    const data = await response.json();

    if (response.ok) {
      const poem = data.poem;
      const avgRating = poem.average_rating || 0;
      const languageEmoji = poem.language === 'mr' ? '🇮🇳' : poem.language === 'hi' ? '🇮🇳' : '🇬🇧';
      const languageText = poem.language === 'mr' ? 'मराठी' : poem.language === 'hi' ? 'हिंदी' : 'English';

      const modal = document.createElement('div');
      modal.className = 'modal active fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 overflow-y-auto';
      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };

      modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 my-8">
          ${poem.is_featured ? '<div class="text-yellow-500 text-lg font-semibold mb-2"><i class="fas fa-star mr-2"></i>Featured Poem</div>' : ''}
          <h2 class="text-3xl font-bold text-gray-800 mb-4">${escapeHtml(poem.title)}</h2>
          <div class="flex items-center justify-between mb-6 text-gray-600">
            <div>
              <span class="text-lg">${languageEmoji} ${languageText}</span>
              <span class="mx-2">•</span>
              <span>by ${escapeHtml(poem.author_display_name || poem.author_name)}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span><i class="fas fa-eye mr-1"></i>${poem.view_count}</span>
              <span><i class="fas fa-heart mr-1"></i>${poem.like_count}</span>
              <span><i class="fas fa-star mr-1 text-yellow-500"></i>${avgRating.toFixed(1)}</span>
            </div>
          </div>
          <div class="prose max-w-none mb-8 whitespace-pre-wrap text-lg leading-relaxed">${escapeHtml(poem.content)}</div>
          
          ${authToken ? `
            <div class="flex gap-4 mb-6">
              <button onclick="likePoem(${poem.id})" class="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-semibold">
                <i class="fas fa-heart mr-2"></i>Like
              </button>
              <button onclick="ratePoem(${poem.id})" class="px-6 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 font-semibold">
                <i class="fas fa-star mr-2"></i>Rate
              </button>
              ${currentUser && currentUser.id === poem.author_id ? `
                <button onclick="editPoem(${poem.id})" class="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-semibold">
                  <i class="fas fa-edit mr-2"></i>Edit
                </button>
                <button onclick="deletePoem(${poem.id})" class="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold">
                  <i class="fas fa-trash mr-2"></i>Delete
                </button>
              ` : ''}
            </div>
          ` : '<p class="text-gray-500 mb-6">Login to like and rate this poem</p>'}

          <button onclick="this.closest('.modal').remove()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      `;

      document.body.appendChild(modal);
    }
  } catch (error) {
    console.error('View poem error:', error);
    alert('Failed to load poem');
  }
}

async function handleCreatePoem(e) {
  e.preventDefault();
  const form = e.target;
  const title = form.title.value;
  const content = form.content.value;
  const language = form.language.value;
  const status = e.submitter.value;

  try {
    const response = await fetch(`${API_BASE}/poems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ title, content, language, status })
    });

    const data = await response.json();

    if (response.ok) {
      closeModal('create-poem-modal');
      form.reset();
      alert(t('poemCreated'));
      loadPoems();
    } else {
      document.getElementById('create-poem-error').textContent = data.error;
      document.getElementById('create-poem-error').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Create poem error:', error);
    alert('Failed to create poem');
  }
}

async function likePoem(id) {
  if (!authToken) {
    alert('Please login first');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/poems/${id}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      alert('Thank you for your feedback!');
      document.querySelector('.modal.active')?.remove();
      loadPoems();
    }
  } catch (error) {
    console.error('Like poem error:', error);
  }
}

async function ratePoem(id) {
  if (!authToken) {
    alert('Please login first');
    return;
  }

  const rating = prompt('Rate this poem (1-5 stars):');
  if (!rating || rating < 1 || rating > 5) return;

  try {
    const response = await fetch(`${API_BASE}/poems/${id}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ rating: parseInt(rating) })
    });

    if (response.ok) {
      alert('Rating submitted!');
      document.querySelector('.modal.active')?.remove();
      loadPoems();
    }
  } catch (error) {
    console.error('Rate poem error:', error);
  }
}

async function deletePoem(id) {
  if (!confirm('Are you sure you want to delete this poem?')) return;

  try {
    const response = await fetch(`${API_BASE}/poems/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      alert(t('poemDeleted'));
      document.querySelector('.modal.active')?.remove();
      loadPoems();
    }
  } catch (error) {
    console.error('Delete poem error:', error);
  }
}

async function loadMyPoems() {
  if (!authToken) {
    alert('Please login first');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/poems/user/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();

    if (response.ok) {
      const modal = document.createElement('div');
      modal.className = 'modal active fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 overflow-y-auto';
      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };

      const poemsHtml = data.poems.length > 0 
        ? data.poems.map(poem => `
            <div class="border-b pb-4 mb-4">
              <h4 class="text-lg font-semibold">${escapeHtml(poem.title)}</h4>
              <p class="text-sm text-gray-600">${poem.language} • ${poem.status} • ${poem.view_count} views</p>
              <div class="mt-2 space-x-2">
                <button onclick="viewPoem(${poem.id})" class="text-blue-600 hover:underline">View</button>
                <button onclick="deletePoem(${poem.id})" class="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          `).join('')
        : '<p class="text-gray-500">You haven\'t created any poems yet</p>';

      modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8">
          <h3 class="text-2xl font-bold mb-6">${t('myPoems')}</h3>
          <div class="max-h-96 overflow-y-auto">${poemsHtml}</div>
          <button onclick="this.closest('.modal').remove()" class="mt-6 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      `;

      document.body.appendChild(modal);
    }
  } catch (error) {
    console.error('Load my poems error:', error);
  }
}

function loadAdminDashboard() {
  alert('Admin dashboard will be implemented. Features: User management, reports, poem moderation, anthology selection.');
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
