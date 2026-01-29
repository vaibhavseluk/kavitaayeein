-- Seed data for E-commerce Translation Platform

-- Create admin user
INSERT OR IGNORE INTO users (username, email, password, display_name, role, subscription_plan, word_credits, google_id) 
VALUES ('admin', 'admin@shabdly.online', 'admin123', 'Platform Admin', 'admin', 'scale', 999999999, NULL);

-- Create test e-commerce seller accounts
INSERT OR IGNORE INTO users (username, email, password, display_name, role, subscription_plan, word_credits, company_name, phone) 
VALUES 
('seller_demo', 'seller@demo.com', 'demo123', 'Demo Seller', 'user', 'free', 1000, 'Demo E-commerce Store', '+91-9876543210'),
('premium_seller', 'premium@example.com', 'premium123', 'Premium Seller', 'user', 'growth', 100000, 'Premium Products India', '+91-9876543211');

-- Insert knowledge base articles
INSERT INTO knowledge_base (title, slug, content, category, published) VALUES
(
  'Getting Started with Shabdly Translation',
  'getting-started',
  '<h2>Welcome to Shabdly!</h2>
<p>This guide will help you translate your product listings in minutes.</p>

<h3>Step 1: Upload Your File</h3>
<p>Prepare a CSV or Excel file with your product data. Make sure it includes columns like:</p>
<ul>
  <li>Product Name</li>
  <li>Description</li>
  <li>Bullet Points</li>
  <li>Keywords</li>
</ul>

<h3>Step 2: Select Languages</h3>
<p>Choose from 12+ Indian languages including Hindi, Tamil, Telugu, Kannada, Bengali, and more.</p>

<h3>Step 3: Download Results</h3>
<p>Your translated file will maintain the original formatting and be ready to upload to Amazon/Flipkart.</p>

<h3>Pro Tips</h3>
<ul>
  <li>Add your brand names to the "Brand Glossary" to prevent translation</li>
  <li>HTML tags in your descriptions will be preserved</li>
  <li>Start with the free plan to test with 1,000 words</li>
</ul>',
  'getting-started',
  1
),
(
  'How Credits Work',
  'how-credits-work',
  '<h2>Understanding Word Credits</h2>
<p>Shabdly uses a credit-based system where 1 credit = 1 word translated.</p>

<h3>Credit Plans</h3>
<ul>
  <li><strong>Free:</strong> 1,000 credits/month</li>
  <li><strong>Starter ($19/mo):</strong> 10,000 credits/month</li>
  <li><strong>Growth ($49/mo):</strong> 100,000 credits/month</li>
  <li><strong>Scale ($149/mo):</strong> 500,000 credits/month</li>
</ul>

<h3>How Are Credits Calculated?</h3>
<p>If you translate 100 words into 5 languages, you use 500 credits (100 words × 5 languages).</p>

<h3>What Happens When I Run Out?</h3>
<p>Your translation will pause. Simply purchase more credits or upgrade your plan to continue.</p>',
  'billing',
  1
),
(
  'Preserving HTML Tags in Product Descriptions',
  'html-tag-preservation',
  '<h2>HTML Tag Preservation</h2>
<p>Shabdly automatically preserves HTML formatting in your product descriptions.</p>

<h3>Supported Tags</h3>
<ul>
  <li>&lt;b&gt;, &lt;strong&gt; - Bold text</li>
  <li>&lt;i&gt;, &lt;em&gt; - Italic text</li>
  <li>&lt;br&gt; - Line breaks</li>
  <li>&lt;p&gt; - Paragraphs</li>
  <li>&lt;ul&gt;, &lt;li&gt; - Bullet points</li>
</ul>

<h3>Example</h3>
<pre>&lt;b&gt;Premium Quality&lt;/b&gt;&lt;br&gt;Made in India</pre>
<p>Will become:</p>
<pre>&lt;b&gt;प्रीमियम गुणवत्ता&lt;/b&gt;&lt;br&gt;भारत में निर्मित</pre>

<p>The HTML structure remains intact, only the text content is translated.</p>',
  'troubleshooting',
  1
),
(
  'Using the Brand Glossary',
  'brand-glossary',
  '<h2>Brand Glossary Feature</h2>
<p>Protect your brand names and product codes from translation.</p>

<h3>How It Works</h3>
<ol>
  <li>Go to Settings → Brand Glossary</li>
  <li>Add terms you want to "lock" (e.g., "SwiftCook", "iPhone", "SKU-12345")</li>
  <li>These terms will never be translated</li>
</ol>

<h3>Use Cases</h3>
<ul>
  <li>Brand names: "SwiftCook" stays as "SwiftCook"</li>
  <li>Product codes: "SKU-12345" stays as "SKU-12345"</li>
  <li>Trademarked terms: "Bluetooth®" stays as "Bluetooth®"</li>
</ul>

<h3>Available on Growth and Scale plans.</h3>',
  'getting-started',
  1
),
(
  'File Upload Format Guide',
  'file-format-guide',
  '<h2>Preparing Your Files for Upload</h2>
<p>Follow these guidelines for best results.</p>

<h3>Supported Formats</h3>
<ul>
  <li>CSV (.csv)</li>
  <li>Excel (.xlsx, .xls)</li>
</ul>

<h3>Required Structure</h3>
<p>Your file should have headers in the first row:</p>
<pre>
Product Name | Description | Bullet Point 1 | Bullet Point 2 | Keywords
</pre>

<h3>Best Practices</h3>
<ul>
  <li>Use UTF-8 encoding for CSV files</li>
  <li>Keep file size under 10MB</li>
  <li>Maximum 1,000 rows per file</li>
  <li>Avoid merged cells in Excel</li>
</ul>

<h3>What Gets Translated?</h3>
<p>Our system auto-detects text columns and translates them. Numeric columns (price, quantity) are preserved.</p>',
  'getting-started',
  1
);

-- Insert sample translation job for demo
INSERT INTO translation_jobs (user_id, original_filename, status, source_language, target_languages, total_words, words_translated, credits_used, created_at, completed_at)
VALUES 
(2, 'sample_products.csv', 'completed', 'en', '["hi", "ta", "te", "kn", "bn"]', 500, 2500, 2500, datetime('now', '-2 days'), datetime('now', '-2 days'));

-- Insert sample credit purchase
INSERT INTO credit_purchases (user_id, amount_usd, word_credits, stripe_payment_id, status, created_at)
VALUES 
(3, 49.00, 100000, 'pi_test_1234567890', 'completed', datetime('now', '-1 day'));

-- Insert sample brand glossary entries
INSERT INTO brand_glossary (user_id, term, locked, notes)
VALUES 
(2, 'SwiftCook', 1, 'Our brand name - never translate'),
(2, 'iPhone', 1, 'Apple product name'),
(2, 'SKU', 1, 'Keep product codes in English');

-- Initialize admin analytics for current month
INSERT INTO admin_analytics (date, total_revenue, new_users, active_users, words_translated, credits_purchased, jobs_completed, jobs_failed)
VALUES 
(date('now'), 0, 0, 0, 0, 0, 0, 0);
