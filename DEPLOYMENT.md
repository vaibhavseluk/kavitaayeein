# Deployment Guide - Poetry Platform

This guide will help you deploy the Poetry Platform to Cloudflare Pages for production use.

## Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com
2. **Wrangler CLI** - Already installed in the project
3. **API Token** - Configured via the agent or manually

## Step 1: Configure Cloudflare Authentication

### Using Agent (Recommended)
The agent will help you configure authentication:
```bash
# The agent will call setup_cloudflare_api_key
# Follow the prompts to authenticate
```

### Manual Configuration
If you prefer manual setup:
1. Go to Cloudflare Dashboard → API Tokens
2. Create token with:
   - Cloudflare Pages: Edit
   - D1: Edit
   - Workers KV Storage: Edit
3. Copy the token
4. Run: `wrangler login` or set `CLOUDFLARE_API_TOKEN` environment variable

## Step 2: Create Production D1 Database

```bash
# Create the database
wrangler d1 create webapp-production

# Output will show:
# database_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Copy the database_id and update wrangler.jsonc
# Replace "create-with-wrangler-d1-create" with your actual database_id
```

Update `wrangler.jsonc`:
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "your-actual-database-id-here"
    }
  ]
}
```

## Step 3: Apply Database Migrations to Production

```bash
# Apply migrations to production database
npm run db:migrate:prod

# Verify migrations
wrangler d1 execute webapp-production --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## Step 4: (Optional) Seed Production Data

⚠️ **Warning**: Only seed production if you want test data.

```bash
# Create a production seed file without test passwords
# Edit seed.sql or create seed-prod.sql with your admin user

wrangler d1 execute webapp-production --file=./seed.sql
```

For production, you should create your admin user via the registration form instead of seeding.

## Step 5: Create Cloudflare Pages Project

```bash
# Create the project
wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2026-01-10

# Output will show your project URL:
# https://webapp.pages.dev
```

## Step 6: Build and Deploy

```bash
# Build the project
npm run build

# Deploy to production
wrangler pages deploy dist --project-name webapp

# You'll get two URLs:
# - Production: https://webapp.pages.dev
# - Preview: https://[commit-hash].webapp.pages.dev
```

## Step 7: Configure Environment Variables (Secrets)

For future features (payment integration, email, etc.):

```bash
# JWT Secret (important for security)
wrangler pages secret put JWT_SECRET --project-name webapp
# Enter a strong random string (64+ characters)

# Stripe (for payments)
wrangler pages secret put STRIPE_SECRET_KEY --project-name webapp
wrangler pages secret put STRIPE_PUBLISHABLE_KEY --project-name webapp

# Razorpay (alternative payment)
wrangler pages secret put RAZORPAY_KEY_ID --project-name webapp
wrangler pages secret put RAZORPAY_KEY_SECRET --project-name webapp

# List all secrets
wrangler pages secret list --project-name webapp
```

## Step 8: Verify Deployment

```bash
# Test the API
curl https://webapp.pages.dev/api/health

# Should return:
# {"status":"ok","timestamp":"..."}

# Test poems API
curl https://webapp.pages.dev/api/poems

# Should return:
# {"poems":[...]}
```

## Step 9: Create First Admin User

1. Visit your production URL: `https://webapp.pages.dev`
2. Click "Sign Up"
3. Create your admin account
4. Login to verify authentication works

### Manually Set User as Admin (via D1)

If you need to make a user an admin:

```bash
# Get user ID
wrangler d1 execute webapp-production --command="SELECT id, username FROM users;"

# Set user as admin
wrangler d1 execute webapp-production --command="UPDATE users SET role='admin' WHERE id=1;"

# Verify
wrangler d1 execute webapp-production --command="SELECT username, role FROM users WHERE id=1;"
```

## Step 10: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages → webapp → Custom domains
2. Add your domain (e.g., `poetryplatform.com`)
3. Cloudflare will auto-configure DNS if domain is on Cloudflare
4. Wait for SSL certificate provisioning (automatic)

## Continuous Deployment

### GitHub Integration (Recommended)

1. Push code to GitHub
2. Connect Cloudflare Pages to your GitHub repo:
   - Dashboard → Pages → Create → Connect to Git
   - Select repository
   - Build settings:
     - Framework: Vite
     - Build command: `npm run build`
     - Build output: `dist`
3. Auto-deploys on every push to main branch

### Manual Deployments

```bash
# Build and deploy
npm run deploy:prod

# Or separate steps
npm run build
wrangler pages deploy dist --project-name webapp
```

## Monitoring & Maintenance

### Check Logs

```bash
# View deployment logs
wrangler pages deployment tail --project-name webapp

# View analytics
# Go to Cloudflare Dashboard → Pages → webapp → Analytics
```

### Database Maintenance

```bash
# Backup database (export to SQL)
wrangler d1 export webapp-production --output=backup.sql

# Check database size
wrangler d1 info webapp-production

# Run queries
wrangler d1 execute webapp-production --command="SELECT COUNT(*) as poem_count FROM poems;"
```

### Update Migrations

When you add new migrations:

```bash
# 1. Create migration locally
wrangler d1 migrations create webapp-production new_feature

# 2. Edit the migration file
# migrations/000X_new_feature.sql

# 3. Test locally
npm run db:migrate:local

# 4. Deploy to production
npm run db:migrate:prod

# 5. Deploy code
npm run deploy:prod
```

## Troubleshooting

### Issue: "Database not found"
**Solution**: Verify database_id in wrangler.jsonc matches the actual database ID from `wrangler d1 create`

### Issue: "Unauthorized" or "Invalid token"
**Solution**: Re-authenticate with `wrangler login` or check API token permissions

### Issue: "Build failed"
**Solution**: Check that all dependencies are in package.json and run `npm install` before building

### Issue: "Database migrations out of sync"
**Solution**: 
```bash
# Check migration status
wrangler d1 migrations list webapp-production

# Re-apply if needed
npm run db:migrate:prod
```

### Issue: "Site shows old version"
**Solution**: 
- Clear Cloudflare cache
- Wait 2-3 minutes for global propagation
- Check deployment logs for errors

## Performance Optimization

### Enable Caching

Add cache headers for static content (already configured in Hono):

```typescript
// Static files are automatically cached by Cloudflare
// API responses can be cached per route
```

### Monitor Performance

- Cloudflare Analytics → Pages → webapp
- Check Core Web Vitals
- Monitor D1 query performance

## Security Checklist

- ✅ Change JWT_SECRET from default value
- ✅ Enable 2FA on Cloudflare account
- ✅ Restrict API tokens to minimum required permissions
- ✅ Review and approve user registrations
- ✅ Monitor for spam/abuse
- ✅ Regular database backups

## Scaling Considerations

Cloudflare Pages automatically scales, but be aware of limits:

- **D1 Database**: 
  - Free: 5 GB storage, 25 million reads/day
  - Paid: 50 GB storage, 50 million reads/day
  
- **Workers**:
  - Free: 100,000 requests/day
  - Paid: 10 million requests/month

Monitor usage in Cloudflare Dashboard → Analytics.

## Cost Estimate

**Free Tier (Development)**:
- Cloudflare Pages: Free
- D1 Database: Free (5GB)
- Workers: Free (100k req/day)

**Paid Tier (Production with Traffic)**:
- Cloudflare Pages: $0/month (always free)
- Workers: $5/month (10M requests)
- D1: $5/month (50GB storage)
- Custom domain: Varies by registrar

**Total**: ~$10-15/month for serious production use

## Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Create admin user
3. ✅ Seed initial content (poems)
4. ✅ Configure Google Analytics
5. ✅ Set up monitoring/alerts
6. ✅ Implement payment system
7. ✅ Launch marketing campaign

## Support

For deployment issues:
- Cloudflare Docs: https://developers.cloudflare.com/pages
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler
- Community Discord: https://discord.gg/cloudflaredev

---

**Deployment Completed!** 🎉

Your poetry platform is now live and ready to accept users.
