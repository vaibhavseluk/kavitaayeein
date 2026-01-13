// Monetization Features JavaScript

// Featured Poet Subscription Functions
async function showSubscriptionPlans() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        alert('Please login first');
        showLogin();
        return;
    }

    // Check current subscription status
    const status = await fetch('/api/subscriptions/status', {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());

    document.getElementById('app').innerHTML = `
        <div class="max-w-6xl mx-auto py-12">
            ${status.has_subscription && status.subscription.is_active ? `
                <div class="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-8">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-green-900 flex items-center gap-2">
                                <i class="fas fa-check-circle"></i>
                                Active Featured Poet
                            </h3>
                            <p class="text-green-700 mt-2">
                                ${status.subscription.days_remaining} days remaining
                            </p>
                        </div>
                        <button onclick="cancelSubscription()" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                            Cancel Subscription
                        </button>
                    </div>
                </div>
            ` : ''}

            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold text-gray-900 mb-4">Become a Featured Poet</h1>
                <p class="text-xl text-gray-600">Get premium visibility and reach more readers</p>
            </div>

            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-12">
                <h2 class="text-3xl font-bold mb-4">Featured Poet Benefits</h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-star text-yellow-300 text-2xl"></i>
                        <div>
                            <h3 class="font-bold text-lg">Homepage Spotlight</h3>
                            <p class="text-blue-100">Your poems featured in rotating spotlight section</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="fas fa-search text-yellow-300 text-2xl"></i>
                        <div>
                            <h3 class="font-bold text-lg">Search Priority</h3>
                            <p class="text-blue-100">Appear first in language-filtered searches</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="fas fa-badge-check text-yellow-300 text-2xl"></i>
                        <div>
                            <h3 class="font-bold text-lg">Featured Badge</h3>
                            <p class="text-blue-100">Special badge on your profile and all poems</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="fas fa-chart-line text-yellow-300 text-2xl"></i>
                        <div>
                            <h3 class="font-bold text-lg">Detailed Analytics</h3>
                            <p class="text-blue-100">Track views, engagement, and reader demographics</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Monthly Plan -->
                <div class="subscription-plan bg-white rounded-2xl p-8 border-2 border-gray-200">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
                        <div class="text-5xl font-bold text-blue-600 mb-2">$8</div>
                        <p class="text-gray-600">/month</p>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>All featured benefits</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>30 days visibility</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Cancel anytime</span>
                        </li>
                    </ul>
                    <button onclick="subscribeFeatured('monthly')" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Subscribe Now
                    </button>
                </div>

                <!-- Quarterly Plan (Popular) -->
                <div class="subscription-plan popular bg-white rounded-2xl p-8 border-2 border-blue-600">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Quarterly</h3>
                        <div class="text-5xl font-bold text-blue-600 mb-2">$20</div>
                        <p class="text-gray-600">/3 months</p>
                        <span class="inline-block bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full mt-2">
                            Save 17%
                        </span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>All featured benefits</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>90 days visibility</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Priority support</span>
                        </li>
                    </ul>
                    <button onclick="subscribeFeatured('quarterly')" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Best Value - Subscribe
                    </button>
                </div>

                <!-- Annual Plan -->
                <div class="subscription-plan bg-white rounded-2xl p-8 border-2 border-gray-200">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Annual</h3>
                        <div class="text-5xl font-bold text-blue-600 mb-2">$70</div>
                        <p class="text-gray-600">/year</p>
                        <span class="inline-block bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full mt-2">
                            Save 27%
                        </span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>All featured benefits</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>365 days visibility</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>VIP support</span>
                        </li>
                    </ul>
                    <button onclick="subscribeFeatured('annual')" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Maximum Savings
                    </button>
                </div>
            </div>

            <div class="text-center mt-12">
                <a href="#" onclick="location.reload()" class="text-gray-600 hover:text-gray-900">
                    ← Back to Home
                </a>
            </div>
        </div>
    `;
}

async function subscribeFeatured(plan) {
    const token = localStorage.getItem('auth_token');
    
    try {
        const response = await axios.post('/api/subscriptions/create-checkout', { plan }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // In production, redirect to Stripe checkout
        // For demo, simulate payment
        alert(`Featured Poet Subscription\\n\\nPlan: ${plan}\\nAmount: $${response.data.amount}\\n\\nIn production, this redirects to Stripe checkout.\\n\\nFor demo, we'll activate your subscription now.`);
        
        // Mock payment confirmation
        await axios.post('/api/subscriptions/confirm-payment', {
            user_id: currentUser.id,
            payment_id: `demo_${Date.now()}`,
            plan_type: 'featured_poet'
        });

        alert('Subscription activated! You are now a Featured Poet! 🌟');
        location.reload();
    } catch (error) {
        alert(error.response?.data?.error || 'Subscription failed');
    }
}

async function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your Featured Poet subscription?')) {
        return;
    }

    const token = localStorage.getItem('auth_token');
    
    try {
        await axios.post('/api/subscriptions/cancel', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert('Subscription cancelled. You will remain featured until the end of your billing period.');
        location.reload();
    } catch (error) {
        alert(error.response?.data?.error || 'Cancellation failed');
    }
}

// Advertiser Portal Functions
function showAdvertiserPortal() {
    document.getElementById('app').innerHTML = `
        <div class="max-w-6xl mx-auto py-12">
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold text-gray-900 mb-4">Advertise with Us</h1>
                <p class="text-xl text-gray-600 mb-8">Reach 100,000+ poetry lovers every month</p>
                
                <div class="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div class="text-center">
                        <div class="text-4xl font-bold text-blue-600">100K+</div>
                        <div class="text-gray-600">Monthly Visitors</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-blue-600">50K+</div>
                        <div class="text-gray-600">Engaged Readers</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-blue-600">5K+</div>
                        <div class="text-gray-600">Active Poets</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-blue-600">3</div>
                        <div class="text-gray-600">Languages</div>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mb-12">
                <!-- Bronze Package -->
                <div class="subscription-plan bg-white rounded-2xl p-8 border-2 border-gray-200">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-2">🥉</div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Bronze</h3>
                        <div class="text-5xl font-bold text-gray-900 mb-2">$50</div>
                        <p class="text-gray-600">7 days</p>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>1 sponsored poem</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Brand logo on poem</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Featured in feed</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>~10K impressions</span>
                        </li>
                    </ul>
                    <button onclick="selectSponsorPlan('bronze')" class="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800">
                        Get Started
                    </button>
                </div>

                <!-- Silver Package (Popular) -->
                <div class="subscription-plan popular bg-white rounded-2xl p-8 border-2 border-blue-600">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-2">🥈</div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Silver</h3>
                        <div class="text-5xl font-bold text-blue-600 mb-2">$100</div>
                        <p class="text-gray-600">30 days</p>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>3 sponsored poems</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Homepage banner</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Newsletter feature</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>~50K impressions</span>
                        </li>
                    </ul>
                    <button onclick="selectSponsorPlan('silver')" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                        Most Popular
                    </button>
                </div>

                <!-- Gold Package -->
                <div class="subscription-plan bg-white rounded-2xl p-8 border-2 border-gray-200">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-2">🥇</div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Gold</h3>
                        <div class="text-5xl font-bold text-yellow-600 mb-2">$200</div>
                        <p class="text-gray-600">90 days</p>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Unlimited poems</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Premium placement</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>Social media posts (3x)</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <i class="fas fa-check text-green-500"></i>
                            <span>~150K impressions</span>
                        </li>
                    </ul>
                    <button onclick="selectSponsorPlan('gold')" class="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700">
                        Maximum Impact
                    </button>
                </div>
            </div>

            <div class="bg-gray-100 rounded-2xl p-8 mb-12">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Why Advertise Here?</h3>
                <div class="grid md:grid-cols-3 gap-6">
                    <div>
                        <h4 class="font-bold text-lg mb-2">🎯 Targeted Audience</h4>
                        <p class="text-gray-600">Reach creative, emotionally engaged readers who value authentic content</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg mb-2">🌐 Multilingual Reach</h4>
                        <p class="text-gray-600">Connect with audiences in English, Hindi, and Marathi markets</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg mb-2">📈 High Engagement</h4>
                        <p class="text-gray-600">Average 3+ minutes per visit, with 60% return rate</p>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <p class="text-gray-600 mb-4">Questions? Email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 font-semibold">heyshabdly@gmail.com</a></p>
                <a href="#" onclick="location.reload()" class="text-gray-600 hover:text-gray-900">← Back to Home</a>
            </div>
        </div>
    `;
}

async function selectSponsorPlan(plan) {
    const brandName = prompt('Enter your brand name:');
    if (!brandName) return;

    const brandEmail = prompt('Enter your email:');
    if (!brandEmail) return;

    try {
        const response = await axios.post('/api/sponsors/create', {
            brand_name: brandName,
            brand_email: brandEmail,
            plan_type: plan
        });

        alert(`Sponsorship Request Created!\\n\\nPlan: ${plan}\\nAmount: $${response.data.amount}\\n\\nIn production, you'll be redirected to payment.\\n\\nFor demo, your request has been submitted to admin for approval.`);
        
        location.reload();
    } catch (error) {
        alert(error.response?.data?.error || 'Request failed');
    }
}

// Initialize AdSense (placeholder for production)
function initializeAdSense() {
    // In production, add Google AdSense script
    // (adsbygoogle = window.adsbygoogle || []).push({});
    console.log('AdSense initialization placeholder - add actual AdSense code in production');
}

// Load monetization features on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeAdSense();
});
