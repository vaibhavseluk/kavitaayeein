# Shabdly - AI-Powered E-commerce Translation Platform

> Transform your product listings into 12+ Indian languages instantly. Built for Amazon, Flipkart, and D2C sellers targeting regional markets.

## 🌐 Live URLs
**Development**: http://localhost:3000  
**Production**: https://www.shabdly.online (pending deployment)

## 📊 Project Status: **60% Complete - Backend Foundation Done**

### ✅ Completed Features
1. **Authentication System**
   - Email/password registration and login
   - Google OAuth one-click sign-up
   - JWT token-based sessions
   - 1,000 free word credits on signup
   - User profile management

2. **Translation Engine** (⭐ UNIQUE FEATURES)
   - OpenAI GPT-4o-mini integration
   - **HTML tag preservation** (`<b>`, `<li>`, `<br>` stay intact)
   - **Brand term protection** (never translates locked words)
   - **Tone presets**: Formal, Bargain/Street, Youth/Slang
   - **Regional shopping slang** (e.g., "Dhamaka Deal", "Keka Offer")
   - Translation caching (10-20% cost savings)
   - Batch processing support

3. **File Processing System**
   - CSV and Excel (.xlsx, .xls) parsing
   - Automatic text column detection
   - Preserves SKUs, prices, IDs
   - Combined output file generation
   - Word count estimation

4. **Database Schema**
   - Users with subscription plans and credits
   - Translation jobs tracking
   - Credit purchases (Lemon Squeezy ready)
   - Brand glossary for locked terms
   - Translation cache for cost optimization
   - Admin analytics tables

5. **Landing Page**
   - Professional design with Tailwind CSS
   - 4-tier pricing ($0, $19, $49, $149)
   - Interactive ROI calculator
   - Feature showcase
   - Trust badges and social proof

### 🚧 In Progress
- Translation routes (file upload, job management)
- Credit management routes
- Lemon Squeezy payment integration (waiting for API keys)

### ⏳ To Be Built
- User dashboard frontend
- Admin dashboard
- Brand glossary management UI
- Email notifications
- AI chatbot support

## 🎯 Supported Languages (12+)
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Kannada (ಕನ್ನಡ)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Odia (ଓଡ଼ିଆ)
- Assamese (অসমীয়া)
- Urdu (اردو)

## 🚀 Technology Stack
**Backend**:
- Hono framework (lightweight, fast)
- Cloudflare Workers (edge runtime)
- Cloudflare D1 (SQLite database)
- OpenAI GPT-4o-mini (translation)

**Frontend**:
- Tailwind CSS (responsive design)
- Vanilla JavaScript (no framework overhead)
- Font Awesome icons

**Integrations**:
- Google OAuth (authentication)
- Lemon Squeezy (payments)
- OpenAI API (translation)

## 💰 Pricing Plans
| Plan | Price | Word Credits | Features |
|------|-------|-------------|----------|
| **Free** | $0/mo | 1,000 words | 5 languages, CSV only |
| **Starter** | $19/mo | 10,000 words | 12 languages, CSV/Excel, Email support |
| **Growth** | $49/mo | 100,000 words | All features + Priority support + Glossary |
| **Scale** | $149/mo | 500,000 words | API access + 24/7 support + Account manager |

**To reach $1,000/month**: Need 21 customers on Growth plan

## 💻 Development Setup

### Prerequisites
- Node.js 18+
- npm
- Cloudflare account

### Installation
```bash
# Clone repository
cd /home/user/webapp

# Install dependencies
npm install

# Setup database
npm run db:migrate:local
npm run db:seed

# Build project
npm run build

# Start development server
npm run clean-port
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000/api/health
```

### Environment Variables
Create `.dev.vars` file (already configured):
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# OpenAI
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o-mini

# Lemon Squeezy (get from vaibhavseluk@gmail.com)
LEMONSQUEEZY_API_KEY=placeholder
LEMONSQUEEZY_STORE_ID=placeholder
LEMONSQUEEZY_WEBHOOK_SECRET=placeholder

# JWT & Admin
JWT_SECRET=your_secret
ADMIN_EMAIL=vaibhavseluk@gmail.com
```

## 📝 Available Scripts
```bash
npm run dev                # Vite dev server
npm run dev:sandbox        # Wrangler dev server
npm run build              # Build for production
npm run db:migrate:local   # Apply database migrations
npm run db:seed            # Seed database with demo data
npm run db:reset           # Reset database completely
npm run clean-port         # Kill process on port 3000
npm run deploy:prod        # Deploy to Cloudflare Pages
```

## 🔌 API Endpoints (Current)

### Authentication
```
POST /api/auth/register          - Register new user
POST /api/auth/login             - Email/password login
GET  /api/auth/google            - Initiate Google OAuth
GET  /api/auth/google/callback   - OAuth callback
GET  /api/auth/me                - Get current user (protected)
PUT  /api/auth/profile           - Update profile (protected)
POST /api/auth/onboarding/progress - Track onboarding
```

### Coming Soon
```
POST /api/translations/upload    - Upload CSV/Excel file
GET  /api/translations/jobs      - List translation jobs
POST /api/translations/translate - Translate single text
GET  /api/credits/balance        - Get credit balance
POST /api/credits/purchase       - Buy credits
POST /api/glossary               - Add brand term
GET  /api/admin/stats            - Platform statistics
```

## 🎨 Unique Features

### 1. Regional Shopping Slang
Standard translation vs Shabdly:
- "Great Deal" → "Dhamaka Deal" (Hindi, Bargain tone)
- "Must Buy" → "Kandippa Vaanganum" (Tamil, Bargain tone)
- "Super Offer" → "Keka Offer" (Telugu, Bargain tone)

### 2. HTML Preservation
```html
Input:  <b>Premium Quality</b><br>Made in India
Output: <b>प्रीमियम गुणवत्ता</b><br>भारत में निर्मित
```
Perfect for Amazon/Flipkart copy-paste!

### 3. Brand Protection
- "SwiftCook" stays "SwiftCook"
- "iPhone" stays "iPhone"
- "SKU-12345" stays "SKU-12345"

### 4. Tone Presets
- **Formal**: Professional language
- **Bargain**: Deal-focused, exciting
- **Youth**: Modern, trendy, Hinglish

## 📈 Revenue Model
**Cost per user** (Growth plan):
- Translation API: ~$5
- Lemon Squeezy fee: ~$1.50
- Total cost: $6.50

**Revenue per user**: $49/month  
**Profit per user**: $42.50 (87% margin)

**At $1,000/month MRR**:
- Costs: ~$80
- Net profit: ~$920 (92%)

## 🔒 Security Features
- JWT authentication
- Password hashing (SHA-256)
- Environment variable storage
- Protected API routes
- CORS configuration
- Input validation

## 📚 Documentation
- `SESSION_SUMMARY.md` - Complete feature overview
- `IMPLEMENTATION_PROGRESS.md` - Development status
- `ECOMMERCE_IMPLEMENTATION.md` - Full roadmap

## 🐛 Known Issues
None currently - backend foundation is stable

## 🚢 Deployment

### Production Deployment to Cloudflare Pages:
```bash
# 1. Apply migrations to production database
npm run db:migrate:prod

# 2. Build and deploy
npm run deploy:prod

# 3. Set environment variables
wrangler pages secret put GOOGLE_CLIENT_ID --project-name webapp
wrangler pages secret put OPENAI_API_KEY --project-name webapp
# ... (repeat for all secrets)
```

## 📞 Support & Contact
**Admin Email**: vaibhavseluk@gmail.com  
**Cost Alerts**: vaibhavseluk@gmail.com  
**GitHub**: [Repository URL]

## 🙏 Acknowledgments
- OpenAI GPT-4o-mini for translation
- Cloudflare Workers for edge computing
- Hono framework for lightweight backend
- Tailwind CSS for beautiful UI

## 📄 License
[Specify your license]

---

**Last Updated**: January 29, 2026  
**Version**: 0.6 (MVP in progress)  
**Status**: 🚧 Backend 70% complete, ready for routes implementation

**Next Session**: Building translation routes, credit management, and Lemon Squeezy integration 🚀
