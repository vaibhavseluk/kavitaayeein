import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './lib/types';
import auth from './routes/auth';
import poems from './routes/poems';
import admin from './routes/admin';
import subscriptions from './routes/subscriptions';
import sponsors from './routes/sponsors';
import anthology from './routes/anthology';
import editorRoute from './routes/editor';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Mount API routes
app.route('/api/auth', auth);
app.route('/api/poems', poems);
app.route('/api/admin', admin);
app.route('/api/subscriptions', subscriptions);
app.route('/api/sponsors', sponsors);
app.route('/api/anthology', anthology);

// Mount editor route
app.route('/editor', editorRoute);

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Homepage
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Poetry Platform - Share Your Voice in Marathi, Hindi & English</title>
        <meta name="description" content="A multi-author poetry platform supporting Marathi, Hindi, and English. Share your poems, discover featured poets, and join our community.">
        <meta name="keywords" content="poetry, marathi poetry, hindi poetry, multilingual, kavita, shayari, featured poet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/monetization.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;600;700&family=Noto+Sans:wght@300;400;600;700&display=swap');
            
            body {
                font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
            }
            
            .poem-card {
                transition: all 0.3s ease;
                border-left: 4px solid transparent;
            }
            
            .poem-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                border-left-color: #3b82f6;
            }
            
            .language-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
            }
            
            .lang-en { background: #dbeafe; color: #1e40af; }
            .lang-hi { background: #fef3c7; color: #92400e; }
            .lang-mr { background: #fce7f3; color: #9f1239; }
            
            .poem-content {
                white-space: pre-wrap;
                line-height: 1.8;
                font-size: 1.1rem;
            }
            
            .nav-link {
                transition: color 0.2s;
            }
            
            .nav-link:hover {
                color: #3b82f6;
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <h1 class="text-xl font-bold text-gray-900">कविता व्यासपीठ</h1>
                    </div>
                    <div class="flex items-center space-x-6">
                        <select id="languageSelect" class="border border-gray-300 rounded px-3 py-1 text-sm">
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="mr">मराठी</option>
                        </select>
                        <a href="#" onclick="showExplore()" class="nav-link text-gray-700"><i class="fas fa-compass mr-1"></i> Explore</a>
                        <a href="#" onclick="showAdvertiserPortal()" class="nav-link text-gray-700"><i class="fas fa-ad mr-1"></i> Advertise</a>
                        <a href="#" onclick="HelpMenu.show()" id="helpMenuIcon" class="nav-link text-gray-700" title="Help & Support">
                            <i class="fas fa-question-circle text-xl"></i>
                        </a>
                        <span id="authButtons">
                            <a href="#" onclick="showLogin()" class="nav-link text-gray-700"><i class="fas fa-sign-in-alt mr-1"></i> Login</a>
                            <a href="#" onclick="showSignup()" class="nav-link text-blue-600 font-semibold"><i class="fas fa-user-plus mr-1"></i> Sign Up</a>
                        </span>
                        <span id="userMenu" class="hidden flex items-center space-x-4">
                            <a href="#" onclick="showSubscriptionPlans()" class="nav-link text-yellow-600 font-semibold"><i class="fas fa-star mr-1"></i> Go Featured</a>
                            <a href="#" onclick="showDashboard()" class="nav-link text-gray-700"><i class="fas fa-tachometer-alt mr-1"></i> Dashboard</a>
                            
                            <!-- User Profile Dropdown -->
                            <div class="relative">
                                <button onclick="toggleUserDropdown()" id="userDropdownBtn" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        <span id="userInitial">U</span>
                                    </div>
                                    <i class="fas fa-chevron-down text-xs"></i>
                                </button>
                                
                                <div id="userDropdown" class="hidden absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    <div class="px-4 py-3 border-b border-gray-200">
                                        <p class="text-sm font-semibold text-gray-900" id="dropdownUsername">Username</p>
                                        <p class="text-xs text-gray-500" id="dropdownEmail">user@example.com</p>
                                    </div>
                                    <a href="#" onclick="UserProfileMenu.showProfile(); toggleUserDropdown();" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                                        <i class="fas fa-user-circle mr-2 w-4"></i>Profile
                                    </a>
                                    <a href="#" onclick="UserProfileMenu.showSettings(); toggleUserDropdown();" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                                        <i class="fas fa-cog mr-2 w-4"></i>Settings
                                    </a>
                                    <a href="#" onclick="UserProfileMenu.showPreferences(); toggleUserDropdown();" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                                        <i class="fas fa-sliders-h mr-2 w-4"></i>Preferences
                                    </a>
                                    <a href="#" onclick="HelpMenu.show(); toggleUserDropdown();" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                                        <i class="fas fa-question-circle mr-2 w-4"></i>Help
                                    </a>
                                    <div class="border-t border-gray-200 my-2"></div>
                                    <a href="#" onclick="logout()" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                        <i class="fas fa-sign-out-alt mr-2 w-4"></i>Logout
                                    </a>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div id="app" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Hero Section -->
            <div id="heroSection" class="text-center mb-12">
                <h2 class="text-5xl font-bold text-gray-900 mb-4">
                    Share Your Poetry
                </h2>
                <p class="text-xl text-gray-600 mb-8">
                    मराठी, हिंदी आणि English - A platform for multilingual poets
                </p>
                <button onclick="showSignup()" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                    <i class="fas fa-pen-fancy mr-2"></i> Start Writing
                </button>
            </div>

            <!-- Key Features Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 shadow-lg">
                <h3 class="text-3xl font-bold text-center text-gray-900 mb-8">
                    <i class="fas fa-star text-yellow-500 mr-2"></i>Key Features
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Rich Text Formatting -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-blue-600 text-3xl mb-3">
                            <i class="fas fa-bold"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Rich Text Formatting</h4>
                        <p class="text-gray-600 text-sm">Bold, italic, headings, lists, and more for beautiful poetry presentation</p>
                    </div>

                    <!-- Code & Fullscreen Mode -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-green-600 text-3xl mb-3">
                            <i class="fas fa-expand"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Code View & Fullscreen</h4>
                        <p class="text-gray-600 text-sm">Switch between visual and code view, write in distraction-free fullscreen mode</p>
                    </div>

                    <!-- Keyboard Shortcuts -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-purple-600 text-3xl mb-3">
                            <i class="fas fa-keyboard"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Keyboard Shortcuts</h4>
                        <p class="text-gray-600 text-sm">Fast editing with Ctrl+G, Ctrl+B, and more productivity shortcuts</p>
                    </div>

                    <!-- Language-Specific Fonts -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-red-600 text-3xl mb-3">
                            <i class="fas fa-language"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Language-Specific Fonts</h4>
                        <p class="text-gray-600 text-sm">Beautiful Devanagari and Latin fonts optimized for poetry</p>
                    </div>

                    <!-- Responsive Design -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-indigo-600 text-3xl mb-3">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Responsive Design</h4>
                        <p class="text-gray-600 text-sm">Write and read poetry seamlessly on mobile, tablet, and desktop</p>
                    </div>

                    <!-- Real-time Transliteration -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-orange-600 text-3xl mb-3">
                            <i class="fas fa-sync-alt"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Real-time Transliteration</h4>
                        <p class="text-gray-600 text-sm">Type in English and get instant Devanagari transliteration</p>
                    </div>

                    <!-- Multiple Typing Methods -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-teal-600 text-3xl mb-3">
                            <i class="fas fa-edit"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Multiple Input Methods</h4>
                        <p class="text-gray-600 text-sm">Built-in IME, Google Input Tools, Pramukh IME support</p>
                    </div>

                    <!-- Multi-language Support -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-pink-600 text-3xl mb-3">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Multi-language Platform</h4>
                        <p class="text-gray-600 text-sm">Write in Marathi (मराठी), Hindi (हिंदी), and English seamlessly</p>
                    </div>

                    <!-- Featured Poets -->
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition">
                        <div class="text-yellow-600 text-3xl mb-3">
                            <i class="fas fa-crown"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2">Featured Poet Program</h4>
                        <p class="text-gray-600 text-sm">Get highlighted, earn priority placement, and reach more readers</p>
                    </div>
                </div>
            </div>

            <!-- Language Filter -->
            <div class="flex justify-center space-x-4 mb-8">
                <button onclick="filterPoems('')" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold" id="filter-all">All</button>
                <button onclick="filterPoems('en')" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" id="filter-en">English</button>
                <button onclick="filterPoems('hi')" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" id="filter-hi">हिंदी</button>
                <button onclick="filterPoems('mr')" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" id="filter-mr">मराठी</button>
            </div>

            <!-- Pricing Section -->
            <div class="bg-white rounded-2xl shadow-lg p-8 mb-12">
                <h3 class="text-3xl font-bold text-center text-gray-900 mb-4">
                    <i class="fas fa-tags text-green-500 mr-2"></i>Simple, Affordable Pricing
                </h3>
                <p class="text-center text-gray-600 mb-8">Start free, upgrade when you need more</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <!-- Free Plan -->
                    <div class="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                        <div class="text-center mb-6">
                            <h4 class="text-2xl font-bold text-gray-900 mb-2">Free</h4>
                            <div class="mb-4">
                                <span class="text-5xl font-bold text-gray-600">$0</span>
                                <span class="text-gray-500">/forever</span>
                            </div>
                            <p class="text-sm text-gray-600">Perfect for getting started</p>
                        </div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                <span><strong>10 poems</strong> maximum</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                <span>Basic editor features</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                <span>Community access</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                <span>Multilingual support</span>
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                            Get Started Free
                        </button>
                    </div>

                    <!-- Premium Plan -->
                    <div class="border-4 border-blue-500 rounded-xl p-6 relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition">
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                            BEST VALUE
                        </div>
                        <div class="text-center mb-6">
                            <h4 class="text-2xl font-bold text-gray-900 mb-2">Premium</h4>
                            <div class="mb-4">
                                <span class="text-5xl font-bold text-blue-600">$4.66</span>
                                <span class="text-gray-600">/year</span>
                            </div>
                            <p class="text-sm text-gray-700">Less than $0.40/month!</p>
                        </div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-900">
                                <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                <span><strong>Unlimited poems</strong></span>
                            </li>
                            <li class="flex items-center text-gray-900">
                                <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                <span>Advanced editor with rich formatting</span>
                            </li>
                            <li class="flex items-center text-gray-900">
                                <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                <span>Real-time transliteration</span>
                            </li>
                            <li class="flex items-center text-gray-900">
                                <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                <span>Multiple input methods (IME)</span>
                            </li>
                            <li class="flex items-center text-gray-900">
                                <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                <span>Priority support</span>
                            </li>
                            <li class="flex items-center text-gray-900">
                                <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                <span>No advertisements</span>
                            </li>
                        </ul>
                        <button onclick="currentUser ? showUpgradeModal() : showSignup()" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg">
                            <i class="fas fa-crown mr-2"></i>Upgrade to Premium
                        </button>
                        <p class="text-center text-xs text-gray-600 mt-3">
                            <i class="fas fa-shield-alt mr-1"></i>Secure payment via Razorpay
                        </p>
                    </div>
                </div>

                <div class="text-center mt-8">
                    <p class="text-sm text-gray-600">
                        <i class="fas fa-info-circle mr-1"></i>
                        All plans include: Original copyright-free content only, No plagiarism policy
                    </p>
                </div>
            </div>

            <!-- Poems Feed -->
            <div id="poemsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Poems will be loaded here -->
            </div>

            <!-- Login/Signup/Dashboard Modals will be injected here -->
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Global state
            let currentUser = null;
            let currentLang = 'en';
            let currentFilter = '';
            const API_BASE = '/api';

            // Initialize
            document.addEventListener('DOMContentLoaded', () => {
                checkAuth();
                loadPoems();
            });

            // Check authentication
            function checkAuth() {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    axios.get(API_BASE + '/auth/me', {
                        headers: { Authorization: 'Bearer ' + token }
                    })
                    .then(res => {
                        currentUser = res.data.user;
                        updateUI();
                    })
                    .catch(() => {
                        localStorage.removeItem('auth_token');
                    });
                }
            }

            // Update UI based on auth state
            function updateUI() {
                if (currentUser) {
                    document.getElementById('authButtons').classList.add('hidden');
                    document.getElementById('userMenu').classList.remove('hidden');
                    
                    // Update user dropdown info
                    const initial = (currentUser.display_name || currentUser.username).charAt(0).toUpperCase();
                    document.getElementById('userInitial').textContent = initial;
                    document.getElementById('dropdownUsername').textContent = currentUser.display_name || currentUser.username;
                    document.getElementById('dropdownEmail').textContent = currentUser.email || 'No email set';
                    
                    document.getElementById('heroSection').innerHTML = \`
                        <h2 class="text-4xl font-bold text-gray-900 mb-4">
                            Welcome back, \${currentUser.display_name || currentUser.username}!
                        </h2>
                        <button onclick="showCreatePoem()" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                            <i class="fas fa-plus mr-2"></i> Create New Poem
                        </button>
                    \`;
                }
            }

            // Toggle user dropdown menu
            function toggleUserDropdown() {
                const dropdown = document.getElementById('userDropdown');
                dropdown.classList.toggle('hidden');
            }

            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                const dropdown = document.getElementById('userDropdown');
                const button = document.getElementById('userDropdownBtn');
                
                if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
                    dropdown.classList.add('hidden');
                }
            });

            // Load poems
            async function loadPoems(language = '') {
                try {
                    const response = await axios.get(API_BASE + '/poems', {
                        params: { language: language || undefined, limit: 50 }
                    });
                    
                    const container = document.getElementById('poemsContainer');
                    if (response.data.poems.length === 0) {
                        container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">No poems found</div>';
                        return;
                    }
                    
                    container.innerHTML = response.data.poems.map(poem => \`
                        <div class="poem-card bg-white rounded-lg shadow p-6 cursor-pointer" onclick="viewPoem(\${poem.id})">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-xl font-bold text-gray-900">\${poem.title}</h3>
                                <span class="language-badge lang-\${poem.language}">\${poem.language.toUpperCase()}</span>
                            </div>
                            <div class="poem-content text-gray-700 mb-4 line-clamp-4">
                                \${poem.content.substring(0, 200)}...
                            </div>
                            <div class="flex justify-between items-center text-sm text-gray-500">
                                <span><i class="fas fa-user mr-1"></i> \${poem.author_display_name || poem.author_name}</span>
                                <div class="space-x-3">
                                    <span><i class="fas fa-eye mr-1"></i> \${poem.view_count}</span>
                                    <span><i class="fas fa-heart mr-1"></i> \${poem.like_count}</span>
                                    <span><i class="fas fa-star mr-1"></i> \${poem.average_rating ? poem.average_rating.toFixed(1) : '0.0'}</span>
                                </div>
                            </div>
                        </div>
                    \`).join('');
                } catch (error) {
                    console.error('Failed to load poems:', error);
                }
            }

            // Filter poems
            function filterPoems(lang) {
                currentFilter = lang;
                loadPoems(lang);
                
                // Update button styles
                document.querySelectorAll('[id^="filter-"]').forEach(btn => {
                    btn.className = 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300';
                });
                document.getElementById('filter-' + (lang || 'all')).className = 'px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold';
            }

            // Show login
            function showLogin() {
                document.getElementById('app').innerHTML = \`
                    <div class="max-w-4xl mx-auto">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Login Form -->
                            <div class="bg-white rounded-lg shadow-lg p-8">
                                <h2 class="text-3xl font-bold text-gray-900 mb-6">Login</h2>
                                <form onsubmit="handleLogin(event)">
                                    <div class="mb-4">
                                        <label class="block text-gray-700 font-semibold mb-2">Username or Email</label>
                                        <input type="text" id="loginUsername" required class="w-full border border-gray-300 rounded px-4 py-2">
                                    </div>
                                    <div class="mb-4">
                                        <label class="block text-gray-700 font-semibold mb-2">Password</label>
                                        <input type="password" id="loginPassword" required class="w-full border border-gray-300 rounded px-4 py-2">
                                    </div>
                                    <div class="mb-6">
                                        <a href="#" onclick="showForgotPassword()" class="text-sm text-blue-600 hover:underline">Forgot Password?</a>
                                    </div>
                                    <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                                        Login
                                    </button>
                                </form>
                                <p class="mt-4 text-center text-gray-600">
                                    Don't have an account? <a href="#" onclick="showSignup()" class="text-blue-600 font-semibold">Sign Up</a>
                                </p>
                                <p class="mt-2 text-center">
                                    <a href="#" onclick="location.reload()" class="text-gray-600 hover:text-gray-900">← Back to Home</a>
                                </p>
                            </div>

                            <!-- Key Features Panel -->
                            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
                                <h3 class="text-2xl font-bold text-gray-900 mb-6">
                                    <i class="fas fa-star text-yellow-500 mr-2"></i>Why Join Us?
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex items-start">
                                        <div class="text-blue-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-bold"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Rich Text Editor</h4>
                                            <p class="text-sm text-gray-700">Bold, italic, headings, lists for beautiful poems</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-green-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-keyboard"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Keyboard Shortcuts</h4>
                                            <p class="text-sm text-gray-700">Fast editing with Ctrl+G, Ctrl+B shortcuts</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-purple-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-expand"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Fullscreen Mode</h4>
                                            <p class="text-sm text-gray-700">Distraction-free writing experience</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-red-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-language"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Language Fonts</h4>
                                            <p class="text-sm text-gray-700">Beautiful Devanagari fonts for मराठी & हिंदी</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-orange-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-sync-alt"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Transliteration</h4>
                                            <p class="text-sm text-gray-700">Type in English, get Devanagari instantly</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-teal-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-mobile-alt"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Responsive Design</h4>
                                            <p class="text-sm text-gray-700">Write anywhere: mobile, tablet, desktop</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }

            // Handle login
            async function handleLogin(e) {
                e.preventDefault();
                try {
                    const response = await axios.post(API_BASE + '/auth/login', {
                        username: document.getElementById('loginUsername').value,
                        password: document.getElementById('loginPassword').value
                    });
                    
                    localStorage.setItem('auth_token', response.data.token);
                    currentUser = response.data.user;
                    alert('Login successful!');
                    location.reload();
                } catch (error) {
                    alert(error.response?.data?.error || 'Login failed');
                }
            }

            // Show signup
            function showSignup() {
                document.getElementById('app').innerHTML = \`
                    <div class="max-w-5xl mx-auto">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <!-- Signup Form -->
                            <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
                                <h2 class="text-3xl font-bold text-gray-900 mb-6">Sign Up</h2>
                                <form onsubmit="handleSignup(event)">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="mb-4">
                                            <label class="block text-gray-700 font-semibold mb-2">Username</label>
                                            <input type="text" id="signupUsername" required class="w-full border border-gray-300 rounded px-4 py-2">
                                        </div>
                                        <div class="mb-4">
                                            <label class="block text-gray-700 font-semibold mb-2">Email</label>
                                            <input type="email" id="signupEmail" required class="w-full border border-gray-300 rounded px-4 py-2">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="mb-4">
                                            <label class="block text-gray-700 font-semibold mb-2">Password</label>
                                            <input type="password" id="signupPassword" required class="w-full border border-gray-300 rounded px-4 py-2">
                                        </div>
                                        <div class="mb-4">
                                            <label class="block text-gray-700 font-semibold mb-2">Display Name</label>
                                            <input type="text" id="signupDisplayName" class="w-full border border-gray-300 rounded px-4 py-2">
                                        </div>
                                    </div>
                                    <div class="mb-4">
                                        <label class="block text-gray-700 font-semibold mb-2">Preferred Language</label>
                                        <select id="signupLanguage" class="w-full border border-gray-300 rounded px-4 py-2">
                                            <option value="en">English</option>
                                            <option value="hi">हिंदी</option>
                                            <option value="mr">मराठी</option>
                                        </select>
                                    </div>
                                    <div class="mb-6">
                                        <label class="flex items-start">
                                            <input type="checkbox" required class="mt-1 mr-2">
                                            <span class="text-sm text-gray-700">I agree to the <a href="#" onclick="showTerms()" class="text-blue-600">Terms of Service</a>, including granting the platform rights to include my poems in paid anthologies.</span>
                                        </label>
                                    </div>
                                    <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                                        <i class="fas fa-user-plus mr-2"></i>Sign Up
                                    </button>
                                </form>
                                <p class="mt-4 text-center text-gray-600">
                                    Already have an account? <a href="#" onclick="showLogin()" class="text-blue-600 font-semibold">Login</a>
                                </p>
                                <p class="mt-2 text-center">
                                    <a href="#" onclick="location.reload()" class="text-gray-600 hover:text-gray-900">← Back to Home</a>
                                </p>
                            </div>

                            <!-- Key Features Panel -->
                            <div class="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg p-6">
                                <h3 class="text-xl font-bold text-gray-900 mb-4">
                                    <i class="fas fa-gift text-yellow-500 mr-2"></i>What You Get
                                </h3>
                                <div class="space-y-3">
                                    <div class="bg-white bg-opacity-70 rounded-lg p-3">
                                        <div class="flex items-center mb-1">
                                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                            <h4 class="font-bold text-sm text-gray-900">Rich Text Formatting</h4>
                                        </div>
                                        <p class="text-xs text-gray-700 ml-6">Bold, italic, headings, lists</p>
                                    </div>
                                    <div class="bg-white bg-opacity-70 rounded-lg p-3">
                                        <div class="flex items-center mb-1">
                                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                            <h4 class="font-bold text-sm text-gray-900">Code & Fullscreen Mode</h4>
                                        </div>
                                        <p class="text-xs text-gray-700 ml-6">Visual & code view, fullscreen writing</p>
                                    </div>
                                    <div class="bg-white bg-opacity-70 rounded-lg p-3">
                                        <div class="flex items-center mb-1">
                                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                            <h4 class="font-bold text-sm text-gray-900">Keyboard Shortcuts</h4>
                                        </div>
                                        <p class="text-xs text-gray-700 ml-6">Ctrl+G, Ctrl+B, and more</p>
                                    </div>
                                    <div class="bg-white bg-opacity-70 rounded-lg p-3">
                                        <div class="flex items-center mb-1">
                                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                            <h4 class="font-bold text-sm text-gray-900">Language Fonts</h4>
                                        </div>
                                        <p class="text-xs text-gray-700 ml-6">Beautiful Devanagari typography</p>
                                    </div>
                                    <div class="bg-white bg-opacity-70 rounded-lg p-3">
                                        <div class="flex items-center mb-1">
                                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                            <h4 class="font-bold text-sm text-gray-900">Real-time Transliteration</h4>
                                        </div>
                                        <p class="text-xs text-gray-700 ml-6">Type English → Get Devanagari</p>
                                    </div>
                                    <div class="bg-white bg-opacity-70 rounded-lg p-3">
                                        <div class="flex items-center mb-1">
                                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                            <h4 class="font-bold text-sm text-gray-900">Multiple Input Methods</h4>
                                        </div>
                                        <p class="text-xs text-gray-700 ml-6">Built-in IME, Google Input, Pramukh</p>
                                    </div>
                                    <div class="bg-white bg-opacity-70 rounded-lg p-3">
                                        <div class="flex items-center mb-1">
                                            <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                            <h4 class="font-bold text-sm text-gray-900">Mobile Responsive</h4>
                                        </div>
                                        <p class="text-xs text-gray-700 ml-6">Write on any device</p>
                                    </div>
                                </div>
                                <div class="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                                    <p class="text-xs text-yellow-800 font-semibold">
                                        <i class="fas fa-star mr-1"></i>Upgrade to Featured Poet for priority placement!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }

            // Handle signup
            async function handleSignup(e) {
                e.preventDefault();
                try {
                    const response = await axios.post(API_BASE + '/auth/register', {
                        username: document.getElementById('signupUsername').value,
                        email: document.getElementById('signupEmail').value,
                        password: document.getElementById('signupPassword').value,
                        display_name: document.getElementById('signupDisplayName').value,
                        language_preference: document.getElementById('signupLanguage').value
                    });
                    
                    localStorage.setItem('auth_token', response.data.token);
                    currentUser = response.data.user;
                    alert('Account created successfully!');
                    location.reload();
                } catch (error) {
                    alert(error.response?.data?.error || 'Signup failed');
                }
            }

            // Logout
            function logout() {
                localStorage.removeItem('auth_token');
                currentUser = null;
                location.reload();
            }

            // View poem (placeholder)
            function viewPoem(id) {
                alert('Poem viewing feature - ID: ' + id + '\\nFull poem detail page will be implemented');
            }

            // Show dashboard (placeholder)
            function showDashboard() {
                alert('Dashboard feature will be implemented with:\\n- My Poems\\n- Create/Edit/Delete\\n- Profile Settings\\n- Subscription Status');
            }

            // Show create poem (placeholder)
            function showCreatePoem() {
                // Check subscription status first
                axios.get(API_BASE + '/poems/user/subscription-status', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('auth_token') }
                })
                .then(res => {
                    const status = res.data;
                    
                    if (!status.can_create_poem) {
                        showUpgradeModal(status);
                        return;
                    }
                    
                    alert('Create Poem feature will be implemented with:\\n- Rich text editor\\n- Language selection\\n- Draft/Publish options\\n\\nCurrent status: ' + status.poems_used + ' poems created' + 
                        (status.subscription_tier === 'free' ? '\\nRemaining: ' + status.poems_remaining + ' poems' : ''));
                })
                .catch(err => {
                    console.error('Error checking subscription:', err);
                    alert('Create Poem feature will be implemented');
                });
            }

            // Show upgrade modal
            function showUpgradeModal(status = null) {
                const modal = document.createElement('div');
                modal.className = 'modal active fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto';
                modal.onclick = (e) => {
                    if (e.target === modal) modal.remove();
                };

                const limitMessage = status ? 
                    '<div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">' +
                        '<div class="flex items-start">' +
                            '<i class="fas fa-exclamation-triangle text-red-500 text-xl mr-3 mt-1"></i>' +
                            '<div>' +
                                '<h4 class="font-bold text-red-800 mb-1">Poem Limit Reached</h4>' +
                                '<p class="text-red-700 text-sm">' +
                                    'You have used all ' + status.poem_limit + ' poem slots on the free plan. ' +
                                    'Upgrade to Premium for unlimited poems!' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                : '';

                modal.innerHTML = \`
                    <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8">
                        <h3 class="text-3xl font-bold text-gray-900 mb-6">
                            <i class="fas fa-crown text-yellow-500 mr-2"></i>Upgrade Your Account
                        </h3>
                        
                        \${limitMessage}

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <!-- Free Plan -->
                            <div class="border-2 border-gray-200 rounded-lg p-6">
                                <h4 class="text-xl font-bold text-gray-900 mb-2">Free Plan</h4>
                                <p class="text-3xl font-bold text-gray-600 mb-1">$0</p>
                                <p class="text-sm text-gray-500 mb-4">Forever</p>
                                <ul class="space-y-2 mb-6">
                                    <li class="text-sm text-gray-700"><i class="fas fa-check text-green-500 mr-2"></i>Up to 10 poems</li>
                                    <li class="text-sm text-gray-700"><i class="fas fa-check text-green-500 mr-2"></i>Basic editor</li>
                                    <li class="text-sm text-gray-700"><i class="fas fa-check text-green-500 mr-2"></i>Community access</li>
                                </ul>
                                <p class="text-xs text-gray-500">Your current plan</p>
                            </div>

                            <!-- Premium Plan -->
                            <div class="border-4 border-blue-500 rounded-lg p-6 relative bg-blue-50">
                                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                                    RECOMMENDED
                                </div>
                                <h4 class="text-xl font-bold text-gray-900 mb-2">Premium Unlimited</h4>
                                <p class="text-3xl font-bold text-blue-600 mb-1">$4.66</p>
                                <p class="text-sm text-gray-600 mb-4">Per Year</p>
                                <ul class="space-y-2 mb-6">
                                    <li class="text-sm text-gray-900"><i class="fas fa-check text-blue-500 mr-2"></i><strong>Unlimited poems</strong></li>
                                    <li class="text-sm text-gray-900"><i class="fas fa-check text-blue-500 mr-2"></i>Advanced editor</li>
                                    <li class="text-sm text-gray-900"><i class="fas fa-check text-blue-500 mr-2"></i>Real-time transliteration</li>
                                    <li class="text-sm text-gray-900"><i class="fas fa-check text-blue-500 mr-2"></i>Priority support</li>
                                    <li class="text-sm text-gray-900"><i class="fas fa-check text-blue-500 mr-2"></i>No ads</li>
                                </ul>
                                <button onclick="initiatePremiumUpgrade()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>

                        <div class="text-center">
                            <p class="text-sm text-gray-600 mb-4">
                                <i class="fas fa-shield-alt mr-1"></i>
                                Secure payment powered by Razorpay
                            </p>
                            <button onclick="this.closest('.modal').remove()" class="text-gray-600 hover:text-gray-900">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                \`;

                document.body.appendChild(modal);
            }

            // Initiate premium upgrade
            async function initiatePremiumUpgrade() {
                try {
                    const response = await axios.post(API_BASE + '/subscriptions/create-checkout', 
                        { plan: 'premium_annual' },
                        { headers: { Authorization: 'Bearer ' + localStorage.getItem('auth_token') } }
                    );
                    
                    // Initialize Razorpay
                    const options = {
                        key: response.data.key_id,
                        amount: response.data.amount,
                        currency: response.data.currency,
                        name: 'कविता व्यासपीठ',
                        description: 'Premium Unlimited - 1 Year',
                        order_id: response.data.order_id,
                        handler: function(razorpayResponse) {
                            // Verify payment
                            verifyPremiumPayment(razorpayResponse, response.data.plan);
                        },
                        prefill: {
                            name: response.data.user.name,
                            email: response.data.user.email
                        },
                        theme: {
                            color: '#3b82f6'
                        }
                    };
                    
                    const razorpay = new Razorpay(options);
                    razorpay.open();
                } catch (error) {
                    console.error('Upgrade error:', error);
                    alert('Failed to initiate upgrade. Please try again.');
                }
            }

            // Verify premium payment
            async function verifyPremiumPayment(razorpayResponse, plan) {
                try {
                    const response = await axios.post(API_BASE + '/subscriptions/verify-payment', {
                        razorpay_order_id: razorpayResponse.razorpay_order_id,
                        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                        razorpay_signature: razorpayResponse.razorpay_signature,
                        plan: plan
                    }, {
                        headers: { Authorization: 'Bearer ' + localStorage.getItem('auth_token') }
                    });
                    
                    alert('🎉 ' + response.data.message + '\\n\\nYou can now create unlimited poems!');
                    location.reload();
                } catch (error) {
                    console.error('Payment verification error:', error);
                    alert('Payment verification failed. Please contact support with your payment ID.');
                }
            }

            // Show explore (placeholder)
            function showExplore() {
                location.reload();
            }

            // Show forgot password
            function showForgotPassword() {
                document.getElementById('app').innerHTML = \`
                    <div class="max-w-4xl mx-auto">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Forgot Password Form -->
                            <div class="bg-white rounded-lg shadow-lg p-8">
                                <h2 class="text-3xl font-bold text-gray-900 mb-6">
                                    <i class="fas fa-key mr-2"></i>Forgot Password
                                </h2>
                                <p class="text-gray-600 mb-6">
                                    Enter your email address and we'll send you instructions to reset your password.
                                </p>
                                <form onsubmit="handleForgotPassword(event)">
                                    <div class="mb-6">
                                        <label class="block text-gray-700 font-semibold mb-2">Email Address</label>
                                        <input type="email" id="forgotEmail" required class="w-full border border-gray-300 rounded px-4 py-2" placeholder="your@email.com">
                                    </div>
                                    <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                                        <i class="fas fa-paper-plane mr-2"></i>Send Reset Link
                                    </button>
                                </form>
                                <div class="mt-6 text-center space-y-2">
                                    <p class="text-gray-600">
                                        Remember your password? <a href="#" onclick="showLogin()" class="text-blue-600 font-semibold">Login</a>
                                    </p>
                                    <p>
                                        <a href="#" onclick="location.reload()" class="text-gray-600 hover:text-gray-900">← Back to Home</a>
                                    </p>
                                </div>
                            </div>

                            <!-- Key Features Panel -->
                            <div class="bg-gradient-to-br from-green-50 to-teal-100 rounded-lg p-8">
                                <h3 class="text-2xl font-bold text-gray-900 mb-6">
                                    <i class="fas fa-magic text-purple-600 mr-2"></i>Our Features
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex items-start">
                                        <div class="text-blue-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-pen-fancy"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Advanced Editor</h4>
                                            <p class="text-sm text-gray-700">Rich formatting, code view, fullscreen mode</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-green-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-keyboard"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Productivity Shortcuts</h4>
                                            <p class="text-sm text-gray-700">Ctrl+G for Google Input, Ctrl+B for bold</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-purple-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-language"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Multilingual Support</h4>
                                            <p class="text-sm text-gray-700">Write in मराठी, हिंदी, or English</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-orange-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-sync-alt"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Smart Transliteration</h4>
                                            <p class="text-sm text-gray-700">Instant English to Devanagari conversion</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-red-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-mobile-alt"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Fully Responsive</h4>
                                            <p class="text-sm text-gray-700">Perfect on mobile, tablet, and desktop</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="text-teal-600 text-xl mr-3 mt-1">
                                            <i class="fas fa-edit"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">Multiple IME Options</h4>
                                            <p class="text-sm text-gray-700">Built-in, Google Input Tools, Pramukh IME</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }

            // Handle forgot password
            async function handleForgotPassword(e) {
                e.preventDefault();
                const email = document.getElementById('forgotEmail').value;
                
                // TODO: Implement password reset API endpoint
                alert('Password reset functionality will be implemented.\\n\\nAn email with reset instructions would be sent to: ' + email);
                showLogin();
            }

            // Show terms
            function showTerms() {
                alert('Terms of Service\\n\\nBy using this platform, you grant us the non-exclusive right to:\\n- Include your poems in paid anthologies\\n- Display your poems on the platform\\n- Promote your work\\n\\nYou retain copyright ownership of your original work.');
            }
        </script>
        <script src="/static/razorpay.js"></script>
        <script src="/static/onboarding-tour.js"></script>
        <script src="/static/help-menu.js"></script>
        <script src="/static/user-menu.js"></script>
    </body>
    </html>
  `);
});

export default app;
