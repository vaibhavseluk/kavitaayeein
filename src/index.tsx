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
                        <span id="authButtons">
                            <a href="#" onclick="showLogin()" class="nav-link text-gray-700"><i class="fas fa-sign-in-alt mr-1"></i> Login</a>
                            <a href="#" onclick="showSignup()" class="nav-link text-blue-600 font-semibold"><i class="fas fa-user-plus mr-1"></i> Sign Up</a>
                        </span>
                        <span id="userMenu" class="hidden">
                            <a href="#" onclick="showSubscriptionPlans()" class="nav-link text-yellow-600 font-semibold"><i class="fas fa-star mr-1"></i> Go Featured</a>
                            <a href="#" onclick="showDashboard()" class="nav-link text-gray-700"><i class="fas fa-tachometer-alt mr-1"></i> Dashboard</a>
                            <a href="#" onclick="logout()" class="nav-link text-red-600"><i class="fas fa-sign-out-alt mr-1"></i> Logout</a>
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
                alert('Create Poem feature will be implemented with:\\n- Rich text editor\\n- Language selection\\n- Draft/Publish options');
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
    </body>
    </html>
  `);
});

export default app;
