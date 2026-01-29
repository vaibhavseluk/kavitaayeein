import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './lib/types';

// Import routes
import auth from './routes/ecommerce/auth';
import translations from './routes/ecommerce/translations';
import credits from './routes/ecommerce/credits';
import glossary from './routes/ecommerce/glossary';
import admin from './routes/ecommerce/admin';
import knowledge from './routes/ecommerce/knowledge';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Mount API routes
app.route('/api/auth', auth);
app.route('/api/translations', translations);
app.route('/api/credits', credits);
app.route('/api/glossary', glossary);
app.route('/api/admin', admin);
app.route('/api/knowledge', knowledge);

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'shabdly-ecommerce-translation'
  });
});

// Homepage - E-commerce Translation Platform
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shabdly - AI-Powered E-commerce Translation for Indian Languages</title>
        <meta name="description" content="Translate your product listings into 12+ Indian languages instantly. Perfect for Amazon, Flipkart, and D2C sellers targeting regional markets.">
        <meta name="keywords" content="ecommerce translation, indian languages, amazon translation, flipkart translation, product localization, multilingual ecommerce">
        
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Font Awesome -->
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        
        <!-- Custom Styles -->
        <style>
            body {
                font-family: 'Inter', sans-serif;
            }
            .gradient-bg {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .gradient-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .feature-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .pulse-animation {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-language text-3xl gradient-text"></i>
                        <span class="text-2xl font-bold text-gray-900">Shabdly</span>
                    </div>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#features" class="text-gray-700 hover:text-blue-600 transition">Features</a>
                        <a href="#pricing" class="text-gray-700 hover:text-blue-600 transition">Pricing</a>
                        <a href="#how-it-works" class="text-gray-700 hover:text-blue-600 transition">How It Works</a>
                        <a href="/knowledge" class="text-gray-700 hover:text-blue-600 transition">Help</a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button onclick="showLogin()" class="text-gray-700 hover:text-blue-600 transition font-medium">
                            Login
                        </button>
                        <button onclick="showSignup()" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition">
                            Start Free Trial
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="gradient-bg text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6">
                        Sell to <span class="text-yellow-300">60% More Indians</span><br>
                        With AI-Powered Translation
                    </h1>
                    <p class="text-xl md:text-2xl mb-8 text-blue-100">
                        Translate your product listings into 12+ Indian languages in minutes.<br>
                        Perfect for Amazon, Flipkart, and D2C sellers.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                        <button onclick="showSignup()" class="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition transform hover:scale-105">
                            <i class="fas fa-rocket mr-2"></i>
                            Get Started Free - 1,000 Words
                        </button>
                        <button onclick="document.getElementById('demo-video').scrollIntoView({behavior: 'smooth'})" class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition">
                            <i class="fas fa-play-circle mr-2"></i>
                            Watch Demo (2 min)
                        </button>
                    </div>
                    
                    <!-- Trust Badges -->
                    <div class="flex flex-wrap justify-center items-center gap-8 text-sm text-blue-100">
                        <div><i class="fas fa-check-circle text-green-300 mr-2"></i>No Credit Card Required</div>
                        <div><i class="fas fa-check-circle text-green-300 mr-2"></i>1,000 Free Words</div>
                        <div><i class="fas fa-check-circle text-green-300 mr-2"></i>Setup in 5 Minutes</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Social Proof -->
        <section class="py-12 bg-white border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <p class="text-gray-600 mb-6 font-semibold">Trusted by E-commerce Sellers Across India</p>
                    <div class="flex flex-wrap justify-center items-center gap-12 opacity-60">
                        <div class="text-4xl"><i class="fab fa-amazon"></i></div>
                        <div class="text-4xl"><i class="fas fa-shopping-cart"></i></div>
                        <div class="text-4xl"><i class="fas fa-store"></i></div>
                        <div class="text-4xl"><i class="fas fa-box-open"></i></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Problem/Solution Section -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 class="text-4xl font-bold text-gray-900 mb-6">
                            <span class="text-red-600">60% of Indian Buyers</span><br>
                            Don't Buy in English
                        </h2>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <i class="fas fa-times-circle text-red-500 text-2xl mr-4 mt-1"></i>
                                <div>
                                    <h3 class="font-bold text-lg text-gray-900">Lost Sales in Tier 2/3 Cities</h3>
                                    <p class="text-gray-600">Most buyers in Karnataka, Tamil Nadu, and UP prefer local language listings.</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-times-circle text-red-500 text-2xl mr-4 mt-1"></i>
                                <div>
                                    <h3 class="font-bold text-lg text-gray-900">Manual Translation = Weeks of Work</h3>
                                    <p class="text-gray-600">Hiring translators for 500 products is expensive and slow.</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-times-circle text-red-500 text-2xl mr-4 mt-1"></i>
                                <div>
                                    <h3 class="font-bold text-lg text-gray-900">Broken Formatting</h3>
                                    <p class="text-gray-600">Free tools destroy your HTML tags and product structure.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="bg-white p-8 rounded-2xl shadow-2xl">
                            <h3 class="text-2xl font-bold text-gray-900 mb-6">
                                <span class="gradient-text">Shabdly Solution</span>
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-start">
                                    <i class="fas fa-check-circle text-green-500 text-2xl mr-4 mt-1"></i>
                                    <div>
                                        <h4 class="font-bold text-lg text-gray-900">Instant Translation</h4>
                                        <p class="text-gray-600">Upload CSV/Excel → Get translated file in 2 minutes</p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-check-circle text-green-500 text-2xl mr-4 mt-1"></i>
                                    <div>
                                        <h4 class="font-bold text-lg text-gray-900">12+ Indian Languages</h4>
                                        <p class="text-gray-600">Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, and more</p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-check-circle text-green-500 text-2xl mr-4 mt-1"></i>
                                    <div>
                                        <h4 class="font-bold text-lg text-gray-900">Perfect Formatting</h4>
                                        <p class="text-gray-600">HTML tags and structure preserved for Amazon/Flipkart</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Scale Regionally</h2>
                    <p class="text-xl text-gray-600">Built specifically for e-commerce sellers</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="feature-card bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                        <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-file-upload text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Bulk Upload</h3>
                        <p class="text-gray-600">
                            Drag & drop your Excel/CSV with 500+ products. We auto-detect text columns and translate everything.
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="feature-card bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                        <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-code text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">HTML Preserved</h3>
                        <p class="text-gray-600">
                            Your &lt;b&gt;, &lt;br&gt;, and &lt;ul&gt; tags stay intact. Copy-paste directly to Amazon listings.
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="feature-card bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                        <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-lock text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Brand Glossary</h3>
                        <p class="text-gray-600">
                            Lock your brand names like "SwiftCook" or "iPhone" so they never get translated.
                        </p>
                    </div>

                    <!-- Feature 4 -->
                    <div class="feature-card bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                        <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-language text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">12+ Languages</h3>
                        <p class="text-gray-600">
                            One-click "Translate to Top 5 Indian Languages" button. Reach Karnataka, Tamil Nadu, Telangana instantly.
                        </p>
                    </div>

                    <!-- Feature 5 -->
                    <div class="feature-card bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                        <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-coins text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Pay As You Go</h3>
                        <p class="text-gray-600">
                            Only pay for words you translate. $20 for 50,000 words. No monthly commitment required.
                        </p>
                    </div>

                    <!-- Feature 6 -->
                    <div class="feature-card bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                        <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-robot text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">99% Automated</h3>
                        <p class="text-gray-600">
                            AI chatbot + knowledge base for support. No human intervention needed. Works while you sleep.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section id="pricing" class="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                    <p class="text-xl text-gray-600">Start free, upgrade as you grow</p>
                </div>

                <div class="grid md:grid-cols-4 gap-6">
                    <!-- Free Plan -->
                    <div class="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                        <div class="text-4xl font-bold text-gray-900 mb-6">
                            $0<span class="text-lg text-gray-600">/mo</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">1,000 words/month</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">5 languages</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">CSV upload only</span>
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                            Start Free
                        </button>
                    </div>

                    <!-- Starter Plan -->
                    <div class="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                        <div class="text-4xl font-bold text-gray-900 mb-6">
                            $19<span class="text-lg text-gray-600">/mo</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">10,000 words/month</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">12 languages</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">CSV/Excel upload</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">Email support</span>
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Get Started
                        </button>
                    </div>

                    <!-- Growth Plan (Popular) -->
                    <div class="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-2xl p-8 border-4 border-yellow-400 transform scale-105">
                        <div class="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg rounded-tr-lg font-bold text-sm">
                            POPULAR
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-2">Growth</h3>
                        <div class="text-4xl font-bold text-white mb-6">
                            $49<span class="text-lg text-blue-200">/mo</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-300 mr-2 mt-1"></i>
                                <span class="text-white">100,000 words/month</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-300 mr-2 mt-1"></i>
                                <span class="text-white">12 languages</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-300 mr-2 mt-1"></i>
                                <span class="text-white">CSV/Excel upload</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-300 mr-2 mt-1"></i>
                                <span class="text-white">Priority support</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-300 mr-2 mt-1"></i>
                                <span class="text-white">Brand glossary</span>
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105">
                            Start 7-Day Trial
                        </button>
                    </div>

                    <!-- Scale Plan -->
                    <div class="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Scale</h3>
                        <div class="text-4xl font-bold text-gray-900 mb-6">
                            $149<span class="text-lg text-gray-600">/mo</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">500,000 words/month</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">12 languages</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">API access</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">24/7 support</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">Custom glossary</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <span class="text-gray-700">Account manager</span>
                            </li>
                        </ul>
                        <button onclick="showSignup()" class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                            Contact Sales
                        </button>
                    </div>
                </div>

                <div class="text-center mt-12">
                    <p class="text-gray-600 text-lg">
                        💳 All plans include: HTML preservation, automatic retries, and 99.9% uptime SLA
                    </p>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section id="how-it-works" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">3 Steps to Regional Domination</h2>
                    <p class="text-xl text-gray-600">From English-only to pan-India in 5 minutes</p>
                </div>

                <div class="grid md:grid-cols-3 gap-12">
                    <div class="text-center">
                        <div class="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="text-4xl font-bold text-white">1</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Upload Your File</h3>
                        <p class="text-gray-600 text-lg">
                            Drag and drop your product CSV/Excel. We'll detect Product Name, Description, and Bullet Points automatically.
                        </p>
                    </div>

                    <div class="text-center">
                        <div class="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="text-4xl font-bold text-white">2</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Select Languages</h3>
                        <p class="text-gray-600 text-lg">
                            Click "Top 5 Indian Languages" or choose from 12+ options. Add brand terms to your glossary if needed.
                        </p>
                    </div>

                    <div class="text-center">
                        <div class="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="text-4xl font-bold text-white">3</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Download & Upload</h3>
                        <p class="text-gray-600 text-lg">
                            Get your translated file in 2 minutes. Copy-paste directly to Amazon, Flipkart, or your D2C store.
                        </p>
                    </div>
                </div>

                <div class="text-center mt-16">
                    <button onclick="showSignup()" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105">
                        Start Translating Now - Free
                    </button>
                </div>
            </div>
        </section>

        <!-- ROI Calculator -->
        <section class="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-white rounded-2xl shadow-2xl p-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">ROI Calculator</h2>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Monthly Sales (₹)</label>
                            <input type="number" id="monthlySales" value="100000" class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg" oninput="calculateROI()">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Expected Sales Increase with Regional Languages</label>
                            <input type="range" id="salesIncrease" min="5" max="50" value="15" class="w-full" oninput="calculateROI()">
                            <div class="text-center text-2xl font-bold gradient-text mt-2" id="increasePercent">15%</div>
                        </div>

                        <div class="border-t-2 border-gray-200 pt-6">
                            <div class="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p class="text-gray-600 mb-2">Additional Monthly Revenue</p>
                                    <p class="text-3xl font-bold text-green-600" id="additionalRevenue">₹15,000</p>
                                </div>
                                <div>
                                    <p class="text-gray-600 mb-2">Shabdly Cost (Growth Plan)</p>
                                    <p class="text-3xl font-bold text-gray-900">₹4,000</p>
                                </div>
                            </div>
                            <div class="text-center mt-6">
                                <p class="text-gray-600 mb-2">Net Monthly Profit Increase</p>
                                <p class="text-5xl font-bold gradient-text" id="netProfit">₹11,000</p>
                            </div>
                        </div>
                    </div>

                    <div class="text-center mt-8">
                        <button onclick="showSignup()" class="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                            Start Making More Money
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 gradient-bg text-white">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Reach 60% More Buyers?
                </h2>
                <p class="text-xl md:text-2xl mb-8 text-blue-100">
                    Join 1,000+ sellers already growing with Shabdly
                </p>
                <button onclick="showSignup()" class="bg-white text-purple-600 px-12 py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105">
                    <i class="fas fa-rocket mr-2"></i>
                    Start Free - 1,000 Words Included
                </button>
                <p class="mt-6 text-blue-100">
                    <i class="fas fa-shield-alt mr-2"></i>
                    No credit card required • Setup in 5 minutes • Cancel anytime
                </p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-gray-300 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4">Shabdly</h3>
                        <p class="text-sm">AI-powered e-commerce translation for Indian markets.</p>
                    </div>
                    <div>
                        <h4 class="text-white font-semibold mb-4">Product</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="#features" class="hover:text-white transition">Features</a></li>
                            <li><a href="#pricing" class="hover:text-white transition">Pricing</a></li>
                            <li><a href="/knowledge" class="hover:text-white transition">Knowledge Base</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-semibold mb-4">Company</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="/about" class="hover:text-white transition">About Us</a></li>
                            <li><a href="/terms" class="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-semibold mb-4">Connect</h4>
                        <ul class="space-y-2 text-sm">
                            <li><a href="mailto:support@shabdly.online" class="hover:text-white transition">support@shabdly.online</a></li>
                            <li><a href="#" class="hover:text-white transition"><i class="fab fa-twitter mr-2"></i>Twitter</a></li>
                            <li><a href="#" class="hover:text-white transition"><i class="fab fa-linkedin mr-2"></i>LinkedIn</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; 2026 Shabdly. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <!-- Login/Signup Modals will be loaded from separate JS file -->
        <div id="modal-container"></div>

        <!-- Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
        
        <script>
            // ROI Calculator
            function calculateROI() {
                const sales = parseFloat(document.getElementById('monthlySales').value) || 0;
                const increase = parseFloat(document.getElementById('salesIncrease').value) || 0;
                
                document.getElementById('increasePercent').textContent = increase + '%';
                
                const additionalRevenue = sales * (increase / 100);
                const shabdlyCost = 4000; // Growth plan in INR
                const netProfit = additionalRevenue - shabdlyCost;
                
                document.getElementById('additionalRevenue').textContent = '₹' + additionalRevenue.toLocaleString('en-IN');
                document.getElementById('netProfit').textContent = '₹' + netProfit.toLocaleString('en-IN');
            }
            
            // Initialize
            calculateROI();

            // Placeholder functions for modals
            function showLogin() {
                alert('Login modal will be implemented. For now, use /dashboard after signup.');
            }

            function showSignup() {
                alert('Signup modal will be implemented. This will include Google OAuth.');
            }
        </script>
    </body>
    </html>
  `);
});

export default app;
