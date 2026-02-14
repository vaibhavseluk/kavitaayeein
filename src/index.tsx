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
import refunds from './routes/ecommerce/refunds';
import pages from './routes/ecommerce/pages';

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
app.route('/api/refunds', refunds);

// Mount pages routes
app.route('/', pages);

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

// Homepage - Shabdly Platform Hub (presents both platforms)
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shabdly - AI-Powered Solutions for Growth & Translation</title>
        <meta name="description" content="Shabdly offers two powerful platforms: E-commerce translation for 12+ Indian languages and HeyShabdly for career guidance and peer support. Choose your path to growth.">
        <meta name="keywords" content="shabdly, ecommerce translation, career guidance, heyshabdly, indian languages, peer support">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://shabdly.online/">
        <meta property="og:title" content="Shabdly - AI-Powered Solutions for Growth & Translation">
        <meta property="og:description" content="Choose your platform: E-commerce Translation for sellers or HeyShabdly for career guidance and support.">
        <meta property="og:image" content="https://shabdly.online/static/shabdly-logo.png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:site_name" content="Shabdly">
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Shabdly - AI-Powered Solutions for Growth">
        <meta name="twitter:description" content="E-commerce Translation or Career Guidance - Choose your platform">
        <meta name="twitter:image" content="https://shabdly.online/static/shabdly-logo.png">
        
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        
        <style>
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
            .gradient-bg {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .card-hover {
                transition: all 0.3s ease;
            }
            .card-hover:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <a href="/" class="flex items-center hover:opacity-80 transition">
                        <img src="/static/shabdly-logo.png" alt="Shabdly.online Logo" style="height: 40px; width: auto; max-width: 200px;">
                    </a>
                    <div class="flex items-center space-x-6">
                        <a href="#platforms" class="text-gray-600 hover:text-blue-600 transition">Platforms</a>
                        <a href="#about" class="text-gray-600 hover:text-blue-600 transition">About</a>
                        <a href="/contact" class="text-gray-600 hover:text-blue-600 transition">Contact</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="gradient-bg py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white animate-fadeInUp">
                <h1 class="text-5xl font-extrabold mb-6">
                    Welcome to Shabdly
                </h1>
                <p class="text-2xl mb-4 opacity-90">
                    Powered by "Shabd" (Word) - We help you grow through language
                </p>
                <p class="text-xl opacity-80 max-w-3xl mx-auto">
                    Choose your platform below to start your journey
                </p>
            </div>
        </section>

        <!-- Platforms Section -->
        <section id="platforms" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Our Platforms</h2>
                    <p class="text-xl text-gray-600">Two powerful solutions for different needs</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- E-commerce Translation Platform -->
                    <div class="card-hover bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
                        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                            <div class="flex items-center mb-4">
                                <i class="fas fa-language text-4xl mr-4"></i>
                                <h3 class="text-3xl font-bold">Shabdly Translate</h3>
                            </div>
                            <p class="text-lg opacity-90">For E-commerce Sellers</p>
                        </div>
                        
                        <div class="p-8">
                            <p class="text-gray-700 mb-6 text-lg">
                                Translate your Amazon, Flipkart & D2C product listings into 12+ Indian languages instantly.
                            </p>
                            
                            <ul class="space-y-3 mb-8">
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Reach 60% more Indian customers</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Preserve HTML & protect brand names</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Regional shopping slang included</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Start free with 1,000 words</span>
                                </li>
                            </ul>
                            
                            <div class="space-y-3">
                                <a href="/translate" class="block w-full bg-blue-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                                    <i class="fas fa-rocket mr-2"></i> Start Translation
                                </a>
                                <a href="/translate#features" class="block w-full border-2 border-blue-600 text-blue-600 text-center py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- HeyShabdly Career Guidance Platform -->
                    <div class="card-hover bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
                        <div class="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
                            <div class="flex items-center mb-4">
                                <i class="fas fa-users text-4xl mr-4"></i>
                                <h3 class="text-3xl font-bold">HeyShabdly</h3>
                            </div>
                            <p class="text-lg opacity-90">For Career Growth & Support</p>
                        </div>
                        
                        <div class="p-8">
                            <p class="text-gray-700 mb-6 text-lg">
                                Community-driven platform for peer-to-peer career guidance and emotional support.
                            </p>
                            
                            <ul class="space-y-3 mb-8">
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Connect with career mentors</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Get guidance without formality</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Emotional support network</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 mt-1"></i>
                                    <span>Free peer-to-peer help</span>
                                </li>
                            </ul>
                            
                            <div class="space-y-3">
                                <a href="https://hey.shabdly.online" class="block w-full bg-orange-500 text-white text-center py-4 rounded-lg font-semibold hover:bg-orange-600 transition shadow-lg">
                                    <i class="fas fa-comments mr-2"></i> Join Community
                                </a>
                                <button onclick="alert('HeyShabdly launching soon! Stay tuned.')" class="w-full border-2 border-orange-500 text-orange-500 text-center py-4 rounded-lg font-semibold hover:bg-orange-50 transition">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-20 bg-gray-50">
            <div class="max-w-4xl mx-auto px-4 text-center">
                <h2 class="text-4xl font-extrabold text-gray-900 mb-6">About Shabdly</h2>
                <p class="text-xl text-gray-700 mb-8">
                    Derived from <strong>"Shabd"</strong> (Sanskrit for "Word"), Shabdly is where your voice finds growth. 
                    We believe in the power of language - whether it's translating products to reach new markets 
                    or connecting people for career guidance and support.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-bold text-gray-900 mb-3">
                            <i class="fas fa-bullseye text-blue-600 mr-2"></i>
                            Our Mission
                        </h3>
                        <p class="text-gray-700">
                            To break language barriers in business and personal growth, making opportunities 
                            accessible to everyone through the power of "Shabd" (Word).
                        </p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-bold text-gray-900 mb-3">
                            <i class="fas fa-heart text-red-500 mr-2"></i>
                            Our Values
                        </h3>
                        <p class="text-gray-700">
                            Accessibility, community-driven growth, and empowering individuals to reach their 
                            full potential through better communication.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <img src="/static/shabdly-logo.png" alt="Shabdly Logo" style="height: 40px; filter: brightness(0) invert(1);" class="mb-4">
                        <p class="text-gray-400 text-sm">
                            Powered by "Shabd" - Where your voice finds growth
                        </p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Platforms</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="/translate" class="hover:text-white transition">Shabdly Translate</a></li>
                            <li><a href="https://hey.shabdly.online" class="hover:text-white transition">HeyShabdly</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Company</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="/about" class="hover:text-white transition">About</a></li>
                            <li><a href="/contact" class="hover:text-white transition">Contact</a></li>
                            <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Support</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="/help" class="hover:text-white transition">Help Center</a></li>
                            <li><a href="/documentation" class="hover:text-white transition">Documentation</a></li>
                            <li><a href="mailto:heyshabdly@gmail.com" class="hover:text-white transition">Email Support</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2026 Shabdly.online. All rights reserved. | Nagpur, Maharashtra, India</p>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// E-commerce Translation Platform Page
app.get('/translate', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shabdly - AI-Powered E-commerce Translation for Indian Languages</title>
        <meta name="description" content="Translate your Amazon/Flipkart product listings into 12+ Indian languages instantly. Reach 60% more customers with AI-powered translation that preserves HTML and protects brand names.">
        <meta name="keywords" content="ecommerce translation, amazon india, flipkart seller, hindi translation, regional language, product listing, indian languages">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://shabdly.online/">
        <meta property="og:title" content="Shabdly - AI-Powered E-commerce Translation for Indian Languages">
        <meta property="og:description" content="Translate your Amazon/Flipkart product listings into 12+ Indian languages. Reach 60% more customers with AI-powered translation. Start free with 1,000 words.">
        <meta property="og:image" content="https://shabdly.online/static/shabdly-logo.png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:site_name" content="Shabdly">
        <meta property="og:locale" content="en_US">
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="https://shabdly.online/">
        <meta name="twitter:title" content="Shabdly - AI-Powered E-commerce Translation for Indian Languages">
        <meta name="twitter:description" content="Translate your Amazon/Flipkart product listings into 12+ Indian languages. Reach 60% more customers with AI. Start free with 1,000 words.">
        <meta name="twitter:image" content="https://shabdly.online/static/shabdly-logo.png">
        
        <!-- Additional SEO -->
        <meta name="author" content="Shabdly">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="https://shabdly.online/">
        
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/dashboard.js" defer></script>
        
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
                    <a href="/" class="flex items-center hover:opacity-80 transition" title="Go to Home">
                        <img src="/static/shabdly-logo.png" alt="Shabdly.online Logo" style="height: 40px; width: auto; max-width: 200px;" onerror="this.style.display='none'">
                    </a>
                    <div class="flex items-center space-x-6">
                        <a href="#features" class="text-gray-600 hover:text-blue-600 transition">Features</a>
                        <a href="#pricing" class="text-gray-600 hover:text-blue-600 transition">Pricing</a>
                        <a href="/help" class="text-gray-600 hover:text-blue-600 transition">Help</a>
                        <a href="/documentation" class="text-gray-600 hover:text-blue-600 transition">Documentation</a>
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
                            <i class="fas fa-play mr-2"></i> Watch Demo
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
                            Powered by "Shabd" - AI solutions for growth & translation
                        </p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Platforms</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="/translate" class="hover:text-white transition">Shabdly Translate</a></li>
                            <li><a href="https://hey.shabdly.online" class="hover:text-white transition">HeyShabdly <span class="text-xs bg-orange-500 px-2 py-1 rounded">New</span></a></li>
                            <li><a href="#features" class="hover:text-white transition">Features</a></li>
                            <li><a href="#pricing" class="hover:text-white transition">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Company</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="/about" class="hover:text-white transition">About</a></li>
                            <li><a href="/contact" class="hover:text-white transition">Contact</a></li>
                            <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="/documentation" class="hover:text-white transition">Documentation</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Support</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="/help" class="hover:text-white transition">Help Center</a></li>
                            <li><a href="/faq" class="hover:text-white transition">FAQ</a></li>
                            <li><a href="mailto:heyshabdly@gmail.com" class="hover:text-white transition">Email Support</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2026 Shabdly.online. All rights reserved. | Nagpur, Maharashtra, India</p>
                </div>
            </div>
        </footer>
        
        <script>
            // Scroll to demo section
            function scrollToDemo() {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }
            
            // Contact sales via email
            function contactSales() {
                window.location.href = 'mailto:heyshabdly@gmail.com?subject=Enterprise Pricing Inquiry';
            }
        </script>
    </body>
    </html>
  `);
});

// ============================================
// STATIC PAGES
// ============================================

// About Page
app.get('/about', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>About - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-language text-blue-600 text-2xl"></i>
                        <span class="text-2xl font-bold text-gray-900">Shabdly</span>
                    </div>
                    <a href="/" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">About Shabdly</h1>
            
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div class="prose prose-lg max-w-none">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p class="text-gray-700 mb-6">
                        <strong>Shabdly.online</strong> is on a mission to break the language barrier in Indian e-commerce. 
                        We empower D2C brands and marketplace sellers to "speak Bharat" by instantly localizing product 
                        listings into high-conversion regional languages.
                    </p>
                    
                    <p class="text-gray-700 mb-6">
                        By combining advanced AI models with deep cultural context, we help you turn "English-only" 
                        listings into "Paisa-Vasool" regional success stories, driving trust and conversion in 
                        Tier 2 and Tier 3 cities across India.
                    </p>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Problem We Solve</h2>
                    <p class="text-gray-700 mb-4">
                        <strong>60% of Indians don't shop in English.</strong> Millions of potential customers in regional 
                        markets struggle to understand product listings, leading to:
                    </p>
                    <ul class="list-disc pl-6 text-gray-700 mb-6">
                        <li>Lower conversion rates in Tier 2 and Tier 3 cities</li>
                        <li>Missed sales opportunities from non-English speaking customers</li>
                        <li>Higher return rates due to product misunderstandings</li>
                        <li>Negative reviews from confused customers</li>
                    </ul>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Solution</h2>
                    <p class="text-gray-700 mb-4">
                        Shabdly provides AI-powered translation that's specifically tuned for Indian e-commerce:
                    </p>
                    <ul class="list-disc pl-6 text-gray-700 mb-6">
                        <li><strong>12+ Indian Languages:</strong> Hindi, Tamil, Telugu, Kannada, Bengali, Malayalam, Marathi, and more</li>
                        <li><strong>E-commerce Optimized:</strong> Not just word-for-word translation, but context-aware conversions</li>
                        <li><strong>Regional Slang:</strong> "Dhamaka Offer", "Paisa Vasool", "Keka Deal" - speak like locals do</li>
                        <li><strong>HTML Preservation:</strong> Your formatting stays intact for Amazon/Flipkart upload</li>
                        <li><strong>Brand Protection:</strong> Lock brand names and SKUs from translation</li>
                    </ul>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Choose Shabdly?</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h3 class="font-bold text-gray-900 mb-2">⚡ Lightning Fast</h3>
                            <p class="text-sm text-gray-700">Translate 500 products in 2 minutes. No more waiting weeks for manual translations.</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h3 class="font-bold text-gray-900 mb-2">💰 Cost Effective</h3>
                            <p class="text-sm text-gray-700">10x cheaper than hiring translators. Start free with 1,000 words.</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h3 class="font-bold text-gray-900 mb-2">🎯 Marketplace Ready</h3>
                            <p class="text-sm text-gray-700">Copy-paste directly to Amazon, Flipkart, Meesho. HTML preserved perfectly.</p>
                        </div>
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <h3 class="font-bold text-gray-900 mb-2">📈 Proven Results</h3>
                            <p class="text-sm text-gray-700">Customers see 30-60% increase in regional sales within 30 days.</p>
                        </div>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Values</h2>
                    <ul class="list-disc pl-6 text-gray-700 mb-6">
                        <li><strong>Quality First:</strong> We continuously improve our AI models for better translations</li>
                        <li><strong>Customer Success:</strong> Your growth is our success metric</li>
                        <li><strong>Transparency:</strong> Clear pricing, no hidden fees, honest limitations</li>
                        <li><strong>Self-Service:</strong> Low-touch platform to keep your costs down</li>
                    </ul>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Join the Regional Revolution</h2>
                    <p class="text-gray-700 mb-6">
                        Hundreds of sellers are already reaching millions of Indian customers in their native languages. 
                        Whether you're a solo seller on Amazon, a D2C brand, or a marketplace agency, Shabdly helps you 
                        unlock the true potential of Bharat.
                    </p>
                    
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Ready to 3X Your Sales?</h3>
                        <p class="text-gray-700 mb-4">Start free with 1,000 words. No credit card required.</p>
                        <a href="/dashboard" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Get Started Free
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2026 Shabdly.online. All rights reserved.</p>
                <div class="mt-4 space-x-6">
                    <a href="/terms" class="text-gray-400 hover:text-white">Terms</a>
                    <a href="/privacy" class="text-gray-400 hover:text-white">Privacy</a>
                    <a href="/contact" class="text-gray-400 hover:text-white">Contact</a>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// FAQ Page
app.get('/faq', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FAQ - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-language text-blue-600 text-2xl"></i>
                        <span class="text-2xl font-bold text-gray-900">Shabdly</span>
                    </div>
                    <a href="/" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p class="text-gray-600 mb-8">Find answers to common questions about Shabdly</p>
            
            <div class="space-y-4">
                <!-- FAQ Item 1 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-globe text-blue-600 mr-2"></i>
                                What languages do you support?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700">
                            We support 12+ Indian languages including <strong>Hindi, Tamil, Telugu, Kannada, Bengali, Malayalam, 
                            Marathi, Gujarati, Punjabi, Odia, Assamese,</strong> and <strong>Urdu</strong>. We continuously add 
                            more languages based on customer demand.
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 2 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-brain text-purple-600 mr-2"></i>
                                Does the AI understand e-commerce slang?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            Yes! Our AI models are specifically tuned for shopping context, not just literal translation. 
                            We understand and use regional e-commerce phrases like:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700">
                            <li><strong>Hindi:</strong> "धमाका ऑफर" (Dhamaka Offer), "पैसा वसूल" (Paisa Vasool)</li>
                            <li><strong>Tamil:</strong> "கெகா offer" (Keka Offer), "சூப்பர் quality"</li>
                            <li><strong>Telugu:</strong> "బాగా offer", "మంచి product"</li>
                        </ul>
                        <p class="text-gray-700 mt-2">
                            This makes your listings sound native and trustworthy to regional customers.
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 3 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-file-csv text-green-600 mr-2"></i>
                                Can I translate my entire Amazon/Flipkart catalog?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            <strong>Absolutely!</strong> We support bulk CSV/Excel upload for massive catalogs:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li><strong>Free Plan:</strong> Up to 100 products per upload</li>
                            <li><strong>Starter Plan:</strong> Up to 500 products per upload</li>
                            <li><strong>Growth Plan:</strong> Up to 2,000 products per upload</li>
                            <li><strong>Scale Plan:</strong> Up to 10,000 products per upload + API access</li>
                        </ul>
                        <p class="text-gray-700">
                            Simply export your product listings from Amazon Seller Central or Flipkart, upload to Shabdly, 
                            and get translated files ready to re-upload in minutes!
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 4 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-credit-card text-orange-600 mr-2"></i>
                                How do I pay?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            We accept multiple payment methods through secure processors:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li><strong>Credit/Debit Cards:</strong> Visa, Mastercard, American Express, RuPay</li>
                            <li><strong>UPI:</strong> Google Pay, PhonePe, Paytm, BHIM</li>
                            <li><strong>Net Banking:</strong> All major Indian banks</li>
                            <li><strong>International Cards:</strong> Supported via Stripe</li>
                        </ul>
                        <p class="text-gray-700">
                            Payments are processed securely by <strong>Stripe</strong> and <strong>Razorpay</strong>. 
                            We never store your card details on our servers.
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 5 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-shield-alt text-red-600 mr-2"></i>
                                Will my brand name get translated?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            <strong>No!</strong> Use our <strong>Brand Glossary</strong> feature to lock terms from translation:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li>Brand names (e.g., "SwiftCook" stays "SwiftCook")</li>
                            <li>Model numbers (e.g., "X-500" stays "X-500")</li>
                            <li>SKUs and product codes</li>
                            <li>Technical certifications (e.g., "BIS Certified")</li>
                        </ul>
                        <p class="text-gray-700">
                            Simply add terms to your glossary before translation, and they'll remain unchanged across all languages.
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 6 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-code text-indigo-600 mr-2"></i>
                                What about HTML tags in my product descriptions?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            <strong>HTML tags are preserved perfectly!</strong> We support:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li><code>&lt;b&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;i&gt;</code>, <code>&lt;em&gt;</code> - Text formatting</li>
                            <li><code>&lt;br&gt;</code>, <code>&lt;p&gt;</code> - Line breaks and paragraphs</li>
                            <li><code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code> - Lists</li>
                            <li><code>&lt;div&gt;</code>, <code>&lt;span&gt;</code> - Containers</li>
                        </ul>
                        <p class="text-gray-700">
                            Your translations will be <strong>copy-paste ready</strong> for Amazon and Flipkart bulk upload!
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 7 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-clock text-teal-600 mr-2"></i>
                                How long does translation take?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            Translation is lightning fast:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li><strong>100 products:</strong> ~30 seconds</li>
                            <li><strong>500 products:</strong> ~2 minutes</li>
                            <li><strong>1,000 products:</strong> ~5 minutes</li>
                            <li><strong>5,000 products:</strong> ~30 minutes</li>
                        </ul>
                        <p class="text-gray-700">
                            Progress updates every 30 seconds, and you can download results immediately after completion.
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 8 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-undo text-yellow-600 mr-2"></i>
                                What if translations are incorrect?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            <strong>Technical errors only:</strong> If a system error results in garbled, corrupted, or failed 
                            translations, we'll credit the affected words back to your account within 48 hours.
                        </p>
                        <p class="text-gray-700 mb-2">
                            <strong>Translation quality:</strong> Our AI provides high-quality translations, but we recommend:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li>Having a native speaker review translations for critical products</li>
                            <li>Starting with a small batch (100 products) to test quality</li>
                            <li>Using the "Formal" tone for luxury products</li>
                            <li>Using the "Bargain" tone for deals and discounts</li>
                        </ul>
                        <p class="text-gray-700">
                            See our <a href="/refund-policy" class="text-blue-600 hover:underline">Refund Policy</a> for details.
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 9 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-ban text-red-600 mr-2"></i>
                                Can I cancel my subscription?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            <strong>Yes, anytime!</strong> Cancel your subscription from your dashboard settings:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li>No cancellation fees or penalties</li>
                            <li>Access continues until end of billing cycle</li>
                            <li>Remaining word credits expire at cycle end</li>
                            <li>No refunds for partial months</li>
                        </ul>
                        <p class="text-gray-700">
                            You can reactivate your subscription anytime and start right where you left off!
                        </p>
                    </div>
                </div>

                <!-- FAQ Item 10 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <button class="w-full text-left p-6 hover:bg-gray-50 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">
                                <i class="fas fa-chart-line text-green-600 mr-2"></i>
                                Will this really increase my sales?
                            </h3>
                            <i class="fas fa-chevron-down text-gray-400"></i>
                        </div>
                    </button>
                    <div class="hidden px-6 pb-6">
                        <p class="text-gray-700 mb-2">
                            <strong>Our customers see 30-60% increase in regional sales within 30 days.</strong> Here's why:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 mb-2">
                            <li>60% of Indian shoppers prefer regional languages over English</li>
                            <li>Regional listings get 3x higher click-through rates</li>
                            <li>Lower return rates due to better product understanding</li>
                            <li>Higher customer trust and positive reviews</li>
                        </ul>
                        <p class="text-gray-700">
                            Start with Hindi (largest market) for your top 50 products and track the results. 
                            Most sellers see ROI within 2-3 weeks!
                        </p>
                    </div>
                </div>
            </div>

            <!-- Still have questions? -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mt-12 text-center">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
                <p class="text-gray-700 mb-6">
                    Check our comprehensive <a href="/help" class="text-blue-600 hover:underline font-semibold">Help Center</a> 
                    or <a href="/contact" class="text-blue-600 hover:underline font-semibold">contact us</a> directly.
                </p>
                <a href="/dashboard" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Start Free Trial - 1,000 Words
                </a>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2026 Shabdly.online. All rights reserved.</p>
                <div class="mt-4 space-x-6">
                    <a href="/terms" class="text-gray-400 hover:text-white">Terms</a>
                    <a href="/privacy" class="text-gray-400 hover:text-white">Privacy</a>
                    <a href="/contact" class="text-gray-400 hover:text-white">Contact</a>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// Contact Page
app.get('/contact', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-language text-blue-600 text-2xl"></i>
                        <span class="text-2xl font-bold text-gray-900">Shabdly</span>
                    </div>
                    <a href="/" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
            
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div class="prose prose-lg max-w-none">
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                        <p class="text-gray-800 font-semibold">
                            We value your time and operate a self-service model to keep your costs low.
                        </p>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-envelope text-blue-600 text-2xl mr-3"></i>
                                <h3 class="text-lg font-bold text-gray-900">General Inquiries</h3>
                            </div>
                            <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:text-blue-700 font-semibold">
                                heyshabdly@gmail.com
                            </a>
                            <p class="text-sm text-gray-600 mt-2">For questions about our service, features, or pricing</p>
                        </div>
                        
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-handshake text-purple-600 text-2xl mr-3"></i>
                                <h3 class="text-lg font-bold text-gray-900">Partnerships</h3>
                            </div>
                            <a href="mailto:heyshabdly@gmail.com" class="text-purple-600 hover:text-purple-700 font-semibold">
                                heyshabdly@gmail.com
                            </a>
                            <p class="text-sm text-gray-600 mt-2">For agencies, resellers, and business partnerships</p>
                        </div>
                        
                        <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-headset text-green-600 text-2xl mr-3"></i>
                                <h3 class="text-lg font-bold text-gray-900">Technical Support</h3>
                            </div>
                            <a href="mailto:heyshabdly@gmail.com" class="text-green-600 hover:text-green-700 font-semibold">
                                heyshabdly@gmail.com
                            </a>
                            <p class="text-sm text-gray-600 mt-2">For account issues or technical bugs (2-3 business day response)</p>
                        </div>
                        
                        <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-map-marker-alt text-orange-600 text-2xl mr-3"></i>
                                <h3 class="text-lg font-bold text-gray-900">Registered Office</h3>
                            </div>
                            <p class="text-gray-800 font-semibold">Nagpur, India</p>
                            <p class="text-sm text-gray-600 mt-2">Maharashtra, India</p>
                        </div>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-12">Response Times</h2>
                    <ul class="list-disc pl-6 text-gray-700 mb-6">
                        <li><strong>General Inquiries:</strong> 1-2 business days</li>
                        <li><strong>Technical Support:</strong> 2-3 business days</li>
                        <li><strong>Partnership Inquiries:</strong> 3-5 business days</li>
                        <li><strong>Refund Requests:</strong> 48 hours (processed via dashboard)</li>
                    </ul>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-12">Before You Contact</h2>
                    <p class="text-gray-700 mb-4">
                        To get faster answers, please check these resources first:
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <a href="/help" class="block bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-blue-500 transition">
                            <i class="fas fa-book text-blue-600 text-2xl mb-2"></i>
                            <h3 class="font-bold text-gray-900 mb-1">Help Center</h3>
                            <p class="text-sm text-gray-600">Guides and tutorials</p>
                        </a>
                        <a href="/faq" class="block bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-blue-500 transition">
                            <i class="fas fa-question-circle text-green-600 text-2xl mb-2"></i>
                            <h3 class="font-bold text-gray-900 mb-1">FAQ</h3>
                            <p class="text-sm text-gray-600">Common questions</p>
                        </a>
                        <a href="/dashboard" class="block bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-blue-500 transition">
                            <i class="fas fa-ticket-alt text-purple-600 text-2xl mb-2"></i>
                            <h3 class="font-bold text-gray-900 mb-1">Support Tickets</h3>
                            <p class="text-sm text-gray-600">Track your requests</p>
                        </a>
                    </div>
                    
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
                        <h3 class="font-bold text-gray-900 mb-2">
                            <i class="fas fa-info-circle text-yellow-600 mr-2"></i>
                            Self-Service Platform
                        </h3>
                        <p class="text-gray-700 text-sm">
                            Shabdly is designed to be fully self-service. Most features can be accessed directly through your 
                            dashboard without needing to contact support. This keeps our costs low and prices affordable for you!
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2026 Shabdly.online. All rights reserved.</p>
                <div class="mt-4 space-x-6">
                    <a href="/terms" class="text-gray-400 hover:text-white">Terms</a>
                    <a href="/privacy" class="text-gray-400 hover:text-white">Privacy</a>
                    <a href="/about" class="text-gray-400 hover:text-white">About</a>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

export default app;
