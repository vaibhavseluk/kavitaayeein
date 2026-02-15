import { Hono } from 'hono';
import type { Env } from '../../lib/types';
import { createPageTemplate, getBreadcrumbs, getPageNavigation, getNavigation, getFooter, goToTopButton, sharedStyles, getLogo } from '../../lib/components';

const pages = new Hono<{ Bindings: Env }>();

// Help Center Page
pages.get('/help', async (c) => {
  // Fetch knowledge base articles
  try {
    const articles = await c.env.DB.prepare(`
      SELECT id, title, slug, category, excerpt, views
      FROM knowledge_base
      WHERE published = 1
      ORDER BY category, views DESC
    `).all();

    const categories = ['Getting Started', 'Translation Management', 'Optimization & Quality'];
    const articlesByCategory: any = {};
    categories.forEach(cat => articlesByCategory[cat] = []);
    
    articles.results?.forEach((article: any) => {
      if (articlesByCategory[article.category]) {
        articlesByCategory[article.category].push(article);
      }
    });

    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Help Center', href: '/help' }
    ];

    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Help Center - Shabdly</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <link href="/static/global.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
      </head>
      <body class="bg-gray-50">
          ${getNavigation()}
          ${getBreadcrumbs(breadcrumbs)}

          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
              <div class="max-w-7xl mx-auto px-4 text-center">
                  <h1 class="text-4xl font-bold text-white mb-4">Help Center</h1>
                  <p class="text-xl text-blue-100 mb-6">
                      Find guides, tutorials, and documentation to get the most out of Shabdly
                  </p>
                  
                  <!-- Search Bar -->
                  <div class="max-w-2xl mx-auto">
                      <div class="relative">
                          <input 
                              type="text" 
                              id="searchInput"
                              placeholder="Search for help articles..."
                              class="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                          <button 
                              onclick="searchArticles()"
                              class="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                              <i class="fas fa-search"></i> Search
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Content -->
          <div class="max-w-7xl mx-auto px-4 py-12">
              <!-- Popular Articles -->
              <div class="mb-12">
                  <h2 class="text-2xl font-bold text-gray-900 mb-6">
                      <i class="fas fa-fire text-orange-500 mr-2"></i>
                      Popular Articles
                  </h2>
                  <div id="popularArticles" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div class="text-center text-gray-500 py-8">Loading...</div>
                  </div>
              </div>

              <!-- Categories -->
              ${categories.map(category => `
                <div class="mb-12">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">
                        <i class="fas fa-${getCategoryIcon(category)} text-blue-600 mr-2"></i>
                        ${category}
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${(articlesByCategory[category] || []).map((article: any) => `
                          <a href="/help/${article.slug}" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
                              <h3 class="text-lg font-semibold text-gray-900 mb-2">${article.title}</h3>
                              <p class="text-sm text-gray-600 mb-3">${article.excerpt || 'Click to read more...'}</p>
                              <div class="flex items-center text-sm text-gray-500">
                                  <i class="fas fa-eye mr-1"></i>
                                  <span>${article.views} views</span>
                              </div>
                          </a>
                        `).join('')}
                    </div>
                </div>
              `).join('')}

              <!-- Search Results (hidden by default) -->
              <div id="searchResults" class="hidden">
                  <h2 class="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
                  <div id="searchResultsContainer"></div>
              </div>

              <!-- Quick Links -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mt-12">
                  <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Still need help?</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <a href="/faq" class="block bg-white p-6 rounded-lg text-center hover:shadow-lg transition">
                          <i class="fas fa-question-circle text-blue-600 text-4xl mb-3"></i>
                          <h3 class="font-bold text-gray-900 mb-2">FAQ</h3>
                          <p class="text-sm text-gray-600">Common questions and answers</p>
                      </a>
                      <a href="/contact" class="block bg-white p-6 rounded-lg text-center hover:shadow-lg transition">
                          <i class="fas fa-envelope text-green-600 text-4xl mb-3"></i>
                          <h3 class="font-bold text-gray-900 mb-2">Contact Support</h3>
                          <p class="text-sm text-gray-600">Email us for help</p>
                      </a>
                      <a href="/dashboard" class="block bg-white p-6 rounded-lg text-center hover:shadow-lg transition">
                          <i class="fas fa-tachometer-alt text-purple-600 text-4xl mb-3"></i>
                          <h3 class="font-bold text-gray-900 mb-2">Dashboard</h3>
                          <p class="text-sm text-gray-600">Access your account</p>
                      </a>
                  </div>
              </div>
          </div>

          ${getFooter()}
          ${goToTopButton}
          
          <script src="/static/global.js"></script>
          <script>
              // Load popular articles
              async function loadPopularArticles() {
                  try {
                      const response = await axios.get('/api/knowledge/popular?limit=3');
                      const articles = response.data.articles;
                      
                      const container = document.getElementById('popularArticles');
                      if (articles.length === 0) {
                          container.innerHTML = '<p class="text-gray-500 text-center col-span-3">No articles found</p>';
                          return;
                      }
                      
                      container.innerHTML = articles.map(article => \`
                          <a href="/help/\${article.slug}" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-2 border-yellow-200">
                              <div class="flex items-center mb-3">
                                  <i class="fas fa-star text-yellow-500 mr-2"></i>
                                  <span class="text-sm font-semibold text-gray-600">\${article.views} views</span>
                              </div>
                              <h3 class="text-lg font-semibold text-gray-900 mb-2">\${article.title}</h3>
                              <p class="text-sm text-gray-600">\${article.excerpt || 'Click to read more...'}</p>
                          </a>
                      \`).join('');
                  } catch (error) {
                      console.error('Error loading popular articles:', error);
                  }
              }

              // Search articles
              async function searchArticles() {
                  const query = document.getElementById('searchInput').value.trim();
                  if (!query || query.length < 2) {
                      alert('Please enter at least 2 characters to search');
                      return;
                  }

                  try {
                      const response = await axios.get(\`/api/knowledge/search?q=\${encodeURIComponent(query)}\`);
                      const results = response.data.results;
                      
                      const resultsSection = document.getElementById('searchResults');
                      const resultsContainer = document.getElementById('searchResultsContainer');
                      
                      resultsSection.classList.remove('hidden');
                      
                      if (results.length === 0) {
                          resultsContainer.innerHTML = '<p class="text-gray-500">No articles found matching your search.</p>';
                          return;
                      }
                      
                      resultsContainer.innerHTML = \`
                          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              \${results.map(article => \`
                                  <a href="/help/\${article.slug}" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
                                      <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">\${article.category}</span>
                                      <h3 class="text-lg font-semibold text-gray-900 mb-2">\${article.title}</h3>
                                      <p class="text-sm text-gray-600">\${article.excerpt || 'Click to read more...'}</p>
                                  </a>
                              \`).join('')}
                          </div>
                      \`;
                      
                      // Scroll to results
                      resultsSection.scrollIntoView({ behavior: 'smooth' });
                  } catch (error) {
                      console.error('Search error:', error);
                      alert('Search failed. Please try again.');
                  }
              }

              // Enter key support for search
              document.getElementById('searchInput').addEventListener('keypress', function(e) {
                  if (e.key === 'Enter') {
                      searchArticles();
                  }
              });

              // Load popular articles on page load
              loadPopularArticles();
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Help center error:', error);
    return c.html('<h1>Error loading help center</h1>', 500);
  }
});

// Individual Article Page
pages.get('/help/:slug', async (c) => {
  const slug = c.req.param('slug');
  
  try {
    const response = await c.env.DB.prepare(`
      SELECT id, title, slug, category, content, views, helpful_count, not_helpful_count
      FROM knowledge_base
      WHERE slug = ? AND published = 1
    `).bind(slug).first<any>();

    if (!response) {
      return c.html('<h1>Article not found</h1>', 404);
    }

    // Increment view count
    await c.env.DB.prepare(`
      UPDATE knowledge_base SET views = views + 1 WHERE id = ?
    `).bind(response.id).run();

    // Get related articles
    const relatedArticles = await c.env.DB.prepare(`
      SELECT id, title, slug, excerpt
      FROM knowledge_base
      WHERE category = ? AND id != ? AND published = 1
      ORDER BY views DESC
      LIMIT 3
    `).bind(response.category, response.id).all();

    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Help Center', href: '/help' },
      { label: response.title, href: `/help/${slug}` }
    ];

    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${response.title} - Shabdly Help</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <link href="/static/global.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
      </head>
      <body class="bg-gray-50">
          ${getNavigation()}
          ${getBreadcrumbs(breadcrumbs)}

          <!-- Content -->
          <div class="max-w-4xl mx-auto px-4 py-12">
              <!-- Article -->
              <article class="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <div class="mb-6">
                      <span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded mb-3">${response.category}</span>
                      <h1 class="text-4xl font-bold text-gray-900 mb-4">${response.title}</h1>
                      <div class="flex items-center text-sm text-gray-500">
                          <i class="fas fa-eye mr-1"></i>
                          <span>${response.views + 1} views</span>
                      </div>
                  </div>

                  <!-- Article Content -->
                  <div class="prose prose-lg max-w-none">
                      ${response.content}
                  </div>

                  <!-- Feedback -->
                  <div class="mt-12 pt-8 border-t border-gray-200">
                      <h3 class="text-lg font-semibold text-gray-900 mb-4">Was this article helpful?</h3>
                      <div class="flex items-center space-x-4">
                          <button 
                              onclick="voteFeedback(${response.id}, true)"
                              class="flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-3 rounded-lg hover:bg-green-200 transition">
                              <i class="fas fa-thumbs-up"></i>
                              <span>Yes</span>
                              <span id="helpfulCount" class="font-bold">(${response.helpful_count})</span>
                          </button>
                          <button 
                              onclick="voteFeedback(${response.id}, false)"
                              class="flex items-center space-x-2 bg-red-100 text-red-700 px-6 py-3 rounded-lg hover:bg-red-200 transition">
                              <i class="fas fa-thumbs-down"></i>
                              <span>No</span>
                              <span id="notHelpfulCount" class="font-bold">(${response.not_helpful_count})</span>
                          </button>
                      </div>
                  </div>
              </article>

              <!-- Related Articles -->
              ${relatedArticles.results && relatedArticles.results.length > 0 ? `
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${relatedArticles.results.map((article: any) => `
                          <a href="/help/${article.slug}" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
                              <h3 class="text-lg font-semibold text-gray-900 mb-2">${article.title}</h3>
                              <p class="text-sm text-gray-600">${article.excerpt || 'Click to read more...'}</p>
                          </a>
                        `).join('')}
                    </div>
                </div>
              ` : ''}

              <!-- Still need help -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
                  <p class="text-gray-700 mb-4">Contact our support team for personalized assistance</p>
                  <a href="/contact" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                      Contact Support
                  </a>
              </div>
          </div>

          ${getFooter()}
          ${goToTopButton}
          
          <script src="/static/global.js"></script>
          <script>
              async function voteFeedback(articleId, helpful) {
                  try {
                      const response = await axios.post(\`/api/knowledge/\${articleId}/helpful\`, {
                          helpful: helpful
                      });
                      
                      if (response.data.counts) {
                          document.getElementById('helpfulCount').textContent = \`(\${response.data.counts.helpful})\`;
                          document.getElementById('notHelpfulCount').textContent = \`(\${response.data.counts.notHelpful})\`;
                      }
                      
                      alert(response.data.message || 'Thank you for your feedback!');
                  } catch (error) {
                      console.error('Feedback error:', error);
                      alert('Failed to submit feedback. Please try again.');
                  }
              }
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Article error:', error);
    return c.html('<h1>Error loading article</h1>', 500);
  }
});

function getCategoryIcon(category: string): string {
  const icons: any = {
    'Getting Started': 'rocket',
    'Translation Management': 'cog',
    'Optimization & Quality': 'chart-line'
  };
  return icons[category] || 'book';
}

// Terms of Service Page
pages.get('/terms', (c) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Terms of Service', href: '/terms' }
  ];

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terms of Service - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/global.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        ${getNavigation()}
        ${getBreadcrumbs(breadcrumbs)}

        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p class="text-gray-600 mb-8">Effective Date: January 31, 2026</p>
            
            <div class="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                    <p class="font-bold text-gray-900 mb-2">⚠️ IMPORTANT DISCLAIMER</p>
                    <p class="text-sm text-gray-700">
                        Shabdly provides AI-powered translations. While we strive for quality, <strong>we do not guarantee 100% accuracy</strong>. 
                        You are responsible for reviewing all translations before use. See Section 4 for complete liability disclaimers.
                    </p>
                </div>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By using Shabdly.online ("Service"), you agree to these Terms of Service. If you do not agree, do not use the Service.
                </p>

                <h2>2. Service Description</h2>
                <p>
                    Shabdly provides AI-powered translation services for e-commerce product listings from English to 12+ Indian regional languages.
                </p>

                <h2>3. User Accounts</h2>
                <ul>
                    <li>You must be at least 18 years old</li>
                    <li>You must provide accurate registration information</li>
                    <li>You are responsible for account security</li>
                    <li>You are responsible for all activities under your account</li>
                </ul>

                <h2>4. Translation Accuracy and Liability Disclaimer</h2>
                <div class="bg-red-50 border-l-4 border-red-500 p-6 my-6">
                    <h3 class="text-red-900 font-bold">NO GUARANTEE OF ACCURACY</h3>
                    <p class="text-red-800">
                        <strong>WE EXPRESSLY DISCLAIM ALL WARRANTIES REGARDING TRANSLATION ACCURACY, COMPLETENESS, OR SUITABILITY.</strong>
                    </p>
                    <p class="mt-4 text-red-800 font-semibold">YOU ACKNOWLEDGE AND AGREE THAT:</p>
                    <ul class="text-red-800">
                        <li><strong>You are solely responsible</strong> for reviewing and verifying all translations</li>
                        <li><strong>We do not guarantee</strong> grammatical correctness, cultural appropriateness, or marketplace compliance</li>
                        <li><strong>You assume all risk</strong> from using AI-generated translations without independent verification</li>
                        <li><strong>We are not liable</strong> for translation errors, customer complaints, or marketplace penalties</li>
                    </ul>
                </div>

                <h2>5. Limitation of Liability</h2>
                <div class="bg-gray-50 p-6 my-6">
                    <p class="font-bold text-gray-900 mb-4">TO THE FULLEST EXTENT PERMITTED BY LAW:</p>
                    <ul>
                        <li><strong>Maximum Liability:</strong> Our total liability is limited to the amount you paid in the past 6 months</li>
                        <li><strong>No Indirect Damages:</strong> We are not liable for lost profits, revenue, business opportunities, or reputation damage</li>
                        <li><strong>No Business Losses:</strong> We are not responsible for marketplace penalties, account suspensions, or sales declines</li>
                        <li><strong>No Third-Party Actions:</strong> We are not liable for customer disputes, platform actions, or regulatory penalties</li>
                    </ul>
                </div>

                <h2>6. User Obligations</h2>
                <p>You must:</p>
                <ul>
                    <li>Only translate content you have legal rights to</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Not upload illegal, harmful, or infringing content</li>
                    <li>Not reverse engineer or resell our services</li>
                    <li>Not abuse the Service through excessive usage</li>
                </ul>

                <h2>7. Pricing and Payments</h2>
                <ul>
                    <li><strong>Free Plan:</strong> 1,000 words/month</li>
                    <li><strong>Starter:</strong> $19/month - 10,000 words</li>
                    <li><strong>Growth:</strong> $49/month - 100,000 words</li>
                    <li><strong>Scale:</strong> $149/month - 500,000 words + API</li>
                </ul>
                <p class="mt-4">
                    Payments processed via Stripe and Razorpay. Subscriptions auto-renew unless canceled. Prices subject to change with 30 days' notice.
                </p>

                <h2>8. Refund Policy</h2>
                <ul>
                    <li><strong>Non-Refundable:</strong> Word credits used for completed translations are non-refundable</li>
                    <li><strong>Technical Errors:</strong> Credits refunded for system failures, garbled output, or processing errors (within 7 days, 48-hour review)</li>
                    <li><strong>Subscription Cancellation:</strong> No refunds for partial months; unused credits expire at cycle end</li>
                </ul>
                <p class="mt-4">
                    Submit refund requests through your dashboard. See <a href="/refund-policy" class="text-blue-600 hover:underline">Refund Policy</a> for details.
                </p>

                <h2>9. Intellectual Property</h2>
                <ul>
                    <li><strong>Your Content:</strong> You retain ownership; we have a limited license to process translations</li>
                    <li><strong>Our Platform:</strong> All Shabdly software, designs, and algorithms are our property</li>
                    <li><strong>Translated Output:</strong> You own the translations; we may use anonymized data to improve models</li>
                </ul>

                <h2>10. Data Privacy</h2>
                <p>
                    We collect account info, payment data, and product content solely to provide the Service. Data is encrypted in transit and 
                    complies with Indian Digital Personal Data Protection (DPDP) Act. See <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>

                <h2>11. Service Availability</h2>
                <p>
                    We strive for 99.9% uptime but do not guarantee uninterrupted access. We may modify, suspend, or discontinue features with notice.
                </p>

                <h2>12. Termination</h2>
                <ul>
                    <li><strong>By You:</strong> Cancel anytime through dashboard; no refunds for unused credits</li>
                    <li><strong>By Us:</strong> We may terminate accounts for Terms violations, payment failures, or abusive activity</li>
                    <li><strong>Effect:</strong> Access revoked immediately; liability disclaimers survive termination</li>
                </ul>

                <h2>13. Indemnification</h2>
                <p>
                    You agree to indemnify Shabdly from claims arising from your use/misuse of the Service, Terms violations, 
                    or content you upload.
                </p>

                <h2>14. Dispute Resolution</h2>
                <ul>
                    <li><strong>Governing Law:</strong> Laws of India</li>
                    <li><strong>Jurisdiction:</strong> Courts in Nagpur, Maharashtra, India</li>
                    <li><strong>Arbitration:</strong> Disputes resolved through good-faith negotiation, then binding arbitration</li>
                    <li><strong>Class Action Waiver:</strong> Disputes resolved individually, not in class actions</li>
                </ul>

                <h2>15. Miscellaneous</h2>
                <ul>
                    <li>These Terms constitute the entire agreement</li>
                    <li>Invalid provisions severed; remaining provisions remain in effect</li>
                    <li>No waiver of rights by non-enforcement</li>
                    <li>We may update Terms with notice to users</li>
                </ul>

                <h2>16. Contact</h2>
                <p>
                    <strong>Email:</strong> heyshabdly@gmail.com<br/>
                    <strong>Registered Office:</strong> Nagpur, Maharashtra, India
                </p>

                <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
                    <p class="font-bold text-blue-900">ACKNOWLEDGMENT</p>
                    <p class="text-blue-800">
                        BY USING SHABDLY, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS, 
                        INCLUDING THE LIABILITY DISCLAIMERS IN SECTIONS 4 AND 5.
                    </p>
                </div>
            </div>
        </div>

        ${getFooter()}
        ${goToTopButton}
        <script src="/static/global.js"></script>
    </body>
    </html>
  `);
});

// Privacy Policy Page
pages.get('/privacy', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <a href="/" class="flex items-center" title="Go to Home">
                        <img src="/static/shabdly-logo.png" alt="Shabdly.online Logo" style="height: 35px; width: auto; max-width: 180px; object-fit: contain;">
                    </a>
                    <a href="/" class="text-blue-600 hover:text-blue-700 flex items-center">
                        <i class="fas fa-home mr-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </nav>

        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p class="text-gray-600 mb-8">Effective Date: January 31, 2026</p>
            
            <div class="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
                <h2>1. Introduction</h2>
                <p>
                    Shabdly.online ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains 
                    how we collect, use, and safeguard your information when you use our e-commerce translation service.
                </p>

                <h2>2. Information We Collect</h2>
                
                <h3>2.1 Account Information</h3>
                <ul>
                    <li>Email address</li>
                    <li>Name and company name</li>
                    <li>Phone number (optional)</li>
                    <li>Subscription plan details</li>
                </ul>

                <h3>2.2 Payment Information</h3>
                <p>
                    Payment data is collected and processed by our secure third-party processors:
                </p>
                <ul>
                    <li><strong>Stripe:</strong> For international card payments</li>
                    <li><strong>Razorpay:</strong> For UPI, cards, and net banking in India</li>
                </ul>
                <p class="bg-blue-50 p-4 rounded">
                    <strong>Important:</strong> We do NOT store complete credit card numbers on our servers. 
                    Payment processors handle all sensitive financial data securely.
                </p>

                <h3>2.3 Product Data</h3>
                <ul>
                    <li>Product titles, descriptions, and metadata you upload for translation</li>
                    <li>Brand glossary terms you define</li>
                    <li>Translation history and preferences</li>
                </ul>

                <h3>2.4 Usage Data</h3>
                <ul>
                    <li>Word counts and credits used</li>
                    <li>Feature usage statistics</li>
                    <li>IP address and browser type</li>
                    <li>Page views and session duration</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <ul>
                    <li><strong>Provide the Service:</strong> Process translations and manage your account</li>
                    <li><strong>Process Payments:</strong> Handle subscriptions and billing</li>
                    <li><strong>Send Notifications:</strong> Service updates, usage alerts, and support communications</li>
                    <li><strong>Improve Quality:</strong> Use anonymized translation data to enhance our AI models</li>
                    <li><strong>Prevent Fraud:</strong> Detect and prevent abuse, fraud, and security threats</li>
                    <li><strong>Legal Compliance:</strong> Meet regulatory and legal obligations</li>
                </ul>

                <h2>4. How We Share Your Information</h2>
                
                <h3>4.1 We DO Share With:</h3>
                <ul>
                    <li><strong>Payment Processors:</strong> Stripe and Razorpay (for transaction processing)</li>
                    <li><strong>Cloud Infrastructure:</strong> Cloudflare (for hosting and database services)</li>
                    <li><strong>AI Service Providers:</strong> OpenAI or similar (for translation processing)</li>
                    <li><strong>Legal Authorities:</strong> When required by law or court order</li>
                </ul>

                <h3>4.2 We DO NOT Share With:</h3>
                <div class="bg-green-50 p-4 rounded">
                    <ul>
                        <li><strong>Third-party marketers:</strong> We never sell your data</li>
                        <li><strong>Competitors:</strong> Your product data remains confidential</li>
                        <li><strong>Data brokers:</strong> We don't sell to data aggregators</li>
                    </ul>
                </div>

                <h2>5. Data Security</h2>
                <p>We implement industry-standard security measures:</p>
                <ul>
                    <li><strong>Encryption:</strong> SSL/TLS for data in transit</li>
                    <li><strong>Access Controls:</strong> Restricted access to personal data</li>
                    <li><strong>Secure Storage:</strong> Cloudflare D1 database with encryption at rest</li>
                    <li><strong>Regular Audits:</strong> Security monitoring and vulnerability scanning</li>
                    <li><strong>Password Protection:</strong> Bcrypt hashing for account passwords</li>
                </ul>

                <h2>6. Data Retention</h2>
                <ul>
                    <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
                    <li><strong>Deleted Accounts:</strong> Personal data permanently deleted within 90 days</li>
                    <li><strong>Translation Cache:</strong> Stored for service optimization; anonymized after 90 days</li>
                    <li><strong>Analytics Data:</strong> Anonymized usage statistics retained indefinitely</li>
                </ul>

                <h2>7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update incorrect or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                    <li><strong>Portability:</strong> Export your data in machine-readable format</li>
                    <li><strong>Objection:</strong> Object to specific data processing activities</li>
                    <li><strong>Withdraw Consent:</strong> Revoke consent for optional data collection</li>
                </ul>
                <p class="mt-4">
                    To exercise these rights, email <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a>
                </p>

                <h2>8. Cookies and Tracking</h2>
                <p>We use cookies for:</p>
                <ul>
                    <li><strong>Authentication:</strong> Keep you logged in</li>
                    <li><strong>Preferences:</strong> Remember your settings</li>
                    <li><strong>Analytics:</strong> Understand how you use the Service</li>
                </ul>
                <p class="mt-4">
                    You can disable cookies in your browser, but this may limit functionality.
                </p>

                <h2>9. Third-Party Services</h2>
                <h3>9.1 Payment Processors</h3>
                <ul>
                    <li><strong>Stripe:</strong> <a href="https://stripe.com/privacy" class="text-blue-600">Stripe Privacy Policy</a></li>
                    <li><strong>Razorpay:</strong> <a href="https://razorpay.com/privacy/" class="text-blue-600">Razorpay Privacy Policy</a></li>
                </ul>

                <h3>9.2 Cloud Infrastructure</h3>
                <ul>
                    <li><strong>Cloudflare:</strong> <a href="https://www.cloudflare.com/privacypolicy/" class="text-blue-600">Cloudflare Privacy Policy</a></li>
                </ul>

                <h2>10. Children's Privacy</h2>
                <p>
                    Shabdly is not intended for users under 18. We do not knowingly collect information from children. 
                    If you believe a child has provided us with personal information, contact us immediately.
                </p>

                <h2>11. International Data Transfers</h2>
                <p>
                    Your data is primarily stored in India. Some service providers (e.g., Stripe, OpenAI) may process data 
                    outside India. We ensure appropriate safeguards are in place for international transfers.
                </p>

                <h2>12. Compliance</h2>
                <p>We comply with:</p>
                <ul>
                    <li><strong>Indian DPDP Act:</strong> Digital Personal Data Protection Act, 2023</li>
                    <li><strong>IT Act, 2000:</strong> Information Technology Act of India</li>
                </ul>

                <h2>13. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of significant changes via 
                    email or dashboard notification. Continued use after changes constitutes acceptance.
                </p>

                <h2>14. Contact Us</h2>
                <p>For privacy-related questions or requests:</p>
                <ul>
                    <li><strong>Email:</strong> heyshabdly@gmail.com</li>
                    <li><strong>Subject Line:</strong> "Privacy Request"</li>
                    <li><strong>Response Time:</strong> Within 7 business days</li>
                </ul>

                <div class="bg-green-50 border-l-4 border-green-500 p-6 mt-8">
                    <p class="font-bold text-green-900">Your Trust Matters</p>
                    <p class="text-green-800">
                        We take your privacy seriously. Your product data is never sold or shared with competitors. 
                        We only use it to provide the translation service you signed up for.
                    </p>
                </div>
            </div>
        </div>

        ${getFooter()}
        ${goToTopButton}
        <script src="/static/global.js"></script>
    </body>
    </html>
  `);
});

// Refund Policy Page
pages.get('/refund-policy', (c) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Refund Policy', href: '/refund-policy' }
  ];

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Policy - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/global.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    </head>
    <body class="bg-gray-50">
        ${getNavigation()}
        ${getBreadcrumbs(breadcrumbs)}

        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
            <p class="text-gray-600 mb-8">Effective Date: January 31, 2026</p>
            
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8 prose prose-lg max-w-none">
                <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                    <p class="font-bold text-blue-900">Credit-Based Translation Service</p>
                    <p class="text-blue-800">
                        Since translations are generated instantly using computational resources, word credits used for 
                        successfully completed translations are <strong>non-refundable</strong>.
                    </p>
                </div>

                <h2>1. Non-Refundable Services</h2>
                <p><strong>Word credits used for successfully completed translations are NON-REFUNDABLE</strong> because:</p>
                <ul>
                    <li>Translations are generated instantly using AI computational resources</li>
                    <li>The service has been rendered once translations are delivered</li>
                    <li>We cannot "take back" the processing that has been performed</li>
                    <li>This is standard practice for instant digital content delivery services</li>
                </ul>

                <h2>2. Refunds for Technical Errors</h2>
                <p>
                    You <strong>may request a credit refund</strong> (word credits added back to your account, not monetary refund) if:
                </p>
                <ul>
                    <li><strong>System Error:</strong> A platform bug results in garbled or corrupted translations</li>
                    <li><strong>Incomplete Translations:</strong> The translation job fails mid-process due to system issues</li>
                    <li><strong>HTML Tag Malformation:</strong> Our system breaks or removes HTML tags incorrectly</li>
                    <li><strong>System Downtime:</strong> Service unavailability causes job failures</li>
                </ul>

                <h3>2.1 Refund Request Process</h3>
                <ol>
                    <li><strong>Submit Request:</strong> Use the form below or your dashboard within <strong>7 days</strong> of the translation job</li>
                    <li><strong>Provide Details:</strong> Include job ID, description of the issue, and affected word count</li>
                    <li><strong>Review Period:</strong> Our team reviews within <strong>48 business hours</strong></li>
                    <li><strong>Credit Issuance:</strong> If approved, credits are added back to your account immediately</li>
                </ol>

                <h3>2.2 Refunds Will NOT Be Granted For:</h3>
                <div class="bg-red-50 p-4 rounded mb-4">
                    <ul>
                        <li>Translation quality issues (grammatical errors, cultural inappropriateness)</li>
                        <li>Dissatisfaction with tone or style choices</li>
                        <li>Changes in marketplace policies after translation</li>
                        <li>User error in file upload or language selection</li>
                        <li>Credits expired due to end of billing cycle</li>
                        <li>Translations successfully delivered (even if you didn't use them)</li>
                        <li>Marketplace rejection of translated listings</li>
                    </ul>
                </div>

                <h2>3. Subscription Cancellations</h2>
                <ul>
                    <li><strong>Cancel Anytime:</strong> No cancellation fees or penalties</li>
                    <li><strong>No Partial Refunds:</strong> No refunds for unused portion of monthly subscription</li>
                    <li><strong>Credit Expiration:</strong> Remaining word credits expire at end of billing cycle</li>
                    <li><strong>Access Continuation:</strong> Full access until end of paid period</li>
                </ul>

                <h2>4. How to Cancel Subscription</h2>
                <ol>
                    <li>Log in to your dashboard</li>
                    <li>Go to Settings → Subscription</li>
                    <li>Click "Cancel Subscription"</li>
                    <li>Confirm cancellation</li>
                </ol>
                <p class="mt-4">
                    Your subscription will not renew at the next billing date, but you retain access until then.
                </p>

                <h2>5. Payment Disputes</h2>
                <p>
                    For unauthorized charges or payment errors, contact <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a> 
                    within 30 days. Include transaction ID and details.
                </p>

                <h2>6. Contact for Refunds</h2>
                <ul>
                    <li><strong>Email:</strong> heyshabdly@gmail.com</li>
                    <li><strong>Subject Line:</strong> "Refund Request - [Your Job ID]"</li>
                    <li><strong>Response Time:</strong> 48 business hours</li>
                </ul>
            </div>

            <!-- Refund Request Form -->
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                    Submit Refund Request
                </h2>
                
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                    <p class="text-sm text-yellow-800">
                        <strong>Note:</strong> You must be logged in to submit a refund request. 
                        If you're not logged in, <a href="/dashboard" class="text-blue-600 hover:underline">login here</a>.
                    </p>
                </div>

                <form id="refundForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Translation Job ID (Optional)
                        </label>
                        <input 
                            type="text" 
                            id="jobId"
                            placeholder="e.g., 12345"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p class="text-xs text-gray-500 mt-1">
                            Find this in your translation history on the dashboard
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Reason for Refund <span class="text-red-500">*</span>
                        </label>
                        <select 
                            id="reason"
                            required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">-- Select Reason --</option>
                            <option value="technical_error">Technical Error (System Bug)</option>
                            <option value="garbled_output">Garbled or Corrupted Output</option>
                            <option value="system_failure">System Failure / Job Timeout</option>
                            <option value="other">Other Technical Issue</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Detailed Description <span class="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="description"
                            required
                            rows="5"
                            placeholder="Please describe the technical issue in detail. Include what you expected vs. what happened."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                        <p class="text-xs text-gray-500 mt-1">
                            Be as specific as possible to help us process your request quickly
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Words Affected (Optional)
                        </label>
                        <input 
                            type="number" 
                            id="wordsAffected"
                            placeholder="e.g., 500"
                            min="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p class="text-xs text-gray-500 mt-1">
                            If you know the approximate word count affected by the issue
                        </p>
                    </div>

                    <div class="flex items-center space-x-4">
                        <button 
                            type="submit"
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            <i class="fas fa-paper-plane mr-2"></i>
                            Submit Refund Request
                        </button>
                        <button 
                            type="button"
                            onclick="document.getElementById('refundForm').reset()"
                            class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                            <i class="fas fa-undo mr-2"></i>
                            Reset Form
                        </button>
                    </div>
                </form>

                <div id="formMessage" class="hidden mt-6"></div>
            </div>
        </div>

        ${getFooter()}
        ${goToTopButton}
        <script src="/static/global.js"></script>

        <script>
            document.getElementById('refundForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const jobId = document.getElementById('jobId').value.trim();
                const reason = document.getElementById('reason').value;
                const description = document.getElementById('description').value.trim();
                const wordsAffected = document.getElementById('wordsAffected').value;
                
                if (!reason || !description) {
                    alert('Please fill in all required fields');
                    return;
                }

                const messageDiv = document.getElementById('formMessage');
                messageDiv.className = 'hidden';

                try {
                    // Get auth token (this should come from your auth system)
                    const token = localStorage.getItem('authToken');
                    if (!token) {
                        messageDiv.className = 'bg-red-50 border-l-4 border-red-500 p-4';
                        messageDiv.innerHTML = \`
                            <p class="font-bold text-red-900">Authentication Required</p>
                            <p class="text-red-800">Please <a href="/dashboard" class="underline">login</a> to submit a refund request.</p>
                        \`;
                        return;
                    }

                    const response = await axios.post('/api/refunds/request', {
                        translation_job_id: jobId ? parseInt(jobId) : null,
                        reason: reason,
                        description: description,
                        words_affected: wordsAffected ? parseInt(wordsAffected) : 0
                    }, {
                        headers: {
                            'Authorization': \`Bearer \${token}\`
                        }
                    });

                    // Success
                    messageDiv.className = 'bg-green-50 border-l-4 border-green-500 p-4';
                    messageDiv.innerHTML = \`
                        <p class="font-bold text-green-900">✓ Refund Request Submitted</p>
                        <p class="text-green-800">
                            \${response.data.message || 'Your refund request has been submitted successfully. We will review it within 48 hours.'}
                        </p>
                        <p class="text-green-700 text-sm mt-2">
                            Request ID: #\${response.data.request.id}
                        </p>
                    \`;

                    // Reset form
                    document.getElementById('refundForm').reset();
                    
                } catch (error) {
                    console.error('Refund request error:', error);
                    
                    messageDiv.className = 'bg-red-50 border-l-4 border-red-500 p-4';
                    
                    if (error.response) {
                        if (error.response.status === 401) {
                            messageDiv.innerHTML = \`
                                <p class="font-bold text-red-900">Authentication Failed</p>
                                <p class="text-red-800">Please <a href="/dashboard" class="underline">login</a> to submit a refund request.</p>
                            \`;
                        } else {
                            messageDiv.innerHTML = \`
                                <p class="font-bold text-red-900">Submission Failed</p>
                                <p class="text-red-800">\${error.response.data.error || 'An error occurred while submitting your request.'}</p>
                            \`;
                        }
                    } else {
                        messageDiv.innerHTML = \`
                            <p class="font-bold text-red-900">Network Error</p>
                            <p class="text-red-800">Please check your internet connection and try again.</p>
                        \`;
                    }
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Documentation Page
pages.get('/documentation', async (c) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Documentation', href: '/documentation' }
  ];

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Documentation - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/global.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        ${getNavigation('Documentation')}
        ${getBreadcrumbs(breadcrumbs)}

        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h1 class="text-4xl font-bold text-white mb-4">
                    <i class="fas fa-book mr-3"></i>
                    Documentation
                </h1>
                <p class="text-xl text-blue-100">
                    Complete guide to using Shabdly for e-commerce translation
                </p>
            </div>
        </div>

        <!-- Documentation Content -->
        <div class="max-w-7xl mx-auto px-4 py-12">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h3 class="font-bold text-gray-900 mb-4">Quick Links</h3>
                        <nav class="space-y-2">
                            <a href="#getting-started" class="block text-blue-600 hover:text-blue-800 transition">
                                <i class="fas fa-rocket mr-2"></i>Getting Started
                            </a>
                            <a href="#file-upload" class="block text-gray-600 hover:text-blue-600 transition">
                                <i class="fas fa-file-upload mr-2"></i>File Upload
                            </a>
                            <a href="#languages" class="block text-gray-600 hover:text-blue-600 transition">
                                <i class="fas fa-language mr-2"></i>Languages
                            </a>
                            <a href="#glossary" class="block text-gray-600 hover:text-blue-600 transition">
                                <i class="fas fa-book mr-2"></i>Glossary
                            </a>
                            <a href="#pricing" class="block text-gray-600 hover:text-blue-600 transition">
                                <i class="fas fa-dollar-sign mr-2"></i>Pricing
                            </a>
                            <a href="#api" class="block text-gray-600 hover:text-blue-600 transition">
                                <i class="fas fa-code mr-2"></i>API Reference
                            </a>
                        </nav>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="lg:col-span-3">
                    <div class="bg-white rounded-lg shadow-md p-8 space-y-12">
                        
                        <!-- Getting Started -->
                        <section id="getting-started">
                            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <i class="fas fa-rocket text-blue-600 mr-3"></i>
                                Getting Started
                            </h2>
                            
                            <div class="prose prose-lg max-w-none">
                                <p class="text-gray-700 mb-4">
                                    Welcome to Shabdly! This guide will help you translate your e-commerce product listings 
                                    into Indian regional languages quickly and efficiently.
                                </p>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Step 1: Sign Up</h3>
                                <p class="text-gray-700 mb-4">
                                    Create a free account and get <strong>1,000 free word credits</strong> to start translating immediately.
                                </p>
                                <ul class="list-disc pl-6 text-gray-700 mb-4">
                                    <li>No credit card required</li>
                                    <li>Instant access to dashboard</li>
                                    <li>Free words never expire</li>
                                </ul>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Step 2: Prepare Your File</h3>
                                <p class="text-gray-700 mb-4">
                                    Shabdly accepts CSV and Excel files. Your file should have columns for:
                                </p>
                                <ul class="list-disc pl-6 text-gray-700 mb-4">
                                    <li><strong>Product Title</strong> - The name of your product</li>
                                    <li><strong>Product Description</strong> - Detailed description with HTML tags (optional)</li>
                                    <li><strong>Bullet Points</strong> - Key features (can use HTML lists)</li>
                                </ul>
                                
                                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                                    <p class="text-sm text-gray-700">
                                        <strong>💡 Tip:</strong> HTML tags like &lt;b&gt;, &lt;li&gt;, &lt;br&gt; are preserved! 
                                        Your translations will be copy-paste ready for Amazon/Flipkart.
                                    </p>
                                </div>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Step 3: Upload & Translate</h3>
                                <ol class="list-decimal pl-6 text-gray-700 mb-4">
                                    <li>Upload your CSV/Excel file</li>
                                    <li>Select target languages (Hindi, Tamil, Telugu, etc.)</li>
                                    <li>Choose a tone preset (Formal, Bargain, Youth)</li>
                                    <li>Click "Start Translation"</li>
                                    <li>Download results in 2-5 minutes</li>
                                </ol>
                            </div>
                        </section>

                        <!-- File Upload -->
                        <section id="file-upload" class="border-t pt-12">
                            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <i class="fas fa-file-upload text-green-600 mr-3"></i>
                                File Upload Guide
                            </h2>
                            
                            <div class="prose prose-lg max-w-none">
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Supported File Formats</h3>
                                <ul class="list-disc pl-6 text-gray-700 mb-4">
                                    <li><strong>CSV (.csv)</strong> - Standard comma-separated values</li>
                                    <li><strong>Excel (.xlsx)</strong> - Microsoft Excel format</li>
                                </ul>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">File Size Limits</h3>
                                <table class="min-w-full border border-gray-300">
                                    <thead class="bg-gray-100">
                                        <tr>
                                            <th class="px-4 py-2 text-left">Plan</th>
                                            <th class="px-4 py-2 text-left">Max Products</th>
                                            <th class="px-4 py-2 text-left">Max File Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border px-4 py-2">Free</td>
                                            <td class="border px-4 py-2">100 products</td>
                                            <td class="border px-4 py-2">5 MB</td>
                                        </tr>
                                        <tr>
                                            <td class="border px-4 py-2">Starter</td>
                                            <td class="border px-4 py-2">500 products</td>
                                            <td class="border px-4 py-2">10 MB</td>
                                        </tr>
                                        <tr>
                                            <td class="border px-4 py-2">Growth</td>
                                            <td class="border px-4 py-2">2,000 products</td>
                                            <td class="border px-4 py-2">20 MB</td>
                                        </tr>
                                        <tr>
                                            <td class="border px-4 py-2">Scale</td>
                                            <td class="border px-4 py-2">10,000 products</td>
                                            <td class="border px-4 py-2">50 MB</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Sample File Structure</h3>
                                <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
product_title,product_description,bullet_points
"SwiftCook Pressure Cooker 5L","High-quality &lt;b&gt;stainless steel&lt;/b&gt; pressure cooker","&lt;li&gt;5-liter capacity&lt;/li&gt;&lt;li&gt;BIS certified&lt;/li&gt;"
"SmartPhone X-500","Latest 5G smartphone with 128GB storage","&lt;li&gt;6.5-inch display&lt;/li&gt;&lt;li&gt;48MP camera&lt;/li&gt;"
                                </pre>
                            </div>
                        </section>

                        <!-- Languages -->
                        <section id="languages" class="border-t pt-12">
                            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <i class="fas fa-language text-purple-600 mr-3"></i>
                                Supported Languages
                            </h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                                    <h3 class="font-bold text-gray-900 mb-3">
                                        <i class="fas fa-star text-yellow-500 mr-2"></i>Most Popular
                                    </h3>
                                    <ul class="space-y-2 text-gray-700">
                                        <li><strong>Hindi (हिन्दी)</strong> - 600M+ speakers</li>
                                        <li><strong>Tamil (தமிழ்)</strong> - 75M+ speakers</li>
                                        <li><strong>Telugu (తెలుగు)</strong> - 80M+ speakers</li>
                                        <li><strong>Kannada (ಕನ್ನಡ)</strong> - 45M+ speakers</li>
                                    </ul>
                                </div>
                                
                                <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                                    <h3 class="font-bold text-gray-900 mb-3">
                                        <i class="fas fa-globe text-green-600 mr-2"></i>All Languages
                                    </h3>
                                    <ul class="space-y-2 text-gray-700">
                                        <li>Bengali (বাংলা)</li>
                                        <li>Marathi (मराठी)</li>
                                        <li>Gujarati (ગુજરાતી)</li>
                                        <li>Malayalam (മലയാളം)</li>
                                        <li>Punjabi (ਪੰਜਾਬੀ)</li>
                                        <li>Odia (ଓଡ଼ିଆ)</li>
                                        <li>Assamese (অসমীয়া)</li>
                                        <li>Urdu (اردو)</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                                <p class="text-sm text-gray-700">
                                    <strong>💡 Pro Tip:</strong> Start with Hindi for the largest market reach (600M+ speakers). 
                                    Then expand to regional languages based on your target states.
                                </p>
                            </div>
                        </section>

                        <!-- Glossary -->
                        <section id="glossary" class="border-t pt-12">
                            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <i class="fas fa-book text-orange-600 mr-3"></i>
                                Brand Glossary
                            </h2>
                            
                            <div class="prose prose-lg max-w-none">
                                <p class="text-gray-700 mb-4">
                                    Protect your brand names, model numbers, and SKUs from translation using the Brand Glossary feature.
                                </p>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">How It Works</h3>
                                <ol class="list-decimal pl-6 text-gray-700 mb-4">
                                    <li>Go to Dashboard → Brand Glossary</li>
                                    <li>Add terms you want to protect (e.g., "SwiftCook", "X-500")</li>
                                    <li>These terms will remain unchanged in all translations</li>
                                </ol>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">What to Add to Glossary</h3>
                                <ul class="list-disc pl-6 text-gray-700 mb-4">
                                    <li>Brand names (e.g., "SwiftCook", "TechPro")</li>
                                    <li>Model numbers (e.g., "X-500", "Pro-2024")</li>
                                    <li>SKUs and product codes</li>
                                    <li>Technical certifications (e.g., "BIS Certified", "CE Marked")</li>
                                    <li>Trademark symbols (™, ®)</li>
                                </ul>
                                
                                <div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
                                    <p class="text-sm text-gray-700">
                                        <strong>✅ Example:</strong><br>
                                        <strong>Without Glossary:</strong> "SwiftCook Pressure Cooker" → "स्विफ्टकुक प्रेशर कुकर"<br>
                                        <strong>With Glossary:</strong> "SwiftCook Pressure Cooker" → "SwiftCook प्रेशर कुकर" ✓
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Pricing -->
                        <section id="pricing" class="border-t pt-12">
                            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <i class="fas fa-dollar-sign text-red-600 mr-3"></i>
                                Pricing & Credits
                            </h2>
                            
                            <div class="prose prose-lg max-w-none">
                                <p class="text-gray-700 mb-4">
                                    Shabdly uses a <strong>word-credit system</strong>. You pay only for words translated.
                                </p>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">How Credits Work</h3>
                                <ul class="list-disc pl-6 text-gray-700 mb-4">
                                    <li><strong>1 credit = 1 word</strong> translated</li>
                                    <li>Example: 100-word product description to 3 languages = 300 credits</li>
                                    <li>Credits never expire</li>
                                    <li>Buy more credits anytime</li>
                                </ul>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Word Counting</h3>
                                <p class="text-gray-700 mb-4">
                                    We count English words in your source text. Here's what counts:
                                </p>
                                <ul class="list-disc pl-6 text-gray-700 mb-4">
                                    <li><strong>Counted:</strong> Product titles, descriptions, bullet points</li>
                                    <li><strong>Not Counted:</strong> HTML tags (&lt;b&gt;, &lt;li&gt;), brand names in glossary</li>
                                </ul>
                                
                                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                                    <p class="text-sm text-gray-700">
                                        <strong>💡 Cost Example:</strong><br>
                                        - 500 products × 50 words average × 3 languages = 75,000 credits<br>
                                        - Growth Plan (100,000 credits for $49) = <strong>$0.00065 per word</strong><br>
                                        - Total cost: <strong>$49 for 500 products in 3 languages</strong>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- API Reference -->
                        <section id="api" class="border-t pt-12">
                            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <i class="fas fa-code text-indigo-600 mr-3"></i>
                                API Reference
                            </h2>
                            
                            <div class="prose prose-lg max-w-none">
                                <p class="text-gray-700 mb-4">
                                    <strong>Scale plan only:</strong> Integrate Shabdly directly into your workflow with our RESTful API.
                                </p>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Authentication</h3>
                                <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
POST /api/auth/login
Headers: Content-Type: application/json
Body: { "email": "user@example.com", "password": "your_password" }
Response: { "token": "jwt_token_here" }
                                </pre>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Upload Translation Job</h3>
                                <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
POST /api/translations/upload
Headers: 
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
Body:
  file: [your_csv_file]
  targetLanguages: ["hindi", "tamil", "telugu"]
  tonePreset: "formal"
Response: { "jobId": "job_123", "status": "processing" }
                                </pre>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Check Job Status</h3>
                                <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
GET /api/translations/jobs/{jobId}
Headers: Authorization: Bearer {token}
Response: { "status": "completed", "downloadUrl": "..." }
                                </pre>
                                
                                <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">Rate Limits</h3>
                                <ul class="list-disc pl-6 text-gray-700 mb-4">
                                    <li><strong>Scale Plan:</strong> 1000 requests/hour</li>
                                    <li><strong>Enterprise:</strong> Unlimited (contact us)</li>
                                </ul>
                            </div>
                        </section>

                        <!-- Support -->
                        <div class="border-t pt-12">
                            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
                                <h2 class="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h2>
                                <p class="text-gray-700 mb-6">
                                    Check our <a href="/help" class="text-blue-600 hover:underline font-semibold">Help Center</a> 
                                    or <a href="/contact" class="text-blue-600 hover:underline font-semibold">contact support</a>
                                </p>
                                <a href="/dashboard" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                    Start Translating Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        ${getFooter()}
        ${goToTopButton}
    </body>
    </html>
  `);
});

export default pages;
