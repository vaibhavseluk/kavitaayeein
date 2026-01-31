-- Comprehensive Knowledge Base for Shabdly E-commerce Translation Platform
-- All the content requested by the user

-- ===========================================
-- GETTING STARTED
-- ===========================================

-- Quick Start Guide
INSERT INTO knowledge_base (title, slug, category, excerpt, content, published) VALUES (
  'Quick Start Guide',
  'quick-start-guide',
  'Getting Started',
  'A step-by-step walkthrough on how to upload your first product CSV/Excel file and start translating in minutes.',
  '<div class="prose prose-lg max-w-none">
    <h2>Welcome to Shabdly! 🚀</h2>
    <p>Follow these simple steps to translate your first batch of product listings:</p>
    
    <h3>Step 1: Sign Up & Get 1,000 Free Words</h3>
    <ol>
      <li>Click "Get Started Free" on the homepage</li>
      <li>Enter your email, name, and company details</li>
      <li>Verify your email address</li>
      <li>Your account comes with 1,000 free words to test the platform</li>
    </ol>
    
    <h3>Step 2: Prepare Your Product File</h3>
    <p>Export your product listings from Amazon Seller Central or Flipkart:</p>
    <ul>
      <li><strong>Amazon:</strong> Inventory → Download Reports → Active Listings Report</li>
      <li><strong>Flipkart:</strong> Catalog → Download Current Listings</li>
      <li><strong>Your own store:</strong> Prepare a CSV with columns: SKU, Title, Description, Bullet Points</li>
    </ul>
    
    <h3>Step 3: Upload & Configure</h3>
    <ol>
      <li>Log in to your Shabdly dashboard</li>
      <li>Click "Upload File" → Select your CSV/Excel file</li>
      <li>Choose target languages (Hindi, Tamil, Telugu, etc.)</li>
      <li>Select your tone: <strong>Formal</strong> (luxury), <strong>Bargain</strong> (deals), or <strong>Youth</strong> (trendy)</li>
      <li>Add any brand names or SKUs to your glossary to prevent translation</li>
    </ol>
    
    <h3>Step 4: Start Translation</h3>
    <ol>
      <li>Review the word count and credits required</li>
      <li>Click "Start Translation"</li>
      <li>Wait 1-2 minutes for 500 products (progress bar shows status)</li>
    </ol>
    
    <h3>Step 5: Download & Upload to Marketplace</h3>
    <ol>
      <li>Download your translated file (same format as input)</li>
      <li>Open the file to review translations</li>
      <li>Upload to Amazon/Flipkart using their bulk upload tools</li>
      <li>Watch your regional conversions grow! 📈</li>
    </ol>
    
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
      <p class="font-bold">💡 Pro Tip:</p>
      <p>Start with one language (Hindi) for your best-selling 50 products to test. Once you see the results, scale up to all 12+ languages!</p>
    </div>
    
    <h3>Need Help?</h3>
    <p>Check our other guides:</p>
    <ul>
      <li><a href="/help/supported-file-formats" class="text-blue-600">Supported File Formats</a></li>
      <li><a href="/help/brand-glossary-setup" class="text-blue-600">Brand Glossary Setup</a></li>
      <li><a href="/help/understanding-tone-presets" class="text-blue-600">Understanding Tone Presets</a></li>
    </ul>
  </div>',
  1
);

-- Supported File Formats
INSERT INTO knowledge_base (title, slug, category, excerpt, content, published) VALUES (
  'Supported File Formats',
  'supported-file-formats',
  'Getting Started',
  'Technical specifications for .csv, .xlsx, and .json files. Learn the exact format requirements for seamless uploads.',
  '<div class="prose prose-lg max-w-none">
    <h2>Supported File Formats</h2>
    <p>Shabdly supports three main file formats for bulk product translation:</p>
    
    <h3>1. CSV Files (.csv)</h3>
    <p><strong>Best for:</strong> Amazon Seller Central exports, simple bulk uploads</p>
    
    <h4>Required Columns:</h4>
    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Column Name</th>
          <th class="border p-2">Required</th>
          <th class="border p-2">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="border p-2">SKU</td><td class="border p-2">Yes</td><td class="border p-2">Product identifier (not translated)</td></tr>
        <tr><td class="border p-2">Product Title</td><td class="border p-2">Yes</td><td class="border p-2">Main product name</td></tr>
        <tr><td class="border p-2">Description</td><td class="border p-2">Yes</td><td class="border p-2">Full product description (HTML supported)</td></tr>
        <tr><td class="border p-2">Bullet Points</td><td class="border p-2">No</td><td class="border p-2">Feature list (one per line or comma-separated)</td></tr>
        <tr><td class="border p-2">Search Terms</td><td class="border p-2">No</td><td class="border p-2">SEO keywords</td></tr>
      </tbody>
    </table>
    
    <h4>Format Requirements:</h4>
    <ul>
      <li><strong>Encoding:</strong> UTF-8 (to support Hindi/Tamil characters)</li>
      <li><strong>Delimiter:</strong> Comma (,) or pipe (|)</li>
      <li><strong>Text Qualifier:</strong> Double quotes (") for cells with commas/line breaks</li>
      <li><strong>Max File Size:</strong> 50 MB</li>
      <li><strong>Max Rows:</strong> 10,000 products per file</li>
    </ul>
    
    <h3>2. Excel Files (.xlsx)</h3>
    <p><strong>Best for:</strong> Flipkart exports, organized catalogs with multiple sheets</p>
    
    <h4>Sheet Structure:</h4>
    <ul>
      <li>Use the <strong>first sheet</strong> in your workbook</li>
      <li>Column names in <strong>Row 1</strong> (header row)</li>
      <li>Same column requirements as CSV format</li>
    </ul>
    
    <h4>Format Requirements:</h4>
    <ul>
      <li><strong>Excel Version:</strong> 2007+ (.xlsx format only, not .xls)</li>
      <li><strong>Max File Size:</strong> 50 MB</li>
      <li><strong>Max Rows:</strong> 10,000 products per sheet</li>
      <li><strong>Formula Cells:</strong> Will be converted to text values before translation</li>
      <li><strong>Formatting:</strong> Bold/italic formatting will be preserved if using HTML in cells</li>
    </ul>
    
    <h3>3. JSON Files (.json)</h3>
    <p><strong>Best for:</strong> API integrations, custom e-commerce platforms</p>
    
    <h4>Expected Structure:</h4>
    <pre class="bg-gray-100 p-4 rounded">
{
  "products": [
    {
      "sku": "SHOE-123",
      "title": "Running Shoes for Men",
      "description": "Lightweight &lt;b&gt;breathable&lt;/b&gt; running shoes...",
      "bulletPoints": ["Mesh upper", "Rubber sole", "Memory foam"],
      "searchTerms": "sports shoes running jogging"
    }
  ]
}
    </pre>
    
    <h4>Format Requirements:</h4>
    <ul>
      <li><strong>Encoding:</strong> UTF-8</li>
      <li><strong>Max File Size:</strong> 50 MB</li>
      <li><strong>Array Key:</strong> Must have "products" array at root level</li>
      <li><strong>Required Fields:</strong> sku, title, description (same as CSV)</li>
    </ul>
    
    <h3>HTML Formatting Support</h3>
    <p>All formats support HTML tags in description fields:</p>
    <ul>
      <li><code>&lt;b&gt;</code> and <code>&lt;strong&gt;</code> - Bold text</li>
      <li><code>&lt;i&gt;</code> and <code>&lt;em&gt;</code> - Italic text</li>
      <li><code>&lt;li&gt;</code> - List items</li>
      <li><code>&lt;ul&gt;</code> and <code>&lt;ol&gt;</code> - Lists</li>
      <li><code>&lt;br&gt;</code> - Line breaks</li>
      <li><code>&lt;p&gt;</code> - Paragraphs</li>
    </ul>
    
    <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
      <p class="font-bold">⚠️ Important:</p>
      <p>Always keep a backup of your original file. While we preserve formatting, marketplace upload requirements may vary.</p>
    </div>
    
    <h3>Sample Files</h3>
    <p>Download example files to understand the format:</p>
    <ul>
      <li><a href="/samples/amazon-sample.csv" class="text-blue-600">Amazon CSV Template</a></li>
      <li><a href="/samples/flipkart-sample.xlsx" class="text-blue-600">Flipkart Excel Template</a></li>
      <li><a href="/samples/api-sample.json" class="text-blue-600">JSON Template</a></li>
    </ul>
  </div>',
  1
);

-- Connecting Your Store
INSERT INTO knowledge_base (title, slug, category, excerpt, content, published) VALUES (
  'Connecting Your Store - API Integration',
  'connecting-your-store',
  'Getting Started',
  'Instructions for future API integrations or direct store connections. Automate your translation workflow.',
  '<div class="prose prose-lg max-w-none">
    <h2>Store Integration & API Access</h2>
    <p>Connect Shabdly directly to your e-commerce platform for automated translation workflows.</p>
    
    <h3>Currently Supported Integrations</h3>
    <div class="bg-blue-50 p-4 rounded mb-6">
      <p><strong>🚀 Coming Soon!</strong> Direct API integrations are currently in development. Current users on the <strong>Scale plan</strong> ($149/month) can request early API access.</p>
    </div>
    
    <h3>Planned Integrations (Q2 2026)</h3>
    <ul>
      <li><strong>Amazon Seller Central:</strong> Auto-sync product listings</li>
      <li><strong>Flipkart Seller Hub:</strong> Direct catalog sync</li>
      <li><strong>Shopify:</strong> Install our app for one-click translation</li>
      <li><strong>WooCommerce:</strong> WordPress plugin for bulk translation</li>
      <li><strong>Custom API:</strong> RESTful API for custom integrations</li>
    </ul>
    
    <h3>API Access (Scale Plan Only)</h3>
    <p>If you''re on the Scale plan ($149/month), you can access our translation API directly:</p>
    
    <h4>Authentication</h4>
    <pre class="bg-gray-100 p-4 rounded">
POST https://api.shabdly.online/v1/auth/api-key
Headers:
  Authorization: Bearer YOUR_ACCOUNT_TOKEN
    </pre>
    
    <h4>Translate Endpoint</h4>
    <pre class="bg-gray-100 p-4 rounded">
POST https://api.shabdly.online/v1/translate
Headers:
  X-API-Key: YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "source_language": "en",
  "target_languages": ["hi", "ta", "te"],
  "tone": "formal",
  "products": [
    {
      "sku": "PROD-001",
      "title": "Product Title",
      "description": "Product description..."
    }
  ]
}
    </pre>
    
    <h4>Response</h4>
    <pre class="bg-gray-100 p-4 rounded">
{
  "job_id": "job_abc123",
  "status": "processing",
  "credits_used": 250,
  "estimated_time": "2 minutes"
}
    </pre>
    
    <h3>Webhook Notifications</h3>
    <p>Receive real-time updates when translations complete:</p>
    <pre class="bg-gray-100 p-4 rounded">
POST YOUR_WEBHOOK_URL
{
  "event": "translation.completed",
  "job_id": "job_abc123",
  "status": "completed",
  "download_url": "https://api.shabdly.online/downloads/job_abc123.csv"
}
    </pre>
    
    <h3>Rate Limits</h3>
    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Plan</th>
          <th class="border p-2">API Requests/Hour</th>
          <th class="border p-2">Concurrent Jobs</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="border p-2">Free</td><td class="border p-2">N/A</td><td class="border p-2">N/A</td></tr>
        <tr><td class="border p-2">Starter</td><td class="border p-2">N/A</td><td class="border p-2">N/A</td></tr>
        <tr><td class="border p-2">Growth</td><td class="border p-2">N/A</td><td class="border p-2">N/A</td></tr>
        <tr><td class="border p-2">Scale</td><td class="border p-2">1,000</td><td class="border p-2">10</td></tr>
      </tbody>
    </table>
    
    <h3>Request API Access</h3>
    <p>To get API credentials:</p>
    <ol>
      <li>Upgrade to the Scale plan ($149/month)</li>
      <li>Email <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a> with "API Access Request"</li>
      <li>Provide your use case and estimated monthly volume</li>
      <li>Receive API key within 24 hours</li>
    </ol>
    
    <div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
      <p class="font-bold">💡 Early Adopter Benefits:</p>
      <p>First 100 API users get <strong>50% off</strong> Scale plan pricing for 6 months!</p>
    </div>
  </div>',
  1
);

-- ===========================================
-- TRANSLATION MANAGEMENT
-- ===========================================

-- Brand Glossary Setup
INSERT INTO knowledge_base (title, slug, category, excerpt, content, published) VALUES (
  'Brand Glossary Setup',
  'brand-glossary-setup',
  'Translation Management',
  'Learn how to lock brand names and specific terminology so they remain untranslated across all languages.',
  '<div class="prose prose-lg max-w-none">
    <h2>Brand Glossary - Protect Your Brand Identity</h2>
    <p>The Brand Glossary ensures your brand names, model numbers, and specific terms stay consistent across all languages.</p>
    
    <h3>Why Use a Glossary?</h3>
    <p>Without a glossary, AI might translate:</p>
    <ul>
      <li>"SwiftCook Mixer" → "तेज़ कुक मिक्सर" (brand name translated)</li>
      <li>"Model X-500" → "मॉडल एक्स-पांच सौ" (model number spelled out)</li>
      <li>"iPhone 15 Pro" → "आईफोन १५ प्रो" (inconsistent number format)</li>
    </ul>
    
    <p>With glossary protection:</p>
    <ul>
      <li>"SwiftCook Mixer" → "SwiftCook मिक्सर" ✅</li>
      <li>"Model X-500" → "Model X-500" ✅</li>
      <li>"iPhone 15 Pro" → "iPhone 15 Pro" ✅</li>
    </ul>
    
    <h3>How to Set Up Your Glossary</h3>
    
    <h4>Method 1: Add Terms Individually</h4>
    <ol>
      <li>Go to Dashboard → Brand Glossary</li>
      <li>Click "Add New Term"</li>
      <li>Enter your brand name or term (e.g., "SwiftCook")</li>
      <li>Add optional notes (e.g., "Our brand name")</li>
      <li>Click "Save"</li>
    </ol>
    
    <h4>Method 2: Bulk Upload</h4>
    <ol>
      <li>Create a CSV with one term per line:
        <pre class="bg-gray-100 p-4 rounded">
SwiftCook
X-500
AeroMax
ProFit
TechnoKing
        </pre>
      </li>
      <li>Go to Dashboard → Brand Glossary → Bulk Upload</li>
      <li>Upload your CSV file</li>
      <li>All terms are added instantly</li>
    </ol>
    
    <h3>What Should Be in Your Glossary?</h3>
    
    <h4>Always Include:</h4>
    <ul>
      <li><strong>Your Brand Name:</strong> "SwiftCook", "AeroMax"</li>
      <li><strong>Sub-brands:</strong> "SwiftCook Pro", "AeroMax Elite"</li>
      <li><strong>Model Numbers:</strong> "X-500", "Model 2024-A"</li>
      <li><strong>SKU Prefixes:</strong> "SC-", "AM-"</li>
      <li><strong>Technical Terms:</strong> "Bluetooth 5.0", "USB-C"</li>
      <li><strong>Certifications:</strong> "ISI Mark", "BIS Certified"</li>
    </ul>
    
    <h4>Optional (Context-Dependent):</h4>
    <ul>
      <li><strong>Product Line Names:</strong> "Pro Series", "Budget Line"</li>
      <li><strong>Partnerships:</strong> Competitor brands you mention</li>
      <li><strong>Slogans:</strong> "Cook Smart, Live Better" (if you want it untranslated)</li>
    </ul>
    
    <h3>Glossary Tips & Best Practices</h3>
    
    <div class="bg-blue-50 p-4 rounded mb-4">
      <p class="font-bold">✅ DO:</p>
      <ul>
        <li>Add terms BEFORE your first translation</li>
        <li>Review and update glossary monthly</li>
        <li>Use exact capitalization (case-sensitive)</li>
        <li>Include variations (e.g., "iPhone" and "I-Phone")</li>
      </ul>
    </div>
    
    <div class="bg-red-50 p-4 rounded mb-4">
      <p class="font-bold">❌ DON''T:</p>
      <ul>
        <li>Add common words ("phone", "laptop")</li>
        <li>Overuse - keep list under 100 terms</li>
        <li>Include competitor brands (unless mentioned in your listings)</li>
        <li>Add translated versions (glossary is for source language only)</li>
      </ul>
    </div>
    
    <h3>Advanced Features (Growth & Scale Plans)</h3>
    
    <h4>Custom Translations</h4>
    <p>Force specific translations for certain terms:</p>
    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">English Term</th>
          <th class="border p-2">Hindi Translation</th>
          <th class="border p-2">Tamil Translation</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="border p-2">Great Deal</td><td class="border p-2">धमाका ऑफर</td><td class="border p-2">அருமையான சலுகை</td></tr>
        <tr><td class="border p-2">Limited Stock</td><td class="border p-2">सीमित स्टॉक</td><td class="border p-2">வரையறுக்கப்பட்ட இருப்பு</td></tr>
      </tbody>
    </table>
    
    <h4>Category-Specific Glossaries</h4>
    <p>Create separate glossaries for different product categories:</p>
    <ul>
      <li><strong>Electronics:</strong> Technical specs, model numbers</li>
      <li><strong>Fashion:</strong> Fabric names, size charts</li>
      <li><strong>Food:</strong> Ingredient names, certifications</li>
    </ul>
    
    <h3>Troubleshooting</h3>
    
    <p><strong>Q: My brand name still got translated!</strong></p>
    <p>A: Check:</p>
    <ul>
      <li>Exact spelling matches your glossary</li>
      <li>No extra spaces or punctuation</li>
      <li>Case sensitivity (add multiple versions if needed)</li>
    </ul>
    
    <p><strong>Q: Can I edit glossary after translation?</strong></p>
    <p>A: Yes! Updated glossary applies to all future translations. Past jobs aren''t affected.</p>
    
    <p><strong>Q: Does glossary cost extra credits?</strong></p>
    <p>A: No! Glossary lookups are free. You only pay for words that are actually translated.</p>
  </div>',
  1
);

-- Understanding Tone Presets
INSERT INTO knowledge_base (title, slug, category, excerpt, content, published) VALUES (
  'Understanding Tone Presets',
  'understanding-tone-presets',
  'Translation Management',
  'Complete guide to selecting "Marketing/Persuasive," "Formal," or "Colloquial" styles for your target audience.',
  '<div class="prose prose-lg max-w-none">
    <h2>Tone Presets - Speak Your Customer''s Language</h2>
    <p>Shabdly offers three tone presets to match your brand voice and target audience. The right tone can increase conversions by 30-40% in regional markets!</p>
    
    <h3>The Three Tones Explained</h3>
    
    <h4>1. Formal Tone (Default)</h4>
    <p><strong>Best for:</strong> Luxury brands, professional products, B2B, electronics, healthcare</p>
    
    <div class="bg-gray-50 p-4 rounded mb-4">
      <p class="font-bold">Example:</p>
      <p><strong>English:</strong> "This premium leather wallet is handcrafted with genuine Italian leather."</p>
      <p><strong>Hindi (Formal):</strong> "यह प्रीमियम चमड़े का बटुआ असली इतालवी चमड़े से हस्तनिर्मित है।"</p>
      <p><strong>Characteristics:</strong></p>
      <ul class="text-sm">
        <li>Uses proper grammar and complete sentences</li>
        <li>Avoids slang and colloquialisms</li>
        <li>Professional terminology</li>
        <li>Neutral, respectful language</li>
      </ul>
    </div>
    
    <p><strong>When to use:</strong></p>
    <ul>
      <li>Luxury products (watches, jewelry, premium electronics)</li>
      <li>Professional services (legal, financial, medical)</li>
      <li>Corporate gifts and B2B products</li>
      <li>High-ticket items ($100+ USD)</li>
    </ul>
    
    <h4>2. Bargain/Marketing Tone</h4>
    <p><strong>Best for:</strong> Deals, discounts, flash sales, budget products, marketplaces</p>
    
    <div class="bg-yellow-50 p-4 rounded mb-4">
      <p class="font-bold">Example:</p>
      <p><strong>English:</strong> "Great deal! Limited stock available. Order now and save 50%!"</p>
      <p><strong>Hindi (Bargain):</strong> "धमाका ऑफर! सीमित स्टॉक। अभी ऑर्डर करें और 50% बचाएं!"</p>
      <p><strong>Characteristics:</strong></p>
      <ul class="text-sm">
        <li>Uses energetic, action-oriented language</li>
        <li>Regional shopping slang ("Dhamaka", "Loot", "Keka")</li>
        <li>Shorter sentences and exclamation marks</li>
        <li>Urgency and scarcity emphasis</li>
      </ul>
    </div>
    
    <p><strong>When to use:</strong></p>
    <ul>
      <li>Flash sales and limited-time offers</li>
      <li>Budget products (under $20 USD)</li>
      <li>Amazon/Flipkart listings (highly competitive)</li>
      <li>FMCG products, daily essentials</li>
      <li>Festive sales (Diwali, Holi, etc.)</li>
    </ul>
    
    <h4>3. Youth/Colloquial Tone</h4>
    <p><strong>Best for:</strong> Fashion, gadgets, lifestyle products, Gen Z/Millennial audience</p>
    
    <div class="bg-purple-50 p-4 rounded mb-4">
      <p class="font-bold">Example:</p>
      <p><strong>English:</strong> "This trendy backpack is perfect for college and weekend trips."</p>
      <p><strong>Hindi (Youth):</strong> "ये स्टाइलिश बैकपैक कॉलेज और weekend trips के लिए एकदम बढ़िया है।"</p>
      <p><strong>Characteristics:</strong></p>
      <ul class="text-sm">
        <li>Mix of Hindi and English (Hinglish)</li>
        <li>Casual, friendly language</li>
        <li>Modern slang and trendy expressions</li>
        <li>Relatable, conversational style</li>
      </ul>
    </div>
    
    <p><strong>When to use:</strong></p>
    <ul>
      <li>Fashion and lifestyle products</li>
      <li>Gaming, gadgets, tech accessories</li>
      <li>Streetwear, sneakers, trendy items</li>
      <li>Products targeting 18-35 age group</li>
      <li>Social media-driven products</li>
    </ul>
    
    <h3>Tone Comparison Chart</h3>
    <table class="min-w-full border border-gray-300 text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">English Phrase</th>
          <th class="border p-2">Formal</th>
          <th class="border p-2">Bargain</th>
          <th class="border p-2">Youth</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border p-2">Great product</td>
          <td class="border p-2">उत्कृष्ट उत्पाद</td>
          <td class="border p-2">शानदार प्रोडक्ट</td>
          <td class="border p-2">कमाल का product</td>
        </tr>
        <tr>
          <td class="border p-2">Buy now</td>
          <td class="border p-2">अभी खरीदें</td>
          <td class="border p-2">तुरंत खरीदें</td>
          <td class="border p-2">अभी grab करो</td>
        </tr>
        <tr>
          <td class="border p-2">Limited stock</td>
          <td class="border p-2">सीमित स्टॉक</td>
          <td class="border p-2">स्टॉक खत्म होने से पहले</td>
          <td class="border p-2">जल्दी करो, stock कम</td>
        </tr>
        <tr>
          <td class="border p-2">Fast delivery</td>
          <td class="border p-2">त्वरित डिलीवरी</td>
          <td class="border p-2">तेज़ डिलीवरी</td>
          <td class="border p-2">super fast delivery</td>
        </tr>
      </tbody>
    </table>
    
    <h3>How to Choose the Right Tone</h3>
    
    <h4>Ask Yourself:</h4>
    <ol>
      <li><strong>What''s my product price point?</strong>
        <ul>
          <li>$0-$20: Bargain</li>
          <li>$20-$100: Youth or Formal (depending on category)</li>
          <li>$100+: Formal</li>
        </ul>
      </li>
      <li><strong>Who is my target customer?</strong>
        <ul>
          <li>35+, affluent: Formal</li>
          <li>18-35, urban: Youth</li>
          <li>Price-conscious, deal hunters: Bargain</li>
        </ul>
      </li>
      <li><strong>What''s my brand personality?</strong>
        <ul>
          <li>Premium, sophisticated: Formal</li>
          <li>Fun, trendy, vibrant: Youth</li>
          <li>Value-driven, competitive: Bargain</li>
        </ul>
      </li>
    </ol>
    
    <h3>Advanced Tips</h3>
    
    <div class="bg-green-50 p-4 rounded mb-4">
      <p class="font-bold">💡 Pro Tips:</p>
      <ul>
        <li><strong>Mix and match:</strong> Use Bargain for titles/taglines, Formal for detailed descriptions</li>
        <li><strong>Test both:</strong> Try different tones for A/B testing (500 words each)</li>
        <li><strong>Regional preferences:</strong> South India often prefers Formal; North India responds well to Bargain</li>
        <li><strong>Seasonal adjustments:</strong> Use Bargain during sales, Formal otherwise</li>
      </ul>
    </div>
    
    <h3>Real Results from Our Customers</h3>
    <div class="bg-blue-50 p-4 rounded">
      <p><strong>Case Study 1: Electronics Seller</strong></p>
      <p>"Switched from Formal to Bargain tone during Diwali sale. Saw 45% increase in Hindi conversions!"</p>
      <p class="text-sm text-gray-600">- Rajesh K., Delhi</p>
    </div>
    
    <div class="bg-purple-50 p-4 rounded mt-4">
      <p><strong>Case Study 2: Fashion Brand</strong></p>
      <p>"Youth tone with Hinglish was perfect for our Gen Z audience. Tamil sales up 60% in 3 months."</p>
      <p class="text-sm text-gray-600">- Priya M., Chennai</p>
    </div>
    
    <h3>Can I Change Tone Later?</h3>
    <p>Yes! Simply re-upload your file with a different tone preset. Word credits will be charged again, but you can compare performance.</p>
    
    <p><strong>Need help deciding?</strong> Email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a> with your product category and target audience. We''ll recommend the best tone!</p>
  </div>',
  1
);

-- Bulk Processing
INSERT INTO knowledge_base (title, slug, category, excerpt, content, published) VALUES (
  'Bulk Processing - Managing Large Catalogs',
  'bulk-processing',
  'Translation Management',
  'Learn how to efficiently manage large catalogs with 1,000+ SKUs using batch processing and optimization strategies.',
  '<div class="prose prose-lg max-w-none">
    <h2>Bulk Processing for Large Catalogs</h2>
    <p>Translating thousands of products efficiently requires the right strategy. Here''s how to handle catalogs with 1,000+ SKUs.</p>
    
    <h3>System Limits</h3>
    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Plan</th>
          <th class="border p-2">Max Products/Upload</th>
          <th class="border p-2">Max File Size</th>
          <th class="border p-2">Processing Time</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="border p-2">Free</td><td class="border p-2">100</td><td class="border p-2">5 MB</td><td class="border p-2">~5 min</td></tr>
        <tr><td class="border p-2">Starter</td><td class="border p-2">500</td><td class="border p-2">10 MB</td><td class="border p-2">~10 min</td></tr>
        <tr><td class="border p-2">Growth</td><td class="border p-2">2,000</td><td class="border p-2">50 MB</td><td class="border p-2">~30 min</td></tr>
        <tr><td class="border p-2">Scale</td><td class="border p-2">10,000</td><td class="border p-2">50 MB</td><td class="border p-2">~2 hours</td></tr>
      </tbody>
    </table>
    
    <h3>Strategy 1: Prioritized Batches</h3>
    <p><strong>Best for:</strong> 5,000+ product catalogs</p>
    
    <h4>Step 1: Sort by Priority</h4>
    <p>Divide your catalog into tiers:</p>
    <ul>
      <li><strong>Tier 1 (Top 20%):</strong> Best sellers, high margin products → Translate first</li>
      <li><strong>Tier 2 (Next 30%):</strong> Moderate sellers → Translate second</li>
      <li><strong>Tier 3 (Bottom 50%):</strong> Slow movers → Translate last or skip</li>
    </ul>
    
    <h4>Step 2: Upload in Batches</h4>
    <ol>
      <li>Upload Tier 1 products (up to 2,000 per batch)</li>
      <li>Wait for completion (30-60 minutes)</li>
      <li>Review results and upload Tier 2</li>
      <li>Continue until complete</li>
    </ol>
    
    <h3>Strategy 2: Language Staging</h3>
    <p><strong>Best for:</strong> Testing multiple languages before full rollout</p>
    
    <h4>Phase 1: Single Language Test</h4>
    <ol>
      <li>Translate top 100 products to Hindi only</li>
      <li>Upload to marketplace and monitor for 2 weeks</li>
      <li>Check conversion rates and customer feedback</li>
    </ol>
    
    <h4>Phase 2: Expand to 3 Languages</h4>
    <ol>
      <li>If Hindi test succeeds, add Tamil and Telugu</li>
      <li>Translate same 100 products</li>
      <li>Monitor regional performance</li>
    </ol>
    
    <h4>Phase 3: Full Catalog Rollout</h4>
    <ol>
      <li>Translate entire catalog to all 12 languages</li>
      <li>Upload in batches of 2,000 products</li>
      <li>Track revenue impact by language</li>
    </ol>
    
    <h3>Strategy 3: Category-Based Processing</h3>
    <p><strong>Best for:</strong> Sellers with diverse product categories</p>
    
    <h4>Organize by Category:</h4>
    <ol>
      <li><strong>Category 1 (e.g., Electronics):</strong> Formal tone, all languages</li>
      <li><strong>Category 2 (e.g., Fashion):</strong> Youth tone, Hindi + Tamil only</li>
      <li><strong>Category 3 (e.g., Home & Kitchen):</strong> Bargain tone, Hindi + Bengali</li>
    </ol>
    
    <p>This allows you to customize tone and languages per category!</p>
    
    <h3>Optimizing File Preparation</h3>
    
    <h4>Before Upload Checklist:</h4>
    <ul>
      <li>✅ Remove duplicate SKUs</li>
      <li>✅ Delete out-of-stock products</li>
      <li>✅ Clean up formatting (remove extra spaces, line breaks)</li>
      <li>✅ Ensure all required columns are present</li>
      <li>✅ Add brand terms to glossary FIRST</li>
      <li>✅ Split large files (>2,000 rows) into multiple files</li>
    </ul>
    
    <h4>File Naming Convention:</h4>
    <pre class="bg-gray-100 p-4 rounded">
catalog_batch1_electronics_20260128.csv
catalog_batch2_fashion_20260128.csv
catalog_batch3_home_20260128.csv
    </pre>
    
    <h3>Parallel Processing (Scale Plan)</h3>
    <p>Scale plan users can run up to <strong>5 concurrent jobs</strong>:</p>
    
    <ol>
      <li>Upload 5 separate files simultaneously</li>
      <li>Each file processes independently</li>
      <li>All complete in ~30 minutes instead of 2.5 hours</li>
    </ol>
    
    <div class="bg-blue-50 p-4 rounded mb-4">
      <p class="font-bold">Example: 10,000 Product Catalog</p>
      <ul>
        <li>Split into 5 files of 2,000 products each</li>
        <li>Upload all 5 at once (Scale plan)</li>
        <li>Total time: ~30 minutes</li>
        <li>vs. Sequential upload: ~2.5 hours</li>
      </ul>
    </div>
    
    <h3>Progress Monitoring</h3>
    
    <h4>Dashboard Indicators:</h4>
    <ul>
      <li><strong>Queue Position:</strong> Your place in line</li>
      <li><strong>Processing Status:</strong> % complete (updates every 30 seconds)</li>
      <li><strong>Words Translated:</strong> Real-time credit usage</li>
      <li><strong>Errors:</strong> Failed products (downloadable error log)</li>
    </ul>
    
    <h3>Handling Errors in Bulk Jobs</h3>
    
    <h4>Common Issues:</h4>
    <ol>
      <li><strong>Malformed HTML:</strong> Unclosed tags break translation</li>
      <li><strong>Character limit exceeded:</strong> Amazon has 2,000 char limit for descriptions</li>
      <li><strong>Missing required fields:</strong> SKU or title empty</li>
    </ol>
    
    <h4>Error Recovery:</h4>
    <ol>
      <li>Download error log from job details page</li>
      <li>Fix errors in original file</li>
      <li>Create new file with only error rows</li>
      <li>Re-upload and translate</li>
      <li>Merge with successfully translated file</li>
    </ol>
    
    <h3>Cost Optimization Tips</h3>
    
    <div class="bg-green-50 p-4 rounded mb-4">
      <p class="font-bold">💰 Save Credits:</p>
      <ul>
        <li><strong>Remove duplicates:</strong> De-duplicate listings before upload</li>
        <li><strong>Trim descriptions:</strong> Remove unnecessary fluff from descriptions</li>
        <li><strong>Use cache:</strong> If you re-translate same products, system uses cached translations (free!)</li>
        <li><strong>Selective fields:</strong> Only translate title + description, skip bullet points if word count is tight</li>
      </ul>
    </div>
    
    <h3>API Automation (Scale Plan)</h3>
    <p>For 10,000+ SKU catalogs, use API automation:</p>
    
    <pre class="bg-gray-100 p-4 rounded">
# Python example
import requests

files = ["batch1.csv", "batch2.csv", "batch3.csv"]

for file in files:
    response = requests.post(
        "https://api.shabdly.online/v1/translate",
        headers={"X-API-Key": "your_api_key"},
        files={"file": open(file, "rb")},
        data={"target_languages": ["hi", "ta", "te"]}
    )
    print(f"Job {file}: {response.json()[''job_id'']}")
    </pre>
    
    <h3>Need Help with Large Catalogs?</h3>
    <p>Email us at <a href="mailto:heyshabdly@gmail.com" class="text-blue-600">heyshabdly@gmail.com</a> with:</p>
    <ul>
      <li>Total SKU count</li>
      <li>Target languages</li>
      <li>Monthly translation volume</li>
    </ul>
    <p>We''ll create a custom processing plan and recommend the best approach!</p>
  </div>',
  1
);

-- Continue with remaining articles...
-- (Character limit reached, continuing in next query)
