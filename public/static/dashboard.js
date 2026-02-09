// Shabdly Dashboard - E-commerce Translation Platform
// Complete dashboard with file upload, translation jobs, credits, and glossary

const API_BASE = window.location.origin;
let authToken = localStorage.getItem('shabdly_token');
let currentUser = null;

// =============================================
// API HELPER FUNCTIONS
// =============================================

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

// =============================================
// AUTH FUNCTIONS
// =============================================

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

async function requestPasswordReset(email) {
    try {
        const data = await apiCall('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
            skipAuth: true
        });
        return data;
    } catch (error) {
        throw error;
    }
}

async function resetPassword(token, newPassword) {
    try {
        const data = await apiCall('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
            skipAuth: true
        });
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

// =============================================
// TRANSLATION FUNCTIONS
// =============================================

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

// =============================================
// CREDIT FUNCTIONS
// =============================================

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

// =============================================
// KNOWLEDGE BASE FUNCTIONS
// =============================================

async function getKnowledgeBaseArticles(category = null) {
    const url = category ? `/api/knowledge?category=${category}` : '/api/knowledge';
    return await apiCall(url, { skipAuth: true });
}

async function getKnowledgeBaseArticle(slug) {
    return await apiCall(`/api/knowledge/${slug}`, { skipAuth: true });
}

async function searchKnowledgeBase(query) {
    return await apiCall(`/api/knowledge/search?q=${encodeURIComponent(query)}`, { skipAuth: true });
}

window.showKnowledgeBase = function() {
    const content = `
        <div class="space-y-6">
            <!-- Search Bar -->
            <div class="relative">
                <input type="text" id="kb-search" placeholder="Search for help articles..."
                    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <i class="fas fa-search absolute left-4 top-4 text-gray-400"></i>
            </div>
            
            <!-- Categories -->
            <div class="flex flex-wrap gap-2">
                <button onclick="loadKnowledgeBase()" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                    All Articles
                </button>
                <button onclick="loadKnowledgeBase('Getting Started')" 
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                    Getting Started
                </button>
                <button onclick="loadKnowledgeBase('Translation Management')" 
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                    Translation Management
                </button>
                <button onclick="loadKnowledgeBase('Optimization & Quality')" 
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                    Optimization & Quality
                </button>
            </div>
            
            <!-- Articles Container -->
            <div id="kb-articles-container">
                <div class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                    <p class="mt-4 text-gray-600">Loading articles...</p>
                </div>
            </div>
        </div>
    `;

    showModal('Help Center - Knowledge Base', content);
    
    // Load articles
    loadKnowledgeBase();
    
    // Setup search
    let searchTimeout;
    document.getElementById('kb-search').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length > 2) {
            searchTimeout = setTimeout(async () => {
                try {
                    const data = await searchKnowledgeBase(query);
                    renderKnowledgeBaseArticles(data.articles || []);
                } catch (error) {
                    console.error('Search error:', error);
                }
            }, 300);
        } else if (query.length === 0) {
            loadKnowledgeBase();
        }
    });
};

async function loadKnowledgeBase(category = null) {
    const container = document.getElementById('kb-articles-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            <p class="mt-4 text-gray-600">Loading articles...</p>
        </div>
    `;
    
    try {
        const data = await getKnowledgeBaseArticles(category);
        renderKnowledgeBaseArticles(data.articles || []);
    } catch (error) {
        container.innerHTML = `
            <div class="text-center py-8 text-red-600">
                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                <p>Failed to load articles. Please try again.</p>
            </div>
        `;
    }
}

function renderKnowledgeBaseArticles(articles) {
    const container = document.getElementById('kb-articles-container');
    if (!container) return;
    
    if (!articles || articles.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-inbox text-6xl mb-4"></i>
                <p>No articles found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${articles.map(article => `
                <div class="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition cursor-pointer"
                     onclick="showKnowledgeBaseArticle('${article.slug}')">
                    <div class="flex items-start justify-between mb-3">
                        <h3 class="text-lg font-semibold text-gray-900">${article.title}</h3>
                        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                            ${article.category}
                        </span>
                    </div>
                    ${article.excerpt ? `
                        <p class="text-sm text-gray-600 mb-3">${article.excerpt}</p>
                    ` : ''}
                    <div class="flex items-center text-xs text-gray-500">
                        <i class="fas fa-eye mr-1"></i>
                        <span>${article.views || 0} views</span>
                        ${article.helpful_count ? `
                            <span class="ml-4">
                                <i class="fas fa-thumbs-up mr-1 text-green-600"></i>
                                ${article.helpful_count}
                            </span>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

window.showKnowledgeBaseArticle = async function(slug) {
    const content = `
        <div id="article-content">
            <div class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4 text-gray-600">Loading article...</p>
            </div>
        </div>
    `;
    
    showModal('Loading...', content);
    
    try {
        const data = await getKnowledgeBaseArticle(slug);
        const article = data.article;
        
        // Update modal title
        const modal = document.querySelector('.fixed');
        if (modal) {
            modal.querySelector('h2').textContent = article.title;
        }
        
        // Render article
        const container = document.getElementById('article-content');
        container.innerHTML = `
            <div class="prose prose-lg max-w-none">
                <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                    <div class="flex items-center text-sm text-blue-800">
                        <span class="font-semibold">${article.category}</span>
                        <span class="mx-2">•</span>
                        <span>${article.views || 0} views</span>
                    </div>
                </div>
                
                <div class="mb-8">
                    ${article.content}
                </div>
                
                <!-- Feedback -->
                <div class="border-t pt-6">
                    <p class="text-sm text-gray-700 mb-4">Was this article helpful?</p>
                    <div class="flex space-x-4">
                        <button onclick="submitArticleFeedback(${article.id}, true)" 
                            class="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                            <i class="fas fa-thumbs-up mr-2"></i>Yes
                            ${article.helpful_count ? `(${article.helpful_count})` : ''}
                        </button>
                        <button onclick="submitArticleFeedback(${article.id}, false)" 
                            class="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                            <i class="fas fa-thumbs-down mr-2"></i>No
                            ${article.not_helpful_count ? `(${article.not_helpful_count})` : ''}
                        </button>
                    </div>
                </div>
                
                <!-- Related Articles -->
                ${data.relatedArticles && data.relatedArticles.length > 0 ? `
                    <div class="border-t pt-6 mt-6">
                        <h3 class="text-lg font-semibold mb-4">Related Articles</h3>
                        <div class="grid grid-cols-1 gap-3">
                            ${data.relatedArticles.map(related => `
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer"
                                     onclick="showKnowledgeBaseArticle('${related.slug}')">
                                    <div class="font-medium text-gray-900">${related.title}</div>
                                    ${related.excerpt ? `
                                        <div class="text-sm text-gray-600 mt-1">${related.excerpt}</div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="text-center mt-8">
                    <button onclick="showKnowledgeBase()" 
                        class="text-blue-600 hover:text-blue-800 font-semibold">
                        <i class="fas fa-arrow-left mr-2"></i>Back to all articles
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        const container = document.getElementById('article-content');
        container.innerHTML = `
            <div class="text-center py-8 text-red-600">
                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                <p>Failed to load article. Please try again.</p>
                <button onclick="showKnowledgeBase()" 
                    class="mt-4 text-blue-600 hover:text-blue-800 font-semibold">
                    <i class="fas fa-arrow-left mr-2"></i>Back to all articles
                </button>
            </div>
        `;
    }
};

async function submitArticleFeedback(articleId, helpful) {
    try {
        await apiCall(`/api/knowledge/${articleId}/helpful`, {
            method: 'POST',
            body: JSON.stringify({ helpful }),
            skipAuth: true
        });
        showSuccess('Thank you for your feedback!');
    } catch (error) {
        console.error('Feedback error:', error);
    }
}

// =============================================
// GLOSSARY FUNCTIONS
// =============================================

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

// =============================================
// UI HELPER FUNCTIONS
// =============================================

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
    alert.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md shadow-lg';
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
    alert.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 max-w-md shadow-lg';
    alert.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

// =============================================
// AUTH UI
// =============================================

window.showLogin = function() {
    const content = `
        <form id="loginForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password">
            </div>
            <div class="flex justify-between items-center">
                <label class="flex items-center">
                    <input type="checkbox" class="mr-2">
                    <span class="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" onclick="showForgotPassword(); return false;" class="text-sm text-blue-600 hover:underline">
                    Forgot password?
                </a>
            </div>
            <button type="submit" 
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                <i class="fas fa-sign-in-alt mr-2"></i>Sign In
            </button>
            <div class="text-center text-sm text-gray-600">
                Don't have an account? 
                <a href="#" onclick="showSignup(); return false;" class="text-blue-600 hover:underline font-semibold">
                    Create one now - Get 1,000 free words
                </a>
            </div>
        </form>
    `;

    showModal('Sign In to Shabdly', content);

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';

        try {
            await login(email, password);
            showSuccess('Login successful! Welcome back!');
            document.querySelectorAll('.fixed').forEach(el => el.remove());
            setTimeout(() => window.location.href = '/dashboard', 1000);
        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Sign In';
        }
    });
};

window.showSignup = function() {
    const content = `
        <form id="signupForm" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div class="flex items-start">
                    <i class="fas fa-gift text-blue-600 text-2xl mr-3"></i>
                    <div>
                        <div class="font-semibold text-blue-900">Welcome Bonus!</div>
                        <div class="text-sm text-blue-700">Get 1,000 free word credits when you create your account</div>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Display Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="display_name" required 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                    </label>
                    <input type="text" name="company_name" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Company (optional)">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span class="text-red-500">*</span>
                </label>
                <input type="email" name="email" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Password <span class="text-red-500">*</span>
                </label>
                <input type="password" name="password" required minlength="6"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Min. 6 characters">
                <div class="text-xs text-gray-500 mt-1">
                    <i class="fas fa-info-circle mr-1"></i>Must be at least 6 characters long
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                </label>
                <input type="tel" name="phone" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 1234567890 (optional)">
            </div>
            
            <div class="flex items-start">
                <input type="checkbox" id="terms-checkbox" required class="mt-1 mr-2">
                <label for="terms-checkbox" class="text-sm text-gray-600">
                    I agree to the <a href="/terms" target="_blank" class="text-blue-600 hover:underline">Terms of Service</a> 
                    and <a href="/privacy" target="_blank" class="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
            </div>
            
            <button type="submit" 
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition">
                <i class="fas fa-rocket mr-2"></i>Create Account & Get 1,000 Free Words
            </button>
            
            <div class="text-center text-sm text-gray-600">
                Already have an account? 
                <a href="#" onclick="showLogin(); return false;" class="text-blue-600 hover:underline font-semibold">
                    Sign in here
                </a>
            </div>
        </form>
    `;

    showModal('Create Your Shabdly Account', content);

    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const display_name = formData.get('display_name');
        const company_name = formData.get('company_name');
        const phone = formData.get('phone');

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating your account...';

        try {
            await register(email, password, display_name, company_name, phone);
            showSuccess('Account created successfully! Welcome to Shabdly! 🎉');
            document.querySelectorAll('.fixed').forEach(el => el.remove());
            setTimeout(() => window.location.href = '/dashboard', 1500);
        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-rocket mr-2"></i>Create Account & Get 1,000 Free Words';
        }
    });
};

// =============================================
// FORGOT PASSWORD & RESET PASSWORD UI
// =============================================

window.showForgotPassword = function() {
    const content = `
        <form id="forgotPasswordForm" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div class="flex items-start">
                    <i class="fas fa-info-circle text-blue-600 text-xl mr-3"></i>
                    <div class="text-sm text-blue-700">
                        Enter your email address and we'll send you a link to reset your password.
                    </div>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" required 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com">
            </div>
            
            <button type="submit" 
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                <i class="fas fa-paper-plane mr-2"></i>Send Reset Link
            </button>
            
            <div class="text-center text-sm text-gray-600">
                Remember your password? 
                <a href="#" onclick="showLogin(); return false;" class="text-blue-600 hover:underline">
                    Back to sign in
                </a>
            </div>
        </form>
    `;

    showModal('Reset Your Password', content);

    document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

        try {
            await requestPasswordReset(email);
            showSuccess('Password reset link sent! Check your email.');
            document.querySelectorAll('.fixed').forEach(el => el.remove());
        } catch (error) {
            showError(error.message || 'Failed to send reset link. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Reset Link';
        }
    });
};

window.showResetPassword = function(token) {
    const content = `
        <form id="resetPasswordForm" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div class="flex items-start">
                    <i class="fas fa-lock text-blue-600 text-xl mr-3"></i>
                    <div class="text-sm text-blue-700">
                        Enter your new password below. Make sure it's at least 6 characters long.
                    </div>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    New Password <span class="text-red-500">*</span>
                </label>
                <input type="password" name="password" required minlength="6"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Min. 6 characters">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span class="text-red-500">*</span>
                </label>
                <input type="password" name="confirmPassword" required minlength="6"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Re-enter your password">
            </div>
            
            <button type="submit" 
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                <i class="fas fa-check mr-2"></i>Reset Password
            </button>
        </form>
    `;

    showModal('Set New Password', content);

    document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Resetting...';

        try {
            await resetPassword(token, password);
            showSuccess('Password reset successfully! You can now sign in.');
            document.querySelectorAll('.fixed').forEach(el => el.remove());
            setTimeout(() => showLogin(), 1500);
        } catch (error) {
            showError(error.message || 'Failed to reset password. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Reset Password';
        }
    });
};

// Check for reset token in URL
if (window.location.pathname === '/reset-password') {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        showResetPassword(token);
    }
}

// =============================================
// DASHBOARD UI COMPONENTS
// =============================================

async function renderDashboard() {
    const root = document.getElementById('dashboard-root');
    if (!root) return;

    // Get initial data
    const [creditData, jobsData, glossaryData] = await Promise.all([
        getCreditBalance().catch(() => ({ balance: 0 })),
        getTranslationJobs().catch(() => ({ jobs: [] })),
        getGlossary().catch(() => ({ terms: [] }))
    ]);

    root.innerHTML = `
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-language text-blue-600 text-2xl"></i>
                        <span class="text-2xl font-bold text-blue-600">Shabdly</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-right">
                            <div class="text-sm text-gray-600">Credits</div>
                            <div class="text-xl font-bold text-gray-900" id="credit-balance">${creditData.balance || 0}</div>
                        </div>
                        <button onclick="showBuyCredits()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-plus mr-2"></i>Buy Credits
                        </button>
                        <div class="relative">
                            <button onclick="toggleUserMenu()" class="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                                <i class="fas fa-user-circle text-2xl"></i>
                                <span>${currentUser?.display_name || 'User'}</span>
                            </button>
                            <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                <a href="#" onclick="logout(); return false;" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Upload Section -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-cloud-upload-alt mr-2 text-blue-600"></i>
                    Upload Files for Translation
                </h2>
                
                <!-- Drag & Drop Area -->
                <div id="drop-zone" class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition cursor-pointer">
                    <i class="fas fa-file-upload text-6xl text-gray-400 mb-4"></i>
                    <p class="text-lg text-gray-700 mb-2">Drag & drop your CSV/Excel files here</p>
                    <p class="text-sm text-gray-500 mb-4">or click to browse</p>
                    <input type="file" id="file-input" accept=".csv,.xlsx,.xls" class="hidden">
                    <button onclick="document.getElementById('file-input').click()" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Select File
                    </button>
                </div>

                <!-- Upload Form -->
                <div id="upload-form" class="hidden mt-6">
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <i class="fas fa-file text-blue-600 text-2xl"></i>
                                <div>
                                    <div class="font-semibold text-gray-900" id="file-name"></div>
                                    <div class="text-sm text-gray-600" id="file-size"></div>
                                </div>
                            </div>
                            <button onclick="clearFile()" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Target Languages -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Target Languages</label>
                            <div class="bg-white border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="hi" class="lang-checkbox mr-2"> Hindi (हिंदी)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="ta" class="lang-checkbox mr-2"> Tamil (தமிழ்)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="te" class="lang-checkbox mr-2"> Telugu (తెలుగు)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="kn" class="lang-checkbox mr-2"> Kannada (ಕನ್ನಡ)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="bn" class="lang-checkbox mr-2"> Bengali (বাংলা)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="mr" class="lang-checkbox mr-2"> Marathi (मराठी)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="gu" class="lang-checkbox mr-2"> Gujarati (ગુજરાતી)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="ml" class="lang-checkbox mr-2"> Malayalam (മലയാളം)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="pa" class="lang-checkbox mr-2"> Punjabi (ਪੰਜਾਬੀ)
                                </label>
                                <label class="flex items-center mb-2">
                                    <input type="checkbox" value="or" class="lang-checkbox mr-2"> Odia (ଓଡ଼ିଆ)
                                </label>
                            </div>
                        </div>

                        <!-- Tone Preset -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Translation Tone</label>
                            <select id="tone-preset" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="formal">Formal - Professional language</option>
                                <option value="bargain">Bargain/Street - Deal-focused, exciting</option>
                                <option value="youth">Youth/Slang - Modern, trendy</option>
                            </select>
                            
                            <div class="mt-4">
                                <div class="text-sm font-medium text-gray-700 mb-2">Estimated Cost</div>
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div class="text-2xl font-bold text-blue-600" id="estimated-cost">-</div>
                                    <div class="text-xs text-gray-600">credits</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onclick="startTranslation()" id="translate-btn"
                        class="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition">
                        <i class="fas fa-language mr-2"></i>Start Translation
                    </button>
                </div>
            </div>

            <!-- Translation Jobs -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900">
                        <i class="fas fa-tasks mr-2 text-blue-600"></i>
                        Translation Jobs
                    </h2>
                    <button onclick="refreshJobs()" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-sync-alt mr-1"></i>Refresh
                    </button>
                </div>
                
                <div id="jobs-container">
                    ${renderJobsTable(jobsData.jobs || [])}
                </div>
            </div>

            <!-- Brand Glossary -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900">
                        <i class="fas fa-book mr-2 text-blue-600"></i>
                        Brand Glossary
                    </h2>
                    <button onclick="showAddGlossaryTerm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-plus mr-2"></i>Add Term
                    </button>
                </div>
                
                <div id="glossary-container">
                    ${renderGlossary(glossaryData.terms || [])}
                </div>
            </div>
        </main>
    `;

    // Setup file upload handlers
    setupFileUpload();
}

function renderJobsTable(jobs) {
    if (!jobs || jobs.length === 0) {
        return `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-inbox text-6xl mb-4"></i>
                <p>No translation jobs yet. Upload your first file to get started!</p>
            </div>
        `;
    }

    return `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Languages</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${jobs.map(job => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <i class="fas fa-file-excel text-green-600 mr-2"></i>
                                    <div class="text-sm font-medium text-gray-900">${job.original_filename}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">${job.target_languages?.split(',').length || 0} languages</div>
                                <div class="text-xs text-gray-500">${job.tone_preset || 'formal'}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    job.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    job.status === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }">
                                    ${job.status}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${job.progress_percentage || 0}%"></div>
                                </div>
                                <div class="text-xs text-gray-500 mt-1">${job.progress_percentage || 0}%</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${job.total_credits || 0}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${new Date(job.created_at).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                ${job.status === 'completed' ? 
                                    `<button onclick="downloadTranslation(${job.id})" class="text-blue-600 hover:text-blue-900">
                                        <i class="fas fa-download mr-1"></i>Download
                                    </button>` :
                                    '<span class="text-gray-400">-</span>'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderGlossary(terms) {
    if (!terms || terms.length === 0) {
        return `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-book-open text-6xl mb-4"></i>
                <p>No brand terms added yet. Add terms to protect your brand names during translation.</p>
            </div>
        `;
    }

    return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${terms.map(term => `
                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                    <div class="flex justify-between items-start mb-2">
                        <div class="font-semibold text-gray-900">${term.term}</div>
                        <button onclick="deleteGlossaryTermUI(${term.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    ${term.category ? `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${term.category}</span>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// =============================================
// FILE UPLOAD HANDLERS
// =============================================

let selectedFile = null;

function setupFileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('border-blue-500', 'bg-blue-50');
    }

    function unhighlight(e) {
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            
            if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/)) {
                showError('Please upload a CSV or Excel file');
                return;
            }

            selectedFile = file;
            displaySelectedFile(file);
        }
    }
}

function displaySelectedFile(file) {
    document.getElementById('upload-form').classList.remove('hidden');
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-size').textContent = formatFileSize(file.size);
    
    // Estimate cost (rough estimate: 1 credit per 10 words, assuming 100 rows with 50 words each)
    const estimatedWords = 5000; // Placeholder
    const selectedLanguages = document.querySelectorAll('.lang-checkbox:checked').length || 1;
    const estimatedCost = Math.ceil(estimatedWords * selectedLanguages / 10);
    document.getElementById('estimated-cost').textContent = estimatedCost;
}

function clearFile() {
    selectedFile = null;
    document.getElementById('upload-form').classList.add('hidden');
    document.getElementById('file-input').value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function startTranslation() {
    if (!selectedFile) {
        showError('Please select a file first');
        return;
    }

    const selectedLanguages = Array.from(document.querySelectorAll('.lang-checkbox:checked')).map(cb => cb.value);
    if (selectedLanguages.length === 0) {
        showError('Please select at least one target language');
        return;
    }

    const tonePreset = document.getElementById('tone-preset').value;
    const btn = document.getElementById('translate-btn');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Uploading...';

    try {
        const result = await uploadFile(selectedFile, selectedLanguages, tonePreset);
        showSuccess('Translation started! Job ID: ' + result.jobId);
        clearFile();
        await refreshJobs();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-language mr-2"></i>Start Translation';
    } catch (error) {
        showError(error.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-language mr-2"></i>Start Translation';
    }
}

// =============================================
// REFRESH FUNCTIONS
// =============================================

async function refreshJobs() {
    try {
        const data = await getTranslationJobs();
        document.getElementById('jobs-container').innerHTML = renderJobsTable(data.jobs || []);
        showSuccess('Jobs refreshed!');
    } catch (error) {
        showError('Failed to refresh jobs');
    }
}

async function refreshCredits() {
    try {
        const data = await getCreditBalance();
        document.getElementById('credit-balance').textContent = data.balance || 0;
    } catch (error) {
        console.error('Failed to refresh credits');
    }
}

// =============================================
// GLOSSARY UI FUNCTIONS
// =============================================

window.showAddGlossaryTerm = function() {
    const content = `
        <form id="glossaryForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Brand Term *</label>
                <input type="text" name="term" required placeholder="e.g., SwiftCook, iPhone"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">This term will never be translated</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
                <select name="category" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">-- Select Category --</option>
                    <option value="brand">Brand Name</option>
                    <option value="product">Product Name</option>
                    <option value="model">Model Number</option>
                    <option value="sku">SKU</option>
                </select>
            </div>
            <button type="submit" 
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Add Term
            </button>
        </form>
    `;

    showModal('Add Brand Glossary Term', content);

    document.getElementById('glossaryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const term = formData.get('term');
        const category = formData.get('category') || null;

        try {
            await addGlossaryTerm(term, category);
            showSuccess('Term added successfully!');
            document.querySelectorAll('.fixed').forEach(el => el.remove());
            await refreshGlossary();
        } catch (error) {
            showError(error.message);
        }
    });
};

async function deleteGlossaryTermUI(id) {
    if (!confirm('Are you sure you want to delete this term?')) return;

    try {
        await deleteGlossaryTerm(id);
        showSuccess('Term deleted successfully!');
        await refreshGlossary();
    } catch (error) {
        showError(error.message);
    }
}

async function refreshGlossary() {
    try {
        const data = await getGlossary();
        document.getElementById('glossary-container').innerHTML = renderGlossary(data.terms || []);
    } catch (error) {
        showError('Failed to refresh glossary');
    }
}

// =============================================
// BUY CREDITS UI
// =============================================

window.showBuyCredits = function() {
    const content = `
        <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Starter Plan -->
                <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer"
                     onclick="purchasePlan('starter')">
                    <h3 class="text-xl font-bold mb-2">Starter</h3>
                    <div class="text-3xl font-bold text-blue-600 mb-4">$19<span class="text-lg text-gray-500">/mo</span></div>
                    <ul class="space-y-2 mb-4">
                        <li class="flex items-center text-sm">
                            <i class="fas fa-check text-green-500 mr-2"></i>10,000 word credits
                        </li>
                        <li class="flex items-center text-sm">
                            <i class="fas fa-check text-green-500 mr-2"></i>All 12 languages
                        </li>
                        <li class="flex items-center text-sm">
                            <i class="fas fa-check text-green-500 mr-2"></i>Email support
                        </li>
                    </ul>
                    <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Select Plan
                    </button>
                </div>

                <!-- Growth Plan -->
                <div class="border-2 border-blue-600 rounded-lg p-6 hover:border-blue-700 transition cursor-pointer"
                     onclick="purchasePlan('growth')">
                    <div class="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                        MOST POPULAR
                    </div>
                    <h3 class="text-xl font-bold mb-2">Growth</h3>
                    <div class="text-3xl font-bold text-blue-600 mb-4">$49<span class="text-lg text-gray-500">/mo</span></div>
                    <ul class="space-y-2 mb-4">
                        <li class="flex items-center text-sm">
                            <i class="fas fa-check text-green-500 mr-2"></i>100,000 word credits
                        </li>
                        <li class="flex items-center text-sm">
                            <i class="fas fa-check text-green-500 mr-2"></i>All 12 languages
                        </li>
                        <li class="flex items-center text-sm">
                            <i class="fas fa-check text-green-500 mr-2"></i>Brand glossary
                        </li>
                        <li class="flex items-center text-sm">
                            <i class="fas fa-check text-green-500 mr-2"></i>Priority support
                        </li>
                    </ul>
                    <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Select Plan
                    </button>
                </div>
            </div>

            <div class="text-center text-sm text-gray-500">
                All payments are processed securely through Lemon Squeezy
            </div>
        </div>
    `;

    showModal('Choose Your Plan', content);
};

async function purchasePlan(planName) {
    try {
        const data = await purchaseCredits(planName);
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        }
    } catch (error) {
        showError(error.message);
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

window.toggleUserMenu = function() {
    const menu = document.getElementById('user-menu');
    menu.classList.toggle('hidden');
};

// Auto-refresh credits and jobs every 30 seconds
setInterval(() => {
    if (window.location.pathname === '/dashboard' && authToken) {
        refreshCredits();
        refreshJobs();
    }
}, 30000);

// =============================================
// INITIALIZE DASHBOARD
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname === '/dashboard') {
        if (!authToken) {
            window.location.href = '/';
            return;
        }

        const user = await getCurrentUser();
        if (!user) {
            window.location.href = '/';
            return;
        }

        await renderDashboard();
    }
});
