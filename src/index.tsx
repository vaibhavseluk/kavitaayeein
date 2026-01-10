import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Env } from './lib/types';
import { verifyToken, extractToken } from './lib/auth';
import { getTranslation, type Language } from './lib/i18n';

// Import routes
import auth from './routes/auth';
import poems from './routes/poems';
import admin from './routes/admin';
import reports from './routes/reports';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }));

// Authentication middleware for protected routes
app.use('/api/poems/user/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  c.set('userId', payload.userId);
  c.set('userRole', payload.role);
  await next();
});

// Authentication middleware for poem CRUD operations
app.use('/api/poems/:id', async (c, next) => {
  const method = c.req.method;
  
  // Only protect PUT, DELETE, POST (like, rate)
  if (['PUT', 'DELETE', 'POST'].includes(method)) {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    c.set('userId', payload.userId);
    c.set('userRole', payload.role);
  }
  
  await next();
});

// Authentication middleware for creating poems
app.use('/api/poems', async (c, next) => {
  const method = c.req.method;
  
  // Only protect POST (create)
  if (method === 'POST') {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    c.set('userId', payload.userId);
    c.set('userRole', payload.role);
  }
  
  await next();
});

// Authentication middleware for auth/me and profile
app.use('/api/auth/me', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  c.set('userId', payload.userId);
  c.set('userRole', payload.role);
  await next();
});

app.use('/api/auth/profile', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  c.set('userId', payload.userId);
  c.set('userRole', payload.role);
  await next();
});

// Authentication middleware for admin routes
app.use('/api/admin/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  c.set('userId', payload.userId);
  c.set('userRole', payload.role);
  await next();
});

// API routes
app.route('/api/auth', auth);
app.route('/api/poems', poems);
app.route('/api/admin', admin);
app.route('/api/reports', reports);

// Terms of Service page
app.get('/terms', (c) => {
  const lang = (c.req.query('lang') || 'en') as Language;
  const t = (key: string) => getTranslation(lang, key);

  return c.html(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t('terms')} - ${t('siteName')}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto p-6">
            <div class="bg-white rounded-lg shadow-md p-8">
                <h1 class="text-3xl font-bold mb-6">${t('terms')}</h1>
                
                <div class="prose max-w-none space-y-6">
                    <section>
                        <h2 class="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                        <p>By registering and using this poetry platform, you agree to these Terms of Service.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold mb-3">2. Content Rights & Anthology License</h2>
                        <p class="font-semibold text-red-600">${t('anthologyRights')}</p>
                        <p class="mt-4"><strong>What this means:</strong></p>
                        <ul class="list-disc ml-6 mt-2 space-y-2">
                            <li>You retain full ownership and copyright of your poems</li>
                            <li>You grant us a <strong>non-exclusive license</strong> to include your poems in our paid anthologies</li>
                            <li>We may compile top-rated poems quarterly into "Best of [Month]" anthologies</li>
                            <li>These anthologies will be sold on platforms like Amazon KDP</li>
                            <li>You can still publish your poems elsewhere, submit to other anthologies, or use them freely</li>
                            <li>Poems marked as "anthology_eligible" in your profile will be considered for selection</li>
                            <li>You can opt-out by contacting us to mark specific poems as ineligible</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold mb-3">3. User Conduct</h2>
                        <ul class="list-disc ml-6 space-y-2">
                            <li>No spam, adult content, hate speech, or copyright infringement</li>
                            <li>Respect other poets and their work</li>
                            <li>Provide accurate information during registration</li>
                            <li>Do not create multiple accounts to manipulate ratings</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold mb-3">4. Moderation</h2>
                        <p>We reserve the right to:</p>
                        <ul class="list-disc ml-6 mt-2 space-y-2">
                            <li>Remove content that violates these terms</li>
                            <li>Ban users who repeatedly violate guidelines</li>
                            <li>Flag poems for review based on community reports</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold mb-3">5. Featured Poet Subscription</h2>
                        <ul class="list-disc ml-6 space-y-2">
                            <li>Subscription provides homepage visibility and search highlighting</li>
                            <li>Billing is monthly via Stripe/Razorpay</li>
                            <li>Cancel anytime from your dashboard</li>
                            <li>No refunds for partial months</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold mb-3">6. Privacy</h2>
                        <p>We collect minimal data: username, email, and poems you publish. We do not sell your data to third parties.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold mb-3">7. Changes to Terms</h2>
                        <p>We may update these terms. Continued use after updates constitutes acceptance.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold mb-3">8. Contact</h2>
                        <p>Questions about these terms? Contact us at: <strong>support@poetryplatform.com</strong></p>
                    </section>

                    <div class="mt-8 pt-6 border-t">
                        <p class="text-sm text-gray-600">Last Updated: January 10, 2026</p>
                        <p class="text-sm text-gray-600 mt-2">Version: 1.0</p>
                    </div>
                </div>

                <div class="mt-8">
                    <a href="/" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Home page with language selector and authentication
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Poetry Platform - Multilingual Poetry Community</title>
        <meta name="description" content="Share your poetry in Marathi, Hindi, and English. Join our community of poets worldwide.">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
            }
            .poem-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            }
            .poem-card {
                transition: all 0.3s ease;
            }
            .modal {
                display: none;
            }
            .modal.active {
                display: flex;
            }
        </style>
    </head>
    <body class="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        <!-- Navigation -->
        <nav class="bg-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-purple-600 text-2xl"></i>
                        <h1 class="text-2xl font-bold text-gray-800">
                            <span id="site-name">Poetry Platform</span>
                        </h1>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <!-- Language Selector -->
                        <select id="language-selector" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="mr">मराठी</option>
                        </select>

                        <!-- Auth Buttons -->
                        <div id="auth-buttons">
                            <button onclick="showLoginModal()" class="px-4 py-2 text-purple-600 hover:text-purple-800 font-semibold">
                                <i class="fas fa-sign-in-alt mr-2"></i><span data-i18n="login">Login</span>
                            </button>
                            <button onclick="showRegisterModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                                <i class="fas fa-user-plus mr-2"></i><span data-i18n="register">Register</span>
                            </button>
                        </div>

                        <!-- User Menu (hidden by default) -->
                        <div id="user-menu" class="hidden space-x-4">
                            <button onclick="showCreatePoemModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                                <i class="fas fa-pen mr-2"></i><span data-i18n="createPoem">Create Poem</span>
                            </button>
                            <button onclick="loadMyPoems()" class="px-4 py-2 text-purple-600 hover:text-purple-800 font-semibold">
                                <i class="fas fa-book mr-2"></i><span data-i18n="myPoems">My Poems</span>
                            </button>
                            <button id="admin-btn" class="hidden px-4 py-2 text-red-600 hover:text-red-800 font-semibold" onclick="loadAdminDashboard()">
                                <i class="fas fa-shield-alt mr-2"></i><span data-i18n="admin">Admin</span>
                            </button>
                            <button onclick="logout()" class="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold">
                                <i class="fas fa-sign-out-alt mr-2"></i><span data-i18n="logout">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-800 mb-4" data-i18n="tagline">
                    Share Your Poetry with the World
                </h2>
                <p class="text-lg text-gray-600">
                    Express yourself in Marathi (मराठी), Hindi (हिंदी), or English
                </p>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <div class="flex flex-wrap gap-4 items-center justify-between">
                    <div class="flex gap-4 items-center">
                        <label class="font-semibold text-gray-700" data-i18n="filterByLanguage">Filter by Language:</label>
                        <select id="filter-language" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option value="">All Languages</option>
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="mr">मराठी (Marathi)</option>
                        </select>
                    </div>

                    <div class="flex gap-4 items-center">
                        <label class="font-semibold text-gray-700" data-i18n="sortBy">Sort By:</label>
                        <select id="sort-by" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option value="newest" data-i18n="newest">Newest</option>
                            <option value="popular" data-i18n="popular">Most Popular</option>
                            <option value="top_rated" data-i18n="topRated">Top Rated</option>
                        </select>
                        
                        <label class="flex items-center">
                            <input type="checkbox" id="filter-featured" class="mr-2 w-5 h-5">
                            <span class="font-semibold text-gray-700" data-i18n="featuredPoems">Featured Only</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Poems Grid -->
            <div id="poems-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Poems will be loaded here -->
            </div>

            <!-- Loading Spinner -->
            <div id="loading" class="text-center py-12 hidden">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                <p class="mt-4 text-gray-600">Loading poems...</p>
            </div>
        </div>

        <!-- Login Modal -->
        <div id="login-modal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold mb-6" data-i18n="login">Login</h3>
                <form id="login-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="username">Username</label>
                        <input type="text" name="username" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="password">Password</label>
                        <input type="password" name="password" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div id="login-error" class="text-red-600 hidden"></div>
                    <button type="submit" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                        <span data-i18n="login">Login</span>
                    </button>
                    <button type="button" onclick="closeModal('login-modal')" class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                </form>
            </div>
        </div>

        <!-- Register Modal -->
        <div id="register-modal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold mb-6" data-i18n="register">Register</h3>
                <form id="register-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="username">Username</label>
                        <input type="text" name="username" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="email">Email</label>
                        <input type="email" name="email" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="password">Password</label>
                        <input type="password" name="password" required minlength="6" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="displayName">Display Name</label>
                        <input type="text" name="display_name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" required class="w-5 h-5">
                            <span class="text-sm">
                                <span data-i18n="acceptTerms">I accept the</span> 
                                <a href="/terms" target="_blank" class="text-purple-600 hover:underline" data-i18n="terms">Terms of Service</a>
                            </span>
                        </label>
                    </div>
                    <div id="register-error" class="text-red-600 hidden"></div>
                    <button type="submit" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                        <span data-i18n="register">Register</span>
                    </button>
                    <button type="button" onclick="closeModal('register-modal')" class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                </form>
            </div>
        </div>

        <!-- Create Poem Modal -->
        <div id="create-poem-modal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 overflow-y-auto">
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
                <h3 class="text-2xl font-bold mb-6" data-i18n="createPoem">Create Poem</h3>
                <form id="create-poem-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="title">Title</label>
                        <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="language">Language</label>
                        <select name="language" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="mr">मराठी (Marathi)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" data-i18n="content">Content</label>
                        <textarea name="content" required rows="10" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"></textarea>
                    </div>
                    <div id="create-poem-error" class="text-red-600 hidden"></div>
                    <div class="flex gap-4">
                        <button type="submit" name="status" value="published" class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                            <i class="fas fa-paper-plane mr-2"></i><span data-i18n="publish">Publish</span>
                        </button>
                        <button type="submit" name="status" value="draft" class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold">
                            <i class="fas fa-save mr-2"></i><span data-i18n="saveDraft">Save as Draft</span>
                        </button>
                        <button type="button" onclick="closeModal('create-poem-modal')" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

export default app;
