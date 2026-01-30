// Shabdly Dashboard - E-commerce Translation Platform
// Simple vanilla JavaScript for authentication and dashboard functionality

const API_BASE = window.location.origin;
let authToken = localStorage.getItem('shabdly_token');
let currentUser = null;

// API Helper
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (authToken && !options.skipAuth) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth Functions
async function login(email, password) {
    try {
        const data = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true
        });

        authToken = data.token;
        localStorage.setItem('shabdly_token', authToken);
        currentUser = data.user;

        return data;
    } catch (error) {
        throw error;
    }
}

async function register(email, password, display_name, company_name = '', phone = '') {
    try {
        const data = await apiCall('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, display_name, company_name, phone }),
            skipAuth: true
        });

        authToken = data.token;
        localStorage.setItem('shabdly_token', authToken);
        currentUser = data.user;

        return data;
    } catch (error) {
        throw error;
    }
}

async function getCurrentUser() {
    if (!authToken) return null;

    try {
        const data = await apiCall('/api/auth/me');
        currentUser = data.user;
        return currentUser;
    } catch (error) {
        // Token invalid, clear it
        localStorage.removeItem('shabdly_token');
        authToken = null;
        return null;
    }
}

function logout() {
    localStorage.removeItem('shabdly_token');
    authToken = null;
    currentUser = null;
    window.location.href = '/';
}

// Translation Functions
async function uploadFile(file, targetLanguages, tonePreset = 'formal') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetLanguages', JSON.stringify(targetLanguages));
    formData.append('tonePreset', tonePreset);

    try {
        const response = await fetch(`${API_BASE}/api/translations/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

async function getTranslationJobs() {
    return await apiCall('/api/translations/jobs');
}

async function downloadTranslation(jobId) {
    window.open(`${API_BASE}/api/translations/download/${jobId}`, '_blank');
}

// Credit Functions
async function getCreditBalance() {
    return await apiCall('/api/credits/balance');
}

async function purchaseCredits(planName) {
    return await apiCall('/api/credits/purchase', {
        method: 'POST',
        body: JSON.stringify({ planName })
    });
}

async function getCreditHistory() {
    return await apiCall('/api/credits/history');
}

// Glossary Functions
async function getGlossary() {
    return await apiCall('/api/glossary');
}

async function addGlossaryTerm(term, category = null) {
    return await apiCall('/api/glossary', {
        method: 'POST',
        body: JSON.stringify({ term, category })
    });
}

async function deleteGlossaryTerm(id) {
    return await apiCall(`/api/glossary/${id}`, {
        method: 'DELETE'
    });
}

// Knowledge Base Functions
async function getKnowledgeBase() {
    return await apiCall('/api/knowledge');
}

async function getKnowledgeArticle(slug) {
    return await apiCall(`/api/knowledge/${slug}`);
}

// UI Helpers
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900">${title}</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md';
    alert.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 max-w-md';
    alert.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

// Auth UI
window.showLogin = function() {
    const content = `
        <form id="loginForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <button type="submit" 
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Login
            </button>
            <p class="text-center text-gray-600 text-sm">
                Don't have an account? <a href="#" onclick="showSignup()" class="text-blue-600 hover:underline">Sign up</a>
            </p>
        </form>
    `;

    showModal('Login to Shabdly', content);

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await login(email, password);
            showSuccess('Login successful!');
            setTimeout(() => window.location.href = '/dashboard', 1000);
        } catch (error) {
            showError(error.message);
        }
    });
};

window.showSignup = function() {
    const content = `
        <form id="signupForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
                <input type="text" name="display_name" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input type="password" name="password" required minlength="6"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Company Name (optional)</label>
                <input type="text" name="company_name" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input type="tel" name="phone" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <button type="submit" 
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Create Account & Get 1,000 Free Words
            </button>
            <p class="text-center text-gray-600 text-sm">
                Already have an account? <a href="#" onclick="showLogin()" class="text-blue-600 hover:underline">Login</a>
            </p>
        </form>
    `;

    showModal('Sign Up for Shabdly', content);

    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const display_name = formData.get('display_name');
        const company_name = formData.get('company_name');
        const phone = formData.get('phone');

        try {
            await register(email, password, display_name, company_name, phone);
            showSuccess('Account created! Welcome to Shabdly!');
            setTimeout(() => window.location.href = '/dashboard', 1000);
        } catch (error) {
            showError(error.message);
        }
    });
};

window.showKnowledgeBase = async function() {
    try {
        const data = await getKnowledgeBase();
        const articles = data.articles || [];

        const content = `
            <div class="space-y-4">
                <div class="mb-4">
                    <input type="text" id="kbSearch" placeholder="Search articles..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                </div>
                <div id="articlesList" class="space-y-3">
                    ${articles.map(article => `
                        <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition"
                             onclick="showArticle('${article.slug}')">
                            <h3 class="font-semibold text-gray-900 mb-1">${article.title}</h3>
                            <p class="text-sm text-gray-600">${article.excerpt}</p>
                            <div class="mt-2 text-xs text-gray-500">
                                <span class="mr-3"><i class="fas fa-eye mr-1"></i>${article.views} views</span>
                                <span class="mr-3"><i class="fas fa-thumbs-up mr-1"></i>${article.helpful_count} helpful</span>
                                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${article.category}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        showModal('Knowledge Base', content);
    } catch (error) {
        showError('Failed to load knowledge base');
    }
};

window.showArticle = async function(slug) {
    try {
        const data = await getKnowledgeArticle(slug);
        const article = data.article;

        const content = `
            <div>
                <div class="mb-4 text-sm text-gray-500">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${article.category}</span>
                    <span class="ml-3"><i class="fas fa-eye mr-1"></i>${article.views} views</span>
                </div>
                <div class="prose max-w-none">
                    ${article.content}
                </div>
                <div class="mt-6 border-t border-gray-200 pt-4">
                    <p class="text-sm text-gray-600 mb-2">Was this article helpful?</p>
                    <div class="flex space-x-2">
                        <button onclick="voteArticle(${article.id}, true)" 
                            class="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                            <i class="fas fa-thumbs-up mr-1"></i> Yes
                        </button>
                        <button onclick="voteArticle(${article.id}, false)" 
                            class="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                            <i class="fas fa-thumbs-down mr-1"></i> No
                        </button>
                    </div>
                </div>
            </div>
        `;

        showModal(article.title, content);
    } catch (error) {
        showError('Failed to load article');
    }
};

window.voteArticle = async function(articleId, helpful) {
    try {
        await apiCall(`/api/knowledge/${articleId}/helpful`, {
            method: 'POST',
            body: JSON.stringify({ helpful })
        });
        showSuccess('Thank you for your feedback!');
    } catch (error) {
        showError('Failed to submit feedback');
    }
};

// Check auth on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (authToken && window.location.pathname === '/dashboard') {
        // Load dashboard
        const user = await getCurrentUser();
        if (user) {
            // Dashboard will be built here
            console.log('User logged in:', user);
        } else {
            window.location.href = '/';
        }
    }
});
