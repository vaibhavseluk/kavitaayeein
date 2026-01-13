import { Hono } from 'hono';
import type { Env } from '../lib/types';

const app = new Hono<{ Bindings: Env }>();

// Privacy Policy
app.get('/privacy', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy - Poetry Platform</title>
        <meta name="google-adsense-account" content="ca-pub-8929399363373996">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script src="/static/theme.js"></script>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <a href="/" class="text-xl font-bold text-gray-900">कविता व्यासपीठ</a>
                    </div>
                    <div class="flex items-center space-x-6">
                        <button id="themeToggle" class="theme-toggle" onclick="window.toggleTheme()" title="Toggle theme">
                            <i class="fas fa-moon"></i>
                            <span class="hidden sm:inline">Dark</span>
                        </button>
                        <a href="/" class="nav-link text-gray-700"><i class="fas fa-home mr-1"></i> Home</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p class="text-sm text-gray-500 mb-8">Effective Date: January 2026</p>

                <div class="space-y-6 text-gray-700">
                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">1.1 Personal Information</h3>
                        <p class="mb-2">When you register or use our Platform, we may collect:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Username and display name</li>
                            <li>Email address</li>
                            <li>Profile information</li>
                            <li>Preferred language(s)</li>
                            <li>Payment information (processed securely by third-party payment processors)</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-gray-800 mb-2 mt-4">1.2 User Content</h3>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Poems and creative works you submit</li>
                            <li>Comments and interactions with other users</li>
                            <li>Ratings and reviews</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-gray-800 mb-2 mt-4">1.3 Automatically Collected Information</h3>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Device information (browser type, operating system)</li>
                            <li>IP address</li>
                            <li>Usage data (pages visited, features used, time spent)</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p class="mb-2">We use your information to:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Provide and improve our services</li>
                            <li>Process your subscription and payments</li>
                            <li>Display your poems and profile to other users</li>
                            <li>Send important notifications about your account</li>
                            <li>Compile and publish anthologies (with your consent)</li>
                            <li>Moderate content for safety and compliance</li>
                            <li>Analyze platform usage to improve user experience</li>
                            <li>Prevent fraud and abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
                        <p class="mb-2">We do not sell your personal information. We may share your information in the following circumstances:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li><strong>Public Content:</strong> Your published poems, username, and profile are visible to other users</li>
                            <li><strong>Service Providers:</strong> Payment processors, hosting services, and analytics tools</li>
                            <li><strong>Anthology Publication:</strong> If you agree to have your poem included in an anthology, your work and author name will be published</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">4. Your Rights</h2>
                        <p class="mb-2">You have the right to:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Access, update, or delete your personal information</li>
                            <li>Set your poems as private or public</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request a copy of your data</li>
                            <li>Withdraw consent for anthology publication</li>
                            <li>Delete your account (poems published in anthologies may remain)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">5. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your data, including:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Encrypted data transmission (HTTPS/SSL)</li>
                            <li>Secure password hashing</li>
                            <li>Regular security audits</li>
                            <li>Limited access to personal information</li>
                        </ul>
                        <p class="mt-2">However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">6. Cookies and Tracking</h2>
                        <p class="mb-2">We use cookies and similar technologies to:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Keep you logged in</li>
                            <li>Remember your preferences (language, theme)</li>
                            <li>Analyze site usage via Google Analytics</li>
                            <li>Display personalized ads via Google AdSense</li>
                        </ul>
                        <p class="mt-2">You can manage cookie preferences through your browser settings.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">7. Third-Party Services</h2>
                        <p class="mb-2">We use the following third-party services:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li><strong>Payment Processing:</strong> Razorpay (India), Stripe (international)</li>
                            <li><strong>Analytics:</strong> Google Analytics</li>
                            <li><strong>Advertising:</strong> Google AdSense</li>
                            <li><strong>Hosting:</strong> Cloudflare</li>
                        </ul>
                        <p class="mt-2">These services have their own privacy policies. Please review them separately.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">8. Children's Privacy</h2>
                        <p>Our Platform is not intended for users under 13 years of age. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">9. International Users</h2>
                        <p>Our services are hosted on Cloudflare's global network. By using our Platform, you consent to the transfer of your information to servers worldwide.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or prominent notice on our Platform.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
                        <p>For questions about this Privacy Policy or to exercise your rights, contact us at:</p>
                        <p class="mt-2"><strong>Email:</strong> <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a></p>
                    </section>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <p class="text-sm text-gray-400">© 2026 कविता व्यासपीठ. All rights reserved.</p>
                    <div class="mt-4 space-x-4">
                        <a href="/policies/privacy" class="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                        <a href="/policies/terms" class="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                        <a href="/policies/refund" class="text-gray-400 hover:text-white text-sm">Refund Policy</a>
                        <a href="/policies/faq" class="text-gray-400 hover:text-white text-sm">FAQ</a>
                    </div>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// Terms of Service
app.get('/terms', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terms of Service - Poetry Platform</title>
        <meta name="google-adsense-account" content="ca-pub-8929399363373996">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script src="/static/theme.js"></script>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <a href="/" class="text-xl font-bold text-gray-900">कविता व्यासपीठ</a>
                    </div>
                    <div class="flex items-center space-x-6">
                        <button id="themeToggle" class="theme-toggle" onclick="window.toggleTheme()" title="Toggle theme">
                            <i class="fas fa-moon"></i>
                            <span class="hidden sm:inline">Dark</span>
                        </button>
                        <a href="/" class="nav-link text-gray-700"><i class="fas fa-home mr-1"></i> Home</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p class="text-sm text-gray-500 mb-8">Effective Date: January 2026</p>

                <div class="space-y-6 text-gray-700">
                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using the Poetry Platform ("Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">2. User Accounts</h2>
                        <p class="mb-2"><strong>2.1 Registration:</strong> To use certain features, you must create an account. You agree to:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Notify us immediately of unauthorized access</li>
                            <li>Be responsible for all activity under your account</li>
                        </ul>
                        <p class="mt-4"><strong>2.2 Eligibility:</strong> You must be at least 13 years old to use this Platform. Users under 18 should have parental consent.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">3. Content Ownership and Licensing</h2>
                        <p class="mb-2"><strong>3.1 Your Content:</strong> You retain copyright ownership of all poems and creative works you submit ("User Content").</p>
                        
                        <p class="mt-4 mb-2"><strong>3.2 License Grant:</strong> By submitting User Content, you grant us:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>A non-exclusive, worldwide, royalty-free license to display, reproduce, and distribute your content on the Platform</li>
                            <li>The right to include your poems in curated collections and promotional materials</li>
                            <li>The right to feature your work in marketing and social media</li>
                        </ul>

                        <p class="mt-4 mb-2"><strong>3.3 Anthology Rights:</strong> For poems selected for paid anthologies:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>You grant us the right to publish your poem in print and digital formats</li>
                            <li>You will be credited as the author</li>
                            <li>The Platform retains anthology revenue to sustain operations</li>
                            <li>You may request removal before publication, but not after printing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">4. Content Guidelines</h2>
                        <p class="mb-2">You agree NOT to post content that:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Infringes on intellectual property rights</li>
                            <li>Contains hate speech, harassment, or threats</li>
                            <li>Is sexually explicit or inappropriate for a general audience</li>
                            <li>Promotes illegal activities</li>
                            <li>Contains spam or commercial solicitations</li>
                            <li>Includes personal information of others without consent</li>
                        </ul>
                        <p class="mt-2">We reserve the right to remove content that violates these guidelines.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">5. Subscription and Payments</h2>
                        <p class="mb-2"><strong>5.1 Premium Subscription:</strong></p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Premium plans are billed annually at $4.66 USD or ₹350 INR</li>
                            <li>Payment is processed securely by Razorpay or Stripe</li>
                            <li>Subscription renews automatically unless canceled</li>
                        </ul>

                        <p class="mt-4"><strong>5.2 Featured Poet Program:</strong> Featured poet subscriptions are separate and billed according to the selected plan.</p>

                        <p class="mt-4"><strong>5.3 Refunds:</strong> Refunds are governed by our <a href="/policies/refund" class="text-blue-600 hover:underline">Refund Policy</a>.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">6. User Conduct</h2>
                        <p class="mb-2">You agree to:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Use the Platform for lawful purposes only</li>
                            <li>Respect other users and their work</li>
                            <li>Not attempt to hack, disrupt, or compromise security</li>
                            <li>Not impersonate others</li>
                            <li>Not create multiple accounts to manipulate ratings or engagement</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">7. Platform Rights</h2>
                        <p class="mb-2">We reserve the right to:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Modify, suspend, or discontinue the Platform at any time</li>
                            <li>Remove or edit content that violates these Terms</li>
                            <li>Ban users who violate these Terms</li>
                            <li>Change pricing with 30 days' notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">8. Disclaimers</h2>
                        <p>THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Uninterrupted or error-free service</li>
                            <li>Accuracy or reliability of content</li>
                            <li>That your poems will be selected for anthologies</li>
                            <li>Specific levels of engagement or readership</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
                        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Loss of profits, data, or goodwill</li>
                            <li>Damages exceeding the amount you paid in the past 12 months</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">10. Intellectual Property</h2>
                        <p>All Platform design, code, logos, and features are owned by us and protected by copyright and trademark laws. You may not copy, modify, or distribute our intellectual property without permission.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">11. Termination</h2>
                        <p class="mb-2">You may delete your account at any time. We may terminate or suspend your account if:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>You violate these Terms</li>
                            <li>Your account has been inactive for over 2 years</li>
                            <li>Required by law</li>
                        </ul>
                        <p class="mt-2">Termination does not affect anthology rights for already-published works.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">12. Governing Law</h2>
                        <p>These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of [Your City/State].</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">13. Changes to Terms</h2>
                        <p>We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new Terms.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">14. Contact Us</h2>
                        <p>For questions about these Terms, contact us at:</p>
                        <p class="mt-2"><strong>Email:</strong> <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a></p>
                    </section>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <p class="text-sm text-gray-400">© 2026 कविता व्यासपीठ. All rights reserved.</p>
                    <div class="mt-4 space-x-4">
                        <a href="/policies/privacy" class="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                        <a href="/policies/terms" class="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                        <a href="/policies/refund" class="text-gray-400 hover:text-white text-sm">Refund Policy</a>
                        <a href="/policies/faq" class="text-gray-400 hover:text-white text-sm">FAQ</a>
                    </div>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// Refund Policy
app.get('/refund', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Policy - Poetry Platform</title>
        <meta name="google-adsense-account" content="ca-pub-8929399363373996">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script src="/static/theme.js"></script>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <a href="/" class="text-xl font-bold text-gray-900">कविता व्यासपीठ</a>
                    </div>
                    <div class="flex items-center space-x-6">
                        <button id="themeToggle" class="theme-toggle" onclick="window.toggleTheme()" title="Toggle theme">
                            <i class="fas fa-moon"></i>
                            <span class="hidden sm:inline">Dark</span>
                        </button>
                        <a href="/" class="nav-link text-gray-700"><i class="fas fa-home mr-1"></i> Home</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
                <p class="text-sm text-gray-500 mb-8">Effective Date: January 2026</p>

                <div class="space-y-6 text-gray-700">
                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">1. Overview</h2>
                        <p>We strive to provide the best experience for our users. This Refund Policy outlines the terms under which refunds are issued for Premium subscriptions and Featured Poet program fees.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">2. Premium Subscription Refunds</h2>
                        
                        <p class="mb-2"><strong>2.1 7-Day Money-Back Guarantee</strong></p>
                        <p class="mb-2">We offer a <strong>7-day money-back guarantee</strong> for new Premium subscriptions:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Eligible: First-time Premium subscribers only</li>
                            <li>Timeframe: Request must be made within 7 days of payment</li>
                            <li>Process: Full refund to the original payment method</li>
                            <li>Access: Premium features will be disabled upon refund approval</li>
                        </ul>

                        <p class="mt-4 mb-2"><strong>2.2 Renewal Cancellations</strong></p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>You may cancel auto-renewal at any time before the renewal date</li>
                            <li>No refunds for cancellations made after the renewal charge</li>
                            <li>You retain access until the end of the current billing period</li>
                        </ul>

                        <p class="mt-4 mb-2"><strong>2.3 Exceptions (No Refund)</strong></p>
                        <p class="mb-2">Refunds will NOT be issued if:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>More than 7 days have passed since the initial purchase</li>
                            <li>You have published more than 5 poems during the trial period</li>
                            <li>You are re-subscribing after a previous cancellation</li>
                            <li>Your account was banned for Terms of Service violations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">3. Featured Poet Program Refunds</h2>
                        
                        <p class="mb-2"><strong>3.1 Pro-Rated Refunds</strong></p>
                        <p class="mb-2">Featured Poet subscriptions are eligible for pro-rated refunds:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Calculated based on unused months</li>
                            <li>Minimum 30 days must remain in the subscription period</li>
                            <li>Processing fee of 10% may apply</li>
                        </ul>

                        <p class="mt-4 mb-2"><strong>3.2 Service Interruptions</strong></p>
                        <p class="mb-2">If we fail to deliver Featured Poet benefits due to technical issues:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>We will extend your subscription by the downtime duration</li>
                            <li>Or provide a pro-rated refund for the affected period</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">4. Anthology Submissions</h2>
                        <p class="mb-2">There are <strong>no fees or refunds</strong> related to anthology submissions:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Submitting poems for anthologies is free for all users</li>
                            <li>Authors do not pay to be included</li>
                            <li>Authors do not receive direct payment for anthology inclusion</li>
                            <li>No refunds are applicable as there are no charges</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">5. How to Request a Refund</h2>
                        
                        <p class="mb-2"><strong>Step 1:</strong> Email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a> with:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Your account email</li>
                            <li>Payment ID or transaction reference</li>
                            <li>Reason for refund request</li>
                        </ul>

                        <p class="mt-4"><strong>Step 2:</strong> Our team will review your request within 3-5 business days.</p>
                        <p class="mt-2"><strong>Step 3:</strong> If approved, the refund will be processed within 7-10 business days to your original payment method.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">6. Payment Gateway Fees</h2>
                        <p>Please note that payment processing fees charged by Razorpay, Stripe, or other payment gateways are non-refundable. Only the subscription amount (minus processing fees) will be refunded.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">7. Chargebacks</h2>
                        <p class="mb-2">If you initiate a chargeback instead of requesting a refund through proper channels:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Your account may be permanently suspended</li>
                            <li>We may dispute the chargeback with evidence of service delivery</li>
                            <li>Future transactions from your payment method may be blocked</li>
                        </ul>
                        <p class="mt-2">Please contact us first to resolve any billing issues.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">8. Service Downtime</h2>
                        <p>If the Platform experiences extended downtime (more than 24 consecutive hours), affected Premium or Featured Poet subscribers may request:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>A subscription extension equal to the downtime</li>
                            <li>Or a pro-rated refund for the downtime period</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">9. Upgrades and Downgrades</h2>
                        <p class="mb-2"><strong>Upgrades:</strong> If you upgrade from Free to Premium or from Premium to Featured Poet:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>You will be charged the difference</li>
                            <li>The new plan takes effect immediately</li>
                        </ul>

                        <p class="mt-4 mb-2"><strong>Downgrades:</strong></p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Downgrading does not result in a refund</li>
                            <li>Your current plan remains active until the end of the billing period</li>
                            <li>The lower tier will activate after the current period ends</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">10. Fraudulent Transactions</h2>
                        <p>If we detect fraudulent activity or abuse of refund policies:</p>
                        <ul class="list-disc pl-6 space-y-1">
                            <li>Your refund request may be denied</li>
                            <li>Your account may be banned</li>
                            <li>We may report the activity to payment processors and authorities</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
                        <p>We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting. Your continued use of the Platform constitutes acceptance of the updated policy.</p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
                        <p>For refund requests or questions about this policy:</p>
                        <p class="mt-2"><strong>Email:</strong> <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a></p>
                        <p class="mt-2">We typically respond within 24-48 hours.</p>
                    </section>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <p class="text-sm text-gray-400">© 2026 कविता व्यासपीठ. All rights reserved.</p>
                    <div class="mt-4 space-x-4">
                        <a href="/policies/privacy" class="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                        <a href="/policies/terms" class="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                        <a href="/policies/refund" class="text-gray-400 hover:text-white text-sm">Refund Policy</a>
                        <a href="/policies/faq" class="text-gray-400 hover:text-white text-sm">FAQ</a>
                    </div>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// FAQ
app.get('/faq', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FAQ - Poetry Platform</title>
        <meta name="google-adsense-account" content="ca-pub-8929399363373996">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script src="/static/theme.js"></script>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <a href="/" class="text-xl font-bold text-gray-900">कविता व्यासपीठ</a>
                    </div>
                    <div class="flex items-center space-x-6">
                        <button id="themeToggle" class="theme-toggle" onclick="window.toggleTheme()" title="Toggle theme">
                            <i class="fas fa-moon"></i>
                            <span class="hidden sm:inline">Dark</span>
                        </button>
                        <a href="/" class="nav-link text-gray-700"><i class="fas fa-home mr-1"></i> Home</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-12">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                <p class="text-gray-600 mb-8">Find answers to common questions about the Poetry Platform.</p>

                <div class="space-y-6">
                    <!-- General Questions -->
                    <div class="border-b pb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-info-circle text-blue-600 mr-3"></i>
                            General Questions
                        </h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">What is the Poetry Platform?</h3>
                                <p class="text-gray-700">The Poetry Platform is a multilingual community for poets to share their work in Marathi, Hindi, and English. We support poets at all levels, from beginners to published authors.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Is the Platform free to use?</h3>
                                <p class="text-gray-700">Yes! We offer a Free plan with basic features. Premium plans ($4.66/year) unlock unlimited poems, advanced editor features, and priority support.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Which languages are supported?</h3>
                                <p class="text-gray-700">We fully support Marathi (मराठी), Hindi (हिंदी), and English. Our editor includes built-in transliteration and Input Method Editors (IME) for easy Devanagari typing.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Do I retain copyright of my poems?</h3>
                                <p class="text-gray-700">Yes! You retain full copyright ownership. You only grant us a license to display and promote your work on the platform and in curated anthologies.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Subscription & Payments -->
                    <div class="border-b pb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-credit-card text-blue-600 mr-3"></i>
                            Subscription & Payments
                        </h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How much does Premium cost?</h3>
                                <p class="text-gray-700">Premium costs <strong>$4.66 USD/year</strong> or <strong>₹350 INR/year</strong> (less than $0.40/month!).</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
                                <p class="text-gray-700">We accept:</p>
                                <ul class="list-disc pl-6 mt-2 text-gray-700">
                                    <li><strong>India:</strong> Razorpay (UPI, Cards, Net Banking, Wallets)</li>
                                    <li><strong>International:</strong> Stripe (Credit/Debit Cards)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I cancel my subscription?</h3>
                                <p class="text-gray-700">Yes. You can cancel anytime from your account settings. You'll retain access until the end of the current billing period.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Do subscriptions auto-renew?</h3>
                                <p class="text-gray-700">Yes, subscriptions auto-renew annually unless you cancel before the renewal date. We'll send a reminder 7 days before renewal.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I upgrade or downgrade my plan?</h3>
                                <p class="text-gray-700">Go to Settings → Subscription → Manage Plan. Upgrades take effect immediately (you'll be charged the difference). Downgrades take effect at the end of the current period.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Refunds & Returns -->
                    <div class="border-b pb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-undo text-blue-600 mr-3"></i>
                            Refunds & Returns
                        </h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">What is your refund policy?</h3>
                                <p class="text-gray-700">We offer a <strong>7-day money-back guarantee</strong> for first-time Premium subscribers. Request a refund within 7 days of payment for a full refund. See our <a href="/policies/refund" class="text-blue-600 hover:underline">Refund Policy</a> for details.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I request a refund?</h3>
                                <p class="text-gray-700">Email <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a> with your account email, payment ID, and reason. We'll process refunds within 7-10 business days.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I get a refund after 7 days?</h3>
                                <p class="text-gray-700">Generally, no. Refunds after 7 days are only considered in exceptional circumstances (e.g., extended platform downtime, billing errors).</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Are Featured Poet subscriptions refundable?</h3>
                                <p class="text-gray-700">Yes, on a pro-rated basis if you have at least 30 days remaining. A 10% processing fee may apply.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">What if I was charged twice by mistake?</h3>
                                <p class="text-gray-700">Contact us immediately at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a>. We'll investigate and refund duplicate charges within 3-5 business days.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Poetry Submission & Publishing -->
                    <div class="border-b pb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-pen-fancy text-blue-600 mr-3"></i>
                            Poetry Submission & Publishing
                        </h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I publish a poem?</h3>
                                <p class="text-gray-700">Click "Create New Poem" → Write your poem → Choose language → Click "Publish". Your poem will be visible to all users immediately.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I save drafts?</h3>
                                <p class="text-gray-700">Yes! Click "Save as Draft" instead of "Publish". Drafts are private and only visible to you until you publish them.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I edit or delete my poems?</h3>
                                <p class="text-gray-700">Yes. Open your poem → Click "Edit" or "Delete". Note: Poems published in printed anthologies cannot be deleted from the anthology.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How many poems can I publish?</h3>
                                <p class="text-gray-700">Free users: Up to 10 poems. Premium users: Unlimited.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Anthology Program -->
                    <div class="border-b pb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-book text-blue-600 mr-3"></i>
                            Anthology Program
                        </h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">What is the Anthology Program?</h3>
                                <p class="text-gray-700">We periodically compile the best poems into printed and digital anthologies. These are sold on platforms like Amazon to sustain the platform and promote poets.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How are poems selected?</h3>
                                <p class="text-gray-700">Our editorial team reviews poems based on quality, originality, and engagement (likes, ratings, views). Featured poets receive priority consideration.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Do I get paid if my poem is selected?</h3>
                                <p class="text-gray-700">Authors do not receive direct payment. However, anthology inclusion provides exposure, credibility, and a published credit. Revenue sustains the platform and future anthologies.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I opt out of anthologies?</h3>
                                <p class="text-gray-700">Yes. In your account settings, disable "Allow poems in anthologies". You can also decline individual anthology invitations.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Will I get a free copy of the anthology?</h3>
                                <p class="text-gray-700">Yes! Authors whose poems are included receive one free digital copy. Printed copies can be purchased at author discount rates.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Poet Program -->
                    <div class="border-b pb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-star text-blue-600 mr-3"></i>
                            Featured Poet Program
                        </h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">What is the Featured Poet Program?</h3>
                                <p class="text-gray-700">A premium program that highlights your profile and poems. Your work receives priority placement, a verified badge, and increased visibility.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How much does it cost?</h3>
                                <p class="text-gray-700">Plans start at $14.99 USD/month or ₹1,200 INR/month. See our pricing page for all tiers.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">What are the benefits?</h3>
                                <ul class="list-disc pl-6 mt-2 text-gray-700">
                                    <li>Verified "Featured Poet" badge</li>
                                    <li>Homepage banner rotation</li>
                                    <li>Priority in anthology selection</li>
                                    <li>Enhanced profile customization</li>
                                    <li>Dedicated support</li>
                                </ul>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I cancel Featured Poet?</h3>
                                <p class="text-gray-700">Yes, anytime. You'll retain benefits until the end of the current billing period.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Technical Support -->
                    <div class="border-b pb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-cog text-blue-600 mr-3"></i>
                            Technical Support
                        </h2>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">I can't type in Marathi/Hindi. What do I do?</h3>
                                <p class="text-gray-700">Use our built-in transliteration: Type phonetically in English (e.g., "namaste" → "नमस्ते"). Or enable Google Input Tools or Pramukh IME from the editor settings.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">My payment failed. What should I do?</h3>
                                <p class="text-gray-700">Check your payment method, ensure sufficient funds, and try again. If the issue persists, contact <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a> with your payment ID.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">I forgot my password. How do I reset it?</h3>
                                <p class="text-gray-700">Click "Forgot Password" on the login page. Enter your email to receive a password reset link.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I change my username?</h3>
                                <p class="text-gray-700">Currently, usernames cannot be changed. However, you can update your display name in account settings.</p>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I delete my account?</h3>
                                <p class="text-gray-700">Go to Settings → Account → Delete Account. This action is permanent and cannot be undone. Published anthology poems may remain in print.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-envelope text-blue-600 mr-3"></i>
                            Still Have Questions?
                        </h2>
                        <p class="text-gray-700">Can't find what you're looking for? Contact us:</p>
                        <p class="mt-4"><strong>Email:</strong> <a href="mailto:heyshabdly@gmail.com" class="text-blue-600 hover:underline">heyshabdly@gmail.com</a></p>
                        <p class="text-gray-600 mt-2">We typically respond within 24-48 hours.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <p class="text-sm text-gray-400">© 2026 कविता व्यासपीठ. All rights reserved.</p>
                    <div class="mt-4 space-x-4">
                        <a href="/policies/privacy" class="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                        <a href="/policies/terms" class="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                        <a href="/policies/refund" class="text-gray-400 hover:text-white text-sm">Refund Policy</a>
                        <a href="/policies/faq" class="text-gray-400 hover:text-white text-sm">FAQ</a>
                    </div>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

export default app;
