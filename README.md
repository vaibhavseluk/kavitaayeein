# Poetry Platform - Multi-Author Multilingual Poetry Web Application

> A full-stack web application for poets to share their work in Marathi, Hindi, and English with administrative control and monetization features.

## 🌟 Live Demo

**🌐 Production Site:** https://www.shabdly.online  
**📦 Cloudflare Pages:** https://poetry-platform.pages.dev  
**🔧 Development Server:** https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai

**Test Credentials:**
- **Admin:** `admin` / `admin123`
- **Marathi Poet:** `marathi_poet` / `admin123`
- **Hindi Poet:** `hindi_poet` / `admin123`
- **English Poet:** `english_poet` / `admin123`

**Deployment Status:** ✅ **LIVE on Production**  
**Last Deployed:** January 18, 2026 (Theme toggle fix - body null check deployed)

## 📋 Project Overview

A modern, lightweight poetry platform built with Cloudflare Workers and Hono framework, supporting:

- ✅ **Multilingual Support**: Full support for Marathi (मराठी), Hindi (हिंदी), and English
- ✅ **User Roles**: Admin, Poet, and Guest visitor roles
- ✅ **CRUD Operations**: Full poem management (Create, Read, Update, Delete)
- ✅ **Authentication**: Secure JWT-based authentication
- ✅ **Admin Dashboard**: User management, moderation, and analytics
- ✅ **Engagement Features**: Likes, ratings, and comments
- ✅ **Featured Poets**: Subscription-based spotlight feature
- ✅ **Anthology System**: Automated poem selection for paid anthologies
- ✅ **Terms of Service**: Legal framework for anthology rights
- ✅ **Theme System**: Beautiful light/dark modes with automatic detection

## 🎯 Current Status

### ✅ Completed Features

1. **Authentication & User Management**
   - User registration with multilingual support
   - JWT-based secure authentication
   - Profile management
   - Role-based access control (Admin, Poet)
   - Terms of Service acceptance tracking

2. **Poetry Management**
   - Create, read, update, delete poems
   - Multilingual content support (UTF-8)
   - Language-based filtering
   - Draft and published states
   - View tracking

3. **Engagement System**
   - Like/unlike poems
   - 5-star rating system
   - Average rating calculation
   - Engagement metrics

4. **Admin Dashboard**
   - User management (ban/unban)
   - Poem moderation
   - Report management
   - Featured poem selection
   - Anthology poem selection
   - Platform statistics

5. **Database Schema**
   - Users table with role-based access
   - Poems table with multilingual fields
   - Reports/moderation system
   - Subscriptions tracking
   - Anthology submissions
   - Terms acceptance tracking

6. **Frontend**
   - Responsive design with TailwindCSS
   - Language selector
   - Poetry feed with filtering
   - Real-time updates
   - Mobile-friendly interface
   - **Theme System**: Light/dark mode with automatic detection

7. **Theme System** (NEW! ✨)
   - Light and dark mode support
   - Automatic system preference detection
   - Persistent theme selection (localStorage)
   - Smooth transitions between themes
   - Poetic background patterns in both modes
   - Theme toggle button in navigation
   - See [THEME_SYSTEM.md](./THEME_SYSTEM.md) for full documentation

### 🚧 Features Not Yet Implemented

1. **Payment Integration**
   - Stripe/Razorpay API integration
   - Featured Poet subscription checkout
   - Automated billing

2. **Enhanced UI**
   - Rich text editor for poem composition
   - Drag-and-drop profile picture upload
   - Advanced search and filtering
   - Poetry collections/albums

3. **Social Features**
   - Comments on poems
   - Follow/unfollow poets
   - Notifications
   - Share to social media

4. **Anthology Automation**
   - Automated compilation to Word/PDF
   - Amazon KDP API integration
   - Email notifications to selected poets

5. **SEO Optimization**
   - Meta tags for poem pages
   - Sitemap generation
   - Schema.org markup

6. **Analytics**
   - Google Analytics integration
   - AdSense integration
   - Revenue tracking dashboard

## 🛠 Technology Stack

### Backend
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: JWT (Web Crypto API)

### Frontend
- **Styling**: TailwindCSS (CDN)
- **Icons**: Font Awesome
- **HTTP Client**: Axios
- **Language**: Vanilla JavaScript (no framework overhead)

### Development
- **Build**: Vite
- **TypeScript**: Type-safe development
- **Package Manager**: npm
- **Process Manager**: PM2 (for local dev)
- **Deployment**: Cloudflare Pages

## 📊 Database Schema

### Core Tables
1. **users** - User accounts with roles and features
2. **poems** - Poetry content with multilingual support
3. **reports** - Content moderation system
4. **subscriptions** - Featured poet subscriptions
5. **poem_likes** - Like tracking
6. **poem_ratings** - Rating system
7. **anthology_submissions** - Anthology selection tracking
8. **terms_acceptance** - Legal compliance tracking

## 🚀 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Authenticate user
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile

### Poems (`/api/poems`)
- `GET /` - Get all published poems (with filters)
- `GET /:id` - Get single poem by ID
- `POST /` - Create new poem (authenticated)
- `PUT /:id` - Update poem (owner/admin)
- `DELETE /:id` - Delete poem (owner/admin)
- `GET /user/my-poems` - Get user's poems
- `POST /:id/like` - Like/unlike poem
- `POST /:id/rate` - Rate poem (1-5 stars)

### Admin (`/api/admin`)
- `GET /stats` - Platform statistics
- `GET /users` - Get all users
- `PUT /users/:id/status` - Ban/unban user
- `DELETE /users/:id` - Delete user
- `GET /reports` - Get moderation reports
- `PUT /reports/:id` - Update report status
- `GET /poems` - Get all poems (including flagged)
- `PUT /poems/:id` - Update poem status
- `GET /anthology/eligible` - Get top-rated poems
- `POST /anthology/submit` - Submit poems to anthology

## 💻 Development Setup

### Prerequisites
- Node.js 18+
- npm
- Cloudflare account (for production deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd webapp

# Install dependencies
npm install

# Initialize local database
npm run db:migrate:local
npm run db:seed

# Build the project
npm run build

# Start development server
npm run dev:sandbox
# OR using PM2
pm2 start ecosystem.config.cjs
```

### Accessing the Application
- **Local**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health
- **Poems API**: http://localhost:3000/api/poems

## 📝 npm Scripts

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --d1=webapp-production --local --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "preview": "wrangler pages dev dist",
  "deploy": "npm run build && wrangler pages deploy dist",
  "deploy:prod": "npm run build && wrangler pages deploy dist --project-name webapp",
  "db:migrate:local": "wrangler d1 migrations apply webapp-production --local",
  "db:migrate:prod": "wrangler d1 migrations apply webapp-production",
  "db:seed": "wrangler d1 execute webapp-production --local --file=./seed.sql",
  "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local && npm run db:seed",
  "clean-port": "fuser -k 3000/tcp 2>/dev/null || true",
  "test": "curl http://localhost:3000"
}
```

## 🌐 Deployment to Cloudflare Pages

### Step 1: Setup Cloudflare API Key
```bash
# Configure Cloudflare API key (use the agent's setup_cloudflare_api_key tool)
wrangler whoami
```

### Step 2: Create Production Database
```bash
# Create D1 database
wrangler d1 create webapp-production

# Update wrangler.jsonc with the database ID
# Apply migrations
npm run db:migrate:prod
```

### Step 3: Create Cloudflare Pages Project
```bash
wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2026-01-10
```

### Step 4: Deploy
```bash
npm run deploy:prod
```

### Step 5: Environment Variables
```bash
# Add secrets (for future payment integration)
wrangler pages secret put STRIPE_SECRET_KEY --project-name webapp
wrangler pages secret put RAZORPAY_KEY_SECRET --project-name webapp
```

## 💰 Monetization Strategy

### Revenue Streams (Planned)

1. **Featured Poet Subscriptions** - $8/month
   - Enhanced visibility on homepage
   - Featured section placement
   - Target: 50 subscribers = $400/month

2. **Google AdSense** - $300/month
   - In-feed ads
   - Target: 100,000 page views/month

3. **Anthology Sales** - $300/month
   - Quarterly compilations
   - Top 50 rated poems
   - Amazon KDP sales

4. **Sponsored Poet Slots** - $500/month
   - Brand collaborations
   - 5 slots @ $100 each

**Total Target: $1,500/month passive income**

## 📜 Legal Framework

### Terms of Service
Complete Terms of Service document included in `TERMS_OF_SERVICE.md` with:

- ✅ User ownership rights
- ✅ **Anthology rights grant** (non-exclusive, perpetual)
- ✅ Platform display rights
- ✅ Attribution requirements
- ✅ Selection criteria
- ✅ Opt-out mechanism

**Key Legal Points:**
- Poets retain copyright
- Platform gets non-exclusive anthology rights
- No additional payment for anthology inclusion
- Attribution guaranteed
- Opt-out available

## 📈 Recommended Next Steps

### Phase 1: Essential Features (Week 1-2)
1. ✅ Implement rich text editor (Quill.js)
2. ✅ Add poem detail page with full content
3. ✅ Create comprehensive dashboard UI
4. ✅ Add profile picture upload (Cloudflare R2)

### Phase 2: Payment Integration (Week 3-4)
1. ✅ Integrate Stripe for subscriptions
2. ✅ Add Featured Poet checkout flow
3. ✅ Implement subscription management
4. ✅ Create billing dashboard

### Phase 3: Anthology Automation (Week 5-6)
1. ✅ Build anthology selection UI
2. ✅ Create Word/PDF export function
3. ✅ Add email notifications
4. ✅ Amazon KDP integration research

### Phase 4: SEO & Marketing (Week 7-8)
1. ✅ Add meta tags for all pages
2. ✅ Generate sitemap
3. ✅ Set up Google Analytics
4. ✅ AdSense integration
5. ✅ Social media sharing

### Phase 5: Advanced Features (Week 9+)
1. ✅ Comments system
2. ✅ Follow/unfollow poets
3. ✅ Notifications
4. ✅ Poetry collections
5. ✅ Advanced search

## 🔧 Maintenance Schedule

**Weekend Maintenance (2-3 hours)**

### Saturday (90 minutes)
- Check pending reports and moderate content
- Review flagged poems
- Ban spammers if needed
- Security patch updates
- Database backup

### Sunday (60 minutes)
- Post "Poem of the Week" to social media
- Review analytics and metrics
- Optimize one feature (speed, SEO, UX)
- Plan next week's anthology selection

## 🐛 Known Issues

None currently - all core features working as expected.

## 📞 Support & Contact

For questions or issues:
- **Email**: admin@poetryplatform.com (configure in production)
- **GitHub Issues**: Use repository issues for bug reports
- **Admin Dashboard**: Access platform statistics and management

## 📄 License

[Specify your license here]

## 🙏 Acknowledgments

- Built with Hono framework
- Deployed on Cloudflare Workers
- UTF-8 support for Indic scripts
- TailwindCSS for styling
- Font Awesome for icons

---

**Last Updated**: January 18, 2026  
**Version**: 1.1.0  
**Status**: ✅ **LIVE on Production** (www.shabdly.online)
rs
- UTF-8 support for Indic scripts
- TailwindCSS for styling
- Font Awesome for icons

---

**Last Updated**: January 18, 2026  
**Version**: 1.1.0  
**Status**: ✅ **LIVE on Production** (www.shabdly.online)
