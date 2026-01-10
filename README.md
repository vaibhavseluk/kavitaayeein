# Poetry Platform - Multilingual Poetry Community

A full-featured poetry platform supporting Marathi (मराठी), Hindi (हिंदी), and English, built with Hono framework on Cloudflare Workers and D1 Database.

## 🌟 Project Overview

**Goal**: Create a sustainable poetry ecosystem where poets can share their work, gain visibility, and contribute to paid anthologies while generating passive income through subscriptions and advertisements.

**Target**: $1,500/month passive income with 2-3 hours weekend maintenance

## 🚀 Live URLs

- **Development**: https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai
- **Production**: (Deploy with `npm run deploy:prod`)
- **Terms of Service**: https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai/terms

## ✅ Currently Completed Features

### 1. Core Features
- ✅ **Multilingual Support**: Full UI and content in Marathi, Hindi, and English
- ✅ **User Authentication**: JWT-based login/registration system
- ✅ **Role-Based Access**: Admin and Poet roles with different permissions
- ✅ **Poem CRUD**: Create, read, update, delete poems with rich text support
- ✅ **Public Feed**: Browse poems with language and sort filters
- ✅ **Featured System**: Spotlight for featured poets and poems

### 2. User Features
- ✅ **User Profiles**: Display name, bio, language preference
- ✅ **My Poems Dashboard**: View and manage personal poems
- ✅ **Like & Rate System**: Engage with poems (1-5 star ratings)
- ✅ **View Counter**: Track poem popularity
- ✅ **Draft System**: Save poems as drafts before publishing

### 3. Admin Features
- ✅ **User Management**: View all users, ban/unban accounts
- ✅ **Content Moderation**: Review flagged poems, delete inappropriate content
- ✅ **Reports System**: Handle community reports (spam, adult content, etc.)
- ✅ **Platform Statistics**: Track users, poems, engagement by language
- ✅ **Anthology Management**: Select top-rated poems for anthologies

### 4. Monetization Foundation
- ✅ **Terms of Service**: Legal framework with anthology rights clause
- ✅ **Subscription Schema**: Database ready for Featured Poet subscriptions
- ✅ **Anthology Selection**: Admin tools to curate quarterly anthologies

## 📊 Data Architecture

### Database Services
**Cloudflare D1 (SQLite)** - Primary database for all relational data

### Data Models

#### Users
- Authentication (username, email, password hash)
- Profile (display name, bio, profile picture)
- Role (admin/poet), Status (active/banned)
- Language preference and featured status

#### Poems
- Content (title, body, language)
- Metadata (author, status, created date)
- Engagement (views, likes, ratings)
- Anthology eligibility flag

#### Reports
- Flagged content tracking
- Reason categorization (spam, adult content, hate speech, etc.)
- Review status and admin actions

#### Subscriptions
- Featured Poet plans ($8/month)
- Payment tracking (Stripe/Razorpay)
- Auto-renewal settings

#### Anthology Submissions
- Quarterly edition tracking
- Selection criteria and status

## 🎯 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Create new poet account
- `POST /login` - Authenticate user
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile

### Poems (`/api/poems`)
- `GET /` - List all published poems (public, with filters)
- `GET /:id` - View single poem (increments view count)
- `POST /` - Create new poem (authenticated)
- `PUT /:id` - Update poem (author/admin only)
- `DELETE /:id` - Delete poem (author/admin only)
- `GET /user/me` - Get my poems (authenticated)
- `POST /:id/like` - Like/unlike poem (authenticated)
- `POST /:id/rate` - Rate poem 1-5 stars (authenticated)

### Admin (`/api/admin`)
- `GET /users` - List all users (admin only)
- `PUT /users/:id/status` - Ban/unban user (admin only)
- `GET /reports` - View reported content (admin only)
- `PUT /reports/:id` - Review report and take action (admin only)
- `PUT /poems/:id/flag` - Flag/unflag poem (admin only)
- `GET /stats` - Platform statistics (admin only)
- `GET /anthology/candidates` - Top poems for anthology (admin only)
- `POST /anthology/select` - Mark poems for anthology (admin only)

### Reports (`/api/reports`)
- `POST /` - Submit content report

## 🔧 Technical Stack

- **Frontend**: Vanilla JavaScript + TailwindCSS
- **Backend**: Hono framework (TypeScript)
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: JWT with Web Crypto API
- **Deployment**: Cloudflare Pages/Workers
- **Dev Server**: Wrangler + PM2

## 📝 Features Not Yet Implemented

### Phase 1: Monetization (Priority)
- ⏳ **Stripe/Razorpay Integration**: Payment processing for subscriptions
- ⏳ **Featured Poet Subscription**: $8/month spotlight on homepage
- ⏳ **Auto-renewal System**: Subscription management
- ⏳ **Payment Dashboard**: Track earnings and subscriptions

### Phase 2: Advanced Features
- ⏳ **Rich Text Editor**: Quill.js or CKEditor for formatted poetry
- ⏳ **Image Upload**: Profile pictures via Cloudflare R2
- ⏳ **Search Functionality**: Full-text search for poems and poets
- ⏳ **Social Sharing**: Share poems to Twitter, Facebook, WhatsApp
- ⏳ **Email Notifications**: New followers, likes, featured status

### Phase 3: Anthology Automation
- ⏳ **Automated PDF Generation**: Export selected poems to anthology format
- ⏳ **Amazon KDP Integration**: Auto-publish to Kindle Direct Publishing
- ⏳ **Royalty Tracking**: Track anthology sales and revenue

### Phase 4: Community Features
- ⏳ **Following System**: Follow favorite poets
- ⏳ **Comments**: Discuss poems in threads
- ⏳ **Poetry Contests**: Monthly themed contests
- ⏳ **Badges & Achievements**: Gamification for engagement

## 🚦 Recommended Next Steps

### Weekend 1: Monetization Setup (2-3 hours)
1. **Stripe Integration** (90 mins)
   - Set up Stripe account and API keys
   - Create Featured Poet product ($8/month)
   - Implement subscription checkout flow
   - Test payment webhooks

2. **Featured Poet Display** (60 mins)
   - Homepage carousel for featured poets
   - Automatic featured badge on poems
   - Featured expiry tracking

### Weekend 2: SEO & Discovery (2-3 hours)
1. **SEO Optimization** (90 mins)
   - Meta tags for each poem (title, description, language)
   - Sitemap generation for Google indexing
   - Schema.org markup for poems
   - URL slugs: `/marathi-poetry/poem-title`

2. **Google AdSense** (60 mins)
   - Apply for AdSense account
   - Add in-feed ads (disguised as poem cards)
   - Configure ad placement for max revenue

### Weekend 3: Anthology System (2-3 hours)
1. **Export to Word** (90 mins)
   - Create SQL query for top-rated poems by language
   - Auto-generate Word document with formatting
   - Include poet bio and attribution

2. **Amazon KDP Guide** (60 mins)
   - Document KDP upload process
   - Create anthology cover template
   - Write book description template

## 📈 Monetization Roadmap

### Revenue Streams
1. **Featured Poet Subscriptions**: $400/month (50 users × $8)
2. **Google AdSense**: $300/month (100K page views)
3. **Amazon Anthologies**: $300/month (100 sales × $3 profit)
4. **Sponsored Content**: $500/month (5 brands × $100)

**Total Target**: $1,500/month

### SEO Strategy
- Target keywords: "Marathi kavita", "Hindi shayari", "poetry in Marathi"
- Create poem URLs like: `/marathi-poetry/sunrise-poem`
- Build backlinks from poetry communities
- Submit to Google for indexing

## 🔐 Test Accounts

### Admin Account
- **Username**: `admin`
- **Email**: `admin@poetryplatform.com`
- **Password**: `admin123`
- **Access**: Full platform control

### Sample Poets
1. **Marathi Poet**
   - Username: `marathi_poet`
   - Password: `admin123`

2. **Hindi Poet**
   - Username: `hindi_poet`
   - Password: `admin123`

3. **English Poet**
   - Username: `english_poet`
   - Password: `admin123`

## 🛠️ Local Development

### Setup
```bash
# Install dependencies
npm install

# Apply migrations
npm run db:migrate:local

# Seed database
npm run db:seed

# Build application
npm run build

# Start development server
npm run dev:sandbox
# OR with PM2
pm2 start ecosystem.config.cjs
```

### Testing
```bash
# Test API
curl http://localhost:3000/api/poems

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🚀 Deployment

### To Cloudflare Pages

1. **Create D1 Database** (one-time)
```bash
npx wrangler d1 create webapp-production
# Copy database_id to wrangler.jsonc
```

2. **Apply Migrations**
```bash
npm run db:migrate:prod
```

3. **Deploy**
```bash
npm run deploy:prod
```

4. **Set Secrets** (one-time)
```bash
npx wrangler pages secret put JWT_SECRET --project-name webapp
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name webapp
```

## 📄 Terms of Service - Anthology Rights

**Key Clause**: By publishing poetry on this platform, users grant a **non-exclusive license** to include their poems in paid anthologies.

**What this means**:
- Users retain full copyright ownership
- Platform can compile top-rated poems into "Best of [Month]" anthologies
- Anthologies sold on Amazon KDP for passive income
- Users can still publish poems elsewhere
- Users can opt-out by contacting admin

**Legal Coverage**: Terms acceptance is tracked in database with timestamps

## 📊 Platform Statistics

Current sample data includes:
- 4 users (1 admin, 3 poets)
- 5 poems across 3 languages
- Average rating: 4.5+ stars
- Multilingual content: Marathi, Hindi, English

## 🤝 Contributing

This is a monetization-focused project. Priority contributions:
1. Stripe/Razorpay payment integration
2. SEO optimization and meta tags
3. Amazon KDP export automation
4. Google AdSense optimization

## 📧 Contact

- **Support**: support@poetryplatform.com
- **Terms**: /terms page
- **Admin**: admin@poetryplatform.com

## 📜 License

Copyright © 2026 Poetry Platform. All rights reserved.

**Content License**: User-generated poems remain property of their authors with anthology rights granted to platform.

---

**Last Updated**: January 10, 2026  
**Version**: 1.0.0  
**Status**: ✅ Core features complete, ready for monetization phase
