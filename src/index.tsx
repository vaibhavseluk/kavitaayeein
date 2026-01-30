import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Env } from './lib/types';

// Import e-commerce routes
import ecommerceAuth from './routes/ecommerce/auth';
import translations from './routes/ecommerce/translations';
import credits from './routes/ecommerce/credits';
import glossary from './routes/ecommerce/glossary';
import ecommerceAdmin from './routes/ecommerce/admin';
import knowledge from './routes/ecommerce/knowledge';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }));

// Mount e-commerce API routes
app.route('/api/auth', ecommerceAuth);
app.route('/api/translations', translations);
app.route('/api/credits', credits);
app.route('/api/glossary', glossary);
app.route('/api/admin', ecommerceAdmin);
app.route('/api/knowledge', knowledge);

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'shabdly-ecommerce-translation',
    timestamp: new Date().toISOString() 
  });
});

// Dashboard page (protected, requires auth)
app.get('/dashboard', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/dashboard.js" defer></script>
    </head>
    <body class="bg-gray-50">
        <div id="dashboard-root"></div>
    </body>
    </html>
  `);
});

// Homepage - Shabdly E-commerce Translation Platform
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shabdly - AI-Powered E-commerce Translation for Indian Languages</title>
        <meta name="description" content="Translate your Amazon/Flipkart product listings into 12+ Indian languages instantly. Reach 60% more customers with AI-powered translation that preserves HTML and protects brand names.">
        <meta name="keywords" content="ecommerce translation, amazon india, flipkart seller, hindi translation, regional language, product listing, indian languages">
        
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-fadeInUp {
                animation: fadeInUp 0.6s ease-out;
            }
            .gradient-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        </style>
    </head>
    <body class="bg-white">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-language text-blue-600 text-2xl"></i>
                        <span class="text-2xl font-bold gradient-text">Shabdly</span>
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="#features" class="text-gray-600 hover:text-blue-600 transition">Features</a>
                        <a href="#pricing" class="text-gray-600 hover:text-blue-600 transition">Pricing</a>
                        <a href="#" onclick="showKnowledgeBase()" class="text-gray-600 hover:text-blue-600 transition">Help</a>
                        <button onclick="showLogin()" class="text-gray-600 hover:text-blue-600 transition">Login</button>
                        <button onclick="showSignup()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center animate-fadeInUp">
                    <h1 class="text-5xl font-extrabold text-gray-900 mb-6">
                        Reach <span class="gradient-text">60% More Indian Customers</span>
                        <br/>With AI-Powered Translation
                    </h1>
                    <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Translate your Amazon, Flipkart & D2C product listings into 12+ Indian languages in minutes. 
                        Preserve HTML formatting, protect brand names, and use regional shopping slang automatically.
                    </p>
                    <div class="flex justify-center space-x-4">
                        <button onclick="showSignup()" class="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                            <i class="fas fa-rocket mr-2"></i> Start Free Trial - 1,000 Words
                        </button>
                        <button onclick="scrollToDemo()" class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition">
                            <i class="fas fa-play mr-2"></i> See Demo
                        </button>
                    </div>
                    <p class="text-sm text-gray-500 mt-4">
                        ✓ No credit card required &nbsp; ✓ 1,000 free words &nbsp; ✓ Cancel anytime
                    </p>
                </div>
            </div>
        </section>

        <!-- Problem/Solution Section -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">
                            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                            The Problem
                        </h2>
                        <ul class="space-y-4 text-lg text-gray-700">
                            <li class="flex items-start">
                                <i class="fas fa-times text-red-500 mr-3 mt-1"></i>
                                <span><strong>60% of Indians don't buy in English</strong> - You're missing huge markets</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-times text-red-500 mr-3 mt-1"></i>
                                <span>Manual translation is <strong>slow and expensive</strong></span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-times text-red-500 mr-3 mt-1"></i>
                                <span>Google Translate <strong>breaks HTML tags</strong> and changes brand names</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">
                            <i class="fas fa-check-circle text-green-500 mr-2"></i>
                            Our Solution
                        </h2>
                        <ul class="space-y-4 text-lg text-gray-700">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                <span><strong>AI-powered translation</strong> in 2 minutes for 500 products</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                <span><strong>Preserves HTML perfectly</strong> - Copy-paste ready for Amazon/Flipkart</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                <span><strong>Regional shopping slang</strong> like "Dhamaka Deal", "Keka Offer"</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Powerful Features Built for Sellers</h2>
                    <p class="text-xl text-gray-600">Everything you need to localize your product listings</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <div class="text-blue-600 text-4xl mb-4">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">HTML Preservation</h3>
                        <p class="text-gray-600">
                            Keep all your formatting! &lt;b&gt;, &lt;li&gt;, &lt;br&gt; tags stay intact. 
                            Perfect for Amazon/Flipkart copy-paste.
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <div class="text-green-600 text-4xl mb-4">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Brand Protection</h3>
                        <p class="text-gray-600">
                            Your brand names, SKUs, and model numbers never get translated. 
                            "SwiftCook" stays "SwiftCook" in all languages.
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <div class="text-purple-600 text-4xl mb-4">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Regional Slang</h3>
                        <p class="text-gray-600">
                            Automatically uses local shopping phrases. "Great Deal" becomes 
                            "Dhamaka Deal" in Hindi, "Keka Offer" in Telugu.
                        </p>
                    </div>

                    <!-- Feature 4 -->
                    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <div class="text-orange-600 text-4xl mb-4">
                            <i class="fas fa-sliders-h"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Tone Presets</h3>
                        <p class="text-gray-600">
                            Choose Formal (luxury), Bargain (deals), or Youth (trendy) tone. 
                            Perfect match for your target audience.
                        </p>
                    </div>

                    <!-- Feature 5 -->
                    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <div class="text-red-600 text-4xl mb-4">
                            <i class="fas fa-file-excel"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Bulk CSV/Excel</h3>
                        <p class="text-gray-600">
                            Upload 500 products at once. Get all translations in one combined 
                            Excel file ready for Amazon Seller Central.
                        </p>
                    </div>

                    <!-- Feature 6 -->
                    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <div class="text-indigo-600 text-4xl mb-4">
                            <i class="fas fa-language"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">12+ Languages</h3>
                        <p class="text-gray-600">
                            Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Malayalam, 
                            Punjabi, Odia, Assamese, Urdu.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section id="pricing" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                    <p class="text-xl text-gray-600">Pay only for what you use. No hidden fees.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <!-- Free Plan -->
                    <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                        <div class="text-4xl font-extrabold text-gray-900 mb-4">$0<span class="text-lg text-gray-500">/mo</span></div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> 1,000 word credits
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> 5 languages
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> CSV upload only
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                            Get Started
                        </button>
                    </div>

                    <!-- Starter Plan -->
                    <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                        <div class="text-4xl font-extrabold text-gray-900 mb-4">$19<span class="text-lg text-gray-500">/mo</span></div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> 10,000 word credits
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> 12 languages
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> CSV/Excel upload
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> Email support
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Start Trial
                        </button>
                    </div>

                    <!-- Growth Plan (Most Popular) -->
                    <div class="bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-blue-600 rounded-xl p-6 text-white transform scale-105 shadow-xl">
                        <div class="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                            MOST POPULAR
                        </div>
                        <h3 class="text-2xl font-bold mb-2">Growth</h3>
                        <div class="text-4xl font-extrabold mb-4">$49<span class="text-lg opacity-90">/mo</span></div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center">
                                <i class="fas fa-check mr-2"></i> 100,000 word credits
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-2"></i> All 12 languages
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-2"></i> Brand glossary
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-2"></i> Priority support
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check mr-2"></i> Tone presets
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Start Trial
                        </button>
                    </div>

                    <!-- Scale Plan -->
                    <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Scale</h3>
                        <div class="text-4xl font-extrabold text-gray-900 mb-4">$149<span class="text-lg text-gray-500">/mo</span></div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> 500,000 word credits
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> Everything in Growth
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> API access
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> 24/7 support
                            </li>
                            <li class="flex items-center text-gray-600">
                                <i class="fas fa-check text-green-500 mr-2"></i> Account manager
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                            Start Trial
                        </button>
                    </div>
                </div>

                <p class="text-center text-gray-500 mt-8">
                    Need more? <a href="#" onclick="contactSales()" class="text-blue-600 hover:underline">Contact us</a> for enterprise pricing
                </p>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
            <div class="max-w-4xl mx-auto text-center px-4">
                <h2 class="text-4xl font-extrabold text-white mb-6">
                    Ready to 3X Your Sales in Regional Markets?
                </h2>
                <p class="text-xl text-blue-100 mb-8">
                    Join hundreds of sellers reaching millions of Indian customers in their native language
                </p>
                <button onclick="showSignup()" class="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-xl">
                    Start Free - Get 1,000 Words
                </button>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4">Shabdly</h3>
                        <p class="text-gray-400 text-sm">
                            AI-powered translation for Indian e-commerce sellers
                        </p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Product</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#features" class="hover:text-white transition">Features</a></li>
                            <li><a href="#pricing" class="hover:text-white transition">Pricing</a></li>
                            <li><a href="#" onclick="showKnowledgeBase()">Documentation</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Company</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#" class="hover:text-white transition">About</a></li>
                            <li><a href="#" class="hover:text-white transition">Contact</a></li>
                            <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Support</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#" onclick="showKnowledgeBase()" class="hover:text-white transition">Help Center</a></li>
                            <li><a href="mailto:vaibhavseluk@gmail.com" class="hover:text-white transition">Email Support</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2026 Shabdly. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <!-- Login Modal (placeholder - will be built in dashboard.js) -->
        <div id="loginModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 class="text-2xl font-bold mb-4">Login</h2>
                <p class="text-gray-600">Login functionality coming soon...</p>
                <button onclick="document.getElementById('loginModal').classList.add('hidden')" class="mt-4 bg-gray-200 px-4 py-2 rounded">Close</button>
            </div>
        </div>

        <script>
            function showLogin() {
                document.getElementById('loginModal').classList.remove('hidden');
            }
            
            function showSignup() {
                alert('Signup functionality will be implemented in dashboard.js');
            }
            
            function showKnowledgeBase() {
                alert('Knowledge base will be implemented');
            }
            
            function scrollToDemo() {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }
            
            function contactSales() {
                window.location.href = 'mailto:vaibhavseluk@gmail.com?subject=Enterprise Pricing Inquiry';
            }
        </script>
    </body>
    </html>
  `);
});

export default app;
