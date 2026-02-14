# Custom Domain Setup for Shabdly.online

## 🎉 Deployment Status

✅ **E-commerce Translation Platform Deployed**
- **Cloudflare Pages Project**: `shabdly-online`
- **Production URL**: https://54c25b18.shabdly-online.pages.dev
- **Project URL**: https://shabdly-online.pages.dev
- **Deployment Date**: February 14, 2026

## 🌐 Multi-Platform Architecture

### Platform URLs
1. **Main Landing Page**: https://shabdly.online (to be configured)
   - Showcases both platforms
   - Links to Shabdly Translate and HeyShabdly
   
2. **Shabdly Translate**: https://shabdly.online/translate (to be configured)
   - E-commerce translation platform
   - Target: Amazon/Flipkart sellers, D2C brands
   
3. **HeyShabdly**: https://hey.shabdly.online ✅ **LIVE**
   - Career guidance and peer support platform
   - Already configured and operational

## 📋 Custom Domain Configuration Steps

### Step 1: Access Cloudflare Dashboard

1. Log in to your Cloudflare account: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** from the left sidebar
3. Find and click on **shabdly-online** project

### Step 2: Add Custom Domain (Option A - Using Cloudflare Dashboard)

1. In the **shabdly-online** project page, click on the **Custom domains** tab
2. Click **Set up a custom domain** button
3. Enter your domain: `shabdly.online`
4. Click **Continue**
5. Cloudflare will automatically configure DNS if your domain is managed by Cloudflare
6. If not managed by Cloudflare, follow the DNS instructions provided

### Step 3: Add Custom Domain (Option B - Using Wrangler CLI)

```bash
# Navigate to project directory
cd /home/user/webapp

# Add custom domain
npx wrangler pages domain add shabdly.online --project-name shabdly-online

# Verify domain setup
npx wrangler pages domain list --project-name shabdly-online
```

### Step 4: DNS Configuration (If Domain Not on Cloudflare)

If your domain `shabdly.online` is registered with a different provider (GoDaddy, Namecheap, etc.):

1. Log in to your domain registrar
2. Find DNS management section
3. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: @ (or root/blank for apex domain)
   - **Value**: `shabdly-online.pages.dev`
   - **TTL**: 3600 (or Auto)

**Note**: Some registrars don't support CNAME at apex. In that case:
- Use Cloudflare nameservers (recommended)
- Or use A records pointing to Cloudflare IPs (see Cloudflare docs)

### Step 5: DNS Configuration (If Domain on Cloudflare)

If your domain is already using Cloudflare DNS:

1. Go to **DNS** > **Records** in your Cloudflare dashboard
2. Look for existing records for `shabdly.online`
3. If there's an A or CNAME record:
   - **Edit** the existing record
   - Change to CNAME pointing to `shabdly-online.pages.dev`
   - Ensure **Proxy status** is **Proxied** (orange cloud icon)
4. If no record exists:
   - Click **Add record**
   - **Type**: CNAME
   - **Name**: @ (for root domain)
   - **Target**: `shabdly-online.pages.dev`
   - **Proxy status**: Proxied ✅
   - **TTL**: Auto
   - Click **Save**

### Step 6: Verify SSL Certificate

1. Cloudflare automatically provisions an SSL certificate
2. This usually takes 5-15 minutes
3. Check status in **Custom domains** tab
4. Look for **Active** status with a green checkmark

### Step 7: Test Your Domain

Once DNS propagates (5-60 minutes):

```bash
# Test main landing page
curl -I https://shabdly.online

# Test translate page
curl https://shabdly.online/translate | grep "<title>"

# Test dashboard
curl https://shabdly.online/dashboard | grep "<title>"

# Test API health check
curl https://shabdly.online/api/health
```

## 🔄 Current Deployment Details

### Build Information
- **Build Time**: 2.66s
- **Bundle Size**: 665.69 KB
- **Vite Version**: 6.4.1
- **Framework**: Hono
- **Database**: Cloudflare D1 (poetry-platform-production)

### Pages Available
- **/** - Landing page (platform hub)
- **/translate** - E-commerce translation platform
- **/dashboard** - User dashboard
- **/help** - Help center
- **/documentation** - Technical documentation
- **/contact** - Contact page
- **/privacy** - Privacy policy
- **/terms** - Terms of service
- **/faq** - Frequently asked questions

### API Endpoints
- **/api/health** - Health check
- **/api/auth/login** - User login
- **/api/auth/register** - User registration
- **/api/auth/forgot-password** - Password reset request
- **/api/auth/reset-password** - Password reset
- **/api/translations** - Translation endpoints
- **/api/credits** - Credit management
- **/api/glossary** - Brand glossary
- **/api/knowledge** - Knowledge base
- **/api/refunds** - Refund management

## 🔐 Security Features

- ✅ SSL/TLS encryption (automatic via Cloudflare)
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS enabled for API routes
- ✅ Input validation
- ✅ XSS protection
- ✅ Environment variable secrets

## 🌍 Brand Consistency

### Logo
- **File**: `/static/shabdly-logo.png`
- **Size**: 214 KB
- **Dimensions**: 40px height, auto width (max 200px)
- **Design**: Waveform icon with navy blue + orange color scheme

### Color Scheme
- **Primary**: Navy Blue (#1e3a8a)
- **Accent**: Orange (#f97316)
- **Background**: White/Light gray
- **Text**: Dark gray (#374151)

### Typography
- **Font Family**: System fonts (Segoe UI, Roboto, sans-serif)
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, readable sizes

## 📊 Platform Features

### Shabdly Translate (E-commerce)
- ✅ Translate product listings to 12+ Indian languages
- ✅ Preserve HTML formatting
- ✅ Protect brand names with glossary
- ✅ Bulk CSV/Excel translation (500+ products)
- ✅ Regional slang and tone presets
- ✅ Word-credit system (1,000 free words)
- ✅ Pricing plans: $19-$149/month

### HeyShabdly (Career Guidance) - Separate Platform
- ✅ Peer-to-peer career guidance
- ✅ Community-driven support
- ✅ PWA (Progressive Web App)
- ✅ Free platform
- ✅ Live at: https://hey.shabdly.online

## ⚠️ Troubleshooting

### Domain Not Resolving
1. Check DNS propagation: https://dnschecker.org
2. Verify CNAME record is correct: `shabdly-online.pages.dev`
3. Clear your DNS cache: `ipconfig /flushdns` (Windows) or `sudo killall -HUP mDNSResponder` (Mac)
4. Wait up to 48 hours for full global propagation (usually 5-60 minutes)

### SSL Certificate Issues
1. Ensure domain is properly proxied through Cloudflare (orange cloud)
2. Check SSL/TLS encryption mode is set to "Full" or "Full (strict)"
3. Wait 15-30 minutes for certificate provisioning
4. If issues persist, disable and re-enable Universal SSL in Cloudflare dashboard

### 404 Errors on Custom Domain
1. Verify custom domain is added in Cloudflare Pages project settings
2. Check that DNS records point to correct Pages project
3. Ensure production branch is set to `main`
4. Try redeploying: `npx wrangler pages deploy dist --project-name shabdly-online`

### API Endpoints Not Working
1. Check that database bindings are configured in `wrangler.jsonc`
2. Verify environment variables are set in Cloudflare dashboard
3. Check API routes in deployed `_routes.json` file
4. Test with curl: `curl https://shabdly.online/api/health`

## 📞 Support

- **Email**: heyshabdly@gmail.com
- **Documentation**: https://shabdly.online/documentation
- **Help Center**: https://shabdly.online/help

## 🎯 Next Steps After Domain Configuration

1. ✅ Test all pages on https://shabdly.online
2. ✅ Test authentication flows (signup, login, password reset)
3. ✅ Test translation functionality
4. ✅ Test dashboard access
5. ✅ Verify logo and branding consistency
6. ✅ Test responsive design on mobile devices
7. ✅ Set up monitoring and analytics
8. ✅ Configure email notifications (SendGrid)
9. ✅ Set up backup and recovery procedures
10. ✅ Update all documentation with custom domain URLs

## 📝 Deployment History

| Date | Deployment ID | Status | Notes |
|------|--------------|--------|-------|
| Feb 14, 2026 | 54c25b18 | ✅ Live | Initial deployment to shabdly-online |
| Feb 14, 2026 | 1eb51832 | ✅ Live | Previous deployment (poetry-platform) |
| Feb 14, 2026 | 11532a0c | ✅ Live | Logo update deployment |

## 🔗 Related Documentation

- **DNS_CONFIGURATION.md** - Detailed DNS setup guide
- **MULTI_PLATFORM_COMPLETE.md** - Multi-platform architecture overview
- **PRODUCTION_READY.md** - Production deployment checklist
- **LOGO_FIX.md** - Logo optimization details
- **AUTH_KB_IMPLEMENTATION.md** - Authentication and knowledge base implementation

---

**Last Updated**: February 14, 2026  
**Status**: Ready for custom domain configuration  
**Version**: 1.0.0
