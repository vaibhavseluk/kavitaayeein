import { Hono } from 'hono';
import type { Env } from '../lib/types';

const app = new Hono<{ Bindings: Env }>();

// Privacy Policy
app.get('/privacy-policy', (c) => {
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
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <h1 class="text-xl font-bold text-gray-900">कविता व्यासपीठ</h1>
                    </div>
                    <a href="/" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            <div class="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
                <p class="text-gray-600 mb-6"><strong>Effective Date:</strong> January 13, 2026</p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                <p class="text-gray-700 mb-4">
                    Welcome to Poetry Platform ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Personal Information</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Username and display name</li>
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>Language preference</li>
                    <li>Profile information (optional)</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Content You Create</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Poems and poetry content</li>
                    <li>Comments and ratings</li>
                    <li>Likes and interactions</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Automatically Collected Information</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2.4 Payment Information</h3>
                <p class="text-gray-700 mb-4">
                    For Premium subscriptions, we collect payment information through secure third-party payment processors. We do not store complete credit card numbers on our servers.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>To provide and maintain our services</li>
                    <li>To process your transactions and subscriptions</li>
                    <li>To send you notifications and updates</li>
                    <li>To respond to your inquiries and support requests</li>
                    <li>To improve and personalize your experience</li>
                    <li>To display your poems and profile to other users</li>
                    <li>To compile poems into anthologies (with your consent via Terms of Service)</li>
                    <li>To prevent fraud and ensure platform security</li>
                    <li>To comply with legal obligations</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Information Sharing and Disclosure</h2>
                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Public Information</h3>
                <p class="text-gray-700 mb-4">
                    Your username, display name, and published poems are publicly visible to all users and visitors of our platform.
                </p>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Third-Party Service Providers</h3>
                <p class="text-gray-700 mb-4">We may share your information with:</p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Payment processors (Razorpay, Stripe)</li>
                    <li>Hosting and infrastructure providers (Cloudflare)</li>
                    <li>Analytics services (Google Analytics)</li>
                    <li>Email service providers</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Legal Requirements</h3>
                <p class="text-gray-700 mb-4">
                    We may disclose your information if required by law, court order, or governmental authority, or to protect our rights, property, or safety.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
                <p class="text-gray-700 mb-4">
                    We implement industry-standard security measures to protect your information:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Encrypted password storage</li>
                    <li>Secure HTTPS connections</li>
                    <li>Regular security audits</li>
                    <li>Access controls and authentication</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
                <p class="text-gray-700 mb-4">You have the right to:</p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate or incomplete data</li>
                    <li>Request deletion of your account and data</li>
                    <li>Object to certain data processing</li>
                    <li>Export your data</li>
                    <li>Withdraw consent at any time</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies and Tracking</h2>
                <p class="text-gray-700 mb-4">
                    We use cookies and similar technologies to:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Remember your preferences (theme, language)</li>
                    <li>Authenticate your login sessions</li>
                    <li>Analyze site traffic and usage</li>
                    <li>Serve relevant advertisements</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
                <p class="text-gray-700 mb-4">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
                <p class="text-gray-700 mb-4">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to This Policy</h2>
                <p class="text-gray-700 mb-4">
                    We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Effective Date."
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
                <p class="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div class="bg-blue-50 rounded-lg p-6 mt-4">
                    <p class="text-gray-700">
                        <i class="fas fa-envelope mr-2 text-blue-600"></i>
                        <strong>Email:</strong> <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>

        <footer class="bg-gray-900 text-white mt-16 py-8">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2026 Poetry Platform. All rights reserved.</p>
                <div class="mt-4 space-x-4">
                    <a href="/privacy-policy" class="text-gray-400 hover:text-white">Privacy Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/terms-of-service" class="text-gray-400 hover:text-white">Terms of Service</a>
                    <span class="text-gray-600">|</span>
                    <a href="/refund-policy" class="text-gray-400 hover:text-white">Refund Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/faq" class="text-gray-400 hover:text-white">FAQ</a>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// Terms of Service
app.get('/terms-of-service', (c) => {
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
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <h1 class="text-xl font-bold text-gray-900">कविता व्यासपीठ</h1>
                    </div>
                    <a href="/" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            <div class="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
                <p class="text-gray-600 mb-6"><strong>Effective Date:</strong> January 13, 2026</p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                <p class="text-gray-700 mb-4">
                    By accessing and using Poetry Platform ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Eligibility</h2>
                <p class="text-gray-700 mb-4">
                    You must be at least 13 years old to use this Platform. By using our services, you represent that you meet this age requirement.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Account Registration</h2>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must not share your account credentials</li>
                    <li>You are responsible for all activities under your account</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Content Ownership and Rights</h2>
                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Your Content</h3>
                <p class="text-gray-700 mb-4">
                    You retain copyright ownership of your original poems and poetry. However, by publishing content on our Platform, you grant us the following rights:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li><strong>Display Rights:</strong> To display your poems on our website and mobile applications</li>
                    <li><strong>Anthology Rights:</strong> To include your poems in paid anthologies (print or digital)</li>
                    <li><strong>Promotional Rights:</strong> To use excerpts of your poems for marketing and promotional purposes</li>
                    <li><strong>Distribution Rights:</strong> To distribute anthologies containing your work through various channels</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Anthology Revenue</h3>
                <p class="text-gray-700 mb-4">
                    When your poems are included in paid anthologies:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>You acknowledge that the Platform may generate revenue from anthology sales</li>
                    <li>The Platform is not obligated to share anthology revenue with individual poets</li>
                    <li>Your participation in the Platform constitutes acceptance of this arrangement</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Attribution</h3>
                <p class="text-gray-700 mb-4">
                    We will always attribute your work to you by your username or display name when including your poems in anthologies or promotional materials.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Content Guidelines</h2>
                <p class="text-gray-700 mb-4">You agree NOT to post content that:</p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Is plagiarized or violates others' intellectual property</li>
                    <li>Contains hate speech, discrimination, or harassment</li>
                    <li>Is sexually explicit or inappropriate</li>
                    <li>Promotes violence or illegal activities</li>
                    <li>Contains spam, advertising, or commercial content</li>
                    <li>Violates any applicable laws or regulations</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Subscription Plans</h2>
                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Free Plan</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Limited to 10 poems</li>
                    <li>Basic editor features</li>
                    <li>Community access</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Premium Plan ($4.66/year)</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Unlimited poems</li>
                    <li>Advanced editor features</li>
                    <li>Real-time transliteration</li>
                    <li>Featured poet opportunities</li>
                    <li>Priority support</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Payment Terms</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Subscriptions are billed annually</li>
                    <li>All fees are in USD unless stated otherwise</li>
                    <li>Automatic renewal unless cancelled</li>
                    <li>See our Refund Policy for cancellation terms</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Prohibited Activities</h2>
                <p class="text-gray-700 mb-4">You may not:</p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Attempt to hack, disrupt, or compromise the Platform</li>
                    <li>Use automated tools (bots) without permission</li>
                    <li>Impersonate other users or entities</li>
                    <li>Collect user data without authorization</li>
                    <li>Use the Platform for any illegal purpose</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Termination</h2>
                <p class="text-gray-700 mb-4">
                    We reserve the right to suspend or terminate your account at any time for:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Violation of these Terms of Service</li>
                    <li>Fraudulent or illegal activity</li>
                    <li>Abuse of other users or staff</li>
                    <li>Any other reason at our discretion</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Disclaimer of Warranties</h2>
                <p class="text-gray-700 mb-4">
                    The Platform is provided "as is" without warranties of any kind, either express or implied. We do not guarantee:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Uninterrupted or error-free service</li>
                    <li>The accuracy or reliability of content</li>
                    <li>That defects will be corrected</li>
                    <li>That the Platform is free from viruses or harmful components</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
                <p class="text-gray-700 mb-4">
                    To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
                <p class="text-gray-700 mb-4">
                    We may modify these Terms of Service at any time. Significant changes will be notified via email or platform announcement. Continued use after changes constitutes acceptance.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
                <p class="text-gray-700 mb-4">
                    These Terms shall be governed by and construed in accordance with applicable international laws and regulations.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
                <p class="text-gray-700 mb-4">
                    For questions about these Terms of Service, contact us at:
                </p>
                <div class="bg-blue-50 rounded-lg p-6 mt-4">
                    <p class="text-gray-700">
                        <i class="fas fa-envelope mr-2 text-blue-600"></i>
                        <strong>Email:</strong> <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>

        <footer class="bg-gray-900 text-white mt-16 py-8">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2026 Poetry Platform. All rights reserved.</p>
                <div class="mt-4 space-x-4">
                    <a href="/privacy-policy" class="text-gray-400 hover:text-white">Privacy Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/terms-of-service" class="text-gray-400 hover:text-white">Terms of Service</a>
                    <span class="text-gray-600">|</span>
                    <a href="/refund-policy" class="text-gray-400 hover:text-white">Refund Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/faq" class="text-gray-400 hover:text-white">FAQ</a>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

// Refund Policy
app.get('/refund-policy', (c) => {
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
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <h1 class="text-xl font-bold text-gray-900">कविता व्यासपीठ</h1>
                    </div>
                    <a href="/" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
            <div class="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
                <p class="text-gray-600 mb-6"><strong>Effective Date:</strong> January 13, 2026</p>
                <p class="text-gray-600 mb-6"><strong>Last Updated:</strong> January 13, 2026</p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Overview</h2>
                <p class="text-gray-700 mb-4">
                    At Poetry Platform, we want you to be completely satisfied with your Premium subscription. This Refund Policy explains our refund and cancellation terms.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. 7-Day Money-Back Guarantee</h2>
                <p class="text-gray-700 mb-4">
                    We offer a <strong>7-day money-back guarantee</strong> for all Premium subscriptions.
                </p>
                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Eligibility</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Request must be made within 7 days of purchase</li>
                    <li>First-time subscribers only</li>
                    <li>Account must not have been previously refunded</li>
                    <li>No abuse or violation of Terms of Service</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 How to Request</h3>
                <p class="text-gray-700 mb-4">
                    To request a refund within 7 days:
                </p>
                <ol class="list-decimal pl-6 text-gray-700 mb-4">
                    <li>Email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a></li>
                    <li>Include your account email and username</li>
                    <li>Provide your payment/transaction ID</li>
                    <li>State reason for refund (optional but helpful)</li>
                </ol>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Processing Time</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Refund requests are processed within 2-3 business days</li>
                    <li>Refunds are issued to your original payment method</li>
                    <li>Bank processing may take an additional 5-10 business days</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">3. After 7 Days</h2>
                <p class="text-gray-700 mb-4">
                    After the 7-day guarantee period:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li><strong>No refunds</strong> will be issued for used subscription time</li>
                    <li>You may <strong>cancel</strong> your subscription to prevent future charges</li>
                    <li>You will retain access until the end of your current billing period</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Subscription Cancellation</h2>
                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 How to Cancel</h3>
                <p class="text-gray-700 mb-4">You can cancel your Premium subscription anytime:</p>
                <ol class="list-decimal pl-6 text-gray-700 mb-4">
                    <li>Log in to your account</li>
                    <li>Go to Dashboard → Subscription Settings</li>
                    <li>Click "Cancel Subscription"</li>
                    <li>Or email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a></li>
                </ol>

                <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 What Happens After Cancellation</h3>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Automatic renewal will stop</li>
                    <li>You retain Premium access until the end of your billing period</li>
                    <li>After expiry, you'll be downgraded to the Free plan</li>
                    <li>Your poems will remain published (subject to Free plan limits)</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Non-Refundable Circumstances</h2>
                <p class="text-gray-700 mb-4">
                    Refunds will <strong>NOT</strong> be issued in the following cases:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>After the 7-day money-back guarantee period</li>
                    <li>Account suspension/termination due to Terms of Service violations</li>
                    <li>Unauthorized charges (report to your payment provider)</li>
                    <li>Change of mind after 7 days</li>
                    <li>Failure to use the service</li>
                    <li>Technical issues on your end (browser, device, internet)</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Unauthorized Charges</h2>
                <p class="text-gray-700 mb-4">
                    If you notice unauthorized charges on your account:
                </p>
                <ol class="list-decimal pl-6 text-gray-700 mb-4">
                    <li>Contact us immediately at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a></li>
                    <li>Change your password immediately</li>
                    <li>Report to your payment provider</li>
                </ol>
                <p class="text-gray-700 mb-4">
                    We will investigate and resolve the issue promptly. For verified unauthorized charges, we will issue a full refund.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Service Interruptions</h2>
                <p class="text-gray-700 mb-4">
                    In case of extended service interruptions (24+ hours) caused by us:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>We may offer prorated refunds or account credits</li>
                    <li>Scheduled maintenance does not qualify</li>
                    <li>Issues beyond our control (hosting provider, internet outages) do not qualify</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Promotional Offers</h2>
                <p class="text-gray-700 mb-4">
                    Special promotional pricing or discounts:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Are subject to the same refund policy</li>
                    <li>Refunds are based on the amount paid, not regular price</li>
                    <li>May have additional terms specified at time of purchase</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Fair Use Policy</h2>
                <p class="text-gray-700 mb-4">
                    We reserve the right to deny refunds if we detect:
                </p>
                <ul class="list-disc pl-6 text-gray-700 mb-4">
                    <li>Repeated subscription and refund requests (refund abuse)</li>
                    <li>Multiple accounts requesting refunds</li>
                    <li>Fraudulent activity or payment disputes</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact for Refunds</h2>
                <div class="bg-blue-50 rounded-lg p-6 mt-4">
                    <p class="text-gray-700 mb-4">
                        <strong>For all refund-related inquiries, contact:</strong>
                    </p>
                    <p class="text-gray-700">
                        <i class="fas fa-envelope mr-2 text-blue-600"></i>
                        <strong>Email:</strong> <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a>
                    </p>
                    <p class="text-gray-700 mt-2">
                        <i class="fas fa-clock mr-2 text-blue-600"></i>
                        <strong>Response Time:</strong> Within 24-48 hours
                    </p>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
                <p class="text-gray-700 mb-4">
                    We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the service after changes constitutes acceptance.
                </p>
            </div>
        </div>

        <footer class="bg-gray-900 text-white mt-16 py-8">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2026 Poetry Platform. All rights reserved.</p>
                <div class="mt-4 space-x-4">
                    <a href="/privacy-policy" class="text-gray-400 hover:text-white">Privacy Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/terms-of-service" class="text-gray-400 hover:text-white">Terms of Service</a>
                    <span class="text-gray-600">|</span>
                    <a href="/refund-policy" class="text-gray-400 hover:text-white">Refund Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/faq" class="text-gray-400 hover:text-white">FAQ</a>
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
        <title>FAQ - Poetry Platform</title>
        <meta name="google-adsense-account" content="ca-pub-8929399363373996">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script src="/static/theme.js"></script>
    </head>
    <body class="bg-gray-50">
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-feather-alt text-blue-600 text-2xl"></i>
                        <h1 class="text-xl font-bold text-gray-900">कविता व्यासपीठ</h1>
                    </div>
                    <a href="/" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions (FAQ)</h1>
            <div class="space-y-6">
                <!-- General Questions -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-question-circle text-blue-600 mr-2"></i>General Questions
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">What is Poetry Platform?</h3>
                            <p class="text-gray-700">
                                Poetry Platform is a multilingual poetry sharing website where poets can write, publish, and share their poems in Marathi, Hindi, and English. We support featured poets, poetry anthologies, and a vibrant community.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Is it free to use?</h3>
                            <p class="text-gray-700">
                                Yes! We offer a free plan that allows you to publish up to 10 poems with basic features. For unlimited poems and advanced features, we offer a Premium plan at $4.66/year.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">What languages are supported?</h3>
                            <p class="text-gray-700">
                                We support three languages: English, Marathi (मराठी), and Hindi (हिंदी). Our editor includes special support for Devanagari script with multiple input methods.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Subscription & Pricing -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-credit-card text-green-600 mr-2"></i>Subscription & Pricing
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How much does Premium cost?</h3>
                            <p class="text-gray-700">
                                Premium costs $4.66 per year (less than $0.40/month). This includes unlimited poems, advanced editor features, real-time transliteration, and featured poet opportunities.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
                            <p class="text-gray-700">
                                We accept all major payment methods including credit/debit cards, UPI, net banking, and digital wallets through our secure payment processor Razorpay.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Is my payment information secure?</h3>
                            <p class="text-gray-700">
                                Yes! All payments are processed through industry-standard secure payment gateways (Razorpay/Stripe). We never store your complete credit card information on our servers.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I upgrade to Premium?</h3>
                            <p class="text-gray-700">
                                After logging in, click "Go Featured" or visit your Dashboard → Subscription. Choose your plan and complete the payment process. Your account will be upgraded immediately.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Refunds & Cancellation -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-undo text-orange-600 mr-2"></i>Refunds & Cancellation
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I get a refund?</h3>
                            <p class="text-gray-700">
                                Yes! We offer a 7-day money-back guarantee. If you're not satisfied within the first 7 days, email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a> for a full refund.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I cancel my subscription?</h3>
                            <p class="text-gray-700">
                                You can cancel anytime from Dashboard → Subscription Settings. After cancellation, you'll retain Premium access until the end of your billing period.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">What happens after I cancel?</h3>
                            <p class="text-gray-700">
                                After your current billing period ends, you'll be downgraded to the Free plan. Your poems remain published but are subject to Free plan limits (10 poems maximum).
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I get a refund after 7 days?</h3>
                            <p class="text-gray-700">
                                No, refunds are only available within the 7-day money-back guarantee period. After that, you can cancel to prevent future charges, but no refund for used time.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How long does a refund take?</h3>
                            <p class="text-gray-700">
                                Refunds are processed within 2-3 business days. Depending on your bank, it may take an additional 5-10 business days for the amount to appear in your account.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Writing & Publishing -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-pen text-purple-600 mr-2"></i>Writing & Publishing
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I write in Marathi/Hindi?</h3>
                            <p class="text-gray-700">
                                Our editor includes multiple input methods: Google Input Tools, Pramukh IME support, and real-time transliteration (Premium feature). Choose your preferred method and start typing!
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Do I retain copyright of my poems?</h3>
                            <p class="text-gray-700">
                                Yes! You retain full copyright ownership. However, by publishing on our platform, you grant us rights to display your work and include it in anthologies. See our Terms of Service for details.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I edit or delete my poems?</h3>
                            <p class="text-gray-700">
                                Yes! You can edit or delete your poems anytime from your Dashboard. Deleted poems are removed from public view immediately.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">What is the poem limit on Free plan?</h3>
                            <p class="text-gray-700">
                                Free users can publish up to 10 poems. To publish more, upgrade to Premium for unlimited poems.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Anthologies -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-book text-red-600 mr-2"></i>Anthologies
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">What are poetry anthologies?</h3>
                            <p class="text-gray-700">
                                We compile the best poems from our platform into paid anthologies (print or digital). These anthologies are sold to readers and help promote poets' work.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Will I be paid if my poem is included?</h3>
                            <p class="text-gray-700">
                                While we don't pay individual poets for anthology inclusion, being featured in an anthology provides valuable exposure and promotion for your work.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How are poems selected for anthologies?</h3>
                            <p class="text-gray-700">
                                Our editorial team selects poems based on quality, engagement (likes, ratings), and thematic fit. Premium members have higher chances of selection.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Account & Security -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-shield-alt text-indigo-600 mr-2"></i>Account & Security
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I reset my password?</h3>
                            <p class="text-gray-700">
                                Click "Forgot Password" on the login page, enter your email, and we'll send you reset instructions. Or contact us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a>.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Is my personal information safe?</h3>
                            <p class="text-gray-700">
                                Yes! We use industry-standard encryption, secure servers, and follow best practices for data protection. See our Privacy Policy for details.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Can I delete my account?</h3>
                            <p class="text-gray-700">
                                Yes. Contact us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a> to request account deletion. This action is permanent and cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Contact & Support -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-headset text-teal-600 mr-2"></i>Contact & Support
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">How do I contact support?</h3>
                            <p class="text-gray-700">
                                Email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a>. We respond within 24-48 hours. Premium members get priority support.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">I found a bug. Where do I report it?</h3>
                            <p class="text-gray-700">
                                Please email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a> with details about the issue, including your browser, device, and steps to reproduce.
                            </p>
                        </div>
                        
                        <div class="border-b pb-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Do you have a mobile app?</h3>
                            <p class="text-gray-700">
                                Not yet, but our website is fully responsive and works great on mobile browsers. A dedicated mobile app is on our roadmap!
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Still Have Questions? -->
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 text-white text-center">
                    <h2 class="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p class="mb-6">We're here to help! Contact us anytime.</p>
                    <a href="mailto:heyshabdly@gmail.com" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
                        <i class="fas fa-envelope mr-2"></i>Email Us
                    </a>
                </div>
            </div>
        </div>

        <footer class="bg-gray-900 text-white mt-16 py-8">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© 2026 Poetry Platform. All rights reserved.</p>
                <div class="mt-4 space-x-4">
                    <a href="/privacy-policy" class="text-gray-400 hover:text-white">Privacy Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/terms-of-service" class="text-gray-400 hover:text-white">Terms of Service</a>
                    <span class="text-gray-600">|</span>
                    <a href="/refund-policy" class="text-gray-400 hover:text-white">Refund Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="/faq" class="text-gray-400 hover:text-white">FAQ</a>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `);
});

export default app;
