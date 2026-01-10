# Deployment Guide - Poetry Platform

## 🚀 Quick Start

Your poetry platform is **fully functional** and running locally at:
- **Local URL**: http://localhost:3000
- **Public URL**: https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai

## 🎯 Test the Platform Now

### 1. Access the Platform
Open the public URL in your browser: https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai

### 2. Login as Admin
- Username: `admin`
- Password: `admin123`
- You'll see admin panel access in the navigation

### 3. Explore Features
- ✅ Browse poems in Marathi (मराठी), Hindi (हिंदी), and English
- ✅ Filter by language and sort by newest/popular/top-rated
- ✅ Click any poem to view full content and stats
- ✅ Like and rate poems (1-5 stars)
- ✅ Create new poems in any language
- ✅ Manage your poems from "My Poems" dashboard
- ✅ Admin: Access user management and moderation tools

## 📋 What's Already Working

### ✅ Core Functionality
1. **Authentication System**
   - User registration with terms acceptance
   - Secure JWT-based login
   - Role-based access (Admin/Poet)

2. **Poem Management**
   - Create poems in 3 languages
   - Edit and delete your own poems
   - View count tracking
   - Like system
   - Rating system (1-5 stars)

3. **Public Feed**
   - Filter by language
   - Sort by newest/popular/top-rated
   - Featured poems highlighting
   - Responsive design for mobile/desktop

4. **Admin Dashboard**
   - User management (ban/unban)
   - Content moderation
   - Reports handling
   - Platform statistics
   - Anthology candidate selection

5. **Legal Framework**
   - Terms of Service with anthology rights
   - Terms acceptance tracking
   - Database: /terms page

## 🔄 Next Steps for Production

### Step 1: Deploy to Cloudflare Pages (When Ready)

**Before deployment, you'll need:**
1. Cloudflare account
2. Cloudflare API token (from Deploy tab)

**Deployment commands:**
```bash
# 1. Create production D1 database
npx wrangler d1 create webapp-production

# 2. Update wrangler.jsonc with database_id from above

# 3. Apply migrations to production
npm run db:migrate:prod

# 4. Deploy to Cloudflare Pages
npm run deploy:prod
```

### Step 2: Set Up Payments (Stripe Integration)

**For Featured Poet Subscriptions ($8/month):**
1. Create Stripe account
2. Get API keys (test and live)
3. Add to Cloudflare secrets:
```bash
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name webapp
```

### Step 3: Enable SEO & AdSense

**SEO Optimization:**
- Add meta tags to each poem page
- Create sitemap.xml
- Submit to Google Search Console
- Target keywords: "Marathi kavita", "Hindi shayari"

**Google AdSense:**
- Apply for AdSense account
- Add ad units to feed
- Target: $300/month from 100K views

## 💰 Monetization Roadmap

### Revenue Target: $1,500/month

1. **Featured Poet Subscriptions** - $400/month
   - 50 users × $8/month
   - Homepage spotlight
   - Search highlighting

2. **Google AdSense** - $300/month
   - 100,000 page views/month
   - In-feed ads

3. **Amazon Anthologies** - $300/month
   - Quarterly "Best of" compilations
   - Top 50 poems by rating
   - Sold on Amazon KDP

4. **Sponsored Content** - $500/month
   - 5 brands × $100/month
   - Sponsored poem slots

### Weekend Maintenance (2-3 hours)

**Saturday:**
- Review flagged content (30 mins)
- Ban spammers (15 mins)
- Check server health (15 mins)

**Sunday:**
- Post "Poem of the Week" on social media (30 mins)
- Review subscription payments (15 mins)
- Minor UI tweaks (30 mins)

## 🔐 Default Test Accounts

### Admin Account
- **Username**: admin
- **Email**: admin@poetryplatform.com
- **Password**: admin123
- **Role**: Full admin access

### Sample Poets
All use password: `admin123`

1. **Marathi Poet**
   - Username: marathi_poet
   - Has 2 sample poems in Marathi

2. **Hindi Poet**
   - Username: hindi_poet
   - Has 2 sample poems in Hindi

3. **English Poet**
   - Username: english_poet
   - Has 1 sample poem in English

## 🎨 Customization Options

### Change Site Name
Edit `src/lib/i18n.ts` - update translations for each language

### Modify Colors/Theme
Edit TailwindCSS classes in `src/index.tsx`

### Add New Languages
1. Update database language enum
2. Add translations to `src/lib/i18n.ts`
3. Add language option to forms

## 📊 Database Statistics

Current sample data:
- 4 users (1 admin, 3 poets)
- 5 poems (2 Marathi, 2 Hindi, 1 English)
- All poems have engagement metrics (views, likes, ratings)

## 🛠️ Development Commands

```bash
# Start development server
npm run dev:sandbox
# OR with PM2
pm2 start ecosystem.config.cjs

# Check server status
pm2 list

# View logs
pm2 logs poetry-platform --nostream

# Stop server
pm2 stop poetry-platform

# Reset database (CAUTION: Deletes all data)
npm run db:reset

# Test API endpoints
curl http://localhost:3000/api/poems
curl http://localhost:3000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📧 Support

For technical issues or questions:
- Check README.md for full documentation
- Review API endpoints in README
- Test with curl commands above

## 🎉 Ready to Launch!

Your platform is complete and ready for:
1. ✅ Local testing (currently running)
2. ✅ User acceptance testing
3. ⏳ Cloudflare Pages deployment (when you're ready)
4. ⏳ Stripe integration (for monetization)
5. ⏳ SEO optimization (for traffic)

**Current Status**: Fully functional development version
**Next Phase**: Production deployment & monetization setup

---

**Built with**: Hono + Cloudflare Workers + D1 Database
**Last Updated**: January 10, 2026
