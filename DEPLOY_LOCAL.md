# Deploy Poetry Platform from Your Local Machine

## ✅ Prerequisites
Your Cloudflare API token is already configured in `.dev.vars` (securely, not committed to git).

## 🚀 Deployment Steps

### 1. Clone the Repository to Your Local Machine
```bash
# Download the project backup or clone from GitHub
git clone https://github.com/YOUR_USERNAME/webapp.git
cd webapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.dev.vars` File Locally
```bash
# Create .dev.vars in the project root with these credentials:
cat > .dev.vars << 'EOF'
# Cloudflare API Token (for deployment only - NEVER expose)
CLOUDFLARE_API_TOKEN=d-5VPMcE8CzFvD5oUJ8QFdymm9-nU7JvCLHu52Z9

# Razorpay Live Credentials
RAZORPAY_KEY_ID=rzp_live_DrOGzKeiQj8VEp
RAZORPAY_KEY_SECRET=dnNVg5eOgolHsPKhcPGqAVsv

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# App Configuration
APP_URL=http://localhost:3000
NODE_ENV=development
EOF
```

### 4. Test Cloudflare Authentication
```bash
# Export the API token
export CLOUDFLARE_API_TOKEN="d-5VPMcE8CzFvD5oUJ8QFdymm9-nU7JvCLHu52Z9"

# Test authentication
npx wrangler whoami
```

You should see your Cloudflare account details.

### 5. Create D1 Production Database
```bash
# Create the database
npx wrangler d1 create webapp-production

# Copy the database_id from the output
# It will look like: database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 6. Update wrangler.jsonc
Edit `wrangler.jsonc` and replace `"database_id": "create-with-wrangler-d1-create"` with your actual database ID:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "webapp",
  "compatibility_date": "2026-01-10",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "YOUR-ACTUAL-DATABASE-ID-HERE"
    }
  ]
}
```

### 7. Run Database Migrations
```bash
# Apply migrations to production database
npx wrangler d1 migrations apply webapp-production
```

### 8. Create Cloudflare Pages Project
```bash
# Create the project (use 'main' as production branch)
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2026-01-10
```

### 9. Build and Deploy
```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name webapp
```

### 10. Set Production Secrets
```bash
# Add Razorpay credentials as secrets
echo "rzp_live_DrOGzKeiQj8VEp" | npx wrangler pages secret put RAZORPAY_KEY_ID --project-name webapp
echo "dnNVg5eOgolHsPKhcPGqAVsv" | npx wrangler pages secret put RAZORPAY_KEY_SECRET --project-name webapp

# Add JWT secret (generate a secure one)
echo "your-production-jwt-secret-minimum-32-characters-long" | npx wrangler pages secret put JWT_SECRET --project-name webapp
```

### 11. Verify Deployment
After deployment, you'll get URLs like:
- **Production**: https://webapp.pages.dev
- **Branch**: https://main.webapp.pages.dev

Test the deployment:
```bash
# Test health endpoint
curl https://webapp.pages.dev/api/health

# Test poems API
curl https://webapp.pages.dev/api/poems
```

## 🎯 Post-Deployment

1. **Create Admin Account**: Use the registration endpoint to create your admin account
2. **Test Razorpay Integration**: Try creating a subscription checkout
3. **Update DNS**: If you have a custom domain, add it via Cloudflare dashboard
4. **Monitor**: Check Cloudflare Pages dashboard for analytics

## 🔒 Security Notes

- ✅ `.dev.vars` is in `.gitignore` - secrets won't be committed
- ✅ Razorpay credentials are stored as Cloudflare secrets
- ✅ API token is only used for deployment
- ✅ JWT secret should be changed in production
- ⚠️ Never expose these credentials in frontend code

## 📚 Additional Resources

- DEPLOYMENT.md - Comprehensive deployment guide
- RAZORPAY_INTEGRATION.md - Razorpay setup details
- MONETIZATION_IMPLEMENTATION.md - Revenue features guide
- README.md - Full project documentation

---

**Your poetry platform is ready to go live! 🚀**
